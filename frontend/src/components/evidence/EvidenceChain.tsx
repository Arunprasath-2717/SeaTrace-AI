import React from 'react';
import { Evidence } from '../../types/evidence';
import { EvidenceItem } from './EvidenceItem';

export interface EvidenceChainProps {
  items: Evidence[];
  selectedId?: string;
  onSelectItem?: (id: string) => void;
  className?: string;
}

export const EvidenceChain: React.FC<EvidenceChainProps> = ({
  items,
  selectedId,
  onSelectItem,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <EvidenceItem
          key={item.id}
          evidence={item}
          isSelected={item.id === selectedId}
          onSelect={() => onSelectItem?.(item.id)}
        />
      ))}
    </div>
  );
};

export default EvidenceChain;
