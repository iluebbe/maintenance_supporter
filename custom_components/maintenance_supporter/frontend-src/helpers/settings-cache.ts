/**
 * The household settings that surfaces OUTSIDE the panel read once per page:
 * the dialogs mounted from Lovelace (feature-gated sections, default warning
 * days) and the cards' row-action style (#145).
 *
 * The cache lives on `window.__msSettingsCache`, not in module scope: the
 * panel, the card, the calendar card and the strategy are separate bundles,
 * each with its own copy of this module. A module-scope promise would give
 * every bundle its own fetch AND leave the card on the old style after the
 * admin changed it in the panel (the HA frontend is one long-lived page).
 * Whoever writes `global/update` calls `invalidateSettingsCache()`; the
 * next reader fetches fresh.
 *
 * A failed fetch is NOT cached (bug review 2026-09-04): the fallback is
 * returned once, and the next call asks again — otherwise a WS hiccup while
 * the dashboard loaded pinned the defaults for the whole page session.
 */

import type { HomeAssistant } from "../types";

export interface SettingsCache {
  features: {
    adaptive: boolean; predictions: boolean; seasonal: boolean;
    environmental: boolean; budget: boolean; groups: boolean;
    checklists: boolean; schedule_time: boolean; completion_actions: boolean;
  };
  defaultWarningDays: number;
  /** #145: global "Task row actions" style (buttons_compact | buttons | icons). */
  rowActionStyle: string;
}

export const FALLBACK_SETTINGS: SettingsCache = {
  features: {
    adaptive: false, predictions: false, seasonal: false,
    environmental: false, budget: false, groups: false,
    checklists: false, schedule_time: false, completion_actions: false,
  },
  defaultWarningDays: 7,
  rowActionStyle: "buttons_compact",
};

interface CacheSlot {
  promise: Promise<SettingsCache> | null;
}

function slot(): CacheSlot {
  const w = window as unknown as { __msSettingsCache?: CacheSlot };
  return (w.__msSettingsCache ??= { promise: null });
}

export function fetchSettingsOnce(hass: HomeAssistant): Promise<SettingsCache> {
  const s = slot();
  if (s.promise) return s.promise;
  const p: Promise<SettingsCache> = hass.connection
    .sendMessagePromise<{
      features?: SettingsCache["features"];
      general?: { default_warning_days?: number; row_action_style?: string };
    }>({ type: "maintenance_supporter/settings" })
    .then((r) => ({
      features: r.features ?? FALLBACK_SETTINGS.features,
      defaultWarningDays: r.general?.default_warning_days ?? 7,
      rowActionStyle: r.general?.row_action_style ?? FALLBACK_SETTINGS.rowActionStyle,
    }))
    .catch(() => {
      // Only drop OUR promise — an invalidate + refetch may have replaced it.
      if (s.promise === p) s.promise = null;
      return FALLBACK_SETTINGS;
    });
  s.promise = p;
  return p;
}

/** Call after a successful `global/update` (any bundle): the next reader
 *  fetches the new settings instead of the page's first answer. */
export function invalidateSettingsCache(): void {
  slot().promise = null;
}
