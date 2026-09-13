/**
 * Translate raw voluptuous / Home-Assistant WS error messages into a
 * localized, human-readable sentence.
 *
 * The HA WS layer wraps voluptuous errors in
 *   { code: "invalid_format", message: "<voluptuous text>" }
 * The voluptuous text is consistently shaped — we parse the common
 * patterns and emit a localized template string. Our own handlers reply
 * with one of the codes in WS_ERROR_CODE_KEYS and a free-text message;
 * the code picks the localized headline, the message rides along in
 * parentheses when it says more than the code does. Falls back to the raw
 * message when nothing matches, so the user never sees a silent failure.
 */
import { t } from "./styles";

/**
 * Every error code the backend's `send_error(msg["id"], "<code>", …)` calls
 * produce (websocket/*.py) → the locale key of its headline. Tripwired by
 * tests/test_frontend_const_parity.py: a new backend code without a row
 * here fails CI, as does a row whose key is missing from en.json.
 */
export const WS_ERROR_CODE_KEYS: Record<string, string> = {
  already_archived: "ws_err_already_archived",
  already_paused: "ws_err_already_paused",
  archived: "ws_err_archived",
  create_failed: "ws_err_create_failed",
  duplicate_failed: "ws_err_duplicate_failed",
  empty: "ws_err_empty",
  empty_csv: "ws_err_empty_csv",
  invalid_cursor: "ws_err_invalid_cursor",
  invalid_date: "ws_err_invalid_date",
  invalid_device: "ws_err_invalid_device",
  invalid_entity_slug: "ws_err_invalid_entity_slug",
  invalid_format: "ws_err_invalid_format",
  invalid_input: "ws_err_invalid_input",
  invalid_mirror_todo: "ws_err_invalid_mirror_todo",
  invalid_parent: "ws_err_invalid_parent",
  invalid_range: "ws_err_invalid_range",
  invalid_search_template: "ws_err_invalid_search_template",
  invalid_target: "ws_err_invalid_target",
  invalid_trigger_config: "ws_err_invalid_trigger_config",
  invalid_url: "ws_err_invalid_url",
  invalid_user: "ws_err_invalid_user",
  invalid_view: "ws_err_invalid_view",
  limit_reached: "ws_err_limit_reached",
  no_defaults: "ws_err_no_defaults",
  no_phases: "ws_err_no_phases",
  no_url: "ws_err_no_url",
  not_archived: "ws_err_not_archived",
  not_available: "ws_err_not_available",
  not_configured: "ws_err_not_configured",
  not_found: "ws_err_not_found",
  not_loaded: "ws_err_not_loaded",
  not_paused: "ws_err_not_paused",
  replace_failed: "ws_err_replace_failed",
  self_link_device: "ws_err_self_link_device",
  storage_unavailable: "ws_err_storage_unavailable",
  too_early: "ws_err_too_early",
  too_large: "ws_err_too_large",
  too_many: "ws_err_too_many",
  too_many_views: "ws_err_too_many_views",
  unauthorized: "ws_err_unauthorized",
  unavailable: "ws_err_unavailable",
};

/**
 * Map of internal field keys (as they appear in voluptuous error paths)
 * to existing i18n label keys. A field without an entry here is humanised
 * (`interval_days` → "Interval days", `entry_id` → "Entry") so the user
 * can still tell which input was rejected. Only fields whose label key
 * differs from a plain humanisation need a row.
 */
const FIELD_LABEL_KEYS: Record<string, string> = {
  entry_id: "object",
  name: "name",
  task_type: "maintenance_type",
  schedule_type: "schedule_type",
  interval_days: "interval_days",
  interval_anchor: "interval_anchor",
  warning_days: "warning_days",
  last_performed: "last_performed_optional",
  notes: "notes_optional",
  documentation_url: "documentation_url_optional",
  custom_icon: "custom_icon_optional",
  nfc_tag_id: "nfc_tag_id_optional",
  responsible_user_id: "responsible_user",
  entity_slug: "entity_slug",
  entity_id: "entity_id",
  area_id: "area_id_optional",
  manufacturer: "manufacturer_optional",
  model: "model_optional",
  serial_number: "serial_number_optional",
  installation_date: "installation_date_optional",
  warranty_expiry: "warranty_expiry_optional",
  checklist: "checklist_steps_optional",
  reason: "reason",
  feedback: "feedback",
  cost: "cost",
  duration: "duration",
  description: "description_optional",
  environmental_entity: "environmental_entity_optional",
  environmental_attribute: "environmental_attribute_optional",
  trigger_above: "trigger_above",
  trigger_below: "trigger_below",
  trigger_equals: "trigger_equals",
  trigger_not_equals: "trigger_not_equals",
  trigger_for_minutes: "trigger_for_minutes",
};

