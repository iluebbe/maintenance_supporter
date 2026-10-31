/*! maintenance_supporter frontend 2.115.0 */
import{F as k,P as R,S as x,a as m,b as h,c as g,f as v,ga as w,h as b,m as y,n as _,x as c}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DQ4IGWWK.js";function E(i){return`${i.entry_id??""}\0${i.part_id}`}function S(i,e,t,o){let n=!!i.entry_id&&i.entry_id!==e,r=n?i.entry_id:e,s=t.find(d=>d.entry_id===r),l=(s?.parts||[]).find(d=>d.id===i.part_id)||null,a=n&&s?.object?.name||"",p=l?.name||c("shared_part_unknown",o);return{part:l,foreign:n,ownerName:a,label:a?`${p} (${a})`:p}}function V(i,e,t,o){let{part:n,label:r}=S(i,e,t,o),s=n&&n.stock!==null&&n.stock!==void 0?` (${x(n.stock,n.unit,o)})`:"",l=n?.storage_location?` \u2014 ${n.storage_location}`:"";return`${R(i.quantity,o)}\xD7 ${r}${s}${l}`}function H(i,e,t,o){let n=t.find(a=>a.entry_id===e),r=a=>a?.object.battery_fleet?{cost_mode:"purchase"}:{},s=(n?.parts||[]).map(a=>({...a,...r(n)})),l=new Set(s.map(a=>E({part_id:a.id})));for(let a of i?.consumes_parts||[]){if(!a.entry_id||a.entry_id===e)continue;let p=E(a);if(l.has(p))continue;l.add(p);let{part:d,ownerName:L}=S(a,e,t,o);s.push({id:a.part_id,name:d?.name||c("shared_part_unknown",o),unit:d?.unit,stock:d?.stock??null,storage_location:d?.storage_location,cost:d?.cost??null,package_size:d?.package_size??null,cost_mode:d?.cost_mode??null,...r(t.find($=>$.entry_id===a.entry_id)),entry_id:a.entry_id,owner_name:L})}return s}var N=20;function A(){let i=new Uint8Array(4);return(globalThis.crypto??{getRandomValues:e=>e.map(()=>Math.floor(Math.random()*256))}).getRandomValues(i),Array.from(i,e=>e.toString(16).padStart(2,"0")).join("")}function f(i){let e=i?.reading_values;if(!Array.isArray(e))return[];let t=[],o=new Set;for(let n of e){if(!n||typeof n!="object")continue;let r=n;typeof r.id!="string"||!r.id||o.has(r.id)||typeof r.value!="number"||!Number.isFinite(r.value)||(o.add(r.id),t.push({id:r.id,name:typeof r.name=="string"?r.name:r.id,unit:typeof r.unit=="string"?r.unit:null,value:r.value}))}return t}function P(i){return i.filter(e=>e.type==="completed"&&(e.reading_value!=null||f(e).length>0)).sort((e,t)=>e.timestamp.localeCompare(t.timestamp))}function C(i){return P(i??[]).map(e=>({timestamp:e.timestamp,values:f(e)})).filter(e=>e.values.length>0)}function j(i,e,t){let o;for(let n of i){if(t!==void 0){let s=k(n.timestamp);if(!isNaN(s)&&s>=t)break}let r=n.values.find(s=>s.id===e);r&&(o=r)}return o}function D(i,e,t){let o=f(e).find(r=>r.id===t);if(!o)return null;let n=null;for(let r of P(i)){if(r.timestamp>=e.timestamp)break;let s=f(r).find(l=>l.id===t);s&&(n=s.value)}return n==null?null:o.value-n}function F(i){let e=new Set,t=new Set;for(let o of i){let n=(o.name||"").trim().toLowerCase();n&&(e.has(n)?t.add(o.id):e.add(n))}return t}function U(i){let e=[],t=new Set,o=new Set;for(let n of i){let r=(n.name||"").trim();if(!(!r||t.has(n.id)||o.has(r.toLowerCase()))&&(t.add(n.id),o.add(r.toLowerCase()),e.push({id:n.id,name:r,unit:(n.unit||"").trim()||null}),e.length>=N))break}return e}function Q(i){let e=(i??"").trim();if(e==="")return null;let t=Number(e.replace(",","."));return!Number.isFinite(t)||t<0?null:Math.round(t)}var I=["notes","cost","duration","photo","user"],K={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"};var u=class extends b{constructor(){super(...arguments);this.value="";this.lang="en";this._credit=!1;this._amount=""}willUpdate(t){if(!t.has("value"))return;let o=(this.value??"").trim();if(o===this._signed())return;let n=parseFloat(o);if(o===""||Number.isNaN(n)){this._amount="",this._credit=!1;return}this._credit=n<0,this._amount=String(Math.abs(n))}_signed(){let t=this._amount.trim();return t===""?"":this._credit?`-${t}`:t}_emit(){this.value=this._signed(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setCredit(t){this._credit!==t&&(this._credit=t,this._emit())}_onInput(t){let o=t.target.value;o.startsWith("-")&&(this._credit=!0),this._amount=o.replace(/^-+/,""),this._emit()}render(){let t=this.lang;return g`
      <div class="wrap">
        <div class="sign" role="group">
          <button type="button" class="kind cost ${this._credit?"":"on"}" aria-pressed=${String(!this._credit)}
            @click=${()=>this._setCredit(!1)}>${c("cost",t)}</button>
          <button type="button" class="kind credit ${this._credit?"on":""}" aria-pressed=${String(this._credit)}
            @click=${()=>this._setCredit(!0)}>${c("cost_kind_credit",t)}</button>
        </div>
        <input type="number" step="0.01" min="0" inputmode="decimal" class="field-input amount"
          .value=${this._amount} @input=${this._onInput} />
      </div>
      ${this._credit?g`<div class="hint">${c("cost_credit_hint",t)}</div>`:v}
    `}};u.styles=[w,h`
      :host { display: block; }
      .wrap { display: flex; gap: 8px; align-items: stretch; }
      .sign {
        display: inline-flex;
        flex: none;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        overflow: hidden;
      }
      .kind {
        font: inherit;
        font-size: 13px;
        padding: 0 10px;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
      }
      .kind.on { background: var(--primary-color); color: var(--text-primary-color, #fff); }
      .kind.credit.on { background: var(--success-color, #4caf50); }
      .amount { flex: 1; min-width: 0; }
      .hint { margin-top: 4px; font-size: 12px; color: var(--secondary-text-color); }
    `],m([y()],u.prototype,"value",2),m([y()],u.prototype,"lang",2),m([_()],u.prototype,"_credit",2),m([_()],u.prototype,"_amount",2);customElements.get("ms-cost-input")||customElements.define("ms-cost-input",u);export{E as a,V as b,H as c,N as d,A as e,f,C as g,j as h,D as i,F as j,U as k,Q as l,I as m,K as n};
