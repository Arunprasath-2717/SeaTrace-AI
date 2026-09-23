"""Test Suite for SeaTrace Repository Business Logic & Immutability Rules."""

from unittest.mock import MagicMock
from datetime import datetime, timezone
from sea_trace.database.repository import SeaTraceRepository
from sea_trace.database.models import Incident, Evidence, StageLog


def test_incident_state_transitions():
    """Verify state machine transitions written to stage_log."""
    mock_session = MagicMock()
    repo = SeaTraceRepository(session=mock_session)

    # Mock fetching incident
    inc = Incident(id="inc-test-1", state="CREATED", aoi_id="aoi-bob", versions=[])
    mock_session.get.return_value = inc

    # Transition to DETECTED
    updated = repo.update_incident_state("inc-test-1", "DETECTED")
    assert updated.state == "DETECTED"
    mock_session.commit.assert_called()


def test_stage_log_degraded_reason():
    """Verify degraded stage logging records the reason correctly."""
    mock_session = MagicMock()
    repo = SeaTraceRepository(session=mock_session)

    log = repo.log_stage_transition(
        incident_id="inc-test-1",
        stage="DRIFT_DONE",
        status="DEGRADED",
        engine_version="openoil_v2.4",
        reason="Wind forecast data resolution was coarse (0.5 deg); widened uncertainty contour by 15%",
    )

    assert log.incident_id == "inc-test-1"
    assert log.stage == "DRIFT_DONE"
    assert log.status == "DEGRADED"
    assert "widened uncertainty" in log.reason
    mock_session.add.assert_called_with(log)
    mock_session.commit.assert_called()


def test_evidence_version_increment_immutability():
    """Verify new evidence run increments version rather than overwriting."""
    mock_session = MagicMock()
    repo = SeaTraceRepository(session=mock_session)

    # If existing version is 2, next version must be 3
    mock_session.execute.return_value.scalar.return_value = 2

    ev = repo.record_evidence(
        incident_id="inc-test-1",
        mmsi=412987654,
        rank=1,
        score=0.91,
        record={"counterfactual_iou": 0.88},
    )

    assert ev.version == 3
    assert ev.mmsi == 412987654
    assert ev.score == 0.91
    mock_session.add.assert_called_with(ev)
    mock_session.commit.assert_called()
