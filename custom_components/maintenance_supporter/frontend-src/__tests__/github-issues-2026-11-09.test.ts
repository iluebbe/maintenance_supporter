/**
 * GitHub issues reported 2026-11-09.
 *
 * #258: the cards of a dashboard share one objects subscription (2.120), and
 * after a restart of Home Assistant it was gone: the websocket library's own
 * resubscribe failed while the integration was still loading, and an
 * always-on dashboard kept its list, a task that fell overdue never showed.
 * The subscription now subscribes again itself on every reconnect and tries
 * again until it gets through; the panel's does the same.
 *
 * #260: a task that needs its trigger AND its interval is due at the later of
 * the two (the backend publishes that date). The detail bar runs from the last
 * time to that date: measured against one interval, a forecast beyond it read
 * as an empty bar, and the old interval date as a full one.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import { renderDaysProgress } from "../renderers/progress.js";
import { daysProgress } from "../helpers/interval";
import { RETRY_MS, subscribeAcrossReconnects } from "../helpers/live-subscription";
import { firstObjects } from "../helpers/objects-hub";
import { createMockHass } from "./_test-utils.js";
import { mountPanel } from "./_panel-utils.js";
import type { MaintenanceTask } from "../types";

function isoDay(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function task(overrides: Partial<MaintenanceTask>): MaintenanceTask {
  return {
    id: "t1",
    name: "Refill salt",
    status: "ok",
    schedule_type: "sensor_based",
    interval_days: 335,
    interval_unit: "days",
    last_performed: isoDay(-365),
    next_due: isoDay(400),
    days_until_due: 400,
    trigger_config: { type: "threshold", entity_id: "sensor.salt", trigger_below: 10, trigger_combinator: "all" },
    ...overrides,
  } as unknown as MaintenanceTask;
}

async function barValue(t: MaintenanceTask): Promise<number | null> {
  const el = await fixture(html`<div>${renderDaysProgress(t, "en")}</div>`);
  const bar = el.querySelector(".days-progress-bar");
  return bar ? Number(bar.getAttribute("aria-valuenow")) : null;
}

describe("#260 the detail bar of a task that needs both legs", () => {
  it("runs from the last time to the published date", async () => {
    expect(await barValue(task({}))).to.equal(48); // 365 of 765 days
  });

  it("an interval-only task keeps measuring one interval", async () => {
    const plain = task({ trigger_config: { type: "threshold", entity_id: "sensor.salt", trigger_below: 10 } as MaintenanceTask["trigger_config"] });
    expect(await barValue(plain)).to.equal(0);
  });

  it("no date, no bar", async () => {
    expect(await barValue(task({ next_due: null, days_until_due: null }))).to.equal(null);
  });

  it("daysProgress takes an explicit span", () => {
    expect(daysProgress(335, 400, "days", 765).pct).to.be.closeTo(47.7, 0.1);
    expect(daysProgress(335, 400, "days", Number.NaN).pct).to.equal(0);
  });
});

// ─── #258: a subscription that outlasts a restart ────────────────────────────

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

type Event = "ready" | "disconnected";

/** A connection that reports its reconnects, as Home Assistant's does. */
function reconnecting() {
  const on: Record<Event, Array<() => void>> = { ready: [], disconnected: [] };
  const attempts: Array<{ options?: Record<string, unknown>; answer: ReturnType<typeof deferred<() => void>> }> = [];
  const connection = {
    subscribeMessage: (_cb: (e: unknown) => void, _msg: Record<string, unknown>, options?: Record<string, unknown>) => {
      const answer = deferred<() => void>();
      attempts.push({ options, answer });
      return answer.promise;
    },
    addEventListener: (event: Event, cb: () => void) => { on[event].push(cb); },
    removeEventListener: (event: Event, cb: () => void) => { on[event] = on[event].filter((x) => x !== cb); },
  };
  return { connection, attempts, on, fire: (event: Event) => [...on[event]].forEach((cb) => cb()) };
}

/** Hold the retry timers: the test runs them by hand. */
function holdRetries() {
  const held: Array<{ fn: () => void; ms: number }> = [];
  const real = window.setTimeout;
  window.setTimeout = ((fn: () => void, ms?: number, ...rest: unknown[]) => {
    if (ms !== undefined && RETRY_MS.includes(ms)) { held.push({ fn, ms }); return 434343; }
    return real(fn, ms, ...rest);
  }) as typeof window.setTimeout;
  return { held, restore: () => { window.setTimeout = real; } };
}

