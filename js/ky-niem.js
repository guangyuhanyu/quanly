/* KỶ NIỆM — bản đồ những nơi đã đi, ảnh và ghi chú cho từng dịp (bản 5.5)
   cai_dat 'ky_niem' = [{ id, ten, lat, lng, dia_chi, tinh, ngay, ngay_den, dip, ghi_chu, so_anh, sao }]
   Ảnh: cai_dat 'anh:kn_<id>_<i>' (tải khi cần). Bản đồ: Leaflet + nền CARTO Voyager (miễn phí, ghi nguồn).
   Tìm địa điểm: OpenStreetMap Nominatim. Không cần sửa Supabase. */

const KN_DIP = {
  'Du lịch': ['travel', '#7F9BB5'], 'Về quê': ['mood', '#8EA888'], 'Lễ Tết': ['event', '#C9A0A6'], 'Sinh nhật': ['celebrate', '#E7B7C8'],
  'Ăn uống': ['healthy', '#D19A2A'], 'Dạy học / công việc': ['study', '#A98199'], 'Dịp đặc biệt': ['important', '#C7BEE3'], 'Khác': ['memories', '#9AA2AB'],
};
const KN = { loc: 'Tất cả', nam: 'Tất cả', ban_do: null, mo: null };
const dsKN = () => caiDat('ky_niem', []) || [];
async function luuKN(a) { await luuCaiDat('ky_niem', a); }
const knIcon = (dip, co = '') => `<img class="ic ic-anh ${co}" src="assets/icons/${(KN_DIP[dip] || KN_DIP['Khác'])[0]}.webp?v=5.8" alt="">`;
const knAnh = (x, i) => layAnhCache(`anh:kn_${x.id}_${i}`);

/* ----- ảnh: nén + đọc vị trí/ngày chụp từ EXIF (nếu ảnh còn giữ) ----- */
function nenAnhKN(file, canh = 1000, cl = .74) {
  return new Promise((res, rej) => {
    const img = new Image(); img.onload = () => {
      const k = Math.min(1, canh / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      let u = c.toDataURL('image/webp', cl); if (!u.startsWith('data:image/webp')) u = c.toDataURL('image/jpeg', cl + .04); URL.revokeObjectURL(img.src); res(u);
    }; img.onerror = rej; img.src = URL.createObjectURL(file);
  });
}
async function docExif(file) {
  try {
    const b = new DataView(await file.slice(0, 256 * 1024).arrayBuffer());
    if (b.getUint16(0) !== 0xFFD8) return null;
    let o = 2;
    while (o < b.byteLength - 4) {
      const mk = b.getUint16(o), len = b.getUint16(o + 2);
      if (mk === 0xFFE1 && b.getUint32(o + 4) === 0x45786966) {
        const t = o + 10, le = b.getUint16(t) === 0x4949, u16 = p => b.getUint16(p, le), u32 = p => b.getUint32(p, le);
        const doc = (ifd, cb) => { const n = u16(t + ifd); for (let i = 0; i < n; i++) { const e = t + ifd + 2 + i * 12; cb(u16(e), u16(e + 2), u32(e + 4), e + 8); } };
        const huu = p => u32(t + p) / u32(t + p + 4);
        const kq = {}; let gps = 0, exif = 0;
        doc(u32(t + 4), (tag, _, __, v) => { if (tag === 0x8825) gps = u32(v); if (tag === 0x8769) exif = u32(v); });
        if (exif) doc(exif, (tag, typ, cnt, v) => { if (tag === 0x9003) { const p = t + u32(v); let s = ''; for (let i = 0; i < 19; i++) s += String.fromCharCode(b.getUint8(p + i)); kq.ngay = s.slice(0, 10).replace(/:/g, '-'); } });
        if (gps) { const g = {}; doc(gps, (tag, typ, cnt, v) => { if (tag === 1 || tag === 3) g[tag] = String.fromCharCode(b.getUint8(v)); if (tag === 2 || tag === 4) { const p = u32(v); g[tag] = huu(p) + huu(p + 8) / 60 + huu(p + 16) / 3600; } });
          if (g[2] && g[4]) { kq.lat = g[2] * (g[1] === 'S' ? -1 : 1); kq.lng = g[4] * (g[3] === 'W' ? -1 : 1); } }
        return kq;
      }
      o += 2 + len;
    }
  } catch (e) { }
  return null;
}
async function timDiaDiem(q) {
  const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=6&accept-language=vi&countrycodes=&q=${encodeURIComponent(q)}`);
  return (await r.json()).map(x => ({ ten: x.display_name, lat: Number(x.lat), lng: Number(x.lon) }));
}
async function tenTuToaDo(lat, lng) {
  try { const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=vi&zoom=14&lat=${lat}&lon=${lng}`); const j = await r.json(); const a = j.address || {}; return { dia_chi: j.display_name || '', tinh: a.state || a.city || a.province || a.region || a.country || '', nuoc: a.country || '' }; } catch (e) { return { dia_chi: '', tinh: '' }; }
}

