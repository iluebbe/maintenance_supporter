/** Dialog for creating/editing a maintenance task. */

import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { AdaptiveConfig, HomeAssistant, MaintenanceTask, TriggerConfig, HAUser } from "../types";
import { formatDate, t, weekdayName } from "../styles";
import { UserService } from "../user-service";

import { describeWsError } from "../ws-errors";
import "./ms-textfield";

const MAINTENANCE_TYPE_KEYS = ["cleaning", "inspection", "replacement", "calibration", "service", "reading", "custom"];
const PRIORITY_KEYS = ["low", "normal", "high"];
const SCHEDULE_TYPE_KEYS = ["time_based", "weekdays", "nth_weekday", "day_of_month", "sensor_based", "one_time", "manual"];
const CALENDAR_KINDS = ["weekdays", "nth_weekday", "day_of_month"];
const TRIGGER_TYPE_KEYS = ["threshold", "counter", "state_change", "runtime"];
// The type selector additionally offers "compound" (a group of conditions
// joined by AND/OR); its per-condition sub-type is limited to the flat kinds.
const TRIGGER_TYPE_KEYS_WITH_COMPOUND = [...TRIGGER_TYPE_KEYS, "compound"];

/** One condition of a compound trigger — a flat trigger the user edits inline.
 *  String-typed like the top-level fields (form inputs); coerced on save. */
interface CompoundConditionDraft {
  entityIds: string; // comma-separated raw input
  type: string; // threshold | counter | state_change | runtime
  above: string;
  below: string;
  forMinutes: string;
  targetValue: string;
  deltaMode: boolean;
  fromState: string;
  toState: string;
  targetChanges: string;
  runtimeHours: string;
  onStates: string;
  /** Original keys this editor has no fields for (attribute, baseline, ...).
   *  Spread back on save so a compound roundtrip never drops them (#103 class). */
  carry: Partial<TriggerConfig>;
}

function emptyCondition(): CompoundConditionDraft {
  return {
    entityIds: "", type: "threshold", above: "", below: "", forMinutes: "0",
    targetValue: "", deltaMode: false, fromState: "", toState: "",
    targetChanges: "", runtimeHours: "", onStates: "", carry: {},
  };
}

/** Keys the compound editor owns via its own form fields — everything else
 *  travels through `carry` untouched. */
const MANAGED_CONDITION_KEYS = new Set([
  "entity_id", "entity_ids", "type",
  "trigger_above", "trigger_below", "trigger_for_minutes",
  "trigger_target_value", "trigger_delta_mode",
  "trigger_from_state", "trigger_to_state", "trigger_target_changes",
  "trigger_runtime_hours", "trigger_on_states",
]);

/** Map a persisted compound condition (storage shape) to an editable draft. */
function conditionToDraft(c: TriggerConfig): CompoundConditionDraft {
  const ids = c.entity_ids || (c.entity_id ? [c.entity_id] : []);
  return {
    entityIds: ids.join(", "),
    type: c.type || "threshold",
    above: c.trigger_above?.toString() ?? "",
    below: c.trigger_below?.toString() ?? "",
    forMinutes: c.trigger_for_minutes?.toString() ?? "0",
    targetValue: c.trigger_target_value?.toString() ?? "",
    deltaMode: c.trigger_delta_mode || false,
    fromState: c.trigger_from_state || "",
    toState: c.trigger_to_state || "",
    targetChanges: c.trigger_target_changes?.toString() ?? "",
    runtimeHours: c.trigger_runtime_hours?.toString() ?? "",
    onStates: (c.trigger_on_states || []).join(", "),
    carry: Object.fromEntries(
      Object.entries(c).filter(([k]) => !MANAGED_CONDITION_KEYS.has(k) && !k.startsWith("_")),
    ) as Partial<TriggerConfig>,
  };
}

/** Build the persisted condition (storage shape) from an editable draft.
 *  Returns null when the condition has no entity (skip it). */
function draftToCondition(d: CompoundConditionDraft): TriggerConfig | null {
  const ids = d.entityIds.split(",").map((s) => s.trim()).filter(Boolean);
  if (ids.length === 0) return null;
  const c: TriggerConfig = { ...(d.carry || {}), entity_id: ids[0], entity_ids: ids, type: d.type };
  if (d.type === "threshold") {
    const a = parseFloat(d.above); if (!isNaN(a)) c.trigger_above = a;
    const b = parseFloat(d.below); if (!isNaN(b)) c.trigger_below = b;
    const f = parseInt(d.forMinutes, 10); if (!isNaN(f)) c.trigger_for_minutes = f;
  } else if (d.type === "counter") {
    const v = parseFloat(d.targetValue); if (!isNaN(v)) c.trigger_target_value = v;
    c.trigger_delta_mode = d.deltaMode;
  } else if (d.type === "state_change") {
    if (d.fromState) c.trigger_from_state = d.fromState;
    if (d.toState) c.trigger_to_state = d.toState;
    const n = parseInt(d.targetChanges, 10); if (!isNaN(n)) c.trigger_target_changes = n;
  } else if (d.type === "runtime") {
    const h = parseFloat(d.runtimeHours); if (!isNaN(h)) c.trigger_runtime_hours = h;
    const on = (d.onStates || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (on.length > 0) c.trigger_on_states = on;
  }
  return c;
}

/** Short localized weekday names (0=Mon … 6=Sun) — uses the shared weekdayName (DRY). */
function weekdayNames(lang?: string): string[] {
  return Array.from({ length: 7 }, (_, i) => weekdayName(i, lang, "short"));
}

/** Short localized month names, indexed 0=Jan … 11=Dec. */
function monthNames(lang?: string): string[] {
  const fmt = new Intl.DateTimeFormat(lang || "en", { month: "short" });
  return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2021, i, 1)));
}

