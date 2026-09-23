from enum import Enum
from typing import Set, Dict, List
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from backend.core.errors import InvalidStateTransitionError


class IncidentState(str, Enum):
    CREATED = "CREATED"
    DETECTED = "DETECTED"
    DRIFT_DONE = "DRIFT_DONE"
    AIS_FILTERED = "AIS_FILTERED"
    SCORED = "SCORED"
    REPORT_READY = "REPORT_READY"
    FAILED = "FAILED"


# Valid state transitions mapping
VALID_TRANSITIONS: Dict[IncidentState, Set[IncidentState]] = {
    IncidentState.CREATED: {IncidentState.DETECTED, IncidentState.FAILED},
    IncidentState.DETECTED: {IncidentState.DRIFT_DONE, IncidentState.FAILED},
    IncidentState.DRIFT_DONE: {IncidentState.AIS_FILTERED, IncidentState.FAILED},
    IncidentState.AIS_FILTERED: {IncidentState.SCORED, IncidentState.FAILED},
    IncidentState.SCORED: {IncidentState.REPORT_READY, IncidentState.FAILED},
    IncidentState.REPORT_READY: {IncidentState.CREATED, IncidentState.DETECTED},  # Allow re-run if forced
    IncidentState.FAILED: {IncidentState.CREATED, IncidentState.DETECTED},         # Allow retry
}

# Pipeline stages progression order
STAGE_PROGRESSION: List[IncidentState] = [
    IncidentState.CREATED,
    IncidentState.DETECTED,
    IncidentState.DRIFT_DONE,
    IncidentState.AIS_FILTERED,
    IncidentState.SCORED,
    IncidentState.REPORT_READY,
]


class IncidentStateMachine:
    """
    Manages incident lifecycle state transitions and validates rules.
    """

    @staticmethod
    def can_transition(current: IncidentState, target: IncidentState) -> bool:
        allowed = VALID_TRANSITIONS.get(current, set())
        return target in allowed

    @classmethod
    def transition(
        cls,
        current: IncidentState,
        target: IncidentState,
        allow_force: bool = False
    ) -> IncidentState:
        if current == target:
            return current

        if not allow_force and not cls.can_transition(current, target):
            raise InvalidStateTransitionError(
                current_state=current.value,
                target_state=target.value
            )

        return target

    @classmethod
    def get_progress_percentage(cls, current: IncidentState) -> int:
        if current == IncidentState.FAILED:
            return 0
        try:
            idx = STAGE_PROGRESSION.index(current)
            return int((idx / (len(STAGE_PROGRESSION) - 1)) * 100)
        except ValueError:
            return 0
