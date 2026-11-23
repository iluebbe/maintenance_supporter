/** Calendar tab / card styles — shared between panel-styles.ts and the
 *  standalone maintenance-supporter-calendar-card.
 *
 *  Extracted from panel-styles.ts in v1.9.0 so the new Lovelace card can
 *  render identically to the panel's Calendar tab without dragging in the
 *  full panel CSS.
 */

import { css } from "lit";

export const calendarStyles = css`
  .cal-controls {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    padding: 12px 16px;
    border-bottom: 1px solid var(--divider-color);
    /* The card may be a 350 px column on a 1440 px screen: what follows
       goes by the card's width, not the window's. */
    container-type: inline-size;
  }
  .cal-window-chips {
    display: flex;
    gap: 4px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border-radius: 999px;
    padding: 3px;
  }
  .cal-window-chip {
    padding: 6px 14px;
    border: none;
    background: transparent;
    color: var(--secondary-text-color);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 999px;
    transition: background 0.12s, color 0.12s;
  }
  .cal-window-chip:hover { color: var(--primary-text-color); }
  .cal-window-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  /* v2.2.0 — past-window chips: visually distinguished from forward chips
     so the user grasps the time-direction switch at a glance. Uses a
     muted secondary tone instead of the primary blue. v2.3.x: explicit
     "−N d" / "+N d" prefixes + dot separator so past vs forward groups
     read at a glance instead of being two pill rows that look identical
     except for a small arrow. (User feedback: *"das −30 und die + sind
     noch schlecht angeordnet"*.) */
  .cal-past-chips {
    /* margin-right replaced by explicit separator below */
  }
  .cal-past-chip.active {
    background: var(--secondary-text-color, #888);
  }
  /* A hairline between the past and the forward windows. It was a dot the
     size of a full stop, which read as a stray character, most of all
     alone at the end of the first line on a phone. */
  .cal-chip-separator {
    align-self: center;
    width: 1px;
    height: 18px;
    margin: 0 2px;
    background: var(--divider-color);
  }
  .cal-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-left: auto;
    min-width: 0;
  }
  .cal-filters .cal-user-filter { margin-left: 0; }
  /* The filters as the task list's Group by / Sort by chips (panel-styles
     .ms-chip), with Home Assistant's menu: they were the browser's own
     selects, the only controls on the tab that were not HA's. */
  .cal-filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    height: 32px;
    padding: 0 6px 0 12px;
    box-sizing: border-box;
    border: 1px solid var(--outline-color, var(--divider-color));
    border-radius: 10px;
    background: transparent;
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
  }
  .cal-filter-chip span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .cal-filter-chip ha-icon { --mdc-icon-size: 18px; flex: none; color: var(--secondary-text-color); }
  .cal-filter-chip:hover { background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .cal-filter-chip:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .cal-filter-chip.active {
    border-color: transparent;
    background: color-mix(in srgb, var(--primary-color) 15%, transparent);
  }
  .cal-filter-chip.active ha-icon { color: var(--primary-color); }
  .cal-filter-menu { min-width: 0; max-width: 100%; }
  .cal-filter-menu ha-dropdown-item.selected { font-weight: 600; }
  @container (max-width: 560px) {
    .cal-chip-separator { display: none; }
    .cal-filters { margin-left: 0; width: 100%; }
  }
  .cal-user-filter {
    margin-left: auto;
    padding: 6px 10px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--ms-radius-6, 6px);
    font-size: 13px;
    cursor: pointer;
  }
  .cal-rolling { padding: 8px 16px 32px; container-type: inline-size; }
  .cal-day-row {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--divider-color);
  }
  .cal-day-pill {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border: 1px solid var(--divider-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cal-day-pill.cal-today {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }
  .cal-pill-weekday {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
  }
  .cal-pill-day {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-text-color);
    line-height: 1.1;
  }
  .cal-day-pill.cal-today .cal-pill-weekday,
  .cal-day-pill.cal-today .cal-pill-day {
    color: var(--text-primary-color, #fff);
  }
  .cal-day-content { flex: 1; min-width: 0; }
  .cal-day-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 6px;
  }
  .cal-day-month { color: var(--secondary-text-color); font-size: 13px; }
  .cal-day-today-badge {
    color: var(--primary-color);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .cal-empty {
    color: var(--secondary-text-color);
    font-size: 13px;
    font-style: italic;
    padding: 4px 0 4px;
  }
  .cal-event {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.12s;
  }
  .cal-event:hover { background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .cal-event-projected { opacity: 0.55; }
  .cal-event-body { flex: 1; min-width: 0; }
  .cal-event-title {
    font-size: 14px;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cal-event-recur {
    display: block;
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }
  .cal-event-icon {
    --mdc-icon-size: 18px;
    flex-shrink: 0;
  }
  .cal-source-time   { color: var(--secondary-text-color); }
  .cal-source-sensor { color: var(--primary-color); }
  .cal-event-prediction {
    display: inline-block;
    /* One line: wrapped inside its pill it read as two stacked labels. */
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top;
    font-size: 11px;
    margin-top: 2px;
    padding: 1px 6px;
    border-radius: 999px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border: 1px solid var(--divider-color);
  }
  .cal-conf-high   { color: var(--success-color, #4caf50); border-color: #4caf5044; }
  .cal-conf-medium { color: var(--warning-color, #f9a825); border-color: #f9a82544; }
  .cal-conf-low    { color: var(--error-color, #d32f2f); border-color: #d32f2f44; }
  .cal-event-cost {
    font-size: 12px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }
  .cal-status-pill {
    flex-shrink: 0;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #fff;
  }
  /* The status as its icon: shown instead of the word on a narrow card. */
  .cal-state-icon { display: none; --mdc-icon-size: 16px; }
  /* Same tokens as .status-badge (status-constants.ts) — the calendar used
     to keep its own palette (triggered was even BLUE here) so identical
     statuses wore different colors per view, and none followed the theme. */
  .cal-status-overdue   { background: var(--error-color, #f44336); }
  .cal-status-triggered { background: var(--deep-orange-color, #ff5722); }
  .cal-status-due_soon  { background: var(--warning-color, #ff9800); color: #000; }
  /* Dark text — white on green is only 2.8:1 (below the 3:1 UI floor). */
  .cal-status-ok        { background: var(--success-color, #4caf50); color: #000; }

  /* A narrow card (a phone, a dashboard column): "Object · Task" on one
     line showed the object and cut the task, so four tasks of one
     dishwasher read as four identical rows. The task leads on its own line
     and may wrap; the object and the overdue days follow underneath. */
  @container (max-width: 560px) {
    .cal-event-title {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      column-gap: 4px;
      overflow: visible;
      white-space: normal;
    }
    .cal-event-sep { display: none; }
    /* A line of its own, before the object it follows in the markup. */
    .cal-event-task { order: -1; flex: 1 1 100%; min-width: 0; overflow-wrap: anywhere; }
    .cal-event-object, .cal-event-due {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    /* The overdue days stay whole: beside the object where both fit, on
       the next line where they do not. In the status' red, without the
       brackets that set them off on one line. */
    .cal-event-object { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .cal-event-due { flex: none; color: var(--error-color, #f44336); }
    .cal-paren { display: none; }
    /* The status as a disc with its icon, like the task list's rows on a
       phone: the word took 76 px of a 286 px row and left the text 170. */
    .cal-status-pill { padding: 3px; border-radius: 50%; line-height: 0; }
    .cal-state-label { display: none; }
    .cal-state-icon { display: block; }
    /* The sensor icon in front already says "predicted". */
    .cal-pred-word { display: none; }
  }

  @media (max-width: 600px) {
    .cal-controls { padding: 10px 12px; }
    .cal-rolling { padding: 6px 12px 24px; }
    .cal-day-pill { width: 48px; height: 48px; }
    .cal-pill-day { font-size: 17px; }
    .cal-user-filter { margin-left: 0; width: 100%; }
  }
`;
