"""Chuyển Class.xlsx (sheet theo tháng) -> file sao lưu JSON cho web quản lý.
Chạy: python3 -I chuyen_excel.py Class.xlsx out.json review.json
"""
import sys, re, json, calendar, unicodedata, datetime as dt
import openpyxl

SRC, OUT, REVIEW = sys.argv[1:4]
wb = openpyxl.load_workbook(SRC)
TODAY = dt.date(2026, 11, 18)

def nfc(s): return unicodedata.normalize('NFC', str(s)).strip()

def sheet_ym(name):
    m = re.fullmatch(r'(\d{1,2})-(\d{2})', name.strip())
    if not m: return None
    return 2000 + int(m.group(2)), int(m.group(1))

def add_month(y, m, k=1):
    m += k
    while m > 12: m -= 12; y += 1
    while m < 1: m += 12; y -= 1
    return y, m

def valid(y, m, d): return 1 <= d <= calendar.monthrange(y, m)[1]

def parse_tokens(raw):
    """-> list of (day, note)"""
    if raw is None: return []
    if isinstance(raw, float):  # Excel đổi '23,11' thành 23.11
        a, b = f"{raw:.2f}".split('.')
        raw = f"{int(a)},{int(b)}"
    out = []
    for t in str(raw).split(','):
        t = t.strip()
        if not t: continue
        m = re.fullmatch(r'\((\d+)\+(\d+)\)', t)
        if m: out.append((int(m.group(1)), f'học tách 2 ngày {m.group(1)}+{m.group(2)}')); continue
        m = re.fullmatch(r'(\d+)\((\d+)\)', t)
        if m: out.append((int(m.group(1)), f'Excel ghi "{t}"')); continue
        out.append((int(t), None))
    return out

def place_dates(tokens, start_floor, sheet_y, sheet_m):
    """Gán tháng/năm cho dãy số ngày."""
    dates = []
    prev = None
    for i, (d, note) in enumerate(tokens):
        if prev is None:
            # buổi đầu: ngày sớm nhất >= start_floor có số ngày = d, bắt đầu tìm từ tháng của floor
            y, m = start_floor.year, start_floor.month
            for _ in range(24):
                if valid(y, m, d) and dt.date(y, m, d) >= start_floor: break
                y, m = add_month(y, m)
            cur = dt.date(y, m, d)
        else:
            y, m = prev.year, prev.month
            if d >= prev.day and valid(y, m, d):
                cur = dt.date(y, m, d)
            else:
                y, m = add_month(y, m)
                while not valid(y, m, d): y, m = add_month(y, m)
                cur = dt.date(y, m, d)
        dates.append((cur, note))
        prev = cur
    return dates

def eval_num(v):
    if v is None: return 0
    if isinstance(v, (int, float)): return int(round(v))
    s = str(v).strip().lstrip('=')
    if re.fullmatch(r'[\d.*+\- ]+', s): return int(round(eval(s)))
    raise ValueError(v)

def parse_sessions(formula):
    s = str(formula).replace(' ', '')
    m = re.fullmatch(r"=([\d+]+)-(?:'[^']+'!)?C\d+([+-]\d+)?", s)
    if not m: raise ValueError(formula)
    return eval(m.group(1)), int(m.group(2) or 0)

GROUPS = {
    'HSK1': ('HSK 1', 'HSK 1'), 'HSK2': ('HSK 2', 'HSK 2'), 'HSK3': ('HSK 3', 'HSK 3'),
    'HSK1 3.0 nhóm': ('HSK 1 (HSK 3.0)', 'HSK 1'),
    'GTCB': ('Giao tiếp cơ bản', 'Cơ bản'), 'GTCB(UD)': ('Giao tiếp cơ bản', 'Cơ bản'),
    'GTCB2': ('Giao tiếp cơ bản', 'Cơ bản'), 'GTCB3': ('Giao tiếp cơ bản', 'Cơ bản'),
}
BG_IDS = {'HSK 1': 1, 'HSK 2': 2, 'HSK 3': 3, 'HSK 4': 4, 'HSK 5': 5, 'Cơ bản': 6}
PALETTE = ['#7C2C20', '#56707A', '#A0703A', '#4F6B4A', '#7A4E6E', '#3F6E8C', '#9A5B3C', '#5B6B2E',
           '#8C3B4A', '#2F5D62', '#B08A3E', '#6A5A8C', '#4A7A6A', '#8A6A3A', '#5E4B3C', '#3C5A7A']

