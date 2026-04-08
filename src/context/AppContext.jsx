import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCalendar } from '../hooks/useCalendar';
import { SEASON_THEME_BY_MONTH, STORAGE_KEYS, getRandomMarker } from '../utils/constants';
import { normalizeRange } from '../utils/dateUtils';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [clickedDay, setClickedDay] = useState(null);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [draftNote, setDraftNote] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const [notesModal, setNotesModal] = useState({ open: false, day: null, notes: [] });
  const [brushColor, setBrushColor] = useState('#B34B3D');
  const [brushTool, setBrushTool] = useState('brush');
  const [brushSize, setBrushSize] = useState(3);
  const [eraserSize, setEraserSize] = useState(10);
  const pageRef = useRef(null);
  const calendarNavRef = useRef({ year: currentYear, month: currentMonthIndex });
  calendarNavRef.current = { year: currentYear, month: currentMonthIndex };

  const [doodleColors, setDoodleColors] = useLocalStorage(STORAGE_KEYS.doodleColors, Array(12).fill('transparent'));
  const [savedDateNotes, setSavedDateNotes] = useLocalStorage(STORAGE_KEYS.savedDateNotes, {});
  const [canvasSnapshots, setCanvasSnapshots] = useLocalStorage(STORAGE_KEYS.canvasSnapshots, {});
  const [canvasImageByMonth, setCanvasImageByMonth] = useLocalStorage(STORAGE_KEYS.canvasImageByMonth, {});

  const calendar = useCalendar(currentYear, currentMonthIndex);
  const monthKey = `${currentYear}-${currentMonthIndex}`;
  const monthSavedNotes = savedDateNotes[monthKey] || [];
  const currentSeasonTheme = SEASON_THEME_BY_MONTH[currentMonthIndex] || SEASON_THEME_BY_MONTH[0];

  const resetMonthTransientState = () => {
    setClickedDay(null);
    setSelectedRange({ start: null, end: null });
    setDraftNote('');
  };

  const commitMonthYearChange = () => {
    calendar.commitMonthYear(setCurrentMonthIndex, setCurrentYear);
    resetMonthTransientState();
  };

  const goToMonth = (monthDirection) => {
    const { year, month } = calendarNavRef.current;
    let nextMonth = month + monthDirection;
    let nextYear = year;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    setCurrentYear(nextYear);
    setCurrentMonthIndex(nextMonth);
    resetMonthTransientState();
  };

  const goPrevMonth = () => goToMonth(-1);
  const goNextMonth = () => goToMonth(1);

  const pickDay = (day) => {
    if (selectedRange.start === null || selectedRange.end !== null) {
      setSelectedRange({ start: day, end: null });
      setClickedDay(day);
      return;
    }
    setSelectedRange({ start: selectedRange.start, end: day });
    setClickedDay(day);
  };

  const saveSelectedNote = () => {
    const tempRange = normalizeRange(selectedRange);
    if (!draftNote.trim() || !tempRange) return;
    const next = {
      id: `${Date.now()}-${tempRange.from}-${tempRange.to}`,
      start: tempRange.from,
      end: tempRange.to,
      text: draftNote.trim(),
      markerStyle: getRandomMarker(),
    };
    setSavedDateNotes((prev) => ({ ...prev, [monthKey]: [...(prev[monthKey] || []), next] }));
    setDraftNote('');
  };

  const value = useMemo(() => ({
    currentYear,
    currentMonthIndex,
    clickedDay,
    selectedRange,
    draftNote,
    isFlipping,
    notesModal,
    brushColor,
    brushTool,
    brushSize,
    eraserSize,
    doodleColors,
    savedDateNotes,
    canvasSnapshots,
    canvasImageByMonth,
    months: calendar.months,
    holidays: calendar.holidays,
    monthInput: calendar.monthInput,
    yearInput: calendar.yearInput,
    pageRef,
    monthKey,
    monthSavedNotes,
    currentSeasonTheme,
    setCurrentYear,
    setCurrentMonthIndex,
    setClickedDay,
    setSelectedRange,
    setDraftNote,
    setIsFlipping,
    setNotesModal,
    setBrushColor,
    setBrushTool,
    setBrushSize,
    setEraserSize,
    setDoodleColors,
    setSavedDateNotes,
    setCanvasSnapshots,
    setCanvasImageByMonth,
    setMonthInput: calendar.setMonthInput,
    setYearInput: calendar.setYearInput,
    commitMonthYearChange,
    goPrevMonth,
    goNextMonth,
    pickDay,
    saveSelectedNote,
    resetMonthTransientState,
  }), [
    brushColor,
    brushTool,
    brushSize,
    eraserSize,
    calendar.holidays,
    calendar.monthInput,
    calendar.months,
    calendar.yearInput,
    canvasImageByMonth,
    canvasSnapshots,
    clickedDay,
    currentMonthIndex,
    currentYear,
    doodleColors,
    draftNote,
    isFlipping,
    monthKey,
    monthSavedNotes,
    currentSeasonTheme,
    notesModal,
    savedDateNotes,
    selectedRange,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

