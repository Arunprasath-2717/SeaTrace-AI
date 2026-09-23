from abc import ABC, abstractmethod
from typing import List, Dict, Any
from datetime import datetime


class M5AISAttributionAdapter(ABC):
    """
    Abstract interface for M5 AIS / Vessel Attribution module.
    """

    @abstractmethod
    def find_candidate_vessels(
        self,
        incident_id: str,
        origin_lat: float,
        origin_lon: float,
        window_start: datetime,
        window_end: datetime,
        search_radius_km: float = 50.0
    ) -> List[Dict[str, Any]]:
        """
        Queries AIS database within spatiotemporal release envelope.
        Returns list of candidate vessel dictionaries containing:
        - vessel_name: str
        - mmsi: str
        - imo: str
        - vessel_type: str
        - flag: str
        - destination: str
        - has_ais_gap: bool
        - ais_gap_duration_minutes: int
        - ais_gap_start: datetime
        - ais_gap_end: datetime
        - min_distance_to_drift_center_km: float
        - speed_knots_avg: float
        - speed_anomaly_detected: bool
        - trajectory_geojson: dict (GeoJSON LineString)
        - raw_metadata: dict
        """
        pass
