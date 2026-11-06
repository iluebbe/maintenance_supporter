/**
 * Perf 2026-11-06, a dashboard load timed request by request on a home of
 * 36 objects and 163 tasks:
 *
 *   - the strategy loaded the language, then the objects, then the counts,
 *     one after the other; they load at once now;
 *   - the card on the strategy's view asked for the counts again before it
 *     drew; it takes the strategy's answer (helpers/objects-fetch);
 *   - the task card and the calendar card subscribed each, and a view switch
 *     subscribed anew; the cards on a page share one subscription that stays
 *     a while after the last one left (helpers/objects-hub);
 *   - the names for the assignee badges were asked a round trip after the
 *     rows; they go out with the first requests;
 *   - every card's settings read made the server scan the whole home for
 *     what only the Settings page shows; the cards ask `lite`.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import "../maintenance-calendar-card.js";
import { MaintenanceDashboardStrategy } from "../maintenance-dashboard-strategy";
import { fetchObjects, fetchStatistics } from "../helpers/objects-fetch";
import { firstObjects, LINGER_MS, watchObjects } from "../helpers/objects-hub";
import { fetchSettingsOnce } from "../helpers/settings-cache";
import { createMockHass } from "./_test-utils.js";

type Msg = Record<string, unknown> & { type: string };
type Card = HTMLElement & { hass: Record<string, unknown>; updateComplete: Promise<unknown>; setConfig?: (c: Record<string, unknown>) => void };

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

function isoInDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const p = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const TASK = (id: string, name: string, extra: Record<string, unknown> = {}) => ({
  id, name, type: "cleaning", schedule_type: "time_based", interval_days: 30, warning_days: 7,
  status: "due_soon", days_until_due: 3, next_due: isoInDays(3), history: [], enabled: true, ...extra,
});
const objects = (name = "Clean the filter", extra: Record<string, unknown> = {}) =>
  [{ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [TASK("t1", name, extra)] }];

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

/** Run the hub's linger timers by hand: the test does not wait 15 s. */
function holdLingers() {
  const held: Array<() => void> = [];
  const real = window.setTimeout;
  window.setTimeout = ((fn: () => void, ms?: number, ...rest: unknown[]) => {
    if (ms === LINGER_MS) { held.push(fn); return 424242; }
    return real(fn, ms, ...rest);
  }) as typeof window.setTimeout;
  return { held, restore: () => { window.setTimeout = real; } };
}

function forgetShares(): void {
  const w = window as unknown as Record<string, unknown>;
  delete w.__msObjectsFetch;
  delete w.__msStatisticsFetch;
  delete w.__msSettingsCache;
}

async function mountCard(tag: string, type: string, hass: Record<string, unknown>, parent?: HTMLElement): Promise<Card> {
  const host = parent ?? (await fixture(html`<div></div>`));
  const el = host.appendChild(document.createElement(tag)) as Card;
  el.setConfig?.({ type });
  el.hass = { ...hass, states: {}, user: { id: "u1", is_admin: true } };
  await el.updateComplete;
  return el;
}

const sentTypes = (sent: Msg[]) => sent.map((m) => m.type.replace("maintenance_supporter/", ""));

