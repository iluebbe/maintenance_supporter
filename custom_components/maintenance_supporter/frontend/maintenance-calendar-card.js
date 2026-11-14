/*! maintenance_supporter frontend 2.121.0 */
import{a as ft,c as gt}from"/maintenance_supporter_cardfiles/card-chunks/chunk-APU27NUH.js";import{a as Q,c as X,d as V,e as Z,g as tt,i as W,k as pt,l as ut,m as yt}from"/maintenance_supporter_cardfiles/card-chunks/chunk-7SOTQIWX.js";import{g as mt,j as vt}from"/maintenance_supporter_cardfiles/card-chunks/chunk-XPKQXY4B.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-YTSEHMU2.js";import{b as _t,d as ht}from"/maintenance_supporter_cardfiles/card-chunks/chunk-F5G3J7KQ.js";import{e as L}from"/maintenance_supporter_cardfiles/card-chunks/chunk-7CBKCMSU.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-E5MLVT4N.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-WQ4EPGFN.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-ZFF2BTRF.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-W5RH6LVB.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-ZPSYSN2J.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-CAKUGV4A.js";import{a as I,b as k}from"/maintenance_supporter_cardfiles/card-chunks/chunk-E4ABH5J2.js";import{D as K,G,I as E,J as it,K as rt,L as q,U as at,_ as nt,a as v,b as R,ca as ot,e as f,ga as ct,h as w,ha as lt,j as U,l as et,na as dt,p as N,q as B,w as M,x as c,y as Y,z as st}from"/maintenance_supporter_cardfiles/card-chunks/chunk-WAUYZK63.js";var J=5;function St(y,l){let t=[];for(let e=0;e<l;e++)t.push(E(y,e));return t}function Ct(y){if(!y||y.length===0)return null;let l=y.map(t=>L(t)).filter(t=>t!==null&&t>=0);return l.length===0?null:l.reduce((t,e)=>t+e,0)/l.length}function Dt(y){let{windowStart:l,windowEnd:t,task:e,entryId:d,objectName:g}=y,r=[],h=(a,n)=>({date:a,entry_id:d,task_id:e.id,task_name:e.name,object_name:g,status:n&&B(e.status)?"ok":e.status,days_until_due:n?null:e.days_until_due??null,projected:n,schedule_type:e.schedule_type,interval_days:e.interval_days??null,interval_unit:e.interval_unit??null,responsible_user_id:e.responsible_user_id??null,avg_cost:Ct(e.history),adaptive_enabled:!!e.adaptive_config?.enabled,prediction_confidence:e.threshold_prediction_confidence??null}),i=Math.max(1,Math.round(yt(e.interval_days,e.interval_unit))),p=Array.isArray(e.upcoming_dates)?e.upcoming_dates.filter(a=>typeof a=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(a)):[],o=a=>{for(let n of p){if(r.length>=J)break;n>a&&n>=l&&n<=t&&r.push(h(n,!0))}};if(B(e.status)){if(r.push(h(l,!1)),p.length)return o(l),r;if(e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let a=E(l,i),n=1;for(;a<=t&&n<J;)r.push(h(a,!0)),n++,a=E(a,i)}return r}let _=e.next_due;if(typeof _!="string"||!_)return r;let u=_.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(u))return r;if(u>=l&&u<=t)r.push(h(u,!1));else if(u>t)return r;if(p.length)return o(u),r;if(e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let a=E(u,i),n=r.length;for(;a<=t&&n<J;)a>=l&&(r.push(h(a,!0)),n++),a=E(a,i)}return r}function bt(y,l,t,e=null){let d=St(l,t),g=d[0],r=d[d.length-1],h=[];for(let p of y){let o=p.object?.name||"",_=p.entry_id,u=p.tasks||[];for(let a of u){if(e&&!W(a,e)||a.enabled===!1)continue;let n=Dt({windowStart:g,windowEnd:r,task:a,entryId:_,objectName:o});h.push(...n)}}let i=new Map;for(let p of d)i.set(p,[]);for(let p of h){let o=i.get(p.date);o&&o.push(p)}for(let[,p]of i)p.sort((o,_)=>{let u=N(o.status),a=N(_.status);if(u!==a)return u-a;if(o.projected!==_.projected)return o.projected?1:-1;let n=o.object_name.localeCompare(_.object_name);return n!==0?n:o.task_name.localeCompare(_.task_name)});return d.map(p=>({date:p,events:i.get(p)??[]}))}var Ht={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok",updated:"ok"};function P(y,l){return`${y}/${l}`}function wt(y,l,t){let e=kt(l,t)[0],d=[];for(let g of y)for(let r of g.tasks||[]){let h=r.history||[],i=r.history_count??h.length;if(i<=h.length)continue;let p=h.map(u=>G(u?.timestamp)).filter(u=>!!u),o=p.length?p.reduce((u,a)=>u<a?u:a):"";if(o&&o<e)continue;let _=P(g.entry_id,r.id);d.push({entryId:g.entry_id,taskId:r.id,key:_,sig:`${_}:${i}:${Rt(JSON.stringify(h))}`})}return d}function Rt(y){let l=2166136261;for(let t=0;t<y.length;t++)l^=y.charCodeAt(t),l=Math.imul(l,16777619);return(l>>>0).toString(36)}function kt(y,l){let t=[];for(let e=l-1;e>=0;e--)t.push(E(y,-e));return t}function xt(y,l,t,e=null,d={}){let g=kt(l,t),r=g[0],h=g[g.length-1],i=new Map;for(let o of g)i.set(o,[]);for(let o of y){let _=o.object?.name||"",u=o.entry_id,a=o.tasks||[];for(let n of a){if(e&&!W(n,e))continue;let $=d[P(u,n.id)]??(n.history||[]);for(let b of $){if(typeof b?.timestamp!="string")continue;let x=G(b.timestamp);if(!x||x<r||x>h)continue;let T=i.get(x);if(!T)continue;let A=b.type??"completed";T.push({date:x,entry_id:u,task_id:n.id,task_name:n.name,object_name:_,status:Ht[A]??"ok",days_until_due:null,projected:!1,schedule_type:n.schedule_type,interval_days:n.interval_days??null,responsible_user_id:n.responsible_user_id??null,avg_cost:L(b),adaptive_enabled:!!n.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:b.timestamp,history_type:A,history_cost:L(b),history_notes:typeof b.notes=="string"?b.notes:null,history_duration:typeof b.duration=="number"?b.duration:null})}}}let p={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4,updated:5};for(let[,o]of i)o.sort((_,u)=>{let a=p[_.history_type??""]??99,n=p[u.history_type??""]??99;if(a!==n)return a-n;let $=_.object_name.localeCompare(u.object_name);return $!==0?$:_.task_name.localeCompare(u.task_name)});return g.map(o=>({date:o,events:i.get(o)??[]}))}var $t=R`
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
`;var m=class extends U{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._pastHistory={};this._pastHistorySig="";this._pastSeq=0;this._follow=new Z(t=>{let e=V(this._objects,t);e!==null&&(this._objects=e)},()=>{this._loadData()});this._statesGate=new Q(this);this._onHistorySaved=t=>{let e=t.detail;!e?.entry_id||!e.task_id||!(P(e.entry_id,e.task_id)in this._pastHistory)||(this._pastHistorySig="",this._loadPastHistories())}}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(t){if(this._config={...t},this._windowDays=t.window_days&&[7,14,30,365].includes(t.window_days)?t.window_days:30,this._pastDays=t.past_days&&[30,90].includes(t.past_days)?t.past_days:0,this._userFilter=typeof t.user_filter=="string"?t.user_filter:"",typeof t.object_filter=="string")this._objectFilter=t.object_filter,this._configuredObjects=[];else if(Array.isArray(t.object_filter)){let e=t.object_filter.filter(d=>typeof d=="string"&&d!=="");this._objectFilter=e.length===1?e[0]:"",this._configuredObjects=e.length>1?e:[]}else this._objectFilter="",this._configuredObjects=[]}getCardSize(){return 6}get _lang(){return M(this.hass)}connectedCallback(){super.connectedCallback(),window.addEventListener("history-entry-saved",this._onHistorySaved)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("history-entry-saved",this._onHistorySaved),this._follow.stop()}shouldUpdate(t){return!this._statesGate.hold(t)}willUpdate(t){super.willUpdate(t),this._statesGate.release(t),t.has("objects")&&this.objects&&(this._objects=this.objects),t.has("stats")&&this.stats&&(this._stats=this.stats,q(this.stats.budget))}updated(t){super.updated(t),rt(this,t),this.hass&&this._pastDays>0&&(t.has("_objects")||t.has("_pastDays"))&&this._loadPastHistories(),t.has("hass")&&this.hass&&this.objects===void 0&&this._follow.sync(this.hass.connection)}async _loadData(){try{let[t,e]=await Promise.all([tt(this.hass),X(this.hass,{first:!0})]);this._objects=t,this._stats=e,q(this._stats.budget)}catch{}}async _loadPastHistories(){let t=wt(this._objects,K(),this._pastDays||30),e=t.map(r=>r.sig).join("|");if(e===this._pastHistorySig)return;this._pastHistorySig=e;let d=++this._pastSeq,g=await Promise.all(t.map(async r=>{try{let h=await ft(this.hass,r.entryId,r.taskId);return h?[r.key,h]:null}catch{return null}}));d===this._pastSeq&&(this._pastHistory=Object.fromEntries(g.filter(r=>r!==null)))}_onEventClick(t){if(t.history_timestamp&&et.includes(String(t.history_type||"completed"))){this._openHistoryEntry(t);return}this._openTask(t)}_openTask(t){let e=new CustomEvent("maintenance-supporter-open-task",{detail:{entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(e)&&(vt(t.entry_id,t.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0})))}async _openHistoryEntry(t){try{let e=await ht(this.hass);if(!_t(this.hass?.user,e.access)){this._openTask(t);return}}catch{}try{let e=await gt(this.hass,t.entry_id,t.task_id,t.history_timestamp);if(!e||mt(e))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return w;let t=this._lang,e=this._config.show_window_chips!==!1,d=this._config.show_user_filter!==!1,g=this._config.title,r=null;this._userFilter&&(r=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let h=s=>{let j=s.toLowerCase();return this._objects.find(S=>S.entry_id===s||S.object.name.toLowerCase()===j)?.entry_id??null},i=new Set(this._configuredObjects.map(h).filter(s=>s!==null)),p=i.size?this._objects.filter(s=>i.has(s.entry_id)):this._objects,o=this._config.show_object_filter!==!1&&p.length>1,_=this._objectFilter?h(this._objectFilter):null,u=_&&p.some(s=>s.entry_id===_)?p.filter(s=>s.entry_id===_):p,a=K(),n=this._pastDays>0,$=n?xt(u,a,this._pastDays,r,this._pastHistory):bt(u,a,this._windowDays,r),b=this._windowDays===365||n,x=b?$.filter(s=>s.events.length>0):$,T=s=>{let j=`cal-status-${s.status}`,O=s.projected?"cal-event-projected":"",S=s.status==="overdue"&&s.days_until_due!=null?` (${nt(s.days_until_due,t)})`:"",D=s.projected&&s.interval_days?f`<span class="cal-event-recur">${s.interval_unit&&s.interval_unit!=="days"?ot(s.interval_days,s.interval_unit,t):s.interval_days===1?c("cal_every_day",t):c("cal_every_n_days",t).replace("{n}",String(s.interval_days))}</span>`:w,H=s.schedule_type==="sensor_based",z=H?f`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${c("cal_source_sensor",t)}" icon="mdi:trending-up"></ha-icon>`:f`<ha-icon class="cal-event-icon cal-source-time"
                title="${s.adaptive_enabled?c("cal_source_time_adaptive",t):c("cal_source_time",t)}"
                icon="${s.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,F=H&&s.prediction_confidence&&s.status!=="triggered"&&!s.projected?f`<span class="cal-event-prediction cal-conf-${s.prediction_confidence}">
            ${c("cal_predicted",t)} · ${c(`cal_confidence_${s.prediction_confidence}`,t)}
          </span>`:w,jt=it(this._stats?.budget),Et=s.history_type?c(s.history_type,t):c(s.status,t);return f`
        <div class="cal-event ${O}"
          @click=${()=>this._onEventClick(s)}>
          ${z}
          <span class="cal-status-pill ${j}">${Et}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${s.object_name} · ${s.task_name}${S}</div>
            ${F}
            ${D}
          </div>
          ${s.avg_cost!=null&&s.avg_cost!==0?f`<span class="cal-event-cost">${at(s.avg_cost,jt,t)}</span>`:w}
        </div>
      `},A=s=>{let[j,O,S]=s.date.split("-").map(Number),D=new Date(j,O-1,S),H=s.date===a,z=ct(D,t,"short"),F=lt(D,t,"long");return f`
        <div class="cal-day-row">
          <div class="cal-day-pill ${H?"cal-today":""}">
            <span class="cal-pill-weekday">${z}</span>
            <span class="cal-pill-day">${D.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${F}</span>
              ${H?f`<span class="cal-day-today-badge">${c("today",t)}</span>`:w}
            </div>
            ${s.events.length===0?f`<div class="cal-empty">${c("cal_no_events",t)}</div>`:s.events.map(T)}
          </div>
        </div>
      `};return f`
      <ha-card .header=${g}>
        ${e||d||o?f`
              <div class="cal-controls">
                ${e?f`
                      <div class="cal-window-chips cal-past-chips" title="${c("cal_past_windows",t)}">
                        ${[30,90].map(s=>f`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===s?"active":""}"
                            @click=${()=>{this._pastDays=s}}>
                            −${s}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${c("cal_forward_windows",t)}">
                        ${[7,14,30,365].map(s=>f`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===s?"active":""}"
                            @click=${()=>{this._windowDays=s,this._pastDays=0}}>
                            ${s===365?"+1y":`+${s}d`}
                          </button>
                        `)}
                      </div>
                    `:w}
                ${d?f`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${s=>{this._userFilter=s.target.value}}>
                        <option value="">${c("all_users",t)}</option>
                        <option value="current_user">${c("my_tasks",t)}</option>
                      </select>
                    `:w}
                ${o?f`
                      <select class="cal-user-filter"
                        .value=${_??""}
                        @change=${s=>{this._objectFilter=s.target.value}}>
                        <option value="">${c("all_objects",t)}</option>
                        ${[...p].sort((s,j)=>s.object.name.localeCompare(j.object.name)).map(s=>f`<option value=${s.entry_id} ?selected=${s.entry_id===_}>${s.object.name}</option>`)}
                      </select>
                    `:w}
              </div>
            `:w}
        <div class="cal-rolling">
          ${x.length===0&&b?f`<div class="cal-empty">${c("cal_no_events",t)}</div>`:x.map(A)}
        </div>
      </ha-card>
    `}};m.styles=[dt,$t,R`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],v([I({attribute:!1})],m.prototype,"hass",2),v([I({attribute:!1})],m.prototype,"objects",2),v([I({attribute:!1})],m.prototype,"stats",2),v([k()],m.prototype,"_config",2),v([k()],m.prototype,"_objects",2),v([k()],m.prototype,"_stats",2),v([k()],m.prototype,"_windowDays",2),v([k()],m.prototype,"_pastDays",2),v([k()],m.prototype,"_userFilter",2),v([k()],m.prototype,"_objectFilter",2),v([k()],m.prototype,"_pastHistory",2);var It=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],Tt=[{value:30,key:"cal_editor_window_past_30"},{value:90,key:"cal_editor_window_past_90"}],C=class extends U{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return M(this.hass)}setConfig(t){this._config={...t}}updated(){let t=this._lang;t&&!Y(t)&&st(t).then(()=>{Y(t)&&this.requestUpdate()})}_valueChanged(t,e){let d={...this._config,[t]:e};t==="show_window_chips"&&e===!0&&delete d.show_window_chips,t==="show_user_filter"&&e===!0&&delete d.show_user_filter,t==="show_object_filter"&&e===!0&&delete d.show_object_filter,t==="title"&&(!e||typeof e=="string"&&e.trim()==="")&&delete d.title,t==="user_filter"&&e===""&&delete d.user_filter,this._emit(d)}_windowChanged(t){let e={...this._config};t.startsWith("past-")?(e.past_days=Number(t.slice(5)),delete e.window_days):(e.window_days=Number(t),delete e.past_days),this._emit(e)}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){let t=this._lang,e=this._config.past_days?`past-${this._config.past_days}`:`${this._config.window_days??30}`,d=this._config.show_window_chips!==!1,g=this._config.show_user_filter!==!1,r=this._config.user_filter??"",h=this._config.title??"";return f`
      <div class="editor">
        <div class="row">
          <label for="title">${c("card_title",t)}</label>
          <input
            id="title"
            type="text"
            .value=${h}
            @input=${i=>this._valueChanged("title",i.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${c("cal_editor_window",t)}</label>
          <select
            id="window"
            @change=${i=>this._windowChanged(i.target.value)}
          >
            ${It.map(i=>f`<option value="${i.value}" ?selected=${`${i.value}`===e}>${c(i.key,t)}</option>`)}
            ${Tt.map(i=>f`<option value="past-${i.value}" ?selected=${`past-${i.value}`===e}>${c(i.key,t)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${c("cal_editor_show_chips",t)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${d}
            @change=${i=>this._valueChanged("show_window_chips",i.target.checked)}
          />
        </div>
        <div class="hint">${c("cal_editor_chips_hint",t)}</div>
        <div class="row toggle">
          <label for="userf">${c("cal_editor_show_user_filter",t)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${g}
            @change=${i=>this._valueChanged("show_user_filter",i.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${c("cal_editor_default_user",t)}</label>
          <select
            id="userv"
            @change=${i=>this._valueChanged("user_filter",i.target.value)}
          >
            <option value="" ?selected=${r===""}>${c("all_users",t)}</option>
            <option value="current_user" ?selected=${r==="current_user"}>
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
  `,v([I({attribute:!1})],C.prototype,"hass",2),v([k()],C.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",m);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",C);ut(["maintenance-supporter-calendar-card"],import.meta.url);pt({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});export{m as MaintenanceCalendarCard};
