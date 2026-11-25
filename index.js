// Veillée : tenir toute la nuit, lanterne à la main, contre des vagues de créatures, jusqu'à l'aube.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Veillée</span><span class="hint">Flèches ou ZQSD : marcher · ou maintenir le clic vers où aller · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="vlCanvas" width="192" height="144" role="img" aria-label="Veillée"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="vlStats"></div></div>
      <div class="sysCard vlChoose"><b>PERSONNAGE</b><div class="vlPick" id="vlChars" data-pxskip></div><b>CARTE</b><div class="vlPick" id="vlMaps" data-pxskip></div></div>
      <div class="sysCard"><b>ÉVOLUTIONS</b><div class="vlEvos" id="vlEvos"></div></div>
      <div class="row"><button class="btn main" id="vlNew">NOUVELLE PARTIE</button><button class="btn" id="vlFs">PLEIN ÉCRAN</button></div>
      <div class="hint">Tes armes tirent toutes seules : toi, tu marches. Évite les créatures, ramasse les cristaux qu'elles laissent et, à chaque niveau, choisis une amélioration parmi trois : lanterne, dagues, lucioles, foudre, bottes, cœur, aimant, mèche ou huile. Les chauves-souris vont plus vite que toi, les citrouilles et les golems arrivent plus tard, et deux grands corbeaux passent dans la nuit. Une arme au niveau 5 évolue si tu as aussi son objet complice : l'évolution apparaît alors parmi les choix. Tiens 10 minutes et l'aube se lève.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{height:100vh;max-width:100vw}
