/**
 * Prod review 2026-11-15: a single-shot state rule over nine routers'
 * update entities was a line on a 0 / 0.5 / 1 / 1.5 axis for the first
 * router only; an eight-minute alert on 30 days was a hairline, and the
 * history said "8.51 available" twice without saying for which router.
 *
 * Now such a rule is a timeline of all its sensors (alert, unreachable,
 * done), with a line in words on top and a magnifier for alerts too short
 * to read; the history names the sensor and says how long after the report
 * an automatic completion came; a change count's axis has whole numbers.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { render } from "lit";
import "../components/state-timeline.js";
import type { MaintenanceStateTimeline } from "../components/state-timeline";
import {
  alertRule,
  doneAt,
  episodesOf,
  firstStamp,
  segmentsOf,
  withLiveState,
  zoomWindow,
  type AlertRule,
  type RecordedState,
} from "../helpers/state-timeline.js";
import { triggerValueText } from "../helpers/trigger-value.js";
import { niceTicks } from "../renderers/chart-utils.js";
import { renderTriggerSection, type SparklineContext } from "../renderers/sparkline.js";
import type { HistoryEntry, HomeAssistant, MaintenanceTask, StatisticsPoint } from "../types";

const MIN = 60_000;
const H = 60 * MIN;
const DAY = 24 * H;

const RULE: AlertRule = alertRule({ type: "state_change", trigger_from_state: "off", trigger_to_state: "on", trigger_target_changes: 1 })!;
const st = (at: number, s: string): RecordedState => ({ s, lu: at / 1000 });
const iso = (ms: number): string => new Date(ms).toISOString();

const A = "update.router_arbeitszimmer";
const B = "update.router_wohnzimmer";
const QUIET = Array.from({ length: 7 }, (_, i) => `update.repeater_${i}`);

/** The 15.11. timings, relative to `now`: router A offered 8.51, rebooted
 *  and was fine again eight minutes later (and unreachable once more while
 *  B rebooted); B did the same in four minutes. */
function rows(now: number): Record<string, RecordedState[]> {
  const t = (minutesAgo: number) => now - minutesAgo * MIN;
  const start = now - 10 * DAY;
  return {
    [A]: [st(start, "off"), st(t(88), "on"), st(t(85), "unavailable"), st(t(80), "off"), st(t(69), "unavailable"), st(t(67), "off")],
    [B]: [st(start, "off"), st(t(71), "on"), st(t(70), "unavailable"), st(t(67), "off")],
    ...Object.fromEntries(QUIET.map((id) => [id, [st(start, "off")]])),
  };
}

