/** A reusable part's waiting pile in words (#208): "2 charging", "1 to
 *  sharpen" — the parts list and the battery fleet's charging row share it.
 *  The fleet's copy printed the count with raw digits, the parts list in the
 *  viewer's number format (DRY audit 2026-10-12). */
import { formatNumber, t } from "../styles";

export function reuseWaitingText(reuse: string, count: number, lang: string): string {
  return t(`part_waiting_${reuse}`, lang).replace("{count}", formatNumber(count, lang));
}
