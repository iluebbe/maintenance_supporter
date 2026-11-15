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
import "../components/runtime-bars.js";
import type { MaintenanceStateTimeline } from "../components/state-timeline";
import type { MaintenanceRuntimeBars } from "../components/runtime-bars";
import { hoursPerBucket, runtimeIntervals, untilTarget } from "../helpers/runtime-days.js";
import { stampMs } from "../helpers/ha-time.js";
import {
  alertRule,
  combineSegments,
  conditionRule,
  isAlert,
  isDiscreteThreshold,
  doneAt,
  episodesOf,
  firstStamp,
  ownEpisodes,
  segmentsOf,
  withLiveState,
  zoomWindow,
  type AlertRule,
  type RecordedState,
} from "../helpers/state-timeline.js";
import { triggerValueText } from "../helpers/trigger-value.js";
import { niceTicks, rangeAddsNothing } from "../renderers/chart-utils.js";
import { drawsItself, hasTrend, renderTriggerSection, type SparklineContext } from "../renderers/sparkline.js";
import type { HistoryEntry, HomeAssistant, MaintenanceTask, StatisticsPoint } from "../types";

const MIN = 60_000;
const H = 60 * MIN;
const DAY = 24 * H;

const RULE: AlertRule = alertRule({ type: "state_change", trigger_from_state: "off", trigger_to_state: "on", trigger_target_changes: 1 })!;
const st = (at: number, s: string): RecordedState => ({ s, lu: at / 1000 });
const iso = (ms: number): string => new Date(ms).toISOString();
const ev = (at: number, kind: string, extra: Record<string, unknown> = {}) => ({ at: iso(at), kind, ...extra });

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

    // The first lanes are the overview; the magnifier's come after them. The
    // result first ("one is enough"), then the routers that reported.
    const overview = root.querySelector(".tl-lanes")!;
    expect([...overview.querySelectorAll(".tl-name")].map((n) => n.textContent!.trim()).filter(Boolean)).to.deep.equal([
      "Result: one is enough",
      "Router Wohnzimmer",
      "Router Arbeitszimmer",
    ]);
    expect(root.querySelector(".tl-quiet")!.textContent).to.contain("7 more");

    const marks = [...overview.querySelectorAll<HTMLElement>(".tl-mark")];
    expect(marks.length, "the routers' alerts and the result's").to.be.at.least(3);
    for (const m of marks) expect(m.getBoundingClientRect().width, "an alert is never a hairline").to.be.at.least(7.5);
    // Without a record the result is the routers combined: a reboot inside
    // an alert keeps it (the backend's latch clears on a real state only).
    const resultMarks = overview.querySelector(".tl-track.result")!.querySelectorAll(".tl-mark");
    expect(resultMarks).to.have.length(2);

    const zoom = root.querySelector(".tl-zoom")!;
    expect(zoom, "the magnifier").to.exist;
    expect(zoom.querySelectorAll(".tl-seg.gone").length, "the reboots").to.be.at.least(2);
    expect(zoom.querySelectorAll(".tl-tick"), "the automatic completion, on the result").to.have.length(1);
    expect(zoom.querySelector(".tl-track.result .tl-tick")).to.exist;
    expect(zoom.querySelectorAll(".tl-track.entity .tl-band").length, "the result across the routers").to.be.at.least(2);
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

