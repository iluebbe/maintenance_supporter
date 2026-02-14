var bt=Object.defineProperty;var yt=Object.getOwnPropertyDescriptor;var g=(o,a,e,t)=>{for(var i=t>1?void 0:t?yt(a,e):a,r=o.length-1,n;r>=0;r--)(n=o[r])&&(i=(t?n(a,e,i):n(i))||i);return t&&i&&bt(a,e,i),i};var me=globalThis,ve=me.ShadowRoot&&(me.ShadyCSS===void 0||me.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Se=Symbol(),Oe=new WeakMap,se=class{constructor(a,e,t){if(this._$cssResult$=!0,t!==Se)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=a,this.t=e}get styleSheet(){let a=this.o,e=this.t;if(ve&&a===void 0){let t=e!==void 0&&e.length===1;t&&(a=Oe.get(e)),a===void 0&&((this.o=a=new CSSStyleSheet).replaceSync(this.cssText),t&&Oe.set(e,a))}return a}toString(){return this.cssText}},Ue=o=>new se(typeof o=="string"?o:o+"",void 0,Se),U=(o,...a)=>{let e=o.length===1?o[0]:a.reduce((t,i,r)=>t+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[r+1],o[0]);return new se(e,o,Se)},qe=(o,a)=>{if(ve)o.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of a){let t=document.createElement("style"),i=me.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,o.appendChild(t)}},Ce=ve?o=>o:o=>o instanceof CSSStyleSheet?(a=>{let e="";for(let t of a.cssRules)e+=t.cssText;return Ue(e)})(o):o;var{is:xt,defineProperty:$t,getOwnPropertyDescriptor:wt,getOwnPropertyNames:kt,getOwnPropertySymbols:At,getPrototypeOf:Et}=Object,G=globalThis,Ve=G.trustedTypes,Tt=Ve?Ve.emptyScript:"",St=G.reactiveElementPolyfillSupport,oe=(o,a)=>o,le={toAttribute(o,a){switch(a){case Boolean:o=o?Tt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,a){let e=o;switch(a){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},fe=(o,a)=>!xt(o,a),Be={attribute:!0,type:String,converter:le,reflect:!1,useDefault:!1,hasChanged:fe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),G.litPropertyMetadata??(G.litPropertyMetadata=new WeakMap);var V=class extends HTMLElement{static addInitializer(a){this._$Ei(),(this.l??(this.l=[])).push(a)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(a,e=Be){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(a)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(a,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(a,t,e);i!==void 0&&$t(this.prototype,a,i)}}static getPropertyDescriptor(a,e,t){let{get:i,set:r}=wt(this.prototype,a)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let u=i?.call(this);r?.call(this,n),this.requestUpdate(a,u,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(a){return this.elementProperties.get(a)??Be}static _$Ei(){if(this.hasOwnProperty(oe("elementProperties")))return;let a=Et(this);a.finalize(),a.l!==void 0&&(this.l=[...a.l]),this.elementProperties=new Map(a.elementProperties)}static finalize(){if(this.hasOwnProperty(oe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(oe("properties"))){let e=this.properties,t=[...kt(e),...At(e)];for(let i of t)this.createProperty(i,e[i])}let a=this[Symbol.metadata];if(a!==null){let e=litPropertyMetadata.get(a);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(a){let e=[];if(Array.isArray(a)){let t=new Set(a.flat(1/0).reverse());for(let i of t)e.unshift(Ce(i))}else a!==void 0&&e.push(Ce(a));return e}static _$Eu(a,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof a=="string"?a.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(a=>this.enableUpdating=a),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(a=>a(this))}addController(a){(this._$EO??(this._$EO=new Set)).add(a),this.renderRoot!==void 0&&this.isConnected&&a.hostConnected?.()}removeController(a){this._$EO?.delete(a)}_$E_(){let a=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(a.set(t,this[t]),delete this[t]);a.size>0&&(this._$Ep=a)}createRenderRoot(){let a=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return qe(a,this.constructor.elementStyles),a}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(a=>a.hostConnected?.())}enableUpdating(a){}disconnectedCallback(){this._$EO?.forEach(a=>a.hostDisconnected?.())}attributeChangedCallback(a,e,t){this._$AK(a,t)}_$ET(a,e){let t=this.constructor.elementProperties.get(a),i=this.constructor._$Eu(a,t);if(i!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:le).toAttribute(e,t.type);this._$Em=a,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(a,e){let t=this.constructor,i=t._$Eh.get(a);if(i!==void 0&&this._$Em!==i){let r=t.getPropertyOptions(i),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:le;this._$Em=i;let u=n.fromAttribute(e,r.type);this[i]=u??this._$Ej?.get(i)??u,this._$Em=null}}requestUpdate(a,e,t,i=!1,r){if(a!==void 0){let n=this.constructor;if(i===!1&&(r=this[a]),t??(t=n.getPropertyOptions(a)),!((t.hasChanged??fe)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(a)&&!this.hasAttribute(n._$Eu(a,t))))return;this.C(a,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(a,e,{useDefault:t,reflect:i,wrapped:r},n){t&&!(this._$Ej??(this._$Ej=new Map)).has(a)&&(this._$Ej.set(a,n??e??this[a]),r!==!0||n!==void 0)||(this._$AL.has(a)||(this.hasUpdated||t||(e=void 0),this._$AL.set(a,e)),i===!0&&this._$Em!==a&&(this._$Eq??(this._$Eq=new Set)).add(a))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let a=this.scheduleUpdate();return a!=null&&await a,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,r]of t){let{wrapped:n}=r,u=this[i];n!==!0||this._$AL.has(i)||u===void 0||this.C(i,void 0,r,u)}}let a=!1,e=this._$AL;try{a=this.shouldUpdate(e),a?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw a=!1,this._$EM(),t}a&&this._$AE(e)}willUpdate(a){}_$AE(a){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(a)),this.updated(a)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(a){return!0}update(a){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(a){}firstUpdated(a){}};V.elementStyles=[],V.shadowRootOptions={mode:"open"},V[oe("elementProperties")]=new Map,V[oe("finalized")]=new Map,St?.({ReactiveElement:V}),(G.reactiveElementVersions??(G.reactiveElementVersions=[])).push("2.1.2");var de=globalThis,We=o=>o,be=de.trustedTypes,Ge=be?be.createPolicy("lit-html",{createHTML:o=>o}):void 0,Xe="$lit$",K=`lit$${Math.random().toFixed(9).slice(2)}$`,et="?"+K,Ct=`<${et}>`,X=document,ue=()=>X.createComment(""),pe=o=>o===null||typeof o!="object"&&typeof o!="function",ze=Array.isArray,Mt=o=>ze(o)||typeof o?.[Symbol.iterator]=="function",Me=`[ 	
\f\r]`,ce=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ke=/-->/g,Ze=/>/g,J=RegExp(`>|${Me}(?:([^\\s"'>=/]+)(${Me}*=${Me}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,Je=/"/g,tt=/^(?:script|style|textarea|title)$/i,Ie=o=>(a,...e)=>({_$litType$:o,strings:a,values:e}),l=Ie(1),L=Ie(2),ai=Ie(3),ee=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Qe=new WeakMap,Q=X.createTreeWalker(X,129);function it(o,a){if(!ze(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ge!==void 0?Ge.createHTML(a):a}var Dt=(o,a)=>{let e=o.length-1,t=[],i,r=a===2?"<svg>":a===3?"<math>":"",n=ce;for(let u=0;u<e;u++){let d=o[u],h,p,m=-1,f=0;for(;f<d.length&&(n.lastIndex=f,p=n.exec(d),p!==null);)f=n.lastIndex,n===ce?p[1]==="!--"?n=Ke:p[1]!==void 0?n=Ze:p[2]!==void 0?(tt.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=J):p[3]!==void 0&&(n=J):n===J?p[0]===">"?(n=i??ce,m=-1):p[1]===void 0?m=-2:(m=n.lastIndex-p[2].length,h=p[1],n=p[3]===void 0?J:p[3]==='"'?Je:Ye):n===Je||n===Ye?n=J:n===Ke||n===Ze?n=ce:(n=J,i=void 0);let x=n===J&&o[u+1].startsWith("/>")?" ":"";r+=n===ce?d+Ct:m>=0?(t.push(h),d.slice(0,m)+Xe+d.slice(m)+K+x):d+K+(m===-2?u:x)}return[it(o,r+(o[e]||"<?>")+(a===2?"</svg>":a===3?"</math>":"")),t]},_e=class o{constructor({strings:a,_$litType$:e},t){let i;this.parts=[];let r=0,n=0,u=a.length-1,d=this.parts,[h,p]=Dt(a,e);if(this.el=o.createElement(h,t),Q.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=Q.nextNode())!==null&&d.length<u;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(Xe)){let f=p[n++],x=i.getAttribute(m).split(K),$=/([.?@])?(.*)/.exec(f);d.push({type:1,index:r,name:$[2],strings:x,ctor:$[1]==="."?je:$[1]==="?"?Le:$[1]==="@"?Fe:ae}),i.removeAttribute(m)}else m.startsWith(K)&&(d.push({type:6,index:r}),i.removeAttribute(m));if(tt.test(i.tagName)){let m=i.textContent.split(K),f=m.length-1;if(f>0){i.textContent=be?be.emptyScript:"";for(let x=0;x<f;x++)i.append(m[x],ue()),Q.nextNode(),d.push({type:2,index:++r});i.append(m[f],ue())}}}else if(i.nodeType===8)if(i.data===et)d.push({type:2,index:r});else{let m=-1;for(;(m=i.data.indexOf(K,m+1))!==-1;)d.push({type:7,index:r}),m+=K.length-1}r++}}static createElement(a,e){let t=X.createElement("template");return t.innerHTML=a,t}};function ie(o,a,e=o,t){if(a===ee)return a;let i=t!==void 0?e._$Co?.[t]:e._$Cl,r=pe(a)?void 0:a._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(o),i._$AT(o,e,t)),t!==void 0?(e._$Co??(e._$Co=[]))[t]=i:e._$Cl=i),i!==void 0&&(a=ie(o,i._$AS(o,a.values),i,t)),a}var De=class{constructor(a,e){this._$AV=[],this._$AN=void 0,this._$AD=a,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(a){let{el:{content:e},parts:t}=this._$AD,i=(a?.creationScope??X).importNode(e,!0);Q.currentNode=i;let r=Q.nextNode(),n=0,u=0,d=t[0];for(;d!==void 0;){if(n===d.index){let h;d.type===2?h=new ge(r,r.nextSibling,this,a):d.type===1?h=new d.ctor(r,d.name,d.strings,this,a):d.type===6&&(h=new Pe(r,this,a)),this._$AV.push(h),d=t[++u]}n!==d?.index&&(r=Q.nextNode(),n++)}return Q.currentNode=X,i}p(a){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(a,t,e),e+=t.strings.length-2):t._$AI(a[e])),e++}},ge=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(a,e,t,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=a,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let a=this._$AA.parentNode,e=this._$AM;return e!==void 0&&a?.nodeType===11&&(a=e.parentNode),a}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(a,e=this){a=ie(this,a,e),pe(a)?a===c||a==null||a===""?(this._$AH!==c&&this._$AR(),this._$AH=c):a!==this._$AH&&a!==ee&&this._(a):a._$litType$!==void 0?this.$(a):a.nodeType!==void 0?this.T(a):Mt(a)?this.k(a):this._(a)}O(a){return this._$AA.parentNode.insertBefore(a,this._$AB)}T(a){this._$AH!==a&&(this._$AR(),this._$AH=this.O(a))}_(a){this._$AH!==c&&pe(this._$AH)?this._$AA.nextSibling.data=a:this.T(X.createTextNode(a)),this._$AH=a}$(a){let{values:e,_$litType$:t}=a,i=typeof t=="number"?this._$AC(a):(t.el===void 0&&(t.el=_e.createElement(it(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new De(i,this),n=r.u(this.options);r.p(e),this.T(n),this._$AH=r}}_$AC(a){let e=Qe.get(a.strings);return e===void 0&&Qe.set(a.strings,e=new _e(a)),e}k(a){ze(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let r of a)i===e.length?e.push(t=new o(this.O(ue()),this.O(ue()),this,this.options)):t=e[i],t._$AI(r),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(a=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);a!==this._$AB;){let t=We(a).nextSibling;We(a).remove(),a=t}}setConnected(a){this._$AM===void 0&&(this._$Cv=a,this._$AP?.(a))}},ae=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(a,e,t,i,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=a,this.name=e,this._$AM=i,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=c}_$AI(a,e=this,t,i){let r=this.strings,n=!1;if(r===void 0)a=ie(this,a,e,0),n=!pe(a)||a!==this._$AH&&a!==ee,n&&(this._$AH=a);else{let u=a,d,h;for(a=r[0],d=0;d<r.length-1;d++)h=ie(this,u[t+d],e,d),h===ee&&(h=this._$AH[d]),n||(n=!pe(h)||h!==this._$AH[d]),h===c?a=c:a!==c&&(a+=(h??"")+r[d+1]),this._$AH[d]=h}n&&!i&&this.j(a)}j(a){a===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,a??"")}},je=class extends ae{constructor(){super(...arguments),this.type=3}j(a){this.element[this.name]=a===c?void 0:a}},Le=class extends ae{constructor(){super(...arguments),this.type=4}j(a){this.element.toggleAttribute(this.name,!!a&&a!==c)}},Fe=class extends ae{constructor(a,e,t,i,r){super(a,e,t,i,r),this.type=5}_$AI(a,e=this){if((a=ie(this,a,e,0)??c)===ee)return;let t=this._$AH,i=a===c&&t!==c||a.capture!==t.capture||a.once!==t.once||a.passive!==t.passive,r=a!==c&&(t===c||i);i&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,a),this._$AH=a}handleEvent(a){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,a):this._$AH.handleEvent(a)}},Pe=class{constructor(a,e,t){this.element=a,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(a){ie(this,a)}};var jt=de.litHtmlPolyfillSupport;jt?.(_e,ge),(de.litHtmlVersions??(de.litHtmlVersions=[])).push("3.3.2");var at=(o,a,e)=>{let t=e?.renderBefore??a,i=t._$litPart$;if(i===void 0){let r=e?.renderBefore??null;t._$litPart$=i=new ge(a.insertBefore(ue(),r),r,void 0,e??{})}return i._$AI(o),i};var he=globalThis,I=class extends V{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let a=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=a.firstChild),a}update(a){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(a),this._$Do=at(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ee}};I._$litElement$=!0,I.finalized=!0,he.litElementHydrateSupport?.({LitElement:I});var Lt=he.litElementPolyfillSupport;Lt?.({LitElement:I});(he.litElementVersions??(he.litElementVersions=[])).push("4.2.2");var re=o=>(a,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,a)}):customElements.define(o,a)};var Ft={attribute:!0,type:String,converter:le,reflect:!1,hasChanged:fe},Pt=(o=Ft,a,e)=>{let{kind:t,metadata:i}=e,r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),t==="setter"&&((o=Object.create(o)).wrapped=!0),r.set(e.name,o),t==="accessor"){let{name:n}=e;return{set(u){let d=a.get.call(this);a.set.call(this,u),this.requestUpdate(n,d,o,!0,u)},init(u){return u!==void 0&&this.C(n,void 0,o,u),u}}}if(t==="setter"){let{name:n}=e;return function(u){let d=this[n];a.call(this,u),this.requestUpdate(n,d,o,!0,u)}}throw Error("Unsupported decorator location: "+t)};function R(o){return(a,e)=>typeof e=="object"?Pt(o,a,e):((t,i,r)=>{let n=i.hasOwnProperty(r);return i.constructor.createProperty(r,t),n?Object.getOwnPropertyDescriptor(i,r):void 0})(o,a,e)}function v(o){return R({...o,state:!0,attribute:!1})}var xe={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"#ff5722"},nt={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",completed:"mdi:check-circle",skipped:"mdi:skip-next",reset:"mdi:refresh"};var zt={maintenance:"Wartung",objects:"Objekte",tasks:"Aufgaben",overdue:"\xDCberf\xE4llig",due_soon:"Bald f\xE4llig",triggered:"Ausgel\xF6st",ok:"OK",all:"Alle",new_object:"+ Neues Objekt",edit:"Bearbeiten",delete:"L\xF6schen",add_task:"+ Aufgabe",complete:"Erledigt",skip:"\xDCberspringen",reset:"Zur\xFCcksetzen",cancel:"Abbrechen",completing:"Wird erledigt\u2026",type:"Typ",schedule:"Planung",interval:"Intervall",warning:"Vorwarnung",last_performed:"Zuletzt durchgef\xFChrt",next_due:"N\xE4chste F\xE4lligkeit",days_until_due:"Tage bis f\xE4llig",times_performed:"Durchf\xFChrungen",total_cost:"Gesamtkosten",avg_duration:"\xD8 Dauer",trigger:"Trigger",entity:"Entit\xE4t",attribute:"Attribut",trigger_type:"Trigger-Typ",active:"Aktiv",yes:"Ja",no:"Nein",current_value:"Aktueller Wert",threshold_above:"Obergrenze",threshold_below:"Untergrenze",threshold:"Schwellwert",counter:"Z\xE4hler",state_change:"Zustands\xE4nderung",target_value:"Zielwert",baseline:"Nulllinie",target_changes:"Ziel-\xC4nderungen",entity_min:"Minimum",entity_max:"Maximum",for_minutes:"F\xFCr (Minuten)",time_based:"Zeitbasiert",sensor_based:"Sensorbasiert",manual:"Manuell",cleaning:"Reinigung",inspection:"Inspektion",replacement:"Austausch",calibration:"Kalibrierung",service:"Service",custom:"Benutzerdefiniert",history:"Verlauf",notes:"Notizen",documentation:"Dokumentation",cost:"Kosten",duration:"Dauer",both:"Beides",trigger_val:"Trigger-Wert",complete_title:"Erledigt: ",checklist:"Checkliste",notes_optional:"Notizen (optional)",cost_optional:"Kosten (optional)",duration_minutes:"Dauer in Minuten (optional)",days:"Tage",day:"Tag",today:"Heute",d_overdue:"T \xFCberf\xE4llig",no_tasks:"Keine Wartungsaufgaben vorhanden. Erstellen Sie ein Objekt um zu beginnen.",no_tasks_short:"Keine Aufgaben",no_history:"Noch keine Verlaufseintr\xE4ge.",show_all:"Alle anzeigen",cost_duration_chart:"Kosten & Dauer",installed:"Installiert",confirm_delete_object:"Dieses Objekt und alle zugeh\xF6rigen Aufgaben l\xF6schen?",confirm_delete_task:"Diese Aufgabe wirklich l\xF6schen?",value_history:"Wertverlauf",min:"Min",max:"Max",save:"Speichern",saving:"Speichern\u2026",edit_task:"Aufgabe bearbeiten",new_task:"Neue Wartungsaufgabe",task_name:"Aufgabenname",maintenance_type:"Wartungstyp",schedule_type:"Planungsart",interval_days:"Intervall (Tage)",warning_days:"Warntage",edit_object:"Objekt bearbeiten",name:"Name",manufacturer_optional:"Hersteller (optional)",model_optional:"Modell (optional)",trigger_configuration:"Trigger-Konfiguration",entity_id:"Entit\xE4ts-ID",attribute_optional:"Attribut (optional, leer = Zustand)",trigger_above:"Ausl\xF6sen wenn \xFCber",trigger_below:"Ausl\xF6sen wenn unter",for_at_least_minutes:"F\xFCr mindestens (Minuten)",safety_interval_days:"Sicherheitsintervall (Tage, optional)",delta_mode:"Delta-Modus",from_state_optional:"Von Zustand (optional)",to_state_optional:"Zu Zustand (optional)",documentation_url_optional:"Dokumentation URL (optional)",responsible_user:"Verantwortlicher Benutzer",no_user_assigned:"(Kein Benutzer zugewiesen)",all_users:"Alle Benutzer",my_tasks:"Meine Aufgaben",budget_monthly:"Monatsbudget",budget_yearly:"Jahresbudget",export_csv:"CSV Export",import_csv:"CSV Import",groups:"Gruppen",no_groups:"Keine Gruppen definiert.",group_tasks:"Aufgaben",loading_chart:"Daten werden geladen...",was_maintenance_needed:"War diese Wartung n\xF6tig?",feedback_needed:"N\xF6tig",feedback_not_needed:"Nicht n\xF6tig",feedback_not_sure:"Unsicher",suggested_interval:"Empfohlenes Intervall",apply_suggestion:"\xDCbernehmen",dismiss_suggestion:"Verwerfen",adaptive_scheduling:"Adaptive Planung",confidence_low:"Niedrig",confidence_medium:"Mittel",confidence_high:"Hoch",confidence:"Konfidenz",recommended:"empfohlen",seasonal_awareness:"Saisonale Anpassung",seasonal_factor:"Saisonfaktor",seasonal_chart_title:"Saisonale Faktoren",seasonal_learned:"Gelernt",seasonal_manual:"Manuell",seasonal_insufficient_data:"Nicht genug Daten",month_jan:"Jan",month_feb:"Feb",month_mar:"M\xE4r",month_apr:"Apr",month_may:"Mai",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dez",hemisphere_north:"N\xF6rdlich",hemisphere_south:"S\xFCdlich",seasonal_factor_short:"Saison",sensor_prediction:"Sensorvorhersage",degradation_trend:"Trend",trend_rising:"Steigend",trend_falling:"Fallend",trend_stable:"Stabil",trend_insufficient_data:"Unzureichende Daten",days_until_threshold:"Tage bis Schwellwert",threshold_exceeded:"Schwellwert \xFCberschritten",environmental_adjustment:"Umgebungsfaktor",sensor_prediction_urgency:"Sensor prognostiziert Schwellwert in ~{days} Tagen",day_short:"Tag",prediction_projection:"Projektion",weibull_reliability_curve:"Zuverl\xE4ssigkeitskurve",weibull_failure_probability:"Ausfallwahrscheinlichkeit",weibull_reliability:"Zuverl\xE4ssigkeit",weibull_beta_param:"Form \u03B2",weibull_eta_param:"Skala \u03B7",weibull_r_squared:"G\xFCte R\xB2",beta_early_failures:"Fr\xFChausf\xE4lle",beta_random_failures:"Zuf\xE4llige Ausf\xE4lle",beta_wear_out:"Verschlei\xDF",beta_highly_predictable:"Hochvorhersagbar",confidence_interval:"Konfidenzintervall",confidence_conservative:"Konservativ",confidence_aggressive:"Optimistisch",current_interval_marker:"Aktuelles Intervall",recommended_marker:"Empfohlen",reliability_at_current:"Zuverl\xE4ssigkeit bei aktuellem Intervall",characteristic_life:"Charakteristische Lebensdauer",chart_mini_sparkline:"Trend-Sparkline",chart_history:"Kosten- und Dauer-Verlauf",chart_seasonal:"Saisonfaktoren, 12 Monate",chart_weibull:"Weibull-Zuverl\xE4ssigkeitskurve",chart_sparkline:"Sensor-Triggerwert-Verlauf",days_progress:"Tagesfortschritt",qr_code:"QR-Code",qr_generating:"QR-Code wird generiert\u2026",qr_error:"QR-Code konnte nicht generiert werden.",qr_print:"Drucken",qr_download:"SVG herunterladen",qr_action:"Aktion beim Scannen",qr_action_view:"Wartungsinfo anzeigen",qr_action_complete:"Wartung als erledigt markieren",overview:"\xDCbersicht",analysis:"Analyse",recent_activities:"Letzte Aktivit\xE4ten",search_notes:"Notizen durchsuchen",avg_cost:"\xD8 Kosten",no_advanced_features:"Keine erweiterten Funktionen aktiviert",analysis_not_enough_data:"Noch nicht gen\xFCgend Daten f\xFCr die Analyse vorhanden.",analysis_not_enough_data_hint:"Die Weibull-Analyse ben\xF6tigt mindestens 5 abgeschlossene Wartungen, saisonale Muster werden nach 6+ Datenpunkten pro Monat sichtbar.",analysis_manual_task_hint:"Manuelle Aufgaben ohne Intervall erzeugen keine Analysedaten.",current:"Aktuell",shorter:"K\xFCrzer",longer:"L\xE4nger",normal:"Normal"},It={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",ok:"OK",all:"All",new_object:"+ New Object",edit:"Edit",delete:"Delete",add_task:"+ Add Task",complete:"Complete",skip:"Skip",reset:"Reset",cancel:"Cancel",completing:"Completing\u2026",type:"Type",schedule:"Schedule",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",times_performed:"Times performed",total_cost:"Total cost",avg_duration:"Avg duration",trigger:"Trigger",entity:"Entity",attribute:"Attribute",trigger_type:"Trigger type",active:"Active",yes:"Yes",no:"No",current_value:"Current value",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",entity_min:"Minimum",entity_max:"Maximum",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",custom:"Custom",history:"History",notes:"Notes",documentation:"Documentation",cost:"Cost",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",value_history:"Value history",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",attribute_optional:"Attribute (optional, blank = state)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",responsible_user:"Responsible User",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",export_csv:"CSV Export",import_csv:"CSV Import",groups:"Groups",no_groups:"No groups defined.",group_tasks:"Tasks",loading_chart:"Loading chart data...",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",dismiss_suggestion:"Dismiss",adaptive_scheduling:"Adaptive Scheduling",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",confidence:"Confidence",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",seasonal_factor:"Seasonal factor",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",seasonal_insufficient_data:"Insufficient data",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",hemisphere_north:"Northern",hemisphere_south:"Southern",seasonal_factor_short:"Season",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",prediction_projection:"Projection",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_reliability:"Reliability",weibull_beta_param:"Shape \u03B2",weibull_eta_param:"Scale \u03B7",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",reliability_at_current:"Reliability at current interval",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal"},Ht={maintenance:"Onderhoud",objects:"Objecten",tasks:"Taken",overdue:"Achterstallig",due_soon:"Binnenkort",triggered:"Geactiveerd",ok:"OK",all:"Alle",new_object:"+ Nieuw object",edit:"Bewerken",delete:"Verwijderen",add_task:"+ Taak",complete:"Voltooid",skip:"Overslaan",reset:"Resetten",cancel:"Annuleren",completing:"Wordt voltooid\u2026",type:"Type",schedule:"Planning",interval:"Interval",warning:"Waarschuwing",last_performed:"Laatst uitgevoerd",next_due:"Volgende keer",days_until_due:"Dagen tot vervaldatum",times_performed:"Aantal keer uitgevoerd",total_cost:"Totale kosten",avg_duration:"\xD8 Duur",trigger:"Trigger",entity:"Entiteit",attribute:"Attribuut",trigger_type:"Triggertype",active:"Actief",yes:"Ja",no:"Nee",current_value:"Huidige waarde",threshold_above:"Bovengrens",threshold_below:"Ondergrens",threshold:"Drempelwaarde",counter:"Teller",state_change:"Statuswijziging",target_value:"Doelwaarde",baseline:"Basislijn",target_changes:"Doelwijzigingen",entity_min:"Minimum",entity_max:"Maximum",for_minutes:"Voor (minuten)",time_based:"Tijdgebaseerd",sensor_based:"Sensorgebaseerd",manual:"Handmatig",cleaning:"Reiniging",inspection:"Inspectie",replacement:"Vervanging",calibration:"Kalibratie",service:"Service",custom:"Aangepast",history:"Geschiedenis",notes:"Notities",documentation:"Documentatie",cost:"Kosten",duration:"Duur",both:"Beide",trigger_val:"Triggerwaarde",complete_title:"Voltooid: ",checklist:"Checklist",notes_optional:"Notities (optioneel)",cost_optional:"Kosten (optioneel)",duration_minutes:"Duur in minuten (optioneel)",days:"dagen",day:"dag",today:"Vandaag",d_overdue:"d achterstallig",no_tasks:"Geen onderhoudstaken. Maak een object aan om te beginnen.",no_tasks_short:"Geen taken",no_history:"Nog geen geschiedenisitems.",show_all:"Alles tonen",cost_duration_chart:"Kosten & Duur",installed:"Ge\xEFnstalleerd",confirm_delete_object:"Dit object en alle bijbehorende taken verwijderen?",confirm_delete_task:"Deze taak verwijderen?",value_history:"Waardegeschiedenis",min:"Min",max:"Max",save:"Opslaan",saving:"Opslaan\u2026",edit_task:"Taak bewerken",new_task:"Nieuwe onderhoudstaak",task_name:"Taaknaam",maintenance_type:"Onderhoudstype",schedule_type:"Planningstype",interval_days:"Interval (dagen)",warning_days:"Waarschuwingsdagen",edit_object:"Object bewerken",name:"Naam",manufacturer_optional:"Fabrikant (optioneel)",model_optional:"Model (optioneel)",trigger_configuration:"Triggerconfiguratie",entity_id:"Entiteits-ID",attribute_optional:"Attribuut (optioneel, leeg = status)",trigger_above:"Activeren als boven",trigger_below:"Activeren als onder",for_at_least_minutes:"Voor minstens (minuten)",safety_interval_days:"Veiligheidsinterval (dagen, optioneel)",delta_mode:"Deltamodus",from_state_optional:"Van status (optioneel)",to_state_optional:"Naar status (optioneel)",documentation_url_optional:"Documentatie-URL (optioneel)",responsible_user:"Verantwoordelijke gebruiker",no_user_assigned:"(Geen gebruiker toegewezen)",all_users:"Alle gebruikers",my_tasks:"Mijn taken",budget_monthly:"Maandbudget",budget_yearly:"Jaarbudget",export_csv:"CSV-export",import_csv:"CSV-import",groups:"Groepen",no_groups:"Geen groepen gedefinieerd.",group_tasks:"Taken",loading_chart:"Grafiekgegevens laden...",was_maintenance_needed:"Was dit onderhoud nodig?",feedback_needed:"Nodig",feedback_not_needed:"Niet nodig",feedback_not_sure:"Niet zeker",suggested_interval:"Voorgesteld interval",apply_suggestion:"Toepassen",dismiss_suggestion:"Negeren",adaptive_scheduling:"Adaptieve planning",confidence_low:"Laag",confidence_medium:"Gemiddeld",confidence_high:"Hoog",confidence:"Betrouwbaarheid",recommended:"aanbevolen",seasonal_awareness:"Seizoensbewustzijn",seasonal_factor:"Seizoensfactor",seasonal_chart_title:"Seizoensfactoren",seasonal_learned:"Geleerd",seasonal_manual:"Handmatig",seasonal_insufficient_data:"Onvoldoende gegevens",month_jan:"Jan",month_feb:"Feb",month_mar:"Mrt",month_apr:"Apr",month_may:"Mei",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dec",hemisphere_north:"Noordelijk",hemisphere_south:"Zuidelijk",seasonal_factor_short:"Seizoen",sensor_prediction:"Sensorvoorspelling",degradation_trend:"Trend",trend_rising:"Stijgend",trend_falling:"Dalend",trend_stable:"Stabiel",trend_insufficient_data:"Onvoldoende gegevens",days_until_threshold:"Dagen tot drempelwaarde",threshold_exceeded:"Drempelwaarde overschreden",environmental_adjustment:"Omgevingsfactor",sensor_prediction_urgency:"Sensor voorspelt drempelwaarde in ~{days} dagen",day_short:"dag",prediction_projection:"Projectie",weibull_reliability_curve:"Betrouwbaarheidscurve",weibull_failure_probability:"Faalkans",weibull_reliability:"Betrouwbaarheid",weibull_beta_param:"Vorm \u03B2",weibull_eta_param:"Schaal \u03B7",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Vroege uitval",beta_random_failures:"Willekeurige uitval",beta_wear_out:"Slijtage",beta_highly_predictable:"Zeer voorspelbaar",confidence_interval:"Betrouwbaarheidsinterval",confidence_conservative:"Conservatief",confidence_aggressive:"Optimistisch",current_interval_marker:"Huidig interval",recommended_marker:"Aanbevolen",reliability_at_current:"Betrouwbaarheid bij huidig interval",characteristic_life:"Karakteristieke levensduur",chart_mini_sparkline:"Trend-sparkline",chart_history:"Kosten- en duurgeschiedenis",chart_seasonal:"Seizoensfactoren, 12 maanden",chart_weibull:"Weibull-betrouwbaarheidscurve",chart_sparkline:"Sensor-triggerwaardegrafiek",days_progress:"Dagenvoortgang",qr_code:"QR-code",qr_generating:"QR-code genereren\u2026",qr_error:"QR-code kon niet worden gegenereerd.",qr_print:"Afdrukken",qr_download:"SVG downloaden",qr_action:"Actie bij scannen",qr_action_view:"Onderhoudsinfo bekijken",qr_action_complete:"Onderhoud als voltooid markeren",overview:"Overzicht",analysis:"Analyse",recent_activities:"Recente activiteiten",search_notes:"Notities doorzoeken",avg_cost:"\xD8 Kosten",no_advanced_features:"Geen geavanceerde functies ingeschakeld",analysis_not_enough_data:"Nog niet genoeg gegevens voor analyse.",analysis_not_enough_data_hint:"Weibull-analyse vereist minstens 5 voltooide onderhoudsbeurten; seizoenspatronen worden zichtbaar na 6+ datapunten per maand.",analysis_manual_task_hint:"Handmatige taken zonder interval genereren geen analysegegevens.",current:"Huidig",shorter:"Korter",longer:"Langer",normal:"Normaal"},Rt={maintenance:"Maintenance",objects:"Objets",tasks:"T\xE2ches",overdue:"En retard",due_soon:"Bient\xF4t d\xFB",triggered:"D\xE9clench\xE9",ok:"OK",all:"Tous",new_object:"+ Nouvel objet",edit:"Modifier",delete:"Supprimer",add_task:"+ T\xE2che",complete:"Termin\xE9",skip:"Passer",reset:"R\xE9initialiser",cancel:"Annuler",completing:"En cours\u2026",type:"Type",schedule:"Planification",interval:"Intervalle",warning:"Avertissement",last_performed:"Derni\xE8re ex\xE9cution",next_due:"Prochaine \xE9ch\xE9ance",days_until_due:"Jours restants",times_performed:"Nombre d'ex\xE9cutions",total_cost:"Co\xFBt total",avg_duration:"\xD8 Dur\xE9e",trigger:"D\xE9clencheur",entity:"Entit\xE9",attribute:"Attribut",trigger_type:"Type de d\xE9clencheur",active:"Actif",yes:"Oui",no:"Non",current_value:"Valeur actuelle",threshold_above:"Limite sup\xE9rieure",threshold_below:"Limite inf\xE9rieure",threshold:"Seuil",counter:"Compteur",state_change:"Changement d'\xE9tat",target_value:"Valeur cible",baseline:"Ligne de base",target_changes:"Changements cibles",entity_min:"Minimum",entity_max:"Maximum",for_minutes:"Pendant (minutes)",time_based:"Temporel",sensor_based:"Capteur",manual:"Manuel",cleaning:"Nettoyage",inspection:"Inspection",replacement:"Remplacement",calibration:"\xC9talonnage",service:"Service",custom:"Personnalis\xE9",history:"Historique",notes:"Notes",documentation:"Documentation",cost:"Co\xFBt",duration:"Dur\xE9e",both:"Les deux",trigger_val:"Valeur du d\xE9clencheur",complete_title:"Termin\xE9 : ",checklist:"Checklist",notes_optional:"Notes (optionnel)",cost_optional:"Co\xFBt (optionnel)",duration_minutes:"Dur\xE9e en minutes (optionnel)",days:"jours",day:"jour",today:"Aujourd'hui",d_overdue:"j en retard",no_tasks:"Aucune t\xE2che de maintenance. Cr\xE9ez un objet pour commencer.",no_tasks_short:"Aucune t\xE2che",no_history:"Aucun historique.",show_all:"Tout afficher",cost_duration_chart:"Co\xFBts & Dur\xE9e",installed:"Install\xE9",confirm_delete_object:"Supprimer cet objet et toutes ses t\xE2ches ?",confirm_delete_task:"Supprimer cette t\xE2che ?",value_history:"Historique des valeurs",min:"Min",max:"Max",save:"Enregistrer",saving:"Enregistrement\u2026",edit_task:"Modifier la t\xE2che",new_task:"Nouvelle t\xE2che de maintenance",task_name:"Nom de la t\xE2che",maintenance_type:"Type de maintenance",schedule_type:"Type de planification",interval_days:"Intervalle (jours)",warning_days:"Jours d'avertissement",edit_object:"Modifier l'objet",name:"Nom",manufacturer_optional:"Fabricant (optionnel)",model_optional:"Mod\xE8le (optionnel)",trigger_configuration:"Configuration du d\xE9clencheur",entity_id:"ID d'entit\xE9",attribute_optional:"Attribut (optionnel, vide = \xE9tat)",trigger_above:"D\xE9clencher au-dessus de",trigger_below:"D\xE9clencher en dessous de",for_at_least_minutes:"Pendant au moins (minutes)",safety_interval_days:"Intervalle de s\xE9curit\xE9 (jours, optionnel)",delta_mode:"Mode delta",from_state_optional:"\xC9tat source (optionnel)",to_state_optional:"\xC9tat cible (optionnel)",documentation_url_optional:"URL de documentation (optionnel)",responsible_user:"Utilisateur responsable",no_user_assigned:"(Aucun utilisateur assign\xE9)",all_users:"Tous les utilisateurs",my_tasks:"Mes t\xE2ches",budget_monthly:"Budget mensuel",budget_yearly:"Budget annuel",export_csv:"Export CSV",import_csv:"Import CSV",groups:"Groupes",no_groups:"Aucun groupe d\xE9fini.",group_tasks:"T\xE2ches",loading_chart:"Chargement des donn\xE9es...",was_maintenance_needed:"Cette maintenance \xE9tait-elle n\xE9cessaire ?",feedback_needed:"N\xE9cessaire",feedback_not_needed:"Pas n\xE9cessaire",feedback_not_sure:"Pas s\xFBr",suggested_interval:"Intervalle sugg\xE9r\xE9",apply_suggestion:"Appliquer",dismiss_suggestion:"Ignorer",adaptive_scheduling:"Planification adaptative",confidence_low:"Faible",confidence_medium:"Moyen",confidence_high:"\xC9lev\xE9",confidence:"Confiance",recommended:"recommand\xE9",seasonal_awareness:"Conscience saisonni\xE8re",seasonal_factor:"Facteur saisonnier",seasonal_chart_title:"Facteurs saisonniers",seasonal_learned:"Appris",seasonal_manual:"Manuel",seasonal_insufficient_data:"Donn\xE9es insuffisantes",month_jan:"Jan",month_feb:"F\xE9v",month_mar:"Mar",month_apr:"Avr",month_may:"Mai",month_jun:"Juin",month_jul:"Juil",month_aug:"Ao\xFB",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"D\xE9c",hemisphere_north:"Nord",hemisphere_south:"Sud",seasonal_factor_short:"Saison",sensor_prediction:"Pr\xE9diction capteur",degradation_trend:"Tendance",trend_rising:"En hausse",trend_falling:"En baisse",trend_stable:"Stable",trend_insufficient_data:"Donn\xE9es insuffisantes",days_until_threshold:"Jours avant le seuil",threshold_exceeded:"Seuil d\xE9pass\xE9",environmental_adjustment:"Facteur environnemental",sensor_prediction_urgency:"Le capteur pr\xE9voit le seuil dans ~{days} jours",day_short:"jour",prediction_projection:"Projection",weibull_reliability_curve:"Courbe de fiabilit\xE9",weibull_failure_probability:"Probabilit\xE9 de d\xE9faillance",weibull_reliability:"Fiabilit\xE9",weibull_beta_param:"Forme \u03B2",weibull_eta_param:"\xC9chelle \u03B7",weibull_r_squared:"Ajustement R\xB2",beta_early_failures:"D\xE9faillances pr\xE9coces",beta_random_failures:"D\xE9faillances al\xE9atoires",beta_wear_out:"Usure",beta_highly_predictable:"Tr\xE8s pr\xE9visible",confidence_interval:"Intervalle de confiance",confidence_conservative:"Conservateur",confidence_aggressive:"Optimiste",current_interval_marker:"Intervalle actuel",recommended_marker:"Recommand\xE9",reliability_at_current:"Fiabilit\xE9 \xE0 l'intervalle actuel",characteristic_life:"Dur\xE9e de vie caract\xE9ristique",chart_mini_sparkline:"Sparkline de tendance",chart_history:"Historique co\xFBts et dur\xE9e",chart_seasonal:"Facteurs saisonniers, 12 mois",chart_weibull:"Courbe de fiabilit\xE9 Weibull",chart_sparkline:"Graphique valeur d\xE9clencheur",days_progress:"Progression en jours",qr_code:"QR Code",qr_generating:"G\xE9n\xE9ration du QR code\u2026",qr_error:"Impossible de g\xE9n\xE9rer le QR code.",qr_print:"Imprimer",qr_download:"T\xE9l\xE9charger SVG",qr_action:"Action au scan",qr_action_view:"Afficher les infos de maintenance",qr_action_complete:"Marquer la maintenance comme termin\xE9e",overview:"Aper\xE7u",analysis:"Analyse",recent_activities:"Activit\xE9s r\xE9centes",search_notes:"Rechercher dans les notes",avg_cost:"\xD8 Co\xFBt",no_advanced_features:"Aucune fonction avanc\xE9e activ\xE9e",analysis_not_enough_data:"Pas encore assez de donn\xE9es pour l'analyse.",analysis_not_enough_data_hint:"L'analyse Weibull n\xE9cessite au moins 5 maintenances termin\xE9es ; les tendances saisonni\xE8res apparaissent apr\xE8s 6+ points par mois.",analysis_manual_task_hint:"Les t\xE2ches manuelles sans intervalle ne g\xE9n\xE8rent pas de donn\xE9es d'analyse.",current:"Actuel",shorter:"Plus court",longer:"Plus long",normal:"Normal"},Nt={maintenance:"Manutenzione",objects:"Oggetti",tasks:"Attivit\xE0",overdue:"Scaduto",due_soon:"In scadenza",triggered:"Attivato",ok:"OK",all:"Tutti",new_object:"+ Nuovo oggetto",edit:"Modifica",delete:"Elimina",add_task:"+ Attivit\xE0",complete:"Completato",skip:"Salta",reset:"Reimposta",cancel:"Annulla",completing:"Completamento\u2026",type:"Tipo",schedule:"Pianificazione",interval:"Intervallo",warning:"Avviso",last_performed:"Ultima esecuzione",next_due:"Prossima scadenza",days_until_due:"Giorni alla scadenza",times_performed:"Esecuzioni",total_cost:"Costo totale",avg_duration:"\xD8 Durata",trigger:"Trigger",entity:"Entit\xE0",attribute:"Attributo",trigger_type:"Tipo di trigger",active:"Attivo",yes:"S\xEC",no:"No",current_value:"Valore attuale",threshold_above:"Limite superiore",threshold_below:"Limite inferiore",threshold:"Soglia",counter:"Contatore",state_change:"Cambio di stato",target_value:"Valore obiettivo",baseline:"Linea di base",target_changes:"Modifiche obiettivo",entity_min:"Minimo",entity_max:"Massimo",for_minutes:"Per (minuti)",time_based:"Temporale",sensor_based:"Sensore",manual:"Manuale",cleaning:"Pulizia",inspection:"Ispezione",replacement:"Sostituzione",calibration:"Calibrazione",service:"Servizio",custom:"Personalizzato",history:"Cronologia",notes:"Note",documentation:"Documentazione",cost:"Costo",duration:"Durata",both:"Entrambi",trigger_val:"Valore trigger",complete_title:"Completato: ",checklist:"Checklist",notes_optional:"Note (opzionale)",cost_optional:"Costo (opzionale)",duration_minutes:"Durata in minuti (opzionale)",days:"giorni",day:"giorno",today:"Oggi",d_overdue:"g in ritardo",no_tasks:"Nessuna attivit\xE0 di manutenzione. Crea un oggetto per iniziare.",no_tasks_short:"Nessuna attivit\xE0",no_history:"Nessuna voce nella cronologia.",show_all:"Mostra tutto",cost_duration_chart:"Costi & Durata",installed:"Installato",confirm_delete_object:"Eliminare questo oggetto e tutte le sue attivit\xE0?",confirm_delete_task:"Eliminare questa attivit\xE0?",value_history:"Cronologia valori",min:"Min",max:"Max",save:"Salva",saving:"Salvataggio\u2026",edit_task:"Modifica attivit\xE0",new_task:"Nuova attivit\xE0 di manutenzione",task_name:"Nome attivit\xE0",maintenance_type:"Tipo di manutenzione",schedule_type:"Tipo di pianificazione",interval_days:"Intervallo (giorni)",warning_days:"Giorni di avviso",edit_object:"Modifica oggetto",name:"Nome",manufacturer_optional:"Produttore (opzionale)",model_optional:"Modello (opzionale)",trigger_configuration:"Configurazione trigger",entity_id:"ID entit\xE0",attribute_optional:"Attributo (opzionale, vuoto = stato)",trigger_above:"Attivare sopra",trigger_below:"Attivare sotto",for_at_least_minutes:"Per almeno (minuti)",safety_interval_days:"Intervallo di sicurezza (giorni, opzionale)",delta_mode:"Modalit\xE0 delta",from_state_optional:"Dallo stato (opzionale)",to_state_optional:"Allo stato (opzionale)",documentation_url_optional:"URL documentazione (opzionale)",responsible_user:"Utente responsabile",no_user_assigned:"(Nessun utente assegnato)",all_users:"Tutti gli utenti",my_tasks:"Le mie attivit\xE0",budget_monthly:"Budget mensile",budget_yearly:"Budget annuale",export_csv:"Esporta CSV",import_csv:"Importa CSV",groups:"Gruppi",no_groups:"Nessun gruppo definito.",group_tasks:"Attivit\xE0",loading_chart:"Caricamento dati...",was_maintenance_needed:"Questa manutenzione era necessaria?",feedback_needed:"Necessaria",feedback_not_needed:"Non necessaria",feedback_not_sure:"Non sicuro",suggested_interval:"Intervallo suggerito",apply_suggestion:"Applica",dismiss_suggestion:"Ignora",adaptive_scheduling:"Pianificazione adattiva",confidence_low:"Bassa",confidence_medium:"Media",confidence_high:"Alta",confidence:"Affidabilit\xE0",recommended:"consigliato",seasonal_awareness:"Consapevolezza stagionale",seasonal_factor:"Fattore stagionale",seasonal_chart_title:"Fattori stagionali",seasonal_learned:"Appreso",seasonal_manual:"Manuale",seasonal_insufficient_data:"Dati insufficienti",month_jan:"Gen",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"Mag",month_jun:"Giu",month_jul:"Lug",month_aug:"Ago",month_sep:"Set",month_oct:"Ott",month_nov:"Nov",month_dec:"Dic",hemisphere_north:"Nord",hemisphere_south:"Sud",seasonal_factor_short:"Stagione",sensor_prediction:"Previsione sensore",degradation_trend:"Tendenza",trend_rising:"In aumento",trend_falling:"In calo",trend_stable:"Stabile",trend_insufficient_data:"Dati insufficienti",days_until_threshold:"Giorni alla soglia",threshold_exceeded:"Soglia superata",environmental_adjustment:"Fattore ambientale",sensor_prediction_urgency:"Il sensore prevede la soglia tra ~{days} giorni",day_short:"giorno",prediction_projection:"Proiezione",weibull_reliability_curve:"Curva di affidabilit\xE0",weibull_failure_probability:"Probabilit\xE0 di guasto",weibull_reliability:"Affidabilit\xE0",weibull_beta_param:"Forma \u03B2",weibull_eta_param:"Scala \u03B7",weibull_r_squared:"Adattamento R\xB2",beta_early_failures:"Guasti precoci",beta_random_failures:"Guasti casuali",beta_wear_out:"Usura",beta_highly_predictable:"Altamente prevedibile",confidence_interval:"Intervallo di confidenza",confidence_conservative:"Conservativo",confidence_aggressive:"Ottimistico",current_interval_marker:"Intervallo attuale",recommended_marker:"Consigliato",reliability_at_current:"Affidabilit\xE0 all'intervallo attuale",characteristic_life:"Vita caratteristica",chart_mini_sparkline:"Sparkline di tendenza",chart_history:"Cronologia costi e durata",chart_seasonal:"Fattori stagionali, 12 mesi",chart_weibull:"Curva di affidabilit\xE0 Weibull",chart_sparkline:"Grafico valore trigger sensore",days_progress:"Avanzamento giorni",qr_code:"Codice QR",qr_generating:"Generazione codice QR\u2026",qr_error:"Impossibile generare il codice QR.",qr_print:"Stampa",qr_download:"Scarica SVG",qr_action:"Azione alla scansione",qr_action_view:"Visualizza info manutenzione",qr_action_complete:"Segna manutenzione come completata",overview:"Panoramica",analysis:"Analisi",recent_activities:"Attivit\xE0 recenti",search_notes:"Cerca nelle note",avg_cost:"\xD8 Costo",no_advanced_features:"Nessuna funzione avanzata attivata",analysis_not_enough_data:"Non ci sono ancora abbastanza dati per l'analisi.",analysis_not_enough_data_hint:"L'analisi Weibull richiede almeno 5 manutenzioni completate; i modelli stagionali diventano visibili dopo 6+ punti dati al mese.",analysis_manual_task_hint:"Le attivit\xE0 manuali senza intervallo non generano dati di analisi.",current:"Attuale",shorter:"Pi\xF9 breve",longer:"Pi\xF9 lungo",normal:"Normale"},Ot={maintenance:"Mantenimiento",objects:"Objetos",tasks:"Tareas",overdue:"Vencida",due_soon:"Pr\xF3xima",triggered:"Activada",ok:"OK",all:"Todos",new_object:"+ Nuevo objeto",edit:"Editar",delete:"Eliminar",add_task:"+ Tarea",complete:"Completada",skip:"Omitir",reset:"Restablecer",cancel:"Cancelar",completing:"Completando\u2026",type:"Tipo",schedule:"Planificaci\xF3n",interval:"Intervalo",warning:"Aviso",last_performed:"\xDAltima ejecuci\xF3n",next_due:"Pr\xF3ximo vencimiento",days_until_due:"D\xEDas hasta vencimiento",times_performed:"Ejecuciones",total_cost:"Coste total",avg_duration:"\xD8 Duraci\xF3n",trigger:"Disparador",entity:"Entidad",attribute:"Atributo",trigger_type:"Tipo de disparador",active:"Activo",yes:"S\xED",no:"No",current_value:"Valor actual",threshold_above:"L\xEDmite superior",threshold_below:"L\xEDmite inferior",threshold:"Umbral",counter:"Contador",state_change:"Cambio de estado",target_value:"Valor objetivo",baseline:"L\xEDnea base",target_changes:"Cambios objetivo",entity_min:"M\xEDnimo",entity_max:"M\xE1ximo",for_minutes:"Durante (minutos)",time_based:"Temporal",sensor_based:"Sensor",manual:"Manual",cleaning:"Limpieza",inspection:"Inspecci\xF3n",replacement:"Sustituci\xF3n",calibration:"Calibraci\xF3n",service:"Servicio",custom:"Personalizado",history:"Historial",notes:"Notas",documentation:"Documentaci\xF3n",cost:"Coste",duration:"Duraci\xF3n",both:"Ambos",trigger_val:"Valor del disparador",complete_title:"Completada: ",checklist:"Lista de verificaci\xF3n",notes_optional:"Notas (opcional)",cost_optional:"Coste (opcional)",duration_minutes:"Duraci\xF3n en minutos (opcional)",days:"d\xEDas",day:"d\xEDa",today:"Hoy",d_overdue:"d vencida",no_tasks:"No hay tareas de mantenimiento. Cree un objeto para empezar.",no_tasks_short:"Sin tareas",no_history:"Sin entradas en el historial.",show_all:"Mostrar todo",cost_duration_chart:"Costes & Duraci\xF3n",installed:"Instalado",confirm_delete_object:"\xBFEliminar este objeto y todas sus tareas?",confirm_delete_task:"\xBFEliminar esta tarea?",value_history:"Historial de valores",min:"M\xEDn",max:"M\xE1x",save:"Guardar",saving:"Guardando\u2026",edit_task:"Editar tarea",new_task:"Nueva tarea de mantenimiento",task_name:"Nombre de la tarea",maintenance_type:"Tipo de mantenimiento",schedule_type:"Tipo de planificaci\xF3n",interval_days:"Intervalo (d\xEDas)",warning_days:"D\xEDas de aviso",edit_object:"Editar objeto",name:"Nombre",manufacturer_optional:"Fabricante (opcional)",model_optional:"Modelo (opcional)",trigger_configuration:"Configuraci\xF3n del disparador",entity_id:"ID de entidad",attribute_optional:"Atributo (opcional, vac\xEDo = estado)",trigger_above:"Activar por encima de",trigger_below:"Activar por debajo de",for_at_least_minutes:"Durante al menos (minutos)",safety_interval_days:"Intervalo de seguridad (d\xEDas, opcional)",delta_mode:"Modo delta",from_state_optional:"Desde estado (opcional)",to_state_optional:"Hasta estado (opcional)",documentation_url_optional:"URL de documentaci\xF3n (opcional)",responsible_user:"Usuario responsable",no_user_assigned:"(Ning\xFAn usuario asignado)",all_users:"Todos los usuarios",my_tasks:"Mis tareas",budget_monthly:"Presupuesto mensual",budget_yearly:"Presupuesto anual",export_csv:"Exportar CSV",import_csv:"Importar CSV",groups:"Grupos",no_groups:"No hay grupos definidos.",group_tasks:"Tareas",loading_chart:"Cargando datos...",was_maintenance_needed:"\xBFEra necesario este mantenimiento?",feedback_needed:"Necesario",feedback_not_needed:"No necesario",feedback_not_sure:"No seguro",suggested_interval:"Intervalo sugerido",apply_suggestion:"Aplicar",dismiss_suggestion:"Descartar",adaptive_scheduling:"Planificaci\xF3n adaptativa",confidence_low:"Baja",confidence_medium:"Media",confidence_high:"Alta",confidence:"Confianza",recommended:"recomendado",seasonal_awareness:"Conciencia estacional",seasonal_factor:"Factor estacional",seasonal_chart_title:"Factores estacionales",seasonal_learned:"Aprendido",seasonal_manual:"Manual",seasonal_insufficient_data:"Datos insuficientes",month_jan:"Ene",month_feb:"Feb",month_mar:"Mar",month_apr:"Abr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Ago",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dic",hemisphere_north:"Norte",hemisphere_south:"Sur",seasonal_factor_short:"Estaci\xF3n",sensor_prediction:"Predicci\xF3n del sensor",degradation_trend:"Tendencia",trend_rising:"En aumento",trend_falling:"En descenso",trend_stable:"Estable",trend_insufficient_data:"Datos insuficientes",days_until_threshold:"D\xEDas hasta el umbral",threshold_exceeded:"Umbral superado",environmental_adjustment:"Factor ambiental",sensor_prediction_urgency:"El sensor predice el umbral en ~{days} d\xEDas",day_short:"d\xEDa",prediction_projection:"Proyecci\xF3n",weibull_reliability_curve:"Curva de fiabilidad",weibull_failure_probability:"Probabilidad de fallo",weibull_reliability:"Fiabilidad",weibull_beta_param:"Forma \u03B2",weibull_eta_param:"Escala \u03B7",weibull_r_squared:"Ajuste R\xB2",beta_early_failures:"Fallos tempranos",beta_random_failures:"Fallos aleatorios",beta_wear_out:"Desgaste",beta_highly_predictable:"Altamente predecible",confidence_interval:"Intervalo de confianza",confidence_conservative:"Conservador",confidence_aggressive:"Optimista",current_interval_marker:"Intervalo actual",recommended_marker:"Recomendado",reliability_at_current:"Fiabilidad en el intervalo actual",characteristic_life:"Vida caracter\xEDstica",chart_mini_sparkline:"Sparkline de tendencia",chart_history:"Historial de costes y duraci\xF3n",chart_seasonal:"Factores estacionales, 12 meses",chart_weibull:"Curva de fiabilidad Weibull",chart_sparkline:"Gr\xE1fico de valor del disparador",days_progress:"Progreso en d\xEDas",qr_code:"C\xF3digo QR",qr_generating:"Generando c\xF3digo QR\u2026",qr_error:"No se pudo generar el c\xF3digo QR.",qr_print:"Imprimir",qr_download:"Descargar SVG",qr_action:"Acci\xF3n al escanear",qr_action_view:"Ver info de mantenimiento",qr_action_complete:"Marcar mantenimiento como completado",overview:"Resumen",analysis:"An\xE1lisis",recent_activities:"Actividades recientes",search_notes:"Buscar en notas",avg_cost:"\xD8 Coste",no_advanced_features:"Sin funciones avanzadas activadas",analysis_not_enough_data:"A\xFAn no hay suficientes datos para el an\xE1lisis.",analysis_not_enough_data_hint:"El an\xE1lisis Weibull requiere al menos 5 mantenimientos completados; los patrones estacionales son visibles tras 6+ puntos de datos por mes.",analysis_manual_task_hint:"Las tareas manuales sin intervalo no generan datos de an\xE1lisis.",current:"Actual",shorter:"M\xE1s corto",longer:"M\xE1s largo",normal:"Normal"},rt={de:zt,en:It,nl:Ht,fr:Rt,it:Nt,es:Ot};function s(o,a){let e=(a||"en").substring(0,2).toLowerCase();return rt[e]?.[o]??rt.en[o]??o}function st(o){let a=(o||"de").substring(0,2).toLowerCase();return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES"}[a]??"en-US"}function te(o,a){if(!o)return"\u2014";try{return new Date(o).toLocaleDateString(st(a),{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return o}}function He(o,a){if(!o)return"\u2014";try{let e=st(a),t=new Date(o);return t.toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}catch{return o}}function $e(o,a){if(o==null)return"\u2014";let e=a||"en";return o<0?`${Math.abs(o)} ${s("d_overdue",e)}`:o===0?s("today",e):`${o} ${s(o===1?"day":"days",e)}`}var ot=U`
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
    height: 200px;
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
`;var we=class{constructor(a){this._cache=new Map;this._pending=new Map;this._hass=a}updateHass(a){this._hass=a}async getDetailStats(a,e){return this._getStats(a,"hour",30,e)}async getMiniStats(a,e){return this._getStats(a,"day",14,e)}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(a,e,t,i){let r=`${a}:${e}`,n=this._cache.get(r);if(n&&Date.now()-n.fetchedAt<3e5)return n.points;if(this._pending.has(r))return this._pending.get(r);let u=this._fetchAndNormalize(a,e,t,i,r);this._pending.set(r,u);try{return await u}finally{this._pending.delete(r)}}async _fetchAndNormalize(a,e,t,i,r){let n=new Date(Date.now()-t*24*60*60*1e3).toISOString(),u=i?["state","sum","change"]:["mean","min","max"];try{let h=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:n,statistic_ids:[a],period:e,types:u}))[a]||[],p=[];for(let m of h){let f=null;if(i?f=m.state??null:f=m.mean??null,f===null)continue;let x={ts:m.start,val:f};i||(m.min!=null&&(x.min=m.min),m.max!=null&&(x.max=m.max)),p.push(x)}return p.sort((m,f)=>m.ts-f.ts),this._cache.set(r,{entityId:a,fetchedAt:Date.now(),period:e,points:p}),p}catch(d){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${a}:`,d),[]}}};var ne=class{constructor(a){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=a}async getUsers(a=!1){let e=Date.now();if(!a&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(a,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:a,task_id:e,user_id:t})}async getTasksByUser(a){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:a})).tasks}getUserName(a){return!a||!this.usersCache?null:this.usersCache.find(t=>t.id===a)?.name||null}getUser(a){return!a||!this.usersCache?null:this.usersCache.find(e=>e.id===a)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(a){return a?a===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};var O=class extends I{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._name="";this._manufacturer="";this._model="";this._entryId=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._open=!0}async _save(){if(this._name.trim()){this._loading=!0;try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}finally{this._loading=!1}}}_close(){this._open=!1}render(){if(!this._open)return l``;let e=this._lang,t=this._entryId?s("edit_object",e):s("new_object",e);return l`
      <ha-dialog open @closed=${this._close} .heading=${t}>
        <div class="content">
          <ha-textfield
            label="${s("name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${s("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${i=>this._manufacturer=i.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${s("model_optional",e)}"
            .value=${this._model}
            @input=${i=>this._model=i.target.value}
          ></ha-textfield>
        </div>
        <ha-button slot="secondaryAction" appearance="plain" @click=${this._close}>
          ${s("cancel",this._lang)}
        </ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._save}
          .disabled=${this._loading||!this._name.trim()}
        >
          ${this._loading?s("saving",this._lang):s("save",this._lang)}
        </ha-button>
      </ha-dialog>
    `}};O.styles=U`
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }
    ha-textfield {
      display: block;
    }
  `,g([R({attribute:!1})],O.prototype,"hass",2),g([v()],O.prototype,"_open",2),g([v()],O.prototype,"_loading",2),g([v()],O.prototype,"_name",2),g([v()],O.prototype,"_manufacturer",2),g([v()],O.prototype,"_model",2),g([v()],O.prototype,"_entryId",2),O=g([re("maintenance-object-dialog")],O);var Ut=["cleaning","inspection","replacement","calibration","service","custom"],qt=["time_based","sensor_based","manual"],Vt=["threshold","counter","state_change"],k=class extends I{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._entryId="";this._taskId=null;this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._warningDays="7";this._notes="";this._documentationUrl="";this._triggerEntityId="";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._responsibleUserId=null;this._availableUsers=[];this._userService=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}async openCreate(e){this._entryId=e,this._taskId=null,this._resetFields(),await this._loadUsers(),this._open=!0}async openEdit(e,t){if(this._entryId=e,this._taskId=t.id,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days?.toString()||"30",this._warningDays=t.warning_days.toString(),this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._responsibleUserId=t.responsible_user_id||null,t.trigger_config){let i=t.trigger_config;this._triggerEntityId=i.entity_id||"",this._triggerAttribute=i.attribute||"",this._triggerType=i.type||"threshold",this._triggerAbove=i.trigger_above?.toString()||"",this._triggerBelow=i.trigger_below?.toString()||"",this._triggerForMinutes=i.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=i.trigger_target_value?.toString()||"",this._triggerDeltaMode=i.trigger_delta_mode||!1,this._triggerFromState=i.trigger_from_state||"",this._triggerToState=i.trigger_to_state||"",this._triggerTargetChanges=i.trigger_target_changes?.toString()||""}else this._resetTriggerFields();await this._loadUsers(),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._warningDays="7",this._notes="",this._documentationUrl="",this._responsibleUserId=null,this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerAttribute="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges=""}async _loadUsers(){this._userService||(this._userService=new ne(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}async _save(){if(this._name.trim()){this._loading=!0;try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:parseInt(this._warningDays,10)||7};if(this._taskId&&(e.task_id=this._taskId),this._scheduleType!=="manual"&&this._intervalDays&&(e.interval_days=parseInt(this._intervalDays,10)),this._notes&&(e.notes=this._notes),this._documentationUrl&&(e.documentation_url=this._documentationUrl),this._responsibleUserId&&(e.responsible_user_id=this._responsibleUserId),this._scheduleType==="sensor_based"&&this._triggerEntityId){let t={entity_id:this._triggerEntityId,type:this._triggerType};this._triggerAttribute&&(t.attribute=this._triggerAttribute),this._triggerType==="threshold"?(this._triggerAbove&&(t.trigger_above=parseFloat(this._triggerAbove)),this._triggerBelow&&(t.trigger_below=parseFloat(this._triggerBelow)),this._triggerForMinutes&&(t.trigger_for_minutes=parseInt(this._triggerForMinutes,10))):this._triggerType==="counter"?(this._triggerTargetValue&&(t.trigger_target_value=parseFloat(this._triggerTargetValue)),t.trigger_delta_mode=this._triggerDeltaMode):this._triggerType==="state_change"&&(this._triggerFromState&&(t.trigger_from_state=this._triggerFromState),this._triggerToState&&(t.trigger_to_state=this._triggerToState),this._triggerTargetChanges&&(t.trigger_target_changes=parseInt(this._triggerTargetChanges,10))),e.trigger_config=t}await this.hass.connection.sendMessagePromise(e),this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}}}_close(){this._open=!1}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return c;let e=this._lang;return l`
      <h3>${s("trigger_configuration",e)}</h3>
      <ha-textfield
        label="${s("entity_id",e)}"
        .value=${this._triggerEntityId}
        @input=${t=>this._triggerEntityId=t.target.value}
      ></ha-textfield>
      <ha-textfield
        label="${s("attribute_optional",e)}"
        .value=${this._triggerAttribute}
        @input=${t=>this._triggerAttribute=t.target.value}
      ></ha-textfield>
      <div class="select-row">
        <label>${s("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${t=>this._triggerType=t.target.value}
        >
          ${Vt.map(t=>l`<option value=${t}>${s(t,e)}</option>`)}
        </select>
      </div>
      ${this._renderTriggerTypeFields()}
      <ha-textfield
        label="${s("safety_interval_days",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${t=>this._intervalDays=t.target.value}
      ></ha-textfield>
    `}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?l`
        <ha-textfield
          label="${s("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${t=>this._triggerAbove=t.target.value}
        ></ha-textfield>
        <ha-textfield
          label="${s("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${t=>this._triggerBelow=t.target.value}
        ></ha-textfield>
        <ha-textfield
          label="${s("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ha-textfield>
      `:this._triggerType==="counter"?l`
        <ha-textfield
          label="${s("target_value",e)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${t=>this._triggerTargetValue=t.target.value}
        ></ha-textfield>
        <label>
          <input
            type="checkbox"
            .checked=${this._triggerDeltaMode}
            @change=${t=>this._triggerDeltaMode=t.target.checked}
          />
          ${s("delta_mode",e)}
        </label>
      `:this._triggerType==="state_change"?l`
        <ha-textfield
          label="${s("from_state_optional",e)}"
          .value=${this._triggerFromState}
          @input=${t=>this._triggerFromState=t.target.value}
        ></ha-textfield>
        <ha-textfield
          label="${s("to_state_optional",e)}"
          .value=${this._triggerToState}
          @input=${t=>this._triggerToState=t.target.value}
        ></ha-textfield>
        <ha-textfield
          label="${s("target_changes",e)}"
          type="number"
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ha-textfield>
      `:c}render(){if(!this._open)return l``;let e=this._lang,t=this._taskId?s("edit_task",e):s("new_task",e);return l`
      <ha-dialog open @closed=${this._close} .heading=${t}>
        <div class="content">
          <ha-textfield
            label="${s("task_name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ha-textfield>
          <div class="select-row">
            <label>${s("maintenance_type",e)}</label>
            <select
              .value=${this._type}
              @change=${i=>this._type=i.target.value}
            >
              ${Ut.map(i=>l`<option value=${i}>${s(i,e)}</option>`)}
            </select>
          </div>
          <div class="select-row">
            <label>${s("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${i=>this._scheduleType=i.target.value}
            >
              ${qt.map(i=>l`<option value=${i}>${s(i,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?l`
                <ha-textfield
                  label="${s("interval_days",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${i=>this._intervalDays=i.target.value}
                ></ha-textfield>
              `:c}
          <ha-textfield
            label="${s("warning_days",e)}"
            type="number"
            .value=${this._warningDays}
            @input=${i=>this._warningDays=i.target.value}
          ></ha-textfield>
          <div class="select-row">
            <label>${s("responsible_user",e)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${i=>{let r=i.target.value;this._responsibleUserId=r||null}}
            >
              <option value="">${s("no_user_assigned",e)}</option>
              ${this._availableUsers.map(i=>l`<option value=${i.id}>${i.name}</option>`)}
            </select>
          </div>
          ${this._renderTriggerFields()}
          <ha-textfield
            label="${s("notes_optional",e)}"
            .value=${this._notes}
            @input=${i=>this._notes=i.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${s("documentation_url_optional",e)}"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ha-textfield>
        </div>
        <ha-button slot="secondaryAction" appearance="plain" @click=${this._close}>${s("cancel",e)}</ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._save}
          .disabled=${this._loading||!this._name.trim()}
        >
          ${this._loading?s("saving",e):s("save",e)}
        </ha-button>
      </ha-dialog>
    `}};k.styles=U`
    .content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 350px;
      max-height: 70vh;
      overflow-y: auto;
    }
    ha-textfield {
      display: block;
    }
    h3 {
      margin: 8px 0 0;
      font-size: 14px;
      color: var(--primary-color);
    }
    .select-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .select-row label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .select-row select {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
    }
  `,g([R({attribute:!1})],k.prototype,"hass",2),g([v()],k.prototype,"_open",2),g([v()],k.prototype,"_loading",2),g([v()],k.prototype,"_entryId",2),g([v()],k.prototype,"_taskId",2),g([v()],k.prototype,"_name",2),g([v()],k.prototype,"_type",2),g([v()],k.prototype,"_scheduleType",2),g([v()],k.prototype,"_intervalDays",2),g([v()],k.prototype,"_warningDays",2),g([v()],k.prototype,"_notes",2),g([v()],k.prototype,"_documentationUrl",2),g([v()],k.prototype,"_triggerEntityId",2),g([v()],k.prototype,"_triggerAttribute",2),g([v()],k.prototype,"_triggerType",2),g([v()],k.prototype,"_triggerAbove",2),g([v()],k.prototype,"_triggerBelow",2),g([v()],k.prototype,"_triggerForMinutes",2),g([v()],k.prototype,"_triggerTargetValue",2),g([v()],k.prototype,"_triggerDeltaMode",2),g([v()],k.prototype,"_triggerFromState",2),g([v()],k.prototype,"_triggerToState",2),g([v()],k.prototype,"_triggerTargetChanges",2),g([v()],k.prototype,"_responsibleUserId",2),g([v()],k.prototype,"_availableUsers",2),k=g([re("maintenance-task-dialog")],k);var q=class extends I{constructor(){super(...arguments);this.lang="de";this._open=!1;this._loading=!1;this._error="";this._result=null;this._action="view";this._entryId="";this._taskId=null;this._objectName="";this._taskName=""}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._action="view",this._error="",this._result=null,this._open=!0,this._generate()}openForTask(e,t,i,r){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=r,this._action="view",this._error="",this._result=null,this._open=!0,this._generate()}async _generate(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,action:this._action};this._taskId&&(e.task_id=this._taskId);let t=await this.hass.connection.sendMessagePromise(e);this._result=t}catch{this._error=s("qr_error",this.lang)}finally{this._loading=!1}}_onActionChange(e){this._action=e.target.value,this._generate()}_print(){if(!this._result)return;let e=this._result,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),r=window.open("","_blank","width=400,height=500");r&&(r.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
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
</body></html>`),r.document.close())}_download(){if(!this._result)return;let e=decodeURIComponent(this._result.svg_data_uri.replace("data:image/svg+xml,","")),t=new Blob([e],{type:"image/svg+xml"}),i=URL.createObjectURL(t),r=document.createElement("a");r.href=i;let n=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;r.download=`qr-${n.replace(/\s+/g,"-").toLowerCase()}.svg`,r.click(),URL.revokeObjectURL(i)}_close(){this._open=!1}render(){if(!this._open)return l``;let e=this.lang||this.hass?.language||"de",t=this._taskName?`${s("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",e)}: ${this._objectName}`;return l`
      <ha-dialog open @closed=${this._close} .heading=${t}>
        <div class="content">
          ${this._loading?l`<div class="loading">${s("qr_generating",e)}</div>`:this._error?l`<div class="error">${this._error}</div>`:this._result?l`
                    <img
                      class="qr-image"
                      src="${this._result.svg_data_uri}"
                      alt="QR Code"
                    />
                    <div class="url-display">${this._result.url}</div>
                  `:c}
          ${this._taskId?l`
                <div class="action-row">
                  <label>${s("qr_action",e)}</label>
                  <select @change=${this._onActionChange} .value=${this._action}>
                    <option value="view">${s("qr_action_view",e)}</option>
                    <option value="complete">${s("qr_action_complete",e)}</option>
                  </select>
                </div>
              `:c}
        </div>
        <ha-button slot="secondaryAction" appearance="plain" @click=${this._close}>
          ${s("cancel",e)}
        </ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._download}
          .disabled=${!this._result}
        >
          ${s("qr_download",e)}
        </ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._print}
          .disabled=${!this._result}
        >
          ${s("qr_print",e)}
        </ha-button>
      </ha-dialog>
    `}};q.styles=U`
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
  `,g([R({attribute:!1})],q.prototype,"hass",2),g([R()],q.prototype,"lang",2),g([v()],q.prototype,"_open",2),g([v()],q.prototype,"_loading",2),g([v()],q.prototype,"_error",2),g([v()],q.prototype,"_result",2),g([v()],q.prototype,"_action",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",q);var Bt=60,Wt=20,Gt=300,Kt=140,Zt=300,Yt=200,lt=30,Jt=27,A=class extends I{constructor(){super(...arguments);this.narrow=!1;this.panel={};this._objects=[];this._stats=null;this._view="overview";this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._filterUser=null;this._unsub=null;this._sparklineTooltip=null;this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1};this._activeTab="overview";this._costDurationToggle="both";this._historyTimeRange=12;this._historySearch="";this._statsService=null;this._userService=null;this._deepLinkHandled=!1;this._onDialogEvent=async()=>{await this._loadData()}}get _lang(){return this.hass?.language||"de"}connectedCallback(){super.connectedCallback(),this._loadData(),this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub&&(this._unsub(),this._unsub=null),this._statsService?.clearCache(),this._statsService=null}updated(e){super.updated(e),e.has("hass")&&this.hass&&(this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new we(this.hass),this._fetchMiniStatsForOverview()),this._userService||(this._userService=new ne(this.hass),this._userService.getUsers()))}async _loadData(){let[e,t,i,r,n]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null)]);this._objects=e.objects,this._stats=t,i&&(this._budget=i),r&&(this._groups=r.groups||{}),n&&(this._features=n.features),this._fetchMiniStatsForOverview(),this._handleDeepLink()}_handleDeepLink(){if(this._deepLinkHandled)return;let e=new URLSearchParams(window.location.search),t=e.get("entry_id");if(!t)return;this._deepLinkHandled=!0;let i=e.get("task_id"),r=e.get("action"),n=window.location.pathname+window.location.hash;history.replaceState(null,"",n),i?(this._showTask(t,i),r==="complete"&&requestAnimationFrame(()=>{let d=this._getObject(t)?.tasks.find(h=>h.id===i);d&&this._openCompleteDialog(t,i,d.name,this._features.checklists?d.checklist:void 0,this._features.adaptive&&!!d.adaptive_config?.enabled)})):this._showObject(t)}_isCounterEntity(e){if(!e)return!1;let t=e.type||"threshold";return t==="counter"||t==="state_change"}async _fetchDetailStats(e,t){if(!this._statsService)return;let i=await this._statsService.getDetailStats(e,t),r=new Map(this._detailStatsData);r.set(e,i),this._detailStatsData=r}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let e=new Map(this._miniStatsData),t=[];for(let i of this._objects)for(let r of i.tasks){let n=r.trigger_config?.entity_id;if(!n)continue;let u=this._isCounterEntity(r.trigger_config);t.push(this._statsService.getMiniStats(n,u).then(d=>{e.set(n,d)}))}t.length>0&&(await Promise.all(t),this._miniStatsData=e)}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(e=>{let t=e;this._objects=t.objects},{type:"maintenance_supporter/subscribe"})}catch{}}get _taskRows(){let e=[];for(let i of this._objects)for(let r of i.tasks)if(!(this._filterStatus&&r.status!==this._filterStatus)){if(this._filterUser){let n=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(r.responsible_user_id!==n)continue}e.push({entry_id:i.entry_id,task_id:r.id,object_name:i.object.name,task_name:r.name,type:r.type,schedule_type:r.schedule_type,status:r.status,days_until_due:r.days_until_due??null,next_due:r.next_due??null,trigger_active:r.trigger_active,trigger_current_value:r.trigger_current_value??null,trigger_current_delta:r.trigger_current_delta??null,trigger_config:r.trigger_config??null,trigger_entity_info:r.trigger_entity_info??null,times_performed:r.times_performed,total_cost:r.total_cost,interval_days:r.interval_days??null,history:r.history||[]})}let t={overdue:0,triggered:1,due_soon:2,ok:3};return e.sort((i,r)=>(t[i.status]??9)-(t[r.status]??9)),e}_getObject(e){return this._objects.find(t=>t.entry_id===e)}_getTask(e,t){return this._getObject(e)?.tasks.find(r=>r.id===t)}_showOverview(){this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null}_showObject(e){this._view="object",this._selectedEntryId=e,this._selectedTaskId=null}_showTask(e,t){this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._historyFilter=null;let i=this._getTask(e,t);if(i?.trigger_config?.entity_id){let r=i.trigger_config.entity_id,n=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(r,n)}}async _deleteObject(e){confirm(s("confirm_delete_object",this._lang))&&(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:e}),this._showOverview(),await this._loadData())}async _deleteTask(e,t){confirm(s("confirm_delete_task",this._lang))&&(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/delete",entry_id:e,task_id:t}),this._showObject(e),await this._loadData())}async _skipTask(e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/skip",entry_id:e,task_id:t}),await this._loadData()}async _resetTask(e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/reset",entry_id:e,task_id:t}),await this._loadData()}async _applySuggestion(e,t,i){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/apply_suggestion",entry_id:e,task_id:t,interval:i}),await this._loadData()}_dismissSuggestion(){this._loadData()}_openCompleteDialog(e,t,i,r,n){let u=this.shadowRoot.querySelector("maintenance-complete-dialog");u&&(u.entryId=e,u.taskId=t,u.taskName=i,u.lang=this._lang,u.checklist=r||[],u.adaptiveEnabled=!!n,u.open())}_openQrForObject(e,t){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForObject(e,t)}_openQrForTask(e,t,i,r){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForTask(e,t,i,r)}async _exportCsv(){let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/export"}),t=new Blob([e.csv],{type:"text/csv;charset=utf-8;"}),i=URL.createObjectURL(t),r=document.createElement("a");r.href=i,r.download="maintenance_export.csv",r.click(),URL.revokeObjectURL(i)}_triggerImportCsv(){let e=this.shadowRoot.querySelector("input[type=file]");e&&(e.value="",e.click())}async _handleCsvFile(e){let i=e.target.files?.[0];if(!i)return;let r=await i.text(),n=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/import",csv_content:r});await this._loadData(),alert(`Imported ${n.created} of ${n.total} objects.`)}render(){return l`
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
    `}_renderHeader(){let e=[{label:s("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let i=this._getTask(this._selectedEntryId,this._selectedTaskId);e.push({label:i?.name||"Task"})}return l`
      <div class="header">
        <div class="breadcrumbs">
          ${e.map((t,i)=>l`
              ${i>0?l`<span class="sep">/</span>`:c}
              ${t.action?l`<a @click=${t.action}>${t.label}</a>`:l`<span class="current">${t.label}</span>`}
            `)}
        </div>
      </div>
    `}_renderOverview(){let e=this._stats,t=this._taskRows,i=this._lang;return l`
      ${e?l`
            <div class="stats-bar">
              <div class="stat-item">
                <span class="stat-value">${e.total_objects}</span>
                <span class="stat-label">${s("objects",i)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">${e.total_tasks}</span>
                <span class="stat-label">${s("tasks",i)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" style="color: var(--error-color)">${e.overdue}</span>
                <span class="stat-label">${s("overdue",i)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" style="color: var(--warning-color)">${e.due_soon}</span>
                <span class="stat-label">${s("due_soon",i)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" style="color: #ff5722">${e.triggered}</span>
                <span class="stat-label">${s("triggered",i)}</span>
              </div>
            </div>
          `:c}

      ${this._features.budget?this._renderBudgetBar():c}

      <div class="filter-bar">
        <select
          @change=${r=>this._filterStatus=r.target.value}
        >
          <option value="">${s("all",i)}</option>
          <option value="overdue">${s("overdue",i)}</option>
          <option value="due_soon">${s("due_soon",i)}</option>
          <option value="triggered">${s("triggered",i)}</option>
          <option value="ok">${s("ok",i)}</option>
        </select>
        <select
          .value=${this._filterUser||""}
          @change=${r=>{let n=r.target.value;this._filterUser=n||null}}
        >
          <option value="">${s("all_users",i)}</option>
          <option value="current_user">${s("my_tasks",i)}</option>
        </select>
        <ha-button
          @click=${()=>this.shadowRoot.querySelector("maintenance-object-dialog")?.openCreate()}
        >
          ${s("new_object",i)}
        </ha-button>
        <ha-button @click=${this._exportCsv}>${s("export_csv",i)}</ha-button>
        <ha-button @click=${this._triggerImportCsv}>${s("import_csv",i)}</ha-button>
        <input type="file" accept=".csv" style="display:none" @change=${this._handleCsvFile} />
      </div>

      ${t.length===0?l`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${s("no_tasks",i)}</p>
            </div>
          `:l`
            <div class="task-table">
              ${t.map(r=>this._renderOverviewRow(r))}
            </div>
          `}

      ${this._features.groups?this._renderGroupsSection():c}
    `}_renderGroupsSection(){let e=Object.entries(this._groups);if(e.length===0)return c;let t=this._lang;return l`
      <div class="groups-section">
        <h3>${s("groups",t)}</h3>
        <div class="groups-grid">
          ${e.map(([i,r])=>{let n=r.task_refs.map(u=>this._getTask(u.entry_id,u.task_id)?.name||u.task_id);return l`
              <div class="group-card">
                <div class="group-card-name">${r.name}</div>
                ${r.description?l`<div class="group-card-desc">${r.description}</div>`:c}
                <div class="group-card-tasks">
                  ${n.length>0?n.map(u=>l`<span class="group-task-chip">${u}</span>`):l`<span style="font-size:12px;color:var(--secondary-text-color)">${s("no_tasks_short",t)}</span>`}
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_renderBudgetBar(){let e=this._budget;if(!e)return c;let t=this._lang,i=[];return e.monthly_budget>0&&i.push({label:s("budget_monthly",t),spent:e.monthly_spent,budget:e.monthly_budget}),e.yearly_budget>0&&i.push({label:s("budget_yearly",t),spent:e.yearly_spent,budget:e.yearly_budget}),i.length===0?c:l`
      <div class="budget-bars">
        ${i.map(r=>{let n=Math.min(100,Math.max(0,r.spent/r.budget*100)),u=n>=100?"var(--error-color, #f44336)":n>=e.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return l`
            <div class="budget-item">
              <div class="budget-label">
                <span>${r.label}</span>
                <span>${r.spent.toFixed(2)} / ${r.budget.toFixed(2)}</span>
              </div>
              <div class="budget-bar">
                <div class="budget-bar-fill" style="width:${n}%; background:${u}"></div>
              </div>
            </div>
          `})}
      </div>
    `}_renderOverviewRow(e){let t=this._lang,i=e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0,r=0,n=xe.ok,u=!1;if(i&&e.days_until_due!==null){let d=(e.interval_days-e.days_until_due)/e.interval_days*100;r=Math.max(0,Math.min(100,d)),u=d>100,e.status==="overdue"?n=xe.overdue:e.status==="due_soon"&&(n=xe.due_soon)}return l`
      <div class="task-row">
        <span class="status-badge ${e.status}">${s(e.status,t)}</span>
        <span class="cell object-name" @click=${d=>{d.stopPropagation(),this._showObject(e.entry_id)}}>${e.object_name}</span>
        <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,e.task_id)}>${e.task_name}</span>
        <span class="cell type">${s(e.type,t)}</span>
        <span class="due-cell" @click=${()=>this._showTask(e.entry_id,e.task_id)}>
          <span class="due-text">${$e(e.days_until_due,t)}</span>
          ${i?l`<div class="days-bar"><div class="days-bar-fill${u?" overflow":""}" style="width:${r}%;background:${n}"></div></div>`:c}
          ${e.trigger_config?this._renderTriggerProgress(e):!i&&e.trigger_active?l`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:c}
          ${this._renderMiniSparkline(e)}
        </span>
        <span class="row-actions">
          <mwc-icon-button class="btn-complete" title="${s("complete",t)}" @click=${d=>{d.stopPropagation(),this._openCompleteDialog(e.entry_id,e.task_id,e.task_name)}}>
            <ha-icon icon="mdi:check"></ha-icon>
          </mwc-icon-button>
          <mwc-icon-button class="btn-skip" title="${s("skip",t)}" @click=${d=>{d.stopPropagation(),this._skipTask(e.entry_id,e.task_id)}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>
        </span>
      </div>
    `}_renderTriggerProgress(e){let t=e.trigger_config??null;if(!t)return c;let i=t.type||"threshold",r=e.trigger_entity_info?.unit_of_measurement??"",n=0,u="";if(i==="threshold"){let p=e.trigger_current_value??null;if(p==null)return c;let m=t.trigger_above,f=t.trigger_below;if(m!=null){let x=f??0,$=m-x||1;n=Math.min(100,Math.max(0,(p-x)/$*100)),u=`${p.toFixed(1)} / ${m} ${r}`}else if(f!=null){let $=e.trigger_entity_info?.max??(p*2||100),C=$-f||1;n=Math.min(100,Math.max(0,($-p)/C*100)),u=`${p.toFixed(1)} / ${f} ${r}`}else return c}else if(i==="counter"){let p=t.trigger_target_value||1,f=e.trigger_current_delta??null??e.trigger_current_value??null;if(f==null)return c;n=Math.min(100,Math.max(0,f/p*100)),u=`${f.toFixed(1)} / ${p} ${r}`}else if(i==="state_change"){let p=t.trigger_target_changes||1,m=e.trigger_current_value??null;if(m==null)return c;n=Math.min(100,Math.max(0,m/p*100)),u=`${Math.round(m)} / ${p}`}else return c;let d=n>=100,h=n>90?"var(--error-color, #f44336)":n>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return l`
      <div class="trigger-progress">
        <div class="trigger-progress-bar">
          <div class="trigger-progress-fill${d?" overflow":""}" style="width:${n}%;background:${h}"></div>
        </div>
        <span class="trigger-progress-label">${u}</span>
      </div>
    `}_renderMiniSparkline(e){if(!e.trigger_config?.entity_id)return c;let t=e.trigger_config.entity_id,i=this._miniStatsData.get(t)||[],r=[];if(i.length>=2)r=i.map(b=>({ts:b.ts,val:b.val}));else{if(!e.history)return c;for(let b of e.history)b.trigger_value!=null&&r.push({ts:new Date(b.timestamp).getTime(),val:b.trigger_value})}if(e.trigger_current_value!=null&&r.push({ts:Date.now(),val:e.trigger_current_value}),r.length<2)return c;r.sort((b,E)=>b.ts-E.ts);let n=Bt,u=Wt,d=r.map(b=>b.val),h=Math.min(...d),p=Math.max(...d),m=p-h||1;h-=m*.1,p+=m*.1;let f=r[0].ts,$=r[r.length-1].ts-f||1,C=b=>(b-f)/$*n,M=b=>2+(1-(b-h)/(p-h))*(u-4),T=r;if(T.length>lt){let b=Math.ceil(T.length/lt);T=T.filter((E,y)=>y%b===0||y===T.length-1)}let z=T.map(b=>`${C(b.ts).toFixed(1)},${M(b.val).toFixed(1)}`).join(" ");return l`
      <svg class="mini-sparkline" viewBox="0 0 ${n} ${u}" preserveAspectRatio="none" role="img" aria-label="${s("chart_mini_sparkline",this._lang)}">
        <polyline points="${z}" fill="none" stroke="var(--primary-color)" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
    `}_renderDaysProgress(e){let t=this._lang;if(e.days_until_due==null||!e.interval_days||e.interval_days<=0)return c;let r=(e.interval_days-e.days_until_due)/e.interval_days*100,n=Math.max(0,Math.min(100,r)),u=r>100,d="var(--success-color, #4caf50)";return e.status==="overdue"?d="var(--error-color, #f44336)":e.status==="due_soon"&&(d="var(--warning-color, #ff9800)"),l`
      <div class="days-progress">
        <div class="days-progress-labels">
          <span>${e.last_performed?`${s("last_performed",t)}: ${te(e.last_performed,t)}`:""}</span>
          <span>${e.next_due?`${s("next_due",t)}: ${te(e.next_due,t)}`:""}</span>
        </div>
        <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(n)}" aria-valuemin="0" aria-valuemax="100" aria-label="${s("days_progress",t)}">
          <div class="days-progress-fill${u?" overflow":""}" style="width:${n}%;background:${d}"></div>
        </div>
        <div class="days-progress-text">${$e(e.days_until_due,t)}</div>
      </div>
    `}_renderObjectDetail(){if(!this._selectedEntryId)return c;let e=this._getObject(this._selectedEntryId);if(!e)return l`<p>Object not found.</p>`;let t=e.object,i=this._lang;return l`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${t.name}</h2>
          <div class="action-buttons">
            <ha-button appearance="plain" @click=${()=>{this.shadowRoot.querySelector("maintenance-object-dialog")?.openEdit(e.entry_id,t)}}>${s("edit",i)}</ha-button>
            <ha-button appearance="filled" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate(e.entry_id)}}>${s("add_task",i)}</ha-button>
            <ha-button variant="danger" appearance="plain" @click=${()=>this._deleteObject(e.entry_id)}>${s("delete",i)}</ha-button>
            <ha-button appearance="plain" @click=${()=>this._openQrForObject(e.entry_id,t.name)}><ha-icon icon="mdi:qrcode"></ha-icon> ${s("qr_code",i)}</ha-button>
          </div>
        </div>
        ${t.manufacturer||t.model?l`<p class="meta">${[t.manufacturer,t.model].filter(Boolean).join(" ")}</p>`:c}
        ${t.installation_date?l`<p class="meta">${s("installed",i)}: ${te(t.installation_date,i)}</p>`:c}

        <h3>${s("tasks",i)} (${e.tasks.length})</h3>
        ${e.tasks.length===0?l`<p class="empty">${s("no_tasks_short",i)}</p>`:e.tasks.map(r=>l`
              <div class="task-row">
                <span class="status-badge ${r.status}">${s(r.status,i)}</span>
                <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,r.id)}>${r.name}</span>
                ${this._renderUserBadge(r)}
                <span class="cell type">${s(r.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(e.entry_id,r.id)}>
                  <span class="due-text">${$e(r.days_until_due,i)}</span>
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${s("complete",i)}" @click=${n=>{n.stopPropagation(),this._openCompleteDialog(e.entry_id,r.id,r.name)}}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${s("skip",i)}" @click=${n=>{n.stopPropagation(),this._skipTask(e.entry_id,r.id)}}>
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </mwc-icon-button>
                </span>
              </div>
            `)}
      </div>
    `}_renderTaskHeader(e){let t=this._lang,r=this._getObject(this._selectedEntryId)?.object.name||"",n="ok",u="OK";return e.days_until_due!==null&&e.days_until_due!==void 0&&(e.days_until_due<0?(n="overdue",u=s("overdue",t)):e.days_until_due<=e.warning_days&&(n="warning",u=s("due_soon",t))),l`
      <div class="task-header">
        <div class="task-header-title">
          <span class="task-name-breadcrumb" @click=${()=>this._view="task"}>${e.name}</span>
          <span class="breadcrumb-separator">·</span>
          <span class="object-name-breadcrumb" @click=${()=>this._showObject(this._selectedEntryId)}>${r}</span>
          <span class="status-chip ${n}">${u}</span>
          ${this._renderUserBadge(e)}
        </div>
        <div class="task-header-actions">
          <ha-button appearance="filled" @click=${()=>this._openCompleteDialog(this._selectedEntryId,this._selectedTaskId,e.name,this._features.checklists?e.checklist:void 0,this._features.adaptive&&!!e.adaptive_config?.enabled)}>${s("complete",t)}</ha-button>
          <ha-button appearance="plain" @click=${()=>this._skipTask(this._selectedEntryId,this._selectedTaskId)}>${s("skip",t)}</ha-button>
          <ha-button appearance="plain" class="more-menu-btn">
            ⋯
            <div class="dropdown-menu">
              <div class="menu-item" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,e)}}>${s("edit",t)}</div>
              <div class="menu-item" @click=${()=>this._resetTask(this._selectedEntryId,this._selectedTaskId)}>${s("reset",t)}</div>
              <div class="menu-item" @click=${()=>{let d=this._getObject(this._selectedEntryId)?.object;this._openQrForTask(this._selectedEntryId,this._selectedTaskId,d?.name||"",e.name)}}><ha-icon icon="mdi:qrcode"></ha-icon> ${s("qr_code",t)}</div>
              <div class="menu-item danger" @click=${()=>this._deleteTask(this._selectedEntryId,this._selectedTaskId)}>${s("delete",t)}</div>
            </div>
          </ha-button>
        </div>
      </div>
    `}_renderUserBadge(e){if(!e.responsible_user_id||!this._userService)return c;let t=this._userService.getUserName(e.responsible_user_id);return t?l`
      <span class="user-badge">
        <ha-icon icon="mdi:account"></ha-icon>
        ${t}
      </span>
    `:c}_renderTabBar(){let e=this._lang;return l`
      <div class="tab-bar">
        <div class="tab ${this._activeTab==="overview"?"active":""}" @click=${()=>this._activeTab="overview"}>
          ${s("overview",e)}
        </div>
        <div class="tab ${this._activeTab==="analysis"?"active":""}" @click=${()=>this._activeTab="analysis"}>
          ${s("analysis",e)}
        </div>
        <div class="tab ${this._activeTab==="history"?"active":""}" @click=${()=>this._activeTab="history"}>
          ${s("history",e)}
        </div>
      </div>
    `}_renderTabContent(e){switch(this._activeTab){case"overview":return this._renderOverviewTab(e);case"analysis":return this._renderAnalysisTab(e);case"history":return this._renderHistoryTab(e);default:return c}}_renderOverviewTab(e){let t=this._lang,i=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,r=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1,n=i||r;return l`
      <div class="tab-content overview-tab">
        ${this._renderKPIBar(e)}
        <div class="two-column-layout ${n?"":"single-column"}">
          ${n?l`
            <div class="left-column">
              ${this._renderRecommendationCard(e)}
              ${this._renderSeasonalCardCompact(e)}
            </div>
          `:c}
          <div class="right-column">
            ${this._renderCostDurationCard(e)}
          </div>
        </div>
        ${this._renderRecentActivities(e)}
      </div>
    `}_renderAnalysisTab(e){let t=this._lang;if(!(this._features.adaptive||this._features.seasonal))return l`
        <div class="tab-content analysis-tab">
          <p class="empty">${s("no_advanced_features",t)}</p>
        </div>
      `;let r=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,n=this._features.seasonal&&(e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12);if(!(r||n)){let d=e.schedule_type==="manual",h=e.interval_analysis?.data_points??0;return l`
        <div class="tab-content analysis-tab">
          <div class="analysis-empty-state">
            <p class="empty">${s("analysis_not_enough_data",t)}</p>
            <p class="empty-hint">
              ${d?s("analysis_manual_task_hint",t):s("analysis_not_enough_data_hint",t)}
            </p>
            ${!d&&h>0?l`
              <p class="empty-hint">${h} / 5</p>
            `:c}
          </div>
        </div>
      `}return l`
      <div class="tab-content analysis-tab">
        ${this._features.adaptive?this._renderWeibullCardExpanded(e):c}
        ${this._features.seasonal?this._renderSeasonalCardExpanded(e):c}
      </div>
    `}_renderHistoryTab(e){let t=this._lang;return l`
      <div class="tab-content history-tab">
        ${this._renderHistoryFilters(e)}
        ${this._renderHistoryList(e)}
      </div>
    `}_renderKPIBar(e){let t=this._lang,i=e.times_performed>0?e.total_cost/e.times_performed:0,r=e.days_until_due!==null&&e.days_until_due!==void 0?e.days_until_due<0?"overdue":e.days_until_due<=e.warning_days?"warning":"":"";return l`
      <div class="kpi-bar">
        <div class="kpi-card">
          <div class="kpi-label">${s("next_due",t)}</div>
          <div class="kpi-value">${e.next_due?te(e.next_due,t):"\u2014"}</div>
        </div>
        <div class="kpi-card ${r}">
          <div class="kpi-label">${s("days_until_due",t)}</div>
          <div class="kpi-value-large">${e.days_until_due!==null&&e.days_until_due!==void 0?e.days_until_due:"\u2014"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("interval",t)}</div>
          <div class="kpi-value">${e.interval_days} ${s("days",t)}</div>
          ${this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days?l`
            <div class="kpi-subtext">${s("recommended",t)}: ${e.suggested_interval}${e.interval_analysis?.confidence_interval_low!=null?` (${e.interval_analysis.confidence_interval_low}\u2013${e.interval_analysis.confidence_interval_high})`:""}</div>
          `:c}
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("warning",t)}</div>
          <div class="kpi-value">${e.warning_days} ${s("days",t)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("last_performed",t)}</div>
          <div class="kpi-value">${e.last_performed?te(e.last_performed,t):"\u2014"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("avg_cost",t)}</div>
          <div class="kpi-value">${i.toFixed(0)} €</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("avg_duration",t)}</div>
          <div class="kpi-value">${e.average_duration?e.average_duration.toFixed(0):"\u2014"} min</div>
        </div>
      </div>
    `}_renderRecommendationCard(e){let t=this._lang;if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return c;let i=e.interval_days,r=e.suggested_interval,n=e.interval_confidence||"medium";return l`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",t)}</h4>
        <div class="interval-comparison">
          <div class="interval-bar">
            <div class="interval-label">${s("current",t)||"Aktuell"}: ${i} ${s("days",t)}</div>
            <div class="interval-visual current" style="width: ${Math.min(i/r*100,100)}%"></div>
          </div>
          <div class="interval-bar">
            <div class="interval-label">${s("recommended",t)}: ${r} ${s("days",t)}
              <span class="confidence-badge ${n}">${s(`confidence_${n}`,t)}</span>
            </div>
            <div class="interval-visual suggested" style="width: 100%"></div>
          </div>
        </div>
        <div class="recommendation-actions">
          <ha-button appearance="filled" @click=${()=>this._applySuggestion(this._selectedEntryId,this._selectedTaskId,r)}>
            ${s("apply_suggestion",t)}
          </ha-button>
          <ha-button appearance="plain" @click=${()=>this._dismissSuggestion()}>
            ${s("dismiss_suggestion",t)}
          </ha-button>
        </div>
      </div>
    `}_renderSeasonalCardCompact(e){let t=this._lang;if(!this._features.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return c;let i=["Jan","Feb","M\xE4r","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],r=new Date().getMonth(),n=i.map((u,d)=>{let h=e.seasonal_factor||1,p=Math.sin((d-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,h+p))});return l`
      <div class="seasonal-card-compact">
        <h4>${s("seasonal_awareness",t)}</h4>
        <div class="seasonal-mini-chart">
          ${n.map((u,d)=>{let h=u*40,p=u<.9?"low":u>1.1?"high":"normal";return l`
              <div class="seasonal-bar ${p} ${d===r?"current":""}"
                   style="height: ${h}px"
                   title="${i[d]}: ${u.toFixed(2)}x">
              </div>
            `})}
        </div>
        <div class="seasonal-legend">
          <span class="legend-item"><span class="dot low"></span> ${s("shorter",t)||"K\xFCrzer"}</span>
          <span class="legend-item"><span class="dot normal"></span> ${s("normal",t)||"Normal"}</span>
          <span class="legend-item"><span class="dot high"></span> ${s("longer",t)||"L\xE4nger"}</span>
        </div>
      </div>
    `}_renderCostDurationCard(e){let t=this._lang;return l`
      <div class="cost-duration-card">
        <div class="card-header">
          <h3>${s("cost_duration_chart",t)}</h3>
          <div class="toggle-buttons">
            <button
              class="toggle-btn ${this._costDurationToggle==="cost"?"active":""}"
              @click=${()=>this._costDurationToggle="cost"}>
              ${s("cost",t)}
            </button>
            <button
              class="toggle-btn ${this._costDurationToggle==="both"?"active":""}"
              @click=${()=>this._costDurationToggle="both"}>
              ${s("both",t)}
            </button>
            <button
              class="toggle-btn ${this._costDurationToggle==="duration"?"active":""}"
              @click=${()=>this._costDurationToggle="duration"}>
              ${s("duration",t)}
            </button>
          </div>
        </div>
        ${this._renderHistoryChart(e)}
      </div>
    `}_renderRecentActivities(e){let t=this._lang,i=e.history.slice(0,3);if(i.length===0)return c;let r=n=>{switch(n){case"completed":return"\u2713";case"triggered":return"\u2297";case"skipped":return"\u21B7";case"reset":return"\u21BA";default:return"\xB7"}};return l`
      <div class="recent-activities">
        <h3>${s("recent_activities",t)}</h3>
        ${i.map(n=>l`
          <div class="activity-item">
            <span class="activity-icon">${r(n.type)}</span>
            <span class="activity-date">${He(n.timestamp,t)}</span>
            <span class="activity-note">${n.notes||"\u2014"}</span>
            ${n.cost?l`<span class="activity-badge">${n.cost.toFixed(0)}€</span>`:c}
            ${n.duration?l`<span class="activity-badge">${n.duration}min</span>`:c}
          </div>
        `)}
        <div class="activity-show-all">
          <ha-button appearance="plain" @click=${()=>this._activeTab="history"}>${s("show_all",t)} →</ha-button>
        </div>
      </div>
    `}_renderWeibullCardExpanded(e){return this._renderWeibullSection(e)}_renderSeasonalCardExpanded(e){return this._renderSeasonalChart(e)}_renderHistoryFilters(e){let t=this._lang;return l`
      <div class="history-filters-new">
        <div class="filter-chips">
          ${["completed","skipped","reset","triggered"].map(i=>{let r=e.history.filter(n=>n.type===i).length;return r===0?c:l`
              <span class="filter-chip ${this._historyFilter===i?"active":""}"
                @click=${()=>{this._historyFilter=this._historyFilter===i?null:i}}>
                ${s(i,t)} (${r})
              </span>
            `})}
          ${this._historyFilter?l`<span class="filter-chip clear" @click=${()=>{this._historyFilter=null}}>${s("show_all",t)}</span>`:c}
        </div>
        <div class="filter-controls">
          <input type="text" class="search-input" placeholder="${s("search_notes",t)}..." .value=${this._historySearch} @input=${i=>this._historySearch=i.target.value} />
        </div>
      </div>
    `}_renderHistoryList(e){let t=this._lang,i=this._historyFilter?e.history.filter(r=>r.type===this._historyFilter):e.history;if(this._historySearch){let r=this._historySearch.toLowerCase();i=i.filter(n=>n.notes?.toLowerCase().includes(r))}return i.length===0?l`<p class="empty">${s("no_history",t)}</p>`:l`
      <div class="history-timeline">
        ${[...i].reverse().map(r=>this._renderHistoryEntry(r))}
      </div>
    `}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return c;let e=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!e)return l`<p>Task not found.</p>`;let t=this._lang;return l`
      <div class="detail-section">
        ${this._renderTaskHeader(e)}
        ${this._renderTabBar()}
        ${this._renderTabContent(e)}
      </div>
    `}_renderHistoryChart(e){let t=e.history.filter(y=>y.type==="completed"&&(y.cost!=null||y.duration!=null)).map(y=>({ts:new Date(y.timestamp).getTime(),cost:y.cost??0,duration:y.duration??0})).sort((y,D)=>y.ts-D.ts);if(t.length<2)return c;let i=t.some(y=>y.cost>0),r=t.some(y=>y.duration>0);if(!i&&!r)return c;let n=Zt,u=Yt,d=i?32:8,h=r?32:8,p=8,m=20,f=n-d-h,x=u-p-m,$=Math.max(...t.map(y=>y.cost))||1,C=Math.max(...t.map(y=>y.duration))||1,M=Math.min(20,f/t.length*.6),T=f/t.length,z=y=>d+T*y+T/2,b=y=>p+x-y/$*x,E=y=>p+x-y/C*x;return l`
      <div class="sparkline-container">
        <svg class="history-chart" viewBox="0 0 ${n} ${u}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_history",this._lang)}">
          <!-- Cost bars -->
          ${i?t.map((y,D)=>L`
            <rect x="${(z(D)-M/2).toFixed(1)}" y="${b(y.cost).toFixed(1)}" width="${M.toFixed(1)}" height="${(p+x-b(y.cost)).toFixed(1)}"
              fill="var(--primary-color)" opacity="0.6" rx="2" />
          `):c}
          <!-- Duration line -->
          ${r?L`
            <polyline points="${t.map((y,D)=>`${z(D).toFixed(1)},${E(y.duration).toFixed(1)}`).join(" ")}"
              fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
            ${t.map((y,D)=>L`
              <circle cx="${z(D).toFixed(1)}" cy="${E(y.duration).toFixed(1)}" r="3" fill="var(--accent-color, #ff9800)" />
            `)}
          `:c}
          <!-- X-axis labels -->
          <text x="${d}" y="${u-2}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(t[0].ts).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
          <text x="${n-h}" y="${u-2}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(t[t.length-1].ts).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
          <!-- Y-axis labels -->
          ${i?L`
            <text x="${d-3}" y="${p+4}" text-anchor="end" fill="var(--primary-color)" font-size="7">${$.toFixed(0)}\u20AC</text>
            <text x="${d-3}" y="${p+x+3}" text-anchor="end" fill="var(--primary-color)" font-size="7">0\u20AC</text>
          `:c}
          ${r?L`
            <text x="${n-h+3}" y="${p+4}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">${C.toFixed(0)}m</text>
            <text x="${n-h+3}" y="${p+x+3}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">0m</text>
          `:c}
        </svg>
      </div>
      <div class="chart-legend">
        ${i?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${s("cost",this._lang)}</span>`:c}
        ${r?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${s("duration",this._lang)}</span>`:c}
      </div>
    `}_renderSeasonalChart(e){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return c;let i=this._lang,r=e.interval_analysis?.seasonal_reason,n=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],u=new Date().getMonth(),d=300,h=100,p=8,f=h-p-4,x=Math.max(...t,1.5),$=d/12,C=$*.65,M=p+f-1/x*f;return l`
      <div class="seasonal-chart">
        <div class="seasonal-chart-title">
          <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
          ${s("seasonal_chart_title",i)}
          ${r?l`<span class="source-tag">${r==="learned"?s("seasonal_learned",i):s("seasonal_manual",i)}</span>`:c}
        </div>
        <svg viewBox="0 0 ${d} ${h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",i)}">
          <!-- Baseline at 1.0 -->
          <line x1="0" y1="${M.toFixed(1)}" x2="${d}" y2="${M.toFixed(1)}"
            stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
          <!-- Bars -->
          ${t.map((T,z)=>{let b=T/x*f,E=z*$+($-C)/2,y=p+f-b,D=z===u,Z=T<1?"var(--success-color, #4caf50)":T>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return L`
              <rect x="${E.toFixed(1)}" y="${y.toFixed(1)}"
                width="${C.toFixed(1)}" height="${b.toFixed(1)}"
                fill="${Z}" opacity="${D?1:.5}" rx="2" />
            `})}
        </svg>
        <div class="seasonal-labels">
          ${n.map((T,z)=>l`<span class="seasonal-label ${z===u?"active-month":""}">${s(T,i)}</span>`)}
        </div>
      </div>
    `}_renderWeibullSection(e){let t=e.interval_analysis,i=t?.weibull_beta,r=t?.weibull_eta;if(i==null||r==null)return c;let n=this._lang,u=t?.weibull_r_squared,d=e.interval_days??0,h=e.suggested_interval??d;return l`
      <div class="weibull-section">
        <div class="weibull-title">
          <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
          ${s("weibull_reliability_curve",n)}
          ${this._renderBetaBadge(i,n)}
        </div>
        ${this._renderWeibullChart(i,r,d,h)}
        ${this._renderWeibullInfo(t,n)}
        ${t?.confidence_interval_low!=null?this._renderConfidenceInterval(t,e,n):c}
      </div>
    `}_renderBetaBadge(e,t){let i,r,n;return e<.8?(i="early_failures",r="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",n="beta_early_failures"):e<=1.2?(i="random_failures",r="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",n="beta_random_failures"):e<=3.5?(i="wear_out",r="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",n="beta_wear_out"):(i="highly_predictable",r="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",n="beta_highly_predictable"),l`
      <span class="beta-badge ${i}">
        <ha-svg-icon path="${r}"></ha-svg-icon>
        ${s(n,t)} (β=${e.toFixed(2)})
      </span>
    `}_renderWeibullChart(e,t,i,r){let $=Math.max(i,r,t)*1.3,C=50,M=[];for(let F=0;F<=C;F++){let N=F/C*$,H=1-Math.exp(-Math.pow(N/t,e)),S=32+N/$*260,ke=136-H*128;M.push([S,ke])}let T=M.map(([F,N])=>`${F.toFixed(1)},${N.toFixed(1)}`).join(" "),z="M32,136 "+M.map(([F,N])=>`L${F.toFixed(1)},${N.toFixed(1)}`).join(" ")+` L${M[C][0].toFixed(1)},136 Z`,b=32+i/$*260,E=1-Math.exp(-Math.pow(i/t,e)),y=136-E*128,D=((1-E)*100).toFixed(0),Z=32+r/$*260,Y=[0,.25,.5,.75,1];return l`
      <div class="weibull-chart">
        <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",this._lang)}">
          <!-- Grid lines -->
          ${Y.map(F=>{let N=136-F*128;return L`
              <line x1="${32}" y1="${N.toFixed(1)}" x2="${292}" y2="${N.toFixed(1)}"
                stroke="var(--divider-color)" stroke-width="0.5" ${F===.5?'stroke-dasharray="4,3"':""} />
              <text x="${28}" y="${(N+3).toFixed(1)}" fill="var(--secondary-text-color)"
                font-size="8" text-anchor="end">${(F*100).toFixed(0)}%</text>
            `})}

          <!-- X-axis labels -->
          <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
          <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round($/2)}</text>
          <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round($)}</text>

          <!-- Filled area under CDF curve -->
          <path d="${z}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />

          <!-- CDF Curve -->
          <polyline points="${T}" fill="none"
            stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

          <!-- Current interval marker -->
          ${i>0?L`
            <line x1="${b.toFixed(1)}" y1="${8}" x2="${b.toFixed(1)}" y2="${136 .toFixed(1)}"
              stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
            <circle cx="${b.toFixed(1)}" cy="${y.toFixed(1)}" r="3"
              fill="var(--primary-color, #03a9f4)" />
            <text x="${(b+4).toFixed(1)}" y="${(y-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
              font-size="9" font-weight="600">R=${D}%</text>
          `:c}

          <!-- Recommended marker -->
          ${r>0&&r!==i?L`
            <line x1="${Z.toFixed(1)}" y1="${8}" x2="${Z.toFixed(1)}" y2="${136 .toFixed(1)}"
              stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
          `:c}

          <!-- Axes -->
          <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
            stroke="var(--secondary-text-color)" stroke-width="1" />
          <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
            stroke="var(--secondary-text-color)" stroke-width="1" />
        </svg>
      </div>
      <div class="chart-legend">
        <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",this._lang)}</span>
        ${i>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",this._lang)}</span>`:c}
        ${r>0&&r!==i?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",this._lang)}</span>`:c}
      </div>
    `}_renderWeibullInfo(e,t){return l`
      <div class="weibull-info-row">
        <div class="weibull-info-item">
          <span>${s("characteristic_life",t)}</span>
          <span class="weibull-info-value">${Math.round(e.weibull_eta)} ${s("days",t)}</span>
        </div>
        ${e.weibull_r_squared!=null?l`
          <div class="weibull-info-item">
            <span>${s("weibull_r_squared",t)}</span>
            <span class="weibull-info-value">${e.weibull_r_squared.toFixed(3)}</span>
          </div>
        `:c}
      </div>
    `}_renderConfidenceInterval(e,t,i){let r=e.confidence_interval_low,n=e.confidence_interval_high,u=t.suggested_interval??t.interval_days??0,d=t.interval_days??0,h=Math.max(0,r-5),m=n+5-h,f=(r-h)/m*100,x=(n-r)/m*100,$=(u-h)/m*100,C=d>0?(d-h)/m*100:-1;return l`
      <div class="confidence-range">
        <div class="confidence-range-title">
          ${s("confidence_interval",i)}: ${u} ${s("days",i)} (${r}–${n})
        </div>
        <div class="confidence-bar">
          <div class="confidence-fill" style="left:${f.toFixed(1)}%;width:${x.toFixed(1)}%"></div>
          ${C>=0?l`<div class="confidence-marker current" style="left:${C.toFixed(1)}%"></div>`:c}
          <div class="confidence-marker recommended" style="left:${$.toFixed(1)}%"></div>
        </div>
        <div class="confidence-labels">
          <span class="confidence-text low">${s("confidence_conservative",i)} (${r}${s("days",i).charAt(0)})</span>
          <span class="confidence-text high">${s("confidence_aggressive",i)} (${n}${s("days",i).charAt(0)})</span>
        </div>
      </div>
    `}_renderPredictionSection(e){let t=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",i=e.days_until_threshold!=null,r=e.environmental_factor!=null&&e.environmental_factor!==1;if(!t&&!i&&!r)return c;let n=this._lang,u=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
      <div class="prediction-section">
        ${e.sensor_prediction_urgency?l`
          <div class="prediction-urgency-banner">
            <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
            ${s("sensor_prediction_urgency",n).replace("{days}",String(Math.round(e.days_until_threshold||0)))}
          </div>
        `:c}
        <div class="prediction-title">
          <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
          ${s("sensor_prediction",n)}
        </div>
        <div class="prediction-grid">
          ${t?l`
            <div class="prediction-item">
              <ha-svg-icon path="${u}"></ha-svg-icon>
              <span class="prediction-label">${s("degradation_trend",n)}</span>
              <span class="prediction-value ${e.degradation_trend}">${s("trend_"+e.degradation_trend,n)}</span>
              ${e.degradation_rate!=null?l`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${Math.abs(e.degradation_rate)>=10?Math.round(e.degradation_rate).toLocaleString():e.degradation_rate.toFixed(1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",n)}</span>`:c}
            </div>
          `:c}
          ${i?l`
            <div class="prediction-item">
              <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
              <span class="prediction-label">${s("days_until_threshold",n)}</span>
              <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?s("threshold_exceeded",n):"~"+Math.round(e.days_until_threshold)+" "+s("days",n)}</span>
              ${e.threshold_prediction_date?l`<span class="prediction-date">${te(e.threshold_prediction_date,n)}</span>`:c}
              ${e.threshold_prediction_confidence?l`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:c}
            </div>
          `:c}
          ${r&&this._features.environmental?l`
            <div class="prediction-item">
              <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
              <span class="prediction-label">${s("environmental_adjustment",n)}</span>
              <span class="prediction-value">${e.environmental_factor.toFixed(2)}x</span>
              ${e.environmental_entity?l`<span class="prediction-entity">${e.environmental_entity}</span>`:c}
            </div>
          `:c}
        </div>
      </div>
    `}_renderTriggerSection(e){let t=e.trigger_config;if(!t)return c;let i=this._lang,r=e.trigger_entity_info,n=r?.friendly_name||t.entity_id||"\u2014",u=t.entity_id||"",d=r?.unit_of_measurement||"",h=e.trigger_current_value,p=t.type||"threshold";return l`
      <h3>${s("trigger",i)}</h3>
      <div class="trigger-card">
        <div class="trigger-header">
          <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
          <div>
            <div class="trigger-entity-name">${n}</div>
            <div class="trigger-entity-id">${u}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          </div>
          <span class="status-badge ${e.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
            ${e.trigger_active?s("triggered",i):s("ok",i)}
          </span>
        </div>

        ${h!=null?l`
              <div class="trigger-value-row">
                <span class="trigger-current ${e.trigger_active?"active":""}">${typeof h=="number"?h.toFixed(1):h}</span>
                ${d?l`<span class="trigger-unit">${d}</span>`:c}
              </div>
            `:c}

        <div class="trigger-limits">
          ${p==="threshold"?l`
            ${t.trigger_above!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_above",i)}: ${t.trigger_above} ${d}</span>`:c}
            ${t.trigger_below!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_below",i)}: ${t.trigger_below} ${d}</span>`:c}
            ${t.trigger_for_minutes?l`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("for_minutes",i)}: ${t.trigger_for_minutes}</span>`:c}
          `:c}
          ${p==="counter"?l`
            ${t.trigger_target_value!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("target_value",i)}: ${t.trigger_target_value} ${d}</span>`:c}
          `:c}
          ${p==="state_change"?l`
            ${t.trigger_target_changes!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("target_changes",i)}: ${t.trigger_target_changes}</span>`:c}
          `:c}
          ${r?.min!=null?l`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("min",i)}: ${r.min} ${d}</span>`:c}
          ${r?.max!=null?l`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("max",i)}: ${r.max} ${d}</span>`:c}
        </div>

        ${this._renderSparkline(e,d)}
      </div>
    `}_renderSparkline(e,t){let i=e.trigger_config;if(!i)return c;let r=i.type||"threshold",n=r==="counter"&&i.trigger_delta_mode,u=this._isCounterEntity(i),d=i.entity_id||"",h=this._detailStatsData.get(d)||[],p=[],m=!1;if(h.length>=2)for(let _ of h){let w=_.val;n&&e.trigger_baseline_value!=null&&(w-=e.trigger_baseline_value);let j={ts:_.ts,val:w};!u&&_.min!=null&&_.max!=null&&(j.min=n&&e.trigger_baseline_value!=null?_.min-e.trigger_baseline_value:_.min,j.max=n&&e.trigger_baseline_value!=null?_.max-e.trigger_baseline_value:_.max,m=!0),p.push(j)}else for(let _ of e.history)_.trigger_value!=null&&p.push({ts:new Date(_.timestamp).getTime(),val:_.trigger_value});if(e.trigger_current_value!=null){let _=e.trigger_current_value;n&&e.trigger_baseline_value!=null&&(_-=e.trigger_baseline_value),p.push({ts:Date.now(),val:_})}if(p.length<2&&d&&this._statsService&&!this._detailStatsData.has(d))return l`<div class="sparkline-container" aria-live="polite" style="display:flex;align-items:center;justify-content:center;height:140px;color:var(--secondary-text-color);font-size:12px;">
        <ha-icon icon="mdi:chart-line" style="--mdc-icon-size:16px;margin-right:8px;"></ha-icon>
        ${s("loading_chart",this._lang)}
      </div>`;if(p.length<2)return c;p.sort((_,w)=>_.ts-w.ts);let f=Gt,x=Kt,$=30,C=2,M=8,T=16,z=p.map(_=>_.val),b=Math.min(...z),E=Math.max(...z);if(m)for(let _ of p)_.min!=null&&(b=Math.min(b,_.min)),_.max!=null&&(E=Math.max(E,_.max));i.trigger_above!=null&&(E=Math.max(E,i.trigger_above),b=Math.min(b,i.trigger_above)),i.trigger_below!=null&&(b=Math.min(b,i.trigger_below),E=Math.max(E,i.trigger_below));let y=null,D=null;if(r==="counter"&&i.trigger_target_value!=null){if(e.trigger_baseline_value!=null)y=e.trigger_baseline_value;else if(p.length>0){let _=[...e.history].filter(w=>w.type==="completed"||w.type==="reset").sort((w,j)=>new Date(j.timestamp).getTime()-new Date(w.timestamp).getTime())[0];if(_){let w=new Date(_.timestamp).getTime(),j=p[0],P=Math.abs(p[0].ts-w);for(let B of p){let W=Math.abs(B.ts-w);W<P&&(j=B,P=W)}y=j.val}else y=p[0].val}y!=null?(D=y+i.trigger_target_value,E=Math.max(E,D),b=Math.min(b,y)):(E=Math.max(E,i.trigger_target_value),b=Math.min(b,0))}n&&e.trigger_baseline_value!=null&&(b=Math.min(b,0));let Z=E-b||1;b-=Z*.1,E+=Z*.1;let Y=p[0].ts,F=p[p.length-1].ts,N=F-Y||1,H=_=>$+(_-Y)/N*(f-$-C),S=_=>M+(1-(_-b)/(E-b))*(x-M-T),ke=p.map(_=>`${H(_.ts).toFixed(1)},${S(_.val).toFixed(1)}`).join(" "),ct=`M${H(p[0].ts).toFixed(1)},${x-T} `+p.map(_=>`L${H(_.ts).toFixed(1)},${S(_.val).toFixed(1)}`).join(" ")+` L${H(p[p.length-1].ts).toFixed(1)},${x-T} Z`,Ae="";if(m){let _=p.filter(w=>w.min!=null&&w.max!=null);if(_.length>=2){let w=_.map(P=>`${H(P.ts).toFixed(1)},${S(P.max).toFixed(1)}`),j=[..._].reverse().map(P=>`${H(P.ts).toFixed(1)},${S(P.min).toFixed(1)}`);Ae=`M${w[0]} `+w.slice(1).map(P=>`L${P}`).join(" ")+` L${j[0]} `+j.slice(1).map(P=>`L${P}`).join(" ")+" Z"}}let Re=p[p.length-1],dt=H(Re.ts),ut=S(Re.val),Ne=_=>Math.abs(_)>=1e4?(_/1e3).toFixed(0)+"k":_>=1e3?(_/1e3).toFixed(1)+"k":_.toFixed(_<10?1:0),pt=Ne(E),_t=Ne(b),gt=e.history.filter(_=>["completed","skipped","reset"].includes(_.type)).map(_=>({ts:new Date(_.timestamp).getTime(),type:_.type})).filter(_=>_.ts>=Y&&_.ts<=F),Ee=Jt,Te=p;if(p.length>Ee){let _=(p.length-1)/(Ee-1);Te=[];for(let w=0;w<Ee;w++)Te.push(p[Math.round(w*_)])}return l`
      <div class="sparkline-container">
        <svg class="sparkline-svg" viewBox="0 0 ${f} ${x}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_sparkline",this._lang)}">
          <!-- Y-axis labels -->
          <text x="${$-3}" y="${M+3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${pt}</text>
          <text x="${$-3}" y="${x-T+3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${_t}</text>
          <!-- X-axis labels -->
          <text x="${$}" y="${x-1}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(Y).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
          <text x="${f-C}" y="${x-1}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(F).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
          <!-- Min/max band (mean-type entities) -->
          ${Ae?L`<path d="${Ae}" fill="var(--primary-color)" opacity="0.08" />`:c}
          <!-- Area fill -->
          <path d="${ct}" fill="var(--primary-color)" opacity="0.15" />
          <!-- Line -->
          <polyline points="${ke}" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linejoin="round" />
          <!-- Prediction projection line (Phase 3) -->
          ${e.degradation_rate!=null&&e.degradation_trend!=="stable"&&e.degradation_trend!=="insufficient_data"&&p.length>=2?(()=>{let _=p[p.length-1],w=30,j=_.ts+w*864e5,P=_.val+e.degradation_rate*w,B=Math.min(j,F+(F-Y)*.3),W=Math.max(b,Math.min(E,P)),ht=H(_.ts),mt=S(_.val),vt=H(B),ft=S(W);return L`<line x1="${ht.toFixed(1)}" y1="${mt.toFixed(1)}" x2="${vt.toFixed(1)}" y2="${ft.toFixed(1)}" stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7" />`})():c}
          <!-- Threshold lines (for threshold type) -->
          ${r==="threshold"&&i.trigger_above!=null?L`<line x1="${$}" y1="${S(i.trigger_above).toFixed(1)}" x2="${f}" y2="${S(i.trigger_above).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                  <text x="${f-2}" y="${S(i.trigger_above)-3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">▲ ${i.trigger_above}</text>`:c}
          ${r==="threshold"&&i.trigger_below!=null?L`<line x1="${$}" y1="${S(i.trigger_below).toFixed(1)}" x2="${f}" y2="${S(i.trigger_below).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                  <text x="${f-2}" y="${S(i.trigger_below)+11}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">▼ ${i.trigger_below}</text>`:c}
          <!-- Target line (for counter type) -->
          ${r==="counter"&&D!=null?L`<line x1="${$}" y1="${S(D).toFixed(1)}" x2="${f}" y2="${S(D).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                  <text x="${f-2}" y="${S(D)-3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">${s("target_value",this._lang)}: +${i.trigger_target_value}</text>`:c}
          <!-- Baseline line (for counter — value at last maintenance) -->
          ${r==="counter"&&y!=null?L`<line x1="${$}" y1="${S(y).toFixed(1)}" x2="${f}" y2="${S(y).toFixed(1)}" stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
                  <text x="${$+2}" y="${S(y)+11}" text-anchor="start" fill="var(--secondary-text-color)" font-size="8">${s("baseline",this._lang)}</text>`:c}
          <!-- Current dot -->
          <circle cx="${dt.toFixed(1)}" cy="${ut.toFixed(1)}" r="3.5" fill="var(--primary-color)" />
          <!-- Event markers -->
          ${gt.map(_=>{let w=H(_.ts),j=_.type==="completed"?"var(--success-color, #4caf50)":_.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return L`
              <line x1="${w.toFixed(1)}" y1="${M}" x2="${w.toFixed(1)}" y2="${x-T}" stroke="${j}" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
              <circle cx="${w.toFixed(1)}" cy="${M+2}" r="5" fill="${j}" opacity="0.8" />
              <text x="${w.toFixed(1)}" y="${M+6}" text-anchor="middle" fill="white" font-size="7" font-weight="bold">${_.type==="completed"?"\u2713":_.type==="skipped"?"\u23ED":"\u21BA"}</text>
            `})}
          <!-- Hover hit targets (downsampled for performance) -->
          ${Te.map(_=>{let w=H(_.ts),j=S(_.val),P=new Date(_.ts).toLocaleDateString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),B=`${_.val.toFixed(1)} ${t}`;return m&&_.min!=null&&_.max!=null&&(B+=` (${_.min.toFixed(1)}\u2013${_.max.toFixed(1)})`),L`<circle cx="${w.toFixed(1)}" cy="${j.toFixed(1)}" r="8" fill="transparent" tabindex="0"
              @mouseenter=${W=>this._showSparklineTooltip(W,`${P}
${B}`)}
              @focus=${W=>this._showSparklineTooltip(W,`${P}
${B}`)}
              @mouseleave=${()=>{this._sparklineTooltip=null}}
              @blur=${()=>{this._sparklineTooltip=null}} />`})}
        </svg>
        ${this._sparklineTooltip?l`
          <div class="sparkline-tooltip" role="tooltip" aria-live="assertive" style="left:${this._sparklineTooltip.x}px;top:${this._sparklineTooltip.y}px">
            ${this._sparklineTooltip.text.split(`
`).map(_=>l`<div>${_}</div>`)}
          </div>
        `:c}
      </div>
    `}_showSparklineTooltip(e,t){let i=e.currentTarget,r=i.closest(".sparkline-container");if(!r)return;let n=r.getBoundingClientRect(),u=i.getBoundingClientRect();this._sparklineTooltip={x:u.left-n.left+u.width/2,y:u.top-n.top-8,text:t}}_renderHistoryEntry(e){let t=this._lang;return l`
      <div class="history-entry">
        <div class="history-icon ${e.type}">
          <ha-icon .icon=${nt[e.type]||"mdi:circle"}></ha-icon>
        </div>
        <div class="history-content">
          <div><strong>${s(e.type,t)}</strong></div>
          <div class="history-date">${He(e.timestamp,t)}</div>
          ${e.notes?l`<div>${e.notes}</div>`:c}
          <div class="history-details">
            ${e.cost!=null?l`<span>${s("cost",t)}: ${e.cost.toFixed(2)} €</span>`:c}
            ${e.duration!=null?l`<span>${s("duration",t)}: ${e.duration} min</span>`:c}
            ${e.trigger_value!=null?l`<span>${s("trigger_val",t)}: ${e.trigger_value}</span>`:c}
          </div>
        </div>
      </div>
    `}};A.styles=[ot,U`
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
      .analysis-empty-state { text-align: center; padding: 24px 16px; }
      .analysis-empty-state .empty { font-size: 15px; margin-bottom: 8px; }
      .empty-hint { color: var(--secondary-text-color); font-size: 13px; margin: 4px 0; }

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

      /* Dashboard redesign styles */

      .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        margin-bottom: 16px;
        gap: 12px;
        flex-wrap: wrap;
      }

      .task-header-title {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
      }

      .task-name-breadcrumb,
      .object-name-breadcrumb {
        cursor: pointer;
        color: var(--primary-text-color);
        text-decoration: none;
      }

      .task-name-breadcrumb:hover,
      .object-name-breadcrumb:hover {
        text-decoration: underline;
      }

      .breadcrumb-separator {
        color: var(--secondary-text-color);
        margin: 0 4px;
      }

      .status-chip {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }

      .status-chip.ok {
        background: #4caf50;
        color: white;
      }

      .status-chip.warning {
        background: #ff9800;
        color: white;
      }

      .status-chip.overdue {
        background: #f44336;
        color: white;
      }

      .user-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        margin-left: 8px;
        background: var(--primary-color);
        color: var(--text-primary-color);
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
      }

      .user-badge ha-icon {
        --mdc-icon-size: 14px;
      }

      .task-header-actions {
        display: flex;
        gap: 8px;
      }

      .more-menu-btn {
        position: relative;
      }

      .dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 100;
        min-width: 160px;
      }

      .more-menu-btn:hover .dropdown-menu {
        display: block;
      }

      .menu-item {
        padding: 10px 16px;
        cursor: pointer;
        border-bottom: 1px solid var(--divider-color);
      }

      .menu-item:last-child {
        border-bottom: none;
      }

      .menu-item:hover {
        background: var(--table-row-alternative-background-color, rgba(0, 0, 0, 0.04));
      }

      .menu-item.danger {
        color: #f44336;
      }

      .tab-bar {
        display: flex;
        gap: 4px;
        border-bottom: 2px solid var(--divider-color);
        margin-bottom: 16px;
      }

      .tab {
        padding: 12px 24px;
        cursor: pointer;
        font-weight: 500;
        color: var(--secondary-text-color);
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        transition: all 0.2s;
      }

      .tab:hover {
        color: var(--primary-text-color);
      }

      .tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }

      .tab-content {
        padding: 16px 0;
      }

      .kpi-bar {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 12px;
        margin-bottom: 24px;
      }

      .kpi-card {
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        padding: 16px 12px;
        text-align: center;
        border: 1px solid var(--divider-color);
      }

      .kpi-card.warning {
        border-color: #ff9800;
        background: rgba(255, 152, 0, 0.1);
      }

      .kpi-card.overdue {
        border-color: #f44336;
        background: rgba(244, 67, 54, 0.1);
      }

      .kpi-label {
        font-size: 11px;
        color: var(--secondary-text-color);
        margin-bottom: 6px;
        text-transform: uppercase;
        font-weight: 500;
      }

      .kpi-value {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .kpi-value-large {
        font-size: 22px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .kpi-subtext {
        font-size: 10px;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }

      .two-column-layout {
        display: grid;
        grid-template-columns: 40% 60%;
        gap: 16px;
        margin-bottom: 24px;
      }

      .two-column-layout.single-column {
        grid-template-columns: 1fr;
      }

      .left-column,
      .right-column {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .recent-activities {
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--divider-color);
      }

      .recent-activities h3 {
        margin: 0 0 12px 0;
      }

      .activity-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }

      .activity-item:last-of-type {
        border-bottom: none;
      }

      .activity-icon {
        font-size: 18px;
        width: 24px;
        text-align: center;
      }

      .activity-date {
        font-size: 12px;
        color: var(--secondary-text-color);
        min-width: 120px;
      }

      .activity-note {
        flex: 1;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .activity-badge {
        font-size: 12px;
        padding: 2px 8px;
        background: var(--primary-color);
        color: white;
        border-radius: 12px;
      }

      .activity-show-all {
        margin-top: 12px;
        text-align: center;
      }

      .history-filters-new {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      .filter-chips {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .filter-controls {
        display: flex;
        gap: 8px;
      }

      .search-input {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        font-size: 14px;
        min-width: 200px;
      }

      .search-input:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      /* Recommendation Card */
      .recommendation-card {
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--divider-color);
      }

      .recommendation-card h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
      }

      .interval-comparison {
        margin-bottom: 16px;
      }

      .interval-bar {
        margin-bottom: 12px;
      }

      .interval-label {
        font-size: 12px;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .interval-visual {
        height: 24px;
        border-radius: 4px;
        transition: width 0.3s;
      }

      .interval-visual.current {
        background: var(--secondary-text-color);
        opacity: 0.5;
      }

      .interval-visual.suggested {
        background: var(--primary-color);
      }

      .confidence-badge {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 3px;
        background: var(--divider-color);
      }

      .confidence-badge.high {
        background: #4caf50;
        color: white;
      }

      .confidence-badge.medium {
        background: #ff9800;
        color: white;
      }

      .confidence-badge.low {
        background: var(--secondary-text-color);
        color: white;
      }

      .recommendation-actions {
        display: flex;
        gap: 8px;
      }

      /* Seasonal Card Compact */
      .seasonal-card-compact {
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--divider-color);
      }

      .seasonal-card-compact h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
      }

      .seasonal-mini-chart {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        height: 60px;
        margin-bottom: 12px;
      }

      .seasonal-bar {
        flex: 1;
        border-radius: 2px 2px 0 0;
        transition: all 0.2s;
        cursor: pointer;
      }

      .seasonal-bar.low {
        background: #2196f3;
      }

      .seasonal-bar.normal {
        background: var(--secondary-text-color);
        opacity: 0.5;
      }

      .seasonal-bar.high {
        background: #ff9800;
      }

      .seasonal-bar.current {
        border: 2px solid var(--primary-color);
        box-sizing: border-box;
      }

      .seasonal-legend {
        display: flex;
        gap: 12px;
        font-size: 11px;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .legend-item .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .legend-item .dot.low {
        background: #2196f3;
      }

      .legend-item .dot.normal {
        background: var(--secondary-text-color);
        opacity: 0.5;
      }

      .legend-item .dot.high {
        background: #ff9800;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .kpi-bar {
          grid-template-columns: repeat(2, 1fr);
        }

        .two-column-layout {
          grid-template-columns: 1fr;
        }

        .task-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .task-header-actions {
          width: 100%;
          justify-content: flex-start;
        }
      }

      /* Cost/Duration Card with Toggle */
      .cost-duration-card {
        background: var(--card-background-color, #fff);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--divider-color);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .card-header h3 {
        margin: 0;
        font-size: 16px;
      }

      .toggle-buttons {
        display: flex;
        gap: 4px;
        background: var(--divider-color);
        border-radius: 4px;
        padding: 2px;
      }

      .toggle-btn {
        padding: 6px 12px;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        border-radius: 3px;
        font-size: 13px;
        transition: all 0.2s;
      }

      .toggle-btn:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      .toggle-btn.active {
        background: var(--primary-color);
        color: white;
      }

      /* ha-button handles variant="danger" natively */
    `],g([R({attribute:!1})],A.prototype,"hass",2),g([R({type:Boolean})],A.prototype,"narrow",2),g([R({attribute:!1})],A.prototype,"panel",2),g([v()],A.prototype,"_objects",2),g([v()],A.prototype,"_stats",2),g([v()],A.prototype,"_view",2),g([v()],A.prototype,"_selectedEntryId",2),g([v()],A.prototype,"_selectedTaskId",2),g([v()],A.prototype,"_filterStatus",2),g([v()],A.prototype,"_filterUser",2),g([v()],A.prototype,"_unsub",2),g([v()],A.prototype,"_sparklineTooltip",2),g([v()],A.prototype,"_historyFilter",2),g([v()],A.prototype,"_budget",2),g([v()],A.prototype,"_groups",2),g([v()],A.prototype,"_detailStatsData",2),g([v()],A.prototype,"_miniStatsData",2),g([v()],A.prototype,"_features",2),g([v()],A.prototype,"_activeTab",2),g([v()],A.prototype,"_costDurationToggle",2),g([v()],A.prototype,"_historyTimeRange",2),g([v()],A.prototype,"_historySearch",2),A=g([re("maintenance-supporter-panel")],A);export{A as MaintenanceSupporterPanel};
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
