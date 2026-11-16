/**
 * Two versions of our bundles in one window (2026-11-16, prod, after the
 * update to 2.123.0 and before Home Assistant's restart): the Companion app
 * still ran the 2.122.0 card, which had fetched the 2.122.0 German table into
 * the store every bundle shares; the panel, opened after the update, came as
 * 2.123.0, found a German table and fetched none. Every text it added read in
 * English ("Result: one is enough"), and a reworded one in the old German.
 * The translations themselves were complete. Pins:
 *   - each version reads its own tables first; an older bundle's table is
 *     only a fallback and does not count as this version's
 *   - an older bundle's fetch, pending or failed, does not stand in for ours
 *   - the window knows when it runs another version, and the panel asks for
 *     the reload that brings it onto one version again
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { BUNDLE_VERSION, otherBundleVersions } from "../helpers/bundle-version.js";
import { ensureLocale, isLocaleLoaded, t, windowMixesVersions } from "../helpers/locale-core.js";
import { createMockHass } from "./_test-utils.js";
import "../maintenance-panel.js";

type Globals = {
  store: Record<string, Record<string, string>>;
  inflight: Record<string, Promise<void>>;
  failedAt: Record<string, number>;
  byVersion: Record<string, Record<string, Record<string, string>>>;
  storeFrom: Record<string, string>;
};
const g = (): Globals => (window as unknown as { __msLocales: Globals }).__msLocales;
const versions = (): string[] => (window as unknown as { __msBundleVersions: string[] }).__msBundleVersions;

/** Forget German everywhere, as in a fresh window. */
function clearGerman(): void {
  const s = g();
  delete s.store.de;
  delete s.storeFrom.de;
  delete s.inflight.de;
  delete s.failedAt.de;
  delete s.inflight[`de@${BUNDLE_VERSION}`];
  delete s.failedAt[`de@${BUNDLE_VERSION}`];
  for (const tables of Object.values(s.byVersion)) delete tables.de;
}

const OLD_DE = { timeline_ok_after: "nach {duration} wieder OK", only_old: "nur alt" };
const NEW_DE = { timeline_ok_after: "{duration} lang, dann wieder OK", timeline_result_any: "Ergebnis: eins genügt" };

async function withFetch<T>(body: Record<string, string> | null, run: (urls: string[]) => Promise<T>): Promise<T> {
  const realFetch = window.fetch;
  const urls: string[] = [];
  window.fetch = ((url: string) => {
    urls.push(String(url));
    return Promise.resolve(body ? new Response(JSON.stringify(body), { status: 200 }) : new Response("", { status: 404 }));
  }) as typeof window.fetch;
  try {
    return await run(urls);
  } finally {
    window.fetch = realFetch;
  }
}

describe("locale tables per version (2026-11-16)", () => {
  afterEach(clearGerman);

  it("an older bundle's German table does not keep this version's texts English", async () => {
    // The 2.122.0 card fetched first: the shared table, without a version.
    g().store.de = { ...OLD_DE };
    expect(isLocaleLoaded("de"), "another version's table is not ours").to.be.false;
    // Until ours arrives, the older German still beats English.
    expect(t("timeline_ok_after", "de")).to.equal(OLD_DE.timeline_ok_after);

    await withFetch(NEW_DE, async (urls) => {
      await ensureLocale("de");
      expect(urls).to.deep.equal([`/maintenance_supporter_locales/de.json?v=${BUNDLE_VERSION}`]);
      await ensureLocale("de");
      expect(urls.length, "fetched once").to.equal(1);
    });

    expect(isLocaleLoaded("de")).to.be.true;
    expect(t("timeline_result_any", "de"), "a new text reads in German").to.equal(NEW_DE.timeline_result_any);
    expect(t("timeline_ok_after", "de"), "a reworded text reads as this version has it").to.equal(NEW_DE.timeline_ok_after);
    // The older bundle reads the shared table: it keeps its wording and its
    // keys, and gains the ones it lacks.
    expect(g().store.de.timeline_ok_after).to.equal(OLD_DE.timeline_ok_after);
    expect(g().store.de.only_old).to.equal("nur alt");
    expect(g().store.de.timeline_result_any).to.equal(NEW_DE.timeline_result_any);
  });

  it("an older bundle's pending or failed fetch does not stand in for this one", async () => {
    // A bundle from before 2026-11-16 keeps its fetch under the language alone.
    g().inflight.de = Promise.resolve();
    g().failedAt.de = Date.now();
    await withFetch(NEW_DE, async (urls) => {
      await ensureLocale("de");
      expect(urls.length).to.equal(1);
    });
    expect(t("timeline_result_any", "de")).to.equal(NEW_DE.timeline_result_any);
  });

  it("this version's failed fetch leaves the older German in place, then this version's English", async () => {
    g().store.de = { ...OLD_DE };
    const sharedEn = g().store.en.timeline_result_any;
    // The older bundle's English had other wording for it.
    g().store.en.timeline_result_any = "Old English wording";
    try {
      await withFetch(null, async () => {
        await ensureLocale("de");
      });
      expect(isLocaleLoaded("de")).to.be.false;
      expect(t("timeline_ok_after", "de")).to.equal(OLD_DE.timeline_ok_after);
      expect(t("timeline_result_any", "de")).to.equal(t("timeline_result_any", "en"));
      expect(t("timeline_result_any", "de")).to.not.equal("Old English wording");
    } finally {
      g().store.en.timeline_result_any = sharedEn;
    }
  });
});

