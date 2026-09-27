import React, { useState } from 'react';
import { useSentinel } from '../../context/SentinelContext';
import { SATELLITE_SCENES } from '../../data/sentinelData';
import {
  Upload,
  Radar,
  Sliders,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  FileCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const SpillDetectionPage: React.FC = () => {
  const { setActivePage, createIncident, showToast } = useSentinel();

  // Inputs
  const [selectedSceneId, setSelectedSceneId] = useState<string>(SATELLITE_SCENES[0].id);
  const [sensorType, setSensorType] = useState<'SAR' | 'EO'>('SAR');
  const [modelType, setModelType] = useState<string>('UNet-ResNet50 C-SAR Segmentation');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(80);
  const [customLat, setCustomLat] = useState<number>(18.52);
  const [customLng, setCustomLng] = useState<number>(71.85);

  // Pipeline simulation state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [detectionComplete, setDetectionComplete] = useState<boolean>(false);

  // Interactive before/after comparison slider position (0-100%)
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const selectedScene =
    SATELLITE_SCENES.find((s) => s.id === selectedSceneId) || SATELLITE_SCENES[0];

  const pipelineSteps = [
    'Satellite orbital SAR raw telemetry ingestion',
    'Radiometric calibration & speckle Lee filtering',
    'Sea-surface background wind normalization',
    'Backscatter reduction feature extraction (σ₀ < -24 dB)',
    'Morphological oil slick contour segmentation',
    'WGS-84 geodesic polygon geometry calculation',
    'Multi-criteria false-positive confidence scoring',
    'Incident dossier generation & GIS publishing',
  ];

  const handleStartDetection = () => {
    setIsProcessing(true);
    setCurrentStep(0);
    setDetectionComplete(false);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < pipelineSteps.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setDetectionComplete(true);
        showToast('SAR segmentation completed: 48.6 km² slick classified.', 'success');
      }
    }, 450);
  };

  const handleSaveToIncidentRegistry = () => {
    createIncident({
      code: `ST-${Math.floor(2054 + Math.random() * 900)}`,
      name: `Detected Slick (${selectedScene.region})`,
      region: 'Arabian Sea',
      lat: customLat,
      lng: customLng,
      estimatedAreaKm2: 48.6,
      detectionTime: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      sensor: 'Sentinel-1 C-SAR',
      confidencePct: 96.4,
      severity: 'Critical',
      status: 'New',
      oilType: 'Heavy Crude Hydrocarbon Residue',
      estimatedVolumeBarrels: 2450,
      closestLandmark: 'Mumbai Offshore Basin',
      coastalDistanceKm: 185,
      assignedInvestigator: 'Unassigned',
      description: 'Auto-detected by UNet-ResNet50 SAR model from Sentinel-1 orbital scene.',
      polygon: [
        [customLat + 0.06, customLng - 0.05],
        [customLat + 0.08, customLng + 0.02],
        [customLat - 0.02, customLng + 0.06],
        [customLat - 0.06, customLng - 0.02],
      ],
      driftDirectionDeg: 68,
      driftSpeedKts: 1.4,
    });
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto select-none bg-[#07111F] text-slate-100 scrollbar-thin">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Radar className="w-5 h-5 text-[#00C2FF]" />
          <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
            AI Oil Spill Detection Studio
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            SAR & OPTICAL INFERENCE
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Ingest raw satellite radar swaths, configure neural segmentation parameters, and run automated oil spill extraction.
        </p>
      </div>

      {/* Main Grid: Parameters Panel (4 cols) & Results Workspace (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Input & Parameters Panel */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col gap-4">
          <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider pb-2 border-b border-[#23364B]">
            Ingestion & Neural Parameters
          </h2>

          {/* Sample Scene Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Select Satellite Scene
            </label>
            <select
              value={selectedSceneId}
              onChange={(e) => setSelectedSceneId(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-[#00C2FF]"
            >
              {SATELLITE_SCENES.map((scene) => (
                <option key={scene.id} value={scene.id}>
                  {scene.name} ({scene.sensor})
                </option>
              ))}
            </select>
          </div>

          {/* Sensor & Model Configuration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Sensor Band
              </label>
              <select
                value={sensorType}
                onChange={(e) => setSensorType(e.target.value as any)}
                className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none"
              >
                <option value="SAR">C-SAR Radar (Active)</option>
                <option value="EO">Multi-Spectral Optical</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Resolution
              </label>
              <input
                type="text"
                readOnly
                value={`${selectedScene.resolutionM}m Pixel Ground`}
                className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-2.5 py-1.5 text-xs text-slate-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Detection Model
            </label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
            >
              <option value="UNet-ResNet50 C-SAR Segmentation">UNet-ResNet50 C-SAR (Recommended)</option>
              <option value="DeepLabV3+ MultiSpectral Sheen">DeepLabV3+ MultiSpectral Sheen</option>
              <option value="MarineDarkNet Fast Vectorizer">MarineDarkNet Fast Vectorizer</option>
            </select>
          </div>

          {/* Confidence Threshold Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300">Confidence Threshold</span>
              <span className="font-mono font-bold text-[#00C2FF]">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
              className="w-full accent-[#00C2FF] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-0.5">
              <span>50% (High Recall)</span>
              <span>95% (High Precision)</span>
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">Center Lat</label>
              <input
                type="number"
                step="0.01"
                value={customLat}
                onChange={(e) => setCustomLat(parseFloat(e.target.value))}
                className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">Center Lng</label>
              <input
                type="number"
                step="0.01"
                value={customLng}
                onChange={(e) => setCustomLng(parseFloat(e.target.value))}
                className="w-full bg-[#07111F] border border-[#23364B] rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Run Inference Button */}
          <button
            onClick={handleStartDetection}
            disabled={isProcessing}
            className={`w-full mt-2 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              isProcessing
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#00C2FF] to-[#14B8A6] text-slate-950 hover:opacity-95 shadow-[#00C2FF]/20'
            }`}
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Processing Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Execute Neural Oil Detection</span>
              </>
            )}
          </button>
        </div>

        {/* Results & Inspection Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Pipeline Step Progress Bar */}
          <div className="p-4 rounded-2xl border border-[#23364B] bg-[#0D1B2A]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono font-bold text-slate-300">
                Pipeline Stage: {isProcessing ? `Step ${currentStep + 1} of 8` : detectionComplete ? 'Completed' : 'Standby'}
              </span>
              <span className="text-[11px] font-mono text-[#00C2FF]">
                {isProcessing ? pipelineSteps[currentStep] : detectionComplete ? 'All 8 filters passed' : 'Ready'}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#07111F] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00C2FF] to-[#14B8A6] transition-all duration-300"
                style={{
                  width: isProcessing
                    ? `${((currentStep + 1) / pipelineSteps.length) * 100}%`
                    : detectionComplete
                    ? '100%'
                    : '0%',
                }}
              />
            </div>
          </div>

          {/* Before-and-After Interactive Split Comparison Slider */}
          <div className="relative h-96 rounded-2xl border border-[#23364B] overflow-hidden bg-[#07111F] group select-none">
            {/* Background 1: Raw Original Satellite Imagery */}
            <div className="absolute inset-0">
              <img
                src={selectedScene.thumbnailUrl}
                alt="Raw satellite"
                className="w-full h-full object-cover filter grayscale contrast-125"
              />
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white font-mono text-[10px] border border-slate-700">
                RAW SAR ORBITAL SWATH
              </span>
            </div>

            {/* Background 2: Segmented AI Oil Slick Mask (Clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img
                src={selectedScene.thumbnailUrl}
                alt="Segmented slick"
                className="w-full h-full object-cover filter contrast-150 brightness-90"
              />
              {/* Synthetic AI Slick Heatmap Overlay */}
              <div className="absolute inset-0 bg-rose-500/25 mix-blend-multiply" />
              <div className="absolute top-1/3 left-1/3 w-48 h-32 rounded-full bg-gradient-to-r from-rose-600/60 to-amber-500/60 blur-md border-2 border-rose-400 shadow-2xl pointer-events-none" />

              <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-rose-950/90 text-rose-300 font-mono text-[10px] border border-rose-700">
                SEGMENTED CRUDE SLICK MASK (48.6 km²)
              </span>
            </div>

            {/* Slider Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center text-xs font-bold">
                ⇄
              </div>
            </div>

            {/* Native Slider Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>

          {/* Detection Results Metrics & Workflow Action Bar */}
          <div className="p-4 rounded-2xl border border-[#23364B] bg-[#0D1B2A] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">Classified Area</span>
                <span className="text-sm font-bold font-mono text-[#00C2FF]">48.6 km²</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">SAR Confidence</span>
                <span className="text-sm font-bold font-mono text-[#14B8A6]">96.4%</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">Est. Volume</span>
                <span className="text-sm font-bold font-mono text-white">2,450 bbls</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">False Positive Risk</span>
                <span className="text-sm font-bold font-mono text-emerald-400">Low (3.6%)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={handleSaveToIncidentRegistry}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Save to Registry</span>
              </button>
              <button
                onClick={() => setActivePage('spill-attribution')}
                className="px-3.5 py-2 rounded-xl bg-[#00C2FF]/20 hover:bg-[#00C2FF]/30 border border-[#00C2FF]/40 text-[#00C2FF] font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>Correlate AIS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
