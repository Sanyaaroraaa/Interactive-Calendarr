import { useRef } from 'react';

export const useDrag = () => {
  const dragStateRef = useRef(null);

  const bindDrag = ({ onMove }) => (event, startPayload) => {
    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current = startPayload;

    const handleMove = (moveEvent) => onMove(moveEvent, dragStateRef.current);
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      dragStateRef.current = null;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  return { bindDrag };
};

