"""SeaTrace AI Database Repository Layer.

Owned by M3: Nithish (GIS / Database)
Master Contract: v4.1

High-level interface providing transactional entity operations for all teammate modules.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, func

from sea_trace.database.models.entities import (
    Incident,
    Scene,
    Spill,
    DriftRun,
    AISFix,
    Track,
    Candidate,
    Evidence,
    StageLog,
    Provenance,
    AOI,
)
from sea_trace.database.models.base import utc_now
from sea_trace.database.schemas.spatial import parse_geometry_to_wkb_or_wkt


class SeaTraceRepository:
    """Standard repository class for SeaTrace AI entities."""

    def __init__(self, session: Session):
        self.session = session

    # -------------------------------------------------------------------------
    # Incident & State Machine Operations (M2)
    # -------------------------------------------------------------------------
    def create_incident(
        self,
        incident_id: Optional[str] = None,
        aoi_id: Optional[str] = None,
        initial_state: str = "CREATED",
    ) -> Incident:
        """Create a new incident in CREATED state."""
        inc = Incident(
            id=incident_id if incident_id else None,
            state=initial_state,
            aoi_id=aoi_id,
            versions=[],
        )
        self.session.add(inc)
        self.session.commit()
        self.session.refresh(inc)
        return inc

    def get_incident(self, incident_id: str) -> Optional[Incident]:
        """Fetch incident by ID."""
        return self.session.get(Incident, incident_id)

    def update_incident_state(self, incident_id: str, new_state: str) -> Incident:
        """Transition incident state in the state machine."""
        inc = self.get_incident(incident_id)
        if not inc:
            raise ValueError(f"Incident {incident_id} not found")
        inc.state = new_state
        inc.updated_at = utc_now()
        self.session.commit()
        self.session.refresh(inc)
        return inc

    # -------------------------------------------------------------------------
    # Stage Log Operations (M2)
    # -------------------------------------------------------------------------
    def log_stage_transition(
        self,
        incident_id: str,
        stage: str,
        status: str,
        engine_version: Optional[str] = None,
        reason: Optional[str] = None,
        ended: Optional[datetime] = None,
    ) -> StageLog:
        """Record a pipeline stage transition with optional DEGRADED reason."""
        log_entry = StageLog(
            incident_id=incident_id,
            stage=stage,
            status=status,
            engine_version=engine_version,
            reason=reason,
            started=utc_now(),
            ended=ended,
        )
        self.session.add(log_entry)
        self.session.commit()
        self.session.refresh(log_entry)
        return log_entry

    def get_incident_stage_logs(self, incident_id: str) -> List[StageLog]:
        """Get chronological history of stage executions for an incident."""
        stmt = (
            select(StageLog)
            .where(StageLog.incident_id == incident_id)
            .order_by(StageLog.started.asc())
        )
        return list(self.session.scalars(stmt).all())

    # -------------------------------------------------------------------------
    # Spill Operations (M1)
    # -------------------------------------------------------------------------
    def create_spill(
        self,
        incident_id: str,
        geom_wkt_or_geojson: Any,
        confidence: float,
        metrics: Optional[Dict[str, Any]] = None,
        lookalike: Optional[Dict[str, Any]] = None,
        spill_id: Optional[str] = None,
    ) -> Spill:
        """Persist detected spill multi-polygon and classification metrics."""
        geom_wkt = parse_geometry_to_wkb_or_wkt(geom_wkt_or_geojson)
        spill = Spill(
            id=spill_id if spill_id else None,
            incident_id=incident_id,
            geom=f"SRID=4326;{geom_wkt}",
            confidence=confidence,
            metrics=metrics or {},
            lookalike=lookalike or {},
        )
        self.session.add(spill)
        self.session.commit()
        self.session.refresh(spill)
        return spill

    # -------------------------------------------------------------------------
    # Drift Run Operations (M4)
    # -------------------------------------------------------------------------
    def create_drift_run(
        self,
        incident_id: str,
        drift_type: str,
        contours_wkt_or_geojson: Any,
        window_start: datetime,
        window_end: datetime,
        params: Optional[Dict[str, Any]] = None,
        age_range_min_hours: Optional[float] = None,
        age_range_max_hours: Optional[float] = None,
        run_id: Optional[str] = None,
    ) -> DriftRun:
        """Persist ocean drift run contours and time windows."""
        contours_wkt = parse_geometry_to_wkb_or_wkt(contours_wkt_or_geojson)
        run = DriftRun(
            id=run_id if run_id else None,
            incident_id=incident_id,
            type=drift_type,
            contours=f"SRID=4326;{contours_wkt}",
            window_start=window_start,
            window_end=window_end,
            params=params or {},
            age_range_min_hours=age_range_min_hours,
            age_range_max_hours=age_range_max_hours,
        )
        self.session.add(run)
        self.session.commit()
        self.session.refresh(run)
        return run

    # -------------------------------------------------------------------------
    # AIS Fix Batch Operations (M5)
    # -------------------------------------------------------------------------
    def insert_ais_fixes(self, fixes_data: List[Dict[str, Any]]) -> int:
        """Bulk insert AIS fixes into daily partitioned storage."""
        if not fixes_data:
            return 0

        objs = []
        for fix in fixes_data:
            geom_val = fix["geom"]
            geom_wkt = parse_geometry_to_wkb_or_wkt(geom_val)
            objs.append(
                AISFix(
                    mmsi=fix["mmsi"],
                    ts=fix["ts"],
                    geom=f"SRID=4326;{geom_wkt}",
                    sog=fix.get("sog"),
                    cog=fix.get("cog"),
                    heading=fix.get("heading"),
                    quality=fix.get("quality", {}),
                )
            )
        self.session.bulk_save_objects(objs)
        self.session.commit()
        return len(objs)

    # -------------------------------------------------------------------------
    # Evidence Versioning & Immutability (Joint M2 / M4 / M5)
    # -------------------------------------------------------------------------
    def record_evidence(
        self,
        incident_id: str,
        mmsi: int,
        rank: int,
        score: float,
        record: Dict[str, Any],
        version: Optional[int] = None,
    ) -> Evidence:
        """Save suspect evidence record.

        Enforces Master Contract Section 2:
        - Evidence records are immutable once a run completes.
        - If version is omitted, calculates current max version for incident + 1.
        """
        if version is None:
            # Query max version for this incident
            stmt = select(func.max(Evidence.version)).where(Evidence.incident_id == incident_id)
            current_max = self.session.execute(stmt).scalar()
            version = (current_max or 0) + 1

        ev = Evidence(
            incident_id=incident_id,
            mmsi=mmsi,
            rank=rank,
            score=score,
            record=record,
            version=version,
        )
        self.session.add(ev)
        self.session.commit()
        self.session.refresh(ev)
        return ev

    def get_latest_evidence(self, incident_id: str) -> List[Evidence]:
        """Fetch ranked suspect evidence for the latest version of an incident."""
        stmt = select(func.max(Evidence.version)).where(Evidence.incident_id == incident_id)
        latest_ver = self.session.execute(stmt).scalar()
        if latest_ver is None:
            return []

        query = (
            select(Evidence)
            .where(and_(Evidence.incident_id == incident_id, Evidence.version == latest_ver))
            .order_by(Evidence.rank.asc())
        )
        return list(self.session.scalars(query).all())

    # -------------------------------------------------------------------------
    # Provenance Operations (Each Engine)
    # -------------------------------------------------------------------------
    def record_provenance(
        self,
        run_id: str,
        stage: str,
        model: Optional[str] = None,
        weights_hash: Optional[str] = None,
        dataset: Optional[str] = None,
        config_hash: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Provenance:
        """Store provenance audit record for a stage run."""
        prov = Provenance(
            run_id=run_id,
            stage=stage,
            model=model,
            weights_hash=weights_hash,
            dataset=dataset,
            config_hash=config_hash,
            metadata_=metadata or {},
        )
        self.session.add(prov)
        self.session.commit()
        self.session.refresh(prov)
        return prov