describe("perf 2026-11-06: the strategy loads at once", () => {
  beforeEach(forgetShares);

  it("asks for the objects and the counts while the language still loads", async () => {
    const realFetch = window.fetch;
    const locale = deferred<Response>();
    window.fetch = ((url: string, init?: RequestInit) =>
      String(url).includes("/maintenance_supporter_locales/") ? locale.promise : realFetch(url, init)) as typeof window.fetch;
    try {
      const sent: Msg[] = [];
      const hass = {
        language: "fi", config: {}, areas: {}, floors: {},
        connection: {
          sendMessagePromise: async (msg: Msg) => {
            sent.push(msg);
            if (msg.type === "maintenance_supporter/objects") return { objects: objects() };
            return { summary_entity_ids: { overdue: "sensor.x_overdue" }, overdue: 4 };
          },
        },
      };
      const generated = MaintenanceDashboardStrategy.generate({ type: "custom:maintenance-supporter" } as never, hass as never);
      await tick();
      expect(sentTypes(sent)).to.include.members(["objects", "statistics"]);
      locale.resolve(new Response("{}", { status: 404 }));
      const dash = (await generated) as { views: Array<{ cards?: unknown[] }> };
      expect(dash.views.length).to.be.greaterThan(1);
      expect(JSON.stringify(dash.views[0]), "the counts reached the overview").to.include("sensor.x_overdue");
      expect(sentTypes(sent).filter((t) => t === "statistics")).to.have.length(1);
    } finally {
      window.fetch = realFetch;
    }
  });

  it("a failed count still builds the dashboard, a failed object list says so", async () => {
    const hass = (fail: string) => ({
      language: "en", config: {}, areas: {}, floors: {},
      connection: {
        sendMessagePromise: async (msg: Msg) => {
          if (msg.type === `maintenance_supporter/${fail}`) throw new Error("offline");
          return { objects: objects() };
        },
      },
    });
    const withoutCounts = (await MaintenanceDashboardStrategy.generate({} as never, hass("statistics") as never)) as { views: unknown[] };
    expect(withoutCounts.views.length).to.be.greaterThan(1);
    forgetShares();
    const withoutObjects = (await MaintenanceDashboardStrategy.generate({} as never, hass("objects") as never)) as { views: unknown[] };
    expect(JSON.stringify(withoutObjects.views)).to.include("markdown");
  });

  it("the card on its view asks for neither the objects nor the counts", async () => {
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({ objects: objects() }),
        "maintenance_supporter/statistics": () => ({ total_tasks: 1 }),
      },
    });
    // What generate() asked a moment ago.
    await Promise.all([fetchObjects(hass as never, { first: true }), fetchStatistics(hass as never, { first: true })]);
    sent.length = 0;
    const el = await mountCard("maintenance-supporter-card", "custom:maintenance-supporter-card", hass);
    await waitUntil(() => el.shadowRoot!.textContent!.includes("Clean the filter"), "drawn from the strategy's answers");
    expect(sentTypes(sent as Msg[])).to.not.include("objects");
    expect(sentTypes(sent as Msg[])).to.not.include("statistics");
  });
});

