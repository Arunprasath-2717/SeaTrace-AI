from datetime import datetime, timedelta
from typing import Dict, Any, List
from backend.integrations.m4_adapter import M4DriftAnalysisAdapter


class MockM4DriftAnalysisAdapter(M4DriftAnalysisAdapter):
    """
    Realistic mock implementation of M4 Backward Drift simulation.
    Simulates reverse trajectory vectors under current/wind forcing.
    """

    def run_drift_simulation(
        self,
        incident_id: str,
        spill_lat: float,
        spill_lon: float,
        spill_time: datetime,
        simulation_hours: int = 24
    ) -> Dict[str, Any]:
        # Origin estimated back in time (e.g. 12 hours earlier, slightly southwest due to current)
        origin_lat = round(spill_lat - 0.030, 5)
        origin_lon = round(spill_lon - 0.030, 5)
        release_window_start = spill_time - timedelta(hours=simulation_hours)
        release_window_end = spill_time - timedelta(hours=2)

        # Generate contour rings representing backward dispersion probability
        features: List[Dict[str, Any]] = []
        for offset_hours, prob, radius_scale in [
            (-6, 0.90, 0.015),
            (-12, 0.75, 0.030),
            (-18, 0.50, 0.045),
            (-24, 0.30, 0.060),
        ]:
            c_lat = round(spill_lat - (0.030 * abs(offset_hours) / 24), 5)
            c_lon = round(spill_lon - (0.030 * abs(offset_hours) / 24), 5)
            
            ring = [
                [round(c_lon - radius_scale, 5), round(c_lat - radius_scale, 5)],
                [round(c_lon + radius_scale, 5), round(c_lat - radius_scale, 5)],
                [round(c_lon + radius_scale, 5), round(c_lat + radius_scale, 5)],
                [round(c_lon - radius_scale, 5), round(c_lat + radius_scale, 5)],
                [round(c_lon - radius_scale, 5), round(c_lat - radius_scale, 5)],
            ]

            features.append({
                "type": "Feature",
                "properties": {
                    "time_offset_hours": offset_hours,
                    "probability_density": prob,
                    "confidence_level": "HIGH" if prob > 0.7 else "MEDIUM"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ring]
                }
            })

        return {
            "simulation_hours": simulation_hours,
            "release_window_start": release_window_start,
            "release_window_end": release_window_end,
            "origin_center_lat": origin_lat,
            "origin_center_lon": origin_lon,
            "contours_geojson": {
                "type": "FeatureCollection",
                "features": features
            },
            "metocean_conditions": {
                "ocean_current_speed_m_s": 0.45,
                "ocean_current_direction_deg": 225.0,
                "wind_speed_knots": 14.5,
                "wind_direction_deg": 210.0,
                "wave_height_m": 1.2
            }
        }
