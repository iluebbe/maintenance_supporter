/** Minutes typed into a duration field → what the server stores.
 *
 * Every duration the backend accepts is WHOLE minutes (`vol.Coerce(int)` in
 * task/complete, task/history/update and quick_complete_defaults), but the
 * complete dialog's field allowed 0.01 steps and was read with parseInt —
 * "12.9" silently became 12 (bug audit 2026-09-26). The fields now step by
 * 1, and a typed fraction rounds to the nearest minute instead of being cut
 * off. A comma decimal separator is accepted like everywhere else.
 *
 * Returns null for an empty / invalid / negative entry (= "not given").
 */
export function parseDurationMinutes(raw: string | null | undefined): number | null {
  const text = (raw ?? "").trim();
  if (text === "") return null;
  const v = Number(text.replace(",", "."));
  if (!Number.isFinite(v) || v < 0) return null;
  return Math.round(v);
}
