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
import { NO_DELEGATION, type WriteAccess } from "./permissions";
import { SETTING_INT_RANGES } from "./setting-ranges";

export interface SettingsCache {
  features: {
    adaptive: boolean; predictions: boolean; seasonal: boolean;
    environmental: boolean; budget: boolean; groups: boolean;
    checklists: boolean; schedule_time: boolean; completion_actions: boolean;
  };
  defaultWarningDays: number;
  /** #145: global "Task row actions" style (buttons_compact | buttons | icons). */
  rowActionStyle: string;
  /** Operator-write delegation (helpers/permissions.canWrite) — the
   *  Lovelace dialogs and section cards gate Edit/Delete on it like the
   *  panel does, instead of on `is_admin` alone (DRY audit 2026-09-26). */
  access: WriteAccess;
  /** Currency display for amounts outside the panel (quick-actions stats,
   *  the complete dialog's cost suggestion). */
  budget: { currency_symbol?: string; currency_decimals?: number } | null;
  /** #145: the one-time "row actions changed" banner is still due. */
  rowActionNoticePending: boolean;
  /** #170: reference numbers shown in the lists. */
  refsInLists: boolean;
  /** The objects table's column choice as stored — the panel runs it through
   *  object-columns sanitizeColumns (kept out of here: the cards' bundles
   *  have no use for the column catalog). */
  objectsTableColumns: string[] | undefined;
}

/** The row-action styles the settings view offers (#145). */
export const ROW_ACTION_STYLES = ["buttons_compact", "buttons", "icons"] as const;

/** THE parser of the `maintenance_supporter/settings` answer for every
 *  surface that reads it — the panel as much as the Lovelace dialogs and
 *  cards. The panel used to parse the same fields itself, with its own rules
 *  (the warning days range-checked, the row style normalised) the cache did
 *  not apply (DRY audit 2026-09-26). The settings view is the one exception:
 *  it EDITS the raw answer, so it keeps it verbatim. */
export function parseSettings(r: SettingsWire | null | undefined): SettingsCache {
  const [dwdMin, dwdMax] = SETTING_INT_RANGES.default_warning_days;
  const dwd = r?.general?.default_warning_days;
  const ras = r?.general?.row_action_style;
  return {
    features: { ...FALLBACK_SETTINGS.features, ...(r?.features ?? {}) },
    defaultWarningDays:
      typeof dwd === "number" && Number.isFinite(dwd) && dwd >= dwdMin && dwd <= dwdMax
        ? dwd
        : FALLBACK_SETTINGS.defaultWarningDays,
    rowActionStyle: (ROW_ACTION_STYLES as readonly string[]).includes(ras ?? "")
      ? (ras as string)
      : FALLBACK_SETTINGS.rowActionStyle,
    access: {
      operatorWriteEnabled: r?.operator_write_enabled === true,
      operatorIds: Array.isArray(r?.admin_panel_user_ids) ? r!.admin_panel_user_ids!.filter((x) => typeof x === "string") : [],
    },
    budget: r?.budget ?? null,
    rowActionNoticePending: r?.general?.row_action_notice_pending === true,
    refsInLists: r?.general?.ref_numbers_in_lists === true,
    objectsTableColumns: Array.isArray(r?.objects_table_columns) ? r!.objects_table_columns : undefined,
  };
}

export interface SettingsWire {
  features?: Partial<SettingsCache["features"]>;
  general?: {
    default_warning_days?: number;
    row_action_style?: string;
    row_action_notice_pending?: boolean;
    ref_numbers_in_lists?: boolean;
  };
  operator_write_enabled?: boolean;
  admin_panel_user_ids?: string[];
  budget?: { currency_symbol?: string; currency_decimals?: number };
  objects_table_columns?: string[];
}

export const FALLBACK_SETTINGS: SettingsCache = {
  features: {
    adaptive: false, predictions: false, seasonal: false,
    environmental: false, budget: false, groups: false,
    checklists: false, schedule_time: false, completion_actions: false,
  },
  defaultWarningDays: 7,
  rowActionStyle: "buttons_compact",
  access: NO_DELEGATION,
  budget: null,
  rowActionNoticePending: false,
  refsInLists: false,
  objectsTableColumns: undefined,
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
    .sendMessagePromise<SettingsWire>({ type: "maintenance_supporter/settings" })
    .then((r) => parseSettings(r))
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
