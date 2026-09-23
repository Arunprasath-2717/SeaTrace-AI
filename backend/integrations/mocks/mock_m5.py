from datetime import datetime, timedelta
from typing import List, Dict, Any
from backend.integrations.m5_adapter import M5AISAttributionAdapter


class MockM5AISAttributionAdapter(M5AISAttributionAdapter):
    """
    Realistic mock implementation of M5 AIS Vessel Attribution.
    Returns candidate vessels intersecting the drift simulation envelope.
    """

    def find_candidate_vessels(
        self,
        incident_id: str,
        origin_lat: float,
        origin_lon: float,
        window_start: datetime,
        window_end: datetime,
        search_radius_km: float = 50.0
    ) -> List[Dict[str, Any]]:
        # Primary Suspect: MT PACIFIC VOYAGER (Oil Tanker with AIS gap and high proximity)
        gap_start = window_start + timedelta(hours=6)
        gap_end = gap_start + timedelta(minutes=140)

        candidate_1 = {
            "vessel_name": "MT PACIFIC VOYAGER",
            "mmsi": "352001928",
            "imo": "9384729",
            "vessel_type": "Oil Tanker",
            "flag": "Panama",
            "destination": "Lome Offshore",
            "has_ais_gap": True,
            "ais_gap_duration_minutes": 140,
            "ais_gap_start": gap_start,
            "ais_gap_end": gap_end,
            "min_distance_to_drift_center_km": 1.8,
            "speed_knots_avg": 5.4,
            "speed_anomaly_detected": True,
            "trajectory_geojson": {
                "type": "LineString",
                "coordinates": [
                    [round(origin_lon - 0.15, 4), round(origin_lat - 0.10, 4)],
                    [round(origin_lon - 0.05, 4), round(origin_lat - 0.02, 4)],
                    [round(origin_lon + 0.01, 4), round(origin_lat + 0.01, 4)],
                    [round(origin_lon + 0.12, 4), round(origin_lat + 0.08, 4)],
                ]
            },
            "raw_metadata": {
                "deadweight_tonnage": 105000,
                "length_m": 245,
                "cargo_status": "Laden"
            }
        }

        # Secondary Candidate: CARGO HORIZON (Container Ship crossing periphery, no gap)
        candidate_2 = {
            "vessel_name": "CARGO HORIZON",
            "mmsi": "636018334",
            "imo": "9451128",
            "vessel_type": "Container Ship",
            "flag": "Liberia",
            "destination": "Lagos Port",
            "has_ais_gap": False,
            "ais_gap_duration_minutes": 0,
            "ais_gap_start": None,
            "ais_gap_end": None,
            "min_distance_to_drift_center_km": 28.5,
            "speed_knots_avg": 17.8,
            "speed_anomaly_detected": False,
            "trajectory_geojson": {
                "type": "LineString",
                "coordinates": [
                    [round(origin_lon - 0.40, 4), round(origin_lat + 0.25, 4)],
                    [round(origin_lon, 4), round(origin_lat + 0.28, 4)],
                    [round(origin_lon + 0.40, 4), round(origin_lat + 0.31, 4)],
                ]
            },
            "raw_metadata": {
                "deadweight_tonnage": 65000,
                "length_m": 280,
                "cargo_status": "Containerized"
            }
        }

        # Tertiary Candidate: SEA PATROL 4 (Offshore Supply Vessel, short gap)
        candidate_3 = {
            "vessel_name": "SEA PATROL 4",
            "mmsi": "228394000",
            "imo": "8921133",
            "vessel_type": "Offshore Supply",
            "flag": "France",
            "destination": "Offshore Field B",
            "has_ais_gap": True,
            "ais_gap_duration_minutes": 35,
            "ais_gap_start": window_start + timedelta(hours=2),
            "ais_gap_end": window_start + timedelta(hours=2, minutes=35),
            "min_distance_to_drift_center_km": 14.2,
            "speed_knots_avg": 9.5,
            "speed_anomaly_detected": False,
            "trajectory_geojson": {
                "type": "LineString",
                "coordinates": [
                    [round(origin_lon - 0.20, 4), round(origin_lat - 0.18, 4)],
                    [round(origin_lon - 0.10, 4), round(origin_lat - 0.12, 4)],
                    [round(origin_lon, 4), round(origin_lat - 0.08, 4)],
                ]
            },
            "raw_metadata": {
                "deadweight_tonnage": 4500,
                "length_m": 72,
                "cargo_status": "Deck Cargo"
            }
        }

        return [candidate_1, candidate_2, candidate_3]
