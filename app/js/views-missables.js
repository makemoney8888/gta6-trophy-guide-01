// views-missables.js — every trophy the guide flags, with the reason for
// its flag. The method matters more than the list: flags are reasoned from
// the official descriptions only, and the page says so, because at launch
// nobody can confirm what the finished game makes unobtainable.

import { GRADE_LABELS } from "./data.js";
import { isEarned } from "./store.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderGroup(container, { title, blurb, trophies, onOpen }) {
  const section = el("section", "missable-group");
  section.append(el("h3", "", title));
  section.append(el("p", "group-blurb", blurb));
  if (trophies.length === 0) section.append(el("p", "empty-note", "Nothing in this group."));
  for (const trophy of trophies) {
    const earned = isEarned(trophy.id);
    const row = el("article", `missable-row${earned ? " is-earned" : ""}`);
    const main = el("div", "missable-main");
    const head = el("div", "trophy-head");
    head.append(el("span", `grade-chip grade-${trophy.grade}`, GRADE_LABELS[trophy.grade]));
    head.append(el("h4", "trophy-name", trophy.name));
    if (earned) head.append(el("span", "earned-badge", "Earned"));
    main.append(head);
    main.append(el("p", "trophy-desc", trophy.description));
    main.append(el("p", "missable-reason", trophy.missableNote || ""));
    row.append(main);
    const open = el("button", "open-guide-btn", "Open guide");
    open.type = "button";
    open.addEventListener("click", () => onOpen(trophy.id));
    row.append(open);
    section.append(row);
  }
  container.append(section);
}

export function renderMissables(container, { trophies, onOpen }) {
  container.replaceChildren();
  const intro = el("div", "view-intro");
  intro.append(el("h2", "", "Missables — flagged from the descriptions"));
  const method = el("p", "");
  method.textContent = "How to read this page: every flag below is reasoned from the trophy's official description alone — the person, place, moment or choice its wording ties it to. Nothing here is confirmed unobtainable; at launch, no guide can know that. 'Missable' means the wording describes a one-off beat. 'Watch' means it is tied to a strand, a partner or a moment the story can move past, so the safe order is to do it while the story is live.";
  intro.append(method);
  container.append(intro);

  renderGroup(container, {
    title: "Missable — one-off beats",
    blurb: "Six trophies whose descriptions name a single moment. Play these beats when the game offers them.",
    trophies: trophies.filter((trophy) => trophy.missable === "flag"),
    onOpen,
  });
  renderGroup(container, {
    title: "Watch — strands, partners and moments",
    blurb: "Ten trophies tied to a stranger's strand, to having your partner along, or to one quiet spot. None are hard; all are easy to leave behind.",
    trophies: trophies.filter((trophy) => trophy.missable === "watch"),
    onOpen,
  });
}
