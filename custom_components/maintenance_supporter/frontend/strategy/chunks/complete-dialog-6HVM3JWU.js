/*! maintenance_supporter frontend 2.124.0 */
import{b as H,c as x,d as O}from"./chunk-TYDKF5JO.js";import{b as B}from"./chunk-MHYKMM3T.js";import{a as k}from"./chunk-TBSRY6KL.js";import{a as U}from"./chunk-NZIN4P53.js";import{e as q}from"./chunk-TGXPZTJC.js";import{a as Y,b as G}from"./chunk-ON5G4VT4.js";import"./chunk-GP2JTWD7.js";import"./chunk-VRLBW23L.js";import{a as j}from"./chunk-QKLUHC7Z.js";import{g as T}from"./chunk-VEV6DR3K.js";import{j as Q,k as b}from"./chunk-JWX6EFWQ.js";import"./chunk-JL7FGK7R.js";import{a as d,b as _,c as V}from"./chunk-KP5LDIXV.js";import{K as R,N as I,R as z,S as L,a as F,d as a,g as f,i as P,q as y,u as w,v as N,z as A}from"./chunk-JEKXH5MX.js";import{a as i,k as E,l as r,t as S,u as $}from"./chunk-NV3MWNII.js";var g=Q,s=class extends P{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new Y(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={};this.prefill=null;this._openFor=""}open(t={}){let n=`${this.entryId}|${this.taskId}`;if(this._open&&this._openFor===n)return;this._open&&this._photos.discardOrphans(),this._openFor=n,this._open=!0,this.viaTagScan=!!t.viaTagScan;let e=this.prefill;this._notes=e?.notes??"",this._cost=e?.cost!=null?String(e.cost):"",this._duration=e?.duration!=null?String(e.duration):"",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((o,u)=>[String(u),!!this.checklistPrefill[o]]).filter(([,o])=>o)),this._feedback=e?.feedback??"needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(o=>[k(o),{...o}])),this._usedQtyText={}}_rangeError(t,n){let e=this.lang;return r("settings_value_out_of_range",e).replace("{min}",y(t,e,{maximumFractionDigits:2})).replace("{max}",y(n,e,{maximumFractionDigits:2}))}_toggleCheck(t){let n=String(t);this._checklistState={...this._checklistState,[n]:!this._checklistState[n]}}_setFeedback(t){this._feedback=t}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId},n=this._notes.trim();if(n&&(t.notes=n),this._cost){let l=parseFloat(this._cost);isNaN(l)||(t.cost=l)}let e=j(this._duration);if(e!==null&&(t.duration=e),this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),this._photos.photos.length>0&&(t.photo_doc_ids=this._photos.ids),this.viaTagScan&&(t.via_tag_scan=!0),this._completedAt){if($(this._completedAt)>Date.now()){this._error=r("completed_at_future_error",this.lang);return}t.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let l={};for(let p of this.readings){let h=(this._readingValues[p.id]??"").trim();if(h==="")continue;let m=parseFloat(h.replace(",","."));isNaN(m)||(l[p.id]=m)}Object.keys(l).length>0&&(t.reading_values=l)}else if(this._readingValue!==""){let l=parseFloat(this._readingValue);isNaN(l)||(t.reading_value=l)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let l=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(l)||l<b[0]||l>b[1]){this._error=this._rangeError(...b);return}t.restock_quantity=l}if(this.parts.length>0){let l=[];for(let[p,h]of Object.entries(this._usedParts)){let m=this._usedQtyText[p],v=m===void 0?h.quantity:parseFloat(m.replace(",","."));if(!Number.isFinite(v)||v<g[0]||v>g[1]){this._error=this._rangeError(...g);return}l.push({...h,quantity:v})}t.used_parts=l.map(p=>p.entry_id?{part_id:p.part_id,quantity:p.quantity,entry_id:p.entry_id}:{part_id:p.part_id,quantity:p.quantity})}let o=await I(this,t,{busy:l=>{this._loading=l},lang:this.lang,fallbackKey:"save_error",onError:l=>{this._error=l}});if(o===void 0)return;let u=U(o,this.lang);if(u){this._close(),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:u},bubbles:!0,composed:!0}));return}this._photos.markAttached(),this._open=!1;let c={entryId:this.entryId,taskId:this.taskId,taskName:this.taskName,undo:o?.undo===!0};this.dispatchEvent(new CustomEvent("task-completed",{detail:c}))}_renderReadingField(t,n){let e=this._completedAt?$(this._completedAt):NaN,o=q(this.readingHistory,t.id,isNaN(e)?void 0:e),u=t.unit||this.readingUnit,c=(this._readingValues[t.id]??"").trim(),l=c===""?NaN:parseFloat(c.replace(",",".")),p=o!==void 0&&!isNaN(l)&&l<o.value,h=o!==void 0?y(o.value,n,{maximumFractionDigits:3}):"";return a`
      <label class="field reading-field">
        <span class="field-label">${t.name}${u?` (${u})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${o!==void 0?r("reading_last",n).replace("{value}",h):""}
          .value=${this._readingValues[t.id]??""}
          @input=${m=>{this._readingValues={...this._readingValues,[t.id]:m.target.value}}} />
        ${p?a`<span class="reading-warn">${r("reading_below_last",n).replace("{value}",h)}</span>`:f}
      </label>`}get _missingRequired(){let t={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(n=>!t[n])}_demands(t){return this.requiredFields.includes(t)}_req(t){return this._demands(t)?a`<span class="req-mark" aria-hidden="true">*</span>`:f}_purchaseSuggestion(){if(this.restockDefault===null)return null;let t=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(t)||t<=0?null:x(this.restockUnitCost*t)}_partsValues(){let t={booked:null,info:null};if(this.restockDefault!==null||!this.parts.length)return t;for(let n of Object.values(this._usedParts)){let e=this.parts.find(c=>k({part_id:c.id,entry_id:c.entry_id})===k(n)),o=O(e);if(o===null)continue;let u=H(e,this.partsCostMode)==="use"?"booked":"info";t[u]=(t[u]??0)+o*(n.quantity||1)}for(let n of["booked","info"])t[n]!==null&&(t[n]=x(t[n]));return t}_renderCostSuggestion(t){let n=this._purchaseSuggestion();if(this.restockDefault!==null){let c=this.partsCostMode==="use"?a`<div class="cost-note">${r("cost_purchase_use_hint",t)}</div>`:f;if(this._cost.trim()!==""||n==null||n<=0)return c;let l=w(n,this.currencySymbol,t);return a`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(x(n))}
        >${r("cost_from_parts",t).replace("{amount}",l)}</button>${c}`}let{booked:e,info:o}=this._partsValues(),u=(c,l)=>c!=null&&c>0?a`<div class="cost-note">${r(l,t).replace("{amount}",w(c,this.currencySymbol,t))}</div>`:f;return a`${u(e,"cost_parts_booked")}${u(o,"cost_parts_info")}`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=`${S()}:00`}render(){if(!this._open)return a``;let t=this.lang||E(this.hass),n=this._error||this._photos.errorText(t);return a`
      <ha-dialog open .headerTitle=${z(`${r("complete_title",t)}${this.taskName}`)} @closed=${this._close}>
        ${L(`${r("complete_title",t)}${this.taskName}`)}
        ${this.phaseLabel?a`<div class="phase-line">${r("phase_current",t)}: ${this.phaseLabel}</div>`:f}
        ${this.requireTagScan&&!this.viaTagScan?a`<div class="scan-required-note">${r("require_tag_scan_hint",t)}</div>`:f}
        <div class="content">
          ${n?V("error",n):f}
          ${this.checklist.length>0?a`
            <div class="checklist-section">
              <label class="checklist-label">${r("checklist",t)}</label>
              ${this.checklist.map((e,o)=>a`
                ${T({cls:"checklist-item",checked:!!this._checklistState[String(o)],onChange:()=>this._toggleCheck(o)},a`<span>${e}</span>`)}
              `)}
            </div>
          `:f}
          ${this.readings.length>0?a`<div class="readings-block">
                <span class="field-label">${r("readings_section",t)}</span>
                ${this.readings.map(e=>this._renderReadingField(e,t))}
              </div>`:this.taskType==="reading"?a`
              <label class="field">
                <span class="field-label">${r("reading_value_label",t)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${e=>this._readingValue=e.target.value} />
              </label>`:f}
          ${this.parts.length?a`<div class="used-parts">
                <span class="field-label">${r("complete_parts_used",t)}</span>
                ${this.parts.map(e=>{let o=k({part_id:e.id,entry_id:e.entry_id}),u=this._usedParts[o],c=u!==void 0,l=e.entry_id?{part_id:e.id,quantity:1,entry_id:e.entry_id}:{part_id:e.id,quantity:1};return a`<div class="used-part-row">
                    ${T({cls:"used-part-check",checked:c,onChange:p=>{let h={...this._usedParts};if(p.target.checked)h[o]=h[o]||l;else{delete h[o];let m={...this._usedQtyText};delete m[o],this._usedQtyText=m}this._usedParts=h}},a`<span
                        >${e.name}${e.owner_name?a`<span class="used-part-owner"> (${e.owner_name})</span>`:f}${e.stock!==null&&e.stock!==void 0?` (${N(e.stock,e.unit,t)})`:""}</span
                      >`)}
                    ${c?a`<input class="used-part-qty" type="number" min=${g[0]} max=${g[1]} step="0.01"
                          .value=${this._usedQtyText[o]??String(u.quantity)}
                          @input=${p=>{let h=p.target.value;this._usedQtyText={...this._usedQtyText,[o]:h};let m=parseFloat(h.replace(",","."));Number.isFinite(m)&&m>=g[0]&&(this._usedParts={...this._usedParts,[o]:{...l,quantity:m}})}} />`:f}
                  </div>`})}
              </div>`:this.consumesInfo.length?a`<div class="consumes-hint">
                  ${this.consumesInfo.map(e=>a`<div>${e}</div>`)}
                </div>`:f}
          ${this.restockDefault!==null?a`
              <label class="field">
                <span class="field-label">${r("restock_quantity_label",t)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
                <input type="number" step="0.01" min=${b[0]} max=${b[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${e=>this._restockQty=e.target.value} />
              </label>`:f}
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
                </div>`:f}
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
          `:f}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${r("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?r("uploading",t):this._missingRequired.length?this._missingRequired.map(e=>r("err_required",t).replace("{field}",r(B[e]??e,t))).join(" \xB7 "):""}
          >
            ${this._loading?r("completing",t):r("complete",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};s.styles=[R,G,F`
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
  `],i([d({attribute:!1})],s.prototype,"hass",2),i([d()],s.prototype,"entryId",2),i([d()],s.prototype,"taskId",2),i([d()],s.prototype,"taskName",2),i([d()],s.prototype,"lang",2),i([d({type:Array})],s.prototype,"checklist",2),i([d({type:Boolean})],s.prototype,"adaptiveEnabled",2),i([d()],s.prototype,"taskType",2),i([d()],s.prototype,"readingUnit",2),i([d({attribute:!1})],s.prototype,"readings",2),i([d({attribute:!1})],s.prototype,"readingHistory",2),i([d({attribute:!1})],s.prototype,"restockDefault",2),i([d({attribute:!1})],s.prototype,"restockUnitCost",2),i([d({attribute:!1})],s.prototype,"restockPackage",2),i([d()],s.prototype,"currencySymbol",2),i([d({attribute:!1})],s.prototype,"partsCostMode",2),i([d({attribute:!1})],s.prototype,"parts",2),i([d({attribute:!1})],s.prototype,"consumesParts",2),i([d({type:Array})],s.prototype,"consumesInfo",2),i([d({type:Array})],s.prototype,"requiredFields",2),i([d()],s.prototype,"phaseLabel",2),i([d({type:Boolean})],s.prototype,"requireTagScan",2),i([d({type:Boolean})],s.prototype,"viaTagScan",2),i([_()],s.prototype,"_open",2),i([_()],s.prototype,"_notes",2),i([_()],s.prototype,"_cost",2),i([_()],s.prototype,"_duration",2),i([_()],s.prototype,"_loading",2),i([_()],s.prototype,"_error",2),i([_()],s.prototype,"_checklistState",2),i([_()],s.prototype,"_feedback",2),i([_()],s.prototype,"_readingValue",2),i([_()],s.prototype,"_readingValues",2),i([_()],s.prototype,"_restockQty",2),i([_()],s.prototype,"_completedAt",2),i([_()],s.prototype,"_usedParts",2),i([_()],s.prototype,"_usedQtyText",2),i([d({attribute:!1})],s.prototype,"checklistPrefill",2),i([d({attribute:!1})],s.prototype,"prefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",s);export{s as MaintenanceCompleteDialog};
