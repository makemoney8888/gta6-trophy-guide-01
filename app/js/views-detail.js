// views-detail.js — the guide pane: one trophy in full. Official name,
// description and grade at the top, then the guide in the author's own
// words, the sources it was written from, the missable warning where the
// trophy carries one, and the tracker controls (earned toggle, counter
// stepper for counted trophies, a private note).

import { GRADE_LABELS, KIND_LABELS, formatCount } from "./data.js";
import { stageOf } from "./roadmap.js";
import { counterValue, isEarned, noteValue } from "./store.js";
import { displayDescription, displayName, isMasked, missableLevel } from "./filters.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderTrophyDetail(container, { trophy, state, onToggle, onCounter, onNote }) {
  container.replaceChildren();
  if (!trophy) {
    container.append(el("p", "empty-note", "Pick a trophy from the list to read its guide."));
    return;
  }
  const earned = isEarned(trophy.id);
  const masked = isMasked(trophy, state, earned);
  const stage = stageOf(trophy);

  const head = el("div", "detail-head");
  head.append(el("span", `grade-chip grade-${trophy.grade}`, GRADE_LABELS[trophy.grade]));
  head.append(el("span", "detail-kind", `${KIND_LABELS[trophy.kind] || trophy.kind} · Roadmap stage ${stage.n} — ${stage.title}`));
  container.append(head);

  container.append(el("h2", "detail-name", displayName(trophy, state, earned)));
  container.append(el("p", "detail-desc", displayDescription(trophy, state, earned)));
  if (trophy.hidden && !masked) {
    container.append(el("p", "detail-hidden", "Hidden on PlayStation until earned — its name and description above are the official ones, shown here so you can plan around it."));
  }

  const toggle = el("button", `detail-toggle${earned ? " is-earned" : ""}`, earned ? "Earned ✓ — tap to undo" : "Mark as earned");
  toggle.type = "button";
  toggle.addEventListener("click", () => onToggle(trophy.id));
  container.append(toggle);

  const level = missableLevel(trophy);
  if (level && trophy.missableNote) {
    const warn = el("div", `missable-note missable-${level.id}`);
    warn.append(el("strong", "", level.id === "flag" ? "Missable: " : "Watch: "));
    warn.append(document.createTextNode(trophy.missableNote));
    container.append(warn);
  }

  container.append(el("h3", "detail-subhead", "Guide"));
  if (masked) {
    container.append(el("p", "detail-guide", "The guide for this trophy is hidden with its name — turn the spoiler setting off, or earn the trophy, to read it."));
  } else {
    container.append(el("p", "detail-guide", trophy.guide));
    const sources = el("p", "detail-sources");
    sources.append(el("strong", "", "Written from: "));
    sources.append(document.createTextNode(trophy.sources.join(" · ")));
    container.append(sources);
  }

  if (trophy.target) {
    const box = el("div", "counter-box");
    box.append(el("h3", "detail-subhead", `Progress — ${trophy.unit}`));
    const row = el("div", "counter-row");
    const minus = el("button", "counter-btn", "−");
    minus.type = "button";
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.value = String(counterValue(trophy));
    const plus = el("button", "counter-btn", "+");
    plus.type = "button";
    const of = el("span", "counter-of", `of ${formatCount(trophy.target)}`);
    minus.addEventListener("click", () => onCounter(trophy.id, counterValue(trophy) - 1));
    plus.addEventListener("click", () => onCounter(trophy.id, counterValue(trophy) + 1));
    input.addEventListener("change", () => onCounter(trophy.id, Number(input.value)));
    row.append(minus, input, plus, of);
    box.append(row);
    container.append(box);
  }

  const noteBox = el("div", "note-box");
  noteBox.append(el("h3", "detail-subhead", "Your note"));
  const area = document.createElement("textarea");
  area.rows = 3;
  area.placeholder = "Anything you want to remember about this one…";
  area.value = noteValue(trophy.id);
  area.addEventListener("change", () => onNote(trophy.id, area.value));
  noteBox.append(area);
  container.append(noteBox);
}
