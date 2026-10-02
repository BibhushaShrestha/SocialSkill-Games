// ============================================================================
// generateQuestionArt.mjs
// ----------------------------------------------------------------------------
// Renders the Easy-band scenes in scripts/art/scenes.mjs to
// frontend/images/scenarios/<module>-<id>.svg.
//
// Illustrations cover the EASY items only (the ones carrying an `image` in
// backend/data/questions.js). Medium and Hard items are deliberately left
// text-only, so the visual scaffold is withdrawn as the child is moved to
// harder questions.
//
// Usage:  node scripts/generateQuestionArt.mjs
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { frame, person, assertWellFormed } from './art/primitives.mjs';
import { scenes } from './art/scenes.mjs';
import questionBank from '../backend/data/questions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'frontend', 'images', 'scenarios');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// which items get art: exactly those the bank marked with an `image`
// (the Easy band). The bank is the single source of truth, so this script
// can never drift from what the question data actually references.
// ---------------------------------------------------------------------------
const wanted = new Map();     // "module-id" -> item
const skipped = [];
for (const [module, items] of Object.entries(questionBank)) {
  for (const item of items) {
    const key = `${module}-${String(item.id).padStart(2, '0')}`;
    if (item.image) wanted.set(key, item);
    else skipped.push(`${key} (b=${item.difficulty})`);
  }
}

console.log(`illustrating ${wanted.size} Easy items, leaving ${skipped.length} text-only`);
console.log(`illustrated: ${[...wanted.keys()].join(', ')}\n`);

// ---------------------------------------------------------------------------
// render
// ---------------------------------------------------------------------------
function render(spec) {
  const layers = [
    ...(spec.add || []),
    ...(spec.ppl || []).map((o) => person(o)),
    ...(spec.bub || []),
  ];
  return frame(spec.m, layers.join(''), { night: !!spec.night });
}

const written = [];
const failures = [];

for (const [key, item] of wanted) {
  const spec = scenes[key];
  if (!spec) {
    failures.push(`${key}: no scene defined`);
    continue;
  }
  try {
    const svg = render(spec);
    assertWellFormed(svg, key);
    fs.writeFileSync(path.join(OUT_DIR, `${key}.svg`), svg);
    written.push(key);
  } catch (err) {
    failures.push(`${key}: ${err.message}`);
  }
}

// Scenes defined for Medium/Hard items are intentionally unused now that the
// illustration band is Easy-only, so this is informational, not an error.
const unusedScenes = Object.keys(scenes).filter((k) => !wanted.has(k));
// questions that want art but whose scene name does not match convention
const mismatched = [...wanted.keys()].filter((k) => !scenes[k]);

console.log(`rendered: ${written.length}/${wanted.size}`);
if (mismatched.length) failures.push(`no scene for wanted item(s): ${mismatched.join(', ')}`);
if (unusedScenes.length) console.log(`scenes unused (text-only Medium/Hard): ${unusedScenes.length}`);

if (failures.length) {
  console.error('\nPROBLEMS:');
  for (const f of failures) console.error('  ' + f);
  process.exitCode = 1;
}

// ---------------------------------------------------------------------------
// prune SVGs no question references any more, so the folder only ever holds
// real assets (no dead weight, no misleading leftovers)
// ---------------------------------------------------------------------------
let pruned = 0;
for (const file of fs.readdirSync(OUT_DIR)) {
  if (!file.endsWith('.svg')) continue;
  if (wanted.has(path.basename(file, '.svg'))) continue;
  fs.unlinkSync(path.join(OUT_DIR, file));
  pruned++;
}
if (pruned) console.log(`pruned ${pruned} unreferenced SVG(s)`);

// The bank owns the `image` field, written inline on each Easy question
// object. This script only renders the locally drawn ones it points at.
console.log(`\nart written to ${OUT_DIR}`);
if (failures.length) process.exit(1);
