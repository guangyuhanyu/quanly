-- Bản 6.8 · Tính thời lượng theo giờ
-- Cho phép "số buổi chuyển sang / chuyển đi" có số lẻ (VD: còn 1 tiếng 30 phút của khoá 60 phút = 1,5 buổi).
-- Chạy 1 lần trong Supabase → SQL Editor. Không xoá dữ liệu.
alter table khoa_hoc alter column buoi_chuyen_sang type numeric(8,2) using buoi_chuyen_sang::numeric;
alter table khoa_hoc alter column buoi_chuyen_di  type numeric(8,2) using buoi_chuyen_di::numeric;
notify pgrst, 'reload schema';
