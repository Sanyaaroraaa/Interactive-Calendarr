import { useEffect, useMemo, useState } from 'react';
import { MONTHS } from '../utils/constants';
import { parseMonthInput } from '../utils/dateUtils';

export const useCalendar = (currentYear, currentMonthIndex) => {
  const [holidays, setHolidays] = useState({});
  const [monthInput, setMonthInput] = useState(MONTHS[currentMonthIndex]?.name || '');
  const [yearInput, setYearInput] = useState(String(currentYear));

  useEffect(() => {
    setMonthInput(MONTHS[currentMonthIndex]?.name || '');
    setYearInput(String(currentYear));
  }, [currentMonthIndex, currentYear]);

  useEffect(() => {
    let cancelled = false;
    const year = currentYear;
    const fallback = {
      0: [{ date: `${year}-01-26`, name: 'Republic Day' }],
      7: [{ date: `${year}-08-15`, name: 'Independence Day' }],
      9: [{ date: `${year}-10-02`, name: 'Gandhi Jayanti' }],
      11: [{ date: `${year}-12-25`, name: 'Christmas' }],
    };

    const normalizeAndGroup = (holidayList) => holidayList.reduce((acc, holiday) => {
      const [, m] = holiday.date.split('-');
      const month = parseInt(m, 10) - 1;
      if (!acc[month]) acc[month] = [];
      acc[month].push(holiday);
      return acc;
    }, {});

    (async () => {
      try {
        const { default: Holidays } = await import('date-holidays');
        if (cancelled) return;
        const hd = new Holidays('IN');
        const raw = hd.getHolidays(year) || [];
        const normalized = raw
          .filter((h) => h.type === 'public' || h.type === 'bank')
          .map((h) => {
            const dateStr = typeof h.date === 'string' ? h.date.slice(0, 10) : '';
            return { date: dateStr, name: h.name || 'Holiday' };
          })
          .filter((h) => h.date);
        if (normalized.length > 0) {
          setHolidays(normalizeAndGroup(normalized));
          return;
        }
      } catch {
        /* use fallback */
      }
      if (!cancelled) setHolidays(fallback);
    })();

    return () => {
      cancelled = true;
    };
  }, [currentYear]);

  const commitMonthYear = (setCurrentMonthIndex, setCurrentYear) => {
    const parsedMonth = parseMonthInput(monthInput, MONTHS);
    const parsedYear = parseInt(yearInput, 10);
    if (parsedMonth !== null) setCurrentMonthIndex(parsedMonth);
    if (!Number.isNaN(parsedYear) && parsedYear > 0) setCurrentYear(parsedYear);
  };

  return useMemo(() => ({
    months: MONTHS,
    holidays,
    monthInput,
    yearInput,
    setMonthInput,
    setYearInput,
    commitMonthYear,
  }), [holidays, monthInput, yearInput]);
};