.gameBox canvas{height:min(calc(100vh - 190px),900px);min-height:300px;max-width:100%;width:auto;aspect-ratio:192/144;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.vlChoose{gap:8px}
.vlPick{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}
.pxk .vlPick .btn{flex-direction:column;align-items:flex-start;text-align:left;padding:4px 10px 8px;font:17px/1.25 var(--text,monospace)}
.pxk .vlPick .btn span{font-size:17px}
.pxk .vlPick .btn small{font-size:14px;opacity:.85}
.vlPick .btn:disabled{opacity:.55;cursor:default}
.vlEvos{display:grid;grid-template-columns:1fr auto;gap:4px 12px}
.vlEvos b{text-align:right}
.vlEvos .vlNo{opacity:.55}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "VEILLÉE", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#ffb02a", "accL": "#fff0a0", "accS": "#c87a1a", "accD": "#2a1a08", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#7ee07a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#2a1a08", "spark2": "#ffb02a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["...kkkk.....", "..kwwwwk....", ".kwwwwwwk...", ".kwwkmmkk...", ".kwwkmmmkk..", "..kbbkkk.k..", ".kbbbbbbkgk.", ".kbbbbbbkok.", ".kbbbbbbkkk.", "..kbbbbk....", "..km.kmk....", "..kk..kk...."],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown'], [/^PLEIN/, 'full']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
  // les trophées de NeoDex (3.4.8 et plus) : succès et records déclarés dans plugin.json ; sur un NeoDex plus ancien, rien ne se passe
  const trophy = id => { ctx.games?.unlock(id).catch(() => {}); };
  const trophyRecord = (id, v) => { if (v != null && Number.isFinite(+v)) ctx.games?.record(id, +v).catch(() => {}); };
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Veillée : tenir toute la nuit, lanterne à la main, contre des vagues de créatures. Les armes tirent toutes seules ;
   on se déplace, on ramasse les cristaux, et à chaque niveau on choisit une amélioration parmi trois. L'aube arrive au bout de 10 minutes ---------- */
const VL = {W: 192, H: 144, DUR: 36000, CAP: 140, BOSS: [18000, 28800]};
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
const vls = gstore('veillee', {games: 0, wins: 0, kills: 0, hero: 'veilleur', map: 'pre'});
let vl = null, vlac = null, vlMute = false;
function vlBeep(f, d, type = 'square', slide = 0, vol = .03) { if (vlMute) return; try { vlac ??= new AudioContext(); const o = vlac.createOscillator(), g = vlac.createGain(), t = vlac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(vlac.destination); o.start(t); o.stop(t + d); } catch {} }
const VL_SPR = {"hero": {"pal": {"k": "#120c1a", "h": "#6a8ad8", "H": "#3a5aa8", "s": "#f0c8a0", "e": "#120c1a", "C": "#2a3a78", "c": "#3a4a98", "y": "#fff0a0", "Y": "#ffb02a", "l": "#4a3a5a"}, "f": [["...kkkk....", "..khhhHk...", ".khhHHHHk..", ".kHHksesk..", ".kHHkssskk.", "..kCCkkk.k.", ".kcCCCCCkyk", ".kcCCCCCkYk", ".kcCCCCCkkk", "..kCCCCk...", "..kl.klk...", "..kk..kk..."], ["...kkkk....", "..khhhHk...", ".khhHHHHk..", ".kHHksesk..", ".kHHkssskk.", "..kCCkkk.k.", ".kcCCCCCkyk", ".kcCCCCCkYk", ".kcCCCCCkkk", "..kCCCCk...", "...klkk....", "...kkk....."]]}, "bat": {"pal": {"k": "#1a0e24", "p": "#8a64b0", "P": "#5a3a80", "r": "#ff5a4a"}, "f": [["p.......p", "pp.....pp", "Ppp.k.ppP", ".PpkkkpP.", "...rkr...", "....k...."], ["....k....", "...kkk...", "...rkr...", ".PppkppP.", "pp.....pp", "p.......p"]], "eyes": [[3, 4], [5, 4]]}, "shade": {"pal": {"k": "#0a0614", "s": "#3a3058", "S": "#52467a", "w": "#d8c8ff"}, "f": [["...kkk...", ".kkSSSkk.", "kSSSSSSSk", "kSSwSwSSk", "kSSSSSSSk", "ksSSSSSsk", "kssssssk.", "ks.ks.ks.", "k..k..k.."], ["...kkk...", ".kkSSSkk.", "kSSSSSSSk", "kSSwSwSSk", "kSSSSSSSk", "ksSSSSSsk", ".ksssssk.", ".ks.ks.sk", "..k..k..k"]], "eyes": [[3, 3], [5, 3]]}, "pumpkin": {"pal": {"k": "#1a0e0a", "o": "#ff8a2a", "O": "#c85a1a", "y": "#ffe04a", "g": "#4a9a2a", "b": "#3a2a4a", "B": "#2a1a36"}, "f": [["....g....", "...kgk...", ".kkoookk.", "kooOoOook", "koyoOoyok", "kooOoOook", "kOyyyyyOk", ".kkkkkkk.", "..kbbbk..", ".kbBbBbk.", ".kbbbbbk.", "..k...k.."], ["....g....", "...kgk...", ".kkoookk.", "kooOoOook", "koyoOoyok", "kooOoOook", "kOyyyyyOk", ".kkkkkkk.", "..kbbbk..", ".kbBbBbk.", ".kbbbbbk.", "...k.k..."]], "eyes": [[2, 4], [6, 4]]}, "golem": {"pal": {"k": "#14141a", "s": "#8a8a9a", "S": "#5a5a6a", "m": "#5a9a3a", "e": "#7ae0ff"}, "f": [["...kkkkk...", "..kmmmssk..", ".kssssssSk.", ".kseSSSeSk.", ".ksSSSSSSk.", "kkkssssSkkk", "ksk.kkk.ksk", "kSk.....kSk", ".kssskssSk.", ".kSSk.kSSk.", "kkkk...kkkk"], ["...kkkkk...", "..kmmmssk..", ".kssssssSk.", ".kseSSSeSk.", ".ksSSSSSSk.", "kkkssssSkkk", "ksk.kkk.ksk", "kSk.....kSk", ".kssskssSk.", "kSSk...kSSk", "kkkk...kkkk"]], "eyes": [[3, 3], [7, 3]]}, "crow": {"pal": {"k": "#0a0610", "b": "#5a4a7a", "B": "#3a2e52", "r": "#ff3a3a", "y": "#ffb02a"}, "f": [["kk............kk", "kbk..........kbk", "kbbk...kk...kbbk", ".kbbk.kBBk.kbbk.", ".kbbbkBrBkkbbbk.", "..kbbBBBByykbk..", "...kkBBBBkkkk...", "....kBBBBk......", ".....kBBk.......", "....kk..kk......"], ["................", ".......kk.......", "......kBBk......", "..kkk.kBrBkkkk..", ".kbbbkBBBByykbbk", "kbbbbBBBBkkkbbbk", "kbk.kBBBBk...kbk", "kk..kBBBBk....kk", ".....kBBk.......", "....kk..kk......"]], "eyes": [[7, 4]]}};
const VL_ICON = {"pal": {"k": "#120c1a", "y": "#ffd84a", "Y": "#ffa82a", "w": "#ffffff", "B": "#9a6a3a", "R": "#ff4a5a", "O": "#5a8ae8", "g": "#c0c0d0"}, "flash": ["..kkkk..", ".kggggkk", "kkkkkkkk", "kyYYYYyk", "kYyyyyYk", "kyYYYYyk", "kkkkkkkk", "..kkkk.."], "dague": ["......kw", ".....kwk", "....kwk.", "...kwk..", ".kkwk...", "..kk....", ".kBk....", "kk......"], "luciole": ["........", ".y....y.", "yYy..yYy", ".y....y.", "....y...", "...yYy..", "....y...", "........"], "eclair": ["....kyy.", "...kyy..", "..kyy...", ".kyyyyk.", "...yyk..", "..yyk...", ".yyk....", ".yk....."], "bottes": ["........", ".kkk....", ".kBk....", ".kBk....", ".kBBkkk.", ".kBBBBBk", ".kkkkkkk", "........"], "coeur": [".kk.kk..", "kRRkRRk.", "kRwRRRk.", "kRRRRRk.", ".kRRRk..", "..kRk...", "...k....", "........"], "aimant": ["........", ".kk..kk.", ".kR..kR.", ".kR..kR.", ".kRkkkR.", "..kRRRk.", "...kkk..", "........"], "meche": ["...y....", "..yYy...", "...k....", "..kwwk..", "..kwwk..", "..kwwk..", "..kwwk..", ".kkkkkk."], "huile": ["...k....", "..kOk...", "..kOk...", ".kOOOk..", "kOOwOOk.", "kOOOOOk.", ".kOOOk..", "..kkk..."]};
// les créatures : points de vie, vitesse, dégâts au contact, cristal laissé, rayon, à partir de quelle minute elles viennent
const VL_FOES = {bat: {hp: 6, spd: 1.12, dmg: 4, xp: 1, r: 4, from: 0}, shade: {hp: 16, spd: .5, dmg: 8, xp: 2, r: 4, from: 1}, pumpkin: {hp: 32, spd: .68, dmg: 10, xp: 3, r: 5, from: 3}, golem: {hp: 90, spd: .42, dmg: 15, xp: 6, r: 6, from: 6}, crow: {hp: 700, spd: .8, dmg: 20, xp: 40, r: 13, from: 99}};
// les personnages : chacun commence avec son arme ; on les débloque en tenant de plus en plus longtemps (en secondes de nuit), le dernier à l'aube
const VL_CHARS = {
  veilleur: {name: 'Le Veilleur', arme: 'flash', need: 0, pal: {}},
  chasseuse: {name: 'La Chasseuse', arme: 'dague', need: 180, pal: {h: '#6ac86a', H: '#2a8a3a', C: '#24482a', c: '#356a3a'}},
  herboriste: {name: 'L’Herboriste', arme: 'luciole', need: 360, pal: {h: '#d08ae8', H: '#9a4ac8', C: '#4a2a6a', c: '#6a3a8a'}},
  sorcier: {name: 'Le Sorcier', arme: 'eclair', need: 'aube', pal: {h: '#f06a5a', H: '#b02a3a', C: '#5a1a2a', c: '#7a2a3a', y: '#a8d8ff', Y: '#5a8ae8'}},
};
// les cartes : le sol (deux teintes de case) et ce qui pousse dessus
const VL_MAPS = {pre: {name: 'Le pré', sub: 'herbe et fleurs'}, cimetiere: {name: 'Le cimetière', sub: 'tombes et brume'}, foret: {name: 'La forêt', sub: 'arbres et fougères'}, ferme: {name: 'La ferme', sub: 'blé et citrouilles'}};
const vlOpen = k => { const n = VL_CHARS[k].need; return n === 'aube' ? vls.wins > 0 : (games.best.veillee || 0) >= n; };
const VL_UP = {  // les améliorations : 5 niveaux chacune
  flash: {name: 'Lanterne', desc: 'lumière plus grande'}, dague: {name: 'Dagues', desc: '+1 dague, plus fortes'},
  luciole: {name: 'Lucioles', desc: '+1 luciole qui tourne'}, eclair: {name: 'Foudre', desc: 'frappe une de plus'},
  bottes: {name: 'Bottes', desc: 'tu marches plus vite'}, coeur: {name: 'Cœur', desc: '+20 PV, et soigne'}, aimant: {name: 'Aimant', desc: 'attire de plus loin'},
  meche: {name: 'Mèche', desc: 'tirs plus fréquents'}, huile: {name: 'Huile', desc: 'armes plus fortes'}};
// les évolutions : l'arme au niveau 5 + son objet complice (au moins niveau 1) ; on garde la trace de celles déjà découvertes
const VL_EVO = {
  phare: {from: 'flash', with: 'huile', name: 'Phare', desc: 'lumière immense qui brûle'},
  lames: {from: 'dague', with: 'bottes', name: 'Mille lames', desc: '12 dagues qui percent'},
  essaim: {from: 'luciole', with: 'aimant', name: 'Essaim', desc: '9 lucioles qui ondulent'},
  orage: {from: 'eclair', with: 'meche', name: 'Orage', desc: '10 éclairs qui éclatent'},
};
const vlEvo = k => vl.evo?.[k];
const vlUpInfo = k => VL_UP[k] || VL_EVO[k] || {name: 'Soin', desc: 'toute ta vie revient'};
const vlEvoReady = () => Object.keys(VL_EVO).filter(k => { const o = VL_EVO[k]; return vlL(o.from) >= 5 && vlL(o.with) > 0 && !vl.evo[o.from]; });
const vlFlyN = () => vlEvo('luciole') ? 9 : vlL('luciole') + 1;
const vlFly = i => { const ev = vlEvo('luciole'), R = ev ? 24 + Math.sin(vl.t * .05) * 10 : 22, a = vl.t * (ev ? .08 : .06) + i * Math.PI * 2 / vlFlyN(); return [Math.cos(a) * R, Math.sin(a) * R]; };
function vlNew() {
  const g = vl?.g;
  vl = renew(vl, {g, mode: 'ready', tick: 0, seen: 0, t: 0, rnd: seeded(Date.now() % 1e9), keys: new Set(), x: 0, y: 0, face: 1, walk: 0, mx: 1, my: 0, hp: 100, max: 100, inv: 0,
    lv: 1, xp: 0, next: 5, kills: 0, hero: vlOpen(vls.hero || 'veilleur') ? vls.hero || 'veilleur' : 'veilleur', map: VL_MAPS[vls.map] ? vls.map : 'pre', up: {}, evo: {}, cds: {}, foes: [], gems: [], shots: [], fx: [], spawn: 0, picks: null, sel: 0, dead: 0, won: false, record: false, aim: null, bossN: 0});
  vl.up[VL_CHARS[vl.hero].arme] = 1;
  vlInfo();
}
const vlL = k => vl.up[k] || 0;
const vlDmg = d => d * (1 + .15 * vlL('huile'));
const vlCd = f => Math.round(f * (1 - .08 * vlL('meche')));
function vlSpawn(type, mult = 1) {
  const a = (vl.rnd() < .5 ? Math.atan2(vl.my, vl.mx) + (vl.rnd() - .5) * 2 : vl.rnd() * Math.PI * 2), d = 120 + vl.rnd() * 20, F = VL_FOES[type], hp = F.hp * (1 + vl.t / 3600 * .12) * mult;
  vl.foes.push({type, x: vl.x + Math.cos(a) * d, y: vl.y + Math.sin(a) * d, hp, max: hp, kx: 0, ky: 0, hit: 0, f: vl.rnd() * 20 | 0});
}
function vlHurt(e, dmg, kb = 1.5) {
  e.hp -= dmg; e.hit = 6; const dx = e.x - vl.x, dy = e.y - vl.y, d = Math.hypot(dx, dy) || 1; if (e.type !== 'crow') { e.kx += dx / d * kb; e.ky += dy / d * kb; }
  if (e.hp <= 0 && !e.gone) {
    e.gone = 1; vl.kills++; const F = VL_FOES[e.type];
    vl.gems.push({x: e.x, y: e.y, v: F.xp}); if (vl.rnd() < .012) vl.gems.push({x: e.x + 3, y: e.y, heal: 1});
    for (let i = 0; i < 5; i++) vl.fx.push({k: 'bit', x: e.x, y: e.y, vx: (vl.rnd() - .5) * 2, vy: (vl.rnd() - .5) * 2, t: 14, c: e.type === 'pumpkin' ? '#ff8a2a' : e.type === 'golem' ? '#8a8a9a' : '#8a7aa8'});
    vlBeep(e.type === 'crow' ? 120 : 220, .06, 'square', 110, .02);
  }
}
function vlOptions() {
  const pool = Object.keys(VL_UP).filter(k => vlL(k) < 5);
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(vl.rnd() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const all = [...vlEvoReady().slice(0, 1), ...pool];  // une évolution prête passe toujours en premier
  return all.length ? all.slice(0, 3) : ['soin'];
}
function vlTake(k) {
  if (VL_EVO[k]) { vl.evo[VL_EVO[k].from] = k; vls.evos = [...new Set([...(vls.evos || []), k])]; vl.fx.push({k: 'evo', t: 50, name: VL_EVO[k].name}); [392, 523, 659, 784, 1047].forEach((f, i) => setTimeout(() => vlBeep(f, .14, 'triangle'), i * 80)); }
  else if (k === 'soin') vl.hp = vl.max; else { vl.up[k] = vlL(k) + 1; if (k === 'coeur') { vl.max += 20; vl.hp = Math.min(vl.max, vl.hp + 40); } }
  vl.picks = null; vl.mode = 'play'; vlBeep(660, .1, 'triangle', 990);
}
function vlUpdate() {
  if (vl.picks) return;
  vl.t++;
  // le déplacement : clavier, ou vers le doigt / la souris
  let mx = (vl.keys.has('R') ? 1 : 0) - (vl.keys.has('L') ? 1 : 0), my = (vl.keys.has('D') ? 1 : 0) - (vl.keys.has('U') ? 1 : 0);
  if (vl.aim) { mx = vl.aim[0]; my = vl.aim[1]; }
  const ml = Math.hypot(mx, my), spd = 1 + .1 * vlL('bottes');
  if (ml > .5) { vl.x += mx / ml * spd; vl.y += my / ml * spd; vl.mx = mx / ml; vl.my = my / ml; vl.walk++; if (Math.abs(mx) > .3) vl.face = Math.sign(mx); } else vl.walk = 0;
  if (vl.inv) vl.inv--;
  // les créatures arrivent de plus en plus nombreuses ; deux grands corbeaux dans la nuit
  const min = vl.t / 3600;
  vl.spawn += .9 + min * 1.1;
  while (vl.spawn >= 60 && vl.foes.length < VL.CAP) {
    vl.spawn -= 60; const types = Object.keys(VL_FOES).filter(k => VL_FOES[k].from <= min);
    vlSpawn(types[Math.min(types.length - 1, Math.floor(Math.pow(vl.rnd(), 1.6) * types.length))]);
  }
  if (vl.spawn >= 60) vl.spawn = 0;
  if (VL.BOSS[vl.bossN] !== undefined && vl.t >= VL.BOSS[vl.bossN]) { vlSpawn('crow', 1 + vl.bossN * 1.5); vl.bossN++; vlBeep(90, .8, 'sawtooth', 60, .05); }
  // les créatures avancent vers toi, se poussent un peu entre elles, et mordent au contact
  for (const e of vl.foes) {
    const F = VL_FOES[e.type], dx = vl.x - e.x, dy = vl.y - e.y, d = Math.hypot(dx, dy) || 1;
    e.x += dx / d * F.spd + e.kx; e.y += dy / d * F.spd + e.ky; e.kx *= .8; e.ky *= .8; if (e.hit) e.hit--; e.f++;
    if (d > 200) { const a = Math.atan2(vl.my, vl.mx) + (vl.rnd() - .5) * 2; e.x = vl.x + Math.cos(a) * 125; e.y = vl.y + Math.sin(a) * 125; }  // trop loin derrière : elle revient devant toi
    if (d < F.r + 4 && !vl.inv) { vl.hp -= F.dmg; vl.inv = 40; vlBeep(140, .12, 'sawtooth', 70, .04); }
  }
  const grid = new Map(), cell = e => Math.floor(e.x / 16) + ',' + Math.floor(e.y / 16);  // on ne compare que les voisines (cases de 16 pixels)
  for (const e of vl.foes) { const k = cell(e); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(e); }
  for (const a of vl.foes) { const cx = Math.floor(a.x / 16), cy = Math.floor(a.y / 16);
    for (let gx = cx - 1; gx <= cx + 1; gx++) for (let gy = cy - 1; gy <= cy + 1; gy++) for (const b of grid.get(gx + ',' + gy) || []) {
      if (b === a) continue; const dx = b.x - a.x, dy = b.y - a.y, s = VL_FOES[a.type].r + VL_FOES[b.type].r;
      if (Math.abs(dx) < s && Math.abs(dy) < s) { const d = Math.hypot(dx, dy) || 1, p = (s - d) / s * .25; if (p > 0) { a.x -= dx / d * p; a.y -= dy / d * p; b.x += dx / d * p; b.y += dy / d * p; } }
    } }
  // les armes, chacune à son rythme
  const cd = (k, f) => { vl.cds[k] = (vl.cds[k] || 0) + 1; if (vl.cds[k] < vlCd(f)) return false; vl.cds[k] = 0; return true; };
  const L1 = vlL('flash');
  const E1 = vlEvo('flash');
  if (L1 && cd('flash', E1 ? 48 : 100 - L1 * 6)) { const R = E1 ? 64 : 20 + L1 * 5; vl.fx.push({k: 'ring', r: R, t: 12, big: E1}); for (const e of vl.foes) if (Math.hypot(e.x - vl.x, e.y - vl.y) < R + VL_FOES[e.type].r) vlHurt(e, vlDmg(E1 ? 36 : 5 + L1 * 3), E1 ? 5 : 3); vlBeep(880, .05, 'triangle', 440, .015); }
  const L2 = vlL('dague');
  const E2 = vlEvo('dague');
  if (L2 && cd('dague', E2 ? 34 : 56 - L2 * 5)) {
    let near = null, nd = 1e9; for (const e of vl.foes) { const d = Math.hypot(e.x - vl.x, e.y - vl.y); if (!e.gone && d < nd) { nd = d; near = e; } }
    const base = near ? Math.atan2(near.y - vl.y, near.x - vl.x) : (vl.face > 0 ? 0 : Math.PI), n = E2 ? 12 : 1 + Math.floor(L2 / 2);
    for (let i = 0; i < n; i++) { const a = E2 ? base + i * Math.PI / 6 : base + (i - (n - 1) / 2) * .18; vl.shots.push({x: vl.x, y: vl.y - 3, vx: Math.cos(a) * 3.2, vy: Math.sin(a) * 3.2, t: 60, pierce: E2 ? 6 : 1 + Math.floor(L2 / 3), evo: !!E2, dmg: vlDmg(8 + L2 * 3), hits: new Set()}); }
  }
  for (const s of vl.shots) {
    s.x += s.vx; s.y += s.vy; s.t--;
    for (const e of vl.foes) if (!e.gone && !s.hits.has(e) && Math.abs(e.x - s.x) < VL_FOES[e.type].r + 2 && Math.abs(e.y - 3 - s.y) < VL_FOES[e.type].r + 3) { s.hits.add(e); vlHurt(e, s.dmg); if (--s.pierce <= 0) { s.t = 0; break; } }
  }
  vl.shots = vl.shots.filter(s => s.t > 0);
  const L3 = vlL('luciole');
  const E3 = vlEvo('luciole');
  if (L3) for (let i = 0, n = vlFlyN(); i < n; i++) {
    const [cx, cy] = vlFly(i), fx = vl.x + cx, fy = vl.y - 3 + cy;
    for (const e of vl.foes) if (!e.gone && (e.fly || 0) <= vl.t && Math.hypot(e.x - fx, e.y - 3 - fy) < VL_FOES[e.type].r + 3) { vlHurt(e, vlDmg(E3 ? 15 : 4 + L3 * 2), 1); e.fly = vl.t + (E3 ? 12 : 20); }
  }
  const L4 = vlL('eclair');
  const E4 = vlEvo('eclair');
  if (L4 && cd('eclair', E4 ? 60 : 130 - L4 * 12)) {
    const seen = vl.foes.filter(e => !e.gone && Math.abs(e.x - vl.x) < VL.W / 2 && Math.abs(e.y - vl.y) < VL.H / 2);
    for (let i = 0; i < (E4 ? 10 : L4) && seen.length; i++) { const e = seen.splice(Math.floor(vl.rnd() * seen.length), 1)[0]; vlHurt(e, vlDmg(E4 ? 70 : 15 + L4 * 8), 0); vl.fx.push({k: 'bolt', x: e.x, y: e.y, t: 8, seed: vl.rnd() * 1e6 | 0, evo: !!E4});
      if (E4) { for (const o of vl.foes) if (o !== e && !o.gone && Math.hypot(o.x - e.x, o.y - e.y) < 16) vlHurt(o, vlDmg(30), 2); vl.fx.push({k: 'burst', x: e.x, y: e.y, t: 10}); } }
    vlBeep(1400, .08, 'sawtooth', 200, .02);
  }
  vl.foes = vl.foes.filter(e => !e.gone);
  // les cristaux : l'aimant les attire
  const mag = 18 + vlL('aimant') * 10;
  for (const gm of vl.gems) {
    const dx = vl.x - gm.x, dy = vl.y - 3 - gm.y, d = Math.hypot(dx, dy);
    if (d < mag || gm.pull) { gm.pull = 1; gm.x += dx / (d || 1) * 3; gm.y += dy / (d || 1) * 3; }
    if (d < 6) { gm.got = 1; if (gm.heal) { vl.hp = Math.min(vl.max, vl.hp + 30); vlBeep(520, .15, 'triangle', 780); } else { vl.xp += gm.v; vlBeep(1200 + Math.min(600, vl.xp * 8), .03, 'triangle', 0, .012); } }
  }
  vl.gems = vl.gems.filter(gm => !gm.got && Math.abs(gm.x - vl.x) < 400 && Math.abs(gm.y - vl.y) < 400);
  for (const f of vl.fx) { f.t--; if (f.k === 'bit') { f.x += f.vx; f.y += f.vy; } } vl.fx = vl.fx.filter(f => f.t > 0);
  if (vl.xp >= vl.next) { vl.xp -= vl.next; vl.lv++; vl.next = Math.round(5 + vl.lv * 3.5 + vl.lv * vl.lv * .15); vl.picks = vlOptions(); vl.sel = 0; vl.mode = 'pick'; [523, 659, 784].forEach((f, i) => setTimeout(() => vlBeep(f, .1), i * 70)); }
  if (vl.hp <= 0) return vlEnd(false);
  if (vl.t >= VL.DUR) return vlEnd(true);
}
function vlEnd(win) {
  vl.mode = 'over'; vl.won = win; vl.dead = 0; vl.hp = Math.max(0, vl.hp); vl.picks = null;
  vls.games++; vls.kills += vl.kills; if (win) vls.wins++;
  vl.record = best('veillee', Math.floor(vl.t / 60)); best('veillee-kills', vl.kills); saveGames(); vlInfo();
  (win ? [523, 659, 784, 1047] : [392, 330, 262, 196]).forEach((f, i) => setTimeout(() => vlBeep(f, .18, 'triangle'), i * 140));
}
/* ---------- le dessin : un pré dans la nuit, la lumière de la lanterne autour de toi, des yeux qui brillent dans le noir ---------- */
let vlDark = null;
function vlDarkMask() {  // le noir tramé autour de la lanterne : calculé une seule fois
  const c = Object.assign(document.createElement('canvas'), {width: VL.W, height: VL.H}), o = c.getContext('2d'), img = o.createImageData(VL.W, VL.H), B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  for (let y = 0; y < VL.H; y++) for (let x = 0; x < VL.W; x++) {
    const d = Math.hypot(x - VL.W / 2, (y - VL.H / 2) * 1.15), v = Math.min(1, Math.max(0, (d - 34) / 60)), i = (y * VL.W + x) * 4;
    if (v > B[(y & 3) * 4 + (x & 3)] / 16) { img.data[i] = 6; img.data[i + 1] = 4; img.data[i + 2] = 16; img.data[i + 3] = 190; }
  }
  o.putImageData(img, 0, 0); return c;
}
const vlMirror = rows => rows.map(r => [...r].reverse().join(''));
const vlBig = rows => rows.flatMap(r => { const d = r.replace(/./g, '$&$&'); return [d, d]; });  // le grand corbeau est dessiné en double taille
function vlSprite(g, key, frame, cx, cy, flip, flash) {
  const S = VL_SPR[key], rows = key === 'crow' ? vlBig(S.f[frame % S.f.length]) : S.f[frame % S.f.length], w = rows[0].length, h = rows.length, pal = flash ? Object.fromEntries(Object.keys(S.pal).map(k => [k, '#ffffff'])) : key === 'hero' ? {...S.pal, ...VL_CHARS[vl.hero]?.pal} : S.pal;
  sprite(g, flip ? vlMirror(rows) : rows, Math.round(cx - w / 2), Math.round(cy - h), pal);
}
const VL_FLAT = new Set(Object.values(VL_EVO).map(o => o.from));  // les armes qui peuvent évoluer
const vlClock = sec => Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
function vlDraw() {
  const g = vl.g, {W, H} = VL, ox = Math.round(vl.x - W / 2), oy = Math.round(vl.y - H / 2);
  for (; vl.seen < vl.tick; vl.seen++) if (vl.mode === 'over') vl.dead++;
  g.imageSmoothingEnabled = false;
  // le pré : des cases de 16 pixels, herbe, fleurs, cailloux, champignons placés au hasard mais toujours au même endroit
  for (let ty = Math.floor(oy / 16); ty <= Math.floor((oy + H) / 16); ty++) for (let tx = Math.floor(ox / 16); tx <= Math.floor((ox + W) / 16); tx++) {
    const sx = tx * 16 - ox, sy = ty * 16 - oy, hsh = Math.imul(tx * 73856093 ^ ty * 19349663, 2654435761) >>> 0;
    const k = hsh % 23, dx = sx + (hsh >> 5) % 11 + 2, dy = sy + (hsh >> 9) % 11 + 3;
    if (vl.map === 'cimetiere') {
      px(g, (tx + ty) & 1 ? '#262c2c' : '#2a3030', sx, sy, 16, 16);
      if (k < 3) { px(g, '#0e0c14', dx - 1, dy - 6, 7, 9); px(g, '#7a7a8a', dx, dy - 7, 5, 9); px(g, '#9a9aaa', dx + 1, dy - 7, 3, 1); px(g, '#4a4a5a', dx + 2, dy - 5, 1, 4); px(g, '#4a4a5a', dx + 1, dy - 4, 3, 1); px(g, '#3a3a2a', dx - 1, dy + 2, 7, 1); }
      else if (k < 7) { px(g, '#4a5a4a', dx, dy, 1, 2); px(g, '#4a5a4a', dx + 2, dy - 1, 1, 3); }
      else if (k < 8) { px(g, '#d8d0c0', dx, dy, 4, 1); px(g, '#d8d0c0', dx - 1, dy - 1, 1, 1); px(g, '#d8d0c0', dx + 4, dy + 1, 1, 1); }
      else if (k < 9) { px(g, '#5a4a3a', sx, sy + 8, 16, 1); px(g, '#5a4a3a', sx + 3, sy + 5, 1, 6); px(g, '#5a4a3a', sx + 11, sy + 5, 1, 6); }
    } else if (vl.map === 'foret') {
      px(g, (tx + ty) & 1 ? '#1a3020' : '#1d3422', sx, sy, 16, 16);
      if (k < 3) { px(g, '#3a2a1a', dx + 2, dy - 3, 2, 6); [4, 6, 8, 8, 8, 6, 4].forEach((w, i) => { px(g, '#0e1a12', dx + 3 - w / 2 - 1, dy - 11 + i, w + 2, 1); px(g, i < 2 ? '#2e7a3a' : i < 5 ? '#1e5a2a' : '#164a22', dx + 3 - w / 2, dy - 11 + i, w, 1); }); px(g, '#0e1a12', dx + 1, dy - 12, 4, 1); px(g, '#0e1a12', dx + 1, dy - 4, 4, 1); px(g, '#4a9a4a', dx + 1, dy - 10, 2, 1); }
      else if (k < 7) { px(g, '#2e6a34', dx, dy, 1, 3); px(g, '#2e6a34', dx + 1, dy - 1, 2, 1); px(g, '#2e6a34', dx - 2, dy - 1, 2, 1); px(g, '#2e6a34', dx + 1, dy + 1, 2, 1); }
      else if (k < 8) { px(g, '#c83a3a', dx, dy, 4, 2); px(g, '#ffffff', dx + 1, dy, 1, 1); px(g, '#d8c8b0', dx + 1, dy + 2, 2, 2); }
      else if (k < 9) { px(g, '#4a3a2a', dx - 2, dy, 8, 2); px(g, '#6a5a3a', dx - 1, dy, 6, 1); }
    } else if (vl.map === 'ferme') {
      px(g, (tx + ty) & 1 ? '#3a3220' : '#3e3622', sx, sy, 16, 16);
      if (ty % 3) { for (let i = 1; i < 16; i += 3) { px(g, '#8a7a3a', sx + i, sy + 6, 1, 6); px(g, '#d8b84a', sx + i, sy + 5, 1, 2); } }
      else { px(g, '#6a4a2a', sx, sy + 7, 16, 1); px(g, '#6a4a2a', sx, sy + 10, 16, 1); px(g, '#8a6a3a', sx + 2, sy + 5, 2, 8); }
      if (k < 2 && ty % 3) { px(g, '#0e0a08', dx - 1, dy - 1, 7, 6); px(g, '#ff8a2a', dx, dy, 5, 4); px(g, '#c85a1a', dx + 2, dy, 1, 4); px(g, '#3a6a2a', dx + 2, dy - 1, 1, 1); }
    } else {
      px(g, (tx + ty) & 1 ? '#24442a' : '#28482e', sx, sy, 16, 16);
      if (k < 6) { px(g, '#3a6a3a', dx, dy, 1, 2); px(g, '#3a6a3a', dx + 2, dy - 1, 1, 3); px(g, '#3a6a3a', dx + 4, dy, 1, 2); }
      else if (k < 8) { px(g, '#e8e0f0', dx, dy, 1, 1); px(g, '#e8e0f0', dx + 2, dy, 1, 1); px(g, '#e8e0f0', dx + 1, dy - 1, 1, 1); px(g, '#e8e0f0', dx + 1, dy + 1, 1, 1); px(g, '#ffd84a', dx + 1, dy, 1, 1); }
      else if (k < 9) { px(g, '#5a5a6a', dx, dy, 4, 2); px(g, '#7a7a8a', dx + 1, dy - 1, 2, 1); }
      else if (k < 10) { px(g, '#c83a3a', dx, dy, 4, 2); px(g, '#ffffff', dx + 1, dy, 1, 1); px(g, '#d8c8b0', dx + 1, dy + 2, 2, 2); }
    }
  }
  for (const gm of vl.gems) { const x = Math.round(gm.x - ox), y = Math.round(gm.y - oy); if (gm.heal) { px(g, '#c8884a', x - 2, y - 2, 5, 3); px(g, '#e8b878', x - 1, y - 2, 3, 1); } else { const c = gm.v >= 6 ? ['#ff6a8a', '#ffc8d8'] : gm.v >= 3 ? ['#4ae08a', '#c8ffd8'] : ['#4ab8ff', '#c8f0ff']; px(g, c[0], x - 1, y - 2, 3, 4); px(g, c[1], x, y - 2, 1, 2); } }
  // créatures et héros, du haut vers le bas de l'écran pour qu'ils se cachent bien les uns derrière les autres
  const ents = vl.foes.map(e => [e.y, () => vlSprite(g, e.type, e.f >> 3, e.x - ox, e.y - oy, e.x > vl.x, e.hit > 3)]);
  ents.push([vl.y, () => { if ((vl.mode === 'over' && !vl.won) || (vl.inv && (vl.inv >> 2) % 2)) return; vlSprite(g, 'hero', vl.walk >> 3, W / 2, H / 2 + 6, vl.face < 0, false); }]);
  for (const [, fn] of ents.sort((a, b) => a[0] - b[0])) fn();
  for (const s of vl.shots) { const x = Math.round(s.x - ox), y = Math.round(s.y - oy), a = Math.atan2(s.vy, s.vx); for (let i = 0; i < 5; i++) px(g, i < 3 ? (s.evo ? '#ffb8ff' : '#e8f0ff') : '#9a6a3a', x - Math.cos(a) * i, y - Math.sin(a) * i, 1, 1); }
  // la nuit : le noir autour de la lanterne s'éclaircit à l'approche de l'aube
  vlDark ??= vlDarkMask();
  const night = vl.won ? 0 : Math.max(.2, 1 - Math.max(0, vl.t - VL.DUR * .8) / (VL.DUR * .2) * .8);
  g.globalAlpha = night; g.drawImage(vlDark, 0, 0); g.globalAlpha = 1;
  for (const e of vl.foes) { const S = VL_SPR[e.type], z = e.type === 'crow' ? 2 : 1, rows = S.f[(e.f >> 3) % S.f.length], w = rows[0].length * z, h = rows.length * z, flip = e.x > vl.x; for (const [ex, ey] of S.eyes) px(g, e.type === 'golem' ? '#7ae0ff' : e.type === 'pumpkin' ? '#ffe04a' : '#ff5a4a', Math.round(e.x - ox - w / 2) + (flip ? w - z - ex * z : ex * z), Math.round(e.y - oy - h) + ey * z, z, z); }
  const L3 = vlL('luciole');
  const fc = vlEvo('luciole') ? '#aaff6a' : '#ffd84a';
  for (let i = 0, n = L3 ? vlFlyN() : 0; i < n; i++) { const [cx, cy] = vlFly(i), x = Math.round(W / 2 + cx), y = Math.round(H / 2 + 3 + cy); px(g, fc, x - 1, y, 3, 1); px(g, fc, x, y - 1, 1, 3); px(g, '#ffffff', x, y, 1, 1); }
  for (const f of vl.fx) {
    if (f.k === 'ring') { const r = f.r * (1 - f.t / 14), n = Math.max(12, Math.round(r * 2)); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; px(g, f.big ? (f.t > 6 ? '#ffffff' : '#ff8aff') : f.t > 6 ? '#fff0a0' : '#ffb02a', W / 2 + Math.cos(a) * r, H / 2 + 3 + Math.sin(a) * r * .8, 1, 1); } }
    if (f.k === 'bolt') { const r = seeded(f.seed); let x = f.x - ox, y = 12; const ty = f.y - oy - 4; while (y < ty) { const nx = x + (r() - .5) * 6; px(g, f.t > 4 ? '#ffffff' : '#a8d8ff', Math.min(x, nx), y, Math.abs(nx - x) + 1, 1); px(g, '#a8d8ff', nx, y, 1, 4); x = nx; y += 4; } }
    if (f.k === 'bit') px(g, f.c, f.x - ox, f.y - oy - 3, 1, 1);
    if (f.k === 'burst') { const r = (10 - f.t) * 1.6; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; px(g, f.t > 5 ? '#ffffff' : '#a8d8ff', f.x - ox + Math.cos(a) * r, f.y - oy - 4 + Math.sin(a) * r * .8, 1, 1); } }
    if (f.k === 'evo') { g.globalAlpha = Math.min(.6, f.t / 60); px(g, '#ffe8ff', 0, 12, W, H - 12); g.globalAlpha = 1; if (f.t > 8) gameText(g, W, [['ÉVOLUTION', '#ff8aff', 12], [f.name, '#ffffff']], 60); }
  }
  // le haut de l'écran : vie, cristaux, heure de la nuit
  px(g, '#0e0a14', 0, 0, W, 11);
  px(g, '#2a2236', 3, 2, 50, 3); px(g, vl.hp > vl.max * .3 ? '#ff4a5a' : '#ff8a3a', 3, 2, Math.round(50 * vl.hp / vl.max), 3);
  px(g, '#2a2236', 3, 7, 50, 2); px(g, '#4ab8ff', 3, 7, Math.round(50 * vl.xp / vl.next), 2);
  const clock = vlClock(Math.floor(vl.t / 60));
  pxFont(g, clock, W / 2, 9, '#ffffff', 8, 'center'); pxFont(g, 'niv ' + vl.lv, W - 4, 9, '#ffd84a', 8, 'right');
  px(g, '#2a2236', W / 2 - 30, 11, 60, 1); px(g, '#ffd84a', W / 2 - 30, 11, Math.round(60 * Math.min(1, vl.t / VL.DUR)), 1);
  const ups = Object.keys(VL_UP).filter(k => vlL(k));
  if (ups.length && !vl.picks) { px(g, 'rgba(14,10,20,.85)', 0, H - 11, ups.length * 13 + 3, 11);
    ups.forEach((k, i) => { const I = VL_ICON[k], x = 2 + i * 13, y = H - 10, ev = VL_FLAT.has(k) && vlEvo(k); for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const col = VL_ICON.pal[I[r][c]]; if (col) px(g, col, x + c, y + r, 1, 1); } for (let j = 0; j < 5; j++) px(g, j < vlL(k) ? (ev ? '#ff8aff' : '#ffd84a') : '#3a3046', x + 9, y + 8 - j * 2, 1, 1); if (ev) px(g, '#ff8aff', x, y - 1, 8, 1); }); }
  if (vl.mode === 'ready') gameText(g, W, [['VEILLÉE', '#ffd84a', 12], [VL_CHARS[vl.hero].name + ' · ' + VL_MAPS[vl.map].name, '#ffffff'], ['Flèches ou ZQSD : marcher', '#ffffff'], ['Tiens jusqu’à l’aube !', '#b8d0ff']], 56);
  if (vl.mode === 'pause') gameText(g, W, [['PAUSE', '#ffd84a', 12], ['Entrée : reprendre', '#b8b0c8']], 66);
  if (vl.picks) {
    px(g, 'rgba(6,4,16,.78)', 0, 12, W, H - 12); pxFont(g, 'NIVEAU ' + vl.lv + ' !', W / 2, 30, '#ffd84a', 12, 'center');
    vl.picks.forEach((k, i) => {
      const y = 38 + i * 32, on = i === vl.sel, U = vlUpInfo(k);
      px(g, on ? '#ffd84a' : VL_EVO[k] ? '#c85ac8' : '#4a3e5a', 8, y, W - 16, 28); px(g, on ? '#3a2e4a' : '#1e1828', 9, y + 1, W - 18, 26);
      const I = VL_ICON[k] || VL_ICON[VL_EVO[k]?.from]; if (I) for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const col = VL_ICON.pal[I[r][c]]; if (col) px(g, col, 14 + c * 2, y + 6 + r * 2, 2, 2); }
      pxFont(g, U.name + (k === 'soin' ? '' : VL_EVO[k] ? '  ÉVOLUTION' : vlL(k) ? '  niv ' + (vlL(k) + 1) : '  NOUVEAU'), 36, y + 12, on ? '#ffffff' : '#c8c0d8', 8);
      pxFont(g, U.desc, 36, y + 23, on ? '#ffd84a' : '#8a8098', 8);
    });
  }
  const b = games.best.veillee || 0;
  if (vl.mode === 'over' && vl.dead > 30) gameText(g, W, vl.won ? [['L’AUBE !', '#ffd84a', 12], ['Tu as tenu toute la nuit', '#ffffff'], [vl.kills + ' créatures vaincues', '#b8d0ff'], [vl.dead > 60 ? 'Espace : rejouer' : '', '#b8b0c8']]
    : [['LA NUIT A GAGNÉ', '#ff4a5a', 12], ['Tenu ' + clock + ', ' + vl.kills + ' vaincues', '#ffffff'], [vl.record ? 'NOUVEAU RECORD !' : 'Record ' + vlClock(b), '#ffd84a'], [vl.dead > 60 ? 'Espace : rejouer' : '', '#b8b0c8']], 56);
  if (vl.tick % 15 === 0) g.canvas.setAttribute('aria-label', 'Veillée : ' + clock + ', niveau ' + vl.lv + ', ' + Math.ceil(vl.hp) + ' PV sur ' + vl.max + ', ' + vl.kills + ' créatures vaincues' +
    (vl.picks ? '. Choix : ' + vl.picks.map((k, i) => (i === vl.sel ? '[' : '') + vlUpInfo(k).name + (i === vl.sel ? ']' : '')).join(', ') : '') + (vl.mode === 'over' ? (vl.won ? ', aube' : ', perdu') : '') + '.');
}
function vlChoose() {
  const mk = (box, list, cur, open, sub, set) => $(box).replaceChildren(...Object.entries(list).map(([k, o]) => {
    const b = el('button', 'btn' + (k === cur ? ' main' : '')), ok = open(k); b.disabled = !ok; b.setAttribute('aria-pressed', k === cur);
    b.append(el('span', '', ok ? o.name : '???'), el('small', '', sub(k, o, ok)));
    b.onclick = () => { set(k); saveGames(); if (vl.mode === 'ready' || vl.mode === 'over') vlNew(); else vlChoose(); b.blur(); };
    return b;
  }));
  const lock = n => n === 'aube' ? 'voir l’aube' : 'tenir ' + Math.round(n / 60) + ' min';
  mk('vlChars', VL_CHARS, vlOpen(vls.hero || 'veilleur') ? vls.hero || 'veilleur' : 'veilleur', vlOpen, (k, o, ok) => ok ? 'commence avec : ' + VL_UP[o.arme].name : 'pour l’avoir : ' + lock(o.need), k => { vls.hero = k; });
  mk('vlMaps', VL_MAPS, VL_MAPS[vls.map] ? vls.map : 'pre', () => true, (k, o) => o.sub, k => { vls.map = k; });
}
function vlInfo() {
  setTimeout(vlTrophies);
  if (vl) vlChoose();
  const found = vls.evos || [], vlRecipe = (o, c) => { const s = el('span', c); s.append(el('span', '', VL_UP[o.from].name), el('span', '', ' niv 5 + '), el('span', '', VL_UP[o.with].name)); return s; };  // morceaux séparés : chacun se traduit
  $('vlEvos').replaceChildren(...Object.entries(VL_EVO).flatMap(([k, o]) => [vlRecipe(o, found.includes(k) ? '' : 'vlNo'), el('b', found.includes(k) ? '' : 'vlNo', found.includes(k) ? o.name : '???')]));
  $('vlStats').replaceChildren(...[['Plus longue nuit', vlClock(games.best.veillee || 0)], ['Aubes vues', vls.wins], ['Créatures vaincues', vls.kills], ['Parties', vls.games]].flatMap(([a, c]) => [el('span', '', a), el('b', '', String(c))]));
}
const VL_KEYS = {ArrowLeft: 'L', q: 'L', a: 'L', ArrowRight: 'R', d: 'R', ArrowUp: 'U', z: 'U', w: 'U', ArrowDown: 'D', s: 'D'};
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !vl || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key;
  if (vl.mode === 'over') { if ((k === ' ' || k === 'Enter') && vl.dead > 60) { e.preventDefault(); vlNew(); vl.mode = 'play'; } return; }
  if (vl.picks) {
    e.preventDefault();
    if (VL_KEYS[k] === 'U' || VL_KEYS[k] === 'L') vl.sel = (vl.sel + vl.picks.length - 1) % vl.picks.length;
    else if (VL_KEYS[k] === 'D' || VL_KEYS[k] === 'R') vl.sel = (vl.sel + 1) % vl.picks.length;
    else if (k === ' ' || k === 'Enter') vlTake(vl.picks[vl.sel]);
    else if (/^[123]$/.test(k) && vl.picks[+k - 1]) vlTake(vl.picks[+k - 1]);
    vl.keys.clear(); return;
  }
  if (k === 'p' || k === 'P' || k === 'Escape') { if (vl.mode === 'play') vl.mode = 'pause'; else if (vl.mode === 'pause') vl.mode = 'play'; return; }
  if (VL_KEYS[k]) { e.preventDefault(); vl.keys.add(VL_KEYS[k]); vl.mode = 'play'; }
  else if ((k === ' ' || k === 'Enter') && vl.mode !== 'play') { e.preventDefault(); vl.mode = 'play'; }
});
document.addEventListener('keyup', e => { if (vl && VL_KEYS[e.key]) vl.keys.delete(VL_KEYS[e.key]); });
{ const cv = $('vlCanvas');  // à la souris ou au doigt : maintenir appuyé fait marcher vers ce point ; dans le menu, un clic choisit
  const at = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * VL.W, (e.clientY - r.top) / r.height * VL.H]; };
  cv.onpointerdown = e => { e.preventDefault(); if (!vl) return; const [x, y] = at(e);
    if (vl.mode === 'over') { if (vl.dead > 60) { vlNew(); vl.mode = 'play'; } return; }
    if (vl.picks) { const i = Math.floor((y - 38) / 32); if (i >= 0 && i < vl.picks.length && y - 38 - i * 32 < 28) vlTake(vl.picks[i]); return; }
    vl.mode = 'play'; vl.aim = [x - VL.W / 2, y - VL.H / 2]; cv.setPointerCapture?.(e.pointerId); };
  cv.onpointermove = e => { if (vl?.aim) { const [x, y] = at(e); vl.aim = [x - VL.W / 2, y - VL.H / 2]; } };
  cv.onpointerup = () => { if (vl) vl.aim = null; }; }
