/** A span of time as people say it. Its own module: the trace, the history
 *  rows (helpers/trigger-value.ts, which the trace imports) and the state
 *  timeline all say how long something took. */

import { formatUnit } from "../styles";

/** A span of time in the largest unit that reads well: minutes under an
 *  hour, hours under two days, days beyond. */
export function spanText(ms: number, lang: string): string {
  const minutes = Math.max(1, Math.round(ms / 60_000));
  if (minutes < 60) return formatUnit(minutes, "minute", lang);
  const hours = Math.round(ms / 3_600_000);
  if (hours < 48) return formatUnit(hours, "hour", lang);
  return formatUnit(Math.round(ms / 86_400_000), "day", lang);
}
