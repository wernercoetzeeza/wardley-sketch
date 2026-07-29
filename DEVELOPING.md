# Developing

Notes for maintaining Wardley Sketch or running your own copy.
End users don't need any of this — see [`README.md`](README.md).

## How it's built

No build step, no dependencies, no framework. `index.html` contains the entire
app: markup, styles, and logic. Edit it and reload.

To work on it locally you need a web server, because service workers refuse to
register over `file://`:

```bash
cd path/to/wardley-sketch
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Service workers are permitted on `localhost`,
so offline behaviour works there too.

Opening `index.html` directly from disk still runs the app — you just lose
caching and installability. Registration is guarded on `location.protocol`, so
nothing errors.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app — markup, styles, and logic |
| `manifest.json` | PWA metadata: name, icons, standalone display |
| `sw.js` | Service worker for offline support |
| `icon-192.png`, `icon-512.png` | App icons |
| `icon-512-maskable.png` | Android adaptive icon (padded safe zone) |
| `apple-touch-icon.png` | iOS home screen icon |

## Releasing a change

Bump the version in **two** places. They must match, or the version shown in the
app's info card won't be the version actually running:

```js
// index.html — near the top of the <script>
const APP_VERSION = '1.2.3';             // was 1.2.2

// sw.js — first line
const CACHE = 'wardley-sketch-v1.2.3';   // was v1.2.2
```

Skip the `CACHE` bump and returning visitors keep serving the old cached copy.
This is the single most common way to confuse yourself with service workers.

Then commit and push:

```bash
git add .
git commit -m "Describe what changed"
git push
```

GitHub Pages redeploys automatically. Watch progress under the repo's **Actions**
tab; a green tick means it's live.

## Seeing your changes

The service worker is designed to serve instantly from cache and fetch updates
in the background, so a fresh deploy usually appears on the *second* load.

- **Desktop** — hard refresh with `Cmd/Ctrl + Shift + R`. To bypass caching
  entirely while developing: DevTools → Application → Service Workers →
  *Update on reload*.
- **Installed PWA** — close it from the app switcher and open it twice. If it's
  stubborn, remove the home-screen icon and re-add it.

Confirm which version you're on via the **ⓘ** button in the app header.

## Running your own copy

1. Fork this repository, or create a new public one and upload these files to
   its root.
2. Go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**, then `main` and `/ (root)`.
4. Save. After a minute it's live at
   `https://<your-username>.github.io/<repo-name>/`

All paths are relative, so it works correctly from a `/repo-name/` subpath
without any configuration.

If you publish your own version, please keep the attribution to Simon Wardley
intact — both in the README and in the app's info card.

## Architecture notes

**State** is four arrays plus a title: `nodes`, `links`, `notes`, and
`preserved`. Everything renders from those.

**`preserved`** is the important one. The DSL parser models components, links,
notes and pipelines explicitly; every other OWM statement — annotations,
`style`, `size`, `url` — is captured verbatim into `preserved` and re-emitted on
export. That's what makes round-tripping lossless for constructs the app never
draws.

**Pipelines hang off their component** (`node.pipeline`) rather than living in
`preserved`. That gets rename and delete handling for free: renaming a component
carries its pipeline along, deleting one takes the pipeline with it. A pipeline
naming a component that doesn't exist is the exception — it goes to `preserved`
as `pipelineOrphan` and is re-emitted verbatim, because it was already dangling
in the source file rather than broken by an edit here.

OWM accepts the pipeline's opening brace either on the `pipeline Name {` line or
on the line below it, and both appear in the wild — the parser looks ahead for a
lone `{` so neither form is silently dropped.

Two consequences worth remembering when changing the model:

- Renaming a component must rewrite matching references in `preserved`,
  otherwise export emits a statement pointing at a name that no longer exists.
- Deleting a component must drop `preserved` entries that reference it.

Both are handled in `renameNode()` and `deleteEl()`.

**The on-screen keyboard** is tracked manually. iOS does not shrink the layout
viewport when the keyboard opens — only `visualViewport` reflects it — so a
`position: fixed; bottom: 0` panel would sit underneath the keyboard. The app
measures `window.innerHeight - visualViewport.height - visualViewport.offsetTop`
into a `--kb` custom property; the sheet, modals and toast all offset by it, and
the focused field is scrolled into view once the keyboard animation settles.

**Persistence** is `localStorage`, written debounced on every mutation and
flushed on `pagehide`/`visibilitychange`. Loading is deliberately defensive:
corrupt coordinates, dangling links and stale ID counters are sanitised rather
than allowed to break the app.
