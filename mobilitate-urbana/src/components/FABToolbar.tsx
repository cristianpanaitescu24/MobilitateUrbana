import React from 'react';
import './FABToolbar.css';

import { LocateFixed, Plus, ZoomIn, ZoomOut } from 'lucide-react';

interface FABToolbarProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onLocate?: () => void;
  onAddPoint?: () => void;
}

const FABToolbar: React.FC<FABToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onLocate,
  onAddPoint,
}) => {
  return (
    <div className="fab-toolbar">
      <button title="Zoom In" onClick={onZoomIn}>🔍➕</button>
      <button title="Zoom Out" onClick={onZoomOut}>🔍➖</button>
      <button title="Locate Me" onClick={onLocate}>📍</button>
      <button title="Add Point" onClick={onAddPoint}>➕</button>
    </div>
  );
};

export default FABToolbar;
