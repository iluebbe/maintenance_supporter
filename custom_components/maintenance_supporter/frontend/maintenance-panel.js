var Dt=Object.defineProperty;var Lt=Object.getOwnPropertyDescriptor;var u=(r,a,e,t)=>{for(var i=t>1?void 0:t?Lt(a,e):a,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(t?o(a,e,i):o(i))||i);return t&&i&&Dt(a,e,i),i};var me=globalThis,ve=me.ShadowRoot&&(me.ShadyCSS===void 0||me.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Te=Symbol(),Be=new WeakMap,le=class{constructor(a,e,t){if(this._$cssResult$=!0,t!==Te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=a,this.t=e}get styleSheet(){let a=this.o,e=this.t;if(ve&&a===void 0){let t=e!==void 0&&e.length===1;t&&(a=Be.get(e)),a===void 0&&((this.o=a=new CSSStyleSheet).replaceSync(this.cssText),t&&Be.set(e,a))}return a}toString(){return this.cssText}},Ve=r=>new le(typeof r=="string"?r:r+"",void 0,Te),N=(r,...a)=>{let e=r.length===1?r[0]:a.reduce((t,i,n)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new le(e,r,Te)},We=(r,a)=>{if(ve)r.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of a){let t=document.createElement("style"),i=me.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,r.appendChild(t)}},Me=ve?r=>r:r=>r instanceof CSSStyleSheet?(a=>{let e="";for(let t of a.cssRules)e+=t.cssText;return Ve(e)})(r):r;var{is:Ft,defineProperty:jt,getOwnPropertyDescriptor:Rt,getOwnPropertyNames:Pt,getOwnPropertySymbols:Nt,getPrototypeOf:Ht}=Object,fe=globalThis,Ge=fe.trustedTypes,qt=Ge?Ge.emptyScript:"",Ot=fe.reactiveElementPolyfillSupport,ce=(r,a)=>r,de={toAttribute(r,a){switch(a){case Boolean:r=r?qt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,a){let e=r;switch(a){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},be=(r,a)=>!Ft(r,a),Ke={attribute:!0,type:String,converter:de,reflect:!1,useDefault:!1,hasChanged:be};Symbol.metadata??=Symbol("metadata"),fe.litPropertyMetadata??=new WeakMap;var K=class extends HTMLElement{static addInitializer(a){this._$Ei(),(this.l??=[]).push(a)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(a,e=Ke){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(a)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(a,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(a,t,e);i!==void 0&&jt(this.prototype,a,i)}}static getPropertyDescriptor(a,e,t){let{get:i,set:n}=Rt(this.prototype,a)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let d=i?.call(this);n?.call(this,o),this.requestUpdate(a,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(a){return this.elementProperties.get(a)??Ke}static _$Ei(){if(this.hasOwnProperty(ce("elementProperties")))return;let a=Ht(this);a.finalize(),a.l!==void 0&&(this.l=[...a.l]),this.elementProperties=new Map(a.elementProperties)}static finalize(){if(this.hasOwnProperty(ce("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ce("properties"))){let e=this.properties,t=[...Pt(e),...Nt(e)];for(let i of t)this.createProperty(i,e[i])}let a=this[Symbol.metadata];if(a!==null){let e=litPropertyMetadata.get(a);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(a){let e=[];if(Array.isArray(a)){let t=new Set(a.flat(1/0).reverse());for(let i of t)e.unshift(Me(i))}else a!==void 0&&e.push(Me(a));return e}static _$Eu(a,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof a=="string"?a.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(a=>this.enableUpdating=a),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(a=>a(this))}addController(a){(this._$EO??=new Set).add(a),this.renderRoot!==void 0&&this.isConnected&&a.hostConnected?.()}removeController(a){this._$EO?.delete(a)}_$E_(){let a=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(a.set(t,this[t]),delete this[t]);a.size>0&&(this._$Ep=a)}createRenderRoot(){let a=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return We(a,this.constructor.elementStyles),a}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(a=>a.hostConnected?.())}enableUpdating(a){}disconnectedCallback(){this._$EO?.forEach(a=>a.hostDisconnected?.())}attributeChangedCallback(a,e,t){this._$AK(a,t)}_$ET(a,e){let t=this.constructor.elementProperties.get(a),i=this.constructor._$Eu(a,t);if(i!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:de).toAttribute(e,t.type);this._$Em=a,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(a,e){let t=this.constructor,i=t._$Eh.get(a);if(i!==void 0&&this._$Em!==i){let n=t.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:de;this._$Em=i;let d=o.fromAttribute(e,n.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(a,e,t,i=!1,n){if(a!==void 0){let o=this.constructor;if(i===!1&&(n=this[a]),t??=o.getPropertyOptions(a),!((t.hasChanged??be)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(a)&&!this.hasAttribute(o._$Eu(a,t))))return;this.C(a,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(a,e,{useDefault:t,reflect:i,wrapped:n},o){t&&!(this._$Ej??=new Map).has(a)&&(this._$Ej.set(a,o??e??this[a]),n!==!0||o!==void 0)||(this._$AL.has(a)||(this.hasUpdated||t||(e=void 0),this._$AL.set(a,e)),i===!0&&this._$Em!==a&&(this._$Eq??=new Set).add(a))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let a=this.scheduleUpdate();return a!=null&&await a,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,n]of t){let{wrapped:o}=n,d=this[i];o!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,n,d)}}let a=!1,e=this._$AL;try{a=this.shouldUpdate(e),a?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw a=!1,this._$EM(),t}a&&this._$AE(e)}willUpdate(a){}_$AE(a){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(a)),this.updated(a)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(a){return!0}update(a){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(a){}firstUpdated(a){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[ce("elementProperties")]=new Map,K[ce("finalized")]=new Map,Ot?.({ReactiveElement:K}),(fe.reactiveElementVersions??=[]).push("2.1.2");var je=globalThis,Je=r=>r,ye=je.trustedTypes,Ze=ye?ye.createPolicy("lit-html",{createHTML:r=>r}):void 0,it="$lit$",Y=`lit$${Math.random().toFixed(9).slice(2)}$`,at="?"+Y,Ut=`<${at}>`,te=document,pe=()=>te.createComment(""),_e=r=>r===null||typeof r!="object"&&typeof r!="function",Re=Array.isArray,Bt=r=>Re(r)||typeof r?.[Symbol.iterator]=="function",Ce=`[ 	
\f\r]`,ue=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ye=/-->/g,Qe=/>/g,X=RegExp(`>|${Ce}(?:([^\\s"'>=/]+)(${Ce}*=${Ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xe=/'/g,et=/"/g,nt=/^(?:script|style|textarea|title)$/i,Pe=r=>(a,...e)=>({_$litType$:r,strings:a,values:e}),l=Pe(1),D=Pe(2),Ai=Pe(3),ie=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),tt=new WeakMap,ee=te.createTreeWalker(te,129);function st(r,a){if(!Re(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ze!==void 0?Ze.createHTML(a):a}var Vt=(r,a)=>{let e=r.length-1,t=[],i,n=a===2?"<svg>":a===3?"<math>":"",o=ue;for(let d=0;d<e;d++){let p=r[d],g,m,v=-1,b=0;for(;b<p.length&&(o.lastIndex=b,m=o.exec(p),m!==null);)b=o.lastIndex,o===ue?m[1]==="!--"?o=Ye:m[1]!==void 0?o=Qe:m[2]!==void 0?(nt.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=X):m[3]!==void 0&&(o=X):o===X?m[0]===">"?(o=i??ue,v=-1):m[1]===void 0?v=-2:(v=o.lastIndex-m[2].length,g=m[1],o=m[3]===void 0?X:m[3]==='"'?et:Xe):o===et||o===Xe?o=X:o===Ye||o===Qe?o=ue:(o=X,i=void 0);let f=o===X&&r[d+1].startsWith("/>")?" ":"";n+=o===ue?p+Ut:v>=0?(t.push(g),p.slice(0,v)+it+p.slice(v)+Y+f):p+Y+(v===-2?d:f)}return[st(r,n+(r[e]||"<?>")+(a===2?"</svg>":a===3?"</math>":"")),t]},ge=class r{constructor({strings:a,_$litType$:e},t){let i;this.parts=[];let n=0,o=0,d=a.length-1,p=this.parts,[g,m]=Vt(a,e);if(this.el=r.createElement(g,t),ee.currentNode=this.el.content,e===2||e===3){let v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(i=ee.nextNode())!==null&&p.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let v of i.getAttributeNames())if(v.endsWith(it)){let b=m[o++],f=i.getAttribute(v).split(Y),w=/([.?@])?(.*)/.exec(b);p.push({type:1,index:n,name:w[2],strings:f,ctor:w[1]==="."?Ie:w[1]==="?"?De:w[1]==="@"?Le:se}),i.removeAttribute(v)}else v.startsWith(Y)&&(p.push({type:6,index:n}),i.removeAttribute(v));if(nt.test(i.tagName)){let v=i.textContent.split(Y),b=v.length-1;if(b>0){i.textContent=ye?ye.emptyScript:"";for(let f=0;f<b;f++)i.append(v[f],pe()),ee.nextNode(),p.push({type:2,index:++n});i.append(v[b],pe())}}}else if(i.nodeType===8)if(i.data===at)p.push({type:2,index:n});else{let v=-1;for(;(v=i.data.indexOf(Y,v+1))!==-1;)p.push({type:7,index:n}),v+=Y.length-1}n++}}static createElement(a,e){let t=te.createElement("template");return t.innerHTML=a,t}};function ne(r,a,e=r,t){if(a===ie)return a;let i=t!==void 0?e._$Co?.[t]:e._$Cl,n=_e(a)?void 0:a._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(a=ne(r,i._$AS(r,a.values),i,t)),a}var ze=class{constructor(a,e){this._$AV=[],this._$AN=void 0,this._$AD=a,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(a){let{el:{content:e},parts:t}=this._$AD,i=(a?.creationScope??te).importNode(e,!0);ee.currentNode=i;let n=ee.nextNode(),o=0,d=0,p=t[0];for(;p!==void 0;){if(o===p.index){let g;p.type===2?g=new he(n,n.nextSibling,this,a):p.type===1?g=new p.ctor(n,p.name,p.strings,this,a):p.type===6&&(g=new Fe(n,this,a)),this._$AV.push(g),p=t[++d]}o!==p?.index&&(n=ee.nextNode(),o++)}return ee.currentNode=te,i}p(a){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(a,t,e),e+=t.strings.length-2):t._$AI(a[e])),e++}},he=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(a,e,t,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=a,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let a=this._$AA.parentNode,e=this._$AM;return e!==void 0&&a?.nodeType===11&&(a=e.parentNode),a}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(a,e=this){a=ne(this,a,e),_e(a)?a===c||a==null||a===""?(this._$AH!==c&&this._$AR(),this._$AH=c):a!==this._$AH&&a!==ie&&this._(a):a._$litType$!==void 0?this.$(a):a.nodeType!==void 0?this.T(a):Bt(a)?this.k(a):this._(a)}O(a){return this._$AA.parentNode.insertBefore(a,this._$AB)}T(a){this._$AH!==a&&(this._$AR(),this._$AH=this.O(a))}_(a){this._$AH!==c&&_e(this._$AH)?this._$AA.nextSibling.data=a:this.T(te.createTextNode(a)),this._$AH=a}$(a){let{values:e,_$litType$:t}=a,i=typeof t=="number"?this._$AC(a):(t.el===void 0&&(t.el=ge.createElement(st(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new ze(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(a){let e=tt.get(a.strings);return e===void 0&&tt.set(a.strings,e=new ge(a)),e}k(a){Re(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let n of a)i===e.length?e.push(t=new r(this.O(pe()),this.O(pe()),this,this.options)):t=e[i],t._$AI(n),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(a=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);a!==this._$AB;){let t=Je(a).nextSibling;Je(a).remove(),a=t}}setConnected(a){this._$AM===void 0&&(this._$Cv=a,this._$AP?.(a))}},se=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(a,e,t,i,n){this.type=1,this._$AH=c,this._$AN=void 0,this.element=a,this.name=e,this._$AM=i,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=c}_$AI(a,e=this,t,i){let n=this.strings,o=!1;if(n===void 0)a=ne(this,a,e,0),o=!_e(a)||a!==this._$AH&&a!==ie,o&&(this._$AH=a);else{let d=a,p,g;for(a=n[0],p=0;p<n.length-1;p++)g=ne(this,d[t+p],e,p),g===ie&&(g=this._$AH[p]),o||=!_e(g)||g!==this._$AH[p],g===c?a=c:a!==c&&(a+=(g??"")+n[p+1]),this._$AH[p]=g}o&&!i&&this.j(a)}j(a){a===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,a??"")}},Ie=class extends se{constructor(){super(...arguments),this.type=3}j(a){this.element[this.name]=a===c?void 0:a}},De=class extends se{constructor(){super(...arguments),this.type=4}j(a){this.element.toggleAttribute(this.name,!!a&&a!==c)}},Le=class extends se{constructor(a,e,t,i,n){super(a,e,t,i,n),this.type=5}_$AI(a,e=this){if((a=ne(this,a,e,0)??c)===ie)return;let t=this._$AH,i=a===c&&t!==c||a.capture!==t.capture||a.once!==t.once||a.passive!==t.passive,n=a!==c&&(t===c||i);i&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,a),this._$AH=a}handleEvent(a){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,a):this._$AH.handleEvent(a)}},Fe=class{constructor(a,e,t){this.element=a,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(a){ne(this,a)}};var Wt=je.litHtmlPolyfillSupport;Wt?.(ge,he),(je.litHtmlVersions??=[]).push("3.3.2");var rt=(r,a,e)=>{let t=e?.renderBefore??a,i=t._$litPart$;if(i===void 0){let n=e?.renderBefore??null;t._$litPart$=i=new he(a.insertBefore(pe(),n),n,void 0,e??{})}return i._$AI(r),i};var Ne=globalThis,F=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let a=super.createRenderRoot();return this.renderOptions.renderBefore??=a.firstChild,a}update(a){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(a),this._$Do=rt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ie}};F._$litElement$=!0,F.finalized=!0,Ne.litElementHydrateSupport?.({LitElement:F});var Gt=Ne.litElementPolyfillSupport;Gt?.({LitElement:F});(Ne.litElementVersions??=[]).push("4.2.2");var ot=r=>(a,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,a)}):customElements.define(r,a)};var Kt={attribute:!0,type:String,converter:de,reflect:!1,hasChanged:be},Jt=(r=Kt,a,e)=>{let{kind:t,metadata:i}=e,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),t==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),t==="accessor"){let{name:o}=e;return{set(d){let p=a.get.call(this);a.set.call(this,d),this.requestUpdate(o,p,r,!0,d)},init(d){return d!==void 0&&this.C(o,void 0,r,d),d}}}if(t==="setter"){let{name:o}=e;return function(d){let p=this[o];a.call(this,d),this.requestUpdate(o,p,r,!0,d)}}throw Error("Unsupported decorator location: "+t)};function S(r){return(a,e)=>typeof e=="object"?Jt(r,a,e):((t,i,n)=>{let o=i.hasOwnProperty(n);return i.constructor.createProperty(n,t),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,a,e)}function _(r){return S({...r,state:!0,attribute:!1})}var $e={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"#ff5722"},ct={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",completed:"mdi:check-circle",skipped:"mdi:skip-next",reset:"mdi:refresh"};var Zt={maintenance:"Wartung",objects:"Objekte",tasks:"Aufgaben",overdue:"\xDCberf\xE4llig",due_soon:"Bald f\xE4llig",triggered:"Ausgel\xF6st",ok:"OK",all:"Alle",new_object:"+ Neues Objekt",edit:"Bearbeiten",delete:"L\xF6schen",add_task:"+ Aufgabe",complete:"Erledigt",completed:"Abgeschlossen",skip:"\xDCberspringen",skipped:"\xDCbersprungen",reset:"Zur\xFCcksetzen",cancel:"Abbrechen",completing:"Wird erledigt\u2026",interval:"Intervall",warning:"Vorwarnung",last_performed:"Zuletzt durchgef\xFChrt",next_due:"N\xE4chste F\xE4lligkeit",days_until_due:"Tage bis f\xE4llig",avg_duration:"\xD8 Dauer",trigger:"Trigger",trigger_type:"Trigger-Typ",threshold_above:"Obergrenze",threshold_below:"Untergrenze",threshold:"Schwellwert",counter:"Z\xE4hler",state_change:"Zustands\xE4nderung",runtime:"Laufzeit",runtime_hours:"Ziel-Laufzeit (Stunden)",target_value:"Zielwert",baseline:"Nulllinie",target_changes:"Ziel-\xC4nderungen",for_minutes:"F\xFCr (Minuten)",time_based:"Zeitbasiert",sensor_based:"Sensorbasiert",manual:"Manuell",cleaning:"Reinigung",inspection:"Inspektion",replacement:"Austausch",calibration:"Kalibrierung",service:"Service",custom:"Benutzerdefiniert",history:"Verlauf",cost:"Kosten",duration:"Dauer",both:"Beides",trigger_val:"Trigger-Wert",complete_title:"Erledigt: ",checklist:"Checkliste",notes_optional:"Notizen (optional)",cost_optional:"Kosten (optional)",duration_minutes:"Dauer in Minuten (optional)",days:"Tage",day:"Tag",today:"Heute",d_overdue:"T \xFCberf\xE4llig",no_tasks:"Keine Wartungsaufgaben vorhanden. Erstellen Sie ein Objekt um zu beginnen.",no_tasks_short:"Keine Aufgaben",no_history:"Noch keine Verlaufseintr\xE4ge.",show_all:"Alle anzeigen",cost_duration_chart:"Kosten & Dauer",installed:"Installiert",confirm_delete_object:"Dieses Objekt und alle zugeh\xF6rigen Aufgaben l\xF6schen?",confirm_delete_task:"Diese Aufgabe wirklich l\xF6schen?",min:"Min",max:"Max",save:"Speichern",saving:"Speichern\u2026",edit_task:"Aufgabe bearbeiten",new_task:"Neue Wartungsaufgabe",task_name:"Aufgabenname",maintenance_type:"Wartungstyp",schedule_type:"Planungsart",interval_days:"Intervall (Tage)",warning_days:"Warntage",interval_anchor:"Intervall-Anker",anchor_completion:"Ab Erledigung",anchor_planned:"Ab geplantem Datum (kein Drift)",edit_object:"Objekt bearbeiten",name:"Name",manufacturer_optional:"Hersteller (optional)",model_optional:"Modell (optional)",trigger_configuration:"Trigger-Konfiguration",entity_id:"Entit\xE4ts-ID",comma_separated:"kommagetrennt",entity_logic:"Entit\xE4ts-Logik",entity_logic_any:"Beliebige Entit\xE4t l\xF6st aus",entity_logic_all:"Alle Entit\xE4ten m\xFCssen ausl\xF6sen",entities:"Entit\xE4ten",attribute_optional:"Attribut (optional, leer = Zustand)",use_entity_state:"Entit\xE4ts-Zustand verwenden (kein Attribut)",trigger_above:"Ausl\xF6sen wenn \xFCber",trigger_below:"Ausl\xF6sen wenn unter",for_at_least_minutes:"F\xFCr mindestens (Minuten)",safety_interval_days:"Sicherheitsintervall (Tage, optional)",delta_mode:"Delta-Modus",from_state_optional:"Von Zustand (optional)",to_state_optional:"Zu Zustand (optional)",documentation_url_optional:"Dokumentation URL (optional)",nfc_tag_id_optional:"NFC-Tag-ID (optional)",nfc_tag_id:"NFC-Tag-ID",nfc_linked:"NFC-Tag verkn\xFCpft",nfc_link_hint:"Klicken um NFC-Tag zu verkn\xFCpfen",responsible_user:"Verantwortlicher Benutzer",no_user_assigned:"(Kein Benutzer zugewiesen)",all_users:"Alle Benutzer",my_tasks:"Meine Aufgaben",budget_monthly:"Monatsbudget",budget_yearly:"Jahresbudget",groups:"Gruppen",loading_chart:"Daten werden geladen...",was_maintenance_needed:"War diese Wartung n\xF6tig?",feedback_needed:"N\xF6tig",feedback_not_needed:"Nicht n\xF6tig",feedback_not_sure:"Unsicher",suggested_interval:"Empfohlenes Intervall",apply_suggestion:"\xDCbernehmen",dismiss_suggestion:"Verwerfen",confidence_low:"Niedrig",confidence_medium:"Mittel",confidence_high:"Hoch",recommended:"empfohlen",seasonal_awareness:"Saisonale Anpassung",seasonal_chart_title:"Saisonale Faktoren",seasonal_learned:"Gelernt",seasonal_manual:"Manuell",month_jan:"Jan",month_feb:"Feb",month_mar:"M\xE4r",month_apr:"Apr",month_may:"Mai",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dez",sensor_prediction:"Sensorvorhersage",degradation_trend:"Trend",trend_rising:"Steigend",trend_falling:"Fallend",trend_stable:"Stabil",trend_insufficient_data:"Unzureichende Daten",days_until_threshold:"Tage bis Schwellwert",threshold_exceeded:"Schwellwert \xFCberschritten",environmental_adjustment:"Umgebungsfaktor",sensor_prediction_urgency:"Sensor prognostiziert Schwellwert in ~{days} Tagen",day_short:"Tag",weibull_reliability_curve:"Zuverl\xE4ssigkeitskurve",weibull_failure_probability:"Ausfallwahrscheinlichkeit",weibull_r_squared:"G\xFCte R\xB2",beta_early_failures:"Fr\xFChausf\xE4lle",beta_random_failures:"Zuf\xE4llige Ausf\xE4lle",beta_wear_out:"Verschlei\xDF",beta_highly_predictable:"Hochvorhersagbar",confidence_interval:"Konfidenzintervall",confidence_conservative:"Konservativ",confidence_aggressive:"Optimistisch",current_interval_marker:"Aktuelles Intervall",recommended_marker:"Empfohlen",characteristic_life:"Charakteristische Lebensdauer",chart_mini_sparkline:"Trend-Sparkline",chart_history:"Kosten- und Dauer-Verlauf",chart_seasonal:"Saisonfaktoren, 12 Monate",chart_weibull:"Weibull-Zuverl\xE4ssigkeitskurve",chart_sparkline:"Sensor-Triggerwert-Verlauf",days_progress:"Tagesfortschritt",qr_code:"QR-Code",qr_generating:"QR-Code wird generiert\u2026",qr_error:"QR-Code konnte nicht generiert werden.",qr_error_no_url:"Keine HA-URL konfiguriert. Bitte unter Einstellungen \u2192 System \u2192 Netzwerk eine externe oder interne URL setzen.",save_error:"Fehler beim Speichern. Bitte erneut versuchen.",qr_print:"Drucken",qr_download:"SVG herunterladen",qr_action:"Aktion beim Scannen",qr_action_view:"Wartungsinfo anzeigen",qr_action_complete:"Wartung als erledigt markieren",qr_url_mode:"Link-Typ",qr_mode_companion:"Companion App",qr_mode_local:"Lokal (mDNS)",qr_mode_server:"Server-URL",overview:"\xDCbersicht",analysis:"Analyse",recent_activities:"Letzte Aktivit\xE4ten",search_notes:"Notizen durchsuchen",avg_cost:"\xD8 Kosten",no_advanced_features:"Keine erweiterten Funktionen aktiviert",no_advanced_features_hint:"Aktiviere \u201EAdaptive Intervalle\u201C oder \u201ESaisonale Muster\u201C in den Integrationseinstellungen, um hier Analysedaten zu sehen.",analysis_not_enough_data:"Noch nicht gen\xFCgend Daten f\xFCr die Analyse vorhanden.",analysis_not_enough_data_hint:"Die Weibull-Analyse ben\xF6tigt mindestens 5 abgeschlossene Wartungen, saisonale Muster werden nach 6+ Datenpunkten pro Monat sichtbar.",analysis_manual_task_hint:"Manuelle Aufgaben ohne Intervall erzeugen keine Analysedaten.",completions:"Abschl\xFCsse",current:"Aktuell",shorter:"K\xFCrzer",longer:"L\xE4nger",normal:"Normal",disabled:"Deaktiviert",compound_logic:"Verkn\xFCpfungslogik",card_title:"Titel",card_show_header:"Kopfzeile mit Statistiken anzeigen",card_show_actions:"Aktionsbuttons anzeigen",card_compact:"Kompaktmodus",card_max_items:"Max. Eintr\xE4ge (0 = alle)",action_error:"Aktion fehlgeschlagen. Bitte erneut versuchen.",area_id_optional:"Bereich (optional)",installation_date_optional:"Installationsdatum (optional)",custom_icon_optional:"Icon (optional, z.B. mdi:wrench)",task_enabled:"Aufgabe aktiviert",skip_reason_prompt:"Aufgabe \xFCberspringen?",reason_optional:"Grund (optional)",reset_date_prompt:"Aufgabe zur\xFCcksetzen?",reset_date_optional:"Neues Datum (optional)",notes_label:"Notizen",documentation_label:"Dokumentation",no_nfc_tag:"\u2014 Kein Tag \u2014",dashboard:"Dashboard",settings:"Einstellungen",settings_features:"Erweiterte Funktionen",settings_features_desc:"Erweiterte Funktionen ein- oder ausschalten. Deaktivieren blendet sie in der Oberfl\xE4che aus, l\xF6scht aber keine Daten.",feat_adaptive:"Adaptive Intervalle",feat_adaptive_desc:"Optimale Intervalle aus Wartungshistorie lernen",feat_predictions:"Sensorvorhersagen",feat_predictions_desc:"Trigger-Datum anhand von Sensordegradation vorhersagen",feat_seasonal:"Saisonale Anpassungen",feat_seasonal_desc:"Intervalle basierend auf saisonalen Mustern anpassen",feat_environmental:"Umgebungskorrelation",feat_environmental_desc:"Intervalle mit Temperatur/Luftfeuchtigkeit korrelieren",feat_budget:"Budgetverfolgung",feat_budget_desc:"Monatliche und j\xE4hrliche Wartungsausgaben verfolgen",feat_groups:"Aufgabengruppen",feat_groups_desc:"Aufgaben in logische Gruppen organisieren",feat_checklists:"Checklisten",feat_checklists_desc:"Mehrstufige Verfahren zur Aufgabenerlediung",settings_general:"Allgemein",settings_default_warning:"Standard-Warntage",settings_panel_enabled:"Seitenleisten-Panel",settings_notifications:"Benachrichtigungen",settings_notify_service:"Benachrichtigungsdienst",settings_notify_due_soon:"Bei baldiger F\xE4lligkeit benachrichtigen",settings_notify_overdue:"Bei \xDCberf\xE4lligkeit benachrichtigen",settings_notify_triggered:"Bei Ausl\xF6sung benachrichtigen",settings_interval_hours:"Wiederholungsintervall (Stunden, 0 = einmalig)",settings_quiet_hours:"Ruhezeiten",settings_quiet_start:"Beginn",settings_quiet_end:"Ende",settings_max_per_day:"Max. Benachrichtigungen pro Tag (0 = unbegrenzt)",settings_bundling:"Benachrichtigungen b\xFCndeln",settings_bundle_threshold:"B\xFCndelungsschwelle",settings_actions:"Mobile Aktionsbuttons",settings_action_complete:'"Erledigt"-Button anzeigen',settings_action_skip:'"\xDCberspringen"-Button anzeigen',settings_action_snooze:'"Schlummern"-Button anzeigen',settings_snooze_hours:"Schlummerdauer (Stunden)",settings_budget:"Budget",settings_currency:"W\xE4hrung",settings_budget_monthly:"Monatsbudget",settings_budget_yearly:"Jahresbudget",settings_budget_alerts:"Budget-Warnungen",settings_budget_threshold:"Warnschwelle (%)",settings_import_export:"Import / Export",settings_export_json:"JSON exportieren",settings_export_csv:"CSV exportieren",settings_import_csv:"CSV importieren",settings_import_placeholder:"JSON- oder CSV-Inhalt hier einf\xFCgen\u2026",settings_import_btn:"Importieren",settings_import_success:"{count} Objekte erfolgreich importiert.",settings_export_success:"Export heruntergeladen.",settings_saved:"Einstellung gespeichert.",settings_include_history:"Verlauf einbeziehen"},Yt={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",ok:"OK",all:"All",new_object:"+ New Object",edit:"Edit",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",reset:"Reset",cancel:"Cancel",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",runtime_hours:"Target runtime (hours)",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",custom:"Custom",history:"History",cost:"Cost",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",loading_chart:"Loading chart data...",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",no_advanced_features_hint:"Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",completions:"completions",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",installation_date_optional:"Installation date (optional)",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Reset this task?",reset_date_optional:"New date (optional)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_predictions:"Sensor Predictions",feat_predictions_desc:"Predict trigger dates from sensor degradation",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_panel_enabled:"Sidebar panel",settings_notifications:"Notifications",settings_notify_service:"Notification service",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_snooze_hours:"Snooze duration (hours)",settings_budget:"Budget",settings_currency:"Currency",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_csv:"Export CSV",settings_import_csv:"Import CSV",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history"},Qt={maintenance:"Onderhoud",objects:"Objecten",tasks:"Taken",overdue:"Achterstallig",due_soon:"Binnenkort",triggered:"Geactiveerd",ok:"OK",all:"Alle",new_object:"+ Nieuw object",edit:"Bewerken",delete:"Verwijderen",add_task:"+ Taak",complete:"Voltooid",completed:"Voltooid",skip:"Overslaan",skipped:"Overgeslagen",reset:"Resetten",cancel:"Annuleren",completing:"Wordt voltooid\u2026",interval:"Interval",warning:"Waarschuwing",last_performed:"Laatst uitgevoerd",next_due:"Volgende keer",days_until_due:"Dagen tot vervaldatum",avg_duration:"\xD8 Duur",trigger:"Trigger",trigger_type:"Triggertype",threshold_above:"Bovengrens",threshold_below:"Ondergrens",threshold:"Drempelwaarde",counter:"Teller",state_change:"Statuswijziging",runtime:"Looptijd",runtime_hours:"Doellooptijd (uren)",target_value:"Doelwaarde",baseline:"Basislijn",target_changes:"Doelwijzigingen",for_minutes:"Voor (minuten)",time_based:"Tijdgebaseerd",sensor_based:"Sensorgebaseerd",manual:"Handmatig",cleaning:"Reiniging",inspection:"Inspectie",replacement:"Vervanging",calibration:"Kalibratie",service:"Service",custom:"Aangepast",history:"Geschiedenis",cost:"Kosten",duration:"Duur",both:"Beide",trigger_val:"Triggerwaarde",complete_title:"Voltooid: ",checklist:"Checklist",notes_optional:"Notities (optioneel)",cost_optional:"Kosten (optioneel)",duration_minutes:"Duur in minuten (optioneel)",days:"dagen",day:"dag",today:"Vandaag",d_overdue:"d achterstallig",no_tasks:"Geen onderhoudstaken. Maak een object aan om te beginnen.",no_tasks_short:"Geen taken",no_history:"Nog geen geschiedenisitems.",show_all:"Alles tonen",cost_duration_chart:"Kosten & Duur",installed:"Ge\xEFnstalleerd",confirm_delete_object:"Dit object en alle bijbehorende taken verwijderen?",confirm_delete_task:"Deze taak verwijderen?",min:"Min",max:"Max",save:"Opslaan",saving:"Opslaan\u2026",edit_task:"Taak bewerken",new_task:"Nieuwe onderhoudstaak",task_name:"Taaknaam",maintenance_type:"Onderhoudstype",schedule_type:"Planningstype",interval_days:"Interval (dagen)",warning_days:"Waarschuwingsdagen",interval_anchor:"Interval-anker",anchor_completion:"Vanaf voltooiing",anchor_planned:"Vanaf geplande datum (geen drift)",edit_object:"Object bewerken",name:"Naam",manufacturer_optional:"Fabrikant (optioneel)",model_optional:"Model (optioneel)",trigger_configuration:"Triggerconfiguratie",entity_id:"Entiteits-ID",comma_separated:"kommagescheiden",entity_logic:"Entiteitslogica",entity_logic_any:"Elke entiteit triggert",entity_logic_all:"Alle entiteiten moeten triggeren",entities:"entiteiten",attribute_optional:"Attribuut (optioneel, leeg = status)",use_entity_state:"Entiteitsstatus gebruiken (geen attribuut)",trigger_above:"Activeren als boven",trigger_below:"Activeren als onder",for_at_least_minutes:"Voor minstens (minuten)",safety_interval_days:"Veiligheidsinterval (dagen, optioneel)",delta_mode:"Deltamodus",from_state_optional:"Van status (optioneel)",to_state_optional:"Naar status (optioneel)",documentation_url_optional:"Documentatie-URL (optioneel)",nfc_tag_id_optional:"NFC-tag-ID (optioneel)",nfc_tag_id:"NFC-tag-ID",nfc_linked:"NFC-tag gekoppeld",nfc_link_hint:"Klik om NFC-tag te koppelen",responsible_user:"Verantwoordelijke gebruiker",no_user_assigned:"(Geen gebruiker toegewezen)",all_users:"Alle gebruikers",my_tasks:"Mijn taken",budget_monthly:"Maandbudget",budget_yearly:"Jaarbudget",groups:"Groepen",loading_chart:"Grafiekgegevens laden...",was_maintenance_needed:"Was dit onderhoud nodig?",feedback_needed:"Nodig",feedback_not_needed:"Niet nodig",feedback_not_sure:"Niet zeker",suggested_interval:"Voorgesteld interval",apply_suggestion:"Toepassen",dismiss_suggestion:"Negeren",confidence_low:"Laag",confidence_medium:"Gemiddeld",confidence_high:"Hoog",recommended:"aanbevolen",seasonal_awareness:"Seizoensbewustzijn",seasonal_chart_title:"Seizoensfactoren",seasonal_learned:"Geleerd",seasonal_manual:"Handmatig",month_jan:"Jan",month_feb:"Feb",month_mar:"Mrt",month_apr:"Apr",month_may:"Mei",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensorvoorspelling",degradation_trend:"Trend",trend_rising:"Stijgend",trend_falling:"Dalend",trend_stable:"Stabiel",trend_insufficient_data:"Onvoldoende gegevens",days_until_threshold:"Dagen tot drempelwaarde",threshold_exceeded:"Drempelwaarde overschreden",environmental_adjustment:"Omgevingsfactor",sensor_prediction_urgency:"Sensor voorspelt drempelwaarde in ~{days} dagen",day_short:"dag",weibull_reliability_curve:"Betrouwbaarheidscurve",weibull_failure_probability:"Faalkans",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Vroege uitval",beta_random_failures:"Willekeurige uitval",beta_wear_out:"Slijtage",beta_highly_predictable:"Zeer voorspelbaar",confidence_interval:"Betrouwbaarheidsinterval",confidence_conservative:"Conservatief",confidence_aggressive:"Optimistisch",current_interval_marker:"Huidig interval",recommended_marker:"Aanbevolen",characteristic_life:"Karakteristieke levensduur",chart_mini_sparkline:"Trend-sparkline",chart_history:"Kosten- en duurgeschiedenis",chart_seasonal:"Seizoensfactoren, 12 maanden",chart_weibull:"Weibull-betrouwbaarheidscurve",chart_sparkline:"Sensor-triggerwaardegrafiek",days_progress:"Dagenvoortgang",qr_code:"QR-code",qr_generating:"QR-code genereren\u2026",qr_error:"QR-code kon niet worden gegenereerd.",qr_error_no_url:"Geen HA-URL geconfigureerd. Stel een externe of interne URL in via Instellingen \u2192 Systeem \u2192 Netwerk.",save_error:"Opslaan mislukt. Probeer het opnieuw.",qr_print:"Afdrukken",qr_download:"SVG downloaden",qr_action:"Actie bij scannen",qr_action_view:"Onderhoudsinfo bekijken",qr_action_complete:"Onderhoud als voltooid markeren",qr_url_mode:"Linktype",qr_mode_companion:"Companion App",qr_mode_local:"Lokaal (mDNS)",qr_mode_server:"Server-URL",overview:"Overzicht",analysis:"Analyse",recent_activities:"Recente activiteiten",search_notes:"Notities doorzoeken",avg_cost:"\xD8 Kosten",no_advanced_features:"Geen geavanceerde functies ingeschakeld",no_advanced_features_hint:"Schakel \u201EAdaptieve Intervallen\u201D of \u201ESeizoenpatronen\u201D in via de integratie-instellingen om hier analysegegevens te zien.",analysis_not_enough_data:"Nog niet genoeg gegevens voor analyse.",analysis_not_enough_data_hint:"Weibull-analyse vereist minstens 5 voltooide onderhoudsbeurten; seizoenspatronen worden zichtbaar na 6+ datapunten per maand.",analysis_manual_task_hint:"Handmatige taken zonder interval genereren geen analysegegevens.",completions:"voltooiingen",current:"Huidig",shorter:"Korter",longer:"Langer",normal:"Normaal",disabled:"Uitgeschakeld",compound_logic:"Samengestelde logica",card_title:"Titel",card_show_header:"Koptekst met statistieken tonen",card_show_actions:"Actieknoppen tonen",card_compact:"Compacte modus",card_max_items:"Max items (0 = alle)",action_error:"Actie mislukt. Probeer het opnieuw.",area_id_optional:"Gebied (optioneel)",installation_date_optional:"Installatiedatum (optioneel)",custom_icon_optional:"Icoon (optioneel, bijv. mdi:wrench)",task_enabled:"Taak ingeschakeld",skip_reason_prompt:"Deze taak overslaan?",reason_optional:"Reden (optioneel)",reset_date_prompt:"Deze taak resetten?",reset_date_optional:"Nieuwe datum (optioneel)",notes_label:"Notities",documentation_label:"Documentatie",no_nfc_tag:"\u2014 Geen tag \u2014",dashboard:"Dashboard",settings:"Instellingen",settings_features:"Geavanceerde functies",settings_features_desc:"Schakel geavanceerde functies in of uit. Uitschakelen verbergt ze in de interface maar verwijdert geen gegevens.",feat_adaptive:"Adaptieve planning",feat_adaptive_desc:"Leer optimale intervallen uit onderhoudsgeschiedenis",feat_predictions:"Sensorvoorspellingen",feat_predictions_desc:"Voorspel triggerdatums op basis van sensordegradatie",feat_seasonal:"Seizoensaanpassingen",feat_seasonal_desc:"Pas intervallen aan op seizoenspatronen",feat_environmental:"Omgevingscorrelatie",feat_environmental_desc:"Correleer intervallen met temperatuur/vochtigheid",feat_budget:"Budgetbeheer",feat_budget_desc:"Volg maandelijkse en jaarlijkse onderhoudsuitgaven",feat_groups:"Taakgroepen",feat_groups_desc:"Organiseer taken in logische groepen",feat_checklists:"Checklists",feat_checklists_desc:"Meerstaps procedures voor taakvoltooiing",settings_general:"Algemeen",settings_default_warning:"Standaard waarschuwingsdagen",settings_panel_enabled:"Zijbalkpaneel",settings_notifications:"Meldingen",settings_notify_service:"Meldingsservice",settings_notify_due_soon:"Melding bij bijna verlopen",settings_notify_overdue:"Melding bij achterstallig",settings_notify_triggered:"Melding bij geactiveerd",settings_interval_hours:"Herhalingsinterval (uren, 0 = eenmalig)",settings_quiet_hours:"Stille uren",settings_quiet_start:"Start",settings_quiet_end:"Einde",settings_max_per_day:"Max meldingen per dag (0 = onbeperkt)",settings_bundling:"Meldingen bundelen",settings_bundle_threshold:"Bundeldrempel",settings_actions:"Mobiele actieknoppen",settings_action_complete:"Knop 'Voltooid' tonen",settings_action_skip:"Knop 'Overslaan' tonen",settings_action_snooze:"Knop 'Snooze' tonen",settings_snooze_hours:"Snoozeduur (uren)",settings_budget:"Budget",settings_currency:"Valuta",settings_budget_monthly:"Maandbudget",settings_budget_yearly:"Jaarbudget",settings_budget_alerts:"Budgetwaarschuwingen",settings_budget_threshold:"Waarschuwingsdrempel (%)",settings_import_export:"Import / Export",settings_export_json:"JSON exporteren",settings_export_csv:"CSV exporteren",settings_import_csv:"CSV importeren",settings_import_placeholder:"Plak JSON- of CSV-inhoud hier\u2026",settings_import_btn:"Importeren",settings_import_success:"{count} objecten succesvol ge\xEFmporteerd.",settings_export_success:"Export gedownload.",settings_saved:"Instelling opgeslagen.",settings_include_history:"Geschiedenis meenemen"},Xt={maintenance:"Maintenance",objects:"Objets",tasks:"T\xE2ches",overdue:"En retard",due_soon:"Bient\xF4t d\xFB",triggered:"D\xE9clench\xE9",ok:"OK",all:"Tous",new_object:"+ Nouvel objet",edit:"Modifier",delete:"Supprimer",add_task:"+ T\xE2che",complete:"Termin\xE9",completed:"Termin\xE9",skip:"Passer",skipped:"Ignor\xE9",reset:"R\xE9initialiser",cancel:"Annuler",completing:"En cours\u2026",interval:"Intervalle",warning:"Avertissement",last_performed:"Derni\xE8re ex\xE9cution",next_due:"Prochaine \xE9ch\xE9ance",days_until_due:"Jours restants",avg_duration:"\xD8 Dur\xE9e",trigger:"D\xE9clencheur",trigger_type:"Type de d\xE9clencheur",threshold_above:"Limite sup\xE9rieure",threshold_below:"Limite inf\xE9rieure",threshold:"Seuil",counter:"Compteur",state_change:"Changement d'\xE9tat",runtime:"Dur\xE9e de fonctionnement",runtime_hours:"Dur\xE9e cible (heures)",target_value:"Valeur cible",baseline:"Ligne de base",target_changes:"Changements cibles",for_minutes:"Pendant (minutes)",time_based:"Temporel",sensor_based:"Capteur",manual:"Manuel",cleaning:"Nettoyage",inspection:"Inspection",replacement:"Remplacement",calibration:"\xC9talonnage",service:"Service",custom:"Personnalis\xE9",history:"Historique",cost:"Co\xFBt",duration:"Dur\xE9e",both:"Les deux",trigger_val:"Valeur du d\xE9clencheur",complete_title:"Termin\xE9 : ",checklist:"Checklist",notes_optional:"Notes (optionnel)",cost_optional:"Co\xFBt (optionnel)",duration_minutes:"Dur\xE9e en minutes (optionnel)",days:"jours",day:"jour",today:"Aujourd'hui",d_overdue:"j en retard",no_tasks:"Aucune t\xE2che de maintenance. Cr\xE9ez un objet pour commencer.",no_tasks_short:"Aucune t\xE2che",no_history:"Aucun historique.",show_all:"Tout afficher",cost_duration_chart:"Co\xFBts & Dur\xE9e",installed:"Install\xE9",confirm_delete_object:"Supprimer cet objet et toutes ses t\xE2ches ?",confirm_delete_task:"Supprimer cette t\xE2che ?",min:"Min",max:"Max",save:"Enregistrer",saving:"Enregistrement\u2026",edit_task:"Modifier la t\xE2che",new_task:"Nouvelle t\xE2che de maintenance",task_name:"Nom de la t\xE2che",maintenance_type:"Type de maintenance",schedule_type:"Type de planification",interval_days:"Intervalle (jours)",warning_days:"Jours d'avertissement",interval_anchor:"Ancrage de l'intervalle",anchor_completion:"Depuis la date de r\xE9alisation",anchor_planned:"Depuis la date pr\xE9vue (sans d\xE9rive)",edit_object:"Modifier l'objet",name:"Nom",manufacturer_optional:"Fabricant (optionnel)",model_optional:"Mod\xE8le (optionnel)",trigger_configuration:"Configuration du d\xE9clencheur",entity_id:"ID d'entit\xE9",comma_separated:"s\xE9par\xE9 par des virgules",entity_logic:"Logique d'entit\xE9",entity_logic_any:"N'importe quelle entit\xE9 d\xE9clenche",entity_logic_all:"Toutes les entit\xE9s doivent d\xE9clencher",entities:"entit\xE9s",attribute_optional:"Attribut (optionnel, vide = \xE9tat)",use_entity_state:"Utiliser l'\xE9tat de l'entit\xE9 (pas d'attribut)",trigger_above:"D\xE9clencher au-dessus de",trigger_below:"D\xE9clencher en dessous de",for_at_least_minutes:"Pendant au moins (minutes)",safety_interval_days:"Intervalle de s\xE9curit\xE9 (jours, optionnel)",delta_mode:"Mode delta",from_state_optional:"\xC9tat source (optionnel)",to_state_optional:"\xC9tat cible (optionnel)",documentation_url_optional:"URL de documentation (optionnel)",nfc_tag_id_optional:"ID tag NFC (optionnel)",nfc_tag_id:"ID tag NFC",nfc_linked:"Tag NFC li\xE9",nfc_link_hint:"Cliquer pour associer un tag NFC",responsible_user:"Utilisateur responsable",no_user_assigned:"(Aucun utilisateur assign\xE9)",all_users:"Tous les utilisateurs",my_tasks:"Mes t\xE2ches",budget_monthly:"Budget mensuel",budget_yearly:"Budget annuel",groups:"Groupes",loading_chart:"Chargement des donn\xE9es...",was_maintenance_needed:"Cette maintenance \xE9tait-elle n\xE9cessaire ?",feedback_needed:"N\xE9cessaire",feedback_not_needed:"Pas n\xE9cessaire",feedback_not_sure:"Pas s\xFBr",suggested_interval:"Intervalle sugg\xE9r\xE9",apply_suggestion:"Appliquer",dismiss_suggestion:"Ignorer",confidence_low:"Faible",confidence_medium:"Moyen",confidence_high:"\xC9lev\xE9",recommended:"recommand\xE9",seasonal_awareness:"Conscience saisonni\xE8re",seasonal_chart_title:"Facteurs saisonniers",seasonal_learned:"Appris",seasonal_manual:"Manuel",month_jan:"Jan",month_feb:"F\xE9v",month_mar:"Mar",month_apr:"Avr",month_may:"Mai",month_jun:"Juin",month_jul:"Juil",month_aug:"Ao\xFBt",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"D\xE9c",sensor_prediction:"Pr\xE9diction capteur",degradation_trend:"Tendance",trend_rising:"En hausse",trend_falling:"En baisse",trend_stable:"Stable",trend_insufficient_data:"Donn\xE9es insuffisantes",days_until_threshold:"Jours avant le seuil",threshold_exceeded:"Seuil d\xE9pass\xE9",environmental_adjustment:"Facteur environnemental",sensor_prediction_urgency:"Le capteur pr\xE9voit le seuil dans ~{days} jours",day_short:"jour",weibull_reliability_curve:"Courbe de fiabilit\xE9",weibull_failure_probability:"Probabilit\xE9 de d\xE9faillance",weibull_r_squared:"Ajustement R\xB2",beta_early_failures:"D\xE9faillances pr\xE9coces",beta_random_failures:"D\xE9faillances al\xE9atoires",beta_wear_out:"Usure",beta_highly_predictable:"Tr\xE8s pr\xE9visible",confidence_interval:"Intervalle de confiance",confidence_conservative:"Conservateur",confidence_aggressive:"Optimiste",current_interval_marker:"Intervalle actuel",recommended_marker:"Recommand\xE9",characteristic_life:"Dur\xE9e de vie caract\xE9ristique",chart_mini_sparkline:"Sparkline de tendance",chart_history:"Historique co\xFBts et dur\xE9e",chart_seasonal:"Facteurs saisonniers, 12 mois",chart_weibull:"Courbe de fiabilit\xE9 Weibull",chart_sparkline:"Graphique valeur d\xE9clencheur",days_progress:"Progression en jours",qr_code:"QR Code",qr_generating:"G\xE9n\xE9ration du QR code\u2026",qr_error:"Impossible de g\xE9n\xE9rer le QR code.",qr_error_no_url:"Aucune URL HA configur\xE9e. Veuillez d\xE9finir une URL externe ou interne dans Param\xE8tres \u2192 Syst\xE8me \u2192 R\xE9seau.",save_error:"\xC9chec de l'enregistrement. Veuillez r\xE9essayer.",qr_print:"Imprimer",qr_download:"T\xE9l\xE9charger SVG",qr_action:"Action au scan",qr_action_view:"Afficher les infos de maintenance",qr_action_complete:"Marquer la maintenance comme termin\xE9e",qr_url_mode:"Type de lien",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"URL serveur",overview:"Aper\xE7u",analysis:"Analyse",recent_activities:"Activit\xE9s r\xE9centes",search_notes:"Rechercher dans les notes",avg_cost:"\xD8 Co\xFBt",no_advanced_features:"Aucune fonction avanc\xE9e activ\xE9e",no_advanced_features_hint:"Activez \xAB Intervalles adaptatifs \xBB ou \xAB Tendances saisonni\xE8res \xBB dans les param\xE8tres de l'int\xE9gration pour voir les donn\xE9es d'analyse ici.",analysis_not_enough_data:"Pas encore assez de donn\xE9es pour l'analyse.",analysis_not_enough_data_hint:"L'analyse Weibull n\xE9cessite au moins 5 maintenances termin\xE9es ; les tendances saisonni\xE8res apparaissent apr\xE8s 6+ points par mois.",analysis_manual_task_hint:"Les t\xE2ches manuelles sans intervalle ne g\xE9n\xE8rent pas de donn\xE9es d'analyse.",completions:"r\xE9alisations",current:"Actuel",shorter:"Plus court",longer:"Plus long",normal:"Normal",disabled:"D\xE9sactiv\xE9",compound_logic:"Logique compos\xE9e",card_title:"Titre",card_show_header:"Afficher l'en-t\xEAte avec statistiques",card_show_actions:"Afficher les boutons d'action",card_compact:"Mode compact",card_max_items:"Nombre max (0 = tous)",action_error:"Action \xE9chou\xE9e. Veuillez r\xE9essayer.",area_id_optional:"Zone (optionnel)",installation_date_optional:"Date d'installation (optionnel)",custom_icon_optional:"Ic\xF4ne (optionnel, ex. mdi:wrench)",task_enabled:"T\xE2che activ\xE9e",skip_reason_prompt:"Ignorer cette t\xE2che ?",reason_optional:"Raison (optionnel)",reset_date_prompt:"R\xE9initialiser cette t\xE2che ?",reset_date_optional:"Nouvelle date (optionnel)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 Aucun tag \u2014",dashboard:"Tableau de bord",settings:"Param\xE8tres",settings_features:"Fonctions avanc\xE9es",settings_features_desc:"Activez ou d\xE9sactivez les fonctions avanc\xE9es. La d\xE9sactivation les masque dans l'interface mais ne supprime pas les donn\xE9es.",feat_adaptive:"Planification adaptative",feat_adaptive_desc:"Apprendre les intervalles optimaux \xE0 partir de l'historique",feat_predictions:"Pr\xE9dictions capteurs",feat_predictions_desc:"Pr\xE9dire les dates de d\xE9clenchement par d\xE9gradation des capteurs",feat_seasonal:"Ajustements saisonniers",feat_seasonal_desc:"Ajuster les intervalles selon les tendances saisonni\xE8res",feat_environmental:"Corr\xE9lation environnementale",feat_environmental_desc:"Corr\xE9ler les intervalles avec la temp\xE9rature/humidit\xE9",feat_budget:"Suivi budg\xE9taire",feat_budget_desc:"Suivre les d\xE9penses de maintenance mensuelles et annuelles",feat_groups:"Groupes de t\xE2ches",feat_groups_desc:"Organiser les t\xE2ches en groupes logiques",feat_checklists:"Checklists",feat_checklists_desc:"Proc\xE9dures multi-\xE9tapes pour la r\xE9alisation des t\xE2ches",settings_general:"G\xE9n\xE9ral",settings_default_warning:"Jours d'avertissement par d\xE9faut",settings_panel_enabled:"Panneau lat\xE9ral",settings_notifications:"Notifications",settings_notify_service:"Service de notification",settings_notify_due_soon:"Notifier quand bient\xF4t d\xFB",settings_notify_overdue:"Notifier quand en retard",settings_notify_triggered:"Notifier quand d\xE9clench\xE9",settings_interval_hours:"Intervalle de r\xE9p\xE9tition (heures, 0 = une fois)",settings_quiet_hours:"Heures de silence",settings_quiet_start:"D\xE9but",settings_quiet_end:"Fin",settings_max_per_day:"Max notifications par jour (0 = illimit\xE9)",settings_bundling:"Regrouper les notifications",settings_bundle_threshold:"Seuil de regroupement",settings_actions:"Boutons d'action mobiles",settings_action_complete:"Afficher le bouton 'Termin\xE9'",settings_action_skip:"Afficher le bouton 'Passer'",settings_action_snooze:"Afficher le bouton 'Reporter'",settings_snooze_hours:"Dur\xE9e de report (heures)",settings_budget:"Budget",settings_currency:"Devise",settings_budget_monthly:"Budget mensuel",settings_budget_yearly:"Budget annuel",settings_budget_alerts:"Alertes budg\xE9taires",settings_budget_threshold:"Seuil d'alerte (%)",settings_import_export:"Import / Export",settings_export_json:"Exporter JSON",settings_export_csv:"Exporter CSV",settings_import_csv:"Importer CSV",settings_import_placeholder:"Collez le contenu JSON ou CSV ici\u2026",settings_import_btn:"Importer",settings_import_success:"{count} objets import\xE9s avec succ\xE8s.",settings_export_success:"Export t\xE9l\xE9charg\xE9.",settings_saved:"Param\xE8tre enregistr\xE9.",settings_include_history:"Inclure l'historique"},ei={maintenance:"Manutenzione",objects:"Oggetti",tasks:"Attivit\xE0",overdue:"Scaduto",due_soon:"In scadenza",triggered:"Attivato",ok:"OK",all:"Tutti",new_object:"+ Nuovo oggetto",edit:"Modifica",delete:"Elimina",add_task:"+ Attivit\xE0",complete:"Completato",completed:"Completato",skip:"Salta",skipped:"Saltato",reset:"Reimposta",cancel:"Annulla",completing:"Completamento\u2026",interval:"Intervallo",warning:"Avviso",last_performed:"Ultima esecuzione",next_due:"Prossima scadenza",days_until_due:"Giorni alla scadenza",avg_duration:"\xD8 Durata",trigger:"Trigger",trigger_type:"Tipo di trigger",threshold_above:"Limite superiore",threshold_below:"Limite inferiore",threshold:"Soglia",counter:"Contatore",state_change:"Cambio di stato",runtime:"Tempo di funzionamento",runtime_hours:"Durata obiettivo (ore)",target_value:"Valore obiettivo",baseline:"Linea di base",target_changes:"Modifiche obiettivo",for_minutes:"Per (minuti)",time_based:"Temporale",sensor_based:"Sensore",manual:"Manuale",cleaning:"Pulizia",inspection:"Ispezione",replacement:"Sostituzione",calibration:"Calibrazione",service:"Servizio",custom:"Personalizzato",history:"Cronologia",cost:"Costo",duration:"Durata",both:"Entrambi",trigger_val:"Valore trigger",complete_title:"Completato: ",checklist:"Checklist",notes_optional:"Note (opzionale)",cost_optional:"Costo (opzionale)",duration_minutes:"Durata in minuti (opzionale)",days:"giorni",day:"giorno",today:"Oggi",d_overdue:"g in ritardo",no_tasks:"Nessuna attivit\xE0 di manutenzione. Crea un oggetto per iniziare.",no_tasks_short:"Nessuna attivit\xE0",no_history:"Nessuna voce nella cronologia.",show_all:"Mostra tutto",cost_duration_chart:"Costi & Durata",installed:"Installato",confirm_delete_object:"Eliminare questo oggetto e tutte le sue attivit\xE0?",confirm_delete_task:"Eliminare questa attivit\xE0?",min:"Min",max:"Max",save:"Salva",saving:"Salvataggio\u2026",edit_task:"Modifica attivit\xE0",new_task:"Nuova attivit\xE0 di manutenzione",task_name:"Nome attivit\xE0",maintenance_type:"Tipo di manutenzione",schedule_type:"Tipo di pianificazione",interval_days:"Intervallo (giorni)",warning_days:"Giorni di avviso",interval_anchor:"Ancoraggio intervallo",anchor_completion:"Dalla data di completamento",anchor_planned:"Dalla data pianificata (nessuna deriva)",edit_object:"Modifica oggetto",name:"Nome",manufacturer_optional:"Produttore (opzionale)",model_optional:"Modello (opzionale)",trigger_configuration:"Configurazione trigger",entity_id:"ID entit\xE0",comma_separated:"separati da virgola",entity_logic:"Logica entit\xE0",entity_logic_any:"Qualsiasi entit\xE0 attiva",entity_logic_all:"Tutte le entit\xE0 devono attivare",entities:"entit\xE0",attribute_optional:"Attributo (opzionale, vuoto = stato)",use_entity_state:"Usa stato dell'entit\xE0 (nessun attributo)",trigger_above:"Attivare sopra",trigger_below:"Attivare sotto",for_at_least_minutes:"Per almeno (minuti)",safety_interval_days:"Intervallo di sicurezza (giorni, opzionale)",delta_mode:"Modalit\xE0 delta",from_state_optional:"Dallo stato (opzionale)",to_state_optional:"Allo stato (opzionale)",documentation_url_optional:"URL documentazione (opzionale)",nfc_tag_id_optional:"ID tag NFC (opzionale)",nfc_tag_id:"ID tag NFC",nfc_linked:"Tag NFC collegato",nfc_link_hint:"Clicca per collegare un tag NFC",responsible_user:"Utente responsabile",no_user_assigned:"(Nessun utente assegnato)",all_users:"Tutti gli utenti",my_tasks:"Le mie attivit\xE0",budget_monthly:"Budget mensile",budget_yearly:"Budget annuale",groups:"Gruppi",loading_chart:"Caricamento dati...",was_maintenance_needed:"Questa manutenzione era necessaria?",feedback_needed:"Necessaria",feedback_not_needed:"Non necessaria",feedback_not_sure:"Non sicuro",suggested_interval:"Intervallo suggerito",apply_suggestion:"Applica",dismiss_suggestion:"Ignora",confidence_low:"Bassa",confidence_medium:"Media",confidence_high:"Alta",recommended:"consigliato",seasonal_awareness:"Consapevolezza stagionale",seasonal_chart_title:"Fattori stagionali",seasonal_learned:"Appreso",seasonal_manual:"Manuale",month_jan:"Gen",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"Mag",month_jun:"Giu",month_jul:"Lug",month_aug:"Ago",month_sep:"Set",month_oct:"Ott",month_nov:"Nov",month_dec:"Dic",sensor_prediction:"Previsione sensore",degradation_trend:"Tendenza",trend_rising:"In aumento",trend_falling:"In calo",trend_stable:"Stabile",trend_insufficient_data:"Dati insufficienti",days_until_threshold:"Giorni alla soglia",threshold_exceeded:"Soglia superata",environmental_adjustment:"Fattore ambientale",sensor_prediction_urgency:"Il sensore prevede la soglia tra ~{days} giorni",day_short:"giorno",weibull_reliability_curve:"Curva di affidabilit\xE0",weibull_failure_probability:"Probabilit\xE0 di guasto",weibull_r_squared:"Adattamento R\xB2",beta_early_failures:"Guasti precoci",beta_random_failures:"Guasti casuali",beta_wear_out:"Usura",beta_highly_predictable:"Altamente prevedibile",confidence_interval:"Intervallo di confidenza",confidence_conservative:"Conservativo",confidence_aggressive:"Ottimistico",current_interval_marker:"Intervallo attuale",recommended_marker:"Consigliato",characteristic_life:"Vita caratteristica",chart_mini_sparkline:"Sparkline di tendenza",chart_history:"Cronologia costi e durata",chart_seasonal:"Fattori stagionali, 12 mesi",chart_weibull:"Curva di affidabilit\xE0 Weibull",chart_sparkline:"Grafico valore trigger sensore",days_progress:"Avanzamento giorni",qr_code:"Codice QR",qr_generating:"Generazione codice QR\u2026",qr_error:"Impossibile generare il codice QR.",qr_error_no_url:"Nessun URL HA configurato. Impostare un URL esterno o interno in Impostazioni \u2192 Sistema \u2192 Rete.",save_error:"Salvataggio non riuscito. Riprovare.",qr_print:"Stampa",qr_download:"Scarica SVG",qr_action:"Azione alla scansione",qr_action_view:"Visualizza info manutenzione",qr_action_complete:"Segna manutenzione come completata",qr_url_mode:"Tipo di link",qr_mode_companion:"Companion App",qr_mode_local:"Locale (mDNS)",qr_mode_server:"URL server",overview:"Panoramica",analysis:"Analisi",recent_activities:"Attivit\xE0 recenti",search_notes:"Cerca nelle note",avg_cost:"\xD8 Costo",no_advanced_features:"Nessuna funzione avanzata attivata",no_advanced_features_hint:"Attiva \u201CIntervalli Adattivi\u201D o \u201CModelli Stagionali\u201D nelle impostazioni dell'integrazione per vedere i dati di analisi qui.",analysis_not_enough_data:"Non ci sono ancora abbastanza dati per l'analisi.",analysis_not_enough_data_hint:"L'analisi Weibull richiede almeno 5 manutenzioni completate; i modelli stagionali diventano visibili dopo 6+ punti dati al mese.",analysis_manual_task_hint:"Le attivit\xE0 manuali senza intervallo non generano dati di analisi.",completions:"completamenti",current:"Attuale",shorter:"Pi\xF9 breve",longer:"Pi\xF9 lungo",normal:"Normale",disabled:"Disattivato",compound_logic:"Logica composta",card_title:"Titolo",card_show_header:"Mostra intestazione con statistiche",card_show_actions:"Mostra pulsanti azione",card_compact:"Modalit\xE0 compatta",card_max_items:"Max elementi (0 = tutti)",action_error:"Azione fallita. Riprova.",area_id_optional:"Area (opzionale)",installation_date_optional:"Data di installazione (opzionale)",custom_icon_optional:"Icona (opzionale, es. mdi:wrench)",task_enabled:"Attivit\xE0 abilitata",skip_reason_prompt:"Saltare questa attivit\xE0?",reason_optional:"Motivo (opzionale)",reset_date_prompt:"Reimpostare questa attivit\xE0?",reset_date_optional:"Nuova data (opzionale)",notes_label:"Note",documentation_label:"Documentazione",no_nfc_tag:"\u2014 Nessun tag \u2014",dashboard:"Dashboard",settings:"Impostazioni",settings_features:"Funzioni avanzate",settings_features_desc:"Attiva o disattiva le funzioni avanzate. La disattivazione le nasconde dall'interfaccia ma non elimina i dati.",feat_adaptive:"Pianificazione adattiva",feat_adaptive_desc:"Impara intervalli ottimali dalla cronologia di manutenzione",feat_predictions:"Previsioni sensore",feat_predictions_desc:"Prevedi date di attivazione dalla degradazione dei sensori",feat_seasonal:"Adeguamenti stagionali",feat_seasonal_desc:"Adegua gli intervalli in base ai modelli stagionali",feat_environmental:"Correlazione ambientale",feat_environmental_desc:"Correla gli intervalli con temperatura/umidit\xE0",feat_budget:"Monitoraggio budget",feat_budget_desc:"Monitora le spese di manutenzione mensili e annuali",feat_groups:"Gruppi di attivit\xE0",feat_groups_desc:"Organizza le attivit\xE0 in gruppi logici",feat_checklists:"Checklist",feat_checklists_desc:"Procedure multi-fase per il completamento delle attivit\xE0",settings_general:"Generale",settings_default_warning:"Giorni di avviso predefiniti",settings_panel_enabled:"Pannello laterale",settings_notifications:"Notifiche",settings_notify_service:"Servizio di notifica",settings_notify_due_soon:"Notifica quando in scadenza",settings_notify_overdue:"Notifica quando scaduto",settings_notify_triggered:"Notifica quando attivato",settings_interval_hours:"Intervallo di ripetizione (ore, 0 = una volta)",settings_quiet_hours:"Ore di silenzio",settings_quiet_start:"Inizio",settings_quiet_end:"Fine",settings_max_per_day:"Max notifiche al giorno (0 = illimitato)",settings_bundling:"Raggruppare le notifiche",settings_bundle_threshold:"Soglia di raggruppamento",settings_actions:"Pulsanti azione mobili",settings_action_complete:"Mostra pulsante 'Completato'",settings_action_skip:"Mostra pulsante 'Salta'",settings_action_snooze:"Mostra pulsante 'Posticipa'",settings_snooze_hours:"Durata posticipo (ore)",settings_budget:"Budget",settings_currency:"Valuta",settings_budget_monthly:"Budget mensile",settings_budget_yearly:"Budget annuale",settings_budget_alerts:"Avvisi budget",settings_budget_threshold:"Soglia di avviso (%)",settings_import_export:"Import / Export",settings_export_json:"Esporta JSON",settings_export_csv:"Esporta CSV",settings_import_csv:"Importa CSV",settings_import_placeholder:"Incolla il contenuto JSON o CSV qui\u2026",settings_import_btn:"Importa",settings_import_success:"{count} oggetti importati con successo.",settings_export_success:"Export scaricato.",settings_saved:"Impostazione salvata.",settings_include_history:"Includi cronologia"},ti={maintenance:"Mantenimiento",objects:"Objetos",tasks:"Tareas",overdue:"Vencida",due_soon:"Pr\xF3xima",triggered:"Activada",ok:"OK",all:"Todos",new_object:"+ Nuevo objeto",edit:"Editar",delete:"Eliminar",add_task:"+ Tarea",complete:"Completada",completed:"Completada",skip:"Omitir",skipped:"Omitida",reset:"Restablecer",cancel:"Cancelar",completing:"Completando\u2026",interval:"Intervalo",warning:"Aviso",last_performed:"\xDAltima ejecuci\xF3n",next_due:"Pr\xF3ximo vencimiento",days_until_due:"D\xEDas hasta vencimiento",avg_duration:"\xD8 Duraci\xF3n",trigger:"Disparador",trigger_type:"Tipo de disparador",threshold_above:"L\xEDmite superior",threshold_below:"L\xEDmite inferior",threshold:"Umbral",counter:"Contador",state_change:"Cambio de estado",runtime:"Tiempo de funcionamiento",runtime_hours:"Duraci\xF3n objetivo (horas)",target_value:"Valor objetivo",baseline:"L\xEDnea base",target_changes:"Cambios objetivo",for_minutes:"Durante (minutos)",time_based:"Temporal",sensor_based:"Sensor",manual:"Manual",cleaning:"Limpieza",inspection:"Inspecci\xF3n",replacement:"Sustituci\xF3n",calibration:"Calibraci\xF3n",service:"Servicio",custom:"Personalizado",history:"Historial",cost:"Coste",duration:"Duraci\xF3n",both:"Ambos",trigger_val:"Valor del disparador",complete_title:"Completada: ",checklist:"Lista de verificaci\xF3n",notes_optional:"Notas (opcional)",cost_optional:"Coste (opcional)",duration_minutes:"Duraci\xF3n en minutos (opcional)",days:"d\xEDas",day:"d\xEDa",today:"Hoy",d_overdue:"d vencida",no_tasks:"No hay tareas de mantenimiento. Cree un objeto para empezar.",no_tasks_short:"Sin tareas",no_history:"Sin entradas en el historial.",show_all:"Mostrar todo",cost_duration_chart:"Costes & Duraci\xF3n",installed:"Instalado",confirm_delete_object:"\xBFEliminar este objeto y todas sus tareas?",confirm_delete_task:"\xBFEliminar esta tarea?",min:"M\xEDn",max:"M\xE1x",save:"Guardar",saving:"Guardando\u2026",edit_task:"Editar tarea",new_task:"Nueva tarea de mantenimiento",task_name:"Nombre de la tarea",maintenance_type:"Tipo de mantenimiento",schedule_type:"Tipo de planificaci\xF3n",interval_days:"Intervalo (d\xEDas)",warning_days:"D\xEDas de aviso",interval_anchor:"Anclaje del intervalo",anchor_completion:"Desde la fecha de finalizaci\xF3n",anchor_planned:"Desde la fecha planificada (sin desviaci\xF3n)",edit_object:"Editar objeto",name:"Nombre",manufacturer_optional:"Fabricante (opcional)",model_optional:"Modelo (opcional)",trigger_configuration:"Configuraci\xF3n del disparador",entity_id:"ID de entidad",comma_separated:"separados por comas",entity_logic:"L\xF3gica de entidad",entity_logic_any:"Cualquier entidad activa",entity_logic_all:"Todas las entidades deben activar",entities:"entidades",attribute_optional:"Atributo (opcional, vac\xEDo = estado)",use_entity_state:"Usar estado de la entidad (sin atributo)",trigger_above:"Activar por encima de",trigger_below:"Activar por debajo de",for_at_least_minutes:"Durante al menos (minutos)",safety_interval_days:"Intervalo de seguridad (d\xEDas, opcional)",delta_mode:"Modo delta",from_state_optional:"Desde estado (opcional)",to_state_optional:"Hasta estado (opcional)",documentation_url_optional:"URL de documentaci\xF3n (opcional)",nfc_tag_id_optional:"ID de etiqueta NFC (opcional)",nfc_tag_id:"ID de etiqueta NFC",nfc_linked:"Etiqueta NFC vinculada",nfc_link_hint:"Clic para vincular etiqueta NFC",responsible_user:"Usuario responsable",no_user_assigned:"(Ning\xFAn usuario asignado)",all_users:"Todos los usuarios",my_tasks:"Mis tareas",budget_monthly:"Presupuesto mensual",budget_yearly:"Presupuesto anual",groups:"Grupos",loading_chart:"Cargando datos...",was_maintenance_needed:"\xBFEra necesario este mantenimiento?",feedback_needed:"Necesario",feedback_not_needed:"No necesario",feedback_not_sure:"No seguro",suggested_interval:"Intervalo sugerido",apply_suggestion:"Aplicar",dismiss_suggestion:"Descartar",confidence_low:"Baja",confidence_medium:"Media",confidence_high:"Alta",recommended:"recomendado",seasonal_awareness:"Conciencia estacional",seasonal_chart_title:"Factores estacionales",seasonal_learned:"Aprendido",seasonal_manual:"Manual",month_jan:"Ene",month_feb:"Feb",month_mar:"Mar",month_apr:"Abr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Ago",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dic",sensor_prediction:"Predicci\xF3n del sensor",degradation_trend:"Tendencia",trend_rising:"En aumento",trend_falling:"En descenso",trend_stable:"Estable",trend_insufficient_data:"Datos insuficientes",days_until_threshold:"D\xEDas hasta el umbral",threshold_exceeded:"Umbral superado",environmental_adjustment:"Factor ambiental",sensor_prediction_urgency:"El sensor predice el umbral en ~{days} d\xEDas",day_short:"d\xEDa",weibull_reliability_curve:"Curva de fiabilidad",weibull_failure_probability:"Probabilidad de fallo",weibull_r_squared:"Ajuste R\xB2",beta_early_failures:"Fallos tempranos",beta_random_failures:"Fallos aleatorios",beta_wear_out:"Desgaste",beta_highly_predictable:"Altamente predecible",confidence_interval:"Intervalo de confianza",confidence_conservative:"Conservador",confidence_aggressive:"Optimista",current_interval_marker:"Intervalo actual",recommended_marker:"Recomendado",characteristic_life:"Vida caracter\xEDstica",chart_mini_sparkline:"Sparkline de tendencia",chart_history:"Historial de costes y duraci\xF3n",chart_seasonal:"Factores estacionales, 12 meses",chart_weibull:"Curva de fiabilidad Weibull",chart_sparkline:"Gr\xE1fico de valor del disparador",days_progress:"Progreso en d\xEDas",qr_code:"C\xF3digo QR",qr_generating:"Generando c\xF3digo QR\u2026",qr_error:"No se pudo generar el c\xF3digo QR.",qr_error_no_url:"No hay URL de HA configurada. Establezca una URL externa o interna en Ajustes \u2192 Sistema \u2192 Red.",save_error:"Error al guardar. Int\xE9ntelo de nuevo.",qr_print:"Imprimir",qr_download:"Descargar SVG",qr_action:"Acci\xF3n al escanear",qr_action_view:"Ver info de mantenimiento",qr_action_complete:"Marcar mantenimiento como completado",qr_url_mode:"Tipo de enlace",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"URL del servidor",overview:"Resumen",analysis:"An\xE1lisis",recent_activities:"Actividades recientes",search_notes:"Buscar en notas",avg_cost:"\xD8 Coste",no_advanced_features:"Sin funciones avanzadas activadas",no_advanced_features_hint:"Active \u201CIntervalos Adaptativos\u201D o \u201CPatrones Estacionales\u201D en la configuraci\xF3n de la integraci\xF3n para ver datos de an\xE1lisis aqu\xED.",analysis_not_enough_data:"A\xFAn no hay suficientes datos para el an\xE1lisis.",analysis_not_enough_data_hint:"El an\xE1lisis Weibull requiere al menos 5 mantenimientos completados; los patrones estacionales son visibles tras 6+ puntos de datos por mes.",analysis_manual_task_hint:"Las tareas manuales sin intervalo no generan datos de an\xE1lisis.",completions:"finalizaciones",current:"Actual",shorter:"M\xE1s corto",longer:"M\xE1s largo",normal:"Normal",disabled:"Desactivado",compound_logic:"L\xF3gica compuesta",card_title:"T\xEDtulo",card_show_header:"Mostrar encabezado con estad\xEDsticas",card_show_actions:"Mostrar botones de acci\xF3n",card_compact:"Modo compacto",card_max_items:"M\xE1x. elementos (0 = todos)",action_error:"Acci\xF3n fallida. Int\xE9ntelo de nuevo.",area_id_optional:"\xC1rea (opcional)",installation_date_optional:"Fecha de instalaci\xF3n (opcional)",custom_icon_optional:"Icono (opcional, ej. mdi:wrench)",task_enabled:"Tarea habilitada",skip_reason_prompt:"\xBFOmitir esta tarea?",reason_optional:"Motivo (opcional)",reset_date_prompt:"\xBFRestablecer esta tarea?",reset_date_optional:"Nueva fecha (opcional)",notes_label:"Notas",documentation_label:"Documentaci\xF3n",no_nfc_tag:"\u2014 Sin etiqueta \u2014",dashboard:"Panel",settings:"Ajustes",settings_features:"Funciones avanzadas",settings_features_desc:"Active o desactive funciones avanzadas. Desactivar las oculta de la interfaz pero no elimina datos.",feat_adaptive:"Planificaci\xF3n adaptativa",feat_adaptive_desc:"Aprender intervalos \xF3ptimos del historial de mantenimiento",feat_predictions:"Predicciones de sensor",feat_predictions_desc:"Predecir fechas de activaci\xF3n por degradaci\xF3n del sensor",feat_seasonal:"Ajustes estacionales",feat_seasonal_desc:"Ajustar intervalos seg\xFAn patrones estacionales",feat_environmental:"Correlaci\xF3n ambiental",feat_environmental_desc:"Correlacionar intervalos con temperatura/humedad",feat_budget:"Seguimiento de presupuesto",feat_budget_desc:"Seguir los gastos de mantenimiento mensuales y anuales",feat_groups:"Grupos de tareas",feat_groups_desc:"Organizar tareas en grupos l\xF3gicos",feat_checklists:"Listas de verificaci\xF3n",feat_checklists_desc:"Procedimientos de varios pasos para completar tareas",settings_general:"General",settings_default_warning:"D\xEDas de aviso predeterminados",settings_panel_enabled:"Panel lateral",settings_notifications:"Notificaciones",settings_notify_service:"Servicio de notificaci\xF3n",settings_notify_due_soon:"Notificar cuando est\xE9 pr\xF3xima",settings_notify_overdue:"Notificar cuando est\xE9 vencida",settings_notify_triggered:"Notificar cuando se active",settings_interval_hours:"Intervalo de repetici\xF3n (horas, 0 = una vez)",settings_quiet_hours:"Horas de silencio",settings_quiet_start:"Inicio",settings_quiet_end:"Fin",settings_max_per_day:"M\xE1x. notificaciones por d\xEDa (0 = ilimitado)",settings_bundling:"Agrupar notificaciones",settings_bundle_threshold:"Umbral de agrupaci\xF3n",settings_actions:"Botones de acci\xF3n m\xF3viles",settings_action_complete:"Mostrar bot\xF3n 'Completada'",settings_action_skip:"Mostrar bot\xF3n 'Omitir'",settings_action_snooze:"Mostrar bot\xF3n 'Posponer'",settings_snooze_hours:"Duraci\xF3n de posposici\xF3n (horas)",settings_budget:"Presupuesto",settings_currency:"Moneda",settings_budget_monthly:"Presupuesto mensual",settings_budget_yearly:"Presupuesto anual",settings_budget_alerts:"Alertas de presupuesto",settings_budget_threshold:"Umbral de alerta (%)",settings_import_export:"Importar / Exportar",settings_export_json:"Exportar JSON",settings_export_csv:"Exportar CSV",settings_import_csv:"Importar CSV",settings_import_placeholder:"Pegue el contenido JSON o CSV aqu\xED\u2026",settings_import_btn:"Importar",settings_import_success:"{count} objetos importados correctamente.",settings_export_success:"Exportaci\xF3n descargada.",settings_saved:"Ajuste guardado.",settings_include_history:"Incluir historial"},ii={maintenance:"Manuten\xE7\xE3o",objects:"Objetos",tasks:"Tarefas",overdue:"Atrasada",due_soon:"Pr\xF3xima",triggered:"Acionada",ok:"OK",all:"Todos",new_object:"+ Novo objeto",edit:"Editar",delete:"Eliminar",add_task:"+ Tarefa",complete:"Conclu\xEDda",completed:"Conclu\xEDda",skip:"Saltar",skipped:"Saltada",reset:"Repor",cancel:"Cancelar",completing:"A concluir\u2026",interval:"Intervalo",warning:"Aviso",last_performed:"\xDAltima execu\xE7\xE3o",next_due:"Pr\xF3ximo vencimento",days_until_due:"Dias at\xE9 vencimento",avg_duration:"\xD8 Dura\xE7\xE3o",trigger:"Acionador",trigger_type:"Tipo de acionador",threshold_above:"Limite superior",threshold_below:"Limite inferior",threshold:"Limiar",counter:"Contador",state_change:"Mudan\xE7a de estado",runtime:"Tempo de funcionamento",runtime_hours:"Dura\xE7\xE3o alvo (horas)",target_value:"Valor alvo",baseline:"Linha de base",target_changes:"Altera\xE7\xF5es alvo",for_minutes:"Durante (minutos)",time_based:"Temporal",sensor_based:"Sensor",manual:"Manual",cleaning:"Limpeza",inspection:"Inspe\xE7\xE3o",replacement:"Substitui\xE7\xE3o",calibration:"Calibra\xE7\xE3o",service:"Servi\xE7o",custom:"Personalizado",history:"Hist\xF3rico",cost:"Custo",duration:"Dura\xE7\xE3o",both:"Ambos",trigger_val:"Valor do acionador",complete_title:"Conclu\xEDda: ",checklist:"Lista de verifica\xE7\xE3o",notes_optional:"Notas (opcional)",cost_optional:"Custo (opcional)",duration_minutes:"Dura\xE7\xE3o em minutos (opcional)",days:"dias",day:"dia",today:"Hoje",d_overdue:"d em atraso",no_tasks:"Sem tarefas de manuten\xE7\xE3o. Crie um objeto para come\xE7ar.",no_tasks_short:"Sem tarefas",no_history:"Sem entradas no hist\xF3rico.",show_all:"Mostrar tudo",cost_duration_chart:"Custos & Dura\xE7\xE3o",installed:"Instalado",confirm_delete_object:"Eliminar este objeto e todas as suas tarefas?",confirm_delete_task:"Eliminar esta tarefa?",min:"M\xEDn",max:"M\xE1x",save:"Guardar",saving:"A guardar\u2026",edit_task:"Editar tarefa",new_task:"Nova tarefa de manuten\xE7\xE3o",task_name:"Nome da tarefa",maintenance_type:"Tipo de manuten\xE7\xE3o",schedule_type:"Tipo de agendamento",interval_days:"Intervalo (dias)",warning_days:"Dias de aviso",interval_anchor:"\xC2ncora do intervalo",anchor_completion:"A partir da data de conclus\xE3o",anchor_planned:"A partir da data planeada (sem desvio)",edit_object:"Editar objeto",name:"Nome",manufacturer_optional:"Fabricante (opcional)",model_optional:"Modelo (opcional)",trigger_configuration:"Configura\xE7\xE3o do acionador",entity_id:"ID da entidade",comma_separated:"separados por v\xEDrgulas",entity_logic:"L\xF3gica da entidade",entity_logic_any:"Qualquer entidade aciona",entity_logic_all:"Todas as entidades devem acionar",entities:"entidades",attribute_optional:"Atributo (opcional, vazio = estado)",use_entity_state:"Usar estado da entidade (sem atributo)",trigger_above:"Acionar acima de",trigger_below:"Acionar abaixo de",for_at_least_minutes:"Durante pelo menos (minutos)",safety_interval_days:"Intervalo de seguran\xE7a (dias, opcional)",delta_mode:"Modo delta",from_state_optional:"Do estado (opcional)",to_state_optional:"Para o estado (opcional)",documentation_url_optional:"URL de documenta\xE7\xE3o (opcional)",nfc_tag_id_optional:"ID da etiqueta NFC (opcional)",nfc_tag_id:"ID da etiqueta NFC",nfc_linked:"Etiqueta NFC associada",nfc_link_hint:"Clique para associar etiqueta NFC",responsible_user:"Utilizador respons\xE1vel",no_user_assigned:"(Nenhum utilizador atribu\xEDdo)",all_users:"Todos os utilizadores",my_tasks:"As minhas tarefas",budget_monthly:"Or\xE7amento mensal",budget_yearly:"Or\xE7amento anual",groups:"Grupos",loading_chart:"A carregar dados...",was_maintenance_needed:"Esta manuten\xE7\xE3o era necess\xE1ria?",feedback_needed:"Necess\xE1ria",feedback_not_needed:"N\xE3o necess\xE1ria",feedback_not_sure:"N\xE3o tenho a certeza",suggested_interval:"Intervalo sugerido",apply_suggestion:"Aplicar",dismiss_suggestion:"Descartar",confidence_low:"Baixa",confidence_medium:"M\xE9dia",confidence_high:"Alta",recommended:"recomendado",seasonal_awareness:"Consci\xEAncia sazonal",seasonal_chart_title:"Fatores sazonais",seasonal_learned:"Aprendido",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Fev",month_mar:"Mar",month_apr:"Abr",month_may:"Mai",month_jun:"Jun",month_jul:"Jul",month_aug:"Ago",month_sep:"Set",month_oct:"Out",month_nov:"Nov",month_dec:"Dez",sensor_prediction:"Previs\xE3o do sensor",degradation_trend:"Tend\xEAncia",trend_rising:"A subir",trend_falling:"A descer",trend_stable:"Est\xE1vel",trend_insufficient_data:"Dados insuficientes",days_until_threshold:"Dias at\xE9 ao limiar",threshold_exceeded:"Limiar ultrapassado",environmental_adjustment:"Fator ambiental",sensor_prediction_urgency:"O sensor prev\xEA o limiar em ~{days} dias",day_short:"dia",weibull_reliability_curve:"Curva de fiabilidade",weibull_failure_probability:"Probabilidade de falha",weibull_r_squared:"Ajuste R\xB2",beta_early_failures:"Falhas precoces",beta_random_failures:"Falhas aleat\xF3rias",beta_wear_out:"Desgaste",beta_highly_predictable:"Altamente previs\xEDvel",confidence_interval:"Intervalo de confian\xE7a",confidence_conservative:"Conservador",confidence_aggressive:"Otimista",current_interval_marker:"Intervalo atual",recommended_marker:"Recomendado",characteristic_life:"Vida caracter\xEDstica",chart_mini_sparkline:"Sparkline de tend\xEAncia",chart_history:"Hist\xF3rico de custos e dura\xE7\xE3o",chart_seasonal:"Fatores sazonais, 12 meses",chart_weibull:"Curva de fiabilidade Weibull",chart_sparkline:"Gr\xE1fico de valor do acionador",days_progress:"Progresso em dias",qr_code:"C\xF3digo QR",qr_generating:"A gerar c\xF3digo QR\u2026",qr_error:"N\xE3o foi poss\xEDvel gerar o c\xF3digo QR.",qr_error_no_url:"Nenhum URL do HA configurado. Defina um URL externo ou interno em Defini\xE7\xF5es \u2192 Sistema \u2192 Rede.",save_error:"Erro ao guardar. Tente novamente.",qr_print:"Imprimir",qr_download:"Transferir SVG",qr_action:"A\xE7\xE3o ao digitalizar",qr_action_view:"Ver informa\xE7\xF5es de manuten\xE7\xE3o",qr_action_complete:"Marcar manuten\xE7\xE3o como conclu\xEDda",qr_url_mode:"Tipo de liga\xE7\xE3o",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"URL do servidor",overview:"Vis\xE3o geral",analysis:"An\xE1lise",recent_activities:"Atividades recentes",search_notes:"Pesquisar notas",avg_cost:"\xD8 Custo",no_advanced_features:"Sem fun\xE7\xF5es avan\xE7adas ativadas",no_advanced_features_hint:"Ative \u201CIntervalos Adaptativos\u201D ou \u201CPadr\xF5es Sazonais\u201D nas defini\xE7\xF5es da integra\xE7\xE3o para ver dados de an\xE1lise aqui.",analysis_not_enough_data:"Ainda n\xE3o h\xE1 dados suficientes para a an\xE1lise.",analysis_not_enough_data_hint:"A an\xE1lise Weibull requer pelo menos 5 manuten\xE7\xF5es conclu\xEDdas; os padr\xF5es sazonais tornam-se vis\xEDveis ap\xF3s 6+ pontos de dados por m\xEAs.",analysis_manual_task_hint:"Tarefas manuais sem intervalo n\xE3o geram dados de an\xE1lise.",completions:"conclus\xF5es",current:"Atual",shorter:"Mais curto",longer:"Mais longo",normal:"Normal",disabled:"Desativado",compound_logic:"L\xF3gica composta",card_title:"T\xEDtulo",card_show_header:"Mostrar cabe\xE7alho com estat\xEDsticas",card_show_actions:"Mostrar bot\xF5es de a\xE7\xE3o",card_compact:"Modo compacto",card_max_items:"M\xE1x. itens (0 = todos)",action_error:"A\xE7\xE3o falhada. Tente novamente.",area_id_optional:"\xC1rea (opcional)",installation_date_optional:"Data de instala\xE7\xE3o (opcional)",custom_icon_optional:"\xCDcone (opcional, ex. mdi:wrench)",task_enabled:"Tarefa ativada",skip_reason_prompt:"Saltar esta tarefa?",reason_optional:"Motivo (opcional)",reset_date_prompt:"Repor esta tarefa?",reset_date_optional:"Nova data (opcional)",notes_label:"Notas",documentation_label:"Documenta\xE7\xE3o",no_nfc_tag:"\u2014 Sem etiqueta \u2014",dashboard:"Painel",settings:"Defini\xE7\xF5es",settings_features:"Fun\xE7\xF5es avan\xE7adas",settings_features_desc:"Ative ou desative fun\xE7\xF5es avan\xE7adas. Desativar oculta-as da interface mas n\xE3o elimina dados.",feat_adaptive:"Agendamento adaptativo",feat_adaptive_desc:"Aprender intervalos ideais a partir do hist\xF3rico de manuten\xE7\xE3o",feat_predictions:"Previs\xF5es do sensor",feat_predictions_desc:"Prever datas de acionamento pela degrada\xE7\xE3o do sensor",feat_seasonal:"Ajustes sazonais",feat_seasonal_desc:"Ajustar intervalos com base em padr\xF5es sazonais",feat_environmental:"Correla\xE7\xE3o ambiental",feat_environmental_desc:"Correlacionar intervalos com temperatura/humidade",feat_budget:"Controlo de or\xE7amento",feat_budget_desc:"Acompanhar despesas de manuten\xE7\xE3o mensais e anuais",feat_groups:"Grupos de tarefas",feat_groups_desc:"Organizar tarefas em grupos l\xF3gicos",feat_checklists:"Listas de verifica\xE7\xE3o",feat_checklists_desc:"Procedimentos com v\xE1rios passos para conclus\xE3o de tarefas",settings_general:"Geral",settings_default_warning:"Dias de aviso predefinidos",settings_panel_enabled:"Painel lateral",settings_notifications:"Notifica\xE7\xF5es",settings_notify_service:"Servi\xE7o de notifica\xE7\xE3o",settings_notify_due_soon:"Notificar quando pr\xF3xima",settings_notify_overdue:"Notificar quando atrasada",settings_notify_triggered:"Notificar quando acionada",settings_interval_hours:"Intervalo de repeti\xE7\xE3o (horas, 0 = uma vez)",settings_quiet_hours:"Horas de sil\xEAncio",settings_quiet_start:"In\xEDcio",settings_quiet_end:"Fim",settings_max_per_day:"M\xE1x. notifica\xE7\xF5es por dia (0 = ilimitado)",settings_bundling:"Agrupar notifica\xE7\xF5es",settings_bundle_threshold:"Limiar de agrupamento",settings_actions:"Bot\xF5es de a\xE7\xE3o m\xF3veis",settings_action_complete:"Mostrar bot\xE3o 'Conclu\xEDda'",settings_action_skip:"Mostrar bot\xE3o 'Saltar'",settings_action_snooze:"Mostrar bot\xE3o 'Adiar'",settings_snooze_hours:"Dura\xE7\xE3o do adiamento (horas)",settings_budget:"Or\xE7amento",settings_currency:"Moeda",settings_budget_monthly:"Or\xE7amento mensal",settings_budget_yearly:"Or\xE7amento anual",settings_budget_alerts:"Alertas de or\xE7amento",settings_budget_threshold:"Limiar de alerta (%)",settings_import_export:"Importar / Exportar",settings_export_json:"Exportar JSON",settings_export_csv:"Exportar CSV",settings_import_csv:"Importar CSV",settings_import_placeholder:"Cole o conte\xFAdo JSON ou CSV aqui\u2026",settings_import_btn:"Importar",settings_import_success:"{count} objetos importados com sucesso.",settings_export_success:"Exporta\xE7\xE3o transferida.",settings_saved:"Defini\xE7\xE3o guardada.",settings_include_history:"Incluir hist\xF3rico"},lt={de:Zt,en:Yt,nl:Qt,fr:Xt,it:ei,es:ti,pt:ii};function s(r,a){let e=(a||"en").substring(0,2).toLowerCase();return lt[e]?.[r]??lt.en[r]??r}function dt(r){let a=(r||"en").substring(0,2).toLowerCase();return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT"}[a]??"en-US"}function Q(r,a){if(!r)return"\u2014";try{return new Date(r).toLocaleDateString(dt(a),{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return r}}function He(r,a){if(!r)return"\u2014";try{let e=dt(a),t=new Date(r);return t.toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}catch{return r}}function we(r,a){if(r==null)return"\u2014";let e=a||"en";return r<0?`${Math.abs(r)} ${s("d_overdue",e)}`:r===0?s("today",e):`${r} ${s(r===1?"day":"days",e)}`}function ae(r,a){r.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:a},bubbles:!0,composed:!0}))}var ut=N`
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
`;var pt=N`
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
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--app-header-background-color, var(--primary-color));
    color: var(--app-header-text-color, white);
    padding: 12px 16px;
    font-size: 16px;
  }

  .header ha-icon-button {
    --mdc-icon-button-size: 36px;
    --mdc-icon-size: 20px;
    color: var(--app-header-text-color, white);
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
  .analysis-empty-state .empty-icon {
    --mdc-icon-size: 48px;
    color: var(--secondary-text-color);
    opacity: 0.4;
    display: block;
    margin: 0 auto 12px;
  }
  .empty-hint { color: var(--secondary-text-color); font-size: 13px; margin: 4px 0; }
  .analysis-progress {
    width: 120px; margin: 12px auto 4px; height: 6px;
    background: var(--divider-color, #e0e0e0); border-radius: 3px; overflow: hidden;
  }
  .analysis-progress-bar {
    height: 100%; background: var(--primary-color); border-radius: 3px;
  }

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

  .nfc-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 3px 8px;
    margin-left: 6px;
    background: var(--secondary-background-color, #e8e8e8);
    color: var(--primary-text-color);
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }
  .nfc-badge ha-icon {
    --mdc-icon-size: 14px;
  }
  .nfc-badge.unlinked {
    opacity: 0.4;
    cursor: pointer;
    border: 1px dashed var(--divider-color);
    background: transparent;
  }
  .nfc-badge.unlinked:hover {
    opacity: 0.7;
  }

  .task-header-actions {
    display: flex;
    gap: 8px;
  }

  .more-menu-wrapper {
    position: relative;
  }

  .popup-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 100;
    min-width: 180px;
    overflow: hidden;
  }

  .popup-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    cursor: pointer;
    font-size: 14px;
    color: var(--primary-text-color);
  }

  .popup-menu-item:hover {
    background: var(--table-row-alternative-background-color, rgba(0, 0, 0, 0.04));
  }

  .popup-menu-item.danger {
    color: var(--error-color, #f44336);
  }

  .popup-menu-item ha-icon {
    --mdc-icon-size: 18px;
  }

  .popup-menu-divider {
    height: 1px;
    background: var(--divider-color);
    margin: 4px 0;
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

  /* Task meta card (notes + documentation URL) */
  .task-meta-card {
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .task-meta-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 14px;
    color: var(--primary-text-color);
  }

  .task-meta-row ha-icon {
    --mdc-icon-size: 18px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .task-meta-notes {
    white-space: pre-wrap;
    word-break: break-word;
  }

  .task-meta-link a {
    color: var(--primary-color);
    text-decoration: none;
  }

  .task-meta-link a:hover {
    text-decoration: underline;
  }

  /* ── Responsive: :host([narrow]) (HA sets narrow on mobile/companion) ── */

  :host([narrow]) .content {
    padding: 0 8px 8px;
  }

  :host([narrow]) .header {
    padding: 8px 12px;
    font-size: 14px;
  }

  :host([narrow]) .kpi-bar {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  :host([narrow]) .kpi-card {
    padding: 12px 8px;
  }

  :host([narrow]) .kpi-label {
    font-size: 10px;
  }

  :host([narrow]) .kpi-value {
    font-size: 14px;
  }

  :host([narrow]) .kpi-value-large {
    font-size: 18px;
  }

  :host([narrow]) .two-column-layout {
    grid-template-columns: 1fr;
  }

  :host([narrow]) .tab {
    padding: 12px 16px;
    font-size: 14px;
  }

  :host([narrow]) .task-header {
    flex-direction: column;
    align-items: flex-start;
  }

  :host([narrow]) .task-header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  :host([narrow]) .filter-bar {
    flex-wrap: wrap;
  }

  :host([narrow]) .filter-bar select {
    flex: 1;
    min-width: 0;
  }

  :host([narrow]) .task-row {
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
  }

  :host([narrow]) .cell.type { display: none; }
  :host([narrow]) .cell.object-name { min-width: auto; }
  :host([narrow]) .cell.task-name { flex-basis: 100%; order: -1; }

  :host([narrow]) .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }

  :host([narrow]) .info-grid {
    grid-template-columns: 1fr;
  }

  :host([narrow]) .history-filters-new {
    flex-direction: column;
  }

  :host([narrow]) .search-input {
    min-width: 0;
    width: 100%;
  }

  :host([narrow]) .cost-duration-card {
    padding: 12px;
  }

  :host([narrow]) .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  :host([narrow]) .toggle-buttons {
    width: 100%;
  }

  :host([narrow]) .toggle-btn {
    flex: 1;
    padding: 8px;
    font-size: 12px;
  }

  :host([narrow]) .activity-item {
    flex-wrap: wrap;
  }

  :host([narrow]) .activity-date {
    min-width: auto;
  }

  :host([narrow]) .activity-note {
    flex-basis: 100%;
    white-space: normal;
  }

  :host([narrow]) .popup-menu {
    right: auto;
    left: 0;
    min-width: 160px;
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

  /* ── Responsive: @media fallback (when narrow attr not set) ── */
  @media (max-width: 768px) {
    .content { padding: 0 8px 8px; }
    .header { padding: 8px 12px; font-size: 14px; }
    .kpi-bar { grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px; }
    .kpi-card { padding: 12px 8px; }
    .kpi-label { font-size: 10px; }
    .kpi-value { font-size: 14px; }
    .kpi-value-large { font-size: 18px; }
    .two-column-layout { grid-template-columns: 1fr; }
    .tab { padding: 12px 16px; font-size: 14px; }
    .task-header { flex-direction: column; align-items: flex-start; }
    .task-header-actions { width: 100%; justify-content: flex-start; }
    .filter-bar { flex-wrap: wrap; }
    .filter-bar select { flex: 1; min-width: 0; }
    .task-row { flex-wrap: wrap; gap: 8px; padding: 12px; }
    .cell.type { display: none; }
    .cell.object-name { min-width: auto; }
    .cell.task-name { flex-basis: 100%; order: -1; }
    .detail-header { flex-direction: column; align-items: flex-start; }
    .info-grid { grid-template-columns: 1fr; }
    .history-filters-new { flex-direction: column; }
    .search-input { min-width: 0; width: 100%; }
    .cost-duration-card { padding: 12px; }
    .card-header { flex-direction: column; align-items: flex-start; gap: 8px; }
    .toggle-buttons { width: 100%; }
    .toggle-btn { flex: 1; padding: 8px; font-size: 12px; }
    .activity-item { flex-wrap: wrap; }
    .activity-date { min-width: auto; }
    .activity-note { flex-basis: 100%; white-space: normal; }
    .popup-menu { right: auto; left: 0; min-width: 160px; }
  }

  /* ha-button handles variant="danger" natively */

  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--error-color, #f44336);
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
    animation: toast-in .3s ease;
  }
  @keyframes toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(16px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;var ke=class{constructor(a){this._cache=new Map;this._pending=new Map;this._hass=a}updateHass(a){this._hass=a}async getDetailStats(a,e){return this._getStats(a,"hour",30,e)}async getMiniStats(a,e){return this._getStats(a,"day",14,e)}async getBatchMiniStats(a){let e=new Map,t=[];for(let p of a){let g=`${p.entityId}:day`,m=this._cache.get(g);m&&Date.now()-m.fetchedAt<3e5?e.set(p.entityId,m.points):t.push(p)}if(t.length===0)return e;let i=t.filter(p=>p.isCounter).map(p=>p.entityId),n=t.filter(p=>!p.isCounter).map(p=>p.entityId),o=new Date(Date.now()-336*60*60*1e3).toISOString(),d=[];return i.length>0&&d.push(this._fetchBatch(i,"day",o,["state","sum","change"],!0,e)),n.length>0&&d.push(this._fetchBatch(n,"day",o,["mean","min","max"],!1,e)),await Promise.all(d),e}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(a,e,t,i){let n=`${a}:${e}`,o=this._cache.get(n);if(o&&Date.now()-o.fetchedAt<3e5)return o.points;if(this._pending.has(n))return this._pending.get(n);let d=this._fetchAndNormalize(a,e,t,i,n);this._pending.set(n,d);try{return await d}finally{this._pending.delete(n)}}async _fetchAndNormalize(a,e,t,i,n){let o=new Date(Date.now()-t*24*60*60*1e3).toISOString(),d=i?["state","sum","change"]:["mean","min","max"];try{let g=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:o,statistic_ids:[a],period:e,types:d}))[a]||[],m=this._normalizeRows(g,i);return this._cache.set(n,{entityId:a,fetchedAt:Date.now(),period:e,points:m}),m}catch(p){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${a}:`,p),[]}}async _fetchBatch(a,e,t,i,n,o){try{let d=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:t,statistic_ids:a,period:e,types:i});for(let p of a){let g=d[p]||[],m=this._normalizeRows(g,n);o.set(p,m),this._cache.set(`${p}:${e}`,{entityId:p,fetchedAt:Date.now(),period:e,points:m})}}catch(d){console.warn("[maintenance-supporter] Batch statistics fetch failed:",d)}}_normalizeRows(a,e){let t=[];for(let i of a){let n=null;if(e?n=i.state??null:n=i.mean??null,n===null)continue;let o={ts:i.start,val:n};e||(i.min!=null&&(o.min=i.min),i.max!=null&&(o.max=i.max)),t.push(o)}return t.sort((i,n)=>i.ts-n.ts),t}};var re=class{constructor(a){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=a}updateHass(a){this.hass=a}async getUsers(a=!1){let e=Date.now();if(!a&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(a,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:a,task_id:e,user_id:t})}async getTasksByUser(a){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:a})).tasks}getUserName(a){return!a||!this.usersCache?null:this.usersCache.find(t=>t.id===a)?.name||null}getUser(a){return!a||!this.usersCache?null:this.usersCache.find(e=>e.id===a)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(a){return a?a===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};var O=class extends F{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._areaId="";this._installationDate="";this._entryId=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._areaId="",this._installationDate="",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._error="",this._open=!0}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,area_id:this._areaId||null,installation_date:this._installationDate||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,area_id:this._areaId||null,installation_date:this._installationDate||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch{this._error=s("save_error",this._lang)}finally{this._loading=!1}}}_close(){this._open=!1}render(){if(!this._open)return l``;let e=this._lang,t=this._entryId?s("edit_object",e):s("new_object",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:c}
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
          <ha-textfield
            label="${s("area_id_optional",e)}"
            .value=${this._areaId}
            @input=${i=>this._areaId=i.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${s("installation_date_optional",e)}"
            type="date"
            .value=${this._installationDate}
            @input=${i=>this._installationDate=i.target.value}
          ></ha-textfield>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?s("saving",this._lang):s("save",this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};O.styles=N`
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
    ha-textfield {
      display: block;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
  `,u([S({attribute:!1})],O.prototype,"hass",2),u([_()],O.prototype,"_open",2),u([_()],O.prototype,"_loading",2),u([_()],O.prototype,"_error",2),u([_()],O.prototype,"_name",2),u([_()],O.prototype,"_manufacturer",2),u([_()],O.prototype,"_model",2),u([_()],O.prototype,"_areaId",2),u([_()],O.prototype,"_installationDate",2),u([_()],O.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",O);var ai=["cleaning","inspection","replacement","calibration","service","custom"],ni=["time_based","sensor_based","manual"],si=["threshold","counter","state_change","runtime"],$=class extends F{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._warningDays="7";this._intervalAnchor="completion";this._notes="";this._documentationUrl="";this._customIcon="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._nfcTagId="";this._availableTags=[];this._responsibleUserId=null;this._availableUsers=[];this._userService=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}async openCreate(e){this._entryId=e,this._taskId=null,this._error="",this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}async openEdit(e,t){if(this._entryId=e,this._taskId=t.id,this._error="",this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days?.toString()||"30",this._warningDays=t.warning_days.toString(),this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._enabled=t.enabled!==!1,this._nfcTagId=t.nfc_tag_id||"",this._responsibleUserId=t.responsible_user_id||null,t.trigger_config){let i=t.trigger_config;this._triggerEntityId=i.entity_id||"",this._triggerEntityIds=i.entity_ids||(i.entity_id?[i.entity_id]:[]),this._triggerEntityLogic=i.entity_logic||"any",this._triggerAttribute=i.attribute||"",this._triggerType=i.type||"threshold",this._triggerAbove=i.trigger_above?.toString()||"",this._triggerBelow=i.trigger_below?.toString()||"",this._triggerForMinutes=i.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=i.trigger_target_value?.toString()||"",this._triggerDeltaMode=i.trigger_delta_mode||!1,this._triggerFromState=i.trigger_from_state||"",this._triggerToState=i.trigger_to_state||"",this._triggerTargetChanges=i.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=i.trigger_runtime_hours?.toString()||""}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._warningDays="7",this._intervalAnchor="completion",this._notes="",this._documentationUrl="",this._customIcon="",this._enabled=!0,this._nfcTagId="",this._responsibleUserId=null,this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours=""}async _loadUsers(){this._userService||(this._userService=new re(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=t.domain||"",this._suggestedAttributes=t.suggested_attributes||[],this._availableAttributes=t.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:parseInt(this._warningDays,10)||7};if(this._taskId&&(e.task_id=this._taskId),this._scheduleType!=="manual"?this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_anchor=this._intervalAnchor):this._taskId&&(e.interval_days=null,e.interval_anchor="completion"):this._taskId&&(e.interval_days=null,e.interval_anchor="completion"),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.enabled=this._enabled,e.nfc_tag_id=this._nfcTagId||null,e.responsible_user_id=this._responsibleUserId,this._scheduleType==="sensor_based"&&this._triggerEntityId){let t=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],i={entity_id:t[0],entity_ids:t,type:this._triggerType};if(this._triggerAttribute&&(i.attribute=this._triggerAttribute),t.length>1&&(i.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let n=parseFloat(this._triggerAbove);isNaN(n)||(i.trigger_above=n)}if(this._triggerBelow){let n=parseFloat(this._triggerBelow);isNaN(n)||(i.trigger_below=n)}if(this._triggerForMinutes){let n=parseInt(this._triggerForMinutes,10);isNaN(n)||(i.trigger_for_minutes=n)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let n=parseFloat(this._triggerTargetValue);isNaN(n)||(i.trigger_target_value=n)}i.trigger_delta_mode=this._triggerDeltaMode}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(i.trigger_from_state=this._triggerFromState),this._triggerToState&&(i.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let n=parseInt(this._triggerTargetChanges,10);isNaN(n)||(i.trigger_target_changes=n)}}else if(this._triggerType==="runtime"&&this._triggerRuntimeHours){let n=parseFloat(this._triggerRuntimeHours);isNaN(n)||(i.trigger_runtime_hours=n)}e.trigger_config=i}else this._taskId&&(e.trigger_config=null);await this.hass.connection.sendMessagePromise(e),this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch{this._error=s("save_error",this._lang)}finally{this._loading=!1}}}_close(){this._open=!1}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return c;let e=this._lang;return l`
      <h3>${s("trigger_configuration",e)}</h3>
      <ha-textfield
        label="${s("entity_id",e)} (${s("comma_separated",e)})"
        .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
        @input=${t=>{let n=t.target.value.split(",").map(o=>o.trim()).filter(Boolean);this._triggerEntityId=n[0]||"",this._triggerEntityIds=n,n[0]&&this._fetchEntityAttributes(n[0])}}
      ></ha-textfield>
      ${this._triggerEntityIds.length>1?l`
        <div class="select-row">
          <label>${s("entity_logic",e)}</label>
          <select
            .value=${this._triggerEntityLogic}
            @change=${t=>this._triggerEntityLogic=t.target.value}
          >
            <option value="any">${s("entity_logic_any",e)}</option>
            <option value="all">${s("entity_logic_all",e)}</option>
          </select>
        </div>
      `:c}
      ${this._availableAttributes.length>0?l`
          <div class="select-row">
            <label>${s("attribute_optional",e)}</label>
            <select
              .value=${this._triggerAttribute}
              @change=${t=>this._triggerAttribute=t.target.value}
            >
              <option value="">${s("use_entity_state",e)}</option>
              ${this._suggestedAttributes.map(t=>l`<option value=${t}>${t} ★</option>`)}
              ${this._availableAttributes.filter(t=>!this._suggestedAttributes.includes(t.name)).map(t=>l`<option value=${t.name}>${t.name}${t.numeric?"":" (non-numeric)"}</option>`)}
            </select>
          </div>
        `:l`
          <ha-textfield
            label="${s("attribute_optional",e)}"
            .value=${this._triggerAttribute}
            @input=${t=>this._triggerAttribute=t.target.value}
          ></ha-textfield>
        `}
      <div class="select-row">
        <label>${s("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${t=>this._triggerType=t.target.value}
        >
          ${si.map(t=>l`<option value=${t}>${s(t,e)}</option>`)}
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
      `:this._triggerType==="runtime"?l`
        <ha-textfield
          label="${s("runtime_hours",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${t=>this._triggerRuntimeHours=t.target.value}
        ></ha-textfield>
      `:c}render(){if(!this._open)return l``;let e=this._lang,t=this._taskId?s("edit_task",e):s("new_task",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:c}
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
              ${ai.map(i=>l`<option value=${i}>${s(i,e)}</option>`)}
            </select>
          </div>
          <div class="select-row">
            <label>${s("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${i=>this._scheduleType=i.target.value}
            >
              ${ni.map(i=>l`<option value=${i}>${s(i,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?l`
                <ha-textfield
                  label="${s("interval_days",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${i=>this._intervalDays=i.target.value}
                ></ha-textfield>
                <div class="select-row">
                  <label>${s("interval_anchor",e)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${i=>this._intervalAnchor=i.target.value}
                  >
                    <option value="completion">${s("anchor_completion",e)}</option>
                    <option value="planned">${s("anchor_planned",e)}</option>
                  </select>
                </div>
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
              @change=${i=>{let n=i.target.value;this._responsibleUserId=n||null}}
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
          <ha-textfield
            label="${s("custom_icon_optional",e)}"
            .value=${this._customIcon}
            @input=${i=>this._customIcon=i.target.value}
          ></ha-textfield>
          ${this._availableTags.length>0?l`
              <div class="select-row">
                <label>${s("nfc_tag_id_optional",e)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${i=>this._nfcTagId=i.target.value}
                >
                  <option value="">${s("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(i=>l`<option value=${i.id}>${i.name}</option>`)}
                </select>
              </div>
            `:l`
              <ha-textfield
                label="${s("nfc_tag_id_optional",e)}"
                .value=${this._nfcTagId}
                @input=${i=>this._nfcTagId=i.target.value}
              ></ha-textfield>
            `}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${i=>this._enabled=i.target.checked}
            />
            ${s("task_enabled",e)}
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${s("cancel",e)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?s("saving",e):s("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};$.styles=N`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 350px;
      max-height: 70vh;
      overflow-y: auto;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
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
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
    }
  `,u([S({attribute:!1})],$.prototype,"hass",2),u([_()],$.prototype,"_open",2),u([_()],$.prototype,"_loading",2),u([_()],$.prototype,"_error",2),u([_()],$.prototype,"_entryId",2),u([_()],$.prototype,"_taskId",2),u([_()],$.prototype,"_name",2),u([_()],$.prototype,"_type",2),u([_()],$.prototype,"_scheduleType",2),u([_()],$.prototype,"_intervalDays",2),u([_()],$.prototype,"_warningDays",2),u([_()],$.prototype,"_intervalAnchor",2),u([_()],$.prototype,"_notes",2),u([_()],$.prototype,"_documentationUrl",2),u([_()],$.prototype,"_customIcon",2),u([_()],$.prototype,"_enabled",2),u([_()],$.prototype,"_triggerEntityId",2),u([_()],$.prototype,"_triggerEntityIds",2),u([_()],$.prototype,"_triggerEntityLogic",2),u([_()],$.prototype,"_triggerAttribute",2),u([_()],$.prototype,"_triggerType",2),u([_()],$.prototype,"_triggerAbove",2),u([_()],$.prototype,"_triggerBelow",2),u([_()],$.prototype,"_triggerForMinutes",2),u([_()],$.prototype,"_triggerTargetValue",2),u([_()],$.prototype,"_triggerDeltaMode",2),u([_()],$.prototype,"_triggerFromState",2),u([_()],$.prototype,"_triggerToState",2),u([_()],$.prototype,"_triggerTargetChanges",2),u([_()],$.prototype,"_triggerRuntimeHours",2),u([_()],$.prototype,"_suggestedAttributes",2),u([_()],$.prototype,"_availableAttributes",2),u([_()],$.prototype,"_entityDomain",2),u([_()],$.prototype,"_nfcTagId",2),u([_()],$.prototype,"_availableTags",2),u([_()],$.prototype,"_responsibleUserId",2),u([_()],$.prototype,"_availableUsers",2);customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",$);var j=class extends F{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed"}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState={},this._feedback="needed")}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),await this.hass.connection.sendMessagePromise(e),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch{this._error=s("save_error",this.lang)}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return l``;let e=this.lang||this.hass?.language||"en";return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("complete_title",e)}${this.taskName}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:c}
          ${this.checklist.length>0?l`
            <div class="checklist-section">
              <label class="checklist-label">${s("checklist",e)}</label>
              ${this.checklist.map((t,i)=>l`
                <label class="checklist-item" @click=${()=>this._toggleCheck(i)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(i)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:c}
          <ha-textfield
            label="${s("notes_optional",e)}"
            .value=${this._notes}
            @input=${t=>this._notes=t.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${s("cost_optional",e)}"
            type="number"
            step="0.01"
            .value=${this._cost}
            @input=${t=>this._cost=t.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${s("duration_minutes",e)}"
            type="number"
            .value=${this._duration}
            @input=${t=>this._duration=t.target.value}
          ></ha-textfield>
          ${this.adaptiveEnabled?l`
            <div class="feedback-section">
              <label class="feedback-label">${s("was_maintenance_needed",e)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${s("feedback_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${s("feedback_not_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${s("feedback_not_sure",e)}</button>
              </div>
            </div>
          `:c}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading}
          >
            ${this._loading?s("completing",e):s("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};j.styles=N`
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
  `,u([S({attribute:!1})],j.prototype,"hass",2),u([S()],j.prototype,"entryId",2),u([S()],j.prototype,"taskId",2),u([S()],j.prototype,"taskName",2),u([S()],j.prototype,"lang",2),u([S({type:Array})],j.prototype,"checklist",2),u([S({type:Boolean})],j.prototype,"adaptiveEnabled",2),u([_()],j.prototype,"_open",2),u([_()],j.prototype,"_notes",2),u([_()],j.prototype,"_cost",2),u([_()],j.prototype,"_duration",2),u([_()],j.prototype,"_loading",2),u([_()],j.prototype,"_error",2),u([_()],j.prototype,"_checklistState",2),u([_()],j.prototype,"_feedback",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",j);function oe(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function _t(r){return!r.startsWith("data:image/svg+xml,")&&!r.startsWith("data:image/png;base64,")?"":oe(r)}function ri(r){return r.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var V=class extends F{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(e,t,i,n){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=n,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...t,action:"view"})];this._taskId&&i.push(this.hass.connection.sendMessagePromise({...t,action:"complete"}));let n=await Promise.all(i);if(e!==this._generateSeq)return;this._viewResult=n[0],n.length>1&&(this._completeResult=n[1])}catch(t){if(e!==this._generateSeq)return;let i=t?.code,n=t?.message;this._error=i==="no_url"||typeof n=="string"&&n.includes("No Home Assistant URL")?s("qr_error_no_url",this.lang):s("qr_error",this.lang)}finally{e===this._generateSeq&&(this._loading=!1)}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),n=window.open("","_blank","width=600,height=500");if(!n)return;let o=this.lang||"en",d=oe(t),p=oe(i),g=!!this._completeResult,m=oe(s("qr_action_view",o)),v=oe(s("qr_action_complete",o));n.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${d}</title>
<style>
  body{font-family:sans-serif;text-align:center;padding:20px}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  .qr-row{display:flex;justify-content:center;gap:24px;margin:12px 0}
  .qr-col{display:flex;flex-direction:column;align-items:center;gap:6px}
  .qr-col img{width:${g?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${d}</h2>
${p?`<div class="sub">${p}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${_t(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${m}</div>
  </div>
  ${g?`<div class="qr-col">
    <img src="${_t(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${v}</div>
  </div>`:""}
</div>
<div class="url">${oe(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),n.document.close()}_downloadSvg(e,t){let i=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),n=new Blob([i],{type:"image/svg+xml"}),o=URL.createObjectURL(n),d=document.createElement("a");d.href=o;let p=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;d.download=`qr-${ri(p)}-${t}.svg`,d.click(),URL.revokeObjectURL(o)}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return l``;let e=this.lang||this.hass?.language||"en",t=this._taskName?`${s("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",e)}: ${this._objectName}`,i=!!this._viewResult;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._loading?l`<div class="loading">${s("qr_generating",e)}</div>`:this._error?l`<div class="error">${this._error}</div>`:i?l`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${s("qr_action_view",e)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${s("qr_download",e)}
                        </button>
                      </div>
                      ${this._completeResult?l`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${s("qr_action_complete",e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${s("qr_download",e)}
                              </button>
                            </div>
                          `:c}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:c}
          <div class="action-row">
            <label>${s("qr_url_mode",e)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${s("qr_mode_companion",e)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${s("qr_mode_local",e)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${s("qr_mode_server",e)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!i}
          >
            ${s("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};V.styles=N`
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
  `,u([S({attribute:!1})],V.prototype,"hass",2),u([S()],V.prototype,"lang",2),u([_()],V.prototype,"_open",2),u([_()],V.prototype,"_loading",2),u([_()],V.prototype,"_error",2),u([_()],V.prototype,"_viewResult",2),u([_()],V.prototype,"_completeResult",2),u([_()],V.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",V);var U=class extends F{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel="",this._inputType="",this._inputValue="",this._open=!0,new Promise(t=>{this._resolve=t,this._promptResolve=null})}prompt(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"text",this._inputValue=e.inputValue||"",this._open=!0,new Promise(t=>{this._promptResolve=t,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return c;let e=this.hass?.language||"en";return l`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel?l`
            <ha-textfield
              label="${this._inputLabel}"
              type="${this._inputType}"
              .value=${this._inputValue}
              @input=${t=>this._inputValue=t.target.value}
            ></ha-textfield>
          `:c}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};U.styles=N`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .content {
      padding: 8px 0;
      min-width: 280px;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    ha-textfield {
      display: block;
    }
    ha-button.danger {
      --mdc-theme-primary: var(--error-color, #f44336);
    }
  `,u([S({attribute:!1})],U.prototype,"hass",2),u([_()],U.prototype,"_open",2),u([_()],U.prototype,"_title",2),u([_()],U.prototype,"_message",2),u([_()],U.prototype,"_confirmText",2),u([_()],U.prototype,"_danger",2),u([_()],U.prototype,"_inputLabel",2),u([_()],U.prototype,"_inputType",2),u([_()],U.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",U);var oi=["EUR","USD","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL"],B=class extends F{constructor(){super(...arguments);this.budget=null;this._settings=null;this._loading=!0;this._importCsv="";this._importLoading=!1;this._includeHistory=!0;this._toast="";this._loaded=!1}get _lang(){return this.hass?.language||"en"}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._loaded&&(this._loaded=!0,this._loadSettings())}async _loadSettings(){this._loading=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});this._settings=e}catch{}this._loading=!1}async _updateSetting(e,t){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/update",settings:{[e]:t}});this._settings=i,this._showToast(s("settings_saved",this._lang)),this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(s("action_error",this._lang))}}_showToast(e){this._toast=e,setTimeout(()=>{this._toast=""},3e3)}_downloadFile(e,t,i){let n=new Blob([e],{type:i}),o=URL.createObjectURL(n),d=document.createElement("a");d.href=o,d.download=t,d.click(),URL.revokeObjectURL(o)}render(){let e=this._lang;return this._loading||!this._settings?l`<div class="settings-loading">Loading…</div>`:l`
      ${this._renderFeatures(e)}
      ${this._renderGeneral(e)}
      ${this._settings.general.notifications_enabled?this._renderNotifications(e):c}
      ${this.features.budget?this._renderBudget(e):c}
      ${this._renderImportExport(e)}
      ${this._toast?l`<div class="settings-toast">${this._toast}</div>`:c}
    `}_renderFeatures(e){let t=this._settings.features,i=[{key:"adaptive",settingKey:"advanced_adaptive_visible",label:s("feat_adaptive",e),desc:s("feat_adaptive_desc",e)},{key:"predictions",settingKey:"advanced_predictions_visible",label:s("feat_predictions",e),desc:s("feat_predictions_desc",e)},{key:"seasonal",settingKey:"advanced_seasonal_visible",label:s("feat_seasonal",e),desc:s("feat_seasonal_desc",e)},{key:"environmental",settingKey:"advanced_environmental_visible",label:s("feat_environmental",e),desc:s("feat_environmental_desc",e)},{key:"budget",settingKey:"advanced_budget_visible",label:s("feat_budget",e),desc:s("feat_budget_desc",e)},{key:"groups",settingKey:"advanced_groups_visible",label:s("feat_groups",e),desc:s("feat_groups_desc",e)},{key:"checklists",settingKey:"advanced_checklists_visible",label:s("feat_checklists",e),desc:s("feat_checklists_desc",e)}];return l`
      <div class="settings-section">
        <h3>${s("settings_features",e)}</h3>
        <p class="section-desc">${s("settings_features_desc",e)}</p>
        ${i.map(n=>l`
          <label class="setting-row">
            <span>
              <span class="setting-label">${n.label}</span>
              <span class="setting-desc">${n.desc}</span>
            </span>
            <input type="checkbox" .checked=${t[n.key]}
              @change=${o=>this._updateSetting(n.settingKey,o.target.checked)} />
          </label>
        `)}
      </div>
    `}_renderGeneral(e){let t=this._settings.general;return l`
      <div class="settings-section">
        <h3>${s("settings_general",e)}</h3>
        <label class="setting-row">
          <span class="setting-label">${s("settings_default_warning",e)}</span>
          <input type="number" min="1" max="365" .value=${String(t.default_warning_days)}
            @change=${i=>{let n=parseInt(i.target.value,10);n>=1&&n<=365&&this._updateSetting("default_warning_days",n)}} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_panel_enabled",e)}</span>
          <input type="checkbox" .checked=${t.panel_enabled}
            @change=${i=>this._updateSetting("panel_enabled",i.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_notifications",e)}</span>
          <input type="checkbox" .checked=${t.notifications_enabled}
            @change=${i=>this._updateSetting("notifications_enabled",i.target.checked)} />
        </label>
        ${t.notifications_enabled?l`
          <label class="setting-row">
            <span class="setting-label">${s("settings_notify_service",e)}</span>
            <input type="text" .value=${t.notify_service}
              @change=${i=>this._updateSetting("notify_service",i.target.value.trim())} />
          </label>
        `:c}
      </div>
    `}_renderNotifications(e){let t=this._settings.notifications,i=this._settings.actions;return l`
      <div class="settings-section">
        <h3>${s("settings_notifications",e)}</h3>

        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_notify_due_soon",e)}</span>
          </span>
          <input type="checkbox" .checked=${t.due_soon_enabled}
            @change=${n=>this._updateSetting("notify_due_soon_enabled",n.target.checked)} />
        </label>
        ${t.due_soon_enabled?l`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_interval_hours",e)}</span>
            <input type="number" min="0" max="720" .value=${String(t.due_soon_interval_hours)}
              @change=${n=>this._updateSetting("notify_due_soon_interval_hours",parseInt(n.target.value,10)||0)} />
          </label>
        `:c}

        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_notify_overdue",e)}</span>
          </span>
          <input type="checkbox" .checked=${t.overdue_enabled}
            @change=${n=>this._updateSetting("notify_overdue_enabled",n.target.checked)} />
        </label>
        ${t.overdue_enabled?l`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_interval_hours",e)}</span>
            <input type="number" min="0" max="720" .value=${String(t.overdue_interval_hours)}
              @change=${n=>this._updateSetting("notify_overdue_interval_hours",parseInt(n.target.value,10)||0)} />
          </label>
        `:c}

        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_notify_triggered",e)}</span>
          </span>
          <input type="checkbox" .checked=${t.triggered_enabled}
            @change=${n=>this._updateSetting("notify_triggered_enabled",n.target.checked)} />
        </label>
        ${t.triggered_enabled?l`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_interval_hours",e)}</span>
            <input type="number" min="0" max="720" .value=${String(t.triggered_interval_hours)}
              @change=${n=>this._updateSetting("notify_triggered_interval_hours",parseInt(n.target.value,10)||0)} />
          </label>
        `:c}

        <label class="setting-row">
          <span class="setting-label">${s("settings_quiet_hours",e)}</span>
          <input type="checkbox" .checked=${t.quiet_hours_enabled}
            @change=${n=>this._updateSetting("quiet_hours_enabled",n.target.checked)} />
        </label>
        ${t.quiet_hours_enabled?l`
          <div class="setting-row sub-row">
            <span class="setting-desc">${s("settings_quiet_start",e)}</span>
            <input type="time" .value=${t.quiet_hours_start}
              @change=${n=>this._updateSetting("quiet_hours_start",n.target.value)} />
          </div>
          <div class="setting-row sub-row">
            <span class="setting-desc">${s("settings_quiet_end",e)}</span>
            <input type="time" .value=${t.quiet_hours_end}
              @change=${n=>this._updateSetting("quiet_hours_end",n.target.value)} />
          </div>
        `:c}

        <label class="setting-row">
          <span class="setting-label">${s("settings_max_per_day",e)}</span>
          <input type="number" min="0" max="100" .value=${String(t.max_per_day)}
            @change=${n=>this._updateSetting("max_notifications_per_day",parseInt(n.target.value,10)||0)} />
        </label>

        <label class="setting-row">
          <span class="setting-label">${s("settings_bundling",e)}</span>
          <input type="checkbox" .checked=${t.bundling_enabled}
            @change=${n=>this._updateSetting("notification_bundling_enabled",n.target.checked)} />
        </label>
        ${t.bundling_enabled?l`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_bundle_threshold",e)}</span>
            <input type="number" min="2" max="20" .value=${String(t.bundle_threshold)}
              @change=${n=>this._updateSetting("notification_bundle_threshold",parseInt(n.target.value,10)||2)} />
          </label>
        `:c}

        <h4 style="margin: 16px 0 8px; font-size: 14px;">${s("settings_actions",e)}</h4>
        <label class="setting-row">
          <span class="setting-label">${s("settings_action_complete",e)}</span>
          <input type="checkbox" .checked=${i.complete_enabled}
            @change=${n=>this._updateSetting("action_complete_enabled",n.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_action_skip",e)}</span>
          <input type="checkbox" .checked=${i.skip_enabled}
            @change=${n=>this._updateSetting("action_skip_enabled",n.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_action_snooze",e)}</span>
          <input type="checkbox" .checked=${i.snooze_enabled}
            @change=${n=>this._updateSetting("action_snooze_enabled",n.target.checked)} />
        </label>
        ${i.snooze_enabled?l`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_snooze_hours",e)}</span>
            <input type="number" min="1" max="168" .value=${String(i.snooze_duration_hours)}
              @change=${n=>this._updateSetting("snooze_duration_hours",parseInt(n.target.value,10)||4)} />
          </label>
        `:c}
      </div>
    `}_renderBudget(e){let t=this._settings.budget;return l`
      <div class="settings-section">
        <h3>${s("settings_budget",e)}</h3>
        <label class="setting-row">
          <span class="setting-label">${s("settings_currency",e)}</span>
          <select @change=${i=>this._updateSetting("budget_currency",i.target.value)}>
            ${oi.map(i=>l`<option value=${i} ?selected=${t.currency===i}>${i}</option>`)}
          </select>
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_budget_monthly",e)}</span>
          <input type="number" min="0" step="0.01" .value=${String(t.monthly)}
            @change=${i=>this._updateSetting("budget_monthly",parseFloat(i.target.value)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_budget_yearly",e)}</span>
          <input type="number" min="0" step="0.01" .value=${String(t.yearly)}
            @change=${i=>this._updateSetting("budget_yearly",parseFloat(i.target.value)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_budget_alerts",e)}</span>
          <input type="checkbox" .checked=${t.alerts_enabled}
            @change=${i=>this._updateSetting("budget_alerts_enabled",i.target.checked)} />
        </label>
        ${t.alerts_enabled?l`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_budget_threshold",e)}</span>
            <input type="number" min="1" max="100" .value=${String(t.alert_threshold_pct)}
              @change=${i=>this._updateSetting("budget_alert_threshold",parseInt(i.target.value,10)||80)} />
          </label>
        `:c}
      </div>
    `}_renderImportExport(e){return l`
      <div class="settings-section">
        <h3>${s("settings_import_export",e)}</h3>
        <div class="settings-actions">
          <label class="export-history-toggle">
            <input type="checkbox" .checked=${this._includeHistory}
              @change=${t=>{this._includeHistory=t.target.checked}} />
            ${s("settings_include_history",e)}
          </label>
        </div>
        <div class="settings-actions">
          <button @click=${this._exportJson}>${s("settings_export_json",e)}</button>
          <button @click=${this._exportCsv}>${s("settings_export_csv",e)}</button>
        </div>
        <div class="import-section">
          <textarea class="import-area" .value=${this._importCsv}
            placeholder=${s("settings_import_placeholder",e)}
            @input=${t=>{this._importCsv=t.target.value}}
          ></textarea>
          <div class="settings-actions">
            <button ?disabled=${!this._importCsv.trim()||this._importLoading}
              @click=${this._importCsvAction}>
              ${this._importLoading?"\u2026":s("settings_import_btn",e)}
            </button>
          </div>
        </div>
      </div>
    `}async _exportJson(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/export",format:"json",include_history:this._includeHistory}),t=new Date().toISOString().slice(0,10);this._downloadFile(e.data,`maintenance_export_${t}.json`,"application/json"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _exportCsv(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/export"}),t=new Date().toISOString().slice(0,10);this._downloadFile(e.csv,`maintenance_export_${t}.csv`,"text/csv"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _importCsvAction(){let e=this._importCsv.trim();if(e){this._importLoading=!0;try{let t=e.startsWith("{")||e.startsWith("["),n=(await this.hass.connection.sendMessagePromise(t?{type:"maintenance_supporter/json/import",json_content:e}:{type:"maintenance_supporter/csv/import",csv_content:e})).created??0;this._showToast(s("settings_import_success",this._lang).replace("{count}",String(n))),this._importCsv="",this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(s("action_error",this._lang))}this._importLoading=!1}}};B.styles=N`
    :host { display: block; }

    .settings-loading {
      text-align: center;
      padding: 32px;
      color: var(--secondary-text-color);
    }

    .settings-section {
      margin-bottom: 24px;
      padding: 16px;
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
    }
    .settings-section h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
    }
    .section-desc {
      font-size: 13px;
      color: var(--secondary-text-color);
      margin: 0 0 16px 0;
    }

    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer;
      gap: 12px;
    }
    .setting-row:last-child { border-bottom: none; }
    .setting-row.sub-row {
      padding-left: 16px;
    }

    .setting-label { font-size: 14px; display: block; }
    .setting-desc { font-size: 12px; color: var(--secondary-text-color); display: block; }

    .setting-row input[type="checkbox"] {
      width: 18px; height: 18px; flex-shrink: 0;
    }
    .setting-row input[type="number"],
    .setting-row input[type="text"],
    .setting-row input[type="time"] {
      width: 120px;
      padding: 6px 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
      flex-shrink: 0;
    }
    .setting-row input[type="number"] {
      text-align: right;
    }
    .setting-row select {
      padding: 6px 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
      flex-shrink: 0;
    }

    .settings-actions {
      display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;
    }
    .settings-actions button {
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 14px;
    }
    .settings-actions button:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .settings-actions button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .export-history-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .export-history-toggle input { width: 16px; height: 16px; }

    .import-section { margin-top: 16px; }

    .import-area {
      width: 100%;
      min-height: 120px;
      padding: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      resize: vertical;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      box-sizing: border-box;
    }

    .settings-toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color, #03a9f4);
      color: #fff;
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,.3);
      animation: toast-in .3s ease;
    }
    @keyframes toast-in {
      from { opacity: 0; transform: translateX(-50%) translateY(16px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `,u([S({attribute:!1})],B.prototype,"hass",2),u([S({attribute:!1})],B.prototype,"features",2),u([S({attribute:!1})],B.prototype,"budget",2),u([_()],B.prototype,"_settings",2),u([_()],B.prototype,"_loading",2),u([_()],B.prototype,"_importCsv",2),u([_()],B.prototype,"_importLoading",2),u([_()],B.prototype,"_includeHistory",2),u([_()],B.prototype,"_toast",2);customElements.define("maintenance-settings-view",B);var li=300,ci=140,qe=27;function ht(r,a){let e=r.trigger_config;if(!e)return c;let t=a.lang,i=r.trigger_entity_info,n=r.trigger_entity_infos,o=i?.friendly_name||e.entity_id||"\u2014",d=e.entity_id||"",p=e.entity_ids||(d?[d]:[]),g=i?.unit_of_measurement||"",m=r.trigger_current_value,v=e.type||"threshold",b=p.length>1;return l`
    <h3>${s("trigger",t)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${b?l`
            <div class="trigger-entity-name">${p.length} ${s("entities",t)} (${e.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${p.map((f,w)=>l`${w>0?", ":""}<span class="entity-link" @click=${T=>ae(T,f)}>${f}</span>`)}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `:l`
            <div class="trigger-entity-name">${o}</div>
            <div class="trigger-entity-id">${d?l`<span class="entity-link" @click=${f=>ae(f,d)}>${d}</span>`:""}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${r.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${r.trigger_active?s("triggered",t):s("ok",t)}
        </span>
      </div>

      ${m!=null?l`
            <div class="trigger-value-row">
              <span class="trigger-current ${r.trigger_active?"active":""}">${typeof m=="number"?m.toFixed(1):m}</span>
              ${g?l`<span class="trigger-unit">${g}</span>`:c}
            </div>
          `:c}

      <div class="trigger-limits">
        ${v==="threshold"?l`
          ${e.trigger_above!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_above",t)}: ${e.trigger_above} ${g}</span>`:c}
          ${e.trigger_below!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_below",t)}: ${e.trigger_below} ${g}</span>`:c}
          ${e.trigger_for_minutes?l`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("for_minutes",t)}: ${e.trigger_for_minutes}</span>`:c}
        `:c}
        ${v==="counter"?l`
          ${e.trigger_target_value!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("target_value",t)}: ${e.trigger_target_value} ${g}</span>`:c}
        `:c}
        ${v==="state_change"?l`
          ${e.trigger_target_changes!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("target_changes",t)}: ${e.trigger_target_changes}</span>`:c}
        `:c}
        ${v==="runtime"?l`
          ${e.trigger_runtime_hours!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("runtime_hours",t)}: ${e.trigger_runtime_hours}h</span>`:c}
        `:c}
        ${v==="compound"?l`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("compound_logic",t)}: ${e.compound_logic||e.operator||"AND"}</span>
          ${(e.conditions||[]).map((f,w)=>l`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${w+1}. ${s(f.type||"unknown",t)}: ${f.entity_id?l`<span class="entity-link" @click=${T=>ae(T,f.entity_id)}>${f.entity_id}</span>`:""}</span>
          `)}
        `:c}
        ${i?.min!=null?l`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("min",t)}: ${i.min} ${g}</span>`:c}
        ${i?.max!=null?l`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("max",t)}: ${i.max} ${g}</span>`:c}
      </div>

      ${n&&n.length>1?l`
        <div class="trigger-entity-list">
          ${n.map(f=>l`
            <span class="trigger-entity-id">${f.friendly_name} (<span class="entity-link" @click=${w=>ae(w,f.entity_id)}>${f.entity_id}</span>)</span>
          `)}
        </div>
      `:c}

      ${di(r,g,a)}
    </div>
  `}function di(r,a,e){let t=r.trigger_config;if(!t)return c;let i=t.type||"threshold",n=i==="counter"&&t.trigger_delta_mode,o=e.isCounterEntity(t),d=t.entity_id||"",p=e.detailStatsData.get(d)||[],g=[],m=!1;if(p.length>=2)for(let h of p){let k=h.val;n&&r.trigger_baseline_value!=null&&(k-=r.trigger_baseline_value);let R={ts:h.ts,val:k};!o&&h.min!=null&&h.max!=null&&(R.min=n&&r.trigger_baseline_value!=null?h.min-r.trigger_baseline_value:h.min,R.max=n&&r.trigger_baseline_value!=null?h.max-r.trigger_baseline_value:h.max,m=!0),g.push(R)}else for(let h of r.history)h.trigger_value!=null&&g.push({ts:new Date(h.timestamp).getTime(),val:h.trigger_value});if(r.trigger_current_value!=null){let h=r.trigger_current_value;n&&r.trigger_baseline_value!=null&&(h-=r.trigger_baseline_value),g.push({ts:Date.now(),val:h})}if(g.length<2&&d&&e.hasStatsService&&!e.detailStatsData.has(d))return l`<div class="sparkline-container" aria-live="polite" style="display:flex;align-items:center;justify-content:center;height:140px;color:var(--secondary-text-color);font-size:12px;">
      <ha-icon icon="mdi:chart-line" style="--mdc-icon-size:16px;margin-right:8px;"></ha-icon>
      ${s("loading_chart",e.lang)}
    </div>`;if(g.length<2)return c;g.sort((h,k)=>h.ts-k.ts);let v=li,b=ci,f=30,w=2,T=8,H=16,C=g.map(h=>h.val),E=Math.min(...C),y=Math.max(...C);if(m)for(let h of g)h.min!=null&&(E=Math.min(E,h.min)),h.max!=null&&(y=Math.max(y,h.max));t.trigger_above!=null&&(y=Math.max(y,t.trigger_above),E=Math.min(E,t.trigger_above)),t.trigger_below!=null&&(E=Math.min(E,t.trigger_below),y=Math.max(y,t.trigger_below));let z=null,q=null;if(i==="counter"&&t.trigger_target_value!=null){if(r.trigger_baseline_value!=null)z=r.trigger_baseline_value;else if(g.length>0){let h=[...r.history].filter(k=>k.type==="completed"||k.type==="reset").sort((k,R)=>new Date(R.timestamp).getTime()-new Date(k.timestamp).getTime())[0];if(h){let k=new Date(h.timestamp).getTime(),R=g[0],P=Math.abs(g[0].ts-k);for(let J of g){let Z=Math.abs(J.ts-k);Z<P&&(R=J,P=Z)}z=R.val}else z=g[0].val}z!=null?(q=z+t.trigger_target_value,y=Math.max(y,q),E=Math.min(E,z)):(y=Math.max(y,t.trigger_target_value),E=Math.min(E,0))}n&&r.trigger_baseline_value!=null&&(E=Math.min(E,0));let G=y-E||1;E-=G*.1,y+=G*.1;let W=g[0].ts,L=g[g.length-1].ts,x=L-W||1,I=h=>f+(h-W)/x*(v-f-w),M=h=>T+(1-(h-E)/(y-E))*(b-T-H),Ee=g.map(h=>`${I(h.ts).toFixed(1)},${M(h.val).toFixed(1)}`).join(" "),wt=`M${I(g[0].ts).toFixed(1)},${b-H} `+g.map(h=>`L${I(h.ts).toFixed(1)},${M(h.val).toFixed(1)}`).join(" ")+` L${I(g[g.length-1].ts).toFixed(1)},${b-H} Z`,Ae="";if(m){let h=g.filter(k=>k.min!=null&&k.max!=null);if(h.length>=2){let k=h.map(P=>`${I(P.ts).toFixed(1)},${M(P.max).toFixed(1)}`),R=[...h].reverse().map(P=>`${I(P.ts).toFixed(1)},${M(P.min).toFixed(1)}`);Ae=`M${k[0]} `+k.slice(1).map(P=>`L${P}`).join(" ")+` L${R[0]} `+R.slice(1).map(P=>`L${P}`).join(" ")+" Z"}}let Oe=g[g.length-1],kt=I(Oe.ts),Et=M(Oe.val),Ue=h=>Math.abs(h)>=1e4?(h/1e3).toFixed(0)+"k":h>=1e3?(h/1e3).toFixed(1)+"k":h.toFixed(h<10?1:0),At=Ue(y),St=Ue(E),Tt=r.history.filter(h=>["completed","skipped","reset"].includes(h.type)).map(h=>({ts:new Date(h.timestamp).getTime(),type:h.type})).filter(h=>h.ts>=W&&h.ts<=L),Se=g;if(g.length>qe){let h=(g.length-1)/(qe-1);Se=[];for(let k=0;k<qe;k++)Se.push(g[Math.round(k*h)])}return l`
    <div class="sparkline-container">
      <svg class="sparkline-svg" viewBox="0 0 ${v} ${b}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_sparkline",e.lang)}">
        <text x="${f-3}" y="${T+3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${At}</text>
        <text x="${f-3}" y="${b-H+3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${St}</text>
        <text x="${f}" y="${b-1}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(W).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
        <text x="${v-w}" y="${b-1}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(L).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
        ${Ae?D`<path d="${Ae}" fill="var(--primary-color)" opacity="0.08" />`:c}
        <path d="${wt}" fill="var(--primary-color)" opacity="0.15" />
        <polyline points="${Ee}" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linejoin="round" />
        ${r.degradation_rate!=null&&r.degradation_trend!=="stable"&&r.degradation_trend!=="insufficient_data"&&g.length>=2?(()=>{let h=g[g.length-1],k=30,R=h.ts+k*864e5,P=h.val+r.degradation_rate*k,J=Math.min(R,L+(L-W)*.3),Z=Math.max(E,Math.min(y,P)),Mt=I(h.ts),Ct=M(h.val),zt=I(J),It=M(Z);return D`<line x1="${Mt.toFixed(1)}" y1="${Ct.toFixed(1)}" x2="${zt.toFixed(1)}" y2="${It.toFixed(1)}" stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7" />`})():c}
        ${i==="threshold"&&t.trigger_above!=null?D`<line x1="${f}" y1="${M(t.trigger_above).toFixed(1)}" x2="${v}" y2="${M(t.trigger_above).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                <text x="${v-2}" y="${M(t.trigger_above)-3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">\u25B2 ${t.trigger_above}</text>`:c}
        ${i==="threshold"&&t.trigger_below!=null?D`<line x1="${f}" y1="${M(t.trigger_below).toFixed(1)}" x2="${v}" y2="${M(t.trigger_below).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                <text x="${v-2}" y="${M(t.trigger_below)+11}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">\u25BC ${t.trigger_below}</text>`:c}
        ${i==="counter"&&q!=null?D`<line x1="${f}" y1="${M(q).toFixed(1)}" x2="${v}" y2="${M(q).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                <text x="${v-2}" y="${M(q)-3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">${s("target_value",e.lang)}: +${t.trigger_target_value}</text>`:c}
        ${i==="counter"&&z!=null?D`<line x1="${f}" y1="${M(z).toFixed(1)}" x2="${v}" y2="${M(z).toFixed(1)}" stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
                <text x="${f+2}" y="${M(z)+11}" text-anchor="start" fill="var(--secondary-text-color)" font-size="8">${s("baseline",e.lang)}</text>`:c}
        <circle cx="${kt.toFixed(1)}" cy="${Et.toFixed(1)}" r="3.5" fill="var(--primary-color)" />
        ${Tt.map(h=>{let k=I(h.ts),R=h.type==="completed"?"var(--success-color, #4caf50)":h.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return D`
            <line x1="${k.toFixed(1)}" y1="${T}" x2="${k.toFixed(1)}" y2="${b-H}" stroke="${R}" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
            <circle cx="${k.toFixed(1)}" cy="${T+2}" r="5" fill="${R}" opacity="0.8" />
            <text x="${k.toFixed(1)}" y="${T+6}" text-anchor="middle" fill="white" font-size="7" font-weight="bold">${h.type==="completed"?"\u2713":h.type==="skipped"?"\u23ED":"\u21BA"}</text>
          `})}
        ${Se.map(h=>{let k=I(h.ts),R=M(h.val),P=new Date(h.ts).toLocaleDateString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),J=`${h.val.toFixed(1)} ${a}`;return m&&h.min!=null&&h.max!=null&&(J+=` (${h.min.toFixed(1)}\u2013${h.max.toFixed(1)})`),D`<circle cx="${k.toFixed(1)}" cy="${R.toFixed(1)}" r="8" fill="transparent" tabindex="0"
            @mouseenter=${Z=>gt(Z,`${P}
${J}`,e.setTooltip)}
            @focus=${Z=>gt(Z,`${P}
${J}`,e.setTooltip)}
            @mouseleave=${()=>{e.setTooltip(null)}}
            @blur=${()=>{e.setTooltip(null)}} />`})}
      </svg>
      ${e.tooltip?l`
        <div class="sparkline-tooltip" role="tooltip" aria-live="assertive" style="left:${e.tooltip.x}px;top:${e.tooltip.y}px">
          ${e.tooltip.text.split(`
`).map(h=>l`<div>${h}</div>`)}
        </div>
      `:c}
    </div>
  `}function gt(r,a,e){let t=r.currentTarget,i=t.closest(".sparkline-container");if(!i)return;let n=i.getBoundingClientRect(),o=t.getBoundingClientRect();e({x:o.left-n.left+o.width/2,y:o.top-n.top-8,text:a})}function mt(r,a,e){let t=r.degradation_trend!=null&&r.degradation_trend!=="insufficient_data",i=r.days_until_threshold!=null,n=r.environmental_factor!=null&&r.environmental_factor!==1;if(!t&&!i&&!n)return c;let o=r.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":r.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${r.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",a).replace("{days}",String(Math.round(r.days_until_threshold||0)))}
        </div>
      `:c}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",a)}
      </div>
      <div class="prediction-grid">
        ${t?l`
          <div class="prediction-item">
            <ha-svg-icon path="${o}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",a)}</span>
            <span class="prediction-value ${r.degradation_trend}">${s("trend_"+r.degradation_trend,a)}</span>
            ${r.degradation_rate!=null?l`<span class="prediction-rate">${r.degradation_rate>0?"+":""}${Math.abs(r.degradation_rate)>=10?Math.round(r.degradation_rate).toLocaleString():r.degradation_rate.toFixed(1)} ${r.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",a)}</span>`:c}
          </div>
        `:c}
        ${i?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",a)}</span>
            <span class="prediction-value prediction-days${r.days_until_threshold===0?" exceeded":r.sensor_prediction_urgency?" urgent":""}">${r.days_until_threshold===0?s("threshold_exceeded",a):"~"+Math.round(r.days_until_threshold)+" "+s("days",a)}</span>
            ${r.threshold_prediction_date?l`<span class="prediction-date">${Q(r.threshold_prediction_date,a)}</span>`:c}
            ${r.threshold_prediction_confidence?l`<span class="confidence-dot ${r.threshold_prediction_confidence}"></span>`:c}
          </div>
        `:c}
        ${n&&e.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",a)}</span>
            <span class="prediction-value">${r.environmental_factor.toFixed(2)}x</span>
            ${r.environmental_entity?l`<span class="prediction-entity entity-link" @click=${d=>ae(d,r.environmental_entity)}>${r.environmental_entity}</span>`:c}
          </div>
        `:c}
      </div>
    </div>
  `}function vt(r,a){let e=r.interval_analysis,t=e?.weibull_beta,i=e?.weibull_eta;if(t==null||i==null||i<=0)return c;let n=r.interval_days??0,o=r.suggested_interval??n;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",a)}
        ${ui(t,a)}
      </div>
      ${pi(t,i,n,o,a)}
      ${_i(e,a)}
      ${e?.confidence_interval_low!=null?gi(e,r,a):c}
    </div>
  `}function ui(r,a){let e,t,i;return r<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):r<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):r<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),l`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${s(i,a)} (\u03B2=${r.toFixed(2)})
    </span>
  `}function pi(r,a,e,t,i){let f=Math.max(e,t,a,1)*1.3,w=50,T=[];for(let L=0;L<=w;L++){let x=L/w*f,I=1-Math.exp(-Math.pow(x/a,r)),M=32+x/f*260,Ee=136-I*128;T.push([M,Ee])}let H=T.map(([L,x])=>`${L.toFixed(1)},${x.toFixed(1)}`).join(" "),C="M32,136 "+T.map(([L,x])=>`L${L.toFixed(1)},${x.toFixed(1)}`).join(" ")+` L${T[w][0].toFixed(1)},136 Z`,E=32+e/f*260,y=1-Math.exp(-Math.pow(e/a,r)),z=136-y*128,q=((1-y)*100).toFixed(0),G=32+t/f*260,W=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",i)}">
        ${W.map(L=>{let x=136-L*128;return D`
            <line x1="${32}" y1="${x.toFixed(1)}" x2="${292}" y2="${x.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${L===.5?"4,3":c}" />
            <text x="${28}" y="${(x+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(L*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f)}</text>

        <path d="${C}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${H}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?D`
          <line x1="${E.toFixed(1)}" y1="${8}" x2="${E.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${E.toFixed(1)}" cy="${z.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(E+4).toFixed(1)}" y="${(z-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${q}%</text>
        `:c}

        ${t>0&&t!==e?D`
          <line x1="${G.toFixed(1)}" y1="${8}" x2="${G.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:c}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",i)}</span>
      ${e>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",i)}</span>`:c}
      ${t>0&&t!==e?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",i)}</span>`:c}
    </div>
  `}function _i(r,a){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",a)}</span>
        <span class="weibull-info-value">${Math.round(r.weibull_eta)} ${s("days",a)}</span>
      </div>
      ${r.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",a)}</span>
          <span class="weibull-info-value">${r.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:c}
    </div>
  `}function gi(r,a,e){let t=r.confidence_interval_low,i=r.confidence_interval_high,n=a.suggested_interval??a.interval_days??0,o=a.interval_days??0,d=Math.max(0,t-5),g=i+5-d,m=(t-d)/g*100,v=(i-t)/g*100,b=(n-d)/g*100,f=o>0?(o-d)/g*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",e)}: ${n} ${s("days",e)} (${t}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${m.toFixed(1)}%;width:${v.toFixed(1)}%"></div>
        ${f>=0?l`<div class="confidence-marker current" style="left:${f.toFixed(1)}%"></div>`:c}
        <div class="confidence-marker recommended" style="left:${b.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",e)} (${t}${s("days",e).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",e)} (${i}${s("days",e).charAt(0)})</span>
      </div>
    </div>
  `}var ft=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function bt(r,a,e){if(!e.seasonal||!r.seasonal_factor||r.seasonal_factor===1)return c;let t=ft.map(d=>s(d,a)),i=new Date().getMonth(),n=r.seasonal_factors||r.interval_analysis?.seasonal_factors||null,o=n&&n.length===12?n:t.map((d,p)=>{let g=r.seasonal_factor||1,m=Math.sin((p-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,g+m))});return l`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",a)}</h4>
      <div class="seasonal-mini-chart">
        ${o.map((d,p)=>{let g=d*40,m=d<.9?"low":d>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${m} ${p===i?"current":""}"
                 style="height: ${g}px"
                 title="${t[p]}: ${d.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",a)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",a)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",a)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function yt(r,a){return hi(r,a)}function hi(r,a){let e=r.seasonal_factors??r.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return c;let t=r.interval_analysis?.seasonal_reason,i=new Date().getMonth(),n=300,o=100,d=8,g=o-d-4,m=Math.max(...e,1.5),v=n/12,b=v*.65,f=d+g-1/m*g;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",a)}
        ${t?l`<span class="source-tag">${t==="learned"?s("seasonal_learned",a):s("seasonal_manual",a)}</span>`:c}
      </div>
      <svg viewBox="0 0 ${n} ${o}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",a)}">
        <line x1="0" y1="${f.toFixed(1)}" x2="${n}" y2="${f.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((w,T)=>{let H=w/m*g,C=T*v+(v-b)/2,E=d+g-H,y=T===i,z=w<1?"var(--success-color, #4caf50)":w>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return D`
            <rect x="${C.toFixed(1)}" y="${E.toFixed(1)}"
              width="${b.toFixed(1)}" height="${H.toFixed(1)}"
              fill="${z}" opacity="${y?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${ft.map((w,T)=>l`<span class="seasonal-label ${T===i?"active-month":""}">${s(w,a)}</span>`)}
      </div>
    </div>
  `}var mi=300,vi=200;function xt(r,a,e,t){let i=r.history.filter(d=>d.type==="completed"&&(d.cost!=null||d.duration!=null));if(i.length<2)return c;let n=i.some(d=>(d.cost??0)>0),o=i.some(d=>(d.duration??0)>0);return!n&&!o?c:l`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${s("cost_duration_chart",a)}</h3>
        <div class="toggle-buttons">
          ${n?l`<button
            class="toggle-btn ${e==="cost"?"active":""}"
            @click=${()=>t("cost")}>
            ${s("cost",a)}
          </button>`:c}
          ${n&&o?l`<button
            class="toggle-btn ${e==="both"?"active":""}"
            @click=${()=>t("both")}>
            ${s("both",a)}
          </button>`:c}
          ${o?l`<button
            class="toggle-btn ${e==="duration"?"active":""}"
            @click=${()=>t("duration")}>
            ${s("duration",a)}
          </button>`:c}
        </div>
      </div>
      ${fi(r,a,e)}
    </div>
  `}function fi(r,a,e){let t=r.history.filter(x=>x.type==="completed"&&(x.cost!=null||x.duration!=null)).map(x=>({ts:new Date(x.timestamp).getTime(),cost:x.cost??0,duration:x.duration??0})).sort((x,I)=>x.ts-I.ts);if(t.length<2)return c;let i=t.some(x=>x.cost>0),n=t.some(x=>x.duration>0);if(!i&&!n)return c;let o=e!=="duration"&&i,d=e!=="cost"&&n,p=o||!d&&i,g=d||!o&&n,m=mi,v=vi,b=p?32:8,f=g?32:8,w=8,T=20,H=m-b-f,C=v-w-T,E=Math.max(...t.map(x=>x.cost))||1,y=Math.max(...t.map(x=>x.duration))||1,z=Math.min(20,H/t.length*.6),q=H/t.length,G=x=>b+q*x+q/2,W=x=>w+C-x/E*C,L=x=>w+C-x/y*C;return l`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${m} ${v}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_history",a)}">
        ${p?t.map((x,I)=>D`
          <rect x="${(G(I)-z/2).toFixed(1)}" y="${W(x.cost).toFixed(1)}" width="${z.toFixed(1)}" height="${(w+C-W(x.cost)).toFixed(1)}"
            fill="var(--primary-color)" opacity="0.6" rx="2" />
        `):c}
        ${g?D`
          <polyline points="${t.map((x,I)=>`${G(I).toFixed(1)},${L(x.duration).toFixed(1)}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${t.map((x,I)=>D`
            <circle cx="${G(I).toFixed(1)}" cy="${L(x.duration).toFixed(1)}" r="3" fill="var(--accent-color, #ff9800)" />
          `)}
        `:c}
        <text x="${b}" y="${v-2}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(t[0].ts).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
        <text x="${m-f}" y="${v-2}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(t[t.length-1].ts).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
        ${p?D`
          <text x="${b-3}" y="${w+4}" text-anchor="end" fill="var(--primary-color)" font-size="7">${E.toFixed(0)}\u20AC</text>
          <text x="${b-3}" y="${w+C+3}" text-anchor="end" fill="var(--primary-color)" font-size="7">0\u20AC</text>
        `:c}
        ${g?D`
          <text x="${m-f+3}" y="${w+4}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">${y.toFixed(0)}m</text>
          <text x="${m-f+3}" y="${w+C+3}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">0m</text>
        `:c}
      </svg>
    </div>
    <div class="chart-legend">
      ${p?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${s("cost",a)}</span>`:c}
      ${g?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${s("duration",a)}</span>`:c}
    </div>
  `}var bi=60,yi=20,$t=30,A=class extends F{constructor(){super(...arguments);this.narrow=!1;this.panel={};this._objects=[];this._stats=null;this._view="overview";this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._filterUser=null;this._unsub=null;this._sparklineTooltip=null;this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1};this._actionLoading=!1;this._moreMenuOpen=!1;this._toastMessage="";this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab="dashboard";this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=e=>this._onPopState(e);this._deepLinkHandled=!1;this._onDialogEvent=async()=>{try{await this._loadData()}catch{}}}get _lang(){return this.hass?.language||"en"}connectedCallback(){super.connectedCallback(),window.addEventListener("popstate",this._popstateHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._popstateHandler),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null,this._deepLinkHandled=!1,this._statsService?.clearCache(),this._statsService=null}updated(e){if(super.updated(e),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new ke(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new re(this.hass),this._userService.getUsers())}}async _loadData(){let[e,t,i,n,o]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null)]);e&&(this._objects=e.objects),t&&(this._stats=t),i&&(this._budget=i),n&&(this._groups=n.groups||{}),o&&(this._features=o.features),this._fetchMiniStatsForOverview(),this._handleDeepLink()}_handleDeepLink(){if(this._deepLinkHandled)return;let e=new URLSearchParams(window.location.search),t=e.get("entry_id");if(!t)return;this._deepLinkHandled=!0;let i=e.get("task_id"),n=e.get("action"),o=window.location.pathname+window.location.hash;history.replaceState(history.state,"",o);let d=this._getObject(t);if(!d){this._showOverview();return}if(i){let p=d.tasks.find(g=>g.id===i);if(!p){this._showObject(t);return}this._showTask(t,i),n==="complete"&&requestAnimationFrame(()=>{this._openCompleteDialog(t,i,p.name,this._features.checklists?p.checklist:void 0,this._features.adaptive&&!!p.adaptive_config?.enabled)})}else this._showObject(t)}_isCounterEntity(e){if(!e)return!1;let t=e.type||"threshold";return t==="counter"||t==="state_change"}async _fetchDetailStats(e,t){if(!this._statsService)return;let i=await this._statsService.getDetailStats(e,t),n=new Map(this._detailStatsData);n.set(e,i),this._detailStatsData=n}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let e=[];for(let i of this._objects)for(let n of i.tasks){let o=n.trigger_config?.entity_id;o&&e.push({entityId:o,isCounter:this._isCounterEntity(n.trigger_config)})}if(e.length===0)return;let t=await this._statsService.getBatchMiniStats(e);this._miniStatsData=new Map([...this._miniStatsData,...t])}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(e=>{let t=e;this._objects=t.objects},{type:"maintenance_supporter/subscribe"})}catch{}}get _taskRows(){let e=[];for(let i of this._objects)for(let n of i.tasks)if(!(this._filterStatus&&n.status!==this._filterStatus)){if(this._filterUser){let o=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(n.responsible_user_id!==o)continue}e.push({entry_id:i.entry_id,task_id:n.id,object_name:i.object.name,task_name:n.name,type:n.type,schedule_type:n.schedule_type,status:n.status,days_until_due:n.days_until_due??null,next_due:n.next_due??null,trigger_active:n.trigger_active,trigger_current_value:n.trigger_current_value??null,trigger_current_delta:n.trigger_current_delta??null,trigger_config:n.trigger_config??null,trigger_entity_info:n.trigger_entity_info??null,times_performed:n.times_performed,total_cost:n.total_cost,interval_days:n.interval_days??null,interval_anchor:n.interval_anchor??null,history:n.history||[],enabled:n.enabled,nfc_tag_id:n.nfc_tag_id??null})}let t={overdue:0,triggered:1,due_soon:2,ok:3};return e.sort((i,n)=>(t[i.status]??9)-(t[n.status]??9)),e}_getObject(e){return this._objects.find(t=>t.entry_id===e)}_getTask(e,t){return this._getObject(e)?.tasks.find(n=>n.id===t)}_pushPanelState(e,t,i){let n={msp_view:e,msp_entry:t||null,msp_task:i||null};history.pushState(n,"")}_onPopState(e){let t=e.state;if(t?.msp_view&&(this._view=t.msp_view,this._selectedEntryId=t.msp_entry||null,this._selectedTaskId=t.msp_task||null,this._moreMenuOpen=!1,t.msp_view==="task"&&t.msp_entry&&t.msp_task)){this._historyFilter=null;let i=this._getTask(t.msp_entry,t.msp_task);i?.trigger_config?.entity_id&&this._fetchDetailStats(i.trigger_config.entity_id,this._isCounterEntity(i.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1}_showObject(e){this._pushPanelState("object",e),this._view="object",this._selectedEntryId=e,this._selectedTaskId=null}_showTask(e,t){this._pushPanelState("task",e,t),this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._activeTab="overview",this._historyFilter=null;let i=this._getTask(e,t);if(i?.trigger_config?.entity_id){let n=i.trigger_config.entity_id,o=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(n,o)}}_showToast(e){this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}async _deleteObject(e){if(await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_object",this._lang),confirmText:s("delete",this._lang),danger:!0}))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:e}),this._showOverview(),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _deleteTask(e,t){if(await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_task",this._lang),confirmText:s("delete",this._lang),danger:!0}))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/delete",entry_id:e,task_id:t}),this._showObject(e),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _skipTask(e,t,i){this._actionLoading=!0;try{let n={type:"maintenance_supporter/task/skip",entry_id:e,task_id:t};i&&(n.reason=i),await this.hass.connection.sendMessagePromise(n),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _resetTask(e,t,i){this._actionLoading=!0;try{let n={type:"maintenance_supporter/task/reset",entry_id:e,task_id:t};i&&(n.reset_date=i),await this.hass.connection.sendMessagePromise(n),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _applySuggestion(e,t,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/apply_suggestion",entry_id:e,task_id:t,interval:i}),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _promptSkipTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let n=await i.prompt({title:s("skip",this._lang),message:s("skip_reason_prompt",this._lang),confirmText:s("skip",this._lang),inputLabel:s("reason_optional",this._lang),inputType:"text"});n.confirmed&&this._skipTask(e,t,n.value||void 0)}async _promptResetTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let n=await i.prompt({title:s("reset",this._lang),message:s("reset_date_prompt",this._lang),confirmText:s("reset",this._lang),inputLabel:s("reset_date_optional",this._lang),inputType:"date"});n.confirmed&&this._resetTask(e,t,n.value||void 0)}_dismissSuggestion(e,t){e&&t&&this._dismissedSuggestions.add(`${e}_${t}`),this.requestUpdate()}_openCompleteDialog(e,t,i,n,o){let d=this.shadowRoot.querySelector("maintenance-complete-dialog");d&&(d.entryId=e,d.taskId=t,d.taskName=i,d.lang=this._lang,d.checklist=n||[],d.adaptiveEnabled=!!o,d.open())}_openQrForObject(e,t){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForObject(e,t)}_openQrForTask(e,t,i,n){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForTask(e,t,i,n)}render(){return l`
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
      <maintenance-confirm-dialog
        .hass=${this.hass}
      ></maintenance-confirm-dialog>
      ${this._toastMessage?l`<div class="toast">${this._toastMessage}</div>`:c}
    `}_renderHeader(){let e=[{label:s("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let i=this._getTask(this._selectedEntryId,this._selectedTaskId);e.push({label:i?.name||"Task"})}return l`
      <div class="header">
        ${this._view!=="overview"?l`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._showOverview()}}
            ></ha-icon-button>`:c}
        <div class="breadcrumbs">
          ${e.map((t,i)=>l`
              ${i>0?l`<span class="sep">/</span>`:c}
              ${t.action?l`<a @click=${t.action}>${t.label}</a>`:l`<span class="current">${t.label}</span>`}
            `)}
        </div>
      </div>
    `}_renderOverview(){let e=this._lang;return l`
      <div class="tab-bar">
        <div class="tab ${this._overviewTab==="dashboard"?"active":""}"
          @click=${()=>{this._overviewTab="dashboard"}}>
          ${s("dashboard",e)}
        </div>
        <div class="tab ${this._overviewTab==="settings"?"active":""}"
          @click=${()=>{this._overviewTab="settings"}}>
          ${s("settings",e)}
        </div>
      </div>
      ${this._overviewTab==="dashboard"?this._renderDashboard():l`<maintenance-settings-view
            .hass=${this.hass}
            .features=${this._features}
            .budget=${this._budget}
            @settings-changed=${this._onSettingsChanged}
          ></maintenance-settings-view>`}
    `}_renderDashboard(){let e=this._stats,t=this._taskRows,i=this._lang;return l`
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
          @change=${n=>this._filterStatus=n.target.value}
        >
          <option value="">${s("all",i)}</option>
          <option value="overdue">${s("overdue",i)}</option>
          <option value="due_soon">${s("due_soon",i)}</option>
          <option value="triggered">${s("triggered",i)}</option>
          <option value="ok">${s("ok",i)}</option>
        </select>
        <select
          .value=${this._filterUser||""}
          @change=${n=>{let o=n.target.value;this._filterUser=o||null}}
        >
          <option value="">${s("all_users",i)}</option>
          <option value="current_user">${s("my_tasks",i)}</option>
        </select>
        <ha-button
          @click=${()=>this.shadowRoot.querySelector("maintenance-object-dialog")?.openCreate()}
        >
          ${s("new_object",i)}
        </ha-button>
      </div>

      ${t.length===0?l`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${s("no_tasks",i)}</p>
            </div>
          `:l`
            <div class="task-table">
              ${t.map(n=>this._renderOverviewRow(n))}
            </div>
          `}

      ${this._features.groups?this._renderGroupsSection():c}
    `}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){let e=Object.entries(this._groups);if(e.length===0)return c;let t=this._lang;return l`
      <div class="groups-section">
        <h3>${s("groups",t)}</h3>
        <div class="groups-grid">
          ${e.map(([i,n])=>{let o=n.task_refs.map(d=>this._getTask(d.entry_id,d.task_id)?.name).filter(Boolean);return l`
              <div class="group-card">
                <div class="group-card-name">${n.name}</div>
                ${n.description?l`<div class="group-card-desc">${n.description}</div>`:c}
                <div class="group-card-tasks">
                  ${o.length>0?o.map(d=>l`<span class="group-task-chip">${d}</span>`):l`<span style="font-size:12px;color:var(--secondary-text-color)">${s("no_tasks_short",t)}</span>`}
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_renderBudgetBar(){let e=this._budget;if(!e)return c;let t=this._lang,i=e.currency_symbol||"\u20AC",n=[];return e.monthly_budget>0&&n.push({label:s("budget_monthly",t),spent:e.monthly_spent,budget:e.monthly_budget}),e.yearly_budget>0&&n.push({label:s("budget_yearly",t),spent:e.yearly_spent,budget:e.yearly_budget}),n.length===0?c:l`
      <div class="budget-bars">
        ${n.map(o=>{let d=Math.min(100,Math.max(0,o.spent/o.budget*100)),p=d>=100?"var(--error-color, #f44336)":d>=e.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return l`
            <div class="budget-item">
              <div class="budget-label">
                <span>${o.label}</span>
                <span>${o.spent.toFixed(2)} / ${o.budget.toFixed(2)} ${i}</span>
              </div>
              <div class="budget-bar">
                <div class="budget-bar-fill" style="width:${d}%; background:${p}"></div>
              </div>
            </div>
          `})}
      </div>
    `}_renderOverviewRow(e){let t=this._lang,i=e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0,n=0,o=$e.ok,d=!1;if(i&&e.days_until_due!==null){let p=(e.interval_days-e.days_until_due)/e.interval_days*100;n=Math.max(0,Math.min(100,p)),d=p>100,e.status==="overdue"?o=$e.overdue:e.status==="due_soon"&&(o=$e.due_soon)}return l`
      <div class="task-row${e.enabled?"":" task-disabled"}">
        <span class="status-badge ${e.status}">${s(e.status,t)}</span>
        ${e.enabled?c:l`<span class="badge-disabled">${s("disabled",t)}</span>`}
        ${e.nfc_tag_id?l`<span class="nfc-badge" title="${s("nfc_linked",t)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:c}
        <span class="cell object-name" @click=${p=>{p.stopPropagation(),this._showObject(e.entry_id)}}>${e.object_name}</span>
        <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,e.task_id)}>${e.task_name}</span>
        <span class="cell type">${s(e.type,t)}</span>
        <span class="due-cell" @click=${()=>this._showTask(e.entry_id,e.task_id)}>
          <span class="due-text">${we(e.days_until_due,t)}</span>
          ${i?l`<div class="days-bar"><div class="days-bar-fill${d?" overflow":""}" style="width:${n}%;background:${o}"></div></div>`:c}
          ${e.trigger_config?this._renderTriggerProgress(e):!i&&e.trigger_active?l`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:c}
          ${this._renderMiniSparkline(e)}
        </span>
        <span class="row-actions">
          <mwc-icon-button class="btn-complete" title="${s("complete",t)}" @click=${p=>{p.stopPropagation(),this._openCompleteDialogForRow(e)}}>
            <ha-icon icon="mdi:check"></ha-icon>
          </mwc-icon-button>
          <mwc-icon-button class="btn-skip" title="${s("skip",t)}" .disabled=${this._actionLoading} @click=${p=>{p.stopPropagation(),this._promptSkipTask(e.entry_id,e.task_id)}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>
        </span>
      </div>
    `}_openCompleteDialogForRow(e){let i=this._objects.find(n=>n.entry_id===e.entry_id)?.tasks.find(n=>n.id===e.task_id);this._openCompleteDialog(e.entry_id,e.task_id,e.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderTriggerProgress(e){let t=e.trigger_config??null;if(!t)return c;let i=t.type||"threshold",n=e.trigger_entity_info?.unit_of_measurement??"",o=0,d="";if(i==="threshold"){let m=e.trigger_current_value??null;if(m==null)return c;let v=t.trigger_above,b=t.trigger_below;if(v!=null){let f=b??0,w=v-f||1;o=Math.min(100,Math.max(0,(m-f)/w*100)),d=`${m.toFixed(1)} / ${v} ${n}`}else if(b!=null){let w=e.trigger_entity_info?.max??(b*2||100),T=w-b||1;o=Math.min(100,Math.max(0,(w-m)/T*100)),d=`${m.toFixed(1)} / ${b} ${n}`}else return c}else if(i==="counter"){let m=t.trigger_target_value||1,b=e.trigger_current_delta??null??e.trigger_current_value??null;if(b==null)return c;o=Math.min(100,Math.max(0,b/m*100)),d=`${b.toFixed(1)} / ${m} ${n}`}else if(i==="state_change"){let m=t.trigger_target_changes||1,v=e.trigger_current_value??null;if(v==null)return c;o=Math.min(100,Math.max(0,v/m*100)),d=`${Math.round(v)} / ${m}`}else if(i==="runtime"){let m=t.trigger_runtime_hours||100,v=e.trigger_current_value??null;if(v==null)return c;o=Math.min(100,Math.max(0,v/m*100)),d=`${v.toFixed(1)}h / ${m}h`}else if(i==="compound"){let m=t.compound_logic||t.operator||"AND",v=t.conditions?.length||0;d=`${m} (${v})`,o=e.trigger_active?100:0}else return c;let p=o>=100,g=o>90?"var(--error-color, #f44336)":o>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return l`
      <div class="trigger-progress">
        <div class="trigger-progress-bar">
          <div class="trigger-progress-fill${p?" overflow":""}" style="width:${o}%;background:${g}"></div>
        </div>
        <span class="trigger-progress-label">${d}</span>
      </div>
    `}_renderMiniSparkline(e){if(!e.trigger_config?.entity_id)return c;let t=e.trigger_config.entity_id,i=this._miniStatsData.get(t)||[],n=[];if(i.length>=2)n=i.map(y=>({ts:y.ts,val:y.val}));else{if(!e.history)return c;for(let y of e.history)y.trigger_value!=null&&n.push({ts:new Date(y.timestamp).getTime(),val:y.trigger_value})}if(e.trigger_current_value!=null&&n.push({ts:Date.now(),val:e.trigger_current_value}),n.length<2)return c;n.sort((y,z)=>y.ts-z.ts);let o=bi,d=yi,p=n.map(y=>y.val),g=Math.min(...p),m=Math.max(...p),v=m-g||1;g-=v*.1,m+=v*.1;let b=n[0].ts,w=n[n.length-1].ts-b||1,T=y=>(y-b)/w*o,H=y=>2+(1-(y-g)/(m-g))*(d-4),C=n;if(C.length>$t){let y=Math.ceil(C.length/$t);C=C.filter((z,q)=>q%y===0||q===C.length-1)}let E=C.map(y=>`${T(y.ts).toFixed(1)},${H(y.val).toFixed(1)}`).join(" ");return l`
      <svg class="mini-sparkline" viewBox="0 0 ${o} ${d}" preserveAspectRatio="none" role="img" aria-label="${s("chart_mini_sparkline",this._lang)}">
        <polyline points="${E}" fill="none" stroke="var(--primary-color)" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
    `}_renderDaysProgress(e){let t=this._lang;if(e.days_until_due==null||!e.interval_days||e.interval_days<=0)return c;let n=(e.interval_days-e.days_until_due)/e.interval_days*100,o=Math.max(0,Math.min(100,n)),d=n>100,p="var(--success-color, #4caf50)";return e.status==="overdue"?p="var(--error-color, #f44336)":e.status==="due_soon"&&(p="var(--warning-color, #ff9800)"),l`
      <div class="days-progress">
        <div class="days-progress-labels">
          <span>${e.last_performed?`${s("last_performed",t)}: ${Q(e.last_performed,t)}`:""}</span>
          <span>${e.next_due?`${s("next_due",t)}: ${Q(e.next_due,t)}`:""}</span>
        </div>
        <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(o)}" aria-valuemin="0" aria-valuemax="100" aria-label="${s("days_progress",t)}">
          <div class="days-progress-fill${d?" overflow":""}" style="width:${o}%;background:${p}"></div>
        </div>
        <div class="days-progress-text">${we(e.days_until_due,t)}</div>
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
        ${t.installation_date?l`<p class="meta">${s("installed",i)}: ${Q(t.installation_date,i)}</p>`:c}

        <h3>${s("tasks",i)} (${e.tasks.length})</h3>
        ${e.tasks.length===0?l`<p class="empty">${s("no_tasks_short",i)}</p>`:e.tasks.map(n=>l`
              <div class="task-row${n.enabled?"":" task-disabled"}">
                <span class="status-badge ${n.status}">${s(n.status,i)}</span>
                ${n.enabled?c:l`<span class="badge-disabled">${s("disabled",i)}</span>`}
                ${n.nfc_tag_id?l`<span class="nfc-badge" title="${s("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:c}
                <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,n.id)}>${n.name}</span>
                ${this._renderUserBadge(n)}
                <span class="cell type">${s(n.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(e.entry_id,n.id)}>
                  <span class="due-text">${we(n.days_until_due,i)}</span>
                  ${n.trigger_config?this._renderTriggerProgress(n):c}
                  ${this._renderMiniSparkline(n)}
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${s("complete",i)}" @click=${o=>{o.stopPropagation(),this._openCompleteDialog(e.entry_id,n.id,n.name,this._features.checklists?n.checklist:void 0,this._features.adaptive&&!!n.adaptive_config?.enabled)}}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${s("skip",i)}" .disabled=${this._actionLoading} @click=${o=>{o.stopPropagation(),this._promptSkipTask(e.entry_id,n.id)}}>
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </mwc-icon-button>
                </span>
              </div>
            `)}
      </div>
    `}_renderTaskHeader(e){let t=this._lang,n=this._getObject(this._selectedEntryId)?.object.name||"",o=e.status==="due_soon"?"warning":e.status||"ok",d=s(e.status||"ok",t);return l`
      <div class="task-header">
        <div class="task-header-title">
          <span class="task-name-breadcrumb" @click=${()=>this._view="task"}>${e.name}</span>
          <span class="breadcrumb-separator">·</span>
          <span class="object-name-breadcrumb" @click=${()=>this._showObject(this._selectedEntryId)}>${n}</span>
          <span class="status-chip ${o}">${d}</span>
          ${this._renderUserBadge(e)}
          ${e.nfc_tag_id?l`<span class="nfc-badge" title="${s("nfc_tag_id",t)}: ${e.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:l`<span class="nfc-badge unlinked" title="${s("nfc_link_hint",t)}"
                @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,e)}}>
                <ha-icon icon="mdi:nfc-variant"></ha-icon>
              </span>`}
        </div>
        <div class="task-header-actions">
          <ha-button appearance="filled" @click=${()=>this._openCompleteDialog(this._selectedEntryId,this._selectedTaskId,e.name,this._features.checklists?e.checklist:void 0,this._features.adaptive&&!!e.adaptive_config?.enabled)}>${s("complete",t)}</ha-button>
          <ha-button appearance="plain" .disabled=${this._actionLoading} @click=${()=>this._promptSkipTask(this._selectedEntryId,this._selectedTaskId)}>${s("skip",t)}</ha-button>
          <div class="more-menu-wrapper">
            <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${this._toggleMoreMenu}></ha-icon-button>
            ${this._moreMenuOpen?l`
              <div class="popup-menu" @click=${p=>p.stopPropagation()}>
                <div class="popup-menu-item" @click=${()=>{this._closeMoreMenu(),this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,e)}}>${s("edit",t)}</div>
                <div class="popup-menu-item" @click=${()=>{this._closeMoreMenu(),this._promptResetTask(this._selectedEntryId,this._selectedTaskId)}}>${s("reset",t)}</div>
                <div class="popup-menu-item" @click=${()=>{this._closeMoreMenu();let p=this._getObject(this._selectedEntryId)?.object;this._openQrForTask(this._selectedEntryId,this._selectedTaskId,p?.name||"",e.name)}}><ha-icon icon="mdi:qrcode"></ha-icon> ${s("qr_code",t)}</div>
                <div class="popup-menu-divider"></div>
                <div class="popup-menu-item danger" @click=${()=>{this._closeMoreMenu(),this._deleteTask(this._selectedEntryId,this._selectedTaskId)}}>${s("delete",t)}</div>
              </div>
            `:c}
          </div>
        </div>
      </div>
    `}_toggleMoreMenu(){if(this._moreMenuOpen=!this._moreMenuOpen,this._moreMenuOpen){let e=()=>{this._moreMenuOpen=!1,document.removeEventListener("click",e)};setTimeout(()=>document.addEventListener("click",e,{once:!0}),0)}}_closeMoreMenu(){this._moreMenuOpen=!1}_renderUserBadge(e){if(!e.responsible_user_id||!this._userService)return c;let t=this._userService.getUserName(e.responsible_user_id);return t?l`
      <span class="user-badge">
        <ha-icon icon="mdi:account"></ha-icon>
        ${t}
      </span>
    `:c}_renderTabBar(){let e=this._lang;return l`
      <div class="tab-bar">
        <div class="tab ${this._activeTab==="overview"?"active":""}" @click=${()=>this._activeTab="overview"}>
          ${s("overview",e)}
        </div>
        <div class="tab ${this._activeTab==="history"?"active":""}" @click=${()=>this._activeTab="history"}>
          ${s("history",e)}
        </div>
      </div>
    `}_renderTabContent(e){switch(this._activeTab){case"overview":return this._renderOverviewTab(e);case"history":return this._renderHistoryTab(e);default:return c}}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,isCounterEntity:e=>this._isCounterEntity(e),tooltip:this._sparklineTooltip,setTooltip:e=>{this._sparklineTooltip=e}}}_renderOverviewTab(e){let t=this._lang,i=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,n=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1,o=i||n,d=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,p=this._features.seasonal&&(e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12);return l`
      <div class="tab-content overview-tab">
        ${this._renderKPIBar(e)}
        ${this._renderTaskMeta(e)}
        ${this._renderDaysProgress(e)}
        ${ht(e,this._sparklineCtx)}
        ${mt(e,t,this._features)}
        <div class="two-column-layout ${o?"":"single-column"}">
          ${o?l`
            <div class="left-column">
              ${this._renderRecommendationCard(e)}
              ${bt(e,t,this._features)}
            </div>
          `:c}
          <div class="right-column">
            ${xt(e,t,this._costDurationToggle,g=>{this._costDurationToggle=g})}
          </div>
        </div>
        ${d?vt(e,t):c}
        ${p?yt(e,t):c}
        ${this._renderRecentActivities(e)}
      </div>
    `}_renderHistoryTab(e){let t=this._lang;return l`
      <div class="tab-content history-tab">
        ${this._renderHistoryFilters(e)}
        ${this._renderHistoryList(e)}
      </div>
    `}_renderTaskMeta(e){let t=e.documentation_url&&/^https?:\/\//i.test(e.documentation_url)?e.documentation_url:null;if(!e.notes&&!t)return c;let i=this._lang;return l`
      <div class="task-meta-card">
        ${e.notes?l`
          <div class="task-meta-row">
            <ha-icon icon="mdi:note-text-outline"></ha-icon>
            <span class="task-meta-notes">${e.notes}</span>
          </div>
        `:c}
        ${t?l`
          <div class="task-meta-row task-meta-link">
            <ha-icon icon="mdi:open-in-new"></ha-icon>
            <a href="${t}" target="_blank" rel="noopener noreferrer">${s("documentation_label",i)}</a>
          </div>
        `:c}
      </div>
    `}_renderKPIBar(e){let t=this._lang,i=e.times_performed>0?e.total_cost/e.times_performed:0,n=e.days_until_due!==null&&e.days_until_due!==void 0?e.days_until_due<0?"overdue":e.days_until_due<=e.warning_days?"warning":"":"";return l`
      <div class="kpi-bar">
        <div class="kpi-card">
          <div class="kpi-label">${s("next_due",t)}</div>
          <div class="kpi-value">${e.next_due?Q(e.next_due,t):"\u2014"}</div>
        </div>
        <div class="kpi-card ${n}">
          <div class="kpi-label">${s("days_until_due",t)}</div>
          <div class="kpi-value-large">${e.days_until_due!==null&&e.days_until_due!==void 0?e.days_until_due:"\u2014"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("interval",t)}</div>
          <div class="kpi-value">${e.interval_days!=null?`${e.interval_days} ${s("days",t)}`:"\u2014"}</div>
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
          <div class="kpi-value">${e.last_performed?Q(e.last_performed,t):"\u2014"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("avg_cost",t)}</div>
          <div class="kpi-value">${i.toFixed(0)} ${this._budget?.currency_symbol||"\u20AC"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("avg_duration",t)}</div>
          <div class="kpi-value">${e.average_duration?e.average_duration.toFixed(0):"\u2014"} min</div>
        </div>
      </div>
    `}_renderRecommendationCard(e){let t=this._lang;if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return c;if(this._selectedEntryId&&this._selectedTaskId&&this._dismissedSuggestions.has(`${this._selectedEntryId}_${this._selectedTaskId}`))return c;let i=e.interval_days,n=e.suggested_interval,o=e.interval_confidence||"medium",d=Math.max(i||1,n);return l`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",t)}</h4>
        <div class="interval-comparison">
          <div class="interval-bar">
            <div class="interval-label">${s("current",t)||"Aktuell"}: ${i??"\u2014"} ${i!=null?s("days",t):""}</div>
            <div class="interval-visual current" style="width: ${i!=null?Math.min(i/d*100,100):0}%"></div>
          </div>
          <div class="interval-bar">
            <div class="interval-label">${s("recommended",t)}: ${n} ${s("days",t)}
              <span class="confidence-badge ${o}">${s(`confidence_${o}`,t)}</span>
            </div>
            <div class="interval-visual suggested" style="width: ${Math.min(n/d*100,100)}%"></div>
          </div>
        </div>
        <div class="recommendation-actions">
          <ha-button appearance="filled" @click=${()=>this._applySuggestion(this._selectedEntryId,this._selectedTaskId,n)}>
            ${s("apply_suggestion",t)}
          </ha-button>
          <ha-button appearance="plain" @click=${()=>this._dismissSuggestion(this._selectedEntryId,this._selectedTaskId)}>
            ${s("dismiss_suggestion",t)}
          </ha-button>
        </div>
      </div>
    `}_renderRecentActivities(e){let t=this._lang,i=e.history.slice(0,3);if(i.length===0)return c;let n=o=>{switch(o){case"completed":return"\u2713";case"triggered":return"\u2297";case"skipped":return"\u21B7";case"reset":return"\u21BA";default:return"\xB7"}};return l`
      <div class="recent-activities">
        <h3>${s("recent_activities",t)}</h3>
        ${i.map(o=>l`
          <div class="activity-item">
            <span class="activity-icon">${n(o.type)}</span>
            <span class="activity-date">${He(o.timestamp,t)}</span>
            <span class="activity-note">${o.notes||"\u2014"}</span>
            ${o.cost?l`<span class="activity-badge">${o.cost.toFixed(0)}${this._budget?.currency_symbol||"\u20AC"}</span>`:c}
            ${o.duration?l`<span class="activity-badge">${o.duration}min</span>`:c}
          </div>
        `)}
        <div class="activity-show-all">
          <ha-button appearance="plain" @click=${()=>this._activeTab="history"}>${s("show_all",t)} →</ha-button>
        </div>
      </div>
    `}_renderHistoryFilters(e){let t=this._lang;return l`
      <div class="history-filters-new">
        <div class="filter-chips">
          ${["completed","skipped","reset","triggered"].map(i=>{let n=e.history.filter(o=>o.type===i).length;return n===0?c:l`
              <span class="filter-chip ${this._historyFilter===i?"active":""}"
                @click=${()=>{this._historyFilter=this._historyFilter===i?null:i}}>
                ${s(i,t)} (${n})
              </span>
            `})}
          ${this._historyFilter?l`<span class="filter-chip clear" @click=${()=>{this._historyFilter=null}}>${s("show_all",t)}</span>`:c}
        </div>
        <div class="filter-controls">
          <input type="text" class="search-input" placeholder="${s("search_notes",t)}..." .value=${this._historySearch} @input=${i=>this._historySearch=i.target.value} />
        </div>
      </div>
    `}_renderHistoryList(e){let t=this._lang,i=this._historyFilter?e.history.filter(n=>n.type===this._historyFilter):e.history;if(this._historySearch){let n=this._historySearch.toLowerCase();i=i.filter(o=>o.notes?.toLowerCase().includes(n))}return i.length===0?l`<p class="empty">${s("no_history",t)}</p>`:l`
      <div class="history-timeline">
        ${[...i].reverse().map(n=>this._renderHistoryEntry(n))}
      </div>
    `}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return c;let e=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!e)return l`<p>Task not found.</p>`;let t=this._lang;return l`
      <div class="detail-section">
        ${this._renderTaskHeader(e)}
        ${this._renderTabBar()}
        ${this._renderTabContent(e)}
      </div>
    `}_renderHistoryEntry(e){let t=this._lang;return l`
      <div class="history-entry">
        <div class="history-icon ${e.type}">
          <ha-icon .icon=${ct[e.type]||"mdi:circle"}></ha-icon>
        </div>
        <div class="history-content">
          <div><strong>${s(e.type,t)}</strong></div>
          <div class="history-date">${He(e.timestamp,t)}</div>
          ${e.notes?l`<div>${e.notes}</div>`:c}
          <div class="history-details">
            ${e.cost!=null?l`<span>${s("cost",t)}: ${e.cost.toFixed(2)} ${this._budget?.currency_symbol||"\u20AC"}</span>`:c}
            ${e.duration!=null?l`<span>${s("duration",t)}: ${e.duration} min</span>`:c}
            ${e.trigger_value!=null?l`<span>${s("trigger_val",t)}: ${e.trigger_value}</span>`:c}
          </div>
        </div>
      </div>
    `}};A.styles=[ut,pt],u([S({attribute:!1})],A.prototype,"hass",2),u([S({type:Boolean,reflect:!0})],A.prototype,"narrow",2),u([S({attribute:!1})],A.prototype,"panel",2),u([_()],A.prototype,"_objects",2),u([_()],A.prototype,"_stats",2),u([_()],A.prototype,"_view",2),u([_()],A.prototype,"_selectedEntryId",2),u([_()],A.prototype,"_selectedTaskId",2),u([_()],A.prototype,"_filterStatus",2),u([_()],A.prototype,"_filterUser",2),u([_()],A.prototype,"_unsub",2),u([_()],A.prototype,"_sparklineTooltip",2),u([_()],A.prototype,"_historyFilter",2),u([_()],A.prototype,"_budget",2),u([_()],A.prototype,"_groups",2),u([_()],A.prototype,"_detailStatsData",2),u([_()],A.prototype,"_miniStatsData",2),u([_()],A.prototype,"_features",2),u([_()],A.prototype,"_actionLoading",2),u([_()],A.prototype,"_moreMenuOpen",2),u([_()],A.prototype,"_toastMessage",2),u([_()],A.prototype,"_overviewTab",2),u([_()],A.prototype,"_activeTab",2),u([_()],A.prototype,"_costDurationToggle",2),u([_()],A.prototype,"_historySearch",2),A=u([ot("maintenance-supporter-panel")],A);export{A as MaintenanceSupporterPanel};
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
