# Calendar notebook (React)

Small desk-calendar style app: flip months, scribble notes on dates, doodle on the top “paper,” India holidays in the corner. No server — everything sits in the browser.

**Live:** *(your link)*  
**Video walkthrough:** *(your link)*  
**Repo:** *(optional)*

---

### Run it

```bash
npm install
npm run dev
```

`npm run build` → `dist/` for deploy. Node 18+ is fine.

---

### What’s in here

**Personalized Canvas:** You can add your personal moments by uploading pictures directly onto the desk canvas! Move, resize, and rotate your photos, color the seasonal doodles, and seamlessly drag the thought bubble or holiday list to craft your perfect aesthetic.

The month grid, notes column, and hero canvas all pull from the same React context so I’m not threading fifteen props through every file. Notes, brush drawings, user-uploaded pictures, and all your adjusted layout positions are saved persistently per month in **localStorage** (keys are in `src/utils/constants.js` if you want to clear them).

Flip animation is **GSAP** on the front page layer; the month actually changes halfway through the flip so it doesn’t feel like a cheap swap. I had to be careful when December rolls into January — year and month update together so nothing jumps two years ahead.

Holidays: I tried a couple of free APIs and India either came back empty or not at all, so I wired in **date-holidays** and load it with a dynamic `import()` so the first paint isn’t dragging that whole chunk in. Tradeoff: it’s rule-based, so don’t expect every regional festival.

Themes are four seasons mapped to months — CSS variables on the main wrapper (`--season-bg`, paper, accent, etc.) so the hero and calendar stay in the same palette without copy-pasting hex codes everywhere.

---

### Stack (honest list)

React, Vite, GSAP, Bootstrap / react-bootstrap, date-holidays. Flip hit areas use a plain `title` tooltip — no jQuery.

---

### Folder sketch

`context/` holds app state, `hooks/` has calendar + localStorage + drag helpers, `components/` is Hero / Calendar / Notes, `pages/Home.jsx` is the flip + modal shell.

---

### Stuff I’d still do

Tests on the date helpers, better a11y (keyboard + reduced motion for the flip), maybe a real API key later for fuller holiday lists.

---

Built this as a portfolio piece — if something’s unclear, open an issue or ask in the video. Cheers.
