# Wardley Sketch

A minimalist, mobile-first Wardley Mapping sketch tool. Think digital napkin:
place components fast on a phone, then export OnlineWardleyMaps DSL and finish
the map in a fuller editor.

Installs as a PWA, works offline, and stores maps locally in the browser.

## Using it

- **Hold** the canvas to place a component or note
- **Drag** to reposition, **pinch** to zoom, drag empty space to pan when zoomed
- Tap a component to open its detail panel — type, inertia, evolve target
- **Import** reads OnlineWardleyMaps DSL; **Export** copies it or saves a `.owm` file

Anything the sketch tool doesn't draw — pipelines, annotations, `style`, `size` —
is carried through untouched, so importing and re-exporting never loses work.

## Deploying to GitHub Pages

1. Create a new repository on GitHub (public).
2. Upload every file in this folder to the repository root.
3. Go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**, pick `main` and `/ (root)`.
5. Save. After a minute the site is live at
   `https://<your-username>.github.io/<repo-name>/`

Open that URL on your phone and use **Share → Add to Home Screen** to install it.

## Updating

After editing any file, bump the cache version in `sw.js`:

```js
const CACHE = 'wardley-sketch-v2';   // was v1
```

Without that bump, returning visitors keep serving the old cached copy for one
extra load. Changing it forces the service worker to fetch everything fresh.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app — markup, styles, and logic in one file |
| `manifest.json` | PWA metadata: name, icons, standalone display |
| `sw.js` | Service worker for offline support |
| `icon-192.png`, `icon-512.png` | App icons |
| `icon-512-maskable.png` | Android adaptive icon (padded safe zone) |
| `apple-touch-icon.png` | iOS home screen icon |

## Notes

- Maps are saved to `localStorage`, so they're per-browser and per-device. Export
  a `.owm` file to move a map elsewhere or to keep a backup.
- Service workers require HTTPS, so offline support only kicks in once hosted —
  opening `index.html` directly from disk still works, just without caching.
