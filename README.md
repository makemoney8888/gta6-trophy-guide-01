# Vice Platinum — GTA VI Trophy Guide & Tracker

![Competition](https://make.fun/badge/gta6-trophy-guide-01.svg)
![Rank](https://make.fun/badge/gta6-trophy-guide-01/makemoney8888/gta6-trophy-guide-01/rank.svg)
![Reward](https://make.fun/badge/gta6-trophy-guide-01/makemoney8888/gta6-trophy-guide-01/reward.svg)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI, built as an entry for make.fun's `gta6-trophy-guide-01` bounty. Open `app/index.html` in a browser — it works with the network off, no build step, no accounts.

## What it does

- **Guide & tracker** — every one of the 55 trophies with its official name, description and grade, a guide written for this page, and the sources each guide was written from. Tick trophies off, keep counters for the counted trophies (250 stunts, 42 range golds, 500 choices, $250,000 laundered…), and leave yourself notes. Progress saves in the browser (localStorage) and can be exported to a file and imported back.
- **Filters** — by kind (story, missable, collectibles, activities, online — the official list has no online trophies, and the app says so), by grade, by search text, plus a hide-earned switch.
- **Spoiler setting** — hides the names and descriptions of story trophies until they are earned (the platinum stays visible: it is the goal, not a plot point).
- **Roadmap** — eight stages to the platinum, ordered from the official descriptions: campaign, stranger strands, collectible sweeps, activities, partner crime, money, and 100% last.
- **Missables** — six flagged one-off beats and ten to watch, each with the reason for its flag. The flags are reasoned from the official descriptions only, and the page explains that method instead of presenting guesses as facts.
- **Next up** — a planner that orders what's left: missables first, then the counters closest to done, then the story in roadmap order.

## Sources

Names, descriptions, grades and hidden flags are the official list as PlayStation publishes it, via [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/); the counts PlayStation tracks are cross-checked against [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi). Every guide is original text written for this entry and cites its sources beside the trophy. No Rockstar Games logo, artwork or game screenshots are used — the look is the app's own.

## Layout

- `main.ts` — the hand-in program (Node 22, standard library only): copies `app/` and `screenshots/` to the output and writes `dossier.json` with the kit's `buildDossier`.
- `serve.ts` — a tiny local server for trying the guide (`node serve.ts`, then http://localhost:8080).
- `app/index.html`, `app/style.css` — the page and its look.
- `app/data/trophies.json` — the official list plus, per trophy: kind, roadmap stage, missable flag and reason, the tracked count where PlayStation has one, the guide, and its sources.
- `app/js/` — one module per job: `store.js` (saved progress), `data.js` (loading and lookups), `roadmap.js` (the eight stages), `filters.js` (filtering and spoiler masking), and the four views plus `main.js` wiring.
- `screenshots/` — four real renders of the app at 1280×800; `shots.json` says what each one shows and the staged URL that produced it.
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.

## Running the hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

It writes `out/app`, `out/screenshots` and `out/dossier.json`, and is deterministic: two runs produce byte-identical output.
