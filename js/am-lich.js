/* ÂM LỊCH VIỆT NAM — thuật toán của Hồ Ngọc Đức, múi giờ +7 (bản 5.8) */
const AL = (() => {
  const TZ = 7, PI = Math.PI, dr = PI / 180, fl = Math.floor;
  function jd(dd, mm, yy) {
    const a = fl((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
    let j = dd + fl((153 * m + 2) / 5) + 365 * y + fl(y / 4) - fl(y / 100) + fl(y / 400) - 32045;
    if (j < 2299161) j = dd + fl((153 * m + 2) / 5) + 365 * y + fl(y / 4) - 32083;
    return j;
  }
  function soc(k) {
    const T = k / 1236.85, T2 = T * T, T3 = T2 * T;
    let j1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    j1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 -= 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 += 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 -= 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 -= 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 += 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    const dt = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
    return j1 + C1 - dt;
  }
  const ngaySoc = k => fl(soc(k) + 0.5 + TZ / 24);
  function kinhDoMT(j) {
    const T = (j - 2451545.0) / 36525, T2 = T * T;
    const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    let L = (L0 + DL) * dr; L -= PI * 2 * fl(L / (PI * 2)); return L;
  }
  const cungMT = j => fl(kinhDoMT(j - 0.5 - TZ / 24) / PI * 6);
  function thang11(yy) {
    const k = fl((jd(31, 12, yy) - 2415021) / 29.530588853);
    let nm = ngaySoc(k); if (cungMT(nm) >= 9) nm = ngaySoc(k - 1); return nm;
  }
  function nhuan(a11) {
    const k = fl((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last, i = 1, arc = cungMT(ngaySoc(k + i));
    do { last = arc; i++; arc = cungMT(ngaySoc(k + i)); } while (arc !== last && i < 14);
    return i - 1;
  }
  function doi(dd, mm, yy) {
    const n = jd(dd, mm, yy), k = fl((n - 2415021.076998695) / 29.530588853);
    let dau = ngaySoc(k + 1); if (dau > n) dau = ngaySoc(k);
    let a11 = thang11(yy), b11 = a11, nam;
    if (a11 >= dau) { nam = yy; a11 = thang11(yy - 1); } else { nam = yy + 1; b11 = thang11(yy + 1); }
    const ngay = n - dau + 1, diff = fl((dau - a11) / 29);
    let thang = diff + 11, nhuanT = false;
    if (b11 - a11 > 365) { const ln = nhuan(a11); if (diff >= ln) { thang = diff + 10; if (diff === ln) nhuanT = true; } }
    if (thang > 12) thang -= 12;
    if (thang >= 11 && diff < 4) nam -= 1;
    return { ngay, thang, nam, nhuan: nhuanT };
  }
  const CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
  const CHI = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
  const canChi = y => `${CAN[y % 10]} ${CHI[y % 12]}`;
  const TEN_THANG = ['', 'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Một', 'Chạp'];
  function cua(ymd) { const [y, m, d] = ymd.split('-').map(Number); return doi(d, m, y); }
  function chu(ymd) { const a = cua(ymd); return `${a.ngay}/${a.thang}${a.nhuan ? ' nhuận' : ''} năm ${canChi(a.nam)}`; }
  /* nhắc mùng 1 / rằm: hôm nay hoặc ngày mai */
  function nhac(ymd) {
    const ten = a => a.ngay === 1 ? `Mùng 1 tháng ${TEN_THANG[a.thang]}` : `Rằm tháng ${TEN_THANG[a.thang]}`;
    const a = cua(ymd); if (a.ngay === 1 || a.ngay === 15) return { hom: 'nay', chu: `Hôm nay là ${ten(a)}` };
    const b = cua(congNgay(ymd, 1)); if (b.ngay === 1 || b.ngay === 15) return { hom: 'mai', chu: `Mai là ${ten(b)}` };
    return null;
  }
  return { cua, chu, nhac, canChi };
})();
