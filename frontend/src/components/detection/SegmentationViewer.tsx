import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { demoDetection } from '../../data/demo/detection';
import { Scan } from 'lucide-react';

export const SegmentationViewer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Card
      title="DEEP SEGMENTATION MASK"
      subtitle="Neural network probability contours and dampening extraction"
      headerAction={
        <Badge variant="teal" size="sm">
          {demoDetection.detectionStatus.toUpperCase()}
        </Badge>
      }
      className={className}
    >
      <div className="space-y-4">
        <div className="relative aspect-video w-full rounded bg-seatrace-bg-primary border border-seatrace-border-subtle flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-seatrace-teal/10 border border-seatrace-teal/30 flex items-center justify-center text-seatrace-teal mb-3">
            <Scan className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-seatrace-text-primary tracking-wide">
            Segmentation Mask Viewer
          </h4>
          <p className="text-xs text-seatrace-text-secondary mt-1 max-w-sm">
            Interactive pixel-level mask layer will overlay AI segmentation results with confidence gradient toggles.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="text-[11px] font-mono bg-seatrace-bg-surface px-2.5 py-1 rounded text-seatrace-mint border border-seatrace-border-subtle">
              Total Delineated Area: {demoDetection.area} km²
            </span>
            <span className="text-[11px] font-mono bg-seatrace-bg-surface px-2.5 py-1 rounded text-seatrace-text-secondary border border-seatrace-border-subtle">
              Quality: {demoDetection.imageQuality.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SegmentationViewer;
