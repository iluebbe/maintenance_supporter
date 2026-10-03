/** Home Assistant's clock: the time zone behind every date the UI computes
 *  or shows.
 *
 *  The backend works in HA's configured zone (`hass.config.time_zone`)
 *  throughout — next_due, days_until_due and the status are HA-local days,
 *  history timestamps carry the HA offset, and a zone-less datetime sent
 *  over the WebSocket is read as HA local time. The browser can sit in
 *  another zone (a phone abroad, a remote desktop), and a date taken from
 *  ITS clock disagrees with all of that by up to a day: a back-dated
 *  completion was refused as "in the future" east of HA and stored hours
 *  early west of it. So:
 *
 *  - Schedule logic — "today", a back-dated completion, the calendar
 *    window, cost months and years, warranty days — always runs on HA's
 *    clock: haToday, haNowMinute, stampMs, stampDate.
 *  - A full timestamp is SHOWN in the profile's "Time zone" (local = this
 *    browser's, server = HA's) like HA's own frontend does:
 *    displayTimeZone, which styles.ts passes to every Intl formatter.
 *  - A date-only string ("YYYY-MM-DD": next_due, warranty, installation
 *    dates) has no zone and is never shifted: addDaysIso, daysBetweenIso.
 *
 *  Both zones arrive with hass: setProfilePrefs() (styles.ts) stores them on
 *  the profile-prefs window singleton every bundle shares. Without
 *  hass.config.time_zone (old cores, test mocks) HA's zone falls back to the
 *  browser's — what the UI always assumed.
 *
 *  Besides styles.ts the one module that talks to Intl.DateTimeFormat — for
 *  zone arithmetic through formatToParts, never to format for display
 *  (rule B in __tests__/profile-format-single-source.test.ts).
 */

/** The zone half of the profile prefs (styles.ts ProfilePrefs): the same
 *  window object, written by setProfilePrefs() and read here — each bundle
 *  has its own module scope. */
interface ZonePrefs {
  /** The HA profile setting "Time zone": "local" (HA's default) | "server". */
  timeZone?: string;
  /** hass.config.time_zone — the zone the backend counts every date in. */
  serverTimeZone?: string;
}
const PREFS: ZonePrefs = ((window as unknown as { __msDateTimePrefs?: ZonePrefs }).__msDateTimePrefs ??= {});

const DAY_MS = 86400000;
const pad = (n: number, width = 2): string => String(n).padStart(width, "0");

/** One formatToParts formatter per zone (building one is the slow part);
 *  null for a zone this browser does not know. */
const FORMATTERS = new Map<string, Intl.DateTimeFormat | null>();
function formatterFor(tz: string): Intl.DateTimeFormat | null {
  let f = FORMATTERS.get(tz);
  if (f === undefined) {
    try {
      f = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      f = null; // RangeError: not an IANA zone this browser knows
    }
    FORMATTERS.set(tz, f);
  }
  return f;
}

let LOCAL_ZONE: string | null | undefined;
/** The browser's own zone (HA's LOCAL_TIME_ZONE); null when it cannot say. */
function localZone(): string | null {
  if (LOCAL_ZONE === undefined) {
    let tz: string | undefined;
    try {
      tz = new Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      // an engine without time zone support
    }
    LOCAL_ZONE = tz && formatterFor(tz) ? tz : null;
  }
  return LOCAL_ZONE;
}

/** This browser's zone ("UTC" when the engine cannot say). */
export function browserTimeZone(): string {
  return localZone() ?? "UTC";
}

/** HA's configured zone — the one next_due, days_until_due and the status
 *  count in. The browser's when hass did not tell (old cores, test mocks)
 *  or named a zone this browser does not know. */
export function haTimeZone(): string {
  const tz = PREFS.serverTimeZone;
  return tz && formatterFor(tz) ? tz : browserTimeZone();
}

/** The zone a timestamp is SHOWN in — HA's resolveTimeZone(): the profile
 *  option "server" shows HA's clock, "local" (HA's default, also assumed
 *  when the option is missing) this browser's. */
