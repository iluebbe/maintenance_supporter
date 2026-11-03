/*! maintenance_supporter frontend 2.118.0 */
import{a as p2,b as j2,c as Q2,d as G2,e as K2,f as Y2,g as X2,h as J2,i as C5,j as H5,l as L1}from"./chunk-QCVFYHWI.js";import"./chunk-E42SYC3K.js";import{a as Q1,b as g1,c as G1,d as K1,e as A5,f as J,g as p5}from"./chunk-S2MGQWI3.js";import{c as h1,d as d5,e as P1,f as E1,g as R1,h as v2,i as t1,j as Z1,k as j1,l as w,m as O,n as f,o as l5,p as B1}from"./chunk-IVXDOM5G.js";import{A as i5,B as v1,C as u1,D as M5,E as a5,F as o5,G as x1,H as n5,I as s5,J as k,L as S1,M as M1,N as a1,O as $,a as Z,b as i,c as A1,e as n,g as b,h as v,i as d,j as T1,l as V5,m as e5,n as W1,o as p1,p as h,q as L5,r as U,s as m1,t as c2,u as B,v as U1,w as z1,x as t5,y as c1,z as r5}from"./chunk-KJYOPTJY.js";import{a as o,b as F2,c as I2,d as D2,f as N2,g as N1,k as T,l as e,m as q2,n as W2,p as m2,q as q1,s as $1,t as U2,u as X,v as z2}from"./chunk-5OZMICX2.js";function m5(L){return L.object.parent_entry_id||null}function c5(L){return!L.object.archived&&!L.object.battery_fleet}function D3(L,r){let C=new Map(L.map(M=>[M.entry_id,M])),H=[],V=new Set([r]),t=C.get(r);for(;t;){let M=m5(t);if(!M||V.has(M))break;let a=C.get(M);if(!a)break;V.add(M),H.unshift(a),t=a}return H}function v5(L,r){return[...D3(L,r.entry_id),r].map(C=>C.object.name).join(" \u203A ")}function u5(L,r){let C=new Map;for(let t of L){let M=m5(t);M&&(C.has(M)||C.set(M,[]),C.get(M).push(t.entry_id))}let H=new Set,V=[...C.get(r)??[]];for(;V.length;){let t=V.pop();t===r||H.has(t)||(H.add(t),V.push(...C.get(t)??[]))}return H}var P=class extends b{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(C){let H=C.target.value;this.value=H,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:H}}))}_onHaInput(C){C.stopPropagation(),this.value=C.target.value??"",this.dispatchEvent(new CustomEvent(C.type==="change"?"change":"input",{bubbles:!0,composed:!0,detail:{value:this.value}}))}render(){return!this.multiline&&S1("ha-input")?i`
        <ha-input class="ha-field"
          .label=${this.label}
          .value=${this.value??""}
          .type=${this.type}
          .placeholder=${this.placeholder}
          .hint=${this.helper??""}
          .required=${this.required}
          .disabled=${this.disabled}
          .min=${this.min}
          .max=${this.max}
          .step=${this.step}
          .pattern=${this.pattern}
          @input=${this._onHaInput}
          @change=${this._onHaInput}
        ></ha-input>`:i`
      <label class="field">
        ${this.label?i`<span class="label">${this.label}${this.required?i`<span class="req">*</span>`:n}</span>`:n}
        ${this.multiline?i`
        <textarea
          .value=${this.value??""}
          rows=${this.rows}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @change=${this._onInput}
        ></textarea>`:i`
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??n}
          min=${this.min??n}
          max=${this.max??n}
          pattern=${this.pattern??n}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?i`<span class="helper">${this.helper}</span>`:n}
      </label>
    `}};P.styles=Z`
    :host { display: block; }
    .ha-field { display: block; width: 100%; }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .label {
      font-size: 12px;
      color: var(--secondary-text-color, #888);
      font-weight: 500;
    }
    .req { color: var(--error-color, #f44336); margin-left: 2px; }
    input {
      padding: 8px 10px;
      font-size: 14px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      border-radius: var(--ms-radius-6, 6px);
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      outline: none;
    }
    input:focus {
      border-color: var(--primary-color);
    }
    input:disabled { opacity: 0.5; cursor: not-allowed; }
    textarea {
      padding: 8px 10px;
      font-size: 14px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      border-radius: var(--ms-radius-6, 6px);
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      outline: none;
      resize: vertical;
    }
    textarea:focus { border-color: var(--primary-color); }
    textarea:disabled { opacity: 0.5; cursor: not-allowed; }
    /* The dialogs' .field-help: one help-text style (#216). */
    .helper {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
  `,o([v()],P.prototype,"label",2),o([v()],P.prototype,"value",2),o([v()],P.prototype,"placeholder",2),o([v()],P.prototype,"type",2),o([v({type:Boolean})],P.prototype,"required",2),o([v({type:Boolean})],P.prototype,"disabled",2),o([v()],P.prototype,"step",2),o([v()],P.prototype,"min",2),o([v()],P.prototype,"max",2),o([v()],P.prototype,"pattern",2),o([v()],P.prototype,"helper",2),o([v({type:Boolean})],P.prototype,"multiline",2),o([v({type:Number})],P.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",P);var g=class extends b{constructor(){super(...arguments);this.objects=[];this.placesEnabled=!1;this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._place="";this._remindOnSite=!1;this._entryId=null;this._replacing=!1;this._oldDeviceId="";this._replaceDevice="keep"}get _lang(){return T(this.hass)}openCreate(C=""){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId=C,this._place="",this._remindOnSite=!1,this._replacing=!1,this._error="",this._open=!0}openReplace(C,H){this._entryId=C,this._replacing=!0,this._name=H.name||"",this._oldDeviceId=H.ha_device_id||"",this._haDeviceId="",this._replaceDevice="keep",this._error="",this._open=!0}openEdit(C,H){this._entryId=C,this._name=H.name||"",this._manufacturer=H.manufacturer||"",this._model=H.model||"",this._serialNumber=H.serial_number||"",this._areaId=H.area_id||"",this._installationDate=H.installation_date||"",this._warrantyExpiry=H.warranty_expiry||"",this._documentationUrl=H.documentation_url||"",this._notes=H.notes||"",this._haDeviceId=H.ha_device_id||"",this._parentEntryId=H.parent_entry_id||"",this._place=H.place||"",this._remindOnSite=!!H.remind_on_site,this._replacing=!1,this._error="",this._open=!0}async _replace(){if(this._loading||!this._entryId)return;let C={type:"maintenance_supporter/object/replace",entry_id:this._entryId,name:this._name.trim()||null};this._oldDeviceId?(this._replaceDevice==="other"&&(C.ha_device_id=this._haDeviceId),this._replaceDevice==="none"&&(C.ha_device_id=null)):this._haDeviceId&&(C.ha_device_id=this._haDeviceId);let H=await k(this,C,{busy:V=>{this._loading=V},fallbackKey:"save_error",onError:V=>{this._error=V}});H!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-replaced",{detail:{entry_id:H?.entry_id,device_swap:H?.device_swap}})))}_deviceName(C){let V=this.hass?.devices?.[C];return V?.name_by_user||V?.name||C}_deviceSelector(C){return i`<ha-form
      .hass=${this.hass}
      .data=${{device:this._haDeviceId||void 0}}
      .schema=${[{name:"device",selector:{device:{}}}]}
      .computeLabel=${()=>C}
      @value-changed=${H=>this._haDeviceId=H.detail.value?.device||""}
    ></ha-form>`}_renderReplace(){let C=this._lang,H=(t,M)=>i`<label class="radio-row">
      <input
        type="radio"
        name="replace-device"
        .checked=${this._replaceDevice===t}
        @change=${()=>{this._replaceDevice=t}}
      />
      <span>${M}</span>
    </label>`,V=this._replaceDevice==="other"&&!this._haDeviceId;return i`
      <ha-dialog open .headerTitle=${M1(e("replace_object",C))} @closed=${this._close}>
        ${a1(e("replace_object",C))}
        <div class="content">
          ${this._error?$("error",this._error):n}
          <div class="hint">${e("replace_object_prompt",C)}</div>
          <ms-textfield
            label="${e("replace_name_label",C)}"
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          ${this._oldDeviceId?i`<div class="radio-group" role="radiogroup" aria-label=${e("replace_device_heading",C)}>
                <div class="textarea-label">${e("replace_device_heading",C)}</div>
                ${H("keep",e("replace_device_keep",C).replace("{device}",this._deviceName(this._oldDeviceId)))}
                ${this._replaceDevice==="keep"?i`<div class="hint">${e("replace_device_keep_hint",C)}</div>`:n}
                ${H("other",e("replace_device_other",C))}
                ${this._replaceDevice==="other"?i`${this._deviceSelector(e("replace_device_pick",C))}
                      <div class="hint">${e("replace_device_other_hint",C)}</div>`:n}
                ${H("none",e("replace_device_none",C))}
              </div>`:this._deviceSelector(e("link_device_optional",C))}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${e("cancel",C)}
          </ha-button>
          <ha-button @click=${this._replace} .disabled=${this._loading||V}>
            ${this._loading?e("saving",C):e("replace_object",C)}
          </ha-button>
        </div>
      </ha-dialog>
    `}_renderPlace(C){let H=!!this._place&&!this.hass?.states?.[this._place];return i`
      <ha-form
        .hass=${this.hass}
        .data=${{place:this._place||void 0}}
        .schema=${[{name:"place",selector:{entity:{domain:"zone"}}}]}
        .computeLabel=${()=>e("place_optional",C)}
        @value-changed=${V=>{this._place=V.detail.value?.place||"",this._place||(this._remindOnSite=!1)}}
      ></ha-form>
      ${H?i`<div class="place-missing">${e("place_missing",C)}</div>`:n}
      <label class="place-on-site ${this._place?"":"disabled"}">
        <input
          type="checkbox"
          .checked=${this._remindOnSite}
          ?disabled=${!this._place}
          @change=${V=>this._remindOnSite=V.target.checked}
        />
        <span>${e("remind_on_site",C)}</span>
      </label>
      ${this._place?i`<div class="place-hint">${e("remind_on_site_hint",C)}</div>`:n}
    `}async _save(){if(this._loading||!this._name.trim())return;this._error="";let C={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null,...this.placesEnabled?{place:this._place||null,remind_on_site:!!this._place&&this._remindOnSite}:{}},H=await k(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...C}:{type:"maintenance_supporter/object/create",...C},{busy:V=>{this._loading=V},fallbackKey:"save_error",onError:V=>{this._error=V}});H!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved",{detail:{device_swap:H?.device_swap}})))}_parentChoices(){let C=this.objects||[],H=this._entryId?u5(C,this._entryId):new Set;return C.filter(V=>V.entry_id!==this._entryId&&!H.has(V.entry_id)&&(c5(V)||V.entry_id===this._parentEntryId)).map(V=>({entryId:V.entry_id,label:v5(C,V)})).sort((V,t)=>V.label.localeCompare(t.label))}_close(){this._open=!1}render(){if(!this._open)return i``;if(this._replacing)return this._renderReplace();let C=this._lang,H=this._entryId?e("edit_object",C):e("new_object",C);return i`
      <ha-dialog open .headerTitle=${M1(H)} @closed=${this._close}>
        ${a1(H)}
        <div class="content">
          ${this._error?$("error",this._error):n}
          <ms-textfield
            label="${e("name",C)}"
            required
            .value=${this._name}
            @input=${V=>this._name=V.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${e("manufacturer_optional",C)}"
            .value=${this._manufacturer}
            @input=${V=>this._manufacturer=V.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${e("model_optional",C)}"
            .value=${this._model}
            @input=${V=>this._model=V.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${e("serial_number_optional",C)}"
            .value=${this._serialNumber}
            @input=${V=>this._serialNumber=V.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${e("documentation_url_optional",C)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${V=>this._documentationUrl=V.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${e("area_id_optional",C)}"
            .value=${this._areaId}
            @value-changed=${V=>this._areaId=V.detail.value||""}
          ></ha-area-picker>
          ${this.placesEnabled?this._renderPlace(C):n}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${C}
            label="${e("installation_date_optional",C)}"
            .value=${this._installationDate}
            @value-changed=${V=>this._installationDate=V.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${C}
            label="${e("warranty_expiry_optional",C)}"
            .value=${this._warrantyExpiry}
            @value-changed=${V=>this._warrantyExpiry=V.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>e("link_device_optional",C)}
            @value-changed=${V=>this._haDeviceId=V.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?i`<label class="textarea-field">
                <span class="textarea-label">${e("parent_object_optional",C)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${V=>this._parentEntryId=V.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${e("parent_none",C)}
                  </option>
                  ${this._parentChoices().map(V=>i`<option
                      value=${V.entryId}
                      ?selected=${this._parentEntryId===V.entryId}
                    >${V.label}</option>`)}
                </select>
                <span class="md-hint">${e("parent_object_hint",C)}</span>
              </label>`:n}
          <label class="textarea-field">
            <span class="textarea-label">${e("object_notes_optional",C)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${V=>this._notes=V.target.value}
            ></textarea>
            <span class="md-hint">${e("notes_markdown_hint",C)}</span>
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${e("cancel",this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?e("saving",this._lang):e("save",this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};g.styles=Z`
    .place-on-site {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    .place-on-site.disabled {
      color: var(--disabled-text-color, var(--secondary-text-color));
    }
    .place-hint,
    .place-missing {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: -4px;
    }
    .place-missing {
      color: var(--warning-color, #c77700);
    }
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    ms-textfield {
      display: block;
    }
    .textarea-field {
      display: flex; flex-direction: column; gap: 4px;
    }
    .textarea-label {
      font-size: 12px; color: var(--secondary-text-color, #888); font-weight: 500;
    }
    .textarea-field textarea {
      padding: 8px 10px; font-size: 14px; font-family: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: var(--ms-radius-6, 6px);
      resize: vertical;
    }
    .textarea-field textarea:focus {
      outline: none; border-color: var(--primary-color);
    }
    /* The help text of every field (12 px, secondary; #216 consistency pass). */
    .md-hint {
      font-size: 12px; color: var(--secondary-text-color);
    }
    .parent-select {
      padding: 8px 10px; font-size: 14px; font-family: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: var(--ms-radius-6, 6px);
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      line-height: 1.4;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .radio-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
    }
    .radio-row input {
      margin: 0;
    }
  `,o([v({attribute:!1})],g.prototype,"hass",2),o([v({attribute:!1})],g.prototype,"objects",2),o([v({type:Boolean})],g.prototype,"placesEnabled",2),o([d()],g.prototype,"_open",2),o([d()],g.prototype,"_loading",2),o([d()],g.prototype,"_error",2),o([d()],g.prototype,"_name",2),o([d()],g.prototype,"_manufacturer",2),o([d()],g.prototype,"_model",2),o([d()],g.prototype,"_serialNumber",2),o([d()],g.prototype,"_areaId",2),o([d()],g.prototype,"_installationDate",2),o([d()],g.prototype,"_warrantyExpiry",2),o([d()],g.prototype,"_documentationUrl",2),o([d()],g.prototype,"_notes",2),o([d()],g.prototype,"_haDeviceId",2),o([d()],g.prototype,"_parentEntryId",2),o([d()],g.prototype,"_place",2),o([d()],g.prototype,"_remindOnSite",2),o([d()],g.prototype,"_entryId",2),o([d()],g.prototype,"_replacing",2),o([d()],g.prototype,"_oldDeviceId",2),o([d()],g.prototype,"_replaceDevice",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",g);var x5=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"];function N3(L){let r=(L||"").split(/\s+/).filter(Boolean);return r.length===0?"?":r.length===1?r[0][0].toUpperCase():(r[0][0]+r[r.length-1][0]).toUpperCase()}function q3(L){let r=0;for(let C of L)r=r*31+C.charCodeAt(0)>>>0;return x5[r%x5.length]}function h5(L){return L?{id:L.id,name:L.name,initials:L.initials||N3(L.name),color:L.color||q3(L.id)}:null}var Y1=class{constructor(r){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=r}updateHass(r){this.hass=r}async getUsers(r=!1){let C=Date.now();if(!r&&this.usersCache&&C-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let H=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=H.users,this.cacheTimestamp=C,this.usersCache}catch(H){return console.error("Failed to fetch users:",H),this.usersCache||[]}}async assignUser(r,C,H){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:r,task_id:C,user_id:H})}async getTasksByUser(r){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:r})).tasks}getUserName(r){return!r||!this.usersCache?null:this.usersCache.find(H=>H.id===r)?.name||null}getPerson(r){return h5(this.getUser(r))}getUser(r){return!r||!this.usersCache?null:this.usersCache.find(C=>C.id===r)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(r){return r?r===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};function G(L){return`${L.entry_id??""}\0${L.part_id}`}function Z5(L,r,C,H){let V=!!L.entry_id&&L.entry_id!==r,t=V?L.entry_id:r,M=C.find(p=>p.entry_id===t),a=(M?.parts||[]).find(p=>p.id===L.part_id)||null,s=V&&M?.object?.name||"",l=a?.name||e("shared_part_unknown",H);return{part:a,foreign:V,ownerName:s,label:s?`${l} (${s})`:l}}function S5(L,r,C,H){let{part:V,label:t}=Z5(L,r,C,H),M=V&&V.stock!==null&&V.stock!==void 0?` (${m1(V.stock,V.unit,H)})`:"",a=V?.storage_location?` \u2014 ${V.storage_location}`:"";return`${h(L.quantity,H)}\xD7 ${t}${M}${a}`}function g5(L,r,C,H){let V=C.find(s=>s.entry_id===r),t=s=>s?.object.battery_fleet?{cost_mode:"purchase"}:{},M=(V?.parts||[]).map(s=>({...s,...t(V)})),a=new Set(M.map(s=>G({part_id:s.id})));for(let s of L?.consumes_parts||[]){if(!s.entry_id||s.entry_id===r)continue;let l=G(s);if(a.has(l))continue;a.add(l);let{part:p,ownerName:c}=Z5(s,r,C,H);M.push({id:s.part_id,name:p?.name||e("shared_part_unknown",H),unit:p?.unit,stock:p?.stock??null,storage_location:p?.storage_location,cost:p?.cost??null,package_size:p?.package_size??null,cost_mode:p?.cost_mode??null,...t(C.find(m=>m.entry_id===s.entry_id)),entry_id:s.entry_id,owner_name:c})}return M}var u2=["sensor","binary_sensor","number","input_number","input_boolean","counter","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant","input_select","select","input_datetime","date","datetime","timer","update"],_5=["sensor"];function o1(L){let r=(L??"").trim();if(r==="")return null;let C=Number(r.replace(",","."));return!Number.isFinite(C)||C<0?null:Math.round(C)}var W3={changed_since:"undo_changed",nothing_to_undo:"undo_nothing"};async function U3(L,r,C,H){let V="",t=await k({hass:L},{type:"maintenance_supporter/task/undo",entry_id:r,task_id:C},{lang:H,onError:(M,a)=>{let s=W3[a?.code??""];V=s?e(s,H):M}});return t===void 0?{ok:!1,message:V}:{ok:!0,message:e(t?.action_ran?"undo_done_action_ran":"undo_done",H)}}function X1(L,r){let C=L?.already_recorded_seconds;return typeof C=="number"?e("completion_already_recorded",r).replace("{seconds}",String(C)):null}function J1(L,r,C,H,V){let t=(M,a)=>L.dispatchEvent(new CustomEvent("hass-notification",{detail:a?{message:M,action:a,duration:1e4}:{message:M},bubbles:!0,composed:!0}));t(e("task_completed_named",H).replace("{task}",C.taskName),{text:e("undo",H),action:()=>{U3(r,C.entryId,C.taskId,H).then(M=>{t(M.message),M.ok&&V()})}})}function n1(L){let r=L?.quick_complete_defaults;return!!r&&typeof r=="object"&&!Array.isArray(r)}function C2(L){return n1(L)?{...L.quick_complete_defaults}:null}var z3=new Set(["no_defaults","completion_details_required","tag_scan_required"]);async function f5(L,r,C,H){let V={message:"",code:""},t=await k({hass:L},{type:"maintenance_supporter/task/quick_complete",entry_id:r,task_id:C,source:"panel"},{lang:H,fallbackKey:"action_error",onError:(a,s)=>{V={message:a,code:s?.code??""}}});if(t===void 0)return z3.has(V.code)?{result:"dialog"}:{result:"failed",message:V.message};let M=X1(t,H);return M?{result:"already",message:M}:{result:"done",undo:t?.undo===!0}}var x2=["notes","cost","duration","photo","user"],_1={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"};var j3={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},Q3="mdi:wrench-clock",h2=L=>L&&j3[L]||Q3;function F1(L,r){let C=L?.states?.[r]?.attributes?.friendly_name;return typeof C=="string"&&C?C:r}function H2(L){return L?Array.isArray(L.entity_ids)&&L.entity_ids.length>0?[...L.entity_ids]:L.entity_id?[L.entity_id]:[]:[]}function y5(L){if(!(!L||L.type==="compound"))return H2(L)[0]}var Z2=["low","normal","high"],G7=[...Z2].reverse(),b5=["round_robin","least_completed","random"];function O5(L,r){return L?.entities?.[r]?.platform==="maintenance_supporter"}function k5(L){return Object.keys(L?.entities||{}).filter(r=>r.startsWith("todo.")&&O5(L,r))}function V2(L,r){return[...new Set(r.filter(C=>C&&!O5(L,C)))].slice(0,5)}var G3=["weekdays","nth_weekday","day_of_month","calendar"],K3=["time_based",...G3,"one_time"],Y3=["threshold","counter","state_change","runtime","due_date","compound"],X3={time_based:"mdi:calendar-sync",weekdays:"mdi:calendar-week",nth_weekday:"mdi:calendar-today",day_of_month:"mdi:calendar-month",calendar:"mdi:calendar-star",one_time:"mdi:calendar-check",manual:"mdi:gesture-tap",sensor_based:"mdi:calendar-sync"},S2={threshold:"mdi:gauge",counter:"mdi:counter",state_change:"mdi:state-machine",runtime:"mdi:timer-outline",due_date:"mdi:calendar-alert",compound:"mdi:set-center"};function w5(L){return X3[L]??"mdi:calendar"}var J3={days:"day",weeks:"week",months:"month",years:"year"};function C0(L,r,C){return p1(L,J3[r]??"day",C)}function e2(L){let r=parseFloat(L);return Number.isFinite(r)?r:null}function E(L,r){return Object.entries(r).reduce((C,[H,V])=>C.split(`{${H}}`).join(V),L)}function H0(L,r){let C=r,H=()=>{let V=parseInt(L.intervalDays,10);return Number.isFinite(V)&&V>0?C0(V,L.intervalUnit,C):null};switch(L.scheduleType){case"time_based":{let V=H();return V?E(e("beta_rules_every",C),{interval:V}):e("beta_rules_manual",C)}case"one_time":return L.dueDate?E(e("beta_rules_once_on",C),{date:B(L.dueDate,C)}):e("beta_rules_no_date",C);case"manual":return e("beta_rules_manual",C);case"weekdays":{let V=[...L.weekdays].sort((t,M)=>t-M).map(t=>u1(t,C,"short"));return`${e("recurrence_on_days",C)}: ${V.length?V.join(", "):"\u2014"}`}case"nth_weekday":{let V=L.nth==="-1"?e("ord_last",C):e(`ord_${L.nth}`,C);return`${e("nth_weekday",C)}: ${V} ${u1(parseInt(L.nthWeekday,10)||0,C,"long")}`}case"day_of_month":return`${e("day_of_month",C)}: ${L.domLastDay?e("recurrence_last_day",C):L.domDay}`;case"calendar":return`${e("calendar_entity_label",C)}: ${L.calendarEntity||"\u2014"}`;case"sensor_based":{let V=H();return V?E(e(L.triggerCombinator==="all"?"beta_rules_safety_all":"beta_rules_safety_any",C),{interval:V}):e("beta_rules_sensor_only",C)}default:return e(L.scheduleType,C)}}function V0(L,r){let C=[];L.scheduleType==="time_based"&&parseInt(L.intervalDays,10)>0&&C.push(e(L.intervalAnchor==="planned"?"anchor_planned":"anchor_completion",r));let H=parseInt(L.warningDays,10);return L.scheduleType!=="manual"&&Number.isFinite(H)&&H>0&&C.push(E(e("beta_rules_due_soon",r),{interval:p1(H,"day",r)})),C}function e0(L,r){let C=r;if(L.triggerType==="compound"){let a=L.compoundLogic==="OR"?"beta_rules_any_of":"beta_rules_all_of";return E(e(a,C),{n:h(L.compoundCount,C)})}if(!L.triggerEntityIds.length)return e("beta_rules_pick_entity",C);let H=[],V=parseInt(L.forMinutes,10),t=Number.isFinite(V)&&V>0?E(e("beta_rules_for",C),{duration:p1(V,"minute",C)}):"";switch(L.triggerType){case"threshold":{let a=e2(L.above),s=e2(L.below);a!==null&&H.push(E(e("beta_rules_above",C),{value:h(a,C)})),s!==null&&H.push(E(e("beta_rules_below",C),{value:h(s,C)})),H.length||H.push(e("threshold",C)),t&&H.push(t);break}case"counter":{let a=e2(L.targetValue),s=a===null?"\u2014":h(a,C);H.push(E(e(L.deltaMode?"beta_rules_counter_delta":"beta_rules_counter_reaches",C),{value:s}));break}case"state_change":{let a=L.fromState.trim(),s=L.toState.trim();a&&H.push(E(e("beta_rules_changes_from",C),{state:a})),s&&H.push(E(e("beta_rules_changes_to",C),{state:s})),!a&&!s&&H.push(e("beta_rules_changes",C));let l=parseInt(L.targetChanges,10);Number.isFinite(l)&&l>1&&H.push(E(e("beta_rules_times",C),{n:h(l,C)})),t&&H.push(t);break}case"runtime":{let a=e2(L.runtimeHours);H.push(E(e("beta_rules_runs_for",C),{duration:a===null?"\u2014":p1(a,"hour",C)}));break}case"due_date":{let a=parseInt(L.daysBefore,10);H.push(Number.isFinite(a)&&a>0?E(e("beta_rules_date_before",C),{interval:p1(a,"day",C)}):e("beta_rules_date_on",C));break}}let M=H.join(" \xB7 ");return L.triggerAttribute?`${M} (${L.triggerAttribute})`:M}function L0(L,r){let C=r.lang,H=[],V;if(L.completeWhenEntity&&L.completeWhenState.trim()){let M=r.entityName(L.completeWhenEntity);H.push(M),V=E(e("complete_when_badge",C),{entity:M,state:L.completeWhenState.trim()});let a=parseInt(L.completeWhenFor,10);Number.isFinite(a)&&a>0&&(V+=` \xB7 ${E(e("complete_when_badge_for",C),{minutes:h(a,C)})}`),L.completeWhenAnyTime&&(V+=` \xB7 ${e("complete_when_badge_any_time",C)}`)}else V=e("beta_rules_by_hand",C);let t=[];return L.quickOn&&t.push(e("quick_complete_label",C)),L.requiredCount>0&&t.push(`${e("require_on_completion",C)}: ${h(L.requiredCount,C)}`),L.checklistCount>0&&t.push(`${e("checklist",C)}: ${h(L.checklistCount,C)}`),L.partsCount>0&&t.push(`${e("consumes_parts_label",C)}: ${h(L.partsCount,C)}`),L.requireTagScan&&t.push(e("require_tag_scan",C)),L.allowSkip||t.push(e("disallow_skip",C)),{text:V,chips:H,badges:t}}function $5(L,r){let C=r.lang,H=[];H.push({id:"task",icon:"mdi:clipboard-text-outline",text:L.name.trim()||e("beta_rules_name_missing",C),chips:[],badges:[L.typeLabel,...L.enabled?[]:[e("disabled",C)]],removable:!1});let V=L.scheduleType==="sensor_based";if(H.push({id:"schedule",icon:w5(L.scheduleType),text:H0(L,C),chips:[],badges:V0(L,C),removable:V?parseInt(L.intervalDays,10)>0:L.scheduleType!=="manual"}),V){let s=L.triggerType==="compound"?L.compoundEntityIds:L.triggerEntityIds;H.push({id:"trigger",icon:S2[L.triggerType]??"mdi:gauge",text:e0(L,C),chips:[...new Set(s)].map(l=>r.entityName(l)),badges:L.triggerType!=="compound"&&L.triggerEntityIds.length>1?[e(L.entityLogic==="all"?"entity_logic_all":"entity_logic_any",C)]:[],removable:!0})}let t=L0(L,r);H.push({id:"completion",icon:"mdi:check-circle-outline",text:t.text,chips:t.chips,badges:t.badges,removable:!1});let M=L.pool.length>=2&&L.rotation?[e(`rotation_${L.rotation}`,C)]:[],a;return L.responsibleUserId?a=`${e("responsible_user",C)}: ${r.userName(L.responsibleUserId)}`:L.pool.length?a=`${e("task_shared_with",C)}: ${L.pool.map(s=>r.userName(s)).join(", ")}`:a=e("beta_rules_nobody",C),H.push({id:"people",icon:"mdi:account-multiple",text:a,chips:[],badges:M,removable:!1}),H.push({id:"notifications",icon:L.notifyEnabled?"mdi:bell-ring-outline":"mdi:bell-off-outline",text:L.notifyEnabled?e("beta_rules_reminders_on",C):e("no_notifications",C),chips:L.mirrorLists.map(s=>r.entityName(s)),badges:[],removable:!1}),H}function T5(L){let r=L.scheduleType==="sensor_based",C=parseInt(L.intervalDays,10)>0,H=[];for(let V of K3){if(V===L.scheduleType)continue;let t;if(r)if(V==="time_based"){if(C)continue;t="safety"}else t="replace";else t=L.scheduleType==="manual"?"set":"replace";H.push({kind:"schedule",value:V,icon:w5(V),effect:t})}for(let V of Y3){if(r&&V==="compound")continue;let t;r?t="combine":t=L.scheduleType==="time_based"||L.scheduleType==="manual"?"set":"replace",H.push({kind:"trigger",value:V,icon:S2[V],effect:t})}return H}var t0=new Set(["binary_sensor","input_boolean","switch","fan","light","lock","cover","valve","siren"]),r0=new Set(["switch","fan","light","valve","input_boolean"]),i0=new Set(["running","power","plug","heat","cold","moving","vibration"]),M0=new Set(["door","opening","window","garage_door","lock","running","moving","vibration","occupancy","presence"]),a0=new Set(["total","total_increasing"]),o0=new Set(["select","input_select","vacuum","lawn_mower","climate","water_heater","media_player","alarm_control_panel","event"]);function g2(L){let r={entityId:L.entityId,name:L.name},C=V=>({...r,target:"trigger",triggerType:V,icon:S2[V]}),H={...r,target:"done_when",icon:"mdi:check-circle-outline"};if(L.domain==="sensor")return L.deviceClass==="timestamp"||L.deviceClass==="date"?[C("due_date")]:L.numeric?a0.has(L.stateClass??"")?[C("counter"),C("threshold")]:L.deviceClass==="duration"?[C("threshold"),C("counter")]:[C("threshold")]:[C("state_change"),H];if(L.domain==="counter")return[C("counter")];if(L.domain==="number"||L.domain==="input_number")return[C("threshold")];if(t0.has(L.domain)){let V=[];return M0.has(L.deviceClass??"")&&V.push(H),V.push(C("state_change")),(r0.has(L.domain)||i0.has(L.deviceClass??""))&&V.push(C("runtime")),V.includes(H)||V.push(H),V}return o0.has(L.domain)?[C("state_change"),H]:[]}function P5(L,r){let C=L.devices??{},H=r.areaId||(r.deviceId?C[r.deviceId]?.area_id:null)||null,V=a=>a.area_id||(a.device_id?C[a.device_id]?.area_id:null)||null,t=[];for(let[a,s]of Object.entries(L.entities??{})){if(s.platform===r.ownPlatform||s.hidden)continue;let l;if(r.deviceId&&s.device_id===r.deviceId)l="device";else if(H&&V(s)===H)l="area";else continue;let p=L.states?.[a];if(!p)continue;let c=p.attributes??{};t.push({entityId:a,name:typeof c.friendly_name=="string"?c.friendly_name:a,domain:a.split(".")[0],deviceClass:typeof c.device_class=="string"?c.device_class:void 0,stateClass:typeof c.state_class=="string"?c.state_class:void 0,numeric:p.state!==""&&Number.isFinite(Number(p.state))||typeof c.unit_of_measurement=="string",group:l,secondary:!!s.entity_category})}let M=a=>a.group==="device"?0:1;return t.sort((a,s)=>M(a)-M(s)||Number(a.secondary)-Number(s.secondary)||a.name.localeCompare(s.name)),t.map(({secondary:a,...s})=>s).filter(a=>g2(a).length>0)}var E5=Z`
  ha-dialog.beta-dialog {
    --mdc-dialog-min-width: min(1100px, calc(100vw - 32px));
    --mdc-dialog-max-width: min(1100px, calc(100vw - 32px));
    --ha-dialog-width-md: min(1100px, calc(100vw - 32px));
    --ha-dialog-width-lg: min(1100px, calc(100vw - 32px));
  }
  .beta-content {
    min-width: 0;
  }
  .rules-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
    column-gap: 16px;
    row-gap: 8px;
    align-items: start;
  }
  .rules-layout > * {
    grid-column: 1;
    min-width: 0;
  }
  .rules-layout > .rules-sidebar {
    grid-column: 2;
    grid-row: 1 / span 60;
    position: sticky;
    top: 0;
  }
  @media (max-width: 870px) {
    .rules-layout {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
    /* Below its row it scrolls with the rows: stuck to the top, it covered
       the rows under it (tablet portrait, phone held sideways). */
    .rules-layout > .rules-sidebar {
      position: static;
    }
    .rules-layout > .rules-sidebar:not(.open) {
      display: none;
    }
  }
  .rules-group-title {
    margin: 12px 0 0;
    font-size: 18px;
    font-weight: 400;
    line-height: 26px;
    color: var(--primary-text-color);
  }
  .rule-row {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 48px;
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    background: var(--card-background-color, #fff);
    box-sizing: border-box;
  }
  .rule-row.selected {
    border: 2px solid var(--primary-color);
  }
  .rule-main {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 8px 6px 14px;
    border: 0;
    background: none;
    color: var(--primary-text-color);
    font: inherit;
    text-align: start;
    cursor: pointer;
    border-radius: 12px;
  }
  .rule-main:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
  .rule-main > ha-icon {
    flex: none;
    color: var(--secondary-text-color);
  }
  .rule-text {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    min-width: 0;
    font-size: 14px;
    line-height: 20px;
  }
  .rule-sentence {
    overflow-wrap: anywhere;
  }
  .rule-chip {
    display: inline-flex;
    align-items: center;
    height: 26px;
    padding: 0 10px;
    border-radius: 8px;
    background: var(--secondary-background-color, #e6e6e6);
    color: var(--primary-text-color);
    font-size: 13px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rule-badge {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }
  .rule-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 10px;
    width: 100%;
  }
  .rule-remove {
    flex: none;
    --ha-icon-button-size: 40px;
    --mdc-icon-button-size: 40px;
    color: var(--secondary-text-color);
  }
  .rule-add {
    justify-self: start;
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 16px 0 10px;
    border: 0;
    border-radius: 9999px;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .rule-add:focus-visible {
    outline: 2px solid var(--primary-text-color);
    outline-offset: 2px;
  }
  /* The head stays put and only the body scrolls: a sticky head covered
     the first controls whenever one was scrolled into view. */
  .rules-sidebar {
    border: 2px solid var(--primary-color);
    border-radius: 16px;
    background: var(--card-background-color, #fff);
    padding: 4px 0 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    max-height: 70vh;
    overflow: hidden;
  }
  .sidebar-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 4px 14px 14px;
  }
  /* In the scrolling column nothing may shrink: the tabs (overflow hidden,
     so no content minimum) were squeezed to nothing under a long list. */
  .sidebar-body > * {
    flex-shrink: 0;
  }
  @media (max-width: 870px) {
    .rules-sidebar {
      max-height: none;
    }
  }
  .rules-sidebar:not(.open) {
    border-style: dashed;
    border-color: var(--divider-color);
  }
  .rules-sidebar .section-title {
    display: none;
  }
  .rules-sidebar .form-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .sidebar-head {
    flex: none;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 14px 0 6px;
    border-bottom: 1px solid var(--divider-color);
  }
  .sidebar-title {
    flex: 1 1 auto;
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
  }
  .sidebar-hint {
    padding: 16px 18px;
    color: var(--secondary-text-color);
    font-size: 14px;
  }
  .add-tabs {
    display: flex;
    height: 32px;
    border-radius: 9999px;
    overflow: hidden;
    background: var(--secondary-background-color, #e6e6e6);
  }
  .add-tabs button {
    flex: 1 1 0;
    border: 0;
    background: transparent;
    color: var(--secondary-text-color);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .add-tabs button[aria-selected="true"] {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .add-group {
    margin-top: 4px;
    font-size: 13px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }
  .add-choice {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 44px;
    padding: 6px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
    text-align: start;
    cursor: pointer;
  }
  .add-choice:hover {
    border-color: var(--primary-color);
  }
  .add-choice > ha-icon {
    flex: none;
    color: var(--secondary-text-color);
  }
  .add-choice-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .add-choice-note {
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .device-entity {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 0;
    border-top: 1px solid var(--divider-color);
  }
  .device-entity-name {
    font-size: 14px;
    font-weight: 500;
  }
  .device-entity-choices {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .device-entity-choices .add-choice {
    width: auto;
    min-height: 36px;
    border-radius: 9999px;
  }
  .chooser {
    display: flex;
    flex-direction: column;
  }
  .chooser-item {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 60px;
    padding: 8px 12px;
    border: 0;
    border-bottom: 1px solid var(--divider-color);
    background: none;
    color: var(--primary-text-color);
    font: inherit;
    text-align: start;
    cursor: pointer;
  }
  .chooser-item:last-child {
    border-bottom: 0;
  }
  .chooser-item:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
  .chooser-item > ha-icon {
    flex: none;
    color: var(--secondary-text-color);
  }
  .chooser-text {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .chooser-title {
    font-size: 14px;
    line-height: 20px;
  }
  .chooser-desc {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }
  .chooser-search {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 12px;
    margin-bottom: 8px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
  }
  .chooser-group {
    padding: 12px 12px 4px;
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }
  .chooser-empty {
    padding: 16px 12px;
    color: var(--secondary-text-color);
  }
`;var r1=class extends b{constructor(){super(...arguments);this.value="";this.lang="en";this._credit=!1;this._amount=""}willUpdate(C){if(!C.has("value"))return;let H=(this.value??"").trim();if(H===this._signed())return;let V=parseFloat(H);if(H===""||Number.isNaN(V)){this._amount="",this._credit=!1;return}this._credit=V<0,this._amount=String(Math.abs(V))}_signed(){let C=this._amount.trim();return C===""?"":this._credit?`-${C}`:C}_emit(){this.value=this._signed(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setCredit(C){this._credit!==C&&(this._credit=C,this._emit())}_onInput(C){let H=C.target.value;H.startsWith("-")&&(this._credit=!0),this._amount=H.replace(/^-+/,""),this._emit()}render(){let C=this.lang;return i`
      <div class="wrap">
        <div class="sign" role="group">
          <button type="button" class="kind cost ${this._credit?"":"on"}" aria-pressed=${String(!this._credit)}
            @click=${()=>this._setCredit(!1)}>${e("cost",C)}</button>
          <button type="button" class="kind credit ${this._credit?"on":""}" aria-pressed=${String(this._credit)}
            @click=${()=>this._setCredit(!0)}>${e("cost_kind_credit",C)}</button>
        </div>
        <input type="number" step="0.01" min="0" inputmode="decimal" class="field-input amount"
          .value=${this._amount} @input=${this._onInput} />
      </div>
      ${this._credit?i`<div class="hint">${e("cost_credit_hint",C)}</div>`:n}
    `}};r1.styles=[x1,Z`
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
    `],o([v()],r1.prototype,"value",2),o([v()],r1.prototype,"lang",2),o([d()],r1.prototype,"_credit",2),o([d()],r1.prototype,"_amount",2);customElements.get("ms-cost-input")||customElements.define("ms-cost-input",r1);function C1(L,r){return S1("ha-expansion-panel")?i`
      <ha-expansion-panel class=${L.cls??""} outlined .expanded=${!!L.open}
        @expanded-changed=${C=>{C.target===C.currentTarget&&L.onToggle?.(C.detail.expanded)}}>
        <div slot="header" class=${L.headerCls??"collapsible-header"}>${L.header}</div>
        ${r}
      </ha-expansion-panel>`:i`<details class=${L.cls??""} ?open=${!!L.open}
    @toggle=${L.onToggle?C=>L.onToggle(C.target.open):n}><summary class=${L.headerCls??n}>${L.header}</summary>${r}</details>`}var s0="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",d0="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",l0="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",R5=["cleaning","inspection","replacement","calibration","service","reading","custom"],A0=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],r2=["weekdays","nth_weekday","day_of_month","calendar"],B5=["time_based","one_time",...r2],I5=["threshold","counter","state_change","runtime","due_date"],L2=(L,r)=>e(L==="due_date"?"trigger_type_due_date":L,r),p0=[...I5,"compound"],H1={alpha:"0.3",min:"7",max:"365"},s1=t1;function t2(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0",carry:{}}}var m0=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);function D5(L){return{type:L.type||"threshold",attribute:L.attribute||"",above:L.trigger_above?.toString()??"",below:L.trigger_below?.toString()??"",equals:L.trigger_equals?.toString()??"",notEquals:L.trigger_not_equals?.toString()??"",forMinutes:L.trigger_for_minutes?.toString()??"0",targetValue:L.trigger_target_value?.toString()??"",deltaMode:L.trigger_delta_mode||!1,fromState:L.trigger_from_state||"",toState:L.trigger_to_state||"",targetChanges:L.trigger_target_changes?.toString()??"",runtimeHours:L.trigger_runtime_hours?.toString()??"",onStates:(L.trigger_on_states||[]).join(", "),daysBefore:L.trigger_days_before?.toString()??"0"}}function N5(L,r){r.attribute&&(L.attribute=r.attribute);let C=parseInt(r.forMinutes,10);if(r.type==="threshold"){let H=parseFloat(r.above);isNaN(H)||(L.trigger_above=H);let V=parseFloat(r.below);isNaN(V)||(L.trigger_below=V);let t=parseFloat(r.equals);isNaN(t)||(L.trigger_equals=t);let M=parseFloat(r.notEquals);isNaN(M)||(L.trigger_not_equals=M),isNaN(C)||(L.trigger_for_minutes=C)}else if(r.type==="counter"){let H=parseFloat(r.targetValue);isNaN(H)||(L.trigger_target_value=H),L.trigger_delta_mode=r.deltaMode}else if(r.type==="state_change"){r.fromState&&(L.trigger_from_state=r.fromState),r.toState&&(L.trigger_to_state=r.toState);let H=parseInt(r.targetChanges,10);isNaN(H)||(L.trigger_target_changes=H),isNaN(C)||(L.trigger_for_minutes=C)}else if(r.type==="runtime"){let H=parseFloat(r.runtimeHours);isNaN(H)||(L.trigger_runtime_hours=H);let V=(r.onStates||"").split(",").map(t=>t.trim()).filter(Boolean);V.length>0&&(L.trigger_on_states=V)}else if(r.type==="due_date"){let H=parseInt(r.daysBefore,10);L.trigger_days_before=isNaN(H)?0:H}}function c0(L){return{entityIds:H2(L).join(", "),...D5(L),carry:Object.fromEntries(Object.entries(L).filter(([C])=>!m0.has(C)&&!C.startsWith("_")))}}function v0(L){let r=L.entityIds.split(",").map(H=>H.trim()).filter(Boolean);if(r.length===0)return null;let C={...L.carry||{},entity_id:r[0],entity_ids:r,type:L.type};return N5(C,L),C}function u0(L){return Array.from({length:7},(r,C)=>u1(C,L,"short"))}function F5(L){return Array.from({length:12},(r,C)=>M5(C,L,"short"))}function x0(L){let r=Array.isArray(L)?L.filter(C=>C!=null&&C!=="").join(", "):L!==null&&typeof L=="object"||L==null?"":String(L);return r.length>40?`${r.slice(0,39)}\u2026`:r}var A=class A extends b{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.mirrorTodoDefault=[];this.betaEditor=!1;this._ruleSel=null;this._addTab="type";this._betaStep="form";this._chooserFilter="";this._templateChoices=null;this._copyChoices=null;this._objectDevice=null;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._series=[];this._seriesIndex=0;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calMonths=[];this._hadCalMonths=!1;this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._detailsOpen=!1;this._mirrorTodoEntities=[];this._mirrorTodoMode="default";this._completeWhenEntity="";this._completeWhenState="";this._completeWhenAnyTime=!1;this._completeWhenFor="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._holdUntilDone=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._triggerDetailAttribute="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._quickOn=!1;this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=H1.alpha;this._adaptiveMin=H1.min;this._adaptiveMax=H1.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set;this._attrSeq=0}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return T(this.hass)}async openCreate(C,H){this._series=[],this._entryId=C,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="";let V=(H||[]).filter(t=>!t.object.archived&&!t.object.archived_at);!C&&V.length>0?(this._objectChoices=V.map(t=>({entry_id:t.entry_id,name:t.object.name})).sort((t,M)=>t.name.localeCompare(M.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),this._betaStep=this.betaEditor?"choose":"form",this._ruleSel="task",this._addTab="type",this._chooserFilter="",await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(C,H){this._series=[],await this._edit(C,H)}async openEditSeries(C){C.length!==0&&(this._series=C,await this._editSeriesItem(0))}async _editSeriesItem(C){let H=this._series[C];this._seriesIndex=C,await this._edit(H.entryId,H.task),await this.updateComplete,this.shadowRoot?.querySelector(".dialog-title")?.scrollIntoView({block:"start"})}_skipSeriesItem(){this._editSeriesItem(this._seriesIndex+1)}async _edit(C,H){this._entryId=C,this._taskId=H.id,this._error="",this._warning="",this._betaStep="form",this._ruleSel=null,this._addTab="type",this._objectChoices=[],this._isFleetTask=H.battery_fleet_task===!0,this._name=H.name,this._type=H.type,this._scheduleType=H.schedule_type,this._intervalDays=H.interval_days!=null?String(H.interval_days):"",this._intervalUnit=H.interval_unit||"days",this._dueDate=H.due_date||"";let V=H.schedule;this._weekdays=V?.kind==="weekdays"?[...V.weekdays??[]]:[],this._nth=V?.kind==="nth_weekday"?String(V.nth??1):"1",this._nthWeekday=V?.kind==="nth_weekday"?String(V.weekday??5):"5",this._domDay=V?.kind==="day_of_month"&&(V.day??1)>=1?String(V.day??1):"1",this._domLastDay=V?.kind==="day_of_month"&&V.day===-1,this._domBusiness=V?.kind==="day_of_month"&&V.business===!0,this._calMonths=(V?.kind==="day_of_month"||V?.kind==="nth_weekday")&&Array.isArray(V.months)?[...V.months]:[],this._hadCalMonths=this._calMonths.length>0,this._calendarEntity=V?.kind==="calendar"&&V.entity_id||"",this._calOffset=V?.offset?String(V.offset):"0",this._seasonMonths=Array.isArray(V?.season_months)?[...V.season_months]:[];let t=V?.ends;t&&typeof t.count=="number"?(this._endsMode="count",this._endsCount=String(t.count),this._endsUntil=""):t&&typeof t.until=="string"?(this._endsMode="until",this._endsUntil=t.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=H.warning_days.toString(),this._earliestCompletionDays=H.earliest_completion_days!=null?String(H.earliest_completion_days):"",this._intervalAnchor=H.interval_anchor||"completion",this._notes=H.notes||"",this._documentationUrl=H.documentation_url||"",this._customIcon=H.custom_icon||"",this._notifyIcon=H.notify_icon||"",this._priority=H.priority||"normal",this._labels=(H.labels||[]).join(", "),this._mirrorTodoEntities=[...H.mirror_todo_entities||[]],this._mirrorTodoMode=this._mirrorTodoEntities.length?"own":H.mirror_todo_use_default===!1?"none":"default",this._completeWhenEntity=H.complete_when?.entity_id||"",this._completeWhenState=H.complete_when?.to_state||"",this._completeWhenAnyTime=!!H.complete_when?.any_time,this._completeWhenFor=H.complete_when?.for_minutes?String(H.complete_when.for_minutes):"",this._enabled=H.enabled!==!1,this._lastPerformed=H.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=H.nfc_tag_id||"",this._requireTagScan=!!H.require_tag_scan,this._allowSkip=H.allow_skip!==!1,this._notifyEnabled=H.notify_enabled!==!1,this._readingUnit=H.reading_unit||"",this._readings=(H.readings||[]).map(l=>({...l})),this._consumesParts=Object.fromEntries((H.consumes_parts||[]).map(l=>[G(l),{...l}])),this._consumesQtyText={},this._responsibleUserId=H.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...H.assignee_pool||[]],this._rotationStrategy=H.rotation_strategy||"",this._checklistText=(H.checklist||[]).join(`
`),this._phaseDefs=Object.entries(H.phases||{}).map(([l,p])=>{let{name:c,checklist:m,consumes_parts:u,required_completion_fields:_,...R}=p,D=p.consumes_parts||[],K=D.findIndex(Y=>!Y.entry_id),j=K>=0?D[K]:void 0;return{id:l,name:p.name||l,checklistText:(p.checklist||[]).join(`
`),partId:j?.part_id||"",partQty:j?.quantity!=null?String(j.quantity):"",reqOverride:p.required_completion_fields!==void 0,reqFields:[...p.required_completion_fields||[]],extraParts:D.filter((Y,l1)=>l1!==K).map(Y=>({...Y})),carry:R}}),this._phaseSeq=[...H.phase_sequence||[]],this._requiredCompletion=[...H.required_completion_fields||[]],this._scheduleTime=H.schedule_time||"",this._scheduleTimeOn=!!H.schedule_time;let M=H.on_complete_action;if(M&&M.service){this._actionService=M.service;let l=M.target?.entity_id;this._actionTargetEntity=Array.isArray(l)?l[0]||"":l||"",this._actionTargetStored=M.target&&typeof M.target=="object"?JSON.parse(JSON.stringify(M.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=M.data&&typeof M.data=="object"?{...M.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=M.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let a=H.quick_complete_defaults;this._quickOn=n1(H),this._qcNotes=a?.notes||"",this._qcCost=a?.cost!=null?String(a.cost):"",this._qcDuration=a?.duration!=null?String(a.duration):"",this._qcFeedback=a?.feedback||"";let s=H.adaptive_config||{};if(this._environmentalEntity=s.environmental_entity||"",this._environmentalAttribute=s.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!s.enabled,this._adaptiveAlpha=s.ewa_alpha?.toString()??H1.alpha,this._adaptiveMin=s.min_interval_days?.toString()??H1.min,this._adaptiveMax=s.max_interval_days?.toString()??H1.max,this._adaptiveSeasonal=s.seasonal_enabled!==!1,this._adaptivePrediction=s.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,H.trigger_config){let l=H.trigger_config;this._triggerEntityId=y5(l)||"",this._triggerEntityIds=H2(l),this._triggerEntityLogic=l.entity_logic||"any",this._setTypeFields(D5(l)),this._triggerCombinator=l.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=l.trigger_baseline_value?.toString()||"",this._liveBaselineValue=H.trigger_baseline_value??null,this._autoCompleteOnRecovery=l.auto_complete_on_recovery||!1,this._holdUntilDone=l.trigger_hold_until_done===!0,this._triggerRuntimeMaxSession=l.trigger_runtime_max_session_seconds?.toString()||"",this._triggerDetailAttribute=l.detail_attribute||"",l.type==="compound"?(this._compoundLogic=l.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(l.conditions||[]).map(c0)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),this._detailsOpen=this._priority!=="normal"||!!this._labels.trim()||!!this._documentationUrl.trim()||!!this._customIcon,await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._detailsOpen=!1,this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._calMonths=[],this._hadCalMonths=!1,this._calendarEntity="",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._mirrorTodoMode="default",this._completeWhenEntity="",this._completeWhenState="",this._completeWhenAnyTime=!1,this._completeWhenFor="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._notifyEnabled=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=H1.alpha,this._adaptiveMin=H1.min,this._adaptiveMax=H1.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._actionTestError="",this._quickOn=!1,this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(C){this._triggerType=C.type,this._triggerAttribute=C.attribute,this._triggerAbove=C.above,this._triggerBelow=C.below,this._triggerEquals=C.equals,this._triggerNotEquals=C.notEquals,this._triggerForMinutes=C.forMinutes,this._triggerTargetValue=C.targetValue,this._triggerDeltaMode=C.deltaMode,this._triggerFromState=C.fromState,this._triggerToState=C.toState,this._triggerTargetChanges=C.targetChanges,this._triggerRuntimeHours=C.runtimeHours,this._triggerOnStates=C.onStates,this._triggerDaysBefore=C.daysBefore}_resetTriggerFields(){++this._attrSeq,this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(t2()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._holdUntilDone=!1,this._triggerRuntimeMaxSession="",this._triggerDetailAttribute="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new Y1(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(C){console.error("Failed to load users:",C),this._availableUsers=[]}}_toggleAssignee(C){this._assigneePool=this._assigneePool.includes(C)?this._assigneePool.filter(H=>H!==C):[...this._assigneePool,C]}async _testAction(){let C=this._actionService.trim();if(!C||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(C)){this._actionTestResult="error",this._actionTestError=e("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[H,V]=C.split(".");if(!this.hass?.services?.[H]?.[V]){this._actionTestResult="error",this._actionTestError=e("action_test_unknown_service",this._lang).replace("{service}",C),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let t=this._actionTargetEntity.trim();if(t){let M=t.split(".")[0];if(M!==H&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(H)){this._actionTestResult="error",this._actionTestError=e("action_test_domain_mismatch",this._lang).replace("{service}",C).replace("{domain}",H).replace("{entity}",t).replace("{entity_domain}",M).replace("{suggestion}",`${M}.${V}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[t]){this._actionTestResult="error",this._actionTestError=e("action_test_entity_missing",this._lang).replace("{entity}",t),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let C=JSON.parse(this._actionDataJsonFallback);if(C&&typeof C=="object"&&!Array.isArray(C))return C}catch{}return{...this._actionData}}_serviceSchema(){let C=this._actionService.trim();if(!C||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(C))return null;let[H,V]=C.split("."),t=this.hass?.services?.[H]?.[V]?.fields;return!t||Object.keys(t).length===0?null:Object.entries(t).map(([M,a])=>({name:M,required:!!a.required,selector:a.selector||{text:{}}}))}_actionTargetExtended(){let C=this._actionTargetStored;return C?Object.entries(C).some(([H,V])=>H==="entity_id"?Array.isArray(V)&&V.length>1:Array.isArray(V)?V.length>0:!!V):!1}_actionTargetSummary(){let C=this._actionTargetStored||{},H=t=>(Array.isArray(t)?t:[t]).filter(M=>typeof M=="string"&&!!M),V=this.hass;return[...H(C.entity_id).map(t=>F1(this.hass,t)),...H(C.device_id).map(t=>V.devices?.[t]?.name_by_user||V.devices?.[t]?.name||t),...H(C.area_id).map(t=>V.areas?.[t]?.name||t),...H(C.floor_id).map(t=>V.floors?.[t]?.name||t),...H(C.label_id)].join(", ")}_renderQuickComplete(C){let H={notes:!!this._qcNotes.trim(),cost:!isNaN(parseFloat(this._qcCost)),duration:o1(this._qcDuration)!==null,photo:!1,user:!0},V=this._requiredCompletion.filter(M=>!H[M]),t=!!this._checklistText.trim()||this._readings.length>0;return i`
      ${f({cls:"req-option quick-complete-switch",checked:this._quickOn,onChange:M=>this._quickOn=M.target.checked},i`<span>${e("quick_complete_label",C)}</span>`)}
      ${this._quickOn?i`
            <div class="field-help">${e("quick_complete_help",C)}</div>
            ${V.length?i`<div class="field-help quick-complete-note">${e("quick_complete_needs_dialog",C).replace("{fields}",V.map(M=>e(_1[M],C)).join(", "))}</div>`:n}
            ${this._requireTagScan?i`<div class="field-help quick-complete-note">${e("quick_complete_tag_hint",C)}</div>`:n}
            ${t?i`<div class="field-help">${e("quick_complete_not_asked",C)}</div>`:n}
            ${C1({cls:"ca-section quick-complete-values",open:Object.values(H).slice(0,3).some(Boolean)||!!this._qcFeedback,header:e("quick_complete_values",C)},i`
              <p class="field-help">${e("quick_complete_values_help",C)}</p>
              <ms-textfield
                label="${e("quick_complete_defaults_notes",C)}"
                .value=${this._qcNotes}
                @input=${M=>{this._qcNotes=M.target.value}}
              ></ms-textfield>
              <div class="qc-cost">
                <span class="qc-cost-label">${e("quick_complete_defaults_cost",C)}</span>
                <ms-cost-input .lang=${C} .value=${this._qcCost}
                  @value-changed=${M=>{this._qcCost=M.detail.value}}></ms-cost-input>
              </div>
              <ms-textfield
                label="${e("quick_complete_defaults_duration",C)}"
                type="number" min="0" step="1"
                .value=${this._qcDuration}
                @input=${M=>{this._qcDuration=M.target.value}}
              ></ms-textfield>
              ${O({label:e("was_maintenance_needed",C),cls:"qc-feedback",value:this._qcFeedback,onChange:M=>{this._qcFeedback=M.target.value}},i`
                <option value="">${e("quick_complete_defaults_feedback_none",C)}</option>
                <option value="needed">${e("quick_complete_defaults_feedback_needed",C)}</option>
                <option value="not_needed">${e("quick_complete_defaults_feedback_not_needed",C)}</option>
                <option value="not_sure">${e("feedback_not_sure",C)}</option>
              `)}
            `)}
          `:n}
    `}_renderCompletionActionsSection(C){if(!this.completionActionsEnabled&&!this._actionPresent)return n;let H=this._serviceSchema();return i`
      ${C1({cls:"ca-section",header:e("on_complete_action_title",C)},i`
        <p class="field-help">${e("on_complete_action_desc",C)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${V=>{this._actionService=V.detail.value||"";let t=this._serviceSchema();if(t){let M=new Set(t.map(a=>a.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([a])=>M.has(a)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>e("on_complete_action_target",C)}
          @value-changed=${V=>{let t=V.detail.value;this._actionTargetEntity=t.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?i`<p class="field-help ca-target-more">${e("on_complete_action_target_more",C).replace("{targets}",this._actionTargetSummary())}</p>`:n}
        <p class="field-help ca-domain-hint">
          ${e("on_complete_action_target_hint",C)}
        </p>
        ${f({cls:"ca-skip-auto",checked:this._actionSkipAuto,onChange:V=>{this._actionSkipAuto=V.target.checked}},i`<span>${e("on_complete_action_skip_auto",C)}</span>`)}
        ${H?i`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${H}
                .data=${this._actionData}
                @value-changed=${V=>{this._actionData={...V.detail.value}}}
              ></ha-form>
            `:i`
              <ms-textfield
                label="${e("on_complete_action_data",C)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${V=>{this._actionDataJsonFallback=V.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":e("on_complete_action_test",C)}
          </button>
          ${this._actionTestResult==="ok"?i`<span class="ca-test-ok">${e("on_complete_action_test_success",C)}</span>`:n}
          ${this._actionTestResult==="error"?i`<div class="ca-test-error-block">
                <span class="ca-test-error">${e("on_complete_action_test_failed",C)}</span>
                ${this._actionTestError?i`<div class="ca-test-error-detail">${this._actionTestError}</div>`:n}
              </div>`:n}
        </div>
      `)}

    `}_knownObjects(C){return this.objects?.some(H=>H.entry_id===C)?this.objects:void 0}async _loadParts(){this.parts=[];let C=this._entryId;if(!C)return;let H=this._knownObjects(C)?.find(V=>V.entry_id===C);if(H){this.parts=H.parts||[],this._partsLoadFailed=!1;return}try{let V=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:C});if(C!==this._entryId)return;this.parts=V.parts||[],this._partsLoadFailed=!1}catch{if(C!==this._entryId)return;this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){this._foreignOwners=[];let C=this._entryId;if(C)try{let H=this._knownObjects(C)??(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"})).objects;if(C!==this._entryId)return;this._foreignOwners=(H||[]).filter(V=>V.entry_id!==C&&(V.parts||[]).length>0).map(V=>({entry_id:V.entry_id,name:V.object?.name||V.entry_id,parts:V.parts||[]})).sort((V,t)=>V.name.localeCompare(t.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let C=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=C.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(C){!C||!this.hass||this._conditionAttrOptions[C]||this._conditionAttrPending.has(C)||(this._conditionAttrPending.add(C),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:C}).then(H=>{let V=H;this._conditionAttrOptions={...this._conditionAttrOptions,[C]:{suggested:V.suggested_attributes||[],available:V.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[C]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(C){let H=++this._attrSeq;if(!C||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let V=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:C});if(H!==this._attrSeq)return;this._entityDomain=V.domain||"",this._suggestedAttributes=V.suggested_attributes||[],this._availableAttributes=V.available_attributes||[]}catch{if(H!==this._attrSeq)return;this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(C=>!!C.entry_id)}_renderConsumesRow(C,H){let V=G({part_id:C.id,entry_id:H}),t=this._consumesParts[V],M=H?{part_id:C.id,quantity:1,entry_id:H}:{part_id:C.id,quantity:1};return i`
      <div class="consumes-row">
        ${f({cls:"consumes-check",checked:t!==void 0,onChange:a=>{let s={...this._consumesParts};if(a.target.checked)s[V]=s[V]||M;else{delete s[V];let l={...this._consumesQtyText};delete l[V],this._consumesQtyText=l}this._consumesParts=s}},i`<span>${C.name}${C.unit?` (${C.unit})`:""}</span>`)}
        ${t!==void 0?i`<input
              class="consumes-qty"
              aria-label=${`${C.name}: ${e("quantity",this._lang)}`}
              type="number"
              min=${s1[0]}
              max=${s1[1]}
              step="0.01"
              .value=${this._consumesQtyText[V]??String(t.quantity)}
              @input=${a=>{let s=a.target.value;this._consumesQtyText={...this._consumesQtyText,[V]:s};let l=parseFloat(s.replace(",","."));Number.isFinite(l)&&l>=s1[0]&&(this._consumesParts={...this._consumesParts,[V]:{...M,quantity:l}})}}
            />`:n}
      </div>
    `}_applyConsumesQtyText(){let C={...this._consumesParts};for(let H of Object.keys(C)){let V=this._consumesQtyText[H];if(V===void 0)continue;let t=parseFloat(V.replace(",","."));if(!Number.isFinite(t)||t<s1[0]||t>s1[1]){let M=a=>h(a,this._lang,{maximumFractionDigits:2});return this._error=e("settings_value_out_of_range",this._lang).replace("{min}",M(s1[0])).replace("{max}",M(s1[1])),!1}C[H]={...C[H],quantity:t}}return this._consumesParts=C,!0}_toggleRequired(C,H){let V=new Set(this._requiredCompletion);H?V.add(C):V.delete(C),this._requiredCompletion=[...V]}_patchReading(C,H){this._readings=this._readings.map(V=>V.id===C?{...V,...H}:V)}_renderReadingsEditor(C){let H=J2(this._readings);return i`
      <div class="readings-editor">
        <div class="field-label">${e("readings_section",C)}</div>
        <div class="field-help">${e("readings_hint",C)}</div>
        ${this._readings.map(V=>i`
          ${H.has(V.id)?i`<div class="field-help reading-dup">${e("reading_duplicate_name",C)}</div>`:n}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${e("reading_name_label",C)}"
              .value=${V.name}
              @input=${t=>this._patchReading(V.id,{name:t.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${e("reading_unit_short",C)}"
              .value=${V.unit||""}
              @input=${t=>this._patchReading(V.id,{unit:t.target.value})}
            ></ms-textfield>
            <ha-icon-button class="phase-remove reading-remove" .label=${e("remove",C)} @click=${()=>this._readings=this._readings.filter(t=>t.id!==V.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<j2?i`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:Q2(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${e("reading_add",C)}
          </ha-button>`:n}
      </div>
    `}_phaseSlug(C){let H=C.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",V=H,t=2;for(;this._phaseDefs.some(M=>M.id===V);)V=`${H}-${t++}`;return V}_addPhaseDef(){let C=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:C,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(C){this._phaseDefs=this._phaseDefs.filter(H=>H.id!==C),this._phaseSeq=this._phaseSeq.filter(H=>H!==C)}_patchPhaseDef(C,H){this._phaseDefs=this._phaseDefs.map(V=>V.id===C?{...V,...H}:V)}_renderPhasesEditor(C){let H=V=>this._phaseDefs.find(t=>t.id===V)?.name||V;return i`
      ${C1({cls:"phases-section",open:this._phaseDefs.length>0,header:e("phases_section",C)},i`
      <div class="field-help">${e("phases_hint",C)}</div>
      ${this._phaseDefs.map(V=>i`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${e("phase_name",C)}"
              .value=${V.name}
              @input=${t=>this._patchPhaseDef(V.id,{name:t.target.value})}
            ></ms-textfield>
            ${this.parts.length?i`
              ${O({label:e("spare_part",C),cls:"phase-part",value:V.partId,onChange:t=>{let M=t.target.value;this._patchPhaseDef(V.id,V.partQty?{partId:M}:{partId:M,partQty:"1"})}},i`
                <option value="">—</option>
                ${this.parts.map(t=>i`<option value=${t.id} ?selected=${t.id===V.partId}>${t.name}</option>`)}
              `)}
              ${V.partId?i`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" aria-label=${e("quantity",C)} type="number" min=${t1[0]} step="0.01" placeholder="1" .value=${V.partQty}
                  @input=${t=>this._patchPhaseDef(V.id,{partQty:t.target.value})} />
              `:n}
            `:n}
            <ha-icon-button class="phase-remove" .label=${e("remove",C)} @click=${()=>this._removePhaseDef(V.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?i`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${e("checklist_placeholder",C)}"
              .value=${V.checklistText}
              @input=${t=>this._patchPhaseDef(V.id,{checklistText:t.target.value})}
            ></textarea>
          `:n}
          ${f({cls:"req-option phase-req-toggle",checked:V.reqOverride,onChange:t=>this._patchPhaseDef(V.id,{reqOverride:t.target.checked})},i`<span>${e("phase_require_override",C)}</span>`)}
          ${V.reqOverride?i`
            <div class="required-completion phase-req-fields">
              ${x2.map(t=>i`
                ${f({cls:"req-option",checked:V.reqFields.includes(t),onChange:M=>{let a=M.target.checked,s=new Set(V.reqFields);a?s.add(t):s.delete(t),this._patchPhaseDef(V.id,{reqFields:[...s]})}},i`<span>${e(_1[t],C)}</span>`)}
              `)}
            </div>
          `:n}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${e("phase_add",C)}
      </ha-button>
      ${this._phaseDefs.some(V=>V.name.trim())?i`
        <div class="phase-seq-label">${e("phase_sequence_label",C)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((V,t)=>i`
            <span class="phase-chip">
              ${t+1}. ${H(V)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((M,a)=>a!==t)}}>✕</button>
            </span>
          `)}
          ${O({label:e("phase_sequence_add_step",C),cls:"phase-seq-add",value:"",onChange:V=>{let t=V.target.value;t&&(this._phaseSeq=[...this._phaseSeq,t]),V.target.value=""}},i`
            <option value="">+ ${e("phase_sequence_add_step",C)}</option>
            ${this._phaseDefs.filter(V=>V.name.trim()).map(V=>i`<option value=${V.id}>${V.name}</option>`)}
          `)}
        </div>
      `:n}
      `)}
    `}async _save(){if(this._loading||!this._name.trim()||this._missingDueDate())return;if(this._adaptiveSnapshot()!==this._adaptiveInitial){let H=parseInt(this._adaptiveMin,10),V=parseInt(this._adaptiveMax,10);if(!isNaN(H)&&!isNaN(V)&&H>V){this._error=`${e("adaptive_min_interval",this._lang)} > ${e("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=e("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=e("calendar_entity_required",this._lang);return}if(!this._applyConsumesQtyText())return;if(this._completeWhenEntity&&parseInt(this._completeWhenFor,10)>h1[1]){this._error=e("settings_value_out_of_range",this._lang).replace("{min}","1").replace("{max}",h(h1[1],this._lang));return}this._loading=!0,this._error="";let C;try{let H=await k(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:a=>{this._error=a}});if(H===void 0)return;let V=this._taskId||H?.task_id,t=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let M=a=>{this._warning=e("subsave_warning",this._lang).replace("{detail}",a)};if(V&&this._scheduleType==="sensor_based"&&t&&await k(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:V,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:M})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),V&&this._adaptiveSnapshot()!==this._adaptiveInitial){let a=parseFloat(this._adaptiveAlpha),s=parseInt(this._adaptiveMin,10),l=parseInt(this._adaptiveMax,10);await k(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:V,enabled:this._adaptiveEnabled,...a>=R1[0]&&a<=R1[1]?{ewa_alpha:a}:{},...!isNaN(s)&&s>=1?{min_interval_days:s}:{},...!isNaN(l)&&l>=1?{max_interval_days:l}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:M})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?V&&(this._taskId=V):this._seriesIndex+1<this._series.length?C=this._seriesIndex+1:(this._open=!1,this._series=[]),this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}C!==void 0&&await this._editSeriesItem(C)}_missingDueDate(){return this._scheduleType==="one_time"&&!this._dueDate}_savePayload(){let C={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},H=this._earliestCompletionDays.trim();C.earliest_completion_days=H===""?null:Math.max(0,parseInt(H,10)||0),this._taskId&&(C.task_id=this._taskId),this._scheduleType==="one_time"?(C.due_date=this._dueDate||null,C.interval_days=null):r2.includes(this._scheduleType)?(C.schedule={...this._buildSchedule(),...this._recurrenceExtras()},C.interval_days=null,this._taskId&&(C.due_date=null)):(this._taskId&&(C.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(C.interval_days=parseInt(this._intervalDays,10),C.interval_unit=this._intervalUnit,C.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(C.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(C.interval_days=null,C.interval_anchor="completion")),C.notes=this._notes||null,C.documentation_url=this._documentationUrl||null,C.custom_icon=this._customIcon||null,C.notify_icon=this._notifyIcon.trim()||null,C.priority=this._priority,C.labels=this._labels.split(",").map(M=>M.trim()).filter(Boolean);let V=this.mirrorTodoDefault.length&&this._mirrorTodoMode!=="own"?[]:V2(this.hass,this._mirrorTodoEntities);C.mirror_todo_entities=V,C.mirror_todo_use_default=this.mirrorTodoDefault.length?this._mirrorTodoMode==="default":this._mirrorTodoMode!=="none",C.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(C.last_performed=this._lastPerformed||null),C.nfc_tag_id=this._nfcTagId||null,C.require_tag_scan=this._requireTagScan,C.allow_skip=this._allowSkip;let t=parseInt(this._completeWhenFor,10);C.complete_when=this._completeWhenEntity&&this._completeWhenState.trim()?{entity_id:this._completeWhenEntity,to_state:this._completeWhenState.trim(),...this._completeWhenAnyTime?{any_time:!0}:{},...t>0?{for_minutes:t}:{}}:null,C.notify_enabled=this._notifyEnabled,C.reading_unit=this._readingUnit.trim()||null,C.readings=C5(this._readings);{let M={};for(let s of this._phaseDefs){if(!s.name.trim())continue;let l={...s.carry,name:s.name.trim()},p=s.checklistText.split(`
`).map(m=>m.trim()).filter(Boolean);p.length&&(l.checklist=p);let c=[];if(s.partId){let m=parseFloat(s.partQty);c.push({part_id:s.partId,quantity:Number.isFinite(m)&&m>0?m:1})}for(let m of s.extraParts)c.push(m.entry_id?{part_id:m.part_id,quantity:m.quantity,entry_id:m.entry_id}:{part_id:m.part_id,quantity:m.quantity});c.length&&(l.consumes_parts=c),s.reqOverride&&(l.required_completion_fields=[...s.reqFields]),M[s.id]=l}let a=this._phaseSeq.filter(s=>s in M);C.phases=Object.keys(M).length&&a.length?M:null,C.phase_sequence=C.phases?a:null}if((this.parts.length||this._foreignOwners.length)&&(C.consumes_parts=Object.values(this._consumesParts).map(M=>M.entry_id?{part_id:M.part_id,quantity:M.quantity,entry_id:M.entry_id}:{part_id:M.part_id,quantity:M.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(C.responsible_user_id=this._responsibleUserId),C.assignee_pool=this._assigneePool,C.required_completion_fields=this._requiredCompletion,C.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let M=this._compoundConditions.map(v0).filter(a=>a!==null);if(M.length>0){let a={type:"compound",compound_logic:this._compoundLogic,conditions:M};this._autoCompleteOnRecovery&&(a.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(a.trigger_combinator="all"),this._triggerDetailAttribute&&(a.detail_attribute=this._triggerDetailAttribute),C.trigger_config=a}else this._taskId&&(C.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let M=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],a={entity_id:M[0],entity_ids:M,type:this._triggerType};if(N5(a,this._typeFields()),this._holdUntilDone&&this._isStateLatch()?a.trigger_hold_until_done=!0:this._autoCompleteOnRecovery&&(a.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(a.trigger_combinator="all"),this._triggerDetailAttribute&&(a.detail_attribute=this._triggerDetailAttribute),M.length>1&&(a.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let s=parseFloat(this._triggerBaselineValue);!isNaN(s)&&s>=0&&(a.trigger_baseline_value=s)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let s=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(s)&&s>0&&(a.trigger_runtime_max_session_seconds=s)}C.trigger_config=a}else this._taskId&&(C.trigger_config=null);if(this.scheduleTimeEnabled&&B5.includes(this._scheduleType)){let M=this._scheduleTimeOn?this._scheduleTime.trim():"";C.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(M)?M:null}if(this.checklistsEnabled){let M=this._checklistText.split(`
`).map(a=>a.trim()).filter(Boolean).slice(0,100);C.checklist=M.length?M:null}if(this.completionActionsEnabled||this._actionPresent){let M=this._actionService.trim();if(M&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(M)){let a={service:M},s=this._actionTargetEntity.trim();this._actionTargetStored&&s===this._actionTargetInitial?a.target=JSON.parse(JSON.stringify(this._actionTargetStored)):s&&(a.target={entity_id:s});let l=this._buildActionData();Object.keys(l).length>0&&(a.data=l),this._actionSkipAuto&&(a.skip_auto=!0),C.on_complete_action=a}else C.on_complete_action=null}{let M={};this._qcNotes.trim()&&(M.notes=this._qcNotes.trim());let a=parseFloat(this._qcCost);isNaN(a)||(M.cost=a);let s=o1(this._qcDuration);s!==null&&(M.duration=s),this._qcFeedback&&(M.feedback=this._qcFeedback),C.quick_complete_defaults=this._quickOn?M:null}return C}_close(){this._open=!1,this._series=[],this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return n;let C=this._lang,H=this._triggerType==="compound";return i`
      <div class="select-row">
        ${w()?n:i`<label>${e("trigger_type",C)}</label>`}
        ${O({label:e("trigger_type",C),value:this._triggerType,onChange:V=>this._triggerType=V.target.value},i`
          ${p0.map(V=>i`<option value=${V} ?selected=${V===this._triggerType}>${L2(V,C)}</option>`)}
        `)}
      </div>
      ${H?this._renderCompoundEditor():i`
        ${this._entityPickerFallback?i`
          <ms-textfield
            label="${e("entity_id",C)} (${e("comma_separated",C)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${V=>{let M=V.target.value.split(",").map(a=>a.trim()).filter(Boolean);this._triggerEntityId=M[0]||"",this._triggerEntityIds=M,M[0]&&this._fetchEntityAttributes(M[0])}}
          ></ms-textfield>
        `:i`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:u2}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>e("entity_id",C)}
          @value-changed=${V=>{let t=(V.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=t[0]||"",this._triggerEntityIds=t,t[0]?this._fetchEntityAttributes(t[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?i`
          <div class="select-row">
            ${w()?n:i`<label>${e("entity_logic",C)}</label>`}
            ${O({label:e("entity_logic",C),value:this._triggerEntityLogic,onChange:V=>this._triggerEntityLogic=V.target.value},i`
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${e("entity_logic_any",C)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${e("entity_logic_all",C)}</option>
            `)}
          </div>
        `:n}
        ${this._renderAttributeSelect({label:e("attribute_optional",C),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:V=>this._triggerAttribute=V})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      ${this._renderDetailAttributeSelect(C)}
      ${this._isStateLatch()?this._renderTriggerEnd(C):i`
        ${f({checked:this._autoCompleteOnRecovery,onChange:V=>this._autoCompleteOnRecovery=V.target.checked},i`${e("auto_complete_on_recovery",C)}`)}
        <div class="field-help">${e("auto_complete_on_recovery_help",C)}</div>
      `}
      <ms-textfield
        label="${e("safety_interval",C)}"
        type="number"
        .value=${this._intervalDays}
        @input=${V=>this._intervalDays=V.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():n}
      ${this._intervalDays?i`
            <div class="select-row">
              ${w()?n:i`<label>${e("trigger_combinator",C)}</label>`}
              ${O({label:e("trigger_combinator",C),onChange:V=>this._triggerCombinator=V.target.value},i`
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${e("trigger_combinator_any",C)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${e("trigger_combinator_all",C)}</option>
              `)}
            </div>
          `:n}
    `}_patchCondition(C,H){this._compoundConditions=this._compoundConditions.map((V,t)=>t===C?{...V,...H}:V)}_addCondition(){this._compoundConditions=[...this._compoundConditions,t2()]}_removeCondition(C){this._compoundConditions=this._compoundConditions.filter((H,V)=>V!==C),this.betaEditor&&this._compoundConditions.length===1&&this._flattenCompound()}_flattenCompound(){let[C]=this._compoundConditions;if(!C)return;let H=C.entityIds.split(",").map(a=>a.trim()).filter(Boolean),{entityIds:V,carry:t,...M}=C;this._compoundConditions=[],this._setTypeFields(M),this._triggerEntityId=H[0]||"",this._triggerEntityIds=H,H[0]&&this._fetchEntityAttributes(H[0])}_renderCompoundEditor(){let C=this._lang;return i`
      <div class="select-row">
        ${w()?n:i`<label>${e("compound_logic",C)}</label>`}
        ${O({label:e("compound_logic",C),value:this._compoundLogic,onChange:H=>this._compoundLogic=H.target.value},i`
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${e("compound_logic_and",C)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${e("compound_logic_or",C)}</option>
        `)}
      </div>
      <div class="field-help">${e("compound_help",C)}</div>
      ${this._compoundConditions.length===0?i`<div class="field-help">${e("compound_no_conditions",C)}</div>`:this._compoundConditions.map((H,V)=>this._renderCondition(H,V))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${e("compound_add_condition",C)}
      </button>
    `}_renderCondition(C,H){let V=this._lang,t=H+1;return i`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${e("compound_condition",V)} ${t}</span>
          <button
            type="button"
            class="icon-btn"
            title="${e("compound_remove_condition",V)}"
            @click=${()=>this._removeCondition(H)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?i`
          <ms-textfield
            label="${e("entity_id",V)} (${e("comma_separated",V)})"
            .value=${C.entityIds}
            @input=${M=>this._patchCondition(H,{entityIds:M.target.value})}
          ></ms-textfield>
        `:i`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:u2}}}]}
          .data=${{condition_entities:C.entityIds.split(",").map(M=>M.trim()).filter(Boolean)}}
          .computeLabel=${()=>e("entity_id",V)}
          @value-changed=${M=>{let a=(M.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(H,{entityIds:a.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(C,H)}
        <div class="select-row">
          ${w()?n:i`<label>${e("trigger_type",V)}</label>`}
          ${O({label:e("trigger_type",V),value:C.type,onChange:M=>this._patchCondition(H,{type:M.target.value})},i`
            ${I5.map(M=>i`<option value=${M} ?selected=${M===C.type}>${L2(M,V)}</option>`)}
          `)}
        </div>
        ${this._renderConditionTypeFields(C,H)}
      </div>
    `}_isStateLatch(){return this._triggerType==="state_change"&&(this._triggerTargetChanges===""||Number(this._triggerTargetChanges)===1)&&!!(this._triggerFromState.trim()||this._triggerToState.trim())}_renderTriggerEnd(C){let H=this._holdUntilDone?"hold":this._autoCompleteOnRecovery?"done":"ok",V={ok:"trigger_end_ok",done:"trigger_end_done",hold:"trigger_end_hold"},t=M=>{this._autoCompleteOnRecovery=M==="done",this._holdUntilDone=M==="hold"};return i`
      <div class="trigger-end" role="radiogroup" aria-label=${e("trigger_end",C)}>
        <div class="field-label">${e("trigger_end",C)}</div>
        ${Object.keys(V).map(M=>i`
          <label class="trigger-end-option">
            <input type="radio" name="trigger-end" value=${M} .checked=${H===M} @change=${()=>t(M)} />
            ${e(V[M],C)}
          </label>
        `)}
        ${H==="done"?i`<div class="field-help">${e("auto_complete_on_recovery_help",C)}</div>`:n}
        ${H==="hold"?i`<div class="field-help">${e("trigger_end_hold_help",C)}</div>`:n}
      </div>
    `}_renderCompleteWhen(C){return i`
      <div class="field complete-when-field">
        ${this._entityPickerFallback?i`
          <ms-textfield
            label="${e("complete_when",C)}"
            placeholder="binary_sensor.washer_door"
            .value=${this._completeWhenEntity}
            @input=${H=>this._completeWhenEntity=H.target.value.trim()}
          ></ms-textfield>
        `:i`
          <ha-form
            class="entity-picker-form"
            .hass=${this.hass}
            .schema=${[{name:"complete_when",selector:{entity:{}}}]}
            .data=${{complete_when:this._completeWhenEntity}}
            .computeLabel=${()=>e("complete_when",C)}
            @value-changed=${H=>{let V=(H.detail.value.complete_when||"").trim();V!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=V}}
          ></ha-form>`}
        ${this._completeWhenEntity?this._renderStateField({label:e("complete_when_state",C),value:this._completeWhenState,entityId:this._completeWhenEntity,onInput:H=>this._completeWhenState=H}):n}
        ${this._completeWhenEntity?i`
          <ms-textfield
            class="complete-when-for"
            label="${e("for_at_least_minutes",C)}"
            type="number"
            min=${h1[0]}
            max=${h1[1]}
            .value=${this._completeWhenFor}
            @input=${H=>this._completeWhenFor=H.target.value}
          ></ms-textfield>
          ${f({cls:"req-option complete-when-any-time",checked:this._completeWhenAnyTime,onChange:H=>this._completeWhenAnyTime=H.target.checked},i`<span>${e("complete_when_any_time",C)}</span>`)}
        `:n}
        <div class="field-help">${e("complete_when_help",C)}</div>
      </div>
    `}_renderStateField(C){return this._entityPickerFallback||!C.entityId?i`
        <ms-textfield
          label=${C.label}
          .value=${C.value}
          @input=${H=>C.onInput(H.target.value)}
        ></ms-textfield>
      `:i`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:C.entityId}}}]}
        .data=${{s:C.value}}
        .computeLabel=${()=>C.label}
        @value-changed=${H=>C.onInput((H.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(C){let H=this._lang;return this._entityPickerFallback||!C.entityId?i`
        <ms-textfield
          label="${e("runtime_on_states",H)}"
          placeholder="on"
          .value=${C.value}
          @input=${V=>C.onInput(V.target.value)}
        ></ms-textfield>
      `:i`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:C.entityId,multiple:!0}}}]}
        .data=${{s:(C.value||"").split(",").map(V=>V.trim()).filter(Boolean)}}
        .computeLabel=${()=>e("runtime_on_states",H)}
        @value-changed=${V=>C.onInput((V.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(C){return this._scheduleType==="one_time"||this._scheduleType==="manual"?n:!this.adaptiveFeature&&!this._adaptiveWasEnabled?n:i`
      ${C1({cls:"adaptive-section",open:this._adaptiveEnabled,header:e("adaptive_section_title",C)},i`
        ${f({checked:this._adaptiveEnabled,onChange:H=>this._adaptiveEnabled=H.target.checked},i`${e("adaptive_enabled",C)}`)}
        ${this._adaptiveEnabled?i`
          <ms-textfield
            label="${e("adaptive_min_interval",C)}"
            type="number"
            min="1"
            .value=${this._adaptiveMin}
            @input=${H=>this._adaptiveMin=H.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${e("adaptive_max_interval",C)}"
            type="number"
            min="1"
            .value=${this._adaptiveMax}
            @input=${H=>this._adaptiveMax=H.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${e("adaptive_ewa_alpha",C)}"
            type="number"
            min=${R1[0]}
            max=${R1[1]}
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${H=>this._adaptiveAlpha=H.target.value}
          ></ms-textfield>
          ${this.seasonalFeature?i`${f({checked:this._adaptiveSeasonal,onChange:H=>this._adaptiveSeasonal=H.target.checked},i`${e("adaptive_seasonal_enabled",C)}`)}`:n}
          ${f({checked:this._adaptivePrediction,onChange:H=>this._adaptivePrediction=H.target.checked},i`${e("adaptive_prediction_enabled",C)}`)}
        `:n}
      `)}
    `}_renderAttributeSelect(C){let H=this._lang;return C.available.length>0?i`
        <div class="select-row">
          ${w()?n:i`<label>${C.label}</label>`}
          ${O({label:C.label,value:C.value,onChange:V=>C.onSelect(V.target.value)},i`
            <option value="" ?selected=${!C.value}>${e("use_entity_state",H)}</option>
            ${C.suggested.map(V=>i`<option value=${V} ?selected=${V===C.value}>${V} ★</option>`)}
            ${C.available.filter(V=>!C.suggested.includes(V.name)).map(V=>i`<option value=${V.name} ?selected=${V.name===C.value}>${V.name}${V.numeric?"":" (non-numeric)"}</option>`)}
          `)}
        </div>
      `:i`
      <ms-textfield
        label="${C.label}"
        .value=${C.value}
        @input=${V=>C.onSelect(V.target.value.trim())}
      ></ms-textfield>
    `}_renderDetailAttributeSelect(C){let H=this._triggerType==="compound"?this._compoundConditions.flatMap(l=>l.entityIds.split(",").map(p=>p.trim()).filter(Boolean)):(this._triggerEntityIds.length?this._triggerEntityIds:[this._triggerEntityId]).filter(Boolean);if(!H.length)return n;let V=this.hass?.states??{},t=new Map;for(let l of H){this._fetchConditionAttributes(l);for(let p of this._conditionAttrOptions[l]?.available??[])t.has(p.name)||t.set(p.name,x0(V[l]?.attributes?.[p.name]))}let M=this._triggerDetailAttribute;M&&!t.has(M)&&t.set(M,"");let a=e("trigger_detail_attribute",C),s=t.size?i`
        <div class="select-row">
          ${w()?n:i`<label>${a}</label>`}
          ${O({label:a,cls:"detail-attribute-select",value:M,onChange:l=>this._triggerDetailAttribute=l.target.value},i`
            <option value="" ?selected=${!M}>${e("trigger_detail_none",C)}</option>
            ${[...t.entries()].sort(([l],[p])=>l.localeCompare(p)).map(([l,p])=>i`<option value=${l} ?selected=${l===M}>${p?`${l}: ${p}`:l}</option>`)}
          `)}
        </div>`:i`
        <ms-textfield class="detail-attribute-input" label=${a} .value=${M}
          @input=${l=>this._triggerDetailAttribute=l.target.value.trim()}></ms-textfield>`;return i`${s}<div class="field-help">${e("trigger_detail_attribute_help",C)}</div>`}_renderEnvironmentalAttribute(C){this._fetchConditionAttributes(this._environmentalEntity);let H=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:e("environmental_attribute_optional",C),value:this._environmentalAttribute,suggested:H?.suggested??[],available:H?.available??[],onSelect:V=>this._environmentalAttribute=V})}_renderConditionAttribute(C,H){let V=C.entityIds.split(",")[0]?.trim()||"";V&&this._fetchConditionAttributes(V);let t=V?this._conditionAttrOptions[V]:void 0;return this._renderAttributeSelect({label:e("attribute_optional",this._lang),value:C.attribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:M=>this._patchCondition(H,{attribute:M})})}_renderConditionTypeFields(C,H){let V=this._lang;if(C.type==="threshold")return i`
        <ms-textfield label="${e("trigger_above",V)}" type="number" .value=${C.above}
          @input=${t=>this._patchCondition(H,{above:t.target.value})}></ms-textfield>
        <ms-textfield label="${e("trigger_below",V)}" type="number" .value=${C.below}
          @input=${t=>this._patchCondition(H,{below:t.target.value})}></ms-textfield>
        <ms-textfield label="${e("trigger_equals",V)}" type="number" .value=${C.equals}
          @input=${t=>this._patchCondition(H,{equals:t.target.value})}></ms-textfield>
        <ms-textfield label="${e("trigger_not_equals",V)}" type="number" .value=${C.notEquals}
          @input=${t=>this._patchCondition(H,{notEquals:t.target.value})}></ms-textfield>
        <ms-textfield label="${e("for_minutes",V)}" type="number" .value=${C.forMinutes}
          @input=${t=>this._patchCondition(H,{forMinutes:t.target.value})}></ms-textfield>
      `;if(C.type==="counter")return i`
        <ms-textfield label="${e("target_value",V)}" type="number" .value=${C.targetValue}
          @input=${t=>this._patchCondition(H,{targetValue:t.target.value})}></ms-textfield>
        ${f({checked:C.deltaMode,onChange:t=>this._patchCondition(H,{deltaMode:t.target.checked})},i`${e("delta_mode",V)}`)}
      `;if(C.type==="state_change"){let t=C.entityIds.split(",")[0]?.trim()||"";return i`
        ${this._renderStateField({label:e("from_state_optional",V),value:C.fromState,entityId:t,onInput:M=>this._patchCondition(H,{fromState:M})})}
        ${this._renderStateField({label:e("to_state_optional",V),value:C.toState,entityId:t,onInput:M=>this._patchCondition(H,{toState:M})})}
        <ms-textfield label="${e("target_changes",V)}" type="number" .value=${C.targetChanges}
          @input=${M=>this._patchCondition(H,{targetChanges:M.target.value})}></ms-textfield>
        <ms-textfield label="${e("for_minutes",V)}" type="number" .value=${C.forMinutes}
          @input=${M=>this._patchCondition(H,{forMinutes:M.target.value})}></ms-textfield>
      `}if(C.type==="runtime"){let t=C.entityIds.split(",")[0]?.trim()||"";return i`
        <ms-textfield label="${e("runtime_hours",V)}" type="number" .value=${C.runtimeHours}
          @input=${M=>this._patchCondition(H,{runtimeHours:M.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:C.onStates,entityId:t,onInput:M=>this._patchCondition(H,{onStates:M})})}
      `}return C.type==="due_date"?i`
        <ms-textfield label="${e("days_before",V)}" type="number" step="1"
          min=${P1[0]} max=${P1[1]} .value=${C.daysBefore}
          @input=${t=>this._patchCondition(H,{daysBefore:t.target.value})}></ms-textfield>
      `:n}_renderUnitSelect(){let C=this._lang;return i`
      <div class="select-row">
        ${w()?n:i`<label>${e("interval_unit",C)}</label>`}
        ${O({label:e("interval_unit",C),value:this._intervalUnit,onChange:H=>this._intervalUnit=H.target.value},i`
          ${["days","weeks","months","years"].map(H=>i`<option value=${H} ?selected=${H===this._intervalUnit}>${e("unit_"+H,C)}</option>`)}
        `)}
      </div>`}_toggleWeekday(C){this._weekdays=this._weekdays.includes(C)?this._weekdays.filter(H=>H!==C):[...this._weekdays,C]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(r2.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let C=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!C||C<=0?null:{kind:"interval",every:C,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(C){super.updated?.(C),this._scheduleEntityPickerProbe();for(let H of C.keys())if(A._PREVIEW_RELEVANT.has(String(H))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let C=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),H=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!C||!H){this._pickerProbeStrikes=0;return}let V=(s,l,p=0)=>{if(!(!s||p>10)){(s.tagName?.toLowerCase()??"")==="ha-entity-picker"&&l.push(s);for(let c of[s.shadowRoot,s])if(c)for(let m of Array.from(c.children??[]))V(m,l,p+1)}},t=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],M=[];for(let s of t)V(s,M);let a=M.length===0||M.some(s=>s.offsetHeight===0);if(C.offsetHeight===0||a){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let C=this._open?this._previewScheduleDict():null;if(!C){++this._previewSeq,this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let H=++this._previewSeq;try{let V=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:C,...this._lastPerformed?{last_performed:this._lastPerformed}:{},...this._taskId?{entry_id:this._entryId,task_id:this._taskId}:{}});if(H!==this._previewSeq)return;this._schedulePreview=V.occurrences||[],this._schedulePreviewEnded=!!V.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return n;let C=this._lang,H=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",V=this._schedulePreview.map((M,a)=>{let s=new Date(`${M}T12:00:00`).getDay();return`${u1(s===0?6:s-1,C,"short")} ${B(M,C)}${a===0?H:""}`}).join(" \xB7 "),t=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?i`<div class="field-help">${e("schedule_preview_ontime",C)}</div>`:n;return i`
      <div class="trigger-live-hint schedule-preview">
        ${e("schedule_preview_title",C)}: ${V}${this._schedulePreviewEnded?i` <span class="field-help">${e("schedule_preview_ends",C)}</span>`:n}
        ${t}
      </div>
    `}_buildSchedule(){let C=t=>{let M=parseInt(this._calOffset,10)||0;return M&&(t.offset=Math.max(-E1,Math.min(M,E1))),t},H=t=>((this._calMonths.length||this._hadCalMonths)&&(t.months=[...this._calMonths].sort((M,a)=>M-a)),C(t));if(this._scheduleType==="weekdays")return C({kind:"weekdays",weekdays:[...this._weekdays].sort((t,M)=>t-M)});if(this._scheduleType==="nth_weekday")return H({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return C({kind:"calendar",entity_id:this._calendarEntity.trim()});let V={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(V.business=!0),H(V)}_recurrenceExtras(){let C={};if(this._seasonMonths.length&&(C.season_months=[...this._seasonMonths].sort((H,V)=>H-V)),this._endsMode==="count"){let H=parseInt(this._endsCount,10);H>=1&&(C.ends={count:H})}else this._endsMode==="until"&&this._endsUntil&&(C.ends={until:this._endsUntil});return C}_toggleCalMonth(C){this._calMonths=this._calMonths.includes(C)?this._calMonths.filter(H=>H!==C):[...this._calMonths,C]}_renderCalMonths(){let C=this._lang;return i`
      <label class="field-label">${e("recurrence_months_label",C)}</label>
      <div class="field-help">${e("recurrence_months_hint",C)}</div>
      <div class="weekday-chips season-chips cal-month-chips">
        ${F5(C).map((H,V)=>i`
          <button
            type="button"
            class="season-chip ${this._calMonths.includes(V+1)?"selected":""}"
            @click=${()=>this._toggleCalMonth(V+1)}
          >${H}</button>`)}
      </div>`}_toggleSeasonMonth(C){this._seasonMonths=this._seasonMonths.includes(C)?this._seasonMonths.filter(H=>H!==C):[...this._seasonMonths,C]}_renderRecurrenceExtras(){let C=this._lang;if(!(this._scheduleType==="time_based"||r2.includes(this._scheduleType)))return n;let V=F5(C);return i`
      <label class="field-label">${e("season_window_label",C)}</label>
      <div class="field-help">${e("season_window_hint",C)}</div>
      <div class="weekday-chips season-chips">
        ${V.map((t,M)=>i`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(M+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(M+1)}
          >${t}</button>`)}
      </div>

      <label class="field-label">${e("series_end_label",C)}</label>
      <div class="select-row">
        ${O({label:e("series_end_label",C),value:this._endsMode,onChange:t=>this._endsMode=t.target.value},i`
          <option value="never" ?selected=${this._endsMode==="never"}>${e("series_end_never",C)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${e("series_end_after_count",C)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${e("series_end_until",C)}</option>
        `)}
      </div>
      ${this._endsMode==="count"?i`
        <!-- max: MAX_SERIES_COUNT (const.py), what the history can count. -->
        <ms-textfield
          label="${e("series_end_count_label",C)}"
          type="number" min="1" max="500"
          .value=${this._endsCount}
          @input=${t=>this._endsCount=t.target.value}
        ></ms-textfield>`:n}
      ${this._endsMode==="until"?i`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${C}
          label="${e("series_end_until_label",C)}"
          .value=${this._endsUntil}
          @value-changed=${t=>this._endsUntil=t.detail.value}
        ></ms-date-field>`:n}
    `}_renderCalendarFields(){let C=this._lang,H=u0(C);if(this._scheduleType==="weekdays")return i`
        <label class="field-label">${e("recurrence_on_days",C)}</label>
        <div class="weekday-chips">
          ${H.map((V,t)=>i`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(t)?"selected":""}"
              @click=${()=>this._toggleWeekday(t)}
            >${V}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let V=[["1",e("ord_1",C)],["2",e("ord_2",C)],["3",e("ord_3",C)],["4",e("ord_4",C)],["5",e("ord_5",C)],["-1",e("ord_last",C)]];return i`
        <div class="select-row">
          ${w()?n:i`<label>${e("recurrence_occurrence",C)}</label>`}
          ${O({label:e("recurrence_occurrence",C),value:this._nth,onChange:t=>this._nth=t.target.value},i`
            ${V.map(([t,M])=>i`<option value=${t} ?selected=${t===this._nth}>${M}</option>`)}
          `)}
        </div>
        <div class="select-row">
          ${w()?n:i`<label>${e("recurrence_weekday",C)}</label>`}
          ${O({label:e("recurrence_weekday",C),value:this._nthWeekday,onChange:t=>this._nthWeekday=t.target.value},i`
            ${H.map((t,M)=>i`<option value=${String(M)} ?selected=${String(M)===this._nthWeekday}>${t}</option>`)}
          `)}
        </div>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?i`
        ${this._entityPickerFallback?i`
          <ms-textfield
            label="${e("calendar_entity_label",C)}"
            helper="${e("calendar_entity_hint",C)}"
            .value=${this._calendarEntity}
            @input=${V=>this._calendarEntity=V.target.value.trim()}
          ></ms-textfield>
        `:i`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>e("calendar_entity_label",C)}
            .computeHelper=${()=>e("calendar_entity_hint",C)}
            @value-changed=${V=>{this._calendarEntity=(V.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?i`
        ${this._domLastDay?n:i`
          <ms-textfield
            label="${e("recurrence_day",C)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${V=>this._domDay=V.target.value}
          ></ms-textfield>`}
        ${f({cls:"checkbox-row",checked:this._domLastDay,onChange:V=>this._domLastDay=V.target.checked},i`<span>${e("recurrence_last_day",C)}</span>`)}
        ${f({cls:"checkbox-row",checked:this._domBusiness,onChange:V=>this._domBusiness=V.target.checked},i`<span>${e("recurrence_business_day",C)}</span>`)}
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`:n}_renderCalOffsetField(){let C=this._lang;return i`
      <ms-textfield
        label="${e("recurrence_offset",C)}"
        helper="${e("recurrence_offset_help",C)}"
        type="number"
        min=${-E1}
        max=${E1}
        .value=${this._calOffset}
        @input=${H=>this._calOffset=H.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let C=parseFloat(this._triggerAbove),H=parseFloat(this._triggerBelow);return!isNaN(C)&&!isNaN(H)&&H>C}_renderTriggerLiveHint(){if(this._triggerType==="compound")return n;let C=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?i`<div class="trigger-live-hint warn">${e("trigger_hint_overlap",this._lang)}</div>`:n,H=this._triggerEntityId||this._triggerEntityIds[0];if(!H||!this.hass?.states)return C;let V=this.hass.states[H];if(!V)return C;let t=this._lang,M=V.attributes?.unit_of_measurement,a=typeof M=="string"&&M?` ${M}`:"",s=this._triggerAttribute?V.attributes?.[this._triggerAttribute]:V.state,l=typeof s=="number"?s:parseFloat(String(s)),p=s!=="unknown"&&s!=="unavailable"&&s!=null&&!isNaN(l),c=u=>h(u,t,{maximumFractionDigits:1}),m=[];if(this._triggerType==="threshold"){let u=parseFloat(this._triggerAbove),_=parseFloat(this._triggerBelow),R=parseFloat(this._triggerEquals),D=parseFloat(this._triggerNotEquals);if([u,_,R,D].every(K=>isNaN(K)))return n;p&&m.push(e("trigger_hint_now",t).replace("{value}",c(l)+a)),isNaN(u)||m.push(e("trigger_hint_above",t).replace("{target}",c(u)+a)),isNaN(_)||m.push(e("trigger_hint_below",t).replace("{target}",c(_)+a)),isNaN(R)||m.push(e("trigger_hint_equals",t).replace("{target}",c(R)+a)),isNaN(D)||m.push(e("trigger_hint_not_equals",t).replace("{target}",c(D)+a))}else if(this._triggerType==="counter"){let u=parseFloat(this._triggerTargetValue);if(isNaN(u))return n;this._triggerDeltaMode?this._taskId?m.push(e("trigger_hint_counter_delta_edit",t).replace("{target}",c(u)+a)):p?m.push(e("trigger_hint_counter_delta",t).replace("{value}",c(l)+a).replace("{due}",c(l+u)+a).replace("{target}",c(u)+a)):m.push(e("trigger_hint_counter_delta_edit",t).replace("{target}",c(u)+a)):(p&&m.push(e("trigger_hint_now",t).replace("{value}",c(l)+a)),m.push(e("trigger_hint_counter_abs",t).replace("{target}",c(u)+a)))}else if(this._triggerType==="runtime"){let u=parseFloat(this._triggerRuntimeHours);if(isNaN(u))return n;m.push(e("trigger_hint_runtime",t).replace("{hours}",c(u))),m.push(e("trigger_hint_state_now",t).replace("{value}",String(V.state)))}else if(this._triggerType==="state_change"){let u=parseInt(this._triggerTargetChanges,10)||1,_=this._triggerToState.trim();m.push((_?e("trigger_hint_state_change_to",t).replace("{state}",_):e("trigger_hint_state_change",t)).replace("{count}",String(u))),m.push(e("trigger_hint_state_now",t).replace("{value}",String(V.state)))}else if(this._triggerType==="due_date"){let u=parseInt(this._triggerDaysBefore,10)||0;m.push(u===0?e("trigger_hint_due_date_same_day",t):W1("trigger_hint_due_date","trigger_hint_due_date_one",u,t,"days"));let _=s==null?"":String(s);_&&!isNaN(Date.parse(_))&&m.push(e("trigger_hint_due_date_now",t).replace("{date}",B(_,t)))}return m.length?i`<div class="trigger-live-hint">${m.join(" ")}</div>${C}`:C}_renderTriggerTypeFields(){let C=this._lang;return this._triggerType==="threshold"?i`
        <ms-textfield
          label="${e("trigger_above",C)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${H=>this._triggerAbove=H.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${e("trigger_below",C)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${H=>this._triggerBelow=H.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${e("trigger_equals",C)}"
          type="number"
          step="any"
          .value=${this._triggerEquals}
          @input=${H=>this._triggerEquals=H.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${e("trigger_not_equals",C)}"
          type="number"
          step="any"
          .value=${this._triggerNotEquals}
          @input=${H=>this._triggerNotEquals=H.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${e("for_at_least_minutes",C)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${H=>this._triggerForMinutes=H.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?i`
        <ms-textfield
          label="${e("target_value",C)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${H=>this._triggerTargetValue=H.target.value}
        ></ms-textfield>
        ${f({checked:this._triggerDeltaMode,onChange:H=>this._triggerDeltaMode=H.target.checked},i`${e("delta_mode",C)}`)}
        ${this._triggerDeltaMode?i`
              <ms-textfield
                label="${e("baseline_start_value",C)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${H=>this._triggerBaselineValue=H.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?e("baseline_start_help_edit",C):e("baseline_start_help",C)}
                ${this._taskId&&this._liveBaselineValue!=null?i`<div class="baseline-effective">
                      ${e("baseline_current_effective",C).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:n}
              </div>
            `:n}
      `:this._triggerType==="state_change"?i`
        ${this._renderStateField({label:e("from_state_optional",C),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:H=>this._triggerFromState=H})}
        <div class="field-help">${e("state_value_help",C)}</div>
        ${this._renderStateField({label:e("to_state_optional",C),value:this._triggerToState,entityId:this._triggerEntityId,onInput:H=>this._triggerToState=H})}
        <ms-textfield
          label="${e("target_changes",C)}"
          type="number"
          min=${d5[0]}
          .value=${this._triggerTargetChanges}
          @input=${H=>this._triggerTargetChanges=H.target.value}
        ></ms-textfield>
        <div class="field-help">${e("target_changes_help",C)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?i`<div class="field-help">${e("state_latch_help",C)}</div>`:n}
        <ms-textfield
          label="${e("for_at_least_minutes",C)}"
          type="number"
          min=${h1[0]}
          .value=${this._triggerForMinutes}
          @input=${H=>this._triggerForMinutes=H.target.value}
        ></ms-textfield>
        <div class="field-help">${e("for_minutes_state_help",C)}</div>
      `:this._triggerType==="runtime"?i`
        <ms-textfield
          label="${e("runtime_hours",C)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${H=>this._triggerRuntimeHours=H.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${e("runtime_max_session",C)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeMaxSession}
          @input=${H=>this._triggerRuntimeMaxSession=H.target.value}
        ></ms-textfield>
        <div class="field-help">${e("runtime_max_session_help",C)}</div>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:H=>this._triggerOnStates=H})}
        <div class="field-help">${e("runtime_on_states_help",C)}</div>
      `:this._triggerType==="due_date"?i`
        <ms-textfield
          label="${e("days_before",C)}"
          type="number"
          step="1"
          min=${P1[0]}
          max=${P1[1]}
          .value=${this._triggerDaysBefore}
          @input=${H=>this._triggerDaysBefore=H.target.value}
        ></ms-textfield>
        <div class="field-help">${e("days_before_help",C)}</div>
      `:n}_section(C,H,V){return i`<section class="form-section ${C}">
      <h3 class="section-title">${H}</h3>
      ${V}
    </section>`}_renderIdentity(C){return i`
          ${this._taskId===null&&this._objectChoices.length>0?i`
            <div class="select-row">
              ${w()?n:i`<label>${e("object",C)}</label>`}
              ${O({label:e("object",C),value:this._entryId,onChange:H=>{this._entryId=H.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},i`
                ${this._objectChoices.map(H=>i`<option value=${H.entry_id} ?selected=${H.entry_id===this._entryId}>${H.name}</option>`)}
              `)}
            </div>
          `:n}
          <ms-textfield
            label="${e("task_name",C)}"
            required
            .value=${this._name}
            @input=${H=>this._name=H.target.value}
          ></ms-textfield>
          <div class="select-row">
            ${w()?n:i`<label>${e("maintenance_type",C)}</label>`}
            ${O({label:e("maintenance_type",C),value:this._type,onChange:H=>this._type=H.target.value},i`
              ${R5.map(H=>i`<option value=${H} ?selected=${H===this._type}>${e(H,C)}</option>`)}
            `)}
          </div>
          <ms-textfield
            label="${e("notes_optional",C)}"
            multiline
            .rows=${3}
            .helper=${e("notes_markdown_hint",C)}
            .value=${this._notes}
            @input=${H=>this._notes=H.target.value}
          ></ms-textfield>
          ${this._renderDetails(C)}
          ${f({cls:"toggle-row",checked:this._enabled,onChange:H=>this._enabled=H.target.checked},i`${e("task_enabled",C)}`)}
    `}_renderDetails(C){return i`
      ${C1({cls:"details-section",open:this._detailsOpen,header:e("task_section_details",C)},i`
        <div class="select-row">
          ${w()?n:i`<label>${e("priority",C)}</label>`}
          ${O({label:e("priority",C),value:this._priority,onChange:H=>this._priority=H.target.value},i`
            ${Z2.map(H=>i`<option value=${H} ?selected=${H===this._priority}>${e("priority_"+H,C)}</option>`)}
          `)}
        </div>
        <ms-textfield
          label="${e("labels",C)}"
          placeholder="${e("labels_placeholder",C)}"
          helper="${e("labels_help",C)}"
          .value=${this._labels}
          @input=${H=>this._labels=H.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${e("documentation_url_optional",C)}"
          .value=${this._documentationUrl}
          @input=${H=>this._documentationUrl=H.target.value}
        ></ms-textfield>
        <ha-icon-picker
          .hass=${this.hass}
          label="${e("custom_icon_optional",C)}"
          .value=${this._customIcon}
          @value-changed=${H=>this._customIcon=H.detail.value||""}
        ></ha-icon-picker>
      `)}
    `}_renderScheduleSection(C){return this._section("schedule-section",e("task_section_schedule",C),i`
          <div class="select-row">
            ${w()?n:i`<label>${e("schedule_type",C)}</label>`}
            ${O({label:e("schedule_type",C),value:this._scheduleType,onChange:H=>this._scheduleType=H.target.value},i`
              ${A0.map(H=>i`<option value=${H} ?selected=${H===this._scheduleType}>${e(H,C)}</option>`)}
            `)}
          </div>
          ${this._scheduleType==="time_based"?i`
                <ms-textfield
                  label="${e("interval_value",C)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${H=>this._intervalDays=H.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  ${w()?n:i`<label>${e("interval_anchor",C)}</label>`}
                  ${O({label:e("interval_anchor",C),value:this._intervalAnchor,onChange:H=>this._intervalAnchor=H.target.value},i`
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${e("anchor_completion",C)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${e("anchor_planned",C)}</option>
                  `)}
                  <div class="field-help anchor-help">${e("interval_anchor_hint",C)}</div>
                </div>
              `:n}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?i`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${C}
                  label="${e("due_date",C)}"
                  .value=${this._dueDate}
                  @value-changed=${H=>this._dueDate=H.detail.value}
                ></ms-date-field>
              `:n}
          ${this.scheduleTimeEnabled&&B5.includes(this._scheduleType)?i`
            ${f({cls:"checkbox-row schedule-time-toggle",checked:this._scheduleTimeOn,onChange:H=>this._scheduleTimeOn=H.target.checked},i`<span>${e("schedule_time_toggle",C)}</span>`)}
            ${this._scheduleTimeOn?i`
              <ms-date-field
                kind="time"
                .hass=${this.hass}
                .lang=${C}
                .value=${this._scheduleTime}
                helper="${e("schedule_time_help",C)}"
                @value-changed=${H=>this._scheduleTime=H.detail.value}
              ></ms-date-field>
            `:n}
          `:n}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${C}
            label="${e("last_performed_optional",C)}"
            .value=${this._lastPerformed}
            @value-changed=${H=>this._lastPerformed=H.detail.value}
          ></ms-date-field>
          <ms-textfield
            label="${e("warning_days",C)}"
            type="number"
            min=${v2[0]}
            max=${v2[1]}
            .value=${this._warningDays}
            @input=${H=>this._warningDays=H.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${e("earliest_completion_days",C)}"
            helper="${e("earliest_completion_days_help",C)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${H=>this._earliestCompletionDays=H.target.value}
          ></ms-textfield>
          ${this._renderAdaptiveSection(C)}
    `)}_renderTriggerSection(C){return this._scheduleType!=="sensor_based"?n:this._section("trigger-section",e("task_section_trigger",C),i`
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?i`
            ${this._entityPickerFallback?i`
              <ms-textfield
                label="${e("environmental_entity_optional",C)}"
                helper="${e("environmental_entity_helper",C)}"
                .value=${this._environmentalEntity}
                @input=${H=>this._environmentalEntity=H.target.value.trim()}
              ></ms-textfield>
            `:i`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:_5}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>e("environmental_entity_optional",C)}
              .computeHelper=${()=>e("environmental_entity_helper",C)}
              @value-changed=${H=>{this._environmentalEntity=(H.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(C):n}
          `:n}
    `)}_renderCompletionSection(C){return this._section("completion-section",e("task_section_completion",C),i`
          ${this._type==="reading"?i`
                <ms-textfield
                  label="${e("reading_unit_label",C)}"
                  .value=${this._readingUnit}
                  @input=${H=>this._readingUnit=H.target.value}
                ></ms-textfield>
                <div class="field-help">${e("reading_unit_help",C)}</div>
                ${this._renderReadingsEditor(C)}
              `:n}
          ${this.checklistsEnabled?i`
            <label class="field-label" for="checklist-textarea">${e("checklist_steps_optional",C)}</label>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${e("checklist_placeholder",C)}"
              .value=${this._checklistText}
              @input=${H=>this._checklistText=H.target.value}
            ></textarea>
            <div class="field-help">${e("checklist_help",C)}</div>
          `:n}
          ${this._partsLoadFailed?i`<div class="field-help parts-load-failed">${e("parts_load_failed",C)}</div>`:n}
          ${this._isFleetTask?i`<div class="field-help parts-fleet-hint">${e("task_parts_fleet_hint",C)}</div>`:this.parts.length||this._foreignOwners.length?i`
                <div class="field">
                  <label>${e("consumes_parts_label",C)}</label>
                  ${this.parts.map(H=>this._renderConsumesRow(H))}
                  ${this._foreignOwners.length?i`
                        ${C1({cls:"shared-pools",open:this._hasForeignPick,header:e("shared_parts_other_objects",C)},i`
                          <div class="field-help">${e("shared_parts_help",C)}</div>
                          ${this._foreignOwners.map(H=>i`
                              <div class="shared-pool-owner">${H.name}</div>
                              ${H.parts.map(V=>this._renderConsumesRow(V,H.entry_id))}
                            `)}
                        `)}
                      `:n}
                </div>
              `:n}
          <div class="field-label">${e("require_on_completion",C)}</div>
          <div class="required-completion">
            ${x2.map(H=>i`
              ${f({cls:"req-option",checked:this._requiredCompletion.includes(H),onChange:V=>this._toggleRequired(H,V.target.checked)},i`<span>${e(_1[H],C)}</span>`)}
            `)}
          </div>
          ${this._availableTags.length>0?i`
              <div class="select-row">
                ${w()?n:i`<label>${e("nfc_tag_id_optional",C)}</label>`}
                ${O({label:e("nfc_tag_id_optional",C),value:this._nfcTagId,onChange:H=>this._nfcTagId=H.target.value},i`
                  <option value="" ?selected=${!this._nfcTagId}>${e("no_nfc_tag",C)}</option>
                  ${this._availableTags.map(H=>i`<option value=${H.id} ?selected=${H.id===this._nfcTagId}>${H.name}</option>`)}
                `)}
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${e("nfc_tags_refresh",C)}">↻</button>
              </div>
            `:i`
              <ms-textfield
                label="${e("nfc_tag_id_optional",C)}"
                .value=${this._nfcTagId}
                @input=${H=>this._nfcTagId=H.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${e("nfc_tags_empty_help",C)}
                <a href="/config/tags">${e("nfc_tags_open_settings",C)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${e("nfc_tags_refresh",C)}
                </button>
              </div>
            `}
          ${f({cls:"req-option",checked:this._requireTagScan,onChange:H=>this._requireTagScan=H.target.checked},i`<span>${e("require_tag_scan",C)}</span>`)}
          ${this._requireTagScan?i`<div class="field-help">${e("require_tag_scan_help",C)}</div>`:n}
          ${f({cls:"req-option",checked:!this._allowSkip,onChange:H=>this._allowSkip=!H.target.checked},i`<span>${e("disallow_skip",C)}</span>`)}
          ${this._allowSkip?n:i`<div class="field-help">${e("disallow_skip_help",C)}</div>`}
          ${this._renderQuickComplete(C)}
          ${this._renderCompleteWhen(C)}
          ${this._renderPhasesEditor(C)}
          ${this._renderCompletionActionsSection(C)}
    `)}_renderPeopleSection(C){return this._section("people-section",e("task_section_people",C),i`
          <div class="select-row">
            ${w()?n:i`<label>${e("responsible_user",C)}</label>`}
            ${O({label:e("responsible_user",C),value:this._responsibleUserId||"",onChange:H=>{let V=H.target.value;this._responsibleUserId=V||null}},i`
              <option value="" ?selected=${!this._responsibleUserId}>${e("no_user_assigned",C)}</option>
              ${this._availableUsers.map(H=>i`<option value=${H.id} ?selected=${H.id===this._responsibleUserId}>${H.name}</option>`)}
            `)}
          </div>
          ${this._availableUsers.length>=2?i`
            <div class="field">
              <label>${e("task_shared_with",C)}</label>
              <div class="field-help">${e("task_shared_with_help",C)}</div>
              ${this._responsibleUserId&&this._assigneePool.length>0&&!(this._assigneePool.length>=2&&this._rotationStrategy)?i`<div class="field-help shared-responsible-wins">${e("task_shared_responsible_wins",C)}</div>`:n}
              <div class="assignee-pool">
                ${this._availableUsers.map(H=>i`
                  ${f({cls:"pool-item",checked:this._assigneePool.includes(H.id),onChange:()=>this._toggleAssignee(H.id)},i`<span>${H.name}</span>`)}`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?i`
              <div class="select-row">
                ${w()?n:i`<label>${e("rotation_strategy",C)}</label>`}
                ${O({label:e("rotation_strategy",C),value:this._rotationStrategy,onChange:H=>this._rotationStrategy=H.target.value},i`
                  <option value="" ?selected=${!this._rotationStrategy}>${e("rotation_none",C)}</option>
                  ${b5.map(H=>i`<option value=${H} ?selected=${H===this._rotationStrategy}>${e("rotation_"+H,C)}</option>`)}
                `)}
              </div>`:n}
          `:n}
    `)}_renderNotificationsSection(C){return this._section("notifications-section",e("task_section_notifications",C),i`
          ${f({cls:"req-option",checked:!this._notifyEnabled,onChange:H=>this._notifyEnabled=!H.target.checked},i`<span>${e("no_notifications",C)}</span>`)}
          ${this._notifyEnabled?n:i`<div class="field-help">${e("no_notifications_help",C)}</div>`}
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${e("notify_icon",C)}"
            .value=${this._notifyIcon}
            @value-changed=${H=>this._notifyIcon=H.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||h2(this._type)}></ha-icon>
            ${e("notify_icon_hint",C).replace("{default}",h2(this._type))}
          </div>
          ${this._renderMirrorTodo(C)}
    `)}_renderMirrorTodo(C){let H=this.mirrorTodoDefault;if(!H.length)return i`
          <div class="field mirror-todo-field">
            ${this._renderMirrorTodoPicker(C)}
            <div class="field-help">${e("task_mirror_todo_hint",C)}</div>
          </div>`;let V=H.map(M=>F1(this.hass,M)).join(", "),t={default:e("task_mirror_todo_default",C).replace("{lists}",V),own:e("task_mirror_todo_own",C),none:e("task_mirror_todo_none",C)};return i`
          <div class="field mirror-todo-field">
            <div class="mirror-todo-choice" role="radiogroup" aria-label=${e("task_mirror_todo",C)}>
              <div class="field-label">${e("task_mirror_todo",C)}</div>
              ${Object.keys(t).map(M=>i`
                <label class="mirror-todo-option">
                  <input type="radio" name="mirror-todo" value=${M} .checked=${this._mirrorTodoMode===M}
                    @change=${()=>this._mirrorTodoMode=M} />
                  ${t[M]}
                </label>
              `)}
            </div>
            ${this._mirrorTodoMode==="own"?this._renderMirrorTodoPicker(C):n}
            ${this._mirrorTodoMode!=="none"?i`<div class="field-help">${e("task_mirror_todo_hint",C)}</div>`:n}
          </div>`}_renderMirrorTodoPicker(C){return i`
            ${this._entityPickerFallback?i`
              <ms-textfield
                label="${e("task_mirror_todo",C)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${H=>{this._mirrorTodoEntities=V2(this.hass,H.target.value.split(",").map(V=>V.trim()))}}
              ></ms-textfield>
            `:i`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"],exclude_entities:k5(this.hass)}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>e("task_mirror_todo",C)}
                @value-changed=${H=>{this._mirrorTodoEntities=V2(this.hass,H.detail.value.mirror_todo_entities||[])}}
              ></ha-form>`}
            <div class="field-help mirror-todo-max">${e("task_mirror_todo_max",C).replace("{max}",String(5))}</div>`}_ruleDraft(){let C=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];return{name:this._name,enabled:this._enabled,typeLabel:e(this._type,this._lang),scheduleType:this._scheduleType,intervalDays:this._intervalDays,intervalUnit:this._intervalUnit,intervalAnchor:this._intervalAnchor,dueDate:this._dueDate,weekdays:this._weekdays,nth:this._nth,nthWeekday:this._nthWeekday,domDay:this._domDay,domLastDay:this._domLastDay,calendarEntity:this._calendarEntity?F1(this.hass,this._calendarEntity):"",warningDays:this._warningDays,triggerType:this._triggerType,triggerEntityIds:C,triggerAttribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,daysBefore:this._triggerDaysBefore,triggerCombinator:this._triggerCombinator,entityLogic:this._triggerEntityLogic,compoundLogic:this._compoundLogic,compoundCount:this._compoundConditions.length,compoundEntityIds:this._compoundConditions.flatMap(H=>H.entityIds.split(",").map(V=>V.trim()).filter(Boolean)),completeWhenEntity:this._completeWhenEntity,completeWhenState:this._completeWhenState,completeWhenFor:this._completeWhenFor,completeWhenAnyTime:this._completeWhenAnyTime,quickOn:this._quickOn,requiredCount:this._requiredCompletion.length,allowSkip:this._allowSkip,requireTagScan:this._requireTagScan,checklistCount:this.checklistsEnabled?this._checklistText.split(`
`).filter(H=>H.trim()).length:0,partsCount:Object.keys(this._consumesParts).length,responsibleUserId:this._responsibleUserId,pool:this._assigneePool,rotation:this._rotationStrategy,notifyEnabled:this._notifyEnabled,mirrorLists:this._mirrorListsShown()}}_mirrorListsShown(){return this.mirrorTodoDefault.length?this._mirrorTodoMode==="default"?this.mirrorTodoDefault:this._mirrorTodoMode==="own"?this._mirrorTodoEntities:[]:this._mirrorTodoMode==="none"?[]:this._mirrorTodoEntities}_userName(C){return this._availableUsers.find(H=>H.id===C)?.name??C}_sidebarTitle(C,H){switch(C){case"task":return e("task_section_details",H);case"schedule":return e("task_section_schedule",H);case"trigger":return e("task_section_trigger",H);case"completion":return e("task_section_completion",H);case"people":return e("task_section_people",H);case"notifications":return e("task_section_notifications",H);default:return e("beta_rules_add_rule",H)}}_selectRule(C){this._ruleSel=this._ruleSel===C?null:C,C==="add"&&this._loadObjectDevice()}_removeRule(C){C==="trigger"?(this._resetTriggerFields(),this._scheduleType=parseInt(this._intervalDays,10)>0?"time_based":"manual"):C==="schedule"&&(this._scheduleType==="sensor_based"?this._intervalDays="":this._scheduleType="manual"),this._ruleSel===C&&(this._ruleSel=null)}_combineTrigger(C,H=""){if(this._triggerType!=="compound"){let V=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];this._compoundConditions=[{entityIds:V.join(", "),...this._typeFields(),carry:{}}],this._compoundLogic="OR",this._triggerType="compound",this._triggerEntityId="",this._triggerEntityIds=[]}this._compoundConditions=[...this._compoundConditions,{...t2(),type:C,entityIds:H}]}_setSensorRule(C,H=""){this._scheduleType!=="time_based"&&this._scheduleType!=="sensor_based"&&(this._intervalDays=""),this._scheduleType="sensor_based",this._resetTriggerFields(),this._triggerType=C,C==="compound"&&(this._compoundConditions=[t2()]),H&&(this._triggerEntityId=H,this._triggerEntityIds=[H],this._fetchEntityAttributes(H))}_applyChoice(C){if(C.kind==="schedule"){if(C.effect==="safety"){parseInt(this._intervalDays,10)>0||(this._intervalDays="30"),this._ruleSel="trigger";return}this._scheduleType==="sensor_based"&&this._resetTriggerFields(),C.value==="time_based"&&!(parseInt(this._intervalDays,10)>0)&&(this._intervalDays="30"),this._scheduleType=C.value,this._ruleSel="schedule";return}let H=C.value;C.effect==="combine"?this._combineTrigger(H):this._setSensorRule(H),this._ruleSel="trigger"}_applySuggestion(C){if(C.target==="done_when"){C.entityId!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=C.entityId,this._ruleSel="completion";return}let H=C.triggerType??"threshold";this._scheduleType==="sensor_based"&&(this._triggerType==="compound"||!!this._triggerEntityId)?this._combineTrigger(H,C.entityId):this._setSensorRule(H,C.entityId),this._ruleSel="trigger"}async _loadObjectDevice(){let C=this._entryId;if(!C||this._objectDevice?.entryId===C)return;let H=null,V=null;try{let M=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}))?.objects??[]).find(a=>a.entry_id===C);H=M?.object.ha_device_id??null,V=M?.object.area_id??null}catch{}this._entryId===C&&(this._objectDevice={entryId:C,deviceId:H,areaId:V})}async _loadTemplateChoices(){if(this._templateChoices===null)try{let C=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._templateChoices=(C?.templates??[]).filter(H=>!H.disabled).flatMap(H=>(H.tasks??[]).map(V=>({...V,template:H.name})))}catch{this._templateChoices=[]}}async _loadCopyChoices(){if(this._copyChoices===null)try{let C=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._copyChoices=(C?.objects??[]).flatMap(H=>(H.tasks??[]).filter(V=>!V.battery_fleet_task&&!V.part_ref).map(V=>({entryId:H.entry_id,objectName:H.object.name,task:V})))}catch{this._copyChoices=[]}}_applyTemplateTask(C){this._name=C.name,this._type=R5.includes(C.type)?C.type:"custom";let H=C.interval_days&&C.interval_days>0?String(C.interval_days):"";C.schedule_type==="sensor_based"?(this._scheduleType="sensor_based",this._intervalDays=H):C.schedule_type==="manual"||!H?this._scheduleType="manual":(this._scheduleType="time_based",this._intervalDays=H,this._intervalUnit="days"),C.warning_days!==null&&C.warning_days!==void 0&&(this._warningDays=String(C.warning_days)),this._betaStep="form",this._ruleSel=this._scheduleType==="sensor_based"?"add":"schedule",this._ruleSel==="add"&&(this._addTab="device",this._loadObjectDevice())}async _applyCopy(C){let H=this._entryId,V=this._objectChoices;await this._edit(C.entryId,C.task),this._taskId=null,this._entryId=H,this._objectChoices=V,this._series=[],this._isFleetTask=!1,this._lastPerformed="",this._nfcTagId="",this._consumesParts={},this._consumesQtyText={},this._phaseDefs=this._phaseDefs.map(t=>({...t,partId:"",partQty:"",extraParts:[]})),await Promise.all([this._loadParts(),this._loadForeignPools()]),this._betaStep="form",this._ruleSel="task"}_choiceNote(C,H){return C.effect==="replace"?e("beta_rules_replaces",H):C.effect==="combine"?e("beta_rules_combines",H):C.effect==="safety"?e("beta_rules_adds_safety",H):""}_renderAddPicker(C){let H=i`
      <div class="add-tabs" role="tablist" aria-label=${e("beta_rules_add_rule",C)}>
        <button type="button" role="tab" class="add-tab-type" aria-selected=${this._addTab==="type"?"true":"false"}
          @click=${()=>{this._addTab="type"}}>${e("beta_rules_by_type",C)}</button>
        <button type="button" role="tab" class="add-tab-device" aria-selected=${this._addTab==="device"?"true":"false"}
          @click=${()=>{this._addTab="device",this._loadObjectDevice()}}>${e("beta_rules_by_device",C)}</button>
      </div>`;if(this._addTab==="type"){let p=T5({scheduleType:this._scheduleType,intervalDays:this._intervalDays,triggerType:this._triggerType}),c=m=>{let u=this._choiceNote(m,C);return i`
          <button type="button" class="add-choice" data-kind=${m.kind} data-value=${m.value} @click=${()=>this._applyChoice(m)}>
            <ha-icon icon=${m.icon}></ha-icon>
            <span class="add-choice-text">
              <span>${m.kind==="trigger"?L2(m.value,C):e(m.value,C)}</span>
              ${u?i`<span class="add-choice-note">${u}</span>`:n}
            </span>
          </button>`};return i`${H}
        <div class="add-group">${e("task_section_schedule",C)}</div>
        ${p.filter(m=>m.kind==="schedule").map(c)}
        <div class="add-group">${e("task_section_trigger",C)}</div>
        ${p.filter(m=>m.kind==="trigger").map(c)}`}let V=this._objectDevice;if(V===null||V.entryId!==this._entryId)return i`${H}<div class="field-help">…</div>`;if(!V.deviceId&&!V.areaId)return i`${H}<div class="field-help beta-no-device">${e("beta_rules_no_device",C)}</div>`;let t=P5(this.hass,{deviceId:V.deviceId,areaId:V.areaId,ownPlatform:"maintenance_supporter"});if(!t.length)return i`${H}<div class="field-help beta-no-device">${e(V.deviceId?"beta_rules_no_device_entities":"beta_rules_no_area_entities",C)}</div>`;let M=V.areaId||(V.deviceId?this.hass.devices?.[V.deviceId]?.area_id:null)||"",a=this.hass.areas?.[M]?.name||M,s=t.some(p=>p.group==="device"),l=(p,c)=>{if(c>0&&t[c-1].group===p.group)return n;let m=p.group==="device"?e("beta_rules_group_device",C):e(s?"beta_rules_group_area_more":"beta_rules_group_area",C).replace("{area}",a);return i`<div class="add-group device-group" data-group=${p.group}>${m}</div>`};return i`${H}
      ${t.map((p,c)=>i`${l(p,c)}
        <div class="device-entity" data-entity=${p.entityId} data-group=${p.group}>
          <div class="device-entity-name">${p.name}</div>
          <div class="device-entity-choices">
            ${g2(p).map(m=>i`
              <button type="button" class="add-choice" data-target=${m.target} data-type=${m.triggerType??""} @click=${()=>this._applySuggestion(m)}>
                <ha-icon icon=${m.icon}></ha-icon>
                <span>${m.target==="done_when"?e("beta_rules_done_when_suggest",C):L2(m.triggerType??"",C)}</span>
              </button>`)}
          </div>
        </div>`)}`}_renderSidebarBody(C,H){switch(C){case"task":return this._renderIdentity(H);case"schedule":return this._renderScheduleSection(H);case"trigger":return this._renderTriggerSection(H);case"completion":return this._renderCompletionSection(H);case"people":return this._renderPeopleSection(H);case"notifications":return this._renderNotificationsSection(H);default:return this._renderAddPicker(H)}}_renderRules(C){let H=$5(this._ruleDraft(),{lang:C,entityName:p=>F1(this.hass,p),userName:p=>this._userName(p)}),V=new Map(H.map(p=>[p.id,p])),t=[{title:e("task_section_details",C),ids:["task"]},{title:e("task_section_schedule",C),ids:["schedule","trigger"],add:!0},{title:e("task_section_completion",C),ids:["completion"]},{title:e("task_section_people",C),ids:["people"]},{title:e("task_section_notifications",C),ids:["notifications"]}],M=0,a=1,s=[];for(let p of t){M+=2,s.push(i`<h3 class="rules-group-title" style="order:${M}">${p.title}</h3>`);for(let c of p.ids){let m=V.get(c);if(!m)continue;M+=2,this._ruleSel===c&&(a=M+1);let u=this._ruleSel===c;s.push(i`
          <div class="rule-row ${u?"selected":""}" data-row=${m.id} style="order:${M}">
            <button type="button" class="rule-main" aria-expanded=${u?"true":"false"} @click=${()=>this._selectRule(m.id)}>
              <ha-icon icon=${m.icon}></ha-icon>
              <span class="rule-text">
                <span class="rule-sentence">${m.text}</span>
                ${m.chips.map(_=>i`<span class="rule-chip">${_}</span>`)}
                ${m.badges.length?i`<span class="rule-badges">${m.badges.map(_=>i`<span class="rule-badge">${_}</span>`)}</span>`:n}
              </span>
            </button>
            ${m.removable?i`
              <ha-icon-button class="rule-remove" .path=${s0} .label=${e("remove",C)} title=${e("remove",C)}
                @click=${()=>this._removeRule(m.id)}></ha-icon-button>`:n}
          </div>`)}p.add&&(M+=2,this._ruleSel==="add"&&(a=M+1),s.push(i`
          <button type="button" class="rule-add" style="order:${M}" aria-expanded=${this._ruleSel==="add"?"true":"false"}
            @click=${()=>this._selectRule("add")}>
            <ha-icon icon="mdi:plus"></ha-icon>${e("beta_rules_add_rule",C)}
          </button>`))}let l=this._ruleSel;return i`
      <div class="rules-layout">
        ${s}
        <aside class="rules-sidebar ${l?"open":""}" style="order:${a}" aria-label=${l?this._sidebarTitle(l,C):e("beta_rules_select_hint",C)}>
          ${l?i`
                <div class="sidebar-head">
                  <ha-icon-button .path=${d0} .label=${e("close",C)} @click=${()=>{this._ruleSel=null}}></ha-icon-button>
                  <span class="sidebar-title">${this._sidebarTitle(l,C)}</span>
                </div>
                <div class="sidebar-body">${this._renderSidebarBody(l,C)}</div>`:i`<div class="sidebar-hint">${e("beta_rules_select_hint",C)}</div>`}
        </aside>
      </div>`}_renderObjectChoice(C){return this._taskId!==null||this._objectChoices.length===0?n:i`
      <div class="select-row">
        ${w()?n:i`<label>${e("object",C)}</label>`}
        ${O({label:e("object",C),value:this._entryId,onChange:H=>{this._entryId=H.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},i`
          ${this._objectChoices.map(H=>i`<option value=${H.entry_id} ?selected=${H.entry_id===this._entryId}>${H.name}</option>`)}
        `)}
      </div>`}_renderChooser(C){let H=(V,t,M,a,s)=>i`
      <button type="button" class="chooser-item ${V}" @click=${s}>
        <ha-icon icon=${t}></ha-icon>
        <span class="chooser-text">
          <span class="chooser-title">${M}</span>
          <span class="chooser-desc">${a}</span>
        </span>
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>`;return i`
      ${this._renderObjectChoice(C)}
      <div class="chooser">
        ${H("chooser-scratch","mdi:pencil",e("beta_new_scratch",C),e("beta_new_scratch_desc",C),()=>{this._betaStep="form",this._ruleSel="task"})}
        ${H("chooser-sensor","mdi:auto-fix",e("beta_new_from_sensor",C),e("beta_new_from_sensor_desc",C),()=>{this._betaStep="form",this._ruleSel="add",this._addTab="device",this._loadObjectDevice()})}
        ${H("chooser-template","mdi:text-box-outline",e("templates_from",C),e("beta_new_from_template_desc",C),()=>{this._betaStep="template",this._chooserFilter="",this._loadTemplateChoices()})}
        ${H("chooser-copy","mdi:content-copy",e("beta_new_copy",C),e("beta_new_copy_desc",C),()=>{this._betaStep="copy",this._chooserFilter="",this._loadCopyChoices()})}
      </div>`}_renderSearch(C){return i`<input type="search" class="chooser-search" aria-label=${e("beta_new_search",C)} placeholder=${e("beta_new_search",C)}
      .value=${this._chooserFilter} @input=${H=>{this._chooserFilter=H.target.value}} />`}_renderTemplatePick(C){if(this._templateChoices===null)return i`<div class="chooser-empty">…</div>`;let H=this._chooserFilter.trim().toLowerCase(),V=this._templateChoices.filter(t=>!H||`${t.name} ${t.template}`.toLowerCase().includes(H)).slice(0,200);return i`
      ${this._renderSearch(C)}
      <div class="chooser">
        ${V.length?V.map(t=>i`
          <button type="button" class="chooser-item template-task" @click=${()=>this._applyTemplateTask(t)}>
            <ha-icon icon=${t.schedule_type==="sensor_based"?"mdi:gauge":"mdi:calendar-sync"}></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${t.name}</span>
              <span class="chooser-desc">${t.template}${t.interval_days?i` · ${h(t.interval_days,C)} ${e("unit_days",C)}`:n}</span>
            </span>
          </button>`):i`<div class="chooser-empty">—</div>`}
      </div>`}_renderCopyPick(C){if(this._copyChoices===null)return i`<div class="chooser-empty">…</div>`;let H=this._chooserFilter.trim().toLowerCase(),V=this._copyChoices.filter(t=>!H||`${t.task.name} ${t.objectName}`.toLowerCase().includes(H)).slice(0,200);return i`
      ${this._renderSearch(C)}
      <div class="chooser">
        ${V.length?V.map(t=>i`
          <button type="button" class="chooser-item copy-task" @click=${()=>{this._applyCopy(t)}}>
            <ha-icon icon="mdi:content-copy"></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${t.task.name}</span>
              <span class="chooser-desc">${t.objectName}</span>
            </span>
          </button>`):i`<div class="chooser-empty">—</div>`}
      </div>`}_renderBeta(C,H,V){let t=this._betaStep;return i`
      <ha-dialog open class="beta-dialog" .headerTitle=${H}
        .headerSubtitle=${this._series.length>1?e("task_series_position",C).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length)):void 0}
        @closed=${this._close}>
        <!-- HA's header (2026): the title beside the close button; on a
             step under the start screen HA's back arrow takes its place. -->
        ${t==="template"||t==="copy"?i`<ha-icon-button slot="headerNavigationIcon" class="beta-back" .path=${l0} .label=${e("back",C)}
              @click=${()=>{this._betaStep="choose"}}></ha-icon-button>`:n}
        <div class="content beta-content">
          ${this._error?$("error",this._error):n}
          ${this._warning?$("warning",this._warning):n}
          ${t==="choose"?this._renderChooser(C):t==="template"?this._renderTemplatePick(C):t==="copy"?this._renderCopyPick(C):this._renderRules(C)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${e("cancel",C)}</ha-button>
          ${t==="form"&&V?i`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${e("task_series_skip",C)}
              </ha-button>`:n}
          ${t==="form"?i`<ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}>
                ${this._loading?e("saving",C):e(V?"task_series_save_next":"save",C)}
              </ha-button>`:n}
        </div>
      </ha-dialog>
    `}render(){if(!this._open)return i``;let C=this._lang,H=this._taskId?e("edit_task",C):e("new_task",C),V=this._seriesIndex+1<this._series.length;return this.betaEditor?this._renderBeta(C,H,V):i`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">
          ${H}
          ${this._series.length>1?i`<span class="series-position">${e("task_series_position",C).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length))}</span>`:n}
        </div>
        <div class="content">
          ${this._error?$("error",this._error):n}
          ${this._warning?$("warning",this._warning):n}
          ${this._renderIdentity(C)}
          ${this._renderScheduleSection(C)}
          ${this._renderTriggerSection(C)}
          ${this._renderCompletionSection(C)}
          ${this._renderPeopleSection(C)}
          ${this._renderNotificationsSection(C)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${e("cancel",C)}</ha-button>
          ${V?i`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${e("task_series_skip",C)}
              </ha-button>`:n}
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}
          >
            ${this._loading?e("saving",C):e(V?"task_series_save_next":"save",C)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};A._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calMonths","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),A.styles=[x1,n5,E5,Z`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* #129: entity/state pickers in the trigger form (ha-form + selector) */
    .entity-picker-form,
    .state-picker-form {
      display: block;
      margin: 8px 0;
    }
    /* D#229: one option per line — three sentences flowed into each other. */
    .trigger-end,
    .mirror-todo-choice {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 8px 0;
    }
    .trigger-end-option,
    .mirror-todo-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    /* v1.3.0: completion-action sections (.adaptive-section shares the shell
       but keeps its own class — tests count .ca-section elements) */
    .ca-section,
    .adaptive-section,
    .phases-section,
    .details-section {
      border: 1px solid var(--divider-color);
      border-radius: var(--ms-radius-6, 6px);
      padding: 8px 12px;
      margin-top: 8px;
    }
    .ca-section > summary,
    .adaptive-section > summary,
    .phases-section > summary,
    .details-section > summary {
      cursor: pointer;
      font-weight: 500;
    }
    .phases-section,
    .details-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .adaptive-section ms-textfield {
      width: 100%;
      margin-top: 8px;
      display: block;
    }
    .adaptive-section label {
      display: block;
      margin-top: 8px;
    }
    .ca-section ms-textfield,
    .ca-section ha-entity-picker,
    .ca-section ha-service-picker,
    .ca-section ha-form,
    .ca-section .qc-feedback {
      width: 100%;
      margin-top: 8px;
      display: block;
    }
    .ca-section .qc-feedback {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .ca-test-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }
    .ca-test-ok { color: var(--success-color, #4caf50); font-size: 13px; }
    .ca-test-error { color: var(--error-color, #f44336); font-size: 13px; font-weight: 500; }
    .ca-test-error-block { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
    .ca-test-error-detail {
      font-size: 12px;
      color: var(--secondary-text-color);
      background: rgba(244, 67, 54, 0.08);
      padding: 6px 8px; border-radius: 4px;
      line-height: 1.4;
      word-break: break-word;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 350px;
      max-height: 70vh;
      overflow-y: auto;
    }
    /* A phone, and a phone held sideways: 70 % of 390 px plus the title and
       the buttons was taller than the screen, so Save sat below its edge
       with nothing to scroll (2026-10-31). The dialog scrolls as a whole. */
    @media (max-width: 600px), (max-height: 500px) {
      .content {
        min-width: 0;
        max-height: none;
      }
    }
    .dialog-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    /* #233: what a one-tap completion cannot answer */
    .quick-complete-note {
      color: var(--warning-color, #ff9800);
    }
    /* #232: a responsible person outranks the people it is shared with */
    .shared-responsible-wins {
      color: var(--warning-color, #ff9800);
    }
    /* #235: "2 of 5" while a series of tasks is edited */
    .series-position {
      margin-inline-start: 8px;
      font-size: 14px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    ms-textfield {
      display: block;
    }
    .checklist-textarea {
      width: 100%;
      min-height: 88px;
      padding: 8px;
      font-family: inherit;
      font-size: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      resize: vertical;
      box-sizing: border-box;
    }
    .consumes-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 2px 0;
    }
    .phase-def {
      border: 1px solid var(--divider-color);
      border-radius: var(--ms-radius-6, 6px);
      padding: 8px;
      margin: 6px 0;
    }
    .phase-def-head {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .phase-def-head ms-textfield {
      flex: 1;
      min-width: 0;
    }
    .phase-part {
      max-width: 160px;
      padding: 6px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .phase-qty {
      width: 64px;
      padding: 6px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    /* On a phone the name gets its own line: beside a part and its
     * quantity it was squeezed to nothing (audit 2026-10-17). */
    @media (max-width: 600px) {
      .phase-def-head {
        flex-wrap: wrap;
      }
      .phase-def-head ms-textfield {
        flex-basis: 100%;
      }
      .phase-part {
        flex: 1 1 0;
        min-width: 0;
        max-width: none;
      }
    }
    .phase-checklist {
      min-height: 56px;
      margin-top: 6px;
    }
    .phase-req-toggle {
      margin-top: 6px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .phase-req-fields {
      margin: 2px 0 0 22px;
      font-size: 13px;
    }
    .phase-remove {
      display: inline-flex;
      --ha-icon-button-size: 36px;
      --mdc-icon-button-size: 36px;
      color: var(--secondary-text-color);
    }
    /* #161 phase 2: reading slots — name wide, unit narrow, trash. */
    .readings-editor { margin-top: 14px; }
    .reading-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 4px 0;
    }
    .reading-row .reading-name { flex: 2; min-width: 0; }
    .reading-row .reading-unit { flex: 1; min-width: 0; max-width: 140px; }
    .reading-dup { color: var(--warning-color, #ff9800); margin-top: 6px; }
    .phase-seq-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 8px;
    }
    .phase-seq {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 4px 0;
    }
    .phase-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 12px;
      background: var(--secondary-background-color);
      font-size: 13px;
    }
    .phase-chip-x {
      border: none;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 0 2px;
      font-size: 12px;
    }
    .phase-seq-add {
      padding: 4px 8px;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .consumes-check {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
    }
    .consumes-qty {
      width: 64px;
      padding: 4px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    /* #111: other objects' pools sit behind a disclosure so the object's OWN
       parts stay the primary list; each group is headed by the owning object's
       name, so which pool a checkbox means is never a guess. */
    .shared-pools {
      margin-top: 6px;
    }
    .shared-pools > summary {
      cursor: pointer;
      padding: 2px 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .shared-pool-owner {
      margin-top: 6px;
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .qc-cost { display: flex; flex-direction: column; gap: 4px; margin: 8px 0; }
    .qc-cost-label { font-size: 12px; color: var(--secondary-text-color); }
    .baseline-effective {
      margin-top: 2px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    /* Live computed trigger hint — reads the bound sensor and explains what
       happens next. Info-accented so it reads as guidance, not an error. */
    .trigger-live-hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      border-left: 3px solid var(--info-color, #2196f3);
      background: rgba(33, 150, 243, 0.08);
      border-radius: 0 6px 6px 0;
      padding: 6px 10px;
      margin: 4px 0;
    }
    .trigger-live-hint.warn {
      color: var(--primary-text-color);
      border-left-color: var(--warning-color, #ff9800);
      background: rgba(255, 152, 0, 0.1);
    }
    .field-help a,
    .link-button {
      background: none;
      border: 0;
      padding: 0;
      color: var(--primary-color);
      cursor: pointer;
      font: inherit;
      text-decoration: underline;
    }
    .field-help a:hover,
    .link-button:hover {
      text-decoration: none;
    }
    /* Smaller refresh icon-button when shown next to the dropdown. */
    .select-row .link-button {
      margin-left: 8px;
      text-decoration: none;
      font-size: 16px;
    }
    .select-row .link-button:hover {
      color: var(--primary-color);
      opacity: 0.7;
    }
    .assignee-pool {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      margin-top: 4px;
    }
    .schedule-time-toggle {
      display: flex;
      margin: 8px 0 4px;
    }
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
    .season-chip {
      padding: 6px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 16px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
    }
    .season-chip.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .error.warning { color: var(--warning-color, #ff9800); }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .required-completion {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 16px;
    }
  `],o([v({attribute:!1})],A.prototype,"hass",2),o([v({type:Boolean,attribute:"checklists-enabled"})],A.prototype,"checklistsEnabled",2),o([v({type:Boolean,attribute:"schedule-time-enabled"})],A.prototype,"scheduleTimeEnabled",2),o([v({type:Boolean,attribute:"completion-actions-enabled"})],A.prototype,"completionActionsEnabled",2),o([v({type:Boolean,attribute:"adaptive-feature"})],A.prototype,"adaptiveFeature",2),o([v({type:Boolean,attribute:"seasonal-feature"})],A.prototype,"seasonalFeature",2),o([v({type:Boolean,attribute:"environmental-feature"})],A.prototype,"environmentalFeature",2),o([v({type:Number,attribute:"default-warning-days"})],A.prototype,"defaultWarningDays",2),o([v({attribute:!1})],A.prototype,"mirrorTodoDefault",2),o([v({type:Boolean,attribute:"beta-editor"})],A.prototype,"betaEditor",2),o([d()],A.prototype,"_ruleSel",2),o([d()],A.prototype,"_addTab",2),o([d()],A.prototype,"_betaStep",2),o([d()],A.prototype,"_chooserFilter",2),o([d()],A.prototype,"_templateChoices",2),o([d()],A.prototype,"_copyChoices",2),o([d()],A.prototype,"_objectDevice",2),o([d()],A.prototype,"parts",2),o([d()],A.prototype,"_foreignOwners",2),o([d()],A.prototype,"_open",2),o([d()],A.prototype,"_entityPickerFallback",2),o([d()],A.prototype,"_loading",2),o([d()],A.prototype,"_error",2),o([d()],A.prototype,"_warning",2),o([d()],A.prototype,"_entryId",2),o([d()],A.prototype,"_taskId",2),o([d()],A.prototype,"_series",2),o([d()],A.prototype,"_seriesIndex",2),o([d()],A.prototype,"_isFleetTask",2),o([d()],A.prototype,"_objectChoices",2),o([d()],A.prototype,"_name",2),o([d()],A.prototype,"_type",2),o([d()],A.prototype,"_scheduleType",2),o([d()],A.prototype,"_intervalDays",2),o([d()],A.prototype,"_intervalUnit",2),o([d()],A.prototype,"_dueDate",2),o([d()],A.prototype,"_warningDays",2),o([d()],A.prototype,"_earliestCompletionDays",2),o([d()],A.prototype,"_intervalAnchor",2),o([d()],A.prototype,"_weekdays",2),o([d()],A.prototype,"_nth",2),o([d()],A.prototype,"_nthWeekday",2),o([d()],A.prototype,"_domDay",2),o([d()],A.prototype,"_domLastDay",2),o([d()],A.prototype,"_domBusiness",2),o([d()],A.prototype,"_calOffset",2),o([d()],A.prototype,"_calMonths",2),o([d()],A.prototype,"_calendarEntity",2),o([d()],A.prototype,"_seasonMonths",2),o([d()],A.prototype,"_endsMode",2),o([d()],A.prototype,"_endsCount",2),o([d()],A.prototype,"_endsUntil",2),o([d()],A.prototype,"_schedulePreview",2),o([d()],A.prototype,"_schedulePreviewEnded",2),o([d()],A.prototype,"_notes",2),o([d()],A.prototype,"_documentationUrl",2),o([d()],A.prototype,"_customIcon",2),o([d()],A.prototype,"_notifyIcon",2),o([d()],A.prototype,"_priority",2),o([d()],A.prototype,"_labels",2),o([d()],A.prototype,"_detailsOpen",2),o([d()],A.prototype,"_mirrorTodoEntities",2),o([d()],A.prototype,"_mirrorTodoMode",2),o([d()],A.prototype,"_completeWhenEntity",2),o([d()],A.prototype,"_completeWhenState",2),o([d()],A.prototype,"_completeWhenAnyTime",2),o([d()],A.prototype,"_completeWhenFor",2),o([d()],A.prototype,"_enabled",2),o([d()],A.prototype,"_triggerEntityId",2),o([d()],A.prototype,"_triggerEntityIds",2),o([d()],A.prototype,"_triggerEntityLogic",2),o([d()],A.prototype,"_triggerAttribute",2),o([d()],A.prototype,"_triggerType",2),o([d()],A.prototype,"_triggerAbove",2),o([d()],A.prototype,"_triggerBelow",2),o([d()],A.prototype,"_triggerEquals",2),o([d()],A.prototype,"_triggerNotEquals",2),o([d()],A.prototype,"_triggerForMinutes",2),o([d()],A.prototype,"_triggerCombinator",2),o([d()],A.prototype,"_triggerTargetValue",2),o([d()],A.prototype,"_triggerDeltaMode",2),o([d()],A.prototype,"_triggerBaselineValue",2),o([d()],A.prototype,"_liveBaselineValue",2),o([d()],A.prototype,"_autoCompleteOnRecovery",2),o([d()],A.prototype,"_holdUntilDone",2),o([d()],A.prototype,"_triggerFromState",2),o([d()],A.prototype,"_triggerToState",2),o([d()],A.prototype,"_triggerTargetChanges",2),o([d()],A.prototype,"_triggerRuntimeHours",2),o([d()],A.prototype,"_triggerDaysBefore",2),o([d()],A.prototype,"_triggerRuntimeMaxSession",2),o([d()],A.prototype,"_triggerOnStates",2),o([d()],A.prototype,"_triggerDetailAttribute",2),o([d()],A.prototype,"_compoundLogic",2),o([d()],A.prototype,"_compoundConditions",2),o([d()],A.prototype,"_suggestedAttributes",2),o([d()],A.prototype,"_availableAttributes",2),o([d()],A.prototype,"_entityDomain",2),o([d()],A.prototype,"_lastPerformed",2),o([d()],A.prototype,"_nfcTagId",2),o([d()],A.prototype,"_requireTagScan",2),o([d()],A.prototype,"_allowSkip",2),o([d()],A.prototype,"_notifyEnabled",2),o([d()],A.prototype,"_readingUnit",2),o([d()],A.prototype,"_readings",2),o([d()],A.prototype,"_consumesParts",2),o([d()],A.prototype,"_consumesQtyText",2),o([d()],A.prototype,"_partsLoadFailed",2),o([d()],A.prototype,"_availableTags",2),o([d()],A.prototype,"_responsibleUserId",2),o([d()],A.prototype,"_assigneePool",2),o([d()],A.prototype,"_rotationStrategy",2),o([d()],A.prototype,"_availableUsers",2),o([d()],A.prototype,"_checklistText",2),o([d()],A.prototype,"_phaseDefs",2),o([d()],A.prototype,"_phaseSeq",2),o([d()],A.prototype,"_requiredCompletion",2),o([d()],A.prototype,"_scheduleTime",2),o([d()],A.prototype,"_scheduleTimeOn",2),o([d()],A.prototype,"_actionService",2),o([d()],A.prototype,"_actionTargetEntity",2),o([d()],A.prototype,"_actionSkipAuto",2),o([d()],A.prototype,"_actionPresent",2),o([d()],A.prototype,"_actionData",2),o([d()],A.prototype,"_actionDataJsonFallback",2),o([d()],A.prototype,"_actionTesting",2),o([d()],A.prototype,"_actionTestResult",2),o([d()],A.prototype,"_actionTestError",2),o([d()],A.prototype,"_quickOn",2),o([d()],A.prototype,"_qcNotes",2),o([d()],A.prototype,"_qcCost",2),o([d()],A.prototype,"_qcDuration",2),o([d()],A.prototype,"_qcFeedback",2),o([d()],A.prototype,"_environmentalEntity",2),o([d()],A.prototype,"_environmentalAttribute",2),o([d()],A.prototype,"_adaptiveEnabled",2),o([d()],A.prototype,"_adaptiveAlpha",2),o([d()],A.prototype,"_adaptiveMin",2),o([d()],A.prototype,"_adaptiveMax",2),o([d()],A.prototype,"_adaptiveSeasonal",2),o([d()],A.prototype,"_adaptivePrediction",2),o([d()],A.prototype,"_conditionAttrOptions",2);var _2=A;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",_2);async function h0(L,r,C){let H=L.auth;if(H?.expired&&H.refreshAccessToken)try{await H.refreshAccessToken()}catch{}return fetch(r,{...C,headers:{...C.headers??{},Authorization:`Bearer ${H?.data?.access_token??""}`}})}var Z0=100*1024*1024,R4=500*1024*1024;async function S0(L,r,C,H="doc_too_large",V=[]){let t=await h0(L,r,{method:"POST",body:C});if(t.status===413)throw new Error(H);if(!t.ok){let M=await t.json().catch(()=>null);throw typeof M?.code=="string"&&V.includes(M.code)?new Error(M.code):new Error("doc_upload_failed")}return await t.json()}async function g0(L,r,C,H,V){if(C.size>Z0)throw new Error("doc_too_large");let t=new FormData;t.append("entry_id",r);for(let a of H)t.append("tags",a);V&&t.append("purpose",V),t.append("file",C,C.name);let M=await S0(L,"/api/maintenance_supporter/document/upload",t);if(!M.id)throw new Error("doc_upload_failed");return{id:M.id,deduped:!!M.deduped,duplicate_in_object:M.duplicate_in_object??null}}async function W5(L,r,C){return(await g0(L,r,C,["photo"],"completion")).id}async function f2(L,r,C){await Promise.all(C.map(H=>L.connection.sendMessagePromise({type:"maintenance_supporter/documents/discard_upload",entry_id:r,doc_id:H}).catch(()=>{})))}var f1=class{constructor(r,C){this.host=r;this.opts=C;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=C.max??10,r.addController(this)}hostConnected(){}get ids(){return this.photos.map(r=>r.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(r){return this.errorKey?e(this.errorKey,r).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(r=[]){this._endSession(),this._revokeAll(),this.photos=r.map(C=>({id:C,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(r){if(r.length===0)return;let C=this._session,H=this.opts.hass(),V=this.opts.entryId(),t=r.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let M of t){let a=await W5(H,V,M);if(C!==this._session){f2(H,V,[a]);return}this.uploadedIds=[...this.uploadedIds,a],this._uploadEntry.set(a,V),this.photos=[...this.photos,{id:a,preview:URL.createObjectURL(M)}],this.host.requestUpdate()}r.length>t.length&&(this.errorKey="photos_limit")}catch(M){if(C!==this._session)return;this.errorKey=M instanceof Error&&M.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{C===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(r){let C=this.photos.find(H=>H.id===r);C?.preview&&URL.revokeObjectURL(C.preview),this.photos=this.photos.filter(H=>H.id!==r),this.uploadedIds.includes(r)&&(this.uploadedIds=this.uploadedIds.filter(H=>H!==r),this._discard([r])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let r=this.uploadedIds;this.uploadedIds=[],this._discard(r)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(r){let C=new Map;for(let V of r){let t=this._uploadEntry.get(V)??this.opts.entryId();this._uploadEntry.delete(V),C.set(t,[...C.get(t)??[],V])}let H=this.opts.hass();for(let[V,t]of C)f2(H,V,t)}_revokeAll(){for(let r of this.photos)r.preview&&URL.revokeObjectURL(r.preview)}};function i2(){if(window.externalApp!==void 0)return!0;let r=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(r)&&/Android/.test(r)}function _0(L){!(L instanceof HTMLElement)||typeof L.showPopover!="function"||queueMicrotask(()=>{if(!(!L.isConnected||L.matches(":popover-open")))try{L.showPopover()}catch{}})}var M2=j1(_0),a2=Z`
  :where(.top-layer[popover]) {
    position: fixed;
    inset: 0;
    width: auto;
    height: auto;
    max-width: none;
    max-height: none;
    margin: 0;
    border: 0;
    padding: 0;
    overflow: visible;
    color: inherit;
    background: none;
  }
`;var y2={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraLabel:"msp-camera-label",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort",areaSort:"msp-area-sort",objectTreeOpen:"msp-object-tree-open",objectTableSort:"msp-object-table-sort",filterPane:"msp-filter-pane"};function U5(L){try{return localStorage.getItem(L)}catch{return null}}function z5(L,r){try{localStorage.setItem(L,r)}catch{}}function X5(){if(!i2())return!1;let L=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!L&&typeof L.getUserMedia=="function"}var f0=1920,y0=.88,b0={retryMs:500,windowMs:5e3},O0=new Set(["NotReadableError","AbortError","TrackStartError"]),j5=80,J5=/back|rear|environment|rück|hinten/i,Q5=/front|user|selfie|vorne/i;function G5(L){let r=/camera2?\s*(\d+)/i.exec(L);return r?Number(r[1]):Number.MAX_SAFE_INTEGER}function K5(L,r){if(r){let H=L.find(V=>V.label===r);if(H)return H}return L.filter(H=>H.label&&J5.test(H.label)).sort((H,V)=>G5(H.label)-G5(V.label))[0]??null}var Y5=L=>L?.name||"Error",k0=L=>L?.message||"",N=class extends b{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...b0};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let C=++this._gen;try{await this._acquireAndShow(C)}finally{this._opening=!1}}_live(C){return C===this._gen&&this.isConnected}async _acquireAndShow(C){let H=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!H||typeof H.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let V=U5(y2.cameraLabel),t=await this._enumerate(H);if(!this._live(C))return;let M=K5(t,V),a="refused";if(M&&(a=await this._openPatiently(H,C,this._byDevice(M))),a==="cancelled")return;if(a!=="ok"){if(a=await this._openPatiently(H,C,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),a==="cancelled")return;if(a!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(t=await this._enumerate(H),!this._live(C)){this._stopStream();return}}if(this._devices=t,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(C)){this._stopStream(),this._open=!1;return}await this._attach();let s=M?null:K5(t,V),l=this._deviceIndex>=0?t[this._deviceIndex]:void 0;if(!s||s.deviceId===l?.deviceId)return;let p=await this._replace(H,C,[this._byDevice(s)],this._restoreCandidates(l));if(p!=="cancelled"){if(p==="lost"){this._unavailable("camera_lost");return}this._settle(p)}}async _openPatiently(C,H,V){let t=Date.now();for(;;){let M;try{M=await C.getUserMedia({video:V.video,audio:!1})}catch(a){let s=Y5(a),l=k0(a);if(this._lastError=s,this._note(`${V.what} \u2192 ${s}${l&&l!==s?`: ${l}`:""}`),!this._live(H))return"cancelled";if(!O0.has(s))return"refused";if(Date.now()-t+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(p=>setTimeout(p,this.timing.retryMs)),!this._live(H))return"cancelled";continue}if(!this._live(H)){for(let a of M.getTracks())a.stop();return"cancelled"}return this._stream=M,this._note(`${V.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(C,H,V,t){this._switching=!0,this._stopStream();try{for(let M of V){let a=await this._openPatiently(C,H,M);if(a==="ok")return M;if(a==="cancelled")return a;if(a==="busy"){M.deviceId&&this._refused.add(M.deviceId);break}}for(let M of t){let a=await this._openPatiently(C,H,M);if(a==="ok")return"restored";if(a==="cancelled")return a}return"lost"}finally{this._switching=!1}}_settle(C){if(C==="restored"){this._switchFailed=!0;let V=this._indexOfCurrent();return V>=0&&(this._deviceIndex=V),this._attach(),!1}this._switchFailed=!1;let H=C.deviceId?this._devices.findIndex(V=>V.deviceId===C.deviceId):-1;return this._deviceIndex=H>=0?H:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(C){return{video:{deviceId:{exact:C.deviceId}},what:C.label||"camera (no label)",deviceId:C.deviceId}}_restoreCandidates(C,H){let V=[],t=C?.deviceId||H;return t&&V.push({video:{deviceId:{exact:t}},what:`${C?.label||"previous camera"} (back again)`,deviceId:t}),V.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),V}async _attach(){let C=this._video;if(!(!C||!this._stream)){C.srcObject=this._stream;try{await C.play()}catch{}}}async _enumerate(C){if(typeof C.enumerateDevices!="function")return[];try{let H=(await C.enumerateDevices()).filter(V=>V.kind==="videoinput"&&!!V.deviceId);return this._note(`cameras: ${H.map(V=>V.label||"(no label)").join(" | ")||"none listed"}`),H}catch(H){return this._note(`enumerateDevices \u2192 ${Y5(H)}`),[]}}_indexOfCurrent(){let C=this._stream?.getVideoTracks()[0];if(!C)return-1;let H=C.getSettings().deviceId,V=H?this._devices.findIndex(t=>t.deviceId===H):-1;return V>=0?V:C.label?this._devices.findIndex(t=>t.label===C.label):-1}_currentFacing(){let C=this._stream?.getVideoTracks()[0],H=C?.getSettings().facingMode;if(H==="user"||H==="environment")return H;let V=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||C?.label||"";return Q5.test(V)?"user":J5.test(V)?"environment":this._facing}_describeTrack(){let C=this._stream?.getVideoTracks()[0];if(!C)return"no track";let H=C.getSettings(),V=H.width&&H.height?`${H.width}\xD7${H.height}`:"size ?";return[C.label||"no label",V,H.facingMode].filter(Boolean).join(", ")}_note(C){this._log.push(`+${Date.now()-this._t0} ms ${C}`),this._log.length>j5&&this._log.splice(1,this._log.length-j5)}async _switchCamera(){let C=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!C||this._devices.length<2||this._busy||this._switching)return;let H=this._gen,V=this._deviceIndex,t=V>=0?this._devices[V]:void 0,M=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||t?.deviceId,a=this._facing==="user"?"environment":"user",s=this._nextCameras(V,M);!s.length&&this._refused.size&&(this._refused.clear(),s=this._nextCameras(V,M)),this._note(`switch from ${t?.label||"unknown camera"}`);let l=[...s.map(p=>this._byDevice(this._devices[p])),{video:{facingMode:{exact:a}},what:`facing ${a} (exact)`},{video:{facingMode:{ideal:a}},what:`facing ${a}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let p=await this._replace(C,H,l,this._restoreCandidates(t,M));if(p==="cancelled")return;if(p==="lost"){this._unavailable("camera_lost");return}if(p!=="restored"&&!p.deviceId){if(this._isCamera(M,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=a}if(this._settle(p)&&p!=="restored"&&p.deviceId){let c=this._devices[this._deviceIndex]?.label??"";c&&z5(y2.cameraLabel,Q5.test(c)?"":c)}}finally{this._busy=!1}}_nextCameras(C,H){let V=this._devices.length,t=[];for(let M=1;M<=(C<0?V:V-1);M++){let a=(C+M)%V,s=this._devices[a].deviceId;s===H||this._refused.has(s)||t.push(a)}return t}_isCamera(C,H){let V=this._stream?.getVideoTracks()[0]?.getSettings();return C&&V?.deviceId?V.deviceId===C:!!V?.facingMode&&V.facingMode===H}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let H of this._stream?.getTracks()??[])H.stop();this._stream=null;let C=this._video;C&&(C.srcObject=null)}_unavailable(C){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:C},bubbles:!0,composed:!0}))}async _copyLog(){let C=this._log.join(`
`),H=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(C),H=!0)}catch{}if(!H){let V=this.shadowRoot?.querySelector(".details textarea");if(V){V.focus(),V.select();try{H=document.execCommand("copy")}catch{H=!1}}}this._copied=H}async _shoot(){let C=this._video;if(!(!C||this._busy||this._switching)){this._busy=!0;try{let H=C.videoWidth||640,V=C.videoHeight||480,t=Math.min(1,f0/Math.max(H,V)),M=document.createElement("canvas");M.width=Math.round(H*t),M.height=Math.round(V*t);let a=M.getContext("2d");if(!a)throw new Error("no_canvas");a.drawImage(C,0,0,M.width,M.height);let s=await new Promise(c=>M.toBlob(c,"image/jpeg",y0));if(!s)throw new Error("no_blob");let l=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),p=new File([s],`photo-${l}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:p},bubbles:!0,composed:!0}))}catch(H){this._unavailable(H instanceof Error?H.message:String(H))}finally{this._busy=!1}}}render(){if(!this._open)return n;let C=this.lang,H=this._busy||this._switching;return i`
      <div class="overlay top-layer" popover="manual" ${M2} role="dialog" aria-modal="true" aria-label=${e("doc_camera",C)}>
        <video autoplay playsinline muted></video>
        ${this._switching?i`<div class="switching" role="status">${e("camera_switching",C)}</div>`:n}
        ${this._switchFailed?i`<div class="switch-note" role="status">
              <div>${e("camera_not_answered",C)}</div>
              ${C1({cls:"details",header:e("camera_diagnostics",C)},i`
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${e(this._copied?"camera_copied":"camera_copy",C)}</button>
              `)}
            </div>`:n}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${e("cancel",C)}</button>
          ${this._devices.length>1?i`<button type="button" class="switch" ?disabled=${H} title=${e("camera_switch_lens",C)} aria-label=${e("camera_switch_lens",C)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:n}
          <button type="button" class="shoot" ?disabled=${H} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${e("camera_capture_shoot",C)}</span>
          </button>
        </div>
      </div>
    `}};N.styles=[a2,Z`
    :host { display: contents; }
    .overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: #000; color: #fff;
      display: flex; flex-direction: column;
    }
    video { flex: 1; min-height: 0; width: 100%; object-fit: contain; background: #000; }
    .bar {
      display: flex; justify-content: space-between; align-items: center; gap: 16px;
      padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
      background: rgba(0, 0, 0, 0.8);
    }
    button {
      font: inherit; border-radius: 24px; padding: 10px 18px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .cancel { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); }
    .switch { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); padding: 10px 12px; }
    .switch[disabled] { opacity: 0.5; cursor: default; }
    .switch ha-icon { --mdc-icon-size: 22px; }
    .switch-pos { font-size: 12px; opacity: 0.85; }
    .switching {
      position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%);
      padding: 8px 16px; border-radius: 16px; background: rgba(0, 0, 0, 0.6); font-size: 14px;
    }
    .switch-note {
      position: absolute; left: 12px; right: 12px; bottom: 84px; max-height: 60%; overflow: auto;
      text-align: center; color: #fff; font-size: 13px; text-shadow: 0 1px 2px #000;
    }
    .details { margin-top: 6px; text-align: start; text-shadow: none; }
    .details summary { cursor: pointer; text-align: center; opacity: 0.85; }
    .details textarea {
      display: block; box-sizing: border-box; width: 100%; margin: 6px 0;
      font: 11px/1.35 monospace; color: #fff; background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.3); border-radius: var(--ms-radius-6, 6px); padding: 6px; resize: vertical;
    }
    .copy { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); padding: 6px 14px; font-size: 13px; }
    .shoot { background: var(--primary-color, #03a9f4); color: #fff; border: none; font-weight: 600; }
    .shoot[disabled] { opacity: 0.6; cursor: default; }
    .shoot ha-icon { --mdc-icon-size: 22px; }
  `],o([v({type:String})],N.prototype,"lang",2),o([d()],N.prototype,"_open",2),o([d()],N.prototype,"_busy",2),o([d()],N.prototype,"_switching",2),o([d()],N.prototype,"_devices",2),o([d()],N.prototype,"_deviceIndex",2),o([d()],N.prototype,"_switchFailed",2),o([d()],N.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",N);var o2=Z`
  ms-photo-picker { display: contents; }
  .photo-pickers {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .photo-pick {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px dashed var(--divider-color);
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    color: var(--secondary-text-color);
    width: fit-content;
  }
  .photo-pick:hover { border-color: var(--primary-color); }
  .photo-pick:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .photo-pick.disabled { opacity: 0.6; cursor: default; }
  .photo-pick input[type="file"] { display: none; }
  .photo-android-hint {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 4px;
  }
`,q=class extends b{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=i2();this._inAppCamera=X5()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(C){C.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:C},bubbles:!0,composed:!0}))}_onInput(C){let H=C.target,V=Array.from(H.files??[]);H.value="",this._emit(V)}_onCameraClick(C){!this._inAppCamera||this._locked||(C.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(C){C.key!=="Enter"&&C.key!==" "||(C.preventDefault(),!this._locked&&C.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return n;let C=this.lang,H=this._locked?"disabled":"",V=this.busy?e("uploading",C):e("doc_camera",C),t=e(this._singlePick?"choose_photo":"choose_photos",C);return i`
      <div class="photo-pickers">
        ${this.showCamera?i`<label class="photo-pick photo-pick-camera ${H}" role="button" tabindex="0"
              aria-label=${V} title=${this.compact?V:n}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?n:i`<span>${V}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:n}
        ${this.showGallery?i`<label class="photo-pick photo-pick-gallery ${H}" role="button" tabindex="0"
              aria-label=${t} title=${this.compact?t:n}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?n:i`<span>${t}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:n}
      </div>
      ${this.showGallery&&this._singlePick?i`<div class="photo-android-hint">${e("photos_android_hint",C)}</div>`:n}
      ${this.showCamera&&this._inAppCamera?i`<ms-camera-capture .lang=${C}
            @photo-captured=${M=>this._emit([M.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:n}
    `}};o([v({type:String})],q.prototype,"lang",2),o([v({type:Boolean})],q.prototype,"disabled",2),o([v({type:Boolean})],q.prototype,"busy",2),o([v({type:String})],q.prototype,"accept",2),o([v({type:Boolean})],q.prototype,"showCamera",2),o([v({type:Boolean})],q.prototype,"showGallery",2),o([v({type:Boolean})],q.prototype,"compact",2),o([v({type:Number})],q.prototype,"remaining",2),o([d()],q.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",q);var y1=t1,x=class extends b{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new f1(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={};this.prefill=null}open(C={}){if(this._open)return;this._open=!0,this.viaTagScan=!!C.viaTagScan;let H=this.prefill;this._notes=H?.notes??"",this._cost=H?.cost!=null?String(H.cost):"",this._duration=H?.duration!=null?String(H.duration):"",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((V,t)=>[String(t),!!this.checklistPrefill[V]]).filter(([,V])=>V)),this._feedback=H?.feedback??"needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(V=>[G(V),{...V}])),this._usedQtyText={}}_rangeError(C,H){let V=this.lang;return e("settings_value_out_of_range",V).replace("{min}",h(C,V,{maximumFractionDigits:2})).replace("{max}",h(H,V,{maximumFractionDigits:2}))}_toggleCheck(C){let H=String(C);this._checklistState={...this._checklistState,[H]:!this._checklistState[H]}}_setFeedback(C){this._feedback=C}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let C={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId},H=this._notes.trim();if(H&&(C.notes=H),this._cost){let s=parseFloat(this._cost);isNaN(s)||(C.cost=s)}let V=o1(this._duration);if(V!==null&&(C.duration=V),this.checklist.length>0&&(C.checklist_state=this._checklistState),this.adaptiveEnabled&&(C.feedback=this._feedback),this._photos.photos.length>0&&(C.photo_doc_ids=this._photos.ids),this.viaTagScan&&(C.via_tag_scan=!0),this._completedAt){if(X(this._completedAt)>Date.now()){this._error=e("completed_at_future_error",this.lang);return}C.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let s={};for(let l of this.readings){let p=(this._readingValues[l.id]??"").trim();if(p==="")continue;let c=parseFloat(p.replace(",","."));isNaN(c)||(s[l.id]=c)}Object.keys(s).length>0&&(C.reading_values=s)}else if(this._readingValue!==""){let s=parseFloat(this._readingValue);isNaN(s)||(C.reading_value=s)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let s=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(s)||s<Z1[0]||s>Z1[1]){this._error=this._rangeError(...Z1);return}C.restock_quantity=s}if(this.parts.length>0){let s=[];for(let[l,p]of Object.entries(this._usedParts)){let c=this._usedQtyText[l],m=c===void 0?p.quantity:parseFloat(c.replace(",","."));if(!Number.isFinite(m)||m<y1[0]||m>y1[1]){this._error=this._rangeError(...y1);return}s.push({...p,quantity:m})}C.used_parts=s.map(l=>l.entry_id?{part_id:l.part_id,quantity:l.quantity,entry_id:l.entry_id}:{part_id:l.part_id,quantity:l.quantity})}let t=await k(this,C,{busy:s=>{this._loading=s},lang:this.lang,fallbackKey:"save_error",onError:s=>{this._error=s}});if(t===void 0)return;let M=X1(t,this.lang);if(M){this._close(),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:M},bubbles:!0,composed:!0}));return}this._photos.markAttached(),this._open=!1;let a={entryId:this.entryId,taskId:this.taskId,taskName:this.taskName,undo:t?.undo===!0};this.dispatchEvent(new CustomEvent("task-completed",{detail:a}))}_renderReadingField(C,H){let V=this._completedAt?X(this._completedAt):NaN,t=Y2(this.readingHistory,C.id,isNaN(V)?void 0:V),M=C.unit||this.readingUnit,a=(this._readingValues[C.id]??"").trim(),s=a===""?NaN:parseFloat(a.replace(",",".")),l=t!==void 0&&!isNaN(s)&&s<t.value,p=t!==void 0?h(t.value,H,{maximumFractionDigits:3}):"";return i`
      <label class="field reading-field">
        <span class="field-label">${C.name}${M?` (${M})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${t!==void 0?e("reading_last",H).replace("{value}",p):""}
          .value=${this._readingValues[C.id]??""}
          @input=${c=>{this._readingValues={...this._readingValues,[C.id]:c.target.value}}} />
        ${l?i`<span class="reading-warn">${e("reading_below_last",H).replace("{value}",p)}</span>`:n}
      </label>`}get _missingRequired(){let C={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(H=>!C[H])}_demands(C){return this.requiredFields.includes(C)}_req(C){return this._demands(C)?i`<span class="req-mark" aria-hidden="true">*</span>`:n}_purchaseSuggestion(){if(this.restockDefault===null)return null;let C=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(C)||C<=0?null:K1(this.restockUnitCost*C)}_partsValues(){let C={booked:null,info:null};if(this.restockDefault!==null||!this.parts.length)return C;for(let H of Object.values(this._usedParts)){let V=this.parts.find(a=>G({part_id:a.id,entry_id:a.entry_id})===G(H)),t=A5(V);if(t===null)continue;let M=G1(V,this.partsCostMode)==="use"?"booked":"info";C[M]=(C[M]??0)+t*(H.quantity||1)}for(let H of["booked","info"])C[H]!==null&&(C[H]=K1(C[H]));return C}_renderCostSuggestion(C){let H=this._purchaseSuggestion();if(this.restockDefault!==null){let a=this.partsCostMode==="use"?i`<div class="cost-note">${e("cost_purchase_use_hint",C)}</div>`:n;if(this._cost.trim()!==""||H==null||H<=0)return a;let s=U(H,this.currencySymbol,C);return i`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(K1(H))}
        >${e("cost_from_parts",C).replace("{amount}",s)}</button>${a}`}let{booked:V,info:t}=this._partsValues(),M=(a,s)=>a!=null&&a>0?i`<div class="cost-note">${e(s,C).replace("{amount}",U(a,this.currencySymbol,C))}</div>`:n;return i`${M(V,"cost_parts_booked")}${M(t,"cost_parts_info")}`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=`${U2()}:00`}render(){if(!this._open)return i``;let C=this.lang||T(this.hass),H=this._error||this._photos.errorText(C);return i`
      <ha-dialog open .headerTitle=${M1(`${e("complete_title",C)}${this.taskName}`)} @closed=${this._close}>
        ${a1(`${e("complete_title",C)}${this.taskName}`)}
        ${this.phaseLabel?i`<div class="phase-line">${e("phase_current",C)}: ${this.phaseLabel}</div>`:n}
        ${this.requireTagScan&&!this.viaTagScan?i`<div class="scan-required-note">${e("require_tag_scan_hint",C)}</div>`:n}
        <div class="content">
          ${H?$("error",H):n}
          ${this.checklist.length>0?i`
            <div class="checklist-section">
              <label class="checklist-label">${e("checklist",C)}</label>
              ${this.checklist.map((V,t)=>i`
                ${f({cls:"checklist-item",checked:!!this._checklistState[String(t)],onChange:()=>this._toggleCheck(t)},i`<span>${V}</span>`)}
              `)}
            </div>
          `:n}
          ${this.readings.length>0?i`<div class="readings-block">
                <span class="field-label">${e("readings_section",C)}</span>
                ${this.readings.map(V=>this._renderReadingField(V,C))}
              </div>`:this.taskType==="reading"?i`
              <label class="field">
                <span class="field-label">${e("reading_value_label",C)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${V=>this._readingValue=V.target.value} />
              </label>`:n}
          ${this.parts.length?i`<div class="used-parts">
                <span class="field-label">${e("complete_parts_used",C)}</span>
                ${this.parts.map(V=>{let t=G({part_id:V.id,entry_id:V.entry_id}),M=this._usedParts[t],a=M!==void 0,s=V.entry_id?{part_id:V.id,quantity:1,entry_id:V.entry_id}:{part_id:V.id,quantity:1};return i`<div class="used-part-row">
                    ${f({cls:"used-part-check",checked:a,onChange:l=>{let p={...this._usedParts};if(l.target.checked)p[t]=p[t]||s;else{delete p[t];let c={...this._usedQtyText};delete c[t],this._usedQtyText=c}this._usedParts=p}},i`<span
                        >${V.name}${V.owner_name?i`<span class="used-part-owner"> (${V.owner_name})</span>`:n}${V.stock!==null&&V.stock!==void 0?` (${m1(V.stock,V.unit,C)})`:""}</span
                      >`)}
                    ${a?i`<input class="used-part-qty" type="number" min=${y1[0]} max=${y1[1]} step="0.01"
                          .value=${this._usedQtyText[t]??String(M.quantity)}
                          @input=${l=>{let p=l.target.value;this._usedQtyText={...this._usedQtyText,[t]:p};let c=parseFloat(p.replace(",","."));Number.isFinite(c)&&c>=y1[0]&&(this._usedParts={...this._usedParts,[t]:{...s,quantity:c}})}} />`:n}
                  </div>`})}
              </div>`:this.consumesInfo.length?i`<div class="consumes-hint">
                  ${this.consumesInfo.map(V=>i`<div>${V}</div>`)}
                </div>`:n}
          ${this.restockDefault!==null?i`
              <label class="field">
                <span class="field-label">${e("restock_quantity_label",C)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
                <input type="number" step="0.01" min=${Z1[0]} max=${Z1[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${V=>this._restockQty=V.target.value} />
              </label>`:n}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${this._demands("notes")?e("notes_label",C):e("notes_optional",C)}${this._req("notes")}</span>
            <!-- Several lines (#202): what was done, one line each. The
                 history and the printouts keep the line breaks; they show
                 notes as plain text, so no Markdown hint here. -->
            <textarea class="field-input notes-input" rows="3"
              .value=${this._notes}
              @input=${V=>this._notes=V.target.value}></textarea>
          </label>
          <div class="field">
            <span class="field-label">${this._demands("cost")?e("cost",C):e("cost_optional",C)}${this._req("cost")}</span>
            <ms-cost-input .lang=${C} .value=${this._cost}
              @value-changed=${V=>this._cost=V.detail.value}></ms-cost-input>
            ${this._renderCostSuggestion(C)}
          </div>
          <label class="field">
            <span class="field-label">${this._demands("duration")?e("quick_complete_defaults_duration",C):e("duration_minutes",C)}${this._req("duration")}</span>
            <input type="number" step="1" min="0" inputmode="numeric" class="field-input"
              .value=${this._duration}
              @input=${V=>this._duration=V.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${e("completed_at_optional",C)}</span>
            ${this._completedAt?i`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${C}
                  .value=${this._completedAt}
                  .helper=${z1(C)}
                  @value-changed=${V=>this._completedAt=V.detail.value}
                ></ms-date-field>`:i`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${e("completed_at_pick",C)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${this._demands("photo")?e("completion_photos",C):e("completion_photos_optional",C)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?i`<div class="photo-strip">
                  ${this._photos.photos.map(V=>i`
                    <div class="photo-preview">
                      <img src=${V.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(V.id)}
                        title="${e("remove",C)}">✕</button>
                    </div>`)}
                </div>`:n}
            ${this._photos.full?i`<div class="photo-limit">${e("photos_limit",C).replace("{max}",String(this._photos.max))}</div>`:i`<ms-photo-picker .lang=${C} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${V=>this._photos.addFiles(V.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?i`
            <div class="feedback-section">
              <label class="feedback-label">${e("was_maintenance_needed",C)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${e("feedback_needed",C)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${e("feedback_not_needed",C)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${e("feedback_not_sure",C)}</button>
              </div>
            </div>
          `:n}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${e("cancel",C)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?e("uploading",C):this._missingRequired.length?this._missingRequired.map(V=>e("err_required",C).replace("{field}",e(_1[V]??V,C))).join(" \xB7 "):""}
          >
            ${this._loading?e("completing",C):e("complete",C)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};x.styles=[x1,o2,Z`
    .req-mark {
      color: var(--error-color, #f44336);
      margin-left: 2px;
      font-weight: 600;
    }
    .notes-input { resize: vertical; line-height: 1.4; }
    /* #104: one-click cost suggestion from parts — quiet link-style chip. */
    .cost-note {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 4px;
      line-height: 1.4;
    }
    .cost-suggestion {
      align-self: flex-start;
      margin-top: 4px;
      padding: 0;
      border: none;
      background: none;
      color: var(--primary-color);
      font-size: 12.5px;
      cursor: pointer;
      text-decoration: underline dotted;
      text-underline-offset: 2px;
    }
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .scan-required-note {
      margin: -4px 0 12px;
      padding: 8px 10px;
      border-radius: var(--ms-radius-6, 6px);
      background: rgba(255, 152, 0, 0.12);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .phase-line {
      margin-top: -8px;
      padding-bottom: 12px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    .consumes-hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      border-left: 3px solid var(--primary-color);
      padding: 4px 8px;
      margin: 4px 0 8px;
    }
    /* #99: editable per-completion parts selection */
    .used-parts { margin: 4px 0 8px; display: flex; flex-direction: column; gap: 4px; }
    .used-part-row { display: flex; align-items: center; gap: 8px; }
    /* #216 consistency pass: the checklist rows' look (14 px, 18 px box). */
    .used-part-check {
      display: flex; align-items: center; gap: 8px; flex: 1;
      font-size: 14px; cursor: pointer;
    }
    .used-part-check input { width: 18px; height: 18px; cursor: pointer; }
    /* #111: whose stock this row draws on. Muted but never omitted — an
       unlabelled foreign pool is indistinguishable from an own part. */
    .used-part-owner { color: var(--secondary-text-color); }
    .used-part-qty {
      width: 76px; padding: 6px 8px; border-radius: var(--ms-radius-6, 6px); font: inherit; font-size: 14px;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    /* .field/.field-label/.field-input come from nativeFieldStyles */
    /* #161 phase 2: the per-slot reading fields */
    .readings-block { display: flex; flex-direction: column; gap: 8px; }
    .readings-block > .field-label { margin-bottom: -4px; }
    .reading-warn {
      font-size: 12px;
      color: var(--warning-color, #ff9800);
    }
    /* .photo-pick / .photo-pickers / .photo-android-hint come from photoPickerStyles */
    /* #163: the backdate moment starts EMPTY (= now); the button seeds the
       HA date+time picker with the current minute instead of the picker's
       own 00:00 default, so a backdated completion never lands at midnight
       by accident. */
    .backdate-pick {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      background: transparent;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      color: var(--secondary-text-color);
      width: fit-content;
      --mdc-icon-size: 18px;
    }
    .backdate-pick:hover { border-color: var(--primary-color); }
    /* #161: several photos per completion — tiles wrap into a strip,
       the two pickers (camera / gallery) sit underneath while there is
       room left under the cap. */
    .photo-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 8px 0; /* room for the remove badges above the tiles */
    }
    .photo-limit {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .photo-preview {
      position: relative;
      width: fit-content;
    }
    /* Uniform tiles: a tiny or portrait shot must not collapse the strip. */
    .photo-preview img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 8px;
      display: block;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
    }
    .photo-remove {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background: var(--error-color, #db4437);
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
    }
    .checklist-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: 4px;
    }
    /* The field label of every dialog (12 px, 500, secondary). */
    .checklist-label {
      font-weight: 500;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 0;
      font-size: 14px;
    }
    .checklist-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    .feedback-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      border-top: 1px solid var(--divider-color);
    }
    .feedback-label {
      font-weight: 500;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .feedback-buttons {
      display: flex;
      gap: 8px;
    }
    .feedback-btn {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .feedback-btn:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .feedback-btn.selected {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
  `],o([v({attribute:!1})],x.prototype,"hass",2),o([v()],x.prototype,"entryId",2),o([v()],x.prototype,"taskId",2),o([v()],x.prototype,"taskName",2),o([v()],x.prototype,"lang",2),o([v({type:Array})],x.prototype,"checklist",2),o([v({type:Boolean})],x.prototype,"adaptiveEnabled",2),o([v()],x.prototype,"taskType",2),o([v()],x.prototype,"readingUnit",2),o([v({attribute:!1})],x.prototype,"readings",2),o([v({attribute:!1})],x.prototype,"readingHistory",2),o([v({attribute:!1})],x.prototype,"restockDefault",2),o([v({attribute:!1})],x.prototype,"restockUnitCost",2),o([v({attribute:!1})],x.prototype,"restockPackage",2),o([v()],x.prototype,"currencySymbol",2),o([v({attribute:!1})],x.prototype,"partsCostMode",2),o([v({attribute:!1})],x.prototype,"parts",2),o([v({attribute:!1})],x.prototype,"consumesParts",2),o([v({type:Array})],x.prototype,"consumesInfo",2),o([v({type:Array})],x.prototype,"requiredFields",2),o([v()],x.prototype,"phaseLabel",2),o([v({type:Boolean})],x.prototype,"requireTagScan",2),o([v({type:Boolean})],x.prototype,"viaTagScan",2),o([d()],x.prototype,"_open",2),o([d()],x.prototype,"_notes",2),o([d()],x.prototype,"_cost",2),o([d()],x.prototype,"_duration",2),o([d()],x.prototype,"_loading",2),o([d()],x.prototype,"_error",2),o([d()],x.prototype,"_checklistState",2),o([d()],x.prototype,"_feedback",2),o([d()],x.prototype,"_readingValue",2),o([d()],x.prototype,"_readingValues",2),o([d()],x.prototype,"_restockQty",2),o([d()],x.prototype,"_completedAt",2),o([d()],x.prototype,"_usedParts",2),o([d()],x.prototype,"_usedQtyText",2),o([v({attribute:!1})],x.prototype,"checklistPrefill",2),o([v({attribute:!1})],x.prototype,"prefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",x);var b1=Z`
  ${a2}
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
`;function w0(L,r){L.key!=="Escape"||L.defaultPrevented||L.composedPath().some(C=>C instanceof Element&&C.localName==="ms-camera-capture")||(L.preventDefault(),L.stopPropagation(),r())}function d1(){return S1("ha-adaptive-dialog")}function O1(L,r,C={}){return d1()?i`
      <ha-adaptive-dialog open .headerTitle=${C.title}
        @closed=${H=>{H.target===H.currentTarget&&L()}}>
        <div class="ha-shell-body">${r}</div>
      </ha-adaptive-dialog>
    `:i`
    <div class="modal-layer top-layer" popover="manual" ${M2}>
      <div class="backdrop" @click=${L}></div>
      <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
        @keydown=${H=>w0(H,L)}>${r}</div>
    </div>
  `}function k1(L){L?.querySelector(".dialog")?.focus({preventScroll:!0})}function C3(L,r,C){let H=new Blob([L],{type:C}),V=URL.createObjectURL(H),t=document.createElement("a");t.href=V,t.download=r,t.target="_blank",t.rel="noopener",t.style.display="none",document.body.appendChild(t),t.dispatchEvent(new MouseEvent("click")),document.body.removeChild(t),setTimeout(()=>URL.revokeObjectURL(V),6e4)}async function $0(L,r,C=300){return(await L.connection.sendMessagePromise({type:"auth/sign_path",path:r,expires:C})).path}async function H3(L,r,C=300){return $0(L,`/api/maintenance_supporter/document/${r}`,C)}var i1=class extends b{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await H3(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?n:this._url?i`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:i`<div class="ph"></div>`}};i1.styles=Z`
    .wrap { display: inline-block; margin-top: 4px; }
    /* #161: uniform 96px tiles — several photos sit in a strip, so a
       tiny or portrait shot must not collapse its slot. */
    img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: var(--ms-radius-6, 6px);
      display: block;
      border: 1px solid var(--divider-color);
      box-sizing: border-box;
    }
    .ph {
      width: 96px;
      height: 96px;
      border-radius: var(--ms-radius-6, 6px);
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      margin-top: 4px;
    }
  `,o([v({attribute:!1})],i1.prototype,"hass",2),o([v()],i1.prototype,"docId",2),o([d()],i1.prototype,"_url",2),o([d()],i1.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",i1);var I=class extends b{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new f1(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return T(this.hass)}openEdit(C){this._openGen++,this._draft={...C},this._originalSnapshot={...C},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(C.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(C),this._loadPartOptions()}_seedReadings(C){let H=[],V=new Set;for(let M of C.readings??[])V.has(M.id)||(V.add(M.id),H.push({id:M.id,name:M.name,unit:M.unit??null}));for(let M of C.reading_values??[])V.has(M.id)||(V.add(M.id),H.push({id:M.id,name:M.name,unit:M.unit??null}));this._readingRows=H;let t={};for(let M of C.reading_values??[])t[M.id]=String(M.value);this._readingText=t,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let C={};for(let H of this._readingRows){let V=(this._readingText[H.id]??"").trim();if(V==="")continue;let t=parseFloat(V.replace(",","."));isNaN(t)||(C[H.id]=t)}return C}async _loadPartOptions(){let C=this._draft;if(!C)return;let H=this._openGen;try{let V=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(H!==this._openGen)return;let t=[];for(let a of V.parts||[]){let s=a.entry_id===C.entry_id,l=a.consumers.some(p=>p.entry_id===C.entry_id&&p.task_id===C.task_id);!s&&!l||t.push({part_id:a.part_id,name:a.name,entry_id:a.entry_id,foreign:!s,object_name:a.object_name})}for(let a of C.used_parts||[]){let s=a.entry_id||C.entry_id;t.some(l=>l.part_id===a.part_id&&l.entry_id===s)||t.push({part_id:a.part_id,name:a.name||a.part_id,entry_id:s,foreign:s!==C.entry_id,object_name:null})}let M={};for(let a of C.used_parts||[])M[`${a.entry_id||C.entry_id}:${a.part_id}`]=a.quantity??1;this._partOptions=t,this._partQty=M,this._partQtyOriginal=this._partSelectionKey()}catch{if(H!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,C])=>C>0).sort(([C],[H])=>C.localeCompare(H)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(C,H){this._draft&&(this._draft={...this._draft,[C]:H})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let C=this._lang,V=(this._originalSnapshot.used_parts||[]).filter(s=>s.quantity>0).map(s=>`${h(s.quantity,C)}\xD7 ${s.name||s.part_id}`).join(", ");if(!await B1(this.hass,{title:e("history_delete_entry",C),message:V?`${e("history_delete_confirm_entry",C)} ${e("history_delete_returns_parts",C).replace("{parts}",V)}`:e("history_delete_confirm_entry",C),confirmText:e("delete",C),danger:!0})||!this._draft||!this._originalSnapshot)return;let M=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:M.entry_id,task_id:M.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:M.entry_id,task_id:M.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(C){return k(this,C,{busy:H=>{this._saving=H},onError:H=>{this._error=H}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let C=this._draft,H=this._originalSnapshot,V={type:"maintenance_supporter/task/history/update",entry_id:C.entry_id,task_id:C.task_id,original_timestamp:H.original_timestamp};if(C.timestamp!==H.timestamp&&(V.timestamp=C.timestamp),C.notes!==H.notes&&(V.notes=C.notes),C.cost!==H.cost&&(V.cost=C.cost),C.duration!==H.duration&&(V.duration=C.duration),C.completed_by!==H.completed_by&&(V.completed_by=C.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(V.used_parts=(this._partOptions||[]).filter(M=>(this._partQty[`${M.entry_id}:${M.part_id}`]||0)>0).map(M=>({part_id:M.part_id,quantity:this._partQty[`${M.entry_id}:${M.part_id}`],...M.foreign?{entry_id:M.entry_id}:{}}))),C.reading_value!==H.reading_value&&(V.reading_value=C.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let M=this._readingNumbers(),a={};for(let s of this._readingRows)a[s.id]=M[s.id]??null;V.reading_values=a}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(V.photo_doc_ids=this._photos.ids),Object.keys(V).filter(M=>!["type","entry_id","task_id","original_timestamp"].includes(M)).length===0){this.close();return}await this._runWs(V)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:C.entry_id,task_id:C.task_id,new_timestamp:C.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return n;let C=this._lang,H=this._draft,V=this._error||this._photos.errorText(C);return O1(()=>this.close(),i`
        ${d1()?n:i`<h2>${e("history_edit_title",C)}</h2>`}
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${e(H.type,C)||H.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${C}
          .label=${e("history_edit_timestamp",C)}
          .helper=${z1(C)}
          .value=${z2(H.timestamp)}
          @value-changed=${t=>{let M=t.detail.value;M&&this._set("timestamp",M)}}
        ></ms-date-field>
        <label>
          <span>${e("notes_label",C)}</span>
          <textarea
            rows="3"
            @input=${t=>{let M=t.target.value;this._set("notes",M||null)}}
            .value=${H.notes??""}></textarea>
        </label>
        <div class="row">
          <div class="cost-field">
            <span>${e("cost",C)}</span>
            <ms-cost-input .lang=${C} .value=${H.cost!=null?String(H.cost):""}
              @value-changed=${t=>{let M=t.detail.value;this._set("cost",M?Number(M):null)}}></ms-cost-input>
          </div>
          <label>
            <span>${e("duration",C)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${H.duration!=null?String(H.duration):""}
              @input=${t=>{this._set("duration",o1(t.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(H,C)}
        ${this._partOptions&&this._partOptions.length>0?i`
          <div class="parts-block">
            <span class="parts-title">${e("complete_parts_used",C)}</span>
            ${this._partOptions.map(t=>{let M=`${t.entry_id}:${t.part_id}`,a=this._partQty[M]||0;return i`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${a>0}
                    @change=${s=>{let l=s.target.checked;this._partQty={...this._partQty,[M]:l?1:0}}} />
                  <span class="part-label">${t.name}${t.foreign&&t.object_name?` (${t.object_name})`:""}</span>
                  ${a>0?i`
                    <input class="part-qty" type="number" min=${t1[0]} max=${t1[1]} step="0.01"
                      .value=${String(a)}
                      @input=${s=>{let l=parseFloat(s.target.value);!isNaN(l)&&l>0&&(this._partQty={...this._partQty,[M]:l})}} />
                  `:n}
                </label>
              `})}
          </div>
        `:n}
        <div class="photos-block">
          <span class="parts-title">${e("completion_photos",C)}</span>
          ${this._photos.photos.length>0?i`
            <div class="photo-strip">
              ${this._photos.photos.map(t=>i`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${t.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${e("remove",C)}
                    @click=${()=>this._photos.remove(t.id)}>✕</button>
                </div>`)}
            </div>`:n}
          ${this._photos.full?i`<span class="photos-hint">${e("photos_limit",C).replace("{max}",String(this._photos.max))}</span>`:i`<ms-photo-picker .lang=${C} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${t=>this._photos.addFiles(t.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${e("history_edit_photos_hint",C)}</span>
        </div>
        ${V?$("error",V):n}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${e("history_delete_entry",C)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${e("history_delete_entry",C)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${e("cancel",C)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving||this._photos.uploading}
            title=${this._photos.uploading?e("uploading",C):""}>
            ${this._saving?e("saving",C):e("save",C)}
          </button>
        </div>
    `,{title:e("history_edit_title",C)})}updated(C){C.has("_open")&&this._open&&k1(this.shadowRoot)}_renderReadings(C,H){return this._readingRows.length>0?i`
        <div class="readings-block">
          <span class="parts-title">${e("readings_section",H)}</span>
          ${this._readingRows.map(V=>i`
            <label class="reading-row-edit">
              <span class="reading-row-name">${V.name}${V.unit?` (${V.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[V.id]??""}
                @input=${t=>{this._readingText={...this._readingText,[V.id]:t.target.value}}} />
            </label>
          `)}
        </div>`:C.reading_value==null&&C.task_type!=="reading"?n:i`
      <label>
        <span>${e("reading_value_label",H)}${C.reading_unit?` (${C.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${C.reading_value!=null?String(C.reading_value):""}
          @input=${V=>{let t=V.target.value,M=t===""?NaN:Number(t);this._set("reading_value",isNaN(M)?null:M)}} />
      </label>`}};I.styles=[o2,b1,Z`
    :host { display: contents; --ms-modal-max-height: 90vh; --ms-modal-gap: 12px; }
    h2 { margin: 0; font-size: 18px; font-weight: 500; }
    .entry-type {
      display: flex; align-items: center; gap: 6px;
      color: var(--secondary-text-color); font-size: 13px;
    }
    /* #216 consistency pass: the field label of ms-textfield / ms-date-field
       (12 px, 500, secondary) — this dialog's were 13 px, normal weight. */
    label { display: flex; flex-direction: column; gap: 4px; font-size: 14px; }
    label:not([class]) > span,
    .cost-field > span { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
    .cost-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    input, textarea {
      padding: 8px 10px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: var(--ms-radius-6, 6px);
      width: 100%; box-sizing: border-box;
      font-family: inherit;
    }
    .delete-entry { margin-right: auto; color: var(--error-color, #d32f2f); background: transparent; border: 1px solid var(--error-color, #d32f2f); border-radius: var(--ms-radius-6, 6px); padding: 6px 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
    .delete-entry ha-icon { --mdc-icon-size: 18px; }
    .actions {
      display: flex; gap: 8px; justify-content: flex-end;
      margin-top: 8px;
    }
    button {
      padding: 8px 16px; font-size: 14px;
      border-radius: var(--ms-radius-6, 6px); cursor: pointer;
      border: none; font-weight: 500;
    }
    button.cancel {
      background: transparent;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
    }
    button.save {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
    }
    button[disabled] { opacity: 0.5; cursor: wait; }
    .error {
      color: var(--error-color, #d32f2f);
      font-size: 13px; padding: 8px;
      background: rgba(211,47,47,0.1);
      border-radius: var(--ms-radius-6, 6px);
    }
    /* #130: parts on the entry */
    .parts-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: var(--ms-radius-6, 6px); padding: 8px;
    }
    .parts-title { color: var(--secondary-text-color); font-size: 12px; font-weight: 500; }
    .part-row-edit {
      display: flex; flex-direction: row; align-items: center; gap: 8px;
      font-size: 14px;
    }
    .part-row-edit input[type="checkbox"] { width: auto; }
    .part-label { flex: 1; color: var(--primary-text-color); }
    .part-qty { width: 76px; }
    /* #161 phase 2: readings on the entry */
    .readings-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: var(--ms-radius-6, 6px); padding: 8px;
    }
    .reading-row-edit {
      display: flex; flex-direction: row; align-items: center; gap: 8px;
      font-size: 14px;
    }
    .reading-row-name { flex: 1; color: var(--primary-text-color); min-width: 0; }
    .reading-row-input { width: 140px; font-variant-numeric: tabular-nums; }
    /* #161: photos on the entry */
    .photos-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: var(--ms-radius-6, 6px); padding: 8px;
    }
    .photo-strip { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 6px; }
    .photo-tile { position: relative; width: fit-content; }
    .photo-remove {
      position: absolute; top: -4px; right: -8px;
      width: 22px; height: 22px; border-radius: 50%; border: none;
      background: var(--error-color, #db4437); color: #fff;
      cursor: pointer; font-size: 11px; line-height: 1; padding: 0;
    }
    /* the camera / gallery pickers come from photoPickerStyles (ms-photo-picker) */
    .photos-hint { font-size: 12px; color: var(--secondary-text-color); }
  `],o([v({attribute:!1})],I.prototype,"hass",2),o([d()],I.prototype,"_open",2),o([d()],I.prototype,"_saving",2),o([d()],I.prototype,"_error",2),o([d()],I.prototype,"_draft",2),o([d()],I.prototype,"_partOptions",2),o([d()],I.prototype,"_partQty",2),o([d()],I.prototype,"_readingRows",2),o([d()],I.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",I);function b2(L){return!L.startsWith("data:image/svg+xml,")&&!L.startsWith("data:image/png;base64,")?"":L1(L)}function T0(L){return L.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var F=class extends b{constructor(){super(...arguments);this.lang="";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._quickResult=null;this._quickValues=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}get _dialogLang(){return this.lang||T(this.hass)}openForObject(C,H){this._entryId=C,this._taskId=null,this._objectName=H,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}openForTask(C,H,V,t){this._entryId=C,this._taskId=H,this._objectName=V,this._taskName=t,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}async _generate(){let C=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._quickValues=null;try{let H={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(H.task_id=this._taskId);let V=[this.hass.connection.sendMessagePromise({...H,action:"view"})];if(this._taskId){if(V.push(this.hass.connection.sendMessagePromise({...H,action:"complete"})),this._quickValues=await this._quickCompleteValues(),C!==this._generateSeq)return;this._quickValues&&V.push(this.hass.connection.sendMessagePromise({...H,action:"quick_complete"}))}let t=await Promise.all(V);if(C!==this._generateSeq)return;this._viewResult=t[0],t.length>1&&(this._completeResult=t[1]),t.length>2&&(this._quickResult=t[2])}catch(H){if(C!==this._generateSeq)return;let V=H?.code,t=H?.message;this._error=V==="no_url"||typeof t=="string"&&t.includes("No Home Assistant URL")?e("qr_error_no_url",this._dialogLang):e("qr_error",this._dialogLang)}finally{C===this._generateSeq&&(this._loading=!1)}}async _quickCompleteValues(){try{let C=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});return C2((C.tasks||[]).find(H=>H.id===this._taskId))}catch{return null}}_quickRecords(C){let H=this._quickValues??{},V=[H.notes?`\u201C${H.notes.length>40?`${H.notes.slice(0,39)}\u2026`:H.notes}\u201D`:"",H.cost!=null?`${e("quick_complete_defaults_cost",C)} ${U(H.cost,void 0,C)}`:"",H.duration!=null?v1(H.duration,C):""].filter(Boolean);return V.length?e("qr_quick_records",C).replace("{values}",V.join(", ")):e("qr_quick_records_nothing",C)}_setUrlMode(C){this._urlMode!==C&&(this._urlMode=C,this._generate())}_print(){if(!this._viewResult)return;let C=this._viewResult,H=C.label.task_name?`${C.label.object_name} \u2014 ${C.label.task_name}`:C.label.object_name,V=[C.label.manufacturer,C.label.model].filter(Boolean).join(" "),t=window.open("","_blank","width=600,height=500");if(!t)return;let M=this._dialogLang,a=L1(H),s=L1(V),l=!!this._completeResult,p=!!this._quickResult,c=L1(e("qr_action_view",M)),m=L1(e("qr_action_complete",M)),u=L1(e("qr_action_quick_complete",M));t.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${a}</title>
<style>
  /* Printable sheet \u2014 must not inherit the phone's dark theme. The QR images
     carry their own white quiet zone and stay scannable either way, but the
     labels below are explicit dark greys and would vanish on a WebView's dark
     canvas. Same reasoning as helpers/report.ts. */
  :root{color-scheme:light}
  body{font-family:sans-serif;text-align:center;padding:20px;background:#fff;color:#1a1a1a}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  .qr-row{display:flex;justify-content:center;gap:24px;margin:12px 0}
  .qr-col{display:flex;flex-direction:column;align-items:center;gap:6px}
  .qr-col img{width:${p?"170px":l?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${a}</h2>
${s?`<div class="sub">${s}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${b2(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${c}</div>
  </div>
  ${l?`<div class="qr-col">
    <img src="${b2(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${m}</div>
  </div>`:""}
  ${p?`<div class="qr-col">
    <img src="${b2(this._quickResult.svg_data_uri)}" alt="QR Quick-complete" />
    <div class="qr-label">${u}</div>
  </div>`:""}
</div>
<div class="url">${L1(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),t.document.close()}_downloadSvg(C,H){let V=decodeURIComponent(C.svg_data_uri.replace("data:image/svg+xml,","")),t=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;C3(V,`qr-${T0(t)}-${H}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._quickResult=null,this._error="",this._loading=!1}render(){if(!this._open)return i``;let C=this._dialogLang,H=this._taskName?`${e("qr_code",C)}: ${this._objectName} \u2014 ${this._taskName}`:`${e("qr_code",C)}: ${this._objectName}`,V=!!this._viewResult;return i`
      <ha-dialog open .headerTitle=${M1(H)} @closed=${this._close}>
        ${a1(H)}
        <div class="content">
          ${this._loading?i`<div class="loading">${e("qr_generating",C)}</div>`:this._error?$("error",this._error):V?i`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${e("qr_action_view",C)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${e("qr_download",C)}
                        </button>
                      </div>
                      ${this._completeResult?i`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${e("qr_action_complete",C)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${e("qr_download",C)}
                              </button>
                            </div>
                          `:n}
                      ${this._quickResult?i`
                            <div class="qr-item quick">
                              <img
                                class="qr-image small"
                                src="${this._quickResult.svg_data_uri}"
                                alt="QR Quick-complete"
                              />
                              <div class="qr-item-label">${e("qr_action_quick_complete",C)}</div>
                              <div class="qr-quick-records">${this._quickRecords(C)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._quickResult,"quick-complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${e("qr_download",C)}
                              </button>
                            </div>
                          `:n}
                    </div>
                    ${this._taskId&&!this._quickResult?i`<div class="qr-quick-off">${e("qr_quick_complete_off",C)}</div>`:n}
                    <div class="url-display">${this._viewResult.url}</div>
                  `:n}
          <div class="action-row">
            <label>${e("qr_url_mode",C)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${e("qr_mode_companion",C)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${e("qr_mode_local",C)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${e("qr_mode_server",C)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${e("cancel",C)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!V}
          >
            ${e("qr_print",C)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};F.styles=Z`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      min-width: 300px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    .qr-pair {
      display: flex;
      flex-wrap: wrap; /* three codes (quick-complete, #192) wrap on a phone */
      gap: 20px;
      justify-content: center;
      width: 100%;
    }
    .qr-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .qr-image {
      width: 240px;
      height: 240px;
      image-rendering: pixelated;
    }
    .qr-image.small {
      width: 180px;
      height: 180px;
    }
    /* #233: what the quick code records; how to get one */
    .qr-quick-records,
    .qr-quick-off {
      font-size: 12px;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .qr-quick-off {
      margin-top: 8px;
    }
    .qr-item-label {
      max-width: 180px;
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .dl-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer;
      font-size: 13px;
      color: var(--primary-text-color);
      padding: 6px 14px;
      border-radius: 18px;
      transition: background 0.2s, border-color 0.2s;
    }
    .dl-btn:hover {
      background: var(--secondary-background-color, #f5f5f5);
      border-color: var(--primary-color);
    }
    .dl-btn ha-icon {
      --mdc-icon-size: 18px;
    }
    .url-display {
      font-size: 11px;
      color: var(--secondary-text-color);
      word-break: break-all;
      text-align: center;
      max-width: 400px;
    }
    .loading {
      padding: 40px 0;
      color: var(--secondary-text-color);
    }
    .error {
      padding: 20px 0;
      color: var(--error-color, #f44336);
    }
    .action-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }
    .action-row label {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .action-toggle {
      display: flex;
      gap: 4px;
      background: var(--divider-color, #e0e0e0);
      border-radius: var(--ms-radius-6, 6px);
      padding: 3px;
    }
    .toggle-btn {
      flex: 1;
      padding: 8px 12px;
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      border-radius: 4px;
      font-size: 13px;
      transition: all 0.2s;
      line-height: 1.3;
    }
    .toggle-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    .toggle-btn.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }
  `,o([v({attribute:!1})],F.prototype,"hass",2),o([v()],F.prototype,"lang",2),o([d()],F.prototype,"_open",2),o([d()],F.prototype,"_loading",2),o([d()],F.prototype,"_error",2),o([d()],F.prototype,"_viewResult",2),o([d()],F.prototype,"_completeResult",2),o([d()],F.prototype,"_quickResult",2),o([d()],F.prototype,"_quickValues",2),o([d()],F.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",F);function V3(L,r,C=new Date){let H=L?.hours,V=X(L?.snoozed_until);if(typeof H!="number"||!Number.isFinite(V))return e("snoozed",r);let t=m2(),a=q1(V,t)===q1(C,t)?c2(new Date(V),r):U1(L.snoozed_until,r);return W1("snoozed_for","snoozed_for_one",H,r,"hours").replace("{until}",a)}function P0(L,r){if(r<=0)return 0;let C=typeof L=="number"&&Number.isFinite(L)?Math.trunc(L):0;return C<0?0:C%r}function E0(L){return!!(L?.phases&&L.phase_sequence&&L.phase_sequence.length>0)}function O2(L){if(!L||!E0(L))return null;let r=L.phase_sequence,C=P0(L.phase_cursor,r.length),H=r[C],V=L.phases?.[H];return V?{id:H,name:V.name,index:C,count:r.length,notes:V.notes,checklist:V.checklist!==void 0?V.checklist:L.checklist??[],consumesParts:V.consumes_parts!==void 0?V.consumes_parts:L.consumes_parts??[],requiredFields:V.required_completion_fields!==void 0?V.required_completion_fields:L.required_completion_fields??[]}:null}function I1(L){let r=O2(L);return r?`${r.index+1}/${r.count} \xB7 ${r.name}`:""}function R0(L,r){return typeof L=="number"&&Number.isFinite(L)&&L>=.01?L:r}function e3(L){let r=L.task??null,C=r?O2(r):null,H=C?C.consumesParts:r?.consumes_parts||[],V=!!r?.part_ref,t=L.objects.find(c=>c.entry_id===L.entryId),M=t?.parts||[],a=V?M.find(c=>c.id===r.part_ref.part_id):void 0,s=L.features?L.features.checklists:L.checklistsEnabled??!0,l=L.features?L.features.checklists?L.checklist??r?.checklist??[]:[]:L.checklist??[],p=L.features?L.features.adaptive&&(L.adaptiveEnabled??!!r?.adaptive_config?.enabled):!!L.adaptiveEnabled;return{entry_id:L.entryId,task_id:L.taskId,task_name:L.taskName,checklist:C?s?C.checklist:[]:l,adaptive_enabled:p,required_completion_fields:C?C.requiredFields:r?.required_completion_fields||[],task_type:r?.type||"",reading_unit:r?.reading_unit||"",readings:r?.readings||[],reading_history:K2(r?.history),parts:V?[]:g5({consumes_parts:H},L.entryId,L.objects,L.lang),consumes_parts:V?[]:H,phase_label:C?I1(r):"",require_tag_scan:!!r?.require_tag_scan,restock_default:V?R0(a?.restock_quantity,1):null,restock_unit_cost:V?a?.cost??null:null,restock_package:V&&a?.package_size?m1(a.package_size,a.unit,L.lang):"",currency_symbol:T1({currency_symbol:L.currencySymbol}),consumes_info:H.map(c=>S5(c,L.entryId,L.objects,L.lang)),checklist_prefill:r?.checklist_progress||{},via_tag_scan:!!L.viaTagScan,parts_cost_mode:V?G1(a,L.partsCostMode??"purchase",!!t?.object.battery_fleet):L.partsCostMode??"purchase",prefill:C2(r)}}function L3(L,r,C){L.entryId=r.entry_id,L.taskId=r.task_id,L.taskName=r.task_name,L.lang=C,L.checklist=r.checklist??[],L.adaptiveEnabled=!!r.adaptive_enabled,L.requiredFields=r.required_completion_fields??[],L.taskType=r.task_type??"",L.readingUnit=r.reading_unit??"",L.readings=r.readings??[],L.readingHistory=r.reading_history??[],L.parts=r.parts??[],L.consumesParts=r.consumes_parts??[],L.phaseLabel=r.phase_label??"",L.requireTagScan=!!r.require_tag_scan,L.restockDefault=r.restock_default??null,L.restockUnitCost=r.restock_unit_cost??null,L.restockPackage=r.restock_package??"",L.currencySymbol=T1(r),L.consumesInfo=r.consumes_info??[],L.checklistPrefill=r.checklist_prefill??{},L.viaTagScan=!!r.via_tag_scan,L.partsCostMode=r.parts_cost_mode??"purchase",L.prefill=r.prefill??null,L.open({viaTagScan:!!r.via_tag_scan})}var B0=new Set(["about","blob","data","file","filesystem","javascript","livescript","ms-appinstaller","ms-cxh","ms-cxh-full","ms-msdt","ms-officecmd","search","search-ms","view-source","vbscript"]);function k2(L){return L.replace(/[\t\n\r]/g,"").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g,"")}function w2(L){let r=/^([a-z][a-z0-9+.-]+):/i.exec(k2(L||""));return r?r[1].toLowerCase():null}function n2(L){let r=w2(L);return r!==null&&!B0.has(r)}function t3(L){return!!L&&/^https?:\/\//i.test(L)}function d2(L){if(!L)return n;if(customElements.get("ha-markdown")){let{content:r,links:C}=D0(L);return i`<ha-markdown
      class="notes-md"
      .content=${r}
      breaks
      ${j1(H=>N0(H,C))}
    ></ha-markdown>`}return i`${L}`}var T2="https://app-link.invalid/",F0=new Set(["http","https","mailto","tel","ftp"]),I0=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/,s2="[a-zA-Z][a-zA-Z0-9+.-]+:";function D0(L){let r=[],C=t=>{let M=w2(t);return!M||F0.has(M)||!n2(t)?null:(r.push(k2(t)),`${T2}${r.length-1}`)},H=t=>t.replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)<(${s2}[^>\\n]*)>`,"g"),(M,a,s,l)=>{let p=a?null:C(l);return p?`${s}${p}`:M}).replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)(${s2}[^\\s)]*)`,"g"),(M,a,s,l)=>{let p=a?null:C(l);return p?`${s}${p}`:M}).replace(new RegExp(`(^|[^(])<(${s2}[^\\s<>]*)>`,"gm"),(M,a,s)=>{let l=C(s);return l?`${a}[${s.replace(/([\\[\]])/g,"\\$1")}](${l})`:M}).replace(new RegExp(`^( {0,3}\\[[^\\]\\n]+\\]:[ \\t]*)<?(${s2}[^\\s>]*)>?`,"gm"),(M,a,s)=>{let l=C(s);return l?`${a}${l}`:M});return{content:L.split(I0).map((t,M)=>M%2?t:H(t)).join(""),links:r}}function $2(L,r){for(let C of L.querySelectorAll(`a[href^="${T2}"]`)){let H=r[Number(C.getAttribute("href").slice(T2.length))];H&&C.setAttribute("href",H)}}var r3=new WeakMap;function N0(L,r){if(!L)return;let C=r3.get(L);if(!C&&r.length===0)return;if(C){C.links=r,L.shadowRoot&&$2(L.shadowRoot,r);return}let H={links:r};r3.set(L,H),(async()=>{await L.updateComplete;let V=L.shadowRoot;V&&(new MutationObserver(()=>$2(V,H.links)).observe(V,{childList:!0,subtree:!0}),$2(V,H.links))})()}var i3=L=>typeof L=="number"&&Number.isInteger(L)&&L>0;function q0(L){return L&&i3(L.ref_no)?String(L.ref_no):null}function M3(L,r){let C=q0(L);return C&&r&&i3(r.ref_no)?`${C}.${r.ref_no}`:null}function a3(L,r){return L?i`<span class="ref-chip" title=${r??""}>#${L}</span>`:n}var W0={"Completed from dashboard button":"hist_note_button","Auto-completed: sensor recovered":"hist_note_auto_recovered_plain","Completed from the To-do list":"hist_note_todo","Completed by voice":"hist_note_voice","Completed from the notification":"hist_note_notification","Completed via NFC tag":"hist_note_nfc","Completed from the shopping list":"hist_note_shopping_list","Completed from a mirrored to-do list":"hist_note_todo_mirror","Skipped from notification":"hist_note_skipped_notification","Skipped from dashboard button":"hist_note_skipped_button","Sensor trigger activated":"hist_note_sensor_triggered","Initial value set during task creation":"hist_note_initial"},o3={name:"name",notes:"notes_label",recurrence:"task_section_schedule","warning days":"warning_days"},U0=[[/^Auto-completed: sensor recovered \((.+)\)$/,"hist_note_auto_recovered",L=>({value:L[1]})],[/^Auto-completed: (.+) changed to (.+)$/,"hist_note_auto_entity",L=>({entity:L[1],state:L[2]})],[/^Reset to (\d{4}-\d{2}-\d{2})$/,"hist_note_reset",(L,r)=>({date:B(L[1],r)})],[/^Trigger entity replaced: (.+) → (.+)$/,"hist_note_trigger_replaced",L=>({old:L[1],new:L[2]})],[/^From the template: (.+)$/,"hist_note_template_updated",(L,r)=>({fields:L[1].split(", ").map(C=>o3[C]?e(o3[C],r):C).join(", ")})],[/^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,"hist_note_trigger_removed",(L,r)=>({entity:L[1],schedule:e(L[2],r)})],[/^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,"hist_note_compound_removed",L=>({entity:L[1],count:L[2]})]];function n3(L,r){if(!L)return"";let C=W0[L.trim()];if(C)return e(C,r);for(let[H,V,t]of U0){let M=L.trim().match(H);if(M){let a=t(M,r);return e(V,r).replace(/\{(\w+)\}/g,(s,l)=>a[l]??s)}}return L}function s3(L){let r=C=>{let H=X(C.timestamp);return Number.isNaN(H)?-1/0:H};return(L??[]).map((C,H)=>({entry:C,index:H,at:r(C)})).sort((C,H)=>H.at-C.at||H.index-C.index).map(C=>C.entry)}function j0(L,r){return L.taskRef&&r.ref_no?`${L.taskRef}-${r.ref_no}`:null}function Q0(L,r){let C=p2(r);return C.length>0?i`<div class="history-photos">
        ${C.map(H=>i`<maintenance-history-photo .hass=${L} .docId=${H}></maintenance-history-photo>`)}
      </div>`:n}function G0(L,r){let C=r.lang,H=M=>h(M,C,{maximumFractionDigits:3}),V=M=>M==null?"":` (${M>=0?"+":""}${H(M)})`,t=G2(L);return t.length>0?i`<div class="history-readings">
      ${t.map(M=>i`<span class="history-reading">
        <span class="history-reading-name">${M.name}</span>
        <span class="history-reading-value">${H(M.value)}${M.unit?` ${M.unit}`:""}${V(r.readingSlotDelta?.(L,M.id))}</span>
      </span>`)}
    </div>`:L.reading_value!=null?i`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${e("reading_label",C)}</span>
      <span class="history-reading-value">${H(L.reading_value)}${r.readingUnit?` ${r.readingUnit}`:""}${V(r.readingDelta?.(L))}</span>
    </span></div>`:n}function d3(L,r,C={}){let H=r.lang,{compact:V=!1,showRef:t=!0,showBadges:M=!0,showEdit:a=!0,showHead:s=!0}=C,l=r.openEdit,p=a&&!!l&&I2.includes(L.type),c=typeof L.parts_cost=="number"?L.parts_cost:null,m=L.cost_basis==="use",u=m&&!!L.purchase;return i`
    <div class="history-entry${V?" compact":""}">
      ${V?n:i`<div class="history-icon ${L.type}" style="background: ${D2(L.type)}">
            <ha-icon .icon=${N1[L.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        ${s?i`<div class="history-row">
          <strong>${e(L.type,H)}</strong>
          ${t?a3(j0(r,L),e("ref_number",H)):n}
          ${M&&L.phase_id?i`<span class="history-phase-badge">${r.phaseNames?.[L.phase_id]||L.phase_id}</span>`:n}
          ${M&&L.auto?i`<span class="history-auto-badge">${e("history_auto",H)}</span>`:n}
          ${p?i`<button class="history-edit-btn"
                     title=${e("history_edit_button",H)}
                     @click=${()=>l(L)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:n}
        </div>
        <div class="history-date">${U1(L.timestamp,H)}</div>`:n}
        ${L.notes?i`<div class="history-notes">${n3(L.notes,H)}</div>`:n}
        ${Q0(r.hass,L)}
        ${G0(L,r)}
        ${L.cost!=null||L.duration!=null||L.trigger_value!=null||c!=null?i`<div class="history-details">
              ${L.cost!=null?u?i`<span>${e("history_purchase_stock",H).replace("{amount}",U(L.cost,r.currencySymbol,H))}</span>`:L.cost<0?i`<span class="history-credit">${L5(L.cost,r.currencySymbol,H)}</span>`:i`<span>${e("cost",H)}: ${U(L.cost,r.currencySymbol,H)}</span>`:n}
              ${c!=null?i`<span title=${e(m?"history_parts_counted_hint":"history_parts_info_hint",H)}>${e(m?"history_parts_counted":"history_parts_info",H).replace("{amount}",U(c,r.currencySymbol,H))}</span>`:n}
              ${L.duration!=null?i`<span>${e("duration",H)}: ${v1(L.duration,H)}</span>`:n}
              ${L.trigger_value!=null?i`<span>${e("trigger_val",H)}: ${L.trigger_value}${r.triggerUnit?` ${r.triggerUnit}`:""}</span>`:n}
            </div>`:n}
      </div>
    </div>
  `}var l3="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";var A3="M13 13H11V7H13M11 15H13V17H11M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3Z";var p3="M20 21H4V10H6V19H18V10H20V21M3 3H21V9H3V3M9.5 11H14.5C14.78 11 15 11.22 15 11.5V13H9V11.5C9 11.22 9.22 11 9.5 11M5 5V7H19V5H5Z";var m3="M23 7V13H21V7M21 15H23V17H21M12 2A2 2 0 0 0 10 4A2 2 0 0 0 10 4.29C7.12 5.14 5 7.82 5 11V17L3 19V20H21V19L19 17V11C19 7.82 16.88 5.14 14 4.29A2 2 0 0 0 14 4A2 2 0 0 0 12 2M10 21A2 2 0 0 0 12 23A2 2 0 0 0 14 21Z";var c3="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.11 3.9 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.9 20.11 3 19 3M19 19H5V9H19V19M19 7H5V5H19V7Z";var v3="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z";var P2="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z";var u3="M13,16V8H15V16H13M9,16V8H11V16H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z";var K0="var(--maint-done-color, #78909c)",Y0="var(--secondary-text-color, #727272)";function D1(L){if(L.archived)return"archived";if(L.is_done)return"done";let r=L.status||"ok";return r==="ok"&&L.schedule_type==="manual"&&L.days_until_due==null?"no_due":r}var X0={done:"completed",no_due:"no_due_date"};function E2(L,r){return e(X0[L]??L,r)}function l2(L){let r=D1(L);return r==="done"?K0:r==="no_due"?Y0:F2[r]||"var(--disabled-color, #9e9e9e)"}function J0(L){return L==="no_due"?"mdi:calendar-blank-outline":N1[L==="done"?"completed":L]||"mdi:circle-medium"}var C7={"mdi:check-circle":v3,"mdi:alert-circle":l3,"mdi:alert-octagon":A3,"mdi:bell-alert":m3,"mdi:archive-outline":p3,"mdi:pause-circle-outline":u3,"mdi:calendar-blank-outline":c3,"mdi:circle-medium":P2};function H7(L){return C7[J0(L)]??P2}function x3(L,r,C="pill"){let H=D1(L),V=E2(H,r);return C==="chip"?i`<span class="status-chip ${H}">${V}</span>`:i`<span class="status-badge ${H}" role="img" title="${V}" aria-label="${V}"><ha-svg-icon .path=${H7(H)}></ha-svg-icon><span class="status-label">${V}</span></span>`}async function h3(L,r,C){if(!L)return null;let H={title:e("delete",C),confirmText:e("delete",C),danger:!0};if(!r?.part_ref)return await L.confirm({...H,message:e("delete_task_confirm",C)})?{}:null;let V=await L.confirmWithCheck({...H,message:e("delete_buy_task_confirm",C),check:e("delete_buy_task_off",C)});return V.confirmed?V.checked?{disable_auto_buy_task:!0}:{}:null}var A2=class{constructor(){this._handle=null}schedule(r,C=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,r()},C)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}};function S(L){return L.toFixed(1)}function Z3(L,r){let C=L.interval_analysis,H=C?.weibull_beta,V=C?.weibull_eta;if(H==null||V==null||V<=0)return n;let t=L.interval_days??0,M=L.suggested_interval??t;return i`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${e("weibull_reliability_curve",r)}
        ${V7(H,r)}
      </div>
      ${e7(H,V,t,M,r)}
      ${L7(C,r)}
      ${C?.confidence_interval_low!=null?t7(C,L,r):n}
    </div>
  `}function V7(L,r){let C,H,V;return L<.8?(C="early_failures",H="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",V="beta_early_failures"):L<=1.2?(C="random_failures",H="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",V="beta_random_failures"):L<=3.5?(C="wear_out",H="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",V="beta_wear_out"):(C="highly_predictable",H="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",V="beta_highly_predictable"),i`
    <span class="beta-badge ${C}">
      <ha-svg-icon path="${H}"></ha-svg-icon>
      ${e(V,r)} (\u03B2=${h(L,r,2)})
    </span>
  `}function e7(L,r,C,H,V){let u=Math.max(C,H,r,1)*1.3,_=50,R=[];for(let W=0;W<=_;W++){let Q=W/_*u,B3=1-Math.exp(-Math.pow(Q/r,L)),F3=32+Q/u*260,I3=136-B3*128;R.push([F3,I3])}let D=R.map(([W,Q])=>`${S(W)},${S(Q)}`).join(" "),K="M32,136 "+R.map(([W,Q])=>`L${S(W)},${S(Q)}`).join(" ")+` L${S(R[_][0])},136 Z`,j=32+C/u*260,Y=1-Math.exp(-Math.pow(C/r,L)),l1=136-Y*128,E3=h((1-Y)*100,V,0),B2=32+H/u*260,R3=[0,.25,.5,.75,1];return i`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${e("chart_weibull",V)}">
        ${R3.map(W=>{let Q=136-W*128;return A1`
            <line x1="${32}" y1="${S(Q)}" x2="${292}" y2="${S(Q)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${W===.5?"4,3":n}" />
            <text x="${28}" y="${S(Q+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${h(W*100,V,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(u/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(u)}</text>

        <path d="${K}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${D}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${C>0?A1`
          <line x1="${S(j)}" y1="${8}" x2="${S(j)}" y2="${S(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${S(j)}" cy="${S(l1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${S(j+4)}" y="${S(l1-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${E3}%</text>
        `:n}

        ${H>0&&H!==C?A1`
          <line x1="${S(B2)}" y1="${8}" x2="${S(B2)}" y2="${S(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:n}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${e("weibull_failure_probability",V)}</span>
      ${C>0?i`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${e("current_interval_marker",V)}</span>`:n}
      ${H>0&&H!==C?i`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${e("recommended_marker",V)}</span>`:n}
    </div>
  `}function L7(L,r){return i`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${e("characteristic_life",r)}</span>
        <span class="weibull-info-value">${c1(Math.round(L.weibull_eta),r)}</span>
      </div>
      ${L.weibull_r_squared!=null?i`
        <div class="weibull-info-item">
          <span>${e("weibull_r_squared",r)}</span>
          <span class="weibull-info-value">${h(L.weibull_r_squared,r,3)}</span>
        </div>
      `:n}
    </div>
  `}function t7(L,r,C){let H=L.confidence_interval_low,V=L.confidence_interval_high,t=r.suggested_interval??r.interval_days??0,M=r.interval_days??0,a=Math.max(0,H-5),l=V+5-a,p=(H-a)/l*100,c=(V-H)/l*100,m=(t-a)/l*100,u=M>0?(M-a)/l*100:-1;return i`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${e("confidence_interval",C)}: ${c1(t,C)} (${H}\u2013${V})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${S(p)}%;width:${S(c)}%"></div>
        ${u>=0?i`<div class="confidence-marker current" style="left:${S(u)}%"></div>`:n}
        <div class="confidence-marker recommended" style="left:${S(m)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${e("confidence_conservative",C)} (${H}${e("days",C).charAt(0)})</span>
        <span class="confidence-text high">${e("confidence_aggressive",C)} (${V}${e("days",C).charAt(0)})</span>
      </div>
    </div>
  `}function R2(L){return Math.max(1,Math.round(L||0))}var r7={one:"sensor_prediction_urgency_one",few:"sensor_prediction_urgency_few",other:"sensor_prediction_urgency"};function S3(L,r,C){let H=L.degradation_trend!=null&&L.degradation_trend!=="insufficient_data",V=L.days_until_threshold!=null,t=L.environmental_factor!=null&&L.environmental_factor!==1;if(!H&&!V&&!t)return n;let M=L.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":L.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return i`
    <div class="prediction-section">
      ${L.sensor_prediction_urgency?i`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${e(r5(R2(L.days_until_threshold),r,r7),r).replace("{days}",String(R2(L.days_until_threshold)))}
        </div>
      `:n}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${e("sensor_prediction",r)}
      </div>
      <div class="prediction-grid">
        ${H?i`
          <div class="prediction-item">
            <ha-svg-icon path="${M}"></ha-svg-icon>
            <span class="prediction-label">${e("degradation_trend",r)}</span>
            <span class="prediction-value ${L.degradation_trend}">${e("trend_"+L.degradation_trend,r)}</span>
            ${L.degradation_rate!=null?i`<span class="prediction-rate">${L.degradation_rate>0?"+":""}${h(L.degradation_rate,r,Math.abs(L.degradation_rate)>=10?0:1)} ${L.trigger_entity_info?.unit_of_measurement||""}/${e("day_short",r)}</span>`:n}
          </div>
        `:n}
        ${V?i`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${e("days_until_threshold",r)}</span>
            <span class="prediction-value prediction-days${L.days_until_threshold===0?" exceeded":L.sensor_prediction_urgency?" urgent":""}">${L.days_until_threshold===0?e("threshold_exceeded",r):"~"+t5(R2(L.days_until_threshold),r)}</span>
            ${L.threshold_prediction_date?i`<span class="prediction-date">${B(L.threshold_prediction_date,r)}</span>`:n}
            ${L.threshold_prediction_confidence?i`<span class="confidence-dot ${L.threshold_prediction_confidence}"></span>`:n}
            ${(L.prediction_cycles??0)>0?i`<span class="prediction-cycles">${e("prediction_cycles",r)}: ${L.prediction_cycles}</span>`:n}
          </div>
        `:n}
        ${t&&C.environmental?i`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${e("environmental_adjustment",r)}</span>
            <span class="prediction-value">${h(L.environmental_factor,r,2)}x</span>
            ${L.environmental_entity?i`<span class="prediction-entity entity-link" @click=${a=>o5(a,L.environmental_entity)}>${L.environmental_entity}</span>`:n}
          </div>
        `:n}
      </div>
    </div>
  `}function g3(L,r,C,H){let V=Math.max(L||1,r);return i`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${e("current",H)}: ${L!=null?c1(L,H):"\u2014"}
        </div>
        <div class="interval-visual current"
          style="width: ${L!=null?Math.min(L/V*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${e("recommended",H)}: ${c1(r,H)}
          <span class="confidence-badge ${C}">${e(`confidence_${C}`,H)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(r/V*100,100)}%"></div>
      </div>
    </div>
  `}var _3=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function f3(){return Number($1().slice(5,7))-1}function y3(L,r,C){if(!C.seasonal||!L.seasonal_factor||L.seasonal_factor===1)return n;let H=_3.map(a=>e(a,r)),V=f3(),t=L.seasonal_factors||L.interval_analysis?.seasonal_factors||null,M=t&&t.length===12?t:H.map((a,s)=>{let l=L.seasonal_factor||1,p=Math.sin((s-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,l+p))});return i`
    <div class="seasonal-card-compact">
      <h4>${e("seasonal_awareness",r)}</h4>
      <div class="seasonal-mini-chart">
        ${M.map((a,s)=>{let l=a*40,p=a<.9?"low":a>1.1?"high":"normal";return i`
            <div class="seasonal-bar ${p} ${s===V?"current":""}"
                 style="height: ${l}px"
                 title="${H[s]}: ${h(a,r,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${e("shorter",r)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${e("normal",r)}</span>
        <span class="legend-item"><span class="dot high"></span> ${e("longer",r)}</span>
      </div>
    </div>
  `}function b3(L,r){return i7(L,r)}function i7(L,r){let C=L.seasonal_factors??L.interval_analysis?.seasonal_factors;if(!C||C.length!==12)return n;let H=L.interval_analysis?.seasonal_reason,V=f3(),t=300,M=100,a=8,l=M-a-4,p=Math.max(...C,1.5),c=t/12,m=c*.65,u=a+l-1/p*l;return i`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${e("seasonal_chart_title",r)}
        ${H?i`<span class="source-tag">${H==="learned"?e("seasonal_learned",r):e("seasonal_manual",r)}</span>`:n}
      </div>
      <svg viewBox="0 0 ${t} ${M}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${e("chart_seasonal",r)}">
        <line x1="0" y1="${S(u)}" x2="${t}" y2="${S(u)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${C.map((_,R)=>{let D=_/p*l,K=R*c+(c-m)/2,j=a+l-D,Y=R===V,l1=_<1?"var(--success-color, #4caf50)":_>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return A1`
            <rect x="${S(K)}" y="${S(j)}"
              width="${S(m)}" height="${S(D)}"
              fill="${l1}" opacity="${Y?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${_3.map((_,R)=>i`<span class="seasonal-label ${R===V?"active-month":""}">${e(_,r)}</span>`)}
      </div>
    </div>
  `}var y=class extends b{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1};this._toast="";this._toastTimer=new A2;this._access=Q1;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return T(this.hass)}async openFor(C,H){(C!==this._entryId||H!==this._taskId)&&(this._task=null),this._entryId=C,this._taskId=H,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=$1(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let C=await J(this.hass);this._features={...this._features,...C.features},this._access=C.access,this._currencySymbol=T1(C.budget??void 0),V5(C.budget??void 0),this._partsCostMode=C.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(C,H){this._toast=C,this._toastTimer.schedule(()=>{this._toast=""},H)}async _loadTask(){let C=this._entryId,H=this._taskId;if(!C||!H)return;let V=++this._loadSeq,t="",M=await k(this,{type:"maintenance_supporter/object",entry_id:C},{onError:s=>{t=s}});if(V!==this._loadSeq)return;if(M===void 0){this._error=t;return}this._objectName=M?.object?.name||"";let a=(M?.tasks||[]).find(s=>s.id===H);this._task=a??null,this._taskRef=M3(M?.object,a),a||(this._error=e("ws_err_not_found",this._lang))}_runWs(C){return this._error="",k(this,C,{busy:H=>{this._busy=H},onError:H=>{this._error=H}})}_notifyChanged(C){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:C},bubbles:!0,composed:!0}))}_onComplete(C=!1){if(!(!this._entryId||!this._taskId||!this._task)){if(!C&&n1(this._task)){this._onQuickComplete();return}import("./dialog-mount-LREQZL43.js").then(async({openCompleteDialog:H})=>{let V=this._task,t=[];try{t=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}H(e3({entryId:this._entryId,taskId:this._taskId,taskName:V.name,task:V,objects:t,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}}async _onQuickComplete(){let C=this._entryId,H=this._task;this._busy=!0;try{let V=await f5(this.hass,C,H.id,this._lang);if(V.result==="dialog"){this._onComplete(!0);return}if(V.result==="failed"){this._error=V.message;return}if(V.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:V.message},bubbles:!0,composed:!0})),this.close();return}this._notifyChanged("complete"),V.undo&&J1(this,this.hass,{entryId:C,taskId:H.id,taskName:H.name},this._lang,()=>{}),this.close()}finally{this._busy=!1}}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let C=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});C!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:V3(C,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||import("./dialog-mount-LREQZL43.js").then(({openEditTaskDialog:C})=>{C(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-LREQZL43.js").then(({openQrDialog:C})=>{C({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let C=await h3(l5(this.hass),this._task,this._lang);if(!C)return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId,...C})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let C=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",C),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(e("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let C=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});C!==void 0&&(this._showToast(C?.recommended_interval?`${e("reanalyze_result",this._lang)}: ${i5(C.recommended_interval,"days",this._lang)} (${C.data_points} ${e("data_points",this._lang)})`:e("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(C){if(!this._entryId||!this._taskId)return;let H=H5(this._entryId,this._taskId,C,this._task);import("./dialog-mount-LREQZL43.js").then(({openHistoryEditDialog:V})=>V(H))}_renderRecommendation(C){if(!this._features.adaptive||!C.suggested_interval||C.suggested_interval===C.interval_days)return n;let H=this._lang;return i`
      <div class="recommendation-card">
        <h4>${e("suggested_interval",H)}</h4>
        ${g3(C.interval_days,C.suggested_interval,C.interval_confidence||"medium",H)}
        <div class="recommendation-actions">
          ${g1(this.hass?.user,this._access)?i`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${e("apply_suggestion",H)}
              </button>`:n}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${e("reanalyze",H)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(C){let H=this._lang,V=this._features.adaptive&&C.suggested_interval&&C.suggested_interval!==C.interval_days,t=C.degradation_trend!=null&&C.degradation_trend!=="insufficient_data"||C.days_until_threshold!=null||C.environmental_factor!=null&&C.environmental_factor!==1,M=this._features.adaptive&&C.interval_analysis?.weibull_beta!=null&&C.interval_analysis?.weibull_eta!=null,a=this._features.seasonal&&C.seasonal_factor&&C.seasonal_factor!==1;return!V&&!t&&!M&&!a?i`<div class="adaptive-empty">
        ${e("adaptive_no_data",H)}
      </div>`:i`
      <div class="adaptive-stack">
        ${this._toast?i`<div class="toast">${this._toast}</div>`:n}
        ${V?this._renderRecommendation(C):n}
        ${t?S3(C,H,this._features):n}
        ${M?Z3(C,H):n}
        ${a?i`
          ${y3(C,H,this._features)}
          ${C.seasonal_factors?.length===12||C.interval_analysis?.seasonal_factors?.length===12?b3(C,H):n}
        `:n}
      </div>
    `}_renderDetails(C){let H=this._lang,V=C.history||[],t=C.history_count??V.length,M=s3(V).slice(0,20);return i`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${e("times_performed",H)}</span>
            <span class="stat-value">${C.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${e("total_cost",H)}</span>
            <span class="stat-value">${U(C.total_cost??0,this._currencySymbol,H)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${e("avg_duration",H)}</span>
            <span class="stat-value">${v1(C.average_duration!=null?Math.round(C.average_duration):null,H)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${e("history",H)}</strong>
          <span class="history-count">${t}</span>
        </div>
        ${V.length===0?i`<div class="history-empty">${e("history_empty",H)}</div>`:i`
              <div class="history-list">
                ${M.map(a=>d3(a,{lang:H,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:g1(this.hass?.user,this._access)?s=>this._onEditHistoryEntry(s):void 0,readingUnit:C.reading_unit,readingSlotDelta:(s,l)=>X2(V,s,l),taskRef:this._taskRef},{compact:!0}))}
                ${t>M.length?i`<div class="history-more">… +${t-M.length} ${e("older_entries",H)}</div>`:n}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return n;let C=this._lang,H=this._task,V=g1(this.hass?.user,this._access),t=!!H&&N2(H);return O1(()=>this.close(),i`
        ${H?i`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${l2(H)}"></span>
                  ${d1()?n:i`<span class="task-name">${H.name}</span>`}
                  ${x3(H,C)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("./dialog-mount-LREQZL43.js").then(({openObjectQuickActions:M})=>{M(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${H.next_due?i`<span><strong>${e("next_due",C)}:</strong> ${B(H.next_due,C)}</span>`:n}
                  ${H.last_performed?i`<span><strong>${e("last_performed",C)}:</strong> ${B(H.last_performed,C)}</span>`:n}
                  ${H.schedule?.kind&&!["manual","one_time"].includes(H.schedule.kind)||H.interval_days!=null?i`<span><strong>${e("interval",C)}:</strong> ${a5(H,C)}</span>`:n}
                  ${I1(H)?i`<span><strong>${e("phase_current",C)}:</strong> ${I1(H)}</span>`:n}
                </div>
                ${H.notes?i`<div class="notes-body">${d2(H.notes)}</div>`:n}
              </div>

              ${this._error?$("error",this._error):n}

              ${this._showSkip?i`
                    <div class="inline-form">
                      <ms-textfield label=${e("skip_reason",C)} .value=${this._skipReason}
                        @input=${M=>{this._skipReason=M.target.value}}></ms-textfield>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${e("cancel",C)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${e("skip",C)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?i`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${e("reset_to_date",C)}
                        .hass=${this.hass}
                        .lang=${C}
                        .value=${this._resetDate}
                        @value-changed=${M=>{this._resetDate=M.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${e("cancel",C)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${e("reset",C)}
                        </button>
                      </div>
                    </div>
                  `:this._showPostpone?i`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${e("postpone_date_prompt",C)}
                        .hass=${this.hass}
                        .lang=${C}
                        .value=${this._postponeDate}
                        @value-changed=${M=>{this._postponeDate=M.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showPostpone=!1}} ?disabled=${this._busy}>
                          ${e("cancel",C)}
                        </button>
                        <button class="btn primary qa-postpone-confirm" @click=${this._onPostponeConfirm}
                          ?disabled=${this._busy||!this._postponeDate}>
                          ${e("postpone",C)}
                        </button>
                      </div>
                    </div>
                  `:i`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${()=>this._onComplete()} .disabled=${this._busy}
                        title=${n1(H)?e("qr_action_quick_complete",C):e("complete",C)}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${e("complete",C)}
                      </ha-button>
                      ${n1(H)?i`<ha-button appearance="outlined" variant="success" class="qa-complete-details" @click=${()=>this._onComplete(!0)} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:text-box-edit-outline"></ha-icon>
                            ${e("complete_with_details",C)}
                          </ha-button>`:n}
                      ${H.allow_skip!==!1?i`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${e("skip",C)}
                            </ha-button>
                          `:n}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${e("reset",C)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${V?i`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${e("edit",C)}
                          </ha-button>`:n}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${e("qr_code",C)}
                      </ha-button>
                      ${t?n:i`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${e("postpone",C)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${e("snooze",C)}
                          </ha-button>`}
                      ${V?i`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${H.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${H.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${H.archived?e("unarchive",C):e("archive",C)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${e("delete",C)}
                          </ha-button>`:n}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?e("hide_details",C):e("show_details",C)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?i`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?e("hide_stats",C):e("show_stats",C)}
                          </button>`:n}
                    </div>
                    ${this._showDetails?this._renderDetails(H):n}
                    ${this._showAdaptive?this._renderAdaptive(H):n}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${e("open_in_panel",C)}
                      </button>
                    </div>
                  `}
            `:this._error?$("error",this._error):i`<div class="loading">${e("loading",C)}</div>`}
    `,{title:H?.name})}updated(C){C.has("_open")&&this._open&&k1(this.shadowRoot)}};y.styles=[s5,b1,Z`
    :host { display: contents; --ms-modal-max-width: 460px; }
    .header { display: flex; flex-direction: column; gap: 6px; }
    .title { display: flex; align-items: center; gap: 10px; }
    .status-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .task-name { font-size: 18px; font-weight: 600; }
    .object { font-size: 13px; color: var(--secondary-text-color); }
    .link-inline {
      background: transparent; border: none; padding: 0; cursor: pointer;
      color: var(--primary-color); font-size: inherit; font-family: inherit;
    }
    .link-inline:hover { text-decoration: underline; }
    .quick-info {
      display: flex; flex-wrap: wrap; gap: 12px;
      font-size: 12px; color: var(--secondary-text-color);
      padding-top: 4px; border-top: 1px solid var(--divider-color);
    }
    .quick-info strong { color: var(--primary-text-color); font-weight: 500; }
    .actions { display: flex; gap: 8px; }
    .actions.primary-row { gap: 6px; }
    .actions.primary-row .btn { flex: 1; }
    .actions.primary-row ha-button { flex: 1; }
    /* Edit + QR are admin-tools — left-align as a group; Delete is destructive
       so it gets pushed to the far right with margin-left:auto for visual
       separation. Earlier this row was flex-end which left a strange empty
       gap on the left (user feedback). */
    .actions.secondary-row {
      padding-top: 8px; border-top: 1px solid var(--divider-color);
      justify-content: flex-start;
      /* 360 px: Edit + QR + Archive + Delete were 388 px in a 342 px row —
         Delete sat past the dialog edge (audit 2026-09-29). Wrap instead;
         Delete keeps its margin-left:auto on the second line. */
      flex-wrap: wrap;
      row-gap: 6px;
    }
    .actions.secondary-row .btn.danger,
    .actions.secondary-row ha-button.danger {
      margin-left: auto;
    }
    .actions.secondary-row ha-button { --ha-button-font-size: 13px; }
    .btn {
      padding: 8px 12px; font-size: 14px;
      border-radius: var(--ms-radius-6, 6px); cursor: pointer;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
      font-weight: 500;
      display: inline-flex; align-items: center; gap: 6px;
      transition: background 0.12s;
    }
    .btn:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .btn[disabled] { opacity: 0.5; cursor: wait; }
    .btn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
      border-color: var(--primary-color);
    }
    .btn.cancel { background: transparent; }
    .btn.ghost { padding: 6px 10px; font-size: 13px; }
    .btn.danger { color: var(--error-color); }
    .btn ha-icon { --mdc-icon-size: 18px; }
    .inline-form { display: flex; flex-direction: column; gap: 8px; }
    .notes-body {
      margin-top: 8px; padding: 8px; border-radius: var(--ms-radius-6, 6px);
      background: var(--secondary-background-color);
      font-size: 13px; white-space: pre-wrap; word-break: break-word;
    }
    .notes-body ha-markdown { white-space: normal; }
    .inline-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .footer { display: flex; justify-content: center; padding-top: 4px; }
    .link {
      background: transparent; border: none; cursor: pointer;
      color: var(--primary-color); font-size: 13px;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .link:hover { text-decoration: underline; }
    .link ha-icon { --mdc-icon-size: 14px; }
    .loading { padding: 24px; text-align: center; color: var(--secondary-text-color); }
    .error {
      padding: 8px; border-radius: var(--ms-radius-6, 6px);
      background: rgba(211,47,47,0.1);
      color: var(--error-color, #d32f2f); font-size: 13px;
    }

    /* Details (expandable Show details section) */
    .details-toggle { display: flex; justify-content: center; margin-top: 4px; }
    .details {
      display: flex; flex-direction: column; gap: 12px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .stats-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;
    }
    .stat {
      display: flex; flex-direction: column; gap: 2px;
      background: var(--secondary-background-color, rgba(255,255,255,0.04));
      padding: 8px; border-radius: var(--ms-radius-6, 6px);
      align-items: center;
    }
    .stat-label { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 16px; font-weight: 600; }
    .history-header {
      display: flex; align-items: baseline; gap: 8px;
      font-size: 14px;
    }
    .history-count {
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .history-empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; }
    /* The rows themselves are the shared renderer's (.history-entry.compact
       + the history-* classes from sharedStyles); only the list chrome is
       local. */
    .history-list { display: flex; flex-direction: column; max-height: 280px; overflow: auto; }
    .history-list .history-entry {
      padding: 6px 8px; border-radius: var(--ms-radius-6, 6px); border-bottom: none; margin-bottom: 6px;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
    }
    .history-list .history-date { font-size: 11px; }
    .history-list .history-details { font-size: 11px; }
    .history-more { padding: 8px; text-align: center; font-size: 12px; color: var(--secondary-text-color); font-style: italic; }

    /* Adaptive section — wraps the panel renderers (which assume sharedStyles
       are present) and adds dialog-specific layout. */
    .adaptive-stack {
      display: flex; flex-direction: column; gap: 12px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .adaptive-empty {
      padding: 16px; text-align: center;
      color: var(--secondary-text-color);
      font-style: italic; font-size: 13px;
      border-top: 1px solid var(--divider-color);
    }
    .toast {
      padding: 8px 12px; border-radius: var(--ms-radius-6, 6px);
      background: rgba(76, 175, 80, 0.15);
      color: var(--success-color, #4caf50); font-size: 13px; font-weight: 500;
    }
    /* The panel's card look (panel-styles.ts is not in this shadow root, so
       the card and its heading rendered bare). */
    .recommendation-card {
      padding: 16px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .recommendation-card h4 { margin: 0 0 12px; font-size: 14px; }
    /* The panel's recommendation-card uses ha-button. We use plain <button>
       in this dialog's button styles. Re-style the action row to match. */
    .recommendation-actions {
      display: flex; gap: 8px; margin-top: 8px;
    }
    /* Constrain SVG charts so they fit the dialog width even on mobile. */
    .weibull-section, .seasonal-card-compact { max-width: 100%; }
    .weibull-chart svg { max-width: 100%; height: auto; }
    .details-toggle { gap: 12px; flex-wrap: wrap; }
  `],o([v({attribute:!1})],y.prototype,"hass",2),o([d()],y.prototype,"_open",2),o([d()],y.prototype,"_entryId",2),o([d()],y.prototype,"_taskId",2),o([d()],y.prototype,"_task",2),o([d()],y.prototype,"_objectName",2),o([d()],y.prototype,"_taskRef",2),o([d()],y.prototype,"_busy",2),o([d()],y.prototype,"_error",2),o([d()],y.prototype,"_showSkip",2),o([d()],y.prototype,"_showReset",2),o([d()],y.prototype,"_showPostpone",2),o([d()],y.prototype,"_showDetails",2),o([d()],y.prototype,"_showAdaptive",2),o([d()],y.prototype,"_skipReason",2),o([d()],y.prototype,"_resetDate",2),o([d()],y.prototype,"_postponeDate",2),o([d()],y.prototype,"_features",2),o([d()],y.prototype,"_toast",2),o([d()],y.prototype,"_access",2),o([d()],y.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",y);function O3(L,r,C){return L&&r?.[L]?.name||C}function k3(L){if(L.key!=="Enter"&&L.key!==" ")return;let C=L.target?.closest?.('[role="menuitem"], [role="button"]');!C||C.getAttribute("aria-disabled")==="true"||(L.preventDefault(),C.click())}var z=class extends b{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=Q1;this._loadSeq=0}get _lang(){return T(this.hass)}async openFor(C){C!==this._entryId&&(this._data=null),this._entryId=C,this._error="",this._open=!0,await Promise.all([this._load(),J(this.hass).then(H=>{this._access=H.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let C=this._entryId;if(!C)return;let H=++this._loadSeq,V="",t=await k(this,{type:"maintenance_supporter/object",entry_id:C},{onError:M=>{V=M}});H===this._loadSeq&&(t===void 0?this._error=V:this._data=t)}_runWs(C){return this._error="",k(this,C,{busy:H=>{this._busy=H},onError:H=>{this._error=H}})}_onEditObject(){!this._entryId||!this._data||import("./dialog-mount-LREQZL43.js").then(({openEditObjectDialog:C})=>{C(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("./dialog-mount-LREQZL43.js").then(({openCreateTaskDialog:C})=>{C(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await B1(this.hass,{title:e("delete",this._lang),message:e("delete_object_confirm",this._lang),confirmText:e("delete",this._lang),danger:!0}))return;let H=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:H})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:H},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let C=!!this._data.object.archived;if(!C&&!await B1(this.hass,{title:e("archive_object",this._lang),message:e("confirm_archive_object",this._lang),confirmText:e("archive_object",this._lang)}))return;let H=this._entryId;await this._runWs({type:C?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:H})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:H},bubbles:!0,composed:!0})),this.close())}_onTaskClick(C){this._entryId&&import("./dialog-mount-LREQZL43.js").then(({openTaskQuickActions:H})=>{H(this._entryId,C)})}render(){if(!this._open)return n;let C=this._lang,H=this._data,V=H?.object,t=H?.tasks||[],M=g1(this.hass?.user,this._access);return O1(()=>this.close(),i`
        ${H&&V?i`
              <div class="header">
                ${d1()?n:i`<div class="title">${V.name}</div>`}
                ${this._renderMetaRow(V)}
              </div>

              ${this._error?$("error",this._error):n}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${e("tasks",C)}</strong>
                  <span class="count">${t.length}</span>
                </div>
                ${t.length===0?i`<div class="empty">${e("no_tasks",C)}</div>`:i`
                      <div class="task-list">
                        ${t.map(a=>i`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(a.id)} @keydown=${k3}>
                            <span class="status-dot" style="background: ${l2(a)}"></span>
                            <span class="task-name">${a.name}</span>
                            <span class="task-status ${D1(a)}">${E2(D1(a),C)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${V.notes?i`
                    <div class="notes-section">
                      <strong>${e("object_notes_label",C)}</strong>
                      <div class="notes-body">${d2(V.notes)}</div>
                    </div>
                  `:n}

              ${M?i`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${e("add_task",C)}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${e("edit",C)}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${V.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${V.archived?e("unarchive_object",C):e("archive_object",C)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${e("delete",C)}
                      </button>
                    </div>
                  `:n}
            `:this._error?$("error",this._error):i`<div class="loading">${e("loading",C)}</div>`}
    `,{title:V?.name})}updated(C){C.has("_open")&&this._open&&k1(this.shadowRoot)}_renderMetaRow(C){let H=this._lang,V=[];return C.area_id&&V.push([e("area",H),O3(C.area_id,this.hass?.areas,e("no_area",H))]),C.manufacturer&&V.push([e("manufacturer",H),C.manufacturer]),C.model&&V.push([e("model",H),C.model]),C.serial_number&&V.push([e("serial_number_label",H),C.serial_number]),C.installation_date&&V.push([e("installed",H),B(C.installation_date,H)]),C.warranty_expiry&&V.push([e("warranty",H),B(C.warranty_expiry,H)]),C.documentation_url&&V.push([e("documentation_url_label",H),C.documentation_url,n2(C.documentation_url)]),V.length===0?n:i`
      <div class="meta">
        ${V.map(([t,M,a])=>i`
            <div class="meta-item">
              <span class="meta-label">${t}</span>
              <span class="meta-value">${a||t3(M)?i`<a href="${M}" target="_blank" rel="noopener noreferrer">${M}</a>`:M}</span>
            </div>
          `)}
      </div>
    `}};z.styles=[b1,Z`
    :host { display: contents; }
    .header { display: flex; flex-direction: column; gap: 6px; }
    .title { font-size: 20px; font-weight: 600; }
    .meta { display: flex; flex-direction: column; gap: 4px; padding-top: 4px; border-top: 1px solid var(--divider-color); }
    .meta-item { display: flex; gap: 8px; font-size: 12px; }
    .meta-label { color: var(--secondary-text-color); min-width: 100px; }
    .meta-value { color: var(--primary-text-color); flex: 1; word-break: break-word; }
    .meta-value a { color: var(--primary-color); }
    .tasks-section, .notes-section { display: flex; flex-direction: column; gap: 6px; }
    .section-header { display: flex; align-items: baseline; gap: 8px; }
    .count {
      font-size: 11px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; padding: 8px 0; }
    .task-list { display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow: auto; }
    .task-row {
      display: flex; align-items: center; gap: 10px;
      padding: 8px; border-radius: var(--ms-radius-6, 6px); cursor: pointer;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      transition: background 0.12s;
    }
    .task-row:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .task-row:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .task-name { flex: 1; font-size: 14px; }
    .task-status { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; }
    .notes-body { white-space: pre-wrap; font-size: 13px; padding: 8px; background: var(--secondary-background-color); border-radius: var(--ms-radius-6, 6px); }
    .notes-body ha-markdown { white-space: normal; }
    .actions { display: flex; gap: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color); }
    .actions .btn { flex: 1; }
    .btn {
      padding: 8px; font-size: 13px; border-radius: var(--ms-radius-6, 6px); cursor: pointer;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color); font-weight: 500;
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    }
    .btn:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .btn[disabled] { opacity: 0.5; cursor: wait; }
    .btn.primary { background: var(--primary-color); color: var(--text-primary-color, white); border-color: var(--primary-color); }
    .btn.danger { color: var(--error-color); }
    .btn ha-icon { --mdc-icon-size: 16px; }
    .loading { padding: 24px; text-align: center; color: var(--secondary-text-color); }
    .error { padding: 8px; border-radius: var(--ms-radius-6, 6px); background: rgba(211,47,47,0.1); color: var(--error-color); font-size: 13px; }
  `],o([v({attribute:!1})],z.prototype,"hass",2),o([d()],z.prototype,"_open",2),o([d()],z.prototype,"_entryId",2),o([d()],z.prototype,"_data",2),o([d()],z.prototype,"_busy",2),o([d()],z.prototype,"_error",2),o([d()],z.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",z);var w3="maintenance-object-dialog",$3="maintenance-task-dialog",a7="maintenance-history-edit-dialog",o7="maintenance-complete-dialog",n7="maintenance-qr-dialog",s7="maintenance-task-quick-actions-dialog",d7="maintenance-object-quick-actions-dialog";function w1(){return document.querySelector("home-assistant")?.hass}function l7(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function V1(L){let r=l7(),C=r.querySelector(L)??document.body.querySelector(L);return C?C.parentNode!==r&&r.appendChild(C):(C=document.createElement(L),r.appendChild(C)),C}function e1(L){let r=w1();if(!r)return!1;L.hass=r;let C=T(r);return q2(C)||W2(C).then(()=>{L.requestUpdate?.()}),e5(r.locale,r.config?.country,r.config?.time_zone),!0}function zC(L){return J(L).then(r=>r.rowActionStyle)}function jC(){p5()}function QC(){let L=V1(w3);return e1(L)?(L.openCreate(),T3(L),!0):!1}async function T3(L){let r=w1();r&&(L.placesEnabled=(await J(r)).features.places)}function GC(L,r){let C=V1(w3);return e1(C)?(C.openEdit(L,r),T3(C),!0):!1}function KC(L="",r){let C=V1($3);if(!e1(C))return!1;let H=w1();return H?((async()=>{let V=await J(H),t=C;P3(t,V),t.openCreate(L,r)})(),!0):!1}function P3(L,r){L.checklistsEnabled=r.features.checklists,L.scheduleTimeEnabled=r.features.schedule_time,L.completionActionsEnabled=r.features.completion_actions,L.adaptiveFeature=r.features.adaptive,L.seasonalFeature=r.features.seasonal,L.environmentalFeature=r.features.environmental,L.defaultWarningDays=r.defaultWarningDays,L.mirrorTodoDefault=r.mirrorTodoDefault,L.betaEditor=r.features.beta_editor}function YC(L,r){let C=V1($3);if(!e1(C))return!1;let H=w1();return H?((async()=>{try{let[V,t]=await Promise.all([H.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:L}),J(H)]),M=(V.tasks||[]).find(s=>s.id===r);if(!M){console.warn(`openEditTaskDialog: task ${r} not found in entry ${L}`);return}let a=C;P3(a,t),await a.openEdit(L,M)}catch(V){console.warn("openEditTaskDialog: failed to load task/features",V)}})(),!0):!1}function XC(L){let r=V1(a7);return e1(r)?(r.openEdit(L),!0):!1}function JC(L){let r=V1(o7);if(!e1(r))return!1;let C=r;return C.__msUndoWired||(C.__msUndoWired=!0,r.addEventListener("task-completed",H=>{let V=H.detail,t=w1();V?.undo&&t&&J1(r,t,V,T(t),()=>{})})),L3(r,L,T(w1())),!0}function CH(L){let r=V1(n7);return e1(r)?(r.openForTask(L.entry_id,L.task_id,L.object_name,L.task_name),!0):!1}function HH(L,r){let C=V1(s7);return e1(C)?(C.openFor(L,r),!0):!1}function VH(L){let r=V1(d7);return e1(r)?(r.openFor(L),!0):!1}export{jC as __resetSettingsCacheForTests,zC as getRowActionStyle,JC as openCompleteDialog,QC as openCreateObjectDialog,KC as openCreateTaskDialog,GC as openEditObjectDialog,YC as openEditTaskDialog,XC as openHistoryEditDialog,VH as openObjectQuickActions,CH as openQrDialog,HH as openTaskQuickActions};
