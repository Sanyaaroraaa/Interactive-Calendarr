import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { buildMonthCells, isToday, normalizeRange } from '../../utils/dateUtils';
import DayCell from './DayCell';
import './calendar.css';

const CalendarGrid = () => {
  const {
    currentYear,
    currentMonthIndex,
    clickedDay,
    selectedRange,
    pickDay,
    monthSavedNotes,
    setNotesModal,
  } = useAppContext();

  const cells = useMemo(
    () => buildMonthCells(currentYear, currentMonthIndex),
    [currentYear, currentMonthIndex],
  );
  const tempRange = normalizeRange(selectedRange);

  const getSavedMarkers = (day) =>
    monthSavedNotes
      .filter((entry) => day >= entry.start && day <= entry.end)
      .map((entry) => entry.markerStyle || 'loop');

  return (
    <div className="hand-grid">
      {cells.map((cell, index) => {
        const activeToday = !cell.inactive && isToday(cell.date, currentMonthIndex, currentYear);
        const activeClicked = !cell.inactive && clickedDay === cell.date;
        const inRange = !cell.inactive && tempRange && cell.date >= tempRange.from && cell.date <= tempRange.to;
        const markers = !cell.inactive ? getSavedMarkers(cell.date) : [];

        let className = `cell ${cell.inactive ? 'day-other-month' : 'day-active'}`;
        if (activeToday) className += ' active';
        if (activeClicked) className += ' highlight';
        if (inRange) className += ' range-selected';

        return (
          <DayCell
            key={index}
            cell={cell}
            className={className}
            markers={markers}
            onPickDay={pickDay}
            monthSavedNotes={monthSavedNotes}
            onOpenNotesModal={(day, notes) => setNotesModal({ open: true, day, notes })}
          />
        );
      })}
    </div>
  );
};

export default CalendarGrid;

