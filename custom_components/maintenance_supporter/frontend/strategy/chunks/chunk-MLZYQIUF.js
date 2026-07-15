import{a as r}from"./chunk-XJVTMRPN.js";var a=r`
  ha-card { overflow: hidden; }
  .card-content {
    padding: 16px;
    display: flex; flex-direction: column;
    gap: 12px;
  }
  .header {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px;
  }
  .title {
    display: flex; align-items: center; gap: 8px;
    font-size: 16px; font-weight: 500;
  }
  .emoji { font-size: 20px; }

  /* Button family — primary action / muted-saved-state / link / icon-with-text */
  .btn {
    padding: 6px 12px; font-size: 13px;
    border-radius: 6px; cursor: pointer;
    border: 1px solid var(--divider-color);
    background: var(--secondary-background-color, transparent);
    color: var(--primary-text-color);
    font-weight: 500;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .btn:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
  .btn[disabled] { opacity: 0.5; cursor: not-allowed; }
  .btn.primary {
    background: var(--primary-color);
    color: var(--text-primary-color, white);
    border-color: var(--primary-color);
  }
  .btn.primary[disabled] { opacity: 0.6; }
  .btn.muted {
    background: transparent;
    color: var(--secondary-text-color);
    border-style: dashed;
  }
  .btn.muted[disabled] { opacity: 1; cursor: default; }
  .btn.muted ha-icon, .btn.primary ha-icon { --mdc-icon-size: 14px; }
  .btn.link {
    background: transparent; border: none; padding: 6px 4px;
    color: var(--primary-color); margin-left: auto;
  }
  .btn.link:hover { background: transparent; text-decoration: underline; }

  /* Error + loading states */
  .error {
    padding: 8px; border-radius: 6px;
    background: rgba(211, 47, 47, 0.1);
    color: var(--error-color, #d32f2f); font-size: 13px;
  }
  .loading {
    padding: 24px; text-align: center;
    color: var(--secondary-text-color);
  }
`;export{a};
