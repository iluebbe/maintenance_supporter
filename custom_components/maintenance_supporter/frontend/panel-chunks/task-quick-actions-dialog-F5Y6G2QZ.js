/*! maintenance_supporter frontend 2.125.1 */
import{B as nt,C as ot,D as dt,E as lt,b as $,e as D,q as X,s as tt,v as et,y as st,z as rt}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-7KYBFEF4.js";import{d as v,e as B}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FDLJKLFM.js";import{a as V}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-FNWE7VMK.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-UWPZZEFZ.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-4NKIY6IC.js";import{e as T,f as N}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EJZ2NBQH.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-HPWREKXN.js";import{i as M}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-CV3UKE7P.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-PBBZ2ARS.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-FH35GOVD.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-FKFFS3JU.js";import{a as _,c as H}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-L4HA5GEY.js";import{c as O}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-Q4DBSRQI.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-IJW7GION.js";import{q as F,s as y,t as L,u as U,x as it,y as at}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DPJFEOXZ.js";import{a as J,b as u,h as K}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NTYTPRPT.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-QNVHCH7F.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-JKMCRNZW.js";import{a as Y,b as Z,c as A,d as Q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LNKM6ZD2.js";import{a as G}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BGW72IBP.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-WTLCZ4Y4.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-TANT5LHK.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-LGPLB2CQ.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-7PNUU6IJ.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-B4BSXNIA.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-MIV25IFE.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-YMNLJQHB.js";import{a as b}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-RGTYJUKM.js";import{a as f}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6M7HJHKR.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-CF7WBWHY.js";import{b as I,c as l}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-EA2F2Q5U.js";import{B as C,H as S,O as z,Q as E,Z as R,a as d,b as x,ba as m,e as i,h as a,ia as q,ja as P,k,p as w,q as s,ra as j,wa as W}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-5VHXYTDQ.js";var r=class extends k{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1};this._toast="";this._toastTimer=new V;this._access=J;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return w(this.hass)}async openFor(t,e){(t!==this._entryId||e!==this._taskId)&&(this._task=null),this._entryId=t,this._taskId=e,this._error="",this._busy=!1,this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=S(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let t=await K(this.hass);this._features={...this._features,...t.features},this._access=t.access,this._currencySymbol=z(t.budget??void 0),E(t.budget??void 0),this._partsCostMode=t.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(t,e){this._toast=t,this._toastTimer.schedule(()=>{this._toast=""},e)}async _loadTask(){let t=this._entryId,e=this._taskId;if(!t||!e)return;let n=++this._loadSeq,c="",o=await f(this,{type:"maintenance_supporter/object",entry_id:t},{onError:p=>{c=p}});if(n!==this._loadSeq)return;if(o===void 0){this._error=c;return}this._objectName=o?.object?.name||"";let h=(o?.tasks||[]).find(p=>p.id===e);this._task=h??null,this._taskRef=$(o?.object,h),h||(this._error=s("ws_err_not_found",this._lang))}_runWs(t){return this._error="",f(this,t,{busy:e=>{this._busy=e},onError:e=>{this._error=e}})}_notifyChanged(t){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:t},bubbles:!0,composed:!0}))}async _onComplete(t=!1){if(!this._entryId||!this._taskId||!this._task)return;if(!t&&_(this._task)){await this._onQuickComplete();return}let e=this._entryId,n=this._taskId,c=this._task,o=this._loadSeq;this._busy=!0;try{let{openCompleteDialog:h}=await import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-IONRJ53S.js"),p=[];try{p=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}if(o!==this._loadSeq)return;h(B({entryId:e,taskId:n,taskName:c.name,task:c,objects:p,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())}finally{(o===this._loadSeq||!this._open)&&(this._busy=!1)}}async _onQuickComplete(){let t=this._entryId,e=this._task;this._busy=!0;try{let n=await H(this.hass,t,e.id,this._lang);if(n.result==="dialog"){await this._onComplete(!0);return}if(n.result==="failed"){this._error=n.message;return}if(n.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:n.message},bubbles:!0,composed:!0})),this.close();return}this._notifyChanged("complete"),O(this,this.hass,{entryId:t,taskId:e.id,taskName:e.name},n.undo,this._lang,()=>{}),this.close()}finally{this._busy=!1}}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:tt(t,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-IONRJ53S.js").then(({openEditTaskDialog:t})=>{t(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-IONRJ53S.js").then(({openQrDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let t=await D(G(this.hass),this._task,this._lang);if(!t)return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId,...t})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let t=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(s("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let t=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});t!==void 0&&(this._showToast(t?.recommended_interval?`${s("reanalyze_result",this._lang)}: ${q(t.recommended_interval,"days",this._lang)} (${t.data_points} ${s("data_points",this._lang)})`:s("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(t){if(!this._entryId||!this._taskId)return;let e=X(this._entryId,this._taskId,t,this._task);import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-IONRJ53S.js").then(({openHistoryEditDialog:n})=>n(e))}_renderRecommendation(t){if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return a;let e=this._lang;return i`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",e)}</h4>
        ${ot(t.interval_days,t.suggested_interval,t.interval_confidence||"medium",e)}
        <div class="recommendation-actions">
          ${u(this.hass?.user,this._access)?i`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${s("apply_suggestion",e)}
              </button>`:a}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${s("reanalyze",e)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(t){let e=this._lang,n=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,c=t.degradation_trend!=null&&t.degradation_trend!=="insufficient_data"||t.days_until_threshold!=null||t.environmental_factor!=null&&t.environmental_factor!==1,o=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,h=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1;return!n&&!c&&!o&&!h?i`<div class="adaptive-empty">
        ${s("adaptive_no_data",e)}
      </div>`:i`
      <div class="adaptive-stack">
        ${this._toast?i`<div class="toast">${this._toast}</div>`:a}
        ${n?this._renderRecommendation(t):a}
        ${c?nt(t,e,this._features):a}
        ${o?rt(t,e):a}
        ${h?i`
          ${dt(t,e,this._features)}
          ${t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12?lt(t,e):a}
        `:a}
      </div>
    `}_renderDetails(t){let e=this._lang,n=t.history||[],c=t.history_count??n.length,o=et(n).slice(0,20);return i`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${s("times_performed",e)}</span>
            <span class="stat-value">${t.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("total_cost",e)}</span>
            <span class="stat-value">${R(t.total_cost??0,this._currencySymbol,e)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${s("avg_duration",e)}</span>
            <span class="stat-value">${P(t.average_duration!=null?Math.round(t.average_duration):null,e)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${s("history",e)}</strong>
          <span class="history-count">${c}</span>
        </div>
        ${n.length===0?i`<div class="history-empty">${s("history_empty",e)}</div>`:i`
              <div class="history-list">
                ${o.map(h=>st(h,{lang:e,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:u(this.hass?.user,this._access)?p=>this._onEditHistoryEntry(p):void 0,readingUnit:t.reading_unit,readingSlotDelta:(p,g)=>M(n,p,g),taskRef:this._taskRef,triggerUnit:T(this.hass,t)||null,stateRule:N(t),task:t},{compact:!0}))}
                ${c>o.length?i`<div class="history-more">… +${c-o.length} ${s("older_entries",e)}</div>`:a}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return a;let t=this._lang,e=this._task,n=u(this.hass?.user,this._access),c=!!e&&C(e);return A(()=>this.close(),i`
        ${e?i`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${it(e)}"></span>
                  ${Z()?a:i`<span class="task-name">${L(e.name,e.next_event_titles,y(e,t))}</span>`}
                  ${at(e,t)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&import("/maintenance_supporter_panelfiles/panel-chunks/dialog-mount-IONRJ53S.js").then(({openObjectQuickActions:o})=>{o(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${e.next_due?i`<span><strong>${s("next_due",t)}:</strong> ${m(e.next_due,t)}</span>`:a}
                  ${e.last_performed?i`<span><strong>${s("last_performed",t)}:</strong> ${m(e.last_performed,t)}</span>`:a}
                  ${e.schedule?.kind&&!["manual","one_time"].includes(e.schedule.kind)||e.interval_days!=null?i`<span><strong>${s("interval",t)}:</strong> ${j(e,t)}</span>`:a}
                  ${v(e)?i`<span><strong>${s("phase_current",t)}:</strong> ${v(e)}</span>`:a}
                </div>
                ${e.notes?i`<div class="notes-body">${F(e.notes)}</div>`:a}
              </div>

              ${this._error?b("error",this._error):a}

              ${this._showSkip?i`
                    <div class="inline-form">
                      <ms-textfield label=${s("skip_reason",t)} .value=${this._skipReason}
                        @input=${o=>{this._skipReason=o.target.value}}></ms-textfield>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${s("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${s("skip",t)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?i`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${s("reset_to_date",t)}
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._resetDate}
                        @value-changed=${o=>{this._resetDate=o.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${s("cancel",t)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${s("reset",t)}
                        </button>
                      </div>
                    </div>
                  `:this._showPostpone?i`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${s("postpone_date_prompt",t)}
                        .hass=${this.hass}
                        .lang=${t}
                        .value=${this._postponeDate}
                        @value-changed=${o=>{this._postponeDate=o.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showPostpone=!1}} ?disabled=${this._busy}>
                          ${s("cancel",t)}
                        </button>
                        <button class="btn primary qa-postpone-confirm" @click=${this._onPostponeConfirm}
                          ?disabled=${this._busy||!this._postponeDate}>
                          ${s("postpone",t)}
                        </button>
                      </div>
                    </div>
                  `:i`
                    ${c?a:i`<div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${()=>this._onComplete()} .disabled=${this._busy}
                        title=${_(e)?s("qr_action_quick_complete",t):s("complete",t)}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${s("complete",t)}
                      </ha-button>
                      ${_(e)?i`<ha-button appearance="outlined" variant="success" class="qa-complete-details" @click=${()=>this._onComplete(!0)} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:text-box-edit-outline"></ha-icon>
                            ${s("complete_with_details",t)}
                          </ha-button>`:a}
                      ${e.allow_skip!==!1?i`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${s("skip",t)}
                            </ha-button>
                          `:a}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${s("reset",t)}
                      </ha-button>
                    </div>`}
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${n?i`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${s("edit",t)}
                          </ha-button>`:a}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${s("qr_code",t)}
                      </ha-button>
                      ${c?a:i`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${s("postpone",t)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${s("snooze",t)}
                          </ha-button>`}
                      ${n?i`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${e.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${e.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${e.archived?s("unarchive",t):s("archive",t)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${s("delete",t)}
                          </ha-button>`:a}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?s("hide_details",t):s("show_details",t)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?i`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?s("hide_stats",t):s("show_stats",t)}
                          </button>`:a}
                    </div>
                    ${this._showDetails?this._renderDetails(e):a}
                    ${this._showAdaptive?this._renderAdaptive(e):a}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${s("open_in_panel",t)}
                      </button>
                    </div>
                  `}
            `:this._error?b("error",this._error):i`<div class="loading">${s("loading",t)}</div>`}
    `,{title:e?U(e.name,e.next_event_titles,y(e,t)):void 0})}updated(t){t.has("_open")&&this._open&&Q(this.shadowRoot)}};r.styles=[W,Y,x`
    :host { display: contents; --ms-modal-max-width: 460px; }
    .header { display: flex; flex-direction: column; gap: 6px; }
    .title { display: flex; align-items: center; gap: 10px; }
    .status-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .task-name { font-size: 18px; font-weight: 600; }
    .object { font-size: 13px; color: var(--secondary-text-color); }
    .link-inline {
      background: transparent; border: none; padding: 0; cursor: pointer;
      color: var(--primary-color); font-size: inherit; font-family: inherit;
    }
    .link-inline:hover { text-decoration: underline; }
    .quick-info {
      display: flex; flex-wrap: wrap; gap: 12px;
      font-size: 12px; color: var(--secondary-text-color);
      padding-top: 4px; border-top: 1px solid var(--divider-color);
    }
    .quick-info strong { color: var(--primary-text-color); font-weight: 500; }
    .actions { display: flex; gap: 8px; }
    .actions.primary-row { gap: 6px; }
    .actions.primary-row .btn { flex: 1; }
    .actions.primary-row ha-button { flex: 1; }
    /* Edit + QR are admin-tools — left-align as a group; Delete is destructive
       so it gets pushed to the far right with margin-left:auto for visual
       separation. Earlier this row was flex-end which left a strange empty
       gap on the left (user feedback). */
    .actions.secondary-row {
      padding-top: 8px; border-top: 1px solid var(--divider-color);
      justify-content: flex-start;
      /* 360 px: Edit + QR + Archive + Delete were 388 px in a 342 px row —
         Delete sat past the dialog edge (audit 2026-09-29). Wrap instead;
         Delete keeps its margin-left:auto on the second line. */
      flex-wrap: wrap;
      row-gap: 6px;
    }
    .actions.secondary-row .btn.danger,
    .actions.secondary-row ha-button.danger {
      margin-left: auto;
    }
    .actions.secondary-row ha-button { --ha-button-font-size: 13px; }
    .btn {
      padding: 8px 12px; font-size: 14px;
      border-radius: var(--ms-radius-6, 6px); cursor: pointer;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
      font-weight: 500;
      display: inline-flex; align-items: center; gap: 6px;
      transition: background 0.12s;
    }
    .btn:hover { background: color-mix(in srgb, var(--primary-text-color) 6%, transparent); }
    .btn[disabled] { opacity: 0.5; cursor: wait; }
    .btn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
      border-color: var(--primary-color);
    }
    .btn.cancel { background: transparent; }
    .btn.ghost { padding: 6px 10px; font-size: 13px; }
    .btn.danger { color: var(--error-color); }
    .btn ha-icon { --mdc-icon-size: 18px; }
    .inline-form { display: flex; flex-direction: column; gap: 8px; }
    .notes-body {
      margin-top: 8px; padding: 8px; border-radius: var(--ms-radius-6, 6px);
      background: var(--secondary-background-color);
      font-size: 13px; white-space: pre-wrap; word-break: break-word;
    }
    .notes-body ha-markdown { white-space: normal; }
    .inline-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .footer { display: flex; justify-content: center; padding-top: 4px; }
    .link {
      background: transparent; border: none; cursor: pointer;
      color: var(--primary-color); font-size: 13px;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .link:hover { text-decoration: underline; }
    .link ha-icon { --mdc-icon-size: 14px; }
    .loading { padding: 24px; text-align: center; color: var(--secondary-text-color); }
    .error {
      padding: 8px; border-radius: var(--ms-radius-6, 6px);
      background: rgba(211,47,47,0.1);
      color: var(--error-color, #d32f2f); font-size: 13px;
    }

    /* Details (expandable Show details section) */
    .details-toggle { display: flex; justify-content: center; margin-top: 4px; }
    .details {
      display: flex; flex-direction: column; gap: 12px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .stats-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;
    }
    .stat {
      display: flex; flex-direction: column; gap: 2px;
      background: var(--secondary-background-color, rgba(255,255,255,0.04));
      padding: 8px; border-radius: var(--ms-radius-6, 6px);
      align-items: center;
    }
    .stat-label { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 16px; font-weight: 600; }
    .history-header {
      display: flex; align-items: baseline; gap: 8px;
      font-size: 14px;
    }
    .history-count {
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .history-empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; }
    /* The rows themselves are the shared renderer's (.history-entry.compact
       + the history-* classes from sharedStyles); only the list chrome is
       local. */
    .history-list { display: flex; flex-direction: column; max-height: 280px; overflow: auto; }
    .history-list .history-entry {
      padding: 6px 8px; border-radius: var(--ms-radius-6, 6px); border-bottom: none; margin-bottom: 6px;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
    }
    .history-list .history-date { font-size: 11px; }
    .history-list .history-details { font-size: 11px; }
    .history-more { padding: 8px; text-align: center; font-size: 12px; color: var(--secondary-text-color); font-style: italic; }

    /* Adaptive section — wraps the panel renderers (which assume sharedStyles
       are present) and adds dialog-specific layout. */
    .adaptive-stack {
      display: flex; flex-direction: column; gap: 12px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .adaptive-empty {
      padding: 16px; text-align: center;
      color: var(--secondary-text-color);
      font-style: italic; font-size: 13px;
      border-top: 1px solid var(--divider-color);
    }
    .toast {
      padding: 8px 12px; border-radius: var(--ms-radius-6, 6px);
      background: rgba(76, 175, 80, 0.15);
      color: var(--success-color, #4caf50); font-size: 13px; font-weight: 500;
    }
    /* The panel's card look (panel-styles.ts is not in this shadow root, so
       the card and its heading rendered bare). */
    .recommendation-card {
      padding: 16px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .recommendation-card h4 { margin: 0 0 12px; font-size: 14px; }
    /* The panel's recommendation-card uses ha-button. We use plain <button>
       in this dialog's button styles. Re-style the action row to match. */
    .recommendation-actions {
      display: flex; gap: 8px; margin-top: 8px;
    }
    /* Constrain SVG charts so they fit the dialog width even on mobile. */
    .weibull-section, .seasonal-card-compact { max-width: 100%; }
    .weibull-chart svg { max-width: 100%; height: auto; }
    .details-toggle { gap: 12px; flex-wrap: wrap; }
  `],d([I({attribute:!1})],r.prototype,"hass",2),d([l()],r.prototype,"_open",2),d([l()],r.prototype,"_entryId",2),d([l()],r.prototype,"_taskId",2),d([l()],r.prototype,"_task",2),d([l()],r.prototype,"_objectName",2),d([l()],r.prototype,"_taskRef",2),d([l()],r.prototype,"_busy",2),d([l()],r.prototype,"_error",2),d([l()],r.prototype,"_showSkip",2),d([l()],r.prototype,"_showReset",2),d([l()],r.prototype,"_showPostpone",2),d([l()],r.prototype,"_showDetails",2),d([l()],r.prototype,"_showAdaptive",2),d([l()],r.prototype,"_skipReason",2),d([l()],r.prototype,"_resetDate",2),d([l()],r.prototype,"_postponeDate",2),d([l()],r.prototype,"_features",2),d([l()],r.prototype,"_toast",2),d([l()],r.prototype,"_access",2),d([l()],r.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",r);export{r as MaintenanceTaskQuickActionsDialog};
