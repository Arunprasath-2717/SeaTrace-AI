import React, { useState } from 'react';
import {
  Satellite,
  X,
  Play,
  CheckCircle2,
  RefreshCw,
  Globe,
} from 'lucide-react';
import type { OilSpillIncident } from '../../types/intelligence';


interface DetectionStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNewIncident: (newIncident: OilSpillIncident) => void;
  onFlyToNewIncident: (incident: OilSpillIncident) => void;
}

export const DetectionStudioModal: React.FC<DetectionStudioModalProps> = ({
  isOpen,
  onClose,
  onAddNewIncident,
  onFlyToNewIncident,
}) => {
  const [selectedSensor, setSelectedSensor] = useState('Sentinel-1 SAR (C-Band VV)');
  const [selectedScene, setSelectedScene] = useState('scene-arabian-sea');
  const [thresholdDb, setThresholdDb] = useState(-18.5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [detectionComplete, setDetectionComplete] = useState(false);
  const [createdIncident, setCreatedIncident] = useState<OilSpillIncident | null>(null);

  if (!isOpen) return null;

  const SAMPLES = [
    {
      id: 'scene-arabian-sea',
      name: 'Arabian Sea — Mumbai Offshore Corridor',
      sensor: 'Sentinel-1B C-SAR (VV)',
      date: '2026-09-26 06:42 UTC',
      lat: 18.52,
      lng: 71.85,
      preview: 'linear-gradient(135deg, #071526 0%, #030a16 50%, #0c233c 100%)',
    },
    {
      id: 'scene-gulf-mannar',
      name: 'Gulf of Mannar — IMBL Protected Zone',
      sensor: 'RADARSAT-2 Ultra-Fine',
      date: '2026-09-26 04:15 UTC',
      lat: 9.12,
      lng: 79.45,
      preview: 'linear-gradient(135deg, #041a24 0%, #020d14 50%, #0a2f42 100%)',
    },
    {
      id: 'scene-bay-bengal',
      name: 'Bay of Bengal — Paradip Tanker Route',
      sensor: 'Sentinel-1A SAR (VV+VH)',
      date: '2026-09-25 23:30 UTC',
      lat: 19.85,
      lng: 87.20,
      preview: 'linear-gradient(135deg, #051829 0%, #020b14 50%, #092844 100%)',
    },
  ];

  const handleRunDetection = () => {
    setIsProcessing(true);
    setDetectionComplete(false);

    // Realistic multi-stage pipeline simulation
    setProcessingStep('1/4: Radiometric calibration & Lee speckle filtering...');
    setTimeout(() => {
      setProcessingStep('2/4: CFAR Dark-patch segmentation (-18.5 dB threshold)...');
      setTimeout(() => {
        setProcessingStep('3/4: Marghany damping ratio & wind gradient analysis...');
        setTimeout(() => {
          setProcessingStep('4/4: DeepLabV3+ ResNet-101 Maritime Spill Classification...');
          setTimeout(() => {
            setIsProcessing(false);
            setDetectionComplete(true);

            // Create simulated new verified incident
            const currentScene = SAMPLES.find((s) => s.id === selectedScene) || SAMPLES[0];
            const newInc: OilSpillIncident = {
              id: `inc-live-${Date.now()}`,
              code: `ST-${Math.floor(2050 + Math.random() * 50)}`,
              name: `SAR Detections — ${currentScene.name}`,
              region: currentScene.name,
              lat: currentScene.lat,
              lng: currentScene.lng,
              estimatedAreaKm2: 52.3,
              detectionTime: new Date().toISOString(),
              satelliteSensor: selectedSensor,
              sensorBand: 'C-Band VV Polarization',
              resolutionM: 10,
              confidencePct: 97.4,
              severity: 'Critical',
              status: 'Active Alert',
              oilType: 'Crude Oil Heavy Distillate',
              estimatedVolumeBarrels: 2640,
              coastalThreatDistanceKm: 165,
              closestLandmark: 'Konkan Coastline / Mumbai Channel',
              description: 'Real-time verified high damping dark polygon detected with severe wave attenuation typical of unrefined petroleum slick.',
              slickPolygon: [
                [currentScene.lng - 0.08, currentScene.lat + 0.05],
                [currentScene.lng - 0.02, currentScene.lat + 0.09],
                [currentScene.lng + 0.06, currentScene.lat + 0.07],
                [currentScene.lng + 0.11, currentScene.lat - 0.01],
                [currentScene.lng + 0.08, currentScene.lat - 0.08],
                [currentScene.lng - 0.03, currentScene.lat - 0.07],
                [currentScene.lng - 0.08, currentScene.lat + 0.05],
              ],
              internalHeatmapRings: [
                [
                  [currentScene.lng - 0.03, currentScene.lat + 0.02],
                  [currentScene.lng + 0.04, currentScene.lat + 0.03],
                  [currentScene.lng + 0.05, currentScene.lat - 0.03],
                  [currentScene.lng - 0.01, currentScene.lat - 0.03],
                  [currentScene.lng - 0.03, currentScene.lat + 0.02],
                ]
              ],
              probableOrigin: {
                lat: currentScene.lat + 0.12,
                lng: currentScene.lng - 0.18,
                estimatedTime: '2026-09-26T01:30:00Z',
                uncertaintyRadiusKm: 4.5,
              },
              backwardDriftTrajectory: [
                [currentScene.lng, currentScene.lat],
                [currentScene.lng - 0.06, currentScene.lat + 0.04],
                [currentScene.lng - 0.12, currentScene.lat + 0.08],
                [currentScene.lng - 0.18, currentScene.lat + 0.12],
              ],
              forwardDriftForecast: [
                {
                  hoursOffset: 12,
                  timestamp: '2026-09-26T18:42:00Z',
                  centerLat: currentScene.lat - 0.15,
                  centerLng: currentScene.lng + 0.25,
                  areaKm2: 84.0,
                  windSpeedKts: 20.0,
                  windDirDeg: 255,
                  currentSpeedKts: 1.4,
                  currentDirDeg: 75,
                  slickPolygon: [
                    [currentScene.lng + 0.15, currentScene.lat - 0.08],
                    [currentScene.lng + 0.28, currentScene.lat - 0.06],
                    [currentScene.lng + 0.35, currentScene.lat - 0.16],
                    [currentScene.lng + 0.26, currentScene.lat - 0.22],
                    [currentScene.lng + 0.15, currentScene.lat - 0.08],
                  ]
                }
              ],
              metOcean: {
                windSpeedKts: 19.0,
                windDirectionDeg: 250,
                currentSpeedKts: 1.3,
                currentDirectionDeg: 70,
                seaSurfaceTempC: 28.5,
                waveHeightM: 1.5,
              },
              candidates: []
            };

            setCreatedIncident(newInc);
            onAddNewIncident(newInc);
          }, 800);
        }, 700);
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#030712]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="hud-panel w-full max-w-4xl rounded-2xl border border-[#1e293b] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#0b1220]/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#00d4ff]/15 border border-[#00d4ff]/50 text-[#00d4ff]">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold font-mono text-[#f8fafc] uppercase tracking-wider">
                  Satellite SAR Spill Detection Studio
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30">
                  AI DeepLabV3+
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] font-mono">
                Synthetic Aperture Radar (SAR) Dark Patch Capillary Damping Segmentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#f8fafc] p-1.5 rounded-lg hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono">
          {/* Left Column: Scene & Sensor Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#94a3b8] mb-1.5 font-bold">
                Select Satellite Scene
              </label>
              <div className="space-y-2">
                {SAMPLES.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => {
                      setSelectedScene(sample.id);
                      setDetectionComplete(false);
                    }}
                    className={`p-2.5 rounded-lg border cursor-pointer text-xs transition-all ${
                      selectedScene === sample.id
                        ? 'border-[#00d4ff] bg-[#00d4ff]/15 text-[#f8fafc]'
                        : 'border-[#1e293b] bg-[#0b1220]/60 text-[#94a3b8] hover:border-[#334155]'
                    }`}
                  >
                    <div className="font-bold text-[#f8fafc] truncate">{sample.name}</div>
                    <div className="text-[10px] text-[#00d4ff] mt-0.5">{sample.sensor}</div>
                    <div className="text-[10px] text-[#64748b]">{sample.date}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94a3b8] mb-1.5 font-bold">
                Sensor Constellation
              </label>
              <select
                value={selectedSensor}
                onChange={(e) => setSelectedSensor(e.target.value)}
                className="w-full bg-[#0b1220] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-[#f8fafc] focus:outline-none focus:border-[#00d4ff]"
              >
                <option>Sentinel-1 SAR (C-Band VV)</option>
                <option>Sentinel-1 SAR (C-Band VV+VH Dual-Pol)</option>
                <option>RADARSAT-2 Wide Ultra-Fine (HH)</option>
                <option>Sentinel-2 MSI Optical (SWIR / NIR)</option>
                <option>ALOS-2 PALSAR-2 (L-Band)</option>
              </select>
            </div>

            {/* Threshold Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-[#94a3b8] uppercase font-bold">Backscatter Threshold</span>
                <span className="text-[#00d4ff] font-bold">{thresholdDb} dB</span>
              </div>
              <input
                type="range"
                min="-28"
                max="-10"
                step="0.5"
                value={thresholdDb}
                onChange={(e) => setThresholdDb(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#00d4ff]"
              />
              <span className="text-[10px] text-[#64748b] block mt-1">
                Damping ratio calibration for ocean surface backscatter
              </span>
            </div>

            {/* Action Button */}
            <button
              onClick={handleRunDetection}
              disabled={isProcessing}
              className={`w-full py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center space-x-2 ${
                isProcessing
                  ? 'bg-[#1e293b] text-[#94a3b8] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#00d4ff] to-[#14b8a6] text-[#030712] hover:opacity-90 shadow-[0_0_15px_rgba(0,212,255,0.4)]'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Neural Mask...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run AI Spill Detection</span>
                </>
              )}
            </button>

            <div className="text-[10px] text-[#64748b] border-t border-[#1e293b] pt-2">
              Note: Automated satellite SAR simulation pipeline for Hackathon demonstration.
            </div>
          </div>

          {/* Center & Right Columns: Interactive Satellite Viewport & Forensics Output */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            {/* Viewport Box */}
            <div className="relative h-64 rounded-xl border border-[#1e293b] bg-[#030712] overflow-hidden flex items-center justify-center">
              {/* Synthetic Radar Noise & Slick Representation */}
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background:
                    'radial-gradient(circle at 55% 45%, rgba(0, 212, 255, 0.08) 0%, transparent 60%), repeating-radial-gradient(circle, rgba(255,255,255,0.02) 0px, transparent 2px, transparent 6px)',
                }}
              />

              {/* Synthetic irregular oil slick silhouette */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-6">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Radar grid coordinates */}
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#1e293b" strokeDasharray="4,4" />
                  <line x1="200" y1="0" x2="200" y2="200" stroke="#1e293b" strokeDasharray="4,4" />

                  {/* Ocean backscatter baseline */}
                  <rect x="20" y="20" width="360" height="160" fill="none" stroke="#00d4ff" strokeOpacity="0.2" />

                  {/* Detected slick geometry */}
                  {detectionComplete ? (
                    <g className="animate-in zoom-in-95 duration-500">
                      {/* Outer slick boundary */}
                      <path
                        d="M 120,95 Q 160,65 210,80 T 290,110 Q 270,145 220,135 T 140,125 Z"
                        fill="rgba(255, 77, 77, 0.35)"
                        stroke="#ff4d4d"
                        strokeWidth="2.5"
                      />
                      {/* High-intensity slick core */}
                      <path
                        d="M 170,90 Q 200,82 235,95 T 215,120 Q 185,115 170,90 Z"
                        fill="rgba(220, 38, 38, 0.75)"
                        stroke="#ef4444"
                        strokeWidth="2"
                      />
                      {/* Radar detection crosshairs */}
                      <circle cx="205" cy="100" r="14" fill="none" stroke="#00d4ff" strokeDasharray="3,3" />
                      <text x="225" y="95" fill="#00d4ff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        DARK PATCH PEAK: -21.4 dB
                      </text>
                      <text x="225" y="110" fill="#ff4d4d" fontSize="10" fontFamily="monospace">
                        CONFIDENCE: 97.4%
                      </text>
                    </g>
                  ) : (
                    <g>
                      <path
                        d="M 120,95 Q 160,65 210,80 T 290,110 Q 270,145 220,135 T 140,125 Z"
                        fill="rgba(15, 23, 42, 0.6)"
                        stroke="#334155"
                        strokeWidth="1.5"
                        strokeDasharray="4,4"
                      />
                      <text x="200" y="105" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="monospace">
                        {isProcessing ? processingStep : 'Click "Run AI Spill Detection" to process imagery'}
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Sensor HUD Stamp */}
              <div className="absolute top-3 left-3 text-[10px] text-[#94a3b8] bg-[#0b1220]/90 px-2 py-1 rounded border border-[#1e293b]">
                POL: VV • RES: 10m • ORBIT: DESCENDING
              </div>
            </div>

            {/* Results Grid when detection is complete */}
            {detectionComplete && createdIncident ? (
              <div className="hud-panel p-4 rounded-xl border border-[#ff4d4d]/50 bg-[#00d4ff]/5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1e293b]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    <span className="font-bold text-[#f8fafc] text-sm">
                      NEW OIL SPILL INCIDENT VERIFIED: {createdIncident.code}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#ff4d4d]/20 text-[#ff4d4d] border border-[#ff4d4d]/40 font-bold">
                    CRITICAL ALERT
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs mb-4">
                  <div className="bg-[#0b1220] p-2 rounded border border-[#1e293b]">
                    <span className="text-[10px] text-[#94a3b8] block">SLICK AREA</span>
                    <span className="text-base font-bold text-[#f8fafc]">
                      {createdIncident.estimatedAreaKm2} km²
                    </span>
                  </div>
                  <div className="bg-[#0b1220] p-2 rounded border border-[#1e293b]">
                    <span className="text-[10px] text-[#94a3b8] block">EST. VOLUME</span>
                    <span className="text-base font-bold text-[#fbbf24]">
                      {createdIncident.estimatedVolumeBarrels} BBL
                    </span>
                  </div>
                  <div className="bg-[#0b1220] p-2 rounded border border-[#1e293b]">
                    <span className="text-[10px] text-[#94a3b8] block">CLASSIFIER</span>
                    <span className="text-base font-bold text-[#00d4ff]">
                      {createdIncident.confidencePct}%
                    </span>
                  </div>
                  <div className="bg-[#0b1220] p-2 rounded border border-[#1e293b]">
                    <span className="text-[10px] text-[#94a3b8] block">COAST DISTANCE</span>
                    <span className="text-base font-bold text-[#f8fafc]">
                      {createdIncident.coastalThreatDistanceKm} KM
                    </span>
                  </div>
                </div>

                {/* Primary Action: Fly to 3D Globe */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      onFlyToNewIncident(createdIncident);
                      onClose();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#14b8a6] text-[#030712] font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-[0_0_15px_rgba(0,212,255,0.4)] flex items-center justify-center space-x-2"
                  >
                    <Globe className="w-4 h-4" />
                    <span>View on 3D Earth Globe</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] text-xs font-bold uppercase transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
