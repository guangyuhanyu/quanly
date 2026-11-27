/* FLASHCARD HSK 7–9 — mở file flashcard/hsk79.html của Thầy ngay trong app (không sửa file).
   Tiến độ của file nằm ở localStorage 'gy-fc-hsk79'; app gộp & đồng bộ lên cai_dat 'flashcard_hsk79'
   để Mac và iPhone dùng chung. Ôn hết thẻ hôm nay (màn "Hôm nay xong rồi!") → tự tick bài Flashcard trong lộ trình. */
const FC_KEY = 'gy-fc-hsk79', FC_DB = 'flashcard_hsk79', FC_FILE = 'flashcard/hsk79.html?v=6.6';
const FC = { mo: false, hen: null, guiCuoi: '' };

function fcDocLocal() { try { return JSON.parse(localStorage.getItem(FC_KEY) || 'null'); } catch (e) { return null; } }
function fcGop(loc, may) {           // loc: máy này · may: bản trên mạng
  if (!loc) return may; if (!may) return loc;
  const r = { ...may, ...loc, cards: { ...(may.cards || {}) }, log: { ...(may.log || {}) } };
  for (const [k, y] of Object.entries(loc.cards || {})) {
    const x = r.cards[k];
    r.cards[k] = !x || (y.reps || 0) > (x.reps || 0) || ((y.reps || 0) === (x.reps || 0) && (y.due || 0) >= (x.due || 0)) ? y : x;
  }
  for (const [d, v] of Object.entries(loc.log || {})) r.log[d] = { n: Math.max((r.log[d] || {}).n || 0, (v || {}).n || 0) };
  return r;
}
async function fcDayLen() {
  const s = fcDocLocal(); if (!s) return;
  const chuoi = JSON.stringify(s); if (chuoi === FC.guiCuoi) return;
  FC.guiCuoi = chuoi;
  try { await luuCaiDat(FC_DB, s); } catch (e) { FC.guiCuoi = ''; }
}
function fcXongHomNay() {
  try { const d = document.querySelector('#fc-man iframe').contentDocument; return !!(d && d.querySelector('#stage .done')); } catch (e) { return false; }
}
async function fcTickBai(id, loi) {
  const hn = homNay(); if (!l79BaiNgay(hn).some(h => h.id === id)) return;
  const s = { ...l79Data() }; s.done = { ...s.done }; const k = `${hn}|${id}`;
  if (s.done[k]) return; s.done[k] = 1; await l79Luu(s);
  toast(loi);
}
const fcTickHomNay = () => fcTickBai('fc', 'Flashcard hôm nay xong ✓');
function fcDoiTab(tab) {
  const m = document.getElementById('fc-man'); if (!m) return;
  m.querySelectorAll('.fc-tab button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  m.querySelector('iframe').style.display = tab === 'the' ? '' : 'none';
  const k = m.querySelector('.fc-luyen'); k.style.display = tab === 'the' ? 'none' : '';
  try { speechSynthesis.cancel(); BD.noi = false; } catch (e) { }
  if (tab !== 'the') lfVe(k, tab);
}
async function fcMo(tab) {
  if (FC.mo) return fcDoiTab(tab || 'the'); FC.mo = true;
  const gop = fcGop(fcDocLocal(), caiDat(FC_DB, null));
  if (gop) { localStorage.setItem(FC_KEY, JSON.stringify(gop)); FC.guiCuoi = JSON.stringify(caiDat(FC_DB, null)); }
  const n = document.createElement('div'); n.id = 'fc-man';
  n.innerHTML = `<div class="fc-thanh"><b>HSK 7–9</b><div class="fc-tab"><button data-tab="the" class="on">📇 Thẻ</button><button data-tab="go">⌨️ Gõ</button><button data-tab="doc">📖 Đọc</button><button data-tab="nghe">🎧 Nghe</button></div><button class="nut nho" id="fc-dong">✓ Xong</button></div><iframe src="${FC_FILE}" title="Flashcard HSK 7–9"></iframe><div class="fc-luyen" style="display:none"></div>`;
  document.body.appendChild(n); document.body.classList.add('fc-dang-mo');
  n.querySelector('#fc-dong').onclick = fcDong;
  n.querySelectorAll('.fc-tab button').forEach(b => b.onclick = () => fcDoiTab(b.dataset.tab));
  const kl = n.querySelector('.fc-luyen'); kl.addEventListener('click', e => lfBam(e, kl)); kl.addEventListener('change', e => lfBam(e, kl)); kl.addEventListener('submit', e => lfBam(e, kl));
  if (tab && tab !== 'the') fcDoiTab(tab);
  let daTick = false;
  FC.hen = setInterval(async () => {
    if (!daTick && fcXongHomNay()) { daTick = true; await fcDayLen(); await fcTickHomNay(); }
  }, 2500);
  FC.luu = setInterval(fcDayLen, 30000);
}
async function fcDong() {
  if (!FC.mo) return;
  const xong = fcXongHomNay();
  clearInterval(FC.hen); clearInterval(FC.luu); FC.mo = false;
  try { speechSynthesis.cancel(); if (LF.nghe) LF.nghe.stop(); } catch (e) { }
  document.getElementById('fc-man')?.remove(); document.body.classList.remove('fc-dang-mo');
  await fcDayLen(); if (xong) await fcTickHomNay();
  ve();
}
document.addEventListener('keydown', e => { if (FC.mo && e.key === 'Escape') fcDong(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') fcDayLen(); });
window.addEventListener('pagehide', () => { fcDayLen(); });

const HD_FC = { 'fc-mo': el => fcMo(el.dataset.tab) };