describe("state timeline — the task's own record before the recorder's days", () => {

  it("reads the trace's triggered periods, names the sensor where the record says it, and cuts at the recorder", () => {
    const now = Date.now();
    const before = now - 10 * DAY;
    const events = [
      ev(now - 11 * DAY, "status", { from: "ok", to: "triggered" }),
      ev(now - 11 * DAY + 5 * H, "status", { from: "triggered", to: "ok" }),
      ev(now - 10.5 * DAY, "status", { from: "ok", to: "triggered" }),
      ev(now - 10.5 * DAY + 3 * MIN, "status", { from: "triggered", to: "ok" }),
      ev(now - 10.5 * DAY + 3 * MIN + 1_000, "trigger_cleared", { entity: A }),
      ev(now - 10.1 * DAY, "status", { from: "ok", to: "triggered" }),
    ];
    const history = [
      { timestamp: iso(now - 10.1 * DAY + 500), type: "triggered", trigger_change: { entity: B, to: "on" } },
    ] as HistoryEntry[];
    const eps = ownEpisodes(events, history, before);
    expect(eps.map((e) => e.entityId)).to.deep.equal(["", A, B]);
    expect(eps.every((e) => e.own)).to.equal(true);
    expect(eps[0].end).to.equal(now - 11 * DAY + 5 * H);
    expect(eps[2].end, "still going where the recorder begins: cut there").to.equal(before);
  });

  it("takes the history's firings from before the trace, with the next completion as the end or none", () => {
    const now = Date.now();
    const history = [
      { timestamp: iso(now - 80 * DAY), type: "triggered" },
      { timestamp: iso(now - 79 * DAY), type: "completed" },
      { timestamp: iso(now - 50 * DAY), type: "triggered", trigger_change: { entity: A } },
    ] as HistoryEntry[];
    const eps = ownEpisodes([ev(now - 20 * DAY, "status", { from: "ok", to: "due_soon" })], history, now - 10 * DAY);
    expect(eps).to.have.length(2);
    expect(eps[0]).to.deep.include({ end: now - 79 * DAY, entityId: "" });
    expect(eps[1]).to.deep.include({ entityId: A, endUnknown: true, end: now - 50 * DAY });
  });

  it("switches off a range chip that would show nothing a shorter one does not", () => {
    const now = Date.now();
    const chips = [7, 30, 90, 365];
    expect(rangeAddsNothing(90, chips, now - 10 * DAY, now), "30 days reach back to the data").to.equal(true);
    expect(rangeAddsNothing(30, chips, now - 10 * DAY, now), "7 days do not").to.equal(false);
    expect(rangeAddsNothing(365, chips, now - 60 * DAY, now)).to.equal(true);
    expect(rangeAddsNothing(90, chips, now - 60 * DAY, now)).to.equal(false);
    expect(rangeAddsNothing(365, chips, null, now), "not known: every chip counts").to.equal(false);
  });

  it("draws an older alert from the task's own record with the recorder's border, and a year adds nothing", async () => {
    const now = Date.now();
    const sent: Record<string, unknown>[] = [];
    const hassWithTrace = {
      language: "en",
      states: {},
      connection: {
        sendMessagePromise: async (msg: Record<string, unknown>) => {
          sent.push(msg);
          if (msg.type === "maintenance_supporter/task/trace") {
            return {
              events: [ev(now - 40 * DAY, "status", { from: "ok", to: "triggered" }), ev(now - 40 * DAY + 5 * H, "status", { from: "triggered", to: "ok" })],
              history: [{ timestamp: iso(now - 40 * DAY), type: "triggered" }],
              created_at: iso(now - 60 * DAY).slice(0, 10),
            };
          }
          return rows(now);
        },
      },
    } as unknown as HomeAssistant;
    const el = await fixture<MaintenanceStateTimeline>(html`<maintenance-state-timeline style="width: 800px"
      .hass=${hassWithTrace} .entityIds=${[A, B, ...QUIET]} .rule=${RULE} .rangeDays=${90} .lang=${"en"}
      .entryId=${"e1"} .taskId=${"t1"}></maintenance-state-timeline>`);
    const root = el.shadowRoot!;
    await waitUntil(() => root.querySelector(".tl-last"), "the states and the record arrive");
    expect(sent.map((m) => m.type)).to.include("maintenance_supporter/task/trace");
    const overview = root.querySelectorAll(".tl-lanes")[0];
    expect(overview.querySelector(".tl-name.result")!.textContent!.trim()).to.equal("Result: one is enough");
    // The older alert is the result's (which router is not recorded); the
    // routers have no states before the recorder.
    const older = [...overview.querySelectorAll<HTMLElement>(".tl-track.result .tl-mark")].filter((m) => m.title.includes(" – "));
    expect(older.length, "the alert from the task's own record").to.be.at.least(1);
    expect(overview.querySelectorAll(".tl-track.entity .tl-seg.nodata").length, "no data before the recorder").to.be.at.least(2);
    expect(root.querySelector(".tl-legend")!.textContent).to.contain("no data");
    expect(overview.querySelectorAll(".tl-boundary").length, "the recorder's border").to.be.at.least(1);
    expect(root.querySelector(".tl-before")!.textContent).to.contain("from the task's own record");
    const chip = (label: string) => [...root.querySelectorAll<HTMLButtonElement>(".range-chip")].find((c) => c.textContent!.trim() === label)!;
    expect(chip("90d").disabled).to.equal(false);
    expect(chip("1y").disabled, "the task began 60 days ago").to.equal(true);
    expect(chip("1y").title).to.contain("No data before");
  });
});

