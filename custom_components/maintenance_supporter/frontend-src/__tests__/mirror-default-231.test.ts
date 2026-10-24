/**
 * #231: default to-do lists for the mirror. Pins: the settings answer is
 * parsed once for every surface; Settings → General offers one checkbox per
 * to-do list (not our own) and writes the list, capped at five; the task
 * dialog asks default / other lists / none once defaults exist, hydrates the
 * choice and saves exactly one meaning; without defaults it stays the plain
 * picker and keeps an earlier opt-out; the task page names the lists a task
 * goes onto, the default ones as such.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import "../components/settings-view.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { parseSettings } from "../helpers/settings-cache.js";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, type SentMessage, createMockHass } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const STATES = {
  "todo.cloud": { state: "0", attributes: { friendly_name: "Cloud reminders" } },
  "todo.family": { state: "0", attributes: { friendly_name: "Family" } },
  "todo.maintenance": { state: "3", attributes: { friendly_name: "Maintenance" } },
};
const ENTITIES = {
  "todo.cloud": { entity_id: "todo.cloud", platform: "caldav" },
  "todo.family": { entity_id: "todo.family", platform: "local_todo" },
  "todo.maintenance": { entity_id: "todo.maintenance", platform: "maintenance_supporter" },
};

// The dialog's private fields are driven directly, as the other dialog tests do.
type Dialog = HTMLElement & {
  updateComplete: Promise<unknown>;
  openEdit: MaintenanceTaskDialog["openEdit"];
  openCreate: MaintenanceTaskDialog["openCreate"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};

async function mountDialog(defaults: string[]): Promise<{ el: Dialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/create": () => ({ task_id: "new1" }),
      "maintenance_supporter/task/update": () => ({}),
    },
  });
  (hass as unknown as { states: unknown }).states = STATES;
  const el = await fixture<Dialog>(html`
    <maintenance-task-dialog .hass=${hass} .mirrorTodoDefault=${defaults}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  return { el, sent };
}

const baseTask = { id: "t1", name: "Filter", type: "custom", schedule_type: "time_based", interval_days: 30, warning_days: 7, enabled: true };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lastUpdate = (sent: SentMessage[]) => sent.filter((m) => m.type === "maintenance_supporter/task/update").at(-1) as Record<string, any>;
const radios = (el: Dialog) => [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".mirror-todo-choice input[type=radio]")];
const choose = async (el: Dialog, value: string) => {
  const r = radios(el).find((x) => x.value === value)!;
  r.checked = true;
  r.dispatchEvent(new Event("change"));
  await el.updateComplete;
};

describe("default to-do lists (#231): the settings answer", () => {
  it("parses the default lists for every surface", () => {
    expect(parseSettings({ general: { mirror_todo_default_entities: ["todo.cloud", 3 as never, ""] } }).mirrorTodoDefault).to.deep.equal(["todo.cloud"]);
    expect(parseSettings(null).mirrorTodoDefault).to.deep.equal([]);
  });
});

describe("default to-do lists (#231): the task dialog", () => {
  it("is the plain picker without defaults, and keeps an earlier opt-out", async () => {
    const { el, sent } = await mountDialog([]);
    await el.openEdit("e", { ...baseTask, mirror_todo_use_default: false } as never);
    await el.updateComplete;
    expect(radios(el).length).to.equal(0);
    expect(el.shadowRoot!.querySelector(".mirror-todo-field ha-form")).to.not.equal(null);
    await el._save();
    expect(lastUpdate(sent).mirror_todo_entities).to.deep.equal([]);
    expect(lastUpdate(sent).mirror_todo_use_default).to.equal(false);

    await el.openEdit("e", { ...baseTask } as never);
    await el.updateComplete;
    await el._save();
    expect(lastUpdate(sent).mirror_todo_use_default).to.equal(true);
  });

  it("asks default / other lists / none and hydrates the choice", async () => {
    const { el } = await mountDialog(["todo.cloud"]);
    await el.openEdit("e", { ...baseTask } as never);
    await el.updateComplete;
    expect(radios(el).map((r) => r.value)).to.deep.equal(["default", "own", "none"]);
    expect(radios(el).find((r) => r.checked)!.value).to.equal("default");
    expect(el.shadowRoot!.querySelector(".mirror-todo-choice")!.textContent).to.contain("Default lists: Cloud reminders");
    expect(el.shadowRoot!.querySelector(".mirror-todo-field ha-form"), "no picker for the default").to.equal(null);

    await el.openEdit("e", { ...baseTask, mirror_todo_entities: ["todo.family"] } as never);
    await el.updateComplete;
    expect(radios(el).find((r) => r.checked)!.value).to.equal("own");
    expect(el.shadowRoot!.querySelector(".mirror-todo-field ha-form"), "the picker for other lists").to.not.equal(null);

    await el.openEdit("e", { ...baseTask, mirror_todo_use_default: false } as never);
    await el.updateComplete;
    expect(radios(el).find((r) => r.checked)!.value).to.equal("none");
    expect(el.shadowRoot!.querySelector(".mirror-todo-field .field-help"), "no hint for none").to.equal(null);

    await el.openCreate("e");
    await el.updateComplete;
    expect(radios(el).find((r) => r.checked)!.value).to.equal("default");
  });

  it("saves exactly one meaning per choice", async () => {
    const { el, sent } = await mountDialog(["todo.cloud"]);
    // A save closes the dialog: each choice starts from the task with its own list.
    const saveWith = async (choice: string, entities?: string[]) => {
      await el.openEdit("e", { ...baseTask, mirror_todo_entities: ["todo.family"] } as never);
      await el.updateComplete;
      await choose(el, choice);
      if (entities) el._mirrorTodoEntities = entities;
      await el._save();
      const msg = lastUpdate(sent);
      return [msg.mirror_todo_entities, msg.mirror_todo_use_default];
    };
    expect(await saveWith("default")).to.deep.equal([[], true]);
    expect(await saveWith("none")).to.deep.equal([[], false]);
    expect(await saveWith("own")).to.deep.equal([["todo.family"], false]);
    // Other lists with nothing picked means none, not the default.
    expect(await saveWith("own", [])).to.deep.equal([[], false]);
  });
});

describe("default to-do lists (#231): Settings → General", () => {
  async function mount(picked: string[]) {
    const settings = { ...DEFAULT_SETTINGS_RESPONSE, general: { ...DEFAULT_SETTINGS_RESPONSE.general, mirror_todo_default_entities: picked } };
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => settings,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "maintenance_supporter/global/update": (msg: any) => ({ ...settings, general: { ...settings.general, ...msg.settings } }),
      },
    });
    Object.assign(hass as object, { states: STATES, entities: ENTITIES });
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    const boxes = () => [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".mirror-todo-default-list input[type=checkbox]")];
    return { el, sent, boxes };
  }

  it("offers every to-do list but our own and writes the ticked ones", async () => {
    const { el, sent, boxes } = await mount(["todo.family"]);
    expect(boxes().map((b) => b.dataset.list)).to.deep.equal(["todo.cloud", "todo.family"]);
    expect(boxes().map((b) => b.checked)).to.deep.equal([false, true]);
    expect(el.shadowRoot!.querySelector(".mirror-todo-default")!.textContent).to.contain("unless the task picks its own lists or none");

    const cloud = boxes()[0];
    cloud.checked = true;
    cloud.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 30));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = sent.filter((m) => m.type === "maintenance_supporter/global/update").at(-1) as any;
    expect(msg.settings).to.deep.equal({ mirror_todo_default_entities: ["todo.family", "todo.cloud"] });
  });

  it("keeps a saved list that is not loaded, and stops at five", async () => {
    const five = ["todo.a", "todo.b", "todo.c", "todo.d", "todo.e"];
    const { boxes } = await mount(five);
    const ids = boxes().map((b) => b.dataset.list);
    expect(ids.slice(0, 5)).to.deep.equal(five);
    const free = boxes().filter((b) => !b.checked);
    expect(free.length).to.equal(2);
    expect(free.every((b) => b.disabled)).to.equal(true);
  });
});

describe("default to-do lists (#231): the task page", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
  });
  afterEach(() => localStorage.clear());

  async function badgeTitle(tk: Record<string, unknown>, defaults: string[]): Promise<string | null> {
    resetTaskSeq();
    const { el } = await mountPanel([obj("e1", [task({ name: "Filter", ...tk })], "Washer")]);
    const panel = el as unknown as { _showTask: (e: string, t: string) => void; _mirrorTodoDefault: string[]; updateComplete: Promise<unknown> };
    panel._mirrorTodoDefault = defaults;
    panel._showTask("e1", "t1");
    await panel.updateComplete;
    return sr(el).querySelector<HTMLElement>(".mirror-badge")?.title ?? null;
  }

  it("names the default lists, the own ones, and nothing for an opt-out", async () => {
    expect(await badgeTitle({}, ["todo.cloud"])).to.equal("Default lists: todo.cloud");
    expect(await badgeTitle({ mirror_todo_entities: ["todo.family"] }, ["todo.cloud"])).to.equal("Mirror into to-do lists: todo.family");
    expect(await badgeTitle({ mirror_todo_use_default: false }, ["todo.cloud"])).to.equal(null);
    expect(await badgeTitle({}, [])).to.equal(null);
  });
});
