/** Maintenance Supporter — custom dashboard strategy.
 *
 * Generates a complete Lovelace dashboard from the integration's WS feed.
 * Honors a ``group_by`` config so YAML users can pick the layout:
 *
 *   strategy:
 *     type: custom:maintenance-supporter
 *     group_by: area      # default — one view per area + Unassigned
 *
 *   strategy:
 *     type: custom:maintenance-supporter
 *     group_by: status    # one view per status (Overdue / Triggered / Due Soon / OK)
 *
 *   strategy:
 *     type: custom:maintenance-supporter
 *     group_by: floor     # one view per floor with area sub-headings (#155 follow-up)
 *
 *   strategy:
 *     type: custom:maintenance-supporter
 *     group_by: due_date  # 5 buckets — Overdue / Today / This Week / This Month / Later
 *
 * Layout pattern follows HA's own ``maintenance-view-strategy``,
 * ``areas-dashboard-strategy`` and ``home-overview-view-strategy``: a leading
 * "Overview" view of actionable tasks, empty groups skipped, and
 * STATE_NOT_RUNNING / recovery_mode handled with the same starting /
 * recovery-mode card placeholders HA core uses.
 *
 * Requires Home Assistant 2026.5+ to appear in the "Add Dashboard" picker
 * (that's when ``window.customStrategies`` got picked up by the frontend).
 * On older HA versions the registration is a silent no-op.
 */

interface MaintenanceObjectResp {
  entry_id: string;
  object: {
    id: string;
    name: string;
    area_id: string | null;
  };
  tasks: Array<{ status?: string; days_until_due?: number | null }>;
}

interface AreaEntry {
  area_id: string;
  name: string;
  icon?: string | null;
  floor_id?: string | null;
}

interface FloorEntry {
  floor_id: string;
  name: string;
  icon?: string | null;
  level?: number | null;
}

interface HassLike {
  language?: string;
  config?: {
    state?: string;
    recovery_mode?: boolean;
  };
  connection: {
    sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T>;
  };
  areas?: Record<string, AreaEntry>;
  floors?: Record<string, FloorEntry>;
}

type GroupBy = "area" | "status" | "floor" | "due_date";

interface MaintenanceDashboardStrategyConfig {
  type: "custom:maintenance-supporter" | "maintenance-supporter";
  group_by?: GroupBy;
}

interface DashboardConfig {
  title?: string;
  views: ViewConfig[];
}

interface ViewConfig {
  title?: string;
  path?: string;
  icon?: string;
  type?: string;
  subview?: boolean;
  cards?: CardConfig[];
  sections?: SectionConfig[];
  // HA 2026.5+ — banner card above the view (mobile + desktop), and a
  // narrow column on the right (large screens only). See
  // home-overview-view-strategy.ts for the canonical usage.
  header?: { layout?: string; card: CardConfig };
  sidebar?: {
    sections: SectionConfig[];
    visibility?: ViewColumnsCondition[];
    content_label?: string;
    sidebar_label?: string;
  };
  max_columns?: number;
}

interface ViewColumnsCondition {
  condition: "view_columns";
  min?: number;
  max?: number;
}

interface SectionConfig {
  type?: string;
  cards: CardConfig[];
}

interface CardConfig {
  type: string;
  [key: string]: unknown;
}

const STRATEGY_TYPE = "maintenance-supporter";
const STRATEGY_TAG = `ll-strategy-dashboard-${STRATEGY_TYPE}`;
const EDITOR_TAG = "hui-maintenance-supporter-strategy-editor";

const STATE_NOT_RUNNING = "NOT_RUNNING";

const STATUS_VIEWS: Array<{
  status: string;
  title: string;
  icon: string;
  path: string;
}> = [
  { status: "overdue", title: "Overdue", icon: "mdi:alert-circle", path: "overdue" },
  { status: "triggered", title: "Triggered", icon: "mdi:flash", path: "triggered" },
  { status: "due_soon", title: "Due Soon", icon: "mdi:clock-alert-outline", path: "due-soon" },
  { status: "ok", title: "OK", icon: "mdi:check-circle-outline", path: "ok" },
];