export function displayTimeZone(): string {
  const local = localZone();
  return PREFS.timeZone !== "server" && local ? local : haTimeZone();
}

interface Wall { y: number; mo: number; d: number; h: number; mi: number; s: number }

/** The wall clock of an instant in a zone (an unknown zone reads as the
 *  browser's). Throws a RangeError for an invalid instant, like Intl. */
function wallOf(ms: number, tz: string): Wall {
  const f = formatterFor(tz) ?? formatterFor(browserTimeZone()) ?? formatterFor("UTC")!;
  const p: Record<string, number> = {};
  for (const part of f.formatToParts(ms)) if (part.type !== "literal") p[part.type] = Number(part.value);
  // hourCycle h23; the modulo guards an engine that still says "24" at midnight.
  return { y: p.year, mo: p.month, d: p.day, h: p.hour % 24, mi: p.minute, s: p.second };
}

const ymdOf = (w: Wall): string => `${pad(w.y, 4)}-${pad(w.mo)}-${pad(w.d)}`;

/** "YYYY-MM-DD" — the calendar day of an instant in a zone. */
export function ymdIn(date: Date | number, tz: string): string {
  return ymdOf(wallOf(+date, tz));
}

/** "YYYY-MM-DDTHH:MM" — the wall-clock minute of an instant in a zone. */
export function minuteIn(date: Date | number, tz: string): string {
  const w = wallOf(+date, tz);
  return `${ymdOf(w)}T${pad(w.h)}:${pad(w.mi)}`;
}

/** HA's today, "YYYY-MM-DD" — the day next_due and days_until_due count from. */
export function haToday(): string {
  return ymdIn(Date.now(), haTimeZone());
}

/** HA's current minute, "YYYY-MM-DDTHH:MM" — where a back-dated completion
 *  starts (the field's zone-less value is HA local time). */
export function haNowMinute(): string {
  return minuteIn(Date.now(), haTimeZone());
}

/** The zone's offset from UTC at an instant, in ms. */
function offsetAt(ms: number, tz: string): number {
  const w = wallOf(ms, tz);
  return Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi, w.s) - Math.floor(ms / 1000) * 1000;
}

/** A wall time in a zone → its instant, resolved like Python's default
 *  fold=0 that the backend applies to a zone-less value: a time that
 *  happens twice (clocks going back) is the earlier one, a time that is
 *  skipped (clocks going forward) takes the offset from before the switch. */
function wallToMs(y: number, mo: number, d: number, h: number, mi: number, s: number, tz: string): number {
  const asUtc = Date.UTC(y, mo - 1, d, h, mi, s);
  // At most one switch lies within a day: the offsets on either side.
  const before = offsetAt(asUtc - DAY_MS, tz);
  const after = offsetAt(asUtc + DAY_MS, tz);
  for (const off of before === after ? [before] : [before, after]) {
    if (offsetAt(asUtc - off, tz) === off) return asUtc - off;
  }
  return asUtc - before;
}

/** "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM[:SS[.fff…]]" (a space works too) — a
 *  value WITHOUT an offset, which the backend reads as HA local time. */
const ZONELESS = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?$/;

/** Conversions per (HA zone, stamp). One zone conversion runs formatToParts
 *  (~10 µs, several times that on a phone, against ~0.2 µs for the old
 *  browser-zone getDate()), and a history renders the same stamps on every
 *  update — the areas page converts every completion of every object. The
 *  zone is part of the key, so a changed HA zone never reads a stale day;
 *  the maps are cleared when they outgrow the cap. */
const STAMP_DAYS = new Map<string, string | null>();
const STAMP_MS = new Map<string, number>();
const STAMP_CACHE_CAP = 20000;
function memo<T>(cache: Map<string, T>, key: string, compute: () => T): T {
  if (cache.has(key)) return cache.get(key) as T;
  if (cache.size >= STAMP_CACHE_CAP) cache.clear();
  const value = compute();
  cache.set(key, value);
  return value;
}

