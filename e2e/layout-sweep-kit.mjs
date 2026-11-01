/** Shared parts of the screen-size sweeps (live-screen-sizes-sweep.mjs for
 * every panel surface, live-beta-editor-viewports.mjs for the beta editor):
 * ONE device list, the in-page layout measurement, the tap check and the
 * result log. */

// Phones portrait and held sideways, iPads both ways, both sides of HA's
// 870 px breakpoint (sidebar a drawer below, docked above), laptops, full
// HD, QHD (also a 4K screen at 150 %) and 4K at 100 %.
export const DEVICES = [
  { name: "phone-320", width: 320, height: 640, mobile: true, dpr: 2 },
  { name: "fold-cover", width: 344, height: 882, mobile: true, dpr: 3 },
  { name: "phone-360", width: 360, height: 800, mobile: true, dpr: 3 },
  { name: "iphone-se", width: 375, height: 667, mobile: true, dpr: 2 },
  { name: "phone-390", width: 390, height: 844, mobile: true, dpr: 3 },
  { name: "phone-412", width: 412, height: 915, mobile: true, dpr: 2.625 },
  { name: "iphone-max", width: 430, height: 932, mobile: true, dpr: 3 },
  { name: "iphone-se-landscape", width: 667, height: 375, mobile: true, dpr: 2 },
  { name: "phone-landscape", width: 844, height: 390, mobile: true, dpr: 3 },
  { name: "ipad-mini", width: 744, height: 1133, mobile: true, dpr: 2 },
  { name: "tablet-768", width: 768, height: 1024, mobile: true, dpr: 2 },
  { name: "ipad-air", width: 820, height: 1180, mobile: true, dpr: 2 },
  { name: "edge-870", width: 870, height: 900, mobile: false, dpr: 1 },
  { name: "edge-880", width: 880, height: 900, mobile: false, dpr: 1 },
  { name: "ipad-pro-13", width: 1024, height: 1366, mobile: true, dpr: 2 },
  { name: "tablet-landscape", width: 1024, height: 768, mobile: true, dpr: 2 },
  { name: "ipad-mini-landscape", width: 1133, height: 744, mobile: true, dpr: 2 },
  { name: "ipad-air-landscape", width: 1180, height: 820, mobile: true, dpr: 2 },
  { name: "laptop-1280", width: 1280, height: 800, mobile: false, dpr: 1 },
  { name: "ipad-pro-13-landscape", width: 1366, height: 1024, mobile: true, dpr: 2 },
  { name: "desktop-1440", width: 1440, height: 900, mobile: false, dpr: 1 },
  { name: "fhd-1920", width: 1920, height: 1080, mobile: false, dpr: 1 },
  { name: "qhd-2560", width: 2560, height: 1440, mobile: false, dpr: 1 },
  { name: "uhd-4k", width: 3840, height: 2160, mobile: false, dpr: 1 },
];

/** `VIEWPORTS=phone-360,uhd-4k` picks devices by name; unset = all of them. */
export function pickDevices(spec, all = DEVICES) {
  const names = (spec || "").split(",").filter(Boolean);
  const unknown = names.filter((n) => !all.some((d) => d.name === n));
  if (unknown.length) throw new Error(`unknown viewports: ${unknown.join(", ")} (known: ${all.map((d) => d.name).join(", ")})`);
  return names.length ? all.filter((d) => names.includes(d.name)) : all;
}

/** A user who once picked a language keeps it on the server, and that beats
 *  the browser's `selectedLanguage` (ha-maint's admin showed English in the
 *  German runs). Sets both through `frontend/set_user_data`; `restore()`
 *  puts the user's own choice back. */
export async function languageSwitcher(api) {
  const before = (await api.send({ type: "frontend/get_user_data", key: "language" }).catch(() => null))?.value ?? null;
  const set = (lang) => api.send({
    type: "frontend/set_user_data", key: "language",
    value: { language: lang, number_format: "language", time_format: "language", date_format: "language", first_weekday: "language" },
  });
  const restore = () => api.send({ type: "frontend/set_user_data", key: "language", value: before }).catch(() => {});
  return { set, restore };
}

/** Playwright context options for a device; Firefox knows no isMobile. */
export function contextOptions(browserName, device, lang) {
  const opts = { viewport: { width: device.width, height: device.height }, deviceScaleFactor: device.dpr, locale: lang === "en" ? "en-US" : lang };
  if (device.mobile && browserName !== "firefox") Object.assign(opts, { isMobile: true, hasTouch: true });
  return opts;
}

/** Runs in the page on a root: elements past the window, spilled boxes, and
 *  sideways overflow of the boxes that scroll or clip (`opts.boxes`).
 *  "Past the window" skips what a box clips or scrolls sideways on purpose
 *  (a tab bar, a chip row): it cannot show past the edge. A fixed element
 *  escapes its ancestors' clip, so it counts again. */
