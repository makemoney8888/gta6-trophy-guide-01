// main.js — wires the guide together: loads the trophy data, builds the
// toolbar and the masthead stats, routes between the four views by hash
// (#/guide, #/roadmap, #/missables, #/next), and handles export, import,
// reset and the demo save. Query parameters exist for screenshot staging
// and deep links: ?demo=1 seeds the demo save, ?spoilers=1 turns the
// spoiler setting on, ?kind=story presets the kind filter, ?open=<id>
// selects a trophy, ?grade=silver presets the grade filter.

import { GRADE_LABELS, KIND_LABELS, gradeCounts, loadGuideData, trophyById } from "./data.js";
import { KIND_FILTERS, trophyMatches } from "./filters.js";
import {
  exportProgress, getState, importProgress, isEarned, resetProgress, seedDemoProgress,
  setCounter, setNote, setSpoilers, toggleEarned,
} from "./store.js";
import { renderOnlineEmptyState, renderTrophyList } from "./views-list.js";
import { renderTrophyDetail } from "./views-detail.js";
import { renderRoadmap } from "./views-roadmap.js";
import { renderMissables } from "./views-missables.js";
import { renderNext } from "./views-next.js";

const params = new URLSearchParams(location.search);
const { doc, trophies } = await loadGuideData();

if (params.get("demo") === "1") seedDemoProgress();
if (params.get("spoilers") === "1") setSpoilers(true);

const filters = {
  kind: params.get("kind") || "all",
  grade: params.get("grade") || "all",
  query: "",
  hideEarned: false,
};
let selectedId = Number(params.get("open")) || 17;

const $ = (id) => document.getElementById(id);
const views = { guide: $("view-guide"), roadmap: $("view-roadmap"), missables: $("view-missables"), next: $("view-next") };

function currentView() {
  const name = location.hash.replace("#/", "") || "guide";
  return views[name] ? name : "guide";
}

function openInGuide(id) {
  selectedId = id;
  if (currentView() !== "guide") location.hash = "#/guide";
  render();
}

function renderMasthead() {
  const counts = gradeCounts(trophies);
  const earned = trophies.filter((trophy) => isEarned(trophy.id)).length;
  const stats = $("masthead-stats");
  stats.replaceChildren();
  const big = document.createElement("p");
  big.className = "stat-big";
  big.textContent = `${earned} / ${trophies.length}`;
  const sub = document.createElement("p");
  sub.className = "stat-sub";
  sub.textContent = `earned · ${counts.platinum} platinum · ${counts.gold} gold · ${counts.silver} silver · ${counts.bronze} bronze · 28 hidden`;
  stats.append(big, sub);
}

function renderGuide() {
  const state = getState();
  const listBox = $("trophy-list");
  if (filters.kind === "online") {
    renderOnlineEmptyState(listBox);
  } else {
    const visible = trophies.filter((trophy) => trophyMatches(trophy, filters, isEarned(trophy.id)));
    renderTrophyList(listBox, {
      trophies: visible,
      state,
      selectedId,
      onSelect: (id) => { selectedId = id; render(); },
      onToggle: (id) => { toggleEarned(id); render(); },
    });
  }
  renderTrophyDetail($("trophy-detail"), {
    trophy: trophyById(trophies, selectedId),
    state,
    onToggle: (id) => { toggleEarned(id); render(); },
    onCounter: (id, value) => { setCounter(id, value); render(); },
    onNote: (id, text) => setNote(id, text),
  });
  const shown = filters.kind === "online" ? 0 : trophies.filter((trophy) => trophyMatches(trophy, filters, isEarned(trophy.id))).length;
  $("list-count").textContent = filters.kind === "online" ? "" : `Showing ${shown} of ${trophies.length}`;
}

function render() {
  const view = currentView();
  for (const [name, node] of Object.entries(views)) node.hidden = name !== view;
  $("toolbar").hidden = view !== "guide";
  document.querySelectorAll("#tabs a").forEach((a) => a.classList.toggle("is-active", a.dataset.view === view));
  renderMasthead();
  if (view === "guide") renderGuide();
  if (view === "roadmap") renderRoadmap(views.roadmap, { trophies, state: getState(), onOpen: openInGuide });
  if (view === "missables") renderMissables(views.missables, { trophies, onOpen: openInGuide });
  if (view === "next") renderNext(views.next, { trophies, onOpen: openInGuide });
}

function buildToolbar() {
  const chips = $("kind-chips");
  for (const kind of KIND_FILTERS) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `kind-chip${filters.kind === kind.id ? " is-active" : ""}`;
    chip.textContent = KIND_LABELS[kind.id] || kind.label;
    chip.addEventListener("click", () => {
      filters.kind = kind.id;
      chips.querySelectorAll(".kind-chip").forEach((c) => c.classList.toggle("is-active", c === chip));
      render();
    });
    chips.append(chip);
  }
  const grade = $("grade-filter");
  for (const value of ["all", "platinum", "gold", "silver", "bronze"]) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value === "all" ? "All grades" : GRADE_LABELS[value];
    grade.append(option);
  }
  grade.value = filters.grade;
  grade.addEventListener("change", () => { filters.grade = grade.value; render(); });
  $("search").addEventListener("input", (event) => { filters.query = event.target.value; renderGuide(); });
  const spoilers = $("spoilers-toggle");
  spoilers.checked = getState().spoilers;
  spoilers.addEventListener("change", () => { setSpoilers(spoilers.checked); render(); });
  $("hide-earned-toggle").addEventListener("change", (event) => { filters.hideEarned = event.target.checked; render(); });
}

function buildActions() {
  $("export-btn").addEventListener("click", () => {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vice-platinum-progress.json";
    link.click();
    URL.revokeObjectURL(link.href);
  });
  $("import-file").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const ok = importProgress(await file.text());
    $("import-note").textContent = ok ? "Progress imported." : "That file could not be read as progress.";
    if (ok) render();
    event.target.value = "";
  });
  $("reset-btn").addEventListener("click", () => {
    if (confirm("Clear every tick, counter and note? Export first if you want a copy.")) {
      resetProgress();
      $("spoilers-toggle").checked = false;
      render();
    }
  });
  $("demo-btn").addEventListener("click", () => { seedDemoProgress(); render(); });
}

function buildSources() {
  const box = $("sources-list");
  for (const source of doc.sources || []) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = source.url;
    link.textContent = source.name;
    item.append(link, document.createTextNode(` — ${source.what}.`));
    box.append(item);
  }
}

buildToolbar();
buildActions();
buildSources();
window.addEventListener("hashchange", render);
render();
