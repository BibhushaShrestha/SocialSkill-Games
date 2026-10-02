// ============================================================================
// art/primitives.mjs
// ----------------------------------------------------------------------------
// Shared drawing vocabulary for every question illustration.
//
// Design constraints for an ASD learner:
//   * ONE visual language. The same character builder draws every person in
//     all 85 images, so decoding "who is speaking / how do they feel" stays
//     cheap and the only variable is the social situation.
//   * Moods are shown with large, unambiguous geometry (brow angle + mouth
//     curve + cheeks). A real photo of a child's face is often ambiguous,
//     which is actively harmful when the face IS the question.
//   * Scenes illustrate the SITUATION, never the correct answer, so the
//     picture cannot be used to skip the reasoning.
// ============================================================================

export const SKIN = ['#F7D9BE', '#EDC4A0', '#D9A273', '#B87B4E', '#8D5A34'];
export const HAIR = ['#3B2C22', '#6B4226', '#A9713C', '#1F1B18', '#C9A227'];
export const SHIRT = ['#5DADE2', '#82C8A0', '#F5B041', '#EC8FA6', '#9B8EC4', '#58B8B0'];
const GROUND = '#EFD9A8';

export const BG = {
  greeting: ['#FFF6D0', '#FFE9A8'],
  sharing: ['#FFE7DA', '#FFD3BE'],
  waiting: ['#EFE6FF', '#DACBFF'],
  emotion: ['#E2F6E6', '#C4EED0'],
  communication: ['#FFE6EE', '#FFD2E2'],
};

