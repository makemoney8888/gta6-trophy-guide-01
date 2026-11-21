// roadmap.js — the road to the platinum, in eight stages. The order is built
// from the official descriptions alone: the campaign first (its chapters,
// named missions and the one-off beats that live inside it), then the
// stranger strands, then the exploration and collectible counts the
// descriptions name, the pastimes, the partner crime, the money, and 100%
// completion last, because nearly everything else feeds it.

export const ROADMAP_STAGES = [
  {
    n: 1,
    title: "Touchdown in Leonida",
    blurb: "The opening mission Gone Fishing and Chapter 1, plus one quiet Ocean Beach moment the list places at the story's start. Nothing here can be missed; settle in and learn the map.",
  },
  {
    n: 2,
    title: "The campaign trail",
    blurb: "Chapters 2 to 4, the named story missions and the final mission. This stage also holds every flagged one-off beat — the VCIA departure, the Rhino encounter, the pair's public moment and the choice counter — so play it with the missables page open.",
  },
  {
    n: 3,
    title: "Strangers of Leonida",
    blurb: "The stranger strands: the finals for Andy, Kenton, Billy, Randy and Tyrone, Cal's fishing challenge and Bret's hunt. Eight completed strands fill the Strangers & Freaks silver, so close strands out before the finale.",
  },
  {
    n: 4,
    title: "See the whole state",
    blurb: "The exploration counts the descriptions name: 52 areas of Leonida, 18 meditation spots, 3 card sets, 100 WAiNK locations and 100 discovered vehicles. Sweep them together, district by district.",
  },
  {
    n: 5,
    title: "Pastimes and proving grounds",
    blurb: "Activities and challenges: sample all 9 activity types, gold the 42 Shooting Range challenges, win the 14 drone races and 20 different races, ride out 250 stunts and 50 challenges, and bowl at Kolt & Associates.",
  },
  {
    n: 6,
    title: "Crime with a partner",
    blurb: "Free-roam feats, most of them with your partner: the jewelry store taken quietly, 5 bank vaults, an armored truck, one illegal operation per gang, and the wanted-level escapes. The partner trophies belong here, while the pair are together.",
  },
  {
    n: 7,
    title: "Money and property",
    blurb: "The economy trophies: launder $250,000 of marked bills, spend $100,000 across the shops, buy all 8 garage properties and register 10 vehicles to the Scooter Bros app. The late story's scores feed all four.",
  },
  {
    n: 8,
    title: "The long road",
    blurb: "100% completion, then the platinum it unlocks. By this stage the tracker should show a nearly full board; whatever category the game's completion screen says is short is the only work left.",
  },
];

export function stageOf(trophy) {
  return ROADMAP_STAGES.find((stage) => stage.n === trophy.stage) || ROADMAP_STAGES[0];
}

export function trophiesInStage(trophies, n) {
  return trophies.filter((trophy) => trophy.stage === n);
}