describe("a state rule's sensor rows draw no small trend", () => {
  it("only rules on readings do", () => {
    expect(hasTrend({ type: "state_change" })).to.equal(false);
    expect(hasTrend({ type: "runtime" }), "on/off").to.equal(false);
    expect(hasTrend({ type: "threshold", trigger_equals: 3 }), "a code").to.equal(false);
    expect(hasTrend({ type: "threshold", trigger_above: 8 })).to.equal(true);
    expect(hasTrend({ type: "counter" })).to.equal(true);
    expect(hasTrend({})).to.equal(true);
  });

  it("the panel loads no series where the chart loads its own", () => {
    expect(drawsItself({ type: "state_change", trigger_to_state: "on" })).to.equal(true);
    expect(drawsItself({ type: "threshold", trigger_not_equals: 0 })).to.equal(true);
    expect(drawsItself({ type: "compound", conditions: [] })).to.equal(true);
    expect(drawsItself({ type: "runtime", entity_id: "switch.pump" })).to.equal(true);
    expect(drawsItself({ type: "runtime", entity_id: "climate.x", attribute: "hvac_action" }), "an attribute is not in the states").to.equal(false);
    expect(drawsItself({ type: "threshold", trigger_above: 8 })).to.equal(false);
  });
});

describe("a threshold on a code, and an AND/OR rule's conditions", () => {
  it("draws a code as states and a reading as its line", () => {
    expect(isDiscreteThreshold({ type: "threshold", trigger_equals: 3 })).to.equal(true);
    expect(isDiscreteThreshold({ type: "threshold", trigger_equals: 3, trigger_above: 10 })).to.equal(false);
    expect(alertRule({ type: "threshold", trigger_not_equals: 0 })).to.deep.include({ kind: "number", notEquals: 0 });
    expect(alertRule({ type: "threshold", trigger_above: 8 }), "a reading keeps its line").to.equal(null);
    expect(alertRule({ type: "threshold", trigger_equals: 3, attribute: "code" }), "an attribute is not loaded").to.equal(null);
  });

  it("answers a code like the backend: equal within a hair, a word is not known", () => {
    const code = alertRule({ type: "threshold", trigger_equals: 3 })!;
    expect(isAlert("3", code)).to.equal(true);
    expect(isAlert("3.0000000001", code)).to.equal(true);
    expect(isAlert("4", code)).to.equal(false);
    expect(isAlert("idle", code)).to.equal(null);
    expect(isAlert("unavailable", code)).to.equal(null);
    const fine = alertRule({ type: "threshold", trigger_not_equals: 0 })!;
    expect(isAlert("0", fine)).to.equal(false);
    expect(isAlert("7", fine)).to.equal(true);
  });

  it("draws a fault code's alert with the outage inside it, and names only what can be seen", async () => {
    const now = Date.now();
    const CODE = "sensor.washer_error";
    const fake = {
      language: "en",
      states: {},
      connection: {
        sendMessagePromise: async () => ({
          [CODE]: [st(now - 10 * MIN, "0"), st(now - 6 * MIN, "3"), st(now - 5 * MIN, "unavailable"), st(now - 4 * MIN, "3"), st(now - 3 * MIN, "0")],
        }),
      },
    } as unknown as HomeAssistant;
    const el = await fixture<MaintenanceStateTimeline>(html`<maintenance-state-timeline style="width: 800px"
      .hass=${fake} .entityIds=${[CODE]} .rule=${alertRule({ type: "threshold", trigger_equals: 3 })} .rangeDays=${7} .lang=${"en"}></maintenance-state-timeline>`);
    const root = el.shadowRoot!;
    await waitUntil(() => root.querySelector(".tl-last"), "the states arrive");
    expect(root.querySelector(".tl-last")!.textContent).to.contain("OK again after 3 minutes");
    expect(root.querySelectorAll(".tl-mark"), "one alert, the outage inside it").to.have.length(1);
    expect(root.querySelector(".tl-legend")!.textContent, "the outage is under the mark").not.to.contain("unreachable");
  });

  it("gives a condition its rule when it has a course: a threshold or a latch, not a count", () => {
    expect(conditionRule({ type: "threshold", trigger_above: 8 })).to.deep.include({ kind: "number", above: 8 });
    expect(conditionRule({ type: "state_change", trigger_to_state: "on" })).to.deep.include({ kind: "state", to: "on" });
    expect(conditionRule({ type: "counter", trigger_target_value: 100 })).to.equal(null);
    expect(conditionRule({ type: "runtime", trigger_runtime_hours: 500 })).to.equal(null);
    expect(conditionRule({ type: "state_change", trigger_to_state: "on", trigger_target_changes: 5 })).to.equal(null);
  });

  it("combines lines: one or all, an unreachable sensor keeping its last state", () => {
    const seg = (start: number, end: number, kind: "alarm" | "ok" | "gone" | "nodata") => ({ start, end, kind });
    const a = [seg(0, 10, "ok"), seg(10, 20, "alarm"), seg(20, 30, "gone"), seg(30, 40, "ok")];
    const b = [seg(0, 15, "ok"), seg(15, 35, "alarm"), seg(35, 40, "ok")];
    expect(combineSegments([a, b], "any", 0, 40)).to.deep.equal([seg(0, 10, "ok"), seg(10, 35, "alarm"), seg(35, 40, "ok")]);
    expect(combineSegments([a, b], "all", 0, 40), "a's outage keeps its alert").to.deep.equal([seg(0, 15, "ok"), seg(15, 30, "alarm"), seg(30, 40, "ok")]);
    expect(combineSegments([[seg(0, 40, "nodata")], [seg(0, 40, "nodata")]], "all", 0, 40)).to.deep.equal([seg(0, 40, "nodata")]);
  });

  it("shows the result on top and each condition under it, a condition's sensors indented, a count said in words", async () => {
    const now = Date.now();
    const TEMP = "sensor.freezer_temp", TEMP2 = "sensor.fridge_temp", DOOR = "binary_sensor.freezer_door";
    const start = now - 5 * DAY;
    const STATUS = "sensor.freezer_check";
    const answer = {
      [TEMP]: [st(start, "-18"), st(now - 60 * MIN, "-5"), st(now - 30 * MIN, "-18")],
      [TEMP2]: [st(start, "4"), st(now - 50 * MIN, "9"), st(now - 35 * MIN, "4")],
      [DOOR]: [st(start, "off"), st(now - 55 * MIN, "on"), st(now - 40 * MIN, "off")],
      // The task's status sensor: the result where the recorder has it.
      [STATUS]: [st(start, "ok"), st(now - 50 * MIN, "triggered"), st(now - 40 * MIN, "ok")],
    };
    // The trace is off (no events): the history alone does not say when an
    // alert ended, the status sensor does.
    const record = {
      events: [],
      history: [{ timestamp: iso(now - 50 * MIN), type: "triggered" }],
      created_at: iso(start).slice(0, 10),
    };
    const fake = {
      language: "en",
      states: { [TEMP]: { attributes: { friendly_name: "Freezer", unit_of_measurement: "°C" } }, [DOOR]: { attributes: { friendly_name: "Freezer door" } } },
      connection: { sendMessagePromise: async (msg: Record<string, unknown>) => (msg.type === "maintenance_supporter/task/trace" ? record : answer) },
    } as unknown as HomeAssistant;
    const conditions = [
      { label: "Freezer, Fridge: above -10 °C", entityIds: [TEMP, TEMP2], logic: "any" as const, rule: conditionRule({ type: "threshold", trigger_above: -10 }) },
      { label: "Freezer door: changes to on", entityIds: [DOOR], logic: "any" as const, rule: conditionRule({ type: "state_change", trigger_to_state: "on" }) },
      { label: "Compressor: 500 h", entityIds: ["switch.compressor"], logic: "any" as const, rule: null },
    ];
    const el = await fixture<MaintenanceStateTimeline>(html`<maintenance-state-timeline style="width: 800px"
      .hass=${fake} .conditions=${conditions} .compoundLogic=${"AND"} .rangeDays=${7} .lang=${"en"}
      .resultEntity=${STATUS} .entryId=${"e1"} .taskId=${"t1"}></maintenance-state-timeline>`);
    const root = el.shadowRoot!;
    await waitUntil(() => root.querySelector(".tl-last"), "the states and the record arrive");
    const overview = root.querySelectorAll(".tl-lanes")[0];
    const names = [...overview.querySelectorAll(".tl-name")].map((n) => `${n.classList.contains("result") ? "R" : n.classList.contains("sub") ? "  " : ""}${n.textContent!.trim()}`).filter((s) => s.trim());
    expect(names).to.deep.equal([
      "RResult: all are needed",
      "Freezer, Fridge: above -10 °C",
      "  Freezer",
      "  sensor.fridge_temp",
      "Freezer door: changes to on",
      "Compressor: 500 h",
    ]);
    expect(overview.querySelector(".tl-nocourse")!.textContent).to.contain("counts up until the service");
    expect(root.querySelector(".tl-last")!.textContent, "the result's alert in words").to.contain("OK again after 10 minutes");
    // The magnifier: every condition with the result's band across it.
    const zoom = root.querySelector(".tl-zoom")!;
    expect(zoom, "ten minutes on seven days").to.exist;
    expect(zoom.querySelectorAll(".tl-track.condition .tl-band").length, "the result across the conditions").to.be.at.least(2);
    expect(zoom.querySelectorAll(".tl-track.sub").length, "a condition's sensors under it").to.equal(2);
    expect(zoom.querySelector(".tl-track.result")).to.exist;
  });
});

