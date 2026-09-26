/**
 * v2.93 home profile: Settings shows what was detected (house vs apartment,
 * country, climate) and lets the admin override the dwelling type; the panel
 * gallery recommends templates from it and moves untypical ones to the end.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { countryName, detectionReasons, recommendationReason, type HomeProfile } from "../helpers/home-profile.js";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass, type SentMessage } from "./_test-utils.js";
import { mountPanel, obj, sr, task } from "./_panel-utils.js";

const PROFILE: HomeProfile = {
  dwelling: "house",
  dwelling_detected: "house",
  dwelling_reasons: ["floors", "area_garage", "entity_garage", "area_garden"],
  dwelling_source: "auto",
  country: "DE",
  hemisphere: "north",
  climate: { koppen: "Cfb", coldest_c: 0, warmest_c: 19, hemisphere: "north", has_winter: true, traits: ["freeze", "snow"] },
  traits: ["freeze", "radon", "snow"],
};

const TEMPLATES = {
  categories: { home: { icon: "mdi:home", name_en: "Home & HVAC" }, pool: { icon: "mdi:pool", name_en: "Pool" } },
  profile: PROFILE,
  templates: [
    { id: "pool_pump", name: "Pool Pump", category: "pool", tasks: [1, 2], recommended: false, reasons: [], dwelling_mismatch: true },
    { id: "pool_water", name: "Pool Water", category: "pool", tasks: [1], recommended: false, reasons: [], dwelling_mismatch: false },
    { id: "home_heating", name: "Heating System", category: "home", tasks: [1, 2, 3], recommended: true, reasons: ["freeze"], dwelling_mismatch: false },
    { id: "home_smoke", name: "Smoke Detectors", category: "home", tasks: [1], recommended: true, reasons: ["starter", "country"], dwelling_mismatch: false },
  ],
};

describe("home profile helpers", () => {
  it("merges detection reasons that read the same", () => {
    expect(detectionReasons(["area_garage", "entity_garage", "floors", "bogus"], "en")).to.equal("a garage, several floors");
  });

  it("labels recommendation reasons, with the country's own name", () => {
    expect(recommendationReason("starter", "en", "DE")).to.equal("Basics for your home");
    expect(recommendationReason("freeze", "en", "DE")).to.equal("Frost in winter");
    expect(recommendationReason("country", "en", "DE")).to.equal("Common in Germany");
    expect(recommendationReason("feature_garage", "en", null)).to.equal("Found in your home: a garage");
    expect(recommendationReason("feature_basement", "en", null)).to.equal("Found in your home: a basement");
    expect(countryName("DE", "de")).to.equal("Deutschland");
    expect(countryName(null, "en")).to.equal("");
  });
});

describe("settings: home profile section", () => {
  async function mount(homeType = "auto") {
    let settings = { ...DEFAULT_SETTINGS_RESPONSE, home_type: homeType };
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => settings,
        "maintenance_supporter/templates": () => TEMPLATES,
        "maintenance_supporter/global/update": (msg: any) => {
          settings = { ...settings, ...msg.settings };
          return settings;
        },
      },
    });
    const el = await fixture<MaintenanceSettingsView>(html`
      <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
    `);
    await new Promise((r) => setTimeout(r, 60));
    await el.updateComplete;
    return { el, sent: sent as SentMessage[] };
  }

  it("shows the detected dwelling, why, the country and climate", async () => {
    const { el } = await mount();
    const section = el.shadowRoot!.querySelector('[data-section="home_profile"]')!;
    expect(section, "section rendered").to.exist;
    const auto = section.querySelector<HTMLOptionElement>('select.home-type option[value="auto"]')!;
    expect(auto.textContent!.trim()).to.equal("Automatic (House)");
    expect(section.querySelector(".home-detected")!.textContent).to.contain("several floors, a garage, a garden");
    const climate = section.querySelector(".home-climate-value")!.textContent!;
    expect(climate).to.contain("Germany").and.to.contain("Köppen Cfb").and.to.contain("0 °C");
    const traits = [...section.querySelectorAll(".home-trait")].map((e) => e.textContent!.trim());
    expect(traits).to.deep.equal(["Frost in winter", "Radon test recommended", "Snowy winters"]);
  });

  it("writes home_type and refetches the profile", async () => {
    const { el, sent } = await mount();
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>("select.home-type")!;
    const before = sent.filter((m) => m.type === "maintenance_supporter/templates").length;
    select.value = "apartment";
    select.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 60));
    const update = sent.find((m) => m.type === "maintenance_supporter/global/update") as any;
    expect(update.settings).to.deep.equal({ home_type: "apartment" });
    expect(sent.filter((m) => m.type === "maintenance_supporter/templates").length).to.be.greaterThan(before);
  });
});

describe("panel gallery: recommendations", () => {
  it("lists recommended templates first with reasons and moves untypical ones to the end", async () => {
    const { el } = await mountPanel([obj("e1", [task()])], { "maintenance_supporter/templates": () => TEMPLATES });
    await (el as any)._openTemplateGallery();
    await el.updateComplete;
    const root = sr(el);
    const rec = root.querySelector(".template-cat.recommended")!;
    expect(rec, "recommended section").to.exist;
    const names = [...rec.querySelectorAll(".template-card-name")].map((e) => e.textContent!.trim());
    expect(names).to.deep.equal(["Heating System", "Smoke Detectors"]);
    const reasons = [...rec.querySelectorAll(".template-card-reason")].map((e) => e.textContent!.trim());
    expect(reasons).to.deep.equal(["Frost in winter", "Basics for your home", "Common in Germany"]);
    // Pool category: the untypical pump sinks below the water card, dimmed.
    const poolCat = [...root.querySelectorAll(".template-cat:not(.recommended)")].find((c) => c.textContent!.includes("Pool Water"))!;
    const cards = [...poolCat.querySelectorAll<HTMLButtonElement>(".template-card")];
    expect(cards.map((c) => c.querySelector(".template-card-name")!.textContent!.trim())).to.deep.equal(["Pool Water", "Pool Pump"]);
    expect(cards[1].classList.contains("not-typical")).to.equal(true);
    expect(cards[1].title).to.equal("Not typical for your home type");
    // Singular: "1 task", not "1 tasks".
    const water = cards[0].querySelector(".template-card-count")!.textContent!.trim();
    expect(water).to.equal("1 task");
  });

  it("shows no recommended section without recommendations", async () => {
    const plain = { ...TEMPLATES, templates: TEMPLATES.templates.map((tpl) => ({ ...tpl, recommended: false })) };
    const { el } = await mountPanel([obj("e1", [task()])], { "maintenance_supporter/templates": () => plain });
    await (el as any)._openTemplateGallery();
    await el.updateComplete;
    expect(sr(el).querySelector(".template-cat.recommended")).to.equal(null);
  });
});
