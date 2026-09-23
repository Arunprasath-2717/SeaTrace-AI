"""Area of Interest (AOI) Ingestion & Validation (FR-1).

Owned by M3: Nithish (GIS / Database)
Master Contract: v4.1

Enforces strict boundary validation rejecting out-of-AOI satellite scenes (FR-1).
Errors strictly adhere to the contract: { code, message } — never bare strings or stack traces.
"""

from typing import Dict, Any, Optional, Union
import shapely
from shapely.geometry import shape
from sqlalchemy import text
from sqlalchemy.orm import Session

from sea_trace.database.models.entities import Scene, AOI
from sea_trace.database.schemas.contracts import ErrorResponse, SceneCreate
from sea_trace.database.schemas.spatial import parse_geometry_to_wkb_or_wkt


class OutOfAOIError(Exception):
    """Raised when a satellite scene footprint lies completely outside the target AOI (FR-1)."""

    def __init__(self, message: str, aoi_id: Optional[str] = None, scene_id: Optional[str] = None):
        super().__init__(message)
        self.code = "OUT_OF_AOI"
        self.message = message
        self.aoi_id = aoi_id
        self.scene_id = scene_id

    def to_error_response(self) -> ErrorResponse:
        """Serialize into Master Contract Section 2 error object."""
        details = {}
        if self.aoi_id:
            details["aoi_id"] = self.aoi_id
        if self.scene_id:
            details["scene_id"] = self.scene_id
        return ErrorResponse(
            code=self.code,
            message=self.message,
            details=details or None,
        )

    def to_dict(self) -> Dict[str, Any]:
        return self.to_error_response().model_dump()


def check_footprint_intersects_aoi(
    footprint_geom: Union[str, Dict[str, Any], shapely.Geometry],
    aoi_geom: Union[str, Dict[str, Any], shapely.Geometry],
) -> bool:
    """Topological test whether a scene footprint intersects the AOI boundary.

    Both geometries must be in EPSG:4326.
    """
    f_shape = footprint_geom if isinstance(footprint_geom, shapely.Geometry) else shape(footprint_geom) if isinstance(footprint_geom, dict) else shapely.from_wkt(footprint_geom)
    a_shape = aoi_geom if isinstance(aoi_geom, shapely.Geometry) else shape(aoi_geom) if isinstance(aoi_geom, dict) else shapely.from_wkt(aoi_geom)

    return bool(f_shape.intersects(a_shape))


def validate_and_register_scene(
    session: Session,
    scene_data: SceneCreate,
) -> Scene:
    """Validate scene footprint against the designated AOI and insert into the database.

    Raises OutOfAOIError if scene does not intersect the AOI.
    """
    if scene_data.aoi_id:
        aoi = session.query(AOI).filter(AOI.id == scene_data.aoi_id).first()
        if not aoi:
            raise ValueError(f"AOI with id '{scene_data.aoi_id}' not found.")

        # Query PostGIS ST_Intersects directly for spatial accuracy
        footprint_wkt = parse_geometry_to_wkb_or_wkt(scene_data.footprint)
        stmt = text("""
            SELECT ST_Intersects(
                ST_SetSRID(ST_GeomFromText(:footprint_wkt), 4326),
                geom
            ) AS intersects
            FROM aoi
            WHERE id = :aoi_id;
        """)
        result = session.execute(stmt, {"footprint_wkt": footprint_wkt, "aoi_id": scene_data.aoi_id}).scalar()

        if not result:
            raise OutOfAOIError(
                message=f"Scene '{scene_data.id}' footprint does not intersect the target AOI boundary '{scene_data.aoi_id}' (FR-1 violation).",
                aoi_id=scene_data.aoi_id,
                scene_id=scene_data.id,
            )

    footprint_wkt = parse_geometry_to_wkb_or_wkt(scene_data.footprint)
    scene = Scene(
        id=scene_data.id,
        path=scene_data.path,
        acquired_at=scene_data.acquired_at,
        aoi_id=scene_data.aoi_id,
        footprint=f"SRID=4326;{footprint_wkt}",
        metadata_=scene_data.metadata,
    )
    session.add(scene)
    session.commit()
    session.refresh(scene)
    return scene
