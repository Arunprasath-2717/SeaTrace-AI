"""Local File Store Manager for Heavy Rasters, Masks, and NetCDF Datasets.

Owned by M3: Nithish (GIS / Database)
Master Contract: v4.1

Enforces Section 3 of the Master Contract:
- "Rasters and NetCDF files NEVER travel through Redis queue or Postgres tables."
- "Only relative or canonical absolute filesystem paths and hashes are persisted in the database."
"""

import os
import hashlib
from pathlib import Path
from typing import Optional, Union

from sea_trace.database.config import settings


class FileStoreManager:
    """Manages file organization, path resolution, and SHA-256 caching keys."""

    def __init__(self, base_dir: Optional[Union[str, Path]] = None):
        self.base_dir = Path(base_dir) if base_dir else settings.base_data_dir
        self.rasters_dir = self.base_dir / "rasters"
        self.masks_dir = self.base_dir / "masks"
        self.netcdf_dir = self.base_dir / "netcdf"
        self.reports_dir = self.base_dir / "reports"

    def ensure_directories(self) -> None:
        """Create standard storage subdirectories if they do not exist."""
        for d in [self.rasters_dir, self.masks_dir, self.netcdf_dir, self.reports_dir]:
            d.mkdir(parents=True, exist_ok=True)

    def get_raster_path(self, scene_id: str, ext: str = ".tif") -> Path:
        """Generate structured path for satellite GeoTIFF raster."""
        clean_ext = ext if ext.startswith(".") else f".{ext}"
        return self.rasters_dir / f"{scene_id}{clean_ext}"

    def get_mask_path(self, incident_id: str, spill_id: str, ext: str = ".tif") -> Path:
        """Generate structured path for segmented spill mask."""
        clean_ext = ext if ext.startswith(".") else f".{ext}"
        incident_folder = self.masks_dir / incident_id
        incident_folder.mkdir(parents=True, exist_ok=True)
        return incident_folder / f"{spill_id}_mask{clean_ext}"

    def get_netcdf_path(self, run_id: str, ext: str = ".nc") -> Path:
        """Generate structured path for hydrodynamic / drift NetCDF grid."""
        clean_ext = ext if ext.startswith(".") else f".{ext}"
        return self.netcdf_dir / f"{run_id}{clean_ext}"

    def get_report_path(self, incident_id: str, ext: str = ".pdf") -> Path:
        """Generate structured path for finalized incident report."""
        clean_ext = ext if ext.startswith(".") else f".{ext}"
        return self.reports_dir / f"incident_{incident_id}_report{clean_ext}"

    @staticmethod
    def compute_file_hash(filepath: Union[str, Path], chunk_size: int = 65536) -> str:
        """Compute SHA-256 hash of a file on disk for provenance and cache keys."""
        path = Path(filepath)
        if not path.is_file():
            raise FileNotFoundError(f"File not found for hashing: {path}")

        sha256 = hashlib.sha256()
        with open(path, "rb") as f:
            for block in iter(lambda: f.read(chunk_size), b""):
                sha256.update(block)
        return sha256.hexdigest()

    @staticmethod
    def file_exists(filepath: Union[str, Path]) -> bool:
        """Check if referenced file actually exists on the filesystem."""
        return Path(filepath).is_file()


# Default singleton instance
filestore = FileStoreManager()
