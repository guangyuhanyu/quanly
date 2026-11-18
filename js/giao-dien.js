/* =========================================================
   Giao diện: chủ đề màu, ảnh nền, menu tự ẩn (lưu riêng trên từng máy)
   ========================================================= */
const CHU_DE = [
  { id: 'son-thuy', ten: 'Sơn thuỷ', nhan: '#7C2C20', phu: '#FFF6E0', phuDo: 0, tron: 'color', menu: 'sang' },
  { id: 'truc-xanh', ten: 'Trúc xanh', nhan: '#3F6B4F', phu: '#7DBE95', phuDo: .35, tron: 'color', menu: 'sang' },
  { id: 'hoa-dao', ten: 'Hoa đào', nhan: '#A3445C', phu: '#F2A7BC', phuDo: .4, tron: 'color', menu: 'sang' },
  { id: 'hoang-hon', ten: 'Hoàng hôn', nhan: '#9A5B1F', phu: '#F1B865', phuDo: .4, tron: 'color', menu: 'sang' },
  { id: 'lam-ngoc', ten: 'Lam ngọc', nhan: '#2F5D86', phu: '#86BDE3', phuDo: .38, tron: 'color', menu: 'sang' },
  { id: 'tu-dang', ten: 'Tử đằng', nhan: '#6A4C93', phu: '#C3A6E6', phuDo: .38, tron: 'color', menu: 'sang' },
  { id: 'xam-xanh', ten: 'Xám xanh', nhan: '#7C2C20', phu: '#56707A', phuDo: .22, tron: 'multiply', menu: 'toi' },
  { id: 'dem-trang', ten: 'Đêm trăng', nhan: '#B07F2A', phu: '#26344F', phuDo: .55, tron: 'multiply', menu: 'toi' },
];
const MAU_NHAN = ['#7C2C20', '#A3445C', '#C0582E', '#9A5B1F', '#B08A3E', '#3F6B4F', '#2F7A73', '#2F5D86', '#6A4C93', '#2F3F46'];
const GD_MAC_DINH = { chuDe: 'son-thuy', nhan: '#7C2C20', phu: '#FFF6E0', phuDo: 0, tron: 'color', kinh: .8, menu: 'sang', anMenu: true, anh: null };
let GD = { ...GD_MAC_DINH };
try { Object.assign(GD, JSON.parse(localStorage.getItem('gyq_giao_dien') || '{}')); } catch (e) { }

function luuGD() { try { localStorage.setItem('gyq_giao_dien', JSON.stringify(GD)); } catch (e) { toast('Ảnh nền quá lớn, Thầy chọn ảnh nhỏ hơn giúp em', 'loi'); } }
function apDungGiaoDien() {
  const r = document.documentElement.style;
  r.setProperty('--nhan', GD.nhan);
  r.setProperty('--phu-mau', GD.phu);
  r.setProperty('--phu-do', GD.phuDo);
  r.setProperty('--phu-tron', GD.tron || 'color');
  r.setProperty('--kinh-a', GD.kinh);
  r.setProperty('--nen-anh', GD.anh ? `url("${GD.anh}")` : 'url("assets/nen-son-thuy.svg")');
  const b = document.body;
  b.classList.toggle('menu-toi', GD.menu === 'toi');
  b.classList.toggle('an-menu', !!GD.anMenu && window.innerWidth > 760);
  const meta = document.querySelector('meta[name=theme-color]'); if (meta) meta.content = GD.menu === 'toi' ? '#2F3F46' : '#F3EDE0';
}
apDungGiaoDien();
window.addEventListener('resize', () => apDungGiaoDien());

