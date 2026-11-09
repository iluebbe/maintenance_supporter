/*! maintenance_supporter frontend 2.120.0 */
import{a as l}from"/maintenance_supporter_cardfiles/card-chunks/chunk-5UPOSW6L.js";import{a as t,b as e}from"/maintenance_supporter_cardfiles/card-chunks/chunk-R4OGP3RP.js";import{a as s,b as a,e as r,h as o,j as d}from"/maintenance_supporter_cardfiles/card-chunks/chunk-2JUL7K7P.js";var i=class extends d{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await l(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?o:this._url?r`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:r`<div class="ph"></div>`}};i.styles=a`
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
  `,s([t({attribute:!1})],i.prototype,"hass",2),s([t()],i.prototype,"docId",2),s([e()],i.prototype,"_url",2),s([e()],i.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",i);
