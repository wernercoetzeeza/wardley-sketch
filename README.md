# Wardley Sketch

A minimalist, mobile-first Wardley Mapping sketch tool. Think digital napkin:
place components fast on a phone, then export OnlineWardleyMaps DSL and finish
the map in a fuller editor.

Installs as a PWA, works offline, and stores maps locally in the browser.

Created by **Werner Coetzee** — ExploreNew (Pty) Ltd. Current version: **1.0.0**.

## Credit where it's due

**Wardley Mapping was created by [Simon Wardley](https://blog.gardeviance.org/)**,
who developed the technique in 2005 and has given it freely to the community
under a Creative Commons Share Alike licence. This tool is only a sketchpad for
a method that is entirely his — if you're new to mapping, start with his
writing rather than with this app.

- Simon Wardley's blog, *Bits or pieces?* — <https://blog.gardeviance.org/>
- His book on mapping is serialised there, chapter by chapter

The text format this tool reads and writes is the **OnlineWardleyMaps (OWM)**
DSL, created and maintained by [Damon Skelhorn](https://onlinewardleymaps.com/).
OWM is the de facto standard for maps-as-code, which is why this app targets it.

- OnlineWardleyMaps — <https://onlinewardleymaps.com/>
- DSL reference — <https://docs.onlinewardleymaps.com/docs/dsl-reference/>

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

After editing any file, bump the version in **two** places so returning
visitors get the new build:

```js
// index.html
const APP_VERSION = '1.0.1';          // was 1.0.0

// sw.js
const CACHE = 'wardley-sketch-v1.0.1';   // was v1.0.0
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

## Licence

Copyright &copy; 2026 Werner Coetzee, ExploreNew (Pty) Ltd.

The code in this repository is released under the MIT Licence — see `LICENSE`.

That covers this application only. The Wardley Mapping method itself is Simon
Wardley's work, shared under Creative Commons Share Alike, and is not affected
by the licence on this code.

## Notes

- Maps are saved to `localStorage`, so they're per-browser and per-device. Export
  a `.owm` file to move a map elsewhere or to keep a backup.
- Service workers require HTTPS, so offline support only kicks in once hosted —
  opening `index.html` directly from disk still works, just without caching.
