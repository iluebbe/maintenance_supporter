/*! maintenance_supporter frontend 2.120.0 */
import{a as c,b as p}from"./chunk-RSK3UQBO.js";import{G as m,L as v,a as u,d as s,g as o,i as h}from"./chunk-MD5RW5PH.js";import{a,l}from"./chunk-7ZPVRRJE.js";function g(t){let n=(t??"").trim();if(n==="")return null;let e=Number(n.replace(",","."));return!Number.isFinite(e)||e<0?null:Math.round(e)}var i=class extends h{constructor(){super(...arguments);this.value="";this.lang="en";this._credit=!1;this._amount=""}willUpdate(e){if(!e.has("value"))return;let r=(this.value??"").trim();if(r===this._signed())return;let d=parseFloat(r);if(r===""||Number.isNaN(d)){this._amount="",this._credit=!1;return}this._credit=d<0,this._amount=String(Math.abs(d))}_signed(){let e=this._amount.trim();return e===""?"":this._credit?`-${e}`:e}_emit(){this.value=this._signed(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setCredit(e){this._credit!==e&&(this._credit=e,this._emit())}_onInput(e){let r=e.target.value;r.startsWith("-")&&(this._credit=!0),this._amount=r.replace(/^-+/,""),this._emit()}render(){let e=this.lang;return s`
      <div class="wrap">
        <div class="sign" role="group">
          <button type="button" class="kind cost ${this._credit?"":"on"}" aria-pressed=${String(!this._credit)}
            @click=${()=>this._setCredit(!1)}>${l("cost",e)}</button>
          <button type="button" class="kind credit ${this._credit?"on":""}" aria-pressed=${String(this._credit)}
            @click=${()=>this._setCredit(!0)}>${l("cost_kind_credit",e)}</button>
        </div>
        <input type="number" step="0.01" min="0" inputmode="decimal" class="field-input amount"
          .value=${this._amount} @input=${this._onInput} />
      </div>
      ${this._credit?s`<div class="hint">${l("cost_credit_hint",e)}</div>`:o}
    `}};i.styles=[m,u`
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
    `],a([c()],i.prototype,"value",2),a([c()],i.prototype,"lang",2),a([p()],i.prototype,"_credit",2),a([p()],i.prototype,"_amount",2);customElements.get("ms-cost-input")||customElements.define("ms-cost-input",i);function w(t,n){return v("ha-expansion-panel")?s`
      <ha-expansion-panel class=${t.cls??""} outlined .expanded=${!!t.open}
        @expanded-changed=${e=>{e.target===e.currentTarget&&t.onToggle?.(e.detail.expanded)}}>
        <div slot="header" class=${t.headerCls??"collapsible-header"}>${t.header}</div>
        ${n}
      </ha-expansion-panel>`:s`<details class=${t.cls??""} ?open=${!!t.open}
    @toggle=${t.onToggle?e=>t.onToggle(e.target.open):o}><summary class=${t.headerCls??o}>${t.header}</summary>${n}</details>`}export{g as a,w as b};
