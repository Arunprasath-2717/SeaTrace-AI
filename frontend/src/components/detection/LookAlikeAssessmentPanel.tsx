import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { demoDetection } from '../../data/demo/detection';

export const LookAlikeAssessmentPanel: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Card
      title="RADAR LOOK-ALIKE DISCRIMINATION"
      subtitle="Exclusion of physical phenomena mimicking oil slick radar backscatter damping"
      headerAction={
        <Badge variant="mint" size="sm">
          LOOK-ALIKES RULED OUT
        </Badge>
      }
      className={className}
    >
      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300 font-sans leading-relaxed">
          <strong className="text-slate-950 dark:text-white">Oceanographic Principle: </strong>
          Synthetic Aperture Radar detects oil slicks via surface capillary wave suppression (reduced surface roughness leads to specular reflection away from the radar). However, natural phenomena such as biogenic algal films, calm wind pockets, internal waves, and rain cells also dampen backscatter. SEATRACE systematically evaluates every candidate detection against these look-alike signatures.
        </div>

        <div className="space-y-2.5">
          {demoDetection.lookAlikeAssessment.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs font-mono"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-950 dark:text-white font-sans">
                    {item.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-800 dark:text-slate-300 font-sans leading-relaxed">
                  {item.description}
                </p>
                <div className="text-[11px] text-teal-800 dark:text-teal-400 font-sans pt-0.5">
                  <span className="font-bold text-slate-900 dark:text-slate-200">Physical Basis: </span>
                  {item.physicalBasis}
                </div>
              </div>

              <div className="flex-shrink-0">
                <Badge
                  variant={
                    item.assessment === 'Ruled out'
                      ? 'mint'
                      : item.assessment === 'Low probability'
                      ? 'teal'
                      : 'warning'
                  }
                  size="sm"
                >
                  {item.assessment.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LookAlikeAssessmentPanel;
