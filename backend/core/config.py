import os
from pathlib import Path
from typing import Dict, Any, Optional
import yaml
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Ocean Trace M2 Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./ocean_trace.db"

    # Security
    SECRET_KEY: str = "ocean-trace-insecure-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Celery & Redis
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    CELERY_TASK_ALWAYS_EAGER: bool = True

    # Scoring configuration path
    SCORING_CONFIG_PATH: str = "config/scoring.yaml"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def load_scoring_weights(self) -> Dict[str, float]:
        """
        Loads and validates scoring weights from SCORING_CONFIG_PATH.
        Enforces that sum of weights equals 1.0 (with slight float tolerance).
        """
        config_path = Path(self.SCORING_CONFIG_PATH)
        if not config_path.is_absolute():
            # Resolve relative to project root (where config/ is located)
            base_dir = Path(__file__).resolve().parent.parent.parent
            config_path = base_dir / self.SCORING_CONFIG_PATH

        if not config_path.exists():
            raise FileNotFoundError(f"Scoring config file not found at: {config_path}")

        with open(config_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)

        if not data or "weights" not in data:
            raise ValueError("Invalid scoring YAML: 'weights' section missing.")

        weights: Dict[str, float] = {k: float(v) for k, v in data["weights"].items()}
        total_weight = sum(weights.values())

        if abs(total_weight - 1.0) > 1e-4:
            raise ValueError(
                f"Invalid scoring weights: sum of weights is {total_weight:.4f}, expected 1.0"
            )

        return weights


settings = Settings()
