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

/** Enter and Space run ``act``, as a click on the element does: for an
 *  element with its own click handler that is not a native button (a row, a
 *  file picker's label, a group header). Six handlers spelled it out beside
 *  {@link clickOnActivationKey}, and the areas table took Enter only (DRY
 *  audit 2026-10-30, FE6-B7). */
export function onActivationKey(act: (e: KeyboardEvent) => void): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    act(e);
  };
}

/** An inline field: Enter commits, Escape cancels. The restock, use, buy
 *  and dispose fields each spelled it out (DRY audit 2026-10-30, FE6-B8). */
export function commitOnEnter(commit: () => void, cancel: () => void): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (e.key === "Enter") commit();
    else if (e.key === "Escape") cancel();
  };
}

/** A count typed into such a field, or null when it is none: a number above
 *  zero. The parts section marked anything else red, the battery fleet did
 *  nothing (DRY audit 2026-10-30, FE6-A6). */
export function positiveCount(raw: string): number | null {
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}
