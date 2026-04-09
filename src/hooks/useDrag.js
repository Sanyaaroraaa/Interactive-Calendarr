import { useRef } from 'react';

export const useDrag = () => {
  const dragStateRef = useRef(null);

  const getClientPoint = (event) => {
    if ('clientX' in event && 'clientY' in event) {
      return { x: event.clientX, y: event.clientY };
    }
    const touch = event.touches?.[0] || event.changedTouches?.[0];
    return touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const bindDrag = ({ onMove }) => (event, startPayload) => {
    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current = startPayload;

    const handleMove = (moveEvent) => {
      const point = getClientPoint(moveEvent);
      if (!point) return;
      onMove(point, dragStateRef.current, moveEvent);
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
      window.removeEventListener('touchcancel', handleUp);
      dragStateRef.current = null;
    };

    if (window.PointerEvent) {
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleUp);
      return;
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    window.addEventListener('touchcancel', handleUp);
  };

  return { bindDrag };
};
