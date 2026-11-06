/*! maintenance_supporter frontend 2.120.0 */
import{a as yt,c as ft}from"/maintenance_supporter_cardfiles/card-chunks/chunk-W3ZRW7OI.js";import{a as J,c as Q,d as X,e as V,g as Z,i as N,k as dt,l as pt,m as ht}from"/maintenance_supporter_cardfiles/card-chunks/chunk-Y7ZYRGYJ.js";import{g as gt,j as mt}from"/maintenance_supporter_cardfiles/card-chunks/chunk-SRIVWKGV.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-QRSJOG6S.js";import{b as ut,d as _t}from"/maintenance_supporter_cardfiles/card-chunks/chunk-CJ35NRON.js";import{e as A}from"/maintenance_supporter_cardfiles/card-chunks/chunk-NKW4AASI.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-OQXWV5KA.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-ZIPUJEUU.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-OVK3PTDC.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-Q44WUMQF.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-T6SP4KIH.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-YV22LRFJ.js";import{a as I,b as k}from"/maintenance_supporter_cardfiles/card-chunks/chunk-OYEWBM6G.js";import{$ as nt,D as K,G,I as E,J as st,K as it,L as q,R as at,X as rt,a as v,b as R,da as ot,e as h,ea as ct,h as w,j as W,ja as lt,l as tt,p as U,q as B,w as M,x as c,y as Y,z as et}from"/maintenance_supporter_cardfiles/card-chunks/chunk-VJB3IP3X.js";var vt=5;function St(u,p){let t=[];for(let e=0;e<p;e++)t.push(E(u,e));return t}function Ct(u){if(!u||u.length===0)return null;let p=u.map(t=>A(t)).filter(t=>t!==null&&t>=0);return p.length===0?null:p.reduce((t,e)=>t+e,0)/p.length}function Dt(u){let{windowStart:p,windowEnd:t,task:e,entryId:l,objectName:f}=u,a=[],_=(n,o)=>({date:n,entry_id:l,task_id:e.id,task_name:e.name,object_name:f,status:o&&B(e.status)?"ok":e.status,days_until_due:o?null:e.days_until_due??null,projected:o,schedule_type:e.schedule_type,interval_days:e.interval_days??null,interval_unit:e.interval_unit??null,responsible_user_id:e.responsible_user_id??null,avg_cost:Ct(e.history),adaptive_enabled:!!e.adaptive_config?.enabled,prediction_confidence:e.threshold_prediction_confidence??null}),i=Math.max(1,Math.round(ht(e.interval_days,e.interval_unit)));if(B(e.status)){if(a.push(_(p,!1)),e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let n=E(p,i),o=1;for(;n<=t&&o<vt;)a.push(_(n,!0)),o++,n=E(n,i)}return a}let d=e.next_due;if(typeof d!="string"||!d)return a;let r=d.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(r))return a;if(r>=p&&r<=t)a.push(_(r,!1));else if(r>t)return a;if(e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let n=E(r,i),o=a.length;for(;n<=t&&o<vt;)n>=p&&(a.push(_(n,!0)),o++),n=E(n,i)}return a}function bt(u,p,t,e=null){let l=St(p,t),f=l[0],a=l[l.length-1],_=[];for(let d of u){let r=d.object?.name||"",n=d.entry_id,o=d.tasks||[];for(let g of o){if(e&&!N(g,e)||g.enabled===!1)continue;let y=Dt({windowStart:f,windowEnd:a,task:g,entryId:n,objectName:r});_.push(...y)}}let i=new Map;for(let d of l)i.set(d,[]);for(let d of _){let r=i.get(d.date);r&&r.push(d)}for(let[,d]of i)d.sort((r,n)=>{let o=U(r.status),g=U(n.status);if(o!==g)return o-g;if(r.projected!==n.projected)return r.projected?1:-1;let y=r.object_name.localeCompare(n.object_name);return y!==0?y:r.task_name.localeCompare(n.task_name)});return l.map(d=>({date:d,events:i.get(d)??[]}))}var Ht={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok",updated:"ok"};function P(u,p){return`${u}/${p}`}function wt(u,p,t){let e=kt(p,t)[0],l=[];for(let f of u)for(let a of f.tasks||[]){let _=a.history||[],i=a.history_count??_.length;if(i<=_.length)continue;let d=_.map(o=>G(o?.timestamp)).filter(o=>!!o),r=d.length?d.reduce((o,g)=>o<g?o:g):"";if(r&&r<e)continue;let n=P(f.entry_id,a.id);l.push({entryId:f.entry_id,taskId:a.id,key:n,sig:`${n}:${i}:${Rt(JSON.stringify(_))}`})}return l}function Rt(u){let p=2166136261;for(let t=0;t<u.length;t++)p^=u.charCodeAt(t),p=Math.imul(p,16777619);return(p>>>0).toString(36)}function kt(u,p){let t=[];for(let e=p-1;e>=0;e--)t.push(E(u,-e));return t}function xt(u,p,t,e=null,l={}){let f=kt(p,t),a=f[0],_=f[f.length-1],i=new Map;for(let r of f)i.set(r,[]);for(let r of u){let n=r.object?.name||"",o=r.entry_id,g=r.tasks||[];for(let y of g){if(e&&!N(y,e))continue;let $=l[P(o,y.id)]??(y.history||[]);for(let b of $){if(typeof b?.timestamp!="string")continue;let x=G(b.timestamp);if(!x||x<a||x>_)continue;let T=i.get(x);if(!T)continue;let L=b.type??"completed";T.push({date:x,entry_id:o,task_id:y.id,task_name:y.name,object_name:n,status:Ht[L]??"ok",days_until_due:null,projected:!1,schedule_type:y.schedule_type,interval_days:y.interval_days??null,responsible_user_id:y.responsible_user_id??null,avg_cost:A(b),adaptive_enabled:!!y.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:b.timestamp,history_type:L,history_cost:A(b),history_notes:typeof b.notes=="string"?b.notes:null,history_duration:typeof b.duration=="number"?b.duration:null})}}}let d={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4,updated:5};for(let[,r]of i)r.sort((n,o)=>{let g=d[n.history_type??""]??99,y=d[o.history_type??""]??99;if(g!==y)return g-y;let $=n.object_name.localeCompare(o.object_name);return $!==0?$:n.task_name.localeCompare(o.task_name)});return f.map(r=>({date:r,events:i.get(r)??[]}))}var $t=R`
  .cal-controls {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    padding: 12px 16px;
    border-bottom: 1px solid var(--divider-color);
  }
  .cal-window-chips {
    display: flex;
    gap: 4px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border-radius: 999px;
    padding: 3px;
  }
  .cal-window-chip {
    padding: 6px 14px;
    border: none;
    background: transparent;
    color: var(--secondary-text-color);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 999px;
    transition: background 0.12s, color 0.12s;
  }
  .cal-window-chip:hover { color: var(--primary-text-color); }
  .cal-window-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  /* v2.2.0 — past-window chips: visually distinguished from forward chips
     so the user grasps the time-direction switch at a glance. Uses a
     muted secondary tone instead of the primary blue. v2.3.x: explicit
     "−N d" / "+N d" prefixes + dot separator so past vs forward groups
     read at a glance instead of being two pill rows that look identical
     except for a small arrow. (User feedback: *"das −30 und die + sind
     noch schlecht angeordnet"*.) */
  .cal-past-chips {
    /* margin-right replaced by explicit separator below */
  }
  .cal-past-chip.active {
    background: var(--secondary-text-color, #888);
  }
  .cal-chip-separator {
    color: var(--divider-color);
    font-size: 8px;
    align-self: center;
    margin: 0 2px;
    line-height: 1;
  }
  .cal-user-filter {
    margin-left: auto;
    padding: 6px 10px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--ms-radius-6, 6px);
    font-size: 13px;
    cursor: pointer;
  }
  .cal-rolling { padding: 8px 16px 32px; }
  .cal-day-row {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--divider-color);
  }
  .cal-day-pill {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border: 1px solid var(--divider-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cal-day-pill.cal-today {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }
  .cal-pill-weekday {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
  }
  .cal-pill-day {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-text-color);
    line-height: 1.1;
  }
  .cal-day-pill.cal-today .cal-pill-weekday,
  .cal-day-pill.cal-today .cal-pill-day {
    color: var(--text-primary-color, #fff);
  }
  .cal-day-content { flex: 1; min-width: 0; }
  .cal-day-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 6px;
  }
  .cal-day-month { color: var(--secondary-text-color); font-size: 13px; }
  .cal-day-today-badge {
    color: var(--primary-color);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .cal-empty {
    color: var(--secondary-text-color);
    font-size: 13px;
    font-style: italic;
    padding: 4px 0 4px;
  }
  .cal-event {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.12s;
  }
  .cal-event:hover { background: var(--state-icon-color, rgba(255,255,255,0.04)); }
  .cal-event-projected { opacity: 0.55; }
  .cal-event-body { flex: 1; min-width: 0; }
  .cal-event-title {
    font-size: 14px;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cal-event-recur {
    display: block;
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }
  .cal-event-icon {
    --mdc-icon-size: 18px;
    flex-shrink: 0;
  }
  .cal-source-time   { color: var(--secondary-text-color); }
  .cal-source-sensor { color: var(--primary-color); }
  .cal-event-prediction {
    display: inline-block;
    font-size: 11px;
    margin-top: 2px;
    padding: 1px 6px;
    border-radius: 999px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border: 1px solid var(--divider-color);
  }
  .cal-conf-high   { color: var(--success-color, #4caf50); border-color: #4caf5044; }
  .cal-conf-medium { color: var(--warning-color, #f9a825); border-color: #f9a82544; }
  .cal-conf-low    { color: var(--error-color, #d32f2f); border-color: #d32f2f44; }
  .cal-event-cost {
    font-size: 12px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }
  .cal-status-pill {
    flex-shrink: 0;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #fff;
  }
  /* Same tokens as .status-badge (status-constants.ts) — the calendar used
     to keep its own palette (triggered was even BLUE here) so identical
     statuses wore different colors per view, and none followed the theme. */
  .cal-status-overdue   { background: var(--error-color, #f44336); }
  .cal-status-triggered { background: var(--deep-orange-color, #ff5722); }
  .cal-status-due_soon  { background: var(--warning-color, #ff9800); color: #000; }
  /* Dark text — white on green is only 2.8:1 (below the 3:1 UI floor). */
  .cal-status-ok        { background: var(--success-color, #4caf50); color: #000; }

  @media (max-width: 600px) {
    .cal-controls { padding: 10px 12px; }
    .cal-rolling { padding: 6px 12px 24px; }
    .cal-day-pill { width: 48px; height: 48px; }
    .cal-pill-day { font-size: 17px; }
    .cal-user-filter { margin-left: 0; width: 100%; }
  }
`;var m=class extends W{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._pastHistory={};this._pastHistorySig="";this._pastSeq=0;this._dataLoaded=!1;this._lastConnection=null;this._statesGate=new J(this);this._onHistorySaved=t=>{let e=t.detail;!e?.entry_id||!e.task_id||!(P(e.entry_id,e.task_id)in this._pastHistory)||(this._pastHistorySig="",this._loadPastHistories())};this._release=null}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(t){if(this._config={...t},this._windowDays=t.window_days&&[7,14,30,365].includes(t.window_days)?t.window_days:30,this._pastDays=t.past_days&&[30,90].includes(t.past_days)?t.past_days:0,this._userFilter=typeof t.user_filter=="string"?t.user_filter:"",typeof t.object_filter=="string")this._objectFilter=t.object_filter,this._configuredObjects=[];else if(Array.isArray(t.object_filter)){let e=t.object_filter.filter(l=>typeof l=="string"&&l!=="");this._objectFilter=e.length===1?e[0]:"",this._configuredObjects=e.length>1?e:[]}else this._objectFilter="",this._configuredObjects=[]}getCardSize(){return 6}get _lang(){return M(this.hass)}connectedCallback(){super.connectedCallback(),window.addEventListener("history-entry-saved",this._onHistorySaved)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("history-entry-saved",this._onHistorySaved),this._release?.(),this._release=null,this._dataLoaded=!1,this._lastConnection=null}shouldUpdate(t){return!this._statesGate.hold(t)}willUpdate(t){super.willUpdate(t),this._statesGate.release(t),t.has("objects")&&this.objects&&(this._objects=this.objects),t.has("stats")&&this.stats&&(this._stats=this.stats,q(this.stats.budget))}updated(t){super.updated(t),it(this,t),this.hass&&this._pastDays>0&&(t.has("_objects")||t.has("_pastDays"))&&this._loadPastHistories(),t.has("hass")&&this.hass&&this.objects===void 0&&(this._dataLoaded?this.hass.connection!==this._lastConnection&&(this._lastConnection=this.hass.connection,this._subscribe(),this._loadData()):(this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe()))}async _loadData(){try{let[t,e]=await Promise.all([Z(this.hass),Q(this.hass,{first:!0})]);this._objects=t,this._stats=e,q(this._stats.budget)}catch{}}async _loadPastHistories(){let t=wt(this._objects,K(),this._pastDays||30),e=t.map(a=>a.sig).join("|");if(e===this._pastHistorySig)return;this._pastHistorySig=e;let l=++this._pastSeq,f=await Promise.all(t.map(async a=>{try{let _=await yt(this.hass,a.entryId,a.taskId);return _?[a.key,_]:null}catch{return null}}));l===this._pastSeq&&(this._pastHistory=Object.fromEntries(f.filter(a=>a!==null)))}_subscribe(){this._release?.(),this._release=V(this.hass.connection,t=>{let e=X(this._objects,t);e!==null&&(this._objects=e)})}_onEventClick(t){if(t.history_timestamp&&tt.includes(String(t.history_type||"completed"))){this._openHistoryEntry(t);return}this._openTask(t)}_openTask(t){let e=new CustomEvent("maintenance-supporter-open-task",{detail:{entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(e)&&(mt(t.entry_id,t.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0})))}async _openHistoryEntry(t){try{let e=await _t(this.hass);if(!ut(this.hass?.user,e.access)){this._openTask(t);return}}catch{}try{let e=await ft(this.hass,t.entry_id,t.task_id,t.history_timestamp);if(!e||gt(e))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return w;let t=this._lang,e=this._config.show_window_chips!==!1,l=this._config.show_user_filter!==!1,f=this._config.title,a=null;this._userFilter&&(a=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let _=s=>{let j=s.toLowerCase();return this._objects.find(S=>S.entry_id===s||S.object.name.toLowerCase()===j)?.entry_id??null},i=new Set(this._configuredObjects.map(_).filter(s=>s!==null)),d=i.size?this._objects.filter(s=>i.has(s.entry_id)):this._objects,r=this._config.show_object_filter!==!1&&d.length>1,n=this._objectFilter?_(this._objectFilter):null,o=n&&d.some(s=>s.entry_id===n)?d.filter(s=>s.entry_id===n):d,g=K(),y=this._pastDays>0,$=y?xt(o,g,this._pastDays,a,this._pastHistory):bt(o,g,this._windowDays,a),b=this._windowDays===365||y,x=b?$.filter(s=>s.events.length>0):$,T=s=>{let j=`cal-status-${s.status}`,O=s.projected?"cal-event-projected":"",S=s.status==="overdue"&&s.days_until_due!=null?` (${rt(s.days_until_due,t)})`:"",D=s.projected&&s.interval_days?h`<span class="cal-event-recur">${s.interval_unit&&s.interval_unit!=="days"?nt(s.interval_days,s.interval_unit,t):s.interval_days===1?c("cal_every_day",t):c("cal_every_n_days",t).replace("{n}",String(s.interval_days))}</span>`:w,H=s.schedule_type==="sensor_based",z=H?h`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${c("cal_source_sensor",t)}" icon="mdi:trending-up"></ha-icon>`:h`<ha-icon class="cal-event-icon cal-source-time"
                title="${s.adaptive_enabled?c("cal_source_time_adaptive",t):c("cal_source_time",t)}"
                icon="${s.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,F=H&&s.prediction_confidence&&s.status!=="triggered"&&!s.projected?h`<span class="cal-event-prediction cal-conf-${s.prediction_confidence}">
            ${c("cal_predicted",t)} · ${c(`cal_confidence_${s.prediction_confidence}`,t)}
          </span>`:w,jt=st(this._stats?.budget),Et=s.history_type?c(s.history_type,t):c(s.status,t);return h`
        <div class="cal-event ${O}"
          @click=${()=>this._onEventClick(s)}>
          ${z}
          <span class="cal-status-pill ${j}">${Et}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${s.object_name} · ${s.task_name}${S}</div>
            ${F}
            ${D}
          </div>
          ${s.avg_cost!=null&&s.avg_cost!==0?h`<span class="cal-event-cost">${at(s.avg_cost,jt,t)}</span>`:w}
        </div>
      `},L=s=>{let[j,O,S]=s.date.split("-").map(Number),D=new Date(j,O-1,S),H=s.date===g,z=ot(D,t,"short"),F=ct(D,t,"long");return h`
        <div class="cal-day-row">
          <div class="cal-day-pill ${H?"cal-today":""}">
            <span class="cal-pill-weekday">${z}</span>
            <span class="cal-pill-day">${D.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${F}</span>
              ${H?h`<span class="cal-day-today-badge">${c("today",t)}</span>`:w}
            </div>
            ${s.events.length===0?h`<div class="cal-empty">${c("cal_no_events",t)}</div>`:s.events.map(T)}
          </div>
        </div>
      `};return h`
      <ha-card .header=${f}>
        ${e||l||r?h`
              <div class="cal-controls">
                ${e?h`
                      <div class="cal-window-chips cal-past-chips" title="${c("cal_past_windows",t)}">
                        ${[30,90].map(s=>h`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===s?"active":""}"
                            @click=${()=>{this._pastDays=s}}>
                            −${s}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${c("cal_forward_windows",t)}">
                        ${[7,14,30,365].map(s=>h`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===s?"active":""}"
                            @click=${()=>{this._windowDays=s,this._pastDays=0}}>
                            ${s===365?"+1y":`+${s}d`}
                          </button>
                        `)}
                      </div>
                    `:w}
                ${l?h`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${s=>{this._userFilter=s.target.value}}>
                        <option value="">${c("all_users",t)}</option>
                        <option value="current_user">${c("my_tasks",t)}</option>
                      </select>
                    `:w}
                ${r?h`
                      <select class="cal-user-filter"
                        .value=${n??""}
                        @change=${s=>{this._objectFilter=s.target.value}}>
                        <option value="">${c("all_objects",t)}</option>
                        ${[...d].sort((s,j)=>s.object.name.localeCompare(j.object.name)).map(s=>h`<option value=${s.entry_id} ?selected=${s.entry_id===n}>${s.object.name}</option>`)}
                      </select>
                    `:w}
              </div>
            `:w}
        <div class="cal-rolling">
          ${x.length===0&&b?h`<div class="cal-empty">${c("cal_no_events",t)}</div>`:x.map(L)}
        </div>
      </ha-card>
    `}};m.styles=[lt,$t,R`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],v([I({attribute:!1})],m.prototype,"hass",2),v([I({attribute:!1})],m.prototype,"objects",2),v([I({attribute:!1})],m.prototype,"stats",2),v([k()],m.prototype,"_config",2),v([k()],m.prototype,"_objects",2),v([k()],m.prototype,"_stats",2),v([k()],m.prototype,"_windowDays",2),v([k()],m.prototype,"_pastDays",2),v([k()],m.prototype,"_userFilter",2),v([k()],m.prototype,"_objectFilter",2),v([k()],m.prototype,"_pastHistory",2);var It=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],Tt=[{value:30,key:"cal_editor_window_past_30"},{value:90,key:"cal_editor_window_past_90"}],C=class extends W{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return M(this.hass)}setConfig(t){this._config={...t}}updated(){let t=this._lang;t&&!Y(t)&&et(t).then(()=>{Y(t)&&this.requestUpdate()})}_valueChanged(t,e){let l={...this._config,[t]:e};t==="show_window_chips"&&e===!0&&delete l.show_window_chips,t==="show_user_filter"&&e===!0&&delete l.show_user_filter,t==="show_object_filter"&&e===!0&&delete l.show_object_filter,t==="title"&&(!e||typeof e=="string"&&e.trim()==="")&&delete l.title,t==="user_filter"&&e===""&&delete l.user_filter,this._emit(l)}_windowChanged(t){let e={...this._config};t.startsWith("past-")?(e.past_days=Number(t.slice(5)),delete e.window_days):(e.window_days=Number(t),delete e.past_days),this._emit(e)}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){let t=this._lang,e=this._config.past_days?`past-${this._config.past_days}`:`${this._config.window_days??30}`,l=this._config.show_window_chips!==!1,f=this._config.show_user_filter!==!1,a=this._config.user_filter??"",_=this._config.title??"";return h`
      <div class="editor">
        <div class="row">
          <label for="title">${c("card_title",t)}</label>
          <input
            id="title"
            type="text"
            .value=${_}
            @input=${i=>this._valueChanged("title",i.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${c("cal_editor_window",t)}</label>
          <select
            id="window"
            @change=${i=>this._windowChanged(i.target.value)}
          >
            ${It.map(i=>h`<option value="${i.value}" ?selected=${`${i.value}`===e}>${c(i.key,t)}</option>`)}
            ${Tt.map(i=>h`<option value="past-${i.value}" ?selected=${`past-${i.value}`===e}>${c(i.key,t)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${c("cal_editor_show_chips",t)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${l}
            @change=${i=>this._valueChanged("show_window_chips",i.target.checked)}
          />
        </div>
        <div class="hint">${c("cal_editor_chips_hint",t)}</div>
        <div class="row toggle">
          <label for="userf">${c("cal_editor_show_user_filter",t)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${f}
            @change=${i=>this._valueChanged("show_user_filter",i.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${c("cal_editor_default_user",t)}</label>
          <select
            id="userv"
            @change=${i=>this._valueChanged("user_filter",i.target.value)}
          >
            <option value="" ?selected=${a===""}>${c("all_users",t)}</option>
            <option value="current_user" ?selected=${a==="current_user"}>
              ${c("cal_editor_my_tasks",t)}
            </option>
          </select>
        </div>
        <div class="row toggle">
          <label for="objf">${c("cal_editor_show_object_filter",t)}</label>
          <input
            id="objf"
            type="checkbox"
            .checked=${this._config.show_object_filter!==!1}
            @change=${i=>this._valueChanged("show_object_filter",i.target.checked)}
          />
        </div>
        <div class="hint">${c("cal_editor_object_hint",t)}</div>
      </div>
    `}};C.styles=R`
    :host { display: block; padding: 8px 0; }
    .editor { display: flex; flex-direction: column; gap: 12px; }
    .row { display: flex; flex-direction: column; gap: 4px; }
    .row.toggle {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    label { font-weight: 500; color: var(--primary-text-color); font-size: 14px; }
    input[type="text"], select {
      padding: 8px;
      font-size: 14px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, black);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
    }
    .hint {
      margin-top: -4px;
      font-size: 12px;
      color: var(--secondary-text-color, #666);
    }
  `,v([I({attribute:!1})],C.prototype,"hass",2),v([k()],C.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",m);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",C);pt(["maintenance-supporter-calendar-card"],import.meta.url);dt({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});export{m as MaintenanceCalendarCard};