/* ----- bản đồ ----- */
const NEN_BAN_DO = () => L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19, subdomains: 'abcd', attribution: '© OpenStreetMap · © CARTO' });
function ghim(x, on) {
  const [, m] = KN_DIP[x.dip] || KN_DIP['Khác'];
  return L.divIcon({ className: '', html: `<span class="kn-ghim ${on ? 'on' : ''}" style="--m:${m}">${knIcon(x.dip)}</span>`, iconSize: [38, 46], iconAnchor: [19, 44], popupAnchor: [0, -40] });
}
function dungBanDo() {
  const o = document.getElementById('kn-ban-do'); if (!o || !window.L) return;
  let giu = null; if (KN.ban_do) { try { giu = { c: KN.ban_do.getCenter(), z: KN.ban_do.getZoom(), mo: KN._mo, loc: KN._loc }; KN.ban_do.remove(); } catch (e) { } KN.ban_do = null; }
  const map = L.map(o, { zoomControl: true, attributionControl: true, scrollWheelZoom: true }).setView([14.5, 107.5], 5);
  NEN_BAN_DO().addTo(map); KN.ban_do = map;
  const ds = locKN(); const nhom = [];
  ds.forEach(x => {
    const mk = L.marker([x.lat, x.lng], { icon: ghim(x, KN.mo === x.id) }).addTo(map);
    const a = x.so_anh ? knAnh(x, 0) : '';
    mk.bindPopup(`<div class="kn-pop">${a ? `<img src="${a}">` : ''}<b>${esc(x.ten)}</b><small>${x.ngay ? ngayVN(x.ngay) : ''}${x.tinh ? ' · ' + esc(x.tinh) : ''}</small><button class="nut nho" data-act="kn-mo" data-id="${x.id}">Xem kỷ niệm</button></div>`);
    nhom.push([x.lat, x.lng]);
  });
  const locNay = KN.loc + '|' + KN.nam;
  if (giu && giu.mo === KN.mo && giu.loc === locNay) map.setView(giu.c, giu.z);
  else if (KN.mo && dsKN().find(k => k.id === KN.mo)) { const x = dsKN().find(k => k.id === KN.mo); map.setView([x.lat, x.lng], 13); }
  else if (nhom.length === 1) map.setView(nhom[0], 11); else if (nhom.length) map.fitBounds(nhom, { padding: [40, 40], maxZoom: 12 });
  KN._mo = KN.mo; KN._loc = locNay;
  setTimeout(() => map.invalidateSize(), 60);
}
function locKN() {
  return dsKN().filter(x => (KN.loc === 'Tất cả' || x.dip === KN.loc) && (KN.nam === 'Tất cả' || (x.ngay || '').startsWith(KN.nam))).sort((a, b) => (b.ngay || '').localeCompare(a.ngay || ''));
}

