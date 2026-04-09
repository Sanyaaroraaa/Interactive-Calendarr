import React from 'react';
import { useAppContext } from '../context/AppContext';
import { runFlipAnimation } from '../animations/calendarAnimations';
import HeroCanvas from '../components/Hero/HeroCanvas';
import CalendarGrid from '../components/Calendar/CalendarGrid';
import NotesPanel from '../components/Notes/NotesPanel';
const CalendarFaceContent = ({ onSaveNote }) => (
  <div className="inner-page">
    <HeroCanvas />
    <div className="layout-header">
      <div className="notes-header hand-text">
        NOTES
        <button className="save-note-btn hand-text" onClick={onSaveNote} title="Save note for selected dates">
          Save
        </button>
      </div>
      <div className="days-row">
        <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
      </div>
    </div>
    <div className="grid-with-notes-wrapper">
      <NotesPanel />
      <CalendarGrid />
    </div>
  </div>
);

const Home = () => {
  const {
    pageRef,
    isFlipping,
    setIsFlipping,
    currentMonthIndex,
    goPrevMonth,
    goNextMonth,
    notesModal,
    setNotesModal,
    months,
    saveSelectedNote,
    currentSeasonTheme,
  } = useAppContext();
  const currentMonth = months[currentMonthIndex];

  const handleFlip = (direction) => {
    if (isFlipping) return;
    setIsFlipping(true);
    let midpointDone = false;

    runFlipAnimation({
      pageRef,
      direction,
      onMidpoint: () => {
        if (midpointDone) return;
        midpointDone = true;
        if (direction === 'forward') goNextMonth();
        else goPrevMonth();
      },
      onComplete: () => setIsFlipping(false),
    });
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark main-calendar-container">
      <div
        className="calendar-viewport wide"
        style={{
          '--season-bg': currentSeasonTheme.background,
          '--season-paper': currentSeasonTheme.paper,
          '--season-contrast': currentSeasonTheme.contrast,
          '--season-accent': currentSeasonTheme.accent,
          '--season-accent-rgb': currentSeasonTheme.accentRgb,
        }}
      >
        <svg className="spiral-svg back" viewBox="0 0 500 120" preserveAspectRatio="none">
          {[...Array(15)].map((_, i) => (
            <path key={i} d={`M ${i * 33 + 15} 30 Q ${i * 33 + 15} 80, ${i * 33 + 30} 80`} stroke="#222" strokeWidth="3" fill="none" />
          ))}
        </svg>

        <div className="calendar-stack">
          <div className="page static-page">
            <div className="page-face blue-bg">
              <div className="hole-row" />
              <CalendarFaceContent onSaveNote={saveSelectedNote} />
            </div>
          </div>

          <div className="page flipping-page" ref={pageRef}>
            <div className="page-face blue-bg">
              <div className="hole-row" />
              <CalendarFaceContent onSaveNote={saveSelectedNote} />
            </div>
            <div className="page-face flipped-back" />
          </div>
        </div>

        <svg className="spiral-svg front" viewBox="0 0 500 120" preserveAspectRatio="none">
          {[...Array(15)].map((_, i) => (
            <path key={i} d={`M ${i * 33 + 30} 80 Q ${i * 33 + 45} 80, ${i * 33 + 45} 30`} stroke="#ddd" strokeWidth="5" fill="none" strokeLinecap="round" />
          ))}
        </svg>

        <div
          className="c-top-outside"
          title="Previous month"
          onClick={() => handleFlip('backward')}
        />
        <div
          className="c-bottom-outside"
          title="Next month"
          onClick={() => handleFlip('forward')}
        />
      </div>

      {notesModal.open && (
        <div className="notes-modal-backdrop" onClick={() => setNotesModal({ open: false, day: null, notes: [] })}>
          <div className="notes-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="notes-modal-title hand-text">Notes on {currentMonth?.name || 'MONTH'} {notesModal.day}</div>
            <div className="notes-modal-list">
              {notesModal.notes.length > 0
                ? notesModal.notes.map((note) => (
                  <div key={note.id} className="notes-modal-item hand-text">
                    <span className={`notes-modal-marker ${note.markerStyle || 'loop'}`} />
                    <span>{note.start === note.end ? `Day ${note.start}` : `Days ${note.start}-${note.end}`}: {note.text}</span>
                  </div>
                ))
                : <div className="notes-modal-item hand-text">No note found</div>}
            </div>
            <button className="notes-modal-close hand-text" onClick={() => setNotesModal({ open: false, day: null, notes: [] })}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
