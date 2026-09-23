import pytest
from backend.core.state_machine import IncidentStateMachine, IncidentState
from backend.core.errors import InvalidStateTransitionError


def test_valid_forward_transitions():
    assert IncidentStateMachine.can_transition(IncidentState.CREATED, IncidentState.DETECTED) is True
    assert IncidentStateMachine.can_transition(IncidentState.DETECTED, IncidentState.DRIFT_DONE) is True
    assert IncidentStateMachine.can_transition(IncidentState.DRIFT_DONE, IncidentState.AIS_FILTERED) is True
    assert IncidentStateMachine.can_transition(IncidentState.AIS_FILTERED, IncidentState.SCORED) is True
    assert IncidentStateMachine.can_transition(IncidentState.SCORED, IncidentState.REPORT_READY) is True


def test_illegal_skip_transitions():
    assert IncidentStateMachine.can_transition(IncidentState.CREATED, IncidentState.SCORED) is False
    assert IncidentStateMachine.can_transition(IncidentState.DETECTED, IncidentState.REPORT_READY) is False

    with pytest.raises(InvalidStateTransitionError):
        IncidentStateMachine.transition(IncidentState.CREATED, IncidentState.SCORED)


def test_failure_transitions():
    assert IncidentStateMachine.can_transition(IncidentState.DETECTED, IncidentState.FAILED) is True
    assert IncidentStateMachine.can_transition(IncidentState.AIS_FILTERED, IncidentState.FAILED) is True


def test_progress_percentages():
    assert IncidentStateMachine.get_progress_percentage(IncidentState.CREATED) == 0
    assert IncidentStateMachine.get_progress_percentage(IncidentState.DETECTED) == 20
    assert IncidentStateMachine.get_progress_percentage(IncidentState.REPORT_READY) == 100