function vKyNiem() {
  if (!window.L) return oTrong('Chưa tải được bản đồ. Thầy kiểm tra mạng rồi tải lại trang nhé.');
  const tat = dsKN(), ds = locKN();
  const tinh = new Set(tat.map(x => (x.tinh || '').replace(/^(Tỉnh|Thành phố|TP\.?)\s+/i, '').trim()).filter(Boolean));
  const soAnh = tat.reduce((s, x) => s + (x.so_anh || 0), 0);
  const nams = [...new Set(tat.map(x => (x.ngay || '').slice(0, 4)).filter(Boolean))].sort().reverse();
  const theoNam = {}; ds.forEach(x => { const y = (x.ngay || '').slice(0, 4) || 'Chưa rõ năm'; (theoNam[y] = theoNam[y] || []).push(x); });
  setTimeout(dungBanDo, 0);
  return `
  <header class="dau-trang gon"><div><p class="mat-tren">Những nơi Thầy đã đi qua · 足迹</p><h1>${ICON['ky-niem']} Kỷ niệm</h1></div>
    <button class="nut chinh" data-act="kn-moi">${ICON.cong} Thêm kỷ niệm</button></header>
  <div class="st-tk">
    <div><small>Nơi đã đến</small><b>${tat.length}</b><span>địa điểm</span></div>
    <div><small>Tỉnh / thành</small><b>${tinh.size}</b><span>${tinh.size ? [...tinh].slice(0, 3).join(', ') + (tinh.size > 3 ? '…' : '') : ''}</span></div>
    <div><small>Ảnh</small><b>${soAnh}</b><span>tấm</span></div>
    <div><small>Gần nhất</small><b class="kn-gan">${tat.length ? esc(tat.slice().sort((a, b) => (b.ngay || '').localeCompare(a.ngay || ''))[0].ten) : '—'}</b><span>&nbsp;</span></div>
  </div>
  <div class="loc-chip">${['Tất cả', ...Object.keys(KN_DIP)].map(d => `<button class="${KN.loc === d ? 'on' : ''}" data-act="kn-loc" data-v="${d}">${d}</button>`).join('')}
    ${nams.length > 1 ? `<select data-act-change="kn-nam"><option>Tất cả</option>${nams.map(y => `<option ${KN.nam === y ? 'selected' : ''}>${y}</option>`).join('')}</select>` : ''}</div>
  <div class="kn-luoi">
    <div class="kn-ban-do-khung the-giay"><div id="kn-ban-do"></div></div>
    <section class="the-giay kn-ds">
      ${ds.length ? Object.entries(theoNam).map(([y, xs]) => `<h4>${y}</h4>${xs.map(x => `<button class="kn-dong ${KN.mo === x.id ? 'on' : ''}" data-act="kn-mo" data-id="${x.id}">
          ${x.so_anh ? `<img src="${knAnh(x, 0) || ''}" class="kn-nho" alt="">` : `<span class="kn-nho trong" style="--m:${(KN_DIP[x.dip] || KN_DIP['Khác'])[1]}">${knIcon(x.dip)}</span>`}
          <span><b>${esc(x.ten)}</b><small>${x.ngay ? ngayVN(x.ngay) : 'chưa ghi ngày'}${x.ngay_den && x.ngay_den !== x.ngay ? ' – ' + ngayNgan(x.ngay_den) : ''} · ${esc(x.dip || '')}</small>${x.ghi_chu ? `<em>${esc(x.ghi_chu.slice(0, 70))}${x.ghi_chu.length > 70 ? '…' : ''}</em>` : ''}</span>
          ${x.so_anh ? `<i class="kn-so-anh">${x.so_anh} ảnh</i>` : ''}</button>`).join('')}`).join('')
        : oTrong(tat.length ? 'Không có kỷ niệm nào theo bộ lọc này.' : 'Chưa có kỷ niệm nào. Thêm nơi đầu tiên nhé, ví dụ quê nhà Đà Lạt 🌲', `<button class="nut chinh" data-act="kn-moi">${ICON.cong} Thêm kỷ niệm</button>`)}
    </section>
  </div>
  ${KN.mo ? chiTietKN(dsKN().find(x => x.id === KN.mo)) : ''}`;
}
function chiTietKN(x) {
  if (!x) return '';
  const anh = [...Array(x.so_anh || 0)].map((_, i) => knAnh(x, i));
  return `<section class="the-giay kn-chi-tiet" id="kn-chi-tiet">
    <div class="dau-muc"><h2 class="co-icon">${knIcon(x.dip)}${esc(x.ten)}</h2><span class="nhom-nut"><button class="nut nho" data-act="kn-sua" data-id="${x.id}">Sửa</button><button class="nut-x" data-act="kn-mo" data-id="">×</button></span></div>
    <p class="mo">${x.ngay ? ngayVN(x.ngay) : ''}${x.ngay_den && x.ngay_den !== x.ngay ? ' – ' + ngayVN(x.ngay_den) : ''} · ${esc(x.dip || '')}${x.dia_chi ? ` · <small>${esc(x.dia_chi)}</small>` : ''}</p>
    ${x.sao ? `<p class="kn-sao">${'♥'.repeat(x.sao)}<i>${'♥'.repeat(5 - x.sao)}</i></p>` : ''}
    ${x.ghi_chu ? `<p class="kn-ghi">${esc(x.ghi_chu).replace(/\n/g, '<br>')}</p>` : ''}
    ${anh.length ? `<div class="kn-anh-luoi">${anh.map((u, i) => `<button data-act="kn-xem-anh" data-id="${x.id}" data-i="${i}">${u ? `<img src="${u}" alt="" loading="lazy">` : '<span class="kn-dang-tai">…</span>'}</button>`).join('')}</div>` : '<p class="mo nho">Chưa có ảnh. Bấm Sửa để thêm.</p>'}
  </section>`;
}