describe("perf 2026-11-06: one objects subscription per page", () => {
  let lingers: ReturnType<typeof holdLingers>;
  beforeEach(() => { forgetShares(); lingers = holdLingers(); });
  afterEach(() => lingers.restore());

  const page = () => createMockHass({
    handlers: {
      "maintenance_supporter/objects": () => ({ objects: objects() }),
      "maintenance_supporter/statistics": () => ({}),
    },
  });
  const subs = (s: Array<{ msg: Msg; push: (e: unknown) => void }>) => s.filter((x) => x.msg.type === "maintenance_supporter/subscribe");

  it("the task card and the calendar card share it, and each draws its events", async () => {
    const { hass, sent, subscriptions } = page();
    const host = await fixture<HTMLElement>(html`<div></div>`);
    const card = await mountCard("maintenance-supporter-card", "custom:maintenance-supporter-card", hass, host);
    const cal = await mountCard("maintenance-supporter-calendar-card", "custom:maintenance-supporter-calendar-card", hass, host);
    await waitUntil(() => card.shadowRoot!.textContent!.includes("Clean the filter") && cal.shadowRoot!.textContent!.includes("Clean the filter"), "both drawn");
    expect(subs(subscriptions as never)).to.have.length(1);
    expect(subs(subscriptions as never)[0].msg).to.include({ deltas: true, compact: true });
    expect(sentTypes(sent as Msg[]).filter((t) => t === "objects"), "one shared first load").to.have.length(1);
    expect(sentTypes(sent as Msg[]).filter((t) => t === "statistics"), "one shared count").to.have.length(1);
    subs(subscriptions as never)[0].push({ delta: [{ ...objects("Rinse the filter")[0], tasks: [{ ...TASK("t1", "Rinse the filter"), history: undefined }] }], removed: [] });
    await waitUntil(() => card.shadowRoot!.textContent!.includes("Rinse the filter") && cal.shadowRoot!.textContent!.includes("Rinse the filter"), "the delta reached both");
  });

  it("the next view's card finds it and its list, and it ends a while after the last card", async () => {
    const { hass, sent, subscriptions } = page();
    const first = await mountCard("maintenance-supporter-card", "custom:maintenance-supporter-card", hass);
    await waitUntil(() => subs(subscriptions as never).length === 1, "subscribed");
    subs(subscriptions as never)[0].push({ objects: objects("Descale the pump") });
    await waitUntil(() => first.shadowRoot!.textContent!.includes("Descale the pump"), "the snapshot is drawn");
    first.remove();
    expect(subs(subscriptions as never), "kept for the next view").to.have.length(1);
    sent.length = 0;
    const next = await mountCard("maintenance-supporter-card", "custom:maintenance-supporter-card", hass);
    await waitUntil(() => next.shadowRoot!.textContent!.includes("Descale the pump"), "drawn from the subscription's list");
    expect(subs(subscriptions as never)).to.have.length(1);
    expect(sentTypes(sent as Msg[])).to.not.include("objects");
    // A linger that comes due while a card watches ends nothing.
    lingers.held.splice(0).forEach((run) => run());
    expect(subs(subscriptions as never)).to.have.length(1);
    next.remove();
    expect(lingers.held).to.have.length(1);
    lingers.held[0]();
    await tick();
    expect(subs(subscriptions as never), "ended after the last card").to.have.length(0);
  });

  it("a card gone before the subscription was set up leaves none behind (FE-7)", async () => {
    const pending = deferred<() => void>();
    let ended = 0;
    const connection = {
      sendMessagePromise: async <T,>() => ({}) as T,
      subscribeMessage: () => pending.promise,
    };
    const release = watchObjects(connection, () => undefined);
    release();
    release(); // twice is once
    expect(lingers.held).to.have.length(1);
    lingers.held[0]();
    pending.resolve(() => { ended += 1; });
    await tick();
    expect(ended).to.equal(1);
  });

  it("a failed subscription is not kept, and a change before the snapshot is no list", async () => {
    let attempts = 0;
    const live: { push?: (e: unknown) => void } = {};
    const connection = {
      sendMessagePromise: async <T,>() => ({ objects: objects("Fetched") }) as T,
      subscribeMessage: async (cb: (e: unknown) => void) => {
        attempts += 1;
        if (attempts === 1) throw new Error("offline");
        live.push = cb;
        return () => undefined;
      },
    };
    watchObjects(connection, () => undefined);
    await tick();
    watchObjects(connection, () => undefined);
    await tick();
    expect(attempts, "asked again").to.equal(2);
    live.push!({ delta: objects("Only a delta"), removed: [] });
    expect((await firstObjects({ connection }))[0].tasks[0].name, "fetched, not the lone delta").to.equal("Fetched");
    live.push!({ objects: objects("Snapshot") });
    expect((await firstObjects({ connection }))[0].tasks[0].name).to.equal("Snapshot");
  });
});

describe("perf 2026-11-06: the card's first requests", () => {
  beforeEach(forgetShares);

  it("asks for the names with the objects, not after the rows", async () => {
    const held = deferred<unknown>();
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => held.promise,
        "maintenance_supporter/statistics": () => ({}),
      },
    });
    await mountCard("maintenance-supporter-card", "custom:maintenance-supporter-card", hass);
    await tick();
    expect(sentTypes(sent as Msg[])).to.include.members(["objects", "users/list"]);
    held.resolve({ objects: objects("Clean the filter", { responsible_user_id: "u1" }) });
    await tick(20);
    expect(sentTypes(sent as Msg[]).filter((t) => t === "users/list"), "and only once").to.have.length(1);
  });

  it("reads the settings lite, and the old way from a server before lite", async () => {
    const asked: Msg[] = [];
    const hass = (lite: boolean) => ({
      connection: {
        sendMessagePromise: async (msg: Msg) => {
          asked.push(msg);
          if (msg.lite && !lite) throw { code: "invalid_format", message: "extra keys not allowed @ data['lite']" };
          return { general: { row_action_style: "icons", row_action_style_set: true } };
        },
      },
    });
    expect((await fetchSettingsOnce(hass(true) as never)).rowActionStyle).to.equal("icons");
    expect(asked).to.deep.equal([{ type: "maintenance_supporter/settings", lite: true }]);
    forgetShares();
    asked.length = 0;
    expect((await fetchSettingsOnce(hass(false) as never)).rowActionStyle).to.equal("icons");
    expect(asked).to.deep.equal([
      { type: "maintenance_supporter/settings", lite: true },
      { type: "maintenance_supporter/settings" },
    ]);
  });
});
