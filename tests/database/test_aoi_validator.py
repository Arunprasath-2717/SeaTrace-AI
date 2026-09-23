"""Test Suite for AOI Ingestion & Validation (FR-1)."""

import pytest
from shapely.geometry import Polygon
from sea_trace.database.aoi import (
    OutOfAOIError,
    check_footprint_intersects_aoi,
)


def test_aoi_intersection_true():
    """Verify scene intersecting or inside AOI evaluates to True."""
    # AOI covering Chennai port / Bay of Bengal region
    aoi_poly = Polygon([[80.0, 12.0], [82.0, 12.0], [82.0, 14.0], [80.0, 14.0], [80.0, 12.0]])

    # Scene footprint inside AOI
    scene_inside = Polygon([[80.5, 12.5], [81.5, 12.5], [81.5, 13.5], [80.5, 13.5], [80.5, 12.5]])
    assert check_footprint_intersects_aoi(scene_inside, aoi_poly) is True

    # Scene footprint overlapping edge of AOI
    scene_overlap = Polygon([[79.5, 12.5], [80.5, 12.5], [80.5, 13.5], [79.5, 13.5], [79.5, 12.5]])
    assert check_footprint_intersects_aoi(scene_overlap, aoi_poly) is True


def test_aoi_intersection_false():
    """Verify scene completely outside AOI evaluates to False (FR-1)."""
    aoi_poly = Polygon([[80.0, 12.0], [82.0, 12.0], [82.0, 14.0], [80.0, 14.0], [80.0, 12.0]])

    # Scene far away in Arabian Sea
    scene_outside = Polygon([[70.0, 15.0], [71.0, 15.0], [71.0, 16.0], [70.0, 16.0], [70.0, 15.0]])
    assert check_footprint_intersects_aoi(scene_outside, aoi_poly) is False


def test_out_of_aoi_error_contract():
    """Verify OutOfAOIError adheres strictly to Master Contract Section 2 error shape."""
    err = OutOfAOIError(
        message="Scene footprint outside Bay of Bengal AOI",
        aoi_id="aoi-bob-1",
        scene_id="S1A_IW_GRDH_1SDV_20260922",
    )
    err_dict = err.to_dict()
    assert err_dict["code"] == "OUT_OF_AOI"
    assert "Scene footprint outside" in err_dict["message"]
    assert err_dict["details"]["aoi_id"] == "aoi-bob-1"
    assert err_dict["details"]["scene_id"] == "S1A_IW_GRDH_1SDV_20260922"
