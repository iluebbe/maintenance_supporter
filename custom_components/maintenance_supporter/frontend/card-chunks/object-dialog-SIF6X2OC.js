/*! maintenance_supporter frontend 2.120.0 */
import"/maintenance_supporter_cardfiles/card-chunks/chunk-BR53IYN4.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-DIBMH4GA.js";import{a as b}from"/maintenance_supporter_cardfiles/card-chunks/chunk-HXWDRZAP.js";import{a as v}from"/maintenance_supporter_cardfiles/card-chunks/chunk-YV22LRFJ.js";import{a as _,b as n}from"/maintenance_supporter_cardfiles/card-chunks/chunk-OYEWBM6G.js";import{a as s,b as y,e as c,h,j as g,ma as m,na as f,w as $,x as a}from"/maintenance_supporter_cardfiles/card-chunks/chunk-VJB3IP3X.js";function x(d){return d.object.parent_entry_id||null}function I(d){return!d.object.archived&&!d.object.battery_fleet}function k(d,p){let e=new Map(d.map(o=>[o.entry_id,o])),i=[],t=new Set([p]),l=e.get(p);for(;l;){let o=x(l);if(!o||t.has(o))break;let u=e.get(o);if(!u)break;t.add(o),i.unshift(u),l=u}return i}function w(d,p){return[...k(d,p.entry_id),p].map(e=>e.object.name).join(" \u203A ")}function E(d,p){let e=new Map;for(let l of d){let o=x(l);o&&(e.has(o)||e.set(o,[]),e.get(o).push(l.entry_id))}let i=new Set,t=[...e.get(p)??[]];for(;t.length;){let l=t.pop();l===p||i.has(l)||(i.add(l),t.push(...e.get(l)??[]))}return i}var r=class extends g{constructor(){super(...arguments);this.objects=[];this.placesEnabled=!1;this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._place="";this._remindOnSite=!1;this._entryId=null;this._replacing=!1;this._oldDeviceId="";this._replaceDevice="keep"}get _lang(){return $(this.hass)}openCreate(e=""){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId=e,this._place="",this._remindOnSite=!1,this._replacing=!1,this._error="",this._open=!0}openReplace(e,i){this._entryId=e,this._replacing=!0,this._name=i.name||"",this._oldDeviceId=i.ha_device_id||"",this._haDeviceId="",this._replaceDevice="keep",this._error="",this._open=!0}openEdit(e,i){this._entryId=e,this._name=i.name||"",this._manufacturer=i.manufacturer||"",this._model=i.model||"",this._serialNumber=i.serial_number||"",this._areaId=i.area_id||"",this._installationDate=i.installation_date||"",this._warrantyExpiry=i.warranty_expiry||"",this._documentationUrl=i.documentation_url||"",this._notes=i.notes||"",this._haDeviceId=i.ha_device_id||"",this._parentEntryId=i.parent_entry_id||"",this._place=i.place||"",this._remindOnSite=!!i.remind_on_site,this._replacing=!1,this._error="",this._open=!0}async _replace(){if(this._loading||!this._entryId)return;let e={type:"maintenance_supporter/object/replace",entry_id:this._entryId,name:this._name.trim()||null};this._oldDeviceId?(this._replaceDevice==="other"&&(e.ha_device_id=this._haDeviceId),this._replaceDevice==="none"&&(e.ha_device_id=null)):this._haDeviceId&&(e.ha_device_id=this._haDeviceId);let i=await v(this,e,{busy:t=>{this._loading=t},fallbackKey:"save_error",onError:t=>{this._error=t}});i!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-replaced",{detail:{entry_id:i?.entry_id,device_swap:i?.device_swap}})))}_deviceName(e){let t=this.hass?.devices?.[e];return t?.name_by_user||t?.name||e}_deviceSelector(e){return c`<ha-form
      .hass=${this.hass}
      .data=${{device:this._haDeviceId||void 0}}
      .schema=${[{name:"device",selector:{device:{}}}]}
      .computeLabel=${()=>e}
      @value-changed=${i=>this._haDeviceId=i.detail.value?.device||""}
    ></ha-form>`}_renderReplace(){let e=this._lang,i=(l,o)=>c`<label class="radio-row">
      <input
        type="radio"
        name="replace-device"
        .checked=${this._replaceDevice===l}
        @change=${()=>{this._replaceDevice=l}}
      />
      <span>${o}</span>
    </label>`,t=this._replaceDevice==="other"&&!this._haDeviceId;return c`
      <ha-dialog open .headerTitle=${m(a("replace_object",e))} @closed=${this._close}>
        ${f(a("replace_object",e))}
        <div class="content">
          ${this._error?b("error",this._error):h}
          <div class="hint">${a("replace_object_prompt",e)}</div>
          <ms-textfield
            label="${a("replace_name_label",e)}"
            .value=${this._name}
            @input=${l=>this._name=l.target.value}
          ></ms-textfield>
          ${this._oldDeviceId?c`<div class="radio-group" role="radiogroup" aria-label=${a("replace_device_heading",e)}>
                <div class="textarea-label">${a("replace_device_heading",e)}</div>
                ${i("keep",a("replace_device_keep",e).replace("{device}",this._deviceName(this._oldDeviceId)))}
                ${this._replaceDevice==="keep"?c`<div class="hint">${a("replace_device_keep_hint",e)}</div>`:h}
                ${i("other",a("replace_device_other",e))}
                ${this._replaceDevice==="other"?c`${this._deviceSelector(a("replace_device_pick",e))}
                      <div class="hint">${a("replace_device_other_hint",e)}</div>`:h}
                ${i("none",a("replace_device_none",e))}
              </div>`:this._deviceSelector(a("link_device_optional",e))}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",e)}
          </ha-button>
          <ha-button @click=${this._replace} .disabled=${this._loading||t}>
            ${this._loading?a("saving",e):a("replace_object",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}_renderPlace(e){let i=!!this._place&&!this.hass?.states?.[this._place];return c`
      <ha-form
        .hass=${this.hass}
        .data=${{place:this._place||void 0}}
        .schema=${[{name:"place",selector:{entity:{domain:"zone"}}}]}
        .computeLabel=${()=>a("place_optional",e)}
        @value-changed=${t=>{this._place=t.detail.value?.place||"",this._place||(this._remindOnSite=!1)}}
      ></ha-form>
      ${i?c`<div class="place-missing">${a("place_missing",e)}</div>`:h}
      <label class="place-on-site ${this._place?"":"disabled"}">
        <input
          type="checkbox"
          .checked=${this._remindOnSite}
          ?disabled=${!this._place}
          @change=${t=>this._remindOnSite=t.target.checked}
        />
        <span>${a("remind_on_site",e)}</span>
      </label>
      ${this._place?c`<div class="place-hint">${a("remind_on_site_hint",e)}</div>`:h}
    `}async _save(){if(this._loading||!this._name.trim())return;this._error="";let e={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null,...this.placesEnabled?{place:this._place||null,remind_on_site:!!this._place&&this._remindOnSite}:{}},i=await v(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...e}:{type:"maintenance_supporter/object/create",...e},{busy:t=>{this._loading=t},fallbackKey:"save_error",onError:t=>{this._error=t}});i!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved",{detail:{device_swap:i?.device_swap}})))}_parentChoices(){let e=this.objects||[],i=this._entryId?E(e,this._entryId):new Set;return e.filter(t=>t.entry_id!==this._entryId&&!i.has(t.entry_id)&&(I(t)||t.entry_id===this._parentEntryId)).map(t=>({entryId:t.entry_id,label:w(e,t)})).sort((t,l)=>t.label.localeCompare(l.label))}_close(){this._open=!1}render(){if(!this._open)return c``;if(this._replacing)return this._renderReplace();let e=this._lang,i=this._entryId?a("edit_object",e):a("new_object",e);return c`
      <ha-dialog open .headerTitle=${m(i)} @closed=${this._close}>
        ${f(i)}
        <div class="content">
          ${this._error?b("error",this._error):h}
          <ms-textfield
            label="${a("name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${t=>this._manufacturer=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("model_optional",e)}"
            .value=${this._model}
            @input=${t=>this._model=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${t=>this._serialNumber=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${t=>this._documentationUrl=t.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${a("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${t=>this._areaId=t.detail.value||""}
          ></ha-area-picker>
          ${this.placesEnabled?this._renderPlace(e):h}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${a("installation_date_optional",e)}"
            .value=${this._installationDate}
            @value-changed=${t=>this._installationDate=t.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${a("warranty_expiry_optional",e)}"
            .value=${this._warrantyExpiry}
            @value-changed=${t=>this._warrantyExpiry=t.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>a("link_device_optional",e)}
            @value-changed=${t=>this._haDeviceId=t.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?c`<label class="textarea-field">
                <span class="textarea-label">${a("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${t=>this._parentEntryId=t.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${a("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(t=>c`<option
                      value=${t.entryId}
                      ?selected=${this._parentEntryId===t.entryId}
                    >${t.label}</option>`)}
                </select>
                <span class="md-hint">${a("parent_object_hint",e)}</span>
              </label>`:h}
          <label class="textarea-field">
            <span class="textarea-label">${a("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value}
            ></textarea>
            <span class="md-hint">${a("notes_markdown_hint",e)}</span>
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?a("saving",this._lang):a("save",this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};r.styles=y`
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
  `,s([_({attribute:!1})],r.prototype,"hass",2),s([_({attribute:!1})],r.prototype,"objects",2),s([_({type:Boolean})],r.prototype,"placesEnabled",2),s([n()],r.prototype,"_open",2),s([n()],r.prototype,"_loading",2),s([n()],r.prototype,"_error",2),s([n()],r.prototype,"_name",2),s([n()],r.prototype,"_manufacturer",2),s([n()],r.prototype,"_model",2),s([n()],r.prototype,"_serialNumber",2),s([n()],r.prototype,"_areaId",2),s([n()],r.prototype,"_installationDate",2),s([n()],r.prototype,"_warrantyExpiry",2),s([n()],r.prototype,"_documentationUrl",2),s([n()],r.prototype,"_notes",2),s([n()],r.prototype,"_haDeviceId",2),s([n()],r.prototype,"_parentEntryId",2),s([n()],r.prototype,"_place",2),s([n()],r.prototype,"_remindOnSite",2),s([n()],r.prototype,"_entryId",2),s([n()],r.prototype,"_replacing",2),s([n()],r.prototype,"_oldDeviceId",2),s([n()],r.prototype,"_replaceDevice",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",r);export{r as MaintenanceObjectDialog};
