var Se=Object.defineProperty;var Ae=Object.getOwnPropertyDescriptor;var g=(i,e,t,a)=>{for(var n=a>1?void 0:a?Ae(e,t):e,r=i.length-1,o;r>=0;r--)(o=i[r])&&(n=(a?o(e,t,n):o(n))||n);return a&&n&&Se(e,t,n),n};var U=globalThis,V=U.ShadowRoot&&(U.ShadyCSS===void 0||U.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol(),re=new WeakMap,q=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==G)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(V&&e===void 0){let a=t!==void 0&&t.length===1;a&&(e=re.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&re.set(t,e))}return e}toString(){return this.cssText}},se=i=>new q(typeof i=="string"?i:i+"",void 0,G),k=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((a,n,r)=>a+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[r+1],i[0]);return new q(t,i,G)},le=(i,e)=>{if(V)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let a=document.createElement("style"),n=U.litNonce;n!==void 0&&a.setAttribute("nonce",n),a.textContent=t.cssText,i.appendChild(a)}},Z=V?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let a of e.cssRules)t+=a.cssText;return se(t)})(i):i;var{is:Ne,defineProperty:Ce,getOwnPropertyDescriptor:De,getOwnPropertyNames:Te,getOwnPropertySymbols:qe,getPrototypeOf:$e}=Object,B=globalThis,de=B.trustedTypes,Pe=de?de.emptyScript:"",Me=B.reactiveElementPolyfillSupport,$=(i,e)=>i,P={toAttribute(i,e){switch(e){case Boolean:i=i?Pe:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},H=(i,e)=>!Ne(i,e),_e={attribute:!0,type:String,converter:P,reflect:!1,useDefault:!1,hasChanged:H};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_e){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let a=Symbol(),n=this.getPropertyDescriptor(e,a,t);n!==void 0&&Ce(this.prototype,e,n)}}static getPropertyDescriptor(e,t,a){let{get:n,set:r}=De(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:n,set(o){let s=n?.call(this);r?.call(this,o),this.requestUpdate(e,s,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_e}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;let e=$e(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){let t=this.properties,a=[...Te(t),...qe(t)];for(let n of a)this.createProperty(n,t[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[a,n]of t)this.elementProperties.set(a,n)}this._$Eh=new Map;for(let[t,a]of this.elementProperties){let n=this._$Eu(t,a);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let a=new Set(e.flat(1/0).reverse());for(let n of a)t.unshift(Z(n))}else e!==void 0&&t.push(Z(e));return t}static _$Eu(e,t){let a=t.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return le(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){let a=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,a);if(n!==void 0&&a.reflect===!0){let r=(a.converter?.toAttribute!==void 0?a.converter:P).toAttribute(t,a.type);this._$Em=e,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){let a=this.constructor,n=a._$Eh.get(e);if(n!==void 0&&this._$Em!==n){let r=a.getPropertyOptions(n),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:P;this._$Em=n;let s=o.fromAttribute(t,r.type);this[n]=s??this._$Ej?.get(n)??s,this._$Em=null}}requestUpdate(e,t,a,n=!1,r){if(e!==void 0){let o=this.constructor;if(n===!1&&(r=this[e]),a??=o.getPropertyOptions(e),!((a.hasChanged??H)(r,t)||a.useDefault&&a.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,a))))return;this.C(e,t,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:n,wrapped:r},o){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),n===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let a=this.constructor.elementProperties;if(a.size>0)for(let[n,r]of a){let{wrapped:o}=r,s=this[n];o!==!0||this._$AL.has(n)||s===void 0||this.C(n,void 0,r,s)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(a=>a.hostUpdate?.()),this.update(t)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[$("elementProperties")]=new Map,w[$("finalized")]=new Map,Me?.({ReactiveElement:w}),(B.reactiveElementVersions??=[]).push("2.1.2");var ae=globalThis,ce=i=>i,W=ae.trustedTypes,ue=W?W.createPolicy("lit-html",{createHTML:i=>i}):void 0,ve="$lit$",j=`lit$${Math.random().toFixed(9).slice(2)}$`,be="?"+j,Fe=`<${be}>`,N=document,F=()=>N.createComment(""),I=i=>i===null||typeof i!="object"&&typeof i!="function",ne=Array.isArray,Ie=i=>ne(i)||typeof i?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pe=/-->/g,ge=/>/g,S=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),me=/'/g,he=/"/g,ye=/^(?:script|style|textarea|title)$/i,ie=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),m=ie(1),ct=ie(2),ut=ie(3),C=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),fe=new WeakMap,A=N.createTreeWalker(N,129);function ke(i,e){if(!ne(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ue!==void 0?ue.createHTML(e):e}var Oe=(i,e)=>{let t=i.length-1,a=[],n,r=e===2?"<svg>":e===3?"<math>":"",o=M;for(let s=0;s<t;s++){let l=i[s],u,p,d=-1,v=0;for(;v<l.length&&(o.lastIndex=v,p=o.exec(l),p!==null);)v=o.lastIndex,o===M?p[1]==="!--"?o=pe:p[1]!==void 0?o=ge:p[2]!==void 0?(ye.test(p[2])&&(n=RegExp("</"+p[2],"g")),o=S):p[3]!==void 0&&(o=S):o===S?p[0]===">"?(o=n??M,d=-1):p[1]===void 0?d=-2:(d=o.lastIndex-p[2].length,u=p[1],o=p[3]===void 0?S:p[3]==='"'?he:me):o===he||o===me?o=S:o===pe||o===ge?o=M:(o=S,n=void 0);let z=o===S&&i[s+1].startsWith("/>")?" ":"";r+=o===M?l+Fe:d>=0?(a.push(u),l.slice(0,d)+ve+l.slice(d)+j+z):l+j+(d===-2?s:z)}return[ke(i,r+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),a]},O=class i{constructor({strings:e,_$litType$:t},a){let n;this.parts=[];let r=0,o=0,s=e.length-1,l=this.parts,[u,p]=Oe(e,t);if(this.el=i.createElement(u,a),A.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=A.nextNode())!==null&&l.length<s;){if(n.nodeType===1){if(n.hasAttributes())for(let d of n.getAttributeNames())if(d.endsWith(ve)){let v=p[o++],z=n.getAttribute(d).split(j),L=/([.?@])?(.*)/.exec(v);l.push({type:1,index:r,name:L[2],strings:z,ctor:L[1]==="."?Y:L[1]==="?"?X:L[1]==="@"?ee:T}),n.removeAttribute(d)}else d.startsWith(j)&&(l.push({type:6,index:r}),n.removeAttribute(d));if(ye.test(n.tagName)){let d=n.textContent.split(j),v=d.length-1;if(v>0){n.textContent=W?W.emptyScript:"";for(let z=0;z<v;z++)n.append(d[z],F()),A.nextNode(),l.push({type:2,index:++r});n.append(d[v],F())}}}else if(n.nodeType===8)if(n.data===be)l.push({type:2,index:r});else{let d=-1;for(;(d=n.data.indexOf(j,d+1))!==-1;)l.push({type:7,index:r}),d+=j.length-1}r++}}static createElement(e,t){let a=N.createElement("template");return a.innerHTML=e,a}};function D(i,e,t=i,a){if(e===C)return e;let n=a!==void 0?t._$Co?.[a]:t._$Cl,r=I(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(i),n._$AT(i,t,a)),a!==void 0?(t._$Co??=[])[a]=n:t._$Cl=n),n!==void 0&&(e=D(i,n._$AS(i,e.values),n,a)),e}var Q=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:a}=this._$AD,n=(e?.creationScope??N).importNode(t,!0);A.currentNode=n;let r=A.nextNode(),o=0,s=0,l=a[0];for(;l!==void 0;){if(o===l.index){let u;l.type===2?u=new R(r,r.nextSibling,this,e):l.type===1?u=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(u=new te(r,this,e)),this._$AV.push(u),l=a[++s]}o!==l?.index&&(r=A.nextNode(),o++)}return A.currentNode=N,n}p(e){let t=0;for(let a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}},R=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,n){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=D(this,e,t),I(e)?e===c||e==null||e===""?(this._$AH!==c&&this._$AR(),this._$AH=c):e!==this._$AH&&e!==C&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ie(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==c&&I(this._$AH)?this._$AA.nextSibling.data=e:this.T(N.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:a}=e,n=typeof a=="number"?this._$AC(e):(a.el===void 0&&(a.el=O.createElement(ke(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===n)this._$AH.p(t);else{let r=new Q(n,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=fe.get(e.strings);return t===void 0&&fe.set(e.strings,t=new O(e)),t}k(e){ne(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,a,n=0;for(let r of e)n===t.length?t.push(a=new i(this.O(F()),this.O(F()),this,this.options)):a=t[n],a._$AI(r),n++;n<t.length&&(this._$AR(a&&a._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let a=ce(e).nextSibling;ce(e).remove(),e=a}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,n,r){this.type=1,this._$AH=c,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=c}_$AI(e,t=this,a,n){let r=this.strings,o=!1;if(r===void 0)e=D(this,e,t,0),o=!I(e)||e!==this._$AH&&e!==C,o&&(this._$AH=e);else{let s=e,l,u;for(e=r[0],l=0;l<r.length-1;l++)u=D(this,s[a+l],t,l),u===C&&(u=this._$AH[l]),o||=!I(u)||u!==this._$AH[l],u===c?e=c:e!==c&&(e+=(u??"")+r[l+1]),this._$AH[l]=u}o&&!n&&this.j(e)}j(e){e===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Y=class extends T{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===c?void 0:e}},X=class extends T{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==c)}},ee=class extends T{constructor(e,t,a,n,r){super(e,t,a,n,r),this.type=5}_$AI(e,t=this){if((e=D(this,e,t,0)??c)===C)return;let a=this._$AH,n=e===c&&a!==c||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,r=e!==c&&(a===c||n);n&&this.element.removeEventListener(this.name,this,a),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},te=class{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){D(this,e)}};var Re=ae.litHtmlPolyfillSupport;Re?.(O,R),(ae.litHtmlVersions??=[]).push("3.3.2");var we=(i,e,t)=>{let a=t?.renderBefore??e,n=a._$litPart$;if(n===void 0){let r=t?.renderBefore??null;a._$litPart$=n=new R(e.insertBefore(F(),r),r,void 0,t??{})}return n._$AI(i),n};var oe=globalThis,y=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=we(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};y._$litElement$=!0,y.finalized=!0,oe.litElementHydrateSupport?.({LitElement:y});var Le=oe.litElementPolyfillSupport;Le?.({LitElement:y});(oe.litElementVersions??=[]).push("4.2.2");var Ue={attribute:!0,type:String,converter:P,reflect:!1,hasChanged:H},Ve=(i=Ue,e,t)=>{let{kind:a,metadata:n}=t,r=globalThis.litPropertyMetadata.get(n);if(r===void 0&&globalThis.litPropertyMetadata.set(n,r=new Map),a==="setter"&&((i=Object.create(i)).wrapped=!0),r.set(t.name,i),a==="accessor"){let{name:o}=t;return{set(s){let l=e.get.call(this);e.set.call(this,s),this.requestUpdate(o,l,i,!0,s)},init(s){return s!==void 0&&this.C(o,void 0,i,s),s}}}if(a==="setter"){let{name:o}=t;return function(s){let l=this[o];e.call(this,s),this.requestUpdate(o,l,i,!0,s)}}throw Error("Unsupported decorator location: "+a)};function b(i){return(e,t)=>typeof t=="object"?Ve(i,e,t):((a,n,r)=>{let o=n.hasOwnProperty(r);return n.constructor.createProperty(r,a),o?Object.getOwnPropertyDescriptor(n,r):void 0})(i,e,t)}function f(i){return b({...i,state:!0,attribute:!1})}var ze={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"#ff5722"};var Be={maintenance:"Wartung",objects:"Objekte",tasks:"Aufgaben",overdue:"\xDCberf\xE4llig",due_soon:"Bald f\xE4llig",triggered:"Ausgel\xF6st",ok:"OK",all:"Alle",new_object:"+ Neues Objekt",edit:"Bearbeiten",delete:"L\xF6schen",add_task:"+ Aufgabe",complete:"Erledigt",completed:"Abgeschlossen",skip:"\xDCberspringen",skipped:"\xDCbersprungen",reset:"Zur\xFCcksetzen",cancel:"Abbrechen",completing:"Wird erledigt\u2026",interval:"Intervall",warning:"Vorwarnung",last_performed:"Zuletzt durchgef\xFChrt",next_due:"N\xE4chste F\xE4lligkeit",days_until_due:"Tage bis f\xE4llig",avg_duration:"\xD8 Dauer",trigger:"Trigger",trigger_type:"Trigger-Typ",threshold_above:"Obergrenze",threshold_below:"Untergrenze",threshold:"Schwellwert",counter:"Z\xE4hler",state_change:"Zustands\xE4nderung",runtime:"Laufzeit",runtime_hours:"Ziel-Laufzeit (Stunden)",target_value:"Zielwert",baseline:"Nulllinie",target_changes:"Ziel-\xC4nderungen",for_minutes:"F\xFCr (Minuten)",time_based:"Zeitbasiert",sensor_based:"Sensorbasiert",manual:"Manuell",cleaning:"Reinigung",inspection:"Inspektion",replacement:"Austausch",calibration:"Kalibrierung",service:"Service",custom:"Benutzerdefiniert",history:"Verlauf",cost:"Kosten",duration:"Dauer",both:"Beides",trigger_val:"Trigger-Wert",complete_title:"Erledigt: ",checklist:"Checkliste",checklist_steps_optional:"Checkliste-Schritte (optional)",checklist_placeholder:`Filter reinigen
Dichtung ersetzen
Druck testen`,checklist_help:"Ein Schritt pro Zeile. Max. 100 Eintr\xE4ge.",err_too_long:"{field}: zu lang (max. {n} Zeichen)",err_too_short:"{field}: zu kurz (min. {n} Zeichen)",err_value_too_high:"{field}: zu gro\xDF (max. {n})",err_value_too_low:"{field}: zu klein (min. {n})",err_required:"{field}: Pflichtfeld",err_wrong_type:"{field}: falscher Typ (erwartet: {type})",err_invalid_choice:"{field}: nicht erlaubter Wert",err_invalid_value:"{field}: ung\xFCltiger Wert",feat_schedule_time:"Uhrzeit-Scheduling",feat_schedule_time_desc:"Tasks werden zu einer festen Uhrzeit f\xE4llig statt um Mitternacht.",schedule_time_optional:"F\xE4llig um (optional, HH:MM)",schedule_time_help:"Leer = Mitternacht (Default). HA-Zeitzone.",at_time:"um",notes_optional:"Notizen (optional)",cost_optional:"Kosten (optional)",duration_minutes:"Dauer in Minuten (optional)",days:"Tage",day:"Tag",today:"Heute",d_overdue:"T \xFCberf\xE4llig",no_tasks:"Keine Wartungsaufgaben vorhanden. Erstellen Sie ein Objekt um zu beginnen.",no_tasks_short:"Keine Aufgaben",no_history:"Noch keine Verlaufseintr\xE4ge.",show_all:"Alle anzeigen",cost_duration_chart:"Kosten & Dauer",installed:"Installiert",confirm_delete_object:"Dieses Objekt und alle zugeh\xF6rigen Aufgaben l\xF6schen?",confirm_delete_task:"Diese Aufgabe wirklich l\xF6schen?",min:"Min",max:"Max",save:"Speichern",saving:"Speichern\u2026",edit_task:"Aufgabe bearbeiten",new_task:"Neue Wartungsaufgabe",task_name:"Aufgabenname",maintenance_type:"Wartungstyp",schedule_type:"Planungsart",interval_days:"Intervall (Tage)",warning_days:"Warntage",last_performed_optional:"Zuletzt durchgef\xFChrt (optional)",interval_anchor:"Intervall-Anker",anchor_completion:"Ab Erledigung",anchor_planned:"Ab geplantem Datum (kein Drift)",edit_object:"Objekt bearbeiten",name:"Name",manufacturer_optional:"Hersteller (optional)",model_optional:"Modell (optional)",serial_number_optional:"Seriennummer (optional)",serial_number_label:"S/N",sort_due_date:"F\xE4lligkeit",sort_object:"Objekt-Name",sort_type:"Typ",sort_task_name:"Aufgaben-Name",all_objects:"Alle Objekte",tasks_lower:"Aufgaben",no_tasks_yet:"Noch keine Aufgaben",add_first_task:"Erste Aufgabe hinzuf\xFCgen",trigger_configuration:"Trigger-Konfiguration",entity_id:"Entit\xE4ts-ID",comma_separated:"kommagetrennt",entity_logic:"Entit\xE4ts-Logik",entity_logic_any:"Beliebige Entit\xE4t l\xF6st aus",entity_logic_all:"Alle Entit\xE4ten m\xFCssen ausl\xF6sen",entities:"Entit\xE4ten",attribute_optional:"Attribut (optional, leer = Zustand)",use_entity_state:"Entit\xE4ts-Zustand verwenden (kein Attribut)",trigger_above:"Ausl\xF6sen wenn \xFCber",trigger_below:"Ausl\xF6sen wenn unter",for_at_least_minutes:"F\xFCr mindestens (Minuten)",safety_interval_days:"Sicherheitsintervall (Tage, optional)",delta_mode:"Delta-Modus",from_state_optional:"Von Zustand (optional)",to_state_optional:"Zu Zustand (optional)",documentation_url_optional:"Dokumentation URL (optional)",nfc_tag_id_optional:"NFC-Tag-ID (optional)",environmental_entity_optional:"Umgebungs-Sensor (optional)",environmental_entity_helper:"z.B. sensor.aussentemperatur \u2014 passt das Intervall an Umgebungswerte an",environmental_attribute_optional:"Umgebungs-Attribut (optional)",nfc_tag_id:"NFC-Tag-ID",nfc_linked:"NFC-Tag verkn\xFCpft",nfc_link_hint:"Klicken um NFC-Tag zu verkn\xFCpfen",responsible_user:"Verantwortlicher Benutzer",no_user_assigned:"(Kein Benutzer zugewiesen)",all_users:"Alle Benutzer",my_tasks:"Meine Aufgaben",budget_monthly:"Monatsbudget",budget_yearly:"Jahresbudget",groups:"Gruppen",new_group:"Neue Gruppe",edit_group:"Gruppe bearbeiten",no_groups:"Keine Gruppen vorhanden",delete_group:"Gruppe l\xF6schen",delete_group_confirm:"Gruppe '{name}' wirklich l\xF6schen?",group_select_tasks:"Aufgaben ausw\xE4hlen",group_name_required:"Name erforderlich",description_optional:"Beschreibung (optional)",selected:"Ausgew\xE4hlt",loading_chart:"Daten werden geladen...",was_maintenance_needed:"War diese Wartung n\xF6tig?",feedback_needed:"N\xF6tig",feedback_not_needed:"Nicht n\xF6tig",feedback_not_sure:"Unsicher",suggested_interval:"Empfohlenes Intervall",apply_suggestion:"\xDCbernehmen",reanalyze:"Neu analysieren",reanalyze_result:"Neue Analyse",reanalyze_insufficient_data:"Nicht gen\xFCgend Daten f\xFCr eine Empfehlung",data_points:"Datenpunkte",dismiss_suggestion:"Verwerfen",confidence_low:"Niedrig",confidence_medium:"Mittel",confidence_high:"Hoch",recommended:"empfohlen",seasonal_awareness:"Saisonale Anpassung",edit_seasonal_overrides:"Saison-Faktoren bearbeiten",seasonal_overrides_title:"Saisonale Faktoren (Override)",seasonal_overrides_hint:"Faktor pro Monat (0.1\u20135.0). Leer = automatisch gelernt.",seasonal_override_invalid:"Ung\xFCltiger Wert",seasonal_override_range:"Faktor muss zwischen 0.1 und 5.0 liegen",clear_all:"Alle zur\xFCcksetzen",seasonal_chart_title:"Saisonale Faktoren",seasonal_learned:"Gelernt",seasonal_manual:"Manuell",month_jan:"Jan",month_feb:"Feb",month_mar:"M\xE4r",month_apr:"Apr",month_may:"Mai",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dez",sensor_prediction:"Sensorvorhersage",degradation_trend:"Trend",trend_rising:"Steigend",trend_falling:"Fallend",trend_stable:"Stabil",trend_insufficient_data:"Unzureichende Daten",days_until_threshold:"Tage bis Schwellwert",threshold_exceeded:"Schwellwert \xFCberschritten",environmental_adjustment:"Umgebungsfaktor",sensor_prediction_urgency:"Sensor prognostiziert Schwellwert in ~{days} Tagen",day_short:"Tag",weibull_reliability_curve:"Zuverl\xE4ssigkeitskurve",weibull_failure_probability:"Ausfallwahrscheinlichkeit",weibull_r_squared:"G\xFCte R\xB2",beta_early_failures:"Fr\xFChausf\xE4lle",beta_random_failures:"Zuf\xE4llige Ausf\xE4lle",beta_wear_out:"Verschlei\xDF",beta_highly_predictable:"Hochvorhersagbar",confidence_interval:"Konfidenzintervall",confidence_conservative:"Konservativ",confidence_aggressive:"Optimistisch",current_interval_marker:"Aktuelles Intervall",recommended_marker:"Empfohlen",characteristic_life:"Charakteristische Lebensdauer",chart_mini_sparkline:"Trend-Sparkline",chart_history:"Kosten- und Dauer-Verlauf",chart_seasonal:"Saisonfaktoren, 12 Monate",chart_weibull:"Weibull-Zuverl\xE4ssigkeitskurve",chart_sparkline:"Sensor-Triggerwert-Verlauf",days_progress:"Tagesfortschritt",qr_code:"QR-Code",qr_generating:"QR-Code wird generiert\u2026",qr_error:"QR-Code konnte nicht generiert werden.",qr_error_no_url:"Keine HA-URL konfiguriert. Bitte unter Einstellungen \u2192 System \u2192 Netzwerk eine externe oder interne URL setzen.",save_error:"Fehler beim Speichern. Bitte erneut versuchen.",qr_print:"Drucken",qr_download:"SVG herunterladen",qr_action:"Aktion beim Scannen",qr_action_view:"Wartungsinfo anzeigen",qr_action_complete:"Wartung als erledigt markieren",qr_url_mode:"Link-Typ",qr_mode_companion:"Companion App",qr_mode_local:"Lokal (mDNS)",qr_mode_server:"Server-URL",overview:"\xDCbersicht",analysis:"Analyse",recent_activities:"Letzte Aktivit\xE4ten",search_notes:"Notizen durchsuchen",avg_cost:"\xD8 Kosten",no_advanced_features:"Keine erweiterten Funktionen aktiviert",no_advanced_features_hint:"Aktiviere \u201EAdaptive Intervalle\u201C oder \u201ESaisonale Muster\u201C in den Integrationseinstellungen, um hier Analysedaten zu sehen.",analysis_not_enough_data:"Noch nicht gen\xFCgend Daten f\xFCr die Analyse vorhanden.",analysis_not_enough_data_hint:"Die Weibull-Analyse ben\xF6tigt mindestens 5 abgeschlossene Wartungen, saisonale Muster werden nach 6+ Datenpunkten pro Monat sichtbar.",analysis_manual_task_hint:"Manuelle Aufgaben ohne Intervall erzeugen keine Analysedaten.",completions:"Abschl\xFCsse",current:"Aktuell",shorter:"K\xFCrzer",longer:"L\xE4nger",normal:"Normal",disabled:"Deaktiviert",compound_logic:"Verkn\xFCpfungslogik",card_title:"Titel",card_show_header:"Kopfzeile mit Statistiken anzeigen",card_show_actions:"Aktionsbuttons anzeigen",card_compact:"Kompaktmodus",card_max_items:"Max. Eintr\xE4ge (0 = alle)",card_filter_status:"Nach Status filtern",card_filter_status_help:"Leer = alle Status zeigen.",card_filter_objects:"Nach Objekten filtern",card_filter_objects_help:"Leer = alle Objekte zeigen.",card_filter_entities:"Nach Entit\xE4ten filtern (entity_ids)",card_filter_entities_help:"W\xE4hle Sensor-/Binary-Sensor-Entit\xE4ten dieser Integration. Leer = alle.",card_loading_objects:"Lade Objekte\u2026",no_objects:"Keine Objekte vorhanden.",action_error:"Aktion fehlgeschlagen. Bitte erneut versuchen.",area_id_optional:"Bereich (optional)",installation_date_optional:"Installationsdatum (optional)",custom_icon_optional:"Icon (optional, z.B. mdi:wrench)",task_enabled:"Aufgabe aktiviert",skip_reason_prompt:"Aufgabe \xFCberspringen?",reason_optional:"Grund (optional)",reset_date_prompt:"Aufgabe als ausgef\xFChrt markieren?",reset_date_optional:"Letztes Erledigungs-Datum (optional, Standard: heute)",notes_label:"Notizen",documentation_label:"Dokumentation",no_nfc_tag:"\u2014 Kein Tag \u2014",dashboard:"Dashboard",settings:"Einstellungen",settings_features:"Erweiterte Funktionen",settings_features_desc:"Erweiterte Funktionen ein- oder ausschalten. Deaktivieren blendet sie in der Oberfl\xE4che aus, l\xF6scht aber keine Daten.",feat_adaptive:"Adaptive Intervalle",feat_adaptive_desc:"Optimale Intervalle aus Wartungshistorie lernen",feat_predictions:"Sensorvorhersagen",feat_predictions_desc:"Trigger-Datum anhand von Sensordegradation vorhersagen",feat_seasonal:"Saisonale Anpassungen",feat_seasonal_desc:"Intervalle basierend auf saisonalen Mustern anpassen",feat_environmental:"Umgebungskorrelation",feat_environmental_desc:"Intervalle mit Temperatur/Luftfeuchtigkeit korrelieren",feat_budget:"Budgetverfolgung",feat_budget_desc:"Monatliche und j\xE4hrliche Wartungsausgaben verfolgen",feat_groups:"Aufgabengruppen",feat_groups_desc:"Aufgaben in logische Gruppen organisieren",feat_checklists:"Checklisten",feat_checklists_desc:"Mehrstufige Verfahren zur Aufgabenerlediung",settings_general:"Allgemein",settings_default_warning:"Standard-Warntage",settings_panel_enabled:"Seitenleisten-Panel",settings_notifications:"Benachrichtigungen",settings_notify_service:"Benachrichtigungsdienst",test_notification:"Test-Benachrichtigung",send_test:"Test senden",testing:"Sende\u2026",test_notification_success:"Test-Benachrichtigung gesendet",test_notification_failed:"Test-Benachrichtigung fehlgeschlagen",settings_notify_due_soon:"Bei baldiger F\xE4lligkeit benachrichtigen",settings_notify_overdue:"Bei \xDCberf\xE4lligkeit benachrichtigen",settings_notify_triggered:"Bei Ausl\xF6sung benachrichtigen",settings_interval_hours:"Wiederholungsintervall (Stunden, 0 = einmalig)",settings_quiet_hours:"Ruhezeiten",settings_quiet_start:"Beginn",settings_quiet_end:"Ende",settings_max_per_day:"Max. Benachrichtigungen pro Tag (0 = unbegrenzt)",settings_bundling:"Benachrichtigungen b\xFCndeln",settings_bundle_threshold:"B\xFCndelungsschwelle",settings_actions:"Mobile Aktionsbuttons",settings_action_complete:'"Erledigt"-Button anzeigen',settings_action_skip:'"\xDCberspringen"-Button anzeigen',settings_action_snooze:'"Schlummern"-Button anzeigen',settings_snooze_hours:"Schlummerdauer (Stunden)",settings_budget:"Budget",settings_currency:"W\xE4hrung",settings_budget_monthly:"Monatsbudget",settings_budget_yearly:"Jahresbudget",settings_budget_alerts:"Budget-Warnungen",settings_budget_threshold:"Warnschwelle (%)",settings_import_export:"Import / Export",settings_export_json:"JSON exportieren",settings_export_csv:"CSV exportieren",settings_import_csv:"CSV importieren",settings_import_placeholder:"JSON- oder CSV-Inhalt hier einf\xFCgen\u2026",settings_import_btn:"Importieren",settings_import_success:"{count} Objekte erfolgreich importiert.",settings_export_success:"Export heruntergeladen.",settings_saved:"Einstellung gespeichert.",settings_include_history:"Verlauf einbeziehen",sort_alphabetical:"Alphabetisch",sort_due_soonest:"Fr\xFChestens f\xE4llig",sort_task_count:"Aufgaben-Anzahl",sort_area:"Bereich",sort_assigned_user:"Verantwortlicher",sort_group:"Gruppe",groupby_none:"Keine Gruppierung",groupby_area:"Nach Bereich",groupby_group:"Nach Gruppe",groupby_user:"Nach Verantwortlichem",unassigned:"Nicht zugewiesen",no_area:"Kein Bereich",has_overdue:"\xDCberf\xE4llige Aufgaben",object:"Objekt",settings_panel_access:"Panel-Zugriff",settings_panel_access_desc:"Admins sehen immer das vollst\xE4ndige Panel. W\xE4hle hier Non-Admin-User aus, die ebenfalls Vollzugriff bekommen sollen \u2014 alle anderen Non-Admins sehen nur Abhaken/\xDCberspringen.",no_non_admin_users:"Keine Non-Admin-User gefunden. Lege welche unter Einstellungen \u2192 Personen an.",owner_label:"Owner"},He={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",ok:"OK",all:"All",new_object:"+ New Object",edit:"Edit",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",reset:"Reset",cancel:"Cancel",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",runtime_hours:"Target runtime (hours)",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",custom:"Custom",history:"History",cost:"Cost",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_optional:"Due at time (optional, HH:MM)",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",tasks_lower:"tasks",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",no_advanced_features_hint:"Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",completions:"completions",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",installation_date_optional:"Installation date (optional)",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_predictions:"Sensor Predictions",feat_predictions_desc:"Predict trigger dates from sensor degradation",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_panel_enabled:"Sidebar panel",settings_notifications:"Notifications",settings_notify_service:"Notification service",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_snooze_hours:"Snooze duration (hours)",settings_budget:"Budget",settings_currency:"Currency",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_csv:"Export CSV",settings_import_csv:"Import CSV",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always see the full panel. Pick non-admin users below who should also get full panel access \u2014 every other non-admin sees only Complete and Skip.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner"},We={maintenance:"Onderhoud",objects:"Objecten",tasks:"Taken",overdue:"Achterstallig",due_soon:"Binnenkort",triggered:"Geactiveerd",ok:"OK",all:"Alle",new_object:"+ Nieuw object",edit:"Bewerken",delete:"Verwijderen",add_task:"+ Taak",complete:"Voltooid",completed:"Voltooid",skip:"Overslaan",skipped:"Overgeslagen",reset:"Resetten",cancel:"Annuleren",completing:"Wordt voltooid\u2026",interval:"Interval",warning:"Waarschuwing",last_performed:"Laatst uitgevoerd",next_due:"Volgende keer",days_until_due:"Dagen tot vervaldatum",avg_duration:"\xD8 Duur",trigger:"Trigger",trigger_type:"Triggertype",threshold_above:"Bovengrens",threshold_below:"Ondergrens",threshold:"Drempelwaarde",counter:"Teller",state_change:"Statuswijziging",runtime:"Looptijd",runtime_hours:"Doellooptijd (uren)",target_value:"Doelwaarde",baseline:"Basislijn",target_changes:"Doelwijzigingen",for_minutes:"Voor (minuten)",time_based:"Tijdgebaseerd",sensor_based:"Sensorgebaseerd",manual:"Handmatig",cleaning:"Reiniging",inspection:"Inspectie",replacement:"Vervanging",calibration:"Kalibratie",service:"Service",custom:"Aangepast",history:"Geschiedenis",cost:"Kosten",duration:"Duur",both:"Beide",trigger_val:"Triggerwaarde",complete_title:"Voltooid: ",checklist:"Checklist",checklist_steps_optional:"Checklist-stappen (optioneel)",checklist_placeholder:`Filter schoonmaken
Pakking vervangen
Druk testen`,checklist_help:"E\xE9n stap per regel. Max. 100 items.",err_too_long:"{field}: te lang (max. {n} tekens)",err_too_short:"{field}: te kort (min. {n} tekens)",err_value_too_high:"{field}: te groot (max. {n})",err_value_too_low:"{field}: te klein (min. {n})",err_required:"{field}: verplicht",err_wrong_type:"{field}: verkeerd type (verwacht: {type})",err_invalid_choice:"{field}: niet-toegestane waarde",err_invalid_value:"{field}: ongeldige waarde",feat_schedule_time:"Tijd-van-dag-planning",feat_schedule_time_desc:"Taken vervallen op een specifieke tijd in plaats van middernacht.",schedule_time_optional:"Vervaldagstijd (optioneel, HH:MM)",schedule_time_help:"Leeg = middernacht (standaard). HA-tijdzone.",at_time:"om",notes_optional:"Notities (optioneel)",cost_optional:"Kosten (optioneel)",duration_minutes:"Duur in minuten (optioneel)",days:"dagen",day:"dag",today:"Vandaag",d_overdue:"d achterstallig",no_tasks:"Geen onderhoudstaken. Maak een object aan om te beginnen.",no_tasks_short:"Geen taken",no_history:"Nog geen geschiedenisitems.",show_all:"Alles tonen",cost_duration_chart:"Kosten & Duur",installed:"Ge\xEFnstalleerd",confirm_delete_object:"Dit object en alle bijbehorende taken verwijderen?",confirm_delete_task:"Deze taak verwijderen?",min:"Min",max:"Max",save:"Opslaan",saving:"Opslaan\u2026",edit_task:"Taak bewerken",new_task:"Nieuwe onderhoudstaak",task_name:"Taaknaam",maintenance_type:"Onderhoudstype",schedule_type:"Planningstype",interval_days:"Interval (dagen)",warning_days:"Waarschuwingsdagen",last_performed_optional:"Laatst uitgevoerd (optioneel)",interval_anchor:"Interval-anker",anchor_completion:"Vanaf voltooiing",anchor_planned:"Vanaf geplande datum (geen drift)",edit_object:"Object bewerken",name:"Naam",manufacturer_optional:"Fabrikant (optioneel)",model_optional:"Model (optioneel)",serial_number_optional:"Serienummer (optioneel)",serial_number_label:"S/N",sort_due_date:"Vervaldatum",sort_object:"Objectnaam",sort_type:"Type",sort_task_name:"Taaknaam",all_objects:"Alle objecten",tasks_lower:"taken",no_tasks_yet:"Nog geen taken",add_first_task:"Eerste taak toevoegen",trigger_configuration:"Triggerconfiguratie",entity_id:"Entiteits-ID",comma_separated:"kommagescheiden",entity_logic:"Entiteitslogica",entity_logic_any:"Elke entiteit triggert",entity_logic_all:"Alle entiteiten moeten triggeren",entities:"entiteiten",attribute_optional:"Attribuut (optioneel, leeg = status)",use_entity_state:"Entiteitsstatus gebruiken (geen attribuut)",trigger_above:"Activeren als boven",trigger_below:"Activeren als onder",for_at_least_minutes:"Voor minstens (minuten)",safety_interval_days:"Veiligheidsinterval (dagen, optioneel)",delta_mode:"Deltamodus",from_state_optional:"Van status (optioneel)",to_state_optional:"Naar status (optioneel)",documentation_url_optional:"Documentatie-URL (optioneel)",nfc_tag_id_optional:"NFC-tag-ID (optioneel)",environmental_entity_optional:"Omgevingssensor (optioneel)",environmental_entity_helper:"bv. sensor.buitentemperatuur \u2014 past het interval aan op basis van omgevingswaarden",environmental_attribute_optional:"Omgevingsattribuut (optioneel)",nfc_tag_id:"NFC-tag-ID",nfc_linked:"NFC-tag gekoppeld",nfc_link_hint:"Klik om NFC-tag te koppelen",responsible_user:"Verantwoordelijke gebruiker",no_user_assigned:"(Geen gebruiker toegewezen)",all_users:"Alle gebruikers",my_tasks:"Mijn taken",budget_monthly:"Maandbudget",budget_yearly:"Jaarbudget",groups:"Groepen",new_group:"Nieuwe groep",edit_group:"Groep bewerken",no_groups:"Nog geen groepen",delete_group:"Groep verwijderen",delete_group_confirm:"Groep '{name}' verwijderen?",group_select_tasks:"Taken selecteren",group_name_required:"Naam vereist",description_optional:"Beschrijving (optioneel)",selected:"Geselecteerd",loading_chart:"Grafiekgegevens laden...",was_maintenance_needed:"Was dit onderhoud nodig?",feedback_needed:"Nodig",feedback_not_needed:"Niet nodig",feedback_not_sure:"Niet zeker",suggested_interval:"Voorgesteld interval",apply_suggestion:"Toepassen",reanalyze:"Opnieuw analyseren",reanalyze_result:"Nieuwe analyse",reanalyze_insufficient_data:"Onvoldoende gegevens voor een aanbeveling",data_points:"datapunten",dismiss_suggestion:"Negeren",confidence_low:"Laag",confidence_medium:"Gemiddeld",confidence_high:"Hoog",recommended:"aanbevolen",seasonal_awareness:"Seizoensbewustzijn",edit_seasonal_overrides:"Seizoensfactoren bewerken",seasonal_overrides_title:"Seizoensfactoren (override)",seasonal_overrides_hint:"Factor per maand (0.1\u20135.0). Leeg = automatisch geleerd.",seasonal_override_invalid:"Ongeldige waarde",seasonal_override_range:"Factor moet tussen 0.1 en 5.0 liggen",clear_all:"Alles wissen",seasonal_chart_title:"Seizoensfactoren",seasonal_learned:"Geleerd",seasonal_manual:"Handmatig",month_jan:"Jan",month_feb:"Feb",month_mar:"Mrt",month_apr:"Apr",month_may:"Mei",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensorvoorspelling",degradation_trend:"Trend",trend_rising:"Stijgend",trend_falling:"Dalend",trend_stable:"Stabiel",trend_insufficient_data:"Onvoldoende gegevens",days_until_threshold:"Dagen tot drempelwaarde",threshold_exceeded:"Drempelwaarde overschreden",environmental_adjustment:"Omgevingsfactor",sensor_prediction_urgency:"Sensor voorspelt drempelwaarde in ~{days} dagen",day_short:"dag",weibull_reliability_curve:"Betrouwbaarheidscurve",weibull_failure_probability:"Faalkans",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Vroege uitval",beta_random_failures:"Willekeurige uitval",beta_wear_out:"Slijtage",beta_highly_predictable:"Zeer voorspelbaar",confidence_interval:"Betrouwbaarheidsinterval",confidence_conservative:"Conservatief",confidence_aggressive:"Optimistisch",current_interval_marker:"Huidig interval",recommended_marker:"Aanbevolen",characteristic_life:"Karakteristieke levensduur",chart_mini_sparkline:"Trend-sparkline",chart_history:"Kosten- en duurgeschiedenis",chart_seasonal:"Seizoensfactoren, 12 maanden",chart_weibull:"Weibull-betrouwbaarheidscurve",chart_sparkline:"Sensor-triggerwaardegrafiek",days_progress:"Dagenvoortgang",qr_code:"QR-code",qr_generating:"QR-code genereren\u2026",qr_error:"QR-code kon niet worden gegenereerd.",qr_error_no_url:"Geen HA-URL geconfigureerd. Stel een externe of interne URL in via Instellingen \u2192 Systeem \u2192 Netwerk.",save_error:"Opslaan mislukt. Probeer het opnieuw.",qr_print:"Afdrukken",qr_download:"SVG downloaden",qr_action:"Actie bij scannen",qr_action_view:"Onderhoudsinfo bekijken",qr_action_complete:"Onderhoud als voltooid markeren",qr_url_mode:"Linktype",qr_mode_companion:"Companion App",qr_mode_local:"Lokaal (mDNS)",qr_mode_server:"Server-URL",overview:"Overzicht",analysis:"Analyse",recent_activities:"Recente activiteiten",search_notes:"Notities doorzoeken",avg_cost:"\xD8 Kosten",no_advanced_features:"Geen geavanceerde functies ingeschakeld",no_advanced_features_hint:"Schakel \u201EAdaptieve Intervallen\u201D of \u201ESeizoenpatronen\u201D in via de integratie-instellingen om hier analysegegevens te zien.",analysis_not_enough_data:"Nog niet genoeg gegevens voor analyse.",analysis_not_enough_data_hint:"Weibull-analyse vereist minstens 5 voltooide onderhoudsbeurten; seizoenspatronen worden zichtbaar na 6+ datapunten per maand.",analysis_manual_task_hint:"Handmatige taken zonder interval genereren geen analysegegevens.",completions:"voltooiingen",current:"Huidig",shorter:"Korter",longer:"Langer",normal:"Normaal",disabled:"Uitgeschakeld",compound_logic:"Samengestelde logica",card_title:"Titel",card_show_header:"Koptekst met statistieken tonen",card_show_actions:"Actieknoppen tonen",card_compact:"Compacte modus",card_max_items:"Max items (0 = alle)",card_filter_status:"Filteren op status",card_filter_status_help:"Leeg = alle statussen tonen.",card_filter_objects:"Filteren op objecten",card_filter_objects_help:"Leeg = alle objecten tonen.",card_filter_entities:"Filteren op entiteiten (entity_ids)",card_filter_entities_help:"Kies sensor/binary_sensor entiteiten van deze integratie. Leeg = alle.",card_loading_objects:"Objecten laden\u2026",no_objects:"Nog geen objecten.",action_error:"Actie mislukt. Probeer het opnieuw.",area_id_optional:"Gebied (optioneel)",installation_date_optional:"Installatiedatum (optioneel)",custom_icon_optional:"Icoon (optioneel, bijv. mdi:wrench)",task_enabled:"Taak ingeschakeld",skip_reason_prompt:"Deze taak overslaan?",reason_optional:"Reden (optioneel)",reset_date_prompt:"Taak markeren als uitgevoerd?",reset_date_optional:"Laatste uitvoeringsdatum (optioneel, standaard vandaag)",notes_label:"Notities",documentation_label:"Documentatie",no_nfc_tag:"\u2014 Geen tag \u2014",dashboard:"Dashboard",settings:"Instellingen",settings_features:"Geavanceerde functies",settings_features_desc:"Schakel geavanceerde functies in of uit. Uitschakelen verbergt ze in de interface maar verwijdert geen gegevens.",feat_adaptive:"Adaptieve planning",feat_adaptive_desc:"Leer optimale intervallen uit onderhoudsgeschiedenis",feat_predictions:"Sensorvoorspellingen",feat_predictions_desc:"Voorspel triggerdatums op basis van sensordegradatie",feat_seasonal:"Seizoensaanpassingen",feat_seasonal_desc:"Pas intervallen aan op seizoenspatronen",feat_environmental:"Omgevingscorrelatie",feat_environmental_desc:"Correleer intervallen met temperatuur/vochtigheid",feat_budget:"Budgetbeheer",feat_budget_desc:"Volg maandelijkse en jaarlijkse onderhoudsuitgaven",feat_groups:"Taakgroepen",feat_groups_desc:"Organiseer taken in logische groepen",feat_checklists:"Checklists",feat_checklists_desc:"Meerstaps procedures voor taakvoltooiing",settings_general:"Algemeen",settings_default_warning:"Standaard waarschuwingsdagen",settings_panel_enabled:"Zijbalkpaneel",settings_notifications:"Meldingen",settings_notify_service:"Meldingsservice",test_notification:"Testmelding",send_test:"Test versturen",testing:"Verzenden\u2026",test_notification_success:"Testmelding verzonden",test_notification_failed:"Testmelding mislukt",settings_notify_due_soon:"Melding bij bijna verlopen",settings_notify_overdue:"Melding bij achterstallig",settings_notify_triggered:"Melding bij geactiveerd",settings_interval_hours:"Herhalingsinterval (uren, 0 = eenmalig)",settings_quiet_hours:"Stille uren",settings_quiet_start:"Start",settings_quiet_end:"Einde",settings_max_per_day:"Max meldingen per dag (0 = onbeperkt)",settings_bundling:"Meldingen bundelen",settings_bundle_threshold:"Bundeldrempel",settings_actions:"Mobiele actieknoppen",settings_action_complete:"Knop 'Voltooid' tonen",settings_action_skip:"Knop 'Overslaan' tonen",settings_action_snooze:"Knop 'Snooze' tonen",settings_snooze_hours:"Snoozeduur (uren)",settings_budget:"Budget",settings_currency:"Valuta",settings_budget_monthly:"Maandbudget",settings_budget_yearly:"Jaarbudget",settings_budget_alerts:"Budgetwaarschuwingen",settings_budget_threshold:"Waarschuwingsdrempel (%)",settings_import_export:"Import / Export",settings_export_json:"JSON exporteren",settings_export_csv:"CSV exporteren",settings_import_csv:"CSV importeren",settings_import_placeholder:"Plak JSON- of CSV-inhoud hier\u2026",settings_import_btn:"Importeren",settings_import_success:"{count} objecten succesvol ge\xEFmporteerd.",settings_export_success:"Export gedownload.",settings_saved:"Instelling opgeslagen.",settings_include_history:"Geschiedenis meenemen",sort_alphabetical:"Alfabetisch",sort_due_soonest:"Eerst vervallend",sort_task_count:"Aantal taken",sort_area:"Gebied",sort_assigned_user:"Toegewezen gebruiker",sort_group:"Groep",groupby_none:"Geen groepering",groupby_area:"Per gebied",groupby_group:"Per groep",groupby_user:"Per gebruiker",unassigned:"Niet toegewezen",no_area:"Geen gebied",has_overdue:"Heeft achterstallige taken",object:"Object",settings_panel_access:"Paneel-toegang",settings_panel_access_desc:"Admins zien altijd het volledige paneel. Kies hier niet-admin gebruikers die ook volledige toegang krijgen \u2014 andere niet-admins zien alleen Voltooien en Overslaan.",no_non_admin_users:"Geen niet-admin gebruikers gevonden. Voeg ze toe in Instellingen \u2192 Personen.",owner_label:"Eigenaar"},Ke={maintenance:"Maintenance",objects:"Objets",tasks:"T\xE2ches",overdue:"En retard",due_soon:"Bient\xF4t d\xFB",triggered:"D\xE9clench\xE9",ok:"OK",all:"Tous",new_object:"+ Nouvel objet",edit:"Modifier",delete:"Supprimer",add_task:"+ T\xE2che",complete:"Termin\xE9",completed:"Termin\xE9",skip:"Passer",skipped:"Ignor\xE9",reset:"R\xE9initialiser",cancel:"Annuler",completing:"En cours\u2026",interval:"Intervalle",warning:"Avertissement",last_performed:"Derni\xE8re ex\xE9cution",next_due:"Prochaine \xE9ch\xE9ance",days_until_due:"Jours restants",avg_duration:"\xD8 Dur\xE9e",trigger:"D\xE9clencheur",trigger_type:"Type de d\xE9clencheur",threshold_above:"Limite sup\xE9rieure",threshold_below:"Limite inf\xE9rieure",threshold:"Seuil",counter:"Compteur",state_change:"Changement d'\xE9tat",runtime:"Dur\xE9e de fonctionnement",runtime_hours:"Dur\xE9e cible (heures)",target_value:"Valeur cible",baseline:"Ligne de base",target_changes:"Changements cibles",for_minutes:"Pendant (minutes)",time_based:"Temporel",sensor_based:"Capteur",manual:"Manuel",cleaning:"Nettoyage",inspection:"Inspection",replacement:"Remplacement",calibration:"\xC9talonnage",service:"Service",custom:"Personnalis\xE9",history:"Historique",cost:"Co\xFBt",duration:"Dur\xE9e",both:"Les deux",trigger_val:"Valeur du d\xE9clencheur",complete_title:"Termin\xE9 : ",checklist:"Checklist",checklist_steps_optional:"\xC9tapes de la checklist (optionnel)",checklist_placeholder:`Nettoyer le filtre
Remplacer le joint
Tester la pression`,checklist_help:"Une \xE9tape par ligne. Max 100 \xE9l\xE9ments.",err_too_long:"{field} : trop long (max {n} caract\xE8res)",err_too_short:"{field} : trop court (min {n} caract\xE8res)",err_value_too_high:"{field} : trop grand (max {n})",err_value_too_low:"{field} : trop petit (min {n})",err_required:"{field} : champ obligatoire",err_wrong_type:"{field} : mauvais type (attendu : {type})",err_invalid_choice:"{field} : valeur non autoris\xE9e",err_invalid_value:"{field} : valeur invalide",feat_schedule_time:"Planification \xE0 l'heure",feat_schedule_time_desc:"Les t\xE2ches arrivent \xE0 \xE9ch\xE9ance \xE0 une heure pr\xE9cise plut\xF4t qu'\xE0 minuit.",schedule_time_optional:"\xC9ch\xE9ance \xE0 l'heure (optionnel, HH:MM)",schedule_time_help:"Vide = minuit (d\xE9faut). Fuseau horaire HA.",at_time:"\xE0",notes_optional:"Notes (optionnel)",cost_optional:"Co\xFBt (optionnel)",duration_minutes:"Dur\xE9e en minutes (optionnel)",days:"jours",day:"jour",today:"Aujourd'hui",d_overdue:"j en retard",no_tasks:"Aucune t\xE2che de maintenance. Cr\xE9ez un objet pour commencer.",no_tasks_short:"Aucune t\xE2che",no_history:"Aucun historique.",show_all:"Tout afficher",cost_duration_chart:"Co\xFBts & Dur\xE9e",installed:"Install\xE9",confirm_delete_object:"Supprimer cet objet et toutes ses t\xE2ches ?",confirm_delete_task:"Supprimer cette t\xE2che ?",min:"Min",max:"Max",save:"Enregistrer",saving:"Enregistrement\u2026",edit_task:"Modifier la t\xE2che",new_task:"Nouvelle t\xE2che de maintenance",task_name:"Nom de la t\xE2che",maintenance_type:"Type de maintenance",schedule_type:"Type de planification",interval_days:"Intervalle (jours)",warning_days:"Jours d'avertissement",last_performed_optional:"Derni\xE8re ex\xE9cution (optionnel)",interval_anchor:"Ancrage de l'intervalle",anchor_completion:"Depuis la date de r\xE9alisation",anchor_planned:"Depuis la date pr\xE9vue (sans d\xE9rive)",edit_object:"Modifier l'objet",name:"Nom",manufacturer_optional:"Fabricant (optionnel)",model_optional:"Mod\xE8le (optionnel)",serial_number_optional:"Num\xE9ro de s\xE9rie (optionnel)",serial_number_label:"N/S",sort_due_date:"\xC9ch\xE9ance",sort_object:"Nom de l'objet",sort_type:"Type",sort_task_name:"Nom de la t\xE2che",all_objects:"Tous les objets",tasks_lower:"t\xE2ches",no_tasks_yet:"Pas encore de t\xE2ches",add_first_task:"Ajouter la premi\xE8re t\xE2che",trigger_configuration:"Configuration du d\xE9clencheur",entity_id:"ID d'entit\xE9",comma_separated:"s\xE9par\xE9 par des virgules",entity_logic:"Logique d'entit\xE9",entity_logic_any:"N'importe quelle entit\xE9 d\xE9clenche",entity_logic_all:"Toutes les entit\xE9s doivent d\xE9clencher",entities:"entit\xE9s",attribute_optional:"Attribut (optionnel, vide = \xE9tat)",use_entity_state:"Utiliser l'\xE9tat de l'entit\xE9 (pas d'attribut)",trigger_above:"D\xE9clencher au-dessus de",trigger_below:"D\xE9clencher en dessous de",for_at_least_minutes:"Pendant au moins (minutes)",safety_interval_days:"Intervalle de s\xE9curit\xE9 (jours, optionnel)",delta_mode:"Mode delta",from_state_optional:"\xC9tat source (optionnel)",to_state_optional:"\xC9tat cible (optionnel)",documentation_url_optional:"URL de documentation (optionnel)",nfc_tag_id_optional:"ID tag NFC (optionnel)",environmental_entity_optional:"Capteur d'environnement (optionnel)",environmental_entity_helper:"ex. sensor.temperature_exterieure \u2014 ajuste l'intervalle selon les conditions environnementales",environmental_attribute_optional:"Attribut d'environnement (optionnel)",nfc_tag_id:"ID tag NFC",nfc_linked:"Tag NFC li\xE9",nfc_link_hint:"Cliquer pour associer un tag NFC",responsible_user:"Utilisateur responsable",no_user_assigned:"(Aucun utilisateur assign\xE9)",all_users:"Tous les utilisateurs",my_tasks:"Mes t\xE2ches",budget_monthly:"Budget mensuel",budget_yearly:"Budget annuel",groups:"Groupes",new_group:"Nouveau groupe",edit_group:"Modifier le groupe",no_groups:"Aucun groupe pour l'instant",delete_group:"Supprimer le groupe",delete_group_confirm:"Supprimer le groupe '{name}' ?",group_select_tasks:"S\xE9lectionner les t\xE2ches",group_name_required:"Nom requis",description_optional:"Description (optionnel)",selected:"S\xE9lectionn\xE9",loading_chart:"Chargement des donn\xE9es...",was_maintenance_needed:"Cette maintenance \xE9tait-elle n\xE9cessaire ?",feedback_needed:"N\xE9cessaire",feedback_not_needed:"Pas n\xE9cessaire",feedback_not_sure:"Pas s\xFBr",suggested_interval:"Intervalle sugg\xE9r\xE9",apply_suggestion:"Appliquer",reanalyze:"R\xE9analyser",reanalyze_result:"Nouvelle analyse",reanalyze_insufficient_data:"Donn\xE9es insuffisantes pour une recommandation",data_points:"points de donn\xE9es",dismiss_suggestion:"Ignorer",confidence_low:"Faible",confidence_medium:"Moyen",confidence_high:"\xC9lev\xE9",recommended:"recommand\xE9",seasonal_awareness:"Conscience saisonni\xE8re",edit_seasonal_overrides:"Modifier les facteurs saisonniers",seasonal_overrides_title:"Facteurs saisonniers (override)",seasonal_overrides_hint:"Facteur par mois (0.1\u20135.0). Vide = appris automatiquement.",seasonal_override_invalid:"Valeur invalide",seasonal_override_range:"Le facteur doit \xEAtre entre 0.1 et 5.0",clear_all:"Tout effacer",seasonal_chart_title:"Facteurs saisonniers",seasonal_learned:"Appris",seasonal_manual:"Manuel",month_jan:"Jan",month_feb:"F\xE9v",month_mar:"Mar",month_apr:"Avr",month_may:"Mai",month_jun:"Juin",month_jul:"Juil",month_aug:"Ao\xFBt",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"D\xE9c",sensor_prediction:"Pr\xE9diction capteur",degradation_trend:"Tendance",trend_rising:"En hausse",trend_falling:"En baisse",trend_stable:"Stable",trend_insufficient_data:"Donn\xE9es insuffisantes",days_until_threshold:"Jours avant le seuil",threshold_exceeded:"Seuil d\xE9pass\xE9",environmental_adjustment:"Facteur environnemental",sensor_prediction_urgency:"Le capteur pr\xE9voit le seuil dans ~{days} jours",day_short:"jour",weibull_reliability_curve:"Courbe de fiabilit\xE9",weibull_failure_probability:"Probabilit\xE9 de d\xE9faillance",weibull_r_squared:"Ajustement R\xB2",beta_early_failures:"D\xE9faillances pr\xE9coces",beta_random_failures:"D\xE9faillances al\xE9atoires",beta_wear_out:"Usure",beta_highly_predictable:"Tr\xE8s pr\xE9visible",confidence_interval:"Intervalle de confiance",confidence_conservative:"Conservateur",confidence_aggressive:"Optimiste",current_interval_marker:"Intervalle actuel",recommended_marker:"Recommand\xE9",characteristic_life:"Dur\xE9e de vie caract\xE9ristique",chart_mini_sparkline:"Sparkline de tendance",chart_history:"Historique co\xFBts et dur\xE9e",chart_seasonal:"Facteurs saisonniers, 12 mois",chart_weibull:"Courbe de fiabilit\xE9 Weibull",chart_sparkline:"Graphique valeur d\xE9clencheur",days_progress:"Progression en jours",qr_code:"QR Code",qr_generating:"G\xE9n\xE9ration du QR code\u2026",qr_error:"Impossible de g\xE9n\xE9rer le QR code.",qr_error_no_url:"Aucune URL HA configur\xE9e. Veuillez d\xE9finir une URL externe ou interne dans Param\xE8tres \u2192 Syst\xE8me \u2192 R\xE9seau.",save_error:"\xC9chec de l'enregistrement. Veuillez r\xE9essayer.",qr_print:"Imprimer",qr_download:"T\xE9l\xE9charger SVG",qr_action:"Action au scan",qr_action_view:"Afficher les infos de maintenance",qr_action_complete:"Marquer la maintenance comme termin\xE9e",qr_url_mode:"Type de lien",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"URL serveur",overview:"Aper\xE7u",analysis:"Analyse",recent_activities:"Activit\xE9s r\xE9centes",search_notes:"Rechercher dans les notes",avg_cost:"\xD8 Co\xFBt",no_advanced_features:"Aucune fonction avanc\xE9e activ\xE9e",no_advanced_features_hint:"Activez \xAB Intervalles adaptatifs \xBB ou \xAB Tendances saisonni\xE8res \xBB dans les param\xE8tres de l'int\xE9gration pour voir les donn\xE9es d'analyse ici.",analysis_not_enough_data:"Pas encore assez de donn\xE9es pour l'analyse.",analysis_not_enough_data_hint:"L'analyse Weibull n\xE9cessite au moins 5 maintenances termin\xE9es ; les tendances saisonni\xE8res apparaissent apr\xE8s 6+ points par mois.",analysis_manual_task_hint:"Les t\xE2ches manuelles sans intervalle ne g\xE9n\xE8rent pas de donn\xE9es d'analyse.",completions:"r\xE9alisations",current:"Actuel",shorter:"Plus court",longer:"Plus long",normal:"Normal",disabled:"D\xE9sactiv\xE9",compound_logic:"Logique compos\xE9e",card_title:"Titre",card_show_header:"Afficher l'en-t\xEAte avec statistiques",card_show_actions:"Afficher les boutons d'action",card_compact:"Mode compact",card_max_items:"Nombre max (0 = tous)",card_filter_status:"Filtrer par statut",card_filter_status_help:"Vide = afficher tous les statuts.",card_filter_objects:"Filtrer par objets",card_filter_objects_help:"Vide = afficher tous les objets.",card_filter_entities:"Filtrer par entit\xE9s (entity_ids)",card_filter_entities_help:"Choisissez des entit\xE9s sensor / binary_sensor de cette int\xE9gration. Vide = toutes.",card_loading_objects:"Chargement des objets\u2026",no_objects:"Aucun objet pour l'instant.",action_error:"Action \xE9chou\xE9e. Veuillez r\xE9essayer.",area_id_optional:"Zone (optionnel)",installation_date_optional:"Date d'installation (optionnel)",custom_icon_optional:"Ic\xF4ne (optionnel, ex. mdi:wrench)",task_enabled:"T\xE2che activ\xE9e",skip_reason_prompt:"Ignorer cette t\xE2che ?",reason_optional:"Raison (optionnel)",reset_date_prompt:"Marquer la t\xE2che comme effectu\xE9e ?",reset_date_optional:"Date de derni\xE8re ex\xE9cution (optionnel, d\xE9faut : aujourd'hui)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 Aucun tag \u2014",dashboard:"Tableau de bord",settings:"Param\xE8tres",settings_features:"Fonctions avanc\xE9es",settings_features_desc:"Activez ou d\xE9sactivez les fonctions avanc\xE9es. La d\xE9sactivation les masque dans l'interface mais ne supprime pas les donn\xE9es.",feat_adaptive:"Planification adaptative",feat_adaptive_desc:"Apprendre les intervalles optimaux \xE0 partir de l'historique",feat_predictions:"Pr\xE9dictions capteurs",feat_predictions_desc:"Pr\xE9dire les dates de d\xE9clenchement par d\xE9gradation des capteurs",feat_seasonal:"Ajustements saisonniers",feat_seasonal_desc:"Ajuster les intervalles selon les tendances saisonni\xE8res",feat_environmental:"Corr\xE9lation environnementale",feat_environmental_desc:"Corr\xE9ler les intervalles avec la temp\xE9rature/humidit\xE9",feat_budget:"Suivi budg\xE9taire",feat_budget_desc:"Suivre les d\xE9penses de maintenance mensuelles et annuelles",feat_groups:"Groupes de t\xE2ches",feat_groups_desc:"Organiser les t\xE2ches en groupes logiques",feat_checklists:"Checklists",feat_checklists_desc:"Proc\xE9dures multi-\xE9tapes pour la r\xE9alisation des t\xE2ches",settings_general:"G\xE9n\xE9ral",settings_default_warning:"Jours d'avertissement par d\xE9faut",settings_panel_enabled:"Panneau lat\xE9ral",settings_notifications:"Notifications",settings_notify_service:"Service de notification",test_notification:"Notification de test",send_test:"Envoyer le test",testing:"Envoi en cours\u2026",test_notification_success:"Notification de test envoy\xE9e",test_notification_failed:"\xC9chec de la notification de test",settings_notify_due_soon:"Notifier quand bient\xF4t d\xFB",settings_notify_overdue:"Notifier quand en retard",settings_notify_triggered:"Notifier quand d\xE9clench\xE9",settings_interval_hours:"Intervalle de r\xE9p\xE9tition (heures, 0 = une fois)",settings_quiet_hours:"Heures de silence",settings_quiet_start:"D\xE9but",settings_quiet_end:"Fin",settings_max_per_day:"Max notifications par jour (0 = illimit\xE9)",settings_bundling:"Regrouper les notifications",settings_bundle_threshold:"Seuil de regroupement",settings_actions:"Boutons d'action mobiles",settings_action_complete:"Afficher le bouton 'Termin\xE9'",settings_action_skip:"Afficher le bouton 'Passer'",settings_action_snooze:"Afficher le bouton 'Reporter'",settings_snooze_hours:"Dur\xE9e de report (heures)",settings_budget:"Budget",settings_currency:"Devise",settings_budget_monthly:"Budget mensuel",settings_budget_yearly:"Budget annuel",settings_budget_alerts:"Alertes budg\xE9taires",settings_budget_threshold:"Seuil d'alerte (%)",settings_import_export:"Import / Export",settings_export_json:"Exporter JSON",settings_export_csv:"Exporter CSV",settings_import_csv:"Importer CSV",settings_import_placeholder:"Collez le contenu JSON ou CSV ici\u2026",settings_import_btn:"Importer",settings_import_success:"{count} objets import\xE9s avec succ\xE8s.",settings_export_success:"Export t\xE9l\xE9charg\xE9.",settings_saved:"Param\xE8tre enregistr\xE9.",settings_include_history:"Inclure l'historique",sort_alphabetical:"Alphab\xE9tique",sort_due_soonest:"\xC9ch\xE9ance la plus proche",sort_task_count:"Nombre de t\xE2ches",sort_area:"Zone",sort_assigned_user:"Utilisateur affect\xE9",sort_group:"Groupe",groupby_none:"Aucun groupement",groupby_area:"Par zone",groupby_group:"Par groupe",groupby_user:"Par utilisateur",unassigned:"Non assign\xE9",no_area:"Aucune zone",has_overdue:"T\xE2ches en retard",object:"Objet",settings_panel_access:"Acc\xE8s au panneau",settings_panel_access_desc:"Les administrateurs voient toujours le panneau complet. S\xE9lectionnez ici les utilisateurs non administrateurs qui devraient aussi avoir l'acc\xE8s complet \u2014 les autres ne voient que Terminer et Ignorer.",no_non_admin_users:"Aucun utilisateur non administrateur trouv\xE9. Ajoutez-en dans Param\xE8tres \u2192 Personnes.",owner_label:"Propri\xE9taire"},Ge={maintenance:"Manutenzione",objects:"Oggetti",tasks:"Attivit\xE0",overdue:"Scaduto",due_soon:"In scadenza",triggered:"Attivato",ok:"OK",all:"Tutti",new_object:"+ Nuovo oggetto",edit:"Modifica",delete:"Elimina",add_task:"+ Attivit\xE0",complete:"Completato",completed:"Completato",skip:"Salta",skipped:"Saltato",reset:"Reimposta",cancel:"Annulla",completing:"Completamento\u2026",interval:"Intervallo",warning:"Avviso",last_performed:"Ultima esecuzione",next_due:"Prossima scadenza",days_until_due:"Giorni alla scadenza",avg_duration:"\xD8 Durata",trigger:"Trigger",trigger_type:"Tipo di trigger",threshold_above:"Limite superiore",threshold_below:"Limite inferiore",threshold:"Soglia",counter:"Contatore",state_change:"Cambio di stato",runtime:"Tempo di funzionamento",runtime_hours:"Durata obiettivo (ore)",target_value:"Valore obiettivo",baseline:"Linea di base",target_changes:"Modifiche obiettivo",for_minutes:"Per (minuti)",time_based:"Temporale",sensor_based:"Sensore",manual:"Manuale",cleaning:"Pulizia",inspection:"Ispezione",replacement:"Sostituzione",calibration:"Calibrazione",service:"Servizio",custom:"Personalizzato",history:"Cronologia",cost:"Costo",duration:"Durata",both:"Entrambi",trigger_val:"Valore trigger",complete_title:"Completato: ",checklist:"Checklist",checklist_steps_optional:"Passaggi della checklist (opzionale)",checklist_placeholder:`Pulire il filtro
Sostituire la guarnizione
Testare la pressione`,checklist_help:"Un passaggio per riga. Max 100 elementi.",err_too_long:"{field}: troppo lungo (max {n} caratteri)",err_too_short:"{field}: troppo corto (min {n} caratteri)",err_value_too_high:"{field}: troppo grande (max {n})",err_value_too_low:"{field}: troppo piccolo (min {n})",err_required:"{field}: campo obbligatorio",err_wrong_type:"{field}: tipo errato (atteso: {type})",err_invalid_choice:"{field}: valore non consentito",err_invalid_value:"{field}: valore non valido",feat_schedule_time:"Pianificazione oraria",feat_schedule_time_desc:"Le attivit\xE0 scadono a un'ora specifica anzich\xE9 a mezzanotte.",schedule_time_optional:"Scadenza all'ora (opzionale, HH:MM)",schedule_time_help:"Vuoto = mezzanotte (default). Fuso orario HA.",at_time:"alle",notes_optional:"Note (opzionale)",cost_optional:"Costo (opzionale)",duration_minutes:"Durata in minuti (opzionale)",days:"giorni",day:"giorno",today:"Oggi",d_overdue:"g in ritardo",no_tasks:"Nessuna attivit\xE0 di manutenzione. Crea un oggetto per iniziare.",no_tasks_short:"Nessuna attivit\xE0",no_history:"Nessuna voce nella cronologia.",show_all:"Mostra tutto",cost_duration_chart:"Costi & Durata",installed:"Installato",confirm_delete_object:"Eliminare questo oggetto e tutte le sue attivit\xE0?",confirm_delete_task:"Eliminare questa attivit\xE0?",min:"Min",max:"Max",save:"Salva",saving:"Salvataggio\u2026",edit_task:"Modifica attivit\xE0",new_task:"Nuova attivit\xE0 di manutenzione",task_name:"Nome attivit\xE0",maintenance_type:"Tipo di manutenzione",schedule_type:"Tipo di pianificazione",interval_days:"Intervallo (giorni)",warning_days:"Giorni di avviso",last_performed_optional:"Ultima esecuzione (opzionale)",interval_anchor:"Ancoraggio intervallo",anchor_completion:"Dalla data di completamento",anchor_planned:"Dalla data pianificata (nessuna deriva)",edit_object:"Modifica oggetto",name:"Nome",manufacturer_optional:"Produttore (opzionale)",model_optional:"Modello (opzionale)",serial_number_optional:"Numero di serie (opzionale)",serial_number_label:"N/S",sort_due_date:"Scadenza",sort_object:"Nome oggetto",sort_type:"Tipo",sort_task_name:"Nome attivit\xE0",all_objects:"Tutti gli oggetti",tasks_lower:"attivit\xE0",no_tasks_yet:"Nessuna attivit\xE0",add_first_task:"Aggiungi prima attivit\xE0",trigger_configuration:"Configurazione trigger",entity_id:"ID entit\xE0",comma_separated:"separati da virgola",entity_logic:"Logica entit\xE0",entity_logic_any:"Qualsiasi entit\xE0 attiva",entity_logic_all:"Tutte le entit\xE0 devono attivare",entities:"entit\xE0",attribute_optional:"Attributo (opzionale, vuoto = stato)",use_entity_state:"Usa stato dell'entit\xE0 (nessun attributo)",trigger_above:"Attivare sopra",trigger_below:"Attivare sotto",for_at_least_minutes:"Per almeno (minuti)",safety_interval_days:"Intervallo di sicurezza (giorni, opzionale)",delta_mode:"Modalit\xE0 delta",from_state_optional:"Dallo stato (opzionale)",to_state_optional:"Allo stato (opzionale)",documentation_url_optional:"URL documentazione (opzionale)",nfc_tag_id_optional:"ID tag NFC (opzionale)",environmental_entity_optional:"Sensore ambientale (opzionale)",environmental_entity_helper:"es. sensor.temperatura_esterna \u2014 regola l'intervallo in base alle condizioni ambientali",environmental_attribute_optional:"Attributo ambientale (opzionale)",nfc_tag_id:"ID tag NFC",nfc_linked:"Tag NFC collegato",nfc_link_hint:"Clicca per collegare un tag NFC",responsible_user:"Utente responsabile",no_user_assigned:"(Nessun utente assegnato)",all_users:"Tutti gli utenti",my_tasks:"Le mie attivit\xE0",budget_monthly:"Budget mensile",budget_yearly:"Budget annuale",groups:"Gruppi",new_group:"Nuovo gruppo",edit_group:"Modifica gruppo",no_groups:"Nessun gruppo",delete_group:"Elimina gruppo",delete_group_confirm:"Eliminare il gruppo '{name}'?",group_select_tasks:"Seleziona attivit\xE0",group_name_required:"Nome richiesto",description_optional:"Descrizione (opzionale)",selected:"Selezionato",loading_chart:"Caricamento dati...",was_maintenance_needed:"Questa manutenzione era necessaria?",feedback_needed:"Necessaria",feedback_not_needed:"Non necessaria",feedback_not_sure:"Non sicuro",suggested_interval:"Intervallo suggerito",apply_suggestion:"Applica",reanalyze:"Rianalizza",reanalyze_result:"Nuova analisi",reanalyze_insufficient_data:"Dati insufficienti per una raccomandazione",data_points:"punti dati",dismiss_suggestion:"Ignora",confidence_low:"Bassa",confidence_medium:"Media",confidence_high:"Alta",recommended:"consigliato",seasonal_awareness:"Consapevolezza stagionale",edit_seasonal_overrides:"Modifica fattori stagionali",seasonal_overrides_title:"Fattori stagionali (override)",seasonal_overrides_hint:"Fattore per mese (0.1\u20135.0). Vuoto = appreso automaticamente.",seasonal_override_invalid:"Valore non valido",seasonal_override_range:"Il fattore deve essere tra 0.1 e 5.0",clear_all:"Cancella tutto",seasonal_chart_title:"Fattori stagionali",seasonal_learned:"Appreso",seasonal_manual:"Manuale",month_jan:"Gen",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"Mag",month_jun:"Giu",month_jul:"Lug",month_aug:"Ago",month_sep:"Set",month_oct:"Ott",month_nov:"Nov",month_dec:"Dic",sensor_prediction:"Previsione sensore",degradation_trend:"Tendenza",trend_rising:"In aumento",trend_falling:"In calo",trend_stable:"Stabile",trend_insufficient_data:"Dati insufficienti",days_until_threshold:"Giorni alla soglia",threshold_exceeded:"Soglia superata",environmental_adjustment:"Fattore ambientale",sensor_prediction_urgency:"Il sensore prevede la soglia tra ~{days} giorni",day_short:"giorno",weibull_reliability_curve:"Curva di affidabilit\xE0",weibull_failure_probability:"Probabilit\xE0 di guasto",weibull_r_squared:"Adattamento R\xB2",beta_early_failures:"Guasti precoci",beta_random_failures:"Guasti casuali",beta_wear_out:"Usura",beta_highly_predictable:"Altamente prevedibile",confidence_interval:"Intervallo di confidenza",confidence_conservative:"Conservativo",confidence_aggressive:"Ottimistico",current_interval_marker:"Intervallo attuale",recommended_marker:"Consigliato",characteristic_life:"Vita caratteristica",chart_mini_sparkline:"Sparkline di tendenza",chart_history:"Cronologia costi e durata",chart_seasonal:"Fattori stagionali, 12 mesi",chart_weibull:"Curva di affidabilit\xE0 Weibull",chart_sparkline:"Grafico valore trigger sensore",days_progress:"Avanzamento giorni",qr_code:"Codice QR",qr_generating:"Generazione codice QR\u2026",qr_error:"Impossibile generare il codice QR.",qr_error_no_url:"Nessun URL HA configurato. Impostare un URL esterno o interno in Impostazioni \u2192 Sistema \u2192 Rete.",save_error:"Salvataggio non riuscito. Riprovare.",qr_print:"Stampa",qr_download:"Scarica SVG",qr_action:"Azione alla scansione",qr_action_view:"Visualizza info manutenzione",qr_action_complete:"Segna manutenzione come completata",qr_url_mode:"Tipo di link",qr_mode_companion:"Companion App",qr_mode_local:"Locale (mDNS)",qr_mode_server:"URL server",overview:"Panoramica",analysis:"Analisi",recent_activities:"Attivit\xE0 recenti",search_notes:"Cerca nelle note",avg_cost:"\xD8 Costo",no_advanced_features:"Nessuna funzione avanzata attivata",no_advanced_features_hint:"Attiva \u201CIntervalli Adattivi\u201D o \u201CModelli Stagionali\u201D nelle impostazioni dell'integrazione per vedere i dati di analisi qui.",analysis_not_enough_data:"Non ci sono ancora abbastanza dati per l'analisi.",analysis_not_enough_data_hint:"L'analisi Weibull richiede almeno 5 manutenzioni completate; i modelli stagionali diventano visibili dopo 6+ punti dati al mese.",analysis_manual_task_hint:"Le attivit\xE0 manuali senza intervallo non generano dati di analisi.",completions:"completamenti",current:"Attuale",shorter:"Pi\xF9 breve",longer:"Pi\xF9 lungo",normal:"Normale",disabled:"Disattivato",compound_logic:"Logica composta",card_title:"Titolo",card_show_header:"Mostra intestazione con statistiche",card_show_actions:"Mostra pulsanti azione",card_compact:"Modalit\xE0 compatta",card_max_items:"Max elementi (0 = tutti)",card_filter_status:"Filtra per stato",card_filter_status_help:"Vuoto = mostra tutti gli stati.",card_filter_objects:"Filtra per oggetti",card_filter_objects_help:"Vuoto = mostra tutti gli oggetti.",card_filter_entities:"Filtra per entit\xE0 (entity_ids)",card_filter_entities_help:"Seleziona entit\xE0 sensor / binary_sensor da questa integrazione. Vuoto = tutte.",card_loading_objects:"Caricamento oggetti\u2026",no_objects:"Nessun oggetto ancora.",action_error:"Azione fallita. Riprova.",area_id_optional:"Area (opzionale)",installation_date_optional:"Data di installazione (opzionale)",custom_icon_optional:"Icona (opzionale, es. mdi:wrench)",task_enabled:"Attivit\xE0 abilitata",skip_reason_prompt:"Saltare questa attivit\xE0?",reason_optional:"Motivo (opzionale)",reset_date_prompt:"Segnare l'attivit\xE0 come eseguita?",reset_date_optional:"Data ultima esecuzione (opzionale, predefinito: oggi)",notes_label:"Note",documentation_label:"Documentazione",no_nfc_tag:"\u2014 Nessun tag \u2014",dashboard:"Dashboard",settings:"Impostazioni",settings_features:"Funzioni avanzate",settings_features_desc:"Attiva o disattiva le funzioni avanzate. La disattivazione le nasconde dall'interfaccia ma non elimina i dati.",feat_adaptive:"Pianificazione adattiva",feat_adaptive_desc:"Impara intervalli ottimali dalla cronologia di manutenzione",feat_predictions:"Previsioni sensore",feat_predictions_desc:"Prevedi date di attivazione dalla degradazione dei sensori",feat_seasonal:"Adeguamenti stagionali",feat_seasonal_desc:"Adegua gli intervalli in base ai modelli stagionali",feat_environmental:"Correlazione ambientale",feat_environmental_desc:"Correla gli intervalli con temperatura/umidit\xE0",feat_budget:"Monitoraggio budget",feat_budget_desc:"Monitora le spese di manutenzione mensili e annuali",feat_groups:"Gruppi di attivit\xE0",feat_groups_desc:"Organizza le attivit\xE0 in gruppi logici",feat_checklists:"Checklist",feat_checklists_desc:"Procedure multi-fase per il completamento delle attivit\xE0",settings_general:"Generale",settings_default_warning:"Giorni di avviso predefiniti",settings_panel_enabled:"Pannello laterale",settings_notifications:"Notifiche",settings_notify_service:"Servizio di notifica",test_notification:"Notifica di test",send_test:"Invia test",testing:"Invio in corso\u2026",test_notification_success:"Notifica di test inviata",test_notification_failed:"Notifica di test non riuscita",settings_notify_due_soon:"Notifica quando in scadenza",settings_notify_overdue:"Notifica quando scaduto",settings_notify_triggered:"Notifica quando attivato",settings_interval_hours:"Intervallo di ripetizione (ore, 0 = una volta)",settings_quiet_hours:"Ore di silenzio",settings_quiet_start:"Inizio",settings_quiet_end:"Fine",settings_max_per_day:"Max notifiche al giorno (0 = illimitato)",settings_bundling:"Raggruppare le notifiche",settings_bundle_threshold:"Soglia di raggruppamento",settings_actions:"Pulsanti azione mobili",settings_action_complete:"Mostra pulsante 'Completato'",settings_action_skip:"Mostra pulsante 'Salta'",settings_action_snooze:"Mostra pulsante 'Posticipa'",settings_snooze_hours:"Durata posticipo (ore)",settings_budget:"Budget",settings_currency:"Valuta",settings_budget_monthly:"Budget mensile",settings_budget_yearly:"Budget annuale",settings_budget_alerts:"Avvisi budget",settings_budget_threshold:"Soglia di avviso (%)",settings_import_export:"Import / Export",settings_export_json:"Esporta JSON",settings_export_csv:"Esporta CSV",settings_import_csv:"Importa CSV",settings_import_placeholder:"Incolla il contenuto JSON o CSV qui\u2026",settings_import_btn:"Importa",settings_import_success:"{count} oggetti importati con successo.",settings_export_success:"Export scaricato.",settings_saved:"Impostazione salvata.",settings_include_history:"Includi cronologia",sort_alphabetical:"Alfabetico",sort_due_soonest:"Scadenza pi\xF9 vicina",sort_task_count:"Numero di attivit\xE0",sort_area:"Area",sort_assigned_user:"Utente assegnato",sort_group:"Gruppo",groupby_none:"Nessun raggruppamento",groupby_area:"Per area",groupby_group:"Per gruppo",groupby_user:"Per utente",unassigned:"Non assegnato",no_area:"Nessuna area",has_overdue:"Attivit\xE0 scadute",object:"Oggetto",settings_panel_access:"Accesso al pannello",settings_panel_access_desc:"Gli amministratori vedono sempre il pannello completo. Seleziona qui gli utenti non amministratori che dovrebbero anche avere accesso completo \u2014 gli altri vedono solo Completa e Salta.",no_non_admin_users:"Nessun utente non amministratore trovato. Aggiungili in Impostazioni \u2192 Persone.",owner_label:"Proprietario"},Ze={maintenance:"Mantenimiento",objects:"Objetos",tasks:"Tareas",overdue:"Vencida",due_soon:"Pr\xF3xima",triggered:"Activada",ok:"OK",all:"Todos",new_object:"+ Nuevo objeto",edit:"Editar",delete:"Eliminar",add_task:"+ Tarea",complete:"Completada",completed:"Completada",skip:"Omitir",skipped:"Omitida",reset:"Restablecer",cancel:"Cancelar",completing:"Completando\u2026",interval:"Intervalo",warning:"Aviso",last_performed:"\xDAltima ejecuci\xF3n",next_due:"Pr\xF3ximo vencimiento",days_until_due:"D\xEDas hasta vencimiento",avg_duration:"\xD8 Duraci\xF3n",trigger:"Disparador",trigger_type:"Tipo de disparador",threshold_above:"L\xEDmite superior",threshold_below:"L\xEDmite inferior",threshold:"Umbral",counter:"Contador",state_change:"Cambio de estado",runtime:"Tiempo de funcionamiento",runtime_hours:"Duraci\xF3n objetivo (horas)",target_value:"Valor objetivo",baseline:"L\xEDnea base",target_changes:"Cambios objetivo",for_minutes:"Durante (minutos)",time_based:"Temporal",sensor_based:"Sensor",manual:"Manual",cleaning:"Limpieza",inspection:"Inspecci\xF3n",replacement:"Sustituci\xF3n",calibration:"Calibraci\xF3n",service:"Servicio",custom:"Personalizado",history:"Historial",cost:"Coste",duration:"Duraci\xF3n",both:"Ambos",trigger_val:"Valor del disparador",complete_title:"Completada: ",checklist:"Lista de verificaci\xF3n",checklist_steps_optional:"Pasos de la lista de verificaci\xF3n (opcional)",checklist_placeholder:`Limpiar filtro
Reemplazar junta
Probar presi\xF3n`,checklist_help:"Un paso por l\xEDnea. M\xE1x. 100 elementos.",err_too_long:"{field}: demasiado largo (m\xE1x. {n} caracteres)",err_too_short:"{field}: demasiado corto (m\xEDn. {n} caracteres)",err_value_too_high:"{field}: demasiado grande (m\xE1x. {n})",err_value_too_low:"{field}: demasiado peque\xF1o (m\xEDn. {n})",err_required:"{field}: campo obligatorio",err_wrong_type:"{field}: tipo incorrecto (esperado: {type})",err_invalid_choice:"{field}: valor no permitido",err_invalid_value:"{field}: valor inv\xE1lido",feat_schedule_time:"Programaci\xF3n por hora",feat_schedule_time_desc:"Las tareas vencen a una hora espec\xEDfica en lugar de medianoche.",schedule_time_optional:"Vence a las (opcional, HH:MM)",schedule_time_help:"Vac\xEDo = medianoche (predeterminado). Zona horaria HA.",at_time:"a las",notes_optional:"Notas (opcional)",cost_optional:"Coste (opcional)",duration_minutes:"Duraci\xF3n en minutos (opcional)",days:"d\xEDas",day:"d\xEDa",today:"Hoy",d_overdue:"d vencida",no_tasks:"No hay tareas de mantenimiento. Cree un objeto para empezar.",no_tasks_short:"Sin tareas",no_history:"Sin entradas en el historial.",show_all:"Mostrar todo",cost_duration_chart:"Costes & Duraci\xF3n",installed:"Instalado",confirm_delete_object:"\xBFEliminar este objeto y todas sus tareas?",confirm_delete_task:"\xBFEliminar esta tarea?",min:"M\xEDn",max:"M\xE1x",save:"Guardar",saving:"Guardando\u2026",edit_task:"Editar tarea",new_task:"Nueva tarea de mantenimiento",task_name:"Nombre de la tarea",maintenance_type:"Tipo de mantenimiento",schedule_type:"Tipo de planificaci\xF3n",interval_days:"Intervalo (d\xEDas)",warning_days:"D\xEDas de aviso",last_performed_optional:"\xDAltima ejecuci\xF3n (opcional)",interval_anchor:"Anclaje del intervalo",anchor_completion:"Desde la fecha de finalizaci\xF3n",anchor_planned:"Desde la fecha planificada (sin desviaci\xF3n)",edit_object:"Editar objeto",name:"Nombre",manufacturer_optional:"Fabricante (opcional)",model_optional:"Modelo (opcional)",serial_number_optional:"N\xFAmero de serie (opcional)",serial_number_label:"N/S",sort_due_date:"Vencimiento",sort_object:"Nombre del objeto",sort_type:"Tipo",sort_task_name:"Nombre de la tarea",all_objects:"Todos los objetos",tasks_lower:"tareas",no_tasks_yet:"A\xFAn no hay tareas",add_first_task:"Agregar primera tarea",trigger_configuration:"Configuraci\xF3n del disparador",entity_id:"ID de entidad",comma_separated:"separados por comas",entity_logic:"L\xF3gica de entidad",entity_logic_any:"Cualquier entidad activa",entity_logic_all:"Todas las entidades deben activar",entities:"entidades",attribute_optional:"Atributo (opcional, vac\xEDo = estado)",use_entity_state:"Usar estado de la entidad (sin atributo)",trigger_above:"Activar por encima de",trigger_below:"Activar por debajo de",for_at_least_minutes:"Durante al menos (minutos)",safety_interval_days:"Intervalo de seguridad (d\xEDas, opcional)",delta_mode:"Modo delta",from_state_optional:"Desde estado (opcional)",to_state_optional:"Hasta estado (opcional)",documentation_url_optional:"URL de documentaci\xF3n (opcional)",nfc_tag_id_optional:"ID de etiqueta NFC (opcional)",environmental_entity_optional:"Sensor ambiental (opcional)",environmental_entity_helper:"p.ej. sensor.temperatura_exterior \u2014 ajusta el intervalo segu\u0301n las condiciones ambientales",environmental_attribute_optional:"Atributo ambiental (opcional)",nfc_tag_id:"ID de etiqueta NFC",nfc_linked:"Etiqueta NFC vinculada",nfc_link_hint:"Clic para vincular etiqueta NFC",responsible_user:"Usuario responsable",no_user_assigned:"(Ning\xFAn usuario asignado)",all_users:"Todos los usuarios",my_tasks:"Mis tareas",budget_monthly:"Presupuesto mensual",budget_yearly:"Presupuesto anual",groups:"Grupos",new_group:"Nuevo grupo",edit_group:"Editar grupo",no_groups:"Sin grupos todav\xEDa",delete_group:"Eliminar grupo",delete_group_confirm:"\xBFEliminar el grupo '{name}'?",group_select_tasks:"Seleccionar tareas",group_name_required:"Nombre requerido",description_optional:"Descripci\xF3n (opcional)",selected:"Seleccionado",loading_chart:"Cargando datos...",was_maintenance_needed:"\xBFEra necesario este mantenimiento?",feedback_needed:"Necesario",feedback_not_needed:"No necesario",feedback_not_sure:"No seguro",suggested_interval:"Intervalo sugerido",apply_suggestion:"Aplicar",reanalyze:"Reanalizar",reanalyze_result:"Nuevo an\xE1lisis",reanalyze_insufficient_data:"Datos insuficientes para una recomendaci\xF3n",data_points:"puntos de datos",dismiss_suggestion:"Descartar",confidence_low:"Baja",confidence_medium:"Media",confidence_high:"Alta",recommended:"recomendado",seasonal_awareness:"Conciencia estacional",edit_seasonal_overrides:"Editar factores estacionales",seasonal_overrides_title:"Factores estacionales (override)",seasonal_overrides_hint:"Factor por mes (0.1\u20135.0). Vac\xEDo = aprendido autom\xE1ticamente.",seasonal_override_invalid:"Valor no v\xE1lido",seasonal_override_range:"El factor debe estar entre 0.1 y 5.0",clear_all:"Borrar todo",seasonal_chart_title:"Factores estacionales",seasonal_learned:"Aprendido",seasonal_manual:"Manual",month_jan:"Ene",month_feb:"Feb",month_mar:"Mar",month_apr:"Abr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Ago",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dic",sensor_prediction:"Predicci\xF3n del sensor",degradation_trend:"Tendencia",trend_rising:"En aumento",trend_falling:"En descenso",trend_stable:"Estable",trend_insufficient_data:"Datos insuficientes",days_until_threshold:"D\xEDas hasta el umbral",threshold_exceeded:"Umbral superado",environmental_adjustment:"Factor ambiental",sensor_prediction_urgency:"El sensor predice el umbral en ~{days} d\xEDas",day_short:"d\xEDa",weibull_reliability_curve:"Curva de fiabilidad",weibull_failure_probability:"Probabilidad de fallo",weibull_r_squared:"Ajuste R\xB2",beta_early_failures:"Fallos tempranos",beta_random_failures:"Fallos aleatorios",beta_wear_out:"Desgaste",beta_highly_predictable:"Altamente predecible",confidence_interval:"Intervalo de confianza",confidence_conservative:"Conservador",confidence_aggressive:"Optimista",current_interval_marker:"Intervalo actual",recommended_marker:"Recomendado",characteristic_life:"Vida caracter\xEDstica",chart_mini_sparkline:"Sparkline de tendencia",chart_history:"Historial de costes y duraci\xF3n",chart_seasonal:"Factores estacionales, 12 meses",chart_weibull:"Curva de fiabilidad Weibull",chart_sparkline:"Gr\xE1fico de valor del disparador",days_progress:"Progreso en d\xEDas",qr_code:"C\xF3digo QR",qr_generating:"Generando c\xF3digo QR\u2026",qr_error:"No se pudo generar el c\xF3digo QR.",qr_error_no_url:"No hay URL de HA configurada. Establezca una URL externa o interna en Ajustes \u2192 Sistema \u2192 Red.",save_error:"Error al guardar. Int\xE9ntelo de nuevo.",qr_print:"Imprimir",qr_download:"Descargar SVG",qr_action:"Acci\xF3n al escanear",qr_action_view:"Ver info de mantenimiento",qr_action_complete:"Marcar mantenimiento como completado",qr_url_mode:"Tipo de enlace",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"URL del servidor",overview:"Resumen",analysis:"An\xE1lisis",recent_activities:"Actividades recientes",search_notes:"Buscar en notas",avg_cost:"\xD8 Coste",no_advanced_features:"Sin funciones avanzadas activadas",no_advanced_features_hint:"Active \u201CIntervalos Adaptativos\u201D o \u201CPatrones Estacionales\u201D en la configuraci\xF3n de la integraci\xF3n para ver datos de an\xE1lisis aqu\xED.",analysis_not_enough_data:"A\xFAn no hay suficientes datos para el an\xE1lisis.",analysis_not_enough_data_hint:"El an\xE1lisis Weibull requiere al menos 5 mantenimientos completados; los patrones estacionales son visibles tras 6+ puntos de datos por mes.",analysis_manual_task_hint:"Las tareas manuales sin intervalo no generan datos de an\xE1lisis.",completions:"finalizaciones",current:"Actual",shorter:"M\xE1s corto",longer:"M\xE1s largo",normal:"Normal",disabled:"Desactivado",compound_logic:"L\xF3gica compuesta",card_title:"T\xEDtulo",card_show_header:"Mostrar encabezado con estad\xEDsticas",card_show_actions:"Mostrar botones de acci\xF3n",card_compact:"Modo compacto",card_max_items:"M\xE1x. elementos (0 = todos)",card_filter_status:"Filtrar por estado",card_filter_status_help:"Vac\xEDo = mostrar todos los estados.",card_filter_objects:"Filtrar por objetos",card_filter_objects_help:"Vac\xEDo = mostrar todos los objetos.",card_filter_entities:"Filtrar por entidades (entity_ids)",card_filter_entities_help:"Selecciona entidades sensor / binary_sensor de esta integraci\xF3n. Vac\xEDo = todas.",card_loading_objects:"Cargando objetos\u2026",no_objects:"A\xFAn no hay objetos.",action_error:"Acci\xF3n fallida. Int\xE9ntelo de nuevo.",area_id_optional:"\xC1rea (opcional)",installation_date_optional:"Fecha de instalaci\xF3n (opcional)",custom_icon_optional:"Icono (opcional, ej. mdi:wrench)",task_enabled:"Tarea habilitada",skip_reason_prompt:"\xBFOmitir esta tarea?",reason_optional:"Motivo (opcional)",reset_date_prompt:"\xBFMarcar la tarea como realizada?",reset_date_optional:"Fecha de \xFAltima ejecuci\xF3n (opcional, por defecto: hoy)",notes_label:"Notas",documentation_label:"Documentaci\xF3n",no_nfc_tag:"\u2014 Sin etiqueta \u2014",dashboard:"Panel",settings:"Ajustes",settings_features:"Funciones avanzadas",settings_features_desc:"Active o desactive funciones avanzadas. Desactivar las oculta de la interfaz pero no elimina datos.",feat_adaptive:"Planificaci\xF3n adaptativa",feat_adaptive_desc:"Aprender intervalos \xF3ptimos del historial de mantenimiento",feat_predictions:"Predicciones de sensor",feat_predictions_desc:"Predecir fechas de activaci\xF3n por degradaci\xF3n del sensor",feat_seasonal:"Ajustes estacionales",feat_seasonal_desc:"Ajustar intervalos seg\xFAn patrones estacionales",feat_environmental:"Correlaci\xF3n ambiental",feat_environmental_desc:"Correlacionar intervalos con temperatura/humedad",feat_budget:"Seguimiento de presupuesto",feat_budget_desc:"Seguir los gastos de mantenimiento mensuales y anuales",feat_groups:"Grupos de tareas",feat_groups_desc:"Organizar tareas en grupos l\xF3gicos",feat_checklists:"Listas de verificaci\xF3n",feat_checklists_desc:"Procedimientos de varios pasos para completar tareas",settings_general:"General",settings_default_warning:"D\xEDas de aviso predeterminados",settings_panel_enabled:"Panel lateral",settings_notifications:"Notificaciones",settings_notify_service:"Servicio de notificaci\xF3n",test_notification:"Notificaci\xF3n de prueba",send_test:"Enviar prueba",testing:"Enviando\u2026",test_notification_success:"Notificaci\xF3n de prueba enviada",test_notification_failed:"La notificaci\xF3n de prueba fall\xF3",settings_notify_due_soon:"Notificar cuando est\xE9 pr\xF3xima",settings_notify_overdue:"Notificar cuando est\xE9 vencida",settings_notify_triggered:"Notificar cuando se active",settings_interval_hours:"Intervalo de repetici\xF3n (horas, 0 = una vez)",settings_quiet_hours:"Horas de silencio",settings_quiet_start:"Inicio",settings_quiet_end:"Fin",settings_max_per_day:"M\xE1x. notificaciones por d\xEDa (0 = ilimitado)",settings_bundling:"Agrupar notificaciones",settings_bundle_threshold:"Umbral de agrupaci\xF3n",settings_actions:"Botones de acci\xF3n m\xF3viles",settings_action_complete:"Mostrar bot\xF3n 'Completada'",settings_action_skip:"Mostrar bot\xF3n 'Omitir'",settings_action_snooze:"Mostrar bot\xF3n 'Posponer'",settings_snooze_hours:"Duraci\xF3n de posposici\xF3n (horas)",settings_budget:"Presupuesto",settings_currency:"Moneda",settings_budget_monthly:"Presupuesto mensual",settings_budget_yearly:"Presupuesto anual",settings_budget_alerts:"Alertas de presupuesto",settings_budget_threshold:"Umbral de alerta (%)",settings_import_export:"Importar / Exportar",settings_export_json:"Exportar JSON",settings_export_csv:"Exportar CSV",settings_import_csv:"Importar CSV",settings_import_placeholder:"Pegue el contenido JSON o CSV aqu\xED\u2026",settings_import_btn:"Importar",settings_import_success:"{count} objetos importados correctamente.",settings_export_success:"Exportaci\xF3n descargada.",settings_saved:"Ajuste guardado.",settings_include_history:"Incluir historial",sort_alphabetical:"Alfab\xE9tico",sort_due_soonest:"Pr\xF3ximo a vencer",sort_task_count:"Cantidad de tareas",sort_area:"\xC1rea",sort_assigned_user:"Usuario asignado",sort_group:"Grupo",groupby_none:"Sin agrupaci\xF3n",groupby_area:"Por \xE1rea",groupby_group:"Por grupo",groupby_user:"Por usuario",unassigned:"Sin asignar",no_area:"Sin \xE1rea",has_overdue:"Tareas vencidas",object:"Objeto",settings_panel_access:"Acceso al panel",settings_panel_access_desc:"Los administradores siempre ven el panel completo. Selecciona aqu\xED a los usuarios no administradores que tambi\xE9n deben tener acceso completo \u2014 los dem\xE1s solo ven Completar y Omitir.",no_non_admin_users:"No se encontraron usuarios no administradores. A\xF1ade alguno en Ajustes \u2192 Personas.",owner_label:"Propietario"},Je={maintenance:"Manuten\xE7\xE3o",objects:"Objetos",tasks:"Tarefas",overdue:"Atrasada",due_soon:"Pr\xF3xima",triggered:"Acionada",ok:"OK",all:"Todos",new_object:"+ Novo objeto",edit:"Editar",delete:"Eliminar",add_task:"+ Tarefa",complete:"Conclu\xEDda",completed:"Conclu\xEDda",skip:"Saltar",skipped:"Saltada",reset:"Repor",cancel:"Cancelar",completing:"A concluir\u2026",interval:"Intervalo",warning:"Aviso",last_performed:"\xDAltima execu\xE7\xE3o",next_due:"Pr\xF3ximo vencimento",days_until_due:"Dias at\xE9 vencimento",avg_duration:"\xD8 Dura\xE7\xE3o",trigger:"Acionador",trigger_type:"Tipo de acionador",threshold_above:"Limite superior",threshold_below:"Limite inferior",threshold:"Limiar",counter:"Contador",state_change:"Mudan\xE7a de estado",runtime:"Tempo de funcionamento",runtime_hours:"Dura\xE7\xE3o alvo (horas)",target_value:"Valor alvo",baseline:"Linha de base",target_changes:"Altera\xE7\xF5es alvo",for_minutes:"Durante (minutos)",time_based:"Temporal",sensor_based:"Sensor",manual:"Manual",cleaning:"Limpeza",inspection:"Inspe\xE7\xE3o",replacement:"Substitui\xE7\xE3o",calibration:"Calibra\xE7\xE3o",service:"Servi\xE7o",custom:"Personalizado",history:"Hist\xF3rico",cost:"Custo",duration:"Dura\xE7\xE3o",both:"Ambos",trigger_val:"Valor do acionador",complete_title:"Conclu\xEDda: ",checklist:"Lista de verifica\xE7\xE3o",checklist_steps_optional:"Passos da lista de verifica\xE7\xE3o (opcional)",checklist_placeholder:`Limpar filtro
Substituir veda\xE7\xE3o
Testar press\xE3o`,checklist_help:"Um passo por linha. M\xE1x. 100 itens.",err_too_long:"{field}: demasiado longo (m\xE1x. {n} caracteres)",err_too_short:"{field}: demasiado curto (m\xEDn. {n} caracteres)",err_value_too_high:"{field}: demasiado grande (m\xE1x. {n})",err_value_too_low:"{field}: demasiado pequeno (m\xEDn. {n})",err_required:"{field}: campo obrigat\xF3rio",err_wrong_type:"{field}: tipo incorreto (esperado: {type})",err_invalid_choice:"{field}: valor n\xE3o permitido",err_invalid_value:"{field}: valor inv\xE1lido",feat_schedule_time:"Agendamento por hora",feat_schedule_time_desc:"Tarefas vencem em um hor\xE1rio espec\xEDfico em vez de meia-noite.",schedule_time_optional:"Vence \xE0s (opcional, HH:MM)",schedule_time_help:"Vazio = meia-noite (padr\xE3o). Fuso hor\xE1rio HA.",at_time:"\xE0s",notes_optional:"Notas (opcional)",cost_optional:"Custo (opcional)",duration_minutes:"Dura\xE7\xE3o em minutos (opcional)",days:"dias",day:"dia",today:"Hoje",d_overdue:"d em atraso",no_tasks:"Sem tarefas de manuten\xE7\xE3o. Crie um objeto para come\xE7ar.",no_tasks_short:"Sem tarefas",no_history:"Sem entradas no hist\xF3rico.",show_all:"Mostrar tudo",cost_duration_chart:"Custos & Dura\xE7\xE3o",installed:"Instalado",confirm_delete_object:"Eliminar este objeto e todas as suas tarefas?",confirm_delete_task:"Eliminar esta tarefa?",min:"M\xEDn",max:"M\xE1x",save:"Guardar",saving:"A guardar\u2026",edit_task:"Editar tarefa",new_task:"Nova tarefa de manuten\xE7\xE3o",task_name:"Nome da tarefa",maintenance_type:"Tipo de manuten\xE7\xE3o",schedule_type:"Tipo de agendamento",interval_days:"Intervalo (dias)",warning_days:"Dias de aviso",last_performed_optional:"\xDAltima execu\xE7\xE3o (opcional)",interval_anchor:"\xC2ncora do intervalo",anchor_completion:"A partir da data de conclus\xE3o",anchor_planned:"A partir da data planeada (sem desvio)",edit_object:"Editar objeto",name:"Nome",manufacturer_optional:"Fabricante (opcional)",model_optional:"Modelo (opcional)",serial_number_optional:"N\xFAmero de s\xE9rie (opcional)",serial_number_label:"N/S",sort_due_date:"Vencimento",sort_object:"Nome do objeto",sort_type:"Tipo",sort_task_name:"Nome da tarefa",all_objects:"Todos os objetos",tasks_lower:"tarefas",no_tasks_yet:"Ainda sem tarefas",add_first_task:"Adicionar primeira tarefa",trigger_configuration:"Configura\xE7\xE3o do acionador",entity_id:"ID da entidade",comma_separated:"separados por v\xEDrgulas",entity_logic:"L\xF3gica da entidade",entity_logic_any:"Qualquer entidade aciona",entity_logic_all:"Todas as entidades devem acionar",entities:"entidades",attribute_optional:"Atributo (opcional, vazio = estado)",use_entity_state:"Usar estado da entidade (sem atributo)",trigger_above:"Acionar acima de",trigger_below:"Acionar abaixo de",for_at_least_minutes:"Durante pelo menos (minutos)",safety_interval_days:"Intervalo de seguran\xE7a (dias, opcional)",delta_mode:"Modo delta",from_state_optional:"Do estado (opcional)",to_state_optional:"Para o estado (opcional)",documentation_url_optional:"URL de documenta\xE7\xE3o (opcional)",nfc_tag_id_optional:"ID da etiqueta NFC (opcional)",environmental_entity_optional:"Sensor ambiental (opcional)",environmental_entity_helper:"ex. sensor.temperatura_exterior \u2014 ajusta o intervalo segundo as condi\xE7\xF5es ambientais",environmental_attribute_optional:"Atributo ambiental (opcional)",nfc_tag_id:"ID da etiqueta NFC",nfc_linked:"Etiqueta NFC associada",nfc_link_hint:"Clique para associar etiqueta NFC",responsible_user:"Utilizador respons\xE1vel",no_user_assigned:"(Nenhum utilizador atribu\xEDdo)",all_users:"Todos os utilizadores",my_tasks:"As minhas tarefas",budget_monthly:"Or\xE7amento mensal",budget_yearly:"Or\xE7amento anual",groups:"Grupos",new_group:"Novo grupo",edit_group:"Editar grupo",no_groups:"Ainda sem grupos",delete_group:"Eliminar grupo",delete_group_confirm:"Eliminar o grupo '{name}'?",group_select_tasks:"Selecionar tarefas",group_name_required:"Nome obrigat\xF3rio",description_optional:"Descri\xE7\xE3o (opcional)",selected:"Selecionado",loading_chart:"A carregar dados...",was_maintenance_needed:"Esta manuten\xE7\xE3o era necess\xE1ria?",feedback_needed:"Necess\xE1ria",feedback_not_needed:"N\xE3o necess\xE1ria",feedback_not_sure:"N\xE3o tenho a certeza",suggested_interval:"Intervalo sugerido",apply_suggestion:"Aplicar",reanalyze:"Reanalisar",reanalyze_result:"Nova an\xE1lise",reanalyze_insufficient_data:"Dados insuficientes para uma recomenda\xE7\xE3o",data_points:"pontos de dados",dismiss_suggestion:"Descartar",confidence_low:"Baixa",confidence_medium:"M\xE9dia",confidence_high:"Alta",recommended:"recomendado",seasonal_awareness:"Consci\xEAncia sazonal",edit_seasonal_overrides:"Editar fatores sazonais",seasonal_overrides_title:"Fatores sazonais (override)",seasonal_overrides_hint:"Fator por m\xEAs (0.1\u20135.0). Vazio = aprendido automaticamente.",seasonal_override_invalid:"Valor inv\xE1lido",seasonal_override_range:"O fator deve estar entre 0.1 e 5.0",clear_all:"Limpar tudo",seasonal_chart_title:"Fatores sazonais",seasonal_learned:"Aprendido",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Fev",month_mar:"Mar",month_apr:"Abr",month_may:"Mai",month_jun:"Jun",month_jul:"Jul",month_aug:"Ago",month_sep:"Set",month_oct:"Out",month_nov:"Nov",month_dec:"Dez",sensor_prediction:"Previs\xE3o do sensor",degradation_trend:"Tend\xEAncia",trend_rising:"A subir",trend_falling:"A descer",trend_stable:"Est\xE1vel",trend_insufficient_data:"Dados insuficientes",days_until_threshold:"Dias at\xE9 ao limiar",threshold_exceeded:"Limiar ultrapassado",environmental_adjustment:"Fator ambiental",sensor_prediction_urgency:"O sensor prev\xEA o limiar em ~{days} dias",day_short:"dia",weibull_reliability_curve:"Curva de fiabilidade",weibull_failure_probability:"Probabilidade de falha",weibull_r_squared:"Ajuste R\xB2",beta_early_failures:"Falhas precoces",beta_random_failures:"Falhas aleat\xF3rias",beta_wear_out:"Desgaste",beta_highly_predictable:"Altamente previs\xEDvel",confidence_interval:"Intervalo de confian\xE7a",confidence_conservative:"Conservador",confidence_aggressive:"Otimista",current_interval_marker:"Intervalo atual",recommended_marker:"Recomendado",characteristic_life:"Vida caracter\xEDstica",chart_mini_sparkline:"Sparkline de tend\xEAncia",chart_history:"Hist\xF3rico de custos e dura\xE7\xE3o",chart_seasonal:"Fatores sazonais, 12 meses",chart_weibull:"Curva de fiabilidade Weibull",chart_sparkline:"Gr\xE1fico de valor do acionador",days_progress:"Progresso em dias",qr_code:"C\xF3digo QR",qr_generating:"A gerar c\xF3digo QR\u2026",qr_error:"N\xE3o foi poss\xEDvel gerar o c\xF3digo QR.",qr_error_no_url:"Nenhum URL do HA configurado. Defina um URL externo ou interno em Defini\xE7\xF5es \u2192 Sistema \u2192 Rede.",save_error:"Erro ao guardar. Tente novamente.",qr_print:"Imprimir",qr_download:"Transferir SVG",qr_action:"A\xE7\xE3o ao digitalizar",qr_action_view:"Ver informa\xE7\xF5es de manuten\xE7\xE3o",qr_action_complete:"Marcar manuten\xE7\xE3o como conclu\xEDda",qr_url_mode:"Tipo de liga\xE7\xE3o",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"URL do servidor",overview:"Vis\xE3o geral",analysis:"An\xE1lise",recent_activities:"Atividades recentes",search_notes:"Pesquisar notas",avg_cost:"\xD8 Custo",no_advanced_features:"Sem fun\xE7\xF5es avan\xE7adas ativadas",no_advanced_features_hint:"Ative \u201CIntervalos Adaptativos\u201D ou \u201CPadr\xF5es Sazonais\u201D nas defini\xE7\xF5es da integra\xE7\xE3o para ver dados de an\xE1lise aqui.",analysis_not_enough_data:"Ainda n\xE3o h\xE1 dados suficientes para a an\xE1lise.",analysis_not_enough_data_hint:"A an\xE1lise Weibull requer pelo menos 5 manuten\xE7\xF5es conclu\xEDdas; os padr\xF5es sazonais tornam-se vis\xEDveis ap\xF3s 6+ pontos de dados por m\xEAs.",analysis_manual_task_hint:"Tarefas manuais sem intervalo n\xE3o geram dados de an\xE1lise.",completions:"conclus\xF5es",current:"Atual",shorter:"Mais curto",longer:"Mais longo",normal:"Normal",disabled:"Desativado",compound_logic:"L\xF3gica composta",card_title:"T\xEDtulo",card_show_header:"Mostrar cabe\xE7alho com estat\xEDsticas",card_show_actions:"Mostrar bot\xF5es de a\xE7\xE3o",card_compact:"Modo compacto",card_max_items:"M\xE1x. itens (0 = todos)",card_filter_status:"Filtrar por estado",card_filter_status_help:"Vazio = mostrar todos os estados.",card_filter_objects:"Filtrar por objetos",card_filter_objects_help:"Vazio = mostrar todos os objetos.",card_filter_entities:"Filtrar por entidades (entity_ids)",card_filter_entities_help:"Selecione entidades sensor / binary_sensor desta integra\xE7\xE3o. Vazio = todas.",card_loading_objects:"A carregar objetos\u2026",no_objects:"Ainda sem objetos.",action_error:"A\xE7\xE3o falhada. Tente novamente.",area_id_optional:"\xC1rea (opcional)",installation_date_optional:"Data de instala\xE7\xE3o (opcional)",custom_icon_optional:"\xCDcone (opcional, ex. mdi:wrench)",task_enabled:"Tarefa ativada",skip_reason_prompt:"Saltar esta tarefa?",reason_optional:"Motivo (opcional)",reset_date_prompt:"Marcar tarefa como executada?",reset_date_optional:"Data da \xFAltima execu\xE7\xE3o (opcional, padr\xE3o: hoje)",notes_label:"Notas",documentation_label:"Documenta\xE7\xE3o",no_nfc_tag:"\u2014 Sem etiqueta \u2014",dashboard:"Painel",settings:"Defini\xE7\xF5es",settings_features:"Fun\xE7\xF5es avan\xE7adas",settings_features_desc:"Ative ou desative fun\xE7\xF5es avan\xE7adas. Desativar oculta-as da interface mas n\xE3o elimina dados.",feat_adaptive:"Agendamento adaptativo",feat_adaptive_desc:"Aprender intervalos ideais a partir do hist\xF3rico de manuten\xE7\xE3o",feat_predictions:"Previs\xF5es do sensor",feat_predictions_desc:"Prever datas de acionamento pela degrada\xE7\xE3o do sensor",feat_seasonal:"Ajustes sazonais",feat_seasonal_desc:"Ajustar intervalos com base em padr\xF5es sazonais",feat_environmental:"Correla\xE7\xE3o ambiental",feat_environmental_desc:"Correlacionar intervalos com temperatura/humidade",feat_budget:"Controlo de or\xE7amento",feat_budget_desc:"Acompanhar despesas de manuten\xE7\xE3o mensais e anuais",feat_groups:"Grupos de tarefas",feat_groups_desc:"Organizar tarefas em grupos l\xF3gicos",feat_checklists:"Listas de verifica\xE7\xE3o",feat_checklists_desc:"Procedimentos com v\xE1rios passos para conclus\xE3o de tarefas",settings_general:"Geral",settings_default_warning:"Dias de aviso predefinidos",settings_panel_enabled:"Painel lateral",settings_notifications:"Notifica\xE7\xF5es",settings_notify_service:"Servi\xE7o de notifica\xE7\xE3o",test_notification:"Notifica\xE7\xE3o de teste",send_test:"Enviar teste",testing:"A enviar\u2026",test_notification_success:"Notifica\xE7\xE3o de teste enviada",test_notification_failed:"Falha na notifica\xE7\xE3o de teste",settings_notify_due_soon:"Notificar quando pr\xF3xima",settings_notify_overdue:"Notificar quando atrasada",settings_notify_triggered:"Notificar quando acionada",settings_interval_hours:"Intervalo de repeti\xE7\xE3o (horas, 0 = uma vez)",settings_quiet_hours:"Horas de sil\xEAncio",settings_quiet_start:"In\xEDcio",settings_quiet_end:"Fim",settings_max_per_day:"M\xE1x. notifica\xE7\xF5es por dia (0 = ilimitado)",settings_bundling:"Agrupar notifica\xE7\xF5es",settings_bundle_threshold:"Limiar de agrupamento",settings_actions:"Bot\xF5es de a\xE7\xE3o m\xF3veis",settings_action_complete:"Mostrar bot\xE3o 'Conclu\xEDda'",settings_action_skip:"Mostrar bot\xE3o 'Saltar'",settings_action_snooze:"Mostrar bot\xE3o 'Adiar'",settings_snooze_hours:"Dura\xE7\xE3o do adiamento (horas)",settings_budget:"Or\xE7amento",settings_currency:"Moeda",settings_budget_monthly:"Or\xE7amento mensal",settings_budget_yearly:"Or\xE7amento anual",settings_budget_alerts:"Alertas de or\xE7amento",settings_budget_threshold:"Limiar de alerta (%)",settings_import_export:"Importar / Exportar",settings_export_json:"Exportar JSON",settings_export_csv:"Exportar CSV",settings_import_csv:"Importar CSV",settings_import_placeholder:"Cole o conte\xFAdo JSON ou CSV aqui\u2026",settings_import_btn:"Importar",settings_import_success:"{count} objetos importados com sucesso.",settings_export_success:"Exporta\xE7\xE3o transferida.",settings_saved:"Defini\xE7\xE3o guardada.",settings_include_history:"Incluir hist\xF3rico",sort_alphabetical:"Alfab\xE9tico",sort_due_soonest:"Vencimento mais pr\xF3ximo",sort_task_count:"Quantidade de tarefas",sort_area:"\xC1rea",sort_assigned_user:"Usu\xE1rio atribu\xEDdo",sort_group:"Grupo",groupby_none:"Sem agrupamento",groupby_area:"Por \xE1rea",groupby_group:"Por grupo",groupby_user:"Por usu\xE1rio",unassigned:"N\xE3o atribu\xEDdo",no_area:"Sem \xE1rea",has_overdue:"Tarefas em atraso",object:"Objeto",settings_panel_access:"Acesso ao painel",settings_panel_access_desc:"Administradores sempre veem o painel completo. Selecione aqui usu\xE1rios n\xE3o administradores que tamb\xE9m devem ter acesso completo \u2014 os demais s\xF3 veem Concluir e Ignorar.",no_non_admin_users:"Nenhum usu\xE1rio n\xE3o administrador encontrado. Adicione em Configura\xE7\xF5es \u2192 Pessoas.",owner_label:"Propriet\xE1rio"},Qe={maintenance:"\u041E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",objects:"\u041E\u0431'\u0454\u043A\u0442\u0438",tasks:"\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F",overdue:"\u041F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u043E",due_soon:"\u041D\u0435\u0437\u0430\u0431\u0430\u0440\u043E\u043C",triggered:"\u0421\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043B\u043E",ok:"\u041D\u043E\u0440\u043C\u0430",all:"\u0412\u0441\u0456",new_object:"+ \u041D\u043E\u0432\u0438\u0439 \u043E\u0431'\u0454\u043A\u0442",edit:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438",delete:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438",add_task:"+ \u0414\u043E\u0434\u0430\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",complete:"\u0412\u0438\u043A\u043E\u043D\u0430\u0442\u0438",completed:"\u0412\u0438\u043A\u043E\u043D\u0430\u043D\u043E",skip:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438",skipped:"\u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E",reset:"\u0421\u043A\u0438\u043D\u0443\u0442\u0438",cancel:"\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438",completing:"\u0412\u0438\u043A\u043E\u043D\u0443\u0454\u0442\u044C\u0441\u044F\u2026",interval:"\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B",warning:"\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F",last_performed:"\u041E\u0441\u0442\u0430\u043D\u043D\u0454 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F",next_due:"\u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0442\u0435\u0440\u043C\u0456\u043D",days_until_due:"\u0414\u043D\u0456\u0432 \u0434\u043E \u0442\u0435\u0440\u043C\u0456\u043D\u0443",avg_duration:"\u0421\u0435\u0440. \u0442\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C",trigger:"\u0422\u0440\u0438\u0433\u0435\u0440",trigger_type:"\u0422\u0438\u043F \u0442\u0440\u0438\u0433\u0435\u0440\u0430",threshold_above:"\u0412\u0435\u0440\u0445\u043D\u044F \u043C\u0435\u0436\u0430",threshold_below:"\u041D\u0438\u0436\u043D\u044F \u043C\u0435\u0436\u0430",threshold:"\u041F\u043E\u0440\u0456\u0433",counter:"\u041B\u0456\u0447\u0438\u043B\u044C\u043D\u0438\u043A",state_change:"\u0417\u043C\u0456\u043D\u0430 \u0441\u0442\u0430\u043D\u0443",runtime:"\u041D\u0430\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F",runtime_hours:"\u0426\u0456\u043B\u044C\u043E\u0432\u0435 \u043D\u0430\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F (\u0433\u043E\u0434\u0438\u043D\u0438)",target_value:"\u0426\u0456\u043B\u044C\u043E\u0432\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",baseline:"\u0411\u0430\u0437\u043E\u0432\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",target_changes:"\u0426\u0456\u043B\u044C\u043E\u0432\u0430 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0437\u043C\u0456\u043D",for_minutes:"\u041F\u0440\u043E\u0442\u044F\u0433\u043E\u043C (\u0445\u0432\u0438\u043B\u0438\u043D)",time_based:"\u0417\u0430 \u0447\u0430\u0441\u043E\u043C",sensor_based:"\u0417\u0430 \u0441\u0435\u043D\u0441\u043E\u0440\u043E\u043C",manual:"\u0412\u0440\u0443\u0447\u043D\u0443",cleaning:"\u041E\u0447\u0438\u0449\u0435\u043D\u043D\u044F",inspection:"\u041E\u0433\u043B\u044F\u0434",replacement:"\u0417\u0430\u043C\u0456\u043D\u0430",calibration:"\u041A\u0430\u043B\u0456\u0431\u0440\u0443\u0432\u0430\u043D\u043D\u044F",service:"\u0421\u0435\u0440\u0432\u0456\u0441",custom:"\u0412\u043B\u0430\u0441\u043D\u0438\u0439",history:"\u0406\u0441\u0442\u043E\u0440\u0456\u044F",cost:"\u0412\u0430\u0440\u0442\u0456\u0441\u0442\u044C",duration:"\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C",both:"\u041E\u0431\u0438\u0434\u0432\u0430",trigger_val:"\u0417\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0442\u0440\u0438\u0433\u0435\u0440\u0430",complete_title:"\u0412\u0438\u043A\u043E\u043D\u0430\u0442\u0438: ",checklist:"\u0427\u0435\u043A\u043B\u0456\u0441\u0442",checklist_steps_optional:"\u041A\u0440\u043E\u043A\u0438 \u0447\u0435\u043A\u043B\u0456\u0441\u0442\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",checklist_placeholder:`\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0444\u0456\u043B\u044C\u0442\u0440
\u0417\u0430\u043C\u0456\u043D\u0438\u0442\u0438 \u0443\u0449\u0456\u043B\u044C\u043D\u044E\u0432\u0430\u0447
\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0438\u0442\u0438 \u0442\u0438\u0441\u043A`,checklist_help:"\u041E\u0434\u0438\u043D \u043A\u0440\u043E\u043A \u043D\u0430 \u0440\u044F\u0434\u043E\u043A. \u041C\u0430\u043A\u0441. 100 \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432.",err_too_long:"{field}: \u0437\u0430\u0434\u043E\u0432\u0433\u0435 (\u043C\u0430\u043A\u0441. {n} \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432)",err_too_short:"{field}: \u0437\u0430\u043A\u043E\u0440\u043E\u0442\u043A\u0435 (\u043C\u0456\u043D. {n} \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432)",err_value_too_high:"{field}: \u0437\u0430\u0432\u0435\u043B\u0438\u043A\u0435 (\u043C\u0430\u043A\u0441. {n})",err_value_too_low:"{field}: \u0437\u0430\u043C\u0430\u043B\u0435 (\u043C\u0456\u043D. {n})",err_required:"{field}: \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435 \u043F\u043E\u043B\u0435",err_wrong_type:"{field}: \u043D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0442\u0438\u043F (\u043E\u0447\u0456\u043A\u0443\u0432\u0430\u043B\u043E\u0441\u044C: {type})",err_invalid_choice:"{field}: \u043D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",err_invalid_value:"{field}: \u043D\u0435\u0432\u0456\u0440\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",feat_schedule_time:"\u041F\u043B\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u044F \u0437\u0430 \u0447\u0430\u0441\u043E\u043C \u0434\u043E\u0431\u0438",feat_schedule_time_desc:"\u0417\u0430\u0434\u0430\u0447\u0456 \u0441\u0442\u0430\u044E\u0442\u044C \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u0438\u043C\u0438 \u0443 \u043F\u0435\u0432\u043D\u0438\u0439 \u0447\u0430\u0441 \u0434\u043E\u0431\u0438, \u0430 \u043D\u0435 \u043E\u043F\u0456\u0432\u043D\u043E\u0447\u0456.",schedule_time_optional:"\u0427\u0430\u0441 \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u043D\u044F (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E, HH:MM)",schedule_time_help:"\u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u043E\u043F\u0456\u0432\u043D\u043E\u0447\u0456 (\u0437\u0430 \u0437\u0430\u043C\u043E\u0432\u0447\u0443\u0432\u0430\u043D\u043D\u044F\u043C). \u0427\u0430\u0441\u043E\u0432\u0438\u0439 \u043F\u043E\u044F\u0441 HA.",at_time:"\u043E",notes_optional:"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0438 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",cost_optional:"\u0412\u0430\u0440\u0442\u0456\u0441\u0442\u044C (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",duration_minutes:"\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C \u0443 \u0445\u0432\u0438\u043B\u0438\u043D\u0430\u0445 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",days:"\u0434\u043D\u0456\u0432",day:"\u0434\u0435\u043D\u044C",today:"\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456",d_overdue:"\u0434 \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u043E",no_tasks:"\u0417\u0430\u0432\u0434\u0430\u043D\u044C \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F \u0449\u0435 \u043D\u0435\u043C\u0430\u0454. \u0421\u0442\u0432\u043E\u0440\u0456\u0442\u044C \u043E\u0431'\u0454\u043A\u0442, \u0449\u043E\u0431 \u043F\u043E\u0447\u0430\u0442\u0438.",no_tasks_short:"\u041D\u0435\u043C\u0430\u0454 \u0437\u0430\u0432\u0434\u0430\u043D\u044C",no_history:"\u0417\u0430\u043F\u0438\u0441\u0456\u0432 \u0432 \u0456\u0441\u0442\u043E\u0440\u0456\u0457 \u0449\u0435 \u043D\u0435\u043C\u0430\u0454.",show_all:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456",cost_duration_chart:"\u0412\u0430\u0440\u0442\u0456\u0441\u0442\u044C \u0456 \u0442\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C",installed:"\u0412\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E",confirm_delete_object:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0446\u0435\u0439 \u043E\u0431'\u0454\u043A\u0442 \u0456 \u0432\u0441\u0456 \u0439\u043E\u0433\u043E \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F?",confirm_delete_task:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0446\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F?",min:"\u041C\u0456\u043D",max:"\u041C\u0430\u043A\u0441",save:"\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438",saving:"\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F\u2026",edit_task:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",new_task:"\u041D\u043E\u0432\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",task_name:"\u041D\u0430\u0437\u0432\u0430 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",maintenance_type:"\u0422\u0438\u043F \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",schedule_type:"\u0422\u0438\u043F \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0443",interval_days:"\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B (\u0434\u043D\u0456)",warning_days:"\u0414\u043D\u0456\u0432 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F",interval_anchor:"\u041F\u0440\u0438\u0432'\u044F\u0437\u043A\u0430 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0443",anchor_completion:"\u0412\u0456\u0434 \u0434\u0430\u0442\u0438 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F",anchor_planned:"\u0412\u0456\u0434 \u0437\u0430\u043F\u043B\u0430\u043D\u043E\u0432\u0430\u043D\u043E\u0457 \u0434\u0430\u0442\u0438 (\u0431\u0435\u0437 \u0437\u043C\u0456\u0449\u0435\u043D\u043D\u044F)",edit_object:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u043E\u0431'\u0454\u043A\u0442",name:"\u041D\u0430\u0437\u0432\u0430",manufacturer_optional:"\u0412\u0438\u0440\u043E\u0431\u043D\u0438\u043A (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",model_optional:"\u041C\u043E\u0434\u0435\u043B\u044C (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",serial_number_optional:"\u0421\u0435\u0440\u0456\u0439\u043D\u0438\u0439 \u043D\u043E\u043C\u0435\u0440 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",serial_number_label:"\u0421/\u041D",last_performed_optional:"\u041E\u0441\u0442\u0430\u043D\u043D\xE9 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",sort_due_date:"\u0414\u0430\u0442\u0430 \u0442\u0435\u0440\u043C\u0456\u043D\u0443",sort_object:"\u041D\u0430\u0437\u0432\u0430 \u043E\u0431'\u0454\u043A\u0442\u0430",sort_type:"\u0422\u0438\u043F",sort_task_name:"\u041D\u0430\u0437\u0432\u0430 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",all_objects:"\u0412\u0441\u0456 \u043E\u0431'\u0454\u043A\u0442\u0438",tasks_lower:"\u0437\u0430\u0432\u0434\u0430\u043D\u044C",no_tasks_yet:"\u0417\u0430\u0432\u0434\u0430\u043D\u044C \u0449\u0435 \u043D\u0435\u043C\u0430\u0454",add_first_task:"\u0414\u043E\u0434\u0430\u0442\u0438 \u043F\u0435\u0440\u0448\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",trigger_configuration:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0442\u0440\u0438\u0433\u0435\u0440\u0430",entity_id:"ID \u043E\u0431'\u0454\u043A\u0442\u0430",comma_separated:"\u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443",entity_logic:"\u041B\u043E\u0433\u0456\u043A\u0430 \u043E\u0431'\u0454\u043A\u0442\u0456\u0432",entity_logic_any:"\u0411\u0443\u0434\u044C-\u044F\u043A\u0438\u0439 \u043E\u0431'\u0454\u043A\u0442 \u0441\u043F\u0440\u0430\u0446\u044C\u043E\u0432\u0443\u0454",entity_logic_all:"\u0412\u0441\u0456 \u043E\u0431'\u0454\u043A\u0442\u0438 \u043C\u0430\u044E\u0442\u044C \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0442\u0438",entities:"\u043E\u0431'\u0454\u043A\u0442\u0456\u0432",attribute_optional:"\u0410\u0442\u0440\u0438\u0431\u0443\u0442 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E, \u043F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u0441\u0442\u0430\u043D)",use_entity_state:"\u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0432\u0430\u0442\u0438 \u0441\u0442\u0430\u043D \u043E\u0431'\u0454\u043A\u0442\u0430 (\u0431\u0435\u0437 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430)",trigger_above:"\u0421\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0442\u0438, \u043A\u043E\u043B\u0438 \u0432\u0438\u0449\u0435",trigger_below:"\u0421\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0442\u0438, \u043A\u043E\u043B\u0438 \u043D\u0438\u0436\u0447\u0435",for_at_least_minutes:"\u041F\u0440\u043E\u0442\u044F\u0433\u043E\u043C \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 (\u0445\u0432\u0438\u043B\u0438\u043D)",safety_interval_days:"\u0421\u0442\u0440\u0430\u0445\u043E\u0432\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B (\u0434\u043D\u0456, \u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",delta_mode:"\u0420\u0435\u0436\u0438\u043C \u0434\u0435\u043B\u044C\u0442\u0438",from_state_optional:"\u0417 \u0441\u0442\u0430\u043D\u0443 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",to_state_optional:"\u0414\u043E \u0441\u0442\u0430\u043D\u0443 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",documentation_url_optional:"URL \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0456\u0457 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",nfc_tag_id_optional:"ID NFC-\u0442\u0435\u0433\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",environmental_entity_optional:"\u0414\u0430\u0442\u0447\u0438\u043A \u043D\u0430\u0432\u043A\u043E\u043B\u0438\u0448\u043D\u044C\u043E\u0433\u043E \u0441\u0435\u0440\u0435\u0434\u043E\u0432\u0438\u0449\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",environmental_entity_helper:"\u043D\u0430\u043F\u0440. sensor.outdoor_temperature \u2014 \u043A\u043E\u0440\u0438\u0433\u0443\u0454 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u043D\u043E \u0434\u043E \u0443\u043C\u043E\u0432 \u043D\u0430\u0432\u043A\u043E\u043B\u0438\u0448\u043D\u044C\u043E\u0433\u043E \u0441\u0435\u0440\u0435\u0434\u043E\u0432\u0438\u0449\u0430",environmental_attribute_optional:"\u0410\u0442\u0440\u0438\u0431\u0443\u0442 \u0441\u0435\u0440\u0435\u0434\u043E\u0432\u0438\u0449\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",nfc_tag_id:"ID NFC-\u0442\u0435\u0433\u0430",nfc_linked:"NFC-\u0442\u0435\u0433 \u043F\u0440\u0438\u0432'\u044F\u0437\u0430\u043D\u043E",nfc_link_hint:"\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C, \u0449\u043E\u0431 \u043F\u0440\u0438\u0432'\u044F\u0437\u0430\u0442\u0438 NFC-\u0442\u0435\u0433",responsible_user:"\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u043B\u044C\u043D\u0438\u0439 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447",no_user_assigned:"(\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u043D\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043E)",all_users:"\u0412\u0441\u0456 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456",my_tasks:"\u041C\u043E\u0457 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",budget_monthly:"\u0429\u043E\u043C\u0456\u0441\u044F\u0447\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",budget_yearly:"\u0429\u043E\u0440\u0456\u0447\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",groups:"\u0413\u0440\u0443\u043F\u0438",new_group:"\u041D\u043E\u0432\u0430 \u0433\u0440\u0443\u043F\u0430",edit_group:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0433\u0440\u0443\u043F\u0443",no_groups:"\u0413\u0440\u0443\u043F \u0449\u0435 \u043D\u0435\u043C\u0430\u0454",delete_group:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0433\u0440\u0443\u043F\u0443",delete_group_confirm:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0433\u0440\u0443\u043F\u0443 '{name}'?",group_select_tasks:"\u041E\u0431\u0440\u0430\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",group_name_required:"\u041F\u043E\u0442\u0440\u0456\u0431\u043D\u0430 \u043D\u0430\u0437\u0432\u0430",description_optional:"\u041E\u043F\u0438\u0441 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",selected:"\u041E\u0431\u0440\u0430\u043D\u043E",loading_chart:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0434\u0430\u043D\u0438\u0445 \u0433\u0440\u0430\u0444\u0456\u043A\u0430...",was_maintenance_needed:"\u0427\u0438 \u0431\u0443\u043B\u043E \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0435 \u0446\u0435 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F?",feedback_needed:"\u041F\u043E\u0442\u0440\u0456\u0431\u043D\u0435",feedback_not_needed:"\u041D\u0435 \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0435",feedback_not_sure:"\u041D\u0435 \u0432\u043F\u0435\u0432\u043D\u0435\u043D\u0438\u0439",suggested_interval:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B",apply_suggestion:"\u0417\u0430\u0441\u0442\u043E\u0441\u0443\u0432\u0430\u0442\u0438",reanalyze:"\u041F\u043E\u0432\u0442\u043E\u0440\u043D\u043E \u043F\u0440\u043E\u0430\u043D\u0430\u043B\u0456\u0437\u0443\u0432\u0430\u0442\u0438",reanalyze_result:"\u041D\u043E\u0432\u0438\u0439 \u0430\u043D\u0430\u043B\u0456\u0437",reanalyze_insufficient_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u0434\u0430\u043D\u0438\u0445 \u0434\u043B\u044F \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0456\u0457",data_points:"\u0442\u043E\u0447\u043E\u043A \u0434\u0430\u043D\u0438\u0445",dismiss_suggestion:"\u0412\u0456\u0434\u0445\u0438\u043B\u0438\u0442\u0438",confidence_low:"\u041D\u0438\u0437\u044C\u043A\u0430",confidence_medium:"\u0421\u0435\u0440\u0435\u0434\u043D\u044F",confidence_high:"\u0412\u0438\u0441\u043E\u043A\u0430",recommended:"\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u043E",seasonal_awareness:"\u0421\u0435\u0437\u043E\u043D\u043D\u0430 \u043A\u043E\u0440\u0435\u043A\u0446\u0456\u044F",edit_seasonal_overrides:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0441\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442\u0438",seasonal_overrides_title:"\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442\u0438 (\u043F\u0435\u0440\u0435\u0432\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F)",seasonal_overrides_hint:"\u041A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442 \u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C (0.1\u20135.0). \u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E.",seasonal_override_invalid:"\u041D\u0435\u0434\u0456\u0439\u0441\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",seasonal_override_range:"\u041A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043C\u0456\u0436 0.1 \u0442\u0430 5.0",clear_all:"\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0432\u0441\u0435",seasonal_chart_title:"\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442\u0438",seasonal_learned:"\u041D\u0430\u0432\u0447\u0435\u043D\u0430",seasonal_manual:"\u0420\u0443\u0447\u043D\u0430",month_jan:"\u0421\u0456\u0447",month_feb:"\u041B\u044E\u0442",month_mar:"\u0411\u0435\u0440",month_apr:"\u041A\u0432\u0456",month_may:"\u0422\u0440\u0430",month_jun:"\u0427\u0435\u0440",month_jul:"\u041B\u0438\u043F",month_aug:"\u0421\u0435\u0440",month_sep:"\u0412\u0435\u0440",month_oct:"\u0416\u043E\u0432",month_nov:"\u041B\u0438\u0441",month_dec:"\u0413\u0440\u0443",sensor_prediction:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u0441\u0435\u043D\u0441\u043E\u0440\u0430",degradation_trend:"\u0422\u0440\u0435\u043D\u0434",trend_rising:"\u0417\u0440\u043E\u0441\u0442\u0430\u0454",trend_falling:"\u0421\u043F\u0430\u0434\u0430\u0454",trend_stable:"\u0421\u0442\u0430\u0431\u0456\u043B\u044C\u043D\u0438\u0439",trend_insufficient_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u0434\u0430\u043D\u0438\u0445",days_until_threshold:"\u0414\u043D\u0456\u0432 \u0434\u043E \u043F\u043E\u0440\u043E\u0433\u0443",threshold_exceeded:"\u041F\u043E\u0440\u0456\u0433 \u043F\u0435\u0440\u0435\u0432\u0438\u0449\u0435\u043D\u043E",environmental_adjustment:"\u0415\u043A\u043E\u043B\u043E\u0433\u0456\u0447\u043D\u0438\u0439 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442",sensor_prediction_urgency:"\u0421\u0435\u043D\u0441\u043E\u0440 \u043F\u0440\u043E\u0433\u043D\u043E\u0437\u0443\u0454 \u0434\u043E\u0441\u044F\u0433\u043D\u0435\u043D\u043D\u044F \u043F\u043E\u0440\u043E\u0433\u0443 \u0447\u0435\u0440\u0435\u0437 ~{days} \u0434\u043D\u0456\u0432",day_short:"\u0434\u0435\u043D\u044C",weibull_reliability_curve:"\u041A\u0440\u0438\u0432\u0430 \u043D\u0430\u0434\u0456\u0439\u043D\u043E\u0441\u0442\u0456",weibull_failure_probability:"\u0419\u043C\u043E\u0432\u0456\u0440\u043D\u0456\u0441\u0442\u044C \u0432\u0456\u0434\u043C\u043E\u0432\u0438",weibull_r_squared:"\u0422\u043E\u0447\u043D\u0456\u0441\u0442\u044C R\xB2",beta_early_failures:"\u0420\u0430\u043D\u043D\u0456 \u0432\u0456\u0434\u043C\u043E\u0432\u0438",beta_random_failures:"\u0412\u0438\u043F\u0430\u0434\u043A\u043E\u0432\u0456 \u0432\u0456\u0434\u043C\u043E\u0432\u0438",beta_wear_out:"\u0417\u043D\u043E\u0441",beta_highly_predictable:"\u0414\u0443\u0436\u0435 \u043F\u0435\u0440\u0435\u0434\u0431\u0430\u0447\u0443\u0432\u0430\u043D\u0438\u0439",confidence_interval:"\u0414\u043E\u0432\u0456\u0440\u0447\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B",confidence_conservative:"\u041A\u043E\u043D\u0441\u0435\u0440\u0432\u0430\u0442\u0438\u0432\u043D\u0438\u0439",confidence_aggressive:"\u041E\u043F\u0442\u0438\u043C\u0456\u0441\u0442\u0438\u0447\u043D\u0438\u0439",current_interval_marker:"\u041F\u043E\u0442\u043E\u0447\u043D\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B",recommended_marker:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u043E",characteristic_life:"\u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u0447\u043D\u0438\u0439 \u0440\u0435\u0441\u0443\u0440\u0441",chart_mini_sparkline:"\u041C\u0456\u043D\u0456\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u0433\u0440\u0430\u0444\u0456\u043A \u0442\u0440\u0435\u043D\u0434\u0443",chart_history:"\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0432\u0430\u0440\u0442\u043E\u0441\u0442\u0456 \u0442\u0430 \u0442\u0440\u0438\u0432\u0430\u043B\u043E\u0441\u0442\u0456",chart_seasonal:"\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442\u0438, 12 \u043C\u0456\u0441\u044F\u0446\u0456\u0432",chart_weibull:"\u041A\u0440\u0438\u0432\u0430 \u043D\u0430\u0434\u0456\u0439\u043D\u043E\u0441\u0442\u0456 \u0412\u0435\u0439\u0431\u0443\u043B\u043B\u0430",chart_sparkline:"\u0413\u0440\u0430\u0444\u0456\u043A \u0437\u043D\u0430\u0447\u0435\u043D\u044C \u0442\u0440\u0438\u0433\u0435\u0440\u0430 \u0441\u0435\u043D\u0441\u043E\u0440\u0430",days_progress:"\u041F\u0440\u043E\u0433\u0440\u0435\u0441 \u0434\u043D\u0456\u0432",qr_code:"QR-\u043A\u043E\u0434",qr_generating:"\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0456\u044F QR-\u043A\u043E\u0434\u0443\u2026",qr_error:"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0433\u0435\u043D\u0435\u0440\u0443\u0432\u0430\u0442\u0438 QR-\u043A\u043E\u0434.",qr_error_no_url:"URL Home Assistant \u043D\u0435 \u043D\u0430\u043B\u0430\u0448\u0442\u043E\u0432\u0430\u043D\u043E. \u0417\u0430\u0434\u0430\u0439\u0442\u0435 \u0437\u043E\u0432\u043D\u0456\u0448\u043D\u044E \u0430\u0431\u043E \u0432\u043D\u0443\u0442\u0440\u0456\u0448\u043D\u044E URL-\u0430\u0434\u0440\u0435\u0441\u0443 \u0432 \u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u2192 \u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u2192 \u041C\u0435\u0440\u0435\u0436\u0430.",save_error:"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0431\u0435\u0440\u0435\u0433\u0442\u0438. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.",qr_print:"\u0414\u0440\u0443\u043A\u0443\u0432\u0430\u0442\u0438",qr_download:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 SVG",qr_action:"\u0414\u0456\u044F \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456",qr_action_view:"\u041F\u0435\u0440\u0435\u0433\u043B\u044F\u043D\u0443\u0442\u0438 \u0456\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0456\u044E \u043F\u0440\u043E \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",qr_action_complete:"\u041F\u043E\u0437\u043D\u0430\u0447\u0438\u0442\u0438 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u0438\u043C",qr_url_mode:"\u0422\u0438\u043F \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F",qr_mode_companion:"Companion App",qr_mode_local:"\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u0438\u0439 (mDNS)",qr_mode_server:"URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430",overview:"\u041E\u0433\u043B\u044F\u0434",analysis:"\u0410\u043D\u0430\u043B\u0456\u0437",recent_activities:"\u041E\u0441\u0442\u0430\u043D\u043D\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u0456\u0441\u0442\u044C",search_notes:"\u041F\u043E\u0448\u0443\u043A \u0443 \u043F\u0440\u0438\u043C\u0456\u0442\u043A\u0430\u0445",avg_cost:"\u0421\u0435\u0440. \u0432\u0430\u0440\u0442\u0456\u0441\u0442\u044C",no_advanced_features:"\u0420\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0456 \u0444\u0443\u043D\u043A\u0446\u0456\u0457 \u043D\u0435 \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",no_advanced_features_hint:"\u0423\u0432\u0456\u043C\u043A\u043D\u0456\u0442\u044C \xAB\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u0456 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438\xBB \u0430\u0431\u043E \xAB\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u0437\u0430\u043A\u043E\u043D\u043E\u043C\u0456\u0440\u043D\u043E\u0441\u0442\u0456\xBB \u0432 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F\u0445 \u0456\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0456\u0457, \u0449\u043E\u0431 \u043F\u043E\u0431\u0430\u0447\u0438\u0442\u0438 \u0442\u0443\u0442 \u0434\u0430\u043D\u0456 \u0430\u043D\u0430\u043B\u0456\u0437\u0443.",analysis_not_enough_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u0434\u0430\u043D\u0438\u0445 \u0434\u043B\u044F \u0430\u043D\u0430\u043B\u0456\u0437\u0443.",analysis_not_enough_data_hint:"\u0410\u043D\u0430\u043B\u0456\u0437 \u0412\u0435\u0439\u0431\u0443\u043B\u043B\u0430 \u043F\u043E\u0442\u0440\u0435\u0431\u0443\u0454 \u0449\u043E\u043D\u0430\u0439\u043C\u0435\u043D\u0448\u0435 5 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u0438\u0445 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u044C; \u0441\u0435\u0437\u043E\u043D\u043D\u0456 \u0437\u0430\u043A\u043E\u043D\u043E\u043C\u0456\u0440\u043D\u043E\u0441\u0442\u0456 \u0441\u0442\u0430\u044E\u0442\u044C \u0432\u0438\u0434\u0438\u043C\u0438\u043C\u0438 \u043F\u0456\u0441\u043B\u044F 6+ \u0437\u0430\u043F\u0438\u0441\u0456\u0432 \u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C.",analysis_manual_task_hint:"\u0420\u0443\u0447\u043D\u0456 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0431\u0435\u0437 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0443 \u043D\u0435 \u0433\u0435\u043D\u0435\u0440\u0443\u044E\u0442\u044C \u0434\u0430\u043D\u0456 \u0430\u043D\u0430\u043B\u0456\u0437\u0443.",completions:"\u0432\u0438\u043A\u043E\u043D\u0430\u043D\u044C",current:"\u041F\u043E\u0442\u043E\u0447\u043D\u0438\u0439",shorter:"\u041A\u043E\u0440\u043E\u0442\u0448\u0438\u0439",longer:"\u0414\u043E\u0432\u0448\u0438\u0439",normal:"\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0438\u0439",disabled:"\u0412\u0438\u043C\u043A\u043D\u0435\u043D\u043E",compound_logic:"\u0421\u043A\u043B\u0430\u0434\u0435\u043D\u0430 \u043B\u043E\u0433\u0456\u043A\u0430",card_title:"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",card_show_header:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0437\u0456 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u043E\u044E",card_show_actions:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043A\u043D\u043E\u043F\u043A\u0438 \u0434\u0456\u0439",card_compact:"\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u0438\u0439 \u0440\u0435\u0436\u0438\u043C",card_max_items:"\u041C\u0430\u043A\u0441. \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432 (0 = \u0432\u0441\u0456)",card_filter_status:"\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u0437\u0430 \u0441\u0442\u0430\u0442\u0443\u0441\u043E\u043C",card_filter_status_help:"\u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456 \u0441\u0442\u0430\u0442\u0443\u0441\u0438.",card_filter_objects:"\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u0437\u0430 \u043E\u0431'\u0454\u043A\u0442\u0430\u043C\u0438",card_filter_objects_help:"\u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456 \u043E\u0431'\u0454\u043A\u0442\u0438.",card_filter_entities:"\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u0437\u0430 \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u044F\u043C\u0438 (entity_ids)",card_filter_entities_help:"\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u0456 sensor / binary_sensor \u0437 \u0446\u0456\u0454\u0457 \u0456\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0456\u0457. \u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u0432\u0441\u0456.",card_loading_objects:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u043E\u0431'\u0454\u043A\u0442\u0456\u0432\u2026",no_objects:"\u041F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454 \u043E\u0431'\u0454\u043A\u0442\u0456\u0432.",action_error:"\u0414\u0456\u044F \u043D\u0435 \u0432\u0434\u0430\u043B\u0430\u0441\u044C. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.",area_id_optional:"\u0417\u043E\u043D\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",installation_date_optional:"\u0414\u0430\u0442\u0430 \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",custom_icon_optional:"\u0406\u043A\u043E\u043D\u043A\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E, \u043D\u0430\u043F\u0440\u0438\u043A\u043B\u0430\u0434 mdi:wrench)",task_enabled:"\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",skip_reason_prompt:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438 \u0446\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F?",reason_optional:"\u041F\u0440\u0438\u0447\u0438\u043D\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",reset_date_prompt:"\u041F\u043E\u0437\u043D\u0430\u0447\u0438\u0442\u0438 \u044F\u043A \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u0435?",reset_date_optional:"\u0414\u0430\u0442\u0430 \u043E\u0441\u0442\u0430\u043D\u043D\u044C\u043E\u0433\u043E \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E, \u0442\u0438\u043F\u043E\u0432\u043E: \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456)",notes_label:"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0438",documentation_label:"\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0456\u044F",no_nfc_tag:"\u2014 \u0411\u0435\u0437 \u0442\u0435\u0433\u0430 \u2014",dashboard:"\u0414\u0430\u0448\u0431\u043E\u0440\u0434",settings:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",settings_features:"\u0420\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0456 \u0444\u0443\u043D\u043A\u0446\u0456\u0457",settings_features_desc:"\u0423\u0432\u0456\u043C\u043A\u043D\u0456\u0442\u044C \u0430\u0431\u043E \u0432\u0438\u043C\u043A\u043D\u0456\u0442\u044C \u0440\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0456 \u0444\u0443\u043D\u043A\u0446\u0456\u0457. \u0412\u0438\u043C\u043A\u043D\u0435\u043D\u043D\u044F \u043F\u0440\u0438\u0445\u043E\u0432\u0443\u0454 \u0457\u0445 \u0437 \u0456\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0443, \u0430\u043B\u0435 \u043D\u0435 \u0432\u0438\u0434\u0430\u043B\u044F\u0454 \u0434\u0430\u043D\u0456.",feat_adaptive:"\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u0435 \u043F\u043B\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u044F",feat_adaptive_desc:"\u041D\u0430\u0432\u0447\u0430\u0442\u0438\u0441\u044F \u043E\u043F\u0442\u0438\u043C\u0430\u043B\u044C\u043D\u0438\u043C \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430\u043C \u0437 \u0456\u0441\u0442\u043E\u0440\u0456\u0457 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",feat_predictions:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437\u0438 \u0437\u0430 \u0441\u0435\u043D\u0441\u043E\u0440\u0430\u043C\u0438",feat_predictions_desc:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437\u0443\u0432\u0430\u0442\u0438 \u0434\u0430\u0442\u0438 \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F \u0437\u0430 \u0434\u0435\u0433\u0440\u0430\u0434\u0430\u0446\u0456\u0454\u044E \u0441\u0435\u043D\u0441\u043E\u0440\u0430",feat_seasonal:"\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0440\u0435\u043A\u0446\u0456\u0457",feat_seasonal_desc:"\u041A\u043E\u0440\u0438\u0433\u0443\u0432\u0430\u0442\u0438 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0456 \u0441\u0435\u0437\u043E\u043D\u043D\u0438\u0445 \u0437\u0430\u043A\u043E\u043D\u043E\u043C\u0456\u0440\u043D\u043E\u0441\u0442\u0435\u0439",feat_environmental:"\u041A\u043E\u0440\u0435\u043B\u044F\u0446\u0456\u044F \u0437 \u0434\u043E\u0432\u043A\u0456\u043B\u043B\u044F\u043C",feat_environmental_desc:"\u041A\u043E\u0440\u0435\u043B\u044E\u0432\u0430\u0442\u0438 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438 \u0437 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u043E\u044E/\u0432\u043E\u043B\u043E\u0433\u0456\u0441\u0442\u044E",feat_budget:"\u0412\u0456\u0434\u0441\u0442\u0435\u0436\u0435\u043D\u043D\u044F \u0431\u044E\u0434\u0436\u0435\u0442\u0443",feat_budget_desc:"\u0412\u0456\u0434\u0441\u0442\u0435\u0436\u0443\u0432\u0430\u0442\u0438 \u0449\u043E\u043C\u0456\u0441\u044F\u0447\u043D\u0456 \u0442\u0430 \u0449\u043E\u0440\u0456\u0447\u043D\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438 \u043D\u0430 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",feat_groups:"\u0413\u0440\u0443\u043F\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u044C",feat_groups_desc:"\u041E\u0440\u0433\u0430\u043D\u0456\u0437\u043E\u0432\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0432 \u043B\u043E\u0433\u0456\u0447\u043D\u0456 \u0433\u0440\u0443\u043F\u0438",feat_checklists:"\u0427\u0435\u043A\u043B\u0456\u0441\u0442\u0438",feat_checklists_desc:"\u0411\u0430\u0433\u0430\u0442\u043E\u043A\u0440\u043E\u043A\u043E\u0432\u0456 \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0438 \u0434\u043B\u044F \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F \u0437\u0430\u0432\u0434\u0430\u043D\u044C",settings_general:"\u0417\u0430\u0433\u0430\u043B\u044C\u043D\u0435",settings_default_warning:"\u0414\u043D\u0456\u0432 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F \u0437\u0430 \u0437\u0430\u043C\u043E\u0432\u0447\u0443\u0432\u0430\u043D\u043D\u044F\u043C",settings_panel_enabled:"\u041F\u0430\u043D\u0435\u043B\u044C \u0443 \u0431\u0456\u0447\u043D\u043E\u043C\u0443 \u043C\u0435\u043D\u044E",settings_notifications:"\u0421\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",settings_notify_service:"\u0421\u043B\u0443\u0436\u0431\u0430 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u044C",test_notification:"\u0422\u0435\u0441\u0442\u043E\u0432\u0435 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",send_test:"\u041D\u0430\u0434\u0456\u0441\u043B\u0430\u0442\u0438 \u0442\u0435\u0441\u0442",testing:"\u041D\u0430\u0434\u0441\u0438\u043B\u0430\u043D\u043D\u044F\u2026",test_notification_success:"\u0422\u0435\u0441\u0442\u043E\u0432\u0435 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F \u043D\u0430\u0434\u0456\u0441\u043B\u0430\u043D\u043E",test_notification_failed:"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u043D\u0430\u0434\u0456\u0441\u043B\u0430\u0442\u0438 \u0442\u0435\u0441\u0442\u043E\u0432\u0435 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",settings_notify_due_soon:"\u0421\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438, \u043A\u043E\u043B\u0438 \u0442\u0435\u0440\u043C\u0456\u043D \u043D\u0430\u0431\u043B\u0438\u0436\u0430\u0454\u0442\u044C\u0441\u044F",settings_notify_overdue:"\u0421\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438 \u043F\u0440\u043E \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u043D\u044F",settings_notify_triggered:"\u0421\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438 \u043F\u0440\u043E \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F",settings_interval_hours:"\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u043D\u044F (\u0433\u043E\u0434\u0438\u043D\u0438, 0 = \u043E\u0434\u043D\u043E\u0440\u0430\u0437\u043E\u0432\u043E)",settings_quiet_hours:"\u0422\u0438\u0445\u0456 \u0433\u043E\u0434\u0438\u043D\u0438",settings_quiet_start:"\u041F\u043E\u0447\u0430\u0442\u043E\u043A",settings_quiet_end:"\u041A\u0456\u043D\u0435\u0446\u044C",settings_max_per_day:"\u041C\u0430\u043A\u0441. \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u044C \u043D\u0430 \u0434\u0435\u043D\u044C (0 = \u0431\u0435\u0437 \u043E\u0431\u043C\u0435\u0436\u0435\u043D\u044C)",settings_bundling:"\u0413\u0440\u0443\u043F\u0443\u0432\u0430\u0442\u0438 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",settings_bundle_threshold:"\u041F\u043E\u0440\u0456\u0433 \u0433\u0440\u0443\u043F\u0443\u0432\u0430\u043D\u043D\u044F",settings_actions:"\u041A\u043D\u043E\u043F\u043A\u0438 \u0434\u0456\u0439 \u0443 \u043C\u043E\u0431\u0456\u043B\u044C\u043D\u0438\u0445 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F\u0445",settings_action_complete:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u0412\u0438\u043A\u043E\u043D\u0430\u0442\u0438\xBB",settings_action_skip:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438\xBB",settings_action_snooze:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u0412\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438\xBB",settings_snooze_hours:"\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C \u0432\u0456\u0434\u043A\u043B\u0430\u0434\u0435\u043D\u043D\u044F (\u0433\u043E\u0434\u0438\u043D\u0438)",settings_budget:"\u0411\u044E\u0434\u0436\u0435\u0442",settings_currency:"\u0412\u0430\u043B\u044E\u0442\u0430",settings_budget_monthly:"\u0429\u043E\u043C\u0456\u0441\u044F\u0447\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_yearly:"\u0429\u043E\u0440\u0456\u0447\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_alerts:"\u0421\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F \u043F\u0440\u043E \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_threshold:"\u041F\u043E\u0440\u0456\u0433 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F (%)",settings_import_export:"\u0406\u043C\u043F\u043E\u0440\u0442 / \u0415\u043A\u0441\u043F\u043E\u0440\u0442",settings_export_json:"\u0415\u043A\u0441\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438 JSON",settings_export_csv:"\u0415\u043A\u0441\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438 CSV",settings_import_csv:"\u0406\u043C\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438 CSV",settings_import_placeholder:"\u0412\u0441\u0442\u0430\u0432\u0442\u0435 \u0432\u043C\u0456\u0441\u0442 JSON \u0430\u0431\u043E CSV \u0441\u044E\u0434\u0438\u2026",settings_import_btn:"\u0406\u043C\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438",settings_import_success:"{count} \u043E\u0431'\u0454\u043A\u0442\u0456\u0432 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0456\u043C\u043F\u043E\u0440\u0442\u043E\u0432\u0430\u043D\u043E.",settings_export_success:"\u0415\u043A\u0441\u043F\u043E\u0440\u0442 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043E.",settings_saved:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E.",settings_include_history:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0438 \u0456\u0441\u0442\u043E\u0440\u0456\u044E",sort_alphabetical:"\u0417\u0430 \u0430\u043B\u0444\u0430\u0432\u0456\u0442\u043E\u043C",sort_due_soonest:"\u041D\u0430\u0439\u0431\u043B\u0438\u0436\u0447\u0438\u0439 \u0442\u0435\u0440\u043C\u0456\u043D",sort_task_count:"\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0437\u0430\u0432\u0434\u0430\u043D\u044C",sort_area:"\u0417\u043E\u043D\u0430",sort_assigned_user:"\u041F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447",sort_group:"\u0413\u0440\u0443\u043F\u0430",groupby_none:"\u0411\u0435\u0437 \u0433\u0440\u0443\u043F\u0443\u0432\u0430\u043D\u043D\u044F",groupby_area:"\u0417\u0430 \u0437\u043E\u043D\u043E\u044E",groupby_group:"\u0417\u0430 \u0433\u0440\u0443\u043F\u043E\u044E",groupby_user:"\u0417\u0430 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0435\u043C",unassigned:"\u041D\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043E",no_area:"\u0411\u0435\u0437 \u0437\u043E\u043D\u0438",has_overdue:"\u041F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u0456 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",object:"\u041E\u0431'\u0454\u043A\u0442",settings_panel_access:"\u0414\u043E\u0441\u0442\u0443\u043F \u0434\u043E \u043F\u0430\u043D\u0435\u043B\u0456",settings_panel_access_desc:"\u0410\u0434\u043C\u0456\u043D\u0456\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0438 \u0437\u0430\u0432\u0436\u0434\u0438 \u0431\u0430\u0447\u0430\u0442\u044C \u043F\u043E\u0432\u043D\u0443 \u043F\u0430\u043D\u0435\u043B\u044C. \u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0442\u0443\u0442 \u043D\u0435-\u0430\u0434\u043C\u0456\u043D \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456\u0432, \u044F\u043A\u0456 \u0442\u0430\u043A\u043E\u0436 \u043F\u043E\u0432\u0438\u043D\u043D\u0456 \u043C\u0430\u0442\u0438 \u043F\u043E\u0432\u043D\u0438\u0439 \u0434\u043E\u0441\u0442\u0443\u043F \u2014 \u0456\u043D\u0448\u0456 \u0431\u0430\u0447\u0430\u0442\u044C \u043B\u0438\u0448\u0435 \u0412\u0438\u043A\u043E\u043D\u0430\u0442\u0438 \u0442\u0430 \u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438.",no_non_admin_users:"\u041D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043D\u0435-\u0430\u0434\u043C\u0456\u043D \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456\u0432. \u0414\u043E\u0434\u0430\u0439\u0442\u0435 \u0457\u0445 \u0443 \u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F\u0445 \u2192 \u041E\u0441\u043E\u0431\u0438.",owner_label:"\u0412\u043B\u0430\u0441\u043D\u0438\u043A"},Ye={maintenance:"\u041E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435",objects:"\u041E\u0431\u044A\u0435\u043A\u0442\u044B",tasks:"\u0417\u0430\u0434\u0430\u0447\u0438",overdue:"\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043E",due_soon:"\u0421\u043A\u043E\u0440\u043E",triggered:"\u0421\u0440\u0430\u0431\u043E\u0442\u0430\u043B\u043E",ok:"OK",all:"\u0412\u0441\u0435",new_object:"+ \u041D\u043E\u0432\u044B\u0439 \u043E\u0431\u044A\u0435\u043A\u0442",edit:"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C",delete:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C",add_task:"+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443",complete:"\u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C",completed:"\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E",skip:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C",skipped:"\u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E",reset:"\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C",cancel:"\u041E\u0442\u043C\u0435\u043D\u0430",completing:"\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435\u2026",interval:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",warning:"\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435",last_performed:"\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435",next_due:"\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0441\u0440\u043E\u043A",days_until_due:"\u0414\u043D\u0435\u0439 \u0434\u043E \u0441\u0440\u043E\u043A\u0430",avg_duration:"\u0421\u0440. \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",trigger:"\u0422\u0440\u0438\u0433\u0433\u0435\u0440",trigger_type:"\u0422\u0438\u043F \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u0430",threshold_above:"\u0412\u0435\u0440\u0445\u043D\u0438\u0439 \u043F\u0440\u0435\u0434\u0435\u043B",threshold_below:"\u041D\u0438\u0436\u043D\u0438\u0439 \u043F\u0440\u0435\u0434\u0435\u043B",threshold:"\u041F\u043E\u0440\u043E\u0433",counter:"\u0421\u0447\u0451\u0442\u0447\u0438\u043A",state_change:"\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F",runtime:"\u0412\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B",runtime_hours:"\u0426\u0435\u043B\u0435\u0432\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B (\u0447\u0430\u0441\u044B)",target_value:"\u0426\u0435\u043B\u0435\u0432\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",baseline:"\u0411\u0430\u0437\u043E\u0432\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",target_changes:"\u0426\u0435\u043B\u0435\u0432\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",for_minutes:"\u041D\u0430 (\u043C\u0438\u043D\u0443\u0442)",time_based:"\u041F\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438",sensor_based:"\u041F\u043E \u0434\u0430\u0442\u0447\u0438\u043A\u0443",manual:"\u0412\u0440\u0443\u0447\u043D\u0443\u044E",cleaning:"\u0427\u0438\u0441\u0442\u043A\u0430",inspection:"\u041E\u0441\u043C\u043E\u0442\u0440",replacement:"\u0417\u0430\u043C\u0435\u043D\u0430",calibration:"\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430",service:"\u0421\u0435\u0440\u0432\u0438\u0441",custom:"\u0421\u0432\u043E\u0451",history:"\u0418\u0441\u0442\u043E\u0440\u0438\u044F",cost:"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",duration:"\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",both:"\u041E\u0431\u0430",trigger_val:"\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u0430",complete_title:"\u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C: ",checklist:"\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",checklist_steps_optional:"\u0428\u0430\u0433\u0438 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)",checklist_placeholder:`\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440
\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u0443\u043F\u043B\u043E\u0442\u043D\u0438\u0442\u0435\u043B\u044C
\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0434\u0430\u0432\u043B\u0435\u043D\u0438\u0435`,checklist_help:"\u041E\u0434\u0438\u043D \u0448\u0430\u0433 \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0443. \u041C\u0430\u043A\u0441. 100 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432.",err_too_long:"{field}: \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0434\u043B\u0438\u043D\u043D\u043E (\u043C\u0430\u043A\u0441. {n} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)",err_too_short:"{field}: \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043A\u043E\u0440\u043E\u0442\u043A\u043E (\u043C\u0438\u043D. {n} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)",err_value_too_high:"{field}: \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0432\u0435\u043B\u0438\u043A\u043E (\u043C\u0430\u043A\u0441. {n})",err_value_too_low:"{field}: \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u043E (\u043C\u0438\u043D. {n})",err_required:"{field}: \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u043B\u0435",err_wrong_type:"{field}: \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0442\u0438\u043F (\u043E\u0436\u0438\u0434\u0430\u043B\u0441\u044F: {type})",err_invalid_choice:"{field}: \u043D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",err_invalid_value:"{field}: \u043D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",feat_schedule_time:"\u041F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0434\u043D\u044F",feat_schedule_time_desc:"\u0417\u0430\u0434\u0430\u0447\u0438 \u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0442\u0441\u044F \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043D\u044B\u043C\u0438 \u0432 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0451\u043D\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0434\u043D\u044F, \u0430 \u043D\u0435 \u0432 \u043F\u043E\u043B\u043D\u043E\u0447\u044C.",schedule_time_optional:"\u0421\u0440\u043E\u043A (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E, HH:MM)",schedule_time_help:"\u041F\u0443\u0441\u0442\u043E = \u043F\u043E\u043B\u043D\u043E\u0447\u044C (\u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E). \u0427\u0430\u0441\u043E\u0432\u043E\u0439 \u043F\u043E\u044F\u0441 HA.",at_time:"\u0432",notes_optional:"\u041F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u044F (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",cost_optional:"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",duration_minutes:"\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0432 \u043C\u0438\u043D\u0443\u0442\u0430\u0445 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",days:"\u0434\u043D\u0435\u0439",day:"\u0434\u0435\u043D\u044C",today:"\u0421\u0435\u0433\u043E\u0434\u043D\u044F",d_overdue:"\u0434\u043D. \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043E",no_tasks:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447 \u043F\u043E \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044E. \u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043E\u0431\u044A\u0435\u043A\u0442, \u0447\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C.",no_tasks_short:"\u041D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447",no_history:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0432 \u0438\u0441\u0442\u043E\u0440\u0438\u0438.",show_all:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435",cost_duration_chart:"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0438 \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",installed:"\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D",confirm_delete_object:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u043E\u0442 \u043E\u0431\u044A\u0435\u043A\u0442 \u0438 \u0432\u0441\u0435 \u0435\u0433\u043E \u0437\u0430\u0434\u0430\u0447\u0438?",confirm_delete_task:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u0443 \u0437\u0430\u0434\u0430\u0447\u0443?",min:"\u041C\u0438\u043D",max:"\u041C\u0430\u043A\u0441",save:"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",saving:"\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u2026",edit_task:"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443",new_task:"\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",task_name:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",maintenance_type:"\u0422\u0438\u043F \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",schedule_type:"\u0422\u0438\u043F \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F",interval_days:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B (\u0434\u043D\u0438)",warning_days:"\u0414\u043D\u0438 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F",interval_anchor:"\u042F\u043A\u043E\u0440\u044C \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430",anchor_completion:"\u041E\u0442 \u0434\u0430\u0442\u044B \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F",anchor_planned:"\u041E\u0442 \u043F\u043B\u0430\u043D\u043E\u0432\u043E\u0439 \u0434\u0430\u0442\u044B (\u0431\u0435\u0437 \u0441\u043C\u0435\u0449\u0435\u043D\u0438\u044F)",edit_object:"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442",name:"\u0418\u043C\u044F",manufacturer_optional:"\u041F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",model_optional:"\u041C\u043E\u0434\u0435\u043B\u044C (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",serial_number_optional:"\u0421\u0435\u0440\u0438\u0439\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",serial_number_label:"\u0421/\u041D",sort_due_date:"\u0421\u0440\u043E\u043A",sort_object:"\u0418\u043C\u044F \u043E\u0431\u044A\u0435\u043A\u0442\u0430",sort_type:"\u0422\u0438\u043F",sort_task_name:"\u0418\u043C\u044F \u0437\u0430\u0434\u0430\u0447\u0438",all_objects:"\u0412\u0441\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u044B",tasks_lower:"\u0437\u0430\u0434\u0430\u0447",no_tasks_yet:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447",add_first_task:"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0435\u0440\u0432\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443",last_performed_optional:"\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",trigger_configuration:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u0430",entity_id:"ID \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438",comma_separated:"\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E",entity_logic:"\u041B\u043E\u0433\u0438\u043A\u0430 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439",entity_logic_any:"\u041B\u044E\u0431\u0430\u044F \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u044C \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442",entity_logic_all:"\u0412\u0441\u0435 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u0441\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C",entities:"\u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438",attribute_optional:"\u0410\u0442\u0440\u0438\u0431\u0443\u0442 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E, \u043F\u0443\u0441\u0442\u043E = \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435)",use_entity_state:"\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438 (\u0431\u0435\u0437 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430)",trigger_above:"\u0421\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0442\u044C \u0432\u044B\u0448\u0435",trigger_below:"\u0421\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0442\u044C \u043D\u0438\u0436\u0435",for_at_least_minutes:"\u041D\u0435 \u043C\u0435\u043D\u0435\u0435 (\u043C\u0438\u043D\u0443\u0442)",safety_interval_days:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438 (\u0434\u043D\u0438, \u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",delta_mode:"\u0420\u0435\u0436\u0438\u043C \u0434\u0435\u043B\u044C\u0442\u044B",from_state_optional:"\u0418\u0437 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",to_state_optional:"\u0412 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",documentation_url_optional:"URL \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u0438 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",nfc_tag_id_optional:"ID NFC-\u043C\u0435\u0442\u043A\u0438 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",environmental_entity_optional:"\u0414\u0430\u0442\u0447\u0438\u043A \u043E\u043A\u0440\u0443\u0436\u0430\u044E\u0449\u0435\u0439 \u0441\u0440\u0435\u0434\u044B (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",environmental_entity_helper:"\u043D\u0430\u043F\u0440. sensor.outdoor_temperature \u2014 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u0443\u0435\u0442 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u0443\u0441\u043B\u043E\u0432\u0438\u0439",environmental_attribute_optional:"\u0410\u0442\u0440\u0438\u0431\u0443\u0442 \u0441\u0440\u0435\u0434\u044B (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",nfc_tag_id:"ID NFC-\u043C\u0435\u0442\u043A\u0438",nfc_linked:"NFC-\u043C\u0435\u0442\u043A\u0430 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D\u0430",nfc_link_hint:"\u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C NFC-\u043C\u0435\u0442\u043A\u0443",responsible_user:"\u041E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",no_user_assigned:"(\u041D\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D)",all_users:"\u0412\u0441\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438",my_tasks:"\u041C\u043E\u0438 \u0437\u0430\u0434\u0430\u0447\u0438",budget_monthly:"\u041C\u0435\u0441\u044F\u0447\u043D\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",budget_yearly:"\u0413\u043E\u0434\u043E\u0432\u043E\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",groups:"\u0413\u0440\u0443\u043F\u043F\u044B",new_group:"\u041D\u043E\u0432\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430",edit_group:"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443",no_groups:"\u0413\u0440\u0443\u043F\u043F \u043F\u043E\u043A\u0430 \u043D\u0435\u0442",delete_group:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443",delete_group_confirm:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443 '{name}'?",group_select_tasks:"\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0438",group_name_required:"\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0438\u043C\u044F",description_optional:"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",selected:"\u0412\u044B\u0431\u0440\u0430\u043D\u043E",loading_chart:"\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0433\u0440\u0430\u0444\u0438\u043A\u0430...",was_maintenance_needed:"\u0422\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u043E\u0441\u044C \u043B\u0438 \u044D\u0442\u043E \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435?",feedback_needed:"\u0422\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u043E\u0441\u044C",feedback_not_needed:"\u041D\u0435 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u043E\u0441\u044C",feedback_not_sure:"\u041D\u0435 \u0443\u0432\u0435\u0440\u0435\u043D",suggested_interval:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u043C\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",apply_suggestion:"\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C",reanalyze:"\u041F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0437",reanalyze_result:"\u041D\u043E\u0432\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0437",reanalyze_insufficient_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438",data_points:"\u0442\u043E\u0447\u0435\u043A \u0434\u0430\u043D\u043D\u044B\u0445",dismiss_suggestion:"\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C",confidence_low:"\u041D\u0438\u0437\u043A\u0430\u044F",confidence_medium:"\u0421\u0440\u0435\u0434\u043D\u044F\u044F",confidence_high:"\u0412\u044B\u0441\u043E\u043A\u0430\u044F",recommended:"\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F",seasonal_awareness:"\u0421\u0435\u0437\u043E\u043D\u043D\u0430\u044F \u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u044F",edit_seasonal_overrides:"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442\u044B",seasonal_overrides_title:"\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442\u044B (\u043F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0435)",seasonal_overrides_hint:"\u041A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442 \u043D\u0430 \u043C\u0435\u0441\u044F\u0446 (0.1\u20135.0). \u041F\u0443\u0441\u0442\u043E = \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438.",seasonal_override_invalid:"\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",seasonal_override_range:"\u041A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043E\u0442 0.1 \u0434\u043E 5.0",clear_all:"\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0435",seasonal_chart_title:"\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u0444\u0430\u043A\u0442\u043E\u0440\u044B",seasonal_learned:"\u0418\u0437\u0443\u0447\u0435\u043D\u043D\u044B\u0435",seasonal_manual:"\u0420\u0443\u0447\u043D\u044B\u0435",month_jan:"\u042F\u043D\u0432",month_feb:"\u0424\u0435\u0432",month_mar:"\u041C\u0430\u0440",month_apr:"\u0410\u043F\u0440",month_may:"\u041C\u0430\u0439",month_jun:"\u0418\u044E\u043D",month_jul:"\u0418\u044E\u043B",month_aug:"\u0410\u0432\u0433",month_sep:"\u0421\u0435\u043D",month_oct:"\u041E\u043A\u0442",month_nov:"\u041D\u043E\u044F",month_dec:"\u0414\u0435\u043A",sensor_prediction:"\u041F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0430\u043D\u0438\u0435 \u043F\u043E \u0434\u0430\u0442\u0447\u0438\u043A\u0443",degradation_trend:"\u0422\u0440\u0435\u043D\u0434",trend_rising:"\u0420\u0430\u0441\u0442\u0443\u0449\u0438\u0439",trend_falling:"\u041F\u0430\u0434\u0430\u044E\u0449\u0438\u0439",trend_stable:"\u0421\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0439",trend_insufficient_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0445",days_until_threshold:"\u0414\u043D\u0435\u0439 \u0434\u043E \u043F\u043E\u0440\u043E\u0433\u0430",threshold_exceeded:"\u041F\u043E\u0440\u043E\u0433 \u043F\u0440\u0435\u0432\u044B\u0448\u0435\u043D",environmental_adjustment:"\u0424\u0430\u043A\u0442\u043E\u0440 \u0441\u0440\u0435\u0434\u044B",sensor_prediction_urgency:"\u0414\u0430\u0442\u0447\u0438\u043A \u043F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043F\u043E\u0440\u043E\u0433 \u0447\u0435\u0440\u0435\u0437 ~{days} \u0434\u043D\u0435\u0439",day_short:"\u0434\u043D",weibull_reliability_curve:"\u041A\u0440\u0438\u0432\u0430\u044F \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0441\u0442\u0438",weibull_failure_probability:"\u0412\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044C \u043E\u0442\u043A\u0430\u0437\u0430",weibull_r_squared:"\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0430\u043F\u043F\u0440\u043E\u043A\u0441\u0438\u043C\u0430\u0446\u0438\u0438 R\xB2",beta_early_failures:"\u0420\u0430\u043D\u043D\u0438\u0435 \u043E\u0442\u043A\u0430\u0437\u044B",beta_random_failures:"\u0421\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0435 \u043E\u0442\u043A\u0430\u0437\u044B",beta_wear_out:"\u0418\u0437\u043D\u043E\u0441",beta_highly_predictable:"\u0412\u044B\u0441\u043E\u043A\u0430\u044F \u043F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0443\u0435\u043C\u043E\u0441\u0442\u044C",confidence_interval:"\u0414\u043E\u0432\u0435\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",confidence_conservative:"\u041A\u043E\u043D\u0441\u0435\u0440\u0432\u0430\u0442\u0438\u0432\u043D\u044B\u0439",confidence_aggressive:"\u041E\u043F\u0442\u0438\u043C\u0438\u0441\u0442\u0438\u0447\u043D\u044B\u0439",current_interval_marker:"\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",recommended_marker:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u043C\u044B\u0439",characteristic_life:"\u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0441\u0440\u043E\u043A \u0441\u043B\u0443\u0436\u0431\u044B",chart_mini_sparkline:"\u041C\u0438\u043D\u0438-\u0433\u0440\u0430\u0444\u0438\u043A \u0442\u0440\u0435\u043D\u0434\u0430",chart_history:"\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u0438 \u0438 \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0438",chart_seasonal:"\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u0444\u0430\u043A\u0442\u043E\u0440\u044B, 12 \u043C\u0435\u0441\u044F\u0446\u0435\u0432",chart_weibull:"\u041A\u0440\u0438\u0432\u0430\u044F \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0441\u0442\u0438 \u0412\u0435\u0439\u0431\u0443\u043B\u043B\u0430",chart_sparkline:"\u0413\u0440\u0430\u0444\u0438\u043A \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u0430 \u0434\u0430\u0442\u0447\u0438\u043A\u0430",days_progress:"\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u043F\u043E \u0434\u043D\u044F\u043C",qr_code:"QR-\u043A\u043E\u0434",qr_generating:"\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F QR-\u043A\u043E\u0434\u0430\u2026",qr_error:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C QR-\u043A\u043E\u0434.",qr_error_no_url:"URL HA \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D. \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u0432\u043D\u0435\u0448\u043D\u0438\u0439 \u0438\u043B\u0438 \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u0439 URL \u0432 \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u2192 \u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u2192 \u0421\u0435\u0442\u044C.",save_error:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.",qr_print:"\u041F\u0435\u0447\u0430\u0442\u044C",qr_download:"\u0421\u043A\u0430\u0447\u0430\u0442\u044C SVG",qr_action:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438",qr_action_view:"\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043E\u0431 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0438",qr_action_complete:"\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u043E\u0435",qr_url_mode:"\u0422\u0438\u043F \u0441\u0441\u044B\u043B\u043A\u0438",qr_mode_companion:"\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435-\u043A\u043E\u043C\u043F\u0430\u043D\u044C\u043E\u043D",qr_mode_local:"\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 (mDNS)",qr_mode_server:"URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430",overview:"\u041E\u0431\u0437\u043E\u0440",analysis:"\u0410\u043D\u0430\u043B\u0438\u0437",recent_activities:"\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",search_notes:"\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0437\u0430\u043C\u0435\u0442\u043A\u0430\u043C",avg_cost:"\u0421\u0440. \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",no_advanced_features:"\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438 \u043D\u0435 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B",no_advanced_features_hint:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \xAB\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u044B\u0435 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B\xBB \u0438\u043B\u0438 \xAB\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u044B\xBB \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0437\u0434\u0435\u0441\u044C \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0443.",analysis_not_enough_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0430\u043D\u0430\u043B\u0438\u0437\u0430.",analysis_not_enough_data_hint:"\u0414\u043B\u044F \u0430\u043D\u0430\u043B\u0438\u0437\u0430 \u0412\u0435\u0439\u0431\u0443\u043B\u043B\u0430 \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u043C\u0438\u043D\u0438\u043C\u0443\u043C 5 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u044B\u0445 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0439; \u0441\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u044B \u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0442\u0441\u044F \u0432\u0438\u0434\u043D\u044B \u043F\u043E\u0441\u043B\u0435 6+ \u0442\u043E\u0447\u0435\u043A \u0434\u0430\u043D\u043D\u044B\u0445 \u0432 \u043C\u0435\u0441\u044F\u0446.",analysis_manual_task_hint:"\u0420\u0443\u0447\u043D\u044B\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0431\u0435\u0437 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430 \u043D\u0435 \u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u044E\u0442 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0443.",completions:"\u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0439",current:"\u0422\u0435\u043A\u0443\u0449\u0438\u0439",shorter:"\u041A\u043E\u0440\u043E\u0447\u0435",longer:"\u0414\u043B\u0438\u043D\u043D\u0435\u0435",normal:"\u041D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u044B\u0439",disabled:"\u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E",compound_logic:"\u0421\u043E\u0441\u0442\u0430\u0432\u043D\u0430\u044F \u043B\u043E\u0433\u0438\u043A\u0430",card_title:"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",card_show_header:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u043E \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u043E\u0439",card_show_actions:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439",card_compact:"\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C",card_max_items:"\u041C\u0430\u043A\u0441. \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 (0 = \u0432\u0441\u0435)",card_filter_status:"\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u0443",card_filter_status_help:"\u041F\u0443\u0441\u0442\u043E = \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u044B.",card_filter_objects:"\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E \u043E\u0431\u044A\u0435\u043A\u0442\u0430\u043C",card_filter_objects_help:"\u041F\u0443\u0441\u0442\u043E = \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u044B.",card_filter_entities:"\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u044F\u043C (entity_ids)",card_filter_entities_help:"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438 sensor / binary_sensor \u0438\u0437 \u044D\u0442\u043E\u0439 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438. \u041F\u0443\u0441\u0442\u043E = \u0432\u0441\u0435.",card_loading_objects:"\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432\u2026",no_objects:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432.",action_error:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.",area_id_optional:"\u0417\u043E\u043D\u0430 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",installation_date_optional:"\u0414\u0430\u0442\u0430 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",custom_icon_optional:"\u0418\u043A\u043E\u043D\u043A\u0430 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 mdi:wrench)",task_enabled:"\u0417\u0430\u0434\u0430\u0447\u0430 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0430",skip_reason_prompt:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u044D\u0442\u0443 \u0437\u0430\u0434\u0430\u0447\u0443?",reason_optional:"\u041F\u0440\u0438\u0447\u0438\u043D\u0430 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",reset_date_prompt:"\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443 \u043A\u0430\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u0443\u044E?",reset_date_optional:"\u0414\u0430\u0442\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0433\u043E \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E, \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E: \u0441\u0435\u0433\u043E\u0434\u043D\u044F)",notes_label:"\u041F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u044F",documentation_label:"\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F",no_nfc_tag:"\u2014 \u041D\u0435\u0442 \u043C\u0435\u0442\u043A\u0438 \u2014",dashboard:"\u041F\u0430\u043D\u0435\u043B\u044C",settings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",settings_features:"\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438",settings_features_desc:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0438\u043B\u0438 \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438. \u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0441\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0438\u0445 \u0438\u0437 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430, \u043D\u043E \u043D\u0435 \u0443\u0434\u0430\u043B\u044F\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0435.",feat_adaptive:"\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u043E\u0435 \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",feat_adaptive_desc:"\u0418\u0437\u0443\u0447\u0430\u0442\u044C \u043E\u043F\u0442\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0435 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B \u0438\u0437 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",feat_predictions:"\u041F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0430\u043D\u0438\u044F \u043F\u043E \u0434\u0430\u0442\u0447\u0438\u043A\u0430\u043C",feat_predictions_desc:"\u041F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0434\u0430\u0442\u044B \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u043D\u0438\u044F \u043F\u043E \u0434\u0435\u0433\u0440\u0430\u0434\u0430\u0446\u0438\u0438 \u0434\u0430\u0442\u0447\u0438\u043A\u0430",feat_seasonal:"\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u043A\u0438",feat_seasonal_desc:"\u041A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0441\u0435\u0437\u043E\u043D\u043D\u044B\u0445 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u043E\u0432",feat_environmental:"\u042D\u043A\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043A\u043E\u0440\u0440\u0435\u043B\u044F\u0446\u0438\u044F",feat_environmental_desc:"\u0421\u0432\u044F\u0437\u044B\u0432\u0430\u0442\u044C \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B \u0441 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u043E\u0439/\u0432\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C\u044E",feat_budget:"\u041E\u0442\u0441\u043B\u0435\u0436\u0438\u0432\u0430\u043D\u0438\u0435 \u0431\u044E\u0434\u0436\u0435\u0442\u0430",feat_budget_desc:"\u041E\u0442\u0441\u043B\u0435\u0436\u0438\u0432\u0430\u0442\u044C \u043C\u0435\u0441\u044F\u0447\u043D\u044B\u0435 \u0438 \u0433\u043E\u0434\u043E\u0432\u044B\u0435 \u0440\u0430\u0441\u0445\u043E\u0434\u044B \u043D\u0430 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435",feat_groups:"\u0413\u0440\u0443\u043F\u043F\u044B \u0437\u0430\u0434\u0430\u0447",feat_groups_desc:"\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u043E\u0432\u044B\u0432\u0430\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0438 \u0432 \u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B",feat_checklists:"\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C\u043D\u044B\u0435 \u0441\u043F\u0438\u0441\u043A\u0438",feat_checklists_desc:"\u041C\u043D\u043E\u0433\u043E\u0448\u0430\u0433\u043E\u0432\u044B\u0435 \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u044B \u0434\u043B\u044F \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u0437\u0430\u0434\u0430\u0447\u0438",settings_general:"\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435",settings_default_warning:"\u0414\u043D\u0438 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",settings_panel_enabled:"\u0411\u043E\u043A\u043E\u0432\u0430\u044F \u043F\u0430\u043D\u0435\u043B\u044C",settings_notifications:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",settings_notify_service:"\u0421\u0435\u0440\u0432\u0438\u0441 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439",test_notification:"\u0422\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435",send_test:"\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0442\u0435\u0441\u0442",testing:"\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430\u2026",test_notification_success:"\u0422\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E",test_notification_failed:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0442\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435",settings_notify_due_soon:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C, \u043A\u043E\u0433\u0434\u0430 \u0441\u0440\u043E\u043A \u0441\u043A\u043E\u0440\u043E \u0438\u0441\u0442\u0435\u043A\u0430\u0435\u0442",settings_notify_overdue:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C \u043F\u0440\u0438 \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u043A\u0435",settings_notify_triggered:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C \u043F\u0440\u0438 \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u043D\u0438\u0438",settings_interval_hours:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u044F (\u0447\u0430\u0441\u044B, 0 = \u043E\u0434\u0438\u043D \u0440\u0430\u0437)",settings_quiet_hours:"\u0427\u0430\u0441\u044B \u0442\u0438\u0448\u0438\u043D\u044B",settings_quiet_start:"\u041D\u0430\u0447\u0430\u043B\u043E",settings_quiet_end:"\u041A\u043E\u043D\u0435\u0446",settings_max_per_day:"\u041C\u0430\u043A\u0441. \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439 \u0432 \u0434\u0435\u043D\u044C (0 = \u0431\u0435\u0437 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0439)",settings_bundling:"\u0413\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",settings_bundle_threshold:"\u041F\u043E\u0440\u043E\u0433 \u0433\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0438",settings_actions:"\u041A\u043D\u043E\u043F\u043A\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u0432 \u043C\u043E\u0431\u0438\u043B\u044C\u043D\u043E\u043C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438",settings_action_complete:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C\xBB",settings_action_skip:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C\xBB",settings_action_snooze:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u041E\u0442\u043B\u043E\u0436\u0438\u0442\u044C\xBB",settings_snooze_hours:"\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043E\u0442\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u043D\u0438\u044F (\u0447\u0430\u0441\u044B)",settings_budget:"\u0411\u044E\u0434\u0436\u0435\u0442",settings_currency:"\u0412\u0430\u043B\u044E\u0442\u0430",settings_budget_monthly:"\u041C\u0435\u0441\u044F\u0447\u043D\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_yearly:"\u0413\u043E\u0434\u043E\u0432\u043E\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_alerts:"\u041E\u043F\u043E\u0432\u0435\u0449\u0435\u043D\u0438\u044F \u043E \u0431\u044E\u0434\u0436\u0435\u0442\u0435",settings_budget_threshold:"\u041F\u043E\u0440\u043E\u0433 \u043E\u043F\u043E\u0432\u0435\u0449\u0435\u043D\u0438\u044F (%)",settings_import_export:"\u0418\u043C\u043F\u043E\u0440\u0442 / \u042D\u043A\u0441\u043F\u043E\u0440\u0442",settings_export_json:"\u042D\u043A\u0441\u043F\u043E\u0440\u0442 JSON",settings_export_csv:"\u042D\u043A\u0441\u043F\u043E\u0440\u0442 CSV",settings_import_csv:"\u0418\u043C\u043F\u043E\u0440\u0442 CSV",settings_import_placeholder:"\u0412\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 JSON \u0438\u043B\u0438 CSV \u0437\u0434\u0435\u0441\u044C\u2026",settings_import_btn:"\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C",settings_import_success:"\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432: {count}.",settings_export_success:"\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D.",settings_saved:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430.",settings_include_history:"\u0412\u043A\u043B\u044E\u0447\u0430\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u044E",sort_alphabetical:"\u041F\u043E \u0430\u043B\u0444\u0430\u0432\u0438\u0442\u0443",sort_due_soonest:"\u0411\u043B\u0438\u0436\u0430\u0439\u0448\u0438\u0439 \u0441\u0440\u043E\u043A",sort_task_count:"\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0437\u0430\u0434\u0430\u0447",sort_area:"\u041E\u0431\u043B\u0430\u0441\u0442\u044C",sort_assigned_user:"\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",sort_group:"\u0413\u0440\u0443\u043F\u043F\u0430",groupby_none:"\u0411\u0435\u0437 \u0433\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0438",groupby_area:"\u041F\u043E \u043E\u0431\u043B\u0430\u0441\u0442\u0438",groupby_group:"\u041F\u043E \u0433\u0440\u0443\u043F\u043F\u0435",groupby_user:"\u041F\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044E",unassigned:"\u041D\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u043E",no_area:"\u0411\u0435\u0437 \u043E\u0431\u043B\u0430\u0441\u0442\u0438",has_overdue:"\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043D\u044B\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",object:"\u041E\u0431\u044A\u0435\u043A\u0442",settings_panel_access:"\u0414\u043E\u0441\u0442\u0443\u043F \u043A \u043F\u0430\u043D\u0435\u043B\u0438",settings_panel_access_desc:"\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u044B \u0432\u0441\u0435\u0433\u0434\u0430 \u0432\u0438\u0434\u044F\u0442 \u043F\u043E\u043B\u043D\u0443\u044E \u043F\u0430\u043D\u0435\u043B\u044C. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0437\u0434\u0435\u0441\u044C \u043D\u0435-\u0430\u0434\u043C\u0438\u043D \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0442\u0430\u043A\u0436\u0435 \u0434\u043E\u043B\u0436\u043D\u044B \u0438\u043C\u0435\u0442\u044C \u043F\u043E\u043B\u043D\u044B\u0439 \u0434\u043E\u0441\u0442\u0443\u043F \u2014 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0432\u0438\u0434\u044F\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0438 \u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C.",no_non_admin_users:"\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043D\u0435-\u0430\u0434\u043C\u0438\u043D \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0438\u0445 \u0432 \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u2192 \u041B\u044E\u0434\u0438.",owner_label:"\u0412\u043B\u0430\u0434\u0435\u043B\u0435\u0446"},Xe={maintenance:"Konserwacja",objects:"Obiekty",tasks:"Zadania",overdue:"Zaleg\u0142e",due_soon:"Wkr\xF3tce",triggered:"Wyzwolone",ok:"OK",all:"Wszystkie",new_object:"+ Nowy obiekt",edit:"Edytuj",delete:"Usu\u0144",add_task:"+ Dodaj zadanie",complete:"Wykonaj",completed:"Wykonano",skip:"Pomi\u0144",skipped:"Pomini\u0119te",reset:"Resetuj",cancel:"Anuluj",completing:"Wykonywanie\u2026",interval:"Interwa\u0142",warning:"Ostrze\u017Cenie",last_performed:"Ostatnio wykonane",next_due:"Nast\u0119pny termin",days_until_due:"Dni do terminu",avg_duration:"\u015Ar. czas trwania",trigger:"Wyzwalacz",trigger_type:"Typ wyzwalacza",threshold_above:"G\xF3rny limit",threshold_below:"Dolny limit",threshold:"Pr\xF3g",counter:"Licznik",state_change:"Zmiana stanu",runtime:"Czas pracy",runtime_hours:"Docelowy czas pracy (godziny)",target_value:"Warto\u015B\u0107 docelowa",baseline:"Warto\u015B\u0107 bazowa",target_changes:"Docelowa liczba zmian",for_minutes:"Przez (minuty)",time_based:"Czasowy",sensor_based:"Oparty na czujniku",manual:"R\u0119czny",cleaning:"Czyszczenie",inspection:"Inspekcja",replacement:"Wymiana",calibration:"Kalibracja",service:"Serwis",custom:"Niestandardowy",history:"Historia",cost:"Koszt",duration:"Czas trwania",both:"Oba",trigger_val:"Warto\u015B\u0107 wyzwalacza",complete_title:"Wykonaj: ",checklist:"Lista kontrolna",checklist_steps_optional:"Kroki listy kontrolnej (opcjonalne)",checklist_placeholder:`Wyczy\u015B\u0107 filtr
Wymie\u0144 uszczelk\u0119
Sprawd\u017A ci\u015Bnienie`,checklist_help:"Jeden krok na lini\u0119. Maks. 100 element\xF3w.",err_too_long:"{field}: za d\u0142ugie (maks. {n} znak\xF3w)",err_too_short:"{field}: za kr\xF3tkie (min. {n} znak\xF3w)",err_value_too_high:"{field}: za du\u017Ce (maks. {n})",err_value_too_low:"{field}: za ma\u0142e (min. {n})",err_required:"{field}: wymagane",err_wrong_type:"{field}: z\u0142y typ (oczekiwano: {type})",err_invalid_choice:"{field}: niedozwolona warto\u015B\u0107",err_invalid_value:"{field}: nieprawid\u0142owa warto\u015B\u0107",feat_schedule_time:"Harmonogram wed\u0142ug pory dnia",feat_schedule_time_desc:"Zadania staj\u0105 si\u0119 zaleg\u0142e o okre\u015Blonej porze dnia zamiast o p\xF3\u0142nocy.",schedule_time_optional:"Termin o godzinie (opcjonalne, HH:MM)",schedule_time_help:"Puste = p\xF3\u0142noc (domy\u015Blnie). Strefa czasowa HA.",at_time:"o",notes_optional:"Notatki (opcjonalne)",cost_optional:"Koszt (opcjonalne)",duration_minutes:"Czas trwania w minutach (opcjonalne)",days:"dni",day:"dzie\u0144",today:"Dzisiaj",d_overdue:"d zaleg\u0142e",no_tasks:"Jeszcze brak zada\u0144 konserwacyjnych. Utw\xF3rz obiekt, aby zacz\u0105\u0107.",no_tasks_short:"Brak zada\u0144",no_history:"Jeszcze brak wpis\xF3w historii.",show_all:"Poka\u017C wszystko",cost_duration_chart:"Koszt i czas trwania",installed:"Zainstalowane",confirm_delete_object:"Usun\u0105\u0107 ten obiekt i wszystkie jego zadania?",confirm_delete_task:"Usun\u0105\u0107 to zadanie?",min:"Min",max:"Maks",save:"Zapisz",saving:"Zapisywanie\u2026",edit_task:"Edytuj zadanie",new_task:"Nowe zadanie konserwacyjne",task_name:"Nazwa zadania",maintenance_type:"Typ konserwacji",schedule_type:"Typ harmonogramu",interval_days:"Interwa\u0142 (dni)",warning_days:"Dni ostrze\u017Cenia",last_performed_optional:"Ostatnio wykonane (opcjonalne)",interval_anchor:"Punkt zaczepienia interwa\u0142u",anchor_completion:"Od daty wykonania",anchor_planned:"Od daty planowanej (bez przesuni\u0119\u0107)",edit_object:"Edytuj obiekt",name:"Nazwa",manufacturer_optional:"Producent (opcjonalne)",model_optional:"Model (opcjonalne)",serial_number_optional:"Numer seryjny (opcjonalne)",serial_number_label:"S/N",sort_due_date:"Termin",sort_object:"Nazwa obiektu",sort_type:"Typ",sort_task_name:"Nazwa zadania",all_objects:"Wszystkie obiekty",tasks_lower:"zada\u0144",no_tasks_yet:"Jeszcze brak zada\u0144",add_first_task:"Dodaj pierwsze zadanie",trigger_configuration:"Konfiguracja wyzwalacza",entity_id:"ID encji",comma_separated:"oddzielone przecinkami",entity_logic:"Logika encji",entity_logic_any:"Wyzwala dowolna encja",entity_logic_all:"Wszystkie encje musz\u0105 wyzwoli\u0107",entities:"encje",attribute_optional:"Atrybut (opcjonalny, puste = stan)",use_entity_state:"U\u017Cyj stanu encji (bez atrybutu)",trigger_above:"Wyzw\xF3l powy\u017Cej",trigger_below:"Wyzw\xF3l poni\u017Cej",for_at_least_minutes:"Przez co najmniej (minuty)",safety_interval_days:"Interwa\u0142 bezpiecze\u0144stwa (dni, opcjonalny)",delta_mode:"Tryb delta",from_state_optional:"Ze stanu (opcjonalne)",to_state_optional:"Do stanu (opcjonalne)",documentation_url_optional:"URL dokumentacji (opcjonalne)",nfc_tag_id_optional:"ID tagu NFC (opcjonalne)",environmental_entity_optional:"Czujnik \u015Brodowiskowy (opcjonalne)",environmental_entity_helper:"np. sensor.outdoor_temperature \u2014 dostosowuje interwa\u0142 na podstawie warunk\xF3w \u015Brodowiskowych",environmental_attribute_optional:"Atrybut \u015Brodowiskowy (opcjonalne)",nfc_tag_id:"ID tagu NFC",nfc_linked:"Tag NFC powi\u0105zany",nfc_link_hint:"Kliknij, aby powi\u0105za\u0107 tag NFC",responsible_user:"Odpowiedzialny u\u017Cytkownik",no_user_assigned:"(Brak przypisanego u\u017Cytkownika)",all_users:"Wszyscy u\u017Cytkownicy",my_tasks:"Moje zadania",budget_monthly:"Bud\u017Cet miesi\u0119czny",budget_yearly:"Bud\u017Cet roczny",groups:"Grupy",new_group:"Nowa grupa",edit_group:"Edytuj grup\u0119",no_groups:"Jeszcze brak grup",delete_group:"Usu\u0144 grup\u0119",delete_group_confirm:"Usun\u0105\u0107 grup\u0119 '{name}'?",group_select_tasks:"Wybierz zadania",group_name_required:"Nazwa jest wymagana",description_optional:"Opis (opcjonalny)",selected:"Wybrane",loading_chart:"\u0141adowanie danych wykresu...",was_maintenance_needed:"Czy ta konserwacja by\u0142a potrzebna?",feedback_needed:"Potrzebna",feedback_not_needed:"Niepotrzebna",feedback_not_sure:"Nie jestem pewien",suggested_interval:"Sugerowany interwa\u0142",apply_suggestion:"Zastosuj",reanalyze:"Analizuj ponownie",reanalyze_result:"Nowa analiza",reanalyze_insufficient_data:"Za ma\u0142o danych do wygenerowania rekomendacji",data_points:"punkty danych",dismiss_suggestion:"Odrzu\u0107",confidence_low:"Niska",confidence_medium:"\u015Arednia",confidence_high:"Wysoka",recommended:"rekomendowane",seasonal_awareness:"\u015Awiadomo\u015B\u0107 sezonowa",edit_seasonal_overrides:"Edytuj czynniki sezonowe",seasonal_overrides_title:"Czynniki sezonowe (nadpisanie)",seasonal_overrides_hint:"Czynnik na miesi\u0105c (0.1\u20135.0). Puste = uczone automatycznie.",seasonal_override_invalid:"Nieprawid\u0142owa warto\u015B\u0107",seasonal_override_range:"Czynnik musi by\u0107 mi\u0119dzy 0.1 a 5.0",clear_all:"Wyczy\u015B\u0107 wszystko",seasonal_chart_title:"Czynniki sezonowe",seasonal_learned:"Wyuczone",seasonal_manual:"R\u0119czne",month_jan:"Sty",month_feb:"Lut",month_mar:"Mar",month_apr:"Kwi",month_may:"Maj",month_jun:"Cze",month_jul:"Lip",month_aug:"Sie",month_sep:"Wrz",month_oct:"Pa\u017A",month_nov:"Lis",month_dec:"Gru",sensor_prediction:"Predykcja czujnika",degradation_trend:"Trend",trend_rising:"Rosn\u0105cy",trend_falling:"Malej\u0105cy",trend_stable:"Stabilny",trend_insufficient_data:"Niewystarczaj\u0105ce dane",days_until_threshold:"Dni do progu",threshold_exceeded:"Pr\xF3g przekroczony",environmental_adjustment:"Czynnik \u015Brodowiskowy",sensor_prediction_urgency:"Czujnik przewiduje pr\xF3g za ~{days} dni",day_short:"d",weibull_reliability_curve:"Krzywa niezawodno\u015Bci",weibull_failure_probability:"Prawdopodobie\u0144stwo awarii",weibull_r_squared:"Dopasowanie R\xB2",beta_early_failures:"Wczesne awarie",beta_random_failures:"Losowe awarie",beta_wear_out:"Zu\u017Cycie",beta_highly_predictable:"Wysoce przewidywalne",confidence_interval:"Przedzia\u0142 ufno\u015Bci",confidence_conservative:"Konserwatywny",confidence_aggressive:"Optymistyczny",current_interval_marker:"Bie\u017C\u0105cy interwa\u0142",recommended_marker:"Rekomendowany",characteristic_life:"Charakterystyczna \u017Cywotno\u015B\u0107",chart_mini_sparkline:"Wykres trendu",chart_history:"Historia koszt\xF3w i czasu trwania",chart_seasonal:"Czynniki sezonowe, 12 miesi\u0119cy",chart_weibull:"Krzywa niezawodno\u015Bci Weibulla",chart_sparkline:"Wykres warto\u015Bci wyzwalacza czujnika",days_progress:"Post\u0119p dni",qr_code:"Kod QR",qr_generating:"Generowanie kodu QR\u2026",qr_error:"Nie uda\u0142o si\u0119 wygenerowa\u0107 kodu QR.",qr_error_no_url:"Brak skonfigurowanego URL HA. Ustaw zewn\u0119trzny lub wewn\u0119trzny URL w Ustawienia \u2192 System \u2192 Sie\u0107.",save_error:"Nie uda\u0142o si\u0119 zapisa\u0107. Spr\xF3buj ponownie.",qr_print:"Drukuj",qr_download:"Pobierz SVG",qr_action:"Akcja przy skanowaniu",qr_action_view:"Wy\u015Bwietl informacje o konserwacji",qr_action_complete:"Oznacz konserwacj\u0119 jako wykonan\u0105",qr_url_mode:"Typ linku",qr_mode_companion:"Companion App",qr_mode_local:"Lokalny (mDNS)",qr_mode_server:"URL serwera",overview:"Przegl\u0105d",analysis:"Analiza",recent_activities:"Ostatnie aktywno\u015Bci",search_notes:"Szukaj w notatkach",avg_cost:"\u015Ar. koszt",no_advanced_features:"Brak w\u0142\u0105czonych funkcji zaawansowanych",no_advanced_features_hint:"W\u0142\u0105cz \u201EAdaptacyjne interwa\u0142y\u201D lub \u201EWzorce sezonowe\u201D w ustawieniach integracji, aby zobaczy\u0107 tutaj dane analityczne.",analysis_not_enough_data:"Jeszcze za ma\u0142o danych do analizy.",analysis_not_enough_data_hint:"Analiza Weibulla wymaga co najmniej 5 wykonanych konserwacji; wzorce sezonowe staj\u0105 si\u0119 widoczne po 6+ punktach danych na miesi\u0105c.",analysis_manual_task_hint:"Zadania r\u0119czne bez interwa\u0142u nie generuj\u0105 danych analitycznych.",completions:"wykonania",current:"Bie\u017C\u0105ce",shorter:"Kr\xF3tsze",longer:"D\u0142u\u017Csze",normal:"Normalne",disabled:"Wy\u0142\u0105czone",compound_logic:"Logika z\u0142o\u017Cona",card_title:"Tytu\u0142",card_show_header:"Poka\u017C nag\u0142\xF3wek ze statystykami",card_show_actions:"Poka\u017C przyciski akcji",card_compact:"Tryb kompaktowy",card_max_items:"Maks. element\xF3w (0 = wszystkie)",card_filter_status:"Filtruj wg statusu",card_filter_status_help:"Puste = poka\u017C wszystkie statusy.",card_filter_objects:"Filtruj wg obiekt\xF3w",card_filter_objects_help:"Puste = poka\u017C wszystkie obiekty.",card_filter_entities:"Filtruj wg encji (entity_ids)",card_filter_entities_help:"Wybierz encje sensor / binary_sensor z tej integracji. Puste = wszystkie.",card_loading_objects:"\u0141adowanie obiekt\xF3w\u2026",no_objects:"Brak obiekt\xF3w.",action_error:"Akcja nie powiod\u0142a si\u0119. Spr\xF3buj ponownie.",area_id_optional:"Obszar (opcjonalny)",installation_date_optional:"Data instalacji (opcjonalna)",custom_icon_optional:"Ikona (opcjonalna, np. mdi:wrench)",task_enabled:"Zadanie w\u0142\u0105czone",skip_reason_prompt:"Pomin\u0105\u0107 to zadanie?",reason_optional:"Pow\xF3d (opcjonalny)",reset_date_prompt:"Oznaczy\u0107 zadanie jako wykonane?",reset_date_optional:"Data ostatniego wykonania (opcjonalna, domy\u015Blnie dzisiaj)",notes_label:"Notatki",documentation_label:"Dokumentacja",no_nfc_tag:"\u2014 Brak tagu \u2014",dashboard:"Pulpit",settings:"Ustawienia",settings_features:"Funkcje zaawansowane",settings_features_desc:"W\u0142\u0105cz lub wy\u0142\u0105cz funkcje zaawansowane. Wy\u0142\u0105czenie ukrywa je z UI, ale nie usuwa danych.",feat_adaptive:"Harmonogram adaptacyjny",feat_adaptive_desc:"Ucz si\u0119 optymalnych interwa\u0142\xF3w z historii konserwacji",feat_predictions:"Predykcje czujnik\xF3w",feat_predictions_desc:"Przewiduj daty wyzwolenia z degradacji czujnika",feat_seasonal:"Korekty sezonowe",feat_seasonal_desc:"Dostosuj interwa\u0142y do wzorc\xF3w sezonowych",feat_environmental:"Korelacja \u015Brodowiskowa",feat_environmental_desc:"Koreluj interwa\u0142y z temperatur\u0105/wilgotno\u015Bci\u0105",feat_budget:"\u015Aledzenie bud\u017Cetu",feat_budget_desc:"\u015Aled\u017A miesi\u0119czne i roczne wydatki na konserwacj\u0119",feat_groups:"Grupy zada\u0144",feat_groups_desc:"Organizuj zadania w grupy logiczne",feat_checklists:"Listy kontrolne",feat_checklists_desc:"Wieloetapowe procedury wykonania zadania",settings_general:"Og\xF3lne",settings_default_warning:"Domy\u015Blne dni ostrze\u017Cenia",settings_panel_enabled:"Panel boczny",settings_notifications:"Powiadomienia",settings_notify_service:"Us\u0142uga powiadomie\u0144",test_notification:"Powiadomienie testowe",send_test:"Wy\u015Blij test",testing:"Wysy\u0142anie\u2026",test_notification_success:"Powiadomienie testowe wys\u0142ane",test_notification_failed:"Powiadomienie testowe nie powiod\u0142o si\u0119",settings_notify_due_soon:"Powiadom gdy wkr\xF3tce",settings_notify_overdue:"Powiadom gdy zaleg\u0142e",settings_notify_triggered:"Powiadom gdy wyzwolone",settings_interval_hours:"Interwa\u0142 powtarzania (godziny, 0 = raz)",settings_quiet_hours:"Godziny ciszy",settings_quiet_start:"Pocz\u0105tek",settings_quiet_end:"Koniec",settings_max_per_day:"Maks. powiadomie\u0144 dziennie (0 = bez limitu)",settings_bundling:"Grupowanie powiadomie\u0144",settings_bundle_threshold:"Pr\xF3g grupowania",settings_actions:"Mobilne przyciski akcji",settings_action_complete:"Poka\u017C przycisk 'Wykonaj'",settings_action_skip:"Poka\u017C przycisk 'Pomi\u0144'",settings_action_snooze:"Poka\u017C przycisk 'Drzemka'",settings_snooze_hours:"Czas drzemki (godziny)",settings_budget:"Bud\u017Cet",settings_currency:"Waluta",settings_budget_monthly:"Bud\u017Cet miesi\u0119czny",settings_budget_yearly:"Bud\u017Cet roczny",settings_budget_alerts:"Alerty bud\u017Cetowe",settings_budget_threshold:"Pr\xF3g alertu (%)",settings_import_export:"Import / Eksport",settings_export_json:"Eksportuj JSON",settings_export_csv:"Eksportuj CSV",settings_import_csv:"Importuj CSV",settings_import_placeholder:"Wklej tutaj zawarto\u015B\u0107 JSON lub CSV\u2026",settings_import_btn:"Importuj",settings_import_success:"{count} obiekt\xF3w zaimportowanych pomy\u015Blnie.",settings_export_success:"Eksport pobrany.",settings_saved:"Ustawienie zapisane.",settings_include_history:"Do\u0142\u0105cz histori\u0119",sort_alphabetical:"Alfabetycznie",sort_due_soonest:"Najbli\u017Cszy termin",sort_task_count:"Liczba zada\u0144",sort_area:"Obszar",sort_assigned_user:"Przypisany u\u017Cytkownik",sort_group:"Grupa",groupby_none:"Bez grupowania",groupby_area:"Wg obszaru",groupby_group:"Wg grupy",groupby_user:"Wg u\u017Cytkownika",unassigned:"Nieprzypisane",no_area:"Brak obszaru",has_overdue:"Ma zaleg\u0142e zadania",object:"Obiekt",settings_panel_access:"Dost\u0119p do panelu",settings_panel_access_desc:"Administratorzy zawsze widz\u0105 pe\u0142ny panel. Wybierz tutaj u\u017Cytkownik\xF3w nie-admin, kt\xF3rzy r\xF3wnie\u017C powinni mie\u0107 pe\u0142ny dost\u0119p \u2014 pozostali widz\u0105 tylko Wykonaj i Pomi\u0144.",no_non_admin_users:"Nie znaleziono u\u017Cytkownik\xF3w nie-admin. Dodaj ich w Ustawienia \u2192 Osoby.",owner_label:"W\u0142a\u015Bciciel"},et={maintenance:"\xDAdr\u017Eba",objects:"Objekty",tasks:"\xDAkoly",overdue:"Po term\xEDnu",due_soon:"Brzy",triggered:"Spu\u0161t\u011Bno",ok:"OK",all:"V\u0161e",new_object:"+ Nov\xFD objekt",edit:"Upravit",delete:"Smazat",add_task:"+ P\u0159idat \xFAkol",complete:"Dokon\u010Dit",completed:"Dokon\u010Deno",skip:"P\u0159esko\u010Dit",skipped:"P\u0159esko\u010Deno",reset:"Reset",cancel:"Zru\u0161it",completing:"Dokon\u010Dov\xE1n\xED\u2026",interval:"Interval",warning:"Upozorn\u011Bn\xED",last_performed:"Naposledy provedeno",next_due:"Dal\u0161\xED term\xEDn",days_until_due:"Dn\u016F do term\xEDnu",avg_duration:"Pr\u016Fm. trv\xE1n\xED",trigger:"Spou\u0161t\u011B\u010D",trigger_type:"Typ spou\u0161t\u011B\u010De",threshold_above:"Horn\xED limit",threshold_below:"Doln\xED limit",threshold:"Pr\xE1h",counter:"\u010C\xEDta\u010D",state_change:"Zm\u011Bna stavu",runtime:"Doba b\u011Bhu",runtime_hours:"C\xEDlov\xE1 doba b\u011Bhu (hodiny)",target_value:"C\xEDlov\xE1 hodnota",baseline:"Z\xE1kladn\xED hodnota",target_changes:"C\xEDlov\xFD po\u010Det zm\u011Bn",for_minutes:"Po dobu (minut)",time_based:"\u010Casov\xFD",sensor_based:"Zalo\u017Een\xFD na senzoru",manual:"Manu\xE1ln\xED",cleaning:"\u010Ci\u0161t\u011Bn\xED",inspection:"Inspekce",replacement:"V\xFDm\u011Bna",calibration:"Kalibrace",service:"Servis",custom:"Vlastn\xED",history:"Historie",cost:"N\xE1klady",duration:"Doba trv\xE1n\xED",both:"Oboj\xED",trigger_val:"Hodnota spou\u0161t\u011B\u010De",complete_title:"Dokon\u010Dit: ",checklist:"Kontroln\xED seznam",checklist_steps_optional:"Kroky kontroln\xEDho seznamu (voliteln\xE9)",checklist_placeholder:`Vy\u010Distit filtr
Vym\u011Bnit t\u011Bsn\u011Bn\xED
Otestovat tlak`,checklist_help:"Jeden krok na \u0159\xE1dek. Max 100 polo\u017Eek.",err_too_long:"{field}: p\u0159\xEDli\u0161 dlouh\xE9 (max {n} znak\u016F)",err_too_short:"{field}: p\u0159\xEDli\u0161 kr\xE1tk\xE9 (min {n} znak\u016F)",err_value_too_high:"{field}: p\u0159\xEDli\u0161 velk\xE9 (max {n})",err_value_too_low:"{field}: p\u0159\xEDli\u0161 mal\xE9 (min {n})",err_required:"{field}: povinn\xE9",err_wrong_type:"{field}: \u0161patn\xFD typ (o\u010Dek\xE1v\xE1n: {type})",err_invalid_choice:"{field}: nepovolen\xE1 hodnota",err_invalid_value:"{field}: neplatn\xE1 hodnota",feat_schedule_time:"Pl\xE1nov\xE1n\xED podle denn\xED doby",feat_schedule_time_desc:"\xDAkoly se stanou po term\xEDnu v ur\u010Denou denn\xED dobu m\xEDsto o p\u016Flnoci.",schedule_time_optional:"Term\xEDn v \u010Dase (voliteln\xE9, HH:MM)",schedule_time_help:"Pr\xE1zdn\xE9 = p\u016Flnoc (v\xFDchoz\xED). \u010Casov\xE9 p\xE1smo HA.",at_time:"v",notes_optional:"Pozn\xE1mky (voliteln\xE9)",cost_optional:"N\xE1klady (voliteln\xE9)",duration_minutes:"Doba trv\xE1n\xED v minut\xE1ch (voliteln\xE9)",days:"dn\xED",day:"den",today:"Dnes",d_overdue:"d po term\xEDnu",no_tasks:"Zat\xEDm \u017E\xE1dn\xE9 \xFAkoly \xFAdr\u017Eby. Vytvo\u0159te objekt pro za\u010D\xE1tek.",no_tasks_short:"\u017D\xE1dn\xE9 \xFAkoly",no_history:"Zat\xEDm \u017E\xE1dn\xE9 z\xE1znamy historie.",show_all:"Zobrazit v\u0161e",cost_duration_chart:"N\xE1klady a doba trv\xE1n\xED",installed:"Nainstalov\xE1no",confirm_delete_object:"Smazat tento objekt a v\u0161echny jeho \xFAkoly?",confirm_delete_task:"Smazat tento \xFAkol?",min:"Min",max:"Max",save:"Ulo\u017Eit",saving:"Ukl\xE1d\xE1n\xED\u2026",edit_task:"Upravit \xFAkol",new_task:"Nov\xFD \xFAkol \xFAdr\u017Eby",task_name:"N\xE1zev \xFAkolu",maintenance_type:"Typ \xFAdr\u017Eby",schedule_type:"Typ rozvrhu",interval_days:"Interval (dny)",warning_days:"Dny upozorn\u011Bn\xED",last_performed_optional:"Naposledy provedeno (voliteln\xE9)",interval_anchor:"Ukotven\xED intervalu",anchor_completion:"Od data dokon\u010Den\xED",anchor_planned:"Od pl\xE1novan\xE9ho data (bez posunu)",edit_object:"Upravit objekt",name:"N\xE1zev",manufacturer_optional:"V\xFDrobce (voliteln\xE9)",model_optional:"Model (voliteln\xE9)",serial_number_optional:"S\xE9riov\xE9 \u010D\xEDslo (voliteln\xE9)",serial_number_label:"S/N",sort_due_date:"Term\xEDn",sort_object:"N\xE1zev objektu",sort_type:"Typ",sort_task_name:"N\xE1zev \xFAkolu",all_objects:"V\u0161echny objekty",tasks_lower:"\xFAkol\u016F",no_tasks_yet:"Zat\xEDm \u017E\xE1dn\xE9 \xFAkoly",add_first_task:"P\u0159idat prvn\xED \xFAkol",trigger_configuration:"Konfigurace spou\u0161t\u011B\u010De",entity_id:"ID entity",comma_separated:"odd\u011Blen\xE9 \u010D\xE1rkami",entity_logic:"Logika entit",entity_logic_any:"Spust\xED libovoln\xE1 entita",entity_logic_all:"V\u0161echny entity mus\xED spustit",entities:"entity",attribute_optional:"Atribut (voliteln\xFD, pr\xE1zdn\xFD = stav)",use_entity_state:"Pou\u017E\xEDt stav entity (bez atributu)",trigger_above:"Spustit nad",trigger_below:"Spustit pod",for_at_least_minutes:"Po dobu alespo\u0148 (minut)",safety_interval_days:"Bezpe\u010Dnostn\xED interval (dny, voliteln\xFD)",delta_mode:"Re\u017Eim delta",from_state_optional:"Ze stavu (voliteln\xE9)",to_state_optional:"Do stavu (voliteln\xE9)",documentation_url_optional:"URL dokumentace (voliteln\xE9)",nfc_tag_id_optional:"ID NFC tagu (voliteln\xE9)",environmental_entity_optional:"Senzor prost\u0159ed\xED (voliteln\xFD)",environmental_entity_helper:"nap\u0159. sensor.outdoor_temperature \u2014 upravuje interval podle podm\xEDnek prost\u0159ed\xED",environmental_attribute_optional:"Atribut prost\u0159ed\xED (voliteln\xFD)",nfc_tag_id:"ID NFC tagu",nfc_linked:"NFC tag propojen",nfc_link_hint:"Klikn\u011Bte pro propojen\xED NFC tagu",responsible_user:"Zodpov\u011Bdn\xFD u\u017Eivatel",no_user_assigned:"(\u017D\xE1dn\xFD u\u017Eivatel p\u0159i\u0159azen)",all_users:"V\u0161ichni u\u017Eivatel\xE9",my_tasks:"Moje \xFAkoly",budget_monthly:"M\u011Bs\xED\u010Dn\xED rozpo\u010Det",budget_yearly:"Ro\u010Dn\xED rozpo\u010Det",groups:"Skupiny",new_group:"Nov\xE1 skupina",edit_group:"Upravit skupinu",no_groups:"Zat\xEDm \u017E\xE1dn\xE9 skupiny",delete_group:"Smazat skupinu",delete_group_confirm:"Smazat skupinu '{name}'?",group_select_tasks:"Vybrat \xFAkoly",group_name_required:"N\xE1zev je povinn\xFD",description_optional:"Popis (voliteln\xFD)",selected:"Vybr\xE1no",loading_chart:"Na\u010D\xEDt\xE1n\xED dat grafu...",was_maintenance_needed:"Byla tato \xFAdr\u017Eba pot\u0159eba?",feedback_needed:"Pot\u0159ebn\xE1",feedback_not_needed:"Nepot\u0159ebn\xE1",feedback_not_sure:"Nejsem si jist\xFD",suggested_interval:"Navrhovan\xFD interval",apply_suggestion:"Pou\u017E\xEDt",reanalyze:"Znovu analyzovat",reanalyze_result:"Nov\xE1 anal\xFDza",reanalyze_insufficient_data:"Nedostatek dat pro vytvo\u0159en\xED doporu\u010Den\xED",data_points:"datov\xFDch bod\u016F",dismiss_suggestion:"Zav\u0159\xEDt",confidence_low:"N\xEDzk\xE1",confidence_medium:"St\u0159edn\xED",confidence_high:"Vysok\xE1",recommended:"doporu\u010Deno",seasonal_awareness:"Sez\xF3nn\xED pov\u011Bdom\xED",edit_seasonal_overrides:"Upravit sez\xF3nn\xED faktory",seasonal_overrides_title:"Sez\xF3nn\xED faktory (p\u0159eps\xE1n\xED)",seasonal_overrides_hint:"Faktor na m\u011Bs\xEDc (0.1\u20135.0). Pr\xE1zdn\xE9 = nau\u010Deno automaticky.",seasonal_override_invalid:"Neplatn\xE1 hodnota",seasonal_override_range:"Faktor mus\xED b\xFDt mezi 0.1 a 5.0",clear_all:"Vymazat v\u0161e",seasonal_chart_title:"Sez\xF3nn\xED faktory",seasonal_learned:"Nau\u010Den\xE9",seasonal_manual:"Manu\xE1ln\xED",month_jan:"Led",month_feb:"\xDAno",month_mar:"B\u0159e",month_apr:"Dub",month_may:"Kv\u011B",month_jun:"\u010Cer",month_jul:"\u010Cvc",month_aug:"Srp",month_sep:"Z\xE1\u0159",month_oct:"\u0158\xEDj",month_nov:"Lis",month_dec:"Pro",sensor_prediction:"Predikce senzoru",degradation_trend:"Trend",trend_rising:"Rostouc\xED",trend_falling:"Klesaj\xEDc\xED",trend_stable:"Stabiln\xED",trend_insufficient_data:"Nedostatek dat",days_until_threshold:"Dn\u016F do prahu",threshold_exceeded:"Pr\xE1h p\u0159ekro\u010Den",environmental_adjustment:"Faktor prost\u0159ed\xED",sensor_prediction_urgency:"Senzor p\u0159edpov\xEDd\xE1 pr\xE1h za ~{days} dn\xED",day_short:"d",weibull_reliability_curve:"K\u0159ivka spolehlivosti",weibull_failure_probability:"Pravd\u011Bpodobnost selh\xE1n\xED",weibull_r_squared:"Shoda R\xB2",beta_early_failures:"\u010Casn\xE1 selh\xE1n\xED",beta_random_failures:"N\xE1hodn\xE1 selh\xE1n\xED",beta_wear_out:"Opot\u0159eben\xED",beta_highly_predictable:"Vysoce p\u0159edv\xEDdateln\xE9",confidence_interval:"Interval spolehlivosti",confidence_conservative:"Konzervativn\xED",confidence_aggressive:"Optimistick\xFD",current_interval_marker:"Aktu\xE1ln\xED interval",recommended_marker:"Doporu\u010Den\xFD",characteristic_life:"Charakteristick\xE1 \u017Eivotnost",chart_mini_sparkline:"Graf trendu",chart_history:"Historie n\xE1klad\u016F a doby trv\xE1n\xED",chart_seasonal:"Sez\xF3nn\xED faktory, 12 m\u011Bs\xEDc\u016F",chart_weibull:"Weibullova k\u0159ivka spolehlivosti",chart_sparkline:"Graf hodnoty spou\u0161t\u011B\u010De senzoru",days_progress:"Postup dn\u016F",qr_code:"QR k\xF3d",qr_generating:"Generov\xE1n\xED QR k\xF3du\u2026",qr_error:"Nepoda\u0159ilo se vygenerovat QR k\xF3d.",qr_error_no_url:"Nen\xED nakonfigurov\xE1no URL HA. Nastavte extern\xED nebo intern\xED URL v Nastaven\xED \u2192 Syst\xE9m \u2192 S\xED\u0165.",save_error:"Nepoda\u0159ilo se ulo\u017Eit. Zkuste to znovu.",qr_print:"Tisk",qr_download:"St\xE1hnout SVG",qr_action:"Akce p\u0159i skenov\xE1n\xED",qr_action_view:"Zobrazit informace o \xFAdr\u017Eb\u011B",qr_action_complete:"Ozna\u010Dit \xFAdr\u017Ebu jako dokon\u010Denou",qr_url_mode:"Typ odkazu",qr_mode_companion:"Companion App",qr_mode_local:"Lok\xE1ln\xED (mDNS)",qr_mode_server:"URL serveru",overview:"P\u0159ehled",analysis:"Anal\xFDza",recent_activities:"Ned\xE1vn\xE9 aktivity",search_notes:"Hledat v pozn\xE1mk\xE1ch",avg_cost:"Pr\u016Fm. n\xE1klady",no_advanced_features:"\u017D\xE1dn\xE9 pokro\u010Dil\xE9 funkce nejsou povoleny",no_advanced_features_hint:"Povolte \u201EAdaptivn\xED intervaly\u201D nebo \u201ESez\xF3nn\xED vzory\u201D v nastaven\xED integrace pro zobrazen\xED analytick\xFDch dat.",analysis_not_enough_data:"Zat\xEDm nedostatek dat pro anal\xFDzu.",analysis_not_enough_data_hint:"Weibullova anal\xFDza vy\u017Eaduje alespo\u0148 5 dokon\u010Den\xFDch \xFAdr\u017Eeb; sez\xF3nn\xED vzory se stanou viditeln\xE9 po 6+ datov\xFDch bodech na m\u011Bs\xEDc.",analysis_manual_task_hint:"Manu\xE1ln\xED \xFAkoly bez intervalu negeneruj\xED analytick\xE1 data.",completions:"dokon\u010Den\xED",current:"Aktu\xE1ln\xED",shorter:"Krat\u0161\xED",longer:"Del\u0161\xED",normal:"Norm\xE1ln\xED",disabled:"Zak\xE1z\xE1no",compound_logic:"Slo\u017Een\xE1 logika",card_title:"N\xE1zev",card_show_header:"Zobrazit z\xE1hlav\xED se statistikami",card_show_actions:"Zobrazit tla\u010D\xEDtka akc\xED",card_compact:"Kompaktn\xED re\u017Eim",card_max_items:"Max polo\u017Eek (0 = v\u0161e)",card_filter_status:"Filtrovat podle stavu",card_filter_status_help:"Pr\xE1zdn\xE9 = zobrazit v\u0161echny stavy.",card_filter_objects:"Filtrovat podle objekt\u016F",card_filter_objects_help:"Pr\xE1zdn\xE9 = zobrazit v\u0161echny objekty.",card_filter_entities:"Filtrovat podle entit (entity_ids)",card_filter_entities_help:"Vyberte entity sensor / binary_sensor z t\xE9to integrace. Pr\xE1zdn\xE9 = v\u0161echny.",card_loading_objects:"Na\u010D\xEDt\xE1n\xED objekt\u016F\u2026",no_objects:"Zat\xEDm \u017E\xE1dn\xE9 objekty.",action_error:"Akce se nezda\u0159ila. Zkuste to znovu.",area_id_optional:"Oblast (voliteln\xE1)",installation_date_optional:"Datum instalace (voliteln\xE9)",custom_icon_optional:"Ikona (voliteln\xE1, nap\u0159. mdi:wrench)",task_enabled:"\xDAkol povolen",skip_reason_prompt:"P\u0159esko\u010Dit tento \xFAkol?",reason_optional:"D\u016Fvod (voliteln\xFD)",reset_date_prompt:"Ozna\u010Dit \xFAkol jako proveden\xFD?",reset_date_optional:"Datum posledn\xEDho proveden\xED (voliteln\xE9, v\xFDchoz\xED dnes)",notes_label:"Pozn\xE1mky",documentation_label:"Dokumentace",no_nfc_tag:"\u2014 \u017D\xE1dn\xFD tag \u2014",dashboard:"P\u0159ehled",settings:"Nastaven\xED",settings_features:"Pokro\u010Dil\xE9 funkce",settings_features_desc:"Povolte nebo zaka\u017Ete pokro\u010Dil\xE9 funkce. Zak\xE1z\xE1n\xED je skryje z UI, ale nesma\u017Ee data.",feat_adaptive:"Adaptivn\xED pl\xE1nov\xE1n\xED",feat_adaptive_desc:"U\u010Dte se optim\xE1ln\xED intervaly z historie \xFAdr\u017Eby",feat_predictions:"Predikce senzor\u016F",feat_predictions_desc:"P\u0159edpov\xEDdejte term\xEDny spou\u0161t\u011Bn\xED z degradace senzoru",feat_seasonal:"Sez\xF3nn\xED \xFApravy",feat_seasonal_desc:"Upravte intervaly podle sez\xF3nn\xEDch vzor\u016F",feat_environmental:"Korelace s prost\u0159ed\xEDm",feat_environmental_desc:"Korelujte intervaly s teplotou/vlhkost\xED",feat_budget:"Sledov\xE1n\xED rozpo\u010Dtu",feat_budget_desc:"Sledujte m\u011Bs\xED\u010Dn\xED a ro\u010Dn\xED v\xFDdaje na \xFAdr\u017Ebu",feat_groups:"Skupiny \xFAkol\u016F",feat_groups_desc:"Organizujte \xFAkoly do logick\xFDch skupin",feat_checklists:"Kontroln\xED seznamy",feat_checklists_desc:"V\xEDcestup\u0148ov\xE9 procedury pro dokon\u010Den\xED \xFAkolu",settings_general:"Obecn\xE9",settings_default_warning:"V\xFDchoz\xED dny upozorn\u011Bn\xED",settings_panel_enabled:"Bo\u010Dn\xED panel",settings_notifications:"Ozn\xE1men\xED",settings_notify_service:"Slu\u017Eba ozn\xE1men\xED",test_notification:"Testovac\xED ozn\xE1men\xED",send_test:"Odeslat test",testing:"Odes\xEDl\xE1n\xED\u2026",test_notification_success:"Testovac\xED ozn\xE1men\xED odesl\xE1no",test_notification_failed:"Testovac\xED ozn\xE1men\xED se nezda\u0159ilo",settings_notify_due_soon:"Ozn\xE1mit kdy\u017E brzy",settings_notify_overdue:"Ozn\xE1mit kdy\u017E po term\xEDnu",settings_notify_triggered:"Ozn\xE1mit kdy\u017E spu\u0161t\u011Bno",settings_interval_hours:"Interval opakov\xE1n\xED (hodiny, 0 = jednou)",settings_quiet_hours:"Tich\xE9 hodiny",settings_quiet_start:"Za\u010D\xE1tek",settings_quiet_end:"Konec",settings_max_per_day:"Max ozn\xE1men\xED denn\u011B (0 = bez limitu)",settings_bundling:"Seskupit ozn\xE1men\xED",settings_bundle_threshold:"Pr\xE1h seskupen\xED",settings_actions:"Mobiln\xED ak\u010Dn\xED tla\u010D\xEDtka",settings_action_complete:"Zobrazit tla\u010D\xEDtko 'Dokon\u010Dit'",settings_action_skip:"Zobrazit tla\u010D\xEDtko 'P\u0159esko\u010Dit'",settings_action_snooze:"Zobrazit tla\u010D\xEDtko 'Odlo\u017Eit'",settings_snooze_hours:"Doba odlo\u017Een\xED (hodiny)",settings_budget:"Rozpo\u010Det",settings_currency:"M\u011Bna",settings_budget_monthly:"M\u011Bs\xED\u010Dn\xED rozpo\u010Det",settings_budget_yearly:"Ro\u010Dn\xED rozpo\u010Det",settings_budget_alerts:"Rozpo\u010Dtov\xE1 upozorn\u011Bn\xED",settings_budget_threshold:"Pr\xE1h upozorn\u011Bn\xED (%)",settings_import_export:"Import / Export",settings_export_json:"Exportovat JSON",settings_export_csv:"Exportovat CSV",settings_import_csv:"Importovat CSV",settings_import_placeholder:"Vlo\u017Ete sem obsah JSON nebo CSV\u2026",settings_import_btn:"Importovat",settings_import_success:"{count} objekt\u016F \xFAsp\u011B\u0161n\u011B importov\xE1no.",settings_export_success:"Export sta\u017Een.",settings_saved:"Nastaven\xED ulo\u017Eeno.",settings_include_history:"Zahrnout historii",sort_alphabetical:"Abecedn\u011B",sort_due_soonest:"Nejbli\u017E\u0161\xED term\xEDn",sort_task_count:"Po\u010Det \xFAkol\u016F",sort_area:"Oblast",sort_assigned_user:"P\u0159i\u0159azen\xFD u\u017Eivatel",sort_group:"Skupina",groupby_none:"Bez seskupen\xED",groupby_area:"Podle oblasti",groupby_group:"Podle skupiny",groupby_user:"Podle u\u017Eivatele",unassigned:"Nep\u0159i\u0159azeno",no_area:"Bez oblasti",has_overdue:"M\xE1 \xFAkoly po term\xEDnu",object:"Objekt",settings_panel_access:"P\u0159\xEDstup k panelu",settings_panel_access_desc:"Administr\xE1to\u0159i v\u017Edy vid\xED cel\xFD panel. Vyberte zde u\u017Eivatele bez admin pr\xE1v, kte\u0159\xED by m\u011Bli tak\xE9 m\xEDt pln\xFD p\u0159\xEDstup \u2014 ostatn\xED vid\xED pouze Dokon\u010Dit a P\u0159esko\u010Dit.",no_non_admin_users:"Nenalezeni \u017E\xE1dn\xED u\u017Eivatel\xE9 bez admin pr\xE1v. P\u0159idejte je v Nastaven\xED \u2192 Lid\xE9.",owner_label:"Vlastn\xEDk"},tt={maintenance:"Underh\xE5ll",objects:"Objekt",tasks:"Uppgifter",overdue:"F\xF6rsenad",due_soon:"Snart",triggered:"Utl\xF6st",ok:"OK",all:"Alla",new_object:"+ Nytt objekt",edit:"Redigera",delete:"Ta bort",add_task:"+ L\xE4gg till uppgift",complete:"Slutf\xF6r",completed:"Slutf\xF6rd",skip:"Hoppa \xF6ver",skipped:"Hoppade \xF6ver",reset:"\xC5terst\xE4ll",cancel:"Avbryt",completing:"Slutf\xF6r\u2026",interval:"Intervall",warning:"Varning",last_performed:"Senast utf\xF6rd",next_due:"N\xE4sta f\xF6rfallodatum",days_until_due:"Dagar till f\xF6rfallodatum",avg_duration:"Snittlig varaktighet",trigger:"Utl\xF6sare",trigger_type:"Utl\xF6sartyp",threshold_above:"\xD6vre gr\xE4ns",threshold_below:"Undre gr\xE4ns",threshold:"Tr\xF6skel",counter:"R\xE4knare",state_change:"Tillst\xE5nds\xE4ndring",runtime:"K\xF6rtid",runtime_hours:"M\xE5ltid (timmar)",target_value:"M\xE5lv\xE4rde",baseline:"Baslinje",target_changes:"Antal m\xE5lf\xF6r\xE4ndringar",for_minutes:"Under (minuter)",time_based:"Tidsbaserad",sensor_based:"Sensorbaserad",manual:"Manuell",cleaning:"Reng\xF6ring",inspection:"Inspektion",replacement:"Byte",calibration:"Kalibrering",service:"Service",custom:"Anpassad",history:"Historik",cost:"Kostnad",duration:"Varaktighet",both:"B\xE5da",trigger_val:"Utl\xF6sarv\xE4rde",complete_title:"Slutf\xF6r: ",checklist:"Checklista",checklist_steps_optional:"Checkliststeg (valfritt)",checklist_placeholder:`Reng\xF6r filter
Byt t\xE4tning
Testa tryck`,checklist_help:"Ett steg per rad. Max 100 objekt.",err_too_long:"{field}: f\xF6r l\xE5ng (max {n} tecken)",err_too_short:"{field}: f\xF6r kort (min {n} tecken)",err_value_too_high:"{field}: f\xF6r stor (max {n})",err_value_too_low:"{field}: f\xF6r liten (min {n})",err_required:"{field}: kr\xE4vs",err_wrong_type:"{field}: fel typ (f\xF6rv\xE4ntad: {type})",err_invalid_choice:"{field}: ej till\xE5tet v\xE4rde",err_invalid_value:"{field}: ogiltigt v\xE4rde",feat_schedule_time:"Schemal\xE4ggning per tid p\xE5 dygnet",feat_schedule_time_desc:"Uppgifter blir f\xF6rsenade vid en specifik tid p\xE5 dygnet ist\xE4llet f\xF6r midnatt.",schedule_time_optional:"F\xF6rfaller kl. (valfritt, HH:MM)",schedule_time_help:"Tomt = midnatt (standard). HA-tidszon.",at_time:"kl.",notes_optional:"Anteckningar (valfritt)",cost_optional:"Kostnad (valfritt)",duration_minutes:"Varaktighet i minuter (valfritt)",days:"dagar",day:"dag",today:"Idag",d_overdue:"d f\xF6rsenad",no_tasks:"Inga underh\xE5llsuppgifter \xE4nnu. Skapa ett objekt f\xF6r att komma ig\xE5ng.",no_tasks_short:"Inga uppgifter",no_history:"Inga historikposter \xE4nnu.",show_all:"Visa alla",cost_duration_chart:"Kostnad och varaktighet",installed:"Installerad",confirm_delete_object:"Ta bort detta objekt och alla dess uppgifter?",confirm_delete_task:"Ta bort denna uppgift?",min:"Min",max:"Max",save:"Spara",saving:"Sparar\u2026",edit_task:"Redigera uppgift",new_task:"Ny underh\xE5llsuppgift",task_name:"Uppgiftsnamn",maintenance_type:"Underh\xE5llstyp",schedule_type:"Schematyp",interval_days:"Intervall (dagar)",warning_days:"Varningsdagar",last_performed_optional:"Senast utf\xF6rd (valfritt)",interval_anchor:"Intervallankare",anchor_completion:"Fr\xE5n slutf\xF6randedatum",anchor_planned:"Fr\xE5n planerat datum (ingen drift)",edit_object:"Redigera objekt",name:"Namn",manufacturer_optional:"Tillverkare (valfritt)",model_optional:"Modell (valfritt)",serial_number_optional:"Serienummer (valfritt)",serial_number_label:"S/N",sort_due_date:"F\xF6rfallodatum",sort_object:"Objektnamn",sort_type:"Typ",sort_task_name:"Uppgiftsnamn",all_objects:"Alla objekt",tasks_lower:"uppgifter",no_tasks_yet:"Inga uppgifter \xE4nnu",add_first_task:"L\xE4gg till f\xF6rsta uppgift",trigger_configuration:"Utl\xF6sarkonfiguration",entity_id:"Entitets-ID",comma_separated:"kommaseparerad",entity_logic:"Entitetslogik",entity_logic_any:"Vilken entitet som helst utl\xF6ser",entity_logic_all:"Alla entiteter m\xE5ste utl\xF6sa",entities:"entiteter",attribute_optional:"Attribut (valfritt, tomt = tillst\xE5nd)",use_entity_state:"Anv\xE4nd entitetstillst\xE5nd (inget attribut)",trigger_above:"Utl\xF6s \xF6ver",trigger_below:"Utl\xF6s under",for_at_least_minutes:"Under minst (minuter)",safety_interval_days:"S\xE4kerhetsintervall (dagar, valfritt)",delta_mode:"Delta-l\xE4ge",from_state_optional:"Fr\xE5n tillst\xE5nd (valfritt)",to_state_optional:"Till tillst\xE5nd (valfritt)",documentation_url_optional:"Dokumentations-URL (valfritt)",nfc_tag_id_optional:"NFC-tagg-ID (valfritt)",environmental_entity_optional:"Milj\xF6sensor (valfritt)",environmental_entity_helper:"t.ex. sensor.outdoor_temperature \u2014 justerar intervallet baserat p\xE5 milj\xF6f\xF6rh\xE5llanden",environmental_attribute_optional:"Milj\xF6attribut (valfritt)",nfc_tag_id:"NFC-tagg-ID",nfc_linked:"NFC-tagg l\xE4nkad",nfc_link_hint:"Klicka f\xF6r att l\xE4nka NFC-tagg",responsible_user:"Ansvarig anv\xE4ndare",no_user_assigned:"(Ingen anv\xE4ndare tilldelad)",all_users:"Alla anv\xE4ndare",my_tasks:"Mina uppgifter",budget_monthly:"M\xE5natlig budget",budget_yearly:"\xC5rlig budget",groups:"Grupper",new_group:"Ny grupp",edit_group:"Redigera grupp",no_groups:"Inga grupper \xE4nnu",delete_group:"Ta bort grupp",delete_group_confirm:"Ta bort grupp '{name}'?",group_select_tasks:"V\xE4lj uppgifter",group_name_required:"Namn kr\xE4vs",description_optional:"Beskrivning (valfritt)",selected:"Valda",loading_chart:"Laddar diagramdata...",was_maintenance_needed:"Beh\xF6vdes detta underh\xE5ll?",feedback_needed:"Beh\xF6vdes",feedback_not_needed:"Beh\xF6vdes inte",feedback_not_sure:"Os\xE4ker",suggested_interval:"F\xF6reslaget intervall",apply_suggestion:"Till\xE4mpa",reanalyze:"Analysera igen",reanalyze_result:"Ny analys",reanalyze_insufficient_data:"Otillr\xE4ckligt med data f\xF6r rekommendation",data_points:"datapunkter",dismiss_suggestion:"Avvisa",confidence_low:"L\xE5g",confidence_medium:"Medel",confidence_high:"H\xF6g",recommended:"rekommenderad",seasonal_awareness:"S\xE4songsmedvetenhet",edit_seasonal_overrides:"Redigera s\xE4songsfaktorer",seasonal_overrides_title:"S\xE4songsfaktorer (\xE5sidos\xE4tt)",seasonal_overrides_hint:"Faktor per m\xE5nad (0.1\u20135.0). Tomt = l\xE4rt automatiskt.",seasonal_override_invalid:"Ogiltigt v\xE4rde",seasonal_override_range:"Faktor m\xE5ste vara mellan 0.1 och 5.0",clear_all:"Rensa alla",seasonal_chart_title:"S\xE4songsfaktorer",seasonal_learned:"L\xE4rt",seasonal_manual:"Manuell",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"Maj",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensorprediktion",degradation_trend:"Trend",trend_rising:"Stigande",trend_falling:"Fallande",trend_stable:"Stabil",trend_insufficient_data:"Otillr\xE4cklig data",days_until_threshold:"Dagar till tr\xF6skel",threshold_exceeded:"Tr\xF6skel \xF6verskriden",environmental_adjustment:"Milj\xF6faktor",sensor_prediction_urgency:"Sensor f\xF6ruts\xE4ger tr\xF6skel om ~{days} dagar",day_short:"d",weibull_reliability_curve:"Tillf\xF6rlitlighetskurva",weibull_failure_probability:"Felsannolikhet",weibull_r_squared:"Anpassning R\xB2",beta_early_failures:"Tidiga fel",beta_random_failures:"Slumpm\xE4ssiga fel",beta_wear_out:"Slitage",beta_highly_predictable:"Mycket f\xF6ruts\xE4gbar",confidence_interval:"Konfidensintervall",confidence_conservative:"Konservativ",confidence_aggressive:"Optimistisk",current_interval_marker:"Aktuellt intervall",recommended_marker:"Rekommenderat",characteristic_life:"Karakteristisk livsl\xE4ngd",chart_mini_sparkline:"Trenddiagram",chart_history:"Kostnads- och varaktighetshistorik",chart_seasonal:"S\xE4songsfaktorer, 12 m\xE5nader",chart_weibull:"Weibull tillf\xF6rlitlighetskurva",chart_sparkline:"Sensorutl\xF6sarv\xE4rdesdiagram",days_progress:"Dagsf\xF6rlopp",qr_code:"QR-kod",qr_generating:"Genererar QR-kod\u2026",qr_error:"Kunde inte generera QR-kod.",qr_error_no_url:"Ingen HA-URL konfigurerad. Ange en extern eller intern URL i Inst\xE4llningar \u2192 System \u2192 N\xE4tverk.",save_error:"Kunde inte spara. F\xF6rs\xF6k igen.",qr_print:"Skriv ut",qr_download:"Ladda ner SVG",qr_action:"\xC5tg\xE4rd vid skanning",qr_action_view:"Visa underh\xE5llsinformation",qr_action_complete:"Markera underh\xE5ll som slutf\xF6rt",qr_url_mode:"L\xE4nktyp",qr_mode_companion:"Companion App",qr_mode_local:"Lokal (mDNS)",qr_mode_server:"Server-URL",overview:"\xD6versikt",analysis:"Analys",recent_activities:"Senaste aktiviteter",search_notes:"S\xF6k i anteckningar",avg_cost:"Snittlig kostnad",no_advanced_features:"Inga avancerade funktioner aktiverade",no_advanced_features_hint:"Aktivera \u201EAdaptiva intervall\u201D eller \u201ES\xE4songsm\xF6nster\u201D i integrationsinst\xE4llningar f\xF6r att se analysdata h\xE4r.",analysis_not_enough_data:"Inte tillr\xE4ckligt med data f\xF6r analys \xE4nnu.",analysis_not_enough_data_hint:"Weibull-analys kr\xE4ver minst 5 slutf\xF6rda underh\xE5ll; s\xE4songsm\xF6nster blir synliga efter 6+ datapunkter per m\xE5nad.",analysis_manual_task_hint:"Manuella uppgifter utan intervall genererar inte analysdata.",completions:"slutf\xF6randen",current:"Aktuell",shorter:"Kortare",longer:"L\xE4ngre",normal:"Normal",disabled:"Inaktiverad",compound_logic:"Sammansatt logik",card_title:"Titel",card_show_header:"Visa rubrik med statistik",card_show_actions:"Visa \xE5tg\xE4rdsknappar",card_compact:"Kompakt l\xE4ge",card_max_items:"Max objekt (0 = alla)",card_filter_status:"Filtrera efter status",card_filter_status_help:"Tomt = visa alla statusar.",card_filter_objects:"Filtrera efter objekt",card_filter_objects_help:"Tomt = visa alla objekt.",card_filter_entities:"Filtrera efter entiteter (entity_ids)",card_filter_entities_help:"V\xE4lj sensor- / binary_sensor-entiteter fr\xE5n denna integration. Tomt = alla.",card_loading_objects:"Laddar objekt\u2026",no_objects:"Inga objekt \xE4n.",action_error:"\xC5tg\xE4rden misslyckades. F\xF6rs\xF6k igen.",area_id_optional:"Omr\xE5de (valfritt)",installation_date_optional:"Installationsdatum (valfritt)",custom_icon_optional:"Ikon (valfritt, t.ex. mdi:wrench)",task_enabled:"Uppgift aktiverad",skip_reason_prompt:"Hoppa \xF6ver denna uppgift?",reason_optional:"Anledning (valfritt)",reset_date_prompt:"Markera uppgift som utf\xF6rd?",reset_date_optional:"Datum f\xF6r senaste utf\xF6rande (valfritt, standard idag)",notes_label:"Anteckningar",documentation_label:"Dokumentation",no_nfc_tag:"\u2014 Ingen tagg \u2014",dashboard:"\xD6versikt",settings:"Inst\xE4llningar",settings_features:"Avancerade funktioner",settings_features_desc:"Aktivera eller inaktivera avancerade funktioner. Inaktivering d\xF6ljer dem fr\xE5n UI men tar inte bort data.",feat_adaptive:"Adaptiv schemal\xE4ggning",feat_adaptive_desc:"L\xE4r dig optimala intervall fr\xE5n underh\xE5llshistorik",feat_predictions:"Sensorpredictions",feat_predictions_desc:"F\xF6ruts\xE4g utl\xF6sningsdatum fr\xE5n sensordegradering",feat_seasonal:"S\xE4songsjusteringar",feat_seasonal_desc:"Justera intervall baserat p\xE5 s\xE4songsm\xF6nster",feat_environmental:"Milj\xF6korrelation",feat_environmental_desc:"Korrelera intervall med temperatur/luftfuktighet",feat_budget:"Budgetuppf\xF6ljning",feat_budget_desc:"Sp\xE5ra m\xE5natliga och \xE5rliga underh\xE5llsutgifter",feat_groups:"Uppgiftsgrupper",feat_groups_desc:"Organisera uppgifter i logiska grupper",feat_checklists:"Checklistor",feat_checklists_desc:"Flerstegs procedurer f\xF6r uppgiftens slutf\xF6rande",settings_general:"Allm\xE4nt",settings_default_warning:"Standard varningsdagar",settings_panel_enabled:"Sidopanel",settings_notifications:"Notifikationer",settings_notify_service:"Notifikationstj\xE4nst",test_notification:"Testnotifikation",send_test:"Skicka test",testing:"Skickar\u2026",test_notification_success:"Testnotifikation skickad",test_notification_failed:"Testnotifikation misslyckades",settings_notify_due_soon:"Notifiera n\xE4r snart f\xF6rfallande",settings_notify_overdue:"Notifiera n\xE4r f\xF6rsenad",settings_notify_triggered:"Notifiera n\xE4r utl\xF6st",settings_interval_hours:"Upprepningsintervall (timmar, 0 = en g\xE5ng)",settings_quiet_hours:"Tysta timmar",settings_quiet_start:"Start",settings_quiet_end:"Slut",settings_max_per_day:"Max notifikationer per dag (0 = obegr\xE4nsat)",settings_bundling:"Bunta notifikationer",settings_bundle_threshold:"Buntningstr\xF6skel",settings_actions:"Mobila \xE5tg\xE4rdsknappar",settings_action_complete:"Visa 'Slutf\xF6r'-knapp",settings_action_skip:"Visa 'Hoppa \xF6ver'-knapp",settings_action_snooze:"Visa 'Snooza'-knapp",settings_snooze_hours:"Snooza-tid (timmar)",settings_budget:"Budget",settings_currency:"Valuta",settings_budget_monthly:"M\xE5natlig budget",settings_budget_yearly:"\xC5rlig budget",settings_budget_alerts:"Budgetvarningar",settings_budget_threshold:"Varningstr\xF6skel (%)",settings_import_export:"Import / Export",settings_export_json:"Exportera JSON",settings_export_csv:"Exportera CSV",settings_import_csv:"Importera CSV",settings_import_placeholder:"Klistra in JSON- eller CSV-inneh\xE5ll h\xE4r\u2026",settings_import_btn:"Importera",settings_import_success:"{count} objekt importerade.",settings_export_success:"Export nedladdad.",settings_saved:"Inst\xE4llning sparad.",settings_include_history:"Inkludera historik",sort_alphabetical:"Alfabetisk",sort_due_soonest:"N\xE4rmaste f\xF6rfallodatum",sort_task_count:"Antal uppgifter",sort_area:"Omr\xE5de",sort_assigned_user:"Tilldelad anv\xE4ndare",sort_group:"Grupp",groupby_none:"Ingen gruppering",groupby_area:"Per omr\xE5de",groupby_group:"Per grupp",groupby_user:"Per anv\xE4ndare",unassigned:"Otilldelad",no_area:"Inget omr\xE5de",has_overdue:"Har f\xF6rsenade uppgifter",object:"Objekt",settings_panel_access:"Paneltillg\xE5ng",settings_panel_access_desc:"Administrat\xF6rer ser alltid hela panelen. V\xE4lj icke-admin-anv\xE4ndare nedan som ocks\xE5 ska f\xE5 full paneltillg\xE5ng \u2014 alla andra icke-admins ser endast Slutf\xF6r och Hoppa \xF6ver.",no_non_admin_users:"Inga icke-admin-anv\xE4ndare hittades. L\xE4gg till n\xE5gra i Inst\xE4llningar \u2192 Personer.",owner_label:"\xC4gare"},xe={de:Be,en:He,nl:We,fr:Ke,it:Ge,es:Ze,pt:Je,ru:Ye,uk:Qe,pl:Xe,cs:et,sv:tt};function _(i,e){let t=(e||"en").substring(0,2).toLowerCase();return xe[t]?.[i]??xe.en[i]??i}var je=k`
  :host {
    --maint-ok-color: var(--success-color, #4caf50);
    --maint-due-soon-color: var(--warning-color, #ff9800);
    --maint-overdue-color: var(--error-color, #f44336);
    --maint-triggered-color: #ff5722;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: white;
    white-space: nowrap;
    /* Fixed minimum so OK / Due Soon / Overdue / Triggered pills are uniform
       width in the task table — keeps the object-name column aligned. */
    min-width: 70px;
    box-sizing: border-box;
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
  .stat-item.clickable { cursor: pointer; border-radius: 8px; padding: 4px 8px; transition: background 0.15s; }
  .stat-item.clickable:hover { background: var(--secondary-background-color); }

  .objects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
    padding: 16px 0;
  }
  .object-card {
    padding: 16px;
    background: var(--card-background-color);
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid var(--divider-color);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .object-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .object-card-header { display: flex; justify-content: space-between; align-items: center; }
  .object-card-name { font-weight: 500; font-size: 16px; }
  .object-card-count { color: var(--secondary-text-color); font-size: 13px; }
  .object-card-meta { color: var(--secondary-text-color); font-size: 13px; margin-top: 4px; }
  .object-card-empty { color: var(--warning-color); font-size: 13px; margin-top: 8px; font-style: italic; }

  /* Overdue indicator dot on object cards (#35) */
  .object-card { position: relative; }
  .object-card-overdue { border-left: 3px solid var(--error-color); }
  .overdue-dot {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--error-color);
    box-shadow: 0 0 0 2px var(--card-background-color);
  }

  /* Group-by collapsible sections (#35 + #36) */
  .group-section {
    margin: 12px 0;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--card-background-color);
  }
  .group-section[open] { padding-bottom: 8px; }
  .group-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    cursor: pointer;
    font-weight: 500;
    list-style: none;
    user-select: none;
  }
  .group-section-header::-webkit-details-marker { display: none; }
  .group-section-header::before {
    content: "▶";
    font-size: 10px;
    color: var(--secondary-text-color);
    transition: transform 0.15s;
  }
  .group-section[open] .group-section-header::before { transform: rotate(90deg); }
  .group-section-count {
    color: var(--secondary-text-color);
    font-size: 13px;
    font-weight: 400;
  }
  .group-section .objects-grid,
  .group-section .task-table {
    padding: 0 12px;
  }

  .empty-state-centered { text-align: center; padding: 32px 16px; }
  .empty-state-centered ha-button { margin-top: 16px; }

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

  .entity-link {
    cursor: pointer;
    text-decoration: underline dotted;
    text-underline-offset: 2px;
  }
  .entity-link:hover {
    color: var(--primary-color);
    text-decoration: underline solid;
  }

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

  .group-card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .group-card-name {
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .group-card-actions {
    display: flex;
    gap: 0;
  }
  .group-card-actions mwc-icon-button {
    --mdc-icon-button-size: 28px;
    --mdc-icon-size: 16px;
    color: var(--secondary-text-color);
  }

  .groups-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .groups-header h3 { margin: 0; }

  .seasonal-actions {
    display: flex;
    justify-content: flex-end;
    padding: 4px 0;
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

  .task-disabled { opacity: 0.5; }
  .badge-disabled {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 8px;
    background: var(--disabled-color, #9e9e9e);
    color: white;
  }

  /* ── Shared responsive styles (panel + card) ── */
  @media (max-width: 600px) {
    .row-actions mwc-icon-button {
      --mdc-icon-button-size: 44px;
      --mdc-icon-size: 22px;
    }

    .due-cell { min-width: 70px; }

    .trigger-card { padding: 10px 12px; }
    .trigger-current { font-size: 22px; }

    .prediction-grid { flex-direction: column; gap: 8px; }

    .weibull-info-row { flex-direction: column; gap: 8px; }

    .budget-bars { flex-direction: column; }
    .budget-item { min-width: 0; }

    .group-card { min-width: 0; max-width: 100%; }

    .filter-chip { padding: 6px 12px; font-size: 13px; }

    .history-details { flex-wrap: wrap; gap: 6px; }

    .sparkline-container { max-width: 100%; overflow: hidden; }
    .sparkline-svg { height: 100px; }

    .stats-bar { gap: 8px; padding: 12px; }
    .stat-item { min-width: 60px; }
    .stat-value { font-size: 20px; }
  }
`;var at=["overdue","triggered","due_soon","ok"],E=class extends y{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._loadingObjects=!0;this._objectsLoaded=!1;this._onEntitiesChanged=t=>{this._valueChanged("entity_ids",t.detail.value||[])}}get _lang(){return this.hass?.language||"en"}setConfig(t){this._config={...t}}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._objectsLoaded&&(this._objectsLoaded=!0,this._loadObjects())}async _loadObjects(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=t.objects||[]}catch{this._objects=[]}this._loadingObjects=!1}_valueChanged(t,a){let n={...this._config,[t]:a};Array.isArray(a)&&a.length===0&&delete n[t],this._config=n,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n}}))}_toggleStatus(t,a){let n=new Set(this._config.filter_status||[]);a?n.add(t):n.delete(t),this._valueChanged("filter_status",[...n])}_toggleObject(t,a){let n=new Set(this._config.filter_objects||[]);a?n.add(t):n.delete(t),this._valueChanged("filter_objects",[...n])}render(){let t=this._lang,a=new Set(this._config.filter_status||[]),n=new Set(this._config.filter_objects||[]),r=[...this._objects].map(o=>o.object.name).sort((o,s)=>o.localeCompare(s));return m`
      <div class="editor">
        <ha-textfield
          label="${_("card_title",t)}"
          .value=${this._config.title||""}
          @input=${o=>this._valueChanged("title",o.target.value)}
        ></ha-textfield>

        <!-- Status filter (chip row) -->
        <div class="field">
          <div class="field-label">${_("card_filter_status",t)}</div>
          <div class="chip-row">
            ${at.map(o=>m`
              <label class="chip ${a.has(o)?"active":""}">
                <input type="checkbox"
                  .checked=${a.has(o)}
                  @change=${s=>this._toggleStatus(o,s.target.checked)} />
                ${_(o,t)}
              </label>
            `)}
          </div>
          <div class="field-help">${_("card_filter_status_help",t)}</div>
        </div>

        <!-- Object filter (multi-checkbox) -->
        <div class="field">
          <div class="field-label">${_("card_filter_objects",t)}</div>
          ${this._loadingObjects?m`<div class="field-help">${_("card_loading_objects",t)}</div>`:r.length===0?m`<div class="field-help">${_("no_objects",t)}</div>`:m`
                <div class="object-list">
                  ${r.map(o=>m`
                    <label class="object-row">
                      <input type="checkbox"
                        .checked=${n.has(o)}
                        @change=${s=>this._toggleObject(o,s.target.checked)} />
                      <span>${o}</span>
                    </label>
                  `)}
                </div>
                <div class="field-help">${_("card_filter_objects_help",t)}</div>
              `}
        </div>

        <!-- Entity-id filter (HA-native pattern) -->
        <div class="field">
          <div class="field-label">${_("card_filter_entities",t)}</div>
          <ha-entities-picker
            .hass=${this.hass}
            .value=${this._config.entity_ids||[]}
            include-domains='["sensor", "binary_sensor"]'
            @value-changed=${this._onEntitiesChanged}
          ></ha-entities-picker>
          <div class="field-help">${_("card_filter_entities_help",t)}</div>
        </div>

        <ha-formfield label="${_("card_show_header",t)}">
          <ha-switch
            .checked=${this._config.show_header!==!1}
            @change=${o=>this._valueChanged("show_header",o.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${_("card_show_actions",t)}">
          <ha-switch
            .checked=${this._config.show_actions!==!1}
            @change=${o=>this._valueChanged("show_actions",o.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${_("card_compact",t)}">
          <ha-switch
            .checked=${this._config.compact||!1}
            @change=${o=>this._valueChanged("compact",o.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-textfield
          label="${_("card_max_items",t)}"
          type="number"
          .value=${String(this._config.max_items||0)}
          @input=${o=>this._valueChanged("max_items",parseInt(o.target.value,10)||0)}
        ></ha-textfield>
        ${c}
      </div>
    `}};E.styles=k`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    ha-textfield { display: block; }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .field-label {
      font-size: 13px;
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    .field-help {
      font-size: 12px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .chip-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      cursor: pointer;
      font-size: 13px;
      user-select: none;
      transition: background 0.15s, border-color 0.15s;
    }
    .chip:hover {
      background: var(--secondary-background-color);
    }
    .chip.active {
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-color: var(--primary-color);
    }
    .chip input {
      display: none;
    }
    .object-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 4px 12px;
      padding: 6px 0;
    }
    .object-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 3px 0;
      font-size: 13px;
      cursor: pointer;
    }
    .object-row input { cursor: pointer; }
  `,g([b({attribute:!1})],E.prototype,"hass",2),g([f()],E.prototype,"_config",2),g([f()],E.prototype,"_objects",2),g([f()],E.prototype,"_loadingObjects",2);customElements.get("maintenance-supporter-card-editor")||customElements.define("maintenance-supporter-card-editor",E);var nt={name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",group_name:"name",group_description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_for_minutes:"trigger_for_minutes"};function it(i,e){let t=nt[i];if(!t)return i;let a=_(t,e);return a&&a!==t?a:i}function ot(i){let t=i.match(/data\['([^']+)'\]/)?.[1],a;return(a=i.match(/length of value must be at most (\d+)/))?{field:t,rule:"too_long",param:a[1]}:(a=i.match(/length of value must be at least (\d+)/))?{field:t,rule:"too_short",param:a[1]}:(a=i.match(/value must be at most (\S+)/))?{field:t,rule:"value_too_high",param:a[1]}:(a=i.match(/value must be at least (\S+)/))?{field:t,rule:"value_too_low",param:a[1]}:/required key not provided/.test(i)?{field:t,rule:"required"}:(a=i.match(/expected (\w+)/))?{field:t,rule:"wrong_type",param:a[1]}:/value must be one of/.test(i)?{field:t,rule:"invalid_choice"}:/not a valid value/.test(i)?{field:t,rule:"invalid_value"}:{field:t,rule:"unknown"}}function Ee(i,e,t){if(typeof i=="string")return i;if(typeof i!="object"||i===null)return t;let a=i,n=a.message||a.error?.message||"";if(!n)return t;let r=ot(n),o=r.field?it(r.field,e):"",s=l=>_(l,e).replace("{field}",o).replace("{n}",r.param??"");switch(r.rule){case"too_long":return s("err_too_long");case"too_short":return s("err_too_short");case"value_too_high":return s("err_value_too_high");case"value_too_low":return s("err_value_too_low");case"required":return s("err_required");case"wrong_type":return s("err_wrong_type").replace("{type}",r.param??"");case"invalid_choice":return s("err_invalid_choice");case"invalid_value":return s("err_invalid_value");default:return n||t}}var h=class extends y{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed"}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState={},this._feedback="needed")}_toggleCheck(t){let a=String(t);this._checklistState={...this._checklistState,[a]:!this._checklistState[a]}}_setFeedback(t){this._feedback=t}async _complete(){this._loading=!0,this._error="";try{let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(t.notes=this._notes),this._cost){let a=parseFloat(this._cost);!isNaN(a)&&a>=0&&(t.cost=a)}if(this._duration){let a=parseInt(this._duration,10);!isNaN(a)&&a>=0&&(t.duration=a)}this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),await this.hass.connection.sendMessagePromise(t),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(t){this._error=Ee(t,this.lang,_("save_error",this.lang))}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return m``;let t=this.lang||this.hass?.language||"en";return m`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${_("complete_title",t)}${this.taskName}</div>
        <div class="content">
          ${this._error?m`<div class="error">${this._error}</div>`:c}
          ${this.checklist.length>0?m`
            <div class="checklist-section">
              <label class="checklist-label">${_("checklist",t)}</label>
              ${this.checklist.map((a,n)=>m`
                <label class="checklist-item" @click=${()=>this._toggleCheck(n)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(n)]} />
                  <span>${a}</span>
                </label>
              `)}
            </div>
          `:c}
          <ha-textfield
            label="${_("notes_optional",t)}"
            .value=${this._notes}
            @input=${a=>this._notes=a.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${_("cost_optional",t)}"
            type="number"
            step="0.01"
            .value=${this._cost}
            @input=${a=>this._cost=a.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${_("duration_minutes",t)}"
            type="number"
            .value=${this._duration}
            @input=${a=>this._duration=a.target.value}
          ></ha-textfield>
          ${this.adaptiveEnabled?m`
            <div class="feedback-section">
              <label class="feedback-label">${_("was_maintenance_needed",t)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${_("feedback_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${_("feedback_not_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${_("feedback_not_sure",t)}</button>
              </div>
            </div>
          `:c}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${_("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading}
          >
            ${this._loading?_("completing",t):_("complete",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};h.styles=k`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    ha-textfield {
      display: block;
    }
    .checklist-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: 4px;
    }
    .checklist-label {
      font-weight: 500;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 0;
      font-size: 14px;
    }
    .checklist-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
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
  `,g([b({attribute:!1})],h.prototype,"hass",2),g([b()],h.prototype,"entryId",2),g([b()],h.prototype,"taskId",2),g([b()],h.prototype,"taskName",2),g([b()],h.prototype,"lang",2),g([b({type:Array})],h.prototype,"checklist",2),g([b({type:Boolean})],h.prototype,"adaptiveEnabled",2),g([f()],h.prototype,"_open",2),g([f()],h.prototype,"_notes",2),g([f()],h.prototype,"_cost",2),g([f()],h.prototype,"_duration",2),g([f()],h.prototype,"_loading",2),g([f()],h.prototype,"_error",2),g([f()],h.prototype,"_checklistState",2),g([f()],h.prototype,"_feedback",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",h);var x=class extends y{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._stats=null;this._unsub=null;this._dataLoaded=!1;this._lastConnection=null;this._onCompleted=async()=>{await this._loadData()}}get _lang(){return this.hass?.language||"en"}static getConfigElement(){return document.createElement("maintenance-supporter-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-card",show_header:!0,show_actions:!0,filter_status:["overdue","triggered","due_soon"],max_items:10}}setConfig(t){this._config=t}getCardSize(){return 3}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null}updated(t){if(super.updated(t),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[t,a]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=t.objects,this._stats=a}catch{}}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(t=>{let a=t;this._objects=a.objects},{type:"maintenance_supporter/subscribe"})}catch{}}get _flatTasks(){let t=[],{filter_status:a,filter_objects:n,entity_ids:r,max_items:o}=this._config,s=r?.length?new Set(r):null;for(let u of this._objects)if(!(n?.length&&!n.includes(u.object.name)))for(let p of u.tasks)a?.length&&!a.includes(p.status)||s&&!(p.sensor_entity_id&&s.has(p.sensor_entity_id)||p.binary_sensor_entity_id&&s.has(p.binary_sensor_entity_id))||t.push({entry_id:u.entry_id,object_name:u.object.name,task:p});let l={overdue:0,triggered:1,due_soon:2,ok:3};return t.sort((u,p)=>(l[u.task.status]??9)-(l[p.task.status]??9)),o&&o>0?t.slice(0,o):t}render(){let t=this._lang,a=this._config.title||_("maintenance",t),n=this._config.show_header!==!1,r=this._config.show_actions!==!1,o=this._config.compact||!1,s=this._flatTasks,l=this._stats;return m`
      <ha-card>
        <div class="card-header">
          <h1>${a}</h1>
          ${n&&l?m`
                <div class="header-stats">
                  ${l.overdue>0?m`<span class="badge overdue">${l.overdue}</span>`:c}
                  ${l.due_soon>0?m`<span class="badge due_soon">${l.due_soon}</span>`:c}
                  ${l.triggered>0?m`<span class="badge triggered">${l.triggered}</span>`:c}
                </div>
              `:c}
        </div>
        ${s.length===0?m`<div class="empty-card">${_("no_tasks_short",t)}</div>`:m`
              <div class="task-list ${o?"compact":""}">
                ${s.map(({entry_id:u,object_name:p,task:d})=>m`
                    <div class="task-item">
                      <div class="status-dot" style="background: ${ze[d.status]||"#ccc"}"></div>
                      <div class="task-info">
                        <div class="task-name">${d.name}</div>
                        ${o?c:m`<div class="task-meta">${p} · ${_(d.type,t)}</div>`}
                      </div>
                      <div class="task-due">
                        ${d.days_until_due!==null&&d.days_until_due!==void 0?d.days_until_due<0?m`<span class="overdue-text">${Math.abs(d.days_until_due)}${t.startsWith("de")?"T":"d"}</span>`:d.days_until_due===0?_("today",t):`${d.days_until_due}${t.startsWith("de")?"T":"d"}`:d.trigger_active?"\u26A1":"\u2014"}
                      </div>
                      ${r?m`
                            <mwc-icon-button
                              class="complete-btn"
                              title="${_("complete",t)}"
                              @click=${()=>{let v=this.shadowRoot.querySelector("maintenance-complete-dialog");v.entryId=u,v.taskId=d.id,v.taskName=d.name,v.checklist=d.checklist||[],v.adaptiveEnabled=!!d.adaptive_config?.enabled,v.lang=t,v.open()}}
                            >
                              <ha-icon icon="mdi:check"></ha-icon>
                            </mwc-icon-button>
                          `:c}
                    </div>
                  `)}
              </div>
            `}
      </ha-card>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onCompleted}
      ></maintenance-complete-dialog>
    `}};x.styles=[je,k`
      ha-card { overflow: hidden; }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 16px 8px;
      }

      .card-header h1 { margin: 0; font-size: 18px; font-weight: 500; }
      .header-stats { display: flex; gap: 6px; }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        height: 22px;
        border-radius: 11px;
        font-size: 12px;
        font-weight: 600;
        color: white;
        padding: 0 6px;
      }

      .badge.overdue { background: var(--error-color, #f44336); }
      .badge.due_soon { background: var(--warning-color, #ff9800); }
      .badge.triggered { background: #ff5722; }

      .empty-card { padding: 16px; text-align: center; color: var(--secondary-text-color); }
      .task-list { padding: 0 16px 16px; }

      .task-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .task-item:last-child { border-bottom: none; }
      .task-list.compact .task-item { padding: 4px 0; }

      .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
      .task-info { flex: 1; min-width: 0; }
      .task-name { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .task-meta { font-size: 12px; color: var(--secondary-text-color); }

      .task-due { font-size: 13px; color: var(--secondary-text-color); min-width: 40px; text-align: right; }
      .overdue-text { color: var(--error-color); font-weight: 500; }

      .complete-btn {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 18px;
        color: var(--primary-color);
      }
    `],g([b({attribute:!1})],x.prototype,"hass",2),g([f()],x.prototype,"_config",2),g([f()],x.prototype,"_objects",2),g([f()],x.prototype,"_stats",2),g([f()],x.prototype,"_unsub",2);customElements.get("maintenance-supporter-card")||customElements.define("maintenance-supporter-card",x);window.customCards=window.customCards||[];window.customCards.push({type:"maintenance-supporter-card",name:"Maintenance Supporter",description:"Overview of your maintenance tasks with quick actions.",preview:!0});export{x as MaintenanceSupporterCard};
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
