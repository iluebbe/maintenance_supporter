/*! maintenance_supporter frontend 2.121.0 */
import{b as Y}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WAUNOCHM.js";import{b as U,c as G}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-JZBJQ2DM.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-2MPVRJTJ.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-KUPOTAU7.js";import{a as B}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MKLKMJ6A.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-JN6DSOGJ.js";import{a as k,h as L}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-S467QAVG.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-K3ZKWKN2.js";import{b as z}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-P2UCVE3T.js";import{b as V,c as x,d as H}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EOQRMKO2.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-3AB2SQS5.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-5QFBI2I6.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-74HJ66BE.js";import{a as T}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DUP67HYE.js";import{k as j,l as b}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NJ7WNURY.js";import{a as O}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FMUBH3VL.js";import{a as Q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6F6M6DVU.js";import{f as R,g as I}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-X2OEUN4V.js";import{b as d,c as f}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LCH6QYSS.js";import{G as P,H as $,T as y,X as w,Y as N,a as i,aa as A,b as E,e as a,h,k as S,pa as F,y as q,z as r}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-74ISRDIW.js";var g=j,s=class extends S{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new G(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={};this.prefill=null}open(t={}){if(this._open)return;this._open=!0,this.viaTagScan=!!t.viaTagScan;let o=this.prefill;this._notes=o?.notes??"",this._cost=o?.cost!=null?String(o.cost):"",this._duration=o?.duration!=null?String(o.duration):"",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((e,l)=>[String(l),!!this.checklistPrefill[e]]).filter(([,e])=>e)),this._feedback=o?.feedback??"needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(e=>[k(e),{...e}])),this._usedQtyText={}}_rangeError(t,o){let e=this.lang;return r("settings_value_out_of_range",e).replace("{min}",y(t,e,{maximumFractionDigits:2})).replace("{max}",y(o,e,{maximumFractionDigits:2}))}_toggleCheck(t){let o=String(t);this._checklistState={...this._checklistState,[o]:!this._checklistState[o]}}_setFeedback(t){this._feedback=t}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId},o=this._notes.trim();if(o&&(t.notes=o),this._cost){let n=parseFloat(this._cost);isNaN(n)||(t.cost=n)}let e=B(this._duration);if(e!==null&&(t.duration=e),this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),this._photos.photos.length>0&&(t.photo_doc_ids=this._photos.ids),this.viaTagScan&&(t.via_tag_scan=!0),this._completedAt){if($(this._completedAt)>Date.now()){this._error=r("completed_at_future_error",this.lang);return}t.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let n={};for(let p of this.readings){let u=(this._readingValues[p.id]??"").trim();if(u==="")continue;let m=parseFloat(u.replace(",","."));isNaN(m)||(n[p.id]=m)}Object.keys(n).length>0&&(t.reading_values=n)}else if(this._readingValue!==""){let n=parseFloat(this._readingValue);isNaN(n)||(t.reading_value=n)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let n=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(n)||n<b[0]||n>b[1]){this._error=this._rangeError(...b);return}t.restock_quantity=n}if(this.parts.length>0){let n=[];for(let[p,u]of Object.entries(this._usedParts)){let m=this._usedQtyText[p],v=m===void 0?u.quantity:parseFloat(m.replace(",","."));if(!Number.isFinite(v)||v<g[0]||v>g[1]){this._error=this._rangeError(...g);return}n.push({...u,quantity:v})}t.used_parts=n.map(p=>p.entry_id?{part_id:p.part_id,quantity:p.quantity,entry_id:p.entry_id}:{part_id:p.part_id,quantity:p.quantity})}let l=await Q(this,t,{busy:n=>{this._loading=n},lang:this.lang,fallbackKey:"save_error",onError:n=>{this._error=n}});if(l===void 0)return;let _=z(l,this.lang);if(_){this._close(),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:_},bubbles:!0,composed:!0}));return}this._photos.markAttached(),this._open=!1;let c={entryId:this.entryId,taskId:this.taskId,taskName:this.taskName,undo:l?.undo===!0};this.dispatchEvent(new CustomEvent("task-completed",{detail:c}))}_renderReadingField(t,o){let e=this._completedAt?$(this._completedAt):NaN,l=L(this.readingHistory,t.id,isNaN(e)?void 0:e),_=t.unit||this.readingUnit,c=(this._readingValues[t.id]??"").trim(),n=c===""?NaN:parseFloat(c.replace(",",".")),p=l!==void 0&&!isNaN(n)&&n<l.value,u=l!==void 0?y(l.value,o,{maximumFractionDigits:3}):"";return a`
      <label class="field reading-field">
        <span class="field-label">${t.name}${_?` (${_})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${l!==void 0?r("reading_last",o).replace("{value}",u):""}
          .value=${this._readingValues[t.id]??""}
          @input=${m=>{this._readingValues={...this._readingValues,[t.id]:m.target.value}}} />
        ${p?a`<span class="reading-warn">${r("reading_below_last",o).replace("{value}",u)}</span>`:h}
      </label>`}get _missingRequired(){let t={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(o=>!t[o])}_demands(t){return this.requiredFields.includes(t)}_req(t){return this._demands(t)?a`<span class="req-mark" aria-hidden="true">*</span>`:h}_purchaseSuggestion(){if(this.restockDefault===null)return null;let t=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(t)||t<=0?null:x(this.restockUnitCost*t)}_partsValues(){let t={booked:null,info:null};if(this.restockDefault!==null||!this.parts.length)return t;for(let o of Object.values(this._usedParts)){let e=this.parts.find(c=>k({part_id:c.id,entry_id:c.entry_id})===k(o)),l=H(e);if(l===null)continue;let _=V(e,this.partsCostMode)==="use"?"booked":"info";t[_]=(t[_]??0)+l*(o.quantity||1)}for(let o of["booked","info"])t[o]!==null&&(t[o]=x(t[o]));return t}_renderCostSuggestion(t){let o=this._purchaseSuggestion();if(this.restockDefault!==null){let c=this.partsCostMode==="use"?a`<div class="cost-note">${r("cost_purchase_use_hint",t)}</div>`:h;if(this._cost.trim()!==""||o==null||o<=0)return c;let n=w(o,this.currencySymbol,t);return a`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(x(o))}
        >${r("cost_from_parts",t).replace("{amount}",n)}</button>${c}`}let{booked:e,info:l}=this._partsValues(),_=(c,n)=>c!=null&&c>0?a`<div class="cost-note">${r(n,t).replace("{amount}",w(c,this.currencySymbol,t))}</div>`:h;return a`${_(e,"cost_parts_booked")}${_(l,"cost_parts_info")}`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=`${P()}:00`}render(){if(!this._open)return a``;let t=this.lang||q(this.hass),o=this._error||this._photos.errorText(t);return a`
      <ha-dialog open .headerTitle=${R(`${r("complete_title",t)}${this.taskName}`)} @closed=${this._close}>
        ${I(`${r("complete_title",t)}${this.taskName}`)}
        ${this.phaseLabel?a`<div class="phase-line">${r("phase_current",t)}: ${this.phaseLabel}</div>`:h}
        ${this.requireTagScan&&!this.viaTagScan?a`<div class="scan-required-note">${r("require_tag_scan_hint",t)}</div>`:h}
        <div class="content">
          ${o?O("error",o):h}
          ${this.checklist.length>0?a`
            <div class="checklist-section">
              <label class="checklist-label">${r("checklist",t)}</label>
              ${this.checklist.map((e,l)=>a`
                ${T({cls:"checklist-item",checked:!!this._checklistState[String(l)],onChange:()=>this._toggleCheck(l)},a`<span>${e}</span>`)}
              `)}
            </div>
          `:h}
          ${this.readings.length>0?a`<div class="readings-block">
                <span class="field-label">${r("readings_section",t)}</span>
                ${this.readings.map(e=>this._renderReadingField(e,t))}
              </div>`:this.taskType==="reading"?a`
              <label class="field">
                <span class="field-label">${r("reading_value_label",t)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${e=>this._readingValue=e.target.value} />
              </label>`:h}
          ${this.parts.length?a`<div class="used-parts">
                <span class="field-label">${r("complete_parts_used",t)}</span>
                ${this.parts.map(e=>{let l=k({part_id:e.id,entry_id:e.entry_id}),_=this._usedParts[l],c=_!==void 0,n=e.entry_id?{part_id:e.id,quantity:1,entry_id:e.entry_id}:{part_id:e.id,quantity:1};return a`<div class="used-part-row">
                    ${T({cls:"used-part-check",checked:c,onChange:p=>{let u={...this._usedParts};if(p.target.checked)u[l]=u[l]||n;else{delete u[l];let m={...this._usedQtyText};delete m[l],this._usedQtyText=m}this._usedParts=u}},a`<span
                        >${e.name}${e.owner_name?a`<span class="used-part-owner"> (${e.owner_name})</span>`:h}${e.stock!==null&&e.stock!==void 0?` (${N(e.stock,e.unit,t)})`:""}</span
                      >`)}
                    ${c?a`<input class="used-part-qty" type="number" min=${g[0]} max=${g[1]} step="0.01"
                          .value=${this._usedQtyText[l]??String(_.quantity)}
                          @input=${p=>{let u=p.target.value;this._usedQtyText={...this._usedQtyText,[l]:u};let m=parseFloat(u.replace(",","."));Number.isFinite(m)&&m>=g[0]&&(this._usedParts={...this._usedParts,[l]:{...n,quantity:m}})}} />`:h}
                  </div>`})}
              </div>`:this.consumesInfo.length?a`<div class="consumes-hint">
                  ${this.consumesInfo.map(e=>a`<div>${e}</div>`)}
                </div>`:h}
          ${this.restockDefault!==null?a`
              <label class="field">
                <span class="field-label">${r("restock_quantity_label",t)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
                <input type="number" step="0.01" min=${b[0]} max=${b[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${e=>this._restockQty=e.target.value} />
              </label>`:h}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${this._demands("notes")?r("notes_label",t):r("notes_optional",t)}${this._req("notes")}</span>
            <!-- Several lines (#202): what was done, one line each. The
                 history and the printouts keep the line breaks; they show
                 notes as plain text, so no Markdown hint here. -->
            <textarea class="field-input notes-input" rows="3"
              .value=${this._notes}
              @input=${e=>this._notes=e.target.value}></textarea>
          </label>
          <div class="field">
            <span class="field-label">${this._demands("cost")?r("cost",t):r("cost_optional",t)}${this._req("cost")}</span>
            <ms-cost-input .lang=${t} .value=${this._cost}
              @value-changed=${e=>this._cost=e.detail.value}></ms-cost-input>
            ${this._renderCostSuggestion(t)}
          </div>
          <label class="field">
            <span class="field-label">${this._demands("duration")?r("quick_complete_defaults_duration",t):r("duration_minutes",t)}${this._req("duration")}</span>
            <input type="number" step="1" min="0" inputmode="numeric" class="field-input"
              .value=${this._duration}
              @input=${e=>this._duration=e.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${r("completed_at_optional",t)}</span>
            ${this._completedAt?a`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${t}
                  .value=${this._completedAt}
                  .helper=${A(t)}
                  @value-changed=${e=>this._completedAt=e.detail.value}
                ></ms-date-field>`:a`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${r("completed_at_pick",t)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${this._demands("photo")?r("completion_photos",t):r("completion_photos_optional",t)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?a`<div class="photo-strip">
                  ${this._photos.photos.map(e=>a`
                    <div class="photo-preview">
                      <img src=${e.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(e.id)}
                        title="${r("remove",t)}">✕</button>
                    </div>`)}
                </div>`:h}
            ${this._photos.full?a`<div class="photo-limit">${r("photos_limit",t).replace("{max}",String(this._photos.max))}</div>`:a`<ms-photo-picker .lang=${t} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${e=>this._photos.addFiles(e.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?a`
            <div class="feedback-section">
              <label class="feedback-label">${r("was_maintenance_needed",t)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${r("feedback_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${r("feedback_not_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${r("feedback_not_sure",t)}</button>
              </div>
            </div>
          `:h}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${r("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?r("uploading",t):this._missingRequired.length?this._missingRequired.map(e=>r("err_required",t).replace("{field}",r(Y[e]??e,t))).join(" \xB7 "):""}
          >
            ${this._loading?r("completing",t):r("complete",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};s.styles=[F,U,E`
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
  `],i([d({attribute:!1})],s.prototype,"hass",2),i([d()],s.prototype,"entryId",2),i([d()],s.prototype,"taskId",2),i([d()],s.prototype,"taskName",2),i([d()],s.prototype,"lang",2),i([d({type:Array})],s.prototype,"checklist",2),i([d({type:Boolean})],s.prototype,"adaptiveEnabled",2),i([d()],s.prototype,"taskType",2),i([d()],s.prototype,"readingUnit",2),i([d({attribute:!1})],s.prototype,"readings",2),i([d({attribute:!1})],s.prototype,"readingHistory",2),i([d({attribute:!1})],s.prototype,"restockDefault",2),i([d({attribute:!1})],s.prototype,"restockUnitCost",2),i([d({attribute:!1})],s.prototype,"restockPackage",2),i([d()],s.prototype,"currencySymbol",2),i([d({attribute:!1})],s.prototype,"partsCostMode",2),i([d({attribute:!1})],s.prototype,"parts",2),i([d({attribute:!1})],s.prototype,"consumesParts",2),i([d({type:Array})],s.prototype,"consumesInfo",2),i([d({type:Array})],s.prototype,"requiredFields",2),i([d()],s.prototype,"phaseLabel",2),i([d({type:Boolean})],s.prototype,"requireTagScan",2),i([d({type:Boolean})],s.prototype,"viaTagScan",2),i([f()],s.prototype,"_open",2),i([f()],s.prototype,"_notes",2),i([f()],s.prototype,"_cost",2),i([f()],s.prototype,"_duration",2),i([f()],s.prototype,"_loading",2),i([f()],s.prototype,"_error",2),i([f()],s.prototype,"_checklistState",2),i([f()],s.prototype,"_feedback",2),i([f()],s.prototype,"_readingValue",2),i([f()],s.prototype,"_readingValues",2),i([f()],s.prototype,"_restockQty",2),i([f()],s.prototype,"_completedAt",2),i([f()],s.prototype,"_usedParts",2),i([f()],s.prototype,"_usedQtyText",2),i([d({attribute:!1})],s.prototype,"checklistPrefill",2),i([d({attribute:!1})],s.prototype,"prefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",s);export{s as MaintenanceCompleteDialog};
