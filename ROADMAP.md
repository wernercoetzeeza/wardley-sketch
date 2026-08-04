# Roadmap

Ideas under consideration for Wardley Sketch, and a couple of things
deliberately left out. Nothing here is a commitment or a timeline — it's a
running note of what's been discussed, so the reasoning isn't lost between
sessions.

## Under consideration

- **Self-hosted fonts.** Space Grotesk and JetBrains Mono currently load from
  Google Fonts. Self-hosting the two `.woff2` files would close the last
  external dependency, remove a render-blocking request on first load, and
  make a genuinely offline cold-start look right instead of falling back to
  system fonts.
- **A layout suited to larger screens.** The app works on iPad and desktop
  Safari today — the fixed-shape coordinate system means shapes stay correct
  at any screen size — but the UI itself is phone-shaped throughout: a
  full-width bottom drawer, fixed-pixel glyph sizes. A side panel above some
  width breakpoint, and glyphs that scale with the board, would suit a tablet
  or desktop window better.
- **Drag-to-reposition for annotation markers.** Annotations can be renamed,
  deleted, and have individual points removed, but a marker's position can
  currently only be set on import — not dragged on the canvas.

## Deliberately not planned

- **On-canvas annotation creation.** A two-step flow for placing a new
  annotation, and a separate mode for adding another point to an existing
  one, was built and shipped, then pulled after hands-on use — it added more
  friction than a construct this infrequently used was worth. Annotations
  still render fully and stay editable; only the *create* path is import-only.
  If this gets revisited, the interaction needs to cost one tap, not two.
- **Pipeline stage creation from scratch on mobile.** Stages can be added,
  renamed, repositioned, and removed once a pipeline exists on a component,
  which covers the realistic mobile use case — tidying up or extending a
  pipeline you imported, not composing one stage-by-stage from an empty
  board.