const DUE_DATE_VIEWS: Array<{
  title: string;
  icon: string;
  path: string;
  filter: { filter_due_min_days?: number; filter_due_max_days?: number };
  // Pre-check predicate so we can skip empty buckets without a card render.
  matches: (days: number) => boolean;
}> = [
  {
    title: "Overdue",
    icon: "mdi:alert-circle",
    path: "overdue",
    filter: { filter_due_max_days: -1 },
    matches: (d) => d <= -1,
  },
  {
    title: "Today",
    icon: "mdi:calendar-today",
    path: "today",
    filter: { filter_due_min_days: 0, filter_due_max_days: 0 },
    matches: (d) => d === 0,
  },
  {
    title: "This Week",
    icon: "mdi:calendar-week",
    path: "this-week",
    filter: { filter_due_min_days: 1, filter_due_max_days: 7 },
    matches: (d) => d >= 1 && d <= 7,
  },
  {
    title: "This Month",
    icon: "mdi:calendar-month",
    path: "this-month",
    filter: { filter_due_min_days: 8, filter_due_max_days: 30 },
    matches: (d) => d >= 8 && d <= 30,
  },
  {
    title: "Later",
    icon: "mdi:calendar-clock",
    path: "later",
    filter: { filter_due_min_days: 31 },
    matches: (d) => d >= 31,
  },
];

function makeCardSection(card: CardConfig): SectionConfig {
  return { type: "grid", cards: [card] };
}

// Replicate HA core's responsive conditions (see panels/lovelace/strategies/
// helpers/view-columns-conditions.ts). They use the "view_columns" condition
// rather than raw media queries so they follow whatever breakpoint the user's
// view actually has.
const LARGE_SCREEN_CONDITION: ViewColumnsCondition = {
  condition: "view_columns",
  min: 2,
};
const SMALL_SCREEN_CONDITION: ViewColumnsCondition = {
  condition: "view_columns",
  max: 1,
};

interface MaintenanceStats {
  overdue: number;
  triggered: number;
  due_soon: number;
  ok: number;
  total: number;
}

function computeStats(objects: MaintenanceObjectResp[]): MaintenanceStats {
  const stats: MaintenanceStats = {
    overdue: 0,
    triggered: 0,
    due_soon: 0,
    ok: 0,
    total: 0,
  };
  for (const obj of objects) {
    for (const task of obj.tasks || []) {
      stats.total++;
      if (task.status === "overdue") stats.overdue++;
      else if (task.status === "triggered") stats.triggered++;
      else if (task.status === "due_soon") stats.due_soon++;
      else if (task.status === "ok") stats.ok++;
    }
  }
  return stats;
}

function kpiMarkdownCard(stats: MaintenanceStats): CardConfig {
  // Compact one-liner. Markdown card ignored when text is empty so an
  // all-zero state still renders cleanly ("everything's fine").
  const parts: string[] = [];
  if (stats.overdue) parts.push(`🔴 **${stats.overdue}** overdue`);
  if (stats.triggered) parts.push(`⚡ **${stats.triggered}** triggered`);
  if (stats.due_soon) parts.push(`🟡 **${stats.due_soon}** due soon`);
  parts.push(`🟢 **${stats.ok}** ok`);
  return {
    type: "markdown",
    text_only: true,
    content: parts.join(" · "),
  };
}

