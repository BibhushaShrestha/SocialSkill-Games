// ============================================================================
// art/scenes.mjs
// ----------------------------------------------------------------------------
// One illustration per question, EXCLUDING the hardest item of each module
// (greeting id 18, sharing/waiting/emotion/communication id 18) = 85 images.
//
// Each scene shows the SITUATION, never the correct answer, so the picture
// cannot be used to skip the reasoning it is meant to prompt.
//
// spec = {
//   m      : module (drives background palette)
//   night  : true for evening scenes
//   add    : [svg strings]   background / environment props, drawn first
//   ppl    : [person opts]   drawn left-to-right, on top of props
//   bub    : [bubble opts]   drawn last, on top of everything
// }
// ============================================================================

import { person, props, bubble } from './primitives.mjs';

const P = (x, y, o = {}) => ({ x, y, ...o });

// A consistent cast, so faces are recognisable between items.
const A = { skin: '#F7D9BE', hair: '#3B2C22', shirt: '#5DADE2' };
const B = { skin: '#EDC4A0', hair: '#6B4226', shirt: '#EC8FA6' };
const C = { skin: '#D9A273', hair: '#1F1B18', shirt: '#82C8A0' };
const D = { skin: '#B87B4E', hair: '#C9A227', shirt: '#F5B041' };
const E = { skin: '#8D5A34', hair: '#3B2C22', shirt: '#9B8EC4' };
const T = { skin: '#EDC4A0', hair: '#A9713C', shirt: '#58B8B0' };  // teacher