describe("state timeline — the alert state and its segments", () => {
  it("is the backend's latch: to-state, else anything but the from-state; a counter keeps its line", () => {
    expect(alertRule({ type: "state_change", trigger_to_state: " ON ", trigger_target_changes: 1 })).to.deep.include({ to: "on", from: null });
    expect(alertRule({ type: "state_change", trigger_from_state: "docked" })).to.deep.include({ to: null, from: "docked" });
    expect(alertRule({ type: "state_change", trigger_to_state: "on", trigger_target_changes: 3 })).to.equal(null);
    expect(alertRule({ type: "state_change" })).to.equal(null);
    expect(alertRule({ type: "threshold", trigger_to_state: "on" } as never)).to.equal(null);
  });

  it("splits a router's states into fine, alert and unreachable, and the reboot belongs to the alert", () => {
    const now = Date.now();
    const segs = segmentsOf(rows(now)[A], RULE, now - 10 * DAY, now);
    expect(segs.map((s) => s.kind)).to.deep.equal(["ok", "alarm", "gone", "ok", "gone", "ok"]);
    const eps = episodesOf(A, segs);
    expect(eps).to.have.length(1);
    expect(eps[0].start).to.equal(now - 88 * MIN);
    expect(eps[0].end, "fine again when it reported off, after the reboot").to.equal(now - 80 * MIN);
  });

  it("keeps an alert open while it lasts, and an alert shorter than the hold never fired", () => {
    const now = Date.now();
    const open = episodesOf(B, segmentsOf([st(now - DAY, "off"), st(now - 5 * MIN, "on")], RULE, now - DAY, now));
    expect(open).to.deep.equal([{ entityId: B, start: now - 5 * MIN, end: null }]);
    const held: AlertRule = { ...RULE, holdMs: 5 * MIN };
    const blip = segmentsOf([st(now - DAY, "off"), st(now - H, "on"), st(now - H + 2 * MIN, "off")], held, now - DAY, now);
    expect(episodesOf(B, blip)).to.deep.equal([]);
  });

  it("enlarges the newest alerts when they are too short to read, not when they are wide", () => {
    const now = Date.now();
    const t0 = now - 10 * DAY;
    const eps = [
      { entityId: A, start: now - 88 * MIN, end: now - 80 * MIN },
      { entityId: B, start: now - 71 * MIN, end: now - 67 * MIN },
    ];
    const zoom = zoomWindow(eps, t0, now, 600)!;
    expect(zoom, "eight minutes on ten days is a hairline").to.exist;
    expect(zoom.start).to.be.at.most(now - 88 * MIN);
    expect(zoom.end).to.be.at.least(now - 67 * MIN);
    expect(zoom.end - zoom.start).to.be.below(3 * H);
    expect(zoomWindow([{ entityId: A, start: now - 5 * DAY, end: now - 2 * DAY }], t0, now, 600)).to.equal(null);
  });

  it("adds the live state when the recorder has not written it yet", () => {
    const now = Date.now();
    const recorded = [st(now - DAY, "off")];
    const live = withLiveState(recorded, { state: "on", last_changed: iso(now - 2_000) });
    expect(live.map((r) => r.s)).to.deep.equal(["off", "on"]);
    expect(withLiveState(recorded, { state: "off", last_changed: iso(now - 2 * DAY) }), "already recorded").to.have.length(1);
    expect(withLiveState(recorded, undefined)).to.have.length(1);
  });

  it("finds the completion at an alert's end and the recorder's first state", () => {
    const now = Date.now();
    const ep = { entityId: B, start: now - 71 * MIN, end: now - 67 * MIN };
    const auto = { timestamp: iso(now - 67 * MIN + 30_000), type: "completed", auto: true } as HistoryEntry;
    expect(doneAt(ep, [auto])).to.equal(auto);
    expect(doneAt(ep, [{ ...auto, timestamp: iso(now) }])).to.equal(null);
    expect(firstStamp(rows(now)[A])).to.equal(now - 10 * DAY);
    expect(Number.isNaN(firstStamp([]))).to.equal(true);
  });
});

