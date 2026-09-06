/** Shared CSS styles and i18n for the Maintenance Supporter frontend. */

import { css } from "lit";
import EN from "./locales/en.json";
import { BUNDLE_VERSION } from "./helpers/bundle-version";

// Display fallback when the backend hasn't sent a currency symbol. The backend
// derives the real symbol from const.BUDGET_CURRENCIES[DEFAULT_BUDGET_CURRENCY].
export const DEFAULT_CURRENCY_SYMBOL = "€";

// Moved to the dependency-free status-constants.ts so the dashboard strategy
// bundle can share them without pulling Lit in; re-exported here so every
// existing `from "./styles"` import keeps working.
export { STATUS_COLORS, STATUS_ICONS } from "./status-constants";

/* ─── i18n ─── */

interface Translations {
  [key: string]: string;
}

// English is bundled (imported above) as the always-available fallback so
// the panel renders instantly with a complete table — never an
// untranslated-key flash, even if a locale fetch fails. The other 17
// languages live in served JSON (frontend/locales/<lang>.json) and are
// fetched on demand by ensureLocale(), so a translation edit needs no bundle
// rebuild — the fix for the recurring "stale bundle ships English to non-EN
// users" pitfall. Steady-state t() is the same sync lookup as before.
const DEFAULT_LANG = "en";

// The locale store MUST be shared across bundle copies of this module.
// maintenance-card.js is loaded globally (extra_module_url) and defines the
// dialog custom elements first-wins — so a <maintenance-task-dialog> inside
// the panel runs the CARD bundle's copy of this module. With a module-scoped
// store, the panel's ensureLocale() fills only the PANEL copy and the dialog
// stays English while the rest of the panel is localized (v2.17.0 regression,
// invisible before the runtime-locale split because every bundle inlined all
// languages). One window-scoped store + inflight map keeps every copy reading
// and writing the same tables.
interface LocaleGlobals {
  store: Record<string, Translations>;
  inflight: Record<string, Promise<void>>;
}
const _localeGlobals: LocaleGlobals = (() => {
  const w = window as unknown as { __msLocales?: LocaleGlobals };
  if (!w.__msLocales) w.__msLocales = { store: {}, inflight: {} };
  return w.__msLocales;
})();

const STORE = _localeGlobals.store;

/** Seed/extend the shared English table with this bundle's copy.
 *
 * MERGE, not first-wins (#135 regression): after an update, a cached app
 * shell can still list an OLD sibling bundle (the card) next to the fresh
 * panel. First-wins let the stale bundle's EN — missing every new key —
 * claim the store, and the fresh panel rendered raw keys
 * ("BATTERY_FLEET_ADD"). Existing entries win conflicts (steady state is
 * unchanged); every bundle contributes the keys it knows, so a newer
 * bundle's keys can never be shadowed by an older first-loader.
 */
export function seedEnglish(en: Record<string, string>): void {
  STORE.en = Object.assign({}, en, STORE.en ?? {});
}
seedEnglish(EN as Translations);

/** Languages available as runtime-loaded JSON. Keep in sync with locales/. */
const SUPPORTED_LANGS = new Set<string>([
  "de", "nl", "fr", "it", "es", "pt", "pt-br", "ru", "uk", "pl", "cs", "sv", "zh",
  "da", "fi", "nb", "ja", "hi", "hu", "ko", "tr",
]);

/** Served base for the runtime locale files (mirrors LOCALES_URL in const.py). */
const LOCALES_BASE = "/maintenance_supporter_locales";

const _localeInflight = _localeGlobals.inflight;

/** Normalize an HA language code to our table key.
 *
 * Brazilian Portuguese is the one regional variant with its OWN table
 * ("pt-br") — it must not collapse into European "pt". Mirrors
 * normalize_language_code in helpers/i18n.py.
 */
function normLang(lang?: string): string {
  const l = (lang || DEFAULT_LANG).toLowerCase();
  if (l.startsWith("pt") && l.endsWith("br")) return "pt-br";
  return l.substring(0, 2);
}

/** Get a localized string. Falls back to English, then to the key itself. */
export function t(key: string, lang?: string): string {
  const l = normLang(lang);
  return STORE[l]?.[key] ?? STORE.en[key] ?? key;
}

/** The per-`updated()` locale boot every top-level surface needs: date/time
 * prefs follow the HA profile (#97), and the user's UI language is lazily
 * fetched with a re-render once it arrives (EN is bundled, so strings read
 * in English until then rather than as raw keys). Was copy-pasted across the
 * panel and both cards (drift audit 2026-08). */
export function syncLocaleFromHass(
  host: {
    hass?: { language?: string; locale?: unknown; config?: { country?: string | null } };
    requestUpdate: () => void;
  },
  changedProps: Map<string, unknown>,
): void {
  if (changedProps.has("hass")) {
    setProfilePrefs(host.hass?.locale as Parameters<typeof setProfilePrefs>[0], host.hass?.config?.country);
  }
  const lang = host.hass?.language;
  if (lang && !isLocaleLoaded(lang)) {
    ensureLocale(lang).then(() => host.requestUpdate());
  }
}

/**
 * The UI language for a hass object — the ONE rule every component's `_lang`
 * getter delegates to. Before this helper the 23 hand-copied getters had
 * drifted into three variants (`|| "en"`, `?? navigator.language...`, and a
 * `locale.language` probe), so sibling components could resolve different
 * languages from the same hass.
 */
export function langOf(hass?: { language?: string }): string {
  return hass?.language || "en";
}

/** True when *lang*'s table is in memory (English is always bundled). */
export function isLocaleLoaded(lang?: string): boolean {
  const l = normLang(lang);
  return l === DEFAULT_LANG || l in STORE;
}

/**
 * Fetch *lang*'s table once and cache it. Resolves immediately for English,
 * an already-loaded language, or an unsupported one (which keeps the English
 * fallback). Never rejects: a failed fetch silently leaves English in place,
 * matching t()'s fall-through. Callers re-render on resolution.
 */
