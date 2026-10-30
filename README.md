# SCADA Pioneer PWA

Offline-capable field guide with 126 tips, an inspection checklist and a cost calculator for SCADA engineers around Discovery Gardens and JAFZA. No build step.

## Deploy from an iPhone
1. In Safari, sign in at github.com and tap **+ > New repository**. Name it `scada-bedspacer-pwa`, set it **Public**, tap Create.
2. GitHub does not unzip files. Open the ZIP in the **Files** app to unpack it.
3. In the repo tap **Add file > Upload files**, choose the unpacked files and **folders** (Files app picker), then Commit. If folders will not upload, use **Working Copy** (free for public repos): clone, copy the files in, commit and push.
4. Go to **Settings > Pages**, set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`, Save. Wait 1 to 2 minutes.
5. Open `https://YOURUSER.github.io/scada-bedspacer-pwa/` in Safari, tap **Share > Add to Home Screen**.
6. Replace `YOURUSER` in `index.html`, `robots.txt` and `sitemap.xml` with your GitHub username (edit via the pencil icon in GitHub).

## Notes
- Content is general guidance, not legal advice. Verify routes, rates and rules with RTA, DEWA, Dubai Land Department and your employer.
- Local dev (optional): `npm start`, `npm test`.

## v2 additions
- Bottom navigation: Tips, Checklist, Calc, Saved.
- Severity badges, JAFZA gate-pass category, quick links to Dubai Trade, Tasreeh and RTA.
- Haptic tap (`navigator.vibrate`) works on Android only; iOS Safari ignores it.
- Calculator figures are editable estimates, not official prices.

## v3 changes
- iOS safe-area padding on the bottom nav, no rubber-banding, viewport meta updated.
- `api/tips.json` uses stale-while-revalidate; the app refreshes tips from it on load.
- Share handles cancel (AbortError) silently; external links use `noopener noreferrer`.
- Jabal Ali interchange guidance, outward gate pass, partition acoustics, VPN fallback tips.
- Full SVG icon sprite and expanded docs.
- The app shell (HTML, CSS, JS) is cache-first. When you change it, bump `V` in `service-worker.js` so users receive it.