/** The instant of a timestamp in ms, NaN when it is none. A value with an
 *  offset is that instant; a zone-less one is HA local time — the backend
 *  reads it so, and the history editor stores it so. */
export function stampMs(iso: string | null | undefined): number {
  if (typeof iso !== "string" || !iso) return NaN;
  const m = ZONELESS.exec(iso);
  if (!m) return Date.parse(iso);
  const zone = haTimeZone();
  return memo(STAMP_MS, `${zone}|${iso}`, () => {
    const [y, mo, d, h, mi, s] = [m[1], m[2], m[3], m[4] ?? "0", m[5] ?? "0", m[6] ?? "0"].map(Number);
    if (mo < 1 || mo > 12 || new Date(Date.UTC(y, mo - 1, d)).getUTCDate() !== d || h > 23 || mi > 59 || s > 59) return NaN;
    const ms = m[7] ? Math.floor(Number(`0.${m[7]}`) * 1000) : 0;
    return wallToMs(y, mo, d, h, mi, s, zone) + ms;
  });
}

/** The HA calendar day of a timestamp — the twin of the backend's
 *  local_date_from_iso: a zone-less value keeps its own digits (it IS HA
 *  local time), one with an offset gives its day in HA's zone ("…T23:30:00
 *  +00:00" is already the next day in Berlin, so slicing the string was
 *  wrong for imported stamps). null when the value is no date. */
export function stampDate(iso: string | null | undefined): string | null {
  if (typeof iso !== "string" || !iso) return null;
  const m = ZONELESS.exec(iso);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const zone = haTimeZone();
  return memo(STAMP_DAYS, `${zone}|${iso}`, () => {
    const ms = Date.parse(iso);
    if (Number.isFinite(ms)) return ymdIn(ms, zone);
    return /^\d{4}-\d{2}-\d{2}/.test(iso) ? iso.slice(0, 10) : null;
  });
}

/** The HA wall time of a timestamp, "YYYY-MM-DDTHH:MM:SS" — what a datetime
 *  field editing it shows, its zone-less value being HA local time. A
 *  zone-less stamp keeps its digits; "" when the value is no timestamp. */
export function haWallTime(iso: string | null | undefined): string {
  if (typeof iso !== "string" || !iso) return "";
  const m = ZONELESS.exec(iso);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4] ?? "00"}:${m[5] ?? "00"}:${m[6] ?? "00"}`;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return "";
  const w = wallOf(ms, haTimeZone());
  return `${ymdOf(w)}T${pad(w.h)}:${pad(w.mi)}:${pad(w.s)}`;
}

const YMD = /^(\d{4})-(\d{2})-(\d{2})$/;

/** UTC day number of a "YYYY-MM-DD" string; NaN when it is no real date. */
function dayNumber(ymd: string): number {
  const m = YMD.exec(ymd);
  if (!m) return NaN;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = Date.UTC(y, mo - 1, d);
  return mo >= 1 && mo <= 12 && new Date(t).getUTCDate() === d ? t / DAY_MS : NaN;
}

/** Calendar maths on a date-only string ("2026-03-28" + 2 → "2026-03-30")
 *  in whole UTC days, so a DST switch can neither drop nor repeat a day. An
 *  out-of-range day rolls over like Date's ("2026-02-30" is March 2nd), so
 *  a loop stepping a cursor always advances; a value that is no date at all
 *  comes back unchanged. */
export function addDaysIso(ymd: string, days: number): string {
  const m = YMD.exec(ymd);
  if (!m) return ymd;
  const t = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + Math.round(days)));
  return `${pad(t.getUTCFullYear(), 4)}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

/** Whole days from one date-only string to another (negative when `to` is
 *  the earlier one); NaN when either is no date. */
export function daysBetweenIso(from: string, to: string): number {
  return dayNumber(to) - dayNumber(from);
}
