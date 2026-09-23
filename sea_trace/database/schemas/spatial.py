"""GeoJSON & Spatial Utilities for SeaTrace AI.

Owned by M3: Nithish (GIS / Database)
Master Contract: v4.1
Storage CRS: EPSG:4326 (WGS84 Lon/Lat)
"""

from typing import List, Tuple, Union, Dict, Any, Literal
from pydantic import BaseModel, Field, field_validator
import shapely
from shapely.geometry import shape, mapping
from shapely import wkt, to_geojson


# Coordinate types in EPSG:4326 (Longitude, Latitude)
Position2D = Tuple[float, float]
Position3D = Tuple[float, float, float]
Position = Union[Position2D, Position3D]


class GeoJSONGeometry(BaseModel):
    """Base GeoJSON geometry object with EPSG:4326 validation."""
    type: str

    @classmethod
    def from_shapely(cls, geom: shapely.Geometry) -> "GeoJSONGeometry":
        """Convert a Shapely geometry object into a GeoJSON model."""
        geo_dict = mapping(geom)
        return cls(**geo_dict)

    def to_shapely(self) -> shapely.Geometry:
        """Convert to a Shapely geometry object."""
        return shape(self.model_dump())

    def to_wkt(self) -> str:
        """Convert to Well-Known Text (WKT) string."""
        return wkt.dumps(self.to_shapely())


class PointGeometry(GeoJSONGeometry):
    type: Literal["Point"] = "Point"
    coordinates: Position

    @field_validator("coordinates")
    @classmethod
    def validate_epsg4326(cls, v: Position) -> Position:
        lon, lat = v[0], v[1]
        if not (-180.0 <= lon <= 180.0):
            raise ValueError(f"Longitude {lon} out of EPSG:4326 range [-180, 180]")
        if not (-90.0 <= lat <= 90.0):
            raise ValueError(f"Latitude {lat} out of EPSG:4326 range [-90, 90]")
        return v


class LineStringGeometry(GeoJSONGeometry):
    type: Literal["LineString"] = "LineString"
    coordinates: List[Position]


class PolygonGeometry(GeoJSONGeometry):
    type: Literal["Polygon"] = "Polygon"
    coordinates: List[List[Position]]


class MultiPolygonGeometry(GeoJSONGeometry):
    type: Literal["MultiPolygon"] = "MultiPolygon"
    coordinates: List[List[List[Position]]]


class MultiLineStringGeometry(GeoJSONGeometry):
    type: Literal["MultiLineString"] = "MultiLineString"
    coordinates: List[List[Position]]


class GeoJSONFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    geometry: Dict[str, Any]
    properties: Dict[str, Any] = Field(default_factory=dict)
    id: Union[str, int, None] = None


class GeoJSONFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: List[GeoJSONFeature] = Field(default_factory=list)


def parse_geometry_to_wkb_or_wkt(geom_input: Union[str, Dict[str, Any], shapely.Geometry]) -> str:
    """Parse geometry from WKT string, GeoJSON dictionary, or Shapely object into canonical WKT."""
    if isinstance(geom_input, shapely.Geometry):
        return geom_input.wkt
    if isinstance(geom_input, dict):
        s = shape(geom_input)
        return s.wkt
    if isinstance(geom_input, str):
        # Already WKT or GeoJSON string
        if geom_input.strip().startswith("{"):
            import json
            s = shape(json.loads(geom_input))
            return s.wkt
        return geom_input
    raise ValueError(f"Unsupported geometry input format: {type(geom_input)}")


def compute_bounding_box(geom_input: Union[str, Dict[str, Any], shapely.Geometry]) -> Tuple[float, float, float, float]:
    """Compute (min_lon, min_lat, max_lon, max_lat) in EPSG:4326."""
    if isinstance(geom_input, shapely.Geometry):
        s = geom_input
    elif isinstance(geom_input, dict):
        s = shape(geom_input)
    else:
        s = wkt.loads(geom_input)
    minx, miny, maxx, maxy = s.bounds
    return (float(minx), float(miny), float(maxx), float(maxy))
