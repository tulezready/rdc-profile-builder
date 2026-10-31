# RDC Profile Builder — deploy bundle (v2)

Offline-first web app. No server code, no database, no running cost.

## How it is hosted
This repo is connected to Cloudflare Pages (no build step, output directory `/`).
Every push to `main` deploys automatically. After the first visit the app works with
no internet, including Word/PDF export and PDF certificates (libraries in `lib/`,
cached by `sw.js`).

## Releasing an update
Change the files, bump `VERSION` in `sw.js` (e.g. `rdc-pb-v5`), commit and push to `main`.
Installed apps pick up the new version the next time they open online.

## Files
- `index.html` — the whole app (wizard, starter text, Word/PDF builders)
- `lib/` — docx 9.5.1, jsPDF 2.5.1 and pdf.js 3.11.174, served locally so export and PDF certificates work offline
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
- PDF certificates — each PDF page is turned into a flat picture on the device before it
  goes into the profile. Scripts, links, forms or attachments inside a PDF never reach the
  exported Word/PDF file, and pdf.js runs with script evaluation switched off. This is a
  countermeasure against malicious documents ("Defending Against Virus Attacks": Easttom Ch. 9; Session 2's
  vulnerability → threat → countermeasure chain). Password-locked and oversized (>15 MB)
  PDFs are refused with a clear message.