describe("state timeline — the element", () => {
  function hass(now: number, sent: Record<string, unknown>[]): HomeAssistant {
    const states: Record<string, unknown> = {
      [A]: { entity_id: A, state: "off", attributes: { friendly_name: "Router Arbeitszimmer", installed_version: "8.51", latest_version: "8.51" } },
      [B]: { entity_id: B, state: "off", attributes: { friendly_name: "Router Wohnzimmer", installed_version: "8.51", latest_version: "8.51" } },
    };
    return {
      language: "en",
      states,
      connection: {
        sendMessagePromise: async (msg: Record<string, unknown>) => {
          sent.push(msg);
          return rows(now);
        },
      },
    } as unknown as HomeAssistant;
  }

  it("says the newest alert in words, draws the routers that reported, folds the rest and enlarges", async () => {
    const now = Date.now();
    const sent: Record<string, unknown>[] = [];
    const history = [
      { timestamp: iso(now - 71 * MIN), type: "triggered", trigger_change: { entity: B, to: "on", installed: "8.25", latest: "8.51" } },
      { timestamp: iso(now - 67 * MIN + 20_000), type: "completed", auto: true, trigger_change: { entity: B, state: "off", installed: "8.51" } },
    ] as HistoryEntry[];
    const el = await fixture<MaintenanceStateTimeline>(html`<maintenance-state-timeline
      style="width: 800px"
      .hass=${hass(now, sent)}
      .entityIds=${[A, B, ...QUIET]}
      .rule=${RULE}
      .history=${history}
      .rangeDays=${30}
      .lang=${"en"}
    ></maintenance-state-timeline>`);
    const root = el.shadowRoot!;
    await waitUntil(() => root.querySelector(".tl-last"), "the states arrive");

    expect(sent).to.have.length(1);
    expect(sent[0]).to.deep.include({ type: "history/history_during_period", no_attributes: true, minimal_response: true });
    expect(sent[0].entity_ids, "every router in one call").to.have.length(9);

    const last = root.querySelector(".tl-last")!.textContent!;
    expect(last).to.contain("Last report:");
    expect(last).to.contain("Router Wohnzimmer");
    expect(last).to.contain("8.51 installed");
    expect(last).to.contain("OK again after 4 minutes");
    expect(last).to.contain("completed automatically");

    // The first lanes are the overview; the magnifier's come after them.
    const overview = root.querySelector(".tl-lanes")!;
    expect([...overview.querySelectorAll(".tl-name")].map((n) => n.textContent!.trim()).filter(Boolean)).to.deep.equal([
      "Router Wohnzimmer",
      "Router Arbeitszimmer",
    ]);
    expect(root.querySelector(".tl-quiet")!.textContent).to.contain("7 more");

    const marks = [...overview.querySelectorAll<HTMLElement>(".tl-mark")];
    expect(marks).to.have.length(2);
    for (const m of marks) expect(m.getBoundingClientRect().width, "an alert is never a hairline").to.be.at.least(7.5);

    const zoom = root.querySelector(".tl-zoom")!;
    expect(zoom, "the magnifier").to.exist;
    expect(zoom.querySelectorAll(".tl-seg.gone").length, "the reboots").to.be.at.least(2);
    expect(zoom.querySelectorAll(".tl-tick"), "the automatic completion").to.have.length(1);
    expect(zoom.textContent).to.contain("reported →");
    expect(root.querySelector(".tl-legend")!.textContent).to.contain("unreachable");
    expect(root.textContent, "no 0.5 / 1.5 axis").not.to.match(/\b[01]\.5\b/);
  });

  it("puts the done tick and the words in the overview when the alerts read at their width", async () => {
    const now = Date.now();
    const short = {
      language: "en",
      states: {},
      connection: {
        sendMessagePromise: async () => ({ [B]: [st(now - 10 * MIN, "off"), st(now - 6 * MIN, "on"), st(now - 3 * MIN, "off")] }),
      },
    } as unknown as HomeAssistant;
    const history = [{ timestamp: iso(now - 3 * MIN + 5_000), type: "completed", auto: true }] as HistoryEntry[];
    const el = await fixture<MaintenanceStateTimeline>(html`<maintenance-state-timeline style="width: 800px"
      .hass=${short} .entityIds=${[B]} .rule=${RULE} .history=${history} .rangeDays=${30} .lang=${"en"}></maintenance-state-timeline>`);
    const root = el.shadowRoot!;
    await waitUntil(() => root.querySelector(".tl-last"), "the states arrive");
    expect(root.querySelector(".tl-zoom"), "nothing to enlarge").to.equal(null);
    expect(root.querySelectorAll(".tl-tick")).to.have.length(1);
    expect(root.querySelector(".tl-labels")!.textContent).to.contain("completed (3 minutes)");
    expect(root.querySelector(".tl-legend")!.textContent).to.contain("Completed");
  });

  it("says when nothing reported, without bars for a rule on several sensors", async () => {
    const now = Date.now();
    const quiet = {
      language: "en",
      states: {},
      connection: { sendMessagePromise: async () => Object.fromEntries(QUIET.map((id) => [id, [st(now - 10 * DAY, "off")]])) },
    } as unknown as HomeAssistant;
    const el = await fixture<MaintenanceStateTimeline>(html`<maintenance-state-timeline
      .hass=${quiet} .entityIds=${QUIET} .rule=${RULE} .rangeDays=${30} .lang=${"en"}></maintenance-state-timeline>`);
    await waitUntil(() => el.shadowRoot!.querySelector(".tl-last"), "the states arrive");
    expect(el.shadowRoot!.querySelector(".tl-last")!.textContent).to.contain("No report since");
    expect(el.shadowRoot!.querySelector(".tl-lanes")).to.equal(null);
  });
});

