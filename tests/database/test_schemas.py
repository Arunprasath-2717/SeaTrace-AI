"""Test Suite for Pydantic v2 Contract Validation and Spatial Schemas.

Validates that schemas reject out-of-spec inputs and serialize GeoJSON correctly.
"""

import pytest
from datetime import datetime, timezone
from pydantic import ValidationError

from sea_trace.database.schemas import (
    IncidentState,
    StageName,
    StageStatus,
    ErrorResponse,
    IncidentCreate,
    SpillCreate,
    DriftRunCreate,
    AISFixCreate,
    EvidenceCreate,
    PointGeometry,
    compute_bounding_box,
    parse_geometry_to_wkb_or_wkt,
)


def test_error_response_structure():
    """Verify Master Contract Section 2 error format {code, message}."""
    err = ErrorResponse(code="OUT_OF_AOI", message="Scene out of bounds")
    assert err.code == "OUT_OF_AOI"
    assert err.message == "Scene out of bounds"
    assert err.model_dump() == {"code": "OUT_OF_AOI", "message": "Scene out of bounds", "details": None}


def test_spill_confidence_validation():
    """Verify confidence must be strictly between 0.0 and 1.0."""
    valid_geom = {
        "type": "MultiPolygon",
        "coordinates": [[[[80.0, 12.0], [80.1, 12.0], [80.1, 12.1], [80.0, 12.1], [80.0, 12.0]]]]
    }

    # Valid confidence
    spill = SpillCreate(
        incident_id="inc-123",
        geom=valid_geom,
        confidence=0.87,
        metrics={"area_sqkm": 1.45},
    )
    assert spill.confidence == 0.87

    # Invalid confidence > 1.0
    with pytest.raises(ValidationError):
        SpillCreate(
            incident_id="inc-123",
            geom=valid_geom,
            confidence=1.5,
        )

    # Invalid confidence < 0.0
    with pytest.raises(ValidationError):
        SpillCreate(
            incident_id="inc-123",
            geom=valid_geom,
            confidence=-0.1,
        )


def test_evidence_validation():
    """Verify evidence rank >= 1, score in [0.0, 1.0], version >= 1."""
    ev = EvidenceCreate(
        incident_id="inc-1",
        mmsi=412345678,
        rank=1,
        score=0.92,
        record={"factors": {"spatial": 0.25}},
        version=1,
    )
    assert ev.rank == 1
    assert ev.score == 0.92

    # Rank 0 is invalid
    with pytest.raises(ValidationError):
        EvidenceCreate(
            incident_id="inc-1",
            mmsi=412345678,
            rank=0,
            score=0.92,
        )


def test_point_geometry_bounds():
    """Verify Point coordinates check valid lon/lat range."""
    # Valid point in Bay of Bengal
    pt = PointGeometry(coordinates=(80.5, 12.5))
    assert pt.coordinates == (80.5, 12.5)

    # Invalid Longitude > 180
    with pytest.raises(ValidationError):
        PointGeometry(coordinates=(195.0, 12.5))

    # Invalid Latitude > 90
    with pytest.raises(ValidationError):
        PointGeometry(coordinates=(80.5, 95.0))


def test_spatial_utilities():
    """Verify bounding box and WKT parsing."""
    poly_geojson = {
        "type": "Polygon",
        "coordinates": [[[80.0, 12.0], [82.0, 12.0], [82.0, 14.0], [80.0, 14.0], [80.0, 12.0]]]
    }
    bbox = compute_bounding_box(poly_geojson)
    assert bbox == (80.0, 12.0, 82.0, 14.0)

    wkt_str = parse_geometry_to_wkb_or_wkt(poly_geojson)
    assert wkt_str.startswith("POLYGON")