$('vlCanvas').__vl = {st: () => vl, options: () => vlOptions()};
$('vlNew').onclick = () => { vlNew(); $('vlNew').blur(); };
// le joueur automatique de la vérification : s'éloigne des créatures proches, va vers le cristal le plus proche, prend la 1re amélioration
function vlBot() {
  if (vl.picks) { vlTake(vl.picks[0]); return; }
  let fx = 0, fy = 0;
  for (const e of vl.foes) { const dx = vl.x - e.x, dy = vl.y - e.y, d2 = dx * dx + dy * dy + 1; if (d2 < 2500) { fx += dx / d2 * 40; fy += dy / d2 * 40; } }
  let gm = null, gd = 70; for (const c of vl.gems) { const d = Math.hypot(c.x - vl.x, c.y - vl.y); if (d < gd) { gd = d; gm = c; } }
  if (gm) { fx += (gm.x - vl.x) / gd * .6; fy += (gm.y - vl.y) / gd * .6; }
  if (Math.hypot(fx, fy) < .6) { fx = Math.cos(vl.t / 200); fy = Math.sin(vl.t / 200); }
  vl.aim = [fx * 10, fy * 10];
}
{  // vérification : le joueur automatique (pas malin) tient la première minute, monte de niveau et vainc des créatures ;
   // le contact fait mal ; 0 PV finit la partie ; l'aube la gagne ; un niveau propose trois choix
  const bad = [], keep = vl, keepS = JSON.stringify(vls), keepB = [games.best.veillee, games.best['veillee-kills']];
  vlMute = true; vls.hero = 'veilleur'; vls.map = 'pre';
  for (let run = 0; run < 2; run++) {
    vl = null; vlNew(); vl.rnd = seeded(run + 7); vl.mode = 'play';
    for (let t = 0; t < 3600 && vl.mode !== 'over'; t++) { vlBot(); vlUpdate(); }
    if (vl.mode === 'over' || vl.lv < 3 || vl.kills < 40) bad.push('joueur auto : ' + Math.floor(vl.t / 60) + ' s, niveau ' + vl.lv + ', ' + vl.kills + ' vaincues');
  }
  vl = null; vlNew(); vl.mode = 'play'; vl.up = {}; vl.foes.push({type: 'golem', x: 2, y: 0, hp: 999, max: 999, kx: 0, ky: 0, hit: 0, f: 0}); vl.spawn = -1e9; vlUpdate();
  if (vl.hp !== 85 || !vl.inv) bad.push('contact sans dégâts (' + vl.hp + ')');
  vl.hp = 3; vl.inv = 0; vlUpdate(); if (vl.mode !== 'over' || vl.won) bad.push('0 PV sans fin');
  vl = null; vlNew(); vl.mode = 'play'; vl.t = VL.DUR - 1; vl.spawn = -1e9; vl.bossN = 9; vlUpdate(); if (!vl.won) bad.push('pas d’aube');
  vl = null; vlNew(); vl.mode = 'play'; vl.xp = 99; vl.spawn = -1e9; vlUpdate(); if (!vl.picks || vl.picks.length !== 3) bad.push('pas de choix au niveau'); else { vlTake(vl.picks[0]); if (vl.picks || vl.mode !== 'play') bad.push('choix pas pris'); }
  // les évolutions : proposée en premier quand elle est prête, prise une seule fois, et elle change vraiment l'arme
  vl = null; vlNew(); vl.mode = 'play'; vl.up = {flash: 5, huile: 1}; if (vlOptions()[0] !== 'phare') bad.push('évolution pas proposée : ' + vlOptions());
  vlTake('phare'); if (vl.evo.flash !== 'phare' || vlOptions().includes('phare')) bad.push('évolution pas prise');
  vl = null; vlNew(); vl.mode = 'play'; vl.up = {dague: 4, bottes: 1}; if (vlOptions().some(k => VL_EVO[k])) bad.push('évolution avant le niveau 5');
  vl.up.dague = 5; vlTake('lames'); vl.spawn = -1e9; vl.cds.dague = 99; vlUpdate(); if (vl.shots.length !== 12) bad.push('Mille lames : ' + vl.shots.length + ' dagues');
  vl = null; vlNew(); vl.mode = 'play'; vl.up = {luciole: 5, aimant: 1}; vlTake('essaim'); if (vlFlyN() !== 9) bad.push('Essaim : ' + vlFlyN());
  games.best.veillee = 999; vls.wins = 1;  // tous débloqués : chacun commence avec son arme, et seulement elle
  for (const [k, o] of Object.entries(VL_CHARS)) { vls.hero = k; vl = null; vlNew(); if (vl.hero !== k || Object.keys(vl.up).join() !== o.arme) bad.push('arme de départ ' + k); }
  games.best.veillee = 100; vls.wins = 0; vls.hero = 'sorcier'; vl = null; vlNew(); if (vl.hero !== 'veilleur' || vlOpen('chasseuse')) bad.push('personnage verrouillé pris');
  console.assert(!bad.length, 'veillee', bad);
  Object.assign(vls, JSON.parse(keepS)); for (const [k, v] of [['veillee', keepB[0]], ['veillee-kills', keepB[1]]]) { if (v === undefined) delete games.best[k]; else games.best[k] = v; }
  vl = keep; vlMute = false;
}
$('vlFs').onclick = () => { $('vlFs').blur(); try { document.fullscreenElement ? document.exitFullscreen() : $('vlCanvas').parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
// les trophées, tirés des statistiques et des records gardés (aussi à l'ouverture : ce qui a été fait avant compte)
function vlTrophies() {
  const t = games.best.veillee || 0, k = games.best['veillee-kills'] || 0, sig = [t, k, vls.wins, vls.kills].join(); if (sig === vlTrophies.sig) return; vlTrophies.sig = sig;
  trophyRecord('temps', t || null); trophyRecord('monstres', k || null);
  if (t >= 180) trophy('min3'); if (t >= 360) trophy('min6'); if (vls.wins >= 1) trophy('aube'); if (vls.wins >= 5) trophy('aube5');
  if (k >= 500) trophy('k500'); if (vls.kills >= 5000) trophy('k5000'); if (Object.keys(VL_CHARS).every(vlOpen)) trophy('heros');
}
ctx.onOpen(() => {
  if (!vl || !vl.g) { vlNew(); vl.g = $('vlCanvas').getContext('2d'); }
  gameLoop(vl, 'veillee', vlUpdate, vlDraw); vlInfo();
});
}
