/** Maintenance Supporter — custom dashboard strategy.
 *
 * Generates a complete Lovelace dashboard from the integration's WS feed.
 * Honors a ``group_by`` config so YAML users can pick the layout:
 *
 *   strategy:
 *     type: custom:maintenance-supporter
 *     group_by: area    # default — one view per area + Unassigned
 *
 *   strategy:
 *     type: custom:maintenance-supporter
 *     group_by: status  # one view per status (Overdue / Triggered / Due Soon / OK)
 *
 * Layout pattern follows HA's own ``maintenance-view-strategy`` and
 * ``areas-dashboard-strategy``: a leading "Overview" view of actionable tasks,
 * empty groups skipped, and STATE_NOT_RUNNING / recovery_mode handled with
 * the same starting / recovery-mode card placeholders HA core uses.
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
  tasks: Array<{ status?: string }>;
}

interface AreaEntry {
  area_id: string;
  name: string;
  icon?: string | null;
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
}

type GroupBy = "area" | "status";

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

// Match HA's own startup placeholders (see areas-dashboard-strategy.ts).
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
    if (objs.length === 0) continue; // empty-section guard
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
          // The card filters by object NAME (not entry_id), so we pass names.
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
  // Pre-compute which statuses actually have at least one task — skip empty.
  const present = new Set<string>();
  for (const obj of objects) {
    for (const task of obj.tasks || []) {
      if (task.status) present.add(task.status);
    }
  }

  const views: ViewConfig[] = [];
  for (const v of STATUS_VIEWS) {
    if (!present.has(v.status)) continue; // empty-section guard
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

class MaintenanceDashboardStrategy extends HTMLElement {
  static getCreateSuggestions(_hass: HassLike) {
    return {
      title: "Maintenance Supporter",
      icon: "mdi:wrench-clock",
    };
  }

  static async generate(
    config: MaintenanceDashboardStrategyConfig | undefined,
    hass: HassLike,
  ): Promise<DashboardConfig> {
    // Startup guards — match the placeholder cards HA core uses (see
    // areas-dashboard-strategy.ts) so the dashboard renders cleanly while
    // HA is still booting or in recovery mode.
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
    } else {
      views.push(...viewsByArea(objects, hass.areas || {}));
    }

    return {
      title: "Maintenance",
      views,
    };
  }
}

if (!customElements.get(STRATEGY_TAG)) {
  customElements.define(STRATEGY_TAG, MaintenanceDashboardStrategy);
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
      "Auto-generated dashboard with one view per area (or per status) showing maintenance tasks. Configure via YAML: strategy.group_by = 'area' (default) | 'status'. Requires Home Assistant 2026.5+ to appear in this picker.",
    documentationURL:
      "https://github.com/iluebbe/maintenance_supporter#dashboard-strategy",
  });
}

export {};
