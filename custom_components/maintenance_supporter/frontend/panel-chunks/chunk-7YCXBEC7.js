/*! maintenance_supporter frontend 2.119.0 */
import{j as T}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6ITCU3EE.js";import{a as k}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FZDD2TTP.js";import{a as A,b as S}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZCPDAFMC.js";import{b as v,e as y,f as x}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GXVIXKKT.js";import{A as g,a as o,b as h,c as a,f as p,i as m,ma as b,n as _,o as r,z as f}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6NL3YWME.js";var n=class extends m{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._check="";this._checked=!0;this._resolve=null;this._promptResolve=null;this._checkResolve=null}_show(e){this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"",this._options=e.options&&e.options.length?e.options:null,this._inputValue=e.inputValue||"",this._check=e.check||"",this._checked=!0,this._resolve=null,this._promptResolve=null,this._checkResolve=null,this._open=!0}confirm(e){return this._show(e),new Promise(s=>this._resolve=s)}confirmWithCheck(e){return this._show(e),new Promise(s=>this._checkResolve=s)}prompt(e){return this._show(e),new Promise(s=>this._promptResolve=s)}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._checkResolve?.({confirmed:!1,checked:!1}),this._checkResolve=null,this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._checkResolve?.({confirmed:!0,checked:this._checked}),this._checkResolve=null,this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return p;let e=f(this.hass);return a`
      <ha-dialog open .headerTitle=${y(this._title)} @closed=${this._cancel}>
        ${x(this._title)}
        <div class="content">
          ${this._message}
          ${this._check?A({cls:"confirm-check",checked:this._checked,onChange:s=>this._checked=s.target.checked},this._check):p}
          ${this._inputLabel?a`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?a`${T({cls:"field-input field-select",onChange:s=>this._inputValue=s.target.value},a`
                    ${this._options.map(s=>a`<option value=${s.value} ?selected=${s.value===this._inputValue}>${s.label}</option>`)}
                  `)}`:a`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${s=>this._inputValue=s.target.value} />`}
            </label>
          `:p}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${g("cancel",e)}
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
    `}};n.styles=[b,h`
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
  `],o([_({attribute:!1})],n.prototype,"hass",2),o([r()],n.prototype,"_open",2),o([r()],n.prototype,"_title",2),o([r()],n.prototype,"_message",2),o([r()],n.prototype,"_confirmText",2),o([r()],n.prototype,"_danger",2),o([r()],n.prototype,"_inputLabel",2),o([r()],n.prototype,"_inputType",2),o([r()],n.prototype,"_options",2),o([r()],n.prototype,"_inputValue",2),o([r()],n.prototype,"_check",2),o([r()],n.prototype,"_checked",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",n);var w="maintenance-confirm-dialog",C="data-ms-lovelace-confirm";function E(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function P(t){let i=E(),e=i.querySelector(`${w}[${C}]`);return e||(e=document.createElement(w),e.setAttribute(C,""),i.appendChild(e)),e.hass=t,e}function K(t,i){return P(t).confirm(i)}var O=class{constructor(){this._handle=null}schedule(i,e=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,i()},e)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}};function U(t,i,e){t.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:i,...e?{action:e}:{},duration:e?7e3:4e3},bubbles:!0,composed:!0}))}var d={operatorWriteEnabled:!1,operatorIds:[]};function Y(t,i=d){return t?t.is_admin?!0:i.operatorWriteEnabled&&i.operatorIds.includes(t.id):!1}var $=["buttons_compact","buttons","icons"];function L(t){let[i,e]=S.default_warning_days,s=t?.general?.default_warning_days,l={...u.features,...t?.features??{}};return{features:l,defaultWarningDays:typeof s=="number"&&Number.isFinite(s)&&s>=i&&s<=e?s:u.defaultWarningDays,rowActionStyle:I(t?.general?.row_action_style,t?.general?.row_action_style_set,l.beta_editor),access:{operatorWriteEnabled:t?.operator_write_enabled===!0,operatorIds:Array.isArray(t?.admin_panel_user_ids)?t.admin_panel_user_ids.filter(c=>typeof c=="string"):[]},budget:t?.budget??null,rowActionNoticePending:t?.general?.row_action_notice_pending===!0,refsInLists:t?.general?.ref_numbers_in_lists===!0,objectsTableColumns:Array.isArray(t?.objects_table_columns)?t.objects_table_columns:void 0,partsCostMode:k(t?.budget?.parts_cost_mode),mirrorTodoDefault:Array.isArray(t?.general?.mirror_todo_default_entities)?t.general.mirror_todo_default_entities.filter(c=>typeof c=="string"&&c!==""):[]}}function I(t,i,e){return i===!1&&e?"icons":$.includes(t??"")?t:u.rowActionStyle}var u={features:{adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact",access:d,budget:null,rowActionNoticePending:!1,refsInLists:!1,objectsTableColumns:void 0,partsCostMode:"purchase",mirrorTodoDefault:[]};function R(){let t=window;return t.__msSettingsCache??={promise:null}}function te(t){let i=R();if(i.promise)return i.promise;let e=t.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(s=>{let l=L(s);return v(l.features.beta_editor),l}).catch(()=>(i.promise===e&&(i.promise=null),u));return i.promise=e,e}function se(){R().promise=null}export{P as a,K as b,O as c,U as d,d as e,Y as f,$ as g,L as h,I as i,te as j,se as k};
