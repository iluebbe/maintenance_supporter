/*! maintenance_supporter frontend 2.97.1 */
import"/maintenance_supporter_panelfiles/panel-chunks/chunk-4CRDSGBT.js";import{a as n,b as _,c as o,f as p,h as c,l as g,m as a,s,y as u}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YJXVPPWG.js";var d=["round_robin","least_completed","random"],v=["low","normal","high"],m=365,i=class extends c{constructor(){super(...arguments);this._open=!1;this._mode="assign";this._count=0;this._users=[];this._present=[];this._assignKind="one";this._person="";this._pool=new Set;this._rotation=d[0];this._addText="";this._remove=new Set;this._setWarning=!1;this._warning=7;this._setPriority=!1;this._priority="normal";this._setMute=!1;this._mute=!1;this._resolve=null}get _lang(){return u(this.hass)}open(t,e,r){return this._resolve?.(null),this._mode=t,this._count=e.length,this._users=[...r].sort((l,h)=>l.name.localeCompare(h.name)),this._present=[...new Set(e.flatMap(l=>l.labels||[]))].sort((l,h)=>l.localeCompare(h)),this._assignKind="one",this._person="",this._pool=new Set,this._rotation=d[0],this._addText="",this._remove=new Set,this._setWarning=!1,this._warning=7,this._setPriority=!1,this._priority="normal",this._setMute=!1,this._mute=!1,this._open=!0,new Promise(l=>{this._resolve=l})}_finish(t){this._open=!1;let e=this._resolve;this._resolve=null,e?.(t)}changes(){if(this._mode==="assign"){if(this._assignKind==="one")return{responsible_user_id:this._person||null,assignee_pool:null,rotation_strategy:null};let e=this._users.map(r=>r.id).filter(r=>this._pool.has(r));return e.length<2?null:{assignee_pool:e,rotation_strategy:this._rotation,responsible_user_id:null}}if(this._mode==="labels"){let e=[...new Set(this._addText.split(",").map(l=>l.trim()).filter(Boolean))],r=[...this._remove];return e.length||r.length?{labels_add:e,labels_remove:r}:null}let t={};return this._setWarning&&(t.warning_days=this._warning),this._setPriority&&(t.priority=this._priority),this._setMute&&(t.notify_enabled=!this._mute),Object.keys(t).length?t:null}_toggle(t,e){let r=new Set(t);return r.has(e)?r.delete(e):r.add(e),r}_renderAssign(t){return o`
      <div class="hint">${s("bulk_assign_hint",t)}</div>
      <label class="choice">
        <input type="radio" name="kind" .checked=${this._assignKind==="one"} @change=${()=>this._assignKind="one"} />
        ${s("bulk_assign_one",t)}
      </label>
      ${this._assignKind==="one"?o`<select class="person" .value=${this._person} @change=${e=>this._person=e.target.value}>
            <option value="" ?selected=${!this._person}>${s("unassigned",t)}</option>
            ${this._users.map(e=>o`<option value=${e.id} ?selected=${this._person===e.id}>${e.name}</option>`)}
          </select>`:p}
      <label class="choice">
        <input type="radio" name="kind" .checked=${this._assignKind==="rotate"} @change=${()=>this._assignKind="rotate"} />
        ${s("bulk_assign_rotate",t)}
      </label>
      ${this._assignKind==="rotate"?o`<div class="pool">
              ${this._users.map(e=>o`<label class="row">
                  <input type="checkbox" .checked=${this._pool.has(e.id)} @change=${()=>this._pool=this._toggle(this._pool,e.id)} />
                  ${e.name}
                </label>`)}
            </div>
            <label class="field">
              <span>${s("rotation_strategy",t)}</span>
              <select class="rotation" .value=${this._rotation} @change=${e=>this._rotation=e.target.value}>
                ${d.map(e=>o`<option value=${e} ?selected=${this._rotation===e}>${s(`rotation_${e}`,t)}</option>`)}
              </select>
            </label>
            ${this._pool.size<2?o`<div class="hint">${s("bulk_rotation_min_two",t)}</div>`:p}`:p}
    `}_renderLabels(t){return o`
      <ms-textfield
        class="labels-add"
        label=${s("bulk_labels_add",t)}
        .helper=${s("labels_help",t)}
        .value=${this._addText}
        @input=${e=>this._addText=e.target.value}
      ></ms-textfield>
      ${this._present.length?o`<div class="section-title">${s("bulk_labels_remove",t)}</div>
            <div class="pool">
              ${this._present.map(e=>o`<label class="row">
                  <input type="checkbox" .checked=${this._remove.has(e)} @change=${()=>this._remove=this._toggle(this._remove,e)} />
                  ${e}
                </label>`)}
            </div>`:p}
    `}_renderEdit(t){return o`
      <div class="hint">${s("bulk_edit_hint",t)}</div>
      <div class="row edit-row">
        <input type="checkbox" class="set-warning" .checked=${this._setWarning} @change=${e=>this._setWarning=e.target.checked} />
        <span class="grow">${s("warning_days",t)}</span>
        <input type="number" class="warning" min="0" max=${m} .value=${String(this._warning)} ?disabled=${!this._setWarning}
          @change=${e=>{let r=parseInt(e.target.value,10);this._warning=Number.isInteger(r)?Math.min(Math.max(r,0),m):this._warning}} />
      </div>
      <div class="row edit-row">
        <input type="checkbox" class="set-priority" .checked=${this._setPriority} @change=${e=>this._setPriority=e.target.checked} />
        <span class="grow">${s("priority",t)}</span>
        <select class="priority" .value=${this._priority} ?disabled=${!this._setPriority} @change=${e=>this._priority=e.target.value}>
          ${v.map(e=>o`<option value=${e} ?selected=${this._priority===e}>${s(`priority_${e}`,t)}</option>`)}
        </select>
      </div>
      <div class="row edit-row">
        <input type="checkbox" class="set-mute" .checked=${this._setMute} @change=${e=>this._setMute=e.target.checked} />
        <span class="grow">${s("bulk_no_notifications",t)}</span>
        <input type="checkbox" class="mute" .checked=${this._mute} ?disabled=${!this._setMute} @change=${e=>this._mute=e.target.checked} />
      </div>
    `}render(){if(!this._open)return o``;let t=this._lang,e=this._mode==="assign"?s("bulk_assign",t):this._mode==="labels"?s("labels",t):s("edit",t),r=this.changes()!==null;return o`
      <ha-dialog open @closed=${()=>this._finish(null)}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          <div class="count">${s("bulk_n_selected",t).replace("{n}",String(this._count))}</div>
          ${this._mode==="assign"?this._renderAssign(t):this._mode==="labels"?this._renderLabels(t):this._renderEdit(t)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${()=>this._finish(null)}>${s("cancel",t)}</ha-button>
          <ha-button class="apply" .disabled=${!r} @click=${()=>this._finish(this.changes())}>${s("save",t)}</ha-button>
        </div>
      </ha-dialog>
    `}};i.styles=_`
    .dialog-title { font-size: 18px; font-weight: 500; padding-bottom: 12px; }
    .content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: min(360px, calc(100vw - 24px));
      max-width: 520px;
      max-height: 60vh;
      overflow-y: auto;
    }
    @media (max-width: 600px) {
      .content { min-width: 0; max-width: none; max-height: none; }
    }
    .count, .hint { color: var(--secondary-text-color); font-size: 13px; }
    .section-title {
      font-size: 14px;
      font-weight: 500;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .choice, .row { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
    .pool { display: flex; flex-direction: column; gap: 4px; padding-left: 26px; }
    .field { display: flex; align-items: center; gap: 8px; justify-content: space-between; font-size: 14px; }
    .grow { flex: 1; min-width: 0; }
    select, input[type="number"] {
      font: inherit;
      padding: 4px 6px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      max-width: 100%;
    }
    input[type="number"] { width: 72px; }
    select.person { margin-left: 26px; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; padding-top: 16px; }
  `,n([g({attribute:!1})],i.prototype,"hass",2),n([a()],i.prototype,"_open",2),n([a()],i.prototype,"_mode",2),n([a()],i.prototype,"_count",2),n([a()],i.prototype,"_users",2),n([a()],i.prototype,"_present",2),n([a()],i.prototype,"_assignKind",2),n([a()],i.prototype,"_person",2),n([a()],i.prototype,"_pool",2),n([a()],i.prototype,"_rotation",2),n([a()],i.prototype,"_addText",2),n([a()],i.prototype,"_remove",2),n([a()],i.prototype,"_setWarning",2),n([a()],i.prototype,"_warning",2),n([a()],i.prototype,"_setPriority",2),n([a()],i.prototype,"_priority",2),n([a()],i.prototype,"_setMute",2),n([a()],i.prototype,"_mute",2);customElements.get("maintenance-bulk-edit-dialog")||customElements.define("maintenance-bulk-edit-dialog",i);export{i as MaintenanceBulkEditDialog};
