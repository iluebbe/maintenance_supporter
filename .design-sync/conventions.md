# Building with Maintenance Supporter — conventions

## These are WEB COMPONENTS, not React components

Every component is a custom element (Lit). Use its **tag** in JSX — lowercase,
dashed — and set complex values as element **properties via a ref**, never as
JSX props (JSX props on custom elements only become string attributes):

```jsx
import { dsDemoHass, dsProps, DS_DEMO } from "maintenance-supporter-frontend";

<maintenance-supporter-card
  ref={dsProps({ hass: dsDemoHass() })}
  style={{ display: "block", width: 460 }}
/>
```

Tag = the PascalCase export name in kebab-case with a `maintenance-` prefix
(`MaintenanceCompleteDialog` → `<maintenance-complete-dialog>`), except
`MaintenanceSupporterCard` → `<maintenance-supporter-card>`,
`MaintenanceCalendarCard` → `<maintenance-supporter-calendar-card>`, and
`MsTextfield` → `<ms-textfield>`. Each `<Name>.prompt.md` shows the exact tag.
The `<Name>Props` interface lists the element's **properties** (set them via
`dsProps` or direct assignment), not React props.

## Data setup — every component feeds from `hass`

Data-driven components (cards, dialogs, sections) load their content through a
`hass` object. In a design there is no Home Assistant, so ALWAYS pass the
bundled demo backend: `hass: dsDemoHass()` — it answers the read endpoints
from a realistic 3-object household (`DS_DEMO` exposes the raw objects, parts,
users, settings). Custom data: `dsDemoHass({ handlers: { "maintenance_supporter/objects": () => ({ objects: [...] }) } })`.
Without a `hass`, those components render empty — that is the #1 failure mode.

Dialogs open **imperatively** after props land:

```jsx
<maintenance-complete-dialog ref={(el) => { if (!el) return;
  dsProps({ hass: dsDemoHass(), taskName: "Clean air filter",
            checklist: ["Vacuum filter", "Rinse and dry"] })(el);
  el.open();  // task dialog: openCreate("", DS_DEMO.OBJECTS); quick actions: openFor("demo_hvac", "t_filter")
}} />
```

## Styling — CSS custom properties, no utility classes

There is no class vocabulary to reuse. The design language lives in tokens
(defined in `styles.css`): `--primary-color`, `--accent-color`,
`--primary-text-color`, `--secondary-text-color`, `--divider-color`,
`--card-background-color`, `--secondary-background-color`,
`--primary-background-color`, `--error-color`, `--warning-color`,
`--success-color`, `--info-color`, and the status palette
`--maint-ok-color`, `--maint-due-soon-color`, `--maint-overdue-color`,
`--maint-triggered-color`, `--maint-done-color`. Write your own layout glue as
plain CSS/inline styles using `var(--token)` — e.g.
`color: var(--secondary-text-color)`, `background: var(--card-background-color)`.
Font is Roboto with system fallbacks; body text 14px, KPI numerals 24px bold.

The bundle also registers HA-look host elements you may compose directly:
`ha-card` (card chrome, `header` property), `ha-icon` (`icon="mdi:wrench"` —
97 mdi names available, see `DS_MDI_PATHS`), `ha-button` (`appearance="plain"`
for text buttons; set `--mdc-theme-primary: var(--error-color)` for danger),
`ha-dialog` (`open`, `heading`), `ha-switch` (`checked`), `ha-textfield`,
`ms-textfield`.

## Where the truth lives

Read `styles.css` (tokens) before inventing a color; read the component's
`.prompt.md` for its tag, purpose and a working snippet; read `<Name>.d.ts`
for its property contract. Prefer composing the real components over
rebuilding their look — a task list is `<maintenance-supporter-card>`, not a
hand-built table.
