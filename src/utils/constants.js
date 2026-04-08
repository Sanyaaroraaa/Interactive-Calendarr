export const NOTE_MARKERS = ['loop', 'double-loop', 'swirl', 'underline', 'burst'];

export const getRandomMarker = () => NOTE_MARKERS[Math.floor(Math.random() * NOTE_MARKERS.length)];

export const STORAGE_KEYS = {
  savedDateNotes: 'calendar_savedDateNotes_v1',
  canvasSnapshots: 'calendar_canvasSnapshots_v1',
  canvasImageByMonth: 'calendar_canvasImageByMonth_v1',
  doodleColors: 'calendar_doodleColors_v1',
};

export const DOODLE_PALETTE = ['#B34B3D', '#2D5A88', '#6E4A8E', '#2B7A4B', '#D17A22', '#242424'];

export const SEASON_THEMES = {
  winter: { background: '#2D5A88', paper: '#F4F8FF', contrast: '#F4F8FF', accent: '#B34B3D', accentRgb: '179 75 61' },
  spring: { background: '#2B7A4B', paper: '#F1FFE9', contrast: '#F2FFF4', accent: '#2F8F72', accentRgb: '47 143 114' },
  summer: { background: '#C85F3D', paper: '#FFF4DE', contrast: '#FFF7EC', accent: '#D17A22', accentRgb: '209 122 34' },
  autumn: { background: '#6E4A8E', paper: '#F8EEFF', contrast: '#F7F0FF', accent: '#8A5FB3', accentRgb: '138 95 179' },
};

export const SEASON_THEME_BY_MONTH = [
  SEASON_THEMES.winter, // JAN
  SEASON_THEMES.winter, // FEB
  SEASON_THEMES.winter, // MAR
  SEASON_THEMES.spring, // APR
  SEASON_THEMES.spring, // MAY
  SEASON_THEMES.spring, // JUN
  SEASON_THEMES.summer, // JUL
  SEASON_THEMES.summer, // AUG
  SEASON_THEMES.summer, // SEP
  SEASON_THEMES.autumn, // OCT
  SEASON_THEMES.autumn, // NOV
  SEASON_THEMES.autumn, // DEC
];