// Onboarding card shown when there are zero maintenance objects. Pattern
// follows HA core's home-overview-view-strategy empty-state branch.
//
// Two buttons:
//   • "Open Maintenance panel" — plain navigate, the dependable path.
//   • "Add object" — fire-dom-event with a custom ll-custom payload that
//     our document-level handler (see registerLlCustomHandler below) catches
//     and turns into a deep-link navigation. This demonstrates the fire-dom
//     pattern HA core uses for in-place actions, without requiring us to
//     rip our object-add dialog out of the panel into a custom element.
function emptyStateView(): ViewConfig {
  return {
    title: "Maintenance",
    type: "panel",
    cards: [
      {
        type: "empty-state",
        icon: "mdi:wrench-clock",
        icon_color: "primary",
        content_only: true,
        title: "No maintenance objects yet",
        content:
          "Open the Maintenance panel to add your first object — pool pump, HVAC filter, vehicle, anything that needs scheduled care.",
        buttons: [
          {
            icon: "mdi:wrench",
            text: "Open Maintenance panel",
            appearance: "filled",
            variant: "brand",
            tap_action: {
              action: "navigate",
              navigation_path: "/maintenance-supporter",
            },
          },
          {
            icon: "mdi:plus",
            text: "Add object",
            appearance: "outlined",
            variant: "brand",
            tap_action: {
              action: "fire-dom-event",
              ll_custom: { type: "maintenance-supporter:add-object" },
            },
          },
        ],
      },
    ],
  };
}

function overviewView(stats: MaintenanceStats): ViewConfig {
  const kpiCard = kpiMarkdownCard(stats);
  return {
    title: "Overview",
    icon: "mdi:wrench-clock",
    path: "overview",
    type: "sections",
    // Header runs above the main content — present on every screen size
    // so the user always sees the headline counts. Layout "responsive"
    // matches HA core's home strategy.
    header: { layout: "responsive", card: kpiCard },
    // Sidebar appears only on screens wide enough for ≥2 columns. Mirrors
    // the same KPI card so power users with a wide dashboard never lose
    // sight of it as they scroll long lists.
    sidebar: {
      sections: [
        {
          type: "grid",
          cards: [
            {
              type: "heading",
              heading: "Status",
              heading_style: "title",
            },
            kpiCard,
          ],
        },
      ],
      visibility: [LARGE_SCREEN_CONDITION],
      content_label: "Tasks",
      sidebar_label: "Status",
    },
    sections: [
      makeCardSection({
        type: "custom:maintenance-supporter-card",
        show_header: false,
        filter_status: ["overdue", "triggered", "due_soon"],
      }),
    ],
  };
}

function viewsByArea(
  objects: MaintenanceObjectResp[],
  areas: Record<string, AreaEntry>,
): ViewConfig[] {
  const byArea = new Map<string | null, MaintenanceObjectResp[]>();
  for (const obj of objects) {
    const aid = obj.object.area_id || null;
    if (!byArea.has(aid)) byArea.set(aid, []);
    byArea.get(aid)!.push(obj);
  }

  const areaIds = Array.from(byArea.keys()).filter(
    (a): a is string => a !== null,
  );
  areaIds.sort((a, b) => {
    const na = areas[a]?.name || a;
    const nb = areas[b]?.name || b;
    return na.localeCompare(nb);
  });

  const views: ViewConfig[] = [];
  for (const areaId of areaIds) {
    const objs = byArea.get(areaId)!;
    if (objs.length === 0) continue;
    const areaInfo = areas[areaId];
    views.push({
      title: areaInfo?.name || areaId,
      icon: areaInfo?.icon || "mdi:floor-plan",
      path: `area-${areaId}`,
      type: "sections",
      sections: [
        makeCardSection({
          type: "custom:maintenance-supporter-card",
          show_header: false,
          filter_objects: objs.map((o) => o.object.name),
        }),
      ],
    });
  }

  const unassigned = byArea.get(null);
  if (unassigned && unassigned.length > 0) {
    views.push({
      title: "Unassigned",
      icon: "mdi:help-circle-outline",
      path: "unassigned",
      type: "sections",
      sections: [
        makeCardSection({
          type: "custom:maintenance-supporter-card",
          show_header: false,
          filter_objects: unassigned.map((o) => o.object.name),
        }),
      ],
    });
  }

  return views;
}

