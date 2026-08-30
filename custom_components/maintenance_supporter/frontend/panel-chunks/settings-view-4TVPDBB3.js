/*! maintenance_supporter frontend 2.68.0 */
import{a as I,f as E,h as T}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YOKUW3LY.js";import{a as P,b as H}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LATOZBYW.js";import{a as z}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-MEZOPQBI.js";import{a as c,b as q,c as o,e as m,f as p,g as S,h as A,l as x,m as d,q as e,s as j}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-7JKQQ4AV.js";var u={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},w=g=>(..._)=>({_$litDirective$:g,values:_}),f=class{constructor(_){}get _$AU(){return this._$AM._$AU}_$AT(_,t,s){this._$Ct=_,this._$AM=t,this._$Ci=s}_$AS(_,t){return this.update(_,t)}update(_,t){return this.render(...t)}};var y=class extends f{constructor(_){if(super(_),this.it=p,_.type!==u.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(_){if(_===p||_==null)return this._t=void 0,this.it=_;if(_===m)return _;if(typeof _!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(_===this.it)return this._t;this.it=_;let t=[_];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};y.directiveName="unsafeHTML",y.resultType=1;var M=w(y);var{I:Y}=S;var C=g=>g.strings===void 0;var O={},R=(g,_=O)=>g._$AH=_;var $=w(class extends f{constructor(g){if(super(g),g.type!==u.PROPERTY&&g.type!==u.ATTRIBUTE&&g.type!==u.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!C(g))throw Error("`live` bindings can only contain a single expression")}render(g){return g}update(g,[_]){if(_===m||_===p)return _;let t=g.element,s=g.name;if(g.type===u.PROPERTY){if(_===t[s])return m}else if(g.type===u.BOOLEAN_ATTRIBUTE){if(!!_===t.hasAttribute(s))return m}else if(g.type===u.ATTRIBUTE&&t.getAttribute(s)===_+"")return m;return R(g),_}});var B=["EUR","USD","GBP","JPY","CHF","CAD","AUD","NZD","CNY","INR","BRL","CZK","PLN","RUB","SEK","NOK","DKK","UAH"],l=class extends A{constructor(){super(...arguments);this.budget=null;this._settings=null;this._loading=!0;this._importCsv="";this._importLoading=!1;this._includeHistory=!0;this._toast="";this._testingNotification=!1;this._personTargets=[];this._testingUser="";this._users=[];this._savedViews=[];this._vacEnabled=!1;this._vacStart="";this._vacEnd="";this._vacBuffer=3;this._vacExempt=new Set;this._vacIsActive=!1;this._vacWindowEnd=null;this._vacAllTasks=[];this._vacPreview=[];this._vacPreviewLoading=!1;this._vacSaving=!1;this._qrObjects=[];this._qrSelectedEntries=new Set;this._qrActions=new Set(["view"]);this._qrUrlMode="companion";this._qrBatchLoading=!1;this._qrBatchResults=[];this._qrObjectsLoaded=!1;this._exportObjects=[];this._exportSelectedEntries=new Set;this._exportObjectsLoaded=!1;this._docArchiveLoading=!1;this._loaded=!1;this._userService=null;this._sendTestNotification=async t=>{t?this._testingUser=t:this._testingNotification=!0;try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/test_notification",...t?{user_id:t}:{}}),i=s.message||(s.success?e("test_notification_success",this._lang):e("test_notification_failed",this._lang));this._showToast(i)}catch{this._showToast(e("test_notification_failed",this._lang))}finally{t?this._testingUser="":this._testingNotification=!1}};this._allTemplates=[];this._templateCategories={};this._tplOpenGroups=new Set;this._templatesRequested=!1}get _lang(){return j(this.hass)}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._loaded?(this._loaded=!0,this._userService=new z(this.hass),this._loadSettings(),this._loadUsers()):t.has("hass")&&this.hass&&this._userService&&this._userService.updateHass(this.hass)}async _loadUsers(){if(this._userService){try{this._users=await this._userService.getUsers()}catch{this._users=[]}this._loadNotifyTargets()}}async _loadNotifyTargets(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/notify/user_targets"});this._personTargets=t.targets||[]}catch{this._personTargets=[]}}async _loadSettings(){this._loading=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});this._settings=t,this._hydrateVacationFromSettings()}catch{}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._savedViews=t.views||[]}catch{}this._loading=!1}_hydrateVacationFromSettings(){let t=this._settings?.vacation;t&&(this._vacEnabled=t.enabled,this._vacStart=t.start||"",this._vacEnd=t.end||"",this._vacBuffer=t.buffer_days,this._vacExempt=new Set(t.exempt_task_ids||[]),this._vacIsActive=t.is_active,this._vacWindowEnd=t.window_end)}async _updateSetting(t,s){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/update",settings:{[t]:s}});this._settings=i,this._showToast(e("settings_saved",this._lang)),this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(e("action_error",this._lang)),this.requestUpdate()}}_showToast(t){this._toast=t,setTimeout(()=>{this._toast=""},3e3)}_downloadFile(t,s,i){P(t,s,i)}render(){let t=this._lang;return this._loading||!this._settings?o`<div class="settings-loading">Loading…</div>`:o`
      ${this._renderFeatures(t)}
      ${this._renderPanelAccess(t)}
      ${this._renderGeneral(t)}
      ${this._renderObjectsColumns(t)}
      ${this._settings.general.notifications_enabled?this._renderNotifications(t):p}
      ${this.features.budget?this._renderBudget(t):p}
      ${this._renderArchive(t)}
      ${this._renderVacation(t)}
      ${this._renderPrintQr(t)}
      ${this._renderImportExport(t)}
      ${this._renderTemplateToggles(t)}
      ${this._toast?o`<div class="settings-toast">${this._toast}</div>`:p}
    `}scrollToSection(t){requestAnimationFrame(()=>{let s=this.shadowRoot;if(!s)return;let i=s.querySelector(`[data-section="${t}"]`)??s.querySelector(`[data-section-alt="${t}"]`);i&&i.scrollIntoView({behavior:"smooth",block:"start"})})}_renderPanelAccess(t){let s=new Set(this._settings.admin_panel_user_ids||[]),i=this._users.filter(r=>!r.is_admin),a=this._settings.operator_write_enabled??!1,n=(r,h)=>{let b=new Set(s);h?b.add(r):b.delete(r),this._updateSetting("admin_panel_user_ids",[...b])};return o`
      <div class="settings-section">
        <h3>${e("settings_panel_access",t)} ${a&&s.size>0?o`<span class="section-badge">${s.size}</span>`:p}</h3>
        <p class="section-desc">${e("settings_panel_access_desc",t)}</p>
        <label class="setting-row">
          <span>
            <span class="setting-label">${e("settings_operator_write",t)}</span>
            <span class="setting-desc">${e("settings_operator_write_desc",t)}</span>
          </span>
          <input type="checkbox"
            .checked=${a}
            @change=${r=>this._updateSetting("operator_write_enabled",r.target.checked)} />
        </label>
        ${a?i.length===0?o`<div class="setting-row hint">${e("no_non_admin_users",t)}</div>`:i.map(r=>o`
              <label class="setting-row">
                <span>
                  <span class="setting-label">${r.name||r.id.slice(0,8)}</span>
                  <span class="setting-desc">${r.is_owner?e("owner_label",t):""}</span>
                </span>
                <input type="checkbox"
                  .checked=${s.has(r.id)}
                  @change=${h=>n(r.id,h.target.checked)} />
              </label>
            `):p}
      </div>
    `}_renderFeatures(t){let s=this._settings.features,i=[{key:"adaptive",settingKey:"advanced_adaptive_visible",label:e("feat_adaptive",t),desc:e("feat_adaptive_desc",t)},{key:"predictions",settingKey:"advanced_predictions_visible",label:e("feat_predictions",t),desc:e("feat_predictions_desc",t)},{key:"seasonal",settingKey:"advanced_seasonal_visible",label:e("feat_seasonal",t),desc:e("feat_seasonal_desc",t)},{key:"environmental",settingKey:"advanced_environmental_visible",label:e("feat_environmental",t),desc:e("feat_environmental_desc",t)},{key:"budget",settingKey:"advanced_budget_visible",label:e("feat_budget",t),desc:e("feat_budget_desc",t)},{key:"groups",settingKey:"advanced_groups_visible",label:e("feat_groups",t),desc:e("feat_groups_desc",t)},{key:"checklists",settingKey:"advanced_checklists_visible",label:e("feat_checklists",t),desc:e("feat_checklists_desc",t)},{key:"schedule_time",settingKey:"advanced_schedule_time_visible",label:e("feat_schedule_time",t),desc:e("feat_schedule_time_desc",t)},{key:"completion_actions",settingKey:"advanced_completion_actions_visible",label:e("feat_completion_actions",t),desc:e("feat_completion_actions_desc",t)}];return o`
      <div class="settings-section" data-section="settings" data-section-alt="groups">
        <h3>${e("settings_features",t)}</h3>
        <p class="section-desc">${e("settings_features_desc",t)}</p>
        ${i.map(a=>o`
          <label class="setting-row">
            <span>
              <span class="setting-label">${a.label}</span>
              <span class="setting-desc">${a.desc}</span>
            </span>
            <input type="checkbox" .checked=${s[a.key]}
              @change=${n=>this._updateSetting(a.settingKey,n.target.checked)} />
          </label>
        `)}
      </div>
    `}async _loadTemplates(){if(!this._templatesRequested){this._templatesRequested=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._allTemplates=t.templates||[],this._templateCategories=t.categories||{}}catch{}}}_renderTemplateToggles(t){this._loadTemplates();let s=new Set(this._settings.disabled_template_ids||[]),i=new Map;for(let n of Object.keys(this._templateCategories))i.set(n,[]);for(let n of this._allTemplates)i.has(n.category)||i.set(n.category,[]),i.get(n.category).push(n);let a=n=>this._templateCategories[n]?.["name_"+t]||this._templateCategories[n]?.name_en||n;return o`
      <div class="settings-section" data-section="templates">
        <h3>${e("settings_templates_label",t)}</h3>
        <p class="section-desc">${e("settings_templates_hint",t)}</p>
        ${[...i.entries()].filter(([,n])=>n.length>0).map(([n,r])=>{let h=r.filter(v=>!s.has(v.id)).length,b=this._tplOpenGroups.has(n);return o`
            <div class="tpl-group">
              <div
                class="tpl-group-head"
                role="button"
                tabindex="0"
                @click=${()=>this._toggleTplGroupOpen(n)}
                @keydown=${v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),this._toggleTplGroupOpen(n))}}
              >
                <ha-icon class="tpl-chevron" icon=${b?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
                <ha-icon icon=${this._templateCategories[n]?.icon||"mdi:folder-outline"}></ha-icon>
                <span class="tpl-group-name">${a(n)}</span>
                <span class="tpl-group-count">${h}/${r.length}</span>
                <input
                  type="checkbox"
                  title=${e("settings_templates_toggle_group",t)}
                  .checked=${h===r.length}
                  @click=${v=>v.stopPropagation()}
                  @change=${v=>this._toggleTemplateGroup(r.map(k=>k.id),v.target.checked)}
                />
              </div>
              ${b?r.map(v=>o`
                    <label class="setting-row tpl-row">
                      <span class="setting-label">${v.name}</span>
                      <input
                        type="checkbox"
                        .checked=${!s.has(v.id)}
                        @change=${k=>this._toggleTemplate(v.id,k.target.checked)}
                      />
                    </label>
                  `):p}
            </div>
          `})}
      </div>
    `}_toggleTemplate(t,s){let i=new Set(this._settings.disabled_template_ids||[]);s?i.delete(t):i.add(t),this._updateSetting("disabled_template_ids",[...i])}_toggleTplGroupOpen(t){let s=new Set(this._tplOpenGroups);s.has(t)?s.delete(t):s.add(t),this._tplOpenGroups=s}_toggleTemplateGroup(t,s){let i=new Set(this._settings.disabled_template_ids||[]);for(let a of t)s?i.delete(a):i.add(a);this._updateSetting("disabled_template_ids",[...i])}_renderObjectsColumns(t){let s=T(this._settings.objects_table_columns);return o`
      <div class="settings-section" data-section="objects_table_columns">
        <h3>${e("objects_table_columns_label",t)}</h3>
        <p class="section-desc">${e("objects_table_columns_hint",t)}</p>
        ${E.map(i=>o`
          <label class="setting-row">
            <span class="setting-label">${e(i.labelKey,t)}</span>
            <input
              type="checkbox"
              .checked=${s.includes(i.key)}
              ?disabled=${!!i.required}
              @change=${a=>this._toggleColumn(i.key,a.target.checked)}
            />
          </label>
        `)}
      </div>
    `}_toggleColumn(t,s){let i=new Set(T(this._settings.objects_table_columns));s?i.add(t):i.delete(t);let a=E.filter(n=>n.required||i.has(n.key)).map(n=>n.key);this._updateSetting("objects_table_columns",a)}_renderGeneral(t){let s=this._settings.general,i=s.notify_targets??[],a=this._settings.budget;return o`
      <div class="settings-section">
        <h3>${e("settings_general",t)}</h3>
        <label class="setting-row">
          <span class="setting-label">${e("settings_default_warning",t)}</span>
          <input type="number" min="0" max="365" .value=${String(s.default_warning_days)}
            @change=${n=>{let r=parseInt(n.target.value,10);r>=0&&r<=365&&this._updateSetting("default_warning_days",r)}} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${e("settings_consumable_threshold",t)}</span>
          <input type="number" min="1" max="90" .value=${String(s.default_consumable_threshold??10)}
            @change=${n=>{let r=parseInt(n.target.value,10);r>=1&&r<=90&&this._updateSetting("default_consumable_threshold",r)}} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${e("settings_battery_low_percent",t)}</span>
          <input type="number" min="1" max="90" .value=${String(s.battery_low_percent??20)}
            @change=${n=>{let r=parseInt(n.target.value,10);r>=1&&r<=90&&this._updateSetting("battery_low_percent",r)}} />
        </label>
        <div class="setting-hint">${e("settings_thresholds_hint",t)}</div>
        <label class="setting-row">
          <span class="setting-label">${e("settings_row_actions",t)}</span>
          <select .value=${$(s.row_action_style||"buttons_compact")}
            @change=${n=>this._updateSetting("row_action_style",n.target.value)}>
            ${["buttons_compact","buttons","icons"].map(n=>o`
              <option value=${n} ?selected=${(s.row_action_style||"buttons_compact")===n}>${e(`row_actions_${n}`,t)}</option>`)}
          </select>
        </label>
        <label class="setting-row">
          <span class="setting-label">${e("settings_currency",t)}</span>
          <select .value=${$(a.currency)} @change=${n=>this._updateSetting("budget_currency",n.target.value)}>
            ${B.map(n=>o`<option value=${n} ?selected=${a.currency===n}>${n}</option>`)}
          </select>
        </label>
        <label class="setting-row">
          <span class="setting-label">${e("settings_panel_enabled",t)}</span>
          <input type="checkbox" .checked=${s.panel_enabled}
            @change=${n=>this._updateSetting("panel_enabled",n.target.checked)} />
        </label>
        ${s.panel_enabled?o`
          <label class="setting-row">
            <span class="setting-label">${e("settings_panel_title",t)}</span>
            <input type="text" .value=${s.panel_title??""}
              placeholder="Maintenance"
              maxlength="50"
              @change=${n=>this._updateSetting("panel_title",n.target.value.trim())} />
          </label>
        `:""}
        <label class="setting-row">
          <span class="setting-label">${e("settings_install_assist_sentences",t)}</span>
          <input type="checkbox" .checked=${s.install_assist_sentences??!1}
            @change=${n=>this._updateSetting("install_assist_sentences",n.target.checked)} />
        </label>
        <div class="setting-hint">${e("settings_install_assist_sentences_hint",t)}</div>
        <label class="setting-row">
          <span class="setting-label">${e("settings_notifications",t)}</span>
          <input type="checkbox" .checked=${s.notifications_enabled}
            @change=${n=>this._updateSetting("notifications_enabled",n.target.checked)} />
        </label>
        ${s.notifications_enabled?o`
          <label class="setting-row">
            <span class="setting-label">${e("settings_notify_service",t)}</span>
            <input type="text" list="ms-notify-services" .value=${s.notify_service}
              @change=${n=>this._updateSetting("notify_service",n.target.value.trim())} />
            <datalist id="ms-notify-services">
              ${i.map(n=>o`<option value=${n}></option>`)}
            </datalist>
          </label>
          <div class="setting-row">
            <span class="setting-label">${e("test_notification",t)}</span>
            <button class="ha-button secondary"
              ?disabled=${!s.notify_service||this._testingNotification}
              @click=${()=>this._sendTestNotification()}>
              ${this._testingNotification?e("testing",t):e("send_test",t)}
            </button>
          </div>
          ${this._personTargets.length?o`
            <div class="notify-per-person">
              <span class="setting-label">${e("notify_per_person",t)}</span>
              ${this._personTargets.map(n=>o`
                <div class="notify-person-row">
                  <span class="notify-person-name">${n.name}</span>
                  <span class="notify-person-target ${n.services.length?"":"muted"}">
                    ${n.services.length?n.services.join(", "):e("notify_no_own_device",t)}
                  </span>
                  <button class="ha-button secondary"
                    ?disabled=${!n.services.length||this._testingUser===n.user_id}
                    @click=${()=>this._sendTestNotification(n.user_id)}>
                    ${this._testingUser===n.user_id?e("testing",t):e("send_test",t)}
                  </button>
                </div>
              `)}
            </div>
          `:p}
        `:p}

        <label class="setting-row">
          <span class="setting-label" title=${e("settings_shopping_list_help",t)}>${e("settings_shopping_list",t)}</span>
          <select .value=${$(s.shopping_list_entity||"")}
            @change=${n=>this._updateSetting("shopping_list_entity",n.target.value)}>
            <option value="" ?selected=${!s.shopping_list_entity}>${e("shopping_list_none",t)}</option>
            ${this._todoEntities(s.shopping_list_entity||"").map(n=>o`
              <option value=${n} ?selected=${s.shopping_list_entity===n}>${n}</option>
            `)}
          </select>
        </label>
      </div>
    `}_todoEntities(t){let s=Object.keys(this.hass?.states||{}).filter(i=>i.startsWith("todo.")).sort();return t&&!s.includes(t)&&s.unshift(t),s}_renderNotifications(t){let s=this._settings.notifications,i=this._settings.actions;return o`
      <div class="settings-section">
        <h3>${e("settings_notifications",t)}</h3>

        <label class="setting-row">
          <span>
            <span class="setting-label">${e("settings_notify_due_soon",t)}</span>
          </span>
          <input type="checkbox" .checked=${s.due_soon_enabled}
            @change=${a=>this._updateSetting("notify_due_soon_enabled",a.target.checked)} />
        </label>
        ${s.due_soon_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${e("settings_interval_hours",t)}</span>
            <input type="number" min="0" max="720" .value=${String(s.due_soon_interval_hours)}
              @change=${a=>this._updateSetting("notify_due_soon_interval_hours",parseInt(a.target.value,10)||0)} />
          </label>
        `:p}

        <label class="setting-row">
          <span>
            <span class="setting-label">${e("settings_notify_overdue",t)}</span>
          </span>
          <input type="checkbox" .checked=${s.overdue_enabled}
            @change=${a=>this._updateSetting("notify_overdue_enabled",a.target.checked)} />
        </label>
        ${s.overdue_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${e("settings_interval_hours",t)}</span>
            <input type="number" min="0" max="720" .value=${String(s.overdue_interval_hours)}
              @change=${a=>this._updateSetting("notify_overdue_interval_hours",parseInt(a.target.value,10)||0)} />
          </label>
        `:p}

        <label class="setting-row">
          <span>
            <span class="setting-label">${e("settings_notify_triggered",t)}</span>
          </span>
          <input type="checkbox" .checked=${s.triggered_enabled}
            @change=${a=>this._updateSetting("notify_triggered_enabled",a.target.checked)} />
        </label>
        ${s.triggered_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${e("settings_interval_hours",t)}</span>
            <input type="number" min="0" max="720" .value=${String(s.triggered_interval_hours)}
              @change=${a=>this._updateSetting("notify_triggered_interval_hours",parseInt(a.target.value,10)||0)} />
          </label>
        `:p}

        <label class="setting-row">
          <span class="setting-label">${e("settings_quiet_hours",t)}</span>
          <input type="checkbox" .checked=${s.quiet_hours_enabled}
            @change=${a=>this._updateSetting("quiet_hours_enabled",a.target.checked)} />
        </label>
        ${s.quiet_hours_enabled?o`
          <div class="setting-row sub-row">
            <span class="setting-desc">${e("settings_quiet_start",t)}</span>
            <input type="time" .value=${s.quiet_hours_start}
              @change=${a=>this._updateSetting("quiet_hours_start",a.target.value)} />
          </div>
          <div class="setting-row sub-row">
            <span class="setting-desc">${e("settings_quiet_end",t)}</span>
            <input type="time" .value=${s.quiet_hours_end}
              @change=${a=>this._updateSetting("quiet_hours_end",a.target.value)} />
          </div>
        `:p}

        <label class="setting-row">
          <span class="setting-label">${e("settings_max_per_day",t)}</span>
          <input type="number" min="0" max="100" .value=${String(s.max_per_day)}
            @change=${a=>this._updateSetting("max_notifications_per_day",parseInt(a.target.value,10)||0)} />
        </label>

        <label class="setting-row">
          <span class="setting-label">${e("settings_bundling",t)}</span>
          <input type="checkbox" .checked=${s.bundling_enabled}
            @change=${a=>this._updateSetting("notification_bundling_enabled",a.target.checked)} />
        </label>
        ${s.bundling_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${e("settings_bundle_threshold",t)}</span>
            <input type="number" min="2" max="20" .value=${String(s.bundle_threshold)}
              @change=${a=>this._updateSetting("notification_bundle_threshold",parseInt(a.target.value,10)||2)} />
          </label>
        `:p}
        <label class="setting-row">
          <span class="setting-label">${e("settings_reminder_leads",t)}</span>
          <input type="text" placeholder="14, 3, 0"
            .value=${(s.reminder_lead_days||[]).join(", ")}
            @change=${a=>{let n=a.target.value.split(",").map(r=>parseInt(r.trim(),10)).filter(r=>Number.isInteger(r)&&r>=0&&r<=365);this._updateSetting("reminder_lead_days",[...new Set(n)])}} />
        </label>
        <div class="setting-hint">${e("settings_reminder_leads_hint",t)}</div>
        <label class="setting-row">
          <span class="setting-label">${e("settings_notify_scope",t)}</span>
          <select
            .value=${$(s.scope_view_id||"")}
            @change=${a=>this._updateSetting("notify_scope_view_id",a.target.value)}
          >
            <option value="" ?selected=${!s.scope_view_id}>${e("settings_notify_scope_all",t)}</option>
            ${this._savedViews.map(a=>o`<option value=${a.id} ?selected=${s.scope_view_id===a.id}>${a.name}</option>`)}
          </select>
        </label>
        <div class="setting-hint">${e("settings_notify_scope_hint",t)}</div>

        <h4 style="margin: 16px 0 8px; font-size: 14px;">${e("settings_actions",t)}</h4>
        <label class="setting-row">
          <span class="setting-label">${e("settings_action_complete",t)}</span>
          <input type="checkbox" .checked=${i.complete_enabled}
            @change=${a=>this._updateSetting("action_complete_enabled",a.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${e("settings_action_skip",t)}</span>
          <input type="checkbox" .checked=${i.skip_enabled}
            @change=${a=>this._updateSetting("action_skip_enabled",a.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${e("settings_action_snooze",t)}</span>
          <input type="checkbox" .checked=${i.snooze_enabled}
            @change=${a=>this._updateSetting("action_snooze_enabled",a.target.checked)} />
        </label>
        ${i.snooze_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${e("settings_snooze_hours",t)}</span>
            <input type="number" min="1" max="168" .value=${String(i.snooze_duration_hours)}
              @change=${a=>this._updateSetting("snooze_duration_hours",parseInt(a.target.value,10)||4)} />
          </label>
        `:p}
        <label class="setting-row">
          <span class="setting-label">${e("settings_weekly_digest",t)}</span>
          <input type="checkbox" .checked=${i.weekly_digest_enabled}
            @change=${a=>this._updateSetting("weekly_digest_enabled",a.target.checked)} />
        </label>
        <div class="setting-hint">${e("settings_weekly_digest_hint",t)}</div>
        <label class="setting-row">
          <span class="setting-label">${e("settings_warranty_reminder",t)}</span>
          <input type="checkbox" .checked=${i.warranty_reminder_enabled}
            @change=${a=>this._updateSetting("warranty_reminder_enabled",a.target.checked)} />
        </label>
        ${i.warranty_reminder_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${e("settings_warranty_reminder_days",t)}</span>
            <input type="number" min="1" max="365" .value=${String(i.warranty_reminder_days)}
              @change=${a=>this._updateSetting("warranty_reminder_days",parseInt(a.target.value,10)||30)} />
          </label>
        `:p}
        <div class="setting-hint">${e("settings_warranty_reminder_hint",t)}</div>
      </div>
    `}_renderBudget(t){let s=this._settings.budget;return o`
      <div class="settings-section" data-section="budget">
        <h3>${e("settings_budget",t)}</h3>
        <label class="setting-row">
          <span class="setting-label">${e("settings_budget_monthly",t)}</span>
          <input type="number" min="0" step="0.01" .value=${String(s.monthly)}
            @change=${i=>this._updateSetting("budget_monthly",parseFloat(i.target.value)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${e("settings_budget_yearly",t)}</span>
          <input type="number" min="0" step="0.01" .value=${String(s.yearly)}
            @change=${i=>this._updateSetting("budget_yearly",parseFloat(i.target.value)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${e("settings_budget_alerts",t)}</span>
          <input type="checkbox" .checked=${s.alerts_enabled}
            @change=${i=>this._updateSetting("budget_alerts_enabled",i.target.checked)} />
        </label>
        ${s.alerts_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${e("settings_budget_threshold",t)}</span>
            <input type="number" min="1" max="100" .value=${String(s.alert_threshold_pct)}
              @change=${i=>this._updateSetting("budget_alert_threshold",parseInt(i.target.value,10)||80)} />
          </label>
        `:p}
      </div>
    `}_renderArchive(t){let s=this._settings.archive??{oneoff_days:14,delete_archived_oneoff_days:0};return o`
      <div class="settings-section" data-section="archive">
        <h3>${e("settings_archive",t)}</h3>
        <p class="section-desc">${e("settings_archive_desc",t)}</p>
        <label class="setting-row">
          <span class="setting-label">${e("settings_archive_oneoff_days",t)}</span>
          <input type="number" min="0" max="3650" step="1" .value=${String(s.oneoff_days)}
            @change=${i=>this._updateSetting("archive_oneoff_days",parseInt(i.target.value,10)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${e("settings_delete_archived_oneoff_days",t)}</span>
          <input type="number" min="0" max="3650" step="1" .value=${String(s.delete_archived_oneoff_days)}
            @change=${i=>this._updateSetting("delete_archived_oneoff_days",parseInt(i.target.value,10)||0)} />
        </label>
      </div>
    `}_renderVacation(t){let s=this._vacEnabled&&!this._vacIsActive&&this._vacWindowEnd&&new Date(this._vacWindowEnd)<new Date,i=this._vacExempt.size;return o`
      <div class="settings-section vacation-section" data-section="vacation">
        <h3>
          ${e("vacation_title",t)}
          ${this._vacIsActive?o`<span class="vac-badge active">${e("vacation_active",t)}</span>`:p}
          ${s?o`<span class="vac-badge stale">${e("vacation_ended",t)}</span>`:p}
        </h3>
        <p class="section-desc">${e("vacation_desc",t)}</p>

        <label class="vac-toggle">
          <input type="checkbox" .checked=${this._vacEnabled}
            @change=${a=>this._toggleVacationEnabled(a.target.checked)} />
          ${e("vacation_enable",t)}
        </label>

        <div class="vac-grid">
          <label class="vac-field">
            <span class="filter-label">${e("vacation_start",t)}</span>
            <input type="date" .value=${this._vacStart}
              @change=${a=>this._setVacationDate("start",a.target.value)} />
          </label>
          <label class="vac-field">
            <span class="filter-label">${e("vacation_end",t)}</span>
            <input type="date" .value=${this._vacEnd}
              @change=${a=>this._setVacationDate("end",a.target.value)} />
          </label>
          <label class="vac-field">
            <span class="filter-label">${e("vacation_buffer",t)}</span>
            <input type="number" min="0" max="14" .value=${String(this._vacBuffer)}
              @change=${a=>this._setVacationBuffer(parseInt(a.target.value,10)||0)} />
          </label>
        </div>

        <details class="vac-exempt-panel">
          <summary>
            ${e("vacation_exempt_title",t)}
            ${i>0?o`<span class="section-badge">${i}</span>`:p}
          </summary>
          <p class="section-desc">${e("vacation_exempt_desc",t)}</p>
          ${this._vacAllTasks.length===0?o`<button @click=${this._loadAllTasksForVacation}>${e("vacation_load_tasks",t)}</button>`:o`
              <div class="vac-task-list">
                ${this._renderVacationTaskList(t)}
              </div>
            `}
        </details>

        ${this._vacStart&&this._vacEnd?o`
          <div class="vac-preview-toolbar">
            <button @click=${this._loadVacationPreview} ?disabled=${this._vacPreviewLoading}>
              ${this._vacPreviewLoading?"\u2026":e("vacation_preview_btn",t)}
            </button>
            ${this._vacPreview.length>0?o`<span class="vac-preview-count">${this._vacPreview.length} ${e("vacation_preview_affected",t)}</span>`:p}
          </div>
          ${this._vacPreview.length>0?this._renderVacationPreview(t):p}
        `:p}

        ${this._vacIsActive||s?o`<button class="vac-end-now" @click=${this._endVacationNow}>
              ${e("vacation_end_now",t)}
            </button>`:p}
      </div>
    `}_renderVacationTaskList(t){let s=new Map;for(let a of this._vacAllTasks){let n=s.get(a.object_name)||[];n.push(a),s.set(a.object_name,n)}return[...s.entries()].sort(([a],[n])=>a.localeCompare(n)).map(([a,n])=>o`
      <div class="vac-task-group">
        <div class="vac-task-group-name">${a||e("no_objects",t)}</div>
        ${n.sort((r,h)=>r.task_name.localeCompare(h.task_name)).map(r=>o`
            <label class="vac-task-row">
              <input type="checkbox"
                .checked=${this._vacExempt.has(r.task_id)}
                @change=${h=>this._toggleVacationExempt(r.task_id,h.target.checked)} />
              <span>${r.task_name}</span>
            </label>
          `)}
      </div>
    `)}_renderVacationPreview(t){return o`
      <div class="vac-preview-list">
        ${this._vacPreview.map(s=>{let i=s.events.map(n=>{let r=`vacation_event_${n.status}`;return`${n.date} (${e(r,t)})`}).join(" \xB7 "),a=!s.will_suppress;return o`
            <div class="vac-preview-row ${a?"exempt":""}">
              <div class="vac-preview-info">
                <div class="vac-preview-name">
                  <strong>${s.object_name}</strong> · ${s.task_name}
                  ${s.kind==="sensor_based"?o`<span class="vac-preview-kind">${e("vacation_sensor_based",t)}</span>`:p}
                </div>
                <div class="vac-preview-events">${i}</div>
              </div>
              <div class="vac-preview-actions">
                <button @click=${()=>this._previewActionComplete(s)}>${e("qr_action_complete",t)}</button>
                ${s.kind==="time_based"?o`<button @click=${()=>this._previewActionSkip(s)}>${e("qr_action_skip",t)}</button>`:p}
                <button class=${a?"vac-notify-on":""}
                  @click=${()=>this._toggleVacationExempt(s.task_id,!a)}>
                  ${a?e("vacation_action_unsilence",t):e("vacation_action_notify",t)}
                </button>
              </div>
            </div>
          `})}
      </div>
    `}async _loadAllTasksForVacation(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),s=[];for(let i of t.objects||[])for(let a of i.tasks||[])s.push({entry_id:i.entry_id,object_name:i.object.name||"",task_id:a.id,task_name:a.name||""});this._vacAllTasks=s}catch{this._showToast(e("action_error",this._lang))}}async _saveVacation(t){if(!this._vacSaving){this._vacSaving=!0;try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/update",...t});this._vacEnabled=s.enabled,this._vacStart=s.start||"",this._vacEnd=s.end||"",this._vacBuffer=s.buffer_days,this._vacExempt=new Set(s.exempt_task_ids||[]),this._vacIsActive=s.is_active,this._vacWindowEnd=s.window_end,this.dispatchEvent(new CustomEvent("settings-changed"))}catch(s){let i=s?.message||e("action_error",this._lang);this._showToast(i)}finally{this._vacSaving=!1}}}_toggleVacationEnabled(t){this._saveVacation({enabled:t})}_setVacationDate(t,s){let i={};i[t]=s||null,this._saveVacation(i)}_setVacationBuffer(t){t<0||t>14||this._saveVacation({buffer_days:t})}_toggleVacationExempt(t,s){let i=new Set(this._vacExempt);s?i.add(t):i.delete(t),this._saveVacation({exempt_task_ids:[...i]})}async _loadVacationPreview(){this._vacPreviewLoading=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/preview"});this._vacPreview=t.rows||[]}catch{this._showToast(e("action_error",this._lang))}finally{this._vacPreviewLoading=!1}}async _previewActionComplete(t){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/complete",entry_id:t.entry_id,task_id:t.task_id}),this._showToast(e("vacation_marked_complete",this._lang)),await this._loadVacationPreview()}catch{this._showToast(e("action_error",this._lang))}}async _previewActionSkip(t){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/skip",entry_id:t.entry_id,task_id:t.task_id,reason:"Skipped before vacation"}),this._showToast(e("vacation_marked_skip",this._lang)),await this._loadVacationPreview()}catch{this._showToast(e("action_error",this._lang))}}async _endVacationNow(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/end_now"});this._vacEnabled=t.enabled,this._vacEnd=t.end||"",this._vacIsActive=t.is_active,this._vacWindowEnd=t.window_end,this.dispatchEvent(new CustomEvent("settings-changed")),this._showToast(e("vacation_ended",this._lang))}catch{this._showToast(e("action_error",this._lang))}}_renderPrintQr(t){let s=this._qrSelectedEntries.size||this._qrObjects.length,i=this._qrActions.size,a=s*i,n=a>200;return o`
      <div class="settings-section qr-print-section">
        <h3>${e("qr_print_title",t)}</h3>
        <p class="section-desc">${e("qr_print_desc",t)}</p>

        ${this._qrObjectsLoaded?o`
            <details open class="qr-filter-panel">
              <summary>${e("qr_print_filter",t)}</summary>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${e("qr_print_objects",t)}</div>
                <div class="qr-object-list">
                  ${this._qrObjects.length===0?o`<div class="hint">${e("no_objects",t)}</div>`:this._qrObjects.map(r=>o`
                      <label class="qr-object-row">
                        <input type="checkbox"
                          .checked=${this._qrSelectedEntries.size===0||this._qrSelectedEntries.has(r.entry_id)}
                          @change=${h=>this._toggleQrObject(r.entry_id,h.target.checked)} />
                        <span>${r.name}</span>
                        <span class="qr-task-count">${r.task_count}</span>
                      </label>
                    `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${e("qr_print_actions",t)}</div>
                <div class="qr-action-chips">
                  ${["view","complete","skip"].map(r=>o`
                    <label class="qr-action-chip ${this._qrActions.has(r)?"active":""}">
                      <input type="checkbox"
                        .checked=${this._qrActions.has(r)}
                        @change=${h=>this._toggleQrAction(r,h.target.checked)} />
                      ${e("qr_action_"+r,t)}
                    </label>
                  `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${e("qr_print_url_mode",t)}</div>
                <select .value=${this._qrUrlMode}
                  @change=${r=>{this._qrUrlMode=r.target.value}}>
                  <option value="companion">${e("qr_mode_companion",t)}</option>
                  <option value="local">${e("qr_mode_local",t)}</option>
                  <option value="server">${e("qr_mode_server",t)}</option>
                </select>
              </div>

              <div class="qr-filter-group qr-filter-actions">
                <div class="qr-estimate ${n?"error":""}">
                  ${e("qr_print_estimate",t)}: <strong>${a}</strong>
                  ${n?o` — ${e("qr_print_over_limit",t)}`:p}
                </div>
                <button
                  ?disabled=${this._qrBatchLoading||n||i===0}
                  @click=${this._generateBatch}>
                  ${this._qrBatchLoading?e("qr_print_generating",t):e("qr_print_generate",t)}
                </button>
              </div>
            </details>

            ${this._qrBatchResults.length>0?o`
                <div class="qr-results-toolbar">
                  <span>${this._qrBatchResults.length} ${e("qr_print_ready",t)}</span>
                  <button @click=${this._printQrs}>${e("qr_print_print_button",t)}</button>
                </div>
                <div class="qr-print-grid">
                  ${this._qrBatchResults.map(r=>o`
                    <div class="qr-print-cell">
                      <div class="qr-svg">${M(r.svg)}</div>
                      <div class="qr-label">
                        <div class="qr-label-obj">${r.object_name}</div>
                        <div class="qr-label-task">${r.task_name}</div>
                        <div class="qr-label-action">${e("qr_action_"+r.action,t)}</div>
                      </div>
                    </div>
                  `)}
                </div>
              `:p}
          `:o`<button @click=${this._loadQrObjects}>${e("qr_print_load",t)}</button>`}
      </div>
    `}async _loadQrObjects(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._qrObjects=(t.objects||[]).map(s=>({entry_id:s.entry_id,name:s.object.name,task_count:(s.tasks||[]).length})).sort((s,i)=>s.name.localeCompare(i.name)),this._qrObjectsLoaded=!0}catch{this._showToast(e("action_error",this._lang))}}_toggleQrObject(t,s){let i=new Set(this._qrSelectedEntries);if(i.size===0)for(let a of this._qrObjects)i.add(a.entry_id);s?i.add(t):i.delete(t),i.size===this._qrObjects.length&&i.clear(),this._qrSelectedEntries=i}_toggleQrAction(t,s){let i=new Set(this._qrActions);s?i.add(t):i.delete(t),this._qrActions=i}async _generateBatch(){this._qrBatchLoading=!0,this._qrBatchResults=[];try{let t={type:"maintenance_supporter/qr/batch_generate",actions:[...this._qrActions],url_mode:this._qrUrlMode};this._qrSelectedEntries.size>0&&(t.entry_ids=[...this._qrSelectedEntries]);let s=await this.hass.connection.sendMessagePromise(t);this._qrBatchResults=s.qrs||[],this._qrBatchResults.length===0&&this._showToast(e("qr_print_empty",this._lang))}catch(t){let s=t?.message||e("action_error",this._lang);this._showToast(s)}finally{this._qrBatchLoading=!1}}_printQrs(){if(this._qrBatchResults.length===0)return;let t=this._lang,s=this._qrBatchResults.map(r=>{let h=e("qr_action_"+r.action,t);return`
        <div class="cell">
          <div class="qr">${r.svg}</div>
          <div class="label">
            <div class="obj">${this._escapeHtml(r.object_name)}</div>
            <div class="task">${this._escapeHtml(r.task_name)}</div>
            <div class="action">${this._escapeHtml(h)}</div>
          </div>
        </div>`}).join(""),i=e("qr_print_title",t),a=`<!DOCTYPE html>
<html lang="${this._escapeHtml(t)}">
<head>
  <meta charset="utf-8" />
  <title>${this._escapeHtml(i)}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; color: #000; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { padding: 8mm; }
    .toolbar { padding-bottom: 6mm; display: flex; justify-content: space-between; align-items: center; }
    .toolbar h1 { font-size: 14pt; margin: 0; font-weight: 600; }
    .toolbar button { font: inherit; padding: 6px 14px; cursor: pointer; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6mm; }
    .cell { border: 1px solid #ddd; border-radius: 4px; padding: 4mm; display: flex; flex-direction: column; align-items: center; gap: 3mm; page-break-inside: avoid; break-inside: avoid; }
    .cell .qr { width: 100%; max-width: 50mm; }
    .cell .qr svg { width: 100%; height: auto; display: block; }
    .label { text-align: center; width: 100%; font-size: 9pt; line-height: 1.25; word-break: break-word; }
    .label .obj { font-weight: 600; }
    .label .task { color: #444; }
    .label .action { color: #777; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2mm; }
    @media print {
      .toolbar { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>${this._escapeHtml(i)} \u2014 ${this._qrBatchResults.length}</h1>
    <button onclick="window.print()">${this._escapeHtml(e("qr_print_print_button",t))}</button>
  </div>
  <div class="grid">${s}</div>
  <script>window.addEventListener("load", function () { setTimeout(function () { window.print(); }, 250); });<\/script>
</body>
</html>`,n=window.open("","_blank","width=900,height=1100");if(!n){window.print();return}n.document.open(),n.document.write(a),n.document.close()}_escapeHtml(t){return t.replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[s])}_renderImportExport(t){return o`
      <div class="settings-section">
        <h3>${e("settings_import_export",t)}</h3>
        <div class="settings-actions">
          <label class="export-history-toggle">
            <input type="checkbox" .checked=${this._includeHistory}
              @change=${s=>{this._includeHistory=s.target.checked}} />
            ${e("settings_include_history",t)}
          </label>
        </div>
        <div class="settings-actions">
          ${this._exportObjectsLoaded?o`
              <details class="qr-filter-panel">
                <summary>${e("settings_export_selection",t)}</summary>
                <div class="qr-object-list">
                  ${this._exportObjects.length===0?o`<div class="hint">${e("no_objects",t)}</div>`:this._exportObjects.map(s=>o`
                      <label class="qr-object-row">
                        <input type="checkbox"
                          .checked=${this._exportSelectedEntries.size===0||this._exportSelectedEntries.has(s.entry_id)}
                          @change=${i=>this._toggleExportObject(s.entry_id,i.target.checked)} />
                        <span>${s.name}</span>
                        <span class="qr-task-count">${s.task_count}</span>
                      </label>
                    `)}
                </div>
              </details>
            `:o`<button @click=${this._loadExportObjects}>${e("settings_export_selection",t)}</button>`}
        </div>
        <div class="settings-actions">
          <button @click=${this._exportJson}>${e("settings_export_json",t)}</button>
          <button @click=${this._exportYaml}>${e("settings_export_yaml",t)}</button>
          <button @click=${this._exportCsv}>${e("settings_export_csv",t)}</button>
          <button @click=${this._exportSettings}>${e("settings_export_settings",t)}</button>
        </div>
        <div class="settings-actions docs-archive-block">
          <h4>${e("settings_docs_archive",t)}</h4>
          <p class="section-desc">${e("settings_docs_archive_hint",t)}</p>
          <div class="settings-actions">
            <button ?disabled=${this._docArchiveLoading} @click=${this._exportDocsArchive}>
              ${e("settings_docs_export_btn",t)}
            </button>
            <button ?disabled=${this._docArchiveLoading} @click=${this._triggerDocsArchiveImport}>
              ${this._docArchiveLoading?"\u2026":e("settings_docs_import_btn",t)}
            </button>
            <input class="docs-archive-file" type="file" accept=".zip" hidden
              @change=${this._importDocsArchive} />
          </div>
        </div>
        <div class="import-section">
          <textarea class="import-area" .value=${this._importCsv}
            placeholder=${e("settings_import_placeholder",t)}
            @input=${s=>{this._importCsv=s.target.value}}
          ></textarea>
          <div class="settings-actions">
            <button ?disabled=${!this._importCsv.trim()||this._importLoading}
              @click=${this._importCsvAction}>
              ${this._importLoading?"\u2026":e("settings_import_btn",t)}
            </button>
          </div>
        </div>
      </div>
    `}get _selectedEntryIds(){return this._exportSelectedEntries.size?[...this._exportSelectedEntries]:void 0}async _loadExportObjects(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._exportObjects=(t.objects||[]).map(s=>({entry_id:s.entry_id,name:s.object.name,task_count:(s.tasks||[]).length})).sort((s,i)=>s.name.localeCompare(i.name)),this._exportObjectsLoaded=!0}catch{this._showToast(e("action_error",this._lang))}}_toggleExportObject(t,s){let i=new Set(this._exportSelectedEntries);if(i.size===0)for(let a of this._exportObjects)i.add(a.entry_id);s?i.add(t):i.delete(t),i.size===this._exportObjects.length&&i.clear(),this._exportSelectedEntries=i}async _exportJson(){try{let t=this._selectedEntryIds,s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/export",format:"json",include_history:this._includeHistory,...t?{entry_ids:t}:{}}),i=new Date().toISOString().slice(0,10);this._downloadFile(s.data,`maintenance_export_${i}.json`,"application/json"),this._showToast(e("settings_export_success",this._lang))}catch{this._showToast(e("action_error",this._lang))}}async _exportSettings(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings/export"}),s=new Date().toISOString().slice(0,10);this._downloadFile(t.data,`maintenance_settings_${s}.json`,"application/json"),this._showToast(e("settings_export_success",this._lang))}catch{this._showToast(e("action_error",this._lang))}}async _exportYaml(){try{let t=this._selectedEntryIds,s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/export",format:"yaml",include_history:this._includeHistory,...t?{entry_ids:t}:{}}),i=new Date().toISOString().slice(0,10);this._downloadFile(s.data,`maintenance_export_${i}.yaml`,"application/yaml"),this._showToast(e("settings_export_success",this._lang))}catch{this._showToast(e("action_error",this._lang))}}async _exportCsv(){try{let t=this._selectedEntryIds,s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/export",...t?{entry_ids:t}:{}}),i=new Date().toISOString().slice(0,10);this._downloadFile(s.csv,`maintenance_export_${i}.csv`,"text/csv"),this._showToast(e("settings_export_success",this._lang))}catch{this._showToast(e("action_error",this._lang))}}async _importCsvAction(){let t=this._importCsv.trim();if(t){this._importLoading=!0;try{let s=t.startsWith("object_name"),a=(await this.hass.connection.sendMessagePromise(s?{type:"maintenance_supporter/csv/import",csv_content:t}:{type:"maintenance_supporter/json/import",json_content:t})).created??0;this._showToast(e("settings_import_success",this._lang).replace("{count}",String(a))),this._importCsv="",this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(e("action_error",this._lang))}this._importLoading=!1}}async _exportDocsArchive(){this._docArchiveLoading=!0;try{let t=this._selectedEntryIds,s=t?`?entry_ids=${encodeURIComponent(t.join(","))}`:"",i=await I(this.hass,`/api/maintenance_supporter/documents/archive${s}`);H(i,"maintenance-documents.zip")}catch{this._showToast(e("action_error",this._lang))}this._docArchiveLoading=!1}_triggerDocsArchiveImport(){this.renderRoot.querySelector(".docs-archive-file")?.click()}async _importDocsArchive(t){let s=t.target,i=s.files?.[0];if(i){this._docArchiveLoading=!0;try{let a=new FormData;a.append("file",i,i.name);let n=await fetch("/api/maintenance_supporter/documents/archive",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:a});if(!n.ok)this._showToast(e("action_error",this._lang));else{let r=await n.json();this._showToast(e("settings_docs_import_success",this._lang).replace("{blobs}",String(r.blobs_written??0)).replace("{docs}",String(r.documents_created??0))),this.dispatchEvent(new CustomEvent("settings-changed"))}}catch{this._showToast(e("action_error",this._lang))}s.value="",this._docArchiveLoading=!1}}};l.styles=q`
    :host { display: block; }

    .settings-loading {
      text-align: center;
      padding: 32px;
      color: var(--secondary-text-color);
    }

    .settings-section {
      margin-bottom: 24px;
      padding: 16px;
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
    }
    .settings-section h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
    }
    .section-desc {
      font-size: 13px;
      color: var(--secondary-text-color);
      margin: 0 0 16px 0;
    }

    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer;
      gap: 12px;
    }
    .notify-per-person {
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .notify-person-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 0 0;
      flex-wrap: wrap;
    }
    .notify-person-name {
      font-weight: 500;
      min-width: 120px;
    }
    .notify-person-target {
      flex: 1;
      min-width: 160px;
      font-size: 0.9em;
      word-break: break-word;
      color: var(--secondary-text-color, #727272);
    }
    .notify-person-target.muted {
      font-style: italic;
    }
    /* v2.27: template gallery clustered by category */
    .tpl-group { margin-top: 14px; }
    .tpl-group-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0 6px;
      border-bottom: 2px solid var(--divider-color, #e0e0e0);
      cursor: pointer;
      font-weight: 600;
    }
    .tpl-group-head ha-icon { --mdc-icon-size: 18px; color: var(--primary-color); }
    .tpl-group-head .tpl-chevron { color: var(--secondary-text-color); }
    .tpl-group-head:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .tpl-group-name { flex: 1; }
    .tpl-group-count {
      font-size: 12px;
      color: var(--secondary-text-color);
      font-weight: 400;
    }
    .tpl-row { padding-left: 26px; }
    .setting-row:last-child { border-bottom: none; }
    .setting-row.sub-row {
      padding-left: 16px;
    }

    .setting-label { font-size: 14px; display: block; }
    .setting-desc { font-size: 12px; color: var(--secondary-text-color); display: block; }

    .setting-row input[type="checkbox"] {
      width: 18px; height: 18px; flex-shrink: 0;
    }
    .setting-row input[type="number"],
    .setting-row input[type="text"],
    .setting-row input[type="time"] {
      width: 120px;
      padding: 6px 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
      flex-shrink: 0;
    }
    .setting-row input[type="number"] {
      text-align: right;
    }
    .setting-row select {
      padding: 6px 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
      flex-shrink: 0;
    }

    .settings-actions {
      display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;
    }
    .settings-actions button {
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 14px;
    }
    .settings-actions button:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .settings-actions button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .export-history-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .export-history-toggle input { width: 16px; height: 16px; }

    .import-section { margin-top: 16px; }

    .import-area {
      width: 100%;
      min-height: 120px;
      padding: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      resize: vertical;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      box-sizing: border-box;
    }

    .settings-toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color, #03a9f4);
      color: #fff;
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,.3);
      animation: toast-in .3s ease;
    }
    @keyframes toast-in {
      from { opacity: 0; transform: translateX(-50%) translateY(16px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* ─── Vacation mode section (v1.2.0) ─── */

    .vacation-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .vac-badge {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .vac-badge.active {
      background: var(--success-color, #4caf50);
      color: #fff;
    }
    .vac-badge.stale {
      background: var(--warning-color, #ff9800);
      color: #fff;
    }
    .vac-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      margin: 8px 0 12px;
    }
    .vac-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }
    .vac-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .vac-field input {
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .vac-exempt-panel {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 10px;
      margin: 12px 0;
    }
    .vac-exempt-panel summary {
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-badge {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 1px 8px;
      border-radius: 10px;
    }
    .vac-task-list {
      max-height: 280px;
      overflow-y: auto;
      margin-top: 8px;
    }
    .vac-task-group {
      margin: 8px 0;
    }
    .vac-task-group-name {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
      padding: 4px 0;
    }
    .vac-task-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
    }
    .vac-task-row:hover { background: var(--secondary-background-color, rgba(127,127,127,0.1)); }
    .vac-preview-toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 12px 0 8px;
    }
    .vac-preview-count {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .vac-preview-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .vac-preview-row {
      display: flex;
      gap: 12px;
      padding: 10px 12px;
      background: var(--secondary-background-color, rgba(127,127,127,0.08));
      border-radius: 6px;
      border-left: 3px solid var(--warning-color, #ff9800);
    }
    .vac-preview-row.exempt {
      border-left-color: var(--success-color, #4caf50);
    }
    .vac-preview-info { flex: 1; }
    .vac-preview-name { font-size: 14px; }
    .vac-preview-kind {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-left: 6px;
    }
    .vac-preview-events {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .vac-preview-actions {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .vac-preview-actions button {
      font-size: 12px;
      padding: 4px 10px;
    }
    .vac-notify-on { background: var(--success-color, #4caf50) !important; color: #fff; }
    .vac-end-now {
      margin-top: 12px;
      background: var(--error-color, #f44336);
      color: #fff;
    }

    /* ─── Print QR codes section (v1.1.0) ─── */

    .qr-filter-panel {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 12px;
      margin-top: 8px;
    }
    .qr-filter-panel > summary {
      cursor: pointer;
      font-weight: 500;
    }
    .qr-filter-group {
      margin-top: 12px;
    }
    .qr-filter-label {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .qr-object-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 4px 12px;
      max-height: 240px;
      overflow-y: auto;
    }
    .qr-object-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 6px;
      cursor: pointer;
      border-radius: 4px;
    }
    .qr-object-row:hover { background: var(--secondary-background-color, rgba(127,127,127,0.1)); }
    .qr-object-row > span:nth-of-type(1) { flex: 1; }
    .qr-task-count {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }

    .qr-action-chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .qr-action-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 14px;
      border: 1px solid var(--divider-color);
      cursor: pointer;
      user-select: none;
    }
    .qr-action-chip.active {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      border-color: transparent;
    }
    .qr-action-chip input { accent-color: currentColor; }

    .qr-filter-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .qr-estimate { font-size: 13px; }
    .qr-estimate.error { color: var(--error-color, #f44336); }

    .qr-results-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      padding: 8px 12px;
      background: var(--secondary-background-color, rgba(127,127,127,0.1));
      border-radius: 6px;
    }

    .qr-print-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .qr-print-cell {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      background: #fff;
      color: #000;
    }
    .qr-print-cell .qr-svg {
      width: 100%;
      max-width: 160px;
    }
    .qr-print-cell .qr-svg svg { width: 100%; height: auto; display: block; }
    .qr-label {
      margin-top: 6px;
      font-size: 11px;
      line-height: 1.3;
    }
    .qr-label-obj { font-weight: 600; }
    .qr-label-task { color: #444; }
    .qr-label-action {
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 10px;
      color: #777;
    }

    /* ─── Print stylesheet ─── */
    @media print {
      /* Strip everything except the QR grid itself */
      :host { color: #000; background: #fff; }
      .qr-print-section h3,
      .qr-print-section .section-desc,
      .qr-filter-panel,
      .qr-results-toolbar,
      .settings-section:not(.qr-print-section),
      .settings-toast {
        display: none !important;
      }
      .qr-print-section { padding: 0; margin: 0; }
      .qr-print-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 12mm 8mm;
        margin: 0;
      }
      .qr-print-cell {
        border: none;
        padding: 0;
        page-break-inside: avoid;
      }
      .qr-print-cell .qr-svg { max-width: 48mm; }
      .qr-label { font-size: 9pt; }
    }
  `,c([x({attribute:!1})],l.prototype,"hass",2),c([x({attribute:!1})],l.prototype,"features",2),c([x({attribute:!1})],l.prototype,"budget",2),c([d()],l.prototype,"_settings",2),c([d()],l.prototype,"_loading",2),c([d()],l.prototype,"_importCsv",2),c([d()],l.prototype,"_importLoading",2),c([d()],l.prototype,"_includeHistory",2),c([d()],l.prototype,"_toast",2),c([d()],l.prototype,"_testingNotification",2),c([d()],l.prototype,"_personTargets",2),c([d()],l.prototype,"_testingUser",2),c([d()],l.prototype,"_users",2),c([d()],l.prototype,"_savedViews",2),c([d()],l.prototype,"_vacEnabled",2),c([d()],l.prototype,"_vacStart",2),c([d()],l.prototype,"_vacEnd",2),c([d()],l.prototype,"_vacBuffer",2),c([d()],l.prototype,"_vacExempt",2),c([d()],l.prototype,"_vacIsActive",2),c([d()],l.prototype,"_vacWindowEnd",2),c([d()],l.prototype,"_vacAllTasks",2),c([d()],l.prototype,"_vacPreview",2),c([d()],l.prototype,"_vacPreviewLoading",2),c([d()],l.prototype,"_vacSaving",2),c([d()],l.prototype,"_qrObjects",2),c([d()],l.prototype,"_qrSelectedEntries",2),c([d()],l.prototype,"_qrActions",2),c([d()],l.prototype,"_qrUrlMode",2),c([d()],l.prototype,"_qrBatchLoading",2),c([d()],l.prototype,"_qrBatchResults",2),c([d()],l.prototype,"_qrObjectsLoaded",2),c([d()],l.prototype,"_exportObjects",2),c([d()],l.prototype,"_exportSelectedEntries",2),c([d()],l.prototype,"_exportObjectsLoaded",2),c([d()],l.prototype,"_docArchiveLoading",2),c([d()],l.prototype,"_allTemplates",2),c([d()],l.prototype,"_templateCategories",2),c([d()],l.prototype,"_tplOpenGroups",2);customElements.define("maintenance-settings-view",l);export{l as MaintenanceSettingsView};
/*! Bundled license information:

lit-html/directive.js:
lit-html/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
