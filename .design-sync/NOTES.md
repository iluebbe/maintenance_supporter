# design-sync notes — maintenance-supporter-frontend

Repo-specific facts a future sync must know. One bullet per gotcha.

## Source shape / build
- This is a **Lit web-components** library, not React. Source files are `.ts`
  (the converter's `.tsx` scan finds nothing) — the component list is fully
  declared via `componentSrcMap`, and the entry is a **pre-built ESM dist**:
  `node ds-esbuild.mjs` inside `frontend-src/` emits
  `dist-ds/ds-entry.js` (our own esbuild handles the Lit decorators), which is
  passed as `--entry`. Never let the converter synthesize from src.
- `react`/`react-dom`/`@types/react`/`@mdi/js` are devDependencies of
  `frontend-src/` purely for the sync (vendoring + preview compile + icon
  paths); the product bundles never import them.
- `.design-sync/gen-dts-props.mjs` harvests the Lit `@property` public fields
  into `cfg.dtsPropsFor` (the React props extractor sees none of them).
  Re-run after adding/renaming public properties, then rebuild.
- `ds-mdi-map.ts` pins the mdi icon paths for every `mdi:*` name the source
  uses (97 as of 2026-08-24). Regenerate via the snippet in the file header
  after adding icons, or `ha-icon` stubs render a neutral dot.

## Host environment (the fidelity layer)
- Components compose HA host elements (`ha-card`, `ha-icon`, `ha-dialog`,
  `ha-button`, pickers…). `ds-host-stubs.ts` registers first-wins fallbacks —
  inert inside real HA, essential everywhere else. A constructor can be
  `customElements.define`d only ONCE: a second tag needs `class extends X {}`
  (this exact mistake once killed the whole bundle evaluation → every export
  missing, [BUNDLE_EXPORT] 29/29).
- `ds-theme.css` pins HA default-light values for all 28 custom properties the
  library consumes (inventory grep in the file header) — it is `cfg.cssEntry`.
- Roboto is host-provided → `runtimeFontPrefixes: ["Roboto"]`.
- `ds-preview-kit.ts` is the demo backend: `dsDemoHass()` answers the read
  WS endpoints from a 3-object/9-task household; mutations resolve
  `{success:true}`. `dsProps({...})` is the React-ref helper that assigns
  element PROPERTIES (JSX props on custom elements only set attributes).
- Dialog stub is TOP-anchored (not vertically centered) so dialogs taller
  than the viewport clip at the bottom, never lose their heading.

## Known render warns (triaged benign)
- `[RENDER_THIN] mounts have no text and paint nothing` on EVERY authored
  preview of this DS: the measurement walks light DOM, but Lit renders into
  shadow roots — the screenshots prove full renders. Expected on all
  components here; judge by the sheets.

## Re-sync risks
- The demo data in `ds-preview-kit.ts` mirrors backend response shapes by
  hand; a backend field rename won't break the build, only the previews'
  realism — sweep the kit when WS payloads change.
- `ds-theme.css` and `ds-mdi-map.ts` are inventories frozen at sync time;
  new tokens/icons in the source need the regen steps above.
- Previews rely on React 19 vendoring (JSX props → properties for known
  keys); if the vendored React major changes, re-check property assignment.
- Panel (`maintenance-supporter-panel`), card editor, dashboard strategy and
  services are deliberately excluded from the DS (app infrastructure).

## Wave-1 fold (2026-08-24) — capture/harness facts
- **Capture clock is FIXED at 2024-05-15T12:00Z** (page.clock in
  package-capture.mjs). Previews must compute dates relative to `new Date()`
  (see the iso(offsetDays) helper in previews/MaintenanceCalendarCard.tsx);
  never hardcode 2026 epochs for chart x-axes. Kit-fix candidate: make
  DS_DEMO dates relative to now.
- **`.ds-single` carries `transform:translateZ(0)`** — a transformed ancestor
  is the containing block for position:fixed, so SELF-positioned dialogs
  (own backdrop/fixed-center) clip their top half. Preview-level fix used in
  6 dialogs: render `<style>{".ds-single{transform:none !important}"}</style>`
  inside the story (FixedAnchor helper). ha-dialog-based dialogs are immune
  (top-anchored stub). Config-level ask for a future converter version:
  drop the wrapper transform in ?story= mode.
- Story shots are 900x700 non-fullPage unless the component has a config
  `viewport` override; below-the-fold content is fine (absolute rubric),
  scroll the dialog's `.content`/frame in the ref when a lower section IS the
  story.
- Stub fixes applied at fold time (ds-host-stubs.ts): switch `reflect: true`,
  button honors `--mdc-theme-primary` (danger red), picker svg constrained.
- **Kit shape gaps are deliberately NOT fixed in ds-preview-kit** — the
  authored previews carry per-preview `dsDemoHass({handlers})` overrides with
  the REAL backend shapes (battery_fleet/overview + overview_history,
  parts/overview incl. consumers, documents/storage summary shape, tags/list
  {id,name}, objects-with-parts, qr/generate svg_data_uri, discover payloads,
  auth/sign_path→data-URI for images). A future kit sweep should lift those
  shapes INTO the kit and delete the per-preview overrides — until then the
  kit's simple shapes serve the simple consumers (card/statistics/budget).
- Light-DOM views (task-detail-view) need BOTH panel stylesheets inlined in
  the preview frame: sharedStyles (styles.ts) + panelStyles (panel-styles.ts).
- React (vendored 19) sets unknown JSX props as PROPERTIES on custom
  elements; a CSS-relevant ATTRIBUTE (`:host([flat])`) needs
  el.setAttribute in the ref.
- Product-bug candidate found during previews (tracked outside the sync):
  MaintenanceTriggerChart clips a beyond-domain projection to zero length,
  and renderers/sparkline.ts:343 builds exactly that shape — production
  degradation projections likely render invisible.
