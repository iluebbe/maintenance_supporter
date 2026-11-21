/**
 * A row of weekday chips (0 = Monday … 6 = Sunday), each a toggle button.
 * The task dialog's "Weekdays" schedule, the weekend's quiet hours (D#277)
 * and the rotation's days (D#284) pick days the same way.
 */

import { css, html, type TemplateResult } from "lit";
import { weekdayName } from "../styles";

/** Short localized weekday names, Monday first. */
export function weekdayShortNames(lang?: string): string[] {
  return Array.from({ length: 7 }, (_, i) => weekdayName(i, lang, "short"));
}

export interface WeekdayChipsOptions {
  lang?: string;
  selected: readonly number[];
  onToggle: (day: number) => void;
  /** Extra class on the row, for a surface's own selectors. */
  cls?: string;
  /** The row's accessible name. */
  label?: string;
  /** Days that cannot be picked here (taken elsewhere). */
  disabled?: readonly number[];
}

export function weekdayChips(opts: WeekdayChipsOptions): TemplateResult {
  const names = weekdayShortNames(opts.lang);
  return html`
    <div class="weekday-chips ${opts.cls ?? ""}" role="group" aria-label=${opts.label ?? ""}>
      ${names.map((name, day) => {
        const on = opts.selected.includes(day);
        return html`
          <button
            type="button"
            class="weekday-chip ${on ? "selected" : ""}"
            data-day=${day}
            aria-pressed=${on ? "true" : "false"}
            ?disabled=${!!opts.disabled?.includes(day)}
            @click=${() => opts.onToggle(day)}
          >${name}</button>`;
      })}
    </div>`;
}

/** The chips' look; each surface adds it to its own styles. */
export const weekdayChipStyles = css`
  .weekday-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .weekday-chip {
    padding: 6px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 16px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font-size: 13px;
    cursor: pointer;
  }
  .weekday-chip.selected {
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color, #03a9f4);
  }
  .weekday-chip:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;

/** ``days`` with ``day`` added or taken out, in week order. */
export function toggleWeekday(days: readonly number[], day: number): number[] {
  return days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort((a, b) => a - b);
}
