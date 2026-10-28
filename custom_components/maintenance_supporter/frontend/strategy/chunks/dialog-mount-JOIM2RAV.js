/*! maintenance_supporter frontend 2.112.0 */
import{a as Ye,b as Et,c as Tt,d as St,e as It,f as At,g as Ct,h as Rt,i as qt,j as Pt,l as J}from"./chunk-6KQEWWSL.js";import"./chunk-OD3CUTV3.js";import{a as Pe,b as he,c as He,d as Wt,e as Q,f as Gt}from"./chunk-G2L7KDP2.js";import{c as Bt,d as Vt,e as xe,f as ke,g as we,h as et,i as X,j as pe,k as ie}from"./chunk-Q7OCNCMG.js";import{A as jt,B as ce,C as zt,D as Ut,E as A,a as w,b as l,c as oe,d as h,e as Ht,f as T,g as f,h as p,i as $e,k as Ot,l as Nt,m as Ce,n as S,o as Lt,p as D,q as le,r as Je,s as H,t as Re,u as qe,v as Mt,w as de,x as Xe,y as Ft,z as Dt}from"./chunk-JRDCYCRP.js";import{a as d,b as vt,c as yt,d as bt,f as Ie,j as C,k as s,l as $t,m as xt,o as Ze,p as Ae,r as be,s as kt,t as G,u as wt}from"./chunk-WZRULV5L.js";function Qt(r){return r.object.parent_entry_id||null}function Kt(r,a){let e=new Map(r.map(o=>[o.entry_id,o])),t=[],i=new Set([a]),n=e.get(a);for(;n;){let o=Qt(n);if(!o||i.has(o))break;let c=e.get(o);if(!c)break;i.add(o),t.unshift(c),n=c}return t}function Yt(r,a){let e=new Map;for(let n of r){let o=Qt(n);o&&(e.has(o)||e.set(o,[]),e.get(o).push(n.entry_id))}let t=new Set,i=[...e.get(a)??[]];for(;i.length;){let n=i.pop();n===a||t.has(n)||(t.add(n),i.push(...e.get(n)??[]))}return t}var R=class extends T{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){return l`
      <label class="field">
        ${this.label?l`<span class="label">${this.label}${this.required?l`<span class="req">*</span>`:h}</span>`:h}
        ${this.multiline?l`
        <textarea
          .value=${this.value??""}
          rows=${this.rows}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @change=${this._onInput}
        ></textarea>`:l`
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??h}
          min=${this.min??h}
          max=${this.max??h}
          pattern=${this.pattern??h}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?l`<span class="helper">${this.helper}</span>`:h}
      </label>
    `}};R.styles=w`
    :host { display: block; }
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
      border-radius: 6px;
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
      border-radius: 6px;
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
  `,d([f()],R.prototype,"label",2),d([f()],R.prototype,"value",2),d([f()],R.prototype,"placeholder",2),d([f()],R.prototype,"type",2),d([f({type:Boolean})],R.prototype,"required",2),d([f({type:Boolean})],R.prototype,"disabled",2),d([f()],R.prototype,"step",2),d([f()],R.prototype,"min",2),d([f()],R.prototype,"max",2),d([f()],R.prototype,"pattern",2),d([f()],R.prototype,"helper",2),d([f({type:Boolean})],R.prototype,"multiline",2),d([f({type:Number})],R.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",R);var k=class extends T{constructor(){super(...arguments);this.objects=[];this.placesEnabled=!1;this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._place="";this._remindOnSite=!1;this._entryId=null;this._replacing=!1;this._oldDeviceId="";this._replaceDevice="keep"}get _lang(){return C(this.hass)}openCreate(e=""){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId=e,this._place="",this._remindOnSite=!1,this._replacing=!1,this._error="",this._open=!0}openReplace(e,t){this._entryId=e,this._replacing=!0,this._name=t.name||"",this._oldDeviceId=t.ha_device_id||"",this._haDeviceId="",this._replaceDevice="keep",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._haDeviceId=t.ha_device_id||"",this._parentEntryId=t.parent_entry_id||"",this._place=t.place||"",this._remindOnSite=!!t.remind_on_site,this._replacing=!1,this._error="",this._open=!0}async _replace(){if(this._loading||!this._entryId)return;let e={type:"maintenance_supporter/object/replace",entry_id:this._entryId,name:this._name.trim()||null};this._oldDeviceId?(this._replaceDevice==="other"&&(e.ha_device_id=this._haDeviceId),this._replaceDevice==="none"&&(e.ha_device_id=null)):this._haDeviceId&&(e.ha_device_id=this._haDeviceId);let t=await A(this,e,{busy:i=>{this._loading=i},fallbackKey:"save_error",onError:i=>{this._error=i}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-replaced",{detail:{entry_id:t?.entry_id,device_swap:t?.device_swap}})))}_deviceName(e){let i=this.hass?.devices?.[e];return i?.name_by_user||i?.name||e}_deviceSelector(e){return l`<ha-form
      .hass=${this.hass}
      .data=${{device:this._haDeviceId||void 0}}
      .schema=${[{name:"device",selector:{device:{}}}]}
      .computeLabel=${()=>e}
      @value-changed=${t=>this._haDeviceId=t.detail.value?.device||""}
    ></ha-form>`}_renderReplace(){let e=this._lang,t=(n,o)=>l`<label class="radio-row">
      <input
        type="radio"
        name="replace-device"
        .checked=${this._replaceDevice===n}
        @change=${()=>{this._replaceDevice=n}}
      />
      <span>${o}</span>
    </label>`,i=this._replaceDevice==="other"&&!this._haDeviceId;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("replace_object",e)}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:h}
          <div class="hint">${s("replace_object_prompt",e)}</div>
          <ms-textfield
            label="${s("replace_name_label",e)}"
            .value=${this._name}
            @input=${n=>this._name=n.target.value}
          ></ms-textfield>
          ${this._oldDeviceId?l`<div class="radio-group" role="radiogroup" aria-label=${s("replace_device_heading",e)}>
                <div class="textarea-label">${s("replace_device_heading",e)}</div>
                ${t("keep",s("replace_device_keep",e).replace("{device}",this._deviceName(this._oldDeviceId)))}
                ${this._replaceDevice==="keep"?l`<div class="hint">${s("replace_device_keep_hint",e)}</div>`:h}
                ${t("other",s("replace_device_other",e))}
                ${this._replaceDevice==="other"?l`${this._deviceSelector(s("replace_device_pick",e))}
                      <div class="hint">${s("replace_device_other_hint",e)}</div>`:h}
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
    `}_renderPlace(e){let t=!!this._place&&!this.hass?.states?.[this._place];return l`
      <ha-form
        .hass=${this.hass}
        .data=${{place:this._place||void 0}}
        .schema=${[{name:"place",selector:{entity:{domain:"zone"}}}]}
        .computeLabel=${()=>s("place_optional",e)}
        @value-changed=${i=>{this._place=i.detail.value?.place||"",this._place||(this._remindOnSite=!1)}}
      ></ha-form>
      ${t?l`<div class="place-missing">${s("place_missing",e)}</div>`:h}
      <label class="place-on-site ${this._place?"":"disabled"}">
        <input
          type="checkbox"
          .checked=${this._remindOnSite}
          ?disabled=${!this._place}
          @change=${i=>this._remindOnSite=i.target.checked}
        />
        <span>${s("remind_on_site",e)}</span>
      </label>
      ${this._place?l`<div class="place-hint">${s("remind_on_site_hint",e)}</div>`:h}
    `}async _save(){if(this._loading||!this._name.trim())return;this._error="";let e={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null,...this.placesEnabled?{place:this._place||null,remind_on_site:!!this._place&&this._remindOnSite}:{}},t=await A(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...e}:{type:"maintenance_supporter/object/create",...e},{busy:i=>{this._loading=i},fallbackKey:"save_error",onError:i=>{this._error=i}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved",{detail:{device_swap:t?.device_swap}})))}_parentChoices(){let e=this.objects||[],t=this._entryId?Yt(e,this._entryId):new Set;return e.filter(i=>i.entry_id!==this._entryId&&!t.has(i.entry_id)).map(i=>({entryId:i.entry_id,label:[...Kt(e,i.entry_id),i].map(n=>n.object.name).join(" \u203A ")})).sort((i,n)=>i.label.localeCompare(n.label))}_close(){this._open=!1}render(){if(!this._open)return l``;if(this._replacing)return this._renderReplace();let e=this._lang,t=this._entryId?s("edit_object",e):s("new_object",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:h}
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
          ${this.placesEnabled?this._renderPlace(e):h}
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
          ${this._parentChoices().length?l`<label class="textarea-field">
                <span class="textarea-label">${s("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${i=>this._parentEntryId=i.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${s("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(i=>l`<option
                      value=${i.entryId}
                      ?selected=${this._parentEntryId===i.entryId}
                    >${i.label}</option>`)}
                </select>
                <span class="md-hint">${s("parent_object_hint",e)}</span>
              </label>`:h}
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
    `}};k.styles=w`
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
      border: 1px solid var(--divider-color); border-radius: 6px;
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
      border: 1px solid var(--divider-color); border-radius: 6px;
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
  `,d([f({attribute:!1})],k.prototype,"hass",2),d([f({attribute:!1})],k.prototype,"objects",2),d([f({type:Boolean})],k.prototype,"placesEnabled",2),d([p()],k.prototype,"_open",2),d([p()],k.prototype,"_loading",2),d([p()],k.prototype,"_error",2),d([p()],k.prototype,"_name",2),d([p()],k.prototype,"_manufacturer",2),d([p()],k.prototype,"_model",2),d([p()],k.prototype,"_serialNumber",2),d([p()],k.prototype,"_areaId",2),d([p()],k.prototype,"_installationDate",2),d([p()],k.prototype,"_warrantyExpiry",2),d([p()],k.prototype,"_documentationUrl",2),d([p()],k.prototype,"_notes",2),d([p()],k.prototype,"_haDeviceId",2),d([p()],k.prototype,"_parentEntryId",2),d([p()],k.prototype,"_place",2),d([p()],k.prototype,"_remindOnSite",2),d([p()],k.prototype,"_entryId",2),d([p()],k.prototype,"_replacing",2),d([p()],k.prototype,"_oldDeviceId",2),d([p()],k.prototype,"_replaceDevice",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",k);var Zt=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"];function as(r){let a=(r||"").split(/\s+/).filter(Boolean);return a.length===0?"?":a.length===1?a[0][0].toUpperCase():(a[0][0]+a[a.length-1][0]).toUpperCase()}function os(r){let a=0;for(let e of r)a=a*31+e.charCodeAt(0)>>>0;return Zt[a%Zt.length]}function Jt(r){return r?{id:r.id,name:r.name,initials:r.initials||as(r.name),color:r.color||os(r.id)}:null}var Oe=class{constructor(a){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=a}updateHass(a){this.hass=a}async getUsers(a=!1){let e=Date.now();if(!a&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(a,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:a,task_id:e,user_id:t})}async getTasksByUser(a){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:a})).tasks}getUserName(a){return!a||!this.usersCache?null:this.usersCache.find(t=>t.id===a)?.name||null}getPerson(a){return Jt(this.getUser(a))}getUser(a){return!a||!this.usersCache?null:this.usersCache.find(e=>e.id===a)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(a){return a?a===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};function B(r){return`${r.entry_id??""}\0${r.part_id}`}function Xt(r,a,e,t){let i=!!r.entry_id&&r.entry_id!==a,n=i?r.entry_id:a,o=e.find(g=>g.entry_id===n),c=(o?.parts||[]).find(g=>g.id===r.part_id)||null,u=i&&o?.object?.name||"",_=c?.name||s("shared_part_unknown",t);return{part:c,foreign:i,ownerName:u,label:u?`${_} (${u})`:_}}function ei(r,a,e,t){let{part:i,label:n}=Xt(r,a,e,t),o=i&&i.stock!==null&&i.stock!==void 0?` (${le(i.stock,i.unit,t)})`:"",c=i?.storage_location?` \u2014 ${i.storage_location}`:"";return`${S(r.quantity,t)}\xD7 ${n}${o}${c}`}function ti(r,a,e,t){let n=(e.find(c=>c.entry_id===a)?.parts||[]).map(c=>({...c})),o=new Set(n.map(c=>B({part_id:c.id})));for(let c of r?.consumes_parts||[]){if(!c.entry_id||c.entry_id===a)continue;let u=B(c);if(o.has(u))continue;o.add(u);let{part:_,ownerName:g}=Xt(c,a,e,t);n.push({id:c.part_id,name:_?.name||s("shared_part_unknown",t),unit:_?.unit,stock:_?.stock??null,storage_location:_?.storage_location,cost:_?.cost??null,package_size:_?.package_size??null,cost_mode:_?.cost_mode??null,entry_id:c.entry_id,owner_name:g})}return n}var tt=["sensor","binary_sensor","number","input_number","input_boolean","counter","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant","input_select","select","input_datetime","date","datetime","timer","update"],ii=["sensor"];function se(r){let a=(r??"").trim();if(a==="")return null;let e=Number(a.replace(",","."));return!Number.isFinite(e)||e<0?null:Math.round(e)}function re(r){let a=r?.quick_complete_defaults;return!!a&&typeof a=="object"&&!Array.isArray(a)}function Ne(r){return re(r)?{...r.quick_complete_defaults}:null}var ls=new Set(["no_defaults","completion_details_required","tag_scan_required"]);async function si(r,a,e,t){let i={message:"",code:""},n=await A({hass:r},{type:"maintenance_supporter/task/quick_complete",entry_id:a,task_id:e,source:"panel"},{lang:t,fallbackKey:"action_error",onError:(o,c)=>{i={message:o,code:c?.code??""}}});return n===void 0?ls.has(i.code)?{result:"dialog"}:{result:"failed",message:i.message}:{result:"done",undo:n?.undo===!0}}var it=["notes","cost","duration","photo","user"],ue={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"};var ds={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},cs="mdi:wrench-clock",st=r=>r&&ds[r]||cs;function Le(r){return r?Array.isArray(r.entity_ids)&&r.entity_ids.length>0?[...r.entity_ids]:r.entity_id?[r.entity_id]:[]:[]}function ri(r){if(!(!r||r.type==="compound"))return Le(r)[0]}var rt=["low","normal","high"],Dr=[...rt].reverse(),ni=["round_robin","least_completed","random"];var ee=class extends T{constructor(){super(...arguments);this.value="";this.lang="en";this._credit=!1;this._amount=""}willUpdate(e){if(!e.has("value"))return;let t=(this.value??"").trim();if(t===this._signed())return;let i=parseFloat(t);if(t===""||Number.isNaN(i)){this._amount="",this._credit=!1;return}this._credit=i<0,this._amount=String(Math.abs(i))}_signed(){let e=this._amount.trim();return e===""?"":this._credit?`-${e}`:e}_emit(){this.value=this._signed(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setCredit(e){this._credit!==e&&(this._credit=e,this._emit())}_onInput(e){let t=e.target.value;t.startsWith("-")&&(this._credit=!0),this._amount=t.replace(/^-+/,""),this._emit()}render(){let e=this.lang;return l`
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
      ${this._credit?l`<div class="hint">${s("cost_credit_hint",e)}</div>`:h}
    `}};ee.styles=[ce,w`
      :host { display: block; }
      .wrap { display: flex; gap: 8px; align-items: stretch; }
      .sign {
        display: inline-flex;
        flex: none;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
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
    `],d([f()],ee.prototype,"value",2),d([f()],ee.prototype,"lang",2),d([p()],ee.prototype,"_credit",2),d([p()],ee.prototype,"_amount",2);customElements.get("ms-cost-input")||customElements.define("ms-cost-input",ee);var ps=["cleaning","inspection","replacement","calibration","service","reading","custom"],hs=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],Me=["weekdays","nth_weekday","day_of_month","calendar"],ai=["time_based","one_time",...Me],ci=["threshold","counter","state_change","runtime","due_date"],oi=(r,a)=>s(r==="due_date"?"trigger_type_due_date":r,a),us=[...ci,"compound"],K={alpha:"0.3",min:"7",max:"365"},ne=X;function li(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0",carry:{}}}var _s=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);function pi(r){return{type:r.type||"threshold",attribute:r.attribute||"",above:r.trigger_above?.toString()??"",below:r.trigger_below?.toString()??"",equals:r.trigger_equals?.toString()??"",notEquals:r.trigger_not_equals?.toString()??"",forMinutes:r.trigger_for_minutes?.toString()??"0",targetValue:r.trigger_target_value?.toString()??"",deltaMode:r.trigger_delta_mode||!1,fromState:r.trigger_from_state||"",toState:r.trigger_to_state||"",targetChanges:r.trigger_target_changes?.toString()??"",runtimeHours:r.trigger_runtime_hours?.toString()??"",onStates:(r.trigger_on_states||[]).join(", "),daysBefore:r.trigger_days_before?.toString()??"0"}}function hi(r,a){a.attribute&&(r.attribute=a.attribute);let e=parseInt(a.forMinutes,10);if(a.type==="threshold"){let t=parseFloat(a.above);isNaN(t)||(r.trigger_above=t);let i=parseFloat(a.below);isNaN(i)||(r.trigger_below=i);let n=parseFloat(a.equals);isNaN(n)||(r.trigger_equals=n);let o=parseFloat(a.notEquals);isNaN(o)||(r.trigger_not_equals=o),isNaN(e)||(r.trigger_for_minutes=e)}else if(a.type==="counter"){let t=parseFloat(a.targetValue);isNaN(t)||(r.trigger_target_value=t),r.trigger_delta_mode=a.deltaMode}else if(a.type==="state_change"){a.fromState&&(r.trigger_from_state=a.fromState),a.toState&&(r.trigger_to_state=a.toState);let t=parseInt(a.targetChanges,10);isNaN(t)||(r.trigger_target_changes=t),isNaN(e)||(r.trigger_for_minutes=e)}else if(a.type==="runtime"){let t=parseFloat(a.runtimeHours);isNaN(t)||(r.trigger_runtime_hours=t);let i=(a.onStates||"").split(",").map(n=>n.trim()).filter(Boolean);i.length>0&&(r.trigger_on_states=i)}else if(a.type==="due_date"){let t=parseInt(a.daysBefore,10);r.trigger_days_before=isNaN(t)?0:t}}function ms(r){return{entityIds:Le(r).join(", "),...pi(r),carry:Object.fromEntries(Object.entries(r).filter(([e])=>!_s.has(e)&&!e.startsWith("_")))}}function gs(r){let a=r.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(a.length===0)return null;let e={...r.carry||{},entity_id:a[0],entity_ids:a,type:r.type};return hi(e,r),e}function fs(r){return Array.from({length:7},(a,e)=>Xe(e,r,"short"))}function di(r){return Array.from({length:12},(a,e)=>Ft(e,r,"short"))}function vs(r){let a=Array.isArray(r)?r.filter(e=>e!=null&&e!=="").join(", "):r!==null&&typeof r=="object"||r==null?"":String(r);return a.length>40?`${a.slice(0,39)}\u2026`:a}var m=class m extends T{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.mirrorTodoDefault=[];this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._series=[];this._seriesIndex=0;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calMonths=[];this._hadCalMonths=!1;this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._detailsOpen=!1;this._mirrorTodoEntities=[];this._mirrorTodoMode="default";this._completeWhenEntity="";this._completeWhenState="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._holdUntilDone=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._triggerDetailAttribute="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._quickOn=!1;this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=K.alpha;this._adaptiveMin=K.min;this._adaptiveMax=K.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set;this._attrSeq=0}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return C(this.hass)}async openCreate(e,t){this._series=[],this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="";let i=(t||[]).filter(n=>!n.object.archived&&!n.object.archived_at);!e&&i.length>0?(this._objectChoices=i.map(n=>({entry_id:n.entry_id,name:n.object.name})).sort((n,o)=>n.name.localeCompare(o.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._series=[],await this._edit(e,t)}async openEditSeries(e){e.length!==0&&(this._series=e,await this._editSeriesItem(0))}async _editSeriesItem(e){let t=this._series[e];this._seriesIndex=e,await this._edit(t.entryId,t.task),await this.updateComplete,this.shadowRoot?.querySelector(".dialog-title")?.scrollIntoView({block:"start"})}_skipSeriesItem(){this._editSeriesItem(this._seriesIndex+1)}async _edit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._warning="",this._objectChoices=[],this._isFleetTask=t.battery_fleet_task===!0,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let i=t.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"&&(i.day??1)>=1?String(i.day??1):"1",this._domLastDay=i?.kind==="day_of_month"&&i.day===-1,this._domBusiness=i?.kind==="day_of_month"&&i.business===!0,this._calMonths=(i?.kind==="day_of_month"||i?.kind==="nth_weekday")&&Array.isArray(i.months)?[...i.months]:[],this._hadCalMonths=this._calMonths.length>0,this._calendarEntity=i?.kind==="calendar"&&i.entity_id||"",this._calOffset=i?.offset?String(i.offset):"0",this._seasonMonths=Array.isArray(i?.season_months)?[...i.season_months]:[];let n=i?.ends;n&&typeof n.count=="number"?(this._endsMode="count",this._endsCount=String(n.count),this._endsUntil=""):n&&typeof n.until=="string"?(this._endsMode="until",this._endsUntil=n.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._notifyIcon=t.notify_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._mirrorTodoEntities=[...t.mirror_todo_entities||[]],this._mirrorTodoMode=this._mirrorTodoEntities.length?"own":t.mirror_todo_use_default===!1?"none":"default",this._completeWhenEntity=t.complete_when?.entity_id||"",this._completeWhenState=t.complete_when?.to_state||"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._notifyEnabled=t.notify_enabled!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(_=>({..._})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(_=>[B(_),{..._}])),this._consumesQtyText={},this._responsibleUserId=t.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([_,g])=>{let{name:v,checklist:$,consumes_parts:b,required_completion_fields:I,...q}=g,N=g.consumes_parts||[],V=N.findIndex(W=>!W.entry_id),z=V>=0?N[V]:void 0;return{id:_,name:g.name||_,checklistText:(g.checklist||[]).join(`
`),partId:z?.part_id||"",partQty:z?.quantity!=null?String(z.quantity):"",reqOverride:g.required_completion_fields!==void 0,reqFields:[...g.required_completion_fields||[]],extraParts:N.filter((W,ae)=>ae!==V).map(W=>({...W})),carry:q}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"",this._scheduleTimeOn=!!t.schedule_time;let o=t.on_complete_action;if(o&&o.service){this._actionService=o.service;let _=o.target?.entity_id;this._actionTargetEntity=Array.isArray(_)?_[0]||"":_||"",this._actionTargetStored=o.target&&typeof o.target=="object"?JSON.parse(JSON.stringify(o.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=o.data&&typeof o.data=="object"?{...o.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=o.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let c=t.quick_complete_defaults;this._quickOn=re(t),this._qcNotes=c?.notes||"",this._qcCost=c?.cost!=null?String(c.cost):"",this._qcDuration=c?.duration!=null?String(c.duration):"",this._qcFeedback=c?.feedback||"";let u=t.adaptive_config||{};if(this._environmentalEntity=u.environmental_entity||"",this._environmentalAttribute=u.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!u.enabled,this._adaptiveAlpha=u.ewa_alpha?.toString()??K.alpha,this._adaptiveMin=u.min_interval_days?.toString()??K.min,this._adaptiveMax=u.max_interval_days?.toString()??K.max,this._adaptiveSeasonal=u.seasonal_enabled!==!1,this._adaptivePrediction=u.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,t.trigger_config){let _=t.trigger_config;this._triggerEntityId=ri(_)||"",this._triggerEntityIds=Le(_),this._triggerEntityLogic=_.entity_logic||"any",this._setTypeFields(pi(_)),this._triggerCombinator=_.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=_.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=_.auto_complete_on_recovery||!1,this._holdUntilDone=_.trigger_hold_until_done===!0,this._triggerRuntimeMaxSession=_.trigger_runtime_max_session_seconds?.toString()||"",this._triggerDetailAttribute=_.detail_attribute||"",_.type==="compound"?(this._compoundLogic=_.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(_.conditions||[]).map(ms)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),this._detailsOpen=this._priority!=="normal"||!!this._labels.trim()||!!this._documentationUrl.trim()||!!this._customIcon,await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._detailsOpen=!1,this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._calMonths=[],this._hadCalMonths=!1,this._calendarEntity="",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._mirrorTodoMode="default",this._completeWhenEntity="",this._completeWhenState="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._notifyEnabled=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=K.alpha,this._adaptiveMin=K.min,this._adaptiveMax=K.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._actionTestError="",this._quickOn=!1,this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates,this._triggerDaysBefore=e.daysBefore}_resetTriggerFields(){++this._attrSeq,this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(li()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._holdUntilDone=!1,this._triggerRuntimeMaxSession="",this._triggerDetailAttribute="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new Oe(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=s("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,i]=e.split(".");if(!this.hass?.services?.[t]?.[i]){this._actionTestResult="error",this._actionTestError=s("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let n=this._actionTargetEntity.trim();if(n){let o=n.split(".")[0];if(o!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=s("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",t).replace("{entity}",n).replace("{entity_domain}",o).replace("{suggestion}",`${o}.${i}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[n]){this._actionTestResult="error",this._actionTestError=s("action_test_entity_missing",this._lang).replace("{entity}",n),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,i]=e.split("."),n=this.hass?.services?.[t]?.[i]?.fields;return!n||Object.keys(n).length===0?null:Object.entries(n).map(([o,c])=>({name:o,required:!!c.required,selector:c.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([t,i])=>t==="entity_id"?Array.isArray(i)&&i.length>1:Array.isArray(i)?i.length>0:!!i):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},t=n=>(Array.isArray(n)?n:[n]).filter(o=>typeof o=="string"&&!!o),i=this.hass;return[...t(e.entity_id).map(n=>i.states?.[n]?.attributes?.friendly_name||n),...t(e.device_id).map(n=>i.devices?.[n]?.name_by_user||i.devices?.[n]?.name||n),...t(e.area_id).map(n=>i.areas?.[n]?.name||n),...t(e.floor_id).map(n=>i.floors?.[n]?.name||n),...t(e.label_id)].join(", ")}_renderQuickComplete(e){let t={notes:!!this._qcNotes.trim(),cost:!isNaN(parseFloat(this._qcCost)),duration:se(this._qcDuration)!==null,photo:!1,user:!0},i=this._requiredCompletion.filter(o=>!t[o]),n=!!this._checklistText.trim()||this._readings.length>0;return l`
      <label class="req-option quick-complete-switch">
        <input type="checkbox" .checked=${this._quickOn}
          @change=${o=>this._quickOn=o.target.checked} />
        <span>${s("quick_complete_label",e)}</span>
      </label>
      ${this._quickOn?l`
            <div class="field-help">${s("quick_complete_help",e)}</div>
            ${i.length?l`<div class="field-help quick-complete-note">${s("quick_complete_needs_dialog",e).replace("{fields}",i.map(o=>s(ue[o],e)).join(", "))}</div>`:h}
            ${this._requireTagScan?l`<div class="field-help quick-complete-note">${s("quick_complete_tag_hint",e)}</div>`:h}
            ${n?l`<div class="field-help">${s("quick_complete_not_asked",e)}</div>`:h}
            <details class="ca-section quick-complete-values" ?open=${Object.values(t).slice(0,3).some(Boolean)||!!this._qcFeedback}>
              <summary>${s("quick_complete_values",e)}</summary>
              <p class="field-help">${s("quick_complete_values_help",e)}</p>
              <ms-textfield
                label="${s("quick_complete_defaults_notes",e)}"
                .value=${this._qcNotes}
                @input=${o=>{this._qcNotes=o.target.value}}
              ></ms-textfield>
              <div class="qc-cost">
                <span class="qc-cost-label">${s("quick_complete_defaults_cost",e)}</span>
                <ms-cost-input .lang=${e} .value=${this._qcCost}
                  @value-changed=${o=>{this._qcCost=o.detail.value}}></ms-cost-input>
              </div>
              <ms-textfield
                label="${s("quick_complete_defaults_duration",e)}"
                type="number" min="0" step="1"
                .value=${this._qcDuration}
                @input=${o=>{this._qcDuration=o.target.value}}
              ></ms-textfield>
              <select class="qc-feedback" aria-label=${s("was_maintenance_needed",e)}
                .value=${this._qcFeedback}
                @change=${o=>{this._qcFeedback=o.target.value}}>
                <option value="">${s("quick_complete_defaults_feedback_none",e)}</option>
                <option value="needed">${s("quick_complete_defaults_feedback_needed",e)}</option>
                <option value="not_needed">${s("quick_complete_defaults_feedback_not_needed",e)}</option>
                <option value="not_sure">${s("feedback_not_sure",e)}</option>
              </select>
            </details>
          `:h}
    `}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return h;let t=this._serviceSchema();return l`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",e)}</summary>
        <p class="field-help">${s("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let n=this._serviceSchema();if(n){let o=new Set(n.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>o.has(c)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",e)}
          @value-changed=${i=>{let n=i.detail.value;this._actionTargetEntity=n.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?l`<p class="field-help ca-target-more">${s("on_complete_action_target_more",e).replace("{targets}",this._actionTargetSummary())}</p>`:h}
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",e)}
        </p>
        <label class="ca-skip-auto">
          <input type="checkbox" .checked=${this._actionSkipAuto}
            @change=${i=>{this._actionSkipAuto=i.target.checked}} />
          <span>${s("on_complete_action_skip_auto",e)}</span>
        </label>
        ${t?l`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${i=>{this._actionData={...i.detail.value}}}
              ></ha-form>
            `:l`
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
          ${this._actionTestResult==="ok"?l`<span class="ca-test-ok">${s("on_complete_action_test_success",e)}</span>`:h}
          ${this._actionTestResult==="error"?l`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?l`<div class="ca-test-error-detail">${this._actionTestError}</div>`:h}
              </div>`:h}
        </div>
      </details>

    `}async _loadParts(){this.parts=[];let e=this._entryId;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e});if(e!==this._entryId)return;this.parts=t.parts||[],this._partsLoadFailed=!1}catch{if(e!==this._entryId)return;this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){this._foreignOwners=[];let e=this._entryId;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});if(e!==this._entryId)return;this._foreignOwners=(t.objects||[]).filter(i=>i.entry_id!==e&&(i.parts||[]).length>0).map(i=>({entry_id:i.entry_id,name:i.object?.name||i.entry_id,parts:i.parts||[]})).sort((i,n)=>i.name.localeCompare(n.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let i=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:i.suggested_attributes||[],available:i.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){let t=++this._attrSeq;if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});if(t!==this._attrSeq)return;this._entityDomain=i.domain||"",this._suggestedAttributes=i.suggested_attributes||[],this._availableAttributes=i.available_attributes||[]}catch{if(t!==this._attrSeq)return;this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let i=B({part_id:e.id,entry_id:t}),n=this._consumesParts[i],o=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return l`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${n!==void 0}
            @change=${c=>{let u={...this._consumesParts};if(c.target.checked)u[i]=u[i]||o;else{delete u[i];let _={...this._consumesQtyText};delete _[i],this._consumesQtyText=_}this._consumesParts=u}}
          />
          <span>${e.name}${e.unit?` (${e.unit})`:""}</span>
        </label>
        ${n!==void 0?l`<input
              class="consumes-qty"
              aria-label=${`${e.name}: ${s("quantity",this._lang)}`}
              type="number"
              min=${ne[0]}
              max=${ne[1]}
              step="0.01"
              .value=${this._consumesQtyText[i]??String(n.quantity)}
              @input=${c=>{let u=c.target.value;this._consumesQtyText={...this._consumesQtyText,[i]:u};let _=parseFloat(u.replace(",","."));Number.isFinite(_)&&_>=ne[0]&&(this._consumesParts={...this._consumesParts,[i]:{...o,quantity:_}})}}
            />`:h}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let t of Object.keys(e)){let i=this._consumesQtyText[t];if(i===void 0)continue;let n=parseFloat(i.replace(",","."));if(!Number.isFinite(n)||n<ne[0]||n>ne[1]){let o=c=>S(c,this._lang,{maximumFractionDigits:2});return this._error=s("settings_value_out_of_range",this._lang).replace("{min}",o(ne[0])).replace("{max}",o(ne[1])),!1}e[t]={...e[t],quantity:n}}return this._consumesParts=e,!0}_toggleRequired(e,t){let i=new Set(this._requiredCompletion);t?i.add(e):i.delete(e),this._requiredCompletion=[...i]}_patchReading(e,t){this._readings=this._readings.map(i=>i.id===e?{...i,...t}:i)}_renderReadingsEditor(e){let t=Rt(this._readings);return l`
      <div class="readings-editor">
        <div class="field-label">${s("readings_section",e)}</div>
        <div class="field-help">${s("readings_hint",e)}</div>
        ${this._readings.map(i=>l`
          ${t.has(i.id)?l`<div class="field-help reading-dup">${s("reading_duplicate_name",e)}</div>`:h}
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
        ${this._readings.length<Et?l`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:Tt(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${s("reading_add",e)}
          </ha-button>`:h}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",i=t,n=2;for(;this._phaseDefs.some(o=>o.id===i);)i=`${t}-${n++}`;return i}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(i=>i.id===e?{...i,...t}:i)}_renderPhasesEditor(e){let t=i=>this._phaseDefs.find(n=>n.id===i)?.name||i;return l`
      <details class="phases-section" ?open=${this._phaseDefs.length>0}>
      <summary>${s("phases_section",e)}</summary>
      <div class="field-help">${s("phases_hint",e)}</div>
      ${this._phaseDefs.map(i=>l`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${s("phase_name",e)}"
              .value=${i.name}
              @input=${n=>this._patchPhaseDef(i.id,{name:n.target.value})}
            ></ms-textfield>
            ${this.parts.length?l`
              <select
                class="phase-part"
                aria-label=${s("spare_part",e)}
                .value=${i.partId}
                @change=${n=>{let o=n.target.value;this._patchPhaseDef(i.id,i.partQty?{partId:o}:{partId:o,partQty:"1"})}}
              >
                <option value="">—</option>
                ${this.parts.map(n=>l`<option value=${n.id} ?selected=${n.id===i.partId}>${n.name}</option>`)}
              </select>
              ${i.partId?l`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" aria-label=${s("quantity",e)} type="number" min=${X[0]} step="0.01" placeholder="1" .value=${i.partQty}
                  @input=${n=>this._patchPhaseDef(i.id,{partQty:n.target.value})} />
              `:h}
            `:h}
            <ha-icon-button class="phase-remove" .label=${s("remove",e)} @click=${()=>this._removePhaseDef(i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?l`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${s("checklist_placeholder",e)}"
              .value=${i.checklistText}
              @input=${n=>this._patchPhaseDef(i.id,{checklistText:n.target.value})}
            ></textarea>
          `:h}
          <label class="req-option phase-req-toggle">
            <input
              type="checkbox"
              .checked=${i.reqOverride}
              @change=${n=>this._patchPhaseDef(i.id,{reqOverride:n.target.checked})}
            />
            <span>${s("phase_require_override",e)}</span>
          </label>
          ${i.reqOverride?l`
            <div class="required-completion phase-req-fields">
              ${it.map(n=>l`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${i.reqFields.includes(n)}
                    @change=${o=>{let c=o.target.checked,u=new Set(i.reqFields);c?u.add(n):u.delete(n),this._patchPhaseDef(i.id,{reqFields:[...u]})}}
                  />
                  <span>${s(ue[n],e)}</span>
                </label>
              `)}
            </div>
          `:h}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${s("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(i=>i.name.trim())?l`
        <div class="phase-seq-label">${s("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((i,n)=>l`
            <span class="phase-chip">
              ${n+1}. ${t(i)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((o,c)=>c!==n)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            aria-label=${s("phase_sequence_add_step",e)}
            .value=${""}
            @change=${i=>{let n=i.target.value;n&&(this._phaseSeq=[...this._phaseSeq,n]),i.target.value=""}}
          >
            <option value="">+ ${s("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(i=>i.name.trim()).map(i=>l`<option value=${i.id}>${i.name}</option>`)}
          </select>
        </div>
      `:h}
      </details>
    `}async _save(){if(this._loading||!this._name.trim()||this._missingDueDate())return;if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),i=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(i)&&t>i){this._error=`${s("adaptive_min_interval",this._lang)} > ${s("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=s("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=s("calendar_entity_required",this._lang);return}if(!this._applyConsumesQtyText())return;this._loading=!0,this._error="";let e;try{let t=await A(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:c=>{this._error=c}});if(t===void 0)return;let i=this._taskId||t?.task_id,n=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let o=c=>{this._warning=s("subsave_warning",this._lang).replace("{detail}",c)};if(i&&this._scheduleType==="sensor_based"&&n&&await A(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:i,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:o})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),i&&this._adaptiveSnapshot()!==this._adaptiveInitial){let c=parseFloat(this._adaptiveAlpha),u=parseInt(this._adaptiveMin,10),_=parseInt(this._adaptiveMax,10);await A(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:i,enabled:this._adaptiveEnabled,...c>=we[0]&&c<=we[1]?{ewa_alpha:c}:{},...!isNaN(u)&&u>=1?{min_interval_days:u}:{},...!isNaN(_)&&_>=1?{max_interval_days:_}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:o})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?i&&(this._taskId=i):this._seriesIndex+1<this._series.length?e=this._seriesIndex+1:(this._open=!1,this._series=[]),this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}e!==void 0&&await this._editSeriesItem(e)}_missingDueDate(){return this._scheduleType==="one_time"&&!this._dueDate}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):Me.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.priority=this._priority,e.labels=this._labels.split(",").map(n=>n.trim()).filter(Boolean);let i=this.mirrorTodoDefault.length&&this._mirrorTodoMode!=="own"?[]:this._mirrorTodoEntities.filter(Boolean);e.mirror_todo_entities=i,e.mirror_todo_use_default=this.mirrorTodoDefault.length?this._mirrorTodoMode==="default":this._mirrorTodoMode!=="none",e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip,e.complete_when=this._completeWhenEntity&&this._completeWhenState.trim()?{entity_id:this._completeWhenEntity,to_state:this._completeWhenState.trim()}:null,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=qt(this._readings);{let n={};for(let c of this._phaseDefs){if(!c.name.trim())continue;let u={...c.carry,name:c.name.trim()},_=c.checklistText.split(`
`).map(v=>v.trim()).filter(Boolean);_.length&&(u.checklist=_);let g=[];if(c.partId){let v=parseFloat(c.partQty);g.push({part_id:c.partId,quantity:Number.isFinite(v)&&v>0?v:1})}for(let v of c.extraParts)g.push(v.entry_id?{part_id:v.part_id,quantity:v.quantity,entry_id:v.entry_id}:{part_id:v.part_id,quantity:v.quantity});g.length&&(u.consumes_parts=g),c.reqOverride&&(u.required_completion_fields=[...c.reqFields]),n[c.id]=u}let o=this._phaseSeq.filter(c=>c in n);e.phases=Object.keys(n).length&&o.length?n:null,e.phase_sequence=e.phases?o:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(n=>n.entry_id?{part_id:n.part_id,quantity:n.quantity,entry_id:n.entry_id}:{part_id:n.part_id,quantity:n.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let n=this._compoundConditions.map(gs).filter(o=>o!==null);if(n.length>0){let o={type:"compound",compound_logic:this._compoundLogic,conditions:n};this._autoCompleteOnRecovery&&(o.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(o.trigger_combinator="all"),this._triggerDetailAttribute&&(o.detail_attribute=this._triggerDetailAttribute),e.trigger_config=o}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let n=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],o={entity_id:n[0],entity_ids:n,type:this._triggerType};if(hi(o,this._typeFields()),this._holdUntilDone&&this._isStateLatch()?o.trigger_hold_until_done=!0:this._autoCompleteOnRecovery&&(o.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(o.trigger_combinator="all"),this._triggerDetailAttribute&&(o.detail_attribute=this._triggerDetailAttribute),n.length>1&&(o.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let c=parseFloat(this._triggerBaselineValue);!isNaN(c)&&c>=0&&(o.trigger_baseline_value=c)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let c=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(c)&&c>0&&(o.trigger_runtime_max_session_seconds=c)}e.trigger_config=o}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&ai.includes(this._scheduleType)){let n=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(n)?n:null}if(this.checklistsEnabled){let n=this._checklistText.split(`
`).map(o=>o.trim()).filter(Boolean).slice(0,100);e.checklist=n.length?n:null}if(this.completionActionsEnabled||this._actionPresent){let n=this._actionService.trim();if(n&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(n)){let o={service:n},c=this._actionTargetEntity.trim();this._actionTargetStored&&c===this._actionTargetInitial?o.target=JSON.parse(JSON.stringify(this._actionTargetStored)):c&&(o.target={entity_id:c});let u=this._buildActionData();Object.keys(u).length>0&&(o.data=u),this._actionSkipAuto&&(o.skip_auto=!0),e.on_complete_action=o}else e.on_complete_action=null}{let n={};this._qcNotes.trim()&&(n.notes=this._qcNotes.trim());let o=parseFloat(this._qcCost);isNaN(o)||(n.cost=o);let c=se(this._qcDuration);c!==null&&(n.duration=c),this._qcFeedback&&(n.feedback=this._qcFeedback),e.quick_complete_defaults=this._quickOn?n:null}return e}_close(){this._open=!1,this._series=[],this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return h;let e=this._lang,t=this._triggerType==="compound";return l`
      <div class="select-row">
        <label>${s("trigger_type",e)}</label>
        <select aria-label=${s("trigger_type",e)}
          .value=${this._triggerType}
          @change=${i=>this._triggerType=i.target.value}
        >
          ${us.map(i=>l`<option value=${i} ?selected=${i===this._triggerType}>${oi(i,e)}</option>`)}
        </select>
      </div>
      ${t?this._renderCompoundEditor():l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${s("entity_id",e)} (${s("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${i=>{let o=i.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=o[0]||"",this._triggerEntityIds=o,o[0]&&this._fetchEntityAttributes(o[0])}}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:tt}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>s("entity_id",e)}
          @value-changed=${i=>{let n=(i.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=n[0]||"",this._triggerEntityIds=n,n[0]?this._fetchEntityAttributes(n[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?l`
          <div class="select-row">
            <label>${s("entity_logic",e)}</label>
            <select aria-label=${s("entity_logic",e)}
              .value=${this._triggerEntityLogic}
              @change=${i=>this._triggerEntityLogic=i.target.value}
            >
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${s("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${s("entity_logic_all",e)}</option>
            </select>
          </div>
        `:h}
        ${this._renderAttributeSelect({label:s("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:i=>this._triggerAttribute=i})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      ${this._renderDetailAttributeSelect(e)}
      ${this._isStateLatch()?this._renderTriggerEnd(e):l`
        <label>
          <input
            type="checkbox"
            .checked=${this._autoCompleteOnRecovery}
            @change=${i=>this._autoCompleteOnRecovery=i.target.checked}
          />
          ${s("auto_complete_on_recovery",e)}
        </label>
        <div class="field-help">${s("auto_complete_on_recovery_help",e)}</div>
      `}
      <ms-textfield
        label="${s("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${i=>this._intervalDays=i.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():h}
      ${this._intervalDays?l`
            <div class="select-row">
              <label>${s("trigger_combinator",e)}</label>
              <select aria-label=${s("trigger_combinator",e)}
                @change=${i=>this._triggerCombinator=i.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${s("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${s("trigger_combinator_all",e)}</option>
              </select>
            </div>
          `:h}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((i,n)=>n===e?{...i,...t}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,li()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,i)=>i!==e)}_renderCompoundEditor(){let e=this._lang;return l`
      <div class="select-row">
        <label>${s("compound_logic",e)}</label>
        <select aria-label=${s("compound_logic",e)}
          .value=${this._compoundLogic}
          @change=${t=>this._compoundLogic=t.target.value}
        >
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${s("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${s("compound_logic_or",e)}</option>
        </select>
      </div>
      <div class="field-help">${s("compound_help",e)}</div>
      ${this._compoundConditions.length===0?l`<div class="field-help">${s("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,i)=>this._renderCondition(t,i))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let i=this._lang,n=t+1;return l`
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
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${s("entity_id",i)} (${s("comma_separated",i)})"
            .value=${e.entityIds}
            @input=${o=>this._patchCondition(t,{entityIds:o.target.value})}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:tt}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(o=>o.trim()).filter(Boolean)}}
          .computeLabel=${()=>s("entity_id",i)}
          @value-changed=${o=>{let c=(o.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:c.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          <label>${s("trigger_type",i)}</label>
          <select aria-label=${s("trigger_type",i)}
            .value=${e.type}
            @change=${o=>this._patchCondition(t,{type:o.target.value})}
          >
            ${ci.map(o=>l`<option value=${o} ?selected=${o===e.type}>${oi(o,i)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(e,t)}
      </div>
    `}_isStateLatch(){return this._triggerType==="state_change"&&(this._triggerTargetChanges===""||Number(this._triggerTargetChanges)===1)&&!!(this._triggerFromState.trim()||this._triggerToState.trim())}_renderTriggerEnd(e){let t=this._holdUntilDone?"hold":this._autoCompleteOnRecovery?"done":"ok",i={ok:"trigger_end_ok",done:"trigger_end_done",hold:"trigger_end_hold"},n=o=>{this._autoCompleteOnRecovery=o==="done",this._holdUntilDone=o==="hold"};return l`
      <div class="trigger-end" role="radiogroup" aria-label=${s("trigger_end",e)}>
        <div class="field-label">${s("trigger_end",e)}</div>
        ${Object.keys(i).map(o=>l`
          <label class="trigger-end-option">
            <input type="radio" name="trigger-end" value=${o} .checked=${t===o} @change=${()=>n(o)} />
            ${s(i[o],e)}
          </label>
        `)}
        ${t==="done"?l`<div class="field-help">${s("auto_complete_on_recovery_help",e)}</div>`:h}
        ${t==="hold"?l`<div class="field-help">${s("trigger_end_hold_help",e)}</div>`:h}
      </div>
    `}_renderCompleteWhen(e){return l`
      <div class="field complete-when-field">
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${s("complete_when",e)}"
            placeholder="binary_sensor.washer_door"
            .value=${this._completeWhenEntity}
            @input=${t=>this._completeWhenEntity=t.target.value.trim()}
          ></ms-textfield>
        `:l`
          <ha-form
            class="entity-picker-form"
            .hass=${this.hass}
            .schema=${[{name:"complete_when",selector:{entity:{}}}]}
            .data=${{complete_when:this._completeWhenEntity}}
            .computeLabel=${()=>s("complete_when",e)}
            @value-changed=${t=>{let i=(t.detail.value.complete_when||"").trim();i!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=i}}
          ></ha-form>`}
        ${this._completeWhenEntity?this._renderStateField({label:s("complete_when_state",e),value:this._completeWhenState,entityId:this._completeWhenEntity,onInput:t=>this._completeWhenState=t}):h}
        <div class="field-help">${s("complete_when_help",e)}</div>
      </div>
    `}_renderStateField(e){return this._entityPickerFallback||!e.entityId?l`
        <ms-textfield
          label=${e.label}
          .value=${e.value}
          @input=${t=>e.onInput(t.target.value)}
        ></ms-textfield>
      `:l`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId}}}]}
        .data=${{s:e.value}}
        .computeLabel=${()=>e.label}
        @value-changed=${t=>e.onInput((t.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(e){let t=this._lang;return this._entityPickerFallback||!e.entityId?l`
        <ms-textfield
          label="${s("runtime_on_states",t)}"
          placeholder="on"
          .value=${e.value}
          @input=${i=>e.onInput(i.target.value)}
        ></ms-textfield>
      `:l`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(i=>i.trim()).filter(Boolean)}}
        .computeLabel=${()=>s("runtime_on_states",t)}
        @value-changed=${i=>e.onInput((i.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?h:!this.adaptiveFeature&&!this._adaptiveWasEnabled?h:l`
      <details class="adaptive-section" ?open=${this._adaptiveEnabled}>
        <summary>${s("adaptive_section_title",e)}</summary>
        <label>
          <input
            type="checkbox"
            .checked=${this._adaptiveEnabled}
            @change=${t=>this._adaptiveEnabled=t.target.checked}
          />
          ${s("adaptive_enabled",e)}
        </label>
        ${this._adaptiveEnabled?l`
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
            min=${we[0]}
            max=${we[1]}
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${t=>this._adaptiveAlpha=t.target.value}
          ></ms-textfield>
          ${this.seasonalFeature?l`<label>
            <input
              type="checkbox"
              .checked=${this._adaptiveSeasonal}
              @change=${t=>this._adaptiveSeasonal=t.target.checked}
            />
            ${s("adaptive_seasonal_enabled",e)}
          </label>`:h}
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptivePrediction}
              @change=${t=>this._adaptivePrediction=t.target.checked}
            />
            ${s("adaptive_prediction_enabled",e)}
          </label>
        `:h}
      </details>
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?l`
        <div class="select-row">
          <label>${e.label}</label>
          <select aria-label=${e.label}
            .value=${e.value}
            @change=${i=>e.onSelect(i.target.value)}
          >
            <option value="" ?selected=${!e.value}>${s("use_entity_state",t)}</option>
            ${e.suggested.map(i=>l`<option value=${i} ?selected=${i===e.value}>${i} ★</option>`)}
            ${e.available.filter(i=>!e.suggested.includes(i.name)).map(i=>l`<option value=${i.name} ?selected=${i.name===e.value}>${i.name}${i.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:l`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${i=>e.onSelect(i.target.value.trim())}
      ></ms-textfield>
    `}_renderDetailAttributeSelect(e){let t=this._triggerType==="compound"?this._compoundConditions.flatMap(_=>_.entityIds.split(",").map(g=>g.trim()).filter(Boolean)):(this._triggerEntityIds.length?this._triggerEntityIds:[this._triggerEntityId]).filter(Boolean);if(!t.length)return h;let i=this.hass?.states??{},n=new Map;for(let _ of t){this._fetchConditionAttributes(_);for(let g of this._conditionAttrOptions[_]?.available??[])n.has(g.name)||n.set(g.name,vs(i[_]?.attributes?.[g.name]))}let o=this._triggerDetailAttribute;o&&!n.has(o)&&n.set(o,"");let c=s("trigger_detail_attribute",e),u=n.size?l`
        <div class="select-row">
          <label>${c}</label>
          <select class="detail-attribute-select" aria-label=${c} .value=${o}
            @change=${_=>this._triggerDetailAttribute=_.target.value}>
            <option value="" ?selected=${!o}>${s("trigger_detail_none",e)}</option>
            ${[...n.entries()].sort(([_],[g])=>_.localeCompare(g)).map(([_,g])=>l`<option value=${_} ?selected=${_===o}>${g?`${_}: ${g}`:_}</option>`)}
          </select>
        </div>`:l`
        <ms-textfield class="detail-attribute-input" label=${c} .value=${o}
          @input=${_=>this._triggerDetailAttribute=_.target.value.trim()}></ms-textfield>`;return l`${u}<div class="field-help">${s("trigger_detail_attribute_help",e)}</div>`}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:s("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:i=>this._environmentalAttribute=i})}_renderConditionAttribute(e,t){let i=e.entityIds.split(",")[0]?.trim()||"";i&&this._fetchConditionAttributes(i);let n=i?this._conditionAttrOptions[i]:void 0;return this._renderAttributeSelect({label:s("attribute_optional",this._lang),value:e.attribute,suggested:n?.suggested??[],available:n?.available??[],onSelect:o=>this._patchCondition(t,{attribute:o})})}_renderConditionTypeFields(e,t){let i=this._lang;if(e.type==="threshold")return l`
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
      `;if(e.type==="counter")return l`
        <ms-textfield label="${s("target_value",i)}" type="number" .value=${e.targetValue}
          @input=${n=>this._patchCondition(t,{targetValue:n.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${e.deltaMode}
            @change=${n=>this._patchCondition(t,{deltaMode:n.target.checked})} />
          ${s("delta_mode",i)}
        </label>
      `;if(e.type==="state_change"){let n=e.entityIds.split(",")[0]?.trim()||"";return l`
        ${this._renderStateField({label:s("from_state_optional",i),value:e.fromState,entityId:n,onInput:o=>this._patchCondition(t,{fromState:o})})}
        ${this._renderStateField({label:s("to_state_optional",i),value:e.toState,entityId:n,onInput:o=>this._patchCondition(t,{toState:o})})}
        <ms-textfield label="${s("target_changes",i)}" type="number" .value=${e.targetChanges}
          @input=${o=>this._patchCondition(t,{targetChanges:o.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",i)}" type="number" .value=${e.forMinutes}
          @input=${o=>this._patchCondition(t,{forMinutes:o.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let n=e.entityIds.split(",")[0]?.trim()||"";return l`
        <ms-textfield label="${s("runtime_hours",i)}" type="number" .value=${e.runtimeHours}
          @input=${o=>this._patchCondition(t,{runtimeHours:o.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:n,onInput:o=>this._patchCondition(t,{onStates:o})})}
      `}return e.type==="due_date"?l`
        <ms-textfield label="${s("days_before",i)}" type="number" step="1"
          min=${xe[0]} max=${xe[1]} .value=${e.daysBefore}
          @input=${n=>this._patchCondition(t,{daysBefore:n.target.value})}></ms-textfield>
      `:h}_renderUnitSelect(){let e=this._lang;return l`
      <div class="select-row">
        <label>${s("interval_unit",e)}</label>
        <select aria-label=${s("interval_unit",e)}
          .value=${this._intervalUnit}
          @change=${t=>this._intervalUnit=t.target.value}
        >
          ${["days","weeks","months","years"].map(t=>l`<option value=${t} ?selected=${t===this._intervalUnit}>${s("unit_"+t,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(Me.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(m._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let i=(u,_,g=0)=>{if(!(!u||g>10)){(u.tagName?.toLowerCase()??"")==="ha-entity-picker"&&_.push(u);for(let v of[u.shadowRoot,u])if(v)for(let $ of Array.from(v.children??[]))i($,_,g+1)}},n=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],o=[];for(let u of n)i(u,o);let c=o.length===0||o.some(u=>u.offsetHeight===0);if(e.offsetHeight===0||c){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){++this._previewSeq,this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{},...this._taskId?{entry_id:this._entryId,task_id:this._taskId}:{}});if(t!==this._previewSeq)return;this._schedulePreview=i.occurrences||[],this._schedulePreviewEnded=!!i.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return h;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",i=this._schedulePreview.map((o,c)=>{let u=new Date(`${o}T12:00:00`).getDay();return`${Xe(u===0?6:u-1,e,"short")} ${H(o,e)}${c===0?t:""}`}).join(" \xB7 "),n=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?l`<div class="field-help">${s("schedule_preview_ontime",e)}</div>`:h;return l`
      <div class="trigger-live-hint schedule-preview">
        ${s("schedule_preview_title",e)}: ${i}${this._schedulePreviewEnded?l` <span class="field-help">${s("schedule_preview_ends",e)}</span>`:h}
        ${n}
      </div>
    `}_buildSchedule(){let e=n=>{let o=parseInt(this._calOffset,10)||0;return o&&(n.offset=Math.max(-ke,Math.min(o,ke))),n},t=n=>((this._calMonths.length||this._hadCalMonths)&&(n.months=[...this._calMonths].sort((o,c)=>o-c)),e(n));if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((n,o)=>n-o)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let i={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(i.business=!0),t(i)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,i)=>t-i)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleCalMonth(e){this._calMonths=this._calMonths.includes(e)?this._calMonths.filter(t=>t!==e):[...this._calMonths,e]}_renderCalMonths(){let e=this._lang;return l`
      <label class="field-label">${s("recurrence_months_label",e)}</label>
      <div class="field-help">${s("recurrence_months_hint",e)}</div>
      <div class="weekday-chips season-chips cal-month-chips">
        ${di(e).map((t,i)=>l`
          <button
            type="button"
            class="season-chip ${this._calMonths.includes(i+1)?"selected":""}"
            @click=${()=>this._toggleCalMonth(i+1)}
          >${t}</button>`)}
      </div>`}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||Me.includes(this._scheduleType)))return h;let i=di(e);return l`
      <label class="field-label">${s("season_window_label",e)}</label>
      <div class="field-help">${s("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${i.map((n,o)=>l`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(o+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(o+1)}
          >${n}</button>`)}
      </div>

      <label class="field-label">${s("series_end_label",e)}</label>
      <div class="select-row">
        <select aria-label=${s("series_end_label",e)} .value=${this._endsMode}
          @change=${n=>this._endsMode=n.target.value}>
          <option value="never" ?selected=${this._endsMode==="never"}>${s("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${s("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${s("series_end_until",e)}</option>
        </select>
      </div>
      ${this._endsMode==="count"?l`
        <!-- max: MAX_SERIES_COUNT (const.py), what the history can count. -->
        <ms-textfield
          label="${s("series_end_count_label",e)}"
          type="number" min="1" max="500"
          .value=${this._endsCount}
          @input=${n=>this._endsCount=n.target.value}
        ></ms-textfield>`:h}
      ${this._endsMode==="until"?l`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${s("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${n=>this._endsUntil=n.detail.value}
        ></ms-date-field>`:h}
    `}_renderCalendarFields(){let e=this._lang,t=fs(e);if(this._scheduleType==="weekdays")return l`
        <label class="field-label">${s("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((i,n)=>l`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(n)?"selected":""}"
              @click=${()=>this._toggleWeekday(n)}
            >${i}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let i=[["1",s("ord_1",e)],["2",s("ord_2",e)],["3",s("ord_3",e)],["4",s("ord_4",e)],["5",s("ord_5",e)],["-1",s("ord_last",e)]];return l`
        <div class="select-row">
          <label>${s("recurrence_occurrence",e)}</label>
          <select aria-label=${s("recurrence_occurrence",e)} .value=${this._nth} @change=${n=>this._nth=n.target.value}>
            ${i.map(([n,o])=>l`<option value=${n} ?selected=${n===this._nth}>${o}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",e)}</label>
          <select aria-label=${s("recurrence_weekday",e)} .value=${this._nthWeekday} @change=${n=>this._nthWeekday=n.target.value}>
            ${t.map((n,o)=>l`<option value=${String(o)} ?selected=${String(o)===this._nthWeekday}>${n}</option>`)}
          </select>
        </div>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${s("calendar_entity_label",e)}"
            helper="${s("calendar_entity_hint",e)}"
            .value=${this._calendarEntity}
            @input=${i=>this._calendarEntity=i.target.value.trim()}
          ></ms-textfield>
        `:l`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>s("calendar_entity_label",e)}
            .computeHelper=${()=>s("calendar_entity_hint",e)}
            @value-changed=${i=>{this._calendarEntity=(i.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?l`
        ${this._domLastDay?h:l`
          <ms-textfield
            label="${s("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${i=>this._domDay=i.target.value}
          ></ms-textfield>`}
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domLastDay}
            @change=${i=>this._domLastDay=i.target.checked} />
          <span>${s("recurrence_last_day",e)}</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domBusiness}
            @change=${i=>this._domBusiness=i.target.checked} />
          <span>${s("recurrence_business_day",e)}</span>
        </label>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`:h}_renderCalOffsetField(){let e=this._lang;return l`
      <ms-textfield
        label="${s("recurrence_offset",e)}"
        helper="${s("recurrence_offset_help",e)}"
        type="number"
        min=${-ke}
        max=${ke}
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return h;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?l`<div class="trigger-live-hint warn">${s("trigger_hint_overlap",this._lang)}</div>`:h,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let i=this.hass.states[t];if(!i)return e;let n=this._lang,o=i.attributes?.unit_of_measurement,c=typeof o=="string"&&o?` ${o}`:"",u=this._triggerAttribute?i.attributes?.[this._triggerAttribute]:i.state,_=typeof u=="number"?u:parseFloat(String(u)),g=u!=="unknown"&&u!=="unavailable"&&u!=null&&!isNaN(_),v=b=>S(b,n,{maximumFractionDigits:1}),$=[];if(this._triggerType==="threshold"){let b=parseFloat(this._triggerAbove),I=parseFloat(this._triggerBelow),q=parseFloat(this._triggerEquals),N=parseFloat(this._triggerNotEquals);if([b,I,q,N].every(V=>isNaN(V)))return h;g&&$.push(s("trigger_hint_now",n).replace("{value}",v(_)+c)),isNaN(b)||$.push(s("trigger_hint_above",n).replace("{target}",v(b)+c)),isNaN(I)||$.push(s("trigger_hint_below",n).replace("{target}",v(I)+c)),isNaN(q)||$.push(s("trigger_hint_equals",n).replace("{target}",v(q)+c)),isNaN(N)||$.push(s("trigger_hint_not_equals",n).replace("{target}",v(N)+c))}else if(this._triggerType==="counter"){let b=parseFloat(this._triggerTargetValue);if(isNaN(b))return h;this._triggerDeltaMode?this._taskId?$.push(s("trigger_hint_counter_delta_edit",n).replace("{target}",v(b)+c)):g?$.push(s("trigger_hint_counter_delta",n).replace("{value}",v(_)+c).replace("{due}",v(_+b)+c).replace("{target}",v(b)+c)):$.push(s("trigger_hint_counter_delta_edit",n).replace("{target}",v(b)+c)):(g&&$.push(s("trigger_hint_now",n).replace("{value}",v(_)+c)),$.push(s("trigger_hint_counter_abs",n).replace("{target}",v(b)+c)))}else if(this._triggerType==="runtime"){let b=parseFloat(this._triggerRuntimeHours);if(isNaN(b))return h;$.push(s("trigger_hint_runtime",n).replace("{hours}",v(b))),$.push(s("trigger_hint_state_now",n).replace("{value}",String(i.state)))}else if(this._triggerType==="state_change"){let b=parseInt(this._triggerTargetChanges,10)||1,I=this._triggerToState.trim();$.push((I?s("trigger_hint_state_change_to",n).replace("{state}",I):s("trigger_hint_state_change",n)).replace("{count}",String(b))),$.push(s("trigger_hint_state_now",n).replace("{value}",String(i.state)))}else if(this._triggerType==="due_date"){let b=parseInt(this._triggerDaysBefore,10)||0;$.push(b===0?s("trigger_hint_due_date_same_day",n):Ce("trigger_hint_due_date","trigger_hint_due_date_one",b,n,"days"));let I=u==null?"":String(u);I&&!isNaN(Date.parse(I))&&$.push(s("trigger_hint_due_date_now",n).replace("{date}",H(I,n)))}return $.length?l`<div class="trigger-live-hint">${$.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?l`
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
      `:this._triggerType==="counter"?l`
        <ms-textfield
          label="${s("target_value",e)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${t=>this._triggerTargetValue=t.target.value}
        ></ms-textfield>
        <label>
          <input
            type="checkbox"
            .checked=${this._triggerDeltaMode}
            @change=${t=>this._triggerDeltaMode=t.target.checked}
          />
          ${s("delta_mode",e)}
        </label>
        ${this._triggerDeltaMode?l`
              <ms-textfield
                label="${s("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${t=>this._triggerBaselineValue=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?s("baseline_start_help_edit",e):s("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?l`<div class="baseline-effective">
                      ${s("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:h}
              </div>
            `:h}
      `:this._triggerType==="state_change"?l`
        ${this._renderStateField({label:s("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:t=>this._triggerFromState=t})}
        <div class="field-help">${s("state_value_help",e)}</div>
        ${this._renderStateField({label:s("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:t=>this._triggerToState=t})}
        <ms-textfield
          label="${s("target_changes",e)}"
          type="number"
          min=${Vt[0]}
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?l`<div class="field-help">${s("state_latch_help",e)}</div>`:h}
        <ms-textfield
          label="${s("for_at_least_minutes",e)}"
          type="number"
          min=${Bt[0]}
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?l`
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
      `:this._triggerType==="due_date"?l`
        <ms-textfield
          label="${s("days_before",e)}"
          type="number"
          step="1"
          min=${xe[0]}
          max=${xe[1]}
          .value=${this._triggerDaysBefore}
          @input=${t=>this._triggerDaysBefore=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("days_before_help",e)}</div>
      `:h}_section(e,t,i){return l`<section class="form-section ${e}">
      <h3 class="section-title">${t}</h3>
      ${i}
    </section>`}_renderIdentity(e){return l`
          ${this._taskId===null&&this._objectChoices.length>0?l`
            <div class="select-row">
              <label>${s("object",e)}</label>
              <select aria-label=${s("object",e)}
                .value=${this._entryId}
                @change=${t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(t=>l`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
              </select>
            </div>
          `:h}
          <ms-textfield
            label="${s("task_name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${s("maintenance_type",e)}</label>
            <select aria-label=${s("maintenance_type",e)}
              .value=${this._type}
              @change=${t=>this._type=t.target.value}
            >
              ${ps.map(t=>l`<option value=${t} ?selected=${t===this._type}>${s(t,e)}</option>`)}
            </select>
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
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${t=>this._enabled=t.target.checked}
            />
            ${s("task_enabled",e)}
          </label>
    `}_renderDetails(e){return l`
      <details class="details-section" ?open=${this._detailsOpen}>
        <summary>${s("task_section_details",e)}</summary>
        <div class="select-row">
          <label>${s("priority",e)}</label>
          <select aria-label=${s("priority",e)}
            .value=${this._priority}
            @change=${t=>this._priority=t.target.value}
          >
            ${rt.map(t=>l`<option value=${t} ?selected=${t===this._priority}>${s("priority_"+t,e)}</option>`)}
          </select>
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
      </details>
    `}_renderScheduleSection(e){return this._section("schedule-section",s("task_section_schedule",e),l`
          <div class="select-row">
            <label>${s("schedule_type",e)}</label>
            <select aria-label=${s("schedule_type",e)}
              .value=${this._scheduleType}
              @change=${t=>this._scheduleType=t.target.value}
            >
              ${hs.map(t=>l`<option value=${t} ?selected=${t===this._scheduleType}>${s(t,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?l`
                <ms-textfield
                  label="${s("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${t=>this._intervalDays=t.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${s("interval_anchor",e)}</label>
                  <select aria-label=${s("interval_anchor",e)}
                    .value=${this._intervalAnchor}
                    @change=${t=>this._intervalAnchor=t.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${s("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${s("anchor_planned",e)}</option>
                  </select>
                  <div class="field-help anchor-help">${s("interval_anchor_hint",e)}</div>
                </div>
              `:h}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?l`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${e}
                  label="${s("due_date",e)}"
                  .value=${this._dueDate}
                  @value-changed=${t=>this._dueDate=t.detail.value}
                ></ms-date-field>
              `:h}
          ${this.scheduleTimeEnabled&&ai.includes(this._scheduleType)?l`
            <label class="checkbox-row schedule-time-toggle">
              <input type="checkbox" .checked=${this._scheduleTimeOn}
                @change=${t=>this._scheduleTimeOn=t.target.checked} />
              <span>${s("schedule_time_toggle",e)}</span>
            </label>
            ${this._scheduleTimeOn?l`
              <ms-date-field
                kind="time"
                .hass=${this.hass}
                .lang=${e}
                .value=${this._scheduleTime}
                helper="${s("schedule_time_help",e)}"
                @value-changed=${t=>this._scheduleTime=t.detail.value}
              ></ms-date-field>
            `:h}
          `:h}
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
            min=${et[0]}
            max=${et[1]}
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
    `)}_renderTriggerSection(e){return this._scheduleType!=="sensor_based"?h:this._section("trigger-section",s("task_section_trigger",e),l`
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?l`
            ${this._entityPickerFallback?l`
              <ms-textfield
                label="${s("environmental_entity_optional",e)}"
                helper="${s("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${t=>this._environmentalEntity=t.target.value.trim()}
              ></ms-textfield>
            `:l`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:ii}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>s("environmental_entity_optional",e)}
              .computeHelper=${()=>s("environmental_entity_helper",e)}
              @value-changed=${t=>{this._environmentalEntity=(t.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):h}
          `:h}
    `)}_renderCompletionSection(e){return this._section("completion-section",s("task_section_completion",e),l`
          ${this._type==="reading"?l`
                <ms-textfield
                  label="${s("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:h}
          ${this.checklistsEnabled?l`
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
          `:h}
          ${this._partsLoadFailed?l`<div class="field-help parts-load-failed">${s("parts_load_failed",e)}</div>`:h}
          ${this._isFleetTask?l`<div class="field-help parts-fleet-hint">${s("task_parts_fleet_hint",e)}</div>`:this.parts.length||this._foreignOwners.length?l`
                <div class="field">
                  <label>${s("consumes_parts_label",e)}</label>
                  ${this.parts.map(t=>this._renderConsumesRow(t))}
                  ${this._foreignOwners.length?l`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${s("shared_parts_other_objects",e)}</summary>
                          <div class="field-help">${s("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>l`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(i=>this._renderConsumesRow(i,t.entry_id))}
                            `)}
                        </details>
                      `:h}
                </div>
              `:h}
          <div class="field-label">${s("require_on_completion",e)}</div>
          <div class="required-completion">
            ${it.map(t=>l`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(t)}
                  @change=${i=>this._toggleRequired(t,i.target.checked)}
                />
                <span>${s(ue[t],e)}</span>
              </label>
            `)}
          </div>
          ${this._availableTags.length>0?l`
              <div class="select-row">
                <label>${s("nfc_tag_id_optional",e)}</label>
                <select aria-label=${s("nfc_tag_id_optional",e)}
                  .value=${this._nfcTagId}
                  @change=${t=>this._nfcTagId=t.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(t=>l`<option value=${t.id} ?selected=${t.id===this._nfcTagId}>${t.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:l`
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
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${this._requireTagScan}
              @change=${t=>this._requireTagScan=t.target.checked}
            />
            <span>${s("require_tag_scan",e)}</span>
          </label>
          ${this._requireTagScan?l`<div class="field-help">${s("require_tag_scan_help",e)}</div>`:h}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${t=>this._allowSkip=!t.target.checked}
            />
            <span>${s("disallow_skip",e)}</span>
          </label>
          ${this._allowSkip?h:l`<div class="field-help">${s("disallow_skip_help",e)}</div>`}
          ${this._renderQuickComplete(e)}
          ${this._renderCompleteWhen(e)}
          ${this._renderPhasesEditor(e)}
          ${this._renderCompletionActionsSection(e)}
    `)}_renderPeopleSection(e){return this._section("people-section",s("task_section_people",e),l`
          <div class="select-row">
            <label>${s("responsible_user",e)}</label>
            <select aria-label=${s("responsible_user",e)}
              .value=${this._responsibleUserId||""}
              @change=${t=>{let i=t.target.value;this._responsibleUserId=i||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${s("no_user_assigned",e)}</option>
              ${this._availableUsers.map(t=>l`<option value=${t.id} ?selected=${t.id===this._responsibleUserId}>${t.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?l`
            <div class="field">
              <label>${s("task_shared_with",e)}</label>
              <div class="field-help">${s("task_shared_with_help",e)}</div>
              ${this._responsibleUserId&&this._assigneePool.length>0&&!(this._assigneePool.length>=2&&this._rotationStrategy)?l`<div class="field-help shared-responsible-wins">${s("task_shared_responsible_wins",e)}</div>`:h}
              <div class="assignee-pool">
                ${this._availableUsers.map(t=>l`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(t.id)}
                      @change=${()=>this._toggleAssignee(t.id)} />
                    <span>${t.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?l`
              <div class="select-row">
                <label>${s("rotation_strategy",e)}</label>
                <select aria-label=${s("rotation_strategy",e)}
                  .value=${this._rotationStrategy}
                  @change=${t=>this._rotationStrategy=t.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",e)}</option>
                  ${ni.map(t=>l`<option value=${t} ?selected=${t===this._rotationStrategy}>${s("rotation_"+t,e)}</option>`)}
                </select>
              </div>`:h}
          `:h}
    `)}_renderNotificationsSection(e){return this._section("notifications-section",s("task_section_notifications",e),l`
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._notifyEnabled}
              @change=${t=>this._notifyEnabled=!t.target.checked}
            />
            <span>${s("no_notifications",e)}</span>
          </label>
          ${this._notifyEnabled?h:l`<div class="field-help">${s("no_notifications_help",e)}</div>`}
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${s("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${t=>this._notifyIcon=t.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||st(this._type)}></ha-icon>
            ${s("notify_icon_hint",e).replace("{default}",st(this._type))}
          </div>
          ${this._renderMirrorTodo(e)}
    `)}_renderMirrorTodo(e){let t=this.mirrorTodoDefault;if(!t.length)return l`
          <div class="field mirror-todo-field">
            ${this._renderMirrorTodoPicker(e)}
            <div class="field-help">${s("task_mirror_todo_hint",e)}</div>
          </div>`;let i=t.map(o=>String(this.hass?.states?.[o]?.attributes?.friendly_name??o)).join(", "),n={default:s("task_mirror_todo_default",e).replace("{lists}",i),own:s("task_mirror_todo_own",e),none:s("task_mirror_todo_none",e)};return l`
          <div class="field mirror-todo-field">
            <div class="mirror-todo-choice" role="radiogroup" aria-label=${s("task_mirror_todo",e)}>
              <div class="field-label">${s("task_mirror_todo",e)}</div>
              ${Object.keys(n).map(o=>l`
                <label class="mirror-todo-option">
                  <input type="radio" name="mirror-todo" value=${o} .checked=${this._mirrorTodoMode===o}
                    @change=${()=>this._mirrorTodoMode=o} />
                  ${n[o]}
                </label>
              `)}
            </div>
            ${this._mirrorTodoMode==="own"?this._renderMirrorTodoPicker(e):h}
            ${this._mirrorTodoMode!=="none"?l`<div class="field-help">${s("task_mirror_todo_hint",e)}</div>`:h}
          </div>`}_renderMirrorTodoPicker(e){return l`
            ${this._entityPickerFallback?l`
              <ms-textfield
                label="${s("task_mirror_todo",e)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${t=>{this._mirrorTodoEntities=t.target.value.split(",").map(i=>i.trim()).filter(Boolean)}}
              ></ms-textfield>
            `:l`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"]}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>s("task_mirror_todo",e)}
                @value-changed=${t=>{let i=(t.detail.value.mirror_todo_entities||[]).filter(Boolean);this._mirrorTodoEntities=i}}
              ></ha-form>`}`}render(){if(!this._open)return l``;let e=this._lang,t=this._taskId?s("edit_task",e):s("new_task",e),i=this._seriesIndex+1<this._series.length;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">
          ${t}
          ${this._series.length>1?l`<span class="series-position">${s("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length))}</span>`:h}
        </div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:h}
          ${this._warning?l`<div class="error warning">${this._warning}</div>`:h}
          ${this._renderIdentity(e)}
          ${this._renderScheduleSection(e)}
          ${this._renderTriggerSection(e)}
          ${this._renderCompletionSection(e)}
          ${this._renderPeopleSection(e)}
          ${this._renderNotificationsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${s("cancel",e)}</ha-button>
          ${i?l`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${s("task_series_skip",e)}
              </ha-button>`:h}
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}
          >
            ${this._loading?s("saving",e):s(i?"task_series_save_next":"save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};m._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calMonths","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),m.styles=[ce,zt,w`
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
      border-radius: 6px;
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
    @media (max-width: 600px) {
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
      border-radius: 6px;
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
  `],d([f({attribute:!1})],m.prototype,"hass",2),d([f({type:Boolean,attribute:"checklists-enabled"})],m.prototype,"checklistsEnabled",2),d([f({type:Boolean,attribute:"schedule-time-enabled"})],m.prototype,"scheduleTimeEnabled",2),d([f({type:Boolean,attribute:"completion-actions-enabled"})],m.prototype,"completionActionsEnabled",2),d([f({type:Boolean,attribute:"adaptive-feature"})],m.prototype,"adaptiveFeature",2),d([f({type:Boolean,attribute:"seasonal-feature"})],m.prototype,"seasonalFeature",2),d([f({type:Boolean,attribute:"environmental-feature"})],m.prototype,"environmentalFeature",2),d([f({type:Number,attribute:"default-warning-days"})],m.prototype,"defaultWarningDays",2),d([f({attribute:!1})],m.prototype,"mirrorTodoDefault",2),d([p()],m.prototype,"parts",2),d([p()],m.prototype,"_foreignOwners",2),d([p()],m.prototype,"_open",2),d([p()],m.prototype,"_entityPickerFallback",2),d([p()],m.prototype,"_loading",2),d([p()],m.prototype,"_error",2),d([p()],m.prototype,"_warning",2),d([p()],m.prototype,"_entryId",2),d([p()],m.prototype,"_taskId",2),d([p()],m.prototype,"_series",2),d([p()],m.prototype,"_seriesIndex",2),d([p()],m.prototype,"_isFleetTask",2),d([p()],m.prototype,"_objectChoices",2),d([p()],m.prototype,"_name",2),d([p()],m.prototype,"_type",2),d([p()],m.prototype,"_scheduleType",2),d([p()],m.prototype,"_intervalDays",2),d([p()],m.prototype,"_intervalUnit",2),d([p()],m.prototype,"_dueDate",2),d([p()],m.prototype,"_warningDays",2),d([p()],m.prototype,"_earliestCompletionDays",2),d([p()],m.prototype,"_intervalAnchor",2),d([p()],m.prototype,"_weekdays",2),d([p()],m.prototype,"_nth",2),d([p()],m.prototype,"_nthWeekday",2),d([p()],m.prototype,"_domDay",2),d([p()],m.prototype,"_domLastDay",2),d([p()],m.prototype,"_domBusiness",2),d([p()],m.prototype,"_calOffset",2),d([p()],m.prototype,"_calMonths",2),d([p()],m.prototype,"_calendarEntity",2),d([p()],m.prototype,"_seasonMonths",2),d([p()],m.prototype,"_endsMode",2),d([p()],m.prototype,"_endsCount",2),d([p()],m.prototype,"_endsUntil",2),d([p()],m.prototype,"_schedulePreview",2),d([p()],m.prototype,"_schedulePreviewEnded",2),d([p()],m.prototype,"_notes",2),d([p()],m.prototype,"_documentationUrl",2),d([p()],m.prototype,"_customIcon",2),d([p()],m.prototype,"_notifyIcon",2),d([p()],m.prototype,"_priority",2),d([p()],m.prototype,"_labels",2),d([p()],m.prototype,"_detailsOpen",2),d([p()],m.prototype,"_mirrorTodoEntities",2),d([p()],m.prototype,"_mirrorTodoMode",2),d([p()],m.prototype,"_completeWhenEntity",2),d([p()],m.prototype,"_completeWhenState",2),d([p()],m.prototype,"_enabled",2),d([p()],m.prototype,"_triggerEntityId",2),d([p()],m.prototype,"_triggerEntityIds",2),d([p()],m.prototype,"_triggerEntityLogic",2),d([p()],m.prototype,"_triggerAttribute",2),d([p()],m.prototype,"_triggerType",2),d([p()],m.prototype,"_triggerAbove",2),d([p()],m.prototype,"_triggerBelow",2),d([p()],m.prototype,"_triggerEquals",2),d([p()],m.prototype,"_triggerNotEquals",2),d([p()],m.prototype,"_triggerForMinutes",2),d([p()],m.prototype,"_triggerCombinator",2),d([p()],m.prototype,"_triggerTargetValue",2),d([p()],m.prototype,"_triggerDeltaMode",2),d([p()],m.prototype,"_triggerBaselineValue",2),d([p()],m.prototype,"_liveBaselineValue",2),d([p()],m.prototype,"_autoCompleteOnRecovery",2),d([p()],m.prototype,"_holdUntilDone",2),d([p()],m.prototype,"_triggerFromState",2),d([p()],m.prototype,"_triggerToState",2),d([p()],m.prototype,"_triggerTargetChanges",2),d([p()],m.prototype,"_triggerRuntimeHours",2),d([p()],m.prototype,"_triggerDaysBefore",2),d([p()],m.prototype,"_triggerRuntimeMaxSession",2),d([p()],m.prototype,"_triggerOnStates",2),d([p()],m.prototype,"_triggerDetailAttribute",2),d([p()],m.prototype,"_compoundLogic",2),d([p()],m.prototype,"_compoundConditions",2),d([p()],m.prototype,"_suggestedAttributes",2),d([p()],m.prototype,"_availableAttributes",2),d([p()],m.prototype,"_entityDomain",2),d([p()],m.prototype,"_lastPerformed",2),d([p()],m.prototype,"_nfcTagId",2),d([p()],m.prototype,"_requireTagScan",2),d([p()],m.prototype,"_allowSkip",2),d([p()],m.prototype,"_notifyEnabled",2),d([p()],m.prototype,"_readingUnit",2),d([p()],m.prototype,"_readings",2),d([p()],m.prototype,"_consumesParts",2),d([p()],m.prototype,"_consumesQtyText",2),d([p()],m.prototype,"_partsLoadFailed",2),d([p()],m.prototype,"_availableTags",2),d([p()],m.prototype,"_responsibleUserId",2),d([p()],m.prototype,"_assigneePool",2),d([p()],m.prototype,"_rotationStrategy",2),d([p()],m.prototype,"_availableUsers",2),d([p()],m.prototype,"_checklistText",2),d([p()],m.prototype,"_phaseDefs",2),d([p()],m.prototype,"_phaseSeq",2),d([p()],m.prototype,"_requiredCompletion",2),d([p()],m.prototype,"_scheduleTime",2),d([p()],m.prototype,"_scheduleTimeOn",2),d([p()],m.prototype,"_actionService",2),d([p()],m.prototype,"_actionTargetEntity",2),d([p()],m.prototype,"_actionSkipAuto",2),d([p()],m.prototype,"_actionPresent",2),d([p()],m.prototype,"_actionData",2),d([p()],m.prototype,"_actionDataJsonFallback",2),d([p()],m.prototype,"_actionTesting",2),d([p()],m.prototype,"_actionTestResult",2),d([p()],m.prototype,"_actionTestError",2),d([p()],m.prototype,"_quickOn",2),d([p()],m.prototype,"_qcNotes",2),d([p()],m.prototype,"_qcCost",2),d([p()],m.prototype,"_qcDuration",2),d([p()],m.prototype,"_qcFeedback",2),d([p()],m.prototype,"_environmentalEntity",2),d([p()],m.prototype,"_environmentalAttribute",2),d([p()],m.prototype,"_adaptiveEnabled",2),d([p()],m.prototype,"_adaptiveAlpha",2),d([p()],m.prototype,"_adaptiveMin",2),d([p()],m.prototype,"_adaptiveMax",2),d([p()],m.prototype,"_adaptiveSeasonal",2),d([p()],m.prototype,"_adaptivePrediction",2),d([p()],m.prototype,"_conditionAttrOptions",2);var nt=m;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",nt);async function ys(r,a,e){let t=r.auth;if(t?.expired&&t.refreshAccessToken)try{await t.refreshAccessToken()}catch{}return fetch(a,{...e,headers:{...e.headers??{},Authorization:`Bearer ${t?.data?.access_token??""}`}})}var bs=100*1024*1024,_n=500*1024*1024;async function $s(r,a,e,t="doc_too_large",i=[]){let n=await ys(r,a,{method:"POST",body:e});if(n.status===413)throw new Error(t);if(!n.ok){let o=await n.json().catch(()=>null);throw typeof o?.code=="string"&&i.includes(o.code)?new Error(o.code):new Error("doc_upload_failed")}return await n.json()}async function xs(r,a,e,t,i){if(e.size>bs)throw new Error("doc_too_large");let n=new FormData;n.append("entry_id",a);for(let c of t)n.append("tags",c);i&&n.append("purpose",i),n.append("file",e,e.name);let o=await $s(r,"/api/maintenance_supporter/document/upload",n);if(!o.id)throw new Error("doc_upload_failed");return{id:o.id,deduped:!!o.deduped,duplicate_in_object:o.duplicate_in_object??null}}async function _i(r,a,e){return(await xs(r,a,e,["photo"],"completion")).id}async function at(r,a,e){await Promise.all(e.map(t=>r.connection.sendMessagePromise({type:"maintenance_supporter/documents/discard_upload",entry_id:a,doc_id:t}).catch(()=>{})))}var _e=class{constructor(a,e){this.host=a;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,a.addController(this)}hostConnected(){}get ids(){return this.photos.map(a=>a.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(a){return this.errorKey?s(this.errorKey,a).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(a=[]){this._endSession(),this._revokeAll(),this.photos=a.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(a){if(a.length===0)return;let e=this._session,t=this.opts.hass(),i=this.opts.entryId(),n=a.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let o of n){let c=await _i(t,i,o);if(e!==this._session){at(t,i,[c]);return}this.uploadedIds=[...this.uploadedIds,c],this._uploadEntry.set(c,i),this.photos=[...this.photos,{id:c,preview:URL.createObjectURL(o)}],this.host.requestUpdate()}a.length>n.length&&(this.errorKey="photos_limit")}catch(o){if(e!==this._session)return;this.errorKey=o instanceof Error&&o.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(a){let e=this.photos.find(t=>t.id===a);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(t=>t.id!==a),this.uploadedIds.includes(a)&&(this.uploadedIds=this.uploadedIds.filter(t=>t!==a),this._discard([a])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let a=this.uploadedIds;this.uploadedIds=[],this._discard(a)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(a){let e=new Map;for(let i of a){let n=this._uploadEntry.get(i)??this.opts.entryId();this._uploadEntry.delete(i),e.set(n,[...e.get(n)??[],i])}let t=this.opts.hass();for(let[i,n]of e)at(t,i,n)}_revokeAll(){for(let a of this.photos)a.preview&&URL.revokeObjectURL(a.preview)}};function Fe(){if(window.externalApp!==void 0)return!0;let a=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(a)&&/Android/.test(a)}var ot={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraLabel:"msp-camera-label",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort",areaSort:"msp-area-sort",objectTreeOpen:"msp-object-tree-open"};function mi(r){try{return localStorage.getItem(r)}catch{return null}}function gi(r,a){try{localStorage.setItem(r,a)}catch{}}function xi(){if(!Fe())return!1;let r=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!r&&typeof r.getUserMedia=="function"}var ks=1920,ws=.88,Es={retryMs:500,windowMs:5e3},Ts=new Set(["NotReadableError","AbortError","TrackStartError"]),fi=80,ki=/back|rear|environment|rück|hinten/i,vi=/front|user|selfie|vorne/i;function yi(r){let a=/camera2?\s*(\d+)/i.exec(r);return a?Number(a[1]):Number.MAX_SAFE_INTEGER}function bi(r,a){if(a){let t=r.find(i=>i.label===a);if(t)return t}return r.filter(t=>t.label&&ki.test(t.label)).sort((t,i)=>yi(t.label)-yi(i.label))[0]??null}var $i=r=>r?.name||"Error",Ss=r=>r?.message||"",L=class extends T{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...Es};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let i=mi(ot.cameraLabel),n=await this._enumerate(t);if(!this._live(e))return;let o=bi(n,i),c="refused";if(o&&(c=await this._openPatiently(t,e,this._byDevice(o))),c==="cancelled")return;if(c!=="ok"){if(c=await this._openPatiently(t,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),c==="cancelled")return;if(c!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(n=await this._enumerate(t),!this._live(e)){this._stopStream();return}}if(this._devices=n,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let u=o?null:bi(n,i),_=this._deviceIndex>=0?n[this._deviceIndex]:void 0;if(!u||u.deviceId===_?.deviceId)return;let g=await this._replace(t,e,[this._byDevice(u)],this._restoreCandidates(_));if(g!=="cancelled"){if(g==="lost"){this._unavailable("camera_lost");return}this._settle(g)}}async _openPatiently(e,t,i){let n=Date.now();for(;;){let o;try{o=await e.getUserMedia({video:i.video,audio:!1})}catch(c){let u=$i(c),_=Ss(c);if(this._lastError=u,this._note(`${i.what} \u2192 ${u}${_&&_!==u?`: ${_}`:""}`),!this._live(t))return"cancelled";if(!Ts.has(u))return"refused";if(Date.now()-n+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(g=>setTimeout(g,this.timing.retryMs)),!this._live(t))return"cancelled";continue}if(!this._live(t)){for(let c of o.getTracks())c.stop();return"cancelled"}return this._stream=o,this._note(`${i.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,t,i,n){this._switching=!0,this._stopStream();try{for(let o of i){let c=await this._openPatiently(e,t,o);if(c==="ok")return o;if(c==="cancelled")return c;if(c==="busy"){o.deviceId&&this._refused.add(o.deviceId);break}}for(let o of n){let c=await this._openPatiently(e,t,o);if(c==="ok")return"restored";if(c==="cancelled")return c}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let i=this._indexOfCurrent();return i>=0&&(this._deviceIndex=i),this._attach(),!1}this._switchFailed=!1;let t=e.deviceId?this._devices.findIndex(i=>i.deviceId===e.deviceId):-1;return this._deviceIndex=t>=0?t:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,t){let i=[],n=e?.deviceId||t;return n&&i.push({video:{deviceId:{exact:n}},what:`${e?.label||"previous camera"} (back again)`,deviceId:n}),i.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),i}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let t=(await e.enumerateDevices()).filter(i=>i.kind==="videoinput"&&!!i.deviceId);return this._note(`cameras: ${t.map(i=>i.label||"(no label)").join(" | ")||"none listed"}`),t}catch(t){return this._note(`enumerateDevices \u2192 ${$i(t)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let t=e.getSettings().deviceId,i=t?this._devices.findIndex(n=>n.deviceId===t):-1;return i>=0?i:e.label?this._devices.findIndex(n=>n.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],t=e?.getSettings().facingMode;if(t==="user"||t==="environment")return t;let i=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return vi.test(i)?"user":ki.test(i)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let t=e.getSettings(),i=t.width&&t.height?`${t.width}\xD7${t.height}`:"size ?";return[e.label||"no label",i,t.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>fi&&this._log.splice(1,this._log.length-fi)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let t=this._gen,i=this._deviceIndex,n=i>=0?this._devices[i]:void 0,o=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||n?.deviceId,c=this._facing==="user"?"environment":"user",u=this._nextCameras(i,o);!u.length&&this._refused.size&&(this._refused.clear(),u=this._nextCameras(i,o)),this._note(`switch from ${n?.label||"unknown camera"}`);let _=[...u.map(g=>this._byDevice(this._devices[g])),{video:{facingMode:{exact:c}},what:`facing ${c} (exact)`},{video:{facingMode:{ideal:c}},what:`facing ${c}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let g=await this._replace(e,t,_,this._restoreCandidates(n,o));if(g==="cancelled")return;if(g==="lost"){this._unavailable("camera_lost");return}if(g!=="restored"&&!g.deviceId){if(this._isCamera(o,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=c}if(this._settle(g)&&g!=="restored"&&g.deviceId){let v=this._devices[this._deviceIndex]?.label??"";v&&gi(ot.cameraLabel,vi.test(v)?"":v)}}finally{this._busy=!1}}_nextCameras(e,t){let i=this._devices.length,n=[];for(let o=1;o<=(e<0?i:i-1);o++){let c=(e+o)%i,u=this._devices[c].deviceId;u===t||this._refused.has(u)||n.push(c)}return n}_isCamera(e,t){let i=this._stream?.getVideoTracks()[0]?.getSettings();return e&&i?.deviceId?i.deviceId===e:!!i?.facingMode&&i.facingMode===t}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let t of this._stream?.getTracks()??[])t.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),t=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),t=!0)}catch{}if(!t){let i=this.shadowRoot?.querySelector(".details textarea");if(i){i.focus(),i.select();try{t=document.execCommand("copy")}catch{t=!1}}}this._copied=t}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let t=e.videoWidth||640,i=e.videoHeight||480,n=Math.min(1,ks/Math.max(t,i)),o=document.createElement("canvas");o.width=Math.round(t*n),o.height=Math.round(i*n);let c=o.getContext("2d");if(!c)throw new Error("no_canvas");c.drawImage(e,0,0,o.width,o.height);let u=await new Promise(v=>o.toBlob(v,"image/jpeg",ws));if(!u)throw new Error("no_blob");let _=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),g=new File([u],`photo-${_}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:g},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return h;let e=this.lang,t=this._busy||this._switching;return l`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${s("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switching?l`<div class="switching" role="status">${s("camera_switching",e)}</div>`:h}
        ${this._switchFailed?l`<div class="switch-note" role="status">
              <div>${s("camera_not_answered",e)}</div>
              <details class="details">
                <summary>${s("camera_diagnostics",e)}</summary>
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${s(this._copied?"camera_copied":"camera_copy",e)}</button>
              </details>
            </div>`:h}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${s("cancel",e)}</button>
          ${this._devices.length>1?l`<button type="button" class="switch" ?disabled=${t} title=${s("camera_switch_lens",e)} aria-label=${s("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:h}
          <button type="button" class="shoot" ?disabled=${t} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${s("camera_capture_shoot",e)}</span>
          </button>
        </div>
      </div>
    `}};L.styles=w`
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
      border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 6px; padding: 6px; resize: vertical;
    }
    .copy { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); padding: 6px 14px; font-size: 13px; }
    .shoot { background: var(--primary-color, #03a9f4); color: #fff; border: none; font-weight: 600; }
    .shoot[disabled] { opacity: 0.6; cursor: default; }
    .shoot ha-icon { --mdc-icon-size: 22px; }
  `,d([f({type:String})],L.prototype,"lang",2),d([p()],L.prototype,"_open",2),d([p()],L.prototype,"_busy",2),d([p()],L.prototype,"_switching",2),d([p()],L.prototype,"_devices",2),d([p()],L.prototype,"_deviceIndex",2),d([p()],L.prototype,"_switchFailed",2),d([p()],L.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",L);var De=w`
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
`,M=class extends T{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=Fe();this._inAppCamera=xi()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target,i=Array.from(t.files??[]);t.value="",this._emit(i)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return h;let e=this.lang,t=this._locked?"disabled":"",i=this.busy?s("uploading",e):s("doc_camera",e),n=s(this._singlePick?"choose_photo":"choose_photos",e);return l`
      <div class="photo-pickers">
        ${this.showCamera?l`<label class="photo-pick photo-pick-camera ${t}" role="button" tabindex="0"
              aria-label=${i} title=${this.compact?i:h}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?h:l`<span>${i}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:h}
        ${this.showGallery?l`<label class="photo-pick photo-pick-gallery ${t}" role="button" tabindex="0"
              aria-label=${n} title=${this.compact?n:h}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?h:l`<span>${n}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:h}
      </div>
      ${this.showGallery&&this._singlePick?l`<div class="photo-android-hint">${s("photos_android_hint",e)}</div>`:h}
      ${this.showCamera&&this._inAppCamera?l`<ms-camera-capture .lang=${e}
            @photo-captured=${o=>this._emit([o.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:h}
    `}};d([f({type:String})],M.prototype,"lang",2),d([f({type:Boolean})],M.prototype,"disabled",2),d([f({type:Boolean})],M.prototype,"busy",2),d([f({type:String})],M.prototype,"accept",2),d([f({type:Boolean})],M.prototype,"showCamera",2),d([f({type:Boolean})],M.prototype,"showGallery",2),d([f({type:Boolean})],M.prototype,"compact",2),d([f({type:Number})],M.prototype,"remaining",2),d([p()],M.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",M);var me=X,y=class extends T{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new _e(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={};this.prefill=null}open(e={}){if(this._open)return;this._open=!0,this.viaTagScan=!!e.viaTagScan;let t=this.prefill;this._notes=t?.notes??"",this._cost=t?.cost!=null?String(t.cost):"",this._duration=t?.duration!=null?String(t.duration):"",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((i,n)=>[String(n),!!this.checklistPrefill[i]]).filter(([,i])=>i)),this._feedback=t?.feedback??"needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(i=>[B(i),{...i}])),this._usedQtyText={}}_rangeError(e,t){let i=this.lang;return s("settings_value_out_of_range",i).replace("{min}",S(e,i,{maximumFractionDigits:2})).replace("{max}",S(t,i,{maximumFractionDigits:2}))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId},t=this._notes.trim();if(t&&(e.notes=t),this._cost){let c=parseFloat(this._cost);isNaN(c)||(e.cost=c)}let i=se(this._duration);if(i!==null&&(e.duration=i),this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(G(this._completedAt)>Date.now()){this._error=s("completed_at_future_error",this.lang);return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let c={};for(let u of this.readings){let _=(this._readingValues[u.id]??"").trim();if(_==="")continue;let g=parseFloat(_.replace(",","."));isNaN(g)||(c[u.id]=g)}Object.keys(c).length>0&&(e.reading_values=c)}else if(this._readingValue!==""){let c=parseFloat(this._readingValue);isNaN(c)||(e.reading_value=c)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let c=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(c)||c<pe[0]||c>pe[1]){this._error=this._rangeError(...pe);return}e.restock_quantity=c}if(this.parts.length>0){let c=[];for(let[u,_]of Object.entries(this._usedParts)){let g=this._usedQtyText[u],v=g===void 0?_.quantity:parseFloat(g.replace(",","."));if(!Number.isFinite(v)||v<me[0]||v>me[1]){this._error=this._rangeError(...me);return}c.push({..._,quantity:v})}e.used_parts=c.map(u=>u.entry_id?{part_id:u.part_id,quantity:u.quantity,entry_id:u.entry_id}:{part_id:u.part_id,quantity:u.quantity})}let n=await A(this,e,{busy:c=>{this._loading=c},lang:this.lang,fallbackKey:"save_error",onError:c=>{this._error=c}});if(n===void 0)return;this._photos.markAttached(),this._open=!1;let o={entryId:this.entryId,taskId:this.taskId,taskName:this.taskName,undo:n?.undo===!0};this.dispatchEvent(new CustomEvent("task-completed",{detail:o}))}_renderReadingField(e,t){let i=this._completedAt?G(this._completedAt):NaN,n=At(this.readingHistory,e.id,isNaN(i)?void 0:i),o=e.unit||this.readingUnit,c=(this._readingValues[e.id]??"").trim(),u=c===""?NaN:parseFloat(c.replace(",",".")),_=n!==void 0&&!isNaN(u)&&u<n.value,g=n!==void 0?S(n.value,t,{maximumFractionDigits:3}):"";return l`
      <label class="field reading-field">
        <span class="field-label">${e.name}${o?` (${o})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${n!==void 0?s("reading_last",t).replace("{value}",g):""}
          .value=${this._readingValues[e.id]??""}
          @input=${v=>{this._readingValues={...this._readingValues,[e.id]:v.target.value}}} />
        ${_?l`<span class="reading-warn">${s("reading_below_last",t).replace("{value}",g)}</span>`:h}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_demands(e){return this.requiredFields.includes(e)}_req(e){return this._demands(e)?l`<span class="req-mark" aria-hidden="true">*</span>`:h}_purchaseSuggestion(){if(this.restockDefault===null)return null;let e=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(e)||e<=0?null:Math.round(this.restockUnitCost*e*100)/100}_partsValues(){let e={booked:null,info:null};if(this.restockDefault!==null||!this.parts.length)return e;for(let t of Object.values(this._usedParts)){let i=this.parts.find(c=>B({part_id:c.id,entry_id:c.entry_id})===B(t)),n=Wt(i);if(n===null)continue;let o=He(i,this.partsCostMode)==="use"?"booked":"info";e[o]=(e[o]??0)+n*(t.quantity||1)}for(let t of["booked","info"])e[t]!==null&&(e[t]=Math.round(e[t]*100)/100);return e}_renderCostSuggestion(e){let t=this._purchaseSuggestion();if(this.restockDefault!==null){let c=this.partsCostMode==="use"?l`<div class="cost-note">${s("cost_purchase_use_hint",e)}</div>`:h;if(this._cost.trim()!==""||t==null||t<=0)return c;let u=D(t,this.currencySymbol,e);return l`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(Math.round(t*100)/100)}
        >${s("cost_from_parts",e).replace("{amount}",u)}</button>${c}`}let{booked:i,info:n}=this._partsValues(),o=(c,u)=>c!=null&&c>0?l`<div class="cost-note">${s(u,e).replace("{amount}",D(c,this.currencySymbol,e))}</div>`:h;return l`${o(i,"cost_parts_booked")}${o(n,"cost_parts_info")}`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=`${kt()}:00`}render(){if(!this._open)return l``;let e=this.lang||C(this.hass),t=this._error||this._photos.errorText(e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?l`<div class="phase-line">${s("phase_current",e)}: ${this.phaseLabel}</div>`:h}
        ${this.requireTagScan&&!this.viaTagScan?l`<div class="scan-required-note">${s("require_tag_scan_hint",e)}</div>`:h}
        <div class="content">
          ${t?l`<div class="error">${t}</div>`:h}
          ${this.checklist.length>0?l`
            <div class="checklist-section">
              <label class="checklist-label">${s("checklist",e)}</label>
              ${this.checklist.map((i,n)=>l`
                <label class="checklist-item">
                  <input type="checkbox" .checked=${!!this._checklistState[String(n)]}
                    @change=${()=>this._toggleCheck(n)} />
                  <span>${i}</span>
                </label>
              `)}
            </div>
          `:h}
          ${this.readings.length>0?l`<div class="readings-block">
                <span class="field-label">${s("readings_section",e)}</span>
                ${this.readings.map(i=>this._renderReadingField(i,e))}
              </div>`:this.taskType==="reading"?l`
              <label class="field">
                <span class="field-label">${s("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${i=>this._readingValue=i.target.value} />
              </label>`:h}
          ${this.parts.length?l`<div class="used-parts">
                <span class="field-label">${s("complete_parts_used",e)}</span>
                ${this.parts.map(i=>{let n=B({part_id:i.id,entry_id:i.entry_id}),o=this._usedParts[n],c=o!==void 0,u=i.entry_id?{part_id:i.id,quantity:1,entry_id:i.entry_id}:{part_id:i.id,quantity:1};return l`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${c}
                        @change=${_=>{let g={...this._usedParts};if(_.target.checked)g[n]=g[n]||u;else{delete g[n];let v={...this._usedQtyText};delete v[n],this._usedQtyText=v}this._usedParts=g}} />
                      <span
                        >${i.name}${i.owner_name?l`<span class="used-part-owner"> (${i.owner_name})</span>`:h}${i.stock!==null&&i.stock!==void 0?` (${le(i.stock,i.unit,e)})`:""}</span
                      >
                    </label>
                    ${c?l`<input class="used-part-qty" type="number" min=${me[0]} max=${me[1]} step="0.01"
                          .value=${this._usedQtyText[n]??String(o.quantity)}
                          @input=${_=>{let g=_.target.value;this._usedQtyText={...this._usedQtyText,[n]:g};let v=parseFloat(g.replace(",","."));Number.isFinite(v)&&v>=me[0]&&(this._usedParts={...this._usedParts,[n]:{...u,quantity:v}})}} />`:h}
                  </div>`})}
              </div>`:this.consumesInfo.length?l`<div class="consumes-hint">
                  ${this.consumesInfo.map(i=>l`<div>${i}</div>`)}
                </div>`:h}
          ${this.restockDefault!==null?l`
              <label class="field">
                <span class="field-label">${s("restock_quantity_label",e)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
                <input type="number" step="0.01" min=${pe[0]} max=${pe[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${i=>this._restockQty=i.target.value} />
              </label>`:h}
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
            ${this._completedAt?l`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  .helper=${qe(e)}
                  @value-changed=${i=>this._completedAt=i.detail.value}
                ></ms-date-field>`:l`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${s("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${this._demands("photo")?s("completion_photos",e):s("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?l`<div class="photo-strip">
                  ${this._photos.photos.map(i=>l`
                    <div class="photo-preview">
                      <img src=${i.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(i.id)}
                        title="${s("remove",e)}">✕</button>
                    </div>`)}
                </div>`:h}
            ${this._photos.full?l`<div class="photo-limit">${s("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:l`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${i=>this._photos.addFiles(i.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?l`
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
          `:h}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?s("uploading",e):this._missingRequired.length?this._missingRequired.map(i=>s("err_required",e).replace("{field}",s(ue[i]??i,e))).join(" \xB7 "):""}
          >
            ${this._loading?s("completing",e):s("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};y.styles=[ce,De,w`
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
      border-radius: 6px;
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
      width: 76px; padding: 6px 8px; border-radius: 6px; font: inherit; font-size: 14px;
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
  `],d([f({attribute:!1})],y.prototype,"hass",2),d([f()],y.prototype,"entryId",2),d([f()],y.prototype,"taskId",2),d([f()],y.prototype,"taskName",2),d([f()],y.prototype,"lang",2),d([f({type:Array})],y.prototype,"checklist",2),d([f({type:Boolean})],y.prototype,"adaptiveEnabled",2),d([f()],y.prototype,"taskType",2),d([f()],y.prototype,"readingUnit",2),d([f({attribute:!1})],y.prototype,"readings",2),d([f({attribute:!1})],y.prototype,"readingHistory",2),d([f({attribute:!1})],y.prototype,"restockDefault",2),d([f({attribute:!1})],y.prototype,"restockUnitCost",2),d([f({attribute:!1})],y.prototype,"restockPackage",2),d([f()],y.prototype,"currencySymbol",2),d([f({attribute:!1})],y.prototype,"partsCostMode",2),d([f({attribute:!1})],y.prototype,"parts",2),d([f({attribute:!1})],y.prototype,"consumesParts",2),d([f({type:Array})],y.prototype,"consumesInfo",2),d([f({type:Array})],y.prototype,"requiredFields",2),d([f()],y.prototype,"phaseLabel",2),d([f({type:Boolean})],y.prototype,"requireTagScan",2),d([f({type:Boolean})],y.prototype,"viaTagScan",2),d([p()],y.prototype,"_open",2),d([p()],y.prototype,"_notes",2),d([p()],y.prototype,"_cost",2),d([p()],y.prototype,"_duration",2),d([p()],y.prototype,"_loading",2),d([p()],y.prototype,"_error",2),d([p()],y.prototype,"_checklistState",2),d([p()],y.prototype,"_feedback",2),d([p()],y.prototype,"_readingValue",2),d([p()],y.prototype,"_readingValues",2),d([p()],y.prototype,"_restockQty",2),d([p()],y.prototype,"_completedAt",2),d([p()],y.prototype,"_usedParts",2),d([p()],y.prototype,"_usedQtyText",2),d([f({attribute:!1})],y.prototype,"checklistPrefill",2),d([f({attribute:!1})],y.prototype,"prefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",y);var ge=w`
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
  /* Focused programmatically on open (so Escape works at once) — no ring. */
  .dialog:focus { outline: none; }
  /* The one part that shrinks and scrolls (min-height: 0); the header and the
     buttons around it keep their content's height. */
  .dialog-scroll {
    flex: 1 1 auto; min-height: 0;
    overflow-y: auto; overscroll-behavior: contain;
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
  }
`;function Is(r,a){r.key!=="Escape"||r.defaultPrevented||r.composedPath().some(e=>e instanceof Element&&e.localName==="ms-camera-capture")||(r.preventDefault(),r.stopPropagation(),a())}function fe(r,a){return l`
    <div class="backdrop" @click=${r}></div>
    <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
      @keydown=${e=>Is(e,r)}>${a}</div>
  `}function ve(r){r?.querySelector(".dialog")?.focus({preventScroll:!0})}function wi(r,a,e){let t=new Blob([r],{type:e}),i=URL.createObjectURL(t),n=document.createElement("a");n.href=i,n.download=a,n.target="_blank",n.rel="noopener",n.style.display="none",document.body.appendChild(n),n.dispatchEvent(new MouseEvent("click")),document.body.removeChild(n),setTimeout(()=>URL.revokeObjectURL(i),6e4)}async function As(r,a,e=300){return(await r.connection.sendMessagePromise({type:"auth/sign_path",path:a,expires:e})).path}async function Ei(r,a,e=300){return As(r,`/api/maintenance_supporter/document/${a}`,e)}var te=class extends T{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await Ei(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?h:this._url?l`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:l`<div class="ph"></div>`}};te.styles=w`
    .wrap { display: inline-block; margin-top: 4px; }
    /* #161: uniform 96px tiles — several photos sit in a strip, so a
       tiny or portrait shot must not collapse its slot. */
    img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 6px;
      display: block;
      border: 1px solid var(--divider-color);
      box-sizing: border-box;
    }
    .ph {
      width: 96px;
      height: 96px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      margin-top: 4px;
    }
  `,d([f({attribute:!1})],te.prototype,"hass",2),d([f()],te.prototype,"docId",2),d([p()],te.prototype,"_url",2),d([p()],te.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",te);var O=class extends T{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new _e(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return C(this.hass)}openEdit(e){this._openGen++,this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(e.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(e),this._loadPartOptions()}_seedReadings(e){let t=[],i=new Set;for(let o of e.readings??[])i.has(o.id)||(i.add(o.id),t.push({id:o.id,name:o.name,unit:o.unit??null}));for(let o of e.reading_values??[])i.has(o.id)||(i.add(o.id),t.push({id:o.id,name:o.name,unit:o.unit??null}));this._readingRows=t;let n={};for(let o of e.reading_values??[])n[o.id]=String(o.value);this._readingText=n,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let e={};for(let t of this._readingRows){let i=(this._readingText[t.id]??"").trim();if(i==="")continue;let n=parseFloat(i.replace(",","."));isNaN(n)||(e[t.id]=n)}return e}async _loadPartOptions(){let e=this._draft;if(!e)return;let t=this._openGen;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(t!==this._openGen)return;let n=[];for(let c of i.parts||[]){let u=c.entry_id===e.entry_id,_=c.consumers.some(g=>g.entry_id===e.entry_id&&g.task_id===e.task_id);!u&&!_||n.push({part_id:c.part_id,name:c.name,entry_id:c.entry_id,foreign:!u,object_name:c.object_name})}for(let c of e.used_parts||[]){let u=c.entry_id||e.entry_id;n.some(_=>_.part_id===c.part_id&&_.entry_id===u)||n.push({part_id:c.part_id,name:c.name||c.part_id,entry_id:u,foreign:u!==e.entry_id,object_name:null})}let o={};for(let c of e.used_parts||[])o[`${c.entry_id||e.entry_id}:${c.part_id}`]=c.quantity??1;this._partOptions=n,this._partQty=o,this._partQtyOriginal=this._partSelectionKey()}catch{if(t!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,e])=>e>0).sort(([e],[t])=>e.localeCompare(t)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let e=this._lang,i=(this._originalSnapshot.used_parts||[]).filter(u=>u.quantity>0).map(u=>`${S(u.quantity,e)}\xD7 ${u.name||u.part_id}`).join(", ");if(!await ie(this.hass,{title:s("history_delete_entry",e),message:i?`${s("history_delete_confirm_entry",e)} ${s("history_delete_returns_parts",e).replace("{parts}",i)}`:s("history_delete_confirm_entry",e),confirmText:s("delete",e),danger:!0})||!this._draft||!this._originalSnapshot)return;let o=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:o.entry_id,task_id:o.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:o.entry_id,task_id:o.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(e){return A(this,e,{busy:t=>{this._saving=t},onError:t=>{this._error=t}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let e=this._draft,t=this._originalSnapshot,i={type:"maintenance_supporter/task/history/update",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:t.original_timestamp};if(e.timestamp!==t.timestamp&&(i.timestamp=e.timestamp),e.notes!==t.notes&&(i.notes=e.notes),e.cost!==t.cost&&(i.cost=e.cost),e.duration!==t.duration&&(i.duration=e.duration),e.completed_by!==t.completed_by&&(i.completed_by=e.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(i.used_parts=(this._partOptions||[]).filter(o=>(this._partQty[`${o.entry_id}:${o.part_id}`]||0)>0).map(o=>({part_id:o.part_id,quantity:this._partQty[`${o.entry_id}:${o.part_id}`],...o.foreign?{entry_id:o.entry_id}:{}}))),e.reading_value!==t.reading_value&&(i.reading_value=e.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let o=this._readingNumbers(),c={};for(let u of this._readingRows)c[u.id]=o[u.id]??null;i.reading_values=c}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(i.photo_doc_ids=this._photos.ids),Object.keys(i).filter(o=>!["type","entry_id","task_id","original_timestamp"].includes(o)).length===0){this.close();return}await this._runWs(i)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:e.entry_id,task_id:e.task_id,new_timestamp:e.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return h;let e=this._lang,t=this._draft,i=this._error||this._photos.errorText(e);return fe(()=>this.close(),l`
        <h2>${s("history_edit_title",e)}</h2>
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
          .helper=${qe(e)}
          .value=${wt(t.timestamp)}
          @value-changed=${n=>{let o=n.detail.value;o&&this._set("timestamp",o)}}
        ></ms-date-field>
        <label>
          <span>${s("notes_label",e)}</span>
          <textarea
            rows="3"
            @input=${n=>{let o=n.target.value;this._set("notes",o||null)}}
            .value=${t.notes??""}></textarea>
        </label>
        <div class="row">
          <div class="cost-field">
            <span>${s("cost",e)}</span>
            <ms-cost-input .lang=${e} .value=${t.cost!=null?String(t.cost):""}
              @value-changed=${n=>{let o=n.detail.value;this._set("cost",o?Number(o):null)}}></ms-cost-input>
          </div>
          <label>
            <span>${s("duration",e)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${t.duration!=null?String(t.duration):""}
              @input=${n=>{this._set("duration",se(n.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(t,e)}
        ${this._partOptions&&this._partOptions.length>0?l`
          <div class="parts-block">
            <span class="parts-title">${s("complete_parts_used",e)}</span>
            ${this._partOptions.map(n=>{let o=`${n.entry_id}:${n.part_id}`,c=this._partQty[o]||0;return l`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${c>0}
                    @change=${u=>{let _=u.target.checked;this._partQty={...this._partQty,[o]:_?1:0}}} />
                  <span class="part-label">${n.name}${n.foreign&&n.object_name?` (${n.object_name})`:""}</span>
                  ${c>0?l`
                    <input class="part-qty" type="number" min=${X[0]} max=${X[1]} step="0.01"
                      .value=${String(c)}
                      @input=${u=>{let _=parseFloat(u.target.value);!isNaN(_)&&_>0&&(this._partQty={...this._partQty,[o]:_})}} />
                  `:h}
                </label>
              `})}
          </div>
        `:h}
        <div class="photos-block">
          <span class="parts-title">${s("completion_photos",e)}</span>
          ${this._photos.photos.length>0?l`
            <div class="photo-strip">
              ${this._photos.photos.map(n=>l`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${n.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${s("remove",e)}
                    @click=${()=>this._photos.remove(n.id)}>✕</button>
                </div>`)}
            </div>`:h}
          ${this._photos.full?l`<span class="photos-hint">${s("photos_limit",e).replace("{max}",String(this._photos.max))}</span>`:l`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${n=>this._photos.addFiles(n.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${s("history_edit_photos_hint",e)}</span>
        </div>
        ${i?l`<div class="error">${i}</div>`:h}
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
    `)}updated(e){e.has("_open")&&this._open&&ve(this.shadowRoot)}_renderReadings(e,t){return this._readingRows.length>0?l`
        <div class="readings-block">
          <span class="parts-title">${s("readings_section",t)}</span>
          ${this._readingRows.map(i=>l`
            <label class="reading-row-edit">
              <span class="reading-row-name">${i.name}${i.unit?` (${i.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[i.id]??""}
                @input=${n=>{this._readingText={...this._readingText,[i.id]:n.target.value}}} />
            </label>
          `)}
        </div>`:e.reading_value==null&&e.task_type!=="reading"?h:l`
      <label>
        <span>${s("reading_value_label",t)}${e.reading_unit?` (${e.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${e.reading_value!=null?String(e.reading_value):""}
          @input=${i=>{let n=i.target.value,o=n===""?NaN:Number(n);this._set("reading_value",isNaN(o)?null:o)}} />
      </label>`}};O.styles=[De,ge,w`
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
      border-radius: 6px;
      width: 100%; box-sizing: border-box;
      font-family: inherit;
    }
    .delete-entry { margin-right: auto; color: var(--error-color, #d32f2f); background: transparent; border: 1px solid var(--error-color, #d32f2f); border-radius: 6px; padding: 6px 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
    .delete-entry ha-icon { --mdc-icon-size: 18px; }
    .actions {
      display: flex; gap: 8px; justify-content: flex-end;
      margin-top: 8px;
    }
    button {
      padding: 8px 16px; font-size: 14px;
      border-radius: 6px; cursor: pointer;
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
      border-radius: 6px;
    }
    /* #130: parts on the entry */
    .parts-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px; padding: 8px;
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
      border-radius: 6px; padding: 8px;
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
      border-radius: 6px; padding: 8px;
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
  `],d([f({attribute:!1})],O.prototype,"hass",2),d([p()],O.prototype,"_open",2),d([p()],O.prototype,"_saving",2),d([p()],O.prototype,"_error",2),d([p()],O.prototype,"_draft",2),d([p()],O.prototype,"_partOptions",2),d([p()],O.prototype,"_partQty",2),d([p()],O.prototype,"_readingRows",2),d([p()],O.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",O);function lt(r){return!r.startsWith("data:image/svg+xml,")&&!r.startsWith("data:image/png;base64,")?"":J(r)}function Cs(r){return r.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var P=class extends T{constructor(){super(...arguments);this.lang="";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._quickResult=null;this._quickValues=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}get _dialogLang(){return this.lang||C(this.hass)}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}openForTask(e,t,i,n){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=n,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._quickValues=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...t,action:"view"})];if(this._taskId){if(i.push(this.hass.connection.sendMessagePromise({...t,action:"complete"})),this._quickValues=await this._quickCompleteValues(),e!==this._generateSeq)return;this._quickValues&&i.push(this.hass.connection.sendMessagePromise({...t,action:"quick_complete"}))}let n=await Promise.all(i);if(e!==this._generateSeq)return;this._viewResult=n[0],n.length>1&&(this._completeResult=n[1]),n.length>2&&(this._quickResult=n[2])}catch(t){if(e!==this._generateSeq)return;let i=t?.code,n=t?.message;this._error=i==="no_url"||typeof n=="string"&&n.includes("No Home Assistant URL")?s("qr_error_no_url",this._dialogLang):s("qr_error",this._dialogLang)}finally{e===this._generateSeq&&(this._loading=!1)}}async _quickCompleteValues(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});return Ne((e.tasks||[]).find(t=>t.id===this._taskId))}catch{return null}}_quickRecords(e){let t=this._quickValues??{},i=[t.notes?`\u201C${t.notes.length>40?`${t.notes.slice(0,39)}\u2026`:t.notes}\u201D`:"",t.cost!=null?`${s("quick_complete_defaults_cost",e)} ${D(t.cost,void 0,e)}`:"",t.duration!=null?de(t.duration,e):""].filter(Boolean);return i.length?s("qr_quick_records",e).replace("{values}",i.join(", ")):s("qr_quick_records_nothing",e)}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),n=window.open("","_blank","width=600,height=500");if(!n)return;let o=this._dialogLang,c=J(t),u=J(i),_=!!this._completeResult,g=!!this._quickResult,v=J(s("qr_action_view",o)),$=J(s("qr_action_complete",o)),b=J(s("qr_action_quick_complete",o));n.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${c}</title>
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
<h2>${c}</h2>
${u?`<div class="sub">${u}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${lt(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${v}</div>
  </div>
  ${_?`<div class="qr-col">
    <img src="${lt(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${$}</div>
  </div>`:""}
  ${g?`<div class="qr-col">
    <img src="${lt(this._quickResult.svg_data_uri)}" alt="QR Quick-complete" />
    <div class="qr-label">${b}</div>
  </div>`:""}
</div>
<div class="url">${J(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),n.document.close()}_downloadSvg(e,t){let i=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),n=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;wi(i,`qr-${Cs(n)}-${t}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._quickResult=null,this._error="",this._loading=!1}render(){if(!this._open)return l``;let e=this._dialogLang,t=this._taskName?`${s("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",e)}: ${this._objectName}`,i=!!this._viewResult;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._loading?l`<div class="loading">${s("qr_generating",e)}</div>`:this._error?l`<div class="error">${this._error}</div>`:i?l`
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
                      ${this._completeResult?l`
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
                          `:h}
                      ${this._quickResult?l`
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
                          `:h}
                    </div>
                    ${this._taskId&&!this._quickResult?l`<div class="qr-quick-off">${s("qr_quick_complete_off",e)}</div>`:h}
                    <div class="url-display">${this._viewResult.url}</div>
                  `:h}
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
    `}};P.styles=w`
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
      border-radius: 6px;
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
  `,d([f({attribute:!1})],P.prototype,"hass",2),d([f()],P.prototype,"lang",2),d([p()],P.prototype,"_open",2),d([p()],P.prototype,"_loading",2),d([p()],P.prototype,"_error",2),d([p()],P.prototype,"_viewResult",2),d([p()],P.prototype,"_completeResult",2),d([p()],P.prototype,"_quickResult",2),d([p()],P.prototype,"_quickValues",2),d([p()],P.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",P);function Ti(r,a,e=new Date){let t=r?.hours,i=G(r?.snoozed_until);if(typeof t!="number"||!Number.isFinite(i))return s("snoozed",a);let n=Ze(),c=Ae(i,n)===Ae(e,n)?Je(new Date(i),a):Re(r.snoozed_until,a);return Ce("snoozed_for","snoozed_for_one",t,a,"hours").replace("{until}",c)}function Rs(r,a){if(a<=0)return 0;let e=typeof r=="number"&&Number.isFinite(r)?Math.trunc(r):0;return e<0?0:e%a}function qs(r){return!!(r?.phases&&r.phase_sequence&&r.phase_sequence.length>0)}function dt(r){if(!r||!qs(r))return null;let a=r.phase_sequence,e=Rs(r.phase_cursor,a.length),t=a[e],i=r.phases?.[t];return i?{id:t,name:i.name,index:e,count:a.length,notes:i.notes,checklist:i.checklist!==void 0?i.checklist:r.checklist??[],consumesParts:i.consumes_parts!==void 0?i.consumes_parts:r.consumes_parts??[],requiredFields:i.required_completion_fields!==void 0?i.required_completion_fields:r.required_completion_fields??[]}:null}function Ee(r){let a=dt(r);return a?`${a.index+1}/${a.count} \xB7 ${a.name}`:""}function Ps(r,a){return typeof r=="number"&&Number.isFinite(r)&&r>=.01?r:a}function Si(r){let a=r.task??null,e=a?dt(a):null,t=e?e.consumesParts:a?.consumes_parts||[],i=!!a?.part_ref,n=r.objects.find(g=>g.entry_id===r.entryId)?.parts||[],o=i?n.find(g=>g.id===a.part_ref.part_id):void 0,c=r.features?r.features.checklists:r.checklistsEnabled??!0,u=r.features?r.features.checklists?r.checklist??a?.checklist??[]:[]:r.checklist??[],_=r.features?r.features.adaptive&&(r.adaptiveEnabled??!!a?.adaptive_config?.enabled):!!r.adaptiveEnabled;return{entry_id:r.entryId,task_id:r.taskId,task_name:r.taskName,checklist:e?c?e.checklist:[]:u,adaptive_enabled:_,required_completion_fields:e?e.requiredFields:a?.required_completion_fields||[],task_type:a?.type||"",reading_unit:a?.reading_unit||"",readings:a?.readings||[],reading_history:It(a?.history),parts:i?[]:ti({consumes_parts:t},r.entryId,r.objects,r.lang),consumes_parts:i?[]:t,phase_label:e?Ee(a):"",require_tag_scan:!!a?.require_tag_scan,restock_default:i?Ps(o?.restock_quantity,1):null,restock_unit_cost:i?o?.cost??null:null,restock_package:i&&o?.package_size?le(o.package_size,o.unit,r.lang):"",currency_symbol:$e({currency_symbol:r.currencySymbol}),consumes_info:t.map(g=>ei(g,r.entryId,r.objects,r.lang)),checklist_prefill:a?.checklist_progress||{},via_tag_scan:!!r.viaTagScan,parts_cost_mode:i?He(o,r.partsCostMode??"purchase"):r.partsCostMode??"purchase",prefill:Ne(a)}}function Ii(r,a,e){r.entryId=a.entry_id,r.taskId=a.task_id,r.taskName=a.task_name,r.lang=e,r.checklist=a.checklist??[],r.adaptiveEnabled=!!a.adaptive_enabled,r.requiredFields=a.required_completion_fields??[],r.taskType=a.task_type??"",r.readingUnit=a.reading_unit??"",r.readings=a.readings??[],r.readingHistory=a.reading_history??[],r.parts=a.parts??[],r.consumesParts=a.consumes_parts??[],r.phaseLabel=a.phase_label??"",r.requireTagScan=!!a.require_tag_scan,r.restockDefault=a.restock_default??null,r.restockUnitCost=a.restock_unit_cost??null,r.restockPackage=a.restock_package??"",r.currencySymbol=$e(a),r.consumesInfo=a.consumes_info??[],r.checklistPrefill=a.checklist_prefill??{},r.viaTagScan=!!a.via_tag_scan,r.partsCostMode=a.parts_cost_mode??"purchase",r.prefill=a.prefill??null,r.open({viaTagScan:!!a.via_tag_scan})}var{I:Ka}=Ht;var Ai=r=>r.strings===void 0;var Ci={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ct=r=>(...a)=>({_$litDirective$:r,values:a}),je=class{constructor(a){}get _$AU(){return this._$AM._$AU}_$AT(a,e,t){this._$Ct=a,this._$AM=e,this._$Ci=t}_$AS(a,e){return this.update(a,e)}update(a,e){return this.render(...e)}};var Te=(r,a)=>{let e=r._$AN;if(e===void 0)return!1;for(let t of e)t._$AO?.(a,!1),Te(t,a);return!0},ze=r=>{let a,e;do{if((a=r._$AM)===void 0)break;e=a._$AN,e.delete(r),r=a}while(e?.size===0)},Ri=r=>{for(let a;a=r._$AM;r=a){let e=a._$AN;if(e===void 0)a._$AN=e=new Set;else if(e.has(r))break;e.add(r),Ns(a)}};function Hs(r){this._$AN!==void 0?(ze(this),this._$AM=r,Ri(this)):this._$AM=r}function Os(r,a=!1,e=0){let t=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(a)if(Array.isArray(t))for(let n=e;n<t.length;n++)Te(t[n],!1),ze(t[n]);else t!=null&&(Te(t,!1),ze(t));else Te(this,r)}var Ns=r=>{r.type==Ci.CHILD&&(r._$AP??=Os,r._$AQ??=Hs)},Ue=class extends je{constructor(){super(...arguments),this._$AN=void 0}_$AT(a,e,t){super._$AT(a,e,t),Ri(this),this.isConnected=a._$AU}_$AO(a,e=!0){a!==this.isConnected&&(this.isConnected=a,a?this.reconnected?.():this.disconnected?.()),e&&(Te(this,a),ze(this))}setValue(a){if(Ai(this._$Ct))this._$Ct._$AI(a,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=a,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};var pt=new WeakMap,qi=ct(class extends Ue{render(r){return h}update(r,[a]){let e=a!==this.G;return e&&this.G!==void 0&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=a,this.ht=r.options?.host,this.rt(this.ct=r.element)),h}rt(r){if(this.isConnected||(r=void 0),typeof this.G=="function"){let a=this.ht??globalThis,e=pt.get(a);e===void 0&&(e=new WeakMap,pt.set(a,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,r),r!==void 0&&this.G.call(this.ht,r)}else this.G.value=r}get lt(){return typeof this.G=="function"?pt.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var Ls=new Set(["about","blob","data","file","filesystem","javascript","livescript","ms-appinstaller","ms-cxh","ms-cxh-full","ms-msdt","ms-officecmd","search","search-ms","view-source","vbscript"]);function ht(r){return r.replace(/[\t\n\r]/g,"").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g,"")}function ut(r){let a=/^([a-z][a-z0-9+.-]+):/i.exec(ht(r||""));return a?a[1].toLowerCase():null}function Be(r){let a=ut(r);return a!==null&&!Ls.has(a)}function Pi(r){return!!r&&/^https?:\/\//i.test(r)}function We(r){if(!r)return h;if(customElements.get("ha-markdown")){let{content:a,links:e}=Ds(r);return l`<ha-markdown
      class="notes-md"
      .content=${a}
      breaks
      ${qi(t=>js(t,e))}
    ></ha-markdown>`}return l`${r}`}var mt="https://app-link.invalid/",Ms=new Set(["http","https","mailto","tel","ftp"]),Fs=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/,Ve="[a-zA-Z][a-zA-Z0-9+.-]+:";function Ds(r){let a=[],e=n=>{let o=ut(n);return!o||Ms.has(o)||!Be(n)?null:(a.push(ht(n)),`${mt}${a.length-1}`)},t=n=>n.replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)<(${Ve}[^>\\n]*)>`,"g"),(o,c,u,_)=>{let g=c?null:e(_);return g?`${u}${g}`:o}).replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)(${Ve}[^\\s)]*)`,"g"),(o,c,u,_)=>{let g=c?null:e(_);return g?`${u}${g}`:o}).replace(new RegExp(`(^|[^(])<(${Ve}[^\\s<>]*)>`,"gm"),(o,c,u)=>{let _=e(u);return _?`${c}[${u.replace(/([\\[\]])/g,"\\$1")}](${_})`:o}).replace(new RegExp(`^( {0,3}\\[[^\\]\\n]+\\]:[ \\t]*)<?(${Ve}[^\\s>]*)>?`,"gm"),(o,c,u)=>{let _=e(u);return _?`${c}${_}`:o});return{content:r.split(Fs).map((n,o)=>o%2?n:t(n)).join(""),links:a}}function _t(r,a){for(let e of r.querySelectorAll(`a[href^="${mt}"]`)){let t=a[Number(e.getAttribute("href").slice(mt.length))];t&&e.setAttribute("href",t)}}var Hi=new WeakMap;function js(r,a){if(!r)return;let e=Hi.get(r);if(!e&&a.length===0)return;if(e){e.links=a,r.shadowRoot&&_t(r.shadowRoot,a);return}let t={links:a};Hi.set(r,t),(async()=>{await r.updateComplete;let i=r.shadowRoot;i&&(new MutationObserver(()=>_t(i,t.links)).observe(i,{childList:!0,subtree:!0}),_t(i,t.links))})()}var Oi=r=>typeof r=="number"&&Number.isInteger(r)&&r>0;function zs(r){return r&&Oi(r.ref_no)?String(r.ref_no):null}function Ni(r,a){let e=zs(r);return e&&a&&Oi(a.ref_no)?`${e}.${a.ref_no}`:null}function Li(r,a){return r?l`<span class="ref-chip" title=${a??""}>#${r}</span>`:h}var Us={"Completed from dashboard button":"hist_note_button","Auto-completed: sensor recovered":"hist_note_auto_recovered_plain","Completed from the To-do list":"hist_note_todo","Completed by voice":"hist_note_voice","Completed from the notification":"hist_note_notification","Completed via NFC tag":"hist_note_nfc","Completed from the shopping list":"hist_note_shopping_list","Completed from a mirrored to-do list":"hist_note_todo_mirror","Skipped from notification":"hist_note_skipped_notification","Skipped from dashboard button":"hist_note_skipped_button","Sensor trigger activated":"hist_note_sensor_triggered","Initial value set during task creation":"hist_note_initial"},Bs=[[/^Auto-completed: sensor recovered \((.+)\)$/,"hist_note_auto_recovered",r=>({value:r[1]})],[/^Auto-completed: (.+) changed to (.+)$/,"hist_note_auto_entity",r=>({entity:r[1],state:r[2]})],[/^Reset to (\d{4}-\d{2}-\d{2})$/,"hist_note_reset",(r,a)=>({date:H(r[1],a)})],[/^Trigger entity replaced: (.+) → (.+)$/,"hist_note_trigger_replaced",r=>({old:r[1],new:r[2]})],[/^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,"hist_note_trigger_removed",(r,a)=>({entity:r[1],schedule:s(r[2],a)})],[/^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,"hist_note_compound_removed",r=>({entity:r[1],count:r[2]})]];function Mi(r,a){if(!r)return"";let e=Us[r.trim()];if(e)return s(e,a);for(let[t,i,n]of Bs){let o=r.trim().match(t);if(o){let c=n(o,a);return s(i,a).replace(/\{(\w+)\}/g,(u,_)=>c[_]??u)}}return r}function Fi(r){let a=e=>{let t=G(e.timestamp);return Number.isNaN(t)?-1/0:t};return(r??[]).map((e,t)=>({entry:e,index:t,at:a(e)})).sort((e,t)=>t.at-e.at||t.index-e.index).map(e=>e.entry)}function Ws(r,a){return r.taskRef&&a.ref_no?`${r.taskRef}-${a.ref_no}`:null}function Gs(r,a){let e=Ye(a);return e.length>0?l`<div class="history-photos">
        ${e.map(t=>l`<maintenance-history-photo .hass=${r} .docId=${t}></maintenance-history-photo>`)}
      </div>`:h}function Qs(r,a){let e=a.lang,t=o=>S(o,e,{maximumFractionDigits:3}),i=o=>o==null?"":` (${o>=0?"+":""}${t(o)})`,n=St(r);return n.length>0?l`<div class="history-readings">
      ${n.map(o=>l`<span class="history-reading">
        <span class="history-reading-name">${o.name}</span>
        <span class="history-reading-value">${t(o.value)}${o.unit?` ${o.unit}`:""}${i(a.readingSlotDelta?.(r,o.id))}</span>
      </span>`)}
    </div>`:r.reading_value!=null?l`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${s("reading_label",e)}</span>
      <span class="history-reading-value">${t(r.reading_value)}${a.readingUnit?` ${a.readingUnit}`:""}${i(a.readingDelta?.(r))}</span>
    </span></div>`:h}function Di(r,a,e={}){let t=a.lang,{compact:i=!1,showRef:n=!0,showBadges:o=!0,showEdit:c=!0}=e,u=a.openEdit,_=c&&!!u&&yt.includes(r.type),g=typeof r.parts_cost=="number"?r.parts_cost:null,v=r.cost_basis==="use",$=v&&!!r.purchase;return l`
    <div class="history-entry${i?" compact":""}">
      ${i?h:l`<div class="history-icon ${r.type}" style="background: ${bt(r.type)}">
            <ha-icon .icon=${Ie[r.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${s(r.type,t)}</strong>
          ${n?Li(Ws(a,r),s("ref_number",t)):h}
          ${o&&r.phase_id?l`<span class="history-phase-badge">${a.phaseNames?.[r.phase_id]||r.phase_id}</span>`:h}
          ${o&&r.auto?l`<span class="history-auto-badge">${s("history_auto",t)}</span>`:h}
          ${_?l`<button class="history-edit-btn"
                     title=${s("history_edit_button",t)}
                     @click=${()=>u(r)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:h}
        </div>
        <div class="history-date">${Re(r.timestamp,t)}</div>
        ${r.notes?l`<div class="history-notes">${Mi(r.notes,t)}</div>`:h}
        ${Gs(a.hass,r)}
        ${Qs(r,a)}
        ${r.cost!=null||r.duration!=null||r.trigger_value!=null||g!=null?l`<div class="history-details">
              ${r.cost!=null?$?l`<span>${s("history_purchase_stock",t).replace("{amount}",D(r.cost,a.currencySymbol,t))}</span>`:r.cost<0?l`<span class="history-credit">${Lt(r.cost,a.currencySymbol,t)}</span>`:l`<span>${s("cost",t)}: ${D(r.cost,a.currencySymbol,t)}</span>`:h}
              ${g!=null?l`<span title=${s(v?"history_parts_counted_hint":"history_parts_info_hint",t)}>${s(v?"history_parts_counted":"history_parts_info",t).replace("{amount}",D(g,a.currencySymbol,t))}</span>`:h}
              ${r.duration!=null?l`<span>${s("duration",t)}: ${de(r.duration,t)}</span>`:h}
              ${r.trigger_value!=null?l`<span>${s("trigger_val",t)}: ${r.trigger_value}</span>`:h}
            </div>`:h}
      </div>
    </div>
  `}var Ks="var(--maint-done-color, #78909c)",Ys="var(--secondary-text-color, #727272)";function Se(r){if(r.archived)return"archived";if(r.is_done)return"done";let a=r.status||"ok";return a==="ok"&&r.schedule_type==="manual"&&r.days_until_due==null?"no_due":a}var Zs={done:"completed",no_due:"no_due_date"};function gt(r,a){return s(Zs[r]??r,a)}function Ge(r){let a=Se(r);return a==="done"?Ks:a==="no_due"?Ys:vt[a]||"var(--disabled-color, #9e9e9e)"}function Js(r){return r==="no_due"?"mdi:calendar-blank-outline":Ie[r==="done"?"completed":r]||"mdi:circle-medium"}function ji(r,a,e="pill"){let t=Se(r),i=gt(t,a);return e==="chip"?l`<span class="status-chip ${t}">${i}</span>`:l`<span class="status-badge ${t}" role="img" title="${i}" aria-label="${i}"><ha-icon icon="${Js(t)}"></ha-icon><span class="status-label">${i}</span></span>`}var Qe=class{constructor(){this._handle=null}schedule(a,e=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,a()},e)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}};var Xs={changed_since:"undo_changed",nothing_to_undo:"undo_nothing"};async function er(r,a,e,t){let i="",n=await A({hass:r},{type:"maintenance_supporter/task/undo",entry_id:a,task_id:e},{lang:t,onError:(o,c)=>{let u=Xs[c?.code??""];i=u?s(u,t):o}});return n===void 0?{ok:!1,message:i}:{ok:!0,message:s(n?.action_ran?"undo_done_action_ran":"undo_done",t)}}function Ke(r,a,e,t,i){let n=(o,c)=>r.dispatchEvent(new CustomEvent("hass-notification",{detail:c?{message:o,action:c,duration:1e4}:{message:o},bubbles:!0,composed:!0}));n(s("task_completed_named",t).replace("{task}",e.taskName),{text:s("undo",t),action:()=>{er(a,e.entryId,e.taskId,t).then(o=>{n(o.message),o.ok&&i()})}})}function x(r){return r.toFixed(1)}function zi(r,a){let e=r.interval_analysis,t=e?.weibull_beta,i=e?.weibull_eta;if(t==null||i==null||i<=0)return h;let n=r.interval_days??0,o=r.suggested_interval??n;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",a)}
        ${tr(t,a)}
      </div>
      ${ir(t,i,n,o,a)}
      ${sr(e,a)}
      ${e?.confidence_interval_low!=null?rr(e,r,a):h}
    </div>
  `}function tr(r,a){let e,t,i;return r<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):r<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):r<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),l`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${s(i,a)} (\u03B2=${S(r,a,2)})
    </span>
  `}function ir(r,a,e,t,i){let b=Math.max(e,t,a,1)*1.3,I=50,q=[];for(let F=0;F<=I;F++){let U=F/I*b,ss=1-Math.exp(-Math.pow(U/a,r)),rs=32+U/b*260,ns=136-ss*128;q.push([rs,ns])}let N=q.map(([F,U])=>`${x(F)},${x(U)}`).join(" "),V="M32,136 "+q.map(([F,U])=>`L${x(F)},${x(U)}`).join(" ")+` L${x(q[I][0])},136 Z`,z=32+e/b*260,W=1-Math.exp(-Math.pow(e/a,r)),ae=136-W*128,ts=S((1-W)*100,i,0),ft=32+t/b*260,is=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",i)}">
        ${is.map(F=>{let U=136-F*128;return oe`
            <line x1="${32}" y1="${x(U)}" x2="${292}" y2="${x(U)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${F===.5?"4,3":h}" />
            <text x="${28}" y="${x(U+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${S(F*100,i,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b)}</text>

        <path d="${V}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${N}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?oe`
          <line x1="${x(z)}" y1="${8}" x2="${x(z)}" y2="${x(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${x(z)}" cy="${x(ae)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${x(z+4)}" y="${x(ae-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${ts}%</text>
        `:h}

        ${t>0&&t!==e?oe`
          <line x1="${x(ft)}" y1="${8}" x2="${x(ft)}" y2="${x(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:h}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",i)}</span>
      ${e>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",i)}</span>`:h}
      ${t>0&&t!==e?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",i)}</span>`:h}
    </div>
  `}function sr(r,a){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",a)}</span>
        <span class="weibull-info-value">${Math.round(r.weibull_eta)} ${s("days",a)}</span>
      </div>
      ${r.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",a)}</span>
          <span class="weibull-info-value">${S(r.weibull_r_squared,a,3)}</span>
        </div>
      `:h}
    </div>
  `}function rr(r,a,e){let t=r.confidence_interval_low,i=r.confidence_interval_high,n=a.suggested_interval??a.interval_days??0,o=a.interval_days??0,c=Math.max(0,t-5),_=i+5-c,g=(t-c)/_*100,v=(i-t)/_*100,$=(n-c)/_*100,b=o>0?(o-c)/_*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",e)}: ${n} ${s("days",e)} (${t}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${x(g)}%;width:${x(v)}%"></div>
        ${b>=0?l`<div class="confidence-marker current" style="left:${x(b)}%"></div>`:h}
        <div class="confidence-marker recommended" style="left:${x($)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",e)} (${t}${s("days",e).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",e)} (${i}${s("days",e).charAt(0)})</span>
      </div>
    </div>
  `}function Ui(r,a,e){let t=r.degradation_trend!=null&&r.degradation_trend!=="insufficient_data",i=r.days_until_threshold!=null,n=r.environmental_factor!=null&&r.environmental_factor!==1;if(!t&&!i&&!n)return h;let o=r.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":r.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${r.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",a).replace("{days}",String(Math.round(r.days_until_threshold||0)))}
        </div>
      `:h}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",a)}
      </div>
      <div class="prediction-grid">
        ${t?l`
          <div class="prediction-item">
            <ha-svg-icon path="${o}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",a)}</span>
            <span class="prediction-value ${r.degradation_trend}">${s("trend_"+r.degradation_trend,a)}</span>
            ${r.degradation_rate!=null?l`<span class="prediction-rate">${r.degradation_rate>0?"+":""}${S(r.degradation_rate,a,Math.abs(r.degradation_rate)>=10?0:1)} ${r.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",a)}</span>`:h}
          </div>
        `:h}
        ${i?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",a)}</span>
            <span class="prediction-value prediction-days${r.days_until_threshold===0?" exceeded":r.sensor_prediction_urgency?" urgent":""}">${r.days_until_threshold===0?s("threshold_exceeded",a):"~"+Math.round(r.days_until_threshold)+" "+s("days",a)}</span>
            ${r.threshold_prediction_date?l`<span class="prediction-date">${H(r.threshold_prediction_date,a)}</span>`:h}
            ${r.threshold_prediction_confidence?l`<span class="confidence-dot ${r.threshold_prediction_confidence}"></span>`:h}
            ${(r.prediction_cycles??0)>0?l`<span class="prediction-cycles">${s("prediction_cycles",a)}: ${r.prediction_cycles}</span>`:h}
          </div>
        `:h}
        ${n&&e.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",a)}</span>
            <span class="prediction-value">${S(r.environmental_factor,a,2)}x</span>
            ${r.environmental_entity?l`<span class="prediction-entity entity-link" @click=${c=>jt(c,r.environmental_entity)}>${r.environmental_entity}</span>`:h}
          </div>
        `:h}
      </div>
    </div>
  `}function Bi(r,a,e,t){let i=Math.max(r||1,a);return l`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",t)}: ${r??"\u2014"} ${r!=null?s("days",t):""}
        </div>
        <div class="interval-visual current"
          style="width: ${r!=null?Math.min(r/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${s("recommended",t)}: ${a} ${s("days",t)}
          <span class="confidence-badge ${e}">${s(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(a/i*100,100)}%"></div>
      </div>
    </div>
  `}var Vi=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function Wi(){return Number(be().slice(5,7))-1}function Gi(r,a,e){if(!e.seasonal||!r.seasonal_factor||r.seasonal_factor===1)return h;let t=Vi.map(c=>s(c,a)),i=Wi(),n=r.seasonal_factors||r.interval_analysis?.seasonal_factors||null,o=n&&n.length===12?n:t.map((c,u)=>{let _=r.seasonal_factor||1,g=Math.sin((u-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,_+g))});return l`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",a)}</h4>
      <div class="seasonal-mini-chart">
        ${o.map((c,u)=>{let _=c*40,g=c<.9?"low":c>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${g} ${u===i?"current":""}"
                 style="height: ${_}px"
                 title="${t[u]}: ${S(c,a,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",a)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",a)}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",a)}</span>
      </div>
    </div>
  `}function Qi(r,a){return nr(r,a)}function nr(r,a){let e=r.seasonal_factors??r.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return h;let t=r.interval_analysis?.seasonal_reason,i=Wi(),n=300,o=100,c=8,_=o-c-4,g=Math.max(...e,1.5),v=n/12,$=v*.65,b=c+_-1/g*_;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",a)}
        ${t?l`<span class="source-tag">${t==="learned"?s("seasonal_learned",a):s("seasonal_manual",a)}</span>`:h}
      </div>
      <svg viewBox="0 0 ${n} ${o}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",a)}">
        <line x1="0" y1="${x(b)}" x2="${n}" y2="${x(b)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((I,q)=>{let N=I/g*_,V=q*v+(v-$)/2,z=c+_-N,W=q===i,ae=I<1?"var(--success-color, #4caf50)":I>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return oe`
            <rect x="${x(V)}" y="${x(z)}"
              width="${x($)}" height="${x(N)}"
              fill="${ae}" opacity="${W?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Vi.map((I,q)=>l`<span class="seasonal-label ${q===i?"active-month":""}">${s(I,a)}</span>`)}
      </div>
    </div>
  `}var E=class extends T{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1};this._toast="";this._toastTimer=new Qe;this._access=Pe;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return C(this.hass)}async openFor(e,t){(e!==this._entryId||t!==this._taskId)&&(this._task=null),this._entryId=e,this._taskId=t,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=be(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let e=await Q(this.hass);this._features={...this._features,...e.features},this._access=e.access,this._currencySymbol=$e(e.budget??void 0),Ot(e.budget??void 0),this._partsCostMode=e.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(e,t){this._toast=e,this._toastTimer.schedule(()=>{this._toast=""},t)}async _loadTask(){let e=this._entryId,t=this._taskId;if(!e||!t)return;let i=++this._loadSeq,n="",o=await A(this,{type:"maintenance_supporter/object",entry_id:e},{onError:u=>{n=u}});if(i!==this._loadSeq)return;if(o===void 0){this._error=n;return}this._objectName=o?.object?.name||"";let c=(o?.tasks||[]).find(u=>u.id===t);this._task=c??null,this._taskRef=Ni(o?.object,c),c||(this._error=s("ws_err_not_found",this._lang))}_runWs(e){return this._error="",A(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(e=!1){if(!(!this._entryId||!this._taskId||!this._task)){if(!e&&re(this._task)){this._onQuickComplete();return}import("./dialog-mount-JOIM2RAV.js").then(async({openCompleteDialog:t})=>{let i=this._task,n=[];try{n=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(Si({entryId:this._entryId,taskId:this._taskId,taskName:i.name,task:i,objects:n,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}}async _onQuickComplete(){let e=this._entryId,t=this._task;this._busy=!0;try{let i=await si(this.hass,e,t.id,this._lang);if(i.result==="dialog"){this._onComplete(!0);return}if(i.result==="failed"){this._error=i.message;return}this._notifyChanged("complete"),i.undo&&Ke(this,this.hass,{entryId:e,taskId:t.id,taskName:t.name},this._lang,()=>{}),this.close()}finally{this._busy=!1}}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:Ti(e,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||import("./dialog-mount-JOIM2RAV.js").then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-JOIM2RAV.js").then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId||!await ie(this.hass,{title:s("delete",this._lang),message:s("delete_task_confirm",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(s("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._showToast(e?.recommended_interval?`${s("reanalyze_result",this._lang)}: ${Mt(e.recommended_interval,"days",this._lang)} (${e.data_points} ${s("data_points",this._lang)})`:s("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(e){if(!this._entryId||!this._taskId)return;let t=Pt(this._entryId,this._taskId,e,this._task);import("./dialog-mount-JOIM2RAV.js").then(({openHistoryEditDialog:i})=>i(t))}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return h;let t=this._lang;return l`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",t)}</h4>
        ${Bi(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",t)}
        <div class="recommendation-actions">
          ${he(this.hass?.user,this._access)?l`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${s("apply_suggestion",t)}
              </button>`:h}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${s("reanalyze",t)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(e){let t=this._lang,i=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,n=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,o=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!i&&!n&&!o&&!c?l`<div class="adaptive-empty">
        ${s("adaptive_no_data",t)}
      </div>`:l`
      <div class="adaptive-stack">
        ${this._toast?l`<div class="toast">${this._toast}</div>`:h}
        ${i?this._renderRecommendation(e):h}
        ${n?Ui(e,t,this._features):h}
        ${o?zi(e,t):h}
        ${c?l`
          ${Gi(e,t,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?Qi(e,t):h}
        `:h}
      </div>
    `}_renderDetails(e){let t=this._lang,i=e.history||[],n=e.history_count??i.length,o=Fi(i).slice(0,20);return l`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${s("times_performed",t)}</span>
            <span class="stat-value">${e.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("total_cost",t)}</span>
            <span class="stat-value">${D(e.total_cost??0,this._currencySymbol,t)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("avg_duration",t)}</span>
            <span class="stat-value">${de(e.average_duration!=null?Math.round(e.average_duration):null,t)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${s("history",t)}</strong>
          <span class="history-count">${n}</span>
        </div>
        ${i.length===0?l`<div class="history-empty">${s("history_empty",t)}</div>`:l`
              <div class="history-list">
                ${o.map(c=>Di(c,{lang:t,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:he(this.hass?.user,this._access)?u=>this._onEditHistoryEntry(u):void 0,readingUnit:e.reading_unit,readingSlotDelta:(u,_)=>Ct(i,u,_),taskRef:this._taskRef},{compact:!0}))}
                ${n>o.length?l`<div class="history-more">… +${n-o.length} ${s("older_entries",t)}</div>`:h}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return h;let e=this._lang,t=this._task,i=he(this.hass?.user,this._access),n=!!t&&(!!t.archived||t.enabled===!1||t.status==="paused");return fe(()=>this.close(),l`
        ${t?l`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${Ge(t)}"></span>
                  <span class="task-name">${t.name}</span>
                  ${ji(t,e)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("./dialog-mount-JOIM2RAV.js").then(({openObjectQuickActions:o})=>{o(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${t.next_due?l`<span><strong>${s("next_due",e)}:</strong> ${H(t.next_due,e)}</span>`:h}
                  ${t.last_performed?l`<span><strong>${s("last_performed",e)}:</strong> ${H(t.last_performed,e)}</span>`:h}
                  ${t.schedule?.kind&&!["manual","one_time"].includes(t.schedule.kind)||t.interval_days!=null?l`<span><strong>${s("interval",e)}:</strong> ${Dt(t,e)}</span>`:h}
                  ${Ee(t)?l`<span><strong>${s("phase_current",e)}:</strong> ${Ee(t)}</span>`:h}
                </div>
                ${t.notes?l`<div class="notes-body">${We(t.notes)}</div>`:h}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:h}

              ${this._showSkip?l`
                    <div class="inline-form">
                      <ms-textfield label=${s("skip_reason",e)} .value=${this._skipReason}
                        @input=${o=>{this._skipReason=o.target.value}}></ms-textfield>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${s("cancel",e)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${s("skip",e)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?l`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${s("reset_to_date",e)}
                        .hass=${this.hass}
                        .lang=${e}
                        .value=${this._resetDate}
                        @value-changed=${o=>{this._resetDate=o.detail.value}}
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
                  `:this._showPostpone?l`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${s("postpone_date_prompt",e)}
                        .hass=${this.hass}
                        .lang=${e}
                        .value=${this._postponeDate}
                        @value-changed=${o=>{this._postponeDate=o.detail.value}}
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
                  `:l`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${()=>this._onComplete()} .disabled=${this._busy}
                        title=${re(t)?s("qr_action_quick_complete",e):s("complete",e)}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${s("complete",e)}
                      </ha-button>
                      ${re(t)?l`<ha-button appearance="outlined" variant="success" class="qa-complete-details" @click=${()=>this._onComplete(!0)} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:text-box-edit-outline"></ha-icon>
                            ${s("complete_with_details",e)}
                          </ha-button>`:h}
                      ${t.allow_skip!==!1?l`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${s("skip",e)}
                            </ha-button>
                          `:h}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${s("reset",e)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${i?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${s("edit",e)}
                          </ha-button>`:h}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${s("qr_code",e)}
                      </ha-button>
                      ${n?h:l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${s("postpone",e)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${s("snooze",e)}
                          </ha-button>`}
                      ${i?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${t.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${t.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${t.archived?s("unarchive",e):s("archive",e)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${s("delete",e)}
                          </ha-button>`:h}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?s("hide_details",e):s("show_details",e)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?l`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?s("hide_stats",e):s("show_stats",e)}
                          </button>`:h}
                    </div>
                    ${this._showDetails?this._renderDetails(t):h}
                    ${this._showAdaptive?this._renderAdaptive(t):h}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${s("open_in_panel",e)}
                      </button>
                    </div>
                  `}
            `:this._error?l`<div class="error">${this._error}</div>`:l`<div class="loading">${s("loading",e)}</div>`}
    `)}updated(e){e.has("_open")&&this._open&&ve(this.shadowRoot)}};E.styles=[Ut,ge,w`
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
      border-radius: 6px; cursor: pointer;
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
      margin-top: 8px; padding: 8px; border-radius: 6px;
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
      padding: 8px; border-radius: 6px;
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
      padding: 8px; border-radius: 6px;
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
      padding: 6px 8px; border-radius: 6px; border-bottom: none; margin-bottom: 6px;
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
      padding: 8px 12px; border-radius: 6px;
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
  `],d([f({attribute:!1})],E.prototype,"hass",2),d([p()],E.prototype,"_open",2),d([p()],E.prototype,"_entryId",2),d([p()],E.prototype,"_taskId",2),d([p()],E.prototype,"_task",2),d([p()],E.prototype,"_objectName",2),d([p()],E.prototype,"_taskRef",2),d([p()],E.prototype,"_busy",2),d([p()],E.prototype,"_error",2),d([p()],E.prototype,"_showSkip",2),d([p()],E.prototype,"_showReset",2),d([p()],E.prototype,"_showPostpone",2),d([p()],E.prototype,"_showDetails",2),d([p()],E.prototype,"_showAdaptive",2),d([p()],E.prototype,"_skipReason",2),d([p()],E.prototype,"_resetDate",2),d([p()],E.prototype,"_postponeDate",2),d([p()],E.prototype,"_features",2),d([p()],E.prototype,"_toast",2),d([p()],E.prototype,"_access",2),d([p()],E.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",E);function Ki(r,a,e){return r&&a?.[r]?.name||e}function Yi(r){if(r.key!=="Enter"&&r.key!==" ")return;let e=r.target?.closest?.('[role="menuitem"], [role="button"]');!e||e.getAttribute("aria-disabled")==="true"||(r.preventDefault(),e.click())}var j=class extends T{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=Pe;this._loadSeq=0}get _lang(){return C(this.hass)}async openFor(e){e!==this._entryId&&(this._data=null),this._entryId=e,this._error="",this._open=!0,await Promise.all([this._load(),Q(this.hass).then(t=>{this._access=t.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let e=this._entryId;if(!e)return;let t=++this._loadSeq,i="",n=await A(this,{type:"maintenance_supporter/object",entry_id:e},{onError:o=>{i=o}});t===this._loadSeq&&(n===void 0?this._error=i:this._data=n)}_runWs(e){return this._error="",A(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_onEditObject(){!this._entryId||!this._data||import("./dialog-mount-JOIM2RAV.js").then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("./dialog-mount-JOIM2RAV.js").then(({openCreateTaskDialog:e})=>{e(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await ie(this.hass,{title:s("delete",this._lang),message:s("delete_object_confirm",this._lang),confirmText:s("delete",this._lang),danger:!0}))return;let t=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let e=!!this._data.object.archived;if(!e&&!await ie(this.hass,{title:s("archive_object",this._lang),message:s("confirm_archive_object",this._lang),confirmText:s("archive_object",this._lang)}))return;let t=this._entryId;await this._runWs({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}_onTaskClick(e){this._entryId&&import("./dialog-mount-JOIM2RAV.js").then(({openTaskQuickActions:t})=>{t(this._entryId,e)})}render(){if(!this._open)return h;let e=this._lang,t=this._data,i=t?.object,n=t?.tasks||[],o=he(this.hass?.user,this._access);return fe(()=>this.close(),l`
        ${t&&i?l`
              <div class="header">
                <div class="title">${i.name}</div>
                ${this._renderMetaRow(i)}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:h}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${s("tasks",e)}</strong>
                  <span class="count">${n.length}</span>
                </div>
                ${n.length===0?l`<div class="empty">${s("no_tasks",e)}</div>`:l`
                      <div class="task-list">
                        ${n.map(c=>l`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(c.id)} @keydown=${Yi}>
                            <span class="status-dot" style="background: ${Ge(c)}"></span>
                            <span class="task-name">${c.name}</span>
                            <span class="task-status ${Se(c)}">${gt(Se(c),e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?l`
                    <div class="notes-section">
                      <strong>${s("object_notes_label",e)}</strong>
                      <div class="notes-body">${We(i.notes)}</div>
                    </div>
                  `:h}

              ${o?l`
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
                  `:h}
            `:this._error?l`<div class="error">${this._error}</div>`:l`<div class="loading">${s("loading",e)}</div>`}
    `)}updated(e){e.has("_open")&&this._open&&ve(this.shadowRoot)}_renderMetaRow(e){let t=this._lang,i=[];return e.area_id&&i.push([s("area",t),Ki(e.area_id,this.hass?.areas,s("no_area",t))]),e.manufacturer&&i.push([s("manufacturer",t),e.manufacturer]),e.model&&i.push([s("model",t),e.model]),e.serial_number&&i.push([s("serial_number_label",t),e.serial_number]),e.installation_date&&i.push([s("installed",t),H(e.installation_date,t)]),e.warranty_expiry&&i.push([s("warranty",t),H(e.warranty_expiry,t)]),e.documentation_url&&i.push([s("documentation_url_label",t),e.documentation_url,Be(e.documentation_url)]),i.length===0?h:l`
      <div class="meta">
        ${i.map(([n,o,c])=>l`
            <div class="meta-item">
              <span class="meta-label">${n}</span>
              <span class="meta-value">${c||Pi(o)?l`<a href="${o}" target="_blank" rel="noopener noreferrer">${o}</a>`:o}</span>
            </div>
          `)}
      </div>
    `}};j.styles=[ge,w`
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
      padding: 8px; border-radius: 6px; cursor: pointer;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      transition: background 0.12s;
    }
    .task-row:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .task-row:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .task-name { flex: 1; font-size: 14px; }
    .task-status { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; }
    .notes-body { white-space: pre-wrap; font-size: 13px; padding: 8px; background: var(--secondary-background-color); border-radius: 6px; }
    .notes-body ha-markdown { white-space: normal; }
    .actions { display: flex; gap: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color); }
    .actions .btn { flex: 1; }
    .btn {
      padding: 8px; font-size: 13px; border-radius: 6px; cursor: pointer;
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
    .error { padding: 8px; border-radius: 6px; background: rgba(211,47,47,0.1); color: var(--error-color); font-size: 13px; }
  `],d([f({attribute:!1})],j.prototype,"hass",2),d([p()],j.prototype,"_open",2),d([p()],j.prototype,"_entryId",2),d([p()],j.prototype,"_data",2),d([p()],j.prototype,"_busy",2),d([p()],j.prototype,"_error",2),d([p()],j.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",j);var Zi="maintenance-object-dialog",Ji="maintenance-task-dialog",or="maintenance-history-edit-dialog",lr="maintenance-complete-dialog",dr="maintenance-qr-dialog",cr="maintenance-task-quick-actions-dialog",pr="maintenance-object-quick-actions-dialog";function ye(){return document.querySelector("home-assistant")?.hass}function hr(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function Y(r){let a=hr(),e=a.querySelector(r)??document.body.querySelector(r);return e?e.parentNode!==a&&a.appendChild(e):(e=document.createElement(r),a.appendChild(e)),e}function Z(r){let a=ye();if(!a)return!1;r.hass=a;let e=C(a);return $t(e)||xt(e).then(()=>{r.requestUpdate?.()}),Nt(a.locale,a.config?.country,a.config?.time_zone),!0}function vd(r){return Q(r).then(a=>a.rowActionStyle)}function yd(){Gt()}function bd(){let r=Y(Zi);return Z(r)?(r.openCreate(),Xi(r),!0):!1}async function Xi(r){let a=ye();a&&(r.placesEnabled=(await Q(a)).features.places)}function $d(r,a){let e=Y(Zi);return Z(e)?(e.openEdit(r,a),Xi(e),!0):!1}function xd(r="",a){let e=Y(Ji);if(!Z(e))return!1;let t=ye();return t?((async()=>{let i=await Q(t),n=e;es(n,i),n.openCreate(r,a)})(),!0):!1}function es(r,a){r.checklistsEnabled=a.features.checklists,r.scheduleTimeEnabled=a.features.schedule_time,r.completionActionsEnabled=a.features.completion_actions,r.adaptiveFeature=a.features.adaptive,r.seasonalFeature=a.features.seasonal,r.environmentalFeature=a.features.environmental,r.defaultWarningDays=a.defaultWarningDays,r.mirrorTodoDefault=a.mirrorTodoDefault}function kd(r,a){let e=Y(Ji);if(!Z(e))return!1;let t=ye();return t?((async()=>{try{let[i,n]=await Promise.all([t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:r}),Q(t)]),o=(i.tasks||[]).find(u=>u.id===a);if(!o){console.warn(`openEditTaskDialog: task ${a} not found in entry ${r}`);return}let c=e;es(c,n),await c.openEdit(r,o)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function wd(r){let a=Y(or);return Z(a)?(a.openEdit(r),!0):!1}function Ed(r){let a=Y(lr);if(!Z(a))return!1;let e=a;return e.__msUndoWired||(e.__msUndoWired=!0,a.addEventListener("task-completed",t=>{let i=t.detail,n=ye();i?.undo&&n&&Ke(a,n,i,C(n),()=>{})})),Ii(a,r,C(ye())),!0}function Td(r){let a=Y(dr);return Z(a)?(a.openForTask(r.entry_id,r.task_id,r.object_name,r.task_name),!0):!1}function Sd(r,a){let e=Y(cr);return Z(e)?(e.openFor(r,a),!0):!1}function Id(r){let a=Y(pr);return Z(a)?(a.openFor(r),!0):!1}export{yd as __resetSettingsCacheForTests,vd as getRowActionStyle,Ed as openCompleteDialog,bd as openCreateObjectDialog,xd as openCreateTaskDialog,$d as openEditObjectDialog,kd as openEditTaskDialog,wd as openHistoryEditDialog,Id as openObjectQuickActions,Td as openQrDialog,Sd as openTaskQuickActions};
/*! Bundled license information:

lit-html/directive-helpers.js:
lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
