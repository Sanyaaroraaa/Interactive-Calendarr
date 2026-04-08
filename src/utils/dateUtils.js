export const getMonthMeta = (year, month) => {
  const dayone = new Date(year, month, 1).getDay();
  const lastdate = new Date(year, month + 1, 0).getDate();
  const dayend = new Date(year, month, lastdate).getDay();
  const monthlastdate = new Date(year, month, 0).getDate();
  return { dayone, lastdate, dayend, monthlastdate };
};

export const buildMonthCells = (year, monthIndex) => {
  const { dayone, lastdate, dayend, monthlastdate } = getMonthMeta(year, monthIndex);

  const cells = [];
  for (let i = dayone; i > 0; i -= 1) cells.push({ date: monthlastdate - i + 1, inactive: true });
  for (let i = 1; i <= lastdate; i += 1) cells.push({ date: i, inactive: false });
  for (let i = dayend; i < 6; i += 1) cells.push({ date: i - dayend + 1, inactive: true });
  return cells;
};

export const normalizeRange = (range) => {
  if (range.start === null) return null;
  if (range.end === null) return { from: range.start, to: range.start };
  return { from: Math.min(range.start, range.end), to: Math.max(range.start, range.end) };
};

export const parseMonthInput = (value, months) => {
  const cleaned = value.trim().toUpperCase();
  if (!cleaned) return null;
  const indexByName = months.findIndex((m) => m.name.startsWith(cleaned));
  if (indexByName !== -1) return indexByName;
  const asNumber = parseInt(cleaned, 10);
  if (!Number.isNaN(asNumber) && asNumber >= 1 && asNumber <= 12) return asNumber - 1;
  return null;
};

export const isToday = (day, monthIndex, year) => {
  const now = new Date();
  return day === now.getDate() && monthIndex === now.getMonth() && year === now.getFullYear();
};
