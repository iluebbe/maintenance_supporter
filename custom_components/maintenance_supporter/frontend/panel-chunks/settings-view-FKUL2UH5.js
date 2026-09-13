/*! maintenance_supporter frontend 2.86.0 */
import{a as H,c as P}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-A6LVKMPW.js";import{a as D,g as k,k as W}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-TF6DLWEC.js";import{a as Y}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-XKVTMCJS.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-EPXIDVO3.js";import{a as M,b as U}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-D52RXZ4R.js";import{a as F,b as K,c as G,e as Q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZLVS6B3E.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-FE4LECIX.js";import{N,a as d,b as C,c as r,e as $,f as c,g as I,h as B,l as S,m as p,q as s,s as O,v as j}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WG3MZHOS.js";var y={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},A=g=>(..._)=>({_$litDirective$:g,values:_}),w=class{constructor(_){}get _$AU(){return this._$AM._$AU}_$AT(_,e,t){this._$Ct=_,this._$AM=e,this._$Ci=t}_$AS(_,e){return this.update(_,e)}update(_,e){return this.render(...e)}};var E=class extends w{constructor(_){if(super(_),this.it=c,_.type!==y.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(_){if(_===c||_==null)return this._t=void 0,this.it=_;if(_===$)return _;if(typeof _!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(_===this.it)return this._t;this.it=_;let e=[_];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};E.directiveName="unsafeHTML",E.resultType=1;var V=A(E);var{I:de}=I;var J=g=>g.strings===void 0;var ee={},X=(g,_=ee)=>g._$AH=_;var x=A(class extends w{constructor(g){if(super(g),g.type!==y.PROPERTY&&g.type!==y.ATTRIBUTE&&g.type!==y.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!J(g))throw Error("`live` bindings can only contain a single expression")}render(g){return g}update(g,[_]){if(_===$||_===c)return _;let e=g.element,t=g.name;if(g.type===y.PROPERTY){if(_===e[t])return $}else if(g.type===y.BOOLEAN_ATTRIBUTE){if(!!_===e.hasAttribute(t))return $}else if(g.type===y.ATTRIBUTE&&e.getAttribute(t)===_+"")return $;return X(g),_}});var R={default_warning_days:[0,365],default_consumable_threshold:[1,90],battery_low_percent:[1,90],archive_oneoff_days:[0,3650],delete_archived_oneoff_days:[0,3650],notify_due_soon_interval_hours:[0,720],notify_overdue_interval_hours:[0,720],notify_triggered_interval_hours:[0,720],max_notifications_per_day:[0,1e3],notification_bundle_threshold:[2,20],snooze_duration_hours:[1,168],warranty_reminder_days:[1,365],budget_alert_threshold:[10,100],currency_decimals:[0,3]};function Z(g){let _=R[g];if(!_)throw new Error(`not an int-ranged setting: ${g}`);return _}var te=["EUR","USD","GBP","JPY","CHF","CAD","AUD","NZD","CNY","INR","BRL","CZK","PLN","RUB","SEK","NOK","DKK","UAH"],se=(([g,_])=>Array.from({length:_-g+1},(e,t)=>g+t))(R.currency_decimals),l=class extends B{constructor(){super(...arguments);this.budget=null;this._settings=null;this._loading=!0;this._importCsv="";this._importLoading=!1;this._includeHistory=!0;this._toast="";this._testingNotification=!1;this._personTargets=[];this._testingUser="";this._users=[];this._savedViews=[];this._vacEnabled=!1;this._vacStart="";this._vacEnd="";this._vacBuffer=3;this._vacExempt=new Set;this._vacIsActive=!1;this._vacWindowEnd=null;this._vacAllTasks=[];this._vacPreview=[];this._vacPreviewLoading=!1;this._previewBusy=!1;this._vacSaving=!1;this._qrObjects=[];this._qrSelectedEntries=new Set;this._qrActions=new Set(["view"]);this._qrUrlMode="companion";this._qrBatchLoading=!1;this._qrBatchResults=[];this._qrObjectsLoaded=!1;this._exportObjects=[];this._exportSelectedEntries=new Set;this._exportObjectsLoaded=!1;this._docArchiveLoading=!1;this._loaded=!1;this._userService=null;this._sendTestNotification=async e=>{e?this._testingUser=e:this._testingNotification=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/test_notification",...e?{user_id:e}:{}}),i=t.message||(t.success?s("test_notification_success",this._lang):s("test_notification_failed",this._lang));this._showToast(i)}catch{this._showToast(s("test_notification_failed",this._lang))}finally{e?this._testingUser="":this._testingNotification=!1}};this._allTemplates=[];this._templateCategories={};this._tplOpenGroups=new Set;this._templatesRequested=!1}get _lang(){return O(this.hass)}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._loaded?(this._loaded=!0,this._userService=new Q(this.hass),this._loadSettings(),this._loadUsers()):e.has("hass")&&this.hass&&this._userService&&this._userService.updateHass(this.hass)}async _loadUsers(){if(this._userService){try{this._users=await this._userService.getUsers()}catch{this._users=[]}this._loadNotifyTargets()}}async _loadNotifyTargets(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/notify/user_targets"});this._personTargets=e.targets||[]}catch{this._personTargets=[]}}async _loadSettings(){this._loading=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});this._settings=e,j(this._settings.budget),this._hydrateVacationFromSettings()}catch{}try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._savedViews=e.views||[]}catch{}this._loading=!1}_hydrateVacationFromSettings(){let e=this._settings?.vacation;e&&(this._vacEnabled=e.enabled,this._vacStart=e.start||"",this._vacEnd=e.end||"",this._vacBuffer=e.buffer_days,this._vacExempt=new Set(e.exempt_task_ids||[]),this._vacIsActive=e.is_active,this._vacWindowEnd=e.window_end)}_renderBatteryLifetimes(e){let t=this._settings?.general?.battery_lifetimes;if(!t||!t.length)return c;let i=this._settings?.general?.battery_lifetime_months??{},a=u=>s("lifetime_source_"+u.source,e),n=s("settings_battery_lifetime_months",e),o=u=>u.learned_models.length?r`<div class="bl-learned">${s("settings_battery_lifetime_learned_models",e).replace("{list}",u.learned_models.map(f=>`${f.model} ${f.months} ${n} (${f.samples})`).join(" \xB7 "))}</div>`:c,h=(u,f,z)=>{let q=Number.parseInt(f.value,10);if(!Number.isFinite(q)||q<1||q>240){f.value=String(z);return}this._updateSetting("battery_lifetime_months",{...i,[u]:q}).then(L=>{L||(f.value=String(z))})},b=u=>{let f={...i};delete f[u],this._updateSetting("battery_lifetime_months",f)},v=t.filter(u=>u.in_fleet),m=t.filter(u=>!u.in_fleet),T=u=>r`
      <div class="bl-row ${u.source==="override"?"bl-override":""}">
        <span class="bl-type">${u.type}${u.in_fleet?r` <span class="bl-fleet">${s("settings_battery_lifetime_in_fleet",e)}</span>`:c}</span>
        <input class="bl-months" type="number" min="1" max="240" .value=${String(u.months)}
          @change=${f=>h(u.type,f.target,u.months)} />
        <span class="bl-unit">${s("settings_battery_lifetime_months",e)}</span>
        <span class="bl-source">${a(u)}</span>
        ${u.source==="override"?r`<button type="button" class="bl-reset" @click=${()=>b(u.type)}>${s("settings_battery_lifetime_reset",e)}</button>`:c}
        ${o(u)}
      </div>`;return r`
      <h4 class="bl-title">${s("settings_battery_lifetimes",e)}</h4>
      <div class="setting-hint">${s("settings_battery_lifetimes_hint",e)}</div>
      <div class="bl-table">
        ${v.map(T)}
        ${m.length?r`<details class="bl-more"><summary>${m.length} ×</summary>${m.map(T)}</details>`:c}
      </div>
    `}_renderBatteryNotesHint(e){let t=this._settings?.general?.battery_notes;if(!t||!t.devices)return c;let i=this._settings?.general?.battery_low_percent??20,a=t.default>i,n=s("bn_summary",e).replace("{name}","Battery Notes").replace("{pct}",String(t.default)).replace("{n}",String(t.devices)),o=(a?s("bn_above_floor",e).replace("{name}","Battery Notes"):s("bn_floor_decides",e)).replace("{floor}",String(i)),h=n.search(/[:：]/),b=h<0?n:n.slice(0,h),v=h<0?"":n.slice(h);return r`
      <div class="bn-note${a?" warn":""}">
        <ha-icon icon="${a?"mdi:alert-outline":"mdi:battery-heart-variant"}"></ha-icon>
        <span>
          <a class="bn-link" href="/config/integrations/integration/battery_notes">${b}</a>${v}
          ${t.overrides.length?r` · ${s("bn_overrides",e).replace("{n}",String(t.overrides.length+t.more))}
                ${t.overrides.map((m,T)=>r`${T?" \xB7 ":" "}${m.device_id?r`<a class="bn-link" href="/config/devices/device/${m.device_id}">${m.name}</a>`:m.name} (${m.threshold} %)`)}
                ${t.more?r` <span class="bn-more">${s("bn_more",e).replace("{n}",String(t.more))}</span>`:c}`:c}
          <span class="bn-sub">${o}</span>
        </span>
      </div>`}_renderMemberAvatars(e){if(!this._users.length)return c;let t=this._settings?.member_display||{};return r`
      <div class="settings-section member-avatars" data-section="member_avatars">
        <h3>${s("member_avatars",e)}</h3>
        <p class="section-desc">${s("member_avatars_hint",e)}</p>
        ${this._users.map(i=>{let a=K(i),n=t[i.id]||{};return r`
            <div class="member-avatar-row">
              ${G(a)}
              <span class="member-avatar-name">${i.name}</span>
              <input class="member-initials" type="text" maxlength="3" autocomplete="off"
                aria-label="${s("member_initials",e)}"
                placeholder="${a.initials}"
                .value=${n.initials??""}
                @change=${o=>this._setMemberAvatar(i.id,{initials:o.target.value})} />
              <span class="member-palette" role="radiogroup" aria-label="${s("member_color",e)}">
                ${F.map(o=>r`
                  <button type="button" class="member-swatch${a.color===o?" selected":""}"
                    style="--person-color: ${o}" title=${o} aria-label=${o}
                    @click=${()=>this._setMemberAvatar(i.id,{color:o})}></button>`)}
              </span>
              ${n.initials||n.color?r`<button class="ha-button secondary member-reset" @click=${()=>this._setMemberAvatar(i.id,null)}>${s("member_avatar_reset",e)}</button>`:c}
            </div>`})}
      </div>`}async _setMemberAvatar(e,t){let i={...this._settings?.member_display||{}};if(t===null)delete i[e];else{let a={...i[e]||{},...t};"initials"in t&&!(t.initials||"").trim()&&delete a.initials,Object.keys(a).length?i[e]=a:delete i[e]}await this._updateSetting("member_display",i);try{this._users=await this._userService?.getUsers(!0)??this._users}catch{}}async _updateSetting(e,t){let i=await this._ws({type:"maintenance_supporter/global/update",settings:{[e]:t}});return i?(this._settings=i,j(this._settings.budget),W(),this._showToast(s("settings_saved",this._lang)),this.dispatchEvent(new CustomEvent("settings-changed")),!0):(this.requestUpdate(),!1)}_showToast(e){this._toast=e,setTimeout(()=>{this._toast=""},3e3)}_ws(e,t,i){return Y(this,e,{fallbackKey:t,busy:i,onError:a=>this._showToast(a)})}_onBoundedIntChange(e,t,i,a,n){let o=e.target,h=parseInt(o.value,10);if(Number.isInteger(h)&&h>=i&&h<=a){this._updateSetting(t,h).then(b=>{b||(o.value=String(n))});return}this._showToast(s("settings_value_out_of_range",this._lang).replace("{min}",String(i)).replace("{max}",String(a))),o.value=String(n)}_intSetting(e,t){let[i,a]=Z(e);return r`<input type="number" min=${i} max=${a} .value=${String(t)}
      @change=${n=>this._onBoundedIntChange(n,e,i,a,t)} />`}_downloadFile(e,t,i){M(e,t,i)}render(){let e=this._lang;return this._loading||!this._settings?r`<div class="settings-loading">Loading…</div>`:r`
      ${this._renderFeatures(e)}
      ${this._renderPanelAccess(e)}
      ${this._renderMemberAvatars(e)}
      ${this._renderGeneral(e)}
      ${this._renderObjectsColumns(e)}
      ${this._settings.general.notifications_enabled?this._renderNotifications(e):c}
      ${this.features.budget?this._renderBudget(e):c}
      ${this._renderArchive(e)}
      ${this._renderVacation(e)}
      ${this._renderPrintQr(e)}
      ${this._renderImportExport(e)}
      ${this._renderTemplateToggles(e)}
      ${this._toast?r`<div class="settings-toast">${this._toast}</div>`:c}
    `}scrollToSection(e){requestAnimationFrame(()=>{let t=this.shadowRoot;if(!t)return;let i=t.querySelector(`[data-section="${e}"]`)??t.querySelector(`[data-section-alt="${e}"]`);i&&i.scrollIntoView({behavior:"smooth",block:"start"})})}_renderPanelAccess(e){let t=new Set(this._settings.admin_panel_user_ids||[]),i=this._users.filter(o=>!o.is_admin),a=this._settings.operator_write_enabled??!1,n=(o,h)=>{let b=new Set(t);h?b.add(o):b.delete(o),this._updateSetting("admin_panel_user_ids",[...b])};return r`
      <div class="settings-section">
        <h3>${s("settings_panel_access",e)} ${a&&t.size>0?r`<span class="section-badge">${t.size}</span>`:c}</h3>
        <p class="section-desc">${s("settings_panel_access_desc",e)}</p>
        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_operator_write",e)}</span>
            <span class="setting-desc">${s("settings_operator_write_desc",e)}</span>
          </span>
          <input type="checkbox"
            .checked=${a}
            @change=${o=>this._updateSetting("operator_write_enabled",o.target.checked)} />
        </label>
        ${a?i.length===0?r`<div class="setting-row hint">${s("no_non_admin_users",e)}</div>`:i.map(o=>r`
              <label class="setting-row">
                <span>
                  <span class="setting-label">${o.name||o.id.slice(0,8)}</span>
                  <span class="setting-desc">${o.is_owner?s("owner_label",e):""}</span>
                </span>
                <input type="checkbox"
                  .checked=${t.has(o.id)}
                  @change=${h=>n(o.id,h.target.checked)} />
              </label>
            `):c}
      </div>
    `}_renderFeatures(e){let t=this._settings.features,i=[{key:"adaptive",settingKey:"advanced_adaptive_visible",label:s("feat_adaptive",e),desc:s("feat_adaptive_desc",e)},{key:"predictions",settingKey:"advanced_predictions_visible",label:s("feat_predictions",e),desc:s("feat_predictions_desc",e)},{key:"seasonal",settingKey:"advanced_seasonal_visible",label:s("feat_seasonal",e),desc:s("feat_seasonal_desc",e)},{key:"environmental",settingKey:"advanced_environmental_visible",label:s("feat_environmental",e),desc:s("feat_environmental_desc",e)},{key:"budget",settingKey:"advanced_budget_visible",label:s("feat_budget",e),desc:s("feat_budget_desc",e)},{key:"groups",settingKey:"advanced_groups_visible",label:s("feat_groups",e),desc:s("feat_groups_desc",e)},{key:"checklists",settingKey:"advanced_checklists_visible",label:s("feat_checklists",e),desc:s("feat_checklists_desc",e)},{key:"schedule_time",settingKey:"advanced_schedule_time_visible",label:s("feat_schedule_time",e),desc:s("feat_schedule_time_desc",e)},{key:"completion_actions",settingKey:"advanced_completion_actions_visible",label:s("feat_completion_actions",e),desc:s("feat_completion_actions_desc",e)}];return r`
      <div class="settings-section" data-section="settings" data-section-alt="groups">
        <h3>${s("settings_features",e)}</h3>
        <p class="section-desc">${s("settings_features_desc",e)}</p>
        ${i.map(a=>r`
          <label class="setting-row">
            <span>
              <span class="setting-label">${a.label}</span>
              <span class="setting-desc">${a.desc}</span>
            </span>
            <input type="checkbox" .checked=${t[a.key]}
              @change=${n=>this._updateSetting(a.settingKey,n.target.checked)} />
          </label>
        `)}
      </div>
    `}async _loadTemplates(){if(!this._templatesRequested){this._templatesRequested=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._allTemplates=e.templates||[],this._templateCategories=e.categories||{}}catch{}}}_renderTemplateToggles(e){this._loadTemplates();let t=new Set(this._settings.disabled_template_ids||[]),i=new Map;for(let n of Object.keys(this._templateCategories))i.set(n,[]);for(let n of this._allTemplates)i.has(n.category)||i.set(n.category,[]),i.get(n.category).push(n);let a=n=>this._templateCategories[n]?.["name_"+e]||this._templateCategories[n]?.name_en||n;return r`
      <div class="settings-section" data-section="templates">
        <h3>${s("settings_templates_label",e)}</h3>
        <p class="section-desc">${s("settings_templates_hint",e)}</p>
        ${[...i.entries()].filter(([,n])=>n.length>0).map(([n,o])=>{let h=o.filter(v=>!t.has(v.id)).length,b=this._tplOpenGroups.has(n);return r`
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
                <span class="tpl-group-count">${h}/${o.length}</span>
                <input
                  type="checkbox"
                  title=${s("settings_templates_toggle_group",e)}
                  .checked=${h===o.length}
                  @click=${v=>v.stopPropagation()}
                  @change=${v=>this._toggleTemplateGroup(o.map(m=>m.id),v.target.checked)}
                />
              </div>
              ${b?o.map(v=>r`
                    <label class="setting-row tpl-row">
                      <span class="setting-label">${v.name}</span>
                      <input
                        type="checkbox"
                        .checked=${!t.has(v.id)}
                        @change=${m=>this._toggleTemplate(v.id,m.target.checked)}
                      />
                    </label>
                  `):c}
            </div>
          `})}
      </div>
    `}_toggleTemplate(e,t){let i=new Set(this._settings.disabled_template_ids||[]);t?i.delete(e):i.add(e),this._updateSetting("disabled_template_ids",[...i])}_toggleTplGroupOpen(e){let t=new Set(this._tplOpenGroups);t.has(e)?t.delete(e):t.add(e),this._tplOpenGroups=t}_toggleTemplateGroup(e,t){let i=new Set(this._settings.disabled_template_ids||[]);for(let a of e)t?i.delete(a):i.add(a);this._updateSetting("disabled_template_ids",[...i])}_renderObjectsColumns(e){let t=P(this._settings.objects_table_columns);return r`
      <div class="settings-section" data-section="objects_table_columns">
        <h3>${s("objects_table_columns_label",e)}</h3>
        <p class="section-desc">${s("objects_table_columns_hint",e)}</p>
        ${H.map(i=>r`
          <label class="setting-row">
            <span class="setting-label">${s(i.labelKey,e)}</span>
            <input
              type="checkbox"
              .checked=${t.includes(i.key)}
              ?disabled=${!!i.required}
              @change=${a=>this._toggleColumn(i.key,a.target.checked)}
            />
          </label>
        `)}
      </div>
    `}_toggleColumn(e,t){let i=new Set(P(this._settings.objects_table_columns));t?i.add(e):i.delete(e);let a=H.filter(n=>n.required||i.has(n.key)).map(n=>n.key);this._updateSetting("objects_table_columns",a)}_renderGeneral(e){let t=this._settings.general,i=t.notify_targets??[],a=this._settings.budget;return r`
      <div class="settings-section">
        <h3>${s("settings_general",e)}</h3>
        <label class="setting-row">
          <span class="setting-label">${s("settings_default_warning",e)}</span>
          <!-- No live() on the typed number inputs below (bug audit
               2026-09-12, #176 class): a hass re-render must not reset a
               half-typed value; rejects snap back via _onBoundedIntChange. -->
          <!-- 0 = no warning window (due soon only on the due date) — #145. -->
          ${this._intSetting("default_warning_days",t.default_warning_days)}
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_consumable_threshold",e)}</span>
          ${this._intSetting("default_consumable_threshold",t.default_consumable_threshold??10)}
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_battery_low_percent",e)}</span>
          ${this._intSetting("battery_low_percent",t.battery_low_percent??20)}
        </label>
        ${this._renderBatteryNotesHint(e)}
        ${this._renderBatteryLifetimes(e)}
        <div class="setting-hint">${s("settings_thresholds_hint",e)}</div>
        <label class="setting-row">
          <span class="setting-label">${s("settings_row_actions",e)}</span>
          <select .value=${x(t.row_action_style||"buttons_compact")}
            @change=${n=>this._updateSetting("row_action_style",n.target.value)}>
            ${["buttons_compact","buttons","icons"].map(n=>r`
              <option value=${n} ?selected=${(t.row_action_style||"buttons_compact")===n}>${s(`row_actions_${n}`,e)}</option>`)}
          </select>
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_ref_numbers_in_lists",e)}</span>
          <input type="checkbox" class="refs-in-lists" .checked=${t.ref_numbers_in_lists===!0}
            @change=${n=>this._updateSetting("ref_numbers_in_lists",n.target.checked)} />
        </label>
        <div class="setting-hint">${s("settings_ref_numbers_in_lists_hint",e)}</div>
        <label class="setting-row">
          <span class="setting-label">${s("settings_currency",e)}</span>
          <select .value=${x(a.currency)} @change=${n=>this._updateSetting("budget_currency",n.target.value)}>
            ${te.map(n=>r`<option value=${n} ?selected=${a.currency===n}>${n}</option>`)}
          </select>
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_currency_decimals",e)}</span>
          <select class="currency-decimals" .value=${x(String(a.currency_decimals??0))}
            @change=${n=>this._updateSetting("currency_decimals",Number(n.target.value))}>
            ${se.map(n=>r`<option value=${String(n)} ?selected=${(a.currency_decimals??0)===n}>${n}</option>`)}
          </select>
        </label>
        <div class="setting-hint">${s("settings_currency_decimals_hint",e)}</div>
        <label class="setting-row">
          <span class="setting-label">${s("settings_panel_enabled",e)}</span>
          <input type="checkbox" .checked=${t.panel_enabled}
            @change=${n=>this._updateSetting("panel_enabled",n.target.checked)} />
        </label>
        ${t.panel_enabled?r`
          <label class="setting-row">
            <span class="setting-label">${s("settings_panel_title",e)}</span>
            <input type="text" .value=${t.panel_title??""}
              placeholder="Maintenance"
              maxlength="50"
              @change=${n=>this._updateSetting("panel_title",n.target.value.trim())} />
          </label>
        `:""}
        <label class="setting-row">
          <span class="setting-label">${s("settings_install_assist_sentences",e)}</span>
          <input type="checkbox" .checked=${t.install_assist_sentences??!1}
            @change=${n=>this._updateSetting("install_assist_sentences",n.target.checked)} />
        </label>
        <div class="setting-hint">${s("settings_install_assist_sentences_hint",e)}</div>
        <label class="setting-row">
          <span class="setting-label">${s("settings_notifications",e)}</span>
          <input type="checkbox" .checked=${t.notifications_enabled}
            @change=${n=>this._updateSetting("notifications_enabled",n.target.checked)} />
        </label>
        ${t.notifications_enabled?r`
          <label class="setting-row">
            <span class="setting-label">${s("settings_notify_service",e)}</span>
            <input type="text" list="ms-notify-services" .value=${t.notify_service}
              @change=${n=>this._updateSetting("notify_service",n.target.value.trim())} />
            <datalist id="ms-notify-services">
              ${i.map(n=>r`<option value=${n}></option>`)}
            </datalist>
          </label>
          <div class="setting-row">
            <span class="setting-label">${s("test_notification",e)}</span>
            <button class="ha-button secondary"
              ?disabled=${!t.notify_service||this._testingNotification}
              @click=${()=>this._sendTestNotification()}>
              ${this._testingNotification?s("testing",e):s("send_test",e)}
            </button>
          </div>
          ${this._personTargets.length?r`
            <div class="notify-per-person">
              <span class="setting-label">${s("notify_per_person",e)}</span>
              ${this._personTargets.map(n=>r`
                <div class="notify-person-row">
                  <span class="notify-person-name">${n.name}</span>
                  <span class="notify-person-target ${n.services.length?"":"muted"}">
                    ${n.services.length?n.services.join(", "):s("notify_no_own_device",e)}
                  </span>
                  <button class="ha-button secondary"
                    ?disabled=${!n.services.length||this._testingUser===n.user_id}
                    @click=${()=>this._sendTestNotification(n.user_id)}>
                    ${this._testingUser===n.user_id?s("testing",e):s("send_test",e)}
                  </button>
                </div>
              `)}
            </div>
          `:c}
        `:c}

        <label class="setting-row">
          <span class="setting-label" title=${s("settings_shopping_list_help",e)}>${s("settings_shopping_list",e)}</span>
          <select .value=${x(t.shopping_list_entity||"")}
            @change=${n=>this._updateSetting("shopping_list_entity",n.target.value)}>
            <option value="" ?selected=${!t.shopping_list_entity}>${s("shopping_list_none",e)}</option>
            ${this._todoEntities(t.shopping_list_entity||"").map(n=>r`
              <option value=${n} ?selected=${t.shopping_list_entity===n}>${n}</option>
            `)}
          </select>
        </label>
      </div>
    `}_todoEntities(e){let t=Object.keys(this.hass?.states||{}).filter(i=>i.startsWith("todo.")).sort();return e&&!t.includes(e)&&t.unshift(e),t}_renderNotifications(e){let t=this._settings.notifications,i=this._settings.actions;return r`
      <div class="settings-section">
        <h3>${s("settings_notifications",e)}</h3>

        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_notify_due_soon",e)}</span>
          </span>
          <input type="checkbox" .checked=${t.due_soon_enabled}
            @change=${a=>this._updateSetting("notify_due_soon_enabled",a.target.checked)} />
        </label>
        ${t.due_soon_enabled?r`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_interval_hours",e)}</span>
            ${this._intSetting("notify_due_soon_interval_hours",t.due_soon_interval_hours)}
          </label>
        `:c}

        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_notify_overdue",e)}</span>
          </span>
          <input type="checkbox" .checked=${t.overdue_enabled}
            @change=${a=>this._updateSetting("notify_overdue_enabled",a.target.checked)} />
        </label>
        ${t.overdue_enabled?r`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_interval_hours",e)}</span>
            ${this._intSetting("notify_overdue_interval_hours",t.overdue_interval_hours)}
          </label>
        `:c}

        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_notify_triggered",e)}</span>
          </span>
          <input type="checkbox" .checked=${t.triggered_enabled}
            @change=${a=>this._updateSetting("notify_triggered_enabled",a.target.checked)} />
        </label>
        ${t.triggered_enabled?r`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_interval_hours",e)}</span>
            ${this._intSetting("notify_triggered_interval_hours",t.triggered_interval_hours)}
          </label>
        `:c}

        <label class="setting-row">
          <span class="setting-label">${s("settings_quiet_hours",e)}</span>
          <input type="checkbox" .checked=${t.quiet_hours_enabled}
            @change=${a=>this._updateSetting("quiet_hours_enabled",a.target.checked)} />
        </label>
        ${t.quiet_hours_enabled?r`
          <div class="setting-row sub-row">
            <span class="setting-desc">${s("settings_quiet_start",e)}</span>
            <ms-date-field
              kind="time"
              required
              .hass=${this.hass}
              .lang=${e}
              .value=${t.quiet_hours_start}
              @value-changed=${a=>{let n=a.detail.value;n&&this._updateSetting("quiet_hours_start",n)}}
            ></ms-date-field>
          </div>
          <div class="setting-row sub-row">
            <span class="setting-desc">${s("settings_quiet_end",e)}</span>
            <ms-date-field
              kind="time"
              required
              .hass=${this.hass}
              .lang=${e}
              .value=${t.quiet_hours_end}
              @value-changed=${a=>{let n=a.detail.value;n&&this._updateSetting("quiet_hours_end",n)}}
            ></ms-date-field>
          </div>
        `:c}

        <label class="setting-row">
          <span class="setting-label">${s("settings_max_per_day",e)}</span>
          ${this._intSetting("max_notifications_per_day",t.max_per_day)}
        </label>

        <label class="setting-row">
          <span class="setting-label">${s("settings_bundling",e)}</span>
          <input type="checkbox" .checked=${t.bundling_enabled}
            @change=${a=>this._updateSetting("notification_bundling_enabled",a.target.checked)} />
        </label>
        ${t.bundling_enabled?r`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_bundle_threshold",e)}</span>
            ${this._intSetting("notification_bundle_threshold",t.bundle_threshold)}
          </label>
        `:c}
        <label class="setting-row">
          <span class="setting-label">${s("settings_reminder_leads",e)}</span>
          <input type="text" placeholder="14, 3, 0"
            .value=${(t.reminder_lead_days||[]).join(", ")}
            @change=${a=>{let n=a.target.value.split(",").map(o=>parseInt(o.trim(),10)).filter(o=>Number.isInteger(o)&&o>=0&&o<=365);this._updateSetting("reminder_lead_days",[...new Set(n)])}} />
        </label>
        <div class="setting-hint">${s("settings_reminder_leads_hint",e)}</div>
        <label class="setting-row">
          <span class="setting-label">${s("settings_notify_scope",e)}</span>
          <select
            .value=${x(t.scope_view_id||"")}
            @change=${a=>this._updateSetting("notify_scope_view_id",a.target.value)}
          >
            <option value="" ?selected=${!t.scope_view_id}>${s("settings_notify_scope_all",e)}</option>
            ${this._savedViews.map(a=>r`<option value=${a.id} ?selected=${t.scope_view_id===a.id}>${a.name}</option>`)}
          </select>
        </label>
        <div class="setting-hint">${s("settings_notify_scope_hint",e)}</div>
        <label class="setting-row">
          <span class="setting-label">${s("settings_notify_completed",e)}</span>
          <select class="notify-completed" .value=${x(t.completed||"off")}
            @change=${a=>this._updateSetting("notify_completed",a.target.value)}>
            <option value="off">${s("notify_completed_off",e)}</option>
            <option value="automatic">${s("notify_completed_automatic",e)}</option>
            <option value="all">${s("notify_completed_all",e)}</option>
          </select>
        </label>
        <div class="setting-hint">${s("settings_notify_completed_hint",e)}</div>

        <div class="notify-rule">
        <h4 style="margin: 16px 0 8px; font-size: 14px;">${s("settings_notify_rule",e)}</h4>
        <div class="setting-hint">${s("settings_notify_rule_hint",e)}</div>
        <label class="setting-row">
          <span class="setting-label">${s("settings_notify_event_only",e)}</span>
          <input type="checkbox" .checked=${!!t.event_only}
            @change=${a=>this._updateSetting("notify_event_only",a.target.checked)} />
        </label>
        <div class="setting-hint">${s("settings_notify_event_only_hint",e)}</div>
        <label class="setting-row setting-row-block">
          <span class="setting-label">${s("settings_notify_extra_data",e)}</span>
          <!-- No live(): the view re-renders on every hass update and live()
               would snap the DOM back to the stored value mid-typing (#176). -->
          <textarea class="import-area notify-extra" .value=${t.extra_data||""} maxlength="2000" spellcheck="false"
            placeholder=${'{"category": "maintenance", "critical": {{ priority == "high" }}, "navigate_to": "{{ url }}"}'}
            @change=${a=>this._updateSetting("notify_extra_data",a.target.value)}
          ></textarea>
        </label>
        <div class="setting-hint">${s("settings_notify_extra_data_hint",e)}</div>
        </div>

        <h4 style="margin: 16px 0 8px; font-size: 14px;">${s("settings_actions",e)}</h4>
        <label class="setting-row">
          <span class="setting-label">${s("settings_action_complete",e)}</span>
          <input type="checkbox" .checked=${i.complete_enabled}
            @change=${a=>this._updateSetting("action_complete_enabled",a.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_action_skip",e)}</span>
          <input type="checkbox" .checked=${i.skip_enabled}
            @change=${a=>this._updateSetting("action_skip_enabled",a.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_action_snooze",e)}</span>
          <input type="checkbox" .checked=${i.snooze_enabled}
            @change=${a=>this._updateSetting("action_snooze_enabled",a.target.checked)} />
        </label>
        ${i.snooze_enabled?r`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_snooze_hours",e)}</span>
            ${this._intSetting("snooze_duration_hours",i.snooze_duration_hours)}
          </label>
        `:c}
        <label class="setting-row">
          <span class="setting-label">${s("settings_weekly_digest",e)}</span>
          <input type="checkbox" .checked=${i.weekly_digest_enabled}
            @change=${a=>this._updateSetting("weekly_digest_enabled",a.target.checked)} />
        </label>
        <div class="setting-hint">${s("settings_weekly_digest_hint",e)}</div>
        <label class="setting-row">
          <span class="setting-label">${s("settings_warranty_reminder",e)}</span>
          <input type="checkbox" .checked=${i.warranty_reminder_enabled}
            @change=${a=>this._updateSetting("warranty_reminder_enabled",a.target.checked)} />
        </label>
        ${i.warranty_reminder_enabled?r`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_warranty_reminder_days",e)}</span>
            ${this._intSetting("warranty_reminder_days",i.warranty_reminder_days)}
          </label>
        `:c}
        <div class="setting-hint">${s("settings_warranty_reminder_hint",e)}</div>
      </div>
    `}_renderBudget(e){let t=this._settings.budget;return r`
      <div class="settings-section" data-section="budget">
        <h3>${s("settings_budget",e)}</h3>
        <label class="setting-row">
          <span class="setting-label">${s("settings_budget_monthly",e)}</span>
          <input type="number" min="0" step="0.01" .value=${String(t.monthly)}
            @change=${i=>this._updateSetting("budget_monthly",parseFloat(i.target.value)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_budget_yearly",e)}</span>
          <input type="number" min="0" step="0.01" .value=${String(t.yearly)}
            @change=${i=>this._updateSetting("budget_yearly",parseFloat(i.target.value)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_budget_alerts",e)}</span>
          <input type="checkbox" .checked=${t.alerts_enabled}
            @change=${i=>this._updateSetting("budget_alerts_enabled",i.target.checked)} />
        </label>
        ${t.alerts_enabled?r`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_budget_threshold",e)}</span>
            ${this._intSetting("budget_alert_threshold",t.alert_threshold_pct)}
          </label>
        `:c}
      </div>
    `}_renderArchive(e){let t=this._settings.archive??{oneoff_days:14,delete_archived_oneoff_days:0};return r`
      <div class="settings-section" data-section="archive">
        <h3>${s("settings_archive",e)}</h3>
        <p class="section-desc">${s("settings_archive_desc",e)}</p>
        <label class="setting-row">
          <span class="setting-label">${s("settings_archive_oneoff_days",e)}</span>
          ${this._intSetting("archive_oneoff_days",t.oneoff_days)}
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_delete_archived_oneoff_days",e)}</span>
          ${this._intSetting("delete_archived_oneoff_days",t.delete_archived_oneoff_days)}
        </label>
      </div>
    `}_renderVacation(e){let t=this._vacEnabled&&!this._vacIsActive&&this._vacWindowEnd&&new Date(this._vacWindowEnd)<new Date,i=this._vacExempt.size;return r`
      <div class="settings-section vacation-section" data-section="vacation">
        <h3>
          ${s("vacation_title",e)}
          ${this._vacIsActive?r`<span class="vac-badge active">${s("vacation_active",e)}</span>`:c}
          ${t?r`<span class="vac-badge stale">${s("vacation_ended",e)}</span>`:c}
        </h3>
        <p class="section-desc">${s("vacation_desc",e)}</p>

        <label class="vac-toggle">
          <input type="checkbox" .checked=${this._vacEnabled}
            @change=${a=>this._toggleVacationEnabled(a.target.checked)} />
          ${s("vacation_enable",e)}
        </label>

        <div class="vac-grid">
          <div class="vac-field">
            <span class="filter-label">${s("vacation_start",e)}</span>
            <ms-date-field
              kind="date"
              clearable
              .hass=${this.hass}
              .lang=${e}
              .value=${this._vacStart}
              @value-changed=${a=>this._setVacationDate("start",a.detail.value)}
            ></ms-date-field>
          </div>
          <div class="vac-field">
            <span class="filter-label">${s("vacation_end",e)}</span>
            <ms-date-field
              kind="date"
              clearable
              .hass=${this.hass}
              .lang=${e}
              .value=${this._vacEnd}
              @value-changed=${a=>this._setVacationDate("end",a.detail.value)}
            ></ms-date-field>
          </div>
          <label class="vac-field">
            <span class="filter-label">${s("vacation_buffer",e)}</span>
            <input type="number" min="0" max="14" .value=${String(this._vacBuffer)}
              @change=${a=>this._setVacationBuffer(parseInt(a.target.value,10)||0)} />
          </label>
        </div>

        <details class="vac-exempt-panel">
          <summary>
            ${s("vacation_exempt_title",e)}
            ${i>0?r`<span class="section-badge">${i}</span>`:c}
          </summary>
          <p class="section-desc">${s("vacation_exempt_desc",e)}</p>
          ${this._vacAllTasks.length===0?r`<button @click=${this._loadAllTasksForVacation}>${s("vacation_load_tasks",e)}</button>`:r`
              <div class="vac-task-list">
                ${this._renderVacationTaskList(e)}
              </div>
            `}
        </details>

        ${this._vacStart&&this._vacEnd?r`
          <div class="vac-preview-toolbar">
            <button @click=${this._loadVacationPreview} ?disabled=${this._vacPreviewLoading}>
              ${this._vacPreviewLoading?"\u2026":s("vacation_preview_btn",e)}
            </button>
            ${this._vacPreview.length>0?r`<span class="vac-preview-count">${this._vacPreview.length} ${s("vacation_preview_affected",e)}</span>`:c}
          </div>
          ${this._vacPreview.length>0?this._renderVacationPreview(e):c}
        `:c}

        ${this._vacIsActive||t?r`<button class="vac-end-now" @click=${this._endVacationNow}>
              ${s("vacation_end_now",e)}
            </button>`:c}
      </div>
    `}_renderVacationTaskList(e){let t=new Map;for(let a of this._vacAllTasks){let n=t.get(a.object_name)||[];n.push(a),t.set(a.object_name,n)}return[...t.entries()].sort(([a],[n])=>a.localeCompare(n)).map(([a,n])=>r`
      <div class="vac-task-group">
        <div class="vac-task-group-name">${a||s("no_objects",e)}</div>
        ${n.sort((o,h)=>o.task_name.localeCompare(h.task_name)).map(o=>r`
            <label class="vac-task-row">
              <input type="checkbox"
                .checked=${this._vacExempt.has(o.task_id)}
                @change=${h=>this._toggleVacationExempt(o.task_id,h.target.checked)} />
              <span>${o.task_name}</span>
            </label>
          `)}
      </div>
    `)}_renderVacationPreview(e){return r`
      <div class="vac-preview-list">
        ${this._vacPreview.map(t=>{let i=t.events.map(n=>{let o=`vacation_event_${n.status}`;return`${n.date} (${s(o,e)})`}).join(" \xB7 "),a=!t.will_suppress;return r`
            <div class="vac-preview-row ${a?"exempt":""}">
              <div class="vac-preview-info">
                <div class="vac-preview-name">
                  <strong>${t.object_name}</strong> · ${t.task_name}
                  ${t.kind==="sensor_based"?r`<span class="vac-preview-kind">${s("vacation_sensor_based",e)}</span>`:c}
                </div>
                <div class="vac-preview-events">${i}</div>
              </div>
              <div class="vac-preview-actions">
                <button .disabled=${this._previewBusy} @click=${()=>this._previewActionComplete(t)}>${s("qr_action_complete",e)}</button>
                ${t.kind==="time_based"&&t.allow_skip!==!1?r`<button .disabled=${this._previewBusy} @click=${()=>this._previewActionSkip(t)}>${s("qr_action_skip",e)}</button>`:c}
                <button class=${a?"vac-notify-on":""}
                  @click=${()=>this._toggleVacationExempt(t.task_id,!a)}>
                  ${a?s("vacation_action_unsilence",e):s("vacation_action_notify",e)}
                </button>
              </div>
            </div>
          `})}
      </div>
    `}async _loadAllTasksForVacation(){let e=await this._ws({type:"maintenance_supporter/objects"});if(!e)return;let t=[];for(let i of e.objects||[])for(let a of i.tasks||[])t.push({entry_id:i.entry_id,object_name:i.object.name||"",task_id:a.id,task_name:a.name||""});this._vacAllTasks=t}async _saveVacation(e){if(!this._vacSaving){this._vacSaving=!0;try{let t=await this._ws({type:"maintenance_supporter/vacation/update",...e});if(!t)return;this._vacEnabled=t.enabled,this._vacStart=t.start||"",this._vacEnd=t.end||"",this._vacBuffer=t.buffer_days,this._vacExempt=new Set(t.exempt_task_ids||[]),this._vacIsActive=t.is_active,this._vacWindowEnd=t.window_end,this.dispatchEvent(new CustomEvent("settings-changed"))}finally{this._vacSaving=!1}}}_toggleVacationEnabled(e){this._saveVacation({enabled:e})}_setVacationDate(e,t){let i={};i[e]=t||null,this._saveVacation(i)}_setVacationBuffer(e){e<0||e>14||this._saveVacation({buffer_days:e})}_toggleVacationExempt(e,t){let i=new Set(this._vacExempt);t?i.add(e):i.delete(e),this._saveVacation({exempt_task_ids:[...i]})}async _loadVacationPreview(){let e=await this._ws({type:"maintenance_supporter/vacation/preview"},void 0,t=>{this._vacPreviewLoading=t});e&&(this._vacPreview=e.rows||[])}async _previewActionComplete(e){if(!this._previewBusy){this._previewBusy=!0;try{if(await this._ws({type:"maintenance_supporter/task/complete",entry_id:e.entry_id,task_id:e.task_id})===void 0)return;this._showToast(s("vacation_marked_complete",this._lang)),await this._loadVacationPreview()}finally{this._previewBusy=!1}}}async _previewActionSkip(e){if(!this._previewBusy){this._previewBusy=!0;try{if(await this._ws({type:"maintenance_supporter/task/skip",entry_id:e.entry_id,task_id:e.task_id,reason:"Skipped before vacation"})===void 0)return;this._showToast(s("vacation_marked_skip",this._lang)),await this._loadVacationPreview()}finally{this._previewBusy=!1}}}async _endVacationNow(){let e=await this._ws({type:"maintenance_supporter/vacation/end_now"});e&&(this._vacEnabled=e.enabled,this._vacEnd=e.end||"",this._vacIsActive=e.is_active,this._vacWindowEnd=e.window_end,this.dispatchEvent(new CustomEvent("settings-changed")),this._showToast(s("vacation_ended",this._lang)))}_renderPrintQr(e){let t=this._qrSelectedEntries.size||this._qrObjects.length,i=this._qrActions.size,a=t*i,n=a>200;return r`
      <div class="settings-section qr-print-section">
        <h3>${s("qr_print_title",e)}</h3>
        <p class="section-desc">${s("qr_print_desc",e)}</p>

        ${this._qrObjectsLoaded?r`
            <details open class="qr-filter-panel">
              <summary>${s("qr_print_filter",e)}</summary>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${s("qr_print_objects",e)}</div>
                <div class="qr-object-list">
                  ${this._qrObjects.length===0?r`<div class="hint">${s("no_objects",e)}</div>`:this._qrObjects.map(o=>r`
                      <label class="qr-object-row">
                        <input type="checkbox"
                          .checked=${this._qrSelectedEntries.size===0||this._qrSelectedEntries.has(o.entry_id)}
                          @change=${h=>this._toggleQrObject(o.entry_id,h.target.checked)} />
                        <span>${o.name}</span>
                        <span class="qr-task-count">${o.task_count}</span>
                      </label>
                    `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${s("qr_print_actions",e)}</div>
                <div class="qr-action-chips">
                  ${["view","complete","skip"].map(o=>r`
                    <label class="qr-action-chip ${this._qrActions.has(o)?"active":""}">
                      <input type="checkbox"
                        .checked=${this._qrActions.has(o)}
                        @change=${h=>this._toggleQrAction(o,h.target.checked)} />
                      ${s("qr_action_"+o,e)}
                    </label>
                  `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${s("qr_print_url_mode",e)}</div>
                <select .value=${this._qrUrlMode}
                  @change=${o=>{this._qrUrlMode=o.target.value}}>
                  <option value="companion">${s("qr_mode_companion",e)}</option>
                  <option value="local">${s("qr_mode_local",e)}</option>
                  <option value="server">${s("qr_mode_server",e)}</option>
                </select>
              </div>

              <div class="qr-filter-group qr-filter-actions">
                <div class="qr-estimate ${n?"error":""}">
                  ${s("qr_print_estimate",e)}: <strong>${a}</strong>
                  ${n?r` — ${s("qr_print_over_limit",e)}`:c}
                </div>
                <button
                  ?disabled=${this._qrBatchLoading||n||i===0}
                  @click=${this._generateBatch}>
                  ${this._qrBatchLoading?s("qr_print_generating",e):s("qr_print_generate",e)}
                </button>
              </div>
            </details>

            ${this._qrBatchResults.length>0?r`
                <div class="qr-results-toolbar">
                  <span>${this._qrBatchResults.length} ${s("qr_print_ready",e)}</span>
                  <button @click=${this._printQrs}>${s("qr_print_print_button",e)}</button>
                </div>
                <div class="qr-print-grid">
                  ${this._qrBatchResults.map(o=>r`
                    <div class="qr-print-cell">
                      <div class="qr-svg">${V(o.svg)}</div>
                      <div class="qr-label">
                        <div class="qr-label-obj">${o.object_name}</div>
                        <div class="qr-label-task">${o.task_name}</div>
                        <div class="qr-label-action">${s("qr_action_"+o.action,e)}</div>
                      </div>
                    </div>
                  `)}
                </div>
              `:c}
          `:r`<button @click=${this._loadQrObjects}>${s("qr_print_load",e)}</button>`}
      </div>
    `}async _loadQrObjects(){let e=await this._loadObjectRows();e&&(this._qrObjects=e,this._qrObjectsLoaded=!0)}async _loadObjectRows(){let e=await this._ws({type:"maintenance_supporter/objects"});if(e)return(e.objects||[]).map(t=>({entry_id:t.entry_id,name:t.object.name,task_count:(t.tasks||[]).length})).sort((t,i)=>t.name.localeCompare(i.name))}_toggleQrObject(e,t){let i=new Set(this._qrSelectedEntries);if(i.size===0)for(let a of this._qrObjects)i.add(a.entry_id);t?i.add(e):i.delete(e),i.size===this._qrObjects.length&&i.clear(),this._qrSelectedEntries=i}_toggleQrAction(e,t){let i=new Set(this._qrActions);t?i.add(e):i.delete(e),this._qrActions=i}async _generateBatch(){this._qrBatchLoading=!0,this._qrBatchResults=[];try{let e={type:"maintenance_supporter/qr/batch_generate",actions:[...this._qrActions],url_mode:this._qrUrlMode};this._qrSelectedEntries.size>0&&(e.entry_ids=[...this._qrSelectedEntries]);let t=await this._ws(e);if(!t)return;this._qrBatchResults=t.qrs||[],this._qrBatchResults.length===0&&this._showToast(s("qr_print_empty",this._lang))}finally{this._qrBatchLoading=!1}}_printQrs(){if(this._qrBatchResults.length===0)return;let e=this._lang,t=this._qrBatchResults.map(o=>{let h=s("qr_action_"+o.action,e);return`
        <div class="cell">
          <div class="qr">${o.svg}</div>
          <div class="label">
            <div class="obj">${this._escapeHtml(o.object_name)}</div>
            <div class="task">${this._escapeHtml(o.task_name)}</div>
            <div class="action">${this._escapeHtml(h)}</div>
          </div>
        </div>`}).join(""),i=s("qr_print_title",e),a=`<!DOCTYPE html>
<html lang="${this._escapeHtml(e)}">
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
    <button onclick="window.print()">${this._escapeHtml(s("qr_print_print_button",e))}</button>
  </div>
  <div class="grid">${t}</div>
  <script>window.addEventListener("load", function () { setTimeout(function () { window.print(); }, 250); });<\/script>
</body>
</html>`,n=window.open("","_blank","width=900,height=1100");if(!n){window.print();return}n.document.open(),n.document.write(a),n.document.close()}_escapeHtml(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}_renderImportExport(e){return r`
      <div class="settings-section">
        <h3>${s("settings_import_export",e)}</h3>
        <div class="settings-actions">
          <label class="export-history-toggle">
            <input type="checkbox" .checked=${this._includeHistory}
              @change=${t=>{this._includeHistory=t.target.checked}} />
            ${s("settings_include_history",e)}
          </label>
        </div>
        <div class="settings-actions">
          ${this._exportObjectsLoaded?r`
              <details class="qr-filter-panel">
                <summary>${s("settings_export_selection",e)}</summary>
                <div class="qr-object-list">
                  ${this._exportObjects.length===0?r`<div class="hint">${s("no_objects",e)}</div>`:this._exportObjects.map(t=>r`
                      <label class="qr-object-row">
                        <input type="checkbox"
                          .checked=${this._exportSelectedEntries.size===0||this._exportSelectedEntries.has(t.entry_id)}
                          @change=${i=>this._toggleExportObject(t.entry_id,i.target.checked)} />
                        <span>${t.name}</span>
                        <span class="qr-task-count">${t.task_count}</span>
                      </label>
                    `)}
                </div>
              </details>
            `:r`<button @click=${this._loadExportObjects}>${s("settings_export_selection",e)}</button>`}
        </div>
        <div class="settings-actions">
          <button @click=${this._exportJson}>${s("settings_export_json",e)}</button>
          <button @click=${this._exportYaml}>${s("settings_export_yaml",e)}</button>
          <button @click=${this._exportCsv}>${s("settings_export_csv",e)}</button>
          <button @click=${this._exportSettings}>${s("settings_export_settings",e)}</button>
        </div>
        <div class="settings-actions docs-archive-block">
          <h4>${s("settings_docs_archive",e)}</h4>
          <p class="section-desc">${s("settings_docs_archive_hint",e)}</p>
          <div class="settings-actions">
            <button ?disabled=${this._docArchiveLoading} @click=${this._exportDocsArchive}>
              ${s("settings_docs_export_btn",e)}
            </button>
            <button ?disabled=${this._docArchiveLoading} @click=${this._triggerDocsArchiveImport}>
              ${this._docArchiveLoading?"\u2026":s("settings_docs_import_btn",e)}
            </button>
            <input class="docs-archive-file" type="file" accept=".zip" hidden
              @change=${this._importDocsArchive} />
          </div>
        </div>
        <div class="import-section">
          <textarea class="import-area" .value=${this._importCsv}
            placeholder=${s("settings_import_placeholder",e)}
            @input=${t=>{this._importCsv=t.target.value}}
          ></textarea>
          <div class="settings-actions">
            <button ?disabled=${!this._importCsv.trim()||this._importLoading}
              @click=${this._importCsvAction}>
              ${this._importLoading?"\u2026":s("settings_import_btn",e)}
            </button>
          </div>
        </div>
      </div>
    `}get _selectedEntryIds(){return this._exportSelectedEntries.size?[...this._exportSelectedEntries]:void 0}async _loadExportObjects(){let e=await this._loadObjectRows();e&&(this._exportObjects=e,this._exportObjectsLoaded=!0)}_toggleExportObject(e,t){let i=new Set(this._exportSelectedEntries);if(i.size===0)for(let a of this._exportObjects)i.add(a.entry_id);t?i.add(e):i.delete(e),i.size===this._exportObjects.length&&i.clear(),this._exportSelectedEntries=i}async _exportJson(){let e=this._selectedEntryIds,t=await this._ws({type:"maintenance_supporter/export",format:"json",include_history:this._includeHistory,...e?{entry_ids:e}:{}});if(!t)return;let i=k(new Date);this._downloadFile(t.data,`maintenance_export_${i}.json`,"application/json"),this._showToast(s("settings_export_success",this._lang))}async _exportSettings(){let e=await this._ws({type:"maintenance_supporter/settings/export"});if(!e)return;let t=k(new Date);this._downloadFile(e.data,`maintenance_settings_${t}.json`,"application/json"),this._showToast(s("settings_export_success",this._lang))}async _exportYaml(){let e=this._selectedEntryIds,t=await this._ws({type:"maintenance_supporter/export",format:"yaml",include_history:this._includeHistory,...e?{entry_ids:e}:{}});if(!t)return;let i=k(new Date);this._downloadFile(t.data,`maintenance_export_${i}.yaml`,"application/yaml"),this._showToast(s("settings_export_success",this._lang))}async _exportCsv(){let e=this._selectedEntryIds,t=await this._ws({type:"maintenance_supporter/csv/export",...e?{entry_ids:e}:{}});if(!t)return;let i=k(new Date);this._downloadFile(t.csv,`maintenance_export_${i}.csv`,"text/csv"),this._showToast(s("settings_export_success",this._lang))}async _importCsvAction(){let e=this._importCsv.trim();if(!e)return;let t=e.startsWith("object_name"),i=await this._ws(t?{type:"maintenance_supporter/csv/import",csv_content:e}:{type:"maintenance_supporter/json/import",json_content:e},void 0,n=>{this._importLoading=n});if(!i)return;let a=i.created??0;this._showToast(s("settings_import_success",this._lang).replace("{count}",String(a))),this._importCsv="",this.dispatchEvent(new CustomEvent("settings-changed"))}async _exportDocsArchive(){this._docArchiveLoading=!0;try{let e=this._selectedEntryIds,t=e?`?entry_ids=${encodeURIComponent(e.join(","))}`:"",i=await D(this.hass,`/api/maintenance_supporter/documents/archive${t}`);U(i,"maintenance-documents.zip")}catch{this._showToast(s("action_error",this._lang))}this._docArchiveLoading=!1}_triggerDocsArchiveImport(){this.renderRoot.querySelector(".docs-archive-file")?.click()}async _importDocsArchive(e){let t=e.target,i=t.files?.[0];if(i){this._docArchiveLoading=!0;try{let a=new FormData;a.append("file",i,i.name);let n=await fetch("/api/maintenance_supporter/documents/archive",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:a});if(!n.ok)this._showToast(s("action_error",this._lang));else{let o=await n.json();this._showToast(s("settings_docs_import_success",this._lang).replace("{blobs}",String(o.blobs_written??0)).replace("{docs}",String(o.documents_created??0))),this.dispatchEvent(new CustomEvent("settings-changed"))}}catch{this._showToast(s("action_error",this._lang))}t.value="",this._docArchiveLoading=!1}}};l.styles=[N,C`
    .bn-note {
      display: flex; align-items: flex-start; gap: 10px;
      margin: 6px 0 10px; padding: 10px 12px; border-radius: 8px;
      background: rgba(3, 169, 244, 0.08);
      border: 1px solid rgba(3, 169, 244, 0.25);
      font-size: 13.5px; line-height: 1.45;
    }
    .bn-note ha-icon { --mdc-icon-size: 20px; flex: none; color: var(--primary-color); margin-top: 1px; }
    .bn-note.warn { background: rgba(255, 167, 38, 0.08); border-color: rgba(255, 167, 38, 0.35); }
    .bn-note.warn ha-icon { color: var(--warning-color, #ffa726); }
    .bn-link { color: var(--primary-color); text-decoration: none; }
    .bn-link:hover { text-decoration: underline; }
    .bn-more, .bn-sub { color: var(--secondary-text-color); }
    .bn-sub { display: block; font-size: 12.5px; margin-top: 2px; }

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
    /* #169 follow-up: member avatar editor */
    .member-avatar-row { display: flex; align-items: center; gap: 10px; padding: 6px 0 0; flex-wrap: wrap; }
    .member-avatar-name { font-weight: 500; min-width: 120px; }
    .member-initials {
      width: 4.5em; padding: 4px 6px; text-align: center; text-transform: uppercase;
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 6px;
      background: var(--card-background-color); color: var(--primary-text-color); font: inherit;
    }
    .member-palette { display: inline-flex; gap: 4px; flex-wrap: wrap; }
    .member-swatch {
      width: 20px; height: 20px; border-radius: 50%; border: 2px solid transparent; padding: 0;
      background: var(--person-color); cursor: pointer;
    }
    .member-swatch.selected { border-color: var(--primary-text-color); box-shadow: 0 0 0 2px var(--card-background-color) inset; }
    .member-reset { --ha-button-font-size: 12px; }
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
    .setting-row ms-date-field {
      flex: 0 0 auto;
      max-width: 60%;
    }
    .setting-row input[type="number"],
    .setting-row input[type="text"] {
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

    .setting-row-block { flex-direction: column; align-items: stretch; gap: 6px; }
    /* D#162 follow-up: battery lifetime table */
    .bl-title { margin: 16px 0 8px; font-size: 14px; }
    .bl-table { display: flex; flex-direction: column; gap: 4px; margin: 8px 0 12px; }
    .bl-row { display: grid; grid-template-columns: minmax(0, 1fr) 72px max-content minmax(0, 1.4fr) max-content; align-items: center; gap: 8px; padding: 4px 0; border-bottom: 1px solid var(--divider-color); }
    .bl-type { font-weight: 500; }
    .bl-fleet { font-size: 11px; color: var(--secondary-text-color); font-weight: 400; margin-left: 4px; }
    .bl-months { width: 72px; padding: 4px 6px; border: 1px solid var(--divider-color); border-radius: 4px; background: var(--card-background-color); color: var(--primary-text-color); font: inherit; }
    .bl-unit, .bl-source { font-size: 12px; color: var(--secondary-text-color); }
    .bl-override .bl-source { color: var(--primary-color); }
    .bl-learned { grid-column: 1 / -1; font-size: 12px; color: var(--secondary-text-color); }
    .bl-reset { background: none; border: 1px solid var(--divider-color); border-radius: 12px; padding: 2px 10px; font-size: 12px; color: var(--primary-text-color); cursor: pointer; }
    .bl-more > summary { cursor: pointer; font-size: 12px; color: var(--secondary-text-color); padding: 4px 0; }
    @media (max-width: 640px) {
      .bl-row { grid-template-columns: minmax(0, 1fr) 64px max-content; }
      .bl-source { grid-column: 1 / 3; }
      .bl-reset { grid-column: 3; justify-self: end; }
    }
    .notify-extra { min-height: 72px; font-family: var(--code-font-family, monospace); font-size: 12.5px; }
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
  `],d([S({attribute:!1})],l.prototype,"hass",2),d([S({attribute:!1})],l.prototype,"features",2),d([S({attribute:!1})],l.prototype,"budget",2),d([p()],l.prototype,"_settings",2),d([p()],l.prototype,"_loading",2),d([p()],l.prototype,"_importCsv",2),d([p()],l.prototype,"_importLoading",2),d([p()],l.prototype,"_includeHistory",2),d([p()],l.prototype,"_toast",2),d([p()],l.prototype,"_testingNotification",2),d([p()],l.prototype,"_personTargets",2),d([p()],l.prototype,"_testingUser",2),d([p()],l.prototype,"_users",2),d([p()],l.prototype,"_savedViews",2),d([p()],l.prototype,"_vacEnabled",2),d([p()],l.prototype,"_vacStart",2),d([p()],l.prototype,"_vacEnd",2),d([p()],l.prototype,"_vacBuffer",2),d([p()],l.prototype,"_vacExempt",2),d([p()],l.prototype,"_vacIsActive",2),d([p()],l.prototype,"_vacWindowEnd",2),d([p()],l.prototype,"_vacAllTasks",2),d([p()],l.prototype,"_vacPreview",2),d([p()],l.prototype,"_vacPreviewLoading",2),d([p()],l.prototype,"_previewBusy",2),d([p()],l.prototype,"_vacSaving",2),d([p()],l.prototype,"_qrObjects",2),d([p()],l.prototype,"_qrSelectedEntries",2),d([p()],l.prototype,"_qrActions",2),d([p()],l.prototype,"_qrUrlMode",2),d([p()],l.prototype,"_qrBatchLoading",2),d([p()],l.prototype,"_qrBatchResults",2),d([p()],l.prototype,"_qrObjectsLoaded",2),d([p()],l.prototype,"_exportObjects",2),d([p()],l.prototype,"_exportSelectedEntries",2),d([p()],l.prototype,"_exportObjectsLoaded",2),d([p()],l.prototype,"_docArchiveLoading",2),d([p()],l.prototype,"_allTemplates",2),d([p()],l.prototype,"_templateCategories",2),d([p()],l.prototype,"_tplOpenGroups",2);customElements.get("maintenance-settings-view")||customElements.define("maintenance-settings-view",l);export{l as MaintenanceSettingsView};
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
