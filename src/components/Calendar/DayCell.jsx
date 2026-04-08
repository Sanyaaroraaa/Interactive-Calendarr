import React from 'react';

const DayCell = ({
  cell,
  className,
  markers,
  onPickDay,
  onOpenNotesModal,
  monthSavedNotes,
}) => (
  <div className={className} onClick={() => !cell.inactive && onPickDay(cell.date)}>
    {cell.inactive ? (
      <span className="day-other-month-number">{cell.date}</span>
    ) : (
      <span className="day-number-with-marker">
        {cell.date}
        {markers.length > 0 && (
          <span
            className="saved-note-markers"
            onClick={(event) => {
              event.stopPropagation();
              const notesForDay = monthSavedNotes.filter((entry) => cell.date >= entry.start && cell.date <= entry.end);
              onOpenNotesModal(cell.date, notesForDay);
            }}
          >
            {markers.slice(0, 4).map((markerStyle, idx) => (
              <span key={`${markerStyle}-${idx}`} className={`saved-note-marker ${markerStyle}`} />
            ))}
            {markers.length > 4 && <span className="saved-note-count">+{markers.length - 4}</span>}
          </span>
        )}
      </span>
    )}
  </div>
);

export default DayCell;

