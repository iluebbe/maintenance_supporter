/** What a snooze did, in words (#193).
 *
 * Snooze mutes a task's reminders for the household's snooze duration
 * (Settings → Notifications) without touching its schedule — so nothing on
 * the task changes, and a bare "Snoozed" left people wondering whether it
 * worked and for how long. `task/snooze` answers with the hours and the end;
 * this turns them into "Reminders muted for 4 hours — until 18:30" (with the
 * date when the end is not today). An older backend without the fields gets
 * the plain word.
 */

import { formatDateTime, formatNumber, formatTimeOfDay, t } from "../styles";
import { displayTimeZone, stampMs, ymdIn } from "./ha-time";

export interface SnoozeResult {
  hours?: number;
  snoozed_until?: string;
}

export function snoozedMessage(res: SnoozeResult | null | undefined, lang: string, now: Date = new Date()): string {
  const hours = res?.hours;
  const until = stampMs(res?.snoozed_until);
  if (typeof hours !== "number" || !Number.isFinite(until)) return t("snoozed", lang);
  // "Today" on the clock the time is shown in (the profile's time zone).
  const zone = displayTimeZone();
  const sameDay = ymdIn(until, zone) === ymdIn(now, zone);
  const when = sameDay ? formatTimeOfDay(new Date(until), lang) : formatDateTime(res!.snoozed_until!, lang);
  const text = hours === 1 ? t("snoozed_for_one", lang) : t("snoozed_for", lang).replace("{hours}", formatNumber(hours, lang));
  return text.replace("{until}", when);
}