rows = []
for ws in wb:
    ym = sheet_ym(ws.title)
    if not ym: continue
    hdr = [nfc(c.value).lower() if c.value else '' for c in ws[1]]
    for r in ws.iter_rows(min_row=2, values_only=True):
        if not r[0]: continue
        rows.append(dict(sheet=ws.title, y=ym[0], m=ym[1], ten=nfc(r[0]), ngay=r[1], d=r[3], hp=r[4],
                         note=nfc(r[5]) if len(r) > 5 and r[5] else ''))
rows.sort(key=lambda x: (x['y'], x['m']))  # giữ thứ tự dòng trong sheet (sort ổn định)

last_end = {}
review = []
lop = {}; hoc_vien = []; lhv = []; khoa = []; buoi = []; tt = []
ids = dict(hv=0, lop=0, khoa=0, buoi=0, tt=0)

for r in rows:
    ten_goc = r['ten']
    note = r['note']
    tokens = parse_tokens(r['ngay'])
    sheet_first = dt.date(r['y'], r['m'], 1)
    floor_min = dt.date(*add_month(r['y'], r['m'], -1), 1)
    if ten_goc in last_end:
        floor = max(last_end[ten_goc] + dt.timedelta(days=1), floor_min)
    elif tokens and not valid(r['y'], r['m'], tokens[0][0]):
        floor = floor_min
    else:
        floor = sheet_first
    dates = place_dates(tokens, floor, r['y'], r['m'])
    if dates: last_end[ten_goc] = dates[-1][0]
    if r['y'] < 2026: continue

    so_buoi, carry = parse_sessions(r['d'])
    hoc_phi = eval_num(r['hp'])

    # tên lớp
    suffix = ''
    m2 = re.match(r'^R\s+([A-ZĐ]{2})$', note)
    if m2: suffix = f' ({m2.group(1)})'
    ten_lop = ten_goc + suffix
    nhom = ten_goc in GROUPS
    if ten_lop not in lop:
        ids['lop'] += 1
        trinh_do, bg = GROUPS.get(ten_goc, (None, None))
        lop[ten_lop] = dict(id=ids['lop'], ten=ten_lop, loai='nhom' if nhom else '1-1',
                            bang_gia_id=BG_IDS.get(bg), trinh_do=trinh_do,
                            mau=PALETTE[(ids['lop'] - 1) % len(PALETTE)], ngon_ngu='vi',
                            dang_hoat_dong=True, ghi_chu=None)
        if not nhom:
            ids['hv'] += 1
            ho_ten = re.sub(r'^(Chị|Anh|Cô|Chú)\s+', '', ten_goc)
            hoc_vien.append(dict(id=ids['hv'], ho_ten=ho_ten, ten_goi=ten_goc, sdt=None, ngon_ngu='vi', ghi_chu=None))
            lhv.append(dict(lop_id=ids['lop'], hoc_vien_id=ids['hv']))
    L = lop[ten_lop]

    # thời lượng
    tl = 90
    if re.search(r'\b1h\b', note): tl = 60
    if 'các buổi khác học 2h' in note: tl = 120
    ghi_chu = []
    rest = re.sub(r'^R\s*(GN|PL)?\s*/?\s*', '', note).strip()
    if rest and rest not in ('1h',): ghi_chu.append('Excel: ' + rest)
    if r['note'] == 'lv up': ghi_chu = []

    ids['khoa'] += 1
    prev = [k for k in khoa if k['lop_id'] == L['id']]
    k = dict(id=ids['khoa'], lop_id=L['id'], giao_trinh=L['trinh_do'], muc_tieu=None,
             ngay_bat_dau=(dates[0][0].isoformat() if dates else None), so_buoi=so_buoi, thoi_luong_phut=tl,
             don_gia_gio=None, hoc_phi=hoc_phi, buoi_chuyen_sang=carry,
             gia_tri_chuyen_sang=int(round(carry * hoc_phi / so_buoi)) if carry else 0,
             buoi_chuyen_di=0, khoa_truoc_id=prev[-1]['id'] if prev else None, ket_thuc=False,
             ghi_chu='; '.join(ghi_chu) or None, _sheet=r['sheet'])
    khoa.append(k)
    for i, (d, n) in enumerate(dates):
        ids['buoi'] += 1
        b = dict(id=ids['buoi'], lop_id=L['id'], khoa_id=k['id'], ngay=d.isoformat(), gio_bat_dau=None,
                 thoi_luong_phut=tl, trang_thai='da_day', tinh_phi=True, noi_dung=None, ghi_chu=n)
        if ten_goc == 'Chị Camille' and r['sheet'] == '4-26' and i == 0:
            b['thoi_luong_phut'] = 30; b['ghi_chu'] = 'Buổi 30 phút (theo ghi chú Excel)'
        buoi.append(b)
    if note.startswith('R'):
        ids['tt'] += 1
        ngay_tt = dates[0][0] if dates else sheet_first
        tt.append(dict(id=ids['tt'], khoa_id=k['id'], lop_id=L['id'], ngay=ngay_tt.isoformat(), so_tien=hoc_phi,
                       hinh_thuc='Chuyển khoản', ghi_chu='Chuyển từ Excel (ngày thu lấy theo buổi đầu khoá)'))

    # cảnh báo
    warn = []
    if dates:
        span = (dates[-1][0] - dates[0][0]).days
        if span > max(45, len(dates) * 6.5): warn.append(f'{len(dates)} buổi trải dài {span} ngày')
        if dates[-1][0] > TODAY: warn.append('có ngày sau hôm nay')
        if dates[0][0] < sheet_first - dt.timedelta(days=31): warn.append('bắt đầu sớm hơn tháng của sheet')
        dup = [d.isoformat() for (d, _), (d2, _) in zip(dates, dates[1:]) if d == d2]
        if dup: warn.append('2 buổi cùng ngày ' + ', '.join(dup))
    if any(n for _, n in dates): warn.append('ký hiệu lạ trong ngày học')
    if isinstance(r['ngay'], float): warn.append(f'Excel tự đổi thành số {r["ngay"]}')
    if len(dates) > so_buoi + carry: warn.append(f'đã học {len(dates)} > {so_buoi + carry} buổi')
    if warn:
        review.append(dict(khoa_id=k['id'], sheet=r['sheet'], lop=ten_lop, excel=str(r['ngay']),
                           suy_ra=[d.strftime('%d/%m/%Y') for d, _ in dates], canh_bao=warn))

