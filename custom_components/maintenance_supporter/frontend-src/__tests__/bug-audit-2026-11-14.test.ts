/**
 * Bug audit 2026-11-14, the frontend findings.
 *
 * F9-1  A subscribe attempt made while the socket was down is never
 *       answered, and it kept the reconnect from making a new one: the
 *       cards of a dashboard and the panel stayed on their old list.
 * F9-2  The completion dialog, opened for a second task while it was open
 *       (or still loading) for a first, kept the first task's parts
 *       selection, restock amount, ticks and notes under the second's name.
 * F9-3  "On weekdays" with no day ticked was saved: a task that is never due.
 * F9-4  Complete in a row's quick actions read the task's ids after the
 *       object list had loaded: closed and opened for another row
 *       meanwhile, the completion dialog carried that row's ids under the
 *       first row's name.
 * F9-5  A first load that failed (the page opened seconds after a restart)
 *       was not repeated: the panel stayed on the default features, the
 *       card on the fallback settings, and a deep link was dropped.
 * F9-6  The task's documents took whichever answer came last, also the one
 *       of the object shown before.
 * F9-7  A part form left open went along to the next object's page.
 * F9-8  The page's settings were kept for its whole life, also across an
 *       outage.
 * I9-2  A CSV saved with semicolons was sent to the JSON importer.
 * S9-2  The receipt of an order offered the part's usual amount, not what
 *       was ordered.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/complete-dialog.js";
import "../components/task-dialog.js";
import "../components/task-quick-actions-dialog.js";
import "../components/task-documents.js";
import "../components/parts-section.js";
import "../maintenance-card.js";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceTaskQuickActionsDialog } from "../components/task-quick-actions-dialog";
import type { MaintenanceTaskDocuments } from "../components/task-documents";
import type { MaintenancePartsSection } from "../components/parts-section";
import type { MaintenancePart } from "../types";
import { buildCompleteDialogArgs, fillAndOpenCompleteDialog } from "../helpers/complete-dialog-args.js";
import { isCsvExport } from "../helpers/import-format.js";
import { RETRY_MS, subscribeAcrossReconnects } from "../helpers/live-subscription.js";
import { watchObjects } from "../helpers/objects-hub.js";
import { fetchSettingsOnce, invalidateSettingsCache } from "../helpers/settings-cache.js";
import { createMockHass, DEFAULT_SETTINGS_RESPONSE, type CreateMockHassOptions, type SentMessage } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task as panelTask } from "./_panel-utils.js";

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

// ─── F9-1: the subscription ─────────────────────────────────────────────

type ConnEvent = "ready" | "disconnected";

/** A connection that reports its reconnects, as Home Assistant's does. An
 *  attempt is answered only when the test answers it: one made while the
 *  socket is down stays open for good, as with the real library. */
function reconnecting(extra: { connected?: boolean } = {}) {
  const on: Record<ConnEvent, Array<() => void>> = { ready: [], disconnected: [] };
  const attempts: Array<ReturnType<typeof deferred<() => void>>> = [];
  const connection = {
    ...extra,
    subscribeMessage: () => {
      const answer = deferred<() => void>();
      attempts.push(answer);
      return answer.promise;
    },
    addEventListener: (event: ConnEvent, cb: () => void) => { on[event].push(cb); },
    removeEventListener: (event: ConnEvent, cb: () => void) => { on[event] = on[event].filter((x) => x !== cb); },
  };
  return { connection, attempts, fire: (event: ConnEvent) => [...on[event]].forEach((cb) => cb()) };
}

