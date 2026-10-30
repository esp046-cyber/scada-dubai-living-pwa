# SCADA Pioneer PWA

Offline-capable field guide with 126 tips, an inspection checklist and a cost calculator for SCADA engineers around Discovery Gardens and JAFZA. No build step.

## Deploy from an iPhone
1. In Safari, sign in at github.com and tap **+ > New repository**. Name it `scada-bedspacer-pwa`, set it **Public**, tap Create.
2. GitHub does not unzip files. Open the ZIP in the **Files** app to unpack it.
3. In the repo tap **Add file > Upload files**, choose the unpacked files and **folders** (Files app picker), then Commit. If folders will not upload, use **Working Copy** (free for public repos): clone, copy the files in, commit and push.
4. Go to **Settings > Pages**, set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`, Save. Wait 1 to 2 minutes.
5. Open `https://esp046-cyber.github.io/scada-dubai-living-pwa/` in Safari, tap **Share > Add to Home Screen**.
6. Replace `esp046-cyber` in `index.html`, `robots.txt` and `sitemap.xml` with your GitHub username (edit via the pencil icon in GitHub).

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

## v4 changes
- Softer header hairline, live-dot status badge, elevated cards, tinted active tab, 62px nav with safe-area padding.
- Button feedback (Copied, Saved), clickable checklist rows with progress meter, preset chips, Saved empty state, padded filter pills.
- Canonical, Open Graph and sitemap URLs point to https://esp046-cyber.github.io/scada-dubai-living-pwa/.
- Cache version bumped to v4. Open the app online twice to receive the update.

## v5 changes
- Frosted-glass header, sticky search and filters, bottom nav and status-bar blur.
- Calc tab: interactive expense bar with legend, tap a segment for AED and share.
- Checklist: All/Pending/Done segmented filter, gradient progress, Share inspection report.
- Metro route helper, emergency number card, filtered-count Reset, floating Top chip.
- Monospace figures (system mono stack; JetBrains Mono is used only if installed on the device).
