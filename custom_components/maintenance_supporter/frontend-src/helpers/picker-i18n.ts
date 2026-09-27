/**
 * Names and descriptions of our entries in Home Assistant's card, dashboard
 * and section pickers (the registered cards and `window.customStrategies`) in
 * the user's language (i18n audit 2026-09-27: they were English only).
 *
 * The entries are registered in English at module load, before hass exists;
 * the picker reads them when it opens, so rewriting them in place once the
 * language is known is enough. Lit-free on purpose (the strategy shim is
 * tiny). Idempotent: every bundle may call it.
 */

import { ensureLocale, t } from "./locale-core";
import { registeredCustomCards } from "./register-card";

interface PickerEntry {
  type: string;
  name: string;
  description?: string;
}

/** entry type → [name key | null (product name stays), description key] */
const PICKER_KEYS: Record<string, [string | null, string]> = {
  "maintenance-supporter-card": [null, "picker_desc_card"],
  "maintenance-supporter-calendar-card": ["picker_name_calendar", "picker_desc_calendar"],
  "maintenance-supporter-panel-card": ["picker_name_panel", "picker_desc_panel"],
  "maintenance-budget-section-card": ["picker_name_budget", "picker_desc_budget"],
  "maintenance-groups-section-card": ["picker_name_groups", "picker_desc_groups"],
  "maintenance-vacation-section-card": ["picker_name_vacation", "picker_desc_vacation"],
  "maintenance-battery-fleet-card": ["picker_name_battery_fleet", "picker_desc_battery_fleet"],
  // strategies (dashboard + sections)
  "maintenance-supporter": [null, "picker_desc_dashboard"],
  "maintenance-supporter-section": ["picker_name_section", "picker_desc_section"],
  "maintenance-supporter-vacation": ["picker_name_vacation_status", "picker_desc_vacation_status"],
  "maintenance-supporter-budget": ["picker_name_budget_status", "picker_desc_budget_status"],
  "maintenance-supporter-groups": ["picker_name_groups", "picker_desc_groups_status"],
};

/** The English originals, kept per entry so switching the language back
 *  (or a key missing in a stale locale file) never loses the text. */
const ORIGINAL = new WeakMap<PickerEntry, { name: string; description?: string }>();

export function localizePickerEntries(lang: string): void {
  const w = window as unknown as { customStrategies?: PickerEntry[] };
  for (const entry of [...(registeredCustomCards() as PickerEntry[]), ...(w.customStrategies ?? [])]) {
    const keys = PICKER_KEYS[entry.type];
    if (!keys) continue;
    if (!ORIGINAL.has(entry)) ORIGINAL.set(entry, { name: entry.name, description: entry.description });
    const original = ORIGINAL.get(entry)!;
    const [nameKey, descKey] = keys;
    if (nameKey) entry.name = t(nameKey, lang, original.name);
    entry.description = t(descKey, lang, original.description);
  }
}

/** Wait for Home Assistant's own hass object, load its language, localize. */
export function localizePickerWhenReady(): void {
  let tries = 0;
  const attempt = (): void => {
    const hass = (document.querySelector("home-assistant") as unknown as { hass?: { language?: string } } | null)?.hass;
    if (hass?.language) {
      const lang = hass.language;
      void ensureLocale(lang).then(() => localizePickerEntries(lang));
      return;
    }
    if (++tries < 60) setTimeout(attempt, 1000);
  };
  attempt();
}
