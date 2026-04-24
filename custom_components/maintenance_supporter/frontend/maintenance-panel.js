var Ht=Object.defineProperty;var Ot=Object.getOwnPropertyDescriptor;var u=(o,n,e,t)=>{for(var a=t>1?void 0:t?Ot(n,e):n,s=o.length-1,r;s>=0;s--)(r=o[s])&&(a=(t?r(n,e,a):r(a))||a);return t&&a&&Ht(n,e,a),a};var ye=globalThis,ke=ye.ShadowRoot&&(ye.ShadyCSS===void 0||ye.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ce=Symbol(),Qe=new WeakMap,_e=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==Ce)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(ke&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=Qe.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&Qe.set(e,n))}return n}toString(){return this.cssText}},Ze=o=>new _e(typeof o=="string"?o:o+"",void 0,Ce),N=(o,...n)=>{let e=o.length===1?o[0]:n.reduce((t,a,s)=>t+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+o[s+1],o[0]);return new _e(e,o,Ce)},Je=(o,n)=>{if(ke)o.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),a=ye.litNonce;a!==void 0&&t.setAttribute("nonce",a),t.textContent=e.cssText,o.appendChild(t)}},Ie=ke?o=>o:o=>o instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return Ze(e)})(o):o;var{is:Ut,defineProperty:Bt,getOwnPropertyDescriptor:Vt,getOwnPropertyNames:Wt,getOwnPropertySymbols:Gt,getPrototypeOf:Kt}=Object,xe=globalThis,Ye=xe.trustedTypes,Qt=Ye?Ye.emptyScript:"",Zt=xe.reactiveElementPolyfillSupport,ue=(o,n)=>o,pe={toAttribute(o,n){switch(n){case Boolean:o=o?Qt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,n){let e=o;switch(n){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},we=(o,n)=>!Ut(o,n),Xe={attribute:!0,type:String,converter:pe,reflect:!1,useDefault:!1,hasChanged:we};Symbol.metadata??=Symbol("metadata"),xe.litPropertyMetadata??=new WeakMap;var J=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Xe){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),a=this.getPropertyDescriptor(n,t,e);a!==void 0&&Bt(this.prototype,n,a)}}static getPropertyDescriptor(n,e,t){let{get:a,set:s}=Vt(this.prototype,n)??{get(){return this[e]},set(r){this[e]=r}};return{get:a,set(r){let d=a?.call(this);s?.call(this,r),this.requestUpdate(n,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Xe}static _$Ei(){if(this.hasOwnProperty(ue("elementProperties")))return;let n=Kt(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(ue("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ue("properties"))){let e=this.properties,t=[...Wt(e),...Gt(e)];for(let a of t)this.createProperty(a,e[a])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,a]of e)this.elementProperties.set(t,a)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let a=this._$Eu(e,t);a!==void 0&&this._$Eh.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let a of t)e.unshift(Ie(a))}else n!==void 0&&e.push(Ie(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Je(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),a=this.constructor._$Eu(n,t);if(a!==void 0&&t.reflect===!0){let s=(t.converter?.toAttribute!==void 0?t.converter:pe).toAttribute(e,t.type);this._$Em=n,s==null?this.removeAttribute(a):this.setAttribute(a,s),this._$Em=null}}_$AK(n,e){let t=this.constructor,a=t._$Eh.get(n);if(a!==void 0&&this._$Em!==a){let s=t.getPropertyOptions(a),r=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:pe;this._$Em=a;let d=r.fromAttribute(e,s.type);this[a]=d??this._$Ej?.get(a)??d,this._$Em=null}}requestUpdate(n,e,t,a=!1,s){if(n!==void 0){let r=this.constructor;if(a===!1&&(s=this[n]),t??=r.getPropertyOptions(n),!((t.hasChanged??we)(s,e)||t.useDefault&&t.reflect&&s===this._$Ej?.get(n)&&!this.hasAttribute(r._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:a,wrapped:s},r){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,r??e??this[n]),s!==!0||r!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),a===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,s]of this._$Ep)this[a]=s;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[a,s]of t){let{wrapped:r}=s,d=this[a];r!==!0||this._$AL.has(a)||d===void 0||this.C(a,void 0,s,d)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[ue("elementProperties")]=new Map,J[ue("finalized")]=new Map,Zt?.({ReactiveElement:J}),(xe.reactiveElementVersions??=[]).push("2.1.2");var He=globalThis,et=o=>o,$e=He.trustedTypes,tt=$e?$e.createPolicy("lit-html",{createHTML:o=>o}):void 0,ot="$lit$",te=`lit$${Math.random().toFixed(9).slice(2)}$`,lt="?"+te,Jt=`<${lt}>`,re=document,he=()=>re.createComment(""),me=o=>o===null||typeof o!="object"&&typeof o!="function",Oe=Array.isArray,Yt=o=>Oe(o)||typeof o?.[Symbol.iterator]=="function",Ne=`[ 	
\f\r]`,ge=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,at=/-->/g,it=/>/g,ne=RegExp(`>|${Ne}(?:([^\\s"'>=/]+)(${Ne}*=${Ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),nt=/'/g,st=/"/g,dt=/^(?:script|style|textarea|title)$/i,Ue=o=>(n,...e)=>({_$litType$:o,strings:n,values:e}),l=Ue(1),D=Ue(2),Ua=Ue(3),Y=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),rt=new WeakMap,se=re.createTreeWalker(re,129);function ct(o,n){if(!Oe(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return tt!==void 0?tt.createHTML(n):n}var Xt=(o,n)=>{let e=o.length-1,t=[],a,s=n===2?"<svg>":n===3?"<math>":"",r=ge;for(let d=0;d<e;d++){let _=o[d],p,m,h=-1,v=0;for(;v<_.length&&(r.lastIndex=v,m=r.exec(_),m!==null);)v=r.lastIndex,r===ge?m[1]==="!--"?r=at:m[1]!==void 0?r=it:m[2]!==void 0?(dt.test(m[2])&&(a=RegExp("</"+m[2],"g")),r=ne):m[3]!==void 0&&(r=ne):r===ne?m[0]===">"?(r=a??ge,h=-1):m[1]===void 0?h=-2:(h=r.lastIndex-m[2].length,p=m[1],r=m[3]===void 0?ne:m[3]==='"'?st:nt):r===st||r===nt?r=ne:r===at||r===it?r=ge:(r=ne,a=void 0);let b=r===ne&&o[d+1].startsWith("/>")?" ":"";s+=r===ge?_+Jt:h>=0?(t.push(p),_.slice(0,h)+ot+_.slice(h)+te+b):_+te+(h===-2?d:b)}return[ct(o,s+(o[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},ve=class o{constructor({strings:n,_$litType$:e},t){let a;this.parts=[];let s=0,r=0,d=n.length-1,_=this.parts,[p,m]=Xt(n,e);if(this.el=o.createElement(p,t),se.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(a=se.nextNode())!==null&&_.length<d;){if(a.nodeType===1){if(a.hasAttributes())for(let h of a.getAttributeNames())if(h.endsWith(ot)){let v=m[r++],b=a.getAttribute(h).split(te),y=/([.?@])?(.*)/.exec(v);_.push({type:1,index:s,name:y[2],strings:b,ctor:y[1]==="."?Re:y[1]==="?"?Pe:y[1]==="@"?Fe:de}),a.removeAttribute(h)}else h.startsWith(te)&&(_.push({type:6,index:s}),a.removeAttribute(h));if(dt.test(a.tagName)){let h=a.textContent.split(te),v=h.length-1;if(v>0){a.textContent=$e?$e.emptyScript:"";for(let b=0;b<v;b++)a.append(h[b],he()),se.nextNode(),_.push({type:2,index:++s});a.append(h[v],he())}}}else if(a.nodeType===8)if(a.data===lt)_.push({type:2,index:s});else{let h=-1;for(;(h=a.data.indexOf(te,h+1))!==-1;)_.push({type:7,index:s}),h+=te.length-1}s++}}static createElement(n,e){let t=re.createElement("template");return t.innerHTML=n,t}};function le(o,n,e=o,t){if(n===Y)return n;let a=t!==void 0?e._$Co?.[t]:e._$Cl,s=me(n)?void 0:n._$litDirective$;return a?.constructor!==s&&(a?._$AO?.(!1),s===void 0?a=void 0:(a=new s(o),a._$AT(o,e,t)),t!==void 0?(e._$Co??=[])[t]=a:e._$Cl=a),a!==void 0&&(n=le(o,a._$AS(o,n.values),a,t)),n}var De=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,a=(n?.creationScope??re).importNode(e,!0);se.currentNode=a;let s=se.nextNode(),r=0,d=0,_=t[0];for(;_!==void 0;){if(r===_.index){let p;_.type===2?p=new fe(s,s.nextSibling,this,n):_.type===1?p=new _.ctor(s,_.name,_.strings,this,n):_.type===6&&(p=new Le(s,this,n)),this._$AV.push(p),_=t[++d]}r!==_?.index&&(s=se.nextNode(),r++)}return se.currentNode=re,a}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},fe=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,a){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=le(this,n,e),me(n)?n===c||n==null||n===""?(this._$AH!==c&&this._$AR(),this._$AH=c):n!==this._$AH&&n!==Y&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Yt(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==c&&me(this._$AH)?this._$AA.nextSibling.data=n:this.T(re.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,a=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=ve.createElement(ct(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===a)this._$AH.p(e);else{let s=new De(a,this),r=s.u(this.options);s.p(e),this.T(r),this._$AH=s}}_$AC(n){let e=rt.get(n.strings);return e===void 0&&rt.set(n.strings,e=new ve(n)),e}k(n){Oe(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,a=0;for(let s of n)a===e.length?e.push(t=new o(this.O(he()),this.O(he()),this,this.options)):t=e[a],t._$AI(s),a++;a<e.length&&(this._$AR(t&&t._$AB.nextSibling,a),e.length=a)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=et(n).nextSibling;et(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},de=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,a,s){this.type=1,this._$AH=c,this._$AN=void 0,this.element=n,this.name=e,this._$AM=a,this.options=s,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=c}_$AI(n,e=this,t,a){let s=this.strings,r=!1;if(s===void 0)n=le(this,n,e,0),r=!me(n)||n!==this._$AH&&n!==Y,r&&(this._$AH=n);else{let d=n,_,p;for(n=s[0],_=0;_<s.length-1;_++)p=le(this,d[t+_],e,_),p===Y&&(p=this._$AH[_]),r||=!me(p)||p!==this._$AH[_],p===c?n=c:n!==c&&(n+=(p??"")+s[_+1]),this._$AH[_]=p}r&&!a&&this.j(n)}j(n){n===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Re=class extends de{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===c?void 0:n}},Pe=class extends de{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==c)}},Fe=class extends de{constructor(n,e,t,a,s){super(n,e,t,a,s),this.type=5}_$AI(n,e=this){if((n=le(this,n,e,0)??c)===Y)return;let t=this._$AH,a=n===c&&t!==c||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,s=n!==c&&(t===c||a);a&&this.element.removeEventListener(this.name,this,t),s&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Le=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){le(this,n)}};var ea=He.litHtmlPolyfillSupport;ea?.(ve,fe),(He.litHtmlVersions??=[]).push("3.3.2");var _t=(o,n,e)=>{let t=e?.renderBefore??n,a=t._$litPart$;if(a===void 0){let s=e?.renderBefore??null;t._$litPart$=a=new fe(n.insertBefore(he(),s),s,void 0,e??{})}return a._$AI(o),a};var Be=globalThis,A=class extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=_t(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Y}};A._$litElement$=!0,A.finalized=!0,Be.litElementHydrateSupport?.({LitElement:A});var ta=Be.litElementPolyfillSupport;ta?.({LitElement:A});(Be.litElementVersions??=[]).push("4.2.2");var ut=o=>(n,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,n)}):customElements.define(o,n)};var aa={attribute:!0,type:String,converter:pe,reflect:!1,hasChanged:we},ia=(o=aa,n,e)=>{let{kind:t,metadata:a}=e,s=globalThis.litPropertyMetadata.get(a);if(s===void 0&&globalThis.litPropertyMetadata.set(a,s=new Map),t==="setter"&&((o=Object.create(o)).wrapped=!0),s.set(e.name,o),t==="accessor"){let{name:r}=e;return{set(d){let _=n.get.call(this);n.set.call(this,d),this.requestUpdate(r,_,o,!0,d)},init(d){return d!==void 0&&this.C(r,void 0,o,d),d}}}if(t==="setter"){let{name:r}=e;return function(d){let _=this[r];n.call(this,d),this.requestUpdate(r,_,o,!0,d)}}throw Error("Unsupported decorator location: "+t)};function $(o){return(n,e)=>typeof e=="object"?ia(o,n,e):((t,a,s)=>{let r=a.hasOwnProperty(s);return a.constructor.createProperty(s,t),r?Object.getOwnPropertyDescriptor(a,s):void 0})(o,n,e)}function g(o){return $({...o,state:!0,attribute:!1})}var Ee={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"#ff5722"},gt={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",completed:"mdi:check-circle",skipped:"mdi:skip-next",reset:"mdi:refresh"};var na={maintenance:"Wartung",objects:"Objekte",tasks:"Aufgaben",overdue:"\xDCberf\xE4llig",due_soon:"Bald f\xE4llig",triggered:"Ausgel\xF6st",ok:"OK",all:"Alle",new_object:"+ Neues Objekt",edit:"Bearbeiten",delete:"L\xF6schen",add_task:"+ Aufgabe",complete:"Erledigt",completed:"Abgeschlossen",skip:"\xDCberspringen",skipped:"\xDCbersprungen",reset:"Zur\xFCcksetzen",cancel:"Abbrechen",completing:"Wird erledigt\u2026",interval:"Intervall",warning:"Vorwarnung",last_performed:"Zuletzt durchgef\xFChrt",next_due:"N\xE4chste F\xE4lligkeit",days_until_due:"Tage bis f\xE4llig",avg_duration:"\xD8 Dauer",trigger:"Trigger",trigger_type:"Trigger-Typ",threshold_above:"Obergrenze",threshold_below:"Untergrenze",threshold:"Schwellwert",counter:"Z\xE4hler",state_change:"Zustands\xE4nderung",runtime:"Laufzeit",runtime_hours:"Ziel-Laufzeit (Stunden)",target_value:"Zielwert",baseline:"Nulllinie",target_changes:"Ziel-\xC4nderungen",for_minutes:"F\xFCr (Minuten)",time_based:"Zeitbasiert",sensor_based:"Sensorbasiert",manual:"Manuell",cleaning:"Reinigung",inspection:"Inspektion",replacement:"Austausch",calibration:"Kalibrierung",service:"Service",custom:"Benutzerdefiniert",history:"Verlauf",cost:"Kosten",duration:"Dauer",both:"Beides",trigger_val:"Trigger-Wert",complete_title:"Erledigt: ",checklist:"Checkliste",checklist_steps_optional:"Checkliste-Schritte (optional)",checklist_placeholder:`Filter reinigen
Dichtung ersetzen
Druck testen`,checklist_help:"Ein Schritt pro Zeile. Max. 100 Eintr\xE4ge.",err_too_long:"{field}: zu lang (max. {n} Zeichen)",err_too_short:"{field}: zu kurz (min. {n} Zeichen)",err_value_too_high:"{field}: zu gro\xDF (max. {n})",err_value_too_low:"{field}: zu klein (min. {n})",err_required:"{field}: Pflichtfeld",err_wrong_type:"{field}: falscher Typ (erwartet: {type})",err_invalid_choice:"{field}: nicht erlaubter Wert",err_invalid_value:"{field}: ung\xFCltiger Wert",feat_schedule_time:"Uhrzeit-Scheduling",feat_schedule_time_desc:"Tasks werden zu einer festen Uhrzeit f\xE4llig statt um Mitternacht.",schedule_time_optional:"F\xE4llig um (optional, HH:MM)",schedule_time_help:"Leer = Mitternacht (Default). HA-Zeitzone.",at_time:"um",notes_optional:"Notizen (optional)",cost_optional:"Kosten (optional)",duration_minutes:"Dauer in Minuten (optional)",days:"Tage",day:"Tag",today:"Heute",d_overdue:"T \xFCberf\xE4llig",no_tasks:"Keine Wartungsaufgaben vorhanden. Erstellen Sie ein Objekt um zu beginnen.",no_tasks_short:"Keine Aufgaben",no_history:"Noch keine Verlaufseintr\xE4ge.",show_all:"Alle anzeigen",cost_duration_chart:"Kosten & Dauer",installed:"Installiert",confirm_delete_object:"Dieses Objekt und alle zugeh\xF6rigen Aufgaben l\xF6schen?",confirm_delete_task:"Diese Aufgabe wirklich l\xF6schen?",min:"Min",max:"Max",save:"Speichern",saving:"Speichern\u2026",edit_task:"Aufgabe bearbeiten",new_task:"Neue Wartungsaufgabe",task_name:"Aufgabenname",maintenance_type:"Wartungstyp",schedule_type:"Planungsart",interval_days:"Intervall (Tage)",warning_days:"Warntage",last_performed_optional:"Zuletzt durchgef\xFChrt (optional)",interval_anchor:"Intervall-Anker",anchor_completion:"Ab Erledigung",anchor_planned:"Ab geplantem Datum (kein Drift)",edit_object:"Objekt bearbeiten",name:"Name",manufacturer_optional:"Hersteller (optional)",model_optional:"Modell (optional)",serial_number_optional:"Seriennummer (optional)",serial_number_label:"S/N",sort_due_date:"F\xE4lligkeit",sort_object:"Objekt-Name",sort_type:"Typ",sort_task_name:"Aufgaben-Name",all_objects:"Alle Objekte",tasks_lower:"Aufgaben",no_tasks_yet:"Noch keine Aufgaben",add_first_task:"Erste Aufgabe hinzuf\xFCgen",trigger_configuration:"Trigger-Konfiguration",entity_id:"Entit\xE4ts-ID",comma_separated:"kommagetrennt",entity_logic:"Entit\xE4ts-Logik",entity_logic_any:"Beliebige Entit\xE4t l\xF6st aus",entity_logic_all:"Alle Entit\xE4ten m\xFCssen ausl\xF6sen",entities:"Entit\xE4ten",attribute_optional:"Attribut (optional, leer = Zustand)",use_entity_state:"Entit\xE4ts-Zustand verwenden (kein Attribut)",trigger_above:"Ausl\xF6sen wenn \xFCber",trigger_below:"Ausl\xF6sen wenn unter",for_at_least_minutes:"F\xFCr mindestens (Minuten)",safety_interval_days:"Sicherheitsintervall (Tage, optional)",delta_mode:"Delta-Modus",from_state_optional:"Von Zustand (optional)",to_state_optional:"Zu Zustand (optional)",documentation_url_optional:"Dokumentation URL (optional)",nfc_tag_id_optional:"NFC-Tag-ID (optional)",environmental_entity_optional:"Umgebungs-Sensor (optional)",environmental_entity_helper:"z.B. sensor.aussentemperatur \u2014 passt das Intervall an Umgebungswerte an",environmental_attribute_optional:"Umgebungs-Attribut (optional)",nfc_tag_id:"NFC-Tag-ID",nfc_linked:"NFC-Tag verkn\xFCpft",nfc_link_hint:"Klicken um NFC-Tag zu verkn\xFCpfen",responsible_user:"Verantwortlicher Benutzer",no_user_assigned:"(Kein Benutzer zugewiesen)",all_users:"Alle Benutzer",my_tasks:"Meine Aufgaben",budget_monthly:"Monatsbudget",budget_yearly:"Jahresbudget",groups:"Gruppen",new_group:"Neue Gruppe",edit_group:"Gruppe bearbeiten",no_groups:"Keine Gruppen vorhanden",delete_group:"Gruppe l\xF6schen",delete_group_confirm:"Gruppe '{name}' wirklich l\xF6schen?",group_select_tasks:"Aufgaben ausw\xE4hlen",group_name_required:"Name erforderlich",description_optional:"Beschreibung (optional)",selected:"Ausgew\xE4hlt",loading_chart:"Daten werden geladen...",was_maintenance_needed:"War diese Wartung n\xF6tig?",feedback_needed:"N\xF6tig",feedback_not_needed:"Nicht n\xF6tig",feedback_not_sure:"Unsicher",suggested_interval:"Empfohlenes Intervall",apply_suggestion:"\xDCbernehmen",reanalyze:"Neu analysieren",reanalyze_result:"Neue Analyse",reanalyze_insufficient_data:"Nicht gen\xFCgend Daten f\xFCr eine Empfehlung",data_points:"Datenpunkte",dismiss_suggestion:"Verwerfen",confidence_low:"Niedrig",confidence_medium:"Mittel",confidence_high:"Hoch",recommended:"empfohlen",seasonal_awareness:"Saisonale Anpassung",edit_seasonal_overrides:"Saison-Faktoren bearbeiten",seasonal_overrides_title:"Saisonale Faktoren (Override)",seasonal_overrides_hint:"Faktor pro Monat (0.1\u20135.0). Leer = automatisch gelernt.",seasonal_override_invalid:"Ung\xFCltiger Wert",seasonal_override_range:"Faktor muss zwischen 0.1 und 5.0 liegen",clear_all:"Alle zur\xFCcksetzen",seasonal_chart_title:"Saisonale Faktoren",seasonal_learned:"Gelernt",seasonal_manual:"Manuell",month_jan:"Jan",month_feb:"Feb",month_mar:"M\xE4r",month_apr:"Apr",month_may:"Mai",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dez",sensor_prediction:"Sensorvorhersage",degradation_trend:"Trend",trend_rising:"Steigend",trend_falling:"Fallend",trend_stable:"Stabil",trend_insufficient_data:"Unzureichende Daten",days_until_threshold:"Tage bis Schwellwert",threshold_exceeded:"Schwellwert \xFCberschritten",environmental_adjustment:"Umgebungsfaktor",sensor_prediction_urgency:"Sensor prognostiziert Schwellwert in ~{days} Tagen",day_short:"Tag",weibull_reliability_curve:"Zuverl\xE4ssigkeitskurve",weibull_failure_probability:"Ausfallwahrscheinlichkeit",weibull_r_squared:"G\xFCte R\xB2",beta_early_failures:"Fr\xFChausf\xE4lle",beta_random_failures:"Zuf\xE4llige Ausf\xE4lle",beta_wear_out:"Verschlei\xDF",beta_highly_predictable:"Hochvorhersagbar",confidence_interval:"Konfidenzintervall",confidence_conservative:"Konservativ",confidence_aggressive:"Optimistisch",current_interval_marker:"Aktuelles Intervall",recommended_marker:"Empfohlen",characteristic_life:"Charakteristische Lebensdauer",chart_mini_sparkline:"Trend-Sparkline",chart_history:"Kosten- und Dauer-Verlauf",chart_seasonal:"Saisonfaktoren, 12 Monate",chart_weibull:"Weibull-Zuverl\xE4ssigkeitskurve",chart_sparkline:"Sensor-Triggerwert-Verlauf",days_progress:"Tagesfortschritt",qr_code:"QR-Code",qr_generating:"QR-Code wird generiert\u2026",qr_error:"QR-Code konnte nicht generiert werden.",qr_error_no_url:"Keine HA-URL konfiguriert. Bitte unter Einstellungen \u2192 System \u2192 Netzwerk eine externe oder interne URL setzen.",save_error:"Fehler beim Speichern. Bitte erneut versuchen.",qr_print:"Drucken",qr_download:"SVG herunterladen",qr_action:"Aktion beim Scannen",qr_action_view:"Wartungsinfo anzeigen",qr_action_complete:"Wartung als erledigt markieren",qr_url_mode:"Link-Typ",qr_mode_companion:"Companion App",qr_mode_local:"Lokal (mDNS)",qr_mode_server:"Server-URL",overview:"\xDCbersicht",analysis:"Analyse",recent_activities:"Letzte Aktivit\xE4ten",search_notes:"Notizen durchsuchen",avg_cost:"\xD8 Kosten",no_advanced_features:"Keine erweiterten Funktionen aktiviert",no_advanced_features_hint:"Aktiviere \u201EAdaptive Intervalle\u201C oder \u201ESaisonale Muster\u201C in den Integrationseinstellungen, um hier Analysedaten zu sehen.",analysis_not_enough_data:"Noch nicht gen\xFCgend Daten f\xFCr die Analyse vorhanden.",analysis_not_enough_data_hint:"Die Weibull-Analyse ben\xF6tigt mindestens 5 abgeschlossene Wartungen, saisonale Muster werden nach 6+ Datenpunkten pro Monat sichtbar.",analysis_manual_task_hint:"Manuelle Aufgaben ohne Intervall erzeugen keine Analysedaten.",completions:"Abschl\xFCsse",current:"Aktuell",shorter:"K\xFCrzer",longer:"L\xE4nger",normal:"Normal",disabled:"Deaktiviert",compound_logic:"Verkn\xFCpfungslogik",card_title:"Titel",card_show_header:"Kopfzeile mit Statistiken anzeigen",card_show_actions:"Aktionsbuttons anzeigen",card_compact:"Kompaktmodus",card_max_items:"Max. Eintr\xE4ge (0 = alle)",card_filter_status:"Nach Status filtern",card_filter_status_help:"Leer = alle Status zeigen.",card_filter_objects:"Nach Objekten filtern",card_filter_objects_help:"Leer = alle Objekte zeigen.",card_filter_entities:"Nach Entit\xE4ten filtern (entity_ids)",card_filter_entities_help:"W\xE4hle Sensor-/Binary-Sensor-Entit\xE4ten dieser Integration. Leer = alle.",card_loading_objects:"Lade Objekte\u2026",card_load_error:"Objekte konnten nicht geladen werden \u2014 bitte WS-Verbindung pr\xFCfen.",card_no_tasks_title:"Noch keine Wartungsaufgaben",card_no_tasks_cta:"\u2192 Im Maintenance-Panel anlegen",no_objects:"Keine Objekte vorhanden.",action_error:"Aktion fehlgeschlagen. Bitte erneut versuchen.",area_id_optional:"Bereich (optional)",installation_date_optional:"Installationsdatum (optional)",custom_icon_optional:"Icon (optional, z.B. mdi:wrench)",task_enabled:"Aufgabe aktiviert",skip_reason_prompt:"Aufgabe \xFCberspringen?",reason_optional:"Grund (optional)",reset_date_prompt:"Aufgabe als ausgef\xFChrt markieren?",reset_date_optional:"Letztes Erledigungs-Datum (optional, Standard: heute)",notes_label:"Notizen",documentation_label:"Dokumentation",no_nfc_tag:"\u2014 Kein Tag \u2014",dashboard:"Dashboard",settings:"Einstellungen",settings_features:"Erweiterte Funktionen",settings_features_desc:"Erweiterte Funktionen ein- oder ausschalten. Deaktivieren blendet sie in der Oberfl\xE4che aus, l\xF6scht aber keine Daten.",feat_adaptive:"Adaptive Intervalle",feat_adaptive_desc:"Optimale Intervalle aus Wartungshistorie lernen",feat_predictions:"Sensorvorhersagen",feat_predictions_desc:"Trigger-Datum anhand von Sensordegradation vorhersagen",feat_seasonal:"Saisonale Anpassungen",feat_seasonal_desc:"Intervalle basierend auf saisonalen Mustern anpassen",feat_environmental:"Umgebungskorrelation",feat_environmental_desc:"Intervalle mit Temperatur/Luftfeuchtigkeit korrelieren",feat_budget:"Budgetverfolgung",feat_budget_desc:"Monatliche und j\xE4hrliche Wartungsausgaben verfolgen",feat_groups:"Aufgabengruppen",feat_groups_desc:"Aufgaben in logische Gruppen organisieren",feat_checklists:"Checklisten",feat_checklists_desc:"Mehrstufige Verfahren zur Aufgabenerlediung",settings_general:"Allgemein",settings_default_warning:"Standard-Warntage",settings_panel_enabled:"Seitenleisten-Panel",settings_notifications:"Benachrichtigungen",settings_notify_service:"Benachrichtigungsdienst",test_notification:"Test-Benachrichtigung",send_test:"Test senden",testing:"Sende\u2026",test_notification_success:"Test-Benachrichtigung gesendet",test_notification_failed:"Test-Benachrichtigung fehlgeschlagen",settings_notify_due_soon:"Bei baldiger F\xE4lligkeit benachrichtigen",settings_notify_overdue:"Bei \xDCberf\xE4lligkeit benachrichtigen",settings_notify_triggered:"Bei Ausl\xF6sung benachrichtigen",settings_interval_hours:"Wiederholungsintervall (Stunden, 0 = einmalig)",settings_quiet_hours:"Ruhezeiten",settings_quiet_start:"Beginn",settings_quiet_end:"Ende",settings_max_per_day:"Max. Benachrichtigungen pro Tag (0 = unbegrenzt)",settings_bundling:"Benachrichtigungen b\xFCndeln",settings_bundle_threshold:"B\xFCndelungsschwelle",settings_actions:"Mobile Aktionsbuttons",settings_action_complete:'"Erledigt"-Button anzeigen',settings_action_skip:'"\xDCberspringen"-Button anzeigen',settings_action_snooze:'"Schlummern"-Button anzeigen',settings_snooze_hours:"Schlummerdauer (Stunden)",settings_budget:"Budget",settings_currency:"W\xE4hrung",settings_budget_monthly:"Monatsbudget",settings_budget_yearly:"Jahresbudget",settings_budget_alerts:"Budget-Warnungen",settings_budget_threshold:"Warnschwelle (%)",settings_import_export:"Import / Export",settings_export_json:"JSON exportieren",settings_export_csv:"CSV exportieren",settings_import_csv:"CSV importieren",settings_import_placeholder:"JSON- oder CSV-Inhalt hier einf\xFCgen\u2026",settings_import_btn:"Importieren",settings_import_success:"{count} Objekte erfolgreich importiert.",settings_export_success:"Export heruntergeladen.",settings_saved:"Einstellung gespeichert.",settings_include_history:"Verlauf einbeziehen",sort_alphabetical:"Alphabetisch",sort_due_soonest:"Fr\xFChestens f\xE4llig",sort_task_count:"Aufgaben-Anzahl",sort_area:"Bereich",sort_assigned_user:"Verantwortlicher",sort_group:"Gruppe",groupby_none:"Keine Gruppierung",groupby_area:"Nach Bereich",groupby_group:"Nach Gruppe",groupby_user:"Nach Verantwortlichem",filter_label:"Filter",user_label:"Benutzer",sort_label:"Sortierung",group_by_label:"Gruppieren nach",state_value_help:'Verwende den HA-Zustandswert (meist kleingeschrieben, z.\u202FB. "on"/"off"). Gro\xDF-/Kleinschreibung wird beim Speichern normalisiert.',target_changes_help:"Anzahl der passenden \xDCberg\xE4nge, nach denen der Trigger ausl\xF6st (Standard: 1).",qr_print_title:"QR-Codes drucken",qr_print_desc:"Erzeuge eine Druckseite mit QR-Codes zum Ausschneiden und Anbringen an den Ger\xE4ten.",qr_print_load:"Objekte laden",qr_print_filter:"Filter",qr_print_objects:"Objekte",qr_print_actions:"Aktionen",qr_print_url_mode:"Link-Typ",qr_print_estimate:"Gesch\xE4tzte QR-Codes",qr_print_over_limit:"Obergrenze ist 200, bitte Filter eingrenzen",qr_print_generate:"QR-Codes erzeugen",qr_print_generating:"Erzeuge\u2026",qr_print_ready:"QR-Codes bereit",qr_print_print_button:"Drucken",qr_print_empty:"Keine QR-Codes zu erzeugen",qr_action_skip:"\xDCberspringen",unassigned:"Nicht zugewiesen",no_area:"Kein Bereich",has_overdue:"\xDCberf\xE4llige Aufgaben",object:"Objekt",settings_panel_access:"Panel-Zugriff",settings_panel_access_desc:"Admins sehen immer das vollst\xE4ndige Panel. W\xE4hle hier Non-Admin-User aus, die ebenfalls Vollzugriff bekommen sollen \u2014 alle anderen Non-Admins sehen nur Abhaken/\xDCberspringen.",no_non_admin_users:"Keine Non-Admin-User gefunden. Lege welche unter Einstellungen \u2192 Personen an.",owner_label:"Owner"},sa={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",ok:"OK",all:"All",new_object:"+ New Object",edit:"Edit",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",reset:"Reset",cancel:"Cancel",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",runtime_hours:"Target runtime (hours)",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",custom:"Custom",history:"History",cost:"Cost",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_optional:"Due at time (optional, HH:MM)",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",tasks_lower:"tasks",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",no_advanced_features_hint:"Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",completions:"completions",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",installation_date_optional:"Installation date (optional)",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_predictions:"Sensor Predictions",feat_predictions_desc:"Predict trigger dates from sensor degradation",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_panel_enabled:"Sidebar panel",settings_notifications:"Notifications",settings_notify_service:"Notification service",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_snooze_hours:"Snooze duration (hours)",settings_budget:"Budget",settings_currency:"Currency",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_csv:"Export CSV",settings_import_csv:"Import CSV",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",filter_label:"Filter",user_label:"User",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always see the full panel. Pick non-admin users below who should also get full panel access \u2014 every other non-admin sees only Complete and Skip.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner"},ra={maintenance:"Onderhoud",objects:"Objecten",tasks:"Taken",overdue:"Achterstallig",due_soon:"Binnenkort",triggered:"Geactiveerd",ok:"OK",all:"Alle",new_object:"+ Nieuw object",edit:"Bewerken",delete:"Verwijderen",add_task:"+ Taak",complete:"Voltooid",completed:"Voltooid",skip:"Overslaan",skipped:"Overgeslagen",reset:"Resetten",cancel:"Annuleren",completing:"Wordt voltooid\u2026",interval:"Interval",warning:"Waarschuwing",last_performed:"Laatst uitgevoerd",next_due:"Volgende keer",days_until_due:"Dagen tot vervaldatum",avg_duration:"\xD8 Duur",trigger:"Trigger",trigger_type:"Triggertype",threshold_above:"Bovengrens",threshold_below:"Ondergrens",threshold:"Drempelwaarde",counter:"Teller",state_change:"Statuswijziging",runtime:"Looptijd",runtime_hours:"Doellooptijd (uren)",target_value:"Doelwaarde",baseline:"Basislijn",target_changes:"Doelwijzigingen",for_minutes:"Voor (minuten)",time_based:"Tijdgebaseerd",sensor_based:"Sensorgebaseerd",manual:"Handmatig",cleaning:"Reiniging",inspection:"Inspectie",replacement:"Vervanging",calibration:"Kalibratie",service:"Service",custom:"Aangepast",history:"Geschiedenis",cost:"Kosten",duration:"Duur",both:"Beide",trigger_val:"Triggerwaarde",complete_title:"Voltooid: ",checklist:"Checklist",checklist_steps_optional:"Checklist-stappen (optioneel)",checklist_placeholder:`Filter schoonmaken
Pakking vervangen
Druk testen`,checklist_help:"E\xE9n stap per regel. Max. 100 items.",err_too_long:"{field}: te lang (max. {n} tekens)",err_too_short:"{field}: te kort (min. {n} tekens)",err_value_too_high:"{field}: te groot (max. {n})",err_value_too_low:"{field}: te klein (min. {n})",err_required:"{field}: verplicht",err_wrong_type:"{field}: verkeerd type (verwacht: {type})",err_invalid_choice:"{field}: niet-toegestane waarde",err_invalid_value:"{field}: ongeldige waarde",feat_schedule_time:"Tijd-van-dag-planning",feat_schedule_time_desc:"Taken vervallen op een specifieke tijd in plaats van middernacht.",schedule_time_optional:"Vervaldagstijd (optioneel, HH:MM)",schedule_time_help:"Leeg = middernacht (standaard). HA-tijdzone.",at_time:"om",notes_optional:"Notities (optioneel)",cost_optional:"Kosten (optioneel)",duration_minutes:"Duur in minuten (optioneel)",days:"dagen",day:"dag",today:"Vandaag",d_overdue:"d achterstallig",no_tasks:"Geen onderhoudstaken. Maak een object aan om te beginnen.",no_tasks_short:"Geen taken",no_history:"Nog geen geschiedenisitems.",show_all:"Alles tonen",cost_duration_chart:"Kosten & Duur",installed:"Ge\xEFnstalleerd",confirm_delete_object:"Dit object en alle bijbehorende taken verwijderen?",confirm_delete_task:"Deze taak verwijderen?",min:"Min",max:"Max",save:"Opslaan",saving:"Opslaan\u2026",edit_task:"Taak bewerken",new_task:"Nieuwe onderhoudstaak",task_name:"Taaknaam",maintenance_type:"Onderhoudstype",schedule_type:"Planningstype",interval_days:"Interval (dagen)",warning_days:"Waarschuwingsdagen",last_performed_optional:"Laatst uitgevoerd (optioneel)",interval_anchor:"Interval-anker",anchor_completion:"Vanaf voltooiing",anchor_planned:"Vanaf geplande datum (geen drift)",edit_object:"Object bewerken",name:"Naam",manufacturer_optional:"Fabrikant (optioneel)",model_optional:"Model (optioneel)",serial_number_optional:"Serienummer (optioneel)",serial_number_label:"S/N",sort_due_date:"Vervaldatum",sort_object:"Objectnaam",sort_type:"Type",sort_task_name:"Taaknaam",all_objects:"Alle objecten",tasks_lower:"taken",no_tasks_yet:"Nog geen taken",add_first_task:"Eerste taak toevoegen",trigger_configuration:"Triggerconfiguratie",entity_id:"Entiteits-ID",comma_separated:"kommagescheiden",entity_logic:"Entiteitslogica",entity_logic_any:"Elke entiteit triggert",entity_logic_all:"Alle entiteiten moeten triggeren",entities:"entiteiten",attribute_optional:"Attribuut (optioneel, leeg = status)",use_entity_state:"Entiteitsstatus gebruiken (geen attribuut)",trigger_above:"Activeren als boven",trigger_below:"Activeren als onder",for_at_least_minutes:"Voor minstens (minuten)",safety_interval_days:"Veiligheidsinterval (dagen, optioneel)",delta_mode:"Deltamodus",from_state_optional:"Van status (optioneel)",to_state_optional:"Naar status (optioneel)",documentation_url_optional:"Documentatie-URL (optioneel)",nfc_tag_id_optional:"NFC-tag-ID (optioneel)",environmental_entity_optional:"Omgevingssensor (optioneel)",environmental_entity_helper:"bv. sensor.buitentemperatuur \u2014 past het interval aan op basis van omgevingswaarden",environmental_attribute_optional:"Omgevingsattribuut (optioneel)",nfc_tag_id:"NFC-tag-ID",nfc_linked:"NFC-tag gekoppeld",nfc_link_hint:"Klik om NFC-tag te koppelen",responsible_user:"Verantwoordelijke gebruiker",no_user_assigned:"(Geen gebruiker toegewezen)",all_users:"Alle gebruikers",my_tasks:"Mijn taken",budget_monthly:"Maandbudget",budget_yearly:"Jaarbudget",groups:"Groepen",new_group:"Nieuwe groep",edit_group:"Groep bewerken",no_groups:"Nog geen groepen",delete_group:"Groep verwijderen",delete_group_confirm:"Groep '{name}' verwijderen?",group_select_tasks:"Taken selecteren",group_name_required:"Naam vereist",description_optional:"Beschrijving (optioneel)",selected:"Geselecteerd",loading_chart:"Grafiekgegevens laden...",was_maintenance_needed:"Was dit onderhoud nodig?",feedback_needed:"Nodig",feedback_not_needed:"Niet nodig",feedback_not_sure:"Niet zeker",suggested_interval:"Voorgesteld interval",apply_suggestion:"Toepassen",reanalyze:"Opnieuw analyseren",reanalyze_result:"Nieuwe analyse",reanalyze_insufficient_data:"Onvoldoende gegevens voor een aanbeveling",data_points:"datapunten",dismiss_suggestion:"Negeren",confidence_low:"Laag",confidence_medium:"Gemiddeld",confidence_high:"Hoog",recommended:"aanbevolen",seasonal_awareness:"Seizoensbewustzijn",edit_seasonal_overrides:"Seizoensfactoren bewerken",seasonal_overrides_title:"Seizoensfactoren (override)",seasonal_overrides_hint:"Factor per maand (0.1\u20135.0). Leeg = automatisch geleerd.",seasonal_override_invalid:"Ongeldige waarde",seasonal_override_range:"Factor moet tussen 0.1 en 5.0 liggen",clear_all:"Alles wissen",seasonal_chart_title:"Seizoensfactoren",seasonal_learned:"Geleerd",seasonal_manual:"Handmatig",month_jan:"Jan",month_feb:"Feb",month_mar:"Mrt",month_apr:"Apr",month_may:"Mei",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensorvoorspelling",degradation_trend:"Trend",trend_rising:"Stijgend",trend_falling:"Dalend",trend_stable:"Stabiel",trend_insufficient_data:"Onvoldoende gegevens",days_until_threshold:"Dagen tot drempelwaarde",threshold_exceeded:"Drempelwaarde overschreden",environmental_adjustment:"Omgevingsfactor",sensor_prediction_urgency:"Sensor voorspelt drempelwaarde in ~{days} dagen",day_short:"dag",weibull_reliability_curve:"Betrouwbaarheidscurve",weibull_failure_probability:"Faalkans",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Vroege uitval",beta_random_failures:"Willekeurige uitval",beta_wear_out:"Slijtage",beta_highly_predictable:"Zeer voorspelbaar",confidence_interval:"Betrouwbaarheidsinterval",confidence_conservative:"Conservatief",confidence_aggressive:"Optimistisch",current_interval_marker:"Huidig interval",recommended_marker:"Aanbevolen",characteristic_life:"Karakteristieke levensduur",chart_mini_sparkline:"Trend-sparkline",chart_history:"Kosten- en duurgeschiedenis",chart_seasonal:"Seizoensfactoren, 12 maanden",chart_weibull:"Weibull-betrouwbaarheidscurve",chart_sparkline:"Sensor-triggerwaardegrafiek",days_progress:"Dagenvoortgang",qr_code:"QR-code",qr_generating:"QR-code genereren\u2026",qr_error:"QR-code kon niet worden gegenereerd.",qr_error_no_url:"Geen HA-URL geconfigureerd. Stel een externe of interne URL in via Instellingen \u2192 Systeem \u2192 Netwerk.",save_error:"Opslaan mislukt. Probeer het opnieuw.",qr_print:"Afdrukken",qr_download:"SVG downloaden",qr_action:"Actie bij scannen",qr_action_view:"Onderhoudsinfo bekijken",qr_action_complete:"Onderhoud als voltooid markeren",qr_url_mode:"Linktype",qr_mode_companion:"Companion App",qr_mode_local:"Lokaal (mDNS)",qr_mode_server:"Server-URL",overview:"Overzicht",analysis:"Analyse",recent_activities:"Recente activiteiten",search_notes:"Notities doorzoeken",avg_cost:"\xD8 Kosten",no_advanced_features:"Geen geavanceerde functies ingeschakeld",no_advanced_features_hint:"Schakel \u201EAdaptieve Intervallen\u201D of \u201ESeizoenpatronen\u201D in via de integratie-instellingen om hier analysegegevens te zien.",analysis_not_enough_data:"Nog niet genoeg gegevens voor analyse.",analysis_not_enough_data_hint:"Weibull-analyse vereist minstens 5 voltooide onderhoudsbeurten; seizoenspatronen worden zichtbaar na 6+ datapunten per maand.",analysis_manual_task_hint:"Handmatige taken zonder interval genereren geen analysegegevens.",completions:"voltooiingen",current:"Huidig",shorter:"Korter",longer:"Langer",normal:"Normaal",disabled:"Uitgeschakeld",compound_logic:"Samengestelde logica",card_title:"Titel",card_show_header:"Koptekst met statistieken tonen",card_show_actions:"Actieknoppen tonen",card_compact:"Compacte modus",card_max_items:"Max items (0 = alle)",card_filter_status:"Filteren op status",card_filter_status_help:"Leeg = alle statussen tonen.",card_filter_objects:"Filteren op objecten",card_filter_objects_help:"Leeg = alle objecten tonen.",card_filter_entities:"Filteren op entiteiten (entity_ids)",card_filter_entities_help:"Kies sensor/binary_sensor entiteiten van deze integratie. Leeg = alle.",card_loading_objects:"Objecten laden\u2026",card_load_error:"Objecten konden niet worden geladen \u2014 controleer de WebSocket-verbinding.",card_no_tasks_title:"Nog geen onderhoudstaken",card_no_tasks_cta:"\u2192 Maak er een aan in het Maintenance-paneel",no_objects:"Nog geen objecten.",action_error:"Actie mislukt. Probeer het opnieuw.",area_id_optional:"Gebied (optioneel)",installation_date_optional:"Installatiedatum (optioneel)",custom_icon_optional:"Icoon (optioneel, bijv. mdi:wrench)",task_enabled:"Taak ingeschakeld",skip_reason_prompt:"Deze taak overslaan?",reason_optional:"Reden (optioneel)",reset_date_prompt:"Taak markeren als uitgevoerd?",reset_date_optional:"Laatste uitvoeringsdatum (optioneel, standaard vandaag)",notes_label:"Notities",documentation_label:"Documentatie",no_nfc_tag:"\u2014 Geen tag \u2014",dashboard:"Dashboard",settings:"Instellingen",settings_features:"Geavanceerde functies",settings_features_desc:"Schakel geavanceerde functies in of uit. Uitschakelen verbergt ze in de interface maar verwijdert geen gegevens.",feat_adaptive:"Adaptieve planning",feat_adaptive_desc:"Leer optimale intervallen uit onderhoudsgeschiedenis",feat_predictions:"Sensorvoorspellingen",feat_predictions_desc:"Voorspel triggerdatums op basis van sensordegradatie",feat_seasonal:"Seizoensaanpassingen",feat_seasonal_desc:"Pas intervallen aan op seizoenspatronen",feat_environmental:"Omgevingscorrelatie",feat_environmental_desc:"Correleer intervallen met temperatuur/vochtigheid",feat_budget:"Budgetbeheer",feat_budget_desc:"Volg maandelijkse en jaarlijkse onderhoudsuitgaven",feat_groups:"Taakgroepen",feat_groups_desc:"Organiseer taken in logische groepen",feat_checklists:"Checklists",feat_checklists_desc:"Meerstaps procedures voor taakvoltooiing",settings_general:"Algemeen",settings_default_warning:"Standaard waarschuwingsdagen",settings_panel_enabled:"Zijbalkpaneel",settings_notifications:"Meldingen",settings_notify_service:"Meldingsservice",test_notification:"Testmelding",send_test:"Test versturen",testing:"Verzenden\u2026",test_notification_success:"Testmelding verzonden",test_notification_failed:"Testmelding mislukt",settings_notify_due_soon:"Melding bij bijna verlopen",settings_notify_overdue:"Melding bij achterstallig",settings_notify_triggered:"Melding bij geactiveerd",settings_interval_hours:"Herhalingsinterval (uren, 0 = eenmalig)",settings_quiet_hours:"Stille uren",settings_quiet_start:"Start",settings_quiet_end:"Einde",settings_max_per_day:"Max meldingen per dag (0 = onbeperkt)",settings_bundling:"Meldingen bundelen",settings_bundle_threshold:"Bundeldrempel",settings_actions:"Mobiele actieknoppen",settings_action_complete:"Knop 'Voltooid' tonen",settings_action_skip:"Knop 'Overslaan' tonen",settings_action_snooze:"Knop 'Snooze' tonen",settings_snooze_hours:"Snoozeduur (uren)",settings_budget:"Budget",settings_currency:"Valuta",settings_budget_monthly:"Maandbudget",settings_budget_yearly:"Jaarbudget",settings_budget_alerts:"Budgetwaarschuwingen",settings_budget_threshold:"Waarschuwingsdrempel (%)",settings_import_export:"Import / Export",settings_export_json:"JSON exporteren",settings_export_csv:"CSV exporteren",settings_import_csv:"CSV importeren",settings_import_placeholder:"Plak JSON- of CSV-inhoud hier\u2026",settings_import_btn:"Importeren",settings_import_success:"{count} objecten succesvol ge\xEFmporteerd.",settings_export_success:"Export gedownload.",settings_saved:"Instelling opgeslagen.",settings_include_history:"Geschiedenis meenemen",sort_alphabetical:"Alfabetisch",sort_due_soonest:"Eerst vervallend",sort_task_count:"Aantal taken",sort_area:"Gebied",sort_assigned_user:"Toegewezen gebruiker",sort_group:"Groep",groupby_none:"Geen groepering",groupby_area:"Per gebied",groupby_group:"Per groep",groupby_user:"Per gebruiker",filter_label:"Filter",user_label:"Gebruiker",sort_label:"Sorteren",group_by_label:"Groeperen op",state_value_help:'Gebruik de HA-statuswaarde (meestal in kleine letters, bv. "on"/"off"). Hoofdletters worden bij opslaan genormaliseerd.',target_changes_help:"Aantal overeenkomende overgangen voordat de trigger wordt geactiveerd (standaard: 1).",qr_print_title:"QR-codes afdrukken",qr_print_desc:"Genereer een afdrukpagina met QR-codes om uit te knippen en op je apparaten te plakken.",qr_print_load:"Objecten laden",qr_print_filter:"Filter",qr_print_objects:"Objecten",qr_print_actions:"Acties",qr_print_url_mode:"Linktype",qr_print_estimate:"Geschatte QR-codes",qr_print_over_limit:"max is 200, beperk de filter",qr_print_generate:"QR-codes genereren",qr_print_generating:"Genereren\u2026",qr_print_ready:"QR-codes klaar",qr_print_print_button:"Afdrukken",qr_print_empty:"Niets te genereren",qr_action_skip:"Overslaan",unassigned:"Niet toegewezen",no_area:"Geen gebied",has_overdue:"Heeft achterstallige taken",object:"Object",settings_panel_access:"Paneel-toegang",settings_panel_access_desc:"Admins zien altijd het volledige paneel. Kies hier niet-admin gebruikers die ook volledige toegang krijgen \u2014 andere niet-admins zien alleen Voltooien en Overslaan.",no_non_admin_users:"Geen niet-admin gebruikers gevonden. Voeg ze toe in Instellingen \u2192 Personen.",owner_label:"Eigenaar"},oa={maintenance:"Maintenance",objects:"Objets",tasks:"T\xE2ches",overdue:"En retard",due_soon:"Bient\xF4t d\xFB",triggered:"D\xE9clench\xE9",ok:"OK",all:"Tous",new_object:"+ Nouvel objet",edit:"Modifier",delete:"Supprimer",add_task:"+ T\xE2che",complete:"Termin\xE9",completed:"Termin\xE9",skip:"Passer",skipped:"Ignor\xE9",reset:"R\xE9initialiser",cancel:"Annuler",completing:"En cours\u2026",interval:"Intervalle",warning:"Avertissement",last_performed:"Derni\xE8re ex\xE9cution",next_due:"Prochaine \xE9ch\xE9ance",days_until_due:"Jours restants",avg_duration:"\xD8 Dur\xE9e",trigger:"D\xE9clencheur",trigger_type:"Type de d\xE9clencheur",threshold_above:"Limite sup\xE9rieure",threshold_below:"Limite inf\xE9rieure",threshold:"Seuil",counter:"Compteur",state_change:"Changement d'\xE9tat",runtime:"Dur\xE9e de fonctionnement",runtime_hours:"Dur\xE9e cible (heures)",target_value:"Valeur cible",baseline:"Ligne de base",target_changes:"Changements cibles",for_minutes:"Pendant (minutes)",time_based:"Temporel",sensor_based:"Capteur",manual:"Manuel",cleaning:"Nettoyage",inspection:"Inspection",replacement:"Remplacement",calibration:"\xC9talonnage",service:"Service",custom:"Personnalis\xE9",history:"Historique",cost:"Co\xFBt",duration:"Dur\xE9e",both:"Les deux",trigger_val:"Valeur du d\xE9clencheur",complete_title:"Termin\xE9 : ",checklist:"Checklist",checklist_steps_optional:"\xC9tapes de la checklist (optionnel)",checklist_placeholder:`Nettoyer le filtre
Remplacer le joint
Tester la pression`,checklist_help:"Une \xE9tape par ligne. Max 100 \xE9l\xE9ments.",err_too_long:"{field} : trop long (max {n} caract\xE8res)",err_too_short:"{field} : trop court (min {n} caract\xE8res)",err_value_too_high:"{field} : trop grand (max {n})",err_value_too_low:"{field} : trop petit (min {n})",err_required:"{field} : champ obligatoire",err_wrong_type:"{field} : mauvais type (attendu : {type})",err_invalid_choice:"{field} : valeur non autoris\xE9e",err_invalid_value:"{field} : valeur invalide",feat_schedule_time:"Planification \xE0 l'heure",feat_schedule_time_desc:"Les t\xE2ches arrivent \xE0 \xE9ch\xE9ance \xE0 une heure pr\xE9cise plut\xF4t qu'\xE0 minuit.",schedule_time_optional:"\xC9ch\xE9ance \xE0 l'heure (optionnel, HH:MM)",schedule_time_help:"Vide = minuit (d\xE9faut). Fuseau horaire HA.",at_time:"\xE0",notes_optional:"Notes (optionnel)",cost_optional:"Co\xFBt (optionnel)",duration_minutes:"Dur\xE9e en minutes (optionnel)",days:"jours",day:"jour",today:"Aujourd'hui",d_overdue:"j en retard",no_tasks:"Aucune t\xE2che de maintenance. Cr\xE9ez un objet pour commencer.",no_tasks_short:"Aucune t\xE2che",no_history:"Aucun historique.",show_all:"Tout afficher",cost_duration_chart:"Co\xFBts & Dur\xE9e",installed:"Install\xE9",confirm_delete_object:"Supprimer cet objet et toutes ses t\xE2ches ?",confirm_delete_task:"Supprimer cette t\xE2che ?",min:"Min",max:"Max",save:"Enregistrer",saving:"Enregistrement\u2026",edit_task:"Modifier la t\xE2che",new_task:"Nouvelle t\xE2che de maintenance",task_name:"Nom de la t\xE2che",maintenance_type:"Type de maintenance",schedule_type:"Type de planification",interval_days:"Intervalle (jours)",warning_days:"Jours d'avertissement",last_performed_optional:"Derni\xE8re ex\xE9cution (optionnel)",interval_anchor:"Ancrage de l'intervalle",anchor_completion:"Depuis la date de r\xE9alisation",anchor_planned:"Depuis la date pr\xE9vue (sans d\xE9rive)",edit_object:"Modifier l'objet",name:"Nom",manufacturer_optional:"Fabricant (optionnel)",model_optional:"Mod\xE8le (optionnel)",serial_number_optional:"Num\xE9ro de s\xE9rie (optionnel)",serial_number_label:"N/S",sort_due_date:"\xC9ch\xE9ance",sort_object:"Nom de l'objet",sort_type:"Type",sort_task_name:"Nom de la t\xE2che",all_objects:"Tous les objets",tasks_lower:"t\xE2ches",no_tasks_yet:"Pas encore de t\xE2ches",add_first_task:"Ajouter la premi\xE8re t\xE2che",trigger_configuration:"Configuration du d\xE9clencheur",entity_id:"ID d'entit\xE9",comma_separated:"s\xE9par\xE9 par des virgules",entity_logic:"Logique d'entit\xE9",entity_logic_any:"N'importe quelle entit\xE9 d\xE9clenche",entity_logic_all:"Toutes les entit\xE9s doivent d\xE9clencher",entities:"entit\xE9s",attribute_optional:"Attribut (optionnel, vide = \xE9tat)",use_entity_state:"Utiliser l'\xE9tat de l'entit\xE9 (pas d'attribut)",trigger_above:"D\xE9clencher au-dessus de",trigger_below:"D\xE9clencher en dessous de",for_at_least_minutes:"Pendant au moins (minutes)",safety_interval_days:"Intervalle de s\xE9curit\xE9 (jours, optionnel)",delta_mode:"Mode delta",from_state_optional:"\xC9tat source (optionnel)",to_state_optional:"\xC9tat cible (optionnel)",documentation_url_optional:"URL de documentation (optionnel)",nfc_tag_id_optional:"ID tag NFC (optionnel)",environmental_entity_optional:"Capteur d'environnement (optionnel)",environmental_entity_helper:"ex. sensor.temperature_exterieure \u2014 ajuste l'intervalle selon les conditions environnementales",environmental_attribute_optional:"Attribut d'environnement (optionnel)",nfc_tag_id:"ID tag NFC",nfc_linked:"Tag NFC li\xE9",nfc_link_hint:"Cliquer pour associer un tag NFC",responsible_user:"Utilisateur responsable",no_user_assigned:"(Aucun utilisateur assign\xE9)",all_users:"Tous les utilisateurs",my_tasks:"Mes t\xE2ches",budget_monthly:"Budget mensuel",budget_yearly:"Budget annuel",groups:"Groupes",new_group:"Nouveau groupe",edit_group:"Modifier le groupe",no_groups:"Aucun groupe pour l'instant",delete_group:"Supprimer le groupe",delete_group_confirm:"Supprimer le groupe '{name}' ?",group_select_tasks:"S\xE9lectionner les t\xE2ches",group_name_required:"Nom requis",description_optional:"Description (optionnel)",selected:"S\xE9lectionn\xE9",loading_chart:"Chargement des donn\xE9es...",was_maintenance_needed:"Cette maintenance \xE9tait-elle n\xE9cessaire ?",feedback_needed:"N\xE9cessaire",feedback_not_needed:"Pas n\xE9cessaire",feedback_not_sure:"Pas s\xFBr",suggested_interval:"Intervalle sugg\xE9r\xE9",apply_suggestion:"Appliquer",reanalyze:"R\xE9analyser",reanalyze_result:"Nouvelle analyse",reanalyze_insufficient_data:"Donn\xE9es insuffisantes pour une recommandation",data_points:"points de donn\xE9es",dismiss_suggestion:"Ignorer",confidence_low:"Faible",confidence_medium:"Moyen",confidence_high:"\xC9lev\xE9",recommended:"recommand\xE9",seasonal_awareness:"Conscience saisonni\xE8re",edit_seasonal_overrides:"Modifier les facteurs saisonniers",seasonal_overrides_title:"Facteurs saisonniers (override)",seasonal_overrides_hint:"Facteur par mois (0.1\u20135.0). Vide = appris automatiquement.",seasonal_override_invalid:"Valeur invalide",seasonal_override_range:"Le facteur doit \xEAtre entre 0.1 et 5.0",clear_all:"Tout effacer",seasonal_chart_title:"Facteurs saisonniers",seasonal_learned:"Appris",seasonal_manual:"Manuel",month_jan:"Jan",month_feb:"F\xE9v",month_mar:"Mar",month_apr:"Avr",month_may:"Mai",month_jun:"Juin",month_jul:"Juil",month_aug:"Ao\xFBt",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"D\xE9c",sensor_prediction:"Pr\xE9diction capteur",degradation_trend:"Tendance",trend_rising:"En hausse",trend_falling:"En baisse",trend_stable:"Stable",trend_insufficient_data:"Donn\xE9es insuffisantes",days_until_threshold:"Jours avant le seuil",threshold_exceeded:"Seuil d\xE9pass\xE9",environmental_adjustment:"Facteur environnemental",sensor_prediction_urgency:"Le capteur pr\xE9voit le seuil dans ~{days} jours",day_short:"jour",weibull_reliability_curve:"Courbe de fiabilit\xE9",weibull_failure_probability:"Probabilit\xE9 de d\xE9faillance",weibull_r_squared:"Ajustement R\xB2",beta_early_failures:"D\xE9faillances pr\xE9coces",beta_random_failures:"D\xE9faillances al\xE9atoires",beta_wear_out:"Usure",beta_highly_predictable:"Tr\xE8s pr\xE9visible",confidence_interval:"Intervalle de confiance",confidence_conservative:"Conservateur",confidence_aggressive:"Optimiste",current_interval_marker:"Intervalle actuel",recommended_marker:"Recommand\xE9",characteristic_life:"Dur\xE9e de vie caract\xE9ristique",chart_mini_sparkline:"Sparkline de tendance",chart_history:"Historique co\xFBts et dur\xE9e",chart_seasonal:"Facteurs saisonniers, 12 mois",chart_weibull:"Courbe de fiabilit\xE9 Weibull",chart_sparkline:"Graphique valeur d\xE9clencheur",days_progress:"Progression en jours",qr_code:"QR Code",qr_generating:"G\xE9n\xE9ration du QR code\u2026",qr_error:"Impossible de g\xE9n\xE9rer le QR code.",qr_error_no_url:"Aucune URL HA configur\xE9e. Veuillez d\xE9finir une URL externe ou interne dans Param\xE8tres \u2192 Syst\xE8me \u2192 R\xE9seau.",save_error:"\xC9chec de l'enregistrement. Veuillez r\xE9essayer.",qr_print:"Imprimer",qr_download:"T\xE9l\xE9charger SVG",qr_action:"Action au scan",qr_action_view:"Afficher les infos de maintenance",qr_action_complete:"Marquer la maintenance comme termin\xE9e",qr_url_mode:"Type de lien",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"URL serveur",overview:"Aper\xE7u",analysis:"Analyse",recent_activities:"Activit\xE9s r\xE9centes",search_notes:"Rechercher dans les notes",avg_cost:"\xD8 Co\xFBt",no_advanced_features:"Aucune fonction avanc\xE9e activ\xE9e",no_advanced_features_hint:"Activez \xAB Intervalles adaptatifs \xBB ou \xAB Tendances saisonni\xE8res \xBB dans les param\xE8tres de l'int\xE9gration pour voir les donn\xE9es d'analyse ici.",analysis_not_enough_data:"Pas encore assez de donn\xE9es pour l'analyse.",analysis_not_enough_data_hint:"L'analyse Weibull n\xE9cessite au moins 5 maintenances termin\xE9es ; les tendances saisonni\xE8res apparaissent apr\xE8s 6+ points par mois.",analysis_manual_task_hint:"Les t\xE2ches manuelles sans intervalle ne g\xE9n\xE8rent pas de donn\xE9es d'analyse.",completions:"r\xE9alisations",current:"Actuel",shorter:"Plus court",longer:"Plus long",normal:"Normal",disabled:"D\xE9sactiv\xE9",compound_logic:"Logique compos\xE9e",card_title:"Titre",card_show_header:"Afficher l'en-t\xEAte avec statistiques",card_show_actions:"Afficher les boutons d'action",card_compact:"Mode compact",card_max_items:"Nombre max (0 = tous)",card_filter_status:"Filtrer par statut",card_filter_status_help:"Vide = afficher tous les statuts.",card_filter_objects:"Filtrer par objets",card_filter_objects_help:"Vide = afficher tous les objets.",card_filter_entities:"Filtrer par entit\xE9s (entity_ids)",card_filter_entities_help:"Choisissez des entit\xE9s sensor / binary_sensor de cette int\xE9gration. Vide = toutes.",card_loading_objects:"Chargement des objets\u2026",card_load_error:"Impossible de charger les objets \u2014 v\xE9rifiez la connexion WebSocket.",card_no_tasks_title:"Aucune t\xE2che de maintenance pour l'instant",card_no_tasks_cta:"\u2192 Cr\xE9ez-en une dans le panneau Maintenance",no_objects:"Aucun objet pour l'instant.",action_error:"Action \xE9chou\xE9e. Veuillez r\xE9essayer.",area_id_optional:"Zone (optionnel)",installation_date_optional:"Date d'installation (optionnel)",custom_icon_optional:"Ic\xF4ne (optionnel, ex. mdi:wrench)",task_enabled:"T\xE2che activ\xE9e",skip_reason_prompt:"Ignorer cette t\xE2che ?",reason_optional:"Raison (optionnel)",reset_date_prompt:"Marquer la t\xE2che comme effectu\xE9e ?",reset_date_optional:"Date de derni\xE8re ex\xE9cution (optionnel, d\xE9faut : aujourd'hui)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 Aucun tag \u2014",dashboard:"Tableau de bord",settings:"Param\xE8tres",settings_features:"Fonctions avanc\xE9es",settings_features_desc:"Activez ou d\xE9sactivez les fonctions avanc\xE9es. La d\xE9sactivation les masque dans l'interface mais ne supprime pas les donn\xE9es.",feat_adaptive:"Planification adaptative",feat_adaptive_desc:"Apprendre les intervalles optimaux \xE0 partir de l'historique",feat_predictions:"Pr\xE9dictions capteurs",feat_predictions_desc:"Pr\xE9dire les dates de d\xE9clenchement par d\xE9gradation des capteurs",feat_seasonal:"Ajustements saisonniers",feat_seasonal_desc:"Ajuster les intervalles selon les tendances saisonni\xE8res",feat_environmental:"Corr\xE9lation environnementale",feat_environmental_desc:"Corr\xE9ler les intervalles avec la temp\xE9rature/humidit\xE9",feat_budget:"Suivi budg\xE9taire",feat_budget_desc:"Suivre les d\xE9penses de maintenance mensuelles et annuelles",feat_groups:"Groupes de t\xE2ches",feat_groups_desc:"Organiser les t\xE2ches en groupes logiques",feat_checklists:"Checklists",feat_checklists_desc:"Proc\xE9dures multi-\xE9tapes pour la r\xE9alisation des t\xE2ches",settings_general:"G\xE9n\xE9ral",settings_default_warning:"Jours d'avertissement par d\xE9faut",settings_panel_enabled:"Panneau lat\xE9ral",settings_notifications:"Notifications",settings_notify_service:"Service de notification",test_notification:"Notification de test",send_test:"Envoyer le test",testing:"Envoi en cours\u2026",test_notification_success:"Notification de test envoy\xE9e",test_notification_failed:"\xC9chec de la notification de test",settings_notify_due_soon:"Notifier quand bient\xF4t d\xFB",settings_notify_overdue:"Notifier quand en retard",settings_notify_triggered:"Notifier quand d\xE9clench\xE9",settings_interval_hours:"Intervalle de r\xE9p\xE9tition (heures, 0 = une fois)",settings_quiet_hours:"Heures de silence",settings_quiet_start:"D\xE9but",settings_quiet_end:"Fin",settings_max_per_day:"Max notifications par jour (0 = illimit\xE9)",settings_bundling:"Regrouper les notifications",settings_bundle_threshold:"Seuil de regroupement",settings_actions:"Boutons d'action mobiles",settings_action_complete:"Afficher le bouton 'Termin\xE9'",settings_action_skip:"Afficher le bouton 'Passer'",settings_action_snooze:"Afficher le bouton 'Reporter'",settings_snooze_hours:"Dur\xE9e de report (heures)",settings_budget:"Budget",settings_currency:"Devise",settings_budget_monthly:"Budget mensuel",settings_budget_yearly:"Budget annuel",settings_budget_alerts:"Alertes budg\xE9taires",settings_budget_threshold:"Seuil d'alerte (%)",settings_import_export:"Import / Export",settings_export_json:"Exporter JSON",settings_export_csv:"Exporter CSV",settings_import_csv:"Importer CSV",settings_import_placeholder:"Collez le contenu JSON ou CSV ici\u2026",settings_import_btn:"Importer",settings_import_success:"{count} objets import\xE9s avec succ\xE8s.",settings_export_success:"Export t\xE9l\xE9charg\xE9.",settings_saved:"Param\xE8tre enregistr\xE9.",settings_include_history:"Inclure l'historique",sort_alphabetical:"Alphab\xE9tique",sort_due_soonest:"\xC9ch\xE9ance la plus proche",sort_task_count:"Nombre de t\xE2ches",sort_area:"Zone",sort_assigned_user:"Utilisateur affect\xE9",sort_group:"Groupe",groupby_none:"Aucun groupement",groupby_area:"Par zone",groupby_group:"Par groupe",groupby_user:"Par utilisateur",filter_label:"Filtre",user_label:"Utilisateur",sort_label:"Tri",group_by_label:"Grouper par",state_value_help:`Utilisez la valeur d'\xE9tat HA (g\xE9n\xE9ralement en minuscules, p.\u202Fex. "on"/"off"). La casse est normalis\xE9e \xE0 l'enregistrement.`,target_changes_help:"Nombre de transitions correspondantes avant le d\xE9clenchement (par d\xE9faut\u202F: 1).",qr_print_title:"Imprimer les QR codes",qr_print_desc:"G\xE9n\xE9rer une page imprimable de QR codes \xE0 d\xE9couper et coller sur votre \xE9quipement.",qr_print_load:"Charger les objets",qr_print_filter:"Filtre",qr_print_objects:"Objets",qr_print_actions:"Actions",qr_print_url_mode:"Type de lien",qr_print_estimate:"QR codes estim\xE9s",qr_print_over_limit:"limite \xE0 200, affinez le filtre",qr_print_generate:"G\xE9n\xE9rer les QR codes",qr_print_generating:"G\xE9n\xE9ration\u2026",qr_print_ready:"QR codes pr\xEAts",qr_print_print_button:"Imprimer",qr_print_empty:"Rien \xE0 g\xE9n\xE9rer",qr_action_skip:"Passer",unassigned:"Non assign\xE9",no_area:"Aucune zone",has_overdue:"T\xE2ches en retard",object:"Objet",settings_panel_access:"Acc\xE8s au panneau",settings_panel_access_desc:"Les administrateurs voient toujours le panneau complet. S\xE9lectionnez ici les utilisateurs non administrateurs qui devraient aussi avoir l'acc\xE8s complet \u2014 les autres ne voient que Terminer et Ignorer.",no_non_admin_users:"Aucun utilisateur non administrateur trouv\xE9. Ajoutez-en dans Param\xE8tres \u2192 Personnes.",owner_label:"Propri\xE9taire"},la={maintenance:"Manutenzione",objects:"Oggetti",tasks:"Attivit\xE0",overdue:"Scaduto",due_soon:"In scadenza",triggered:"Attivato",ok:"OK",all:"Tutti",new_object:"+ Nuovo oggetto",edit:"Modifica",delete:"Elimina",add_task:"+ Attivit\xE0",complete:"Completato",completed:"Completato",skip:"Salta",skipped:"Saltato",reset:"Reimposta",cancel:"Annulla",completing:"Completamento\u2026",interval:"Intervallo",warning:"Avviso",last_performed:"Ultima esecuzione",next_due:"Prossima scadenza",days_until_due:"Giorni alla scadenza",avg_duration:"\xD8 Durata",trigger:"Trigger",trigger_type:"Tipo di trigger",threshold_above:"Limite superiore",threshold_below:"Limite inferiore",threshold:"Soglia",counter:"Contatore",state_change:"Cambio di stato",runtime:"Tempo di funzionamento",runtime_hours:"Durata obiettivo (ore)",target_value:"Valore obiettivo",baseline:"Linea di base",target_changes:"Modifiche obiettivo",for_minutes:"Per (minuti)",time_based:"Temporale",sensor_based:"Sensore",manual:"Manuale",cleaning:"Pulizia",inspection:"Ispezione",replacement:"Sostituzione",calibration:"Calibrazione",service:"Servizio",custom:"Personalizzato",history:"Cronologia",cost:"Costo",duration:"Durata",both:"Entrambi",trigger_val:"Valore trigger",complete_title:"Completato: ",checklist:"Checklist",checklist_steps_optional:"Passaggi della checklist (opzionale)",checklist_placeholder:`Pulire il filtro
Sostituire la guarnizione
Testare la pressione`,checklist_help:"Un passaggio per riga. Max 100 elementi.",err_too_long:"{field}: troppo lungo (max {n} caratteri)",err_too_short:"{field}: troppo corto (min {n} caratteri)",err_value_too_high:"{field}: troppo grande (max {n})",err_value_too_low:"{field}: troppo piccolo (min {n})",err_required:"{field}: campo obbligatorio",err_wrong_type:"{field}: tipo errato (atteso: {type})",err_invalid_choice:"{field}: valore non consentito",err_invalid_value:"{field}: valore non valido",feat_schedule_time:"Pianificazione oraria",feat_schedule_time_desc:"Le attivit\xE0 scadono a un'ora specifica anzich\xE9 a mezzanotte.",schedule_time_optional:"Scadenza all'ora (opzionale, HH:MM)",schedule_time_help:"Vuoto = mezzanotte (default). Fuso orario HA.",at_time:"alle",notes_optional:"Note (opzionale)",cost_optional:"Costo (opzionale)",duration_minutes:"Durata in minuti (opzionale)",days:"giorni",day:"giorno",today:"Oggi",d_overdue:"g in ritardo",no_tasks:"Nessuna attivit\xE0 di manutenzione. Crea un oggetto per iniziare.",no_tasks_short:"Nessuna attivit\xE0",no_history:"Nessuna voce nella cronologia.",show_all:"Mostra tutto",cost_duration_chart:"Costi & Durata",installed:"Installato",confirm_delete_object:"Eliminare questo oggetto e tutte le sue attivit\xE0?",confirm_delete_task:"Eliminare questa attivit\xE0?",min:"Min",max:"Max",save:"Salva",saving:"Salvataggio\u2026",edit_task:"Modifica attivit\xE0",new_task:"Nuova attivit\xE0 di manutenzione",task_name:"Nome attivit\xE0",maintenance_type:"Tipo di manutenzione",schedule_type:"Tipo di pianificazione",interval_days:"Intervallo (giorni)",warning_days:"Giorni di avviso",last_performed_optional:"Ultima esecuzione (opzionale)",interval_anchor:"Ancoraggio intervallo",anchor_completion:"Dalla data di completamento",anchor_planned:"Dalla data pianificata (nessuna deriva)",edit_object:"Modifica oggetto",name:"Nome",manufacturer_optional:"Produttore (opzionale)",model_optional:"Modello (opzionale)",serial_number_optional:"Numero di serie (opzionale)",serial_number_label:"N/S",sort_due_date:"Scadenza",sort_object:"Nome oggetto",sort_type:"Tipo",sort_task_name:"Nome attivit\xE0",all_objects:"Tutti gli oggetti",tasks_lower:"attivit\xE0",no_tasks_yet:"Nessuna attivit\xE0",add_first_task:"Aggiungi prima attivit\xE0",trigger_configuration:"Configurazione trigger",entity_id:"ID entit\xE0",comma_separated:"separati da virgola",entity_logic:"Logica entit\xE0",entity_logic_any:"Qualsiasi entit\xE0 attiva",entity_logic_all:"Tutte le entit\xE0 devono attivare",entities:"entit\xE0",attribute_optional:"Attributo (opzionale, vuoto = stato)",use_entity_state:"Usa stato dell'entit\xE0 (nessun attributo)",trigger_above:"Attivare sopra",trigger_below:"Attivare sotto",for_at_least_minutes:"Per almeno (minuti)",safety_interval_days:"Intervallo di sicurezza (giorni, opzionale)",delta_mode:"Modalit\xE0 delta",from_state_optional:"Dallo stato (opzionale)",to_state_optional:"Allo stato (opzionale)",documentation_url_optional:"URL documentazione (opzionale)",nfc_tag_id_optional:"ID tag NFC (opzionale)",environmental_entity_optional:"Sensore ambientale (opzionale)",environmental_entity_helper:"es. sensor.temperatura_esterna \u2014 regola l'intervallo in base alle condizioni ambientali",environmental_attribute_optional:"Attributo ambientale (opzionale)",nfc_tag_id:"ID tag NFC",nfc_linked:"Tag NFC collegato",nfc_link_hint:"Clicca per collegare un tag NFC",responsible_user:"Utente responsabile",no_user_assigned:"(Nessun utente assegnato)",all_users:"Tutti gli utenti",my_tasks:"Le mie attivit\xE0",budget_monthly:"Budget mensile",budget_yearly:"Budget annuale",groups:"Gruppi",new_group:"Nuovo gruppo",edit_group:"Modifica gruppo",no_groups:"Nessun gruppo",delete_group:"Elimina gruppo",delete_group_confirm:"Eliminare il gruppo '{name}'?",group_select_tasks:"Seleziona attivit\xE0",group_name_required:"Nome richiesto",description_optional:"Descrizione (opzionale)",selected:"Selezionato",loading_chart:"Caricamento dati...",was_maintenance_needed:"Questa manutenzione era necessaria?",feedback_needed:"Necessaria",feedback_not_needed:"Non necessaria",feedback_not_sure:"Non sicuro",suggested_interval:"Intervallo suggerito",apply_suggestion:"Applica",reanalyze:"Rianalizza",reanalyze_result:"Nuova analisi",reanalyze_insufficient_data:"Dati insufficienti per una raccomandazione",data_points:"punti dati",dismiss_suggestion:"Ignora",confidence_low:"Bassa",confidence_medium:"Media",confidence_high:"Alta",recommended:"consigliato",seasonal_awareness:"Consapevolezza stagionale",edit_seasonal_overrides:"Modifica fattori stagionali",seasonal_overrides_title:"Fattori stagionali (override)",seasonal_overrides_hint:"Fattore per mese (0.1\u20135.0). Vuoto = appreso automaticamente.",seasonal_override_invalid:"Valore non valido",seasonal_override_range:"Il fattore deve essere tra 0.1 e 5.0",clear_all:"Cancella tutto",seasonal_chart_title:"Fattori stagionali",seasonal_learned:"Appreso",seasonal_manual:"Manuale",month_jan:"Gen",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"Mag",month_jun:"Giu",month_jul:"Lug",month_aug:"Ago",month_sep:"Set",month_oct:"Ott",month_nov:"Nov",month_dec:"Dic",sensor_prediction:"Previsione sensore",degradation_trend:"Tendenza",trend_rising:"In aumento",trend_falling:"In calo",trend_stable:"Stabile",trend_insufficient_data:"Dati insufficienti",days_until_threshold:"Giorni alla soglia",threshold_exceeded:"Soglia superata",environmental_adjustment:"Fattore ambientale",sensor_prediction_urgency:"Il sensore prevede la soglia tra ~{days} giorni",day_short:"giorno",weibull_reliability_curve:"Curva di affidabilit\xE0",weibull_failure_probability:"Probabilit\xE0 di guasto",weibull_r_squared:"Adattamento R\xB2",beta_early_failures:"Guasti precoci",beta_random_failures:"Guasti casuali",beta_wear_out:"Usura",beta_highly_predictable:"Altamente prevedibile",confidence_interval:"Intervallo di confidenza",confidence_conservative:"Conservativo",confidence_aggressive:"Ottimistico",current_interval_marker:"Intervallo attuale",recommended_marker:"Consigliato",characteristic_life:"Vita caratteristica",chart_mini_sparkline:"Sparkline di tendenza",chart_history:"Cronologia costi e durata",chart_seasonal:"Fattori stagionali, 12 mesi",chart_weibull:"Curva di affidabilit\xE0 Weibull",chart_sparkline:"Grafico valore trigger sensore",days_progress:"Avanzamento giorni",qr_code:"Codice QR",qr_generating:"Generazione codice QR\u2026",qr_error:"Impossibile generare il codice QR.",qr_error_no_url:"Nessun URL HA configurato. Impostare un URL esterno o interno in Impostazioni \u2192 Sistema \u2192 Rete.",save_error:"Salvataggio non riuscito. Riprovare.",qr_print:"Stampa",qr_download:"Scarica SVG",qr_action:"Azione alla scansione",qr_action_view:"Visualizza info manutenzione",qr_action_complete:"Segna manutenzione come completata",qr_url_mode:"Tipo di link",qr_mode_companion:"Companion App",qr_mode_local:"Locale (mDNS)",qr_mode_server:"URL server",overview:"Panoramica",analysis:"Analisi",recent_activities:"Attivit\xE0 recenti",search_notes:"Cerca nelle note",avg_cost:"\xD8 Costo",no_advanced_features:"Nessuna funzione avanzata attivata",no_advanced_features_hint:"Attiva \u201CIntervalli Adattivi\u201D o \u201CModelli Stagionali\u201D nelle impostazioni dell'integrazione per vedere i dati di analisi qui.",analysis_not_enough_data:"Non ci sono ancora abbastanza dati per l'analisi.",analysis_not_enough_data_hint:"L'analisi Weibull richiede almeno 5 manutenzioni completate; i modelli stagionali diventano visibili dopo 6+ punti dati al mese.",analysis_manual_task_hint:"Le attivit\xE0 manuali senza intervallo non generano dati di analisi.",completions:"completamenti",current:"Attuale",shorter:"Pi\xF9 breve",longer:"Pi\xF9 lungo",normal:"Normale",disabled:"Disattivato",compound_logic:"Logica composta",card_title:"Titolo",card_show_header:"Mostra intestazione con statistiche",card_show_actions:"Mostra pulsanti azione",card_compact:"Modalit\xE0 compatta",card_max_items:"Max elementi (0 = tutti)",card_filter_status:"Filtra per stato",card_filter_status_help:"Vuoto = mostra tutti gli stati.",card_filter_objects:"Filtra per oggetti",card_filter_objects_help:"Vuoto = mostra tutti gli oggetti.",card_filter_entities:"Filtra per entit\xE0 (entity_ids)",card_filter_entities_help:"Seleziona entit\xE0 sensor / binary_sensor da questa integrazione. Vuoto = tutte.",card_loading_objects:"Caricamento oggetti\u2026",card_load_error:"Impossibile caricare gli oggetti \u2014 verifica la connessione WebSocket.",card_no_tasks_title:"Nessuna attivit\xE0 di manutenzione",card_no_tasks_cta:"\u2192 Creane una nel pannello Manutenzione",no_objects:"Nessun oggetto ancora.",action_error:"Azione fallita. Riprova.",area_id_optional:"Area (opzionale)",installation_date_optional:"Data di installazione (opzionale)",custom_icon_optional:"Icona (opzionale, es. mdi:wrench)",task_enabled:"Attivit\xE0 abilitata",skip_reason_prompt:"Saltare questa attivit\xE0?",reason_optional:"Motivo (opzionale)",reset_date_prompt:"Segnare l'attivit\xE0 come eseguita?",reset_date_optional:"Data ultima esecuzione (opzionale, predefinito: oggi)",notes_label:"Note",documentation_label:"Documentazione",no_nfc_tag:"\u2014 Nessun tag \u2014",dashboard:"Dashboard",settings:"Impostazioni",settings_features:"Funzioni avanzate",settings_features_desc:"Attiva o disattiva le funzioni avanzate. La disattivazione le nasconde dall'interfaccia ma non elimina i dati.",feat_adaptive:"Pianificazione adattiva",feat_adaptive_desc:"Impara intervalli ottimali dalla cronologia di manutenzione",feat_predictions:"Previsioni sensore",feat_predictions_desc:"Prevedi date di attivazione dalla degradazione dei sensori",feat_seasonal:"Adeguamenti stagionali",feat_seasonal_desc:"Adegua gli intervalli in base ai modelli stagionali",feat_environmental:"Correlazione ambientale",feat_environmental_desc:"Correla gli intervalli con temperatura/umidit\xE0",feat_budget:"Monitoraggio budget",feat_budget_desc:"Monitora le spese di manutenzione mensili e annuali",feat_groups:"Gruppi di attivit\xE0",feat_groups_desc:"Organizza le attivit\xE0 in gruppi logici",feat_checklists:"Checklist",feat_checklists_desc:"Procedure multi-fase per il completamento delle attivit\xE0",settings_general:"Generale",settings_default_warning:"Giorni di avviso predefiniti",settings_panel_enabled:"Pannello laterale",settings_notifications:"Notifiche",settings_notify_service:"Servizio di notifica",test_notification:"Notifica di test",send_test:"Invia test",testing:"Invio in corso\u2026",test_notification_success:"Notifica di test inviata",test_notification_failed:"Notifica di test non riuscita",settings_notify_due_soon:"Notifica quando in scadenza",settings_notify_overdue:"Notifica quando scaduto",settings_notify_triggered:"Notifica quando attivato",settings_interval_hours:"Intervallo di ripetizione (ore, 0 = una volta)",settings_quiet_hours:"Ore di silenzio",settings_quiet_start:"Inizio",settings_quiet_end:"Fine",settings_max_per_day:"Max notifiche al giorno (0 = illimitato)",settings_bundling:"Raggruppare le notifiche",settings_bundle_threshold:"Soglia di raggruppamento",settings_actions:"Pulsanti azione mobili",settings_action_complete:"Mostra pulsante 'Completato'",settings_action_skip:"Mostra pulsante 'Salta'",settings_action_snooze:"Mostra pulsante 'Posticipa'",settings_snooze_hours:"Durata posticipo (ore)",settings_budget:"Budget",settings_currency:"Valuta",settings_budget_monthly:"Budget mensile",settings_budget_yearly:"Budget annuale",settings_budget_alerts:"Avvisi budget",settings_budget_threshold:"Soglia di avviso (%)",settings_import_export:"Import / Export",settings_export_json:"Esporta JSON",settings_export_csv:"Esporta CSV",settings_import_csv:"Importa CSV",settings_import_placeholder:"Incolla il contenuto JSON o CSV qui\u2026",settings_import_btn:"Importa",settings_import_success:"{count} oggetti importati con successo.",settings_export_success:"Export scaricato.",settings_saved:"Impostazione salvata.",settings_include_history:"Includi cronologia",sort_alphabetical:"Alfabetico",sort_due_soonest:"Scadenza pi\xF9 vicina",sort_task_count:"Numero di attivit\xE0",sort_area:"Area",sort_assigned_user:"Utente assegnato",sort_group:"Gruppo",groupby_none:"Nessun raggruppamento",groupby_area:"Per area",groupby_group:"Per gruppo",groupby_user:"Per utente",filter_label:"Filtro",user_label:"Utente",sort_label:"Ordinamento",group_by_label:"Raggruppa per",state_value_help:'Usa il valore di stato HA (di solito minuscolo, es. "on"/"off"). Il case viene normalizzato al salvataggio.',target_changes_help:"Numero di transizioni corrispondenti prima che il trigger si attivi (predefinito: 1).",qr_print_title:"Stampa codici QR",qr_print_desc:"Genera una pagina stampabile di codici QR da ritagliare e applicare sulle apparecchiature.",qr_print_load:"Carica oggetti",qr_print_filter:"Filtro",qr_print_objects:"Oggetti",qr_print_actions:"Azioni",qr_print_url_mode:"Tipo di link",qr_print_estimate:"Codici QR stimati",qr_print_over_limit:"limite 200, restringi il filtro",qr_print_generate:"Genera codici QR",qr_print_generating:"Generazione\u2026",qr_print_ready:"Codici QR pronti",qr_print_print_button:"Stampa",qr_print_empty:"Niente da generare",qr_action_skip:"Salta",unassigned:"Non assegnato",no_area:"Nessuna area",has_overdue:"Attivit\xE0 scadute",object:"Oggetto",settings_panel_access:"Accesso al pannello",settings_panel_access_desc:"Gli amministratori vedono sempre il pannello completo. Seleziona qui gli utenti non amministratori che dovrebbero anche avere accesso completo \u2014 gli altri vedono solo Completa e Salta.",no_non_admin_users:"Nessun utente non amministratore trovato. Aggiungili in Impostazioni \u2192 Persone.",owner_label:"Proprietario"},da={maintenance:"Mantenimiento",objects:"Objetos",tasks:"Tareas",overdue:"Vencida",due_soon:"Pr\xF3xima",triggered:"Activada",ok:"OK",all:"Todos",new_object:"+ Nuevo objeto",edit:"Editar",delete:"Eliminar",add_task:"+ Tarea",complete:"Completada",completed:"Completada",skip:"Omitir",skipped:"Omitida",reset:"Restablecer",cancel:"Cancelar",completing:"Completando\u2026",interval:"Intervalo",warning:"Aviso",last_performed:"\xDAltima ejecuci\xF3n",next_due:"Pr\xF3ximo vencimiento",days_until_due:"D\xEDas hasta vencimiento",avg_duration:"\xD8 Duraci\xF3n",trigger:"Disparador",trigger_type:"Tipo de disparador",threshold_above:"L\xEDmite superior",threshold_below:"L\xEDmite inferior",threshold:"Umbral",counter:"Contador",state_change:"Cambio de estado",runtime:"Tiempo de funcionamiento",runtime_hours:"Duraci\xF3n objetivo (horas)",target_value:"Valor objetivo",baseline:"L\xEDnea base",target_changes:"Cambios objetivo",for_minutes:"Durante (minutos)",time_based:"Temporal",sensor_based:"Sensor",manual:"Manual",cleaning:"Limpieza",inspection:"Inspecci\xF3n",replacement:"Sustituci\xF3n",calibration:"Calibraci\xF3n",service:"Servicio",custom:"Personalizado",history:"Historial",cost:"Coste",duration:"Duraci\xF3n",both:"Ambos",trigger_val:"Valor del disparador",complete_title:"Completada: ",checklist:"Lista de verificaci\xF3n",checklist_steps_optional:"Pasos de la lista de verificaci\xF3n (opcional)",checklist_placeholder:`Limpiar filtro
Reemplazar junta
Probar presi\xF3n`,checklist_help:"Un paso por l\xEDnea. M\xE1x. 100 elementos.",err_too_long:"{field}: demasiado largo (m\xE1x. {n} caracteres)",err_too_short:"{field}: demasiado corto (m\xEDn. {n} caracteres)",err_value_too_high:"{field}: demasiado grande (m\xE1x. {n})",err_value_too_low:"{field}: demasiado peque\xF1o (m\xEDn. {n})",err_required:"{field}: campo obligatorio",err_wrong_type:"{field}: tipo incorrecto (esperado: {type})",err_invalid_choice:"{field}: valor no permitido",err_invalid_value:"{field}: valor inv\xE1lido",feat_schedule_time:"Programaci\xF3n por hora",feat_schedule_time_desc:"Las tareas vencen a una hora espec\xEDfica en lugar de medianoche.",schedule_time_optional:"Vence a las (opcional, HH:MM)",schedule_time_help:"Vac\xEDo = medianoche (predeterminado). Zona horaria HA.",at_time:"a las",notes_optional:"Notas (opcional)",cost_optional:"Coste (opcional)",duration_minutes:"Duraci\xF3n en minutos (opcional)",days:"d\xEDas",day:"d\xEDa",today:"Hoy",d_overdue:"d vencida",no_tasks:"No hay tareas de mantenimiento. Cree un objeto para empezar.",no_tasks_short:"Sin tareas",no_history:"Sin entradas en el historial.",show_all:"Mostrar todo",cost_duration_chart:"Costes & Duraci\xF3n",installed:"Instalado",confirm_delete_object:"\xBFEliminar este objeto y todas sus tareas?",confirm_delete_task:"\xBFEliminar esta tarea?",min:"M\xEDn",max:"M\xE1x",save:"Guardar",saving:"Guardando\u2026",edit_task:"Editar tarea",new_task:"Nueva tarea de mantenimiento",task_name:"Nombre de la tarea",maintenance_type:"Tipo de mantenimiento",schedule_type:"Tipo de planificaci\xF3n",interval_days:"Intervalo (d\xEDas)",warning_days:"D\xEDas de aviso",last_performed_optional:"\xDAltima ejecuci\xF3n (opcional)",interval_anchor:"Anclaje del intervalo",anchor_completion:"Desde la fecha de finalizaci\xF3n",anchor_planned:"Desde la fecha planificada (sin desviaci\xF3n)",edit_object:"Editar objeto",name:"Nombre",manufacturer_optional:"Fabricante (opcional)",model_optional:"Modelo (opcional)",serial_number_optional:"N\xFAmero de serie (opcional)",serial_number_label:"N/S",sort_due_date:"Vencimiento",sort_object:"Nombre del objeto",sort_type:"Tipo",sort_task_name:"Nombre de la tarea",all_objects:"Todos los objetos",tasks_lower:"tareas",no_tasks_yet:"A\xFAn no hay tareas",add_first_task:"Agregar primera tarea",trigger_configuration:"Configuraci\xF3n del disparador",entity_id:"ID de entidad",comma_separated:"separados por comas",entity_logic:"L\xF3gica de entidad",entity_logic_any:"Cualquier entidad activa",entity_logic_all:"Todas las entidades deben activar",entities:"entidades",attribute_optional:"Atributo (opcional, vac\xEDo = estado)",use_entity_state:"Usar estado de la entidad (sin atributo)",trigger_above:"Activar por encima de",trigger_below:"Activar por debajo de",for_at_least_minutes:"Durante al menos (minutos)",safety_interval_days:"Intervalo de seguridad (d\xEDas, opcional)",delta_mode:"Modo delta",from_state_optional:"Desde estado (opcional)",to_state_optional:"Hasta estado (opcional)",documentation_url_optional:"URL de documentaci\xF3n (opcional)",nfc_tag_id_optional:"ID de etiqueta NFC (opcional)",environmental_entity_optional:"Sensor ambiental (opcional)",environmental_entity_helper:"p.ej. sensor.temperatura_exterior \u2014 ajusta el intervalo segu\u0301n las condiciones ambientales",environmental_attribute_optional:"Atributo ambiental (opcional)",nfc_tag_id:"ID de etiqueta NFC",nfc_linked:"Etiqueta NFC vinculada",nfc_link_hint:"Clic para vincular etiqueta NFC",responsible_user:"Usuario responsable",no_user_assigned:"(Ning\xFAn usuario asignado)",all_users:"Todos los usuarios",my_tasks:"Mis tareas",budget_monthly:"Presupuesto mensual",budget_yearly:"Presupuesto anual",groups:"Grupos",new_group:"Nuevo grupo",edit_group:"Editar grupo",no_groups:"Sin grupos todav\xEDa",delete_group:"Eliminar grupo",delete_group_confirm:"\xBFEliminar el grupo '{name}'?",group_select_tasks:"Seleccionar tareas",group_name_required:"Nombre requerido",description_optional:"Descripci\xF3n (opcional)",selected:"Seleccionado",loading_chart:"Cargando datos...",was_maintenance_needed:"\xBFEra necesario este mantenimiento?",feedback_needed:"Necesario",feedback_not_needed:"No necesario",feedback_not_sure:"No seguro",suggested_interval:"Intervalo sugerido",apply_suggestion:"Aplicar",reanalyze:"Reanalizar",reanalyze_result:"Nuevo an\xE1lisis",reanalyze_insufficient_data:"Datos insuficientes para una recomendaci\xF3n",data_points:"puntos de datos",dismiss_suggestion:"Descartar",confidence_low:"Baja",confidence_medium:"Media",confidence_high:"Alta",recommended:"recomendado",seasonal_awareness:"Conciencia estacional",edit_seasonal_overrides:"Editar factores estacionales",seasonal_overrides_title:"Factores estacionales (override)",seasonal_overrides_hint:"Factor por mes (0.1\u20135.0). Vac\xEDo = aprendido autom\xE1ticamente.",seasonal_override_invalid:"Valor no v\xE1lido",seasonal_override_range:"El factor debe estar entre 0.1 y 5.0",clear_all:"Borrar todo",seasonal_chart_title:"Factores estacionales",seasonal_learned:"Aprendido",seasonal_manual:"Manual",month_jan:"Ene",month_feb:"Feb",month_mar:"Mar",month_apr:"Abr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Ago",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dic",sensor_prediction:"Predicci\xF3n del sensor",degradation_trend:"Tendencia",trend_rising:"En aumento",trend_falling:"En descenso",trend_stable:"Estable",trend_insufficient_data:"Datos insuficientes",days_until_threshold:"D\xEDas hasta el umbral",threshold_exceeded:"Umbral superado",environmental_adjustment:"Factor ambiental",sensor_prediction_urgency:"El sensor predice el umbral en ~{days} d\xEDas",day_short:"d\xEDa",weibull_reliability_curve:"Curva de fiabilidad",weibull_failure_probability:"Probabilidad de fallo",weibull_r_squared:"Ajuste R\xB2",beta_early_failures:"Fallos tempranos",beta_random_failures:"Fallos aleatorios",beta_wear_out:"Desgaste",beta_highly_predictable:"Altamente predecible",confidence_interval:"Intervalo de confianza",confidence_conservative:"Conservador",confidence_aggressive:"Optimista",current_interval_marker:"Intervalo actual",recommended_marker:"Recomendado",characteristic_life:"Vida caracter\xEDstica",chart_mini_sparkline:"Sparkline de tendencia",chart_history:"Historial de costes y duraci\xF3n",chart_seasonal:"Factores estacionales, 12 meses",chart_weibull:"Curva de fiabilidad Weibull",chart_sparkline:"Gr\xE1fico de valor del disparador",days_progress:"Progreso en d\xEDas",qr_code:"C\xF3digo QR",qr_generating:"Generando c\xF3digo QR\u2026",qr_error:"No se pudo generar el c\xF3digo QR.",qr_error_no_url:"No hay URL de HA configurada. Establezca una URL externa o interna en Ajustes \u2192 Sistema \u2192 Red.",save_error:"Error al guardar. Int\xE9ntelo de nuevo.",qr_print:"Imprimir",qr_download:"Descargar SVG",qr_action:"Acci\xF3n al escanear",qr_action_view:"Ver info de mantenimiento",qr_action_complete:"Marcar mantenimiento como completado",qr_url_mode:"Tipo de enlace",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"URL del servidor",overview:"Resumen",analysis:"An\xE1lisis",recent_activities:"Actividades recientes",search_notes:"Buscar en notas",avg_cost:"\xD8 Coste",no_advanced_features:"Sin funciones avanzadas activadas",no_advanced_features_hint:"Active \u201CIntervalos Adaptativos\u201D o \u201CPatrones Estacionales\u201D en la configuraci\xF3n de la integraci\xF3n para ver datos de an\xE1lisis aqu\xED.",analysis_not_enough_data:"A\xFAn no hay suficientes datos para el an\xE1lisis.",analysis_not_enough_data_hint:"El an\xE1lisis Weibull requiere al menos 5 mantenimientos completados; los patrones estacionales son visibles tras 6+ puntos de datos por mes.",analysis_manual_task_hint:"Las tareas manuales sin intervalo no generan datos de an\xE1lisis.",completions:"finalizaciones",current:"Actual",shorter:"M\xE1s corto",longer:"M\xE1s largo",normal:"Normal",disabled:"Desactivado",compound_logic:"L\xF3gica compuesta",card_title:"T\xEDtulo",card_show_header:"Mostrar encabezado con estad\xEDsticas",card_show_actions:"Mostrar botones de acci\xF3n",card_compact:"Modo compacto",card_max_items:"M\xE1x. elementos (0 = todos)",card_filter_status:"Filtrar por estado",card_filter_status_help:"Vac\xEDo = mostrar todos los estados.",card_filter_objects:"Filtrar por objetos",card_filter_objects_help:"Vac\xEDo = mostrar todos los objetos.",card_filter_entities:"Filtrar por entidades (entity_ids)",card_filter_entities_help:"Selecciona entidades sensor / binary_sensor de esta integraci\xF3n. Vac\xEDo = todas.",card_loading_objects:"Cargando objetos\u2026",card_load_error:"No se pudieron cargar los objetos \u2014 verifica la conexi\xF3n WebSocket.",card_no_tasks_title:"A\xFAn no hay tareas de mantenimiento",card_no_tasks_cta:"\u2192 Crea una en el panel Mantenimiento",no_objects:"A\xFAn no hay objetos.",action_error:"Acci\xF3n fallida. Int\xE9ntelo de nuevo.",area_id_optional:"\xC1rea (opcional)",installation_date_optional:"Fecha de instalaci\xF3n (opcional)",custom_icon_optional:"Icono (opcional, ej. mdi:wrench)",task_enabled:"Tarea habilitada",skip_reason_prompt:"\xBFOmitir esta tarea?",reason_optional:"Motivo (opcional)",reset_date_prompt:"\xBFMarcar la tarea como realizada?",reset_date_optional:"Fecha de \xFAltima ejecuci\xF3n (opcional, por defecto: hoy)",notes_label:"Notas",documentation_label:"Documentaci\xF3n",no_nfc_tag:"\u2014 Sin etiqueta \u2014",dashboard:"Panel",settings:"Ajustes",settings_features:"Funciones avanzadas",settings_features_desc:"Active o desactive funciones avanzadas. Desactivar las oculta de la interfaz pero no elimina datos.",feat_adaptive:"Planificaci\xF3n adaptativa",feat_adaptive_desc:"Aprender intervalos \xF3ptimos del historial de mantenimiento",feat_predictions:"Predicciones de sensor",feat_predictions_desc:"Predecir fechas de activaci\xF3n por degradaci\xF3n del sensor",feat_seasonal:"Ajustes estacionales",feat_seasonal_desc:"Ajustar intervalos seg\xFAn patrones estacionales",feat_environmental:"Correlaci\xF3n ambiental",feat_environmental_desc:"Correlacionar intervalos con temperatura/humedad",feat_budget:"Seguimiento de presupuesto",feat_budget_desc:"Seguir los gastos de mantenimiento mensuales y anuales",feat_groups:"Grupos de tareas",feat_groups_desc:"Organizar tareas en grupos l\xF3gicos",feat_checklists:"Listas de verificaci\xF3n",feat_checklists_desc:"Procedimientos de varios pasos para completar tareas",settings_general:"General",settings_default_warning:"D\xEDas de aviso predeterminados",settings_panel_enabled:"Panel lateral",settings_notifications:"Notificaciones",settings_notify_service:"Servicio de notificaci\xF3n",test_notification:"Notificaci\xF3n de prueba",send_test:"Enviar prueba",testing:"Enviando\u2026",test_notification_success:"Notificaci\xF3n de prueba enviada",test_notification_failed:"La notificaci\xF3n de prueba fall\xF3",settings_notify_due_soon:"Notificar cuando est\xE9 pr\xF3xima",settings_notify_overdue:"Notificar cuando est\xE9 vencida",settings_notify_triggered:"Notificar cuando se active",settings_interval_hours:"Intervalo de repetici\xF3n (horas, 0 = una vez)",settings_quiet_hours:"Horas de silencio",settings_quiet_start:"Inicio",settings_quiet_end:"Fin",settings_max_per_day:"M\xE1x. notificaciones por d\xEDa (0 = ilimitado)",settings_bundling:"Agrupar notificaciones",settings_bundle_threshold:"Umbral de agrupaci\xF3n",settings_actions:"Botones de acci\xF3n m\xF3viles",settings_action_complete:"Mostrar bot\xF3n 'Completada'",settings_action_skip:"Mostrar bot\xF3n 'Omitir'",settings_action_snooze:"Mostrar bot\xF3n 'Posponer'",settings_snooze_hours:"Duraci\xF3n de posposici\xF3n (horas)",settings_budget:"Presupuesto",settings_currency:"Moneda",settings_budget_monthly:"Presupuesto mensual",settings_budget_yearly:"Presupuesto anual",settings_budget_alerts:"Alertas de presupuesto",settings_budget_threshold:"Umbral de alerta (%)",settings_import_export:"Importar / Exportar",settings_export_json:"Exportar JSON",settings_export_csv:"Exportar CSV",settings_import_csv:"Importar CSV",settings_import_placeholder:"Pegue el contenido JSON o CSV aqu\xED\u2026",settings_import_btn:"Importar",settings_import_success:"{count} objetos importados correctamente.",settings_export_success:"Exportaci\xF3n descargada.",settings_saved:"Ajuste guardado.",settings_include_history:"Incluir historial",sort_alphabetical:"Alfab\xE9tico",sort_due_soonest:"Pr\xF3ximo a vencer",sort_task_count:"Cantidad de tareas",sort_area:"\xC1rea",sort_assigned_user:"Usuario asignado",sort_group:"Grupo",groupby_none:"Sin agrupaci\xF3n",groupby_area:"Por \xE1rea",groupby_group:"Por grupo",groupby_user:"Por usuario",filter_label:"Filtro",user_label:"Usuario",sort_label:"Ordenar",group_by_label:"Agrupar por",state_value_help:'Usa el valor de estado de HA (normalmente en min\xFAsculas, p. ej. "on"/"off"). Las may\xFAsculas se normalizan al guardar.',target_changes_help:"N\xFAmero de transiciones coincidentes antes de que se dispare el trigger (predeterminado: 1).",qr_print_title:"Imprimir c\xF3digos QR",qr_print_desc:"Genera una p\xE1gina imprimible de c\xF3digos QR para recortar y pegar en tus equipos.",qr_print_load:"Cargar objetos",qr_print_filter:"Filtro",qr_print_objects:"Objetos",qr_print_actions:"Acciones",qr_print_url_mode:"Tipo de enlace",qr_print_estimate:"C\xF3digos QR estimados",qr_print_over_limit:"m\xE1ximo 200, reduce el filtro",qr_print_generate:"Generar c\xF3digos QR",qr_print_generating:"Generando\u2026",qr_print_ready:"C\xF3digos QR listos",qr_print_print_button:"Imprimir",qr_print_empty:"Nada que generar",qr_action_skip:"Omitir",unassigned:"Sin asignar",no_area:"Sin \xE1rea",has_overdue:"Tareas vencidas",object:"Objeto",settings_panel_access:"Acceso al panel",settings_panel_access_desc:"Los administradores siempre ven el panel completo. Selecciona aqu\xED a los usuarios no administradores que tambi\xE9n deben tener acceso completo \u2014 los dem\xE1s solo ven Completar y Omitir.",no_non_admin_users:"No se encontraron usuarios no administradores. A\xF1ade alguno en Ajustes \u2192 Personas.",owner_label:"Propietario"},ca={maintenance:"Manuten\xE7\xE3o",objects:"Objetos",tasks:"Tarefas",overdue:"Atrasada",due_soon:"Pr\xF3xima",triggered:"Acionada",ok:"OK",all:"Todos",new_object:"+ Novo objeto",edit:"Editar",delete:"Eliminar",add_task:"+ Tarefa",complete:"Conclu\xEDda",completed:"Conclu\xEDda",skip:"Saltar",skipped:"Saltada",reset:"Repor",cancel:"Cancelar",completing:"A concluir\u2026",interval:"Intervalo",warning:"Aviso",last_performed:"\xDAltima execu\xE7\xE3o",next_due:"Pr\xF3ximo vencimento",days_until_due:"Dias at\xE9 vencimento",avg_duration:"\xD8 Dura\xE7\xE3o",trigger:"Acionador",trigger_type:"Tipo de acionador",threshold_above:"Limite superior",threshold_below:"Limite inferior",threshold:"Limiar",counter:"Contador",state_change:"Mudan\xE7a de estado",runtime:"Tempo de funcionamento",runtime_hours:"Dura\xE7\xE3o alvo (horas)",target_value:"Valor alvo",baseline:"Linha de base",target_changes:"Altera\xE7\xF5es alvo",for_minutes:"Durante (minutos)",time_based:"Temporal",sensor_based:"Sensor",manual:"Manual",cleaning:"Limpeza",inspection:"Inspe\xE7\xE3o",replacement:"Substitui\xE7\xE3o",calibration:"Calibra\xE7\xE3o",service:"Servi\xE7o",custom:"Personalizado",history:"Hist\xF3rico",cost:"Custo",duration:"Dura\xE7\xE3o",both:"Ambos",trigger_val:"Valor do acionador",complete_title:"Conclu\xEDda: ",checklist:"Lista de verifica\xE7\xE3o",checklist_steps_optional:"Passos da lista de verifica\xE7\xE3o (opcional)",checklist_placeholder:`Limpar filtro
Substituir veda\xE7\xE3o
Testar press\xE3o`,checklist_help:"Um passo por linha. M\xE1x. 100 itens.",err_too_long:"{field}: demasiado longo (m\xE1x. {n} caracteres)",err_too_short:"{field}: demasiado curto (m\xEDn. {n} caracteres)",err_value_too_high:"{field}: demasiado grande (m\xE1x. {n})",err_value_too_low:"{field}: demasiado pequeno (m\xEDn. {n})",err_required:"{field}: campo obrigat\xF3rio",err_wrong_type:"{field}: tipo incorreto (esperado: {type})",err_invalid_choice:"{field}: valor n\xE3o permitido",err_invalid_value:"{field}: valor inv\xE1lido",feat_schedule_time:"Agendamento por hora",feat_schedule_time_desc:"Tarefas vencem em um hor\xE1rio espec\xEDfico em vez de meia-noite.",schedule_time_optional:"Vence \xE0s (opcional, HH:MM)",schedule_time_help:"Vazio = meia-noite (padr\xE3o). Fuso hor\xE1rio HA.",at_time:"\xE0s",notes_optional:"Notas (opcional)",cost_optional:"Custo (opcional)",duration_minutes:"Dura\xE7\xE3o em minutos (opcional)",days:"dias",day:"dia",today:"Hoje",d_overdue:"d em atraso",no_tasks:"Sem tarefas de manuten\xE7\xE3o. Crie um objeto para come\xE7ar.",no_tasks_short:"Sem tarefas",no_history:"Sem entradas no hist\xF3rico.",show_all:"Mostrar tudo",cost_duration_chart:"Custos & Dura\xE7\xE3o",installed:"Instalado",confirm_delete_object:"Eliminar este objeto e todas as suas tarefas?",confirm_delete_task:"Eliminar esta tarefa?",min:"M\xEDn",max:"M\xE1x",save:"Guardar",saving:"A guardar\u2026",edit_task:"Editar tarefa",new_task:"Nova tarefa de manuten\xE7\xE3o",task_name:"Nome da tarefa",maintenance_type:"Tipo de manuten\xE7\xE3o",schedule_type:"Tipo de agendamento",interval_days:"Intervalo (dias)",warning_days:"Dias de aviso",last_performed_optional:"\xDAltima execu\xE7\xE3o (opcional)",interval_anchor:"\xC2ncora do intervalo",anchor_completion:"A partir da data de conclus\xE3o",anchor_planned:"A partir da data planeada (sem desvio)",edit_object:"Editar objeto",name:"Nome",manufacturer_optional:"Fabricante (opcional)",model_optional:"Modelo (opcional)",serial_number_optional:"N\xFAmero de s\xE9rie (opcional)",serial_number_label:"N/S",sort_due_date:"Vencimento",sort_object:"Nome do objeto",sort_type:"Tipo",sort_task_name:"Nome da tarefa",all_objects:"Todos os objetos",tasks_lower:"tarefas",no_tasks_yet:"Ainda sem tarefas",add_first_task:"Adicionar primeira tarefa",trigger_configuration:"Configura\xE7\xE3o do acionador",entity_id:"ID da entidade",comma_separated:"separados por v\xEDrgulas",entity_logic:"L\xF3gica da entidade",entity_logic_any:"Qualquer entidade aciona",entity_logic_all:"Todas as entidades devem acionar",entities:"entidades",attribute_optional:"Atributo (opcional, vazio = estado)",use_entity_state:"Usar estado da entidade (sem atributo)",trigger_above:"Acionar acima de",trigger_below:"Acionar abaixo de",for_at_least_minutes:"Durante pelo menos (minutos)",safety_interval_days:"Intervalo de seguran\xE7a (dias, opcional)",delta_mode:"Modo delta",from_state_optional:"Do estado (opcional)",to_state_optional:"Para o estado (opcional)",documentation_url_optional:"URL de documenta\xE7\xE3o (opcional)",nfc_tag_id_optional:"ID da etiqueta NFC (opcional)",environmental_entity_optional:"Sensor ambiental (opcional)",environmental_entity_helper:"ex. sensor.temperatura_exterior \u2014 ajusta o intervalo segundo as condi\xE7\xF5es ambientais",environmental_attribute_optional:"Atributo ambiental (opcional)",nfc_tag_id:"ID da etiqueta NFC",nfc_linked:"Etiqueta NFC associada",nfc_link_hint:"Clique para associar etiqueta NFC",responsible_user:"Utilizador respons\xE1vel",no_user_assigned:"(Nenhum utilizador atribu\xEDdo)",all_users:"Todos os utilizadores",my_tasks:"As minhas tarefas",budget_monthly:"Or\xE7amento mensal",budget_yearly:"Or\xE7amento anual",groups:"Grupos",new_group:"Novo grupo",edit_group:"Editar grupo",no_groups:"Ainda sem grupos",delete_group:"Eliminar grupo",delete_group_confirm:"Eliminar o grupo '{name}'?",group_select_tasks:"Selecionar tarefas",group_name_required:"Nome obrigat\xF3rio",description_optional:"Descri\xE7\xE3o (opcional)",selected:"Selecionado",loading_chart:"A carregar dados...",was_maintenance_needed:"Esta manuten\xE7\xE3o era necess\xE1ria?",feedback_needed:"Necess\xE1ria",feedback_not_needed:"N\xE3o necess\xE1ria",feedback_not_sure:"N\xE3o tenho a certeza",suggested_interval:"Intervalo sugerido",apply_suggestion:"Aplicar",reanalyze:"Reanalisar",reanalyze_result:"Nova an\xE1lise",reanalyze_insufficient_data:"Dados insuficientes para uma recomenda\xE7\xE3o",data_points:"pontos de dados",dismiss_suggestion:"Descartar",confidence_low:"Baixa",confidence_medium:"M\xE9dia",confidence_high:"Alta",recommended:"recomendado",seasonal_awareness:"Consci\xEAncia sazonal",edit_seasonal_overrides:"Editar fatores sazonais",seasonal_overrides_title:"Fatores sazonais (override)",seasonal_overrides_hint:"Fator por m\xEAs (0.1\u20135.0). Vazio = aprendido automaticamente.",seasonal_override_invalid:"Valor inv\xE1lido",seasonal_override_range:"O fator deve estar entre 0.1 e 5.0",clear_all:"Limpar tudo",seasonal_chart_title:"Fatores sazonais",seasonal_learned:"Aprendido",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Fev",month_mar:"Mar",month_apr:"Abr",month_may:"Mai",month_jun:"Jun",month_jul:"Jul",month_aug:"Ago",month_sep:"Set",month_oct:"Out",month_nov:"Nov",month_dec:"Dez",sensor_prediction:"Previs\xE3o do sensor",degradation_trend:"Tend\xEAncia",trend_rising:"A subir",trend_falling:"A descer",trend_stable:"Est\xE1vel",trend_insufficient_data:"Dados insuficientes",days_until_threshold:"Dias at\xE9 ao limiar",threshold_exceeded:"Limiar ultrapassado",environmental_adjustment:"Fator ambiental",sensor_prediction_urgency:"O sensor prev\xEA o limiar em ~{days} dias",day_short:"dia",weibull_reliability_curve:"Curva de fiabilidade",weibull_failure_probability:"Probabilidade de falha",weibull_r_squared:"Ajuste R\xB2",beta_early_failures:"Falhas precoces",beta_random_failures:"Falhas aleat\xF3rias",beta_wear_out:"Desgaste",beta_highly_predictable:"Altamente previs\xEDvel",confidence_interval:"Intervalo de confian\xE7a",confidence_conservative:"Conservador",confidence_aggressive:"Otimista",current_interval_marker:"Intervalo atual",recommended_marker:"Recomendado",characteristic_life:"Vida caracter\xEDstica",chart_mini_sparkline:"Sparkline de tend\xEAncia",chart_history:"Hist\xF3rico de custos e dura\xE7\xE3o",chart_seasonal:"Fatores sazonais, 12 meses",chart_weibull:"Curva de fiabilidade Weibull",chart_sparkline:"Gr\xE1fico de valor do acionador",days_progress:"Progresso em dias",qr_code:"C\xF3digo QR",qr_generating:"A gerar c\xF3digo QR\u2026",qr_error:"N\xE3o foi poss\xEDvel gerar o c\xF3digo QR.",qr_error_no_url:"Nenhum URL do HA configurado. Defina um URL externo ou interno em Defini\xE7\xF5es \u2192 Sistema \u2192 Rede.",save_error:"Erro ao guardar. Tente novamente.",qr_print:"Imprimir",qr_download:"Transferir SVG",qr_action:"A\xE7\xE3o ao digitalizar",qr_action_view:"Ver informa\xE7\xF5es de manuten\xE7\xE3o",qr_action_complete:"Marcar manuten\xE7\xE3o como conclu\xEDda",qr_url_mode:"Tipo de liga\xE7\xE3o",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"URL do servidor",overview:"Vis\xE3o geral",analysis:"An\xE1lise",recent_activities:"Atividades recentes",search_notes:"Pesquisar notas",avg_cost:"\xD8 Custo",no_advanced_features:"Sem fun\xE7\xF5es avan\xE7adas ativadas",no_advanced_features_hint:"Ative \u201CIntervalos Adaptativos\u201D ou \u201CPadr\xF5es Sazonais\u201D nas defini\xE7\xF5es da integra\xE7\xE3o para ver dados de an\xE1lise aqui.",analysis_not_enough_data:"Ainda n\xE3o h\xE1 dados suficientes para a an\xE1lise.",analysis_not_enough_data_hint:"A an\xE1lise Weibull requer pelo menos 5 manuten\xE7\xF5es conclu\xEDdas; os padr\xF5es sazonais tornam-se vis\xEDveis ap\xF3s 6+ pontos de dados por m\xEAs.",analysis_manual_task_hint:"Tarefas manuais sem intervalo n\xE3o geram dados de an\xE1lise.",completions:"conclus\xF5es",current:"Atual",shorter:"Mais curto",longer:"Mais longo",normal:"Normal",disabled:"Desativado",compound_logic:"L\xF3gica composta",card_title:"T\xEDtulo",card_show_header:"Mostrar cabe\xE7alho com estat\xEDsticas",card_show_actions:"Mostrar bot\xF5es de a\xE7\xE3o",card_compact:"Modo compacto",card_max_items:"M\xE1x. itens (0 = todos)",card_filter_status:"Filtrar por estado",card_filter_status_help:"Vazio = mostrar todos os estados.",card_filter_objects:"Filtrar por objetos",card_filter_objects_help:"Vazio = mostrar todos os objetos.",card_filter_entities:"Filtrar por entidades (entity_ids)",card_filter_entities_help:"Selecione entidades sensor / binary_sensor desta integra\xE7\xE3o. Vazio = todas.",card_loading_objects:"A carregar objetos\u2026",card_load_error:"N\xE3o foi poss\xEDvel carregar os objetos \u2014 verifique a liga\xE7\xE3o WebSocket.",card_no_tasks_title:"Ainda sem tarefas de manuten\xE7\xE3o",card_no_tasks_cta:"\u2192 Crie uma no painel Manuten\xE7\xE3o",no_objects:"Ainda sem objetos.",action_error:"A\xE7\xE3o falhada. Tente novamente.",area_id_optional:"\xC1rea (opcional)",installation_date_optional:"Data de instala\xE7\xE3o (opcional)",custom_icon_optional:"\xCDcone (opcional, ex. mdi:wrench)",task_enabled:"Tarefa ativada",skip_reason_prompt:"Saltar esta tarefa?",reason_optional:"Motivo (opcional)",reset_date_prompt:"Marcar tarefa como executada?",reset_date_optional:"Data da \xFAltima execu\xE7\xE3o (opcional, padr\xE3o: hoje)",notes_label:"Notas",documentation_label:"Documenta\xE7\xE3o",no_nfc_tag:"\u2014 Sem etiqueta \u2014",dashboard:"Painel",settings:"Defini\xE7\xF5es",settings_features:"Fun\xE7\xF5es avan\xE7adas",settings_features_desc:"Ative ou desative fun\xE7\xF5es avan\xE7adas. Desativar oculta-as da interface mas n\xE3o elimina dados.",feat_adaptive:"Agendamento adaptativo",feat_adaptive_desc:"Aprender intervalos ideais a partir do hist\xF3rico de manuten\xE7\xE3o",feat_predictions:"Previs\xF5es do sensor",feat_predictions_desc:"Prever datas de acionamento pela degrada\xE7\xE3o do sensor",feat_seasonal:"Ajustes sazonais",feat_seasonal_desc:"Ajustar intervalos com base em padr\xF5es sazonais",feat_environmental:"Correla\xE7\xE3o ambiental",feat_environmental_desc:"Correlacionar intervalos com temperatura/humidade",feat_budget:"Controlo de or\xE7amento",feat_budget_desc:"Acompanhar despesas de manuten\xE7\xE3o mensais e anuais",feat_groups:"Grupos de tarefas",feat_groups_desc:"Organizar tarefas em grupos l\xF3gicos",feat_checklists:"Listas de verifica\xE7\xE3o",feat_checklists_desc:"Procedimentos com v\xE1rios passos para conclus\xE3o de tarefas",settings_general:"Geral",settings_default_warning:"Dias de aviso predefinidos",settings_panel_enabled:"Painel lateral",settings_notifications:"Notifica\xE7\xF5es",settings_notify_service:"Servi\xE7o de notifica\xE7\xE3o",test_notification:"Notifica\xE7\xE3o de teste",send_test:"Enviar teste",testing:"A enviar\u2026",test_notification_success:"Notifica\xE7\xE3o de teste enviada",test_notification_failed:"Falha na notifica\xE7\xE3o de teste",settings_notify_due_soon:"Notificar quando pr\xF3xima",settings_notify_overdue:"Notificar quando atrasada",settings_notify_triggered:"Notificar quando acionada",settings_interval_hours:"Intervalo de repeti\xE7\xE3o (horas, 0 = uma vez)",settings_quiet_hours:"Horas de sil\xEAncio",settings_quiet_start:"In\xEDcio",settings_quiet_end:"Fim",settings_max_per_day:"M\xE1x. notifica\xE7\xF5es por dia (0 = ilimitado)",settings_bundling:"Agrupar notifica\xE7\xF5es",settings_bundle_threshold:"Limiar de agrupamento",settings_actions:"Bot\xF5es de a\xE7\xE3o m\xF3veis",settings_action_complete:"Mostrar bot\xE3o 'Conclu\xEDda'",settings_action_skip:"Mostrar bot\xE3o 'Saltar'",settings_action_snooze:"Mostrar bot\xE3o 'Adiar'",settings_snooze_hours:"Dura\xE7\xE3o do adiamento (horas)",settings_budget:"Or\xE7amento",settings_currency:"Moeda",settings_budget_monthly:"Or\xE7amento mensal",settings_budget_yearly:"Or\xE7amento anual",settings_budget_alerts:"Alertas de or\xE7amento",settings_budget_threshold:"Limiar de alerta (%)",settings_import_export:"Importar / Exportar",settings_export_json:"Exportar JSON",settings_export_csv:"Exportar CSV",settings_import_csv:"Importar CSV",settings_import_placeholder:"Cole o conte\xFAdo JSON ou CSV aqui\u2026",settings_import_btn:"Importar",settings_import_success:"{count} objetos importados com sucesso.",settings_export_success:"Exporta\xE7\xE3o transferida.",settings_saved:"Defini\xE7\xE3o guardada.",settings_include_history:"Incluir hist\xF3rico",sort_alphabetical:"Alfab\xE9tico",sort_due_soonest:"Vencimento mais pr\xF3ximo",sort_task_count:"Quantidade de tarefas",sort_area:"\xC1rea",sort_assigned_user:"Usu\xE1rio atribu\xEDdo",sort_group:"Grupo",filter_label:"Filtro",user_label:"Utilizador",sort_label:"Ordenar",group_by_label:"Agrupar por",state_value_help:'Use o valor de estado HA (normalmente em min\xFAsculas, p. ex. "on"/"off"). As mai\xFAsculas s\xE3o normalizadas ao guardar.',target_changes_help:"N\xFAmero de transi\xE7\xF5es correspondentes antes do trigger disparar (predefinido: 1).",qr_print_title:"Imprimir c\xF3digos QR",qr_print_desc:"Gera uma p\xE1gina imprim\xEDvel de c\xF3digos QR para recortar e colar nos equipamentos.",qr_print_load:"Carregar objetos",qr_print_filter:"Filtro",qr_print_objects:"Objetos",qr_print_actions:"A\xE7\xF5es",qr_print_url_mode:"Tipo de link",qr_print_estimate:"C\xF3digos QR estimados",qr_print_over_limit:"m\xE1ximo 200, restrinja o filtro",qr_print_generate:"Gerar c\xF3digos QR",qr_print_generating:"A gerar\u2026",qr_print_ready:"C\xF3digos QR prontos",qr_print_print_button:"Imprimir",qr_print_empty:"Nada a gerar",qr_action_skip:"Saltar",groupby_none:"Sem agrupamento",groupby_area:"Por \xE1rea",groupby_group:"Por grupo",groupby_user:"Por usu\xE1rio",unassigned:"N\xE3o atribu\xEDdo",no_area:"Sem \xE1rea",has_overdue:"Tarefas em atraso",object:"Objeto",settings_panel_access:"Acesso ao painel",settings_panel_access_desc:"Administradores sempre veem o painel completo. Selecione aqui usu\xE1rios n\xE3o administradores que tamb\xE9m devem ter acesso completo \u2014 os demais s\xF3 veem Concluir e Ignorar.",no_non_admin_users:"Nenhum usu\xE1rio n\xE3o administrador encontrado. Adicione em Configura\xE7\xF5es \u2192 Pessoas.",owner_label:"Propriet\xE1rio"},_a={maintenance:"\u041E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",objects:"\u041E\u0431'\u0454\u043A\u0442\u0438",tasks:"\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F",overdue:"\u041F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u043E",due_soon:"\u041D\u0435\u0437\u0430\u0431\u0430\u0440\u043E\u043C",triggered:"\u0421\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043B\u043E",ok:"\u041D\u043E\u0440\u043C\u0430",all:"\u0412\u0441\u0456",new_object:"+ \u041D\u043E\u0432\u0438\u0439 \u043E\u0431'\u0454\u043A\u0442",edit:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438",delete:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438",add_task:"+ \u0414\u043E\u0434\u0430\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",complete:"\u0412\u0438\u043A\u043E\u043D\u0430\u0442\u0438",completed:"\u0412\u0438\u043A\u043E\u043D\u0430\u043D\u043E",skip:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438",skipped:"\u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E",reset:"\u0421\u043A\u0438\u043D\u0443\u0442\u0438",cancel:"\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438",completing:"\u0412\u0438\u043A\u043E\u043D\u0443\u0454\u0442\u044C\u0441\u044F\u2026",interval:"\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B",warning:"\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F",last_performed:"\u041E\u0441\u0442\u0430\u043D\u043D\u0454 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F",next_due:"\u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0442\u0435\u0440\u043C\u0456\u043D",days_until_due:"\u0414\u043D\u0456\u0432 \u0434\u043E \u0442\u0435\u0440\u043C\u0456\u043D\u0443",avg_duration:"\u0421\u0435\u0440. \u0442\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C",trigger:"\u0422\u0440\u0438\u0433\u0435\u0440",trigger_type:"\u0422\u0438\u043F \u0442\u0440\u0438\u0433\u0435\u0440\u0430",threshold_above:"\u0412\u0435\u0440\u0445\u043D\u044F \u043C\u0435\u0436\u0430",threshold_below:"\u041D\u0438\u0436\u043D\u044F \u043C\u0435\u0436\u0430",threshold:"\u041F\u043E\u0440\u0456\u0433",counter:"\u041B\u0456\u0447\u0438\u043B\u044C\u043D\u0438\u043A",state_change:"\u0417\u043C\u0456\u043D\u0430 \u0441\u0442\u0430\u043D\u0443",runtime:"\u041D\u0430\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F",runtime_hours:"\u0426\u0456\u043B\u044C\u043E\u0432\u0435 \u043D\u0430\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F (\u0433\u043E\u0434\u0438\u043D\u0438)",target_value:"\u0426\u0456\u043B\u044C\u043E\u0432\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",baseline:"\u0411\u0430\u0437\u043E\u0432\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",target_changes:"\u0426\u0456\u043B\u044C\u043E\u0432\u0430 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0437\u043C\u0456\u043D",for_minutes:"\u041F\u0440\u043E\u0442\u044F\u0433\u043E\u043C (\u0445\u0432\u0438\u043B\u0438\u043D)",time_based:"\u0417\u0430 \u0447\u0430\u0441\u043E\u043C",sensor_based:"\u0417\u0430 \u0441\u0435\u043D\u0441\u043E\u0440\u043E\u043C",manual:"\u0412\u0440\u0443\u0447\u043D\u0443",cleaning:"\u041E\u0447\u0438\u0449\u0435\u043D\u043D\u044F",inspection:"\u041E\u0433\u043B\u044F\u0434",replacement:"\u0417\u0430\u043C\u0456\u043D\u0430",calibration:"\u041A\u0430\u043B\u0456\u0431\u0440\u0443\u0432\u0430\u043D\u043D\u044F",service:"\u0421\u0435\u0440\u0432\u0456\u0441",custom:"\u0412\u043B\u0430\u0441\u043D\u0438\u0439",history:"\u0406\u0441\u0442\u043E\u0440\u0456\u044F",cost:"\u0412\u0430\u0440\u0442\u0456\u0441\u0442\u044C",duration:"\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C",both:"\u041E\u0431\u0438\u0434\u0432\u0430",trigger_val:"\u0417\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0442\u0440\u0438\u0433\u0435\u0440\u0430",complete_title:"\u0412\u0438\u043A\u043E\u043D\u0430\u0442\u0438: ",checklist:"\u0427\u0435\u043A\u043B\u0456\u0441\u0442",checklist_steps_optional:"\u041A\u0440\u043E\u043A\u0438 \u0447\u0435\u043A\u043B\u0456\u0441\u0442\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",checklist_placeholder:`\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0444\u0456\u043B\u044C\u0442\u0440
\u0417\u0430\u043C\u0456\u043D\u0438\u0442\u0438 \u0443\u0449\u0456\u043B\u044C\u043D\u044E\u0432\u0430\u0447
\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0438\u0442\u0438 \u0442\u0438\u0441\u043A`,checklist_help:"\u041E\u0434\u0438\u043D \u043A\u0440\u043E\u043A \u043D\u0430 \u0440\u044F\u0434\u043E\u043A. \u041C\u0430\u043A\u0441. 100 \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432.",err_too_long:"{field}: \u0437\u0430\u0434\u043E\u0432\u0433\u0435 (\u043C\u0430\u043A\u0441. {n} \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432)",err_too_short:"{field}: \u0437\u0430\u043A\u043E\u0440\u043E\u0442\u043A\u0435 (\u043C\u0456\u043D. {n} \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432)",err_value_too_high:"{field}: \u0437\u0430\u0432\u0435\u043B\u0438\u043A\u0435 (\u043C\u0430\u043A\u0441. {n})",err_value_too_low:"{field}: \u0437\u0430\u043C\u0430\u043B\u0435 (\u043C\u0456\u043D. {n})",err_required:"{field}: \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435 \u043F\u043E\u043B\u0435",err_wrong_type:"{field}: \u043D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0442\u0438\u043F (\u043E\u0447\u0456\u043A\u0443\u0432\u0430\u043B\u043E\u0441\u044C: {type})",err_invalid_choice:"{field}: \u043D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",err_invalid_value:"{field}: \u043D\u0435\u0432\u0456\u0440\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",feat_schedule_time:"\u041F\u043B\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u044F \u0437\u0430 \u0447\u0430\u0441\u043E\u043C \u0434\u043E\u0431\u0438",feat_schedule_time_desc:"\u0417\u0430\u0434\u0430\u0447\u0456 \u0441\u0442\u0430\u044E\u0442\u044C \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u0438\u043C\u0438 \u0443 \u043F\u0435\u0432\u043D\u0438\u0439 \u0447\u0430\u0441 \u0434\u043E\u0431\u0438, \u0430 \u043D\u0435 \u043E\u043F\u0456\u0432\u043D\u043E\u0447\u0456.",schedule_time_optional:"\u0427\u0430\u0441 \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u043D\u044F (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E, HH:MM)",schedule_time_help:"\u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u043E\u043F\u0456\u0432\u043D\u043E\u0447\u0456 (\u0437\u0430 \u0437\u0430\u043C\u043E\u0432\u0447\u0443\u0432\u0430\u043D\u043D\u044F\u043C). \u0427\u0430\u0441\u043E\u0432\u0438\u0439 \u043F\u043E\u044F\u0441 HA.",at_time:"\u043E",notes_optional:"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0438 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",cost_optional:"\u0412\u0430\u0440\u0442\u0456\u0441\u0442\u044C (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",duration_minutes:"\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C \u0443 \u0445\u0432\u0438\u043B\u0438\u043D\u0430\u0445 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",days:"\u0434\u043D\u0456\u0432",day:"\u0434\u0435\u043D\u044C",today:"\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456",d_overdue:"\u0434 \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u043E",no_tasks:"\u0417\u0430\u0432\u0434\u0430\u043D\u044C \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F \u0449\u0435 \u043D\u0435\u043C\u0430\u0454. \u0421\u0442\u0432\u043E\u0440\u0456\u0442\u044C \u043E\u0431'\u0454\u043A\u0442, \u0449\u043E\u0431 \u043F\u043E\u0447\u0430\u0442\u0438.",no_tasks_short:"\u041D\u0435\u043C\u0430\u0454 \u0437\u0430\u0432\u0434\u0430\u043D\u044C",no_history:"\u0417\u0430\u043F\u0438\u0441\u0456\u0432 \u0432 \u0456\u0441\u0442\u043E\u0440\u0456\u0457 \u0449\u0435 \u043D\u0435\u043C\u0430\u0454.",show_all:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456",cost_duration_chart:"\u0412\u0430\u0440\u0442\u0456\u0441\u0442\u044C \u0456 \u0442\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C",installed:"\u0412\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E",confirm_delete_object:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0446\u0435\u0439 \u043E\u0431'\u0454\u043A\u0442 \u0456 \u0432\u0441\u0456 \u0439\u043E\u0433\u043E \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F?",confirm_delete_task:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0446\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F?",min:"\u041C\u0456\u043D",max:"\u041C\u0430\u043A\u0441",save:"\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438",saving:"\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F\u2026",edit_task:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",new_task:"\u041D\u043E\u0432\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",task_name:"\u041D\u0430\u0437\u0432\u0430 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",maintenance_type:"\u0422\u0438\u043F \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",schedule_type:"\u0422\u0438\u043F \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0443",interval_days:"\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B (\u0434\u043D\u0456)",warning_days:"\u0414\u043D\u0456\u0432 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F",interval_anchor:"\u041F\u0440\u0438\u0432'\u044F\u0437\u043A\u0430 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0443",anchor_completion:"\u0412\u0456\u0434 \u0434\u0430\u0442\u0438 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F",anchor_planned:"\u0412\u0456\u0434 \u0437\u0430\u043F\u043B\u0430\u043D\u043E\u0432\u0430\u043D\u043E\u0457 \u0434\u0430\u0442\u0438 (\u0431\u0435\u0437 \u0437\u043C\u0456\u0449\u0435\u043D\u043D\u044F)",edit_object:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u043E\u0431'\u0454\u043A\u0442",name:"\u041D\u0430\u0437\u0432\u0430",manufacturer_optional:"\u0412\u0438\u0440\u043E\u0431\u043D\u0438\u043A (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",model_optional:"\u041C\u043E\u0434\u0435\u043B\u044C (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",serial_number_optional:"\u0421\u0435\u0440\u0456\u0439\u043D\u0438\u0439 \u043D\u043E\u043C\u0435\u0440 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",serial_number_label:"\u0421/\u041D",last_performed_optional:"\u041E\u0441\u0442\u0430\u043D\u043D\xE9 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",sort_due_date:"\u0414\u0430\u0442\u0430 \u0442\u0435\u0440\u043C\u0456\u043D\u0443",sort_object:"\u041D\u0430\u0437\u0432\u0430 \u043E\u0431'\u0454\u043A\u0442\u0430",sort_type:"\u0422\u0438\u043F",sort_task_name:"\u041D\u0430\u0437\u0432\u0430 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",all_objects:"\u0412\u0441\u0456 \u043E\u0431'\u0454\u043A\u0442\u0438",tasks_lower:"\u0437\u0430\u0432\u0434\u0430\u043D\u044C",no_tasks_yet:"\u0417\u0430\u0432\u0434\u0430\u043D\u044C \u0449\u0435 \u043D\u0435\u043C\u0430\u0454",add_first_task:"\u0414\u043E\u0434\u0430\u0442\u0438 \u043F\u0435\u0440\u0448\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",trigger_configuration:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0442\u0440\u0438\u0433\u0435\u0440\u0430",entity_id:"ID \u043E\u0431'\u0454\u043A\u0442\u0430",comma_separated:"\u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443",entity_logic:"\u041B\u043E\u0433\u0456\u043A\u0430 \u043E\u0431'\u0454\u043A\u0442\u0456\u0432",entity_logic_any:"\u0411\u0443\u0434\u044C-\u044F\u043A\u0438\u0439 \u043E\u0431'\u0454\u043A\u0442 \u0441\u043F\u0440\u0430\u0446\u044C\u043E\u0432\u0443\u0454",entity_logic_all:"\u0412\u0441\u0456 \u043E\u0431'\u0454\u043A\u0442\u0438 \u043C\u0430\u044E\u0442\u044C \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0442\u0438",entities:"\u043E\u0431'\u0454\u043A\u0442\u0456\u0432",attribute_optional:"\u0410\u0442\u0440\u0438\u0431\u0443\u0442 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E, \u043F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u0441\u0442\u0430\u043D)",use_entity_state:"\u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0432\u0430\u0442\u0438 \u0441\u0442\u0430\u043D \u043E\u0431'\u0454\u043A\u0442\u0430 (\u0431\u0435\u0437 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430)",trigger_above:"\u0421\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0442\u0438, \u043A\u043E\u043B\u0438 \u0432\u0438\u0449\u0435",trigger_below:"\u0421\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0442\u0438, \u043A\u043E\u043B\u0438 \u043D\u0438\u0436\u0447\u0435",for_at_least_minutes:"\u041F\u0440\u043E\u0442\u044F\u0433\u043E\u043C \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 (\u0445\u0432\u0438\u043B\u0438\u043D)",safety_interval_days:"\u0421\u0442\u0440\u0430\u0445\u043E\u0432\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B (\u0434\u043D\u0456, \u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",delta_mode:"\u0420\u0435\u0436\u0438\u043C \u0434\u0435\u043B\u044C\u0442\u0438",from_state_optional:"\u0417 \u0441\u0442\u0430\u043D\u0443 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",to_state_optional:"\u0414\u043E \u0441\u0442\u0430\u043D\u0443 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",documentation_url_optional:"URL \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0456\u0457 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",nfc_tag_id_optional:"ID NFC-\u0442\u0435\u0433\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",environmental_entity_optional:"\u0414\u0430\u0442\u0447\u0438\u043A \u043D\u0430\u0432\u043A\u043E\u043B\u0438\u0448\u043D\u044C\u043E\u0433\u043E \u0441\u0435\u0440\u0435\u0434\u043E\u0432\u0438\u0449\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",environmental_entity_helper:"\u043D\u0430\u043F\u0440. sensor.outdoor_temperature \u2014 \u043A\u043E\u0440\u0438\u0433\u0443\u0454 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u043D\u043E \u0434\u043E \u0443\u043C\u043E\u0432 \u043D\u0430\u0432\u043A\u043E\u043B\u0438\u0448\u043D\u044C\u043E\u0433\u043E \u0441\u0435\u0440\u0435\u0434\u043E\u0432\u0438\u0449\u0430",environmental_attribute_optional:"\u0410\u0442\u0440\u0438\u0431\u0443\u0442 \u0441\u0435\u0440\u0435\u0434\u043E\u0432\u0438\u0449\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",nfc_tag_id:"ID NFC-\u0442\u0435\u0433\u0430",nfc_linked:"NFC-\u0442\u0435\u0433 \u043F\u0440\u0438\u0432'\u044F\u0437\u0430\u043D\u043E",nfc_link_hint:"\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C, \u0449\u043E\u0431 \u043F\u0440\u0438\u0432'\u044F\u0437\u0430\u0442\u0438 NFC-\u0442\u0435\u0433",responsible_user:"\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u043B\u044C\u043D\u0438\u0439 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447",no_user_assigned:"(\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u043D\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043E)",all_users:"\u0412\u0441\u0456 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456",my_tasks:"\u041C\u043E\u0457 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",budget_monthly:"\u0429\u043E\u043C\u0456\u0441\u044F\u0447\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",budget_yearly:"\u0429\u043E\u0440\u0456\u0447\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",groups:"\u0413\u0440\u0443\u043F\u0438",new_group:"\u041D\u043E\u0432\u0430 \u0433\u0440\u0443\u043F\u0430",edit_group:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0433\u0440\u0443\u043F\u0443",no_groups:"\u0413\u0440\u0443\u043F \u0449\u0435 \u043D\u0435\u043C\u0430\u0454",delete_group:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0433\u0440\u0443\u043F\u0443",delete_group_confirm:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0433\u0440\u0443\u043F\u0443 '{name}'?",group_select_tasks:"\u041E\u0431\u0440\u0430\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",group_name_required:"\u041F\u043E\u0442\u0440\u0456\u0431\u043D\u0430 \u043D\u0430\u0437\u0432\u0430",description_optional:"\u041E\u043F\u0438\u0441 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",selected:"\u041E\u0431\u0440\u0430\u043D\u043E",loading_chart:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0434\u0430\u043D\u0438\u0445 \u0433\u0440\u0430\u0444\u0456\u043A\u0430...",was_maintenance_needed:"\u0427\u0438 \u0431\u0443\u043B\u043E \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0435 \u0446\u0435 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F?",feedback_needed:"\u041F\u043E\u0442\u0440\u0456\u0431\u043D\u0435",feedback_not_needed:"\u041D\u0435 \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0435",feedback_not_sure:"\u041D\u0435 \u0432\u043F\u0435\u0432\u043D\u0435\u043D\u0438\u0439",suggested_interval:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B",apply_suggestion:"\u0417\u0430\u0441\u0442\u043E\u0441\u0443\u0432\u0430\u0442\u0438",reanalyze:"\u041F\u043E\u0432\u0442\u043E\u0440\u043D\u043E \u043F\u0440\u043E\u0430\u043D\u0430\u043B\u0456\u0437\u0443\u0432\u0430\u0442\u0438",reanalyze_result:"\u041D\u043E\u0432\u0438\u0439 \u0430\u043D\u0430\u043B\u0456\u0437",reanalyze_insufficient_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u0434\u0430\u043D\u0438\u0445 \u0434\u043B\u044F \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0456\u0457",data_points:"\u0442\u043E\u0447\u043E\u043A \u0434\u0430\u043D\u0438\u0445",dismiss_suggestion:"\u0412\u0456\u0434\u0445\u0438\u043B\u0438\u0442\u0438",confidence_low:"\u041D\u0438\u0437\u044C\u043A\u0430",confidence_medium:"\u0421\u0435\u0440\u0435\u0434\u043D\u044F",confidence_high:"\u0412\u0438\u0441\u043E\u043A\u0430",recommended:"\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u043E",seasonal_awareness:"\u0421\u0435\u0437\u043E\u043D\u043D\u0430 \u043A\u043E\u0440\u0435\u043A\u0446\u0456\u044F",edit_seasonal_overrides:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0441\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442\u0438",seasonal_overrides_title:"\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442\u0438 (\u043F\u0435\u0440\u0435\u0432\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F)",seasonal_overrides_hint:"\u041A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442 \u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C (0.1\u20135.0). \u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E.",seasonal_override_invalid:"\u041D\u0435\u0434\u0456\u0439\u0441\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",seasonal_override_range:"\u041A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043C\u0456\u0436 0.1 \u0442\u0430 5.0",clear_all:"\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0432\u0441\u0435",seasonal_chart_title:"\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442\u0438",seasonal_learned:"\u041D\u0430\u0432\u0447\u0435\u043D\u0430",seasonal_manual:"\u0420\u0443\u0447\u043D\u0430",month_jan:"\u0421\u0456\u0447",month_feb:"\u041B\u044E\u0442",month_mar:"\u0411\u0435\u0440",month_apr:"\u041A\u0432\u0456",month_may:"\u0422\u0440\u0430",month_jun:"\u0427\u0435\u0440",month_jul:"\u041B\u0438\u043F",month_aug:"\u0421\u0435\u0440",month_sep:"\u0412\u0435\u0440",month_oct:"\u0416\u043E\u0432",month_nov:"\u041B\u0438\u0441",month_dec:"\u0413\u0440\u0443",sensor_prediction:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u0441\u0435\u043D\u0441\u043E\u0440\u0430",degradation_trend:"\u0422\u0440\u0435\u043D\u0434",trend_rising:"\u0417\u0440\u043E\u0441\u0442\u0430\u0454",trend_falling:"\u0421\u043F\u0430\u0434\u0430\u0454",trend_stable:"\u0421\u0442\u0430\u0431\u0456\u043B\u044C\u043D\u0438\u0439",trend_insufficient_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u0434\u0430\u043D\u0438\u0445",days_until_threshold:"\u0414\u043D\u0456\u0432 \u0434\u043E \u043F\u043E\u0440\u043E\u0433\u0443",threshold_exceeded:"\u041F\u043E\u0440\u0456\u0433 \u043F\u0435\u0440\u0435\u0432\u0438\u0449\u0435\u043D\u043E",environmental_adjustment:"\u0415\u043A\u043E\u043B\u043E\u0433\u0456\u0447\u043D\u0438\u0439 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442",sensor_prediction_urgency:"\u0421\u0435\u043D\u0441\u043E\u0440 \u043F\u0440\u043E\u0433\u043D\u043E\u0437\u0443\u0454 \u0434\u043E\u0441\u044F\u0433\u043D\u0435\u043D\u043D\u044F \u043F\u043E\u0440\u043E\u0433\u0443 \u0447\u0435\u0440\u0435\u0437 ~{days} \u0434\u043D\u0456\u0432",day_short:"\u0434\u0435\u043D\u044C",weibull_reliability_curve:"\u041A\u0440\u0438\u0432\u0430 \u043D\u0430\u0434\u0456\u0439\u043D\u043E\u0441\u0442\u0456",weibull_failure_probability:"\u0419\u043C\u043E\u0432\u0456\u0440\u043D\u0456\u0441\u0442\u044C \u0432\u0456\u0434\u043C\u043E\u0432\u0438",weibull_r_squared:"\u0422\u043E\u0447\u043D\u0456\u0441\u0442\u044C R\xB2",beta_early_failures:"\u0420\u0430\u043D\u043D\u0456 \u0432\u0456\u0434\u043C\u043E\u0432\u0438",beta_random_failures:"\u0412\u0438\u043F\u0430\u0434\u043A\u043E\u0432\u0456 \u0432\u0456\u0434\u043C\u043E\u0432\u0438",beta_wear_out:"\u0417\u043D\u043E\u0441",beta_highly_predictable:"\u0414\u0443\u0436\u0435 \u043F\u0435\u0440\u0435\u0434\u0431\u0430\u0447\u0443\u0432\u0430\u043D\u0438\u0439",confidence_interval:"\u0414\u043E\u0432\u0456\u0440\u0447\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B",confidence_conservative:"\u041A\u043E\u043D\u0441\u0435\u0440\u0432\u0430\u0442\u0438\u0432\u043D\u0438\u0439",confidence_aggressive:"\u041E\u043F\u0442\u0438\u043C\u0456\u0441\u0442\u0438\u0447\u043D\u0438\u0439",current_interval_marker:"\u041F\u043E\u0442\u043E\u0447\u043D\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B",recommended_marker:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u043E",characteristic_life:"\u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u0447\u043D\u0438\u0439 \u0440\u0435\u0441\u0443\u0440\u0441",chart_mini_sparkline:"\u041C\u0456\u043D\u0456\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u0433\u0440\u0430\u0444\u0456\u043A \u0442\u0440\u0435\u043D\u0434\u0443",chart_history:"\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0432\u0430\u0440\u0442\u043E\u0441\u0442\u0456 \u0442\u0430 \u0442\u0440\u0438\u0432\u0430\u043B\u043E\u0441\u0442\u0456",chart_seasonal:"\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442\u0438, 12 \u043C\u0456\u0441\u044F\u0446\u0456\u0432",chart_weibull:"\u041A\u0440\u0438\u0432\u0430 \u043D\u0430\u0434\u0456\u0439\u043D\u043E\u0441\u0442\u0456 \u0412\u0435\u0439\u0431\u0443\u043B\u043B\u0430",chart_sparkline:"\u0413\u0440\u0430\u0444\u0456\u043A \u0437\u043D\u0430\u0447\u0435\u043D\u044C \u0442\u0440\u0438\u0433\u0435\u0440\u0430 \u0441\u0435\u043D\u0441\u043E\u0440\u0430",days_progress:"\u041F\u0440\u043E\u0433\u0440\u0435\u0441 \u0434\u043D\u0456\u0432",qr_code:"QR-\u043A\u043E\u0434",qr_generating:"\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0456\u044F QR-\u043A\u043E\u0434\u0443\u2026",qr_error:"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0433\u0435\u043D\u0435\u0440\u0443\u0432\u0430\u0442\u0438 QR-\u043A\u043E\u0434.",qr_error_no_url:"URL Home Assistant \u043D\u0435 \u043D\u0430\u043B\u0430\u0448\u0442\u043E\u0432\u0430\u043D\u043E. \u0417\u0430\u0434\u0430\u0439\u0442\u0435 \u0437\u043E\u0432\u043D\u0456\u0448\u043D\u044E \u0430\u0431\u043E \u0432\u043D\u0443\u0442\u0440\u0456\u0448\u043D\u044E URL-\u0430\u0434\u0440\u0435\u0441\u0443 \u0432 \u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u2192 \u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u2192 \u041C\u0435\u0440\u0435\u0436\u0430.",save_error:"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0431\u0435\u0440\u0435\u0433\u0442\u0438. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.",qr_print:"\u0414\u0440\u0443\u043A\u0443\u0432\u0430\u0442\u0438",qr_download:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 SVG",qr_action:"\u0414\u0456\u044F \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456",qr_action_view:"\u041F\u0435\u0440\u0435\u0433\u043B\u044F\u043D\u0443\u0442\u0438",qr_action_complete:"\u041F\u043E\u0437\u043D\u0430\u0447\u0438\u0442\u0438 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u0438\u043C",qr_url_mode:"\u0422\u0438\u043F \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F",qr_mode_companion:"Companion App",qr_mode_local:"\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u0438\u0439 (mDNS)",qr_mode_server:"URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430",overview:"\u041E\u0433\u043B\u044F\u0434",analysis:"\u0410\u043D\u0430\u043B\u0456\u0437",recent_activities:"\u041E\u0441\u0442\u0430\u043D\u043D\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u0456\u0441\u0442\u044C",search_notes:"\u041F\u043E\u0448\u0443\u043A \u0443 \u043F\u0440\u0438\u043C\u0456\u0442\u043A\u0430\u0445",avg_cost:"\u0421\u0435\u0440. \u0432\u0430\u0440\u0442\u0456\u0441\u0442\u044C",no_advanced_features:"\u0420\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0456 \u0444\u0443\u043D\u043A\u0446\u0456\u0457 \u043D\u0435 \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",no_advanced_features_hint:"\u0423\u0432\u0456\u043C\u043A\u043D\u0456\u0442\u044C \xAB\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u0456 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438\xBB \u0430\u0431\u043E \xAB\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u0437\u0430\u043A\u043E\u043D\u043E\u043C\u0456\u0440\u043D\u043E\u0441\u0442\u0456\xBB \u0432 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F\u0445 \u0456\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0456\u0457, \u0449\u043E\u0431 \u043F\u043E\u0431\u0430\u0447\u0438\u0442\u0438 \u0442\u0443\u0442 \u0434\u0430\u043D\u0456 \u0430\u043D\u0430\u043B\u0456\u0437\u0443.",analysis_not_enough_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u0434\u0430\u043D\u0438\u0445 \u0434\u043B\u044F \u0430\u043D\u0430\u043B\u0456\u0437\u0443.",analysis_not_enough_data_hint:"\u0410\u043D\u0430\u043B\u0456\u0437 \u0412\u0435\u0439\u0431\u0443\u043B\u043B\u0430 \u043F\u043E\u0442\u0440\u0435\u0431\u0443\u0454 \u0449\u043E\u043D\u0430\u0439\u043C\u0435\u043D\u0448\u0435 5 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u0438\u0445 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u044C; \u0441\u0435\u0437\u043E\u043D\u043D\u0456 \u0437\u0430\u043A\u043E\u043D\u043E\u043C\u0456\u0440\u043D\u043E\u0441\u0442\u0456 \u0441\u0442\u0430\u044E\u0442\u044C \u0432\u0438\u0434\u0438\u043C\u0438\u043C\u0438 \u043F\u0456\u0441\u043B\u044F 6+ \u0437\u0430\u043F\u0438\u0441\u0456\u0432 \u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C.",analysis_manual_task_hint:"\u0420\u0443\u0447\u043D\u0456 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0431\u0435\u0437 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0443 \u043D\u0435 \u0433\u0435\u043D\u0435\u0440\u0443\u044E\u0442\u044C \u0434\u0430\u043D\u0456 \u0430\u043D\u0430\u043B\u0456\u0437\u0443.",completions:"\u0432\u0438\u043A\u043E\u043D\u0430\u043D\u044C",current:"\u041F\u043E\u0442\u043E\u0447\u043D\u0438\u0439",shorter:"\u041A\u043E\u0440\u043E\u0442\u0448\u0438\u0439",longer:"\u0414\u043E\u0432\u0448\u0438\u0439",normal:"\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0438\u0439",disabled:"\u0412\u0438\u043C\u043A\u043D\u0435\u043D\u043E",compound_logic:"\u0421\u043A\u043B\u0430\u0434\u0435\u043D\u0430 \u043B\u043E\u0433\u0456\u043A\u0430",card_title:"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",card_show_header:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0437\u0456 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u043E\u044E",card_show_actions:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043A\u043D\u043E\u043F\u043A\u0438 \u0434\u0456\u0439",card_compact:"\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u0438\u0439 \u0440\u0435\u0436\u0438\u043C",card_max_items:"\u041C\u0430\u043A\u0441. \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432 (0 = \u0432\u0441\u0456)",card_filter_status:"\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u0437\u0430 \u0441\u0442\u0430\u0442\u0443\u0441\u043E\u043C",card_filter_status_help:"\u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456 \u0441\u0442\u0430\u0442\u0443\u0441\u0438.",card_filter_objects:"\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u0437\u0430 \u043E\u0431'\u0454\u043A\u0442\u0430\u043C\u0438",card_filter_objects_help:"\u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456 \u043E\u0431'\u0454\u043A\u0442\u0438.",card_filter_entities:"\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u0437\u0430 \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u044F\u043C\u0438 (entity_ids)",card_filter_entities_help:"\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u0456 sensor / binary_sensor \u0437 \u0446\u0456\u0454\u0457 \u0456\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0456\u0457. \u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u0432\u0441\u0456.",card_loading_objects:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u043E\u0431'\u0454\u043A\u0442\u0456\u0432\u2026",card_load_error:"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u043E\u0431'\u0454\u043A\u0442\u0438 \u2014 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 WebSocket-\u0437'\u0454\u0434\u043D\u0430\u043D\u043D\u044F.",card_no_tasks_title:"\u041F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454 \u0437\u0430\u0432\u0434\u0430\u043D\u044C \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",card_no_tasks_cta:"\u2192 \u0421\u0442\u0432\u043E\u0440\u0456\u0442\u044C \u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0456 Maintenance",no_objects:"\u041F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454 \u043E\u0431'\u0454\u043A\u0442\u0456\u0432.",action_error:"\u0414\u0456\u044F \u043D\u0435 \u0432\u0434\u0430\u043B\u0430\u0441\u044C. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.",area_id_optional:"\u0417\u043E\u043D\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",installation_date_optional:"\u0414\u0430\u0442\u0430 \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",custom_icon_optional:"\u0406\u043A\u043E\u043D\u043A\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E, \u043D\u0430\u043F\u0440\u0438\u043A\u043B\u0430\u0434 mdi:wrench)",task_enabled:"\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",skip_reason_prompt:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438 \u0446\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F?",reason_optional:"\u041F\u0440\u0438\u0447\u0438\u043D\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",reset_date_prompt:"\u041F\u043E\u0437\u043D\u0430\u0447\u0438\u0442\u0438 \u044F\u043A \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u0435?",reset_date_optional:"\u0414\u0430\u0442\u0430 \u043E\u0441\u0442\u0430\u043D\u043D\u044C\u043E\u0433\u043E \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E, \u0442\u0438\u043F\u043E\u0432\u043E: \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456)",notes_label:"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0438",documentation_label:"\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0456\u044F",no_nfc_tag:"\u2014 \u0411\u0435\u0437 \u0442\u0435\u0433\u0430 \u2014",dashboard:"\u0414\u0430\u0448\u0431\u043E\u0440\u0434",settings:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",settings_features:"\u0420\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0456 \u0444\u0443\u043D\u043A\u0446\u0456\u0457",settings_features_desc:"\u0423\u0432\u0456\u043C\u043A\u043D\u0456\u0442\u044C \u0430\u0431\u043E \u0432\u0438\u043C\u043A\u043D\u0456\u0442\u044C \u0440\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0456 \u0444\u0443\u043D\u043A\u0446\u0456\u0457. \u0412\u0438\u043C\u043A\u043D\u0435\u043D\u043D\u044F \u043F\u0440\u0438\u0445\u043E\u0432\u0443\u0454 \u0457\u0445 \u0437 \u0456\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0443, \u0430\u043B\u0435 \u043D\u0435 \u0432\u0438\u0434\u0430\u043B\u044F\u0454 \u0434\u0430\u043D\u0456.",feat_adaptive:"\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u0435 \u043F\u043B\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u044F",feat_adaptive_desc:"\u041D\u0430\u0432\u0447\u0430\u0442\u0438\u0441\u044F \u043E\u043F\u0442\u0438\u043C\u0430\u043B\u044C\u043D\u0438\u043C \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430\u043C \u0437 \u0456\u0441\u0442\u043E\u0440\u0456\u0457 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",feat_predictions:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437\u0438 \u0437\u0430 \u0441\u0435\u043D\u0441\u043E\u0440\u0430\u043C\u0438",feat_predictions_desc:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437\u0443\u0432\u0430\u0442\u0438 \u0434\u0430\u0442\u0438 \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F \u0437\u0430 \u0434\u0435\u0433\u0440\u0430\u0434\u0430\u0446\u0456\u0454\u044E \u0441\u0435\u043D\u0441\u043E\u0440\u0430",feat_seasonal:"\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0440\u0435\u043A\u0446\u0456\u0457",feat_seasonal_desc:"\u041A\u043E\u0440\u0438\u0433\u0443\u0432\u0430\u0442\u0438 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0456 \u0441\u0435\u0437\u043E\u043D\u043D\u0438\u0445 \u0437\u0430\u043A\u043E\u043D\u043E\u043C\u0456\u0440\u043D\u043E\u0441\u0442\u0435\u0439",feat_environmental:"\u041A\u043E\u0440\u0435\u043B\u044F\u0446\u0456\u044F \u0437 \u0434\u043E\u0432\u043A\u0456\u043B\u043B\u044F\u043C",feat_environmental_desc:"\u041A\u043E\u0440\u0435\u043B\u044E\u0432\u0430\u0442\u0438 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438 \u0437 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u043E\u044E/\u0432\u043E\u043B\u043E\u0433\u0456\u0441\u0442\u044E",feat_budget:"\u0412\u0456\u0434\u0441\u0442\u0435\u0436\u0435\u043D\u043D\u044F \u0431\u044E\u0434\u0436\u0435\u0442\u0443",feat_budget_desc:"\u0412\u0456\u0434\u0441\u0442\u0435\u0436\u0443\u0432\u0430\u0442\u0438 \u0449\u043E\u043C\u0456\u0441\u044F\u0447\u043D\u0456 \u0442\u0430 \u0449\u043E\u0440\u0456\u0447\u043D\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438 \u043D\u0430 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",feat_groups:"\u0413\u0440\u0443\u043F\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u044C",feat_groups_desc:"\u041E\u0440\u0433\u0430\u043D\u0456\u0437\u043E\u0432\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0432 \u043B\u043E\u0433\u0456\u0447\u043D\u0456 \u0433\u0440\u0443\u043F\u0438",feat_checklists:"\u0427\u0435\u043A\u043B\u0456\u0441\u0442\u0438",feat_checklists_desc:"\u0411\u0430\u0433\u0430\u0442\u043E\u043A\u0440\u043E\u043A\u043E\u0432\u0456 \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0438 \u0434\u043B\u044F \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F \u0437\u0430\u0432\u0434\u0430\u043D\u044C",settings_general:"\u0417\u0430\u0433\u0430\u043B\u044C\u043D\u0435",settings_default_warning:"\u0414\u043D\u0456\u0432 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F \u0437\u0430 \u0437\u0430\u043C\u043E\u0432\u0447\u0443\u0432\u0430\u043D\u043D\u044F\u043C",settings_panel_enabled:"\u041F\u0430\u043D\u0435\u043B\u044C \u0443 \u0431\u0456\u0447\u043D\u043E\u043C\u0443 \u043C\u0435\u043D\u044E",settings_notifications:"\u0421\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",settings_notify_service:"\u0421\u043B\u0443\u0436\u0431\u0430 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u044C",test_notification:"\u0422\u0435\u0441\u0442\u043E\u0432\u0435 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",send_test:"\u041D\u0430\u0434\u0456\u0441\u043B\u0430\u0442\u0438 \u0442\u0435\u0441\u0442",testing:"\u041D\u0430\u0434\u0441\u0438\u043B\u0430\u043D\u043D\u044F\u2026",test_notification_success:"\u0422\u0435\u0441\u0442\u043E\u0432\u0435 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F \u043D\u0430\u0434\u0456\u0441\u043B\u0430\u043D\u043E",test_notification_failed:"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u043D\u0430\u0434\u0456\u0441\u043B\u0430\u0442\u0438 \u0442\u0435\u0441\u0442\u043E\u0432\u0435 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",settings_notify_due_soon:"\u0421\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438, \u043A\u043E\u043B\u0438 \u0442\u0435\u0440\u043C\u0456\u043D \u043D\u0430\u0431\u043B\u0438\u0436\u0430\u0454\u0442\u044C\u0441\u044F",settings_notify_overdue:"\u0421\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438 \u043F\u0440\u043E \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u043D\u044F",settings_notify_triggered:"\u0421\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438 \u043F\u0440\u043E \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F",settings_interval_hours:"\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u043D\u044F (\u0433\u043E\u0434\u0438\u043D\u0438, 0 = \u043E\u0434\u043D\u043E\u0440\u0430\u0437\u043E\u0432\u043E)",settings_quiet_hours:"\u0422\u0438\u0445\u0456 \u0433\u043E\u0434\u0438\u043D\u0438",settings_quiet_start:"\u041F\u043E\u0447\u0430\u0442\u043E\u043A",settings_quiet_end:"\u041A\u0456\u043D\u0435\u0446\u044C",settings_max_per_day:"\u041C\u0430\u043A\u0441. \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u044C \u043D\u0430 \u0434\u0435\u043D\u044C (0 = \u0431\u0435\u0437 \u043E\u0431\u043C\u0435\u0436\u0435\u043D\u044C)",settings_bundling:"\u0413\u0440\u0443\u043F\u0443\u0432\u0430\u0442\u0438 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",settings_bundle_threshold:"\u041F\u043E\u0440\u0456\u0433 \u0433\u0440\u0443\u043F\u0443\u0432\u0430\u043D\u043D\u044F",settings_actions:"\u041A\u043D\u043E\u043F\u043A\u0438 \u0434\u0456\u0439 \u0443 \u043C\u043E\u0431\u0456\u043B\u044C\u043D\u0438\u0445 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F\u0445",settings_action_complete:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u0412\u0438\u043A\u043E\u043D\u0430\u0442\u0438\xBB",settings_action_skip:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438\xBB",settings_action_snooze:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u0412\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438\xBB",settings_snooze_hours:"\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C \u0432\u0456\u0434\u043A\u043B\u0430\u0434\u0435\u043D\u043D\u044F (\u0433\u043E\u0434\u0438\u043D\u0438)",settings_budget:"\u0411\u044E\u0434\u0436\u0435\u0442",settings_currency:"\u0412\u0430\u043B\u044E\u0442\u0430",settings_budget_monthly:"\u0429\u043E\u043C\u0456\u0441\u044F\u0447\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_yearly:"\u0429\u043E\u0440\u0456\u0447\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_alerts:"\u0421\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F \u043F\u0440\u043E \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_threshold:"\u041F\u043E\u0440\u0456\u0433 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F (%)",settings_import_export:"\u0406\u043C\u043F\u043E\u0440\u0442 / \u0415\u043A\u0441\u043F\u043E\u0440\u0442",settings_export_json:"\u0415\u043A\u0441\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438 JSON",settings_export_csv:"\u0415\u043A\u0441\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438 CSV",settings_import_csv:"\u0406\u043C\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438 CSV",settings_import_placeholder:"\u0412\u0441\u0442\u0430\u0432\u0442\u0435 \u0432\u043C\u0456\u0441\u0442 JSON \u0430\u0431\u043E CSV \u0441\u044E\u0434\u0438\u2026",settings_import_btn:"\u0406\u043C\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438",settings_import_success:"{count} \u043E\u0431'\u0454\u043A\u0442\u0456\u0432 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0456\u043C\u043F\u043E\u0440\u0442\u043E\u0432\u0430\u043D\u043E.",settings_export_success:"\u0415\u043A\u0441\u043F\u043E\u0440\u0442 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043E.",settings_saved:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E.",settings_include_history:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0438 \u0456\u0441\u0442\u043E\u0440\u0456\u044E",sort_alphabetical:"\u0417\u0430 \u0430\u043B\u0444\u0430\u0432\u0456\u0442\u043E\u043C",sort_due_soonest:"\u041D\u0430\u0439\u0431\u043B\u0438\u0436\u0447\u0438\u0439 \u0442\u0435\u0440\u043C\u0456\u043D",sort_task_count:"\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0437\u0430\u0432\u0434\u0430\u043D\u044C",sort_area:"\u0417\u043E\u043D\u0430",sort_assigned_user:"\u041F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447",sort_group:"\u0413\u0440\u0443\u043F\u0430",groupby_none:"\u0411\u0435\u0437 \u0433\u0440\u0443\u043F\u0443\u0432\u0430\u043D\u043D\u044F",groupby_area:"\u0417\u0430 \u0437\u043E\u043D\u043E\u044E",groupby_group:"\u0417\u0430 \u0433\u0440\u0443\u043F\u043E\u044E",groupby_user:"\u0417\u0430 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0435\u043C",filter_label:"\u0424\u0456\u043B\u044C\u0442\u0440",user_label:"\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447",sort_label:"\u0421\u043E\u0440\u0442\u0443\u0432\u0430\u043D\u043D\u044F",group_by_label:"\u0413\u0440\u0443\u043F\u0443\u0432\u0430\u0442\u0438 \u0437\u0430",state_value_help:'\u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0439\u0442\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0441\u0442\u0430\u043D\u0443 HA (\u0437\u0430\u0437\u0432\u0438\u0447\u0430\u0439 \u0443 \u043D\u0438\u0436\u043D\u044C\u043E\u043C\u0443 \u0440\u0435\u0433\u0456\u0441\u0442\u0440\u0456, \u043D\u0430\u043F\u0440. "on"/"off"). \u0420\u0435\u0433\u0456\u0441\u0442\u0440 \u043D\u043E\u0440\u043C\u0430\u043B\u0456\u0437\u0443\u0454\u0442\u044C\u0441\u044F \u043F\u0440\u0438 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u0456.',target_changes_help:"\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u043D\u0438\u0445 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0456\u0432, \u043F\u0456\u0441\u043B\u044F \u044F\u043A\u0438\u0445 \u0442\u0440\u0438\u0433\u0435\u0440 \u0441\u043F\u0440\u0430\u0446\u044E\u0454 (\u0437\u0430 \u0437\u0430\u043C\u043E\u0432\u0447\u0443\u0432\u0430\u043D\u043D\u044F\u043C: 1).",qr_print_title:"\u0414\u0440\u0443\u043A\u0443\u0432\u0430\u0442\u0438 QR-\u043A\u043E\u0434\u0438",qr_print_desc:"\u0421\u0442\u0432\u043E\u0440\u0438 \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0443 \u0434\u043B\u044F \u0434\u0440\u0443\u043A\u0443 \u0437 QR-\u043A\u043E\u0434\u0430\u043C\u0438, \u044F\u043A\u0456 \u043C\u043E\u0436\u043D\u0430 \u0432\u0438\u0440\u0456\u0437\u0430\u0442\u0438 \u0442\u0430 \u043D\u0430\u043A\u043B\u0435\u0457\u0442\u0438 \u043D\u0430 \u043E\u0431\u043B\u0430\u0434\u043D\u0430\u043D\u043D\u044F.",qr_print_load:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u043E\u0431'\u0454\u043A\u0442\u0438",qr_print_filter:"\u0424\u0456\u043B\u044C\u0442\u0440",qr_print_objects:"\u041E\u0431'\u0454\u043A\u0442\u0438",qr_print_actions:"\u0414\u0456\u0457",qr_print_url_mode:"\u0422\u0438\u043F \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F",qr_print_estimate:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437 QR-\u043A\u043E\u0434\u0456\u0432",qr_print_over_limit:"\u043B\u0456\u043C\u0456\u0442 200, \u0437\u0432\u0443\u0437\u044C \u0444\u0456\u043B\u044C\u0442\u0440",qr_print_generate:"\u0421\u0442\u0432\u043E\u0440\u0438\u0442\u0438 QR-\u043A\u043E\u0434\u0438",qr_print_generating:"\u0421\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F\u2026",qr_print_ready:"QR-\u043A\u043E\u0434\u0438 \u0433\u043E\u0442\u043E\u0432\u0456",qr_print_print_button:"\u0414\u0440\u0443\u043A\u0443\u0432\u0430\u0442\u0438",qr_print_empty:"\u041D\u0456\u0447\u043E\u0433\u043E \u0441\u0442\u0432\u043E\u0440\u044E\u0432\u0430\u0442\u0438",qr_action_skip:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438",unassigned:"\u041D\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043E",no_area:"\u0411\u0435\u0437 \u0437\u043E\u043D\u0438",has_overdue:"\u041F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u0456 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",object:"\u041E\u0431'\u0454\u043A\u0442",settings_panel_access:"\u0414\u043E\u0441\u0442\u0443\u043F \u0434\u043E \u043F\u0430\u043D\u0435\u043B\u0456",settings_panel_access_desc:"\u0410\u0434\u043C\u0456\u043D\u0456\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0438 \u0437\u0430\u0432\u0436\u0434\u0438 \u0431\u0430\u0447\u0430\u0442\u044C \u043F\u043E\u0432\u043D\u0443 \u043F\u0430\u043D\u0435\u043B\u044C. \u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0442\u0443\u0442 \u043D\u0435-\u0430\u0434\u043C\u0456\u043D \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456\u0432, \u044F\u043A\u0456 \u0442\u0430\u043A\u043E\u0436 \u043F\u043E\u0432\u0438\u043D\u043D\u0456 \u043C\u0430\u0442\u0438 \u043F\u043E\u0432\u043D\u0438\u0439 \u0434\u043E\u0441\u0442\u0443\u043F \u2014 \u0456\u043D\u0448\u0456 \u0431\u0430\u0447\u0430\u0442\u044C \u043B\u0438\u0448\u0435 \u0412\u0438\u043A\u043E\u043D\u0430\u0442\u0438 \u0442\u0430 \u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438.",no_non_admin_users:"\u041D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043D\u0435-\u0430\u0434\u043C\u0456\u043D \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456\u0432. \u0414\u043E\u0434\u0430\u0439\u0442\u0435 \u0457\u0445 \u0443 \u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F\u0445 \u2192 \u041E\u0441\u043E\u0431\u0438.",owner_label:"\u0412\u043B\u0430\u0441\u043D\u0438\u043A"},ua={maintenance:"\u041E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435",objects:"\u041E\u0431\u044A\u0435\u043A\u0442\u044B",tasks:"\u0417\u0430\u0434\u0430\u0447\u0438",overdue:"\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043E",due_soon:"\u0421\u043A\u043E\u0440\u043E",triggered:"\u0421\u0440\u0430\u0431\u043E\u0442\u0430\u043B\u043E",ok:"OK",all:"\u0412\u0441\u0435",new_object:"+ \u041D\u043E\u0432\u044B\u0439 \u043E\u0431\u044A\u0435\u043A\u0442",edit:"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C",delete:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C",add_task:"+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443",complete:"\u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C",completed:"\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E",skip:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C",skipped:"\u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E",reset:"\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C",cancel:"\u041E\u0442\u043C\u0435\u043D\u0430",completing:"\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435\u2026",interval:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",warning:"\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435",last_performed:"\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435",next_due:"\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0441\u0440\u043E\u043A",days_until_due:"\u0414\u043D\u0435\u0439 \u0434\u043E \u0441\u0440\u043E\u043A\u0430",avg_duration:"\u0421\u0440. \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",trigger:"\u0422\u0440\u0438\u0433\u0433\u0435\u0440",trigger_type:"\u0422\u0438\u043F \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u0430",threshold_above:"\u0412\u0435\u0440\u0445\u043D\u0438\u0439 \u043F\u0440\u0435\u0434\u0435\u043B",threshold_below:"\u041D\u0438\u0436\u043D\u0438\u0439 \u043F\u0440\u0435\u0434\u0435\u043B",threshold:"\u041F\u043E\u0440\u043E\u0433",counter:"\u0421\u0447\u0451\u0442\u0447\u0438\u043A",state_change:"\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F",runtime:"\u0412\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B",runtime_hours:"\u0426\u0435\u043B\u0435\u0432\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B (\u0447\u0430\u0441\u044B)",target_value:"\u0426\u0435\u043B\u0435\u0432\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",baseline:"\u0411\u0430\u0437\u043E\u0432\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",target_changes:"\u0426\u0435\u043B\u0435\u0432\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",for_minutes:"\u041D\u0430 (\u043C\u0438\u043D\u0443\u0442)",time_based:"\u041F\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438",sensor_based:"\u041F\u043E \u0434\u0430\u0442\u0447\u0438\u043A\u0443",manual:"\u0412\u0440\u0443\u0447\u043D\u0443\u044E",cleaning:"\u0427\u0438\u0441\u0442\u043A\u0430",inspection:"\u041E\u0441\u043C\u043E\u0442\u0440",replacement:"\u0417\u0430\u043C\u0435\u043D\u0430",calibration:"\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430",service:"\u0421\u0435\u0440\u0432\u0438\u0441",custom:"\u0421\u0432\u043E\u0451",history:"\u0418\u0441\u0442\u043E\u0440\u0438\u044F",cost:"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",duration:"\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",both:"\u041E\u0431\u0430",trigger_val:"\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u0430",complete_title:"\u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C: ",checklist:"\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",checklist_steps_optional:"\u0428\u0430\u0433\u0438 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)",checklist_placeholder:`\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440
\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u0443\u043F\u043B\u043E\u0442\u043D\u0438\u0442\u0435\u043B\u044C
\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0434\u0430\u0432\u043B\u0435\u043D\u0438\u0435`,checklist_help:"\u041E\u0434\u0438\u043D \u0448\u0430\u0433 \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0443. \u041C\u0430\u043A\u0441. 100 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432.",err_too_long:"{field}: \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0434\u043B\u0438\u043D\u043D\u043E (\u043C\u0430\u043A\u0441. {n} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)",err_too_short:"{field}: \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043A\u043E\u0440\u043E\u0442\u043A\u043E (\u043C\u0438\u043D. {n} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)",err_value_too_high:"{field}: \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0432\u0435\u043B\u0438\u043A\u043E (\u043C\u0430\u043A\u0441. {n})",err_value_too_low:"{field}: \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u043E (\u043C\u0438\u043D. {n})",err_required:"{field}: \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u043B\u0435",err_wrong_type:"{field}: \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0442\u0438\u043F (\u043E\u0436\u0438\u0434\u0430\u043B\u0441\u044F: {type})",err_invalid_choice:"{field}: \u043D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",err_invalid_value:"{field}: \u043D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",feat_schedule_time:"\u041F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0434\u043D\u044F",feat_schedule_time_desc:"\u0417\u0430\u0434\u0430\u0447\u0438 \u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0442\u0441\u044F \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043D\u044B\u043C\u0438 \u0432 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0451\u043D\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0434\u043D\u044F, \u0430 \u043D\u0435 \u0432 \u043F\u043E\u043B\u043D\u043E\u0447\u044C.",schedule_time_optional:"\u0421\u0440\u043E\u043A (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E, HH:MM)",schedule_time_help:"\u041F\u0443\u0441\u0442\u043E = \u043F\u043E\u043B\u043D\u043E\u0447\u044C (\u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E). \u0427\u0430\u0441\u043E\u0432\u043E\u0439 \u043F\u043E\u044F\u0441 HA.",at_time:"\u0432",notes_optional:"\u041F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u044F (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",cost_optional:"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",duration_minutes:"\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0432 \u043C\u0438\u043D\u0443\u0442\u0430\u0445 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",days:"\u0434\u043D\u0435\u0439",day:"\u0434\u0435\u043D\u044C",today:"\u0421\u0435\u0433\u043E\u0434\u043D\u044F",d_overdue:"\u0434\u043D. \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043E",no_tasks:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447 \u043F\u043E \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044E. \u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043E\u0431\u044A\u0435\u043A\u0442, \u0447\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C.",no_tasks_short:"\u041D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447",no_history:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0432 \u0438\u0441\u0442\u043E\u0440\u0438\u0438.",show_all:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435",cost_duration_chart:"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0438 \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",installed:"\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D",confirm_delete_object:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u043E\u0442 \u043E\u0431\u044A\u0435\u043A\u0442 \u0438 \u0432\u0441\u0435 \u0435\u0433\u043E \u0437\u0430\u0434\u0430\u0447\u0438?",confirm_delete_task:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u0443 \u0437\u0430\u0434\u0430\u0447\u0443?",min:"\u041C\u0438\u043D",max:"\u041C\u0430\u043A\u0441",save:"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",saving:"\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u2026",edit_task:"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443",new_task:"\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",task_name:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",maintenance_type:"\u0422\u0438\u043F \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",schedule_type:"\u0422\u0438\u043F \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F",interval_days:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B (\u0434\u043D\u0438)",warning_days:"\u0414\u043D\u0438 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F",interval_anchor:"\u042F\u043A\u043E\u0440\u044C \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430",anchor_completion:"\u041E\u0442 \u0434\u0430\u0442\u044B \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F",anchor_planned:"\u041E\u0442 \u043F\u043B\u0430\u043D\u043E\u0432\u043E\u0439 \u0434\u0430\u0442\u044B (\u0431\u0435\u0437 \u0441\u043C\u0435\u0449\u0435\u043D\u0438\u044F)",edit_object:"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442",name:"\u0418\u043C\u044F",manufacturer_optional:"\u041F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",model_optional:"\u041C\u043E\u0434\u0435\u043B\u044C (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",serial_number_optional:"\u0421\u0435\u0440\u0438\u0439\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",serial_number_label:"\u0421/\u041D",sort_due_date:"\u0421\u0440\u043E\u043A",sort_object:"\u0418\u043C\u044F \u043E\u0431\u044A\u0435\u043A\u0442\u0430",sort_type:"\u0422\u0438\u043F",sort_task_name:"\u0418\u043C\u044F \u0437\u0430\u0434\u0430\u0447\u0438",all_objects:"\u0412\u0441\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u044B",tasks_lower:"\u0437\u0430\u0434\u0430\u0447",no_tasks_yet:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447",add_first_task:"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0435\u0440\u0432\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443",last_performed_optional:"\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",trigger_configuration:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u0430",entity_id:"ID \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438",comma_separated:"\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E",entity_logic:"\u041B\u043E\u0433\u0438\u043A\u0430 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439",entity_logic_any:"\u041B\u044E\u0431\u0430\u044F \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u044C \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442",entity_logic_all:"\u0412\u0441\u0435 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u0441\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C",entities:"\u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438",attribute_optional:"\u0410\u0442\u0440\u0438\u0431\u0443\u0442 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E, \u043F\u0443\u0441\u0442\u043E = \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435)",use_entity_state:"\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438 (\u0431\u0435\u0437 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430)",trigger_above:"\u0421\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0442\u044C \u0432\u044B\u0448\u0435",trigger_below:"\u0421\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0442\u044C \u043D\u0438\u0436\u0435",for_at_least_minutes:"\u041D\u0435 \u043C\u0435\u043D\u0435\u0435 (\u043C\u0438\u043D\u0443\u0442)",safety_interval_days:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438 (\u0434\u043D\u0438, \u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",delta_mode:"\u0420\u0435\u0436\u0438\u043C \u0434\u0435\u043B\u044C\u0442\u044B",from_state_optional:"\u0418\u0437 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",to_state_optional:"\u0412 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",documentation_url_optional:"URL \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u0438 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",nfc_tag_id_optional:"ID NFC-\u043C\u0435\u0442\u043A\u0438 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",environmental_entity_optional:"\u0414\u0430\u0442\u0447\u0438\u043A \u043E\u043A\u0440\u0443\u0436\u0430\u044E\u0449\u0435\u0439 \u0441\u0440\u0435\u0434\u044B (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",environmental_entity_helper:"\u043D\u0430\u043F\u0440. sensor.outdoor_temperature \u2014 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u0443\u0435\u0442 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u0443\u0441\u043B\u043E\u0432\u0438\u0439",environmental_attribute_optional:"\u0410\u0442\u0440\u0438\u0431\u0443\u0442 \u0441\u0440\u0435\u0434\u044B (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",nfc_tag_id:"ID NFC-\u043C\u0435\u0442\u043A\u0438",nfc_linked:"NFC-\u043C\u0435\u0442\u043A\u0430 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D\u0430",nfc_link_hint:"\u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C NFC-\u043C\u0435\u0442\u043A\u0443",responsible_user:"\u041E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",no_user_assigned:"(\u041D\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D)",all_users:"\u0412\u0441\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438",my_tasks:"\u041C\u043E\u0438 \u0437\u0430\u0434\u0430\u0447\u0438",budget_monthly:"\u041C\u0435\u0441\u044F\u0447\u043D\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",budget_yearly:"\u0413\u043E\u0434\u043E\u0432\u043E\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",groups:"\u0413\u0440\u0443\u043F\u043F\u044B",new_group:"\u041D\u043E\u0432\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430",edit_group:"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443",no_groups:"\u0413\u0440\u0443\u043F\u043F \u043F\u043E\u043A\u0430 \u043D\u0435\u0442",delete_group:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443",delete_group_confirm:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443 '{name}'?",group_select_tasks:"\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0438",group_name_required:"\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0438\u043C\u044F",description_optional:"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",selected:"\u0412\u044B\u0431\u0440\u0430\u043D\u043E",loading_chart:"\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0433\u0440\u0430\u0444\u0438\u043A\u0430...",was_maintenance_needed:"\u0422\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u043E\u0441\u044C \u043B\u0438 \u044D\u0442\u043E \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435?",feedback_needed:"\u0422\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u043E\u0441\u044C",feedback_not_needed:"\u041D\u0435 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u043E\u0441\u044C",feedback_not_sure:"\u041D\u0435 \u0443\u0432\u0435\u0440\u0435\u043D",suggested_interval:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u043C\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",apply_suggestion:"\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C",reanalyze:"\u041F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0437",reanalyze_result:"\u041D\u043E\u0432\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0437",reanalyze_insufficient_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438",data_points:"\u0442\u043E\u0447\u0435\u043A \u0434\u0430\u043D\u043D\u044B\u0445",dismiss_suggestion:"\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C",confidence_low:"\u041D\u0438\u0437\u043A\u0430\u044F",confidence_medium:"\u0421\u0440\u0435\u0434\u043D\u044F\u044F",confidence_high:"\u0412\u044B\u0441\u043E\u043A\u0430\u044F",recommended:"\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F",seasonal_awareness:"\u0421\u0435\u0437\u043E\u043D\u043D\u0430\u044F \u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u044F",edit_seasonal_overrides:"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442\u044B",seasonal_overrides_title:"\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442\u044B (\u043F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0435)",seasonal_overrides_hint:"\u041A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442 \u043D\u0430 \u043C\u0435\u0441\u044F\u0446 (0.1\u20135.0). \u041F\u0443\u0441\u0442\u043E = \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438.",seasonal_override_invalid:"\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",seasonal_override_range:"\u041A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043E\u0442 0.1 \u0434\u043E 5.0",clear_all:"\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0435",seasonal_chart_title:"\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u0444\u0430\u043A\u0442\u043E\u0440\u044B",seasonal_learned:"\u0418\u0437\u0443\u0447\u0435\u043D\u043D\u044B\u0435",seasonal_manual:"\u0420\u0443\u0447\u043D\u044B\u0435",month_jan:"\u042F\u043D\u0432",month_feb:"\u0424\u0435\u0432",month_mar:"\u041C\u0430\u0440",month_apr:"\u0410\u043F\u0440",month_may:"\u041C\u0430\u0439",month_jun:"\u0418\u044E\u043D",month_jul:"\u0418\u044E\u043B",month_aug:"\u0410\u0432\u0433",month_sep:"\u0421\u0435\u043D",month_oct:"\u041E\u043A\u0442",month_nov:"\u041D\u043E\u044F",month_dec:"\u0414\u0435\u043A",sensor_prediction:"\u041F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0430\u043D\u0438\u0435 \u043F\u043E \u0434\u0430\u0442\u0447\u0438\u043A\u0443",degradation_trend:"\u0422\u0440\u0435\u043D\u0434",trend_rising:"\u0420\u0430\u0441\u0442\u0443\u0449\u0438\u0439",trend_falling:"\u041F\u0430\u0434\u0430\u044E\u0449\u0438\u0439",trend_stable:"\u0421\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0439",trend_insufficient_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0445",days_until_threshold:"\u0414\u043D\u0435\u0439 \u0434\u043E \u043F\u043E\u0440\u043E\u0433\u0430",threshold_exceeded:"\u041F\u043E\u0440\u043E\u0433 \u043F\u0440\u0435\u0432\u044B\u0448\u0435\u043D",environmental_adjustment:"\u0424\u0430\u043A\u0442\u043E\u0440 \u0441\u0440\u0435\u0434\u044B",sensor_prediction_urgency:"\u0414\u0430\u0442\u0447\u0438\u043A \u043F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043F\u043E\u0440\u043E\u0433 \u0447\u0435\u0440\u0435\u0437 ~{days} \u0434\u043D\u0435\u0439",day_short:"\u0434\u043D",weibull_reliability_curve:"\u041A\u0440\u0438\u0432\u0430\u044F \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0441\u0442\u0438",weibull_failure_probability:"\u0412\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044C \u043E\u0442\u043A\u0430\u0437\u0430",weibull_r_squared:"\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0430\u043F\u043F\u0440\u043E\u043A\u0441\u0438\u043C\u0430\u0446\u0438\u0438 R\xB2",beta_early_failures:"\u0420\u0430\u043D\u043D\u0438\u0435 \u043E\u0442\u043A\u0430\u0437\u044B",beta_random_failures:"\u0421\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0435 \u043E\u0442\u043A\u0430\u0437\u044B",beta_wear_out:"\u0418\u0437\u043D\u043E\u0441",beta_highly_predictable:"\u0412\u044B\u0441\u043E\u043A\u0430\u044F \u043F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0443\u0435\u043C\u043E\u0441\u0442\u044C",confidence_interval:"\u0414\u043E\u0432\u0435\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",confidence_conservative:"\u041A\u043E\u043D\u0441\u0435\u0440\u0432\u0430\u0442\u0438\u0432\u043D\u044B\u0439",confidence_aggressive:"\u041E\u043F\u0442\u0438\u043C\u0438\u0441\u0442\u0438\u0447\u043D\u044B\u0439",current_interval_marker:"\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",recommended_marker:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u043C\u044B\u0439",characteristic_life:"\u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0441\u0440\u043E\u043A \u0441\u043B\u0443\u0436\u0431\u044B",chart_mini_sparkline:"\u041C\u0438\u043D\u0438-\u0433\u0440\u0430\u0444\u0438\u043A \u0442\u0440\u0435\u043D\u0434\u0430",chart_history:"\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u0438 \u0438 \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0438",chart_seasonal:"\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u0444\u0430\u043A\u0442\u043E\u0440\u044B, 12 \u043C\u0435\u0441\u044F\u0446\u0435\u0432",chart_weibull:"\u041A\u0440\u0438\u0432\u0430\u044F \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0441\u0442\u0438 \u0412\u0435\u0439\u0431\u0443\u043B\u043B\u0430",chart_sparkline:"\u0413\u0440\u0430\u0444\u0438\u043A \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u0430 \u0434\u0430\u0442\u0447\u0438\u043A\u0430",days_progress:"\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u043F\u043E \u0434\u043D\u044F\u043C",qr_code:"QR-\u043A\u043E\u0434",qr_generating:"\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F QR-\u043A\u043E\u0434\u0430\u2026",qr_error:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C QR-\u043A\u043E\u0434.",qr_error_no_url:"URL HA \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D. \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u0432\u043D\u0435\u0448\u043D\u0438\u0439 \u0438\u043B\u0438 \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u0439 URL \u0432 \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u2192 \u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u2192 \u0421\u0435\u0442\u044C.",save_error:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.",qr_print:"\u041F\u0435\u0447\u0430\u0442\u044C",qr_download:"\u0421\u043A\u0430\u0447\u0430\u0442\u044C SVG",qr_action:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438",qr_action_view:"\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440",qr_action_complete:"\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u043E\u0435",qr_url_mode:"\u0422\u0438\u043F \u0441\u0441\u044B\u043B\u043A\u0438",qr_mode_companion:"\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435-\u043A\u043E\u043C\u043F\u0430\u043D\u044C\u043E\u043D",qr_mode_local:"\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 (mDNS)",qr_mode_server:"URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430",overview:"\u041E\u0431\u0437\u043E\u0440",analysis:"\u0410\u043D\u0430\u043B\u0438\u0437",recent_activities:"\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",search_notes:"\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0437\u0430\u043C\u0435\u0442\u043A\u0430\u043C",avg_cost:"\u0421\u0440. \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",no_advanced_features:"\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438 \u043D\u0435 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B",no_advanced_features_hint:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \xAB\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u044B\u0435 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B\xBB \u0438\u043B\u0438 \xAB\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u044B\xBB \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0437\u0434\u0435\u0441\u044C \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0443.",analysis_not_enough_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0430\u043D\u0430\u043B\u0438\u0437\u0430.",analysis_not_enough_data_hint:"\u0414\u043B\u044F \u0430\u043D\u0430\u043B\u0438\u0437\u0430 \u0412\u0435\u0439\u0431\u0443\u043B\u043B\u0430 \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u043C\u0438\u043D\u0438\u043C\u0443\u043C 5 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u044B\u0445 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0439; \u0441\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u044B \u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0442\u0441\u044F \u0432\u0438\u0434\u043D\u044B \u043F\u043E\u0441\u043B\u0435 6+ \u0442\u043E\u0447\u0435\u043A \u0434\u0430\u043D\u043D\u044B\u0445 \u0432 \u043C\u0435\u0441\u044F\u0446.",analysis_manual_task_hint:"\u0420\u0443\u0447\u043D\u044B\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0431\u0435\u0437 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430 \u043D\u0435 \u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u044E\u0442 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0443.",completions:"\u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0439",current:"\u0422\u0435\u043A\u0443\u0449\u0438\u0439",shorter:"\u041A\u043E\u0440\u043E\u0447\u0435",longer:"\u0414\u043B\u0438\u043D\u043D\u0435\u0435",normal:"\u041D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u044B\u0439",disabled:"\u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E",compound_logic:"\u0421\u043E\u0441\u0442\u0430\u0432\u043D\u0430\u044F \u043B\u043E\u0433\u0438\u043A\u0430",card_title:"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",card_show_header:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u043E \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u043E\u0439",card_show_actions:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439",card_compact:"\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C",card_max_items:"\u041C\u0430\u043A\u0441. \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 (0 = \u0432\u0441\u0435)",card_filter_status:"\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u0443",card_filter_status_help:"\u041F\u0443\u0441\u0442\u043E = \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u044B.",card_filter_objects:"\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E \u043E\u0431\u044A\u0435\u043A\u0442\u0430\u043C",card_filter_objects_help:"\u041F\u0443\u0441\u0442\u043E = \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u044B.",card_filter_entities:"\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u044F\u043C (entity_ids)",card_filter_entities_help:"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438 sensor / binary_sensor \u0438\u0437 \u044D\u0442\u043E\u0439 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438. \u041F\u0443\u0441\u0442\u043E = \u0432\u0441\u0435.",card_loading_objects:"\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432\u2026",card_load_error:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442\u044B \u2014 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 WebSocket-\u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435.",card_no_tasks_title:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",card_no_tasks_cta:"\u2192 \u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0432 \u043F\u0430\u043D\u0435\u043B\u0438 Maintenance",no_objects:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432.",action_error:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.",area_id_optional:"\u0417\u043E\u043D\u0430 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",installation_date_optional:"\u0414\u0430\u0442\u0430 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",custom_icon_optional:"\u0418\u043A\u043E\u043D\u043A\u0430 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 mdi:wrench)",task_enabled:"\u0417\u0430\u0434\u0430\u0447\u0430 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0430",skip_reason_prompt:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u044D\u0442\u0443 \u0437\u0430\u0434\u0430\u0447\u0443?",reason_optional:"\u041F\u0440\u0438\u0447\u0438\u043D\u0430 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",reset_date_prompt:"\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443 \u043A\u0430\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u0443\u044E?",reset_date_optional:"\u0414\u0430\u0442\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0433\u043E \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E, \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E: \u0441\u0435\u0433\u043E\u0434\u043D\u044F)",notes_label:"\u041F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u044F",documentation_label:"\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F",no_nfc_tag:"\u2014 \u041D\u0435\u0442 \u043C\u0435\u0442\u043A\u0438 \u2014",dashboard:"\u041F\u0430\u043D\u0435\u043B\u044C",settings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",settings_features:"\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438",settings_features_desc:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0438\u043B\u0438 \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438. \u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0441\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0438\u0445 \u0438\u0437 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430, \u043D\u043E \u043D\u0435 \u0443\u0434\u0430\u043B\u044F\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0435.",feat_adaptive:"\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u043E\u0435 \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",feat_adaptive_desc:"\u0418\u0437\u0443\u0447\u0430\u0442\u044C \u043E\u043F\u0442\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0435 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B \u0438\u0437 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",feat_predictions:"\u041F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0430\u043D\u0438\u044F \u043F\u043E \u0434\u0430\u0442\u0447\u0438\u043A\u0430\u043C",feat_predictions_desc:"\u041F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0434\u0430\u0442\u044B \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u043D\u0438\u044F \u043F\u043E \u0434\u0435\u0433\u0440\u0430\u0434\u0430\u0446\u0438\u0438 \u0434\u0430\u0442\u0447\u0438\u043A\u0430",feat_seasonal:"\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u043A\u0438",feat_seasonal_desc:"\u041A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0441\u0435\u0437\u043E\u043D\u043D\u044B\u0445 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u043E\u0432",feat_environmental:"\u042D\u043A\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043A\u043E\u0440\u0440\u0435\u043B\u044F\u0446\u0438\u044F",feat_environmental_desc:"\u0421\u0432\u044F\u0437\u044B\u0432\u0430\u0442\u044C \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B \u0441 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u043E\u0439/\u0432\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C\u044E",feat_budget:"\u041E\u0442\u0441\u043B\u0435\u0436\u0438\u0432\u0430\u043D\u0438\u0435 \u0431\u044E\u0434\u0436\u0435\u0442\u0430",feat_budget_desc:"\u041E\u0442\u0441\u043B\u0435\u0436\u0438\u0432\u0430\u0442\u044C \u043C\u0435\u0441\u044F\u0447\u043D\u044B\u0435 \u0438 \u0433\u043E\u0434\u043E\u0432\u044B\u0435 \u0440\u0430\u0441\u0445\u043E\u0434\u044B \u043D\u0430 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435",feat_groups:"\u0413\u0440\u0443\u043F\u043F\u044B \u0437\u0430\u0434\u0430\u0447",feat_groups_desc:"\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u043E\u0432\u044B\u0432\u0430\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0438 \u0432 \u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B",feat_checklists:"\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C\u043D\u044B\u0435 \u0441\u043F\u0438\u0441\u043A\u0438",feat_checklists_desc:"\u041C\u043D\u043E\u0433\u043E\u0448\u0430\u0433\u043E\u0432\u044B\u0435 \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u044B \u0434\u043B\u044F \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u0437\u0430\u0434\u0430\u0447\u0438",settings_general:"\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435",settings_default_warning:"\u0414\u043D\u0438 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",settings_panel_enabled:"\u0411\u043E\u043A\u043E\u0432\u0430\u044F \u043F\u0430\u043D\u0435\u043B\u044C",settings_notifications:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",settings_notify_service:"\u0421\u0435\u0440\u0432\u0438\u0441 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439",test_notification:"\u0422\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435",send_test:"\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0442\u0435\u0441\u0442",testing:"\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430\u2026",test_notification_success:"\u0422\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E",test_notification_failed:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0442\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435",settings_notify_due_soon:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C, \u043A\u043E\u0433\u0434\u0430 \u0441\u0440\u043E\u043A \u0441\u043A\u043E\u0440\u043E \u0438\u0441\u0442\u0435\u043A\u0430\u0435\u0442",settings_notify_overdue:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C \u043F\u0440\u0438 \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u043A\u0435",settings_notify_triggered:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C \u043F\u0440\u0438 \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u043D\u0438\u0438",settings_interval_hours:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u044F (\u0447\u0430\u0441\u044B, 0 = \u043E\u0434\u0438\u043D \u0440\u0430\u0437)",settings_quiet_hours:"\u0427\u0430\u0441\u044B \u0442\u0438\u0448\u0438\u043D\u044B",settings_quiet_start:"\u041D\u0430\u0447\u0430\u043B\u043E",settings_quiet_end:"\u041A\u043E\u043D\u0435\u0446",settings_max_per_day:"\u041C\u0430\u043A\u0441. \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439 \u0432 \u0434\u0435\u043D\u044C (0 = \u0431\u0435\u0437 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0439)",settings_bundling:"\u0413\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",settings_bundle_threshold:"\u041F\u043E\u0440\u043E\u0433 \u0433\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0438",settings_actions:"\u041A\u043D\u043E\u043F\u043A\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u0432 \u043C\u043E\u0431\u0438\u043B\u044C\u043D\u043E\u043C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438",settings_action_complete:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C\xBB",settings_action_skip:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C\xBB",settings_action_snooze:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u041E\u0442\u043B\u043E\u0436\u0438\u0442\u044C\xBB",settings_snooze_hours:"\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043E\u0442\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u043D\u0438\u044F (\u0447\u0430\u0441\u044B)",settings_budget:"\u0411\u044E\u0434\u0436\u0435\u0442",settings_currency:"\u0412\u0430\u043B\u044E\u0442\u0430",settings_budget_monthly:"\u041C\u0435\u0441\u044F\u0447\u043D\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_yearly:"\u0413\u043E\u0434\u043E\u0432\u043E\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_alerts:"\u041E\u043F\u043E\u0432\u0435\u0449\u0435\u043D\u0438\u044F \u043E \u0431\u044E\u0434\u0436\u0435\u0442\u0435",settings_budget_threshold:"\u041F\u043E\u0440\u043E\u0433 \u043E\u043F\u043E\u0432\u0435\u0449\u0435\u043D\u0438\u044F (%)",settings_import_export:"\u0418\u043C\u043F\u043E\u0440\u0442 / \u042D\u043A\u0441\u043F\u043E\u0440\u0442",settings_export_json:"\u042D\u043A\u0441\u043F\u043E\u0440\u0442 JSON",settings_export_csv:"\u042D\u043A\u0441\u043F\u043E\u0440\u0442 CSV",settings_import_csv:"\u0418\u043C\u043F\u043E\u0440\u0442 CSV",settings_import_placeholder:"\u0412\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 JSON \u0438\u043B\u0438 CSV \u0437\u0434\u0435\u0441\u044C\u2026",settings_import_btn:"\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C",settings_import_success:"\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432: {count}.",settings_export_success:"\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D.",settings_saved:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430.",settings_include_history:"\u0412\u043A\u043B\u044E\u0447\u0430\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u044E",sort_alphabetical:"\u041F\u043E \u0430\u043B\u0444\u0430\u0432\u0438\u0442\u0443",sort_due_soonest:"\u0411\u043B\u0438\u0436\u0430\u0439\u0448\u0438\u0439 \u0441\u0440\u043E\u043A",sort_task_count:"\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0437\u0430\u0434\u0430\u0447",sort_area:"\u041E\u0431\u043B\u0430\u0441\u0442\u044C",sort_assigned_user:"\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",sort_group:"\u0413\u0440\u0443\u043F\u043F\u0430",groupby_none:"\u0411\u0435\u0437 \u0433\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0438",groupby_area:"\u041F\u043E \u043E\u0431\u043B\u0430\u0441\u0442\u0438",groupby_group:"\u041F\u043E \u0433\u0440\u0443\u043F\u043F\u0435",groupby_user:"\u041F\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044E",filter_label:"\u0424\u0438\u043B\u044C\u0442\u0440",user_label:"\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",sort_label:"\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430",group_by_label:"\u0413\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E",state_value_help:'\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F HA (\u043E\u0431\u044B\u0447\u043D\u043E \u0432 \u043D\u0438\u0436\u043D\u0435\u043C \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0435, \u043D\u0430\u043F\u0440. "on"/"off"). \u0420\u0435\u0433\u0438\u0441\u0442\u0440 \u043D\u043E\u0440\u043C\u0430\u043B\u0438\u0437\u0443\u0435\u0442\u0441\u044F \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438.',target_changes_help:"\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u043E\u0432, \u043F\u043E\u0441\u043B\u0435 \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442 \u0442\u0440\u0438\u0433\u0433\u0435\u0440 (\u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E: 1).",qr_print_title:"\u041F\u0435\u0447\u0430\u0442\u044C QR-\u043A\u043E\u0434\u043E\u0432",qr_print_desc:"\u0421\u043E\u0437\u0434\u0430\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0434\u043B\u044F \u043F\u0435\u0447\u0430\u0442\u0438 \u0441 QR-\u043A\u043E\u0434\u0430\u043C\u0438 \u0434\u043B\u044F \u0432\u044B\u0440\u0435\u0437\u0430\u043D\u0438\u044F \u0438 \u043D\u0430\u043A\u043B\u0435\u0438\u0432\u0430\u043D\u0438\u044F \u043D\u0430 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u0435.",qr_print_load:"\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442\u044B",qr_print_filter:"\u0424\u0438\u043B\u044C\u0442\u0440",qr_print_objects:"\u041E\u0431\u044A\u0435\u043A\u0442\u044B",qr_print_actions:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F",qr_print_url_mode:"\u0422\u0438\u043F \u0441\u0441\u044B\u043B\u043A\u0438",qr_print_estimate:"\u041E\u0446\u0435\u043D\u043A\u0430 QR-\u043A\u043E\u0434\u043E\u0432",qr_print_over_limit:"\u043B\u0438\u043C\u0438\u0442 200, \u0441\u0443\u0437\u044C \u0444\u0438\u043B\u044C\u0442\u0440",qr_print_generate:"\u0421\u043E\u0437\u0434\u0430\u0442\u044C QR-\u043A\u043E\u0434\u044B",qr_print_generating:"\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435\u2026",qr_print_ready:"QR-\u043A\u043E\u0434\u044B \u0433\u043E\u0442\u043E\u0432\u044B",qr_print_print_button:"\u041F\u0435\u0447\u0430\u0442\u044C",qr_print_empty:"\u041D\u0435\u0447\u0435\u0433\u043E \u0441\u043E\u0437\u0434\u0430\u0432\u0430\u0442\u044C",qr_action_skip:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C",unassigned:"\u041D\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u043E",no_area:"\u0411\u0435\u0437 \u043E\u0431\u043B\u0430\u0441\u0442\u0438",has_overdue:"\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043D\u044B\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",object:"\u041E\u0431\u044A\u0435\u043A\u0442",settings_panel_access:"\u0414\u043E\u0441\u0442\u0443\u043F \u043A \u043F\u0430\u043D\u0435\u043B\u0438",settings_panel_access_desc:"\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u044B \u0432\u0441\u0435\u0433\u0434\u0430 \u0432\u0438\u0434\u044F\u0442 \u043F\u043E\u043B\u043D\u0443\u044E \u043F\u0430\u043D\u0435\u043B\u044C. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0437\u0434\u0435\u0441\u044C \u043D\u0435-\u0430\u0434\u043C\u0438\u043D \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0442\u0430\u043A\u0436\u0435 \u0434\u043E\u043B\u0436\u043D\u044B \u0438\u043C\u0435\u0442\u044C \u043F\u043E\u043B\u043D\u044B\u0439 \u0434\u043E\u0441\u0442\u0443\u043F \u2014 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0432\u0438\u0434\u044F\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0438 \u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C.",no_non_admin_users:"\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043D\u0435-\u0430\u0434\u043C\u0438\u043D \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0438\u0445 \u0432 \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u2192 \u041B\u044E\u0434\u0438.",owner_label:"\u0412\u043B\u0430\u0434\u0435\u043B\u0435\u0446"},pa={maintenance:"Konserwacja",objects:"Obiekty",tasks:"Zadania",overdue:"Zaleg\u0142e",due_soon:"Wkr\xF3tce",triggered:"Wyzwolone",ok:"OK",all:"Wszystkie",new_object:"+ Nowy obiekt",edit:"Edytuj",delete:"Usu\u0144",add_task:"+ Dodaj zadanie",complete:"Wykonaj",completed:"Wykonano",skip:"Pomi\u0144",skipped:"Pomini\u0119te",reset:"Resetuj",cancel:"Anuluj",completing:"Wykonywanie\u2026",interval:"Interwa\u0142",warning:"Ostrze\u017Cenie",last_performed:"Ostatnio wykonane",next_due:"Nast\u0119pny termin",days_until_due:"Dni do terminu",avg_duration:"\u015Ar. czas trwania",trigger:"Wyzwalacz",trigger_type:"Typ wyzwalacza",threshold_above:"G\xF3rny limit",threshold_below:"Dolny limit",threshold:"Pr\xF3g",counter:"Licznik",state_change:"Zmiana stanu",runtime:"Czas pracy",runtime_hours:"Docelowy czas pracy (godziny)",target_value:"Warto\u015B\u0107 docelowa",baseline:"Warto\u015B\u0107 bazowa",target_changes:"Docelowa liczba zmian",for_minutes:"Przez (minuty)",time_based:"Czasowy",sensor_based:"Oparty na czujniku",manual:"R\u0119czny",cleaning:"Czyszczenie",inspection:"Inspekcja",replacement:"Wymiana",calibration:"Kalibracja",service:"Serwis",custom:"Niestandardowy",history:"Historia",cost:"Koszt",duration:"Czas trwania",both:"Oba",trigger_val:"Warto\u015B\u0107 wyzwalacza",complete_title:"Wykonaj: ",checklist:"Lista kontrolna",checklist_steps_optional:"Kroki listy kontrolnej (opcjonalne)",checklist_placeholder:`Wyczy\u015B\u0107 filtr
Wymie\u0144 uszczelk\u0119
Sprawd\u017A ci\u015Bnienie`,checklist_help:"Jeden krok na lini\u0119. Maks. 100 element\xF3w.",err_too_long:"{field}: za d\u0142ugie (maks. {n} znak\xF3w)",err_too_short:"{field}: za kr\xF3tkie (min. {n} znak\xF3w)",err_value_too_high:"{field}: za du\u017Ce (maks. {n})",err_value_too_low:"{field}: za ma\u0142e (min. {n})",err_required:"{field}: wymagane",err_wrong_type:"{field}: z\u0142y typ (oczekiwano: {type})",err_invalid_choice:"{field}: niedozwolona warto\u015B\u0107",err_invalid_value:"{field}: nieprawid\u0142owa warto\u015B\u0107",feat_schedule_time:"Harmonogram wed\u0142ug pory dnia",feat_schedule_time_desc:"Zadania staj\u0105 si\u0119 zaleg\u0142e o okre\u015Blonej porze dnia zamiast o p\xF3\u0142nocy.",schedule_time_optional:"Termin o godzinie (opcjonalne, HH:MM)",schedule_time_help:"Puste = p\xF3\u0142noc (domy\u015Blnie). Strefa czasowa HA.",at_time:"o",notes_optional:"Notatki (opcjonalne)",cost_optional:"Koszt (opcjonalne)",duration_minutes:"Czas trwania w minutach (opcjonalne)",days:"dni",day:"dzie\u0144",today:"Dzisiaj",d_overdue:"d zaleg\u0142e",no_tasks:"Jeszcze brak zada\u0144 konserwacyjnych. Utw\xF3rz obiekt, aby zacz\u0105\u0107.",no_tasks_short:"Brak zada\u0144",no_history:"Jeszcze brak wpis\xF3w historii.",show_all:"Poka\u017C wszystko",cost_duration_chart:"Koszt i czas trwania",installed:"Zainstalowane",confirm_delete_object:"Usun\u0105\u0107 ten obiekt i wszystkie jego zadania?",confirm_delete_task:"Usun\u0105\u0107 to zadanie?",min:"Min",max:"Maks",save:"Zapisz",saving:"Zapisywanie\u2026",edit_task:"Edytuj zadanie",new_task:"Nowe zadanie konserwacyjne",task_name:"Nazwa zadania",maintenance_type:"Typ konserwacji",schedule_type:"Typ harmonogramu",interval_days:"Interwa\u0142 (dni)",warning_days:"Dni ostrze\u017Cenia",last_performed_optional:"Ostatnio wykonane (opcjonalne)",interval_anchor:"Punkt zaczepienia interwa\u0142u",anchor_completion:"Od daty wykonania",anchor_planned:"Od daty planowanej (bez przesuni\u0119\u0107)",edit_object:"Edytuj obiekt",name:"Nazwa",manufacturer_optional:"Producent (opcjonalne)",model_optional:"Model (opcjonalne)",serial_number_optional:"Numer seryjny (opcjonalne)",serial_number_label:"S/N",sort_due_date:"Termin",sort_object:"Nazwa obiektu",sort_type:"Typ",sort_task_name:"Nazwa zadania",all_objects:"Wszystkie obiekty",tasks_lower:"zada\u0144",no_tasks_yet:"Jeszcze brak zada\u0144",add_first_task:"Dodaj pierwsze zadanie",trigger_configuration:"Konfiguracja wyzwalacza",entity_id:"ID encji",comma_separated:"oddzielone przecinkami",entity_logic:"Logika encji",entity_logic_any:"Wyzwala dowolna encja",entity_logic_all:"Wszystkie encje musz\u0105 wyzwoli\u0107",entities:"encje",attribute_optional:"Atrybut (opcjonalny, puste = stan)",use_entity_state:"U\u017Cyj stanu encji (bez atrybutu)",trigger_above:"Wyzw\xF3l powy\u017Cej",trigger_below:"Wyzw\xF3l poni\u017Cej",for_at_least_minutes:"Przez co najmniej (minuty)",safety_interval_days:"Interwa\u0142 bezpiecze\u0144stwa (dni, opcjonalny)",delta_mode:"Tryb delta",from_state_optional:"Ze stanu (opcjonalne)",to_state_optional:"Do stanu (opcjonalne)",documentation_url_optional:"URL dokumentacji (opcjonalne)",nfc_tag_id_optional:"ID tagu NFC (opcjonalne)",environmental_entity_optional:"Czujnik \u015Brodowiskowy (opcjonalne)",environmental_entity_helper:"np. sensor.outdoor_temperature \u2014 dostosowuje interwa\u0142 na podstawie warunk\xF3w \u015Brodowiskowych",environmental_attribute_optional:"Atrybut \u015Brodowiskowy (opcjonalne)",nfc_tag_id:"ID tagu NFC",nfc_linked:"Tag NFC powi\u0105zany",nfc_link_hint:"Kliknij, aby powi\u0105za\u0107 tag NFC",responsible_user:"Odpowiedzialny u\u017Cytkownik",no_user_assigned:"(Brak przypisanego u\u017Cytkownika)",all_users:"Wszyscy u\u017Cytkownicy",my_tasks:"Moje zadania",budget_monthly:"Bud\u017Cet miesi\u0119czny",budget_yearly:"Bud\u017Cet roczny",groups:"Grupy",new_group:"Nowa grupa",edit_group:"Edytuj grup\u0119",no_groups:"Jeszcze brak grup",delete_group:"Usu\u0144 grup\u0119",delete_group_confirm:"Usun\u0105\u0107 grup\u0119 '{name}'?",group_select_tasks:"Wybierz zadania",group_name_required:"Nazwa jest wymagana",description_optional:"Opis (opcjonalny)",selected:"Wybrane",loading_chart:"\u0141adowanie danych wykresu...",was_maintenance_needed:"Czy ta konserwacja by\u0142a potrzebna?",feedback_needed:"Potrzebna",feedback_not_needed:"Niepotrzebna",feedback_not_sure:"Nie jestem pewien",suggested_interval:"Sugerowany interwa\u0142",apply_suggestion:"Zastosuj",reanalyze:"Analizuj ponownie",reanalyze_result:"Nowa analiza",reanalyze_insufficient_data:"Za ma\u0142o danych do wygenerowania rekomendacji",data_points:"punkty danych",dismiss_suggestion:"Odrzu\u0107",confidence_low:"Niska",confidence_medium:"\u015Arednia",confidence_high:"Wysoka",recommended:"rekomendowane",seasonal_awareness:"\u015Awiadomo\u015B\u0107 sezonowa",edit_seasonal_overrides:"Edytuj czynniki sezonowe",seasonal_overrides_title:"Czynniki sezonowe (nadpisanie)",seasonal_overrides_hint:"Czynnik na miesi\u0105c (0.1\u20135.0). Puste = uczone automatycznie.",seasonal_override_invalid:"Nieprawid\u0142owa warto\u015B\u0107",seasonal_override_range:"Czynnik musi by\u0107 mi\u0119dzy 0.1 a 5.0",clear_all:"Wyczy\u015B\u0107 wszystko",seasonal_chart_title:"Czynniki sezonowe",seasonal_learned:"Wyuczone",seasonal_manual:"R\u0119czne",month_jan:"Sty",month_feb:"Lut",month_mar:"Mar",month_apr:"Kwi",month_may:"Maj",month_jun:"Cze",month_jul:"Lip",month_aug:"Sie",month_sep:"Wrz",month_oct:"Pa\u017A",month_nov:"Lis",month_dec:"Gru",sensor_prediction:"Predykcja czujnika",degradation_trend:"Trend",trend_rising:"Rosn\u0105cy",trend_falling:"Malej\u0105cy",trend_stable:"Stabilny",trend_insufficient_data:"Niewystarczaj\u0105ce dane",days_until_threshold:"Dni do progu",threshold_exceeded:"Pr\xF3g przekroczony",environmental_adjustment:"Czynnik \u015Brodowiskowy",sensor_prediction_urgency:"Czujnik przewiduje pr\xF3g za ~{days} dni",day_short:"d",weibull_reliability_curve:"Krzywa niezawodno\u015Bci",weibull_failure_probability:"Prawdopodobie\u0144stwo awarii",weibull_r_squared:"Dopasowanie R\xB2",beta_early_failures:"Wczesne awarie",beta_random_failures:"Losowe awarie",beta_wear_out:"Zu\u017Cycie",beta_highly_predictable:"Wysoce przewidywalne",confidence_interval:"Przedzia\u0142 ufno\u015Bci",confidence_conservative:"Konserwatywny",confidence_aggressive:"Optymistyczny",current_interval_marker:"Bie\u017C\u0105cy interwa\u0142",recommended_marker:"Rekomendowany",characteristic_life:"Charakterystyczna \u017Cywotno\u015B\u0107",chart_mini_sparkline:"Wykres trendu",chart_history:"Historia koszt\xF3w i czasu trwania",chart_seasonal:"Czynniki sezonowe, 12 miesi\u0119cy",chart_weibull:"Krzywa niezawodno\u015Bci Weibulla",chart_sparkline:"Wykres warto\u015Bci wyzwalacza czujnika",days_progress:"Post\u0119p dni",qr_code:"Kod QR",qr_generating:"Generowanie kodu QR\u2026",qr_error:"Nie uda\u0142o si\u0119 wygenerowa\u0107 kodu QR.",qr_error_no_url:"Brak skonfigurowanego URL HA. Ustaw zewn\u0119trzny lub wewn\u0119trzny URL w Ustawienia \u2192 System \u2192 Sie\u0107.",save_error:"Nie uda\u0142o si\u0119 zapisa\u0107. Spr\xF3buj ponownie.",qr_print:"Drukuj",qr_download:"Pobierz SVG",qr_action:"Akcja przy skanowaniu",qr_action_view:"Wy\u015Bwietl informacje o konserwacji",qr_action_complete:"Oznacz konserwacj\u0119 jako wykonan\u0105",qr_url_mode:"Typ linku",qr_mode_companion:"Companion App",qr_mode_local:"Lokalny (mDNS)",qr_mode_server:"URL serwera",overview:"Przegl\u0105d",analysis:"Analiza",recent_activities:"Ostatnie aktywno\u015Bci",search_notes:"Szukaj w notatkach",avg_cost:"\u015Ar. koszt",no_advanced_features:"Brak w\u0142\u0105czonych funkcji zaawansowanych",no_advanced_features_hint:"W\u0142\u0105cz \u201EAdaptacyjne interwa\u0142y\u201D lub \u201EWzorce sezonowe\u201D w ustawieniach integracji, aby zobaczy\u0107 tutaj dane analityczne.",analysis_not_enough_data:"Jeszcze za ma\u0142o danych do analizy.",analysis_not_enough_data_hint:"Analiza Weibulla wymaga co najmniej 5 wykonanych konserwacji; wzorce sezonowe staj\u0105 si\u0119 widoczne po 6+ punktach danych na miesi\u0105c.",analysis_manual_task_hint:"Zadania r\u0119czne bez interwa\u0142u nie generuj\u0105 danych analitycznych.",completions:"wykonania",current:"Bie\u017C\u0105ce",shorter:"Kr\xF3tsze",longer:"D\u0142u\u017Csze",normal:"Normalne",disabled:"Wy\u0142\u0105czone",compound_logic:"Logika z\u0142o\u017Cona",card_title:"Tytu\u0142",card_show_header:"Poka\u017C nag\u0142\xF3wek ze statystykami",card_show_actions:"Poka\u017C przyciski akcji",card_compact:"Tryb kompaktowy",card_max_items:"Maks. element\xF3w (0 = wszystkie)",card_filter_status:"Filtruj wg statusu",card_filter_status_help:"Puste = poka\u017C wszystkie statusy.",card_filter_objects:"Filtruj wg obiekt\xF3w",card_filter_objects_help:"Puste = poka\u017C wszystkie obiekty.",card_filter_entities:"Filtruj wg encji (entity_ids)",card_filter_entities_help:"Wybierz encje sensor / binary_sensor z tej integracji. Puste = wszystkie.",card_loading_objects:"\u0141adowanie obiekt\xF3w\u2026",card_load_error:"Nie uda\u0142o si\u0119 za\u0142adowa\u0107 obiekt\xF3w \u2014 sprawd\u017A po\u0142\u0105czenie WebSocket.",card_no_tasks_title:"Brak zada\u0144 konserwacyjnych",card_no_tasks_cta:"\u2192 Utw\xF3rz w panelu Maintenance",no_objects:"Brak obiekt\xF3w.",action_error:"Akcja nie powiod\u0142a si\u0119. Spr\xF3buj ponownie.",area_id_optional:"Obszar (opcjonalny)",installation_date_optional:"Data instalacji (opcjonalna)",custom_icon_optional:"Ikona (opcjonalna, np. mdi:wrench)",task_enabled:"Zadanie w\u0142\u0105czone",skip_reason_prompt:"Pomin\u0105\u0107 to zadanie?",reason_optional:"Pow\xF3d (opcjonalny)",reset_date_prompt:"Oznaczy\u0107 zadanie jako wykonane?",reset_date_optional:"Data ostatniego wykonania (opcjonalna, domy\u015Blnie dzisiaj)",notes_label:"Notatki",documentation_label:"Dokumentacja",no_nfc_tag:"\u2014 Brak tagu \u2014",dashboard:"Pulpit",settings:"Ustawienia",settings_features:"Funkcje zaawansowane",settings_features_desc:"W\u0142\u0105cz lub wy\u0142\u0105cz funkcje zaawansowane. Wy\u0142\u0105czenie ukrywa je z UI, ale nie usuwa danych.",feat_adaptive:"Harmonogram adaptacyjny",feat_adaptive_desc:"Ucz si\u0119 optymalnych interwa\u0142\xF3w z historii konserwacji",feat_predictions:"Predykcje czujnik\xF3w",feat_predictions_desc:"Przewiduj daty wyzwolenia z degradacji czujnika",feat_seasonal:"Korekty sezonowe",feat_seasonal_desc:"Dostosuj interwa\u0142y do wzorc\xF3w sezonowych",feat_environmental:"Korelacja \u015Brodowiskowa",feat_environmental_desc:"Koreluj interwa\u0142y z temperatur\u0105/wilgotno\u015Bci\u0105",feat_budget:"\u015Aledzenie bud\u017Cetu",feat_budget_desc:"\u015Aled\u017A miesi\u0119czne i roczne wydatki na konserwacj\u0119",feat_groups:"Grupy zada\u0144",feat_groups_desc:"Organizuj zadania w grupy logiczne",feat_checklists:"Listy kontrolne",feat_checklists_desc:"Wieloetapowe procedury wykonania zadania",settings_general:"Og\xF3lne",settings_default_warning:"Domy\u015Blne dni ostrze\u017Cenia",settings_panel_enabled:"Panel boczny",settings_notifications:"Powiadomienia",settings_notify_service:"Us\u0142uga powiadomie\u0144",test_notification:"Powiadomienie testowe",send_test:"Wy\u015Blij test",testing:"Wysy\u0142anie\u2026",test_notification_success:"Powiadomienie testowe wys\u0142ane",test_notification_failed:"Powiadomienie testowe nie powiod\u0142o si\u0119",settings_notify_due_soon:"Powiadom gdy wkr\xF3tce",settings_notify_overdue:"Powiadom gdy zaleg\u0142e",settings_notify_triggered:"Powiadom gdy wyzwolone",settings_interval_hours:"Interwa\u0142 powtarzania (godziny, 0 = raz)",settings_quiet_hours:"Godziny ciszy",settings_quiet_start:"Pocz\u0105tek",settings_quiet_end:"Koniec",settings_max_per_day:"Maks. powiadomie\u0144 dziennie (0 = bez limitu)",settings_bundling:"Grupowanie powiadomie\u0144",settings_bundle_threshold:"Pr\xF3g grupowania",settings_actions:"Mobilne przyciski akcji",settings_action_complete:"Poka\u017C przycisk 'Wykonaj'",settings_action_skip:"Poka\u017C przycisk 'Pomi\u0144'",settings_action_snooze:"Poka\u017C przycisk 'Drzemka'",settings_snooze_hours:"Czas drzemki (godziny)",settings_budget:"Bud\u017Cet",settings_currency:"Waluta",settings_budget_monthly:"Bud\u017Cet miesi\u0119czny",settings_budget_yearly:"Bud\u017Cet roczny",settings_budget_alerts:"Alerty bud\u017Cetowe",settings_budget_threshold:"Pr\xF3g alertu (%)",settings_import_export:"Import / Eksport",settings_export_json:"Eksportuj JSON",settings_export_csv:"Eksportuj CSV",settings_import_csv:"Importuj CSV",settings_import_placeholder:"Wklej tutaj zawarto\u015B\u0107 JSON lub CSV\u2026",settings_import_btn:"Importuj",settings_import_success:"{count} obiekt\xF3w zaimportowanych pomy\u015Blnie.",settings_export_success:"Eksport pobrany.",settings_saved:"Ustawienie zapisane.",settings_include_history:"Do\u0142\u0105cz histori\u0119",sort_alphabetical:"Alfabetycznie",sort_due_soonest:"Najbli\u017Cszy termin",sort_task_count:"Liczba zada\u0144",sort_area:"Obszar",sort_assigned_user:"Przypisany u\u017Cytkownik",sort_group:"Grupa",groupby_none:"Bez grupowania",groupby_area:"Wg obszaru",groupby_group:"Wg grupy",groupby_user:"Wg u\u017Cytkownika",filter_label:"Filtr",user_label:"U\u017Cytkownik",sort_label:"Sortowanie",group_by_label:"Grupuj wg",state_value_help:'U\u017Cyj warto\u015Bci stanu HA (zwykle ma\u0142ymi literami, np. "on"/"off"). Wielko\u015B\u0107 liter jest normalizowana przy zapisie.',target_changes_help:"Liczba pasuj\u0105cych przej\u015B\u0107 przed wyzwoleniem (domy\u015Blnie: 1).",qr_print_title:"Drukuj kody QR",qr_print_desc:"Wygeneruj stron\u0119 do druku z kodami QR do wyci\u0119cia i naklejenia na sprz\u0119cie.",qr_print_load:"Za\u0142aduj obiekty",qr_print_filter:"Filtr",qr_print_objects:"Obiekty",qr_print_actions:"Akcje",qr_print_url_mode:"Typ linku",qr_print_estimate:"Szacowane kody QR",qr_print_over_limit:"limit 200, zaw\u0119\u017A filtr",qr_print_generate:"Generuj kody QR",qr_print_generating:"Generowanie\u2026",qr_print_ready:"Kody QR gotowe",qr_print_print_button:"Drukuj",qr_print_empty:"Nic do wygenerowania",qr_action_skip:"Pomi\u0144",unassigned:"Nieprzypisane",no_area:"Brak obszaru",has_overdue:"Ma zaleg\u0142e zadania",object:"Obiekt",settings_panel_access:"Dost\u0119p do panelu",settings_panel_access_desc:"Administratorzy zawsze widz\u0105 pe\u0142ny panel. Wybierz tutaj u\u017Cytkownik\xF3w nie-admin, kt\xF3rzy r\xF3wnie\u017C powinni mie\u0107 pe\u0142ny dost\u0119p \u2014 pozostali widz\u0105 tylko Wykonaj i Pomi\u0144.",no_non_admin_users:"Nie znaleziono u\u017Cytkownik\xF3w nie-admin. Dodaj ich w Ustawienia \u2192 Osoby.",owner_label:"W\u0142a\u015Bciciel"},ga={maintenance:"\xDAdr\u017Eba",objects:"Objekty",tasks:"\xDAkoly",overdue:"Po term\xEDnu",due_soon:"Brzy",triggered:"Spu\u0161t\u011Bno",ok:"OK",all:"V\u0161e",new_object:"+ Nov\xFD objekt",edit:"Upravit",delete:"Smazat",add_task:"+ P\u0159idat \xFAkol",complete:"Dokon\u010Dit",completed:"Dokon\u010Deno",skip:"P\u0159esko\u010Dit",skipped:"P\u0159esko\u010Deno",reset:"Reset",cancel:"Zru\u0161it",completing:"Dokon\u010Dov\xE1n\xED\u2026",interval:"Interval",warning:"Upozorn\u011Bn\xED",last_performed:"Naposledy provedeno",next_due:"Dal\u0161\xED term\xEDn",days_until_due:"Dn\u016F do term\xEDnu",avg_duration:"Pr\u016Fm. trv\xE1n\xED",trigger:"Spou\u0161t\u011B\u010D",trigger_type:"Typ spou\u0161t\u011B\u010De",threshold_above:"Horn\xED limit",threshold_below:"Doln\xED limit",threshold:"Pr\xE1h",counter:"\u010C\xEDta\u010D",state_change:"Zm\u011Bna stavu",runtime:"Doba b\u011Bhu",runtime_hours:"C\xEDlov\xE1 doba b\u011Bhu (hodiny)",target_value:"C\xEDlov\xE1 hodnota",baseline:"Z\xE1kladn\xED hodnota",target_changes:"C\xEDlov\xFD po\u010Det zm\u011Bn",for_minutes:"Po dobu (minut)",time_based:"\u010Casov\xFD",sensor_based:"Zalo\u017Een\xFD na senzoru",manual:"Manu\xE1ln\xED",cleaning:"\u010Ci\u0161t\u011Bn\xED",inspection:"Inspekce",replacement:"V\xFDm\u011Bna",calibration:"Kalibrace",service:"Servis",custom:"Vlastn\xED",history:"Historie",cost:"N\xE1klady",duration:"Doba trv\xE1n\xED",both:"Oboj\xED",trigger_val:"Hodnota spou\u0161t\u011B\u010De",complete_title:"Dokon\u010Dit: ",checklist:"Kontroln\xED seznam",checklist_steps_optional:"Kroky kontroln\xEDho seznamu (voliteln\xE9)",checklist_placeholder:`Vy\u010Distit filtr
Vym\u011Bnit t\u011Bsn\u011Bn\xED
Otestovat tlak`,checklist_help:"Jeden krok na \u0159\xE1dek. Max 100 polo\u017Eek.",err_too_long:"{field}: p\u0159\xEDli\u0161 dlouh\xE9 (max {n} znak\u016F)",err_too_short:"{field}: p\u0159\xEDli\u0161 kr\xE1tk\xE9 (min {n} znak\u016F)",err_value_too_high:"{field}: p\u0159\xEDli\u0161 velk\xE9 (max {n})",err_value_too_low:"{field}: p\u0159\xEDli\u0161 mal\xE9 (min {n})",err_required:"{field}: povinn\xE9",err_wrong_type:"{field}: \u0161patn\xFD typ (o\u010Dek\xE1v\xE1n: {type})",err_invalid_choice:"{field}: nepovolen\xE1 hodnota",err_invalid_value:"{field}: neplatn\xE1 hodnota",feat_schedule_time:"Pl\xE1nov\xE1n\xED podle denn\xED doby",feat_schedule_time_desc:"\xDAkoly se stanou po term\xEDnu v ur\u010Denou denn\xED dobu m\xEDsto o p\u016Flnoci.",schedule_time_optional:"Term\xEDn v \u010Dase (voliteln\xE9, HH:MM)",schedule_time_help:"Pr\xE1zdn\xE9 = p\u016Flnoc (v\xFDchoz\xED). \u010Casov\xE9 p\xE1smo HA.",at_time:"v",notes_optional:"Pozn\xE1mky (voliteln\xE9)",cost_optional:"N\xE1klady (voliteln\xE9)",duration_minutes:"Doba trv\xE1n\xED v minut\xE1ch (voliteln\xE9)",days:"dn\xED",day:"den",today:"Dnes",d_overdue:"d po term\xEDnu",no_tasks:"Zat\xEDm \u017E\xE1dn\xE9 \xFAkoly \xFAdr\u017Eby. Vytvo\u0159te objekt pro za\u010D\xE1tek.",no_tasks_short:"\u017D\xE1dn\xE9 \xFAkoly",no_history:"Zat\xEDm \u017E\xE1dn\xE9 z\xE1znamy historie.",show_all:"Zobrazit v\u0161e",cost_duration_chart:"N\xE1klady a doba trv\xE1n\xED",installed:"Nainstalov\xE1no",confirm_delete_object:"Smazat tento objekt a v\u0161echny jeho \xFAkoly?",confirm_delete_task:"Smazat tento \xFAkol?",min:"Min",max:"Max",save:"Ulo\u017Eit",saving:"Ukl\xE1d\xE1n\xED\u2026",edit_task:"Upravit \xFAkol",new_task:"Nov\xFD \xFAkol \xFAdr\u017Eby",task_name:"N\xE1zev \xFAkolu",maintenance_type:"Typ \xFAdr\u017Eby",schedule_type:"Typ rozvrhu",interval_days:"Interval (dny)",warning_days:"Dny upozorn\u011Bn\xED",last_performed_optional:"Naposledy provedeno (voliteln\xE9)",interval_anchor:"Ukotven\xED intervalu",anchor_completion:"Od data dokon\u010Den\xED",anchor_planned:"Od pl\xE1novan\xE9ho data (bez posunu)",edit_object:"Upravit objekt",name:"N\xE1zev",manufacturer_optional:"V\xFDrobce (voliteln\xE9)",model_optional:"Model (voliteln\xE9)",serial_number_optional:"S\xE9riov\xE9 \u010D\xEDslo (voliteln\xE9)",serial_number_label:"S/N",sort_due_date:"Term\xEDn",sort_object:"N\xE1zev objektu",sort_type:"Typ",sort_task_name:"N\xE1zev \xFAkolu",all_objects:"V\u0161echny objekty",tasks_lower:"\xFAkol\u016F",no_tasks_yet:"Zat\xEDm \u017E\xE1dn\xE9 \xFAkoly",add_first_task:"P\u0159idat prvn\xED \xFAkol",trigger_configuration:"Konfigurace spou\u0161t\u011B\u010De",entity_id:"ID entity",comma_separated:"odd\u011Blen\xE9 \u010D\xE1rkami",entity_logic:"Logika entit",entity_logic_any:"Spust\xED libovoln\xE1 entita",entity_logic_all:"V\u0161echny entity mus\xED spustit",entities:"entity",attribute_optional:"Atribut (voliteln\xFD, pr\xE1zdn\xFD = stav)",use_entity_state:"Pou\u017E\xEDt stav entity (bez atributu)",trigger_above:"Spustit nad",trigger_below:"Spustit pod",for_at_least_minutes:"Po dobu alespo\u0148 (minut)",safety_interval_days:"Bezpe\u010Dnostn\xED interval (dny, voliteln\xFD)",delta_mode:"Re\u017Eim delta",from_state_optional:"Ze stavu (voliteln\xE9)",to_state_optional:"Do stavu (voliteln\xE9)",documentation_url_optional:"URL dokumentace (voliteln\xE9)",nfc_tag_id_optional:"ID NFC tagu (voliteln\xE9)",environmental_entity_optional:"Senzor prost\u0159ed\xED (voliteln\xFD)",environmental_entity_helper:"nap\u0159. sensor.outdoor_temperature \u2014 upravuje interval podle podm\xEDnek prost\u0159ed\xED",environmental_attribute_optional:"Atribut prost\u0159ed\xED (voliteln\xFD)",nfc_tag_id:"ID NFC tagu",nfc_linked:"NFC tag propojen",nfc_link_hint:"Klikn\u011Bte pro propojen\xED NFC tagu",responsible_user:"Zodpov\u011Bdn\xFD u\u017Eivatel",no_user_assigned:"(\u017D\xE1dn\xFD u\u017Eivatel p\u0159i\u0159azen)",all_users:"V\u0161ichni u\u017Eivatel\xE9",my_tasks:"Moje \xFAkoly",budget_monthly:"M\u011Bs\xED\u010Dn\xED rozpo\u010Det",budget_yearly:"Ro\u010Dn\xED rozpo\u010Det",groups:"Skupiny",new_group:"Nov\xE1 skupina",edit_group:"Upravit skupinu",no_groups:"Zat\xEDm \u017E\xE1dn\xE9 skupiny",delete_group:"Smazat skupinu",delete_group_confirm:"Smazat skupinu '{name}'?",group_select_tasks:"Vybrat \xFAkoly",group_name_required:"N\xE1zev je povinn\xFD",description_optional:"Popis (voliteln\xFD)",selected:"Vybr\xE1no",loading_chart:"Na\u010D\xEDt\xE1n\xED dat grafu...",was_maintenance_needed:"Byla tato \xFAdr\u017Eba pot\u0159eba?",feedback_needed:"Pot\u0159ebn\xE1",feedback_not_needed:"Nepot\u0159ebn\xE1",feedback_not_sure:"Nejsem si jist\xFD",suggested_interval:"Navrhovan\xFD interval",apply_suggestion:"Pou\u017E\xEDt",reanalyze:"Znovu analyzovat",reanalyze_result:"Nov\xE1 anal\xFDza",reanalyze_insufficient_data:"Nedostatek dat pro vytvo\u0159en\xED doporu\u010Den\xED",data_points:"datov\xFDch bod\u016F",dismiss_suggestion:"Zav\u0159\xEDt",confidence_low:"N\xEDzk\xE1",confidence_medium:"St\u0159edn\xED",confidence_high:"Vysok\xE1",recommended:"doporu\u010Deno",seasonal_awareness:"Sez\xF3nn\xED pov\u011Bdom\xED",edit_seasonal_overrides:"Upravit sez\xF3nn\xED faktory",seasonal_overrides_title:"Sez\xF3nn\xED faktory (p\u0159eps\xE1n\xED)",seasonal_overrides_hint:"Faktor na m\u011Bs\xEDc (0.1\u20135.0). Pr\xE1zdn\xE9 = nau\u010Deno automaticky.",seasonal_override_invalid:"Neplatn\xE1 hodnota",seasonal_override_range:"Faktor mus\xED b\xFDt mezi 0.1 a 5.0",clear_all:"Vymazat v\u0161e",seasonal_chart_title:"Sez\xF3nn\xED faktory",seasonal_learned:"Nau\u010Den\xE9",seasonal_manual:"Manu\xE1ln\xED",month_jan:"Led",month_feb:"\xDAno",month_mar:"B\u0159e",month_apr:"Dub",month_may:"Kv\u011B",month_jun:"\u010Cer",month_jul:"\u010Cvc",month_aug:"Srp",month_sep:"Z\xE1\u0159",month_oct:"\u0158\xEDj",month_nov:"Lis",month_dec:"Pro",sensor_prediction:"Predikce senzoru",degradation_trend:"Trend",trend_rising:"Rostouc\xED",trend_falling:"Klesaj\xEDc\xED",trend_stable:"Stabiln\xED",trend_insufficient_data:"Nedostatek dat",days_until_threshold:"Dn\u016F do prahu",threshold_exceeded:"Pr\xE1h p\u0159ekro\u010Den",environmental_adjustment:"Faktor prost\u0159ed\xED",sensor_prediction_urgency:"Senzor p\u0159edpov\xEDd\xE1 pr\xE1h za ~{days} dn\xED",day_short:"d",weibull_reliability_curve:"K\u0159ivka spolehlivosti",weibull_failure_probability:"Pravd\u011Bpodobnost selh\xE1n\xED",weibull_r_squared:"Shoda R\xB2",beta_early_failures:"\u010Casn\xE1 selh\xE1n\xED",beta_random_failures:"N\xE1hodn\xE1 selh\xE1n\xED",beta_wear_out:"Opot\u0159eben\xED",beta_highly_predictable:"Vysoce p\u0159edv\xEDdateln\xE9",confidence_interval:"Interval spolehlivosti",confidence_conservative:"Konzervativn\xED",confidence_aggressive:"Optimistick\xFD",current_interval_marker:"Aktu\xE1ln\xED interval",recommended_marker:"Doporu\u010Den\xFD",characteristic_life:"Charakteristick\xE1 \u017Eivotnost",chart_mini_sparkline:"Graf trendu",chart_history:"Historie n\xE1klad\u016F a doby trv\xE1n\xED",chart_seasonal:"Sez\xF3nn\xED faktory, 12 m\u011Bs\xEDc\u016F",chart_weibull:"Weibullova k\u0159ivka spolehlivosti",chart_sparkline:"Graf hodnoty spou\u0161t\u011B\u010De senzoru",days_progress:"Postup dn\u016F",qr_code:"QR k\xF3d",qr_generating:"Generov\xE1n\xED QR k\xF3du\u2026",qr_error:"Nepoda\u0159ilo se vygenerovat QR k\xF3d.",qr_error_no_url:"Nen\xED nakonfigurov\xE1no URL HA. Nastavte extern\xED nebo intern\xED URL v Nastaven\xED \u2192 Syst\xE9m \u2192 S\xED\u0165.",save_error:"Nepoda\u0159ilo se ulo\u017Eit. Zkuste to znovu.",qr_print:"Tisk",qr_download:"St\xE1hnout SVG",qr_action:"Akce p\u0159i skenov\xE1n\xED",qr_action_view:"Zobrazit informace o \xFAdr\u017Eb\u011B",qr_action_complete:"Ozna\u010Dit \xFAdr\u017Ebu jako dokon\u010Denou",qr_url_mode:"Typ odkazu",qr_mode_companion:"Companion App",qr_mode_local:"Lok\xE1ln\xED (mDNS)",qr_mode_server:"URL serveru",overview:"P\u0159ehled",analysis:"Anal\xFDza",recent_activities:"Ned\xE1vn\xE9 aktivity",search_notes:"Hledat v pozn\xE1mk\xE1ch",avg_cost:"Pr\u016Fm. n\xE1klady",no_advanced_features:"\u017D\xE1dn\xE9 pokro\u010Dil\xE9 funkce nejsou povoleny",no_advanced_features_hint:"Povolte \u201EAdaptivn\xED intervaly\u201D nebo \u201ESez\xF3nn\xED vzory\u201D v nastaven\xED integrace pro zobrazen\xED analytick\xFDch dat.",analysis_not_enough_data:"Zat\xEDm nedostatek dat pro anal\xFDzu.",analysis_not_enough_data_hint:"Weibullova anal\xFDza vy\u017Eaduje alespo\u0148 5 dokon\u010Den\xFDch \xFAdr\u017Eeb; sez\xF3nn\xED vzory se stanou viditeln\xE9 po 6+ datov\xFDch bodech na m\u011Bs\xEDc.",analysis_manual_task_hint:"Manu\xE1ln\xED \xFAkoly bez intervalu negeneruj\xED analytick\xE1 data.",completions:"dokon\u010Den\xED",current:"Aktu\xE1ln\xED",shorter:"Krat\u0161\xED",longer:"Del\u0161\xED",normal:"Norm\xE1ln\xED",disabled:"Zak\xE1z\xE1no",compound_logic:"Slo\u017Een\xE1 logika",card_title:"N\xE1zev",card_show_header:"Zobrazit z\xE1hlav\xED se statistikami",card_show_actions:"Zobrazit tla\u010D\xEDtka akc\xED",card_compact:"Kompaktn\xED re\u017Eim",card_max_items:"Max polo\u017Eek (0 = v\u0161e)",card_filter_status:"Filtrovat podle stavu",card_filter_status_help:"Pr\xE1zdn\xE9 = zobrazit v\u0161echny stavy.",card_filter_objects:"Filtrovat podle objekt\u016F",card_filter_objects_help:"Pr\xE1zdn\xE9 = zobrazit v\u0161echny objekty.",card_filter_entities:"Filtrovat podle entit (entity_ids)",card_filter_entities_help:"Vyberte entity sensor / binary_sensor z t\xE9to integrace. Pr\xE1zdn\xE9 = v\u0161echny.",card_loading_objects:"Na\u010D\xEDt\xE1n\xED objekt\u016F\u2026",card_load_error:"Nepoda\u0159ilo se na\u010D\xEDst objekty \u2014 zkontrolujte WebSocket spojen\xED.",card_no_tasks_title:"Zat\xEDm \u017E\xE1dn\xE9 \xFAkoly \xFAdr\u017Eby",card_no_tasks_cta:"\u2192 Vytvo\u0159te v panelu Maintenance",no_objects:"Zat\xEDm \u017E\xE1dn\xE9 objekty.",action_error:"Akce se nezda\u0159ila. Zkuste to znovu.",area_id_optional:"Oblast (voliteln\xE1)",installation_date_optional:"Datum instalace (voliteln\xE9)",custom_icon_optional:"Ikona (voliteln\xE1, nap\u0159. mdi:wrench)",task_enabled:"\xDAkol povolen",skip_reason_prompt:"P\u0159esko\u010Dit tento \xFAkol?",reason_optional:"D\u016Fvod (voliteln\xFD)",reset_date_prompt:"Ozna\u010Dit \xFAkol jako proveden\xFD?",reset_date_optional:"Datum posledn\xEDho proveden\xED (voliteln\xE9, v\xFDchoz\xED dnes)",notes_label:"Pozn\xE1mky",documentation_label:"Dokumentace",no_nfc_tag:"\u2014 \u017D\xE1dn\xFD tag \u2014",dashboard:"P\u0159ehled",settings:"Nastaven\xED",settings_features:"Pokro\u010Dil\xE9 funkce",settings_features_desc:"Povolte nebo zaka\u017Ete pokro\u010Dil\xE9 funkce. Zak\xE1z\xE1n\xED je skryje z UI, ale nesma\u017Ee data.",feat_adaptive:"Adaptivn\xED pl\xE1nov\xE1n\xED",feat_adaptive_desc:"U\u010Dte se optim\xE1ln\xED intervaly z historie \xFAdr\u017Eby",feat_predictions:"Predikce senzor\u016F",feat_predictions_desc:"P\u0159edpov\xEDdejte term\xEDny spou\u0161t\u011Bn\xED z degradace senzoru",feat_seasonal:"Sez\xF3nn\xED \xFApravy",feat_seasonal_desc:"Upravte intervaly podle sez\xF3nn\xEDch vzor\u016F",feat_environmental:"Korelace s prost\u0159ed\xEDm",feat_environmental_desc:"Korelujte intervaly s teplotou/vlhkost\xED",feat_budget:"Sledov\xE1n\xED rozpo\u010Dtu",feat_budget_desc:"Sledujte m\u011Bs\xED\u010Dn\xED a ro\u010Dn\xED v\xFDdaje na \xFAdr\u017Ebu",feat_groups:"Skupiny \xFAkol\u016F",feat_groups_desc:"Organizujte \xFAkoly do logick\xFDch skupin",feat_checklists:"Kontroln\xED seznamy",feat_checklists_desc:"V\xEDcestup\u0148ov\xE9 procedury pro dokon\u010Den\xED \xFAkolu",settings_general:"Obecn\xE9",settings_default_warning:"V\xFDchoz\xED dny upozorn\u011Bn\xED",settings_panel_enabled:"Bo\u010Dn\xED panel",settings_notifications:"Ozn\xE1men\xED",settings_notify_service:"Slu\u017Eba ozn\xE1men\xED",test_notification:"Testovac\xED ozn\xE1men\xED",send_test:"Odeslat test",testing:"Odes\xEDl\xE1n\xED\u2026",test_notification_success:"Testovac\xED ozn\xE1men\xED odesl\xE1no",test_notification_failed:"Testovac\xED ozn\xE1men\xED se nezda\u0159ilo",settings_notify_due_soon:"Ozn\xE1mit kdy\u017E brzy",settings_notify_overdue:"Ozn\xE1mit kdy\u017E po term\xEDnu",settings_notify_triggered:"Ozn\xE1mit kdy\u017E spu\u0161t\u011Bno",settings_interval_hours:"Interval opakov\xE1n\xED (hodiny, 0 = jednou)",settings_quiet_hours:"Tich\xE9 hodiny",settings_quiet_start:"Za\u010D\xE1tek",settings_quiet_end:"Konec",settings_max_per_day:"Max ozn\xE1men\xED denn\u011B (0 = bez limitu)",settings_bundling:"Seskupit ozn\xE1men\xED",settings_bundle_threshold:"Pr\xE1h seskupen\xED",settings_actions:"Mobiln\xED ak\u010Dn\xED tla\u010D\xEDtka",settings_action_complete:"Zobrazit tla\u010D\xEDtko 'Dokon\u010Dit'",settings_action_skip:"Zobrazit tla\u010D\xEDtko 'P\u0159esko\u010Dit'",settings_action_snooze:"Zobrazit tla\u010D\xEDtko 'Odlo\u017Eit'",settings_snooze_hours:"Doba odlo\u017Een\xED (hodiny)",settings_budget:"Rozpo\u010Det",settings_currency:"M\u011Bna",settings_budget_monthly:"M\u011Bs\xED\u010Dn\xED rozpo\u010Det",settings_budget_yearly:"Ro\u010Dn\xED rozpo\u010Det",settings_budget_alerts:"Rozpo\u010Dtov\xE1 upozorn\u011Bn\xED",settings_budget_threshold:"Pr\xE1h upozorn\u011Bn\xED (%)",settings_import_export:"Import / Export",settings_export_json:"Exportovat JSON",settings_export_csv:"Exportovat CSV",settings_import_csv:"Importovat CSV",settings_import_placeholder:"Vlo\u017Ete sem obsah JSON nebo CSV\u2026",settings_import_btn:"Importovat",settings_import_success:"{count} objekt\u016F \xFAsp\u011B\u0161n\u011B importov\xE1no.",settings_export_success:"Export sta\u017Een.",settings_saved:"Nastaven\xED ulo\u017Eeno.",settings_include_history:"Zahrnout historii",sort_alphabetical:"Abecedn\u011B",sort_due_soonest:"Nejbli\u017E\u0161\xED term\xEDn",sort_task_count:"Po\u010Det \xFAkol\u016F",sort_area:"Oblast",sort_assigned_user:"P\u0159i\u0159azen\xFD u\u017Eivatel",sort_group:"Skupina",groupby_none:"Bez seskupen\xED",groupby_area:"Podle oblasti",groupby_group:"Podle skupiny",groupby_user:"Podle u\u017Eivatele",filter_label:"Filtr",user_label:"U\u017Eivatel",sort_label:"\u0158azen\xED",group_by_label:"Seskupit podle",state_value_help:'Pou\u017Eijte hodnotu stavu HA (obvykle mal\xFDmi p\xEDsmeny, nap\u0159. "on"/"off"). Velikost p\xEDsmen se p\u0159i ulo\u017Een\xED normalizuje.',target_changes_help:"Po\u010Det odpov\xEDdaj\xEDc\xEDch p\u0159echod\u016F, po kter\xFDch se trigger spust\xED (v\xFDchoz\xED: 1).",qr_print_title:"Tisk QR k\xF3d\u016F",qr_print_desc:"Vygeneruj tiskovou str\xE1nku s QR k\xF3dy k vyst\u0159i\u017Een\xED a nalepen\xED na za\u0159\xEDzen\xED.",qr_print_load:"Na\u010D\xEDst objekty",qr_print_filter:"Filtr",qr_print_objects:"Objekty",qr_print_actions:"Akce",qr_print_url_mode:"Typ odkazu",qr_print_estimate:"Odhad QR k\xF3d\u016F",qr_print_over_limit:"limit 200, zu\u017Ete filtr",qr_print_generate:"Vygenerovat QR k\xF3dy",qr_print_generating:"Generov\xE1n\xED\u2026",qr_print_ready:"QR k\xF3dy p\u0159ipraveny",qr_print_print_button:"Tisk",qr_print_empty:"Nic k vygenerov\xE1n\xED",qr_action_skip:"P\u0159esko\u010Dit",unassigned:"Nep\u0159i\u0159azeno",no_area:"Bez oblasti",has_overdue:"M\xE1 \xFAkoly po term\xEDnu",object:"Objekt",settings_panel_access:"P\u0159\xEDstup k panelu",settings_panel_access_desc:"Administr\xE1to\u0159i v\u017Edy vid\xED cel\xFD panel. Vyberte zde u\u017Eivatele bez admin pr\xE1v, kte\u0159\xED by m\u011Bli tak\xE9 m\xEDt pln\xFD p\u0159\xEDstup \u2014 ostatn\xED vid\xED pouze Dokon\u010Dit a P\u0159esko\u010Dit.",no_non_admin_users:"Nenalezeni \u017E\xE1dn\xED u\u017Eivatel\xE9 bez admin pr\xE1v. P\u0159idejte je v Nastaven\xED \u2192 Lid\xE9.",owner_label:"Vlastn\xEDk"},ha={maintenance:"Underh\xE5ll",objects:"Objekt",tasks:"Uppgifter",overdue:"F\xF6rsenad",due_soon:"Snart",triggered:"Utl\xF6st",ok:"OK",all:"Alla",new_object:"+ Nytt objekt",edit:"Redigera",delete:"Ta bort",add_task:"+ L\xE4gg till uppgift",complete:"Slutf\xF6r",completed:"Slutf\xF6rd",skip:"Hoppa \xF6ver",skipped:"Hoppade \xF6ver",reset:"\xC5terst\xE4ll",cancel:"Avbryt",completing:"Slutf\xF6r\u2026",interval:"Intervall",warning:"Varning",last_performed:"Senast utf\xF6rd",next_due:"N\xE4sta f\xF6rfallodatum",days_until_due:"Dagar till f\xF6rfallodatum",avg_duration:"Snittlig varaktighet",trigger:"Utl\xF6sare",trigger_type:"Utl\xF6sartyp",threshold_above:"\xD6vre gr\xE4ns",threshold_below:"Undre gr\xE4ns",threshold:"Tr\xF6skel",counter:"R\xE4knare",state_change:"Tillst\xE5nds\xE4ndring",runtime:"K\xF6rtid",runtime_hours:"M\xE5ltid (timmar)",target_value:"M\xE5lv\xE4rde",baseline:"Baslinje",target_changes:"Antal m\xE5lf\xF6r\xE4ndringar",for_minutes:"Under (minuter)",time_based:"Tidsbaserad",sensor_based:"Sensorbaserad",manual:"Manuell",cleaning:"Reng\xF6ring",inspection:"Inspektion",replacement:"Byte",calibration:"Kalibrering",service:"Service",custom:"Anpassad",history:"Historik",cost:"Kostnad",duration:"Varaktighet",both:"B\xE5da",trigger_val:"Utl\xF6sarv\xE4rde",complete_title:"Slutf\xF6r: ",checklist:"Checklista",checklist_steps_optional:"Checkliststeg (valfritt)",checklist_placeholder:`Reng\xF6r filter
Byt t\xE4tning
Testa tryck`,checklist_help:"Ett steg per rad. Max 100 objekt.",err_too_long:"{field}: f\xF6r l\xE5ng (max {n} tecken)",err_too_short:"{field}: f\xF6r kort (min {n} tecken)",err_value_too_high:"{field}: f\xF6r stor (max {n})",err_value_too_low:"{field}: f\xF6r liten (min {n})",err_required:"{field}: kr\xE4vs",err_wrong_type:"{field}: fel typ (f\xF6rv\xE4ntad: {type})",err_invalid_choice:"{field}: ej till\xE5tet v\xE4rde",err_invalid_value:"{field}: ogiltigt v\xE4rde",feat_schedule_time:"Schemal\xE4ggning per tid p\xE5 dygnet",feat_schedule_time_desc:"Uppgifter blir f\xF6rsenade vid en specifik tid p\xE5 dygnet ist\xE4llet f\xF6r midnatt.",schedule_time_optional:"F\xF6rfaller kl. (valfritt, HH:MM)",schedule_time_help:"Tomt = midnatt (standard). HA-tidszon.",at_time:"kl.",notes_optional:"Anteckningar (valfritt)",cost_optional:"Kostnad (valfritt)",duration_minutes:"Varaktighet i minuter (valfritt)",days:"dagar",day:"dag",today:"Idag",d_overdue:"d f\xF6rsenad",no_tasks:"Inga underh\xE5llsuppgifter \xE4nnu. Skapa ett objekt f\xF6r att komma ig\xE5ng.",no_tasks_short:"Inga uppgifter",no_history:"Inga historikposter \xE4nnu.",show_all:"Visa alla",cost_duration_chart:"Kostnad och varaktighet",installed:"Installerad",confirm_delete_object:"Ta bort detta objekt och alla dess uppgifter?",confirm_delete_task:"Ta bort denna uppgift?",min:"Min",max:"Max",save:"Spara",saving:"Sparar\u2026",edit_task:"Redigera uppgift",new_task:"Ny underh\xE5llsuppgift",task_name:"Uppgiftsnamn",maintenance_type:"Underh\xE5llstyp",schedule_type:"Schematyp",interval_days:"Intervall (dagar)",warning_days:"Varningsdagar",last_performed_optional:"Senast utf\xF6rd (valfritt)",interval_anchor:"Intervallankare",anchor_completion:"Fr\xE5n slutf\xF6randedatum",anchor_planned:"Fr\xE5n planerat datum (ingen drift)",edit_object:"Redigera objekt",name:"Namn",manufacturer_optional:"Tillverkare (valfritt)",model_optional:"Modell (valfritt)",serial_number_optional:"Serienummer (valfritt)",serial_number_label:"S/N",sort_due_date:"F\xF6rfallodatum",sort_object:"Objektnamn",sort_type:"Typ",sort_task_name:"Uppgiftsnamn",all_objects:"Alla objekt",tasks_lower:"uppgifter",no_tasks_yet:"Inga uppgifter \xE4nnu",add_first_task:"L\xE4gg till f\xF6rsta uppgift",trigger_configuration:"Utl\xF6sarkonfiguration",entity_id:"Entitets-ID",comma_separated:"kommaseparerad",entity_logic:"Entitetslogik",entity_logic_any:"Vilken entitet som helst utl\xF6ser",entity_logic_all:"Alla entiteter m\xE5ste utl\xF6sa",entities:"entiteter",attribute_optional:"Attribut (valfritt, tomt = tillst\xE5nd)",use_entity_state:"Anv\xE4nd entitetstillst\xE5nd (inget attribut)",trigger_above:"Utl\xF6s \xF6ver",trigger_below:"Utl\xF6s under",for_at_least_minutes:"Under minst (minuter)",safety_interval_days:"S\xE4kerhetsintervall (dagar, valfritt)",delta_mode:"Delta-l\xE4ge",from_state_optional:"Fr\xE5n tillst\xE5nd (valfritt)",to_state_optional:"Till tillst\xE5nd (valfritt)",documentation_url_optional:"Dokumentations-URL (valfritt)",nfc_tag_id_optional:"NFC-tagg-ID (valfritt)",environmental_entity_optional:"Milj\xF6sensor (valfritt)",environmental_entity_helper:"t.ex. sensor.outdoor_temperature \u2014 justerar intervallet baserat p\xE5 milj\xF6f\xF6rh\xE5llanden",environmental_attribute_optional:"Milj\xF6attribut (valfritt)",nfc_tag_id:"NFC-tagg-ID",nfc_linked:"NFC-tagg l\xE4nkad",nfc_link_hint:"Klicka f\xF6r att l\xE4nka NFC-tagg",responsible_user:"Ansvarig anv\xE4ndare",no_user_assigned:"(Ingen anv\xE4ndare tilldelad)",all_users:"Alla anv\xE4ndare",my_tasks:"Mina uppgifter",budget_monthly:"M\xE5natlig budget",budget_yearly:"\xC5rlig budget",groups:"Grupper",new_group:"Ny grupp",edit_group:"Redigera grupp",no_groups:"Inga grupper \xE4nnu",delete_group:"Ta bort grupp",delete_group_confirm:"Ta bort grupp '{name}'?",group_select_tasks:"V\xE4lj uppgifter",group_name_required:"Namn kr\xE4vs",description_optional:"Beskrivning (valfritt)",selected:"Valda",loading_chart:"Laddar diagramdata...",was_maintenance_needed:"Beh\xF6vdes detta underh\xE5ll?",feedback_needed:"Beh\xF6vdes",feedback_not_needed:"Beh\xF6vdes inte",feedback_not_sure:"Os\xE4ker",suggested_interval:"F\xF6reslaget intervall",apply_suggestion:"Till\xE4mpa",reanalyze:"Analysera igen",reanalyze_result:"Ny analys",reanalyze_insufficient_data:"Otillr\xE4ckligt med data f\xF6r rekommendation",data_points:"datapunkter",dismiss_suggestion:"Avvisa",confidence_low:"L\xE5g",confidence_medium:"Medel",confidence_high:"H\xF6g",recommended:"rekommenderad",seasonal_awareness:"S\xE4songsmedvetenhet",edit_seasonal_overrides:"Redigera s\xE4songsfaktorer",seasonal_overrides_title:"S\xE4songsfaktorer (\xE5sidos\xE4tt)",seasonal_overrides_hint:"Faktor per m\xE5nad (0.1\u20135.0). Tomt = l\xE4rt automatiskt.",seasonal_override_invalid:"Ogiltigt v\xE4rde",seasonal_override_range:"Faktor m\xE5ste vara mellan 0.1 och 5.0",clear_all:"Rensa alla",seasonal_chart_title:"S\xE4songsfaktorer",seasonal_learned:"L\xE4rt",seasonal_manual:"Manuell",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"Maj",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensorprediktion",degradation_trend:"Trend",trend_rising:"Stigande",trend_falling:"Fallande",trend_stable:"Stabil",trend_insufficient_data:"Otillr\xE4cklig data",days_until_threshold:"Dagar till tr\xF6skel",threshold_exceeded:"Tr\xF6skel \xF6verskriden",environmental_adjustment:"Milj\xF6faktor",sensor_prediction_urgency:"Sensor f\xF6ruts\xE4ger tr\xF6skel om ~{days} dagar",day_short:"d",weibull_reliability_curve:"Tillf\xF6rlitlighetskurva",weibull_failure_probability:"Felsannolikhet",weibull_r_squared:"Anpassning R\xB2",beta_early_failures:"Tidiga fel",beta_random_failures:"Slumpm\xE4ssiga fel",beta_wear_out:"Slitage",beta_highly_predictable:"Mycket f\xF6ruts\xE4gbar",confidence_interval:"Konfidensintervall",confidence_conservative:"Konservativ",confidence_aggressive:"Optimistisk",current_interval_marker:"Aktuellt intervall",recommended_marker:"Rekommenderat",characteristic_life:"Karakteristisk livsl\xE4ngd",chart_mini_sparkline:"Trenddiagram",chart_history:"Kostnads- och varaktighetshistorik",chart_seasonal:"S\xE4songsfaktorer, 12 m\xE5nader",chart_weibull:"Weibull tillf\xF6rlitlighetskurva",chart_sparkline:"Sensorutl\xF6sarv\xE4rdesdiagram",days_progress:"Dagsf\xF6rlopp",qr_code:"QR-kod",qr_generating:"Genererar QR-kod\u2026",qr_error:"Kunde inte generera QR-kod.",qr_error_no_url:"Ingen HA-URL konfigurerad. Ange en extern eller intern URL i Inst\xE4llningar \u2192 System \u2192 N\xE4tverk.",save_error:"Kunde inte spara. F\xF6rs\xF6k igen.",qr_print:"Skriv ut",qr_download:"Ladda ner SVG",qr_action:"\xC5tg\xE4rd vid skanning",qr_action_view:"Visa underh\xE5llsinformation",qr_action_complete:"Markera underh\xE5ll som slutf\xF6rt",qr_url_mode:"L\xE4nktyp",qr_mode_companion:"Companion App",qr_mode_local:"Lokal (mDNS)",qr_mode_server:"Server-URL",overview:"\xD6versikt",analysis:"Analys",recent_activities:"Senaste aktiviteter",search_notes:"S\xF6k i anteckningar",avg_cost:"Snittlig kostnad",no_advanced_features:"Inga avancerade funktioner aktiverade",no_advanced_features_hint:"Aktivera \u201EAdaptiva intervall\u201D eller \u201ES\xE4songsm\xF6nster\u201D i integrationsinst\xE4llningar f\xF6r att se analysdata h\xE4r.",analysis_not_enough_data:"Inte tillr\xE4ckligt med data f\xF6r analys \xE4nnu.",analysis_not_enough_data_hint:"Weibull-analys kr\xE4ver minst 5 slutf\xF6rda underh\xE5ll; s\xE4songsm\xF6nster blir synliga efter 6+ datapunkter per m\xE5nad.",analysis_manual_task_hint:"Manuella uppgifter utan intervall genererar inte analysdata.",completions:"slutf\xF6randen",current:"Aktuell",shorter:"Kortare",longer:"L\xE4ngre",normal:"Normal",disabled:"Inaktiverad",compound_logic:"Sammansatt logik",card_title:"Titel",card_show_header:"Visa rubrik med statistik",card_show_actions:"Visa \xE5tg\xE4rdsknappar",card_compact:"Kompakt l\xE4ge",card_max_items:"Max objekt (0 = alla)",card_filter_status:"Filtrera efter status",card_filter_status_help:"Tomt = visa alla statusar.",card_filter_objects:"Filtrera efter objekt",card_filter_objects_help:"Tomt = visa alla objekt.",card_filter_entities:"Filtrera efter entiteter (entity_ids)",card_filter_entities_help:"V\xE4lj sensor- / binary_sensor-entiteter fr\xE5n denna integration. Tomt = alla.",card_loading_objects:"Laddar objekt\u2026",card_load_error:"Kunde inte ladda objekt \u2014 kontrollera WebSocket-anslutningen.",card_no_tasks_title:"Inga underh\xE5llsuppgifter \xE4n",card_no_tasks_cta:"\u2192 Skapa en i Maintenance-panelen",no_objects:"Inga objekt \xE4n.",action_error:"\xC5tg\xE4rden misslyckades. F\xF6rs\xF6k igen.",area_id_optional:"Omr\xE5de (valfritt)",installation_date_optional:"Installationsdatum (valfritt)",custom_icon_optional:"Ikon (valfritt, t.ex. mdi:wrench)",task_enabled:"Uppgift aktiverad",skip_reason_prompt:"Hoppa \xF6ver denna uppgift?",reason_optional:"Anledning (valfritt)",reset_date_prompt:"Markera uppgift som utf\xF6rd?",reset_date_optional:"Datum f\xF6r senaste utf\xF6rande (valfritt, standard idag)",notes_label:"Anteckningar",documentation_label:"Dokumentation",no_nfc_tag:"\u2014 Ingen tagg \u2014",dashboard:"\xD6versikt",settings:"Inst\xE4llningar",settings_features:"Avancerade funktioner",settings_features_desc:"Aktivera eller inaktivera avancerade funktioner. Inaktivering d\xF6ljer dem fr\xE5n UI men tar inte bort data.",feat_adaptive:"Adaptiv schemal\xE4ggning",feat_adaptive_desc:"L\xE4r dig optimala intervall fr\xE5n underh\xE5llshistorik",feat_predictions:"Sensorpredictions",feat_predictions_desc:"F\xF6ruts\xE4g utl\xF6sningsdatum fr\xE5n sensordegradering",feat_seasonal:"S\xE4songsjusteringar",feat_seasonal_desc:"Justera intervall baserat p\xE5 s\xE4songsm\xF6nster",feat_environmental:"Milj\xF6korrelation",feat_environmental_desc:"Korrelera intervall med temperatur/luftfuktighet",feat_budget:"Budgetuppf\xF6ljning",feat_budget_desc:"Sp\xE5ra m\xE5natliga och \xE5rliga underh\xE5llsutgifter",feat_groups:"Uppgiftsgrupper",feat_groups_desc:"Organisera uppgifter i logiska grupper",feat_checklists:"Checklistor",feat_checklists_desc:"Flerstegs procedurer f\xF6r uppgiftens slutf\xF6rande",settings_general:"Allm\xE4nt",settings_default_warning:"Standard varningsdagar",settings_panel_enabled:"Sidopanel",settings_notifications:"Notifikationer",settings_notify_service:"Notifikationstj\xE4nst",test_notification:"Testnotifikation",send_test:"Skicka test",testing:"Skickar\u2026",test_notification_success:"Testnotifikation skickad",test_notification_failed:"Testnotifikation misslyckades",settings_notify_due_soon:"Notifiera n\xE4r snart f\xF6rfallande",settings_notify_overdue:"Notifiera n\xE4r f\xF6rsenad",settings_notify_triggered:"Notifiera n\xE4r utl\xF6st",settings_interval_hours:"Upprepningsintervall (timmar, 0 = en g\xE5ng)",settings_quiet_hours:"Tysta timmar",settings_quiet_start:"Start",settings_quiet_end:"Slut",settings_max_per_day:"Max notifikationer per dag (0 = obegr\xE4nsat)",settings_bundling:"Bunta notifikationer",settings_bundle_threshold:"Buntningstr\xF6skel",settings_actions:"Mobila \xE5tg\xE4rdsknappar",settings_action_complete:"Visa 'Slutf\xF6r'-knapp",settings_action_skip:"Visa 'Hoppa \xF6ver'-knapp",settings_action_snooze:"Visa 'Snooza'-knapp",settings_snooze_hours:"Snooza-tid (timmar)",settings_budget:"Budget",settings_currency:"Valuta",settings_budget_monthly:"M\xE5natlig budget",settings_budget_yearly:"\xC5rlig budget",settings_budget_alerts:"Budgetvarningar",settings_budget_threshold:"Varningstr\xF6skel (%)",settings_import_export:"Import / Export",settings_export_json:"Exportera JSON",settings_export_csv:"Exportera CSV",settings_import_csv:"Importera CSV",settings_import_placeholder:"Klistra in JSON- eller CSV-inneh\xE5ll h\xE4r\u2026",settings_import_btn:"Importera",settings_import_success:"{count} objekt importerade.",settings_export_success:"Export nedladdad.",settings_saved:"Inst\xE4llning sparad.",settings_include_history:"Inkludera historik",sort_alphabetical:"Alfabetisk",sort_due_soonest:"N\xE4rmaste f\xF6rfallodatum",sort_task_count:"Antal uppgifter",sort_area:"Omr\xE5de",sort_assigned_user:"Tilldelad anv\xE4ndare",sort_group:"Grupp",groupby_none:"Ingen gruppering",groupby_area:"Per omr\xE5de",groupby_group:"Per grupp",groupby_user:"Per anv\xE4ndare",filter_label:"Filter",user_label:"Anv\xE4ndare",sort_label:"Sortering",group_by_label:"Gruppera efter",state_value_help:'Anv\xE4nd HA-tillst\xE5ndsv\xE4rdet (vanligtvis med sm\xE5 bokst\xE4ver, t.ex. "on"/"off"). Versaler normaliseras vid sparande.',target_changes_help:"Antal matchande \xF6verg\xE5ngar innan utl\xF6saren aktiveras (standard: 1).",qr_print_title:"Skriv ut QR-koder",qr_print_desc:"Skapa en utskriftssida med QR-koder att klippa ut och s\xE4tta p\xE5 din utrustning.",qr_print_load:"Ladda objekt",qr_print_filter:"Filter",qr_print_objects:"Objekt",qr_print_actions:"\xC5tg\xE4rder",qr_print_url_mode:"L\xE4nktyp",qr_print_estimate:"Uppskattade QR-koder",qr_print_over_limit:"gr\xE4ns 200, begr\xE4nsa filtret",qr_print_generate:"Skapa QR-koder",qr_print_generating:"Skapar\u2026",qr_print_ready:"QR-koder klara",qr_print_print_button:"Skriv ut",qr_print_empty:"Inget att skapa",qr_action_skip:"Hoppa \xF6ver",unassigned:"Otilldelad",no_area:"Inget omr\xE5de",has_overdue:"Har f\xF6rsenade uppgifter",object:"Objekt",settings_panel_access:"Paneltillg\xE5ng",settings_panel_access_desc:"Administrat\xF6rer ser alltid hela panelen. V\xE4lj icke-admin-anv\xE4ndare nedan som ocks\xE5 ska f\xE5 full paneltillg\xE5ng \u2014 alla andra icke-admins ser endast Slutf\xF6r och Hoppa \xF6ver.",no_non_admin_users:"Inga icke-admin-anv\xE4ndare hittades. L\xE4gg till n\xE5gra i Inst\xE4llningar \u2192 Personer.",owner_label:"\xC4gare"},pt={de:na,en:sa,nl:ra,fr:oa,it:la,es:da,pt:ca,ru:ua,uk:_a,pl:pa,cs:ga,sv:ha};function i(o,n){let e=(n||"en").substring(0,2).toLowerCase();return pt[e]?.[o]??pt.en[o]??o}function ht(o){let n=(o||"en").substring(0,2).toLowerCase();return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA"}[n]??"en-US"}function ae(o,n){if(!o)return"\u2014";try{let e=o.includes("T")?o:o+"T00:00:00";return new Date(e).toLocaleDateString(ht(n),{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return o}}function Ve(o,n){if(!o)return"\u2014";try{let e=ht(n),t=new Date(o);return t.toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}catch{return o}}function je(o,n){if(o==null)return"\u2014";let e=n||"en";return o<0?`${Math.abs(o)} ${i("d_overdue",e)}`:o===0?i("today",e):`${o} ${i(o===1?"day":"days",e)}`}function oe(o,n){o.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:n},bubbles:!0,composed:!0}))}var mt=N`
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
`;var vt=N`
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

  .header ha-menu-button {
    margin-right: 4px;
    color: var(--app-header-text-color, white);
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
    align-items: flex-end;
    padding: 8px 0;
    gap: 8px;
  }

  .filter-field {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .filter-label {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
    padding-left: 2px;
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
    /* Desktop: 7-column grid keeps every column aligned across rows regardless
       of which optional chips/badges this particular row carries. */
    display: grid;
    grid-template-columns:
      auto                         /* badges */
      minmax(100px, 180px)         /* object-name */
      minmax(120px, 1fr)           /* task-name */
      minmax(0, 220px)             /* task-sub (chips) */
      100px                        /* type */
      150px                        /* due-cell */
      auto;                        /* row-actions */
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

  /* Wrapper for status + optional disabled/NFC badges so they share one grid column */
  .cell-badges {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cell { font-size: 14px; }
  .cell.object-name { color: var(--primary-color); cursor: pointer; }
  .cell.task-name { font-weight: 500; }
  .cell.type { color: var(--secondary-text-color); }

  /* Task subline chips (group / area / assigned user) — desktop shows inline, mobile wraps below */
  .task-sub {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 12px;
    color: var(--secondary-text-color);
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  /* Empty subline still occupies its grid slot so neighbouring columns line up */
  .task-sub-empty { min-height: 1px; }
  .sub-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    padding: 2px 8px;
    border-radius: 10px;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
    line-height: 1.4;
  }
  .sub-chip ha-icon {
    --mdc-icon-size: 14px;
    opacity: 0.75;
  }

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

  /* Checklist preview card (read-only display in task overview) */
  .checklist-preview-card {
    background: var(--card-background-color, #fff);
    border-radius: 8px;
    padding: 12px 16px;
    border: 1px solid var(--divider-color);
    margin-top: 8px;
  }
  .checklist-preview-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
  }
  .checklist-preview-header ha-icon {
    --mdc-icon-size: 18px;
  }
  .checklist-preview-list {
    margin: 0;
    padding-left: 20px;
    color: var(--primary-text-color);
    font-size: 14px;
    line-height: 1.6;
  }
  .checklist-preview-list li {
    padding: 1px 0;
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

  :host([narrow]) .filter-field {
    flex: 1;
    min-width: 48%;
  }

  :host([narrow]) .filter-bar select {
    flex: 1;
    min-width: 0;
    width: 100%;
  }

  :host([narrow]) .task-row {
    /* Mobile: 4-column grid keeps due-cell + actions at deterministic
       X-positions across rows regardless of content (sparkline, bar, %).
       Earlier flex-wrap-based layouts let the row wrap unpredictably so
       "X days" sometimes sat near the middle, sometimes at the right edge.
       Grid template:
         [badges auto | task-name 1fr | due-cell 100px | actions auto]
       Task-name spans the full top row (own row above), chips span the
       full bottom row.  */
    display: grid;
    grid-template-columns: auto minmax(80px, 1fr) 100px auto;
    grid-template-rows: auto auto auto;
    column-gap: 8px;
    row-gap: 4px;
    padding: 12px;
  }

  :host([narrow]) .cell.type { display: none; }
  :host([narrow]) .cell.task-name {
    grid-column: 1 / -1;
    grid-row: 1;
    min-width: 0;
  }
  :host([narrow]) .cell-badges {
    grid-column: 1;
    grid-row: 2;
  }
  :host([narrow]) .cell.object-name {
    grid-column: 2;
    grid-row: 2;
    min-width: 0;
    /* Cap long object names at 2 lines with ellipsis instead of growing
       unbounded vertically. The full name is still readable via the panel
       object-detail view (one tap on the object). */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.2;
  }
  :host([narrow]) .due-cell {
    grid-column: 3;
    grid-row: 2;
    align-items: flex-end;
    min-width: 0;
  }
  :host([narrow]) .row-actions {
    grid-column: 4;
    grid-row: 2;
  }
  :host([narrow]) .task-sub {
    grid-column: 1 / -1;
    grid-row: 3;
    font-size: 11px;
    gap: 6px;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  :host([narrow]) .task-sub-empty { display: none; }
  :host([narrow]) .mini-sparkline { width: 50px; }

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
    /* Mirror the :host([narrow]) grid layout for narrow desktop windows */
    .task-row {
      display: grid;
      grid-template-columns: auto minmax(80px, 1fr) 100px auto;
      grid-template-rows: auto auto auto;
      column-gap: 8px;
      row-gap: 4px;
      padding: 12px;
    }
    .cell.type { display: none; }
    .cell.task-name { grid-column: 1 / -1; grid-row: 1; min-width: 0; }
    .cell-badges { grid-column: 1; grid-row: 2; }
    .cell.object-name { grid-column: 2; grid-row: 2; min-width: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.2; }
    .due-cell { grid-column: 3; grid-row: 2; align-items: flex-end; min-width: 0; }
    .row-actions { grid-column: 4; grid-row: 2; }
    .task-sub { grid-column: 1 / -1; grid-row: 3; font-size: 11px; gap: 6px; justify-content: flex-start; flex-wrap: wrap; }
    .task-sub-empty { display: none; }
    .mini-sparkline { width: 50px; }
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
`;var Se=class{constructor(n){this._cache=new Map;this._pending=new Map;this._hass=n}updateHass(n){this._hass=n}async getDetailStats(n,e){return this._getStats(n,"hour",30,e)}async getMiniStats(n,e){return this._getStats(n,"day",14,e)}async getBatchMiniStats(n){let e=new Map,t=[];for(let _ of n){let p=`${_.entityId}:day`,m=this._cache.get(p);m&&Date.now()-m.fetchedAt<3e5?e.set(_.entityId,m.points):t.push(_)}if(t.length===0)return e;let a=t.filter(_=>_.isCounter).map(_=>_.entityId),s=t.filter(_=>!_.isCounter).map(_=>_.entityId),r=new Date(Date.now()-336*60*60*1e3).toISOString(),d=[];return a.length>0&&d.push(this._fetchBatch(a,"day",r,["state","sum","change"],!0,e)),s.length>0&&d.push(this._fetchBatch(s,"day",r,["mean","min","max"],!1,e)),await Promise.all(d),e}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(n,e,t,a){let s=`${n}:${e}`,r=this._cache.get(s);if(r&&Date.now()-r.fetchedAt<3e5)return r.points;if(this._pending.has(s))return this._pending.get(s);let d=this._fetchAndNormalize(n,e,t,a,s);this._pending.set(s,d);try{return await d}finally{this._pending.delete(s)}}async _fetchAndNormalize(n,e,t,a,s){let r=new Date(Date.now()-t*24*60*60*1e3).toISOString(),d=a?["state","sum","change"]:["mean","min","max"];try{let p=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:r,statistic_ids:[n],period:e,types:d}))[n]||[],m=this._normalizeRows(p,a);return this._cache.set(s,{entityId:n,fetchedAt:Date.now(),period:e,points:m}),m}catch(_){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${n}:`,_),[]}}async _fetchBatch(n,e,t,a,s,r){try{let d=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:t,statistic_ids:n,period:e,types:a});for(let _ of n){let p=d[_]||[],m=this._normalizeRows(p,s);r.set(_,m),this._cache.set(`${_}:${e}`,{entityId:_,fetchedAt:Date.now(),period:e,points:m})}}catch(d){console.warn("[maintenance-supporter] Batch statistics fetch failed:",d)}}_normalizeRows(n,e){let t=[];for(let a of n){let s=null;if(e?s=a.state??null:s=a.mean??null,s===null)continue;let r={ts:a.start,val:s};e||(a.min!=null&&(r.min=a.min),a.max!=null&&(r.max=a.max)),t.push(r)}return t.sort((a,s)=>a.ts-s.ts),t}};var ie=class{constructor(n){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=n}updateHass(n){this.hass=n}async getUsers(n=!1){let e=Date.now();if(!n&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(n,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:n,task_id:e,user_id:t})}async getTasksByUser(n){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:n})).tasks}getUserName(n){return!n||!this.usersCache?null:this.usersCache.find(t=>t.id===n)?.name||null}getUser(n){return!n||!this.usersCache?null:this.usersCache.find(e=>e.id===n)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(n){return n?n===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};var ma={name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",group_name:"name",group_description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_for_minutes:"trigger_for_minutes"};function va(o,n){let e=ma[o];if(!e)return o;let t=i(e,n);return t&&t!==e?t:o}function fa(o){let e=o.match(/data\['([^']+)'\]/)?.[1],t;return(t=o.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=o.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=o.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=o.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(o)?{field:e,rule:"required"}:(t=o.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(o)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(o)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function G(o,n,e){if(typeof o=="string")return o;if(typeof o!="object"||o===null)return e;let t=o,a=t.message||t.error?.message||"";if(!a)return e;let s=fa(a),r=s.field?va(s.field,n):"",d=_=>i(_,n).replace("{field}",r).replace("{n}",s.param??"");switch(s.rule){case"too_long":return d("err_too_long");case"too_short":return d("err_too_short");case"value_too_high":return d("err_value_too_high");case"value_too_low":return d("err_value_too_low");case"required":return d("err_required");case"wrong_type":return d("err_wrong_type").replace("{type}",s.param??"");case"invalid_choice":return d("err_invalid_choice");case"invalid_value":return d("err_invalid_value");default:return a||e}}var O=class extends A{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._entryId=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._error="",this._open=!0}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(e){this._error=G(e,this._lang,i("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}render(){if(!this._open)return l``;let e=this._lang,t=this._entryId?i("edit_object",e):i("new_object",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:c}
          <ha-textfield
            label="${i("name",e)}"
            required
            .value=${this._name}
            @input=${a=>this._name=a.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${i("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${a=>this._manufacturer=a.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${i("model_optional",e)}"
            .value=${this._model}
            @input=${a=>this._model=a.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${i("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${a=>this._serialNumber=a.target.value}
          ></ha-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${i("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${a=>this._areaId=a.detail.value||""}
          ></ha-area-picker>
          <ha-textfield
            label="${i("installation_date_optional",e)}"
            type="date"
            .value=${this._installationDate}
            @input=${a=>this._installationDate=a.target.value}
          ></ha-textfield>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${i("cancel",this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?i("saving",this._lang):i("save",this._lang)}
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
  `,u([$({attribute:!1})],O.prototype,"hass",2),u([g()],O.prototype,"_open",2),u([g()],O.prototype,"_loading",2),u([g()],O.prototype,"_error",2),u([g()],O.prototype,"_name",2),u([g()],O.prototype,"_manufacturer",2),u([g()],O.prototype,"_model",2),u([g()],O.prototype,"_serialNumber",2),u([g()],O.prototype,"_areaId",2),u([g()],O.prototype,"_installationDate",2),u([g()],O.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",O);var ba=["cleaning","inspection","replacement","calibration","service","custom"],ya=["time_based","sensor_based","manual"],ka=["threshold","counter","state_change","runtime"],k=class extends A{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.defaultWarningDays=7;this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._warningDays="7";this._intervalAnchor="completion";this._notes="";this._documentationUrl="";this._customIcon="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._availableTags=[];this._responsibleUserId=null;this._availableUsers=[];this._checklistText="";this._scheduleTime="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._userService=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}async openCreate(e,t){this._entryId=e,this._taskId=null,this._error="",!e&&t&&t.length>0?(this._objectChoices=t.map(a=>({entry_id:a.entry_id,name:a.object.name})).sort((a,s)=>a.name.localeCompare(s.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}async openEdit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days?.toString()||"30",this._warningDays=t.warning_days.toString(),this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._nfcTagId=t.nfc_tag_id||"",this._responsibleUserId=t.responsible_user_id||null,this._checklistText=(t.checklist||[]).join(`
`),this._scheduleTime=t.schedule_time||"";let a=t.adaptive_config||{};if(this._environmentalEntity=a.environmental_entity||"",this._environmentalAttribute=a.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,t.trigger_config){let s=t.trigger_config;this._triggerEntityId=s.entity_id||"",this._triggerEntityIds=s.entity_ids||(s.entity_id?[s.entity_id]:[]),this._triggerEntityLogic=s.entity_logic||"any",this._triggerAttribute=s.attribute||"",this._triggerType=s.type||"threshold",this._triggerAbove=s.trigger_above?.toString()||"",this._triggerBelow=s.trigger_below?.toString()||"",this._triggerForMinutes=s.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=s.trigger_target_value?.toString()||"",this._triggerDeltaMode=s.trigger_delta_mode||!1,this._triggerFromState=s.trigger_from_state||"",this._triggerToState=s.trigger_to_state||"",this._triggerTargetChanges=s.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=s.trigger_runtime_hours?.toString()||""}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._warningDays=String(this.defaultWarningDays),this._intervalAnchor="completion",this._notes="",this._documentationUrl="",this._customIcon="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._responsibleUserId=null,this._checklistText="",this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours=""}async _loadUsers(){this._userService||(this._userService=new ie(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=t.domain||"",this._suggestedAttributes=t.suggested_attributes||[],this._availableAttributes=t.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:parseInt(this._warningDays,10)||7};if(this._taskId&&(e.task_id=this._taskId),this._scheduleType!=="manual"?this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_anchor=this._intervalAnchor):this._taskId&&(e.interval_days=null,e.interval_anchor="completion"):this._taskId&&(e.interval_days=null,e.interval_anchor="completion"),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.enabled=this._enabled,e.last_performed=this._lastPerformed||null,e.nfc_tag_id=this._nfcTagId||null,e.responsible_user_id=this._responsibleUserId,this._scheduleType==="sensor_based"&&this._triggerEntityId){let r=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],d={entity_id:r[0],entity_ids:r,type:this._triggerType};if(this._triggerAttribute&&(d.attribute=this._triggerAttribute),r.length>1&&(d.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let _=parseFloat(this._triggerAbove);isNaN(_)||(d.trigger_above=_)}if(this._triggerBelow){let _=parseFloat(this._triggerBelow);isNaN(_)||(d.trigger_below=_)}if(this._triggerForMinutes){let _=parseInt(this._triggerForMinutes,10);isNaN(_)||(d.trigger_for_minutes=_)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let _=parseFloat(this._triggerTargetValue);isNaN(_)||(d.trigger_target_value=_)}d.trigger_delta_mode=this._triggerDeltaMode}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(d.trigger_from_state=this._triggerFromState),this._triggerToState&&(d.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let _=parseInt(this._triggerTargetChanges,10);isNaN(_)||(d.trigger_target_changes=_)}}else if(this._triggerType==="runtime"&&this._triggerRuntimeHours){let _=parseFloat(this._triggerRuntimeHours);isNaN(_)||(d.trigger_runtime_hours=_)}e.trigger_config=d}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let r=this._scheduleTime.trim();e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(r)?r:null}if(this.checklistsEnabled){let r=this._checklistText.split(`
`).map(d=>d.trim()).filter(Boolean).slice(0,100);e.checklist=r.length?r:null}let t=await this.hass.connection.sendMessagePromise(e),a=this._taskId||t?.task_id,s=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(a&&this._scheduleType==="sensor_based"&&s)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:a,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(e){this._error=G(e,this._lang,i("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return c;let e=this._lang;return l`
      <h3>${i("trigger_configuration",e)}</h3>
      <ha-textfield
        label="${i("entity_id",e)} (${i("comma_separated",e)})"
        .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
        @input=${t=>{let s=t.target.value.split(",").map(r=>r.trim()).filter(Boolean);this._triggerEntityId=s[0]||"",this._triggerEntityIds=s,s[0]&&this._fetchEntityAttributes(s[0])}}
      ></ha-textfield>
      ${this._triggerEntityIds.length>1?l`
        <div class="select-row">
          <label>${i("entity_logic",e)}</label>
          <select
            .value=${this._triggerEntityLogic}
            @change=${t=>this._triggerEntityLogic=t.target.value}
          >
            <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${i("entity_logic_any",e)}</option>
            <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${i("entity_logic_all",e)}</option>
          </select>
        </div>
      `:c}
      ${this._availableAttributes.length>0?l`
          <div class="select-row">
            <label>${i("attribute_optional",e)}</label>
            <select
              .value=${this._triggerAttribute}
              @change=${t=>this._triggerAttribute=t.target.value}
            >
              <option value="" ?selected=${!this._triggerAttribute}>${i("use_entity_state",e)}</option>
              ${this._suggestedAttributes.map(t=>l`<option value=${t} ?selected=${t===this._triggerAttribute}>${t} ★</option>`)}
              ${this._availableAttributes.filter(t=>!this._suggestedAttributes.includes(t.name)).map(t=>l`<option value=${t.name} ?selected=${t.name===this._triggerAttribute}>${t.name}${t.numeric?"":" (non-numeric)"}</option>`)}
            </select>
          </div>
        `:l`
          <ha-textfield
            label="${i("attribute_optional",e)}"
            .value=${this._triggerAttribute}
            @input=${t=>this._triggerAttribute=t.target.value}
          ></ha-textfield>
        `}
      <div class="select-row">
        <label>${i("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${t=>this._triggerType=t.target.value}
        >
          ${ka.map(t=>l`<option value=${t} ?selected=${t===this._triggerType}>${i(t,e)}</option>`)}
        </select>
      </div>
      ${this._renderTriggerTypeFields()}
      <ha-textfield
        label="${i("safety_interval_days",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${t=>this._intervalDays=t.target.value}
      ></ha-textfield>
    `}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?l`
        <ha-textfield
          label="${i("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${t=>this._triggerAbove=t.target.value}
        ></ha-textfield>
        <ha-textfield
          label="${i("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${t=>this._triggerBelow=t.target.value}
        ></ha-textfield>
        <ha-textfield
          label="${i("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ha-textfield>
      `:this._triggerType==="counter"?l`
        <ha-textfield
          label="${i("target_value",e)}"
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
          ${i("delta_mode",e)}
        </label>
      `:this._triggerType==="state_change"?l`
        <ha-textfield
          label="${i("from_state_optional",e)}"
          .value=${this._triggerFromState}
          @input=${t=>this._triggerFromState=t.target.value}
        ></ha-textfield>
        <div class="field-help">${i("state_value_help",e)}</div>
        <ha-textfield
          label="${i("to_state_optional",e)}"
          .value=${this._triggerToState}
          @input=${t=>this._triggerToState=t.target.value}
        ></ha-textfield>
        <ha-textfield
          label="${i("target_changes",e)}"
          type="number"
          min="1"
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ha-textfield>
        <div class="field-help">${i("target_changes_help",e)}</div>
      `:this._triggerType==="runtime"?l`
        <ha-textfield
          label="${i("runtime_hours",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${t=>this._triggerRuntimeHours=t.target.value}
        ></ha-textfield>
      `:c}render(){if(!this._open)return l``;let e=this._lang,t=this._taskId?i("edit_task",e):i("new_task",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:c}
          ${this._objectChoices.length>0?l`
            <div class="select-row">
              <label>${i("object",e)}</label>
              <select
                .value=${this._entryId}
                @change=${a=>this._entryId=a.target.value}
              >
                ${this._objectChoices.map(a=>l`<option value=${a.entry_id} ?selected=${a.entry_id===this._entryId}>${a.name}</option>`)}
              </select>
            </div>
          `:c}
          <ha-textfield
            label="${i("task_name",e)}"
            required
            .value=${this._name}
            @input=${a=>this._name=a.target.value}
          ></ha-textfield>
          <div class="select-row">
            <label>${i("maintenance_type",e)}</label>
            <select
              .value=${this._type}
              @change=${a=>this._type=a.target.value}
            >
              ${ba.map(a=>l`<option value=${a} ?selected=${a===this._type}>${i(a,e)}</option>`)}
            </select>
          </div>
          <div class="select-row">
            <label>${i("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${a=>this._scheduleType=a.target.value}
            >
              ${ya.map(a=>l`<option value=${a} ?selected=${a===this._scheduleType}>${i(a,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?l`
                <ha-textfield
                  label="${i("interval_days",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${a=>this._intervalDays=a.target.value}
                ></ha-textfield>
                <div class="select-row">
                  <label>${i("interval_anchor",e)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${a=>this._intervalAnchor=a.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${i("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${i("anchor_planned",e)}</option>
                  </select>
                </div>
                ${this.scheduleTimeEnabled?l`
                  <ha-textfield
                    label="${i("schedule_time_optional",e)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${i("schedule_time_help",e)}"
                    @input=${a=>this._scheduleTime=a.target.value}
                  ></ha-textfield>
                `:c}
              `:c}
          <ha-textfield
            label="${i("warning_days",e)}"
            type="number"
            .value=${this._warningDays}
            @input=${a=>this._warningDays=a.target.value}
          ></ha-textfield>
          ${this.checklistsEnabled?l`
            <h3>${i("checklist_steps_optional",e)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${i("checklist_placeholder",e)}"
              .value=${this._checklistText}
              @input=${a=>this._checklistText=a.target.value}
            ></textarea>
            <div class="field-help">${i("checklist_help",e)}</div>
          `:c}
          <ha-textfield
            label="${i("last_performed_optional",e)}"
            type="date"
            .value=${this._lastPerformed}
            @input=${a=>this._lastPerformed=a.target.value}
          ></ha-textfield>
          <div class="select-row">
            <label>${i("responsible_user",e)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${a=>{let s=a.target.value;this._responsibleUserId=s||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${i("no_user_assigned",e)}</option>
              ${this._availableUsers.map(a=>l`<option value=${a.id} ?selected=${a.id===this._responsibleUserId}>${a.name}</option>`)}
            </select>
          </div>
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?l`
            <ha-textfield
              label="${i("environmental_entity_optional",e)}"
              helper="${i("environmental_entity_helper",e)}"
              .value=${this._environmentalEntity}
              @input=${a=>this._environmentalEntity=a.target.value.trim()}
            ></ha-textfield>
            ${this._environmentalEntity?l`
              <ha-textfield
                label="${i("environmental_attribute_optional",e)}"
                .value=${this._environmentalAttribute}
                @input=${a=>this._environmentalAttribute=a.target.value.trim()}
              ></ha-textfield>
            `:c}
          `:c}
          <ha-textfield
            label="${i("notes_optional",e)}"
            .value=${this._notes}
            @input=${a=>this._notes=a.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${i("documentation_url_optional",e)}"
            .value=${this._documentationUrl}
            @input=${a=>this._documentationUrl=a.target.value}
          ></ha-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${i("custom_icon_optional",e)}"
            .value=${this._customIcon}
            @value-changed=${a=>this._customIcon=a.detail.value||""}
          ></ha-icon-picker>
          ${this._availableTags.length>0?l`
              <div class="select-row">
                <label>${i("nfc_tag_id_optional",e)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${a=>this._nfcTagId=a.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${i("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(a=>l`<option value=${a.id} ?selected=${a.id===this._nfcTagId}>${a.name}</option>`)}
                </select>
              </div>
            `:l`
              <ha-textfield
                label="${i("nfc_tag_id_optional",e)}"
                .value=${this._nfcTagId}
                @input=${a=>this._nfcTagId=a.target.value}
              ></ha-textfield>
            `}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${a=>this._enabled=a.target.checked}
            />
            ${i("task_enabled",e)}
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${i("cancel",e)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?i("saving",e):i("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};k.styles=N`
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
    @media (max-width: 600px) {
      .content {
        min-width: 0;
        max-height: none;
      }
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
    .field-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .checklist-textarea {
      width: 100%;
      min-height: 88px;
      padding: 8px;
      font-family: inherit;
      font-size: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      resize: vertical;
      box-sizing: border-box;
    }
    .field-help {
      font-size: 12px;
      color: var(--secondary-text-color);
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
  `,u([$({attribute:!1})],k.prototype,"hass",2),u([$({type:Boolean,attribute:"checklists-enabled"})],k.prototype,"checklistsEnabled",2),u([$({type:Boolean,attribute:"schedule-time-enabled"})],k.prototype,"scheduleTimeEnabled",2),u([$({type:Number,attribute:"default-warning-days"})],k.prototype,"defaultWarningDays",2),u([g()],k.prototype,"_open",2),u([g()],k.prototype,"_loading",2),u([g()],k.prototype,"_error",2),u([g()],k.prototype,"_entryId",2),u([g()],k.prototype,"_taskId",2),u([g()],k.prototype,"_objectChoices",2),u([g()],k.prototype,"_name",2),u([g()],k.prototype,"_type",2),u([g()],k.prototype,"_scheduleType",2),u([g()],k.prototype,"_intervalDays",2),u([g()],k.prototype,"_warningDays",2),u([g()],k.prototype,"_intervalAnchor",2),u([g()],k.prototype,"_notes",2),u([g()],k.prototype,"_documentationUrl",2),u([g()],k.prototype,"_customIcon",2),u([g()],k.prototype,"_enabled",2),u([g()],k.prototype,"_triggerEntityId",2),u([g()],k.prototype,"_triggerEntityIds",2),u([g()],k.prototype,"_triggerEntityLogic",2),u([g()],k.prototype,"_triggerAttribute",2),u([g()],k.prototype,"_triggerType",2),u([g()],k.prototype,"_triggerAbove",2),u([g()],k.prototype,"_triggerBelow",2),u([g()],k.prototype,"_triggerForMinutes",2),u([g()],k.prototype,"_triggerTargetValue",2),u([g()],k.prototype,"_triggerDeltaMode",2),u([g()],k.prototype,"_triggerFromState",2),u([g()],k.prototype,"_triggerToState",2),u([g()],k.prototype,"_triggerTargetChanges",2),u([g()],k.prototype,"_triggerRuntimeHours",2),u([g()],k.prototype,"_suggestedAttributes",2),u([g()],k.prototype,"_availableAttributes",2),u([g()],k.prototype,"_entityDomain",2),u([g()],k.prototype,"_lastPerformed",2),u([g()],k.prototype,"_nfcTagId",2),u([g()],k.prototype,"_availableTags",2),u([g()],k.prototype,"_responsibleUserId",2),u([g()],k.prototype,"_availableUsers",2),u([g()],k.prototype,"_checklistText",2),u([g()],k.prototype,"_scheduleTime",2),u([g()],k.prototype,"_environmentalEntity",2),u([g()],k.prototype,"_environmentalAttribute",2);customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",k);var P=class extends A{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed"}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState={},this._feedback="needed")}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),await this.hass.connection.sendMessagePromise(e),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=G(e,this.lang,i("save_error",this.lang))}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return l``;let e=this.lang||this.hass?.language||"en";return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i("complete_title",e)}${this.taskName}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:c}
          ${this.checklist.length>0?l`
            <div class="checklist-section">
              <label class="checklist-label">${i("checklist",e)}</label>
              ${this.checklist.map((t,a)=>l`
                <label class="checklist-item" @click=${()=>this._toggleCheck(a)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(a)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:c}
          <ha-textfield
            label="${i("notes_optional",e)}"
            .value=${this._notes}
            @input=${t=>this._notes=t.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${i("cost_optional",e)}"
            type="number"
            step="0.01"
            .value=${this._cost}
            @input=${t=>this._cost=t.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${i("duration_minutes",e)}"
            type="number"
            .value=${this._duration}
            @input=${t=>this._duration=t.target.value}
          ></ha-textfield>
          ${this.adaptiveEnabled?l`
            <div class="feedback-section">
              <label class="feedback-label">${i("was_maintenance_needed",e)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${i("feedback_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${i("feedback_not_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${i("feedback_not_sure",e)}</button>
              </div>
            </div>
          `:c}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${i("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading}
          >
            ${this._loading?i("completing",e):i("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};P.styles=N`
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
  `,u([$({attribute:!1})],P.prototype,"hass",2),u([$()],P.prototype,"entryId",2),u([$()],P.prototype,"taskId",2),u([$()],P.prototype,"taskName",2),u([$()],P.prototype,"lang",2),u([$({type:Array})],P.prototype,"checklist",2),u([$({type:Boolean})],P.prototype,"adaptiveEnabled",2),u([g()],P.prototype,"_open",2),u([g()],P.prototype,"_notes",2),u([g()],P.prototype,"_cost",2),u([g()],P.prototype,"_duration",2),u([g()],P.prototype,"_loading",2),u([g()],P.prototype,"_error",2),u([g()],P.prototype,"_checklistState",2),u([g()],P.prototype,"_feedback",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",P);function ce(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ft(o){return!o.startsWith("data:image/svg+xml,")&&!o.startsWith("data:image/png;base64,")?"":ce(o)}function xa(o){return o.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var W=class extends A{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(e,t,a,s){this._entryId=e,this._taskId=t,this._objectName=a,this._taskName=s,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let a=[this.hass.connection.sendMessagePromise({...t,action:"view"})];this._taskId&&a.push(this.hass.connection.sendMessagePromise({...t,action:"complete"}));let s=await Promise.all(a);if(e!==this._generateSeq)return;this._viewResult=s[0],s.length>1&&(this._completeResult=s[1])}catch(t){if(e!==this._generateSeq)return;let a=t?.code,s=t?.message;this._error=a==="no_url"||typeof s=="string"&&s.includes("No Home Assistant URL")?i("qr_error_no_url",this.lang):i("qr_error",this.lang)}finally{e===this._generateSeq&&(this._loading=!1)}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,a=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),s=window.open("","_blank","width=600,height=500");if(!s)return;let r=this.lang||"en",d=ce(t),_=ce(a),p=!!this._completeResult,m=ce(i("qr_action_view",r)),h=ce(i("qr_action_complete",r));s.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${d}</title>
<style>
  body{font-family:sans-serif;text-align:center;padding:20px}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  .qr-row{display:flex;justify-content:center;gap:24px;margin:12px 0}
  .qr-col{display:flex;flex-direction:column;align-items:center;gap:6px}
  .qr-col img{width:${p?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${d}</h2>
${_?`<div class="sub">${_}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${ft(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${m}</div>
  </div>
  ${p?`<div class="qr-col">
    <img src="${ft(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${h}</div>
  </div>`:""}
</div>
<div class="url">${ce(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),s.document.close()}_downloadSvg(e,t){let a=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),s=new Blob([a],{type:"image/svg+xml"}),r=URL.createObjectURL(s),d=document.createElement("a");d.href=r;let _=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;d.download=`qr-${xa(_)}-${t}.svg`,d.click(),URL.revokeObjectURL(r)}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return l``;let e=this.lang||this.hass?.language||"en",t=this._taskName?`${i("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${i("qr_code",e)}: ${this._objectName}`,a=!!this._viewResult;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._loading?l`<div class="loading">${i("qr_generating",e)}</div>`:this._error?l`<div class="error">${this._error}</div>`:a?l`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${i("qr_action_view",e)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${i("qr_download",e)}
                        </button>
                      </div>
                      ${this._completeResult?l`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${i("qr_action_complete",e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${i("qr_download",e)}
                              </button>
                            </div>
                          `:c}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:c}
          <div class="action-row">
            <label>${i("qr_url_mode",e)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${i("qr_mode_companion",e)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${i("qr_mode_local",e)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${i("qr_mode_server",e)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${i("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!a}
          >
            ${i("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};W.styles=N`
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
  `,u([$({attribute:!1})],W.prototype,"hass",2),u([$()],W.prototype,"lang",2),u([g()],W.prototype,"_open",2),u([g()],W.prototype,"_loading",2),u([g()],W.prototype,"_error",2),u([g()],W.prototype,"_viewResult",2),u([g()],W.prototype,"_completeResult",2),u([g()],W.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",W);var B=class extends A{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel="",this._inputType="",this._inputValue="",this._open=!0,new Promise(t=>{this._resolve=t,this._promptResolve=null})}prompt(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"text",this._inputValue=e.inputValue||"",this._open=!0,new Promise(t=>{this._promptResolve=t,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return c;let e=this.hass?.language||"en";return l`
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
            ${i("cancel",e)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};B.styles=N`
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
  `,u([$({attribute:!1})],B.prototype,"hass",2),u([g()],B.prototype,"_open",2),u([g()],B.prototype,"_title",2),u([g()],B.prototype,"_message",2),u([g()],B.prototype,"_confirmText",2),u([g()],B.prototype,"_danger",2),u([g()],B.prototype,"_inputLabel",2),u([g()],B.prototype,"_inputType",2),u([g()],B.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",B);var bt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},yt=o=>(...n)=>({_$litDirective$:o,values:n}),Ae=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var be=class extends Ae{constructor(n){if(super(n),this.it=c,n.type!==bt.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(n){if(n===c||n==null)return this._t=void 0,this.it=n;if(n===Y)return n;if(typeof n!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(n===this.it)return this._t;this.it=n;let e=[n];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};be.directiveName="unsafeHTML",be.resultType=1;var kt=yt(be);var wa=["EUR","USD","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL"],q=class extends A{constructor(){super(...arguments);this.budget=null;this._settings=null;this._loading=!0;this._importCsv="";this._importLoading=!1;this._includeHistory=!0;this._toast="";this._testingNotification=!1;this._users=[];this._qrObjects=[];this._qrSelectedEntries=new Set;this._qrActions=new Set(["view"]);this._qrUrlMode="companion";this._qrBatchLoading=!1;this._qrBatchResults=[];this._qrObjectsLoaded=!1;this._loaded=!1;this._userService=null;this._sendTestNotification=async()=>{this._testingNotification=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/test_notification"}),t=e.message||(e.success?i("test_notification_success",this._lang):i("test_notification_failed",this._lang));this._showToast(t)}catch{this._showToast(i("test_notification_failed",this._lang))}finally{this._testingNotification=!1}}}get _lang(){return this.hass?.language||"en"}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._loaded?(this._loaded=!0,this._userService=new ie(this.hass),this._loadSettings(),this._loadUsers()):e.has("hass")&&this.hass&&this._userService&&this._userService.updateHass(this.hass)}async _loadUsers(){if(this._userService)try{this._users=await this._userService.getUsers()}catch{this._users=[]}}async _loadSettings(){this._loading=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});this._settings=e}catch{}this._loading=!1}async _updateSetting(e,t){try{let a=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/update",settings:{[e]:t}});this._settings=a,this._showToast(i("settings_saved",this._lang)),this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(i("action_error",this._lang))}}_showToast(e){this._toast=e,setTimeout(()=>{this._toast=""},3e3)}_downloadFile(e,t,a){let s=new Blob([e],{type:a}),r=URL.createObjectURL(s),d=document.createElement("a");d.href=r,d.download=t,d.click(),URL.revokeObjectURL(r)}render(){let e=this._lang;return this._loading||!this._settings?l`<div class="settings-loading">Loading…</div>`:l`
      ${this._renderFeatures(e)}
      ${this._renderPanelAccess(e)}
      ${this._renderGeneral(e)}
      ${this._settings.general.notifications_enabled?this._renderNotifications(e):c}
      ${this.features.budget?this._renderBudget(e):c}
      ${this._renderPrintQr(e)}
      ${this._renderImportExport(e)}
      ${this._toast?l`<div class="settings-toast">${this._toast}</div>`:c}
    `}_renderPanelAccess(e){let t=new Set(this._settings.admin_panel_user_ids||[]),a=this._users.filter(r=>!r.is_admin),s=(r,d)=>{let _=new Set(t);d?_.add(r):_.delete(r),this._updateSetting("admin_panel_user_ids",[..._])};return l`
      <div class="settings-section">
        <h3>${i("settings_panel_access",e)} ${t.size>0?l`<span class="section-badge">${t.size}</span>`:c}</h3>
        <p class="section-desc">${i("settings_panel_access_desc",e)}</p>
        ${a.length===0?l`<div class="setting-row hint">${i("no_non_admin_users",e)}</div>`:a.map(r=>l`
            <label class="setting-row">
              <span>
                <span class="setting-label">${r.name||r.id.slice(0,8)}</span>
                <span class="setting-desc">${r.is_owner?i("owner_label",e):""}</span>
              </span>
              <input type="checkbox"
                .checked=${t.has(r.id)}
                @change=${d=>s(r.id,d.target.checked)} />
            </label>
          `)}
      </div>
    `}_renderFeatures(e){let t=this._settings.features,a=[{key:"adaptive",settingKey:"advanced_adaptive_visible",label:i("feat_adaptive",e),desc:i("feat_adaptive_desc",e)},{key:"predictions",settingKey:"advanced_predictions_visible",label:i("feat_predictions",e),desc:i("feat_predictions_desc",e)},{key:"seasonal",settingKey:"advanced_seasonal_visible",label:i("feat_seasonal",e),desc:i("feat_seasonal_desc",e)},{key:"environmental",settingKey:"advanced_environmental_visible",label:i("feat_environmental",e),desc:i("feat_environmental_desc",e)},{key:"budget",settingKey:"advanced_budget_visible",label:i("feat_budget",e),desc:i("feat_budget_desc",e)},{key:"groups",settingKey:"advanced_groups_visible",label:i("feat_groups",e),desc:i("feat_groups_desc",e)},{key:"checklists",settingKey:"advanced_checklists_visible",label:i("feat_checklists",e),desc:i("feat_checklists_desc",e)},{key:"schedule_time",settingKey:"advanced_schedule_time_visible",label:i("feat_schedule_time",e),desc:i("feat_schedule_time_desc",e)}];return l`
      <div class="settings-section">
        <h3>${i("settings_features",e)}</h3>
        <p class="section-desc">${i("settings_features_desc",e)}</p>
        ${a.map(s=>l`
          <label class="setting-row">
            <span>
              <span class="setting-label">${s.label}</span>
              <span class="setting-desc">${s.desc}</span>
            </span>
            <input type="checkbox" .checked=${t[s.key]}
              @change=${r=>this._updateSetting(s.settingKey,r.target.checked)} />
          </label>
        `)}
      </div>
    `}_renderGeneral(e){let t=this._settings.general;return l`
      <div class="settings-section">
        <h3>${i("settings_general",e)}</h3>
        <label class="setting-row">
          <span class="setting-label">${i("settings_default_warning",e)}</span>
          <input type="number" min="1" max="365" .value=${String(t.default_warning_days)}
            @change=${a=>{let s=parseInt(a.target.value,10);s>=1&&s<=365&&this._updateSetting("default_warning_days",s)}} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${i("settings_panel_enabled",e)}</span>
          <input type="checkbox" .checked=${t.panel_enabled}
            @change=${a=>this._updateSetting("panel_enabled",a.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${i("settings_notifications",e)}</span>
          <input type="checkbox" .checked=${t.notifications_enabled}
            @change=${a=>this._updateSetting("notifications_enabled",a.target.checked)} />
        </label>
        ${t.notifications_enabled?l`
          <label class="setting-row">
            <span class="setting-label">${i("settings_notify_service",e)}</span>
            <input type="text" .value=${t.notify_service}
              @change=${a=>this._updateSetting("notify_service",a.target.value.trim())} />
          </label>
          <div class="setting-row">
            <span class="setting-label">${i("test_notification",e)}</span>
            <button class="ha-button secondary"
              ?disabled=${!t.notify_service||this._testingNotification}
              @click=${this._sendTestNotification}>
              ${this._testingNotification?i("testing",e):i("send_test",e)}
            </button>
          </div>
        `:c}
      </div>
    `}_renderNotifications(e){let t=this._settings.notifications,a=this._settings.actions;return l`
      <div class="settings-section">
        <h3>${i("settings_notifications",e)}</h3>

        <label class="setting-row">
          <span>
            <span class="setting-label">${i("settings_notify_due_soon",e)}</span>
          </span>
          <input type="checkbox" .checked=${t.due_soon_enabled}
            @change=${s=>this._updateSetting("notify_due_soon_enabled",s.target.checked)} />
        </label>
        ${t.due_soon_enabled?l`
          <label class="setting-row sub-row">
            <span class="setting-desc">${i("settings_interval_hours",e)}</span>
            <input type="number" min="0" max="720" .value=${String(t.due_soon_interval_hours)}
              @change=${s=>this._updateSetting("notify_due_soon_interval_hours",parseInt(s.target.value,10)||0)} />
          </label>
        `:c}

        <label class="setting-row">
          <span>
            <span class="setting-label">${i("settings_notify_overdue",e)}</span>
          </span>
          <input type="checkbox" .checked=${t.overdue_enabled}
            @change=${s=>this._updateSetting("notify_overdue_enabled",s.target.checked)} />
        </label>
        ${t.overdue_enabled?l`
          <label class="setting-row sub-row">
            <span class="setting-desc">${i("settings_interval_hours",e)}</span>
            <input type="number" min="0" max="720" .value=${String(t.overdue_interval_hours)}
              @change=${s=>this._updateSetting("notify_overdue_interval_hours",parseInt(s.target.value,10)||0)} />
          </label>
        `:c}

        <label class="setting-row">
          <span>
            <span class="setting-label">${i("settings_notify_triggered",e)}</span>
          </span>
          <input type="checkbox" .checked=${t.triggered_enabled}
            @change=${s=>this._updateSetting("notify_triggered_enabled",s.target.checked)} />
        </label>
        ${t.triggered_enabled?l`
          <label class="setting-row sub-row">
            <span class="setting-desc">${i("settings_interval_hours",e)}</span>
            <input type="number" min="0" max="720" .value=${String(t.triggered_interval_hours)}
              @change=${s=>this._updateSetting("notify_triggered_interval_hours",parseInt(s.target.value,10)||0)} />
          </label>
        `:c}

        <label class="setting-row">
          <span class="setting-label">${i("settings_quiet_hours",e)}</span>
          <input type="checkbox" .checked=${t.quiet_hours_enabled}
            @change=${s=>this._updateSetting("quiet_hours_enabled",s.target.checked)} />
        </label>
        ${t.quiet_hours_enabled?l`
          <div class="setting-row sub-row">
            <span class="setting-desc">${i("settings_quiet_start",e)}</span>
            <input type="time" .value=${t.quiet_hours_start}
              @change=${s=>this._updateSetting("quiet_hours_start",s.target.value)} />
          </div>
          <div class="setting-row sub-row">
            <span class="setting-desc">${i("settings_quiet_end",e)}</span>
            <input type="time" .value=${t.quiet_hours_end}
              @change=${s=>this._updateSetting("quiet_hours_end",s.target.value)} />
          </div>
        `:c}

        <label class="setting-row">
          <span class="setting-label">${i("settings_max_per_day",e)}</span>
          <input type="number" min="0" max="100" .value=${String(t.max_per_day)}
            @change=${s=>this._updateSetting("max_notifications_per_day",parseInt(s.target.value,10)||0)} />
        </label>

        <label class="setting-row">
          <span class="setting-label">${i("settings_bundling",e)}</span>
          <input type="checkbox" .checked=${t.bundling_enabled}
            @change=${s=>this._updateSetting("notification_bundling_enabled",s.target.checked)} />
        </label>
        ${t.bundling_enabled?l`
          <label class="setting-row sub-row">
            <span class="setting-desc">${i("settings_bundle_threshold",e)}</span>
            <input type="number" min="2" max="20" .value=${String(t.bundle_threshold)}
              @change=${s=>this._updateSetting("notification_bundle_threshold",parseInt(s.target.value,10)||2)} />
          </label>
        `:c}

        <h4 style="margin: 16px 0 8px; font-size: 14px;">${i("settings_actions",e)}</h4>
        <label class="setting-row">
          <span class="setting-label">${i("settings_action_complete",e)}</span>
          <input type="checkbox" .checked=${a.complete_enabled}
            @change=${s=>this._updateSetting("action_complete_enabled",s.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${i("settings_action_skip",e)}</span>
          <input type="checkbox" .checked=${a.skip_enabled}
            @change=${s=>this._updateSetting("action_skip_enabled",s.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${i("settings_action_snooze",e)}</span>
          <input type="checkbox" .checked=${a.snooze_enabled}
            @change=${s=>this._updateSetting("action_snooze_enabled",s.target.checked)} />
        </label>
        ${a.snooze_enabled?l`
          <label class="setting-row sub-row">
            <span class="setting-desc">${i("settings_snooze_hours",e)}</span>
            <input type="number" min="1" max="168" .value=${String(a.snooze_duration_hours)}
              @change=${s=>this._updateSetting("snooze_duration_hours",parseInt(s.target.value,10)||4)} />
          </label>
        `:c}
      </div>
    `}_renderBudget(e){let t=this._settings.budget;return l`
      <div class="settings-section">
        <h3>${i("settings_budget",e)}</h3>
        <label class="setting-row">
          <span class="setting-label">${i("settings_currency",e)}</span>
          <select @change=${a=>this._updateSetting("budget_currency",a.target.value)}>
            ${wa.map(a=>l`<option value=${a} ?selected=${t.currency===a}>${a}</option>`)}
          </select>
        </label>
        <label class="setting-row">
          <span class="setting-label">${i("settings_budget_monthly",e)}</span>
          <input type="number" min="0" step="0.01" .value=${String(t.monthly)}
            @change=${a=>this._updateSetting("budget_monthly",parseFloat(a.target.value)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${i("settings_budget_yearly",e)}</span>
          <input type="number" min="0" step="0.01" .value=${String(t.yearly)}
            @change=${a=>this._updateSetting("budget_yearly",parseFloat(a.target.value)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${i("settings_budget_alerts",e)}</span>
          <input type="checkbox" .checked=${t.alerts_enabled}
            @change=${a=>this._updateSetting("budget_alerts_enabled",a.target.checked)} />
        </label>
        ${t.alerts_enabled?l`
          <label class="setting-row sub-row">
            <span class="setting-desc">${i("settings_budget_threshold",e)}</span>
            <input type="number" min="1" max="100" .value=${String(t.alert_threshold_pct)}
              @change=${a=>this._updateSetting("budget_alert_threshold",parseInt(a.target.value,10)||80)} />
          </label>
        `:c}
      </div>
    `}_renderPrintQr(e){let t=this._qrSelectedEntries.size||this._qrObjects.length,a=this._qrActions.size,s=t*a,r=s>200;return l`
      <div class="settings-section qr-print-section">
        <h3>${i("qr_print_title",e)}</h3>
        <p class="section-desc">${i("qr_print_desc",e)}</p>

        ${this._qrObjectsLoaded?l`
            <details open class="qr-filter-panel">
              <summary>${i("qr_print_filter",e)}</summary>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${i("qr_print_objects",e)}</div>
                <div class="qr-object-list">
                  ${this._qrObjects.length===0?l`<div class="hint">${i("no_objects",e)}</div>`:this._qrObjects.map(d=>l`
                      <label class="qr-object-row">
                        <input type="checkbox"
                          .checked=${this._qrSelectedEntries.size===0||this._qrSelectedEntries.has(d.entry_id)}
                          @change=${_=>this._toggleQrObject(d.entry_id,_.target.checked)} />
                        <span>${d.name}</span>
                        <span class="qr-task-count">${d.task_count}</span>
                      </label>
                    `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${i("qr_print_actions",e)}</div>
                <div class="qr-action-chips">
                  ${["view","complete","skip"].map(d=>l`
                    <label class="qr-action-chip ${this._qrActions.has(d)?"active":""}">
                      <input type="checkbox"
                        .checked=${this._qrActions.has(d)}
                        @change=${_=>this._toggleQrAction(d,_.target.checked)} />
                      ${i("qr_action_"+d,e)}
                    </label>
                  `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${i("qr_print_url_mode",e)}</div>
                <select .value=${this._qrUrlMode}
                  @change=${d=>{this._qrUrlMode=d.target.value}}>
                  <option value="companion">${i("qr_mode_companion",e)}</option>
                  <option value="local">${i("qr_mode_local",e)}</option>
                  <option value="server">${i("qr_mode_server",e)}</option>
                </select>
              </div>

              <div class="qr-filter-group qr-filter-actions">
                <div class="qr-estimate ${r?"error":""}">
                  ${i("qr_print_estimate",e)}: <strong>${s}</strong>
                  ${r?l` — ${i("qr_print_over_limit",e)}`:c}
                </div>
                <button
                  ?disabled=${this._qrBatchLoading||r||a===0}
                  @click=${this._generateBatch}>
                  ${this._qrBatchLoading?i("qr_print_generating",e):i("qr_print_generate",e)}
                </button>
              </div>
            </details>

            ${this._qrBatchResults.length>0?l`
                <div class="qr-results-toolbar">
                  <span>${this._qrBatchResults.length} ${i("qr_print_ready",e)}</span>
                  <button @click=${this._printQrs}>${i("qr_print_print_button",e)}</button>
                </div>
                <div class="qr-print-grid">
                  ${this._qrBatchResults.map(d=>l`
                    <div class="qr-print-cell">
                      <div class="qr-svg">${kt(d.svg)}</div>
                      <div class="qr-label">
                        <div class="qr-label-obj">${d.object_name}</div>
                        <div class="qr-label-task">${d.task_name}</div>
                        <div class="qr-label-action">${i("qr_action_"+d.action,e)}</div>
                      </div>
                    </div>
                  `)}
                </div>
              `:c}
          `:l`<button @click=${this._loadQrObjects}>${i("qr_print_load",e)}</button>`}
      </div>
    `}async _loadQrObjects(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._qrObjects=(e.objects||[]).map(t=>({entry_id:t.entry_id,name:t.object.name,task_count:(t.tasks||[]).length})).sort((t,a)=>t.name.localeCompare(a.name)),this._qrObjectsLoaded=!0}catch{this._showToast(i("action_error",this._lang))}}_toggleQrObject(e,t){let a=new Set(this._qrSelectedEntries);if(a.size===0)for(let s of this._qrObjects)a.add(s.entry_id);t?a.add(e):a.delete(e),a.size===this._qrObjects.length&&a.clear(),this._qrSelectedEntries=a}_toggleQrAction(e,t){let a=new Set(this._qrActions);t?a.add(e):a.delete(e),this._qrActions=a}async _generateBatch(){this._qrBatchLoading=!0,this._qrBatchResults=[];try{let e={type:"maintenance_supporter/qr/batch_generate",actions:[...this._qrActions],url_mode:this._qrUrlMode};this._qrSelectedEntries.size>0&&(e.entry_ids=[...this._qrSelectedEntries]);let t=await this.hass.connection.sendMessagePromise(e);this._qrBatchResults=t.qrs||[],this._qrBatchResults.length===0&&this._showToast(i("qr_print_empty",this._lang))}catch(e){let t=e?.message||i("action_error",this._lang);this._showToast(t)}finally{this._qrBatchLoading=!1}}_printQrs(){window.print()}_renderImportExport(e){return l`
      <div class="settings-section">
        <h3>${i("settings_import_export",e)}</h3>
        <div class="settings-actions">
          <label class="export-history-toggle">
            <input type="checkbox" .checked=${this._includeHistory}
              @change=${t=>{this._includeHistory=t.target.checked}} />
            ${i("settings_include_history",e)}
          </label>
        </div>
        <div class="settings-actions">
          <button @click=${this._exportJson}>${i("settings_export_json",e)}</button>
          <button @click=${this._exportCsv}>${i("settings_export_csv",e)}</button>
        </div>
        <div class="import-section">
          <textarea class="import-area" .value=${this._importCsv}
            placeholder=${i("settings_import_placeholder",e)}
            @input=${t=>{this._importCsv=t.target.value}}
          ></textarea>
          <div class="settings-actions">
            <button ?disabled=${!this._importCsv.trim()||this._importLoading}
              @click=${this._importCsvAction}>
              ${this._importLoading?"\u2026":i("settings_import_btn",e)}
            </button>
          </div>
        </div>
      </div>
    `}async _exportJson(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/export",format:"json",include_history:this._includeHistory}),t=new Date().toISOString().slice(0,10);this._downloadFile(e.data,`maintenance_export_${t}.json`,"application/json"),this._showToast(i("settings_export_success",this._lang))}catch{this._showToast(i("action_error",this._lang))}}async _exportCsv(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/export"}),t=new Date().toISOString().slice(0,10);this._downloadFile(e.csv,`maintenance_export_${t}.csv`,"text/csv"),this._showToast(i("settings_export_success",this._lang))}catch{this._showToast(i("action_error",this._lang))}}async _importCsvAction(){let e=this._importCsv.trim();if(e){this._importLoading=!0;try{let t=e.startsWith("{")||e.startsWith("["),s=(await this.hass.connection.sendMessagePromise(t?{type:"maintenance_supporter/json/import",json_content:e}:{type:"maintenance_supporter/csv/import",csv_content:e})).created??0;this._showToast(i("settings_import_success",this._lang).replace("{count}",String(s))),this._importCsv="",this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(i("action_error",this._lang))}this._importLoading=!1}}};q.styles=N`
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

    /* ─── Print QR codes section (v1.1.0) ─── */

    .qr-filter-panel {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 12px;
      margin-top: 8px;
    }
    .qr-filter-panel > summary {
      cursor: pointer;
      font-weight: 500;
    }
    .qr-filter-group {
      margin-top: 12px;
    }
    .qr-filter-label {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .qr-object-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 4px 12px;
      max-height: 240px;
      overflow-y: auto;
    }
    .qr-object-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 6px;
      cursor: pointer;
      border-radius: 4px;
    }
    .qr-object-row:hover { background: var(--secondary-background-color, rgba(127,127,127,0.1)); }
    .qr-object-row > span:nth-of-type(1) { flex: 1; }
    .qr-task-count {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }

    .qr-action-chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .qr-action-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 14px;
      border: 1px solid var(--divider-color);
      cursor: pointer;
      user-select: none;
    }
    .qr-action-chip.active {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      border-color: transparent;
    }
    .qr-action-chip input { accent-color: currentColor; }

    .qr-filter-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .qr-estimate { font-size: 13px; }
    .qr-estimate.error { color: var(--error-color, #f44336); }

    .qr-results-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      padding: 8px 12px;
      background: var(--secondary-background-color, rgba(127,127,127,0.1));
      border-radius: 6px;
    }

    .qr-print-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .qr-print-cell {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      background: #fff;
      color: #000;
    }
    .qr-print-cell .qr-svg {
      width: 100%;
      max-width: 160px;
    }
    .qr-print-cell .qr-svg svg { width: 100%; height: auto; display: block; }
    .qr-label {
      margin-top: 6px;
      font-size: 11px;
      line-height: 1.3;
    }
    .qr-label-obj { font-weight: 600; }
    .qr-label-task { color: #444; }
    .qr-label-action {
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 10px;
      color: #777;
    }

    /* ─── Print stylesheet ─── */
    @media print {
      /* Strip everything except the QR grid itself */
      :host { color: #000; background: #fff; }
      .qr-print-section h3,
      .qr-print-section .section-desc,
      .qr-filter-panel,
      .qr-results-toolbar,
      .settings-section:not(.qr-print-section),
      .settings-toast {
        display: none !important;
      }
      .qr-print-section { padding: 0; margin: 0; }
      .qr-print-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 12mm 8mm;
        margin: 0;
      }
      .qr-print-cell {
        border: none;
        padding: 0;
        page-break-inside: avoid;
      }
      .qr-print-cell .qr-svg { max-width: 48mm; }
      .qr-label { font-size: 9pt; }
    }
  `,u([$({attribute:!1})],q.prototype,"hass",2),u([$({attribute:!1})],q.prototype,"features",2),u([$({attribute:!1})],q.prototype,"budget",2),u([g()],q.prototype,"_settings",2),u([g()],q.prototype,"_loading",2),u([g()],q.prototype,"_importCsv",2),u([g()],q.prototype,"_importLoading",2),u([g()],q.prototype,"_includeHistory",2),u([g()],q.prototype,"_toast",2),u([g()],q.prototype,"_testingNotification",2),u([g()],q.prototype,"_users",2),u([g()],q.prototype,"_qrObjects",2),u([g()],q.prototype,"_qrSelectedEntries",2),u([g()],q.prototype,"_qrActions",2),u([g()],q.prototype,"_qrUrlMode",2),u([g()],q.prototype,"_qrBatchLoading",2),u([g()],q.prototype,"_qrBatchResults",2),u([g()],q.prototype,"_qrObjectsLoaded",2);customElements.define("maintenance-settings-view",q);var $a=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],K=class extends A{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let e=this._buildOverrides();if(e!==null){this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:e}),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(t){this._error=G(t,this._lang,i("save_error",this._lang))}finally{this._loading=!1}}};this._clearAll=async()=>{this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:{}}),this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(e){this._error=G(e,this._lang,i("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}open(e,t,a){if(this._entryId=e,this._taskId=t,this._values=new Array(12).fill(""),a)for(let[s,r]of Object.entries(a)){let d=parseInt(s,10);d>=1&&d<=12&&typeof r=="number"&&(this._values[d-1]=r.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let e={};for(let t=0;t<12;t++){let a=this._values[t].trim();if(!a)continue;let s=parseFloat(a);if(Number.isNaN(s))return this._error=`${i("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][t],this._lang)}: ${i("seasonal_override_invalid",this._lang)}`,null;if(s<.1||s>5)return this._error=i("seasonal_override_range",this._lang),null;e[t+1]=s}return e}render(){if(!this._open)return l``;let e=this._lang;return l`
      <ha-dialog open @closed=${this._close} heading="${i("seasonal_overrides_title",e)}">
        <div class="content">
          <p class="hint">${i("seasonal_overrides_hint",e)}</p>
          ${this._error?l`<div class="error">${this._error}</div>`:c}
          <div class="months">
            ${$a.map((t,a)=>l`
              <label class="month">
                <span class="mn">${i(t,e)}</span>
                <input type="number" step="0.1" min="0.1" max="5.0"
                  placeholder="1.0"
                  .value=${this._values[a]}
                  @input=${s=>{let r=[...this._values];r[a]=s.target.value,this._values=r}} />
              </label>
            `)}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._clearAll} .disabled=${this._loading}>
            ${i("clear_all",e)}
          </ha-button>
          <div class="spacer"></div>
          <ha-button appearance="plain" @click=${this._close}>
            ${i("cancel",e)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading}>
            ${this._loading?i("saving",e):i("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};K.styles=N`
    .content {
      min-width: 320px;
      max-width: 480px;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin: 0 0 12px 0;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
      margin-bottom: 8px;
    }
    .months {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .month {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .mn {
      min-width: 70px;
      font-size: 14px;
    }
    input[type="number"] {
      flex: 1;
      padding: 6px 8px;
      font-size: 14px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .dialog-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 16px;
    }
    .spacer { flex: 1; }
  `,u([$({attribute:!1})],K.prototype,"hass",2),u([g()],K.prototype,"_open",2),u([g()],K.prototype,"_loading",2),u([g()],K.prototype,"_error",2),u([g()],K.prototype,"_entryId",2),u([g()],K.prototype,"_taskId",2),u([g()],K.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",K);var V=class extends A{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(e,t)=>{let a=`${e}:${t}`,s=new Set(this._selected);s.has(a)?s.delete(a):s.add(a),this._selected=s};this._save=async()=>{let e=this._name.trim();if(!e){this._error=i("group_name_required",this._lang);return}this._loading=!0,this._error="";try{let t=this._buildTaskRefs();this._groupId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/update",group_id:this._groupId,name:e,description:this._description,task_refs:t}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/create",name:e,description:this._description,task_refs:t}),this._open=!1,this.dispatchEvent(new CustomEvent("group-saved"))}catch(t){this._error=G(t,this._lang,i("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._reset(),this._open=!0}openEdit(e,t){this._reset(),this._groupId=e,this._name=t.name,this._description=t.description||"",this._selected=new Set(t.task_refs.map(a=>`${a.entry_id}:${a.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(e=>{let[t,a]=e.split(":",2);return{entry_id:t,task_id:a}})}render(){if(!this._open)return l``;let e=this._lang,t=this._groupId?i("edit_group",e):i("new_group",e);return l`
      <ha-dialog open @closed=${this._close} heading="${t}">
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:c}
          <ha-textfield
            label="${i("name",e)}"
            required
            .value=${this._name}
            @input=${a=>this._name=a.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${i("description_optional",e)}"
            .value=${this._description}
            @input=${a=>this._description=a.target.value}
          ></ha-textfield>

          <div class="section-title">${i("group_select_tasks",e)}</div>
          ${this.objects.length===0?l`<div class="hint">${i("no_objects",e)}</div>`:l`
              <div class="objects">
                ${[...this.objects].sort((a,s)=>a.object.name.localeCompare(s.object.name)).map(a=>l`
                  <div class="object-block">
                    <div class="object-name">${a.object.name}</div>
                    ${a.tasks.length===0?l`<div class="hint small">${i("no_tasks_short",e)}</div>`:[...a.tasks].sort((s,r)=>s.name.localeCompare(r.name)).map(s=>{let r=`${a.entry_id}:${s.id}`,d=this._selected.has(r);return l`
                          <label class="task-row">
                            <input type="checkbox"
                              .checked=${d}
                              @change=${()=>this._toggleTask(a.entry_id,s.id)} />
                            <span>${s.name}</span>
                          </label>
                        `})}
                  </div>
                `)}
              </div>
            `}
          <div class="selected-count">
            ${i("selected",e)}: ${this._selected.size}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${i("cancel",e)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()}>
            ${this._loading?i("saving",e):i("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};V.styles=N`
    .content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 360px;
      max-width: 520px;
      max-height: 60vh;
      overflow-y: auto;
    }
    @media (max-width: 600px) {
      .content {
        min-width: 0;
        max-width: none;
        max-height: none;
      }
    }
    ha-textfield { display: block; }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 500;
      margin-top: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .hint.small { font-size: 12px; padding-left: 12px; }
    .objects { display: flex; flex-direction: column; gap: 8px; }
    .object-block {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px;
    }
    .object-name {
      font-weight: 500;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .task-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 3px 0;
      font-size: 13px;
      cursor: pointer;
    }
    .task-row input { cursor: pointer; }
    .selected-count {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
  `,u([$({attribute:!1})],V.prototype,"hass",2),u([$({attribute:!1})],V.prototype,"objects",2),u([g()],V.prototype,"_open",2),u([g()],V.prototype,"_loading",2),u([g()],V.prototype,"_error",2),u([g()],V.prototype,"_groupId",2),u([g()],V.prototype,"_name",2),u([g()],V.prototype,"_description",2),u([g()],V.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",V);var za=300,Ea=140,We=27;function wt(o,n){let e=o.trigger_config;if(!e)return c;let t=n.lang,a=o.trigger_entity_info,s=o.trigger_entity_infos,r=a?.friendly_name||e.entity_id||"\u2014",d=e.entity_id||"",_=e.entity_ids||(d?[d]:[]),p=a?.unit_of_measurement||"",m=o.trigger_current_value,h=e.type||"threshold",v=_.length>1;return l`
    <h3>${i("trigger",t)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${v?l`
            <div class="trigger-entity-name">${_.length} ${i("entities",t)} (${e.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${_.map((b,y)=>l`${y>0?", ":""}<span class="entity-link" @click=${S=>oe(S,b)}>${b}</span>`)}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `:l`
            <div class="trigger-entity-name">${r}</div>
            <div class="trigger-entity-id">${d?l`<span class="entity-link" @click=${b=>oe(b,d)}>${d}</span>`:""}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${o.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${o.trigger_active?i("triggered",t):i("ok",t)}
        </span>
      </div>

      ${m!=null?l`
            <div class="trigger-value-row">
              <span class="trigger-current ${o.trigger_active?"active":""}">${typeof m=="number"?m.toFixed(1):m}</span>
              ${p?l`<span class="trigger-unit">${p}</span>`:c}
            </div>
          `:c}

      <div class="trigger-limits">
        ${h==="threshold"?l`
          ${e.trigger_above!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${i("threshold_above",t)}: ${e.trigger_above} ${p}</span>`:c}
          ${e.trigger_below!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${i("threshold_below",t)}: ${e.trigger_below} ${p}</span>`:c}
          ${e.trigger_for_minutes?l`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${i("for_minutes",t)}: ${e.trigger_for_minutes}</span>`:c}
        `:c}
        ${h==="counter"?l`
          ${e.trigger_target_value!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${i("target_value",t)}: ${e.trigger_target_value} ${p}</span>`:c}
        `:c}
        ${h==="state_change"?l`
          ${e.trigger_target_changes!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${i("target_changes",t)}: ${e.trigger_target_changes}</span>`:c}
        `:c}
        ${h==="runtime"?l`
          ${e.trigger_runtime_hours!=null?l`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${i("runtime_hours",t)}: ${e.trigger_runtime_hours}h</span>`:c}
        `:c}
        ${h==="compound"?l`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${i("compound_logic",t)}: ${e.compound_logic||e.operator||"AND"}</span>
          ${(e.conditions||[]).map((b,y)=>l`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${y+1}. ${i(b.type||"unknown",t)}: ${b.entity_id?l`<span class="entity-link" @click=${S=>oe(S,b.entity_id)}>${b.entity_id}</span>`:""}</span>
          `)}
        `:c}
        ${a?.min!=null?l`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${i("min",t)}: ${a.min} ${p}</span>`:c}
        ${a?.max!=null?l`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${i("max",t)}: ${a.max} ${p}</span>`:c}
      </div>

      ${s&&s.length>1?l`
        <div class="trigger-entity-list">
          ${s.map(b=>l`
            <span class="trigger-entity-id">${b.friendly_name} (<span class="entity-link" @click=${y=>oe(y,b.entity_id)}>${b.entity_id}</span>)</span>
          `)}
        </div>
      `:c}

      ${ja(o,p,n)}
    </div>
  `}function ja(o,n,e){let t=o.trigger_config;if(!t)return c;let a=t.type||"threshold",s=a==="counter"&&t.trigger_delta_mode,r=e.isCounterEntity(t),d=t.entity_id||"",_=e.detailStatsData.get(d)||[],p=[],m=!1;if(_.length>=2)for(let f of _){let E=f.val;s&&o.trigger_baseline_value!=null&&(E-=o.trigger_baseline_value);let F={ts:f.ts,val:E};!r&&f.min!=null&&f.max!=null&&(F.min=s&&o.trigger_baseline_value!=null?f.min-o.trigger_baseline_value:f.min,F.max=s&&o.trigger_baseline_value!=null?f.max-o.trigger_baseline_value:f.max,m=!0),p.push(F)}else for(let f of o.history)f.trigger_value!=null&&p.push({ts:new Date(f.timestamp).getTime(),val:f.trigger_value});if(o.trigger_current_value!=null){let f=o.trigger_current_value;s&&o.trigger_baseline_value!=null&&(f-=o.trigger_baseline_value),p.push({ts:Date.now(),val:f})}if(p.length<2&&d&&e.hasStatsService&&!e.detailStatsData.has(d))return l`<div class="sparkline-container" aria-live="polite" style="display:flex;align-items:center;justify-content:center;height:140px;color:var(--secondary-text-color);font-size:12px;">
      <ha-icon icon="mdi:chart-line" style="--mdc-icon-size:16px;margin-right:8px;"></ha-icon>
      ${i("loading_chart",e.lang)}
    </div>`;if(p.length<2)return c;p.sort((f,E)=>f.ts-E.ts);let h=za,v=Ea,b=30,y=2,S=8,H=16,M=p.map(f=>f.val),j=Math.min(...M),x=Math.max(...M);if(m)for(let f of p)f.min!=null&&(j=Math.min(j,f.min)),f.max!=null&&(x=Math.max(x,f.max));t.trigger_above!=null&&(x=Math.max(x,t.trigger_above),j=Math.min(j,t.trigger_above)),t.trigger_below!=null&&(j=Math.min(j,t.trigger_below),x=Math.max(x,t.trigger_below));let C=null,U=null;if(a==="counter"&&t.trigger_target_value!=null){if(o.trigger_baseline_value!=null)C=o.trigger_baseline_value;else if(p.length>0){let f=[...o.history].filter(E=>E.type==="completed"||E.type==="reset").sort((E,F)=>new Date(F.timestamp).getTime()-new Date(E.timestamp).getTime())[0];if(f){let E=new Date(f.timestamp).getTime(),F=p[0],L=Math.abs(p[0].ts-E);for(let X of p){let ee=Math.abs(X.ts-E);ee<L&&(F=X,L=ee)}C=F.val}else C=p[0].val}C!=null?(U=C+t.trigger_target_value,x=Math.max(x,U),j=Math.min(j,C)):(x=Math.max(x,t.trigger_target_value),j=Math.min(j,0))}s&&o.trigger_baseline_value!=null&&(j=Math.min(j,0));let Z=x-j||1;j-=Z*.1,x+=Z*.1;let Q=p[0].ts,R=p[p.length-1].ts,w=R-Q||1,I=f=>b+(f-Q)/w*(h-b-y),T=f=>S+(1-(f-j)/(x-j))*(v-S-H),Te=p.map(f=>`${I(f.ts).toFixed(1)},${T(f.val).toFixed(1)}`).join(" "),qt=`M${I(p[0].ts).toFixed(1)},${v-H} `+p.map(f=>`L${I(f.ts).toFixed(1)},${T(f.val).toFixed(1)}`).join(" ")+` L${I(p[p.length-1].ts).toFixed(1)},${v-H} Z`,qe="";if(m){let f=p.filter(E=>E.min!=null&&E.max!=null);if(f.length>=2){let E=f.map(L=>`${I(L.ts).toFixed(1)},${T(L.max).toFixed(1)}`),F=[...f].reverse().map(L=>`${I(L.ts).toFixed(1)},${T(L.min).toFixed(1)}`);qe=`M${E[0]} `+E.slice(1).map(L=>`L${L}`).join(" ")+` L${F[0]} `+F.slice(1).map(L=>`L${L}`).join(" ")+" Z"}}let Ge=p[p.length-1],Mt=I(Ge.ts),Ct=T(Ge.val),Ke=f=>Math.abs(f)>=1e4?(f/1e3).toFixed(0)+"k":f>=1e3?(f/1e3).toFixed(1)+"k":f.toFixed(f<10?1:0),It=Ke(x),Nt=Ke(j),Dt=o.history.filter(f=>["completed","skipped","reset"].includes(f.type)).map(f=>({ts:new Date(f.timestamp).getTime(),type:f.type})).filter(f=>f.ts>=Q&&f.ts<=R),Me=p;if(p.length>We){let f=(p.length-1)/(We-1);Me=[];for(let E=0;E<We;E++)Me.push(p[Math.round(E*f)])}return l`
    <div class="sparkline-container">
      <svg class="sparkline-svg" viewBox="0 0 ${h} ${v}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${i("chart_sparkline",e.lang)}">
        <text x="${b-3}" y="${S+3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${It}</text>
        <text x="${b-3}" y="${v-H+3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${Nt}</text>
        <text x="${b}" y="${v-1}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(Q).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
        <text x="${h-y}" y="${v-1}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(R).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
        ${qe?D`<path d="${qe}" fill="var(--primary-color)" opacity="0.08" />`:c}
        <path d="${qt}" fill="var(--primary-color)" opacity="0.15" />
        <polyline points="${Te}" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linejoin="round" />
        ${o.degradation_rate!=null&&o.degradation_trend!=="stable"&&o.degradation_trend!=="insufficient_data"&&p.length>=2?(()=>{let f=p[p.length-1],E=30,F=f.ts+E*864e5,L=f.val+o.degradation_rate*E,X=Math.min(F,R+(R-Q)*.3),ee=Math.max(j,Math.min(x,L)),Rt=I(f.ts),Pt=T(f.val),Ft=I(X),Lt=T(ee);return D`<line x1="${Rt.toFixed(1)}" y1="${Pt.toFixed(1)}" x2="${Ft.toFixed(1)}" y2="${Lt.toFixed(1)}" stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7" />`})():c}
        ${a==="threshold"&&t.trigger_above!=null?D`<line x1="${b}" y1="${T(t.trigger_above).toFixed(1)}" x2="${h}" y2="${T(t.trigger_above).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                <text x="${h-2}" y="${T(t.trigger_above)-3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">\u25B2 ${t.trigger_above}</text>`:c}
        ${a==="threshold"&&t.trigger_below!=null?D`<line x1="${b}" y1="${T(t.trigger_below).toFixed(1)}" x2="${h}" y2="${T(t.trigger_below).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                <text x="${h-2}" y="${T(t.trigger_below)+11}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">\u25BC ${t.trigger_below}</text>`:c}
        ${a==="counter"&&U!=null?D`<line x1="${b}" y1="${T(U).toFixed(1)}" x2="${h}" y2="${T(U).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                <text x="${h-2}" y="${T(U)-3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">${i("target_value",e.lang)}: +${t.trigger_target_value}</text>`:c}
        ${a==="counter"&&C!=null?D`<line x1="${b}" y1="${T(C).toFixed(1)}" x2="${h}" y2="${T(C).toFixed(1)}" stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
                <text x="${b+2}" y="${T(C)+11}" text-anchor="start" fill="var(--secondary-text-color)" font-size="8">${i("baseline",e.lang)}</text>`:c}
        <circle cx="${Mt.toFixed(1)}" cy="${Ct.toFixed(1)}" r="3.5" fill="var(--primary-color)" />
        ${Dt.map(f=>{let E=I(f.ts),F=f.type==="completed"?"var(--success-color, #4caf50)":f.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return D`
            <line x1="${E.toFixed(1)}" y1="${S}" x2="${E.toFixed(1)}" y2="${v-H}" stroke="${F}" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
            <circle cx="${E.toFixed(1)}" cy="${S+2}" r="5" fill="${F}" opacity="0.8" />
            <text x="${E.toFixed(1)}" y="${S+6}" text-anchor="middle" fill="white" font-size="7" font-weight="bold">${f.type==="completed"?"\u2713":f.type==="skipped"?"\u23ED":"\u21BA"}</text>
          `})}
        ${Me.map(f=>{let E=I(f.ts),F=T(f.val),L=new Date(f.ts).toLocaleDateString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),X=`${f.val.toFixed(1)} ${n}`;return m&&f.min!=null&&f.max!=null&&(X+=` (${f.min.toFixed(1)}\u2013${f.max.toFixed(1)})`),D`<circle cx="${E.toFixed(1)}" cy="${F.toFixed(1)}" r="8" fill="transparent" tabindex="0"
            @mouseenter=${ee=>xt(ee,`${L}
${X}`,e.setTooltip)}
            @focus=${ee=>xt(ee,`${L}
${X}`,e.setTooltip)}
            @mouseleave=${()=>{e.setTooltip(null)}}
            @blur=${()=>{e.setTooltip(null)}} />`})}
      </svg>
      ${e.tooltip?l`
        <div class="sparkline-tooltip" role="tooltip" aria-live="assertive" style="left:${e.tooltip.x}px;top:${e.tooltip.y}px">
          ${e.tooltip.text.split(`
`).map(f=>l`<div>${f}</div>`)}
        </div>
      `:c}
    </div>
  `}function xt(o,n,e){let t=o.currentTarget,a=t.closest(".sparkline-container");if(!a)return;let s=a.getBoundingClientRect(),r=t.getBoundingClientRect();e({x:r.left-s.left+r.width/2,y:r.top-s.top-8,text:n})}function $t(o,n,e){let t=o.degradation_trend!=null&&o.degradation_trend!=="insufficient_data",a=o.days_until_threshold!=null,s=o.environmental_factor!=null&&o.environmental_factor!==1;if(!t&&!a&&!s)return c;let r=o.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":o.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${o.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${i("sensor_prediction_urgency",n).replace("{days}",String(Math.round(o.days_until_threshold||0)))}
        </div>
      `:c}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${i("sensor_prediction",n)}
      </div>
      <div class="prediction-grid">
        ${t?l`
          <div class="prediction-item">
            <ha-svg-icon path="${r}"></ha-svg-icon>
            <span class="prediction-label">${i("degradation_trend",n)}</span>
            <span class="prediction-value ${o.degradation_trend}">${i("trend_"+o.degradation_trend,n)}</span>
            ${o.degradation_rate!=null?l`<span class="prediction-rate">${o.degradation_rate>0?"+":""}${Math.abs(o.degradation_rate)>=10?Math.round(o.degradation_rate).toLocaleString():o.degradation_rate.toFixed(1)} ${o.trigger_entity_info?.unit_of_measurement||""}/${i("day_short",n)}</span>`:c}
          </div>
        `:c}
        ${a?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${i("days_until_threshold",n)}</span>
            <span class="prediction-value prediction-days${o.days_until_threshold===0?" exceeded":o.sensor_prediction_urgency?" urgent":""}">${o.days_until_threshold===0?i("threshold_exceeded",n):"~"+Math.round(o.days_until_threshold)+" "+i("days",n)}</span>
            ${o.threshold_prediction_date?l`<span class="prediction-date">${ae(o.threshold_prediction_date,n)}</span>`:c}
            ${o.threshold_prediction_confidence?l`<span class="confidence-dot ${o.threshold_prediction_confidence}"></span>`:c}
          </div>
        `:c}
        ${s&&e.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${i("environmental_adjustment",n)}</span>
            <span class="prediction-value">${o.environmental_factor.toFixed(2)}x</span>
            ${o.environmental_entity?l`<span class="prediction-entity entity-link" @click=${d=>oe(d,o.environmental_entity)}>${o.environmental_entity}</span>`:c}
          </div>
        `:c}
      </div>
    </div>
  `}function zt(o,n){let e=o.interval_analysis,t=e?.weibull_beta,a=e?.weibull_eta;if(t==null||a==null||a<=0)return c;let s=o.interval_days??0,r=o.suggested_interval??s;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${i("weibull_reliability_curve",n)}
        ${Sa(t,n)}
      </div>
      ${Aa(t,a,s,r,n)}
      ${Ta(e,n)}
      ${e?.confidence_interval_low!=null?qa(e,o,n):c}
    </div>
  `}function Sa(o,n){let e,t,a;return o<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",a="beta_early_failures"):o<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",a="beta_random_failures"):o<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",a="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",a="beta_highly_predictable"),l`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${i(a,n)} (\u03B2=${o.toFixed(2)})
    </span>
  `}function Aa(o,n,e,t,a){let b=Math.max(e,t,n,1)*1.3,y=50,S=[];for(let R=0;R<=y;R++){let w=R/y*b,I=1-Math.exp(-Math.pow(w/n,o)),T=32+w/b*260,Te=136-I*128;S.push([T,Te])}let H=S.map(([R,w])=>`${R.toFixed(1)},${w.toFixed(1)}`).join(" "),M="M32,136 "+S.map(([R,w])=>`L${R.toFixed(1)},${w.toFixed(1)}`).join(" ")+` L${S[y][0].toFixed(1)},136 Z`,j=32+e/b*260,x=1-Math.exp(-Math.pow(e/n,o)),C=136-x*128,U=((1-x)*100).toFixed(0),Z=32+t/b*260,Q=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${i("chart_weibull",a)}">
        ${Q.map(R=>{let w=136-R*128;return D`
            <line x1="${32}" y1="${w.toFixed(1)}" x2="${292}" y2="${w.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${R===.5?"4,3":c}" />
            <text x="${28}" y="${(w+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(R*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b)}</text>

        <path d="${M}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${H}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?D`
          <line x1="${j.toFixed(1)}" y1="${8}" x2="${j.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${j.toFixed(1)}" cy="${C.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(j+4).toFixed(1)}" y="${(C-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${U}%</text>
        `:c}

        ${t>0&&t!==e?D`
          <line x1="${Z.toFixed(1)}" y1="${8}" x2="${Z.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:c}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${i("weibull_failure_probability",a)}</span>
      ${e>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${i("current_interval_marker",a)}</span>`:c}
      ${t>0&&t!==e?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${i("recommended_marker",a)}</span>`:c}
    </div>
  `}function Ta(o,n){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${i("characteristic_life",n)}</span>
        <span class="weibull-info-value">${Math.round(o.weibull_eta)} ${i("days",n)}</span>
      </div>
      ${o.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${i("weibull_r_squared",n)}</span>
          <span class="weibull-info-value">${o.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:c}
    </div>
  `}function qa(o,n,e){let t=o.confidence_interval_low,a=o.confidence_interval_high,s=n.suggested_interval??n.interval_days??0,r=n.interval_days??0,d=Math.max(0,t-5),p=a+5-d,m=(t-d)/p*100,h=(a-t)/p*100,v=(s-d)/p*100,b=r>0?(r-d)/p*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${i("confidence_interval",e)}: ${s} ${i("days",e)} (${t}\u2013${a})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${m.toFixed(1)}%;width:${h.toFixed(1)}%"></div>
        ${b>=0?l`<div class="confidence-marker current" style="left:${b.toFixed(1)}%"></div>`:c}
        <div class="confidence-marker recommended" style="left:${v.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${i("confidence_conservative",e)} (${t}${i("days",e).charAt(0)})</span>
        <span class="confidence-text high">${i("confidence_aggressive",e)} (${a}${i("days",e).charAt(0)})</span>
      </div>
    </div>
  `}var Et=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function jt(o,n,e){if(!e.seasonal||!o.seasonal_factor||o.seasonal_factor===1)return c;let t=Et.map(d=>i(d,n)),a=new Date().getMonth(),s=o.seasonal_factors||o.interval_analysis?.seasonal_factors||null,r=s&&s.length===12?s:t.map((d,_)=>{let p=o.seasonal_factor||1,m=Math.sin((_-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,p+m))});return l`
    <div class="seasonal-card-compact">
      <h4>${i("seasonal_awareness",n)}</h4>
      <div class="seasonal-mini-chart">
        ${r.map((d,_)=>{let p=d*40,m=d<.9?"low":d>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${m} ${_===a?"current":""}"
                 style="height: ${p}px"
                 title="${t[_]}: ${d.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${i("shorter",n)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${i("normal",n)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${i("longer",n)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function St(o,n){return Ma(o,n)}function Ma(o,n){let e=o.seasonal_factors??o.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return c;let t=o.interval_analysis?.seasonal_reason,a=new Date().getMonth(),s=300,r=100,d=8,p=r-d-4,m=Math.max(...e,1.5),h=s/12,v=h*.65,b=d+p-1/m*p;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${i("seasonal_chart_title",n)}
        ${t?l`<span class="source-tag">${t==="learned"?i("seasonal_learned",n):i("seasonal_manual",n)}</span>`:c}
      </div>
      <svg viewBox="0 0 ${s} ${r}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${i("chart_seasonal",n)}">
        <line x1="0" y1="${b.toFixed(1)}" x2="${s}" y2="${b.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((y,S)=>{let H=y/m*p,M=S*h+(h-v)/2,j=d+p-H,x=S===a,C=y<1?"var(--success-color, #4caf50)":y>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return D`
            <rect x="${M.toFixed(1)}" y="${j.toFixed(1)}"
              width="${v.toFixed(1)}" height="${H.toFixed(1)}"
              fill="${C}" opacity="${x?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Et.map((y,S)=>l`<span class="seasonal-label ${S===a?"active-month":""}">${i(y,n)}</span>`)}
      </div>
    </div>
  `}var Ca=300,Ia=200;function At(o,n,e,t){let a=o.history.filter(d=>d.type==="completed"&&(d.cost!=null||d.duration!=null));if(a.length<2)return c;let s=a.some(d=>(d.cost??0)>0),r=a.some(d=>(d.duration??0)>0);return!s&&!r?c:l`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${i("cost_duration_chart",n)}</h3>
        <div class="toggle-buttons">
          ${s?l`<button
            class="toggle-btn ${e==="cost"?"active":""}"
            @click=${()=>t("cost")}>
            ${i("cost",n)}
          </button>`:c}
          ${s&&r?l`<button
            class="toggle-btn ${e==="both"?"active":""}"
            @click=${()=>t("both")}>
            ${i("both",n)}
          </button>`:c}
          ${r?l`<button
            class="toggle-btn ${e==="duration"?"active":""}"
            @click=${()=>t("duration")}>
            ${i("duration",n)}
          </button>`:c}
        </div>
      </div>
      ${Na(o,n,e)}
    </div>
  `}function Na(o,n,e){let t=o.history.filter(w=>w.type==="completed"&&(w.cost!=null||w.duration!=null)).map(w=>({ts:new Date(w.timestamp).getTime(),cost:w.cost??0,duration:w.duration??0})).sort((w,I)=>w.ts-I.ts);if(t.length<2)return c;let a=t.some(w=>w.cost>0),s=t.some(w=>w.duration>0);if(!a&&!s)return c;let r=e!=="duration"&&a,d=e!=="cost"&&s,_=r||!d&&a,p=d||!r&&s,m=Ca,h=Ia,v=_?32:8,b=p?32:8,y=8,S=20,H=m-v-b,M=h-y-S,j=Math.max(...t.map(w=>w.cost))||1,x=Math.max(...t.map(w=>w.duration))||1,C=Math.min(20,H/t.length*.6),U=H/t.length,Z=w=>v+U*w+U/2,Q=w=>y+M-w/j*M,R=w=>y+M-w/x*M;return l`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${m} ${h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${i("chart_history",n)}">
        ${_?t.map((w,I)=>D`
          <rect x="${(Z(I)-C/2).toFixed(1)}" y="${Q(w.cost).toFixed(1)}" width="${C.toFixed(1)}" height="${(y+M-Q(w.cost)).toFixed(1)}"
            fill="var(--primary-color)" opacity="0.6" rx="2" />
        `):c}
        ${p?D`
          <polyline points="${t.map((w,I)=>`${Z(I).toFixed(1)},${R(w.duration).toFixed(1)}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${t.map((w,I)=>D`
            <circle cx="${Z(I).toFixed(1)}" cy="${R(w.duration).toFixed(1)}" r="3" fill="var(--accent-color, #ff9800)" />
          `)}
        `:c}
        <text x="${v}" y="${h-2}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(t[0].ts).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
        <text x="${m-b}" y="${h-2}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(t[t.length-1].ts).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
        ${_?D`
          <text x="${v-3}" y="${y+4}" text-anchor="end" fill="var(--primary-color)" font-size="7">${j.toFixed(0)}\u20AC</text>
          <text x="${v-3}" y="${y+M+3}" text-anchor="end" fill="var(--primary-color)" font-size="7">0\u20AC</text>
        `:c}
        ${p?D`
          <text x="${m-b+3}" y="${y+4}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">${x.toFixed(0)}m</text>
          <text x="${m-b+3}" y="${y+M+3}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">0m</text>
        `:c}
      </svg>
    </div>
    <div class="chart-legend">
      ${_?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${i("cost",n)}</span>`:c}
      ${p?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${i("duration",n)}</span>`:c}
    </div>
  `}var Da=60,Ra=20,Tt=30,z=class extends A{constructor(){super(...arguments);this.narrow=!1;this.panel={};this._objects=[];this._stats=null;this._view="overview";this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._filterUser=null;this._unsub=null;this._sparklineTooltip=null;this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1};this._adminPanelUserIds=[];this._defaultWarningDays=7;this._actionLoading=!1;this._moreMenuOpen=!1;this._toastMessage="";this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab="dashboard";this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._groupByMode="none";this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=e=>this._onPopState(e);this._deepLinkHandled=!1;this._onDialogEvent=async()=>{try{await this._loadData()}catch{}}}get _lang(){return this.hass?.language||"en"}get _isOperator(){let e=this.hass?.user;return e?e.is_admin?!1:!this._adminPanelUserIds.includes(e.id):!0}connectedCallback(){super.connectedCallback(),window.addEventListener("popstate",this._popstateHandler);let e=localStorage.getItem("maintenance_supporter_sort");e&&["due_date","object","type","task_name","area","assigned_user","group"].includes(e)&&(this._sortMode=e);let t=localStorage.getItem("maintenance_supporter_object_sort");t&&["alphabetical","due_soonest","task_count"].includes(t)&&(this._objectSortMode=t);let a=localStorage.getItem("maintenance_supporter_groupby");a&&["none","area","group","user"].includes(a)&&(this._groupByMode=a)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._popstateHandler),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null,this._deepLinkHandled=!1,this._statsService?.clearCache(),this._statsService=null}updated(e){if(super.updated(e),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new Se(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new ie(this.hass),this._userService.getUsers())}}async _loadData(){let[e,t,a,s,r]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null)]);if(e&&(this._objects=e.objects),t&&(this._stats=t),a&&(this._budget=a),s&&(this._groups=s.groups||{}),r){let d=r;this._features=d.features,this._adminPanelUserIds=d.admin_panel_user_ids||[];let _=d.general?.default_warning_days;typeof _=="number"&&_>=0&&_<=365&&(this._defaultWarningDays=_)}this._fetchMiniStatsForOverview(),this._handleDeepLink()}_handleDeepLink(){if(this._deepLinkHandled)return;let e=new URLSearchParams(window.location.search),t=e.get("entry_id");if(!t)return;this._deepLinkHandled=!0;let a=e.get("task_id"),s=e.get("action"),r=window.location.pathname+window.location.hash;history.replaceState(history.state,"",r);let d=this._getObject(t);if(!d){this._showOverview();return}if(a){let _=d.tasks.find(p=>p.id===a);if(!_){this._showObject(t);return}this._showTask(t,a),s==="complete"&&requestAnimationFrame(()=>{this._openCompleteDialog(t,a,_.name,this._features.checklists?_.checklist:void 0,this._features.adaptive&&!!_.adaptive_config?.enabled)})}else this._showObject(t)}_isCounterEntity(e){if(!e)return!1;let t=e.type||"threshold";return t==="counter"||t==="state_change"}async _fetchDetailStats(e,t){if(!this._statsService)return;let a=await this._statsService.getDetailStats(e,t),s=new Map(this._detailStatsData);s.set(e,a),this._detailStatsData=s}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let e=[];for(let a of this._objects)for(let s of a.tasks){let r=s.trigger_config?.entity_id;r&&e.push({entityId:r,isCounter:this._isCounterEntity(s.trigger_config)})}if(e.length===0)return;let t=await this._statsService.getBatchMiniStats(e);this._miniStatsData=new Map([...this._miniStatsData,...t])}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(e=>{let t=e;this._objects=t.objects},{type:"maintenance_supporter/subscribe"})}catch{}}get _taskRows(){let e=[];for(let h of this._objects)for(let v of h.tasks){if(this._filterStatus&&v.status!==this._filterStatus)continue;if(this._filterUser){let y=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(v.responsible_user_id!==y)continue}let b=[];for(let y of Object.values(this._groups))y.task_refs?.some(S=>S.entry_id===h.entry_id&&S.task_id===v.id)&&b.push(y.name);e.push({entry_id:h.entry_id,task_id:v.id,object_name:h.object.name,task_name:v.name,type:v.type,schedule_type:v.schedule_type,status:v.status,days_until_due:v.days_until_due??null,next_due:v.next_due??null,trigger_active:v.trigger_active,trigger_current_value:v.trigger_current_value??null,trigger_current_delta:v.trigger_current_delta??null,trigger_config:v.trigger_config??null,trigger_entity_info:v.trigger_entity_info??null,times_performed:v.times_performed,total_cost:v.total_cost,interval_days:v.interval_days??null,interval_anchor:v.interval_anchor??null,history:v.history||[],enabled:v.enabled,nfc_tag_id:v.nfc_tag_id??null,area_id:h.object.area_id??null,responsible_user_id:v.responsible_user_id??null,group_names:b})}let t={overdue:0,triggered:1,due_soon:2,ok:3},a=(h,v)=>(t[h.status]??9)-(t[v.status]??9),s=(h,v)=>(h.days_until_due??99999)-(v.days_until_due??99999),r=(h,v)=>a(h,v)||s(h,v),d=h=>h.area_id&&this.hass?.areas?.[h.area_id]?.name||"",_=h=>h.responsible_user_id&&this._userService?.getUserName(h.responsible_user_id)||"",p=h=>h.group_names[0]||"",m={due_date:r,object:(h,v)=>h.object_name.localeCompare(v.object_name)||r(h,v),type:(h,v)=>h.type.localeCompare(v.type)||r(h,v),task_name:(h,v)=>h.task_name.localeCompare(v.task_name),area:(h,v)=>{let b=d(h),y=d(v);return!b&&y?1:b&&!y?-1:b.localeCompare(y)||r(h,v)},assigned_user:(h,v)=>{let b=_(h),y=_(v);return!b&&y?1:b&&!y?-1:b.localeCompare(y)||r(h,v)},group:(h,v)=>{let b=p(h),y=p(v);return!b&&y?1:b&&!y?-1:b.localeCompare(y)||r(h,v)}};return e.sort(m[this._sortMode]),e}_getObject(e){return this._objects.find(t=>t.entry_id===e)}_getTask(e,t){return this._getObject(e)?.tasks.find(s=>s.id===t)}_pushPanelState(e,t,a){let s={msp_view:e,msp_entry:t||null,msp_task:a||null};history.pushState(s,"")}_onPopState(e){let t=e.state;if(t?.msp_view&&(this._view=t.msp_view,this._selectedEntryId=t.msp_entry||null,this._selectedTaskId=t.msp_task||null,this._moreMenuOpen=!1,t.msp_view==="task"&&t.msp_entry&&t.msp_task)){this._historyFilter=null;let a=this._getTask(t.msp_entry,t.msp_task);a?.trigger_config?.entity_id&&this._fetchDetailStats(a.trigger_config.entity_id,this._isCounterEntity(a.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._selectedEntryId=null,this._selectedTaskId=null}_showObject(e){this._pushPanelState("object",e),this._view="object",this._selectedEntryId=e,this._selectedTaskId=null}_showTask(e,t){this._pushPanelState("task",e,t),this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._activeTab="overview",this._historyFilter=null;let a=this._getTask(e,t);if(a?.trigger_config?.entity_id){let s=a.trigger_config.entity_id,r=this._isCounterEntity(a.trigger_config);this._fetchDetailStats(s,r)}}_showToast(e){this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}async _deleteObject(e){if(await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:i("delete",this._lang),message:i("confirm_delete_object",this._lang),confirmText:i("delete",this._lang),danger:!0}))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:e}),this._showOverview(),await this._loadData()}catch{this._showToast(i("action_error",this._lang))}}async _deleteTask(e,t){if(await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:i("delete",this._lang),message:i("confirm_delete_task",this._lang),confirmText:i("delete",this._lang),danger:!0}))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/delete",entry_id:e,task_id:t}),this._showObject(e),await this._loadData()}catch{this._showToast(i("action_error",this._lang))}}async _skipTask(e,t,a){this._actionLoading=!0;try{let s={type:"maintenance_supporter/task/skip",entry_id:e,task_id:t};a&&(s.reason=a),await this.hass.connection.sendMessagePromise(s),await this._loadData()}catch{this._showToast(i("action_error",this._lang))}finally{this._actionLoading=!1}}async _resetTask(e,t,a){this._actionLoading=!0;try{let s={type:"maintenance_supporter/task/reset",entry_id:e,task_id:t};a&&(s.date=a),await this.hass.connection.sendMessagePromise(s),await this._loadData()}catch{this._showToast(i("action_error",this._lang))}finally{this._actionLoading=!1}}async _applySuggestion(e,t,a){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/apply_suggestion",entry_id:e,task_id:t,interval:a}),await this._loadData()}catch{this._showToast(i("action_error",this._lang))}}_openSeasonalOverrides(e){let t=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!t||!this._selectedEntryId)return;let a=e.adaptive_config?.seasonal_overrides;t.open(this._selectedEntryId,e.id,a)}async _reanalyzeInterval(e,t){try{let a=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:e,task_id:t});a.recommended_interval?this._showToast(`${i("reanalyze_result",this._lang)}: ${a.recommended_interval} ${i("days",this._lang)} (${i(`confidence_${a.confidence}`,this._lang)}, ${a.data_points} ${i("data_points",this._lang)})`):this._showToast(i("reanalyze_insufficient_data",this._lang)),await this._loadData()}catch{this._showToast(i("action_error",this._lang))}}async _promptSkipTask(e,t){let a=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!a)return;let s=await a.prompt({title:i("skip",this._lang),message:i("skip_reason_prompt",this._lang),confirmText:i("skip",this._lang),inputLabel:i("reason_optional",this._lang),inputType:"text"});s.confirmed&&this._skipTask(e,t,s.value||void 0)}async _promptResetTask(e,t){let a=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!a)return;let s=await a.prompt({title:i("reset",this._lang),message:i("reset_date_prompt",this._lang),confirmText:i("reset",this._lang),inputLabel:i("reset_date_optional",this._lang),inputType:"date"});s.confirmed&&this._resetTask(e,t,s.value||void 0)}_dismissSuggestion(e,t){e&&t&&this._dismissedSuggestions.add(`${e}_${t}`),this.requestUpdate()}_openCompleteDialog(e,t,a,s,r){let d=this.shadowRoot.querySelector("maintenance-complete-dialog");d&&(d.entryId=e,d.taskId=t,d.taskName=a,d.lang=this._lang,d.checklist=s||[],d.adaptiveEnabled=!!r,d.open())}_openQrForObject(e,t){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForObject(e,t)}_openQrForTask(e,t,a,s){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForTask(e,t,a,s)}render(){return l`
      <div class="panel">
        ${this.narrow||this._view!=="overview"?this._renderHeader():c}
        <div class="content">
          ${this._view==="overview"?this._renderOverview():this._view==="all_objects"?this._renderAllObjects():this._view==="object"?this._renderObjectDetail():this._renderTaskDetail()}
        </div>
      </div>
      <maintenance-object-dialog
        .hass=${this.hass}
        @object-saved=${this._onDialogEvent}
      ></maintenance-object-dialog>
      <maintenance-task-dialog
        .hass=${this.hass}
        .checklistsEnabled=${this._features.checklists}
        .scheduleTimeEnabled=${this._features.schedule_time}
        .defaultWarningDays=${this._defaultWarningDays}
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
      <maintenance-seasonal-overrides-dialog
        .hass=${this.hass}
        @overrides-saved=${this._onDialogEvent}
      ></maintenance-seasonal-overrides-dialog>
      <maintenance-group-dialog
        .hass=${this.hass}
        .objects=${this._objects}
        @group-saved=${this._onDialogEvent}
      ></maintenance-group-dialog>
      ${this._toastMessage?l`<div class="toast">${this._toastMessage}</div>`:c}
    `}_renderHeader(){let e=[{label:i("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let a=this._getTask(this._selectedEntryId,this._selectedTaskId);e.push({label:a?.name||"Task"})}return l`
      <div class="header">
        ${this.narrow?l`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:c}
        ${this._view!=="overview"?l`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._showOverview()}}
            ></ha-icon-button>`:c}
        <div class="breadcrumbs">
          ${e.map((t,a)=>l`
              ${a>0?l`<span class="sep">/</span>`:c}
              ${t.action?l`<a @click=${t.action}>${t.label}</a>`:l`<span class="current">${t.label}</span>`}
            `)}
        </div>
      </div>
    `}_renderOverview(){let e=this._lang,t=this._isOperator;return t&&this._overviewTab==="settings"&&(this._overviewTab="dashboard"),l`
      ${t?c:l`
        <div class="tab-bar">
          <div class="tab ${this._overviewTab==="dashboard"?"active":""}"
            @click=${()=>{this._overviewTab="dashboard"}}>
            ${i("dashboard",e)}
          </div>
          <div class="tab ${this._overviewTab==="settings"?"active":""}"
            @click=${()=>{this._overviewTab="settings"}}>
            ${i("settings",e)}
          </div>
        </div>
      `}
      ${this._overviewTab==="dashboard"?this._renderDashboard():l`<maintenance-settings-view
            .hass=${this.hass}
            .features=${this._features}
            .budget=${this._budget}
            @settings-changed=${this._onSettingsChanged}
          ></maintenance-settings-view>`}
    `}_renderDashboard(){let e=this._stats,t=this._taskRows,a=this._lang,s=this._isOperator;return l`
      ${e?l`
            <div class="stats-bar">
              <div class="stat-item clickable" @click=${()=>this._showAllObjects()}>
                <span class="stat-value">${e.total_objects}</span>
                <span class="stat-label">${i("objects",a)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">${e.total_tasks}</span>
                <span class="stat-label">${i("tasks",a)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" style="color: var(--error-color)">${e.overdue}</span>
                <span class="stat-label">${i("overdue",a)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" style="color: var(--warning-color)">${e.due_soon}</span>
                <span class="stat-label">${i("due_soon",a)}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" style="color: #ff5722">${e.triggered}</span>
                <span class="stat-label">${i("triggered",a)}</span>
              </div>
            </div>
          `:c}

      ${this._features.budget?this._renderBudgetBar():c}

      <div class="filter-bar">
        <label class="filter-field">
          <span class="filter-label">${i("filter_label",a)}</span>
          <select
            @change=${r=>this._filterStatus=r.target.value}
          >
            <option value="">${i("all",a)}</option>
            <option value="overdue">${i("overdue",a)}</option>
            <option value="due_soon">${i("due_soon",a)}</option>
            <option value="triggered">${i("triggered",a)}</option>
            <option value="ok">${i("ok",a)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${i("user_label",a)}</span>
          <select
            .value=${this._filterUser||""}
            @change=${r=>{let d=r.target.value;this._filterUser=d||null}}
          >
            <option value="">${i("all_users",a)}</option>
            <option value="current_user">${i("my_tasks",a)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${i("sort_label",a)}</span>
          <select
            .value=${this._sortMode}
            @change=${r=>{this._sortMode=r.target.value,localStorage.setItem("maintenance_supporter_sort",this._sortMode)}}
          >
            <option value="due_date" ?selected=${this._sortMode==="due_date"}>${i("sort_due_date",a)}</option>
            <option value="object" ?selected=${this._sortMode==="object"}>${i("sort_object",a)}</option>
            <option value="type" ?selected=${this._sortMode==="type"}>${i("sort_type",a)}</option>
            <option value="task_name" ?selected=${this._sortMode==="task_name"}>${i("sort_task_name",a)}</option>
            <option value="area" ?selected=${this._sortMode==="area"}>${i("sort_area",a)}</option>
            <option value="assigned_user" ?selected=${this._sortMode==="assigned_user"}>${i("sort_assigned_user",a)}</option>
            <option value="group" ?selected=${this._sortMode==="group"}>${i("sort_group",a)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${i("group_by_label",a)}</span>
          <select
            .value=${this._groupByMode}
            @change=${r=>{this._groupByMode=r.target.value,localStorage.setItem("maintenance_supporter_groupby",this._groupByMode)}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${i("groupby_none",a)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${i("groupby_area",a)}</option>
            ${this._features.groups?l`<option value="group" ?selected=${this._groupByMode==="group"}>${i("groupby_group",a)}</option>`:c}
            <option value="user" ?selected=${this._groupByMode==="user"}>${i("groupby_user",a)}</option>
          </select>
        </label>
        ${s?c:l`
          <ha-button
            @click=${()=>this.shadowRoot.querySelector("maintenance-object-dialog")?.openCreate()}
          >
            ${i("new_object",a)}
          </ha-button>
          <ha-button
            @click=${()=>this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate("",this._objects)}
          >
            ${i("new_task",a)}
          </ha-button>
        `}
      </div>

      ${t.length===0?l`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${i("no_tasks",a)}</p>
            </div>
          `:this._groupByMode==="none"?l`
              <div class="task-table">
                ${t.map(r=>this._renderOverviewRow(r))}
              </div>
            `:this._renderGroupedTasks(t,a)}

      ${this._features.groups&&!s?this._renderGroupsSection():c}
    `}_renderGroupedTasks(e,t){let a=new Map,s=i("unassigned",t);for(let _ of e){let p=[];this._groupByMode==="area"?p=[(_.area_id?this.hass?.areas?.[_.area_id]?.name:null)||s]:this._groupByMode==="user"?p=[(_.responsible_user_id?this._userService?.getUserName(_.responsible_user_id):null)||s]:this._groupByMode==="group"&&(p=_.group_names.length>0?_.group_names:[s]);for(let m of p)a.has(m)||a.set(m,[]),a.get(m).push(_)}let r=[...a.entries()].sort(([_],[p])=>_===s&&p!==s?1:p===s&&_!==s?-1:_.localeCompare(p)),d=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":"mdi:account-outline";return l`
      ${r.map(([_,p])=>l`
        <details class="group-section" open>
          <summary class="group-section-header">
            <ha-icon icon="${d}"></ha-icon>
            <span>${_}</span>
            <span class="group-section-count">(${p.length})</span>
          </summary>
          <div class="task-table">
            ${p.map(m=>this._renderOverviewRow(m))}
          </div>
        </details>
      `)}
    `}_renderAllObjects(){let e=this._lang,t=this._isOperator,a=_=>{let p=1/0;for(let m of _.tasks){let h=m.days_until_due;h!=null&&h<p&&(p=h)}return p},s=[...this._objects];this._objectSortMode==="alphabetical"?s.sort((_,p)=>_.object.name.localeCompare(p.object.name)):this._objectSortMode==="task_count"?s.sort((_,p)=>p.tasks.length-_.tasks.length||_.object.name.localeCompare(p.object.name)):s.sort((_,p)=>a(_)-a(p)||_.object.name.localeCompare(p.object.name));let r=()=>{let _=new Map;for(let p of s){let m=p.object.area_id,h=m?this.hass?.areas?.[m]?.name||i("unassigned",e):i("no_area",e);_.has(h)||_.set(h,[]),_.get(h).push(p)}return new Map([..._.entries()].sort(([p],[m])=>p.localeCompare(m)))},d=_=>{let p=_.tasks.some(m=>m.status==="overdue"||m.status==="triggered");return l`
        <div class="object-card${p?" object-card-overdue":""}" @click=${()=>this._showObject(_.entry_id)}>
          ${p?l`<span class="overdue-dot" title="${i("has_overdue",e)}"></span>`:c}
          <div class="object-card-header">
            <span class="object-card-name">${_.object.name}</span>
            <span class="object-card-count">${_.tasks.length} ${i("tasks_lower",e)}</span>
          </div>
          ${_.object.manufacturer||_.object.model?l`<div class="object-card-meta">${[_.object.manufacturer,_.object.model].filter(Boolean).join(" ")}</div>`:c}
          ${_.tasks.length===0?l`<div class="object-card-empty">${i("no_tasks_yet",e)}</div>`:c}
        </div>
      `};return l`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showOverview()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${i("all_objects",e)}</span>
      </div>
      <div class="filter-bar">
        <label class="filter-field">
          <span class="filter-label">${i("sort_label",e)}</span>
          <select
            .value=${this._objectSortMode}
            @change=${_=>{this._objectSortMode=_.target.value,localStorage.setItem("maintenance_supporter_object_sort",this._objectSortMode)}}
          >
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${i("sort_alphabetical",e)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${i("sort_due_soonest",e)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${i("sort_task_count",e)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${i("group_by_label",e)}</span>
          <select
            .value=${this._groupByMode}
            @change=${_=>{this._groupByMode=_.target.value,localStorage.setItem("maintenance_supporter_groupby",this._groupByMode)}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${i("groupby_none",e)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${i("groupby_area",e)}</option>
          </select>
        </label>
        ${t?c:l`
          <ha-button
            @click=${()=>this.shadowRoot.querySelector("maintenance-object-dialog")?.openCreate()}
          >
            ${i("new_object",e)}
          </ha-button>
        `}
      </div>
      ${this._groupByMode==="area"?l`
          ${[...r().entries()].map(([_,p])=>l`
            <details class="group-section" open>
              <summary class="group-section-header">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${_}</span>
                <span class="group-section-count">(${p.length})</span>
              </summary>
              <div class="objects-grid">${p.map(d)}</div>
            </details>
          `)}
        `:l`<div class="objects-grid">${s.map(d)}</div>`}
    `}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return c;let e=Object.entries(this._groups),t=this._lang;return l`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${i("groups",t)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${i("new_group",t)}
          </ha-button>
        </div>
        ${e.length===0?l`<div class="hint">${i("no_groups",t)}</div>`:l`
            <div class="groups-grid">
              ${e.map(([a,s])=>{let r=s.task_refs.map(d=>this._getTask(d.entry_id,d.task_id)?.name).filter(Boolean);return l`
                  <div class="group-card">
                    <div class="group-card-head">
                      <div class="group-card-name">${s.name}</div>
                      <div class="group-card-actions">
                        <mwc-icon-button title="${i("edit",t)}" @click=${()=>this._openGroupEdit(a)}>
                          <ha-svg-icon path="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"></ha-svg-icon>
                        </mwc-icon-button>
                        <mwc-icon-button title="${i("delete",t)}" @click=${()=>this._deleteGroup(a,s.name)}>
                          <ha-svg-icon path="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"></ha-svg-icon>
                        </mwc-icon-button>
                      </div>
                    </div>
                    ${s.description?l`<div class="group-card-desc">${s.description}</div>`:c}
                    <div class="group-card-tasks">
                      ${r.length>0?r.map(d=>l`<span class="group-task-chip">${d}</span>`):l`<span style="font-size:12px;color:var(--secondary-text-color)">${i("no_tasks_short",t)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(e){let t=this._groups[e];t&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(e,t)}async _deleteGroup(e,t){let a=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(a?await a.confirm({title:i("delete_group",this._lang),message:i("delete_group_confirm",this._lang).replace("{name}",t),confirmText:i("delete",this._lang)}):confirm(`${i("delete_group_confirm",this._lang).replace("{name}",t)}`))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/delete",group_id:e}),await this._loadData()}catch{this._showToast(i("action_error",this._lang))}}_renderBudgetBar(){let e=this._budget;if(!e)return c;let t=this._lang,a=e.currency_symbol||"\u20AC",s=[];return e.monthly_budget>0&&s.push({label:i("budget_monthly",t),spent:e.monthly_spent,budget:e.monthly_budget}),e.yearly_budget>0&&s.push({label:i("budget_yearly",t),spent:e.yearly_spent,budget:e.yearly_budget}),s.length===0?c:l`
      <div class="budget-bars">
        ${s.map(r=>{let d=Math.min(100,Math.max(0,r.spent/r.budget*100)),_=d>=100?"var(--error-color, #f44336)":d>=e.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return l`
            <div class="budget-item">
              <div class="budget-label">
                <span>${r.label}</span>
                <span>${r.spent.toFixed(2)} / ${r.budget.toFixed(2)} ${a}</span>
              </div>
              <div class="budget-bar">
                <div class="budget-bar-fill" style="width:${d}%; background:${_}"></div>
              </div>
            </div>
          `})}
      </div>
    `}_renderOverviewRow(e){let t=this._lang,a=e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0,s=0,r=Ee.ok,d=!1;if(a&&e.days_until_due!==null){let h=(e.interval_days-e.days_until_due)/e.interval_days*100;s=Math.max(0,Math.min(100,h)),d=h>100,e.status==="overdue"?r=Ee.overdue:e.status==="due_soon"&&(r=Ee.due_soon)}let _=e.area_id?this.hass?.areas?.[e.area_id]?.name:null,p=e.responsible_user_id?this._userService?.getUserName(e.responsible_user_id):null,m=e.group_names.length>0||_||p;return l`
      <div class="task-row${e.enabled?"":" task-disabled"}">
        <span class="cell-badges">
          <span class="status-badge ${e.status}">${i(e.status,t)}</span>
          ${e.enabled?c:l`<span class="badge-disabled">${i("disabled",t)}</span>`}
          ${e.nfc_tag_id?l`<span class="nfc-badge" title="${i("nfc_linked",t)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:c}
        </span>
        <span class="cell object-name" @click=${h=>{h.stopPropagation(),this._showObject(e.entry_id)}}>${e.object_name}</span>
        <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,e.task_id)}>${e.task_name}</span>
        <span class="task-sub${m?"":" task-sub-empty"}">
          ${e.group_names.length>0?l`
            <span class="sub-chip" title="${i("groups",t)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${e.group_names.join(", ")}
            </span>`:c}
          ${_?l`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${_}
            </span>`:c}
          ${p?l`
            <span class="sub-chip" title="${i("responsible_user",t)}">
              <ha-icon icon="mdi:account-outline"></ha-icon>${p}
            </span>`:c}
        </span>
        <span class="cell type">${i(e.type,t)}</span>
        <span class="due-cell" @click=${()=>this._showTask(e.entry_id,e.task_id)}>
          <span class="due-text">${je(e.days_until_due,t)}</span>
          ${a?l`<div class="days-bar"><div class="days-bar-fill${d?" overflow":""}" style="width:${s}%;background:${r}"></div></div>`:c}
          ${e.trigger_config?this._renderTriggerProgress(e):!a&&e.trigger_active?l`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:c}
          ${this._renderMiniSparkline(e)}
        </span>
        <span class="row-actions">
          <mwc-icon-button class="btn-complete" title="${i("complete",t)}" @click=${h=>{h.stopPropagation(),this._openCompleteDialogForRow(e)}}>
            <ha-icon icon="mdi:check"></ha-icon>
          </mwc-icon-button>
          <mwc-icon-button class="btn-skip" title="${i("skip",t)}" .disabled=${this._actionLoading} @click=${h=>{h.stopPropagation(),this._promptSkipTask(e.entry_id,e.task_id)}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>
        </span>
      </div>
    `}_openCompleteDialogForRow(e){let a=this._objects.find(s=>s.entry_id===e.entry_id)?.tasks.find(s=>s.id===e.task_id);this._openCompleteDialog(e.entry_id,e.task_id,e.task_name,this._features.checklists?a?.checklist:void 0,this._features.adaptive&&!!a?.adaptive_config?.enabled)}_renderTriggerProgress(e){let t=e.trigger_config??null;if(!t)return c;let a=t.type||"threshold",s=e.trigger_entity_info?.unit_of_measurement??"",r=0,d="";if(a==="threshold"){let m=e.trigger_current_value??null;if(m==null)return c;let h=t.trigger_above,v=t.trigger_below;if(h!=null){let b=v??0,y=h-b||1;r=Math.min(100,Math.max(0,(m-b)/y*100)),d=`${m.toFixed(1)} / ${h} ${s}`}else if(v!=null){let y=e.trigger_entity_info?.max??(v*2||100),S=y-v||1;r=Math.min(100,Math.max(0,(y-m)/S*100)),d=`${m.toFixed(1)} / ${v} ${s}`}else return c}else if(a==="counter"){let m=t.trigger_target_value||1,v=e.trigger_current_delta??null??e.trigger_current_value??null;if(v==null)return c;r=Math.min(100,Math.max(0,v/m*100)),d=`${v.toFixed(1)} / ${m} ${s}`}else if(a==="state_change"){let m=t.trigger_target_changes||1,h=e.trigger_current_value??null;if(h==null)return c;r=Math.min(100,Math.max(0,h/m*100)),d=`${Math.round(h)} / ${m}`}else if(a==="runtime"){let m=t.trigger_runtime_hours||100,h=e.trigger_current_value??null;if(h==null)return c;r=Math.min(100,Math.max(0,h/m*100)),d=`${h.toFixed(1)}h / ${m}h`}else if(a==="compound"){let m=t.compound_logic||t.operator||"AND",h=t.conditions?.length||0;d=`${m} (${h})`,r=e.trigger_active?100:0}else return c;let _=r>=100,p=r>90?"var(--error-color, #f44336)":r>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return l`
      <div class="trigger-progress">
        <div class="trigger-progress-bar">
          <div class="trigger-progress-fill${_?" overflow":""}" style="width:${r}%;background:${p}"></div>
        </div>
        <span class="trigger-progress-label">${d}</span>
      </div>
    `}_renderMiniSparkline(e){if(!e.trigger_config?.entity_id)return c;let t=e.trigger_config.entity_id,a=this._miniStatsData.get(t)||[],s=[];if(a.length>=2)s=a.map(x=>({ts:x.ts,val:x.val}));else{if(!e.history)return c;for(let x of e.history)x.trigger_value!=null&&s.push({ts:new Date(x.timestamp).getTime(),val:x.trigger_value})}if(e.trigger_current_value!=null&&s.push({ts:Date.now(),val:e.trigger_current_value}),s.length<2)return c;s.sort((x,C)=>x.ts-C.ts);let r=Da,d=Ra,_=s.map(x=>x.val),p=Math.min(..._),m=Math.max(..._),h=m-p||1;p-=h*.1,m+=h*.1;let v=s[0].ts,y=s[s.length-1].ts-v||1,S=x=>(x-v)/y*r,H=x=>2+(1-(x-p)/(m-p))*(d-4),M=s;if(M.length>Tt){let x=Math.ceil(M.length/Tt);M=M.filter((C,U)=>U%x===0||U===M.length-1)}let j=M.map(x=>`${S(x.ts).toFixed(1)},${H(x.val).toFixed(1)}`).join(" ");return l`
      <svg class="mini-sparkline" viewBox="0 0 ${r} ${d}" preserveAspectRatio="none" role="img" aria-label="${i("chart_mini_sparkline",this._lang)}">
        <polyline points="${j}" fill="none" stroke="var(--primary-color)" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
    `}_renderDaysProgress(e){let t=this._lang;if(e.days_until_due==null||!e.interval_days||e.interval_days<=0)return c;let s=(e.interval_days-e.days_until_due)/e.interval_days*100,r=Math.max(0,Math.min(100,s)),d=s>100,_="var(--success-color, #4caf50)";return e.status==="overdue"?_="var(--error-color, #f44336)":e.status==="due_soon"&&(_="var(--warning-color, #ff9800)"),l`
      <div class="days-progress">
        <div class="days-progress-labels">
          <span>${e.last_performed?`${i("last_performed",t)}: ${ae(e.last_performed,t)}`:""}</span>
          <span>${e.next_due?`${i("next_due",t)}: ${ae(e.next_due,t)}`:""}</span>
        </div>
        <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(r)}" aria-valuemin="0" aria-valuemax="100" aria-label="${i("days_progress",t)}">
          <div class="days-progress-fill${d?" overflow":""}" style="width:${r}%;background:${_}"></div>
        </div>
        <div class="days-progress-text">${je(e.days_until_due,t)}</div>
      </div>
    `}_renderObjectDetail(){if(!this._selectedEntryId)return c;let e=this._getObject(this._selectedEntryId);if(!e)return l`<p>Object not found.</p>`;let t=e.object,a=this._lang,s=this._isOperator;return l`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${t.name}</h2>
          <div class="action-buttons">
            ${s?c:l`
              <ha-button appearance="plain" @click=${()=>{this.shadowRoot.querySelector("maintenance-object-dialog")?.openEdit(e.entry_id,t)}}>${i("edit",a)}</ha-button>
              <ha-button appearance="filled" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate(e.entry_id)}}>${i("add_task",a)}</ha-button>
              <ha-button variant="danger" appearance="plain" @click=${()=>this._deleteObject(e.entry_id)}>${i("delete",a)}</ha-button>
            `}
            <ha-button appearance="plain" @click=${()=>this._openQrForObject(e.entry_id,t.name)}><ha-icon icon="mdi:qrcode"></ha-icon> ${i("qr_code",a)}</ha-button>
          </div>
        </div>
        ${t.manufacturer||t.model?l`<p class="meta">${[t.manufacturer,t.model].filter(Boolean).join(" ")}</p>`:c}
        ${t.serial_number?l`<p class="meta">${i("serial_number_label",a)}: ${t.serial_number}</p>`:c}
        ${t.installation_date?l`<p class="meta">${i("installed",a)}: ${ae(t.installation_date,a)}</p>`:c}

        <h3>${i("tasks",a)} (${e.tasks.length})</h3>
        ${e.tasks.length===0?l`<div class="empty-state-centered">
              <p class="empty">${i("no_tasks_yet",a)}</p>
              <ha-button appearance="filled" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate(e.entry_id)}}>${i("add_first_task",a)}</ha-button>
            </div>`:[...e.tasks].sort((r,d)=>{let _={overdue:0,triggered:1,due_soon:2,ok:3};return(_[r.status]??9)-(_[d.status]??9)||(r.days_until_due??99999)-(d.days_until_due??99999)}).map(r=>l`
              <div class="task-row${r.enabled?"":" task-disabled"}">
                <span class="status-badge ${r.status}">${i(r.status,a)}</span>
                ${r.enabled?c:l`<span class="badge-disabled">${i("disabled",a)}</span>`}
                ${r.nfc_tag_id?l`<span class="nfc-badge" title="${i("nfc_linked",a)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:c}
                <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,r.id)}>${r.name}</span>
                ${this._renderUserBadge(r)}
                <span class="cell type">${i(r.type,a)}</span>
                <span class="due-cell" @click=${()=>this._showTask(e.entry_id,r.id)}>
                  <span class="due-text">${je(r.days_until_due,a)}</span>
                  ${r.trigger_config?this._renderTriggerProgress(r):c}
                  ${this._renderMiniSparkline(r)}
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${i("complete",a)}" @click=${d=>{d.stopPropagation(),this._openCompleteDialog(e.entry_id,r.id,r.name,this._features.checklists?r.checklist:void 0,this._features.adaptive&&!!r.adaptive_config?.enabled)}}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${i("skip",a)}" .disabled=${this._actionLoading} @click=${d=>{d.stopPropagation(),this._promptSkipTask(e.entry_id,r.id)}}>
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </mwc-icon-button>
                </span>
              </div>
            `)}
      </div>
    `}_renderTaskHeader(e){let t=this._lang,s=this._getObject(this._selectedEntryId)?.object.name||"",r=this._isOperator,d=e.status==="due_soon"?"warning":e.status||"ok",_=i(e.status||"ok",t);return l`
      <div class="task-header">
        <div class="task-header-title">
          <span class="task-name-breadcrumb" @click=${()=>this._view="task"}>${e.name}</span>
          <span class="breadcrumb-separator">·</span>
          <span class="object-name-breadcrumb" @click=${()=>this._showObject(this._selectedEntryId)}>${s}</span>
          <span class="status-chip ${d}">${_}</span>
          ${this._renderUserBadge(e)}
          ${e.nfc_tag_id?l`<span class="nfc-badge" title="${i("nfc_tag_id",t)}: ${e.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:r?c:l`<span class="nfc-badge unlinked" title="${i("nfc_link_hint",t)}"
                @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,e)}}>
                <ha-icon icon="mdi:nfc-variant"></ha-icon>
              </span>`}
        </div>
        <div class="task-header-actions">
          <ha-button appearance="filled" @click=${()=>this._openCompleteDialog(this._selectedEntryId,this._selectedTaskId,e.name,this._features.checklists?e.checklist:void 0,this._features.adaptive&&!!e.adaptive_config?.enabled)}>${i("complete",t)}</ha-button>
          <ha-button appearance="plain" .disabled=${this._actionLoading} @click=${()=>this._promptSkipTask(this._selectedEntryId,this._selectedTaskId)}>${i("skip",t)}</ha-button>
          <ha-button appearance="plain" @click=${()=>{let p=this._getObject(this._selectedEntryId)?.object;this._openQrForTask(this._selectedEntryId,this._selectedTaskId,p?.name||"",e.name)}}><ha-icon icon="mdi:qrcode"></ha-icon> ${i("qr_code",t)}</ha-button>
          ${r?c:l`
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${this._toggleMoreMenu}></ha-icon-button>
              ${this._moreMenuOpen?l`
                <div class="popup-menu" @click=${p=>p.stopPropagation()}>
                  <div class="popup-menu-item" @click=${()=>{this._closeMoreMenu(),this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,e)}}>${i("edit",t)}</div>
                  <div class="popup-menu-item" @click=${()=>{this._closeMoreMenu(),this._promptResetTask(this._selectedEntryId,this._selectedTaskId)}}>${i("reset",t)}</div>
                  <div class="popup-menu-divider"></div>
                  <div class="popup-menu-item danger" @click=${()=>{this._closeMoreMenu(),this._deleteTask(this._selectedEntryId,this._selectedTaskId)}}>${i("delete",t)}</div>
                </div>
              `:c}
            </div>
          `}
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
          ${i("overview",e)}
        </div>
        <div class="tab ${this._activeTab==="history"?"active":""}" @click=${()=>this._activeTab="history"}>
          ${i("history",e)}
        </div>
      </div>
    `}_renderTabContent(e){switch(this._activeTab){case"overview":return this._renderOverviewTab(e);case"history":return this._renderHistoryTab(e);default:return c}}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,isCounterEntity:e=>this._isCounterEntity(e),tooltip:this._sparklineTooltip,setTooltip:e=>{this._sparklineTooltip=e}}}_renderOverviewTab(e){let t=this._lang,a=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,s=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1,r=a||s,d=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,_=this._features.seasonal&&(e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12);return l`
      <div class="tab-content overview-tab">
        ${this._renderKPIBar(e)}
        ${this._renderTaskMeta(e)}
        ${this._renderDaysProgress(e)}
        ${wt(e,this._sparklineCtx)}
        ${$t(e,t,this._features)}
        <div class="two-column-layout ${r?"":"single-column"}">
          ${r?l`
            <div class="left-column">
              ${this._renderRecommendationCard(e)}
              ${jt(e,t,this._features)}
            </div>
          `:c}
          <div class="right-column">
            ${At(e,t,this._costDurationToggle,p=>{this._costDurationToggle=p})}
          </div>
        </div>
        ${d?zt(e,t):c}
        ${_?l`
          ${St(e,t)}
          <div class="seasonal-actions">
            <ha-button appearance="plain" @click=${()=>this._openSeasonalOverrides(e)}>
              ${i("edit_seasonal_overrides",t)}
            </ha-button>
          </div>
        `:c}
        ${this._renderChecklistCard(e)}
        ${this._renderRecentActivities(e)}
      </div>
    `}_renderChecklistCard(e){if(!this._features.checklists)return c;let t=e.checklist||[];if(t.length===0)return c;let a=this._lang;return l`
      <div class="checklist-preview-card">
        <div class="checklist-preview-header">
          <ha-icon icon="mdi:format-list-checks"></ha-icon>
          <span>${i("checklist",a)} (${t.length})</span>
        </div>
        <ol class="checklist-preview-list">
          ${t.map(s=>l`<li>${s}</li>`)}
        </ol>
      </div>
    `}_renderHistoryTab(e){let t=this._lang;return l`
      <div class="tab-content history-tab">
        ${this._renderHistoryFilters(e)}
        ${this._renderHistoryList(e)}
      </div>
    `}_renderTaskMeta(e){let t=e.documentation_url&&/^https?:\/\//i.test(e.documentation_url)?e.documentation_url:null;if(!e.notes&&!t)return c;let a=this._lang;return l`
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
            <a href="${t}" target="_blank" rel="noopener noreferrer">${i("documentation_label",a)}</a>
          </div>
        `:c}
      </div>
    `}_renderKPIBar(e){let t=this._lang,a=e.times_performed>0?e.total_cost/e.times_performed:0,s=e.days_until_due!==null&&e.days_until_due!==void 0?e.days_until_due<0?"overdue":e.days_until_due<=e.warning_days?"warning":"":"";return l`
      <div class="kpi-bar">
        <div class="kpi-card">
          <div class="kpi-label">${i("next_due",t)}</div>
          <div class="kpi-value">${e.next_due?ae(e.next_due,t):"\u2014"}</div>
          ${this._features.schedule_time&&e.schedule_time?l`<div class="kpi-subtext">${i("at_time",t)} ${e.schedule_time}</div>`:c}
        </div>
        <div class="kpi-card ${s}">
          <div class="kpi-label">${i("days_until_due",t)}</div>
          <div class="kpi-value-large">${e.days_until_due!==null&&e.days_until_due!==void 0?e.days_until_due:"\u2014"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${i("interval",t)}</div>
          <div class="kpi-value">${e.interval_days!=null?`${e.interval_days} ${i("days",t)}`:"\u2014"}</div>
          ${this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days?l`
            <div class="kpi-subtext">${i("recommended",t)}: ${e.suggested_interval}${e.interval_analysis?.confidence_interval_low!=null?` (${e.interval_analysis.confidence_interval_low}\u2013${e.interval_analysis.confidence_interval_high})`:""}</div>
          `:c}
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${i("warning",t)}</div>
          <div class="kpi-value">${e.warning_days} ${i("days",t)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${i("last_performed",t)}</div>
          <div class="kpi-value">${e.last_performed?ae(e.last_performed,t):"\u2014"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${i("avg_cost",t)}</div>
          <div class="kpi-value">${a.toFixed(0)} ${this._budget?.currency_symbol||"\u20AC"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${i("avg_duration",t)}</div>
          <div class="kpi-value">${e.average_duration?e.average_duration.toFixed(0):"\u2014"} min</div>
        </div>
      </div>
    `}_renderRecommendationCard(e){let t=this._lang;if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return c;if(this._selectedEntryId&&this._selectedTaskId&&this._dismissedSuggestions.has(`${this._selectedEntryId}_${this._selectedTaskId}`))return c;let a=e.interval_days,s=e.suggested_interval,r=e.interval_confidence||"medium",d=Math.max(a||1,s);return l`
      <div class="recommendation-card">
        <h4>${i("suggested_interval",t)}</h4>
        <div class="interval-comparison">
          <div class="interval-bar">
            <div class="interval-label">${i("current",t)||"Aktuell"}: ${a??"\u2014"} ${a!=null?i("days",t):""}</div>
            <div class="interval-visual current" style="width: ${a!=null?Math.min(a/d*100,100):0}%"></div>
          </div>
          <div class="interval-bar">
            <div class="interval-label">${i("recommended",t)}: ${s} ${i("days",t)}
              <span class="confidence-badge ${r}">${i(`confidence_${r}`,t)}</span>
            </div>
            <div class="interval-visual suggested" style="width: ${Math.min(s/d*100,100)}%"></div>
          </div>
        </div>
        <div class="recommendation-actions">
          <ha-button appearance="filled" @click=${()=>this._applySuggestion(this._selectedEntryId,this._selectedTaskId,s)}>
            ${i("apply_suggestion",t)}
          </ha-button>
          <ha-button appearance="plain" @click=${()=>this._reanalyzeInterval(this._selectedEntryId,this._selectedTaskId)}>
            ${i("reanalyze",t)}
          </ha-button>
          <ha-button appearance="plain" @click=${()=>this._dismissSuggestion(this._selectedEntryId,this._selectedTaskId)}>
            ${i("dismiss_suggestion",t)}
          </ha-button>
        </div>
      </div>
    `}_renderRecentActivities(e){let t=this._lang,a=e.history.slice(-3).reverse();if(a.length===0)return c;let s=r=>{switch(r){case"completed":return"\u2713";case"triggered":return"\u2297";case"skipped":return"\u21B7";case"reset":return"\u21BA";default:return"\xB7"}};return l`
      <div class="recent-activities">
        <h3>${i("recent_activities",t)}</h3>
        ${a.map(r=>l`
          <div class="activity-item">
            <span class="activity-icon">${s(r.type)}</span>
            <span class="activity-date">${Ve(r.timestamp,t)}</span>
            <span class="activity-note">${r.notes||"\u2014"}</span>
            ${r.cost?l`<span class="activity-badge">${r.cost.toFixed(0)}${this._budget?.currency_symbol||"\u20AC"}</span>`:c}
            ${r.duration?l`<span class="activity-badge">${r.duration}min</span>`:c}
          </div>
        `)}
        <div class="activity-show-all">
          <ha-button appearance="plain" @click=${()=>this._activeTab="history"}>${i("show_all",t)} →</ha-button>
        </div>
      </div>
    `}_renderHistoryFilters(e){let t=this._lang;return l`
      <div class="history-filters-new">
        <div class="filter-chips">
          ${["completed","skipped","reset","triggered"].map(a=>{let s=e.history.filter(r=>r.type===a).length;return s===0?c:l`
              <span class="filter-chip ${this._historyFilter===a?"active":""}"
                @click=${()=>{this._historyFilter=this._historyFilter===a?null:a}}>
                ${i(a,t)} (${s})
              </span>
            `})}
          ${this._historyFilter?l`<span class="filter-chip clear" @click=${()=>{this._historyFilter=null}}>${i("show_all",t)}</span>`:c}
        </div>
        <div class="filter-controls">
          <input type="text" class="search-input" placeholder="${i("search_notes",t)}..." .value=${this._historySearch} @input=${a=>this._historySearch=a.target.value} />
        </div>
      </div>
    `}_renderHistoryList(e){let t=this._lang,a=this._historyFilter?e.history.filter(s=>s.type===this._historyFilter):e.history;if(this._historySearch){let s=this._historySearch.toLowerCase();a=a.filter(r=>r.notes?.toLowerCase().includes(s))}return a.length===0?l`<p class="empty">${i("no_history",t)}</p>`:l`
      <div class="history-timeline">
        ${[...a].reverse().map(s=>this._renderHistoryEntry(s))}
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
          <ha-icon .icon=${gt[e.type]||"mdi:circle"}></ha-icon>
        </div>
        <div class="history-content">
          <div><strong>${i(e.type,t)}</strong></div>
          <div class="history-date">${Ve(e.timestamp,t)}</div>
          ${e.notes?l`<div>${e.notes}</div>`:c}
          <div class="history-details">
            ${e.cost!=null?l`<span>${i("cost",t)}: ${e.cost.toFixed(2)} ${this._budget?.currency_symbol||"\u20AC"}</span>`:c}
            ${e.duration!=null?l`<span>${i("duration",t)}: ${e.duration} min</span>`:c}
            ${e.trigger_value!=null?l`<span>${i("trigger_val",t)}: ${e.trigger_value}</span>`:c}
          </div>
        </div>
      </div>
    `}};z.styles=[mt,vt],u([$({attribute:!1})],z.prototype,"hass",2),u([$({type:Boolean,reflect:!0})],z.prototype,"narrow",2),u([$({attribute:!1})],z.prototype,"panel",2),u([g()],z.prototype,"_objects",2),u([g()],z.prototype,"_stats",2),u([g()],z.prototype,"_view",2),u([g()],z.prototype,"_selectedEntryId",2),u([g()],z.prototype,"_selectedTaskId",2),u([g()],z.prototype,"_filterStatus",2),u([g()],z.prototype,"_filterUser",2),u([g()],z.prototype,"_unsub",2),u([g()],z.prototype,"_sparklineTooltip",2),u([g()],z.prototype,"_historyFilter",2),u([g()],z.prototype,"_budget",2),u([g()],z.prototype,"_groups",2),u([g()],z.prototype,"_detailStatsData",2),u([g()],z.prototype,"_miniStatsData",2),u([g()],z.prototype,"_features",2),u([g()],z.prototype,"_adminPanelUserIds",2),u([g()],z.prototype,"_defaultWarningDays",2),u([g()],z.prototype,"_actionLoading",2),u([g()],z.prototype,"_moreMenuOpen",2),u([g()],z.prototype,"_toastMessage",2),u([g()],z.prototype,"_overviewTab",2),u([g()],z.prototype,"_activeTab",2),u([g()],z.prototype,"_costDurationToggle",2),u([g()],z.prototype,"_historySearch",2),u([g()],z.prototype,"_sortMode",2),u([g()],z.prototype,"_objectSortMode",2),u([g()],z.prototype,"_groupByMode",2),z=u([ut("maintenance-supporter-panel")],z);export{z as MaintenanceSupporterPanel};
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
lit-html/directive.js:
lit-html/directives/unsafe-html.js:
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
