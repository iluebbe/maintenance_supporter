/*! maintenance_supporter frontend 2.112.0 */
import{a as $,c}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-SMSV662A.js";import{b as R}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-QL6EA6GU.js";import{Q as x,Z as w,a as r,b as q,c as a,f as u,h as f,m as _,n,v as k,w as i}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3LSO3J5Y.js";function h(d){return!d.startsWith("data:image/svg+xml,")&&!d.startsWith("data:image/png;base64,")?"":c(d)}function I(d){return d.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var l=class extends f{constructor(){super(...arguments);this.lang="";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._quickResult=null;this._quickValues=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}get _dialogLang(){return this.lang||k(this.hass)}openForObject(t,e){this._entryId=t,this._taskId=null,this._objectName=e,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}openForTask(t,e,s,o){this._entryId=t,this._taskId=e,this._objectName=s,this._taskName=o,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}async _generate(){let t=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._quickValues=null;try{let e={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(e.task_id=this._taskId);let s=[this.hass.connection.sendMessagePromise({...e,action:"view"})];if(this._taskId){if(s.push(this.hass.connection.sendMessagePromise({...e,action:"complete"})),this._quickValues=await this._quickCompleteValues(),t!==this._generateSeq)return;this._quickValues&&s.push(this.hass.connection.sendMessagePromise({...e,action:"quick_complete"}))}let o=await Promise.all(s);if(t!==this._generateSeq)return;this._viewResult=o[0],o.length>1&&(this._completeResult=o[1]),o.length>2&&(this._quickResult=o[2])}catch(e){if(t!==this._generateSeq)return;let s=e?.code,o=e?.message;this._error=s==="no_url"||typeof o=="string"&&o.includes("No Home Assistant URL")?i("qr_error_no_url",this._dialogLang):i("qr_error",this._dialogLang)}finally{t===this._generateSeq&&(this._loading=!1)}}async _quickCompleteValues(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});return R((t.tasks||[]).find(e=>e.id===this._taskId))}catch{return null}}_quickRecords(t){let e=this._quickValues??{},s=[e.notes?`\u201C${e.notes.length>40?`${e.notes.slice(0,39)}\u2026`:e.notes}\u201D`:"",e.cost!=null?`${i("quick_complete_defaults_cost",t)} ${x(e.cost,void 0,t)}`:"",e.duration!=null?w(e.duration,t):""].filter(Boolean);return s.length?i("qr_quick_records",t).replace("{values}",s.join(", ")):i("qr_quick_records_nothing",t)}_setUrlMode(t){this._urlMode!==t&&(this._urlMode=t,this._generate())}_print(){if(!this._viewResult)return;let t=this._viewResult,e=t.label.task_name?`${t.label.object_name} \u2014 ${t.label.task_name}`:t.label.object_name,s=[t.label.manufacturer,t.label.model].filter(Boolean).join(" "),o=window.open("","_blank","width=600,height=500");if(!o)return;let p=this._dialogLang,m=c(e),g=c(s),v=!!this._completeResult,b=!!this._quickResult,y=c(i("qr_action_view",p)),j=c(i("qr_action_complete",p)),C=c(i("qr_action_quick_complete",p));o.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${m}</title>
<style>
  /* Printable sheet \u2014 must not inherit the phone's dark theme. The QR images
     carry their own white quiet zone and stay scannable either way, but the
     labels below are explicit dark greys and would vanish on a WebView's dark
     canvas. Same reasoning as helpers/report.ts. */
  :root{color-scheme:light}
  body{font-family:sans-serif;text-align:center;padding:20px;background:#fff;color:#1a1a1a}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  .qr-row{display:flex;justify-content:center;gap:24px;margin:12px 0}
  .qr-col{display:flex;flex-direction:column;align-items:center;gap:6px}
  .qr-col img{width:${b?"170px":v?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${m}</h2>
${g?`<div class="sub">${g}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${h(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${y}</div>
  </div>
  ${v?`<div class="qr-col">
    <img src="${h(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${j}</div>
  </div>`:""}
  ${b?`<div class="qr-col">
    <img src="${h(this._quickResult.svg_data_uri)}" alt="QR Quick-complete" />
    <div class="qr-label">${C}</div>
  </div>`:""}
</div>
<div class="url">${c(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),o.document.close()}_downloadSvg(t,e){let s=decodeURIComponent(t.svg_data_uri.replace("data:image/svg+xml,","")),o=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;$(s,`qr-${I(o)}-${e}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._quickResult=null,this._error="",this._loading=!1}render(){if(!this._open)return a``;let t=this._dialogLang,e=this._taskName?`${i("qr_code",t)}: ${this._objectName} \u2014 ${this._taskName}`:`${i("qr_code",t)}: ${this._objectName}`,s=!!this._viewResult;return a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._loading?a`<div class="loading">${i("qr_generating",t)}</div>`:this._error?a`<div class="error">${this._error}</div>`:s?a`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${i("qr_action_view",t)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${i("qr_download",t)}
                        </button>
                      </div>
                      ${this._completeResult?a`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${i("qr_action_complete",t)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${i("qr_download",t)}
                              </button>
                            </div>
                          `:u}
                      ${this._quickResult?a`
                            <div class="qr-item quick">
                              <img
                                class="qr-image small"
                                src="${this._quickResult.svg_data_uri}"
                                alt="QR Quick-complete"
                              />
                              <div class="qr-item-label">${i("qr_action_quick_complete",t)}</div>
                              <div class="qr-quick-records">${this._quickRecords(t)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._quickResult,"quick-complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${i("qr_download",t)}
                              </button>
                            </div>
                          `:u}
                    </div>
                    ${this._taskId&&!this._quickResult?a`<div class="qr-quick-off">${i("qr_quick_complete_off",t)}</div>`:u}
                    <div class="url-display">${this._viewResult.url}</div>
                  `:u}
          <div class="action-row">
            <label>${i("qr_url_mode",t)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${i("qr_mode_companion",t)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${i("qr_mode_local",t)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${i("qr_mode_server",t)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${i("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!s}
          >
            ${i("qr_print",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};l.styles=q`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      min-width: 300px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    .qr-pair {
      display: flex;
      flex-wrap: wrap; /* three codes (quick-complete, #192) wrap on a phone */
      gap: 20px;
      justify-content: center;
      width: 100%;
    }
    .qr-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .qr-image {
      width: 240px;
      height: 240px;
      image-rendering: pixelated;
    }
    .qr-image.small {
      width: 180px;
      height: 180px;
    }
    /* #233: what the quick code records; how to get one */
    .qr-quick-records,
    .qr-quick-off {
      font-size: 12px;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .qr-quick-off {
      margin-top: 8px;
    }
    .qr-item-label {
      max-width: 180px;
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .dl-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer;
      font-size: 13px;
      color: var(--primary-text-color);
      padding: 6px 14px;
      border-radius: 18px;
      transition: background 0.2s, border-color 0.2s;
    }
    .dl-btn:hover {
      background: var(--secondary-background-color, #f5f5f5);
      border-color: var(--primary-color);
    }
    .dl-btn ha-icon {
      --mdc-icon-size: 18px;
    }
    .url-display {
      font-size: 11px;
      color: var(--secondary-text-color);
      word-break: break-all;
      text-align: center;
      max-width: 400px;
    }
    .loading {
      padding: 40px 0;
      color: var(--secondary-text-color);
    }
    .error {
      padding: 20px 0;
      color: var(--error-color, #f44336);
    }
    .action-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }
    .action-row label {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .action-toggle {
      display: flex;
      gap: 4px;
      background: var(--divider-color, #e0e0e0);
      border-radius: 6px;
      padding: 3px;
    }
    .toggle-btn {
      flex: 1;
      padding: 8px 12px;
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      border-radius: 4px;
      font-size: 13px;
      transition: all 0.2s;
      line-height: 1.3;
    }
    .toggle-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    .toggle-btn.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }
  `,r([_({attribute:!1})],l.prototype,"hass",2),r([_()],l.prototype,"lang",2),r([n()],l.prototype,"_open",2),r([n()],l.prototype,"_loading",2),r([n()],l.prototype,"_error",2),r([n()],l.prototype,"_viewResult",2),r([n()],l.prototype,"_completeResult",2),r([n()],l.prototype,"_quickResult",2),r([n()],l.prototype,"_quickValues",2),r([n()],l.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",l);export{l as a};