export const scenes = {
  // ================= GREETING =================
  'greeting-01': { m: 'greeting',
    ppl: [P(120, 250, { ...A, gesture: 'wave' }), P(280, 250, { ...B, mood: 'neutral', gesture: 'open' })],
    bub: [bubble({ x: 118, y: 92, w: 80, h: 42, text: 'Hi!', size: 22 })] },

  'greeting-02': { m: 'greeting',
    ppl: [P(120, 250, { ...B, gesture: 'wave' }), P(280, 250, { ...C, mood: 'neutral', gesture: 'down' })],
    bub: [bubble({ x: 118, y: 96, w: 96, h: 40, text: 'Over here!', size: 15 })] },

  'greeting-03': { m: 'greeting',
    ppl: [P(200, 254, { ...D, gesture: 'open' })],
    bub: [bubble({ x: 200, y: 88, w: 116, h: 46, text: 'Hello!', size: 22 })] },

  'greeting-04': { m: 'greeting',
    add: [props.desk(300, 232), props.book(300, 214, -6), props.backpack(352, 232)],
    ppl: [P(110, 250, { ...C, gesture: 'wave' }), P(208, 250, { ...A, mood: 'neutral', gesture: 'down' })] },

  'greeting-05': { m: 'greeting',
    ppl: [P(126, 250, { ...B, mood: 'happy', gesture: 'open' }), P(278, 250, { ...A, mood: 'neutral', gesture: 'down' })],
    bub: [bubble({ x: 124, y: 92, w: 84, h: 42, text: 'Hi!', size: 21 })] },

  'greeting-06': { m: 'greeting',
    add: [props.sun(52, 44), props.clock(352, 46, 26, 8, 0)],
    ppl: [P(120, 252, { ...C, adult: true, gesture: 'open' }), P(250, 252, { ...A, mood: 'happy', gesture: 'open' })] },

  'greeting-07': { m: 'greeting',
    add: [props.toyBin(112, 226), props.ball(64, 244)],
    ppl: [P(128, 252, { ...C, mood: 'neutral', gesture: 'reach' }), P(292, 252, { ...A, gesture: 'wave' })],
    bub: [bubble({ x: 296, y: 88, w: 108, h: 42, text: 'Hello!', size: 19 })] },

  'greeting-08': { m: 'greeting',
    ppl: [P(280, 252, { ...A, mood: 'calm', gesture: 'hold', hold: 'bookHold' }), P(112, 252, { ...B, gesture: 'wave' })],
    bub: [bubble({ x: 110, y: 92, w: 82, h: 40, text: 'Hi!', size: 20 })] },

  'greeting-09': { m: 'greeting',
    add: [props.desk(300, 236)],
    ppl: [P(78, 252, { ...T, adult: true, mood: 'happy', gesture: 'talk' }),
          P(178, 252, { ...C, mood: 'happy', gesture: 'talk' }),
          P(330, 252, { ...D, mood: 'neutral', gesture: 'wave' })],
    bub: [bubble({ x: 330, y: 84, w: 96, h: 40, text: 'Hello!', size: 18 })] },

  'greeting-10': { m: 'greeting',
    ppl: [P(96, 250, { ...A, mood: 'happy', gesture: 'talk' }), P(196, 250, { ...B, mood: 'happy', gesture: 'talk' }),
          P(330, 250, { ...C, mood: 'neutral', gesture: 'wave', s: 0.92 })] },

  'greeting-11': { m: 'greeting',
    ppl: [P(118, 252, { ...C, mood: 'happy', gesture: 'open' }), P(284, 252, { ...D, mood: 'happy', gesture: 'open' })],
    add: [props.qmark(200, 118, 34)] },

  'greeting-12': { m: 'greeting',
    add: [props.desk(320, 238)],
    ppl: [P(84, 252, { ...T, adult: true, mood: 'happy', gesture: 'talk' }),
          P(196, 252, { ...B, mood: 'calm', gesture: 'down', flip: true }),
          P(330, 252, { ...A, mood: 'worried', gesture: 'down' })] },

  'greeting-13': { m: 'greeting', night: true,
    add: [props.moon(350, 46), props.clock(56, 48, 28, 8, 0), props.star(120, 34), props.star(210, 26)],
    ppl: [P(140, 252, { ...A, mood: 'happy', gesture: 'wave' }), P(272, 252, { ...B, mood: 'happy', gesture: 'open' })] },

  'greeting-14': { m: 'greeting',
    add: [props.balloon(56, 150), props.partyHat(126, 138), props.partyHat(292, 138)],
    ppl: [P(130, 252, { ...C, mood: 'worried', gesture: 'shrug' }), P(288, 252, { ...B, mood: 'happy', gesture: 'open' })] },

  'greeting-15': { m: 'greeting',
    ppl: [P(126, 252, { ...B, mood: 'happy', gesture: 'talk' }), P(282, 252, { ...A, mood: 'neutral', gesture: 'open' })],
    bub: [bubble({ x: 124, y: 88, w: 148, h: 44, text: 'How are you?', size: 17 })] },

  'greeting-16': { m: 'greeting',
    add: [props.table(230, 222), props.lunchbox(230, 206, true)],
    ppl: [P(150, 214, { ...C, sitting: true, gesture: 'hold', hold: 'cookieHold', s: 0.86 }),
          P(322, 252, { ...A, mood: 'neutral', gesture: 'down', s: 0.95 })] },

  'greeting-17': { m: 'greeting',
    ppl: [P(100, 250, { ...A, mood: 'happy', gesture: 'talk' }), P(196, 250, { ...C, mood: 'happy', gesture: 'talk' }),
          P(330, 250, { ...D, mood: 'happy', gesture: 'wave' })] },

  // ================= SHARING =================
  'sharing-01': { m: 'sharing',
    ppl: [P(112, 250, { ...A, mood: 'happy', gesture: 'hold', hold: 'ballHold' }), P(288, 250, { ...B, gesture: 'reach' })],
    add: [props.qmark(292, 120, 30)] },

  'sharing-02': { m: 'sharing',
    ppl: [P(116, 250, { ...C, gesture: 'offer' }), P(292, 250, { ...D, mood: 'worried', gesture: 'down' })],
    add: [props.pencil(168, 150, 16), props.qmark(300, 116, 30)] },

  'sharing-03': { m: 'sharing',
    ppl: [P(130, 250, { ...A, mood: 'happy', gesture: 'open' }), P(272, 250, { ...B, mood: 'happy', gesture: 'open' })],
    add: [props.hearts(200, 118)] },

  'sharing-04': { m: 'sharing',
    add: [props.chips(200, 168), props.snack(150, 176)],
    ppl: [P(110, 252, { ...D, mood: 'happy', gesture: 'reach' }), P(292, 252, { ...C, mood: 'happy', gesture: 'reach' })] },

  'sharing-05': { m: 'sharing',
    ppl: [P(132, 250, { ...C, mood: 'happy', gesture: 'open' }), P(268, 250, { ...A, mood: 'happy', gesture: 'open' })],
    add: [props.heart(200, 116, 1.6)] },

  'sharing-06': { m: 'sharing',
    add: [props.crayonBox(130, 176)],
    ppl: [P(126, 252, { ...B, mood: 'happy', gesture: 'offer' }), P(296, 252, { ...D, mood: 'sad', gesture: 'down' })] },

  'sharing-07': { m: 'sharing',
    add: [props.swing(200, 148)],
    ppl: [P(100, 252, { ...A, mood: 'neutral', gesture: 'point' }), P(300, 252, { ...C, mood: 'neutral', gesture: 'point', flip: true })] },

  'sharing-08': { m: 'sharing',
    add: [props.ball(146, 196)],
    ppl: [P(146, 252, { ...A, mood: 'happy', gesture: 'hold', hold: 'ballHold' }), P(340, 252, { ...D, mood: 'sad', gesture: 'down', s: 0.92 })] },

  'sharing-09': { m: 'sharing',
    add: [props.chips(196, 170, 1)],
    ppl: [P(110, 252, { ...B, mood: 'happy', gesture: 'hold' }), P(300, 252, { ...C, mood: 'neutral', gesture: 'down' })] },

  'sharing-10': { m: 'sharing',
    add: [props.desk(240, 226), props.lunchbox(240, 210, true)],
    ppl: [P(112, 252, { ...A, mood: 'happy', gesture: 'open' }), P(322, 252, { ...D, mood: 'sad', gesture: 'down' })] },

  'sharing-11': { m: 'sharing',
    add: [props.boardgame(200, 218)],
    ppl: [P(58, 252, { ...A, mood: 'happy', gesture: 'up' }), P(146, 252, { ...C, mood: 'happy', gesture: 'down', s: 0.9 }),
          P(232, 252, { ...B, mood: 'happy', gesture: 'down', s: 0.9 }), P(320, 252, { ...D, mood: 'happy', gesture: 'down', s: 0.9 })] },

  'sharing-12': { m: 'sharing',
    add: [props.snack(126, 168), props.cookieJar(268, 168)],
    ppl: [P(110, 252, { ...B, mood: 'happy', gesture: 'open' }), P(292, 252, { ...C, mood: 'calm', gesture: 'open' })] },

  'sharing-13': { m: 'sharing',
    add: [props.bookshelf(200, 170), props.book(200, 150, 8)],
    ppl: [P(102, 252, { ...A, mood: 'neutral', gesture: 'reach' }), P(300, 252, { ...D, mood: 'neutral', gesture: 'reach', flip: true })] },

  'sharing-14': { m: 'sharing',
    add: [props.blocks(200, 210)],
    ppl: [P(110, 252, { ...C, mood: 'happy', gesture: 'down' }), P(292, 252, { ...B, mood: 'neutral', gesture: 'reach' })] },

  'sharing-15': { m: 'sharing',
    add: [props.papers(140, 176)],
    ppl: [P(116, 252, { ...A, mood: 'neutral', gesture: 'hold' }), P(224, 252, { ...C, mood: 'sad', gesture: 'shrug', s: 0.92 }),
          P(332, 252, { ...D, mood: 'sad', gesture: 'shrug', s: 0.92 })] },

  'sharing-16': { m: 'sharing',
    add: [props.toyBin(300, 214), props.qmark(300, 152, 34)],
    ppl: [P(112, 252, { ...B, mood: 'sad', gesture: 'open' }), P(300, 252, { ...A, mood: 'worried', gesture: 'open', s: 0.95 })] },

  'sharing-17': { m: 'sharing',
    add: [props.cookieJar(160, 172)],
    ppl: [P(112, 252, { ...D, mood: 'neutral', gesture: 'hold' }), P(292, 252, { ...C, mood: 'neutral', gesture: 'open' })] },

  // ================= WAITING =================
  'waiting-01': { m: 'waiting',
    ppl: [P(112, 252, { ...A, mood: 'happy', gesture: 'talk' }), P(292, 252, { ...C, mood: 'calm', gesture: 'down' })],
    bub: [bubble({ x: 110, y: 90, w: 104, h: 42, text: 'Listen...', size: 17 })] },

  'waiting-02': { m: 'waiting',
    add: [props.counter(300, 200), props.queue(40, 108, 5)],
    ppl: [P(58, 252, { ...A, mood: 'neutral', gesture: 'down', s: 0.84 }), P(128, 252, { ...C, mood: 'neutral', gesture: 'down', s: 0.84 }),
          P(198, 252, { ...D, mood: 'neutral', gesture: 'down', s: 0.84 })] },

  'waiting-03': { m: 'waiting',
    add: [props.clock(316, 66, 32)],
    ppl: [P(180, 252, { ...B, mood: 'calm', gesture: 'down' })] },

  'waiting-04': { m: 'waiting',
    add: [props.table(200, 224), props.plate(200, 208)],
    ppl: [P(112, 216, { ...C, sitting: true, gesture: 'down', s: 0.86 }), P(292, 216, { ...A, sitting: true, mood: 'calm', gesture: 'down', s: 0.86 })] },

  'waiting-05': { m: 'waiting',
    add: [props.slide(150, 146)],
    ppl: [P(112, 244, { ...A, mood: 'happy', gesture: 'open', s: 0.9 }), P(292, 252, { ...C, mood: 'neutral', gesture: 'down' })] },

  'waiting-06': { m: 'waiting',
    add: [props.desk(300, 238)],
    ppl: [P(110, 252, { ...T, adult: true, mood: 'happy', gesture: 'talk' }), P(250, 252, { ...B, gesture: 'up' })] },

  'waiting-07': { m: 'waiting',
    add: [props.queue(40, 106, 5)],
    ppl: [P(300, 252, { ...D, mood: 'angry', gesture: 'point', s: 0.85 }), P(70, 252, { ...A, mood: 'worried', gesture: 'down', s: 0.85 }),
          P(148, 252, { ...C, mood: 'neutral', gesture: 'down', s: 0.85 }), P(225, 252, { ...B, mood: 'neutral', gesture: 'down', s: 0.85 })] },

  'waiting-08': { m: 'waiting',
    add: [props.numbers(200, 104)],
    ppl: [P(80, 252, { ...A, mood: 'calm', gesture: 'down', s: 0.86 }), P(200, 252, { ...C, mood: 'calm', gesture: 'down', s: 0.86 }),
          P(320, 252, { ...D, mood: 'calm', gesture: 'down', s: 0.86 })] },

  'waiting-09': { m: 'waiting',
    add: [props.boardgame(316, 220), props.clock(70, 64, 28)],
    ppl: [P(160, 252, { ...B, mood: 'happy', gesture: 'cheer' })] },

  'waiting-10': { m: 'waiting',
    ppl: [P(100, 252, { ...T, adult: true, mood: 'calm', gesture: 'reach' }), P(200, 252, { ...C, mood: 'neutral', gesture: 'down' }),
          P(330, 252, { ...A, mood: 'calm', gesture: 'down', s: 0.95 })] },

  'waiting-11': { m: 'waiting',
    add: [props.busStop(74, 150), props.clock(300, 60, 30)],
    ppl: [P(120, 252, { ...D, mood: 'calm', gesture: 'hold', hold: 'bookHold' })] },

  'waiting-12': { m: 'waiting',
    ppl: [P(112, 252, { ...A, mood: 'happy', gesture: 'talk' }), P(292, 252, { ...D, mood: 'neutral', gesture: 'down' })],
    bub: [bubble({ x: 110, y: 90, w: 112, h: 42, text: 'Once upon...', size: 16 })] },

  'waiting-13': { m: 'waiting',
    add: [props.door(300, 150), props.doorSign(300, 96)],
    ppl: [P(110, 252, { ...C, mood: 'calm', gesture: 'down' })] },

  'waiting-14': { m: 'waiting',
    add: [props.waterFountain(140, 196), props.cup(196, 200), props.droplet(300, 150)],
    ppl: [P(292, 252, { ...A, mood: 'sad', gesture: 'down' })] },

  'waiting-15': { m: 'waiting',
    add: [props.boardgame(200, 218)],
    ppl: [P(112, 252, { ...B, mood: 'sleepy', gesture: 'down', s: 0.95 }), P(292, 252, { ...D, mood: 'happy', gesture: 'cheer', s: 0.95 })] },

  'waiting-16': { m: 'waiting',
    add: [props.anger(140, 120, 0.9), props.breathe(276, 132)],
    ppl: [P(200, 252, { ...C, mood: 'calm', gesture: 'open' })] },

  'waiting-17': { m: 'waiting',
    add: [props.puzzle(126, 200)],
    ppl: [P(110, 252, { ...A, mood: 'happy', gesture: 'cheer', s: 0.95 }), P(300, 252, { ...D, mood: 'neutral', gesture: 'down', s: 0.95 })] },

  // ================= EMOTION =================
  'emotion-01': { m: 'emotion',
    ppl: [P(112, 252, { ...B, mood: 'sad', gesture: 'down' }), P(292, 252, { ...A, mood: 'worried', gesture: 'offer' })],
    add: [props.tear(126, 122)] },

  'emotion-02': { m: 'emotion',
    add: [props.bigFace(200, 146, 'happy', 88)] },

  'emotion-03': { m: 'emotion',
    add: [props.bigFace(200, 142, 'sad', 88), props.tear(146, 186), props.tear(254, 186)] },

  'emotion-04': { m: 'emotion',
    add: [props.bigFace(200, 148, 'angry', 88)] },

  'emotion-05': { m: 'emotion',
    add: [props.bigFace(152, 148, 'neutral', 68), props.heart(288, 148, 1.5)] },

  'emotion-06': { m: 'emotion',
    add: [props.cloud(340, 62, true), props.lightning(336, 150), props.rain(340, 214, 4)],
    ppl: [P(160, 252, { ...D, mood: 'scared', gesture: 'up' })] },

  'emotion-07': { m: 'emotion',
    add: [props.breathe(316, 128)],
    ppl: [P(160, 252, { ...A, mood: 'angry', gesture: 'open' })] },

  'emotion-08': { m: 'emotion',
    add: [props.gift(140, 194)],
    ppl: [P(292, 252, { ...B, mood: 'surprised', gesture: 'shrug' })] },

  'emotion-09': { m: 'emotion',
    add: [props.balloon(58, 156), props.partyHat(292, 128)],
    ppl: [P(130, 252, { ...C, mood: 'proud', gesture: 'cheer' }), P(288, 252, { ...A, mood: 'happy', gesture: 'open' })] },

  'emotion-10': { m: 'emotion',
    ppl: [P(112, 252, { ...B, mood: 'sad', gesture: 'down' }), P(292, 252, { ...A, mood: 'worried', gesture: 'open' })] },

  'emotion-11': { m: 'emotion',
    ppl: [P(112, 252, { ...D, mood: 'sad', gesture: 'down' }), P(292, 252, { ...C, mood: 'worried', gesture: 'open' })],
    add: [props.heart(202, 110, 1.2)] },

  'emotion-12': { m: 'emotion',
    ppl: [P(120, 252, { ...C, mood: 'sad', gesture: 'down' }), P(300, 252, { ...T, adult: true, mood: 'worried', gesture: 'open', s: 0.98 })],
    add: [props.bandage(146, 232)] },

  'emotion-13': { m: 'emotion',
    add: [props.boardgame(310, 226)],
    ppl: [P(128, 252, { ...A, mood: 'angry', gesture: 'open' })] },

  'emotion-14': { m: 'emotion',
    add: [props.testPaper(310, 176)],
    ppl: [P(122, 252, { ...B, mood: 'worried', gesture: 'down' })] },

  'emotion-15': { m: 'emotion',
    add: [props.brokenCrayon(140, 190)],
    ppl: [P(112, 252, { ...A, mood: 'worried', gesture: 'shrug' }), P(292, 252, { ...D, mood: 'sad', gesture: 'down' })] },

  'emotion-16': { m: 'emotion',
    add: [props.anger(140, 118, 0.85), props.heart(276, 118, 1.1)],
    ppl: [P(200, 252, { ...C, mood: 'calm', gesture: 'open' })] },

  'emotion-17': { m: 'emotion',
    add: [props.suitcase(300, 210), props.plane(96, 62)],
    ppl: [P(112, 252, { ...B, mood: 'proud', gesture: 'cheer' }), P(300, 252, { ...D, mood: 'jealous', gesture: 'shrug' })] },

  // ================= COMMUNICATION =================
  'communication-01': { m: 'communication',
    ppl: [P(112, 252, { ...A, mood: 'worried', gesture: 'up' }), P(292, 252, { ...T, adult: true, mood: 'neutral', gesture: 'open' })],
    bub: [bubble({ x: 110, y: 86, w: 112, h: 42, text: 'Please...?', size: 17 })] },

  'communication-02': { m: 'communication',
    ppl: [P(112, 252, { ...A, mood: 'happy', gesture: 'talk' }), P(292, 252, { ...B, mood: 'happy', gesture: 'talk' })],
    bub: [bubble({ x: 108, y: 88, w: 96, h: 40, text: 'Hello!', size: 18 }), bubble({ x: 294, y: 88, w: 84, h: 40, text: 'Hi!', size: 19 })] },

  'communication-03': { m: 'communication',
    ppl: [P(200, 254, { ...B, mood: 'happy', gesture: 'open' })],
    bub: [bubble({ x: 200, y: 80, w: 136, h: 50, text: 'Please', size: 23 })] },

  'communication-04': { m: 'communication',
    add: [props.ear(180, 142, 1.35), props.soundWaves(268, 142)] },

  'communication-05': { m: 'communication',
    ppl: [P(112, 252, { ...C, mood: 'happy', gesture: 'talk' }), P(292, 252, { ...A, mood: 'happy', gesture: 'talk' })],
    bub: [bubble({ x: 200, y: 74, w: 148, h: 42, text: 'I feel happy.', size: 16 })],
    add: [props.heart(200, 200, 0.8)] },

  'communication-06': { m: 'communication',
    ppl: [P(140, 252, { ...A, mood: 'worried', gesture: 'shrug', flip: true }), P(268, 252, { ...D, mood: 'surprised', gesture: 'shrug' })],
    bub: [bubble({ x: 128, y: 86, w: 96, h: 42, text: 'Sorry!', size: 20 })] },

  'communication-07': { m: 'communication',
    add: [props.ear(288, 146, 1.1)],
    ppl: [P(112, 252, { ...C, mood: 'happy', gesture: 'talk' }), P(284, 252, { ...B, mood: 'calm', gesture: 'open' })] },

  'communication-08': { m: 'communication',
    add: [props.soundWaves(330, 138)],
    ppl: [P(110, 252, { ...A, mood: 'happy', gesture: 'talk' }), P(280, 252, { ...C, mood: 'calm', gesture: 'open' })],
    bub: [bubble({ x: 108, y: 86, w: 112, h: 42, text: 'I like play.', size: 15 })] },

  'communication-09': { m: 'communication',
    ppl: [P(132, 252, { ...B, mood: 'worried', gesture: 'talk' }), P(292, 252, { ...A, mood: 'calm', gesture: 'open' })],
    bub: [bubble({ x: 130, y: 84, w: 136, h: 44, text: 'I am okay.', size: 17 })],
    add: [props.heart(200, 206, 0.75)] },

  'communication-10': { m: 'communication',
    add: [props.boardgame(200, 226)],
    ppl: [P(112, 252, { ...A, mood: 'worried', gesture: 'point' }), P(292, 252, { ...C, mood: 'neutral', gesture: 'shrug', flip: true })],
    bub: [bubble({ x: 108, y: 82, w: 112, h: 38, text: 'Not like that!', size: 14, tail: 'none' }),
          bubble({ x: 294, y: 82, w: 112, h: 38, text: 'Try this way', size: 15, tail: 'none' })] },

  'communication-11': { m: 'communication',
    add: [props.ear(300, 146, 1.05)],
    ppl: [P(112, 252, { ...B, mood: 'happy', gesture: 'talk' }), P(286, 252, { ...A, mood: 'calm', gesture: 'open' })],
    bub: [bubble({ x: 110, y: 84, w: 128, h: 40, text: 'Something new!', size: 14 })] },

  'communication-12': { m: 'communication',
    add: [props.boardgame(220, 224)],
    ppl: [P(175, 252, { ...C, mood: 'happy', gesture: 'talk', s: 0.88 }), P(265, 252, { ...D, mood: 'happy', gesture: 'cheer', s: 0.88 }),
          P(80, 252, { ...B, mood: 'neutral', gesture: 'up', s: 0.95 })],
    bub: [bubble({ x: 78, y: 82, w: 148, h: 42, text: 'Can I play?', size: 17 })] },

  'communication-13': { m: 'communication',
    ppl: [P(112, 252, { ...D, mood: 'surprised', gesture: 'shrug' }), P(292, 252, { ...A, mood: 'calm', gesture: 'talk' })],
    add: [props.qmark(126, 118, 36)] },

  'communication-14': { m: 'communication',
    add: [props.drawing(200, 168, -4)],
    ppl: [P(108, 252, { ...B, mood: 'happy', gesture: 'open' }), P(296, 252, { ...A, mood: 'happy', gesture: 'point' })] },

  'communication-15': { m: 'communication',
    ppl: [P(120, 252, { ...A, mood: 'worried', gesture: 'coverEars' }), P(292, 252, { ...B, mood: 'sad', gesture: 'down' })] },

  'communication-16': { m: 'communication',
    ppl: [P(100, 252, { ...C, mood: 'happy', gesture: 'talk', s: 0.92 }), P(184, 252, { ...D, mood: 'happy', gesture: 'talk', s: 0.92 }),
          P(338, 252, { ...B, mood: 'sad', gesture: 'down', s: 0.9 })] },

  'communication-17': { m: 'communication',
    add: [props.calendar(320, 168)],
    ppl: [P(112, 252, { ...A, mood: 'calm', gesture: 'talk' }), P(280, 252, { ...T, adult: true, mood: 'neutral', gesture: 'open', s: 0.98 })] },
};
