/**
 * Perf 2026-11-05, measured on a home of 36 objects and 163 tasks:
 *
 *   - every card redrew on each state change in the home (15 to 27 times in
 *     10 s); they follow the panel's rule now (helpers/hass-changes);
 *   - the calendar card subscribed to the full payload, 13 MB in 10 minutes,
 *     and fetched 1.2 MB of objects on every visit to the panel's Calendar
 *     tab; it subscribes to the deltas now, and draws the panel's objects;
 *   - the strategy and each card on a view fetched every object again; their
 *     first loads share one answer now (helpers/objects-fetch).
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../maintenance-card.js";
import "../maintenance-calendar-card.js";
import "../components/vacation-section-card.js";
import { HASS_STATES_REDRAW_MS } from "../helpers/hass-changes";
import { fetchObjects, SHARE_MS } from "../helpers/objects-fetch";
import { createMockHass } from "./_test-utils.js";

type Card = HTMLElement & {
  hass: Record<string, unknown>;
  updateComplete: Promise<unknown>;
  setConfig?: (config: Record<string, unknown>) => void;
  updated: (changed: Map<string, unknown>) => void;
  objects?: unknown[];
};

const tick = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isoInDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const p = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const TASK = (id: string, name: string) => ({
  id, name, type: "cleaning", schedule_type: "time_based", interval_days: 30, warning_days: 7,
  status: "due_soon", days_until_due: 3, next_due: isoInDays(3), history: [], enabled: true,
});
const objects = () => [{ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [TASK("t1", "Clean the filter")] }];

/** Count the element's draws and what each changed. */
function watch(el: Card): Array<string[]> {
  const seen: Array<string[]> = [];
  const orig = el.updated.bind(el);
  el.updated = (changed) => {
    seen.push([...changed.keys()].map(String));
    orig(changed);
  };
  return seen;
}

async function mount(tag: string, type: string): Promise<{ el: Card; sent: Array<Record<string, unknown>> }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/objects": () => ({ objects: objects() }),
      "maintenance_supporter/statistics": () => ({}),
    },
  });
  const el = (await fixture(html`<div></div>`)).appendChild(document.createElement(tag)) as Card;
  el.setConfig?.({ type });
  el.hass = { ...hass, states: {}, user: { id: "u1", is_admin: true } };
  await el.updateComplete;
  await tick(50);
  return { el, sent: sent as Array<Record<string, unknown>> };
}

describe("perf 2026-11-05: the cards and Home Assistant's state changes", () => {
  for (const [tag, type] of [
    ["maintenance-supporter-card", "custom:maintenance-supporter-card"],
    ["maintenance-supporter-calendar-card", "custom:maintenance-supporter-calendar-card"],
    ["maintenance-vacation-section-card", "custom:maintenance-vacation-section-card"],
  ]) {
    it(`${tag}: a change of only states waits, then draws once with the newest hass`, async () => {
      const { el } = await mount(tag, type);
      await tick(HASS_STATES_REDRAW_MS + 50); // out of the first draw's window
      const seen = watch(el);
      el.hass = { ...el.hass, states: { "sensor.a": { state: "1" } } };
      await el.updateComplete;
      expect(seen, "the first change after a quiet second draws").to.have.length(1);
      el.hass = { ...el.hass, states: { "sensor.a": { state: "2" } } };
      await el.updateComplete;
      el.hass = { ...el.hass, states: { "sensor.a": { state: "3" } } };
      await el.updateComplete;
      expect(seen).to.have.length(1);
      await tick(HASS_STATES_REDRAW_MS + 100);
      await el.updateComplete;
      expect(seen).to.have.length(2);
      expect(seen[1]).to.include("hass");
      expect((el.hass.states as Record<string, { state: string }>)["sensor.a"].state).to.equal("3");
    });
  }

  it("a new language draws the task card at once", async () => {
    const { el } = await mount("maintenance-supporter-card", "custom:maintenance-supporter-card");
    const seen = watch(el);
    el.hass = { ...el.hass, states: { x: 1 } };
    await el.updateComplete;
    el.hass = { ...el.hass, language: "de" };
    await el.updateComplete;
    expect(seen.length).to.be.greaterThan(0);
    expect(seen[seen.length - 1]).to.include("hass");
  });
});