describe("#258 a subscription that outlasts a restart", () => {
  let retries: ReturnType<typeof holdRetries>;
  beforeEach(() => { retries = holdRetries(); });
  afterEach(() => retries.restore());

  it("subscribes again after a reconnect, and never ends the old one on the new socket", async () => {
    const { connection, attempts, on, fire } = reconnecting();
    let endedOld = 0;
    let endedNew = 0;
    const live = subscribeAcrossReconnects(connection, () => undefined, { type: "x/subscribe" });
    expect(attempts[0].options).to.deep.equal({ resubscribe: false }, "the library must not resubscribe on its own");
    attempts[0].answer.resolve(() => { endedOld += 1; });
    await tick();
    fire("disconnected");
    fire("ready");
    expect(attempts).to.have.length(2);
    attempts[1].answer.resolve(() => { endedNew += 1; });
    await tick();
    live.close();
    expect([endedOld, endedNew]).to.deep.equal([0, 1]);
    expect(on.ready.length + on.disconnected.length, "stops following the connection").to.equal(0);
  });

  it("an attempt that fails while the integration loads is tried again until it gets through", async () => {
    const { connection, attempts, fire } = reconnecting();
    subscribeAcrossReconnects(connection, () => undefined, { type: "x/subscribe" });
    attempts[0].answer.resolve(() => undefined);
    await tick();
    fire("disconnected");
    fire("ready");
    attempts[1].answer.reject(new Error("Unknown command"));
    await tick();
    expect(retries.held.map((r) => r.ms)).to.deep.equal([RETRY_MS[0]]);
    retries.held.shift()!.fn();
    attempts[2].answer.reject(new Error("Unknown command"));
    await tick();
    expect(retries.held.map((r) => r.ms)).to.deep.equal([RETRY_MS[1]]);
    retries.held.shift()!.fn();
    attempts[3].answer.resolve(() => undefined);
    await tick();
    expect(attempts).to.have.length(4);
    expect(retries.held, "through: nothing more to try").to.have.length(0);
  });

  it("closed while it is set up, it ends once it is", async () => {
    const { connection, attempts } = reconnecting();
    let ended = 0;
    const live = subscribeAcrossReconnects(connection, () => undefined, { type: "x/subscribe" });
    live.close();
    attempts[0].answer.resolve(() => { ended += 1; });
    await tick();
    expect(ended).to.equal(1);
  });

  it("the task card shows a task that fell overdue after Home Assistant restarted", async () => {
    const task = (status: string, days: number) => ({
      id: "t1", name: status === "overdue" ? "Clean the filter (overdue)" : "Clean the filter", type: "cleaning",
      schedule_type: "time_based", interval_days: 30, warning_days: 7, status, days_until_due: days, history: [], enabled: true,
    });
    const objects = (status: string, days: number) => [{ entry_id: "e258", object: { id: "o258", name: "Pump" }, tasks: [task(status, days)] }];
    const { hass, sent, subscriptions, fire } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({ objects: objects("due_soon", 1) }),
        "maintenance_supporter/statistics": () => ({}),
      },
    });

    const host = await fixture<HTMLElement>(html`<div></div>`);
    const card = host.appendChild(document.createElement("maintenance-supporter-card")) as HTMLElement & {
      hass: unknown; setConfig(c: Record<string, unknown>): void; updateComplete: Promise<unknown>;
    };
    card.setConfig({ type: "custom:maintenance-supporter-card" });
    card.hass = { ...hass, states: {}, user: { id: "u1", is_admin: true } };
    await waitUntil(() => card.shadowRoot!.textContent!.includes("Clean the filter"), "drawn");
    const subs = () => subscriptions.filter((x) => x.msg.type === "maintenance_supporter/subscribe");
    await waitUntil(() => subs().length === 1, "subscribed");
    subs()[0].push({ objects: objects("due_soon", 1) }); // the snapshot every subscription starts with

    // Home Assistant restarts: the socket closes and comes back.
    fire("disconnected");
    sent.length = 0;
    // Long after the first load, which a card's first load no longer shares.
    delete (window as unknown as Record<string, unknown>).__msObjectsFetch;
    await firstObjects(hass as never);
    expect(sent.map((m) => m.type), "a card built now fetches, not the old list").to.include("maintenance_supporter/objects");
    fire("ready");
    await waitUntil(() => subs().length === 2, "subscribed again");
    expect(subs()[1].options).to.deep.equal({ resubscribe: false });
    subs()[1].push({ objects: objects("overdue", -1) });
    await waitUntil(() => card.shadowRoot!.textContent!.includes("Clean the filter (overdue)"), "the overdue task shows");
    card.remove();
  });

  it("the panel subscribes again after a reconnect too", async () => {
    const { el, subscriptions, fire } = await mountPanel([]);
    const subs = () => subscriptions.filter((x) => x.msg.type === "maintenance_supporter/subscribe");
    expect(subs()).to.have.length(1);
    fire("disconnected");
    fire("ready");
    await waitUntil(() => subs().length === 2, "subscribed again");
    expect(subs()[1].options).to.deep.equal({ resubscribe: false });
    el.remove();
  });
});
