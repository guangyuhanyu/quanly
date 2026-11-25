/* Service worker — giúp app mở được khi mạng yếu / mất mạng.
   File của web: lấy bản mới trên mạng trước (để luôn cập nhật), mất mạng thì dùng bản đã lưu.
   Ô bản đồ: lấy bản đã lưu trước cho nhanh. Dữ liệu Supabase: không lưu ở đây. */
const BAN = 'gyq-6.4';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== BAN && k !== 'gyq-ban-do').map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (/basemaps\.cartocdn\.com|tile\.openstreetmap\.org/.test(u.host)) {
    e.respondWith(caches.open('gyq-ban-do').then(c => c.match(r).then(m => m || fetch(r).then(res => { if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; }))));
    return;
  }
  if (u.origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(BAN);
    try {
      const res = await Promise.race([fetch(r), new Promise((_, no) => setTimeout(() => no(new Error('cham')), 6000))]);
      if (res.ok) c.put(r, res.clone()); return res;
    } catch (er) {
      const m = await c.match(r, { ignoreSearch: false }) || await c.match(r, { ignoreSearch: true }) || (r.mode === 'navigate' ? await c.match('./') || await c.match('index.html') : null);
      if (m) return m; throw er;
    }
  })());
});
