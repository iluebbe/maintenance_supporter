/**
 * DRY audit 2026-09-26, round 4 — the frontend consolidation backlog
 * (section B "FE"). Behaviour tests for the single sources that replaced
 * the hand-kept copies, plus source tripwires over the raw TypeScript
 * (served by the source-manifest plugin in web-test-runner.config.mjs) so
 * the copies cannot quietly come back:
 *
 *   - helpers/ws-run runWs (busy / reason / reload / success toast) instead
 *     of ~55 hand-written try/catch/describeWsError blocks, runWsEach +
 *     bulkResultMessage for the panel's two bulk loops;
 *   - status-constants STATUS_ORDER / statusRank / ACTIONABLE_STATUSES;
 *   - settings-cache parseSettings as the panel's parser too;
 *   - styles formatQty for stock / quantities;
 *   - task-dialog typeFieldsFromConfig / applyTypeFields for the flat trigger
 *     form and the compound conditions alike;
 *   - helpers/modal-shell (one frame, Escape closes);
 *   - docDisplayName / docCategory / the Python-pinned CATEGORIES;
 *   - photo-upload postMultipart (413 mapping for the archive import);
 *   - calendar-bucket isoDateLocal / isoMinuteLocal;
 *   - helpers/setting-ranges field bounds (pinned to Python in
 *     tests/test_frontend_const_parity.py).
 */

import { expect, fixture, html } from "@open-wc/testing";
import { bulkResultMessage, runWs, runWsEach } from "../helpers/ws-run.js";
import { describeWsError } from "../ws-errors.js";
import { ACTIONABLE_STATUSES, STATUS_ORDER, isActionableStatus, statusRank } from "../status-constants.js";
import { FALLBACK_SETTINGS, invalidateSettingsCache, parseSettings } from "../helpers/settings-cache.js";
import { formatInterval, formatQty, setProfilePrefs, t } from "../styles.js";
import { applyTypeFields, typeFieldsFromConfig } from "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import "../components/task-quick-actions-dialog.js";
import type { MaintenanceTaskQuickActionsDialog } from "../components/task-quick-actions-dialog";
import "../components/object-quick-actions-dialog.js";
import type { MaintenanceObjectQuickActionsDialog } from "../components/object-quick-actions-dialog";
import "../components/history-edit-dialog.js";
import type { MaintenanceHistoryEditDialog } from "../components/history-edit-dialog";
import { CATEGORIES, docCategory, docDisplayName } from "../helpers/document-categories.js";
import { sortDocuments } from "../helpers/document-filter.js";
import { DOCS_ARCHIVE_MAX_BYTES, postMultipart, uploadDocument } from "../helpers/photo-upload.js";
import { isoDateLocal, isoMinuteLocal } from "../helpers/calendar-bucket.js";
import { PART_QTY_RANGE, SCHEDULE_OFFSET_MAX_DAYS } from "../helpers/setting-ranges.js";
import "../components/settings-view.js";
import type { MaintenanceSettingsView } from "../components/settings-view";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass, type SentMessage } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Manifest = Record<string, string>;
let _manifest: Manifest | null = null;
async function sources(): Promise<Manifest> {
  _manifest ??= (await (await fetch("/__source-manifest")).json()) as Manifest;
  return _manifest;
}

/** Every production module whose raw source matches `re`, minus `except`. */
async function offenders(re: RegExp, except: string[] = []): Promise<string[]> {
  const src = await sources();
  return Object.entries(src)
    .filter(([path, text]) => !except.includes(path) && re.test(text))
    .map(([path]) => path);
}

type Host = Parameters<typeof runWs>[0];
function host(answer: (msg: Record<string, unknown>) => unknown): { h: Host; sent: Array<Record<string, unknown>> } {
  const sent: Array<Record<string, unknown>> = [];
  const h = {
    hass: {
      language: "en",
      connection: {
        sendMessagePromise: async (msg: Record<string, unknown>) => {
          sent.push(msg);
          return answer(msg);
        },
      },
    },
  } as unknown as Host;
  return { h, sent };
}

const refusal = { code: "not_found", message: "Task not found" };

