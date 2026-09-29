import { useState } from 'react';
import { Incident } from '../types/incident';
import { CandidateVessel } from '../types/vessel';
import { demoIncidents } from '../data/demo/incidents';
import { demoVessels } from '../data/demo/vessels';
import { PipelineStageId, PipelineStageStatus } from '../config/constants';

export interface StageState {
  id: PipelineStageId;
  status: PipelineStageStatus;
  timestamp?: string;
}

export function useInvestigation(initialIncidentId?: string) {
  const [incidents] = useState<Incident[]>(demoIncidents);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    initialIncidentId || demoIncidents[0]?.id || ''
  );

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || null;

  const [stageStates, setStageStates] = useState<Record<PipelineStageId, PipelineStageStatus>>({
    SATELLITE: 'completed',
    DETECT: 'completed',
    VALIDATE: 'completed',
    RECONSTRUCT: 'completed',
    CORRELATE: 'completed',
    COUNTERFACTUAL: 'processing',
    HUMAN_REVIEW: 'pending',
  });

  const [candidateVessels] = useState<CandidateVessel[]>(demoVessels);
  const [selectedVesselId, setSelectedVesselId] = useState<string>(demoVessels[0]?.id || '');

  const selectedVessel = candidateVessels.find((v) => v.id === selectedVesselId) || null;

  const updateStageStatus = (stageId: PipelineStageId, status: PipelineStageStatus) => {
    setStageStates((prev) => ({ ...prev, [stageId]: status }));
  };

  return {
    incidents,
    selectedIncident,
    selectedIncidentId,
    setSelectedIncidentId,
    stageStates,
    updateStageStatus,
    candidateVessels,
    selectedVessel,
    selectedVesselId,
    setSelectedVesselId,
  };
}

export default useInvestigation;