function viewsByStatus(objects: MaintenanceObjectResp[]): ViewConfig[] {
  const present = new Set<string>();
  for (const obj of objects) {
    for (const task of obj.tasks || []) {
      if (task.status) present.add(task.status);
    }
  }

  const views: ViewConfig[] = [];
  for (const v of STATUS_VIEWS) {
    if (!present.has(v.status)) continue;
    views.push({
      title: v.title,
      icon: v.icon,
      path: v.path,
      type: "sections",
      sections: [
        makeCardSection({
          type: "custom:maintenance-supporter-card",
          show_header: false,
          filter_status: [v.status],
        }),
      ],
    });
  }
  return views;
}

function viewsByFloor(
  objects: MaintenanceObjectResp[],
  areas: Record<string, AreaEntry>,
  floors: Record<string, FloorEntry>,
): ViewConfig[] {
  // Build {floor_id → [object…]} via area.floor_id lookup; null bucket for
  // objects whose area has no floor OR whose object has no area at all.
  const byFloor = new Map<string | null, MaintenanceObjectResp[]>();
  for (const obj of objects) {
    const aid = obj.object.area_id;
    const fid = aid ? areas[aid]?.floor_id || null : null;
    if (!byFloor.has(fid)) byFloor.set(fid, []);
    byFloor.get(fid)!.push(obj);
  }

  // Floor sort: by `level` then name (matches HA's own floor sorting).
  const floorIds = Array.from(byFloor.keys()).filter(
    (f): f is string => f !== null,
  );
  floorIds.sort((a, b) => {
    const fa = floors[a];
    const fb = floors[b];
    const la = fa?.level ?? 0;
    const lb = fb?.level ?? 0;
    if (la !== lb) return la - lb;
    return (fa?.name || a).localeCompare(fb?.name || b);
  });

  const views: ViewConfig[] = [];
  for (const floorId of floorIds) {
    const objs = byFloor.get(floorId)!;
    if (objs.length === 0) continue;
    const floor = floors[floorId];
    views.push({
      title: floor?.name || floorId,
      icon: floor?.icon || "mdi:home-floor-1",
      path: `floor-${floorId}`,
      type: "sections",
      sections: [
        makeCardSection({
          type: "custom:maintenance-supporter-card",
          show_header: false,
          filter_objects: objs.map((o) => o.object.name),
        }),
      ],
    });
  }

  const unassigned = byFloor.get(null);
  if (unassigned && unassigned.length > 0) {
    views.push({
      title: "Other",
      icon: "mdi:help-circle-outline",
      path: "other",
      type: "sections",
      sections: [
        makeCardSection({
          type: "custom:maintenance-supporter-card",
          show_header: false,
          filter_objects: unassigned.map((o) => o.object.name),
        }),
      ],
    });
  }

  return views;
}

function viewsByDueDate(objects: MaintenanceObjectResp[]): ViewConfig[] {
  // Bucket-presence pre-check so we don't render an empty "Today" tab.
  const presentBuckets = new Set<number>();
  for (const obj of objects) {
    for (const task of obj.tasks || []) {
      const d = task.days_until_due;
      if (d === null || d === undefined) continue;
      DUE_DATE_VIEWS.forEach((v, i) => {
        if (v.matches(d)) presentBuckets.add(i);
      });
    }
  }

  const views: ViewConfig[] = [];
  DUE_DATE_VIEWS.forEach((v, i) => {
    if (!presentBuckets.has(i)) return;
    views.push({
      title: v.title,
      icon: v.icon,
      path: v.path,
      type: "sections",
      sections: [
        makeCardSection({
          type: "custom:maintenance-supporter-card",
          show_header: false,
          ...v.filter,
        }),
      ],
    });
  });
  return views;
}

class MaintenanceDashboardStrategy extends HTMLElement {
  static getCreateSuggestions(_hass: HassLike) {
    return {
      title: "Maintenance Supporter",
      icon: "mdi:wrench-clock",
    };
  }

