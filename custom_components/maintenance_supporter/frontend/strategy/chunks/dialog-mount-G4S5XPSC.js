import{a as x,b as r,c as M,d,e as $,f as m,g as o,h as V,i,j,k as Y,l as J,m as X,n as Q,o as tt,p as k}from"./chunk-IS2GT5SB.js";import{a}from"./chunk-LO2NM3CE.js";var w=class extends ${constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1}_onInput(t){let e=t.target.value;this.value=e,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:e}}))}render(){return r`
      <label class="field">
        ${this.label?r`<span class="label">${this.label}${this.required?r`<span class="req">*</span>`:d}</span>`:d}
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??d}
          min=${this.min??d}
          max=${this.max??d}
          pattern=${this.pattern??d}
          @input=${this._onInput}
          @change=${this._onInput}
        />
        ${this.helper?r`<span class="helper">${this.helper}</span>`:d}
      </label>
    `}};w.styles=x`
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
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `,a([m()],w.prototype,"label",2),a([m()],w.prototype,"value",2),a([m()],w.prototype,"placeholder",2),a([m()],w.prototype,"type",2),a([m({type:Boolean})],w.prototype,"required",2),a([m({type:Boolean})],w.prototype,"disabled",2),a([m()],w.prototype,"step",2),a([m()],w.prototype,"min",2),a([m()],w.prototype,"max",2),a([m()],w.prototype,"pattern",2),a([m()],w.prototype,"helper",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",w);var b=class extends ${constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._entryId=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._error="",this._open=!0}openEdit(t,e){this._entryId=t,this._name=e.name||"",this._manufacturer=e.manufacturer||"",this._model=e.model||"",this._serialNumber=e.serial_number||"",this._areaId=e.area_id||"",this._installationDate=e.installation_date||"",this._warrantyExpiry=e.warranty_expiry||"",this._documentationUrl=e.documentation_url||"",this._notes=e.notes||"",this._error="",this._open=!0}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(t){this._error=k(t,this._lang,i("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}render(){if(!this._open)return r``;let t=this._lang,e=this._entryId?i("edit_object",t):i("new_object",t);return r`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._error?r`<div class="error">${this._error}</div>`:d}
          <ms-textfield
            label="${i("name",t)}"
            required
            .value=${this._name}
            @input=${s=>this._name=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("manufacturer_optional",t)}"
            .value=${this._manufacturer}
            @input=${s=>this._manufacturer=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("model_optional",t)}"
            .value=${this._model}
            @input=${s=>this._model=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("serial_number_optional",t)}"
            .value=${this._serialNumber}
            @input=${s=>this._serialNumber=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("documentation_url_optional",t)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${s=>this._documentationUrl=s.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${i("area_id_optional",t)}"
            .value=${this._areaId}
            @value-changed=${s=>this._areaId=s.detail.value||""}
          ></ha-area-picker>
          <ms-textfield
            label="${i("installation_date_optional",t)}"
            type="date"
            .value=${this._installationDate}
            @input=${s=>this._installationDate=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("warranty_expiry_optional",t)}"
            type="date"
            .value=${this._warrantyExpiry}
            @input=${s=>this._warrantyExpiry=s.target.value}
          ></ms-textfield>
          <label class="textarea-field">
            <span class="textarea-label">${i("object_notes_optional",t)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${s=>this._notes=s.target.value}
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
    `}};b.styles=x`
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
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
  `,a([m({attribute:!1})],b.prototype,"hass",2),a([o()],b.prototype,"_open",2),a([o()],b.prototype,"_loading",2),a([o()],b.prototype,"_error",2),a([o()],b.prototype,"_name",2),a([o()],b.prototype,"_manufacturer",2),a([o()],b.prototype,"_model",2),a([o()],b.prototype,"_serialNumber",2),a([o()],b.prototype,"_areaId",2),a([o()],b.prototype,"_installationDate",2),a([o()],b.prototype,"_warrantyExpiry",2),a([o()],b.prototype,"_documentationUrl",2),a([o()],b.prototype,"_notes",2),a([o()],b.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",b);var O=class{constructor(l){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=l}updateHass(l){this.hass=l}async getUsers(l=!1){let t=Date.now();if(!l&&this.usersCache&&t-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=e.users,this.cacheTimestamp=t,this.usersCache}catch(e){return console.error("Failed to fetch users:",e),this.usersCache||[]}}async assignUser(l,t,e){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:l,task_id:t,user_id:e})}async getTasksByUser(l){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:l})).tasks}getUserName(l){return!l||!this.usersCache?null:this.usersCache.find(e=>e.id===l)?.name||null}getUser(l){return!l||!this.usersCache?null:this.usersCache.find(t=>t.id===l)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(l){return l?l===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};var vt=["cleaning","inspection","replacement","calibration","service","custom"],ft=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],bt=["weekdays","nth_weekday","day_of_month"],yt=["threshold","counter","state_change","runtime"];function xt(n){return Array.from({length:7},(l,t)=>J(t,n,"short"))}var u=class extends ${constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._notes="";this._documentationUrl="";this._customIcon="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._availableTags=[];this._responsibleUserId=null;this._availableUsers=[];this._checklistText="";this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._userService=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}async openCreate(t,e){this._entryId=t,this._taskId=null,this._error="",!t&&e&&e.length>0?(this._objectChoices=e.map(s=>({entry_id:s.entry_id,name:s.object.name})).sort((s,c)=>s.name.localeCompare(c.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}async openEdit(t,e){this._entryId=t,this._taskId=e.id,this._error="",this._name=e.name,this._type=e.type,this._scheduleType=e.schedule_type,this._intervalDays=e.interval_days!=null?String(e.interval_days):"",this._intervalUnit=e.interval_unit||"days",this._dueDate=e.due_date||"";let s=e.schedule;this._weekdays=s?.kind==="weekdays"?[...s.weekdays??[]]:[],this._nth=s?.kind==="nth_weekday"?String(s.nth??1):"1",this._nthWeekday=s?.kind==="nth_weekday"?String(s.weekday??5):"5",this._domDay=s?.kind==="day_of_month"?String(s.day??1):"1",this._warningDays=e.warning_days.toString(),this._intervalAnchor=e.interval_anchor||"completion",this._notes=e.notes||"",this._documentationUrl=e.documentation_url||"",this._customIcon=e.custom_icon||"",this._enabled=e.enabled!==!1,this._lastPerformed=e.last_performed||"",this._nfcTagId=e.nfc_tag_id||"",this._responsibleUserId=e.responsible_user_id||null,this._checklistText=(e.checklist||[]).join(`
`),this._scheduleTime=e.schedule_time||"";let c=e.on_complete_action;if(c&&c.service){this._actionService=c.service;let p=c.target?.entity_id;this._actionTargetEntity=Array.isArray(p)?p[0]||"":p||"",this._actionData=c.data&&typeof c.data=="object"?{...c.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let _=e.quick_complete_defaults;this._qcNotes=_?.notes||"",this._qcCost=_?.cost!=null?String(_.cost):"",this._qcDuration=_?.duration!=null?String(_.duration):"",this._qcFeedback=_?.feedback||"";let h=e.adaptive_config||{};if(this._environmentalEntity=h.environmental_entity||"",this._environmentalAttribute=h.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,e.trigger_config){let p=e.trigger_config;this._triggerEntityId=p.entity_id||"",this._triggerEntityIds=p.entity_ids||(p.entity_id?[p.entity_id]:[]),this._triggerEntityLogic=p.entity_logic||"any",this._triggerAttribute=p.attribute||"",this._triggerType=p.type||"threshold",this._triggerAbove=p.trigger_above?.toString()||"",this._triggerBelow=p.trigger_below?.toString()||"",this._triggerForMinutes=p.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=p.trigger_target_value?.toString()||"",this._triggerDeltaMode=p.trigger_delta_mode||!1,this._triggerFromState=p.trigger_from_state||"",this._triggerToState=p.trigger_to_state||"",this._triggerTargetChanges=p.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=p.trigger_runtime_hours?.toString()||""}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._notes="",this._documentationUrl="",this._customIcon="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._responsibleUserId=null,this._checklistText="",this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours=""}async _loadUsers(){this._userService||(this._userService=new O(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(t){console.error("Failed to load users:",t),this._availableUsers=[]}}async _testAction(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[e,s]=t.split(".");if(!this.hass?.services?.[e]?.[s]){this._actionTestResult="error",this._actionTestError=`Service "${t}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let c=this._actionTargetEntity.trim();if(c){let _=c.split(".")[0];if(_!==e&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(e)){this._actionTestResult="error",this._actionTestError=`Service "${t}" only works on ${e}.* entities; entity "${c}" is in ${_}.* \u2014 pick a service that matches the entity domain (e.g. ${_}.${s})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[c]){this._actionTestResult="error",this._actionTestError=`Target entity "${c}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let t=JSON.parse(this._actionDataJsonFallback);if(t&&typeof t=="object"&&!Array.isArray(t))return t}catch{}return{...this._actionData}}_serviceSchema(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t))return null;let[e,s]=t.split("."),c=this.hass?.services?.[e]?.[s]?.fields;return!c||Object.keys(c).length===0?null:Object.entries(c).map(([_,h])=>({name:_,required:!!h.required,selector:h.selector||{text:{}}}))}_renderCompletionActionsSection(t){if(!this.completionActionsEnabled)return d;let e=this._serviceSchema();return r`
      <details class="ca-section">
        <summary>${i("on_complete_action_title",t)}</summary>
        <p class="field-help">${i("on_complete_action_desc",t)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${s=>{this._actionService=s.detail.value||"";let c=this._serviceSchema();if(c){let _=new Set(c.map(h=>h.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([h])=>_.has(h)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>i("on_complete_action_target",t)}
          @value-changed=${s=>{let c=s.detail.value;this._actionTargetEntity=c.target_entity||""}}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${i("on_complete_action_target_hint",t)}
        </p>
        ${e?r`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${e}
                .data=${this._actionData}
                @value-changed=${s=>{this._actionData={...s.detail.value}}}
              ></ha-form>
            `:r`
              <ms-textfield
                label="${i("on_complete_action_data",t)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${s=>{this._actionDataJsonFallback=s.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":i("on_complete_action_test",t)}
          </button>
          ${this._actionTestResult==="ok"?r`<span class="ca-test-ok">${i("on_complete_action_test_success",t)}</span>`:d}
          ${this._actionTestResult==="error"?r`<div class="ca-test-error-block">
                <span class="ca-test-error">${i("on_complete_action_test_failed",t)}</span>
                ${this._actionTestError?r`<div class="ca-test-error-detail">${this._actionTestError}</div>`:d}
              </div>`:d}
        </div>
      </details>

      <details class="ca-section">
        <summary>${i("quick_complete_defaults_title",t)}</summary>
        <p class="field-help">${i("quick_complete_defaults_desc",t)}</p>
        <ms-textfield
          label="${i("quick_complete_defaults_notes",t)}"
          .value=${this._qcNotes}
          @input=${s=>{this._qcNotes=s.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${i("quick_complete_defaults_cost",t)}"
          type="number" min="0" step="0.01"
          .value=${this._qcCost}
          @input=${s=>{this._qcCost=s.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${i("quick_complete_defaults_duration",t)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${s=>{this._qcDuration=s.target.value}}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${s=>{this._qcFeedback=s.target.value}}>
          <option value="">${i("quick_complete_defaults_feedback_none",t)}</option>
          <option value="needed">${i("quick_complete_defaults_feedback_needed",t)}</option>
          <option value="not_needed">${i("quick_complete_defaults_feedback_not_needed",t)}</option>
        </select>
      </details>
    `}async _loadTags(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=t.tags||[]}catch{this._availableTags=[]}}async _fetchEntityAttributes(t){if(!t||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t});this._entityDomain=e.domain||"",this._suggestedAttributes=e.suggested_attributes||[],this._availableAttributes=e.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{let t={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:parseInt(this._warningDays,10)||7};if(this._taskId&&(t.task_id=this._taskId),this._scheduleType==="one_time"?(t.due_date=this._dueDate||null,t.interval_days=null):bt.includes(this._scheduleType)?(t.schedule=this._buildSchedule(),t.interval_days=null,this._taskId&&(t.due_date=null)):(this._taskId&&(t.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(t.interval_days=parseInt(this._intervalDays,10),t.interval_unit=this._intervalUnit,t.interval_anchor=this._intervalAnchor):this._taskId&&(t.interval_days=null,t.interval_anchor="completion")),t.notes=this._notes||null,t.documentation_url=this._documentationUrl||null,t.custom_icon=this._customIcon||null,t.enabled=this._enabled,t.last_performed=this._lastPerformed||null,t.nfc_tag_id=this._nfcTagId||null,t.responsible_user_id=this._responsibleUserId,this._scheduleType==="sensor_based"&&this._triggerEntityId){let _=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],h={entity_id:_[0],entity_ids:_,type:this._triggerType};if(this._triggerAttribute&&(h.attribute=this._triggerAttribute),_.length>1&&(h.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let p=parseFloat(this._triggerAbove);isNaN(p)||(h.trigger_above=p)}if(this._triggerBelow){let p=parseFloat(this._triggerBelow);isNaN(p)||(h.trigger_below=p)}if(this._triggerForMinutes){let p=parseInt(this._triggerForMinutes,10);isNaN(p)||(h.trigger_for_minutes=p)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let p=parseFloat(this._triggerTargetValue);isNaN(p)||(h.trigger_target_value=p)}h.trigger_delta_mode=this._triggerDeltaMode}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(h.trigger_from_state=this._triggerFromState),this._triggerToState&&(h.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let p=parseInt(this._triggerTargetChanges,10);isNaN(p)||(h.trigger_target_changes=p)}}else if(this._triggerType==="runtime"&&this._triggerRuntimeHours){let p=parseFloat(this._triggerRuntimeHours);isNaN(p)||(h.trigger_runtime_hours=p)}t.trigger_config=h}else this._taskId&&(t.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let _=this._scheduleTime.trim();t.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(_)?_:null}if(this.checklistsEnabled){let _=this._checklistText.split(`
`).map(h=>h.trim()).filter(Boolean).slice(0,100);t.checklist=_.length?_:null}if(this.completionActionsEnabled){let _=this._actionService.trim();if(_&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(_)){let y={service:_},E=this._actionTargetEntity.trim();E&&(y.target={entity_id:E});let z=this._buildActionData();Object.keys(z).length>0&&(y.data=z),t.on_complete_action=y}else t.on_complete_action=null;let h={};this._qcNotes.trim()&&(h.notes=this._qcNotes.trim());let p=parseFloat(this._qcCost);!isNaN(p)&&p>=0&&(h.cost=p);let g=parseInt(this._qcDuration,10);!isNaN(g)&&g>=0&&(h.duration=g),this._qcFeedback&&(h.feedback=this._qcFeedback),t.quick_complete_defaults=Object.keys(h).length?h:null}let e=await this.hass.connection.sendMessagePromise(t),s=this._taskId||e?.task_id,c=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(s&&this._scheduleType==="sensor_based"&&c)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:s,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(t){this._error=k(t,this._lang,i("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return d;let t=this._lang;return r`
      <h3>${i("trigger_configuration",t)}</h3>
      <ms-textfield
        label="${i("entity_id",t)} (${i("comma_separated",t)})"
        .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
        @input=${e=>{let c=e.target.value.split(",").map(_=>_.trim()).filter(Boolean);this._triggerEntityId=c[0]||"",this._triggerEntityIds=c,c[0]&&this._fetchEntityAttributes(c[0])}}
      ></ms-textfield>
      ${this._triggerEntityIds.length>1?r`
        <div class="select-row">
          <label>${i("entity_logic",t)}</label>
          <select
            .value=${this._triggerEntityLogic}
            @change=${e=>this._triggerEntityLogic=e.target.value}
          >
            <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${i("entity_logic_any",t)}</option>
            <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${i("entity_logic_all",t)}</option>
          </select>
        </div>
      `:d}
      ${this._availableAttributes.length>0?r`
          <div class="select-row">
            <label>${i("attribute_optional",t)}</label>
            <select
              .value=${this._triggerAttribute}
              @change=${e=>this._triggerAttribute=e.target.value}
            >
              <option value="" ?selected=${!this._triggerAttribute}>${i("use_entity_state",t)}</option>
              ${this._suggestedAttributes.map(e=>r`<option value=${e} ?selected=${e===this._triggerAttribute}>${e} ★</option>`)}
              ${this._availableAttributes.filter(e=>!this._suggestedAttributes.includes(e.name)).map(e=>r`<option value=${e.name} ?selected=${e.name===this._triggerAttribute}>${e.name}${e.numeric?"":" (non-numeric)"}</option>`)}
            </select>
          </div>
        `:r`
          <ms-textfield
            label="${i("attribute_optional",t)}"
            .value=${this._triggerAttribute}
            @input=${e=>this._triggerAttribute=e.target.value}
          ></ms-textfield>
        `}
      <div class="select-row">
        <label>${i("trigger_type",t)}</label>
        <select
          .value=${this._triggerType}
          @change=${e=>this._triggerType=e.target.value}
        >
          ${yt.map(e=>r`<option value=${e} ?selected=${e===this._triggerType}>${i(e,t)}</option>`)}
        </select>
      </div>
      ${this._renderTriggerTypeFields()}
      <ms-textfield
        label="${i("safety_interval",t)}"
        type="number"
        .value=${this._intervalDays}
        @input=${e=>this._intervalDays=e.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():d}
    `}_renderUnitSelect(){let t=this._lang;return r`
      <div class="select-row">
        <label>${i("interval_unit",t)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${e=>this._intervalUnit=e.target.value}
        >
          ${["days","weeks","months","years"].map(e=>r`<option value=${e} ?selected=${e===this._intervalUnit}>${i("unit_"+e,t)}</option>`)}
        </select>
      </div>`}_toggleWeekday(t){this._weekdays=this._weekdays.includes(t)?this._weekdays.filter(e=>e!==t):[...this._weekdays,t]}_buildSchedule(){return this._scheduleType==="weekdays"?{kind:"weekdays",weekdays:[...this._weekdays].sort((t,e)=>t-e)}:this._scheduleType==="nth_weekday"?{kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)}:{kind:"day_of_month",day:parseInt(this._domDay,10)||1}}_renderCalendarFields(){let t=this._lang,e=xt(t);if(this._scheduleType==="weekdays")return r`
        <label class="field-label">${i("recurrence_on_days",t)}</label>
        <div class="weekday-chips">
          ${e.map((s,c)=>r`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(c)?"selected":""}"
              @click=${()=>this._toggleWeekday(c)}
            >${s}</button>`)}
        </div>`;if(this._scheduleType==="nth_weekday"){let s=[["1",i("ord_1",t)],["2",i("ord_2",t)],["3",i("ord_3",t)],["4",i("ord_4",t)],["5",i("ord_5",t)],["-1",i("ord_last",t)]];return r`
        <div class="select-row">
          <label>${i("recurrence_occurrence",t)}</label>
          <select .value=${this._nth} @change=${c=>this._nth=c.target.value}>
            ${s.map(([c,_])=>r`<option value=${c} ?selected=${c===this._nth}>${_}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${i("recurrence_weekday",t)}</label>
          <select .value=${this._nthWeekday} @change=${c=>this._nthWeekday=c.target.value}>
            ${e.map((c,_)=>r`<option value=${String(_)} ?selected=${String(_)===this._nthWeekday}>${c}</option>`)}
          </select>
        </div>`}return this._scheduleType==="day_of_month"?r`
        <ms-textfield
          label="${i("recurrence_day",t)}"
          type="number"
          min="1"
          max="31"
          .value=${this._domDay}
          @input=${s=>this._domDay=s.target.value}
        ></ms-textfield>`:d}_renderTriggerTypeFields(){let t=this._lang;return this._triggerType==="threshold"?r`
        <ms-textfield
          label="${i("trigger_above",t)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${e=>this._triggerAbove=e.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${i("trigger_below",t)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${e=>this._triggerBelow=e.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${i("for_at_least_minutes",t)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${e=>this._triggerForMinutes=e.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?r`
        <ms-textfield
          label="${i("target_value",t)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${e=>this._triggerTargetValue=e.target.value}
        ></ms-textfield>
        <label>
          <input
            type="checkbox"
            .checked=${this._triggerDeltaMode}
            @change=${e=>this._triggerDeltaMode=e.target.checked}
          />
          ${i("delta_mode",t)}
        </label>
      `:this._triggerType==="state_change"?r`
        <ms-textfield
          label="${i("from_state_optional",t)}"
          .value=${this._triggerFromState}
          @input=${e=>this._triggerFromState=e.target.value}
        ></ms-textfield>
        <div class="field-help">${i("state_value_help",t)}</div>
        <ms-textfield
          label="${i("to_state_optional",t)}"
          .value=${this._triggerToState}
          @input=${e=>this._triggerToState=e.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${i("target_changes",t)}"
          type="number"
          min="1"
          .value=${this._triggerTargetChanges}
          @input=${e=>this._triggerTargetChanges=e.target.value}
        ></ms-textfield>
        <div class="field-help">${i("target_changes_help",t)}</div>
      `:this._triggerType==="runtime"?r`
        <ms-textfield
          label="${i("runtime_hours",t)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${e=>this._triggerRuntimeHours=e.target.value}
        ></ms-textfield>
      `:d}render(){if(!this._open)return r``;let t=this._lang,e=this._taskId?i("edit_task",t):i("new_task",t);return r`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._error?r`<div class="error">${this._error}</div>`:d}
          ${this._objectChoices.length>0?r`
            <div class="select-row">
              <label>${i("object",t)}</label>
              <select
                .value=${this._entryId}
                @change=${s=>this._entryId=s.target.value}
              >
                ${this._objectChoices.map(s=>r`<option value=${s.entry_id} ?selected=${s.entry_id===this._entryId}>${s.name}</option>`)}
              </select>
            </div>
          `:d}
          <ms-textfield
            label="${i("task_name",t)}"
            required
            .value=${this._name}
            @input=${s=>this._name=s.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${i("maintenance_type",t)}</label>
            <select
              .value=${this._type}
              @change=${s=>this._type=s.target.value}
            >
              ${vt.map(s=>r`<option value=${s} ?selected=${s===this._type}>${i(s,t)}</option>`)}
            </select>
          </div>
          <div class="select-row">
            <label>${i("schedule_type",t)}</label>
            <select
              .value=${this._scheduleType}
              @change=${s=>this._scheduleType=s.target.value}
            >
              ${ft.map(s=>r`<option value=${s} ?selected=${s===this._scheduleType}>${i(s,t)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?r`
                <ms-textfield
                  label="${i("interval_value",t)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${s=>this._intervalDays=s.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${i("interval_anchor",t)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${s=>this._intervalAnchor=s.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${i("anchor_completion",t)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${i("anchor_planned",t)}</option>
                  </select>
                </div>
                ${this.scheduleTimeEnabled?r`
                  <ms-textfield
                    label="${i("schedule_time_optional",t)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${i("schedule_time_help",t)}"
                    @input=${s=>this._scheduleTime=s.target.value}
                  ></ms-textfield>
                `:d}
              `:d}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?r`
                <ms-textfield
                  label="${i("due_date",t)}"
                  type="date"
                  .value=${this._dueDate}
                  @input=${s=>this._dueDate=s.target.value}
                ></ms-textfield>
              `:d}
          <ms-textfield
            label="${i("warning_days",t)}"
            type="number"
            .value=${this._warningDays}
            @input=${s=>this._warningDays=s.target.value}
          ></ms-textfield>
          ${this.checklistsEnabled?r`
            <h3>${i("checklist_steps_optional",t)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${i("checklist_placeholder",t)}"
              .value=${this._checklistText}
              @input=${s=>this._checklistText=s.target.value}
            ></textarea>
            <div class="field-help">${i("checklist_help",t)}</div>
          `:d}
          <ms-textfield
            label="${i("last_performed_optional",t)}"
            type="date"
            .value=${this._lastPerformed}
            @input=${s=>this._lastPerformed=s.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${i("responsible_user",t)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${s=>{let c=s.target.value;this._responsibleUserId=c||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${i("no_user_assigned",t)}</option>
              ${this._availableUsers.map(s=>r`<option value=${s.id} ?selected=${s.id===this._responsibleUserId}>${s.name}</option>`)}
            </select>
          </div>
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?r`
            <ms-textfield
              label="${i("environmental_entity_optional",t)}"
              helper="${i("environmental_entity_helper",t)}"
              .value=${this._environmentalEntity}
              @input=${s=>this._environmentalEntity=s.target.value.trim()}
            ></ms-textfield>
            ${this._environmentalEntity?r`
              <ms-textfield
                label="${i("environmental_attribute_optional",t)}"
                .value=${this._environmentalAttribute}
                @input=${s=>this._environmentalAttribute=s.target.value.trim()}
              ></ms-textfield>
            `:d}
          `:d}
          <ms-textfield
            label="${i("notes_optional",t)}"
            .value=${this._notes}
            @input=${s=>this._notes=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("documentation_url_optional",t)}"
            .value=${this._documentationUrl}
            @input=${s=>this._documentationUrl=s.target.value}
          ></ms-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${i("custom_icon_optional",t)}"
            .value=${this._customIcon}
            @value-changed=${s=>this._customIcon=s.detail.value||""}
          ></ha-icon-picker>
          ${this._availableTags.length>0?r`
              <div class="select-row">
                <label>${i("nfc_tag_id_optional",t)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${s=>this._nfcTagId=s.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${i("no_nfc_tag",t)}</option>
                  ${this._availableTags.map(s=>r`<option value=${s.id} ?selected=${s.id===this._nfcTagId}>${s.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${i("nfc_tags_refresh",t)}">↻</button>
              </div>
            `:r`
              <ms-textfield
                label="${i("nfc_tag_id_optional",t)}"
                .value=${this._nfcTagId}
                @input=${s=>this._nfcTagId=s.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${i("nfc_tags_empty_help",t)}
                <a href="/config/tags">${i("nfc_tags_open_settings",t)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${i("nfc_tags_refresh",t)}
                </button>
              </div>
            `}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${s=>this._enabled=s.target.checked}
            />
            ${i("task_enabled",t)}
          </label>
          ${this._renderCompletionActionsSection(t)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${i("cancel",t)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?i("saving",t):i("save",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};u.styles=x`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* v1.3.0: completion-action sections */
    .ca-section {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 8px;
    }
    .ca-section > summary {
      cursor: pointer;
      font-weight: 500;
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
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    ms-textfield {
      display: block;
    }
    .field-label {
      font-size: 12px;
      color: var(--secondary-text-color);
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
    .field-help {
      font-size: 12px;
      color: var(--secondary-text-color);
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
    h3 {
      margin: 8px 0 0;
      font-size: 14px;
      color: var(--primary-color);
    }
    .select-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .select-row label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .select-row select {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .field-label {
      font-size: 12px;
      color: var(--secondary-text-color);
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
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
    }
  `,a([m({attribute:!1})],u.prototype,"hass",2),a([m({type:Boolean,attribute:"checklists-enabled"})],u.prototype,"checklistsEnabled",2),a([m({type:Boolean,attribute:"schedule-time-enabled"})],u.prototype,"scheduleTimeEnabled",2),a([m({type:Boolean,attribute:"completion-actions-enabled"})],u.prototype,"completionActionsEnabled",2),a([m({type:Number,attribute:"default-warning-days"})],u.prototype,"defaultWarningDays",2),a([o()],u.prototype,"_open",2),a([o()],u.prototype,"_loading",2),a([o()],u.prototype,"_error",2),a([o()],u.prototype,"_entryId",2),a([o()],u.prototype,"_taskId",2),a([o()],u.prototype,"_objectChoices",2),a([o()],u.prototype,"_name",2),a([o()],u.prototype,"_type",2),a([o()],u.prototype,"_scheduleType",2),a([o()],u.prototype,"_intervalDays",2),a([o()],u.prototype,"_intervalUnit",2),a([o()],u.prototype,"_dueDate",2),a([o()],u.prototype,"_warningDays",2),a([o()],u.prototype,"_intervalAnchor",2),a([o()],u.prototype,"_weekdays",2),a([o()],u.prototype,"_nth",2),a([o()],u.prototype,"_nthWeekday",2),a([o()],u.prototype,"_domDay",2),a([o()],u.prototype,"_notes",2),a([o()],u.prototype,"_documentationUrl",2),a([o()],u.prototype,"_customIcon",2),a([o()],u.prototype,"_enabled",2),a([o()],u.prototype,"_triggerEntityId",2),a([o()],u.prototype,"_triggerEntityIds",2),a([o()],u.prototype,"_triggerEntityLogic",2),a([o()],u.prototype,"_triggerAttribute",2),a([o()],u.prototype,"_triggerType",2),a([o()],u.prototype,"_triggerAbove",2),a([o()],u.prototype,"_triggerBelow",2),a([o()],u.prototype,"_triggerForMinutes",2),a([o()],u.prototype,"_triggerTargetValue",2),a([o()],u.prototype,"_triggerDeltaMode",2),a([o()],u.prototype,"_triggerFromState",2),a([o()],u.prototype,"_triggerToState",2),a([o()],u.prototype,"_triggerTargetChanges",2),a([o()],u.prototype,"_triggerRuntimeHours",2),a([o()],u.prototype,"_suggestedAttributes",2),a([o()],u.prototype,"_availableAttributes",2),a([o()],u.prototype,"_entityDomain",2),a([o()],u.prototype,"_lastPerformed",2),a([o()],u.prototype,"_nfcTagId",2),a([o()],u.prototype,"_availableTags",2),a([o()],u.prototype,"_responsibleUserId",2),a([o()],u.prototype,"_availableUsers",2),a([o()],u.prototype,"_checklistText",2),a([o()],u.prototype,"_scheduleTime",2),a([o()],u.prototype,"_actionService",2),a([o()],u.prototype,"_actionTargetEntity",2),a([o()],u.prototype,"_actionData",2),a([o()],u.prototype,"_actionDataJsonFallback",2),a([o()],u.prototype,"_actionTesting",2),a([o()],u.prototype,"_actionTestResult",2),a([o()],u.prototype,"_actionTestError",2),a([o()],u.prototype,"_qcNotes",2),a([o()],u.prototype,"_qcCost",2),a([o()],u.prototype,"_qcDuration",2),a([o()],u.prototype,"_qcFeedback",2),a([o()],u.prototype,"_environmentalEntity",2),a([o()],u.prototype,"_environmentalAttribute",2);customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",u);var f=class extends ${constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed"}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState={},this._feedback="needed")}_toggleCheck(t){let e=String(t);this._checklistState={...this._checklistState,[e]:!this._checklistState[e]}}_setFeedback(t){this._feedback=t}async _complete(){this._loading=!0,this._error="";try{let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(t.notes=this._notes),this._cost){let e=parseFloat(this._cost);!isNaN(e)&&e>=0&&(t.cost=e)}if(this._duration){let e=parseInt(this._duration,10);!isNaN(e)&&e>=0&&(t.duration=e)}this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),await this.hass.connection.sendMessagePromise(t),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(t){this._error=k(t,this.lang,i("save_error",this.lang))}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return r``;let t=this.lang||this.hass?.language||"en";return r`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i("complete_title",t)}${this.taskName}</div>
        <div class="content">
          ${this._error?r`<div class="error">${this._error}</div>`:d}
          ${this.checklist.length>0?r`
            <div class="checklist-section">
              <label class="checklist-label">${i("checklist",t)}</label>
              ${this.checklist.map((e,s)=>r`
                <label class="checklist-item" @click=${()=>this._toggleCheck(s)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(s)]} />
                  <span>${e}</span>
                </label>
              `)}
            </div>
          `:d}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${i("notes_optional",t)}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${e=>this._notes=e.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${i("cost_optional",t)}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${e=>this._cost=e.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${i("duration_minutes",t)}</span>
            <input type="number" step="1" min="0" class="field-input"
              .value=${this._duration}
              @input=${e=>this._duration=e.target.value} />
          </label>
          ${this.adaptiveEnabled?r`
            <div class="feedback-section">
              <label class="feedback-label">${i("was_maintenance_needed",t)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${i("feedback_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${i("feedback_not_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${i("feedback_not_sure",t)}</button>
              </div>
            </div>
          `:d}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${i("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading}
          >
            ${this._loading?i("completing",t):i("complete",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};f.styles=x`
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
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .field { display: flex; flex-direction: column; gap: 4px; }
    .field-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .field-input {
      padding: 8px 10px; font-size: 14px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      font-family: inherit;
      width: 100%; box-sizing: border-box;
    }
    .field-input:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    .checklist-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: 4px;
    }
    .checklist-label {
      font-weight: 500;
      font-size: 13px;
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
      font-size: 13px;
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
  `,a([m({attribute:!1})],f.prototype,"hass",2),a([m()],f.prototype,"entryId",2),a([m()],f.prototype,"taskId",2),a([m()],f.prototype,"taskName",2),a([m()],f.prototype,"lang",2),a([m({type:Array})],f.prototype,"checklist",2),a([m({type:Boolean})],f.prototype,"adaptiveEnabled",2),a([o()],f.prototype,"_open",2),a([o()],f.prototype,"_notes",2),a([o()],f.prototype,"_cost",2),a([o()],f.prototype,"_duration",2),a([o()],f.prototype,"_loading",2),a([o()],f.prototype,"_error",2),a([o()],f.prototype,"_checklistState",2),a([o()],f.prototype,"_feedback",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",f);var R=class extends ${constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null}get _lang(){return this.hass?.language||"en"}openEdit(t){this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(t,e){this._draft&&(this._draft={...this._draft,[t]:e})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),Object.keys(t).filter(s=>!["type","entry_id","task_id","original_timestamp"].includes(s)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=k(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return d;let t=this._lang,e=this._draft;return r`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${i("history_edit_title",t)||"Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${i(e.type,t)||e.type}</span>
        </div>
        <label>
          <span>${i("history_edit_timestamp",t)||"Timestamp"}</span>
          <input type="datetime-local"
            .value=${e.timestamp.length>=16?e.timestamp.slice(0,16):e.timestamp}
            @change=${s=>{let c=s.target.value;this._set("timestamp",c.length===16?`${c}:00`:c)}} />
        </label>
        <label>
          <span>${i("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${s=>{let c=s.target.value;this._set("notes",c||null)}}
            .value=${e.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${i("cost",t)||"Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${e.cost!=null?String(e.cost):""}
              @input=${s=>{let c=s.target.value;this._set("cost",c?Number(c):null)}} />
          </label>
          <label>
            <span>${i("duration",t)||"Duration (min)"}</span>
            <input type="number" min="0"
              .value=${e.duration!=null?String(e.duration):""}
              @input=${s=>{let c=s.target.value;this._set("duration",c?Number(c):null)}} />
          </label>
        </div>
        ${this._error?r`<div class="error">${this._error}</div>`:d}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${i("cancel",t)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?i("saving",t)||"Saving\u2026":i("save",t)||"Save"}
          </button>
        </div>
      </div>
    `}};R.styles=x`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 100;
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 480px;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px;
      display: flex; flex-direction: column; gap: 12px;
      z-index: 101;
      max-height: 90vh; overflow: auto;
    }
    h2 { margin: 0; font-size: 18px; }
    .entry-type {
      display: flex; align-items: center; gap: 6px;
      color: var(--secondary-text-color); font-size: 13px;
    }
    label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
    label span { color: var(--secondary-text-color); }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    input, textarea {
      padding: 8px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px;
      width: 100%; box-sizing: border-box;
      font-family: inherit;
    }
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
  `,a([m({attribute:!1})],R.prototype,"hass",2),a([o()],R.prototype,"_open",2),a([o()],R.prototype,"_saving",2),a([o()],R.prototype,"_error",2),a([o()],R.prototype,"_draft",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",R);function N(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function et(n){return!n.startsWith("data:image/svg+xml,")&&!n.startsWith("data:image/png;base64,")?"":N(n)}function $t(n){return n.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var A=class extends ${constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(t,e){this._entryId=t,this._taskId=null,this._objectName=e,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(t,e,s,c){this._entryId=t,this._taskId=e,this._objectName=s,this._taskName=c,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let t=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let e={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(e.task_id=this._taskId);let s=[this.hass.connection.sendMessagePromise({...e,action:"view"})];this._taskId&&s.push(this.hass.connection.sendMessagePromise({...e,action:"complete"}));let c=await Promise.all(s);if(t!==this._generateSeq)return;this._viewResult=c[0],c.length>1&&(this._completeResult=c[1])}catch(e){if(t!==this._generateSeq)return;let s=e?.code,c=e?.message;this._error=s==="no_url"||typeof c=="string"&&c.includes("No Home Assistant URL")?i("qr_error_no_url",this.lang):i("qr_error",this.lang)}finally{t===this._generateSeq&&(this._loading=!1)}}_setUrlMode(t){this._urlMode!==t&&(this._urlMode=t,this._generate())}_print(){if(!this._viewResult)return;let t=this._viewResult,e=t.label.task_name?`${t.label.object_name} \u2014 ${t.label.task_name}`:t.label.object_name,s=[t.label.manufacturer,t.label.model].filter(Boolean).join(" "),c=window.open("","_blank","width=600,height=500");if(!c)return;let _=this.lang||"en",h=N(e),p=N(s),g=!!this._completeResult,y=N(i("qr_action_view",_)),E=N(i("qr_action_complete",_));c.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${h}</title>
<style>
  body{font-family:sans-serif;text-align:center;padding:20px}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  .qr-row{display:flex;justify-content:center;gap:24px;margin:12px 0}
  .qr-col{display:flex;flex-direction:column;align-items:center;gap:6px}
  .qr-col img{width:${g?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${h}</h2>
${p?`<div class="sub">${p}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${et(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${y}</div>
  </div>
  ${g?`<div class="qr-col">
    <img src="${et(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${E}</div>
  </div>`:""}
</div>
<div class="url">${N(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),c.document.close()}_downloadSvg(t,e){let s=decodeURIComponent(t.svg_data_uri.replace("data:image/svg+xml,","")),c=new Blob([s],{type:"image/svg+xml"}),_=URL.createObjectURL(c),h=document.createElement("a");h.href=_;let p=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;h.download=`qr-${$t(p)}-${e}.svg`,h.click(),URL.revokeObjectURL(_)}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return r``;let t=this.lang||this.hass?.language||"en",e=this._taskName?`${i("qr_code",t)}: ${this._objectName} \u2014 ${this._taskName}`:`${i("qr_code",t)}: ${this._objectName}`,s=!!this._viewResult;return r`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._loading?r`<div class="loading">${i("qr_generating",t)}</div>`:this._error?r`<div class="error">${this._error}</div>`:s?r`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${i("qr_action_view",t)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${i("qr_download",t)}
                        </button>
                      </div>
                      ${this._completeResult?r`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${i("qr_action_complete",t)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${i("qr_download",t)}
                              </button>
                            </div>
                          `:d}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:d}
          <div class="action-row">
            <label>${i("qr_url_mode",t)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${i("qr_mode_companion",t)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${i("qr_mode_local",t)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${i("qr_mode_server",t)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${i("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!s}
          >
            ${i("qr_print",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};A.styles=x`
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
    .qr-item-label {
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
  `,a([m({attribute:!1})],A.prototype,"hass",2),a([m()],A.prototype,"lang",2),a([o()],A.prototype,"_open",2),a([o()],A.prototype,"_loading",2),a([o()],A.prototype,"_error",2),a([o()],A.prototype,"_viewResult",2),a([o()],A.prototype,"_completeResult",2),a([o()],A.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",A);function it(n,l){let t=n.interval_analysis,e=t?.weibull_beta,s=t?.weibull_eta;if(e==null||s==null||s<=0)return d;let c=n.interval_days??0,_=n.suggested_interval??c;return r`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${i("weibull_reliability_curve",l)}
        ${kt(e,l)}
      </div>
      ${wt(e,s,c,_,l)}
      ${Et(t,l)}
      ${t?.confidence_interval_low!=null?It(t,n,l):d}
    </div>
  `}function kt(n,l){let t,e,s;return n<.8?(t="early_failures",e="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",s="beta_early_failures"):n<=1.2?(t="random_failures",e="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",s="beta_random_failures"):n<=3.5?(t="wear_out",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",s="beta_wear_out"):(t="highly_predictable",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",s="beta_highly_predictable"),r`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${e}"></ha-svg-icon>
      ${i(s,l)} (\u03B2=${n.toFixed(2)})
    </span>
  `}function wt(n,l,t,e,s){let I=Math.max(t,e,l,1)*1.3,S=50,C=[];for(let T=0;T<=S;T++){let L=T/S*I,ut=1-Math.exp(-Math.pow(L/l,n)),mt=32+L/I*260,gt=136-ut*128;C.push([mt,gt])}let U=C.map(([T,L])=>`${T.toFixed(1)},${L.toFixed(1)}`).join(" "),K="M32,136 "+C.map(([T,L])=>`L${T.toFixed(1)},${L.toFixed(1)}`).join(" ")+` L${C[S][0].toFixed(1)},136 Z`,F=32+t/I*260,D=1-Math.exp(-Math.pow(t/l,n)),W=136-D*128,ht=((1-D)*100).toFixed(0),Z=32+e/I*260,_t=[0,.25,.5,.75,1];return r`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${i("chart_weibull",s)}">
        ${_t.map(T=>{let L=136-T*128;return M`
            <line x1="${32}" y1="${L.toFixed(1)}" x2="${292}" y2="${L.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${T===.5?"4,3":d}" />
            <text x="${28}" y="${(L+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(T*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(I/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(I)}</text>

        <path d="${K}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${U}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?M`
          <line x1="${F.toFixed(1)}" y1="${8}" x2="${F.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${F.toFixed(1)}" cy="${W.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(F+4).toFixed(1)}" y="${(W-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${ht}%</text>
        `:d}

        ${e>0&&e!==t?M`
          <line x1="${Z.toFixed(1)}" y1="${8}" x2="${Z.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:d}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${i("weibull_failure_probability",s)}</span>
      ${t>0?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${i("current_interval_marker",s)}</span>`:d}
      ${e>0&&e!==t?r`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${i("recommended_marker",s)}</span>`:d}
    </div>
  `}function Et(n,l){return r`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${i("characteristic_life",l)}</span>
        <span class="weibull-info-value">${Math.round(n.weibull_eta)} ${i("days",l)}</span>
      </div>
      ${n.weibull_r_squared!=null?r`
        <div class="weibull-info-item">
          <span>${i("weibull_r_squared",l)}</span>
          <span class="weibull-info-value">${n.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:d}
    </div>
  `}function It(n,l,t){let e=n.confidence_interval_low,s=n.confidence_interval_high,c=l.suggested_interval??l.interval_days??0,_=l.interval_days??0,h=Math.max(0,e-5),g=s+5-h,y=(e-h)/g*100,E=(s-e)/g*100,z=(c-h)/g*100,I=_>0?(_-h)/g*100:-1;return r`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${i("confidence_interval",t)}: ${c} ${i("days",t)} (${e}\u2013${s})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${y.toFixed(1)}%;width:${E.toFixed(1)}%"></div>
        ${I>=0?r`<div class="confidence-marker current" style="left:${I.toFixed(1)}%"></div>`:d}
        <div class="confidence-marker recommended" style="left:${z.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${i("confidence_conservative",t)} (${e}${i("days",t).charAt(0)})</span>
        <span class="confidence-text high">${i("confidence_aggressive",t)} (${s}${i("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function st(n,l,t){let e=n.degradation_trend!=null&&n.degradation_trend!=="insufficient_data",s=n.days_until_threshold!=null,c=n.environmental_factor!=null&&n.environmental_factor!==1;if(!e&&!s&&!c)return d;let _=n.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":n.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return r`
    <div class="prediction-section">
      ${n.sensor_prediction_urgency?r`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${i("sensor_prediction_urgency",l).replace("{days}",String(Math.round(n.days_until_threshold||0)))}
        </div>
      `:d}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${i("sensor_prediction",l)}
      </div>
      <div class="prediction-grid">
        ${e?r`
          <div class="prediction-item">
            <ha-svg-icon path="${_}"></ha-svg-icon>
            <span class="prediction-label">${i("degradation_trend",l)}</span>
            <span class="prediction-value ${n.degradation_trend}">${i("trend_"+n.degradation_trend,l)}</span>
            ${n.degradation_rate!=null?r`<span class="prediction-rate">${n.degradation_rate>0?"+":""}${Math.abs(n.degradation_rate)>=10?Math.round(n.degradation_rate).toLocaleString():n.degradation_rate.toFixed(1)} ${n.trigger_entity_info?.unit_of_measurement||""}/${i("day_short",l)}</span>`:d}
          </div>
        `:d}
        ${s?r`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${i("days_until_threshold",l)}</span>
            <span class="prediction-value prediction-days${n.days_until_threshold===0?" exceeded":n.sensor_prediction_urgency?" urgent":""}">${n.days_until_threshold===0?i("threshold_exceeded",l):"~"+Math.round(n.days_until_threshold)+" "+i("days",l)}</span>
            ${n.threshold_prediction_date?r`<span class="prediction-date">${j(n.threshold_prediction_date,l)}</span>`:d}
            ${n.threshold_prediction_confidence?r`<span class="confidence-dot ${n.threshold_prediction_confidence}"></span>`:d}
          </div>
        `:d}
        ${c&&t.environmental?r`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${i("environmental_adjustment",l)}</span>
            <span class="prediction-value">${n.environmental_factor.toFixed(2)}x</span>
            ${n.environmental_entity?r`<span class="prediction-entity entity-link" @click=${h=>Q(h,n.environmental_entity)}>${n.environmental_entity}</span>`:d}
          </div>
        `:d}
      </div>
    </div>
  `}function at(n,l,t,e){let s=Math.max(n||1,l);return r`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${i("current",e)}: ${n??"\u2014"} ${n!=null?i("days",e):""}
        </div>
        <div class="interval-visual current"
          style="width: ${n!=null?Math.min(n/s*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${i("recommended",e)}: ${l} ${i("days",e)}
          <span class="confidence-badge ${t}">${i(`confidence_${t}`,e)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(l/s*100,100)}%"></div>
      </div>
    </div>
  `}var rt=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function nt(n,l,t){if(!t.seasonal||!n.seasonal_factor||n.seasonal_factor===1)return d;let e=rt.map(h=>i(h,l)),s=new Date().getMonth(),c=n.seasonal_factors||n.interval_analysis?.seasonal_factors||null,_=c&&c.length===12?c:e.map((h,p)=>{let g=n.seasonal_factor||1,y=Math.sin((p-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,g+y))});return r`
    <div class="seasonal-card-compact">
      <h4>${i("seasonal_awareness",l)}</h4>
      <div class="seasonal-mini-chart">
        ${_.map((h,p)=>{let g=h*40,y=h<.9?"low":h>1.1?"high":"normal";return r`
            <div class="seasonal-bar ${y} ${p===s?"current":""}"
                 style="height: ${g}px"
                 title="${e[p]}: ${h.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${i("shorter",l)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${i("normal",l)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${i("longer",l)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function ot(n,l){return At(n,l)}function At(n,l){let t=n.seasonal_factors??n.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return d;let e=n.interval_analysis?.seasonal_reason,s=new Date().getMonth(),c=300,_=100,h=8,g=_-h-4,y=Math.max(...t,1.5),E=c/12,z=E*.65,I=h+g-1/y*g;return r`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${i("seasonal_chart_title",l)}
        ${e?r`<span class="source-tag">${e==="learned"?i("seasonal_learned",l):i("seasonal_manual",l)}</span>`:d}
      </div>
      <svg viewBox="0 0 ${c} ${_}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${i("chart_seasonal",l)}">
        <line x1="0" y1="${I.toFixed(1)}" x2="${c}" y2="${I.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((S,C)=>{let U=S/y*g,K=C*E+(E-z)/2,F=h+g-U,D=C===s,W=S<1?"var(--success-color, #4caf50)":S>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return M`
            <rect x="${K.toFixed(1)}" y="${F.toFixed(1)}"
              width="${z.toFixed(1)}" height="${U.toFixed(1)}"
              fill="${W}" opacity="${D?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${rt.map((S,C)=>r`<span class="seasonal-label ${C===s?"active-month":""}">${i(S,l)}</span>`)}
      </div>
    </div>
  `}var v=class extends ${constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1}get _lang(){return this.hass?.language||"en"}async openFor(t,e){this._entryId=t,this._taskId=e,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=new Date().toISOString().slice(0,10),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});t?.features&&(this._features={...this._features,...t.features}),this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=t.object?.name||"";let e=(t.tasks||[]).find(s=>s.id===this._taskId);this._task=e??null}catch(t){this._error=k(t,this._lang)}}async _runWs(t){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(t),this._busy=!1,!0}catch(e){return this._error=k(e,this._lang),this._busy=!1,!1}}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-G4S5XPSC.js").then(({openCompleteDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,checklist:this._task.checklist||[],adaptive_enabled:!!this._task.adaptive_config?.enabled})&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||import("./dialog-mount-G4S5XPSC.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("./dialog-mount-G4S5XPSC.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=i("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(t))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=i("suggestion_applied",this._lang)||"Applied",this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=t.recommended_interval?`${i("reanalyze_result",this._lang)||"Recomputed"}: ${t.recommended_interval}d (${t.data_points} pts)`:i("reanalyze_insufficient_data",this._lang)||"Not enough data",await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(t){this._error=k(t,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(t){!this._entryId||!this._taskId||import("./dialog-mount-G4S5XPSC.js").then(({openHistoryEditDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null})})}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return d;let e=this._lang;return r`
      <div class="recommendation-card">
        <h4>${i("suggested_interval",e)}</h4>
        ${at(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",e)}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${i("apply_suggestion",e)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${i("reanalyze",e)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let e=this._lang,s=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,c=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,_=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,h=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!s&&!c&&!_&&!h?r`<div class="adaptive-empty">
        ${i("adaptive_no_data",e)||"Not enough completion history yet for adaptive analysis."}
      </div>`:r`
      <div class="adaptive-stack">
        ${this._toast?r`<div class="toast">${this._toast}</div>`:d}
        ${s?this._renderRecommendation(t):d}
        ${c?st(t,e,this._features):d}
        ${_?it(t,e):d}
        ${h?r`
          ${nt(t,e,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?ot(t,e):d}
        `:d}
      </div>
    `}_renderDetails(t){let e=this._lang,s=t.history||[],c=s.filter(p=>p.type==="completed"),_=c.reduce((p,g)=>p+(typeof g.cost=="number"?g.cost:0),0),h=(()=>{let p=c.map(g=>typeof g.duration=="number"?g.duration:null).filter(g=>g!=null);return p.length?Math.round(p.reduce((g,y)=>g+y,0)/p.length):null})();return r`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${i("times_performed",e)||"Performed"}</span>
            <span class="stat-value">${c.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${i("total_cost",e)||"Total cost"}</span>
            <span class="stat-value">${_.toFixed(2)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${i("avg_duration",e)||"Avg duration"}</span>
            <span class="stat-value">${h!=null?`${h}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${i("history",e)||"History"}</strong>
          <span class="history-count">${s.length}</span>
        </div>
        ${s.length===0?r`<div class="history-empty">${i("history_empty",e)||"No history yet."}</div>`:r`
              <div class="history-list">
                ${[...s].reverse().slice(0,20).map(p=>{let g=["completed","reset","skipped"].includes(p.type);return r`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${p.type}">${i(p.type,e)}</span>
                        <span class="history-date">${Y(p.timestamp,e)}</span>
                        ${g?r`<button class="history-edit"
                                   title="${i("history_edit_button",e)||"Edit"}"
                                   @click=${()=>this._onEditHistoryEntry(p)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:d}
                      </div>
                      ${p.notes?r`<div class="history-notes">${p.notes}</div>`:d}
                      ${p.cost!=null||p.duration!=null?r`<div class="history-meta">
                            ${p.cost!=null?r`<span>💰 ${p.cost.toFixed(2)}</span>`:d}
                            ${p.duration!=null?r`<span>⏱️ ${p.duration}m</span>`:d}
                          </div>`:d}
                    </div>
                  `})}
                ${s.length>20?r`<div class="history-more">… +${s.length-20} ${i("older_entries",e)||"older"}</div>`:d}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return d;let t=this._lang,e=this._task,s=this.hass?.user?.is_admin??!0;return r`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${e?r`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${V[e.status]||"#ccc"}"></span>
                  <span class="task-name">${e.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("./dialog-mount-G4S5XPSC.js").then(({openObjectQuickActions:c})=>{c(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${e.next_due?r`<span><strong>${i("next_due",t)||"Next due"}:</strong> ${j(e.next_due,t)}</span>`:d}
                  ${e.last_performed?r`<span><strong>${i("last_performed",t)||"Last"}:</strong> ${j(e.last_performed,t)}</span>`:d}
                  ${e.schedule?.kind&&!["manual","one_time"].includes(e.schedule.kind)||e.interval_days!=null?r`<span><strong>${i("interval",t)||"Interval"}:</strong> ${X(e,t)}</span>`:d}
                </div>
              </div>

              ${this._error?r`<div class="error">${this._error}</div>`:d}

              ${this._showSkip?r`
                    <div class="inline-form">
                      <label>${i("skip_reason",t)||"Skip reason (optional)"}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${c=>{this._skipReason=c.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${i("cancel",t)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${i("skip",t)||"Skip"}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?r`
                    <div class="inline-form">
                      <label>${i("reset_to_date",t)||"Reset last_performed to"}</label>
                      <input type="date" .value=${this._resetDate}
                        @input=${c=>{this._resetDate=c.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${i("cancel",t)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${i("reset",t)||"Reset"}
                        </button>
                      </div>
                    </div>
                  `:r`
                    <div class="actions primary-row">
                      <button class="btn primary" @click=${this._onComplete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:check"></ha-icon>
                        ${i("complete",t)||"Complete"}
                      </button>
                      <button class="btn" @click=${()=>{this._showSkip=!0}} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:skip-next"></ha-icon>
                        ${i("skip",t)||"Skip"}
                      </button>
                      <button class="btn" @click=${()=>{this._showReset=!0}} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:restart"></ha-icon>
                        ${i("reset",t)||"Reset"}
                      </button>
                    </div>
                    ${s?r`
                          <div class="actions secondary-row">
                            <button class="btn ghost" @click=${this._onEdit} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                              ${i("edit",t)||"Edit"}
                            </button>
                            <button class="btn ghost" @click=${this._onQr} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:qrcode"></ha-icon>
                              ${i("qr_code",t)||"QR"}
                            </button>
                            <button class="btn ghost"
                              @click=${e.archived?this._onUnarchive:this._onArchive}
                              ?disabled=${this._busy}>
                              <ha-icon icon="${e.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${e.archived?i("unarchive",t)||"Unarchive":i("archive",t)||"Archive"}
                            </button>
                            <button class="btn ghost danger" @click=${this._onDelete} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:delete"></ha-icon>
                              ${i("delete",t)||"Delete"}
                            </button>
                          </div>
                        `:d}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?i("hide_details",t)||"Hide details":i("show_details",t)||"Show history + stats"}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?r`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?i("hide_stats",t)||"Hide stats":i("show_stats",t)||"Show stats + graphs"}
                          </button>`:d}
                    </div>
                    ${this._showDetails?this._renderDetails(e):d}
                    ${this._showAdaptive?this._renderAdaptive(e):d}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${i("open_in_panel",t)||"Open in Maintenance panel"}
                      </button>
                    </div>
                  `}
            `:r`<div class="loading">${i("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}};v.styles=[tt,x`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(0,0,0,0.5);
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 460px;
      max-height: 92vh; overflow: auto;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px;
      display: flex; flex-direction: column; gap: 14px;
      z-index: 101;
    }
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
    /* Edit + QR are admin-tools — left-align as a group; Delete is destructive
       so it gets pushed to the far right with margin-left:auto for visual
       separation. Earlier this row was flex-end which left a strange empty
       gap on the left (user feedback). */
    .actions.secondary-row {
      padding-top: 8px; border-top: 1px solid var(--divider-color);
      justify-content: flex-start;
    }
    .actions.secondary-row .btn.danger {
      margin-left: auto;
    }
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
    .inline-form label { font-size: 13px; color: var(--secondary-text-color); }
    .inline-form input {
      padding: 8px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px;
    }
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
    .history-list { display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow: auto; }
    .history-entry {
      padding: 6px 8px; border-radius: 6px;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      font-size: 13px;
    }
    .history-line {
      display: flex; align-items: center; gap: 8px;
      justify-content: space-between;
    }
    .history-type {
      font-weight: 600; font-size: 11px;
      padding: 2px 6px; border-radius: 4px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .type-completed { background: rgba(46,125,50,0.2); color: #66bb6a; }
    .type-skipped { background: rgba(158,158,158,0.2); color: var(--secondary-text-color); }
    .type-reset { background: rgba(33,150,243,0.2); color: #64b5f6; }
    .type-triggered { background: rgba(255,87,34,0.2); color: #ff8a65; }
    .history-date { font-size: 11px; color: var(--secondary-text-color); flex: 1; text-align: right; }
    .history-edit {
      background: transparent; border: none; cursor: pointer;
      padding: 4px; border-radius: 4px;
      color: var(--secondary-text-color);
    }
    .history-edit:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); color: var(--primary-color); }
    .history-edit ha-icon { --mdc-icon-size: 14px; }
    .history-notes { margin-top: 4px; color: var(--primary-text-color); }
    .history-meta { display: flex; gap: 12px; margin-top: 4px; color: var(--secondary-text-color); font-size: 11px; }
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
      color: #4caf50; font-size: 13px; font-weight: 500;
    }
    /* The panel's recommendation-card uses ha-button. We use plain <button>
       in this dialog's button styles. Re-style the action row to match. */
    .recommendation-actions {
      display: flex; gap: 8px; margin-top: 8px;
    }
    /* Constrain SVG charts so they fit the dialog width even on mobile. */
    .weibull-section, .seasonal-card-compact { max-width: 100%; }
    .weibull-chart svg { max-width: 100%; height: auto; }
    .details-toggle { gap: 12px; flex-wrap: wrap; }
  `],a([m({attribute:!1})],v.prototype,"hass",2),a([o()],v.prototype,"_open",2),a([o()],v.prototype,"_entryId",2),a([o()],v.prototype,"_taskId",2),a([o()],v.prototype,"_task",2),a([o()],v.prototype,"_objectName",2),a([o()],v.prototype,"_busy",2),a([o()],v.prototype,"_error",2),a([o()],v.prototype,"_showSkip",2),a([o()],v.prototype,"_showReset",2),a([o()],v.prototype,"_showDetails",2),a([o()],v.prototype,"_showAdaptive",2),a([o()],v.prototype,"_skipReason",2),a([o()],v.prototype,"_resetDate",2),a([o()],v.prototype,"_features",2),a([o()],v.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",v);var H=class extends ${constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return this.hass?.language||"en"}async openFor(t){this._entryId=t,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=t}catch(t){this._error=k(t,this._lang)}}_onEditObject(){!this._entryId||!this._data||import("./dialog-mount-G4S5XPSC.js").then(({openEditObjectDialog:t})=>{t(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&import("./dialog-mount-G4S5XPSC.js").then(({openCreateTaskDialog:t})=>{t(),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let t=i("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(t)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=k(e,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let t=!!this._data.object.archived;if(!t){let e=i("confirm_archive_object",this._lang)||"Archive this object and its tasks?";if(!window.confirm(e))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=k(e,this._lang)}finally{this._busy=!1}}_onTaskClick(t){this._entryId&&import("./dialog-mount-G4S5XPSC.js").then(({openTaskQuickActions:e})=>{e(this._entryId,t)})}render(){if(!this._open)return d;let t=this._lang,e=this._data,s=e?.object,c=e?.tasks||[],_=this.hass?.user?.is_admin??!0;return r`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${e&&s?r`
              <div class="header">
                <div class="title">${s.name}</div>
                ${this._renderMetaRow(s)}
              </div>

              ${this._error?r`<div class="error">${this._error}</div>`:d}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${i("tasks",t)||"Tasks"}</strong>
                  <span class="count">${c.length}</span>
                </div>
                ${c.length===0?r`<div class="empty">${i("no_tasks",t)||"No tasks yet."}</div>`:r`
                      <div class="task-list">
                        ${c.map(h=>r`
                          <div class="task-row" @click=${()=>this._onTaskClick(h.id)}>
                            <span class="status-dot" style="background: ${V[h.status]||"#ccc"}"></span>
                            <span class="task-name">${h.name}</span>
                            <span class="task-status">${i(h.status||"ok",t)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${s.notes?r`
                    <div class="notes-section">
                      <strong>${i("object_notes_label",t)}</strong>
                      <div class="notes-body">${s.notes}</div>
                    </div>
                  `:d}

              ${_?r`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${i("add_task",t)||"Add task"}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${i("edit",t)||"Edit"}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${s.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${s.archived?i("unarchive_object",t)||"Unarchive object":i("archive_object",t)||"Archive object"}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${i("delete",t)||"Delete"}
                      </button>
                    </div>
                  `:d}
            `:r`<div class="loading">${i("loading",t)||"Loading\u2026"}</div>`}
      </div>
    `}_renderMetaRow(t){let e=this._lang,s=[];return t.area_id&&s.push([i("area",e),t.area_id]),t.manufacturer&&s.push([i("manufacturer",e),t.manufacturer]),t.model&&s.push([i("model",e),t.model]),t.serial_number&&s.push([i("serial_number_label",e),t.serial_number]),t.installation_date&&s.push([i("installed",e),t.installation_date]),t.warranty_expiry&&s.push([i("warranty",e),t.warranty_expiry]),t.documentation_url&&s.push([i("documentation_url_label",e),t.documentation_url]),s.length===0?d:r`
      <div class="meta">
        ${s.map(([c,_])=>r`
            <div class="meta-item">
              <span class="meta-label">${c}</span>
              <span class="meta-value">${/^https?:\/\//i.test(_)?r`<a href="${_}" target="_blank" rel="noopener noreferrer">${_}</a>`:_}</span>
            </div>
          `)}
      </div>
    `}};H.styles=x`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.5);
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 480px;
      max-height: 92vh; overflow: auto;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px; z-index: 101;
      display: flex; flex-direction: column; gap: 14px;
    }
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
    .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .task-name { flex: 1; font-size: 14px; }
    .task-status { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; }
    .notes-body { white-space: pre-wrap; font-size: 13px; padding: 8px; background: var(--secondary-background-color); border-radius: 6px; }
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
  `,a([m({attribute:!1})],H.prototype,"hass",2),a([o()],H.prototype,"_open",2),a([o()],H.prototype,"_entryId",2),a([o()],H.prototype,"_data",2),a([o()],H.prototype,"_busy",2),a([o()],H.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",H);var ct="maintenance-object-dialog",dt="maintenance-task-dialog",Tt="maintenance-history-edit-dialog",Lt="maintenance-complete-dialog",Ht="maintenance-qr-dialog",St="maintenance-task-quick-actions-dialog",Ct="maintenance-object-quick-actions-dialog";function G(){return document.querySelector("home-assistant")?.hass}function P(n){let l=document.body.querySelector(n);return l||(l=document.createElement(n),document.body.appendChild(l)),l}function q(n){let l=G();return l?(n.hass=l,!0):!1}var lt={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7},B=null;function pt(n){return B||(B=n.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(l=>({features:l.features??lt.features,defaultWarningDays:l.general?.default_warning_days??7})).catch(()=>lt),B)}function Je(){let n=P(ct);return q(n)?(n.openCreate(),!0):!1}function Xe(n,l){let t=P(ct);return q(t)?(t.openEdit(n,l),!0):!1}function Qe(){let n=P(dt);if(!q(n))return!1;let l=G();return l?((async()=>{let t=await pt(l),e=n;e.checklistsEnabled=t.features.checklists,e.scheduleTimeEnabled=t.features.schedule_time,e.completionActionsEnabled=t.features.completion_actions,e.defaultWarningDays=t.defaultWarningDays,e.openCreate()})(),!0):!1}function ti(n,l){let t=P(dt);if(!q(t))return!1;let e=G();return e?((async()=>{try{let[s,c]=await Promise.all([e.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:n}),pt(e)]),_=(s.tasks||[]).find(p=>p.id===l);if(!_){console.warn(`openEditTaskDialog: task ${l} not found in entry ${n}`);return}let h=t;h.checklistsEnabled=c.features.checklists,h.scheduleTimeEnabled=c.features.schedule_time,h.completionActionsEnabled=c.features.completion_actions,h.defaultWarningDays=c.defaultWarningDays,await h.openEdit(n,_)}catch(s){console.warn("openEditTaskDialog: failed to load task/features",s)}})(),!0):!1}function ei(n){let l=P(Tt);return q(l)?(l.openEdit(n),!0):!1}function ii(n){let l=P(Lt);return q(l)?(l.entryId=n.entry_id,l.taskId=n.task_id,l.taskName=n.task_name,l.checklist=n.checklist??[],l.adaptiveEnabled=!!n.adaptive_enabled,l.lang=G()?.language||"en",l.open(),!0):!1}function si(n){let l=P(Ht);return q(l)?(l.openForTask(n.entry_id,n.task_id,n.object_name,n.task_name),!0):!1}function ai(n,l){let t=P(St);return q(t)?(t.openFor(n,l),!0):!1}function ri(n){let l=P(Ct);return q(l)?(l.openFor(n),!0):!1}export{ii as openCompleteDialog,Je as openCreateObjectDialog,Qe as openCreateTaskDialog,Xe as openEditObjectDialog,ti as openEditTaskDialog,ei as openHistoryEditDialog,ri as openObjectQuickActions,si as openQrDialog,ai as openTaskQuickActions};
