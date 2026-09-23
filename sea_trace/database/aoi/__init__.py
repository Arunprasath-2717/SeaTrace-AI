"""SeaTrace AI AOI Module Export."""

from sea_trace.database.aoi.validator import (
    OutOfAOIError,
    check_footprint_intersects_aoi,
    validate_and_register_scene,
)

__all__ = [
    "OutOfAOIError",
    "check_footprint_intersects_aoi",
    "validate_and_register_scene",
]
