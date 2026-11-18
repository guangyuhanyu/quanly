-- GUANGYU HANYU — CẬP NHẬT BẢN 4: sinh nhật, mục tiêu, điểm yếu của học viên
-- Chỉ cần chạy nếu Thầy đã cài Supabase TRƯỚC bản 4. Chỉ thêm cột, không xoá dữ liệu.

-- ===================== BẢN 4: ghi chú học viên =====================
alter table hoc_vien add column if not exists ngay_sinh date;
alter table hoc_vien add column if not exists muc_tieu text;
alter table hoc_vien add column if not exists diem_yeu text;
