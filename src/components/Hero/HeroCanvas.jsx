import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { DOODLE_PALETTE } from '../../utils/constants';
import { useDrag } from '../../hooks/useDrag';
import DraggableItem from './DraggableItem';
import './hero.css';

const defaultScene = {
  images: [],
  bubble: { x: -15, y: -10 },
  doodle: { x: 8, y: 42 },
  holiday: { x: null, y: null },
};

const normalizeScene = (raw, monthKey) => {
  if (!raw) return defaultScene;
  if (raw.src) {
    return {
      ...defaultScene,
      images: [{ ...raw, id: `legacy-${monthKey}` }],
    };
  }
  return {
    images: raw.images || [],
    bubble: raw.bubble || defaultScene.bubble,
    doodle: raw.doodle || defaultScene.doodle,
    holiday: raw.holiday || defaultScene.holiday,
  };
};

const HeroCanvas = () => {
  const {
    months,
    currentMonthIndex,
    holidays,
    doodleColors,
    setDoodleColors,
    brushColor,
    setBrushColor,
    brushTool,
    setBrushTool,
    brushSize,
    eraserSize,
    setBrushSize,
    setEraserSize,
    monthInput,
    yearInput,
    setMonthInput,
    setYearInput,
    commitMonthYearChange,
    monthKey,
    canvasSnapshots,
    setCanvasSnapshots,
    canvasImageByMonth,
    setCanvasImageByMonth,
  } = useAppContext();

  const drawCanvasRef = useRef(null);
  const canvasSpaceRef = useRef(null);
  const wrapperRef = useRef(null);
  const bubbleRef = useRef(null);
  const doodleRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const { bindDrag } = useDrag();

  const monthData = months[currentMonthIndex];
  const currentHolidays = holidays[currentMonthIndex] || [];
  const scene = useMemo(() => normalizeScene(canvasImageByMonth[monthKey], monthKey), [canvasImageByMonth, monthKey]);
  const selectedImage = scene.images.find((img) => img.id === selectedImageId) || scene.images.at(-1) || null;
  const canDraw = brushTool === 'brush' || brushTool === 'eraser';
  const activeToolSize = brushTool === 'eraser' ? eraserSize : brushSize;

  useEffect(() => {
    if (!scene.images.length) {
      setSelectedImageId(null);
      return;
    }
    if (!scene.images.some((img) => img.id === selectedImageId)) {
      setSelectedImageId(scene.images[scene.images.length - 1].id);
    }
  }, [scene.images, selectedImageId]);

  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width);
    canvas.height = Math.floor(rect.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const snapshot = canvasSnapshots[monthKey];
    if (!snapshot) return;
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.src = snapshot;
  }, [canvasSnapshots, monthKey]);

  const updateScene = (updater) => {
    setCanvasImageByMonth((prev) => {
      const normalized = normalizeScene(prev[monthKey], monthKey);
      return { ...prev, [monthKey]: updater(normalized) };
    });
  };

  const getClientPoint = (event) => {
    if ('clientX' in event && 'clientY' in event) {
      return { x: event.clientX, y: event.clientY };
    }
    const touch = event.touches?.[0] || event.changedTouches?.[0];
    return touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const getCanvasPoint = (event) => {
    const point = getClientPoint(event);
    if (!point) return null;
    const rect = drawCanvasRef.current.getBoundingClientRect();
    return { x: point.x - rect.left, y: point.y - rect.top };
  };

  const clampToRect = (value, min, max) => Math.min(Math.max(value, min), max);

  const clampElementPosition = (x, y, containerRect, itemRect) => {
    if (!containerRect || !itemRect) return { x, y };
    return {
      x: clampToRect(x, 0, Math.max(0, containerRect.width - itemRect.width)),
      y: clampToRect(y, 0, Math.max(0, containerRect.height - itemRect.height)),
    };
  };

  const beginDraw = (event) => {
    if (!canDraw) return;
    event.preventDefault();
    isDrawingRef.current = true;
    lastPointRef.current = getCanvasPoint(event);
  };

  const draw = (event) => {
    if (!canDraw || !isDrawingRef.current) return;
    event.preventDefault();
    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const p = getCanvasPoint(event);
    if (!p) return;
    const prev = lastPointRef.current || p;
    const doodleRect = doodleRef.current?.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    if (doodleRect) {
      const insidePrev =
        prev.x >= doodleRect.left - canvasRect.left &&
        prev.x <= doodleRect.right - canvasRect.left &&
        prev.y >= doodleRect.top - canvasRect.top &&
        prev.y <= doodleRect.bottom - canvasRect.top;
      const insideCurrent =
        p.x >= doodleRect.left - canvasRect.left &&
        p.x <= doodleRect.right - canvasRect.left &&
        p.y >= doodleRect.top - canvasRect.top &&
        p.y <= doodleRect.bottom - canvasRect.top;
      if (insidePrev || insideCurrent) {
        lastPointRef.current = p;
        return;
      }
    }
    ctx.globalCompositeOperation = brushTool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = activeToolSize;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastPointRef.current = p;
  };

  const endDraw = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    const canvas = drawCanvasRef.current;
    setCanvasSnapshots((prev) => ({ ...prev, [monthKey]: canvas.toDataURL('image/png') }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        updateScene((current) => ({
          ...current,
          images: [
            ...current.images,
            { id: newId, src: reader.result, x: 14, y: 14, width: 88, rotation: 0 },
          ],
        }));
        setSelectedImageId(newId);
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  };

  const beginImageDrag = (event, image) => {
    if (brushTool !== 'move') return;
    const point = getClientPoint(event);
    if (!point) return;
    setSelectedImageId(image.id);
    bindDrag({
      onMove: (movePoint, dragState) => {
        if (!dragState) return;
        updateScene((current) => ({
          ...current,
          images: current.images.map((img) => (
            img.id === image.id
              ? { ...img, x: Math.max(0, movePoint.x - dragState.offsetX), y: Math.max(0, movePoint.y - dragState.offsetY) }
              : img
          )),
        }));
      },
    })(event, { offsetX: point.x - image.x, offsetY: point.y - image.y });
  };

  return (
    <div className="canvas-space-wrapper" ref={wrapperRef}>
      <div
        ref={bubbleRef}
        className={`thought-bubble ${monthData.bubbleType}`}
        style={{ left: `${scene.bubble.x}px`, top: `${scene.bubble.y}px` }}
        onPointerDown={(event) => {
          if (brushTool !== 'move') return;
          const point = getClientPoint(event);
          if (!point) return;
          bindDrag({
            onMove: (movePoint, dragState) => {
              const next = clampElementPosition(
                movePoint.x - dragState.offsetX,
                movePoint.y - dragState.offsetY,
                wrapperRef.current?.getBoundingClientRect(),
                bubbleRef.current?.getBoundingClientRect()
              );
              updateScene((current) => ({
                ...current,
                bubble: {
                  x: next.x,
                  y: next.y,
                },
              }));
            },
          })(event, { offsetX: point.x - scene.bubble.x, offsetY: point.y - scene.bubble.y });
        }}
      >
        <span className="bubble-text">{monthData.quote}</span>
        <div className="bubble-tail" />
      </div>

      <div className="canvas-space" ref={canvasSpaceRef}>
        <div className="canvas-tools hand-text">
          <div className="tool-mode-row">
            <button className={`tool-btn ${brushTool === 'brush' ? 'active' : ''}`} onClick={() => setBrushTool('brush')}>Brush</button>
            <button className={`tool-btn ${brushTool === 'eraser' ? 'active' : ''}`} onClick={() => setBrushTool('eraser')}>Eraser</button>
            <button className={`tool-btn ${brushTool === 'move' ? 'active' : ''}`} onClick={() => setBrushTool('move')}>Move</button>
          </div>

          {canDraw && (
            <>
              <input
                className="size-slider"
                type="range"
                min="1"
                max="30"
                value={activeToolSize}
                onChange={(event) => {
                  const nextSize = parseInt(event.target.value, 10);
                  if (brushTool === 'eraser') setEraserSize(nextSize);
                  else setBrushSize(nextSize);
                }}
                title={`${brushTool} size`}
              />
              <div className="tool-size-label">{brushTool === 'eraser' ? `E ${eraserSize}` : `B ${brushSize}`}</div>
            </>
          )}

          <div className="palette-row">
            {DOODLE_PALETTE.map((color) => (
              <button
                key={color}
                className={`palette-dot ${brushColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setBrushColor(color)}
                title={color}
              />
            ))}
          </div>

          <label className="upload-btn">
            <svg className="camera-icon" viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '-1px' }}>
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg> Pic
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
          </label>

          {selectedImage && (
            <>
              <input
                className="size-slider"
                type="range"
                min="40"
                max="180"
                value={selectedImage.width}
                onChange={(event) =>
                  updateScene((current) => ({
                    ...current,
                    images: current.images.map((img) => (
                      img.id === selectedImage.id ? { ...img, width: parseInt(event.target.value, 10) } : img
                    )),
                  }))
                }
                title="Resize selected image"
              />
              <input
                className="size-slider"
                type="range"
                min="-180"
                max="180"
                value={selectedImage.rotation || 0}
                onChange={(event) =>
                  updateScene((current) => ({
                    ...current,
                    images: current.images.map((img) => (
                      img.id === selectedImage.id ? { ...img, rotation: parseInt(event.target.value, 10) } : img
                    )),
                  }))
                }
                title="Rotate selected image"
              />
              <button
                className="remove-pic-btn"
                onClick={() =>
                  updateScene((current) => ({
                    ...current,
                    images: current.images.filter((img) => img.id !== selectedImage.id),
                  }))
                }
              >
                Remove
              </button>
            </>
          )}
        </div>

        <canvas
          ref={drawCanvasRef}
          className="doodle-draw-canvas"
          style={{ pointerEvents: canDraw ? 'auto' : 'none' }}
          onPointerDown={beginDraw}
          onPointerMove={draw}
          onPointerUp={endDraw}
          onPointerLeave={endDraw}
          onPointerCancel={endDraw}
        />

        {scene.images.map((img) => (
          <DraggableItem
            key={img.id}
            imageState={img}
            isActive={img.id === selectedImage?.id}
            onSelect={() => setSelectedImageId(img.id)}
            onPointerDown={(event) => beginImageDrag(event, img)}
          />
        ))}

        <svg
          ref={doodleRef}
          className="canvas-doodle"
          viewBox="0 0 100 100"
          style={{ left: `${scene.doodle.x}px`, top: `${scene.doodle.y}px` }}
          onPointerDown={(event) => {
            if (brushTool !== 'move') return;
            const point = getClientPoint(event);
            if (!point) return;
            bindDrag({
              onMove: (movePoint, dragState) => {
                const next = clampElementPosition(
                  movePoint.x - dragState.offsetX,
                  movePoint.y - dragState.offsetY,
                  canvasSpaceRef.current?.getBoundingClientRect(),
                  doodleRef.current?.getBoundingClientRect()
                );
                updateScene((current) => ({
                  ...current,
                  doodle: {
                    x: next.x,
                    y: next.y,
                  },
                }));
              },
            })(event, { offsetX: point.x - scene.doodle.x, offsetY: point.y - scene.doodle.y });
          }}
          onClick={() => {
            if (brushTool === 'move') return;
            const next = [...doodleColors];
            next[currentMonthIndex] = brushColor;
            setDoodleColors(next);
          }}
        >
          <path
            d={monthData.doodle}
            stroke="var(--season-accent, #B34B3D)"
            strokeWidth="1.2"
            fill={doodleColors[currentMonthIndex]}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'fill 0.4s ease' }}
          />
          <text x="95" y="95" className="doodle-hint" textAnchor="end">COLOR ME</text>
        </svg>

        {currentHolidays.length > 0 && (
          <div
            className="canvas-holiday-list"
            style={{
              ...(scene.holiday.x !== null ? { left: `${scene.holiday.x}px`, top: `${scene.holiday.y}px`, right: 'auto' } : {}),
              cursor: brushTool === 'move' ? 'grab' : 'default',
            }}
            onPointerDown={(event) => {
              if (brushTool !== 'move') return;
              const point = getClientPoint(event);
              if (!point) return;
              const boxRect = event.currentTarget.getBoundingClientRect();
              const canvasRect = canvasSpaceRef.current.getBoundingClientRect();
              const currentX = scene.holiday.x !== null ? scene.holiday.x : (boxRect.left - canvasRect.left);
              const currentY = scene.holiday.y !== null ? scene.holiday.y : (boxRect.top - canvasRect.top);

              bindDrag({
                onMove: (movePoint, dragState) => {
                  const next = clampElementPosition(
                    movePoint.x - dragState.offsetX,
                    movePoint.y - dragState.offsetY,
                    canvasSpaceRef.current?.getBoundingClientRect(),
                    document.querySelector('.canvas-holiday-list')?.getBoundingClientRect()
                  );
                  updateScene((current) => ({
                    ...current,
                    holiday: {
                      x: next.x,
                      y: next.y,
                    },
                  }));
                },
              })(event, { offsetX: point.x - currentX, offsetY: point.y - currentY });
            }}
          >
            <div className="holiday-list-title hand-text">India Holidays</div>
            <div className="holiday-scroll-area">
              {currentHolidays.map((holiday, index) => (
                <div key={index} className="holiday-item hand-text">
                  <span className="holiday-date">{new Date(holiday.date).getDate()}</span>
                  <span className="holiday-name">{holiday.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="canvas-notes-lines">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="canvas-note-line">
              <svg className="wobbly-line" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M 0 5 Q 25 4, 50 5 T 100 6" stroke="var(--season-accent, #B34B3D)" strokeWidth="1" fill="none" opacity="0.1" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      <div className="title-banner">
        <h1 className="hand-text month-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            value={monthInput}
            onChange={(event) => setMonthInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && commitMonthYearChange()}
            className="hand-text month-input"
            style={{ width: `${Math.max(4, monthInput.length + 1.5)}ch` }}
          />
          <input
            type="number"
            value={yearInput}
            onChange={(event) => setYearInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && commitMonthYearChange()}
            className="hand-text year-input"
            style={{ width: `${Math.max(4, String(yearInput).length + 0.8)}ch` }}
          />
        </h1>
      </div>
    </div>
  );
};

export default HeroCanvas;
