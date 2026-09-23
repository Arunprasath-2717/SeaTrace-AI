import math
from datetime import datetime
from typing import Dict, Any
from backend.integrations.m1_adapter import M1SpillDetectionAdapter


class MockM1SpillDetectionAdapter(M1SpillDetectionAdapter):
    """
    Realistic mock implementation of M1 SAR spill detection.
    Generates synthetic GeoJSON polygon around the incident location.
    """

    def detect_spill(
        self,
        incident_id: str,
        lat: float,
        lon: float,
        detected_at: datetime
    ) -> Dict[str, Any]:
        # Generate an irregular slick polygon centered around (lat, lon)
        d_lat = 0.015
        d_lon = 0.020
        coords = [
            [round(lon - d_lon, 5), round(lat - d_lat * 0.5, 5)],
            [round(lon + d_lon * 0.8, 5), round(lat - d_lat * 0.8, 5)],
            [round(lon + d_lon * 1.2, 5), round(lat + d_lat * 0.6, 5)],
            [round(lon - d_lon * 0.2, 5), round(lat + d_lat * 1.1, 5)],
            [round(lon - d_lon, 5), round(lat - d_lat * 0.5, 5)],
        ]

        return {
            "confidence": 0.942,
            "estimated_area_km2": 4.85,
            "thickness_estimate": "MEDIUM_SLICK",
            "polygon_geojson": {
                "type": "Polygon",
                "coordinates": [coords]
            },
            "sar_metadata": {
                "satellite": "Sentinel-1A",
                "sensor_mode": "IW",
                "polarization": "VV/VH",
                "pass_direction": "ASCENDING",
                "resolution_m": 10.0,
                "scene_id": f"S1A_IW_GRDH_1SDV_{detected_at.strftime('%Y%m%d')}_001"
            }
        }
