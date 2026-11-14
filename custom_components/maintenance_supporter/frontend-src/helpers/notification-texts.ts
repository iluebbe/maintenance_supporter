/**
 * #252: a task's own notification texts. Per kind a title and/or a message;
 * an empty field keeps the standard text, and placeholders other than the
 * kind's stay as written. Keep in lockstep with
 * const.NOTIFICATION_TEXT_PLACEHOLDERS and the length caps
 * (tests/test_frontend_const_parity.py); the backend cleans the same way
 * (helpers/sanitize.sanitize_notification_texts).
 */

import type { NotificationText, NotificationTextKind, NotificationTexts } from "../types";

export const NOTIFICATION_TEXT_PLACEHOLDERS: Readonly<Record<NotificationTextKind, readonly string[]>> = {
  due_soon: ["task", "object", "days", "due"],
  overdue: ["task", "object", "days", "due"],
  triggered: ["task", "object", "detail"],
  completed: ["task", "object", "reason", "person"],
};

export const NOTIFICATION_TEXT_KINDS = Object.keys(NOTIFICATION_TEXT_PLACEHOLDERS) as NotificationTextKind[];

export const MAX_NOTIFICATION_TEXT_TITLE_LENGTH = 120;
export const MAX_NOTIFICATION_TEXT_MESSAGE_LENGTH = 500;

/** The first `max` characters as Python counts them (code points): a cut
 *  between the halves of an emoji left a lone surrogate, which the server's
 *  JSON parser refuses, so the save never arrived (DRY audit round 7, X7-A2). */
function cut(text: string, max: number): string {
  return Array.from(text).slice(0, max).join("");
}

/** The texts as the save sends them: trimmed, a title on one line, empty
 *  fields and kinds left out; null when none is left (the standard texts).
 *  The backend cleans the same way; both read
 *  __tests__/fixtures/notification-texts-vectors.json. */
export function cleanNotificationTexts(texts: NotificationTexts | null | undefined): NotificationTexts | null {
  const out: NotificationTexts = {};
  for (const kind of NOTIFICATION_TEXT_KINDS) {
    const entry = texts?.[kind];
    if (!entry || typeof entry !== "object") continue;
    const cleaned: NotificationText = {};
    const rawTitle = typeof entry.title === "string" ? entry.title : "";
    const rawMessage = typeof entry.message === "string" ? entry.message : "";
    const title = cut(rawTitle.split(/\s+/).filter(Boolean).join(" "), MAX_NOTIFICATION_TEXT_TITLE_LENGTH).trim();
    const message = cut(rawMessage.replace(/\r\n/g, "\n").trim(), MAX_NOTIFICATION_TEXT_MESSAGE_LENGTH).trim();
    if (title) cleaned.title = title;
    if (message) cleaned.message = message;
    if (cleaned.title || cleaned.message) out[kind] = cleaned;
  }
  return Object.keys(out).length ? out : null;
}

/** The kinds that have a text of their own, in the table's order. */
export function ownTextKinds(texts: NotificationTexts | null | undefined): NotificationTextKind[] {
  const cleaned = cleanNotificationTexts(texts);
  return cleaned ? NOTIFICATION_TEXT_KINDS.filter((k) => cleaned[k]) : [];
}
