/** Verify the dashboard strategy registers in HA 2026.5+'s frontend.
 *
 * Headless Chromium logs into ha-maint, then evaluates window.customStrategies
 * to confirm our entry is there. Plus tries the actual generate() call to make
 * sure the WS round-trip works.
 *
 * Run after: npm run build && docker restart ha-maint
 *   node verify-strategy.mjs
 */
import { chromium } from "playwright";

const HA = "http://localhost:8125";
const HA_TOKEN = process.env.HA_TOKEN;
if (!HA_TOKEN) {
  console.error("Set HA_TOKEN env var (long-lived access token).");
  process.exit(1);
}

// HA expects a *refresh* token in localStorage, not an LLAT. Quick refresh-token
// dance: hit /auth/login_flow with username/password.
async function getRefreshToken() {
  async function post(path, body, ctype = "application/json") {
    const data = typeof body === "string" ? body : JSON.stringify(body);
    const r = await fetch(`${HA}${path}`, {
      method: "POST",
      headers: { "Content-Type": ctype },
      body: data,
    });
    return await r.json();
  }
  const flow = await post("/auth/login_flow", {
    client_id: `${HA}/`,
    handler: ["homeassistant", null],
    redirect_uri: `${HA}/`,
  });
  const auth = await post(`/auth/login_flow/${flow.flow_id}`, {
    client_id: `${HA}/`,
    username: "dev",
    password: "dev",
  });
  const tokens = await post(
    "/auth/token",
    `grant_type=authorization_code&code=${auth.result}&client_id=${HA}/`,
    "application/x-www-form-urlencoded",
  );
  return tokens.refresh_token;
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

const refreshToken = await getRefreshToken();
await page.goto(HA);
await page.waitForTimeout(1000);
await page.evaluate(({ ha, r }) => {
  localStorage.setItem(
    "hassTokens",
    JSON.stringify({
      hassUrl: ha,
      clientId: `${ha}/`,
      refresh_token: r,
      access_token: "",
      token_type: "Bearer",
      expires_in: 1800,
      expires: 0,
    }),
  );
}, { ha: HA, r: refreshToken });
await page.goto(HA);
await page.waitForTimeout(8000); // let frontend extra modules load

const result = await page.evaluate(async () => {
  const out = {};

  // 1. window.customStrategies populated?
  out.customStrategies = (window.customStrategies || []).map((s) => ({
    type: s.type,
    strategyType: s.strategyType,
    name: s.name,
  }));

  // 2. Custom element registered?
  out.elementRegistered = !!customElements.get(
    "ll-strategy-dashboard-maintenance-supporter",
  );

  // 3. Try the actual generate() call in ALL group_by modes
  try {
    const StrategyClass = customElements.get(
      "ll-strategy-dashboard-maintenance-supporter",
    );
    const ha = document.querySelector("home-assistant");
    if (StrategyClass?.generate && ha?.hass) {
      for (const mode of ["area", "status", "floor", "due_date"]) {
        const cfg = await StrategyClass.generate(
          { type: "custom:maintenance-supporter", group_by: mode },
          ha.hass,
        );
        out[`generated_${mode}`] = {
          viewCount: cfg.views?.length ?? 0,
          viewTitles: (cfg.views || []).map((v) => v.title),
        };
      }
    }
  } catch (e) {
    out.generateError = String(e);
  }

  // 4. Editor element registered + setConfig works + dispatches event
  try {
    out.editorRegistered = !!customElements.get(
      "hui-maintenance-supporter-strategy-editor",
    );
    if (out.editorRegistered) {
      const StrategyClass = customElements.get(
        "ll-strategy-dashboard-maintenance-supporter",
      );
      const editor = await StrategyClass.getConfigElement();
      document.body.appendChild(editor);
      editor.setConfig({
        type: "custom:maintenance-supporter",
        group_by: "status",
      });
      const select = editor.querySelector("select");
      out.editorPreselected = select?.value;
      let dispatchedConfig = null;
      editor.addEventListener("config-changed", (e) => {
        dispatchedConfig = e.detail.config;
      });
      select.value = "due_date";
      select.dispatchEvent(new Event("change"));
      out.editorDispatched = dispatchedConfig;
      editor.remove();
    }
  } catch (e) {
    out.editorError = String(e);
  }

  // 5. v1.8.0 — Header + Sidebar present on Overview view
  try {
    const StrategyClass = customElements.get(
      "ll-strategy-dashboard-maintenance-supporter",
    );
    const ha = document.querySelector("home-assistant");
    if (StrategyClass?.generate && ha?.hass) {
      const cfg = await StrategyClass.generate(
        { type: "custom:maintenance-supporter" },
        ha.hass,
      );
      const overview = cfg.views?.find((v) => v.path === "overview");
      out.overviewHeader = overview?.header?.card?.type;
      out.overviewSidebar = overview?.sidebar?.sections?.[0]?.cards?.length ?? 0;
      out.overviewSidebarVisibility =
        overview?.sidebar?.visibility?.[0]?.condition;
    }
  } catch (e) {
    out.overviewError = String(e);
  }

  // 6. v1.8.0 — Section strategy registered + generates
  try {
    out.sectionStrategyInRegistry = (window.customStrategies || []).some(
      (s) => s.type === "maintenance-supporter-section" && s.strategyType === "section",
    );
    out.sectionElementRegistered = !!customElements.get(
      "ll-strategy-section-maintenance-supporter-section",
    );
    const SectionClass = customElements.get(
      "ll-strategy-section-maintenance-supporter-section",
    );
    const ha = document.querySelector("home-assistant");
    if (SectionClass?.generate && ha?.hass) {
      const sec = await SectionClass.generate(
        {
          type: "custom:maintenance-supporter-section",
          filter_status: ["overdue", "triggered"],
          title: "Hot list",
        },
        ha.hass,
      );
      out.sectionGenerated = {
        type: sec.type,
        cardCount: sec.cards?.length ?? 0,
        firstCardType: sec.cards?.[0]?.type,
        lastCardType: sec.cards?.[sec.cards.length - 1]?.type,
      };
    }
  } catch (e) {
    out.sectionError = String(e);
  }

  // 7. v1.8.1 — fire-dom-event handler intercepts maintenance-supporter:* events
  //    and rewrites the URL so the panel can pick up ms_action on next nav.
  try {
    const startPath = window.location.pathname + window.location.search;
    let routeFiredPath = null;
    const onLocationChanged = () => {
      routeFiredPath = window.location.pathname + window.location.search;
    };
    window.addEventListener("location-changed", onLocationChanged, { once: true });

    document.dispatchEvent(
      new CustomEvent("ll-custom", {
        detail: { type: "maintenance-supporter:add-object" },
        bubbles: true,
        composed: true,
      }),
    );
    // Allow the handler to run synchronously (it is sync)
    out.fireDomNewPath = window.location.pathname + window.location.search;
    out.fireDomEventDispatched = routeFiredPath;
    // Reset the URL for any later checks
    history.replaceState(history.state, "", startPath);
  } catch (e) {
    out.fireDomError = String(e);
  }

  // 4. HA version
  const ha = document.querySelector("home-assistant");
  out.haVersion = ha?.hass?.config?.version;

  return out;
});

console.log(JSON.stringify(result, null, 2));

const ours = result.customStrategies.find(
  (s) => s.type === "maintenance-supporter",
);
const okRegister = !!ours;
const okElement = result.elementRegistered;
const okArea = (result.generated_area?.viewCount ?? 0) > 0;
const okStatus = (result.generated_status?.viewCount ?? 0) > 0;
const okFloor = (result.generated_floor?.viewCount ?? 0) > 0;
const okDueDate = (result.generated_due_date?.viewCount ?? 0) > 0;
const okEditor =
  result.editorRegistered === true &&
  result.editorPreselected === "status" &&
  result.editorDispatched?.group_by === "due_date";
const okHeader = result.overviewHeader === "markdown";
const okSidebar =
  (result.overviewSidebar ?? 0) > 0 &&
  result.overviewSidebarVisibility === "view_columns";
const okSection =
  result.sectionStrategyInRegistry === true &&
  result.sectionElementRegistered === true &&
  (result.sectionGenerated?.cardCount ?? 0) >= 2 &&
  result.sectionGenerated?.firstCardType === "heading" &&
  result.sectionGenerated?.lastCardType === "custom:maintenance-supporter-card";
const okFireDom =
  typeof result.fireDomNewPath === "string" &&
  result.fireDomNewPath.includes("ms_action=add_object") &&
  typeof result.fireDomEventDispatched === "string" &&
  result.fireDomEventDispatched.includes("ms_action=add_object");

console.log(
  "\n=== SUMMARY ===\n" +
    `  HA version:                       ${result.haVersion}\n` +
    `  customStrategies has our entry:    ${okRegister ? "✓" : "✗"}\n` +
    `  custom element registered:        ${okElement ? "✓" : "✗"}\n` +
    `  generate(group_by=area):          ${okArea ? "✓" : "✗"} (${result.generated_area?.viewCount} views)\n` +
    `  generate(group_by=status):        ${okStatus ? "✓" : "✗"} (${result.generated_status?.viewCount} views)\n` +
    `  generate(group_by=floor):         ${okFloor ? "✓" : "✗"} (${result.generated_floor?.viewCount} views)\n` +
    `  generate(group_by=due_date):      ${okDueDate ? "✓" : "✗"} (${result.generated_due_date?.viewCount} views)\n` +
    `  editor registered + works:        ${okEditor ? "✓" : "✗"}\n` +
    `  Overview has KPI header:          ${okHeader ? "✓" : "✗"} (${result.overviewHeader})\n` +
    `  Overview has sidebar (large):     ${okSidebar ? "✓" : "✗"} (${result.overviewSidebar} cards, visibility=${result.overviewSidebarVisibility})\n` +
    `  Section strategy registered+works: ${okSection ? "✓" : "✗"} (${result.sectionGenerated?.cardCount} cards)\n` +
    `  fire-dom-event handler routes:    ${okFireDom ? "✓" : "✗"} (path=${result.fireDomNewPath}, event-fired=${result.fireDomEventDispatched})`,
);

await browser.close();
process.exit(
  okRegister &&
    okElement &&
    okArea &&
    okStatus &&
    okFloor &&
    okDueDate &&
    okEditor &&
    okHeader &&
    okSidebar &&
    okSection &&
    okFireDom
    ? 0
    : 1,
);