describe("a runtime rule: hours per day", () => {
  const H6 = 6 * H;
  it("books a run until the next state that is not running; unavailable pauses; a cap counts from the run's start", () => {
    const rows = [st(0, "off"), st(H, "on"), st(3 * H, "off"), st(4 * H, "ON"), st(5 * H, "unavailable"), st(H6, "on")];
    expect(runtimeIntervals(rows, null, 0, 8 * H, null)).to.deep.equal([[H, 3 * H], [4 * H, 5 * H], [H6, 8 * H]]);
    expect(runtimeIntervals(rows, null, 0, 8 * H, 30 * MIN)).to.deep.equal([[H, H + 30 * MIN], [4 * H, 4 * H + 30 * MIN], [H6, H6 + 30 * MIN]]);
    expect(runtimeIntervals([st(0, "heating"), st(H, "idle")], ["heating"], 0, 2 * H, null), "the rule's own states").to.deep.equal([[0, H]]);
  });

  it("sums the hours per day and says when the target comes at that pace", () => {
    const day0 = stampMs("2026-11-10");
    const day1 = stampMs("2026-11-11");
    const buckets = hoursPerBucket([[day0 + H, day0 + 3 * H], [day1 - H, day1 + H]], day0, stampMs("2026-11-12"));
    expect(buckets.map((b) => [b.day, b.hours])).to.deep.equal([["2026-11-10", 3], ["2026-11-11", 1]]);
    expect(untilTarget(100, 110, 2)).to.equal(5 * DAY);
    expect(untilTarget(120, 110, 2), "reached").to.equal(null);
    expect(untilTarget(100, 110, 0), "nothing ran").to.equal(null);
  });

  it("draws the days as bars with the mean and the time to the target", async () => {
    const now = Date.now();
    const PUMP = "switch.pump";
    const fake = {
      language: "en",
      states: {},
      connection: {
        sendMessagePromise: async () => ({ [PUMP]: [st(now - 3 * DAY, "off"), st(now - 2 * DAY, "on"), st(now - 2 * DAY + 2 * H, "off"), st(now - DAY, "on"), st(now - DAY + 4 * H, "off")] }),
      },
    } as unknown as HomeAssistant;
    const el = await fixture<MaintenanceRuntimeBars>(html`<maintenance-runtime-bars style="width: 600px"
      .hass=${fake} .entityId=${PUMP} .rangeDays=${30} .lang=${"en"} .current=${10} .target=${16}></maintenance-runtime-bars>`);
    const root = el.shadowRoot!;
    await waitUntil(() => root.querySelector(".rb-bars"), "the states arrive");
    expect(root.querySelectorAll(".rb-col").length, "the days of the recorder").to.be.within(3, 5);
    expect(root.querySelector(".rb-foot")!.textContent).to.contain("per day");
    expect(root.querySelector(".rb-foot")!.textContent, "6 h to go at 2 h a day").to.contain("about 3 days to the target");
    const chip = (label: string) => [...root.querySelectorAll<HTMLButtonElement>(".range-chip")].find((c) => c.textContent!.trim() === label)!;
    expect(chip("90d").disabled, "the recorder has three days").to.equal(true);
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
