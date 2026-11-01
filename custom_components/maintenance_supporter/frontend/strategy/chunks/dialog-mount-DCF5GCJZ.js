/*! maintenance_supporter frontend 2.116.0 */
import{a as gt,b as Vt,c as Kt,d as Qt,e as Gt,f as Yt,g as Zt,h as Jt,i as Xt,j as ei,l as re}from"./chunk-VZQBGU3N.js";import"./chunk-RA7UOGL3.js";import{a as Qe,b as Ee,c as Ge,d as Ye,e as _i,f as X,g as mi}from"./chunk-HGHRNFCM.js";import{c as xe,d as ui,e as Oe,f as Ne,g as Me,h as yt,i as ne,j as ke,k as Ke,l as q,m as A,n as S,o as hi,p as Le}from"./chunk-ECOV7AFV.js";import{A as ai,B as ye,C as be,D as oi,E as li,F as di,G as $e,H as ci,I as pi,J as R,L as we,M as le,N as de,O as P,a as k,b as o,c as me,e as p,g as C,h as y,i as h,j as He,l as ti,m as ii,n as We,o as ge,p as x,q as si,r as B,s as fe,t as vt,u as L,v as Be,w as Ve,x as ri,y as ve,z as ni}from"./chunk-EATPVZOC.js";import{a as c,b as Lt,c as Dt,d as Ft,f as jt,g as ze,k as H,l as s,m as zt,n as Ut,p as ft,q as Ue,s as Pe,t as Wt,u as J,v as Bt}from"./chunk-3QSJHADY.js";function gi(r){return r.object.parent_entry_id||null}function fi(r){return!r.object.archived&&!r.object.battery_fleet}function qs(r,a){let e=new Map(r.map(l=>[l.entry_id,l])),t=[],i=new Set([a]),n=e.get(a);for(;n;){let l=gi(n);if(!l||i.has(l))break;let d=e.get(l);if(!d)break;i.add(l),t.unshift(d),n=d}return t}function vi(r,a){return[...qs(r,a.entry_id),a].map(e=>e.object.name).join(" \u203A ")}function yi(r,a){let e=new Map;for(let n of r){let l=gi(n);l&&(e.has(l)||e.set(l,[]),e.get(l).push(n.entry_id))}let t=new Set,i=[...e.get(a)??[]];for(;i.length;){let n=i.pop();n===a||t.has(n)||(t.add(n),i.push(...e.get(n)??[]))}return t}var O=class extends C{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}_onHaInput(e){e.stopPropagation(),this.value=e.target.value??"",this.dispatchEvent(new CustomEvent(e.type==="change"?"change":"input",{bubbles:!0,composed:!0,detail:{value:this.value}}))}render(){return!this.multiline&&we("ha-input")?o`
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
        ></ha-input>`:o`
      <label class="field">
        ${this.label?o`<span class="label">${this.label}${this.required?o`<span class="req">*</span>`:p}</span>`:p}
        ${this.multiline?o`
        <textarea
          .value=${this.value??""}
          rows=${this.rows}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @change=${this._onInput}
        ></textarea>`:o`
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??p}
          min=${this.min??p}
          max=${this.max??p}
          pattern=${this.pattern??p}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?o`<span class="helper">${this.helper}</span>`:p}
      </label>
    `}};O.styles=k`
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
  `,c([y()],O.prototype,"label",2),c([y()],O.prototype,"value",2),c([y()],O.prototype,"placeholder",2),c([y()],O.prototype,"type",2),c([y({type:Boolean})],O.prototype,"required",2),c([y({type:Boolean})],O.prototype,"disabled",2),c([y()],O.prototype,"step",2),c([y()],O.prototype,"min",2),c([y()],O.prototype,"max",2),c([y()],O.prototype,"pattern",2),c([y()],O.prototype,"helper",2),c([y({type:Boolean})],O.prototype,"multiline",2),c([y({type:Number})],O.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",O);var E=class extends C{constructor(){super(...arguments);this.objects=[];this.placesEnabled=!1;this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._place="";this._remindOnSite=!1;this._entryId=null;this._replacing=!1;this._oldDeviceId="";this._replaceDevice="keep"}get _lang(){return H(this.hass)}openCreate(e=""){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId=e,this._place="",this._remindOnSite=!1,this._replacing=!1,this._error="",this._open=!0}openReplace(e,t){this._entryId=e,this._replacing=!0,this._name=t.name||"",this._oldDeviceId=t.ha_device_id||"",this._haDeviceId="",this._replaceDevice="keep",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._haDeviceId=t.ha_device_id||"",this._parentEntryId=t.parent_entry_id||"",this._place=t.place||"",this._remindOnSite=!!t.remind_on_site,this._replacing=!1,this._error="",this._open=!0}async _replace(){if(this._loading||!this._entryId)return;let e={type:"maintenance_supporter/object/replace",entry_id:this._entryId,name:this._name.trim()||null};this._oldDeviceId?(this._replaceDevice==="other"&&(e.ha_device_id=this._haDeviceId),this._replaceDevice==="none"&&(e.ha_device_id=null)):this._haDeviceId&&(e.ha_device_id=this._haDeviceId);let t=await R(this,e,{busy:i=>{this._loading=i},fallbackKey:"save_error",onError:i=>{this._error=i}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-replaced",{detail:{entry_id:t?.entry_id,device_swap:t?.device_swap}})))}_deviceName(e){let i=this.hass?.devices?.[e];return i?.name_by_user||i?.name||e}_deviceSelector(e){return o`<ha-form
      .hass=${this.hass}
      .data=${{device:this._haDeviceId||void 0}}
      .schema=${[{name:"device",selector:{device:{}}}]}
      .computeLabel=${()=>e}
      @value-changed=${t=>this._haDeviceId=t.detail.value?.device||""}
    ></ha-form>`}_renderReplace(){let e=this._lang,t=(n,l)=>o`<label class="radio-row">
      <input
        type="radio"
        name="replace-device"
        .checked=${this._replaceDevice===n}
        @change=${()=>{this._replaceDevice=n}}
      />
      <span>${l}</span>
    </label>`,i=this._replaceDevice==="other"&&!this._haDeviceId;return o`
      <ha-dialog open .headerTitle=${le(s("replace_object",e))} @closed=${this._close}>
        ${de(s("replace_object",e))}
        <div class="content">
          ${this._error?P("error",this._error):p}
          <div class="hint">${s("replace_object_prompt",e)}</div>
          <ms-textfield
            label="${s("replace_name_label",e)}"
            .value=${this._name}
            @input=${n=>this._name=n.target.value}
          ></ms-textfield>
          ${this._oldDeviceId?o`<div class="radio-group" role="radiogroup" aria-label=${s("replace_device_heading",e)}>
                <div class="textarea-label">${s("replace_device_heading",e)}</div>
                ${t("keep",s("replace_device_keep",e).replace("{device}",this._deviceName(this._oldDeviceId)))}
                ${this._replaceDevice==="keep"?o`<div class="hint">${s("replace_device_keep_hint",e)}</div>`:p}
                ${t("other",s("replace_device_other",e))}
                ${this._replaceDevice==="other"?o`${this._deviceSelector(s("replace_device_pick",e))}
                      <div class="hint">${s("replace_device_other_hint",e)}</div>`:p}
                ${t("none",s("replace_device_none",e))}
              </div>`:this._deviceSelector(s("link_device_optional",e))}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button @click=${this._replace} .disabled=${this._loading||i}>
            ${this._loading?s("saving",e):s("replace_object",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}_renderPlace(e){let t=!!this._place&&!this.hass?.states?.[this._place];return o`
      <ha-form
        .hass=${this.hass}
        .data=${{place:this._place||void 0}}
        .schema=${[{name:"place",selector:{entity:{domain:"zone"}}}]}
        .computeLabel=${()=>s("place_optional",e)}
        @value-changed=${i=>{this._place=i.detail.value?.place||"",this._place||(this._remindOnSite=!1)}}
      ></ha-form>
      ${t?o`<div class="place-missing">${s("place_missing",e)}</div>`:p}
      <label class="place-on-site ${this._place?"":"disabled"}">
        <input
          type="checkbox"
          .checked=${this._remindOnSite}
          ?disabled=${!this._place}
          @change=${i=>this._remindOnSite=i.target.checked}
        />
        <span>${s("remind_on_site",e)}</span>
      </label>
      ${this._place?o`<div class="place-hint">${s("remind_on_site_hint",e)}</div>`:p}
    `}async _save(){if(this._loading||!this._name.trim())return;this._error="";let e={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null,...this.placesEnabled?{place:this._place||null,remind_on_site:!!this._place&&this._remindOnSite}:{}},t=await R(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...e}:{type:"maintenance_supporter/object/create",...e},{busy:i=>{this._loading=i},fallbackKey:"save_error",onError:i=>{this._error=i}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved",{detail:{device_swap:t?.device_swap}})))}_parentChoices(){let e=this.objects||[],t=this._entryId?yi(e,this._entryId):new Set;return e.filter(i=>i.entry_id!==this._entryId&&!t.has(i.entry_id)&&(fi(i)||i.entry_id===this._parentEntryId)).map(i=>({entryId:i.entry_id,label:vi(e,i)})).sort((i,n)=>i.label.localeCompare(n.label))}_close(){this._open=!1}render(){if(!this._open)return o``;if(this._replacing)return this._renderReplace();let e=this._lang,t=this._entryId?s("edit_object",e):s("new_object",e);return o`
      <ha-dialog open .headerTitle=${le(t)} @closed=${this._close}>
        ${de(t)}
        <div class="content">
          ${this._error?P("error",this._error):p}
          <ms-textfield
            label="${s("name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${i=>this._manufacturer=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("model_optional",e)}"
            .value=${this._model}
            @input=${i=>this._model=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${i=>this._serialNumber=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${s("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${i=>this._areaId=i.detail.value||""}
          ></ha-area-picker>
          ${this.placesEnabled?this._renderPlace(e):p}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${s("installation_date_optional",e)}"
            .value=${this._installationDate}
            @value-changed=${i=>this._installationDate=i.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${s("warranty_expiry_optional",e)}"
            .value=${this._warrantyExpiry}
            @value-changed=${i=>this._warrantyExpiry=i.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>s("link_device_optional",e)}
            @value-changed=${i=>this._haDeviceId=i.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?o`<label class="textarea-field">
                <span class="textarea-label">${s("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${i=>this._parentEntryId=i.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${s("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(i=>o`<option
                      value=${i.entryId}
                      ?selected=${this._parentEntryId===i.entryId}
                    >${i.label}</option>`)}
                </select>
                <span class="md-hint">${s("parent_object_hint",e)}</span>
              </label>`:p}
          <label class="textarea-field">
            <span class="textarea-label">${s("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${i=>this._notes=i.target.value}
            ></textarea>
            <span class="md-hint">${s("notes_markdown_hint",e)}</span>
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?s("saving",this._lang):s("save",this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};E.styles=k`
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
  `,c([y({attribute:!1})],E.prototype,"hass",2),c([y({attribute:!1})],E.prototype,"objects",2),c([y({type:Boolean})],E.prototype,"placesEnabled",2),c([h()],E.prototype,"_open",2),c([h()],E.prototype,"_loading",2),c([h()],E.prototype,"_error",2),c([h()],E.prototype,"_name",2),c([h()],E.prototype,"_manufacturer",2),c([h()],E.prototype,"_model",2),c([h()],E.prototype,"_serialNumber",2),c([h()],E.prototype,"_areaId",2),c([h()],E.prototype,"_installationDate",2),c([h()],E.prototype,"_warrantyExpiry",2),c([h()],E.prototype,"_documentationUrl",2),c([h()],E.prototype,"_notes",2),c([h()],E.prototype,"_haDeviceId",2),c([h()],E.prototype,"_parentEntryId",2),c([h()],E.prototype,"_place",2),c([h()],E.prototype,"_remindOnSite",2),c([h()],E.prototype,"_entryId",2),c([h()],E.prototype,"_replacing",2),c([h()],E.prototype,"_oldDeviceId",2),c([h()],E.prototype,"_replaceDevice",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",E);var bi=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"];function Ps(r){let a=(r||"").split(/\s+/).filter(Boolean);return a.length===0?"?":a.length===1?a[0][0].toUpperCase():(a[0][0]+a[a.length-1][0]).toUpperCase()}function Hs(r){let a=0;for(let e of r)a=a*31+e.charCodeAt(0)>>>0;return bi[a%bi.length]}function $i(r){return r?{id:r.id,name:r.name,initials:r.initials||Ps(r.name),color:r.color||Hs(r.id)}:null}var Ze=class{constructor(a){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=a}updateHass(a){this.hass=a}async getUsers(a=!1){let e=Date.now();if(!a&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(a,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:a,task_id:e,user_id:t})}async getTasksByUser(a){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:a})).tasks}getUserName(a){return!a||!this.usersCache?null:this.usersCache.find(t=>t.id===a)?.name||null}getPerson(a){return $i(this.getUser(a))}getUser(a){return!a||!this.usersCache?null:this.usersCache.find(e=>e.id===a)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(a){return a?a===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};function G(r){return`${r.entry_id??""}\0${r.part_id}`}function xi(r,a,e,t){let i=!!r.entry_id&&r.entry_id!==a,n=i?r.entry_id:a,l=e.find(g=>g.entry_id===n),d=(l?.parts||[]).find(g=>g.id===r.part_id)||null,u=i&&l?.object?.name||"",_=d?.name||s("shared_part_unknown",t);return{part:d,foreign:i,ownerName:u,label:u?`${_} (${u})`:_}}function ki(r,a,e,t){let{part:i,label:n}=xi(r,a,e,t),l=i&&i.stock!==null&&i.stock!==void 0?` (${fe(i.stock,i.unit,t)})`:"",d=i?.storage_location?` \u2014 ${i.storage_location}`:"";return`${x(r.quantity,t)}\xD7 ${n}${l}${d}`}function wi(r,a,e,t){let i=e.find(u=>u.entry_id===a),n=u=>u?.object.battery_fleet?{cost_mode:"purchase"}:{},l=(i?.parts||[]).map(u=>({...u,...n(i)})),d=new Set(l.map(u=>G({part_id:u.id})));for(let u of r?.consumes_parts||[]){if(!u.entry_id||u.entry_id===a)continue;let _=G(u);if(d.has(_))continue;d.add(_);let{part:g,ownerName:f}=xi(u,a,e,t);l.push({id:u.part_id,name:g?.name||s("shared_part_unknown",t),unit:g?.unit,stock:g?.stock??null,storage_location:g?.storage_location,cost:g?.cost??null,package_size:g?.package_size??null,cost_mode:g?.cost_mode??null,...n(e.find(v=>v.entry_id===u.entry_id)),entry_id:u.entry_id,owner_name:f})}return l}var bt=["sensor","binary_sensor","number","input_number","input_boolean","counter","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant","input_select","select","input_datetime","date","datetime","timer","update"],Ei=["sensor"];function ce(r){let a=(r??"").trim();if(a==="")return null;let e=Number(a.replace(",","."));return!Number.isFinite(e)||e<0?null:Math.round(e)}var Os={changed_since:"undo_changed",nothing_to_undo:"undo_nothing"};async function Ns(r,a,e,t){let i="",n=await R({hass:r},{type:"maintenance_supporter/task/undo",entry_id:a,task_id:e},{lang:t,onError:(l,d)=>{let u=Os[d?.code??""];i=u?s(u,t):l}});return n===void 0?{ok:!1,message:i}:{ok:!0,message:s(n?.action_ran?"undo_done_action_ran":"undo_done",t)}}function Je(r,a){let e=r?.already_recorded_seconds;return typeof e=="number"?s("completion_already_recorded",a).replace("{seconds}",String(e)):null}function Xe(r,a,e,t,i){let n=(l,d)=>r.dispatchEvent(new CustomEvent("hass-notification",{detail:d?{message:l,action:d,duration:1e4}:{message:l},bubbles:!0,composed:!0}));n(s("task_completed_named",t).replace("{task}",e.taskName),{text:s("undo",t),action:()=>{Ns(a,e.entryId,e.taskId,t).then(l=>{n(l.message),l.ok&&i()})}})}function pe(r){let a=r?.quick_complete_defaults;return!!a&&typeof a=="object"&&!Array.isArray(a)}function et(r){return pe(r)?{...r.quick_complete_defaults}:null}var Ms=new Set(["no_defaults","completion_details_required","tag_scan_required"]);async function Ti(r,a,e,t){let i={message:"",code:""},n=await R({hass:r},{type:"maintenance_supporter/task/quick_complete",entry_id:a,task_id:e,source:"panel"},{lang:t,fallbackKey:"action_error",onError:(d,u)=>{i={message:d,code:u?.code??""}}});if(n===void 0)return Ms.has(i.code)?{result:"dialog"}:{result:"failed",message:i.message};let l=Je(n,t);return l?{result:"already",message:l}:{result:"done",undo:n?.undo===!0}}var $t=["notes","cost","duration","photo","user"],Te={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"};var Ls={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},Ds="mdi:wrench-clock",xt=r=>r&&Ls[r]||Ds;function De(r,a){let e=r?.states?.[a]?.attributes?.friendly_name;return typeof e=="string"&&e?e:a}function tt(r){return r?Array.isArray(r.entity_ids)&&r.entity_ids.length>0?[...r.entity_ids]:r.entity_id?[r.entity_id]:[]:[]}function Si(r){if(!(!r||r.type==="compound"))return tt(r)[0]}var kt=["low","normal","high"],Dn=[...kt].reverse(),Ii=["round_robin","least_completed","random"];function Ci(r,a){return r?.entities?.[a]?.platform==="maintenance_supporter"}function Ai(r){return Object.keys(r?.entities||{}).filter(a=>a.startsWith("todo.")&&Ci(r,a))}function it(r,a){return[...new Set(a.filter(e=>e&&!Ci(r,e)))].slice(0,5)}var Fs=["weekdays","nth_weekday","day_of_month","calendar"],js=["time_based",...Fs,"one_time"],zs=["threshold","counter","state_change","runtime","due_date","compound"],Us={time_based:"mdi:calendar-sync",weekdays:"mdi:calendar-week",nth_weekday:"mdi:calendar-today",day_of_month:"mdi:calendar-month",calendar:"mdi:calendar-star",one_time:"mdi:calendar-check",manual:"mdi:gesture-tap",sensor_based:"mdi:calendar-sync"},wt={threshold:"mdi:gauge",counter:"mdi:counter",state_change:"mdi:state-machine",runtime:"mdi:timer-outline",due_date:"mdi:calendar-alert",compound:"mdi:set-center"};function Ri(r){return Us[r]??"mdi:calendar"}var Ws={days:"day",weeks:"week",months:"month",years:"year"};function Bs(r,a,e){return ge(r,Ws[a]??"day",e)}function st(r){let a=parseFloat(r);return Number.isFinite(a)?a:null}function N(r,a){return Object.entries(a).reduce((e,[t,i])=>e.split(`{${t}}`).join(i),r)}function Vs(r,a){let e=a,t=()=>{let i=parseInt(r.intervalDays,10);return Number.isFinite(i)&&i>0?Bs(i,r.intervalUnit,e):null};switch(r.scheduleType){case"time_based":{let i=t();return i?N(s("beta_rules_every",e),{interval:i}):s("beta_rules_manual",e)}case"one_time":return r.dueDate?N(s("beta_rules_once_on",e),{date:L(r.dueDate,e)}):s("beta_rules_no_date",e);case"manual":return s("beta_rules_manual",e);case"weekdays":{let i=[...r.weekdays].sort((n,l)=>n-l).map(n=>be(n,e,"short"));return`${s("recurrence_on_days",e)}: ${i.length?i.join(", "):"\u2014"}`}case"nth_weekday":{let i=r.nth==="-1"?s("ord_last",e):s(`ord_${r.nth}`,e);return`${s("nth_weekday",e)}: ${i} ${be(parseInt(r.nthWeekday,10)||0,e,"long")}`}case"day_of_month":return`${s("day_of_month",e)}: ${r.domLastDay?s("recurrence_last_day",e):r.domDay}`;case"calendar":return`${s("calendar_entity_label",e)}: ${r.calendarEntity||"\u2014"}`;case"sensor_based":{let i=t();return i?N(s(r.triggerCombinator==="all"?"beta_rules_safety_all":"beta_rules_safety_any",e),{interval:i}):s("beta_rules_sensor_only",e)}default:return s(r.scheduleType,e)}}function Ks(r,a){let e=[];r.scheduleType==="time_based"&&parseInt(r.intervalDays,10)>0&&e.push(s(r.intervalAnchor==="planned"?"anchor_planned":"anchor_completion",a));let t=parseInt(r.warningDays,10);return r.scheduleType!=="manual"&&Number.isFinite(t)&&t>0&&e.push(N(s("beta_rules_due_soon",a),{interval:ge(t,"day",a)})),e}function Qs(r,a){let e=a;if(r.triggerType==="compound"){let d=r.compoundLogic==="OR"?"beta_rules_any_of":"beta_rules_all_of";return N(s(d,e),{n:x(r.compoundCount,e)})}if(!r.triggerEntityIds.length)return s("beta_rules_pick_entity",e);let t=[],i=parseInt(r.forMinutes,10),n=Number.isFinite(i)&&i>0?N(s("beta_rules_for",e),{duration:ge(i,"minute",e)}):"";switch(r.triggerType){case"threshold":{let d=st(r.above),u=st(r.below);d!==null&&t.push(N(s("beta_rules_above",e),{value:x(d,e)})),u!==null&&t.push(N(s("beta_rules_below",e),{value:x(u,e)})),t.length||t.push(s("threshold",e)),n&&t.push(n);break}case"counter":{let d=st(r.targetValue),u=d===null?"\u2014":x(d,e);t.push(N(s(r.deltaMode?"beta_rules_counter_delta":"beta_rules_counter_reaches",e),{value:u}));break}case"state_change":{let d=r.fromState.trim(),u=r.toState.trim();d&&t.push(N(s("beta_rules_changes_from",e),{state:d})),u&&t.push(N(s("beta_rules_changes_to",e),{state:u})),!d&&!u&&t.push(s("beta_rules_changes",e));let _=parseInt(r.targetChanges,10);Number.isFinite(_)&&_>1&&t.push(N(s("beta_rules_times",e),{n:x(_,e)})),n&&t.push(n);break}case"runtime":{let d=st(r.runtimeHours);t.push(N(s("beta_rules_runs_for",e),{duration:d===null?"\u2014":ge(d,"hour",e)}));break}case"due_date":{let d=parseInt(r.daysBefore,10);t.push(Number.isFinite(d)&&d>0?N(s("beta_rules_date_before",e),{interval:ge(d,"day",e)}):s("beta_rules_date_on",e));break}}let l=t.join(" \xB7 ");return r.triggerAttribute?`${l} (${r.triggerAttribute})`:l}function Gs(r,a){let e=a.lang,t=[],i;if(r.completeWhenEntity&&r.completeWhenState.trim()){let l=a.entityName(r.completeWhenEntity);t.push(l),i=N(s("complete_when_badge",e),{entity:l,state:r.completeWhenState.trim()});let d=parseInt(r.completeWhenFor,10);Number.isFinite(d)&&d>0&&(i+=` \xB7 ${N(s("complete_when_badge_for",e),{minutes:x(d,e)})}`),r.completeWhenAnyTime&&(i+=` \xB7 ${s("complete_when_badge_any_time",e)}`)}else i=s("beta_rules_by_hand",e);let n=[];return r.quickOn&&n.push(s("quick_complete_label",e)),r.requiredCount>0&&n.push(`${s("require_on_completion",e)}: ${x(r.requiredCount,e)}`),r.checklistCount>0&&n.push(`${s("checklist",e)}: ${x(r.checklistCount,e)}`),r.partsCount>0&&n.push(`${s("consumes_parts_label",e)}: ${x(r.partsCount,e)}`),r.requireTagScan&&n.push(s("require_tag_scan",e)),r.allowSkip||n.push(s("disallow_skip",e)),{text:i,chips:t,badges:n}}function qi(r,a){let e=a.lang,t=[];t.push({id:"task",icon:"mdi:clipboard-text-outline",text:r.name.trim()||s("beta_rules_name_missing",e),chips:[],badges:[r.typeLabel,...r.enabled?[]:[s("disabled",e)]],removable:!1});let i=r.scheduleType==="sensor_based";if(t.push({id:"schedule",icon:Ri(r.scheduleType),text:Vs(r,e),chips:[],badges:Ks(r,e),removable:i?parseInt(r.intervalDays,10)>0:r.scheduleType!=="manual"}),i){let u=r.triggerType==="compound"?r.compoundEntityIds:r.triggerEntityIds;t.push({id:"trigger",icon:wt[r.triggerType]??"mdi:gauge",text:Qs(r,e),chips:[...new Set(u)].map(_=>a.entityName(_)),badges:r.triggerType!=="compound"&&r.triggerEntityIds.length>1?[s(r.entityLogic==="all"?"entity_logic_all":"entity_logic_any",e)]:[],removable:!0})}let n=Gs(r,a);t.push({id:"completion",icon:"mdi:check-circle-outline",text:n.text,chips:n.chips,badges:n.badges,removable:!1});let l=r.pool.length>=2&&r.rotation?[s(`rotation_${r.rotation}`,e)]:[],d;return r.responsibleUserId?d=`${s("responsible_user",e)}: ${a.userName(r.responsibleUserId)}`:r.pool.length?d=`${s("task_shared_with",e)}: ${r.pool.map(u=>a.userName(u)).join(", ")}`:d=s("beta_rules_nobody",e),t.push({id:"people",icon:"mdi:account-multiple",text:d,chips:[],badges:l,removable:!1}),t.push({id:"notifications",icon:r.notifyEnabled?"mdi:bell-ring-outline":"mdi:bell-off-outline",text:r.notifyEnabled?s("beta_rules_reminders_on",e):s("no_notifications",e),chips:r.mirrorLists.map(u=>a.entityName(u)),badges:[],removable:!1}),t}function Pi(r){let a=r.scheduleType==="sensor_based",e=parseInt(r.intervalDays,10)>0,t=[];for(let i of js){if(i===r.scheduleType)continue;let n;if(a)if(i==="time_based"){if(e)continue;n="safety"}else n="replace";else n=r.scheduleType==="manual"?"set":"replace";t.push({kind:"schedule",value:i,icon:Ri(i),effect:n})}for(let i of zs){if(a&&i==="compound")continue;let n;a?n="combine":n=r.scheduleType==="time_based"||r.scheduleType==="manual"?"set":"replace",t.push({kind:"trigger",value:i,icon:wt[i],effect:n})}return t}var Ys=new Set(["binary_sensor","input_boolean","switch","fan","light","lock","cover","valve","siren"]),Zs=new Set(["switch","fan","light","valve","input_boolean"]),Js=new Set(["running","power","plug","heat","cold","moving","vibration"]),Xs=new Set(["door","opening","window","garage_door","lock","running","moving","vibration","occupancy","presence"]),er=new Set(["total","total_increasing"]),tr=new Set(["select","input_select","vacuum","lawn_mower","climate","water_heater","media_player","alarm_control_panel","event"]);function Et(r){let a={entityId:r.entityId,name:r.name},e=i=>({...a,target:"trigger",triggerType:i,icon:wt[i]}),t={...a,target:"done_when",icon:"mdi:check-circle-outline"};if(r.domain==="sensor")return r.deviceClass==="timestamp"||r.deviceClass==="date"?[e("due_date")]:r.numeric?er.has(r.stateClass??"")?[e("counter"),e("threshold")]:r.deviceClass==="duration"?[e("threshold"),e("counter")]:[e("threshold")]:[e("state_change"),t];if(r.domain==="counter")return[e("counter")];if(r.domain==="number"||r.domain==="input_number")return[e("threshold")];if(Ys.has(r.domain)){let i=[];return Xs.has(r.deviceClass??"")&&i.push(t),i.push(e("state_change")),(Zs.has(r.domain)||Js.has(r.deviceClass??""))&&i.push(e("runtime")),i.includes(t)||i.push(t),i}return tr.has(r.domain)?[e("state_change"),t]:[]}function Hi(r,a){let e=r.devices??{},t=a.areaId||(a.deviceId?e[a.deviceId]?.area_id:null)||null,i=d=>d.area_id||(d.device_id?e[d.device_id]?.area_id:null)||null,n=[];for(let[d,u]of Object.entries(r.entities??{})){if(u.platform===a.ownPlatform||u.hidden)continue;let _;if(a.deviceId&&u.device_id===a.deviceId)_="device";else if(t&&i(u)===t)_="area";else continue;let g=r.states?.[d];if(!g)continue;let f=g.attributes??{};n.push({entityId:d,name:typeof f.friendly_name=="string"?f.friendly_name:d,domain:d.split(".")[0],deviceClass:typeof f.device_class=="string"?f.device_class:void 0,stateClass:typeof f.state_class=="string"?f.state_class:void 0,numeric:g.state!==""&&Number.isFinite(Number(g.state))||typeof f.unit_of_measurement=="string",group:_,secondary:!!u.entity_category})}let l=d=>d.group==="device"?0:1;return n.sort((d,u)=>l(d)-l(u)||Number(d.secondary)-Number(u.secondary)||d.name.localeCompare(u.name)),n.map(({secondary:d,...u})=>u).filter(d=>Et(d).length>0)}var Oi=k`
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
`;var ae=class extends C{constructor(){super(...arguments);this.value="";this.lang="en";this._credit=!1;this._amount=""}willUpdate(e){if(!e.has("value"))return;let t=(this.value??"").trim();if(t===this._signed())return;let i=parseFloat(t);if(t===""||Number.isNaN(i)){this._amount="",this._credit=!1;return}this._credit=i<0,this._amount=String(Math.abs(i))}_signed(){let e=this._amount.trim();return e===""?"":this._credit?`-${e}`:e}_emit(){this.value=this._signed(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setCredit(e){this._credit!==e&&(this._credit=e,this._emit())}_onInput(e){let t=e.target.value;t.startsWith("-")&&(this._credit=!0),this._amount=t.replace(/^-+/,""),this._emit()}render(){let e=this.lang;return o`
      <div class="wrap">
        <div class="sign" role="group">
          <button type="button" class="kind cost ${this._credit?"":"on"}" aria-pressed=${String(!this._credit)}
            @click=${()=>this._setCredit(!1)}>${s("cost",e)}</button>
          <button type="button" class="kind credit ${this._credit?"on":""}" aria-pressed=${String(this._credit)}
            @click=${()=>this._setCredit(!0)}>${s("cost_kind_credit",e)}</button>
        </div>
        <input type="number" step="0.01" min="0" inputmode="decimal" class="field-input amount"
          .value=${this._amount} @input=${this._onInput} />
      </div>
      ${this._credit?o`<div class="hint">${s("cost_credit_hint",e)}</div>`:p}
    `}};ae.styles=[$e,k`
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
    `],c([y()],ae.prototype,"value",2),c([y()],ae.prototype,"lang",2),c([h()],ae.prototype,"_credit",2),c([h()],ae.prototype,"_amount",2);customElements.get("ms-cost-input")||customElements.define("ms-cost-input",ae);function ee(r,a){return we("ha-expansion-panel")?o`
      <ha-expansion-panel class=${r.cls??""} outlined .expanded=${!!r.open}
        @expanded-changed=${e=>{e.target===e.currentTarget&&r.onToggle?.(e.detail.expanded)}}>
        <div slot="header" class=${r.headerCls??"collapsible-header"}>${r.header}</div>
        ${a}
      </ha-expansion-panel>`:o`<details class=${r.cls??""} ?open=${!!r.open}
    @toggle=${r.onToggle?e=>r.onToggle(e.target.open):p}><summary class=${r.headerCls??p}>${r.header}</summary>${a}</details>`}var sr="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",rr="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",nr="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",Ni=["cleaning","inspection","replacement","calibration","service","reading","custom"],ar=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],at=["weekdays","nth_weekday","day_of_month","calendar"],Mi=["time_based","one_time",...at],Di=["threshold","counter","state_change","runtime","due_date"],rt=(r,a)=>s(r==="due_date"?"trigger_type_due_date":r,a),or=[...Di,"compound"],te={alpha:"0.3",min:"7",max:"365"},ue=ne;function nt(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0",carry:{}}}var lr=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);function Fi(r){return{type:r.type||"threshold",attribute:r.attribute||"",above:r.trigger_above?.toString()??"",below:r.trigger_below?.toString()??"",equals:r.trigger_equals?.toString()??"",notEquals:r.trigger_not_equals?.toString()??"",forMinutes:r.trigger_for_minutes?.toString()??"0",targetValue:r.trigger_target_value?.toString()??"",deltaMode:r.trigger_delta_mode||!1,fromState:r.trigger_from_state||"",toState:r.trigger_to_state||"",targetChanges:r.trigger_target_changes?.toString()??"",runtimeHours:r.trigger_runtime_hours?.toString()??"",onStates:(r.trigger_on_states||[]).join(", "),daysBefore:r.trigger_days_before?.toString()??"0"}}function ji(r,a){a.attribute&&(r.attribute=a.attribute);let e=parseInt(a.forMinutes,10);if(a.type==="threshold"){let t=parseFloat(a.above);isNaN(t)||(r.trigger_above=t);let i=parseFloat(a.below);isNaN(i)||(r.trigger_below=i);let n=parseFloat(a.equals);isNaN(n)||(r.trigger_equals=n);let l=parseFloat(a.notEquals);isNaN(l)||(r.trigger_not_equals=l),isNaN(e)||(r.trigger_for_minutes=e)}else if(a.type==="counter"){let t=parseFloat(a.targetValue);isNaN(t)||(r.trigger_target_value=t),r.trigger_delta_mode=a.deltaMode}else if(a.type==="state_change"){a.fromState&&(r.trigger_from_state=a.fromState),a.toState&&(r.trigger_to_state=a.toState);let t=parseInt(a.targetChanges,10);isNaN(t)||(r.trigger_target_changes=t),isNaN(e)||(r.trigger_for_minutes=e)}else if(a.type==="runtime"){let t=parseFloat(a.runtimeHours);isNaN(t)||(r.trigger_runtime_hours=t);let i=(a.onStates||"").split(",").map(n=>n.trim()).filter(Boolean);i.length>0&&(r.trigger_on_states=i)}else if(a.type==="due_date"){let t=parseInt(a.daysBefore,10);r.trigger_days_before=isNaN(t)?0:t}}function dr(r){return{entityIds:tt(r).join(", "),...Fi(r),carry:Object.fromEntries(Object.entries(r).filter(([e])=>!lr.has(e)&&!e.startsWith("_")))}}function cr(r){let a=r.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(a.length===0)return null;let e={...r.carry||{},entity_id:a[0],entity_ids:a,type:r.type};return ji(e,r),e}function pr(r){return Array.from({length:7},(a,e)=>be(e,r,"short"))}function Li(r){return Array.from({length:12},(a,e)=>oi(e,r,"short"))}function ur(r){let a=Array.isArray(r)?r.filter(e=>e!=null&&e!=="").join(", "):r!==null&&typeof r=="object"||r==null?"":String(r);return a.length>40?`${a.slice(0,39)}\u2026`:a}var m=class m extends C{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.mirrorTodoDefault=[];this.betaEditor=!1;this._ruleSel=null;this._addTab="type";this._betaStep="form";this._chooserFilter="";this._templateChoices=null;this._copyChoices=null;this._objectDevice=null;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._series=[];this._seriesIndex=0;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calMonths=[];this._hadCalMonths=!1;this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._detailsOpen=!1;this._mirrorTodoEntities=[];this._mirrorTodoMode="default";this._completeWhenEntity="";this._completeWhenState="";this._completeWhenAnyTime=!1;this._completeWhenFor="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._holdUntilDone=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._triggerDetailAttribute="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._quickOn=!1;this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=te.alpha;this._adaptiveMin=te.min;this._adaptiveMax=te.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set;this._attrSeq=0}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return H(this.hass)}async openCreate(e,t){this._series=[],this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="";let i=(t||[]).filter(n=>!n.object.archived&&!n.object.archived_at);!e&&i.length>0?(this._objectChoices=i.map(n=>({entry_id:n.entry_id,name:n.object.name})).sort((n,l)=>n.name.localeCompare(l.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),this._betaStep=this.betaEditor?"choose":"form",this._ruleSel="task",this._addTab="type",this._chooserFilter="",await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._series=[],await this._edit(e,t)}async openEditSeries(e){e.length!==0&&(this._series=e,await this._editSeriesItem(0))}async _editSeriesItem(e){let t=this._series[e];this._seriesIndex=e,await this._edit(t.entryId,t.task),await this.updateComplete,this.shadowRoot?.querySelector(".dialog-title")?.scrollIntoView({block:"start"})}_skipSeriesItem(){this._editSeriesItem(this._seriesIndex+1)}async _edit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._warning="",this._betaStep="form",this._ruleSel=null,this._addTab="type",this._objectChoices=[],this._isFleetTask=t.battery_fleet_task===!0,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let i=t.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"&&(i.day??1)>=1?String(i.day??1):"1",this._domLastDay=i?.kind==="day_of_month"&&i.day===-1,this._domBusiness=i?.kind==="day_of_month"&&i.business===!0,this._calMonths=(i?.kind==="day_of_month"||i?.kind==="nth_weekday")&&Array.isArray(i.months)?[...i.months]:[],this._hadCalMonths=this._calMonths.length>0,this._calendarEntity=i?.kind==="calendar"&&i.entity_id||"",this._calOffset=i?.offset?String(i.offset):"0",this._seasonMonths=Array.isArray(i?.season_months)?[...i.season_months]:[];let n=i?.ends;n&&typeof n.count=="number"?(this._endsMode="count",this._endsCount=String(n.count),this._endsUntil=""):n&&typeof n.until=="string"?(this._endsMode="until",this._endsUntil=n.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._notifyIcon=t.notify_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._mirrorTodoEntities=[...t.mirror_todo_entities||[]],this._mirrorTodoMode=this._mirrorTodoEntities.length?"own":t.mirror_todo_use_default===!1?"none":"default",this._completeWhenEntity=t.complete_when?.entity_id||"",this._completeWhenState=t.complete_when?.to_state||"",this._completeWhenAnyTime=!!t.complete_when?.any_time,this._completeWhenFor=t.complete_when?.for_minutes?String(t.complete_when.for_minutes):"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._notifyEnabled=t.notify_enabled!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(_=>({..._})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(_=>[G(_),{..._}])),this._consumesQtyText={},this._responsibleUserId=t.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([_,g])=>{let{name:f,checklist:v,consumes_parts:$,required_completion_fields:T,...M}=g,j=g.consumes_parts||[],Y=j.findIndex(Z=>!Z.entry_id),K=Y>=0?j[Y]:void 0;return{id:_,name:g.name||_,checklistText:(g.checklist||[]).join(`
`),partId:K?.part_id||"",partQty:K?.quantity!=null?String(K.quantity):"",reqOverride:g.required_completion_fields!==void 0,reqFields:[...g.required_completion_fields||[]],extraParts:j.filter((Z,_e)=>_e!==Y).map(Z=>({...Z})),carry:M}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"",this._scheduleTimeOn=!!t.schedule_time;let l=t.on_complete_action;if(l&&l.service){this._actionService=l.service;let _=l.target?.entity_id;this._actionTargetEntity=Array.isArray(_)?_[0]||"":_||"",this._actionTargetStored=l.target&&typeof l.target=="object"?JSON.parse(JSON.stringify(l.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=l.data&&typeof l.data=="object"?{...l.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=l.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let d=t.quick_complete_defaults;this._quickOn=pe(t),this._qcNotes=d?.notes||"",this._qcCost=d?.cost!=null?String(d.cost):"",this._qcDuration=d?.duration!=null?String(d.duration):"",this._qcFeedback=d?.feedback||"";let u=t.adaptive_config||{};if(this._environmentalEntity=u.environmental_entity||"",this._environmentalAttribute=u.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!u.enabled,this._adaptiveAlpha=u.ewa_alpha?.toString()??te.alpha,this._adaptiveMin=u.min_interval_days?.toString()??te.min,this._adaptiveMax=u.max_interval_days?.toString()??te.max,this._adaptiveSeasonal=u.seasonal_enabled!==!1,this._adaptivePrediction=u.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,t.trigger_config){let _=t.trigger_config;this._triggerEntityId=Si(_)||"",this._triggerEntityIds=tt(_),this._triggerEntityLogic=_.entity_logic||"any",this._setTypeFields(Fi(_)),this._triggerCombinator=_.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=_.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=_.auto_complete_on_recovery||!1,this._holdUntilDone=_.trigger_hold_until_done===!0,this._triggerRuntimeMaxSession=_.trigger_runtime_max_session_seconds?.toString()||"",this._triggerDetailAttribute=_.detail_attribute||"",_.type==="compound"?(this._compoundLogic=_.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(_.conditions||[]).map(dr)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),this._detailsOpen=this._priority!=="normal"||!!this._labels.trim()||!!this._documentationUrl.trim()||!!this._customIcon,await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._detailsOpen=!1,this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._calMonths=[],this._hadCalMonths=!1,this._calendarEntity="",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._mirrorTodoMode="default",this._completeWhenEntity="",this._completeWhenState="",this._completeWhenAnyTime=!1,this._completeWhenFor="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._notifyEnabled=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=te.alpha,this._adaptiveMin=te.min,this._adaptiveMax=te.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._actionTestError="",this._quickOn=!1,this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates,this._triggerDaysBefore=e.daysBefore}_resetTriggerFields(){++this._attrSeq,this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(nt()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._holdUntilDone=!1,this._triggerRuntimeMaxSession="",this._triggerDetailAttribute="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new Ze(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=s("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,i]=e.split(".");if(!this.hass?.services?.[t]?.[i]){this._actionTestResult="error",this._actionTestError=s("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let n=this._actionTargetEntity.trim();if(n){let l=n.split(".")[0];if(l!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=s("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",t).replace("{entity}",n).replace("{entity_domain}",l).replace("{suggestion}",`${l}.${i}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[n]){this._actionTestResult="error",this._actionTestError=s("action_test_entity_missing",this._lang).replace("{entity}",n),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,i]=e.split("."),n=this.hass?.services?.[t]?.[i]?.fields;return!n||Object.keys(n).length===0?null:Object.entries(n).map(([l,d])=>({name:l,required:!!d.required,selector:d.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([t,i])=>t==="entity_id"?Array.isArray(i)&&i.length>1:Array.isArray(i)?i.length>0:!!i):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},t=n=>(Array.isArray(n)?n:[n]).filter(l=>typeof l=="string"&&!!l),i=this.hass;return[...t(e.entity_id).map(n=>De(this.hass,n)),...t(e.device_id).map(n=>i.devices?.[n]?.name_by_user||i.devices?.[n]?.name||n),...t(e.area_id).map(n=>i.areas?.[n]?.name||n),...t(e.floor_id).map(n=>i.floors?.[n]?.name||n),...t(e.label_id)].join(", ")}_renderQuickComplete(e){let t={notes:!!this._qcNotes.trim(),cost:!isNaN(parseFloat(this._qcCost)),duration:ce(this._qcDuration)!==null,photo:!1,user:!0},i=this._requiredCompletion.filter(l=>!t[l]),n=!!this._checklistText.trim()||this._readings.length>0;return o`
      ${S({cls:"req-option quick-complete-switch",checked:this._quickOn,onChange:l=>this._quickOn=l.target.checked},o`<span>${s("quick_complete_label",e)}</span>`)}
      ${this._quickOn?o`
            <div class="field-help">${s("quick_complete_help",e)}</div>
            ${i.length?o`<div class="field-help quick-complete-note">${s("quick_complete_needs_dialog",e).replace("{fields}",i.map(l=>s(Te[l],e)).join(", "))}</div>`:p}
            ${this._requireTagScan?o`<div class="field-help quick-complete-note">${s("quick_complete_tag_hint",e)}</div>`:p}
            ${n?o`<div class="field-help">${s("quick_complete_not_asked",e)}</div>`:p}
            ${ee({cls:"ca-section quick-complete-values",open:Object.values(t).slice(0,3).some(Boolean)||!!this._qcFeedback,header:s("quick_complete_values",e)},o`
              <p class="field-help">${s("quick_complete_values_help",e)}</p>
              <ms-textfield
                label="${s("quick_complete_defaults_notes",e)}"
                .value=${this._qcNotes}
                @input=${l=>{this._qcNotes=l.target.value}}
              ></ms-textfield>
              <div class="qc-cost">
                <span class="qc-cost-label">${s("quick_complete_defaults_cost",e)}</span>
                <ms-cost-input .lang=${e} .value=${this._qcCost}
                  @value-changed=${l=>{this._qcCost=l.detail.value}}></ms-cost-input>
              </div>
              <ms-textfield
                label="${s("quick_complete_defaults_duration",e)}"
                type="number" min="0" step="1"
                .value=${this._qcDuration}
                @input=${l=>{this._qcDuration=l.target.value}}
              ></ms-textfield>
              ${A({label:s("was_maintenance_needed",e),cls:"qc-feedback",value:this._qcFeedback,onChange:l=>{this._qcFeedback=l.target.value}},o`
                <option value="">${s("quick_complete_defaults_feedback_none",e)}</option>
                <option value="needed">${s("quick_complete_defaults_feedback_needed",e)}</option>
                <option value="not_needed">${s("quick_complete_defaults_feedback_not_needed",e)}</option>
                <option value="not_sure">${s("feedback_not_sure",e)}</option>
              `)}
            `)}
          `:p}
    `}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return p;let t=this._serviceSchema();return o`
      ${ee({cls:"ca-section",header:s("on_complete_action_title",e)},o`
        <p class="field-help">${s("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let n=this._serviceSchema();if(n){let l=new Set(n.map(d=>d.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([d])=>l.has(d)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",e)}
          @value-changed=${i=>{let n=i.detail.value;this._actionTargetEntity=n.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?o`<p class="field-help ca-target-more">${s("on_complete_action_target_more",e).replace("{targets}",this._actionTargetSummary())}</p>`:p}
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",e)}
        </p>
        ${S({cls:"ca-skip-auto",checked:this._actionSkipAuto,onChange:i=>{this._actionSkipAuto=i.target.checked}},o`<span>${s("on_complete_action_skip_auto",e)}</span>`)}
        ${t?o`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${i=>{this._actionData={...i.detail.value}}}
              ></ha-form>
            `:o`
              <ms-textfield
                label="${s("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${i=>{this._actionDataJsonFallback=i.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":s("on_complete_action_test",e)}
          </button>
          ${this._actionTestResult==="ok"?o`<span class="ca-test-ok">${s("on_complete_action_test_success",e)}</span>`:p}
          ${this._actionTestResult==="error"?o`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?o`<div class="ca-test-error-detail">${this._actionTestError}</div>`:p}
              </div>`:p}
        </div>
      `)}

    `}async _loadParts(){this.parts=[];let e=this._entryId;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e});if(e!==this._entryId)return;this.parts=t.parts||[],this._partsLoadFailed=!1}catch{if(e!==this._entryId)return;this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){this._foreignOwners=[];let e=this._entryId;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});if(e!==this._entryId)return;this._foreignOwners=(t.objects||[]).filter(i=>i.entry_id!==e&&(i.parts||[]).length>0).map(i=>({entry_id:i.entry_id,name:i.object?.name||i.entry_id,parts:i.parts||[]})).sort((i,n)=>i.name.localeCompare(n.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let i=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:i.suggested_attributes||[],available:i.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){let t=++this._attrSeq;if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});if(t!==this._attrSeq)return;this._entityDomain=i.domain||"",this._suggestedAttributes=i.suggested_attributes||[],this._availableAttributes=i.available_attributes||[]}catch{if(t!==this._attrSeq)return;this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let i=G({part_id:e.id,entry_id:t}),n=this._consumesParts[i],l=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return o`
      <div class="consumes-row">
        ${S({cls:"consumes-check",checked:n!==void 0,onChange:d=>{let u={...this._consumesParts};if(d.target.checked)u[i]=u[i]||l;else{delete u[i];let _={...this._consumesQtyText};delete _[i],this._consumesQtyText=_}this._consumesParts=u}},o`<span>${e.name}${e.unit?` (${e.unit})`:""}</span>`)}
        ${n!==void 0?o`<input
              class="consumes-qty"
              aria-label=${`${e.name}: ${s("quantity",this._lang)}`}
              type="number"
              min=${ue[0]}
              max=${ue[1]}
              step="0.01"
              .value=${this._consumesQtyText[i]??String(n.quantity)}
              @input=${d=>{let u=d.target.value;this._consumesQtyText={...this._consumesQtyText,[i]:u};let _=parseFloat(u.replace(",","."));Number.isFinite(_)&&_>=ue[0]&&(this._consumesParts={...this._consumesParts,[i]:{...l,quantity:_}})}}
            />`:p}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let t of Object.keys(e)){let i=this._consumesQtyText[t];if(i===void 0)continue;let n=parseFloat(i.replace(",","."));if(!Number.isFinite(n)||n<ue[0]||n>ue[1]){let l=d=>x(d,this._lang,{maximumFractionDigits:2});return this._error=s("settings_value_out_of_range",this._lang).replace("{min}",l(ue[0])).replace("{max}",l(ue[1])),!1}e[t]={...e[t],quantity:n}}return this._consumesParts=e,!0}_toggleRequired(e,t){let i=new Set(this._requiredCompletion);t?i.add(e):i.delete(e),this._requiredCompletion=[...i]}_patchReading(e,t){this._readings=this._readings.map(i=>i.id===e?{...i,...t}:i)}_renderReadingsEditor(e){let t=Jt(this._readings);return o`
      <div class="readings-editor">
        <div class="field-label">${s("readings_section",e)}</div>
        <div class="field-help">${s("readings_hint",e)}</div>
        ${this._readings.map(i=>o`
          ${t.has(i.id)?o`<div class="field-help reading-dup">${s("reading_duplicate_name",e)}</div>`:p}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${s("reading_name_label",e)}"
              .value=${i.name}
              @input=${n=>this._patchReading(i.id,{name:n.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${s("reading_unit_short",e)}"
              .value=${i.unit||""}
              @input=${n=>this._patchReading(i.id,{unit:n.target.value})}
            ></ms-textfield>
            <ha-icon-button class="phase-remove reading-remove" .label=${s("remove",e)} @click=${()=>this._readings=this._readings.filter(n=>n.id!==i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<Vt?o`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:Kt(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${s("reading_add",e)}
          </ha-button>`:p}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",i=t,n=2;for(;this._phaseDefs.some(l=>l.id===i);)i=`${t}-${n++}`;return i}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(i=>i.id===e?{...i,...t}:i)}_renderPhasesEditor(e){let t=i=>this._phaseDefs.find(n=>n.id===i)?.name||i;return o`
      ${ee({cls:"phases-section",open:this._phaseDefs.length>0,header:s("phases_section",e)},o`
      <div class="field-help">${s("phases_hint",e)}</div>
      ${this._phaseDefs.map(i=>o`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${s("phase_name",e)}"
              .value=${i.name}
              @input=${n=>this._patchPhaseDef(i.id,{name:n.target.value})}
            ></ms-textfield>
            ${this.parts.length?o`
              ${A({label:s("spare_part",e),cls:"phase-part",value:i.partId,onChange:n=>{let l=n.target.value;this._patchPhaseDef(i.id,i.partQty?{partId:l}:{partId:l,partQty:"1"})}},o`
                <option value="">—</option>
                ${this.parts.map(n=>o`<option value=${n.id} ?selected=${n.id===i.partId}>${n.name}</option>`)}
              `)}
              ${i.partId?o`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" aria-label=${s("quantity",e)} type="number" min=${ne[0]} step="0.01" placeholder="1" .value=${i.partQty}
                  @input=${n=>this._patchPhaseDef(i.id,{partQty:n.target.value})} />
              `:p}
            `:p}
            <ha-icon-button class="phase-remove" .label=${s("remove",e)} @click=${()=>this._removePhaseDef(i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?o`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${s("checklist_placeholder",e)}"
              .value=${i.checklistText}
              @input=${n=>this._patchPhaseDef(i.id,{checklistText:n.target.value})}
            ></textarea>
          `:p}
          ${S({cls:"req-option phase-req-toggle",checked:i.reqOverride,onChange:n=>this._patchPhaseDef(i.id,{reqOverride:n.target.checked})},o`<span>${s("phase_require_override",e)}</span>`)}
          ${i.reqOverride?o`
            <div class="required-completion phase-req-fields">
              ${$t.map(n=>o`
                ${S({cls:"req-option",checked:i.reqFields.includes(n),onChange:l=>{let d=l.target.checked,u=new Set(i.reqFields);d?u.add(n):u.delete(n),this._patchPhaseDef(i.id,{reqFields:[...u]})}},o`<span>${s(Te[n],e)}</span>`)}
              `)}
            </div>
          `:p}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${s("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(i=>i.name.trim())?o`
        <div class="phase-seq-label">${s("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((i,n)=>o`
            <span class="phase-chip">
              ${n+1}. ${t(i)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((l,d)=>d!==n)}}>✕</button>
            </span>
          `)}
          ${A({label:s("phase_sequence_add_step",e),cls:"phase-seq-add",value:"",onChange:i=>{let n=i.target.value;n&&(this._phaseSeq=[...this._phaseSeq,n]),i.target.value=""}},o`
            <option value="">+ ${s("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(i=>i.name.trim()).map(i=>o`<option value=${i.id}>${i.name}</option>`)}
          `)}
        </div>
      `:p}
      `)}
    `}async _save(){if(this._loading||!this._name.trim()||this._missingDueDate())return;if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),i=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(i)&&t>i){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=s("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=s("calendar_entity_required",this._lang);return}if(!this._applyConsumesQtyText())return;if(this._completeWhenEntity&&parseInt(this._completeWhenFor,10)>xe[1]){this._error=s("settings_value_out_of_range",this._lang).replace("{min}","1").replace("{max}",x(xe[1],this._lang));return}this._loading=!0,this._error="";let e;try{let t=await R(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:d=>{this._error=d}});if(t===void 0)return;let i=this._taskId||t?.task_id,n=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let l=d=>{this._warning=s("subsave_warning",this._lang).replace("{detail}",d)};if(i&&this._scheduleType==="sensor_based"&&n&&await R(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:i,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:l})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),i&&this._adaptiveSnapshot()!==this._adaptiveInitial){let d=parseFloat(this._adaptiveAlpha),u=parseInt(this._adaptiveMin,10),_=parseInt(this._adaptiveMax,10);await R(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:i,enabled:this._adaptiveEnabled,...d>=Me[0]&&d<=Me[1]?{ewa_alpha:d}:{},...!isNaN(u)&&u>=1?{min_interval_days:u}:{},...!isNaN(_)&&_>=1?{max_interval_days:_}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:l})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?i&&(this._taskId=i):this._seriesIndex+1<this._series.length?e=this._seriesIndex+1:(this._open=!1,this._series=[]),this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}e!==void 0&&await this._editSeriesItem(e)}_missingDueDate(){return this._scheduleType==="one_time"&&!this._dueDate}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):at.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.priority=this._priority,e.labels=this._labels.split(",").map(l=>l.trim()).filter(Boolean);let i=this.mirrorTodoDefault.length&&this._mirrorTodoMode!=="own"?[]:it(this.hass,this._mirrorTodoEntities);e.mirror_todo_entities=i,e.mirror_todo_use_default=this.mirrorTodoDefault.length?this._mirrorTodoMode==="default":this._mirrorTodoMode!=="none",e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip;let n=parseInt(this._completeWhenFor,10);e.complete_when=this._completeWhenEntity&&this._completeWhenState.trim()?{entity_id:this._completeWhenEntity,to_state:this._completeWhenState.trim(),...this._completeWhenAnyTime?{any_time:!0}:{},...n>0?{for_minutes:n}:{}}:null,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=Xt(this._readings);{let l={};for(let u of this._phaseDefs){if(!u.name.trim())continue;let _={...u.carry,name:u.name.trim()},g=u.checklistText.split(`
`).map(v=>v.trim()).filter(Boolean);g.length&&(_.checklist=g);let f=[];if(u.partId){let v=parseFloat(u.partQty);f.push({part_id:u.partId,quantity:Number.isFinite(v)&&v>0?v:1})}for(let v of u.extraParts)f.push(v.entry_id?{part_id:v.part_id,quantity:v.quantity,entry_id:v.entry_id}:{part_id:v.part_id,quantity:v.quantity});f.length&&(_.consumes_parts=f),u.reqOverride&&(_.required_completion_fields=[...u.reqFields]),l[u.id]=_}let d=this._phaseSeq.filter(u=>u in l);e.phases=Object.keys(l).length&&d.length?l:null,e.phase_sequence=e.phases?d:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(l=>l.entry_id?{part_id:l.part_id,quantity:l.quantity,entry_id:l.entry_id}:{part_id:l.part_id,quantity:l.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let l=this._compoundConditions.map(cr).filter(d=>d!==null);if(l.length>0){let d={type:"compound",compound_logic:this._compoundLogic,conditions:l};this._autoCompleteOnRecovery&&(d.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(d.trigger_combinator="all"),this._triggerDetailAttribute&&(d.detail_attribute=this._triggerDetailAttribute),e.trigger_config=d}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let l=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],d={entity_id:l[0],entity_ids:l,type:this._triggerType};if(ji(d,this._typeFields()),this._holdUntilDone&&this._isStateLatch()?d.trigger_hold_until_done=!0:this._autoCompleteOnRecovery&&(d.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(d.trigger_combinator="all"),this._triggerDetailAttribute&&(d.detail_attribute=this._triggerDetailAttribute),l.length>1&&(d.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let u=parseFloat(this._triggerBaselineValue);!isNaN(u)&&u>=0&&(d.trigger_baseline_value=u)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let u=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(u)&&u>0&&(d.trigger_runtime_max_session_seconds=u)}e.trigger_config=d}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&Mi.includes(this._scheduleType)){let l=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(l)?l:null}if(this.checklistsEnabled){let l=this._checklistText.split(`
`).map(d=>d.trim()).filter(Boolean).slice(0,100);e.checklist=l.length?l:null}if(this.completionActionsEnabled||this._actionPresent){let l=this._actionService.trim();if(l&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(l)){let d={service:l},u=this._actionTargetEntity.trim();this._actionTargetStored&&u===this._actionTargetInitial?d.target=JSON.parse(JSON.stringify(this._actionTargetStored)):u&&(d.target={entity_id:u});let _=this._buildActionData();Object.keys(_).length>0&&(d.data=_),this._actionSkipAuto&&(d.skip_auto=!0),e.on_complete_action=d}else e.on_complete_action=null}{let l={};this._qcNotes.trim()&&(l.notes=this._qcNotes.trim());let d=parseFloat(this._qcCost);isNaN(d)||(l.cost=d);let u=ce(this._qcDuration);u!==null&&(l.duration=u),this._qcFeedback&&(l.feedback=this._qcFeedback),e.quick_complete_defaults=this._quickOn?l:null}return e}_close(){this._open=!1,this._series=[],this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let e=this._lang,t=this._triggerType==="compound";return o`
      <div class="select-row">
        ${q()?p:o`<label>${s("trigger_type",e)}</label>`}
        ${A({label:s("trigger_type",e),value:this._triggerType,onChange:i=>this._triggerType=i.target.value},o`
          ${or.map(i=>o`<option value=${i} ?selected=${i===this._triggerType}>${rt(i,e)}</option>`)}
        `)}
      </div>
      ${t?this._renderCompoundEditor():o`
        ${this._entityPickerFallback?o`
          <ms-textfield
            label="${s("entity_id",e)} (${s("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${i=>{let l=i.target.value.split(",").map(d=>d.trim()).filter(Boolean);this._triggerEntityId=l[0]||"",this._triggerEntityIds=l,l[0]&&this._fetchEntityAttributes(l[0])}}
          ></ms-textfield>
        `:o`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:bt}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>s("entity_id",e)}
          @value-changed=${i=>{let n=(i.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=n[0]||"",this._triggerEntityIds=n,n[0]?this._fetchEntityAttributes(n[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?o`
          <div class="select-row">
            ${q()?p:o`<label>${s("entity_logic",e)}</label>`}
            ${A({label:s("entity_logic",e),value:this._triggerEntityLogic,onChange:i=>this._triggerEntityLogic=i.target.value},o`
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${s("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${s("entity_logic_all",e)}</option>
            `)}
          </div>
        `:p}
        ${this._renderAttributeSelect({label:s("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:i=>this._triggerAttribute=i})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      ${this._renderDetailAttributeSelect(e)}
      ${this._isStateLatch()?this._renderTriggerEnd(e):o`
        ${S({checked:this._autoCompleteOnRecovery,onChange:i=>this._autoCompleteOnRecovery=i.target.checked},o`${s("auto_complete_on_recovery",e)}`)}
        <div class="field-help">${s("auto_complete_on_recovery_help",e)}</div>
      `}
      <ms-textfield
        label="${s("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${i=>this._intervalDays=i.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():p}
      ${this._intervalDays?o`
            <div class="select-row">
              ${q()?p:o`<label>${s("trigger_combinator",e)}</label>`}
              ${A({label:s("trigger_combinator",e),onChange:i=>this._triggerCombinator=i.target.value},o`
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${s("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${s("trigger_combinator_all",e)}</option>
              `)}
            </div>
          `:p}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((i,n)=>n===e?{...i,...t}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,nt()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,i)=>i!==e),this.betaEditor&&this._compoundConditions.length===1&&this._flattenCompound()}_flattenCompound(){let[e]=this._compoundConditions;if(!e)return;let t=e.entityIds.split(",").map(d=>d.trim()).filter(Boolean),{entityIds:i,carry:n,...l}=e;this._compoundConditions=[],this._setTypeFields(l),this._triggerEntityId=t[0]||"",this._triggerEntityIds=t,t[0]&&this._fetchEntityAttributes(t[0])}_renderCompoundEditor(){let e=this._lang;return o`
      <div class="select-row">
        ${q()?p:o`<label>${s("compound_logic",e)}</label>`}
        ${A({label:s("compound_logic",e),value:this._compoundLogic,onChange:t=>this._compoundLogic=t.target.value},o`
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${s("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${s("compound_logic_or",e)}</option>
        `)}
      </div>
      <div class="field-help">${s("compound_help",e)}</div>
      ${this._compoundConditions.length===0?o`<div class="field-help">${s("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,i)=>this._renderCondition(t,i))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let i=this._lang,n=t+1;return o`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${s("compound_condition",i)} ${n}</span>
          <button
            type="button"
            class="icon-btn"
            title="${s("compound_remove_condition",i)}"
            @click=${()=>this._removeCondition(t)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?o`
          <ms-textfield
            label="${s("entity_id",i)} (${s("comma_separated",i)})"
            .value=${e.entityIds}
            @input=${l=>this._patchCondition(t,{entityIds:l.target.value})}
          ></ms-textfield>
        `:o`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:bt}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(l=>l.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",i)}
          @value-changed=${l=>{let d=(l.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:d.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          ${q()?p:o`<label>${s("trigger_type",i)}</label>`}
          ${A({label:s("trigger_type",i),value:e.type,onChange:l=>this._patchCondition(t,{type:l.target.value})},o`
            ${Di.map(l=>o`<option value=${l} ?selected=${l===e.type}>${rt(l,i)}</option>`)}
          `)}
        </div>
        ${this._renderConditionTypeFields(e,t)}
      </div>
    `}_isStateLatch(){return this._triggerType==="state_change"&&(this._triggerTargetChanges===""||Number(this._triggerTargetChanges)===1)&&!!(this._triggerFromState.trim()||this._triggerToState.trim())}_renderTriggerEnd(e){let t=this._holdUntilDone?"hold":this._autoCompleteOnRecovery?"done":"ok",i={ok:"trigger_end_ok",done:"trigger_end_done",hold:"trigger_end_hold"},n=l=>{this._autoCompleteOnRecovery=l==="done",this._holdUntilDone=l==="hold"};return o`
      <div class="trigger-end" role="radiogroup" aria-label=${s("trigger_end",e)}>
        <div class="field-label">${s("trigger_end",e)}</div>
        ${Object.keys(i).map(l=>o`
          <label class="trigger-end-option">
            <input type="radio" name="trigger-end" value=${l} .checked=${t===l} @change=${()=>n(l)} />
            ${s(i[l],e)}
          </label>
        `)}
        ${t==="done"?o`<div class="field-help">${s("auto_complete_on_recovery_help",e)}</div>`:p}
        ${t==="hold"?o`<div class="field-help">${s("trigger_end_hold_help",e)}</div>`:p}
      </div>
    `}_renderCompleteWhen(e){return o`
      <div class="field complete-when-field">
        ${this._entityPickerFallback?o`
          <ms-textfield
            label="${s("complete_when",e)}"
            placeholder="binary_sensor.washer_door"
            .value=${this._completeWhenEntity}
            @input=${t=>this._completeWhenEntity=t.target.value.trim()}
          ></ms-textfield>
        `:o`
          <ha-form
            class="entity-picker-form"
            .hass=${this.hass}
            .schema=${[{name:"complete_when",selector:{entity:{}}}]}
            .data=${{complete_when:this._completeWhenEntity}}
            .computeLabel=${()=>s("complete_when",e)}
            @value-changed=${t=>{let i=(t.detail.value.complete_when||"").trim();i!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=i}}
          ></ha-form>`}
        ${this._completeWhenEntity?this._renderStateField({label:s("complete_when_state",e),value:this._completeWhenState,entityId:this._completeWhenEntity,onInput:t=>this._completeWhenState=t}):p}
        ${this._completeWhenEntity?o`
          <ms-textfield
            class="complete-when-for"
            label="${s("for_at_least_minutes",e)}"
            type="number"
            min=${xe[0]}
            max=${xe[1]}
            .value=${this._completeWhenFor}
            @input=${t=>this._completeWhenFor=t.target.value}
          ></ms-textfield>
          ${S({cls:"req-option complete-when-any-time",checked:this._completeWhenAnyTime,onChange:t=>this._completeWhenAnyTime=t.target.checked},o`<span>${s("complete_when_any_time",e)}</span>`)}
        `:p}
        <div class="field-help">${s("complete_when_help",e)}</div>
      </div>
    `}_renderStateField(e){return this._entityPickerFallback||!e.entityId?o`
        <ms-textfield
          label=${e.label}
          .value=${e.value}
          @input=${t=>e.onInput(t.target.value)}
        ></ms-textfield>
      `:o`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId}}}]}
        .data=${{s:e.value}}
        .computeLabel=${()=>e.label}
        @value-changed=${t=>e.onInput((t.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(e){let t=this._lang;return this._entityPickerFallback||!e.entityId?o`
        <ms-textfield
          label="${s("runtime_on_states",t)}"
          placeholder="on"
          .value=${e.value}
          @input=${i=>e.onInput(i.target.value)}
        ></ms-textfield>
      `:o`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(i=>i.trim()).filter(Boolean)}}
        .computeLabel=${()=>s("runtime_on_states",t)}
        @value-changed=${i=>e.onInput((i.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?p:!this.adaptiveFeature&&!this._adaptiveWasEnabled?p:o`
      ${ee({cls:"adaptive-section",open:this._adaptiveEnabled,header:s("adaptive_section_title",e)},o`
        ${S({checked:this._adaptiveEnabled,onChange:t=>this._adaptiveEnabled=t.target.checked},o`${s("adaptive_enabled",e)}`)}
        ${this._adaptiveEnabled?o`
          <ms-textfield
            label="${s("adaptive_min_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMin}
            @input=${t=>this._adaptiveMin=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("adaptive_max_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMax}
            @input=${t=>this._adaptiveMax=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("adaptive_ewa_alpha",e)}"
            type="number"
            min=${Me[0]}
            max=${Me[1]}
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${t=>this._adaptiveAlpha=t.target.value}
          ></ms-textfield>
          ${this.seasonalFeature?o`${S({checked:this._adaptiveSeasonal,onChange:t=>this._adaptiveSeasonal=t.target.checked},o`${s("adaptive_seasonal_enabled",e)}`)}`:p}
          ${S({checked:this._adaptivePrediction,onChange:t=>this._adaptivePrediction=t.target.checked},o`${s("adaptive_prediction_enabled",e)}`)}
        `:p}
      `)}
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?o`
        <div class="select-row">
          ${q()?p:o`<label>${e.label}</label>`}
          ${A({label:e.label,value:e.value,onChange:i=>e.onSelect(i.target.value)},o`
            <option value="" ?selected=${!e.value}>${s("use_entity_state",t)}</option>
            ${e.suggested.map(i=>o`<option value=${i} ?selected=${i===e.value}>${i} ★</option>`)}
            ${e.available.filter(i=>!e.suggested.includes(i.name)).map(i=>o`<option value=${i.name} ?selected=${i.name===e.value}>${i.name}${i.numeric?"":" (non-numeric)"}</option>`)}
          `)}
        </div>
      `:o`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${i=>e.onSelect(i.target.value.trim())}
      ></ms-textfield>
    `}_renderDetailAttributeSelect(e){let t=this._triggerType==="compound"?this._compoundConditions.flatMap(_=>_.entityIds.split(",").map(g=>g.trim()).filter(Boolean)):(this._triggerEntityIds.length?this._triggerEntityIds:[this._triggerEntityId]).filter(Boolean);if(!t.length)return p;let i=this.hass?.states??{},n=new Map;for(let _ of t){this._fetchConditionAttributes(_);for(let g of this._conditionAttrOptions[_]?.available??[])n.has(g.name)||n.set(g.name,ur(i[_]?.attributes?.[g.name]))}let l=this._triggerDetailAttribute;l&&!n.has(l)&&n.set(l,"");let d=s("trigger_detail_attribute",e),u=n.size?o`
        <div class="select-row">
          ${q()?p:o`<label>${d}</label>`}
          ${A({label:d,cls:"detail-attribute-select",value:l,onChange:_=>this._triggerDetailAttribute=_.target.value},o`
            <option value="" ?selected=${!l}>${s("trigger_detail_none",e)}</option>
            ${[...n.entries()].sort(([_],[g])=>_.localeCompare(g)).map(([_,g])=>o`<option value=${_} ?selected=${_===l}>${g?`${_}: ${g}`:_}</option>`)}
          `)}
        </div>`:o`
        <ms-textfield class="detail-attribute-input" label=${d} .value=${l}
          @input=${_=>this._triggerDetailAttribute=_.target.value.trim()}></ms-textfield>`;return o`${u}<div class="field-help">${s("trigger_detail_attribute_help",e)}</div>`}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:s("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:i=>this._environmentalAttribute=i})}_renderConditionAttribute(e,t){let i=e.entityIds.split(",")[0]?.trim()||"";i&&this._fetchConditionAttributes(i);let n=i?this._conditionAttrOptions[i]:void 0;return this._renderAttributeSelect({label:s("attribute_optional",this._lang),value:e.attribute,suggested:n?.suggested??[],available:n?.available??[],onSelect:l=>this._patchCondition(t,{attribute:l})})}_renderConditionTypeFields(e,t){let i=this._lang;if(e.type==="threshold")return o`
        <ms-textfield label="${s("trigger_above",i)}" type="number" .value=${e.above}
          @input=${n=>this._patchCondition(t,{above:n.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_below",i)}" type="number" .value=${e.below}
          @input=${n=>this._patchCondition(t,{below:n.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_equals",i)}" type="number" .value=${e.equals}
          @input=${n=>this._patchCondition(t,{equals:n.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_not_equals",i)}" type="number" .value=${e.notEquals}
          @input=${n=>this._patchCondition(t,{notEquals:n.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",i)}" type="number" .value=${e.forMinutes}
          @input=${n=>this._patchCondition(t,{forMinutes:n.target.value})}></ms-textfield>
      `;if(e.type==="counter")return o`
        <ms-textfield label="${s("target_value",i)}" type="number" .value=${e.targetValue}
          @input=${n=>this._patchCondition(t,{targetValue:n.target.value})}></ms-textfield>
        ${S({checked:e.deltaMode,onChange:n=>this._patchCondition(t,{deltaMode:n.target.checked})},o`${s("delta_mode",i)}`)}
      `;if(e.type==="state_change"){let n=e.entityIds.split(",")[0]?.trim()||"";return o`
        ${this._renderStateField({label:s("from_state_optional",i),value:e.fromState,entityId:n,onInput:l=>this._patchCondition(t,{fromState:l})})}
        ${this._renderStateField({label:s("to_state_optional",i),value:e.toState,entityId:n,onInput:l=>this._patchCondition(t,{toState:l})})}
        <ms-textfield label="${s("target_changes",i)}" type="number" .value=${e.targetChanges}
          @input=${l=>this._patchCondition(t,{targetChanges:l.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",i)}" type="number" .value=${e.forMinutes}
          @input=${l=>this._patchCondition(t,{forMinutes:l.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let n=e.entityIds.split(",")[0]?.trim()||"";return o`
        <ms-textfield label="${s("runtime_hours",i)}" type="number" .value=${e.runtimeHours}
          @input=${l=>this._patchCondition(t,{runtimeHours:l.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:n,onInput:l=>this._patchCondition(t,{onStates:l})})}
      `}return e.type==="due_date"?o`
        <ms-textfield label="${s("days_before",i)}" type="number" step="1"
          min=${Oe[0]} max=${Oe[1]} .value=${e.daysBefore}
          @input=${n=>this._patchCondition(t,{daysBefore:n.target.value})}></ms-textfield>
      `:p}_renderUnitSelect(){let e=this._lang;return o`
      <div class="select-row">
        ${q()?p:o`<label>${s("interval_unit",e)}</label>`}
        ${A({label:s("interval_unit",e),value:this._intervalUnit,onChange:t=>this._intervalUnit=t.target.value},o`
          ${["days","weeks","months","years"].map(t=>o`<option value=${t} ?selected=${t===this._intervalUnit}>${s("unit_"+t,e)}</option>`)}
        `)}
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(at.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(m._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let i=(u,_,g=0)=>{if(!(!u||g>10)){(u.tagName?.toLowerCase()??"")==="ha-entity-picker"&&_.push(u);for(let f of[u.shadowRoot,u])if(f)for(let v of Array.from(f.children??[]))i(v,_,g+1)}},n=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],l=[];for(let u of n)i(u,l);let d=l.length===0||l.some(u=>u.offsetHeight===0);if(e.offsetHeight===0||d){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){++this._previewSeq,this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{},...this._taskId?{entry_id:this._entryId,task_id:this._taskId}:{}});if(t!==this._previewSeq)return;this._schedulePreview=i.occurrences||[],this._schedulePreviewEnded=!!i.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return p;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",i=this._schedulePreview.map((l,d)=>{let u=new Date(`${l}T12:00:00`).getDay();return`${be(u===0?6:u-1,e,"short")} ${L(l,e)}${d===0?t:""}`}).join(" \xB7 "),n=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?o`<div class="field-help">${s("schedule_preview_ontime",e)}</div>`:p;return o`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",e)}: ${i}${this._schedulePreviewEnded?o` <span class="field-help">${s("schedule_preview_ends",e)}</span>`:p}
        ${n}
      </div>
    `}_buildSchedule(){let e=n=>{let l=parseInt(this._calOffset,10)||0;return l&&(n.offset=Math.max(-Ne,Math.min(l,Ne))),n},t=n=>((this._calMonths.length||this._hadCalMonths)&&(n.months=[...this._calMonths].sort((l,d)=>l-d)),e(n));if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((n,l)=>n-l)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let i={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(i.business=!0),t(i)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,i)=>t-i)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleCalMonth(e){this._calMonths=this._calMonths.includes(e)?this._calMonths.filter(t=>t!==e):[...this._calMonths,e]}_renderCalMonths(){let e=this._lang;return o`
      <label class="field-label">${s("recurrence_months_label",e)}</label>
      <div class="field-help">${s("recurrence_months_hint",e)}</div>
      <div class="weekday-chips season-chips cal-month-chips">
        ${Li(e).map((t,i)=>o`
          <button
            type="button"
            class="season-chip ${this._calMonths.includes(i+1)?"selected":""}"
            @click=${()=>this._toggleCalMonth(i+1)}
          >${t}</button>`)}
      </div>`}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||at.includes(this._scheduleType)))return p;let i=Li(e);return o`
      <label class="field-label">${s("season_window_label",e)}</label>
      <div class="field-help">${s("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${i.map((n,l)=>o`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(l+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(l+1)}
          >${n}</button>`)}
      </div>

      <label class="field-label">${s("series_end_label",e)}</label>
      <div class="select-row">
        ${A({label:s("series_end_label",e),value:this._endsMode,onChange:n=>this._endsMode=n.target.value},o`
          <option value="never" ?selected=${this._endsMode==="never"}>${s("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${s("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${s("series_end_until",e)}</option>
        `)}
      </div>
      ${this._endsMode==="count"?o`
        <!-- max: MAX_SERIES_COUNT (const.py), what the history can count. -->
        <ms-textfield
          label="${s("series_end_count_label",e)}"
          type="number" min="1" max="500"
          .value=${this._endsCount}
          @input=${n=>this._endsCount=n.target.value}
        ></ms-textfield>`:p}
      ${this._endsMode==="until"?o`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${s("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${n=>this._endsUntil=n.detail.value}
        ></ms-date-field>`:p}
    `}_renderCalendarFields(){let e=this._lang,t=pr(e);if(this._scheduleType==="weekdays")return o`
        <label class="field-label">${s("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((i,n)=>o`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(n)?"selected":""}"
              @click=${()=>this._toggleWeekday(n)}
            >${i}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let i=[["1",s("ord_1",e)],["2",s("ord_2",e)],["3",s("ord_3",e)],["4",s("ord_4",e)],["5",s("ord_5",e)],["-1",s("ord_last",e)]];return o`
        <div class="select-row">
          ${q()?p:o`<label>${s("recurrence_occurrence",e)}</label>`}
          ${A({label:s("recurrence_occurrence",e),value:this._nth,onChange:n=>this._nth=n.target.value},o`
            ${i.map(([n,l])=>o`<option value=${n} ?selected=${n===this._nth}>${l}</option>`)}
          `)}
        </div>
        <div class="select-row">
          ${q()?p:o`<label>${s("recurrence_weekday",e)}</label>`}
          ${A({label:s("recurrence_weekday",e),value:this._nthWeekday,onChange:n=>this._nthWeekday=n.target.value},o`
            ${t.map((n,l)=>o`<option value=${String(l)} ?selected=${String(l)===this._nthWeekday}>${n}</option>`)}
          `)}
        </div>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?o`
        ${this._entityPickerFallback?o`
          <ms-textfield
            label="${s("calendar_entity_label",e)}"
            helper="${s("calendar_entity_hint",e)}"
            .value=${this._calendarEntity}
            @input=${i=>this._calendarEntity=i.target.value.trim()}
          ></ms-textfield>
        `:o`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>s("calendar_entity_label",e)}
            .computeHelper=${()=>s("calendar_entity_hint",e)}
            @value-changed=${i=>{this._calendarEntity=(i.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?o`
        ${this._domLastDay?p:o`
          <ms-textfield
            label="${s("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${i=>this._domDay=i.target.value}
          ></ms-textfield>`}
        ${S({cls:"checkbox-row",checked:this._domLastDay,onChange:i=>this._domLastDay=i.target.checked},o`<span>${s("recurrence_last_day",e)}</span>`)}
        ${S({cls:"checkbox-row",checked:this._domBusiness,onChange:i=>this._domBusiness=i.target.checked},o`<span>${s("recurrence_business_day",e)}</span>`)}
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`:p}_renderCalOffsetField(){let e=this._lang;return o`
      <ms-textfield
        label="${s("recurrence_offset",e)}"
        helper="${s("recurrence_offset_help",e)}"
        type="number"
        min=${-Ne}
        max=${Ne}
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return p;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?o`<div class="trigger-live-hint warn">${s("trigger_hint_overlap",this._lang)}</div>`:p,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let i=this.hass.states[t];if(!i)return e;let n=this._lang,l=i.attributes?.unit_of_measurement,d=typeof l=="string"&&l?` ${l}`:"",u=this._triggerAttribute?i.attributes?.[this._triggerAttribute]:i.state,_=typeof u=="number"?u:parseFloat(String(u)),g=u!=="unknown"&&u!=="unavailable"&&u!=null&&!isNaN(_),f=$=>x($,n,{maximumFractionDigits:1}),v=[];if(this._triggerType==="threshold"){let $=parseFloat(this._triggerAbove),T=parseFloat(this._triggerBelow),M=parseFloat(this._triggerEquals),j=parseFloat(this._triggerNotEquals);if([$,T,M,j].every(Y=>isNaN(Y)))return p;g&&v.push(s("trigger_hint_now",n).replace("{value}",f(_)+d)),isNaN($)||v.push(s("trigger_hint_above",n).replace("{target}",f($)+d)),isNaN(T)||v.push(s("trigger_hint_below",n).replace("{target}",f(T)+d)),isNaN(M)||v.push(s("trigger_hint_equals",n).replace("{target}",f(M)+d)),isNaN(j)||v.push(s("trigger_hint_not_equals",n).replace("{target}",f(j)+d))}else if(this._triggerType==="counter"){let $=parseFloat(this._triggerTargetValue);if(isNaN($))return p;this._triggerDeltaMode?this._taskId?v.push(s("trigger_hint_counter_delta_edit",n).replace("{target}",f($)+d)):g?v.push(s("trigger_hint_counter_delta",n).replace("{value}",f(_)+d).replace("{due}",f(_+$)+d).replace("{target}",f($)+d)):v.push(s("trigger_hint_counter_delta_edit",n).replace("{target}",f($)+d)):(g&&v.push(s("trigger_hint_now",n).replace("{value}",f(_)+d)),v.push(s("trigger_hint_counter_abs",n).replace("{target}",f($)+d)))}else if(this._triggerType==="runtime"){let $=parseFloat(this._triggerRuntimeHours);if(isNaN($))return p;v.push(s("trigger_hint_runtime",n).replace("{hours}",f($))),v.push(s("trigger_hint_state_now",n).replace("{value}",String(i.state)))}else if(this._triggerType==="state_change"){let $=parseInt(this._triggerTargetChanges,10)||1,T=this._triggerToState.trim();v.push((T?s("trigger_hint_state_change_to",n).replace("{state}",T):s("trigger_hint_state_change",n)).replace("{count}",String($))),v.push(s("trigger_hint_state_now",n).replace("{value}",String(i.state)))}else if(this._triggerType==="due_date"){let $=parseInt(this._triggerDaysBefore,10)||0;v.push($===0?s("trigger_hint_due_date_same_day",n):We("trigger_hint_due_date","trigger_hint_due_date_one",$,n,"days"));let T=u==null?"":String(u);T&&!isNaN(Date.parse(T))&&v.push(s("trigger_hint_due_date_now",n).replace("{date}",L(T,n)))}return v.length?o`<div class="trigger-live-hint">${v.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?o`
        <ms-textfield
          label="${s("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${t=>this._triggerAbove=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${t=>this._triggerBelow=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerEquals}
          @input=${t=>this._triggerEquals=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_not_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerNotEquals}
          @input=${t=>this._triggerNotEquals=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?o`
        <ms-textfield
          label="${s("target_value",e)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${t=>this._triggerTargetValue=t.target.value}
        ></ms-textfield>
        ${S({checked:this._triggerDeltaMode,onChange:t=>this._triggerDeltaMode=t.target.checked},o`${s("delta_mode",e)}`)}
        ${this._triggerDeltaMode?o`
              <ms-textfield
                label="${s("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${t=>this._triggerBaselineValue=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?s("baseline_start_help_edit",e):s("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?o`<div class="baseline-effective">
                      ${s("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:p}
              </div>
            `:p}
      `:this._triggerType==="state_change"?o`
        ${this._renderStateField({label:s("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:t=>this._triggerFromState=t})}
        <div class="field-help">${s("state_value_help",e)}</div>
        ${this._renderStateField({label:s("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:t=>this._triggerToState=t})}
        <ms-textfield
          label="${s("target_changes",e)}"
          type="number"
          min=${ui[0]}
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?o`<div class="field-help">${s("state_latch_help",e)}</div>`:p}
        <ms-textfield
          label="${s("for_at_least_minutes",e)}"
          type="number"
          min=${xe[0]}
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?o`
        <ms-textfield
          label="${s("runtime_hours",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${t=>this._triggerRuntimeHours=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("runtime_max_session",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeMaxSession}
          @input=${t=>this._triggerRuntimeMaxSession=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("runtime_max_session_help",e)}</div>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:t=>this._triggerOnStates=t})}
        <div class="field-help">${s("runtime_on_states_help",e)}</div>
      `:this._triggerType==="due_date"?o`
        <ms-textfield
          label="${s("days_before",e)}"
          type="number"
          step="1"
          min=${Oe[0]}
          max=${Oe[1]}
          .value=${this._triggerDaysBefore}
          @input=${t=>this._triggerDaysBefore=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("days_before_help",e)}</div>
      `:p}_section(e,t,i){return o`<section class="form-section ${e}">
      <h3 class="section-title">${t}</h3>
      ${i}
    </section>`}_renderIdentity(e){return o`
          ${this._taskId===null&&this._objectChoices.length>0?o`
            <div class="select-row">
              ${q()?p:o`<label>${s("object",e)}</label>`}
              ${A({label:s("object",e),value:this._entryId,onChange:t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},o`
                ${this._objectChoices.map(t=>o`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
              `)}
            </div>
          `:p}
          <ms-textfield
            label="${s("task_name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <div class="select-row">
            ${q()?p:o`<label>${s("maintenance_type",e)}</label>`}
            ${A({label:s("maintenance_type",e),value:this._type,onChange:t=>this._type=t.target.value},o`
              ${Ni.map(t=>o`<option value=${t} ?selected=${t===this._type}>${s(t,e)}</option>`)}
            `)}
          </div>
          <ms-textfield
            label="${s("notes_optional",e)}"
            multiline
            .rows=${3}
            .helper=${s("notes_markdown_hint",e)}
            .value=${this._notes}
            @input=${t=>this._notes=t.target.value}
          ></ms-textfield>
          ${this._renderDetails(e)}
          ${S({cls:"toggle-row",checked:this._enabled,onChange:t=>this._enabled=t.target.checked},o`${s("task_enabled",e)}`)}
    `}_renderDetails(e){return o`
      ${ee({cls:"details-section",open:this._detailsOpen,header:s("task_section_details",e)},o`
        <div class="select-row">
          ${q()?p:o`<label>${s("priority",e)}</label>`}
          ${A({label:s("priority",e),value:this._priority,onChange:t=>this._priority=t.target.value},o`
            ${kt.map(t=>o`<option value=${t} ?selected=${t===this._priority}>${s("priority_"+t,e)}</option>`)}
          `)}
        </div>
        <ms-textfield
          label="${s("labels",e)}"
          placeholder="${s("labels_placeholder",e)}"
          helper="${s("labels_help",e)}"
          .value=${this._labels}
          @input=${t=>this._labels=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("documentation_url_optional",e)}"
          .value=${this._documentationUrl}
          @input=${t=>this._documentationUrl=t.target.value}
        ></ms-textfield>
        <ha-icon-picker
          .hass=${this.hass}
          label="${s("custom_icon_optional",e)}"
          .value=${this._customIcon}
          @value-changed=${t=>this._customIcon=t.detail.value||""}
        ></ha-icon-picker>
      `)}
    `}_renderScheduleSection(e){return this._section("schedule-section",s("task_section_schedule",e),o`
          <div class="select-row">
            ${q()?p:o`<label>${s("schedule_type",e)}</label>`}
            ${A({label:s("schedule_type",e),value:this._scheduleType,onChange:t=>this._scheduleType=t.target.value},o`
              ${ar.map(t=>o`<option value=${t} ?selected=${t===this._scheduleType}>${s(t,e)}</option>`)}
            `)}
          </div>
          ${this._scheduleType==="time_based"?o`
                <ms-textfield
                  label="${s("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${t=>this._intervalDays=t.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  ${q()?p:o`<label>${s("interval_anchor",e)}</label>`}
                  ${A({label:s("interval_anchor",e),value:this._intervalAnchor,onChange:t=>this._intervalAnchor=t.target.value},o`
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${s("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${s("anchor_planned",e)}</option>
                  `)}
                  <div class="field-help anchor-help">${s("interval_anchor_hint",e)}</div>
                </div>
              `:p}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?o`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${e}
                  label="${s("due_date",e)}"
                  .value=${this._dueDate}
                  @value-changed=${t=>this._dueDate=t.detail.value}
                ></ms-date-field>
              `:p}
          ${this.scheduleTimeEnabled&&Mi.includes(this._scheduleType)?o`
            ${S({cls:"checkbox-row schedule-time-toggle",checked:this._scheduleTimeOn,onChange:t=>this._scheduleTimeOn=t.target.checked},o`<span>${s("schedule_time_toggle",e)}</span>`)}
            ${this._scheduleTimeOn?o`
              <ms-date-field
                kind="time"
                .hass=${this.hass}
                .lang=${e}
                .value=${this._scheduleTime}
                helper="${s("schedule_time_help",e)}"
                @value-changed=${t=>this._scheduleTime=t.detail.value}
              ></ms-date-field>
            `:p}
          `:p}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${s("last_performed_optional",e)}"
            .value=${this._lastPerformed}
            @value-changed=${t=>this._lastPerformed=t.detail.value}
          ></ms-date-field>
          <ms-textfield
            label="${s("warning_days",e)}"
            type="number"
            min=${yt[0]}
            max=${yt[1]}
            .value=${this._warningDays}
            @input=${t=>this._warningDays=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("earliest_completion_days",e)}"
            helper="${s("earliest_completion_days_help",e)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${t=>this._earliestCompletionDays=t.target.value}
          ></ms-textfield>
          ${this._renderAdaptiveSection(e)}
    `)}_renderTriggerSection(e){return this._scheduleType!=="sensor_based"?p:this._section("trigger-section",s("task_section_trigger",e),o`
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?o`
            ${this._entityPickerFallback?o`
              <ms-textfield
                label="${s("environmental_entity_optional",e)}"
                helper="${s("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${t=>this._environmentalEntity=t.target.value.trim()}
              ></ms-textfield>
            `:o`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:Ei}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>s("environmental_entity_optional",e)}
              .computeHelper=${()=>s("environmental_entity_helper",e)}
              @value-changed=${t=>{this._environmentalEntity=(t.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):p}
          `:p}
    `)}_renderCompletionSection(e){return this._section("completion-section",s("task_section_completion",e),o`
          ${this._type==="reading"?o`
                <ms-textfield
                  label="${s("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:p}
          ${this.checklistsEnabled?o`
            <label class="field-label" for="checklist-textarea">${s("checklist_steps_optional",e)}</label>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${s("checklist_placeholder",e)}"
              .value=${this._checklistText}
              @input=${t=>this._checklistText=t.target.value}
            ></textarea>
            <div class="field-help">${s("checklist_help",e)}</div>
          `:p}
          ${this._partsLoadFailed?o`<div class="field-help parts-load-failed">${s("parts_load_failed",e)}</div>`:p}
          ${this._isFleetTask?o`<div class="field-help parts-fleet-hint">${s("task_parts_fleet_hint",e)}</div>`:this.parts.length||this._foreignOwners.length?o`
                <div class="field">
                  <label>${s("consumes_parts_label",e)}</label>
                  ${this.parts.map(t=>this._renderConsumesRow(t))}
                  ${this._foreignOwners.length?o`
                        ${ee({cls:"shared-pools",open:this._hasForeignPick,header:s("shared_parts_other_objects",e)},o`
                          <div class="field-help">${s("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>o`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(i=>this._renderConsumesRow(i,t.entry_id))}
                            `)}
                        `)}
                      `:p}
                </div>
              `:p}
          <div class="field-label">${s("require_on_completion",e)}</div>
          <div class="required-completion">
            ${$t.map(t=>o`
              ${S({cls:"req-option",checked:this._requiredCompletion.includes(t),onChange:i=>this._toggleRequired(t,i.target.checked)},o`<span>${s(Te[t],e)}</span>`)}
            `)}
          </div>
          ${this._availableTags.length>0?o`
              <div class="select-row">
                ${q()?p:o`<label>${s("nfc_tag_id_optional",e)}</label>`}
                ${A({label:s("nfc_tag_id_optional",e),value:this._nfcTagId,onChange:t=>this._nfcTagId=t.target.value},o`
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(t=>o`<option value=${t.id} ?selected=${t.id===this._nfcTagId}>${t.name}</option>`)}
                `)}
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:o`
              <ms-textfield
                label="${s("nfc_tag_id_optional",e)}"
                .value=${this._nfcTagId}
                @input=${t=>this._nfcTagId=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${s("nfc_tags_empty_help",e)}
                <a href="/config/tags">${s("nfc_tags_open_settings",e)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${s("nfc_tags_refresh",e)}
                </button>
              </div>
            `}
          ${S({cls:"req-option",checked:this._requireTagScan,onChange:t=>this._requireTagScan=t.target.checked},o`<span>${s("require_tag_scan",e)}</span>`)}
          ${this._requireTagScan?o`<div class="field-help">${s("require_tag_scan_help",e)}</div>`:p}
          ${S({cls:"req-option",checked:!this._allowSkip,onChange:t=>this._allowSkip=!t.target.checked},o`<span>${s("disallow_skip",e)}</span>`)}
          ${this._allowSkip?p:o`<div class="field-help">${s("disallow_skip_help",e)}</div>`}
          ${this._renderQuickComplete(e)}
          ${this._renderCompleteWhen(e)}
          ${this._renderPhasesEditor(e)}
          ${this._renderCompletionActionsSection(e)}
    `)}_renderPeopleSection(e){return this._section("people-section",s("task_section_people",e),o`
          <div class="select-row">
            ${q()?p:o`<label>${s("responsible_user",e)}</label>`}
            ${A({label:s("responsible_user",e),value:this._responsibleUserId||"",onChange:t=>{let i=t.target.value;this._responsibleUserId=i||null}},o`
              <option value="" ?selected=${!this._responsibleUserId}>${s("no_user_assigned",e)}</option>
              ${this._availableUsers.map(t=>o`<option value=${t.id} ?selected=${t.id===this._responsibleUserId}>${t.name}</option>`)}
            `)}
          </div>
          ${this._availableUsers.length>=2?o`
            <div class="field">
              <label>${s("task_shared_with",e)}</label>
              <div class="field-help">${s("task_shared_with_help",e)}</div>
              ${this._responsibleUserId&&this._assigneePool.length>0&&!(this._assigneePool.length>=2&&this._rotationStrategy)?o`<div class="field-help shared-responsible-wins">${s("task_shared_responsible_wins",e)}</div>`:p}
              <div class="assignee-pool">
                ${this._availableUsers.map(t=>o`
                  ${S({cls:"pool-item",checked:this._assigneePool.includes(t.id),onChange:()=>this._toggleAssignee(t.id)},o`<span>${t.name}</span>`)}`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?o`
              <div class="select-row">
                ${q()?p:o`<label>${s("rotation_strategy",e)}</label>`}
                ${A({label:s("rotation_strategy",e),value:this._rotationStrategy,onChange:t=>this._rotationStrategy=t.target.value},o`
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",e)}</option>
                  ${Ii.map(t=>o`<option value=${t} ?selected=${t===this._rotationStrategy}>${s("rotation_"+t,e)}</option>`)}
                `)}
              </div>`:p}
          `:p}
    `)}_renderNotificationsSection(e){return this._section("notifications-section",s("task_section_notifications",e),o`
          ${S({cls:"req-option",checked:!this._notifyEnabled,onChange:t=>this._notifyEnabled=!t.target.checked},o`<span>${s("no_notifications",e)}</span>`)}
          ${this._notifyEnabled?p:o`<div class="field-help">${s("no_notifications_help",e)}</div>`}
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${s("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${t=>this._notifyIcon=t.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||xt(this._type)}></ha-icon>
            ${s("notify_icon_hint",e).replace("{default}",xt(this._type))}
          </div>
          ${this._renderMirrorTodo(e)}
    `)}_renderMirrorTodo(e){let t=this.mirrorTodoDefault;if(!t.length)return o`
          <div class="field mirror-todo-field">
            ${this._renderMirrorTodoPicker(e)}
            <div class="field-help">${s("task_mirror_todo_hint",e)}</div>
          </div>`;let i=t.map(l=>De(this.hass,l)).join(", "),n={default:s("task_mirror_todo_default",e).replace("{lists}",i),own:s("task_mirror_todo_own",e),none:s("task_mirror_todo_none",e)};return o`
          <div class="field mirror-todo-field">
            <div class="mirror-todo-choice" role="radiogroup" aria-label=${s("task_mirror_todo",e)}>
              <div class="field-label">${s("task_mirror_todo",e)}</div>
              ${Object.keys(n).map(l=>o`
                <label class="mirror-todo-option">
                  <input type="radio" name="mirror-todo" value=${l} .checked=${this._mirrorTodoMode===l}
                    @change=${()=>this._mirrorTodoMode=l} />
                  ${n[l]}
                </label>
              `)}
            </div>
            ${this._mirrorTodoMode==="own"?this._renderMirrorTodoPicker(e):p}
            ${this._mirrorTodoMode!=="none"?o`<div class="field-help">${s("task_mirror_todo_hint",e)}</div>`:p}
          </div>`}_renderMirrorTodoPicker(e){return o`
            ${this._entityPickerFallback?o`
              <ms-textfield
                label="${s("task_mirror_todo",e)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${t=>{this._mirrorTodoEntities=it(this.hass,t.target.value.split(",").map(i=>i.trim()))}}
              ></ms-textfield>
            `:o`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"],exclude_entities:Ai(this.hass)}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>s("task_mirror_todo",e)}
                @value-changed=${t=>{this._mirrorTodoEntities=it(this.hass,t.detail.value.mirror_todo_entities||[])}}
              ></ha-form>`}
            <div class="field-help mirror-todo-max">${s("task_mirror_todo_max",e).replace("{max}",String(5))}</div>`}_ruleDraft(){let e=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];return{name:this._name,enabled:this._enabled,typeLabel:s(this._type,this._lang),scheduleType:this._scheduleType,intervalDays:this._intervalDays,intervalUnit:this._intervalUnit,intervalAnchor:this._intervalAnchor,dueDate:this._dueDate,weekdays:this._weekdays,nth:this._nth,nthWeekday:this._nthWeekday,domDay:this._domDay,domLastDay:this._domLastDay,calendarEntity:this._calendarEntity?De(this.hass,this._calendarEntity):"",warningDays:this._warningDays,triggerType:this._triggerType,triggerEntityIds:e,triggerAttribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,daysBefore:this._triggerDaysBefore,triggerCombinator:this._triggerCombinator,entityLogic:this._triggerEntityLogic,compoundLogic:this._compoundLogic,compoundCount:this._compoundConditions.length,compoundEntityIds:this._compoundConditions.flatMap(t=>t.entityIds.split(",").map(i=>i.trim()).filter(Boolean)),completeWhenEntity:this._completeWhenEntity,completeWhenState:this._completeWhenState,completeWhenFor:this._completeWhenFor,completeWhenAnyTime:this._completeWhenAnyTime,quickOn:this._quickOn,requiredCount:this._requiredCompletion.length,allowSkip:this._allowSkip,requireTagScan:this._requireTagScan,checklistCount:this.checklistsEnabled?this._checklistText.split(`
`).filter(t=>t.trim()).length:0,partsCount:Object.keys(this._consumesParts).length,responsibleUserId:this._responsibleUserId,pool:this._assigneePool,rotation:this._rotationStrategy,notifyEnabled:this._notifyEnabled,mirrorLists:this._mirrorListsShown()}}_mirrorListsShown(){return this.mirrorTodoDefault.length?this._mirrorTodoMode==="default"?this.mirrorTodoDefault:this._mirrorTodoMode==="own"?this._mirrorTodoEntities:[]:this._mirrorTodoMode==="none"?[]:this._mirrorTodoEntities}_userName(e){return this._availableUsers.find(t=>t.id===e)?.name??e}_sidebarTitle(e,t){switch(e){case"task":return s("task_section_details",t);case"schedule":return s("task_section_schedule",t);case"trigger":return s("task_section_trigger",t);case"completion":return s("task_section_completion",t);case"people":return s("task_section_people",t);case"notifications":return s("task_section_notifications",t);default:return s("beta_rules_add_rule",t)}}_selectRule(e){this._ruleSel=this._ruleSel===e?null:e,e==="add"&&this._loadObjectDevice()}_removeRule(e){e==="trigger"?(this._resetTriggerFields(),this._scheduleType=parseInt(this._intervalDays,10)>0?"time_based":"manual"):e==="schedule"&&(this._scheduleType==="sensor_based"?this._intervalDays="":this._scheduleType="manual"),this._ruleSel===e&&(this._ruleSel=null)}_combineTrigger(e,t=""){if(this._triggerType!=="compound"){let i=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];this._compoundConditions=[{entityIds:i.join(", "),...this._typeFields(),carry:{}}],this._compoundLogic="OR",this._triggerType="compound",this._triggerEntityId="",this._triggerEntityIds=[]}this._compoundConditions=[...this._compoundConditions,{...nt(),type:e,entityIds:t}]}_setSensorRule(e,t=""){this._scheduleType!=="time_based"&&this._scheduleType!=="sensor_based"&&(this._intervalDays=""),this._scheduleType="sensor_based",this._resetTriggerFields(),this._triggerType=e,e==="compound"&&(this._compoundConditions=[nt()]),t&&(this._triggerEntityId=t,this._triggerEntityIds=[t],this._fetchEntityAttributes(t))}_applyChoice(e){if(e.kind==="schedule"){if(e.effect==="safety"){parseInt(this._intervalDays,10)>0||(this._intervalDays="30"),this._ruleSel="trigger";return}this._scheduleType==="sensor_based"&&this._resetTriggerFields(),e.value==="time_based"&&!(parseInt(this._intervalDays,10)>0)&&(this._intervalDays="30"),this._scheduleType=e.value,this._ruleSel="schedule";return}let t=e.value;e.effect==="combine"?this._combineTrigger(t):this._setSensorRule(t),this._ruleSel="trigger"}_applySuggestion(e){if(e.target==="done_when"){e.entityId!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=e.entityId,this._ruleSel="completion";return}let t=e.triggerType??"threshold";this._scheduleType==="sensor_based"&&(this._triggerType==="compound"||!!this._triggerEntityId)?this._combineTrigger(t,e.entityId):this._setSensorRule(t,e.entityId),this._ruleSel="trigger"}async _loadObjectDevice(){let e=this._entryId;if(!e||this._objectDevice?.entryId===e)return;let t=null,i=null;try{let l=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}))?.objects??[]).find(d=>d.entry_id===e);t=l?.object.ha_device_id??null,i=l?.object.area_id??null}catch{}this._entryId===e&&(this._objectDevice={entryId:e,deviceId:t,areaId:i})}async _loadTemplateChoices(){if(this._templateChoices===null)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._templateChoices=(e?.templates??[]).filter(t=>!t.disabled).flatMap(t=>(t.tasks??[]).map(i=>({...i,template:t.name})))}catch{this._templateChoices=[]}}async _loadCopyChoices(){if(this._copyChoices===null)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._copyChoices=(e?.objects??[]).flatMap(t=>(t.tasks??[]).filter(i=>!i.battery_fleet_task&&!i.part_ref).map(i=>({entryId:t.entry_id,objectName:t.object.name,task:i})))}catch{this._copyChoices=[]}}_applyTemplateTask(e){this._name=e.name,this._type=Ni.includes(e.type)?e.type:"custom";let t=e.interval_days&&e.interval_days>0?String(e.interval_days):"";e.schedule_type==="sensor_based"?(this._scheduleType="sensor_based",this._intervalDays=t):e.schedule_type==="manual"||!t?this._scheduleType="manual":(this._scheduleType="time_based",this._intervalDays=t,this._intervalUnit="days"),e.warning_days!==null&&e.warning_days!==void 0&&(this._warningDays=String(e.warning_days)),this._betaStep="form",this._ruleSel=this._scheduleType==="sensor_based"?"add":"schedule",this._ruleSel==="add"&&(this._addTab="device",this._loadObjectDevice())}async _applyCopy(e){let t=this._entryId,i=this._objectChoices;await this._edit(e.entryId,e.task),this._taskId=null,this._entryId=t,this._objectChoices=i,this._series=[],this._isFleetTask=!1,this._lastPerformed="",this._nfcTagId="",this._consumesParts={},this._consumesQtyText={},this._phaseDefs=this._phaseDefs.map(n=>({...n,partId:"",partQty:"",extraParts:[]})),await Promise.all([this._loadParts(),this._loadForeignPools()]),this._betaStep="form",this._ruleSel="task"}_choiceNote(e,t){return e.effect==="replace"?s("beta_rules_replaces",t):e.effect==="combine"?s("beta_rules_combines",t):e.effect==="safety"?s("beta_rules_adds_safety",t):""}_renderAddPicker(e){let t=o`
      <div class="add-tabs" role="tablist" aria-label=${s("beta_rules_add_rule",e)}>
        <button type="button" role="tab" class="add-tab-type" aria-selected=${this._addTab==="type"?"true":"false"}
          @click=${()=>{this._addTab="type"}}>${s("beta_rules_by_type",e)}</button>
        <button type="button" role="tab" class="add-tab-device" aria-selected=${this._addTab==="device"?"true":"false"}
          @click=${()=>{this._addTab="device",this._loadObjectDevice()}}>${s("beta_rules_by_device",e)}</button>
      </div>`;if(this._addTab==="type"){let g=Pi({scheduleType:this._scheduleType,intervalDays:this._intervalDays,triggerType:this._triggerType}),f=v=>{let $=this._choiceNote(v,e);return o`
          <button type="button" class="add-choice" data-kind=${v.kind} data-value=${v.value} @click=${()=>this._applyChoice(v)}>
            <ha-icon icon=${v.icon}></ha-icon>
            <span class="add-choice-text">
              <span>${v.kind==="trigger"?rt(v.value,e):s(v.value,e)}</span>
              ${$?o`<span class="add-choice-note">${$}</span>`:p}
            </span>
          </button>`};return o`${t}
        <div class="add-group">${s("task_section_schedule",e)}</div>
        ${g.filter(v=>v.kind==="schedule").map(f)}
        <div class="add-group">${s("task_section_trigger",e)}</div>
        ${g.filter(v=>v.kind==="trigger").map(f)}`}let i=this._objectDevice;if(i===null||i.entryId!==this._entryId)return o`${t}<div class="field-help">…</div>`;if(!i.deviceId&&!i.areaId)return o`${t}<div class="field-help beta-no-device">${s("beta_rules_no_device",e)}</div>`;let n=Hi(this.hass,{deviceId:i.deviceId,areaId:i.areaId,ownPlatform:"maintenance_supporter"});if(!n.length)return o`${t}<div class="field-help beta-no-device">${s(i.deviceId?"beta_rules_no_device_entities":"beta_rules_no_area_entities",e)}</div>`;let l=i.areaId||(i.deviceId?this.hass.devices?.[i.deviceId]?.area_id:null)||"",d=this.hass.areas?.[l]?.name||l,u=n.some(g=>g.group==="device"),_=(g,f)=>{if(f>0&&n[f-1].group===g.group)return p;let v=g.group==="device"?s("beta_rules_group_device",e):s(u?"beta_rules_group_area_more":"beta_rules_group_area",e).replace("{area}",d);return o`<div class="add-group device-group" data-group=${g.group}>${v}</div>`};return o`${t}
      ${n.map((g,f)=>o`${_(g,f)}
        <div class="device-entity" data-entity=${g.entityId} data-group=${g.group}>
          <div class="device-entity-name">${g.name}</div>
          <div class="device-entity-choices">
            ${Et(g).map(v=>o`
              <button type="button" class="add-choice" data-target=${v.target} data-type=${v.triggerType??""} @click=${()=>this._applySuggestion(v)}>
                <ha-icon icon=${v.icon}></ha-icon>
                <span>${v.target==="done_when"?s("beta_rules_done_when_suggest",e):rt(v.triggerType??"",e)}</span>
              </button>`)}
          </div>
        </div>`)}`}_renderSidebarBody(e,t){switch(e){case"task":return this._renderIdentity(t);case"schedule":return this._renderScheduleSection(t);case"trigger":return this._renderTriggerSection(t);case"completion":return this._renderCompletionSection(t);case"people":return this._renderPeopleSection(t);case"notifications":return this._renderNotificationsSection(t);default:return this._renderAddPicker(t)}}_renderRules(e){let t=qi(this._ruleDraft(),{lang:e,entityName:g=>De(this.hass,g),userName:g=>this._userName(g)}),i=new Map(t.map(g=>[g.id,g])),n=[{title:s("task_section_details",e),ids:["task"]},{title:s("task_section_schedule",e),ids:["schedule","trigger"],add:!0},{title:s("task_section_completion",e),ids:["completion"]},{title:s("task_section_people",e),ids:["people"]},{title:s("task_section_notifications",e),ids:["notifications"]}],l=0,d=1,u=[];for(let g of n){l+=2,u.push(o`<h3 class="rules-group-title" style="order:${l}">${g.title}</h3>`);for(let f of g.ids){let v=i.get(f);if(!v)continue;l+=2,this._ruleSel===f&&(d=l+1);let $=this._ruleSel===f;u.push(o`
          <div class="rule-row ${$?"selected":""}" data-row=${v.id} style="order:${l}">
            <button type="button" class="rule-main" aria-expanded=${$?"true":"false"} @click=${()=>this._selectRule(v.id)}>
              <ha-icon icon=${v.icon}></ha-icon>
              <span class="rule-text">
                <span class="rule-sentence">${v.text}</span>
                ${v.chips.map(T=>o`<span class="rule-chip">${T}</span>`)}
                ${v.badges.length?o`<span class="rule-badges">${v.badges.map(T=>o`<span class="rule-badge">${T}</span>`)}</span>`:p}
              </span>
            </button>
            ${v.removable?o`
              <ha-icon-button class="rule-remove" .path=${sr} .label=${s("remove",e)} title=${s("remove",e)}
                @click=${()=>this._removeRule(v.id)}></ha-icon-button>`:p}
          </div>`)}g.add&&(l+=2,this._ruleSel==="add"&&(d=l+1),u.push(o`
          <button type="button" class="rule-add" style="order:${l}" aria-expanded=${this._ruleSel==="add"?"true":"false"}
            @click=${()=>this._selectRule("add")}>
            <ha-icon icon="mdi:plus"></ha-icon>${s("beta_rules_add_rule",e)}
          </button>`))}let _=this._ruleSel;return o`
      <div class="rules-layout">
        ${u}
        <aside class="rules-sidebar ${_?"open":""}" style="order:${d}" aria-label=${_?this._sidebarTitle(_,e):s("beta_rules_select_hint",e)}>
          ${_?o`
                <div class="sidebar-head">
                  <ha-icon-button .path=${rr} .label=${s("close",e)} @click=${()=>{this._ruleSel=null}}></ha-icon-button>
                  <span class="sidebar-title">${this._sidebarTitle(_,e)}</span>
                </div>
                <div class="sidebar-body">${this._renderSidebarBody(_,e)}</div>`:o`<div class="sidebar-hint">${s("beta_rules_select_hint",e)}</div>`}
        </aside>
      </div>`}_renderObjectChoice(e){return this._taskId!==null||this._objectChoices.length===0?p:o`
      <div class="select-row">
        ${q()?p:o`<label>${s("object",e)}</label>`}
        ${A({label:s("object",e),value:this._entryId,onChange:t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},o`
          ${this._objectChoices.map(t=>o`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
        `)}
      </div>`}_renderChooser(e){let t=(i,n,l,d,u)=>o`
      <button type="button" class="chooser-item ${i}" @click=${u}>
        <ha-icon icon=${n}></ha-icon>
        <span class="chooser-text">
          <span class="chooser-title">${l}</span>
          <span class="chooser-desc">${d}</span>
        </span>
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>`;return o`
      ${this._renderObjectChoice(e)}
      <div class="chooser">
        ${t("chooser-scratch","mdi:pencil",s("beta_new_scratch",e),s("beta_new_scratch_desc",e),()=>{this._betaStep="form",this._ruleSel="task"})}
        ${t("chooser-sensor","mdi:auto-fix",s("beta_new_from_sensor",e),s("beta_new_from_sensor_desc",e),()=>{this._betaStep="form",this._ruleSel="add",this._addTab="device",this._loadObjectDevice()})}
        ${t("chooser-template","mdi:text-box-outline",s("templates_from",e),s("beta_new_from_template_desc",e),()=>{this._betaStep="template",this._chooserFilter="",this._loadTemplateChoices()})}
        ${t("chooser-copy","mdi:content-copy",s("beta_new_copy",e),s("beta_new_copy_desc",e),()=>{this._betaStep="copy",this._chooserFilter="",this._loadCopyChoices()})}
      </div>`}_renderSearch(e){return o`<input type="search" class="chooser-search" aria-label=${s("beta_new_search",e)} placeholder=${s("beta_new_search",e)}
      .value=${this._chooserFilter} @input=${t=>{this._chooserFilter=t.target.value}} />`}_renderTemplatePick(e){if(this._templateChoices===null)return o`<div class="chooser-empty">…</div>`;let t=this._chooserFilter.trim().toLowerCase(),i=this._templateChoices.filter(n=>!t||`${n.name} ${n.template}`.toLowerCase().includes(t)).slice(0,200);return o`
      ${this._renderSearch(e)}
      <div class="chooser">
        ${i.length?i.map(n=>o`
          <button type="button" class="chooser-item template-task" @click=${()=>this._applyTemplateTask(n)}>
            <ha-icon icon=${n.schedule_type==="sensor_based"?"mdi:gauge":"mdi:calendar-sync"}></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${n.name}</span>
              <span class="chooser-desc">${n.template}${n.interval_days?o` · ${x(n.interval_days,e)} ${s("unit_days",e)}`:p}</span>
            </span>
          </button>`):o`<div class="chooser-empty">—</div>`}
      </div>`}_renderCopyPick(e){if(this._copyChoices===null)return o`<div class="chooser-empty">…</div>`;let t=this._chooserFilter.trim().toLowerCase(),i=this._copyChoices.filter(n=>!t||`${n.task.name} ${n.objectName}`.toLowerCase().includes(t)).slice(0,200);return o`
      ${this._renderSearch(e)}
      <div class="chooser">
        ${i.length?i.map(n=>o`
          <button type="button" class="chooser-item copy-task" @click=${()=>{this._applyCopy(n)}}>
            <ha-icon icon="mdi:content-copy"></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${n.task.name}</span>
              <span class="chooser-desc">${n.objectName}</span>
            </span>
          </button>`):o`<div class="chooser-empty">—</div>`}
      </div>`}_renderBeta(e,t,i){let n=this._betaStep;return o`
      <ha-dialog open class="beta-dialog" .headerTitle=${t}
        .headerSubtitle=${this._series.length>1?s("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length)):void 0}
        @closed=${this._close}>
        <!-- HA's header (2026): the title beside the close button; on a
             step under the start screen HA's back arrow takes its place. -->
        ${n==="template"||n==="copy"?o`<ha-icon-button slot="headerNavigationIcon" class="beta-back" .path=${nr} .label=${s("back",e)}
              @click=${()=>{this._betaStep="choose"}}></ha-icon-button>`:p}
        <div class="content beta-content">
          ${this._error?P("error",this._error):p}
          ${this._warning?P("warning",this._warning):p}
          ${n==="choose"?this._renderChooser(e):n==="template"?this._renderTemplatePick(e):n==="copy"?this._renderCopyPick(e):this._renderRules(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${s("cancel",e)}</ha-button>
          ${n==="form"&&i?o`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${s("task_series_skip",e)}
              </ha-button>`:p}
          ${n==="form"?o`<ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}>
                ${this._loading?s("saving",e):s(i?"task_series_save_next":"save",e)}
              </ha-button>`:p}
        </div>
      </ha-dialog>
    `}render(){if(!this._open)return o``;let e=this._lang,t=this._taskId?s("edit_task",e):s("new_task",e),i=this._seriesIndex+1<this._series.length;return this.betaEditor?this._renderBeta(e,t,i):o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">
          ${t}
          ${this._series.length>1?o`<span class="series-position">${s("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length))}</span>`:p}
        </div>
        <div class="content">
          ${this._error?P("error",this._error):p}
          ${this._warning?P("warning",this._warning):p}
          ${this._renderIdentity(e)}
          ${this._renderScheduleSection(e)}
          ${this._renderTriggerSection(e)}
          ${this._renderCompletionSection(e)}
          ${this._renderPeopleSection(e)}
          ${this._renderNotificationsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${s("cancel",e)}</ha-button>
          ${i?o`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${s("task_series_skip",e)}
              </ha-button>`:p}
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}
          >
            ${this._loading?s("saving",e):s(i?"task_series_save_next":"save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};m._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calMonths","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),m.styles=[$e,ci,Oi,k`
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
  `],c([y({attribute:!1})],m.prototype,"hass",2),c([y({type:Boolean,attribute:"checklists-enabled"})],m.prototype,"checklistsEnabled",2),c([y({type:Boolean,attribute:"schedule-time-enabled"})],m.prototype,"scheduleTimeEnabled",2),c([y({type:Boolean,attribute:"completion-actions-enabled"})],m.prototype,"completionActionsEnabled",2),c([y({type:Boolean,attribute:"adaptive-feature"})],m.prototype,"adaptiveFeature",2),c([y({type:Boolean,attribute:"seasonal-feature"})],m.prototype,"seasonalFeature",2),c([y({type:Boolean,attribute:"environmental-feature"})],m.prototype,"environmentalFeature",2),c([y({type:Number,attribute:"default-warning-days"})],m.prototype,"defaultWarningDays",2),c([y({attribute:!1})],m.prototype,"mirrorTodoDefault",2),c([y({type:Boolean,attribute:"beta-editor"})],m.prototype,"betaEditor",2),c([h()],m.prototype,"_ruleSel",2),c([h()],m.prototype,"_addTab",2),c([h()],m.prototype,"_betaStep",2),c([h()],m.prototype,"_chooserFilter",2),c([h()],m.prototype,"_templateChoices",2),c([h()],m.prototype,"_copyChoices",2),c([h()],m.prototype,"_objectDevice",2),c([h()],m.prototype,"parts",2),c([h()],m.prototype,"_foreignOwners",2),c([h()],m.prototype,"_open",2),c([h()],m.prototype,"_entityPickerFallback",2),c([h()],m.prototype,"_loading",2),c([h()],m.prototype,"_error",2),c([h()],m.prototype,"_warning",2),c([h()],m.prototype,"_entryId",2),c([h()],m.prototype,"_taskId",2),c([h()],m.prototype,"_series",2),c([h()],m.prototype,"_seriesIndex",2),c([h()],m.prototype,"_isFleetTask",2),c([h()],m.prototype,"_objectChoices",2),c([h()],m.prototype,"_name",2),c([h()],m.prototype,"_type",2),c([h()],m.prototype,"_scheduleType",2),c([h()],m.prototype,"_intervalDays",2),c([h()],m.prototype,"_intervalUnit",2),c([h()],m.prototype,"_dueDate",2),c([h()],m.prototype,"_warningDays",2),c([h()],m.prototype,"_earliestCompletionDays",2),c([h()],m.prototype,"_intervalAnchor",2),c([h()],m.prototype,"_weekdays",2),c([h()],m.prototype,"_nth",2),c([h()],m.prototype,"_nthWeekday",2),c([h()],m.prototype,"_domDay",2),c([h()],m.prototype,"_domLastDay",2),c([h()],m.prototype,"_domBusiness",2),c([h()],m.prototype,"_calOffset",2),c([h()],m.prototype,"_calMonths",2),c([h()],m.prototype,"_calendarEntity",2),c([h()],m.prototype,"_seasonMonths",2),c([h()],m.prototype,"_endsMode",2),c([h()],m.prototype,"_endsCount",2),c([h()],m.prototype,"_endsUntil",2),c([h()],m.prototype,"_schedulePreview",2),c([h()],m.prototype,"_schedulePreviewEnded",2),c([h()],m.prototype,"_notes",2),c([h()],m.prototype,"_documentationUrl",2),c([h()],m.prototype,"_customIcon",2),c([h()],m.prototype,"_notifyIcon",2),c([h()],m.prototype,"_priority",2),c([h()],m.prototype,"_labels",2),c([h()],m.prototype,"_detailsOpen",2),c([h()],m.prototype,"_mirrorTodoEntities",2),c([h()],m.prototype,"_mirrorTodoMode",2),c([h()],m.prototype,"_completeWhenEntity",2),c([h()],m.prototype,"_completeWhenState",2),c([h()],m.prototype,"_completeWhenAnyTime",2),c([h()],m.prototype,"_completeWhenFor",2),c([h()],m.prototype,"_enabled",2),c([h()],m.prototype,"_triggerEntityId",2),c([h()],m.prototype,"_triggerEntityIds",2),c([h()],m.prototype,"_triggerEntityLogic",2),c([h()],m.prototype,"_triggerAttribute",2),c([h()],m.prototype,"_triggerType",2),c([h()],m.prototype,"_triggerAbove",2),c([h()],m.prototype,"_triggerBelow",2),c([h()],m.prototype,"_triggerEquals",2),c([h()],m.prototype,"_triggerNotEquals",2),c([h()],m.prototype,"_triggerForMinutes",2),c([h()],m.prototype,"_triggerCombinator",2),c([h()],m.prototype,"_triggerTargetValue",2),c([h()],m.prototype,"_triggerDeltaMode",2),c([h()],m.prototype,"_triggerBaselineValue",2),c([h()],m.prototype,"_liveBaselineValue",2),c([h()],m.prototype,"_autoCompleteOnRecovery",2),c([h()],m.prototype,"_holdUntilDone",2),c([h()],m.prototype,"_triggerFromState",2),c([h()],m.prototype,"_triggerToState",2),c([h()],m.prototype,"_triggerTargetChanges",2),c([h()],m.prototype,"_triggerRuntimeHours",2),c([h()],m.prototype,"_triggerDaysBefore",2),c([h()],m.prototype,"_triggerRuntimeMaxSession",2),c([h()],m.prototype,"_triggerOnStates",2),c([h()],m.prototype,"_triggerDetailAttribute",2),c([h()],m.prototype,"_compoundLogic",2),c([h()],m.prototype,"_compoundConditions",2),c([h()],m.prototype,"_suggestedAttributes",2),c([h()],m.prototype,"_availableAttributes",2),c([h()],m.prototype,"_entityDomain",2),c([h()],m.prototype,"_lastPerformed",2),c([h()],m.prototype,"_nfcTagId",2),c([h()],m.prototype,"_requireTagScan",2),c([h()],m.prototype,"_allowSkip",2),c([h()],m.prototype,"_notifyEnabled",2),c([h()],m.prototype,"_readingUnit",2),c([h()],m.prototype,"_readings",2),c([h()],m.prototype,"_consumesParts",2),c([h()],m.prototype,"_consumesQtyText",2),c([h()],m.prototype,"_partsLoadFailed",2),c([h()],m.prototype,"_availableTags",2),c([h()],m.prototype,"_responsibleUserId",2),c([h()],m.prototype,"_assigneePool",2),c([h()],m.prototype,"_rotationStrategy",2),c([h()],m.prototype,"_availableUsers",2),c([h()],m.prototype,"_checklistText",2),c([h()],m.prototype,"_phaseDefs",2),c([h()],m.prototype,"_phaseSeq",2),c([h()],m.prototype,"_requiredCompletion",2),c([h()],m.prototype,"_scheduleTime",2),c([h()],m.prototype,"_scheduleTimeOn",2),c([h()],m.prototype,"_actionService",2),c([h()],m.prototype,"_actionTargetEntity",2),c([h()],m.prototype,"_actionSkipAuto",2),c([h()],m.prototype,"_actionPresent",2),c([h()],m.prototype,"_actionData",2),c([h()],m.prototype,"_actionDataJsonFallback",2),c([h()],m.prototype,"_actionTesting",2),c([h()],m.prototype,"_actionTestResult",2),c([h()],m.prototype,"_actionTestError",2),c([h()],m.prototype,"_quickOn",2),c([h()],m.prototype,"_qcNotes",2),c([h()],m.prototype,"_qcCost",2),c([h()],m.prototype,"_qcDuration",2),c([h()],m.prototype,"_qcFeedback",2),c([h()],m.prototype,"_environmentalEntity",2),c([h()],m.prototype,"_environmentalAttribute",2),c([h()],m.prototype,"_adaptiveEnabled",2),c([h()],m.prototype,"_adaptiveAlpha",2),c([h()],m.prototype,"_adaptiveMin",2),c([h()],m.prototype,"_adaptiveMax",2),c([h()],m.prototype,"_adaptiveSeasonal",2),c([h()],m.prototype,"_adaptivePrediction",2),c([h()],m.prototype,"_conditionAttrOptions",2);var Tt=m;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",Tt);async function hr(r,a,e){let t=r.auth;if(t?.expired&&t.refreshAccessToken)try{await t.refreshAccessToken()}catch{}return fetch(a,{...e,headers:{...e.headers??{},Authorization:`Bearer ${t?.data?.access_token??""}`}})}var _r=100*1024*1024,Sa=500*1024*1024;async function mr(r,a,e,t="doc_too_large",i=[]){let n=await hr(r,a,{method:"POST",body:e});if(n.status===413)throw new Error(t);if(!n.ok){let l=await n.json().catch(()=>null);throw typeof l?.code=="string"&&i.includes(l.code)?new Error(l.code):new Error("doc_upload_failed")}return await n.json()}async function gr(r,a,e,t,i){if(e.size>_r)throw new Error("doc_too_large");let n=new FormData;n.append("entry_id",a);for(let d of t)n.append("tags",d);i&&n.append("purpose",i),n.append("file",e,e.name);let l=await mr(r,"/api/maintenance_supporter/document/upload",n);if(!l.id)throw new Error("doc_upload_failed");return{id:l.id,deduped:!!l.deduped,duplicate_in_object:l.duplicate_in_object??null}}async function Ui(r,a,e){return(await gr(r,a,e,["photo"],"completion")).id}async function St(r,a,e){await Promise.all(e.map(t=>r.connection.sendMessagePromise({type:"maintenance_supporter/documents/discard_upload",entry_id:a,doc_id:t}).catch(()=>{})))}var Se=class{constructor(a,e){this.host=a;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,a.addController(this)}hostConnected(){}get ids(){return this.photos.map(a=>a.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(a){return this.errorKey?s(this.errorKey,a).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(a=[]){this._endSession(),this._revokeAll(),this.photos=a.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(a){if(a.length===0)return;let e=this._session,t=this.opts.hass(),i=this.opts.entryId(),n=a.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let l of n){let d=await Ui(t,i,l);if(e!==this._session){St(t,i,[d]);return}this.uploadedIds=[...this.uploadedIds,d],this._uploadEntry.set(d,i),this.photos=[...this.photos,{id:d,preview:URL.createObjectURL(l)}],this.host.requestUpdate()}a.length>n.length&&(this.errorKey="photos_limit")}catch(l){if(e!==this._session)return;this.errorKey=l instanceof Error&&l.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(a){let e=this.photos.find(t=>t.id===a);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(t=>t.id!==a),this.uploadedIds.includes(a)&&(this.uploadedIds=this.uploadedIds.filter(t=>t!==a),this._discard([a])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let a=this.uploadedIds;this.uploadedIds=[],this._discard(a)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(a){let e=new Map;for(let i of a){let n=this._uploadEntry.get(i)??this.opts.entryId();this._uploadEntry.delete(i),e.set(n,[...e.get(n)??[],i])}let t=this.opts.hass();for(let[i,n]of e)St(t,i,n)}_revokeAll(){for(let a of this.photos)a.preview&&URL.revokeObjectURL(a.preview)}};function ot(){if(window.externalApp!==void 0)return!0;let a=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(a)&&/Android/.test(a)}function fr(r){!(r instanceof HTMLElement)||typeof r.showPopover!="function"||queueMicrotask(()=>{if(!(!r.isConnected||r.matches(":popover-open")))try{r.showPopover()}catch{}})}var lt=Ke(fr),dt=k`
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
`;var It={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraLabel:"msp-camera-label",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort",areaSort:"msp-area-sort",objectTreeOpen:"msp-object-tree-open",objectTableSort:"msp-object-table-sort",filterPane:"msp-filter-pane"};function Wi(r){try{return localStorage.getItem(r)}catch{return null}}function Bi(r,a){try{localStorage.setItem(r,a)}catch{}}function Zi(){if(!ot())return!1;let r=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!r&&typeof r.getUserMedia=="function"}var vr=1920,yr=.88,br={retryMs:500,windowMs:5e3},$r=new Set(["NotReadableError","AbortError","TrackStartError"]),Vi=80,Ji=/back|rear|environment|rück|hinten/i,Ki=/front|user|selfie|vorne/i;function Qi(r){let a=/camera2?\s*(\d+)/i.exec(r);return a?Number(a[1]):Number.MAX_SAFE_INTEGER}function Gi(r,a){if(a){let t=r.find(i=>i.label===a);if(t)return t}return r.filter(t=>t.label&&Ji.test(t.label)).sort((t,i)=>Qi(t.label)-Qi(i.label))[0]??null}var Yi=r=>r?.name||"Error",xr=r=>r?.message||"",z=class extends C{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...br};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let i=Wi(It.cameraLabel),n=await this._enumerate(t);if(!this._live(e))return;let l=Gi(n,i),d="refused";if(l&&(d=await this._openPatiently(t,e,this._byDevice(l))),d==="cancelled")return;if(d!=="ok"){if(d=await this._openPatiently(t,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),d==="cancelled")return;if(d!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(n=await this._enumerate(t),!this._live(e)){this._stopStream();return}}if(this._devices=n,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let u=l?null:Gi(n,i),_=this._deviceIndex>=0?n[this._deviceIndex]:void 0;if(!u||u.deviceId===_?.deviceId)return;let g=await this._replace(t,e,[this._byDevice(u)],this._restoreCandidates(_));if(g!=="cancelled"){if(g==="lost"){this._unavailable("camera_lost");return}this._settle(g)}}async _openPatiently(e,t,i){let n=Date.now();for(;;){let l;try{l=await e.getUserMedia({video:i.video,audio:!1})}catch(d){let u=Yi(d),_=xr(d);if(this._lastError=u,this._note(`${i.what} \u2192 ${u}${_&&_!==u?`: ${_}`:""}`),!this._live(t))return"cancelled";if(!$r.has(u))return"refused";if(Date.now()-n+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(g=>setTimeout(g,this.timing.retryMs)),!this._live(t))return"cancelled";continue}if(!this._live(t)){for(let d of l.getTracks())d.stop();return"cancelled"}return this._stream=l,this._note(`${i.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,t,i,n){this._switching=!0,this._stopStream();try{for(let l of i){let d=await this._openPatiently(e,t,l);if(d==="ok")return l;if(d==="cancelled")return d;if(d==="busy"){l.deviceId&&this._refused.add(l.deviceId);break}}for(let l of n){let d=await this._openPatiently(e,t,l);if(d==="ok")return"restored";if(d==="cancelled")return d}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let i=this._indexOfCurrent();return i>=0&&(this._deviceIndex=i),this._attach(),!1}this._switchFailed=!1;let t=e.deviceId?this._devices.findIndex(i=>i.deviceId===e.deviceId):-1;return this._deviceIndex=t>=0?t:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,t){let i=[],n=e?.deviceId||t;return n&&i.push({video:{deviceId:{exact:n}},what:`${e?.label||"previous camera"} (back again)`,deviceId:n}),i.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),i}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let t=(await e.enumerateDevices()).filter(i=>i.kind==="videoinput"&&!!i.deviceId);return this._note(`cameras: ${t.map(i=>i.label||"(no label)").join(" | ")||"none listed"}`),t}catch(t){return this._note(`enumerateDevices \u2192 ${Yi(t)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let t=e.getSettings().deviceId,i=t?this._devices.findIndex(n=>n.deviceId===t):-1;return i>=0?i:e.label?this._devices.findIndex(n=>n.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],t=e?.getSettings().facingMode;if(t==="user"||t==="environment")return t;let i=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return Ki.test(i)?"user":Ji.test(i)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let t=e.getSettings(),i=t.width&&t.height?`${t.width}\xD7${t.height}`:"size ?";return[e.label||"no label",i,t.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>Vi&&this._log.splice(1,this._log.length-Vi)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let t=this._gen,i=this._deviceIndex,n=i>=0?this._devices[i]:void 0,l=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||n?.deviceId,d=this._facing==="user"?"environment":"user",u=this._nextCameras(i,l);!u.length&&this._refused.size&&(this._refused.clear(),u=this._nextCameras(i,l)),this._note(`switch from ${n?.label||"unknown camera"}`);let _=[...u.map(g=>this._byDevice(this._devices[g])),{video:{facingMode:{exact:d}},what:`facing ${d} (exact)`},{video:{facingMode:{ideal:d}},what:`facing ${d}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let g=await this._replace(e,t,_,this._restoreCandidates(n,l));if(g==="cancelled")return;if(g==="lost"){this._unavailable("camera_lost");return}if(g!=="restored"&&!g.deviceId){if(this._isCamera(l,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=d}if(this._settle(g)&&g!=="restored"&&g.deviceId){let f=this._devices[this._deviceIndex]?.label??"";f&&Bi(It.cameraLabel,Ki.test(f)?"":f)}}finally{this._busy=!1}}_nextCameras(e,t){let i=this._devices.length,n=[];for(let l=1;l<=(e<0?i:i-1);l++){let d=(e+l)%i,u=this._devices[d].deviceId;u===t||this._refused.has(u)||n.push(d)}return n}_isCamera(e,t){let i=this._stream?.getVideoTracks()[0]?.getSettings();return e&&i?.deviceId?i.deviceId===e:!!i?.facingMode&&i.facingMode===t}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let t of this._stream?.getTracks()??[])t.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),t=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),t=!0)}catch{}if(!t){let i=this.shadowRoot?.querySelector(".details textarea");if(i){i.focus(),i.select();try{t=document.execCommand("copy")}catch{t=!1}}}this._copied=t}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let t=e.videoWidth||640,i=e.videoHeight||480,n=Math.min(1,vr/Math.max(t,i)),l=document.createElement("canvas");l.width=Math.round(t*n),l.height=Math.round(i*n);let d=l.getContext("2d");if(!d)throw new Error("no_canvas");d.drawImage(e,0,0,l.width,l.height);let u=await new Promise(f=>l.toBlob(f,"image/jpeg",yr));if(!u)throw new Error("no_blob");let _=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),g=new File([u],`photo-${_}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:g},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return p;let e=this.lang,t=this._busy||this._switching;return o`
      <div class="overlay top-layer" popover="manual" ${lt} role="dialog" aria-modal="true" aria-label=${s("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switching?o`<div class="switching" role="status">${s("camera_switching",e)}</div>`:p}
        ${this._switchFailed?o`<div class="switch-note" role="status">
              <div>${s("camera_not_answered",e)}</div>
              ${ee({cls:"details",header:s("camera_diagnostics",e)},o`
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${s(this._copied?"camera_copied":"camera_copy",e)}</button>
              `)}
            </div>`:p}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${s("cancel",e)}</button>
          ${this._devices.length>1?o`<button type="button" class="switch" ?disabled=${t} title=${s("camera_switch_lens",e)} aria-label=${s("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:p}
          <button type="button" class="shoot" ?disabled=${t} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${s("camera_capture_shoot",e)}</span>
          </button>
        </div>
      </div>
    `}};z.styles=[dt,k`
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
  `],c([y({type:String})],z.prototype,"lang",2),c([h()],z.prototype,"_open",2),c([h()],z.prototype,"_busy",2),c([h()],z.prototype,"_switching",2),c([h()],z.prototype,"_devices",2),c([h()],z.prototype,"_deviceIndex",2),c([h()],z.prototype,"_switchFailed",2),c([h()],z.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",z);var ct=k`
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
`,U=class extends C{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=ot();this._inAppCamera=Zi()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target,i=Array.from(t.files??[]);t.value="",this._emit(i)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return p;let e=this.lang,t=this._locked?"disabled":"",i=this.busy?s("uploading",e):s("doc_camera",e),n=s(this._singlePick?"choose_photo":"choose_photos",e);return o`
      <div class="photo-pickers">
        ${this.showCamera?o`<label class="photo-pick photo-pick-camera ${t}" role="button" tabindex="0"
              aria-label=${i} title=${this.compact?i:p}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?p:o`<span>${i}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
        ${this.showGallery?o`<label class="photo-pick photo-pick-gallery ${t}" role="button" tabindex="0"
              aria-label=${n} title=${this.compact?n:p}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?p:o`<span>${n}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
      </div>
      ${this.showGallery&&this._singlePick?o`<div class="photo-android-hint">${s("photos_android_hint",e)}</div>`:p}
      ${this.showCamera&&this._inAppCamera?o`<ms-camera-capture .lang=${e}
            @photo-captured=${l=>this._emit([l.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:p}
    `}};c([y({type:String})],U.prototype,"lang",2),c([y({type:Boolean})],U.prototype,"disabled",2),c([y({type:Boolean})],U.prototype,"busy",2),c([y({type:String})],U.prototype,"accept",2),c([y({type:Boolean})],U.prototype,"showCamera",2),c([y({type:Boolean})],U.prototype,"showGallery",2),c([y({type:Boolean})],U.prototype,"compact",2),c([y({type:Number})],U.prototype,"remaining",2),c([h()],U.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",U);var Ie=ne,b=class extends C{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new Se(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={};this.prefill=null}open(e={}){if(this._open)return;this._open=!0,this.viaTagScan=!!e.viaTagScan;let t=this.prefill;this._notes=t?.notes??"",this._cost=t?.cost!=null?String(t.cost):"",this._duration=t?.duration!=null?String(t.duration):"",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((i,n)=>[String(n),!!this.checklistPrefill[i]]).filter(([,i])=>i)),this._feedback=t?.feedback??"needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(i=>[G(i),{...i}])),this._usedQtyText={}}_rangeError(e,t){let i=this.lang;return s("settings_value_out_of_range",i).replace("{min}",x(e,i,{maximumFractionDigits:2})).replace("{max}",x(t,i,{maximumFractionDigits:2}))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId},t=this._notes.trim();if(t&&(e.notes=t),this._cost){let u=parseFloat(this._cost);isNaN(u)||(e.cost=u)}let i=ce(this._duration);if(i!==null&&(e.duration=i),this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(J(this._completedAt)>Date.now()){this._error=s("completed_at_future_error",this.lang);return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let u={};for(let _ of this.readings){let g=(this._readingValues[_.id]??"").trim();if(g==="")continue;let f=parseFloat(g.replace(",","."));isNaN(f)||(u[_.id]=f)}Object.keys(u).length>0&&(e.reading_values=u)}else if(this._readingValue!==""){let u=parseFloat(this._readingValue);isNaN(u)||(e.reading_value=u)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let u=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(u)||u<ke[0]||u>ke[1]){this._error=this._rangeError(...ke);return}e.restock_quantity=u}if(this.parts.length>0){let u=[];for(let[_,g]of Object.entries(this._usedParts)){let f=this._usedQtyText[_],v=f===void 0?g.quantity:parseFloat(f.replace(",","."));if(!Number.isFinite(v)||v<Ie[0]||v>Ie[1]){this._error=this._rangeError(...Ie);return}u.push({...g,quantity:v})}e.used_parts=u.map(_=>_.entry_id?{part_id:_.part_id,quantity:_.quantity,entry_id:_.entry_id}:{part_id:_.part_id,quantity:_.quantity})}let n=await R(this,e,{busy:u=>{this._loading=u},lang:this.lang,fallbackKey:"save_error",onError:u=>{this._error=u}});if(n===void 0)return;let l=Je(n,this.lang);if(l){this._close(),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:l},bubbles:!0,composed:!0}));return}this._photos.markAttached(),this._open=!1;let d={entryId:this.entryId,taskId:this.taskId,taskName:this.taskName,undo:n?.undo===!0};this.dispatchEvent(new CustomEvent("task-completed",{detail:d}))}_renderReadingField(e,t){let i=this._completedAt?J(this._completedAt):NaN,n=Yt(this.readingHistory,e.id,isNaN(i)?void 0:i),l=e.unit||this.readingUnit,d=(this._readingValues[e.id]??"").trim(),u=d===""?NaN:parseFloat(d.replace(",",".")),_=n!==void 0&&!isNaN(u)&&u<n.value,g=n!==void 0?x(n.value,t,{maximumFractionDigits:3}):"";return o`
      <label class="field reading-field">
        <span class="field-label">${e.name}${l?` (${l})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${n!==void 0?s("reading_last",t).replace("{value}",g):""}
          .value=${this._readingValues[e.id]??""}
          @input=${f=>{this._readingValues={...this._readingValues,[e.id]:f.target.value}}} />
        ${_?o`<span class="reading-warn">${s("reading_below_last",t).replace("{value}",g)}</span>`:p}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_demands(e){return this.requiredFields.includes(e)}_req(e){return this._demands(e)?o`<span class="req-mark" aria-hidden="true">*</span>`:p}_purchaseSuggestion(){if(this.restockDefault===null)return null;let e=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(e)||e<=0?null:Ye(this.restockUnitCost*e)}_partsValues(){let e={booked:null,info:null};if(this.restockDefault!==null||!this.parts.length)return e;for(let t of Object.values(this._usedParts)){let i=this.parts.find(d=>G({part_id:d.id,entry_id:d.entry_id})===G(t)),n=_i(i);if(n===null)continue;let l=Ge(i,this.partsCostMode)==="use"?"booked":"info";e[l]=(e[l]??0)+n*(t.quantity||1)}for(let t of["booked","info"])e[t]!==null&&(e[t]=Ye(e[t]));return e}_renderCostSuggestion(e){let t=this._purchaseSuggestion();if(this.restockDefault!==null){let d=this.partsCostMode==="use"?o`<div class="cost-note">${s("cost_purchase_use_hint",e)}</div>`:p;if(this._cost.trim()!==""||t==null||t<=0)return d;let u=B(t,this.currencySymbol,e);return o`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(Ye(t))}
        >${s("cost_from_parts",e).replace("{amount}",u)}</button>${d}`}let{booked:i,info:n}=this._partsValues(),l=(d,u)=>d!=null&&d>0?o`<div class="cost-note">${s(u,e).replace("{amount}",B(d,this.currencySymbol,e))}</div>`:p;return o`${l(i,"cost_parts_booked")}${l(n,"cost_parts_info")}`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=`${Wt()}:00`}render(){if(!this._open)return o``;let e=this.lang||H(this.hass),t=this._error||this._photos.errorText(e);return o`
      <ha-dialog open .headerTitle=${le(`${s("complete_title",e)}${this.taskName}`)} @closed=${this._close}>
        ${de(`${s("complete_title",e)}${this.taskName}`)}
        ${this.phaseLabel?o`<div class="phase-line">${s("phase_current",e)}: ${this.phaseLabel}</div>`:p}
        ${this.requireTagScan&&!this.viaTagScan?o`<div class="scan-required-note">${s("require_tag_scan_hint",e)}</div>`:p}
        <div class="content">
          ${t?P("error",t):p}
          ${this.checklist.length>0?o`
            <div class="checklist-section">
              <label class="checklist-label">${s("checklist",e)}</label>
              ${this.checklist.map((i,n)=>o`
                ${S({cls:"checklist-item",checked:!!this._checklistState[String(n)],onChange:()=>this._toggleCheck(n)},o`<span>${i}</span>`)}
              `)}
            </div>
          `:p}
          ${this.readings.length>0?o`<div class="readings-block">
                <span class="field-label">${s("readings_section",e)}</span>
                ${this.readings.map(i=>this._renderReadingField(i,e))}
              </div>`:this.taskType==="reading"?o`
              <label class="field">
                <span class="field-label">${s("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${i=>this._readingValue=i.target.value} />
              </label>`:p}
          ${this.parts.length?o`<div class="used-parts">
                <span class="field-label">${s("complete_parts_used",e)}</span>
                ${this.parts.map(i=>{let n=G({part_id:i.id,entry_id:i.entry_id}),l=this._usedParts[n],d=l!==void 0,u=i.entry_id?{part_id:i.id,quantity:1,entry_id:i.entry_id}:{part_id:i.id,quantity:1};return o`<div class="used-part-row">
                    ${S({cls:"used-part-check",checked:d,onChange:_=>{let g={...this._usedParts};if(_.target.checked)g[n]=g[n]||u;else{delete g[n];let f={...this._usedQtyText};delete f[n],this._usedQtyText=f}this._usedParts=g}},o`<span
                        >${i.name}${i.owner_name?o`<span class="used-part-owner"> (${i.owner_name})</span>`:p}${i.stock!==null&&i.stock!==void 0?` (${fe(i.stock,i.unit,e)})`:""}</span
                      >`)}
                    ${d?o`<input class="used-part-qty" type="number" min=${Ie[0]} max=${Ie[1]} step="0.01"
                          .value=${this._usedQtyText[n]??String(l.quantity)}
                          @input=${_=>{let g=_.target.value;this._usedQtyText={...this._usedQtyText,[n]:g};let f=parseFloat(g.replace(",","."));Number.isFinite(f)&&f>=Ie[0]&&(this._usedParts={...this._usedParts,[n]:{...u,quantity:f}})}} />`:p}
                  </div>`})}
              </div>`:this.consumesInfo.length?o`<div class="consumes-hint">
                  ${this.consumesInfo.map(i=>o`<div>${i}</div>`)}
                </div>`:p}
          ${this.restockDefault!==null?o`
              <label class="field">
                <span class="field-label">${s("restock_quantity_label",e)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
                <input type="number" step="0.01" min=${ke[0]} max=${ke[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${i=>this._restockQty=i.target.value} />
              </label>`:p}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${this._demands("notes")?s("notes_label",e):s("notes_optional",e)}${this._req("notes")}</span>
            <!-- Several lines (#202): what was done, one line each. The
                 history and the printouts keep the line breaks; they show
                 notes as plain text, so no Markdown hint here. -->
            <textarea class="field-input notes-input" rows="3"
              .value=${this._notes}
              @input=${i=>this._notes=i.target.value}></textarea>
          </label>
          <div class="field">
            <span class="field-label">${this._demands("cost")?s("cost",e):s("cost_optional",e)}${this._req("cost")}</span>
            <ms-cost-input .lang=${e} .value=${this._cost}
              @value-changed=${i=>this._cost=i.detail.value}></ms-cost-input>
            ${this._renderCostSuggestion(e)}
          </div>
          <label class="field">
            <span class="field-label">${this._demands("duration")?s("quick_complete_defaults_duration",e):s("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="1" min="0" inputmode="numeric" class="field-input"
              .value=${this._duration}
              @input=${i=>this._duration=i.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${s("completed_at_optional",e)}</span>
            ${this._completedAt?o`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  .helper=${Ve(e)}
                  @value-changed=${i=>this._completedAt=i.detail.value}
                ></ms-date-field>`:o`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${s("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${this._demands("photo")?s("completion_photos",e):s("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?o`<div class="photo-strip">
                  ${this._photos.photos.map(i=>o`
                    <div class="photo-preview">
                      <img src=${i.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(i.id)}
                        title="${s("remove",e)}">✕</button>
                    </div>`)}
                </div>`:p}
            ${this._photos.full?o`<div class="photo-limit">${s("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:o`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${i=>this._photos.addFiles(i.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?o`
            <div class="feedback-section">
              <label class="feedback-label">${s("was_maintenance_needed",e)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${s("feedback_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${s("feedback_not_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${s("feedback_not_sure",e)}</button>
              </div>
            </div>
          `:p}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?s("uploading",e):this._missingRequired.length?this._missingRequired.map(i=>s("err_required",e).replace("{field}",s(Te[i]??i,e))).join(" \xB7 "):""}
          >
            ${this._loading?s("completing",e):s("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};b.styles=[$e,ct,k`
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
  `],c([y({attribute:!1})],b.prototype,"hass",2),c([y()],b.prototype,"entryId",2),c([y()],b.prototype,"taskId",2),c([y()],b.prototype,"taskName",2),c([y()],b.prototype,"lang",2),c([y({type:Array})],b.prototype,"checklist",2),c([y({type:Boolean})],b.prototype,"adaptiveEnabled",2),c([y()],b.prototype,"taskType",2),c([y()],b.prototype,"readingUnit",2),c([y({attribute:!1})],b.prototype,"readings",2),c([y({attribute:!1})],b.prototype,"readingHistory",2),c([y({attribute:!1})],b.prototype,"restockDefault",2),c([y({attribute:!1})],b.prototype,"restockUnitCost",2),c([y({attribute:!1})],b.prototype,"restockPackage",2),c([y()],b.prototype,"currencySymbol",2),c([y({attribute:!1})],b.prototype,"partsCostMode",2),c([y({attribute:!1})],b.prototype,"parts",2),c([y({attribute:!1})],b.prototype,"consumesParts",2),c([y({type:Array})],b.prototype,"consumesInfo",2),c([y({type:Array})],b.prototype,"requiredFields",2),c([y()],b.prototype,"phaseLabel",2),c([y({type:Boolean})],b.prototype,"requireTagScan",2),c([y({type:Boolean})],b.prototype,"viaTagScan",2),c([h()],b.prototype,"_open",2),c([h()],b.prototype,"_notes",2),c([h()],b.prototype,"_cost",2),c([h()],b.prototype,"_duration",2),c([h()],b.prototype,"_loading",2),c([h()],b.prototype,"_error",2),c([h()],b.prototype,"_checklistState",2),c([h()],b.prototype,"_feedback",2),c([h()],b.prototype,"_readingValue",2),c([h()],b.prototype,"_readingValues",2),c([h()],b.prototype,"_restockQty",2),c([h()],b.prototype,"_completedAt",2),c([h()],b.prototype,"_usedParts",2),c([h()],b.prototype,"_usedQtyText",2),c([y({attribute:!1})],b.prototype,"checklistPrefill",2),c([y({attribute:!1})],b.prototype,"prefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",b);var Ce=k`
  ${dt}
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
`;function kr(r,a){r.key!=="Escape"||r.defaultPrevented||r.composedPath().some(e=>e instanceof Element&&e.localName==="ms-camera-capture")||(r.preventDefault(),r.stopPropagation(),a())}function he(){return we("ha-adaptive-dialog")}function Ae(r,a,e={}){return he()?o`
      <ha-adaptive-dialog open .headerTitle=${e.title}
        @closed=${t=>{t.target===t.currentTarget&&r()}}>
        <div class="ha-shell-body">${a}</div>
      </ha-adaptive-dialog>
    `:o`
    <div class="modal-layer top-layer" popover="manual" ${lt}>
      <div class="backdrop" @click=${r}></div>
      <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
        @keydown=${t=>kr(t,r)}>${a}</div>
    </div>
  `}function Re(r){r?.querySelector(".dialog")?.focus({preventScroll:!0})}function Xi(r,a,e){let t=new Blob([r],{type:e}),i=URL.createObjectURL(t),n=document.createElement("a");n.href=i,n.download=a,n.target="_blank",n.rel="noopener",n.style.display="none",document.body.appendChild(n),n.dispatchEvent(new MouseEvent("click")),document.body.removeChild(n),setTimeout(()=>URL.revokeObjectURL(i),6e4)}async function wr(r,a,e=300){return(await r.connection.sendMessagePromise({type:"auth/sign_path",path:a,expires:e})).path}async function es(r,a,e=300){return wr(r,`/api/maintenance_supporter/document/${a}`,e)}var oe=class extends C{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await es(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?p:this._url?o`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:o`<div class="ph"></div>`}};oe.styles=k`
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
  `,c([y({attribute:!1})],oe.prototype,"hass",2),c([y()],oe.prototype,"docId",2),c([h()],oe.prototype,"_url",2),c([h()],oe.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",oe);var F=class extends C{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new Se(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return H(this.hass)}openEdit(e){this._openGen++,this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(e.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(e),this._loadPartOptions()}_seedReadings(e){let t=[],i=new Set;for(let l of e.readings??[])i.has(l.id)||(i.add(l.id),t.push({id:l.id,name:l.name,unit:l.unit??null}));for(let l of e.reading_values??[])i.has(l.id)||(i.add(l.id),t.push({id:l.id,name:l.name,unit:l.unit??null}));this._readingRows=t;let n={};for(let l of e.reading_values??[])n[l.id]=String(l.value);this._readingText=n,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let e={};for(let t of this._readingRows){let i=(this._readingText[t.id]??"").trim();if(i==="")continue;let n=parseFloat(i.replace(",","."));isNaN(n)||(e[t.id]=n)}return e}async _loadPartOptions(){let e=this._draft;if(!e)return;let t=this._openGen;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(t!==this._openGen)return;let n=[];for(let d of i.parts||[]){let u=d.entry_id===e.entry_id,_=d.consumers.some(g=>g.entry_id===e.entry_id&&g.task_id===e.task_id);!u&&!_||n.push({part_id:d.part_id,name:d.name,entry_id:d.entry_id,foreign:!u,object_name:d.object_name})}for(let d of e.used_parts||[]){let u=d.entry_id||e.entry_id;n.some(_=>_.part_id===d.part_id&&_.entry_id===u)||n.push({part_id:d.part_id,name:d.name||d.part_id,entry_id:u,foreign:u!==e.entry_id,object_name:null})}let l={};for(let d of e.used_parts||[])l[`${d.entry_id||e.entry_id}:${d.part_id}`]=d.quantity??1;this._partOptions=n,this._partQty=l,this._partQtyOriginal=this._partSelectionKey()}catch{if(t!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,e])=>e>0).sort(([e],[t])=>e.localeCompare(t)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let e=this._lang,i=(this._originalSnapshot.used_parts||[]).filter(u=>u.quantity>0).map(u=>`${x(u.quantity,e)}\xD7 ${u.name||u.part_id}`).join(", ");if(!await Le(this.hass,{title:s("history_delete_entry",e),message:i?`${s("history_delete_confirm_entry",e)} ${s("history_delete_returns_parts",e).replace("{parts}",i)}`:s("history_delete_confirm_entry",e),confirmText:s("delete",e),danger:!0})||!this._draft||!this._originalSnapshot)return;let l=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:l.entry_id,task_id:l.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:l.entry_id,task_id:l.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(e){return R(this,e,{busy:t=>{this._saving=t},onError:t=>{this._error=t}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let e=this._draft,t=this._originalSnapshot,i={type:"maintenance_supporter/task/history/update",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:t.original_timestamp};if(e.timestamp!==t.timestamp&&(i.timestamp=e.timestamp),e.notes!==t.notes&&(i.notes=e.notes),e.cost!==t.cost&&(i.cost=e.cost),e.duration!==t.duration&&(i.duration=e.duration),e.completed_by!==t.completed_by&&(i.completed_by=e.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(i.used_parts=(this._partOptions||[]).filter(l=>(this._partQty[`${l.entry_id}:${l.part_id}`]||0)>0).map(l=>({part_id:l.part_id,quantity:this._partQty[`${l.entry_id}:${l.part_id}`],...l.foreign?{entry_id:l.entry_id}:{}}))),e.reading_value!==t.reading_value&&(i.reading_value=e.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let l=this._readingNumbers(),d={};for(let u of this._readingRows)d[u.id]=l[u.id]??null;i.reading_values=d}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(i.photo_doc_ids=this._photos.ids),Object.keys(i).filter(l=>!["type","entry_id","task_id","original_timestamp"].includes(l)).length===0){this.close();return}await this._runWs(i)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:e.entry_id,task_id:e.task_id,new_timestamp:e.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return p;let e=this._lang,t=this._draft,i=this._error||this._photos.errorText(e);return Ae(()=>this.close(),o`
        ${he()?p:o`<h2>${s("history_edit_title",e)}</h2>`}
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${s(t.type,e)||t.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${e}
          .label=${s("history_edit_timestamp",e)}
          .helper=${Ve(e)}
          .value=${Bt(t.timestamp)}
          @value-changed=${n=>{let l=n.detail.value;l&&this._set("timestamp",l)}}
        ></ms-date-field>
        <label>
          <span>${s("notes_label",e)}</span>
          <textarea
            rows="3"
            @input=${n=>{let l=n.target.value;this._set("notes",l||null)}}
            .value=${t.notes??""}></textarea>
        </label>
        <div class="row">
          <div class="cost-field">
            <span>${s("cost",e)}</span>
            <ms-cost-input .lang=${e} .value=${t.cost!=null?String(t.cost):""}
              @value-changed=${n=>{let l=n.detail.value;this._set("cost",l?Number(l):null)}}></ms-cost-input>
          </div>
          <label>
            <span>${s("duration",e)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${t.duration!=null?String(t.duration):""}
              @input=${n=>{this._set("duration",ce(n.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(t,e)}
        ${this._partOptions&&this._partOptions.length>0?o`
          <div class="parts-block">
            <span class="parts-title">${s("complete_parts_used",e)}</span>
            ${this._partOptions.map(n=>{let l=`${n.entry_id}:${n.part_id}`,d=this._partQty[l]||0;return o`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${d>0}
                    @change=${u=>{let _=u.target.checked;this._partQty={...this._partQty,[l]:_?1:0}}} />
                  <span class="part-label">${n.name}${n.foreign&&n.object_name?` (${n.object_name})`:""}</span>
                  ${d>0?o`
                    <input class="part-qty" type="number" min=${ne[0]} max=${ne[1]} step="0.01"
                      .value=${String(d)}
                      @input=${u=>{let _=parseFloat(u.target.value);!isNaN(_)&&_>0&&(this._partQty={...this._partQty,[l]:_})}} />
                  `:p}
                </label>
              `})}
          </div>
        `:p}
        <div class="photos-block">
          <span class="parts-title">${s("completion_photos",e)}</span>
          ${this._photos.photos.length>0?o`
            <div class="photo-strip">
              ${this._photos.photos.map(n=>o`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${n.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${s("remove",e)}
                    @click=${()=>this._photos.remove(n.id)}>✕</button>
                </div>`)}
            </div>`:p}
          ${this._photos.full?o`<span class="photos-hint">${s("photos_limit",e).replace("{max}",String(this._photos.max))}</span>`:o`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${n=>this._photos.addFiles(n.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${s("history_edit_photos_hint",e)}</span>
        </div>
        ${i?P("error",i):p}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${s("history_delete_entry",e)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${s("history_delete_entry",e)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${s("cancel",e)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving||this._photos.uploading}
            title=${this._photos.uploading?s("uploading",e):""}>
            ${this._saving?s("saving",e):s("save",e)}
          </button>
        </div>
    `,{title:s("history_edit_title",e)})}updated(e){e.has("_open")&&this._open&&Re(this.shadowRoot)}_renderReadings(e,t){return this._readingRows.length>0?o`
        <div class="readings-block">
          <span class="parts-title">${s("readings_section",t)}</span>
          ${this._readingRows.map(i=>o`
            <label class="reading-row-edit">
              <span class="reading-row-name">${i.name}${i.unit?` (${i.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[i.id]??""}
                @input=${n=>{this._readingText={...this._readingText,[i.id]:n.target.value}}} />
            </label>
          `)}
        </div>`:e.reading_value==null&&e.task_type!=="reading"?p:o`
      <label>
        <span>${s("reading_value_label",t)}${e.reading_unit?` (${e.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${e.reading_value!=null?String(e.reading_value):""}
          @input=${i=>{let n=i.target.value,l=n===""?NaN:Number(n);this._set("reading_value",isNaN(l)?null:l)}} />
      </label>`}};F.styles=[ct,Ce,k`
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
  `],c([y({attribute:!1})],F.prototype,"hass",2),c([h()],F.prototype,"_open",2),c([h()],F.prototype,"_saving",2),c([h()],F.prototype,"_error",2),c([h()],F.prototype,"_draft",2),c([h()],F.prototype,"_partOptions",2),c([h()],F.prototype,"_partQty",2),c([h()],F.prototype,"_readingRows",2),c([h()],F.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",F);function Ct(r){return!r.startsWith("data:image/svg+xml,")&&!r.startsWith("data:image/png;base64,")?"":re(r)}function Er(r){return r.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var D=class extends C{constructor(){super(...arguments);this.lang="";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._quickResult=null;this._quickValues=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}get _dialogLang(){return this.lang||H(this.hass)}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}openForTask(e,t,i,n){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=n,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._quickValues=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...t,action:"view"})];if(this._taskId){if(i.push(this.hass.connection.sendMessagePromise({...t,action:"complete"})),this._quickValues=await this._quickCompleteValues(),e!==this._generateSeq)return;this._quickValues&&i.push(this.hass.connection.sendMessagePromise({...t,action:"quick_complete"}))}let n=await Promise.all(i);if(e!==this._generateSeq)return;this._viewResult=n[0],n.length>1&&(this._completeResult=n[1]),n.length>2&&(this._quickResult=n[2])}catch(t){if(e!==this._generateSeq)return;let i=t?.code,n=t?.message;this._error=i==="no_url"||typeof n=="string"&&n.includes("No Home Assistant URL")?s("qr_error_no_url",this._dialogLang):s("qr_error",this._dialogLang)}finally{e===this._generateSeq&&(this._loading=!1)}}async _quickCompleteValues(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});return et((e.tasks||[]).find(t=>t.id===this._taskId))}catch{return null}}_quickRecords(e){let t=this._quickValues??{},i=[t.notes?`\u201C${t.notes.length>40?`${t.notes.slice(0,39)}\u2026`:t.notes}\u201D`:"",t.cost!=null?`${s("quick_complete_defaults_cost",e)} ${B(t.cost,void 0,e)}`:"",t.duration!=null?ye(t.duration,e):""].filter(Boolean);return i.length?s("qr_quick_records",e).replace("{values}",i.join(", ")):s("qr_quick_records_nothing",e)}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),n=window.open("","_blank","width=600,height=500");if(!n)return;let l=this._dialogLang,d=re(t),u=re(i),_=!!this._completeResult,g=!!this._quickResult,f=re(s("qr_action_view",l)),v=re(s("qr_action_complete",l)),$=re(s("qr_action_quick_complete",l));n.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${d}</title>
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
  .qr-col img{width:${g?"170px":_?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${d}</h2>
${u?`<div class="sub">${u}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${Ct(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${f}</div>
  </div>
  ${_?`<div class="qr-col">
    <img src="${Ct(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${v}</div>
  </div>`:""}
  ${g?`<div class="qr-col">
    <img src="${Ct(this._quickResult.svg_data_uri)}" alt="QR Quick-complete" />
    <div class="qr-label">${$}</div>
  </div>`:""}
</div>
<div class="url">${re(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),n.document.close()}_downloadSvg(e,t){let i=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),n=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;Xi(i,`qr-${Er(n)}-${t}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._quickResult=null,this._error="",this._loading=!1}render(){if(!this._open)return o``;let e=this._dialogLang,t=this._taskName?`${s("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",e)}: ${this._objectName}`,i=!!this._viewResult;return o`
      <ha-dialog open .headerTitle=${le(t)} @closed=${this._close}>
        ${de(t)}
        <div class="content">
          ${this._loading?o`<div class="loading">${s("qr_generating",e)}</div>`:this._error?P("error",this._error):i?o`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${s("qr_action_view",e)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${s("qr_download",e)}
                        </button>
                      </div>
                      ${this._completeResult?o`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${s("qr_action_complete",e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${s("qr_download",e)}
                              </button>
                            </div>
                          `:p}
                      ${this._quickResult?o`
                            <div class="qr-item quick">
                              <img
                                class="qr-image small"
                                src="${this._quickResult.svg_data_uri}"
                                alt="QR Quick-complete"
                              />
                              <div class="qr-item-label">${s("qr_action_quick_complete",e)}</div>
                              <div class="qr-quick-records">${this._quickRecords(e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._quickResult,"quick-complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${s("qr_download",e)}
                              </button>
                            </div>
                          `:p}
                    </div>
                    ${this._taskId&&!this._quickResult?o`<div class="qr-quick-off">${s("qr_quick_complete_off",e)}</div>`:p}
                    <div class="url-display">${this._viewResult.url}</div>
                  `:p}
          <div class="action-row">
            <label>${s("qr_url_mode",e)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${s("qr_mode_companion",e)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${s("qr_mode_local",e)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${s("qr_mode_server",e)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!i}
          >
            ${s("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};D.styles=k`
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
  `,c([y({attribute:!1})],D.prototype,"hass",2),c([y()],D.prototype,"lang",2),c([h()],D.prototype,"_open",2),c([h()],D.prototype,"_loading",2),c([h()],D.prototype,"_error",2),c([h()],D.prototype,"_viewResult",2),c([h()],D.prototype,"_completeResult",2),c([h()],D.prototype,"_quickResult",2),c([h()],D.prototype,"_quickValues",2),c([h()],D.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",D);function ts(r,a,e=new Date){let t=r?.hours,i=J(r?.snoozed_until);if(typeof t!="number"||!Number.isFinite(i))return s("snoozed",a);let n=ft(),d=Ue(i,n)===Ue(e,n)?vt(new Date(i),a):Be(r.snoozed_until,a);return We("snoozed_for","snoozed_for_one",t,a,"hours").replace("{until}",d)}function Tr(r,a){if(a<=0)return 0;let e=typeof r=="number"&&Number.isFinite(r)?Math.trunc(r):0;return e<0?0:e%a}function Sr(r){return!!(r?.phases&&r.phase_sequence&&r.phase_sequence.length>0)}function At(r){if(!r||!Sr(r))return null;let a=r.phase_sequence,e=Tr(r.phase_cursor,a.length),t=a[e],i=r.phases?.[t];return i?{id:t,name:i.name,index:e,count:a.length,notes:i.notes,checklist:i.checklist!==void 0?i.checklist:r.checklist??[],consumesParts:i.consumes_parts!==void 0?i.consumes_parts:r.consumes_parts??[],requiredFields:i.required_completion_fields!==void 0?i.required_completion_fields:r.required_completion_fields??[]}:null}function Fe(r){let a=At(r);return a?`${a.index+1}/${a.count} \xB7 ${a.name}`:""}function Ir(r,a){return typeof r=="number"&&Number.isFinite(r)&&r>=.01?r:a}function is(r){let a=r.task??null,e=a?At(a):null,t=e?e.consumesParts:a?.consumes_parts||[],i=!!a?.part_ref,n=r.objects.find(f=>f.entry_id===r.entryId),l=n?.parts||[],d=i?l.find(f=>f.id===a.part_ref.part_id):void 0,u=r.features?r.features.checklists:r.checklistsEnabled??!0,_=r.features?r.features.checklists?r.checklist??a?.checklist??[]:[]:r.checklist??[],g=r.features?r.features.adaptive&&(r.adaptiveEnabled??!!a?.adaptive_config?.enabled):!!r.adaptiveEnabled;return{entry_id:r.entryId,task_id:r.taskId,task_name:r.taskName,checklist:e?u?e.checklist:[]:_,adaptive_enabled:g,required_completion_fields:e?e.requiredFields:a?.required_completion_fields||[],task_type:a?.type||"",reading_unit:a?.reading_unit||"",readings:a?.readings||[],reading_history:Gt(a?.history),parts:i?[]:wi({consumes_parts:t},r.entryId,r.objects,r.lang),consumes_parts:i?[]:t,phase_label:e?Fe(a):"",require_tag_scan:!!a?.require_tag_scan,restock_default:i?Ir(d?.restock_quantity,1):null,restock_unit_cost:i?d?.cost??null:null,restock_package:i&&d?.package_size?fe(d.package_size,d.unit,r.lang):"",currency_symbol:He({currency_symbol:r.currencySymbol}),consumes_info:t.map(f=>ki(f,r.entryId,r.objects,r.lang)),checklist_prefill:a?.checklist_progress||{},via_tag_scan:!!r.viaTagScan,parts_cost_mode:i?Ge(d,r.partsCostMode??"purchase",!!n?.object.battery_fleet):r.partsCostMode??"purchase",prefill:et(a)}}function ss(r,a,e){r.entryId=a.entry_id,r.taskId=a.task_id,r.taskName=a.task_name,r.lang=e,r.checklist=a.checklist??[],r.adaptiveEnabled=!!a.adaptive_enabled,r.requiredFields=a.required_completion_fields??[],r.taskType=a.task_type??"",r.readingUnit=a.reading_unit??"",r.readings=a.readings??[],r.readingHistory=a.reading_history??[],r.parts=a.parts??[],r.consumesParts=a.consumes_parts??[],r.phaseLabel=a.phase_label??"",r.requireTagScan=!!a.require_tag_scan,r.restockDefault=a.restock_default??null,r.restockUnitCost=a.restock_unit_cost??null,r.restockPackage=a.restock_package??"",r.currencySymbol=He(a),r.consumesInfo=a.consumes_info??[],r.checklistPrefill=a.checklist_prefill??{},r.viaTagScan=!!a.via_tag_scan,r.partsCostMode=a.parts_cost_mode??"purchase",r.prefill=a.prefill??null,r.open({viaTagScan:!!a.via_tag_scan})}var Cr=new Set(["about","blob","data","file","filesystem","javascript","livescript","ms-appinstaller","ms-cxh","ms-cxh-full","ms-msdt","ms-officecmd","search","search-ms","view-source","vbscript"]);function Rt(r){return r.replace(/[\t\n\r]/g,"").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g,"")}function qt(r){let a=/^([a-z][a-z0-9+.-]+):/i.exec(Rt(r||""));return a?a[1].toLowerCase():null}function pt(r){let a=qt(r);return a!==null&&!Cr.has(a)}function rs(r){return!!r&&/^https?:\/\//i.test(r)}function ht(r){if(!r)return p;if(customElements.get("ha-markdown")){let{content:a,links:e}=qr(r);return o`<ha-markdown
      class="notes-md"
      .content=${a}
      breaks
      ${Ke(t=>Pr(t,e))}
    ></ha-markdown>`}return o`${r}`}var Ht="https://app-link.invalid/",Ar=new Set(["http","https","mailto","tel","ftp"]),Rr=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/,ut="[a-zA-Z][a-zA-Z0-9+.-]+:";function qr(r){let a=[],e=n=>{let l=qt(n);return!l||Ar.has(l)||!pt(n)?null:(a.push(Rt(n)),`${Ht}${a.length-1}`)},t=n=>n.replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)<(${ut}[^>\\n]*)>`,"g"),(l,d,u,_)=>{let g=d?null:e(_);return g?`${u}${g}`:l}).replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)(${ut}[^\\s)]*)`,"g"),(l,d,u,_)=>{let g=d?null:e(_);return g?`${u}${g}`:l}).replace(new RegExp(`(^|[^(])<(${ut}[^\\s<>]*)>`,"gm"),(l,d,u)=>{let _=e(u);return _?`${d}[${u.replace(/([\\[\]])/g,"\\$1")}](${_})`:l}).replace(new RegExp(`^( {0,3}\\[[^\\]\\n]+\\]:[ \\t]*)<?(${ut}[^\\s>]*)>?`,"gm"),(l,d,u)=>{let _=e(u);return _?`${d}${_}`:l});return{content:r.split(Rr).map((n,l)=>l%2?n:t(n)).join(""),links:a}}function Pt(r,a){for(let e of r.querySelectorAll(`a[href^="${Ht}"]`)){let t=a[Number(e.getAttribute("href").slice(Ht.length))];t&&e.setAttribute("href",t)}}var ns=new WeakMap;function Pr(r,a){if(!r)return;let e=ns.get(r);if(!e&&a.length===0)return;if(e){e.links=a,r.shadowRoot&&Pt(r.shadowRoot,a);return}let t={links:a};ns.set(r,t),(async()=>{await r.updateComplete;let i=r.shadowRoot;i&&(new MutationObserver(()=>Pt(i,t.links)).observe(i,{childList:!0,subtree:!0}),Pt(i,t.links))})()}var as=r=>typeof r=="number"&&Number.isInteger(r)&&r>0;function Hr(r){return r&&as(r.ref_no)?String(r.ref_no):null}function os(r,a){let e=Hr(r);return e&&a&&as(a.ref_no)?`${e}.${a.ref_no}`:null}function ls(r,a){return r?o`<span class="ref-chip" title=${a??""}>#${r}</span>`:p}var Or={"Completed from dashboard button":"hist_note_button","Auto-completed: sensor recovered":"hist_note_auto_recovered_plain","Completed from the To-do list":"hist_note_todo","Completed by voice":"hist_note_voice","Completed from the notification":"hist_note_notification","Completed via NFC tag":"hist_note_nfc","Completed from the shopping list":"hist_note_shopping_list","Completed from a mirrored to-do list":"hist_note_todo_mirror","Skipped from notification":"hist_note_skipped_notification","Skipped from dashboard button":"hist_note_skipped_button","Sensor trigger activated":"hist_note_sensor_triggered","Initial value set during task creation":"hist_note_initial"},Nr=[[/^Auto-completed: sensor recovered \((.+)\)$/,"hist_note_auto_recovered",r=>({value:r[1]})],[/^Auto-completed: (.+) changed to (.+)$/,"hist_note_auto_entity",r=>({entity:r[1],state:r[2]})],[/^Reset to (\d{4}-\d{2}-\d{2})$/,"hist_note_reset",(r,a)=>({date:L(r[1],a)})],[/^Trigger entity replaced: (.+) → (.+)$/,"hist_note_trigger_replaced",r=>({old:r[1],new:r[2]})],[/^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,"hist_note_trigger_removed",(r,a)=>({entity:r[1],schedule:s(r[2],a)})],[/^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,"hist_note_compound_removed",r=>({entity:r[1],count:r[2]})]];function ds(r,a){if(!r)return"";let e=Or[r.trim()];if(e)return s(e,a);for(let[t,i,n]of Nr){let l=r.trim().match(t);if(l){let d=n(l,a);return s(i,a).replace(/\{(\w+)\}/g,(u,_)=>d[_]??u)}}return r}function cs(r){let a=e=>{let t=J(e.timestamp);return Number.isNaN(t)?-1/0:t};return(r??[]).map((e,t)=>({entry:e,index:t,at:a(e)})).sort((e,t)=>t.at-e.at||t.index-e.index).map(e=>e.entry)}function Lr(r,a){return r.taskRef&&a.ref_no?`${r.taskRef}-${a.ref_no}`:null}function Dr(r,a){let e=gt(a);return e.length>0?o`<div class="history-photos">
        ${e.map(t=>o`<maintenance-history-photo .hass=${r} .docId=${t}></maintenance-history-photo>`)}
      </div>`:p}function Fr(r,a){let e=a.lang,t=l=>x(l,e,{maximumFractionDigits:3}),i=l=>l==null?"":` (${l>=0?"+":""}${t(l)})`,n=Qt(r);return n.length>0?o`<div class="history-readings">
      ${n.map(l=>o`<span class="history-reading">
        <span class="history-reading-name">${l.name}</span>
        <span class="history-reading-value">${t(l.value)}${l.unit?` ${l.unit}`:""}${i(a.readingSlotDelta?.(r,l.id))}</span>
      </span>`)}
    </div>`:r.reading_value!=null?o`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${s("reading_label",e)}</span>
      <span class="history-reading-value">${t(r.reading_value)}${a.readingUnit?` ${a.readingUnit}`:""}${i(a.readingDelta?.(r))}</span>
    </span></div>`:p}function ps(r,a,e={}){let t=a.lang,{compact:i=!1,showRef:n=!0,showBadges:l=!0,showEdit:d=!0}=e,u=a.openEdit,_=d&&!!u&&Dt.includes(r.type),g=typeof r.parts_cost=="number"?r.parts_cost:null,f=r.cost_basis==="use",v=f&&!!r.purchase;return o`
    <div class="history-entry${i?" compact":""}">
      ${i?p:o`<div class="history-icon ${r.type}" style="background: ${Ft(r.type)}">
            <ha-icon .icon=${ze[r.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${s(r.type,t)}</strong>
          ${n?ls(Lr(a,r),s("ref_number",t)):p}
          ${l&&r.phase_id?o`<span class="history-phase-badge">${a.phaseNames?.[r.phase_id]||r.phase_id}</span>`:p}
          ${l&&r.auto?o`<span class="history-auto-badge">${s("history_auto",t)}</span>`:p}
          ${_?o`<button class="history-edit-btn"
                     title=${s("history_edit_button",t)}
                     @click=${()=>u(r)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:p}
        </div>
        <div class="history-date">${Be(r.timestamp,t)}</div>
        ${r.notes?o`<div class="history-notes">${ds(r.notes,t)}</div>`:p}
        ${Dr(a.hass,r)}
        ${Fr(r,a)}
        ${r.cost!=null||r.duration!=null||r.trigger_value!=null||g!=null?o`<div class="history-details">
              ${r.cost!=null?v?o`<span>${s("history_purchase_stock",t).replace("{amount}",B(r.cost,a.currencySymbol,t))}</span>`:r.cost<0?o`<span class="history-credit">${si(r.cost,a.currencySymbol,t)}</span>`:o`<span>${s("cost",t)}: ${B(r.cost,a.currencySymbol,t)}</span>`:p}
              ${g!=null?o`<span title=${s(f?"history_parts_counted_hint":"history_parts_info_hint",t)}>${s(f?"history_parts_counted":"history_parts_info",t).replace("{amount}",B(g,a.currencySymbol,t))}</span>`:p}
              ${r.duration!=null?o`<span>${s("duration",t)}: ${ye(r.duration,t)}</span>`:p}
              ${r.trigger_value!=null?o`<span>${s("trigger_val",t)}: ${r.trigger_value}</span>`:p}
            </div>`:p}
      </div>
    </div>
  `}var jr="var(--maint-done-color, #78909c)",zr="var(--secondary-text-color, #727272)";function je(r){if(r.archived)return"archived";if(r.is_done)return"done";let a=r.status||"ok";return a==="ok"&&r.schedule_type==="manual"&&r.days_until_due==null?"no_due":a}var Ur={done:"completed",no_due:"no_due_date"};function Ot(r,a){return s(Ur[r]??r,a)}function _t(r){let a=je(r);return a==="done"?jr:a==="no_due"?zr:Lt[a]||"var(--disabled-color, #9e9e9e)"}function Wr(r){return r==="no_due"?"mdi:calendar-blank-outline":ze[r==="done"?"completed":r]||"mdi:circle-medium"}function us(r,a,e="pill"){let t=je(r),i=Ot(t,a);return e==="chip"?o`<span class="status-chip ${t}">${i}</span>`:o`<span class="status-badge ${t}" role="img" title="${i}" aria-label="${i}"><ha-icon icon="${Wr(t)}"></ha-icon><span class="status-label">${i}</span></span>`}async function hs(r,a,e){if(!r)return null;let t={title:s("delete",e),confirmText:s("delete",e),danger:!0};if(!a?.part_ref)return await r.confirm({...t,message:s("delete_task_confirm",e)})?{}:null;let i=await r.confirmWithCheck({...t,message:s("delete_buy_task_confirm",e),check:s("delete_buy_task_off",e)});return i.confirmed?i.checked?{disable_auto_buy_task:!0}:{}:null}var mt=class{constructor(){this._handle=null}schedule(a,e=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,a()},e)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}};function w(r){return r.toFixed(1)}function _s(r,a){let e=r.interval_analysis,t=e?.weibull_beta,i=e?.weibull_eta;if(t==null||i==null||i<=0)return p;let n=r.interval_days??0,l=r.suggested_interval??n;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",a)}
        ${Br(t,a)}
      </div>
      ${Vr(t,i,n,l,a)}
      ${Kr(e,a)}
      ${e?.confidence_interval_low!=null?Qr(e,r,a):p}
    </div>
  `}function Br(r,a){let e,t,i;return r<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):r<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):r<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),o`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${s(i,a)} (\u03B2=${x(r,a,2)})
    </span>
  `}function Vr(r,a,e,t,i){let $=Math.max(e,t,a,1)*1.3,T=50,M=[];for(let W=0;W<=T;W++){let Q=W/T*$,Cs=1-Math.exp(-Math.pow(Q/a,r)),As=32+Q/$*260,Rs=136-Cs*128;M.push([As,Rs])}let j=M.map(([W,Q])=>`${w(W)},${w(Q)}`).join(" "),Y="M32,136 "+M.map(([W,Q])=>`L${w(W)},${w(Q)}`).join(" ")+` L${w(M[T][0])},136 Z`,K=32+e/$*260,Z=1-Math.exp(-Math.pow(e/a,r)),_e=136-Z*128,Ss=x((1-Z)*100,i,0),Mt=32+t/$*260,Is=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",i)}">
        ${Is.map(W=>{let Q=136-W*128;return me`
            <line x1="${32}" y1="${w(Q)}" x2="${292}" y2="${w(Q)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${W===.5?"4,3":p}" />
            <text x="${28}" y="${w(Q+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${x(W*100,i,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round($/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round($)}</text>

        <path d="${Y}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${j}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?me`
          <line x1="${w(K)}" y1="${8}" x2="${w(K)}" y2="${w(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${w(K)}" cy="${w(_e)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${w(K+4)}" y="${w(_e-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Ss}%</text>
        `:p}

        ${t>0&&t!==e?me`
          <line x1="${w(Mt)}" y1="${8}" x2="${w(Mt)}" y2="${w(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:p}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",i)}</span>
      ${e>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",i)}</span>`:p}
      ${t>0&&t!==e?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",i)}</span>`:p}
    </div>
  `}function Kr(r,a){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",a)}</span>
        <span class="weibull-info-value">${ve(Math.round(r.weibull_eta),a)}</span>
      </div>
      ${r.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",a)}</span>
          <span class="weibull-info-value">${x(r.weibull_r_squared,a,3)}</span>
        </div>
      `:p}
    </div>
  `}function Qr(r,a,e){let t=r.confidence_interval_low,i=r.confidence_interval_high,n=a.suggested_interval??a.interval_days??0,l=a.interval_days??0,d=Math.max(0,t-5),_=i+5-d,g=(t-d)/_*100,f=(i-t)/_*100,v=(n-d)/_*100,$=l>0?(l-d)/_*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",e)}: ${ve(n,e)} (${t}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${w(g)}%;width:${w(f)}%"></div>
        ${$>=0?o`<div class="confidence-marker current" style="left:${w($)}%"></div>`:p}
        <div class="confidence-marker recommended" style="left:${w(v)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",e)} (${t}${s("days",e).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",e)} (${i}${s("days",e).charAt(0)})</span>
      </div>
    </div>
  `}function Nt(r){return Math.max(1,Math.round(r||0))}var Gr={one:"sensor_prediction_urgency_one",few:"sensor_prediction_urgency_few",other:"sensor_prediction_urgency"};function ms(r,a,e){let t=r.degradation_trend!=null&&r.degradation_trend!=="insufficient_data",i=r.days_until_threshold!=null,n=r.environmental_factor!=null&&r.environmental_factor!==1;if(!t&&!i&&!n)return p;let l=r.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":r.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${r.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s(ni(Nt(r.days_until_threshold),a,Gr),a).replace("{days}",String(Nt(r.days_until_threshold)))}
        </div>
      `:p}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",a)}
      </div>
      <div class="prediction-grid">
        ${t?o`
          <div class="prediction-item">
            <ha-svg-icon path="${l}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",a)}</span>
            <span class="prediction-value ${r.degradation_trend}">${s("trend_"+r.degradation_trend,a)}</span>
            ${r.degradation_rate!=null?o`<span class="prediction-rate">${r.degradation_rate>0?"+":""}${x(r.degradation_rate,a,Math.abs(r.degradation_rate)>=10?0:1)} ${r.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",a)}</span>`:p}
          </div>
        `:p}
        ${i?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",a)}</span>
            <span class="prediction-value prediction-days${r.days_until_threshold===0?" exceeded":r.sensor_prediction_urgency?" urgent":""}">${r.days_until_threshold===0?s("threshold_exceeded",a):"~"+ri(Nt(r.days_until_threshold),a)}</span>
            ${r.threshold_prediction_date?o`<span class="prediction-date">${L(r.threshold_prediction_date,a)}</span>`:p}
            ${r.threshold_prediction_confidence?o`<span class="confidence-dot ${r.threshold_prediction_confidence}"></span>`:p}
            ${(r.prediction_cycles??0)>0?o`<span class="prediction-cycles">${s("prediction_cycles",a)}: ${r.prediction_cycles}</span>`:p}
          </div>
        `:p}
        ${n&&e.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",a)}</span>
            <span class="prediction-value">${x(r.environmental_factor,a,2)}x</span>
            ${r.environmental_entity?o`<span class="prediction-entity entity-link" @click=${d=>di(d,r.environmental_entity)}>${r.environmental_entity}</span>`:p}
          </div>
        `:p}
      </div>
    </div>
  `}function gs(r,a,e,t){let i=Math.max(r||1,a);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",t)}: ${r!=null?ve(r,t):"\u2014"}
        </div>
        <div class="interval-visual current"
          style="width: ${r!=null?Math.min(r/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${s("recommended",t)}: ${ve(a,t)}
          <span class="confidence-badge ${e}">${s(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(a/i*100,100)}%"></div>
      </div>
    </div>
  `}var fs=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function vs(){return Number(Pe().slice(5,7))-1}function ys(r,a,e){if(!e.seasonal||!r.seasonal_factor||r.seasonal_factor===1)return p;let t=fs.map(d=>s(d,a)),i=vs(),n=r.seasonal_factors||r.interval_analysis?.seasonal_factors||null,l=n&&n.length===12?n:t.map((d,u)=>{let _=r.seasonal_factor||1,g=Math.sin((u-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,_+g))});return o`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",a)}</h4>
      <div class="seasonal-mini-chart">
        ${l.map((d,u)=>{let _=d*40,g=d<.9?"low":d>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${g} ${u===i?"current":""}"
                 style="height: ${_}px"
                 title="${t[u]}: ${x(d,a,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",a)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",a)}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",a)}</span>
      </div>
    </div>
  `}function bs(r,a){return Yr(r,a)}function Yr(r,a){let e=r.seasonal_factors??r.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return p;let t=r.interval_analysis?.seasonal_reason,i=vs(),n=300,l=100,d=8,_=l-d-4,g=Math.max(...e,1.5),f=n/12,v=f*.65,$=d+_-1/g*_;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",a)}
        ${t?o`<span class="source-tag">${t==="learned"?s("seasonal_learned",a):s("seasonal_manual",a)}</span>`:p}
      </div>
      <svg viewBox="0 0 ${n} ${l}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",a)}">
        <line x1="0" y1="${w($)}" x2="${n}" y2="${w($)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((T,M)=>{let j=T/g*_,Y=M*f+(f-v)/2,K=d+_-j,Z=M===i,_e=T<1?"var(--success-color, #4caf50)":T>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return me`
            <rect x="${w(Y)}" y="${w(K)}"
              width="${w(v)}" height="${w(j)}"
              fill="${_e}" opacity="${Z?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${fs.map((T,M)=>o`<span class="seasonal-label ${M===i?"active-month":""}">${s(T,a)}</span>`)}
      </div>
    </div>
  `}var I=class extends C{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1};this._toast="";this._toastTimer=new mt;this._access=Qe;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return H(this.hass)}async openFor(e,t){(e!==this._entryId||t!==this._taskId)&&(this._task=null),this._entryId=e,this._taskId=t,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=Pe(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let e=await X(this.hass);this._features={...this._features,...e.features},this._access=e.access,this._currencySymbol=He(e.budget??void 0),ti(e.budget??void 0),this._partsCostMode=e.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(e,t){this._toast=e,this._toastTimer.schedule(()=>{this._toast=""},t)}async _loadTask(){let e=this._entryId,t=this._taskId;if(!e||!t)return;let i=++this._loadSeq,n="",l=await R(this,{type:"maintenance_supporter/object",entry_id:e},{onError:u=>{n=u}});if(i!==this._loadSeq)return;if(l===void 0){this._error=n;return}this._objectName=l?.object?.name||"";let d=(l?.tasks||[]).find(u=>u.id===t);this._task=d??null,this._taskRef=os(l?.object,d),d||(this._error=s("ws_err_not_found",this._lang))}_runWs(e){return this._error="",R(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(e=!1){if(!(!this._entryId||!this._taskId||!this._task)){if(!e&&pe(this._task)){this._onQuickComplete();return}import("./dialog-mount-DCF5GCJZ.js").then(async({openCompleteDialog:t})=>{let i=this._task,n=[];try{n=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(is({entryId:this._entryId,taskId:this._taskId,taskName:i.name,task:i,objects:n,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}}async _onQuickComplete(){let e=this._entryId,t=this._task;this._busy=!0;try{let i=await Ti(this.hass,e,t.id,this._lang);if(i.result==="dialog"){this._onComplete(!0);return}if(i.result==="failed"){this._error=i.message;return}if(i.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:i.message},bubbles:!0,composed:!0})),this.close();return}this._notifyChanged("complete"),i.undo&&Xe(this,this.hass,{entryId:e,taskId:t.id,taskName:t.name},this._lang,()=>{}),this.close()}finally{this._busy=!1}}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:ts(e,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||import("./dialog-mount-DCF5GCJZ.js").then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-DCF5GCJZ.js").then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let e=await hs(hi(this.hass),this._task,this._lang);if(!e)return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId,...e})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(s("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._showToast(e?.recommended_interval?`${s("reanalyze_result",this._lang)}: ${ai(e.recommended_interval,"days",this._lang)} (${e.data_points} ${s("data_points",this._lang)})`:s("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(e){if(!this._entryId||!this._taskId)return;let t=ei(this._entryId,this._taskId,e,this._task);import("./dialog-mount-DCF5GCJZ.js").then(({openHistoryEditDialog:i})=>i(t))}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return p;let t=this._lang;return o`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",t)}</h4>
        ${gs(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",t)}
        <div class="recommendation-actions">
          ${Ee(this.hass?.user,this._access)?o`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${s("apply_suggestion",t)}
              </button>`:p}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${s("reanalyze",t)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(e){let t=this._lang,i=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,n=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,l=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,d=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!i&&!n&&!l&&!d?o`<div class="adaptive-empty">
        ${s("adaptive_no_data",t)}
      </div>`:o`
      <div class="adaptive-stack">
        ${this._toast?o`<div class="toast">${this._toast}</div>`:p}
        ${i?this._renderRecommendation(e):p}
        ${n?ms(e,t,this._features):p}
        ${l?_s(e,t):p}
        ${d?o`
          ${ys(e,t,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?bs(e,t):p}
        `:p}
      </div>
    `}_renderDetails(e){let t=this._lang,i=e.history||[],n=e.history_count??i.length,l=cs(i).slice(0,20);return o`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${s("times_performed",t)}</span>
            <span class="stat-value">${e.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("total_cost",t)}</span>
            <span class="stat-value">${B(e.total_cost??0,this._currencySymbol,t)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("avg_duration",t)}</span>
            <span class="stat-value">${ye(e.average_duration!=null?Math.round(e.average_duration):null,t)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${s("history",t)}</strong>
          <span class="history-count">${n}</span>
        </div>
        ${i.length===0?o`<div class="history-empty">${s("history_empty",t)}</div>`:o`
              <div class="history-list">
                ${l.map(d=>ps(d,{lang:t,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:Ee(this.hass?.user,this._access)?u=>this._onEditHistoryEntry(u):void 0,readingUnit:e.reading_unit,readingSlotDelta:(u,_)=>Zt(i,u,_),taskRef:this._taskRef},{compact:!0}))}
                ${n>l.length?o`<div class="history-more">… +${n-l.length} ${s("older_entries",t)}</div>`:p}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return p;let e=this._lang,t=this._task,i=Ee(this.hass?.user,this._access),n=!!t&&jt(t);return Ae(()=>this.close(),o`
        ${t?o`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${_t(t)}"></span>
                  ${he()?p:o`<span class="task-name">${t.name}</span>`}
                  ${us(t,e)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("./dialog-mount-DCF5GCJZ.js").then(({openObjectQuickActions:l})=>{l(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${t.next_due?o`<span><strong>${s("next_due",e)}:</strong> ${L(t.next_due,e)}</span>`:p}
                  ${t.last_performed?o`<span><strong>${s("last_performed",e)}:</strong> ${L(t.last_performed,e)}</span>`:p}
                  ${t.schedule?.kind&&!["manual","one_time"].includes(t.schedule.kind)||t.interval_days!=null?o`<span><strong>${s("interval",e)}:</strong> ${li(t,e)}</span>`:p}
                  ${Fe(t)?o`<span><strong>${s("phase_current",e)}:</strong> ${Fe(t)}</span>`:p}
                </div>
                ${t.notes?o`<div class="notes-body">${ht(t.notes)}</div>`:p}
              </div>

              ${this._error?P("error",this._error):p}

              ${this._showSkip?o`
                    <div class="inline-form">
                      <ms-textfield label=${s("skip_reason",e)} .value=${this._skipReason}
                        @input=${l=>{this._skipReason=l.target.value}}></ms-textfield>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${s("cancel",e)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${s("skip",e)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?o`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${s("reset_to_date",e)}
                        .hass=${this.hass}
                        .lang=${e}
                        .value=${this._resetDate}
                        @value-changed=${l=>{this._resetDate=l.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${s("cancel",e)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${s("reset",e)}
                        </button>
                      </div>
                    </div>
                  `:this._showPostpone?o`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${s("postpone_date_prompt",e)}
                        .hass=${this.hass}
                        .lang=${e}
                        .value=${this._postponeDate}
                        @value-changed=${l=>{this._postponeDate=l.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showPostpone=!1}} ?disabled=${this._busy}>
                          ${s("cancel",e)}
                        </button>
                        <button class="btn primary qa-postpone-confirm" @click=${this._onPostponeConfirm}
                          ?disabled=${this._busy||!this._postponeDate}>
                          ${s("postpone",e)}
                        </button>
                      </div>
                    </div>
                  `:o`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${()=>this._onComplete()} .disabled=${this._busy}
                        title=${pe(t)?s("qr_action_quick_complete",e):s("complete",e)}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${s("complete",e)}
                      </ha-button>
                      ${pe(t)?o`<ha-button appearance="outlined" variant="success" class="qa-complete-details" @click=${()=>this._onComplete(!0)} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:text-box-edit-outline"></ha-icon>
                            ${s("complete_with_details",e)}
                          </ha-button>`:p}
                      ${t.allow_skip!==!1?o`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${s("skip",e)}
                            </ha-button>
                          `:p}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${s("reset",e)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${i?o`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${s("edit",e)}
                          </ha-button>`:p}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${s("qr_code",e)}
                      </ha-button>
                      ${n?p:o`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${s("postpone",e)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${s("snooze",e)}
                          </ha-button>`}
                      ${i?o`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${t.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${t.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${t.archived?s("unarchive",e):s("archive",e)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${s("delete",e)}
                          </ha-button>`:p}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?s("hide_details",e):s("show_details",e)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?o`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?s("hide_stats",e):s("show_stats",e)}
                          </button>`:p}
                    </div>
                    ${this._showDetails?this._renderDetails(t):p}
                    ${this._showAdaptive?this._renderAdaptive(t):p}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${s("open_in_panel",e)}
                      </button>
                    </div>
                  `}
            `:this._error?P("error",this._error):o`<div class="loading">${s("loading",e)}</div>`}
    `,{title:t?.name})}updated(e){e.has("_open")&&this._open&&Re(this.shadowRoot)}};I.styles=[pi,Ce,k`
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
  `],c([y({attribute:!1})],I.prototype,"hass",2),c([h()],I.prototype,"_open",2),c([h()],I.prototype,"_entryId",2),c([h()],I.prototype,"_taskId",2),c([h()],I.prototype,"_task",2),c([h()],I.prototype,"_objectName",2),c([h()],I.prototype,"_taskRef",2),c([h()],I.prototype,"_busy",2),c([h()],I.prototype,"_error",2),c([h()],I.prototype,"_showSkip",2),c([h()],I.prototype,"_showReset",2),c([h()],I.prototype,"_showPostpone",2),c([h()],I.prototype,"_showDetails",2),c([h()],I.prototype,"_showAdaptive",2),c([h()],I.prototype,"_skipReason",2),c([h()],I.prototype,"_resetDate",2),c([h()],I.prototype,"_postponeDate",2),c([h()],I.prototype,"_features",2),c([h()],I.prototype,"_toast",2),c([h()],I.prototype,"_access",2),c([h()],I.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",I);function $s(r,a,e){return r&&a?.[r]?.name||e}function xs(r){if(r.key!=="Enter"&&r.key!==" ")return;let e=r.target?.closest?.('[role="menuitem"], [role="button"]');!e||e.getAttribute("aria-disabled")==="true"||(r.preventDefault(),e.click())}var V=class extends C{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=Qe;this._loadSeq=0}get _lang(){return H(this.hass)}async openFor(e){e!==this._entryId&&(this._data=null),this._entryId=e,this._error="",this._open=!0,await Promise.all([this._load(),X(this.hass).then(t=>{this._access=t.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let e=this._entryId;if(!e)return;let t=++this._loadSeq,i="",n=await R(this,{type:"maintenance_supporter/object",entry_id:e},{onError:l=>{i=l}});t===this._loadSeq&&(n===void 0?this._error=i:this._data=n)}_runWs(e){return this._error="",R(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_onEditObject(){!this._entryId||!this._data||import("./dialog-mount-DCF5GCJZ.js").then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("./dialog-mount-DCF5GCJZ.js").then(({openCreateTaskDialog:e})=>{e(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await Le(this.hass,{title:s("delete",this._lang),message:s("delete_object_confirm",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;let t=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let e=!!this._data.object.archived;if(!e&&!await Le(this.hass,{title:s("archive_object",this._lang),message:s("confirm_archive_object",this._lang),confirmText:s("archive_object",this._lang)}))return;let t=this._entryId;await this._runWs({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}_onTaskClick(e){this._entryId&&import("./dialog-mount-DCF5GCJZ.js").then(({openTaskQuickActions:t})=>{t(this._entryId,e)})}render(){if(!this._open)return p;let e=this._lang,t=this._data,i=t?.object,n=t?.tasks||[],l=Ee(this.hass?.user,this._access);return Ae(()=>this.close(),o`
        ${t&&i?o`
              <div class="header">
                ${he()?p:o`<div class="title">${i.name}</div>`}
                ${this._renderMetaRow(i)}
              </div>

              ${this._error?P("error",this._error):p}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${s("tasks",e)}</strong>
                  <span class="count">${n.length}</span>
                </div>
                ${n.length===0?o`<div class="empty">${s("no_tasks",e)}</div>`:o`
                      <div class="task-list">
                        ${n.map(d=>o`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(d.id)} @keydown=${xs}>
                            <span class="status-dot" style="background: ${_t(d)}"></span>
                            <span class="task-name">${d.name}</span>
                            <span class="task-status ${je(d)}">${Ot(je(d),e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?o`
                    <div class="notes-section">
                      <strong>${s("object_notes_label",e)}</strong>
                      <div class="notes-body">${ht(i.notes)}</div>
                    </div>
                  `:p}

              ${l?o`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${s("add_task",e)}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${s("edit",e)}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${i.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${i.archived?s("unarchive_object",e):s("archive_object",e)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${s("delete",e)}
                      </button>
                    </div>
                  `:p}
            `:this._error?P("error",this._error):o`<div class="loading">${s("loading",e)}</div>`}
    `,{title:i?.name})}updated(e){e.has("_open")&&this._open&&Re(this.shadowRoot)}_renderMetaRow(e){let t=this._lang,i=[];return e.area_id&&i.push([s("area",t),$s(e.area_id,this.hass?.areas,s("no_area",t))]),e.manufacturer&&i.push([s("manufacturer",t),e.manufacturer]),e.model&&i.push([s("model",t),e.model]),e.serial_number&&i.push([s("serial_number_label",t),e.serial_number]),e.installation_date&&i.push([s("installed",t),L(e.installation_date,t)]),e.warranty_expiry&&i.push([s("warranty",t),L(e.warranty_expiry,t)]),e.documentation_url&&i.push([s("documentation_url_label",t),e.documentation_url,pt(e.documentation_url)]),i.length===0?p:o`
      <div class="meta">
        ${i.map(([n,l,d])=>o`
            <div class="meta-item">
              <span class="meta-label">${n}</span>
              <span class="meta-value">${d||rs(l)?o`<a href="${l}" target="_blank" rel="noopener noreferrer">${l}</a>`:l}</span>
            </div>
          `)}
      </div>
    `}};V.styles=[Ce,k`
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
  `],c([y({attribute:!1})],V.prototype,"hass",2),c([h()],V.prototype,"_open",2),c([h()],V.prototype,"_entryId",2),c([h()],V.prototype,"_data",2),c([h()],V.prototype,"_busy",2),c([h()],V.prototype,"_error",2),c([h()],V.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",V);var ks="maintenance-object-dialog",ws="maintenance-task-dialog",Jr="maintenance-history-edit-dialog",Xr="maintenance-complete-dialog",en="maintenance-qr-dialog",tn="maintenance-task-quick-actions-dialog",sn="maintenance-object-quick-actions-dialog";function qe(){return document.querySelector("home-assistant")?.hass}function rn(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function ie(r){let a=rn(),e=a.querySelector(r)??document.body.querySelector(r);return e?e.parentNode!==a&&a.appendChild(e):(e=document.createElement(r),a.appendChild(e)),e}function se(r){let a=qe();if(!a)return!1;r.hass=a;let e=H(a);return zt(e)||Ut(e).then(()=>{r.requestUpdate?.()}),ii(a.locale,a.config?.country,a.config?.time_zone),!0}function Oc(r){return X(r).then(a=>a.rowActionStyle)}function Nc(){mi()}function Mc(){let r=ie(ks);return se(r)?(r.openCreate(),Es(r),!0):!1}async function Es(r){let a=qe();a&&(r.placesEnabled=(await X(a)).features.places)}function Lc(r,a){let e=ie(ks);return se(e)?(e.openEdit(r,a),Es(e),!0):!1}function Dc(r="",a){let e=ie(ws);if(!se(e))return!1;let t=qe();return t?((async()=>{let i=await X(t),n=e;Ts(n,i),n.openCreate(r,a)})(),!0):!1}function Ts(r,a){r.checklistsEnabled=a.features.checklists,r.scheduleTimeEnabled=a.features.schedule_time,r.completionActionsEnabled=a.features.completion_actions,r.adaptiveFeature=a.features.adaptive,r.seasonalFeature=a.features.seasonal,r.environmentalFeature=a.features.environmental,r.defaultWarningDays=a.defaultWarningDays,r.mirrorTodoDefault=a.mirrorTodoDefault,r.betaEditor=a.features.beta_editor}function Fc(r,a){let e=ie(ws);if(!se(e))return!1;let t=qe();return t?((async()=>{try{let[i,n]=await Promise.all([t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:r}),X(t)]),l=(i.tasks||[]).find(u=>u.id===a);if(!l){console.warn(`openEditTaskDialog: task ${a} not found in entry ${r}`);return}let d=e;Ts(d,n),await d.openEdit(r,l)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function jc(r){let a=ie(Jr);return se(a)?(a.openEdit(r),!0):!1}function zc(r){let a=ie(Xr);if(!se(a))return!1;let e=a;return e.__msUndoWired||(e.__msUndoWired=!0,a.addEventListener("task-completed",t=>{let i=t.detail,n=qe();i?.undo&&n&&Xe(a,n,i,H(n),()=>{})})),ss(a,r,H(qe())),!0}function Uc(r){let a=ie(en);return se(a)?(a.openForTask(r.entry_id,r.task_id,r.object_name,r.task_name),!0):!1}function Wc(r,a){let e=ie(tn);return se(e)?(e.openFor(r,a),!0):!1}function Bc(r){let a=ie(sn);return se(a)?(a.openFor(r),!0):!1}export{Nc as __resetSettingsCacheForTests,Oc as getRowActionStyle,zc as openCompleteDialog,Mc as openCreateObjectDialog,Dc as openCreateTaskDialog,Lc as openEditObjectDialog,Fc as openEditTaskDialog,jc as openHistoryEditDialog,Bc as openObjectQuickActions,Uc as openQrDialog,Wc as openTaskQuickActions};