describe("F9-1: an attempt made during an outage does not block the reconnect's", () => {
  let realTimeout: typeof window.setTimeout;
  beforeEach(() => {
    // The retry timers stay out of the way.
    realTimeout = window.setTimeout;
    window.setTimeout = ((fn: () => void, ms?: number, ...rest: unknown[]) =>
      (ms !== undefined && RETRY_MS.includes(ms) ? 434343 : realTimeout(fn, ms, ...rest))) as typeof window.setTimeout;
  });
  afterEach(() => { window.setTimeout = realTimeout; });

  it("a card arriving while the socket is down: the reconnect subscribes anyway", async () => {
    const { connection, attempts, fire } = reconnecting();
    const live = subscribeAcrossReconnects(connection, () => undefined, { type: "x/subscribe" });
    attempts[0].resolve(() => undefined);
    await tick();
    fire("disconnected");
    live.retryNow(); // a card mounted during the outage
    expect(attempts, "the attempt the library will never answer").to.have.length(2);
    fire("ready");
    expect(attempts, "a fresh attempt on the new socket").to.have.length(3);
    let ended = 0;
    attempts[2].resolve(() => { ended += 1; });
    await tick();
    live.retryNow();
    expect(attempts, "subscribed: nothing more to try").to.have.length(3);
    live.close();
    expect(ended, "the fresh one is the subscription").to.equal(1);
  });

  it("a subscription started while the socket is down (the panel opened offline)", async () => {
    const { connection, attempts, fire } = reconnecting();
    fire("disconnected"); // nobody listens yet: the socket simply is down
    subscribeAcrossReconnects(connection, () => undefined, { type: "x/subscribe" });
    expect(attempts).to.have.length(1);
    fire("ready");
    expect(attempts, "the reconnect starts over").to.have.length(2);
  });

  it("a void attempt that gets through on the same socket after all is ended, not kept twice", async () => {
    const { connection, attempts, fire } = reconnecting();
    const live = subscribeAcrossReconnects(connection, () => undefined, { type: "x/subscribe" });
    // "ready" with an attempt under way (another listener asked first).
    fire("ready");
    expect(attempts).to.have.length(2);
    let endedVoid = 0;
    let endedLive = 0;
    attempts[0].resolve(() => { endedVoid += 1; });
    attempts[1].resolve(() => { endedLive += 1; });
    await tick();
    expect([endedVoid, endedLive], "one subscription left").to.deep.equal([1, 0]);
    live.close();
    expect(endedLive).to.equal(1);
  });

  it("makes no attempt at all while the connection says it is down", async () => {
    const state = { connected: true };
    const { connection, attempts, fire } = reconnecting();
    Object.defineProperty(connection, "connected", { get: () => state.connected });
    const live = subscribeAcrossReconnects(connection, () => undefined, { type: "x/subscribe" });
    attempts[0].resolve(() => undefined);
    await tick();
    state.connected = false;
    fire("disconnected");
    live.retryNow();
    expect(attempts, "nothing sent into a closed socket").to.have.length(1);
    state.connected = true;
    fire("ready");
    expect(attempts).to.have.length(2);
  });
});

// ─── F9-2: the completion dialog ────────────────────────────────────────

interface CompletePriv {
  _open: boolean;
  _notes: string;
  _restockQty: string;
  _usedParts: Record<string, { part_id: string }>;
  _checklistState: Record<string, boolean>;
}

const OWNERS = [
  {
    entry_id: "e1",
    object: { name: "Vacuum" },
    parts: [
      { id: "bag", name: "Dust bags", stock: 4, restock_quantity: 5, cost: 1.5 },
      { id: "belt", name: "Belt", stock: 2 },
    ],
  },
] as never;

const WIRE_TASK = { type: "custom", schedule_type: "time_based", interval_days: 30, warning_days: 7, enabled: true };

function argsFor(taskOver: Record<string, unknown>) {
  const t = { ...WIRE_TASK, ...taskOver } as never as { id: string; name: string };
  return buildCompleteDialogArgs({ entryId: "e1", taskId: t.id, taskName: t.name, task: t as never, objects: OWNERS, lang: "en" });
}

