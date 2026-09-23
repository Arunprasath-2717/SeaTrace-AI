"""Test Suite for Local FileStore Manager."""

import pytest
import tempfile
from pathlib import Path
from sea_trace.database.storage import FileStoreManager


def test_filestore_paths_and_hash():
    """Verify file paths and SHA-256 hash calculation."""
    with tempfile.TemporaryDirectory() as tmpdir:
        fs = FileStoreManager(base_dir=tmpdir)
        fs.ensure_directories()

        assert fs.rasters_dir.is_dir()
        assert fs.masks_dir.is_dir()
        assert fs.netcdf_dir.is_dir()
        assert fs.reports_dir.is_dir()

        # Test raster path
        raster_path = fs.get_raster_path("SCENE_20260922")
        assert raster_path == fs.rasters_dir / "SCENE_20260922.tif"

        # Test mask path
        mask_path = fs.get_mask_path("inc-001", "spill-99")
        assert mask_path.parent == fs.masks_dir / "inc-001"
        assert mask_path.name == "spill-99_mask.tif"

        # Test netcdf path
        nc_path = fs.get_netcdf_path("run-hindcast-01")
        assert nc_path == fs.netcdf_dir / "run-hindcast-01.nc"

        # Test file hash calculation
        dummy_file = Path(tmpdir) / "test_sample.bin"
        dummy_file.write_bytes(b"SeaTrace AI Test Data 2026")
        file_hash = fs.compute_file_hash(dummy_file)
        assert isinstance(file_hash, str)
        assert len(file_hash) == 64  # SHA-256 length
