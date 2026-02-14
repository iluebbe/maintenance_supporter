var ft=Object.defineProperty;var bt=Object.getOwnPropertyDescriptor;var g=(l,r,e,t)=>{for(var i=t>1?void 0:t?bt(r,e):r,a=l.length-1,s;a>=0;a--)(s=l[a])&&(i=(t?s(r,e,i):s(i))||i);return t&&i&&ft(r,e,i),i};var ue=globalThis,ge=ue.ShadowRoot&&(ue.ShadyCSS===void 0||ue.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Te=Symbol(),Ne=new WeakMap,se=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==Te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(ge&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=Ne.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&Ne.set(e,r))}return r}toString(){return this.cssText}},Oe=l=>new se(typeof l=="string"?l:l+"",void 0,Te),O=(l,...r)=>{let e=l.length===1?l[0]:r.reduce((t,i,a)=>t+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+l[a+1],l[0]);return new se(e,l,Te)},Ve=(l,r)=>{if(ge)l.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),i=ue.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,l.appendChild(t)}},Se=ge?l=>l:l=>l instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return Oe(e)})(l):l;var{is:yt,defineProperty:xt,getOwnPropertyDescriptor:$t,getOwnPropertyNames:wt,getOwnPropertySymbols:kt,getPrototypeOf:At}=Object,_e=globalThis,qe=_e.trustedTypes,Tt=qe?qe.emptyScript:"",St=_e.reactiveElementPolyfillSupport,ne=(l,r)=>l,oe={toAttribute(l,r){switch(r){case Boolean:l=l?Tt:null;break;case Object:case Array:l=l==null?l:JSON.stringify(l)}return l},fromAttribute(l,r){let e=l;switch(r){case Boolean:e=l!==null;break;case Number:e=l===null?null:Number(l);break;case Object:case Array:try{e=JSON.parse(l)}catch{e=null}}return e}},ve=(l,r)=>!yt(l,r),Be={attribute:!0,type:String,converter:oe,reflect:!1,useDefault:!1,hasChanged:ve};Symbol.metadata??=Symbol("metadata"),_e.litPropertyMetadata??=new WeakMap;var q=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=Be){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(r,t,e);i!==void 0&&xt(this.prototype,r,i)}}static getPropertyDescriptor(r,e,t){let{get:i,set:a}=$t(this.prototype,r)??{get(){return this[e]},set(s){this[e]=s}};return{get:i,set(s){let p=i?.call(this);a?.call(this,s),this.requestUpdate(r,p,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??Be}static _$Ei(){if(this.hasOwnProperty(ne("elementProperties")))return;let r=At(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(ne("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ne("properties"))){let e=this.properties,t=[...wt(e),...kt(e)];for(let i of t)this.createProperty(i,e[i])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let i of t)e.unshift(Se(i))}else r!==void 0&&e.push(Se(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ve(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),i=this.constructor._$Eu(r,t);if(i!==void 0&&t.reflect===!0){let a=(t.converter?.toAttribute!==void 0?t.converter:oe).toAttribute(e,t.type);this._$Em=r,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(r,e){let t=this.constructor,i=t._$Eh.get(r);if(i!==void 0&&this._$Em!==i){let a=t.getPropertyOptions(i),s=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:oe;this._$Em=i;let p=s.fromAttribute(e,a.type);this[i]=p??this._$Ej?.get(i)??p,this._$Em=null}}requestUpdate(r,e,t,i=!1,a){if(r!==void 0){let s=this.constructor;if(i===!1&&(a=this[r]),t??=s.getPropertyOptions(r),!((t.hasChanged??ve)(a,e)||t.useDefault&&t.reflect&&a===this._$Ej?.get(r)&&!this.hasAttribute(s._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:i,wrapped:a},s){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,s??e??this[r]),a!==!0||s!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),i===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,a]of t){let{wrapped:s}=a,p=this[i];s!==!0||this._$AL.has(i)||p===void 0||this.C(i,void 0,a,p)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};q.elementStyles=[],q.shadowRootOptions={mode:"open"},q[ne("elementProperties")]=new Map,q[ne("finalized")]=new Map,St?.({ReactiveElement:q}),(_e.reactiveElementVersions??=[]).push("2.1.2");var Pe=globalThis,We=l=>l,me=Pe.trustedTypes,Ke=me?me.createPolicy("lit-html",{createHTML:l=>l}):void 0,Qe="$lit$",K=`lit$${Math.random().toFixed(9).slice(2)}$`,et="?"+K,Et=`<${et}>`,X=document,ce=()=>X.createComment(""),de=l=>l===null||typeof l!="object"&&typeof l!="function",je=Array.isArray,Mt=l=>je(l)||typeof l?.[Symbol.iterator]=="function",Ee=`[ 	
\f\r]`,le=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ze=/-->/g,Ye=/>/g,G=RegExp(`>|${Ee}(?:([^\\s"'>=/]+)(${Ee}*=${Ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ge=/'/g,Je=/"/g,tt=/^(?:script|style|textarea|title)$/i,Fe=l=>(r,...e)=>({_$litType$:l,strings:r,values:e}),o=Fe(1),H=Fe(2),Xt=Fe(3),Q=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),Xe=new WeakMap,J=X.createTreeWalker(X,129);function it(l,r){if(!je(l)||!l.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ke!==void 0?Ke.createHTML(r):r}var Ct=(l,r)=>{let e=l.length-1,t=[],i,a=r===2?"<svg>":r===3?"<math>":"",s=le;for(let p=0;p<e;p++){let d=l[p],_,h,v=-1,f=0;for(;f<d.length&&(s.lastIndex=f,h=s.exec(d),h!==null);)f=s.lastIndex,s===le?h[1]==="!--"?s=Ze:h[1]!==void 0?s=Ye:h[2]!==void 0?(tt.test(h[2])&&(i=RegExp("</"+h[2],"g")),s=G):h[3]!==void 0&&(s=G):s===G?h[0]===">"?(s=i??le,v=-1):h[1]===void 0?v=-2:(v=s.lastIndex-h[2].length,_=h[1],s=h[3]===void 0?G:h[3]==='"'?Je:Ge):s===Je||s===Ge?s=G:s===Ze||s===Ye?s=le:(s=G,i=void 0);let x=s===G&&l[p+1].startsWith("/>")?" ":"";a+=s===le?d+Et:v>=0?(t.push(_),d.slice(0,v)+Qe+d.slice(v)+K+x):d+K+(v===-2?p:x)}return[it(l,a+(l[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},pe=class l{constructor({strings:r,_$litType$:e},t){let i;this.parts=[];let a=0,s=0,p=r.length-1,d=this.parts,[_,h]=Ct(r,e);if(this.el=l.createElement(_,t),J.currentNode=this.el.content,e===2||e===3){let v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(i=J.nextNode())!==null&&d.length<p;){if(i.nodeType===1){if(i.hasAttributes())for(let v of i.getAttributeNames())if(v.endsWith(Qe)){let f=h[s++],x=i.getAttribute(v).split(K),$=/([.?@])?(.*)/.exec(f);d.push({type:1,index:a,name:$[2],strings:x,ctor:$[1]==="."?Ce:$[1]==="?"?Le:$[1]==="@"?De:ie}),i.removeAttribute(v)}else v.startsWith(K)&&(d.push({type:6,index:a}),i.removeAttribute(v));if(tt.test(i.tagName)){let v=i.textContent.split(K),f=v.length-1;if(f>0){i.textContent=me?me.emptyScript:"";for(let x=0;x<f;x++)i.append(v[x],ce()),J.nextNode(),d.push({type:2,index:++a});i.append(v[f],ce())}}}else if(i.nodeType===8)if(i.data===et)d.push({type:2,index:a});else{let v=-1;for(;(v=i.data.indexOf(K,v+1))!==-1;)d.push({type:7,index:a}),v+=K.length-1}a++}}static createElement(r,e){let t=X.createElement("template");return t.innerHTML=r,t}};function te(l,r,e=l,t){if(r===Q)return r;let i=t!==void 0?e._$Co?.[t]:e._$Cl,a=de(r)?void 0:r._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(l),i._$AT(l,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(r=te(l,i._$AS(l,r.values),i,t)),r}var Me=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,i=(r?.creationScope??X).importNode(e,!0);J.currentNode=i;let a=J.nextNode(),s=0,p=0,d=t[0];for(;d!==void 0;){if(s===d.index){let _;d.type===2?_=new he(a,a.nextSibling,this,r):d.type===1?_=new d.ctor(a,d.name,d.strings,this,r):d.type===6&&(_=new He(a,this,r)),this._$AV.push(_),d=t[++p]}s!==d?.index&&(a=J.nextNode(),s++)}return J.currentNode=X,i}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},he=class l{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=te(this,r,e),de(r)?r===c||r==null||r===""?(this._$AH!==c&&this._$AR(),this._$AH=c):r!==this._$AH&&r!==Q&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Mt(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==c&&de(this._$AH)?this._$AA.nextSibling.data=r:this.T(X.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,i=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=pe.createElement(it(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let a=new Me(i,this),s=a.u(this.options);a.p(e),this.T(s),this._$AH=a}}_$AC(r){let e=Xe.get(r.strings);return e===void 0&&Xe.set(r.strings,e=new pe(r)),e}k(r){je(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let a of r)i===e.length?e.push(t=new l(this.O(ce()),this.O(ce()),this,this.options)):t=e[i],t._$AI(a),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=We(r).nextSibling;We(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},ie=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,i,a){this.type=1,this._$AH=c,this._$AN=void 0,this.element=r,this.name=e,this._$AM=i,this.options=a,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=c}_$AI(r,e=this,t,i){let a=this.strings,s=!1;if(a===void 0)r=te(this,r,e,0),s=!de(r)||r!==this._$AH&&r!==Q,s&&(this._$AH=r);else{let p=r,d,_;for(r=a[0],d=0;d<a.length-1;d++)_=te(this,p[t+d],e,d),_===Q&&(_=this._$AH[d]),s||=!de(_)||_!==this._$AH[d],_===c?r=c:r!==c&&(r+=(_??"")+a[d+1]),this._$AH[d]=_}s&&!i&&this.j(r)}j(r){r===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},Ce=class extends ie{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===c?void 0:r}},Le=class extends ie{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==c)}},De=class extends ie{constructor(r,e,t,i,a){super(r,e,t,i,a),this.type=5}_$AI(r,e=this){if((r=te(this,r,e,0)??c)===Q)return;let t=this._$AH,i=r===c&&t!==c||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,a=r!==c&&(t===c||i);i&&this.element.removeEventListener(this.name,this,t),a&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},He=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){te(this,r)}};var Lt=Pe.litHtmlPolyfillSupport;Lt?.(pe,he),(Pe.litHtmlVersions??=[]).push("3.3.2");var rt=(l,r,e)=>{let t=e?.renderBefore??r,i=t._$litPart$;if(i===void 0){let a=e?.renderBefore??null;t._$litPart$=i=new he(r.insertBefore(ce(),a),a,void 0,e??{})}return i._$AI(l),i};var Ie=globalThis,I=class extends q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=rt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Q}};I._$litElement$=!0,I.finalized=!0,Ie.litElementHydrateSupport?.({LitElement:I});var Dt=Ie.litElementPolyfillSupport;Dt?.({LitElement:I});(Ie.litElementVersions??=[]).push("4.2.2");var re=l=>(r,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(l,r)}):customElements.define(l,r)};var Ht={attribute:!0,type:String,converter:oe,reflect:!1,hasChanged:ve},Pt=(l=Ht,r,e)=>{let{kind:t,metadata:i}=e,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),t==="setter"&&((l=Object.create(l)).wrapped=!0),a.set(e.name,l),t==="accessor"){let{name:s}=e;return{set(p){let d=r.get.call(this);r.set.call(this,p),this.requestUpdate(s,d,l,!0,p)},init(p){return p!==void 0&&this.C(s,void 0,l,p),p}}}if(t==="setter"){let{name:s}=e;return function(p){let d=this[s];r.call(this,p),this.requestUpdate(s,d,l,!0,p)}}throw Error("Unsupported decorator location: "+t)};function z(l){return(r,e)=>typeof e=="object"?Pt(l,r,e):((t,i,a)=>{let s=i.hasOwnProperty(a);return i.constructor.createProperty(a,t),s?Object.getOwnPropertyDescriptor(i,a):void 0})(l,r,e)}function m(l){return z({...l,state:!0,attribute:!1})}var be={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"#ff5722"},st={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",completed:"mdi:check-circle",skipped:"mdi:skip-next",reset:"mdi:refresh"};var jt={maintenance:"Wartung",objects:"Objekte",tasks:"Aufgaben",overdue:"\xDCberf\xE4llig",due_soon:"Bald f\xE4llig",triggered:"Ausgel\xF6st",ok:"OK",all:"Alle",new_object:"+ Neues Objekt",edit:"Bearbeiten",delete:"L\xF6schen",add_task:"+ Aufgabe",complete:"Erledigt",skip:"\xDCberspringen",reset:"Zur\xFCcksetzen",cancel:"Abbrechen",completing:"Wird erledigt\u2026",type:"Typ",schedule:"Planung",interval:"Intervall",warning:"Vorwarnung",last_performed:"Zuletzt durchgef\xFChrt",next_due:"N\xE4chste F\xE4lligkeit",days_until_due:"Tage bis f\xE4llig",times_performed:"Durchf\xFChrungen",total_cost:"Gesamtkosten",avg_duration:"\xD8 Dauer",trigger:"Trigger",entity:"Entit\xE4t",attribute:"Attribut",trigger_type:"Trigger-Typ",active:"Aktiv",yes:"Ja",no:"Nein",current_value:"Aktueller Wert",threshold_above:"Obergrenze",threshold_below:"Untergrenze",threshold:"Schwellwert",counter:"Z\xE4hler",state_change:"Zustands\xE4nderung",target_value:"Zielwert",baseline:"Nulllinie",target_changes:"Ziel-\xC4nderungen",entity_min:"Minimum",entity_max:"Maximum",for_minutes:"F\xFCr (Minuten)",time_based:"Zeitbasiert",sensor_based:"Sensorbasiert",manual:"Manuell",cleaning:"Reinigung",inspection:"Inspektion",replacement:"Austausch",calibration:"Kalibrierung",service:"Service",custom:"Benutzerdefiniert",history:"Verlauf",notes:"Notizen",documentation:"Dokumentation",cost:"Kosten",duration:"Dauer",both:"Beides",trigger_val:"Trigger-Wert",complete_title:"Erledigt: ",checklist:"Checkliste",notes_optional:"Notizen (optional)",cost_optional:"Kosten (optional)",duration_minutes:"Dauer in Minuten (optional)",days:"Tage",day:"Tag",today:"Heute",d_overdue:"T \xFCberf\xE4llig",no_tasks:"Keine Wartungsaufgaben vorhanden. Erstellen Sie ein Objekt um zu beginnen.",no_tasks_short:"Keine Aufgaben",no_history:"Noch keine Verlaufseintr\xE4ge.",show_all:"Alle anzeigen",cost_duration_chart:"Kosten & Dauer",installed:"Installiert",confirm_delete_object:"Dieses Objekt und alle zugeh\xF6rigen Aufgaben l\xF6schen?",confirm_delete_task:"Diese Aufgabe wirklich l\xF6schen?",value_history:"Wertverlauf",min:"Min",max:"Max",save:"Speichern",saving:"Speichern\u2026",edit_task:"Aufgabe bearbeiten",new_task:"Neue Wartungsaufgabe",task_name:"Aufgabenname",maintenance_type:"Wartungstyp",schedule_type:"Planungsart",interval_days:"Intervall (Tage)",warning_days:"Warntage",edit_object:"Objekt bearbeiten",name:"Name",manufacturer_optional:"Hersteller (optional)",model_optional:"Modell (optional)",trigger_configuration:"Trigger-Konfiguration",entity_id:"Entit\xE4ts-ID",attribute_optional:"Attribut (optional, leer = Zustand)",trigger_above:"Ausl\xF6sen wenn \xFCber",trigger_below:"Ausl\xF6sen wenn unter",for_at_least_minutes:"F\xFCr mindestens (Minuten)",safety_interval_days:"Sicherheitsintervall (Tage, optional)",delta_mode:"Delta-Modus",from_state_optional:"Von Zustand (optional)",to_state_optional:"Zu Zustand (optional)",documentation_url_optional:"Dokumentation URL (optional)",responsible_user:"Verantwortlicher Benutzer",no_user_assigned:"(Kein Benutzer zugewiesen)",all_users:"Alle Benutzer",my_tasks:"Meine Aufgaben",budget_monthly:"Monatsbudget",budget_yearly:"Jahresbudget",export_csv:"CSV Export",import_csv:"CSV Import",groups:"Gruppen",no_groups:"Keine Gruppen definiert.",group_tasks:"Aufgaben",loading_chart:"Daten werden geladen...",was_maintenance_needed:"War diese Wartung n\xF6tig?",feedback_needed:"N\xF6tig",feedback_not_needed:"Nicht n\xF6tig",feedback_not_sure:"Unsicher",suggested_interval:"Empfohlenes Intervall",apply_suggestion:"\xDCbernehmen",dismiss_suggestion:"Verwerfen",adaptive_scheduling:"Adaptive Planung",confidence_low:"Niedrig",confidence_medium:"Mittel",confidence_high:"Hoch",confidence:"Konfidenz",recommended:"empfohlen",seasonal_awareness:"Saisonale Anpassung",seasonal_factor:"Saisonfaktor",seasonal_chart_title:"Saisonale Faktoren",seasonal_learned:"Gelernt",seasonal_manual:"Manuell",seasonal_insufficient_data:"Nicht genug Daten",month_jan:"Jan",month_feb:"Feb",month_mar:"M\xE4r",month_apr:"Apr",month_may:"Mai",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dez",hemisphere_north:"N\xF6rdlich",hemisphere_south:"S\xFCdlich",seasonal_factor_short:"Saison",sensor_prediction:"Sensorvorhersage",degradation_trend:"Trend",trend_rising:"Steigend",trend_falling:"Fallend",trend_stable:"Stabil",trend_insufficient_data:"Unzureichende Daten",days_until_threshold:"Tage bis Schwellwert",threshold_exceeded:"Schwellwert \xFCberschritten",environmental_adjustment:"Umgebungsfaktor",sensor_prediction_urgency:"Sensor prognostiziert Schwellwert in ~{days} Tagen",day_short:"Tag",prediction_projection:"Projektion",weibull_reliability_curve:"Zuverl\xE4ssigkeitskurve",weibull_failure_probability:"Ausfallwahrscheinlichkeit",weibull_reliability:"Zuverl\xE4ssigkeit",weibull_beta_param:"Form \u03B2",weibull_eta_param:"Skala \u03B7",weibull_r_squared:"G\xFCte R\xB2",beta_early_failures:"Fr\xFChausf\xE4lle",beta_random_failures:"Zuf\xE4llige Ausf\xE4lle",beta_wear_out:"Verschlei\xDF",beta_highly_predictable:"Hochvorhersagbar",confidence_interval:"Konfidenzintervall",confidence_conservative:"Konservativ",confidence_aggressive:"Optimistisch",current_interval_marker:"Aktuelles Intervall",recommended_marker:"Empfohlen",reliability_at_current:"Zuverl\xE4ssigkeit bei aktuellem Intervall",characteristic_life:"Charakteristische Lebensdauer",chart_mini_sparkline:"Trend-Sparkline",chart_history:"Kosten- und Dauer-Verlauf",chart_seasonal:"Saisonfaktoren, 12 Monate",chart_weibull:"Weibull-Zuverl\xE4ssigkeitskurve",chart_sparkline:"Sensor-Triggerwert-Verlauf",days_progress:"Tagesfortschritt",qr_code:"QR-Code",qr_generating:"QR-Code wird generiert\u2026",qr_error:"QR-Code konnte nicht generiert werden.",qr_print:"Drucken",qr_download:"SVG herunterladen",qr_action:"Aktion beim Scannen",qr_action_view:"Wartungsinfo anzeigen",qr_action_complete:"Wartung als erledigt markieren",overview:"\xDCbersicht",analysis:"Analyse",recent_activities:"Letzte Aktivit\xE4ten",search_notes:"Notizen durchsuchen",avg_cost:"\xD8 Kosten",no_advanced_features:"Keine erweiterten Funktionen aktiviert",analysis_not_enough_data:"Noch nicht gen\xFCgend Daten f\xFCr die Analyse vorhanden.",analysis_not_enough_data_hint:"Die Weibull-Analyse ben\xF6tigt mindestens 5 abgeschlossene Wartungen, saisonale Muster werden nach 6+ Datenpunkten pro Monat sichtbar.",analysis_manual_task_hint:"Manuelle Aufgaben ohne Intervall erzeugen keine Analysedaten.",current:"Aktuell",shorter:"K\xFCrzer",longer:"L\xE4nger",normal:"Normal"},Ft={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",ok:"OK",all:"All",new_object:"+ New Object",edit:"Edit",delete:"Delete",add_task:"+ Add Task",complete:"Complete",skip:"Skip",reset:"Reset",cancel:"Cancel",completing:"Completing\u2026",type:"Type",schedule:"Schedule",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",times_performed:"Times performed",total_cost:"Total cost",avg_duration:"Avg duration",trigger:"Trigger",entity:"Entity",attribute:"Attribute",trigger_type:"Trigger type",active:"Active",yes:"Yes",no:"No",current_value:"Current value",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",entity_min:"Minimum",entity_max:"Maximum",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",custom:"Custom",history:"History",notes:"Notes",documentation:"Documentation",cost:"Cost",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",value_history:"Value history",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",attribute_optional:"Attribute (optional, blank = state)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",responsible_user:"Responsible User",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",export_csv:"CSV Export",import_csv:"CSV Import",groups:"Groups",no_groups:"No groups defined.",group_tasks:"Tasks",loading_chart:"Loading chart data...",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",dismiss_suggestion:"Dismiss",adaptive_scheduling:"Adaptive Scheduling",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",confidence:"Confidence",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",seasonal_factor:"Seasonal factor",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",seasonal_insufficient_data:"Insufficient data",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",hemisphere_north:"Northern",hemisphere_south:"Southern",seasonal_factor_short:"Season",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",prediction_projection:"Projection",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_reliability:"Reliability",weibull_beta_param:"Shape \u03B2",weibull_eta_param:"Scale \u03B7",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",reliability_at_current:"Reliability at current interval",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal"},at={de:jt,en:Ft};function n(l,r){let e=(r||"en").substring(0,2).toLowerCase();return at[e]?.[l]??at.en[l]??l}function ee(l,r){if(!l)return"\u2014";try{let e=(r||"de").startsWith("de")?"de-DE":"en-US";return new Date(l).toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return l}}function Re(l,r){if(!l)return"\u2014";try{let e=(r||"de").startsWith("de")?"de-DE":"en-US",t=new Date(l);return t.toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}catch{return l}}function ye(l,r){if(l==null)return"\u2014";let e=r||"en";return l<0?`${Math.abs(l)} ${n("d_overdue",e)}`:l===0?n("today",e):`${l} ${n(l===1?"day":"days",e)}`}var nt=O`
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
`;var xe=class{constructor(r){this._cache=new Map;this._pending=new Map;this._hass=r}updateHass(r){this._hass=r}async getDetailStats(r,e){return this._getStats(r,"hour",30,e)}async getMiniStats(r,e){return this._getStats(r,"day",14,e)}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(r,e,t,i){let a=`${r}:${e}`,s=this._cache.get(a);if(s&&Date.now()-s.fetchedAt<3e5)return s.points;if(this._pending.has(a))return this._pending.get(a);let p=this._fetchAndNormalize(r,e,t,i,a);this._pending.set(a,p);try{return await p}finally{this._pending.delete(a)}}async _fetchAndNormalize(r,e,t,i,a){let s=new Date(Date.now()-t*24*60*60*1e3).toISOString(),p=i?["state","sum","change"]:["mean","min","max"];try{let _=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:s,statistic_ids:[r],period:e,types:p}))[r]||[],h=[];for(let v of _){let f=null;if(i?f=v.state??null:f=v.mean??null,f===null)continue;let x={ts:v.start,val:f};i||(v.min!=null&&(x.min=v.min),v.max!=null&&(x.max=v.max)),h.push(x)}return h.sort((v,f)=>v.ts-f.ts),this._cache.set(a,{entityId:r,fetchedAt:Date.now(),period:e,points:h}),h}catch(d){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${r}:`,d),[]}}};var ae=class{constructor(r){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=r}async getUsers(r=!1){let e=Date.now();if(!r&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(r,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:r,task_id:e,user_id:t})}async getTasksByUser(r){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:r})).tasks}getUserName(r){return!r||!this.usersCache?null:this.usersCache.find(t=>t.id===r)?.name||null}getUser(r){return!r||!this.usersCache?null:this.usersCache.find(e=>e.id===r)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(r){return r?r===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};var N=class extends I{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._name="";this._manufacturer="";this._model="";this._entryId=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._open=!0}async _save(){if(this._name.trim()){this._loading=!0;try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}finally{this._loading=!1}}}_close(){this._open=!1}render(){if(!this._open)return o``;let e=this._lang,t=this._entryId?n("edit_object",e):n("new_object",e);return o`
      <ha-dialog open @closed=${this._close} .heading=${t}>
        <div class="content">
          <ha-textfield
            label="${n("name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${n("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${i=>this._manufacturer=i.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${n("model_optional",e)}"
            .value=${this._model}
            @input=${i=>this._model=i.target.value}
          ></ha-textfield>
        </div>
        <ha-button slot="secondaryAction" appearance="plain" @click=${this._close}>
          ${n("cancel",this._lang)}
        </ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._save}
          .disabled=${this._loading||!this._name.trim()}
        >
          ${this._loading?n("saving",this._lang):n("save",this._lang)}
        </ha-button>
      </ha-dialog>
    `}};N.styles=O`
    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
    }
    ha-textfield {
      display: block;
    }
  `,g([z({attribute:!1})],N.prototype,"hass",2),g([m()],N.prototype,"_open",2),g([m()],N.prototype,"_loading",2),g([m()],N.prototype,"_name",2),g([m()],N.prototype,"_manufacturer",2),g([m()],N.prototype,"_model",2),g([m()],N.prototype,"_entryId",2),N=g([re("maintenance-object-dialog")],N);var It=["cleaning","inspection","replacement","calibration","service","custom"],Rt=["time_based","sensor_based","manual"],zt=["threshold","counter","state_change"],k=class extends I{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._entryId="";this._taskId=null;this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._warningDays="7";this._notes="";this._documentationUrl="";this._triggerEntityId="";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._responsibleUserId=null;this._availableUsers=[];this._userService=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}async openCreate(e){this._entryId=e,this._taskId=null,this._resetFields(),await this._loadUsers(),this._open=!0}async openEdit(e,t){if(this._entryId=e,this._taskId=t.id,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days?.toString()||"30",this._warningDays=t.warning_days.toString(),this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._responsibleUserId=t.responsible_user_id||null,t.trigger_config){let i=t.trigger_config;this._triggerEntityId=i.entity_id||"",this._triggerAttribute=i.attribute||"",this._triggerType=i.type||"threshold",this._triggerAbove=i.trigger_above?.toString()||"",this._triggerBelow=i.trigger_below?.toString()||"",this._triggerForMinutes=i.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=i.trigger_target_value?.toString()||"",this._triggerDeltaMode=i.trigger_delta_mode||!1,this._triggerFromState=i.trigger_from_state||"",this._triggerToState=i.trigger_to_state||"",this._triggerTargetChanges=i.trigger_target_changes?.toString()||""}else this._resetTriggerFields();await this._loadUsers(),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._warningDays="7",this._notes="",this._documentationUrl="",this._responsibleUserId=null,this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerAttribute="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges=""}async _loadUsers(){this._userService||(this._userService=new ae(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}async _save(){if(this._name.trim()){this._loading=!0;try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:parseInt(this._warningDays,10)||7};if(this._taskId&&(e.task_id=this._taskId),this._scheduleType!=="manual"&&this._intervalDays&&(e.interval_days=parseInt(this._intervalDays,10)),this._notes&&(e.notes=this._notes),this._documentationUrl&&(e.documentation_url=this._documentationUrl),this._responsibleUserId&&(e.responsible_user_id=this._responsibleUserId),this._scheduleType==="sensor_based"&&this._triggerEntityId){let t={entity_id:this._triggerEntityId,type:this._triggerType};this._triggerAttribute&&(t.attribute=this._triggerAttribute),this._triggerType==="threshold"?(this._triggerAbove&&(t.trigger_above=parseFloat(this._triggerAbove)),this._triggerBelow&&(t.trigger_below=parseFloat(this._triggerBelow)),this._triggerForMinutes&&(t.trigger_for_minutes=parseInt(this._triggerForMinutes,10))):this._triggerType==="counter"?(this._triggerTargetValue&&(t.trigger_target_value=parseFloat(this._triggerTargetValue)),t.trigger_delta_mode=this._triggerDeltaMode):this._triggerType==="state_change"&&(this._triggerFromState&&(t.trigger_from_state=this._triggerFromState),this._triggerToState&&(t.trigger_to_state=this._triggerToState),this._triggerTargetChanges&&(t.trigger_target_changes=parseInt(this._triggerTargetChanges,10))),e.trigger_config=t}await this.hass.connection.sendMessagePromise(e),this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}}}_close(){this._open=!1}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return c;let e=this._lang;return o`
      <h3>${n("trigger_configuration",e)}</h3>
      <ha-textfield
        label="${n("entity_id",e)}"
        .value=${this._triggerEntityId}
        @input=${t=>this._triggerEntityId=t.target.value}
      ></ha-textfield>
      <ha-textfield
        label="${n("attribute_optional",e)}"
        .value=${this._triggerAttribute}
        @input=${t=>this._triggerAttribute=t.target.value}
      ></ha-textfield>
      <div class="select-row">
        <label>${n("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${t=>this._triggerType=t.target.value}
        >
          ${zt.map(t=>o`<option value=${t}>${n(t,e)}</option>`)}
        </select>
      </div>
      ${this._renderTriggerTypeFields()}
      <ha-textfield
        label="${n("safety_interval_days",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${t=>this._intervalDays=t.target.value}
      ></ha-textfield>
    `}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?o`
        <ha-textfield
          label="${n("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${t=>this._triggerAbove=t.target.value}
        ></ha-textfield>
        <ha-textfield
          label="${n("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${t=>this._triggerBelow=t.target.value}
        ></ha-textfield>
        <ha-textfield
          label="${n("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ha-textfield>
      `:this._triggerType==="counter"?o`
        <ha-textfield
          label="${n("target_value",e)}"
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
          ${n("delta_mode",e)}
        </label>
      `:this._triggerType==="state_change"?o`
        <ha-textfield
          label="${n("from_state_optional",e)}"
          .value=${this._triggerFromState}
          @input=${t=>this._triggerFromState=t.target.value}
        ></ha-textfield>
        <ha-textfield
          label="${n("to_state_optional",e)}"
          .value=${this._triggerToState}
          @input=${t=>this._triggerToState=t.target.value}
        ></ha-textfield>
        <ha-textfield
          label="${n("target_changes",e)}"
          type="number"
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ha-textfield>
      `:c}render(){if(!this._open)return o``;let e=this._lang,t=this._taskId?n("edit_task",e):n("new_task",e);return o`
      <ha-dialog open @closed=${this._close} .heading=${t}>
        <div class="content">
          <ha-textfield
            label="${n("task_name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ha-textfield>
          <div class="select-row">
            <label>${n("maintenance_type",e)}</label>
            <select
              .value=${this._type}
              @change=${i=>this._type=i.target.value}
            >
              ${It.map(i=>o`<option value=${i}>${n(i,e)}</option>`)}
            </select>
          </div>
          <div class="select-row">
            <label>${n("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${i=>this._scheduleType=i.target.value}
            >
              ${Rt.map(i=>o`<option value=${i}>${n(i,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?o`
                <ha-textfield
                  label="${n("interval_days",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${i=>this._intervalDays=i.target.value}
                ></ha-textfield>
              `:c}
          <ha-textfield
            label="${n("warning_days",e)}"
            type="number"
            .value=${this._warningDays}
            @input=${i=>this._warningDays=i.target.value}
          ></ha-textfield>
          <div class="select-row">
            <label>${n("responsible_user",e)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${i=>{let a=i.target.value;this._responsibleUserId=a||null}}
            >
              <option value="">${n("no_user_assigned",e)}</option>
              ${this._availableUsers.map(i=>o`<option value=${i.id}>${i.name}</option>`)}
            </select>
          </div>
          ${this._renderTriggerFields()}
          <ha-textfield
            label="${n("notes_optional",e)}"
            .value=${this._notes}
            @input=${i=>this._notes=i.target.value}
          ></ha-textfield>
          <ha-textfield
            label="${n("documentation_url_optional",e)}"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ha-textfield>
        </div>
        <ha-button slot="secondaryAction" appearance="plain" @click=${this._close}>${n("cancel",e)}</ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this._save}
          .disabled=${this._loading||!this._name.trim()}
        >
          ${this._loading?n("saving",e):n("save",e)}
        </ha-button>
      </ha-dialog>
    `}};k.styles=O`
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
  `,g([z({attribute:!1})],k.prototype,"hass",2),g([m()],k.prototype,"_open",2),g([m()],k.prototype,"_loading",2),g([m()],k.prototype,"_entryId",2),g([m()],k.prototype,"_taskId",2),g([m()],k.prototype,"_name",2),g([m()],k.prototype,"_type",2),g([m()],k.prototype,"_scheduleType",2),g([m()],k.prototype,"_intervalDays",2),g([m()],k.prototype,"_warningDays",2),g([m()],k.prototype,"_notes",2),g([m()],k.prototype,"_documentationUrl",2),g([m()],k.prototype,"_triggerEntityId",2),g([m()],k.prototype,"_triggerAttribute",2),g([m()],k.prototype,"_triggerType",2),g([m()],k.prototype,"_triggerAbove",2),g([m()],k.prototype,"_triggerBelow",2),g([m()],k.prototype,"_triggerForMinutes",2),g([m()],k.prototype,"_triggerTargetValue",2),g([m()],k.prototype,"_triggerDeltaMode",2),g([m()],k.prototype,"_triggerFromState",2),g([m()],k.prototype,"_triggerToState",2),g([m()],k.prototype,"_triggerTargetChanges",2),g([m()],k.prototype,"_responsibleUserId",2),g([m()],k.prototype,"_availableUsers",2),k=g([re("maintenance-task-dialog")],k);var V=class extends I{constructor(){super(...arguments);this.lang="de";this._open=!1;this._loading=!1;this._error="";this._result=null;this._action="view";this._entryId="";this._taskId=null;this._objectName="";this._taskName=""}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._action="view",this._error="",this._result=null,this._open=!0,this._generate()}openForTask(e,t,i,a){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=a,this._action="view",this._error="",this._result=null,this._open=!0,this._generate()}async _generate(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,action:this._action};this._taskId&&(e.task_id=this._taskId);let t=await this.hass.connection.sendMessagePromise(e);this._result=t}catch{this._error=n("qr_error",this.lang)}finally{this._loading=!1}}_onActionChange(e){this._action=e.target.value,this._generate()}_print(){if(!this._result)return;let e=this._result,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),a=window.open("","_blank","width=400,height=500");a&&(a.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
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
</body></html>`),a.document.close())}_download(){if(!this._result)return;let e=decodeURIComponent(this._result.svg_data_uri.replace("data:image/svg+xml,","")),t=new Blob([e],{type:"image/svg+xml"}),i=URL.createObjectURL(t),a=document.createElement("a");a.href=i;let s=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;a.download=`qr-${s.replace(/\s+/g,"-").toLowerCase()}.svg`,a.click(),URL.revokeObjectURL(i)}_close(){this._open=!1}render(){if(!this._open)return o``;let e=this.lang||this.hass?.language||"de",t=this._taskName?`${n("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${n("qr_code",e)}: ${this._objectName}`;return o`
      <ha-dialog open @closed=${this._close} .heading=${t}>
        <div class="content">
          ${this._loading?o`<div class="loading">${n("qr_generating",e)}</div>`:this._error?o`<div class="error">${this._error}</div>`:this._result?o`
                    <img
                      class="qr-image"
                      src="${this._result.svg_data_uri}"
                      alt="QR Code"
                    />
                    <div class="url-display">${this._result.url}</div>
                  `:c}
          ${this._taskId?o`
                <div class="action-row">
                  <label>${n("qr_action",e)}</label>
                  <select @change=${this._onActionChange} .value=${this._action}>
                    <option value="view">${n("qr_action_view",e)}</option>
                    <option value="complete">${n("qr_action_complete",e)}</option>
                  </select>
                </div>
              `:c}
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
    `}static{this.styles=O`
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
  `}};g([z({attribute:!1})],V.prototype,"hass",2),g([z()],V.prototype,"lang",2),g([m()],V.prototype,"_open",2),g([m()],V.prototype,"_loading",2),g([m()],V.prototype,"_error",2),g([m()],V.prototype,"_result",2),g([m()],V.prototype,"_action",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",V);var Ut=60,Nt=20,Ot=300,Vt=140,qt=300,Bt=200,ot=30,Wt=27,A=class extends I{constructor(){super(...arguments);this.narrow=!1;this.panel={};this._objects=[];this._stats=null;this._view="overview";this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._filterUser=null;this._unsub=null;this._sparklineTooltip=null;this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1};this._activeTab="overview";this._costDurationToggle="both";this._historyTimeRange=12;this._historySearch="";this._statsService=null;this._userService=null;this._deepLinkHandled=!1;this._onDialogEvent=async()=>{await this._loadData()}}get _lang(){return this.hass?.language||"de"}connectedCallback(){super.connectedCallback(),this._loadData(),this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub&&(this._unsub(),this._unsub=null),this._statsService?.clearCache(),this._statsService=null}updated(e){super.updated(e),e.has("hass")&&this.hass&&(this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new xe(this.hass),this._fetchMiniStatsForOverview()),this._userService||(this._userService=new ae(this.hass),this._userService.getUsers()))}async _loadData(){let[e,t,i,a,s]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null)]);this._objects=e.objects,this._stats=t,i&&(this._budget=i),a&&(this._groups=a.groups||{}),s&&(this._features=s.features),this._fetchMiniStatsForOverview(),this._handleDeepLink()}_handleDeepLink(){if(this._deepLinkHandled)return;let e=new URLSearchParams(window.location.search),t=e.get("entry_id");if(!t)return;this._deepLinkHandled=!0;let i=e.get("task_id"),a=e.get("action"),s=window.location.pathname+window.location.hash;history.replaceState(null,"",s),i?(this._showTask(t,i),a==="complete"&&requestAnimationFrame(()=>{let d=this._getObject(t)?.tasks.find(_=>_.id===i);d&&this._openCompleteDialog(t,i,d.name,this._features.checklists?d.checklist:void 0,this._features.adaptive&&!!d.adaptive_config?.enabled)})):this._showObject(t)}_isCounterEntity(e){if(!e)return!1;let t=e.type||"threshold";return t==="counter"||t==="state_change"}async _fetchDetailStats(e,t){if(!this._statsService)return;let i=await this._statsService.getDetailStats(e,t),a=new Map(this._detailStatsData);a.set(e,i),this._detailStatsData=a}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let e=new Map(this._miniStatsData),t=[];for(let i of this._objects)for(let a of i.tasks){let s=a.trigger_config?.entity_id;if(!s)continue;let p=this._isCounterEntity(a.trigger_config);t.push(this._statsService.getMiniStats(s,p).then(d=>{e.set(s,d)}))}t.length>0&&(await Promise.all(t),this._miniStatsData=e)}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(e=>{let t=e;this._objects=t.objects},{type:"maintenance_supporter/subscribe"})}catch{}}get _taskRows(){let e=[];for(let i of this._objects)for(let a of i.tasks)if(!(this._filterStatus&&a.status!==this._filterStatus)){if(this._filterUser){let s=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(a.responsible_user_id!==s)continue}e.push({entry_id:i.entry_id,task_id:a.id,object_name:i.object.name,task_name:a.name,type:a.type,schedule_type:a.schedule_type,status:a.status,days_until_due:a.days_until_due??null,next_due:a.next_due??null,trigger_active:a.trigger_active,trigger_current_value:a.trigger_current_value??null,trigger_current_delta:a.trigger_current_delta??null,trigger_config:a.trigger_config??null,trigger_entity_info:a.trigger_entity_info??null,times_performed:a.times_performed,total_cost:a.total_cost,interval_days:a.interval_days??null,history:a.history||[]})}let t={overdue:0,triggered:1,due_soon:2,ok:3};return e.sort((i,a)=>(t[i.status]??9)-(t[a.status]??9)),e}_getObject(e){return this._objects.find(t=>t.entry_id===e)}_getTask(e,t){return this._getObject(e)?.tasks.find(a=>a.id===t)}_showOverview(){this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null}_showObject(e){this._view="object",this._selectedEntryId=e,this._selectedTaskId=null}_showTask(e,t){this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._historyFilter=null;let i=this._getTask(e,t);if(i?.trigger_config?.entity_id){let a=i.trigger_config.entity_id,s=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(a,s)}}async _deleteObject(e){confirm(n("confirm_delete_object",this._lang))&&(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:e}),this._showOverview(),await this._loadData())}async _deleteTask(e,t){confirm(n("confirm_delete_task",this._lang))&&(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/delete",entry_id:e,task_id:t}),this._showObject(e),await this._loadData())}async _skipTask(e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/skip",entry_id:e,task_id:t}),await this._loadData()}async _resetTask(e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/reset",entry_id:e,task_id:t}),await this._loadData()}async _applySuggestion(e,t,i){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/apply_suggestion",entry_id:e,task_id:t,interval:i}),await this._loadData()}_dismissSuggestion(){this._loadData()}_openCompleteDialog(e,t,i,a,s){let p=this.shadowRoot.querySelector("maintenance-complete-dialog");p&&(p.entryId=e,p.taskId=t,p.taskName=i,p.lang=this._lang,p.checklist=a||[],p.adaptiveEnabled=!!s,p.open())}_openQrForObject(e,t){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForObject(e,t)}_openQrForTask(e,t,i,a){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForTask(e,t,i,a)}async _exportCsv(){let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/export"}),t=new Blob([e.csv],{type:"text/csv;charset=utf-8;"}),i=URL.createObjectURL(t),a=document.createElement("a");a.href=i,a.download="maintenance_export.csv",a.click(),URL.revokeObjectURL(i)}_triggerImportCsv(){let e=this.shadowRoot.querySelector("input[type=file]");e&&(e.value="",e.click())}async _handleCsvFile(e){let i=e.target.files?.[0];if(!i)return;let a=await i.text(),s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/import",csv_content:a});await this._loadData(),alert(`Imported ${s.created} of ${s.total} objects.`)}render(){return o`
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
    `}_renderHeader(){let e=[{label:n("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let i=this._getTask(this._selectedEntryId,this._selectedTaskId);e.push({label:i?.name||"Task"})}return o`
      <div class="header">
        <div class="breadcrumbs">
          ${e.map((t,i)=>o`
              ${i>0?o`<span class="sep">/</span>`:c}
              ${t.action?o`<a @click=${t.action}>${t.label}</a>`:o`<span class="current">${t.label}</span>`}
            `)}
        </div>
      </div>
    `}_renderOverview(){let e=this._stats,t=this._taskRows,i=this._lang;return o`
      ${e?o`
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
          `:c}

      ${this._features.budget?this._renderBudgetBar():c}

      <div class="filter-bar">
        <select
          @change=${a=>this._filterStatus=a.target.value}
        >
          <option value="">${n("all",i)}</option>
          <option value="overdue">${n("overdue",i)}</option>
          <option value="due_soon">${n("due_soon",i)}</option>
          <option value="triggered">${n("triggered",i)}</option>
          <option value="ok">${n("ok",i)}</option>
        </select>
        <select
          .value=${this._filterUser||""}
          @change=${a=>{let s=a.target.value;this._filterUser=s||null}}
        >
          <option value="">${n("all_users",i)}</option>
          <option value="current_user">${n("my_tasks",i)}</option>
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

      ${t.length===0?o`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${n("no_tasks",i)}</p>
            </div>
          `:o`
            <div class="task-table">
              ${t.map(a=>this._renderOverviewRow(a))}
            </div>
          `}

      ${this._features.groups?this._renderGroupsSection():c}
    `}_renderGroupsSection(){let e=Object.entries(this._groups);if(e.length===0)return c;let t=this._lang;return o`
      <div class="groups-section">
        <h3>${n("groups",t)}</h3>
        <div class="groups-grid">
          ${e.map(([i,a])=>{let s=a.task_refs.map(p=>this._getTask(p.entry_id,p.task_id)?.name||p.task_id);return o`
              <div class="group-card">
                <div class="group-card-name">${a.name}</div>
                ${a.description?o`<div class="group-card-desc">${a.description}</div>`:c}
                <div class="group-card-tasks">
                  ${s.length>0?s.map(p=>o`<span class="group-task-chip">${p}</span>`):o`<span style="font-size:12px;color:var(--secondary-text-color)">${n("no_tasks_short",t)}</span>`}
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_renderBudgetBar(){let e=this._budget;if(!e)return c;let t=this._lang,i=[];return e.monthly_budget>0&&i.push({label:n("budget_monthly",t),spent:e.monthly_spent,budget:e.monthly_budget}),e.yearly_budget>0&&i.push({label:n("budget_yearly",t),spent:e.yearly_spent,budget:e.yearly_budget}),i.length===0?c:o`
      <div class="budget-bars">
        ${i.map(a=>{let s=Math.min(100,Math.max(0,a.spent/a.budget*100)),p=s>=100?"var(--error-color, #f44336)":s>=e.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return o`
            <div class="budget-item">
              <div class="budget-label">
                <span>${a.label}</span>
                <span>${a.spent.toFixed(2)} / ${a.budget.toFixed(2)}</span>
              </div>
              <div class="budget-bar">
                <div class="budget-bar-fill" style="width:${s}%; background:${p}"></div>
              </div>
            </div>
          `})}
      </div>
    `}_renderOverviewRow(e){let t=this._lang,i=e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0,a=0,s=be.ok,p=!1;if(i&&e.days_until_due!==null){let d=(e.interval_days-e.days_until_due)/e.interval_days*100;a=Math.max(0,Math.min(100,d)),p=d>100,e.status==="overdue"?s=be.overdue:e.status==="due_soon"&&(s=be.due_soon)}return o`
      <div class="task-row">
        <span class="status-badge ${e.status}">${n(e.status,t)}</span>
        <span class="cell object-name" @click=${d=>{d.stopPropagation(),this._showObject(e.entry_id)}}>${e.object_name}</span>
        <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,e.task_id)}>${e.task_name}</span>
        <span class="cell type">${n(e.type,t)}</span>
        <span class="due-cell" @click=${()=>this._showTask(e.entry_id,e.task_id)}>
          <span class="due-text">${ye(e.days_until_due,t)}</span>
          ${i?o`<div class="days-bar"><div class="days-bar-fill${p?" overflow":""}" style="width:${a}%;background:${s}"></div></div>`:c}
          ${e.trigger_config?this._renderTriggerProgress(e):!i&&e.trigger_active?o`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:c}
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
    `}_renderTriggerProgress(e){let t=e.trigger_config??null;if(!t)return c;let i=t.type||"threshold",a=e.trigger_entity_info?.unit_of_measurement??"",s=0,p="";if(i==="threshold"){let h=e.trigger_current_value??null;if(h==null)return c;let v=t.trigger_above,f=t.trigger_below;if(v!=null){let x=f??0,$=v-x||1;s=Math.min(100,Math.max(0,(h-x)/$*100)),p=`${h.toFixed(1)} / ${v} ${a}`}else if(f!=null){let $=e.trigger_entity_info?.max??(h*2||100),M=$-f||1;s=Math.min(100,Math.max(0,($-h)/M*100)),p=`${h.toFixed(1)} / ${f} ${a}`}else return c}else if(i==="counter"){let h=t.trigger_target_value||1,f=e.trigger_current_delta??null??e.trigger_current_value??null;if(f==null)return c;s=Math.min(100,Math.max(0,f/h*100)),p=`${f.toFixed(1)} / ${h} ${a}`}else if(i==="state_change"){let h=t.trigger_target_changes||1,v=e.trigger_current_value??null;if(v==null)return c;s=Math.min(100,Math.max(0,v/h*100)),p=`${Math.round(v)} / ${h}`}else return c;let d=s>=100,_=s>90?"var(--error-color, #f44336)":s>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return o`
      <div class="trigger-progress">
        <div class="trigger-progress-bar">
          <div class="trigger-progress-fill${d?" overflow":""}" style="width:${s}%;background:${_}"></div>
        </div>
        <span class="trigger-progress-label">${p}</span>
      </div>
    `}_renderMiniSparkline(e){if(!e.trigger_config?.entity_id)return c;let t=e.trigger_config.entity_id,i=this._miniStatsData.get(t)||[],a=[];if(i.length>=2)a=i.map(b=>({ts:b.ts,val:b.val}));else{if(!e.history)return c;for(let b of e.history)b.trigger_value!=null&&a.push({ts:new Date(b.timestamp).getTime(),val:b.trigger_value})}if(e.trigger_current_value!=null&&a.push({ts:Date.now(),val:e.trigger_current_value}),a.length<2)return c;a.sort((b,T)=>b.ts-T.ts);let s=Ut,p=Nt,d=a.map(b=>b.val),_=Math.min(...d),h=Math.max(...d),v=h-_||1;_-=v*.1,h+=v*.1;let f=a[0].ts,$=a[a.length-1].ts-f||1,M=b=>(b-f)/$*s,C=b=>2+(1-(b-_)/(h-_))*(p-4),S=a;if(S.length>ot){let b=Math.ceil(S.length/ot);S=S.filter((T,y)=>y%b===0||y===S.length-1)}let F=S.map(b=>`${M(b.ts).toFixed(1)},${C(b.val).toFixed(1)}`).join(" ");return o`
      <svg class="mini-sparkline" viewBox="0 0 ${s} ${p}" preserveAspectRatio="none" role="img" aria-label="${n("chart_mini_sparkline",this._lang)}">
        <polyline points="${F}" fill="none" stroke="var(--primary-color)" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
    `}_renderDaysProgress(e){let t=this._lang;if(e.days_until_due==null||!e.interval_days||e.interval_days<=0)return c;let a=(e.interval_days-e.days_until_due)/e.interval_days*100,s=Math.max(0,Math.min(100,a)),p=a>100,d="var(--success-color, #4caf50)";return e.status==="overdue"?d="var(--error-color, #f44336)":e.status==="due_soon"&&(d="var(--warning-color, #ff9800)"),o`
      <div class="days-progress">
        <div class="days-progress-labels">
          <span>${e.last_performed?`${n("last_performed",t)}: ${ee(e.last_performed,t)}`:""}</span>
          <span>${e.next_due?`${n("next_due",t)}: ${ee(e.next_due,t)}`:""}</span>
        </div>
        <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(s)}" aria-valuemin="0" aria-valuemax="100" aria-label="${n("days_progress",t)}">
          <div class="days-progress-fill${p?" overflow":""}" style="width:${s}%;background:${d}"></div>
        </div>
        <div class="days-progress-text">${ye(e.days_until_due,t)}</div>
      </div>
    `}_renderObjectDetail(){if(!this._selectedEntryId)return c;let e=this._getObject(this._selectedEntryId);if(!e)return o`<p>Object not found.</p>`;let t=e.object,i=this._lang;return o`
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
        ${t.manufacturer||t.model?o`<p class="meta">${[t.manufacturer,t.model].filter(Boolean).join(" ")}</p>`:c}
        ${t.installation_date?o`<p class="meta">${n("installed",i)}: ${ee(t.installation_date,i)}</p>`:c}

        <h3>${n("tasks",i)} (${e.tasks.length})</h3>
        ${e.tasks.length===0?o`<p class="empty">${n("no_tasks_short",i)}</p>`:e.tasks.map(a=>o`
              <div class="task-row">
                <span class="status-badge ${a.status}">${n(a.status,i)}</span>
                <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,a.id)}>${a.name}</span>
                ${this._renderUserBadge(a)}
                <span class="cell type">${n(a.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(e.entry_id,a.id)}>
                  <span class="due-text">${ye(a.days_until_due,i)}</span>
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${n("complete",i)}" @click=${s=>{s.stopPropagation(),this._openCompleteDialog(e.entry_id,a.id,a.name)}}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${n("skip",i)}" @click=${s=>{s.stopPropagation(),this._skipTask(e.entry_id,a.id)}}>
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </mwc-icon-button>
                </span>
              </div>
            `)}
      </div>
    `}_renderTaskHeader(e){let t=this._lang,a=this._getObject(this._selectedEntryId)?.object.name||"",s="ok",p="OK";return e.days_until_due!==null&&e.days_until_due!==void 0&&(e.days_until_due<0?(s="overdue",p=n("overdue",t)):e.days_until_due<=e.warning_days&&(s="warning",p=n("due_soon",t))),o`
      <div class="task-header">
        <div class="task-header-title">
          <span class="task-name-breadcrumb" @click=${()=>this._view="task"}>${e.name}</span>
          <span class="breadcrumb-separator">·</span>
          <span class="object-name-breadcrumb" @click=${()=>this._showObject(this._selectedEntryId)}>${a}</span>
          <span class="status-chip ${s}">${p}</span>
          ${this._renderUserBadge(e)}
        </div>
        <div class="task-header-actions">
          <ha-button appearance="filled" @click=${()=>this._openCompleteDialog(this._selectedEntryId,this._selectedTaskId,e.name,this._features.checklists?e.checklist:void 0,this._features.adaptive&&!!e.adaptive_config?.enabled)}>${n("complete",t)}</ha-button>
          <ha-button appearance="plain" @click=${()=>this._skipTask(this._selectedEntryId,this._selectedTaskId)}>${n("skip",t)}</ha-button>
          <ha-button appearance="plain" class="more-menu-btn">
            ⋯
            <div class="dropdown-menu">
              <div class="menu-item" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,e)}}>${n("edit",t)}</div>
              <div class="menu-item" @click=${()=>this._resetTask(this._selectedEntryId,this._selectedTaskId)}>${n("reset",t)}</div>
              <div class="menu-item" @click=${()=>{let d=this._getObject(this._selectedEntryId)?.object;this._openQrForTask(this._selectedEntryId,this._selectedTaskId,d?.name||"",e.name)}}><ha-icon icon="mdi:qrcode"></ha-icon> ${n("qr_code",t)}</div>
              <div class="menu-item danger" @click=${()=>this._deleteTask(this._selectedEntryId,this._selectedTaskId)}>${n("delete",t)}</div>
            </div>
          </ha-button>
        </div>
      </div>
    `}_renderUserBadge(e){if(!e.responsible_user_id||!this._userService)return c;let t=this._userService.getUserName(e.responsible_user_id);return t?o`
      <span class="user-badge">
        <ha-icon icon="mdi:account"></ha-icon>
        ${t}
      </span>
    `:c}_renderTabBar(){let e=this._lang;return o`
      <div class="tab-bar">
        <div class="tab ${this._activeTab==="overview"?"active":""}" @click=${()=>this._activeTab="overview"}>
          ${n("overview",e)}
        </div>
        <div class="tab ${this._activeTab==="analysis"?"active":""}" @click=${()=>this._activeTab="analysis"}>
          ${n("analysis",e)}
        </div>
        <div class="tab ${this._activeTab==="history"?"active":""}" @click=${()=>this._activeTab="history"}>
          ${n("history",e)}
        </div>
      </div>
    `}_renderTabContent(e){switch(this._activeTab){case"overview":return this._renderOverviewTab(e);case"analysis":return this._renderAnalysisTab(e);case"history":return this._renderHistoryTab(e);default:return c}}_renderOverviewTab(e){let t=this._lang,i=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,a=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1,s=i||a;return o`
      <div class="tab-content overview-tab">
        ${this._renderKPIBar(e)}
        <div class="two-column-layout ${s?"":"single-column"}">
          ${s?o`
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
    `}_renderAnalysisTab(e){let t=this._lang;if(!(this._features.adaptive||this._features.seasonal))return o`
        <div class="tab-content analysis-tab">
          <p class="empty">${n("no_advanced_features",t)}</p>
        </div>
      `;let a=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,s=this._features.seasonal&&(e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12);if(!(a||s)){let d=e.schedule_type==="manual",_=e.interval_analysis?.data_points??0;return o`
        <div class="tab-content analysis-tab">
          <div class="analysis-empty-state">
            <p class="empty">${n("analysis_not_enough_data",t)}</p>
            <p class="empty-hint">
              ${d?n("analysis_manual_task_hint",t):n("analysis_not_enough_data_hint",t)}
            </p>
            ${!d&&_>0?o`
              <p class="empty-hint">${_} / 5</p>
            `:c}
          </div>
        </div>
      `}return o`
      <div class="tab-content analysis-tab">
        ${this._features.adaptive?this._renderWeibullCardExpanded(e):c}
        ${this._features.seasonal?this._renderSeasonalCardExpanded(e):c}
      </div>
    `}_renderHistoryTab(e){let t=this._lang;return o`
      <div class="tab-content history-tab">
        ${this._renderHistoryFilters(e)}
        ${this._renderHistoryList(e)}
      </div>
    `}_renderKPIBar(e){let t=this._lang,i=e.times_performed>0?e.total_cost/e.times_performed:0,a=e.days_until_due!==null&&e.days_until_due!==void 0?e.days_until_due<0?"overdue":e.days_until_due<=e.warning_days?"warning":"":"";return o`
      <div class="kpi-bar">
        <div class="kpi-card">
          <div class="kpi-label">${n("next_due",t)}</div>
          <div class="kpi-value">${e.next_due?ee(e.next_due,t):"\u2014"}</div>
        </div>
        <div class="kpi-card ${a}">
          <div class="kpi-label">${n("days_until_due",t)}</div>
          <div class="kpi-value-large">${e.days_until_due!==null&&e.days_until_due!==void 0?e.days_until_due:"\u2014"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${n("interval",t)}</div>
          <div class="kpi-value">${e.interval_days} ${n("days",t)}</div>
          ${this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days?o`
            <div class="kpi-subtext">${n("recommended",t)}: ${e.suggested_interval}${e.interval_analysis?.confidence_interval_low!=null?` (${e.interval_analysis.confidence_interval_low}\u2013${e.interval_analysis.confidence_interval_high})`:""}</div>
          `:c}
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${n("warning",t)}</div>
          <div class="kpi-value">${e.warning_days} ${n("days",t)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${n("last_performed",t)}</div>
          <div class="kpi-value">${e.last_performed?ee(e.last_performed,t):"\u2014"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${n("avg_cost",t)}</div>
          <div class="kpi-value">${i.toFixed(0)} €</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${n("avg_duration",t)}</div>
          <div class="kpi-value">${e.average_duration?e.average_duration.toFixed(0):"\u2014"} min</div>
        </div>
      </div>
    `}_renderRecommendationCard(e){let t=this._lang;if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return c;let i=e.interval_days,a=e.suggested_interval,s=e.interval_confidence||"medium";return o`
      <div class="recommendation-card">
        <h4>${n("suggested_interval",t)}</h4>
        <div class="interval-comparison">
          <div class="interval-bar">
            <div class="interval-label">${n("current",t)||"Aktuell"}: ${i} ${n("days",t)}</div>
            <div class="interval-visual current" style="width: ${Math.min(i/a*100,100)}%"></div>
          </div>
          <div class="interval-bar">
            <div class="interval-label">${n("recommended",t)}: ${a} ${n("days",t)}
              <span class="confidence-badge ${s}">${n(`confidence_${s}`,t)}</span>
            </div>
            <div class="interval-visual suggested" style="width: 100%"></div>
          </div>
        </div>
        <div class="recommendation-actions">
          <ha-button appearance="filled" @click=${()=>this._applySuggestion(this._selectedEntryId,this._selectedTaskId,a)}>
            ${n("apply_suggestion",t)}
          </ha-button>
          <ha-button appearance="plain" @click=${()=>this._dismissSuggestion()}>
            ${n("dismiss_suggestion",t)}
          </ha-button>
        </div>
      </div>
    `}_renderSeasonalCardCompact(e){let t=this._lang;if(!this._features.seasonal||!e.seasonal_factor||e.seasonal_factor===1)return c;let i=["Jan","Feb","M\xE4r","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],a=new Date().getMonth(),s=i.map((p,d)=>{let _=e.seasonal_factor||1,h=Math.sin((d-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,_+h))});return o`
      <div class="seasonal-card-compact">
        <h4>${n("seasonal_awareness",t)}</h4>
        <div class="seasonal-mini-chart">
          ${s.map((p,d)=>{let _=p*40,h=p<.9?"low":p>1.1?"high":"normal";return o`
              <div class="seasonal-bar ${h} ${d===a?"current":""}"
                   style="height: ${_}px"
                   title="${i[d]}: ${p.toFixed(2)}x">
              </div>
            `})}
        </div>
        <div class="seasonal-legend">
          <span class="legend-item"><span class="dot low"></span> ${n("shorter",t)||"K\xFCrzer"}</span>
          <span class="legend-item"><span class="dot normal"></span> ${n("normal",t)||"Normal"}</span>
          <span class="legend-item"><span class="dot high"></span> ${n("longer",t)||"L\xE4nger"}</span>
        </div>
      </div>
    `}_renderCostDurationCard(e){let t=this._lang;return o`
      <div class="cost-duration-card">
        <div class="card-header">
          <h3>${n("cost_duration_chart",t)}</h3>
          <div class="toggle-buttons">
            <button
              class="toggle-btn ${this._costDurationToggle==="cost"?"active":""}"
              @click=${()=>this._costDurationToggle="cost"}>
              ${n("cost",t)}
            </button>
            <button
              class="toggle-btn ${this._costDurationToggle==="both"?"active":""}"
              @click=${()=>this._costDurationToggle="both"}>
              ${n("both",t)}
            </button>
            <button
              class="toggle-btn ${this._costDurationToggle==="duration"?"active":""}"
              @click=${()=>this._costDurationToggle="duration"}>
              ${n("duration",t)}
            </button>
          </div>
        </div>
        ${this._renderHistoryChart(e)}
      </div>
    `}_renderRecentActivities(e){let t=this._lang,i=e.history.slice(0,3);if(i.length===0)return c;let a=s=>{switch(s){case"completed":return"\u2713";case"triggered":return"\u2297";case"skipped":return"\u21B7";case"reset":return"\u21BA";default:return"\xB7"}};return o`
      <div class="recent-activities">
        <h3>${n("recent_activities",t)}</h3>
        ${i.map(s=>o`
          <div class="activity-item">
            <span class="activity-icon">${a(s.type)}</span>
            <span class="activity-date">${Re(s.timestamp,t)}</span>
            <span class="activity-note">${s.notes||"\u2014"}</span>
            ${s.cost?o`<span class="activity-badge">${s.cost.toFixed(0)}€</span>`:c}
            ${s.duration?o`<span class="activity-badge">${s.duration}min</span>`:c}
          </div>
        `)}
        <div class="activity-show-all">
          <ha-button appearance="plain" @click=${()=>this._activeTab="history"}>${n("show_all",t)} →</ha-button>
        </div>
      </div>
    `}_renderWeibullCardExpanded(e){return this._renderWeibullSection(e)}_renderSeasonalCardExpanded(e){return this._renderSeasonalChart(e)}_renderHistoryFilters(e){let t=this._lang;return o`
      <div class="history-filters-new">
        <div class="filter-chips">
          ${["completed","skipped","reset","triggered"].map(i=>{let a=e.history.filter(s=>s.type===i).length;return a===0?c:o`
              <span class="filter-chip ${this._historyFilter===i?"active":""}"
                @click=${()=>{this._historyFilter=this._historyFilter===i?null:i}}>
                ${n(i,t)} (${a})
              </span>
            `})}
          ${this._historyFilter?o`<span class="filter-chip clear" @click=${()=>{this._historyFilter=null}}>${n("show_all",t)}</span>`:c}
        </div>
        <div class="filter-controls">
          <input type="text" class="search-input" placeholder="${n("search_notes",t)}..." .value=${this._historySearch} @input=${i=>this._historySearch=i.target.value} />
        </div>
      </div>
    `}_renderHistoryList(e){let t=this._lang,i=this._historyFilter?e.history.filter(a=>a.type===this._historyFilter):e.history;if(this._historySearch){let a=this._historySearch.toLowerCase();i=i.filter(s=>s.notes?.toLowerCase().includes(a))}return i.length===0?o`<p class="empty">${n("no_history",t)}</p>`:o`
      <div class="history-timeline">
        ${[...i].reverse().map(a=>this._renderHistoryEntry(a))}
      </div>
    `}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return c;let e=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!e)return o`<p>Task not found.</p>`;let t=this._lang;return o`
      <div class="detail-section">
        ${this._renderTaskHeader(e)}
        ${this._renderTabBar()}
        ${this._renderTabContent(e)}
      </div>
    `}_renderHistoryChart(e){let t=e.history.filter(y=>y.type==="completed"&&(y.cost!=null||y.duration!=null)).map(y=>({ts:new Date(y.timestamp).getTime(),cost:y.cost??0,duration:y.duration??0})).sort((y,L)=>y.ts-L.ts);if(t.length<2)return c;let i=t.some(y=>y.cost>0),a=t.some(y=>y.duration>0);if(!i&&!a)return c;let s=qt,p=Bt,d=i?32:8,_=a?32:8,h=8,v=20,f=s-d-_,x=p-h-v,$=Math.max(...t.map(y=>y.cost))||1,M=Math.max(...t.map(y=>y.duration))||1,C=Math.min(20,f/t.length*.6),S=f/t.length,F=y=>d+S*y+S/2,b=y=>h+x-y/$*x,T=y=>h+x-y/M*x;return o`
      <div class="sparkline-container">
        <svg class="history-chart" viewBox="0 0 ${s} ${p}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_history",this._lang)}">
          <!-- Cost bars -->
          ${i?t.map((y,L)=>H`
            <rect x="${(F(L)-C/2).toFixed(1)}" y="${b(y.cost).toFixed(1)}" width="${C.toFixed(1)}" height="${(h+x-b(y.cost)).toFixed(1)}"
              fill="var(--primary-color)" opacity="0.6" rx="2" />
          `):c}
          <!-- Duration line -->
          ${a?H`
            <polyline points="${t.map((y,L)=>`${F(L).toFixed(1)},${T(y.duration).toFixed(1)}`).join(" ")}"
              fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
            ${t.map((y,L)=>H`
              <circle cx="${F(L).toFixed(1)}" cy="${T(y.duration).toFixed(1)}" r="3" fill="var(--accent-color, #ff9800)" />
            `)}
          `:c}
          <!-- X-axis labels -->
          <text x="${d}" y="${p-2}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(t[0].ts).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
          <text x="${s-_}" y="${p-2}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(t[t.length-1].ts).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
          <!-- Y-axis labels -->
          ${i?H`
            <text x="${d-3}" y="${h+4}" text-anchor="end" fill="var(--primary-color)" font-size="7">${$.toFixed(0)}\u20AC</text>
            <text x="${d-3}" y="${h+x+3}" text-anchor="end" fill="var(--primary-color)" font-size="7">0\u20AC</text>
          `:c}
          ${a?H`
            <text x="${s-_+3}" y="${h+4}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">${M.toFixed(0)}m</text>
            <text x="${s-_+3}" y="${h+x+3}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">0m</text>
          `:c}
        </svg>
      </div>
      <div class="chart-legend">
        ${i?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${n("cost",this._lang)}</span>`:c}
        ${a?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${n("duration",this._lang)}</span>`:c}
      </div>
    `}_renderSeasonalChart(e){let t=e.seasonal_factors??e.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return c;let i=this._lang,a=e.interval_analysis?.seasonal_reason,s=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],p=new Date().getMonth(),d=300,_=100,h=8,f=_-h-4,x=Math.max(...t,1.5),$=d/12,M=$*.65,C=h+f-1/x*f;return o`
      <div class="seasonal-chart">
        <div class="seasonal-chart-title">
          <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
          ${n("seasonal_chart_title",i)}
          ${a?o`<span class="source-tag">${a==="learned"?n("seasonal_learned",i):n("seasonal_manual",i)}</span>`:c}
        </div>
        <svg viewBox="0 0 ${d} ${_}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_seasonal",i)}">
          <!-- Baseline at 1.0 -->
          <line x1="0" y1="${C.toFixed(1)}" x2="${d}" y2="${C.toFixed(1)}"
            stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
          <!-- Bars -->
          ${t.map((S,F)=>{let b=S/x*f,T=F*$+($-M)/2,y=h+f-b,L=F===p,Z=S<1?"var(--success-color, #4caf50)":S>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return H`
              <rect x="${T.toFixed(1)}" y="${y.toFixed(1)}"
                width="${M.toFixed(1)}" height="${b.toFixed(1)}"
                fill="${Z}" opacity="${L?1:.5}" rx="2" />
            `})}
        </svg>
        <div class="seasonal-labels">
          ${s.map((S,F)=>o`<span class="seasonal-label ${F===p?"active-month":""}">${n(S,i)}</span>`)}
        </div>
      </div>
    `}_renderWeibullSection(e){let t=e.interval_analysis,i=t?.weibull_beta,a=t?.weibull_eta;if(i==null||a==null)return c;let s=this._lang,p=t?.weibull_r_squared,d=e.interval_days??0,_=e.suggested_interval??d;return o`
      <div class="weibull-section">
        <div class="weibull-title">
          <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
          ${n("weibull_reliability_curve",s)}
          ${this._renderBetaBadge(i,s)}
        </div>
        ${this._renderWeibullChart(i,a,d,_)}
        ${this._renderWeibullInfo(t,s)}
        ${t?.confidence_interval_low!=null?this._renderConfidenceInterval(t,e,s):c}
      </div>
    `}_renderBetaBadge(e,t){let i,a,s;return e<.8?(i="early_failures",a="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",s="beta_early_failures"):e<=1.2?(i="random_failures",a="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",s="beta_random_failures"):e<=3.5?(i="wear_out",a="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",s="beta_wear_out"):(i="highly_predictable",a="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",s="beta_highly_predictable"),o`
      <span class="beta-badge ${i}">
        <ha-svg-icon path="${a}"></ha-svg-icon>
        ${n(s,t)} (β=${e.toFixed(2)})
      </span>
    `}_renderWeibullChart(e,t,i,a){let $=Math.max(i,a,t)*1.3,M=50,C=[];for(let P=0;P<=M;P++){let U=P/M*$,R=1-Math.exp(-Math.pow(U/t,e)),E=32+U/$*260,$e=136-R*128;C.push([E,$e])}let S=C.map(([P,U])=>`${P.toFixed(1)},${U.toFixed(1)}`).join(" "),F="M32,136 "+C.map(([P,U])=>`L${P.toFixed(1)},${U.toFixed(1)}`).join(" ")+` L${C[M][0].toFixed(1)},136 Z`,b=32+i/$*260,T=1-Math.exp(-Math.pow(i/t,e)),y=136-T*128,L=((1-T)*100).toFixed(0),Z=32+a/$*260,Y=[0,.25,.5,.75,1];return o`
      <div class="weibull-chart">
        <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_weibull",this._lang)}">
          <!-- Grid lines -->
          ${Y.map(P=>{let U=136-P*128;return H`
              <line x1="${32}" y1="${U.toFixed(1)}" x2="${292}" y2="${U.toFixed(1)}"
                stroke="var(--divider-color)" stroke-width="0.5" ${P===.5?'stroke-dasharray="4,3"':""} />
              <text x="${28}" y="${(U+3).toFixed(1)}" fill="var(--secondary-text-color)"
                font-size="8" text-anchor="end">${(P*100).toFixed(0)}%</text>
            `})}

          <!-- X-axis labels -->
          <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
          <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round($/2)}</text>
          <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round($)}</text>

          <!-- Filled area under CDF curve -->
          <path d="${F}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />

          <!-- CDF Curve -->
          <polyline points="${S}" fill="none"
            stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

          <!-- Current interval marker -->
          ${i>0?H`
            <line x1="${b.toFixed(1)}" y1="${8}" x2="${b.toFixed(1)}" y2="${136 .toFixed(1)}"
              stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
            <circle cx="${b.toFixed(1)}" cy="${y.toFixed(1)}" r="3"
              fill="var(--primary-color, #03a9f4)" />
            <text x="${(b+4).toFixed(1)}" y="${(y-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
              font-size="9" font-weight="600">R=${L}%</text>
          `:c}

          <!-- Recommended marker -->
          ${a>0&&a!==i?H`
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
        <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${n("weibull_failure_probability",this._lang)}</span>
        ${i>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${n("current_interval_marker",this._lang)}</span>`:c}
        ${a>0&&a!==i?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${n("recommended_marker",this._lang)}</span>`:c}
      </div>
    `}_renderWeibullInfo(e,t){return o`
      <div class="weibull-info-row">
        <div class="weibull-info-item">
          <span>${n("characteristic_life",t)}</span>
          <span class="weibull-info-value">${Math.round(e.weibull_eta)} ${n("days",t)}</span>
        </div>
        ${e.weibull_r_squared!=null?o`
          <div class="weibull-info-item">
            <span>${n("weibull_r_squared",t)}</span>
            <span class="weibull-info-value">${e.weibull_r_squared.toFixed(3)}</span>
          </div>
        `:c}
      </div>
    `}_renderConfidenceInterval(e,t,i){let a=e.confidence_interval_low,s=e.confidence_interval_high,p=t.suggested_interval??t.interval_days??0,d=t.interval_days??0,_=Math.max(0,a-5),v=s+5-_,f=(a-_)/v*100,x=(s-a)/v*100,$=(p-_)/v*100,M=d>0?(d-_)/v*100:-1;return o`
      <div class="confidence-range">
        <div class="confidence-range-title">
          ${n("confidence_interval",i)}: ${p} ${n("days",i)} (${a}–${s})
        </div>
        <div class="confidence-bar">
          <div class="confidence-fill" style="left:${f.toFixed(1)}%;width:${x.toFixed(1)}%"></div>
          ${M>=0?o`<div class="confidence-marker current" style="left:${M.toFixed(1)}%"></div>`:c}
          <div class="confidence-marker recommended" style="left:${$.toFixed(1)}%"></div>
        </div>
        <div class="confidence-labels">
          <span class="confidence-text low">${n("confidence_conservative",i)} (${a}${n("days",i).charAt(0)})</span>
          <span class="confidence-text high">${n("confidence_aggressive",i)} (${s}${n("days",i).charAt(0)})</span>
        </div>
      </div>
    `}_renderPredictionSection(e){let t=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data",i=e.days_until_threshold!=null,a=e.environmental_factor!=null&&e.environmental_factor!==1;if(!t&&!i&&!a)return c;let s=this._lang,p=e.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":e.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
      <div class="prediction-section">
        ${e.sensor_prediction_urgency?o`
          <div class="prediction-urgency-banner">
            <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
            ${n("sensor_prediction_urgency",s).replace("{days}",String(Math.round(e.days_until_threshold||0)))}
          </div>
        `:c}
        <div class="prediction-title">
          <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
          ${n("sensor_prediction",s)}
        </div>
        <div class="prediction-grid">
          ${t?o`
            <div class="prediction-item">
              <ha-svg-icon path="${p}"></ha-svg-icon>
              <span class="prediction-label">${n("degradation_trend",s)}</span>
              <span class="prediction-value ${e.degradation_trend}">${n("trend_"+e.degradation_trend,s)}</span>
              ${e.degradation_rate!=null?o`<span class="prediction-rate">${e.degradation_rate>0?"+":""}${Math.abs(e.degradation_rate)>=10?Math.round(e.degradation_rate).toLocaleString():e.degradation_rate.toFixed(1)} ${e.trigger_entity_info?.unit_of_measurement||""}/${n("day_short",s)}</span>`:c}
            </div>
          `:c}
          ${i?o`
            <div class="prediction-item">
              <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
              <span class="prediction-label">${n("days_until_threshold",s)}</span>
              <span class="prediction-value prediction-days${e.days_until_threshold===0?" exceeded":e.sensor_prediction_urgency?" urgent":""}">${e.days_until_threshold===0?n("threshold_exceeded",s):"~"+Math.round(e.days_until_threshold)+" "+n("days",s)}</span>
              ${e.threshold_prediction_date?o`<span class="prediction-date">${ee(e.threshold_prediction_date,s)}</span>`:c}
              ${e.threshold_prediction_confidence?o`<span class="confidence-dot ${e.threshold_prediction_confidence}"></span>`:c}
            </div>
          `:c}
          ${a&&this._features.environmental?o`
            <div class="prediction-item">
              <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
              <span class="prediction-label">${n("environmental_adjustment",s)}</span>
              <span class="prediction-value">${e.environmental_factor.toFixed(2)}x</span>
              ${e.environmental_entity?o`<span class="prediction-entity">${e.environmental_entity}</span>`:c}
            </div>
          `:c}
        </div>
      </div>
    `}_renderTriggerSection(e){let t=e.trigger_config;if(!t)return c;let i=this._lang,a=e.trigger_entity_info,s=a?.friendly_name||t.entity_id||"\u2014",p=t.entity_id||"",d=a?.unit_of_measurement||"",_=e.trigger_current_value,h=t.type||"threshold";return o`
      <h3>${n("trigger",i)}</h3>
      <div class="trigger-card">
        <div class="trigger-header">
          <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
          <div>
            <div class="trigger-entity-name">${s}</div>
            <div class="trigger-entity-id">${p}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          </div>
          <span class="status-badge ${e.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
            ${e.trigger_active?n("triggered",i):n("ok",i)}
          </span>
        </div>

        ${_!=null?o`
              <div class="trigger-value-row">
                <span class="trigger-current ${e.trigger_active?"active":""}">${typeof _=="number"?_.toFixed(1):_}</span>
                ${d?o`<span class="trigger-unit">${d}</span>`:c}
              </div>
            `:c}

        <div class="trigger-limits">
          ${h==="threshold"?o`
            ${t.trigger_above!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${n("threshold_above",i)}: ${t.trigger_above} ${d}</span>`:c}
            ${t.trigger_below!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${n("threshold_below",i)}: ${t.trigger_below} ${d}</span>`:c}
            ${t.trigger_for_minutes?o`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${n("for_minutes",i)}: ${t.trigger_for_minutes}</span>`:c}
          `:c}
          ${h==="counter"?o`
            ${t.trigger_target_value!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${n("target_value",i)}: ${t.trigger_target_value} ${d}</span>`:c}
          `:c}
          ${h==="state_change"?o`
            ${t.trigger_target_changes!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${n("target_changes",i)}: ${t.trigger_target_changes}</span>`:c}
          `:c}
          ${a?.min!=null?o`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${n("min",i)}: ${a.min} ${d}</span>`:c}
          ${a?.max!=null?o`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${n("max",i)}: ${a.max} ${d}</span>`:c}
        </div>

        ${this._renderSparkline(e,d)}
      </div>
    `}_renderSparkline(e,t){let i=e.trigger_config;if(!i)return c;let a=i.type||"threshold",s=a==="counter"&&i.trigger_delta_mode,p=this._isCounterEntity(i),d=i.entity_id||"",_=this._detailStatsData.get(d)||[],h=[],v=!1;if(_.length>=2)for(let u of _){let w=u.val;s&&e.trigger_baseline_value!=null&&(w-=e.trigger_baseline_value);let D={ts:u.ts,val:w};!p&&u.min!=null&&u.max!=null&&(D.min=s&&e.trigger_baseline_value!=null?u.min-e.trigger_baseline_value:u.min,D.max=s&&e.trigger_baseline_value!=null?u.max-e.trigger_baseline_value:u.max,v=!0),h.push(D)}else for(let u of e.history)u.trigger_value!=null&&h.push({ts:new Date(u.timestamp).getTime(),val:u.trigger_value});if(e.trigger_current_value!=null){let u=e.trigger_current_value;s&&e.trigger_baseline_value!=null&&(u-=e.trigger_baseline_value),h.push({ts:Date.now(),val:u})}if(h.length<2&&d&&this._statsService&&!this._detailStatsData.has(d))return o`<div class="sparkline-container" aria-live="polite" style="display:flex;align-items:center;justify-content:center;height:140px;color:var(--secondary-text-color);font-size:12px;">
        <ha-icon icon="mdi:chart-line" style="--mdc-icon-size:16px;margin-right:8px;"></ha-icon>
        ${n("loading_chart",this._lang)}
      </div>`;if(h.length<2)return c;h.sort((u,w)=>u.ts-w.ts);let f=Ot,x=Vt,$=30,M=2,C=8,S=16,F=h.map(u=>u.val),b=Math.min(...F),T=Math.max(...F);if(v)for(let u of h)u.min!=null&&(b=Math.min(b,u.min)),u.max!=null&&(T=Math.max(T,u.max));i.trigger_above!=null&&(T=Math.max(T,i.trigger_above),b=Math.min(b,i.trigger_above)),i.trigger_below!=null&&(b=Math.min(b,i.trigger_below),T=Math.max(T,i.trigger_below));let y=null,L=null;if(a==="counter"&&i.trigger_target_value!=null){if(e.trigger_baseline_value!=null)y=e.trigger_baseline_value;else if(h.length>0){let u=[...e.history].filter(w=>w.type==="completed"||w.type==="reset").sort((w,D)=>new Date(D.timestamp).getTime()-new Date(w.timestamp).getTime())[0];if(u){let w=new Date(u.timestamp).getTime(),D=h[0],j=Math.abs(h[0].ts-w);for(let B of h){let W=Math.abs(B.ts-w);W<j&&(D=B,j=W)}y=D.val}else y=h[0].val}y!=null?(L=y+i.trigger_target_value,T=Math.max(T,L),b=Math.min(b,y)):(T=Math.max(T,i.trigger_target_value),b=Math.min(b,0))}s&&e.trigger_baseline_value!=null&&(b=Math.min(b,0));let Z=T-b||1;b-=Z*.1,T+=Z*.1;let Y=h[0].ts,P=h[h.length-1].ts,U=P-Y||1,R=u=>$+(u-Y)/U*(f-$-M),E=u=>C+(1-(u-b)/(T-b))*(x-C-S),$e=h.map(u=>`${R(u.ts).toFixed(1)},${E(u.val).toFixed(1)}`).join(" "),lt=`M${R(h[0].ts).toFixed(1)},${x-S} `+h.map(u=>`L${R(u.ts).toFixed(1)},${E(u.val).toFixed(1)}`).join(" ")+` L${R(h[h.length-1].ts).toFixed(1)},${x-S} Z`,we="";if(v){let u=h.filter(w=>w.min!=null&&w.max!=null);if(u.length>=2){let w=u.map(j=>`${R(j.ts).toFixed(1)},${E(j.max).toFixed(1)}`),D=[...u].reverse().map(j=>`${R(j.ts).toFixed(1)},${E(j.min).toFixed(1)}`);we=`M${w[0]} `+w.slice(1).map(j=>`L${j}`).join(" ")+` L${D[0]} `+D.slice(1).map(j=>`L${j}`).join(" ")+" Z"}}let ze=h[h.length-1],ct=R(ze.ts),dt=E(ze.val),Ue=u=>Math.abs(u)>=1e4?(u/1e3).toFixed(0)+"k":u>=1e3?(u/1e3).toFixed(1)+"k":u.toFixed(u<10?1:0),pt=Ue(T),ht=Ue(b),ut=e.history.filter(u=>["completed","skipped","reset"].includes(u.type)).map(u=>({ts:new Date(u.timestamp).getTime(),type:u.type})).filter(u=>u.ts>=Y&&u.ts<=P),ke=Wt,Ae=h;if(h.length>ke){let u=(h.length-1)/(ke-1);Ae=[];for(let w=0;w<ke;w++)Ae.push(h[Math.round(w*u)])}return o`
      <div class="sparkline-container">
        <svg class="sparkline-svg" viewBox="0 0 ${f} ${x}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_sparkline",this._lang)}">
          <!-- Y-axis labels -->
          <text x="${$-3}" y="${C+3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${pt}</text>
          <text x="${$-3}" y="${x-S+3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${ht}</text>
          <!-- X-axis labels -->
          <text x="${$}" y="${x-1}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(Y).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
          <text x="${f-M}" y="${x-1}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(P).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
          <!-- Min/max band (mean-type entities) -->
          ${we?H`<path d="${we}" fill="var(--primary-color)" opacity="0.08" />`:c}
          <!-- Area fill -->
          <path d="${lt}" fill="var(--primary-color)" opacity="0.15" />
          <!-- Line -->
          <polyline points="${$e}" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linejoin="round" />
          <!-- Prediction projection line (Phase 3) -->
          ${e.degradation_rate!=null&&e.degradation_trend!=="stable"&&e.degradation_trend!=="insufficient_data"&&h.length>=2?(()=>{let u=h[h.length-1],w=30,D=u.ts+w*864e5,j=u.val+e.degradation_rate*w,B=Math.min(D,P+(P-Y)*.3),W=Math.max(b,Math.min(T,j)),gt=R(u.ts),_t=E(u.val),vt=R(B),mt=E(W);return H`<line x1="${gt.toFixed(1)}" y1="${_t.toFixed(1)}" x2="${vt.toFixed(1)}" y2="${mt.toFixed(1)}" stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7" />`})():c}
          <!-- Threshold lines (for threshold type) -->
          ${a==="threshold"&&i.trigger_above!=null?H`<line x1="${$}" y1="${E(i.trigger_above).toFixed(1)}" x2="${f}" y2="${E(i.trigger_above).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                  <text x="${f-2}" y="${E(i.trigger_above)-3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">▲ ${i.trigger_above}</text>`:c}
          ${a==="threshold"&&i.trigger_below!=null?H`<line x1="${$}" y1="${E(i.trigger_below).toFixed(1)}" x2="${f}" y2="${E(i.trigger_below).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                  <text x="${f-2}" y="${E(i.trigger_below)+11}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">▼ ${i.trigger_below}</text>`:c}
          <!-- Target line (for counter type) -->
          ${a==="counter"&&L!=null?H`<line x1="${$}" y1="${E(L).toFixed(1)}" x2="${f}" y2="${E(L).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                  <text x="${f-2}" y="${E(L)-3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">${n("target_value",this._lang)}: +${i.trigger_target_value}</text>`:c}
          <!-- Baseline line (for counter — value at last maintenance) -->
          ${a==="counter"&&y!=null?H`<line x1="${$}" y1="${E(y).toFixed(1)}" x2="${f}" y2="${E(y).toFixed(1)}" stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
                  <text x="${$+2}" y="${E(y)+11}" text-anchor="start" fill="var(--secondary-text-color)" font-size="8">${n("baseline",this._lang)}</text>`:c}
          <!-- Current dot -->
          <circle cx="${ct.toFixed(1)}" cy="${dt.toFixed(1)}" r="3.5" fill="var(--primary-color)" />
          <!-- Event markers -->
          ${ut.map(u=>{let w=R(u.ts),D=u.type==="completed"?"var(--success-color, #4caf50)":u.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return H`
              <line x1="${w.toFixed(1)}" y1="${C}" x2="${w.toFixed(1)}" y2="${x-S}" stroke="${D}" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
              <circle cx="${w.toFixed(1)}" cy="${C+2}" r="5" fill="${D}" opacity="0.8" />
              <text x="${w.toFixed(1)}" y="${C+6}" text-anchor="middle" fill="white" font-size="7" font-weight="bold">${u.type==="completed"?"\u2713":u.type==="skipped"?"\u23ED":"\u21BA"}</text>
            `})}
          <!-- Hover hit targets (downsampled for performance) -->
          ${Ae.map(u=>{let w=R(u.ts),D=E(u.val),j=new Date(u.ts).toLocaleDateString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),B=`${u.val.toFixed(1)} ${t}`;return v&&u.min!=null&&u.max!=null&&(B+=` (${u.min.toFixed(1)}\u2013${u.max.toFixed(1)})`),H`<circle cx="${w.toFixed(1)}" cy="${D.toFixed(1)}" r="8" fill="transparent" tabindex="0"
              @mouseenter=${W=>this._showSparklineTooltip(W,`${j}
${B}`)}
              @focus=${W=>this._showSparklineTooltip(W,`${j}
${B}`)}
              @mouseleave=${()=>{this._sparklineTooltip=null}}
              @blur=${()=>{this._sparklineTooltip=null}} />`})}
        </svg>
        ${this._sparklineTooltip?o`
          <div class="sparkline-tooltip" role="tooltip" aria-live="assertive" style="left:${this._sparklineTooltip.x}px;top:${this._sparklineTooltip.y}px">
            ${this._sparklineTooltip.text.split(`
`).map(u=>o`<div>${u}</div>`)}
          </div>
        `:c}
      </div>
    `}_showSparklineTooltip(e,t){let i=e.currentTarget,a=i.closest(".sparkline-container");if(!a)return;let s=a.getBoundingClientRect(),p=i.getBoundingClientRect();this._sparklineTooltip={x:p.left-s.left+p.width/2,y:p.top-s.top-8,text:t}}_renderHistoryEntry(e){let t=this._lang;return o`
      <div class="history-entry">
        <div class="history-icon ${e.type}">
          <ha-icon .icon=${st[e.type]||"mdi:circle"}></ha-icon>
        </div>
        <div class="history-content">
          <div><strong>${n(e.type,t)}</strong></div>
          <div class="history-date">${Re(e.timestamp,t)}</div>
          ${e.notes?o`<div>${e.notes}</div>`:c}
          <div class="history-details">
            ${e.cost!=null?o`<span>${n("cost",t)}: ${e.cost.toFixed(2)} €</span>`:c}
            ${e.duration!=null?o`<span>${n("duration",t)}: ${e.duration} min</span>`:c}
            ${e.trigger_value!=null?o`<span>${n("trigger_val",t)}: ${e.trigger_value}</span>`:c}
          </div>
        </div>
      </div>
    `}};A.styles=[nt,O`
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
    `],g([z({attribute:!1})],A.prototype,"hass",2),g([z({type:Boolean})],A.prototype,"narrow",2),g([z({attribute:!1})],A.prototype,"panel",2),g([m()],A.prototype,"_objects",2),g([m()],A.prototype,"_stats",2),g([m()],A.prototype,"_view",2),g([m()],A.prototype,"_selectedEntryId",2),g([m()],A.prototype,"_selectedTaskId",2),g([m()],A.prototype,"_filterStatus",2),g([m()],A.prototype,"_filterUser",2),g([m()],A.prototype,"_unsub",2),g([m()],A.prototype,"_sparklineTooltip",2),g([m()],A.prototype,"_historyFilter",2),g([m()],A.prototype,"_budget",2),g([m()],A.prototype,"_groups",2),g([m()],A.prototype,"_detailStatsData",2),g([m()],A.prototype,"_miniStatsData",2),g([m()],A.prototype,"_features",2),g([m()],A.prototype,"_activeTab",2),g([m()],A.prototype,"_costDurationToggle",2),g([m()],A.prototype,"_historyTimeRange",2),g([m()],A.prototype,"_historySearch",2),A=g([re("maintenance-supporter-panel")],A);export{A as MaintenanceSupporterPanel};
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