export class MaintenanceTaskDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Boolean, attribute: "checklists-enabled" }) public checklistsEnabled = false;
  @property({ type: Boolean, attribute: "schedule-time-enabled" }) public scheduleTimeEnabled = false;
  @property({ type: Boolean, attribute: "completion-actions-enabled" }) public completionActionsEnabled = false;
  @property({ type: Number, attribute: "default-warning-days" }) public defaultWarningDays = 7;
  /** The object's spare parts — offered as "consumes parts" checkboxes. */
  @state() private parts: Array<{ id: string; name: string; unit?: string }> = [];
  @state() private _open = false;
  @state() private _loading = false;
  @state() private _error = "";
  @state() private _entryId = "";
  @state() private _taskId: string | null = null; // null = create
  // When openCreate is called without an entry_id and a list of objects is supplied,
  // the dialog renders an Object selector dropdown so the user can pick the parent.
  @state() private _objectChoices: Array<{ entry_id: string; name: string }> = [];

  // Task fields
  @state() private _name = "";
  @state() private _type = "custom";
  @state() private _scheduleType = "time_based";
  @state() private _intervalDays = "30";
  @state() private _intervalUnit = "days";
  @state() private _dueDate = "";
  @state() private _warningDays = "7";
  @state() private _earliestCompletionDays = "";
  @state() private _intervalAnchor: "completion" | "planned" = "completion";
  // Calendar kinds (Phase 4): weekdays (0=Mon…6=Sun), nth_weekday, day_of_month
  @state() private _weekdays: number[] = [];
  @state() private _nth = "1";          // "1".."5" or "-1" (last)
  @state() private _nthWeekday = "5";   // Saturday
  @state() private _domDay = "1";
  // (#83) end-of-month options: last day / business-day rollback / ±N offset.
  @state() private _domLastDay = false;
  @state() private _domBusiness = false;
  @state() private _calOffset = "0";
  // Recurrence extras (apply to interval + calendar kinds): a seasonal active
  // window and a finite-series end condition.
  @state() private _seasonMonths: number[] = [];
  @state() private _endsMode: "never" | "count" | "until" = "never";
  @state() private _endsCount = "";
  @state() private _endsUntil = "";
  // #83: live "next dates" preview — dates come from the BACKEND engine via
  // schedule/preview (never a frontend reimplementation; the #103 lesson).
  @state() private _schedulePreview: string[] = [];
  @state() private _schedulePreviewEnded = false;
  private _previewTimer: ReturnType<typeof setTimeout> | undefined;
  private _previewSeq = 0;
  @state() private _notes = "";
  @state() private _documentationUrl = "";
  @state() private _customIcon = "";
  @state() private _priority = "normal";
  @state() private _labels = "";
  @state() private _enabled = true;

  // Trigger fields
  @state() private _triggerEntityId = "";
  @state() private _triggerEntityIds: string[] = [];
  @state() private _triggerEntityLogic: "any" | "all" = "any";
  @state() private _triggerAttribute = "";
  @state() private _triggerType = "threshold";
  @state() private _triggerAbove = "";
  @state() private _triggerBelow = "";
  @state() private _triggerForMinutes = "0";
  @state() private _triggerTargetValue = "";
  @state() private _triggerDeltaMode = false;
  @state() private _triggerBaselineValue = "";
  // The LIVE counting anchor from the read-model (Store baseline — moves on
  // completion). Display-only: adopted delta tasks have no config baseline,
  // so without this the edit dialog would show an empty start-value field
  // even though counting is anchored at e.g. 27,000 km.
  @state() private _liveBaselineValue: number | null = null;
  @state() private _autoCompleteOnRecovery = false;
  @state() private _triggerFromState = "";
  @state() private _triggerToState = "";
  @state() private _triggerTargetChanges = "";
  @state() private _triggerRuntimeHours = "";
  // Comma-separated "running" states for the runtime trigger (#103) —
  // empty = the backend default ["on"]. Must roundtrip on edit: adopted
  // tasks ship e.g. ["mowing"], and dropping it on save silently stops
  // the accumulation.
  @state() private _triggerOnStates = "";
  // Compound trigger (type === "compound"): a list of conditions + AND/OR logic
  @state() private _compoundLogic: "AND" | "OR" = "AND";
  @state() private _compoundConditions: CompoundConditionDraft[] = [];

  // Entity attribute introspection
  @state() private _suggestedAttributes: string[] = [];
  @state() private _availableAttributes: Array<{ name: string; value: unknown; numeric: boolean }> = [];
  @state() private _entityDomain = "";

  // NFC
  @state() private _lastPerformed = "";
  @state() private _nfcTagId = "";
  // v2.20 (#83): unit for `reading`-type tasks ("kWh", "m³", ...)
  @state() private _readingUnit = "";
  @state() private _consumesParts: Record<string, number> = {};
  @state() private _partsLoadFailed = false;
  @state() private _availableTags: Array<{id: string; name: string}> = [];

  // User assignment
  @state() private _responsibleUserId: string | null = null;
  @state() private _assigneePool: string[] = [];
  @state() private _rotationStrategy = "";
  @state() private _availableUsers: HAUser[] = [];

  // Checklist (newline-separated steps, one per line)
  @state() private _checklistText = "";

  // Schedule time (HH:MM, advanced feature)
  @state() private _scheduleTime = "";

  // v1.3.0: on_complete_action (gated by completionActionsEnabled)
  // v1.3.1: _actionData is the parsed object (was: _actionDataJson string)
  // so ha-form can drive the data fields when the service schema is known.
  @state() private _actionService = "";
  @state() private _actionTargetEntity = "";
  @state() private _actionData: Record<string, unknown> = {};
  @state() private _actionDataJsonFallback = "";
  @state() private _actionTesting = false;
  @state() private _actionTestResult: "" | "ok" | "error" = "";
  @state() private _actionTestError = "";

  // v1.3.0: quick_complete_defaults (gated by completionActionsEnabled)
  @state() private _qcNotes = "";
  @state() private _qcCost = "";
  @state() private _qcDuration = "";
  @state() private _qcFeedback: "" | "needed" | "not_needed" = "";

  // Environmental entity (adaptive_config)
  @state() private _environmentalEntity = "";
  @state() private _environmentalAttribute = "";
  private _environmentalInitial = ""; // for change detection on save
  private _environmentalAttributeInitial = "";
  private _userService: UserService | null = null;

  private get _lang(): string {
    return this.hass?.language ?? navigator.language.split("-")[0] ?? "en";
  }

  public async openCreate(entryId: string, objects?: Array<{ entry_id: string; object: { name: string } }>): Promise<void> {
    this._entryId = entryId;
    this._taskId = null;
    this._error = "";
    // If no entryId is preset but caller passed objects, expose them as a dropdown.
    // Sort alphabetically by name so the user doesn't have to scan for a target
    // object in creation order (#40). First object after sort becomes the
    // default selection so save can work without forced UI.
    if (!entryId && objects && objects.length > 0) {
      this._objectChoices = objects
        .map(o => ({ entry_id: o.entry_id, name: o.object.name }))
        .sort((a, b) => a.name.localeCompare(b.name));
      this._entryId = this._objectChoices[0].entry_id;
    } else {
      this._objectChoices = [];
    }
    this._resetFields();
    await Promise.all([this._loadUsers(), this._loadTags(), this._loadParts()]);
    this._open = true;
  }

  public async openEdit(entryId: string, task: MaintenanceTask): Promise<void> {
    this._entryId = entryId;
    this._taskId = task.id;
    this._error = "";
    this._name = task.name;
    this._type = task.type;
    this._scheduleType = task.schedule_type;
    // Preserve null (= no safety interval set) instead of forcing "30".
    // Bug #42: the old `?.toString() || "30"` fallback reverted a cleared
    // safety_interval back to 30 on next edit, silently overwriting the
    // user's intent the moment they touched any other field and saved.
    this._intervalDays = task.interval_days != null ? String(task.interval_days) : "";
    this._intervalUnit = task.interval_unit || "days";
    this._dueDate = task.due_date || "";
    // Calendar kinds read the nested schedule (the only place they live).
    const sched = task.schedule;
    this._weekdays = sched?.kind === "weekdays" ? [...(sched.weekdays ?? [])] : [];
    this._nth = sched?.kind === "nth_weekday" ? String(sched.nth ?? 1) : "1";
    this._nthWeekday = sched?.kind === "nth_weekday" ? String(sched.weekday ?? 5) : "5";
    this._domDay = sched?.kind === "day_of_month" && (sched.day ?? 1) >= 1 ? String(sched.day ?? 1) : "1";
    this._domLastDay = sched?.kind === "day_of_month" && sched.day === -1;
    this._domBusiness = sched?.kind === "day_of_month" && sched.business === true;
    this._calOffset = sched?.offset ? String(sched.offset) : "0";
    // Recurrence extras — read from the nested schedule wherever it lives.
    this._seasonMonths = Array.isArray(sched?.season_months) ? [...sched!.season_months] : [];
    const ends = sched?.ends;
    if (ends && typeof ends.count === "number") {
      this._endsMode = "count"; this._endsCount = String(ends.count); this._endsUntil = "";
    } else if (ends && typeof ends.until === "string") {
      this._endsMode = "until"; this._endsUntil = ends.until; this._endsCount = "";
    } else {
      this._endsMode = "never"; this._endsCount = ""; this._endsUntil = "";
    }
    this._warningDays = task.warning_days.toString();
    this._earliestCompletionDays =
      task.earliest_completion_days != null ? String(task.earliest_completion_days) : "";
    this._intervalAnchor = task.interval_anchor || "completion";
    this._notes = task.notes || "";
    this._documentationUrl = task.documentation_url || "";
    this._customIcon = task.custom_icon || "";
    this._priority = task.priority || "normal";
    this._labels = (task.labels || []).join(", ");
    this._enabled = task.enabled !== false;
    this._lastPerformed = task.last_performed || "";
    this._nfcTagId = task.nfc_tag_id || "";
    this._readingUnit = task.reading_unit || "";
    this._consumesParts = Object.fromEntries((task.consumes_parts || []).map((l) => [l.part_id, l.quantity]));
    this._responsibleUserId = task.responsible_user_id || null;
    this._assigneePool = [...(task.assignee_pool || [])];
    this._rotationStrategy = task.rotation_strategy || "";

    this._checklistText = (task.checklist || []).join("\n");
    this._scheduleTime = task.schedule_time || "";

    // v1.3.0: hydrate on_complete_action + quick_complete_defaults
    const oca = task.on_complete_action;
    if (oca && oca.service) {
      this._actionService = oca.service;
      const tgt = oca.target?.entity_id;
      this._actionTargetEntity = Array.isArray(tgt) ? (tgt[0] || "") : (tgt || "");
      this._actionData = (oca.data && typeof oca.data === "object") ? { ...oca.data } : {};
      this._actionDataJsonFallback = "";
    } else {
      this._actionService = "";
      this._actionTargetEntity = "";
      this._actionData = {};
      this._actionDataJsonFallback = "";
    }
    const qcd = task.quick_complete_defaults;
    this._qcNotes = qcd?.notes || "";
    this._qcCost = qcd?.cost != null ? String(qcd.cost) : "";
    this._qcDuration = qcd?.duration != null ? String(qcd.duration) : "";
    this._qcFeedback = (qcd?.feedback as "needed" | "not_needed" | undefined) || "";

    const ac: Partial<AdaptiveConfig> = task.adaptive_config || {};
    this._environmentalEntity = ac.environmental_entity || "";
    this._environmentalAttribute = ac.environmental_attribute || "";
    this._environmentalInitial = this._environmentalEntity;
    this._environmentalAttributeInitial = this._environmentalAttribute;

    if (task.trigger_config) {
      const tc = task.trigger_config;
      // A trigger stored with only the plural entity_ids (e.g. the Battery
      // Fleet task) must still hydrate the singular field — the save path
      // gates on _triggerEntityId and would otherwise NULL the whole trigger
      // on an unrelated edit (issue #106).
      this._triggerEntityId = tc.entity_id || (tc.entity_ids && tc.entity_ids[0]) || "";
      this._triggerEntityIds = tc.entity_ids || (tc.entity_id ? [tc.entity_id] : []);
      this._triggerEntityLogic = tc.entity_logic || "any";
      this._triggerAttribute = tc.attribute || "";
      this._triggerType = tc.type || "threshold";
      this._triggerAbove = tc.trigger_above?.toString() || "";
      this._triggerBelow = tc.trigger_below?.toString() || "";
      this._triggerForMinutes = tc.trigger_for_minutes?.toString() || "0";
      this._triggerTargetValue = tc.trigger_target_value?.toString() || "";
      this._triggerDeltaMode = tc.trigger_delta_mode || false;
      this._triggerBaselineValue = tc.trigger_baseline_value?.toString() || "";
      this._liveBaselineValue = task.trigger_baseline_value ?? null;
      this._autoCompleteOnRecovery = tc.auto_complete_on_recovery || false;
      this._triggerFromState = tc.trigger_from_state || "";
      this._triggerToState = tc.trigger_to_state || "";
      this._triggerTargetChanges = tc.trigger_target_changes?.toString() || "";
      this._triggerRuntimeHours = tc.trigger_runtime_hours?.toString() || "";
      this._triggerOnStates = (tc.trigger_on_states || []).join(", ");
      if (tc.type === "compound") {
        this._compoundLogic = tc.compound_logic === "OR" ? "OR" : "AND";
        this._compoundConditions = (tc.conditions || []).map(conditionToDraft);
      } else {
        this._compoundLogic = "AND";
        this._compoundConditions = [];
      }
    } else {
      this._resetTriggerFields();
    }

    // Fetch entity attributes if trigger entity is set
    if (this._triggerEntityId) {
      this._fetchEntityAttributes(this._triggerEntityId);
    }

    await Promise.all([this._loadUsers(), this._loadTags(), this._loadParts()]);
    this._open = true;
  }

  private _resetFields(): void {
    this._name = "";
    this._type = "custom";
    this._scheduleType = "time_based";
    this._intervalDays = "30";
    this._intervalUnit = "days";
    this._dueDate = "";
    this._warningDays = String(this.defaultWarningDays);
    this._earliestCompletionDays = "";
    this._intervalAnchor = "completion";
    this._weekdays = [];
    this._nth = "1";
    this._nthWeekday = "5";
    this._domDay = "1";
    this._domLastDay = false;
    this._domBusiness = false;
    this._calOffset = "0";
    this._seasonMonths = [];
    this._endsMode = "never";
    this._endsCount = "";
    this._endsUntil = "";
    this._notes = "";
    this._documentationUrl = "";
    this._customIcon = "";
    this._priority = "normal";
    this._labels = "";
    this._enabled = true;
    this._lastPerformed = "";
    this._nfcTagId = "";
    this._readingUnit = "";
    this._consumesParts = {};
    this._responsibleUserId = null;
    this._assigneePool = [];
    this._rotationStrategy = "";
    this._checklistText = "";
    this._scheduleTime = "";
    this._environmentalEntity = "";
    this._environmentalAttribute = "";
    this._environmentalInitial = "";
    this._environmentalAttributeInitial = "";
    // v1.3.0
    this._actionService = "";
    this._actionTargetEntity = "";
    this._actionData = {};
    this._actionDataJsonFallback = "";
    this._actionTesting = false;
    this._actionTestResult = "";
    this._qcNotes = "";
    this._qcCost = "";
    this._qcDuration = "";
    this._qcFeedback = "";
    this._resetTriggerFields();
  }

  private _resetTriggerFields(): void {
    this._triggerEntityId = "";
    this._triggerEntityIds = [];
    this._triggerEntityLogic = "any";
    this._triggerAttribute = "";
    this._suggestedAttributes = [];
    this._availableAttributes = [];
    this._entityDomain = "";
    this._triggerType = "threshold";
    this._triggerAbove = "";
    this._triggerBelow = "";
    this._triggerForMinutes = "0";
    this._triggerTargetValue = "";
    this._triggerDeltaMode = false;
    this._triggerBaselineValue = "";
    this._liveBaselineValue = null;
    this._autoCompleteOnRecovery = false;
    this._triggerFromState = "";
    this._triggerToState = "";
    this._triggerTargetChanges = "";
    this._triggerRuntimeHours = "";
    this._triggerOnStates = "";
    this._compoundLogic = "AND";
    this._compoundConditions = [];
  }

  private async _loadUsers(): Promise<void> {
    if (!this._userService) {
      this._userService = new UserService(this.hass);
    }
    try {
      this._availableUsers = await this._userService.getUsers();
    } catch (error) {
      console.error("Failed to load users:", error);
      this._availableUsers = [];
    }
  }

  private _toggleAssignee(userId: string): void {
    this._assigneePool = this._assigneePool.includes(userId)
      ? this._assigneePool.filter((u) => u !== userId)
      : [...this._assigneePool, userId];
  }

  // v1.3.0: fire the configured action immediately so the user can verify
  // it works before saving the task. Doesn't persist anything.
  private async _testAction(): Promise<void> {
    // VALIDATE-ONLY — does NOT actually fire the service-call.
    //
    // Earlier this method called hass.callService(...) for real, which
    // had real side effects: counter.increment incremented the counter,
    // input_button.press fired the button (which on the user's vacuum
    // robot would actually reset the dirty-time sensor as if maintenance
    // had been performed). User pushback (correct):
    //   *"setzt Test auch den zustand? dann würde beim testen bereits so
    //   getan als ob eine Wartung ausgeführt wurde — das ist nicht gut"*
    //
    // The Test button is for verifying the *configuration* is correct
    // before saving — not for triggering the action. The user can mark
    // the task complete to actually fire it.
    //
    // Checks performed (all without side effects):
    //   1. Service format matches `domain.service` regex
    //   2. Service exists in hass.services registry
    //   3. Domain whitelist for cross-domain services
    //   4. Service-entity domain match (otherwise HA silently drops the
    //      call at fire-time with "Referenced entities ... missing or
    //      not currently available")
    //   5. Target entity exists in hass.states (when target set)
    const svc = this._actionService.trim();
    if (!svc || !/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(svc)) {
      this._actionTestResult = "error";
      this._actionTestError = "Invalid service format (expected 'domain.service')";
      setTimeout(() => { this._actionTestResult = ""; this._actionTestError = ""; }, 5000);
      return;
    }
    const [domain, name] = svc.split(".");

    // 2. Service exists?
    if (!this.hass?.services?.[domain]?.[name]) {
      this._actionTestResult = "error";
      this._actionTestError = `Service "${svc}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`;
      setTimeout(() => { this._actionTestResult = ""; this._actionTestError = ""; }, 8000);
      return;
    }

    const tgt = this._actionTargetEntity.trim();

    // 3 + 4. Cross-domain whitelist + domain match.
    // homeassistant.* / scene.* / notify.* / persistent_notification.*
    // legitimately accept cross-domain targets; everything else needs the
    // entity domain to match the service domain.
    if (tgt) {
      const entityDomain = tgt.split(".")[0];
      const crossDomainServices = new Set([
        "homeassistant", "scene", "notify", "persistent_notification",
      ]);
      if (entityDomain !== domain && !crossDomainServices.has(domain)) {
        this._actionTestResult = "error";
        this._actionTestError = `Service "${svc}" only works on ${domain}.* entities; entity "${tgt}" is in ${entityDomain}.* — pick a service that matches the entity domain (e.g. ${entityDomain}.${name})`;
        setTimeout(() => { this._actionTestResult = ""; this._actionTestError = ""; }, 8000);
        return;
      }
      // 5. Entity exists?
      if (!this.hass.states?.[tgt]) {
        this._actionTestResult = "error";
        this._actionTestError = `Target entity "${tgt}" not found in Home Assistant — the entity may have been renamed or its integration removed.`;
        setTimeout(() => { this._actionTestResult = ""; this._actionTestError = ""; }, 8000);
        return;
      }
    }

    // All checks passed — configuration is valid. The action will fire
    // when the task is marked complete (not now).
    this._actionTestResult = "ok";
    setTimeout(() => { this._actionTestResult = ""; this._actionTestError = ""; }, 5000);
  }

  // v1.3.1: derive the data dict from either the schema-driven _actionData
  // (preferred) or the JSON fallback textfield. Returns {} on any parse
  // problem so the caller still gets a usable empty object.
  private _buildActionData(): Record<string, unknown> {
    if (this._actionDataJsonFallback.trim()) {
      try {
        const parsed = JSON.parse(this._actionDataJsonFallback);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed as Record<string, unknown>;
        }
      } catch { /* fallthrough to ha-form data */ }
    }
    return { ...this._actionData };
  }

  // v1.3.1: look up the selected service in hass.services and convert its
  // `fields` map into the schema shape ha-form expects. Returns null when
  // the service is unknown or has no fields metadata — caller falls back
  // to a free-form JSON textfield.
  private _serviceSchema(): Array<{
    name: string;
    required: boolean;
    selector: Record<string, unknown>;
  }> | null {
    const svc = this._actionService.trim();
    if (!svc || !/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(svc)) return null;
    const [domain, name] = svc.split(".");
    const fields = this.hass?.services?.[domain]?.[name]?.fields;
    if (!fields || Object.keys(fields).length === 0) return null;
    return Object.entries(fields).map(([fname, def]) => ({
      name: fname,
      required: !!def.required,
      selector: (def.selector as Record<string, unknown>) || { text: {} },
    }));
  }

  private _renderCompletionActionsSection(L: string) {
    if (!this.completionActionsEnabled) return nothing;
    const schema = this._serviceSchema();
    return html`
      <details class="ca-section">
        <summary>${t("on_complete_action_title", L)}</summary>
        <p class="field-help">${t("on_complete_action_desc", L)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${(e: CustomEvent) => {
            this._actionService = e.detail.value || "";
            // Schema changed → drop fields the new service doesn't accept.
            const newSchema = this._serviceSchema();
            if (newSchema) {
              const allowed = new Set(newSchema.map(f => f.name));
              this._actionData = Object.fromEntries(
                Object.entries(this._actionData).filter(([k]) => allowed.has(k)),
              );
            }
          }}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{
            name: "target_entity",
            selector: { entity: {} },
          }]}
          .data=${{ target_entity: this._actionTargetEntity }}
          .computeLabel=${() => t("on_complete_action_target", L)}
          @value-changed=${(e: CustomEvent) => {
            const v = e.detail.value as { target_entity?: string };
            this._actionTargetEntity = v.target_entity || "";
          }}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${t("on_complete_action_target_hint", L)}
        </p>
        ${schema
          ? html`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${schema}
                .data=${this._actionData}
                @value-changed=${(e: CustomEvent) => {
                  this._actionData = { ...(e.detail.value as Record<string, unknown>) };
                }}
              ></ha-form>
            `
          : html`
              <ms-textfield
                label="${t("on_complete_action_data", L)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${(e: Event) => { this._actionDataJsonFallback = (e.target as HTMLInputElement).value; }}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting || !this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting ? "…" : t("on_complete_action_test", L)}
          </button>
          ${this._actionTestResult === "ok"
            ? html`<span class="ca-test-ok">${t("on_complete_action_test_success", L)}</span>`
            : nothing}
          ${this._actionTestResult === "error"
            ? html`<div class="ca-test-error-block">
                <span class="ca-test-error">${t("on_complete_action_test_failed", L)}</span>
                ${this._actionTestError
                  ? html`<div class="ca-test-error-detail">${this._actionTestError}</div>`
                  : nothing}
              </div>`
            : nothing}
        </div>
      </details>

      <details class="ca-section">
        <summary>${t("quick_complete_defaults_title", L)}</summary>
        <p class="field-help">${t("quick_complete_defaults_desc", L)}</p>
        <ms-textfield
          label="${t("quick_complete_defaults_notes", L)}"
          .value=${this._qcNotes}
          @input=${(e: Event) => { this._qcNotes = (e.target as HTMLInputElement).value; }}
        ></ms-textfield>
        <ms-textfield
          label="${t("quick_complete_defaults_cost", L)}"
          type="number" min="0" step="0.01"
          .value=${this._qcCost}
          @input=${(e: Event) => { this._qcCost = (e.target as HTMLInputElement).value; }}
        ></ms-textfield>
        <ms-textfield
          label="${t("quick_complete_defaults_duration", L)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${(e: Event) => { this._qcDuration = (e.target as HTMLInputElement).value; }}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${(e: Event) => { this._qcFeedback = (e.target as HTMLSelectElement).value as "" | "needed" | "not_needed"; }}>
          <option value="">${t("quick_complete_defaults_feedback_none", L)}</option>
          <option value="needed">${t("quick_complete_defaults_feedback_needed", L)}</option>
          <option value="not_needed">${t("quick_complete_defaults_feedback_not_needed", L)}</option>
        </select>
      </details>
    `;
  }

  private async _loadParts(): Promise<void> {
    // The object's parts back the "consumes parts" checkboxes. Self-loaded so
    // every dialog opener (panel, card, task detail) gets them without
    // threading props through.
    this.parts = [];
    if (!this._entryId) return;
    try {
      const result = (await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/object",
        entry_id: this._entryId,
      })) as { parts?: Array<{ id: string; name: string; unit?: string }> };
      this.parts = result.parts || [];
      this._partsLoadFailed = false;
    } catch {
      // Surface the failure: an empty-but-failed load must not just hide the
      // "consumes parts" section as if the object had no parts.
      this.parts = [];
      this._partsLoadFailed = true;
    }
  }

  private async _loadTags(): Promise<void> {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/tags/list",
      }) as { tags: Array<{id: string; name: string}> };
      this._availableTags = result.tags || [];
    } catch {
      this._availableTags = [];
    }
  }

  private async _fetchEntityAttributes(entityId: string): Promise<void> {
    if (!entityId || !this.hass) {
      this._suggestedAttributes = [];
      this._availableAttributes = [];
      this._entityDomain = "";
      return;
    }
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/entity/attributes",
        entity_id: entityId,
      }) as {
        domain: string;
        suggested_attributes: string[];
        available_attributes: Array<{ name: string; value: unknown; numeric: boolean }>;
      };
      this._entityDomain = result.domain || "";
      this._suggestedAttributes = result.suggested_attributes || [];
      this._availableAttributes = result.available_attributes || [];
    } catch {
      this._suggestedAttributes = [];
      this._availableAttributes = [];
      this._entityDomain = "";
    }
  }

  private async _save(): Promise<void> {
    if (this._loading) return;  // synchronous re-entry guard (double-click)
    if (!this._name.trim()) return;
    this._loading = true;
    this._error = "";
    try {
      const data: Record<string, unknown> = {
        type: this._taskId
          ? "maintenance_supporter/task/update"
          : "maintenance_supporter/task/create",
        entry_id: this._entryId,
        name: this._name,
        task_type: this._type,
        schedule_type: this._scheduleType,
        warning_days: parseInt(this._warningDays, 10) || 7,
      };
      const ecd = this._earliestCompletionDays.trim();
      data.earliest_completion_days = ecd === "" ? null : Math.max(0, parseInt(ecd, 10) || 0);

      if (this._taskId) data.task_id = this._taskId;

      if (this._scheduleType === "one_time") {
        data.due_date = this._dueDate || null;
        data.interval_days = null;
      } else if (CALENDAR_KINDS.includes(this._scheduleType)) {
        // Calendar kinds are sent as the nested schedule; the backend prefers
        // it over the flat fields and clears any stale interval/due_date.
        data.schedule = { ...this._buildSchedule(), ...this._recurrenceExtras() };
        data.interval_days = null;
        if (this._taskId) data.due_date = null;
      } else {
        // Switching away from one-time clears the stale due_date on edit.
        if (this._taskId) data.due_date = null;
        if (this._scheduleType !== "manual" && this._intervalDays) {
          data.interval_days = parseInt(this._intervalDays, 10);
          data.interval_unit = this._intervalUnit;
          data.interval_anchor = this._intervalAnchor;
          // Season / finite-series ride a minimal nested schedule alongside the
          // flat interval fields; the backend carries them onto the interval it
          // derives from the flat fields (they can't be expressed flatly).
          // Always send an authoritative nested schedule for interval tasks so
          // an edit that clears season/ends actually clears them.
          if (this._scheduleType === "time_based") {
            data.schedule = { kind: "interval", ...this._recurrenceExtras() };
          }
        } else if (this._taskId) {
          data.interval_days = null;
          data.interval_anchor = "completion";
        }
      }

      data.notes = this._notes || null;
      data.documentation_url = this._documentationUrl || null;
      data.custom_icon = this._customIcon || null;
      data.priority = this._priority;
      data.labels = this._labels
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      data.enabled = this._enabled;
      data.last_performed = this._lastPerformed || null;
      data.nfc_tag_id = this._nfcTagId || null;
      data.reading_unit = this._readingUnit.trim() || null;
      if (this.parts.length) {
        data.consumes_parts = Object.entries(this._consumesParts).map(([part_id, quantity]) => ({
          part_id,
          quantity,
        }));
      }
      data.responsible_user_id = this._responsibleUserId;
      data.assignee_pool = this._assigneePool;
      data.rotation_strategy =
        this._assigneePool.length >= 2 && this._rotationStrategy
          ? this._rotationStrategy
          : null;

      if (this._scheduleType === "sensor_based" && this._triggerType === "compound") {
        // Compound: a group of conditions joined by AND/OR. Each condition
        // carries its own entity + type + params; the top-level entity picker
        // does not apply here.
        const conditions = this._compoundConditions
          .map(draftToCondition)
          .filter((c): c is TriggerConfig => c !== null);
        if (conditions.length > 0) {
          const triggerConfig: TriggerConfig = {
            type: "compound",
            compound_logic: this._compoundLogic,
            conditions,
          };
          if (this._autoCompleteOnRecovery) triggerConfig.auto_complete_on_recovery = true;
          data.trigger_config = triggerConfig;
        } else if (this._taskId) {
          data.trigger_config = null;
        }
      } else if (this._scheduleType === "sensor_based" && this._triggerEntityId) {
        const entityIds = this._triggerEntityIds.length > 0
          ? this._triggerEntityIds
          : [this._triggerEntityId];
        const triggerConfig: TriggerConfig = {
          entity_id: entityIds[0],
          entity_ids: entityIds,
          type: this._triggerType,
        };
        if (this._triggerAttribute) triggerConfig.attribute = this._triggerAttribute;
        if (this._autoCompleteOnRecovery) triggerConfig.auto_complete_on_recovery = true;

        // Multi-entity: store entity_logic for all trigger types
        if (entityIds.length > 1) {
          triggerConfig.entity_logic = this._triggerEntityLogic;
        }

        if (this._triggerType === "threshold") {
          if (this._triggerAbove) { const v = parseFloat(this._triggerAbove); if (!isNaN(v)) triggerConfig.trigger_above = v; }
          if (this._triggerBelow) { const v = parseFloat(this._triggerBelow); if (!isNaN(v)) triggerConfig.trigger_below = v; }
          if (this._triggerForMinutes) { const v = parseInt(this._triggerForMinutes, 10); if (!isNaN(v)) triggerConfig.trigger_for_minutes = v; }
        } else if (this._triggerType === "counter") {
          if (this._triggerTargetValue) { const v = parseFloat(this._triggerTargetValue); if (!isNaN(v)) triggerConfig.trigger_target_value = v; }
          triggerConfig.trigger_delta_mode = this._triggerDeltaMode;
          // #102: optional counting start value ("last service was at X").
          // Empty = count from the reading at creation / keep the live
          // baseline; the backend clears stale Store state when it changes.
          if (this._triggerDeltaMode && this._triggerBaselineValue) {
            const b = parseFloat(this._triggerBaselineValue);
            if (!isNaN(b) && b >= 0) triggerConfig.trigger_baseline_value = b;
          }
        } else if (this._triggerType === "state_change") {
          if (this._triggerFromState) triggerConfig.trigger_from_state = this._triggerFromState;
          if (this._triggerToState) triggerConfig.trigger_to_state = this._triggerToState;
          if (this._triggerTargetChanges) { const v = parseInt(this._triggerTargetChanges, 10); if (!isNaN(v)) triggerConfig.trigger_target_changes = v; }
        } else if (this._triggerType === "runtime") {
          if (this._triggerRuntimeHours) { const v = parseFloat(this._triggerRuntimeHours); if (!isNaN(v)) triggerConfig.trigger_runtime_hours = v; }
          const onStates = this._triggerOnStates.split(",").map((s) => s.trim()).filter(Boolean);
          if (onStates.length > 0) triggerConfig.trigger_on_states = onStates;
        }

        data.trigger_config = triggerConfig;
      } else if (this._taskId) {
        data.trigger_config = null;
      }

      // Schedule time only sent when feature is enabled — empty string clears.
      if (this.scheduleTimeEnabled && this._scheduleType === "time_based") {
        const t = this._scheduleTime.trim();
        data.schedule_time = /^([01]\d|2[0-3]):[0-5]\d$/.test(t) ? t : null;
      }

      if (this.checklistsEnabled) {
        const items = this._checklistText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .slice(0, 100);
        data.checklist = items.length ? items : null;
      }

      // v1.3.0: on_complete_action + quick_complete_defaults (gated)
      if (this.completionActionsEnabled) {
        const svc = this._actionService.trim();
        if (svc && /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(svc)) {
          const action: Record<string, unknown> = { service: svc };
          const tgt = this._actionTargetEntity.trim();
          if (tgt) action.target = { entity_id: tgt };
          const dataDict = this._buildActionData();
          if (Object.keys(dataDict).length > 0) {
            action.data = dataDict;
          }
          data.on_complete_action = action;
        } else {
          data.on_complete_action = null;
        }

        const qcd: Record<string, unknown> = {};
        if (this._qcNotes.trim()) qcd.notes = this._qcNotes.trim();
        const cost = parseFloat(this._qcCost);
        if (!isNaN(cost) && cost >= 0) qcd.cost = cost;
        const dur = parseInt(this._qcDuration, 10);
        if (!isNaN(dur) && dur >= 0) qcd.duration = dur;
        if (this._qcFeedback) qcd.feedback = this._qcFeedback;
        data.quick_complete_defaults = Object.keys(qcd).length ? qcd : null;
      }

      const result = await this.hass.connection.sendMessagePromise(data) as { task_id?: string };
      const savedTaskId = this._taskId || result?.task_id;

      // Environmental entity lives in adaptive_config (Store-managed),
      // so it has a dedicated endpoint. Only call it when something
      // actually changed, and only for sensor_based tasks.
      const envChanged =
        this._environmentalEntity !== this._environmentalInitial
        || this._environmentalAttribute !== this._environmentalAttributeInitial;
      if (
        savedTaskId
        && this._scheduleType === "sensor_based"
        && envChanged
      ) {
        try {
          await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/task/set_environmental_entity",
            entry_id: this._entryId,
            task_id: savedTaskId,
            environmental_entity: this._environmentalEntity || null,
            environmental_attribute: this._environmentalAttribute || null,
          });
          this._environmentalInitial = this._environmentalEntity;
          this._environmentalAttributeInitial = this._environmentalAttribute;
        } catch {
          /* non-fatal — task itself saved */
        }
      }

      this._open = false;
      this.dispatchEvent(new CustomEvent("task-saved"));
    } catch (e) {
      this._error = describeWsError(e, this._lang, t("save_error", this._lang));
    } finally {
      this._loading = false;
    }
  }

  private _close(): void {
    this._open = false;
  }

  private _renderTriggerFields() {
    if (this._scheduleType !== "sensor_based") return nothing;
    const L = this._lang;

    const isCompound = this._triggerType === "compound";
    return html`
      <h3>${t("trigger_configuration", L)}</h3>
      <div class="select-row">
        <label>${t("trigger_type", L)}</label>
        <select
          .value=${this._triggerType}
          @change=${(e: Event) => (this._triggerType = (e.target as HTMLSelectElement).value)}
        >
          ${TRIGGER_TYPE_KEYS_WITH_COMPOUND.map(
            (key) => html`<option value=${key} ?selected=${key === this._triggerType}>${t(key, L)}</option>`
          )}
        </select>
      </div>
      ${isCompound ? this._renderCompoundEditor() : html`
        <ms-textfield
          label="${t("entity_id", L)} (${t("comma_separated", L)})"
          .value=${this._triggerEntityIds.length > 0 ? this._triggerEntityIds.join(", ") : this._triggerEntityId}
          @input=${(e: Event) => {
            const raw = (e.target as HTMLInputElement).value;
            const ids = raw.split(",").map((s: string) => s.trim()).filter(Boolean);
            this._triggerEntityId = ids[0] || "";
            this._triggerEntityIds = ids;
            if (ids[0]) this._fetchEntityAttributes(ids[0]);
          }}
        ></ms-textfield>
        ${this._triggerEntityIds.length > 1 ? html`
          <div class="select-row">
            <label>${t("entity_logic", L)}</label>
            <select
              .value=${this._triggerEntityLogic}
              @change=${(e: Event) => (this._triggerEntityLogic = (e.target as HTMLSelectElement).value as "any" | "all")}
            >
              <option value="any" ?selected=${this._triggerEntityLogic === "any"}>${t("entity_logic_any", L)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic === "all"}>${t("entity_logic_all", L)}</option>
            </select>
          </div>
        ` : nothing}
        ${this._availableAttributes.length > 0
          ? html`
            <div class="select-row">
              <label>${t("attribute_optional", L)}</label>
              <select
                .value=${this._triggerAttribute}
                @change=${(e: Event) => (this._triggerAttribute = (e.target as HTMLSelectElement).value)}
              >
                <option value="" ?selected=${!this._triggerAttribute}>${t("use_entity_state", L)}</option>
                ${this._suggestedAttributes.map(
                  (attr) => html`<option value=${attr} ?selected=${attr === this._triggerAttribute}>${attr} ★</option>`
                )}
                ${this._availableAttributes
                  .filter((a) => !this._suggestedAttributes.includes(a.name))
                  .map(
                    (a) => html`<option value=${a.name} ?selected=${a.name === this._triggerAttribute}>${a.name}${a.numeric ? "" : " (non-numeric)"}</option>`
                  )}
              </select>
            </div>
          `
          : html`
            <ms-textfield
              label="${t("attribute_optional", L)}"
              .value=${this._triggerAttribute}
              @input=${(e: Event) => (this._triggerAttribute = (e.target as HTMLInputElement).value)}
            ></ms-textfield>
          `
        }
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      <label>
        <input
          type="checkbox"
          .checked=${this._autoCompleteOnRecovery}
          @change=${(e: Event) => (this._autoCompleteOnRecovery = (e.target as HTMLInputElement).checked)}
        />
        ${t("auto_complete_on_recovery", L)}
      </label>
      <div class="field-help">${t("auto_complete_on_recovery_help", L)}</div>
      <ms-textfield
        label="${t("safety_interval", L)}"
        type="number"
        .value=${this._intervalDays}
        @input=${(e: Event) => (this._intervalDays = (e.target as HTMLInputElement).value)}
      ></ms-textfield>
      ${this._intervalDays ? this._renderUnitSelect() : nothing}
    `;
  }

  /** Immutably patch one compound condition and trigger a re-render. */
  private _patchCondition(index: number, patch: Partial<CompoundConditionDraft>): void {
    this._compoundConditions = this._compoundConditions.map((c, i) =>
      i === index ? { ...c, ...patch } : c
    );
  }

  private _addCondition(): void {
    this._compoundConditions = [...this._compoundConditions, emptyCondition()];
  }

  private _removeCondition(index: number): void {
    this._compoundConditions = this._compoundConditions.filter((_, i) => i !== index);
  }

  /** Compound trigger editor: AND/OR logic + a list of inline conditions. */
  private _renderCompoundEditor() {
    const L = this._lang;
    return html`
      <div class="select-row">
        <label>${t("compound_logic", L)}</label>
        <select
          .value=${this._compoundLogic}
          @change=${(e: Event) => (this._compoundLogic = (e.target as HTMLSelectElement).value as "AND" | "OR")}
        >
          <option value="AND" ?selected=${this._compoundLogic === "AND"}>${t("compound_logic_and", L)}</option>
          <option value="OR" ?selected=${this._compoundLogic === "OR"}>${t("compound_logic_or", L)}</option>
        </select>
      </div>
      <div class="field-help">${t("compound_help", L)}</div>
      ${this._compoundConditions.length === 0
        ? html`<div class="field-help">${t("compound_no_conditions", L)}</div>`
        : this._compoundConditions.map((c, i) => this._renderCondition(c, i))}
      <button type="button" class="secondary-btn" @click=${() => this._addCondition()}>
        + ${t("compound_add_condition", L)}
      </button>
    `;
  }

  /** One compound condition row: entity + sub-type + type-specific params. */
  private _renderCondition(c: CompoundConditionDraft, i: number) {
    const L = this._lang;
    const num = i + 1;
    return html`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${t("compound_condition", L)} ${num}</span>
          <button
            type="button"
            class="icon-btn"
            title="${t("compound_remove_condition", L)}"
            @click=${() => this._removeCondition(i)}
          >✕</button>
        </div>
        <ms-textfield
          label="${t("entity_id", L)} (${t("comma_separated", L)})"
          .value=${c.entityIds}
          @input=${(e: Event) => this._patchCondition(i, { entityIds: (e.target as HTMLInputElement).value })}
        ></ms-textfield>
        <div class="select-row">
          <label>${t("trigger_type", L)}</label>
          <select
            .value=${c.type}
            @change=${(e: Event) => this._patchCondition(i, { type: (e.target as HTMLSelectElement).value })}
          >
            ${TRIGGER_TYPE_KEYS.map(
              (key) => html`<option value=${key} ?selected=${key === c.type}>${t(key, L)}</option>`
            )}
          </select>
        </div>
        ${this._renderConditionTypeFields(c, i)}
      </div>
    `;
  }

  /** Type-specific inputs for a single compound condition (mirrors the flat
   *  per-type fields, bound to the condition draft). */
  private _renderConditionTypeFields(c: CompoundConditionDraft, i: number) {
    const L = this._lang;
    if (c.type === "threshold") {
      return html`
        <ms-textfield label="${t("trigger_above", L)}" type="number" .value=${c.above}
          @input=${(e: Event) => this._patchCondition(i, { above: (e.target as HTMLInputElement).value })}></ms-textfield>
        <ms-textfield label="${t("trigger_below", L)}" type="number" .value=${c.below}
          @input=${(e: Event) => this._patchCondition(i, { below: (e.target as HTMLInputElement).value })}></ms-textfield>
        <ms-textfield label="${t("for_minutes", L)}" type="number" .value=${c.forMinutes}
          @input=${(e: Event) => this._patchCondition(i, { forMinutes: (e.target as HTMLInputElement).value })}></ms-textfield>
      `;
    }
    if (c.type === "counter") {
      return html`
        <ms-textfield label="${t("target_value", L)}" type="number" .value=${c.targetValue}
          @input=${(e: Event) => this._patchCondition(i, { targetValue: (e.target as HTMLInputElement).value })}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${c.deltaMode}
            @change=${(e: Event) => this._patchCondition(i, { deltaMode: (e.target as HTMLInputElement).checked })} />
          ${t("delta_mode", L)}
        </label>
      `;
    }
    if (c.type === "state_change") {
      return html`
        <ms-textfield label="${t("from_state_optional", L)}" .value=${c.fromState}
          @input=${(e: Event) => this._patchCondition(i, { fromState: (e.target as HTMLInputElement).value })}></ms-textfield>
        <ms-textfield label="${t("to_state_optional", L)}" .value=${c.toState}
          @input=${(e: Event) => this._patchCondition(i, { toState: (e.target as HTMLInputElement).value })}></ms-textfield>
        <ms-textfield label="${t("target_changes", L)}" type="number" .value=${c.targetChanges}
          @input=${(e: Event) => this._patchCondition(i, { targetChanges: (e.target as HTMLInputElement).value })}></ms-textfield>
      `;
    }
    if (c.type === "runtime") {
      return html`
        <ms-textfield label="${t("runtime_hours", L)}" type="number" .value=${c.runtimeHours}
          @input=${(e: Event) => this._patchCondition(i, { runtimeHours: (e.target as HTMLInputElement).value })}></ms-textfield>
        <ms-textfield label="${t("runtime_on_states", L)}" placeholder="on" .value=${c.onStates}
          @input=${(e: Event) => this._patchCondition(i, { onStates: (e.target as HTMLInputElement).value })}></ms-textfield>
      `;
    }
    return nothing;
  }

  /** Shared interval-unit dropdown (DRY: time-based interval + sensor safety
   *  interval). Bound to _intervalUnit; options localized via unit_* keys. */
  private _renderUnitSelect() {
    const L = this._lang;
    return html`
      <div class="select-row">
        <label>${t("interval_unit", L)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${(e: Event) => (this._intervalUnit = (e.target as HTMLSelectElement).value)}
        >
          ${["days", "weeks", "months", "years"].map(
            (u) => html`<option value=${u} ?selected=${u === this._intervalUnit}>${t("unit_" + u, L)}</option>`
          )}
        </select>
      </div>`;
  }

  private _toggleWeekday(i: number): void {
    this._weekdays = this._weekdays.includes(i)
      ? this._weekdays.filter((d) => d !== i)
      : [...this._weekdays, i];
  }

  /** The draft schedule in engine (Schedule.to_dict) form — MIRRORS the
   *  _save mapping; keep both in sync when adding schedule fields. Null =
   *  nothing to preview (manual, or trigger-only without an interval). */
  private _previewScheduleDict(): Record<string, unknown> | null {
    if (this._scheduleType === "one_time") {
      return this._dueDate ? { kind: "one_time", due_date: this._dueDate } : null;
    }
    if (CALENDAR_KINDS.includes(this._scheduleType)) {
      return { ...this._buildSchedule(), ...this._recurrenceExtras() };
    }
    const every = parseInt(this._intervalDays, 10);
    if (this._scheduleType === "manual" || !every || every <= 0) return null;
    return {
      kind: "interval",
      every,
      unit: this._intervalUnit,
      anchor: this._intervalAnchor,
      ...this._recurrenceExtras(),
    };
  }

  private static readonly _PREVIEW_RELEVANT = new Set([
    "_open", "_scheduleType", "_intervalDays", "_intervalUnit", "_intervalAnchor",
    "_dueDate", "_weekdays", "_nth", "_nthWeekday", "_domDay", "_domLastDay",
    "_domBusiness", "_calOffset", "_seasonMonths", "_endsMode", "_endsCount",
    "_endsUntil", "_lastPerformed",
  ]);

  protected updated(changed: Map<PropertyKey, unknown>): void {
    super.updated?.(changed);
    for (const key of changed.keys()) {
      if (MaintenanceTaskDialog._PREVIEW_RELEVANT.has(String(key))) {
        this._schedulePreviewRefresh();
        return;
      }
    }
  }

  private _schedulePreviewRefresh(): void {
    if (this._previewTimer) clearTimeout(this._previewTimer);
    this._previewTimer = setTimeout(() => void this._fetchSchedulePreview(), 300);
  }

  private async _fetchSchedulePreview(): Promise<void> {
    const sched = this._open ? this._previewScheduleDict() : null;
    if (!sched) {
      this._schedulePreview = [];
      this._schedulePreviewEnded = false;
      return;
    }
    const seq = ++this._previewSeq;
    try {
      const res = await this.hass.connection.sendMessagePromise<{
        occurrences: string[];
        series_ended: boolean;
      }>({
        type: "maintenance_supporter/schedule/preview",
        schedule: sched,
        ...(this._lastPerformed ? { last_performed: this._lastPerformed } : {}),
      });
      if (seq !== this._previewSeq) return; // a newer edit superseded this
      this._schedulePreview = res.occurrences || [];
      this._schedulePreviewEnded = !!res.series_ended;
    } catch {
      // Transient WS error — keep the last preview instead of flickering.
    }
  }

  private _renderSchedulePreview() {
    if (this._schedulePreview.length === 0) return nothing;
    const L = this._lang;
    const time = this.scheduleTimeEnabled && this._scheduleTime ? ` ${this._scheduleTime}` : "";
    const chips = this._schedulePreview
      .map((iso, i) => {
        const js = new Date(`${iso}T12:00:00`).getDay(); // 0=Sun
        const wd = weekdayName(js === 0 ? 6 : js - 1, L, "short");
        return `${wd} ${formatDate(iso, L)}${i === 0 ? time : ""}`;
      })
      .join(" · ");
    const onTime =
      this._scheduleType === "time_based" && this._intervalAnchor === "completion"
        ? html`<div class="field-help">${t("schedule_preview_ontime", L)}</div>`
        : nothing;
    return html`
      <div class="trigger-live-hint schedule-preview">
        ${t("schedule_preview_title", L)}: ${chips}${this._schedulePreviewEnded
          ? html` <span class="field-help">${t("schedule_preview_ends", L)}</span>`
          : nothing}
        ${onTime}
      </div>
    `;
  }

  /** Build the nested `schedule` object for the selected calendar kind. */
  private _buildSchedule(): Record<string, unknown> {
    const withOffset = (schedule: Record<string, unknown>) => {
      const off = parseInt(this._calOffset, 10) || 0;
      if (off) schedule.offset = Math.max(-15, Math.min(off, 15));
      return schedule;
    };
    if (this._scheduleType === "weekdays") {
      return withOffset({ kind: "weekdays", weekdays: [...this._weekdays].sort((a, b) => a - b) });
    }
    if (this._scheduleType === "nth_weekday") {
      return withOffset({
        kind: "nth_weekday",
        nth: parseInt(this._nth, 10),
        weekday: parseInt(this._nthWeekday, 10),
      });
    }
    // (#83) "last day" wins over the day number; business rolls weekends back.
    const schedule: Record<string, unknown> = {
      kind: "day_of_month",
      day: this._domLastDay ? -1 : (parseInt(this._domDay, 10) || 1),
    };
    if (this._domBusiness) schedule.business = true;
    return withOffset(schedule);
  }

  /** The season/finite-series extras to attach to a recurring schedule. Empty
   *  values are omitted, so a clean schedule stays clean (and, since the sent
   *  schedule is authoritative, an omitted extra clears a previously-set one). */
  private _recurrenceExtras(): { season_months?: number[]; ends?: { count?: number; until?: string } } {
    const extras: { season_months?: number[]; ends?: { count?: number; until?: string } } = {};
    if (this._seasonMonths.length) extras.season_months = [...this._seasonMonths].sort((a, b) => a - b);
    if (this._endsMode === "count") {
      const n = parseInt(this._endsCount, 10);
      if (n >= 1) extras.ends = { count: n };
    } else if (this._endsMode === "until" && this._endsUntil) {
      extras.ends = { until: this._endsUntil };
    }
    return extras;
  }

  private _toggleSeasonMonth(m: number): void {
    this._seasonMonths = this._seasonMonths.includes(m)
      ? this._seasonMonths.filter((x) => x !== m)
      : [...this._seasonMonths, m];
  }

  /** Seasonal window + finite-series end — shown for recurring (interval +
   *  calendar) kinds, where both apply. */
  private _renderRecurrenceExtras() {
    const L = this._lang;
    const recurring = this._scheduleType === "time_based" || CALENDAR_KINDS.includes(this._scheduleType);
    if (!recurring) return nothing;
    const months = monthNames(L);
    return html`
      <label class="field-label">${t("season_window_label", L)}</label>
      <div class="field-help">${t("season_window_hint", L)}</div>
      <div class="weekday-chips season-chips">
        ${months.map((name, i) => html`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(i + 1) ? "selected" : ""}"
            @click=${() => this._toggleSeasonMonth(i + 1)}
          >${name}</button>`)}
      </div>

      <label class="field-label">${t("series_end_label", L)}</label>
      <div class="select-row">
        <select .value=${this._endsMode}
          @change=${(e: Event) => (this._endsMode = (e.target as HTMLSelectElement).value as "never" | "count" | "until")}>
          <option value="never" ?selected=${this._endsMode === "never"}>${t("series_end_never", L)}</option>
          <option value="count" ?selected=${this._endsMode === "count"}>${t("series_end_after_count", L)}</option>
          <option value="until" ?selected=${this._endsMode === "until"}>${t("series_end_until", L)}</option>
        </select>
      </div>
      ${this._endsMode === "count" ? html`
        <ms-textfield
          label="${t("series_end_count_label", L)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${(e: Event) => (this._endsCount = (e.target as HTMLInputElement).value)}
        ></ms-textfield>` : nothing}
      ${this._endsMode === "until" ? html`
        <ms-textfield
          label="${t("series_end_until_label", L)}"
          type="date"
          .value=${this._endsUntil}
          @input=${(e: Event) => (this._endsUntil = (e.target as HTMLInputElement).value)}
        ></ms-textfield>` : nothing}
    `;
  }

  /** Per-kind field groups for the calendar recurrence kinds. */
  private _renderCalendarFields() {
    const L = this._lang;
    const days = weekdayNames(L);
    if (this._scheduleType === "weekdays") {
      return html`
        <label class="field-label">${t("recurrence_on_days", L)}</label>
        <div class="weekday-chips">
          ${days.map((name, i) => html`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(i) ? "selected" : ""}"
              @click=${() => this._toggleWeekday(i)}
            >${name}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;
    }
    if (this._scheduleType === "nth_weekday") {
      const nths: Array<[string, string]> = [
        ["1", t("ord_1", L)], ["2", t("ord_2", L)], ["3", t("ord_3", L)],
        ["4", t("ord_4", L)], ["5", t("ord_5", L)], ["-1", t("ord_last", L)],
      ];
      return html`
        <div class="select-row">
          <label>${t("recurrence_occurrence", L)}</label>
          <select .value=${this._nth} @change=${(e: Event) => (this._nth = (e.target as HTMLSelectElement).value)}>
            ${nths.map(([v, lbl]) => html`<option value=${v} ?selected=${v === this._nth}>${lbl}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${t("recurrence_weekday", L)}</label>
          <select .value=${this._nthWeekday} @change=${(e: Event) => (this._nthWeekday = (e.target as HTMLSelectElement).value)}>
            ${days.map((name, i) => html`<option value=${String(i)} ?selected=${String(i) === this._nthWeekday}>${name}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`;
    }
    if (this._scheduleType === "day_of_month") {
      return html`
        ${this._domLastDay ? nothing : html`
          <ms-textfield
            label="${t("recurrence_day", L)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${(e: Event) => (this._domDay = (e.target as HTMLInputElement).value)}
          ></ms-textfield>`}
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domLastDay}
            @change=${(e: Event) => (this._domLastDay = (e.target as HTMLInputElement).checked)} />
          <span>${t("recurrence_last_day", L)}</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domBusiness}
            @change=${(e: Event) => (this._domBusiness = (e.target as HTMLInputElement).checked)} />
          <span>${t("recurrence_business_day", L)}</span>
        </label>
        ${this._renderCalOffsetField()}`;
    }
    return nothing;
  }

  /** (#83) ±N-day shift shared by all calendar kinds. */
  private _renderCalOffsetField() {
    const L = this._lang;
    return html`
      <ms-textfield
        label="${t("recurrence_offset", L)}"
        helper="${t("recurrence_offset_help", L)}"
        type="number"
        min="-15"
        max="15"
        .value=${this._calOffset}
        @input=${(e: Event) => (this._calOffset = (e.target as HTMLInputElement).value)}
      ></ms-textfield>`;
  }

  /** Live "what happens next" hint for sensor-based triggers.
   *
   * Reads the bound entity's CURRENT state client-side (the dialog already
   * holds `hass`) and spells out the trigger semantics against it — clearing
   * the most common usage-meter confusion: a delta counter counts from the
   * sensor's current reading (not from zero) and restarts after each
   * completion. Renders nothing when there's no entity/state to read.
   */
  private _renderTriggerLiveHint() {
    if (this._triggerType === "compound") return nothing;
    const entityId = this._triggerEntityId || this._triggerEntityIds[0];
    if (!entityId || !this.hass?.states) return nothing;
    const st = this.hass.states[entityId];
    if (!st) return nothing;
    const L = this._lang;

    const unitAttr = st.attributes?.unit_of_measurement;
    const unit = typeof unitAttr === "string" && unitAttr ? ` ${unitAttr}` : "";
    const raw = this._triggerAttribute
      ? st.attributes?.[this._triggerAttribute]
      : st.state;
    const num = typeof raw === "number" ? raw : parseFloat(String(raw));
    const hasNum = raw !== "unknown" && raw !== "unavailable" && raw != null && !isNaN(num);
    const fmt = (v: number) => (Number.isInteger(v) ? String(v) : String(Math.round(v * 10) / 10));

    const parts: string[] = [];
    if (this._triggerType === "threshold") {
      const above = parseFloat(this._triggerAbove);
      const below = parseFloat(this._triggerBelow);
      if (isNaN(above) && isNaN(below)) return nothing;
      if (hasNum) parts.push(t("trigger_hint_now", L).replace("{value}", fmt(num) + unit));
      if (!isNaN(above)) parts.push(t("trigger_hint_above", L).replace("{target}", fmt(above) + unit));
      if (!isNaN(below)) parts.push(t("trigger_hint_below", L).replace("{target}", fmt(below) + unit));
    } else if (this._triggerType === "counter") {
      const target = parseFloat(this._triggerTargetValue);
      if (isNaN(target)) return nothing;
      if (this._triggerDeltaMode) {
        if (this._taskId) {
          // Editing: the baseline is the reading at the last completion (or
          // task creation), not the current value — don't imply otherwise.
          parts.push(t("trigger_hint_counter_delta_edit", L).replace("{target}", fmt(target) + unit));
        } else if (hasNum) {
          parts.push(
            t("trigger_hint_counter_delta", L)
              .replace("{value}", fmt(num) + unit)
              .replace("{due}", fmt(num + target) + unit)
              .replace("{target}", fmt(target) + unit),
          );
        } else {
          parts.push(t("trigger_hint_counter_delta_edit", L).replace("{target}", fmt(target) + unit));
        }
      } else {
        if (hasNum) parts.push(t("trigger_hint_now", L).replace("{value}", fmt(num) + unit));
        parts.push(t("trigger_hint_counter_abs", L).replace("{target}", fmt(target) + unit));
      }
    } else if (this._triggerType === "runtime") {
      const hours = parseFloat(this._triggerRuntimeHours);
      if (isNaN(hours)) return nothing;
      parts.push(t("trigger_hint_runtime", L).replace("{hours}", fmt(hours)));
      parts.push(t("trigger_hint_state_now", L).replace("{value}", String(st.state)));
    } else if (this._triggerType === "state_change") {
      const n = parseInt(this._triggerTargetChanges, 10) || 1;
      const to = this._triggerToState.trim();
      parts.push(
        (to
          ? t("trigger_hint_state_change_to", L).replace("{state}", to)
          : t("trigger_hint_state_change", L)
        ).replace("{count}", String(n)),
      );
      parts.push(t("trigger_hint_state_now", L).replace("{value}", String(st.state)));
    }
    if (!parts.length) return nothing;
    return html`<div class="trigger-live-hint">${parts.join(" ")}</div>`;
  }

  private _renderTriggerTypeFields() {
    const L = this._lang;
    if (this._triggerType === "threshold") {
      return html`
        <ms-textfield
          label="${t("trigger_above", L)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${(e: Event) => (this._triggerAbove = (e.target as HTMLInputElement).value)}
        ></ms-textfield>
        <ms-textfield
          label="${t("trigger_below", L)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${(e: Event) => (this._triggerBelow = (e.target as HTMLInputElement).value)}
        ></ms-textfield>
        <ms-textfield
          label="${t("for_at_least_minutes", L)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${(e: Event) => (this._triggerForMinutes = (e.target as HTMLInputElement).value)}
        ></ms-textfield>
      `;
    }
    if (this._triggerType === "counter") {
      return html`
        <ms-textfield
          label="${t("target_value", L)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${(e: Event) => (this._triggerTargetValue = (e.target as HTMLInputElement).value)}
        ></ms-textfield>
        <label>
          <input
            type="checkbox"
            .checked=${this._triggerDeltaMode}
            @change=${(e: Event) => (this._triggerDeltaMode = (e.target as HTMLInputElement).checked)}
          />
          ${t("delta_mode", L)}
        </label>
        ${this._triggerDeltaMode
          ? html`
              <ms-textfield
                label="${t("baseline_start_value", L)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${(e: Event) => (this._triggerBaselineValue = (e.target as HTMLInputElement).value)}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId ? t("baseline_start_help_edit", L) : t("baseline_start_help", L)}
                ${this._taskId && this._liveBaselineValue != null
                  ? html`<div class="baseline-effective">
                      ${t("baseline_current_effective", L).replace(
                        "{value}",
                        String(this._liveBaselineValue),
                      )}
                    </div>`
                  : nothing}
              </div>
            `
          : nothing}
      `;
    }
    if (this._triggerType === "state_change") {
      return html`
        <ms-textfield
          label="${t("from_state_optional", L)}"
          .value=${this._triggerFromState}
          @input=${(e: Event) => (this._triggerFromState = (e.target as HTMLInputElement).value)}
        ></ms-textfield>
        <div class="field-help">${t("state_value_help", L)}</div>
        <ms-textfield
          label="${t("to_state_optional", L)}"
          .value=${this._triggerToState}
          @input=${(e: Event) => (this._triggerToState = (e.target as HTMLInputElement).value)}
        ></ms-textfield>
        <ms-textfield
          label="${t("target_changes", L)}"
          type="number"
          min="1"
          .value=${this._triggerTargetChanges}
          @input=${(e: Event) => (this._triggerTargetChanges = (e.target as HTMLInputElement).value)}
        ></ms-textfield>
        <div class="field-help">${t("target_changes_help", L)}</div>
      `;
    }
    if (this._triggerType === "runtime") {
      return html`
        <ms-textfield
          label="${t("runtime_hours", L)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${(e: Event) => (this._triggerRuntimeHours = (e.target as HTMLInputElement).value)}
        ></ms-textfield>
        <ms-textfield
          label="${t("runtime_on_states", L)}"
          placeholder="on"
          .value=${this._triggerOnStates}
          @input=${(e: Event) => (this._triggerOnStates = (e.target as HTMLInputElement).value)}
        ></ms-textfield>
        <div class="field-help">${t("runtime_on_states_help", L)}</div>
      `;
    }
    return nothing;
  }

  render() {
    if (!this._open) return html``;
    const L = this._lang;
    const title = this._taskId ? t("edit_task", L) : t("new_task", L);
    return html`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${title}</div>
        <div class="content">
          ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
          ${this._objectChoices.length > 0 ? html`
            <div class="select-row">
              <label>${t("object", L)}</label>
              <select
                .value=${this._entryId}
                @change=${(e: Event) => {
                  this._entryId = (e.target as HTMLSelectElement).value;
                  this._consumesParts = {};
                  this._loadParts();
                }}
              >
                ${this._objectChoices.map(
                  (o) => html`<option value=${o.entry_id} ?selected=${o.entry_id === this._entryId}>${o.name}</option>`
                )}
              </select>
            </div>
          ` : nothing}
          <ms-textfield
            label="${t("task_name", L)}"
            required
            .value=${this._name}
            @input=${(e: Event) => (this._name = (e.target as HTMLInputElement).value)}
          ></ms-textfield>
          <div class="select-row">
            <label>${t("maintenance_type", L)}</label>
            <select
              .value=${this._type}
              @change=${(e: Event) => (this._type = (e.target as HTMLSelectElement).value)}
            >
              ${MAINTENANCE_TYPE_KEYS.map(
                (key) => html`<option value=${key} ?selected=${key === this._type}>${t(key, L)}</option>`
              )}
            </select>
          </div>
          ${this._type === "reading"
            ? html`
                <ms-textfield
                  label="${t("reading_unit_label", L)}"
                  .value=${this._readingUnit}
                  @input=${(e: Event) => (this._readingUnit = (e.target as HTMLInputElement).value)}
                ></ms-textfield>
                <div class="field-help">${t("reading_unit_help", L)}</div>
              `
            : nothing}
          ${this._partsLoadFailed
            ? html`<div class="field-help parts-load-failed">${t("parts_load_failed", L)}</div>`
            : nothing}
          ${this.parts.length
            ? html`
                <div class="field">
                  <label>${t("consumes_parts_label", L)}</label>
                  ${this.parts.map((part) => {
                    const qty = this._consumesParts[part.id];
                    return html`
                      <div class="consumes-row">
                        <label class="consumes-check">
                          <input
                            type="checkbox"
                            .checked=${qty !== undefined}
                            @change=${(e: Event) => {
                              const next = { ...this._consumesParts };
                              if ((e.target as HTMLInputElement).checked) next[part.id] = next[part.id] || 1;
                              else delete next[part.id];
                              this._consumesParts = next;
                            }}
                          />
                          <span>${part.name}${part.unit ? ` (${part.unit})` : ""}</span>
                        </label>
                        ${qty !== undefined
                          ? html`<input
                              class="consumes-qty"
                              type="number"
                              min="0.01"
                              max="999"
                              step="0.01"
                              .value=${String(qty)}
                              @input=${(e: Event) => {
                                const v = parseFloat((e.target as HTMLInputElement).value);
                                this._consumesParts = { ...this._consumesParts, [part.id]: Number.isFinite(v) && v >= 0.01 ? v : 1 };
                              }}
                            />`
                          : nothing}
                      </div>
                    `;
                  })}
                </div>
              `
            : nothing}
          <div class="select-row">
            <label>${t("priority", L)}</label>
            <select
              .value=${this._priority}
              @change=${(e: Event) => (this._priority = (e.target as HTMLSelectElement).value)}
            >
              ${PRIORITY_KEYS.map(
                (key) => html`<option value=${key} ?selected=${key === this._priority}>${t("priority_" + key, L)}</option>`
              )}
            </select>
          </div>
          <div class="field">
            <label>${t("labels", L)}</label>
            <input
              type="text"
              .value=${this._labels}
              placeholder="${t("labels_placeholder", L)}"
              @input=${(e: Event) => (this._labels = (e.target as HTMLInputElement).value)}
            />
            <div class="field-help">${t("labels_help", L)}</div>
          </div>
          <div class="select-row">
            <label>${t("schedule_type", L)}</label>
            <select
              .value=${this._scheduleType}
              @change=${(e: Event) => (this._scheduleType = (e.target as HTMLSelectElement).value)}
            >
              ${SCHEDULE_TYPE_KEYS.map(
                (key) => html`<option value=${key} ?selected=${key === this._scheduleType}>${t(key, L)}</option>`
              )}
            </select>
          </div>
          ${this._scheduleType === "time_based"
            ? html`
                <ms-textfield
                  label="${t("interval_value", L)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${(e: Event) => (this._intervalDays = (e.target as HTMLInputElement).value)}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${t("interval_anchor", L)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${(e: Event) => (this._intervalAnchor = (e.target as HTMLSelectElement).value as "completion" | "planned")}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor === "completion"}>${t("anchor_completion", L)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor === "planned"}>${t("anchor_planned", L)}</option>
                  </select>
                </div>
                ${this.scheduleTimeEnabled ? html`
                  <ms-textfield
                    label="${t("schedule_time_optional", L)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${t("schedule_time_help", L)}"
                    @input=${(e: Event) => (this._scheduleTime = (e.target as HTMLInputElement).value)}
                  ></ms-textfield>
                ` : nothing}
              `
            : nothing}
          ${this._renderCalendarFields()}
          ${this._scheduleType === "one_time"
            ? html`
                <ms-textfield
                  label="${t("due_date", L)}"
                  type="date"
                  .value=${this._dueDate}
                  @input=${(e: Event) => (this._dueDate = (e.target as HTMLInputElement).value)}
                ></ms-textfield>
              `
            : nothing}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-textfield
            label="${t("warning_days", L)}"
            type="number"
            .value=${this._warningDays}
            @input=${(e: Event) => (this._warningDays = (e.target as HTMLInputElement).value)}
          ></ms-textfield>
          <ms-textfield
            label="${t("earliest_completion_days", L)}"
            helper="${t("earliest_completion_days_help", L)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${(e: Event) => (this._earliestCompletionDays = (e.target as HTMLInputElement).value)}
          ></ms-textfield>
          ${this.checklistsEnabled ? html`
            <h3>${t("checklist_steps_optional", L)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${t("checklist_placeholder", L)}"
              .value=${this._checklistText}
              @input=${(e: Event) => (this._checklistText = (e.target as HTMLTextAreaElement).value)}
            ></textarea>
            <div class="field-help">${t("checklist_help", L)}</div>
          ` : nothing}
          <ms-textfield
            label="${t("last_performed_optional", L)}"
            type="date"
            .value=${this._lastPerformed}
            @input=${(e: Event) => (this._lastPerformed = (e.target as HTMLInputElement).value)}
          ></ms-textfield>
          <div class="select-row">
            <label>${t("responsible_user", L)}</label>
            <select
              .value=${this._responsibleUserId || ""}
              @change=${(e: Event) => {
                const val = (e.target as HTMLSelectElement).value;
                this._responsibleUserId = val || null;
              }}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${t("no_user_assigned", L)}</option>
              ${this._availableUsers.map(
                (user) => html`<option value=${user.id} ?selected=${user.id === this._responsibleUserId}>${user.name}</option>`
              )}
            </select>
          </div>
          ${this._availableUsers.length >= 2 ? html`
            <div class="field">
              <label>${t("shared_with", L)}</label>
              <div class="field-help">${t("shared_with_help", L)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map((user) => html`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(user.id)}
                      @change=${() => this._toggleAssignee(user.id)} />
                    <span>${user.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length >= 2 ? html`
              <div class="select-row">
                <label>${t("rotation_strategy", L)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${(e: Event) => (this._rotationStrategy = (e.target as HTMLSelectElement).value)}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${t("rotation_none", L)}</option>
                  ${["round_robin", "least_completed", "random"].map(
                    (key) => html`<option value=${key} ?selected=${key === this._rotationStrategy}>${t("rotation_" + key, L)}</option>`
                  )}
                </select>
              </div>` : nothing}
          ` : nothing}
          ${this._renderTriggerFields()}
          ${this._scheduleType === "sensor_based" ? html`
            <ms-textfield
              label="${t("environmental_entity_optional", L)}"
              helper="${t("environmental_entity_helper", L)}"
              .value=${this._environmentalEntity}
              @input=${(e: Event) => (this._environmentalEntity = (e.target as HTMLInputElement).value.trim())}
            ></ms-textfield>
            ${this._environmentalEntity ? html`
              <ms-textfield
                label="${t("environmental_attribute_optional", L)}"
                .value=${this._environmentalAttribute}
                @input=${(e: Event) => (this._environmentalAttribute = (e.target as HTMLInputElement).value.trim())}
              ></ms-textfield>
            ` : nothing}
          ` : nothing}
          <ms-textfield
            label="${t("notes_optional", L)}"
            .value=${this._notes}
            @input=${(e: Event) => (this._notes = (e.target as HTMLInputElement).value)}
          ></ms-textfield>
          <ms-textfield
            label="${t("documentation_url_optional", L)}"
            .value=${this._documentationUrl}
            @input=${(e: Event) => (this._documentationUrl = (e.target as HTMLInputElement).value)}
          ></ms-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${t("custom_icon_optional", L)}"
            .value=${this._customIcon}
            @value-changed=${(e: CustomEvent) =>
              (this._customIcon = (e.detail.value as string) || "")}
          ></ha-icon-picker>
          ${this._availableTags.length > 0
            ? html`
              <div class="select-row">
                <label>${t("nfc_tag_id_optional", L)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${(e: Event) => (this._nfcTagId = (e.target as HTMLSelectElement).value)}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${t("no_nfc_tag", L)}</option>
                  ${this._availableTags.map(
                    (tag) => html`<option value=${tag.id} ?selected=${tag.id === this._nfcTagId}>${tag.name}</option>`
                  )}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${t("nfc_tags_refresh", L)}">↻</button>
              </div>
            `
            : html`
              <ms-textfield
                label="${t("nfc_tag_id_optional", L)}"
                .value=${this._nfcTagId}
                @input=${(e: Event) => (this._nfcTagId = (e.target as HTMLInputElement).value)}
              ></ms-textfield>
              <div class="field-help">
                ${t("nfc_tags_empty_help", L)}
                <a href="/config/tags">${t("nfc_tags_open_settings", L)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${t("nfc_tags_refresh", L)}
                </button>
              </div>
            `
          }
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${(e: Event) => (this._enabled = (e.target as HTMLInputElement).checked)}
            />
            ${t("task_enabled", L)}
          </label>
          ${this._renderCompletionActionsSection(L)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${t("cancel", L)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading || !this._name.trim()}
          >
            ${this._loading ? t("saving", L) : t("save", L)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }

  static styles = css`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* v1.3.0: completion-action sections */
    .ca-section {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 8px;
    }
    .ca-section > summary {
      cursor: pointer;
      font-weight: 500;
    }
    .ca-section ms-textfield,
    .ca-section ha-entity-picker,
    .ca-section ha-service-picker,
    .ca-section ha-form,
    .ca-section .qc-feedback {
      width: 100%;
      margin-top: 8px;
      display: block;
    }
    .ca-section .qc-feedback {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .ca-test-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }
    .ca-test-ok { color: var(--success-color, #4caf50); font-size: 13px; }
    .ca-test-error { color: var(--error-color, #f44336); font-size: 13px; font-weight: 500; }
    .ca-test-error-block { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
    .ca-test-error-detail {
      font-size: 12px;
      color: var(--secondary-text-color);
      background: rgba(244, 67, 54, 0.08);
      padding: 6px 8px; border-radius: 4px;
      line-height: 1.4;
      word-break: break-word;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 350px;
      max-height: 70vh;
      overflow-y: auto;
    }
    @media (max-width: 600px) {
      .content {
        min-width: 0;
        max-height: none;
      }
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    ms-textfield {
      display: block;
    }
    .field-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .checklist-textarea {
      width: 100%;
      min-height: 88px;
      padding: 8px;
      font-family: inherit;
      font-size: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      resize: vertical;
      box-sizing: border-box;
    }
    .consumes-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 2px 0;
    }
    .consumes-check {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
    }
    .consumes-qty {
      width: 64px;
      padding: 4px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .field-help {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .baseline-effective {
      margin-top: 2px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    /* Live computed trigger hint — reads the bound sensor and explains what
       happens next. Info-accented so it reads as guidance, not an error. */
    .trigger-live-hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      border-left: 3px solid var(--info-color, #2196f3);
      background: rgba(33, 150, 243, 0.08);
      border-radius: 0 6px 6px 0;
      padding: 6px 10px;
      margin: 4px 0;
    }
    .field-help a,
    .link-button {
      background: none;
      border: 0;
      padding: 0;
      color: var(--primary-color);
      cursor: pointer;
      font: inherit;
      text-decoration: underline;
    }
    .field-help a:hover,
    .link-button:hover {
      text-decoration: none;
    }
    /* Smaller refresh icon-button when shown next to the dropdown. */
    .select-row .link-button {
      margin-left: 8px;
      text-decoration: none;
      font-size: 16px;
    }
    .select-row .link-button:hover {
      color: var(--primary-color);
      opacity: 0.7;
    }
    h3 {
      margin: 8px 0 0;
      font-size: 14px;
      color: var(--primary-color);
    }
    .select-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .assignee-pool {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      margin-top: 4px;
    }
    .checkbox-row {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      cursor: pointer;
      margin: 2px 0;
    }
    .checkbox-row input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .pool-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .pool-item input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .select-row label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .select-row select {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .field-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .weekday-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .weekday-chip {
      padding: 6px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 16px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
    }
    .weekday-chip.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .season-chip {
      padding: 6px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 16px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
    }
    .season-chip.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
    }
  `;
}

if (!customElements.get("maintenance-task-dialog")) {
  customElements.define("maintenance-task-dialog", MaintenanceTaskDialog);
}