describe("state timeline — on the task page", () => {
  function ctx(withHass: boolean): SparklineContext {
    return {
      lang: "en",
      hass: withHass ? ({ language: "en", states: {}, connection: { sendMessagePromise: async () => ({}) } } as unknown as HomeAssistant) : undefined,
      detailStatsData: new Map<string, StatisticsPoint[]>(),
      hasStatsService: true,
      isCounterEntity: () => false,
      rangeDays: 30,
      setRangeDays: () => undefined,
      hideOutliers: false,
      setHideOutliers: () => undefined,
    };
  }
  const latch = {
    id: "t1",
    name: "Install router updates",
    history: [],
    trigger_active: false,
    trigger_current_value: 0,
    trigger_config: { type: "state_change", entity_id: A, entity_ids: [A, B], trigger_from_state: "off", trigger_to_state: "on", trigger_target_changes: 1 },
  } as unknown as MaintenanceTask;

  afterEach(() => document.body.querySelectorAll(":scope > div.tl-host").forEach((d) => d.remove()));

  it("draws the timeline and no 0 / 1 progress", () => {
    const host = document.createElement("div");
    host.className = "tl-host";
    document.body.appendChild(host);
    render(renderTriggerSection(latch, ctx(true)), host);
    expect(host.querySelector("maintenance-state-timeline"), "the timeline").to.exist;
    expect(host.querySelector("maintenance-trigger-chart"), "no line chart").to.equal(null);
    expect(host.querySelector(".counter-progress"), "no 0 / 1 · 0 %").to.equal(null);
    const tl = host.querySelector("maintenance-state-timeline") as MaintenanceStateTimeline;
    expect(tl.entityIds).to.deep.equal([A, B]);
  });
});

describe("history rows name the sensor and say how long", () => {
  const names: Record<string, string> = { [B]: "Router Wohnzimmer" };
  const ctx = { entityName: (id: string) => names[id] ?? id, sensors: 9, stateRule: true };
  const fired = { timestamp: "2026-11-15T13:14:45+01:00", type: "triggered", trigger_change: { entity: B, from: "off", to: "on", installed: "8.25", latest: "8.51" } } as HistoryEntry;
  const done = { timestamp: "2026-11-15T13:18:23+01:00", type: "completed", auto: true, trigger_change: { entity: B, state: "off", installed: "8.51", latest: "8.51" } } as HistoryEntry;

  it("a firing of a rule on several sensors names its sensor; a rule on one does not", () => {
    expect(triggerValueText(fired, "en", ctx)).to.equal("Router Wohnzimmer: 8.51 available, 8.25 installed");
    expect(triggerValueText(fired, "en", { ...ctx, sensors: 1 })).to.equal("8.51 available, 8.25 installed");
  });

  it("an automatic completion says the sensor, the installed version and how long after the report", () => {
    expect(triggerValueText(done, "en", { ...ctx, history: [fired, done] })).to.equal("Router Wohnzimmer: 8.51 installed · 4 minutes after the report");
    // After another completion there was no report to count from.
    const before = { ...fired, type: "completed", trigger_change: undefined } as HistoryEntry;
    expect(triggerValueText(done, "en", { ...ctx, history: [before, done] })).to.equal("Router Wohnzimmer: 8.51 installed");
    expect(triggerValueText({ timestamp: done.timestamp, type: "completed" } as HistoryEntry, "en", ctx)).to.equal("");
  });
});

describe("a change count's axis", () => {
  it("has whole numbers only", () => {
    for (const [lo, hi] of [[0, 1.06], [0, 3.18], [0, 8.48]]) {
      const { ticks } = niceTicks(lo, hi, 4, true);
      expect(ticks.every((v) => Number.isInteger(v)), `${lo}–${hi}: ${ticks.join(", ")}`).to.equal(true);
    }
    expect(niceTicks(0, 1.06, 4).ticks, "a reading keeps its halves").to.include(0.5);
  });
});
