-- GUANGYU HANYU — BẢN 6.6: Gmail học viên + học viên tự điền Gmail trên trang lớp
-- Chạy 1 lần trong Supabase → SQL Editor → New query → dán toàn bộ → Run.
-- (Cần đã chạy file 6-trang-hoc-vien.sql trước.) Chỉ thêm cột / hàm, không xoá dữ liệu.

alter table hoc_vien  add column if not exists email text;
alter table ho_so_gui add column if not exists email text;

-- Hàm gửi hồ sơ có thêm Gmail (bản cũ vẫn giữ để trang cũ không lỗi)
create or replace function gui_ho_so(p_ma text, p_hoc_vien bigint, p_ho_ten text, p_sdt text, p_ngay_sinh date, p_muc_tieu text, p_email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare v_lop bigint;
begin
  select t.lop_id into v_lop from tra_cuu_lop t
   where t.ma = upper(regexp_replace(coalesce(p_ma, ''), '[^A-Za-z0-9]', '', 'g'))
     and coalesce((t.du_lieu->>'bat')::boolean, true);
  if v_lop is null then return false; end if;
  if not exists (select 1 from lop_hoc_vien where lop_id = v_lop and hoc_vien_id = p_hoc_vien) then return false; end if;
  if (select count(*) from ho_so_gui where hoc_vien_id = p_hoc_vien and tao_luc > now() - interval '1 day') >= 5 then return false; end if;
  if p_email is not null and trim(p_email) <> '' and trim(p_email) !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return false; end if;
  insert into ho_so_gui (lop_id, hoc_vien_id, ho_ten, sdt, ngay_sinh, muc_tieu, email)
  values (v_lop, p_hoc_vien, left(nullif(trim(p_ho_ten), ''), 80), left(nullif(trim(p_sdt), ''), 20), p_ngay_sinh,
          left(nullif(trim(p_muc_tieu), ''), 300), lower(left(nullif(trim(p_email), ''), 120)));
  return true;
end;
$$;

revoke all on function gui_ho_so(text, bigint, text, text, date, text, text) from public;
grant execute on function gui_ho_so(text, bigint, text, text, date, text, text) to anon, authenticated;

notify pgrst, 'reload schema';
