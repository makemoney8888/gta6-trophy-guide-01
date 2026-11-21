// data.js — loads the guide's data file (app/data/trophies.json, which holds
// the official trophy list and the guide written for each trophy) and offers
// the small lookups every view needs.

export const GRADE_ORDER = ["platinum", "gold", "silver", "bronze"];

export const GRADE_LABELS = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
};

export const KIND_LABELS = {
  story: "Story",
  missable: "Missable",
  collectibles: "Collectibles",
  activities: "Activities",
  online: "Online",
};

export async function loadGuideData() {
  const response = await fetch("data/trophies.json");
  if (!response.ok) throw new Error(`trophies.json: ${response.status}`);
  const doc = await response.json();
  const trophies = Array.isArray(doc) ? doc : doc.trophies;
  return { doc, trophies };
}

export function trophyById(trophies, id) {
  return trophies.find((trophy) => trophy.id === id) || null;
}

export function formatCount(value) {
  return Number(value).toLocaleString("en-US");
}

export function gradeCounts(trophies) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) counts[trophy.grade] = (counts[trophy.grade] || 0) + 1;
  return counts;
}
