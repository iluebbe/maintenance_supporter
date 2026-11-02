/*! maintenance_supporter frontend 2.117.0 */
import{G as C,L as $,M as O,N as P,a as f,b as o,d as u,e as n,f as k,g as b,h as p,i as a}from"./chunk-IXKGC4CR.js";import{a as r,k as R,l as E}from"./chunk-U66ATMTJ.js";var Q={default_warning_days:[0,365],default_consumable_threshold:[1,90],battery_low_percent:[1,90],battery_recovered_percent:[20,100],battery_low_delay_minutes:[0,1440],archive_oneoff_days:[0,3650],delete_archived_oneoff_days:[0,3650],notify_due_soon_interval_hours:[0,720],notify_overdue_interval_hours:[0,720],notify_triggered_interval_hours:[0,720],max_notifications_per_day:[0,1e3],notification_bundle_threshold:[2,20],snooze_duration_hours:[1,168],warranty_reminder_days:[1,365],budget_alert_threshold:[10,100],currency_decimals:[0,3]};var j=[0,14],K=[0,1440],X=[1,1e4],J=[0,365],Z=15,ee=[.1,.9],te=[0,365],ie=[.01,1e4],se=[.01,1e5];var h={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},_=e=>(...i)=>({_$litDirective$:e,values:i}),d=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,t,s){this._$Ct=i,this._$AM=t,this._$Ci=s}_$AS(i,t){return this.update(i,t)}update(i,t){return this.render(...t)}};var{I:le}=k;var g=e=>e.strings===void 0;var U={},w=(e,i=U)=>e._$AH=i;var G=_(class extends d{constructor(e){if(super(e),e.type!==h.PROPERTY&&e.type!==h.ATTRIBUTE&&e.type!==h.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!g(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[i]){if(i===u||i===n)return i;let t=e.element,s=e.name;if(e.type===h.PROPERTY){if(i===t[s])return u}else if(e.type===h.BOOLEAN_ATTRIBUTE){if(!!i===t.hasAttribute(s))return u}else if(e.type===h.ATTRIBUTE&&t.getAttribute(s)===i+"")return u;return w(e),i}});var m=(e,i)=>{let t=e._$AN;if(t===void 0)return!1;for(let s of t)s._$AO?.(i,!1),m(s,i);return!0},A=e=>{let i,t;do{if((i=e._$AM)===void 0)break;t=i._$AN,t.delete(e),e=i}while(t?.size===0)},N=e=>{for(let i;i=e._$AM;e=i){let t=i._$AN;if(t===void 0)i._$AN=t=new Set;else if(t.has(e))break;t.add(e),M(i)}};function D(e){this._$AN!==void 0?(A(this),this._$AM=e,N(this)):this._$AM=e}function Y(e,i=!1,t=0){let s=this._$AH,T=this._$AN;if(T!==void 0&&T.size!==0)if(i)if(Array.isArray(s))for(let v=t;v<s.length;v++)m(s[v],!1),A(s[v]);else s!=null&&(m(s,!1),A(s));else m(this,e)}var M=e=>{e.type==h.CHILD&&(e._$AP??=Y,e._$AQ??=D)},x=class extends d{constructor(){super(...arguments),this._$AN=void 0}_$AT(i,t,s){super._$AT(i,t,s),N(this),this.isConnected=i._$AU}_$AO(i,t=!0){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),t&&(m(this,i),A(this))}setValue(i){if(g(this._$Ct))this._$Ct._$AI(i,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=i,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}};var y=new WeakMap,L=_(class extends x{render(e){return n}update(e,[i]){let t=i!==this.G;return t&&this.G!==void 0&&this.rt(void 0),(t||this.lt!==this.ct)&&(this.G=i,this.ht=e.options?.host,this.rt(this.ct=e.element)),n}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){let i=this.ht??globalThis,t=y.get(i);t===void 0&&(t=new WeakMap,y.set(i,t)),t.get(this.G)!==void 0&&this.G.call(this.ht,void 0),t.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?y.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var S="__ms_empty__",I=e=>e===""?S:e,c=class extends b{constructor(){super(...arguments);this.label="";this.value=void 0;this.disabled=!1;this.helper="";this._options=[];this._selected="";this._observer=null}connectedCallback(){super.connectedCallback(),this._read(),this._observer=new MutationObserver(()=>this._read()),this._observer.observe(this,{childList:!0,subtree:!0,characterData:!0,attributes:!0})}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect(),this._observer=null}_read(){let t=[...this.querySelectorAll("option")];this._options=t.map(s=>({value:I(s.value),label:(s.textContent??"").replace(/\s+/g," ").trim()})),this._selected=t.find(s=>s.hasAttribute("selected")||s.selected)?.value??t[0]?.value??""}_picked(t){t.stopPropagation(),this.value=t.detail.value===S?"":t.detail.value,this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){return o`
      <ha-select
        .label=${this.label}
        .helper=${this.helper}
        .options=${this._options}
        .value=${I(this.value??this._selected)}
        .disabled=${this.disabled}
        @selected=${this._picked}
      ></ha-select>`}};c.styles=f`
    :host { display: block; }
    ha-select { display: block; width: 100%; }
  `,r([p()],c.prototype,"label",2),r([p()],c.prototype,"value",2),r([p({type:Boolean})],c.prototype,"disabled",2),r([p()],c.prototype,"helper",2),r([a()],c.prototype,"_options",2),r([a()],c.prototype,"_selected",2);customElements.get("ms-ha-select")||customElements.define("ms-ha-select",c);function W(){return $("ha-select")}function H(e,i){if(W())return o`<ms-ha-select class=${e.cls??n} .label=${e.label??""} .value=${e.value} .disabled=${!!e.disabled}
      @change=${e.onChange}>${i}</ms-ha-select>`;if(e.value===void 0)return o`<select class=${e.cls??n} id=${e.id??n} aria-label=${e.label??n} ?disabled=${!!e.disabled}
      @change=${e.onChange}>${i}</select>`;let t=e.value;return o`<select class=${e.cls??n} id=${e.id??n} aria-label=${e.label??n} ?disabled=${!!e.disabled}
    .value=${e.live?G(t):t} @change=${e.onChange}
    ${L(s=>{s instanceof HTMLSelectElement&&queueMicrotask(()=>{s.value!==t&&(s.value=t)})})}>${i}</select>`}function B(e,i){if($("ha-checkbox")){let s=o`<ha-checkbox .checked=${e.checked} .disabled=${!!e.disabled} @change=${e.onChange}>${i}</ha-checkbox>`;return e.cls?o`<span class=${e.cls}>${s}</span>`:s}let t=o`<input type="checkbox" class=${e.inputCls??n} .checked=${e.checked} ?disabled=${!!e.disabled} @change=${e.onChange} />`;return e.boxAfter?o`<label class=${e.cls??n}>${i}${t}</label>`:o`<label class=${e.cls??n}>${t}${i}</label>`}var l=class extends b{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._check="";this._checked=!0;this._resolve=null;this._promptResolve=null;this._checkResolve=null}_show(t){this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel=t.inputLabel||"",this._inputType=t.inputType||"",this._options=t.options&&t.options.length?t.options:null,this._inputValue=t.inputValue||"",this._check=t.check||"",this._checked=!0,this._resolve=null,this._promptResolve=null,this._checkResolve=null,this._open=!0}confirm(t){return this._show(t),new Promise(s=>this._resolve=s)}confirmWithCheck(t){return this._show(t),new Promise(s=>this._checkResolve=s)}prompt(t){return this._show(t),new Promise(s=>this._promptResolve=s)}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._checkResolve?.({confirmed:!1,checked:!1}),this._checkResolve=null,this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._checkResolve?.({confirmed:!0,checked:this._checked}),this._checkResolve=null,this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return n;let t=R(this.hass);return o`
      <ha-dialog open .headerTitle=${O(this._title)} @closed=${this._cancel}>
        ${P(this._title)}
        <div class="content">
          ${this._message}
          ${this._check?B({cls:"confirm-check",checked:this._checked,onChange:s=>this._checked=s.target.checked},this._check):n}
          ${this._inputLabel?o`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?o`${H({cls:"field-input field-select",onChange:s=>this._inputValue=s.target.value},o`
                    ${this._options.map(s=>o`<option value=${s.value} ?selected=${s.value===this._inputValue}>${s.label}</option>`)}
                  `)}`:o`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${s=>this._inputValue=s.target.value} />`}
            </label>
          `:n}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${E("cancel",t)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            variant=${this._danger?"danger":"brand"}
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};l.styles=[C,f`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* shared native-field scaffold from nativeFieldStyles; the prompt input
       follows the message text, hence the extra top margin here */
    .field { margin-top: 12px; }
    .confirm-check { display: flex; align-items: center; gap: 8px; cursor: pointer; }
    .content {
      padding: 8px 0;
      min-width: 280px;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    ha-textfield {
      display: block;
    }
    ha-button.danger {
      --mdc-theme-primary: var(--error-color, #f44336);
    }
  `],r([p({attribute:!1})],l.prototype,"hass",2),r([a()],l.prototype,"_open",2),r([a()],l.prototype,"_title",2),r([a()],l.prototype,"_message",2),r([a()],l.prototype,"_confirmText",2),r([a()],l.prototype,"_danger",2),r([a()],l.prototype,"_inputLabel",2),r([a()],l.prototype,"_inputType",2),r([a()],l.prototype,"_options",2),r([a()],l.prototype,"_inputValue",2),r([a()],l.prototype,"_check",2),r([a()],l.prototype,"_checked",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",l);var F="maintenance-confirm-dialog",V="data-ms-lovelace-confirm";function z(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function q(e){let i=z(),t=i.querySelector(`${F}[${V}]`);return t||(t=document.createElement(F),t.setAttribute(V,""),i.appendChild(t)),t.hass=e,t}function Ke(e,i){return q(e).confirm(i)}export{Q as a,j as b,K as c,X as d,J as e,Z as f,ee as g,te as h,ie as i,se as j,L as k,W as l,H as m,B as n,q as o,Ke as p};
/*! Bundled license information:

lit-html/directive.js:
lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
lit-html/directives/live.js:
lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
