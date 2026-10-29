/**
 * D#240: *Done when* also when the task is not due, and for at least some
 * minutes. Pins: the two options show once the rule has an entity, hydrate,
 * and are sent only when set (a cleared rule is still null); the task page's
 * badge names them.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { completeWhenTitle } from "../renderers/task-detail.js";
import { setLocale } from "../styles.js";
import { type SentMessage, createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Dialog = HTMLElement & {
  updateComplete: Promise<unknown>;
  openEdit: MaintenanceTaskDialog["openEdit"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};

const VACUUM = "vacuum.robbie";

async function mountDialog(): Promise<{ el: Dialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: { "maintenance_supporter/task/update": () => ({}) },
  });
  (hass as unknown as { states: Record<string, unknown> }).states = {
    [VACUUM]: { state: "docked", attributes: { friendly_name: "Robbie" } },
  };
  const el = await fixture<Dialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
  await el.updateComplete;
  return { el, sent };
}

const settle = async (el: { updateComplete: Promise<unknown> }) => { await new Promise((r) => setTimeout(r, 30)); await el.updateComplete; };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lastUpdate = (sent: SentMessage[]) => sent.filter((m) => m.type === "maintenance_supporter/task/update").at(-1) as Record<string, any>;

function tidyTask(rule: Record<string, unknown> | null) {
  return {
    id: "t1", name: "Tidy up for the vacuum", type: "cleaning", schedule_type: "time_based", interval_days: 7, warning_days: 1, enabled: true,
    ...(rule ? { complete_when: rule } : {}),
  };
}

describe("Done when, also when not due and for at least (D#240): the dialog", () => {
  it("shows the options once the rule has an entity, hydrates them and saves them", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", tidyTask({ entity_id: VACUUM, to_state: "cleaning", any_time: true, for_minutes: 5 }) as never);
    await settle(el);
    const field = el.shadowRoot!.querySelector(".complete-when-field")!;
    const anyTime = field.querySelector<HTMLInputElement>(".complete-when-any-time input")!;
    expect(anyTime.checked, "hydrated").to.equal(true);
    expect(field.querySelector(".complete-when-any-time")!.textContent).to.contain("Also when it is not due");
    expect((field.querySelector(".complete-when-for") as HTMLElement & { value: string }).value).to.equal("5");
    await el._save();
    expect(lastUpdate(sent).complete_when).to.deep.equal({ entity_id: VACUUM, to_state: "cleaning", any_time: true, for_minutes: 5 });
  });

  it("sends only what is set", async () => {
    const { el, sent } = await mountDialog();
    await el.openEdit("e", tidyTask({ entity_id: VACUUM, to_state: "cleaning", any_time: true, for_minutes: 5 }) as never);
    await settle(el);
    el._completeWhenAnyTime = false;
    el._completeWhenFor = "0";
    await el._save();
    expect(lastUpdate(sent).complete_when).to.deep.equal({ entity_id: VACUUM, to_state: "cleaning" });

    el._completeWhenFor = "abc";
    await el._save();
    expect(lastUpdate(sent).complete_when).to.deep.equal({ entity_id: VACUUM, to_state: "cleaning" });

    el._completeWhenState = "";
    el._completeWhenAnyTime = true;
    await el._save();
    expect(lastUpdate(sent).complete_when, "no state, no rule").to.equal(null);
  });

  it("offers no options without an entity, and a task without a rule starts without them", async () => {
    const { el } = await mountDialog();
    await el.openEdit("e", tidyTask({ entity_id: VACUUM, to_state: "cleaning", any_time: true, for_minutes: 5 }) as never);
    await settle(el);
    await el.openEdit("e", tidyTask(null) as never);
    await settle(el);
    expect(el._completeWhenAnyTime).to.equal(false);
    expect(el._completeWhenFor).to.equal("");
    expect(el.shadowRoot!.querySelector(".complete-when-any-time") === null).to.equal(true);
    expect(el.shadowRoot!.querySelector(".complete-when-for") === null).to.equal(true);
  });
});

describe("Done when, also when not due and for at least (D#240): the task page", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
  });
  afterEach(() => localStorage.clear());

  it("the badge names both options", async () => {
    const { el } = await mountPanel([obj("e1", [task({ name: "Tidy up", complete_when: { entity_id: VACUUM, to_state: "cleaning", any_time: true, for_minutes: 5 } })], "Living room")]);
    const panel = el as unknown as { _showTask: (e: string, t: string) => void; updateComplete: Promise<unknown> };
    panel._showTask("e1", "t1");
    await panel.updateComplete;
    expect(sr(el).querySelector<HTMLElement>(".complete-when-badge")!.title).to.equal(
      "Done when vacuum.robbie changes to cleaning for 5 min, also when not due",
    );
    expect(completeWhenTitle({ entity_id: VACUUM, to_state: "cleaning" }, "Robbie", "en")).to.equal("Done when Robbie changes to cleaning");
    setLocale("de", { complete_when_badge: "Erledigt, wenn {entity} zu {state} wechselt", complete_when_badge_for: "für {minutes} Min." });
    expect(completeWhenTitle({ entity_id: VACUUM, to_state: "cleaning", for_minutes: 2 }, "Robbie", "de")).to.equal("Erledigt, wenn Robbie zu cleaning wechselt für 2 Min.");
  });
});
