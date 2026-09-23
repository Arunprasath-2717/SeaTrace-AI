from abc import ABC, abstractmethod
from typing import Dict, Any
from datetime import datetime


class M1SpillDetectionAdapter(ABC):
    """
    Abstract interface for M1 Spill Detection module.
    """

    @abstractmethod
    def detect_spill(
        self,
        incident_id: str,
        lat: float,
        lon: float,
        detected_at: datetime
    ) -> Dict[str, Any]:
        """
        Executes SAR oil spill segmentation and extraction.
        Returns dictionary containing:
        - confidence: float
        - estimated_area_km2: float
        - thickness_estimate: str
        - polygon_geojson: dict (GeoJSON Polygon)
        - sar_metadata: dict
        """
        pass
