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
import { setBetaUi, setBetaUiDefault } from "./beta-ui";
import { NO_DELEGATION, type WriteAccess } from "./permissions";
import { SETTING_INT_RANGES } from "./setting-ranges";
import { partsCostModeOf, type PartsCostMode } from "./parts-cost";

export interface SettingsCache {
  features: {
    adaptive: boolean; seasonal: boolean;
    environmental: boolean; budget: boolean; groups: boolean;
    checklists: boolean; schedule_time: boolean; completion_actions: boolean; places: boolean;
    beta_editor: boolean;
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
  /** #104: spare parts count when bought ("purchase") or when used ("use") —
   *  decides what the complete dialog says about a completion's parts. */
  partsCostMode: PartsCostMode;
  /** #231: the to-do lists every task without its own is mirrored into. */
  mirrorTodoDefault: string[];
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
  const features = { ...FALLBACK_SETTINGS.features, ...(r?.features ?? {}) };
  return {
    features,
    defaultWarningDays:
      typeof dwd === "number" && Number.isFinite(dwd) && dwd >= dwdMin && dwd <= dwdMax
        ? dwd
        : FALLBACK_SETTINGS.defaultWarningDays,
    rowActionStyle: effectiveRowActionStyle(r?.general?.row_action_style, r?.general?.row_action_style_set, features.beta_editor),
    access: {
      operatorWriteEnabled: r?.operator_write_enabled === true,
      operatorIds: Array.isArray(r?.admin_panel_user_ids) ? r!.admin_panel_user_ids!.filter((x) => typeof x === "string") : [],
    },
    budget: r?.budget ?? null,
    rowActionNoticePending: r?.general?.row_action_notice_pending === true,
    refsInLists: r?.general?.ref_numbers_in_lists === true,
    objectsTableColumns: Array.isArray(r?.objects_table_columns) ? r!.objects_table_columns : undefined,
    partsCostMode: partsCostModeOf(r?.budget?.parts_cost_mode),
    mirrorTodoDefault: Array.isArray(r?.general?.mirror_todo_default_entities)
      ? r!.general!.mirror_todo_default_entities!.filter((x) => typeof x === "string" && x !== "")
      : [],
  };
}

/** How task rows show Complete / Skip: the household's choice; while nobody
 *  has chosen, icons with the beta UI (Home Assistant's tables carry icons,
 *  not labelled buttons — user decision 2026-11-01), else the default. An
 *  older server that does not say whether it was chosen counts as chosen. */
export function effectiveRowActionStyle(style: string | undefined, chosen: boolean | undefined, beta: boolean): string {
  if (chosen === false && beta) return "icons";
  return (ROW_ACTION_STYLES as readonly string[]).includes(style ?? "") ? (style as string) : FALLBACK_SETTINGS.rowActionStyle;
}

export interface SettingsWire {
  features?: Partial<SettingsCache["features"]>;
  general?: {
    default_warning_days?: number;
    row_action_style?: string;
    row_action_style_set?: boolean;
    row_action_notice_pending?: boolean;
    ref_numbers_in_lists?: boolean;
    mirror_todo_default_entities?: string[];
  };
  operator_write_enabled?: boolean;
  admin_panel_user_ids?: string[];
  budget?: { currency_symbol?: string; currency_decimals?: number; parts_cost_mode?: string };
  objects_table_columns?: string[];
}

export const FALLBACK_SETTINGS: SettingsCache = {
  // The server's defaults (tests/test_frontend_const_parity.py): the new
  // look is on unless switched off, and a failed read showed the classic
  // one (DRY audit 2026-11-07, X7-A3).
  features: {
    adaptive: false, seasonal: false,
    environmental: false, budget: false, groups: false,
    checklists: false, schedule_time: false, completion_actions: false, places: false, beta_editor: true,
  },
  defaultWarningDays: 7,
  rowActionStyle: "buttons_compact",
  access: NO_DELEGATION,
  budget: null,
  rowActionNoticePending: false,
  refsInLists: false,
  objectsTableColumns: undefined,
  partsCostMode: "purchase",
  mirrorTodoDefault: [],
};

/** What a surface works with when the settings could not be read: the
 *  server's defaults, so the new look, with the row actions it shows while
 *  nobody chose a style. The failed read set neither, and kept labelled
 *  buttons (bug audit 2026-11-08, C8-3). */
export const UNREAD_SETTINGS: SettingsCache = {
  ...FALLBACK_SETTINGS,
  rowActionStyle: effectiveRowActionStyle(undefined, false, FALLBACK_SETTINGS.features.beta_editor),
};

interface CacheSlot {
  promise: Promise<SettingsCache> | null;
}

function slot(): CacheSlot {
  const w = window as unknown as { __msSettingsCache?: CacheSlot };
  return (w.__msSettingsCache ??= { promise: null });
}

/** `lite`: without what only the Settings page shows (the notify targets,
 *  the Battery Notes hint, the battery lifetime table), each a scan of the
 *  whole home the server ran for every card on every dashboard (perf
 *  2026-11-06); `parseSettings` reads none of it. A server from before
 *  `lite` (updated, not yet restarted) is asked the old way. */
export function fetchSettingsOnce(hass: HomeAssistant): Promise<SettingsCache> {
  const s = slot();
  if (s.promise) return s.promise;
  const ask = (msg: Record<string, unknown>) => hass.connection.sendMessagePromise<SettingsWire>(msg);
  const p: Promise<SettingsCache> = ask({ type: "maintenance_supporter/settings", lite: true })
    .catch((err: unknown) => {
      // The old server rejects the unknown key; anything else is a failure.
      if ((err as { code?: string } | null)?.code === "invalid_format") return ask({ type: "maintenance_supporter/settings" });
      throw err;
    })
    .then((r) => {
      const parsed = parseSettings(r);
      // Cards and the dialogs mounted on dashboards read the beta UI here.
      setBetaUi(parsed.features.beta_editor);
      return parsed;
    })
    .catch(() => {
      // Only drop OUR promise — an invalidate + refetch may have replaced it.
      if (s.promise === p) s.promise = null;
      // A read that worked (the panel's, another card's) keeps its look.
      setBetaUiDefault(UNREAD_SETTINGS.features.beta_editor);
      return UNREAD_SETTINGS;
    });
  s.promise = p;
  return p;
}

/** Call after a successful `global/update` (any bundle): the next reader
 *  fetches the new settings instead of the page's first answer. */
export function invalidateSettingsCache(): void {
  slot().promise = null;
}
