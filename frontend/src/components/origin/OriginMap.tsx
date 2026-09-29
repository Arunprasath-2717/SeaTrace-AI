import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { MapContainer } from '../maps/MapContainer';
import { demoOrigin } from '../../data/demo/origin';

export const OriginMap: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Card
      title="BACKWARD DRIFT TRAJECTORY MAP"
      subtitle="Lagrangian hydrodynamic reverse trajectory modeling"
      headerAction={
        <Badge variant="mint" size="sm">
          CONVERGENCE: {(demoOrigin.ensemble.convergenceRate * 100).toFixed(0)}%
        </Badge>
      }
      className={className}
      padding="none"
    >
      <div className="h-[460px] w-full relative">
        <MapContainer
          initialView={{
            center: [demoOrigin.probableZone.longitude, demoOrigin.probableZone.latitude],
            zoom: 9,
          }}
          showControls={true}
          showLayerControl={true}
        />
      </div>
    </Card>
  );
};

export default OriginMap;
