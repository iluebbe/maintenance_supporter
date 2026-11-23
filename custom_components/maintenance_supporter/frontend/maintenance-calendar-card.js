/*! maintenance_supporter frontend 2.125.1 */
import{a as xt,c as kt}from"/maintenance_supporter_cardfiles/card-chunks/chunk-DO7Y7ZRY.js";import{a as Z,c as tt,d as it,e as rt,f as at,g as ot,i as vt,j as wt,k as bt}from"/maintenance_supporter_cardfiles/card-chunks/chunk-Q3VUADRJ.js";import{g as $t,j as jt}from"/maintenance_supporter_cardfiles/card-chunks/chunk-2IMGG7EP.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-VTJ3JX62.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-GA6B77KB.js";import{b as st,e as nt}from"/maintenance_supporter_cardfiles/card-chunks/chunk-4JADZ6IC.js";import{b as U}from"/maintenance_supporter_cardfiles/card-chunks/chunk-M5JTODZN.js";import{e as z}from"/maintenance_supporter_cardfiles/card-chunks/chunk-QHLQAMJF.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-2PMQ5MNY.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-UG2PNIDK.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-5UQPRTU6.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-GBNJ2SUX.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-XEJ7WA5M.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-L6QNMVCX.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-6SDDIQRL.js";import{a as I,b as $}from"/maintenance_supporter_cardfiles/card-chunks/chunk-GYCZ36GF.js";import{B,C as d,D as Y,E as dt,I as K,L as G,N as E,O as pt,P as ut,Q as q,Z as ht,a as x,b as T,e as _,ea as _t,h as k,ia as ft,j as M,m as et,ma as yt,na as mt,q as lt,ta as gt,u as N,v as W,y as ct}from"/maintenance_supporter_cardfiles/card-chunks/chunk-O3WOIMYB.js";var J=5;function zt(r,o){let t=[];for(let e=0;e<o;e++)t.push(E(r,e));return t}function Pt(r){if(!r||r.length===0)return null;let o=r.map(t=>z(t)).filter(t=>t!==null&&t>=0);return o.length===0?null:o.reduce((t,e)=>t+e,0)/o.length}function Q(r){return(r.assignee_pool?.length??0)>=2&&!!r.rotation_strategy}function X(r){return Array.isArray(r.upcoming_turns)?r.upcoming_turns:[]}function Ft(r,o){return Q(r)?X(r).find(t=>t.date===o)?.user_id??null:r.responsible_user_id??null}function Et(r){let{windowStart:o,windowEnd:t,task:e,entryId:i,objectName:h}=r,n=r.limit??J,c=[],a=(l,f)=>({date:l,entry_id:i,task_id:e.id,task_name:e.name,object_name:h,status:f&&W(e.status)?"ok":e.status,days_until_due:f?null:e.days_until_due??null,projected:f,schedule_type:e.schedule_type,interval_days:e.interval_days??null,interval_unit:e.interval_unit??null,responsible_user_id:f?Ft(e,l):e.responsible_user_id??null,avg_cost:Pt(e.history),adaptive_enabled:!!e.adaptive_config?.enabled,prediction_confidence:e.threshold_prediction_confidence??null}),u=Math.max(1,Math.round(bt(e.interval_days,e.interval_unit))),p=l=>typeof l=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(l),v=Array.isArray(e.upcoming_dates)?e.upcoming_dates.filter(p):[],y=v.length||!Q(e)?v:X(e).slice(1).map(l=>l.date).filter(p),m=l=>{for(let f of y){if(c.length>=n)break;f>l&&f>=o&&f<=t&&c.push(a(f,!0))}};if(W(e.status)){if(c.push(a(o,!1)),y.length)return m(o),c;if(e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let l=E(o,u),f=1;for(;l<=t&&f<n;)c.push(a(l,!0)),f++,l=E(l,u)}return c}let g=e.next_due;if(typeof g!="string"||!g)return c;let w=g.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(w))return c;if(w>=o&&w<=t)c.push(a(w,!1));else if(w>t)return c;if(y.length)return m(w),c;if(e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let l=E(w,u),f=c.length;for(;l<=t&&f<n;)l>=o&&(c.push(a(l,!0)),f++),l=E(l,u)}return c}function St(r,o,t,e=null){let i=zt(o,t),h=i[0],n=i[i.length-1],c=[];for(let u of r){let p=u.object?.name||"",v=u.entry_id,y=u.tasks||[];for(let m of y){let g=Q(m);if(e&&!g&&!U(m,e)||m.enabled===!1)continue;if(!(e&&g)){c.push(...Et({windowStart:h,windowEnd:n,task:m,entryId:v,objectName:p}));continue}let w=Et({windowStart:h,windowEnd:n,task:m,entryId:v,objectName:p,limit:Math.max(J,X(m).length)}),l=m.assignee_pool??[];c.push(...w.filter(f=>f.responsible_user_id?f.responsible_user_id===e:l.includes(e)).slice(0,J))}}let a=new Map;for(let u of i)a.set(u,[]);for(let u of c){let p=a.get(u.date);p&&p.push(u)}for(let[,u]of a)u.sort((p,v)=>{let y=N(p.status),m=N(v.status);if(y!==m)return y-m;if(p.projected!==v.projected)return p.projected?1:-1;let g=p.object_name.localeCompare(v.object_name);return g!==0?g:p.task_name.localeCompare(v.task_name)});return i.map(u=>({date:u,events:a.get(u)??[]}))}var Lt={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok",updated:"ok"};function P(r,o){return`${r}/${o}`}function Ct(r,o,t){let e=Dt(o,t)[0],i=[];for(let h of r)for(let n of h.tasks||[]){let c=n.history||[],a=n.history_count??c.length;if(a<=c.length)continue;let u=c.map(y=>G(y?.timestamp)).filter(y=>!!y),p=u.length?u.reduce((y,m)=>y<m?y:m):"";if(p&&p<e)continue;let v=P(h.entry_id,n.id);i.push({entryId:h.entry_id,taskId:n.id,key:v,sig:`${v}:${a}:${Mt(JSON.stringify(c))}`})}return i}function Mt(r){let o=2166136261;for(let t=0;t<r.length;t++)o^=r.charCodeAt(t),o=Math.imul(o,16777619);return(o>>>0).toString(36)}function Dt(r,o){let t=[];for(let e=o-1;e>=0;e--)t.push(E(r,-e));return t}function Ht(r,o,t,e=null,i={}){let h=Dt(o,t),n=h[0],c=h[h.length-1],a=new Map;for(let p of h)a.set(p,[]);for(let p of r){let v=p.object?.name||"",y=p.entry_id,m=p.tasks||[];for(let g of m){if(e&&!U(g,e))continue;let w=i[P(y,g.id)]??(g.history||[]);for(let l of w){if(typeof l?.timestamp!="string")continue;let f=G(l.timestamp);if(!f||f<n||f>c)continue;let R=a.get(f);if(!R)continue;let A=l.type??"completed";R.push({date:f,entry_id:y,task_id:g.id,task_name:g.name,object_name:v,status:Lt[A]??"ok",days_until_due:null,projected:!1,schedule_type:g.schedule_type,interval_days:g.interval_days??null,responsible_user_id:g.responsible_user_id??null,avg_cost:z(l),adaptive_enabled:!!g.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:l.timestamp,history_type:A,history_cost:z(l),history_notes:typeof l.notes=="string"?l.notes:null,history_duration:typeof l.duration=="number"?l.duration:null})}}}let u={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4,updated:5};for(let[,p]of a)p.sort((v,y)=>{let m=u[v.history_type??""]??99,g=u[y.history_type??""]??99;if(m!==g)return m-g;let w=v.object_name.localeCompare(y.object_name);return w!==0?w:v.task_name.localeCompare(y.task_name)});return h.map(p=>({date:p,events:a.get(p)??[]}))}var Tt=T`
  .cal-controls {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    padding: 12px 16px;
    border-bottom: 1px solid var(--divider-color);
    /* The card may be a 350 px column on a 1440 px screen: what follows
       goes by the card's width, not the window's. */
    container-type: inline-size;
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
  /* A hairline between the past and the forward windows. It was a dot the
     size of a full stop, which read as a stray character, most of all
     alone at the end of the first line on a phone. */
  .cal-chip-separator {
    align-self: center;
    width: 1px;
    height: 18px;
    margin: 0 2px;
    background: var(--divider-color);
  }
  .cal-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-left: auto;
    min-width: 0;
  }
  .cal-filters .cal-user-filter { margin-left: 0; }
  /* The filters as the task list's Group by / Sort by chips (panel-styles
     .ms-chip), with Home Assistant's menu: they were the browser's own
     selects, the only controls on the tab that were not HA's. */
  .cal-filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    height: 32px;
    padding: 0 6px 0 12px;
    box-sizing: border-box;
    border: 1px solid var(--outline-color, var(--divider-color));
    border-radius: 10px;
    background: transparent;
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
  }
  .cal-filter-chip span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .cal-filter-chip ha-icon { --mdc-icon-size: 18px; flex: none; color: var(--secondary-text-color); }
  .cal-filter-chip:hover { background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
  .cal-filter-chip:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .cal-filter-chip.active {
    border-color: transparent;
    background: color-mix(in srgb, var(--primary-color) 15%, transparent);
  }
  .cal-filter-chip.active ha-icon { color: var(--primary-color); }
  .cal-filter-menu { min-width: 0; max-width: 100%; }
  .cal-filter-menu ha-dropdown-item.selected { font-weight: 600; }
  @container (max-width: 560px) {
    .cal-chip-separator { display: none; }
    .cal-filters { margin-left: 0; width: 100%; }
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
  .cal-rolling { padding: 8px 16px 32px; container-type: inline-size; }
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
  .cal-event:hover { background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
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
    /* One line: wrapped inside its pill it read as two stacked labels. */
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top;
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
  /* The status as its icon: shown instead of the word on a narrow card. */
  .cal-state-icon { display: none; --mdc-icon-size: 16px; }
  /* Same tokens as .status-badge (status-constants.ts) — the calendar used
     to keep its own palette (triggered was even BLUE here) so identical
     statuses wore different colors per view, and none followed the theme. */
  .cal-status-overdue   { background: var(--error-color, #f44336); }
  .cal-status-triggered { background: var(--deep-orange-color, #ff5722); }
  .cal-status-due_soon  { background: var(--warning-color, #ff9800); color: #000; }
  /* Dark text — white on green is only 2.8:1 (below the 3:1 UI floor). */
  .cal-status-ok        { background: var(--success-color, #4caf50); color: #000; }

  /* A narrow card (a phone, a dashboard column): "Object · Task" on one
     line showed the object and cut the task, so four tasks of one
     dishwasher read as four identical rows. The task leads on its own line
     and may wrap; the object and the overdue days follow underneath. */
  @container (max-width: 560px) {
    .cal-event-title {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      column-gap: 4px;
      overflow: visible;
      white-space: normal;
    }
    .cal-event-sep { display: none; }
    /* A line of its own, before the object it follows in the markup. */
    .cal-event-task { order: -1; flex: 1 1 100%; min-width: 0; overflow-wrap: anywhere; }
    .cal-event-object, .cal-event-due {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    /* The overdue days stay whole: beside the object where both fit, on
       the next line where they do not. In the status' red, without the
       brackets that set them off on one line. */
    .cal-event-object { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .cal-event-due { flex: none; color: var(--error-color, #f44336); }
    .cal-paren { display: none; }
    /* The status as a disc with its icon, like the task list's rows on a
       phone: the word took 76 px of a 286 px row and left the text 170. */
    .cal-status-pill { padding: 3px; border-radius: 50%; line-height: 0; }
    .cal-state-label { display: none; }
    .cal-state-icon { display: block; }
    /* The sensor icon in front already says "predicted". */
    .cal-pred-word { display: none; }
  }

  @media (max-width: 600px) {
    .cal-controls { padding: 10px 12px; }
    .cal-rolling { padding: 6px 12px 24px; }
    .cal-day-pill { width: 48px; height: 48px; }
    .cal-pill-day { font-size: 17px; }
    .cal-user-filter { margin-left: 0; width: 100%; }
  }
`;function It(){return et("ha-dropdown")}var Ut=r=>r.filter(o=>!!o);function Rt(r,o,t={}){let e=Ut(o);return _`
    <ha-dropdown class=${t.cls??""} placement=${t.placement??"bottom-end"}
      @wa-select=${i=>{let h=i.detail?.item,n=e[Number(h?.value??h?.getAttribute("value"))];n&&n!=="divider"&&n.action()}}>
      ${r}
      ${e.map((i,h)=>i==="divider"?_`<wa-divider></wa-divider>`:_`<ha-dropdown-item value=${String(h)} class=${`${i.cls??""}${i.selected?" selected":""}`} variant=${i.danger?"danger":"default"}>
            ${i.icon?_`<ha-icon slot="icon" icon=${i.icon}></ha-icon>`:k}${i.label}
          </ha-dropdown-item>`)}
    </ha-dropdown>`}var b=class extends M{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._pastHistory={};this._pastHistorySig="";this._pastSeq=0;this._follow=new rt(t=>{let e=it(this._objects,t);e!==null&&(this._objects=e)},()=>{this._loadData()});this._statesGate=new Z(this);this._onHistorySaved=t=>{let e=t.detail;!e?.entry_id||!e.task_id||!(P(e.entry_id,e.task_id)in this._pastHistory)||(this._pastHistorySig="",this._loadPastHistories())}}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(t){if(this._config={...t},this._windowDays=t.window_days&&[7,14,30,365].includes(t.window_days)?t.window_days:30,this._pastDays=t.past_days&&[30,90].includes(t.past_days)?t.past_days:0,this._userFilter=typeof t.user_filter=="string"?t.user_filter:"",typeof t.object_filter=="string")this._objectFilter=t.object_filter,this._configuredObjects=[];else if(Array.isArray(t.object_filter)){let e=t.object_filter.filter(i=>typeof i=="string"&&i!=="");this._objectFilter=e.length===1?e[0]:"",this._configuredObjects=e.length>1?e:[]}else this._objectFilter="",this._configuredObjects=[]}getCardSize(){return 6}get _lang(){return B(this.hass)}connectedCallback(){super.connectedCallback(),window.addEventListener("history-entry-saved",this._onHistorySaved)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("history-entry-saved",this._onHistorySaved),this._follow.stop()}shouldUpdate(t){return!this._statesGate.hold(t)}willUpdate(t){super.willUpdate(t),this._statesGate.release(t),t.has("objects")&&this.objects&&(this._objects=this.objects),t.has("stats")&&this.stats&&(this._stats=this.stats,q(this.stats.budget))}updated(t){super.updated(t),ut(this,t),this.hass&&this._pastDays>0&&(t.has("_objects")||t.has("_pastDays"))&&this._loadPastHistories(),t.has("hass")&&this.hass&&this.objects===void 0&&this._follow.sync(this.hass.connection)}async _loadData(){try{let[t,e]=await Promise.all([ot(this.hass),tt(this.hass,{first:!0})]);this._objects=at(this.hass.connection)??t,this._stats=e,q(this._stats.budget)}catch{}}async _loadPastHistories(){let t=Ct(this._objects,K(),this._pastDays||30),e=t.map(n=>n.sig).join("|");if(e===this._pastHistorySig)return;this._pastHistorySig=e;let i=++this._pastSeq,h=await Promise.all(t.map(async n=>{try{let c=await xt(this.hass,n.entryId,n.taskId);return c?[n.key,c]:null}catch{return null}}));i===this._pastSeq&&(this._pastHistory=Object.fromEntries(h.filter(n=>n!==null)))}_onEventClick(t){if(t.history_timestamp&&lt.includes(String(t.history_type||"completed"))){this._openHistoryEntry(t);return}this._openTask(t)}_openTask(t){let e=new CustomEvent("maintenance-supporter-open-task",{detail:{entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(e)&&(jt(t.entry_id,t.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0})))}async _openHistoryEntry(t){try{let e=await nt(this.hass);if(!st(this.hass?.user,e.access)){this._openTask(t);return}}catch{}try{let e=await kt(this.hass,t.entry_id,t.task_id,t.history_timestamp);if(!e||$t(e))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return k;let t=this._lang,e=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,h=this._config.title,n=null;this._userFilter&&(n=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let c=s=>{let C=s.toLowerCase();return this._objects.find(j=>j.entry_id===s||j.object.name.toLowerCase()===C)?.entry_id??null},a=new Set(this._configuredObjects.map(c).filter(s=>s!==null)),u=a.size?this._objects.filter(s=>a.has(s.entry_id)):this._objects,p=this._config.show_object_filter!==!1&&u.length>1,v=this._objectFilter?c(this._objectFilter):null,y=v&&u.some(s=>s.entry_id===v)?u.filter(s=>s.entry_id===v):u,m=K(),g=this._pastDays>0,w=g?Ht(y,m,this._pastDays,n,this._pastHistory):St(y,m,this._windowDays,n),l=this._windowDays===365||g,f=l?w.filter(s=>s.events.length>0):w,R=s=>{let C=`cal-status-${s.status}`,O=s.projected?"cal-event-projected":"",j=s.status==="overdue"&&s.days_until_due!=null?_t(s.days_until_due,t):"",D=s.projected&&s.interval_days?_`<span class="cal-event-recur">${s.interval_unit&&s.interval_unit!=="days"?ft(s.interval_days,s.interval_unit,t):s.interval_days===1?d("cal_every_day",t):d("cal_every_n_days",t).replace("{n}",String(s.interval_days))}</span>`:k,H=s.schedule_type==="sensor_based",F=H?_`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${d("cal_source_sensor",t)}" icon="mdi:trending-up"></ha-icon>`:_`<ha-icon class="cal-event-icon cal-source-time"
                title="${s.adaptive_enabled?d("cal_source_time_adaptive",t):d("cal_source_time",t)}"
                icon="${s.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,L=H&&s.prediction_confidence&&s.status!=="triggered"&&!s.projected?_`<span class="cal-event-prediction cal-conf-${s.prediction_confidence}"><span class="cal-pred-word">${d("cal_predicted",t)} · </span>${d(`cal_confidence_${s.prediction_confidence}`,t)}</span>`:k,Ot=pt(this._stats?.budget),V=s.history_type?d(s.history_type,t):d(s.status,t);return _`
        <div class="cal-event ${O}"
          @click=${()=>this._onEventClick(s)}>
          ${F}
          <span class="cal-status-pill ${C}" title=${V}><ha-icon class="cal-state-icon"
            icon=${ct[s.history_type??s.status]??"mdi:circle-medium"}></ha-icon><span class="cal-state-label">${V}</span></span>
          <div class="cal-event-body">
            <div class="cal-event-title"><span class="cal-event-object">${s.object_name}</span><span class="cal-event-sep"> · </span><span class="cal-event-task">${s.task_name}</span>${j?_`<span class="cal-event-due"><span class="cal-paren"> (</span>${j}<span class="cal-paren">)</span></span>`:k}</div>
            ${L}
            ${D}
          </div>
          ${s.avg_cost!=null&&s.avg_cost!==0?_`<span class="cal-event-cost">${ht(s.avg_cost,Ot,t)}</span>`:k}
        </div>
      `},A=s=>{let[C,O,j]=s.date.split("-").map(Number),D=new Date(C,O-1,j),H=s.date===m,F=yt(D,t,"short"),L=mt(D,t,"long");return _`
        <div class="cal-day-row">
          <div class="cal-day-pill ${H?"cal-today":""}">
            <span class="cal-pill-weekday">${F}</span>
            <span class="cal-pill-day">${D.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${L}</span>
              ${H?_`<span class="cal-day-today-badge">${d("today",t)}</span>`:k}
            </div>
            ${s.events.length===0?_`<div class="cal-empty">${d("cal_no_events",t)}</div>`:s.events.map(R)}
          </div>
        </div>
      `};return _`
      <ha-card .header=${h}>
        ${e||i||p?_`
              <div class="cal-controls">
                ${e?_`
                      <div class="cal-window-chips cal-past-chips" title="${d("cal_past_windows",t)}">
                        ${[30,90].map(s=>_`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===s?"active":""}"
                            @click=${()=>{this._pastDays=s}}>
                            −${At(s,t)}
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true"></span>
                      <div class="cal-window-chips" title="${d("cal_forward_windows",t)}">
                        ${[7,14,30,365].map(s=>_`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===s?"active":""}"
                            @click=${()=>{this._windowDays=s,this._pastDays=0}}>
                            +${At(s,t)}
                          </button>
                        `)}
                      </div>
                    `:k}
                ${i||p?_`<div class="cal-filters">
                      ${i?this._renderUserFilter(t):k}
                      ${p?this._renderObjectFilter(t,u,v):k}
                    </div>`:k}
              </div>
            `:k}
        <div class="cal-rolling">
          ${f.length===0&&l?_`<div class="cal-empty">${d("cal_no_events",t)}</div>`:f.map(A)}
        </div>
      </ha-card>
    `}_renderUserFilter(t){let e=[{value:"",label:d("all_users",t)},{value:"current_user",label:d("my_tasks",t)}];return this._renderFilter(e,this._userFilter,i=>{this._userFilter=i})}_renderObjectFilter(t,e,i){let h=[{value:"",label:d("all_objects",t)},...[...e].sort((n,c)=>n.object.name.localeCompare(c.object.name)).map(n=>({value:n.entry_id,label:n.object.name}))];return this._renderFilter(h,i??"",n=>{this._objectFilter=n})}_renderFilter(t,e,i){if(!It())return _`
        <select class="cal-user-filter" .value=${e}
          @change=${n=>i(n.target.value)}>
          ${t.map(n=>_`<option value=${n.value} ?selected=${n.value===e}>${n.label}</option>`)}
        </select>`;let h=t.find(n=>n.value===e)??t[0];return Rt(_`<button class="cal-filter-chip ${e?"active":""}" slot="trigger" type="button">
        <span>${h.label}</span><ha-icon icon="mdi:menu-down"></ha-icon></button>`,t.map(n=>({label:n.label,selected:n.value===e,action:()=>i(n.value)})),{cls:"cal-filter-menu"})}};b.styles=[gt,Tt,T`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],x([I({attribute:!1})],b.prototype,"hass",2),x([I({attribute:!1})],b.prototype,"objects",2),x([I({attribute:!1})],b.prototype,"stats",2),x([$()],b.prototype,"_config",2),x([$()],b.prototype,"_objects",2),x([$()],b.prototype,"_stats",2),x([$()],b.prototype,"_windowDays",2),x([$()],b.prototype,"_pastDays",2),x([$()],b.prototype,"_userFilter",2),x([$()],b.prototype,"_objectFilter",2),x([$()],b.prototype,"_pastHistory",2);function At(r,o){return r===365?d("chart_range_1y",o):r===7||r===30||r===90?d(`chart_range_${r}d`,o):d("chart_range_7d",o).replace("7",String(r))}var Nt=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],Wt=[{value:30,key:"cal_editor_window_past_30"},{value:90,key:"cal_editor_window_past_90"}],S=class extends M{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return B(this.hass)}setConfig(t){this._config={...t}}updated(){let t=this._lang;t&&!Y(t)&&dt(t).then(()=>{Y(t)&&this.requestUpdate()})}_valueChanged(t,e){let i={...this._config,[t]:e};t==="show_window_chips"&&e===!0&&delete i.show_window_chips,t==="show_user_filter"&&e===!0&&delete i.show_user_filter,t==="show_object_filter"&&e===!0&&delete i.show_object_filter,t==="title"&&(!e||typeof e=="string"&&e.trim()==="")&&delete i.title,t==="user_filter"&&e===""&&delete i.user_filter,this._emit(i)}_windowChanged(t){let e={...this._config};t.startsWith("past-")?(e.past_days=Number(t.slice(5)),delete e.window_days):(e.window_days=Number(t),delete e.past_days),this._emit(e)}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){let t=this._lang,e=this._config.past_days?`past-${this._config.past_days}`:`${this._config.window_days??30}`,i=this._config.show_window_chips!==!1,h=this._config.show_user_filter!==!1,n=this._config.user_filter??"",c=this._config.title??"";return _`
      <div class="editor">
        <div class="row">
          <label for="title">${d("card_title",t)}</label>
          <input
            id="title"
            type="text"
            .value=${c}
            @input=${a=>this._valueChanged("title",a.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${d("cal_editor_window",t)}</label>
          <select
            id="window"
            @change=${a=>this._windowChanged(a.target.value)}
          >
            ${Nt.map(a=>_`<option value="${a.value}" ?selected=${`${a.value}`===e}>${d(a.key,t)}</option>`)}
            ${Wt.map(a=>_`<option value="past-${a.value}" ?selected=${`past-${a.value}`===e}>${d(a.key,t)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${d("cal_editor_show_chips",t)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${i}
            @change=${a=>this._valueChanged("show_window_chips",a.target.checked)}
          />
        </div>
        <div class="hint">${d("cal_editor_chips_hint",t)}</div>
        <div class="row toggle">
          <label for="userf">${d("cal_editor_show_user_filter",t)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${h}
            @change=${a=>this._valueChanged("show_user_filter",a.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${d("cal_editor_default_user",t)}</label>
          <select
            id="userv"
            @change=${a=>this._valueChanged("user_filter",a.target.value)}
          >
            <option value="" ?selected=${n===""}>${d("all_users",t)}</option>
            <option value="current_user" ?selected=${n==="current_user"}>
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
            @change=${a=>this._valueChanged("show_object_filter",a.target.checked)}
          />
        </div>
        <div class="hint">${d("cal_editor_object_hint",t)}</div>
      </div>
    `}};S.styles=T`
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
  `,x([I({attribute:!1})],S.prototype,"hass",2),x([$()],S.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",b);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",S);wt(["maintenance-supporter-calendar-card"],import.meta.url);vt({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});export{b as MaintenanceCalendarCard};