  // Lazy-load editor so picker users who never hit "Edit Dashboard" don't
  // pay for the LitElement bundle. HA's areas-dashboard-strategy uses the
  // same pattern.
  static async getConfigElement() {
    // The editor element is registered in the same bundle below — just
    // construct it. The dynamic import would work too, but with esbuild
    // bundling everything into one file there's nothing extra to load.
    return document.createElement(EDITOR_TAG);
  }

  static async generate(
    config: MaintenanceDashboardStrategyConfig | undefined,
    hass: HassLike,
  ): Promise<DashboardConfig> {
    if (hass.config?.state === STATE_NOT_RUNNING) {
      return {
        views: [
          { type: "sections", sections: [{ cards: [{ type: "starting" }] }] },
        ],
      };
    }
    if (hass.config?.recovery_mode) {
      return {
        views: [
          {
            type: "sections",
            sections: [{ cards: [{ type: "recovery-mode" }] }],
          },
        ],
      };
    }

    let response: { objects: MaintenanceObjectResp[] };
    try {
      response = await hass.connection.sendMessagePromise<{
        objects: MaintenanceObjectResp[];
      }>({ type: "maintenance_supporter/objects" });
    } catch {
      return {
        title: "Maintenance",
        views: [
          {
            title: "Maintenance",
            cards: [
              {
                type: "markdown",
                content:
                  "**Maintenance Supporter** is not loaded. Install/enable the integration first.",
              },
            ],
          },
        ],
      };
    }

    const objects = response.objects || [];

    // Onboarding short-circuit. With zero objects the area / status / floor /
    // due_date branches all produce just the Overview view (which shows
    // "no tasks") — that's a useless first impression. Show an actionable
    // empty-state instead so the user knows where to click next.
    if (objects.length === 0) {
      return { title: "Maintenance", views: [emptyStateView()] };
    }

    const stats = computeStats(objects);
    const groupBy: GroupBy = config?.group_by ?? "area";

    // Record-of-builders pattern from HA core's home-overview-view-strategy
    // — each entry is a no-arg lambda producing the per-mode views. Extending
    // with a new group_by mode means adding one entry instead of growing an
    // if/else chain.
    const viewBuilders: Record<GroupBy, () => ViewConfig[]> = {
      area: () => viewsByArea(objects, hass.areas || {}),
      status: () => viewsByStatus(objects),
      floor: () => viewsByFloor(objects, hass.areas || {}, hass.floors || {}),
      due_date: () => viewsByDueDate(objects),
    };

    return {
      title: "Maintenance",
      views: [
        overviewView(stats),
        ...(viewBuilders[groupBy] ?? viewBuilders.area)(),
      ],
    };
  }
}

// ── Editor ──────────────────────────────────────────────────────────────────
//
// Minimal LovelaceStrategyEditor: a single dropdown for ``group_by``. Pattern
// follows HA core's ``hui-areas-dashboard-strategy-editor`` — LitElement that
// exposes setConfig(), holds the current config in @state, and dispatches
// "config-changed" with the new config on user input.
//
// We keep the editor as a plain HTMLElement (no Lit dependency) because the
// strategy file otherwise stays Lit-free. It's enough HTML for one <select>.

const GROUP_BY_OPTIONS: Array<{ value: GroupBy; label: string }> = [
  { value: "area", label: "By area (default)" },
  { value: "status", label: "By status (Overdue / Triggered / Due Soon / OK)" },
  { value: "floor", label: "By floor (uses HA floors)" },
  { value: "due_date", label: "By due date (Overdue / Today / Week / Month / Later)" },
];

class MaintenanceStrategyEditor extends HTMLElement {
  private _config: MaintenanceDashboardStrategyConfig = {
    type: "custom:maintenance-supporter",
  };
  private _hass: HassLike | undefined;

  set hass(hass: HassLike | undefined) {
    this._hass = hass;
  }

  setConfig(config: MaintenanceDashboardStrategyConfig): void {
    this._config = config;
    this._render();
  }

  connectedCallback(): void {
    this._render();
  }

