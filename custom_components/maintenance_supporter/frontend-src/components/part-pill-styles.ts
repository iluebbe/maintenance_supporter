/** The small rounded action of a part row (*Used*, *Bought*): one look for
 *  both, which each kept a copy of it (DRY audit 2026-10-30, FE6-B10). */

import { css } from "lit";

export const partPillStyles = css`
  .part-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font: inherit;
    font-size: 12px;
    font-weight: 400;
    padding: 2px 10px;
    min-height: 28px;
    border-radius: 14px;
    border: 1px solid var(--divider-color, #ccc);
    background: transparent;
    color: var(--secondary-text-color);
    cursor: pointer;
    white-space: nowrap;
  }
  .part-pill:hover,
  .part-pill.confirm {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
  .part-pill ha-icon {
    --mdc-icon-size: 16px;
  }
`;