/* ---------- menu tự ẩn ---------- */
(function () {
  let hen = null;
  const mo = () => { clearTimeout(hen); document.body.classList.add('menu-mo'); };
  const dong = (cham = 350) => { clearTimeout(hen); hen = setTimeout(() => document.body.classList.remove('menu-mo'), cham); };
  document.addEventListener('DOMContentLoaded', () => {
    const vung = document.getElementById('vung-menu'), ben = document.querySelector('.thanh-ben'), tay = document.getElementById('tay-menu');
    vung.addEventListener('mouseenter', mo);
    tay.addEventListener('mouseenter', mo);
    vung.addEventListener('mouseleave', e => { if (e.clientX > 14) dong(); });
    document.addEventListener('mousemove', e => { if (document.body.classList.contains('an-menu') && document.body.classList.contains('menu-mo') && e.clientX > 280) dong(250); });
    tay.addEventListener('click', () => document.body.classList.contains('menu-mo') ? dong(0) : mo());
    ben.addEventListener('mouseenter', () => { if (document.body.classList.contains('an-menu')) mo(); });
    ben.addEventListener('mouseleave', () => { if (document.body.classList.contains('an-menu')) dong(); });
    ben.addEventListener('click', e => { if (e.target.closest('.menu a') && (document.body.classList.contains('an-menu') || window.innerWidth <= 760)) dong(150); });
    document.getElementById('man-che').addEventListener('click', () => dong(0));
  });
  window.moMenu = mo; window.dongMenu = dong;
})();

