/*! maintenance_supporter frontend 2.125.0 */
import{a as vt,c as bt}from"/maintenance_supporter_cardfiles/card-chunks/chunk-DA7CIUR6.js";import{a as V,c as Z,d as st,e as it,f as rt,g as nt,i as ft,j as gt,k as mt}from"/maintenance_supporter_cardfiles/card-chunks/chunk-YWVQEXVU.js";import{g as wt,j as kt}from"/maintenance_supporter_cardfiles/card-chunks/chunk-DKLK4MPW.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-E37VMG54.js";import{b as tt,d as et}from"/maintenance_supporter_cardfiles/card-chunks/chunk-QWLYUXAQ.js";import{b as W}from"/maintenance_supporter_cardfiles/card-chunks/chunk-3H5VJZ6U.js";import{e as L}from"/maintenance_supporter_cardfiles/card-chunks/chunk-E52G77GY.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-VLBQNOTD.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-UFHDJ5FW.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-H6XRBNOL.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-TRZCZ3PH.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-77G3E363.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-G4AHMU7H.js";import{a as I,b as $}from"/maintenance_supporter_cardfiles/card-chunks/chunk-QBA6LLCA.js";import{B as M,C as d,D as Y,E as at,I as K,L as G,N as E,O as ct,P as lt,Q as q,Z as dt,a as k,b as R,da as pt,e as m,h as x,ha as ut,j as U,la as _t,ma as ht,q as ot,sa as yt,u as N,v as B}from"/maintenance_supporter_cardfiles/card-chunks/chunk-SG4ABBTH.js";var J=5;function Rt(n,a){let t=[];for(let e=0;e<a;e++)t.push(E(n,e));return t}function It(n){if(!n||n.length===0)return null;let a=n.map(t=>L(t)).filter(t=>t!==null&&t>=0);return a.length===0?null:a.reduce((t,e)=>t+e,0)/a.length}function Q(n){return(n.assignee_pool?.length??0)>=2&&!!n.rotation_strategy}function X(n){return Array.isArray(n.upcoming_turns)?n.upcoming_turns:[]}function Tt(n,a){return Q(n)?X(n).find(t=>t.date===a)?.user_id??null:n.responsible_user_id??null}function xt(n){let{windowStart:a,windowEnd:t,task:e,entryId:p,objectName:v}=n,u=n.limit??J,o=[],i=(r,_)=>({date:r,entry_id:p,task_id:e.id,task_name:e.name,object_name:v,status:_&&B(e.status)?"ok":e.status,days_until_due:_?null:e.days_until_due??null,projected:_,schedule_type:e.schedule_type,interval_days:e.interval_days??null,interval_unit:e.interval_unit??null,responsible_user_id:_?Tt(e,r):e.responsible_user_id??null,avg_cost:It(e.history),adaptive_enabled:!!e.adaptive_config?.enabled,prediction_confidence:e.threshold_prediction_confidence??null}),l=Math.max(1,Math.round(mt(e.interval_days,e.interval_unit))),c=r=>typeof r=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(r),h=Array.isArray(e.upcoming_dates)?e.upcoming_dates.filter(c):[],y=h.length||!Q(e)?h:X(e).slice(1).map(r=>r.date).filter(c),f=r=>{for(let _ of y){if(o.length>=u)break;_>r&&_>=a&&_<=t&&o.push(i(_,!0))}};if(B(e.status)){if(o.push(i(a,!1)),y.length)return f(a),o;if(e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let r=E(a,l),_=1;for(;r<=t&&_<u;)o.push(i(r,!0)),_++,r=E(r,l)}return o}let g=e.next_due;if(typeof g!="string"||!g)return o;let b=g.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(b))return o;if(b>=a&&b<=t)o.push(i(b,!1));else if(b>t)return o;if(y.length)return f(b),o;if(e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let r=E(b,l),_=o.length;for(;r<=t&&_<u;)r>=a&&(o.push(i(r,!0)),_++),r=E(r,l)}return o}function $t(n,a,t,e=null){let p=Rt(a,t),v=p[0],u=p[p.length-1],o=[];for(let l of n){let c=l.object?.name||"",h=l.entry_id,y=l.tasks||[];for(let f of y){let g=Q(f);if(e&&!g&&!W(f,e)||f.enabled===!1)continue;if(!(e&&g)){o.push(...xt({windowStart:v,windowEnd:u,task:f,entryId:h,objectName:c}));continue}let b=xt({windowStart:v,windowEnd:u,task:f,entryId:h,objectName:c,limit:Math.max(J,X(f).length)}),r=f.assignee_pool??[];o.push(...b.filter(_=>_.responsible_user_id?_.responsible_user_id===e:r.includes(e)).slice(0,J))}}let i=new Map;for(let l of p)i.set(l,[]);for(let l of o){let c=i.get(l.date);c&&c.push(l)}for(let[,l]of i)l.sort((c,h)=>{let y=N(c.status),f=N(h.status);if(y!==f)return y-f;if(c.projected!==h.projected)return c.projected?1:-1;let g=c.object_name.localeCompare(h.object_name);return g!==0?g:c.task_name.localeCompare(h.task_name)});return p.map(l=>({date:l,events:i.get(l)??[]}))}var At={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok",updated:"ok"};function P(n,a){return`${n}/${a}`}function jt(n,a,t){let e=Et(a,t)[0],p=[];for(let v of n)for(let u of v.tasks||[]){let o=u.history||[],i=u.history_count??o.length;if(i<=o.length)continue;let l=o.map(y=>G(y?.timestamp)).filter(y=>!!y),c=l.length?l.reduce((y,f)=>y<f?y:f):"";if(c&&c<e)continue;let h=P(v.entry_id,u.id);p.push({entryId:v.entry_id,taskId:u.id,key:h,sig:`${h}:${i}:${Ot(JSON.stringify(o))}`})}return p}function Ot(n){let a=2166136261;for(let t=0;t<n.length;t++)a^=n.charCodeAt(t),a=Math.imul(a,16777619);return(a>>>0).toString(36)}function Et(n,a){let t=[];for(let e=a-1;e>=0;e--)t.push(E(n,-e));return t}function St(n,a,t,e=null,p={}){let v=Et(a,t),u=v[0],o=v[v.length-1],i=new Map;for(let c of v)i.set(c,[]);for(let c of n){let h=c.object?.name||"",y=c.entry_id,f=c.tasks||[];for(let g of f){if(e&&!W(g,e))continue;let b=p[P(y,g.id)]??(g.history||[]);for(let r of b){if(typeof r?.timestamp!="string")continue;let _=G(r.timestamp);if(!_||_<u||_>o)continue;let T=i.get(_);if(!T)continue;let A=r.type??"completed";T.push({date:_,entry_id:y,task_id:g.id,task_name:g.name,object_name:h,status:At[A]??"ok",days_until_due:null,projected:!1,schedule_type:g.schedule_type,interval_days:g.interval_days??null,responsible_user_id:g.responsible_user_id??null,avg_cost:L(r),adaptive_enabled:!!g.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:r.timestamp,history_type:A,history_cost:L(r),history_notes:typeof r.notes=="string"?r.notes:null,history_duration:typeof r.duration=="number"?r.duration:null})}}}let l={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4,updated:5};for(let[,c]of i)c.sort((h,y)=>{let f=l[h.history_type??""]??99,g=l[y.history_type??""]??99;if(f!==g)return f-g;let b=h.object_name.localeCompare(y.object_name);return b!==0?b:h.task_name.localeCompare(y.task_name)});return v.map(c=>({date:c,events:i.get(c)??[]}))}var Dt=R`
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
`;var w=class extends U{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._pastHistory={};this._pastHistorySig="";this._pastSeq=0;this._follow=new it(t=>{let e=st(this._objects,t);e!==null&&(this._objects=e)},()=>{this._loadData()});this._statesGate=new V(this);this._onHistorySaved=t=>{let e=t.detail;!e?.entry_id||!e.task_id||!(P(e.entry_id,e.task_id)in this._pastHistory)||(this._pastHistorySig="",this._loadPastHistories())}}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(t){if(this._config={...t},this._windowDays=t.window_days&&[7,14,30,365].includes(t.window_days)?t.window_days:30,this._pastDays=t.past_days&&[30,90].includes(t.past_days)?t.past_days:0,this._userFilter=typeof t.user_filter=="string"?t.user_filter:"",typeof t.object_filter=="string")this._objectFilter=t.object_filter,this._configuredObjects=[];else if(Array.isArray(t.object_filter)){let e=t.object_filter.filter(p=>typeof p=="string"&&p!=="");this._objectFilter=e.length===1?e[0]:"",this._configuredObjects=e.length>1?e:[]}else this._objectFilter="",this._configuredObjects=[]}getCardSize(){return 6}get _lang(){return M(this.hass)}connectedCallback(){super.connectedCallback(),window.addEventListener("history-entry-saved",this._onHistorySaved)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("history-entry-saved",this._onHistorySaved),this._follow.stop()}shouldUpdate(t){return!this._statesGate.hold(t)}willUpdate(t){super.willUpdate(t),this._statesGate.release(t),t.has("objects")&&this.objects&&(this._objects=this.objects),t.has("stats")&&this.stats&&(this._stats=this.stats,q(this.stats.budget))}updated(t){super.updated(t),lt(this,t),this.hass&&this._pastDays>0&&(t.has("_objects")||t.has("_pastDays"))&&this._loadPastHistories(),t.has("hass")&&this.hass&&this.objects===void 0&&this._follow.sync(this.hass.connection)}async _loadData(){try{let[t,e]=await Promise.all([nt(this.hass),Z(this.hass,{first:!0})]);this._objects=rt(this.hass.connection)??t,this._stats=e,q(this._stats.budget)}catch{}}async _loadPastHistories(){let t=jt(this._objects,K(),this._pastDays||30),e=t.map(u=>u.sig).join("|");if(e===this._pastHistorySig)return;this._pastHistorySig=e;let p=++this._pastSeq,v=await Promise.all(t.map(async u=>{try{let o=await vt(this.hass,u.entryId,u.taskId);return o?[u.key,o]:null}catch{return null}}));p===this._pastSeq&&(this._pastHistory=Object.fromEntries(v.filter(u=>u!==null)))}_onEventClick(t){if(t.history_timestamp&&ot.includes(String(t.history_type||"completed"))){this._openHistoryEntry(t);return}this._openTask(t)}_openTask(t){let e=new CustomEvent("maintenance-supporter-open-task",{detail:{entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(e)&&(kt(t.entry_id,t.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0})))}async _openHistoryEntry(t){try{let e=await et(this.hass);if(!tt(this.hass?.user,e.access)){this._openTask(t);return}}catch{}try{let e=await bt(this.hass,t.entry_id,t.task_id,t.history_timestamp);if(!e||wt(e))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return x;let t=this._lang,e=this._config.show_window_chips!==!1,p=this._config.show_user_filter!==!1,v=this._config.title,u=null;this._userFilter&&(u=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let o=s=>{let j=s.toLowerCase();return this._objects.find(S=>S.entry_id===s||S.object.name.toLowerCase()===j)?.entry_id??null},i=new Set(this._configuredObjects.map(o).filter(s=>s!==null)),l=i.size?this._objects.filter(s=>i.has(s.entry_id)):this._objects,c=this._config.show_object_filter!==!1&&l.length>1,h=this._objectFilter?o(this._objectFilter):null,y=h&&l.some(s=>s.entry_id===h)?l.filter(s=>s.entry_id===h):l,f=K(),g=this._pastDays>0,b=g?St(y,f,this._pastDays,u,this._pastHistory):$t(y,f,this._windowDays,u),r=this._windowDays===365||g,_=r?b.filter(s=>s.events.length>0):b,T=s=>{let j=`cal-status-${s.status}`,O=s.projected?"cal-event-projected":"",S=s.status==="overdue"&&s.days_until_due!=null?` (${pt(s.days_until_due,t)})`:"",C=s.projected&&s.interval_days?m`<span class="cal-event-recur">${s.interval_unit&&s.interval_unit!=="days"?ut(s.interval_days,s.interval_unit,t):s.interval_days===1?d("cal_every_day",t):d("cal_every_n_days",t).replace("{n}",String(s.interval_days))}</span>`:x,H=s.schedule_type==="sensor_based",z=H?m`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${d("cal_source_sensor",t)}" icon="mdi:trending-up"></ha-icon>`:m`<ha-icon class="cal-event-icon cal-source-time"
                title="${s.adaptive_enabled?d("cal_source_time_adaptive",t):d("cal_source_time",t)}"
                icon="${s.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,F=H&&s.prediction_confidence&&s.status!=="triggered"&&!s.projected?m`<span class="cal-event-prediction cal-conf-${s.prediction_confidence}">
            ${d("cal_predicted",t)} · ${d(`cal_confidence_${s.prediction_confidence}`,t)}
          </span>`:x,Ct=ct(this._stats?.budget),Ht=s.history_type?d(s.history_type,t):d(s.status,t);return m`
        <div class="cal-event ${O}"
          @click=${()=>this._onEventClick(s)}>
          ${z}
          <span class="cal-status-pill ${j}">${Ht}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${s.object_name} · ${s.task_name}${S}</div>
            ${F}
            ${C}
          </div>
          ${s.avg_cost!=null&&s.avg_cost!==0?m`<span class="cal-event-cost">${dt(s.avg_cost,Ct,t)}</span>`:x}
        </div>
      `},A=s=>{let[j,O,S]=s.date.split("-").map(Number),C=new Date(j,O-1,S),H=s.date===f,z=_t(C,t,"short"),F=ht(C,t,"long");return m`
        <div class="cal-day-row">
          <div class="cal-day-pill ${H?"cal-today":""}">
            <span class="cal-pill-weekday">${z}</span>
            <span class="cal-pill-day">${C.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${F}</span>
              ${H?m`<span class="cal-day-today-badge">${d("today",t)}</span>`:x}
            </div>
            ${s.events.length===0?m`<div class="cal-empty">${d("cal_no_events",t)}</div>`:s.events.map(T)}
          </div>
        </div>
      `};return m`
      <ha-card .header=${v}>
        ${e||p||c?m`
              <div class="cal-controls">
                ${e?m`
                      <div class="cal-window-chips cal-past-chips" title="${d("cal_past_windows",t)}">
                        ${[30,90].map(s=>m`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===s?"active":""}"
                            @click=${()=>{this._pastDays=s}}>
                            −${s}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${d("cal_forward_windows",t)}">
                        ${[7,14,30,365].map(s=>m`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===s?"active":""}"
                            @click=${()=>{this._windowDays=s,this._pastDays=0}}>
                            ${s===365?"+1y":`+${s}d`}
                          </button>
                        `)}
                      </div>
                    `:x}
                ${p?m`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${s=>{this._userFilter=s.target.value}}>
                        <option value="">${d("all_users",t)}</option>
                        <option value="current_user">${d("my_tasks",t)}</option>
                      </select>
                    `:x}
                ${c?m`
                      <select class="cal-user-filter"
                        .value=${h??""}
                        @change=${s=>{this._objectFilter=s.target.value}}>
                        <option value="">${d("all_objects",t)}</option>
                        ${[...l].sort((s,j)=>s.object.name.localeCompare(j.object.name)).map(s=>m`<option value=${s.entry_id} ?selected=${s.entry_id===h}>${s.object.name}</option>`)}
                      </select>
                    `:x}
              </div>
            `:x}
        <div class="cal-rolling">
          ${_.length===0&&r?m`<div class="cal-empty">${d("cal_no_events",t)}</div>`:_.map(A)}
        </div>
      </ha-card>
    `}};w.styles=[yt,Dt,R`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],k([I({attribute:!1})],w.prototype,"hass",2),k([I({attribute:!1})],w.prototype,"objects",2),k([I({attribute:!1})],w.prototype,"stats",2),k([$()],w.prototype,"_config",2),k([$()],w.prototype,"_objects",2),k([$()],w.prototype,"_stats",2),k([$()],w.prototype,"_windowDays",2),k([$()],w.prototype,"_pastDays",2),k([$()],w.prototype,"_userFilter",2),k([$()],w.prototype,"_objectFilter",2),k([$()],w.prototype,"_pastHistory",2);var Lt=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],Pt=[{value:30,key:"cal_editor_window_past_30"},{value:90,key:"cal_editor_window_past_90"}],D=class extends U{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return M(this.hass)}setConfig(t){this._config={...t}}updated(){let t=this._lang;t&&!Y(t)&&at(t).then(()=>{Y(t)&&this.requestUpdate()})}_valueChanged(t,e){let p={...this._config,[t]:e};t==="show_window_chips"&&e===!0&&delete p.show_window_chips,t==="show_user_filter"&&e===!0&&delete p.show_user_filter,t==="show_object_filter"&&e===!0&&delete p.show_object_filter,t==="title"&&(!e||typeof e=="string"&&e.trim()==="")&&delete p.title,t==="user_filter"&&e===""&&delete p.user_filter,this._emit(p)}_windowChanged(t){let e={...this._config};t.startsWith("past-")?(e.past_days=Number(t.slice(5)),delete e.window_days):(e.window_days=Number(t),delete e.past_days),this._emit(e)}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){let t=this._lang,e=this._config.past_days?`past-${this._config.past_days}`:`${this._config.window_days??30}`,p=this._config.show_window_chips!==!1,v=this._config.show_user_filter!==!1,u=this._config.user_filter??"",o=this._config.title??"";return m`
      <div class="editor">
        <div class="row">
          <label for="title">${d("card_title",t)}</label>
          <input
            id="title"
            type="text"
            .value=${o}
            @input=${i=>this._valueChanged("title",i.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${d("cal_editor_window",t)}</label>
          <select
            id="window"
            @change=${i=>this._windowChanged(i.target.value)}
          >
            ${Lt.map(i=>m`<option value="${i.value}" ?selected=${`${i.value}`===e}>${d(i.key,t)}</option>`)}
            ${Pt.map(i=>m`<option value="past-${i.value}" ?selected=${`past-${i.value}`===e}>${d(i.key,t)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${d("cal_editor_show_chips",t)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${p}
            @change=${i=>this._valueChanged("show_window_chips",i.target.checked)}
          />
        </div>
        <div class="hint">${d("cal_editor_chips_hint",t)}</div>
        <div class="row toggle">
          <label for="userf">${d("cal_editor_show_user_filter",t)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${v}
            @change=${i=>this._valueChanged("show_user_filter",i.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${d("cal_editor_default_user",t)}</label>
          <select
            id="userv"
            @change=${i=>this._valueChanged("user_filter",i.target.value)}
          >
            <option value="" ?selected=${u===""}>${d("all_users",t)}</option>
            <option value="current_user" ?selected=${u==="current_user"}>
              ${d("cal_editor_my_tasks",t)}
            </option>
          </select>
        </div>
        <div class="row toggle">
          <label for="objf">${d("cal_editor_show_object_filter",t)}</label>
          <input
            id="objf"
            type="checkbox"
            .checked=${this._config.show_object_filter!==!1}
            @change=${i=>this._valueChanged("show_object_filter",i.target.checked)}
          />
        </div>
        <div class="hint">${d("cal_editor_object_hint",t)}</div>
      </div>
    `}};D.styles=R`
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
  `,k([I({attribute:!1})],D.prototype,"hass",2),k([$()],D.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",w);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",D);gt(["maintenance-supporter-calendar-card"],import.meta.url);ft({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});export{w as MaintenanceCalendarCard};