export const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Stack-based well-formedness check so we never ship broken XML. */
export function assertWellFormed(xml, name) {
  const stack = [];
  const re = /<\/?([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;
  let m;
  let cursor = 0;
  while ((m = re.exec(xml)) !== null) {
    const between = xml.slice(cursor, m.index);
    if (between.includes('<') || between.includes('>')) {
      throw new Error(`${name}: stray angle bracket in text`);
    }
    cursor = re.lastIndex;
    const [full, tag, , selfClose] = m;
    if (full.startsWith('</')) {
      const open = stack.pop();
      if (open !== tag) throw new Error(`${name}: expected </${open}> found </${tag}>`);
    } else if (!selfClose) stack.push(tag);
  }
  if (stack.length) throw new Error(`${name}: unclosed ${stack.join(', ')}`);
}

// ---------------------------------------------------------------------------
// faces
// ---------------------------------------------------------------------------
const MOUTHS = {
  happy: (m) => `<path d="M -13 ${m} Q 0 ${m + 15} 13 ${m}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  sad: (m) => `<path d="M -13 ${m + 11} Q 0 ${m - 3} 13 ${m + 11}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  angry: (m) => `<path d="M -12 ${m + 10} L 12 ${m + 10}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  surprised: (m) => `<ellipse cx="0" cy="${m + 5}" rx="7.5" ry="9.5" fill="#8B4A3A"/>`,
  worried: (m) => `<path d="M -12 ${m + 9} Q 0 ${m - 1} 12 ${m + 9}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  neutral: (m) => `<path d="M -10 ${m + 6} L 10 ${m + 6}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  scared: (m) => `<path d="M -12 ${m + 10} Q 0 ${m} 12 ${m + 10}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  calm: (m) => `<path d="M -11 ${m + 5} Q 0 ${m + 11} 11 ${m + 5}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  sleepy: (m) => `<path d="M -11 ${m + 7} q 11 8 22 0" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  jealous: (m) => `<path d="M -12 ${m + 8} L 0 ${m + 4} L 12 ${m + 8}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
  proud: (m) => `<path d="M -13 ${m} Q 0 ${m + 16} 13 ${m}" fill="none" stroke="#2C241C" stroke-width="4" stroke-linecap="round"/>`,
};

const BROWS = {
  angry: (e) => `<path d="M -23 ${e - 15} L -8 ${e - 9} M 23 ${e - 15} L 8 ${e - 9}" stroke="#2C241C" stroke-width="4" stroke-linecap="round" fill="none"/>`,
  worried: (e) => `<path d="M -23 ${e - 8} L -8 ${e - 15} M 23 ${e - 8} L 8 ${e - 15}" stroke="#2C241C" stroke-width="4" stroke-linecap="round" fill="none"/>`,
  surprised: (e) => `<path d="M -23 ${e - 18} L -8 ${e - 18} M 23 ${e - 18} L 8 ${e - 18}" stroke="#2C241C" stroke-width="4" stroke-linecap="round" fill="none"/>`,
  scared: (e) => `<path d="M -23 ${e - 16} q 7 -8 15 -2 M 23 ${e - 16} q -7 -8 -15 -2" stroke="#2C241C" stroke-width="4" stroke-linecap="round" fill="none"/>`,
  jealous: (e) => `<path d="M -23 ${e - 9} L -8 ${e - 14} M 23 ${e - 16} L 8 ${e - 16}" stroke="#2C241C" stroke-width="4" stroke-linecap="round" fill="none"/>`,
};

// ---------------------------------------------------------------------------
// person
// ---------------------------------------------------------------------------
// One builder for every person in all 85 images. Keeping a single
// implementation is what guarantees the visual language stays consistent.
export function person(opts = {}) {
  const {
    x = 200, y = 252, s = 1, skin = SKIN[0], shirt = SHIRT[0], hair = HAIR[0],
    mood = 'happy', gesture = 'down', flip = false, sitting = false, adult = false,
  } = opts;

  const headY = adult ? -126 : -112;
  const headR = adult ? 37 : 40;
  const eyeY = headY - 6;
  const mouthY = headY + 4;
  const bodyTop = adult ? -92 : -80;
  const armY = adult ? -80 : -70;
  const bw = adult ? 33 : 35;
  const t = [];

  if (sitting) {
    t.push(`<rect x="-36" y="-30" width="20" height="30" rx="9" fill="#42506B"/>`);
    t.push(`<rect x="16" y="-30" width="20" height="30" rx="9" fill="#42506B"/>`);
    t.push(`<rect x="-48" y="-4" width="96" height="12" rx="5" fill="#C98F5C"/>`);
    t.push(`<rect x="-42" y="8" width="9" height="26" rx="4" fill="#A9743F"/>`);
    t.push(`<rect x="33" y="8" width="9" height="26" rx="4" fill="#A9743F"/>`);
  } else {
    t.push(`<rect x="-26" y="-34" width="20" height="34" rx="9" fill="#42506B"/>`);
    t.push(`<rect x="6" y="-34" width="20" height="34" rx="9" fill="#42506B"/>`);
  }

  t.push(`<path d="M -${bw} 0 L -${bw} ${bodyTop + 18} Q -${bw} ${bodyTop} -${bw / 3} ${bodyTop} L ${bw / 3} ${bodyTop} Q ${bw} ${bodyTop} ${bw} ${bodyTop + 18} L ${bw} 0 Z" fill="${shirt}"/>`);

  const a = (side, rot, len = 44) =>
    `<g transform="translate(${side * (bw - 3)},${armY}) rotate(${rot})"><rect x="-8" y="0" width="16" height="${len}" rx="8" fill="${shirt}"/><circle cx="0" cy="${len}" r="9" fill="${skin}"/></g>`;

  const ARMS = {
    down: [a(-1, 8), a(1, -8)],
    wave: [a(-1, 8), a(1, -155)],
    open: [a(-1, 28), a(1, -28)],
    reach: [a(-1, 8), a(1, -40)],
    up: [a(-1, 152), a(1, -152)],
    point: [a(-1, 8), a(1, -74)],
    cheer: [a(-1, 158), a(1, -158)],
    shrug: [a(-1, 40), a(1, -40)],
    coverEars: [a(-1, 96), a(1, -96)],
    talk: [a(-1, 8), a(1, -58)],
    hold: [a(-1, 32), a(1, -32)],
    offer: [a(-1, 10), a(1, -34)],
  };
  for (const g of ARMS[gesture] || ARMS.down) t.push(g);

  // held item sits between the hands
  if (opts.hold && props[opts.hold]) {
    t.push(`<g transform="translate(0,${armY + 30})">${props[opts.hold]()}</g>`);
  }

  // head
  t.push(`<circle cx="0" cy="${headY}" r="${headR}" fill="${skin}"/>`);
  t.push(`<path d="M -${headR} ${headY - 4} Q -${headR} ${headY - headR - 7} 0 ${headY - headR - 7} Q ${headR} ${headY - headR - 7} ${headR} ${headY - 4} Q ${headR - 9} ${headY - 21} ${headR - 27} ${headY - 19} Q -5 ${headY - 17} -20 ${headY - 25} Q -${headR + 7} ${headY - 19} -${headR} ${headY - 4} Z" fill="${hair}"/>`);

  if (BROWS[mood]) t.push(BROWS[mood](eyeY));
  t.push(`<circle cx="-14" cy="${eyeY}" r="5.5" fill="#2C241C"/>`);
  t.push(`<circle cx="14" cy="${eyeY}" r="5.5" fill="#2C241C"/>`);
  t.push(`<circle cx="12" cy="${eyeY - 2}" r="1.9" fill="#fff"/>`);
  t.push(`<circle cx="-16" cy="${eyeY - 2}" r="1.9" fill="#fff"/>`);
  const blush = mood === 'happy' || mood === 'proud' || mood === 'calm' ? 0.5 : 0.35;
  t.push(`<circle cx="-26" cy="${eyeY + 17}" r="6.5" fill="#F09A9A" opacity="${blush}"/>`);
  t.push(`<circle cx="26" cy="${eyeY + 17}" r="6.5" fill="#F09A9A" opacity="${blush}"/>`);
  t.push((MOUTHS[mood] || MOUTHS.neutral)(mouthY));

  return `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">${t.join('')}</g>`;
}

// ---------------------------------------------------------------------------
// speech bubble / thought bubble
// ---------------------------------------------------------------------------
export function bubble(opts = {}) {
  const { x = 200, y = 40, w = 130, h = 46, text = '', size = 17, fill = '#FFFFFF', stroke = '#8FA9C4', tail = 'down' } = opts;
  const r = 14;
  let tailPath;
  if (tail === 'none') tailPath = '';
  else if (tail === 'up') tailPath = `<path d="M ${x - 12} ${y} L ${x - 4} ${y - 18} L ${x + 12} ${y} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  else if (tail === 'left') tailPath = `<path d="M ${x - w / 2} ${y + h / 2 - 10} L ${x - w / 2 - 18} ${y + h / 2 + 2} L ${x - w / 2} ${y + h / 2 + 14} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  else tailPath = `<path d="M ${x - 12} ${y + h - 2} L ${x - 4} ${y + h + 18} L ${x + 12} ${y + h - 2} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;

  const box = `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
  const dots = tail === 'none'
    ? `<circle cx="${x - 16}" cy="${y + h + 16}" r="6" fill="${fill}" stroke="${stroke}" stroke-width="3"/><circle cx="${x - 4}" cy="${y + h + 32}" r="4.5" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
    : '';

  if (!text) return `${box}${tailPath}${dots}`;
  const auto = Math.max(10, Math.min(size, Math.floor((w - 18) / (text.length * 0.55))));
  return `${box}${tailPath}${dots}<text x="${x}" y="${y + h / 2 + auto * 0.36}" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" font-size="${auto}" font-weight="700" fill="#2C3E50">${esc(text)}</text>`;
}

// ---------------------------------------------------------------------------
// props  (each is a function returning svg markup, centred on 0,0 unless
//          the scene places it via props.<name>(x, y))
// ---------------------------------------------------------------------------
export const props = {
  ball: (x = 0, y = 0) => `<circle cx="${x}" cy="${y}" r="24" fill="#E86A5C"/><path d="M ${x - 24} ${y} Q ${x} ${y - 16} ${x + 24} ${y} Q ${x} ${y + 16} ${x - 24} ${y} Z" fill="#F2A65A"/><circle cx="${x}" cy="${y}" r="24" fill="none" stroke="#C8503F" stroke-width="3"/>`,

  pencil: (x = 0, y = 0, rot = 0) => `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="-8" y="-46" width="16" height="66" rx="3" fill="#F5C542"/><path d="M -8 20 L 0 40 L 8 20 Z" fill="#F7E3C0"/><path d="M -3 34 L 0 40 L 3 34 Z" fill="#3B2C22"/><rect x="-8" y="-52" width="16" height="10" rx="3" fill="#E58E9A"/></g>`,

  crayonBox: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-46" y="-8" width="92" height="34" rx="6" fill="#C8A2E0" stroke="#9A75B5" stroke-width="3"/><rect x="-30" y="-40" width="14" height="34" rx="3" fill="#E86A5C"/><rect x="-8" y="-46" width="14" height="40" rx="3" fill="#5DADE2"/><rect x="14" y="-40" width="14" height="34" rx="3" fill="#58B8B0"/></g>`,

  brokenCrayon: (x = 0, y = 0) => `<g transform="translate(${x},${y}) rotate(-14)"><rect x="-30" y="-9" width="24" height="18" rx="3" fill="#E86A5C"/><rect x="8" y="-9" width="22" height="18" rx="3" fill="#E86A5C"/><path d="M -6 -9 L 6 -9 L 0 -2 Z" fill="#C8503F"/><path d="M -4 9 L 2 9 L -1 3 Z" fill="#C8503F"/></g>`,

  chips: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><path d="M -30 -34 L 30 -34 L 26 34 L -26 34 Z" fill="#F2C14E" stroke="#C99B25" stroke-width="3"/><path d="M -30 -34 L -20 -50 L 30 -34 Z" fill="#E8B23A"/><ellipse cx="0" cy="4" rx="16" ry="12" fill="#FFF3D6"/><ellipse cx="-8" cy="-2" rx="6" ry="4" fill="#E0AE37"/><ellipse cx="8" cy="8" rx="6" ry="4" fill="#E0AE37"/></g>`,

  snack: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-18" y="-24" width="36" height="48" rx="6" fill="#F2A65A" stroke="#C97E33" stroke-width="3"/><circle cx="0" cy="0" r="9" fill="#FFF3D6"/></g>`,

  cookie: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><circle r="21" fill="#D9A05B" stroke="#B87B4E" stroke-width="3"/><circle cx="-7" cy="-6" r="3.4" fill="#5C3A21"/><circle cx="7" cy="-2" r="3.4" fill="#5C3A21"/><circle cx="-2" cy="8" r="3.4" fill="#5C3A21"/><circle cx="9" cy="9" r="3" fill="#5C3A21"/></g>`,

  cookieJar: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-30" y="-34" width="60" height="68" rx="8" fill="#CFE8F5" stroke="#8FA9C4" stroke-width="3"/><rect x="-30" y="-42" width="60" height="12" rx="4" fill="#8FA9C4"/><circle cx="0" cy="0" r="20" fill="none" stroke="#8FA9C4" stroke-width="2" stroke-dasharray="4 4"/><text x="0" y="6" text-anchor="middle" font-family="Verdana,sans-serif" font-size="20" font-weight="700" fill="#8FA9C4">2</text></g>`,

  lunchbox: (x = 0, y = 0, open = false) => `<g transform="translate(${x},${y})">${open ? `<path d="M -34 -14 L 34 -14 L 34 24 L -34 24 Z" fill="#E8EEF6" stroke="#8FA9C4" stroke-width="3"/><rect x="-34" y="-52" width="68" height="36" rx="6" fill="#CFE8F5" stroke="#8FA9C4" stroke-width="3" transform="rotate(-12)"/>` : `<rect x="-32" y="-26" width="64" height="52" rx="8" fill="#5DADE2" stroke="#3E7FA8" stroke-width="3"/><rect x="-32" y="-10" width="64" height="10" fill="#3E7FA8"/>`}</g>`,

  book: (x = 0, y = 0, rot = 0) => `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M -34 -22 L 0 -16 L 0 20 L -34 14 Z" fill="#FFFFFF" stroke="#42506B" stroke-width="3" stroke-linejoin="round"/><path d="M 34 -22 L 0 -16 L 0 20 L 34 14 Z" fill="#F2F6FA" stroke="#42506B" stroke-width="3" stroke-linejoin="round"/><path d="M 0 -16 L 0 20" stroke="#42506B" stroke-width="3"/></g>`,

  bookshelf: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-80" y="-60" width="160" height="120" rx="6" fill="#C98F5C" stroke="#A9743F" stroke-width="4"/><rect x="-72" y="-52" width="144" height="8" fill="#8A5A2B"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${-64 + i * 22}" y="-46" width="15" height="40" rx="2" fill="${['#E86A5C', '#5DADE2', '#82C8A0', '#F5B041', '#9B8EC4', '#EC8FA6'][i]}"/>`).join('')}</g>`,

  swing: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><path d="M -60 -70 L 60 -70" stroke="#A9743F" stroke-width="9" stroke-linecap="round"/><path d="M -30 -70 L -30 6 M 30 -70 L 30 6" stroke="#6B4423" stroke-width="4"/><rect x="-42" y="6" width="84" height="12" rx="6" fill="#E86A5C" stroke="#C8503F" stroke-width="3"/></g>`,

  slide: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><path d="M -40 -46 L 34 6 L 20 16 L -52 -36 Z" fill="#82C8A0" stroke="#4E9A72" stroke-width="3" stroke-linejoin="round"/><path d="M -30 -34 L -30 24 M 4 -10 L 4 24" stroke="#4E9A72" stroke-width="4" stroke-linecap="round"/></g>`,

  blocks: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-34" y="10" width="30" height="26" rx="3" fill="#E86A5C"/><rect x="-2" y="10" width="30" height="26" rx="3" fill="#5DADE2"/><rect x="-18" y="-16" width="30" height="26" rx="3" fill="#F5B041"/></g>`,

  boardgame: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-62" y="-42" width="124" height="84" rx="8" fill="#F7F0E2" stroke="#A9743F" stroke-width="4"/><path d="M -62 -14 L 62 -14 M -18 -42 L -18 42 M 22 -42 L 22 42" stroke="#D9C6A8" stroke-width="3"/>${[[-42, -30], [2, -2], [-40, 14], [42, 30]].map(([cx, cy], i) => `<circle cx="${cx}" cy="${cy}" r="9" fill="${['#E86A5C', '#5DADE2', '#82C8A0', '#F5B041'][i]}"/>`).join('')}</g>`,

  puzzle: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-64" y="-46" width="128" height="92" rx="6" fill="#EFE7D6" stroke="#A9743F" stroke-width="4"/>${[[-40, -24], [8, -24], [-16, 16]].map(([cx, cy], i) => `<path d="M ${cx} ${cy} h 24 v 24 h -24 Z M ${cx + 8} ${cy} a 6 6 0 1 0 0.1 0" fill="${['#E86A5C', '#5DADE2', '#82C8A0'][i]}" stroke="#fff" stroke-width="2"/>`).join('')}</g>`,

  cup: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><path d="M -18 -24 L 18 -24 L 14 26 L -14 26 Z" fill="#CFE8F5" stroke="#8FA9C4" stroke-width="3" stroke-linejoin="round"/><rect x="-18" y="-26" width="36" height="6" rx="2" fill="#8FA9C4"/></g>`,

  waterFountain: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-42" y="-46" width="84" height="92" rx="8" fill="#B7C7D6" stroke="#8FA9C4" stroke-width="3"/><rect x="-24" y="-30" width="48" height="10" rx="4" fill="#8FA9C4"/><path d="M -6 -20 L -6 -4 M -12 -12 L 0 -12" stroke="#5DADE2" stroke-width="4" stroke-linecap="round"/></g>`,

  door: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-40" y="-88" width="80" height="132" rx="6" fill="#C98F5C" stroke="#8A5A2B" stroke-width="4"/><circle cx="24" cy="0" r="5" fill="#F5C542" stroke="#8A5A2B" stroke-width="2"/></g>`,

  doorSign: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-46" y="-14" width="92" height="28" rx="6" fill="#FFFFFF" stroke="#8FA9C4" stroke-width="3"/><text x="0" y="6" text-anchor="middle" font-family="Verdana,sans-serif" font-size="14" font-weight="700" fill="#2C3E50">WC</text></g>`,

  busStop: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-6" y="-96" width="12" height="96" fill="#8FA9C4"/><rect x="-40" y="-120" width="80" height="30" rx="6" fill="#5DADE2" stroke="#3E7FA8" stroke-width="3"/><text x="0" y="-99" text-anchor="middle" font-family="Verdana,sans-serif" font-size="17" font-weight="700" fill="#fff">BUS</text></g>`,

  table: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-80" y="-8" width="160" height="13" rx="5" fill="#C98F5C" stroke="#A9743F" stroke-width="2"/><rect x="-66" y="5" width="11" height="38" rx="4" fill="#A9743F"/><rect x="55" y="5" width="11" height="38" rx="4" fill="#A9743F"/></g>`,

  plate: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><ellipse rx="34" ry="12" fill="#FFFFFF" stroke="#C8D4E0" stroke-width="3"/><ellipse rx="20" ry="7" fill="#F2C14E"/></g>`,

  clock: (x = 0, y = 0, r = 30, hh = 12, mm = 0) => {
    const ha = ((hh % 12) + mm / 60) * 30 - 90;
    const ma = mm * 6 - 90;
    const p = (a, len) => `<path d="M 0 0 L ${(Math.cos((a * Math.PI) / 180) * len).toFixed(2)} ${(Math.sin((a * Math.PI) / 180) * len).toFixed(2)}" stroke="#42506B" stroke-width="5" stroke-linecap="round"/>`;
    return `<g transform="translate(${x},${y})"><circle r="${r}" fill="#FFFFFF" stroke="#42506B" stroke-width="5"/>${p(ha, r * 0.46)}${p(ma, r * 0.66)}</g>`;
  },

  sun: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><circle r="24" fill="#F5C542"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M ${(Math.cos((a * Math.PI) / 180) * 32).toFixed(1)} ${(Math.sin((a * Math.PI) / 180) * 32).toFixed(1)} L ${(Math.cos((a * Math.PI) / 180) * 42).toFixed(1)} ${(Math.sin((a * Math.PI) / 180) * 42).toFixed(1)}" stroke="#F5C542" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>`,

  moon: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><path d="M 16 -24 A 26 26 0 1 0 16 24 A 20 20 0 1 1 16 -24 Z" fill="#F5E6A8"/></g>`,

  star: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><path d="M 0 -12 L 3.6 -4 L 12 -4 L 5 1.5 L 7.5 10 L 0 5 L -7.5 10 L -5 1.5 L -12 -4 L -3.6 -4 Z" fill="#F5C542"/></g>`,

  cloud: (x = 0, y = 0, dark = false) => `<g transform="translate(${x},${y})"><path d="M -46 10 q -14 0 -14 -14 q 0 -12 12 -14 q 3 -18 22 -18 q 14 0 20 12 q 8 -6 16 -2 q 12 6 8 20 q 12 4 8 16 Z" fill="${dark ? '#8A93A6' : '#FFFFFF'}" stroke="${dark ? '#6B7488' : '#C8D4E0'}" stroke-width="3" stroke-linejoin="round"/></g>`,

  lightning: (x = 0, y = 0) => `<path transform="translate(${x},${y})" d="M 4 -44 L -18 4 L -2 4 L -8 46 L 18 -6 L 2 -6 Z" fill="#F5C542" stroke="#C99B25" stroke-width="3" stroke-linejoin="round"/>`,

  rain: (x = 0, y = 0, n = 4, drop = 20) => Array.from({ length: n }, (_, i) => `<path d="M ${x - 40 + i * (80 / (n - 1))} ${y} l -8 ${drop}" stroke="#5DADE2" stroke-width="4" stroke-linecap="round"/>`).join(''),

  gift: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-32" y="-18" width="64" height="52" rx="5" fill="#EC8FA6" stroke="#C85F7D" stroke-width="3"/><rect x="-36" y="-30" width="72" height="16" rx="4" fill="#F5A8B8" stroke="#C85F7D" stroke-width="3"/><rect x="-6" y="-30" width="12" height="64" fill="#F5C542" stroke="#C99B25" stroke-width="2"/><path d="M 0 -30 q -18 -6 -14 -18 q 4 -10 14 6 q 10 -16 14 -6 q 4 12 -14 18 Z" fill="#F5C542" stroke="#C99B25" stroke-width="2"/></g>`,

  drawing: (x = 0, y = 0, rot = 0) => `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="-40" y="-30" width="80" height="60" rx="4" fill="#FFFFFF" stroke="#8FA9C4" stroke-width="3"/><circle cx="-14" cy="-4" r="11" fill="#F5C542"/><path d="M -34 24 L -8 2 L 10 20 L 24 8 L 34 24 Z" fill="#82C8A0"/></g>`,

  papers: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-34" y="-28" width="60" height="44" rx="3" fill="#FFFFFF" stroke="#8FA9C4" stroke-width="3" transform="rotate(-8)"/><rect x="-20" y="-16" width="60" height="44" rx="3" fill="#FFFFFF" stroke="#8FA9C4" stroke-width="3" transform="rotate(6)"/></g>`,

  testPaper: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-30" y="-40" width="60" height="80" rx="4" fill="#FFFFFF" stroke="#8FA9C4" stroke-width="3"/><path d="M -18 -22 L 18 -22 M -18 -8 L 18 -8 M -18 6 L 4 6" stroke="#C8D4E0" stroke-width="4" stroke-linecap="round"/></g>`,

  backpack: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-28" y="-34" width="56" height="62" rx="12" fill="#9B8EC4" stroke="#7A6BA8" stroke-width="3"/><rect x="-28" y="-6" width="56" height="9" fill="#7A6BA8"/><path d="M -12 -34 q 12 -18 24 0" fill="none" stroke="#7A6BA8" stroke-width="5" stroke-linecap="round"/></g>`,

  desk: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-70" y="-10" width="140" height="12" rx="5" fill="#C98F5C" stroke="#A9743F" stroke-width="2"/><rect x="-58" y="2" width="10" height="34" rx="4" fill="#A9743F"/><rect x="48" y="2" width="10" height="34" rx="4" fill="#A9743F"/></g>`,

  balloon: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><ellipse cx="0" cy="-24" rx="22" ry="26" fill="#EC8FA6" stroke="#C85F7D" stroke-width="3"/><path d="M 0 2 L 0 60" stroke="#8FA9C4" stroke-width="3"/><path d="M -6 2 L 0 10 L 6 2 Z" fill="#C85F7D"/></g>`,

  partyHat: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><path d="M 0 -34 L 20 14 L -20 14 Z" fill="#9B8EC4" stroke="#7A6BA8" stroke-width="3" stroke-linejoin="round"/><circle cx="0" cy="-38" r="6" fill="#F5C542"/><path d="M -14 2 h 8 M 6 -6 h 8 M -2 10 h 8" stroke="#F5C542" stroke-width="4" stroke-linecap="round"/></g>`,

  suitcase: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-34" y="-24" width="68" height="52" rx="7" fill="#5DADE2" stroke="#3E7FA8" stroke-width="3"/><path d="M -12 -24 v -10 q 0 -6 6 -6 h 12 q 6 0 6 6 v 10" fill="none" stroke="#3E7FA8" stroke-width="4"/><rect x="-6" y="-12" width="12" height="10" rx="2" fill="#F5C542"/></g>`,

  plane: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><path d="M -44 0 L 26 -10 L 44 0 L 26 10 Z" fill="#FFFFFF" stroke="#42506B" stroke-width="3" stroke-linejoin="round"/><path d="M -6 -6 L 8 -30 L 18 -30 L 10 -6 Z" fill="#8FA9C4" stroke="#42506B" stroke-width="3" stroke-linejoin="round"/><circle cx="-18" cy="-2" r="4" fill="#5DADE2"/><circle cx="-2" cy="-2" r="4" fill="#5DADE2"/></g>`,

  phone: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-18" y="-34" width="36" height="68" rx="8" fill="#42506B"/><rect x="-13" y="-26" width="26" height="48" rx="3" fill="#8FD3F4"/></g>`,

  ear: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><path d="M 0 -26 q 30 6 30 30 q 0 26 -22 26 q -14 0 -16 -14 q -2 -12 12 -14" fill="#F7D9BE" stroke="#D9A273" stroke-width="4" stroke-linejoin="round"/><path d="M 8 -10 q 14 6 12 18" fill="none" stroke="#D9A273" stroke-width="4" stroke-linecap="round"/></g>`,

  soundWaves: (x = 0, y = 0) => [16, 28, 40].map((r, i) => `<path transform="translate(${x},${y})" d="M 0 ${-r} q ${r * 0.7} ${r} 0 ${r * 2}" fill="none" stroke="#5DADE2" stroke-width="5" stroke-linecap="round" opacity="${1 - i * 0.22}"/>`).join(''),

  queue: (x = 0, y = 0, n = 4) => Array.from({ length: n }, (_, i) => `<circle cx="${x + i * 26}" cy="${y}" r="9" fill="none" stroke="#8FA9C4" stroke-width="4"/>`).join(''),

  numbers: (x = 0, y = 0) => [1, 2, 3].map((n, i) => `<g transform="translate(${x + i * 44},${y})"><circle r="19" fill="${['#5DADE2', '#F5C542', '#82C8A0'][i]}"/><text x="0" y="7" text-anchor="middle" font-family="Verdana,sans-serif" font-size="20" font-weight="700" fill="#fff">${n}</text></g>`).join(''),

  heart: (x = 0, y = 0, s = 1, fill = '#E8697D') => `<path transform="translate(${x},${y}) scale(${s})" d="M 0 12 C -22 -4 -14 -22 0 -12 C 14 -22 22 -4 0 12 Z" fill="${fill}"/>`,

  hearts: (x = 0, y = 0) => `${props.heart(x - 34, y, 0.9)}${props.heart(x, y - 10, 1.15)}${props.heart(x + 34, y, 0.9)}`,

  anger: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><path d="M 0 -22 q -9 4 -5 12 q 4 7 -3 12" fill="none" stroke="#E86A5C" stroke-width="6" stroke-linecap="round"/><path d="M 16 -22 q 9 4 5 12 q -4 7 3 12" fill="none" stroke="#E86A5C" stroke-width="6" stroke-linecap="round"/><path d="M -16 -22 L -10 -2 L -18 22" fill="none" stroke="#E86A5C" stroke-width="6" stroke-linecap="round"/><path d="M 16 -22 L 10 -2 L 18 22" fill="none" stroke="#E86A5C" stroke-width="6" stroke-linecap="round"/></g>`,

  qmark: (x = 0, y = 0, size = 40, fill = '#8FA9C4') => `<text transform="translate(${x},${y}) scale(${size / 40})" x="0" y="14" text-anchor="middle" font-family="Verdana,sans-serif" font-size="40" font-weight="700" fill="${fill}">?</text>`,

  excl: (x = 0, y = 0, size = 40, fill = '#F5B041') => `<text transform="translate(${x},${y}) scale(${size / 40})" x="0" y="14" text-anchor="middle" font-family="Verdana,sans-serif" font-size="40" font-weight="700" fill="${fill}">!</text>`,

  tick: (x = 0, y = 0, size = 40, fill = '#4E9A72') => `<path transform="translate(${x},${y}) scale(${size / 40})" d="M -16 0 L -5 12 L 18 -14" fill="none" stroke="${fill}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,

  cross: (x = 0, y = 0, size = 40, fill = '#E86A5C') => `<g transform="translate(${x},${y}) scale(${size / 40})"><path d="M -14 -14 L 14 14 M 14 -14 L -14 14" stroke="${fill}" stroke-width="8" stroke-linecap="round"/></g>`,

  breathe: (x = 0, y = 0) => [0, 1, 2].map((i) => `<path transform="translate(${x + i * 20},${y}) scale(${0.7 + i * 0.2})" d="M 0 -18 q 16 18 0 36 q -16 -18 0 -36 Z" fill="none" stroke="#5DADE2" stroke-width="4" stroke-linecap="round" opacity="${0.4 + i * 0.25}"/>`).join(''),

  tear: (x = 0, y = 0) => `<path transform="translate(${x},${y})" d="M 0 0 q 9 14 0 20 q -9 -6 0 -20 Z" fill="#5DADE2"/>`,

  bandage: (x = 0, y = 0) => `<g transform="translate(${x},${y}) rotate(-24)"><rect x="-20" y="-9" width="40" height="18" rx="8" fill="#F5D9A8" stroke="#D9B070" stroke-width="3"/><circle cx="-8" cy="0" r="2.6" fill="#D9B070"/><circle cx="8" cy="0" r="2.6" fill="#D9B070"/></g>`,

  bigFace: (x = 0, y = 0, mood = 'happy', r = 78) => `<g transform="translate(${x},${y}) scale(${r / 100})"><circle r="100" fill="#F7D9BE" stroke="#D9A273" stroke-width="5"/>${BROWS[mood] ? BROWS[mood](-30) : ''}<circle cx="-34" cy="-22" r="12" fill="#2C241C"/><circle cx="34" cy="-22" r="12" fill="#2C241C"/><circle cx="-29" cy="-27" r="4" fill="#fff"/><circle cx="39" cy="-27" r="4" fill="#fff"/><circle cx="-56" cy="18" r="14" fill="#F09A9A" opacity=".4"/><circle cx="56" cy="18" r="14" fill="#F09A9A" opacity=".4"/>${(MOUTHS[mood] || MOUTHS.neutral)(42)}</g>`,

  window: (x = 0, y = 0, night = false) => `<g transform="translate(${x},${y})"><rect x="-40" y="-46" width="80" height="92" rx="6" fill="${night ? '#2C3E64' : '#BFE4F7'}" stroke="#8FA9C4" stroke-width="4"/><path d="M 0 -46 L 0 46 M -40 0 L 40 0" stroke="#8FA9C4" stroke-width="4"/></g>`,

  calendar: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-46" y="-40" width="92" height="82" rx="6" fill="#FFFFFF" stroke="#8FA9C4" stroke-width="4"/><rect x="-46" y="-40" width="92" height="18" rx="4" fill="#E86A5C"/><path d="M -24 -40 v -12 M 24 -40 v -12" stroke="#8FA9C4" stroke-width="5" stroke-linecap="round"/><circle cx="-16" cy="8" r="9" fill="#F5C542"/><circle cx="8" cy="8" r="9" fill="#EAF0F6"/></g>`,

  droplet: (x = 0, y = 0) => `<path transform="translate(${x},${y})" d="M 0 -20 q 16 20 16 30 a 16 16 0 0 1 -32 0 q 0 -10 16 -30 Z" fill="#5DADE2" stroke="#3E7FA8" stroke-width="3"/>`,

  toyBin: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><path d="M -40 -22 L 40 -22 L 34 34 L -34 34 Z" fill="#5DADE2" stroke="#3E7FA8" stroke-width="3" stroke-linejoin="round"/><rect x="-44" y="-30" width="88" height="12" rx="5" fill="#3E7FA8"/><circle cx="-14" cy="4" r="9" fill="#E86A5C"/><rect x="2" y="-6" width="18" height="18" rx="3" fill="#F5B041"/></g>`,

  counter: (x = 0, y = 0) => `<g transform="translate(${x},${y})"><rect x="-70" y="-20" width="140" height="14" rx="5" fill="#C98F5C" stroke="#A9743F" stroke-width="3"/><rect x="-60" y="-6" width="120" height="40" fill="#E8DCC8" stroke="#A9743F" stroke-width="3"/></g>`,
};

// held-item mini renderers (drawn in hand space, small)
props.bookHold = () => props.book(0, 0);
props.crayonHold = () => props.crayonBox(0, 4);
props.cookieHold = () => props.cookie(0, 0);
props.cupHold = () => props.cup(0, 0);
props.phoneHold = () => props.phone(0, 0);
props.drawingHold = () => props.drawing(0, 0);
props.ballHold = () => props.ball(0, 0);

// ---------------------------------------------------------------------------
// scene frame
// ---------------------------------------------------------------------------
export function frame(module, inner, opts = {}) {
  const [c1, c2] = BG[module] || BG.greeting;
  const { ground = true, night = false } = opts;
  const bg = night
    ? `<rect width="400" height="300" fill="#26314F"/><rect width="400" height="300" fill="#000" opacity=".12"/>`
    : `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/>`;
  const floor = ground ? `<rect x="0" y="248" width="400" height="52" fill="${night ? '#3A4666' : GROUND}"/>` : '';
  const shadow = ground ? `<ellipse cx="200" cy="256" rx="170" ry="17" fill="#000" opacity=".07"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300" role="img">${bg}${floor}${shadow}${inner}</svg>`;
}