describe("DRY round 4 (frontend)", () => {
  // ── runWs ────────────────────────────────────────────────────────────────
  describe("helpers/ws-run runWs", () => {
    it("sends, awaits the reload inside the busy window, then the success toast", async () => {
      const log: string[] = [];
      const { h, sent } = host(() => ({ ok: 1 }));
      const res = await runWs<{ ok: number }>(h, { type: "x/y" }, {
        busy: (b) => log.push(`busy:${b}`),
        reload: async () => { log.push("reload"); },
        successToast: "Done",
        onSuccess: (m) => log.push(`toast:${m}`),
        onError: () => log.push("error"),
      });
      expect(res).to.deep.equal({ ok: 1 });
      expect(sent).to.deep.equal([{ type: "x/y" }]);
      expect(log).to.deep.equal(["busy:true", "reload", "toast:Done", "busy:false"]);
    });

    it("a refusal resolves undefined and hands the localized reason + raw error to onError", async () => {
      const { h } = host(() => { throw refusal; });
      let got: [string, unknown] | null = null;
      let busy = false;
      const res = await runWs(h, { type: "x/y" }, {
        busy: (b) => { busy = b; },
        reload: () => { throw new Error("never reached"); },
        onError: (m, e) => { got = [m, e]; },
      });
      expect(res).to.equal(undefined);
      expect(busy).to.equal(false);
      expect(got![0]).to.equal(describeWsError(refusal, "en"));
      expect(got![1]).to.equal(refusal);
    });

    it("a reload that throws is reported like a failed call", async () => {
      const { h } = host(() => ({}));
      const boom = new Error("boom");
      let msg = "";
      const res = await runWs(h, { type: "x/y" }, {
        reload: () => { throw boom; },
        fallbackKey: "save_error",
        onError: (m) => { msg = m; },
      });
      expect(res).to.equal(undefined);
      expect(msg).to.equal(describeWsError(boom, "en", t("save_error", "en")));
    });

    it("undefined means failed only — a stub resolving undefined is a success (null)", async () => {
      const { h } = host(() => undefined);
      expect(await runWs(h, { type: "x/y" })).to.equal(null);
    });

    it("accepts a call instead of a message (the signed-document helpers)", async () => {
      const { h, sent } = host(() => ({}));
      expect(await runWs(h, async () => 42)).to.equal(42);
      expect(sent.length, "no WS frame for a call").to.equal(0);
      let msg = "";
      await runWs(h, async () => { throw refusal; }, { lang: "de", onError: (m) => { msg = m; } });
      expect(msg).to.equal(describeWsError(refusal, "de"));
    });

    it("runWsEach splits done / failed with the reason; bulkResultMessage names both", async () => {
      const { h } = host((m) => { if (m.id === 2) throw refusal; return {}; });
      const { done, failed } = await runWsEach(h, [1, 2, 3], (id) => ({ type: "x/y", id }));
      expect(done).to.deep.equal([1, 3]);
      expect(failed).to.deep.equal([{ item: 2, message: describeWsError(refusal, "en") }]);
      expect(bulkResultMessage("2 tasks completed", [], "en")).to.equal("2 tasks completed");
      expect(bulkResultMessage("2 tasks completed", failed, "en")).to.equal(
        `2 tasks completed · ${t("bulk_failed", "en").replace("{n}", "1").replace("{reason}", describeWsError(refusal, "en"))}`,
      );
    });
  });

  // ── panel bulk ──────────────────────────────────────────────────────────
  describe("panel bulk loop", () => {
    it("reports how many failed and why; the undo only reverts what went through", async () => {
      resetTaskSeq();
      const { el, sent } = await mountPanel(
        [obj("e1", [task()], "Boiler"), obj("e2", [task()], "Car")],
        {
          "maintenance_supporter/object/archive": (m) => {
            if (m.entry_id === "e2") throw refusal;
            return { success: true };
          },
          "maintenance_supporter/object/unarchive": () => ({ success: true }),
        },
      );
      const p = el as unknown as {
        _objBulkSelected: Set<string>; _objBulkArchive: () => void; _toastMessage: string;
        _toastUndo: (() => void) | null; updateComplete: Promise<unknown>;
      };
      p._objBulkSelected = new Set(["e1", "e2"]);
      p._objBulkArchive();
      await new Promise((r) => setTimeout(r, 60));
      expect(p._toastMessage).to.equal(bulkResultMessage(
        t("bulk_objects_archived", "en").replace("{n}", "1"),
        [{ item: "e2", message: describeWsError(refusal, "en") }],
        "en",
      ));
      p._toastUndo!();
      await new Promise((r) => setTimeout(r, 40));
      const undone = (sent as Array<Record<string, unknown>>)
        .filter((m) => m.type === "maintenance_supporter/object/unarchive").map((m) => m.entry_id);
      expect(undone).to.deep.equal(["e1"]);
    });
  });

  // ── status constants ────────────────────────────────────────────────────
  describe("status-constants", () => {
    it("ranks by urgency; unknown statuses sort after ok; actionable = the first three", () => {
      expect([...STATUS_ORDER]).to.deep.equal(["overdue", "triggered", "due_soon", "ok"]);
      const sorted = ["ok", "paused", "due_soon", "overdue", "triggered"].sort((a, b) => statusRank(a) - statusRank(b));
      expect(sorted).to.deep.equal(["overdue", "triggered", "due_soon", "ok", "paused"]);
      expect([...ACTIONABLE_STATUSES]).to.deep.equal(STATUS_ORDER.filter((s) => s !== "ok"));
      expect(isActionableStatus("triggered")).to.equal(true);
      expect(isActionableStatus("ok")).to.equal(false);
      expect(isActionableStatus(undefined)).to.equal(false);
    });

    it("the panel's status filter offers STATUS_ORDER (it had due soon before triggered)", async () => {
      resetTaskSeq();
      const { el } = await mountPanel([obj("e1", [task({ status: "triggered" }), task({ status: "overdue" })])]);
      const panel = el as unknown as { _overviewTab: string; _filterStatus: string; updateComplete: Promise<unknown> };
      panel._overviewTab = "dashboard";
      panel._filterStatus = "triggered";
      await panel.updateComplete;
      const select = [...sr(el).querySelectorAll("select")].find((s) => [...s.options].some((o) => o.value === "overdue"))!;
      expect([...select.options].map((o) => o.value)).to.deep.equal(["", ...STATUS_ORDER]);
      expect(select.value, "the active filter stays selected").to.equal("triggered");
    });
  });

  // ── settings parsing ────────────────────────────────────────────────────
  describe("settings-cache parseSettings is the one parser", () => {
    it("range-checks the warning days, normalises the row style, reads the panel's fields", () => {
      const s = parseSettings({
        general: { default_warning_days: 999, row_action_style: "bogus", row_action_notice_pending: true, ref_numbers_in_lists: true },
        objects_table_columns: ["name", "area"],
      });
      expect(s.defaultWarningDays).to.equal(FALLBACK_SETTINGS.defaultWarningDays);
      expect(s.rowActionStyle).to.equal("buttons_compact");
      expect(s.rowActionNoticePending).to.equal(true);
      expect(s.refsInLists).to.equal(true);
      expect(s.objectsTableColumns).to.deep.equal(["name", "area"]);
      expect(parseSettings({ general: { default_warning_days: 0, row_action_style: "icons" } })).to.deep.include({
        defaultWarningDays: 0, rowActionStyle: "icons",
      });
      expect(parseSettings(null)).to.deep.equal(FALLBACK_SETTINGS);
    });

    it("the panel applies the parsed settings (no private copy of the rules)", async () => {
      invalidateSettingsCache();
      resetTaskSeq();
      const { el } = await mountPanel([obj("e1", [task()])], {
        "maintenance_supporter/settings": () => ({
          ...DEFAULT_SETTINGS_RESPONSE,
          operator_write_enabled: true,
          admin_panel_user_ids: ["op-1"],
          general: { ...DEFAULT_SETTINGS_RESPONSE.general, default_warning_days: 400, row_action_style: "bogus", ref_numbers_in_lists: true },
        }),
      });
      const p = el as unknown as {
        _defaultWarningDays: number; _rowActionStyle: string; _refsInLists: boolean;
        _operatorWriteEnabled: boolean; _adminPanelUserIds: string[];
      };
      expect(p._defaultWarningDays).to.equal(7);
      expect(p._rowActionStyle).to.equal("buttons_compact");
      expect(p._refsInLists).to.equal(true);
      expect(p._operatorWriteEnabled).to.equal(true);
      expect(p._adminPanelUserIds).to.deep.equal(["op-1"]);
    });
  });

  // ── formatQty ───────────────────────────────────────────────────────────
  describe("styles formatQty", () => {
    afterEach(() => setProfilePrefs({ date_format: undefined, time_format: undefined, number_format: undefined }, null));

    it("formats the number per profile and appends the unit", () => {
      expect(formatQty(6, "pcs", "en")).to.equal("6 pcs");
      expect(formatQty(6, null, "en")).to.equal("6");
      setProfilePrefs({ number_format: "decimal_comma" });
      expect(formatQty(1.5, "l", "en")).to.equal("1,5 l");
    });
  });

  // ── task-dialog trigger fields ──────────────────────────────────────────
  describe("task-dialog shared trigger fields", () => {
    const configs: Array<Record<string, unknown>> = [
      { type: "threshold", attribute: "level", trigger_above: 80, trigger_below: 10, trigger_equals: 3, trigger_not_equals: 1, trigger_for_minutes: 5 },
      { type: "counter", trigger_target_value: 500, trigger_delta_mode: true },
      { type: "state_change", trigger_from_state: "off", trigger_to_state: "on", trigger_target_changes: 4, trigger_for_minutes: 10 },
      { type: "runtime", trigger_runtime_hours: 250, trigger_on_states: ["cooling", "heating"] },
    ];
    for (const cfg of configs) {
      it(`${cfg.type}: storage → form → storage is the identity`, () => {
        const out: Record<string, unknown> = { type: cfg.type };
        applyTypeFields(out as never, typeFieldsFromConfig(cfg as never));
        expect(out).to.deep.equal(cfg);
      });
    }

    it("a compound state_change condition keeps its hold time on save (drift fix)", async () => {
      const { hass, sent } = createMockHass({
        handlers: { "maintenance_supporter/task/update": () => ({ success: true }) },
      });
      const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
      await el.openEdit("e1", {
        id: "t1", name: "Door", type: "custom", schedule_type: "sensor_based", warning_days: 7, enabled: true,
        trigger_config: {
          type: "compound", compound_logic: "AND",
          conditions: [{ type: "state_change", entity_id: "binary_sensor.door", entity_ids: ["binary_sensor.door"], trigger_to_state: "on", trigger_for_minutes: 15 }],
        },
      } as never);
      await (el as unknown as { _save: () => Promise<void> })._save();
      const update = sent.find((m: SentMessage) => m.type === "maintenance_supporter/task/update") as Record<string, unknown>;
      const cond = (update.trigger_config as { conditions: Array<Record<string, unknown>> }).conditions[0];
      expect(cond).to.deep.include({ type: "state_change", trigger_to_state: "on", trigger_for_minutes: 15 });
    });
  });

  // ── modal shell ─────────────────────────────────────────────────────────
  describe("helpers/modal-shell", () => {
    const key = (target: Element, k = "Escape") =>
      target.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, composed: true, cancelable: true }));

    async function taskQa() {
      const { hass } = createMockHass({
        handlers: {
          "maintenance_supporter/object": () => ({
            entry_id: "e1", object: { id: "o1", name: "Pump" },
            tasks: [{ id: "t1", name: "Filter", type: "custom", schedule_type: "time_based", interval_days: 30, status: "ok", history: [] }],
          }),
        },
      });
      (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
      const el = await fixture<MaintenanceTaskQuickActionsDialog>(html`
        <maintenance-task-quick-actions-dialog .hass=${hass}></maintenance-task-quick-actions-dialog>`);
      await el.openFor("e1", "t1");
      await el.updateComplete;
      return el;
    }

    it("Escape closes the task quick actions; the frame is focused on open and keeps its width", async () => {
      invalidateSettingsCache();
      const el = await taskQa();
      const dialog = el.shadowRoot!.querySelector<HTMLElement>(".dialog")!;
      expect(dialog.getAttribute("tabindex")).to.equal("-1");
      expect(el.shadowRoot!.activeElement, "focused on open").to.equal(dialog);
      expect(getComputedStyle(dialog).maxWidth).to.equal("460px");
      key(dialog, "a");
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(".dialog"), "other keys do nothing").to.exist;
      key(dialog);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(".dialog"), "Escape closed it").to.equal(null);
    });

    it("the object quick actions close on Escape and on the backdrop", async () => {
      invalidateSettingsCache();
      const { hass } = createMockHass({
        handlers: { "maintenance_supporter/object": () => ({ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [] }) },
      });
      (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
      const el = await fixture<MaintenanceObjectQuickActionsDialog>(html`
        <maintenance-object-quick-actions-dialog .hass=${hass}></maintenance-object-quick-actions-dialog>`);
      await el.openFor("e1");
      await el.updateComplete;
      expect(getComputedStyle(el.shadowRoot!.querySelector(".dialog")!).maxWidth).to.equal("480px");
      key(el.shadowRoot!.querySelector(".dialog")!);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(".dialog")).to.equal(null);
      await el.openFor("e1");
      await el.updateComplete;
      el.shadowRoot!.querySelector<HTMLElement>(".backdrop")!.click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(".dialog")).to.equal(null);
    });

    it("an Escape something inside already consumed does not close the history editor", async () => {
      const { hass } = createMockHass({
        handlers: { "maintenance_supporter/parts/overview": () => ({ parts: [] }) },
      });
      const el = await fixture<MaintenanceHistoryEditDialog>(html`
        <maintenance-history-edit-dialog .hass=${hass}></maintenance-history-edit-dialog>`);
      el.openEdit({
        entry_id: "e1", task_id: "t1", original_timestamp: "2026-09-01T10:00:00", type: "completed",
        timestamp: "2026-09-01T10:00:00", notes: null, cost: null, duration: null, completed_by: null,
      });
      await el.updateComplete;
      const dialog = el.shadowRoot!.querySelector<HTMLElement>(".dialog")!;
      expect(getComputedStyle(dialog).rowGap, "own gap kept").to.equal("12px");
      const h2 = dialog.querySelector("h2")!;
      h2.addEventListener("keydown", (e) => e.preventDefault(), { once: true });
      key(h2);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(".dialog"), "consumed Escape keeps it open").to.exist;
      key(h2);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector(".dialog")).to.equal(null);
    });
  });

  // ── documents ───────────────────────────────────────────────────────────
  describe("document name / category", () => {
    it("docCategory = the first category tag, else other; the category sort follows CATEGORIES", () => {
      expect(docCategory({ tags: ["2024", "invoice", "manual"] })).to.equal("invoice");
      expect(docCategory({ tags: ["misc"] })).to.equal("other");
      expect(docCategory({})).to.equal("other");
      const docs = [
        { id: "w", kind: "weblink", url: "https://x.example", tags: [] },
        { id: "o", kind: "file", filename: "b.pdf", tags: [] },
        { id: "m", kind: "file", filename: "a.pdf", tags: ["manual"] },
        { id: "p", kind: "file", filename: "c.jpg", tags: ["photo"] },
      ];
      expect(sortDocuments(docs, "category").map((d) => d.id)).to.deep.equal(["m", "p", "o", "w"]);
      expect(CATEGORIES.indexOf("manual")).to.be.lessThan(CATEGORIES.indexOf("photo"));
      expect(docDisplayName({ url: "https://x.example" })).to.equal("https://x.example");
    });
  });

  // ── multipart upload ────────────────────────────────────────────────────
  describe("photo-upload postMultipart", () => {
    const origFetch = window.fetch;
    afterEach(() => { window.fetch = origFetch; });
    const stub = (status: number, body: unknown = {}) => {
      window.fetch = (async () => new Response(JSON.stringify(body), { status })) as typeof fetch;
    };
    const hass = { auth: { data: { access_token: "tok" } } } as never;

    it("maps 413 to the caller's key and other refusals to doc_upload_failed", async () => {
      stub(413);
      let err = "";
      await postMultipart(hass, "/api/x", new FormData(), "docs_archive_too_large").catch((e: Error) => { err = e.message; });
      expect(err).to.equal("docs_archive_too_large");
      await uploadDocument(hass, "e1", new File(["x"], "a.jpg"), ["photo"]).catch((e: Error) => { err = e.message; });
      expect(err).to.equal("doc_too_large");
      stub(500);
      await postMultipart(hass, "/api/x", new FormData()).catch((e: Error) => { err = e.message; });
      expect(err).to.equal("doc_upload_failed");
      stub(200, { blobs_written: 2 });
      expect(await postMultipart(hass, "/api/x", new FormData())).to.deep.equal({ blobs_written: 2 });
    });

    it("the archive import names the size limit on a 413 (was the generic 'Action failed')", async () => {
      const { hass: h } = createMockHass();
      const el = await fixture<MaintenanceSettingsView>(html`
        <maintenance-settings-view .hass=${h} .features=${DEFAULT_FEATURES}></maintenance-settings-view>`);
      await new Promise((r) => setTimeout(r, 50));
      stub(413);
      const input = document.createElement("input");
      input.type = "file";
      Object.defineProperty(input, "files", { value: [new File(["x"], "docs.zip")] });
      await (el as unknown as { _importDocsArchive: (e: Event) => Promise<void> })._importDocsArchive({ target: input } as never);
      const toast = (el as unknown as { _toast: string })._toast;
      expect(toast).to.equal(t("docs_archive_too_large", "en").replace("{max}", "500 MB"));
      expect(DOCS_ARCHIVE_MAX_BYTES).to.equal(500 * 1024 * 1024);
    });
  });

  // ── dates ───────────────────────────────────────────────────────────────
  describe("local dates", () => {
    it("isoDateLocal / isoMinuteLocal read the wall clock, seconds zeroed", () => {
      const d = new Date(2026, 0, 5, 7, 9, 42);
      expect(isoDateLocal(d)).to.equal("2026-01-05");
      expect(isoMinuteLocal(d)).to.equal("2026-01-05T07:09:00");
    });
  });

  // ── source tripwires ────────────────────────────────────────────────────
  describe("tripwires (raw sources)", () => {
    it("describeWsError is only called by helpers/ws-run", async () => {
      expect(await offenders(/describeWsError\(/, ["helpers/ws-run.ts", "ws-errors.ts"])).to.deep.equal([]);
    });

    it("no hand-kept status rank map or actionable list", async () => {
      expect(await offenders(/overdue:\s*0,\s*triggered:\s*1|\[\s*"overdue",\s*"(?:triggered|due_soon)"/, ["status-constants.ts"])).to.deep.equal([]);
    });

    it("stock and quantities render through formatQty", async () => {
      expect(await offenders(/\b(?:stock|quantity|qty)\}\$\{[^}]*\bunit\b/, ["styles.ts"])).to.deep.equal([]);
    });

    it("document names and categories come from document-categories", async () => {
      expect(await offenders(/\.title\s*\|\|\s*[\w?.]*\.filename/, ["helpers/document-categories.ts"])).to.deep.equal([]);
      expect(await offenders(/\.find\(\s*\(\w+\)\s*=>\s*\(?CATEGORIES/, ["helpers/document-categories.ts"])).to.deep.equal([]);
      expect(await offenders(/"manual",\s*"warranty"/, ["helpers/document-categories.ts"])).to.deep.equal([]);
    });

    it("the three hand-built dialogs share the modal shell", async () => {
      const src = await sources();
      for (const path of ["components/history-edit-dialog.ts", "components/object-quick-actions-dialog.ts", "components/task-quick-actions-dialog.ts"]) {
        expect(src[path], path).to.contain("renderModalShell(");
        expect(src[path], path).to.contain("modalShellStyles");
        expect(src[path], `${path} keeps no own frame CSS`).to.not.match(/\.backdrop\s*\{|\n\s*\.dialog\s*\{/);
      }
    });

    it("uploads POST only through photo-upload postMultipart", async () => {
      expect(await offenders(/authFetch\(|method:\s*"POST",\s*body:/, ["helpers/photo-upload.ts"])).to.deep.equal([]);
    });

    it("local dates are built only in calendar-bucket", async () => {
      expect(await offenders(/\$\{\s*\w+\.getFullYear\(\)\s*\}-/, ["helpers/calendar-bucket.ts"])).to.deep.equal([]);
    });

    it("backend range literals live only in helpers/setting-ranges", async () => {
      expect(await offenders(/\b(?:min|max)="(?:1440|-15|15|0\.1|0\.9|0\.01|999|9999|10000|100000|5\.0|365)"/)).to.deep.equal([]);
      expect(await offenders(/Math\.max\(-15|alpha >= 0\.1|num < 0\.1/)).to.deep.equal([]);
      expect(PART_QTY_RANGE[1]).to.equal(10000);
      expect(SCHEDULE_OFFSET_MAX_DAYS).to.equal(15);
    });

    it("one bulk loop in the panel, which reports the failures", async () => {
      const panel = (await sources())["maintenance-panel.ts"];
      expect(panel).to.not.contain("keep going; report the successful count");
      expect(panel.match(/runWsEach\(/g)?.length, "one runWsEach call").to.equal(1);
    });

    it("the calendar card's non-day interval label is the shared formatInterval", async () => {
      expect(await offenders(/t\("unit_"\s*\+\s*ev\./)).to.deep.equal([]);
      expect(formatInterval(3, "weeks", "en")).to.equal(`3 ${t("unit_weeks", "en")}`);
    });
  });
});
