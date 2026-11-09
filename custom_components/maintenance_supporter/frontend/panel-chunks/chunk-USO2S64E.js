/*! maintenance_supporter frontend 2.120.0 */
import{b as d,c as l}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BVOMQN6J.js";import{a as r,b as u,e as a,h as p,k as m,la as h,z as n}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VGLEFN6D.js";function v(c){let s=(c??"").trim();if(s==="")return null;let t=Number(s.replace(",","."));return!Number.isFinite(t)||t<0?null:Math.round(t)}var i=class extends m{constructor(){super(...arguments);this.value="";this.lang="en";this._credit=!1;this._amount=""}willUpdate(t){if(!t.has("value"))return;let e=(this.value??"").trim();if(e===this._signed())return;let o=parseFloat(e);if(e===""||Number.isNaN(o)){this._amount="",this._credit=!1;return}this._credit=o<0,this._amount=String(Math.abs(o))}_signed(){let t=this._amount.trim();return t===""?"":this._credit?`-${t}`:t}_emit(){this.value=this._signed(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setCredit(t){this._credit!==t&&(this._credit=t,this._emit())}_onInput(t){let e=t.target.value;e.startsWith("-")&&(this._credit=!0),this._amount=e.replace(/^-+/,""),this._emit()}render(){let t=this.lang;return a`
      <div class="wrap">
        <div class="sign" role="group">
          <button type="button" class="kind cost ${this._credit?"":"on"}" aria-pressed=${String(!this._credit)}
            @click=${()=>this._setCredit(!1)}>${n("cost",t)}</button>
          <button type="button" class="kind credit ${this._credit?"on":""}" aria-pressed=${String(this._credit)}
            @click=${()=>this._setCredit(!0)}>${n("cost_kind_credit",t)}</button>
        </div>
        <input type="number" step="0.01" min="0" inputmode="decimal" class="field-input amount"
          .value=${this._amount} @input=${this._onInput} />
      </div>
      ${this._credit?a`<div class="hint">${n("cost_credit_hint",t)}</div>`:p}
    `}};i.styles=[h,u`
      :host { display: block; }
      .wrap { display: flex; gap: 8px; align-items: stretch; }
      .sign {
        display: inline-flex;
        flex: none;
        border: 1px solid var(--divider-color);
        border-radius: var(--ms-radius-6, 6px);
        overflow: hidden;
      }
      .kind {
        font: inherit;
        font-size: 13px;
        padding: 0 10px;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
      }
      .kind.on { background: var(--primary-color); color: var(--text-primary-color, #fff); }
      .kind.credit.on { background: var(--success-color, #4caf50); }
      .amount { flex: 1; min-width: 0; }
      .hint { margin-top: 4px; font-size: 12px; color: var(--secondary-text-color); }
    `],r([d()],i.prototype,"value",2),r([d()],i.prototype,"lang",2),r([l()],i.prototype,"_credit",2),r([l()],i.prototype,"_amount",2);customElements.get("ms-cost-input")||customElements.define("ms-cost-input",i);export{v as a};