  private _render(): void {
    const current = this._config.group_by ?? "area";
    const options = GROUP_BY_OPTIONS.map(
      (o) =>
        `<option value="${o.value}"${o.value === current ? " selected" : ""}>${o.label}</option>`,
    ).join("");
    this.innerHTML = `
      <style>
        :host, .editor { display: block; padding: 16px 0; }
        label { display: block; font-weight: 500; margin-bottom: 8px; }
        select {
          width: 100%; padding: 8px; font-size: 14px;
          background: var(--card-background-color, white);
          color: var(--primary-text-color, black);
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 4px;
        }
        .help {
          margin-top: 8px; font-size: 12px;
          color: var(--secondary-text-color, #666);
        }
      </style>
      <div class="editor">
        <label for="group-by">Group views by</label>
        <select id="group-by">${options}</select>
        <div class="help">
          The "Overview" view is always first. Empty groups are skipped.
        </div>
      </div>
    `;
    const select = this.querySelector("#group-by") as HTMLSelectElement | null;
    select?.addEventListener("change", () => {
      const newConfig: MaintenanceDashboardStrategyConfig = {
        ...this._config,
        group_by: select.value as GroupBy,
      };
      this._config = newConfig;
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: newConfig },
          bubbles: true,
          composed: true,
        }),
      );
    });
  }
}

// ── Section Strategy ────────────────────────────────────────────────────────
//
// A standalone section users can drop into ANY view (HA's home dashboard, the
// areas dashboard's per-area view, a custom dashboard) to surface a slice of
// maintenance tasks in context. Mirrors HA core's ``common-controls`` section
// strategy pattern. YAML usage:
//
//   sections:
//     - strategy:
//         type: custom:maintenance-supporter-section
//         area_id: kitchen        # optional — restrict to one area
//         filter_status:          # optional — restrict to certain statuses
//           - overdue
//           - triggered
//         title: Kitchen upkeep   # optional heading card
//         max_items: 5            # optional row limit
//
// At least one filter is recommended; with no filters it shows everything,
// which is what the dashboard strategy already does.

const SECTION_STRATEGY_TYPE = "maintenance-supporter-section";
const SECTION_STRATEGY_TAG = `ll-strategy-section-${SECTION_STRATEGY_TYPE}`;

interface MaintenanceSectionStrategyConfig {
  type: "custom:maintenance-supporter-section" | "maintenance-supporter-section";
  area_id?: string;
  filter_status?: string[];
  filter_objects?: string[];
  filter_due_min_days?: number;
  filter_due_max_days?: number;
  title?: string;
  max_items?: number;
}

class MaintenanceSectionStrategy extends HTMLElement {
  static async generate(
    config: MaintenanceSectionStrategyConfig | undefined,
    hass: HassLike,
  ): Promise<SectionConfig> {
    const card: CardConfig = {
      type: "custom:maintenance-supporter-card",
      show_header: false,
    };

    // Pass through optional filters
    if (config?.filter_status?.length) card.filter_status = config.filter_status;
    if (config?.max_items) card.max_items = config.max_items;
    if (config?.filter_due_min_days !== undefined) {
      card.filter_due_min_days = config.filter_due_min_days;
    }
    if (config?.filter_due_max_days !== undefined) {
      card.filter_due_max_days = config.filter_due_max_days;
    }

    // Resolve area_id → object names via WS (the card filters by name).
    // Falls back gracefully if the WS call fails — empty filter means
    // "show everything", which still renders something useful.
    let names: string[] | undefined = config?.filter_objects;
    if (config?.area_id && !names) {
      try {
        const r = await hass.connection.sendMessagePromise<{
          objects: MaintenanceObjectResp[];
        }>({ type: "maintenance_supporter/objects" });
        names = (r.objects || [])
          .filter((o) => o.object.area_id === config.area_id)
          .map((o) => o.object.name);
      } catch {
        // ignore — card will show all
      }
    }
    if (names && names.length > 0) card.filter_objects = names;

    const cards: CardConfig[] = [];
    if (config?.title) {
      cards.push({
        type: "heading",
        heading: config.title,
        heading_style: "title",
      });
    }
    cards.push(card);

    return { type: "grid", cards };
  }
}

