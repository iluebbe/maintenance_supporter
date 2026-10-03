/*! maintenance_supporter frontend 2.96.0 */
import{a as _}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MQUKARFD.js";import{a as s,b as p,c as l,f as o,h,l as c,m as n,s as i,y as v}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KPG2W5SO.js";var r=class extends h{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._entryId=null;this._replacing=!1;this._oldDeviceId="";this._replaceDevice="keep"}get _lang(){return v(this.hass)}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._replacing=!1,this._error="",this._open=!0}openReplace(e,a){this._entryId=e,this._replacing=!0,this._name=a.name||"",this._oldDeviceId=a.ha_device_id||"",this._haDeviceId="",this._replaceDevice="keep",this._error="",this._open=!0}openEdit(e,a){this._entryId=e,this._name=a.name||"",this._manufacturer=a.manufacturer||"",this._model=a.model||"",this._serialNumber=a.serial_number||"",this._areaId=a.area_id||"",this._installationDate=a.installation_date||"",this._warrantyExpiry=a.warranty_expiry||"",this._documentationUrl=a.documentation_url||"",this._notes=a.notes||"",this._haDeviceId=a.ha_device_id||"",this._parentEntryId=a.parent_entry_id||"",this._replacing=!1,this._error="",this._open=!0}async _replace(){if(this._loading||!this._entryId)return;let e={type:"maintenance_supporter/object/replace",entry_id:this._entryId,name:this._name.trim()||null};this._oldDeviceId?(this._replaceDevice==="other"&&(e.ha_device_id=this._haDeviceId),this._replaceDevice==="none"&&(e.ha_device_id=null)):this._haDeviceId&&(e.ha_device_id=this._haDeviceId);let a=await _(this,e,{busy:t=>{this._loading=t},fallbackKey:"save_error",onError:t=>{this._error=t}});a!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-replaced",{detail:{entry_id:a?.entry_id,device_swap:a?.device_swap}})))}_deviceName(e){let t=this.hass?.devices?.[e];return t?.name_by_user||t?.name||e}_deviceSelector(e){return l`<ha-form
      .hass=${this.hass}
      .data=${{device:this._haDeviceId||void 0}}
      .schema=${[{name:"device",selector:{device:{}}}]}
      .computeLabel=${()=>e}
      @value-changed=${a=>this._haDeviceId=a.detail.value?.device||""}
    ></ha-form>`}_renderReplace(){let e=this._lang,a=(d,u)=>l`<label class="radio-row">
      <input
        type="radio"
        name="replace-device"
        .checked=${this._replaceDevice===d}
        @change=${()=>{this._replaceDevice=d}}
      />
      <span>${u}</span>
    </label>`,t=this._replaceDevice==="other"&&!this._haDeviceId;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i("replace_object",e)}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:o}
          <div class="hint">${i("replace_object_prompt",e)}</div>
          <ms-textfield
            label="${i("replace_name_label",e)}"
            .value=${this._name}
            @input=${d=>this._name=d.target.value}
          ></ms-textfield>
          ${this._oldDeviceId?l`<div class="radio-group" role="radiogroup" aria-label=${i("replace_device_heading",e)}>
                <div class="textarea-label">${i("replace_device_heading",e)}</div>
                ${a("keep",i("replace_device_keep",e).replace("{device}",this._deviceName(this._oldDeviceId)))}
                ${this._replaceDevice==="keep"?l`<div class="hint">${i("replace_device_keep_hint",e)}</div>`:o}
                ${a("other",i("replace_device_other",e))}
                ${this._replaceDevice==="other"?l`${this._deviceSelector(i("replace_device_pick",e))}
                      <div class="hint">${i("replace_device_other_hint",e)}</div>`:o}
                ${a("none",i("replace_device_none",e))}
              </div>`:this._deviceSelector(i("link_device_optional",e))}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${i("cancel",e)}
          </ha-button>
          <ha-button @click=${this._replace} .disabled=${this._loading||t}>
            ${this._loading?i("saving",e):i("replace_object",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}async _save(){if(this._loading||!this._name.trim())return;this._error="";let e={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null},a=await _(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...e}:{type:"maintenance_supporter/object/create",...e},{busy:t=>{this._loading=t},fallbackKey:"save_error",onError:t=>{this._error=t}});a!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved",{detail:{device_swap:a?.device_swap}})))}_parentChoices(){return(this.objects||[]).filter(e=>e.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return l``;if(this._replacing)return this._renderReplace();let e=this._lang,a=this._entryId?i("edit_object",e):i("new_object",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${a}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:o}
          <ms-textfield
            label="${i("name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${t=>this._manufacturer=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("model_optional",e)}"
            .value=${this._model}
            @input=${t=>this._model=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${t=>this._serialNumber=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${t=>this._documentationUrl=t.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${i("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${t=>this._areaId=t.detail.value||""}
          ></ha-area-picker>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${i("installation_date_optional",e)}"
            .value=${this._installationDate}
            @value-changed=${t=>this._installationDate=t.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${i("warranty_expiry_optional",e)}"
            .value=${this._warrantyExpiry}
            @value-changed=${t=>this._warrantyExpiry=t.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>i("link_device_optional",e)}
            @value-changed=${t=>this._haDeviceId=t.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?l`<label class="textarea-field">
                <span class="textarea-label">${i("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${t=>this._parentEntryId=t.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${i("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(t=>l`<option
                      value=${t.entry_id}
                      ?selected=${this._parentEntryId===t.entry_id}
                    >${t.object.name}</option>`)}
                </select>
              </label>`:o}
          <label class="textarea-field">
            <span class="textarea-label">${i("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value}
            ></textarea>
            <span class="md-hint">${i("notes_markdown_hint",e)}</span>
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${i("cancel",this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?i("saving",this._lang):i("save",this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};r.styles=p`
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
    .md-hint {
      font-size: 11px; color: var(--secondary-text-color); font-style: italic;
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
  `,s([c({attribute:!1})],r.prototype,"hass",2),s([c({attribute:!1})],r.prototype,"objects",2),s([n()],r.prototype,"_open",2),s([n()],r.prototype,"_loading",2),s([n()],r.prototype,"_error",2),s([n()],r.prototype,"_name",2),s([n()],r.prototype,"_manufacturer",2),s([n()],r.prototype,"_model",2),s([n()],r.prototype,"_serialNumber",2),s([n()],r.prototype,"_areaId",2),s([n()],r.prototype,"_installationDate",2),s([n()],r.prototype,"_warrantyExpiry",2),s([n()],r.prototype,"_documentationUrl",2),s([n()],r.prototype,"_notes",2),s([n()],r.prototype,"_haDeviceId",2),s([n()],r.prototype,"_parentEntryId",2),s([n()],r.prototype,"_entryId",2),s([n()],r.prototype,"_replacing",2),s([n()],r.prototype,"_oldDeviceId",2),s([n()],r.prototype,"_replaceDevice",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",r);export{r as a};
