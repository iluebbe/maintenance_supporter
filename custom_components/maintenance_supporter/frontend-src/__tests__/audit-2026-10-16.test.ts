/**
 * Bug audit 2026-10-16, tranche 1 — frontend regressions. Every test fails
 * on the code before the fix.
 *
 * - P1: the Undo toast after an archive or a pause restored the task with a
 *   fresh cycle from today; it now asks for `undo: true` (dates kept).
 * - G1: the task dialog dropped a pattern's month restriction, so editing a
 *   yearly template task ("day 1 of September") made it monthly.
 * - F2: a completion photo is uploaded with `purpose=completion`; a photo
 *   filed in the Documents section is not (the sweep deleted those).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { uploadCompletionPhoto, uploadDocument } from "../helpers/photo-upload.js";
import { type SentMessage, createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task as panelTask } from "./_panel-utils.js";

type Panel = HTMLElement & Record<string, unknown> & { updateComplete: Promise<unknown> };

const OK = () => ({ success: true });
const HANDLERS = {
  "maintenance_supporter/task/pause": OK,
  "maintenance_supporter/task/resume": OK,
  "maintenance_supporter/object/archive": OK,
  "maintenance_supporter/object/unarchive": OK,
  "maintenance_supporter/object/pause": OK,
  "maintenance_supporter/object/resume": OK,
};

async function panelWithUndo(): Promise<{ el: Panel; sent: SentMessage[]; undo: () => Promise<void> }> {
  resetTaskSeq();
  const { el, sent } = await mountPanel([obj("e1", [panelTask()])], HANDLERS);
  const panel = el as unknown as Panel;
  // The pause prompt answers "pause, no end date".
  const confirm = panel.shadowRoot!.querySelector("maintenance-confirm-dialog") as unknown as Record<string, unknown>;
  confirm.prompt = async () => ({ confirmed: true, value: "" });
  let captured: (() => unknown) | null = null;
  panel._showUndoToast = (_msg: string, cb: () => unknown) => { captured = cb; };
  return {
    el: panel,
    sent,
    undo: async () => {
      expect(captured, "an Undo toast was offered").to.be.a("function");
      await captured!();
    },
  };
}

const last = (sent: SentMessage[], type: string) => [...sent].reverse().find((m) => m.type === type) as Record<string, unknown> | undefined;

describe("P1: Undo after archive / pause keeps the task's dates", () => {
  it("task archive → Undo unarchives with undo: true", async () => {
    const { el, sent, undo } = await panelWithUndo();
    await (el._toggleArchiveTask as (e: string, t: string, a: boolean) => Promise<void>)("e1", "t1", false);
    await undo();
    expect(last(sent, "maintenance_supporter/task/unarchive")).to.include({ task_id: "t1", undo: true });
  });

  it("an unarchive from the menu is not an undo (fresh cycle)", async () => {
    const { el, sent } = await panelWithUndo();
    await (el._toggleArchiveTask as (e: string, t: string, a: boolean) => Promise<void>)("e1", "t1", true);
    expect(last(sent, "maintenance_supporter/task/unarchive")).to.not.have.property("undo");
  });

  it("task pause → Undo resumes with undo: true", async () => {
    const { el, sent, undo } = await panelWithUndo();
    await (el._togglePauseTask as (e: string, t: string, p: boolean) => Promise<void>)("e1", "t1", false);
    await undo();
    expect(last(sent, "maintenance_supporter/task/resume")).to.include({ task_id: "t1", undo: true });
  });

  it("object archive and object pause → Undo sends undo: true", async () => {
    const { el, sent, undo } = await panelWithUndo();
    await (el._toggleArchiveObject as (e: string, a: boolean) => Promise<void>)("e1", false);
    await undo();
    expect(last(sent, "maintenance_supporter/object/unarchive")).to.include({ entry_id: "e1", undo: true });
    await (el._togglePauseObject as (e: string, p: boolean) => Promise<void>)("e1", false);
    await undo();
    expect(last(sent, "maintenance_supporter/object/resume")).to.include({ entry_id: "e1", undo: true });
  });
});

async function mountDialog(): Promise<{ el: MaintenanceTaskDialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/create": () => ({ task_id: "new1" }),
      "maintenance_supporter/task/update": () => ({}),
    },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
  await el.updateComplete;
  return { el, sent };
}

const YEARLY = {
  id: "t1", name: "Annual inspection", type: "inspection",
  schedule_type: "day_of_month", warning_days: 30, enabled: true,
  schedule: { kind: "day_of_month", day: 1, months: [9] },
};

describe("G1: the task dialog keeps a month restriction", () => {
  it("an edit of a yearly template task sends its month back", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", YEARLY as never);
    await el.updateComplete;
    (el as unknown as Record<string, unknown>)._name = "Annual boiler inspection";
    await (el as unknown as { _save: () => Promise<void> })._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/update") as Record<string, unknown>;
    expect(msg.schedule).to.deep.equal({ kind: "day_of_month", day: 1, months: [9] });
  });

  it("the month chips show the restriction and clearing them sends months: []", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", YEARLY as never);
    await el.updateComplete;
    const chips = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".cal-month-chips .season-chip")];
    expect(chips).to.have.length(12);
    expect(chips.map((c) => c.classList.contains("selected"))).to.deep.equal(
      [false, false, false, false, false, false, false, false, true, false, false, false],
    );
    chips[8].click();
    await (el as unknown as { _save: () => Promise<void> })._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/update") as Record<string, unknown>;
    expect(msg.schedule).to.deep.equal({ kind: "day_of_month", day: 1, months: [] });
  });

  it("an nth_weekday pattern sends the picked months, sorted", async () => {
    const { el, sent } = await mountDialog();
    await el.openCreate("e");
    const d = el as unknown as Record<string, unknown>;
    d._name = "Gutters";
    d._scheduleType = "nth_weekday";
    d._nth = "1";
    d._nthWeekday = "5";
    d._calMonths = [10, 4];
    await (el as unknown as { _save: () => Promise<void> })._save();
    const msg = sent.find((m) => m.type === "maintenance_supporter/task/create") as Record<string, unknown>;
    expect(msg.schedule).to.deep.equal({ kind: "nth_weekday", nth: 1, weekday: 5, months: [4, 10] });
  });
});

describe("F2: only a completion photo is uploaded as one", () => {
  async function capturedForm(run: (hass: never) => Promise<unknown>): Promise<FormData> {
    const realFetch = window.fetch;
    let body: FormData | null = null;
    window.fetch = ((_url: string, init: RequestInit) => {
      body = init.body as FormData;
      return Promise.resolve(new Response(JSON.stringify({ id: "d1" }), { status: 200 }));
    }) as typeof window.fetch;
    try {
      await run({ auth: { data: { access_token: "x" } } } as never);
    } finally {
      window.fetch = realFetch;
    }
    return body!;
  }
  const photo = () => new File(["png"], "p.png", { type: "image/png" });

  it("the complete dialog's photo says purpose=completion", async () => {
    const form = await capturedForm((hass) => uploadCompletionPhoto(hass, "e1", photo()));
    expect(form.getAll("tags")).to.deep.equal(["photo"]);
    expect(form.get("purpose")).to.equal("completion");
  });

  it("a Documents-section photo carries no purpose", async () => {
    const form = await capturedForm((hass) => uploadDocument(hass, "e1", photo(), ["photo"]));
    expect(form.getAll("tags")).to.deep.equal(["photo"]);
    expect(form.get("purpose")).to.equal(null);
  });
});