# trạng thái khoá / lớp
for L in lop.values():
    ks = [k for k in khoa if k['lop_id'] == L['id']]
    for k in ks[:-1]: k['ket_thuc'] = True
    last = ks[-1]
    bs = [b for b in buoi if b['khoa_id'] == last['id']]
    done = len(bs) >= last['so_buoi'] + last['buoi_chuyen_sang']
    last_day = max((b['ngay'] for b in buoi if b['lop_id'] == L['id']), default=None)
    recent = (last_day or '') >= '2026-10-01' or last['_sheet'] in ('10-26', '11-26')
    L['dang_hoat_dong'] = recent
    if done and not recent: last['ket_thuc'] = True

for k in khoa: k.pop('_sheet')

for rv in review:
    k = next(k for k in khoa if k['id'] == rv['khoa_id'])
    k['ghi_chu'] = ('⚠ Cần kiểm tra ngày học: ' + '; '.join(rv['canh_bao']) + (' — ' + k['ghi_chu'] if k['ghi_chu'] else ''))
cong_viec = [dict(id=1, tieu_de=f'Kiểm tra ngày học của {len(review)} khoá chuyển từ Excel (có dấu ⚠)', nhom='Quản lý',
                  han=TODAY.isoformat(), uu_tien=1, lop_id=None, xong=False,
                  ghi_chu='Excel chỉ ghi số ngày, web đã tự suy ra tháng. Mở từng khoá có ⚠ để sửa nếu sai.'),
             dict(id=2, tieu_de='Thêm học viên vào các lớp nhóm (HSK2, HSK3, GTCB, HSK1 3.0 nhóm)', nhom='Quản lý',
                  han=TODAY.isoformat(), uu_tien=2, lop_id=None, xong=False, ghi_chu=None)]
backup = dict(phien_ban=1, ung_dung='guangyu-quanly', xuat_luc=dt.datetime.now().isoformat(timespec='seconds'),
              bang_gia=None, hoc_vien=hoc_vien, lop=list(lop.values()), lop_hoc_vien=lhv, khoa_hoc=khoa,
              buoi_hoc=buoi, thanh_toan=tt, cong_viec=cong_viec, cai_dat=[])
json.dump(backup, open(OUT, 'w'), ensure_ascii=False, indent=1)
json.dump(review, open(REVIEW, 'w'), ensure_ascii=False, indent=1)
print({k: len(v) for k, v in backup.items() if isinstance(v, list)}, 'review', len(review))