describe("perf 2026-11-05: the calendar card's data", () => {
  it("on its own it loads compact and subscribes to the changes only", async () => {
    const { hass, sent, subscriptions } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({ objects: objects() }),
        "maintenance_supporter/statistics": () => ({}),
      },
    });
    const el = await fixture<Card>(html`<maintenance-supporter-calendar-card .hass=${hass}></maintenance-supporter-calendar-card>`);
    await waitUntil(() => el.shadowRoot!.textContent!.includes("Clean the filter"), "the task is drawn");
    expect(sent.find((m) => m.type === "maintenance_supporter/objects")).to.include({ compact: true });
    const sub = subscriptions.find((s) => s.msg.type === "maintenance_supporter/subscribe")!;
    expect(sub.msg).to.include({ deltas: true, compact: true });
    // A delta replaces the one object it names; the other keys come back
    // as their empty containers (compact).
    sub.push({ delta: [{ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [{ ...TASK("t1", "Rinse the filter"), history: undefined }] }], removed: [] });
    await waitUntil(() => el.shadowRoot!.textContent!.includes("Rinse the filter"), "the delta is drawn");
  });

  it("in the panel it draws the panel's objects and asks for none", async () => {
    const { hass, sent, subscriptions } = createMockHass();
    const el = await fixture<Card>(html`
      <maintenance-supporter-calendar-card .hass=${hass} .objects=${objects()} .stats=${null}></maintenance-supporter-calendar-card>
    `);
    await waitUntil(() => el.shadowRoot!.textContent!.includes("Clean the filter"), "the panel's task is drawn");
    await tick(50);
    expect(sent.map((m) => m.type)).to.not.include("maintenance_supporter/objects");
    expect(subscriptions.map((s) => s.msg.type)).to.not.include("maintenance_supporter/subscribe");
    // The panel's next list is drawn as it comes.
    el.objects = [{ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [TASK("t1", "Rinse the filter")] }];
    await waitUntil(() => el.shadowRoot!.textContent!.includes("Rinse the filter"), "the new list is drawn");
  });
});

describe("perf 2026-11-05: one objects request for the first loads on a page", () => {
  const counting = () => {
    let asked = 0;
    let fail = false;
    const connection = {
      sendMessagePromise: async <T>(msg: Record<string, unknown>): Promise<T> => {
        asked += 1;
        expect(msg).to.deep.equal({ type: "maintenance_supporter/objects", compact: true });
        if (fail) throw new Error("offline");
        return { objects: objects() } as T;
      },
    };
    return { hass: { connection }, asked: () => asked, failNext: (v: boolean) => { fail = v; } };
  };

  beforeEach(() => {
    delete (window as unknown as { __msObjectsFetch?: unknown }).__msObjectsFetch;
  });

  it("first loads share the answer, a reload asks again", async () => {
    const src = counting();
    const [a, b] = await Promise.all([fetchObjects(src.hass, { first: true }), fetchObjects(src.hass, { first: true })]);
    expect(src.asked()).to.equal(1);
    expect(a).to.not.equal(b, "each caller has its own array");
    expect(a[0]).to.equal(b[0], "of the same objects");
    expect(a[0].tasks[0].labels, "hydrated").to.deep.equal([]);
    await fetchObjects(src.hass, { first: true });
    expect(src.asked(), "still within the window").to.equal(1);
    await fetchObjects(src.hass);
    expect(src.asked(), "a reload after an action").to.equal(2);
  });

  it("another connection, a stale answer or a failed one is not shared", async () => {
    const src = counting();
    await fetchObjects(src.hass, { first: true });
    await fetchObjects(counting().hass, { first: true });
    expect(src.asked()).to.equal(1);
    (window as unknown as { __msObjectsFetch: { at: number } }).__msObjectsFetch.at -= SHARE_MS + 1;
    await fetchObjects(src.hass, { first: true });
    expect(src.asked(), "older than the window").to.equal(2);

    const flaky = counting();
    flaky.failNext(true);
    let failed = false;
    await fetchObjects(flaky.hass, { first: true }).catch(() => { failed = true; });
    expect(failed).to.equal(true);
    flaky.failNext(false);
    await fetchObjects(flaky.hass, { first: true });
    expect(flaky.asked(), "the failure was not kept").to.equal(2);
  });
});
