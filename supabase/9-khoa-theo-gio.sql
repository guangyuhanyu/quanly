-- Bản 6.9 · Khoá học tính theo giờ: cho phép số buổi quy đổi có số lẻ
-- (VD: khoá 12 tiếng, buổi thường học 75 phút = 9,6 buổi quy đổi).
-- Chạy 1 lần trong Supabase → SQL Editor. Không xoá dữ liệu. Chạy lại cũng không sao.
alter table khoa_hoc alter column so_buoi type numeric(8,2) using so_buoi::numeric;
alter table khoa_hoc alter column buoi_chuyen_sang type numeric(8,2) using buoi_chuyen_sang::numeric;
alter table khoa_hoc alter column buoi_chuyen_di  type numeric(8,2) using buoi_chuyen_di::numeric;
notify pgrst, 'reload schema';
