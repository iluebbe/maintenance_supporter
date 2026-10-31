/*! maintenance_supporter frontend 2.114.0 */
import{a as m}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NEI2AOPY.js";import{a as l,b as f,c as p,f as _,h as b,m as v,n as o,v as y,w as r}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-SKVFH5HU.js";function u(d){return d.object.parent_entry_id||null}function x(d){let c=new Map(d.map(a=>[a.entry_id,a])),e=a=>{let s=new Set,h=u(a);for(;h&&c.has(h)&&!s.has(h);){if(h===a.entry_id)return!0;s.add(h),h=u(c.get(h))}return!1},i=[],t=new Map;for(let a of d){let s=u(a);if(!s||!c.has(s)||e(a)){i.push(a);continue}t.has(s)||t.set(s,[]),t.get(s).push(a)}return{roots:i,children:t}}function I(d,c){let e=[],i=new Set,t=a=>{if(!i.has(a.entry_id)){i.add(a.entry_id),e.push(a);for(let s of d.children.get(a.entry_id)??[])t(s)}};return t(c),e}function g(d,c){let e=new Map(d.map(s=>[s.entry_id,s])),i=[],t=new Set([c]),a=e.get(c);for(;a;){let s=u(a);if(!s||t.has(s))break;let h=e.get(s);if(!h)break;t.add(s),i.unshift(h),a=h}return i}function $(d,c){let e=new Map;for(let a of d){let s=u(a);s&&(e.has(s)||e.set(s,[]),e.get(s).push(a.entry_id))}let i=new Set,t=[...e.get(c)??[]];for(;t.length;){let a=t.pop();a===c||i.has(a)||(i.add(a),t.push(...e.get(a)??[]))}return i}function w(d,c){d.roots.sort(c);for(let e of d.children.values())e.sort(c)}function E(d,c){let e=[],i=new Set,t=(a,s)=>{if(!i.has(a.entry_id)&&(i.add(a.entry_id),e.push({obj:a,depth:s}),!!c(a.entry_id)))for(let h of d.children.get(a.entry_id)??[])t(h,s+1)};for(let a of d.roots)t(a,0);return e}var n=class extends b{constructor(){super(...arguments);this.objects=[];this.placesEnabled=!1;this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._place="";this._remindOnSite=!1;this._entryId=null;this._replacing=!1;this._oldDeviceId="";this._replaceDevice="keep"}get _lang(){return y(this.hass)}openCreate(e=""){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId=e,this._place="",this._remindOnSite=!1,this._replacing=!1,this._error="",this._open=!0}openReplace(e,i){this._entryId=e,this._replacing=!0,this._name=i.name||"",this._oldDeviceId=i.ha_device_id||"",this._haDeviceId="",this._replaceDevice="keep",this._error="",this._open=!0}openEdit(e,i){this._entryId=e,this._name=i.name||"",this._manufacturer=i.manufacturer||"",this._model=i.model||"",this._serialNumber=i.serial_number||"",this._areaId=i.area_id||"",this._installationDate=i.installation_date||"",this._warrantyExpiry=i.warranty_expiry||"",this._documentationUrl=i.documentation_url||"",this._notes=i.notes||"",this._haDeviceId=i.ha_device_id||"",this._parentEntryId=i.parent_entry_id||"",this._place=i.place||"",this._remindOnSite=!!i.remind_on_site,this._replacing=!1,this._error="",this._open=!0}async _replace(){if(this._loading||!this._entryId)return;let e={type:"maintenance_supporter/object/replace",entry_id:this._entryId,name:this._name.trim()||null};this._oldDeviceId?(this._replaceDevice==="other"&&(e.ha_device_id=this._haDeviceId),this._replaceDevice==="none"&&(e.ha_device_id=null)):this._haDeviceId&&(e.ha_device_id=this._haDeviceId);let i=await m(this,e,{busy:t=>{this._loading=t},fallbackKey:"save_error",onError:t=>{this._error=t}});i!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-replaced",{detail:{entry_id:i?.entry_id,device_swap:i?.device_swap}})))}_deviceName(e){let t=this.hass?.devices?.[e];return t?.name_by_user||t?.name||e}_deviceSelector(e){return p`<ha-form
      .hass=${this.hass}
      .data=${{device:this._haDeviceId||void 0}}
      .schema=${[{name:"device",selector:{device:{}}}]}
      .computeLabel=${()=>e}
      @value-changed=${i=>this._haDeviceId=i.detail.value?.device||""}
    ></ha-form>`}_renderReplace(){let e=this._lang,i=(a,s)=>p`<label class="radio-row">
      <input
        type="radio"
        name="replace-device"
        .checked=${this._replaceDevice===a}
        @change=${()=>{this._replaceDevice=a}}
      />
      <span>${s}</span>
    </label>`,t=this._replaceDevice==="other"&&!this._haDeviceId;return p`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${r("replace_object",e)}</div>
        <div class="content">
          ${this._error?p`<div class="error">${this._error}</div>`:_}
          <div class="hint">${r("replace_object_prompt",e)}</div>
          <ms-textfield
            label="${r("replace_name_label",e)}"
            .value=${this._name}
            @input=${a=>this._name=a.target.value}
          ></ms-textfield>
          ${this._oldDeviceId?p`<div class="radio-group" role="radiogroup" aria-label=${r("replace_device_heading",e)}>
                <div class="textarea-label">${r("replace_device_heading",e)}</div>
                ${i("keep",r("replace_device_keep",e).replace("{device}",this._deviceName(this._oldDeviceId)))}
                ${this._replaceDevice==="keep"?p`<div class="hint">${r("replace_device_keep_hint",e)}</div>`:_}
                ${i("other",r("replace_device_other",e))}
                ${this._replaceDevice==="other"?p`${this._deviceSelector(r("replace_device_pick",e))}
                      <div class="hint">${r("replace_device_other_hint",e)}</div>`:_}
                ${i("none",r("replace_device_none",e))}
              </div>`:this._deviceSelector(r("link_device_optional",e))}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${r("cancel",e)}
          </ha-button>
          <ha-button @click=${this._replace} .disabled=${this._loading||t}>
            ${this._loading?r("saving",e):r("replace_object",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}_renderPlace(e){let i=!!this._place&&!this.hass?.states?.[this._place];return p`
      <ha-form
        .hass=${this.hass}
        .data=${{place:this._place||void 0}}
        .schema=${[{name:"place",selector:{entity:{domain:"zone"}}}]}
        .computeLabel=${()=>r("place_optional",e)}
        @value-changed=${t=>{this._place=t.detail.value?.place||"",this._place||(this._remindOnSite=!1)}}
      ></ha-form>
      ${i?p`<div class="place-missing">${r("place_missing",e)}</div>`:_}
      <label class="place-on-site ${this._place?"":"disabled"}">
        <input
          type="checkbox"
          .checked=${this._remindOnSite}
          ?disabled=${!this._place}
          @change=${t=>this._remindOnSite=t.target.checked}
        />
        <span>${r("remind_on_site",e)}</span>
      </label>
      ${this._place?p`<div class="place-hint">${r("remind_on_site_hint",e)}</div>`:_}
    `}async _save(){if(this._loading||!this._name.trim())return;this._error="";let e={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null,...this.placesEnabled?{place:this._place||null,remind_on_site:!!this._place&&this._remindOnSite}:{}},i=await m(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...e}:{type:"maintenance_supporter/object/create",...e},{busy:t=>{this._loading=t},fallbackKey:"save_error",onError:t=>{this._error=t}});i!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved",{detail:{device_swap:i?.device_swap}})))}_parentChoices(){let e=this.objects||[],i=this._entryId?$(e,this._entryId):new Set;return e.filter(t=>t.entry_id!==this._entryId&&!i.has(t.entry_id)).map(t=>({entryId:t.entry_id,label:[...g(e,t.entry_id),t].map(a=>a.object.name).join(" \u203A ")})).sort((t,a)=>t.label.localeCompare(a.label))}_close(){this._open=!1}render(){if(!this._open)return p``;if(this._replacing)return this._renderReplace();let e=this._lang,i=this._entryId?r("edit_object",e):r("new_object",e);return p`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._error?p`<div class="error">${this._error}</div>`:_}
          <ms-textfield
            label="${r("name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${r("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${t=>this._manufacturer=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${r("model_optional",e)}"
            .value=${this._model}
            @input=${t=>this._model=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${r("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${t=>this._serialNumber=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${r("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${t=>this._documentationUrl=t.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${r("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${t=>this._areaId=t.detail.value||""}
          ></ha-area-picker>
          ${this.placesEnabled?this._renderPlace(e):_}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${r("installation_date_optional",e)}"
            .value=${this._installationDate}
            @value-changed=${t=>this._installationDate=t.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${r("warranty_expiry_optional",e)}"
            .value=${this._warrantyExpiry}
            @value-changed=${t=>this._warrantyExpiry=t.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>r("link_device_optional",e)}
            @value-changed=${t=>this._haDeviceId=t.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?p`<label class="textarea-field">
                <span class="textarea-label">${r("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${t=>this._parentEntryId=t.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${r("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(t=>p`<option
                      value=${t.entryId}
                      ?selected=${this._parentEntryId===t.entryId}
                    >${t.label}</option>`)}
                </select>
                <span class="md-hint">${r("parent_object_hint",e)}</span>
              </label>`:_}
          <label class="textarea-field">
            <span class="textarea-label">${r("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value}
            ></textarea>
            <span class="md-hint">${r("notes_markdown_hint",e)}</span>
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${r("cancel",this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?r("saving",this._lang):r("save",this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};n.styles=f`
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
  `,l([v({attribute:!1})],n.prototype,"hass",2),l([v({attribute:!1})],n.prototype,"objects",2),l([v({type:Boolean})],n.prototype,"placesEnabled",2),l([o()],n.prototype,"_open",2),l([o()],n.prototype,"_loading",2),l([o()],n.prototype,"_error",2),l([o()],n.prototype,"_name",2),l([o()],n.prototype,"_manufacturer",2),l([o()],n.prototype,"_model",2),l([o()],n.prototype,"_serialNumber",2),l([o()],n.prototype,"_areaId",2),l([o()],n.prototype,"_installationDate",2),l([o()],n.prototype,"_warrantyExpiry",2),l([o()],n.prototype,"_documentationUrl",2),l([o()],n.prototype,"_notes",2),l([o()],n.prototype,"_haDeviceId",2),l([o()],n.prototype,"_parentEntryId",2),l([o()],n.prototype,"_place",2),l([o()],n.prototype,"_remindOnSite",2),l([o()],n.prototype,"_entryId",2),l([o()],n.prototype,"_replacing",2),l([o()],n.prototype,"_oldDeviceId",2),l([o()],n.prototype,"_replaceDevice",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",n);export{x as a,I as b,g as c,w as d,E as e,n as f};
