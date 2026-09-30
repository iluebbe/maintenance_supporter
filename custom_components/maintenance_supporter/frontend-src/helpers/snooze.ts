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

export interface SnoozeResult {
  hours?: number;
  snoozed_until?: string;
}

export function snoozedMessage(res: SnoozeResult | null | undefined, lang: string, now: Date = new Date()): string {
  const hours = res?.hours;
  const until = res?.snoozed_until ? new Date(res.snoozed_until) : null;
  if (typeof hours !== "number" || !until || isNaN(until.getTime())) return t("snoozed", lang);
  const sameDay = until.toDateString() === now.toDateString();
  const when = sameDay ? formatTimeOfDay(until, lang) : formatDateTime(res!.snoozed_until!, lang);
  const text = hours === 1 ? t("snoozed_for_one", lang) : t("snoozed_for", lang).replace("{hours}", formatNumber(hours, lang));
  return text.replace("{until}", when);
}
