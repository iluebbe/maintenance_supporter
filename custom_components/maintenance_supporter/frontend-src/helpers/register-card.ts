/** Register a card in HA's Lovelace card picker (`window.customCards`).
 *
 * One implementation for the five bundles that hand-rolled the push — only
 * the calendar card deduplicated, so a double bundle-load (panel + card
 * resource both configured) added duplicate picker entries for the rest.
 *
 * HA's custom-card resolver maps ``custom:X`` → element tag ``X``, so `type`
 * MUST be the exact custom-element name.
 */

interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
}

/** The registered card-picker entries — read (and localized in place) by
 *  helpers/picker-i18n.ts; this module stays the only one touching the list. */
export function registeredCustomCards(): CustomCardEntry[] {
  return (window as unknown as { customCards?: CustomCardEntry[] }).customCards ?? [];
}

export function registerCustomCard(entry: CustomCardEntry): void {
  const w = window as unknown as { customCards?: CustomCardEntry[] };
  w.customCards = w.customCards || [];
  if (!w.customCards.some((c) => c.type === entry.type)) {
    w.customCards.push(entry);
  }
}
