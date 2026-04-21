/**
 * Translate raw voluptuous / Home-Assistant WS error messages into a
 * localized, human-readable sentence.
 *
 * The HA WS layer wraps voluptuous errors in
 *   { code: "invalid_format", message: "<voluptuous text>" }
 * The voluptuous text is consistently shaped — we parse the common
 * patterns and emit a localized template string. Falls back to the raw
 * message when nothing matches, so the user never sees a silent failure.
 */
import { t } from "./styles";

/**
 * Map of internal field keys (as they appear in voluptuous error paths)
 * to existing i18n label keys. When a field has no entry here, we surface
 * the raw key as-is so the user can still tell which input was rejected.
 */
const FIELD_LABEL_KEYS: Record<string, string> = {
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
  checklist: "checklist_steps_optional",
  reason: "reason",
  feedback: "feedback",
  cost: "cost",
  duration: "duration",
  description: "description_optional",
  group_name: "name",
  group_description: "description_optional",
  environmental_entity: "environmental_entity_optional",
  environmental_attribute: "environmental_attribute_optional",
  trigger_above: "trigger_above",
  trigger_below: "trigger_below",
  trigger_for_minutes: "trigger_for_minutes",
};

function _label(field: string, lang: string): string {
  const key = FIELD_LABEL_KEYS[field];
  if (!key) return field;
  // t() returns the key itself when missing — we'd rather show the raw
  // field name in that case than the i18n key with underscores.
  const translated = t(key, lang);
  return translated && translated !== key ? translated : field;
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
  const fieldMatch = message.match(/data\['([^']+)'\]/);
  const field = fieldMatch?.[1];

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

/**
 * Convert a thrown WS-promise rejection into a localized one-line string.
 * Pass the lang code (e.g. `this._lang`) and a fallback for non-WS errors.
 */
export function describeWsError(e: unknown, lang: string, fallback: string): string {
  if (typeof e === "string") return e;
  if (typeof e !== "object" || e === null) return fallback;

  const err = e as { message?: string; error?: { message?: string }; code?: string };
  const raw = err.message || err.error?.message || "";
  if (!raw) return fallback;

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
      // Unknown shape — show the raw message so debugging is possible
      return raw || fallback;
  }
}
