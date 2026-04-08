import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './notes.css';

const NotesPanel = () => {
  const { draftNote, setDraftNote, saveSelectedNote } = useAppContext();

  return (
    <div className="notes-column">
      <div className="notes-header-mobile hand-text">
        NOTES
        <button className="save-note-btn hand-text" onClick={saveSelectedNote} title="Save note for selected dates">
          Save
        </button>
      </div>
      <div className="notes-editor-wrap" style={{ position: 'relative' }}>
        <div className="chunky-notes-container">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="chunky-note-cell">
              <svg className="wobbly-line" viewBox="0 0 80 10" preserveAspectRatio="none">
                <path d="M 0 5 Q 20 4, 40 5 T 80 6" stroke="var(--season-accent, #B34B3D)" strokeWidth="1.5" fill="none" opacity="0.3" />
              </svg>
            </div>
          ))}
        </div>
        <textarea
          className="hand-text notes-textarea-mini notes-textarea-lined"
          placeholder="Write note"
          value={draftNote}
          onChange={(event) => setDraftNote(event.target.value)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: 'none',
            resize: 'none',
            padding: '0 5px 8px',
            fontSize: '1.05rem',
            outline: 'none',
            color: 'var(--season-accent, #B34B3D)',
            overflowY: 'auto',
          }}
        />
      </div>
    </div>
  );
};

export default NotesPanel;

