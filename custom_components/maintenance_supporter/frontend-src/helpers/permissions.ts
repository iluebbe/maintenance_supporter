/** Who may do what — the frontend twin of the backend's three tiers
 *  (helpers/permissions.py, frozen in tests/test_ws_permission_matrix.py).
 *
 *  - write tier (content create / edit / delete): HA admins, plus
 *    allowlisted operators while operator-write delegation is switched on.
 *    `canWrite()` is THE rule — the panel, the Lovelace quick-action dialogs
 *    and the section cards each had their own copy, and the Lovelace ones
 *    only looked at `is_admin`, so a delegated operator saw no Edit/Delete
 *    outside the panel (DRY audit 2026-09-26).
 *  - read tier: the household actions below are open to EVERY signed-in
 *    member (the same path the entity buttons and voice use). The panel hid
 *    Reset / Postpone / Snooze from non-writers although the server takes
 *    them from anyone — so they must never sit behind `canWrite()`.
 *
 *  tests/test_frontend_permission_parity.py ties HOUSEHOLD_ACTIONS to the
 *  backend's read tier: a command moving tiers fails CI until the UI's
 *  gating follows.
 */

export interface WriteAccess {
  /** Global option `operator_write_enabled` (default OFF). */
  operatorWriteEnabled: boolean;
  /** Global option `admin_panel_user_ids` — the operator allowlist. */
  operatorIds: readonly string[];
}

export const NO_DELEGATION: WriteAccess = { operatorWriteEnabled: false, operatorIds: [] };

/** Mirror of `permissions.user_can_write`: admins always; a non-admin only
 *  when delegation is on AND they are on the allowlist; nobody without a
 *  user (pre-hass render — the safe default). */
export function canWrite(
  user: { id: string; is_admin?: boolean } | null | undefined,
  access: WriteAccess = NO_DELEGATION,
): boolean {
  if (!user) return false;
  if (user.is_admin) return true;
  return access.operatorWriteEnabled && access.operatorIds.includes(user.id);
}

/** WS commands (without the `maintenance_supporter/` prefix) behind the
 *  actions EVERY household member is offered — read tier on the server. */
export const HOUSEHOLD_ACTIONS = [
  "task/complete",
  "task/quick_complete",
  "task/skip",
  "task/reset",
  "task/postpone",
  "task/snooze",
  "task/set_phase",
  "task/checklist_progress",
] as const;
