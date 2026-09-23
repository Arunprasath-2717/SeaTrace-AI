from typing import Any, Optional, Dict
from fastapi import HTTPException, status


class DomainException(Exception):
    """Base domain exception with message, status code, and optional details."""
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class IncidentNotFoundError(DomainException):
    def __init__(self, incident_id: str):
        super().__init__(
            message=f"Incident with ID '{incident_id}' not found.",
            status_code=status.HTTP_404_NOT_FOUND
        )


class InvalidStateTransitionError(DomainException):
    def __init__(self, current_state: str, target_state: str):
        super().__init__(
            message=f"Cannot transition incident from state '{current_state}' to '{target_state}'.",
            status_code=status.HTTP_409_CONFLICT
        )


class PipelineExecutionError(DomainException):
    def __init__(self, stage: str, reason: str):
        super().__init__(
            message=f"Pipeline failed at stage '{stage}': {reason}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class AuthenticationError(DomainException):
    def __init__(self, detail: str = "Invalid authentication credentials"):
        super().__init__(
            message=detail,
            status_code=status.HTTP_401_UNAUTHORIZED
        )
