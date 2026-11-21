// Vice Platinum — the GTA VI trophy guide and tracker, handed in for
// gta6-trophy-guide-01. The guide itself is the app/ folder beside this
// file: plain static files (ES modules, one stylesheet, one JSON data
// file) that open at app/index.html in a browser with the network off.
// This program's whole job is the hand-in: copy app/ and screenshots/
// into the output directory and write dossier.json there with the kit's
// buildDossier, byte for byte as the scorer's own copy would write it —
// which is why vendor/makefun-frontend.ts is never touched.
//
// Node 22, standard library only; nothing is installed before it runs.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate's caps, passed to buildDossier so an entry the scorer would
// refuse is refused here first: at most 4 screenshots of at most 256 KiB,
// at most 993 files and directories in app/ and 48 MiB of app files, and
// the dossier text capped at 160 KiB.
const DOSSIER_OPTIONS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};

mkdirSync(outputDir, { recursive: true });
// Clear whatever a previous run left in the output's app/ and screenshots/
// before copying: the grader runs this program twice and compares bytes,
// and a stale file from an earlier hand-in must never leak into a later one.
rmSync(join(outputDir, 'app'), { recursive: true, force: true });
rmSync(join(outputDir, 'screenshots'), { recursive: true, force: true });
cpSync(join(repoDir, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoDir, 'screenshots'))) {
  cpSync(join(repoDir, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

const dossier = buildDossier(outputDir, DOSSIER_OPTIONS);
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log(`vice-platinum: dossier.json written (${dossier.length} bytes) to ${outputDir}`);
