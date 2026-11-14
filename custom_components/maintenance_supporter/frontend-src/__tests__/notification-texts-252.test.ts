/**
 * #252: a task's own notification texts in the task dialog. Per kind a title
 * and a message; the save sends them cleaned, or null for the standard
 * texts. "Triggered" is offered where the task has a sensor rule. The rule
 * summary says so, and the trace names the kinds an edit touched.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { cleanNotificationTexts, ownTextKinds } from "../helpers/notification-texts.js";
import { changeValue } from "../helpers/task-trace.js";
import { type SentMessage, createMockHass } from "./_test-utils.js";
import type { NotificationTexts } from "../types.js";
import cleaningVectors from "./fixtures/notification-texts-vectors.json";

async function mountDialog(): Promise<{ el: MaintenanceTaskDialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/update": () => ({ success: true }),
      "maintenance_supporter/object": () => ({ parts: [] }),
    },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
  await el.updateComplete;
  return { el, sent };
}

const baseTask = { id: "t1", name: "Bins", type: "cleaning", enabled: true, schedule_type: "time_based", interval_days: 7, warning_days: 1, priority: "normal" };
type Priv = { _save: () => Promise<void>; _ruleDraft: () => { ownTexts?: boolean } };

const kinds = (el: MaintenanceTaskDialog) => [...el.shadowRoot!.querySelectorAll<HTMLElement>(".notify-text")].map((n) => n.dataset.kind);
const update = (sent: SentMessage[]) => sent.find((m) => m.type === "maintenance_supporter/task/update") as unknown as Record<string, unknown>;

describe("notification texts: the shared cleaning vectors (#252)", () => {
  it("gives what the backend's sanitiser gives, an emoji at the cut included", () => {
    const vectors = cleaningVectors.vectors as { note: string; input: unknown; expected: NotificationTexts | null }[];
    expect(vectors.length).to.be.greaterThan(7);
    for (const v of vectors) {
      const got = cleanNotificationTexts(v.input as NotificationTexts);
      expect(got, v.note).to.deep.equal(v.expected);
      if (got) expect(Object.keys(got), `order: ${v.note}`).to.deep.equal(Object.keys(v.expected ?? {}));
      // What the save sends must survive a JSON round trip unchanged (no lone surrogate).
      expect(JSON.parse(JSON.stringify(got)), `JSON: ${v.note}`).to.deep.equal(got);
    }
  });
});

describe("notification texts: cleaning (#252)", () => {
  it("trims, puts a title on one line and leaves empty fields and kinds out", () => {
    expect(
      cleanNotificationTexts({
        due_soon: { title: "  Bins \n tonight ", message: "  one\r\ntwo  " },
        overdue: { title: " ", message: "" },
      })
    ).to.deep.equal({ due_soon: { title: "Bins tonight", message: "one\ntwo" } });
    expect(cleanNotificationTexts({ overdue: { title: "" } })).to.equal(null);
    expect(cleanNotificationTexts(null)).to.equal(null);
    expect(ownTextKinds({ completed: { message: "x" }, due_soon: { title: "y" } })).to.deep.equal(["due_soon", "completed"]);
  });
});

describe("task dialog: own notification texts (#252)", () => {
  it("sends null when none is set, and offers no Triggered block without a sensor rule", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e1", baseTask as never);
    await el.updateComplete;
    expect(kinds(el)).to.deep.equal(["due_soon", "overdue", "completed"]);
    expect(el.shadowRoot!.querySelector(".notify-texts")!.textContent).to.contain("{task} {object} {days} {due}");
    await (el as unknown as Priv)._save();
    expect(update(sent).notification_texts).to.equal(null);
    expect((el as unknown as Priv)._ruleDraft().ownTexts).to.equal(false);
  });

  it("hydrates stored texts, opens the block and sends the edit cleaned", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e1", { ...baseTask, notification_texts: { due_soon: { title: "Bins tonight" } } } as never);
    await el.updateComplete;
    const title = el.shadowRoot!.querySelector<HTMLElement & { value: string }>('.notify-text[data-kind="due_soon"] .notify-text-title')!;
    expect(title.value).to.equal("Bins tonight");
    const block = el.shadowRoot!.querySelector(".notify-texts") as HTMLElement & { open?: boolean; expanded?: boolean };
    expect(block.open === true || block.expanded === true, "open when the task has texts").to.equal(true);
    expect((el as unknown as Priv)._ruleDraft().ownTexts).to.equal(true);
    const message = el.shadowRoot!.querySelector<HTMLElement>('.notify-text[data-kind="overdue"] .notify-text-message')!;
    (message as unknown as { value: string }).value = "  Late!  ";
    message.dispatchEvent(new CustomEvent("input", { bubbles: true, composed: true }));
    await el.updateComplete;
    await (el as unknown as Priv)._save();
    expect(update(sent).notification_texts).to.deep.equal({ due_soon: { title: "Bins tonight" }, overdue: { message: "Late!" } });
  });

  it("offers Triggered, with its {detail} hint, for a task with a sensor rule", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e1", {
      ...baseTask,
      schedule_type: "sensor_based",
      trigger_config: { type: "threshold", entity_id: "sensor.tank", trigger_below: 10 },
    } as never);
    await el.updateComplete;
    expect(kinds(el)).to.deep.equal(["due_soon", "overdue", "triggered", "completed"]);
    expect(el.shadowRoot!.querySelector('.notify-text[data-kind="triggered"]')!.textContent).to.contain("{detail}");
  });
});

describe("trace: an edit of the own texts (#252)", () => {
  it("names the kinds the task words itself", () => {
    const ctx = { lang: "en", entityName: (id: string) => id, userName: () => null };
    expect(changeValue("notification_texts", { overdue: { message: "x" }, due_soon: { title: "y" } }, ctx)).to.equal("Due Soon, Overdue");
    expect(changeValue("notification_texts", null, ctx)).to.equal("—");
  });
});
