// lancé par le test « local » de NeoDex : marche en rond au clavier, prend une amélioration quand le menu s'ouvre (comme un lecteur d'écran),
// et vérifie que des créatures sont vaincues et qu'un niveau est passé (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const ev = (type, k) => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('vlCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('vlCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'veillee-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await sleep(500); await shot('0-depart');
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
  return l;
};