describe("F9-2: the completion dialog opened for another task starts over", () => {
  async function mountDialog() {
    const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/task/complete": () => ({ success: true }) } });
    const el = await fixture<MaintenanceCompleteDialog>(html`<maintenance-complete-dialog .hass=${hass}></maintenance-complete-dialog>`);
    return { el, p: el as unknown as CompletePriv, sent };
  }

  it("takes the second task's parts, ticks and notes, not the first's", async () => {
    const { el, p, sent } = await mountDialog();
    const a = argsFor({ id: "tA", name: "Change bag", consumes_parts: [{ part_id: "bag", quantity: 1 }], checklist: ["Open lid"], checklist_progress: { "Open lid": true } });
    const b = argsFor({ id: "tB", name: "Change belt", consumes_parts: [{ part_id: "belt", quantity: 1 }] });
    fillAndOpenCompleteDialog(el, { ...a, checklist: ["Open lid"] }, "en");
    await el.updateComplete;
    p._notes = "typed for the bag";
    expect(Object.values(p._usedParts).map((l) => l.part_id)).to.deep.equal(["bag"]);
    expect(p._checklistState).to.deep.equal({ "0": true });

    // The second Complete lands while the dialog is open for the first.
    fillAndOpenCompleteDialog(el, b, "en");
    await el.updateComplete;
    expect(el.taskId).to.equal("tB");
    expect(Object.values(p._usedParts).map((l) => l.part_id), "the belt task uses the belt").to.deep.equal(["belt"]);
    expect(p._notes, "the first task's note is gone").to.equal("");
    expect(p._checklistState, "and its ticks").to.deep.equal({});

    await (el as unknown as { _complete(): Promise<void> })._complete();
    const done = sent.find((m) => m.type === "maintenance_supporter/task/complete") as Record<string, unknown>;
    expect(done.task_id).to.equal("tB");
    expect((done.used_parts as Array<{ part_id: string }>).map((l) => l.part_id), "books the belt").to.deep.equal(["belt"]);
  });

  it("a photo uploaded for the first task is discarded, not attached to the second", async () => {
    const { el, sent } = await mountDialog();
    fillAndOpenCompleteDialog(el, argsFor({ id: "tA", name: "Change bag" }), "en");
    await el.updateComplete;
    const photos = (el as unknown as { _photos: { uploadedIds: string[]; photos: Array<{ id: string; preview: string }> } })._photos;
    photos.uploadedIds = ["doc-a"];
    photos.photos = [{ id: "doc-a", preview: "" }];
    fillAndOpenCompleteDialog(el, argsFor({ id: "tB", name: "Change belt" }), "en");
    await el.updateComplete;
    await tick();
    const discarded = sent.filter((m) => m.type === "maintenance_supporter/documents/discard_upload").map((m) => m.doc_id);
    expect(discarded).to.deep.equal(["doc-a"]);
    expect(photos.photos, "the second task starts without it").to.deep.equal([]);
  });

  it("opened again for the task it shows, it keeps what was typed", async () => {
    const { el, p } = await mountDialog();
    const a = argsFor({ id: "tA", name: "Change bag" });
    fillAndOpenCompleteDialog(el, a, "en");
    await el.updateComplete;
    p._notes = "half a sentence";
    fillAndOpenCompleteDialog(el, a, "en");
    await el.updateComplete;
    expect(p._notes).to.equal("half a sentence");
  });
});

// ─── F9-3: weekdays without a day ───────────────────────────────────────

interface TaskDialogPriv {
  _save(): Promise<void>;
  _scheduleType: string;
  _weekdays: number[];
  _toggleWeekday(i: number): void;
}

