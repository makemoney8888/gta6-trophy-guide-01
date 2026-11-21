// views-roadmap.js — the roadmap to the platinum: the eight stages in
// order, each with its reasoning, a progress bar against the tracker, and
// its trophies as chips that jump straight to their guides.

import { ROADMAP_STAGES, trophiesInStage } from "./roadmap.js";
import { isEarned } from "./store.js";
import { displayName } from "./filters.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderRoadmap(container, { trophies, state, onOpen }) {
  container.replaceChildren();
  const intro = el("div", "view-intro");
  intro.append(el("h2", "", "The road to the platinum"));
  intro.append(el("p", "", "Eight stages, built from the official descriptions: what to play first, what to sweep, and what to save for last. Stages are an order, not a lock — the tracker counts every trophy whenever you earn it."));
  container.append(intro);

  for (const stage of ROADMAP_STAGES) {
    const members = trophiesInStage(trophies, stage.n);
    const done = members.filter((trophy) => isEarned(trophy.id)).length;
    const card = el("section", "stage-card");
    const head = el("div", "stage-head");
    head.append(el("span", "stage-num", `Stage ${stage.n}`));
    head.append(el("h3", "stage-title", stage.title));
    head.append(el("span", "stage-progress", `${done} / ${members.length}`));
    card.append(head);
    card.append(el("p", "stage-blurb", stage.blurb));

    const track = el("div", "count-track");
    const fill = el("div", "count-fill");
    fill.style.width = `${members.length ? Math.round((done / members.length) * 100) : 0}%`;
    track.append(fill);
    card.append(track);

    const chips = el("div", "stage-chips");
    for (const trophy of members) {
      const earned = isEarned(trophy.id);
      const chip = el("button", `trophy-chip grade-${trophy.grade}${earned ? " is-earned" : ""}`, displayName(trophy, state, earned));
      chip.type = "button";
      chip.addEventListener("click", () => onOpen(trophy.id));
      chips.append(chip);
    }
    card.append(chips);
    container.append(card);
  }
}
