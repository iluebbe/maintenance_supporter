/*! maintenance_supporter frontend 2.120.0 */
import{a as ue,b as j,c as pe,d as he,e as ge,f as me,g as _e,j as ve,n as Me}from"/maintenance_supporter_cardfiles/card-chunks/chunk-ZPJXKJIS.js";import{a as L,b as B,c as K,d as X,e as Y,f as Q,g as J,h as A,i as Z,j as be,k as D,l as ye}from"/maintenance_supporter_cardfiles/card-chunks/chunk-Y7ZYRGYJ.js";import{c as Re,e as Pe,j as Se}from"/maintenance_supporter_cardfiles/card-chunks/chunk-SRIVWKGV.js";import{a as H,b as $e,c as Ce}from"/maintenance_supporter_cardfiles/card-chunks/chunk-QRSJOG6S.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-HFQXNDTQ.js";import{b as Te,c as Ee,d as De}from"/maintenance_supporter_cardfiles/card-chunks/chunk-CJ35NRON.js";import{a as we,b as xe,c as ke}from"/maintenance_supporter_cardfiles/card-chunks/chunk-4LVBX3SV.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-OC6FHQ42.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-NKW4AASI.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-OQXWV5KA.js";import{b as fe}from"/maintenance_supporter_cardfiles/card-chunks/chunk-5UPOSW6L.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-OVK3PTDC.js";import{a as w,c as de}from"/maintenance_supporter_cardfiles/card-chunks/chunk-Q44WUMQF.js";import{b as I}from"/maintenance_supporter_cardfiles/card-chunks/chunk-T6SP4KIH.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-XC6HOU7M.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-YV22LRFJ.js";import{a as E,b as _}from"/maintenance_supporter_cardfiles/card-chunks/chunk-OYEWBM6G.js";import{J as ne,K as ae,L as re,U as oe,X as O,_ as le,a as g,b as C,e as r,h as p,j as T,ja as ce,o as ee,p as z,r as te,s as ie,w as P,x as n,z as se}from"/maintenance_supporter_cardfiles/card-chunks/chunk-VJB3IP3X.js";function Le(o){let l=o?.trigger_config;return!l||l.auto_complete_on_recovery!==!0||o?.trigger_active!==!0?!1:l.type==="state_change"?(l.trigger_target_changes??1)===1&&!!(l.trigger_from_state||l.trigger_to_state):l.type==="threshold"||l.type==="due_date"||l.type==="compound"}function Ae(o){return(o.tags||[]).includes("photo")}var je={"maintenance-supporter-card":[null,"picker_desc_card"],"maintenance-supporter-calendar-card":["picker_name_calendar","picker_desc_calendar"],"maintenance-supporter-panel-card":["picker_name_panel","picker_desc_panel"],"maintenance-budget-section-card":["picker_name_budget","picker_desc_budget"],"maintenance-groups-section-card":["picker_name_groups","picker_desc_groups"],"maintenance-vacation-section-card":["picker_name_vacation","picker_desc_vacation"],"maintenance-battery-fleet-card":["picker_name_battery_fleet","picker_desc_battery_fleet"],"maintenance-supporter":[null,"picker_desc_dashboard"],"maintenance-supporter-section":["picker_name_section","picker_desc_section"],"maintenance-supporter-vacation":["picker_name_vacation_status","picker_desc_vacation_status"],"maintenance-supporter-budget":["picker_name_budget_status","picker_desc_budget_status"],"maintenance-supporter-groups":["picker_name_groups","picker_desc_groups_status"]},F=new WeakMap;function He(o){let l=window;for(let e of[...be(),...l.customStrategies??[]]){let t=je[e.type];if(!t)continue;F.has(e)||F.set(e,{name:e.name,description:e.description});let i=F.get(e),[c,a]=t;c&&(e.name=n(c,o,i.name)),e.description=n(a,o,i.description)}}function N(){let o=0,l=()=>{let e=document.querySelector("home-assistant")?.hass;if(e?.language){let t=e.language;se(t).then(()=>He(t));return}++o<60&&setTimeout(l,1e3)};l()}function Oe(o){let l=(o??[]).filter(e=>!!e);return l.length?r`<span class="event-titles"> · ${l.join(", ")}</span>`:p}function Ne(o){return o?r`<span class="event-titles trigger-detail"> · ${o}</span>`:p}function ze(o,l,e="last-done"){let t=le(o,l);return t?r`<span class="${e}" title="${n("last_performed",l)}: ${oe(o,l)}">${t}</span>`:null}var M=class extends T{constructor(){super(...arguments);this._statesGate=new L(this);this._config={type:"custom:maintenance-battery-fleet-card"}}shouldUpdate(e){return!this._statesGate.hold(e)}willUpdate(e){super.willUpdate(e),this._statesGate.release(e)}static getStubConfig(){return{type:"custom:maintenance-battery-fleet-card"}}setConfig(e){this._config=e}connectedCallback(){super.connectedCallback(),import("/maintenance_supporter_cardfiles/card-chunks/battery-fleet-section-G5HTIZ6E.js")}getCardSize(){return 6}render(){return this.hass?r`
      <ha-card .header=${this._config.title||void 0}>
        <div class="content">
          <maintenance-battery-fleet-section flat .hass=${this.hass}></maintenance-battery-fleet-section>
        </div>
      </ha-card>
    `:p}};M.styles=C`
    ha-card {
      overflow: hidden;
    }
    .content {
      padding: 12px 16px 14px;
    }
  `,g([E({attribute:!1})],M.prototype,"hass",2),g([_()],M.prototype,"_config",2);customElements.get("maintenance-battery-fleet-card")||customElements.define("maintenance-battery-fleet-card",M);D({type:"maintenance-battery-fleet-card",name:"Battery Fleet",description:"All tracked batteries: what is low now, what runs out soon, and what to buy.",preview:!1});var V=["today","dashboard","calendar","settings"];var R="maintenance-supporter-panel-card",U="maintenance-supporter-panel",G="maintenance-supporter",q=870,Fe=320,Ve=480;function Ue(o){let e=o?.panels?.[G]?.config?._panel_custom?.module_url;return typeof e=="string"&&e.startsWith("/")?e:null}function qe(o){if(o==null||o===""||o==="fill")return null;if(typeof o=="number")return o>0?`${Math.round(o)}px`:null;let l=String(o).trim();return/^\d+(\.\d+)?$/.test(l)?`${l}px`:l||null}var W=class extends HTMLElement{constructor(){super();this._config={type:`custom:${R}`};this._panel=null;this._loading=null;this._observer=null;this._lastWidth=-1;this._preview=!1;this._onResize=()=>this._layout(!0);let e=this.attachShadow({mode:"open"}),t=document.createElement("style");t.textContent=`
      :host { display: block; box-sizing: border-box; overflow: hidden; border-radius: var(--ha-card-border-radius, 12px); }
      .status { padding: 16px; color: var(--secondary-text-color); font-size: 14px; }
      ${U} { display: block; height: 100%; }
    `,e.appendChild(t),this._status=document.createElement("div"),this._status.className="status",this._status.hidden=!0,e.appendChild(this._status)}static getConfigElement(){return document.createElement("maintenance-supporter-panel-card-editor")}static getStubConfig(){return{type:`custom:${R}`}}set preview(e){this._preview=!!e,this._layout(!0)}get preview(){return this._preview}_inEditorPreview(){if(this._preview)return!0;let e=this;for(let t=0;e&&t<40;t++){let i=e;if(i.tagName==="HUI-CARD-PREVIEW"||i.tagName==="HUI-DIALOG-EDIT-CARD")return!0;e=i.parentElement??i.getRootNode().host??null}return!1}setConfig(e){this._config={...e},this._panel&&(this._panel.presets=this._presets()),this._layout(!0)}getCardSize(){return 12}getGridOptions(){return{columns:"full",rows:"auto"}}set hass(e){this._hass=e,this._panel?this._panel.hass=e:this._mount()}get hass(){return this._hass}connectedCallback(){typeof ResizeObserver<"u"&&!this._observer&&(this._observer=new ResizeObserver(()=>this._layout(!1)),this._observer.observe(this)),window.addEventListener("resize",this._onResize),this._layout(!0),this._hass&&this._mount()}disconnectedCallback(){this._observer?.disconnect(),this._observer=null,window.removeEventListener("resize",this._onResize)}_presets(){let e={};return V.includes(this._config.tab??"")&&(e.tab=this._config.tab),typeof this._config.view=="string"&&this._config.view.trim()&&(e.view=this._config.view.trim()),e}_setStatus(e){this._status.textContent=e,this._status.hidden=!1}async _mount(){if(this._panel||this._loading||!this._hass||!this.isConnected)return;let e=P(this._hass);if(!customElements.get(U)){let i=Ue(this._hass);if(!i){this._setStatus(n("panel_card_not_registered",e));return}this._loading=import(i).then(()=>{},()=>{throw this._setStatus(n("panel_card_load_failed",e)),new Error("panel bundle failed to load")});try{await this._loading}catch{return}finally{this._loading=null}if(this._panel||!this._hass||!this.isConnected)return}let t=document.createElement(U);t.embedded=!0,t.panel=this._hass.panels?.[G]??{url_path:G},t.presets=this._presets(),t.narrow=this._narrow(),t.hass=this._hass,this._status.hidden=!0,this.shadowRoot.appendChild(t),this._panel=t,this._layout(!0)}_narrow(){let e=this.getBoundingClientRect().width;return e>0?e<q:window.innerWidth<q}_layout(e){let t=this.getBoundingClientRect(),i=Math.round(t.width)!==this._lastWidth;if(!e&&!i)return;this._lastWidth=Math.round(t.width),this._panel&&t.width>0&&(this._panel.narrow=t.width<q);let c=qe(this._config.height);if(c){this.style.height=c;return}if(!this.isConnected)return;if(this._inEditorPreview()){this.style.height=`${Ve}px`;return}let a=Math.max(0,this._unscrolledTop(t)),d=Math.max(Fe,Math.floor(window.innerHeight-a));this.style.height=`${d}px`}_unscrolledTop(e){let t=e.top+window.scrollY,i=this.ownerDocument,c=this.parentElement??this.getRootNode().host??null;for(let a=0;c&&a<100;a++){let d=c;d!==i.documentElement&&d!==i.body&&typeof d.scrollTop=="number"&&d.scrollTop>0&&(t+=d.scrollTop),c=d.parentElement??d.getRootNode().host??null}return t}},x=class extends T{constructor(){super(...arguments);this._config={type:`custom:${R}`};this._views=[];this._viewsLoaded=!1}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._viewsLoaded&&(this._viewsLoaded=!0,this._loadViews())}async _loadViews(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._views=e?.views||[]}catch{this._views=[]}}_set(e,t){let i={...this._config};t===""||t===void 0?delete i[e]:i[e]=t,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let e=P(this.hass),t=i=>n(i==="today"?"tab_today":i==="calendar"?"tab_calendar":i,e);return r`
      <div class="editor">
        <div class="field">
          <div class="field-label">${n("panel_card_tab",e)}</div>
          <select class="tab-select" .value=${this._config.tab||""} @change=${i=>this._set("tab",i.target.value)}>
            <option value="" ?selected=${!this._config.tab}>${n("panel_card_tab_default",e)}</option>
            ${V.map(i=>r`<option value=${i} ?selected=${this._config.tab===i}>${t(i)}</option>`)}
          </select>
        </div>
        ${this._views.length>0?r`<div class="field">
              <div class="field-label">${n("panel_card_view",e)}</div>
              <select class="view-select" .value=${this._config.view||""} @change=${i=>this._set("view",i.target.value)}>
                <option value="" ?selected=${!this._config.view}>${n("card_saved_view_none",e)}</option>
                ${this._views.map(i=>r`<option value=${i.id} ?selected=${this._config.view===i.id||this._config.view===i.name}>${i.name}</option>`)}
              </select>
            </div>`:p}
        <div class="field">
          <div class="field-label">${n("panel_card_height",e)}</div>
          <input class="height-input" type="text" placeholder="fill"
            .value=${this._config.height===void 0?"":String(this._config.height)}
            @change=${i=>this._set("height",i.target.value.trim())} />
          <div class="field-help">${n("panel_card_height_help",e)}</div>
        </div>
      </div>
    `}};x.styles=C`
    .editor { display: flex; flex-direction: column; gap: 16px; padding: 16px; }
    input.height-input { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; box-sizing: border-box; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 13px; color: var(--secondary-text-color); font-weight: 500; }
    .field-help { font-size: 12px; color: var(--secondary-text-color); }
    select { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; }
  `,g([E({attribute:!1})],x.prototype,"hass",2),g([_()],x.prototype,"_config",2),g([_()],x.prototype,"_views",2);customElements.get(R)||customElements.define(R,W);customElements.get("maintenance-supporter-panel-card-editor")||customElements.define("maintenance-supporter-panel-card-editor",x);D({type:R,name:"Maintenance Supporter \u2014 Panel",description:"The complete Maintenance Supporter panel as a card \u2014 for a panel view / dashboard subview without the sidebar entry.",preview:!1});N();var Ie=2,f=class extends T{constructor(){super(...arguments);this._statesGate=new L(this);this._config={type:"custom:maintenance-supporter-card"};this._globalRowStyle="buttons_compact";this._settings=Ee;this._firstLoadDone=!1;this._objects=[];this._stats=null;this._viewFilters=null;this._userNames={};this._userPersons={};this._userService=null;this._userNamesLoaded=!1;this._taskDocs={};this._docsLoadedFor=new Set;this._dataLoaded=!1;this._lastConnection=null;this._release=null;this._onCompleted=async e=>{await this._loadData();let t=e.detail;t?.undo&&I(this,this.hass,t,this._lang,()=>{this._loadData()})}}shouldUpdate(e){return!this._statesGate.hold(e)}willUpdate(e){super.willUpdate(e),this._statesGate.release(e)}get _lang(){return P(this.hass)}static async getConfigElement(){return await import("/maintenance_supporter_cardfiles/card-chunks/maintenance-card-editor-OAHVTSK5.js"),document.createElement("maintenance-supporter-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-card",show_header:!0,show_actions:!0,filter_status:[...ee],max_items:10}}setConfig(e){let t=e.view_id!==this._config.view_id;this._config=e,t&&this._dataLoaded&&this.hass&&this._loadViewFilters()}getCardSize(){return 3}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._release?.(),this._release=null,this._dataLoaded=!1,this._lastConnection=null}updated(e){super.updated(e),ae(this,e),this.hass&&!this._userNamesLoaded&&this._config.show_assignee!==!1&&this._objects.some(t=>t.tasks.some(i=>A(i).length>0))&&this._loadUserNames(),this._loadMissingDocuments(),e.has("hass")&&this.hass&&(this._dataLoaded?this.hass.connection!==this._lastConnection&&(this._lastConnection=this.hass.connection,this._subscribe(),this._loadData()):(this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe()))}async _loadData(){De(this.hass).then(i=>{this._settings=i,this._globalRowStyle=i.rowActionStyle}).catch(()=>{});let e=this._loadViewFilters(),t=!this._firstLoadDone;t&&this.hass&&this._config.show_assignee!==!1&&!this._userNamesLoaded&&this._loadUserNames();try{let[i,c]=await Promise.all([t?J(this.hass):B(this.hass),K(this.hass,{first:t})]);await e,this._objects=t&&Q(this.hass.connection)||i,this._loadMissingDocuments(),this._stats=c,re(this._stats.budget)}catch{}await e,this._firstLoadDone=!0}_assigneeName(e){return this._config.show_assignee===!1?"":A(e).map(t=>this._userNames[t]).filter(Boolean).join(", ")}_assigneeAvatars(e){return xe(A(e).map(t=>this._userPersons[t]))}async _loadUserNames(){this._userNamesLoaded=!0,this._userService?this._userService.updateHass(this.hass):this._userService=new ke(this.hass);try{let e=await this._userService.getUsers();this._userPersons=Object.fromEntries(e.map(t=>[t.id,we(t)])),this._userNames=Object.fromEntries(e.map(t=>[t.id,t.name]))}catch{}}_loadMissingDocuments(){if(!this.hass||this._config.show_documents===!1)return;let e=this._objects.filter(t=>!this._docsLoadedFor.has(t.entry_id)&&t.tasks.some(i=>(i.document_count??0)>0));e.length&&this._loadDocuments(e)}async _loadDocuments(e){for(let a of e)this._docsLoadedFor.add(a.entry_id);let t=a=>this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",...a}),i={...this._taskDocs};for(let a of e)i[a.entry_id]={};let c=(a,d)=>{if(!Ae(d))for(let m of d.task_ids||[])(i[a][m]||=[]).push({id:d.id,title:d.title,kind:d.kind,url:d.url})};try{let a=await t({entry_ids:e.map(m=>m.entry_id)}),d=new Map(e.map(m=>[m.object.id,m.entry_id]));for(let m of a.documents||[]){let b=d.get(m.object_id??"");b&&c(b,m)}}catch{await Promise.all(e.map(async a=>{try{for(let d of(await t({entry_id:a.entry_id})).documents||[])c(a.entry_id,d)}catch{}}))}this._taskDocs=i}_docsFor(e,t){if(this._config.show_documents===!1)return[];let c=[...this._taskDocs[e]?.[t.id]||[]];return t.documentation_url&&c.push({id:`url:${t.id}`,title:n("documentation_label",this._lang),kind:"weblink",url:t.documentation_url}),c}_renderDocChips(e,t){let i=this._docsFor(e,t);if(!i.length)return p;let c=i.slice(Ie);return r`<div class="doc-chips">
      ${i.slice(0,Ie).map(a=>r`
        <button
          type="button"
          class="doc-chip"
          title="${a.title}"
          @click=${d=>{d.stopPropagation(),this._openDoc(a)}}
        >
          <ha-svg-icon .path=${a.kind==="weblink"?ge:he}></ha-svg-icon>
          <span>${a.title}</span>
        </button>
      `)}
      ${c.length?r`<span class="doc-chip doc-more" title="${c.map(a=>a.title).join(`
`)}">+${c.length}</span>`:p}
    </div>`}async _openDoc(e){if(e.kind==="weblink"&&e.url){ve(e.url)&&window.open(e.url,"_blank","noopener");return}try{await fe(this.hass,e.id)}catch{}}async _loadViewFilters(){if(!this._config.view_id){this._viewFilters=null;return}try{let t=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"})).views||[]).find(i=>i.id===this._config.view_id);this._viewFilters=t?t.filters:null}catch{this._viewFilters=null}}_subscribe(){this._release?.(),this._release=Y(this.hass.connection,e=>{let t=X(this._objects,e);t!==null&&(this._objects=t)})}get _selectedTasks(){let e=[],{filter_status:t,filter_objects:i,entity_ids:c,filter_due_min_days:a,filter_due_max_days:d,filter_labels:m,filter_priority:b,filter_areas:k}=this._config,$=c?.length?new Set(c):null,y=a!==void 0||d!==void 0,h=this._viewFilters,S=h?.user_id==="current_user"?this.hass.user?.id??null:h?.user_id??null;for(let s of this._objects)if(!(h?.place&&(s.object.place||"home")!==h.place)&&!(i?.length&&!i.includes(s.entry_id)&&!i.includes(s.object.name))){if(k?.length){let u=s.object.area_id;if(!u||!k.includes(u))continue}for(let u of s.tasks)if(!u.is_done&&!(u.archived||s.object.archived)&&!(t?.length&&!t.includes(u.status))&&!(m?.length&&!(u.labels||[]).some(v=>m.includes(v)))&&!(b?.length&&!b.includes(u.priority||"normal"))&&!($&&!(u.sensor_entity_id&&$.has(u.sensor_entity_id)||u.binary_sensor_entity_id&&$.has(u.binary_sensor_entity_id)))){if(y){let v=u.days_until_due;if(v==null||a!==void 0&&v<a||d!==void 0&&v>d)continue}h&&(h.status&&u.status!==h.status||h.label&&!(u.labels||[]).includes(h.label)||h.priority&&(u.priority||"normal")!==h.priority||S&&!Z(u,S))||e.push({entry_id:s.entry_id,object_name:s.object.name,task:u})}}return e.sort((s,u)=>{let v=z(s.task.status)-z(u.task.status);return v!==0?v:(s.task.days_until_due??1/0)-(u.task.days_until_due??1/0)}),e}_openComplete(e,t,i=!1){if(!i&&w(t)){this._quickComplete(e,t);return}let c=()=>{let a=this.shadowRoot.querySelector("maintenance-complete-dialog");Ce(a,$e({entryId:e,taskId:t.id,taskName:t.name,task:t,objects:this._objects,lang:this._lang,features:this._settings.features,currencySymbol:ne(this._stats?.budget),partsCostMode:this._settings.partsCostMode}),this._lang)};customElements.get("maintenance-complete-dialog")?c():import("/maintenance_supporter_cardfiles/card-chunks/complete-dialog-4VN4HNWI.js").then(c)}async _quickComplete(e,t){let i=await de(this.hass,e,t.id,this._lang);if(i.result==="dialog"){this._openComplete(e,t,!0);return}if(i.result==="failed"||i.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:i.message},bubbles:!0,composed:!0}));return}await this._loadData(),i.undo?I(this,this.hass,{entryId:e,taskId:t.id,taskName:t.name},this._lang,()=>{this._loadData()}):this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:n("quick_complete_success",this._lang)},bubbles:!0,composed:!0}))}_headerCounts(e){let t={overdue:0,due_soon:0,triggered:0};for(let{task:i}of e)te(i.status)&&(t[i.status]+=1);return t}_openTaskDetail(e,t){Se(e,t)}render(){let e=this._lang,t=this._config.title||n("maintenance",e),i=this._config.show_header!==!1,c=(this._config.action_style??(this._globalRowStyle==="icons"?"icons":"buttons"))==="buttons",a=this._config.show_actions!==!1,d=(this._config.show_create??a)&&Te(this.hass?.user,this._settings.access),m=this._config.compact||!1,b=this._selectedTasks,{max_items:k}=this._config,$=k&&k>0?b.slice(0,k):b,y=this._objects.length||this._stats?this._headerCounts(b):null;return r`
      <ha-card>
        <div class="card-header">
          <h1>${t}</h1>
          <div class="header-right">
            ${i&&y?r`
                  <div class="header-stats">
                    ${y.overdue>0?r`<span class="badge overdue">${y.overdue}</span>`:p}
                    ${y.due_soon>0?r`<span class="badge due_soon">${y.due_soon}</span>`:p}
                    ${y.triggered>0?r`<span class="badge triggered">${y.triggered}</span>`:p}
                  </div>
                `:p}
            ${d?r`
                  <button type="button" class="row-icon-btn hdr-add" title="${n("new_object",e)}" aria-label=${n("new_object",e)}
                    @click=${()=>Re()}><ha-svg-icon .path=${_e}></ha-svg-icon></button>
                  <button type="button" class="row-icon-btn hdr-add" title="${n("add_task",e)}" aria-label=${n("add_task",e)}
                    @click=${()=>Pe("",this._objects)}><ha-svg-icon .path=${me}></ha-svg-icon></button>
                `:p}
          </div>
        </div>
        ${this._firstLoadDone?$.length===0?this._objects.some(h=>h.tasks.length>0)?r`<div class="empty-card">
                <!-- (#86) tasks exist but none match the filter (default:
                     actionable-only) — "all caught up", NOT "no tasks yet". -->
                <div class="all-caught-up">✓ ${n("card_all_caught_up",e)}</div>
              </div>`:r`<div class="empty-card">
                <div>${n("card_no_tasks_title",e)}</div>
                <a class="empty-link" href="/maintenance-supporter">${n("card_no_tasks_cta",e)}</a>
              </div>`:r`
              <div class="task-list ${m?"compact":""}">
                ${$.map(({entry_id:h,object_name:S,task:s})=>r`
                    <div class="task-item clickable"
                         @click=${()=>this._openTaskDetail(h,s.id)}
                         title="${n("open_task",e)}">
                      <div class="status-dot" style="background: ${Me(s)}"></div>
                      <div class="task-info">
                        <div class="task-name">
                          ${m&&this._assigneeName(s)?r`<span class="compact-assignee" title="${this._assigneeName(s)}">${this._assigneeAvatars(s)}</span>`:p}${s.name}${Oe(s.next_event_titles)}${Ne(s.trigger_detail)}
                          ${s.due_override?r`<ha-svg-icon
                                class="postponed-icon"
                                .path=${ue}
                                title="${n("postponed",e)}"
                              ></ha-svg-icon>`:p}
                        </div>
                        ${m?p:r`<div class="task-meta">
                              ${S} · ${n(s.type,e)}${H(s)?r` · ${H(s)}`:p}${this._assigneeName(s)?r` · <span class="assignee"
                                    >${this._assigneeAvatars(s)}${this._assigneeName(s)}</span
                                  >`:p}
                            </div>`}
                      </div>
                      ${this._renderDocChips(h,s)}
                      <div class="task-due">
                        ${s.days_until_due!==null&&s.days_until_due!==void 0?s.days_until_due<0?r`<span class="overdue-text">${O(s.days_until_due,e)}</span>`:O(s.days_until_due,e):s.trigger_active?"\u26A1":ze(s.last_performed,e)??"\u2014"}
                      </div>
                      ${a&&ie(s)?r`<span class="inert-label">${n(s.enabled===!1?"disabled":"paused",e)}</span>`:a&&Le(s)?r`<span class="inert-label" title=${n("completes_itself_help",e)}>${n("completes_itself",e)}</span>`:a&&c?r`
                            <ha-button
                              size="small"
                              appearance="accent"
                              variant="success"
                              class="complete-btn-text"
                              title="${w(s)?n("qr_action_quick_complete",e):n("complete",e)}"
                              @click=${u=>{u.stopPropagation(),this._openComplete(h,s)}}
                            >
                              <ha-svg-icon slot="start" .path=${j}></ha-svg-icon>${n("complete",e)}
                            </ha-button>
                          `:a?r`
                            <!-- A plain button drawn like an ha-icon-button, which is
                                 far too heavy to create per row (perf 2026-11-05: a card
                                 of 163 tasks made 165 of them and 616 ha-icon). -->
                            <button
                              type="button"
                              class="row-icon-btn complete-btn${w(s)?" quick":""}"
                              title="${w(s)?n("qr_action_quick_complete",e):n("complete",e)}"
                              aria-label=${w(s)?n("qr_action_quick_complete",e):n("complete",e)}
                              @click=${u=>{u.stopPropagation(),this._openComplete(h,s)}}
                            ><!-- #233: an open circle to tick off; a check read as done already --><ha-svg-icon
                              .path=${w(s)?pe:j}></ha-svg-icon></button>
                          `:p}
                    </div>
                  `)}
              </div>
            `:r`<div class="card-loading">${n("loading",e)}</div>`}
      </ha-card>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onCompleted}
      ></maintenance-complete-dialog>
    `}};f.styles=[ce,C`
      ha-card { overflow: hidden; }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 16px 8px;
      }

      .card-header h1 { margin: 0; font-size: 18px; font-weight: 500; }
      .header-right { display: flex; align-items: center; gap: 6px; }
      .header-stats { display: flex; gap: 6px; }
      .hdr-add {
        display: inline-flex;
        --ha-icon-button-size: 32px;
        --mdc-icon-size: 20px;
        color: var(--primary-color);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        height: 22px;
        border-radius: 11px;
        font-size: 12px;
        font-weight: 600;
        color: white;
        padding: 0 6px;
      }

      .badge.overdue { background: var(--error-color, #f44336); }
      .badge.due_soon { background: var(--warning-color, #ff9800); }
      .badge.triggered { background: #ff5722; }

      .card-loading {
        padding: 24px 16px;
        text-align: center;
        color: var(--secondary-text-color);
      }
      .empty-card {
        padding: 24px 16px;
        text-align: center;
        color: var(--secondary-text-color);
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
      }
      .empty-link {
        color: var(--primary-color);
        text-decoration: none;
        font-size: 13px;
      }
      .empty-link:hover { text-decoration: underline; }
      .all-caught-up { color: var(--success-color, #4caf50); font-weight: 500; }
      /* The list measures itself: a dashboard column on a wide screen needs
         the narrow row layout as much as a phone does. */
      .task-list { padding: 0 16px 16px; container: ms-tasks / inline-size; }

      .task-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .task-item:last-child { border-bottom: none; }
      .task-list.compact .task-item { padding: 4px 0; }
      /* Row click opens the task editor (in-place via the strategy bundle's
         ll-custom handler). Hover state hints that the row is interactive. */
      .task-item.clickable { cursor: pointer; transition: background 0.12s; }
      .task-item.clickable:hover {
        background: var(--state-icon-color, rgba(255,255,255,0.04));
      }

      .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
      .task-info { flex: 1; min-width: 0; }
      .task-name { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .postponed-icon { --mdc-icon-size: 14px; color: var(--secondary-text-color); vertical-align: text-bottom; margin-inline-start: 4px; }
      .task-meta { font-size: 12px; color: var(--secondary-text-color); }
      .assignee, .compact-assignee {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        vertical-align: middle;
      }
      .assignee .person-avatar, .compact-assignee .person-avatar { width: 16px; height: 16px; font-size: 8.5px; }
      /* #234: compact rows have no meta line — the person sits before the
         task as their avatar (the name in the tooltip), so a row stays one
         line. */
      .compact-assignee {
        margin-inline-end: 6px;
      }
      /* #234: Complete sized to a compact row */
      .task-list.compact .complete-btn {
        --ha-icon-button-size: 28px;
      }
      .task-list.compact .complete-btn-text {
        --ha-button-height: 28px;
        --wa-form-control-padding-inline: 8px;
        min-width: 0;
      }

      /* One line of chips that shrinks before the name does; a chip's label
         ends in an ellipsis (on the span — a flex button clips its text
         without one). */
      .doc-chips {
        display: flex;
        flex: 0 1 auto;
        min-width: 0;
        max-width: 40%;
        gap: 4px;
        overflow: hidden;
      }
      .doc-chip {
        display: inline-flex;
        align-items: center;
        flex: 0 1 auto;
        min-width: 0;
        gap: 3px;
        max-width: 22ch;
        padding: 1px 6px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: var(--ms-radius-10, 10px);
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        font-size: 11px;
        cursor: pointer;
        white-space: nowrap;
      }
      .doc-chip span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
      .doc-chip:hover { color: var(--primary-color); border-color: var(--primary-color); }
      .doc-chip ha-svg-icon { --mdc-icon-size: 12px; width: 12px; height: 12px; flex: none; }
      .doc-more { flex: none; }
      /* Narrow (a phone, a dashboard column): the chips get a line of their
         own under the task. Beside it, three of them left the task's name
         one letter wide and broke its object and type over three lines. */
      @container ms-tasks (max-width: 600px) {
        .task-item { flex-wrap: wrap; row-gap: 2px; }
        .doc-chips {
          order: 1;
          flex: 1 0 100%;
          max-width: none;
          box-sizing: border-box;
          padding-inline-start: 20px;
        }
      }
      /* nowrap: the due label is localized via formatDueDays ("5 d overdue",
         "5 T überfällig") — without it a narrow phone card wraps that onto a
         second line and the row grows taller. The name column ellipsizes
         instead, which it already does by design. */
      .task-due { font-size: 13px; color: var(--secondary-text-color); min-width: 40px; text-align: right; white-space: nowrap; }
      .overdue-text { color: var(--error-color); font-weight: 500; }

      .complete-btn {
        display: inline-flex;
        --ha-icon-button-size: 32px;
        --mdc-icon-size: 18px;
        color: var(--primary-color);
      }
      /* DESIGN PROTOTYPE (#145): action_style: buttons — HA-native labelled button. */
      .complete-btn-text { --ha-button-font-size: 13px; flex: none; white-space: nowrap; }
      .complete-btn-text ha-svg-icon { --mdc-icon-size: 18px; }
      /* In the button's place on a task nothing may be done to (paused, off). */
      .inert-label { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; flex: none; }
    `],g([E({attribute:!1})],f.prototype,"hass",2),g([_()],f.prototype,"_config",2),g([_()],f.prototype,"_globalRowStyle",2),g([_()],f.prototype,"_settings",2),g([_()],f.prototype,"_firstLoadDone",2),g([_()],f.prototype,"_objects",2),g([_()],f.prototype,"_stats",2),g([_()],f.prototype,"_viewFilters",2),g([_()],f.prototype,"_userNames",2),g([_()],f.prototype,"_taskDocs",2);customElements.get("maintenance-supporter-card")||customElements.define("maintenance-supporter-card",f);D({type:"maintenance-supporter-card",name:"Maintenance Supporter",description:"Overview of your maintenance tasks with quick actions.",preview:!0});N();ye(["maintenance-supporter-card","maintenance-battery-fleet-card","maintenance-supporter-panel-card"],import.meta.url);export{f as MaintenanceSupporterCard};