describe("F9-3: \"On weekdays\" needs a day", () => {
  const saves = (sent: SentMessage[]) =>
    sent.filter((m) => m.type === "maintenance_supporter/task/update" || m.type === "maintenance_supporter/task/create");
  const saveButton = (root: ShadowRoot) =>
    [...root.querySelectorAll(".dialog-actions ha-button")].pop() as (HTMLElement & { disabled?: boolean }) | undefined;

  for (const beta of [false, true]) {
    it(`unticking the last day blocks Save and says why (${beta ? "new look" : "classic"})`, async () => {
      const mock = createMockHass();
      const el = await fixture<MaintenanceTaskDialog>(
        html`<maintenance-task-dialog .hass=${mock.hass} .betaEditor=${beta}></maintenance-task-dialog>`,
      );
      const p = el as unknown as TaskDialogPriv;
      const root = () => el.shadowRoot!;
      await el.openEdit("e1", {
        id: "t1", name: "Put the bins out", type: "custom", warning_days: 0, enabled: true,
        schedule_type: "weekdays", schedule: { kind: "weekdays", weekdays: [1] },
      } as never);
      await el.updateComplete;
      if (beta) {
        (root().querySelector('.rule-row[data-row="schedule"] .rule-main') as HTMLElement).click();
        await el.updateComplete;
      }
      expect(p._scheduleType).to.equal("weekdays");
      expect(root().querySelector(".weekday-chip") !== null, "the day chips").to.be.true;
      expect(root().querySelector(".weekdays-required") === null, "no hint with a day").to.be.true;
      expect(saveButton(root())?.disabled === true, "Save is open").to.be.false;

      p._toggleWeekday(1);
      await el.updateComplete;
      expect(p._weekdays).to.deep.equal([]);
      expect(root().querySelector(".weekdays-required")?.textContent?.trim()).to.equal("Pick at least one weekday.");
      expect(saveButton(root())?.disabled === true, "Save waits for a day").to.be.true;
      await p._save();
      expect(saves(mock.sent).length, "nothing sent").to.equal(0);

      p._toggleWeekday(3);
      await el.updateComplete;
      expect(root().querySelector(".weekdays-required") === null, "the hint goes with a day").to.be.true;
      await p._save();
      const sent = saves(mock.sent).pop() as Record<string, unknown>;
      expect((sent.schedule as { weekdays: number[] }).weekdays).to.deep.equal([3]);
    });
  }
});

// ─── F9-4: Complete in the quick actions ────────────────────────────────

