/** Household member avatars — initials in a coloured circle (#169 follow-up).
 *
 * The backend resolves `initials` + `color` per user (`users/list`: admin
 * override from Settings → Household members, else derived from the name /
 * a stable palette colour per user id). The fallbacks here only cover an
 * older backend that does not send them yet. The palette mirrors
 * `helpers/member_display.py`; a Python tripwire pins the two.
 */

import { html, nothing } from "lit";
import type { HAUser } from "../types";

export const AVATAR_PALETTE = [
  "#c62828", "#ad1457", "#6a1b9a", "#4527a0", "#283593", "#1565c0",
  "#00838f", "#2e7d32", "#558b2f", "#ef6c00", "#6d4c41", "#546e7a",
] as const;

export interface PersonDisplay {
  id: string;
  name: string;
  initials: string;
  color: string;
}

/** First letter of the first and of the last word ("Dev" → "D"). */
export function defaultInitials(name: string | null | undefined): string {
  const words = (name || "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/** Stable palette colour for a user id (fallback only — the backend's hash differs). */
export function defaultColor(id: string): string {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

/** The display record for a user — override-or-default as the backend resolved it. */
export function personOf(user: HAUser | null | undefined): PersonDisplay | null {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    initials: user.initials || defaultInitials(user.name),
    color: user.color || defaultColor(user.id),
  };
}

/** The circle alone (title carries the full name). */
export function renderPersonAvatar(person: PersonDisplay | null | undefined) {
  if (!person) return nothing;
  return html`<span class="person-avatar" style="--person-color: ${person.color}" title=${person.name}>${person.initials}</span>`;
}

/** Circle + name. The name span is what narrow layouts hide (`.person-name`). */
export function renderPersonChip(person: PersonDisplay | null | undefined, extraClass = "") {
  if (!person) return nothing;
  return html`<span class="person-chip ${extraClass}" title=${person.name}>${renderPersonAvatar(person)}<span class="person-name">${person.name}</span></span>`;
}
