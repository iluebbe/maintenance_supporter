/**
 * The beta UI (2026-10-31): with the beta switch on, our surfaces use Home
 * Assistant's own components — ha-dropdown menus, ha-adaptive-dialog,
 * HA's dialog header, ha-expansion-panel, ha-alert, ha-select, ha-input,
 * ha-checkbox, ha-settings-row + ha-switch, ha-tab-group, HA's toast and
 * HA's corner radii — and wire their events the way HA fires them (probed
 * live on 2026.7.2, 2026.10.4 and 2026.11). With it off, nothing changes
 * (the rest of the suite runs that way).
 *
 * HA's components do not exist in the test runner: bare stand-ins are
 * registered here (this file runs in its own page), events are dispatched
 * as HA dispatches them.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { render } from "lit";
import { betaUi, headerTitle, setBetaUi, titleLine } from "../helpers/beta-ui";
import { renderHaMenu, renderPopupMenu, menuIsHa, type MenuEntry } from "../helpers/menu";
import { renderModalShell, shellIsHa } from "../helpers/modal-shell";
import { collapsible } from "../helpers/collapsible";
import { notice } from "../helpers/notice";
import { selectField } from "../helpers/select-field";
import { checkField } from "../helpers/check-field";
import { renderTabBar } from "../helpers/tab-bar";
import { haToast } from "../helpers/toast";
import "../components/ms-textfield";
import type { MsHaSelect } from "../components/ms-ha-select";

const HA_TAGS = ["ha-dropdown", "ha-dropdown-item", "wa-divider", "ha-adaptive-dialog", "ha-select", "ha-input", "ha-switch",
  "ha-checkbox", "ha-settings-row", "ha-expansion-panel", "ha-alert", "ha-tab-group", "ha-tab-group-tab"];
for (const tag of HA_TAGS) {
  if (!customElements.get(tag)) customElements.define(tag, class extends HTMLElement {});
}

async function mount(tpl: unknown): Promise<HTMLElement> {
  const host = await fixture<HTMLElement>(html`<div></div>`);
  render(tpl, host);
  await new Promise((r) => setTimeout(r, 0));
  return host;
}

describe("beta UI: the switch", () => {
  afterEach(() => setBetaUi(false));

  it("is off by default, flips on the settings and re-maps the corner radii", () => {
    expect(betaUi()).to.equal(false);
    let heard = 0;
    const off = () => { heard += 1; };
    window.addEventListener("ms-beta-ui-changed", off);
    setBetaUi(true);
    expect(betaUi()).to.equal(true);
    expect(document.documentElement.style.getPropertyValue("--ms-radius-6")).to.contain("--ha-border-radius-md");
    setBetaUi(false);
    expect(document.documentElement.style.getPropertyValue("--ms-radius-6")).to.equal("");
    window.removeEventListener("ms-beta-ui-changed", off);
    expect(heard).to.equal(2);
  });

  it("dialog titles: HA's header with the beta, our own line without", async () => {
    expect(headerTitle("Edit")).to.equal(undefined);
    expect((await mount(titleLine("Edit"))).querySelector(".dialog-title")?.textContent).to.equal("Edit");
    setBetaUi(true);
    expect(headerTitle("Edit")).to.equal("Edit");
    expect((await mount(titleLine("Edit"))).querySelector(".dialog-title")).to.equal(null);
  });
});

describe("beta UI: HA's components and their events", () => {
  beforeEach(() => setBetaUi(true));
  afterEach(() => setBetaUi(false));

  it("a menu is HA's ha-dropdown; wa-select runs the picked item", async () => {
    const ran: string[] = [];
    const entries: MenuEntry[] = [
      { label: "Edit", action: () => ran.push("edit") },
      false,
      "divider",
      { label: "Delete", danger: true, cls: "del", action: () => ran.push("delete") },
    ];
    expect(menuIsHa()).to.equal(true);
    const host = await mount(renderHaMenu(html`<button slot="trigger">⋮</button>`, entries));
    const dd = host.querySelector("ha-dropdown")!;
    const items = [...dd.querySelectorAll("ha-dropdown-item")];
    expect(items.map((i) => i.textContent!.trim())).to.deep.equal(["Edit", "Delete"]);
    expect(dd.querySelector("wa-divider"), "the divider").to.exist;
    expect(items[1].getAttribute("variant")).to.equal("danger");
    dd.dispatchEvent(new CustomEvent("wa-select", { detail: { item: items[1] }, bubbles: true, composed: true }));
    expect(ran).to.deep.equal(["delete"]);
  });

  it("without the beta the same list is our popup, closing before its action", async () => {
    setBetaUi(false);
    const ran: string[] = [];
    const host = await mount(renderPopupMenu([{ label: "QR", cls: "qr", action: () => ran.push("qr") }], () => ran.push("close")));
    (host.querySelector(".popup-menu-item.qr") as HTMLElement).click();
    expect(ran).to.deep.equal(["close", "qr"]);
  });

  it("a hand-built dialog is HA's ha-adaptive-dialog with the title in its header", async () => {
    let closed = 0;
    expect(shellIsHa()).to.equal(true);
    const host = await mount(renderModalShell(() => { closed += 1; }, html`<p class="body">Hi</p>`, { title: "Saved views" }));
    const d = host.querySelector("ha-adaptive-dialog") as HTMLElement & { headerTitle?: string };
    expect(d.headerTitle).to.equal("Saved views");
    expect(d.hasAttribute("open")).to.equal(true);
    expect(d.querySelector(".body")).to.exist;
    // A nested component's `closed` bubbles: only the dialog's own closes it.
    d.querySelector(".body")!.dispatchEvent(new CustomEvent("closed", { bubbles: true, composed: true }));
    expect(closed).to.equal(0);
    d.dispatchEvent(new CustomEvent("closed"));
    expect(closed).to.equal(1);
  });

  it("a folding section is ha-expansion-panel; only its own expanded-changed counts", async () => {
    const seen: boolean[] = [];
    const host = await mount(collapsible({ cls: "phases-section", open: true, header: "Phases", onToggle: (o) => seen.push(o) }, html`<div class="inside"></div>`));
    const panel = host.querySelector("ha-expansion-panel.phases-section") as HTMLElement & { expanded?: boolean };
    expect(panel.expanded).to.equal(true);
    expect(panel.querySelector('[slot="header"]')?.textContent).to.equal("Phases");
    panel.querySelector(".inside")!.dispatchEvent(new CustomEvent("expanded-changed", { detail: { expanded: false }, bubbles: true }));
    panel.dispatchEvent(new CustomEvent("expanded-changed", { detail: { expanded: false } }));
    expect(seen).to.deep.equal([false]);
  });

  it("an error is HA's ha-alert, without our .error frame", async () => {
    const host = await mount(notice("warning", "Careful"));
    const alert = host.querySelector("ha-alert")!;
    expect(alert.getAttribute("alert-type")).to.equal("warning");
    expect(alert.classList.contains("error")).to.equal(false);
  });

  it("a dropdown is ha-select fed by the <option> template; `selected` fires change with the value", async () => {
    let picked = "";
    const host = await mount(selectField({ label: "Priority", value: "normal", onChange: (e) => { picked = (e.target as HTMLSelectElement).value; } },
      html`<option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option>`));
    const wrap = host.querySelector("ms-ha-select") as MsHaSelect;
    await wrap.updateComplete;
    const inner = wrap.shadowRoot!.querySelector("ha-select") as HTMLElement & { options?: unknown; value?: string; label?: string };
    expect(inner.options).to.deep.equal([{ value: "low", label: "Low" }, { value: "normal", label: "Normal" }, { value: "high", label: "High" }]);
    expect(inner.value).to.equal("normal");
    expect(inner.label).to.equal("Priority");
    inner.dispatchEvent(new CustomEvent("selected", { detail: { value: "high" } }));
    expect(picked).to.equal("high");
  });

  it("a dropdown without a value takes the option marked selected, as a native select", async () => {
    const host = await mount(selectField({ onChange: () => {} }, html`<option value="a">A</option><option value="b" selected>B</option>`));
    const wrap = host.querySelector("ms-ha-select") as MsHaSelect;
    await wrap.updateComplete;
    expect((wrap.shadowRoot!.querySelector("ha-select") as HTMLElement & { value?: string }).value).to.equal("b");
  });

  it("the classic select gets its value on the first render too (options are a child part)", async () => {
    setBetaUi(false);
    const host = await mount(selectField({ value: "high", onChange: () => {} }, html`<option value="low">Low</option><option value="high">High</option>`));
    await new Promise((r) => setTimeout(r, 0));
    expect((host.querySelector("select") as HTMLSelectElement).value).to.equal("high");
  });

  it("a text field is HA's ha-input; one input event with our value reaches the consumer", async () => {
    const seen: string[] = [];
    const host = await mount(html`<ms-textfield label="Name" helper="Hint" .value=${"Filter"} @input=${(e: Event) => seen.push((e.target as HTMLInputElement).value)}></ms-textfield>`);
    const field = host.querySelector("ms-textfield") as HTMLElement & { updateComplete: Promise<unknown> };
    await field.updateComplete;
    const input = field.shadowRoot!.querySelector("ha-input") as HTMLElement & { value?: string; label?: string; hint?: string };
    expect(input.label).to.equal("Name");
    expect(input.hint).to.equal("Hint");
    expect(input.value).to.equal("Filter");
    input.value = "Filter 2";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    expect(seen).to.deep.equal(["Filter 2"]);
  });

  it("notes stay our own textarea (HA's ha-input has no multi-line mode)", async () => {
    const host = await mount(html`<ms-textfield multiline label="Notes"></ms-textfield>`);
    const field = host.querySelector("ms-textfield") as HTMLElement & { updateComplete: Promise<unknown> };
    await field.updateComplete;
    expect(field.shadowRoot!.querySelector("textarea")).to.exist;
    expect(field.shadowRoot!.querySelector("ha-input")).to.equal(null);
  });

  it("a checkbox is ha-checkbox with its label inside; change reads target.checked", async () => {
    let on = false;
    const host = await mount(checkField({ cls: "req-option", checked: false, onChange: (e) => { on = (e.target as HTMLInputElement).checked; } }, html`<span>Notes</span>`));
    // The place's class (styled as the old label: flex, space-between) sits
    // on a wrapper; on the ha-checkbox host it pushed the box to the middle.
    expect(host.querySelector("ha-checkbox.req-option") === null).to.equal(true);
    const wrap = host.querySelector(".req-option") as HTMLElement;
    expect(wrap.localName).to.equal("span");
    expect(wrap.children.length).to.equal(1);
    const box = wrap.querySelector(":scope > ha-checkbox") as HTMLElement & { checked?: boolean };
    expect(box.textContent).to.contain("Notes");
    box.checked = true;
    box.dispatchEvent(new Event("change", { bubbles: true }));
    expect(on).to.equal(true);
  });

  it("tabs are ha-tab-group; wa-tab-show switches, the trailing button stays", async () => {
    const picked: string[] = [];
    const host = await mount(renderTabBar([{ key: "overview", label: "Overview" }, { key: "trace", label: "Trace", cls: "trace-tab" }],
      "overview", (k) => picked.push(k), html`<button class="search">⌕</button>`));
    const group = host.querySelector("ha-tab-group") as HTMLElement & { active?: string };
    expect(group.active).to.equal("overview");
    // No scroll arrows: deciding on them read the group's width as it
    // attached and laid out the whole page being built (perf 2026-11-02).
    expect(group.hasAttribute("without-scroll-controls")).to.equal(true);
    expect(host.querySelector("ha-tab-group-tab.trace-tab")?.getAttribute("panel")).to.equal("trace");
    expect(host.querySelector(".tab-bar .search")).to.exist;
    group.dispatchEvent(new CustomEvent("wa-tab-show", { detail: { name: "trace" } }));
    expect(picked).to.deep.equal(["trace"]);
  });

  it("a toast is HA's, with Undo as its action", () => {
    const heard: Array<Record<string, unknown>> = [];
    const el = document.createElement("div");
    document.body.appendChild(el);
    const listen = (e: Event) => heard.push((e as CustomEvent).detail);
    window.addEventListener("hass-notification", listen);
    haToast(el, "Task archived", { text: "Undo", action: () => {} });
    window.removeEventListener("hass-notification", listen);
    el.remove();
    expect(heard[0].message).to.equal("Task archived");
    expect((heard[0].action as { text: string }).text).to.equal("Undo");
  });
});

describe("beta UI: the task dialog in HA's components saves what the classic one saves", () => {
  afterEach(() => setBetaUi(false));

  const TASK = {
    id: "t1", name: "Filter", type: "cleaning", enabled: true, schedule_type: "time_based", interval_days: 30,
    warning_days: 7, priority: "high", labels: ["a"], notes: "n", required_completion_fields: ["notes"], allow_skip: false,
    complete_when: { entity_id: "binary_sensor.door", to_state: "on", for_minutes: 2 },
  };

  async function openDialog(beta: boolean) {
    setBetaUi(beta);
    const { createMockHass } = await import("./_test-utils.js");
    await import("../components/task-dialog.js");
    const mock = createMockHass({});
    const host = await fixture<HTMLElement>(html`<div></div>`);
    const el = document.createElement("maintenance-task-dialog") as HTMLElement & {
      hass: unknown; betaEditor: boolean; checklistsEnabled: boolean; updateComplete: Promise<unknown>;
      openEdit(e: string, t: unknown): Promise<void>;
    };
    el.hass = mock.hass;
    el.betaEditor = beta;
    el.checklistsEnabled = true;
    host.appendChild(el);
    await el.openEdit("e1", { ...TASK });
    await el.updateComplete;
    return { el, root: el.shadowRoot!, sent: mock.sent as Array<Record<string, unknown>>, save: () => (el as unknown as { _save(): Promise<void> })._save() };
  }

  /** Open every row's section, so every control of it renders. */
  async function clickThrough(el: { updateComplete: Promise<unknown> }, root: ShadowRoot) {
    for (const row of [...root.querySelectorAll<HTMLElement>(".rule-row .rule-main")]) {
      if (row.getAttribute("aria-expanded") !== "true") row.click();
      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  it("an unchanged task: the same message, the controls HA's", async () => {
    const classic = await openDialog(false);
    let from = classic.sent.length;
    await classic.save();
    const want = classic.sent.slice(from);

    const beta = await openDialog(true);
    await clickThrough(beta.el, beta.root);
    // The sections drew HA's controls, not ours.
    beta.root.querySelector<HTMLElement>('.rule-row[data-row="task"] .rule-main')!.click();
    await beta.el.updateComplete;
    expect(beta.root.querySelector(".rules-sidebar ms-ha-select"), "a dropdown is ha-select").to.exist;
    expect(beta.root.querySelector(".rules-sidebar select"), "no native select left in the task section").to.equal(null);
    expect(beta.root.querySelector(".rules-sidebar ha-expansion-panel"), "the details fold as HA's panel").to.exist;
    from = beta.sent.length;
    await beta.save();
    expect(beta.sent.slice(from)).to.deep.equal(want);
  });

  it("a choice in HA's dropdown reaches the save", async () => {
    const beta = await openDialog(true);
    beta.root.querySelector<HTMLElement>('.rule-row[data-row="task"] .rule-main')!.click();
    await beta.el.updateComplete;
    const wraps = [...beta.root.querySelectorAll<MsHaSelect>(".rules-sidebar ms-ha-select")];
    const priority = wraps.find((w) => w.label === "Priority")!;
    await priority.updateComplete;
    priority.shadowRoot!.querySelector("ha-select")!.dispatchEvent(new CustomEvent("selected", { detail: { value: "low" } }));
    await beta.el.updateComplete;
    const from = beta.sent.length;
    await beta.save();
    const msg = beta.sent.slice(from).find((m) => m.type === "maintenance_supporter/task/update")!;
    expect(msg.priority).to.equal("low");
  });
});
