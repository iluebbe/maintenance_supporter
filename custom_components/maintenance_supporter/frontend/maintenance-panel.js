var mt=Object.defineProperty;var vt=Object.getOwnPropertyDescriptor;var $=(o,r,e,t)=>{for(var i=t>1?void 0:t?vt(r,e):r,s=o.length-1,a;s>=0;s--)(a=o[s])&&(i=(t?a(r,e,i):a(i))||i);return t&&i&&mt(r,e,i),i};var pe=globalThis,he=pe.ShadowRoot&&(pe.ShadyCSS===void 0||pe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ke=Symbol(),Oe=new WeakMap,ie=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==ke)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(he&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=Oe.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&Oe.set(e,r))}return r}toString(){return this.cssText}},ze=o=>new ie(typeof o=="string"?o:o+"",void 0,ke),K=(o,...r)=>{let e=o.length===1?o[0]:r.reduce((t,i,s)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[s+1],o[0]);return new ie(e,o,ke)},Ie=(o,r)=>{if(he)o.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),i=pe.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,o.appendChild(t)}},Ae=he?o=>o:o=>o instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return ze(e)})(o):o;var{is:ft,defineProperty:bt,getOwnPropertyDescriptor:yt,getOwnPropertyNames:xt,getOwnPropertySymbols:$t,getPrototypeOf:wt}=Object,ge=globalThis,Ne=ge.trustedTypes,kt=Ne?Ne.emptyScript:"",At=ge.reactiveElementPolyfillSupport,re=(o,r)=>o,se={toAttribute(o,r){switch(r){case Boolean:o=o?kt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,r){let e=o;switch(r){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},ue=(o,r)=>!ft(o,r),Ve={attribute:!0,type:String,converter:se,reflect:!1,useDefault:!1,hasChanged:ue};Symbol.metadata??=Symbol("metadata"),ge.litPropertyMetadata??=new WeakMap;var N=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=Ve){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(r,t,e);i!==void 0&&bt(this.prototype,r,i)}}static getPropertyDescriptor(r,e,t){let{get:i,set:s}=yt(this.prototype,r)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){let p=i?.call(this);s?.call(this,a),this.requestUpdate(r,p,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??Ve}static _$Ei(){if(this.hasOwnProperty(re("elementProperties")))return;let r=wt(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(re("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(re("properties"))){let e=this.properties,t=[...xt(e),...$t(e)];for(let i of t)this.createProperty(i,e[i])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let i of t)e.unshift(Ae(i))}else r!==void 0&&e.push(Ae(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ie(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),i=this.constructor._$Eu(r,t);if(i!==void 0&&t.reflect===!0){let s=(t.converter?.toAttribute!==void 0?t.converter:se).toAttribute(e,t.type);this._$Em=r,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(r,e){let t=this.constructor,i=t._$Eh.get(r);if(i!==void 0&&this._$Em!==i){let s=t.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:se;this._$Em=i;let p=a.fromAttribute(e,s.type);this[i]=p??this._$Ej?.get(i)??p,this._$Em=null}}requestUpdate(r,e,t,i=!1,s){if(r!==void 0){let a=this.constructor;if(i===!1&&(s=this[r]),t??=a.getPropertyOptions(r),!((t.hasChanged??ue)(s,e)||t.useDefault&&t.reflect&&s===this._$Ej?.get(r)&&!this.hasAttribute(a._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:i,wrapped:s},a){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,a??e??this[r]),s!==!0||a!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),i===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,s]of t){let{wrapped:a}=s,p=this[i];a!==!0||this._$AL.has(i)||p===void 0||this.C(i,void 0,s,p)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};N.elementStyles=[],N.shadowRootOptions={mode:"open"},N[re("elementProperties")]=new Map,N[re("finalized")]=new Map,At?.({ReactiveElement:N}),(ge.reactiveElementVersions??=[]).push("2.1.2");var Le=globalThis,qe=o=>o,_e=Le.trustedTypes,Ue=_e?_e.createPolicy("lit-html",{createHTML:o=>o}):void 0,Ge="$lit$",W=`lit$${Math.random().toFixed(9).slice(2)}$`,Xe="?"+W,St=`<${Xe}>`,X=document,ne=()=>X.createComment(""),oe=o=>o===null||typeof o!="object"&&typeof o!="function",Pe=Array.isArray,Mt=o=>Pe(o)||typeof o?.[Symbol.iterator]=="function",Se=`[ 	
\f\r]`,ae=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,We=/-->/g,Be=/>/g,Y=RegExp(`>|${Se}(?:([^\\s"'>=/]+)(${Se}*=${Se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ze=/'/g,Ke=/"/g,Je=/^(?:script|style|textarea|title)$/i,je=o=>(r,...e)=>({_$litType$:o,strings:r,values:e}),c=je(1),P=je(2),Zt=je(3),J=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),Ye=new WeakMap,G=X.createTreeWalker(X,129);function Qe(o,r){if(!Pe(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ue!==void 0?Ue.createHTML(r):r}var Tt=(o,r)=>{let e=o.length-1,t=[],i,s=r===2?"<svg>":r===3?"<math>":"",a=ae;for(let p=0;p<e;p++){let d=o[p],_,h,u=-1,m=0;for(;m<d.length&&(a.lastIndex=m,h=a.exec(d),h!==null);)m=a.lastIndex,a===ae?h[1]==="!--"?a=We:h[1]!==void 0?a=Be:h[2]!==void 0?(Je.test(h[2])&&(i=RegExp("</"+h[2],"g")),a=Y):h[3]!==void 0&&(a=Y):a===Y?h[0]===">"?(a=i??ae,u=-1):h[1]===void 0?u=-2:(u=a.lastIndex-h[2].length,_=h[1],a=h[3]===void 0?Y:h[3]==='"'?Ke:Ze):a===Ke||a===Ze?a=Y:a===We||a===Be?a=ae:(a=Y,i=void 0);let b=a===Y&&o[p+1].startsWith("/>")?" ":"";s+=a===ae?d+St:u>=0?(t.push(_),d.slice(0,u)+Ge+d.slice(u)+W+b):d+W+(u===-2?p:b)}return[Qe(o,s+(o[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},le=class o{constructor({strings:r,_$litType$:e},t){let i;this.parts=[];let s=0,a=0,p=r.length-1,d=this.parts,[_,h]=Tt(r,e);if(this.el=o.createElement(_,t),G.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=G.nextNode())!==null&&d.length<p;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(Ge)){let m=h[a++],b=i.getAttribute(u).split(W),y=/([.?@])?(.*)/.exec(m);d.push({type:1,index:s,name:y[2],strings:b,ctor:y[1]==="."?Te:y[1]==="?"?De:y[1]==="@"?Ee:te}),i.removeAttribute(u)}else u.startsWith(W)&&(d.push({type:6,index:s}),i.removeAttribute(u));if(Je.test(i.tagName)){let u=i.textContent.split(W),m=u.length-1;if(m>0){i.textContent=_e?_e.emptyScript:"";for(let b=0;b<m;b++)i.append(u[b],ne()),G.nextNode(),d.push({type:2,index:++s});i.append(u[m],ne())}}}else if(i.nodeType===8)if(i.data===Xe)d.push({type:2,index:s});else{let u=-1;for(;(u=i.data.indexOf(W,u+1))!==-1;)d.push({type:7,index:s}),u+=W.length-1}s++}}static createElement(r,e){let t=X.createElement("template");return t.innerHTML=r,t}};function ee(o,r,e=o,t){if(r===J)return r;let i=t!==void 0?e._$Co?.[t]:e._$Cl,s=oe(r)?void 0:r._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(o),i._$AT(o,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(r=ee(o,i._$AS(o,r.values),i,t)),r}var Me=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,i=(r?.creationScope??X).importNode(e,!0);G.currentNode=i;let s=G.nextNode(),a=0,p=0,d=t[0];for(;d!==void 0;){if(a===d.index){let _;d.type===2?_=new ce(s,s.nextSibling,this,r):d.type===1?_=new d.ctor(s,d.name,d.strings,this,r):d.type===6&&(_=new Ce(s,this,r)),this._$AV.push(_),d=t[++p]}a!==d?.index&&(s=G.nextNode(),a++)}return G.currentNode=X,i}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},ce=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,i){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=ee(this,r,e),oe(r)?r===l||r==null||r===""?(this._$AH!==l&&this._$AR(),this._$AH=l):r!==this._$AH&&r!==J&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Mt(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==l&&oe(this._$AH)?this._$AA.nextSibling.data=r:this.T(X.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,i=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=le.createElement(Qe(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let s=new Me(i,this),a=s.u(this.options);s.p(e),this.T(a),this._$AH=s}}_$AC(r){let e=Ye.get(r.strings);return e===void 0&&Ye.set(r.strings,e=new le(r)),e}k(r){Pe(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let s of r)i===e.length?e.push(t=new o(this.O(ne()),this.O(ne()),this,this.options)):t=e[i],t._$AI(s),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=qe(r).nextSibling;qe(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},te=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,i,s){this.type=1,this._$AH=l,this._$AN=void 0,this.element=r,this.name=e,this._$AM=i,this.options=s,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=l}_$AI(r,e=this,t,i){let s=this.strings,a=!1;if(s===void 0)r=ee(this,r,e,0),a=!oe(r)||r!==this._$AH&&r!==J,a&&(this._$AH=r);else{let p=r,d,_;for(r=s[0],d=0;d<s.length-1;d++)_=ee(this,p[t+d],e,d),_===J&&(_=this._$AH[d]),a||=!oe(_)||_!==this._$AH[d],_===l?r=l:r!==l&&(r+=(_??"")+s[d+1]),this._$AH[d]=_}a&&!i&&this.j(r)}j(r){r===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},Te=class extends te{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===l?void 0:r}},De=class extends te{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==l)}},Ee=class extends te{constructor(r,e,t,i,s){super(r,e,t,i,s),this.type=5}_$AI(r,e=this){if((r=ee(this,r,e,0)??l)===J)return;let t=this._$AH,i=r===l&&t!==l||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,s=r!==l&&(t===l||i);i&&this.element.removeEventListener(this.name,this,t),s&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},Ce=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){ee(this,r)}};var Dt=Le.litHtmlPolyfillSupport;Dt?.(le,ce),(Le.litHtmlVersions??=[]).push("3.3.2");var et=(o,r,e)=>{let t=e?.renderBefore??r,i=t._$litPart$;if(i===void 0){let s=e?.renderBefore??null;t._$litPart$=i=new ce(r.insertBefore(ne(),s),s,void 0,e??{})}return i._$AI(o),i};var Re=globalThis,I=class extends N{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=et(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return J}};I._$litElement$=!0,I.finalized=!0,Re.litElementHydrateSupport?.({LitElement:I});var Et=Re.litElementPolyfillSupport;Et?.({LitElement:I});(Re.litElementVersions??=[]).push("4.2.2");var me=o=>(r,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,r)}):customElements.define(o,r)};var Ct={attribute:!0,type:String,converter:se,reflect:!1,hasChanged:ue},Lt=(o=Ct,r,e)=>{let{kind:t,metadata:i}=e,s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),t==="setter"&&((o=Object.create(o)).wrapped=!0),s.set(e.name,o),t==="accessor"){let{name:a}=e;return{set(p){let d=r.get.call(this);r.set.call(this,p),this.requestUpdate(a,d,o,!0,p)},init(p){return p!==void 0&&this.C(a,void 0,o,p),p}}}if(t==="setter"){let{name:a}=e;return function(p){let d=this[a];r.call(this,p),this.requestUpdate(a,d,o,!0,p)}}throw Error("Unsupported decorator location: "+t)};function V(o){return(r,e)=>typeof e=="object"?Lt(o,r,e):((t,i,s)=>{let a=i.hasOwnProperty(s);return i.constructor.createProperty(s,t),a?Object.getOwnPropertyDescriptor(i,s):void 0})(o,r,e)}function M(o){return V({...o,state:!0,attribute:!1})}var fe={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"#ff5722"},it={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",completed:"mdi:check-circle",skipped:"mdi:skip-next",reset:"mdi:refresh"};var Pt={maintenance:"Wartung",objects:"Objekte",tasks:"Aufgaben",overdue:"\xDCberf\xE4llig",due_soon:"Bald f\xE4llig",triggered:"Ausgel\xF6st",ok:"OK",all:"Alle",new_object:"+ Neues Objekt",edit:"Bearbeiten",delete:"L\xF6schen",add_task:"+ Aufgabe",complete:"Erledigt",skip:"\xDCberspringen",reset:"Zur\xFCcksetzen",cancel:"Abbrechen",completing:"Wird erledigt\u2026",type:"Typ",schedule:"Planung",interval:"Intervall",warning:"Vorwarnung",last_performed:"Zuletzt durchgef\xFChrt",next_due:"N\xE4chste F\xE4lligkeit",days_until_due:"Tage bis f\xE4llig",times_performed:"Durchf\xFChrungen",total_cost:"Gesamtkosten",avg_duration:"\xD8 Dauer",trigger:"Trigger",entity:"Entit\xE4t",attribute:"Attribut",trigger_type:"Trigger-Typ",active:"Aktiv",yes:"Ja",no:"Nein",current_value:"Aktueller Wert",threshold_above:"Obergrenze",threshold_below:"Untergrenze",threshold:"Schwellwert",counter:"Z\xE4hler",state_change:"Zustands\xE4nderung",target_value:"Zielwert",baseline:"Nulllinie",target_changes:"Ziel-\xC4nderungen",entity_min:"Minimum",entity_max:"Maximum",for_minutes:"F\xFCr (Minuten)",time_based:"Zeitbasiert",sensor_based:"Sensorbasiert",manual:"Manuell",cleaning:"Reinigung",inspection:"Inspektion",replacement:"Austausch",calibration:"Kalibrierung",service:"Service",custom:"Benutzerdefiniert",history:"Verlauf",notes:"Notizen",documentation:"Dokumentation",cost:"Kosten",duration:"Dauer",trigger_val:"Trigger-Wert",complete_title:"Erledigt: ",checklist:"Checkliste",notes_optional:"Notizen (optional)",cost_optional:"Kosten (optional)",duration_minutes:"Dauer in Minuten (optional)",days:"Tage",day:"Tag",today:"Heute",d_overdue:"T \xFCberf\xE4llig",no_tasks:"Keine Wartungsaufgaben vorhanden. Erstellen Sie ein Objekt um zu beginnen.",no_tasks_short:"Keine Aufgaben",no_history:"Noch keine Verlaufseintr\xE4ge.",show_all:"Alle anzeigen",cost_duration_chart:"Kosten & Dauer",installed:"Installiert",confirm_delete_object:"Dieses Objekt und alle zugeh\xF6rigen Aufgaben l\xF6schen?",confirm_delete_task:"Diese Aufgabe wirklich l\xF6schen?",value_history:"Wertverlauf",min:"Min",max:"Max",save:"Speichern",saving:"Speichern\u2026",edit_task:"Aufgabe bearbeiten",new_task:"Neue Wartungsaufgabe",task_name:"Aufgabenname",maintenance_type:"Wartungstyp",schedule_type:"Planungsart",interval_days:"Intervall (Tage)",warning_days:"Warntage",edit_object:"Objekt bearbeiten",name:"Name",manufacturer_optional:"Hersteller (optional)",model_optional:"Modell (optional)",trigger_configuration:"Trigger-Konfiguration",entity_id:"Entit\xE4ts-ID",attribute_optional:"Attribut (optional, leer = Zustand)",trigger_above:"Ausl\xF6sen wenn \xFCber",trigger_below:"Ausl\xF6sen wenn unter",for_at_least_minutes:"F\xFCr mindestens (Minuten)",safety_interval_days:"Sicherheitsintervall (Tage, optional)",delta_mode:"Delta-Modus",from_state_optional:"Von Zustand (optional)",to_state_optional:"Zu Zustand (optional)",documentation_url_optional:"Dokumentation URL (optional)",budget_monthly:"Monatsbudget",budget_yearly:"Jahresbudget",export_csv:"CSV Export",import_csv:"CSV Import",groups:"Gruppen",no_groups:"Keine Gruppen definiert.",group_tasks:"Aufgaben",loading_chart:"Daten werden geladen...",was_maintenance_needed:"War diese Wartung n\xF6tig?",feedback_needed:"N\xF6tig",feedback_not_needed:"Nicht n\xF6tig",feedback_not_sure:"Unsicher",suggested_interval:"Empfohlenes Intervall",apply_suggestion:"\xDCbernehmen",dismiss_suggestion:"Verwerfen",adaptive_scheduling:"Adaptive Planung",confidence_low:"Niedrig",confidence_medium:"Mittel",confidence_high:"Hoch",confidence:"Konfidenz",recommended:"empfohlen",seasonal_awareness:"Saisonale Anpassung",seasonal_factor:"Saisonfaktor",seasonal_chart_title:"Saisonale Faktoren",seasonal_learned:"Gelernt",seasonal_manual:"Manuell",seasonal_insufficient_data:"Nicht genug Daten",month_jan:"Jan",month_feb:"Feb",month_mar:"M\xE4r",month_apr:"Apr",month_may:"Mai",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dez",hemisphere_north:"N\xF6rdlich",hemisphere_south:"S\xFCdlich",seasonal_factor_short:"Saison",sensor_prediction:"Sensorvorhersage",degradation_trend:"Trend",trend_rising:"Steigend",trend_falling:"Fallend",trend_stable:"Stabil",trend_insufficient_data:"Unzureichende Daten",days_until_threshold:"Tage bis Schwellwert",threshold_exceeded:"Schwellwert \xFCberschritten",environmental_adjustment:"Umgebungsfaktor",sensor_prediction_urgency:"Sensor prognostiziert Schwellwert in ~{days} Tagen",day_short:"Tag",prediction_projection:"Projektion",weibull_reliability_curve:"Zuverl\xE4ssigkeitskurve",weibull_failure_probability:"Ausfallwahrscheinlichkeit",weibull_reliability:"Zuverl\xE4ssigkeit",weibull_beta_param:"Form \u03B2",weibull_eta_param:"Skala \u03B7",weibull_r_squared:"G\xFCte R\xB2",beta_early_failures:"Fr\xFChausf\xE4lle",beta_random_failures:"Zuf\xE4llige Ausf\xE4lle",beta_wear_out:"Verschlei\xDF",beta_highly_predictable:"Hochvorhersagbar",confidence_interval:"Konfidenzintervall",confidence_conservative:"Konservativ",confidence_aggressive:"Optimistisch",current_interval_marker:"Aktuelles Intervall",recommended_marker:"Empfohlen",reliability_at_current:"Zuverl\xE4ssigkeit bei aktuellem Intervall",characteristic_life:"Charakteristische Lebensdauer",chart_mini_sparkline:"Trend-Sparkline",chart_history:"Kosten- und Dauer-Verlauf",chart_seasonal:"Saisonfaktoren, 12 Monate",chart_weibull:"Weibull-Zuverl\xE4ssigkeitskurve",chart_sparkline:"Sensor-Triggerwert-Verlauf",days_progress:"Tagesfortschritt",qr_code:"QR-Code",qr_generating:"QR-Code wird generiert\u2026",qr_error:"QR-Code konnte nicht generiert werden.",qr_print:"Drucken",qr_download:"SVG herunterladen",qr_action:"Aktion beim Scannen",qr_action_view:"Wartungsinfo anzeigen",qr_action_complete:"Wartung als erledigt markieren"},jt={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",ok:"OK",all:"All",new_object:"+ New Object",edit:"Edit",delete:"Delete",add_task:"+ Add Task",complete:"Complete",skip:"Skip",reset:"Reset",cancel:"Cancel",completing:"Completing\u2026",type:"Type",schedule:"Schedule",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",times_performed:"Times performed",total_cost:"Total cost",avg_duration:"Avg duration",trigger:"Trigger",entity:"Entity",attribute:"Attribute",trigger_type:"Trigger type",active:"Active",yes:"Yes",no:"No",current_value:"Current value",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",entity_min:"Minimum",entity_max:"Maximum",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",custom:"Custom",history:"History",notes:"Notes",documentation:"Documentation",cost:"Cost",duration:"Duration",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",value_history:"Value history",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",attribute_optional:"Attribute (optional, blank = state)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",export_csv:"CSV Export",import_csv:"CSV Import",groups:"Groups",no_groups:"No groups defined.",group_tasks:"Tasks",loading_chart:"Loading chart data...",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",dismiss_suggestion:"Dismiss",adaptive_scheduling:"Adaptive Scheduling",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",confidence:"Confidence",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",seasonal_factor:"Seasonal factor",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",seasonal_insufficient_data:"Insufficient data",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",hemisphere_north:"Northern",hemisphere_south:"Southern",seasonal_factor_short:"Season",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",prediction_projection:"Projection",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_reliability:"Reliability",weibull_beta_param:"Shape \u03B2",weibull_eta_param:"Scale \u03B7",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",reliability_at_current:"Reliability at current interval",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete"},tt={de:Pt,en:jt};function n(o,r){let e=(r||"en").substring(0,2).toLowerCase();return tt[e]?.[o]??tt.en[o]??o}function Q(o,r){if(!o)return"\u2014";try{let e=(r||"de").startsWith("de")?"de-DE":"en-US";return new Date(o).toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return o}}function rt(o,r){if(!o)return"\u2014";try{let e=(r||"de").startsWith("de")?"de-DE":"en-US",t=new Date(o);return t.toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}catch{return o}}function de(o,r){if(o==null)return"\u2014";let e=r||"en";return o<0?`${Math.abs(o)} ${n("d_overdue",e)}`:o===0?n("today",e):`${o} ${n(o===1?"day":"days",e)}`}var st=K`
  :host {
    --maint-ok-color: var(--success-color, #4caf50);
    --maint-due-soon-color: var(--warning-color, #ff9800);
    --maint-overdue-color: var(--error-color, #f44336);
    --maint-triggered-color: #ff5722;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: white;
    white-space: nowrap;
  }

  .status-badge.ok { background-color: var(--maint-ok-color); }
  .status-badge.due_soon { background-color: var(--maint-due-soon-color); }
  .status-badge.overdue { background-color: var(--maint-overdue-color); }
  .status-badge.triggered { background-color: var(--maint-triggered-color); }

  .stats-bar {
    display: flex;
    gap: 16px;
    padding: 16px;
    flex-wrap: wrap;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-text-color);
  }

  .stat-label {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
  }

  .card-header h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .action-buttons ha-button {
    --ha-button-font-size: 13px;
  }

  .history-timeline { padding: 0 16px 16px; }

  .history-entry {
    display: flex;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid var(--divider-color);
  }
  .history-entry:last-child { border-bottom: none; }

  .history-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: white;
  }

  .history-icon.completed { background: var(--maint-ok-color); }
  .history-icon.skipped { background: var(--secondary-text-color); }
  .history-icon.reset { background: var(--info-color, #2196f3); }
  .history-icon.triggered { background: var(--maint-triggered-color); }

  .history-content { flex: 1; min-width: 0; }

  .history-date {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .history-details {
    display: flex;
    gap: 12px;
    font-size: 13px;
    color: var(--secondary-text-color);
    margin-top: 4px;
  }

  /* History filter chips */
  .history-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .filter-chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    cursor: pointer;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    transition: all 0.2s;
    user-select: none;
  }

  .filter-chip:hover { background: var(--divider-color); }

  .filter-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }

  .filter-chip.clear {
    font-style: italic;
    opacity: 0.7;
  }

  /* Cost/Duration history chart */
  .history-chart {
    width: 100%;
    height: 120px;
    display: block;
  }

  .chart-legend {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 4px;
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .legend-swatch {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    color: var(--secondary-text-color);
  }

  .empty-state ha-svg-icon {
    --mdc-icon-size: 48px;
    margin-bottom: 16px;
  }

  /* Sparkline chart */
  .sparkline-container { position: relative; margin: 8px 0; }

  .sparkline-svg {
    width: 100%;
    height: 140px;
    display: block;
  }

  /* Trigger info card */
  .trigger-card {
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    padding: 12px 16px;
    margin: 8px 0;
    border: 1px solid var(--divider-color);
  }

  .trigger-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .trigger-entity-name { font-weight: 500; font-size: 14px; }
  .trigger-entity-id { font-size: 11px; color: var(--secondary-text-color); font-family: monospace; }

  .trigger-value-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 4px 0;
  }

  .trigger-current { font-size: 28px; font-weight: 700; color: var(--primary-text-color); }
  .trigger-current.active { color: var(--maint-triggered-color); }
  .trigger-unit { font-size: 14px; color: var(--secondary-text-color); }

  .trigger-limits {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: var(--secondary-text-color);
    margin: 6px 0;
    flex-wrap: wrap;
  }

  .trigger-limit-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .trigger-limit-item .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .trigger-limit-item .dot.warn { background: var(--error-color, #f44336); }
  .trigger-limit-item .dot.range { background: var(--secondary-text-color); }
  .trigger-limit-item .dot.ok { background: var(--maint-ok-color); }

  /* Row action buttons */
  .row-actions {
    display: flex;
    gap: 0;
    flex-shrink: 0;
    margin-left: auto;
  }

  .row-actions mwc-icon-button {
    --mdc-icon-button-size: 32px;
    --mdc-icon-size: 18px;
  }

  .row-actions .btn-complete { color: var(--maint-ok-color); }
  .row-actions .btn-skip { color: var(--secondary-text-color); }

  /* Days bar for overview */
  .due-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 90px;
    gap: 2px;
  }

  .due-text { font-size: 13px; }

  .days-bar {
    width: 100%;
    height: 3px;
    background: var(--divider-color);
    border-radius: 2px;
    overflow: hidden;
  }

  .days-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s;
  }

  /* Trigger progress bar (overview rows) */
  .trigger-progress {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 90px;
  }

  .trigger-progress-bar {
    width: 100%;
    height: 6px;
    background: var(--divider-color);
    border-radius: 3px;
    overflow: hidden;
  }

  .trigger-progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s;
  }

  .trigger-progress-label {
    font-size: 12px;
    color: var(--secondary-text-color);
    text-align: right;
  }

  /* Days progress bar (detail view) */
  .days-progress {
    margin: 8px 0 16px;
    padding: 12px 16px;
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--divider-color);
  }

  .days-progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-bottom: 6px;
  }

  .days-progress-bar {
    width: 100%;
    height: 6px;
    background: var(--divider-color);
    border-radius: 3px;
    overflow: hidden;
  }

  .days-progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s;
  }

  .days-progress-text {
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    margin-top: 6px;
    color: var(--primary-text-color);
  }

  /* Sparkline tooltip */
  .sparkline-tooltip {
    position: absolute;
    transform: translate(-50%, -100%);
    background: var(--primary-text-color);
    color: var(--card-background-color, #fff);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 10;
    line-height: 1.4;
  }
  .sparkline-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: var(--primary-text-color);
  }

  /* Mini-sparkline in overview rows */
  .mini-sparkline {
    width: 60px;
    height: 20px;
    display: block;
    margin-top: 2px;
    opacity: 0.7;
  }

  /* Overflow indicator for overdue progress bars */
  .days-bar-fill.overflow,
  .days-progress-fill.overflow,
  .trigger-progress-fill.overflow {
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 3px,
      rgba(255,255,255,0.2) 3px,
      rgba(255,255,255,0.2) 6px
    );
    animation: overflow-pulse 2s ease-in-out infinite;
  }

  @keyframes overflow-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  /* Budget bars */
  .budget-bars {
    display: flex;
    gap: 16px;
    padding: 8px 16px;
    flex-wrap: wrap;
  }

  .budget-item {
    flex: 1;
    min-width: 200px;
  }

  .budget-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-bottom: 4px;
  }

  .budget-bar {
    width: 100%;
    height: 6px;
    background: var(--divider-color);
    border-radius: 3px;
    overflow: hidden;
  }

  .budget-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s;
  }

  /* Groups section */
  .groups-section {
    padding: 8px 16px 16px;
  }

  .groups-section h3 {
    font-size: 14px;
    font-weight: 500;
    color: var(--secondary-text-color);
    margin: 0 0 8px;
  }

  .groups-grid {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .group-card {
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    padding: 12px 16px;
    min-width: 180px;
    flex: 1;
    max-width: 300px;
    cursor: default;
  }

  .group-card-name {
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .group-card-desc {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
  }

  .group-card-tasks {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .group-task-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--primary-text-color);
  }

  /* Adaptive scheduling suggestion badge */
  .suggestion-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    background: var(--info-color, #2196f3);
    color: white;
    margin-left: 8px;
  }

  .suggestion-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .suggestion-actions ha-button {
    --ha-button-font-size: 12px;
  }

  .confidence-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .confidence-dot.low { background: var(--secondary-text-color); }
  .confidence-dot.medium { background: var(--warning-color, #ff9800); }
  .confidence-dot.high { background: var(--success-color, #4caf50); }

  /* Feedback toggle buttons in complete dialog */
  .feedback-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 0;
    border-top: 1px solid var(--divider-color);
  }

  .feedback-label {
    font-weight: 500;
    font-size: 13px;
    color: var(--secondary-text-color);
  }

  .feedback-buttons {
    display: flex;
    gap: 8px;
  }

  .feedback-btn {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font-size: 13px;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
  }

  .feedback-btn:hover {
    background: var(--secondary-background-color, #f5f5f5);
  }

  .feedback-btn.selected {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }

  /* Seasonal chart */
  .seasonal-chart {
    padding: 12px 16px;
    margin: 8px 0;
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--divider-color);
  }

  .seasonal-chart-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .seasonal-chart-title .source-tag {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 8px;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color);
    font-weight: 400;
  }

  .seasonal-chart svg {
    width: 100%;
    height: 100px;
    display: block;
  }

  .seasonal-labels {
    display: flex;
    justify-content: space-between;
    padding: 0 2px;
    margin-top: 4px;
  }

  .seasonal-label {
    font-size: 10px;
    color: var(--secondary-text-color);
    text-align: center;
    flex: 1;
  }

  .seasonal-label.active-month {
    font-weight: 700;
    color: var(--primary-color);
  }

  .seasonal-factor-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color);
    margin-left: 6px;
  }

  .seasonal-factor-tag.short {
    background: rgba(76, 175, 80, 0.15);
    color: var(--success-color, #4caf50);
  }

  .seasonal-factor-tag.long {
    background: rgba(255, 152, 0, 0.15);
    color: var(--warning-color, #ff9800);
  }

  /* --- Sensor Prediction Section (Phase 3) --- */

  .prediction-section {
    margin: 16px 0;
    padding: 12px 16px;
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--divider-color, #e0e0e0);
  }

  .prediction-urgency-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    margin-bottom: 12px;
    border-radius: 8px;
    background: rgba(255, 152, 0, 0.15);
    color: var(--warning-color, #ff9800);
    font-size: 13px;
    font-weight: 500;
  }
  .prediction-urgency-banner ha-svg-icon {
    --mdc-icon-size: 18px;
    flex-shrink: 0;
  }

  .prediction-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-text-color);
    margin-bottom: 10px;
  }
  .prediction-title ha-svg-icon {
    --mdc-icon-size: 16px;
    color: var(--primary-color);
  }

  .prediction-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .prediction-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .prediction-item ha-svg-icon {
    --mdc-icon-size: 14px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }

  .prediction-label {
    font-weight: 500;
  }

  .prediction-value {
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .prediction-value.rising { color: var(--error-color, #f44336); }
  .prediction-value.falling { color: var(--info-color, #2196f3); }
  .prediction-value.stable { color: var(--success-color, #4caf50); }
  .prediction-value.exceeded { color: var(--error-color, #f44336); font-weight: 700; }
  .prediction-value.urgent { color: var(--warning-color, #ff9800); font-weight: 700; }

  .prediction-rate {
    font-size: 11px;
    opacity: 0.7;
    font-family: monospace;
  }

  .prediction-date {
    font-size: 11px;
    opacity: 0.7;
  }

  .prediction-entity {
    font-size: 10px;
    opacity: 0.6;
    font-family: monospace;
  }

  /* --- Weibull Reliability Section (Phase 4) --- */

  .weibull-section {
    margin: 16px 0;
    padding: 12px 16px;
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--divider-color, #e0e0e0);
  }

  .weibull-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-text-color);
    margin-bottom: 10px;
  }
  .weibull-title ha-svg-icon {
    --mdc-icon-size: 16px;
    color: var(--primary-color);
  }

  .weibull-chart svg {
    width: 100%;
    height: 160px;
    display: block;
  }

  .weibull-info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 10px;
  }

  .weibull-info-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .weibull-info-value {
    font-weight: 600;
    color: var(--primary-text-color);
  }

  /* Beta interpretation badge */
  .beta-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }
  .beta-badge ha-svg-icon {
    --mdc-icon-size: 14px;
  }

  .beta-badge.early_failures {
    background: rgba(244, 67, 54, 0.15);
    color: var(--error-color, #f44336);
  }
  .beta-badge.random_failures {
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color);
  }
  .beta-badge.wear_out {
    background: rgba(255, 152, 0, 0.15);
    color: var(--warning-color, #ff9800);
  }
  .beta-badge.highly_predictable {
    background: rgba(76, 175, 80, 0.15);
    color: var(--success-color, #4caf50);
  }

  /* Confidence interval range bar */
  .confidence-range {
    margin-top: 12px;
  }

  .confidence-range-title {
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color);
    margin-bottom: 6px;
  }

  .confidence-bar {
    position: relative;
    width: 100%;
    height: 8px;
    background: var(--divider-color, #e0e0e0);
    border-radius: 4px;
    overflow: visible;
  }

  .confidence-fill {
    position: absolute;
    height: 100%;
    border-radius: 4px;
    background: var(--primary-color, #03a9f4);
    opacity: 0.25;
  }

  .confidence-marker {
    position: absolute;
    top: -4px;
    width: 3px;
    height: 16px;
    border-radius: 1px;
    transform: translateX(-50%);
  }
  .confidence-marker.recommended {
    background: var(--success-color, #4caf50);
  }
  .confidence-marker.current {
    background: var(--primary-color, #03a9f4);
  }

  .confidence-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
  }

  .confidence-text {
    font-size: 10px;
    color: var(--secondary-text-color);
  }
  .confidence-text.low {
    text-align: left;
  }
  .confidence-text.high {
    text-align: right;
  }
`;var be=class{constructor(r){this._cache=new Map;this._pending=new Map;this._hass=r}updateHass(r){this._hass=r}async getDetailStats(r,e){return this._getStats(r,"hour",30,e)}async getMiniStats(r,e){return this._getStats(r,"day",14,e)}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(r,e,t,i){let s=`${r}:${e}`,a=this._cache.get(s);if(a&&Date.now()-a.fetchedAt<3e5)return a.points;if(this._pending.has(s))return this._pending.get(s);let p=this._fetchAndNormalize(r,e,t,i,s);this._pending.set(s,p);try{return await p}finally{this._pending.delete(s)}}async _fetchAndNormalize(r,e,t,i,s){let a=new Date(Date.now()-t*24*60*60*1e3).toISOString(),p=i?["state","sum","change"]:["mean","min","max"];try{let _=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:a,statistic_ids:[r],period:e,types:p}))[r]||[],h=[];for(let u of _){let m=null;if(i?m=u.state??null:m=u.mean??null,m===null)continue;let b={ts:u.start,val:m};i||(u.min!=null&&(b.min=u.min),u.max!=null&&(b.max=u.max)),h.push(b)}return h.sort((u,m)=>u.ts-m.ts),this._cache.set(s,{entityId:r,fetchedAt:Date.now(),period:e,points:h}),h}catch(d){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${r}:`,d),[]}}};var z=class extends I{constructor(){super(...arguments);this.lang="de";this._open=!1;this._loading=!1;this._error="";this._result=null;this._action="view";this._entryId="";this._taskId=null;this._objectName="";this._taskName=""}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._action="view",this._error="",this._result=null,this._open=!0,this._generate()}openForTask(e,t,i,s){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=s,this._action="view",this._error="",this._result=null,this._open=!0,this._generate()}async _generate(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,action:this._action};this._taskId&&(e.task_id=this._taskId);let t=await this.hass.connection.sendMessagePromise(e);this._result=t}catch{this._error=n("qr_error",this.lang)}finally{this._loading=!1}}_onActionChange(e){this._action=e.target.value,this._generate()}_print(){if(!this._result)return;let e=this._result,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),s=window.open("","_blank","width=400,height=500");s&&(s.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${t}</title>
<style>
  body{font-family:sans-serif;text-align:center;padding:20px}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  img{max-width:280px;width:100%}
  .url{font-size:11px;color:#999;word-break:break-all;margin-top:12px}
</style></head><body>
<h2>${t}</h2>
${i?`<div class="sub">${i}</div>`:""}
<img src="${e.svg_data_uri}" alt="QR Code" />
<div class="url">${e.url}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),s.document.close())}_download(){if(!this._result)return;let e=decodeURIComponent(this._result.svg_data_uri.replace("data:image/svg+xml,","")),t=new Blob([e],{type:"image/svg+xml"}),i=URL.createObjectURL(t),s=document.createElement("a");s.href=i;let a=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;s.download=`qr-${a.replace(/\s+/g,"-").toLowerCase()}.svg`,s.click(),URL.revokeObjectURL(i)}_close(){this._open=!1}render(){if(!this._open)return c``;let e=this.lang||this.hass?.language||"de",t=this._taskName?`${n("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${n("qr_code",e)}: ${this._objectName}`;return c`
      <ha-dialog open @closed=${this._close} .heading=${t}>
        <div class="content">
          ${this._loading?c`<div class="loading">${n("qr_generating",e)}</div>`:this._error?c`<div class="error">${this._error}</div>`:this._result?c`
                    <img
                      class="qr-image"
                      src="${this._result.svg_data_uri}"
                      alt="QR Code"
                    />
                    <div class="url-display">${this._result.url}</div>
                  `:l}
          ${this._taskId?c`
                <div class="action-row">
                  <label>${n("qr_action",e)}</label>
                  <select @change=${this._onActionChange} .value=${this._action}>
                    <option value="view">${n("qr_action_view",e)}</option>
                    <option value="complete">${n("qr_action_complete",e)}</option>
                  </select>
                </div>
              `:l}
        </div>
        <ha-button slot="secondaryAction" appearance="plain" @click=${this._close}>
          ${n("cancel",e)}
        </ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._download}
          .disabled=${!this._result}
        >
          ${n("qr_download",e)}
        </ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._print}
          .disabled=${!this._result}
        >
          ${n("qr_print",e)}
        </ha-button>
      </ha-dialog>
    `}};z.styles=K`
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      min-width: 300px;
    }
    .qr-image {
      width: 240px;
      height: 240px;
      image-rendering: pixelated;
    }
    .url-display {
      font-size: 11px;
      color: var(--secondary-text-color);
      word-break: break-all;
      text-align: center;
      max-width: 280px;
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
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    .action-row label {
      font-size: 13px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .action-row select {
      flex: 1;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
    }
  `,$([V({attribute:!1})],z.prototype,"hass",2),$([V()],z.prototype,"lang",2),$([M()],z.prototype,"_open",2),$([M()],z.prototype,"_loading",2),$([M()],z.prototype,"_error",2),$([M()],z.prototype,"_result",2),$([M()],z.prototype,"_action",2),z=$([me("maintenance-qr-dialog")],z);var Rt=60,Ft=20,Ht=300,Ot=140,zt=300,It=120,at=30,Nt=27,S=class extends I{constructor(){super(...arguments);this.narrow=!1;this.panel={};this._objects=[];this._stats=null;this._view="overview";this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._unsub=null;this._sparklineTooltip=null;this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._statsService=null;this._deepLinkHandled=!1;this._onDialogEvent=async()=>{await this._loadData()}}get _lang(){return this.hass?.language||"de"}connectedCallback(){super.connectedCallback(),this._loadData(),this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub&&(this._unsub(),this._unsub=null),this._statsService?.clearCache(),this._statsService=null}updated(e){super.updated(e),e.has("hass")&&this.hass&&(this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new be(this.hass),this._fetchMiniStatsForOverview()))}async _loadData(){let[e,t,i,s]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null)]);this._objects=e.objects,this._stats=t,i&&(this._budget=i),s&&(this._groups=s.groups||{}),this._fetchMiniStatsForOverview(),this._handleDeepLink()}_handleDeepLink(){if(this._deepLinkHandled)return;let e=new URLSearchParams(window.location.search),t=e.get("entry_id");if(!t)return;this._deepLinkHandled=!0;let i=e.get("task_id"),s=e.get("action"),a=window.location.pathname+window.location.hash;history.replaceState(null,"",a),i?(this._showTask(t,i),s==="complete"&&requestAnimationFrame(()=>{let d=this._getObject(t)?.tasks.find(_=>_.id===i);d&&this._openCompleteDialog(t,i,d.name,d.checklist,!!d.adaptive_config?.enabled)})):this._showObject(t)}_isCounterEntity(e){if(!e)return!1;let t=e.type||"threshold";return t==="counter"||t==="state_change"}async _fetchDetailStats(e,t){if(!this._statsService)return;let i=await this._statsService.getDetailStats(e,t),s=new Map(this._detailStatsData);s.set(e,i),this._detailStatsData=s}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let e=new Map(this._miniStatsData),t=[];for(let i of this._objects)for(let s of i.tasks){let a=s.trigger_config?.entity_id;if(!a)continue;let p=this._isCounterEntity(s.trigger_config);t.push(this._statsService.getMiniStats(a,p).then(d=>{e.set(a,d)}))}t.length>0&&(await Promise.all(t),this._miniStatsData=e)}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(e=>{let t=e;this._objects=t.objects},{type:"maintenance_supporter/subscribe"})}catch{}}get _taskRows(){let e=[];for(let i of this._objects)for(let s of i.tasks)this._filterStatus&&s.status!==this._filterStatus||e.push({entry_id:i.entry_id,task_id:s.id,object_name:i.object.name,task_name:s.name,type:s.type,schedule_type:s.schedule_type,status:s.status,days_until_due:s.days_until_due??null,next_due:s.next_due??null,trigger_active:s.trigger_active,trigger_current_value:s.trigger_current_value??null,trigger_current_delta:s.trigger_current_delta??null,trigger_config:s.trigger_config??null,trigger_entity_info:s.trigger_entity_info??null,times_performed:s.times_performed,total_cost:s.total_cost,interval_days:s.interval_days??null,history:s.history||[]});let t={overdue:0,triggered:1,due_soon:2,ok:3};return e.sort((i,s)=>(t[i.status]??9)-(t[s.status]??9)),e}_getObject(e){return this._objects.find(t=>t.entry_id===e)}_getTask(e,t){return this._getObject(e)?.tasks.find(s=>s.id===t)}_showOverview(){this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null}_showObject(e){this._view="object",this._selectedEntryId=e,this._selectedTaskId=null}_showTask(e,t){this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._historyFilter=null;let i=this._getTask(e,t);if(i?.trigger_config?.entity_id){let s=i.trigger_config.entity_id,a=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(s,a)}}async _deleteObject(e){confirm(n("confirm_delete_object",this._lang))&&(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:e}),this._showOverview(),await this._loadData())}async _deleteTask(e,t){confirm(n("confirm_delete_task",this._lang))&&(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/delete",entry_id:e,task_id:t}),this._showObject(e),await this._loadData())}async _skipTask(e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/skip",entry_id:e,task_id:t}),await this._loadData()}async _resetTask(e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/reset",entry_id:e,task_id:t}),await this._loadData()}async _applySuggestion(e,t,i){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/apply_suggestion",entry_id:e,task_id:t,interval:i}),await this._loadData()}_dismissSuggestion(){this._loadData()}_openCompleteDialog(e,t,i,s,a){let p=this.shadowRoot.querySelector("maintenance-complete-dialog");p&&(p.entryId=e,p.taskId=t,p.taskName=i,p.lang=this._lang,p.checklist=s||[],p.adaptiveEnabled=!!a,p.open())}_openQrForObject(e,t){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForObject(e,t)}_openQrForTask(e,t,i,s){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForTask(e,t,i,s)}async _exportCsv(){let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/export"}),t=new Blob([e.csv],{type:"text/csv;charset=utf-8;"}),i=URL.createObjectURL(t),s=document.createElement("a");s.href=i,s.download="maintenance_export.csv",s.click(),URL.revokeObjectURL(i)}_triggerImportCsv(){let e=this.shadowRoot.querySelector("input[type=file]");e&&(e.value="",e.click())}async _handleCsvFile(e){let i=e.target.files?.[0];if(!i)return;let s=await i.text(),a=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/import",csv_content:s});await this._loadData(),alert(`Imported ${a.created} of ${a.total} objects.`)}render(){return c`
      <div class="panel">
        ${this._renderHeader()}
        <div class="content">
          ${this._view==="overview"?this._renderOverview():this._view==="object"?this._renderObjectDetail():this._renderTaskDetail()}
        </div>
      </div>
      <maintenance-object-dialog
        .hass=${this.hass}
        @object-saved=${this._onDialogEvent}
      ></maintenance-object-dialog>
      <maintenance-task-dialog
        .hass=${this.hass}
        @task-saved=${this._onDialogEvent}
      ></maintenance-task-dialog>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onDialogEvent}
      ></maintenance-complete-dialog>
      <maintenance-qr-dialog
        .hass=${this.hass}
        .lang=${this._lang}
      ></maintenance-qr-dialog>
    `}_renderHeader(){let e=[{label:n("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let i=this._getTask(this._selectedEntryId,this._selectedTaskId);e.push({label:i?.name||"Task"})}return c`
      <div class="header">
        <div class="breadcrumbs">
          ${e.map((t,i)=>c`
              ${i>0?c`<span class="sep">/</span>`:l}
              ${t.action?c`<a @click=${t.action}>${t.label}</a>`:c`<span class="current">${t.label}</span>`}
            `)}
        </div>
      </div>
    `}_renderOverview(){let e=this._stats,t=this._taskRows,i=this._lang;return c`
      ${e?c`
            <div class="stats-bar">
              <div class="stat-item">
                <span class="stat-value">${e.total_objects}</span>
                <span class="stat-label">${n("objects",i)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">${e.total_tasks}</span>
                <span class="stat-label">${n("tasks",i)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" style="color: var(--error-color)">${e.overdue}</span>
                <span class="stat-label">${n("overdue",i)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" style="color: var(--warning-color)">${e.due_soon}</span>
                <span class="stat-label">${n("due_soon",i)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" style="color: #ff5722">${e.triggered}</span>
                <span class="stat-label">${n("triggered",i)}</span>
              </div>
            </div>
          `:l}

      ${this._renderBudgetBar()}

      <div class="filter-bar">
        <select
          @change=${s=>this._filterStatus=s.target.value}
        >
          <option value="">${n("all",i)}</option>
          <option value="overdue">${n("overdue",i)}</option>
          <option value="due_soon">${n("due_soon",i)}</option>
          <option value="triggered">${n("triggered",i)}</option>
          <option value="ok">${n("ok",i)}</option>
        </select>
        <ha-button
          @click=${()=>this.shadowRoot.querySelector("maintenance-object-dialog")?.openCreate()}
        >
          ${n("new_object",i)}
        </ha-button>
        <ha-button @click=${this._exportCsv}>${n("export_csv",i)}</ha-button>
        <ha-button @click=${this._triggerImportCsv}>${n("import_csv",i)}</ha-button>
        <input type="file" accept=".csv" style="display:none" @change=${this._handleCsvFile} />
      </div>

      ${t.length===0?c`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${n("no_tasks",i)}</p>
            </div>
          `:c`
            <div class="task-table">
              ${t.map(s=>this._renderOverviewRow(s))}
            </div>
          `}

      ${this._renderGroupsSection()}
    `}_renderGroupsSection(){let e=Object.entries(this._groups);if(e.length===0)return l;let t=this._lang;return c`
      <div class="groups-section">
        <h3>${n("groups",t)}</h3>
        <div class="groups-grid">
          ${e.map(([i,s])=>{let a=s.task_refs.map(p=>this._getTask(p.entry_id,p.task_id)?.name||p.task_id);return c`
              <div class="group-card">
                <div class="group-card-name">${s.name}</div>
                ${s.description?c`<div class="group-card-desc">${s.description}</div>`:l}
                <div class="group-card-tasks">
                  ${a.length>0?a.map(p=>c`<span class="group-task-chip">${p}</span>`):c`<span style="font-size:12px;color:var(--secondary-text-color)">${n("no_tasks_short",t)}</span>`}
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_renderBudgetBar(){let e=this._budget;if(!e)return l;let t=this._lang,i=[];return e.monthly_budget>0&&i.push({label:n("budget_monthly",t),spent:e.monthly_spent,budget:e.monthly_budget}),e.yearly_budget>0&&i.push({label:n("budget_yearly",t),spent:e.yearly_spent,budget:e.yearly_budget}),i.length===0?l:c`
      <div class="budget-bars">
        ${i.map(s=>{let a=Math.min(100,Math.max(0,s.spent/s.budget*100)),p=a>=100?"var(--error-color, #f44336)":a>=e.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return c`
            <div class="budget-item">
              <div class="budget-label">
                <span>${s.label}</span>
                <span>${s.spent.toFixed(2)} / ${s.budget.toFixed(2)}</span>
              </div>
              <div class="budget-bar">
                <div class="budget-bar-fill" style="width:${a}%; background:${p}"></div>
              </div>
            </div>
          `})}
      </div>
    `}_renderOverviewRow(e){let t=this._lang,i=e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0,s=0,a=fe.ok,p=!1;if(i&&e.days_until_due!==null){let d=(e.interval_days-e.days_until_due)/e.interval_days*100;s=Math.max(0,Math.min(100,d)),p=d>100,e.status==="overdue"?a=fe.overdue:e.status==="due_soon"&&(a=fe.due_soon)}return c`
      <div class="task-row">
        <span class="status-badge ${e.status}">${n(e.status,t)}</span>
        <span class="cell object-name" @click=${d=>{d.stopPropagation(),this._showObject(e.entry_id)}}>${e.object_name}</span>
        <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,e.task_id)}>${e.task_name}</span>
        <span class="cell type">${n(e.type,t)}</span>
        <span class="due-cell" @click=${()=>this._showTask(e.entry_id,e.task_id)}>
          <span class="due-text">${de(e.days_until_due,t)}</span>
          ${i?c`<div class="days-bar"><div class="days-bar-fill${p?" overflow":""}" style="width:${s}%;background:${a}"></div></div>`:l}
          ${e.trigger_config?this._renderTriggerProgress(e):!i&&e.trigger_active?c`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:l}
          ${this._renderMiniSparkline(e)}
        </span>
        <span class="row-actions">
          <mwc-icon-button class="btn-complete" title="${n("complete",t)}" @click=${d=>{d.stopPropagation(),this._openCompleteDialog(e.entry_id,e.task_id,e.task_name)}}>
            <ha-icon icon="mdi:check"></ha-icon>
          </mwc-icon-button>
          <mwc-icon-button class="btn-skip" title="${n("skip",t)}" @click=${d=>{d.stopPropagation(),this._skipTask(e.entry_id,e.task_id)}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>
        </span>
      </div>
    `}_renderTriggerProgress(e){let t=e.trigger_config??null;if(!t)return l;let i=t.type||"threshold",s=e.trigger_entity_info?.unit_of_measurement??"",a=0,p="";if(i==="threshold"){let h=e.trigger_current_value??null;if(h==null)return l;let u=t.trigger_above,m=t.trigger_below;if(u!=null){let b=m??0,y=u-b||1;a=Math.min(100,Math.max(0,(h-b)/y*100)),p=`${h.toFixed(1)} / ${u} ${s}`}else if(m!=null){let y=e.trigger_entity_info?.max??(h*2||100),T=y-m||1;a=Math.min(100,Math.max(0,(y-h)/T*100)),p=`${h.toFixed(1)} / ${m} ${s}`}else return l}else if(i==="counter"){let h=t.trigger_target_value||1,m=e.trigger_current_delta??null??e.trigger_current_value??null;if(m==null)return l;a=Math.min(100,Math.max(0,m/h*100)),p=`${m.toFixed(1)} / ${h} ${s}`}else if(i==="state_change"){let h=t.trigger_target_changes||1,u=e.trigger_current_value??null;if(u==null)return l;a=Math.min(100,Math.max(0,u/h*100)),p=`${Math.round(u)} / ${h}`}else return l;let d=a>=100,_=a>90?"var(--error-color, #f44336)":a>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return c`
      <div class="trigger-progress">
        <div class="trigger-progress-bar">
          <div class="trigger-progress-fill${d?" overflow":""}" style="width:${a}%;background:${_}"></div>
        </div>
        <span class="trigger-progress-label">${p}</span>
      </div>
    `}_renderMiniSparkline(e){if(!e.trigger_config?.entity_id)return l;let t=e.trigger_config.entity_id,i=this._miniStatsData.get(t)||[],s=[];if(i.length>=2)s=i.map(v=>({ts:v.ts,val:v.val}));else{if(!e.history)return l;for(let v of e.history)v.trigger_value!=null&&s.push({ts:new Date(v.timestamp).getTime(),val:v.trigger_value})}if(e.trigger_current_value!=null&&s.push({ts:Date.now(),val:e.trigger_current_value}),s.length<2)return l;s.sort((v,w)=>v.ts-w.ts);let a=Rt,p=Ft,d=s.map(v=>v.val),_=Math.min(...d),h=Math.max(...d),u=h-_||1;_-=u*.1,h+=u*.1;let m=s[0].ts,y=s[s.length-1].ts-m||1,T=v=>(v-m)/y*a,D=v=>2+(1-(v-_)/(h-_))*(p-4),k=s;if(k.length>at){let v=Math.ceil(k.length/at);k=k.filter((w,f)=>f%v===0||f===k.length-1)}let F=k.map(v=>`${T(v.ts).toFixed(1)},${D(v.val).toFixed(1)}`).join(" ");return c`
      <svg class="mini-sparkline" viewBox="0 0 ${a} ${p}" preserveAspectRatio="none" role="img" aria-label="${n("chart_mini_sparkline",this._lang)}">
        <polyline points="${F}" fill="none" stroke="var(--primary-color)" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
    `}_renderDaysProgress(e){let t=this._lang;if(e.days_until_due==null||!e.interval_days||e.interval_days<=0)return l;let s=(e.interval_days-e.days_until_due)/e.interval_days*100,a=Math.max(0,Math.min(100,s)),p=s>100,d="var(--success-color, #4caf50)";return e.status==="overdue"?d="var(--error-color, #f44336)":e.status==="due_soon"&&(d="var(--warning-color, #ff9800)"),c`
      <div class="days-progress">
        <div class="days-progress-labels">
          <span>${e.last_performed?`${n("last_performed",t)}: ${Q(e.last_performed,t)}`:""}</span>
          <span>${e.next_due?`${n("next_due",t)}: ${Q(e.next_due,t)}`:""}</span>
        </div>
        <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(a)}" aria-valuemin="0" aria-valuemax="100" aria-label="${n("days_progress",t)}">
          <div class="days-progress-fill${p?" overflow":""}" style="width:${a}%;background:${d}"></div>
        </div>
        <div class="days-progress-text">${de(e.days_until_due,t)}</div>
      </div>
    `}_renderObjectDetail(){if(!this._selectedEntryId)return l;let e=this._getObject(this._selectedEntryId);if(!e)return c`<p>Object not found.</p>`;let t=e.object,i=this._lang;return c`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${t.name}</h2>
          <div class="action-buttons">
            <ha-button appearance="plain" @click=${()=>{this.shadowRoot.querySelector("maintenance-object-dialog")?.openEdit(e.entry_id,t)}}>${n("edit",i)}</ha-button>
            <ha-button appearance="filled" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate(e.entry_id)}}>${n("add_task",i)}</ha-button>
            <ha-button variant="danger" appearance="plain" @click=${()=>this._deleteObject(e.entry_id)}>${n("delete",i)}</ha-button>
            <ha-button appearance="plain" @click=${()=>this._openQrForObject(e.entry_id,t.name)}><ha-icon icon="mdi:qrcode"></ha-icon> ${n("qr_code",i)}</ha-button>
          </div>
        </div>
        ${t.manufacturer||t.model?c`<p class="meta">${[t.manufacturer,t.model].filter(Boolean).join(" ")}</p>`:l}
        ${t.installation_date?c`<p class="meta">${n("installed",i)}: ${Q(t.installation_date,i)}</p>`:l}

        <h3>${n("tasks",i)} (${e.tasks.length})</h3>
        ${e.tasks.length===0?c`<p class="empty">${n("no_tasks_short",i)}</p>`:e.tasks.map(s=>c`
              <div class="task-row">
                <span class="status-badge ${s.status}">${n(s.status,i)}</span>
                <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,s.id)}>${s.name}</span>
                <span class="cell type">${n(s.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(e.entry_id,s.id)}>
                  <span class="due-text">${de(s.days_until_due,i)}</span>
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${n("complete",i)}" @click=${a=>{a.stopPropagation(),this._openCompleteDialog(e.entry_id,s.id,s.name)}}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${n("skip",i)}" @click=${a=>{a.stopPropagation(),this._skipTask(e.entry_id,s.id)}}>
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </mwc-icon-button>
                </span>
              </div>
            `)}
      </div>
    `}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return l;let e=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!e)return c`<p>Task not found.</p>`;let t=this._lang;return c`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${e.name}</h2>
          <span class="status-badge ${e.status}">${n(e.status,t)}</span>
        </div>

        <div class="action-buttons" style="margin-bottom: 16px;">
          <ha-button appearance="filled" @click=${()=>this._openCompleteDialog(this._selectedEntryId,this._selectedTaskId,e.name,e.checklist,!!e.adaptive_config?.enabled)}>${n("complete",t)}</ha-button>
          <ha-button appearance="plain" @click=${()=>this._skipTask(this._selectedEntryId,this._selectedTaskId)}>${n("skip",t)}</ha-button>
          <ha-button appearance="plain" @click=${()=>this._resetTask(this._selectedEntryId,this._selectedTaskId)}>${n("reset",t)}</ha-button>
          <ha-button appearance="plain" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,e)}}>${n("edit",t)}</ha-button>
          <ha-button variant="danger" appearance="plain" @click=${()=>this._deleteTask(this._selectedEntryId,this._selectedTaskId)}>${n("delete",t)}</ha-button>
          <ha-button appearance="plain" @click=${()=>{let i=this._getObject(this._selectedEntryId)?.object;this._openQrForTask(this._selectedEntryId,this._selectedTaskId,i?.name||"",e.name)}}><ha-icon icon="mdi:qrcode"></ha-icon> ${n("qr_code",t)}</ha-button>
        </div>

        ${this._renderDaysProgress(e)}

        <div class="info-grid">
          <div class="info-item"><span class="label">${n("type",t)}</span><span>${n(e.type,t)}</span></div>
          <div class="info-item"><span class="label">${n("schedule",t)}</span><span>${n(e.schedule_type,t)}</span></div>
          ${e.interval_days?c`<div class="info-item"><span class="label">${n("interval",t)}</span><span>${e.interval_days} ${n("days",t)}${e.suggested_interval&&e.suggested_interval!==e.interval_days?c`<span class="suggestion-badge"><span class="confidence-dot ${e.interval_confidence||"low"}"></span>${e.suggested_interval}${n("days",t).charAt(0)}${e.interval_analysis?.confidence_interval_low!=null&&e.interval_analysis?.confidence_interval_high!=null?` (${e.interval_analysis.confidence_interval_low}\u2013${e.interval_analysis.confidence_interval_high})`:""} ${n("recommended",t)}</span>`:l}${e.seasonal_factor!=null&&e.seasonal_factor!==1?c`<span class="seasonal-factor-tag ${e.seasonal_factor<1?"short":"long"}">${n("seasonal_factor_short",t)}: ${e.seasonal_factor.toFixed(1)}x</span>`:l}</span></div>`:l}
          ${e.suggested_interval&&e.suggested_interval!==e.interval_days?c`
            <div class="info-item suggestion-actions">
              <ha-button appearance="filled" @click=${()=>this._applySuggestion(this._selectedEntryId,this._selectedTaskId,e.suggested_interval)}>${n("apply_suggestion",t)} (${e.suggested_interval}${n("days",t).charAt(0)})</ha-button>
              <ha-button appearance="plain" @click=${()=>this._dismissSuggestion()}>${n("dismiss_suggestion",t)}</ha-button>
            </div>
          `:l}
          <div class="info-item"><span class="label">${n("warning",t)}</span><span>${e.warning_days} ${n("days",t)}</span></div>
          ${e.last_performed?c`<div class="info-item"><span class="label">${n("last_performed",t)}</span><span>${Q(e.last_performed,t)}</span></div>`:l}
          ${e.next_due?c`<div class="info-item"><span class="label">${n("next_due",t)}</span><span>${Q(e.next_due,t)}</span></div>`:l}
          ${e.days_until_due!==null&&e.days_until_due!==void 0?c`<div class="info-item"><span class="label">${n("days_until_due",t)}</span><span>${de(e.days_until_due,t)}</span></div>`:l}
          <div class="info-item"><span class="label">${n("times_performed",t)}</span><span>${e.times_performed}</span></div>
          <div class="info-item"><span class="label">${n("total_cost",t)}</span><span>${e.total_cost.toFixed(2)} €</span></div>
          ${e.average_duration?c`<div class="info-item"><span class="label">${n("avg_duration",t)}</span><span>${e.average_duration.toFixed(0)} min</span></div>`:l}
        </div>

        ${this._renderHistoryChart(e)}

        ${this._renderSeasonalChart(e)}

        ${this._renderWeibullSection(e)}

        ${this._renderPredictionSection(e)}

        ${this._renderTriggerSection(e)}

        ${e.notes?c`<h3>${n("notes",t)}</h3><p>${e.notes}</p>`:l}
        ${e.documentation_url?c`<p><a href="${e.documentation_url}" target="_blank" rel="noopener">${n("documentation",t)}</a></p>`:l}

        <h3>${n("history",t)} (${e.history.length})</h3>
        <div class="history-filters">
          ${["completed","skipped","reset","triggered"].map(i=>{let s=e.history.filter(a=>a.type===i).length;return s===0?l:c`<span class="filter-chip ${this._historyFilter===i?"active":""}"
              @click=${()=>{this._historyFilter=this._historyFilter===i?null:i}}>
              ${n(i,t)} (${s})
            </span>`})}
          ${this._historyFilter?c`<span class="filter-chip clear" @click=${()=>{this._historyFilter=null}}>${n("show_all",t)}</span>`:l}
        </div>
        ${(()=>{let i=this._historyFilter?e.history.filter(s=>s.type===this._historyFilter):e.history;return i.length===0?c`<p class="empty">${n("no_history",t)}</p>`:c`<div class="history-timeline">
                ${[...i].reverse().map(s=>this._renderHistoryEntry(s))}
              </div>`})()}
      </div>
    `}_renderHistoryChart(e){let t=e.history.filter(f=>f.type==="completed"&&(f.cost!=null||f.duration!=null)).map(f=>({ts:new Date(f.timestamp).getTime(),cost:f.cost??0,duration:f.duration??0})).sort((f,E)=>f.ts-E.ts);if(t.length<2)return l;let i=t.some(f=>f.cost>0),s=t.some(f=>f.duration>0);if(!i&&!s)return l;let a=zt,p=It,d=i?32:8,_=s?32:8,h=8,u=20,m=a-d-_,b=p-h-u,y=Math.max(...t.map(f=>f.cost))||1,T=Math.max(...t.map(f=>f.duration))||1,D=Math.min(20,m/t.length*.6),k=m/t.length,F=f=>d+k*f+k/2,v=f=>h+b-f/y*b,w=f=>h+b-f/T*b;return c`
      <h3>${n("cost_duration_chart",this._lang)}</h3>
      <div class="sparkline-container">
        <svg class="history-chart" viewBox="0 0 ${a} ${p}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_history",this._lang)}">
          <!-- Cost bars -->
          ${i?t.map((f,E)=>P`
            <rect x="${(F(E)-D/2).toFixed(1)}" y="${v(f.cost).toFixed(1)}" width="${D.toFixed(1)}" height="${(h+b-v(f.cost)).toFixed(1)}"
              fill="var(--primary-color)" opacity="0.6" rx="2" />
          `):l}
          <!-- Duration line -->
          ${s?P`
            <polyline points="${t.map((f,E)=>`${F(E).toFixed(1)},${w(f.duration).toFixed(1)}`).join(" ")}"
              fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
            ${t.map((f,E)=>P`
              <circle cx="${F(E).toFixed(1)}" cy="${w(f.duration).toFixed(1)}" r="3" fill="var(--accent-color, #ff9800)" />
            `)}
          `:l}
          <!-- X-axis labels -->
          <text x="${d}" y="${p-2}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(t[0].ts).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
          <text x="${a-_}" y="${p-2}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(t[t.length-1].ts).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
          <!-- Y-axis labels -->
          ${i?P`
            <text x="${d-3}" y="${h+4}" text-anchor="end" fill="var(--primary-color)" font-size="7">${y.toFixed(0)}\u20AC</text>
            <text x="${d-3}" y="${h+b+3}" text-anchor="end" fill="var(--primary-color)" font-size="7">0\u20AC</text>
          `:l}
          ${s?P`
            <text x="${a-_+3}" y="${h+4}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">${T.toFixed(0)}m</text>
            <text x="${a-_+3}" y="${h+b+3}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">0m</text>
          `:l}
        </svg>
      </div>
      <div class="chart-legend">
        ${i?c`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${n("cost",this._lang)}</span>`:l}
        ${s?c`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${n("duration",this._lang)}</span>`:l}
      </div>
    `}_renderSeasonalChart(e){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return l;let i=this._lang,s=e.interval_analysis?.seasonal_reason,a=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],p=new Date().getMonth(),d=300,_=100,h=8,m=_-h-4,b=Math.max(...t,1.5),y=d/12,T=y*.65,D=h+m-1/b*m;return c`
      <div class="seasonal-chart">
        <div class="seasonal-chart-title">
          <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
          ${n("seasonal_chart_title",i)}
          ${s?c`<span class="source-tag">${s==="learned"?n("seasonal_learned",i):n("seasonal_manual",i)}</span>`:l}
        </div>
        <svg viewBox="0 0 ${d} ${_}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_seasonal",i)}">
          <!-- Baseline at 1.0 -->
          <line x1="0" y1="${D.toFixed(1)}" x2="${d}" y2="${D.toFixed(1)}"
            stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
          <!-- Bars -->
          ${t.map((k,F)=>{let v=k/b*m,w=F*y+(y-T)/2,f=h+m-v,E=F===p,B=k<1?"var(--success-color, #4caf50)":k>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return P`
              <rect x="${w.toFixed(1)}" y="${f.toFixed(1)}"
                width="${T.toFixed(1)}" height="${v.toFixed(1)}"
                fill="${B}" opacity="${E?1:.5}" rx="2" />
            `})}
        </svg>
        <div class="seasonal-labels">
          ${a.map((k,F)=>c`<span class="seasonal-label ${F===p?"active-month":""}">${n(k,i)}</span>`)}
        </div>
      </div>
    `}_renderWeibullSection(e){let t=e.interval_analysis,i=t?.weibull_beta,s=t?.weibull_eta;if(i==null||s==null)return l;let a=this._lang,p=t?.weibull_r_squared,d=e.interval_days??0,_=e.suggested_interval??d;return c`
      <div class="weibull-section">
        <div class="weibull-title">
          <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
          ${n("weibull_reliability_curve",a)}
          ${this._renderBetaBadge(i,a)}
        </div>
        ${this._renderWeibullChart(i,s,d,_)}
        ${this._renderWeibullInfo(t,a)}
        ${t?.confidence_interval_low!=null?this._renderConfidenceInterval(t,e,a):l}
      </div>
    `}_renderBetaBadge(e,t){let i,s,a;return e<.8?(i="early_failures",s="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",a="beta_early_failures"):e<=1.2?(i="random_failures",s="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",a="beta_random_failures"):e<=3.5?(i="wear_out",s="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",a="beta_wear_out"):(i="highly_predictable",s="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",a="beta_highly_predictable"),c`
      <span class="beta-badge ${i}">
        <ha-svg-icon path="${s}"></ha-svg-icon>
        ${n(a,t)} (β=${e.toFixed(2)})
      </span>
    `}_renderWeibullChart(e,t,i,s){let y=Math.max(i,s,t)*1.3,T=50,D=[];for(let j=0;j<=T;j++){let O=j/T*y,H=1-Math.exp(-Math.pow(O/t,e)),A=32+O/y*260,ye=136-H*128;D.push([A,ye])}let k=D.map(([j,O])=>`${j.toFixed(1)},${O.toFixed(1)}`).join(" "),F="M32,136 "+D.map(([j,O])=>`L${j.toFixed(1)},${O.toFixed(1)}`).join(" ")+` L${D[T][0].toFixed(1)},136 Z`,v=32+i/y*260,w=1-Math.exp(-Math.pow(i/t,e)),f=136-w*128,E=((1-w)*100).toFixed(0),B=32+s/y*260,Z=[0,.25,.5,.75,1];return c`
      <div class="weibull-chart">
        <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_weibull",L)}">
          <!-- Grid lines -->
          ${Z.map(j=>{let O=136-j*128;return P`
              <line x1="${32}" y1="${O.toFixed(1)}" x2="${292}" y2="${O.toFixed(1)}"
                stroke="var(--divider-color)" stroke-width="0.5" ${j===.5?'stroke-dasharray="4,3"':""} />
              <text x="${28}" y="${(O+3).toFixed(1)}" fill="var(--secondary-text-color)"
                font-size="8" text-anchor="end">${(j*100).toFixed(0)}%</text>
            `})}

          <!-- X-axis labels -->
          <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
          <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(y/2)}</text>
          <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(y)}</text>

          <!-- Filled area under CDF curve -->
          <path d="${F}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />

          <!-- CDF Curve -->
          <polyline points="${k}" fill="none"
            stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

          <!-- Current interval marker -->
          ${i>0?P`
            <line x1="${v.toFixed(1)}" y1="${8}" x2="${v.toFixed(1)}" y2="${136 .toFixed(1)}"
              stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
            <circle cx="${v.toFixed(1)}" cy="${f.toFixed(1)}" r="3"
              fill="var(--primary-color, #03a9f4)" />
            <text x="${(v+4).toFixed(1)}" y="${(f-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
              font-size="9" font-weight="600">R=${E}%</text>
          `:l}

          <!-- Recommended marker -->
          ${s>0&&s!==i?P`
            <line x1="${B.toFixed(1)}" y1="${8}" x2="${B.toFixed(1)}" y2="${136 .toFixed(1)}"
              stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
          `:l}

          <!-- Axes -->
          <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
            stroke="var(--secondary-text-color)" stroke-width="1" />
          <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
            stroke="var(--secondary-text-color)" stroke-width="1" />
        </svg>
      </div>
      <div class="chart-legend">
        <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${n("weibull_failure_probability",this._lang)}</span>
        ${i>0?c`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${n("current_interval_marker",this._lang)}</span>`:l}
        ${s>0&&s!==i?c`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${n("recommended_marker",this._lang)}</span>`:l}
      </div>
    `}_renderWeibullInfo(e,t){return c`
      <div class="weibull-info-row">
        <div class="weibull-info-item">
          <span>${n("characteristic_life",t)}</span>
          <span class="weibull-info-value">${Math.round(e.weibull_eta)} ${n("days",t)}</span>
        </div>
        ${e.weibull_r_squared!=null?c`
          <div class="weibull-info-item">
            <span>${n("weibull_r_squared",t)}</span>
            <span class="weibull-info-value">${e.weibull_r_squared.toFixed(3)}</span>
          </div>
        `:l}
      </div>
    `}_renderConfidenceInterval(e,t,i){let s=e.confidence_interval_low,a=e.confidence_interval_high,p=t.suggested_interval??t.interval_days??0,d=t.interval_days??0,_=Math.max(0,s-5),u=a+5-_,m=(s-_)/u*100,b=(a-s)/u*100,y=(p-_)/u*100,T=d>0?(d-_)/u*100:-1;return c`
      <div class="confidence-range">
        <div class="confidence-range-title">
          ${n("confidence_interval",i)}: ${p} ${n("days",i)} (${s}–${a})
        </div>
        <div class="confidence-bar">
          <div class="confidence-fill" style="left:${m.toFixed(1)}%;width:${b.toFixed(1)}%"></div>
          ${T>=0?c`<div class="confidence-marker current" style="left:${T.toFixed(1)}%"></div>`:l}
          <div class="confidence-marker recommended" style="left:${y.toFixed(1)}%"></div>
        </div>
        <div class="confidence-labels">
          <span class="confidence-text low">${n("confidence_conservative",i)} (${s}${n("days",i).charAt(0)})</span>
          <span class="confidence-text high">${n("confidence_aggressive",i)} (${a}${n("days",i).charAt(0)})</span>
        </div>
      </div>
    `}_renderPredictionSection(e){let t=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",i=e.days_until_threshold!=null,s=e.environmental_factor!=null&&e.environmental_factor!==1;if(!t&&!i&&!s)return l;let a=this._lang,p=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return c`
      <div class="prediction-section">
        ${e.sensor_prediction_urgency?c`
          <div class="prediction-urgency-banner">
            <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
            ${n("sensor_prediction_urgency",a).replace("{days}",String(Math.round(e.days_until_threshold||0)))}
          </div>
        `:l}
        <div class="prediction-title">
          <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
          ${n("sensor_prediction",a)}
        </div>
        <div class="prediction-grid">
          ${t?c`
            <div class="prediction-item">
              <ha-svg-icon path="${p}"></ha-svg-icon>
              <span class="prediction-label">${n("degradation_trend",a)}</span>
              <span class="prediction-value ${e.degradation_trend}">${n("trend_"+e.degradation_trend,a)}</span>
              ${e.degradation_rate!=null?c`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${Math.abs(e.degradation_rate)>=10?Math.round(e.degradation_rate).toLocaleString():e.degradation_rate.toFixed(1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${n("day_short",a)}</span>`:l}
            </div>
          `:l}
          ${i?c`
            <div class="prediction-item">
              <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
              <span class="prediction-label">${n("days_until_threshold",a)}</span>
              <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?n("threshold_exceeded",a):"~"+Math.round(e.days_until_threshold)+" "+n("days",a)}</span>
              ${e.threshold_prediction_date?c`<span class="prediction-date">${Q(e.threshold_prediction_date,a)}</span>`:l}
              ${e.threshold_prediction_confidence?c`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:l}
            </div>
          `:l}
          ${s?c`
            <div class="prediction-item">
              <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
              <span class="prediction-label">${n("environmental_adjustment",a)}</span>
              <span class="prediction-value">${e.environmental_factor.toFixed(2)}x</span>
              ${e.environmental_entity?c`<span class="prediction-entity">${e.environmental_entity}</span>`:l}
            </div>
          `:l}
        </div>
      </div>
    `}_renderTriggerSection(e){let t=e.trigger_config;if(!t)return l;let i=this._lang,s=e.trigger_entity_info,a=s?.friendly_name||t.entity_id||"\u2014",p=t.entity_id||"",d=s?.unit_of_measurement||"",_=e.trigger_current_value,h=t.type||"threshold";return c`
      <h3>${n("trigger",i)}</h3>
      <div class="trigger-card">
        <div class="trigger-header">
          <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
          <div>
            <div class="trigger-entity-name">${a}</div>
            <div class="trigger-entity-id">${p}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          </div>
          <span class="status-badge ${e.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
            ${e.trigger_active?n("triggered",i):n("ok",i)}
          </span>
        </div>

        ${_!=null?c`
              <div class="trigger-value-row">
                <span class="trigger-current ${e.trigger_active?"active":""}">${typeof _=="number"?_.toFixed(1):_}</span>
                ${d?c`<span class="trigger-unit">${d}</span>`:l}
              </div>
            `:l}

        <div class="trigger-limits">
          ${h==="threshold"?c`
            ${t.trigger_above!=null?c`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${n("threshold_above",i)}: ${t.trigger_above} ${d}</span>`:l}
            ${t.trigger_below!=null?c`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${n("threshold_below",i)}: ${t.trigger_below} ${d}</span>`:l}
            ${t.trigger_for_minutes?c`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${n("for_minutes",i)}: ${t.trigger_for_minutes}</span>`:l}
          `:l}
          ${h==="counter"?c`
            ${t.trigger_target_value!=null?c`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${n("target_value",i)}: ${t.trigger_target_value} ${d}</span>`:l}
          `:l}
          ${h==="state_change"?c`
            ${t.trigger_target_changes!=null?c`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${n("target_changes",i)}: ${t.trigger_target_changes}</span>`:l}
          `:l}
          ${s?.min!=null?c`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${n("min",i)}: ${s.min} ${d}</span>`:l}
          ${s?.max!=null?c`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${n("max",i)}: ${s.max} ${d}</span>`:l}
        </div>

        ${this._renderSparkline(e,d)}
      </div>
    `}_renderSparkline(e,t){let i=e.trigger_config;if(!i)return l;let s=i.type||"threshold",a=s==="counter"&&i.trigger_delta_mode,p=this._isCounterEntity(i),d=i.entity_id||"",_=this._detailStatsData.get(d)||[],h=[],u=!1;if(_.length>=2)for(let g of _){let x=g.val;a&&e.trigger_baseline_value!=null&&(x-=e.trigger_baseline_value);let C={ts:g.ts,val:x};!p&&g.min!=null&&g.max!=null&&(C.min=a&&e.trigger_baseline_value!=null?g.min-e.trigger_baseline_value:g.min,C.max=a&&e.trigger_baseline_value!=null?g.max-e.trigger_baseline_value:g.max,u=!0),h.push(C)}else for(let g of e.history)g.trigger_value!=null&&h.push({ts:new Date(g.timestamp).getTime(),val:g.trigger_value});if(e.trigger_current_value!=null){let g=e.trigger_current_value;a&&e.trigger_baseline_value!=null&&(g-=e.trigger_baseline_value),h.push({ts:Date.now(),val:g})}if(h.length<2&&d&&this._statsService&&!this._detailStatsData.has(d))return c`<div class="sparkline-container" aria-live="polite" style="display:flex;align-items:center;justify-content:center;height:140px;color:var(--secondary-text-color);font-size:12px;">
        <ha-icon icon="mdi:chart-line" style="--mdc-icon-size:16px;margin-right:8px;"></ha-icon>
        ${n("loading_chart",this._lang)}
      </div>`;if(h.length<2)return l;h.sort((g,x)=>g.ts-x.ts);let m=Ht,b=Ot,y=30,T=2,D=8,k=16,F=h.map(g=>g.val),v=Math.min(...F),w=Math.max(...F);if(u)for(let g of h)g.min!=null&&(v=Math.min(v,g.min)),g.max!=null&&(w=Math.max(w,g.max));i.trigger_above!=null&&(w=Math.max(w,i.trigger_above),v=Math.min(v,i.trigger_above)),i.trigger_below!=null&&(v=Math.min(v,i.trigger_below),w=Math.max(w,i.trigger_below));let f=null,E=null;if(s==="counter"&&i.trigger_target_value!=null){if(e.trigger_baseline_value!=null)f=e.trigger_baseline_value;else if(h.length>0){let g=[...e.history].filter(x=>x.type==="completed"||x.type==="reset").sort((x,C)=>new Date(C.timestamp).getTime()-new Date(x.timestamp).getTime())[0];if(g){let x=new Date(g.timestamp).getTime(),C=h[0],R=Math.abs(h[0].ts-x);for(let q of h){let U=Math.abs(q.ts-x);U<R&&(C=q,R=U)}f=C.val}else f=h[0].val}f!=null?(E=f+i.trigger_target_value,w=Math.max(w,E),v=Math.min(v,f)):(w=Math.max(w,i.trigger_target_value),v=Math.min(v,0))}a&&e.trigger_baseline_value!=null&&(v=Math.min(v,0));let B=w-v||1;v-=B*.1,w+=B*.1;let Z=h[0].ts,j=h[h.length-1].ts,O=j-Z||1,H=g=>y+(g-Z)/O*(m-y-T),A=g=>D+(1-(g-v)/(w-v))*(b-D-k),ye=h.map(g=>`${H(g.ts).toFixed(1)},${A(g.val).toFixed(1)}`).join(" "),nt=`M${H(h[0].ts).toFixed(1)},${b-k} `+h.map(g=>`L${H(g.ts).toFixed(1)},${A(g.val).toFixed(1)}`).join(" ")+` L${H(h[h.length-1].ts).toFixed(1)},${b-k} Z`,xe="";if(u){let g=h.filter(x=>x.min!=null&&x.max!=null);if(g.length>=2){let x=g.map(R=>`${H(R.ts).toFixed(1)},${A(R.max).toFixed(1)}`),C=[...g].reverse().map(R=>`${H(R.ts).toFixed(1)},${A(R.min).toFixed(1)}`);xe=`M${x[0]} `+x.slice(1).map(R=>`L${R}`).join(" ")+` L${C[0]} `+C.slice(1).map(R=>`L${R}`).join(" ")+" Z"}}let Fe=h[h.length-1],ot=H(Fe.ts),lt=A(Fe.val),He=g=>Math.abs(g)>=1e4?(g/1e3).toFixed(0)+"k":g>=1e3?(g/1e3).toFixed(1)+"k":g.toFixed(g<10?1:0),ct=He(w),dt=He(v),pt=e.history.filter(g=>["completed","skipped","reset"].includes(g.type)).map(g=>({ts:new Date(g.timestamp).getTime(),type:g.type})).filter(g=>g.ts>=Z&&g.ts<=j),$e=Nt,we=h;if(h.length>$e){let g=(h.length-1)/($e-1);we=[];for(let x=0;x<$e;x++)we.push(h[Math.round(x*g)])}return c`
      <div class="sparkline-container">
        <svg class="sparkline-svg" viewBox="0 0 ${m} ${b}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_sparkline",this._lang)}">
          <!-- Y-axis labels -->
          <text x="${y-3}" y="${D+3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${ct}</text>
          <text x="${y-3}" y="${b-k+3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${dt}</text>
          <!-- X-axis labels -->
          <text x="${y}" y="${b-1}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(Z).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
          <text x="${m-T}" y="${b-1}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(j).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
          <!-- Min/max band (mean-type entities) -->
          ${xe?P`<path d="${xe}" fill="var(--primary-color)" opacity="0.08" />`:l}
          <!-- Area fill -->
          <path d="${nt}" fill="var(--primary-color)" opacity="0.15" />
          <!-- Line -->
          <polyline points="${ye}" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linejoin="round" />
          <!-- Prediction projection line (Phase 3) -->
          ${e.degradation_rate!=null&&e.degradation_trend!=="stable"&&e.degradation_trend!=="insufficient_data"&&h.length>=2?(()=>{let g=h[h.length-1],x=30,C=g.ts+x*864e5,R=g.val+e.degradation_rate*x,q=Math.min(C,j+(j-Z)*.3),U=Math.max(v,Math.min(w,R)),ht=H(g.ts),gt=A(g.val),ut=H(q),_t=A(U);return P`<line x1="${ht.toFixed(1)}" y1="${gt.toFixed(1)}" x2="${ut.toFixed(1)}" y2="${_t.toFixed(1)}" stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7" />`})():l}
          <!-- Threshold lines (for threshold type) -->
          ${s==="threshold"&&i.trigger_above!=null?P`<line x1="${y}" y1="${A(i.trigger_above).toFixed(1)}" x2="${m}" y2="${A(i.trigger_above).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                  <text x="${m-2}" y="${A(i.trigger_above)-3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">▲ ${i.trigger_above}</text>`:l}
          ${s==="threshold"&&i.trigger_below!=null?P`<line x1="${y}" y1="${A(i.trigger_below).toFixed(1)}" x2="${m}" y2="${A(i.trigger_below).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                  <text x="${m-2}" y="${A(i.trigger_below)+11}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">▼ ${i.trigger_below}</text>`:l}
          <!-- Target line (for counter type) -->
          ${s==="counter"&&E!=null?P`<line x1="${y}" y1="${A(E).toFixed(1)}" x2="${m}" y2="${A(E).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                  <text x="${m-2}" y="${A(E)-3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">${n("target_value",this._lang)}: +${i.trigger_target_value}</text>`:l}
          <!-- Baseline line (for counter — value at last maintenance) -->
          ${s==="counter"&&f!=null?P`<line x1="${y}" y1="${A(f).toFixed(1)}" x2="${m}" y2="${A(f).toFixed(1)}" stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
                  <text x="${y+2}" y="${A(f)+11}" text-anchor="start" fill="var(--secondary-text-color)" font-size="8">${n("baseline",this._lang)}</text>`:l}
          <!-- Current dot -->
          <circle cx="${ot.toFixed(1)}" cy="${lt.toFixed(1)}" r="3.5" fill="var(--primary-color)" />
          <!-- Event markers -->
          ${pt.map(g=>{let x=H(g.ts),C=g.type==="completed"?"var(--success-color, #4caf50)":g.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return P`
              <line x1="${x.toFixed(1)}" y1="${D}" x2="${x.toFixed(1)}" y2="${b-k}" stroke="${C}" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
              <circle cx="${x.toFixed(1)}" cy="${D+2}" r="5" fill="${C}" opacity="0.8" />
              <text x="${x.toFixed(1)}" y="${D+6}" text-anchor="middle" fill="white" font-size="7" font-weight="bold">${g.type==="completed"?"\u2713":g.type==="skipped"?"\u23ED":"\u21BA"}</text>
            `})}
          <!-- Hover hit targets (downsampled for performance) -->
          ${we.map(g=>{let x=H(g.ts),C=A(g.val),R=new Date(g.ts).toLocaleDateString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),q=`${g.val.toFixed(1)} ${t}`;return u&&g.min!=null&&g.max!=null&&(q+=` (${g.min.toFixed(1)}\u2013${g.max.toFixed(1)})`),P`<circle cx="${x.toFixed(1)}" cy="${C.toFixed(1)}" r="8" fill="transparent" tabindex="0"
              @mouseenter=${U=>this._showSparklineTooltip(U,`${R}
${q}`)}
              @focus=${U=>this._showSparklineTooltip(U,`${R}
${q}`)}
              @mouseleave=${()=>{this._sparklineTooltip=null}}
              @blur=${()=>{this._sparklineTooltip=null}} />`})}
        </svg>
        ${this._sparklineTooltip?c`
          <div class="sparkline-tooltip" role="tooltip" aria-live="assertive" style="left:${this._sparklineTooltip.x}px;top:${this._sparklineTooltip.y}px">
            ${this._sparklineTooltip.text.split(`
`).map(g=>c`<div>${g}</div>`)}
          </div>
        `:l}
      </div>
    `}_showSparklineTooltip(e,t){let i=e.currentTarget,s=i.closest(".sparkline-container");if(!s)return;let a=s.getBoundingClientRect(),p=i.getBoundingClientRect();this._sparklineTooltip={x:p.left-a.left+p.width/2,y:p.top-a.top-8,text:t}}_renderHistoryEntry(e){let t=this._lang;return c`
      <div class="history-entry">
        <div class="history-icon ${e.type}">
          <ha-icon .icon=${it[e.type]||"mdi:circle"}></ha-icon>
        </div>
        <div class="history-content">
          <div><strong>${n(e.type,t)}</strong></div>
          <div class="history-date">${rt(e.timestamp,t)}</div>
          ${e.notes?c`<div>${e.notes}</div>`:l}
          <div class="history-details">
            ${e.cost!=null?c`<span>${n("cost",t)}: ${e.cost.toFixed(2)} €</span>`:l}
            ${e.duration!=null?c`<span>${n("duration",t)}: ${e.duration} min</span>`:l}
            ${e.trigger_value!=null?c`<span>${n("trigger_val",t)}: ${e.trigger_value}</span>`:l}
          </div>
        </div>
      </div>
    `}};S.styles=[st,K`
      :host {
        display: block;
        height: 100%;
        background: var(--primary-background-color);
      }

      .panel {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .header {
        background: var(--app-header-background-color, var(--primary-color));
        color: var(--app-header-text-color, white);
        padding: 12px 16px;
        font-size: 16px;
      }

      .breadcrumbs { display: flex; align-items: center; gap: 4px; }
      .breadcrumbs a { color: inherit; opacity: 0.8; cursor: pointer; text-decoration: none; }
      .breadcrumbs a:hover { opacity: 1; text-decoration: underline; }
      .breadcrumbs .sep { opacity: 0.5; margin: 0 4px; }
      .breadcrumbs .current { font-weight: 500; }

      .content { flex: 1; overflow-y: auto; padding: 0 16px 16px; }

      .filter-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        gap: 8px;
      }

      .filter-bar select {
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
      }

      .task-table { display: flex; flex-direction: column; }

      .task-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-bottom: 1px solid var(--divider-color);
        cursor: pointer;
        transition: background 0.15s;
      }

      .task-row:hover {
        background: var(--table-row-alternative-background-color, rgba(0, 0, 0, 0.04));
      }

      .cell { font-size: 14px; }
      .cell.object-name { color: var(--primary-color); cursor: pointer; min-width: 100px; }
      .cell.task-name { flex: 1; font-weight: 500; }
      .cell.type { min-width: 80px; color: var(--secondary-text-color); }

      .detail-section { padding: 16px 0; }

      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      .detail-header h2 { margin: 0; font-size: 22px; }
      h3 { margin: 16px 0 8px; font-size: 16px; font-weight: 500; }
      .meta { color: var(--secondary-text-color); margin: 4px 0; }
      .empty { color: var(--secondary-text-color); font-style: italic; }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 8px;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        padding: 8px;
        background: var(--card-background-color, #fff);
        border-radius: 8px;
      }

      .info-item .label {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-bottom: 2px;
      }

      /* ha-button handles variant="danger" natively */
    `],$([V({attribute:!1})],S.prototype,"hass",2),$([V({type:Boolean})],S.prototype,"narrow",2),$([V({attribute:!1})],S.prototype,"panel",2),$([M()],S.prototype,"_objects",2),$([M()],S.prototype,"_stats",2),$([M()],S.prototype,"_view",2),$([M()],S.prototype,"_selectedEntryId",2),$([M()],S.prototype,"_selectedTaskId",2),$([M()],S.prototype,"_filterStatus",2),$([M()],S.prototype,"_unsub",2),$([M()],S.prototype,"_sparklineTooltip",2),$([M()],S.prototype,"_historyFilter",2),$([M()],S.prototype,"_budget",2),$([M()],S.prototype,"_groups",2),$([M()],S.prototype,"_detailStatsData",2),$([M()],S.prototype,"_miniStatsData",2),S=$([me("maintenance-supporter-panel")],S);export{S as MaintenanceSupporterPanel};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
