import React, { useState } from 'react';
import { Card } from '../common/Card';
import { demoDetection } from '../../data/demo/detection';
import { Info } from 'lucide-react';

export const ModelMetrics: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [selectedModel, setSelectedModel] = useState<'unet' | 'segformer'>('unet');

  const modelInfo = demoDetection.models[selectedModel];

  return (
    <Card
      title="DETECTION MODEL COMPARISON & BENCHMARKS"
      subtitle="Evaluation architecture and quantitative verification benchmarks"
      headerAction={
        <div className="flex items-center gap-1 bg-seatrace-bg-surface p-1 rounded border border-seatrace-border-subtle">
          <button
            onClick={() => setSelectedModel('unet')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors uppercase ${
              selectedModel === 'unet'
                ? 'bg-seatrace-teal text-seatrace-bg-primary font-bold'
                : 'text-seatrace-text-secondary hover:text-seatrace-text-primary'
            }`}
          >
            U-Net
          </button>
          <button
            onClick={() => setSelectedModel('segformer')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors uppercase ${
              selectedModel === 'segformer'
                ? 'bg-seatrace-teal text-seatrace-bg-primary font-bold'
                : 'text-seatrace-text-secondary hover:text-seatrace-text-primary'
            }`}
          >
            SegFormer
          </button>
        </div>
      }
      className={className}
    >
      <div className="space-y-4">
        {/* Model Spec Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-seatrace-bg-surface rounded-lg border border-seatrace-border-subtle">
            <span className="text-[10px] text-seatrace-text-muted uppercase block mb-1">Architecture</span>
            <span className="text-seatrace-text-primary font-semibold">{modelInfo.name}</span>
            <span className="text-[10px] text-seatrace-text-muted block mt-0.5">{modelInfo.backbone}</span>
          </div>

          <div className="p-3 bg-seatrace-bg-surface rounded-lg border border-seatrace-border-subtle">
            <span className="text-[10px] text-slate-700 font-bold uppercase block mb-1">Parameter Count</span>
            <span className="text-teal-700 font-bold">{modelInfo.parameters}</span>
            <span className="text-[10px] text-slate-600 font-medium block mt-0.5">Float32 weights</span>
          </div>

          <div className="p-3 bg-seatrace-bg-surface rounded-lg border border-seatrace-border-subtle">
            <span className="text-[10px] text-slate-700 font-bold uppercase block mb-1">Evaluation Status</span>
            <span className="text-amber-800 font-bold">{modelInfo.metrics.evaluationStatus}</span>
            <span className="text-[10px] text-slate-600 font-medium block mt-0.5">Awaiting in-situ ground truth</span>
          </div>
        </div>

        {/* Evaluation Metrics Table */}
        <div className="overflow-x-auto rounded-lg border border-seatrace-border-subtle bg-seatrace-bg-surface/60">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 border-b border-slate-200 text-[10px] text-slate-800 font-black uppercase">
              <tr>
                <th className="px-4 py-2.5">Scientific Metric</th>
                <th className="px-4 py-2.5">Theoretical Definition</th>
                <th className="px-4 py-2.5 text-right">Benchmark Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-seatrace-border-subtle text-[11px]">
              <tr>
                <td className="px-4 py-2.5 font-bold text-slate-900">Intersection over Union (IoU)</td>
                <td className="px-4 py-2.5 text-slate-700 font-medium">Spatial overlap between detected polygon and ground-truth slick</td>
                <td className="px-4 py-2.5 text-right text-amber-800 font-bold">{modelInfo.metrics.iou}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-bold text-slate-900">Dice Coefficient (F1)</td>
                <td className="px-4 py-2.5 text-slate-700 font-medium">Harmonic mean of precision and recall over segmented pixel mask</td>
                <td className="px-4 py-2.5 text-right text-amber-800 font-bold">{modelInfo.metrics.dice}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-bold text-slate-900">Precision (Slick Identification)</td>
                <td className="px-4 py-2.5 text-slate-700 font-medium">True positive pixels vs total predicted positive pixels</td>
                <td className="px-4 py-2.5 text-right text-amber-800 font-bold">{modelInfo.metrics.precision}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-bold text-slate-900">Recall (Thin Sheen Sensitivity)</td>
                <td className="px-4 py-2.5 text-slate-700 font-medium">Proportion of actual ground-truth slick pixels detected</td>
                <td className="px-4 py-2.5 text-right text-amber-800 font-bold">{modelInfo.metrics.recall}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-bold text-slate-900">Inference Execution Time</td>
                <td className="px-4 py-2.5 text-slate-700 font-medium">Forward pass latency per 1024x1024 SAR tile on reference worker</td>
                <td className="px-4 py-2.5 text-right text-amber-800 font-bold">{modelInfo.metrics.inferenceTimeMs}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Non-Fabrication Notice */}
        <div className="flex items-start gap-2 p-3 rounded bg-amber-50 border border-amber-300 text-xs text-amber-950 font-sans">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700" />
          <p className="leading-relaxed">
            <strong>Scientific Rigor Policy:</strong> SEATRACE does not display synthetic or estimated evaluation figures as measured metrics. Formal benchmark metrics remain marked as <em>Pending evaluation</em> until validated against peer-reviewed maritime datasets (e.g. CleanSeaNet and EMSA validation corpora).
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ModelMetrics;
