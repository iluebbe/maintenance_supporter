/*! maintenance_supporter frontend 2.97.1 */
import{B as R,D as k,R as x,a as m,b as h,c as g,f as v,h as b,l as y,m as _,s as l}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YJXVPPWG.js";function w(i){return`${i.entry_id??""}\0${i.part_id}`}function E(i,t,e,o){let n=!!i.entry_id&&i.entry_id!==t,r=n?i.entry_id:t,s=e.find(p=>p.entry_id===r),a=(s?.parts||[]).find(p=>p.id===i.part_id)||null,c=n&&s?.object?.name||"",u=a?.name||l("shared_part_unknown",o);return{part:a,foreign:n,ownerName:c,label:c?`${u} (${c})`:u}}function L(i,t,e,o){let{part:n,label:r}=E(i,t,e,o),s=n&&n.stock!==null&&n.stock!==void 0?` (${k(n.stock,n.unit,o)})`:"",a=n?.storage_location?` \u2014 ${n.storage_location}`:"";return`${R(i.quantity,o)}\xD7 ${r}${s}${a}`}function $(i,t,e,o){let r=(e.find(a=>a.entry_id===t)?.parts||[]).map(a=>({...a})),s=new Set(r.map(a=>w({part_id:a.id})));for(let a of i?.consumes_parts||[]){if(!a.entry_id||a.entry_id===t)continue;let c=w(a);if(s.has(c))continue;s.add(c);let{part:u,ownerName:p}=E(a,t,e,o);r.push({id:a.part_id,name:u?.name||l("shared_part_unknown",o),unit:u?.unit,stock:u?.stock??null,storage_location:u?.storage_location,entry_id:a.entry_id,owner_name:p})}return r}function O(){let i=new Uint8Array(4);return(globalThis.crypto??{getRandomValues:t=>t.map(()=>Math.floor(Math.random()*256))}).getRandomValues(i),Array.from(i,t=>t.toString(16).padStart(2,"0")).join("")}function f(i){let t=i?.reading_values;if(!Array.isArray(t))return[];let e=[],o=new Set;for(let n of t){if(!n||typeof n!="object")continue;let r=n;typeof r.id!="string"||!r.id||o.has(r.id)||typeof r.value!="number"||!Number.isFinite(r.value)||(o.add(r.id),e.push({id:r.id,name:typeof r.name=="string"?r.name:r.id,unit:typeof r.unit=="string"?r.unit:null,value:r.value}))}return e}function S(i){return i.filter(t=>t.type==="completed"&&(t.reading_value!=null||f(t).length>0)).sort((t,e)=>t.timestamp.localeCompare(e.timestamp))}function V(i){return S(i??[]).map(t=>({timestamp:t.timestamp,values:f(t)})).filter(t=>t.values.length>0)}function H(i,t,e){let o;for(let n of i){if(e!==void 0){let s=new Date(n.timestamp).getTime();if(!isNaN(s)&&s>=e)break}let r=n.values.find(s=>s.id===t);r&&(o=r)}return o}function T(i,t,e){let o=f(t).find(r=>r.id===e);if(!o)return null;let n=null;for(let r of S(i)){if(r.timestamp>=t.timestamp)break;let s=f(r).find(a=>a.id===e);s&&(n=s.value)}return n==null?null:o.value-n}function A(i){let t=new Set,e=new Set;for(let o of i){let n=(o.name||"").trim().toLowerCase();n&&(t.has(n)?e.add(o.id):t.add(n))}return e}function M(i){let t=[],e=new Set,o=new Set;for(let n of i){let r=(n.name||"").trim();if(!(!r||e.has(n.id)||o.has(r.toLowerCase()))&&(e.add(n.id),o.add(r.toLowerCase()),t.push({id:n.id,name:r,unit:(n.unit||"").trim()||null}),t.length>=20))break}return t}function C(i){let t=(i??"").trim();if(t==="")return null;let e=Number(t.replace(",","."));return!Number.isFinite(e)||e<0?null:Math.round(e)}var U=["notes","cost","duration","photo","user"],j={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"};var d=class extends b{constructor(){super(...arguments);this.value="";this.lang="en";this._credit=!1;this._amount=""}willUpdate(e){if(!e.has("value"))return;let o=(this.value??"").trim();if(o===this._signed())return;let n=parseFloat(o);if(o===""||Number.isNaN(n)){this._amount="",this._credit=!1;return}this._credit=n<0,this._amount=String(Math.abs(n))}_signed(){let e=this._amount.trim();return e===""?"":this._credit?`-${e}`:e}_emit(){this.value=this._signed(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setCredit(e){this._credit!==e&&(this._credit=e,this._emit())}_onInput(e){let o=e.target.value;o.startsWith("-")&&(this._credit=!0),this._amount=o.replace(/^-+/,""),this._emit()}render(){let e=this.lang;return g`
      <div class="wrap">
        <div class="sign" role="group">
          <button type="button" class="kind cost ${this._credit?"":"on"}" aria-pressed=${String(!this._credit)}
            @click=${()=>this._setCredit(!1)}>${l("cost",e)}</button>
          <button type="button" class="kind credit ${this._credit?"on":""}" aria-pressed=${String(this._credit)}
            @click=${()=>this._setCredit(!0)}>${l("cost_kind_credit",e)}</button>
        </div>
        <input type="number" step="0.01" min="0" inputmode="decimal" class="field-input amount"
          .value=${this._amount} @input=${this._onInput} />
      </div>
      ${this._credit?g`<div class="hint">${l("cost_credit_hint",e)}</div>`:v}
    `}};d.styles=[x,h`
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
      .kind.credit.on { background: var(--success-color, #43a047); }
      .amount { flex: 1; min-width: 0; }
      .hint { margin-top: 4px; font-size: 12px; color: var(--secondary-text-color); }
    `],m([y()],d.prototype,"value",2),m([y()],d.prototype,"lang",2),m([_()],d.prototype,"_credit",2),m([_()],d.prototype,"_amount",2);customElements.get("ms-cost-input")||customElements.define("ms-cost-input",d);export{w as a,L as b,$ as c,O as d,f as e,V as f,H as g,T as h,A as i,M as j,C as k,U as l,j as m};
