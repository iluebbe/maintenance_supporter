/** Shared chart helpers: nice axis ticks and consistent number/date formats. */

import { formatDateShort, formatTimeOfDay } from "../styles";

/** Round axis ticks covering [min, max] — the classic "nice numbers" loop.
 *  Returns the tick values plus the (possibly widened) nice domain, so the
 *  chart can plot against the same bounds the labels describe. */
export function niceTicks(
  min: number,
  max: number,
  targetCount = 4,
): { ticks: number[]; niceMin: number; niceMax: number } {
  if (!isFinite(min) || !isFinite(max)) return { ticks: [], niceMin: 0, niceMax: 1 };
  if (min === max) {
    // Degenerate domain: pad around the value so the line isn't glued to an edge.
    const pad = Math.abs(min) * 0.1 || 1;
    min -= pad;
    max += pad;
  }
  const span = max - min;
  const step0 = Math.pow(10, Math.floor(Math.log10(span / Math.max(1, targetCount))));
  let step = step0;
  for (const m of [1, 2, 5, 10]) {
    step = step0 * m;
    if (span / step <= targetCount + 0.5) break;
  }
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  // Epsilon guards float drift (0.30000000000000004 style) at tick boundaries.
  for (let v = niceMin; v <= niceMax + step * 1e-6; v += step) {
    ticks.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  }
  return { ticks, niceMin, niceMax };
}

/** Compact, consistent number format: 1.2M / 88k / 730 / 7.5 / 0.42 */
export function fmtNum(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return trimZero((v / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1)) + "M";
  if (a >= 10_000) return trimZero((v / 1000).toFixed(0)) + "k";
  if (a >= 1000) return trimZero((v / 1000).toFixed(1)) + "k";
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return trimZero(v.toFixed(1));
  if (a >= 1) return trimZero(v.toFixed(1));
  if (a === 0) return "0";
  return trimZero(v.toFixed(2));
}

function trimZero(s: string): string {
  return s.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
}

/** Full-precision value + unit for tooltips (locale-aware grouping). */
export function fmtVal(v: number, unit: string, lang: string): string {
  const s = v.toLocaleString(lang, { maximumFractionDigits: Math.abs(v) >= 100 ? 0 : 1 });
  return unit ? `${s} ${unit}` : s;
}

/** Short date tick: "3. Juli" / "Jul 3", with year appended when the plotted
 *  range spans more than ~10 months (disambiguates "Jun … Feb" sequences). */
export function fmtDateTick(ts: number, lang: string, withYear: boolean): string {
  return formatDateShort(new Date(ts), lang, withYear);
}

/** Date+time for crosshair/tooltip labels — the clock half follows the HA
 *  profile time format (#163). */
export function fmtDateTime(ts: number, lang: string): string {
  const d = new Date(ts);
  return `${formatDateShort(d, lang)}, ${formatTimeOfDay(d, lang)}`;
}

/** Whether date ticks need the year: the range crosses a calendar-year
 *  boundary (a "Jun … Feb" sequence would otherwise read backwards). */
export function needsYear(tsMin: number, tsMax: number): boolean {
  return new Date(tsMin).getFullYear() !== new Date(tsMax).getFullYear();
}

/** Evenly-spaced x-axis tick timestamps (first/last inclusive). */
export function timeTicks(tsMin: number, tsMax: number, count: number): number[] {
  if (count < 2 || tsMax <= tsMin) return [tsMin, tsMax];
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(tsMin + ((tsMax - tsMin) * i) / (count - 1));
  return out;
}
