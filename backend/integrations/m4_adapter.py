from abc import ABC, abstractmethod
from typing import Dict, Any
from datetime import datetime


class M4DriftAnalysisAdapter(ABC):
    """
    Abstract interface for M4 Drift Analysis module.
    """

    @abstractmethod
    def run_drift_simulation(
        self,
        incident_id: str,
        spill_lat: float,
        spill_lon: float,
        spill_time: datetime,
        simulation_hours: int = 24
    ) -> Dict[str, Any]:
        """
        Runs backward drift simulation using oceanic and atmospheric vectors.
        Returns dictionary containing:
        - simulation_hours: int
        - release_window_start: datetime
        - release_window_end: datetime
        - origin_center_lat: float
        - origin_center_lon: float
        - contours_geojson: dict (GeoJSON FeatureCollection)
        - metocean_conditions: dict
        """
        pass