/* ----- form thêm / sửa ----- */
function moKN(id) {
  const cu = id ? dsKN().find(x => x.id === id) : null;
  const x = cu ? { ...cu } : { dip: 'Du lịch', ngay: homNay(), so_anh: 0, sao: 0 };
  const anhCu = [...Array(x.so_anh || 0)].map((_, i) => knAnh(x, i));
  const ctx = { anh: [...anhCu], doiAnh: false, lat: x.lat, lng: x.lng, exif: null };
  let mapNho = null, mk = null;
  const datViTri = (lat, lng, bay) => {
    ctx.lat = lat; ctx.lng = lng;
    if (mapNho) { if (mk) mk.setLatLng([lat, lng]); else mk = L.marker([lat, lng], { draggable: true }).addTo(mapNho).on('dragend', e => { const p = e.target.getLatLng(); datViTri(p.lat, p.lng); }); if (bay) mapNho.setView([lat, lng], 13); }
    const o = document.querySelector('#kn-vt'); if (o) o.textContent = `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };
  const veAnh = n => { n.querySelector('#kn-anh-xem').innerHTML = ctx.anh.map((u, i) => `<span><img src="${u}"><button type="button" data-xoa-anh="${i}">×</button>${i === 0 ? '<em>ảnh bìa</em>' : `<button type="button" class="kn-bia" data-bia="${i}">★</button>`}</span>`).join(''); };
  moHop({
    tieuDe: id ? 'Sửa kỷ niệm' : 'Thêm kỷ niệm', rong: true,
    noiDung: `<div class="form luoi-form kn-form">
      <label class="ca-dong">Tên kỷ niệm<input name="ten" value="${esc(x.ten || '')}" placeholder="VD: Tết 2027 ở Đà Lạt, Biển Nha Trang cùng gia đình…" required></label>
      <label>Dịp<select name="dip">${Object.keys(KN_DIP).map(d => `<option ${x.dip === d ? 'selected' : ''}>${d}</option>`).join('')}</select></label>
      <label>Mức yêu thích<select name="sao">${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}" ${Number(x.sao) === n ? 'selected' : ''}>${n ? '♥'.repeat(n) : '—'}</option>`).join('')}</select></label>
      <label>Ngày<input type="date" name="ngay" value="${esc(x.ngay || '')}"></label>
      <label>Đến ngày <small class="mo">(nếu đi nhiều ngày)</small><input type="date" name="ngay_den" value="${esc(x.ngay_den || '')}"></label>
      <div class="ca-dong"><span class="nhan">Vị trí</span>
        <div class="kn-tim"><input id="kn-q" placeholder="Gõ tên nơi chốn: Hồ Xuân Hương, Phố cổ Hội An…"><button type="button" class="nut nho" id="kn-tim">Tìm</button><button type="button" class="nut nho" id="kn-gps">📍 Chỗ tôi đang đứng</button></div>
        <div id="kn-kq" class="kn-kq"></div>
        <div id="kn-ban-do-nho"></div><small class="mo" id="kn-vt">${x.lat ? `📍 ${x.lat.toFixed(4)}, ${x.lng.toFixed(4)}` : 'Chạm lên bản đồ để cắm ghim, kéo ghim để chỉnh. Ảnh có vị trí thì web tự cắm ghim.'}</small></div>
      <div class="ca-dong"><span class="nhan">Ảnh <small class="mo">(tối đa 8 tấm, web tự nén cho nhẹ)</small></span>
        <input type="file" accept="image/*" multiple id="kn-file"><div id="kn-anh-xem" class="kn-anh-xem"></div></div>
      <label class="ca-dong">Ghi chú<textarea name="ghi_chu" rows="4" placeholder="Đi với ai, ăn gì ngon, chuyện đáng nhớ…">${esc(x.ghi_chu || '')}</textarea></label>
    </div>`,
    khiMo: n => {
      veAnh(n);
      const o = n.querySelector('#kn-ban-do-nho');
      setTimeout(() => {
        mapNho = L.map(o).setView(x.lat ? [x.lat, x.lng] : [12.2, 108.2], x.lat ? 13 : 6); NEN_BAN_DO().addTo(mapNho);
        if (x.lat) datViTri(x.lat, x.lng);
        mapNho.on('click', e => datViTri(e.latlng.lat, e.latlng.lng)); setTimeout(() => mapNho.invalidateSize(), 80);
      }, 30);
      const tim = async () => { const q = n.querySelector('#kn-q').value.trim(); if (!q) return; const kq = n.querySelector('#kn-kq'); kq.innerHTML = '<small class="mo">Đang tìm…</small>';
        try { const ds = await timDiaDiem(q); kq.innerHTML = ds.length ? ds.map((d, i) => `<button type="button" data-kq="${i}">${esc(d.ten)}</button>`).join('') : '<small class="mo">Không tìm thấy, Thầy thử gõ khác hoặc chạm thẳng lên bản đồ.</small>';
          kq.querySelectorAll('[data-kq]').forEach(b => b.onclick = () => { const d = ds[Number(b.dataset.kq)]; datViTri(d.lat, d.lng, true); kq.innerHTML = ''; const t = n.querySelector('[name=ten]'); if (!t.value) t.value = d.ten.split(',')[0]; }); }
        catch (e) { kq.innerHTML = '<small class="mo">Không kết nối được dịch vụ tìm kiếm. Thầy chạm lên bản đồ để chọn nhé.</small>'; } };
      n.querySelector('#kn-tim').onclick = tim; n.querySelector('#kn-q').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); tim(); } });
      n.querySelector('#kn-gps').onclick = () => { if (!navigator.geolocation) return toast('Máy không hỗ trợ định vị'); navigator.geolocation.getCurrentPosition(p => datViTri(p.coords.latitude, p.coords.longitude, true), () => toast('Thầy cho phép web dùng vị trí trong cài đặt Safari nhé', 'canh'), { enableHighAccuracy: true, timeout: 10000 }); };
      n.querySelector('#kn-file').addEventListener('change', async e => {
        const fs = [...e.target.files].slice(0, 8 - ctx.anh.length); if (!fs.length) return toast('Tối đa 8 ảnh mỗi kỷ niệm');
        for (const f of fs) {
          const ex = await docExif(f);
          if (ex) { if (ex.lat && !ctx.lat) { datViTri(ex.lat, ex.lng, true); toast('Đã lấy vị trí từ ảnh 📍'); } if (ex.ngay && !id && /^\d{4}-\d{2}-\d{2}$/.test(ex.ngay)) n.querySelector('[name=ngay]').value = ex.ngay; }
          ctx.anh.push(await nenAnhKN(f)); ctx.doiAnh = true;
        }
        e.target.value = ''; veAnh(n);
      });
      n.querySelector('#kn-anh-xem').addEventListener('click', e => {
        const xo = e.target.closest('[data-xoa-anh]'), bi = e.target.closest('[data-bia]');
        if (xo) { ctx.anh.splice(Number(xo.dataset.xoaAnh), 1); ctx.doiAnh = true; veAnh(n); }
        if (bi) { const i = Number(bi.dataset.bia); ctx.anh.unshift(...ctx.anh.splice(i, 1)); ctx.doiAnh = true; veAnh(n); }
      });
    },
    nut: [
      ...(id ? [{ chu: 'Xoá', kieu: 'nguy', trai: true, bam: async () => { if (!(await hoi(`Xoá kỷ niệm "${esc(x.ten)}" và ảnh?`, 'Xoá', 'nguy'))) return false; for (let i = 0; i < (x.so_anh || 0); i++) await luuCaiDat(`anh:kn_${id}_${i}`, ''); await luuKN(dsKN().filter(k => k.id !== id)); KN.mo = null; ve(); } }] : []),
      { chu: 'Huỷ', bam: () => { } },
      { chu: 'Lưu', kieu: 'chinh', bam: async n => {
        const f = docForm(n); if (!f.ten) { toast('Thầy đặt tên cho kỷ niệm nhé'); return false; }
        if (ctx.lat == null) { toast('Thầy chọn vị trí trên bản đồ hoặc tìm tên nơi chốn nhé', 'canh'); return false; }
        const moiId = id || 'kn' + Date.now();
        let vt = { dia_chi: x.dia_chi, tinh: x.tinh };
        if (!id || ctx.lat !== x.lat || ctx.lng !== x.lng) vt = await tenTuToaDo(ctx.lat, ctx.lng);
        if (ctx.doiAnh) { for (let i = 0; i < Math.max(ctx.anh.length, x.so_anh || 0); i++) await luuCaiDat(`anh:kn_${moiId}_${i}`, ctx.anh[i] || ''); ctx.anh.forEach((u, i) => ANH[`anh:kn_${moiId}_${i}`] = u); }
        const moi = { ...x, id: moiId, ten: f.ten, dip: f.dip, sao: Number(f.sao) || 0, ngay: f.ngay, ngay_den: f.ngay_den || '', ghi_chu: f.ghi_chu || '', lat: ctx.lat, lng: ctx.lng, dia_chi: vt.dia_chi || '', tinh: vt.tinh || '', so_anh: ctx.anh.length };
        await luuKN([...dsKN().filter(k => k.id !== moiId), moi]); KN.mo = moiId; ve();
        if (!id) setTimeout(() => document.getElementById('kn-chi-tiet')?.scrollIntoView({ behavior: 'smooth' }), 300);
      } }],
  });
}
function xemAnhKN(id, i) {
  const x = dsKN().find(k => k.id === id); if (!x) return; let j = Number(i);
  const { nen, dong } = moHop({ tieuDe: esc(x.ten), rong: true, noiDung: `<div class="kn-xem"><button class="kn-lui">‹</button><img><button class="kn-toi">›</button></div><p class="mo nho giua kn-dem"></p>` });
  const cap = () => { nen.querySelector('.kn-xem img').src = knAnh(x, j); nen.querySelector('.kn-dem').textContent = `${j + 1} / ${x.so_anh}`; };
  nen.querySelector('.kn-lui').onclick = () => { j = (j - 1 + x.so_anh) % x.so_anh; cap(); };
  nen.querySelector('.kn-toi').onclick = () => { j = (j + 1) % x.so_anh; cap(); };
  cap();
}

/* ----- trang Hôm nay: "Ngày này năm xưa" ----- */
function knHomNay() {
  const md = homNay().slice(5), y = homNay().slice(0, 4);
  const ds = dsKN().filter(x => x.ngay && x.ngay.slice(5) === md && x.ngay.slice(0, 4) < y);
  if (!ds.length) return '';
  return `<section class="the-giay kn-nam-xua"><div class="dau-muc"><h2 class="co-icon">${ICON['ky-niem']}Ngày này năm xưa</h2><a href="#/ky-niem">Mở →</a></div>
    ${ds.map(x => `<button class="kn-dong" data-act="kn-mo" data-id="${x.id}" data-di="1">${x.so_anh ? `<img src="${knAnh(x, 0) || ''}" class="kn-nho" alt="">` : `<span class="kn-nho trong" style="--m:${(KN_DIP[x.dip] || KN_DIP['Khác'])[1]}">${knIcon(x.dip)}</span>`}<span><b>${esc(x.ten)}</b><small>${Number(y) - Number(x.ngay.slice(0, 4))} năm trước · ${esc(x.tinh || x.dip)}</small></span></button>`).join('')}
  </section>`;
}

const HD_KN = {
  'kn-moi': () => moKN(null),
  'kn-sua': el => moKN(el.dataset.id),
  'kn-mo': el => { KN.mo = el.dataset.id || null; if (el.dataset.di || !location.hash.startsWith('#/ky-niem')) location.hash = '#/ky-niem'; else ve(); if (KN.mo) setTimeout(() => document.getElementById('kn-chi-tiet')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250); },
  'kn-loc': el => { KN.loc = el.dataset.v; ve(); },
  'kn-xem-anh': el => xemAnhKN(el.dataset.id, el.dataset.i),
};