if (!customElements.get(STRATEGY_TAG)) {
  customElements.define(STRATEGY_TAG, MaintenanceDashboardStrategy);
}
if (!customElements.get(EDITOR_TAG)) {
  customElements.define(EDITOR_TAG, MaintenanceStrategyEditor);
}
if (!customElements.get(SECTION_STRATEGY_TAG)) {
  customElements.define(SECTION_STRATEGY_TAG, MaintenanceSectionStrategy);
}

// ── fire-dom-event handler ──────────────────────────────────────────────────
//
// HA's standard ``tap_action: { action: "fire-dom-event", ll_custom: {...} }``
// dispatches an ``ll-custom`` CustomEvent on the tapped element. We register
// one bubble-phase listener at document level that handles every payload
// whose ``type`` is namespaced with ``maintenance-supporter:`` — currently:
//
//   maintenance-supporter:add-object  → /maintenance-supporter?ms_action=add_object
//   maintenance-supporter:open-task    → /maintenance-supporter?ms_action=open_task&task_id=<id>
//
// The panel reads the ``ms_action`` query string on load and opens the
// matching dialog. This avoids ripping the dialog code out of the panel
// while still giving Lovelace cards a clean tap-action UX.

interface LlCustomEventDetail {
  type?: string;
  [key: string]: unknown;
}

const LL_CUSTOM_HANDLER_FLAG = "_msSupporterLlCustomBound";

function registerLlCustomHandler(): void {
  const w = window as unknown as Record<string, unknown>;
  if (w[LL_CUSTOM_HANDLER_FLAG]) return; // idempotent — strategy file may load twice
  w[LL_CUSTOM_HANDLER_FLAG] = true;

  document.addEventListener("ll-custom", (event: Event) => {
    const detail = (event as CustomEvent<LlCustomEventDetail>).detail;
    if (!detail || typeof detail.type !== "string") return;
    if (!detail.type.startsWith("maintenance-supporter:")) return;
    const action = detail.type.slice("maintenance-supporter:".length);

    let path = "/maintenance-supporter";
    if (action === "add-object") {
      path += "?ms_action=add_object";
    } else if (action === "open-task" && typeof detail.task_id === "string") {
      path += `?ms_action=open_task&task_id=${encodeURIComponent(detail.task_id)}`;
    }

    // Use HA's history API path so the routing system catches the change.
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  });
}

registerLlCustomHandler();

// Discovery — picked up by HA 2026.5+. Older HA ignores it silently.
const w = window as unknown as {
  customStrategies?: Array<{
    type: string;
    strategyType: string;
    name: string;
    description?: string;
    documentationURL?: string;
  }>;
};
w.customStrategies = w.customStrategies || [];

function registerStrategy(entry: {
  type: string;
  strategyType: string;
  name: string;
  description?: string;
  documentationURL?: string;
}): void {
  const exists = w.customStrategies!.some(
    (s) => s.type === entry.type && s.strategyType === entry.strategyType,
  );
  if (!exists) w.customStrategies!.push(entry);
}

registerStrategy({
  type: STRATEGY_TYPE,
  strategyType: "dashboard",
  name: "Maintenance Supporter",
  description:
    "Auto-generated dashboard. Group views by area, status, floor, or due date — picked from the strategy editor or YAML.",
  documentationURL:
    "https://github.com/iluebbe/maintenance_supporter#dashboard-strategy",
});

registerStrategy({
  type: SECTION_STRATEGY_TYPE,
  strategyType: "section",
  name: "Maintenance Supporter — Section",
  description:
    "Embed maintenance tasks (filterable by area, status, due date) as a section in any dashboard view.",
  documentationURL:
    "https://github.com/iluebbe/maintenance_supporter#section-strategy",
});

export {};
