/*! maintenance_supporter frontend 2.120.0 */
import{a as n,b as a}from"./chunk-RYL74NSR.js";import{a as d,d as r,g as p,i as l}from"./chunk-GOJWZNSJ.js";import{a as i}from"./chunk-7ZPVRRJE.js";async function m(s,e,o=300){return(await s.connection.sendMessagePromise({type:"auth/sign_path",path:e,expires:o})).path}async function c(s,e,o=300){return m(s,`/api/maintenance_supporter/document/${e}`,o)}var t=class extends l{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await c(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?p:this._url?r`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:r`<div class="ph"></div>`}};t.styles=d`
    .wrap { display: inline-block; margin-top: 4px; }
    /* #161: uniform 96px tiles — several photos sit in a strip, so a
       tiny or portrait shot must not collapse its slot. */
    img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: var(--ms-radius-6, 6px);
      display: block;
      border: 1px solid var(--divider-color);
      box-sizing: border-box;
    }
    .ph {
      width: 96px;
      height: 96px;
      border-radius: var(--ms-radius-6, 6px);
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      margin-top: 4px;
    }
  `,i([n({attribute:!1})],t.prototype,"hass",2),i([n()],t.prototype,"docId",2),i([a()],t.prototype,"_url",2),i([a()],t.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",t);