export function ensureLocale(lang?: string): Promise<void> {
  const l = normLang(lang);
  if (l === DEFAULT_LANG || l in STORE || !SUPPORTED_LANGS.has(l)) {
    return Promise.resolve();
  }
  if (!(l in _localeInflight)) {
    // Version-busted (#135, same family as #124): the locale files are served
    // without Cache-Control, so browsers cache them heuristically — after an
    // update a stale table would miss every new key and silently fall back to
    // English for them. "dev" builds keep a stable URL.
    _localeInflight[l] = fetch(`${LOCALES_BASE}/${l}.json?v=${BUNDLE_VERSION}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          STORE[l] = data as Translations;
        } else {
          // Don't make one failed fetch sticky for the whole page session —
          // the next ensureLocale() call retries.
          delete _localeInflight[l];
        }
      })
      .catch(() => {
        delete _localeInflight[l];
      });
  }
  return _localeInflight[l];
}

/**
 * Synchronously seed a locale table, bypassing the fetch. For tests and for
 * callers that already hold a table (preload/SSR); the loader and t() share the
 * same STORE, so a seeded language reads immediately.
 */
export function setLocale(lang: string, table: Translations): void {
  STORE[normLang(lang)] = table;
}

/** Map language table key to BCP-47 locale for date formatting. */
function langToLocale(lang?: string): string {
  const l = normLang(lang);
  const map: Record<string, string> = {
    de: "de-DE", en: "en-US", nl: "nl-NL", fr: "fr-FR", it: "it-IT", es: "es-ES", pt: "pt-PT", ru: "ru-RU", uk: "uk-UA", zh: "zh-CN",
    da: "da-DK", fi: "fi-FI", nb: "nb-NO", ja: "ja-JP", hi: "hi-IN",
    // pl/cs/sv were missing and silently fell back to en-US — Polish users
    // saw MM/DD dates (caught by the live multi-language check, 2026-07-19).
    pl: "pl-PL", cs: "cs-CZ", sv: "sv-SE",
    "pt-br": "pt-BR", hu: "hu-HU", ko: "ko-KR", tr: "tr-TR",
  };
  return map[l] ?? "en-US";
}

/** HA per-user format prefs (issue #97, #163).
 *
 * hass.locale.date_format ("language"|"system"|"DMY"|"MDY"|"YMD"),
 * time_format ("language"|"system"|"12"|"24") and number_format ("language"|
 * "system"|"comma_decimal"|"decimal_comma"|"space_comma"|"none") are frontend
 * PROFILE settings — deriving the format from the UI language alone showed
 * en users mm/dd/yyyy even with dd/mm/yyyy configured. Stored on a window
 * singleton because each bundle (panel / cards / dialog-mount) gets its own
 * module scope; every surface calls setProfilePrefs() on hass updates and
 * whichever runs first wins for all of them. (The window key keeps its
 * original name so a stale cached bundle still shares the object.)
 */
interface ProfilePrefs {
  date?: string;
  time?: string;
  number?: string;
  country?: string;
}
const _w = window as unknown as { __msDateTimePrefs?: ProfilePrefs };
const DT_PREFS: ProfilePrefs = (_w.__msDateTimePrefs ??= {});

/** Feed HA's per-user date/time/number formats into the formatters below.
 *  `country` is the SERVER's configured country (#140): with the profile
 *  date format left on "language" it regionalizes the language default —
 *  "en" + AU renders DD/MM/YYYY instead of the hard en-US mapping. */
export function setProfilePrefs(
  locale?: { date_format?: string; time_format?: string; number_format?: string },
  country?: string | null,
): void {
  if (!locale) return;
  DT_PREFS.date = locale.date_format;
  DT_PREFS.time = locale.time_format;
  DT_PREFS.number = locale.number_format;
  if (country !== undefined) DT_PREFS.country = country || undefined;
}

/** Locale for the profile number format — mirrors HA's own
 *  numberFormatToLocale so our figures match the entity cards next to them:
 *  the three explicit styles pin a representative locale, "system" is the
 *  browser, and the "language" default is the UI language WITHOUT the
 *  server-country regionalization dates get (#140) — HA formats "de" as
 *  1.234,56 whatever the country. */
function numberLocale(lang?: string): string | string[] | undefined {
  switch (DT_PREFS.number) {
    case "comma_decimal": return ["en-US", "en"];
    case "decimal_comma": return ["de", "es", "it"];
    case "space_comma": return ["fr", "sv", "cs"];
    case "system": return undefined;
    default: return langToLocale(lang);
  }
}

/** Format a number for display honouring the HA profile number format.
 *  `digits` pins the fraction digits (a number = exactly that many, like
 *  toFixed) or passes raw Intl options; the default is at most 2, no trailing
 *  zeros. "none" mirrors HA: plain digits, no grouping, trailing zeros
 *  dropped. Every human-facing number in the UI goes through here — SVG
 *  coordinates use chart-utils px() instead, which must stay locale-free. */
export function formatNumber(n: number, lang?: string, digits?: number | Intl.NumberFormatOptions): string {
  if (!Number.isFinite(n)) return String(n);
  const opts: Intl.NumberFormatOptions =
    typeof digits === "number"
      ? { minimumFractionDigits: digits, maximumFractionDigits: digits }
      : { maximumFractionDigits: 2, ...digits };
  if (DT_PREFS.number === "none") {
    const f = Math.pow(10, opts.maximumFractionDigits ?? 2);
    return String(Math.round(n * f) / f);
  }
  try {
    return new Intl.NumberFormat(numberLocale(lang), opts).format(n);
  } catch {
    return new Intl.NumberFormat(undefined, opts).format(n);
  }
}

/** Amount + currency symbol ("12.50 €"; the symbol is optional) — every cost
 *  figure in the UI and the printables goes through here. */
export function formatCost(amount: number, symbol?: string, lang?: string, digits = 2): string {
  const num = formatNumber(amount, lang, digits);
  return symbol ? `${num} ${symbol}` : num;
}

/** BCP-47 locale for the "language" default: the UI language regionalized
 *  by the server country when Intl knows the combination (#140). Explicit
 *  profile formats (DMY/MDY/YMD/system) never reach this path. */
function resolveLocale(lang?: string): string {
  const base = langToLocale(lang);
  const country = DT_PREFS.country;
  if (country && /^[A-Za-z]{2}$/.test(country)) {
    const candidate = `${normLang(lang).split("-")[0]}-${country.toUpperCase()}`;
    try {
      new Intl.DateTimeFormat(candidate);
      return candidate;
    } catch {
      // syntactically invalid tag — keep the language mapping
    }
  }
  return base;
}

function _formatDateObj(d: Date, lang?: string): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  switch (DT_PREFS.date) {
    case "DMY": return `${dd}/${mm}/${yyyy}`;
    case "MDY": return `${mm}/${dd}/${yyyy}`;
    case "YMD": return `${yyyy}-${mm}-${dd}`;
    case "system":
      return d.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" });
    default: // "language" or unset — UI language, regionalized by the server country (#140)
      return d.toLocaleDateString(resolveLocale(lang), { day: "2-digit", month: "2-digit", year: "numeric" });
  }
}

/** Time of day honouring the HA profile time format (12/24h). Every
 *  clock-time string in the UI goes through here — chart crosshairs included
 *  (#163: a bare toLocaleDateString({hour, minute}) ignored the profile). */
export function formatTimeOfDay(d: Date, lang?: string): string {
  switch (DT_PREFS.time) {
    case "12": return d.toLocaleTimeString(resolveLocale(lang), { hour: "2-digit", minute: "2-digit", hour12: true });
    case "24": return d.toLocaleTimeString(resolveLocale(lang), { hour: "2-digit", minute: "2-digit", hour12: false });
    case "system": return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    default: return d.toLocaleTimeString(resolveLocale(lang), { hour: "2-digit", minute: "2-digit" });
  }
}

/** Format a date string (ISO) honouring the HA profile date format.
 *  Appends T00:00:00 to date-only strings so JS parses them as local time, not UTC. */
export function formatDate(iso: string | null | undefined, lang?: string): string {
  if (!iso) return "—";
  try {
    const local = iso.includes("T") ? iso : iso + "T00:00:00";
    return _formatDateObj(new Date(local), lang);
  } catch {
    return iso;
  }
}

/** Format a datetime string (ISO) honouring the HA profile date/time formats. */
export function formatDateTime(iso: string | null | undefined, lang?: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return _formatDateObj(d, lang) + " " + formatTimeOfDay(d, lang);
  } catch {
    return iso;
  }
}

/** Format "days until due" in localized manner. */
export function formatDueDays(days: number | null | undefined, lang?: string): string {
  if (days === null || days === undefined) return "—";
  const l = lang || "en";
  if (days < 0) return `${Math.abs(days)} ${t("d_overdue", l)}`;
  if (days === 0) return t("today", l);
  return `${days} ${days === 1 ? t("day", l) : t("days", l)}`;
}

/** Localized interval label, e.g. "3 Months" / "7 Days" (issue #59 — was
 *  hard-coded to days). Uses the unit_* keys from the schedule dialog. */
export function formatInterval(
  intervalDays: number | null | undefined,
  unit?: string | null,
  lang?: string,
): string {
  if (intervalDays === null || intervalDays === undefined) return "—";
  return `${intervalDays} ${t("unit_" + (unit || "days"), lang)}`;
}

/** Localized weekday name (0=Mon … 6=Sun) via Intl — 2024-01-01 is a Monday.
 *  Single source for the dialog selectors AND formatRecurrence (DRY).
 *
 *  Name-only helpers (weekday / month / "Jul 3") follow the UI language like
 *  HA's own formatDateShort does — the profile date_format only orders
 *  NUMERIC dates. They still live here, not in the consumers: styles.ts is
 *  the only module allowed to call Intl for dates and numbers (see
 *  __tests__/profile-format-single-source.test.ts, #163). */
export function weekdayName(i: number, lang?: string, style: "long" | "short" = "long"): string {
  return new Date(Date.UTC(2024, 0, 1 + i)).toLocaleDateString(resolveLocale(lang), { weekday: style, timeZone: "UTC" });
}

/** Localized month name (0=Jan … 11=Dec). */
export function monthName(i: number, lang?: string, style: "long" | "short" = "long"): string {
  return new Date(Date.UTC(2024, i, 1)).toLocaleDateString(resolveLocale(lang), { month: style, timeZone: "UTC" });
}

/** Weekday / month name of a local Date (calendar day rows). */
export function formatWeekday(d: Date, lang?: string, style: "long" | "short" = "long"): string {
  return weekdayName((d.getDay() + 6) % 7, lang, style);
}
export function formatMonth(d: Date, lang?: string, style: "long" | "short" = "long"): string {
  return monthName(d.getMonth(), lang, style);
}

/** Short day+month ("Jul 3" / "3. Juli"), with a 2-digit year when the
 *  caller's range needs disambiguating — chart axis ticks and tooltips. */
export function formatDateShort(d: Date, lang?: string, withYear = false): string {
  return d.toLocaleDateString(
    resolveLocale(lang),
    withYear ? { month: "short", day: "numeric", year: "2-digit" } : { month: "short", day: "numeric" },
  );
}

/** Recurrence shape carried on the WS payload (see types.TaskSchedule). */
interface RecurrenceLike {
  schedule?: {
    kind?: string; every?: number | null; unit?: string;
    weekdays?: number[]; nth?: number; weekday?: number; day?: number;
    business?: boolean; offset?: number;
  } | null;
  interval_days?: number | null;
  interval_unit?: string | null;
  due_date?: string | null;
  schedule_type?: string;
}

/** A task's recurrence as a localized human label, for ANY schedule kind.
 *  The single recurrence formatter (DRY) — interval / weekdays / nth_weekday /
 *  day_of_month / one_time / manual. Used by the panel, card, and quick-actions. */
export function formatRecurrence(task: RecurrenceLike, lang?: string): string {
  const s = task.schedule;
  // (#83) ±N-day shift suffix shared by the calendar kinds.
  const off = s?.offset ? ` ${s.offset > 0 ? "+" : "−"}${Math.abs(s.offset)}d` : "";
  switch (s?.kind) {
    case "weekdays":
      return ((s.weekdays || []).map((d) => weekdayName(d, lang, "short")).join(" & ") || "—") + off;
    case "nth_weekday": {
      if (s.weekday == null || s.nth == null) return "—";
      const ord = s.nth === -1 ? t("ord_last", lang) : t("ord_" + s.nth, lang);
      return `${ord} ${weekdayName(s.weekday, lang, "long")}${off}`;
    }
    case "day_of_month": {
      if (s.day == null) return "—";
      // (#83) -1 = last day of the month; business rolls weekends back to Friday.
      const base = s.day === -1
        ? t(s.business ? "last_business_day_month" : "last_day_month", lang)
        : `${t("day_word", lang)} ${s.day}`;
      return base + off;
    }
    case "one_time":
      return task.due_date ? formatDate(task.due_date, lang) : t("one_time", lang);
    case "manual":
      return t("manual", lang);
    case "interval":
      return formatInterval(s.every, s.unit, lang);
  }
  // legacy / no nested schedule
  if (task.schedule_type === "one_time") return task.due_date ? formatDate(task.due_date, lang) : t("one_time", lang);
  if (task.schedule_type === "manual") return t("manual", lang);
  // Sensor-driven tasks have a trigger, not a calendar/interval — label them as
  // such instead of "—" (regression when the report moved to formatRecurrence).
  if (task.schedule_type === "sensor_based") return t("sensor_based", lang);
  return task.interval_days != null ? formatInterval(task.interval_days, task.interval_unit, lang) : "—";
}

/** Dispatch HA native "More Info" dialog for an entity. */
export function fireMoreInfo(ev: Event, entityId: string) {
  (ev.currentTarget as HTMLElement).dispatchEvent(
    new CustomEvent("hass-more-info", {
      detail: { entityId },
      bubbles: true,
      composed: true,
    })
  );
}

/** Native-input field scaffolding for dialogs rendered in the custom-panel
 * context, where <ha-textfield> is not registered (the documented
 * complete-dialog trap). Shared so the twin copies in confirm-dialog and
 * complete-dialog can't drift — they already had (12px vs 8px margins). */
export const nativeFieldStyles = css`
  .field { display: flex; flex-direction: column; gap: 4px; }
  .field-label { font-size: 12px; color: var(--secondary-text-color); }
  .field-input {
    padding: 8px 10px; font-size: 14px;
    background: var(--secondary-background-color, rgba(0,0,0,0.06));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color); border-radius: 6px;
    font-family: inherit; width: 100%; box-sizing: border-box;
  }
  .field-input:focus { outline: none; border-color: var(--primary-color); }
`;

/** Household member avatar (#169 follow-up): initials in the member's
 *  palette colour. Part of sharedStyles (panel, card, dialogs) and pulled
 *  in on its own by surfaces with their own stylesheet (settings view). */
export const personStyles = css`
  .person-chip { display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 100%; vertical-align: middle; }
  .person-avatar {
    width: 22px; height: 22px; border-radius: 50%; flex: none;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--person-color, #546e7a); color: #fff;
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.02em; line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .person-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
`;

export const sharedStyles = css`
  ${personStyles}
  :host {
    --maint-ok-color: var(--success-color, #4caf50);
    --maint-due-soon-color: var(--warning-color, #ff9800);
    --maint-overdue-color: var(--error-color, #f44336);
    /* Theme-token first so it follows dark/custom themes (was a bare #ff5722,
       inconsistent with STATUS_COLORS.triggered which already tokenised it). */
    --maint-triggered-color: var(--deep-orange-color, #ff5722);
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: white;
    white-space: nowrap;
    /* Fixed minimum so OK / Due Soon / Overdue / Triggered pills are uniform
       width in the task table — keeps the object-name column aligned. */
    min-width: 70px;
    box-sizing: border-box;
  }
  /* Shape icon so status is not conveyed by colour alone (accessibility). */
  .status-badge ha-icon { --mdc-icon-size: 14px; margin-left: -1px; }

  /* Light-background statuses (green/orange/grey) carry DARK text: white on
     them fails even the 3:1 WCAG UI-contrast floor (2.2–2.8:1), while the
     saturated statuses below keep white (≥3.1:1). Matches the calendar pills. */
  .status-badge.ok { background-color: var(--maint-ok-color); color: #000; }
  .status-badge.due_soon { background-color: var(--maint-due-soon-color); color: #000; }
  .status-badge.overdue { background-color: var(--maint-overdue-color); }
  .status-badge.triggered { background-color: var(--maint-triggered-color); }
  /* Completed one-time task ("done") — muted blue-grey. */
  .status-badge.done { background-color: var(--maint-done-color, #78909c); }
  /* v2.10.0: archived (retire-but-retain) — neutral grey, clearly inert. */
  .status-badge.archived { background-color: var(--disabled-color, #9e9e9e); color: #000; }
  /* v2.20 (N3): paused — frozen but present, info blue. */
  .status-badge.paused { background-color: var(--info-color, #2196f3); }

  /* v1.4.7: 5-column grid so all 5 KPIs (Objects/Tasks/Overdue/Due Soon/
     Triggered) always stay in one row. The previous flex-wrap layout was
     wrapping the 5th item (Triggered, the widest label) onto its own row
     on narrow viewports because the natural width of the items pushed past
     the container width. Grid forces equal 1/5 distribution regardless of
     label length. */
  .stats-bar {
    display: grid;
    /* auto-fit instead of a fixed 5: with the budget feature on, two KPI
       tiles join the strip (#125) — and on narrow screens the tiles wrap
       instead of crushing. */
    grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
    gap: 16px;
    padding: 16px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
  }
  .stat-item .stat-label {
    /* Allow long labels to ellipsis rather than overflow the grid cell. */
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .stat-item.clickable { cursor: pointer; border-radius: 8px; padding: 4px 8px; transition: background 0.15s, box-shadow 0.15s; }
  .stat-item.clickable:hover { background: var(--secondary-background-color); }
  /* v2.1.0 — KPIs that map to a status filter highlight when active so the
     user can see at a glance which filter is on, even after scrolling away. */
  .stat-item.clickable.active {
    background: var(--secondary-background-color);
    box-shadow: inset 0 -3px 0 var(--primary-color);
  }

  .objects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
    padding: 16px 0;
  }
  .object-card {
    padding: 16px;
    background: var(--card-background-color);
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid var(--divider-color);
    transition: transform 0.15s, box-shadow 0.15s;
    /* Large installs (100+ objects): skip rendering off-screen cards. The
       intrinsic size keeps the scrollbar stable while they're skipped. */
    content-visibility: auto;
    contain-intrinsic-size: auto 120px;
  }
  .object-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .object-card-header { display: flex; justify-content: space-between; align-items: center; }
  .object-card-name { font-weight: 500; font-size: 16px; }
  .object-card-count { color: var(--secondary-text-color); font-size: 13px; }
  .object-card-meta { color: var(--secondary-text-color); font-size: 13px; margin-top: 4px; }
  .object-card-empty { color: var(--warning-color); font-size: 13px; margin-top: 8px; font-style: italic; }

  /* Overdue indicator dot on object cards (#35) */
  .object-card { position: relative; }
  .object-card-overdue { border-left: 3px solid var(--error-color); }
  .overdue-dot {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--error-color);
    box-shadow: 0 0 0 2px var(--card-background-color);
  }

  /* Group-by collapsible sections (#35 + #36) */
  .group-section {
    margin: 12px 0;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--card-background-color);
  }
  .group-section[open] { padding-bottom: 8px; }
  .group-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    cursor: pointer;
    font-weight: 500;
    list-style: none;
    user-select: none;
  }
  .group-section-header::-webkit-details-marker { display: none; }
  .group-section-header::before {
    content: "▶";
    font-size: 10px;
    color: var(--secondary-text-color);
    transition: transform 0.15s;
  }
  .group-section[open] .group-section-header::before { transform: rotate(90deg); }
  .group-section-count {
    color: var(--secondary-text-color);
    font-size: 13px;
    font-weight: 400;
  }
  .group-section .objects-grid,
  .group-section .task-table {
    padding: 0 12px;
  }

  .empty-state-centered { text-align: center; padding: 32px 16px; }
  .empty-state-centered ha-button { margin-top: 16px; }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-text-color);
  }

  .stat-label {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
  }

  .card-header h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .action-buttons ha-button {
    --ha-button-font-size: 13px;
  }

  .history-timeline { padding: 0 16px 16px; }

  .history-entry {
    display: flex;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid var(--divider-color);
    /* Long histories: skip painting off-screen entries (flex, not subgrid, so
       safe — subgrid task rows can't use this without breaking alignment). */
    content-visibility: auto;
    contain-intrinsic-size: auto 48px;
  }
  .history-entry:last-child { border-bottom: none; }

  .history-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: white;
  }

  .history-icon.completed { background: var(--maint-ok-color); }
  .history-icon.skipped { background: var(--secondary-text-color); }
  .history-icon.reset { background: var(--info-color, #2196f3); }
  .history-icon.triggered { background: var(--maint-triggered-color); }

  .history-content { flex: 1; min-width: 0; }

  /* v2.2.0 — row holds the type label + the small Edit button */
  .history-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  /* v2.37 — marks completions the system recorded itself (trigger recovered).
     margin-right:auto keeps it left beside the type label while the edit
     button stays pinned right by the row's space-between. */
  .history-auto-badge {
    margin-right: auto;
    font-size: 11px;
    padding: 1px 8px;
    border-radius: 10px;
    background: var(--secondary-background-color);
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  /* #139 — names the cycle phase a completion recorded. Shares the auto-badge
     look; carries the left-pinning margin itself unless the auto badge (which
     already has it) follows. */
  .history-phase-badge {
    margin-right: auto;
    font-size: 11px;
    padding: 1px 8px;
    border-radius: 10px;
    background: var(--secondary-background-color);
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .history-phase-badge:has(+ .history-auto-badge) {
    margin-right: 0;
  }
  /* #161 — a completion can carry several photos; thumbnails wrap. */
  .history-photos {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  /* #161 phase 2 — named readings of a completion: a compact
     name / value grid, wrapping into columns on wide screens. */
  .history-readings {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 280px));
    gap: 2px 24px;
    margin: 4px 0;
    font-size: 13px;
  }
  .history-reading {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
  }
  .history-reading-name {
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .history-reading-value {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .history-edit-btn {
    background: transparent;
    color: var(--secondary-text-color);
    border: none;
    border-radius: 4px;
    padding: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    transition: background 0.15s, color 0.15s;
  }
  .history-edit-btn:hover {
    background: var(--secondary-background-color);
    color: var(--primary-color);
  }
  .history-edit-btn ha-icon { --mdc-icon-size: 16px; }

  .history-date {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .history-details {
    display: flex;
    gap: 12px;
    font-size: 13px;
    color: var(--secondary-text-color);
    margin-top: 4px;
  }

  /* History filter chips */
  .history-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .filter-chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    cursor: pointer;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    transition: all 0.2s;
    user-select: none;
  }

  .filter-chip:hover { background: var(--divider-color); }

  .filter-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }

  .filter-chip.clear {
    font-style: italic;
    opacity: 0.7;
  }

  /* Cost/Duration history chart */
  .history-chart {
    width: 100%;
    height: 200px;
    display: block;
  }

  .chart-legend {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 4px;
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .legend-swatch {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    color: var(--secondary-text-color);
  }

  .empty-state ha-svg-icon {
    --mdc-icon-size: 48px;
    margin-bottom: 16px;
  }

  /* Sparkline chart */
  .sparkline-container { position: relative; margin: 8px 0; }

  .sparkline-svg {
    width: 100%;
    height: 140px;
    display: block;
  }

  /* Trigger info card */
  .trigger-card {
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    padding: 12px 16px;
    margin: 8px 0;
    border: 1px solid var(--divider-color);
  }

  .trigger-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .trigger-entity-name { font-weight: 500; font-size: 14px; }
  .trigger-entity-id { font-size: 11px; color: var(--secondary-text-color); font-family: monospace; }

  .entity-link {
    cursor: pointer;
    text-decoration: underline dotted;
    text-underline-offset: 2px;
  }
  .entity-link:hover {
    color: var(--primary-color);
    text-decoration: underline solid;
  }

  .trigger-value-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 4px 0;
  }

  .trigger-current { font-size: 28px; font-weight: 700; color: var(--primary-text-color); }
  .trigger-current.active { color: var(--maint-triggered-color); }
  .trigger-unit { font-size: 14px; color: var(--secondary-text-color); }

  /* Counter progress ("8,507 / 15,000 km · 57 %" + bar) */
  .counter-progress { margin: 6px 0 4px; }
  .counter-progress-nums {
    display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;
  }
  .counter-progress-main { font-size: 26px; font-weight: 700; color: var(--primary-text-color); }
  .counter-progress-target { font-size: 15px; font-weight: 500; color: var(--secondary-text-color); }
  .counter-progress-pct { font-size: 15px; font-weight: 700; }
  .counter-progress-pct.ok { color: var(--success-color, #4caf50); }
  .counter-progress-pct.near { color: var(--warning-color, #ff9800); }
  .counter-progress-pct.over { color: var(--error-color, #f44336); }
  .counter-progress-bar {
    height: 8px; border-radius: 4px; margin: 6px 0 4px; overflow: hidden;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
  }
  .counter-progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease; }
  .counter-progress-fill.ok { background: var(--success-color, #4caf50); }
  .counter-progress-fill.near { background: var(--warning-color, #ff9800); }
  .counter-progress-fill.over { background: var(--error-color, #f44336); }
  .counter-progress-caption { font-size: 12px; color: var(--secondary-text-color); }

  /* Note under a chart that fell back to sparse maintenance-event values */
  .chart-note {
    display: flex; align-items: center; gap: 6px; margin-top: 2px;
    font-size: 12px; color: var(--secondary-text-color);
  }
  .chart-note ha-icon { --mdc-icon-size: 15px; flex: none; }

  .trigger-limits {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: var(--secondary-text-color);
    margin: 6px 0;
    flex-wrap: wrap;
  }

  .trigger-limit-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .trigger-limit-item .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .trigger-limit-item .dot.warn { background: var(--error-color, #f44336); }
  .trigger-limit-item .dot.range { background: var(--secondary-text-color); }
  .trigger-limit-item .dot.ok { background: var(--maint-ok-color); }

  /* Row action buttons */
  .row-actions {
    display: flex;
    gap: 0;
    flex-shrink: 0;
    margin-left: auto;
  }

  .row-actions mwc-icon-button {
    --mdc-icon-button-size: 32px;
    --mdc-icon-size: 18px;
  }

  .row-actions .btn-complete { color: var(--maint-ok-color); }
  .row-actions .btn-skip { color: var(--secondary-text-color); }

  /* Days bar for overview */
  .due-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 90px;
    gap: 2px;
  }

  .due-text { font-size: 13px; }

  .days-bar {
    width: 100%;
    height: 3px;
    background: var(--divider-color);
    border-radius: 2px;
    overflow: hidden;
  }

  .days-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s;
  }

  /* Trigger progress bar (overview rows). width:100% — the due-cell doesn't
     stretch its children (align-items: flex-end), so without it the bar
     shrinks to its label and reads shorter than the days-bar in other rows. */
  .trigger-progress {
    display: flex;
    flex-direction: column;
    gap: 2px;
    /* #150 follow-up (2026-08-31, maisun's mobile screenshot): the box used
       to carry min-width: 90px — in the narrow grid the due column is
       fit-content(100px) and right-aligned, so on cells narrower than 90px
       the box overhung LEFT across the object name. It now tracks the cell
       with no floor, and the label ellipsizes inside. */
    align-self: stretch;
    max-width: 100%;
    min-width: 0;
    width: 100%;
  }

  .trigger-progress-bar {
    width: 100%;
    height: 6px;
    background: var(--divider-color);
    border-radius: 3px;
    overflow: hidden;
  }

  .trigger-progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s;
  }

  .trigger-progress-label {
    font-size: 12px;
    color: var(--secondary-text-color);
    text-align: right;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* #150 follow-up: 3-state trend arrow — replaces the sparkline on
     narrow/tight rows (panel-styles toggles visibility per regime). */
  .trend-arrow {
    display: none;
    font-style: normal;
    font-weight: 700;
    margin-left: 2px;
  }
  .trend-approaching { color: var(--warning-color, #ff9800); }
  .trend-stable { color: var(--secondary-text-color); }
  .trend-easing { color: var(--success-color, #4caf50); }


  /* Days progress bar (detail view) */
  .days-progress {
    margin: 8px 0 16px;
    padding: 12px 16px;
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--divider-color);
  }

  .days-progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-bottom: 6px;
  }

  .days-progress-bar {
    width: 100%;
    height: 6px;
    background: var(--divider-color);
    border-radius: 3px;
    overflow: hidden;
  }

  .days-progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s;
  }

  .days-progress-text {
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    margin-top: 6px;
    color: var(--primary-text-color);
  }

  /* Mini-sparkline in overview rows */
  .mini-sparkline {
    width: 60px;
    /* Same class of bug as the trigger-progress floor (#150 follow-up): in
       due cells narrower than the fixed width the right-aligned SVG used to
       overhang LEFT (phone-360 sweep). preserveAspectRatio="none" lets it
       just squeeze. */
    max-width: 100%;
    height: 20px;
    display: block;
    margin-top: 2px;
    opacity: 0.7;
  }

  /* Overflow indicator for overdue progress bars */
  .days-bar-fill.overflow,
  .days-progress-fill.overflow,
  .trigger-progress-fill.overflow {
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 3px,
      rgba(255,255,255,0.2) 3px,
      rgba(255,255,255,0.2) 6px
    );
    animation: overflow-pulse 2s ease-in-out infinite;
  }

  @keyframes overflow-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  /* Budget KPI tiles in the stats strip (#125) — replaced the full-width
     budget-bars row. The spent amount inherits .stat-value's full 24px bold
     so the budget tiles read exactly like the other KPI chips (user report
     2026-08-24: the old 15px override made them visibly smaller); only the
     "/ max" suffix stays secondary. */
  .stat-item.budget-tile .budget-tile-value {
    white-space: nowrap;
  }
  /* The "/ max" ratio is its OWN small line between value and bar — inline
     it overflowed the ~150px grid cell into the neighbouring tile once the
     value took the full 24px. */
  .budget-tile-max {
    font-size: 11px;
    line-height: 1.2;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .budget-tile-bar {
    width: 100%;
    max-width: 130px;
    height: 4px;
    border-radius: 2px;
    background: var(--divider-color);
    overflow: hidden;
    margin-top: 5px;
  }
  .budget-tile-bar > div {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s;
  }

  /* Groups section */
  .groups-section {
    padding: 8px 16px 16px;
  }

  .groups-section h3 {
    font-size: 14px;
    font-weight: 500;
    color: var(--secondary-text-color);
    margin: 0 0 8px;
  }

  .groups-grid {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .group-card {
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    padding: 12px 16px;
    min-width: 180px;
    flex: 1;
    max-width: 300px;
    cursor: default;
  }

  .group-card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .group-card-name {
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .group-card-actions {
    display: flex;
    gap: 0;
  }
  .group-card-actions mwc-icon-button {
    --mdc-icon-button-size: 28px;
    --mdc-icon-size: 16px;
    color: var(--secondary-text-color);
  }

  .groups-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .groups-header h3 { margin: 0; }

  .seasonal-actions {
    display: flex;
    justify-content: flex-end;
    padding: 4px 0;
  }

  .group-card-desc {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
  }

  .group-card-tasks {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .group-task-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--primary-text-color);
  }

  /* Adaptive scheduling suggestion badge */
  .suggestion-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    background: var(--info-color, #2196f3);
    color: white;
    margin-left: 8px;
  }

  .suggestion-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .suggestion-actions ha-button {
    --ha-button-font-size: 12px;
  }

  .confidence-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .confidence-dot.low { background: var(--secondary-text-color); }
  .confidence-dot.medium { background: var(--warning-color, #ff9800); }
  .confidence-dot.high { background: var(--success-color, #4caf50); }

  /* (The complete-dialog's .feedback-* rules live in complete-dialog.ts —
     this sheet carried a dead byte-identical copy until the 2026-08 drift
     audit; complete-dialog never imports sharedStyles.) */

  /* Seasonal chart */
  .seasonal-chart {
    padding: 12px 16px;
    margin: 8px 0;
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--divider-color);
  }

  .seasonal-chart-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .seasonal-chart-title .source-tag {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 8px;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color);
    font-weight: 400;
  }

  .seasonal-chart svg {
    width: 100%;
    height: 100px;
    display: block;
  }

  .seasonal-labels {
    display: flex;
    justify-content: space-between;
    padding: 0 2px;
    margin-top: 4px;
  }

  .seasonal-label {
    font-size: 10px;
    color: var(--secondary-text-color);
    text-align: center;
    flex: 1;
  }

  .seasonal-label.active-month {
    font-weight: 700;
    color: var(--primary-color);
  }

  .seasonal-factor-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color);
    margin-left: 6px;
  }

  .seasonal-factor-tag.short {
    background: rgba(76, 175, 80, 0.15);
    color: var(--success-color, #4caf50);
  }

  .seasonal-factor-tag.long {
    background: rgba(255, 152, 0, 0.15);
    color: var(--warning-color, #ff9800);
  }

  /* --- Sensor Prediction Section (Phase 3) --- */

  .prediction-section {
    margin: 16px 0;
    padding: 12px 16px;
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--divider-color, #e0e0e0);
  }

  .prediction-urgency-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    margin-bottom: 12px;
    border-radius: 8px;
    background: rgba(255, 152, 0, 0.15);
    color: var(--warning-color, #ff9800);
    font-size: 13px;
    font-weight: 500;
  }
  .prediction-urgency-banner ha-svg-icon {
    --mdc-icon-size: 18px;
    flex-shrink: 0;
  }

  .prediction-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-text-color);
    margin-bottom: 10px;
  }
  .prediction-title ha-svg-icon {
    --mdc-icon-size: 16px;
    color: var(--primary-color);
  }

  .prediction-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .prediction-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .prediction-item ha-svg-icon {
    --mdc-icon-size: 14px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }

  .prediction-label {
    font-weight: 500;
  }

  .prediction-value {
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .prediction-value.rising { color: var(--error-color, #f44336); }
  .prediction-value.falling { color: var(--info-color, #2196f3); }
  .prediction-value.stable { color: var(--success-color, #4caf50); }
  .prediction-value.exceeded { color: var(--error-color, #f44336); font-weight: 700; }
  .prediction-value.urgent { color: var(--warning-color, #ff9800); font-weight: 700; }

  .prediction-rate {
    font-size: 11px;
    opacity: 0.7;
    font-family: monospace;
  }

  .prediction-date {
    font-size: 11px;
    opacity: 0.7;
  }

  .prediction-cycles {
    font-size: 11px;
    opacity: 0.7;
  }

  .prediction-entity {
    font-size: 10px;
    opacity: 0.6;
    font-family: monospace;
  }

  /* --- Weibull Reliability Section (Phase 4) --- */

  .weibull-section {
    margin: 16px 0;
    padding: 12px 16px;
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--divider-color, #e0e0e0);
  }

  .weibull-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-text-color);
    margin-bottom: 10px;
  }
  .weibull-title ha-svg-icon {
    --mdc-icon-size: 16px;
    color: var(--primary-color);
  }

  .weibull-chart svg {
    width: 100%;
    height: 160px;
    display: block;
  }

  .weibull-info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 10px;
  }

  .weibull-info-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .weibull-info-value {
    font-weight: 600;
    color: var(--primary-text-color);
  }

  /* Beta interpretation badge */
  .beta-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }
  .beta-badge ha-svg-icon {
    --mdc-icon-size: 14px;
  }

  .beta-badge.early_failures {
    background: rgba(244, 67, 54, 0.15);
    color: var(--error-color, #f44336);
  }
  .beta-badge.random_failures {
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color);
  }
  .beta-badge.wear_out {
    background: rgba(255, 152, 0, 0.15);
    color: var(--warning-color, #ff9800);
  }
  .beta-badge.highly_predictable {
    background: rgba(76, 175, 80, 0.15);
    color: var(--success-color, #4caf50);
  }

  /* Confidence interval range bar */
  .confidence-range {
    margin-top: 12px;
  }

  .confidence-range-title {
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color);
    margin-bottom: 6px;
  }

  .confidence-bar {
    position: relative;
    width: 100%;
    height: 8px;
    background: var(--divider-color, #e0e0e0);
    border-radius: 4px;
    overflow: visible;
  }

  .confidence-fill {
    position: absolute;
    height: 100%;
    border-radius: 4px;
    background: var(--primary-color, #03a9f4);
    opacity: 0.25;
  }

  .confidence-marker {
    position: absolute;
    top: -4px;
    width: 3px;
    height: 16px;
    border-radius: 1px;
    transform: translateX(-50%);
  }
  .confidence-marker.recommended {
    background: var(--success-color, #4caf50);
  }
  .confidence-marker.current {
    background: var(--primary-color, #03a9f4);
  }

  .confidence-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
  }

  .confidence-text {
    font-size: 10px;
    color: var(--secondary-text-color);
  }
  .confidence-text.low {
    text-align: left;
  }
  .confidence-text.high {
    text-align: right;
  }

  .task-disabled { opacity: 0.5; }
  .badge-disabled {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 8px;
    background: var(--disabled-color, #9e9e9e);
    color: white;
  }

  /* ── Shared responsive styles (panel + card) ── */
  @media (max-width: 600px) {
    .row-actions mwc-icon-button {
      --mdc-icon-button-size: 44px;
      --mdc-icon-size: 22px;
    }

    .due-cell { min-width: 70px; }

    .trigger-card { padding: 10px 12px; }
    .trigger-current { font-size: 22px; }

    .prediction-grid { flex-direction: column; gap: 8px; }

    .weibull-info-row { flex-direction: column; gap: 8px; }

    /* Budget tiles on narrow screens (#125): the spent amount keeps the
       full chip size (consistency, user report 2026-08-24); the "/ max"
       suffix is hidden instead — the bar and the title carry the ratio. */
    .budget-tile-max { display: none; }

    .group-card { min-width: 0; max-width: 100%; }

    .filter-chip { padding: 6px 12px; font-size: 13px; }

    .history-details { flex-wrap: wrap; gap: 6px; }

    .sparkline-container { max-width: 100%; overflow: hidden; }
    .sparkline-svg { height: 100px; }

    /* #150 — phones get a FIXED 10-track grid instead of auto-fit: the five
       KPI tiles span 2 tracks each (= one full row on any width ≥ 320 px),
       the two budget tiles span 5 each (= a full second row). auto-fit with
       a px floor rewrapped to 3-4 columns on 360-412 px phones and left one
       or two tiles orphaned on their own row. */
    .stats-bar { grid-template-columns: repeat(10, minmax(0, 1fr)); gap: 6px; padding: 12px; }
    /* min-width: 0 (NOT a fixed floor) — a fixed min-width re-enables the
       grid's auto minimum, so the 5 KPI tracks couldn't shrink below their
       label text and the last KPI clipped off-screen on phones (the header
       only *looked* cut — .content scrolls sideways, but nothing hints so).
       With 0 the tracks compress and the labels wrap to a second line. */
    .stat-item { min-width: 0; grid-column: span 2; }
    .stat-item.budget-tile { grid-column: span 5; }
    .stat-item.clickable { padding: 4px 2px; }
    /* ~60 px tracks: multi-word labels wrap at the space, single overlong
       words (nl "Achterstallig") hyphenate where the browser can and hard-
       break as the last resort — never clip. */
    .stat-item .stat-label { font-size: 11px; white-space: normal; text-align: center; line-height: 1.2; hyphens: auto; overflow-wrap: anywhere; }
    .stat-value { font-size: 20px; }
  }
`;