describe("a window that runs two versions of ours", () => {
  afterEach(() => {
    clearGerman();
    const list = versions();
    for (let i = list.length - 1; i >= 0; i--) if (list[i] !== BUNDLE_VERSION) list.splice(i, 1);
  });

  it("knows it from a bundle that said so on load", () => {
    expect(versions()).to.include(BUNDLE_VERSION);
    expect(windowMixesVersions()).to.be.false;
    versions().push("2.123.1");
    expect(otherBundleVersions()).to.deep.equal(["2.123.1"]);
    expect(windowMixesVersions()).to.be.true;
    // The own version and "dev" builds are no other version.
    expect(otherBundleVersions("2.123.1")).to.deep.equal([]);
  });

  it("knows a bundle from before 2026-11-16 by the table it fetched without a version", () => {
    g().store.de = { ...OLD_DE };
    expect(windowMixesVersions()).to.be.true;
  });

  it("is not fooled by the tables this version fetched itself", async () => {
    await withFetch(NEW_DE, async () => {
      await ensureLocale("de");
    });
    expect(g().store.de).to.exist;
    expect(windowMixesVersions()).to.be.false;
  });
});

describe("panel: a window that runs two versions of ours", () => {
  afterEach(() => {
    clearGerman();
    const list = versions();
    for (let i = list.length - 1; i >= 0; i--) if (list[i] !== BUNDLE_VERSION) list.splice(i, 1);
  });

  let asked = 0;
  async function mount(answer: Record<string, unknown>): Promise<HTMLElement> {
    asked = 0;
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/version": () => { asked++; return answer; },
        "maintenance_supporter/statistics": () => ({ total_objects: 0, total_tasks: 0, overdue: 0, due_soon: 0, triggered: 0, ok: 0 }),
        "maintenance_supporter/groups": () => ({ groups: {} }),
      },
    });
    Object.assign(hass, { user: { id: "admin-1", is_admin: true }, areas: {} });
    return fixture<HTMLElement>(html`
      <maintenance-supporter-panel .hass=${hass} style="display:block; height: 600px;"></maintenance-supporter-panel>
    `);
  }
  const RUNNING = { version: "2.123.1", installed_version: "2.123.1", restart_pending: false };
  const PENDING = { version: "2.123.0", installed_version: "2.123.1", restart_pending: true };
  const banner = (el: HTMLElement) => el.shadowRoot!.querySelector(".mixed-versions-banner");
  /** The version answer arrived and the panel drew what it decided. */
  const settle = async (el: HTMLElement) => {
    await waitUntil(() => asked > 0, "version asked", { timeout: 2000 });
    await new Promise((r) => setTimeout(r, 50));
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
  };

  it("asks for a reload when an older card runs next to it", async () => {
    versions().push("2.123.0");
    const el = await mount(RUNNING);
    await waitUntil(() => banner(el), "mixed-versions banner shown", { timeout: 2000 });
    expect(banner(el)!.textContent).to.contain(t("mixed_versions_banner", "en"));
    expect(banner(el)!.querySelector("ha-button")!.textContent!.trim()).to.equal(t("update_reload", "en"));
    el.remove();
  });

  it("says nothing when the window runs one version", async () => {
    const el = await mount(RUNNING);
    await settle(el);
    expect(banner(el) === null, "no banner").to.be.true;
    el.remove();
  });

  it("leaves it to the restart banner while the update waits for Home Assistant", async () => {
    versions().push("2.123.0");
    const el = await mount(PENDING);
    await waitUntil(() => el.shadowRoot!.querySelector(".restart-pending-banner"), "restart banner shown", { timeout: 2000 });
    expect(banner(el) === null, "one banner at a time").to.be.true;
    el.remove();
  });
});