describe("F9-4: Complete in a row's quick actions belongs to the row it was tapped on", () => {
  const COMPLETE_TAG = "maintenance-complete-dialog";
  let haRoot: HTMLElement & { hass?: unknown };

  const wire = (id: string, name: string) => ({
    id, name, type: "custom", schedule_type: "time_based", interval_days: 30, warning_days: 7, status: "ok",
    enabled: true, archived: false, is_done: false, days_until_due: 10, next_due: "2026-12-10", last_performed: null,
    trigger_active: false, times_performed: 0, total_cost: 0, average_duration: null, history: [], checklist: [],
  });

  async function mountQuick() {
    const objectsAnswers: Array<ReturnType<typeof deferred<{ objects: unknown[] }>>> = [];
    const mock = createMockHass({
      handlers: {
        "maintenance_supporter/object": (msg) => (msg.entry_id === "e1"
          ? { entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [wire("tA", "Clean the pump")] }
          : { entry_id: "e2", object: { id: "o2", name: "Boiler" }, tasks: [wire("tB", "Descale the boiler")] }),
        "maintenance_supporter/objects": () => {
          const answer = deferred<{ objects: unknown[] }>();
          objectsAnswers.push(answer);
          return answer.promise;
        },
      },
    });
    (mock.hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
    haRoot = document.createElement("home-assistant");
    haRoot.attachShadow({ mode: "open" });
    haRoot.hass = mock.hass;
    document.body.appendChild(haRoot);
    const el = await fixture<MaintenanceTaskQuickActionsDialog>(
      html`<maintenance-task-quick-actions-dialog .hass=${mock.hass}></maintenance-task-quick-actions-dialog>`,
    );
    return { el, p: el as unknown as { _onComplete(details?: boolean): Promise<void>; _busy: boolean; _open: boolean }, objectsAnswers };
  }

  const completeDialog = () => haRoot.shadowRoot!.querySelector<MaintenanceCompleteDialog>(COMPLETE_TAG);
  const isOpen = (d: MaintenanceCompleteDialog | null) => (d as unknown as CompletePriv | null)?._open === true;

  beforeEach(() => invalidateSettingsCache());
  afterEach(() => haRoot?.remove());

  it("closed and opened for another row while the list loads: no dialog under the wrong name", async () => {
    const { el, p, objectsAnswers } = await mountQuick();
    await el.openFor("e1", "tA");
    await el.updateComplete;
    const pending = p._onComplete(true);
    await waitUntil(() => objectsAnswers.length === 1, "the object list is asked for");
    expect(p._busy, "busy while the list loads").to.be.true;

    el.close();
    await el.openFor("e2", "tB");
    await el.updateComplete;
    expect(p._busy, "the new row's buttons are its own").to.be.false;

    objectsAnswers[0].resolve({ objects: [] });
    await pending;
    await tick(20);
    const dlg = completeDialog();
    expect(isOpen(dlg), "no completion dialog for a row nobody tapped Complete on").to.be.false;
    expect(p._open, "the second row's quick actions stay open").to.be.true;
  });

  it("left alone, it opens for the row it was tapped on", async () => {
    const { el, p, objectsAnswers } = await mountQuick();
    await el.openFor("e1", "tA");
    await el.updateComplete;
    const pending = p._onComplete(true);
    await waitUntil(() => objectsAnswers.length === 1, "the object list is asked for");
    objectsAnswers[0].resolve({ objects: [] });
    await pending;
    await waitUntil(() => isOpen(completeDialog()), "the completion dialog opens");
    const dlg = completeDialog()!;
    expect([dlg.entryId, dlg.taskId, dlg.taskName]).to.deep.equal(["e1", "tA", "Clean the pump"]);
    expect(p._busy).to.be.false;
    expect(p._open, "the quick actions make way").to.be.false;
  });
});

// ─── F9-5: a failed first load is repeated ──────────────────────────────

describe("F9-5: a first load that failed is repeated once the server answers", () => {
  const SETTINGS_ON = {
    ...DEFAULT_SETTINGS_RESPONSE,
    features: { ...DEFAULT_SETTINGS_RESPONSE.features, checklists: true, groups: true },
  };

  beforeEach(() => {
    resetTaskSeq();
    invalidateSettingsCache();
    delete (window as unknown as Record<string, unknown>).__msObjectsFetch;
  });

  /** Unknown command until `up.now`: the integration is still loading. */
  function loading(answer: () => unknown, up: { now: boolean }) {
    return () => {
      if (!up.now) throw { code: "unknown_command", message: "Unknown command." };
      return answer();
    };
  }

  type PanelPriv = HTMLElement & {
    updateComplete: Promise<unknown>;
    _features: { checklists: boolean };
    _groups: Record<string, unknown>;
    _initialLoadDone: boolean;
    _objects: unknown[];
  };

  it("the panel: the subscription's list brings the features, groups and views along", async () => {
    const up = { now: false };
    const objects = [obj("e1", [panelTask({ name: "Descale" })])];
    const { el, sent, subscriptions } = await mountPanel(objects, {
      "maintenance_supporter/objects": loading(() => ({ objects }), up),
      "maintenance_supporter/settings": loading(() => SETTINGS_ON, up),
      "maintenance_supporter/groups": loading(() => ({ groups: { g1: { name: "Weekly", task_refs: [] } } }), up),
      "maintenance_supporter/views/list": loading(() => ({ views: [] }), up),
    });
    const panel = el as unknown as PanelPriv;
    expect(panel._features.checklists, "the defaults after the failed load").to.be.false;
    expect(panel._initialLoadDone, "nothing to follow a link on yet").to.be.false;

    up.now = true;
    const before = sent.filter((m) => m.type === "maintenance_supporter/settings").length;
    const sub = subscriptions.find((x) => x.msg.type === "maintenance_supporter/subscribe")!;
    sub.push({ objects });
    await waitUntil(() => panel._features.checklists === true, "the features are read again");
    expect(sent.filter((m) => m.type === "maintenance_supporter/settings").length).to.equal(before + 1);
    expect(Object.keys(panel._groups)).to.deep.equal(["g1"]);
    expect(panel._initialLoadDone).to.be.true;

    // Complete now: another snapshot asks for nothing.
    const settled = sent.filter((m) => m.type === "maintenance_supporter/settings").length;
    sub.push({ objects });
    await tick(30);
    expect(sent.filter((m) => m.type === "maintenance_supporter/settings").length, "no reload once it is complete").to.equal(settled);
    el.remove();
  });

  it("the panel: the reconnect repeats it too", async () => {
    const up = { now: false };
    const { el, fire } = await mountPanel([], {
      "maintenance_supporter/settings": loading(() => SETTINGS_ON, up),
    });
    const panel = el as unknown as PanelPriv;
    expect(panel._features.checklists).to.be.false;
    up.now = true;
    fire("ready");
    await waitUntil(() => panel._features.checklists === true, "read again on the reconnect");
    el.remove();
  });

  it("a deep link waits for the load that has the objects", async () => {
    const up = { now: false };
    const path = window.location.pathname;
    history.replaceState(null, "", `${path}?tab=today`);
    try {
      const objects = [obj("e1", [panelTask({ name: "Descale" })])];
      const { el, subscriptions } = await mountPanel(objects, {
        "maintenance_supporter/objects": loading(() => ({ objects }), up),
      });
      const panel = el as unknown as PanelPriv & { _overviewTab: string };
      expect(window.location.search, "the link is still there").to.equal("?tab=today");
      up.now = true;
      subscriptions.find((x) => x.msg.type === "maintenance_supporter/subscribe")!.push({ objects });
      await waitUntil(() => panel._overviewTab === "today", "the link is followed by the repeated load");
      el.remove();
    } finally {
      history.replaceState(null, "", path);
    }
  });

  it("the card: settings that could not be read at the start are read with the subscription's list", async () => {
    const up = { now: false };
    const objects = [{
      entry_id: "e5", object: { id: "o5", name: "Pump" },
      tasks: [{ id: "t1", name: "Clean the filter", type: "cleaning", schedule_type: "time_based", interval_days: 30, warning_days: 7, status: "due_soon", days_until_due: 1, history: [], enabled: true }],
    }];
    const { hass, sent, subscriptions } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({ objects }),
        "maintenance_supporter/statistics": () => ({}),
        "maintenance_supporter/settings": loading(() => SETTINGS_ON, up),
      },
    });
    const host = await fixture<HTMLElement>(html`<div></div>`);
    const card = host.appendChild(document.createElement("maintenance-supporter-card")) as HTMLElement & {
      hass: unknown; setConfig(c: Record<string, unknown>): void; _settings: { features: { checklists: boolean } };
    };
    card.setConfig({ type: "custom:maintenance-supporter-card" });
    card.hass = { ...hass, states: {}, user: { id: "u1", is_admin: true } };
    await waitUntil(() => card.shadowRoot!.textContent!.includes("Clean the filter"), "drawn");
    const subs = () => subscriptions.filter((x) => x.msg.type === "maintenance_supporter/subscribe");
    await waitUntil(() => subs().length === 1, "subscribed");
    await tick(10);
    expect(card._settings.features.checklists, "the fallback after the failed read").to.be.false;

    up.now = true;
    subs()[0].push({ objects });
    await waitUntil(() => card._settings.features.checklists === true, "read again");
    const asked = sent.filter((m) => m.type === "maintenance_supporter/settings").length;
    subs()[0].push({ objects });
    await tick(20);
    expect(sent.filter((m) => m.type === "maintenance_supporter/settings").length, "a read that worked is not repeated").to.equal(asked);
    card.remove();
  });
});

