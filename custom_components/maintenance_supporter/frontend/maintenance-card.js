/*! maintenance_supporter frontend 2.125.1 */
import{a as ve,b as z,c as be,d as ye,e as we,f as xe,g as ke,j as Ce,l as Re,m as Se,q as Ie}from"/maintenance_supporter_cardfiles/card-chunks/chunk-EGVLJWJF.js";import{a as A,b as q,c as B,d as J,e as Z,f as ee,g as te,h as Te,i as M,j as Ee}from"/maintenance_supporter_cardfiles/card-chunks/chunk-Q3VUADRJ.js";import{c as Oe,e as Ne,j as ze}from"/maintenance_supporter_cardfiles/card-chunks/chunk-2IMGG7EP.js";import{a as j,b as Ae,c as Le}from"/maintenance_supporter_cardfiles/card-chunks/chunk-VTJ3JX62.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-UZQUZTIU.js";import{b as K,c as X,d as Y,e as Q}from"/maintenance_supporter_cardfiles/card-chunks/chunk-4JADZ6IC.js";import{c as fe,d as Me,e as Pe,f as De}from"/maintenance_supporter_cardfiles/card-chunks/chunk-SKIQ3WDW.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-GB3UOTNU.js";import{a as L,b as ie}from"/maintenance_supporter_cardfiles/card-chunks/chunk-M5JTODZN.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-QHLQAMJF.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-2PMQ5MNY.js";import{b as $e}from"/maintenance_supporter_cardfiles/card-chunks/chunk-FVM4IX2W.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-5UQPRTU6.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-GBNJ2SUX.js";import{a as w,c as _e}from"/maintenance_supporter_cardfiles/card-chunks/chunk-XEJ7WA5M.js";import{b as ge,c as me}from"/maintenance_supporter_cardfiles/card-chunks/chunk-L6QNMVCX.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-HWCRCQMQ.js";import"/maintenance_supporter_cardfiles/card-chunks/chunk-6SDDIQRL.js";import{a as E,b as _}from"/maintenance_supporter_cardfiles/card-chunks/chunk-GYCZ36GF.js";import{$ as de,B as R,C as a,E as re,O as oe,P as le,Q as ce,a as h,b as C,ba as ue,e as r,ea as I,h as u,ha as pe,j as T,t as se,ta as he,u as N,w as ne,x as ae}from"/maintenance_supporter_cardfiles/card-chunks/chunk-O3WOIMYB.js";function je(d){return(d.tags||[]).includes("photo")}var Ue={"maintenance-supporter-card":[null,"picker_desc_card"],"maintenance-supporter-calendar-card":["picker_name_calendar","picker_desc_calendar"],"maintenance-supporter-panel-card":["picker_name_panel","picker_desc_panel"],"maintenance-budget-section-card":["picker_name_budget","picker_desc_budget"],"maintenance-groups-section-card":["picker_name_groups","picker_desc_groups"],"maintenance-vacation-section-card":["picker_name_vacation","picker_desc_vacation"],"maintenance-battery-fleet-card":["picker_name_battery_fleet","picker_desc_battery_fleet"],"maintenance-supporter":[null,"picker_desc_dashboard"],"maintenance-supporter-section":["picker_name_section","picker_desc_section"],"maintenance-supporter-vacation":["picker_name_vacation_status","picker_desc_vacation_status"],"maintenance-supporter-budget":["picker_name_budget_status","picker_desc_budget_status"],"maintenance-supporter-groups":["picker_name_groups","picker_desc_groups_status"]},F=new WeakMap;function Ve(d){let g=window;for(let e of[...Te(),...g.customStrategies??[]]){let t=Ue[e.type];if(!t)continue;F.has(e)||F.set(e,{name:e.name,description:e.description});let i=F.get(e),[o,n]=t;o&&(e.name=a(o,d,i.name)),e.description=a(n,d,i.description)}}function O(){let d=0,g=()=>{let e=document.querySelector("home-assistant")?.hass;if(e?.language){let t=e.language;re(t).then(()=>Ve(t));return}++d<60&&setTimeout(g,1e3)};g()}function Fe(d,g,e="last-done"){let t=pe(d,g);return t?r`<span class="${e}" title="${a("last_performed",g)}: ${ue(d,g)}">${t}</span>`:null}var P=class extends T{constructor(){super(...arguments);this._statesGate=new A(this);this._config={type:"custom:maintenance-battery-fleet-card"}}shouldUpdate(e){return!this._statesGate.hold(e)}willUpdate(e){super.willUpdate(e),this._statesGate.release(e)}static getStubConfig(){return{type:"custom:maintenance-battery-fleet-card"}}setConfig(e){this._config=e}connectedCallback(){super.connectedCallback(),import("/maintenance_supporter_cardfiles/card-chunks/battery-fleet-section-POG3AXXM.js")}getCardSize(){return 6}render(){return this.hass?r`
      <ha-card .header=${this._config.title||void 0}>
        <div class="content">
          <maintenance-battery-fleet-section flat .hass=${this.hass}></maintenance-battery-fleet-section>
        </div>
      </ha-card>
    `:u}};P.styles=C`
    ha-card {
      overflow: hidden;
    }
    .content {
      padding: 12px 16px 14px;
    }
  `,h([E({attribute:!1})],P.prototype,"hass",2),h([_()],P.prototype,"_config",2);customElements.get("maintenance-battery-fleet-card")||customElements.define("maintenance-battery-fleet-card",P);M({type:"maintenance-battery-fleet-card",name:"Battery Fleet",description:"All tracked batteries: what is low now, what runs out soon, and what to buy.",preview:!1});var H=["today","dashboard","calendar","settings"];var D="maintenance-supporter-panel-card",U="maintenance-supporter-panel",G="maintenance-supporter",V=870,Ge=320,We=480;function qe(d){let e=d?.panels?.[G]?.config?._panel_custom?.module_url;return typeof e=="string"&&e.startsWith("/")?e:null}function Be(d){if(d==null||d===""||d==="fill")return null;if(typeof d=="number")return d>0?`${Math.round(d)}px`:null;let g=String(d).trim();return/^\d+(\.\d+)?$/.test(g)?`${g}px`:g||null}var W=class extends HTMLElement{constructor(){super();this._config={type:`custom:${D}`};this._panel=null;this._loading=null;this._observer=null;this._lastWidth=-1;this._preview=!1;this._onResize=()=>this._layout(!0);let e=this.attachShadow({mode:"open"}),t=document.createElement("style");t.textContent=`
      :host { display: block; box-sizing: border-box; overflow: hidden; border-radius: var(--ha-card-border-radius, 12px); }
      .status { padding: 16px; color: var(--secondary-text-color); font-size: 14px; }
      ${U} { display: block; height: 100%; }
    `,e.appendChild(t),this._status=document.createElement("div"),this._status.className="status",this._status.hidden=!0,e.appendChild(this._status)}static getConfigElement(){return document.createElement("maintenance-supporter-panel-card-editor")}static getStubConfig(){return{type:`custom:${D}`}}set preview(e){this._preview=!!e,this._layout(!0)}get preview(){return this._preview}_inEditorPreview(){if(this._preview)return!0;let e=this;for(let t=0;e&&t<40;t++){let i=e;if(i.tagName==="HUI-CARD-PREVIEW"||i.tagName==="HUI-DIALOG-EDIT-CARD")return!0;e=i.parentElement??i.getRootNode().host??null}return!1}setConfig(e){this._config={...e},this._panel&&(this._panel.presets=this._presets()),this._layout(!0)}getCardSize(){return 12}getGridOptions(){return{columns:"full",rows:"auto"}}set hass(e){this._hass=e,this._panel?this._panel.hass=e:this._mount()}get hass(){return this._hass}connectedCallback(){typeof ResizeObserver<"u"&&!this._observer&&(this._observer=new ResizeObserver(()=>this._layout(!1)),this._observer.observe(this)),window.addEventListener("resize",this._onResize),this._layout(!0),this._hass&&this._mount()}disconnectedCallback(){this._observer?.disconnect(),this._observer=null,window.removeEventListener("resize",this._onResize)}_presets(){let e={};return H.includes(this._config.tab??"")&&(e.tab=this._config.tab),typeof this._config.view=="string"&&this._config.view.trim()&&(e.view=this._config.view.trim()),e}_setStatus(e){this._status.textContent=e,this._status.hidden=!1}async _mount(){if(this._panel||this._loading||!this._hass||!this.isConnected)return;let e=R(this._hass);if(!customElements.get(U)){let i=qe(this._hass);if(!i){this._setStatus(a("panel_card_not_registered",e));return}this._loading=import(i).then(()=>{},()=>{throw this._setStatus(a("panel_card_load_failed",e)),new Error("panel bundle failed to load")});try{await this._loading}catch{return}finally{this._loading=null}if(this._panel||!this._hass||!this.isConnected)return}let t=document.createElement(U);t.embedded=!0,t.panel=this._hass.panels?.[G]??{url_path:G},t.presets=this._presets(),t.narrow=this._narrow(),t.hass=this._hass,this._status.hidden=!0,this.shadowRoot.appendChild(t),this._panel=t,this._layout(!0)}_narrow(){let e=this.getBoundingClientRect().width;return e>0?e<V:window.innerWidth<V}_layout(e){let t=this.getBoundingClientRect(),i=Math.round(t.width)!==this._lastWidth;if(!e&&!i)return;this._lastWidth=Math.round(t.width),this._panel&&t.width>0&&(this._panel.narrow=t.width<V);let o=Be(this._config.height);if(o){this.style.height=o;return}if(!this.isConnected)return;if(this._inEditorPreview()){this.style.height=`${We}px`;return}let n=Math.max(0,this._unscrolledTop(t)),l=Math.max(Ge,Math.floor(window.innerHeight-n));this.style.height=`${l}px`}_unscrolledTop(e){let t=e.top+window.scrollY,i=this.ownerDocument,o=this.parentElement??this.getRootNode().host??null;for(let n=0;o&&n<100;n++){let l=o;l!==i.documentElement&&l!==i.body&&typeof l.scrollTop=="number"&&l.scrollTop>0&&(t+=l.scrollTop),o=l.parentElement??l.getRootNode().host??null}return t}},x=class extends T{constructor(){super(...arguments);this._config={type:`custom:${D}`};this._views=[];this._viewsLoaded=!1}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._viewsLoaded&&(this._viewsLoaded=!0,this._loadViews())}async _loadViews(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._views=e?.views||[]}catch{this._views=[]}}_set(e,t){let i={...this._config};t===""||t===void 0?delete i[e]:i[e]=t,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let e=R(this.hass),t=i=>a(i==="today"?"tab_today":i==="calendar"?"tab_calendar":i,e);return r`
      <div class="editor">
        <div class="field">
          <div class="field-label">${a("panel_card_tab",e)}</div>
          <select class="tab-select" .value=${this._config.tab||""} @change=${i=>this._set("tab",i.target.value)}>
            <option value="" ?selected=${!this._config.tab}>${a("panel_card_tab_default",e)}</option>
            ${H.map(i=>r`<option value=${i} ?selected=${this._config.tab===i}>${t(i)}</option>`)}
          </select>
        </div>
        ${this._views.length>0?r`<div class="field">
              <div class="field-label">${a("panel_card_view",e)}</div>
              <select class="view-select" .value=${this._config.view||""} @change=${i=>this._set("view",i.target.value)}>
                <option value="" ?selected=${!this._config.view}>${a("card_saved_view_none",e)}</option>
                ${this._views.map(i=>r`<option value=${i.id} ?selected=${this._config.view===i.id||this._config.view===i.name}>${i.name}</option>`)}
              </select>
            </div>`:u}
        <div class="field">
          <div class="field-label">${a("panel_card_height",e)}</div>
          <input class="height-input" type="text" placeholder="fill"
            .value=${this._config.height===void 0?"":String(this._config.height)}
            @change=${i=>this._set("height",i.target.value.trim())} />
          <div class="field-help">${a("panel_card_height_help",e)}</div>
        </div>
      </div>
    `}};x.styles=C`
    .editor { display: flex; flex-direction: column; gap: 16px; padding: 16px; }
    input.height-input { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; box-sizing: border-box; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 13px; color: var(--secondary-text-color); font-weight: 500; }
    .field-help { font-size: 12px; color: var(--secondary-text-color); }
    select { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; }
  `,h([E({attribute:!1})],x.prototype,"hass",2),h([_()],x.prototype,"_config",2),h([_()],x.prototype,"_views",2);customElements.get(D)||customElements.define(D,W);customElements.get("maintenance-supporter-panel-card-editor")||customElements.define("maintenance-supporter-panel-card-editor",x);M({type:D,name:"Maintenance Supporter \u2014 Panel",description:"The complete Maintenance Supporter panel as a card \u2014 for a panel view / dashboard subview without the sidebar entry.",preview:!1});O();var He=2,Ke=600,f=class extends T{constructor(){super(...arguments);this._statesGate=new A(this);this._config={type:"custom:maintenance-supporter-card"};this._globalRowStyle=Y();this._settings=X;this._firstLoadDone=!1;this._objects=[];this._stats=null;this._viewFilters=null;this._userNames={};this._userPersons={};this._userService=null;this._userNamesLoaded=!1;this._taskDocs={};this._docsLoadedFor=new Set;this._docsInFlight=Promise.resolve();this._namesInFlight=Promise.resolve();this._follow=new Z(e=>{let t=J(this._objects,e);t!==null&&(this._objects=t),e.objects&&this.hass&&this._readSettings()},()=>{this._loadData()});this._onCompleted=async e=>{await this._loadData();let t=e.detail;t?.undo&&me(this,this.hass,t,this._lang,()=>{this._loadData()})}}shouldUpdate(e){return!this._statesGate.hold(e)}willUpdate(e){super.willUpdate(e),this._statesGate.release(e)}get _lang(){return R(this.hass)}static async getConfigElement(){return await import("/maintenance_supporter_cardfiles/card-chunks/maintenance-card-editor-RD3RULXG.js"),document.createElement("maintenance-supporter-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-card",show_header:!0,show_actions:!0,filter_status:[...se],max_items:10}}setConfig(e){let t=e.view_id!==this._config.view_id;this._config=e,t&&this._follow.started&&this.hass&&this._loadViewFilters()}getCardSize(){return 3}_readSettings(){Q(this.hass).then(e=>{this._settings=e,this._globalRowStyle=e.rowActionStyle}).catch(()=>{})}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._follow.stop()}updated(e){super.updated(e),le(this,e),this.hass&&!this._userNamesLoaded&&this._config.show_assignee!==!1&&this._objects.some(t=>t.tasks.some(i=>L(i).length>0))&&this._loadUserNames(),this._loadMissingDocuments(),e.has("hass")&&this.hass&&this._follow.sync(this.hass.connection)}async _loadData(){this._readSettings();let e=this._loadViewFilters(),t=!this._firstLoadDone;t&&this.hass&&this._config.show_assignee!==!1&&!this._userNamesLoaded&&this._loadUserNames();let i=Promise.resolve();try{let[o,n]=await Promise.all([t?te(this.hass):q(this.hass),B(this.hass,{first:t})]);await e,this._objects=t&&ee(this.hass.connection)||o,i=this._loadMissingDocuments(),this._stats=n,ce(this._stats.budget)}catch{}await e,t&&await Promise.race([Promise.all([i,this._namesInFlight]),new Promise(o=>setTimeout(o,Ke))]),this._firstLoadDone=!0}_assigneeName(e){return this._config.show_assignee===!1?"":L(e).map(t=>this._userNames[t]).filter(Boolean).join(", ")}_assigneeAvatars(e){return Pe(L(e).map(t=>this._userPersons[t]))}_loadUserNames(){return this._userNamesLoaded=!0,this._userService?this._userService.updateHass(this.hass):this._userService=new De(this.hass),this._namesInFlight=this._userService.getUsers().then(e=>{this._userPersons=Object.fromEntries(e.map(t=>[t.id,Me(t)])),this._userNames=Object.fromEntries(e.map(t=>[t.id,t.name]))}).catch(()=>{}),this._namesInFlight}_loadMissingDocuments(){if(!this.hass||this._config.show_documents===!1)return this._docsInFlight;let e=this._objects.filter(t=>!this._docsLoadedFor.has(t.entry_id)&&t.tasks.some(i=>(i.document_count??0)>0));return e.length&&(this._docsInFlight=Promise.all([this._docsInFlight,this._loadDocuments(e)]).then(()=>{},()=>{})),this._docsInFlight}async _loadDocuments(e){for(let n of e)this._docsLoadedFor.add(n.entry_id);let t=n=>this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",...n}),i={};for(let n of e)i[n.entry_id]={};let o=(n,l)=>{if(!je(l))for(let m of l.task_ids||[])(i[n][m]||=[]).push({id:l.id,title:l.title,kind:l.kind,url:l.url})};try{let n=await t({entry_ids:e.map(m=>m.entry_id)}),l=new Map(e.map(m=>[m.object.id,m.entry_id]));for(let m of n.documents||[]){let b=l.get(m.object_id??"");b&&o(b,m)}}catch{await Promise.all(e.map(async n=>{try{for(let l of(await t({entry_id:n.entry_id})).documents||[])o(n.entry_id,l)}catch{}}))}this._taskDocs={...this._taskDocs,...i}}_docsFor(e,t){if(this._config.show_documents===!1)return[];let o=[...this._taskDocs[e]?.[t.id]||[]];return t.documentation_url&&o.push({id:`url:${t.id}`,title:a("documentation_label",this._lang),kind:"weblink",url:t.documentation_url}),o}_renderDocChips(e,t){let i=this._docsFor(e,t);if(!i.length)return u;let o=i.slice(He);return r`<div class="doc-chips">
      ${i.slice(0,He).map(n=>r`
        <button
          type="button"
          class="doc-chip"
          title="${n.title}"
          @click=${l=>{l.stopPropagation(),this._openDoc(n)}}
        >
          <ha-svg-icon .path=${n.kind==="weblink"?we:ye}></ha-svg-icon>
          <span>${n.title}</span>
        </button>
      `)}
      ${o.length?r`<span class="doc-chip doc-more" title="${o.map(n=>n.title).join(`
`)}">+${o.length}</span>`:u}
    </div>`}async _openDoc(e){if(e.kind==="weblink"&&e.url){Ce(e.url)&&window.open(e.url,"_blank","noopener");return}try{await $e(this.hass,e.id)}catch{}}async _loadViewFilters(){if(!this._config.view_id){this._viewFilters=null;return}try{let t=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"})).views||[]).find(i=>i.id===this._config.view_id);this._viewFilters=t?t.filters:null}catch{this._viewFilters=null}}get _selectedTasks(){let e=[],{filter_status:t,filter_objects:i,entity_ids:o,filter_due_min_days:n,filter_due_max_days:l,filter_labels:m,filter_priority:b,filter_areas:k}=this._config,$=o?.length?new Set(o):null,y=n!==void 0||l!==void 0,p=this._viewFilters,S=p?.user_id==="current_user"?this.hass.user?.id??null:p?.user_id??null;for(let s of this._objects)if(!(p?.place&&(s.object.place||"home")!==p.place)&&!(i?.length&&!i.includes(s.entry_id)&&!i.includes(s.object.name))){if(k?.length){let c=s.object.area_id;if(!c||!k.includes(c))continue}for(let c of s.tasks)if(!c.is_done&&!(c.archived||s.object.archived)&&!(t?.length&&!t.includes(c.status))&&!(m?.length&&!(c.labels||[]).some(v=>m.includes(v)))&&!(b?.length&&!b.includes(c.priority||"normal"))&&!($&&!(c.sensor_entity_id&&$.has(c.sensor_entity_id)||c.binary_sensor_entity_id&&$.has(c.binary_sensor_entity_id)))){if(y){let v=c.days_until_due;if(v==null||n!==void 0&&v<n||l!==void 0&&v>l)continue}p&&(p.status&&c.status!==p.status||p.label&&!(c.labels||[]).includes(p.label)||p.priority&&(c.priority||"normal")!==p.priority||S&&!ie(c,S))||e.push({entry_id:s.entry_id,object_name:s.object.name,task:c})}}return e.sort((s,c)=>{let v=N(s.task.status)-N(c.task.status);return v!==0?v:(s.task.days_until_due??1/0)-(c.task.days_until_due??1/0)}),e}_openComplete(e,t,i=!1){if(!i&&w(t)){this._quickComplete(e,t);return}let o=()=>{let n=this.shadowRoot.querySelector("maintenance-complete-dialog");Le(n,Ae({entryId:e,taskId:t.id,taskName:t.name,task:t,objects:this._objects,lang:this._lang,features:this._settings.features,currencySymbol:oe(this._stats?.budget),partsCostMode:this._settings.partsCostMode}),this._lang)};customElements.get("maintenance-complete-dialog")?o():import("/maintenance_supporter_cardfiles/card-chunks/complete-dialog-U3G7YHDJ.js").then(o)}async _quickComplete(e,t){let i=await _e(this.hass,e,t.id,this._lang);if(i.result==="dialog"){this._openComplete(e,t,!0);return}if(i.result==="failed"||i.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:i.message},bubbles:!0,composed:!0}));return}await this._loadData(),ge(this,this.hass,{entryId:e,taskId:t.id,taskName:t.name},i.undo,this._lang,()=>{this._loadData()})}_headerCounts(e){let t={overdue:0,due_soon:0,triggered:0};for(let{task:i}of e)ne(i.status)&&(t[i.status]+=1);return t}_openTaskDetail(e,t){ze(e,t)}render(){let e=this._lang,t=this._config.title||a("maintenance",e),i=this._config.show_header!==!1,o=(this._config.action_style??(this._globalRowStyle==="icons"?"icons":"buttons"))==="buttons",n=this._config.show_actions!==!1,l=(this._config.show_create??n)&&K(this.hass?.user,this._settings.access),m=this._config.compact||!1,b=this._selectedTasks,{max_items:k}=this._config,$=k&&k>0?b.slice(0,k):b,y=this._objects.length||this._stats?this._headerCounts(b):null;return r`
      <ha-card>
        <div class="card-header">
          <h1>${t}</h1>
          <div class="header-right">
            ${i&&y?r`
                  <div class="header-stats">
                    ${y.overdue>0?r`<span class="badge overdue">${y.overdue}</span>`:u}
                    ${y.due_soon>0?r`<span class="badge due_soon">${y.due_soon}</span>`:u}
                    ${y.triggered>0?r`<span class="badge triggered">${y.triggered}</span>`:u}
                  </div>
                `:u}
            ${l?r`
                  <button type="button" class="row-icon-btn hdr-add" title="${a("new_object",e)}" aria-label=${a("new_object",e)}
                    @click=${()=>Oe()}><ha-svg-icon .path=${ke}></ha-svg-icon></button>
                  <button type="button" class="row-icon-btn hdr-add" title="${a("add_task",e)}" aria-label=${a("add_task",e)}
                    @click=${()=>Ne("",this._objects)}><ha-svg-icon .path=${xe}></ha-svg-icon></button>
                `:u}
          </div>
        </div>
        ${this._firstLoadDone?$.length===0?this._objects.some(p=>p.tasks.length>0)?r`<div class="empty-card">
                <!-- (#86) tasks exist but none match the filter (default:
                     actionable-only) — "all caught up", NOT "no tasks yet". -->
                <div class="all-caught-up">✓ ${a("card_all_caught_up",e)}</div>
              </div>`:r`<div class="empty-card">
                <div>${a("card_no_tasks_title",e)}</div>
                <a class="empty-link" href="/maintenance-supporter">${a("card_no_tasks_cta",e)}</a>
              </div>`:r`
              <div class="task-list ${m?"compact":""}">
                ${$.map(({entry_id:p,object_name:S,task:s})=>r`
                    <div class="task-item clickable"
                         @click=${()=>this._openTaskDetail(p,s.id)}
                         title="${a("open_task",e)}">
                      <div class="status-dot" style="background: ${Ie(s)}"></div>
                      <div class="task-info">
                        <div class="task-name">
                          ${m&&this._assigneeName(s)?r`<span class="compact-assignee" title="${this._assigneeName(s)}">${this._assigneeAvatars(s)}</span>`:u}${Se(s.name,s.next_event_titles,Re(s,this._lang))}
                          ${s.due_override?r`<ha-svg-icon
                                class="postponed-icon"
                                .path=${ve}
                                title="${a("postponed",e)}"
                              ></ha-svg-icon>`:u}
                        </div>
                        ${m?u:r`<div class="task-meta">
                              ${S} · ${de(s.type,e)}${j(s)?r` · ${j(s)}`:u}${this._assigneeName(s)?r` · <span class="assignee"
                                    >${this._assigneeAvatars(s)}${this._assigneeName(s)}</span
                                  >`:u}
                            </div>`}
                      </div>
                      ${this._renderDocChips(p,s)}
                      <div class="task-due">
                        ${s.days_until_due!==null&&s.days_until_due!==void 0?s.days_until_due<0?r`<span class="overdue-text">${I(s.days_until_due,e)}</span>`:I(s.days_until_due,e):s.trigger_active?"\u26A1":Fe(s.last_performed,e)??"\u2014"}
                      </div>
                      ${n&&ae(s)?r`<span class="inert-label">${a(s.enabled===!1?"disabled":"paused",e)}</span>`:n&&fe(s)?r`<span class="inert-label" title=${a("completes_itself_help",e)}>${a("completes_itself",e)}</span>`:n&&o?r`
                            <ha-button
                              size="small"
                              appearance="accent"
                              variant="success"
                              class="complete-btn-text"
                              title="${w(s)?a("qr_action_quick_complete",e):a("complete",e)}"
                              @click=${c=>{c.stopPropagation(),this._openComplete(p,s)}}
                            >
                              <ha-svg-icon slot="start" .path=${z}></ha-svg-icon>${a("complete",e)}
                            </ha-button>
                          `:n?r`
                            <!-- A plain button drawn like an ha-icon-button, which is
                                 far too heavy to create per row (perf 2026-11-05: a card
                                 of 163 tasks made 165 of them and 616 ha-icon). -->
                            <button
                              type="button"
                              class="row-icon-btn complete-btn${w(s)?" quick":""}"
                              title="${w(s)?a("qr_action_quick_complete",e):a("complete",e)}"
                              aria-label=${w(s)?a("qr_action_quick_complete",e):a("complete",e)}
                              @click=${c=>{c.stopPropagation(),this._openComplete(p,s)}}
                            ><!-- #233: an open circle to tick off; a check read as done already --><ha-svg-icon
                              .path=${w(s)?be:z}></ha-svg-icon></button>
                          `:u}
                    </div>
                  `)}
              </div>
            `:r`<div class="card-loading">${a("loading",e)}</div>`}
      </ha-card>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onCompleted}
      ></maintenance-complete-dialog>
    `}};f.styles=[he,C`
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
        background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
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
        /* Green like the panel's check and the labelled button: it was the
           theme's blue here, so Complete had two colours on one screen. */
        color: var(--maint-ok-color, var(--success-color, #4caf50));
      }
      /* DESIGN PROTOTYPE (#145): action_style: buttons — HA-native labelled button. */
      .complete-btn-text { --ha-button-font-size: 13px; flex: none; white-space: nowrap; }
      .complete-btn-text ha-svg-icon { --mdc-icon-size: 18px; }
      /* In the button's place on a task nothing may be done to (paused, off). */
      .inert-label { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; flex: none; }
    `],h([E({attribute:!1})],f.prototype,"hass",2),h([_()],f.prototype,"_config",2),h([_()],f.prototype,"_globalRowStyle",2),h([_()],f.prototype,"_settings",2),h([_()],f.prototype,"_firstLoadDone",2),h([_()],f.prototype,"_objects",2),h([_()],f.prototype,"_stats",2),h([_()],f.prototype,"_viewFilters",2),h([_()],f.prototype,"_userNames",2),h([_()],f.prototype,"_taskDocs",2);customElements.get("maintenance-supporter-card")||customElements.define("maintenance-supporter-card",f);M({type:"maintenance-supporter-card",name:"Maintenance Supporter",description:"Overview of your maintenance tasks with quick actions.",preview:!0});O();Ee(["maintenance-supporter-card","maintenance-battery-fleet-card","maintenance-supporter-panel-card"],import.meta.url);export{f as MaintenanceSupporterCard};
