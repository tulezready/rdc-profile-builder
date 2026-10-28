# RDC Profile Builder — deploy bundle (v1)

Offline-first web app. No server code, no database, no running cost.

## Put it online (Cloudflare Pages, free)
1. Cloudflare dashboard → Workers & Pages → Create → Pages → **Upload assets**.
2. Name the project (e.g. `rdc-profile-builder`) and upload this whole folder.
3. Share the `*.pages.dev` link. On Android, Chrome offers **Add to Home screen / Install**.

After the first visit the app works with no internet, including Word and PDF export
(the document libraries are in `lib/` and cached by `sw.js`).

## Releasing an update
Change the files, bump `VERSION` in `sw.js` (e.g. `rdc-pb-v2`), upload again.
Users get the new version the next time they open the app online.

## Files
- `index.html` — the whole app (wizard, starter text, Word/PDF builders)
- `lib/` — docx 9.5.1 and jsPDF 2.5.1, served locally so export works offline
- `sw.js` — offline cache
- `manifest.webmanifest`, `icons/` — install to home screen
- `_headers` — security headers for Cloudflare Pages (CSP, no framing, no camera/mic/location)

## Security notes (NDC course tie-in)
- Confidentiality — profiles live only in the device's browser storage (IndexedDB);
  nothing is uploaded, and the app never asks for NID, licence or bank numbers
  (data minimisation). CIA triad: NDC Session 1; Easttom Ch. 1.
- Availability — "Save profile file" is the user's backup and the way to move work
  between devices; "Remove all profiles" clears a shared office PC.
  Disaster recovery / backups: NDC Session 2; Easttom Ch. 14.
- Defense in depth — the `_headers` CSP only lets the page load its own files and
  Google Fonts, and blocks framing. Deny by default, explicitly permit:
  NDC Session 3; Easttom Ch. 3. Layered security: NDC Session 5; Easttom Ch. 1.
