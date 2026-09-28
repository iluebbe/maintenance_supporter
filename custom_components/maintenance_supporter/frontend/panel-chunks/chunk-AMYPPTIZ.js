/*! maintenance_supporter frontend 2.94.0 */
import{a as k}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DTRCTWKY.js";import{a as r,b as f,c as n,f as u,h as x,l as h,m as c,s as e}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VJBVPUN4.js";function d(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function _(a){return!a.startsWith("data:image/svg+xml,")&&!a.startsWith("data:image/png;base64,")?"":d(a)}function R(a){return a.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var l=class extends x{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._quickResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(t,i){this._entryId=t,this._taskId=null,this._objectName=i,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}openForTask(t,i,s,o){this._entryId=t,this._taskId=i,this._objectName=s,this._taskName=o,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}async _generate(){let t=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null;try{let i={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(i.task_id=this._taskId);let s=[this.hass.connection.sendMessagePromise({...i,action:"view"})];this._taskId&&(s.push(this.hass.connection.sendMessagePromise({...i,action:"complete"})),await this._hasQuickCompleteDefaults()&&s.push(this.hass.connection.sendMessagePromise({...i,action:"quick_complete"})));let o=await Promise.all(s);if(t!==this._generateSeq)return;this._viewResult=o[0],o.length>1&&(this._completeResult=o[1]),o.length>2&&(this._quickResult=o[2])}catch(i){if(t!==this._generateSeq)return;let s=i?.code,o=i?.message;this._error=s==="no_url"||typeof o=="string"&&o.includes("No Home Assistant URL")?e("qr_error_no_url",this.lang):e("qr_error",this.lang)}finally{t===this._generateSeq&&(this._loading=!1)}}async _hasQuickCompleteDefaults(){try{let i=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId})).tasks||[]).find(s=>s.id===this._taskId);return!!i?.quick_complete_defaults&&Object.keys(i.quick_complete_defaults).length>0}catch{return!1}}_setUrlMode(t){this._urlMode!==t&&(this._urlMode=t,this._generate())}_print(){if(!this._viewResult)return;let t=this._viewResult,i=t.label.task_name?`${t.label.object_name} \u2014 ${t.label.task_name}`:t.label.object_name,s=[t.label.manufacturer,t.label.model].filter(Boolean).join(" "),o=window.open("","_blank","width=600,height=500");if(!o)return;let p=this.lang||"en",m=d(i),g=d(s),v=!!this._completeResult,b=!!this._quickResult,q=d(e("qr_action_view",p)),w=d(e("qr_action_complete",p)),$=d(e("qr_action_quick_complete",p));o.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
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
    <img src="${_(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${q}</div>
  </div>
  ${v?`<div class="qr-col">
    <img src="${_(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${w}</div>
  </div>`:""}
  ${b?`<div class="qr-col">
    <img src="${_(this._quickResult.svg_data_uri)}" alt="QR Quick-complete" />
    <div class="qr-label">${$}</div>
  </div>`:""}
</div>
<div class="url">${d(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),o.document.close()}_downloadSvg(t,i){let s=decodeURIComponent(t.svg_data_uri.replace("data:image/svg+xml,","")),o=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;k(s,`qr-${R(o)}-${i}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._quickResult=null,this._error="",this._loading=!1}render(){if(!this._open)return n``;let t=this.lang||this.hass?.language||"en",i=this._taskName?`${e("qr_code",t)}: ${this._objectName} \u2014 ${this._taskName}`:`${e("qr_code",t)}: ${this._objectName}`,s=!!this._viewResult;return n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._loading?n`<div class="loading">${e("qr_generating",t)}</div>`:this._error?n`<div class="error">${this._error}</div>`:s?n`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${e("qr_action_view",t)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${e("qr_download",t)}
                        </button>
                      </div>
                      ${this._completeResult?n`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${e("qr_action_complete",t)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${e("qr_download",t)}
                              </button>
                            </div>
                          `:u}
                      ${this._quickResult?n`
                            <div class="qr-item quick">
                              <img
                                class="qr-image small"
                                src="${this._quickResult.svg_data_uri}"
                                alt="QR Quick-complete"
                              />
                              <div class="qr-item-label">${e("qr_action_quick_complete",t)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._quickResult,"quick-complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${e("qr_download",t)}
                              </button>
                            </div>
                          `:u}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:u}
          <div class="action-row">
            <label>${e("qr_url_mode",t)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${e("qr_mode_companion",t)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${e("qr_mode_local",t)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${e("qr_mode_server",t)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${e("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!s}
          >
            ${e("qr_print",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};l.styles=f`
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
  `,r([h({attribute:!1})],l.prototype,"hass",2),r([h()],l.prototype,"lang",2),r([c()],l.prototype,"_open",2),r([c()],l.prototype,"_loading",2),r([c()],l.prototype,"_error",2),r([c()],l.prototype,"_viewResult",2),r([c()],l.prototype,"_completeResult",2),r([c()],l.prototype,"_quickResult",2),r([c()],l.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",l);export{l as a};