/** `snake_case_id` → "Snake case": the label of a field no key covers. */
export function humanizeField(field: string): string {
  const words = field.replace(/_ids?$/, "").split("_").filter(Boolean);
  if (words.length === 0) return field;
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function _label(field: string, lang: string): string {
  const key = FIELD_LABEL_KEYS[field];
  if (key) {
    // t() returns the key itself when missing — humanise in that case
    // rather than show the i18n key with underscores.
    const translated = t(key, lang);
    if (translated && translated !== key) return translated;
  }
  return humanizeField(field);
}

interface ParsedError {
  field?: string;
  rule:
    | "too_long"
    | "too_short"
    | "value_too_high"
    | "value_too_low"
    | "required"
    | "wrong_type"
    | "invalid_choice"
    | "invalid_value"
    | "unknown";
  param?: string;
}

function _parse(message: string): ParsedError {
  // Examples voluptuous produces:
  //   "length of value must be at most 64 for dictionary value @ data['entry_id']"
  //   "length of value must be at least 1 for dictionary value @ data['name']"
  //   "value must be at most 365 for dictionary value @ data['warning_days']"
  //   "value must be at least 0 for dictionary value @ data['warning_days']"
  //   "required key not provided @ data['name']"
  //   "expected str for dictionary value @ data['notes']"
  //   "expected int for dictionary value @ data['interval_days']"
  //   "value must be one of ['completion', 'planned'] for dictionary value @ data['interval_anchor']"
  //   "not a valid value for dictionary value @ data['date']"
  // Nested paths ("@ data['trigger_config']['trigger_above']") name the
  // innermost key — that is the input the user can fix.
  const path = [...message.matchAll(/\['([^']+)'\]/g)].map((m) => m[1]);
  const field = path.length ? path[path.length - 1] : undefined;

  let m: RegExpMatchArray | null;
  if ((m = message.match(/length of value must be at most (\d+)/))) {
    return { field, rule: "too_long", param: m[1] };
  }
  if ((m = message.match(/length of value must be at least (\d+)/))) {
    return { field, rule: "too_short", param: m[1] };
  }
  if ((m = message.match(/value must be at most (\S+)/))) {
    return { field, rule: "value_too_high", param: m[1] };
  }
  if ((m = message.match(/value must be at least (\S+)/))) {
    return { field, rule: "value_too_low", param: m[1] };
  }
  if (/required key not provided/.test(message)) {
    return { field, rule: "required" };
  }
  if ((m = message.match(/expected (\w+)/))) {
    return { field, rule: "wrong_type", param: m[1] };
  }
  if (/value must be one of/.test(message)) {
    return { field, rule: "invalid_choice" };
  }
  if (/not a valid value/.test(message)) {
    return { field, rule: "invalid_value" };
  }
  return { field, rule: "unknown" };
}

const _words = (s: string): string[] => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1);

/**
 * True when the server message merely restates its code ("Not found" for
 * `not_found`): every word of the message is already a word of the code,
 * so echoing it after the translated headline would add nothing.
 */
function _restatesCode(message: string, code: string): boolean {
  const codeWords = new Set(_words(code));
  return _words(message).every((w) => codeWords.has(w));
}

/**
 * Convert a thrown WS-promise rejection into a localized one-line string.
 * Pass the lang code (e.g. `this._lang`) and optionally a fallback for
 * non-WS errors (defaults to the localized generic "action failed").
 *
 * Resolution order: a voluptuous validation message that parses to a
 * field rule wins (it names the input); otherwise a known error code gives
 * the translated headline, followed by the server's message in parentheses
 * when that message says more than the code itself; otherwise the raw
 * message; otherwise the fallback.
 */
export function describeWsError(e: unknown, lang: string, fallback?: string): string {
  fallback = fallback ?? t("action_error", lang);
  if (typeof e === "string") return e;
  if (typeof e !== "object" || e === null) return fallback;

  const err = e as { message?: string; error?: { message?: string; code?: string }; code?: string };
  const raw = err.message || err.error?.message || "";
  const code = err.code || err.error?.code || "";
  const codeKey = code ? WS_ERROR_CODE_KEYS[code] : undefined;
  if (!raw && !codeKey) return fallback;

  const parsed = _parse(raw);
  const field = parsed.field ? _label(parsed.field, lang) : "";

  const tpl = (key: string) => t(key, lang).replace("{field}", field).replace("{n}", parsed.param ?? "");

  switch (parsed.rule) {
    case "too_long":
      return tpl("err_too_long");
    case "too_short":
      return tpl("err_too_short");
    case "value_too_high":
      return tpl("err_value_too_high");
    case "value_too_low":
      return tpl("err_value_too_low");
    case "required":
      return tpl("err_required");
    case "wrong_type":
      return tpl("err_wrong_type").replace("{type}", parsed.param ?? "");
    case "invalid_choice":
      return tpl("err_invalid_choice");
    case "invalid_value":
      return tpl("err_invalid_value");
    default:
      if (codeKey) {
        const headline = t(codeKey, lang);
        return raw && !_restatesCode(raw, code) ? `${headline} (${raw})` : headline;
      }
      // Unknown shape — show the raw message so debugging is possible
      return raw || fallback;
  }
}
