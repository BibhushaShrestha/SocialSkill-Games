// ============================================================================
// generateScenarioArt.mjs
// ----------------------------------------------------------------------------
// Builds flat, unambiguous SVG illustrations for the LOW-difficulty questions
// of each module and writes them to frontend/images/scenarios/.
//
// Why generated art instead of stock photos:
//   * reliable offline (no hotlink rot, no CORS, no dead links)
//   * exact emotion/scenario is guaranteed - a stock photo of a child often has
//     an ambiguous expression, which is actively harmful for an ASD learner
//   * one consistent visual style across all 90 items, which reduces the
//     visual noise/variance that can make a scene hard to parse
//
// Every scene is built from the same primitives (char / bubble / prop*), so the
// characters look identical from item to item. Consistency is deliberate: it
// lowers the cognitive load of decoding the picture, leaving only the social
// reasoning as the variable being tested.
//
// Usage:  node scripts/generateScenarioArt.mjs
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '..', 'frontend', 'images', 'scenarios');

fs.mkdirSync(OUT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// palette
// ---------------------------------------------------------------------------
const SKIN = ['#F7D9BE', '#EDC4A0', '#D9A273', '#B87B4E', '#8D5A34'];
const HAIR = ['#3B2C22', '#6B4226', '#A9713C', '#1F1B18', '#C9A227'];
const SHIRT = ['#5DADE2', '#82C8A0', '#F5B041', '#EC8FA6', '#9B8EC4', '#58B8B0'];
const GROUND = '#EFD9A8';

const MODULE_BG = {
  greeting: ['#FFF6D0', '#FFE9A8'],
  sharing: ['#FFE7DA', '#FFD3BE'],
  waiting: ['#EFE6FF', '#DACBFF'],
  emotion: ['#E2F6E6', '#C4EED0'],
  communication: ['#FFE6EE', '#FFD2E2'],
};

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// minimal well-formedness check (stack based) so we never ship broken XML
function assertWellFormed(xml, name) {
  const stack = [];
  const re = /<\/?([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;
  let m;
  let cursor = 0;
  while ((m = re.exec(xml)) !== null) {
    // anything between tags must not contain a stray '<'
    const between = xml.slice(cursor, m.index);
    if (between.includes('<') || between.includes('>')) {
      throw new Error(`${name}: stray angle bracket in text: ${between.trim()}`);
    }
    cursor = re.lastIndex;
    const [full, tag, , selfClose] = m;
    if (full.startsWith('</')) {
      const open = stack.pop();
      if (open !== tag) {
        throw new Error(`${name}: expected </${open}> but found </${tag}>`);
      }
    } else if (!selfClose) {
      stack.push(tag);
    }
  }
  if (stack.length) {
    throw new Error(`${name}: unclosed tag(s): ${stack.join(', ')}`);
  }
}

// ---------------------------------------------------------------------------
// character primitive
// ---------------------------------------------------------------------------
// Local coordinate space: feet at (0,0), head centre at (0,-112).
const MOUTHS = {
  happy: (m) => `<path d="M -13 ${m} Q 0 ${m + 15} 13 ${m}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  sad: (m) => `<path d="M -13 ${m + 11} Q 0 ${m - 3} 13 ${m + 11}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  angry: (m) => `<path d="M -12 ${m + 10} L 12 ${m + 10}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  surprised: (m) => `<ellipse cx="0" cy="${m + 5}" rx="7" ry="9" fill="#8B4A3A"/>`,
  worried: (m) => `<path d="M -12 ${m + 9} Q 0 ${m - 1} 12 ${m + 9}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  neutral: (m) => `<path d="M -10 ${m + 6} L 10 ${m + 6}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
};

const BROWS = {
  angry: (e) =>
    `<path d="M -23 ${e - 15} L -8 ${e - 9} M 23 ${e - 15} L 8 ${e - 9}" stroke="#2C241C" stroke-width="4" stroke-linecap="round" fill="none"/>`,
  worried: (e) =>
    `<path d="M -23 ${e - 8} L -8 ${e - 15} M 23 ${e - 8} L 8 ${e - 15}" stroke="#2C241C" stroke-width="4" stroke-linecap="round" fill="none"/>`,
  surprised: (e) =>
    `<path d="M -23 ${e - 17} L -8 ${e - 17} M 23 ${e - 17} L 8 ${e - 17}" stroke="#2C241C" stroke-width="4" stroke-linecap="round" fill="none"/>`,
};

function arm(side, rot, skin, shirt, len = 44) {
  return `<g transform="translate(${side * 32},-70) rotate(${rot})"><rect x="-8" y="0" width="16" height="${len}" rx="8" fill="${shirt}"/><circle cx="0" cy="${len}" r="9" fill="${skin}"/></g>`;
}

function char({
  x = 200,
  y = 252,
  s = 1,
  skin = SKIN[0],
  shirt = SHIRT[0],
  hair = HAIR[0],
  mood = 'happy',
  gesture = 'down',
  flip = false,
}) {
  const t = [];
  const headY = -112;
  const eyeY = headY - 6;
  const mouthY = headY + 4;

  // legs + body
  t.push(`<rect x="-26" y="-34" width="20" height="34" rx="9" fill="#42506B"/>`);
  t.push(`<rect x="6" y="-34" width="20" height="34" rx="9" fill="#42506B"/>`);
  t.push(`<path d="M -35 0 L -35 -60 Q -35 -80 -15 -80 L 15 -80 Q 35 -80 35 -60 L 35 0 Z" fill="${shirt}"/>`);

  // arms by gesture
  if (gesture === 'wave') {
    t.push(arm(-1, 8, skin, shirt));
    t.push(arm(1, -155, skin, shirt));
  } else if (gesture === 'open') {
    t.push(arm(-1, 28, skin, shirt));
    t.push(arm(1, -28, skin, shirt));
  } else if (gesture === 'reach') {
    t.push(arm(-1, 8, skin, shirt));
    t.push(arm(1, -38, skin, shirt));
  } else if (gesture === 'up') {
    t.push(arm(-1, 150, skin, shirt));
    t.push(arm(1, -150, skin, shirt));
  } else if (gesture === 'point') {
    t.push(arm(-1, 8, skin, shirt));
    t.push(arm(1, -72, skin, shirt));
  } else {
    t.push(arm(-1, 8, skin, shirt));
    t.push(arm(1, -8, skin, shirt));
  }

  // head, hair, face
  t.push(`<circle cx="0" cy="${headY}" r="40" fill="${skin}"/>`);
  t.push(
    `<path d="M -40 ${headY - 4} Q -40 ${headY - 47} 0 ${headY - 47} Q 40 ${headY - 47} 40 ${headY - 4} Q 31 ${headY - 21} 13 ${headY - 19} Q -5 ${headY - 17} -20 ${headY - 25} Q -33 ${headY - 19} -40 ${headY - 4} Z" fill="${hair}"/>`
  );
  if (BROWS[mood]) t.push(BROWS[mood](eyeY));
  t.push(`<circle cx="-14" cy="${eyeY}" r="5.5" fill="#2C241C"/>`);
  t.push(`<circle cx="14" cy="${eyeY}" r="5.5" fill="#2C241C"/>`);
  t.push(`<circle cx="12" cy="${eyeY - 2}" r="1.9" fill="#fff"/>`);
  t.push(`<circle cx="-16" cy="${eyeY - 2}" r="1.9" fill="#fff"/>`);
  t.push(`<circle cx="-26" cy="${eyeY + 17}" r="6.5" fill="#F09A9A" opacity=".45"/>`);
  t.push(`<circle cx="26" cy="${eyeY + 17}" r="6.5" fill="#F09A9A" opacity=".45"/>`);
  t.push(MOUTHS[mood](mouthY));

  return `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">${t.join('')}</g>`;
}

// ---------------------------------------------------------------------------
// speech bubble
// ---------------------------------------------------------------------------
function bubble({ x = 200, y = 40, w = 130, h = 46, text = '', size = 17, fill = '#FFFFFF', stroke = '#8FA9C4' }) {
  const r = 14;
  const tail = `<path d="M ${x - 12} ${y + h - 2} L ${x - 4} ${y + h + 18} L ${x + 12} ${y + h - 2} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  const box = `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
  // shrink font for longer strings so text always fits the bubble
  const auto = Math.max(11, Math.min(size, Math.floor((w - 20) / (text.length * 0.56))));
  const label = `<text x="${x}" y="${y + h / 2 + auto * 0.36}" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" font-size="${auto}" font-weight="700" fill="#2C3E50">${esc(text)}</text>`;
  return `${box}${tail}${label}`;
}

// ---------------------------------------------------------------------------
// props
// ---------------------------------------------------------------------------
const prop = {
  ball: (x, y) =>
    `<circle cx="${x}" cy="${y}" r="24" fill="#E86A5C"/><path d="M ${x - 24} ${y} Q ${x} ${y - 16} ${x + 24} ${y} Q ${x} ${y + 16} ${x - 24} ${y} Z" fill="#F2A65A"/><circle cx="${x}" cy="${y}" r="24" fill="none" stroke="#C8503F" stroke-width="3"/>`,

  pencil: (x, y, rot = 0) =>
    `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="-8" y="-46" width="16" height="66" rx="3" fill="#F5C542"/><path d="M -8 20 L 0 40 L 8 20 Z" fill="#F7E3C0"/><path d="M -3 34 L 0 40 L 3 34 Z" fill="#3B2C22"/><rect x="-8" y="-52" width="16" height="10" rx="3" fill="#E58E9A"/></g>`,

  snackBag: (x, y) =>
    `<path d="M ${x - 26} ${y - 30} L ${x + 26} ${y - 30} L ${x + 22} ${y + 30} L ${x - 22} ${y + 30} Z" fill="#F2C14E" stroke="#C99B25" stroke-width="3"/><path d="M ${x - 26} ${y - 30} L ${x - 18} ${y - 44} L ${x + 26} ${y - 30} Z" fill="#E8B23A"/><circle cx="${x}" cy="${y + 4}" r="10" fill="#FFF3D6"/>`,

  crayonBox: (x, y) =>
    `<g><rect x="${x - 46}" y="${y - 8}" width="92" height="34" rx="6" fill="#C8A2E0" stroke="#9A75B5" stroke-width="3"/><rect x="${x - 30}" y="${y - 40}" width="14" height="34" rx="3" fill="#E86A5C"/><rect x="${x - 8}" y="${y - 46}" width="14" height="40" rx="3" fill="#5DADE2"/><rect x="${x + 14}" y="${y - 40}" width="14" height="34" rx="3" fill="#58B8B0"/></g>`,

  clock: (x, y, r = 30) =>
    `<g><circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" stroke="#42506B" stroke-width="5"/><path d="M ${x} ${y} L ${x} ${y - r * 0.5}" stroke="#42506B" stroke-width="5" stroke-linecap="round"/><path d="M ${x} ${y} L ${x + r * 0.42} ${y + r * 0.2}" stroke="#E86A5C" stroke-width="4" stroke-linecap="round"/></g>`,

  heart: (x, y, s = 1, fill = '#E8697D') =>
    `<path transform="translate(${x},${y}) scale(${s})" d="M 0 12 C -22 -4 -14 -22 0 -12 C 14 -22 22 -4 0 12 Z" fill="${fill}"/>`,

  heartRow: (x, y) =>
    `${prop.heart(x - 34, y, 0.9)}${prop.heart(x, y - 10, 1.15)}${prop.heart(x + 34, y, 0.9)}`,

  lightning: (x, y) =>
    `<path d="M ${x + 4} ${y - 44} L ${x - 18} ${y + 4} L ${x - 2} ${y + 4} L ${x - 8} ${y + 46} L ${x + 18} ${y - 6} L ${x + 2} ${y - 6} Z" fill="#F5C542" stroke="#C99B25" stroke-width="3" stroke-linejoin="round"/>`,

  rain: (x, y) =>
    [0, 1, 2, 3]
      .map((i) => `<path d="M ${x - 40 + i * 26} ${y} l -8 20" stroke="#5DADE2" stroke-width="4" stroke-linecap="round"/>`)
      .join(''),

  book: (x, y, rot = 0) =>
    `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M -34 -22 L 0 -16 L 0 20 L -34 14 Z" fill="#FFFFFF" stroke="#42506B" stroke-width="3"/><path d="M 34 -22 L 0 -16 L 0 20 L 34 14 Z" fill="#F2F6FA" stroke="#42506B" stroke-width="3"/><path d="M 0 -16 L 0 20" stroke="#42506B" stroke-width="3"/></g>`,

  slide: (x, y) =>
    `<g><path d="M ${x - 40} ${y - 46} L ${x + 34} ${y + 6} L ${x + 20} ${y + 16} L ${x - 52} ${y - 36} Z" fill="#82C8A0" stroke="#4E9A72" stroke-width="3" stroke-linejoin="round"/><path d="M ${x - 30} ${y - 34} L ${x - 30} ${y + 24} M ${x + 4} ${y - 10} L ${x + 4} ${y + 24}" stroke="#4E9A72" stroke-width="4" stroke-linecap="round"/></g>`,

  table: (x, y) =>
    `<g><rect x="${x - 70}" y="${y - 8}" width="140" height="12" rx="5" fill="#C98F5C"/><rect x="${x - 58}" y="${y + 4}" width="10" height="34" rx="4" fill="#A9743F"/><rect x="${x + 48}" y="${y + 4}" width="10" height="34" rx="4" fill="#A9743F"/></g>`,

  queueMark: (x, y) =>
    [0, 1, 2]
      .map((i) => `<circle cx="${x + i * 30}" cy="${y}" r="9" fill="none" stroke="#8FA9C4" stroke-width="4"/>`)
      .join(''),

  bigFace: (x, y, mood, r = 74) =>
    `<g transform="translate(${x},${y}) scale(${r / 100})">` +
    `<circle cx="0" cy="0" r="100" fill="#F7D9BE" stroke="#D9A273" stroke-width="5"/>` +
    (BROWS[mood] ? BROWS[mood](-30) : '') +
    `<circle cx="-34" cy="-22" r="12" fill="#2C241C"/><circle cx="34" cy="-22" r="12" fill="#2C241C"/>` +
    `<circle cx="-29" cy="-27" r="4" fill="#fff"/><circle cx="39" cy="-27" r="4" fill="#fff"/>` +
    `<circle cx="-56" cy="18" r="14" fill="#F09A9A" opacity=".45"/><circle cx="56" cy="18" r="14" fill="#F09A9A" opacity=".45"/>` +
    MOUTHS[mood](42) +
    `</g>`,

  tear: (x, y) => `<path d="M ${x} ${y} q 9 14 0 20 q -9 -6 0 -20 Z" fill="#5DADE2"/>`,

  ear: (x, y) =>
    `<g><path d="M ${x} ${y - 26} q 30 6 30 30 q 0 26 -22 26 q -14 0 -16 -14 q -2 -12 12 -14" fill="#F7D9BE" stroke="#D9A273" stroke-width="4" stroke-linejoin="round"/><path d="M ${x + 8} ${y - 10} q 14 6 12 18" fill="none" stroke="#D9A273" stroke-width="4" stroke-linecap="round"/></g>`,

  soundWaves: (x, y) =>
    [16, 28, 40]
      .map((r, i) => `<path d="M ${x} ${y - r} q ${r * 0.7} ${r} 0 ${r * 2}" fill="none" stroke="#5DADE2" stroke-width="5" stroke-linecap="round" opacity="${1 - i * 0.22}"/>`)
      .join(''),
};

// ---------------------------------------------------------------------------
// scene frame
// ---------------------------------------------------------------------------
function frame(module, inner, { ground = true } = {}) {
  const [c1, c2] = MODULE_BG[module] || ['#FFF6D0', '#FFE9A8'];
  const defs = `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs>`;
  const shadow = ground ? `<ellipse cx="200" cy="256" rx="168" ry="17" fill="#000" opacity=".07"/>` : '';
  const floor = ground ? `<rect x="0" y="248" width="400" height="52" fill="${GROUND}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300" role="img">${defs}<rect width="400" height="300" fill="url(#bg)"/>${floor}${shadow}${inner}</svg>`;
}

// ---------------------------------------------------------------------------
// scenes  (only low-difficulty items get art)
// ---------------------------------------------------------------------------
const P = (x, y, o = {}) => Object.assign({ x, y }, o);

const scenes = {
  // ---------------- GREETING ----------------
  'greeting-01': () => frame('greeting',
    char(P(128, 250, { mood: 'happy', gesture: 'wave', shirt: SHIRT[0], skin: SKIN[0], hair: HAIR[0] })) +
    char(P(272, 250, { mood: 'happy', gesture: 'down', shirt: SHIRT[3], skin: SKIN[2], hair: HAIR[1] })) +
    bubble(P(122, 96, { text: 'Hi!', w: 82, h: 42, size: 22 }))),

  'greeting-02': () => frame('greeting',
    char(P(128, 250, { mood: 'happy', gesture: 'wave', shirt: SHIRT[3], skin: SKIN[2], hair: HAIR[1] })) +
    char(P(272, 250, { mood: 'happy', gesture: 'wave', shirt: SHIRT[1], skin: SKIN[0], hair: HAIR[0] }))),

  'greeting-03': () => frame('greeting',
    char(P(200, 254, { mood: 'happy', gesture: 'open', shirt: SHIRT[2], skin: SKIN[1], hair: HAIR[2] })) +
    bubble(P(200, 92, { text: 'Hello!', w: 118, h: 46, size: 22 }))),

  'greeting-04': () => frame('greeting',
    char(P(120, 250, { mood: 'happy', gesture: 'wave', shirt: SHIRT[4], skin: SKIN[0], hair: HAIR[3] })) +
    char(P(280, 250, { mood: 'neutral', gesture: 'down', shirt: SHIRT[1], skin: SKIN[3], hair: HAIR[0] })) +
    bubble(P(112, 100, { text: 'Hi!', w: 78, h: 40, size: 21 }))),

  'greeting-05': () => frame('greeting',
    char(P(130, 250, { mood: 'happy', gesture: 'open', shirt: SHIRT[3], skin: SKIN[2], hair: HAIR[1] })) +
    char(P(272, 250, { mood: 'happy', gesture: 'down', shirt: SHIRT[0], skin: SKIN[0], hair: HAIR[0] })) +
    bubble(P(126, 94, { text: 'Hi!', w: 84, h: 42, size: 21 }))),

  'greeting-06': () => frame('greeting',
    char(P(190, 252, { mood: 'happy', gesture: 'open', shirt: SHIRT[4], skin: SKIN[1], hair: HAIR[2] })) +
    char(P(316, 254, { mood: 'neutral', gesture: 'down', shirt: SHIRT[1], skin: SKIN[0], hair: HAIR[3] })) +
    bubble(P(172, 84, { text: 'Good morning!', w: 156, h: 46, size: 19 }))),

  'greeting-07': () => frame('greeting',
    char(P(112, 252, { mood: 'neutral', gesture: 'reach', shirt: SHIRT[1], skin: SKIN[1], hair: HAIR[0] })) +
    prop.book(190, 176, -8) + prop.book(190, 196, 6) +
    char(P(292, 252, { mood: 'happy', gesture: 'wave', shirt: SHIRT[3], skin: SKIN[2], hair: HAIR[1] })) +
    bubble(P(296, 88, { text: 'Hello!', w: 112, h: 44, size: 20 }))),

  // ---------------- SHARING ----------------
  'sharing-01': () => frame('sharing',
    char(P(112, 250, { mood: 'happy', gesture: 'reach', shirt: SHIRT[0], skin: SKIN[0], hair: HAIR[0] })) +
    prop.ball(214, 168) +
    char(P(288, 250, { mood: 'happy', gesture: 'reach', shirt: SHIRT[2], skin: SKIN[3], hair: HAIR[2] }))),

  'sharing-02': () => frame('sharing',
    char(P(116, 250, { mood: 'happy', gesture: 'point', shirt: SHIRT[3], skin: SKIN[2], hair: HAIR[1] })) +
    prop.pencil(206, 164, 18) +
    char(P(290, 250, { mood: 'worried', gesture: 'down', shirt: SHIRT[1], skin: SKIN[0], hair: HAIR[0] }))),

  'sharing-03': () => frame('sharing',
    char(P(132, 250, { mood: 'happy', gesture: 'open', shirt: SHIRT[0], skin: SKIN[0], hair: HAIR[0] })) +
    char(P(268, 250, { mood: 'happy', gesture: 'open', shirt: SHIRT[1], skin: SKIN[3], hair: HAIR[2] })) +
    prop.heartRow(200, 118)),

  'sharing-04': () => frame('sharing',
    char(P(126, 252, { mood: 'happy', gesture: 'reach', shirt: SHIRT[2], skin: SKIN[1], hair: HAIR[0] })) +
    prop.snackBag(220, 172) +
    char(P(292, 252, { mood: 'happy', gesture: 'reach', shirt: SHIRT[4], skin: SKIN[2], hair: HAIR[1] }))),

  'sharing-05': () => frame('sharing',
    char(P(132, 250, { mood: 'happy', gesture: 'open', shirt: SHIRT[3], skin: SKIN[0], hair: HAIR[0] })) +
    char(P(268, 250, { mood: 'happy', gesture: 'open', shirt: SHIRT[1], skin: SKIN[2], hair: HAIR[1] })) +
    prop.heart(200, 116, 1.5)),

  'sharing-06': () => frame('sharing',
    char(P(118, 252, { mood: 'happy', gesture: 'reach', shirt: SHIRT[1], skin: SKIN[1], hair: HAIR[2] })) +
    prop.crayonBox(228, 170) +
    char(P(320, 252, { mood: 'worried', gesture: 'down', shirt: SHIRT[0], skin: SKIN[3], hair: HAIR[0] }))),

  // ---------------- WAITING ----------------
  'waiting-01': () => frame('waiting',
    char(P(120, 250, { mood: 'happy', gesture: 'point', shirt: SHIRT[0], skin: SKIN[0], hair: HAIR[0] })) +
    bubble(P(120, 96, { text: 'Hello...', w: 120, h: 42, size: 18 })) +
    char(P(286, 250, { mood: 'neutral', gesture: 'down', shirt: SHIRT[4], skin: SKIN[2], hair: HAIR[1] }))),

  'waiting-02': () => frame('waiting',
    char(P(74, 250, { mood: 'neutral', gesture: 'down', shirt: SHIRT[1], skin: SKIN[1], hair: HAIR[0] })) +
    char(P(166, 250, { mood: 'neutral', gesture: 'down', shirt: SHIRT[2], skin: SKIN[2], hair: HAIR[1] })) +
    char(P(258, 250, { mood: 'neutral', gesture: 'down', shirt: SHIRT[4], skin: SKIN[3], hair: HAIR[2] })) +
    char(P(350, 250, { mood: 'happy', gesture: 'down', shirt: SHIRT[0], skin: SKIN[0], hair: HAIR[3] }))),

  'waiting-03': () => frame('waiting',
    char(P(150, 252, { mood: 'happy', gesture: 'open', shirt: SHIRT[1], skin: SKIN[1], hair: HAIR[0] })) +
    prop.clock(288, 150) +
    bubble(P(150, 92, { text: 'My turn soon!', w: 158, h: 42, size: 17 }))),

  'waiting-04': () => frame('waiting',
    prop.table(200, 214) +
    char(P(120, 206, { s: 0.82, mood: 'neutral', gesture: 'down', shirt: SHIRT[0], skin: SKIN[0], hair: HAIR[0] })) +
    char(P(280, 206, { s: 0.82, mood: 'happy', gesture: 'down', shirt: SHIRT[3], skin: SKIN[2], hair: HAIR[1] })) +
    prop.clock(200, 96, 26)),

  'waiting-05': () => frame('waiting',
    prop.slide(150, 150) +
    char(P(250, 250, { mood: 'happy', gesture: 'open', shirt: SHIRT[2], skin: SKIN[1], hair: HAIR[2] })) +
    char(P(342, 250, { mood: 'neutral', gesture: 'down', shirt: SHIRT[4], skin: SKIN[3], hair: HAIR[0] }))),

  'waiting-06': () => frame('waiting',
    char(P(118, 244, { mood: 'neutral', gesture: 'down', shirt: SHIRT[1], skin: SKIN[0], hair: HAIR[0] })) +
    char(P(292, 244, { mood: 'happy', gesture: 'up', shirt: SHIRT[4], skin: SKIN[2], hair: HAIR[1] })) +
    bubble(P(292, 92, { text: 'May I ask a question?', w: 196, h: 42, size: 15 }))),

  // ---------------- EMOTION ----------------
  'emotion-01': () => frame('emotion',
    prop.bigFace(140, 146, 'sad', 66) +
    prop.tear(196, 176) +
    char(P(296, 252, { mood: 'worried', gesture: 'reach', shirt: SHIRT[1], skin: SKIN[1], hair: HAIR[0] }))),

  'emotion-02': () => frame('emotion',
    prop.bigFace(200, 148, 'happy', 86) +
    prop.heart(200, 250, 1.1)),

  'emotion-03': () => frame('emotion',
    prop.bigFace(200, 142, 'sad', 86) +
    prop.tear(142, 186) + prop.tear(258, 186)),

  'emotion-04': () => frame('emotion',
    prop.bigFace(200, 148, 'angry', 86)),

  'emotion-05': () => frame('emotion',
    prop.bigFace(160, 148, 'neutral', 66) +
    prop.heart(288, 148, 1.5)),

  'emotion-06': () => frame('emotion',
    char(P(196, 252, { mood: 'worried', gesture: 'up', shirt: SHIRT[4], skin: SKIN[1], hair: HAIR[0] })) +
    prop.lightning(326, 118) +
    prop.rain(326, 208)),

  // ---------------- COMMUNICATION ----------------
  'communication-01': () => frame('communication',
    char(P(132, 252, { mood: 'worried', gesture: 'up', shirt: SHIRT[0], skin: SKIN[0], hair: HAIR[0] })) +
    char(P(292, 252, { mood: 'neutral', gesture: 'down', shirt: SHIRT[1], skin: SKIN[2], hair: HAIR[1] })) +
    bubble(P(132, 92, { text: 'Please?', w: 106, h: 42, size: 19 }))),

  'communication-02': () => frame('communication',
    char(P(120, 250, { mood: 'happy', gesture: 'open', shirt: SHIRT[2], skin: SKIN[1], hair: HAIR[0] })) +
    bubble(P(120, 96, { text: 'Hello!', w: 108, h: 42, size: 19 })) +
    char(P(284, 250, { mood: 'happy', gesture: 'open', shirt: SHIRT[4], skin: SKIN[3], hair: HAIR[1] })) +
    bubble(P(288, 96, { text: 'Hi!', w: 84, h: 42, size: 19 }))),

  'communication-03': () => frame('communication',
    char(P(200, 256, { mood: 'happy', gesture: 'open', shirt: SHIRT[3], skin: SKIN[1], hair: HAIR[0] })) +
    bubble(P(200, 84, { text: 'Please', w: 138, h: 50, size: 23 }))),

  'communication-04': () => frame('communication',
    char(P(160, 252, { mood: 'neutral', gesture: 'down', shirt: SHIRT[1], skin: SKIN[1], hair: HAIR[0], flip: true })) +
    prop.soundWaves(258, 140)),

  'communication-05': () => frame('communication',
    char(P(120, 250, { mood: 'happy', gesture: 'point', shirt: SHIRT[0], skin: SKIN[0], hair: HAIR[0] })) +
    bubble(P(112, 94, { text: 'I am happy!', w: 148, h: 42, size: 17 })) +
    char(P(288, 250, { mood: 'happy', gesture: 'down', shirt: SHIRT[2], skin: SKIN[2], hair: HAIR[1] }))),

  'communication-06': () => frame('communication',
    char(P(118, 250, { mood: 'worried', gesture: 'reach', shirt: SHIRT[3], skin: SKIN[0], hair: HAIR[0] })) +
    char(P(288, 250, { mood: 'neutral', gesture: 'down', shirt: SHIRT[1], skin: SKIN[2], hair: HAIR[1] })) +
    bubble(P(122, 92, { text: 'Sorry!', w: 108, h: 44, size: 20 }))),
};

// ---------------------------------------------------------------------------
// emit
// ---------------------------------------------------------------------------
let written = 0;
const failures = [];

for (const [name, build] of Object.entries(scenes)) {
  try {
    const svg = build();
    assertWellFormed(svg, name);
    fs.writeFileSync(path.join(OUT_DIR, `${name}.svg`), svg);
    written++;
  } catch (err) {
    failures.push(`${name}: ${err.message}`);
  }
}

console.log(`Generated ${written}/${Object.keys(scenes).length} SVGs -> ${OUT_DIR}`);
if (failures.length) {
  console.error('\nFAILURES:');
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}