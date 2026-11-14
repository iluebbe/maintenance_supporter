/*! maintenance_supporter frontend 2.121.0 */
import{a as n}from"./chunk-SMVUWZLJ.js";function i(a,t){let r=a,e=t;if(r===e||r.states===e.states)return!1;for(let o of new Set([...Object.keys(r),...Object.keys(e)]))if(o!=="states"&&r[o]!==e[o])return!1;return!0}var s=class{constructor(t){this.host=t;this._timer=0;this._lastDraw=0;t.addController(this)}hold(t){if(!this.host.hasUpdated||t.size!==1||!t.has("hass"))return!1;let r=t.get("hass"),e=this.host.hass,o=1e3-(performance.now()-this._lastDraw);return!r||!e||o<=0||!i(r,e)?!1:(this._held??=r,this._timer||(this._timer=window.setTimeout(()=>{this._timer=0,this.host.requestUpdate()},o)),!0)}release(t){this._held&&(t.has("hass")||t.set("hass",this._held),this._held=void 0),this._timer&&(clearTimeout(this._timer),this._timer=0)}hostUpdated(){this._lastDraw=performance.now()}};function c(a){let t=window;t.customCards=t.customCards||[],t.customCards.some(r=>r.type===a.type)||t.customCards.push(a)}var u=n`
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
    border-radius: var(--ms-radius-6, 6px); cursor: pointer;
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
    padding: 8px; border-radius: var(--ms-radius-6, 6px);
    background: rgba(211, 47, 47, 0.1);
    color: var(--error-color, #d32f2f); font-size: 13px;
  }
  .loading {
    padding: 24px; text-align: center;
    color: var(--secondary-text-color);
  }
`;export{s as a,c as b,u as c};
