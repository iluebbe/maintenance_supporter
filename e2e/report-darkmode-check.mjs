/** Does the printable object report survive a dark-mode device?
 *
 * The report is a SELF-CONTAINED html document handed to the OS via
 * `window.open(blob:)`. In the Companion app that lands in a WebView, and a
 * WebView on a dark-themed phone supplies a DARK default background. The
 * document only ever set a text colour, so the result was black text on a
 * black page with the pale `#eee` row borders showing through as stripes.
 *
 * Emulating `colorScheme: "dark"` is exactly that condition, so this check
 * reproduces the report without a phone.
 *
 * It measures RENDERED PIXELS, not computed styles: a document that paints no
 * background reports `rgba(0,0,0,0)` in both schemes while actually looking
 * white in one and black in the other, so computed style cannot tell the two
 * apart — and telling them apart is the whole question.
 *
 * Usage: node e2e/report-darkmode-check.mjs
 */
import { chromium } from "@playwright/test";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const CID = HA + "/";
const USER = "demo", PASS = "demo-pass-1";
const OUT = new URL("./live-shots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const j = (r) => r.json();
const log = (...a) => console.log(...a);

async function login() {
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: USER, password: PASS }),
  }).then(j);
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("login failed: " + JSON.stringify(t));
  return t.access_token;
}

const DEEP = `(pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; }`;

/** Pull the report HTML out of the panel via its own code path. */
async function grabReportHtml(page) {
  await page.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  // The auth callback navigates once more; polling through that navigation
  // throws "execution context destroyed", so settle first and keep the last
  // error instead of swallowing it — a silent retry loop hid a bad client_id
  // for two runs.
  await page.waitForTimeout(8000);
  let ok = false, lastErr = "";
  for (let i = 0; i < 45 && !ok; i++) {
    try {
      ok = await page.evaluate(`(${DEEP})((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL").length > 0`);
    } catch (e) { lastErr = String(e && e.message || e).slice(0, 200); }
    if (!ok) await page.waitForTimeout(1000);
  }
  if (!ok) throw new Error(`panel never mounted (url=${page.url().slice(0, 80)}) ${lastErr}`);
  await page.waitForTimeout(3000);
  return page.evaluate(`(async () => {
    const panel = (${DEEP})((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
    const objects = panel._objects || panel.objects || [];
    const entryId = objects[0] && (objects[0].entry_id || objects[0].entryId);
    if (!entryId) throw new Error("no object to report on");
    let captured = null;
    const realOpen = window.open, realCreate = URL.createObjectURL;
    URL.createObjectURL = (blob) => { captured = blob; return realCreate.call(URL, blob); };
    window.open = () => null;
    try { panel._printObjectReport(entryId); } finally { window.open = realOpen; URL.createObjectURL = realCreate; }
    if (!captured) throw new Error("no report blob produced");
    return await captured.text();
  })()`);
}

function contrast(a, b) {
  const lum = ([r, g, bl]) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
  };
  const [x, y] = [lum(a), lum(b)];
  const [hi, lo] = x > y ? [x, y] : [y, x];
  return (hi + 0.05) / (lo + 0.05);
}

/** Decode the screenshot in a browser canvas and measure what a reader sees. */
async function measurePixels(ctx, pngBase64, headingBox) {
  const probe = await ctx.newPage();
  const res = await probe.evaluate(async ({ b64, box }) => {
    const img = new Image();
    await new Promise((ok, no) => { img.onload = ok; img.onerror = no; img.src = "data:image/png;base64," + b64; });
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    c.getContext("2d").drawImage(img, 0, 0);
    const data = c.getContext("2d").getImageData(0, 0, img.width, img.height).data;
    const at = (x, y) => { const i = (y * img.width + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
    const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Background: the page margin, well away from any content.
    const bg = at(4, 4);
    const bgL = lum(bg);

    // Text: within the heading box, the pixel furthest from the background.
    let ink = bg, best = -1;
    const x0 = Math.max(0, box.x | 0), y0 = Math.max(0, box.y | 0);
    const x1 = Math.min(img.width - 1, (box.x + box.width) | 0);
    const y1 = Math.min(img.height - 1, (box.y + box.height) | 0);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const p = at(x, y), d = Math.abs(lum(p) - bgL);
      if (d > best) { best = d; ink = p; }
    }
    return { bg, ink };
  }, { b64: pngBase64, box: headingBox });
  await probe.close();
  return res;
}

const results = [];

for (const scheme of ["light", "dark"]) {
  // A fresh connection per scheme: a long-lived playwright-server wedges on
  // the SECOND context (evaluate never resolves), which cost one run already.
  // A fresh token per scheme as well: reusing one across two contexts made
  // the second frontend bounce to /auth/authorize mid-startup.
  const token = await login();
  const browser = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1100 }, colorScheme: scheme });
  await ctx.addInitScript(({ t, ha }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: t, token_type: "Bearer", expires_in: 1800,
      hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
    }));
  }, { t: token, ha: HA });

  const page = await ctx.newPage();
  const html = await grabReportHtml(page);
  await page.close();

  // Render it as the WebView does: a bare document, nothing of the panel around.
  const doc = await ctx.newPage();
  await doc.setContent(html, { waitUntil: "load" });
  await doc.waitForTimeout(300);

  const box = await doc.locator("h1").first().boundingBox();
  const shot = await doc.screenshot({ path: OUT + `report-${scheme}.png` });
  const { bg, ink } = await measurePixels(ctx, shot.toString("base64"), box);
  const ratio = contrast(bg, ink);

  const declared = await doc.evaluate(() => ({
    scheme: getComputedStyle(document.documentElement).colorScheme,
    meta: !!document.querySelector('meta[name="color-scheme"]'),
    bodyBg: getComputedStyle(document.body).backgroundColor,
  }));

  // Spread FIRST: declared carries its own .scheme (the CSS one) and would
  // otherwise overwrite the emulated scheme, labelling both rows "light".
  results.push({ ...declared, scheme, bg, ink, ratio });
  log(`${scheme.padEnd(5)} page=rgb(${bg}) text=rgb(${ink}) contrast=${ratio.toFixed(2)}:1  declared-scheme=${declared.scheme} meta=${declared.meta} body-bg=${declared.bodyBg}`);
  await ctx.close();
  await browser.close();
}

let failed = 0;
for (const r of results) {
  if (r.ratio < 4.5) { log(`FAIL ${r.scheme}: ${r.ratio.toFixed(2)}:1 — below the 4.5:1 readability floor`); failed++; }
  else log(`PASS ${r.scheme}: ${r.ratio.toFixed(2)}:1`);
}
log(failed ? `\n${failed} scheme(s) unreadable — screenshots in e2e/live-shots/` : "\nreadable in both schemes");
process.exit(failed ? 1 : 0);
