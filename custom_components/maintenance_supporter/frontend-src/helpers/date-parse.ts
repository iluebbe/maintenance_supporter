/** Typed date entry (forum #23): turn what a person types into the contract
 *  "YYYY-MM-DD" — HA's date dialog only steps month by month and its text
 *  field is read-only, so an installation date of 1978 was hundreds of
 *  clicks away.
 *
 *  Accepted: ISO `1978-03-15` (also `1978-3-5`), a bare year `1978` (→ 1 Jan),
 *  month + year `03/1978` / `03.1978` (→ the 1st), and day-month-year with
 *  `.`, `/` or `-`. Dots are always day-first (`15.03.1978` — nobody writes
 *  MDY with dots); slashes and dashes follow the profile's date order,
 *  detected from how the formatter renders a probe date, so every profile
 *  setting (DMY / MDY / YMD / system / language + country) is honoured
 *  without a second table. Invalid calendar dates (31 Feb) are refused.
 */
import { formatDate } from "../styles";

export type DateOrder = "DMY" | "MDY" | "YMD";

/** The day/month/year order the current profile renders dates in. */
export function detectDateOrder(lang?: string): DateOrder {
  const probe = formatDate("2001-02-03", lang);
  const nums = probe.match(/\d+/g) || [];
  const at = (n: number) => nums.findIndex((x) => Number(x) === n);
  const y = at(2001), m = at(2), d = at(3);
  if (y === 0) return "YMD";
  if (m >= 0 && d >= 0 && m < d) return "MDY";
  return "DMY";
}

function iso(y: number, m: number, d: number): string | null {
  if (y < 1000 || y > 9999 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Parse typed text into "YYYY-MM-DD"; null when it is not a date. */
export function parseTypedDate(text: string, lang?: string): string | null {
  const s = text.trim();
  let m: RegExpMatchArray | null;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) return iso(+m[1], +m[2], +m[3]);
  if ((m = s.match(/^(\d{4})$/))) return iso(+m[1], 1, 1);
  if ((m = s.match(/^(\d{1,2})[./](\d{4})$/))) return iso(+m[2], +m[1], 1);
  if ((m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))) return iso(+m[3], +m[2], +m[1]);
  if ((m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/))) {
    const first = +m[1], second = +m[2], year = +m[3];
    return detectDateOrder(lang) === "MDY" ? iso(year, first, second) : iso(year, second, first);
  }
  return null;
}