export const MONTHS = [
  { name: 'JANUARY', quote: 'New year, new goals!', bubbleType: 'oval', doodle: 'M10,60 L30,30 L45,50 L60,20 L80,60 Z M25,20 m-2,0 a2,2 0,1,0 4,0 a2,2 0,1,0 -4,0 M55,10 m-2,0 a2,2 0,1,0 4,0 a2,2 0,1,0 -4,0 M75,25 m-2,0 a2,2 0,1,0 4,0 a2,2 0,1,0 -4,0' },
  { name: 'FEBRUARY', quote: 'Love is in the air.', bubbleType: 'cloud', doodle: 'M50,40 Q60,25 70,40 T50,70 T30,40 T50,40 M20,85 L20,65 Q20,55 25,65 M15,55 A5,5 0,1,1 25,55 A5,5 0,1,1 15,55 M80,85 L80,65 Q80,55 75,65 M75,55 A5,5 0,1,1 85,55 A5,5 0,1,1 75,55 M25,65 Q50,60 75,65' },
  { name: 'MARCH', quote: 'Bloom where you are.', bubbleType: 'round', doodle: 'M30,80 Q30,60 30,40 M30,40 Q15,20 30,10 Q45,20 30,40 M30,40 Q50,25 60,40 Q50,55 30,40 M30,40 Q10,55 0,40 Q10,25 30,40 M70,80 Q70,70 75,65 M75,65 Q80,60 70,60 Q60,60 65,65 M10,20 Q40,15 60,20 M20,10 Q50,5 80,10' },
  { name: 'APRIL', quote: 'Spring showers!', bubbleType: 'wobbly', doodle: 'M20,50 Q50,10 80,50 L20,50 M50,50 L50,75 Q50,85 40,85 M20,20 Q20,30 18,30 Q16,30 16,20 Q18,10 20,20 M85,15 Q85,25 83,25 Q81,25 81,15 Q83,5 85,15 M40,10 Q40,20 38,20 Q36,20 36,10 Q38,0 40,10 M10,90 Q50,80 90,90' },
  { name: 'MAY', quote: 'Chase the sun.', bubbleType: 'oval', doodle: 'M5,10 Q50,-5 95,10 L95,85 Q50,95 5,85 Z M10,15 A10,10 0,1,1 30,15 A10,10 0,1,1 10,15 M5,60 Q30,50 60,65 T95,60 M75,35 Q80,25 90,35 T75,35 M70,80 L70,70 Q70,65 75,65 Q80,65 80,70 L80,80 M75,65 Q75,60 75,55 M72,55 A3,3 0,1,1 78,55 A3,3 0,1,1 72,55' },
  { name: 'JUNE', quote: 'Summer vibes only.', bubbleType: 'cloud', doodle: 'M15,85 Q25,40 10,20 M10,20 Q30,10 45,20 M10,20 Q-5,10 -15,20 M35,85 L25,45 Q28,35 35,45 L45,85 Z M0,85 Q20,75 40,85 T80,85 T100,85 M70,25 A12,12 0,1,0 94,25 A12,12 0,1,0 70,25 M70,25 L94,25 M82,13 L82,37 M5,75 Q30,70 50,75 T95,75' },
  { name: 'JULY', quote: 'Sparkle and shine.', bubbleType: 'round', doodle: 'M20,20 A25,25 0,0,1 45,45 A20,20 0,1,0 20,20 M70,20 L72,25 L77,25 L73,28 L75,33 L70,30 L65,33 L67,28 L63,25 L68,25 Z M85,50 L86,53 L89,53 L87,55 L88,58 L85,56 L82,58 L83,55 L81,53 L84,53 Z M50,70 L50,60 M50,70 L60,70 M50,70 L40,70 M50,70 L50,80 M50,70 L57,63 M50,70 L43,63 M50,70 L57,77 M50,70 L43,77' },
  { name: 'AUGUST', quote: 'Savor the heat.', bubbleType: 'wobbly', doodle: 'M50,50 m-48,0 a48,48 0,1,0 96,0 a48,48 0,1,0 -96,0 M30,50 Q10,40 20,70 Q30,85 40,75 M70,50 Q90,40 80,70 Q70,85 60,75 M40,35 Q50,20 60,35 L60,50 Q60,85 50,95 Q40,85 40,75 M42,45 L58,45 M45,40 Q50,30 55,40 M50,15 L50,25 M35,25 L65,25 L50,5 Z M46,60 A2,2 0,1,1 48,60 M52,60 A2,2 0,1,1 54,60' },
  { name: 'SEPTEMBER', quote: 'Change is good.', bubbleType: 'oval', doodle: 'M80,85 L80,50 M80,60 Q60,40 70,25 M80,55 Q95,35 85,20 M10,85 Q45,75 90,85 M15,30 Q25,25 20,20 M40,50 Q50,45 45,40 M60,15 Q65,10 60,5 M5,40 Q30,35 50,40 T95,35 M20,70 L25,70 L25,85 M35,72 L40,72 L40,85' },
  { name: 'OCTOBER', quote: 'Stay spooky!', bubbleType: 'cloud', doodle: 'M50,45 m-35,0 a35,35 0,1,0 70,0 a35,35 0,1,0 -70,0 M15,85 L25,50 M25,50 Q10,30 20,20 M25,50 Q35,30 30,15 M70,85 Q75,70 85,70 T100,85 Z M76,76 L78,79 L74,79 Z M84,76 L86,79 L82,79 Z M40,20 Q45,15 50,20 T60,20 L50,25 Z' },
  { name: 'NOVEMBER', quote: 'Gratitude is key.', bubbleType: 'round', doodle: 'M20,85 L20,40 L80,40 L80,85 M20,45 L80,45 M35,85 L40,70 L50,85 L60,70 L65,85 M30,40 L30,30 M28,30 L32,30 M30,28 Q30,22 32,25 M10,85 L90,85 M15,85 L15,40 M85,85 L85,40' },
  { name: 'DECEMBER', quote: 'Magic is real.', bubbleType: 'wobbly', doodle: 'M50,75 L30,75 L50,50 L35,50 L50,25 L65,50 L50,50 L70,75 Z M50,25 L50,15 M45,20 L55,20 M10,85 Q50,75 90,85 M80,85 L80,70 L95,70 L95,85 Z M80,77 L95,77 M87,70 L87,85 M20,30 m-2,0 a2,2 0,1,0 4,0 a2,2 0,1,0 -4,0 M75,45 m-2,0 a2,2 0,1,0 4,0 a2,2 0,1,0 -4,0' },
];
