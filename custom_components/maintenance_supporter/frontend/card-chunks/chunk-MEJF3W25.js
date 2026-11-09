/*! maintenance_supporter frontend 2.120.0 */
import{b as x}from"/maintenance_supporter_cardfiles/card-chunks/chunk-ZZNJQY3S.js";import{a as b,b as k}from"/maintenance_supporter_cardfiles/card-chunks/chunk-5CBZDBOA.js";import{a as _}from"/maintenance_supporter_cardfiles/card-chunks/chunk-HQ6KDNQY.js";import{a as u,b as a}from"/maintenance_supporter_cardfiles/card-chunks/chunk-R4OGP3RP.js";import{a as l,b as r,e as n,h as p,ha as m,j as c,la as v,ma as f,na as g,w as d,x as h}from"/maintenance_supporter_cardfiles/card-chunks/chunk-2JUL7K7P.js";var H=r`
  ${k}
  .modal-layer {
    display: block;
    z-index: var(--ms-modal-z, 100);
  }
  .backdrop {
    position: fixed; inset: 0; z-index: var(--ms-modal-z, 100);
    background: rgba(0,0,0,0.5);
  }
  .dialog {
    position: fixed; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 95vw; max-width: var(--ms-modal-max-width, 480px);
    max-height: var(--ms-modal-max-height, 92vh); overflow: auto;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    color: var(--primary-text-color);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    padding: 20px;
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
    z-index: calc(var(--ms-modal-z, 100) + 1);
  }
  /* The beta UI's body inside ha-adaptive-dialog: the frame's column. */
  .ha-shell-body {
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
  }
  /* Focused programmatically on open (so Escape works at once) — no ring. */
  .dialog:focus { outline: none; }
  /* The one part that shrinks and scrolls (min-height: 0); the header and the
     buttons around it keep their content's height. */
  .dialog-scroll {
    flex: 1 1 auto; min-height: 0;
    overflow-y: auto; overscroll-behavior: contain;
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
  }
`;function R(i,s){i.key!=="Escape"||i.defaultPrevented||i.composedPath().some(e=>e instanceof Element&&e.localName==="ms-camera-capture")||(i.preventDefault(),i.stopPropagation(),s())}function w(){return v("ha-adaptive-dialog")}function S(i,s,e={}){return w()?n`
      <ha-adaptive-dialog open .headerTitle=${e.title}
        @closed=${t=>{t.target===t.currentTarget&&i()}}>
        <div class="ha-shell-body">${s}</div>
      </ha-adaptive-dialog>
    `:n`
    <div class="modal-layer top-layer" popover="manual" ${b}>
      <div class="backdrop" @click=${i}></div>
      <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
        @keydown=${t=>R(t,i)}>${s}</div>
    </div>
  `}function A(i){i?.querySelector(".dialog")?.focus({preventScroll:!0})}var o=class extends c{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._check="";this._checked=!0;this._resolve=null;this._promptResolve=null;this._checkResolve=null}_show(e){this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"",this._options=e.options&&e.options.length?e.options:null,this._inputValue=e.inputValue||"",this._check=e.check||"",this._checked=!0,this._resolve=null,this._promptResolve=null,this._checkResolve=null,this._open=!0}confirm(e){return this._show(e),new Promise(t=>this._resolve=t)}confirmWithCheck(e){return this._show(e),new Promise(t=>this._checkResolve=t)}prompt(e){return this._show(e),new Promise(t=>this._promptResolve=t)}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._checkResolve?.({confirmed:!1,checked:!1}),this._checkResolve=null,this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._checkResolve?.({confirmed:!0,checked:this._checked}),this._checkResolve=null,this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return p;let e=d(this.hass);return n`
      <ha-dialog open .headerTitle=${f(this._title)} @closed=${this._cancel}>
        ${g(this._title)}
        <div class="content">
          ${this._message}
          ${this._check?_({cls:"confirm-check",checked:this._checked,onChange:t=>this._checked=t.target.checked},this._check):p}
          ${this._inputLabel?n`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?n`${x({cls:"field-input field-select",onChange:t=>this._inputValue=t.target.value},n`
                    ${this._options.map(t=>n`<option value=${t.value} ?selected=${t.value===this._inputValue}>${t.label}</option>`)}
                  `)}`:n`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${t=>this._inputValue=t.target.value} />`}
            </label>
          `:p}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${h("cancel",e)}
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
    `}};o.styles=[m,r`
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
  `],l([u({attribute:!1})],o.prototype,"hass",2),l([a()],o.prototype,"_open",2),l([a()],o.prototype,"_title",2),l([a()],o.prototype,"_message",2),l([a()],o.prototype,"_confirmText",2),l([a()],o.prototype,"_danger",2),l([a()],o.prototype,"_inputLabel",2),l([a()],o.prototype,"_inputType",2),l([a()],o.prototype,"_options",2),l([a()],o.prototype,"_inputValue",2),l([a()],o.prototype,"_check",2),l([a()],o.prototype,"_checked",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",o);var y="maintenance-confirm-dialog",$="data-ms-lovelace-confirm";function T(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function E(i){let s=T(),e=s.querySelector(`${y}[${$}]`);return e||(e=document.createElement(y),e.setAttribute($,""),s.appendChild(e)),e.hass=i,e}function U(i,s){return E(i).confirm(s)}export{H as a,w as b,S as c,A as d,E as e,U as f};
