import { chromium } from "playwright";

const HA = "http://homeassistant-dev:8123";
const REFRESH = process.env.HA_REFRESH_TOKEN;
if (!REFRESH) { console.error("Set HA_REFRESH_TOKEN env var"); process.exit(1); }

const browser = await chromium.connect("ws://localhost:3000");
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "de" });
const page = await ctx.newPage();

await page.goto(HA);
await page.waitForTimeout(1000);
await page.evaluate((refresh) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    hassUrl: "http://homeassistant-dev:8123",
    clientId: "http://homeassistant-dev:8123/",
    refresh_token: refresh,
    access_token: "",
    token_type: "Bearer",
    expires_in: 1800,
    expires: 0,
  }));
}, REFRESH);
await page.goto(HA + "/maintenance-supporter");
await page.waitForTimeout(6000);

function getPanel() {
  return "var ha = document.querySelector('home-assistant'); " +
    "var main = ha && ha.shadowRoot && ha.shadowRoot.querySelector('home-assistant-main'); " +
    "var drawer = main && main.shadowRoot && main.shadowRoot.querySelector('ha-drawer'); " +
    "var resolver = drawer && drawer.querySelector('partial-panel-resolver'); " +
    "var custom = resolver && resolver.querySelector('ha-panel-custom'); " +
    "var p = custom && custom.querySelector('maintenance-supporter-panel'); ";
}

var info = await page.evaluate("{ " + getPanel() +
  "var result = []; " +
  "if (p && p._objects) { " +
  "  for (var i = 0; i < p._objects.length; i++) { " +
  "    var obj = p._objects[i]; " +
  "    var tasks = []; " +
  "    if (obj.tasks) for (var j = 0; j < obj.tasks.length; j++) tasks.push({ id: obj.tasks[j].id, name: obj.tasks[j].name }); " +
  "    result.push({ entry_id: obj.entry_id, name: obj.object.name, tasks: tasks }); " +
  "  } " +
  "} " +
  "JSON.stringify(result); " +
  "}");
var data = JSON.parse(info);
var entryId = data[0].entry_id;
var taskId = data[0].tasks[0].id;
var objName = data[0].name;
var taskName = data[0].tasks[0].name;

await page.evaluate("{ " + getPanel() + "if (p) p._showTask('" + entryId + "', '" + taskId + "'); }");
await page.waitForTimeout(2000);

await page.evaluate("{ " + getPanel() +
  "if (p) { var dlg = p.shadowRoot.querySelector('maintenance-qr-dialog'); " +
  "dlg.openForTask('" + entryId + "', '" + taskId + "', '" + objName + "', '" + taskName + "'); } }");
await page.waitForTimeout(3000);

await page.screenshot({ path: "screenshots/qr_dialog_view.png" });
console.log("QR dialog (view) screenshot done");

var s1 = await page.evaluate("{ " + getPanel() +
  "var dlg = p && p.shadowRoot && p.shadowRoot.querySelector('maintenance-qr-dialog'); " +
  "var sr = dlg && dlg.shadowRoot; " +
  "var result = { toggleButtons: [], url: '', error: '' }; " +
  "if (sr) { " +
  "  var btns = sr.querySelectorAll('.toggle-btn'); " +
  "  for (var i = 0; i < btns.length; i++) result.toggleButtons.push({ text: btns[i].textContent.trim(), active: btns[i].classList.contains('active') }); " +
  "  var urlEl = sr.querySelector('.url-display'); " +
  "  if (urlEl) result.url = urlEl.textContent.trim(); " +
  "  var errEl = sr.querySelector('.error'); " +
  "  if (errEl) result.error = errEl.textContent.trim(); " +
  "} " +
  "JSON.stringify(result); }");
console.log("State (view):", s1);

await page.evaluate("{ " + getPanel() +
  "var dlg = p && p.shadowRoot && p.shadowRoot.querySelector('maintenance-qr-dialog'); " +
  "var sr = dlg && dlg.shadowRoot; " +
  "var btns = sr && sr.querySelectorAll('.toggle-btn'); " +
  "if (btns && btns.length > 1) btns[1].click(); }");
await page.waitForTimeout(3000);

await page.screenshot({ path: "screenshots/qr_dialog_complete.png" });

var s2 = await page.evaluate("{ " + getPanel() +
  "var dlg = p && p.shadowRoot && p.shadowRoot.querySelector('maintenance-qr-dialog'); " +
  "var sr = dlg && dlg.shadowRoot; " +
  "var result = { toggleButtons: [], url: '', error: '' }; " +
  "if (sr) { " +
  "  var btns = sr.querySelectorAll('.toggle-btn'); " +
  "  for (var i = 0; i < btns.length; i++) result.toggleButtons.push({ text: btns[i].textContent.trim(), active: btns[i].classList.contains('active') }); " +
  "  var urlEl = sr.querySelector('.url-display'); " +
  "  if (urlEl) result.url = urlEl.textContent.trim(); " +
  "  var errEl = sr.querySelector('.error'); " +
  "  if (errEl) result.error = errEl.textContent.trim(); " +
  "} " +
  "JSON.stringify(result); }");
console.log("State (complete):", s2);

await ctx.close();
await browser.close();
console.log("Done!");
