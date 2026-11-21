// views-next.js — the "next up" planner: what to do next, in the order a
// careful player would do it. Unearned missables first (they are the only
// trophies that can be left behind), then the counters nearest to done,
// then the earliest unearned story trophies in roadmap order.

import { GRADE_LABELS, formatCount } from "./data.js";
import { counterValue, isEarned } from "./store.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function nextRow(trophy, why, onOpen) {
  const row = el("article", "next-row");
  const main = el("div", "missable-main");
  const head = el("div", "trophy-head");
  head.append(el("span", `grade-chip grade-${trophy.grade}`, GRADE_LABELS[trophy.grade]));
  head.append(el("h4", "trophy-name", trophy.name));
  main.append(head);
  main.append(el("p", "missable-reason", why));
  row.append(main);
  const open = el("button", "open-guide-btn", "Open guide");
  open.type = "button";
  open.addEventListener("click", () => onOpen(trophy.id));
  row.append(open);
  return row;
}

export function planNext(trophies) {
  const unearned = trophies.filter((trophy) => !isEarned(trophy.id));
  const byStage = (a, b) => a.stage - b.stage || a.id - b.id;
  const missables = unearned
    .filter((trophy) => trophy.missable !== "no")
    .sort((a, b) => (a.missable === b.missable ? byStage(a, b) : a.missable === "flag" ? -1 : 1));
  const counters = unearned
    .filter((trophy) => trophy.target && !missables.includes(trophy))
    .map((trophy) => ({ trophy, ratio: counterValue(trophy) / trophy.target }))
    .filter((entry) => entry.ratio > 0)
    .sort((a, b) => b.ratio - a.ratio)
    .map((entry) => entry.trophy);
  const story = unearned
    .filter((trophy) => trophy.kind === "story" && !missables.includes(trophy) && !counters.includes(trophy))
    .sort(byStage);
  return { missables, counters, story };
}

export function renderNext(container, { trophies, onOpen }) {
  container.replaceChildren();
  const intro = el("div", "view-intro");
  intro.append(el("h2", "", "Next up"));
  intro.append(el("p", "", "The order a careful player works in: anything that can be left behind first, then the counters closest to finished, then the story in roadmap order."));
  container.append(intro);

  const { missables, counters, story } = planNext(trophies);
  const plan = [
    ...missables.map((trophy) => ({
      trophy,
      why: trophy.missable === "flag" ? "Missable — do this beat when the game offers it." : "Watch — tied to a strand, a partner or a moment; do it while the story is live.",
    })),
    ...counters.map((trophy) => ({
      trophy,
      why: `Counter at ${formatCount(counterValue(trophy))} of ${formatCount(trophy.target)} ${trophy.unit} — among your closest to done.`,
    })),
    ...story.map((trophy) => ({
      trophy,
      why: `Story, roadmap stage ${trophy.stage} — the campaign in order.`,
    })),
  ].slice(0, 12);

  if (plan.length === 0) {
    container.append(el("p", "empty-note", "Nothing left to plan: every trophy is earned. Leonida Legend status achieved."));
    return;
  }
  for (const item of plan) container.append(nextRow(item.trophy, item.why, onOpen));
}
