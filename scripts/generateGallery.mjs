// Builds frontend/gallery.html — a contact sheet of every illustrated item.
// Dev/review tool: lets you eyeball all scenario art in one page.
//
// Usage:  node scripts/generateGallery.mjs
// Then open http://localhost:5000/gallery.html

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import questionBank from '../backend/data/questions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ART_DIR = path.join(ROOT, 'frontend', 'images', 'scenarios');
const OUT = path.join(ROOT, 'frontend', 'gallery.html');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const cards = [];
let count = 0;

for (const [module, items] of Object.entries(questionBank)) {
  for (const item of items) {
    if (!item.image) continue;
    count++;
    const file = path.basename(item.image);
    if (!fs.existsSync(path.join(ART_DIR, file))) {
      console.warn(`  ! art missing on disk: ${file} (skipped ${module}:${item.id})`);
      continue;
    }
    cards.push(`
      <figure class="card">
        <div class="frame"><img src="${esc(item.image)}" alt="${esc(file)}" loading="lazy"></div>
        <figcaption>
          <span class="tag">${esc(module)} &middot; id ${item.id}</span>
          <span class="b">b = ${item.difficulty}</span>
          <p class="q">${esc(item.q)}</p>
        </figcaption>
      </figure>`);
  }
}

const byModule = Object.entries(
  Object.fromEntries(
    Object.entries(questionBank).map(([m, items]) => [m, items.filter((i) => i.image).length])
  )
)
  .map(([m, n]) => `${m} ${n}`)
  .join(' &middot; ');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Scenario art review</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 28px;
    font-family: Verdana, "DejaVu Sans", sans-serif;
    background: #f4f7fb; color: #24303f;
  }
  h1 { margin: 0 0 6px; font-size: 24px; }
  .sub { margin: 0 0 24px; color: #5b6b80; font-size: 14px; }
  .sub code { background: #e6ecf5; padding: 2px 6px; border-radius: 4px; }
  .grid {
    display: grid; gap: 18px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  .card {
    margin: 0; background: #fff; border-radius: 14px; overflow: hidden;
    box-shadow: 0 1px 3px rgba(20, 35, 60, .12);
    display: flex; flex-direction: column;
  }
  .frame { background: #eef2f7; display: block; }
  .frame img { display: block; width: 100%; height: auto; }
  figcaption { padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 4px; }
  .tag { font-size: 11px; font-weight: 700; letter-spacing: .04em;
         text-transform: uppercase; color: #5b6b80; }
  .b { font-size: 11px; color: #fff; background: #4a90d9;
       padding: 1px 7px; border-radius: 10px; align-self: flex-start; }
  .q { margin: 4px 0 0; font-size: 13px; line-height: 1.45; }
</style>
</head>
<body>
  <h1>Scenario art review</h1>
  <p class="sub">
    ${count} illustrated items (difficulty &le; 0) &mdash; ${byModule}.<br>
    These SVGs are what a child sees above the question text. Served from
    <code>/images/scenarios/</code>.
  </p>
  <div class="grid">${cards.join('')}
  </div>
</body>
</html>
`;

fs.writeFileSync(OUT, html);
console.log(`Wrote ${OUT} with ${cards.length} cards`);