// ─── F9-8: the settings after an outage ─────────────────────────────────

describe("F9-8: the page's settings are read again after an outage", () => {
  beforeEach(() => invalidateSettingsCache());

  it("the first list after a reconnect drops them; a list without an outage does not", async () => {
    const { hass, sent, subscriptions, fire } = createMockHass();
    const settingsAsked = () => sent.filter((m) => m.type === "maintenance_supporter/settings").length;
    const release = watchObjects(hass.connection as never, () => undefined);
    const subs = () => subscriptions.filter((x) => x.msg.type === "maintenance_supporter/subscribe");
    await waitUntil(() => subs().length === 1, "subscribed");
    await fetchSettingsOnce(hass as never);
    expect(settingsAsked()).to.equal(1);

    subs()[0].push({ objects: [] });
    await fetchSettingsOnce(hass as never);
    expect(settingsAsked(), "kept while the connection held").to.equal(1);

    fire("disconnected");
    fire("ready");
    await waitUntil(() => subs().length === 2, "subscribed again");
    await fetchSettingsOnce(hass as never);
    expect(settingsAsked(), "kept until the server answers again").to.equal(1);
    subs()[1].push({ objects: [] });
    await fetchSettingsOnce(hass as never);
    expect(settingsAsked(), "read again after the outage").to.equal(2);
    release();
  });
});