/* ---------- hộp chỉnh giao diện ---------- */
function nenThu(cd) {
  return `background:linear-gradient(0deg, ${cd.phu}${Math.round(cd.phuDo * 255).toString(16).padStart(2, '0')}, ${cd.phu}${Math.round(cd.phuDo * 255).toString(16).padStart(2, '0')}), url(assets/nen-son-thuy.svg) center/cover`;
}
function moGiaoDien() {
  const { nen } = moHop({
    tieuDe: `${ICON['giao-dien']} Giao diện của Thầy`, rong: true,
    noiDung: `<div class="gd">
      <p class="mo nho">Chỉnh tới đâu thấy ngay tới đó. Mỗi máy (MacBook, điện thoại) nhớ giao diện riêng.</p>
      <h4>Chủ đề</h4>
      <div class="gd-chu-de">${CHU_DE.map(cd => `<button class="gd-the ${GD.chuDe === cd.id ? 'on' : ''}" data-cd="${cd.id}">
        <span class="gd-xem" style="${nenThu(cd)}"><i style="background:${cd.menu === 'toi' ? '#2F3F46' : 'rgba(255,252,244,.85)'}"></i><b style="background:${cd.nhan}"></b></span>${cd.ten}</button>`).join('')}</div>
      <div class="gd-luoi">
        <div><h4>Màu nhấn <small class="mo">(nút, tiêu đề, số liệu)</small></h4>
          <div class="gd-mau">${MAU_NHAN.map(m => `<button data-nhan="${m}" style="--m:${m}" class="${GD.nhan === m ? 'on' : ''}"></button>`).join('')}<label class="gd-tu-chon" title="Tự chọn màu"><input type="color" data-gd="nhan" value="${GD.nhan}"><span>+</span></label></div></div>
        <div><h4>Màu phủ lên nền</h4>
          <div class="gd-dong"><input type="color" data-gd="phu" value="${GD.phu}"><input type="range" min="0" max="0.8" step="0.02" data-gd="phuDo" value="${GD.phuDo}"><span class="mo nho">đậm nhạt</span></div></div>
        <div><h4>Độ trong của khung</h4>
          <div class="gd-dong"><span class="mo nho">trong</span><input type="range" min="0.5" max="0.97" step="0.01" data-gd="kinh" value="${GD.kinh}"><span class="mo nho">đặc</span></div></div>
        <div><h4>Ảnh nền</h4>
          <div class="gd-dong"><label class="nut nho">${ICON['tai-anh']} Chọn ảnh của Thầy<input type="file" accept="image/*" hidden data-gd-anh></label>
          ${GD.anh ? '<button class="nut nho" data-gd-bo-anh>Về tranh sơn thuỷ</button>' : '<span class="mo nho">Đang dùng tranh sơn thuỷ</span>'}</div></div>
        <div><h4>Thanh menu</h4>
          <div class="phan-doan"><button data-menu="sang" class="${GD.menu === 'sang' ? 'on' : ''}">Sáng</button><button data-menu="toi" class="${GD.menu === 'toi' ? 'on' : ''}">Tối</button></div>
          <label class="hop-chon-dong gd-an"><input type="checkbox" data-gd-an ${GD.anMenu ? 'checked' : ''}> Tự ẩn, chỉ hiện khi rê chuột sát mép trái</label></div>
      </div>
    </div>`,
    nut: [{ chu: 'Về mặc định', trai: true, bam: () => { GD = { ...GD_MAC_DINH }; luuGD(); apDungGiaoDien(); moGiaoDien(); } }, { chu: 'Xong', kieu: 'chinh', bam: () => { } }],
    khiMo: n => {
      const capNhat = () => { luuGD(); apDungGiaoDien(); };
      n.addEventListener('click', e => {
        const cd = e.target.closest('[data-cd]'); if (cd) { const c = CHU_DE.find(x => x.id === cd.dataset.cd); Object.assign(GD, { chuDe: c.id, nhan: c.nhan, phu: c.phu, phuDo: c.phuDo, tron: c.tron, menu: c.menu }); capNhat(); $$('[data-cd]', n).forEach(x => x.classList.toggle('on', x === cd)); $('[data-gd=phu]', n).value = c.phu; $('[data-gd=phuDo]', n).value = c.phuDo; $$('[data-menu]', n).forEach(x => x.classList.toggle('on', x.dataset.menu === c.menu)); $$('[data-nhan]', n).forEach(x => x.classList.toggle('on', x.dataset.nhan === c.nhan)); return; }
        const mn = e.target.closest('[data-nhan]'); if (mn) { GD.nhan = mn.dataset.nhan; capNhat(); $$('[data-nhan]', n).forEach(x => x.classList.toggle('on', x === mn)); return; }
        const me = e.target.closest('[data-menu]'); if (me) { GD.menu = me.dataset.menu; capNhat(); $$('[data-menu]', n).forEach(x => x.classList.toggle('on', x === me)); return; }
        if (e.target.closest('[data-gd-bo-anh]')) { GD.anh = null; capNhat(); n.querySelector('[data-dong]').click(); moGiaoDien(); }
      });
      $$('[data-gd]', n).forEach(inp => inp.addEventListener('input', () => { const k = inp.dataset.gd; GD[k] = inp.type === 'range' ? Number(inp.value) : inp.value; if (k === 'phu' && !GD.phuDo) { GD.phuDo = .3; $('[data-gd=phuDo]', n).value = .3; } if (k === 'phu') GD.tron = 'color'; capNhat(); }));
      $('[data-gd-an]', n).addEventListener('change', e => { GD.anMenu = e.target.checked; capNhat(); });
      $('[data-gd-anh]', n).addEventListener('change', async e => {
        const f = e.target.files[0]; if (!f) return;
        try { GD.anh = await nenAnh(f); GD.phuDo = Math.min(GD.phuDo, .15); capNhat(); toast('Đã đổi ảnh nền ✓'); n.querySelector('[data-dong]').click(); moGiaoDien(); } catch (er) { baoLoi(er); }
      });
    },
  });
  nen.querySelector('.hop').classList.add('hop-gd');
}
/* thu nhỏ ảnh để lưu gọn trong trình duyệt */
function nenAnh(file) {
  return new Promise((res, rej) => {
    const img = new Image(); img.onload = () => {
      const k = Math.min(1, 1920 / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src); res(c.toDataURL('image/jpeg', .82));
    };
    img.onerror = () => rej(new Error('Không đọc được ảnh'));
    img.src = URL.createObjectURL(file);
  });
}
