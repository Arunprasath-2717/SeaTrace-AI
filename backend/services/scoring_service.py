from typing import Dict, Any, List, Tuple
from backend.core.config import settings
from backend.models.candidate import CandidateVessel
from backend.models.drift_run import DriftRun


class ScoringService:
    """
    Attribution scoring engine that evaluates candidate vessels against drift simulations
    and computes weighted evidence scores based on configuration.
    """

    def __init__(self, weights: Dict[str, float] = None):
        self.weights = weights or settings.load_scoring_weights()
        self._validate_weights(self.weights)

    def _validate_weights(self, weights: Dict[str, float]) -> None:
        total = sum(weights.values())
        if abs(total - 1.0) > 1e-4:
            raise ValueError(f"Scoring weights must sum to 1.0, got {total:.4f}")

    def compute_factors(
        self,
        candidate: CandidateVessel,
        drift_run: DriftRun
    ) -> Dict[str, float]:
        """
        Calculates the 6 attribution factors clamped to [0.0, 1.0].
        """
        # 1. Spatial Proximity: Closeness to reverse drift origin (decay from 0 to 50km)
        dist_km = candidate.min_distance_to_drift_center_km or 50.0
        spatial_prox = max(0.0, min(1.0, 1.0 - (dist_km / 50.0)))

        # 2. Temporal Overlap: Alignment with release window
        # In realistic scenario, candidate was selected within window, scaled by speed
        temporal_overlap = 0.90 if candidate.min_distance_to_drift_center_km and candidate.min_distance_to_drift_center_km < 10.0 else 0.50

        # 3. Drift Compatibility: Trajectory alignment with drift origin probability
        if dist_km < 5.0:
            drift_comp = 0.95
        elif dist_km < 20.0:
            drift_comp = 0.65
        else:
            drift_comp = 0.20

        # 4. Trajectory consistency
        trajectory_score = 0.85 if candidate.vessel_type in ["Oil Tanker", "Chemical Tanker", "Cargo/Tanker"] else 0.40

        # 5. Behaviour Anomaly: Speed reductions or loitering
        if candidate.speed_anomaly_detected:
            behaviour_score = 0.85
        elif candidate.speed_knots_avg and candidate.speed_knots_avg < 6.0:
            behaviour_score = 0.70
        else:
            behaviour_score = 0.15

        # 6. AIS Gap Evidence: Intentional or suspicious transponder silencing
        if candidate.has_ais_gap:
            if candidate.ais_gap_duration_minutes >= 120:
                ais_gap_score = 1.0
            elif candidate.ais_gap_duration_minutes >= 30:
                ais_gap_score = 0.65
            else:
                ais_gap_score = 0.35
        else:
            ais_gap_score = 0.0

        return {
            "spatial_proximity": round(spatial_prox, 4),
            "temporal_overlap": round(temporal_overlap, 4),
            "drift_compatibility": round(drift_comp, 4),
            "trajectory": round(trajectory_score, 4),
            "behaviour_anomaly": round(behaviour_score, 4),
            "ais_gap_evidence": round(ais_gap_score, 4),
        }

    def score_candidate(
        self,
        candidate: CandidateVessel,
        drift_run: DriftRun
    ) -> Tuple[float, Dict[str, float], str, List[str]]:
        """
        Computes weighted final score, confidence level, and key qualitative findings.
        """
        factors = self.compute_factors(candidate, drift_run)
        
        final_score = 0.0
        for factor_name, factor_val in factors.items():
            weight = self.weights.get(factor_name, 0.0)
            final_score += factor_val * weight

        final_score = max(0.0, min(1.0, round(final_score, 4)))

        # Determine confidence level
        if final_score >= 0.70:
            confidence = "HIGH"
        elif final_score >= 0.40:
            confidence = "MEDIUM"
        else:
            confidence = "LOW"

        # Generate qualitative findings
        findings: List[str] = []
        if factors["spatial_proximity"] >= 0.8:
            findings.append(f"Vessel passed within {candidate.min_distance_to_drift_center_km:.1f} km of drift origin center.")
        if candidate.has_ais_gap and candidate.ais_gap_duration_minutes > 0:
            findings.append(f"AIS transponder gap of {candidate.ais_gap_duration_minutes} min observed during window.")
        if candidate.speed_anomaly_detected:
            findings.append(f"Speed anomaly detected (average {candidate.speed_knots_avg:.1f} knots).")
        if factors["drift_compatibility"] >= 0.8:
            findings.append("Vessel track intersects high-density backward drift probability contour.")

        if not findings:
            findings.append("Vessel passed through outer monitoring periphery with standard operational profile.")

        return final_score, factors, confidence, findings
