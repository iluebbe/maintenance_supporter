/**
 * Bug audit 2026-11-08, tranche C: the task editor, the trace and the cards.
 *
 * E8-3  (rest) The adaptive, the phases and the shared-parts sections opened
 *       from what is in them, so switching adaptive off, removing the last
 *       phase or unticking the last shared part folded the section shut
 *       under the cursor. They open from the task as it was read.
 * E8-4  New task → From a template / Copy a task kept the lists of the
 *       dialog's first use: a task made since was missing, a copy took the
 *       source as it was before its last edit, a failed read stayed empty.
 * E8-7  The Trace tab took whichever answer came last: Back then Forward
 *       showed the older task's cycles on the newer task's page, and a
 *       step's sensor activity of the task shown before.
 * C8-1  The calendar card's first load overwrote a change the subscription
 *       had merged while the statistics were out.
 * C8-2  Two document loads in flight on the task card dropped each other's
 *       chips, and those objects were not asked again.
 * C8-4  The object's quick actions stayed open under the task's quick
 *       actions and kept listing the old status after an action in there.
 * C8-5  A subscribe that failed while the integration was still loading
 *       left the cards that had joined it deaf. The subscription that
 *       outlasts restarts (#258) covers it; pinned here for the cards.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import "../components/task-trace-view.js";
import "../components/object-quick-actions-dialog.js";
import "../maintenance-card.js";
import "../maintenance-calendar-card.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceObjectQuickActionsDialog } from "../components/object-quick-actions-dialog";
import { liveObjects, watchObjects } from "../helpers/objects-hub.js";
import { RETRY_MS } from "../helpers/live-subscription.js";
import { createMockHass, type CreateMockHassOptions } from "./_test-utils.js";

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

// ─── the task editor ────────────────────────────────────────────────────

interface DialogPriv {
  _adaptiveEnabled: boolean;
  _removePhaseDef(id: string): void;
  _consumesParts: Record<string, unknown>;
  _copyChoices: unknown[] | null;
  _templateChoices: unknown[] | null;
  _loadCopyChoices(): Promise<void>;
  _loadTemplateChoices(): Promise<void>;
}

async function mountDialog(opts: CreateMockHassOptions = {}) {
  const mock = createMockHass(opts);
  const el = await fixture<MaintenanceTaskDialog>(
    html`<maintenance-task-dialog .hass=${mock.hass} .betaEditor=${false}></maintenance-task-dialog>`,
  );
  return { el, p: el as unknown as DialogPriv, root: () => el.shadowRoot!, ...mock };
}

const TASK = { id: "t1", name: "Descale", type: "cleaning", schedule_type: "time_based", interval_days: 30, warning_days: 7, enabled: true };

describe("E8-3: the other sections do not fold shut while they are edited either", () => {
  const isOpen = (root: ShadowRoot, cls: string) => (root.querySelector(`details.${cls}`) as HTMLDetailsElement | null)?.open === true;

  it("adaptive scheduling: switching it off keeps its section open", async () => {
    const { el, p, root } = await mountDialog();
    await el.openEdit("e1", { ...TASK, adaptive_config: { enabled: true } } as never);
    await el.updateComplete;
    expect(isOpen(root(), "adaptive-section"), "open on a task that has it on").to.be.true;
    p._adaptiveEnabled = false;
    await el.updateComplete;
    expect(isOpen(root(), "adaptive-section"), "still open after switching it off").to.be.true;
  });

  it("phases: removing the last one keeps the section, and its Add button, open", async () => {
    const { el, p, root } = await mountDialog();
    await el.openEdit("e1", { ...TASK, phases: { p1: { name: "Rinse" } }, phase_sequence: ["p1"] } as never);
    await el.updateComplete;
    expect(isOpen(root(), "phases-section"), "open on a task with phases").to.be.true;
    p._removePhaseDef("p1");
    await el.updateComplete;
    expect(isOpen(root(), "phases-section"), "still open after removing the last one").to.be.true;
  });

  it("shared parts: unticking the last one keeps the section open", async () => {
    const other = { entry_id: "e2", object: { id: "o2", name: "Shed" }, tasks: [], parts: [{ id: "p9", name: "Grease" }] };
    const { el, p, root } = await mountDialog({ handlers: { "maintenance_supporter/objects": () => ({ objects: [other] }) } });
    await el.openEdit("e1", { ...TASK, consumes_parts: [{ entry_id: "e2", part_id: "p9", quantity: 1 }] } as never);
    await el.updateComplete;
    expect(isOpen(root(), "shared-pools"), "open on a task that draws on a shared part").to.be.true;
    p._consumesParts = {};
    await el.updateComplete;
    expect(isOpen(root(), "shared-pools"), "still open after unticking it").to.be.true;
  });

  it("a task without any of them opens with all three closed", async () => {
    const other = { entry_id: "e2", object: { id: "o2", name: "Shed" }, tasks: [], parts: [{ id: "p9", name: "Grease" }] };
    const { el, root } = await mountDialog({ handlers: { "maintenance_supporter/objects": () => ({ objects: [other] }) } });
    el.adaptiveFeature = true;
    await el.openEdit("e1", TASK as never);
    await el.updateComplete;
    for (const cls of ["adaptive-section", "phases-section", "shared-pools"]) {
      expect(!!root().querySelector(`details.${cls}`), `${cls} is there`).to.be.true;
      expect(isOpen(root(), cls), `${cls} starts closed`).to.be.false;
    }
  });
});

describe("E8-4: the chooser lists are read anew for every new task", () => {
  it("Copy a task: a task made since the last new task is offered", async () => {
    const tasks: Array<Record<string, unknown>> = [{ ...TASK }];
    const { el, p } = await mountDialog({
      handlers: { "maintenance_supporter/objects": () => ({ objects: [{ entry_id: "e1", object: { id: "o1", name: "Kettle" }, tasks: [...tasks] }] }) },
    });
    await el.openCreate("e1");
    await p._loadCopyChoices();
    expect(p._copyChoices?.length).to.equal(1);
    tasks.push({ ...TASK, id: "t2", name: "Clean the lid" });
    await el.openCreate("e1");
    expect(p._copyChoices === null, "forgotten with the new task").to.be.true;
    await p._loadCopyChoices();
    expect(p._copyChoices?.length).to.equal(2);
  });

  it("From a template: a read that failed is tried again", async () => {
    let fail = true;
    const { el, p } = await mountDialog({
      handlers: {
        "maintenance_supporter/templates": () => {
          if (fail) throw new Error("ws down");
          return { templates: [{ name: "Kettle", tasks: [{ name: "Descale", type: "cleaning", schedule_type: "time_based", interval_days: 30, warning_days: 7 }] }] };
        },
      },
    });
    await el.openCreate("e1");
    await p._loadTemplateChoices();
    expect(p._templateChoices).to.deep.equal([]);
    fail = false;
    await el.openCreate("e1");
    await p._loadTemplateChoices();
    expect(p._templateChoices?.length).to.equal(1);
  });
});

// ─── the Trace tab ──────────────────────────────────────────────────────

describe("E8-7: only the answer for the task on screen lands", () => {
  type TraceEl = HTMLElement & { taskId: string; updateComplete: Promise<unknown> };
  interface TracePriv {
    _raw: { marker?: string } | null;
    _activity: Map<string, unknown>;
    _loadActivity(key: string, it: unknown, ids: string[]): Promise<void>;
  }

  it("an older task's slower answer does not show on the newer task's page", async () => {
    const answers: Record<string, ReturnType<typeof deferred<unknown>>> = { t1: deferred(), t2: deferred() };
    const { hass } = createMockHass({
      handlers: { "maintenance_supporter/task/trace": (msg) => answers[String(msg.task_id)].promise },
    });
    const el = await fixture<TraceEl>(html`<maintenance-task-trace .hass=${hass} .entryId=${"e1"} .taskId=${"t1"}></maintenance-task-trace>`);
    el.taskId = "t2";
    await el.updateComplete;
    answers.t2.resolve({ enabled: true, events: [], history: [], marker: "t2" });
    await tick();
    answers.t1.resolve({ enabled: true, events: [], history: [], marker: "t1" });
    await tick();
    await el.updateComplete;
    expect((el as unknown as TracePriv)._raw?.marker).to.equal("t2");
  });

  it("nor does a step's sensor activity of the task shown before", async () => {
    const history = deferred<unknown>();
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/task/trace": () => ({ enabled: true, events: [], history: [] }),
        "history/history_during_period": () => history.promise,
      },
    });
    const el = await fixture<TraceEl>(html`<maintenance-task-trace .hass=${hass} .entryId=${"e1"} .taskId=${"t1"}></maintenance-task-trace>`);
    await tick();
    const p = el as unknown as TracePriv;
    const pending = p._loadActivity("0:0", { at: "2026-10-01T00:00:00+00:00" }, ["sensor.x"]);
    expect(p._activity.get("0:0")).to.equal("loading");
    el.taskId = "t2";
    await el.updateComplete;
    await tick();
    expect(p._activity.has("0:0"), "the new task starts without it").to.be.false;
    history.resolve({});
    await pending;
    expect(p._activity.has("0:0"), "and the late answer is dropped").to.be.false;
  });
});

// ─── the cards ──────────────────────────────────────────────────────────

const obj = (entryId: string, name: string) => ({
  entry_id: entryId,
  object: { id: `o-${entryId}`, name: "Pool Pump", area_id: null, task_ids: [] },
  tasks: [{ id: "t1", name, type: "custom", schedule_type: "time_based", interval_days: 30, warning_days: 7, status: "ok", days_until_due: 5, trigger_active: false, history: [], enabled: true }],
});

describe("C8-1: the calendar card keeps a change merged during its first load", () => {
  it("what the subscription brought while the statistics were out is the newer list", async () => {
    const stats = deferred<unknown>();
    const mock = createMockHass({ handlers: { "maintenance_supporter/statistics": () => stats.promise } });
    // Another card of the page subscribed already: the hub has the list.
    const release = watchObjects(mock.hass.connection as never, () => undefined);
    await tick();
    mock.subscriptions[0].push({ objects: [obj("e1", "Before")] });
    const el = await fixture<HTMLElement & { updateComplete: Promise<unknown> }>(
      html`<maintenance-supporter-calendar-card .hass=${mock.hass}></maintenance-supporter-calendar-card>`,
    );
    await tick(10);
    try {
      mock.subscriptions[0].push({ delta: [obj("e1", "After")] });
      stats.resolve({});
      await tick(10);
      await el.updateComplete;
      const objects = (el as unknown as { _objects: Array<{ tasks: Array<{ name: string }> }> })._objects;
      expect(objects.map((o) => o.tasks[0].name)).to.deep.equal(["After"]);
    } finally {
      release();
    }
  });
});

describe("C8-2: two document loads on the task card keep each other's chips", () => {
  interface CardPriv {
    hass: unknown;
    _taskDocs: Record<string, Record<string, unknown[]>>;
    _loadDocuments(objects: unknown[]): Promise<void>;
  }
  const doc = (objectId: string) => ({ id: `d-${objectId}`, title: "Manual", kind: "file", task_ids: ["t1"], object_id: objectId });

  for (const firstWins of [true, false]) {
    it(`whichever answer comes ${firstWins ? "first" : "last"}`, async () => {
      const answers: Record<string, ReturnType<typeof deferred<unknown>>> = {};
      // Not attached: only the load is under test.
      const card = document.createElement("maintenance-supporter-card") as unknown as CardPriv;
      card.hass = {
        language: "en",
        connection: {
          sendMessagePromise: (msg: { entry_ids?: string[] }) => {
            const key = (msg.entry_ids ?? []).join(",");
            answers[key] = deferred();
            return answers[key].promise;
          },
        },
      };
      const first = card._loadDocuments([obj("a", "A"), obj("b", "B")]);
      const second = card._loadDocuments([obj("c", "C")]);
      const land = async (key: string, objectId: string, load: Promise<void>) => {
        answers[key].resolve({ documents: [doc(objectId)] });
        await load;
      };
      if (firstWins) {
        await land("a,b", "o-a", first);
        await land("c", "o-c", second);
      } else {
        await land("c", "o-c", second);
        await land("a,b", "o-a", first);
      }
      expect(Object.keys(card._taskDocs).sort()).to.deep.equal(["a", "b", "c"]);
      expect(card._taskDocs.a.t1?.length, "the first load's chip").to.equal(1);
      expect(card._taskDocs.c.t1?.length, "the second load's chip").to.equal(1);
    });
  }
});

describe("C8-4: the object's quick actions follow the dialogs stacked on them", () => {
  it("reloads after an action on one of its tasks, and only then", async () => {
    let loads = 0;
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/object": () => {
          loads += 1;
          return { ...obj("e1", "Backwash"), tasks: [{ ...obj("e1", "Backwash").tasks[0], status: loads > 1 ? "ok" : "overdue" }] };
        },
      },
    });
    const el = await fixture<MaintenanceObjectQuickActionsDialog>(
      html`<maintenance-object-quick-actions-dialog .hass=${hass as never}></maintenance-object-quick-actions-dialog>`,
    );
    await el.openFor("e1");
    expect(loads).to.equal(1);
    // The task's quick actions, the complete dialog and the task dialog are
    // its siblings in Home Assistant's root.
    const stacked = document.createElement("div");
    el.parentNode!.appendChild(stacked);
    const data = () => (el as unknown as { _data: { tasks: Array<{ status: string }> } | null })._data;
    try {
      stacked.dispatchEvent(new CustomEvent("task-action-fired", { detail: { entry_id: "e1", task_id: "t1", action: "skip" }, bubbles: true, composed: true }));
      await tick();
      expect(loads, "after Skip in the task's quick actions").to.equal(2);
      expect(data()?.tasks[0].status).to.equal("ok");

      stacked.dispatchEvent(new CustomEvent("task-action-fired", { detail: { entry_id: "e2", task_id: "t1", action: "skip" }, bubbles: true, composed: true }));
      await tick();
      expect(loads, "another object's task is none of its business").to.equal(2);

      // The shared complete dialog reports on itself only (no bubbling).
      stacked.dispatchEvent(new CustomEvent("task-completed", { detail: { entryId: "e1", taskId: "t1", taskName: "Backwash", undo: false } }));
      await tick();
      expect(loads, "after the completion in the complete dialog").to.equal(3);

      stacked.dispatchEvent(new CustomEvent("task-saved"));
      await tick();
      expect(loads, "after an edit in the task dialog").to.equal(4);

      el.close();
      stacked.dispatchEvent(new CustomEvent("task-action-fired", { detail: { entry_id: "e1", task_id: "t1", action: "reset" }, bubbles: true, composed: true }));
      await tick();
      expect(loads, "closed: nothing to keep current").to.equal(4);
    } finally {
      stacked.remove();
    }
  });
});

describe("C8-5: a subscribe that failed while the integration loads does not leave the cards deaf", () => {
  /** Hold the retry timers: the test runs them by hand. */
  function holdRetries() {
    const held: Array<() => void> = [];
    const real = window.setTimeout;
    window.setTimeout = ((fn: () => void, ms?: number, ...rest: unknown[]) => {
      if (ms !== undefined && RETRY_MS.includes(ms)) { held.push(fn); return 434343; }
      return real(fn, ms, ...rest);
    }) as typeof window.setTimeout;
    return { held, restore: () => { window.setTimeout = real; } };
  }

  it("the card that joined keeps listening, and gets the list once the subscription is through", async () => {
    const retries = holdRetries();
    const attempts: Array<{ callback: (event: unknown) => void; answer: ReturnType<typeof deferred<() => void>> }> = [];
    const connection = {
      sendMessagePromise: async () => ({}),
      subscribeMessage: (callback: (event: unknown) => void) => {
        const answer = deferred<() => void>();
        attempts.push({ callback, answer });
        return answer.promise;
      },
    };
    const seen: unknown[] = [];
    const release = watchObjects(connection as never, (event) => seen.push(event));
    try {
      attempts[0].answer.reject(new Error("Unknown command"));
      await tick();
      expect(liveObjects(connection), "no list yet").to.equal(null);
      expect(retries.held.length, "it tries again by itself").to.equal(1);
      retries.held.shift()!();
      expect(attempts.length).to.equal(2);
      attempts[1].answer.resolve(() => undefined);
      await tick();
      attempts[1].callback({ objects: [obj("e1", "Backwash")] });
      expect(seen.length, "the card that joined before the failure hears it").to.equal(1);
      expect(liveObjects(connection)?.length).to.equal(1);
    } finally {
      release();
      retries.restore();
    }
  });
});
