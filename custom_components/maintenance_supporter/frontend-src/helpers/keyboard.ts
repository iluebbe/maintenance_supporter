/**
 * Keyboard activation for elements that are not native buttons.
 *
 * The ⋮ menus list their items as `div.popup-menu-item`, and the object
 * quick-actions dialog its tasks as clickable rows: with a click handler
 * only, none of them could be reached or used by keyboard (audit 2026-10-17,
 * P-13). They carry `role="menuitem"` / `role="button"` and `tabindex="0"`;
 * this handler, on the item or on its menu, makes Enter and Space act like a
 * click.
 */
export function clickOnActivationKey(e: KeyboardEvent): void {
  if (e.key !== "Enter" && e.key !== " ") return;
  const target = e.target as HTMLElement | null;
  const item = target?.closest?.<HTMLElement>('[role="menuitem"], [role="button"]');
  if (!item || item.getAttribute("aria-disabled") === "true") return;
  e.preventDefault();
  item.click();
}
