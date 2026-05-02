/** Maintenance Supporter — custom dashboard strategy.
 *
 * Generates a complete Lovelace dashboard from the integration's WS feed:
 *   • View 1: "Overview" — actionable tasks (overdue + triggered + due_soon)
 *   • View 2..N: one per area, each filtered to that area's objects
 *   • View N+1: "Unassigned" — objects without an area_id
 *
 * Requires Home Assistant 2026.5+ to appear in the "Add Dashboard" picker
 * (that's when ``window.customStrategies`` got picked up by the frontend).
 * On older HA versions the registration is a silent no-op — no error, just
 * not discoverable from the UI.
 */

interface MaintenanceObjectResp {
  entry_id: string;
  object: {
    id: string;
    name: string;
    area_id: string | null;
  };
  tasks: unknown[];
}

interface AreaEntry {
  area_id: string;
  name: string;
  icon?: string | null;
}

interface HassLike {
  language?: string;
  connection: {
    sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T>;
  };
  areas?: Record<string, AreaEntry>;
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

class MaintenanceDashboardStrategy extends HTMLElement {
  static getCreateSuggestions(_hass: HassLike) {
    return {
      title: "Maintenance Supporter",
      icon: "mdi:wrench-clock",
    };
  }

  static async generate(
    _config: Record<string, unknown>,
    hass: HassLike,
  ): Promise<DashboardConfig> {
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

    // ── View 1: Overview ──────────────────────────────────────────────
    const views: ViewConfig[] = [
      {
        title: "Overview",
        icon: "mdi:wrench-clock",
        path: "overview",
        type: "sections",
        sections: [
          {
            type: "grid",
            cards: [
              {
                type: "custom:maintenance-supporter-card",
                show_header: false,
                filter_status: ["overdue", "triggered", "due_soon"],
              },
            ],
          },
        ],
      },
    ];

    // ── Group objects by area_id ──────────────────────────────────────
    const byArea = new Map<string | null, MaintenanceObjectResp[]>();
    for (const obj of objects) {
      const aid = obj.object.area_id || null;
      if (!byArea.has(aid)) byArea.set(aid, []);
      byArea.get(aid)!.push(obj);
    }

    // Sort areas by display name; "Unassigned" pinned to the end
    const areas = hass.areas || {};
    const areaIds = Array.from(byArea.keys()).filter(
      (a): a is string => a !== null,
    );
    areaIds.sort((a, b) => {
      const na = areas[a]?.name || a;
      const nb = areas[b]?.name || b;
      return na.localeCompare(nb);
    });

    for (const areaId of areaIds) {
      const objs = byArea.get(areaId)!;
      const areaInfo = areas[areaId];
      views.push({
        title: areaInfo?.name || areaId,
        icon: areaInfo?.icon || "mdi:floor-plan",
        path: `area-${areaId}`,
        type: "sections",
        sections: [
          {
            type: "grid",
            cards: [
              {
                type: "custom:maintenance-supporter-card",
                show_header: false,
                // The card filters by object NAME (not entry_id), so we pass names.
                filter_objects: objs.map((o) => o.object.name),
              },
            ],
          },
        ],
      });
    }

    // ── Unassigned objects last ───────────────────────────────────────
    const unassigned = byArea.get(null);
    if (unassigned && unassigned.length > 0) {
      views.push({
        title: "Unassigned",
        icon: "mdi:help-circle-outline",
        path: "unassigned",
        type: "sections",
        sections: [
          {
            type: "grid",
            cards: [
              {
                type: "custom:maintenance-supporter-card",
                show_header: false,
                filter_objects: unassigned.map((o) => o.object.name),
              },
            ],
          },
        ],
      });
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
      "Auto-generated dashboard with one view per area showing maintenance tasks. Requires Home Assistant 2026.5 or later to appear in this picker.",
    documentationURL:
      "https://github.com/iluebbe/maintenance_supporter#dashboard-strategy",
  });
}

export {};
