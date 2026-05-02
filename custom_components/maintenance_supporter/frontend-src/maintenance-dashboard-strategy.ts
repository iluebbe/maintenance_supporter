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

function overviewView(): ViewConfig {
  return {
    title: "Overview",
    icon: "mdi:wrench-clock",
    path: "overview",
    type: "sections",
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
    const groupBy: GroupBy = config?.group_by ?? "area";

    const views: ViewConfig[] = [overviewView()];
    if (groupBy === "status") {
      views.push(...viewsByStatus(objects));
    } else if (groupBy === "floor") {
      views.push(...viewsByFloor(objects, hass.areas || {}, hass.floors || {}));
    } else if (groupBy === "due_date") {
      views.push(...viewsByDueDate(objects));
    } else {
      views.push(...viewsByArea(objects, hass.areas || {}));
    }

    return {
      title: "Maintenance",
      views,
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

if (!customElements.get(STRATEGY_TAG)) {
  customElements.define(STRATEGY_TAG, MaintenanceDashboardStrategy);
}
if (!customElements.get(EDITOR_TAG)) {
  customElements.define(EDITOR_TAG, MaintenanceStrategyEditor);
}

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
const alreadyRegistered = w.customStrategies.some(
  (s) => s.type === STRATEGY_TYPE && s.strategyType === "dashboard",
);
if (!alreadyRegistered) {
  w.customStrategies.push({
    type: STRATEGY_TYPE,
    strategyType: "dashboard",
    name: "Maintenance Supporter",
    description:
      "Auto-generated dashboard. Group views by area, status, floor, or due date — picked from the strategy editor or YAML.",
    documentationURL:
      "https://github.com/iluebbe/maintenance_supporter#dashboard-strategy",
  });
}

export {};
