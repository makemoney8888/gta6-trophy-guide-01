// store.js — the tracker's saved progress: which trophies are earned, the
// per-trophy counters for the counted trophies, a note per trophy, and the
// spoiler setting. Everything lives in one localStorage record so the guide
// works offline and the whole state can be exported to a file and imported
// back on another machine.

const STORAGE_KEY = "vice-platinum-progress-v1";

// A small, believable mid-run save, used by the "load demo progress" button
// and by the screenshot staging: 13 of 55 earned, counters part-way along.
export const DEMO_EARNED = [2, 3, 8, 15, 16, 17, 21, 25, 28, 30, 35, 42, 44];
export const DEMO_COUNTERS = {
  15: 132, 17: 42, 25: 5, 28: 11, 32: 23, 35: 64, 42: 31, 48: 210, 52: 90000, 53: 61000,
};

function blankState() {
  return { earned: [], counters: {}, notes: {}, spoilers: false };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned : [],
      counters: parsed.counters && typeof parsed.counters === "object" ? parsed.counters : {},
      notes: parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {},
      spoilers: parsed.spoilers === true,
    };
  } catch {
    return blankState();
  }
}

let state = loadState();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getState() {
  return state;
}

export function isEarned(id) {
  return state.earned.includes(id);
}

export function earnedCount() {
  return state.earned.length;
}

export function toggleEarned(id) {
  state.earned = isEarned(id)
    ? state.earned.filter((earnedId) => earnedId !== id)
    : [...state.earned, id].sort((a, b) => a - b);
  persist();
}

export function counterValue(trophy) {
  const saved = state.counters[trophy.id];
  if (typeof saved === "number") return saved;
  return isEarned(trophy.id) && trophy.target ? trophy.target : 0;
}

export function setCounter(id, value) {
  const clean = Math.max(0, Math.floor(Number(value) || 0));
  state.counters[id] = clean;
  persist();
  return clean;
}

export function noteValue(id) {
  return state.notes[id] || "";
}

export function setNote(id, text) {
  if (text) state.notes[id] = text;
  else delete state.notes[id];
  persist();
}

export function setSpoilers(on) {
  state.spoilers = on === true;
  persist();
}

export function resetProgress() {
  state = blankState();
  persist();
}

export function seedDemoProgress() {
  state = {
    earned: [...DEMO_EARNED],
    counters: { ...DEMO_COUNTERS },
    notes: { 17: "Last two ranges golded on the second try — accuracy drills worked." },
    spoilers: state.spoilers,
  };
  persist();
}

export function exportProgress() {
  return JSON.stringify({ app: "vice-platinum", version: 1, ...state }, null, 2);
}

export function importProgress(text) {
  try {
    const parsed = JSON.parse(text);
    if (!parsed || !Array.isArray(parsed.earned)) return false;
    state = {
      earned: parsed.earned.filter((id) => Number.isInteger(id)),
      counters: parsed.counters && typeof parsed.counters === "object" ? parsed.counters : {},
      notes: parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {},
      spoilers: parsed.spoilers === true,
    };
    persist();
    return true;
  } catch {
    return false;
  }
}
