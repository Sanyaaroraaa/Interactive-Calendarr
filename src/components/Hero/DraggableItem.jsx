import React from 'react';

const DraggableItem = ({ imageState, onMouseDown, onSelect, isActive }) => {
  if (!imageState) return null;
  return (
    <img
      src={imageState.src}
      alt="canvas upload"
      className={`canvas-upload-image ${isActive ? 'active-image' : ''}`}
      style={{
        width: `${imageState.width}px`,
        left: `${imageState.x}px`,
        top: `${imageState.y}px`,
        transform: `rotate(${imageState.rotation || 0}deg)`,
      }}
      onMouseDown={onMouseDown}
      onClick={onSelect}
    />
  );
};

export default DraggableItem;

