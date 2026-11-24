// lancé par le test « local » de NeoDex : marche en rond au clavier, prend une amélioration quand le menu s'ouvre (comme un lecteur d'écran),
// et vérifie que des créatures sont vaincues et qu'un niveau est passé (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const ev = (type, k) => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('vlCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('vlCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'veillee-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await sleep(500);
  // le plein écran remplit l'écran, puis la place prise dans la fenêtre
  await pj(`document.getElementById('vlFs').click(), 0`); await sleep(700);
  const fsOk = await pj(`(() => { const c = document.getElementById('vlCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fsOk) throw new Error('le plein écran ne remplit pas l’écran');
  const Lw = await pj(`(() => { const r = document.getElementById('vlCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('vlCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (Lw.bottom > Lw.wh + 1 || Lw.sw > Lw.ww + 1 || Lw.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(Lw));
await shot('0-depart');
  // les cartes : chacune se choisit dans la colonne de droite (une image de chacune), puis la partie se joue dans la forêt ; le personnage de départ a sa fiche
  const nm = await pj(`document.querySelectorAll('#vlMaps .btn').length + ',' + document.querySelectorAll('#vlChars .btn').length + ',' + document.querySelectorAll('#vlChars .btn:not(:disabled)').length`);
  if (!/^4,4,[1-4]$/.test(nm)) throw new Error('cartes et personnages attendus : ' + nm);
  for (let i = 3; i >= 0; i--) { await pj(`document.querySelectorAll('#vlMaps .btn')[${i}].click(), 0`); await sleep(300); await shot('carte-' + i); }
  await pj(`document.querySelectorAll('#vlMaps .btn')[2].click(), 0`); await sleep(200);
  if (!(await pj(`document.querySelectorAll('#vlMaps .btn')[2].classList.contains('main')`))) throw new Error('la forêt devait être choisie');
  let held = null, l = '', menu = 0;
  const hold = async k => { if (held === k) return; if (held) await ev('keyup', held); held = k; if (k) await ev('keydown', k); };
  const dirs = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
  for (let i = 0; i < 200; i++) {
    l = await label();
    if (/perdu|aube/.test(l)) break;
    if (/Choix :/.test(l)) { await hold(null); if (!menu++) await shot('1-choix'); await ev('keydown', 'ArrowDown'); await ev('keydown', 'Enter'); await sleep(100); continue; }
    await hold(dirs[Math.floor(i / 12) % 4]);
    if (i === 150) await shot('2-combat');
    await sleep(80);
  }
  await hold(null); await shot('3-fin');
  const m = /niveau (\d+), .* (\d+) créatures vaincues/.exec(l = await label());
  if (!m || +m[1] < 2 || +m[2] < 10) throw new Error('il fallait vaincre des créatures et passer un niveau : « ' + l + ' »');
  // les évolutions (1.2.0) : Mille lames proposée en premier, prise au clavier, une image du choix et une du jeu ; le carnet la marque découverte
  await pj(`document.getElementById('vlNew').click(), 0`); await sleep(200);
  await pj(`(() => { const V = document.getElementById('vlCanvas').__vl, v = V.st(); v.mode = 'play'; v.up = {dague: 5, bottes: 1, luciole: 5, aimant: 2, flash: 3}; v.picks = V.options(); v.sel = 0; v.mode = 'pick'; return 0; })()`); await sleep(300);
  await shot('4-evolution'); if (!(await label()).includes("Choix : [Mille lames]")) throw new Error('Mille lames devait être proposée en premier : ' + await label());
  await ev('keydown', 'Enter'); await sleep(150); await hold('ArrowLeft'); await sleep(2200); await hold(null); await shot('5-mille-lames');
  const ok = await pj(`(() => { const v = document.getElementById('vlCanvas').__vl.st(); return v.evo.dague + '|' + /Mille lames/.test(document.getElementById('vlEvos').textContent); })()`);
  if (ok !== 'lames|true') throw new Error('évolution : ' + ok);
  return l + ' · évolution Mille lames ok';
};
