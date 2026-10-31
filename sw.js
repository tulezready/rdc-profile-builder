/* Offline cache for RDC Profile Builder. Bump VERSION on every release. */
const VERSION = "rdc-pb-v3";
const CORE = ["./", "index.html", "manifest.webmanifest", "lib/docx.iife.js", "lib/jspdf.umd.min.js", "lib/pdf.min.js", "lib/pdf.worker.min.js", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });

// The page itself: try the network first (so updates show straight away), fall back to the saved copy offline.
function pageFirst(req) {
  return caches.open(VERSION).then(c =>
    Promise.race([
      fetch(req, { cache: "no-store" }).then(res => { if (res.ok) c.put("index.html", res.clone()); return res; }),
      new Promise((_, rej) => setTimeout(() => rej(new Error("slow")), 5000))
    ]).catch(() => c.match("index.html").then(r => r || fetch(req)))
  );
}
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    if (e.request.mode === "navigate" || url.pathname.endsWith("/index.html")) { e.respondWith(pageFirst(e.request)); return; }
    // libraries and icons: saved copy first, then network
    e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
  } else if (url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) {
    e.respondWith(caches.open(VERSION).then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }))));
  }
});