export function inspect(root, opts) {
  const out = { past: [], spilled: [], hidden: [] };
  const name = (el) => `${el.tagName.toLowerCase()}${[...(el.classList || [])].slice(0, 2).map((c) => "." + c).join("")}`;
  const visit = (node, clipped) => {
    for (const el of node.children) check(el, clipped);
  };
  const check = (el, clippedAbove) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none") return;
    const clipped = clippedAbove && cs.position !== "fixed";
    if (cs.visibility !== "hidden" && el.getClientRects().length > 0) {
      const r = el.getBoundingClientRect();
      if (!clipped && r.width > 0 && (r.right > opts.width + 1 || r.left < -1)) out.past.push(`${name(el)} ${Math.round(r.left)}..${Math.round(r.right)}`);
      if (el.clientWidth) {
        if (cs.overflowX === "visible" && cs.display !== "contents" && el.scrollWidth > el.clientWidth + 1) out.spilled.push(`${name(el)} ${el.scrollWidth}>${el.clientWidth}`);
        if (opts.boxes.some((sel) => el.matches?.(sel)) && el.scrollWidth > el.clientWidth + 1) out.hidden.push(`${name(el)} ${el.scrollWidth}>${el.clientWidth}`);
      }
    }
    const below = clipped || cs.overflowX !== "visible";
    if (el.shadowRoot) visit(el.shadowRoot, below);
    visit(el, below);
  };
  visit(root.shadowRoot || root, false);
  return out;
}

// HA's own components draw outside their boxes by design (ripples, focus
// rings, an input's hidden measuring span); only ours are judged.
const OURS = /^(div|span|button|aside|h3|section|label|ol|li|p|a|table|td|th|tr)[.\s]|^(maintenance-|ms-)/;

/** `boxes`: the scrolling / clipping boxes whose sideways overflow counts. */
export async function measureAt(locator, device, boxes) {
  const r = await locator.evaluate(inspect, { width: device.width, boxes });
  return {
    past: r.past.filter((s) => OURS.test(s)),
    spilled: r.spilled.filter((s) => OURS.test(s)),
    hidden: r.hidden,
  };
}

/** Scrolled into view, does a tap at the given spot of the element land on
 *  it (`where`: "center" or "left", 12 px in from its left edge)? A phone
 *  held sideways once left Save below the screen with nothing to scroll;
 *  HA 2026.11's docked sidebar lay over the left of the panel's overlays. */
export async function tapLands(locator, where = "center") {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await new Promise((r) => setTimeout(r, 300));
  return locator.evaluate((b, spot) => {
    const r = b.getBoundingClientRect();
    const x = spot === "left" ? r.left + Math.min(12, r.width / 2) : r.left + r.width / 2;
    const y = r.top + r.height / 2;
    if (y < 0 || y > innerHeight || x < 0 || x > innerWidth) return false;
    let t = document.elementFromPoint(x, y);
    while (t?.shadowRoot) {
      const inner = t.shadowRoot.elementFromPoint(x, y);
      if (!inner || inner === t) break;
      t = inner;
    }
    for (let n = t; n; n = n.assignedSlot || n.parentElement || n.getRootNode()?.host || null) {
      if (n === b) return true;
    }
    return false;
  }, where);
}

/** The page and the panel never scroll sideways. */
export async function sidewaysScroll(page) {
  return page.evaluate(() => {
    const out = [];
    const doc = document.documentElement;
    if (doc.scrollWidth > innerWidth + 1) out.push(`page scrolls sideways (${doc.scrollWidth} > ${innerWidth})`);
    const panel = document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot
      ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");
    if (panel && panel.scrollWidth > panel.clientWidth + 1) out.push(`panel scrolls sideways (${panel.scrollWidth} > ${panel.clientWidth})`);
    return out;
  });
}

/** Result log: one line per check, failures repeated at the end. */
export function createReport({ shotsDir = "", log = console.log } = {}) {
  const results = [];
  const failures = [];
  const record = (combo, surface, m, extra = []) => {
    const problems = [
      ...m.past.slice(0, 3).map((s) => `past the window: ${s}`),
      ...m.spilled.slice(0, 3).map((s) => `spilled: ${s}`),
      ...m.hidden.slice(0, 3).map((s) => `hidden sideways: ${s}`),
      ...extra,
    ];
    results.push({ combo, surface, ok: !problems.length, problems });
    if (problems.length) failures.push(`${combo} ${surface}: ${problems.join(" | ")}`);
    log(`${problems.length ? "FAIL" : "ok  "} ${combo.padEnd(38)} ${surface}${problems.length ? "  — " + problems.join(" | ") : ""}`);
  };
  const shot = async (page, combo, name) => {
    if (!shotsDir) return;
    await page.screenshot({ path: `${shotsDir}/${combo}-${name}.png` }).catch(() => {});
  };
  const errorShot = async (ctx, combo) => {
    if (!shotsDir) return;
    const pages = ctx.pages();
    if (pages[0]) await pages[0].screenshot({ path: `${shotsDir}/${combo.replaceAll("/", "-")}-error.png` }).catch(() => {});
  };
  const summary = () => {
    log(`\n${results.length - failures.length}/${results.length} checks passed`);
    if (failures.length) log("FAILURES:\n  " + failures.join("\n  "));
  };
  return { results, failures, record, shot, errorShot, summary };
}

export const NO_LAYOUT_PROBLEMS = { past: [], spilled: [], hidden: [] };
