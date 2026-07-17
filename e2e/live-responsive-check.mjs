/** Live responsive sweep against ha-maint: render the panel's overview tabs
 *  (Today / Dashboard / Calendar / Settings) at phone + tablet viewports
 *  (iPhone, small Android, iPad mini/10.2/Pro 12.9, generic Android tablets,
 *  portrait AND landscape), screenshot each, and flag horizontal overflow
 *  programmatically (page-level scrollWidth + any panel element wider than
 *  the viewport that is not inside an intentional overflow-x container). */
import { chromium } from "@playwright/test";
import { loadToken, watchdog, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
watchdog(12 * 60e3, "responsive sweep");

const DEVICES = [
  { name: "phone-360",            w: 360,  h: 800,  scale: 2 },  // small Android
  { name: "phone-390",            w: 390,  h: 844,  scale: 2 },  // iPhone 14
  { name: "ipad-mini-portrait",   w: 744,  h: 1133, scale: 2 },
  { name: "ipad-mini-landscape",  w: 1133, h: 744,  scale: 2 },
  { name: "ipad-portrait",        w: 810,  h: 1080, scale: 2 },
  { name: "ipad-landscape",       w: 1080, h: 810,  scale: 2 },
  { name: "ipad-pro13-portrait",  w: 1024, h: 1366, scale: 2 },
  { name: "ipad-pro13-landscape", w: 1366, h: 1024, scale: 2 },
  { name: "androidtab-portrait",  w: 800,  h: 1280, scale: 2 },
  { name: "androidtab-landscape", w: 1280, h: 800,  scale: 2 },
];
const TABS = ["today", "dashboard", "calendar", "settings"];

const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;

const token = loadToken();
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const findings = [];

// optional argv[3]: comma-separated device-name prefixes to run a subset
const only = (process.argv[3] || "").split(",").filter(Boolean);
const RUN = only.length ? DEVICES.filter((d) => only.some((o) => d.name.startsWith(o))) : DEVICES;
// optional argv[4]: comma-separated tab subset (default: all four)
const tabOnly = (process.argv[4] || "").split(",").filter(Boolean);
const RUN_TABS = tabOnly.length ? TABS.filter((t2) => tabOnly.includes(t2)) : TABS;

for (const dev of RUN) {
  const ctx = await b.newContext({
    viewport: { width: dev.w, height: dev.h },
    deviceScaleFactor: dev.scale,
    isMobile: dev.w < 500,
    hasTouch: true,
    colorScheme: "dark",
  });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  let mounted = false;
  for (let i = 0; i < 30 && !mounted; i++) {
    await p.waitForTimeout(1000);
    mounted = await p.evaluate(({ finder }) => {
      eval(finder);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
    }, { finder: deepFindPanel }).catch(() => false);
  }
  if (!mounted) { findings.push(`${dev.name}: PANEL NEVER MOUNTED`); await ctx.close(); continue; }

  for (const tab of RUN_TABS) {
    await p.evaluate(({ finder, tab: t2 }) => {
      eval(finder);
      window.__panel._view = "overview";
      window.__panel._overviewTab = t2;
    }, { finder: deepFindPanel, tab });
    await p.waitForTimeout(tab === "settings" ? 2200 : 1400);

    const overflow = await p.evaluate(({ finder }) => {
      eval(finder);
      const panel = window.__panel;
      const vw = window.innerWidth;
      const issues = [];
      // 1. page-level horizontal scroll (body must never scroll sideways)
      if (document.documentElement.scrollWidth > vw + 1) {
        issues.push(`PAGE overflows: scrollWidth ${document.documentElement.scrollWidth} > viewport ${vw}`);
      }
      // 2. panel-shadow elements that stick out past the viewport, unless an
      //    ancestor is an intentional overflow-x scroller.
      const scrollsX = (el) => {
        for (let a = el; a && a !== document.body; a = a.parentElement || (a.getRootNode && a.getRootNode().host)) {
          try {
            const ox = getComputedStyle(a).overflowX;
            if ((ox === "auto" || ox === "scroll") && a !== el) return true;
          } catch { /* detached */ }
        }
        return false;
      };
      const stack = [panel.shadowRoot];
      let seen = 0;
      const offenders = new Map();
      while (stack.length && seen < 20000) {
        const root = stack.pop();
        for (const el of root.querySelectorAll("*")) {
          seen++;
          if (el.shadowRoot) stack.push(el.shadowRoot);
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.right > vw + 8 && !scrollsX(el)) {
            const key = el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : "");
            offenders.set(key, Math.max(offenders.get(key) || 0, Math.round(r.right - vw)));
          }
        }
      }
      for (const [k, px] of [...offenders].slice(0, 6)) issues.push(`${k} sticks out ${px}px`);
      return issues;
    }, { finder: deepFindPanel }).catch((e) => [`overflow check failed: ${e}`]);

    const shot = `${OUT}/resp-${dev.name}-${tab}.png`;
    await p.screenshot({ path: shot });
    if (overflow.length) {
      findings.push(`${dev.name} / ${tab}: ${overflow.join("; ")}`);
      log(`  !! ${dev.name}/${tab}:`, overflow.join("; "));
    } else {
      log(`  ok ${dev.name}/${tab}`);
    }
  }
  await ctx.close();
}

await b.close();
log("");
if (findings.length) {
  log("FINDINGS:");
  for (const f of findings) log(" -", f);
} else {
  log("NO OVERFLOW FINDINGS — all device/tab combinations clean");
}