// ─── F9-6: the task's documents ─────────────────────────────────────────

describe("F9-6: the task's documents are the shown object's", () => {
  it("an answer for the object shown before, arriving last, is dropped", async () => {
    const answers: Record<string, ReturnType<typeof deferred<{ documents: unknown[] }>>> = {};
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/documents/list": (msg) => (answers[msg.entry_id as string] = deferred<{ documents: unknown[] }>()).promise,
      },
    });
    const doc = (id: string, title: string, taskId: string) =>
      ({ id, kind: "file", title, filename: `${id}.pdf`, mime: "application/pdf", size: 10, tags: [], task_ids: [taskId] });
    const el = await fixture<MaintenanceTaskDocuments>(html`
      <maintenance-task-documents .hass=${hass} .entryId=${"eA"} .taskId=${"tA"} .canWrite=${true}></maintenance-task-documents>
    `);
    await waitUntil(() => answers.eA !== undefined, "object A asked");
    el.entryId = "eB";
    el.taskId = "tB";
    await el.updateComplete;
    await waitUntil(() => answers.eB !== undefined, "object B asked");

    answers.eB.resolve({ documents: [doc("dB", "Boiler manual", "tB")] });
    await tick();
    answers.eA.resolve({ documents: [doc("dA", "Pump manual", "tA"), doc("dA2", "Pump invoice", "tB")] });
    await tick();
    await el.updateComplete;
    const titles = [...el.shadowRoot!.querySelectorAll(".tdoc-row .tdoc-title")].map((n) => n.textContent!.trim());
    expect(titles, "object B's documents").to.deep.equal(["Boiler manual"]);
    expect(el.shadowRoot!.textContent, "nothing of object A").to.not.contain("Pump");
  });
});

// ─── F9-7: the part form ────────────────────────────────────────────────

describe("F9-7: an open part form stays with its object", () => {
  const PARTS: MaintenancePart[] = [{ id: "p1", name: "Shaft seal", stock: 4, is_low: false }];

  it("the page moving on to another object closes it", async () => {
    const sent: Record<string, unknown>[] = [];
    const hass = { language: "en", connection: { sendMessagePromise: async (m: Record<string, unknown>) => { sent.push(m); return { success: true }; } } };
    const el = await fixture<MaintenancePartsSection>(html`
      <maintenance-parts-section .hass=${hass as never} .entryId=${"eB"} .parts=${PARTS} .canWrite=${true}></maintenance-parts-section>
    `);
    await el.updateComplete;
    const p = el as unknown as { _openAdd(): void; _editing: unknown; _orderFor: string | null; _restockFor: string | null };
    p._openAdd();
    p._orderFor = "p1";
    p._restockFor = "p1";
    await el.updateComplete;
    expect(p._editing !== null, "the form is open").to.be.true;

    el.entryId = "eA";
    el.parts = [];
    await el.updateComplete;
    expect(p._editing, "the form does not come along").to.equal(null);
    expect([p._orderFor, p._restockFor]).to.deep.equal([null, null]);
    expect(sent.length, "and nothing was saved").to.equal(0);
  });

  it("a reload of the same object's parts leaves it open", async () => {
    const el = await fixture<MaintenancePartsSection>(html`
      <maintenance-parts-section .hass=${{ language: "en", connection: { sendMessagePromise: async () => ({}) } } as never}
        .entryId=${"eB"} .parts=${PARTS} .canWrite=${true}></maintenance-parts-section>
    `);
    const p = el as unknown as { _openAdd(): void; _editing: unknown };
    p._openAdd();
    el.parts = [...PARTS];
    await el.updateComplete;
    expect(p._editing !== null).to.be.true;
  });
});

