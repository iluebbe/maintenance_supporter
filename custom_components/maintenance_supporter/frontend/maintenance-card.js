var Se=Object.defineProperty;var Ce=Object.getOwnPropertyDescriptor;var u=(n,e,t,a)=>{for(var i=a>1?void 0:a?Ce(e,t):e,o=n.length-1,r;o>=0;o--)(r=n[o])&&(i=(a?r(e,t,i):r(i))||i);return a&&i&&Se(e,t,i),i};var V=globalThis,W=V.ShadowRoot&&(V.ShadyCSS===void 0||V.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Z=Symbol(),se=new WeakMap,M=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(W&&e===void 0){let a=t!==void 0&&t.length===1;a&&(e=se.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&se.set(t,e))}return e}toString(){return this.cssText}},le=n=>new M(typeof n=="string"?n:n+"",void 0,Z),k=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((a,i,o)=>a+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[o+1],n[0]);return new M(t,n,Z)},ce=(n,e)=>{if(W)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let a=document.createElement("style"),i=V.litNonce;i!==void 0&&a.setAttribute("nonce",i),a.textContent=t.cssText,n.appendChild(a)}},Y=W?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let a of e.cssRules)t+=a.cssText;return le(t)})(n):n;var{is:ze,defineProperty:Te,getOwnPropertyDescriptor:je,getOwnPropertyNames:Ne,getOwnPropertySymbols:De,getPrototypeOf:Me}=Object,A=globalThis,de=A.trustedTypes,Pe=de?de.emptyScript:"",Re=A.reactiveElementPolyfillSupport,P=(n,e)=>n,R={toAttribute(n,e){switch(e){case Boolean:n=n?Pe:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},G=(n,e)=>!ze(n,e),ue={attribute:!0,type:String,converter:R,reflect:!1,useDefault:!1,hasChanged:G};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),A.litPropertyMetadata??(A.litPropertyMetadata=new WeakMap);var w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ue){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let a=Symbol(),i=this.getPropertyDescriptor(e,a,t);i!==void 0&&Te(this.prototype,e,i)}}static getPropertyDescriptor(e,t,a){let{get:i,set:o}=je(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:i,set(r){let l=i?.call(this);o?.call(this,r),this.requestUpdate(e,l,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ue}static _$Ei(){if(this.hasOwnProperty(P("elementProperties")))return;let e=Me(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(P("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(P("properties"))){let t=this.properties,a=[...Ne(t),...De(t)];for(let i of a)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[a,i]of t)this.elementProperties.set(a,i)}this._$Eh=new Map;for(let[t,a]of this.elementProperties){let i=this._$Eu(t,a);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let a=new Set(e.flat(1/0).reverse());for(let i of a)t.unshift(Y(i))}else e!==void 0&&t.push(Y(e));return t}static _$Eu(e,t){let a=t.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ce(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){let a=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,a);if(i!==void 0&&a.reflect===!0){let o=(a.converter?.toAttribute!==void 0?a.converter:R).toAttribute(t,a.type);this._$Em=e,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){let a=this.constructor,i=a._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let o=a.getPropertyOptions(i),r=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:R;this._$Em=i;let l=r.fromAttribute(t,o.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,t,a,i=!1,o){if(e!==void 0){let r=this.constructor;if(i===!1&&(o=this[e]),a??(a=r.getPropertyOptions(e)),!((a.hasChanged??G)(o,t)||a.useDefault&&a.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,a))))return;this.C(e,t,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:i,wrapped:o},r){a&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,r??t??this[e]),o!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let a=this.constructor.elementProperties;if(a.size>0)for(let[i,o]of a){let{wrapped:r}=o,l=this[i];r!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,o,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(a=>a.hostUpdate?.()),this.update(t)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[P("elementProperties")]=new Map,w[P("finalized")]=new Map,Re?.({ReactiveElement:w}),(A.reactiveElementVersions??(A.reactiveElementVersions=[])).push("2.1.2");var O=globalThis,pe=n=>n,K=O.trustedTypes,_e=K?K.createPolicy("lit-html",{createHTML:n=>n}):void 0,ve="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,ye="?"+$,Fe=`<${ye}>`,z=document,I=()=>z.createComment(""),q=n=>n===null||typeof n!="object"&&typeof n!="function",oe=Array.isArray,Oe=n=>oe(n)||typeof n?.[Symbol.iterator]=="function",X=`[ 	
\f\r]`,F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,he=/-->/g,ge=/>/g,S=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),me=/'/g,fe=/"/g,xe=/^(?:script|style|textarea|title)$/i,re=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),_=re(1),tt=re(2),at=re(3),T=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),be=new WeakMap,C=z.createTreeWalker(z,129);function ke(n,e){if(!oe(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return _e!==void 0?_e.createHTML(e):e}var Ie=(n,e)=>{let t=n.length-1,a=[],i,o=e===2?"<svg>":e===3?"<math>":"",r=F;for(let l=0;l<t;l++){let s=n[l],p,g,c=-1,f=0;for(;f<s.length&&(r.lastIndex=f,g=r.exec(s),g!==null);)f=r.lastIndex,r===F?g[1]==="!--"?r=he:g[1]!==void 0?r=ge:g[2]!==void 0?(xe.test(g[2])&&(i=RegExp("</"+g[2],"g")),r=S):g[3]!==void 0&&(r=S):r===S?g[0]===">"?(r=i??F,c=-1):g[1]===void 0?c=-2:(c=r.lastIndex-g[2].length,p=g[1],r=g[3]===void 0?S:g[3]==='"'?fe:me):r===fe||r===me?r=S:r===he||r===ge?r=F:(r=S,i=void 0);let E=r===S&&n[l+1].startsWith("/>")?" ":"";o+=r===F?s+Fe:c>=0?(a.push(p),s.slice(0,c)+ve+s.slice(c)+$+E):s+$+(c===-2?l:E)}return[ke(n,o+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),a]},L=class n{constructor({strings:e,_$litType$:t},a){let i;this.parts=[];let o=0,r=0,l=e.length-1,s=this.parts,[p,g]=Ie(e,t);if(this.el=n.createElement(p,a),C.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=C.nextNode())!==null&&s.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(ve)){let f=g[r++],E=i.getAttribute(c).split($),B=/([.?@])?(.*)/.exec(f);s.push({type:1,index:o,name:B[2],strings:E,ctor:B[1]==="."?te:B[1]==="?"?ae:B[1]==="@"?ie:D}),i.removeAttribute(c)}else c.startsWith($)&&(s.push({type:6,index:o}),i.removeAttribute(c));if(xe.test(i.tagName)){let c=i.textContent.split($),f=c.length-1;if(f>0){i.textContent=K?K.emptyScript:"";for(let E=0;E<f;E++)i.append(c[E],I()),C.nextNode(),s.push({type:2,index:++o});i.append(c[f],I())}}}else if(i.nodeType===8)if(i.data===ye)s.push({type:2,index:o});else{let c=-1;for(;(c=i.data.indexOf($,c+1))!==-1;)s.push({type:7,index:o}),c+=$.length-1}o++}}static createElement(e,t){let a=z.createElement("template");return a.innerHTML=e,a}};function N(n,e,t=n,a){if(e===T)return e;let i=a!==void 0?t._$Co?.[a]:t._$Cl,o=q(e)?void 0:e._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(n),i._$AT(n,t,a)),a!==void 0?(t._$Co??(t._$Co=[]))[a]=i:t._$Cl=i),i!==void 0&&(e=N(n,i._$AS(n,e.values),i,a)),e}var ee=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:a}=this._$AD,i=(e?.creationScope??z).importNode(t,!0);C.currentNode=i;let o=C.nextNode(),r=0,l=0,s=a[0];for(;s!==void 0;){if(r===s.index){let p;s.type===2?p=new H(o,o.nextSibling,this,e):s.type===1?p=new s.ctor(o,s.name,s.strings,this,e):s.type===6&&(p=new ne(o,this,e)),this._$AV.push(p),s=a[++l]}r!==s?.index&&(o=C.nextNode(),r++)}return C.currentNode=z,i}p(e){let t=0;for(let a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}},H=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=N(this,e,t),q(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==T&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Oe(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&q(this._$AH)?this._$AA.nextSibling.data=e:this.T(z.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:a}=e,i=typeof a=="number"?this._$AC(e):(a.el===void 0&&(a.el=L.createElement(ke(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===i)this._$AH.p(t);else{let o=new ee(i,this),r=o.u(this.options);o.p(t),this.T(r),this._$AH=o}}_$AC(e){let t=be.get(e.strings);return t===void 0&&be.set(e.strings,t=new L(e)),t}k(e){oe(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,a,i=0;for(let o of e)i===t.length?t.push(a=new n(this.O(I()),this.O(I()),this,this.options)):a=t[i],a._$AI(o),i++;i<t.length&&(this._$AR(a&&a._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let a=pe(e).nextSibling;pe(e).remove(),e=a}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},D=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,i,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=d}_$AI(e,t=this,a,i){let o=this.strings,r=!1;if(o===void 0)e=N(this,e,t,0),r=!q(e)||e!==this._$AH&&e!==T,r&&(this._$AH=e);else{let l=e,s,p;for(e=o[0],s=0;s<o.length-1;s++)p=N(this,l[a+s],t,s),p===T&&(p=this._$AH[s]),r||(r=!q(p)||p!==this._$AH[s]),p===d?e=d:e!==d&&(e+=(p??"")+o[s+1]),this._$AH[s]=p}r&&!i&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},te=class extends D{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},ae=class extends D{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},ie=class extends D{constructor(e,t,a,i,o){super(e,t,a,i,o),this.type=5}_$AI(e,t=this){if((e=N(this,e,t,0)??d)===T)return;let a=this._$AH,i=e===d&&a!==d||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,o=e!==d&&(a===d||i);i&&this.element.removeEventListener(this.name,this,a),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ne=class{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){N(this,e)}};var qe=O.litHtmlPolyfillSupport;qe?.(L,H),(O.litHtmlVersions??(O.litHtmlVersions=[])).push("3.3.2");var we=(n,e,t)=>{let a=t?.renderBefore??e,i=a._$litPart$;if(i===void 0){let o=t?.renderBefore??null;a._$litPart$=i=new H(e.insertBefore(I(),o),o,void 0,t??{})}return i._$AI(n),i};var U=globalThis,y=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;let e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=we(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return T}};y._$litElement$=!0,y.finalized=!0,U.litElementHydrateSupport?.({LitElement:y});var Le=U.litElementPolyfillSupport;Le?.({LitElement:y});(U.litElementVersions??(U.litElementVersions=[])).push("4.2.2");var J=n=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(n,e)}):customElements.define(n,e)};var He={attribute:!0,type:String,converter:R,reflect:!1,hasChanged:G},Ue=(n=He,e,t)=>{let{kind:a,metadata:i}=t,o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),a==="setter"&&((n=Object.create(n)).wrapped=!0),o.set(t.name,n),a==="accessor"){let{name:r}=t;return{set(l){let s=e.get.call(this);e.set.call(this,l),this.requestUpdate(r,s,n,!0,l)},init(l){return l!==void 0&&this.C(r,void 0,n,l),l}}}if(a==="setter"){let{name:r}=t;return function(l){let s=this[r];e.call(this,l),this.requestUpdate(r,s,n,!0,l)}}throw Error("Unsupported decorator location: "+a)};function v(n){return(e,t)=>typeof t=="object"?Ue(n,e,t):((a,i,o)=>{let r=i.hasOwnProperty(o);return i.constructor.createProperty(o,a),r?Object.getOwnPropertyDescriptor(i,o):void 0})(n,e,t)}function b(n){return v({...n,state:!0,attribute:!1})}var Ae={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"#ff5722"};var Be={maintenance:"Wartung",objects:"Objekte",tasks:"Aufgaben",overdue:"\xDCberf\xE4llig",due_soon:"Bald f\xE4llig",triggered:"Ausgel\xF6st",ok:"OK",all:"Alle",new_object:"+ Neues Objekt",edit:"Bearbeiten",delete:"L\xF6schen",add_task:"+ Aufgabe",complete:"Erledigt",skip:"\xDCberspringen",reset:"Zur\xFCcksetzen",cancel:"Abbrechen",completing:"Wird erledigt\u2026",type:"Typ",schedule:"Planung",interval:"Intervall",warning:"Vorwarnung",last_performed:"Zuletzt durchgef\xFChrt",next_due:"N\xE4chste F\xE4lligkeit",days_until_due:"Tage bis f\xE4llig",times_performed:"Durchf\xFChrungen",total_cost:"Gesamtkosten",avg_duration:"\xD8 Dauer",trigger:"Trigger",entity:"Entit\xE4t",attribute:"Attribut",trigger_type:"Trigger-Typ",active:"Aktiv",yes:"Ja",no:"Nein",current_value:"Aktueller Wert",threshold_above:"Obergrenze",threshold_below:"Untergrenze",threshold:"Schwellwert",counter:"Z\xE4hler",state_change:"Zustands\xE4nderung",target_value:"Zielwert",baseline:"Nulllinie",target_changes:"Ziel-\xC4nderungen",entity_min:"Minimum",entity_max:"Maximum",for_minutes:"F\xFCr (Minuten)",time_based:"Zeitbasiert",sensor_based:"Sensorbasiert",manual:"Manuell",cleaning:"Reinigung",inspection:"Inspektion",replacement:"Austausch",calibration:"Kalibrierung",service:"Service",custom:"Benutzerdefiniert",history:"Verlauf",notes:"Notizen",documentation:"Dokumentation",cost:"Kosten",duration:"Dauer",both:"Beides",trigger_val:"Trigger-Wert",complete_title:"Erledigt: ",checklist:"Checkliste",notes_optional:"Notizen (optional)",cost_optional:"Kosten (optional)",duration_minutes:"Dauer in Minuten (optional)",days:"Tage",day:"Tag",today:"Heute",d_overdue:"T \xFCberf\xE4llig",no_tasks:"Keine Wartungsaufgaben vorhanden. Erstellen Sie ein Objekt um zu beginnen.",no_tasks_short:"Keine Aufgaben",no_history:"Noch keine Verlaufseintr\xE4ge.",show_all:"Alle anzeigen",cost_duration_chart:"Kosten & Dauer",installed:"Installiert",confirm_delete_object:"Dieses Objekt und alle zugeh\xF6rigen Aufgaben l\xF6schen?",confirm_delete_task:"Diese Aufgabe wirklich l\xF6schen?",value_history:"Wertverlauf",min:"Min",max:"Max",save:"Speichern",saving:"Speichern\u2026",edit_task:"Aufgabe bearbeiten",new_task:"Neue Wartungsaufgabe",task_name:"Aufgabenname",maintenance_type:"Wartungstyp",schedule_type:"Planungsart",interval_days:"Intervall (Tage)",warning_days:"Warntage",edit_object:"Objekt bearbeiten",name:"Name",manufacturer_optional:"Hersteller (optional)",model_optional:"Modell (optional)",trigger_configuration:"Trigger-Konfiguration",entity_id:"Entit\xE4ts-ID",attribute_optional:"Attribut (optional, leer = Zustand)",trigger_above:"Ausl\xF6sen wenn \xFCber",trigger_below:"Ausl\xF6sen wenn unter",for_at_least_minutes:"F\xFCr mindestens (Minuten)",safety_interval_days:"Sicherheitsintervall (Tage, optional)",delta_mode:"Delta-Modus",from_state_optional:"Von Zustand (optional)",to_state_optional:"Zu Zustand (optional)",documentation_url_optional:"Dokumentation URL (optional)",responsible_user:"Verantwortlicher Benutzer",no_user_assigned:"(Kein Benutzer zugewiesen)",all_users:"Alle Benutzer",my_tasks:"Meine Aufgaben",budget_monthly:"Monatsbudget",budget_yearly:"Jahresbudget",export_csv:"CSV Export",import_csv:"CSV Import",groups:"Gruppen",no_groups:"Keine Gruppen definiert.",group_tasks:"Aufgaben",loading_chart:"Daten werden geladen...",was_maintenance_needed:"War diese Wartung n\xF6tig?",feedback_needed:"N\xF6tig",feedback_not_needed:"Nicht n\xF6tig",feedback_not_sure:"Unsicher",suggested_interval:"Empfohlenes Intervall",apply_suggestion:"\xDCbernehmen",dismiss_suggestion:"Verwerfen",adaptive_scheduling:"Adaptive Planung",confidence_low:"Niedrig",confidence_medium:"Mittel",confidence_high:"Hoch",confidence:"Konfidenz",recommended:"empfohlen",seasonal_awareness:"Saisonale Anpassung",seasonal_factor:"Saisonfaktor",seasonal_chart_title:"Saisonale Faktoren",seasonal_learned:"Gelernt",seasonal_manual:"Manuell",seasonal_insufficient_data:"Nicht genug Daten",month_jan:"Jan",month_feb:"Feb",month_mar:"M\xE4r",month_apr:"Apr",month_may:"Mai",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dez",hemisphere_north:"N\xF6rdlich",hemisphere_south:"S\xFCdlich",seasonal_factor_short:"Saison",sensor_prediction:"Sensorvorhersage",degradation_trend:"Trend",trend_rising:"Steigend",trend_falling:"Fallend",trend_stable:"Stabil",trend_insufficient_data:"Unzureichende Daten",days_until_threshold:"Tage bis Schwellwert",threshold_exceeded:"Schwellwert \xFCberschritten",environmental_adjustment:"Umgebungsfaktor",sensor_prediction_urgency:"Sensor prognostiziert Schwellwert in ~{days} Tagen",day_short:"Tag",prediction_projection:"Projektion",weibull_reliability_curve:"Zuverl\xE4ssigkeitskurve",weibull_failure_probability:"Ausfallwahrscheinlichkeit",weibull_reliability:"Zuverl\xE4ssigkeit",weibull_beta_param:"Form \u03B2",weibull_eta_param:"Skala \u03B7",weibull_r_squared:"G\xFCte R\xB2",beta_early_failures:"Fr\xFChausf\xE4lle",beta_random_failures:"Zuf\xE4llige Ausf\xE4lle",beta_wear_out:"Verschlei\xDF",beta_highly_predictable:"Hochvorhersagbar",confidence_interval:"Konfidenzintervall",confidence_conservative:"Konservativ",confidence_aggressive:"Optimistisch",current_interval_marker:"Aktuelles Intervall",recommended_marker:"Empfohlen",reliability_at_current:"Zuverl\xE4ssigkeit bei aktuellem Intervall",characteristic_life:"Charakteristische Lebensdauer",chart_mini_sparkline:"Trend-Sparkline",chart_history:"Kosten- und Dauer-Verlauf",chart_seasonal:"Saisonfaktoren, 12 Monate",chart_weibull:"Weibull-Zuverl\xE4ssigkeitskurve",chart_sparkline:"Sensor-Triggerwert-Verlauf",days_progress:"Tagesfortschritt",qr_code:"QR-Code",qr_generating:"QR-Code wird generiert\u2026",qr_error:"QR-Code konnte nicht generiert werden.",qr_print:"Drucken",qr_download:"SVG herunterladen",qr_action:"Aktion beim Scannen",qr_action_view:"Wartungsinfo anzeigen",qr_action_complete:"Wartung als erledigt markieren",overview:"\xDCbersicht",analysis:"Analyse",recent_activities:"Letzte Aktivit\xE4ten",search_notes:"Notizen durchsuchen",avg_cost:"\xD8 Kosten",no_advanced_features:"Keine erweiterten Funktionen aktiviert",analysis_not_enough_data:"Noch nicht gen\xFCgend Daten f\xFCr die Analyse vorhanden.",analysis_not_enough_data_hint:"Die Weibull-Analyse ben\xF6tigt mindestens 5 abgeschlossene Wartungen, saisonale Muster werden nach 6+ Datenpunkten pro Monat sichtbar.",analysis_manual_task_hint:"Manuelle Aufgaben ohne Intervall erzeugen keine Analysedaten.",current:"Aktuell",shorter:"K\xFCrzer",longer:"L\xE4nger",normal:"Normal"},Ve={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",ok:"OK",all:"All",new_object:"+ New Object",edit:"Edit",delete:"Delete",add_task:"+ Add Task",complete:"Complete",skip:"Skip",reset:"Reset",cancel:"Cancel",completing:"Completing\u2026",type:"Type",schedule:"Schedule",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",times_performed:"Times performed",total_cost:"Total cost",avg_duration:"Avg duration",trigger:"Trigger",entity:"Entity",attribute:"Attribute",trigger_type:"Trigger type",active:"Active",yes:"Yes",no:"No",current_value:"Current value",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",entity_min:"Minimum",entity_max:"Maximum",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",custom:"Custom",history:"History",notes:"Notes",documentation:"Documentation",cost:"Cost",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",value_history:"Value history",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",attribute_optional:"Attribute (optional, blank = state)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",responsible_user:"Responsible User",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",export_csv:"CSV Export",import_csv:"CSV Import",groups:"Groups",no_groups:"No groups defined.",group_tasks:"Tasks",loading_chart:"Loading chart data...",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",dismiss_suggestion:"Dismiss",adaptive_scheduling:"Adaptive Scheduling",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",confidence:"Confidence",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",seasonal_factor:"Seasonal factor",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",seasonal_insufficient_data:"Insufficient data",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",hemisphere_north:"Northern",hemisphere_south:"Southern",seasonal_factor_short:"Season",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",prediction_projection:"Projection",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_reliability:"Reliability",weibull_beta_param:"Shape \u03B2",weibull_eta_param:"Scale \u03B7",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",reliability_at_current:"Reliability at current interval",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal"},We={maintenance:"Onderhoud",objects:"Objecten",tasks:"Taken",overdue:"Achterstallig",due_soon:"Binnenkort",triggered:"Geactiveerd",ok:"OK",all:"Alle",new_object:"+ Nieuw object",edit:"Bewerken",delete:"Verwijderen",add_task:"+ Taak",complete:"Voltooid",skip:"Overslaan",reset:"Resetten",cancel:"Annuleren",completing:"Wordt voltooid\u2026",type:"Type",schedule:"Planning",interval:"Interval",warning:"Waarschuwing",last_performed:"Laatst uitgevoerd",next_due:"Volgende keer",days_until_due:"Dagen tot vervaldatum",times_performed:"Aantal keer uitgevoerd",total_cost:"Totale kosten",avg_duration:"\xD8 Duur",trigger:"Trigger",entity:"Entiteit",attribute:"Attribuut",trigger_type:"Triggertype",active:"Actief",yes:"Ja",no:"Nee",current_value:"Huidige waarde",threshold_above:"Bovengrens",threshold_below:"Ondergrens",threshold:"Drempelwaarde",counter:"Teller",state_change:"Statuswijziging",target_value:"Doelwaarde",baseline:"Basislijn",target_changes:"Doelwijzigingen",entity_min:"Minimum",entity_max:"Maximum",for_minutes:"Voor (minuten)",time_based:"Tijdgebaseerd",sensor_based:"Sensorgebaseerd",manual:"Handmatig",cleaning:"Reiniging",inspection:"Inspectie",replacement:"Vervanging",calibration:"Kalibratie",service:"Service",custom:"Aangepast",history:"Geschiedenis",notes:"Notities",documentation:"Documentatie",cost:"Kosten",duration:"Duur",both:"Beide",trigger_val:"Triggerwaarde",complete_title:"Voltooid: ",checklist:"Checklist",notes_optional:"Notities (optioneel)",cost_optional:"Kosten (optioneel)",duration_minutes:"Duur in minuten (optioneel)",days:"dagen",day:"dag",today:"Vandaag",d_overdue:"d achterstallig",no_tasks:"Geen onderhoudstaken. Maak een object aan om te beginnen.",no_tasks_short:"Geen taken",no_history:"Nog geen geschiedenisitems.",show_all:"Alles tonen",cost_duration_chart:"Kosten & Duur",installed:"Ge\xEFnstalleerd",confirm_delete_object:"Dit object en alle bijbehorende taken verwijderen?",confirm_delete_task:"Deze taak verwijderen?",value_history:"Waardegeschiedenis",min:"Min",max:"Max",save:"Opslaan",saving:"Opslaan\u2026",edit_task:"Taak bewerken",new_task:"Nieuwe onderhoudstaak",task_name:"Taaknaam",maintenance_type:"Onderhoudstype",schedule_type:"Planningstype",interval_days:"Interval (dagen)",warning_days:"Waarschuwingsdagen",edit_object:"Object bewerken",name:"Naam",manufacturer_optional:"Fabrikant (optioneel)",model_optional:"Model (optioneel)",trigger_configuration:"Triggerconfiguratie",entity_id:"Entiteits-ID",attribute_optional:"Attribuut (optioneel, leeg = status)",trigger_above:"Activeren als boven",trigger_below:"Activeren als onder",for_at_least_minutes:"Voor minstens (minuten)",safety_interval_days:"Veiligheidsinterval (dagen, optioneel)",delta_mode:"Deltamodus",from_state_optional:"Van status (optioneel)",to_state_optional:"Naar status (optioneel)",documentation_url_optional:"Documentatie-URL (optioneel)",responsible_user:"Verantwoordelijke gebruiker",no_user_assigned:"(Geen gebruiker toegewezen)",all_users:"Alle gebruikers",my_tasks:"Mijn taken",budget_monthly:"Maandbudget",budget_yearly:"Jaarbudget",export_csv:"CSV-export",import_csv:"CSV-import",groups:"Groepen",no_groups:"Geen groepen gedefinieerd.",group_tasks:"Taken",loading_chart:"Grafiekgegevens laden...",was_maintenance_needed:"Was dit onderhoud nodig?",feedback_needed:"Nodig",feedback_not_needed:"Niet nodig",feedback_not_sure:"Niet zeker",suggested_interval:"Voorgesteld interval",apply_suggestion:"Toepassen",dismiss_suggestion:"Negeren",adaptive_scheduling:"Adaptieve planning",confidence_low:"Laag",confidence_medium:"Gemiddeld",confidence_high:"Hoog",confidence:"Betrouwbaarheid",recommended:"aanbevolen",seasonal_awareness:"Seizoensbewustzijn",seasonal_factor:"Seizoensfactor",seasonal_chart_title:"Seizoensfactoren",seasonal_learned:"Geleerd",seasonal_manual:"Handmatig",seasonal_insufficient_data:"Onvoldoende gegevens",month_jan:"Jan",month_feb:"Feb",month_mar:"Mrt",month_apr:"Apr",month_may:"Mei",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dec",hemisphere_north:"Noordelijk",hemisphere_south:"Zuidelijk",seasonal_factor_short:"Seizoen",sensor_prediction:"Sensorvoorspelling",degradation_trend:"Trend",trend_rising:"Stijgend",trend_falling:"Dalend",trend_stable:"Stabiel",trend_insufficient_data:"Onvoldoende gegevens",days_until_threshold:"Dagen tot drempelwaarde",threshold_exceeded:"Drempelwaarde overschreden",environmental_adjustment:"Omgevingsfactor",sensor_prediction_urgency:"Sensor voorspelt drempelwaarde in ~{days} dagen",day_short:"dag",prediction_projection:"Projectie",weibull_reliability_curve:"Betrouwbaarheidscurve",weibull_failure_probability:"Faalkans",weibull_reliability:"Betrouwbaarheid",weibull_beta_param:"Vorm \u03B2",weibull_eta_param:"Schaal \u03B7",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Vroege uitval",beta_random_failures:"Willekeurige uitval",beta_wear_out:"Slijtage",beta_highly_predictable:"Zeer voorspelbaar",confidence_interval:"Betrouwbaarheidsinterval",confidence_conservative:"Conservatief",confidence_aggressive:"Optimistisch",current_interval_marker:"Huidig interval",recommended_marker:"Aanbevolen",reliability_at_current:"Betrouwbaarheid bij huidig interval",characteristic_life:"Karakteristieke levensduur",chart_mini_sparkline:"Trend-sparkline",chart_history:"Kosten- en duurgeschiedenis",chart_seasonal:"Seizoensfactoren, 12 maanden",chart_weibull:"Weibull-betrouwbaarheidscurve",chart_sparkline:"Sensor-triggerwaardegrafiek",days_progress:"Dagenvoortgang",qr_code:"QR-code",qr_generating:"QR-code genereren\u2026",qr_error:"QR-code kon niet worden gegenereerd.",qr_print:"Afdrukken",qr_download:"SVG downloaden",qr_action:"Actie bij scannen",qr_action_view:"Onderhoudsinfo bekijken",qr_action_complete:"Onderhoud als voltooid markeren",overview:"Overzicht",analysis:"Analyse",recent_activities:"Recente activiteiten",search_notes:"Notities doorzoeken",avg_cost:"\xD8 Kosten",no_advanced_features:"Geen geavanceerde functies ingeschakeld",analysis_not_enough_data:"Nog niet genoeg gegevens voor analyse.",analysis_not_enough_data_hint:"Weibull-analyse vereist minstens 5 voltooide onderhoudsbeurten; seizoenspatronen worden zichtbaar na 6+ datapunten per maand.",analysis_manual_task_hint:"Handmatige taken zonder interval genereren geen analysegegevens.",current:"Huidig",shorter:"Korter",longer:"Langer",normal:"Normaal"},Ge={maintenance:"Maintenance",objects:"Objets",tasks:"T\xE2ches",overdue:"En retard",due_soon:"Bient\xF4t d\xFB",triggered:"D\xE9clench\xE9",ok:"OK",all:"Tous",new_object:"+ Nouvel objet",edit:"Modifier",delete:"Supprimer",add_task:"+ T\xE2che",complete:"Termin\xE9",skip:"Passer",reset:"R\xE9initialiser",cancel:"Annuler",completing:"En cours\u2026",type:"Type",schedule:"Planification",interval:"Intervalle",warning:"Avertissement",last_performed:"Derni\xE8re ex\xE9cution",next_due:"Prochaine \xE9ch\xE9ance",days_until_due:"Jours restants",times_performed:"Nombre d'ex\xE9cutions",total_cost:"Co\xFBt total",avg_duration:"\xD8 Dur\xE9e",trigger:"D\xE9clencheur",entity:"Entit\xE9",attribute:"Attribut",trigger_type:"Type de d\xE9clencheur",active:"Actif",yes:"Oui",no:"Non",current_value:"Valeur actuelle",threshold_above:"Limite sup\xE9rieure",threshold_below:"Limite inf\xE9rieure",threshold:"Seuil",counter:"Compteur",state_change:"Changement d'\xE9tat",target_value:"Valeur cible",baseline:"Ligne de base",target_changes:"Changements cibles",entity_min:"Minimum",entity_max:"Maximum",for_minutes:"Pendant (minutes)",time_based:"Temporel",sensor_based:"Capteur",manual:"Manuel",cleaning:"Nettoyage",inspection:"Inspection",replacement:"Remplacement",calibration:"\xC9talonnage",service:"Service",custom:"Personnalis\xE9",history:"Historique",notes:"Notes",documentation:"Documentation",cost:"Co\xFBt",duration:"Dur\xE9e",both:"Les deux",trigger_val:"Valeur du d\xE9clencheur",complete_title:"Termin\xE9 : ",checklist:"Checklist",notes_optional:"Notes (optionnel)",cost_optional:"Co\xFBt (optionnel)",duration_minutes:"Dur\xE9e en minutes (optionnel)",days:"jours",day:"jour",today:"Aujourd'hui",d_overdue:"j en retard",no_tasks:"Aucune t\xE2che de maintenance. Cr\xE9ez un objet pour commencer.",no_tasks_short:"Aucune t\xE2che",no_history:"Aucun historique.",show_all:"Tout afficher",cost_duration_chart:"Co\xFBts & Dur\xE9e",installed:"Install\xE9",confirm_delete_object:"Supprimer cet objet et toutes ses t\xE2ches ?",confirm_delete_task:"Supprimer cette t\xE2che ?",value_history:"Historique des valeurs",min:"Min",max:"Max",save:"Enregistrer",saving:"Enregistrement\u2026",edit_task:"Modifier la t\xE2che",new_task:"Nouvelle t\xE2che de maintenance",task_name:"Nom de la t\xE2che",maintenance_type:"Type de maintenance",schedule_type:"Type de planification",interval_days:"Intervalle (jours)",warning_days:"Jours d'avertissement",edit_object:"Modifier l'objet",name:"Nom",manufacturer_optional:"Fabricant (optionnel)",model_optional:"Mod\xE8le (optionnel)",trigger_configuration:"Configuration du d\xE9clencheur",entity_id:"ID d'entit\xE9",attribute_optional:"Attribut (optionnel, vide = \xE9tat)",trigger_above:"D\xE9clencher au-dessus de",trigger_below:"D\xE9clencher en dessous de",for_at_least_minutes:"Pendant au moins (minutes)",safety_interval_days:"Intervalle de s\xE9curit\xE9 (jours, optionnel)",delta_mode:"Mode delta",from_state_optional:"\xC9tat source (optionnel)",to_state_optional:"\xC9tat cible (optionnel)",documentation_url_optional:"URL de documentation (optionnel)",responsible_user:"Utilisateur responsable",no_user_assigned:"(Aucun utilisateur assign\xE9)",all_users:"Tous les utilisateurs",my_tasks:"Mes t\xE2ches",budget_monthly:"Budget mensuel",budget_yearly:"Budget annuel",export_csv:"Export CSV",import_csv:"Import CSV",groups:"Groupes",no_groups:"Aucun groupe d\xE9fini.",group_tasks:"T\xE2ches",loading_chart:"Chargement des donn\xE9es...",was_maintenance_needed:"Cette maintenance \xE9tait-elle n\xE9cessaire ?",feedback_needed:"N\xE9cessaire",feedback_not_needed:"Pas n\xE9cessaire",feedback_not_sure:"Pas s\xFBr",suggested_interval:"Intervalle sugg\xE9r\xE9",apply_suggestion:"Appliquer",dismiss_suggestion:"Ignorer",adaptive_scheduling:"Planification adaptative",confidence_low:"Faible",confidence_medium:"Moyen",confidence_high:"\xC9lev\xE9",confidence:"Confiance",recommended:"recommand\xE9",seasonal_awareness:"Conscience saisonni\xE8re",seasonal_factor:"Facteur saisonnier",seasonal_chart_title:"Facteurs saisonniers",seasonal_learned:"Appris",seasonal_manual:"Manuel",seasonal_insufficient_data:"Donn\xE9es insuffisantes",month_jan:"Jan",month_feb:"F\xE9v",month_mar:"Mar",month_apr:"Avr",month_may:"Mai",month_jun:"Juin",month_jul:"Juil",month_aug:"Ao\xFB",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"D\xE9c",hemisphere_north:"Nord",hemisphere_south:"Sud",seasonal_factor_short:"Saison",sensor_prediction:"Pr\xE9diction capteur",degradation_trend:"Tendance",trend_rising:"En hausse",trend_falling:"En baisse",trend_stable:"Stable",trend_insufficient_data:"Donn\xE9es insuffisantes",days_until_threshold:"Jours avant le seuil",threshold_exceeded:"Seuil d\xE9pass\xE9",environmental_adjustment:"Facteur environnemental",sensor_prediction_urgency:"Le capteur pr\xE9voit le seuil dans ~{days} jours",day_short:"jour",prediction_projection:"Projection",weibull_reliability_curve:"Courbe de fiabilit\xE9",weibull_failure_probability:"Probabilit\xE9 de d\xE9faillance",weibull_reliability:"Fiabilit\xE9",weibull_beta_param:"Forme \u03B2",weibull_eta_param:"\xC9chelle \u03B7",weibull_r_squared:"Ajustement R\xB2",beta_early_failures:"D\xE9faillances pr\xE9coces",beta_random_failures:"D\xE9faillances al\xE9atoires",beta_wear_out:"Usure",beta_highly_predictable:"Tr\xE8s pr\xE9visible",confidence_interval:"Intervalle de confiance",confidence_conservative:"Conservateur",confidence_aggressive:"Optimiste",current_interval_marker:"Intervalle actuel",recommended_marker:"Recommand\xE9",reliability_at_current:"Fiabilit\xE9 \xE0 l'intervalle actuel",characteristic_life:"Dur\xE9e de vie caract\xE9ristique",chart_mini_sparkline:"Sparkline de tendance",chart_history:"Historique co\xFBts et dur\xE9e",chart_seasonal:"Facteurs saisonniers, 12 mois",chart_weibull:"Courbe de fiabilit\xE9 Weibull",chart_sparkline:"Graphique valeur d\xE9clencheur",days_progress:"Progression en jours",qr_code:"QR Code",qr_generating:"G\xE9n\xE9ration du QR code\u2026",qr_error:"Impossible de g\xE9n\xE9rer le QR code.",qr_print:"Imprimer",qr_download:"T\xE9l\xE9charger SVG",qr_action:"Action au scan",qr_action_view:"Afficher les infos de maintenance",qr_action_complete:"Marquer la maintenance comme termin\xE9e",overview:"Aper\xE7u",analysis:"Analyse",recent_activities:"Activit\xE9s r\xE9centes",search_notes:"Rechercher dans les notes",avg_cost:"\xD8 Co\xFBt",no_advanced_features:"Aucune fonction avanc\xE9e activ\xE9e",analysis_not_enough_data:"Pas encore assez de donn\xE9es pour l'analyse.",analysis_not_enough_data_hint:"L'analyse Weibull n\xE9cessite au moins 5 maintenances termin\xE9es ; les tendances saisonni\xE8res apparaissent apr\xE8s 6+ points par mois.",analysis_manual_task_hint:"Les t\xE2ches manuelles sans intervalle ne g\xE9n\xE8rent pas de donn\xE9es d'analyse.",current:"Actuel",shorter:"Plus court",longer:"Plus long",normal:"Normal"},Ke={maintenance:"Manutenzione",objects:"Oggetti",tasks:"Attivit\xE0",overdue:"Scaduto",due_soon:"In scadenza",triggered:"Attivato",ok:"OK",all:"Tutti",new_object:"+ Nuovo oggetto",edit:"Modifica",delete:"Elimina",add_task:"+ Attivit\xE0",complete:"Completato",skip:"Salta",reset:"Reimposta",cancel:"Annulla",completing:"Completamento\u2026",type:"Tipo",schedule:"Pianificazione",interval:"Intervallo",warning:"Avviso",last_performed:"Ultima esecuzione",next_due:"Prossima scadenza",days_until_due:"Giorni alla scadenza",times_performed:"Esecuzioni",total_cost:"Costo totale",avg_duration:"\xD8 Durata",trigger:"Trigger",entity:"Entit\xE0",attribute:"Attributo",trigger_type:"Tipo di trigger",active:"Attivo",yes:"S\xEC",no:"No",current_value:"Valore attuale",threshold_above:"Limite superiore",threshold_below:"Limite inferiore",threshold:"Soglia",counter:"Contatore",state_change:"Cambio di stato",target_value:"Valore obiettivo",baseline:"Linea di base",target_changes:"Modifiche obiettivo",entity_min:"Minimo",entity_max:"Massimo",for_minutes:"Per (minuti)",time_based:"Temporale",sensor_based:"Sensore",manual:"Manuale",cleaning:"Pulizia",inspection:"Ispezione",replacement:"Sostituzione",calibration:"Calibrazione",service:"Servizio",custom:"Personalizzato",history:"Cronologia",notes:"Note",documentation:"Documentazione",cost:"Costo",duration:"Durata",both:"Entrambi",trigger_val:"Valore trigger",complete_title:"Completato: ",checklist:"Checklist",notes_optional:"Note (opzionale)",cost_optional:"Costo (opzionale)",duration_minutes:"Durata in minuti (opzionale)",days:"giorni",day:"giorno",today:"Oggi",d_overdue:"g in ritardo",no_tasks:"Nessuna attivit\xE0 di manutenzione. Crea un oggetto per iniziare.",no_tasks_short:"Nessuna attivit\xE0",no_history:"Nessuna voce nella cronologia.",show_all:"Mostra tutto",cost_duration_chart:"Costi & Durata",installed:"Installato",confirm_delete_object:"Eliminare questo oggetto e tutte le sue attivit\xE0?",confirm_delete_task:"Eliminare questa attivit\xE0?",value_history:"Cronologia valori",min:"Min",max:"Max",save:"Salva",saving:"Salvataggio\u2026",edit_task:"Modifica attivit\xE0",new_task:"Nuova attivit\xE0 di manutenzione",task_name:"Nome attivit\xE0",maintenance_type:"Tipo di manutenzione",schedule_type:"Tipo di pianificazione",interval_days:"Intervallo (giorni)",warning_days:"Giorni di avviso",edit_object:"Modifica oggetto",name:"Nome",manufacturer_optional:"Produttore (opzionale)",model_optional:"Modello (opzionale)",trigger_configuration:"Configurazione trigger",entity_id:"ID entit\xE0",attribute_optional:"Attributo (opzionale, vuoto = stato)",trigger_above:"Attivare sopra",trigger_below:"Attivare sotto",for_at_least_minutes:"Per almeno (minuti)",safety_interval_days:"Intervallo di sicurezza (giorni, opzionale)",delta_mode:"Modalit\xE0 delta",from_state_optional:"Dallo stato (opzionale)",to_state_optional:"Allo stato (opzionale)",documentation_url_optional:"URL documentazione (opzionale)",responsible_user:"Utente responsabile",no_user_assigned:"(Nessun utente assegnato)",all_users:"Tutti gli utenti",my_tasks:"Le mie attivit\xE0",budget_monthly:"Budget mensile",budget_yearly:"Budget annuale",export_csv:"Esporta CSV",import_csv:"Importa CSV",groups:"Gruppi",no_groups:"Nessun gruppo definito.",group_tasks:"Attivit\xE0",loading_chart:"Caricamento dati...",was_maintenance_needed:"Questa manutenzione era necessaria?",feedback_needed:"Necessaria",feedback_not_needed:"Non necessaria",feedback_not_sure:"Non sicuro",suggested_interval:"Intervallo suggerito",apply_suggestion:"Applica",dismiss_suggestion:"Ignora",adaptive_scheduling:"Pianificazione adattiva",confidence_low:"Bassa",confidence_medium:"Media",confidence_high:"Alta",confidence:"Affidabilit\xE0",recommended:"consigliato",seasonal_awareness:"Consapevolezza stagionale",seasonal_factor:"Fattore stagionale",seasonal_chart_title:"Fattori stagionali",seasonal_learned:"Appreso",seasonal_manual:"Manuale",seasonal_insufficient_data:"Dati insufficienti",month_jan:"Gen",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"Mag",month_jun:"Giu",month_jul:"Lug",month_aug:"Ago",month_sep:"Set",month_oct:"Ott",month_nov:"Nov",month_dec:"Dic",hemisphere_north:"Nord",hemisphere_south:"Sud",seasonal_factor_short:"Stagione",sensor_prediction:"Previsione sensore",degradation_trend:"Tendenza",trend_rising:"In aumento",trend_falling:"In calo",trend_stable:"Stabile",trend_insufficient_data:"Dati insufficienti",days_until_threshold:"Giorni alla soglia",threshold_exceeded:"Soglia superata",environmental_adjustment:"Fattore ambientale",sensor_prediction_urgency:"Il sensore prevede la soglia tra ~{days} giorni",day_short:"giorno",prediction_projection:"Proiezione",weibull_reliability_curve:"Curva di affidabilit\xE0",weibull_failure_probability:"Probabilit\xE0 di guasto",weibull_reliability:"Affidabilit\xE0",weibull_beta_param:"Forma \u03B2",weibull_eta_param:"Scala \u03B7",weibull_r_squared:"Adattamento R\xB2",beta_early_failures:"Guasti precoci",beta_random_failures:"Guasti casuali",beta_wear_out:"Usura",beta_highly_predictable:"Altamente prevedibile",confidence_interval:"Intervallo di confidenza",confidence_conservative:"Conservativo",confidence_aggressive:"Ottimistico",current_interval_marker:"Intervallo attuale",recommended_marker:"Consigliato",reliability_at_current:"Affidabilit\xE0 all'intervallo attuale",characteristic_life:"Vita caratteristica",chart_mini_sparkline:"Sparkline di tendenza",chart_history:"Cronologia costi e durata",chart_seasonal:"Fattori stagionali, 12 mesi",chart_weibull:"Curva di affidabilit\xE0 Weibull",chart_sparkline:"Grafico valore trigger sensore",days_progress:"Avanzamento giorni",qr_code:"Codice QR",qr_generating:"Generazione codice QR\u2026",qr_error:"Impossibile generare il codice QR.",qr_print:"Stampa",qr_download:"Scarica SVG",qr_action:"Azione alla scansione",qr_action_view:"Visualizza info manutenzione",qr_action_complete:"Segna manutenzione come completata",overview:"Panoramica",analysis:"Analisi",recent_activities:"Attivit\xE0 recenti",search_notes:"Cerca nelle note",avg_cost:"\xD8 Costo",no_advanced_features:"Nessuna funzione avanzata attivata",analysis_not_enough_data:"Non ci sono ancora abbastanza dati per l'analisi.",analysis_not_enough_data_hint:"L'analisi Weibull richiede almeno 5 manutenzioni completate; i modelli stagionali diventano visibili dopo 6+ punti dati al mese.",analysis_manual_task_hint:"Le attivit\xE0 manuali senza intervallo non generano dati di analisi.",current:"Attuale",shorter:"Pi\xF9 breve",longer:"Pi\xF9 lungo",normal:"Normale"},Je={maintenance:"Mantenimiento",objects:"Objetos",tasks:"Tareas",overdue:"Vencida",due_soon:"Pr\xF3xima",triggered:"Activada",ok:"OK",all:"Todos",new_object:"+ Nuevo objeto",edit:"Editar",delete:"Eliminar",add_task:"+ Tarea",complete:"Completada",skip:"Omitir",reset:"Restablecer",cancel:"Cancelar",completing:"Completando\u2026",type:"Tipo",schedule:"Planificaci\xF3n",interval:"Intervalo",warning:"Aviso",last_performed:"\xDAltima ejecuci\xF3n",next_due:"Pr\xF3ximo vencimiento",days_until_due:"D\xEDas hasta vencimiento",times_performed:"Ejecuciones",total_cost:"Coste total",avg_duration:"\xD8 Duraci\xF3n",trigger:"Disparador",entity:"Entidad",attribute:"Atributo",trigger_type:"Tipo de disparador",active:"Activo",yes:"S\xED",no:"No",current_value:"Valor actual",threshold_above:"L\xEDmite superior",threshold_below:"L\xEDmite inferior",threshold:"Umbral",counter:"Contador",state_change:"Cambio de estado",target_value:"Valor objetivo",baseline:"L\xEDnea base",target_changes:"Cambios objetivo",entity_min:"M\xEDnimo",entity_max:"M\xE1ximo",for_minutes:"Durante (minutos)",time_based:"Temporal",sensor_based:"Sensor",manual:"Manual",cleaning:"Limpieza",inspection:"Inspecci\xF3n",replacement:"Sustituci\xF3n",calibration:"Calibraci\xF3n",service:"Servicio",custom:"Personalizado",history:"Historial",notes:"Notas",documentation:"Documentaci\xF3n",cost:"Coste",duration:"Duraci\xF3n",both:"Ambos",trigger_val:"Valor del disparador",complete_title:"Completada: ",checklist:"Lista de verificaci\xF3n",notes_optional:"Notas (opcional)",cost_optional:"Coste (opcional)",duration_minutes:"Duraci\xF3n en minutos (opcional)",days:"d\xEDas",day:"d\xEDa",today:"Hoy",d_overdue:"d vencida",no_tasks:"No hay tareas de mantenimiento. Cree un objeto para empezar.",no_tasks_short:"Sin tareas",no_history:"Sin entradas en el historial.",show_all:"Mostrar todo",cost_duration_chart:"Costes & Duraci\xF3n",installed:"Instalado",confirm_delete_object:"\xBFEliminar este objeto y todas sus tareas?",confirm_delete_task:"\xBFEliminar esta tarea?",value_history:"Historial de valores",min:"M\xEDn",max:"M\xE1x",save:"Guardar",saving:"Guardando\u2026",edit_task:"Editar tarea",new_task:"Nueva tarea de mantenimiento",task_name:"Nombre de la tarea",maintenance_type:"Tipo de mantenimiento",schedule_type:"Tipo de planificaci\xF3n",interval_days:"Intervalo (d\xEDas)",warning_days:"D\xEDas de aviso",edit_object:"Editar objeto",name:"Nombre",manufacturer_optional:"Fabricante (opcional)",model_optional:"Modelo (opcional)",trigger_configuration:"Configuraci\xF3n del disparador",entity_id:"ID de entidad",attribute_optional:"Atributo (opcional, vac\xEDo = estado)",trigger_above:"Activar por encima de",trigger_below:"Activar por debajo de",for_at_least_minutes:"Durante al menos (minutos)",safety_interval_days:"Intervalo de seguridad (d\xEDas, opcional)",delta_mode:"Modo delta",from_state_optional:"Desde estado (opcional)",to_state_optional:"Hasta estado (opcional)",documentation_url_optional:"URL de documentaci\xF3n (opcional)",responsible_user:"Usuario responsable",no_user_assigned:"(Ning\xFAn usuario asignado)",all_users:"Todos los usuarios",my_tasks:"Mis tareas",budget_monthly:"Presupuesto mensual",budget_yearly:"Presupuesto anual",export_csv:"Exportar CSV",import_csv:"Importar CSV",groups:"Grupos",no_groups:"No hay grupos definidos.",group_tasks:"Tareas",loading_chart:"Cargando datos...",was_maintenance_needed:"\xBFEra necesario este mantenimiento?",feedback_needed:"Necesario",feedback_not_needed:"No necesario",feedback_not_sure:"No seguro",suggested_interval:"Intervalo sugerido",apply_suggestion:"Aplicar",dismiss_suggestion:"Descartar",adaptive_scheduling:"Planificaci\xF3n adaptativa",confidence_low:"Baja",confidence_medium:"Media",confidence_high:"Alta",confidence:"Confianza",recommended:"recomendado",seasonal_awareness:"Conciencia estacional",seasonal_factor:"Factor estacional",seasonal_chart_title:"Factores estacionales",seasonal_learned:"Aprendido",seasonal_manual:"Manual",seasonal_insufficient_data:"Datos insuficientes",month_jan:"Ene",month_feb:"Feb",month_mar:"Mar",month_apr:"Abr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Ago",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dic",hemisphere_north:"Norte",hemisphere_south:"Sur",seasonal_factor_short:"Estaci\xF3n",sensor_prediction:"Predicci\xF3n del sensor",degradation_trend:"Tendencia",trend_rising:"En aumento",trend_falling:"En descenso",trend_stable:"Estable",trend_insufficient_data:"Datos insuficientes",days_until_threshold:"D\xEDas hasta el umbral",threshold_exceeded:"Umbral superado",environmental_adjustment:"Factor ambiental",sensor_prediction_urgency:"El sensor predice el umbral en ~{days} d\xEDas",day_short:"d\xEDa",prediction_projection:"Proyecci\xF3n",weibull_reliability_curve:"Curva de fiabilidad",weibull_failure_probability:"Probabilidad de fallo",weibull_reliability:"Fiabilidad",weibull_beta_param:"Forma \u03B2",weibull_eta_param:"Escala \u03B7",weibull_r_squared:"Ajuste R\xB2",beta_early_failures:"Fallos tempranos",beta_random_failures:"Fallos aleatorios",beta_wear_out:"Desgaste",beta_highly_predictable:"Altamente predecible",confidence_interval:"Intervalo de confianza",confidence_conservative:"Conservador",confidence_aggressive:"Optimista",current_interval_marker:"Intervalo actual",recommended_marker:"Recomendado",reliability_at_current:"Fiabilidad en el intervalo actual",characteristic_life:"Vida caracter\xEDstica",chart_mini_sparkline:"Sparkline de tendencia",chart_history:"Historial de costes y duraci\xF3n",chart_seasonal:"Factores estacionales, 12 meses",chart_weibull:"Curva de fiabilidad Weibull",chart_sparkline:"Gr\xE1fico de valor del disparador",days_progress:"Progreso en d\xEDas",qr_code:"C\xF3digo QR",qr_generating:"Generando c\xF3digo QR\u2026",qr_error:"No se pudo generar el c\xF3digo QR.",qr_print:"Imprimir",qr_download:"Descargar SVG",qr_action:"Acci\xF3n al escanear",qr_action_view:"Ver info de mantenimiento",qr_action_complete:"Marcar mantenimiento como completado",overview:"Resumen",analysis:"An\xE1lisis",recent_activities:"Actividades recientes",search_notes:"Buscar en notas",avg_cost:"\xD8 Coste",no_advanced_features:"Sin funciones avanzadas activadas",analysis_not_enough_data:"A\xFAn no hay suficientes datos para el an\xE1lisis.",analysis_not_enough_data_hint:"El an\xE1lisis Weibull requiere al menos 5 mantenimientos completados; los patrones estacionales son visibles tras 6+ puntos de datos por mes.",analysis_manual_task_hint:"Las tareas manuales sin intervalo no generan datos de an\xE1lisis.",current:"Actual",shorter:"M\xE1s corto",longer:"M\xE1s largo",normal:"Normal"},Ee={de:Be,en:Ve,nl:We,fr:Ge,it:Ke,es:Je};function h(n,e){let t=(e||"en").substring(0,2).toLowerCase();return Ee[t]?.[n]??Ee.en[n]??n}var $e=k`
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
`;var j=class extends y{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"}}setConfig(t){this._config={...t}}_valueChanged(t,a){let i={...this._config,[t]:a};this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i}}))}render(){return _`
      <div class="editor">
        <ha-textfield
          label="Title"
          .value=${this._config.title||""}
          @input=${t=>this._valueChanged("title",t.target.value)}
        ></ha-textfield>

        <ha-formfield label="Show header with statistics">
          <ha-switch
            .checked=${this._config.show_header!==!1}
            @change=${t=>this._valueChanged("show_header",t.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Show action buttons">
          <ha-switch
            .checked=${this._config.show_actions!==!1}
            @change=${t=>this._valueChanged("show_actions",t.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="Compact mode">
          <ha-switch
            .checked=${this._config.compact||!1}
            @change=${t=>this._valueChanged("compact",t.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-textfield
          label="Max items (0 = all)"
          type="number"
          .value=${String(this._config.max_items||0)}
          @input=${t=>this._valueChanged("max_items",parseInt(t.target.value,10)||0)}
        ></ha-textfield>
      </div>
    `}};j.styles=k`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }
    ha-textfield {
      display: block;
    }
  `,u([v({attribute:!1})],j.prototype,"hass",2),u([b()],j.prototype,"_config",2),j=u([J("maintenance-supporter-card-editor")],j);var m=class extends y{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="de";this.checklist=[];this.adaptiveEnabled=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._checklistState={};this._feedback="needed"}open(){this._open=!0,this._notes="",this._cost="",this._duration="",this._checklistState={},this._feedback="needed"}_toggleCheck(t){let a=String(t);this._checklistState={...this._checklistState,[a]:!this._checklistState[a]}}_setFeedback(t){this._feedback=t}async _complete(){this._loading=!0;try{let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};this._notes&&(t.notes=this._notes),this._cost&&(t.cost=parseFloat(this._cost)),this._duration&&(t.duration=parseInt(this._duration,10)),this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),await this.hass.connection.sendMessagePromise(t),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return _``;let t=this.lang||this.hass?.language||"de";return _`
      <ha-dialog
        open
        @closed=${this._close}
        .heading=${h("complete_title",t)+this.taskName}
      >
        <div class="content">
          ${this.checklist.length>0?_`
            <div class="checklist-section">
              <label class="checklist-label">${h("checklist",t)}</label>
              ${this.checklist.map((a,i)=>_`
                <label class="checklist-item" @click=${()=>this._toggleCheck(i)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(i)]} />
                  <span>${a}</span>
                </label>
              `)}
            </div>
          `:d}
          <ha-textfield
            label="${h("notes_optional",t)}"
            .value=${this._notes}
            @input=${a=>this._notes=a.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${h("cost_optional",t)}"
            type="number"
            step="0.01"
            .value=${this._cost}
            @input=${a=>this._cost=a.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${h("duration_minutes",t)}"
            type="number"
            .value=${this._duration}
            @input=${a=>this._duration=a.target.value}
          ></ha-textfield>
          ${this.adaptiveEnabled?_`
            <div class="feedback-section">
              <label class="feedback-label">${h("was_maintenance_needed",t)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${h("feedback_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${h("feedback_not_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${h("feedback_not_sure",t)}</button>
              </div>
            </div>
          `:d}
        </div>
        <ha-button slot="secondaryAction" appearance="plain" @click=${this._close}>
          ${h("cancel",t)}
        </ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._complete}
          .disabled=${this._loading}
        >
          ${this._loading?h("completing",t):h("complete",t)}
        </ha-button>
      </ha-dialog>
    `}};m.styles=k`
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
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
  `,u([v({attribute:!1})],m.prototype,"hass",2),u([v()],m.prototype,"entryId",2),u([v()],m.prototype,"taskId",2),u([v()],m.prototype,"taskName",2),u([v()],m.prototype,"lang",2),u([v({type:Array})],m.prototype,"checklist",2),u([v({type:Boolean})],m.prototype,"adaptiveEnabled",2),u([b()],m.prototype,"_open",2),u([b()],m.prototype,"_notes",2),u([b()],m.prototype,"_cost",2),u([b()],m.prototype,"_duration",2),u([b()],m.prototype,"_loading",2),u([b()],m.prototype,"_checklistState",2),u([b()],m.prototype,"_feedback",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",m);var x=class extends y{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._stats=null;this._unsub=null;this._onCompleted=async()=>{await this._loadData()}}get _lang(){return this.hass?.language||"de"}static getConfigElement(){return document.createElement("maintenance-supporter-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-card",show_header:!0,show_actions:!0}}setConfig(t){this._config=t}getCardSize(){return 3}connectedCallback(){super.connectedCallback(),this._loadData(),this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub&&(this._unsub(),this._unsub=null)}async _loadData(){try{let[t,a]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=t.objects,this._stats=a}catch{}}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(t=>{let a=t;this._objects=a.objects},{type:"maintenance_supporter/subscribe"})}catch{}}get _flatTasks(){let t=[],{filter_status:a,filter_objects:i,max_items:o}=this._config;for(let l of this._objects)if(!(i?.length&&!i.includes(l.object.name)))for(let s of l.tasks)a?.length&&!a.includes(s.status)||t.push({entry_id:l.entry_id,object_name:l.object.name,task:s});let r={overdue:0,triggered:1,due_soon:2,ok:3};return t.sort((l,s)=>(r[l.task.status]??9)-(r[s.task.status]??9)),o&&o>0?t.slice(0,o):t}render(){let t=this._lang,a=this._config.title||h("maintenance",t),i=this._config.show_header!==!1,o=this._config.show_actions!==!1,r=this._config.compact||!1,l=this._flatTasks,s=this._stats;return _`
      <ha-card>
        <div class="card-header">
          <h1>${a}</h1>
          ${i&&s?_`
                <div class="header-stats">
                  ${s.overdue>0?_`<span class="badge overdue">${s.overdue}</span>`:d}
                  ${s.due_soon>0?_`<span class="badge due_soon">${s.due_soon}</span>`:d}
                  ${s.triggered>0?_`<span class="badge triggered">${s.triggered}</span>`:d}
                </div>
              `:d}
        </div>
        ${l.length===0?_`<div class="empty-card">${h("no_tasks_short",t)}</div>`:_`
              <div class="task-list ${r?"compact":""}">
                ${l.map(({entry_id:p,object_name:g,task:c})=>_`
                    <div class="task-item">
                      <div class="status-dot" style="background: ${Ae[c.status]||"#ccc"}"></div>
                      <div class="task-info">
                        <div class="task-name">${c.name}</div>
                        ${r?d:_`<div class="task-meta">${g} · ${h(c.type,t)}</div>`}
                      </div>
                      <div class="task-due">
                        ${c.days_until_due!==null&&c.days_until_due!==void 0?c.days_until_due<0?_`<span class="overdue-text">${Math.abs(c.days_until_due)}${t.startsWith("de")?"T":"d"}</span>`:c.days_until_due===0?h("today",t):`${c.days_until_due}${t.startsWith("de")?"T":"d"}`:c.trigger_active?"\u26A1":"\u2014"}
                      </div>
                      ${o?_`
                            <mwc-icon-button
                              class="complete-btn"
                              title="${h("complete",t)}"
                              @click=${()=>{let f=this.shadowRoot.querySelector("maintenance-complete-dialog");f.entryId=p,f.taskId=c.id,f.taskName=c.name,f.lang=t,f.open()}}
                            >
                              <ha-icon icon="mdi:check"></ha-icon>
                            </mwc-icon-button>
                          `:d}
                    </div>
                  `)}
              </div>
            `}
      </ha-card>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onCompleted}
      ></maintenance-complete-dialog>
    `}};x.styles=[$e,k`
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
    `],u([v({attribute:!1})],x.prototype,"hass",2),u([b()],x.prototype,"_config",2),u([b()],x.prototype,"_objects",2),u([b()],x.prototype,"_stats",2),u([b()],x.prototype,"_unsub",2),x=u([J("maintenance-supporter-card")],x);window.customCards=window.customCards||[];window.customCards.push({type:"maintenance-supporter-card",name:"Maintenance Supporter",description:"Overview of your maintenance tasks with quick actions.",preview:!0});export{x as MaintenanceSupporterCard};
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
