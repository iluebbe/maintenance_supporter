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
