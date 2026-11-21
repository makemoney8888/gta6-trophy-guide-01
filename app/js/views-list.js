// views-list.js — the checklist itself: one row per trophy with its official
// name, description and grade, its kind and missable badges, a tick box, and
// a slim progress bar for the counted trophies. Rows honour the spoiler
// setting through filters.js.

import { GRADE_LABELS, formatCount } from "./data.js";
import { counterValue, isEarned } from "./store.js";
import { displayDescription, displayName, missableLevel } from "./filters.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderTrophyList(container, { trophies, state, selectedId, onSelect, onToggle }) {
  container.replaceChildren();
  if (trophies.length === 0) {
    container.append(el("p", "empty-note", "No trophies match. Clear the search or pick another filter."));
    return;
  }
  for (const trophy of trophies) {
    const earned = isEarned(trophy.id);
    const row = el("article", `trophy-row grade-${trophy.grade}${earned ? " is-earned" : ""}${trophy.id === selectedId ? " is-selected" : ""}`);

    const tick = el("input", "trophy-tick");
    tick.type = "checkbox";
    tick.checked = earned;
    tick.title = earned ? "Earned — untick to undo" : "Mark as earned";
    tick.addEventListener("click", (event) => event.stopPropagation());
    tick.addEventListener("change", () => onToggle(trophy.id));
    row.append(tick);

    const body = el("div", "trophy-body");
    const head = el("div", "trophy-head");
    head.append(el("span", `grade-chip grade-${trophy.grade}`, GRADE_LABELS[trophy.grade]));
    head.append(el("h3", "trophy-name", displayName(trophy, state, earned)));
    const level = missableLevel(trophy);
    if (level) head.append(el("span", `missable-badge missable-${level.id}`, level.label));
    if (trophy.hidden) head.append(el("span", "hidden-badge", "Hidden on PSN"));
    body.append(head);
    body.append(el("p", "trophy-desc", displayDescription(trophy, state, earned)));

    const meta = el("p", "trophy-meta");
    const bits = [`Stage ${trophy.stage}`];
    if (trophy.target) {
      const value = counterValue(trophy);
      bits.push(`${formatCount(value)} / ${formatCount(trophy.target)} ${trophy.unit}`);
    }
    meta.textContent = bits.join(" · ");
    body.append(meta);

    if (trophy.target) {
      const track = el("div", "count-track");
      const fill = el("div", "count-fill");
      const ratio = Math.min(1, counterValue(trophy) / trophy.target);
      fill.style.width = `${Math.round(ratio * 100)}%`;
      track.append(fill);
      body.append(track);
    }

    row.append(body);
    row.addEventListener("click", () => onSelect(trophy.id));
    container.append(row);
  }
}

export function renderOnlineEmptyState(container) {
  container.replaceChildren();
  const note = el("div", "empty-note");
  note.append(el("h3", "", "No online trophies"));
  note.append(el("p", "", "The official PlayStation 5 list for GTA VI holds no online trophies: all 55 are earned in the single-player game, so this filter is honestly empty. If a future list adds online trophies, they will appear here."));
  container.append(note);
}
