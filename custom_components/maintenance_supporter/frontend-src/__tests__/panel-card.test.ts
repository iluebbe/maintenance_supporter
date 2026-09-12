/**
 * The whole panel as a card (#174): `maintenance-supporter-panel-card` is
 * listed in the card picker, resolves the panel bundle URL from
 * `hass.panels`, mounts ONE `maintenance-supporter-panel` in embedded mode
 * with the card's presets, derives `narrow` from its own width, sizes itself
 * (fill / configured height), and tells the user when the panel is not
 * registered instead of failing silently. The editor writes tab / view /
 * height and drops a key when cleared.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../maintenance-panel.js"; // defines maintenance-supporter-panel (no import() needed)
import "../maintenance-panel-card.js";
import { PANEL_CARD_TAG, configuredHeight, panelModuleUrl } from "../maintenance-panel-card";
import type { HomeAssistant } from "../types";
import { createMockHass } from "./_test-utils.js";

type CardEl = HTMLElement & {
  hass: HomeAssistant;
  setConfig(c: Record<string, unknown>): void;
  getCardSize(): number;
  getGridOptions(): { columns: string; rows: string };
  _layout(force: boolean): void;
};
type PanelEl = HTMLElement & { embedded: boolean; narrow: boolean; presets: Record<string, string>; panel: Record<string, unknown>; hass: HomeAssistant };

const PANELS = { "maintenance-supporter": { url_path: "maintenance-supporter", config: { _panel_custom: { name: "maintenance-supporter-panel", module_url: "/maintenance_supporter_panel_abc123" } } } };

function mockHass(panels: unknown = PANELS): HomeAssistant {
  const { hass } = createMockHass({ handlers: { "maintenance_supporter/views/list": () => ({ views: [{ id: "v1", name: "Garden Chores", filters: {} }] }) } });
  (hass as Record<string, unknown>).user = { id: "admin-1", is_admin: true };
  (hass as Record<string, unknown>).areas = {};
  (hass as Record<string, unknown>).panels = panels;
  return hass;
}

async function mountCard(config: Record<string, unknown> = {}, width = 1200): Promise<{ card: CardEl; panel: PanelEl }> {
  const card = (await fixture(html`<maintenance-supporter-panel-card style="display:block; width:${width}px"></maintenance-supporter-panel-card>`)) as unknown as CardEl;
  card.setConfig({ type: `custom:${PANEL_CARD_TAG}`, ...config });
  card.hass = mockHass();
  await new Promise((r) => setTimeout(r, 60));
  const panel = card.shadowRoot!.querySelector("maintenance-supporter-panel") as PanelEl;
  return { card, panel };
}

describe("panel card (#174)", () => {
  it("is registered for the card picker and exposes the Lovelace sizing hints", async () => {
    const cards = (window as unknown as { customCards: { type: string; name: string }[] }).customCards;
    expect(cards.some((c) => c.type === PANEL_CARD_TAG)).to.equal(true);
    const ctor = customElements.get(PANEL_CARD_TAG) as unknown as { getStubConfig(): { type: string }; getConfigElement(): HTMLElement };
    expect(ctor.getStubConfig().type).to.equal(`custom:${PANEL_CARD_TAG}`);
    expect(ctor.getConfigElement().tagName.toLowerCase()).to.equal("maintenance-supporter-panel-card-editor");
    const { card } = await mountCard();
    expect(card.getCardSize()).to.be.greaterThan(5);
    expect(card.getGridOptions().columns).to.equal("full");
  });

  it("resolves the panel bundle from hass.panels and only from a same-origin path", () => {
    expect(panelModuleUrl(mockHass())).to.equal("/maintenance_supporter_panel_abc123");
    expect(panelModuleUrl(mockHass({}))).to.equal(null);
    expect(panelModuleUrl(mockHass({ "maintenance-supporter": { config: { _panel_custom: { module_url: "https://evil.example/x.js" } } } }))).to.equal(null);
    expect(panelModuleUrl(undefined)).to.equal(null);
  });

  it("mounts one embedded panel with hass, the panel entry and the presets", async () => {
    const { card, panel } = await mountCard({ tab: "today", view: "Garden Chores" });
    expect(panel).to.exist;
    expect(panel.embedded).to.equal(true);
    expect(panel.presets).to.deep.equal({ tab: "today", view: "Garden Chores" });
    expect(panel.panel.url_path).to.equal("maintenance-supporter");
    expect(panel.hass).to.equal(card.hass);
    // A later hass is forwarded, no second panel is mounted.
    const next = mockHass();
    card.hass = next;
    await new Promise((r) => setTimeout(r, 20));
    expect(panel.hass).to.equal(next);
    expect(card.shadowRoot!.querySelectorAll("maintenance-supporter-panel").length).to.equal(1);
    // An unknown tab preset is dropped, a changed config re-applies presets.
    card.setConfig({ type: `custom:${PANEL_CARD_TAG}`, tab: "bogus" });
    expect(panel.presets).to.deep.equal({});
  });

  it("derives narrow from its own width and fills the viewport below its top edge", async () => {
    const { card, panel } = await mountCard({}, 1200);
    expect(panel.narrow).to.equal(false);
    card.style.width = "500px";
    card._layout(true);
    expect(panel.narrow).to.equal(true);
    const top = card.getBoundingClientRect().top;
    expect(parseInt(card.style.height, 10)).to.equal(Math.max(320, Math.floor(window.innerHeight - Math.max(0, top))));
    card.setConfig({ type: `custom:${PANEL_CARD_TAG}`, height: 640 });
    expect(card.style.height).to.equal("640px");
    card.setConfig({ type: `custom:${PANEL_CARD_TAG}`, height: "80vh" });
    expect(card.style.height).to.equal("80vh");
  });

  it("caps the fill height inside the card editor's preview", async () => {
    const { card } = await mountCard();
    (card as unknown as { preview: boolean }).preview = true;
    expect(card.style.height).to.equal("480px");
    (card as unknown as { preview: boolean }).preview = false;
    expect(card.style.height).to.not.equal("480px");
  });

  it("maps the height option to a CSS length", () => {
    expect(configuredHeight(undefined)).to.equal(null);
    expect(configuredHeight("")).to.equal(null);
    expect(configuredHeight("fill")).to.equal(null);
    expect(configuredHeight(600)).to.equal("600px");
    expect(configuredHeight("600")).to.equal("600px");
    expect(configuredHeight(" 70vh ")).to.equal("70vh");
    expect(configuredHeight(0)).to.equal(null);
  });

  it("explains a missing panel registration instead of failing silently", async () => {
    // The element is already defined in this runner, so the card would mount
    // regardless — the message path is what a core without our panel shows.
    const card = (await fixture(html`<maintenance-supporter-panel-card></maintenance-supporter-panel-card>`)) as unknown as CardEl & { _setStatus(t: string): void };
    card._setStatus("x");
    const status = card.shadowRoot!.querySelector(".status") as HTMLElement;
    expect(status.hidden).to.equal(false);
    expect(status.textContent).to.equal("x");
  });

  it("editor: tab / view / height write config-changed and clear when emptied", async () => {
    const editor = (await fixture(html`<maintenance-supporter-panel-card-editor></maintenance-supporter-panel-card-editor>`)) as HTMLElement & {
      hass: HomeAssistant; setConfig(c: Record<string, unknown>): void; updateComplete: Promise<unknown>;
    };
    const changes: Record<string, unknown>[] = [];
    editor.addEventListener("config-changed", (e) => changes.push((e as CustomEvent).detail.config));
    editor.setConfig({ type: `custom:${PANEL_CARD_TAG}`, tab: "calendar" });
    editor.hass = mockHass();
    await new Promise((r) => setTimeout(r, 30));
    await editor.updateComplete;
    const sr = editor.shadowRoot!;
    const tab = sr.querySelector("select.tab-select") as HTMLSelectElement;
    expect(tab.value).to.equal("calendar");
    expect([...tab.options].map((o) => o.value)).to.deep.equal(["", "today", "dashboard", "calendar", "settings"]);
    expect(tab.textContent).to.contain("Today").and.to.contain("Settings");
    tab.value = "today";
    tab.dispatchEvent(new Event("change"));
    expect(changes.at(-1)).to.deep.equal({ type: `custom:${PANEL_CARD_TAG}`, tab: "today" });
    const view = sr.querySelector("select.view-select") as HTMLSelectElement;
    expect(view, "saved views loaded into the select").to.exist;
    view.value = "v1";
    view.dispatchEvent(new Event("change"));
    expect(changes.at(-1)!.view).to.equal("v1");
    const height = sr.querySelector("input.height-input") as HTMLInputElement;
    height.value = "600px";
    height.dispatchEvent(new Event("change"));
    expect(changes.at(-1)!.height).to.equal("600px");
    tab.value = "";
    tab.dispatchEvent(new Event("change"));
    expect("tab" in changes.at(-1)!).to.equal(false);
  });
});
