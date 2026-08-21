/*! maintenance_supporter frontend 2.62.0 */
import{a as u}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZJNJGQ54.js";import{a as r,b as _,c as l,f as o,g as p,k as d,l as s,p as i,q as h}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-7JAEHM7G.js";var e=class extends p{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._entryId=null}get _lang(){return h(this.hass)}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._error="",this._open=!0}openEdit(a,n){this._entryId=a,this._name=n.name||"",this._manufacturer=n.manufacturer||"",this._model=n.model||"",this._serialNumber=n.serial_number||"",this._areaId=n.area_id||"",this._installationDate=n.installation_date||"",this._warrantyExpiry=n.warranty_expiry||"",this._documentationUrl=n.documentation_url||"",this._notes=n.notes||"",this._haDeviceId=n.ha_device_id||"",this._parentEntryId=n.parent_entry_id||"",this._error="",this._open=!0}async _save(){if(!this._loading&&this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(a){this._error=u(a,this._lang,i("save_error",this._lang))}finally{this._loading=!1}}}_parentChoices(){return(this.objects||[]).filter(a=>a.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return l``;let a=this._lang,n=this._entryId?i("edit_object",a):i("new_object",a);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${n}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:o}
          <ms-textfield
            label="${i("name",a)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("manufacturer_optional",a)}"
            .value=${this._manufacturer}
            @input=${t=>this._manufacturer=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("model_optional",a)}"
            .value=${this._model}
            @input=${t=>this._model=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("serial_number_optional",a)}"
            .value=${this._serialNumber}
            @input=${t=>this._serialNumber=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("documentation_url_optional",a)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${t=>this._documentationUrl=t.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${i("area_id_optional",a)}"
            .value=${this._areaId}
            @value-changed=${t=>this._areaId=t.detail.value||""}
          ></ha-area-picker>
          <ms-textfield
            label="${i("installation_date_optional",a)}"
            type="date"
            .value=${this._installationDate}
            @input=${t=>this._installationDate=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("warranty_expiry_optional",a)}"
            type="date"
            .value=${this._warrantyExpiry}
            @input=${t=>this._warrantyExpiry=t.target.value}
          ></ms-textfield>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>i("link_device_optional",a)}
            @value-changed=${t=>this._haDeviceId=t.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?l`<label class="textarea-field">
                <span class="textarea-label">${i("parent_object_optional",a)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${t=>this._parentEntryId=t.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${i("parent_none",a)}
                  </option>
                  ${this._parentChoices().map(t=>l`<option
                      value=${t.entry_id}
                      ?selected=${this._parentEntryId===t.entry_id}
                    >${t.object.name}</option>`)}
                </select>
              </label>`:o}
          <label class="textarea-field">
            <span class="textarea-label">${i("object_notes_optional",a)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value}
            ></textarea>
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
    `}};e.styles=_`
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
  `,r([d({attribute:!1})],e.prototype,"hass",2),r([d({attribute:!1})],e.prototype,"objects",2),r([s()],e.prototype,"_open",2),r([s()],e.prototype,"_loading",2),r([s()],e.prototype,"_error",2),r([s()],e.prototype,"_name",2),r([s()],e.prototype,"_manufacturer",2),r([s()],e.prototype,"_model",2),r([s()],e.prototype,"_serialNumber",2),r([s()],e.prototype,"_areaId",2),r([s()],e.prototype,"_installationDate",2),r([s()],e.prototype,"_warrantyExpiry",2),r([s()],e.prototype,"_documentationUrl",2),r([s()],e.prototype,"_notes",2),r([s()],e.prototype,"_haDeviceId",2),r([s()],e.prototype,"_parentEntryId",2),r([s()],e.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",e);export{e as a};
