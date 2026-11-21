// filters.js — which trophies a view shows, and how a trophy's name and
// description are displayed under the spoiler setting. The spoiler rule:
// with spoilers on, an unearned story trophy shows as a masked "hidden
// trophy" until it is earned — the platinum excepted, since it is the goal
// of the whole guide rather than a plot point.

export const KIND_FILTERS = [
  { id: "all", label: "All" },
  { id: "story", label: "Story" },
  { id: "missable", label: "Missable" },
  { id: "collectibles", label: "Collectibles" },
  { id: "activities", label: "Activities" },
  { id: "online", label: "Online" },
];

export function isMasked(trophy, state, earned) {
  return state.spoilers && trophy.kind === "story" && trophy.id !== 1 && !earned;
}

export function displayName(trophy, state, earned) {
  return isMasked(trophy, state, earned) ? "Hidden trophy" : trophy.name;
}

export function displayDescription(trophy, state, earned) {
  return isMasked(trophy, state, earned)
    ? "Story trophy — its name and description stay hidden until you earn it."
    : trophy.description;
}

export function trophyMatches(trophy, filters, earned) {
  if (filters.kind === "missable") {
    if (trophy.missable === "no") return false;
  } else if (filters.kind !== "all") {
    if (trophy.kind !== filters.kind) return false;
  }
  if (filters.grade !== "all" && trophy.grade !== filters.grade) return false;
  if (filters.hideEarned && earned) return false;
  const query = filters.query.trim().toLowerCase();
  if (query) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

export function missableLevel(trophy) {
  if (trophy.missable === "flag") return { id: "flag", label: "Missable" };
  if (trophy.missable === "watch") return { id: "watch", label: "Watch" };
  return null;
}
