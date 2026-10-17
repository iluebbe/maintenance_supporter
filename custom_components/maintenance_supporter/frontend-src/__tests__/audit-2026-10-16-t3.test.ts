/**
 * Bug audit 2026-10-16, tranche 3 — frontend regressions. Every test fails
 * on the code before the fix.
 *
 * - P7: a vacation change made while a save was on its way was dropped, and
 *   a refused one stayed shown as saved.
 * - F10: the documents archive restore did not say which object matched
 *   nothing.
 * - P8: a failed load left the object's quick actions on "Loading…".
 * - FE-4: in the panel, a calendar event opened the quick-actions dialog
 *   on top instead of the task page.
 * - FE-5: the calendar's past view opened the history editor for triggered
 *   and missed entries.
 * - FE-6: "3 дней" — Russian, Ukrainian and Czech plural forms.
 * - Stats cache and the overview batch: one sensor behind a counter task and
 *   a level task.
 * - New task: an archived object was offered first.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/object-quick-actions-dialog.js";
import "../components/settings-view.js";
import "../components/task-dialog.js";
import type { MaintenanceObjectQuickActionsDialog } from "../components/object-quick-actions-dialog";
import type { MaintenanceSettingsView } from "../components/settings-view";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { EDITABLE_HISTORY_TYPES } from "../status-constants";
import { formatDueDays, setLocale, t } from "../styles";
import cs from "../locales/cs.json";
import ru from "../locales/ru.json";
import uk from "../locales/uk.json";
import { miniSeriesKey } from "../helpers/trigger-entities";
import { computeTrend } from "../renderers/progress";
import { StatisticsService } from "../statistics-service";
import type { TaskRow } from "../types";
import { createMockHass } from "./_test-utils.js";

describe("P7: vacation changes made during a save are sent after it", () => {
  it("two quick exempt ticks both arrive", async () => {
    const sent: Array<Record<string, unknown>> = [];
    let release: (() => void) | null = null;
    const hass = {
      language: "en",
      user: { id: "u1", is_admin: true },
      connection: {
        sendMessagePromise: (m: Record<string, unknown>) => {
          if (m.type !== "maintenance_supporter/vacation/update") return Promise.resolve({});
          sent.push(m);
          const reply = { enabled: true, start: null, end: null, buffer_days: 3, is_active: false, window_end: null, exempt_task_ids: m.exempt_task_ids ?? [] };
          if (sent.length === 1) return new Promise((r) => { release = () => r(reply); });
          return Promise.resolve(reply);
        },
      },
    };
    const el = await fixture<MaintenanceSettingsView>(html`<maintenance-settings-view .hass=${hass as never}></maintenance-settings-view>`);
    const priv = el as unknown as { _toggleVacationExempt(id: string, on: boolean): void; _vacExempt: Set<string> };
    priv._vacExempt = new Set();
    priv._toggleVacationExempt("a", true);
    priv._toggleVacationExempt("b", true);
    expect(sent).to.have.length(1);
    release!();
    await new Promise((r) => setTimeout(r, 20));
    expect(sent).to.have.length(2);
    expect(sent[1].exempt_task_ids).to.deep.equal(["a", "b"]);
  });

  it("a refused change is taken back to the server's state", async () => {
    const hass = {
      language: "en",
      user: { id: "u1", is_admin: true },
      connection: {
        sendMessagePromise: (m: Record<string, unknown>) => {
          if (m.type === "maintenance_supporter/vacation/update") return Promise.reject({ code: "invalid_input", message: "No" });
          if (m.type === "maintenance_supporter/vacation/state") {
            return Promise.resolve({ enabled: false, start: null, end: null, buffer_days: 3, is_active: false, window_end: null, exempt_task_ids: ["kept"] });
          }
          return Promise.resolve({});
        },
      },
    };
    const el = await fixture<MaintenanceSettingsView>(html`<maintenance-settings-view .hass=${hass as never}></maintenance-settings-view>`);
    const priv = el as unknown as {
      _toggleVacationEnabled(on: boolean): void; _toggleVacationExempt(id: string, on: boolean): void;
      _vacEnabled: boolean; _vacExempt: Set<string>;
    };
    priv._toggleVacationEnabled(true);
    expect(priv._vacEnabled).to.equal(true);
    await new Promise((r) => setTimeout(r, 20));
    expect(priv._vacEnabled).to.equal(false);
    priv._toggleVacationExempt("new", true);
    await new Promise((r) => setTimeout(r, 20));
    expect([...priv._vacExempt]).to.deep.equal(["kept"]);
  });
});

describe("F10: the archive restore names an object that matched nothing", () => {
  const origFetch = window.fetch;
  afterEach(() => { window.fetch = origFetch; });

  it("in the toast, next to the counts", async () => {
    const { hass } = createMockHass();
    const el = await fixture<MaintenanceSettingsView>(html`<maintenance-settings-view .hass=${hass}></maintenance-settings-view>`);
    await new Promise((r) => setTimeout(r, 50));
    const body = { blobs_written: 1, documents_created: 0, objects_unmatched: ["Ghost", "Shed"] };
    window.fetch = (async () => new Response(JSON.stringify(body), { status: 200 })) as typeof fetch;
    const input = document.createElement("input");
    input.type = "file";
    Object.defineProperty(input, "files", { value: [new File(["x"], "docs.zip")] });
    await (el as unknown as { _importDocsArchive: (e: Event) => Promise<void> })._importDocsArchive({ target: input } as never);
    const toast = (el as unknown as { _toast: string })._toast;
    expect(toast.endsWith(t("settings_docs_import_unmatched", "en").replace("{names}", "Ghost, Shed"))).to.equal(true);
  });
});

describe("P8: a failed load shows its error", () => {
  it("not Loading… for good", async () => {
    const hass = {
      language: "en",
      user: { id: "u1", is_admin: true },
      connection: { sendMessagePromise: () => Promise.reject({ code: "not_found", message: "Object not found" }) },
    };
    const el = await fixture<MaintenanceObjectQuickActionsDialog>(html`<maintenance-object-quick-actions-dialog .hass=${hass as never}></maintenance-object-quick-actions-dialog>`);
    await el.openFor("e1");
    await el.updateComplete;
    const root = el.shadowRoot!;
    // Booleans, not elements: a DOM node in a failed assertion wedges the runner.
    expect(!!root.querySelector(".loading")).to.equal(false);
    expect(!!root.querySelector(".error")).to.equal(true);
  });
});

describe("FE-5: the calendar opens the editor only for editable entries", () => {
  it("a past triggered entry opens its task, not the editor", async () => {
    expect([...EDITABLE_HISTORY_TYPES]).to.deep.equal(["completed", "reset", "skipped"]);
    await import("../maintenance-calendar-card.js");
    const card = document.createElement("maintenance-supporter-calendar-card") as HTMLElement & { _onEventClick(ev: unknown): void };
    const host = document.createElement("div");
    const claimed: string[] = [];
    host.addEventListener("maintenance-supporter-open-task", (e) => { claimed.push("task"); e.preventDefault(); });
    host.appendChild(card);
    document.body.appendChild(host);
    try {
      card._onEventClick({ entry_id: "e1", task_id: "t1", history_timestamp: "2026-10-01T10:00:00+00:00", history_type: "triggered" });
      card._onEventClick({ entry_id: "e1", task_id: "t1", history_timestamp: "2026-10-01T11:00:00+00:00", history_type: "missed" });
      expect(claimed).to.deep.equal(["task", "task"]);
    } finally {
      host.remove();
    }
  });
});

describe("FE-4: the panel claims a calendar event's task", () => {
  it("a claimed request opens no dialog", async () => {
    await import("../maintenance-calendar-card.js");
    const card = document.createElement("maintenance-supporter-calendar-card") as HTMLElement & { _openTask(ev: unknown): void };
    const host = document.createElement("div");
    let claimed = 0;
    host.addEventListener("maintenance-supporter-open-task", (e) => { claimed++; e.preventDefault(); });
    let opened = 0;
    host.addEventListener("ll-custom", () => { opened++; });
    host.appendChild(card);
    document.body.appendChild(host);
    try {
      card._openTask({ entry_id: "e1", task_id: "t1" });
      expect(claimed).to.equal(1);
      expect(opened).to.equal(0);
    } finally {
      host.remove();
    }
  });
});

describe("FE-6: day counts follow the language's plural rule", () => {
  it("Russian, Ukrainian, Czech", async () => {
    setLocale("ru", ru as Record<string, string>);
    setLocale("uk", uk as Record<string, string>);
    setLocale("cs", cs as Record<string, string>);
    expect(formatDueDays(3, "ru")).to.equal("3 дня");
    expect(formatDueDays(5, "ru")).to.equal("5 дней");
    expect(formatDueDays(21, "ru")).to.equal("21 день");
    expect(formatDueDays(3, "uk")).to.equal("3 дні");
    expect(formatDueDays(3, "cs")).to.equal("3 dny");
    expect(formatDueDays(3, "en")).to.equal("3 days");
    expect(formatDueDays(1, "en")).to.equal("1 day");
  });
});

describe("Stats cache: a counter and a level series of one sensor", () => {
  it("are two cache entries", async () => {
    const calls: Array<Record<string, unknown>> = [];
    const hass = {
      connection: {
        sendMessagePromise: async (m: Record<string, unknown>) => {
          calls.push(m);
          return { "sensor.x": [{ start: Date.now(), mean: 1, min: 1, max: 1, state: 1, sum: 1, change: 1 }] };
        },
      },
    };
    const svc = new StatisticsService(hass as never);
    await svc.getMiniStats("sensor.x", true);
    await svc.getMiniStats("sensor.x", false);
    // The level series was fetched, not served from the counter's cache entry.
    const types = calls.map((c) => (c.types as string[] | undefined) ?? []);
    expect(types.some((t) => t.includes("sum"))).to.equal(true);
    expect(types.some((t) => t.includes("mean"))).to.equal(true);
  });

  it("the overview's batch keeps both series, and each row reads its own", async () => {
    const hass = {
      connection: {
        sendMessagePromise: async (m: Record<string, unknown>) => {
          const counter = (m.types as string[]).includes("sum");
          const at = (d: number) => Date.now() - d * 86400e3;
          return { "sensor.x": [3, 2].map((d, i) => ({ start: at(d), state: counter ? 100 + i * 50 : undefined, mean: counter ? undefined : 7 - i })) };
        },
      },
    };
    const svc = new StatisticsService(hass as never);
    const batch = await svc.getBatchMiniStats([{ entityId: "sensor.x", isCounter: true }, { entityId: "sensor.x", isCounter: false }]);
    expect(batch.get(miniSeriesKey("sensor.x", true))?.map((p) => p.val)).to.deep.equal([100, 150]);
    expect(batch.get(miniSeriesKey("sensor.x", false))?.map((p) => p.val)).to.deep.equal([7, 6]);
    // The counter row's trend climbs toward its target, the level row's drops away from "above 10".
    const counterRow = { trigger_config: { type: "counter", entity_id: "sensor.x", trigger_target_value: 200 } } as unknown as TaskRow;
    const levelRow = { trigger_config: { type: "threshold", entity_id: "sensor.x", trigger_above: 10 } } as unknown as TaskRow;
    expect(computeTrend(counterRow, batch)).to.equal("approaching");
    expect(computeTrend(levelRow, batch)).to.equal("easing");
  });
});

describe("New task: an archived object is not offered", () => {
  it("the first live object is preselected", async () => {
    const { hass } = createMockHass();
    const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
    await el.openCreate("", [
      { entry_id: "a", object: { name: "Attic fan", archived: true } },
      { entry_id: "b", object: { name: "Boiler" } },
    ]);
    const priv = el as unknown as { _entryId: string; _objectChoices: Array<{ entry_id: string }> };
    expect(priv._entryId).to.equal("b");
    expect(priv._objectChoices.map((c) => c.entry_id)).to.deep.equal(["b"]);
  });
});