// ─── I9-2: a CSV saved with semicolons ──────────────────────────────────

describe("I9-2: a CSV a spreadsheet saved with semicolons goes to the CSV importer", () => {
  const HEADER = "object_entry_id;object_archived_at;object_predecessor_entry_id;object_name;object_manufacturer;task_name";

  it("recognises the semicolon header, quoted and with a byte-order mark too", () => {
    expect(isCsvExport(`${HEADER}\r\nabc;;;Pump;;Filter\r\n`)).to.be.true;
    expect(isCsvExport(`﻿"object_entry_id";"object_name";"task_name"\nx;Pump;Filter`)).to.be.true;
    expect(isCsvExport("object_name;task_name;notes\nPump;Filter;rinse, dry\n")).to.be.true;
  });

  it("a comma file with a semicolon inside a header cell stays a comma file", () => {
    expect(isCsvExport("object_name,task_name,notes; more\nPump,Filter,x\n")).to.be.true;
    expect(isCsvExport("name;notes\nobject_name;x\n"), "a later line is no header").to.be.false;
  });
});

// ─── S9-2: the receipt of an order ──────────────────────────────────────

describe("S9-2: the receipt of an order starts from what was ordered", () => {
  const owners = (order: unknown) => [{
    entry_id: "e1",
    object: { name: "Garage shelf" },
    parts: [{ id: "oil", name: "Oil", stock: 0, restock_quantity: 5, cost: 8, on_order: order }],
  }] as never;
  const buyTask = { ...WIRE_TASK, id: "tBuy", name: "Buy oil", part_ref: { part_id: "oil" } } as never;
  const restockDefault = (order: unknown) =>
    buildCompleteDialogArgs({ entryId: "e1", taskId: "tBuy", taskName: "Buy oil", task: buyTask, objects: owners(order), lang: "en" }).restock_default;

  it("the completion dialog of the buy reminder offers the ordered amount", () => {
    expect(restockDefault({ quantity: 2, expected: "2026-11-20" }), "2 ordered, 5 usual").to.equal(2);
    expect(restockDefault(null), "no order: the usual amount").to.equal(5);
    expect(restockDefault(undefined)).to.equal(5);
    expect(restockDefault({ quantity: 0 }), "an order without an amount: the usual one").to.equal(5);
  });

  it("the All-parts Bought… pill does too", async () => {
    resetTaskSeq();
    const row = (id: string, name: string, extra: Record<string, unknown>) => ({
      part_id: id, entry_id: "e1", object_name: "Garage shelf", name, unit: null, cost: 8,
      restock_quantity: 5, reorder_threshold: 1, stock: 0, low: true, consumers: [], ...extra,
    });
    const { el } = await mountPanel([obj("e1", [panelTask()], "Garage shelf")], {
      "maintenance_supporter/parts/overview": () => ({
        parts: [row("p_oil", "Oil", { on_order: { quantity: 2, expected: "2026-11-20" } }), row("p_seal", "Seal", { on_order: null })],
        count: 2,
      }),
    });
    (el as unknown as { _showAllParts(): void })._showAllParts();
    for (let i = 0; i < 2; i++) {
      await tick(20);
      await el.updateComplete;
    }
    const pills = [...sr(el).querySelectorAll<HTMLElement & { sparePart: { restock_quantity?: number } }>(".all-parts-stock ms-part-purchase")];
    expect(pills.map((x) => x.sparePart.restock_quantity), "the ordered 2, and the usual 5 without an order").to.deep.equal([2, 5]);
    el.remove();
  });
});
