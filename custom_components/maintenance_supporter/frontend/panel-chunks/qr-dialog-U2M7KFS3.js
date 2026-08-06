/*! maintenance_supporter frontend 2.53.0 */
import{a,b as v,c as n,f as g,g as b,i as m,j as c,n as t}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-4MVSRJ3Y.js";function p(l){return l.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function x(l){return!l.startsWith("data:image/svg+xml,")&&!l.startsWith("data:image/png;base64,")?"":p(l)}function $(l){return l.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var r=class extends b{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(e,i){this._entryId=e,this._taskId=null,this._objectName=i,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(e,i,o,s){this._entryId=e,this._taskId=i,this._objectName=o,this._taskName=s,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let i={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(i.task_id=this._taskId);let o=[this.hass.connection.sendMessagePromise({...i,action:"view"})];this._taskId&&o.push(this.hass.connection.sendMessagePromise({...i,action:"complete"}));let s=await Promise.all(o);if(e!==this._generateSeq)return;this._viewResult=s[0],s.length>1&&(this._completeResult=s[1])}catch(i){if(e!==this._generateSeq)return;let o=i?.code,s=i?.message;this._error=o==="no_url"||typeof s=="string"&&s.includes("No Home Assistant URL")?t("qr_error_no_url",this.lang):t("qr_error",this.lang)}finally{e===this._generateSeq&&(this._loading=!1)}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,i=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,o=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),s=window.open("","_blank","width=600,height=500");if(!s)return;let h=this.lang||"en",d=p(i),u=p(o),_=!!this._completeResult,f=p(t("qr_action_view",h)),w=p(t("qr_action_complete",h));s.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${d}</title>
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
  .qr-col img{width:${_?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${d}</h2>
${u?`<div class="sub">${u}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${x(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${f}</div>
  </div>
  ${_?`<div class="qr-col">
    <img src="${x(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${w}</div>
  </div>`:""}
</div>
<div class="url">${p(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),s.document.close()}_downloadSvg(e,i){let o=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),s=new Blob([o],{type:"image/svg+xml"}),h=URL.createObjectURL(s),d=document.createElement("a");d.href=h;let u=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;d.download=`qr-${$(u)}-${i}.svg`,d.click(),URL.revokeObjectURL(h)}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return n``;let e=this.lang||this.hass?.language||"en",i=this._taskName?`${t("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${t("qr_code",e)}: ${this._objectName}`,o=!!this._viewResult;return n`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i}</div>
        <div class="content">
          ${this._loading?n`<div class="loading">${t("qr_generating",e)}</div>`:this._error?n`<div class="error">${this._error}</div>`:o?n`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${t("qr_action_view",e)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${t("qr_download",e)}
                        </button>
                      </div>
                      ${this._completeResult?n`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${t("qr_action_complete",e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${t("qr_download",e)}
                              </button>
                            </div>
                          `:g}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:g}
          <div class="action-row">
            <label>${t("qr_url_mode",e)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${t("qr_mode_companion",e)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${t("qr_mode_local",e)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${t("qr_mode_server",e)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${t("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!o}
          >
            ${t("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};r.styles=v`
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
  `,a([m({attribute:!1})],r.prototype,"hass",2),a([m()],r.prototype,"lang",2),a([c()],r.prototype,"_open",2),a([c()],r.prototype,"_loading",2),a([c()],r.prototype,"_error",2),a([c()],r.prototype,"_viewResult",2),a([c()],r.prototype,"_completeResult",2),a([c()],r.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",r);export{r as MaintenanceQrDialog};
