/*! maintenance_supporter frontend 2.107.0 */
var Vr=Object.defineProperty;var _o=Object.getOwnPropertyDescriptor;var v=(r,i,e)=>()=>{if(e)throw e[0];try{return r&&(i=r(r=0)),i}catch(t){throw e=[t],t}};var mo=(r,i)=>{for(var e in i)Vr(r,e,{get:i[e],enumerable:!0})};var d=(r,i,e,t)=>{for(var s=t>1?void 0:t?_o(i,e):i,a=r.length-1,o;a>=0;a--)(o=r[a])&&(s=(t?o(i,e,s):o(s))||s);return t&&s&&Vr(i,e,s),s};var zt,Ft,Li,Gr,gt,Kr,$,Yr,ji,qi=v(()=>{zt=globalThis,Ft=zt.ShadowRoot&&(zt.ShadyCSS===void 0||zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Li=Symbol(),Gr=new WeakMap,gt=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==Li)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(Ft&&i===void 0){let t=e!==void 0&&e.length===1;t&&(i=Gr.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&Gr.set(e,i))}return i}toString(){return this.cssText}},Kr=r=>new gt(typeof r=="string"?r:r+"",void 0,Li),$=(r,...i)=>{let e=r.length===1?r[0]:i.reduce((t,s,a)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[a+1],r[0]);return new gt(e,r,Li)},Yr=(r,i)=>{if(Ft)r.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let t=document.createElement("style"),s=zt.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,r.appendChild(t)}},ji=Ft?r=>r:r=>r instanceof CSSStyleSheet?(i=>{let e="";for(let t of i.cssRules)e+=t.cssText;return Kr(e)})(r):r});var go,fo,yo,vo,bo,xo,Ut,Qr,wo,ko,ft,yt,Bt,Zr,ce,vt=v(()=>{qi();qi();({is:go,defineProperty:fo,getOwnPropertyDescriptor:yo,getOwnPropertyNames:vo,getOwnPropertySymbols:bo,getPrototypeOf:xo}=Object),Ut=globalThis,Qr=Ut.trustedTypes,wo=Qr?Qr.emptyScript:"",ko=Ut.reactiveElementPolyfillSupport,ft=(r,i)=>r,yt={toAttribute(r,i){switch(i){case Boolean:r=r?wo:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,i){let e=r;switch(i){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Bt=(r,i)=>!go(r,i),Zr={attribute:!0,type:String,converter:yt,reflect:!1,useDefault:!1,hasChanged:Bt};Symbol.metadata??=Symbol("metadata"),Ut.litPropertyMetadata??=new WeakMap;ce=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=Zr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(i,t,e);s!==void 0&&fo(this.prototype,i,s)}}static getPropertyDescriptor(i,e,t){let{get:s,set:a}=yo(this.prototype,i)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){let c=s?.call(this);a?.call(this,o),this.requestUpdate(i,c,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??Zr}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;let i=xo(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){let e=this.properties,t=[...vo(e),...bo(e)];for(let s of t)this.createProperty(s,e[s])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let t=new Set(i.flat(1/0).reverse());for(let s of t)e.unshift(ji(s))}else i!==void 0&&e.push(ji(i));return e}static _$Eu(i,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Yr(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){let t=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,t);if(s!==void 0&&t.reflect===!0){let a=(t.converter?.toAttribute!==void 0?t.converter:yt).toAttribute(e,t.type);this._$Em=i,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(i,e){let t=this.constructor,s=t._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let a=t.getPropertyOptions(s),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:yt;this._$Em=s;let c=o.fromAttribute(e,a.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(i,e,t,s=!1,a){if(i!==void 0){let o=this.constructor;if(s===!1&&(a=this[i]),t??=o.getPropertyOptions(i),!((t.hasChanged??Bt)(a,e)||t.useDefault&&t.reflect&&a===this._$Ej?.get(i)&&!this.hasAttribute(o._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:s,wrapped:a},o){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,o??e??this[i]),a!==!0||o!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,a]of t){let{wrapped:o}=a,c=this[s];o!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,a,c)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};ce.elementStyles=[],ce.shadowRootOptions={mode:"open"},ce[ft("elementProperties")]=new Map,ce[ft("finalized")]=new Map,ko?.({ReactiveElement:ce}),(Ut.reactiveElementVersions??=[]).push("2.1.2")});function os(r,i){if(!Ui(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Xr!==void 0?Xr.createHTML(i):i}function Le(r,i,e=r,t){if(i===Oe)return i;let s=t!==void 0?e._$Co?.[t]:e._$Cl,a=wt(i)?void 0:i._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),a===void 0?s=void 0:(s=new a(r),s._$AT(r,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(i=Le(r,s._$AS(r,i.values),s,t)),i}var Di,Jr,Wt,Xr,zi,de,Fi,$o,He,xt,wt,Ui,ns,Mi,bt,es,ts,Pe,is,rs,as,Bi,l,Ke,Rc,Oe,u,ss,Ne,ls,kt,Vt,Ge,je,Gt,Kt,Yt,Qt,cs,Eo,ds,Ye=v(()=>{Di=globalThis,Jr=r=>r,Wt=Di.trustedTypes,Xr=Wt?Wt.createPolicy("lit-html",{createHTML:r=>r}):void 0,zi="$lit$",de=`lit$${Math.random().toFixed(9).slice(2)}$`,Fi="?"+de,$o=`<${Fi}>`,He=document,xt=()=>He.createComment(""),wt=r=>r===null||typeof r!="object"&&typeof r!="function",Ui=Array.isArray,ns=r=>Ui(r)||typeof r?.[Symbol.iterator]=="function",Mi=`[ 	
\f\r]`,bt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,es=/-->/g,ts=/>/g,Pe=RegExp(`>|${Mi}(?:([^\\s"'>=/]+)(${Mi}*=${Mi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),is=/'/g,rs=/"/g,as=/^(?:script|style|textarea|title)$/i,Bi=r=>(i,...e)=>({_$litType$:r,strings:i,values:e}),l=Bi(1),Ke=Bi(2),Rc=Bi(3),Oe=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),ss=new WeakMap,Ne=He.createTreeWalker(He,129);ls=(r,i)=>{let e=r.length-1,t=[],s,a=i===2?"<svg>":i===3?"<math>":"",o=bt;for(let c=0;c<e;c++){let p=r[c],_,m,f=-1,b=0;for(;b<p.length&&(o.lastIndex=b,m=o.exec(p),m!==null);)b=o.lastIndex,o===bt?m[1]==="!--"?o=es:m[1]!==void 0?o=ts:m[2]!==void 0?(as.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=Pe):m[3]!==void 0&&(o=Pe):o===Pe?m[0]===">"?(o=s??bt,f=-1):m[1]===void 0?f=-2:(f=o.lastIndex-m[2].length,_=m[1],o=m[3]===void 0?Pe:m[3]==='"'?rs:is):o===rs||o===is?o=Pe:o===es||o===ts?o=bt:(o=Pe,s=void 0);let w=o===Pe&&r[c+1].startsWith("/>")?" ":"";a+=o===bt?p+$o:f>=0?(t.push(_),p.slice(0,f)+zi+p.slice(f)+de+w):p+de+(f===-2?c:w)}return[os(r,a+(r[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),t]},kt=class r{constructor({strings:i,_$litType$:e},t){let s;this.parts=[];let a=0,o=0,c=i.length-1,p=this.parts,[_,m]=ls(i,e);if(this.el=r.createElement(_,t),Ne.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(s=Ne.nextNode())!==null&&p.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let f of s.getAttributeNames())if(f.endsWith(zi)){let b=m[o++],w=s.getAttribute(f).split(de),k=/([.?@])?(.*)/.exec(b);p.push({type:1,index:a,name:k[2],strings:w,ctor:k[1]==="."?Gt:k[1]==="?"?Kt:k[1]==="@"?Yt:je}),s.removeAttribute(f)}else f.startsWith(de)&&(p.push({type:6,index:a}),s.removeAttribute(f));if(as.test(s.tagName)){let f=s.textContent.split(de),b=f.length-1;if(b>0){s.textContent=Wt?Wt.emptyScript:"";for(let w=0;w<b;w++)s.append(f[w],xt()),Ne.nextNode(),p.push({type:2,index:++a});s.append(f[b],xt())}}}else if(s.nodeType===8)if(s.data===Fi)p.push({type:2,index:a});else{let f=-1;for(;(f=s.data.indexOf(de,f+1))!==-1;)p.push({type:7,index:a}),f+=de.length-1}a++}}static createElement(i,e){let t=He.createElement("template");return t.innerHTML=i,t}};Vt=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:t}=this._$AD,s=(i?.creationScope??He).importNode(e,!0);Ne.currentNode=s;let a=Ne.nextNode(),o=0,c=0,p=t[0];for(;p!==void 0;){if(o===p.index){let _;p.type===2?_=new Ge(a,a.nextSibling,this,i):p.type===1?_=new p.ctor(a,p.name,p.strings,this,i):p.type===6&&(_=new Qt(a,this,i)),this._$AV.push(_),p=t[++c]}o!==p?.index&&(a=Ne.nextNode(),o++)}return Ne.currentNode=He,s}p(i){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}},Ge=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,t,s){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=Le(this,i,e),wt(i)?i===u||i==null||i===""?(this._$AH!==u&&this._$AR(),this._$AH=u):i!==this._$AH&&i!==Oe&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):ns(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==u&&wt(this._$AH)?this._$AA.nextSibling.data=i:this.T(He.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:t}=i,s=typeof t=="number"?this._$AC(i):(t.el===void 0&&(t.el=kt.createElement(os(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let a=new Vt(s,this),o=a.u(this.options);a.p(e),this.T(o),this._$AH=a}}_$AC(i){let e=ss.get(i.strings);return e===void 0&&ss.set(i.strings,e=new kt(i)),e}k(i){Ui(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let a of i)s===e.length?e.push(t=new r(this.O(xt()),this.O(xt()),this,this.options)):t=e[s],t._$AI(a),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let t=Jr(i).nextSibling;Jr(i).remove(),i=t}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},je=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,t,s,a){this.type=1,this._$AH=u,this._$AN=void 0,this.element=i,this.name=e,this._$AM=s,this.options=a,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=u}_$AI(i,e=this,t,s){let a=this.strings,o=!1;if(a===void 0)i=Le(this,i,e,0),o=!wt(i)||i!==this._$AH&&i!==Oe,o&&(this._$AH=i);else{let c=i,p,_;for(i=a[0],p=0;p<a.length-1;p++)_=Le(this,c[t+p],e,p),_===Oe&&(_=this._$AH[p]),o||=!wt(_)||_!==this._$AH[p],_===u?i=u:i!==u&&(i+=(_??"")+a[p+1]),this._$AH[p]=_}o&&!s&&this.j(i)}j(i){i===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},Gt=class extends je{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===u?void 0:i}},Kt=class extends je{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==u)}},Yt=class extends je{constructor(i,e,t,s,a){super(i,e,t,s,a),this.type=5}_$AI(i,e=this){if((i=Le(this,i,e,0)??u)===Oe)return;let t=this._$AH,s=i===u&&t!==u||i.capture!==t.capture||i.once!==t.once||i.passive!==t.passive,a=i!==u&&(t===u||s);s&&this.element.removeEventListener(this.name,this,t),a&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},Qt=class{constructor(i,e,t){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(i){Le(this,i)}},cs={M:zi,P:de,A:Fi,C:1,L:ls,R:Vt,D:ns,V:Le,I:Ge,H:je,N:Kt,U:Yt,B:Gt,F:Qt},Eo=Di.litHtmlPolyfillSupport;Eo?.(kt,Ge),(Di.litHtmlVersions??=[]).push("3.3.2");ds=(r,i,e)=>{let t=e?.renderBefore??i,s=t._$litPart$;if(s===void 0){let a=e?.renderBefore??null;t._$litPart$=s=new Ge(i.insertBefore(xt(),a),a,void 0,e??{})}return s._$AI(r),s}});var Wi,S,So,ps=v(()=>{vt();vt();Ye();Ye();Wi=globalThis,S=class extends ce{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=ds(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Oe}};S._$litElement$=!0,S.finalized=!0,Wi.litElementHydrateSupport?.({LitElement:S});So=Wi.litElementPolyfillSupport;So?.({LitElement:S});(Wi.litElementVersions??=[]).push("4.2.2")});var us=v(()=>{});var C=v(()=>{vt();Ye();ps();us()});var hs=v(()=>{});function y(r){return(i,e)=>typeof e=="object"?Ao(r,i,e):((t,s,a)=>{let o=s.hasOwnProperty(a);return s.constructor.createProperty(a,t),o?Object.getOwnPropertyDescriptor(s,a):void 0})(r,i,e)}var To,Ao,Vi=v(()=>{vt();To={attribute:!0,type:String,converter:yt,reflect:!1,hasChanged:Bt},Ao=(r=To,i,e)=>{let{kind:t,metadata:s}=e,a=globalThis.litPropertyMetadata.get(s);if(a===void 0&&globalThis.litPropertyMetadata.set(s,a=new Map),t==="setter"&&((r=Object.create(r)).wrapped=!0),a.set(e.name,r),t==="accessor"){let{name:o}=e;return{set(c){let p=i.get.call(this);i.set.call(this,c),this.requestUpdate(o,p,r,!0,c)},init(c){return c!==void 0&&this.C(o,void 0,r,c),c}}}if(t==="setter"){let{name:o}=e;return function(c){let p=this[o];i.call(this,c),this.requestUpdate(o,p,r,!0,c)}}throw Error("Unsupported decorator location: "+t)}});function h(r){return y({...r,state:!0,attribute:!1})}var _s=v(()=>{Vi();});var ms=v(()=>{});var Qe=v(()=>{});var gs=v(()=>{Qe();});var fs=v(()=>{Qe();});var ys=v(()=>{Qe();});var vs=v(()=>{Qe();});var bs=v(()=>{Qe();});var F=v(()=>{hs();Vi();_s();ms();gs();fs();ys();vs();bs()});function xs(r){return r==="use"?"use":"purchase"}function Xt(r,i){let e=r?.cost_mode;return e==="use"||e==="purchase"?e:i}function ws(r){let i=Jt(r?.cost);if(i===null)return null;let e=Jt(r?.package_size);return e&&e>0?i/e:i}function $t(r){let i=Jt(r.cost);if(r.cost_basis!=="use")return i;let e=Jt(r.parts_cost),t=r.purchase?null:i;return t===null&&e===null?null:(t??0)+(e??0)}var Jt,Ze=v(()=>{"use strict";Jt=r=>typeof r=="number"&&Number.isFinite(r)?r:null});function Gi(r){return $s[r]??"var(--secondary-text-color)"}function Ki(r){return Io[r??""]??Es.length}var ye,$s,ei,Es,Io,Et,Je=v(()=>{"use strict";ye={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"var(--deep-orange-color, #ff5722)",archived:"var(--disabled-color, #9e9e9e)",paused:"var(--info-color, #2196f3)"},$s={completed:ye.ok,missed:ye.overdue,reset:ye.paused,skipped:"var(--secondary-text-color)",triggered:ye.triggered,trigger_replaced:ye.triggered,trigger_removed:"var(--secondary-text-color)"},ei=["completed","reset","skipped"];Es=["overdue","triggered","due_soon","ok"],Io=Object.fromEntries(Es.map((r,i)=>[r,i]));Et={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",archived:"mdi:archive-outline",paused:"mdi:pause-circle-outline",completed:"mdi:check-circle",skipped:"mdi:skip-next",missed:"mdi:calendar-remove",reset:"mdi:refresh"}});function St(r){let i=Ts.get(r);if(i===void 0){try{i=new Intl.DateTimeFormat("en-US",{timeZone:r,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{i=null}Ts.set(r,i)}return i}function Cs(){if(Qi===void 0){let r;try{r=new Intl.DateTimeFormat().resolvedOptions().timeZone}catch{}Qi=r&&St(r)?r:null}return Qi}function Is(){return Cs()??"UTC"}function ve(){let r=As.serverTimeZone;return r&&St(r)?r:Is()}function be(){let r=Cs();return As.timeZone!=="server"&&r?r:ve()}function ti(r,i){let e=St(i)??St(Is())??St("UTC"),t={};for(let s of e.formatToParts(r))s.type!=="literal"&&(t[s.type]=Number(s.value));return{y:t.year,mo:t.month,d:t.day,h:t.hour%24,mi:t.minute,s:t.second}}function xe(r,i){return Ji(ti(+r,i))}function ii(r,i){let e=ti(+r,i);return`${Ji(e)}T${te(e.h)}:${te(e.mi)}`}function pe(){return xe(Date.now(),ve())}function Rs(){return ii(Date.now(),ve())}function Zi(r,i){let e=ti(r,i);return Date.UTC(e.y,e.mo-1,e.d,e.h,e.mi,e.s)-Math.floor(r/1e3)*1e3}function Po(r,i,e,t,s,a,o){let c=Date.UTC(r,i-1,e,t,s,a),p=Zi(c-Ss,o),_=Zi(c+Ss,o);for(let m of p===_?[p]:[p,_])if(Zi(c-m,o)===m)return c-m;return c-p}function Ps(r,i,e){if(r.has(i))return r.get(i);r.size>=Oo&&r.clear();let t=e();return r.set(i,t),t}function V(r){if(typeof r!="string"||!r)return NaN;let i=Xi.exec(r);if(!i)return Date.parse(r);let e=ve();return Ps(Ho,`${e}|${r}`,()=>{let[t,s,a,o,c,p]=[i[1],i[2],i[3],i[4]??"0",i[5]??"0",i[6]??"0"].map(Number);if(s<1||s>12||new Date(Date.UTC(t,s-1,a)).getUTCDate()!==a||o>23||c>59||p>59)return NaN;let _=i[7]?Math.floor(+`0.${i[7]}`*1e3):0;return Po(t,s,a,o,c,p,e)+_})}function Xe(r){if(typeof r!="string"||!r)return null;let i=Xi.exec(r);if(i)return`${i[1]}-${i[2]}-${i[3]}`;let e=ve();return Ps(No,`${e}|${r}`,()=>{let t=Date.parse(r);return Number.isFinite(t)?xe(t,e):/^\d{4}-\d{2}-\d{2}/.test(r)?r.slice(0,10):null})}function Ns(r){if(typeof r!="string"||!r)return"";let i=Xi.exec(r);if(i)return`${i[1]}-${i[2]}-${i[3]}T${i[4]??"00"}:${i[5]??"00"}:${i[6]??"00"}`;let e=Date.parse(r);if(!Number.isFinite(e))return"";let t=ti(e,ve());return`${Ji(t)}T${te(t.h)}:${te(t.mi)}:${te(t.s)}`}function qe(r,i){let e=Lo.exec(r);if(!e)return r;let t=new Date(Date.UTC(Number(e[1]),Number(e[2])-1,Number(e[3])+Math.round(i)));return`${te(t.getUTCFullYear(),4)}-${te(t.getUTCMonth()+1)}-${te(t.getUTCDate())}`}var As,Ss,te,Ts,Qi,Ji,Xi,No,Ho,Oo,Lo,G=v(()=>{"use strict";As=window.__msDateTimePrefs??={},Ss=864e5,te=(r,i=2)=>String(r).padStart(i,"0"),Ts=new Map;Ji=r=>`${te(r.y,4)}-${te(r.mo)}-${te(r.d)}`;Xi=/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?$/,No=new Map,Ho=new Map,Oo=2e4;Lo=/^(\d{4})-(\d{2})-(\d{2})$/});var zs,Ds=v(()=>{zs={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",trigger_removed:"Trigger removed",ok:"OK",all:"All",new_object:"+ New Object",templates_from:"From template",templates_title:"Start from a template",templates_task_count:"{n} tasks",templates_task_count_one:"1 task",template_created:"Created from template",onboard_hint:"Add your first object to start tracking maintenance.",edit:"Edit",duplicate:"Duplicate",task_duplicated:"Task duplicated",task_moved:"Task moved",move_task_target:"Target object",move_task_message:"Choose the object this task should belong to. Its history, readings and trigger state move with it; it gets a new reference number and its entities are recreated under the new object. Linked documents stay with the current object.",bulk_move_message:"Choose the object the selected tasks should belong to. Tasks that already live there are skipped; history, readings and trigger state move along.",bulk_moved:"{n} tasks moved",more_actions:"More actions",back:"Back",quantity:"Quantity",spare_part:"Spare part",move_task_title:"Move task",move_task:"Move to another object\u2026",object_duplicated:"Object duplicated",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",missed:"Missed",reset:"Reset",snooze:"Snooze",snoozed:"Snoozed",snoozed_for:"Reminders muted for {hours} hours \u2014 until {until}",snoozed_for_one:"Reminders muted for one hour \u2014 until {until}",cancel:"Cancel",bulk_select:"Select",bulk_select_all:"Select all",bulk_n_selected:"{n} selected",bulk_completed:"{n} tasks completed",bulk_archived:"{n} tasks archived",bulk_delete_objects_confirm:"Delete {n} objects and all their tasks? Archiving keeps their history instead.",bulk_objects_deleted:"{n} objects deleted",bulk_objects_archived:"{n} objects archived",bulk_assign:"Assign",bulk_assign_one:"One person",bulk_assign_rotate:"Several people, in turns",bulk_assign_hint:"Replaces who is assigned to the selected tasks \u2014 a rotation included.",bulk_rotation_min_two:"Pick at least two people.",bulk_labels_add:"Add labels",bulk_labels_remove:"Remove labels",bulk_edit_hint:"Only the ticked settings change; everything else stays as it is.",bulk_no_notifications:"No notifications for these tasks",bulk_updated:"{n} tasks updated",bulk_paused:"{n} tasks paused",bulk_resumed:"{n} tasks resumed",bulk_objects_area:"Area set for {n} objects",bulk_failed:"{n} failed: {reason}",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",last_done_days_ago:"done {n} d ago",last_done_today:"done today",no_due_date:"No due date",next_due:"Next due",kpi_reported_by_sensor:"Reported by the sensor",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",trigger_type_due_date:"Date from a sensor",runtime_hours:"Target runtime (hours)",days_before:"Days before the date",days_before_help:`For a sensor that reports when the maintenance is due (a date or timestamp). 0 = on the date itself. The device's own "done" button moves the date forward, which clears the trigger \u2014 make it the completion action.`,target_value:"Target value",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",calendar:"Calendar entity",calendar_entity_label:"Calendar",calendar_entity_hint:"Due once per event of this calendar, on the event's start date \u2014 the next event after the last completion.",calendar_entity_required:"Choose a calendar entity.",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",recurrence_last_day:"Last day of the month",recurrence_business_day:"Business days only (roll back from weekend)",recurrence_offset:"Offset (days, \xB1)",recurrence_offset_help:"Shift the date by \xB1N days, e.g. -2 = two days before.",recurrence_months_label:"Only in these months",recurrence_months_hint:"The date repeats in the selected months only; pick one month for a yearly task. None = every month.",last_day_month:"Last day of month",last_business_day_month:"Last business day",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",reading:"Reading",custom:"Custom",history:"History",cost:"Cost",cost_kind_credit:"Credit",cost_credit_hint:"Money back \u2014 a sale, a refund. It lowers the totals; the average per completion leaves it out.",report_button:"Report",report_title:"Maintenance report",report_generated:"Generated",report_times_done:"Done",report_total_cost:"Total cost",report_notes:"Notes",report_col_type:"Type",report_col_status:"Status",report_col_schedule:"Schedule",duration:"Duration",minutes_short:"min",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",require_on_completion:"Require on completion",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",ws_err_not_found:"Not found \u2014 it may have been deleted meanwhile",ws_err_invalid_input:"Invalid input",ws_err_invalid_date:"Invalid date",ws_err_invalid_format:"Invalid format",ws_err_invalid_url:"Invalid link",ws_err_invalid_mirror_todo:"Invalid to-do list",ws_err_not_configured:"Not set up yet",ws_err_not_loaded:"Not loaded yet \u2014 try again in a moment",ws_err_limit_reached:"Limit reached",ws_err_too_many:"Too many entries",ws_err_too_large:"Too large",ws_err_not_archived:"Not archived",ws_err_invalid_target:"Invalid target",ws_err_create_failed:"Could not be created",ws_err_archived:"Archived \u2014 restore it first",ws_err_already_archived:"Already archived",ws_err_unavailable:"Currently unavailable",ws_err_unauthorized:"Not permitted for your user",ws_err_too_many_views:"Too many saved views",ws_err_replace_failed:"Replacement failed",ws_err_not_paused:"Not paused",ws_err_not_available:"Nothing available",ws_err_no_url:"No link given",ws_err_no_phases:"This task has no phases",ws_err_invalid_view:"Invalid view",ws_err_invalid_user:"Unknown user",ws_err_invalid_range:"Invalid range",ws_err_invalid_parent:"Invalid parent object",ws_err_invalid_device:"Unknown device",ws_err_empty_csv:"The CSV file is empty",ws_err_empty:"Nothing to import",ws_err_duplicate_failed:"Could not duplicate",ws_err_already_paused:"Already paused",ws_err_invalid_cursor:"Invalid phase position",ws_err_invalid_entity_slug:"Invalid entity name",ws_err_invalid_trigger_config:"Invalid trigger configuration",ws_err_no_defaults:"No quick-complete defaults set",ws_err_self_link_device:"An object cannot be linked to itself",ws_err_too_early:"Too early \u2014 this task can only be completed closer to its due date",ws_err_invalid_search_template:"The search link must be an http(s) URL containing {q}",ws_err_invalid_notify_service:"Invalid notification service format. Use 'notify.service_name' (e.g., notify.mobile_app_phone).",ws_err_notify_service_not_found:"This notification service was not found in Home Assistant. Please verify the service name.",ws_err_invalid_shopping_list_entity:"The shopping list must be a to-do entity (todo.\u2026).",ws_err_invalid_icon:"The notification icon must be an mdi: name, e.g. mdi:air-filter",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_toggle:"Due at a specific time",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",notes_markdown_hint:"Markdown is supported \u2014 **bold**, lists, [links](\u2026)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",completed_at_optional:"Completed at (optional, empty = now)",completed_at_pick:"Set date & time",completed_at_future_error:"The completion date cannot be in the future.",ha_time_zone_hint:"Time in Home Assistant's time zone ({zone})",days:"days",days_few:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",task_section_schedule:"Schedule",task_section_trigger:"Sensor trigger",task_section_completion:"Completing it",task_section_people:"People",task_section_notifications:"Notifications",task_section_details:"Details",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",priority:"Priority",labels:"Labels",labels_placeholder:"e.g. safety, seasonal, tenant-visible",labels_help:"Comma-separated tags for filtering and reporting.",task_mirror_todo:"Mirror into to-do lists",task_mirror_todo_hint:"The task appears in these lists while it is due; checking it off there completes it here.",priority_low:"Low",priority_normal:"Normal",priority_high:"High",all_priorities:"All priorities",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",earliest_completion_days:"Earliest completion (days before due)",earliest_completion_days_help:"Leave empty to allow completing any time. 0 = only on/after the due date.",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",interval_anchor_hint:"From completion date: the next due date counts from the day the task is marked done, so doing it early or late moves the schedule. From planned date: the schedule keeps its dates, for example when a bill is paid weeks before it is due.",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",object_replaces:"Replaces",object_replaced_by:"Replaced by",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",all_parts:"All parts",all_areas:"All areas",areas_filter:"Filter areas\u2026",areas_filter_none:"No area matches the filter.",area_cost_year:"Cost {year}",area_object_count:"{n} objects",area_object_count_one:"1 object",area_range_12m:"Last 12 months",area_range_all:"All time",area_task_filter:"Filter by task\u2026",area_kpi_completions:"Completions",area_kpi_total_time:"Total time",area_cost_per_month:"Cost per month",area_cost_per_year:"Cost per year",area_cost_per_object:"Cost per object",area_cost_share:"Share",area_history_section:"History (all objects)",area_report_print:"Area report (PDF)",area_report_title:"Area report",area_report_period:"Period",area_no_costs:"No costs recorded in this period.",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",trigger_equals:"Trigger when equal to (=)",trigger_not_equals:"Trigger when different from (\u2260)",for_at_least_minutes:"For at least (minutes)",safety_interval:"Safety interval (optional)",trigger_combinator:"Combine trigger and interval",trigger_combinator_any:"Trigger or interval (whichever first)",trigger_combinator_all:"Trigger and interval (both required)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",adaptive_prediction_enabled:"Enable sensor-driven predictions",adaptive_seasonal_enabled:"Enable seasonal awareness",adaptive_max_interval:"Maximum interval (days)",adaptive_min_interval:"Minimum interval (days)",adaptive_ewa_alpha:"Learning rate (alpha)",adaptive_enabled:"Enable adaptive scheduling",adaptive_section_title:"Adaptive Scheduling",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",shared_with:"Shared with (rotation)",shared_with_help:"Pick multiple people to share this task; the responsible person rotates on each completion.",rotation_strategy:"Rotation",rotation_none:"No rotation",rotation_round_robin:"Round-robin",rotation_least_completed:"Least completed",rotation_random:"Random",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_every_n_days:"every {n} days",cal_every_day:"every day",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",hide_outliers:"Hide outliers (sensor glitches)",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",clear:"Clear",date_type_toggle:"Type the date",date_type_invalid:"Not a valid date \u2014 try 1978-03-15, a year like 1978, or your own date format",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",subsave_warning:"Saved, but one setting was rejected: {detail}",qr_print:"Print",qr_download:"Download SVG",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_action_quick_complete:"Quick-complete \u2014 no dialog",qr_print_quick_none:"Quick-complete codes need quick-complete defaults on a task (Settings \u2192 Advanced Features \u2192 Completion actions; task dialog \u2192 Quick-complete defaults) \u2014 none of the chosen objects' tasks has them yet.",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",strat_this_month:"This Month",strat_later:"Later",strat_week:"Week",strat_fortnight:"Fortnight",strat_month:"Month",strat_year:"Year",strat_other:"Other",strat_status:"Status",strat_empty_title:"No maintenance objects yet",strat_empty_content:"Open the Maintenance panel to add your first object \u2014 pool pump, HVAC filter, vehicle, anything that needs scheduled care.",strat_open_panel:"Open Maintenance panel",strat_add_object:"Add object",strat_not_loaded:"**Maintenance Supporter** is not loaded. Install/enable the integration first.",strat_group_by:"Group views by",strat_group_area:"By area (default)",strat_group_status:"By status (Overdue / Triggered / Due Soon / OK)",strat_group_floor:"By floor (uses HA floors)",strat_group_due_date:"By due date (Overdue / Today / Week / Month / Later)",strat_group_calendar:"Rolling calendar (Week / Fortnight / Month / Year)",strat_editor_help:'The "Overview" view is always first. Empty groups are skipped.',picker_name_calendar:"Maintenance Supporter \u2014 Calendar",picker_name_panel:"Maintenance Supporter \u2014 Panel",picker_name_budget:"Maintenance Supporter \u2014 Budget",picker_name_groups:"Maintenance Supporter \u2014 Groups",picker_name_vacation:"Maintenance Supporter \u2014 Vacation",picker_name_battery_fleet:"Battery Fleet",picker_name_section:"Maintenance Supporter \u2014 Section",picker_name_vacation_status:"Maintenance Supporter \u2014 Vacation Status",picker_name_budget_status:"Maintenance Supporter \u2014 Budget Status",picker_desc_card:"Overview of your maintenance tasks with quick actions.",picker_desc_calendar:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",picker_desc_panel:"The complete Maintenance Supporter panel as a card \u2014 for a panel view / dashboard subview without the sidebar entry.",picker_desc_budget:"Edit the monthly and yearly budget right on the dashboard.",picker_desc_groups:"Create, rename and delete task groups right on the dashboard.",picker_desc_vacation:"Switch vacation mode on or off and set its dates right on the dashboard.",picker_desc_battery_fleet:"All tracked batteries: what is low now, what runs out soon, and what to buy.",picker_desc_dashboard:"Auto-generated dashboard. Group views by area, status, floor, or due date \u2014 picked from the strategy editor or YAML.",picker_desc_section:"Embed maintenance tasks (filterable by area, status, due date) as a section in any dashboard view.",picker_desc_vacation_status:"Compact vacation-mode status banner. Tap to open settings in the panel.",picker_desc_budget_status:"Monthly + yearly maintenance budget overview. Tap for details.",picker_desc_groups_status:"List of configured task groups with member counts.",hist_note_button:"Completed from dashboard button",hist_note_todo:"Completed from the To-do list",hist_note_voice:"Completed by voice",hist_note_notification:"Completed from the notification",hist_note_nfc:"Completed via NFC tag",hist_note_shopping_list:"Completed from the shopping list",hist_note_todo_mirror:"Completed from a mirrored to-do list",hist_note_skipped_notification:"Skipped from notification",hist_note_skipped_button:"Skipped from dashboard button",hist_note_sensor_triggered:"Sensor trigger activated",hist_note_initial:"Initial value set during task creation",hist_note_auto_recovered:"Auto-completed: sensor recovered ({value})",hist_note_auto_recovered_plain:"Auto-completed: sensor recovered",hist_note_reset:"Reset to {date}",hist_note_trigger_replaced:"Trigger entity replaced: {old} \u2192 {new}",hist_note_trigger_removed:"Sensor trigger removed (entity was: {entity}). Schedule converted to {schedule}.",hist_note_compound_removed:"Entity {entity} removed from compound trigger; {count} conditions remain.",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",compound:"Compound (multiple conditions)",compound_logic_and:"AND \u2014 all conditions must trigger",compound_logic_or:"OR \u2014 any condition triggers",compound_help:"Combine several sensor conditions into one trigger.",compound_no_conditions:"No conditions yet \u2014 add at least one.",compound_add_condition:"Add condition",compound_condition:"Condition",compound_remove_condition:"Remove condition",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_action_style:"Complete button style",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_areas:"Filter by areas",card_filter_areas_help:"Empty = show all areas.",card_filter_priority_help:"Empty = show all priorities. Tasks without an explicit priority count as Normal.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",place_optional:"Place (zone, optional)",remind_on_site:"Remind only while somebody is there",remind_on_site_hint:"Reminders wait until somebody is in this zone. Whoever arrives there gets a message with what is due.",place_missing:"Zone not found: reminders as at home",place_home:"Home",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_delete_entry:"Delete entry",history_delete_confirm_entry:"Delete this history entry? The task's last-performed date falls back to the previous completion; photos stay with the object.",history_delete_returns_parts:"The parts it used go back to stock: {parts}.",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",notify_icon:"Notification icon",notify_icon_hint:"Shown by the Companion app on Android. Empty = the icon of this task's maintenance type ({default}).",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",tab_today:"Today",palette_placeholder:"Search objects, tasks, spare parts, documents, notes\u2026",palette_no_results:"No matches",palette_hint:"\u2191\u2193 to navigate \xB7 Enter to open \xB7 Esc to close \xB7 / opens the search anywhere",search_open:"Search",search_group_parts:"Spare parts",search_group_content:"In documents",search_group_history:"History notes",search_page:"Page {page}",search_empty_hint:"Type to search objects, tasks, spare parts, documents and notes",search_searching:"Searching documents and notes\u2026",search_index_status:"Full-text search: {indexed} of {total} files indexed \xB7 {no_text} without text layer \xB7 {pending} pending",today_all_caught_up:"All caught up! Nothing due this week.",today_overdue:"Overdue",today_due_today:"Due today",today_this_week:"This week",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_consumable_threshold:"Consumable low threshold (%)",settings_battery_low_percent:"Battery low threshold (%)",settings_battery_recovered_percent:"Battery counts as replaced above (%)",settings_battery_recovered_percent_hint:"A low battery stays counted as low until its level rises above this value or a replacement is recorded \u2014 so a level hovering around the low threshold cannot complete the fleet task again and again.",settings_battery_low_delay:"Battery counts as low after (minutes)",settings_battery_low_delay_hint:"A battery must read low this long before it counts as low, so a sensor that reports a very low level for a moment and recovers by itself does not put it on the list. 0 = at once.",settings_battery_auto_record:"Record a replacement automatically when a low battery recovers",settings_battery_auto_record_hint:"When a battery that was low rises above the recovery threshold, the replacement date is recorded in Battery Notes and the spare cells are taken from stock \u2014 no tap needed.",settings_battery_lifetimes:"Typical battery lifetimes",settings_battery_lifetimes_hint:'Only used for batteries without a percentage: a Battery Notes note that has just a type and a last-replaced date, or a sensor that only reports "low". Their due date is last replaced + this lifetime. Batteries that report a level get their forecast from the measured discharge instead. Once the fleet has seen three replacements of a type, the median interval takes over from the built-in value \u2014 your own value always wins.',settings_battery_lifetime_months:"months",settings_battery_lifetime_reset:"Use default",settings_battery_lifetime_in_fleet:"in your fleet",settings_battery_lifetime_learned_models:"Learned per model: {list}",settings_thresholds_hint:"Defaults for new Suggested setups (percent-remaining consumables) and for fleet batteries without their own Battery Notes threshold. Existing tasks keep their value.",settings_part_search_url:"Shopping search link",settings_part_search_url_hint:"URL with {q} in place of the search terms, used for parts without a product link. Leave empty for the automatic store (by country, then by language).",settings_value_out_of_range:"Value must be between {min} and {max}",bn_summary:"{name}: {pct} % for {n} batteries",bn_floor_decides:"Your {floor} % floor decides for all of them; the higher of the two thresholds counts per battery.",bn_above_floor:"That is above your {floor} % floor, so {name} decides for all noted batteries.",bn_overrides:"{n} devices with their own threshold:",bn_more:"+ {n} more",settings_row_actions:"Task row actions",settings_ref_numbers_in_lists:"Reference numbers in lists",settings_ref_numbers_in_lists_hint:"Show the #8 / #8.3 chips in front of object and task names in the Today list, the task table, the object cards and the objects table.",settings_compact_refs:"Compact reference numbers",settings_compact_refs_hint:"Renumbers all objects, tasks and completions in order (1, 2, 3 \u2026) and closes the gaps left by deletions. Numbers already printed on service booklets, photos or notes will no longer match.",settings_compact_refs_confirm:"Renumber every object, task and completion sequentially in creation order? Numbers already written on printed service booklets, photos or notes will no longer match. This cannot be undone.",settings_compact_refs_done:"Renumbered {objects} objects, {tasks} tasks and {completions} completions.",row_actions_buttons_compact:"Buttons (icons only on phones)",row_actions_buttons:"Buttons with text",row_actions_icons:"Icons (classic)",row_actions_follow:"Follow the household setting",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",settings_shopping_list:"Shopping list (buy tasks)",settings_shopping_list_help:"Low-part buy reminders appear in this to-do list; checking one off restocks the part.",shopping_list_none:"Off \u2014 no shopping list",settings_install_assist_sentences:"Install Assist sentences",settings_install_assist_sentences_hint:"Copies the voice sentences into your configuration so the classic Assist agent recognises them. A file you edited yourself is never overwritten.",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",notify_per_person:"Per-person delivery",member_avatars:"Member avatars",member_avatars_hint:"Shown next to assigned tasks \u2014 initials in the member's colour. Defaults come from the name; set your own initials or pick a colour to tell members apart.",member_initials:"Initials",member_color:"Colour",member_avatar_reset:"Reset",notify_no_own_device:"No own device \u2014 uses the household service",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_reminder_leads:"Extra reminders (days before due)",settings_reminder_leads_hint:"Comma-separated lead times, e.g. 14, 3, 0 \u2014 one extra reminder fires on each matching day. Empty = off.",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_weekly_digest:"Weekly digest",settings_weekly_digest_hint:"A single summary notification on Monday morning when tasks are due.",settings_warranty_reminder:"Warranty expiry reminder",settings_warranty_reminder_days:"Days before expiry",settings_warranty_reminder_hint:"Notify once when an object's warranty is this many days from expiring.",settings_snooze_hours:"Snooze duration (hours)",settings_snooze_hours_hint:"How long Snooze mutes a task's reminders \u2014 from the task menu, a card, voice or the phone's Snooze button. The due date stays as it is.",settings_budget:"Budget",settings_currency:"Currency",settings_currency_decimals:"Decimal places for amounts",settings_currency_decimals_hint:"How many decimals every amount shows: KPIs, budgets, costs in lists and reports, budget alerts. 0 = whole numbers.",settings_parts_cost_mode:"Spare parts count as spending",settings_parts_cost_purchase:"When bought",settings_parts_cost_use:"When used",settings_parts_cost_mode_hint:"When bought: a buy reminder's cost counts, and the parts a job uses are shown as information. When used: every completion books the value of the parts it used, and a purchase sets the part's price instead of counting. Applies to completions from now on \u2014 history keeps how it was booked.",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_export_settings:"Export settings (JSON)",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_import_unmatched_users:"Not found on this instance: {names}. Their task assignments were removed \u2014 add people with the same names in Home Assistant and import again to keep them.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",settings_export_selection:"Limit to selected objects (optional)",settings_docs_archive:"Documents archive (with files)",settings_docs_archive_hint:"The JSON and YAML exports list your documents but not their files; CSV leaves documents out. This ZIP holds the uploaded files \u2014 restore it after importing the JSON and nothing is missing.",settings_docs_export_btn:"Download documents ZIP",settings_docs_import_btn:"Restore documents ZIP",settings_docs_import_success:"Restored: {blobs} files, {docs} documents",settings_docs_import_missing:"{n} skipped \u2014 their files were not in the ZIP",settings_docs_import_unmatched:"No object here matches {names}: their files were kept but not attached",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",groupby_object:"By object",filter_label:"Filter",user_label:"User",photo_label:"Photo",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",state_latch_help:"With 1 transition the trigger is a latch: it recovers when the entity leaves the To-state \u2014 or, with only a From-state set, when it returns to that state.",for_minutes_state_help:"0 counts every change immediately. Set minutes and the new state must hold that long first \u2014 brief flickers then neither trigger nor count.",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_ended:"Ended",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else only gets Complete, Skip, Reset, Postpone and Snooze.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc:"Per-task HA action on complete + quick-complete QR with pre-set values.",feat_places:"Places",feat_places_desc:"Objects maintained at another place (a Home Assistant zone): reminders only while somebody is there, and a message on arrival.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_target_more:"This action targets more than this field shows: {targets}. That is kept as it is \u2014 choosing another entity here replaces the whole target.",on_complete_action_skip_auto:"Not when the task completes itself (its sensor recovered)",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",action_test_bad_format:"Invalid service format (expected 'domain.service')",action_test_unknown_service:'Service "{service}" is not registered in Home Assistant. Check the spelling and that the integration providing it is loaded.',action_test_domain_mismatch:`Service "{service}" only works on {domain}.* entities; entity "{entity}" is in {entity_domain}.* \u2014 pick a service that matches the entity's domain (e.g. {suggestion})`,action_test_entity_missing:'Target entity "{entity}" was not found in Home Assistant \u2014 it may have been renamed or its integration removed.',quick_complete_defaults_title:"Quick-complete defaults (for QR scans, optional)",quick_complete_defaults_desc:"Pre-set values for quick-complete QR scans. Without these, the QR opens the complete dialog.",quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026",archive:"Archive",undo:"Undo",task_completed_named:"Completed: {task}",undo_done:"Completion undone",undo_done_action_ran:"Completion undone. Its completion action had already run and cannot be taken back.",undo_nothing:"Nothing to undo. Only your own last completion can be taken back, within 10 minutes.",undo_changed:"Can't undo. The task has changed since.",task_archived:"Task archived",object_archived:"Object archived",unarchive:"Unarchive",archived:"Archived",show_archived:"Show archived",hide_archived:"Hide archived",section_collapse:"Collapse section",section_expand:"Expand section",confirm_archive_object:"Archive this object and its tasks? They keep their history and can be unarchived later.",settings_archive:"Archive & Retention",settings_archive_desc:"Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",settings_archive_oneoff_days:"Auto-archive completed one-off tasks after (days, 0 = off)",settings_delete_archived_oneoff_days:"Auto-delete archived one-off tasks after (days, 0 = never)",archive_object:"Archive object",unarchive_object:"Unarchive object",documents:"Documents",documents_empty:"No documents yet.",doc_upload:"Upload file",doc_uploading:"Uploading\u2026",doc_add_link:"Add link",doc_link_url:"URL (https://\u2026)",doc_link_title:"Title (optional)",doc_open:"Open",doc_delete_confirm:'Delete "{name}"?',doc_too_large:"File is too large (max 100 MB).",doc_upload_failed:"Upload failed.",docs_archive_too_large:"The archive is too large (max {max}).",docs_archive_no_manifest:"This ZIP has no manifest.json, so the restore cannot tell which document a file belongs to. Keep manifest.json next to the folders when zipping again.",completion_photos_optional:"Completion photos (optional)",completion_photos:"Completion photos",choose_photos:"Choose photos",choose_photo:"Choose photo",photos_android_hint:"The Android app hands over one photo per pick \u2014 each pick is added.",photos_limit:"Up to {max} photos per completion",history_edit_photos_hint:"Removing a photo here keeps the file in the object's documents.",uploading:"Uploading\u2026",remove:"Remove",doc_deduped:"Already stored elsewhere \u2014 shared, no extra space used.",doc_dup_in_object:"This file is already attached to this object.",doc_link_not_allowed:"This link is not allowed: links that run scripts or open local files (javascript:, data:, file: \u2026) are refused.",doc_cat_manual:"Manual",doc_cat_warranty:"Warranty",doc_cat_invoice:"Invoice",doc_cat_spare_parts:"Spare parts",doc_cat_photo:"Photo",doc_cat_other:"Other",doc_link_badge:"Link",doc_storage_title:"Document storage",doc_storage_saved:"Saved via deduplication",doc_storage_refresh:"Refresh",doc_download:"Download",doc_close:"Close",doc_camera:"Take photo",camera_capture_shoot:"Capture",camera_switch_lens:"Switch camera",camera_switching:"Switching camera\u2026",camera_not_answered:"This camera did not answer. Tap the switch again to try the next one, or use the file picker.",camera_diagnostics:"Details for a bug report",camera_copy:"Copy",camera_copied:"Copied",doc_drop_hint:"Drop files here",doc_task_none:"No documents linked to this task.",doc_link_existing:"Link a document\u2026",doc_attach:"Link",doc_unlink:"Unlink",doc_page:"Page",chart_range_7d:"7d",chart_range_30d:"30d",chart_range_90d:"90d",chart_range_1y:"1y",chart_since_service:"since last service",chart_no_stats:"No long-term statistics for this entity \u2014 showing maintenance-event values only",auto_complete_on_recovery:"Auto-complete when the sensor recovers",auto_complete_on_recovery_help:"Records a completion (sets last performed) when the trigger clears itself \u2014 e.g. salt refilled, filter replaced.",doc_search:"Search documents\u2026",doc_search_none:"No matching documents",doc_description:"Description (optional)",doc_sort:"Sort documents",doc_sort_newest:"Newest first",doc_sort_oldest:"Oldest first",doc_sort_title:"By title (1, 2, 3 \u2026)",doc_sort_category:"By category",link_device_optional:"Link to existing device (optional)",parent_object_optional:"Parent object (optional)",parent_none:"(No parent)",paused:"Paused",pause_object:"Pause",resume_object:"Resume",pause_task:"Pause",resume_task:"Resume",pause_task_prompt:"Freeze this task's schedule \u2014 it does not become due and does not notify until you resume it, and resuming starts a fresh cycle from that day. The object's other tasks keep running. Optionally set a date to resume by itself.",task_paused:"Task paused",task_resumed:"Task resumed \u2014 its schedule restarted",pause_until_prompt:"Freeze this object's schedules \u2014 nothing becomes due and nothing notifies until it is resumed. Optionally set an auto-resume date.",pause_until_label:"Resume on (optional)",object_paused:"Object paused",object_resumed:"Object resumed \u2014 schedules restarted",object_paused_badge:"Paused",paused_until_label:"until",replace_object:"Replace\u2026",replace_object_prompt:"Retire this object and create a successor. History and costs stay archived on the old one; tasks and documents carry over to the new one, counters start fresh.",replace_name_label:"Successor name",replace_device_heading:"Device in Home Assistant",replace_device_keep:"Same device as before ({device})",replace_device_keep_hint:"Also the choice when the new unit is not in Home Assistant yet: once it is, pick it as the object's device in its settings \u2014 the sensor triggers move along then.",replace_device_other:"The new unit is another device",replace_device_pick:"Device of the new unit",replace_device_other_hint:"Sensor triggers, completion actions and the counter reset move to the matching entities of that device.",replace_device_none:"No device",object_replaced:"Object replaced \u2014 successor created",device_swap_moved:"{count} sensor links moved to the new device.",device_swap_moved_one:"One sensor link moved to the new device.",device_swap_unmatched:"{count} could not be matched \u2014 check those tasks' sensor triggers.",device_swap_unmatched_one:"One could not be matched \u2014 check that task's sensor trigger.",reading_unit_label:"Reading unit (e.g. kWh, m\xB3)",reading_unit_help:"Shown next to the recorded value when completing this task.",reading_value_label:"Reading value",reading_label:"Reading",readings_section:"Readings",readings_hint:"Several named values per completion \u2014 one row per meter. Leave empty to record a single value.",reading_name_label:"Reading name",reading_unit_short:"Unit",reading_add:"Add reading",reading_duplicate_name:"Name already used",reading_last:"last: {value}",reading_below_last:"Lower than the last reading ({value})",settings_templates_label:"Template gallery",settings_templates_hint:`Untick templates you'll never need \u2014 they disappear from the "From template" pickers (panel and config flow). Nothing else changes; you can re-enable them any time.`,home_profile_title:"Home profile",home_profile_hint:"Recommends templates and sets seasonal windows for your climate and hemisphere. Everything is worked out locally from your floors, areas and home location.",home_type_label:"Home type",home_type_auto:"Automatic ({detected})",home_region_label:"State, province or region",home_region_none:"not found",home_region_hint:"Some rules differ within a country \u2014 a yearly vehicle inspection in one state, none in the next. Found from your home location.",home_dwelling_house:"House",home_dwelling_apartment:"Apartment",home_dwelling_unknown:"not recognised",home_detected_from:"Detected from: {reasons}",home_reason_floors:"several floors",home_reason_basement:"a basement",home_reason_garden:"a garden",home_reason_shed:"a shed",home_reason_driveway:"a driveway",home_reason_garage:"a garage",home_reason_attic:"an attic",home_reason_lawn_mower:"a lawn mower",home_reason_gate:"a gate",home_reason_balcony:"a balcony",home_reason_small_home:"few rooms on one floor",home_reason_ups:"a UPS",home_climate_label:"Climate",home_climate_value:"K\xF6ppen {koppen} \xB7 coldest month {cold} \xB0C \xB7 warmest month {warm} \xB0C",home_climate_unknown:"No home location set in Home Assistant",home_hemisphere_south:"Southern hemisphere \u2014 seasonal windows are mirrored",home_trait_freeze:"Frost in winter",home_trait_snow:"Snowy winters",home_trait_severe_winter:"Severe winters",home_trait_damp:"Damp climate",home_trait_mediterranean:"Mediterranean climate",home_trait_earthquake:"Earthquake region",home_trait_hot_summer:"Hot summers",home_trait_hot_humid:"Hot and humid",home_trait_hot_dry:"Hot and dry",home_trait_termites:"Termite region",home_trait_wildfire:"Wildfire risk",home_trait_cyclone:"Hurricane / typhoon region",home_trait_tropical:"Tropical climate",home_trait_radon:"Radon test recommended",home_reason_starter:"Basics for your home",home_reason_country:"Common in {country}",home_reason_feature:"Found in your home: {feature}",templates_recommended_title:"Recommended for your home",templates_recommended_hint:"Based on your home profile \u2014 adjust it in Settings.",templates_legal_hint:"Notes on legal duties and intervals are guidance, not legal advice. Rules vary by region and change over time \u2014 local regulations and the manufacturer's instructions take precedence.",templates_not_typical:"Not typical for your home type",templates_set_up:"Already set up",worksheet:"Work sheet",worksheet_scan_view:"Scan to open the task",worksheet_scan_complete:"Scan to complete",worksheet_manual_excerpt:"Manual excerpt",worksheet_pages:"pages",worksheet_printed:"Printed",worksheet_never:"Never",card_all_caught_up:"All caught up \u2014 nothing needs attention",postpone:"Postpone",postpone_date_prompt:"Postpone this occurrence to which date?",postpone_date_label:"New due date",postponed:"Postponed",postponed_to:"Postponed to",season_window_label:"Seasonal window (months)",season_window_hint:"Only due in the selected months; off-season dates roll to the next active month. None = all year.",series_end_label:"Ends",series_end_never:"Never (repeats indefinitely)",series_end_after_count:"After a number of times",series_end_until:"On a date",series_end_count_label:"Number of times",series_end_until_label:"End date",parts_section:"Parts & consumables",parts_inventory_value:"Inventory value",part_add:"Add part",part_name:"Name",part_vendor:"Manufacturer",part_storage_location:"Storage location",part_product_url:"Product URL",part_unit:"Unit",part_cost:"Unit price",part_cost_mode:"Counts as spending",part_cost_mode_house:"As in Settings ({mode})",part_cost_mode_hint:"When bought: the purchase counts, in the year it is made. When used: every completion that uses the part books its price on the object, and so the area, where it is used.",part_stock:"Stock",part_reorder_threshold:"Reorder at",part_restock_quantity:"Restock quantity",part_package_size:"Package size (units)",part_restock_packages:"Restock amount (packages)",part_package_hint:"Bought in packages, used in the unit: stock, the amount a task uses and the reorder threshold count units; the restock amount and the price are per package.",part_auto_buy:"Auto-create buy task when low",part_reuse:"After use",part_reuse_none:"Used up",part_reuse_charge:"Charged",part_reuse_sharpen:"Sharpened",part_reuse_clean:"Cleaned",part_reuse_dry:"Dried",part_reuse_refill:"Refilled",part_reuse_restore:"Restored",part_waiting_charge:"{count} to charge",part_waiting_sharpen:"{count} to sharpen",part_waiting_clean:"{count} to clean",part_waiting_dry:"{count} to dry",part_waiting_refill:"{count} to refill",part_waiting_restore:"{count} to restore",part_restoring:"Used, not ready yet",part_ready_again_hint:"All used ones are ready again",part_dispose:"Dispose",part_dispose_hint:"Gone for good, such as a dead cell: off the waiting pile, not back to the stock",part_dispose_how_many:"How many are gone for good",part_reuse_hint:"A used one is not gone: it waits until it is ready again and still counts as owned, so it is not bought again.",part_restock:"Adjust stock",parts_used_by:"Used by",restock_quantity_label:"Quantity bought",consumes_parts_label:"Consumes parts",task_parts_fleet_hint:"Battery quantities come from Battery Notes per device \u2014 nothing to link here.",shared_parts_other_objects:"Parts from other objects",shared_parts_help:"Several objects can share one stock. Completing this task takes from the owning object.",shared_part_unknown:"Unknown part",parts_load_failed:"Couldn't load this object's parts \u2014 the consumes-parts options are unavailable right now.",adopt_problem_button:"Adopt problem sensors",adopt_problem_title:"Adopt problem sensors",adopt_problem_hint:"Turn HA problem sensors (printer errors, filter warnings, low battery) into maintenance tasks that trigger while the problem is active and clear themselves when it resolves.",adopt_problem_none:"No problem sensors found that aren't already tracked.",adopt_problem_active:"active",adopt_problem_ok:"ok",adopt_problem_new_object:"(new)",adopt_object_hint:"Give several sensors the same object name and they become one object; type an existing object's name to add them there.",adopt_summary_title:"What adopting changes",adopt_summary_existing:'"{name}": tasks {before} \u2192 {after}',adopt_summary_totals:"Tasks: {tasks} \xB7 objects: {objects}",adopt_summary_totals_new:"Tasks: {tasks} \xB7 objects: {objects} ({new} new)",adopt_problem_adopt:"Adopt selected",adopt_problem_done:"Adopted {tasks} problem sensor(s)",adopt_problem_done_one:"Adopted 1 problem sensor",views_label:"Views",views_none:"\u2014 No view \u2014",views_manage:"Save / manage views",views_dialog_title:"Saved views",views_dialog_hint:"Save the current filters as a named view everyone can reuse.",views_name_placeholder:"View name",views_save_current:"Save current filters",views_none_yet:"No saved views yet.",close:"Close",trigger_hint_now:"The sensor reads {value} right now.",trigger_hint_above:"The task triggers once it rises above {target}.",trigger_hint_below:"It triggers once it falls below {target}.",trigger_hint_equals:"It triggers when it reads exactly {target}.",trigger_hint_not_equals:"It triggers when it reads anything but {target}.",trigger_hint_overlap:"These limits overlap: every reading triggers the task and it can never recover. Leave one of them empty.",trigger_hint_counter_delta:"Counts from the current reading ({value}): due at {due} (+{target}), and the count restarts after each completion.",trigger_hint_counter_delta_edit:"Counts usage since the last completion: due after +{target}; the count restarts after each completion.",trigger_hint_counter_abs:"The task becomes due once the sensor reaches {target}.",trigger_hint_runtime:"The task becomes due after {hours} h of accumulated on-time; the counter restarts after each completion.",trigger_hint_due_date:"The task becomes due {days} days before the date the sensor reports.",trigger_hint_due_date_one:"The task becomes due one day before the date the sensor reports.",trigger_hint_due_date_same_day:"The task becomes due on the date the sensor reports.",trigger_hint_due_date_now:"Reported date: {date}.",trigger_hint_state_change:"The task becomes due after {count} state change(s).",trigger_hint_state_change_to:"The task becomes due after {count} change(s) to \u201C{state}\u201D.",trigger_hint_state_now:"Current state: {value}.",adopt_problem_part:"Uses part: {name}",label_filter:"Label",all_labels:"All labels",filter_place:"Place",filter_place_all:"All places",settings_notify_scope:"Notify only for view",settings_notify_scope_all:"All tasks",settings_notify_scope_hint:"Only tasks matching the selected saved view's label/user filters send reminders. Status, sorting and grouping of the view are ignored here.",settings_notify_completed:"Completion notifications",settings_notify_completed_hint:`Household news when a task is completed, with the reason and who did it. "Automatic only" announces just the completions nobody made on the spot: sensor recovery, shopping-list check-off, an automation's service call. Sent to the household service only; quiet hours and the daily cap apply.`,settings_title_style:"Notification title style",settings_title_style_hint:"What appears as the notification's TITLE. Default keeps the per-status text (e.g. 'Maintenance overdue!'). Object name / Task name help when phone notifications stack.",title_style_default:"Default (per-status title)",title_style_object_name:"Object name as title",title_style_task_name:"Task name as title",notify_completed_off:"Off",notify_completed_automatic:"Automatic completions only",notify_completed_all:"All completions",settings_notify_rule:"Your own notification rule",settings_notify_rule_hint:"Every notification also fires the event maintenance_supporter_notification (kind, status, object, task, reference numbers, priority, deep link, the payload). Route it with an automation \u2014 e.g. into Ticker, Telegram or Pushover.",settings_notify_event_only:"Only fire the event, send nothing myself",settings_notify_event_only_hint:"Your automation is the whole delivery. Rate limits, quiet hours and the daily cap still apply to when the event fires.",settings_notify_extra_data:"Extra notification data (template)",settings_notify_extra_data_hint:"JSON or YAML, Jinja allowed; merged into the notify call's data (your keys win). Variables: kind, status, priority, labels, notes, area_name, object_name, task_name, object_ref, task_ref, days_until_due, next_due, last_performed, responsible_user_id, sensor_entity_id, url, target, title, message. Test it with the Send test button.",card_saved_view:"Saved view",card_saved_view_none:"None",card_saved_view_help:"Applies the view's status, user, label and priority filters on top of the filters above. The view's sorting and grouping are panel display settings and are not applied on the card.",panel_card_tab:"Open on tab",panel_card_tab_default:"Remembered tab (as in the panel)",panel_card_view:"Open with saved view",panel_card_height:"Height",panel_card_height_help:"Empty = fill the screen below the card (panel view). Otherwise a CSS length such as 600px or 80vh for views with other cards.",panel_card_not_registered:"The Maintenance Supporter panel is not available \u2014 is the integration set up?",panel_card_load_failed:"The Maintenance Supporter panel could not be loaded \u2014 reload the page (after an update: clear the browser cache).",doc_part_none:"No documents linked to this part.",settings_templates_toggle_group:"Enable or disable all templates in this group",setups_button:"Suggested setups",setups_title:"Suggested setups (Beta)",setups_hint:"Devices of supported integrations whose consumable sensors can drive maintenance tasks. Adopting creates the object and wires each task to its sensor \u2014 it triggers when the consumable runs low and resolves itself after replacement.",setups_none:"No supported devices with unwired consumable sensors found.",setups_adopt:"Set up selected",setups_done:"{tasks} sensor-wired tasks created.",setups_done_one:"1 sensor-wired task created.",complete_parts_used:"Parts used this time",part_delete_confirm:"Delete part '{name}'? Its stock tracking, task links and any open buy reminder will be removed.",baseline_start_value:"Start reading (optional)",baseline_start_help:"Counting starts from this reading. Leave empty to count from the current value; enter the reading at the last service so usage since then already counts.",setups_baseline_hint:"reading at last service (optional)",baseline_start_help_edit:"Leave empty to keep the existing counting. Entering a value re-anchors the counting (e.g. the reading at the last service).",baseline_current_effective:"Currently effective start value: {value}",runtime_on_states:"Active states",runtime_on_states_help:"States that count as running \u2014 default: on. E.g. mowing, cleaning, printing. With an attribute selected, its values are matched instead.",runtime_max_session:"Max session runtime (seconds)",runtime_max_session_help:"A single run counts at most this many seconds \u2014 protects against a sensor stuck ON (lost connection, restart). Empty = no cap.",trend_approaching:"Heading toward the threshold",trend_easing:"Easing away from the threshold",split_select_hint:"Select a task to see its details here",setups_target_new:"Create new: {name}",setups_target_match:"{name} \u2014 matches: {reasons}",setups_reason_model:"model number",setups_reason_name:"name",setups_reason_area:"area",setups_reason_sibling:"same model on another device",setups_maybe_covered:'Probably there already as "{name}"',setups_already:"Already there: {names}",setups_reset_line:"Completing it also resets the counter in the integration (\u201C{button}\u201D)",setups_reset_enable:"\u2014 the button gets switched on for this",reset_offers_title:"Reset counters on completion",reset_offers_hint:"These tasks watch a counter the integration keeps itself. Connected, completing the task here also presses the integration's reset button \u2014 otherwise the counter keeps running and the task falls due again right away.",reset_offers_before:"Now: completing it leaves the counter in {integration} running",reset_offers_after:"Then: it also presses \u201C{button}\u201D",reset_offers_renamed:"Renamed since it was set up \u2014 check that this task is for this part",reset_offers_apply:"Connect resets",reset_offers_done:"{count} tasks now reset their counter on completion",reset_offers_done_one:"1 task now resets its counter on completion",setups_before_after:"Tasks on the object: {before} \u2192 {after}",setups_new_object_count:'New object "{name}" \xB7 tasks: {count}',schedule_preview_title:"Next dates",schedule_preview_ontime:"Assuming on-time completion.",schedule_preview_ends:"(series ends)",adopt_problem_responsible:"Responsible user for all adopted tasks (optional)",adopt_for_minutes_hint:"Only trigger once the problem has persisted this long \u2014 0 reacts to the first flicker.",adopt_problem_configure:"Configure",history_auto:"Automatic",battery_fleet_title:"Battery fleet",battery_fleet_none_low:"All batteries OK \u2014 nothing to replace.",battery_fleet_progress:"{n} to replace",battery_fleet_buy_now:"Buy now",battery_fleet_soon:"Needed soon",battery_fleet_soon_hint:"Predicted from the last replacement date \u2014 order ahead.",battery_fleet_mark_all:"Mark all replaced",battery_fleet_mark_one:"Mark this battery replaced",battery_fleet_offline:"offline",battery_fleet_no_sensor:"No sensor",battery_fleet_trigger_lost:"This task's sensor trigger was lost \u2014 it will not fire or auto-complete.",battery_fleet_repair:"Repair",battery_fleet_exclude:"Exclude from the fleet",battery_fleet_excluded:"Excluded",battery_fleet_include:"Track again",battery_fleet_all:"All tracked batteries",battery_fleet_all_hint:"Exclude a device here to drop it from the fleet before it ever reports low \u2014 a vacuum that recharges itself, or a phone that warns you on its own.",battery_fleet_add:"Add a battery",battery_fleet_add_hint:"Pick a battery sensor the automatic discovery missed \u2014 it joins the roster immediately.",battery_fleet_track_self:"Track self-charging batteries",battery_fleet_track_self_hint:"Phones, vacuums and other devices that recharge themselves appear as rechargeables \u2014 a low one asks for a charge, never for new cells.",battery_fleet_due_without_sensor:"Treat a passed forecast as due when a battery has no sensor",battery_fleet_due_without_sensor_hint:"Some devices report no battery level at all \u2014 Battery Notes only knows the type and the last replacement. Once the typical lifetime has passed, such a battery counts as low and the fleet task reminds you; marking it replaced resets the forecast.",battery_fleet_ask_cells:"Ask which cells went in when a battery is replaced",battery_fleet_ask_cells_hint:"A device takes whatever is in the drawer. Replaced then asks whether disposable or rechargeable cells of its size went in, books those and remembers them for the device. Battery Notes keeps its type; the shopping list and the forecast follow it.",battery_fleet_cells_question:"Which cells went in?",battery_fleet_cells_rechargeable:"rechargeable",battery_fleet_status_low:"Low",battery_fleet_status_soon:"Soon",battery_fleet_status_ok:"Healthy",battery_fleet_status_due:"Due",battery_fleet_predicted_on:"Expected around {date}",battery_fleet_predicted_typical:"Expected around {date} \u2014 {months} months typical for {type} ({source})",lifetime_source_default:"built-in default",lifetime_source_table:"built-in table",lifetime_source_learned:"learned from {n} replacements",lifetime_source_override:"your setting",lifetime_source_learned_device:"learned from this device's {n} replacements",lifetime_source_learned_model:"learned from {n} replacements on devices of this model",battery_fleet_predicted_trend:"Predicted from this battery's discharge trend: around {date} ({confidence})",battery_fleet_rechargeable:"Rechargeable: charge instead of replacing \u2014 never on the shopping list",battery_fleet_sort_name:"Sort by name",battery_fleet_sort_urgency:"Sort by urgency",battery_fleet_mark_recharged:"Mark as recharged",battery_fleet_charging:"Rechargeable spares",battery_fleet_ready:"{count} ready",battery_fleet_sparkline_hint:"Battery level over the last 30 days \u2014 dotted: projected until the low threshold",battery_fleet_filter_type:"Show only this battery type",battery_fleet_record_replacement:"The level jumped around {date} \u2014 record this replacement in Battery Notes",battery_fleet_total:"{n} batteries tracked",battery_fleet_setup_button:"Battery fleet",battery_fleet_setup_done:"Battery fleet set up \u2014 one task tracks all your batteries.",update_banner:"A newer version of Maintenance Supporter is on the server \u2014 reload to update the panel.",update_reload:"Reload",restart_pending_banner:"Maintenance Supporter was updated to {version}. Restart Home Assistant to finish the update.",restart_pending_error:"That did not work: Maintenance Supporter was updated to {version}, but Home Assistant has not been restarted since. Restart Home Assistant, then try again.",row_actions_banner:"Complete and Skip in task rows are now buttons. Prefer the old icons?",row_actions_keep:"Keep buttons",row_actions_back:"Back to icons",battery_fleet_forecast_overdue:"Predicted date passed \u2014 the battery still reports healthy. If you swapped it, record the replacement; otherwise the forecast was off.",cost_from_parts:"Use \u2248 {amount} from parts",cost_parts_booked:"Parts used \u2248 {amount} are booked automatically \u2014 enter only additional costs.",cost_parts_info:"Parts used \u2248 {amount} \u2014 counted when they were bought, not here.",cost_purchase_use_hint:"The price paid becomes the part's price \u2014 spare parts count when they are used.",history_parts_counted:"Parts: {amount}",history_parts_counted_hint:"Value of the parts used \u2014 counted as spending",history_parts_info:"Parts \u2248 {amount}",history_parts_info_hint:"Value of the parts used \u2014 information only; the money counted when they were bought",history_purchase_stock:"Bought for {amount} (counted when used)",dismiss:"Dismiss",gs_label:"Getting started \u2014 these hints retire as your setup grows",gs_setups_chip:"Suggested setups found {n} devices with pre-wired triggers",gs_setups_chip_one:"Suggested setups found 1 device with pre-wired triggers",gs_adopt_chip:"{n} problem sensors can become maintenance tasks",gs_adopt_chip_one:"1 problem sensor can become a maintenance task",gs_fleet_chip:"One click sets up the battery fleet",gs_reset_chip:"{n} tasks can reset their counter in the integration",gs_reset_chip_one:"1 task can reset its counter in the integration",cal_editor_window:"Default window",cal_editor_window_week:"Week (7 days)",cal_editor_window_fortnight:"Fortnight (14 days)",cal_editor_window_month:"Month (30 days, default)",cal_editor_window_year:"Year (365 days, empty days collapsed)",cal_editor_window_past_30:"Past 30 days (history)",cal_editor_window_past_90:"Past 90 days (history)",cal_editor_show_chips:"Show window chips inside the card",cal_editor_chips_hint:"Hide the chips when the card is embedded in a strategy view that already serves as the window selector.",cal_editor_show_user_filter:"Show user filter dropdown",cal_editor_default_user:"Default user filter",cal_editor_my_tasks:"My tasks (current user)",cal_editor_show_object_filter:"Show object filter dropdown",cal_editor_object_hint:'Pre-select one object via YAML: object_filter: "<object name>" \u2014 or a list of names to restrict the card to several objects.',object_history_section:"History (all tasks)",object_history_all_tasks:"All tasks",object_history_empty:"No entries in this range.",object_history_cap_note:"History keeps up to 500 entries per task \u2014 very old entries may be missing.",service_record_title:"Service record",service_record_print:"Service record (PDF)",date:"Date",service_record_entries:"entries",ref_number:"Reference number",print_options_title:"Print service record",print_layout:"Layout",print_layout_chronological:"Chronological",print_layout_by_task:"By task",print_include:"Include",print_inc_readings:"Readings",print_inc_parts:"Parts used",print_inc_photos:"Photos",print_inc_documents:"Linked documents",print_inc_doc_desc:"Document descriptions",print_inc_checklist:"Checklist",print_inc_notes:"Notes",print_inc_costs:"Cost and duration",print_inc_person:"Completed by",print_inc_refs:"Reference numbers",print_inc_bare:"Completions without details",print_inc_qr:"QR code per task",print_button:"Print",report_scan_hint:"Scan to open the task",completed_by:"Completed by",date_from:"From",date_to:"To",phases_section:"Cycle phases (optional)",phases_hint:"Different work on one shared schedule \u2014 each completion moves to the next step (e.g. small service, small service, big service).",phase_add:"Add phase",phase_name:"Phase name",phase_sequence_label:"Cycle order",phase_sequence_add_step:"Add step",phase_current:"Current phase",phase_set:"Set as current",chart_history_fallback:"No long-term statistics for this entity \u2014 showing recorder state history (typically the last ~10 days)",chart_history_alarm:"Trigger view from recorder state history: 1 = alert state held for the hold time, 0 = fine (typically the last ~10 days)",chart_history_count:"Change count rebuilt from recorder state history since the last service (typically the last ~10 days)",prediction_cycles:"Learned from cycles",phase_require_override:"Override \u201CRequire on completion\u201D for this phase",history_add_past:"Add past completion",require_tag_scan:"Only complete by scanning the tag",require_tag_scan_help:"Proof of presence: Done is blocked on every surface until the NFC tag or QR code on the thing itself is scanned. Automations can pass 'via_tag_scan' to the complete service.",disallow_skip:"Don't allow skipping",disallow_skip_help:"The Skip action disappears from every surface, and the server refuses a skip from automations and voice too.",no_notifications:"No notifications for this task",no_notifications_help:"No reminders for this task \u2014 no status notifications, repeats, lead-time reminders or bundles. It still shows on the dashboard and in its entities; the weekly digest still counts it.",require_tag_scan_hint:"This task completes only by scanning its NFC tag or QR code on the thing itself \u2014 saving here will be refused."}});function Us(r){return r?.restart_pending&&r.installed_version?r.installed_version:null}var Fs,er=v(()=>{"use strict";Fs="2.107.0"});function sr(r){Me.en=Object.assign({},r,Me.en??{})}function we(r){let i=(r||ir).toLowerCase();return i.startsWith("pt")&&i.endsWith("br")?"pt-br":i.substring(0,2)}function N(r){return r?.language||"en"}function n(r,i,e){let t=we(i);return Me[t]?.[r]??Me.en?.[r]??e??r}function ue(r){let i=we(r);return i===ir||i in Me||!Bs.has(i)}function De(r){let i=we(r);if(i===ir||i in Me||!Bs.has(i))return Promise.resolve();let e=tr[i];return e!==void 0&&Date.now()-e<Uo?Promise.resolve():(i in Tt||(Tt[i]=fetch(`${Bo}/${i}.json?v=${Fs}`).then(t=>t.ok?t.json():null).then(t=>{t?Me[i]=t:(delete Tt[i],tr[i]=Date.now())}).catch(()=>{delete Tt[i],tr[i]=Date.now()})),Tt[i])}var ir,rr,Me,Tt,tr,Uo,Bs,Bo,si=v(()=>{"use strict";er();ir="en",rr=(()=>{let r=window;return r.__msLocales||(r.__msLocales={store:{},inflight:{}}),r.__msLocales.failedAt||(r.__msLocales.failedAt={}),r.__msLocales})(),Me=rr.store,Tt=rr.inflight,tr=rr.failedAt,Uo=6e4;Bs=new Set(["de","nl","fr","it","es","pt","pt-br","ru","uk","pl","cs","sv","zh","da","fi","nb","ja","hi","hu","ko","tr"]),Bo="/maintenance_supporter_locales"});function Ws(r){let i=r?.language;!i||typeof r?.loadBackendTranslation!="function"||ie.lang===i&&(ie.localize||ie.inflight)||(ie.lang=i,ie.localize=null,ie.inflight=r.loadBackendTranslation("exceptions",nr).then(e=>{ie.lang===i&&(ie.localize=e)}).catch(()=>{}).finally(()=>{ie.inflight=null}))}function Vs(r,i,e){if(!i||!ie.localize||r&&r!==nr)return null;let t=`component.${nr}.exceptions.${i}.message`,s=ie.localize(t,e??void 0);return s&&s!==t?s:null}var nr,ie,ar=v(()=>{"use strict";nr="maintenance_supporter",ie=(()=>{let r=window;return r.__msBackendErrors??={lang:"",localize:null,inflight:null}})()});function Fe(r){return r?.currency_symbol||Wo}function Gs(r,i){i.has("hass")&&lr(r.hass?.locale,r.hass?.config?.country,r.hass?.config?.time_zone);let e=r.hass?.language;e&&!ue(e)&&De(e).then(()=>{ue(e)&&r.requestUpdate()}),Ws(r.hass)}function Ks(r){let i=we(r);return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN",da:"da-DK",fi:"fi-FI",nb:"nb-NO",ja:"ja-JP",hi:"hi-IN",pl:"pl-PL",cs:"cs-CZ",sv:"sv-SE","pt-br":"pt-BR",hu:"hu-HU",ko:"ko-KR",tr:"tr-TR"}[i]??"en-US"}function Vo(r){Qs.decimals=typeof r=="number"&&Number.isInteger(r)&&r>=0&&r<=3?r:0}function Go(){return Qs.decimals??0}function ni(r){r&&r.currency_decimals!==void 0&&r.currency_decimals!==null&&Vo(Number(r.currency_decimals))}function lr(r,i,e){e!==void 0&&(re.serverTimeZone=e||void 0),r&&(re.date=r.date_format,re.time=r.time_format,re.number=r.number_format,re.timeZone=r.time_zone,i!==void 0&&(re.country=i||void 0))}function Ko(r){switch(re.number){case"comma_decimal":return["en-US","en"];case"decimal_comma":return["de","es","it"];case"space_comma":return["fr","sv","cs"];case"system":return;default:return Ks(r)}}function ai(r,i,e,t,s="n"){return e===1?n(i,t):n(r,t).replace(`{${s}}`,I(e,t))}function I(r,i,e){if(!Number.isFinite(r))return String(r);let t=typeof e=="number"?{minimumFractionDigits:e,maximumFractionDigits:e}:{maximumFractionDigits:2,...e};if(re.number==="none"){let s=Math.pow(10,t.maximumFractionDigits??2);return String(Math.round(r*s)/s)}try{return new Intl.NumberFormat(Ko(i),t).format(r)}catch{return new Intl.NumberFormat(void 0,t).format(r)}}function Zs(r,i,e){return r<0?`${n("cost_kind_credit",e??"en")}: ${Q(-r,i,e)}`:Q(r,i,e)}function Q(r,i,e,t){let s=t??Go(),a=Math.abs(r)<.5/Math.pow(10,s)?0:r,o=I(a,e,s);return i?`${o} ${i}`:o}function it(r,i,e){let t=I(r,e);return i?`${t} ${i}`:t}function et(r){let i=Ks(r),e=re.country;if(e&&/^[A-Za-z]{2}$/.test(e)){let t=`${we(r).split("-")[0]}-${e.toUpperCase()}`;try{return new Intl.DateTimeFormat(t),t}catch{}}return i}function or(r,i,e){let t=re.date;if(t==="DMY"||t==="MDY"||t==="YMD"){let[a,o,c]=xe(r,e).split("-");return t==="DMY"?`${c}/${o}/${a}`:t==="MDY"?`${o}/${c}/${a}`:`${a}-${o}-${c}`}let s=t==="system"?void 0:et(i);return r.toLocaleDateString(s,{day:"2-digit",month:"2-digit",year:"numeric",timeZone:e})}function oi(r,i){let e=be();switch(re.time){case"12":return r.toLocaleTimeString(et(i),{hour:"2-digit",minute:"2-digit",hour12:!0,timeZone:e});case"24":return r.toLocaleTimeString(et(i),{hour:"2-digit",minute:"2-digit",hour12:!1,timeZone:e});case"system":return r.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit",timeZone:e});default:return r.toLocaleTimeString(et(i),{hour:"2-digit",minute:"2-digit",timeZone:e})}}function L(r,i){if(!r)return"\u2014";try{let e=Js.exec(r);return e?or(new Date(Date.UTC(+e[1],+e[2]-1,+e[3])),i,"UTC"):or(new Date(V(r)),i,be())}catch{return r}}function li(r,i){if(!r)return"\u2014";if(Js.test(r))return L(r,i);try{let e=new Date(V(r));return or(e,i,be())+" "+oi(e,i)}catch{return r}}function ci(r,i=Date.now()){let e=ve();return ii(i,e)===ii(i,be())?"":n("ha_time_zone_hint",r).replace("{zone}",e)}function Xs(r,i){if(r==null)return"\u2014";let e=i||"en";if(r<0)return`${Math.abs(r)} ${n("d_overdue",e)}`;if(r===0)return n("today",e);let t=r===1?"one":"other";try{t=new Intl.PluralRules(e).select(r)}catch{}return`${r} ${t==="one"?n("day",e):t==="few"?n("days_few",e):n("days",e)}`}function ze(r,i,e){return r==null?"\u2014":`${r} ${n("unit_"+(i||"days"),e)}`}function di(r,i){return r==null?"\u2014":`${I(r,i,{maximumFractionDigits:1})} ${n("minutes_short",i)}`}function tt(r,i,e="long"){return new Date(Date.UTC(2024,0,1+r)).toLocaleDateString(et(i),{weekday:e,timeZone:"UTC"})}function pi(r,i,e="long"){return new Date(Date.UTC(2024,r,1)).toLocaleDateString(et(i),{month:e,timeZone:"UTC"})}function en(r,i,e="long"){return tt((r.getDay()+6)%7,i,e)}function tn(r,i,e="long"){return pi(r.getMonth(),i,e)}function rn(r,i){let e=r.schedule;if(r.schedule_type==="sensor_based"){let a=n("sensor_based",i),o=e&&e.kind==="interval"&&e.every?e.every:r.interval_days;return o?`${a} \xB7 ${ze(o,(e&&e.kind==="interval"?e.unit:r.interval_unit)||"days",i)}`:a}let t=e?.offset?` ${e.offset>0?"+":"\u2212"}${Math.abs(e.offset)}d`:"",s=e?.months?.length?` \xB7 ${[...e.months].sort((a,o)=>a-o).map(a=>pi(a-1,i,"short")).join(", ")}`:"";switch(e?.kind){case"weekdays":return((e.weekdays||[]).map(a=>tt(a,i,"short")).join(" & ")||"\u2014")+t;case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?n("ord_last",i):n("ord_"+e.nth,i)} ${tt(e.weekday,i,"long")}${t}${s}`;case"day_of_month":return e.day==null?"\u2014":(e.day===-1?n(e.business?"last_business_day_month":"last_day_month",i):`${n("day_word",i)} ${e.day}`)+t+s;case"calendar":return`${n("calendar_entity_label",i)}: ${r.schedule_entity_name||e.entity_id||"\u2014"}${t}`;case"one_time":return r.due_date?L(r.due_date,i):n("one_time",i);case"manual":return n("manual",i);case"interval":return ze(e.every,e.unit,i)}return r.schedule_type==="one_time"?r.due_date?L(r.due_date,i):n("one_time",i):r.schedule_type==="manual"?n("manual",i):r.schedule_type==="sensor_based"?n("sensor_based",i):r.interval_days!=null?ze(r.interval_days,r.interval_unit,i):"\u2014"}function sn(r,i){r.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:i},bubbles:!0,composed:!0}))}var Wo,Ys,re,Qs,Js,ke,nn,Yo,Qo,ui,T=v(()=>{"use strict";C();Ds();Je();si();ar();G();si();Wo="\u20AC";sr(zs);Ys=window,re=Ys.__msDateTimePrefs??={},Qs=Ys.__msMoneyPrefs??={};Js=/^(\d{4})-(\d{2})-(\d{2})$/;ke=$`
  .field { display: flex; flex-direction: column; gap: 4px; }
  /* The label of ms-textfield / ms-date-field: every field label reads alike. */
  .field-label { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
  .field-input {
    padding: 8px 10px; font-size: 14px;
    background: var(--secondary-background-color, rgba(0,0,0,0.06));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color); border-radius: 6px;
    font-family: inherit; width: 100%; box-sizing: border-box;
  }
  .field-input:focus { outline: none; border-color: var(--primary-color); }
`,nn=$`
  .form-section { display: flex; flex-direction: column; gap: 12px; }
  .section-title {
    margin: 8px 0 0;
    padding-top: 14px;
    border-top: 1px solid var(--divider-color);
    font-size: 15px;
    font-weight: 600;
    line-height: 1.3;
    color: var(--primary-text-color);
  }
  .select-row { display: flex; flex-direction: column; gap: 4px; }
  .select-row > label,
  .field > label { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
  .select-row select {
    padding: 8px 10px;
    font-size: 14px;
    font-family: inherit;
    background: var(--secondary-background-color, rgba(0,0,0,0.06));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    border-radius: 6px;
  }
  .select-row select:focus { outline: none; border-color: var(--primary-color); }
  /* #216 follow-up: the open list took the select's grey fill and the chosen
     entry the system blue. The entries carry the card's colors; where a
     select can be styled (appearance: base-select), the list and the chosen
     entry look like HA's own menus. */
  .select-row select option {
    background-color: var(--card-background-color, #fff);
    color: var(--primary-text-color);
  }
  @supports (appearance: base-select) {
    .select-row select,
    .select-row select::picker(select) {
      appearance: base-select;
    }
    .select-row select::picker(select) {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 4px 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }
    .select-row select option {
      padding: 8px 12px;
    }
    .select-row select option:hover,
    .select-row select option:focus-visible {
      background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    }
    .select-row select option:checked {
      background-color: color-mix(in srgb, var(--primary-color) 15%, transparent);
      color: var(--primary-color);
    }
  }
  .field-help { font-size: 12px; color: var(--secondary-text-color); }
  .option-row,
  .req-option,
  .toggle-row,
  .checkbox-row,
  .pool-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    cursor: pointer;
  }
  .option-row input[type="checkbox"],
  .req-option input[type="checkbox"],
  .toggle-row input[type="checkbox"],
  .checkbox-row input[type="checkbox"],
  .pool-item input[type="checkbox"] { width: 16px; height: 16px; margin: 0; flex: none; cursor: pointer; }
`,Yo=$`
  .person-chip { display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 100%; vertical-align: middle; }
  .person-avatar {
    width: 22px; height: 22px; border-radius: 50%; flex: none;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--person-color, #546e7a); color: #fff;
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.02em; line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .person-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
`,Qo=$`
  .ref-chip {
    display: inline-block; font-size: 11.5px; font-weight: 500; line-height: 1; padding: 3px 6px;
    border-radius: 6px; border: 1px solid var(--divider-color); color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums; letter-spacing: .02em; vertical-align: middle; white-space: nowrap;
    user-select: all;
  }
  /* #189: "· Residual waste, Paper" after a calendar-driven task's name. */
  .event-titles { color: var(--secondary-text-color); font-weight: 400; }
`,ui=$`
  ${Yo}
  ${Qo}
  :host {
    --maint-ok-color: var(--success-color, #4caf50);
    --maint-due-soon-color: var(--warning-color, #ff9800);
    --maint-overdue-color: var(--error-color, #f44336);
    /* Theme-token first so it follows dark/custom themes (was a bare #ff5722,
       inconsistent with STATUS_COLORS.triggered which already tokenised it). */
    --maint-triggered-color: var(--deep-orange-color, #ff5722);
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
  /* Shape icon so status is not conveyed by colour alone (accessibility). */
  .status-badge ha-icon { --mdc-icon-size: 14px; margin-left: -1px; }

  /* Light-background statuses (green/orange/grey) carry DARK text: white on
     them fails even the 3:1 WCAG UI-contrast floor (2.2–2.8:1), while the
     saturated statuses below keep white (≥3.1:1). Matches the calendar pills. */
  .status-badge.ok { background-color: var(--maint-ok-color); color: #000; }
  .status-badge.due_soon { background-color: var(--maint-due-soon-color); color: #000; }
  .status-badge.overdue { background-color: var(--maint-overdue-color); }
  .status-badge.triggered { background-color: var(--maint-triggered-color); }
  /* Completed one-time task ("done") — muted blue-grey. */
  .status-badge.done { background-color: var(--maint-done-color, #78909c); }
  /* D#203: a manual task without a due date — an outline in the muted grey of
     its "done 23 d ago", so it does not read as a green, on-schedule OK. */
  .status-badge.no_due { background-color: var(--maint-no-due-background, transparent); color: var(--secondary-text-color, #727272); box-shadow: inset 0 0 0 1px currentColor; }
  /* v2.10.0: archived (retire-but-retain) — neutral grey, clearly inert. */
  .status-badge.archived { background-color: var(--disabled-color, #9e9e9e); color: #000; }
  /* v2.20 (N3): paused — frozen but present, info blue. */
  .status-badge.paused { background-color: var(--info-color, #2196f3); }

  /* v1.4.7: 5-column grid so all 5 KPIs (Objects/Tasks/Overdue/Due Soon/
     Triggered) always stay in one row. The previous flex-wrap layout was
     wrapping the 5th item (Triggered, the widest label) onto its own row
     on narrow viewports because the natural width of the items pushed past
     the container width. Grid forces equal 1/5 distribution regardless of
     label length. */
  .stats-bar {
    display: grid;
    /* auto-fit instead of a fixed 5: with the budget feature on, two KPI
       tiles join the strip (#125) — and on narrow screens the tiles wrap
       instead of crushing. */
    grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
    gap: 16px;
    padding: 16px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
  }
  .stat-item .stat-label {
    /* Allow long labels to ellipsis rather than overflow the grid cell. */
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .stat-item.clickable { cursor: pointer; border-radius: 8px; padding: 4px 8px; transition: background 0.15s, box-shadow 0.15s; }
  .stat-item.clickable:hover { background: var(--secondary-background-color); }
  /* v2.1.0 — KPIs that map to a status filter highlight when active so the
     user can see at a glance which filter is on, even after scrolling away. */
  .stat-item.clickable.active {
    background: var(--secondary-background-color);
    box-shadow: inset 0 -3px 0 var(--primary-color);
  }

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
    /* Large installs (100+ objects): skip rendering off-screen cards. The
       intrinsic size keeps the scrollbar stable while they're skipped. */
    content-visibility: auto;
    contain-intrinsic-size: auto 120px;
  }
  .object-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .object-card-header { display: flex; justify-content: space-between; align-items: center; }
  .object-card-name { font-weight: 500; font-size: 16px; }
  .object-card-count { color: var(--secondary-text-color); font-size: 13px; }
  .object-card-meta { color: var(--secondary-text-color); font-size: 13px; margin-top: 4px; }
  .object-card-empty { color: var(--warning-color); font-size: 13px; margin-top: 8px; font-style: italic; }

  /* Overdue indicator dot on object cards (#35) */
  .object-card { position: relative; }
  /* #188: bulk select in the All-objects view */
  .object-card.bulk-selected, .objects-table-row.bulk-selected {
    outline: 2px solid var(--primary-color); outline-offset: -2px;
    background: color-mix(in srgb, var(--primary-color) 10%, transparent);
  }
  .object-card.selectable { padding-left: 44px; }
  .obj-bulk-check { position: absolute; top: 12px; left: 12px; z-index: 1; }
  .obj-bulk-check input, .oc-bulk input { width: 17px; height: 17px; cursor: pointer; accent-color: var(--primary-color); }
  .oc-bulk { width: 28px; }
  .obj-bulk-bar { margin: 0 0 12px; }
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
    /* Long histories: skip painting off-screen entries (flex, not subgrid, so
       safe — subgrid task rows can't use this without breaking alignment). */
    content-visibility: auto;
    contain-intrinsic-size: auto 48px;
  }
  .history-entry:last-child { border-bottom: none; }
  /* Dense variant (quick-actions dialog, overview "recent activities"):
     no status-icon column, tighter padding, smaller type. */
  .history-entry.compact {
    padding: 6px 0;
    font-size: 13px;
    contain-intrinsic-size: auto 40px;
  }
  .history-entry.compact .history-readings { font-size: 12px; }

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

  /* The background comes from HISTORY_TYPE_COLORS (renderers/history.ts). */

  .history-content { flex: 1; min-width: 0; }

  /* v2.2.0 — row holds the type label + the small Edit button */
  .history-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  /* v2.37 — marks completions the system recorded itself (trigger recovered).
     margin-right:auto keeps it left beside the type label while the edit
     button stays pinned right by the row's space-between. */
  .history-auto-badge {
    margin-right: auto;
    font-size: 11px;
    padding: 1px 8px;
    border-radius: 10px;
    background: var(--secondary-background-color);
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  /* #139 — names the cycle phase a completion recorded. Shares the auto-badge
     look; carries the left-pinning margin itself unless the auto badge (which
     already has it) follows. */
  .history-phase-badge {
    margin-right: auto;
    font-size: 11px;
    padding: 1px 8px;
    border-radius: 10px;
    background: var(--secondary-background-color);
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .history-phase-badge:has(+ .history-auto-badge) {
    margin-right: 0;
  }
  /* #161 — a completion can carry several photos; thumbnails wrap. */
  .history-photos {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  /* #161 phase 2 — named readings of a completion: a compact
     name / value grid, wrapping into columns on wide screens. */
  .history-readings {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 280px));
    gap: 2px 24px;
    margin: 4px 0;
    font-size: 13px;
  }
  .history-reading {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
  }
  .history-reading-name {
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .history-reading-value {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .history-edit-btn {
    background: transparent;
    color: var(--secondary-text-color);
    border: none;
    border-radius: 4px;
    padding: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    transition: background 0.15s, color 0.15s;
  }
  .history-edit-btn:hover {
    background: var(--secondary-background-color);
    color: var(--primary-color);
  }
  .history-edit-btn ha-icon { --mdc-icon-size: 16px; }

  .history-date {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  /* A note keeps its line breaks — what was done, one line each (#202) —
     and a long link wraps instead of widening the card. */
  .history-notes { white-space: pre-wrap; overflow-wrap: anywhere; }

  .history-details {
    display: flex;
    gap: 12px;
    font-size: 13px;
    color: var(--secondary-text-color);
    margin-top: 4px;
  }
  .history-details .history-credit { color: var(--success-color, #4caf50); }

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

  /* Counter progress ("8,507 / 15,000 km · 57 %" + bar) */
  .counter-progress { margin: 6px 0 4px; }
  .counter-progress-nums {
    display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;
  }
  .counter-progress-main { font-size: 26px; font-weight: 700; color: var(--primary-text-color); }
  .counter-progress-target { font-size: 15px; font-weight: 500; color: var(--secondary-text-color); }
  .counter-progress-pct { font-size: 15px; font-weight: 700; }
  .counter-progress-pct.ok { color: var(--success-color, #4caf50); }
  .counter-progress-pct.near { color: var(--warning-color, #ff9800); }
  .counter-progress-pct.over { color: var(--error-color, #f44336); }
  .counter-progress-bar {
    height: 8px; border-radius: 4px; margin: 6px 0 4px; overflow: hidden;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
  }
  .counter-progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease; }
  .counter-progress-fill.ok { background: var(--success-color, #4caf50); }
  .counter-progress-fill.near { background: var(--warning-color, #ff9800); }
  .counter-progress-fill.over { background: var(--error-color, #f44336); }
  .counter-progress-caption { font-size: 12px; color: var(--secondary-text-color); }

  /* Note under a chart that fell back to sparse maintenance-event values */
  .chart-note {
    display: flex; align-items: center; gap: 6px; margin-top: 2px;
    font-size: 12px; color: var(--secondary-text-color);
  }
  .chart-note ha-icon { --mdc-icon-size: 15px; flex: none; }

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

  /* ha-icon-button: the mwc-icon-button these rules styled is not defined on
     HA 2026.x — it rendered as a bare 18 px icon, no button, no focus (audit
     2026-09-29). --ha-icon-button-size is the variable 2026.x reads. */
  .row-actions ha-icon-button {
    display: inline-flex;
    --ha-icon-button-size: 32px;
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
  /* The cell is right-aligned; a date that wraps in a narrow column
     ("63 d / overdue") ends flush right like the bar and the value under it,
     instead of starting each line at a different spot from row to row. */
  .due-cell .due-text { text-align: end; }
  /* D#203: a task without a due date shows when it was last done — muted,
     so it never reads as a status. */
  .due-text.last-done { color: var(--secondary-text-color); }

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

  /* Trigger progress bar (overview rows). width:100% — the due-cell doesn't
     stretch its children (align-items: flex-end), so without it the bar
     shrinks to its label and reads shorter than the days-bar in other rows. */
  .trigger-progress {
    display: flex;
    flex-direction: column;
    gap: 2px;
    /* #150 follow-up (2026-08-31, maisun's mobile screenshot): the box used
       to carry min-width: 90px — in the narrow grid the due column is
       fit-content(100px) and right-aligned, so on cells narrower than 90px
       the box overhung LEFT across the object name. It now tracks the cell
       with no floor, and the label ellipsizes inside. */
    align-self: stretch;
    max-width: 100%;
    min-width: 0;
    width: 100%;
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
    max-width: 100%;
    white-space: nowrap;
    /* The text ellipsizes, the trend arrow keeps its place: inline, the
       arrow pushed the unit out on a phone ("100.0 / 100 …", trigger check
       2026-10-16). */
    display: flex;
    justify-content: flex-end;
    min-width: 0;
  }
  .trigger-progress-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tp-num, .tp-unit { white-space: nowrap; }

  /* #150 follow-up: 3-state trend arrow — replaces the sparkline on
     narrow/tight rows (panel-styles toggles visibility per regime). */
  .trend-arrow {
    display: none;
    flex: none;
    align-self: flex-end; /* after the unit when it wrapped to a second line */
    font-style: normal;
    font-weight: 700;
    margin-left: 4px;
  }
  .trend-approaching { color: var(--warning-color, #ff9800); }
  .trend-stable { color: var(--secondary-text-color); }
  .trend-easing { color: var(--success-color, #4caf50); }


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

  /* Mini-sparkline in overview rows */
  .mini-sparkline {
    width: 60px;
    /* Same class of bug as the trigger-progress floor (#150 follow-up): in
       due cells narrower than the fixed width the right-aligned SVG used to
       overhang LEFT (phone-360 sweep). preserveAspectRatio="none" lets it
       just squeeze. */
    max-width: 100%;
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

  /* Budget KPI tiles in the stats strip (#125) — replaced the full-width
     budget-bars row. The spent amount inherits .stat-value's full 24px bold
     so the budget tiles read exactly like the other KPI chips (user report
     2026-08-24: the old 15px override made them visibly smaller); only the
     "/ max" suffix stays secondary. */
  .stat-item.budget-tile .budget-tile-value {
    white-space: nowrap;
  }
  /* The "/ max" ratio is its OWN small line between value and bar — inline
     it overflowed the ~150px grid cell into the neighbouring tile once the
     value took the full 24px. */
  .budget-tile-max {
    font-size: 11px;
    line-height: 1.2;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .budget-tile-bar {
    width: 100%;
    max-width: 130px;
    height: 4px;
    border-radius: 2px;
    background: var(--divider-color);
    overflow: hidden;
    margin-top: 5px;
  }
  .budget-tile-bar > div {
    height: 100%;
    border-radius: 2px;
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
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .group-card-actions {
    display: flex;
    flex-shrink: 0;
    gap: 0;
  }
  .group-card-actions ha-icon-button {
    display: inline-flex;
    --ha-icon-button-size: 28px;
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
    max-width: 100%;
    overflow-wrap: anywhere;
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

  /* (The complete-dialog's .feedback-* rules live in complete-dialog.ts —
     this sheet carried a dead byte-identical copy until the 2026-08 drift
     audit; complete-dialog never imports sharedStyles.) */

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

  .prediction-cycles {
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
    .row-actions ha-icon-button {
      --ha-icon-button-size: 44px;
      --mdc-icon-button-size: 44px;
      --mdc-icon-size: 22px;
    }

    .due-cell { min-width: 70px; }

    .trigger-card { padding: 10px 12px; }
    .trigger-current { font-size: 22px; }

    .prediction-grid { flex-direction: column; gap: 8px; }

    .weibull-info-row { flex-direction: column; gap: 8px; }

    /* Budget tiles on narrow screens (#125): the spent amount keeps the
       full chip size (consistency, user report 2026-08-24); the "/ max"
       suffix is hidden instead — the bar and the title carry the ratio. */
    .budget-tile-max { display: none; }

    /* #206 — one group per row. flex: 1 with min-width 0 put every group
       into ONE row: three groups were 96 px each on a 360 px phone, and the
       delete button of one lay over the next group. The buttons get the
       same 44 px targets as the task rows, apart from each other; the
       negative margin lets them reach into the card's padding instead of
       pushing the tasks down. */
    .group-card { flex: 1 1 100%; min-width: 0; max-width: 100%; }
    .group-card-actions { gap: 8px; margin: -8px -8px -8px 0; }
    .group-card-actions ha-icon-button {
      --ha-icon-button-size: 44px;
      --mdc-icon-button-size: 44px;
      --mdc-icon-size: 22px;
    }

    .filter-chip { padding: 6px 12px; font-size: 13px; }

    .history-details { flex-wrap: wrap; gap: 6px; }

    .sparkline-container { max-width: 100%; overflow: hidden; }
    .sparkline-svg { height: 100px; }

    /* #150 — phones get a FIXED 10-track grid instead of auto-fit: the five
       KPI tiles span 2 tracks each (= one full row on any width ≥ 320 px),
       the two budget tiles span 5 each (= a full second row). auto-fit with
       a px floor rewrapped to 3-4 columns on 360-412 px phones and left one
       or two tiles orphaned on their own row. */
    .stats-bar { grid-template-columns: repeat(10, minmax(0, 1fr)); gap: 6px; padding: 12px; }
    /* min-width: 0 (NOT a fixed floor) — a fixed min-width re-enables the
       grid's auto minimum, so the 5 KPI tracks couldn't shrink below their
       label text and the last KPI clipped off-screen on phones (the header
       only *looked* cut — .content scrolls sideways, but nothing hints so).
       With 0 the tracks compress and the labels wrap to a second line. */
    .stat-item { min-width: 0; grid-column: span 2; }
    .stat-item.budget-tile { grid-column: span 5; }
    .stat-item.clickable { padding: 4px 2px; }
    /* ~60 px tracks: multi-word labels wrap at the space, single overlong
       words (nl "Achterstallig") hyphenate where the browser can and hard-
       break as the last resort — never clip. */
    .stat-item .stat-label { font-size: 11px; white-space: normal; text-align: center; line-height: 1.2; hyphens: auto; overflow-wrap: anywhere; }
    .stat-value { font-size: 20px; }
  }
`});function At(r){if(!r)return[];let i=[],e=r.photo_doc_id;typeof e=="string"&&i.push(e);let t=r.photo_doc_ids;Array.isArray(t)&&i.push(...t);let s=[];for(let a of i){if(typeof a!="string")continue;let o=a.trim();if(!(!o||s.includes(o))&&(s.push(o),s.length>=10))break}return s}var Ct=v(()=>{"use strict"});function ln(){let r=new Uint8Array(4);return(globalThis.crypto??{getRandomValues:i=>i.map(()=>Math.floor(Math.random()*256))}).getRandomValues(r),Array.from(r,i=>i.toString(16).padStart(2,"0")).join("")}function $e(r){let i=r?.reading_values;if(!Array.isArray(i))return[];let e=[],t=new Set;for(let s of i){if(!s||typeof s!="object")continue;let a=s;typeof a.id!="string"||!a.id||t.has(a.id)||typeof a.value!="number"||!Number.isFinite(a.value)||(t.add(a.id),e.push({id:a.id,name:typeof a.name=="string"?a.name:a.id,unit:typeof a.unit=="string"?a.unit:null,value:a.value}))}return e}function cn(r){return r.filter(i=>i.type==="completed"&&(i.reading_value!=null||$e(i).length>0)).sort((i,e)=>i.timestamp.localeCompare(e.timestamp))}function dn(r){return cn(r??[]).map(i=>({timestamp:i.timestamp,values:$e(i)})).filter(i=>i.values.length>0)}function pn(r,i,e){let t;for(let s of r){if(e!==void 0){let o=V(s.timestamp);if(!isNaN(o)&&o>=e)break}let a=s.values.find(o=>o.id===i);a&&(t=a)}return t}function un(r,i,e){let t=$e(i).find(a=>a.id===e);if(!t)return null;let s=null;for(let a of cn(r)){if(a.timestamp>=i.timestamp)break;let o=$e(a).find(c=>c.id===e);o&&(s=o.value)}return s==null?null:t.value-s}function hn(r){let i=new Set,e=new Set;for(let t of r){let s=(t.name||"").trim().toLowerCase();s&&(i.has(s)?e.add(t.id):i.add(s))}return e}function _n(r){let i=[],e=new Set,t=new Set;for(let s of r){let a=(s.name||"").trim();if(!(!a||e.has(s.id)||t.has(a.toLowerCase()))&&(e.add(s.id),t.add(a.toLowerCase()),i.push({id:s.id,name:a,unit:(s.unit||"").trim()||null}),i.length>=cr))break}return i}var cr,Ue=v(()=>{"use strict";G();cr=20});async function hi(r,i,e){let t=await r.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:i,task_id:e});return Array.isArray(t?.history)?t.history:null}var dr=v(()=>{"use strict"});function pr(r,i,e,t){let s=e,a=p=>typeof p=="string"?p:null,o=p=>typeof p=="number"?p:null,c=a(s.timestamp)??"";return{entry_id:r,task_id:i,original_timestamp:c,type:a(s.type)||"completed",timestamp:c,notes:a(s.notes),cost:o(s.cost),duration:o(s.duration),completed_by:a(s.completed_by),used_parts:Array.isArray(s.used_parts)?s.used_parts:null,photo_doc_ids:At(s),reading_value:o(s.reading_value),reading_values:$e(s),readings:t?.readings??[],task_type:t?.type??null,reading_unit:t?.reading_unit??null}}async function mn(r,i,e,t){let a=(await r.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:i})).tasks?.find(c=>c.id===e);if(!a)return null;let o=a.history?.find(c=>c.timestamp===t);return o||(o=(await hi(r,i,e))?.find(p=>p.timestamp===t)),o?pr(i,e,o,a):null}var ur=v(()=>{"use strict";Ct();Ue();dr()});function Ee(r,i=Be){return r?r.is_admin?!0:i.operatorWriteEnabled&&i.operatorIds.includes(r.id):!1}var Be,It=v(()=>{"use strict";Be={operatorWriteEnabled:!1,operatorIds:[]}});var gn,fn,yn,Rt,Pt,Nt,hr,Se,rt,Ht=v(()=>{"use strict";gn={default_warning_days:[0,365],default_consumable_threshold:[1,90],battery_low_percent:[1,90],battery_recovered_percent:[20,100],battery_low_delay_minutes:[0,1440],archive_oneoff_days:[0,3650],delete_archived_oneoff_days:[0,3650],notify_due_soon_interval_hours:[0,720],notify_overdue_interval_hours:[0,720],notify_triggered_interval_hours:[0,720],max_notifications_per_day:[0,1e3],notification_bundle_threshold:[2,20],snooze_duration_hours:[1,168],warranty_reminder_days:[1,365],budget_alert_threshold:[10,100],currency_decimals:[0,3]},fn=[0,1440],yn=[1,1e4],Rt=[0,365],Pt=15,Nt=[.1,.9],hr=[0,365],Se=[.01,1e4],rt=[.01,1e5]});function Jo(r){let[i,e]=gn.default_warning_days,t=r?.general?.default_warning_days,s=r?.general?.row_action_style;return{features:{..._i.features,...r?.features??{}},defaultWarningDays:typeof t=="number"&&Number.isFinite(t)&&t>=i&&t<=e?t:_i.defaultWarningDays,rowActionStyle:Zo.includes(s??"")?s:_i.rowActionStyle,access:{operatorWriteEnabled:r?.operator_write_enabled===!0,operatorIds:Array.isArray(r?.admin_panel_user_ids)?r.admin_panel_user_ids.filter(a=>typeof a=="string"):[]},budget:r?.budget??null,rowActionNoticePending:r?.general?.row_action_notice_pending===!0,refsInLists:r?.general?.ref_numbers_in_lists===!0,objectsTableColumns:Array.isArray(r?.objects_table_columns)?r.objects_table_columns:void 0,partsCostMode:xs(r?.budget?.parts_cost_mode)}}function vn(){let r=window;return r.__msSettingsCache??={promise:null}}function se(r){let i=vn();if(i.promise)return i.promise;let e=r.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(t=>Jo(t)).catch(()=>(i.promise===e&&(i.promise=null),_i));return i.promise=e,e}function bn(){vn().promise=null}var Zo,_i,Ot=v(()=>{"use strict";It();Ht();Ze();Zo=["buttons_compact","buttons","icons"];_i={features:{adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact",access:Be,budget:null,rowActionNoticePending:!1,refsInLists:!1,objectsTableColumns:void 0,partsCostMode:"purchase"}});function tl(r){let i=r.replace(/_ids?$/,"").split("_").filter(Boolean);if(i.length===0)return r;let e=i.join(" ");return e.charAt(0).toUpperCase()+e.slice(1)}function il(r,i){let e=el[r];if(e){let t=n(e,i);if(t&&t!==e)return t}return tl(r)}function rl(r){let i=[...r.matchAll(/\['([^']+)'\]/g)].map(s=>s[1]),e=i.length?i[i.length-1]:void 0,t;return(t=r.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=r.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=r.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=r.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(r)?{field:e,rule:"required"}:(t=r.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(r)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(r)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function sl(r,i){let e=new Set(xn(i));return xn(r).every(t=>e.has(t))}function wn(r,i,e){if(e=e??n("action_error",i),typeof r=="string")return r;if(typeof r!="object"||r===null)return e;let t=r,s=t.message||t.error?.message||"",a=t.code||t.error?.code||"",o=a?Xo[a]:void 0,c=Vs(t.translation_domain??t.error?.translation_domain,t.translation_key??t.error?.translation_key,t.translation_placeholders??t.error?.translation_placeholders);if(c)return c;if(!s&&!o)return e;let p=rl(s),_=p.field?il(p.field,i):"",m=f=>n(f,i).replace("{field}",_).replace("{n}",p.param??"");switch(p.rule){case"too_long":return m("err_too_long");case"too_short":return m("err_too_short");case"value_too_high":return m("err_value_too_high");case"value_too_low":return m("err_value_too_low");case"required":return m("err_required");case"wrong_type":return m("err_wrong_type").replace("{type}",p.param??"");case"invalid_choice":return m("err_invalid_choice");case"invalid_value":return m("err_invalid_value");default:if(o){let f=n(o,i);return we(i)==="en"&&s&&!sl(s,a)?`${f} (${s})`:f}return s||e}}var Xo,el,xn,kn=v(()=>{"use strict";T();ar();si();Xo={already_archived:"ws_err_already_archived",already_paused:"ws_err_already_paused",archived:"ws_err_archived",changed_since:"undo_changed",create_failed:"ws_err_create_failed",duplicate_failed:"ws_err_duplicate_failed",empty:"ws_err_empty",empty_csv:"ws_err_empty_csv",invalid_cursor:"ws_err_invalid_cursor",invalid_date:"ws_err_invalid_date",invalid_device:"ws_err_invalid_device",invalid_entity_slug:"ws_err_invalid_entity_slug",invalid_format:"ws_err_invalid_format",invalid_input:"ws_err_invalid_input",invalid_mirror_todo:"ws_err_invalid_mirror_todo",invalid_notify_service:"ws_err_invalid_notify_service",invalid_parent:"ws_err_invalid_parent",invalid_icon:"ws_err_invalid_icon",invalid_range:"ws_err_invalid_range",invalid_search_template:"ws_err_invalid_search_template",invalid_shopping_list_entity:"ws_err_invalid_shopping_list_entity",invalid_target:"ws_err_invalid_target",invalid_trigger_config:"ws_err_invalid_trigger_config",invalid_url:"ws_err_invalid_url",invalid_user:"ws_err_invalid_user",invalid_view:"ws_err_invalid_view",limit_reached:"ws_err_limit_reached",no_defaults:"ws_err_no_defaults",no_phases:"ws_err_no_phases",no_url:"ws_err_no_url",not_archived:"ws_err_not_archived",not_available:"ws_err_not_available",not_configured:"ws_err_not_configured",not_found:"ws_err_not_found",notify_service_not_found:"ws_err_notify_service_not_found",not_loaded:"ws_err_not_loaded",not_paused:"ws_err_not_paused",nothing_to_undo:"undo_nothing",replace_failed:"ws_err_replace_failed",self_link_device:"ws_err_self_link_device",too_early:"ws_err_too_early",too_large:"ws_err_too_large",too_many:"ws_err_too_many",too_many_views:"ws_err_too_many_views",unauthorized:"ws_err_unauthorized",unavailable:"ws_err_unavailable"},el={entry_id:"object",name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_equals:"trigger_equals",trigger_not_equals:"trigger_not_equals",trigger_for_minutes:"trigger_for_minutes"};xn=r=>r.toLowerCase().split(/[^a-z0-9]+/).filter(i=>i.length>1)});async function j(r,i,e={}){e.busy?.(!0);try{let t=typeof i=="function"?await i():await r.hass.connection.sendMessagePromise(i);return e.reload&&await e.reload(),e.successToast&&e.onSuccess?.(e.successToast),t===void 0?null:t}catch(t){let s=e.lang||N(r.hass),a=await al(r,t,s)??wn(t,s,e.fallbackKey?n(e.fallbackKey,s):void 0);e.onError?.(a,t);return}finally{e.busy?.(!1)}}async function al(r,i,e){let t=typeof i=="object"&&i!==null?i:{};if(!nl.has(t.code||t.error?.code||""))return null;try{let s=Us(await r.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}));return s?n("restart_pending_error",e).replace("{version}",s):null}catch{return null}}var nl,Te=v(()=>{"use strict";kn();T();er();nl=new Set(["unknown_error","invalid_format","unknown_command"])});var D,mi=v(()=>{"use strict";C();F();D=class extends S{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){return l`
      <label class="field">
        ${this.label?l`<span class="label">${this.label}${this.required?l`<span class="req">*</span>`:u}</span>`:u}
        ${this.multiline?l`
        <textarea
          .value=${this.value??""}
          rows=${this.rows}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @change=${this._onInput}
        ></textarea>`:l`
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??u}
          min=${this.min??u}
          max=${this.max??u}
          pattern=${this.pattern??u}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?l`<span class="helper">${this.helper}</span>`:u}
      </label>
    `}};D.styles=$`
    :host { display: block; }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .label {
      font-size: 12px;
      color: var(--secondary-text-color, #888);
      font-weight: 500;
    }
    .req { color: var(--error-color, #f44336); margin-left: 2px; }
    input {
      padding: 8px 10px;
      font-size: 14px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      border-radius: 6px;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      outline: none;
    }
    input:focus {
      border-color: var(--primary-color);
    }
    input:disabled { opacity: 0.5; cursor: not-allowed; }
    textarea {
      padding: 8px 10px;
      font-size: 14px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      border-radius: 6px;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      outline: none;
      resize: vertical;
    }
    textarea:focus { border-color: var(--primary-color); }
    textarea:disabled { opacity: 0.5; cursor: not-allowed; }
    /* The dialogs' .field-help: one help-text style (#216). */
    .helper {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
  `,d([y()],D.prototype,"label",2),d([y()],D.prototype,"value",2),d([y()],D.prototype,"placeholder",2),d([y()],D.prototype,"type",2),d([y({type:Boolean})],D.prototype,"required",2),d([y({type:Boolean})],D.prototype,"disabled",2),d([y()],D.prototype,"step",2),d([y()],D.prototype,"min",2),d([y()],D.prototype,"max",2),d([y()],D.prototype,"pattern",2),d([y()],D.prototype,"helper",2),d([y({type:Boolean})],D.prototype,"multiline",2),d([y({type:Number})],D.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",D)});function ol(r){let e=L("2001-02-03",r).match(/\d+/g)||[],t=c=>e.findIndex(p=>Number(p)===c),s=t(2001),a=t(2),o=t(3);return s===0?"YMD":a>=0&&o>=0&&a<o?"MDY":"DMY"}function st(r,i,e){if(r<1e3||r>9999||i<1||i>12||e<1||e>31)return null;let t=new Date(r,i-1,e);return t.getFullYear()!==r||t.getMonth()!==i-1||t.getDate()!==e?null:`${r}-${String(i).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function $n(r,i){let e=r.trim(),t;if(t=e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))return st(+t[1],+t[2],+t[3]);if(t=e.match(/^(\d{4})$/))return st(+t[1],1,1);if(t=e.match(/^(\d{1,2})[./](\d{4})$/))return st(+t[2],+t[1],1);if(t=e.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))return st(+t[3],+t[2],+t[1]);if(t=e.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)){let s=+t[1],a=+t[2],o=+t[3];return ol(i)==="MDY"?st(o,s,a):st(o,a,s)}return null}var En=v(()=>{"use strict";T()});function ll(r,i){if(i)switch(r){case"date":return i.split("T")[0];case"time":return i.length===5?`${i}:00`:i;case"datetime":{let[e,t="00:00:00"]=i.split("T");return`${e} ${t.length===5?`${t}:00`:t}`}}}function cl(r,i){if(typeof i!="string"||!i)return"";switch(r){case"date":return i.slice(0,10);case"time":return i.slice(0,5);case"datetime":{let[e,t="00:00:00"]=i.split(" ");return`${e}T${t.length===5?`${t}:00`:t}`}}}var U,nt=v(()=>{"use strict";C();F();T();En();U=class extends S{constructor(){super(...arguments);this.kind="date";this.label="";this.value="";this.clearable=!1;this.disabled=!1;this.required=!1;this.lang="en";this._typing=!1;this._typed="";this._typedInvalid=!1}_startTyping(){this._typed=this.value,this._typedInvalid=!1,this._typing=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input.typed")?.focus())}_commitTyped(){if(!this._typed.trim()){this._typing=!1;return}let e=$n(this._typed,this.lang);if(!e){this._typedInvalid=!0;return}this._typing=!1,this._typedInvalid=!1,this._emit(e)}_onTypedKey(e){e.key==="Enter"?(e.preventDefault(),this._commitTyped()):e.key==="Escape"&&(e.preventDefault(),this._typing=!1,this._typedInvalid=!1)}_selector(){switch(this.kind){case"date":return{date:{}};case"time":return{time:{no_second:!0}};case"datetime":return{datetime:{}}}}_onSelectorChange(e){e.stopPropagation(),this._emit(cl(this.kind,e.detail?.value))}_clear(){this._emit("")}_emit(e){e!==this.value&&(this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}})))}render(){return l`
      <div class="field">
        ${this.label?l`<span class="label">${this.label}${this.required?l`<span class="req">*</span>`:u}</span>`:u}
        <div class="row">
          ${this._typing?l`<input class="typed" type="text" inputmode="numeric" autocomplete="off"
                .value=${this._typed}
                placeholder=${L("1978-03-15",this.lang)}
                aria-invalid=${this._typedInvalid?"true":"false"}
                @input=${e=>{this._typed=e.target.value,this._typedInvalid=!1}}
                @keydown=${this._onTypedKey}
                @blur=${this._commitTyped} />`:l`<ha-selector
                .hass=${this.hass}
                .selector=${this._selector()}
                .value=${ll(this.kind,this.value)}
                .required=${this.required}
                .disabled=${this.disabled}
                @value-changed=${this._onSelectorChange}
              ></ha-selector>`}
          ${this.kind==="date"&&!this.disabled&&!this._typing?l`<button type="button" class="type-toggle" title=${n("date_type_toggle",this.lang)} aria-label=${n("date_type_toggle",this.lang)} @click=${this._startTyping}>
                <ha-icon icon="mdi:keyboard-outline"></ha-icon>
              </button>`:u}
          ${this.clearable&&this.value&&!this.disabled&&!this._typing?l`<button type="button" class="clear" title=${n("clear",this.lang)} aria-label=${n("clear",this.lang)} @click=${this._clear}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>`:u}
        </div>
        ${this._typedInvalid?l`<span class="helper invalid">${n("date_type_invalid",this.lang)}</span>`:this.helper?l`<span class="helper">${this.helper}</span>`:u}
      </div>
    `}};U.styles=$`
    :host { display: block; }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .label {
      font-size: 12px;
      color: var(--secondary-text-color, #888);
      font-weight: 500;
    }
    .req { color: var(--error-color, #f44336); margin-left: 2px; }
    .row {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    ha-selector {
      flex: 1;
      min-width: 0;
    }
    .clear, .type-toggle {
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      --mdc-icon-size: 20px;
    }
    .clear:hover, .type-toggle:hover { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08); }
    .clear:focus-visible, .type-toggle:focus-visible { outline: 2px solid var(--primary-color); }
    /* The dialogs' .field-help: one help-text style (#216). */
    .helper {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .helper.invalid { color: var(--error-color, #f44336); }
    input.typed {
      flex: 1;
      min-width: 0;
      height: 40px;
      box-sizing: border-box;
      padding: 0 12px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font: inherit;
    }
    input.typed[aria-invalid="true"] { border-color: var(--error-color, #f44336); }
    input.typed:focus { outline: 2px solid var(--primary-color); outline-offset: -1px; }
  `,d([y({attribute:!1})],U.prototype,"hass",2),d([y()],U.prototype,"kind",2),d([y()],U.prototype,"label",2),d([y()],U.prototype,"value",2),d([y()],U.prototype,"helper",2),d([y({type:Boolean})],U.prototype,"clearable",2),d([y({type:Boolean})],U.prototype,"disabled",2),d([y({type:Boolean})],U.prototype,"required",2),d([y()],U.prototype,"lang",2),d([h()],U.prototype,"_typing",2),d([h()],U.prototype,"_typed",2),d([h()],U.prototype,"_typedInvalid",2);customElements.get("ms-date-field")||customElements.define("ms-date-field",U)});var R,Sn=v(()=>{"use strict";C();F();T();Te();mi();nt();R=class extends S{constructor(){super(...arguments);this.objects=[];this.placesEnabled=!1;this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._place="";this._remindOnSite=!1;this._entryId=null;this._replacing=!1;this._oldDeviceId="";this._replaceDevice="keep"}get _lang(){return N(this.hass)}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._place="",this._remindOnSite=!1,this._replacing=!1,this._error="",this._open=!0}openReplace(e,t){this._entryId=e,this._replacing=!0,this._name=t.name||"",this._oldDeviceId=t.ha_device_id||"",this._haDeviceId="",this._replaceDevice="keep",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._haDeviceId=t.ha_device_id||"",this._parentEntryId=t.parent_entry_id||"",this._place=t.place||"",this._remindOnSite=!!t.remind_on_site,this._replacing=!1,this._error="",this._open=!0}async _replace(){if(this._loading||!this._entryId)return;let e={type:"maintenance_supporter/object/replace",entry_id:this._entryId,name:this._name.trim()||null};this._oldDeviceId?(this._replaceDevice==="other"&&(e.ha_device_id=this._haDeviceId),this._replaceDevice==="none"&&(e.ha_device_id=null)):this._haDeviceId&&(e.ha_device_id=this._haDeviceId);let t=await j(this,e,{busy:s=>{this._loading=s},fallbackKey:"save_error",onError:s=>{this._error=s}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-replaced",{detail:{entry_id:t?.entry_id,device_swap:t?.device_swap}})))}_deviceName(e){let s=this.hass?.devices?.[e];return s?.name_by_user||s?.name||e}_deviceSelector(e){return l`<ha-form
      .hass=${this.hass}
      .data=${{device:this._haDeviceId||void 0}}
      .schema=${[{name:"device",selector:{device:{}}}]}
      .computeLabel=${()=>e}
      @value-changed=${t=>this._haDeviceId=t.detail.value?.device||""}
    ></ha-form>`}_renderReplace(){let e=this._lang,t=(a,o)=>l`<label class="radio-row">
      <input
        type="radio"
        name="replace-device"
        .checked=${this._replaceDevice===a}
        @change=${()=>{this._replaceDevice=a}}
      />
      <span>${o}</span>
    </label>`,s=this._replaceDevice==="other"&&!this._haDeviceId;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${n("replace_object",e)}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:u}
          <div class="hint">${n("replace_object_prompt",e)}</div>
          <ms-textfield
            label="${n("replace_name_label",e)}"
            .value=${this._name}
            @input=${a=>this._name=a.target.value}
          ></ms-textfield>
          ${this._oldDeviceId?l`<div class="radio-group" role="radiogroup" aria-label=${n("replace_device_heading",e)}>
                <div class="textarea-label">${n("replace_device_heading",e)}</div>
                ${t("keep",n("replace_device_keep",e).replace("{device}",this._deviceName(this._oldDeviceId)))}
                ${this._replaceDevice==="keep"?l`<div class="hint">${n("replace_device_keep_hint",e)}</div>`:u}
                ${t("other",n("replace_device_other",e))}
                ${this._replaceDevice==="other"?l`${this._deviceSelector(n("replace_device_pick",e))}
                      <div class="hint">${n("replace_device_other_hint",e)}</div>`:u}
                ${t("none",n("replace_device_none",e))}
              </div>`:this._deviceSelector(n("link_device_optional",e))}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${n("cancel",e)}
          </ha-button>
          <ha-button @click=${this._replace} .disabled=${this._loading||s}>
            ${this._loading?n("saving",e):n("replace_object",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}_renderPlace(e){let t=!!this._place&&!this.hass?.states?.[this._place];return l`
      <ha-form
        .hass=${this.hass}
        .data=${{place:this._place||void 0}}
        .schema=${[{name:"place",selector:{entity:{domain:"zone"}}}]}
        .computeLabel=${()=>n("place_optional",e)}
        @value-changed=${s=>{this._place=s.detail.value?.place||"",this._place||(this._remindOnSite=!1)}}
      ></ha-form>
      ${t?l`<div class="place-missing">${n("place_missing",e)}</div>`:u}
      <label class="place-on-site ${this._place?"":"disabled"}">
        <input
          type="checkbox"
          .checked=${this._remindOnSite}
          ?disabled=${!this._place}
          @change=${s=>this._remindOnSite=s.target.checked}
        />
        <span>${n("remind_on_site",e)}</span>
      </label>
      ${this._place?l`<div class="place-hint">${n("remind_on_site_hint",e)}</div>`:u}
    `}async _save(){if(this._loading||!this._name.trim())return;this._error="";let e={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null,...this.placesEnabled?{place:this._place||null,remind_on_site:!!this._place&&this._remindOnSite}:{}},t=await j(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...e}:{type:"maintenance_supporter/object/create",...e},{busy:s=>{this._loading=s},fallbackKey:"save_error",onError:s=>{this._error=s}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved",{detail:{device_swap:t?.device_swap}})))}_parentChoices(){return(this.objects||[]).filter(e=>e.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return l``;if(this._replacing)return this._renderReplace();let e=this._lang,t=this._entryId?n("edit_object",e):n("new_object",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:u}
          <ms-textfield
            label="${n("name",e)}"
            required
            .value=${this._name}
            @input=${s=>this._name=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${s=>this._manufacturer=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("model_optional",e)}"
            .value=${this._model}
            @input=${s=>this._model=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${s=>this._serialNumber=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${s=>this._documentationUrl=s.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${n("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${s=>this._areaId=s.detail.value||""}
          ></ha-area-picker>
          ${this.placesEnabled?this._renderPlace(e):u}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${n("installation_date_optional",e)}"
            .value=${this._installationDate}
            @value-changed=${s=>this._installationDate=s.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${n("warranty_expiry_optional",e)}"
            .value=${this._warrantyExpiry}
            @value-changed=${s=>this._warrantyExpiry=s.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>n("link_device_optional",e)}
            @value-changed=${s=>this._haDeviceId=s.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?l`<label class="textarea-field">
                <span class="textarea-label">${n("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${s=>this._parentEntryId=s.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${n("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(s=>l`<option
                      value=${s.entry_id}
                      ?selected=${this._parentEntryId===s.entry_id}
                    >${s.object.name}</option>`)}
                </select>
              </label>`:u}
          <label class="textarea-field">
            <span class="textarea-label">${n("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${s=>this._notes=s.target.value}
            ></textarea>
            <span class="md-hint">${n("notes_markdown_hint",e)}</span>
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${n("cancel",this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?n("saving",this._lang):n("save",this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};R.styles=$`
    .place-on-site {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    .place-on-site.disabled {
      color: var(--disabled-text-color, var(--secondary-text-color));
    }
    .place-hint,
    .place-missing {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: -4px;
    }
    .place-missing {
      color: var(--warning-color, #c77700);
    }
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
    ms-textfield {
      display: block;
    }
    .textarea-field {
      display: flex; flex-direction: column; gap: 4px;
    }
    .textarea-label {
      font-size: 12px; color: var(--secondary-text-color, #888); font-weight: 500;
    }
    .textarea-field textarea {
      padding: 8px 10px; font-size: 14px; font-family: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      resize: vertical;
    }
    .textarea-field textarea:focus {
      outline: none; border-color: var(--primary-color);
    }
    /* The help text of every field (12 px, secondary; #216 consistency pass). */
    .md-hint {
      font-size: 12px; color: var(--secondary-text-color);
    }
    .parent-select {
      padding: 8px 10px; font-size: 14px; font-family: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      line-height: 1.4;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .radio-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
    }
    .radio-row input {
      margin: 0;
    }
  `,d([y({attribute:!1})],R.prototype,"hass",2),d([y({attribute:!1})],R.prototype,"objects",2),d([y({type:Boolean})],R.prototype,"placesEnabled",2),d([h()],R.prototype,"_open",2),d([h()],R.prototype,"_loading",2),d([h()],R.prototype,"_error",2),d([h()],R.prototype,"_name",2),d([h()],R.prototype,"_manufacturer",2),d([h()],R.prototype,"_model",2),d([h()],R.prototype,"_serialNumber",2),d([h()],R.prototype,"_areaId",2),d([h()],R.prototype,"_installationDate",2),d([h()],R.prototype,"_warrantyExpiry",2),d([h()],R.prototype,"_documentationUrl",2),d([h()],R.prototype,"_notes",2),d([h()],R.prototype,"_haDeviceId",2),d([h()],R.prototype,"_parentEntryId",2),d([h()],R.prototype,"_place",2),d([h()],R.prototype,"_remindOnSite",2),d([h()],R.prototype,"_entryId",2),d([h()],R.prototype,"_replacing",2),d([h()],R.prototype,"_oldDeviceId",2),d([h()],R.prototype,"_replaceDevice",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",R)});function dl(r){let i=(r||"").split(/\s+/).filter(Boolean);return i.length===0?"?":i.length===1?i[0][0].toUpperCase():(i[0][0]+i[i.length-1][0]).toUpperCase()}function pl(r){let i=0;for(let e of r)i=i*31+e.charCodeAt(0)>>>0;return Tn[i%Tn.length]}function An(r){return r?{id:r.id,name:r.name,initials:r.initials||dl(r.name),color:r.color||pl(r.id)}:null}var Tn,Cn=v(()=>{"use strict";C();Tn=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"]});var gi,In=v(()=>{"use strict";Cn();gi=class{constructor(i){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=i}updateHass(i){this.hass=i}async getUsers(i=!1){let e=Date.now();if(!i&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(i,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:i,task_id:e,user_id:t})}async getTasksByUser(i){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:i})).tasks}getUserName(i){return!i||!this.usersCache?null:this.usersCache.find(t=>t.id===i)?.name||null}getPerson(i){return An(this.getUser(i))}getUser(i){return!i||!this.usersCache?null:this.usersCache.find(e=>e.id===i)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(i){return i?i===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}}});function ae(r){return`${r.entry_id??""}\0${r.part_id}`}function Rn(r,i,e,t){let s=!!r.entry_id&&r.entry_id!==i,a=s?r.entry_id:i,o=e.find(m=>m.entry_id===a),c=(o?.parts||[]).find(m=>m.id===r.part_id)||null,p=s&&o?.object?.name||"",_=c?.name||n("shared_part_unknown",t);return{part:c,foreign:s,ownerName:p,label:p?`${_} (${p})`:_}}function Pn(r,i,e,t){let{part:s,label:a}=Rn(r,i,e,t),o=s&&s.stock!==null&&s.stock!==void 0?` (${it(s.stock,s.unit,t)})`:"",c=s?.storage_location?` \u2014 ${s.storage_location}`:"";return`${I(r.quantity,t)}\xD7 ${a}${o}${c}`}function Nn(r,i,e,t){let a=(e.find(c=>c.entry_id===i)?.parts||[]).map(c=>({...c})),o=new Set(a.map(c=>ae({part_id:c.id})));for(let c of r?.consumes_parts||[]){if(!c.entry_id||c.entry_id===i)continue;let p=ae(c);if(o.has(p))continue;o.add(p);let{part:_,ownerName:m}=Rn(c,i,e,t);a.push({id:c.part_id,name:_?.name||n("shared_part_unknown",t),unit:_?.unit,stock:_?.stock??null,storage_location:_?.storage_location,cost:_?.cost??null,package_size:_?.package_size??null,cost_mode:_?.cost_mode??null,entry_id:c.entry_id,owner_name:m})}return a}var fi=v(()=>{"use strict";T()});var _r,Hn,On=v(()=>{"use strict";_r=["sensor","binary_sensor","number","input_number","input_boolean","counter","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant","input_select","select","input_datetime","date","datetime","timer","update"],Hn=["sensor"]});function at(r){let i=(r??"").trim();if(i==="")return null;let e=Number(i.replace(",","."));return!Number.isFinite(e)||e<0?null:Math.round(e)}var yi=v(()=>{"use strict"});var mr,Lt,gr=v(()=>{"use strict";mr=["notes","cost","duration","photo","user"],Lt={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"}});var ul,hl,fr,Ln=v(()=>{"use strict";ul={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},hl="mdi:wrench-clock",fr=r=>r&&ul[r]||hl});function vi(r){return r?Array.isArray(r.entity_ids)&&r.entity_ids.length>0?[...r.entity_ids]:r.entity_id?[r.entity_id]:[]:[]}function jn(r){if(!(!r||r.type==="compound"))return vi(r)[0]}var qn=v(()=>{"use strict"});var yr,Vp,Mn,Dn=v(()=>{"use strict";yr=["low","normal","high"],Vp=[...yr].reverse(),Mn=["round_robin","least_completed","random"]});var Ae,bi=v(()=>{"use strict";C();F();T();Ae=class extends S{constructor(){super(...arguments);this.value="";this.lang="en";this._credit=!1;this._amount=""}willUpdate(e){if(!e.has("value"))return;let t=(this.value??"").trim();if(t===this._signed())return;let s=parseFloat(t);if(t===""||Number.isNaN(s)){this._amount="",this._credit=!1;return}this._credit=s<0,this._amount=String(Math.abs(s))}_signed(){let e=this._amount.trim();return e===""?"":this._credit?`-${e}`:e}_emit(){this.value=this._signed(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setCredit(e){this._credit!==e&&(this._credit=e,this._emit())}_onInput(e){let t=e.target.value;t.startsWith("-")&&(this._credit=!0),this._amount=t.replace(/^-+/,""),this._emit()}render(){let e=this.lang;return l`
      <div class="wrap">
        <div class="sign" role="group">
          <button type="button" class="kind cost ${this._credit?"":"on"}" aria-pressed=${String(!this._credit)}
            @click=${()=>this._setCredit(!1)}>${n("cost",e)}</button>
          <button type="button" class="kind credit ${this._credit?"on":""}" aria-pressed=${String(this._credit)}
            @click=${()=>this._setCredit(!0)}>${n("cost_kind_credit",e)}</button>
        </div>
        <input type="number" step="0.01" min="0" inputmode="decimal" class="field-input amount"
          .value=${this._amount} @input=${this._onInput} />
      </div>
      ${this._credit?l`<div class="hint">${n("cost_credit_hint",e)}</div>`:u}
    `}};Ae.styles=[ke,$`
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
    `],d([y()],Ae.prototype,"value",2),d([y()],Ae.prototype,"lang",2),d([h()],Ae.prototype,"_credit",2),d([h()],Ae.prototype,"_amount",2);customElements.get("ms-cost-input")||customElements.define("ms-cost-input",Ae)});function Un(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0",carry:{}}}function Vn(r){return{type:r.type||"threshold",attribute:r.attribute||"",above:r.trigger_above?.toString()??"",below:r.trigger_below?.toString()??"",equals:r.trigger_equals?.toString()??"",notEquals:r.trigger_not_equals?.toString()??"",forMinutes:r.trigger_for_minutes?.toString()??"0",targetValue:r.trigger_target_value?.toString()??"",deltaMode:r.trigger_delta_mode||!1,fromState:r.trigger_from_state||"",toState:r.trigger_to_state||"",targetChanges:r.trigger_target_changes?.toString()??"",runtimeHours:r.trigger_runtime_hours?.toString()??"",onStates:(r.trigger_on_states||[]).join(", "),daysBefore:r.trigger_days_before?.toString()??"0"}}function Gn(r,i){i.attribute&&(r.attribute=i.attribute);let e=parseInt(i.forMinutes,10);if(i.type==="threshold"){let t=parseFloat(i.above);isNaN(t)||(r.trigger_above=t);let s=parseFloat(i.below);isNaN(s)||(r.trigger_below=s);let a=parseFloat(i.equals);isNaN(a)||(r.trigger_equals=a);let o=parseFloat(i.notEquals);isNaN(o)||(r.trigger_not_equals=o),isNaN(e)||(r.trigger_for_minutes=e)}else if(i.type==="counter"){let t=parseFloat(i.targetValue);isNaN(t)||(r.trigger_target_value=t),r.trigger_delta_mode=i.deltaMode}else if(i.type==="state_change"){i.fromState&&(r.trigger_from_state=i.fromState),i.toState&&(r.trigger_to_state=i.toState);let t=parseInt(i.targetChanges,10);isNaN(t)||(r.trigger_target_changes=t),isNaN(e)||(r.trigger_for_minutes=e)}else if(i.type==="runtime"){let t=parseFloat(i.runtimeHours);isNaN(t)||(r.trigger_runtime_hours=t);let s=(i.onStates||"").split(",").map(a=>a.trim()).filter(Boolean);s.length>0&&(r.trigger_on_states=s)}else if(i.type==="due_date"){let t=parseInt(i.daysBefore,10);r.trigger_days_before=isNaN(t)?0:t}}function yl(r){return{entityIds:vi(r).join(", "),...Vn(r),carry:Object.fromEntries(Object.entries(r).filter(([e])=>!fl.has(e)&&!e.startsWith("_")))}}function vl(r){let i=r.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(i.length===0)return null;let e={...r.carry||{},entity_id:i[0],entity_ids:i,type:r.type};return Gn(e,r),e}function bl(r){return Array.from({length:7},(i,e)=>tt(e,r,"short"))}function Bn(r){return Array.from({length:12},(i,e)=>pi(e,r,"short"))}var _l,ml,xi,zn,Wn,Fn,gl,he,We,fl,g,vr,Kn=v(()=>{"use strict";C();F();T();In();fi();Ue();On();Te();Ht();yi();gr();mi();Ln();qn();Dn();nt();bi();_l=["cleaning","inspection","replacement","calibration","service","reading","custom"],ml=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],xi=["weekdays","nth_weekday","day_of_month","calendar"],zn=["time_based","one_time",...xi],Wn=["threshold","counter","state_change","runtime","due_date"],Fn=(r,i)=>n(r==="due_date"?"trigger_type_due_date":r,i),gl=[...Wn,"compound"],he={alpha:"0.3",min:"7",max:"365"},We=Se;fl=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);g=class g extends S{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calMonths=[];this._hadCalMonths=!1;this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._detailsOpen=!1;this._mirrorTodoEntities=[];this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=he.alpha;this._adaptiveMin=he.min;this._adaptiveMax=he.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set;this._attrSeq=0}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return N(this.hass)}async openCreate(e,t){this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="";let s=(t||[]).filter(a=>!a.object.archived&&!a.object.archived_at);!e&&s.length>0?(this._objectChoices=s.map(a=>({entry_id:a.entry_id,name:a.object.name})).sort((a,o)=>a.name.localeCompare(o.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._warning="",this._objectChoices=[],this._isFleetTask=t.battery_fleet_task===!0,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let s=t.schedule;this._weekdays=s?.kind==="weekdays"?[...s.weekdays??[]]:[],this._nth=s?.kind==="nth_weekday"?String(s.nth??1):"1",this._nthWeekday=s?.kind==="nth_weekday"?String(s.weekday??5):"5",this._domDay=s?.kind==="day_of_month"&&(s.day??1)>=1?String(s.day??1):"1",this._domLastDay=s?.kind==="day_of_month"&&s.day===-1,this._domBusiness=s?.kind==="day_of_month"&&s.business===!0,this._calMonths=(s?.kind==="day_of_month"||s?.kind==="nth_weekday")&&Array.isArray(s.months)?[...s.months]:[],this._hadCalMonths=this._calMonths.length>0,this._calendarEntity=s?.kind==="calendar"&&s.entity_id||"",this._calOffset=s?.offset?String(s.offset):"0",this._seasonMonths=Array.isArray(s?.season_months)?[...s.season_months]:[];let a=s?.ends;a&&typeof a.count=="number"?(this._endsMode="count",this._endsCount=String(a.count),this._endsUntil=""):a&&typeof a.until=="string"?(this._endsMode="until",this._endsUntil=a.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._notifyIcon=t.notify_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._mirrorTodoEntities=[...t.mirror_todo_entities||[]],this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._notifyEnabled=t.notify_enabled!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(_=>({..._})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(_=>[ae(_),{..._}])),this._consumesQtyText={},this._responsibleUserId=t.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([_,m])=>{let{name:f,checklist:b,consumes_parts:w,required_completion_fields:k,...O}=m,P=m.consumes_parts||[],q=P.findIndex(W=>!W.entry_id),B=q>=0?P[q]:void 0;return{id:_,name:m.name||_,checklistText:(m.checklist||[]).join(`
`),partId:B?.part_id||"",partQty:B?.quantity!=null?String(B.quantity):"",reqOverride:m.required_completion_fields!==void 0,reqFields:[...m.required_completion_fields||[]],extraParts:P.filter((W,x)=>x!==q).map(W=>({...W})),carry:O}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"",this._scheduleTimeOn=!!t.schedule_time;let o=t.on_complete_action;if(o&&o.service){this._actionService=o.service;let _=o.target?.entity_id;this._actionTargetEntity=Array.isArray(_)?_[0]||"":_||"",this._actionTargetStored=o.target&&typeof o.target=="object"?JSON.parse(JSON.stringify(o.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=o.data&&typeof o.data=="object"?{...o.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=o.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let c=t.quick_complete_defaults;this._qcNotes=c?.notes||"",this._qcCost=c?.cost!=null?String(c.cost):"",this._qcDuration=c?.duration!=null?String(c.duration):"",this._qcFeedback=c?.feedback||"";let p=t.adaptive_config||{};if(this._environmentalEntity=p.environmental_entity||"",this._environmentalAttribute=p.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!p.enabled,this._adaptiveAlpha=p.ewa_alpha?.toString()??he.alpha,this._adaptiveMin=p.min_interval_days?.toString()??he.min,this._adaptiveMax=p.max_interval_days?.toString()??he.max,this._adaptiveSeasonal=p.seasonal_enabled!==!1,this._adaptivePrediction=p.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,t.trigger_config){let _=t.trigger_config;this._triggerEntityId=jn(_)||"",this._triggerEntityIds=vi(_),this._triggerEntityLogic=_.entity_logic||"any",this._setTypeFields(Vn(_)),this._triggerCombinator=_.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=_.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=_.auto_complete_on_recovery||!1,this._triggerRuntimeMaxSession=_.trigger_runtime_max_session_seconds?.toString()||"",_.type==="compound"?(this._compoundLogic=_.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(_.conditions||[]).map(yl)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),this._detailsOpen=this._priority!=="normal"||!!this._labels.trim()||!!this._documentationUrl.trim()||!!this._customIcon,await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._detailsOpen=!1,this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._calMonths=[],this._hadCalMonths=!1,this._calendarEntity="",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._notifyEnabled=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=he.alpha,this._adaptiveMin=he.min,this._adaptiveMax=he.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._actionTestError="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates,this._triggerDaysBefore=e.daysBefore}_resetTriggerFields(){++this._attrSeq,this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(Un()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerRuntimeMaxSession="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new gi(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=n("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,s]=e.split(".");if(!this.hass?.services?.[t]?.[s]){this._actionTestResult="error",this._actionTestError=n("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let a=this._actionTargetEntity.trim();if(a){let o=a.split(".")[0];if(o!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=n("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",t).replace("{entity}",a).replace("{entity_domain}",o).replace("{suggestion}",`${o}.${s}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[a]){this._actionTestResult="error",this._actionTestError=n("action_test_entity_missing",this._lang).replace("{entity}",a),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,s]=e.split("."),a=this.hass?.services?.[t]?.[s]?.fields;return!a||Object.keys(a).length===0?null:Object.entries(a).map(([o,c])=>({name:o,required:!!c.required,selector:c.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([t,s])=>t==="entity_id"?Array.isArray(s)&&s.length>1:Array.isArray(s)?s.length>0:!!s):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},t=a=>(Array.isArray(a)?a:[a]).filter(o=>typeof o=="string"&&!!o),s=this.hass;return[...t(e.entity_id).map(a=>s.states?.[a]?.attributes?.friendly_name||a),...t(e.device_id).map(a=>s.devices?.[a]?.name_by_user||s.devices?.[a]?.name||a),...t(e.area_id).map(a=>s.areas?.[a]?.name||a),...t(e.floor_id).map(a=>s.floors?.[a]?.name||a),...t(e.label_id)].join(", ")}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return u;let t=this._serviceSchema();return l`
      <details class="ca-section">
        <summary>${n("on_complete_action_title",e)}</summary>
        <p class="field-help">${n("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${s=>{this._actionService=s.detail.value||"";let a=this._serviceSchema();if(a){let o=new Set(a.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>o.has(c)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>n("on_complete_action_target",e)}
          @value-changed=${s=>{let a=s.detail.value;this._actionTargetEntity=a.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?l`<p class="field-help ca-target-more">${n("on_complete_action_target_more",e).replace("{targets}",this._actionTargetSummary())}</p>`:u}
        <p class="field-help ca-domain-hint">
          ${n("on_complete_action_target_hint",e)}
        </p>
        <label class="ca-skip-auto">
          <input type="checkbox" .checked=${this._actionSkipAuto}
            @change=${s=>{this._actionSkipAuto=s.target.checked}} />
          <span>${n("on_complete_action_skip_auto",e)}</span>
        </label>
        ${t?l`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${s=>{this._actionData={...s.detail.value}}}
              ></ha-form>
            `:l`
              <ms-textfield
                label="${n("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${s=>{this._actionDataJsonFallback=s.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":n("on_complete_action_test",e)}
          </button>
          ${this._actionTestResult==="ok"?l`<span class="ca-test-ok">${n("on_complete_action_test_success",e)}</span>`:u}
          ${this._actionTestResult==="error"?l`<div class="ca-test-error-block">
                <span class="ca-test-error">${n("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?l`<div class="ca-test-error-detail">${this._actionTestError}</div>`:u}
              </div>`:u}
        </div>
      </details>

      ${this.completionActionsEnabled?l`<details class="ca-section">
        <summary>${n("quick_complete_defaults_title",e)}</summary>
        <p class="field-help">${n("quick_complete_defaults_desc",e)}</p>
        <ms-textfield
          label="${n("quick_complete_defaults_notes",e)}"
          .value=${this._qcNotes}
          @input=${s=>{this._qcNotes=s.target.value}}
        ></ms-textfield>
        <div class="qc-cost">
          <span class="qc-cost-label">${n("quick_complete_defaults_cost",e)}</span>
          <ms-cost-input .lang=${e} .value=${this._qcCost}
            @value-changed=${s=>{this._qcCost=s.detail.value}}></ms-cost-input>
        </div>
        <ms-textfield
          label="${n("quick_complete_defaults_duration",e)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${s=>{this._qcDuration=s.target.value}}
        ></ms-textfield>
        <select class="qc-feedback" aria-label=${n("was_maintenance_needed",e)}
          .value=${this._qcFeedback}
          @change=${s=>{this._qcFeedback=s.target.value}}>
          <option value="">${n("quick_complete_defaults_feedback_none",e)}</option>
          <option value="needed">${n("quick_complete_defaults_feedback_needed",e)}</option>
          <option value="not_needed">${n("quick_complete_defaults_feedback_not_needed",e)}</option>
          <option value="not_sure">${n("feedback_not_sure",e)}</option>
        </select>
      </details>`:u}
    `}async _loadParts(){this.parts=[];let e=this._entryId;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e});if(e!==this._entryId)return;this.parts=t.parts||[],this._partsLoadFailed=!1}catch{if(e!==this._entryId)return;this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){this._foreignOwners=[];let e=this._entryId;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});if(e!==this._entryId)return;this._foreignOwners=(t.objects||[]).filter(s=>s.entry_id!==e&&(s.parts||[]).length>0).map(s=>({entry_id:s.entry_id,name:s.object?.name||s.entry_id,parts:s.parts||[]})).sort((s,a)=>s.name.localeCompare(a.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let s=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:s.suggested_attributes||[],available:s.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){let t=++this._attrSeq;if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});if(t!==this._attrSeq)return;this._entityDomain=s.domain||"",this._suggestedAttributes=s.suggested_attributes||[],this._availableAttributes=s.available_attributes||[]}catch{if(t!==this._attrSeq)return;this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let s=ae({part_id:e.id,entry_id:t}),a=this._consumesParts[s],o=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return l`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${a!==void 0}
            @change=${c=>{let p={...this._consumesParts};if(c.target.checked)p[s]=p[s]||o;else{delete p[s];let _={...this._consumesQtyText};delete _[s],this._consumesQtyText=_}this._consumesParts=p}}
          />
          <span>${e.name}${e.unit?` (${e.unit})`:""}</span>
        </label>
        ${a!==void 0?l`<input
              class="consumes-qty"
              aria-label=${`${e.name}: ${n("quantity",this._lang)}`}
              type="number"
              min=${We[0]}
              max=${We[1]}
              step="0.01"
              .value=${this._consumesQtyText[s]??String(a.quantity)}
              @input=${c=>{let p=c.target.value;this._consumesQtyText={...this._consumesQtyText,[s]:p};let _=parseFloat(p.replace(",","."));Number.isFinite(_)&&_>=We[0]&&(this._consumesParts={...this._consumesParts,[s]:{...o,quantity:_}})}}
            />`:u}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let t of Object.keys(e)){let s=this._consumesQtyText[t];if(s===void 0)continue;let a=parseFloat(s.replace(",","."));if(!Number.isFinite(a)||a<We[0]||a>We[1]){let o=c=>I(c,this._lang,{maximumFractionDigits:2});return this._error=n("settings_value_out_of_range",this._lang).replace("{min}",o(We[0])).replace("{max}",o(We[1])),!1}e[t]={...e[t],quantity:a}}return this._consumesParts=e,!0}_toggleRequired(e,t){let s=new Set(this._requiredCompletion);t?s.add(e):s.delete(e),this._requiredCompletion=[...s]}_patchReading(e,t){this._readings=this._readings.map(s=>s.id===e?{...s,...t}:s)}_renderReadingsEditor(e){let t=hn(this._readings);return l`
      <div class="readings-editor">
        <div class="field-label">${n("readings_section",e)}</div>
        <div class="field-help">${n("readings_hint",e)}</div>
        ${this._readings.map(s=>l`
          ${t.has(s.id)?l`<div class="field-help reading-dup">${n("reading_duplicate_name",e)}</div>`:u}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${n("reading_name_label",e)}"
              .value=${s.name}
              @input=${a=>this._patchReading(s.id,{name:a.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${n("reading_unit_short",e)}"
              .value=${s.unit||""}
              @input=${a=>this._patchReading(s.id,{unit:a.target.value})}
            ></ms-textfield>
            <ha-icon-button class="phase-remove reading-remove" .label=${n("remove",e)} @click=${()=>this._readings=this._readings.filter(a=>a.id!==s.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<cr?l`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:ln(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${n("reading_add",e)}
          </ha-button>`:u}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",s=t,a=2;for(;this._phaseDefs.some(o=>o.id===s);)s=`${t}-${a++}`;return s}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(s=>s.id===e?{...s,...t}:s)}_renderPhasesEditor(e){let t=s=>this._phaseDefs.find(a=>a.id===s)?.name||s;return l`
      <details class="phases-section" ?open=${this._phaseDefs.length>0}>
      <summary>${n("phases_section",e)}</summary>
      <div class="field-help">${n("phases_hint",e)}</div>
      ${this._phaseDefs.map(s=>l`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${n("phase_name",e)}"
              .value=${s.name}
              @input=${a=>this._patchPhaseDef(s.id,{name:a.target.value})}
            ></ms-textfield>
            ${this.parts.length?l`
              <select
                class="phase-part"
                aria-label=${n("spare_part",e)}
                .value=${s.partId}
                @change=${a=>{let o=a.target.value;this._patchPhaseDef(s.id,s.partQty?{partId:o}:{partId:o,partQty:"1"})}}
              >
                <option value="">—</option>
                ${this.parts.map(a=>l`<option value=${a.id} ?selected=${a.id===s.partId}>${a.name}</option>`)}
              </select>
              ${s.partId?l`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" aria-label=${n("quantity",e)} type="number" min=${Se[0]} step="0.01" placeholder="1" .value=${s.partQty}
                  @input=${a=>this._patchPhaseDef(s.id,{partQty:a.target.value})} />
              `:u}
            `:u}
            <ha-icon-button class="phase-remove" .label=${n("remove",e)} @click=${()=>this._removePhaseDef(s.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?l`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${n("checklist_placeholder",e)}"
              .value=${s.checklistText}
              @input=${a=>this._patchPhaseDef(s.id,{checklistText:a.target.value})}
            ></textarea>
          `:u}
          <label class="req-option phase-req-toggle">
            <input
              type="checkbox"
              .checked=${s.reqOverride}
              @change=${a=>this._patchPhaseDef(s.id,{reqOverride:a.target.checked})}
            />
            <span>${n("phase_require_override",e)}</span>
          </label>
          ${s.reqOverride?l`
            <div class="required-completion phase-req-fields">
              ${mr.map(a=>l`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${s.reqFields.includes(a)}
                    @change=${o=>{let c=o.target.checked,p=new Set(s.reqFields);c?p.add(a):p.delete(a),this._patchPhaseDef(s.id,{reqFields:[...p]})}}
                  />
                  <span>${n(Lt[a],e)}</span>
                </label>
              `)}
            </div>
          `:u}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${n("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(s=>s.name.trim())?l`
        <div class="phase-seq-label">${n("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((s,a)=>l`
            <span class="phase-chip">
              ${a+1}. ${t(s)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((o,c)=>c!==a)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            aria-label=${n("phase_sequence_add_step",e)}
            .value=${""}
            @change=${s=>{let a=s.target.value;a&&(this._phaseSeq=[...this._phaseSeq,a]),s.target.value=""}}
          >
            <option value="">+ ${n("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(s=>s.name.trim()).map(s=>l`<option value=${s.id}>${s.name}</option>`)}
          </select>
        </div>
      `:u}
      </details>
    `}async _save(){if(!this._loading&&!(!this._name.trim()||this._missingDueDate())){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let e=parseInt(this._adaptiveMin,10),t=parseInt(this._adaptiveMax,10);if(!isNaN(e)&&!isNaN(t)&&e>t){this._error=`${n("adaptive_min_interval",this._lang)} > ${n("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=n("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=n("calendar_entity_required",this._lang);return}if(this._applyConsumesQtyText()){this._loading=!0,this._error="";try{let e=await j(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:o=>{this._error=o}});if(e===void 0)return;let t=this._taskId||e?.task_id,s=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let a=o=>{this._warning=n("subsave_warning",this._lang).replace("{detail}",o)};if(t&&this._scheduleType==="sensor_based"&&s&&await j(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:t,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:a})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),t&&this._adaptiveSnapshot()!==this._adaptiveInitial){let o=parseFloat(this._adaptiveAlpha),c=parseInt(this._adaptiveMin,10),p=parseInt(this._adaptiveMax,10);await j(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:t,enabled:this._adaptiveEnabled,...o>=Nt[0]&&o<=Nt[1]?{ewa_alpha:o}:{},...!isNaN(c)&&c>=1?{min_interval_days:c}:{},...!isNaN(p)&&p>=1?{max_interval_days:p}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:a})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?t&&(this._taskId=t):this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}}}}_missingDueDate(){return this._scheduleType==="one_time"&&!this._dueDate}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):xi.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.priority=this._priority,e.labels=this._labels.split(",").map(s=>s.trim()).filter(Boolean),e.mirror_todo_entities=this._mirrorTodoEntities.filter(Boolean),e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=_n(this._readings);{let s={};for(let o of this._phaseDefs){if(!o.name.trim())continue;let c={...o.carry,name:o.name.trim()},p=o.checklistText.split(`
`).map(m=>m.trim()).filter(Boolean);p.length&&(c.checklist=p);let _=[];if(o.partId){let m=parseFloat(o.partQty);_.push({part_id:o.partId,quantity:Number.isFinite(m)&&m>0?m:1})}for(let m of o.extraParts)_.push(m.entry_id?{part_id:m.part_id,quantity:m.quantity,entry_id:m.entry_id}:{part_id:m.part_id,quantity:m.quantity});_.length&&(c.consumes_parts=_),o.reqOverride&&(c.required_completion_fields=[...o.reqFields]),s[o.id]=c}let a=this._phaseSeq.filter(o=>o in s);e.phases=Object.keys(s).length&&a.length?s:null,e.phase_sequence=e.phases?a:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(s=>s.entry_id?{part_id:s.part_id,quantity:s.quantity,entry_id:s.entry_id}:{part_id:s.part_id,quantity:s.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let s=this._compoundConditions.map(vl).filter(a=>a!==null);if(s.length>0){let a={type:"compound",compound_logic:this._compoundLogic,conditions:s};this._autoCompleteOnRecovery&&(a.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(a.trigger_combinator="all"),e.trigger_config=a}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let s=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],a={entity_id:s[0],entity_ids:s,type:this._triggerType};if(Gn(a,this._typeFields()),this._autoCompleteOnRecovery&&(a.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(a.trigger_combinator="all"),s.length>1&&(a.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let o=parseFloat(this._triggerBaselineValue);!isNaN(o)&&o>=0&&(a.trigger_baseline_value=o)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let o=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(o)&&o>0&&(a.trigger_runtime_max_session_seconds=o)}e.trigger_config=a}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&zn.includes(this._scheduleType)){let s=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(s)?s:null}if(this.checklistsEnabled){let s=this._checklistText.split(`
`).map(a=>a.trim()).filter(Boolean).slice(0,100);e.checklist=s.length?s:null}if(this.completionActionsEnabled||this._actionPresent){let s=this._actionService.trim();if(s&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(s)){let a={service:s},o=this._actionTargetEntity.trim();this._actionTargetStored&&o===this._actionTargetInitial?a.target=JSON.parse(JSON.stringify(this._actionTargetStored)):o&&(a.target={entity_id:o});let c=this._buildActionData();Object.keys(c).length>0&&(a.data=c),this._actionSkipAuto&&(a.skip_auto=!0),e.on_complete_action=a}else e.on_complete_action=null}if(this.completionActionsEnabled){let s={};this._qcNotes.trim()&&(s.notes=this._qcNotes.trim());let a=parseFloat(this._qcCost);isNaN(a)||(s.cost=a);let o=at(this._qcDuration);o!==null&&(s.duration=o),this._qcFeedback&&(s.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(s).length?s:null}return e}_close(){this._open=!1,this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return u;let e=this._lang,t=this._triggerType==="compound";return l`
      <div class="select-row">
        <label>${n("trigger_type",e)}</label>
        <select aria-label=${n("trigger_type",e)}
          .value=${this._triggerType}
          @change=${s=>this._triggerType=s.target.value}
        >
          ${gl.map(s=>l`<option value=${s} ?selected=${s===this._triggerType}>${Fn(s,e)}</option>`)}
        </select>
      </div>
      ${t?this._renderCompoundEditor():l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${n("entity_id",e)} (${n("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${s=>{let o=s.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=o[0]||"",this._triggerEntityIds=o,o[0]&&this._fetchEntityAttributes(o[0])}}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:_r}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>n("entity_id",e)}
          @value-changed=${s=>{let a=(s.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=a[0]||"",this._triggerEntityIds=a,a[0]?this._fetchEntityAttributes(a[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?l`
          <div class="select-row">
            <label>${n("entity_logic",e)}</label>
            <select aria-label=${n("entity_logic",e)}
              .value=${this._triggerEntityLogic}
              @change=${s=>this._triggerEntityLogic=s.target.value}
            >
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${n("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${n("entity_logic_all",e)}</option>
            </select>
          </div>
        `:u}
        ${this._renderAttributeSelect({label:n("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:s=>this._triggerAttribute=s})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      <label>
        <input
          type="checkbox"
          .checked=${this._autoCompleteOnRecovery}
          @change=${s=>this._autoCompleteOnRecovery=s.target.checked}
        />
        ${n("auto_complete_on_recovery",e)}
      </label>
      <div class="field-help">${n("auto_complete_on_recovery_help",e)}</div>
      <ms-textfield
        label="${n("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${s=>this._intervalDays=s.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():u}
      ${this._intervalDays?l`
            <div class="select-row">
              <label>${n("trigger_combinator",e)}</label>
              <select aria-label=${n("trigger_combinator",e)}
                @change=${s=>this._triggerCombinator=s.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${n("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${n("trigger_combinator_all",e)}</option>
              </select>
            </div>
          `:u}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((s,a)=>a===e?{...s,...t}:s)}_addCondition(){this._compoundConditions=[...this._compoundConditions,Un()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,s)=>s!==e)}_renderCompoundEditor(){let e=this._lang;return l`
      <div class="select-row">
        <label>${n("compound_logic",e)}</label>
        <select aria-label=${n("compound_logic",e)}
          .value=${this._compoundLogic}
          @change=${t=>this._compoundLogic=t.target.value}
        >
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${n("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${n("compound_logic_or",e)}</option>
        </select>
      </div>
      <div class="field-help">${n("compound_help",e)}</div>
      ${this._compoundConditions.length===0?l`<div class="field-help">${n("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,s)=>this._renderCondition(t,s))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${n("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let s=this._lang,a=t+1;return l`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${n("compound_condition",s)} ${a}</span>
          <button
            type="button"
            class="icon-btn"
            title="${n("compound_remove_condition",s)}"
            @click=${()=>this._removeCondition(t)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${n("entity_id",s)} (${n("comma_separated",s)})"
            .value=${e.entityIds}
            @input=${o=>this._patchCondition(t,{entityIds:o.target.value})}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:_r}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(o=>o.trim()).filter(Boolean)}}
          .computeLabel=${()=>n("entity_id",s)}
          @value-changed=${o=>{let c=(o.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:c.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          <label>${n("trigger_type",s)}</label>
          <select aria-label=${n("trigger_type",s)}
            .value=${e.type}
            @change=${o=>this._patchCondition(t,{type:o.target.value})}
          >
            ${Wn.map(o=>l`<option value=${o} ?selected=${o===e.type}>${Fn(o,s)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(e,t)}
      </div>
    `}_renderStateField(e){return this._entityPickerFallback||!e.entityId?l`
        <ms-textfield
          label=${e.label}
          .value=${e.value}
          @input=${t=>e.onInput(t.target.value)}
        ></ms-textfield>
      `:l`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId}}}]}
        .data=${{s:e.value}}
        .computeLabel=${()=>e.label}
        @value-changed=${t=>e.onInput((t.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(e){let t=this._lang;return this._entityPickerFallback||!e.entityId?l`
        <ms-textfield
          label="${n("runtime_on_states",t)}"
          placeholder="on"
          .value=${e.value}
          @input=${s=>e.onInput(s.target.value)}
        ></ms-textfield>
      `:l`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(s=>s.trim()).filter(Boolean)}}
        .computeLabel=${()=>n("runtime_on_states",t)}
        @value-changed=${s=>e.onInput((s.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?u:!this.adaptiveFeature&&!this._adaptiveWasEnabled?u:l`
      <details class="adaptive-section" ?open=${this._adaptiveEnabled}>
        <summary>${n("adaptive_section_title",e)}</summary>
        <label>
          <input
            type="checkbox"
            .checked=${this._adaptiveEnabled}
            @change=${t=>this._adaptiveEnabled=t.target.checked}
          />
          ${n("adaptive_enabled",e)}
        </label>
        ${this._adaptiveEnabled?l`
          <ms-textfield
            label="${n("adaptive_min_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMin}
            @input=${t=>this._adaptiveMin=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("adaptive_max_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMax}
            @input=${t=>this._adaptiveMax=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("adaptive_ewa_alpha",e)}"
            type="number"
            min=${Nt[0]}
            max=${Nt[1]}
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${t=>this._adaptiveAlpha=t.target.value}
          ></ms-textfield>
          ${this.seasonalFeature?l`<label>
            <input
              type="checkbox"
              .checked=${this._adaptiveSeasonal}
              @change=${t=>this._adaptiveSeasonal=t.target.checked}
            />
            ${n("adaptive_seasonal_enabled",e)}
          </label>`:u}
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptivePrediction}
              @change=${t=>this._adaptivePrediction=t.target.checked}
            />
            ${n("adaptive_prediction_enabled",e)}
          </label>
        `:u}
      </details>
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?l`
        <div class="select-row">
          <label>${e.label}</label>
          <select aria-label=${e.label}
            .value=${e.value}
            @change=${s=>e.onSelect(s.target.value)}
          >
            <option value="" ?selected=${!e.value}>${n("use_entity_state",t)}</option>
            ${e.suggested.map(s=>l`<option value=${s} ?selected=${s===e.value}>${s} ★</option>`)}
            ${e.available.filter(s=>!e.suggested.includes(s.name)).map(s=>l`<option value=${s.name} ?selected=${s.name===e.value}>${s.name}${s.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:l`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${s=>e.onSelect(s.target.value.trim())}
      ></ms-textfield>
    `}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:n("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:s=>this._environmentalAttribute=s})}_renderConditionAttribute(e,t){let s=e.entityIds.split(",")[0]?.trim()||"";s&&this._fetchConditionAttributes(s);let a=s?this._conditionAttrOptions[s]:void 0;return this._renderAttributeSelect({label:n("attribute_optional",this._lang),value:e.attribute,suggested:a?.suggested??[],available:a?.available??[],onSelect:o=>this._patchCondition(t,{attribute:o})})}_renderConditionTypeFields(e,t){let s=this._lang;if(e.type==="threshold")return l`
        <ms-textfield label="${n("trigger_above",s)}" type="number" .value=${e.above}
          @input=${a=>this._patchCondition(t,{above:a.target.value})}></ms-textfield>
        <ms-textfield label="${n("trigger_below",s)}" type="number" .value=${e.below}
          @input=${a=>this._patchCondition(t,{below:a.target.value})}></ms-textfield>
        <ms-textfield label="${n("trigger_equals",s)}" type="number" .value=${e.equals}
          @input=${a=>this._patchCondition(t,{equals:a.target.value})}></ms-textfield>
        <ms-textfield label="${n("trigger_not_equals",s)}" type="number" .value=${e.notEquals}
          @input=${a=>this._patchCondition(t,{notEquals:a.target.value})}></ms-textfield>
        <ms-textfield label="${n("for_minutes",s)}" type="number" .value=${e.forMinutes}
          @input=${a=>this._patchCondition(t,{forMinutes:a.target.value})}></ms-textfield>
      `;if(e.type==="counter")return l`
        <ms-textfield label="${n("target_value",s)}" type="number" .value=${e.targetValue}
          @input=${a=>this._patchCondition(t,{targetValue:a.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${e.deltaMode}
            @change=${a=>this._patchCondition(t,{deltaMode:a.target.checked})} />
          ${n("delta_mode",s)}
        </label>
      `;if(e.type==="state_change"){let a=e.entityIds.split(",")[0]?.trim()||"";return l`
        ${this._renderStateField({label:n("from_state_optional",s),value:e.fromState,entityId:a,onInput:o=>this._patchCondition(t,{fromState:o})})}
        ${this._renderStateField({label:n("to_state_optional",s),value:e.toState,entityId:a,onInput:o=>this._patchCondition(t,{toState:o})})}
        <ms-textfield label="${n("target_changes",s)}" type="number" .value=${e.targetChanges}
          @input=${o=>this._patchCondition(t,{targetChanges:o.target.value})}></ms-textfield>
        <ms-textfield label="${n("for_minutes",s)}" type="number" .value=${e.forMinutes}
          @input=${o=>this._patchCondition(t,{forMinutes:o.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let a=e.entityIds.split(",")[0]?.trim()||"";return l`
        <ms-textfield label="${n("runtime_hours",s)}" type="number" .value=${e.runtimeHours}
          @input=${o=>this._patchCondition(t,{runtimeHours:o.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:a,onInput:o=>this._patchCondition(t,{onStates:o})})}
      `}return e.type==="due_date"?l`
        <ms-textfield label="${n("days_before",s)}" type="number" step="1"
          min=${Rt[0]} max=${Rt[1]} .value=${e.daysBefore}
          @input=${a=>this._patchCondition(t,{daysBefore:a.target.value})}></ms-textfield>
      `:u}_renderUnitSelect(){let e=this._lang;return l`
      <div class="select-row">
        <label>${n("interval_unit",e)}</label>
        <select aria-label=${n("interval_unit",e)}
          .value=${this._intervalUnit}
          @change=${t=>this._intervalUnit=t.target.value}
        >
          ${["days","weeks","months","years"].map(t=>l`<option value=${t} ?selected=${t===this._intervalUnit}>${n("unit_"+t,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(xi.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(g._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let s=(p,_,m=0)=>{if(!(!p||m>10)){(p.tagName?.toLowerCase()??"")==="ha-entity-picker"&&_.push(p);for(let f of[p.shadowRoot,p])if(f)for(let b of Array.from(f.children??[]))s(b,_,m+1)}},a=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],o=[];for(let p of a)s(p,o);let c=o.length===0||o.some(p=>p.offsetHeight===0);if(e.offsetHeight===0||c){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){++this._previewSeq,this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{},...this._taskId?{entry_id:this._entryId,task_id:this._taskId}:{}});if(t!==this._previewSeq)return;this._schedulePreview=s.occurrences||[],this._schedulePreviewEnded=!!s.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return u;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",s=this._schedulePreview.map((o,c)=>{let p=new Date(`${o}T12:00:00`).getDay();return`${tt(p===0?6:p-1,e,"short")} ${L(o,e)}${c===0?t:""}`}).join(" \xB7 "),a=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?l`<div class="field-help">${n("schedule_preview_ontime",e)}</div>`:u;return l`
      <div class="trigger-live-hint schedule-preview">
        ${n("schedule_preview_title",e)}: ${s}${this._schedulePreviewEnded?l` <span class="field-help">${n("schedule_preview_ends",e)}</span>`:u}
        ${a}
      </div>
    `}_buildSchedule(){let e=a=>{let o=parseInt(this._calOffset,10)||0;return o&&(a.offset=Math.max(-Pt,Math.min(o,Pt))),a},t=a=>((this._calMonths.length||this._hadCalMonths)&&(a.months=[...this._calMonths].sort((o,c)=>o-c)),e(a));if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((a,o)=>a-o)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let s={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(s.business=!0),t(s)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,s)=>t-s)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleCalMonth(e){this._calMonths=this._calMonths.includes(e)?this._calMonths.filter(t=>t!==e):[...this._calMonths,e]}_renderCalMonths(){let e=this._lang;return l`
      <label class="field-label">${n("recurrence_months_label",e)}</label>
      <div class="field-help">${n("recurrence_months_hint",e)}</div>
      <div class="weekday-chips season-chips cal-month-chips">
        ${Bn(e).map((t,s)=>l`
          <button
            type="button"
            class="season-chip ${this._calMonths.includes(s+1)?"selected":""}"
            @click=${()=>this._toggleCalMonth(s+1)}
          >${t}</button>`)}
      </div>`}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||xi.includes(this._scheduleType)))return u;let s=Bn(e);return l`
      <label class="field-label">${n("season_window_label",e)}</label>
      <div class="field-help">${n("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${s.map((a,o)=>l`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(o+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(o+1)}
          >${a}</button>`)}
      </div>

      <label class="field-label">${n("series_end_label",e)}</label>
      <div class="select-row">
        <select aria-label=${n("series_end_label",e)} .value=${this._endsMode}
          @change=${a=>this._endsMode=a.target.value}>
          <option value="never" ?selected=${this._endsMode==="never"}>${n("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${n("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${n("series_end_until",e)}</option>
        </select>
      </div>
      ${this._endsMode==="count"?l`
        <!-- max: MAX_SERIES_COUNT (const.py), what the history can count. -->
        <ms-textfield
          label="${n("series_end_count_label",e)}"
          type="number" min="1" max="500"
          .value=${this._endsCount}
          @input=${a=>this._endsCount=a.target.value}
        ></ms-textfield>`:u}
      ${this._endsMode==="until"?l`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${n("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${a=>this._endsUntil=a.detail.value}
        ></ms-date-field>`:u}
    `}_renderCalendarFields(){let e=this._lang,t=bl(e);if(this._scheduleType==="weekdays")return l`
        <label class="field-label">${n("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((s,a)=>l`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(a)?"selected":""}"
              @click=${()=>this._toggleWeekday(a)}
            >${s}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let s=[["1",n("ord_1",e)],["2",n("ord_2",e)],["3",n("ord_3",e)],["4",n("ord_4",e)],["5",n("ord_5",e)],["-1",n("ord_last",e)]];return l`
        <div class="select-row">
          <label>${n("recurrence_occurrence",e)}</label>
          <select aria-label=${n("recurrence_occurrence",e)} .value=${this._nth} @change=${a=>this._nth=a.target.value}>
            ${s.map(([a,o])=>l`<option value=${a} ?selected=${a===this._nth}>${o}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${n("recurrence_weekday",e)}</label>
          <select aria-label=${n("recurrence_weekday",e)} .value=${this._nthWeekday} @change=${a=>this._nthWeekday=a.target.value}>
            ${t.map((a,o)=>l`<option value=${String(o)} ?selected=${String(o)===this._nthWeekday}>${a}</option>`)}
          </select>
        </div>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${n("calendar_entity_label",e)}"
            helper="${n("calendar_entity_hint",e)}"
            .value=${this._calendarEntity}
            @input=${s=>this._calendarEntity=s.target.value.trim()}
          ></ms-textfield>
        `:l`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>n("calendar_entity_label",e)}
            .computeHelper=${()=>n("calendar_entity_hint",e)}
            @value-changed=${s=>{this._calendarEntity=(s.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?l`
        ${this._domLastDay?u:l`
          <ms-textfield
            label="${n("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${s=>this._domDay=s.target.value}
          ></ms-textfield>`}
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domLastDay}
            @change=${s=>this._domLastDay=s.target.checked} />
          <span>${n("recurrence_last_day",e)}</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domBusiness}
            @change=${s=>this._domBusiness=s.target.checked} />
          <span>${n("recurrence_business_day",e)}</span>
        </label>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`:u}_renderCalOffsetField(){let e=this._lang;return l`
      <ms-textfield
        label="${n("recurrence_offset",e)}"
        helper="${n("recurrence_offset_help",e)}"
        type="number"
        min=${-Pt}
        max=${Pt}
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return u;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?l`<div class="trigger-live-hint warn">${n("trigger_hint_overlap",this._lang)}</div>`:u,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let s=this.hass.states[t];if(!s)return e;let a=this._lang,o=s.attributes?.unit_of_measurement,c=typeof o=="string"&&o?` ${o}`:"",p=this._triggerAttribute?s.attributes?.[this._triggerAttribute]:s.state,_=typeof p=="number"?p:parseFloat(String(p)),m=p!=="unknown"&&p!=="unavailable"&&p!=null&&!isNaN(_),f=w=>I(w,a,{maximumFractionDigits:1}),b=[];if(this._triggerType==="threshold"){let w=parseFloat(this._triggerAbove),k=parseFloat(this._triggerBelow),O=parseFloat(this._triggerEquals),P=parseFloat(this._triggerNotEquals);if([w,k,O,P].every(q=>isNaN(q)))return u;m&&b.push(n("trigger_hint_now",a).replace("{value}",f(_)+c)),isNaN(w)||b.push(n("trigger_hint_above",a).replace("{target}",f(w)+c)),isNaN(k)||b.push(n("trigger_hint_below",a).replace("{target}",f(k)+c)),isNaN(O)||b.push(n("trigger_hint_equals",a).replace("{target}",f(O)+c)),isNaN(P)||b.push(n("trigger_hint_not_equals",a).replace("{target}",f(P)+c))}else if(this._triggerType==="counter"){let w=parseFloat(this._triggerTargetValue);if(isNaN(w))return u;this._triggerDeltaMode?this._taskId?b.push(n("trigger_hint_counter_delta_edit",a).replace("{target}",f(w)+c)):m?b.push(n("trigger_hint_counter_delta",a).replace("{value}",f(_)+c).replace("{due}",f(_+w)+c).replace("{target}",f(w)+c)):b.push(n("trigger_hint_counter_delta_edit",a).replace("{target}",f(w)+c)):(m&&b.push(n("trigger_hint_now",a).replace("{value}",f(_)+c)),b.push(n("trigger_hint_counter_abs",a).replace("{target}",f(w)+c)))}else if(this._triggerType==="runtime"){let w=parseFloat(this._triggerRuntimeHours);if(isNaN(w))return u;b.push(n("trigger_hint_runtime",a).replace("{hours}",f(w))),b.push(n("trigger_hint_state_now",a).replace("{value}",String(s.state)))}else if(this._triggerType==="state_change"){let w=parseInt(this._triggerTargetChanges,10)||1,k=this._triggerToState.trim();b.push((k?n("trigger_hint_state_change_to",a).replace("{state}",k):n("trigger_hint_state_change",a)).replace("{count}",String(w))),b.push(n("trigger_hint_state_now",a).replace("{value}",String(s.state)))}else if(this._triggerType==="due_date"){let w=parseInt(this._triggerDaysBefore,10)||0;b.push(w===0?n("trigger_hint_due_date_same_day",a):ai("trigger_hint_due_date","trigger_hint_due_date_one",w,a,"days"));let k=p==null?"":String(p);k&&!isNaN(Date.parse(k))&&b.push(n("trigger_hint_due_date_now",a).replace("{date}",L(k,a)))}return b.length?l`<div class="trigger-live-hint">${b.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?l`
        <ms-textfield
          label="${n("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${t=>this._triggerAbove=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${n("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${t=>this._triggerBelow=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${n("trigger_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerEquals}
          @input=${t=>this._triggerEquals=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${n("trigger_not_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerNotEquals}
          @input=${t=>this._triggerNotEquals=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${n("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?l`
        <ms-textfield
          label="${n("target_value",e)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${t=>this._triggerTargetValue=t.target.value}
        ></ms-textfield>
        <label>
          <input
            type="checkbox"
            .checked=${this._triggerDeltaMode}
            @change=${t=>this._triggerDeltaMode=t.target.checked}
          />
          ${n("delta_mode",e)}
        </label>
        ${this._triggerDeltaMode?l`
              <ms-textfield
                label="${n("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${t=>this._triggerBaselineValue=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?n("baseline_start_help_edit",e):n("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?l`<div class="baseline-effective">
                      ${n("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:u}
              </div>
            `:u}
      `:this._triggerType==="state_change"?l`
        ${this._renderStateField({label:n("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:t=>this._triggerFromState=t})}
        <div class="field-help">${n("state_value_help",e)}</div>
        ${this._renderStateField({label:n("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:t=>this._triggerToState=t})}
        <ms-textfield
          label="${n("target_changes",e)}"
          type="number"
          min=${yn[0]}
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${n("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?l`<div class="field-help">${n("state_latch_help",e)}</div>`:u}
        <ms-textfield
          label="${n("for_at_least_minutes",e)}"
          type="number"
          min=${fn[0]}
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
        <div class="field-help">${n("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?l`
        <ms-textfield
          label="${n("runtime_hours",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${t=>this._triggerRuntimeHours=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${n("runtime_max_session",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeMaxSession}
          @input=${t=>this._triggerRuntimeMaxSession=t.target.value}
        ></ms-textfield>
        <div class="field-help">${n("runtime_max_session_help",e)}</div>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:t=>this._triggerOnStates=t})}
        <div class="field-help">${n("runtime_on_states_help",e)}</div>
      `:this._triggerType==="due_date"?l`
        <ms-textfield
          label="${n("days_before",e)}"
          type="number"
          step="1"
          min=${Rt[0]}
          max=${Rt[1]}
          .value=${this._triggerDaysBefore}
          @input=${t=>this._triggerDaysBefore=t.target.value}
        ></ms-textfield>
        <div class="field-help">${n("days_before_help",e)}</div>
      `:u}_section(e,t,s){return l`<section class="form-section ${e}">
      <h3 class="section-title">${t}</h3>
      ${s}
    </section>`}_renderIdentity(e){return l`
          ${this._taskId===null&&this._objectChoices.length>0?l`
            <div class="select-row">
              <label>${n("object",e)}</label>
              <select aria-label=${n("object",e)}
                .value=${this._entryId}
                @change=${t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(t=>l`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
              </select>
            </div>
          `:u}
          <ms-textfield
            label="${n("task_name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${n("maintenance_type",e)}</label>
            <select aria-label=${n("maintenance_type",e)}
              .value=${this._type}
              @change=${t=>this._type=t.target.value}
            >
              ${_l.map(t=>l`<option value=${t} ?selected=${t===this._type}>${n(t,e)}</option>`)}
            </select>
          </div>
          <ms-textfield
            label="${n("notes_optional",e)}"
            multiline
            .rows=${3}
            .helper=${n("notes_markdown_hint",e)}
            .value=${this._notes}
            @input=${t=>this._notes=t.target.value}
          ></ms-textfield>
          ${this._renderDetails(e)}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${t=>this._enabled=t.target.checked}
            />
            ${n("task_enabled",e)}
          </label>
    `}_renderDetails(e){return l`
      <details class="details-section" ?open=${this._detailsOpen}>
        <summary>${n("task_section_details",e)}</summary>
        <div class="select-row">
          <label>${n("priority",e)}</label>
          <select aria-label=${n("priority",e)}
            .value=${this._priority}
            @change=${t=>this._priority=t.target.value}
          >
            ${yr.map(t=>l`<option value=${t} ?selected=${t===this._priority}>${n("priority_"+t,e)}</option>`)}
          </select>
        </div>
        <ms-textfield
          label="${n("labels",e)}"
          placeholder="${n("labels_placeholder",e)}"
          helper="${n("labels_help",e)}"
          .value=${this._labels}
          @input=${t=>this._labels=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${n("documentation_url_optional",e)}"
          .value=${this._documentationUrl}
          @input=${t=>this._documentationUrl=t.target.value}
        ></ms-textfield>
        <ha-icon-picker
          .hass=${this.hass}
          label="${n("custom_icon_optional",e)}"
          .value=${this._customIcon}
          @value-changed=${t=>this._customIcon=t.detail.value||""}
        ></ha-icon-picker>
      </details>
    `}_renderScheduleSection(e){return this._section("schedule-section",n("task_section_schedule",e),l`
          <div class="select-row">
            <label>${n("schedule_type",e)}</label>
            <select aria-label=${n("schedule_type",e)}
              .value=${this._scheduleType}
              @change=${t=>this._scheduleType=t.target.value}
            >
              ${ml.map(t=>l`<option value=${t} ?selected=${t===this._scheduleType}>${n(t,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?l`
                <ms-textfield
                  label="${n("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${t=>this._intervalDays=t.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${n("interval_anchor",e)}</label>
                  <select aria-label=${n("interval_anchor",e)}
                    .value=${this._intervalAnchor}
                    @change=${t=>this._intervalAnchor=t.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${n("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${n("anchor_planned",e)}</option>
                  </select>
                  <div class="field-help anchor-help">${n("interval_anchor_hint",e)}</div>
                </div>
              `:u}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?l`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${e}
                  label="${n("due_date",e)}"
                  .value=${this._dueDate}
                  @value-changed=${t=>this._dueDate=t.detail.value}
                ></ms-date-field>
              `:u}
          ${this.scheduleTimeEnabled&&zn.includes(this._scheduleType)?l`
            <label class="checkbox-row schedule-time-toggle">
              <input type="checkbox" .checked=${this._scheduleTimeOn}
                @change=${t=>this._scheduleTimeOn=t.target.checked} />
              <span>${n("schedule_time_toggle",e)}</span>
            </label>
            ${this._scheduleTimeOn?l`
              <ms-date-field
                kind="time"
                .hass=${this.hass}
                .lang=${e}
                .value=${this._scheduleTime}
                helper="${n("schedule_time_help",e)}"
                @value-changed=${t=>this._scheduleTime=t.detail.value}
              ></ms-date-field>
            `:u}
          `:u}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${n("last_performed_optional",e)}"
            .value=${this._lastPerformed}
            @value-changed=${t=>this._lastPerformed=t.detail.value}
          ></ms-date-field>
          <ms-textfield
            label="${n("warning_days",e)}"
            type="number"
            min=${hr[0]}
            max=${hr[1]}
            .value=${this._warningDays}
            @input=${t=>this._warningDays=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("earliest_completion_days",e)}"
            helper="${n("earliest_completion_days_help",e)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${t=>this._earliestCompletionDays=t.target.value}
          ></ms-textfield>
          ${this._renderAdaptiveSection(e)}
    `)}_renderTriggerSection(e){return this._scheduleType!=="sensor_based"?u:this._section("trigger-section",n("task_section_trigger",e),l`
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?l`
            ${this._entityPickerFallback?l`
              <ms-textfield
                label="${n("environmental_entity_optional",e)}"
                helper="${n("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${t=>this._environmentalEntity=t.target.value.trim()}
              ></ms-textfield>
            `:l`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:Hn}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>n("environmental_entity_optional",e)}
              .computeHelper=${()=>n("environmental_entity_helper",e)}
              @value-changed=${t=>{this._environmentalEntity=(t.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):u}
          `:u}
    `)}_renderCompletionSection(e){return this._section("completion-section",n("task_section_completion",e),l`
          ${this._type==="reading"?l`
                <ms-textfield
                  label="${n("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${n("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:u}
          ${this.checklistsEnabled?l`
            <label class="field-label" for="checklist-textarea">${n("checklist_steps_optional",e)}</label>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${n("checklist_placeholder",e)}"
              .value=${this._checklistText}
              @input=${t=>this._checklistText=t.target.value}
            ></textarea>
            <div class="field-help">${n("checklist_help",e)}</div>
          `:u}
          ${this._partsLoadFailed?l`<div class="field-help parts-load-failed">${n("parts_load_failed",e)}</div>`:u}
          ${this._isFleetTask?l`<div class="field-help parts-fleet-hint">${n("task_parts_fleet_hint",e)}</div>`:this.parts.length||this._foreignOwners.length?l`
                <div class="field">
                  <label>${n("consumes_parts_label",e)}</label>
                  ${this.parts.map(t=>this._renderConsumesRow(t))}
                  ${this._foreignOwners.length?l`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${n("shared_parts_other_objects",e)}</summary>
                          <div class="field-help">${n("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>l`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(s=>this._renderConsumesRow(s,t.entry_id))}
                            `)}
                        </details>
                      `:u}
                </div>
              `:u}
          <div class="field-label">${n("require_on_completion",e)}</div>
          <div class="required-completion">
            ${mr.map(t=>l`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(t)}
                  @change=${s=>this._toggleRequired(t,s.target.checked)}
                />
                <span>${n(Lt[t],e)}</span>
              </label>
            `)}
          </div>
          ${this._availableTags.length>0?l`
              <div class="select-row">
                <label>${n("nfc_tag_id_optional",e)}</label>
                <select aria-label=${n("nfc_tag_id_optional",e)}
                  .value=${this._nfcTagId}
                  @change=${t=>this._nfcTagId=t.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${n("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(t=>l`<option value=${t.id} ?selected=${t.id===this._nfcTagId}>${t.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${n("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:l`
              <ms-textfield
                label="${n("nfc_tag_id_optional",e)}"
                .value=${this._nfcTagId}
                @input=${t=>this._nfcTagId=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${n("nfc_tags_empty_help",e)}
                <a href="/config/tags">${n("nfc_tags_open_settings",e)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${n("nfc_tags_refresh",e)}
                </button>
              </div>
            `}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${this._requireTagScan}
              @change=${t=>this._requireTagScan=t.target.checked}
            />
            <span>${n("require_tag_scan",e)}</span>
          </label>
          ${this._requireTagScan?l`<div class="field-help">${n("require_tag_scan_help",e)}</div>`:u}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${t=>this._allowSkip=!t.target.checked}
            />
            <span>${n("disallow_skip",e)}</span>
          </label>
          ${this._allowSkip?u:l`<div class="field-help">${n("disallow_skip_help",e)}</div>`}
          ${this._renderPhasesEditor(e)}
          ${this._renderCompletionActionsSection(e)}
    `)}_renderPeopleSection(e){return this._section("people-section",n("task_section_people",e),l`
          <div class="select-row">
            <label>${n("responsible_user",e)}</label>
            <select aria-label=${n("responsible_user",e)}
              .value=${this._responsibleUserId||""}
              @change=${t=>{let s=t.target.value;this._responsibleUserId=s||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${n("no_user_assigned",e)}</option>
              ${this._availableUsers.map(t=>l`<option value=${t.id} ?selected=${t.id===this._responsibleUserId}>${t.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?l`
            <div class="field">
              <label>${n("shared_with",e)}</label>
              <div class="field-help">${n("shared_with_help",e)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map(t=>l`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(t.id)}
                      @change=${()=>this._toggleAssignee(t.id)} />
                    <span>${t.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?l`
              <div class="select-row">
                <label>${n("rotation_strategy",e)}</label>
                <select aria-label=${n("rotation_strategy",e)}
                  .value=${this._rotationStrategy}
                  @change=${t=>this._rotationStrategy=t.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${n("rotation_none",e)}</option>
                  ${Mn.map(t=>l`<option value=${t} ?selected=${t===this._rotationStrategy}>${n("rotation_"+t,e)}</option>`)}
                </select>
              </div>`:u}
          `:u}
    `)}_renderNotificationsSection(e){return this._section("notifications-section",n("task_section_notifications",e),l`
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._notifyEnabled}
              @change=${t=>this._notifyEnabled=!t.target.checked}
            />
            <span>${n("no_notifications",e)}</span>
          </label>
          ${this._notifyEnabled?u:l`<div class="field-help">${n("no_notifications_help",e)}</div>`}
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${n("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${t=>this._notifyIcon=t.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||fr(this._type)}></ha-icon>
            ${n("notify_icon_hint",e).replace("{default}",fr(this._type))}
          </div>
          <div class="field mirror-todo-field">
            ${this._entityPickerFallback?l`
              <ms-textfield
                label="${n("task_mirror_todo",e)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${t=>{this._mirrorTodoEntities=t.target.value.split(",").map(s=>s.trim()).filter(Boolean)}}
              ></ms-textfield>
            `:l`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"]}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>n("task_mirror_todo",e)}
                @value-changed=${t=>{let s=(t.detail.value.mirror_todo_entities||[]).filter(Boolean);this._mirrorTodoEntities=s}}
              ></ha-form>`}
            <div class="field-help">${n("task_mirror_todo_hint",e)}</div>
          </div>
    `)}render(){if(!this._open)return l``;let e=this._lang,t=this._taskId?n("edit_task",e):n("new_task",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:u}
          ${this._warning?l`<div class="error warning">${this._warning}</div>`:u}
          ${this._renderIdentity(e)}
          ${this._renderScheduleSection(e)}
          ${this._renderTriggerSection(e)}
          ${this._renderCompletionSection(e)}
          ${this._renderPeopleSection(e)}
          ${this._renderNotificationsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${n("cancel",e)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}
          >
            ${this._loading?n("saving",e):n("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};g._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calMonths","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),g.styles=[ke,nn,$`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* #129: entity/state pickers in the trigger form (ha-form + selector) */
    .entity-picker-form,
    .state-picker-form {
      display: block;
      margin: 8px 0;
    }
    /* v1.3.0: completion-action sections (.adaptive-section shares the shell
       but keeps its own class — tests count .ca-section elements) */
    .ca-section,
    .adaptive-section,
    .phases-section,
    .details-section {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 8px;
    }
    .ca-section > summary,
    .adaptive-section > summary,
    .phases-section > summary,
    .details-section > summary {
      cursor: pointer;
      font-weight: 500;
    }
    .phases-section,
    .details-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .adaptive-section ms-textfield {
      width: 100%;
      margin-top: 8px;
      display: block;
    }
    .adaptive-section label {
      display: block;
      margin-top: 8px;
    }
    .ca-section ms-textfield,
    .ca-section ha-entity-picker,
    .ca-section ha-service-picker,
    .ca-section ha-form,
    .ca-section .qc-feedback {
      width: 100%;
      margin-top: 8px;
      display: block;
    }
    .ca-section .qc-feedback {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .ca-test-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }
    .ca-test-ok { color: var(--success-color, #4caf50); font-size: 13px; }
    .ca-test-error { color: var(--error-color, #f44336); font-size: 13px; font-weight: 500; }
    .ca-test-error-block { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
    .ca-test-error-detail {
      font-size: 12px;
      color: var(--secondary-text-color);
      background: rgba(244, 67, 54, 0.08);
      padding: 6px 8px; border-radius: 4px;
      line-height: 1.4;
      word-break: break-word;
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
    ms-textfield {
      display: block;
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
    .consumes-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 2px 0;
    }
    .phase-def {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px;
      margin: 6px 0;
    }
    .phase-def-head {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .phase-def-head ms-textfield {
      flex: 1;
      min-width: 0;
    }
    .phase-part {
      max-width: 160px;
      padding: 6px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .phase-qty {
      width: 64px;
      padding: 6px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    /* On a phone the name gets its own line: beside a part and its
     * quantity it was squeezed to nothing (audit 2026-10-17). */
    @media (max-width: 600px) {
      .phase-def-head {
        flex-wrap: wrap;
      }
      .phase-def-head ms-textfield {
        flex-basis: 100%;
      }
      .phase-part {
        flex: 1 1 0;
        min-width: 0;
        max-width: none;
      }
    }
    .phase-checklist {
      min-height: 56px;
      margin-top: 6px;
    }
    .phase-req-toggle {
      margin-top: 6px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .phase-req-fields {
      margin: 2px 0 0 22px;
      font-size: 13px;
    }
    .phase-remove {
      display: inline-flex;
      --ha-icon-button-size: 36px;
      --mdc-icon-button-size: 36px;
      color: var(--secondary-text-color);
    }
    /* #161 phase 2: reading slots — name wide, unit narrow, trash. */
    .readings-editor { margin-top: 14px; }
    .reading-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 4px 0;
    }
    .reading-row .reading-name { flex: 2; min-width: 0; }
    .reading-row .reading-unit { flex: 1; min-width: 0; max-width: 140px; }
    .reading-dup { color: var(--warning-color, #ff9800); margin-top: 6px; }
    .phase-seq-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 8px;
    }
    .phase-seq {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 4px 0;
    }
    .phase-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 12px;
      background: var(--secondary-background-color);
      font-size: 13px;
    }
    .phase-chip-x {
      border: none;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 0 2px;
      font-size: 12px;
    }
    .phase-seq-add {
      padding: 4px 8px;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .consumes-check {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
    }
    .consumes-qty {
      width: 64px;
      padding: 4px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    /* #111: other objects' pools sit behind a disclosure so the object's OWN
       parts stay the primary list; each group is headed by the owning object's
       name, so which pool a checkbox means is never a guess. */
    .shared-pools {
      margin-top: 6px;
    }
    .shared-pools > summary {
      cursor: pointer;
      padding: 2px 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .shared-pool-owner {
      margin-top: 6px;
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .qc-cost { display: flex; flex-direction: column; gap: 4px; margin: 8px 0; }
    .qc-cost-label { font-size: 12px; color: var(--secondary-text-color); }
    .baseline-effective {
      margin-top: 2px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    /* Live computed trigger hint — reads the bound sensor and explains what
       happens next. Info-accented so it reads as guidance, not an error. */
    .trigger-live-hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      border-left: 3px solid var(--info-color, #2196f3);
      background: rgba(33, 150, 243, 0.08);
      border-radius: 0 6px 6px 0;
      padding: 6px 10px;
      margin: 4px 0;
    }
    .trigger-live-hint.warn {
      color: var(--primary-text-color);
      border-left-color: var(--warning-color, #ff9800);
      background: rgba(255, 152, 0, 0.1);
    }
    .field-help a,
    .link-button {
      background: none;
      border: 0;
      padding: 0;
      color: var(--primary-color);
      cursor: pointer;
      font: inherit;
      text-decoration: underline;
    }
    .field-help a:hover,
    .link-button:hover {
      text-decoration: none;
    }
    /* Smaller refresh icon-button when shown next to the dropdown. */
    .select-row .link-button {
      margin-left: 8px;
      text-decoration: none;
      font-size: 16px;
    }
    .select-row .link-button:hover {
      color: var(--primary-color);
      opacity: 0.7;
    }
    .assignee-pool {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      margin-top: 4px;
    }
    .schedule-time-toggle {
      display: flex;
      margin: 8px 0 4px;
    }
    .weekday-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .weekday-chip {
      padding: 6px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 16px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
    }
    .weekday-chip.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .season-chip {
      padding: 6px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 16px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
    }
    .season-chip.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .error.warning { color: var(--warning-color, #ff9800); }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .required-completion {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 16px;
    }
  `],d([y({attribute:!1})],g.prototype,"hass",2),d([y({type:Boolean,attribute:"checklists-enabled"})],g.prototype,"checklistsEnabled",2),d([y({type:Boolean,attribute:"schedule-time-enabled"})],g.prototype,"scheduleTimeEnabled",2),d([y({type:Boolean,attribute:"completion-actions-enabled"})],g.prototype,"completionActionsEnabled",2),d([y({type:Boolean,attribute:"adaptive-feature"})],g.prototype,"adaptiveFeature",2),d([y({type:Boolean,attribute:"seasonal-feature"})],g.prototype,"seasonalFeature",2),d([y({type:Boolean,attribute:"environmental-feature"})],g.prototype,"environmentalFeature",2),d([y({type:Number,attribute:"default-warning-days"})],g.prototype,"defaultWarningDays",2),d([h()],g.prototype,"parts",2),d([h()],g.prototype,"_foreignOwners",2),d([h()],g.prototype,"_open",2),d([h()],g.prototype,"_entityPickerFallback",2),d([h()],g.prototype,"_loading",2),d([h()],g.prototype,"_error",2),d([h()],g.prototype,"_warning",2),d([h()],g.prototype,"_entryId",2),d([h()],g.prototype,"_taskId",2),d([h()],g.prototype,"_isFleetTask",2),d([h()],g.prototype,"_objectChoices",2),d([h()],g.prototype,"_name",2),d([h()],g.prototype,"_type",2),d([h()],g.prototype,"_scheduleType",2),d([h()],g.prototype,"_intervalDays",2),d([h()],g.prototype,"_intervalUnit",2),d([h()],g.prototype,"_dueDate",2),d([h()],g.prototype,"_warningDays",2),d([h()],g.prototype,"_earliestCompletionDays",2),d([h()],g.prototype,"_intervalAnchor",2),d([h()],g.prototype,"_weekdays",2),d([h()],g.prototype,"_nth",2),d([h()],g.prototype,"_nthWeekday",2),d([h()],g.prototype,"_domDay",2),d([h()],g.prototype,"_domLastDay",2),d([h()],g.prototype,"_domBusiness",2),d([h()],g.prototype,"_calOffset",2),d([h()],g.prototype,"_calMonths",2),d([h()],g.prototype,"_calendarEntity",2),d([h()],g.prototype,"_seasonMonths",2),d([h()],g.prototype,"_endsMode",2),d([h()],g.prototype,"_endsCount",2),d([h()],g.prototype,"_endsUntil",2),d([h()],g.prototype,"_schedulePreview",2),d([h()],g.prototype,"_schedulePreviewEnded",2),d([h()],g.prototype,"_notes",2),d([h()],g.prototype,"_documentationUrl",2),d([h()],g.prototype,"_customIcon",2),d([h()],g.prototype,"_notifyIcon",2),d([h()],g.prototype,"_priority",2),d([h()],g.prototype,"_labels",2),d([h()],g.prototype,"_detailsOpen",2),d([h()],g.prototype,"_mirrorTodoEntities",2),d([h()],g.prototype,"_enabled",2),d([h()],g.prototype,"_triggerEntityId",2),d([h()],g.prototype,"_triggerEntityIds",2),d([h()],g.prototype,"_triggerEntityLogic",2),d([h()],g.prototype,"_triggerAttribute",2),d([h()],g.prototype,"_triggerType",2),d([h()],g.prototype,"_triggerAbove",2),d([h()],g.prototype,"_triggerBelow",2),d([h()],g.prototype,"_triggerEquals",2),d([h()],g.prototype,"_triggerNotEquals",2),d([h()],g.prototype,"_triggerForMinutes",2),d([h()],g.prototype,"_triggerCombinator",2),d([h()],g.prototype,"_triggerTargetValue",2),d([h()],g.prototype,"_triggerDeltaMode",2),d([h()],g.prototype,"_triggerBaselineValue",2),d([h()],g.prototype,"_liveBaselineValue",2),d([h()],g.prototype,"_autoCompleteOnRecovery",2),d([h()],g.prototype,"_triggerFromState",2),d([h()],g.prototype,"_triggerToState",2),d([h()],g.prototype,"_triggerTargetChanges",2),d([h()],g.prototype,"_triggerRuntimeHours",2),d([h()],g.prototype,"_triggerDaysBefore",2),d([h()],g.prototype,"_triggerRuntimeMaxSession",2),d([h()],g.prototype,"_triggerOnStates",2),d([h()],g.prototype,"_compoundLogic",2),d([h()],g.prototype,"_compoundConditions",2),d([h()],g.prototype,"_suggestedAttributes",2),d([h()],g.prototype,"_availableAttributes",2),d([h()],g.prototype,"_entityDomain",2),d([h()],g.prototype,"_lastPerformed",2),d([h()],g.prototype,"_nfcTagId",2),d([h()],g.prototype,"_requireTagScan",2),d([h()],g.prototype,"_allowSkip",2),d([h()],g.prototype,"_notifyEnabled",2),d([h()],g.prototype,"_readingUnit",2),d([h()],g.prototype,"_readings",2),d([h()],g.prototype,"_consumesParts",2),d([h()],g.prototype,"_consumesQtyText",2),d([h()],g.prototype,"_partsLoadFailed",2),d([h()],g.prototype,"_availableTags",2),d([h()],g.prototype,"_responsibleUserId",2),d([h()],g.prototype,"_assigneePool",2),d([h()],g.prototype,"_rotationStrategy",2),d([h()],g.prototype,"_availableUsers",2),d([h()],g.prototype,"_checklistText",2),d([h()],g.prototype,"_phaseDefs",2),d([h()],g.prototype,"_phaseSeq",2),d([h()],g.prototype,"_requiredCompletion",2),d([h()],g.prototype,"_scheduleTime",2),d([h()],g.prototype,"_scheduleTimeOn",2),d([h()],g.prototype,"_actionService",2),d([h()],g.prototype,"_actionTargetEntity",2),d([h()],g.prototype,"_actionSkipAuto",2),d([h()],g.prototype,"_actionPresent",2),d([h()],g.prototype,"_actionData",2),d([h()],g.prototype,"_actionDataJsonFallback",2),d([h()],g.prototype,"_actionTesting",2),d([h()],g.prototype,"_actionTestResult",2),d([h()],g.prototype,"_actionTestError",2),d([h()],g.prototype,"_qcNotes",2),d([h()],g.prototype,"_qcCost",2),d([h()],g.prototype,"_qcDuration",2),d([h()],g.prototype,"_qcFeedback",2),d([h()],g.prototype,"_environmentalEntity",2),d([h()],g.prototype,"_environmentalAttribute",2),d([h()],g.prototype,"_adaptiveEnabled",2),d([h()],g.prototype,"_adaptiveAlpha",2),d([h()],g.prototype,"_adaptiveMin",2),d([h()],g.prototype,"_adaptiveMax",2),d([h()],g.prototype,"_adaptiveSeasonal",2),d([h()],g.prototype,"_adaptivePrediction",2),d([h()],g.prototype,"_conditionAttrOptions",2);vr=g;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",vr)});async function xl(r,i,e){let t=r.auth;if(t?.expired&&t.refreshAccessToken)try{await t.refreshAccessToken()}catch{}return fetch(i,{...e,headers:{...e.headers??{},Authorization:`Bearer ${t?.data?.access_token??""}`}})}async function kl(r,i,e,t="doc_too_large",s=[]){let a=await xl(r,i,{method:"POST",body:e});if(a.status===413)throw new Error(t);if(!a.ok){let o=await a.json().catch(()=>null);throw typeof o?.code=="string"&&s.includes(o.code)?new Error(o.code):new Error("doc_upload_failed")}return await a.json()}async function $l(r,i,e,t,s){if(e.size>wl)throw new Error("doc_too_large");let a=new FormData;a.append("entry_id",i);for(let c of t)a.append("tags",c);s&&a.append("purpose",s),a.append("file",e,e.name);let o=await kl(r,"/api/maintenance_supporter/document/upload",a);if(!o.id)throw new Error("doc_upload_failed");return{id:o.id,deduped:!!o.deduped,duplicate_in_object:o.duplicate_in_object??null}}async function Qn(r,i,e){return(await $l(r,i,e,["photo"],"completion")).id}async function br(r,i,e){await Promise.all(e.map(t=>r.connection.sendMessagePromise({type:"maintenance_supporter/documents/discard_upload",entry_id:i,doc_id:t}).catch(()=>{})))}var wl,yu,Zn=v(()=>{"use strict";Ct();wl=100*1024*1024,yu=500*1024*1024});var ot,xr=v(()=>{"use strict";T();Zn();ot=class{constructor(i,e){this.host=i;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,i.addController(this)}hostConnected(){}get ids(){return this.photos.map(i=>i.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(i){return this.errorKey?n(this.errorKey,i).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(i=[]){this._endSession(),this._revokeAll(),this.photos=i.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(i){if(i.length===0)return;let e=this._session,t=this.opts.hass(),s=this.opts.entryId(),a=i.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let o of a){let c=await Qn(t,s,o);if(e!==this._session){br(t,s,[c]);return}this.uploadedIds=[...this.uploadedIds,c],this._uploadEntry.set(c,s),this.photos=[...this.photos,{id:c,preview:URL.createObjectURL(o)}],this.host.requestUpdate()}i.length>a.length&&(this.errorKey="photos_limit")}catch(o){if(e!==this._session)return;this.errorKey=o instanceof Error&&o.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(i){let e=this.photos.find(t=>t.id===i);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(t=>t.id!==i),this.uploadedIds.includes(i)&&(this.uploadedIds=this.uploadedIds.filter(t=>t!==i),this._discard([i])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let i=this.uploadedIds;this.uploadedIds=[],this._discard(i)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(i){let e=new Map;for(let s of i){let a=this._uploadEntry.get(s)??this.opts.entryId();this._uploadEntry.delete(s),e.set(a,[...e.get(a)??[],s])}let t=this.opts.hass();for(let[s,a]of e)br(t,s,a)}_revokeAll(){for(let i of this.photos)i.preview&&URL.revokeObjectURL(i.preview)}}});function wi(){if(window.externalApp!==void 0)return!0;let i=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(i)&&/Android/.test(i)}var wr=v(()=>{"use strict"});function Jn(r){try{return localStorage.getItem(r)}catch{return null}}function Xn(r,i){try{localStorage.setItem(r,i)}catch{}}var kr,ea=v(()=>{"use strict";kr={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraLabel:"msp-camera-label",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort",areaSort:"msp-area-sort"}});function aa(){if(!wi())return!1;let r=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!r&&typeof r.getUserMedia=="function"}function ra(r){let i=/camera2?\s*(\d+)/i.exec(r);return i?Number(i[1]):Number.MAX_SAFE_INTEGER}function sa(r,i){if(i){let t=r.find(s=>s.label===i);if(t)return t}return r.filter(t=>t.label&&oa.test(t.label)).sort((t,s)=>ra(t.label)-ra(s.label))[0]??null}var El,Sl,Tl,Al,ta,oa,ia,na,Cl,X,$r=v(()=>{"use strict";C();F();T();wr();ea();El=1920,Sl=.88,Tl={retryMs:500,windowMs:5e3},Al=new Set(["NotReadableError","AbortError","TrackStartError"]),ta=80,oa=/back|rear|environment|rück|hinten/i,ia=/front|user|selfie|vorne/i;na=r=>r?.name||"Error",Cl=r=>r?.message||"",X=class extends S{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...Tl};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let s=Jn(kr.cameraLabel),a=await this._enumerate(t);if(!this._live(e))return;let o=sa(a,s),c="refused";if(o&&(c=await this._openPatiently(t,e,this._byDevice(o))),c==="cancelled")return;if(c!=="ok"){if(c=await this._openPatiently(t,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),c==="cancelled")return;if(c!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(a=await this._enumerate(t),!this._live(e)){this._stopStream();return}}if(this._devices=a,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let p=o?null:sa(a,s),_=this._deviceIndex>=0?a[this._deviceIndex]:void 0;if(!p||p.deviceId===_?.deviceId)return;let m=await this._replace(t,e,[this._byDevice(p)],this._restoreCandidates(_));if(m!=="cancelled"){if(m==="lost"){this._unavailable("camera_lost");return}this._settle(m)}}async _openPatiently(e,t,s){let a=Date.now();for(;;){let o;try{o=await e.getUserMedia({video:s.video,audio:!1})}catch(c){let p=na(c),_=Cl(c);if(this._lastError=p,this._note(`${s.what} \u2192 ${p}${_&&_!==p?`: ${_}`:""}`),!this._live(t))return"cancelled";if(!Al.has(p))return"refused";if(Date.now()-a+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(m=>setTimeout(m,this.timing.retryMs)),!this._live(t))return"cancelled";continue}if(!this._live(t)){for(let c of o.getTracks())c.stop();return"cancelled"}return this._stream=o,this._note(`${s.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,t,s,a){this._switching=!0,this._stopStream();try{for(let o of s){let c=await this._openPatiently(e,t,o);if(c==="ok")return o;if(c==="cancelled")return c;if(c==="busy"){o.deviceId&&this._refused.add(o.deviceId);break}}for(let o of a){let c=await this._openPatiently(e,t,o);if(c==="ok")return"restored";if(c==="cancelled")return c}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let s=this._indexOfCurrent();return s>=0&&(this._deviceIndex=s),this._attach(),!1}this._switchFailed=!1;let t=e.deviceId?this._devices.findIndex(s=>s.deviceId===e.deviceId):-1;return this._deviceIndex=t>=0?t:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,t){let s=[],a=e?.deviceId||t;return a&&s.push({video:{deviceId:{exact:a}},what:`${e?.label||"previous camera"} (back again)`,deviceId:a}),s.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),s}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let t=(await e.enumerateDevices()).filter(s=>s.kind==="videoinput"&&!!s.deviceId);return this._note(`cameras: ${t.map(s=>s.label||"(no label)").join(" | ")||"none listed"}`),t}catch(t){return this._note(`enumerateDevices \u2192 ${na(t)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let t=e.getSettings().deviceId,s=t?this._devices.findIndex(a=>a.deviceId===t):-1;return s>=0?s:e.label?this._devices.findIndex(a=>a.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],t=e?.getSettings().facingMode;if(t==="user"||t==="environment")return t;let s=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return ia.test(s)?"user":oa.test(s)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let t=e.getSettings(),s=t.width&&t.height?`${t.width}\xD7${t.height}`:"size ?";return[e.label||"no label",s,t.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>ta&&this._log.splice(1,this._log.length-ta)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let t=this._gen,s=this._deviceIndex,a=s>=0?this._devices[s]:void 0,o=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||a?.deviceId,c=this._facing==="user"?"environment":"user",p=this._nextCameras(s,o);!p.length&&this._refused.size&&(this._refused.clear(),p=this._nextCameras(s,o)),this._note(`switch from ${a?.label||"unknown camera"}`);let _=[...p.map(m=>this._byDevice(this._devices[m])),{video:{facingMode:{exact:c}},what:`facing ${c} (exact)`},{video:{facingMode:{ideal:c}},what:`facing ${c}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let m=await this._replace(e,t,_,this._restoreCandidates(a,o));if(m==="cancelled")return;if(m==="lost"){this._unavailable("camera_lost");return}if(m!=="restored"&&!m.deviceId){if(this._isCamera(o,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=c}if(this._settle(m)&&m!=="restored"&&m.deviceId){let f=this._devices[this._deviceIndex]?.label??"";f&&Xn(kr.cameraLabel,ia.test(f)?"":f)}}finally{this._busy=!1}}_nextCameras(e,t){let s=this._devices.length,a=[];for(let o=1;o<=(e<0?s:s-1);o++){let c=(e+o)%s,p=this._devices[c].deviceId;p===t||this._refused.has(p)||a.push(c)}return a}_isCamera(e,t){let s=this._stream?.getVideoTracks()[0]?.getSettings();return e&&s?.deviceId?s.deviceId===e:!!s?.facingMode&&s.facingMode===t}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let t of this._stream?.getTracks()??[])t.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),t=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),t=!0)}catch{}if(!t){let s=this.shadowRoot?.querySelector(".details textarea");if(s){s.focus(),s.select();try{t=document.execCommand("copy")}catch{t=!1}}}this._copied=t}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let t=e.videoWidth||640,s=e.videoHeight||480,a=Math.min(1,El/Math.max(t,s)),o=document.createElement("canvas");o.width=Math.round(t*a),o.height=Math.round(s*a);let c=o.getContext("2d");if(!c)throw new Error("no_canvas");c.drawImage(e,0,0,o.width,o.height);let p=await new Promise(f=>o.toBlob(f,"image/jpeg",Sl));if(!p)throw new Error("no_blob");let _=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),m=new File([p],`photo-${_}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:m},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return u;let e=this.lang,t=this._busy||this._switching;return l`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${n("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switching?l`<div class="switching" role="status">${n("camera_switching",e)}</div>`:u}
        ${this._switchFailed?l`<div class="switch-note" role="status">
              <div>${n("camera_not_answered",e)}</div>
              <details class="details">
                <summary>${n("camera_diagnostics",e)}</summary>
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${n(this._copied?"camera_copied":"camera_copy",e)}</button>
              </details>
            </div>`:u}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${n("cancel",e)}</button>
          ${this._devices.length>1?l`<button type="button" class="switch" ?disabled=${t} title=${n("camera_switch_lens",e)} aria-label=${n("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:u}
          <button type="button" class="shoot" ?disabled=${t} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${n("camera_capture_shoot",e)}</span>
          </button>
        </div>
      </div>
    `}};X.styles=$`
    :host { display: contents; }
    .overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: #000; color: #fff;
      display: flex; flex-direction: column;
    }
    video { flex: 1; min-height: 0; width: 100%; object-fit: contain; background: #000; }
    .bar {
      display: flex; justify-content: space-between; align-items: center; gap: 16px;
      padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
      background: rgba(0, 0, 0, 0.8);
    }
    button {
      font: inherit; border-radius: 24px; padding: 10px 18px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .cancel { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); }
    .switch { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); padding: 10px 12px; }
    .switch[disabled] { opacity: 0.5; cursor: default; }
    .switch ha-icon { --mdc-icon-size: 22px; }
    .switch-pos { font-size: 12px; opacity: 0.85; }
    .switching {
      position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%);
      padding: 8px 16px; border-radius: 16px; background: rgba(0, 0, 0, 0.6); font-size: 14px;
    }
    .switch-note {
      position: absolute; left: 12px; right: 12px; bottom: 84px; max-height: 60%; overflow: auto;
      text-align: center; color: #fff; font-size: 13px; text-shadow: 0 1px 2px #000;
    }
    .details { margin-top: 6px; text-align: start; text-shadow: none; }
    .details summary { cursor: pointer; text-align: center; opacity: 0.85; }
    .details textarea {
      display: block; box-sizing: border-box; width: 100%; margin: 6px 0;
      font: 11px/1.35 monospace; color: #fff; background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 6px; padding: 6px; resize: vertical;
    }
    .copy { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); padding: 6px 14px; font-size: 13px; }
    .shoot { background: var(--primary-color, #03a9f4); color: #fff; border: none; font-weight: 600; }
    .shoot[disabled] { opacity: 0.6; cursor: default; }
    .shoot ha-icon { --mdc-icon-size: 22px; }
  `,d([y({type:String})],X.prototype,"lang",2),d([h()],X.prototype,"_open",2),d([h()],X.prototype,"_busy",2),d([h()],X.prototype,"_switching",2),d([h()],X.prototype,"_devices",2),d([h()],X.prototype,"_deviceIndex",2),d([h()],X.prototype,"_switchFailed",2),d([h()],X.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",X)});var ki,ee,jt=v(()=>{"use strict";C();F();T();wr();$r();$r();ki=$`
  ms-photo-picker { display: contents; }
  .photo-pickers {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .photo-pick {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px dashed var(--divider-color);
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    color: var(--secondary-text-color);
    width: fit-content;
  }
  .photo-pick:hover { border-color: var(--primary-color); }
  .photo-pick:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .photo-pick.disabled { opacity: 0.6; cursor: default; }
  .photo-pick input[type="file"] { display: none; }
  .photo-android-hint {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 4px;
  }
`,ee=class extends S{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=wi();this._inAppCamera=aa()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target,s=Array.from(t.files??[]);t.value="",this._emit(s)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return u;let e=this.lang,t=this._locked?"disabled":"",s=this.busy?n("uploading",e):n("doc_camera",e),a=n(this._singlePick?"choose_photo":"choose_photos",e);return l`
      <div class="photo-pickers">
        ${this.showCamera?l`<label class="photo-pick photo-pick-camera ${t}" role="button" tabindex="0"
              aria-label=${s} title=${this.compact?s:u}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?u:l`<span>${s}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:u}
        ${this.showGallery?l`<label class="photo-pick photo-pick-gallery ${t}" role="button" tabindex="0"
              aria-label=${a} title=${this.compact?a:u}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?u:l`<span>${a}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:u}
      </div>
      ${this.showGallery&&this._singlePick?l`<div class="photo-android-hint">${n("photos_android_hint",e)}</div>`:u}
      ${this.showCamera&&this._inAppCamera?l`<ms-camera-capture .lang=${e}
            @photo-captured=${o=>this._emit([o.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:u}
    `}};d([y({type:String})],ee.prototype,"lang",2),d([y({type:Boolean})],ee.prototype,"disabled",2),d([y({type:Boolean})],ee.prototype,"busy",2),d([y({type:String})],ee.prototype,"accept",2),d([y({type:Boolean})],ee.prototype,"showCamera",2),d([y({type:Boolean})],ee.prototype,"showGallery",2),d([y({type:Boolean})],ee.prototype,"compact",2),d([y({type:Number})],ee.prototype,"remaining",2),d([h()],ee.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",ee)});var lt,E,la=v(()=>{"use strict";C();F();Ue();T();Te();G();Ht();fi();Ze();gr();xr();yi();nt();bi();jt();jt();lt=Se,E=class extends S{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new ot(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((t,s)=>[String(s),!!this.checklistPrefill[t]]).filter(([,t])=>t)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(t=>[ae(t),{...t}])),this._usedQtyText={})}_rangeError(e,t){let s=this.lang;return n("settings_value_out_of_range",s).replace("{min}",I(e,s,{maximumFractionDigits:2})).replace("{max}",I(t,s,{maximumFractionDigits:2}))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId},t=this._notes.trim();if(t&&(e.notes=t),this._cost){let c=parseFloat(this._cost);isNaN(c)||(e.cost=c)}let s=at(this._duration);if(s!==null&&(e.duration=s),this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(V(this._completedAt)>Date.now()){this._error=n("completed_at_future_error",this.lang);return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let c={};for(let p of this.readings){let _=(this._readingValues[p.id]??"").trim();if(_==="")continue;let m=parseFloat(_.replace(",","."));isNaN(m)||(c[p.id]=m)}Object.keys(c).length>0&&(e.reading_values=c)}else if(this._readingValue!==""){let c=parseFloat(this._readingValue);isNaN(c)||(e.reading_value=c)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let c=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(c)||c<rt[0]||c>rt[1]){this._error=this._rangeError(...rt);return}e.restock_quantity=c}if(this.parts.length>0){let c=[];for(let[p,_]of Object.entries(this._usedParts)){let m=this._usedQtyText[p],f=m===void 0?_.quantity:parseFloat(m.replace(",","."));if(!Number.isFinite(f)||f<lt[0]||f>lt[1]){this._error=this._rangeError(...lt);return}c.push({..._,quantity:f})}e.used_parts=c.map(p=>p.entry_id?{part_id:p.part_id,quantity:p.quantity,entry_id:p.entry_id}:{part_id:p.part_id,quantity:p.quantity})}let a=await j(this,e,{busy:c=>{this._loading=c},lang:this.lang,fallbackKey:"save_error",onError:c=>{this._error=c}});if(a===void 0)return;this._photos.markAttached(),this._open=!1;let o={entryId:this.entryId,taskId:this.taskId,taskName:this.taskName,undo:a?.undo===!0};this.dispatchEvent(new CustomEvent("task-completed",{detail:o}))}_renderReadingField(e,t){let s=this._completedAt?V(this._completedAt):NaN,a=pn(this.readingHistory,e.id,isNaN(s)?void 0:s),o=e.unit||this.readingUnit,c=(this._readingValues[e.id]??"").trim(),p=c===""?NaN:parseFloat(c.replace(",",".")),_=a!==void 0&&!isNaN(p)&&p<a.value,m=a!==void 0?I(a.value,t,{maximumFractionDigits:3}):"";return l`
      <label class="field reading-field">
        <span class="field-label">${e.name}${o?` (${o})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${a!==void 0?n("reading_last",t).replace("{value}",m):""}
          .value=${this._readingValues[e.id]??""}
          @input=${f=>{this._readingValues={...this._readingValues,[e.id]:f.target.value}}} />
        ${_?l`<span class="reading-warn">${n("reading_below_last",t).replace("{value}",m)}</span>`:u}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_demands(e){return this.requiredFields.includes(e)}_req(e){return this._demands(e)?l`<span class="req-mark" aria-hidden="true">*</span>`:u}_purchaseSuggestion(){if(this.restockDefault===null)return null;let e=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(e)||e<=0?null:Math.round(this.restockUnitCost*e*100)/100}_partsValues(){let e={booked:null,info:null};if(this.restockDefault!==null||!this.parts.length)return e;for(let t of Object.values(this._usedParts)){let s=this.parts.find(c=>ae({part_id:c.id,entry_id:c.entry_id})===ae(t)),a=ws(s);if(a===null)continue;let o=Xt(s,this.partsCostMode)==="use"?"booked":"info";e[o]=(e[o]??0)+a*(t.quantity||1)}for(let t of["booked","info"])e[t]!==null&&(e[t]=Math.round(e[t]*100)/100);return e}_renderCostSuggestion(e){let t=this._purchaseSuggestion();if(this.restockDefault!==null){let c=this.partsCostMode==="use"?l`<div class="cost-note">${n("cost_purchase_use_hint",e)}</div>`:u;if(this._cost.trim()!==""||t==null||t<=0)return c;let p=Q(t,this.currencySymbol,e);return l`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(Math.round(t*100)/100)}
        >${n("cost_from_parts",e).replace("{amount}",p)}</button>${c}`}let{booked:s,info:a}=this._partsValues(),o=(c,p)=>c!=null&&c>0?l`<div class="cost-note">${n(p,e).replace("{amount}",Q(c,this.currencySymbol,e))}</div>`:u;return l`${o(s,"cost_parts_booked")}${o(a,"cost_parts_info")}`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=`${Rs()}:00`}render(){if(!this._open)return l``;let e=this.lang||N(this.hass),t=this._error||this._photos.errorText(e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${n("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?l`<div class="phase-line">${n("phase_current",e)}: ${this.phaseLabel}</div>`:u}
        ${this.requireTagScan&&!this.viaTagScan?l`<div class="scan-required-note">${n("require_tag_scan_hint",e)}</div>`:u}
        <div class="content">
          ${t?l`<div class="error">${t}</div>`:u}
          ${this.checklist.length>0?l`
            <div class="checklist-section">
              <label class="checklist-label">${n("checklist",e)}</label>
              ${this.checklist.map((s,a)=>l`
                <label class="checklist-item">
                  <input type="checkbox" .checked=${!!this._checklistState[String(a)]}
                    @change=${()=>this._toggleCheck(a)} />
                  <span>${s}</span>
                </label>
              `)}
            </div>
          `:u}
          ${this.readings.length>0?l`<div class="readings-block">
                <span class="field-label">${n("readings_section",e)}</span>
                ${this.readings.map(s=>this._renderReadingField(s,e))}
              </div>`:this.taskType==="reading"?l`
              <label class="field">
                <span class="field-label">${n("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${s=>this._readingValue=s.target.value} />
              </label>`:u}
          ${this.parts.length?l`<div class="used-parts">
                <span class="field-label">${n("complete_parts_used",e)}</span>
                ${this.parts.map(s=>{let a=ae({part_id:s.id,entry_id:s.entry_id}),o=this._usedParts[a],c=o!==void 0,p=s.entry_id?{part_id:s.id,quantity:1,entry_id:s.entry_id}:{part_id:s.id,quantity:1};return l`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${c}
                        @change=${_=>{let m={...this._usedParts};if(_.target.checked)m[a]=m[a]||p;else{delete m[a];let f={...this._usedQtyText};delete f[a],this._usedQtyText=f}this._usedParts=m}} />
                      <span
                        >${s.name}${s.owner_name?l`<span class="used-part-owner"> (${s.owner_name})</span>`:u}${s.stock!==null&&s.stock!==void 0?` (${it(s.stock,s.unit,e)})`:""}</span
                      >
                    </label>
                    ${c?l`<input class="used-part-qty" type="number" min=${lt[0]} max=${lt[1]} step="0.01"
                          .value=${this._usedQtyText[a]??String(o.quantity)}
                          @input=${_=>{let m=_.target.value;this._usedQtyText={...this._usedQtyText,[a]:m};let f=parseFloat(m.replace(",","."));Number.isFinite(f)&&f>=lt[0]&&(this._usedParts={...this._usedParts,[a]:{...p,quantity:f}})}} />`:u}
                  </div>`})}
              </div>`:this.consumesInfo.length?l`<div class="consumes-hint">
                  ${this.consumesInfo.map(s=>l`<div>${s}</div>`)}
                </div>`:u}
          ${this.restockDefault!==null?l`
              <label class="field">
                <span class="field-label">${n("restock_quantity_label",e)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
                <input type="number" step="0.01" min=${rt[0]} max=${rt[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${s=>this._restockQty=s.target.value} />
              </label>`:u}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${this._demands("notes")?n("notes_label",e):n("notes_optional",e)}${this._req("notes")}</span>
            <!-- Several lines (#202): what was done, one line each. The
                 history and the printouts keep the line breaks; they show
                 notes as plain text, so no Markdown hint here. -->
            <textarea class="field-input notes-input" rows="3"
              .value=${this._notes}
              @input=${s=>this._notes=s.target.value}></textarea>
          </label>
          <div class="field">
            <span class="field-label">${this._demands("cost")?n("cost",e):n("cost_optional",e)}${this._req("cost")}</span>
            <ms-cost-input .lang=${e} .value=${this._cost}
              @value-changed=${s=>this._cost=s.detail.value}></ms-cost-input>
            ${this._renderCostSuggestion(e)}
          </div>
          <label class="field">
            <span class="field-label">${this._demands("duration")?n("quick_complete_defaults_duration",e):n("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="1" min="0" inputmode="numeric" class="field-input"
              .value=${this._duration}
              @input=${s=>this._duration=s.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${n("completed_at_optional",e)}</span>
            ${this._completedAt?l`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  .helper=${ci(e)}
                  @value-changed=${s=>this._completedAt=s.detail.value}
                ></ms-date-field>`:l`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${n("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${this._demands("photo")?n("completion_photos",e):n("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?l`<div class="photo-strip">
                  ${this._photos.photos.map(s=>l`
                    <div class="photo-preview">
                      <img src=${s.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(s.id)}
                        title="${n("remove",e)}">✕</button>
                    </div>`)}
                </div>`:u}
            ${this._photos.full?l`<div class="photo-limit">${n("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:l`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${s=>this._photos.addFiles(s.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?l`
            <div class="feedback-section">
              <label class="feedback-label">${n("was_maintenance_needed",e)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${n("feedback_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${n("feedback_not_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${n("feedback_not_sure",e)}</button>
              </div>
            </div>
          `:u}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${n("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?n("uploading",e):this._missingRequired.length?this._missingRequired.map(s=>n("err_required",e).replace("{field}",n(Lt[s]??s,e))).join(" \xB7 "):""}
          >
            ${this._loading?n("completing",e):n("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};E.styles=[ke,ki,$`
    .req-mark {
      color: var(--error-color, #f44336);
      margin-left: 2px;
      font-weight: 600;
    }
    .notes-input { resize: vertical; line-height: 1.4; }
    /* #104: one-click cost suggestion from parts — quiet link-style chip. */
    .cost-note {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 4px;
      line-height: 1.4;
    }
    .cost-suggestion {
      align-self: flex-start;
      margin-top: 4px;
      padding: 0;
      border: none;
      background: none;
      color: var(--primary-color);
      font-size: 12.5px;
      cursor: pointer;
      text-decoration: underline dotted;
      text-underline-offset: 2px;
    }
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    .scan-required-note {
      margin: -4px 0 12px;
      padding: 8px 10px;
      border-radius: 6px;
      background: rgba(255, 152, 0, 0.12);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .phase-line {
      margin-top: -8px;
      padding-bottom: 12px;
      font-size: 13px;
      color: var(--secondary-text-color);
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
    .consumes-hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      border-left: 3px solid var(--primary-color);
      padding: 4px 8px;
      margin: 4px 0 8px;
    }
    /* #99: editable per-completion parts selection */
    .used-parts { margin: 4px 0 8px; display: flex; flex-direction: column; gap: 4px; }
    .used-part-row { display: flex; align-items: center; gap: 8px; }
    /* #216 consistency pass: the checklist rows' look (14 px, 18 px box). */
    .used-part-check {
      display: flex; align-items: center; gap: 8px; flex: 1;
      font-size: 14px; cursor: pointer;
    }
    .used-part-check input { width: 18px; height: 18px; cursor: pointer; }
    /* #111: whose stock this row draws on. Muted but never omitted — an
       unlabelled foreign pool is indistinguishable from an own part. */
    .used-part-owner { color: var(--secondary-text-color); }
    .used-part-qty {
      width: 76px; padding: 6px 8px; border-radius: 6px; font: inherit; font-size: 14px;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    /* .field/.field-label/.field-input come from nativeFieldStyles */
    /* #161 phase 2: the per-slot reading fields */
    .readings-block { display: flex; flex-direction: column; gap: 8px; }
    .readings-block > .field-label { margin-bottom: -4px; }
    .reading-warn {
      font-size: 12px;
      color: var(--warning-color, #ff9800);
    }
    /* .photo-pick / .photo-pickers / .photo-android-hint come from photoPickerStyles */
    /* #163: the backdate moment starts EMPTY (= now); the button seeds the
       HA date+time picker with the current minute instead of the picker's
       own 00:00 default, so a backdated completion never lands at midnight
       by accident. */
    .backdate-pick {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      background: transparent;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      color: var(--secondary-text-color);
      width: fit-content;
      --mdc-icon-size: 18px;
    }
    .backdate-pick:hover { border-color: var(--primary-color); }
    /* #161: several photos per completion — tiles wrap into a strip,
       the two pickers (camera / gallery) sit underneath while there is
       room left under the cap. */
    .photo-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 8px 0; /* room for the remove badges above the tiles */
    }
    .photo-limit {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .photo-preview {
      position: relative;
      width: fit-content;
    }
    /* Uniform tiles: a tiny or portrait shot must not collapse the strip. */
    .photo-preview img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 8px;
      display: block;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
    }
    .photo-remove {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background: var(--error-color, #db4437);
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
    }
    .checklist-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: 4px;
    }
    /* The field label of every dialog (12 px, 500, secondary). */
    .checklist-label {
      font-weight: 500;
      font-size: 12px;
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
      font-size: 12px;
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
  `],d([y({attribute:!1})],E.prototype,"hass",2),d([y()],E.prototype,"entryId",2),d([y()],E.prototype,"taskId",2),d([y()],E.prototype,"taskName",2),d([y()],E.prototype,"lang",2),d([y({type:Array})],E.prototype,"checklist",2),d([y({type:Boolean})],E.prototype,"adaptiveEnabled",2),d([y()],E.prototype,"taskType",2),d([y()],E.prototype,"readingUnit",2),d([y({attribute:!1})],E.prototype,"readings",2),d([y({attribute:!1})],E.prototype,"readingHistory",2),d([y({attribute:!1})],E.prototype,"restockDefault",2),d([y({attribute:!1})],E.prototype,"restockUnitCost",2),d([y({attribute:!1})],E.prototype,"restockPackage",2),d([y()],E.prototype,"currencySymbol",2),d([y({attribute:!1})],E.prototype,"partsCostMode",2),d([y({attribute:!1})],E.prototype,"parts",2),d([y({attribute:!1})],E.prototype,"consumesParts",2),d([y({type:Array})],E.prototype,"consumesInfo",2),d([y({type:Array})],E.prototype,"requiredFields",2),d([y()],E.prototype,"phaseLabel",2),d([y({type:Boolean})],E.prototype,"requireTagScan",2),d([y({type:Boolean})],E.prototype,"viaTagScan",2),d([h()],E.prototype,"_open",2),d([h()],E.prototype,"_notes",2),d([h()],E.prototype,"_cost",2),d([h()],E.prototype,"_duration",2),d([h()],E.prototype,"_loading",2),d([h()],E.prototype,"_error",2),d([h()],E.prototype,"_checklistState",2),d([h()],E.prototype,"_feedback",2),d([h()],E.prototype,"_readingValue",2),d([h()],E.prototype,"_readingValues",2),d([h()],E.prototype,"_restockQty",2),d([h()],E.prototype,"_completedAt",2),d([h()],E.prototype,"_usedParts",2),d([h()],E.prototype,"_usedQtyText",2),d([y({attribute:!1})],E.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",E)});function Il(r,i){r.key!=="Escape"||r.defaultPrevented||r.composedPath().some(e=>e instanceof Element&&e.localName==="ms-camera-capture")||(r.preventDefault(),r.stopPropagation(),i())}function dt(r,i){return l`
    <div class="backdrop" @click=${r}></div>
    <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
      @keydown=${e=>Il(e,r)}>${i}</div>
  `}function pt(r){r?.querySelector(".dialog")?.focus({preventScroll:!0})}var ct,$i=v(()=>{"use strict";C();ct=$`
  .backdrop {
    position: fixed; inset: 0; z-index: var(--ms-modal-z, 100);
    background: rgba(0,0,0,0.5);
  }
  .dialog {
    position: fixed; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 95vw; max-width: var(--ms-modal-max-width, 480px);
    max-height: var(--ms-modal-max-height, 92vh); overflow: auto;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    color: var(--primary-text-color);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    padding: 20px;
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
    z-index: calc(var(--ms-modal-z, 100) + 1);
  }
  /* Focused programmatically on open (so Escape works at once) — no ring. */
  .dialog:focus { outline: none; }
  /* The one part that shrinks and scrolls (min-height: 0); the header and the
     buttons around it keep their content's height. */
  .dialog-scroll {
    flex: 1 1 auto; min-height: 0;
    overflow-y: auto; overscroll-behavior: contain;
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
  }
`});var K,ca=v(()=>{"use strict";C();F();T();K=class extends S{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel="",this._inputType="",this._options=null,this._inputValue="",this._open=!0,new Promise(t=>{this._resolve=t,this._promptResolve=null})}prompt(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"text",this._options=e.options&&e.options.length?e.options:null,this._inputValue=e.inputValue||"",this._open=!0,new Promise(t=>{this._promptResolve=t,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return u;let e=N(this.hass);return l`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel?l`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?l`<select class="field-input field-select"
                    @change=${t=>this._inputValue=t.target.value}>
                    ${this._options.map(t=>l`<option value=${t.value} ?selected=${t.value===this._inputValue}>${t.label}</option>`)}
                  </select>`:l`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${t=>this._inputValue=t.target.value} />`}
            </label>
          `:u}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${n("cancel",e)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};K.styles=[ke,$`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* shared native-field scaffold from nativeFieldStyles; the prompt input
       follows the message text, hence the extra top margin here */
    .field { margin-top: 12px; }
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
  `],d([y({attribute:!1})],K.prototype,"hass",2),d([h()],K.prototype,"_open",2),d([h()],K.prototype,"_title",2),d([h()],K.prototype,"_message",2),d([h()],K.prototype,"_confirmText",2),d([h()],K.prototype,"_danger",2),d([h()],K.prototype,"_inputLabel",2),d([h()],K.prototype,"_inputType",2),d([h()],K.prototype,"_options",2),d([h()],K.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",K)});function Rl(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function Ve(r,i){let e=Rl(),t=e.querySelector(`${da}[${pa}]`);return t||(t=document.createElement(da),t.setAttribute(pa,""),e.appendChild(t)),t.hass=r,t.confirm(i)}var da,pa,Ei=v(()=>{"use strict";ca();da="maintenance-confirm-dialog",pa="data-ms-lovelace-confirm"});function ua(r,i,e){let t=new Blob([r],{type:e}),s=URL.createObjectURL(t),a=document.createElement("a");a.href=s,a.download=i,a.target="_blank",a.rel="noopener",a.style.display="none",document.body.appendChild(a),a.dispatchEvent(new MouseEvent("click")),document.body.removeChild(a),setTimeout(()=>URL.revokeObjectURL(s),6e4)}var Er=v(()=>{"use strict"});async function Pl(r,i,e=300){return(await r.connection.sendMessagePromise({type:"auth/sign_path",path:i,expires:e})).path}async function ha(r,i,e=300){return Pl(r,`/api/maintenance_supporter/document/${i}`,e)}var _a=v(()=>{"use strict";Er()});var Ce,Sr=v(()=>{"use strict";C();F();_a();Ce=class extends S{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await ha(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?u:this._url?l`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:l`<div class="ph"></div>`}};Ce.styles=$`
    .wrap { display: inline-block; margin-top: 4px; }
    /* #161: uniform 96px tiles — several photos sit in a strip, so a
       tiny or portrait shot must not collapse its slot. */
    img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 6px;
      display: block;
      border: 1px solid var(--divider-color);
      box-sizing: border-box;
    }
    .ph {
      width: 96px;
      height: 96px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      margin-top: 4px;
    }
  `,d([y({attribute:!1})],Ce.prototype,"hass",2),d([y()],Ce.prototype,"docId",2),d([h()],Ce.prototype,"_url",2),d([h()],Ce.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",Ce)});var Z,ma=v(()=>{"use strict";C();F();T();Te();G();Ht();$i();xr();yi();Ei();nt();bi();Sr();jt();jt();Z=class extends S{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new ot(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return N(this.hass)}openEdit(e){this._openGen++,this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(e.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(e),this._loadPartOptions()}_seedReadings(e){let t=[],s=new Set;for(let o of e.readings??[])s.has(o.id)||(s.add(o.id),t.push({id:o.id,name:o.name,unit:o.unit??null}));for(let o of e.reading_values??[])s.has(o.id)||(s.add(o.id),t.push({id:o.id,name:o.name,unit:o.unit??null}));this._readingRows=t;let a={};for(let o of e.reading_values??[])a[o.id]=String(o.value);this._readingText=a,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let e={};for(let t of this._readingRows){let s=(this._readingText[t.id]??"").trim();if(s==="")continue;let a=parseFloat(s.replace(",","."));isNaN(a)||(e[t.id]=a)}return e}async _loadPartOptions(){let e=this._draft;if(!e)return;let t=this._openGen;try{let s=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(t!==this._openGen)return;let a=[];for(let c of s.parts||[]){let p=c.entry_id===e.entry_id,_=c.consumers.some(m=>m.entry_id===e.entry_id&&m.task_id===e.task_id);!p&&!_||a.push({part_id:c.part_id,name:c.name,entry_id:c.entry_id,foreign:!p,object_name:c.object_name})}for(let c of e.used_parts||[]){let p=c.entry_id||e.entry_id;a.some(_=>_.part_id===c.part_id&&_.entry_id===p)||a.push({part_id:c.part_id,name:c.name||c.part_id,entry_id:p,foreign:p!==e.entry_id,object_name:null})}let o={};for(let c of e.used_parts||[])o[`${c.entry_id||e.entry_id}:${c.part_id}`]=c.quantity??1;this._partOptions=a,this._partQty=o,this._partQtyOriginal=this._partSelectionKey()}catch{if(t!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,e])=>e>0).sort(([e],[t])=>e.localeCompare(t)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let e=this._lang,s=(this._originalSnapshot.used_parts||[]).filter(p=>p.quantity>0).map(p=>`${I(p.quantity,e)}\xD7 ${p.name||p.part_id}`).join(", ");if(!await Ve(this.hass,{title:n("history_delete_entry",e),message:s?`${n("history_delete_confirm_entry",e)} ${n("history_delete_returns_parts",e).replace("{parts}",s)}`:n("history_delete_confirm_entry",e),confirmText:n("delete",e),danger:!0})||!this._draft||!this._originalSnapshot)return;let o=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:o.entry_id,task_id:o.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:o.entry_id,task_id:o.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(e){return j(this,e,{busy:t=>{this._saving=t},onError:t=>{this._error=t}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let e=this._draft,t=this._originalSnapshot,s={type:"maintenance_supporter/task/history/update",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:t.original_timestamp};if(e.timestamp!==t.timestamp&&(s.timestamp=e.timestamp),e.notes!==t.notes&&(s.notes=e.notes),e.cost!==t.cost&&(s.cost=e.cost),e.duration!==t.duration&&(s.duration=e.duration),e.completed_by!==t.completed_by&&(s.completed_by=e.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(s.used_parts=(this._partOptions||[]).filter(o=>(this._partQty[`${o.entry_id}:${o.part_id}`]||0)>0).map(o=>({part_id:o.part_id,quantity:this._partQty[`${o.entry_id}:${o.part_id}`],...o.foreign?{entry_id:o.entry_id}:{}}))),e.reading_value!==t.reading_value&&(s.reading_value=e.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let o=this._readingNumbers(),c={};for(let p of this._readingRows)c[p.id]=o[p.id]??null;s.reading_values=c}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(s.photo_doc_ids=this._photos.ids),Object.keys(s).filter(o=>!["type","entry_id","task_id","original_timestamp"].includes(o)).length===0){this.close();return}await this._runWs(s)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:e.entry_id,task_id:e.task_id,new_timestamp:e.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return u;let e=this._lang,t=this._draft,s=this._error||this._photos.errorText(e);return dt(()=>this.close(),l`
        <h2>${n("history_edit_title",e)}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${n(t.type,e)||t.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${e}
          .label=${n("history_edit_timestamp",e)}
          .helper=${ci(e)}
          .value=${Ns(t.timestamp)}
          @value-changed=${a=>{let o=a.detail.value;o&&this._set("timestamp",o)}}
        ></ms-date-field>
        <label>
          <span>${n("notes_label",e)}</span>
          <textarea
            rows="3"
            @input=${a=>{let o=a.target.value;this._set("notes",o||null)}}
            .value=${t.notes??""}></textarea>
        </label>
        <div class="row">
          <div class="cost-field">
            <span>${n("cost",e)}</span>
            <ms-cost-input .lang=${e} .value=${t.cost!=null?String(t.cost):""}
              @value-changed=${a=>{let o=a.detail.value;this._set("cost",o?Number(o):null)}}></ms-cost-input>
          </div>
          <label>
            <span>${n("duration",e)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${t.duration!=null?String(t.duration):""}
              @input=${a=>{this._set("duration",at(a.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(t,e)}
        ${this._partOptions&&this._partOptions.length>0?l`
          <div class="parts-block">
            <span class="parts-title">${n("complete_parts_used",e)}</span>
            ${this._partOptions.map(a=>{let o=`${a.entry_id}:${a.part_id}`,c=this._partQty[o]||0;return l`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${c>0}
                    @change=${p=>{let _=p.target.checked;this._partQty={...this._partQty,[o]:_?1:0}}} />
                  <span class="part-label">${a.name}${a.foreign&&a.object_name?` (${a.object_name})`:""}</span>
                  ${c>0?l`
                    <input class="part-qty" type="number" min=${Se[0]} max=${Se[1]} step="0.01"
                      .value=${String(c)}
                      @input=${p=>{let _=parseFloat(p.target.value);!isNaN(_)&&_>0&&(this._partQty={...this._partQty,[o]:_})}} />
                  `:u}
                </label>
              `})}
          </div>
        `:u}
        <div class="photos-block">
          <span class="parts-title">${n("completion_photos",e)}</span>
          ${this._photos.photos.length>0?l`
            <div class="photo-strip">
              ${this._photos.photos.map(a=>l`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${a.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${n("remove",e)}
                    @click=${()=>this._photos.remove(a.id)}>✕</button>
                </div>`)}
            </div>`:u}
          ${this._photos.full?l`<span class="photos-hint">${n("photos_limit",e).replace("{max}",String(this._photos.max))}</span>`:l`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${a=>this._photos.addFiles(a.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${n("history_edit_photos_hint",e)}</span>
        </div>
        ${s?l`<div class="error">${s}</div>`:u}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${n("history_delete_entry",e)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${n("history_delete_entry",e)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${n("cancel",e)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving||this._photos.uploading}
            title=${this._photos.uploading?n("uploading",e):""}>
            ${this._saving?n("saving",e):n("save",e)}
          </button>
        </div>
    `)}updated(e){e.has("_open")&&this._open&&pt(this.shadowRoot)}_renderReadings(e,t){return this._readingRows.length>0?l`
        <div class="readings-block">
          <span class="parts-title">${n("readings_section",t)}</span>
          ${this._readingRows.map(s=>l`
            <label class="reading-row-edit">
              <span class="reading-row-name">${s.name}${s.unit?` (${s.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[s.id]??""}
                @input=${a=>{this._readingText={...this._readingText,[s.id]:a.target.value}}} />
            </label>
          `)}
        </div>`:e.reading_value==null&&e.task_type!=="reading"?u:l`
      <label>
        <span>${n("reading_value_label",t)}${e.reading_unit?` (${e.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${e.reading_value!=null?String(e.reading_value):""}
          @input=${s=>{let a=s.target.value,o=a===""?NaN:Number(a);this._set("reading_value",isNaN(o)?null:o)}} />
      </label>`}};Z.styles=[ki,ct,$`
    :host { display: contents; --ms-modal-max-height: 90vh; --ms-modal-gap: 12px; }
    h2 { margin: 0; font-size: 18px; font-weight: 500; }
    .entry-type {
      display: flex; align-items: center; gap: 6px;
      color: var(--secondary-text-color); font-size: 13px;
    }
    /* #216 consistency pass: the field label of ms-textfield / ms-date-field
       (12 px, 500, secondary) — this dialog's were 13 px, normal weight. */
    label { display: flex; flex-direction: column; gap: 4px; font-size: 14px; }
    label:not([class]) > span,
    .cost-field > span { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
    .cost-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    input, textarea {
      padding: 8px 10px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px;
      width: 100%; box-sizing: border-box;
      font-family: inherit;
    }
    .delete-entry { margin-right: auto; color: var(--error-color, #d32f2f); background: transparent; border: 1px solid var(--error-color, #d32f2f); border-radius: 6px; padding: 6px 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
    .delete-entry ha-icon { --mdc-icon-size: 18px; }
    .actions {
      display: flex; gap: 8px; justify-content: flex-end;
      margin-top: 8px;
    }
    button {
      padding: 8px 16px; font-size: 14px;
      border-radius: 6px; cursor: pointer;
      border: none; font-weight: 500;
    }
    button.cancel {
      background: transparent;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
    }
    button.save {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
    }
    button[disabled] { opacity: 0.5; cursor: wait; }
    .error {
      color: var(--error-color, #d32f2f);
      font-size: 13px; padding: 8px;
      background: rgba(211,47,47,0.1);
      border-radius: 6px;
    }
    /* #130: parts on the entry */
    .parts-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px; padding: 8px;
    }
    .parts-title { color: var(--secondary-text-color); font-size: 12px; font-weight: 500; }
    .part-row-edit {
      display: flex; flex-direction: row; align-items: center; gap: 8px;
      font-size: 14px;
    }
    .part-row-edit input[type="checkbox"] { width: auto; }
    .part-label { flex: 1; color: var(--primary-text-color); }
    .part-qty { width: 76px; }
    /* #161 phase 2: readings on the entry */
    .readings-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px; padding: 8px;
    }
    .reading-row-edit {
      display: flex; flex-direction: row; align-items: center; gap: 8px;
      font-size: 14px;
    }
    .reading-row-name { flex: 1; color: var(--primary-text-color); min-width: 0; }
    .reading-row-input { width: 140px; font-variant-numeric: tabular-nums; }
    /* #161: photos on the entry */
    .photos-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px; padding: 8px;
    }
    .photo-strip { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 6px; }
    .photo-tile { position: relative; width: fit-content; }
    .photo-remove {
      position: absolute; top: -4px; right: -8px;
      width: 22px; height: 22px; border-radius: 50%; border: none;
      background: var(--error-color, #db4437); color: #fff;
      cursor: pointer; font-size: 11px; line-height: 1; padding: 0;
    }
    /* the camera / gallery pickers come from photoPickerStyles (ms-photo-picker) */
    .photos-hint { font-size: 12px; color: var(--secondary-text-color); }
  `],d([y({attribute:!1})],Z.prototype,"hass",2),d([h()],Z.prototype,"_open",2),d([h()],Z.prototype,"_saving",2),d([h()],Z.prototype,"_error",2),d([h()],Z.prototype,"_draft",2),d([h()],Z.prototype,"_partOptions",2),d([h()],Z.prototype,"_partQty",2),d([h()],Z.prototype,"_readingRows",2),d([h()],Z.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",Z)});function Ie(r){return String(r??"").replace(/[&<>"']/g,i=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[i])}var ga=v(()=>{"use strict"});function Tr(r){return!r.startsWith("data:image/svg+xml,")&&!r.startsWith("data:image/png;base64,")?"":Ie(r)}function Nl(r){return r.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var J,fa=v(()=>{"use strict";C();F();T();Er();ga();J=class extends S{constructor(){super(...arguments);this.lang="";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._quickResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}get _dialogLang(){return this.lang||N(this.hass)}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}openForTask(e,t,s,a){this._entryId=e,this._taskId=t,this._objectName=s,this._taskName=a,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let s=[this.hass.connection.sendMessagePromise({...t,action:"view"})];this._taskId&&(s.push(this.hass.connection.sendMessagePromise({...t,action:"complete"})),await this._hasQuickCompleteDefaults()&&s.push(this.hass.connection.sendMessagePromise({...t,action:"quick_complete"})));let a=await Promise.all(s);if(e!==this._generateSeq)return;this._viewResult=a[0],a.length>1&&(this._completeResult=a[1]),a.length>2&&(this._quickResult=a[2])}catch(t){if(e!==this._generateSeq)return;let s=t?.code,a=t?.message;this._error=s==="no_url"||typeof a=="string"&&a.includes("No Home Assistant URL")?n("qr_error_no_url",this._dialogLang):n("qr_error",this._dialogLang)}finally{e===this._generateSeq&&(this._loading=!1)}}async _hasQuickCompleteDefaults(){try{let t=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId})).tasks||[]).find(s=>s.id===this._taskId);return!!t?.quick_complete_defaults&&Object.keys(t.quick_complete_defaults).length>0}catch{return!1}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,s=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),a=window.open("","_blank","width=600,height=500");if(!a)return;let o=this._dialogLang,c=Ie(t),p=Ie(s),_=!!this._completeResult,m=!!this._quickResult,f=Ie(n("qr_action_view",o)),b=Ie(n("qr_action_complete",o)),w=Ie(n("qr_action_quick_complete",o));a.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${c}</title>
<style>
  /* Printable sheet \u2014 must not inherit the phone's dark theme. The QR images
     carry their own white quiet zone and stay scannable either way, but the
     labels below are explicit dark greys and would vanish on a WebView's dark
     canvas. Same reasoning as helpers/report.ts. */
  :root{color-scheme:light}
  body{font-family:sans-serif;text-align:center;padding:20px;background:#fff;color:#1a1a1a}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  .qr-row{display:flex;justify-content:center;gap:24px;margin:12px 0}
  .qr-col{display:flex;flex-direction:column;align-items:center;gap:6px}
  .qr-col img{width:${m?"170px":_?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${c}</h2>
${p?`<div class="sub">${p}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${Tr(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${f}</div>
  </div>
  ${_?`<div class="qr-col">
    <img src="${Tr(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${b}</div>
  </div>`:""}
  ${m?`<div class="qr-col">
    <img src="${Tr(this._quickResult.svg_data_uri)}" alt="QR Quick-complete" />
    <div class="qr-label">${w}</div>
  </div>`:""}
</div>
<div class="url">${Ie(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),a.document.close()}_downloadSvg(e,t){let s=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),a=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;ua(s,`qr-${Nl(a)}-${t}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._quickResult=null,this._error="",this._loading=!1}render(){if(!this._open)return l``;let e=this._dialogLang,t=this._taskName?`${n("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${n("qr_code",e)}: ${this._objectName}`,s=!!this._viewResult;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._loading?l`<div class="loading">${n("qr_generating",e)}</div>`:this._error?l`<div class="error">${this._error}</div>`:s?l`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${n("qr_action_view",e)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${n("qr_download",e)}
                        </button>
                      </div>
                      ${this._completeResult?l`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${n("qr_action_complete",e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${n("qr_download",e)}
                              </button>
                            </div>
                          `:u}
                      ${this._quickResult?l`
                            <div class="qr-item quick">
                              <img
                                class="qr-image small"
                                src="${this._quickResult.svg_data_uri}"
                                alt="QR Quick-complete"
                              />
                              <div class="qr-item-label">${n("qr_action_quick_complete",e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._quickResult,"quick-complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${n("qr_download",e)}
                              </button>
                            </div>
                          `:u}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:u}
          <div class="action-row">
            <label>${n("qr_url_mode",e)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${n("qr_mode_companion",e)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${n("qr_mode_local",e)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${n("qr_mode_server",e)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${n("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!s}
          >
            ${n("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};J.styles=$`
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
      flex-wrap: wrap; /* three codes (quick-complete, #192) wrap on a phone */
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
      max-width: 180px;
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
  `,d([y({attribute:!1})],J.prototype,"hass",2),d([y()],J.prototype,"lang",2),d([h()],J.prototype,"_open",2),d([h()],J.prototype,"_loading",2),d([h()],J.prototype,"_error",2),d([h()],J.prototype,"_viewResult",2),d([h()],J.prototype,"_completeResult",2),d([h()],J.prototype,"_quickResult",2),d([h()],J.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",J)});function ya(r,i,e=new Date){let t=r?.hours,s=V(r?.snoozed_until);if(typeof t!="number"||!Number.isFinite(s))return n("snoozed",i);let a=be(),c=xe(s,a)===xe(e,a)?oi(new Date(s),i):li(r.snoozed_until,i);return ai("snoozed_for","snoozed_for_one",t,i,"hours").replace("{until}",c)}var va=v(()=>{"use strict";T();G()});function Hl(r,i){if(i<=0)return 0;let e=typeof r=="number"&&Number.isFinite(r)?Math.trunc(r):0;return e<0?0:e%i}function Ol(r){return!!(r?.phases&&r.phase_sequence&&r.phase_sequence.length>0)}function Ar(r){if(!r||!Ol(r))return null;let i=r.phase_sequence,e=Hl(r.phase_cursor,i.length),t=i[e],s=r.phases?.[t];return s?{id:t,name:s.name,index:e,count:i.length,notes:s.notes,checklist:s.checklist!==void 0?s.checklist:r.checklist??[],consumesParts:s.consumes_parts!==void 0?s.consumes_parts:r.consumes_parts??[],requiredFields:s.required_completion_fields!==void 0?s.required_completion_fields:r.required_completion_fields??[]}:null}function qt(r){let i=Ar(r);return i?`${i.index+1}/${i.count} \xB7 ${i.name}`:""}var Cr=v(()=>{"use strict"});function Ll(r,i){return typeof r=="number"&&Number.isFinite(r)&&r>=.01?r:i}function ba(r){let i=r.task??null,e=i?Ar(i):null,t=e?e.consumesParts:i?.consumes_parts||[],s=!!i?.part_ref,a=r.objects.find(m=>m.entry_id===r.entryId)?.parts||[],o=s?a.find(m=>m.id===i.part_ref.part_id):void 0,c=r.features?r.features.checklists:r.checklistsEnabled??!0,p=r.features?r.features.checklists?r.checklist??i?.checklist??[]:[]:r.checklist??[],_=r.features?r.features.adaptive&&(r.adaptiveEnabled??!!i?.adaptive_config?.enabled):!!r.adaptiveEnabled;return{entry_id:r.entryId,task_id:r.taskId,task_name:r.taskName,checklist:e?c?e.checklist:[]:p,adaptive_enabled:_,required_completion_fields:e?e.requiredFields:i?.required_completion_fields||[],task_type:i?.type||"",reading_unit:i?.reading_unit||"",readings:i?.readings||[],reading_history:dn(i?.history),parts:s?[]:Nn({consumes_parts:t},r.entryId,r.objects,r.lang),consumes_parts:s?[]:t,phase_label:e?qt(i):"",require_tag_scan:!!i?.require_tag_scan,restock_default:s?Ll(o?.restock_quantity,1):null,restock_unit_cost:s?o?.cost??null:null,restock_package:s&&o?.package_size?it(o.package_size,o.unit,r.lang):"",currency_symbol:Fe({currency_symbol:r.currencySymbol}),consumes_info:t.map(m=>Pn(m,r.entryId,r.objects,r.lang)),checklist_prefill:i?.checklist_progress||{},via_tag_scan:!!r.viaTagScan,parts_cost_mode:s?Xt(o,r.partsCostMode??"purchase"):r.partsCostMode??"purchase"}}function xa(r,i,e){r.entryId=i.entry_id,r.taskId=i.task_id,r.taskName=i.task_name,r.lang=e,r.checklist=i.checklist??[],r.adaptiveEnabled=!!i.adaptive_enabled,r.requiredFields=i.required_completion_fields??[],r.taskType=i.task_type??"",r.readingUnit=i.reading_unit??"",r.readings=i.readings??[],r.readingHistory=i.reading_history??[],r.parts=i.parts??[],r.consumesParts=i.consumes_parts??[],r.phaseLabel=i.phase_label??"",r.requireTagScan=!!i.require_tag_scan,r.restockDefault=i.restock_default??null,r.restockUnitCost=i.restock_unit_cost??null,r.restockPackage=i.restock_package??"",r.currencySymbol=Fe(i),r.consumesInfo=i.consumes_info??[],r.checklistPrefill=i.checklist_prefill??{},r.viaTagScan=!!i.via_tag_scan,r.partsCostMode=i.parts_cost_mode??"purchase",r.open({viaTagScan:!!i.via_tag_scan})}var Ir=v(()=>{"use strict";Ue();fi();Cr();T();Ze()});var n_,wa,ka=v(()=>{Ye();({I:n_}=cs),wa=r=>r.strings===void 0});var $a,Rr,Si,Ti=v(()=>{$a={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Rr=r=>(...i)=>({_$litDirective$:r,values:i}),Si=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,e,t){this._$Ct=i,this._$AM=e,this._$Ci=t}_$AS(i,e){return this.update(i,e)}update(i,e){return this.render(...e)}}});function jl(r){this._$AN!==void 0?(Ai(this),this._$AM=r,Ea(this)):this._$AM=r}function ql(r,i=!1,e=0){let t=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(i)if(Array.isArray(t))for(let a=e;a<t.length;a++)Mt(t[a],!1),Ai(t[a]);else t!=null&&(Mt(t,!1),Ai(t));else Mt(this,r)}var Mt,Ai,Ea,Ml,Ci,Sa=v(()=>{ka();Ti();Ti();Mt=(r,i)=>{let e=r._$AN;if(e===void 0)return!1;for(let t of e)t._$AO?.(i,!1),Mt(t,i);return!0},Ai=r=>{let i,e;do{if((i=r._$AM)===void 0)break;e=i._$AN,e.delete(r),r=i}while(e?.size===0)},Ea=r=>{for(let i;i=r._$AM;r=i){let e=i._$AN;if(e===void 0)i._$AN=e=new Set;else if(e.has(r))break;e.add(r),Ml(i)}};Ml=r=>{r.type==$a.CHILD&&(r._$AP??=ql,r._$AQ??=jl)},Ci=class extends Si{constructor(){super(...arguments),this._$AN=void 0}_$AT(i,e,t){super._$AT(i,e,t),Ea(this),this.isConnected=i._$AU}_$AO(i,e=!0){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),e&&(Mt(this,i),Ai(this))}setValue(i){if(wa(this._$Ct))this._$Ct._$AI(i,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=i,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}});var Pr,Ta,Aa=v(()=>{Ye();Sa();Ti();Pr=new WeakMap,Ta=Rr(class extends Ci{render(r){return u}update(r,[i]){let e=i!==this.G;return e&&this.G!==void 0&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=i,this.ht=r.options?.host,this.rt(this.ct=r.element)),u}rt(r){if(this.isConnected||(r=void 0),typeof this.G=="function"){let i=this.ht??globalThis,e=Pr.get(i);e===void 0&&(e=new WeakMap,Pr.set(i,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,r),r!==void 0&&this.G.call(this.ht,r)}else this.G.value=r}get lt(){return typeof this.G=="function"?Pr.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}})});var Ca=v(()=>{Aa()});function Nr(r){return r.replace(/[\t\n\r]/g,"").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g,"")}function Hr(r){let i=/^([a-z][a-z0-9+.-]+):/i.exec(Nr(r||""));return i?i[1].toLowerCase():null}function Ii(r){let i=Hr(r);return i!==null&&!Dl.has(i)}function Ia(r){return!!r&&/^https?:\/\//i.test(r)}var Dl,Or=v(()=>{"use strict";Dl=new Set(["about","blob","data","file","filesystem","javascript","livescript","ms-appinstaller","ms-cxh","ms-cxh-full","ms-msdt","ms-officecmd","search","search-ms","view-source","vbscript"])});function Pi(r){if(!r)return u;if(customElements.get("ha-markdown")){let{content:i,links:e}=Ul(r);return l`<ha-markdown
      class="notes-md"
      .content=${i}
      breaks
      ${Ta(t=>Bl(t,e))}
    ></ha-markdown>`}return l`${r}`}function Ul(r){let i=[],e=a=>{let o=Hr(a);return!o||zl.has(o)||!Ii(a)?null:(i.push(Nr(a)),`${jr}${i.length-1}`)},t=a=>a.replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)<(${Ri}[^>\\n]*)>`,"g"),(o,c,p,_)=>{let m=c?null:e(_);return m?`${p}${m}`:o}).replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)(${Ri}[^\\s)]*)`,"g"),(o,c,p,_)=>{let m=c?null:e(_);return m?`${p}${m}`:o}).replace(new RegExp(`(^|[^(])<(${Ri}[^\\s<>]*)>`,"gm"),(o,c,p)=>{let _=e(p);return _?`${c}[${p.replace(/([\\[\]])/g,"\\$1")}](${_})`:o}).replace(new RegExp(`^( {0,3}\\[[^\\]\\n]+\\]:[ \\t]*)<?(${Ri}[^\\s>]*)>?`,"gm"),(o,c,p)=>{let _=e(p);return _?`${c}${_}`:o});return{content:r.split(Fl).map((a,o)=>o%2?a:t(a)).join(""),links:i}}function Lr(r,i){for(let e of r.querySelectorAll(`a[href^="${jr}"]`)){let t=i[Number(e.getAttribute("href").slice(jr.length))];t&&e.setAttribute("href",t)}}function Bl(r,i){if(!r)return;let e=Ra.get(r);if(!e&&i.length===0)return;if(e){e.links=i,r.shadowRoot&&Lr(r.shadowRoot,i);return}let t={links:i};Ra.set(r,t),(async()=>{await r.updateComplete;let s=r.shadowRoot;s&&(new MutationObserver(()=>Lr(s,t.links)).observe(s,{childList:!0,subtree:!0}),Lr(s,t.links))})()}var jr,zl,Fl,Ri,Ra,qr=v(()=>{"use strict";C();Ca();Or();jr="https://app-link.invalid/",zl=new Set(["http","https","mailto","tel","ftp"]),Fl=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/,Ri="[a-zA-Z][a-zA-Z0-9+.-]+:";Ra=new WeakMap});function Wl(r){return r&&Pa(r.ref_no)?String(r.ref_no):null}function Na(r,i){let e=Wl(r);return e&&i&&Pa(i.ref_no)?`${e}.${i.ref_no}`:null}function Ha(r,i){return r?l`<span class="ref-chip" title=${i??""}>#${r}</span>`:u}var Pa,Mr=v(()=>{"use strict";C();Pa=r=>typeof r=="number"&&Number.isInteger(r)&&r>0});var Dr=v(()=>{"use strict"});function Oa(r,i){if(!r)return"";let e=Vl[r.trim()];if(e)return n(e,i);for(let[t,s,a]of Gl){let o=r.trim().match(t);if(o){let c=a(o,i);return n(s,i).replace(/\{(\w+)\}/g,(p,_)=>c[_]??p)}}return r}var Vl,Gl,La=v(()=>{"use strict";T();Vl={"Completed from dashboard button":"hist_note_button","Auto-completed: sensor recovered":"hist_note_auto_recovered_plain","Completed from the To-do list":"hist_note_todo","Completed by voice":"hist_note_voice","Completed from the notification":"hist_note_notification","Completed via NFC tag":"hist_note_nfc","Completed from the shopping list":"hist_note_shopping_list","Completed from a mirrored to-do list":"hist_note_todo_mirror","Skipped from notification":"hist_note_skipped_notification","Skipped from dashboard button":"hist_note_skipped_button","Sensor trigger activated":"hist_note_sensor_triggered","Initial value set during task creation":"hist_note_initial"},Gl=[[/^Auto-completed: sensor recovered \((.+)\)$/,"hist_note_auto_recovered",r=>({value:r[1]})],[/^Reset to (\d{4}-\d{2}-\d{2})$/,"hist_note_reset",(r,i)=>({date:L(r[1],i)})],[/^Trigger entity replaced: (.+) → (.+)$/,"hist_note_trigger_replaced",r=>({old:r[1],new:r[2]})],[/^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,"hist_note_trigger_removed",(r,i)=>({entity:r[1],schedule:n(r[2],i)})],[/^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,"hist_note_compound_removed",r=>({entity:r[1],count:r[2]})]]});function ja(r){let i=e=>{let t=V(e.timestamp);return Number.isNaN(t)?-1/0:t};return(r??[]).map((e,t)=>({entry:e,index:t,at:i(e)})).sort((e,t)=>t.at-e.at||t.index-e.index).map(e=>e.entry)}function Yl(r,i){return r.taskRef&&i.ref_no?`${r.taskRef}-${i.ref_no}`:null}function Ql(r,i){let e=At(i);return e.length>0?l`<div class="history-photos">
        ${e.map(t=>l`<maintenance-history-photo .hass=${r} .docId=${t}></maintenance-history-photo>`)}
      </div>`:u}function Zl(r,i){let e=i.lang,t=o=>I(o,e,{maximumFractionDigits:3}),s=o=>o==null?"":` (${o>=0?"+":""}${t(o)})`,a=$e(r);return a.length>0?l`<div class="history-readings">
      ${a.map(o=>l`<span class="history-reading">
        <span class="history-reading-name">${o.name}</span>
        <span class="history-reading-value">${t(o.value)}${o.unit?` ${o.unit}`:""}${s(i.readingSlotDelta?.(r,o.id))}</span>
      </span>`)}
    </div>`:r.reading_value!=null?l`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${n("reading_label",e)}</span>
      <span class="history-reading-value">${t(r.reading_value)}${i.readingUnit?` ${i.readingUnit}`:""}${s(i.readingDelta?.(r))}</span>
    </span></div>`:u}function qa(r,i,e={}){let t=i.lang,{compact:s=!1,showRef:a=!0,showBadges:o=!0,showEdit:c=!0}=e,p=i.openEdit,_=c&&!!p&&ei.includes(r.type),m=typeof r.parts_cost=="number"?r.parts_cost:null,f=r.cost_basis==="use",b=f&&!!r.purchase;return l`
    <div class="history-entry${s?" compact":""}">
      ${s?u:l`<div class="history-icon ${r.type}" style="background: ${Gi(r.type)}">
            <ha-icon .icon=${Et[r.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${n(r.type,t)}</strong>
          ${a?Ha(Yl(i,r),n("ref_number",t)):u}
          ${o&&r.phase_id?l`<span class="history-phase-badge">${i.phaseNames?.[r.phase_id]||r.phase_id}</span>`:u}
          ${o&&r.auto?l`<span class="history-auto-badge">${n("history_auto",t)}</span>`:u}
          ${_?l`<button class="history-edit-btn"
                     title=${n("history_edit_button",t)}
                     @click=${()=>p(r)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:u}
        </div>
        <div class="history-date">${li(r.timestamp,t)}</div>
        ${r.notes?l`<div class="history-notes">${Oa(r.notes,t)}</div>`:u}
        ${Ql(i.hass,r)}
        ${Zl(r,i)}
        ${r.cost!=null||r.duration!=null||r.trigger_value!=null||m!=null?l`<div class="history-details">
              ${r.cost!=null?b?l`<span>${n("history_purchase_stock",t).replace("{amount}",Q(r.cost,i.currencySymbol,t))}</span>`:r.cost<0?l`<span class="history-credit">${Zs(r.cost,i.currencySymbol,t)}</span>`:l`<span>${n("cost",t)}: ${Q(r.cost,i.currencySymbol,t)}</span>`:u}
              ${m!=null?l`<span title=${n(f?"history_parts_counted_hint":"history_parts_info_hint",t)}>${n(f?"history_parts_counted":"history_parts_info",t).replace("{amount}",Q(m,i.currencySymbol,t))}</span>`:u}
              ${r.duration!=null?l`<span>${n("duration",t)}: ${di(r.duration,t)}</span>`:u}
              ${r.trigger_value!=null?l`<span>${n("trigger_val",t)}: ${r.trigger_value}</span>`:u}
            </div>`:u}
      </div>
    </div>
  `}var Ma=v(()=>{"use strict";C();T();Sr();Ct();Mr();Ue();Dr();La();G();Je()});function Dt(r){if(r.archived)return"archived";if(r.is_done)return"done";let i=r.status||"ok";return i==="ok"&&r.schedule_type==="manual"&&r.days_until_due==null?"no_due":i}function zr(r,i){return n(ec[r]??r,i)}function Ni(r){let i=Dt(r);return i==="done"?Jl:i==="no_due"?Xl:ye[i]||"var(--disabled-color, #9e9e9e)"}function tc(r){return r==="no_due"?"mdi:calendar-blank-outline":Et[r==="done"?"completed":r]||"mdi:circle-medium"}function Da(r,i,e="pill"){let t=Dt(r),s=zr(t,i);return e==="chip"?l`<span class="status-chip ${t}">${s}</span>`:l`<span class="status-badge ${t}" role="img" title="${s}" aria-label="${s}"><ha-icon icon="${tc(t)}"></ha-icon><span class="status-label">${s}</span></span>`}var Jl,Xl,ec,Fr=v(()=>{"use strict";C();T();Je();Jl="var(--maint-done-color, #78909c)",Xl="var(--secondary-text-color, #727272)";ec={done:"completed",no_due:"no_due_date"}});var Hi,za=v(()=>{"use strict";Hi=class{constructor(){this._handle=null}schedule(i,e=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,i()},e)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}}});function A(r){return r.toFixed(1)}var Ur=v(()=>{"use strict";T();G()});function Fa(r,i){let e=r.interval_analysis,t=e?.weibull_beta,s=e?.weibull_eta;if(t==null||s==null||s<=0)return u;let a=r.interval_days??0,o=r.suggested_interval??a;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${n("weibull_reliability_curve",i)}
        ${ic(t,i)}
      </div>
      ${rc(t,s,a,o,i)}
      ${sc(e,i)}
      ${e?.confidence_interval_low!=null?nc(e,r,i):u}
    </div>
  `}function ic(r,i){let e,t,s;return r<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",s="beta_early_failures"):r<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",s="beta_random_failures"):r<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",s="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",s="beta_highly_predictable"),l`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${n(s,i)} (\u03B2=${I(r,i,2)})
    </span>
  `}function rc(r,i,e,t,s){let w=Math.max(e,t,i,1)*1.3,k=50,O=[];for(let M=0;M<=k;M++){let z=M/k*w,_t=1-Math.exp(-Math.pow(z/i,r)),mt=32+z/w*260,Oi=136-_t*128;O.push([mt,Oi])}let P=O.map(([M,z])=>`${A(M)},${A(z)}`).join(" "),q="M32,136 "+O.map(([M,z])=>`L${A(M)},${A(z)}`).join(" ")+` L${A(O[k][0])},136 Z`,B=32+e/w*260,W=1-Math.exp(-Math.pow(e/i,r)),x=136-W*128,le=I((1-W)*100,s,0),Re=32+t/w*260,fe=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_weibull",s)}">
        ${fe.map(M=>{let z=136-M*128;return Ke`
            <line x1="${32}" y1="${A(z)}" x2="${292}" y2="${A(z)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${M===.5?"4,3":u}" />
            <text x="${28}" y="${A(z+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${I(M*100,s,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(w/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(w)}</text>

        <path d="${q}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${P}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?Ke`
          <line x1="${A(B)}" y1="${8}" x2="${A(B)}" y2="${A(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${A(B)}" cy="${A(x)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${A(B+4)}" y="${A(x-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${le}%</text>
        `:u}

        ${t>0&&t!==e?Ke`
          <line x1="${A(Re)}" y1="${8}" x2="${A(Re)}" y2="${A(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:u}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${n("weibull_failure_probability",s)}</span>
      ${e>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${n("current_interval_marker",s)}</span>`:u}
      ${t>0&&t!==e?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${n("recommended_marker",s)}</span>`:u}
    </div>
  `}function sc(r,i){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${n("characteristic_life",i)}</span>
        <span class="weibull-info-value">${Math.round(r.weibull_eta)} ${n("days",i)}</span>
      </div>
      ${r.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${n("weibull_r_squared",i)}</span>
          <span class="weibull-info-value">${I(r.weibull_r_squared,i,3)}</span>
        </div>
      `:u}
    </div>
  `}function nc(r,i,e){let t=r.confidence_interval_low,s=r.confidence_interval_high,a=i.suggested_interval??i.interval_days??0,o=i.interval_days??0,c=Math.max(0,t-5),_=s+5-c,m=(t-c)/_*100,f=(s-t)/_*100,b=(a-c)/_*100,w=o>0?(o-c)/_*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${n("confidence_interval",e)}: ${a} ${n("days",e)} (${t}\u2013${s})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${A(m)}%;width:${A(f)}%"></div>
        ${w>=0?l`<div class="confidence-marker current" style="left:${A(w)}%"></div>`:u}
        <div class="confidence-marker recommended" style="left:${A(b)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${n("confidence_conservative",e)} (${t}${n("days",e).charAt(0)})</span>
        <span class="confidence-text high">${n("confidence_aggressive",e)} (${s}${n("days",e).charAt(0)})</span>
      </div>
    </div>
  `}var Ua=v(()=>{"use strict";C();T();Ur()});function Ba(r,i,e){let t=r.degradation_trend!=null&&r.degradation_trend!=="insufficient_data",s=r.days_until_threshold!=null,a=r.environmental_factor!=null&&r.environmental_factor!==1;if(!t&&!s&&!a)return u;let o=r.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":r.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${r.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${n("sensor_prediction_urgency",i).replace("{days}",String(Math.round(r.days_until_threshold||0)))}
        </div>
      `:u}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${n("sensor_prediction",i)}
      </div>
      <div class="prediction-grid">
        ${t?l`
          <div class="prediction-item">
            <ha-svg-icon path="${o}"></ha-svg-icon>
            <span class="prediction-label">${n("degradation_trend",i)}</span>
            <span class="prediction-value ${r.degradation_trend}">${n("trend_"+r.degradation_trend,i)}</span>
            ${r.degradation_rate!=null?l`<span class="prediction-rate">${r.degradation_rate>0?"+":""}${I(r.degradation_rate,i,Math.abs(r.degradation_rate)>=10?0:1)} ${r.trigger_entity_info?.unit_of_measurement||""}/${n("day_short",i)}</span>`:u}
          </div>
        `:u}
        ${s?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${n("days_until_threshold",i)}</span>
            <span class="prediction-value prediction-days${r.days_until_threshold===0?" exceeded":r.sensor_prediction_urgency?" urgent":""}">${r.days_until_threshold===0?n("threshold_exceeded",i):"~"+Math.round(r.days_until_threshold)+" "+n("days",i)}</span>
            ${r.threshold_prediction_date?l`<span class="prediction-date">${L(r.threshold_prediction_date,i)}</span>`:u}
            ${r.threshold_prediction_confidence?l`<span class="confidence-dot ${r.threshold_prediction_confidence}"></span>`:u}
            ${(r.prediction_cycles??0)>0?l`<span class="prediction-cycles">${n("prediction_cycles",i)}: ${r.prediction_cycles}</span>`:u}
          </div>
        `:u}
        ${a&&e.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${n("environmental_adjustment",i)}</span>
            <span class="prediction-value">${I(r.environmental_factor,i,2)}x</span>
            ${r.environmental_entity?l`<span class="prediction-entity entity-link" @click=${c=>sn(c,r.environmental_entity)}>${r.environmental_entity}</span>`:u}
          </div>
        `:u}
      </div>
    </div>
  `}var Wa=v(()=>{"use strict";C();T()});function Va(r,i,e,t){let s=Math.max(r||1,i);return l`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${n("current",t)}: ${r??"\u2014"} ${r!=null?n("days",t):""}
        </div>
        <div class="interval-visual current"
          style="width: ${r!=null?Math.min(r/s*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${n("recommended",t)}: ${i} ${n("days",t)}
          <span class="confidence-badge ${e}">${n(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(i/s*100,100)}%"></div>
      </div>
    </div>
  `}var Ga=v(()=>{"use strict";C();T()});function Ya(){return Number(pe().slice(5,7))-1}function Qa(r,i,e){if(!e.seasonal||!r.seasonal_factor||r.seasonal_factor===1)return u;let t=Ka.map(c=>n(c,i)),s=Ya(),a=r.seasonal_factors||r.interval_analysis?.seasonal_factors||null,o=a&&a.length===12?a:t.map((c,p)=>{let _=r.seasonal_factor||1,m=Math.sin((p-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,_+m))});return l`
    <div class="seasonal-card-compact">
      <h4>${n("seasonal_awareness",i)}</h4>
      <div class="seasonal-mini-chart">
        ${o.map((c,p)=>{let _=c*40,m=c<.9?"low":c>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${m} ${p===s?"current":""}"
                 style="height: ${_}px"
                 title="${t[p]}: ${I(c,i,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${n("shorter",i)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${n("normal",i)}</span>
        <span class="legend-item"><span class="dot high"></span> ${n("longer",i)}</span>
      </div>
    </div>
  `}function Za(r,i){return ac(r,i)}function ac(r,i){let e=r.seasonal_factors??r.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return u;let t=r.interval_analysis?.seasonal_reason,s=Ya(),a=300,o=100,c=8,_=o-c-4,m=Math.max(...e,1.5),f=a/12,b=f*.65,w=c+_-1/m*_;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${n("seasonal_chart_title",i)}
        ${t?l`<span class="source-tag">${t==="learned"?n("seasonal_learned",i):n("seasonal_manual",i)}</span>`:u}
      </div>
      <svg viewBox="0 0 ${a} ${o}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_seasonal",i)}">
        <line x1="0" y1="${A(w)}" x2="${a}" y2="${A(w)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((k,O)=>{let P=k/m*_,q=O*f+(f-b)/2,B=c+_-P,W=O===s,x=k<1?"var(--success-color, #4caf50)":k>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return Ke`
            <rect x="${A(q)}" y="${A(B)}"
              width="${A(b)}" height="${A(P)}"
              fill="${x}" opacity="${W?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Ka.map((k,O)=>l`<span class="seasonal-label ${O===s?"active-month":""}">${n(k,i)}</span>`)}
      </div>
    </div>
  `}var Ka,Ja=v(()=>{"use strict";C();T();Ur();G();Ka=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"]});var H,Xa=v(()=>{"use strict";C();F();T();Te();va();$i();G();Ir();Cr();qr();ur();Ue();Mr();Ma();Fr();Ot();It();Ei();za();Ua();Wa();Ga();nt();mi();Ja();H=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1};this._toast="";this._toastTimer=new Hi;this._access=Be;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return N(this.hass)}async openFor(e,t){(e!==this._entryId||t!==this._taskId)&&(this._task=null),this._entryId=e,this._taskId=t,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=pe(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let e=await se(this.hass);this._features={...this._features,...e.features},this._access=e.access,this._currencySymbol=Fe(e.budget??void 0),ni(e.budget??void 0),this._partsCostMode=e.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(e,t){this._toast=e,this._toastTimer.schedule(()=>{this._toast=""},t)}async _loadTask(){let e=this._entryId,t=this._taskId;if(!e||!t)return;let s=++this._loadSeq,a="",o=await j(this,{type:"maintenance_supporter/object",entry_id:e},{onError:p=>{a=p}});if(s!==this._loadSeq)return;if(o===void 0){this._error=a;return}this._objectName=o?.object?.name||"";let c=(o?.tasks||[]).find(p=>p.id===t);this._task=c??null,this._taskRef=Na(o?.object,c),c||(this._error=n("ws_err_not_found",this._lang))}_runWs(e){return this._error="",j(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(oe(),_e)).then(async({openCompleteDialog:e})=>{let t=this._task,s=[];try{s=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}e(ba({entryId:this._entryId,taskId:this._taskId,taskName:t.name,task:t,objects:s,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:ya(e,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||Promise.resolve().then(()=>(oe(),_e)).then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(oe(),_e)).then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId||!await Ve(this.hass,{title:n("delete",this._lang),message:n("delete_task_confirm",this._lang),confirmText:n("delete",this._lang),danger:!0}))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(n("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._showToast(e?.recommended_interval?`${n("reanalyze_result",this._lang)}: ${ze(e.recommended_interval,"days",this._lang)} (${e.data_points} ${n("data_points",this._lang)})`:n("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(e){if(!this._entryId||!this._taskId)return;let t=pr(this._entryId,this._taskId,e,this._task);Promise.resolve().then(()=>(oe(),_e)).then(({openHistoryEditDialog:s})=>s(t))}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return u;let t=this._lang;return l`
      <div class="recommendation-card">
        <h4>${n("suggested_interval",t)}</h4>
        ${Va(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",t)}
        <div class="recommendation-actions">
          ${Ee(this.hass?.user,this._access)?l`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${n("apply_suggestion",t)}
              </button>`:u}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${n("reanalyze",t)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(e){let t=this._lang,s=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,a=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,o=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!s&&!a&&!o&&!c?l`<div class="adaptive-empty">
        ${n("adaptive_no_data",t)}
      </div>`:l`
      <div class="adaptive-stack">
        ${this._toast?l`<div class="toast">${this._toast}</div>`:u}
        ${s?this._renderRecommendation(e):u}
        ${a?Ba(e,t,this._features):u}
        ${o?Fa(e,t):u}
        ${c?l`
          ${Qa(e,t,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?Za(e,t):u}
        `:u}
      </div>
    `}_renderDetails(e){let t=this._lang,s=e.history||[],a=e.history_count??s.length,o=ja(s).slice(0,20);return l`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${n("times_performed",t)}</span>
            <span class="stat-value">${e.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${n("total_cost",t)}</span>
            <span class="stat-value">${Q(e.total_cost??0,this._currencySymbol,t)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${n("avg_duration",t)}</span>
            <span class="stat-value">${di(e.average_duration!=null?Math.round(e.average_duration):null,t)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${n("history",t)}</strong>
          <span class="history-count">${a}</span>
        </div>
        ${s.length===0?l`<div class="history-empty">${n("history_empty",t)}</div>`:l`
              <div class="history-list">
                ${o.map(c=>qa(c,{lang:t,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:Ee(this.hass?.user,this._access)?p=>this._onEditHistoryEntry(p):void 0,readingUnit:e.reading_unit,readingSlotDelta:(p,_)=>un(s,p,_),taskRef:this._taskRef},{compact:!0}))}
                ${a>o.length?l`<div class="history-more">… +${a-o.length} ${n("older_entries",t)}</div>`:u}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return u;let e=this._lang,t=this._task,s=Ee(this.hass?.user,this._access),a=!!t&&(!!t.archived||t.enabled===!1||t.status==="paused");return dt(()=>this.close(),l`
        ${t?l`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${Ni(t)}"></span>
                  <span class="task-name">${t.name}</span>
                  ${Da(t,e)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&Promise.resolve().then(()=>(oe(),_e)).then(({openObjectQuickActions:o})=>{o(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${t.next_due?l`<span><strong>${n("next_due",e)}:</strong> ${L(t.next_due,e)}</span>`:u}
                  ${t.last_performed?l`<span><strong>${n("last_performed",e)}:</strong> ${L(t.last_performed,e)}</span>`:u}
                  ${t.schedule?.kind&&!["manual","one_time"].includes(t.schedule.kind)||t.interval_days!=null?l`<span><strong>${n("interval",e)}:</strong> ${rn(t,e)}</span>`:u}
                  ${qt(t)?l`<span><strong>${n("phase_current",e)}:</strong> ${qt(t)}</span>`:u}
                </div>
                ${t.notes?l`<div class="notes-body">${Pi(t.notes)}</div>`:u}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:u}

              ${this._showSkip?l`
                    <div class="inline-form">
                      <ms-textfield label=${n("skip_reason",e)} .value=${this._skipReason}
                        @input=${o=>{this._skipReason=o.target.value}}></ms-textfield>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${n("cancel",e)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${n("skip",e)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?l`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${n("reset_to_date",e)}
                        .hass=${this.hass}
                        .lang=${e}
                        .value=${this._resetDate}
                        @value-changed=${o=>{this._resetDate=o.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${n("cancel",e)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${n("reset",e)}
                        </button>
                      </div>
                    </div>
                  `:this._showPostpone?l`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${n("postpone_date_prompt",e)}
                        .hass=${this.hass}
                        .lang=${e}
                        .value=${this._postponeDate}
                        @value-changed=${o=>{this._postponeDate=o.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showPostpone=!1}} ?disabled=${this._busy}>
                          ${n("cancel",e)}
                        </button>
                        <button class="btn primary qa-postpone-confirm" @click=${this._onPostponeConfirm}
                          ?disabled=${this._busy||!this._postponeDate}>
                          ${n("postpone",e)}
                        </button>
                      </div>
                    </div>
                  `:l`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${n("complete",e)}
                      </ha-button>
                      ${t.allow_skip!==!1?l`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${n("skip",e)}
                            </ha-button>
                          `:u}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${n("reset",e)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${s?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${n("edit",e)}
                          </ha-button>`:u}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${n("qr_code",e)}
                      </ha-button>
                      ${a?u:l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${n("postpone",e)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${n("snooze",e)}
                          </ha-button>`}
                      ${s?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${t.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${t.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${t.archived?n("unarchive",e):n("archive",e)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${n("delete",e)}
                          </ha-button>`:u}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?n("hide_details",e):n("show_details",e)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?l`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?n("hide_stats",e):n("show_stats",e)}
                          </button>`:u}
                    </div>
                    ${this._showDetails?this._renderDetails(t):u}
                    ${this._showAdaptive?this._renderAdaptive(t):u}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${n("open_in_panel",e)}
                      </button>
                    </div>
                  `}
            `:this._error?l`<div class="error">${this._error}</div>`:l`<div class="loading">${n("loading",e)}</div>`}
    `)}updated(e){e.has("_open")&&this._open&&pt(this.shadowRoot)}};H.styles=[ui,ct,$`
    :host { display: contents; --ms-modal-max-width: 460px; }
    .header { display: flex; flex-direction: column; gap: 6px; }
    .title { display: flex; align-items: center; gap: 10px; }
    .status-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .task-name { font-size: 18px; font-weight: 600; }
    .object { font-size: 13px; color: var(--secondary-text-color); }
    .link-inline {
      background: transparent; border: none; padding: 0; cursor: pointer;
      color: var(--primary-color); font-size: inherit; font-family: inherit;
    }
    .link-inline:hover { text-decoration: underline; }
    .quick-info {
      display: flex; flex-wrap: wrap; gap: 12px;
      font-size: 12px; color: var(--secondary-text-color);
      padding-top: 4px; border-top: 1px solid var(--divider-color);
    }
    .quick-info strong { color: var(--primary-text-color); font-weight: 500; }
    .actions { display: flex; gap: 8px; }
    .actions.primary-row { gap: 6px; }
    .actions.primary-row .btn { flex: 1; }
    .actions.primary-row ha-button { flex: 1; }
    /* Edit + QR are admin-tools — left-align as a group; Delete is destructive
       so it gets pushed to the far right with margin-left:auto for visual
       separation. Earlier this row was flex-end which left a strange empty
       gap on the left (user feedback). */
    .actions.secondary-row {
      padding-top: 8px; border-top: 1px solid var(--divider-color);
      justify-content: flex-start;
      /* 360 px: Edit + QR + Archive + Delete were 388 px in a 342 px row —
         Delete sat past the dialog edge (audit 2026-09-29). Wrap instead;
         Delete keeps its margin-left:auto on the second line. */
      flex-wrap: wrap;
      row-gap: 6px;
    }
    .actions.secondary-row .btn.danger,
    .actions.secondary-row ha-button.danger {
      margin-left: auto;
    }
    .actions.secondary-row ha-button { --ha-button-font-size: 13px; }
    .btn {
      padding: 8px 12px; font-size: 14px;
      border-radius: 6px; cursor: pointer;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
      font-weight: 500;
      display: inline-flex; align-items: center; gap: 6px;
      transition: background 0.12s;
    }
    .btn:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .btn[disabled] { opacity: 0.5; cursor: wait; }
    .btn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, white);
      border-color: var(--primary-color);
    }
    .btn.cancel { background: transparent; }
    .btn.ghost { padding: 6px 10px; font-size: 13px; }
    .btn.danger { color: var(--error-color); }
    .btn ha-icon { --mdc-icon-size: 18px; }
    .inline-form { display: flex; flex-direction: column; gap: 8px; }
    .notes-body {
      margin-top: 8px; padding: 8px; border-radius: 6px;
      background: var(--secondary-background-color);
      font-size: 13px; white-space: pre-wrap; word-break: break-word;
    }
    .notes-body ha-markdown { white-space: normal; }
    .inline-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .footer { display: flex; justify-content: center; padding-top: 4px; }
    .link {
      background: transparent; border: none; cursor: pointer;
      color: var(--primary-color); font-size: 13px;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .link:hover { text-decoration: underline; }
    .link ha-icon { --mdc-icon-size: 14px; }
    .loading { padding: 24px; text-align: center; color: var(--secondary-text-color); }
    .error {
      padding: 8px; border-radius: 6px;
      background: rgba(211,47,47,0.1);
      color: var(--error-color, #d32f2f); font-size: 13px;
    }

    /* Details (expandable Show details section) */
    .details-toggle { display: flex; justify-content: center; margin-top: 4px; }
    .details {
      display: flex; flex-direction: column; gap: 12px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .stats-grid {
      display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;
    }
    .stat {
      display: flex; flex-direction: column; gap: 2px;
      background: var(--secondary-background-color, rgba(255,255,255,0.04));
      padding: 8px; border-radius: 6px;
      align-items: center;
    }
    .stat-label { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 16px; font-weight: 600; }
    .history-header {
      display: flex; align-items: baseline; gap: 8px;
      font-size: 14px;
    }
    .history-count {
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .history-empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; }
    /* The rows themselves are the shared renderer's (.history-entry.compact
       + the history-* classes from sharedStyles); only the list chrome is
       local. */
    .history-list { display: flex; flex-direction: column; max-height: 280px; overflow: auto; }
    .history-list .history-entry {
      padding: 6px 8px; border-radius: 6px; border-bottom: none; margin-bottom: 6px;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
    }
    .history-list .history-date { font-size: 11px; }
    .history-list .history-details { font-size: 11px; }
    .history-more { padding: 8px; text-align: center; font-size: 12px; color: var(--secondary-text-color); font-style: italic; }

    /* Adaptive section — wraps the panel renderers (which assume sharedStyles
       are present) and adds dialog-specific layout. */
    .adaptive-stack {
      display: flex; flex-direction: column; gap: 12px;
      border-top: 1px solid var(--divider-color);
      padding-top: 12px;
    }
    .adaptive-empty {
      padding: 16px; text-align: center;
      color: var(--secondary-text-color);
      font-style: italic; font-size: 13px;
      border-top: 1px solid var(--divider-color);
    }
    .toast {
      padding: 8px 12px; border-radius: 6px;
      background: rgba(76, 175, 80, 0.15);
      color: var(--success-color, #4caf50); font-size: 13px; font-weight: 500;
    }
    /* The panel's card look (panel-styles.ts is not in this shadow root, so
       the card and its heading rendered bare). */
    .recommendation-card {
      padding: 16px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .recommendation-card h4 { margin: 0 0 12px; font-size: 14px; }
    /* The panel's recommendation-card uses ha-button. We use plain <button>
       in this dialog's button styles. Re-style the action row to match. */
    .recommendation-actions {
      display: flex; gap: 8px; margin-top: 8px;
    }
    /* Constrain SVG charts so they fit the dialog width even on mobile. */
    .weibull-section, .seasonal-card-compact { max-width: 100%; }
    .weibull-chart svg { max-width: 100%; height: auto; }
    .details-toggle { gap: 12px; flex-wrap: wrap; }
  `],d([y({attribute:!1})],H.prototype,"hass",2),d([h()],H.prototype,"_open",2),d([h()],H.prototype,"_entryId",2),d([h()],H.prototype,"_taskId",2),d([h()],H.prototype,"_task",2),d([h()],H.prototype,"_objectName",2),d([h()],H.prototype,"_taskRef",2),d([h()],H.prototype,"_busy",2),d([h()],H.prototype,"_error",2),d([h()],H.prototype,"_showSkip",2),d([h()],H.prototype,"_showReset",2),d([h()],H.prototype,"_showPostpone",2),d([h()],H.prototype,"_showDetails",2),d([h()],H.prototype,"_showAdaptive",2),d([h()],H.prototype,"_skipReason",2),d([h()],H.prototype,"_resetDate",2),d([h()],H.prototype,"_postponeDate",2),d([h()],H.prototype,"_features",2),d([h()],H.prototype,"_toast",2),d([h()],H.prototype,"_access",2),d([h()],H.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",H)});var eo=v(()=>{"use strict";Ct();Ze();G()});function to(r,i,e){return r&&i?.[r]?.name||e}var io=v(()=>{"use strict";G();eo();Dr()});function ro(r){if(r.key!=="Enter"&&r.key!==" ")return;let e=r.target?.closest?.('[role="menuitem"], [role="button"]');!e||e.getAttribute("aria-disabled")==="true"||(r.preventDefault(),e.click())}var so=v(()=>{"use strict"});var ne,no=v(()=>{"use strict";C();Or();qr();F();T();io();Te();Fr();Ot();It();Ei();$i();so();ne=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=Be;this._loadSeq=0}get _lang(){return N(this.hass)}async openFor(e){e!==this._entryId&&(this._data=null),this._entryId=e,this._error="",this._open=!0,await Promise.all([this._load(),se(this.hass).then(t=>{this._access=t.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let e=this._entryId;if(!e)return;let t=++this._loadSeq,s="",a=await j(this,{type:"maintenance_supporter/object",entry_id:e},{onError:o=>{s=o}});t===this._loadSeq&&(a===void 0?this._error=s:this._data=a)}_runWs(e){return this._error="",j(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_onEditObject(){!this._entryId||!this._data||Promise.resolve().then(()=>(oe(),_e)).then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&Promise.resolve().then(()=>(oe(),_e)).then(({openCreateTaskDialog:e})=>{e(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await Ve(this.hass,{title:n("delete",this._lang),message:n("delete_object_confirm",this._lang),confirmText:n("delete",this._lang),danger:!0}))return;let t=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let e=!!this._data.object.archived;if(!e&&!await Ve(this.hass,{title:n("archive_object",this._lang),message:n("confirm_archive_object",this._lang),confirmText:n("archive_object",this._lang)}))return;let t=this._entryId;await this._runWs({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}_onTaskClick(e){this._entryId&&Promise.resolve().then(()=>(oe(),_e)).then(({openTaskQuickActions:t})=>{t(this._entryId,e)})}render(){if(!this._open)return u;let e=this._lang,t=this._data,s=t?.object,a=t?.tasks||[],o=Ee(this.hass?.user,this._access);return dt(()=>this.close(),l`
        ${t&&s?l`
              <div class="header">
                <div class="title">${s.name}</div>
                ${this._renderMetaRow(s)}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:u}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${n("tasks",e)}</strong>
                  <span class="count">${a.length}</span>
                </div>
                ${a.length===0?l`<div class="empty">${n("no_tasks",e)}</div>`:l`
                      <div class="task-list">
                        ${a.map(c=>l`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(c.id)} @keydown=${ro}>
                            <span class="status-dot" style="background: ${Ni(c)}"></span>
                            <span class="task-name">${c.name}</span>
                            <span class="task-status ${Dt(c)}">${zr(Dt(c),e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${s.notes?l`
                    <div class="notes-section">
                      <strong>${n("object_notes_label",e)}</strong>
                      <div class="notes-body">${Pi(s.notes)}</div>
                    </div>
                  `:u}

              ${o?l`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${n("add_task",e)}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${n("edit",e)}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${s.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${s.archived?n("unarchive_object",e):n("archive_object",e)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${n("delete",e)}
                      </button>
                    </div>
                  `:u}
            `:this._error?l`<div class="error">${this._error}</div>`:l`<div class="loading">${n("loading",e)}</div>`}
    `)}updated(e){e.has("_open")&&this._open&&pt(this.shadowRoot)}_renderMetaRow(e){let t=this._lang,s=[];return e.area_id&&s.push([n("area",t),to(e.area_id,this.hass?.areas,n("no_area",t))]),e.manufacturer&&s.push([n("manufacturer",t),e.manufacturer]),e.model&&s.push([n("model",t),e.model]),e.serial_number&&s.push([n("serial_number_label",t),e.serial_number]),e.installation_date&&s.push([n("installed",t),L(e.installation_date,t)]),e.warranty_expiry&&s.push([n("warranty",t),L(e.warranty_expiry,t)]),e.documentation_url&&s.push([n("documentation_url_label",t),e.documentation_url,Ii(e.documentation_url)]),s.length===0?u:l`
      <div class="meta">
        ${s.map(([a,o,c])=>l`
            <div class="meta-item">
              <span class="meta-label">${a}</span>
              <span class="meta-value">${c||Ia(o)?l`<a href="${o}" target="_blank" rel="noopener noreferrer">${o}</a>`:o}</span>
            </div>
          `)}
      </div>
    `}};ne.styles=[ct,$`
    :host { display: contents; }
    .header { display: flex; flex-direction: column; gap: 6px; }
    .title { font-size: 20px; font-weight: 600; }
    .meta { display: flex; flex-direction: column; gap: 4px; padding-top: 4px; border-top: 1px solid var(--divider-color); }
    .meta-item { display: flex; gap: 8px; font-size: 12px; }
    .meta-label { color: var(--secondary-text-color); min-width: 100px; }
    .meta-value { color: var(--primary-text-color); flex: 1; word-break: break-word; }
    .meta-value a { color: var(--primary-color); }
    .tasks-section, .notes-section { display: flex; flex-direction: column; gap: 6px; }
    .section-header { display: flex; align-items: baseline; gap: 8px; }
    .count {
      font-size: 11px; color: var(--secondary-text-color);
      background: var(--secondary-background-color); padding: 2px 8px; border-radius: 999px;
    }
    .empty { color: var(--secondary-text-color); font-style: italic; font-size: 13px; padding: 8px 0; }
    .task-list { display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow: auto; }
    .task-row {
      display: flex; align-items: center; gap: 10px;
      padding: 8px; border-radius: 6px; cursor: pointer;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      transition: background 0.12s;
    }
    .task-row:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .task-row:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .task-name { flex: 1; font-size: 14px; }
    .task-status { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; }
    .notes-body { white-space: pre-wrap; font-size: 13px; padding: 8px; background: var(--secondary-background-color); border-radius: 6px; }
    .notes-body ha-markdown { white-space: normal; }
    .actions { display: flex; gap: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color); }
    .actions .btn { flex: 1; }
    .btn {
      padding: 8px; font-size: 13px; border-radius: 6px; cursor: pointer;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color); font-weight: 500;
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    }
    .btn:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .btn[disabled] { opacity: 0.5; cursor: wait; }
    .btn.primary { background: var(--primary-color); color: var(--text-primary-color, white); border-color: var(--primary-color); }
    .btn.danger { color: var(--error-color); }
    .btn ha-icon { --mdc-icon-size: 16px; }
    .loading { padding: 24px; text-align: center; color: var(--secondary-text-color); }
    .error { padding: 8px; border-radius: 6px; background: rgba(211,47,47,0.1); color: var(--error-color); font-size: 13px; }
  `],d([y({attribute:!1})],ne.prototype,"hass",2),d([h()],ne.prototype,"_open",2),d([h()],ne.prototype,"_entryId",2),d([h()],ne.prototype,"_data",2),d([h()],ne.prototype,"_busy",2),d([h()],ne.prototype,"_error",2),d([h()],ne.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",ne)});async function lc(r,i,e,t){let s="",a=await j({hass:r},{type:"maintenance_supporter/task/undo",entry_id:i,task_id:e},{lang:t,onError:(o,c)=>{let p=oc[c?.code??""];s=p?n(p,t):o}});return a===void 0?{ok:!1,message:s}:{ok:!0,message:n(a?.action_ran?"undo_done_action_ran":"undo_done",t)}}function ao(r,i,e,t,s){let a=(o,c)=>r.dispatchEvent(new CustomEvent("hass-notification",{detail:c?{message:o,action:c,duration:1e4}:{message:o},bubbles:!0,composed:!0}));a(n("task_completed_named",t).replace("{task}",e.taskName),{text:n("undo",t),action:()=>{lc(i,e.entryId,e.taskId,t).then(o=>{a(o.message),o.ok&&s()})}})}var oc,oo=v(()=>{"use strict";T();Te();oc={changed_since:"undo_changed",nothing_to_undo:"undo_nothing"}});var _e={};mo(_e,{__resetSettingsCacheForTests:()=>gc,getRowActionStyle:()=>mc,openCompleteDialog:()=>xc,openCreateObjectDialog:()=>fc,openCreateTaskDialog:()=>vc,openEditObjectDialog:()=>yc,openEditTaskDialog:()=>bc,openHistoryEditDialog:()=>Br,openObjectQuickActions:()=>kc,openQrDialog:()=>wc,openTaskQuickActions:()=>Wr});function ut(){return document.querySelector("home-assistant")?.hass}function _c(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function me(r){let i=_c(),e=i.querySelector(r)??document.body.querySelector(r);return e?e.parentNode!==i&&i.appendChild(e):(e=document.createElement(r),i.appendChild(e)),e}function ge(r){let i=ut();if(!i)return!1;r.hass=i;let e=N(i);return ue(e)||De(e).then(()=>{r.requestUpdate?.()}),lr(i.locale,i.config?.country,i.config?.time_zone),!0}function mc(r){return se(r).then(i=>i.rowActionStyle)}function gc(){bn()}function fc(){let r=me(lo);return ge(r)?(r.openCreate(),po(r),!0):!1}async function po(r){let i=ut();i&&(r.placesEnabled=(await se(i)).features.places)}function yc(r,i){let e=me(lo);return ge(e)?(e.openEdit(r,i),po(e),!0):!1}function vc(r="",i){let e=me(co);if(!ge(e))return!1;let t=ut();return t?((async()=>{let s=await se(t),a=e;uo(a,s),a.openCreate(r,i)})(),!0):!1}function uo(r,i){r.checklistsEnabled=i.features.checklists,r.scheduleTimeEnabled=i.features.schedule_time,r.completionActionsEnabled=i.features.completion_actions,r.adaptiveFeature=i.features.adaptive,r.seasonalFeature=i.features.seasonal,r.environmentalFeature=i.features.environmental,r.defaultWarningDays=i.defaultWarningDays}function bc(r,i){let e=me(co);if(!ge(e))return!1;let t=ut();return t?((async()=>{try{let[s,a]=await Promise.all([t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:r}),se(t)]),o=(s.tasks||[]).find(p=>p.id===i);if(!o){console.warn(`openEditTaskDialog: task ${i} not found in entry ${r}`);return}let c=e;uo(c,a),await c.openEdit(r,o)}catch(s){console.warn("openEditTaskDialog: failed to load task/features",s)}})(),!0):!1}function Br(r){let i=me(cc);return ge(i)?(i.openEdit(r),!0):!1}function xc(r){let i=me(dc);if(!ge(i))return!1;let e=i;return e.__msUndoWired||(e.__msUndoWired=!0,i.addEventListener("task-completed",t=>{let s=t.detail,a=ut();s?.undo&&a&&ao(i,a,s,N(a),()=>{})})),xa(i,r,N(ut())),!0}function wc(r){let i=me(pc);return ge(i)?(i.openForTask(r.entry_id,r.task_id,r.object_name,r.task_name),!0):!1}function Wr(r,i){let e=me(uc);return ge(e)?(e.openFor(r,i),!0):!1}function kc(r){let i=me(hc);return ge(i)?(i.openFor(r),!0):!1}var lo,co,cc,dc,pc,uc,hc,oe=v(()=>{"use strict";Sn();Kn();la();ma();fa();Xa();no();oo();T();Ir();Ot();lo="maintenance-object-dialog",co="maintenance-task-dialog",cc="maintenance-history-edit-dialog",dc="maintenance-complete-dialog",pc="maintenance-qr-dialog",uc="maintenance-task-quick-actions-dialog",hc="maintenance-object-quick-actions-dialog"});C();F();Ze();var Co={days:1,weeks:7,months:30.4368,years:365.25};function ks(r,i){return!r||r<=0?0:r*(Co[i||"days"]??1)}Je();function Ro(r){return r.responsible_user_id?[r.responsible_user_id]:[...new Set((r.assignee_pool||[]).filter(i=>typeof i=="string"&&i))]}function Yi(r,i){return!!i&&Ro(r).includes(i)}G();var Hs=5;function jo(r,i){let e=[];for(let t=0;t<i;t++)e.push(qe(r,t));return e}function qo(r){if(!r||r.length===0)return null;let i=r.map(e=>$t(e)).filter(e=>e!==null&&e>=0);return i.length===0?null:i.reduce((e,t)=>e+t,0)/i.length}function Mo(r){let{windowStart:i,windowEnd:e,task:t,entryId:s,objectName:a}=r,o=[],c=(f,b)=>({date:f,entry_id:s,task_id:t.id,task_name:t.name,object_name:a,status:b&&(t.status==="overdue"||t.status==="triggered")?"ok":t.status,days_until_due:b?null:t.days_until_due??null,projected:b,schedule_type:t.schedule_type,interval_days:t.interval_days??null,interval_unit:t.interval_unit??null,responsible_user_id:t.responsible_user_id??null,avg_cost:qo(t.history),adaptive_enabled:!!t.adaptive_config?.enabled,prediction_confidence:t.threshold_prediction_confidence??null}),p=Math.max(1,Math.round(ks(t.interval_days,t.interval_unit)));if(t.status==="overdue"||t.status==="triggered"){if(o.push(c(i,!1)),t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let f=qe(i,p),b=1;for(;f<=e&&b<Hs;)o.push(c(f,!0)),b++,f=qe(f,p)}return o}let _=t.next_due;if(typeof _!="string"||!_)return o;let m=_.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(m))return o;if(m>=i&&m<=e)o.push(c(m,!1));else if(m>e)return o;if(t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let f=qe(m,p),b=o.length;for(;f<=e&&b<Hs;)f>=i&&(o.push(c(f,!0)),b++),f=qe(f,p)}return o}function Os(r,i,e,t=null){let s=jo(i,e),a=s[0],o=s[s.length-1],c=[];for(let _ of r){let m=_.object?.name||"",f=_.entry_id,b=_.tasks||[];for(let w of b){if(t&&!Yi(w,t)||w.enabled===!1)continue;let k=Mo({windowStart:a,windowEnd:o,task:w,entryId:f,objectName:m});c.push(...k)}}let p=new Map;for(let _ of s)p.set(_,[]);for(let _ of c){let m=p.get(_.date);m&&m.push(_)}for(let[,_]of p)_.sort((m,f)=>{let b=Ki(m.status),w=Ki(f.status);if(b!==w)return b-w;if(m.projected!==f.projected)return m.projected?1:-1;let k=m.object_name.localeCompare(f.object_name);return k!==0?k:m.task_name.localeCompare(f.task_name)});return s.map(_=>({date:_,events:p.get(_)??[]}))}var Do={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok"};function ri(r,i){return`${r}/${i}`}function Ls(r,i,e){let t=js(i,e)[0],s=[];for(let a of r)for(let o of a.tasks||[]){let c=o.history||[],p=o.history_count??c.length;if(p<=c.length)continue;let _=c.map(b=>Xe(b?.timestamp)).filter(b=>!!b),m=_.length?_.reduce((b,w)=>b<w?b:w):"";if(m&&m<t)continue;let f=ri(a.entry_id,o.id);s.push({entryId:a.entry_id,taskId:o.id,key:f,sig:`${f}:${p}:${zo(JSON.stringify(c))}`})}return s}function zo(r){let i=2166136261;for(let e=0;e<r.length;e++)i^=r.charCodeAt(e),i=Math.imul(i,16777619);return(i>>>0).toString(36)}function js(r,i){let e=[];for(let t=i-1;t>=0;t--)e.push(qe(r,-t));return e}function qs(r,i,e,t=null,s={}){let a=js(i,e),o=a[0],c=a[a.length-1],p=new Map;for(let m of a)p.set(m,[]);for(let m of r){let f=m.object?.name||"",b=m.entry_id,w=m.tasks||[];for(let k of w){if(t&&!Yi(k,t))continue;let O=s[ri(b,k.id)]??(k.history||[]);for(let P of O){if(typeof P?.timestamp!="string")continue;let q=Xe(P.timestamp);if(!q||q<o||q>c)continue;let B=p.get(q);if(!B)continue;let W=P.type??"completed";B.push({date:q,entry_id:b,task_id:k.id,task_name:k.name,object_name:f,status:Do[W]??"ok",days_until_due:null,projected:!1,schedule_type:k.schedule_type,interval_days:k.interval_days??null,responsible_user_id:k.responsible_user_id??null,avg_cost:$t(P),adaptive_enabled:!!k.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:P.timestamp,history_type:W,history_cost:$t(P),history_notes:typeof P.notes=="string"?P.notes:null,history_duration:typeof P.duration=="number"?P.duration:null})}}}let _={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,m]of p)m.sort((f,b)=>{let w=_[f.history_type??""]??99,k=_[b.history_type??""]??99;if(w!==k)return w-k;let O=f.object_name.localeCompare(b.object_name);return O!==0?O:f.task_name.localeCompare(b.task_name)});return a.map(m=>({date:m,events:p.get(m)??[]}))}G();C();var Ms=$`
  .cal-controls {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    padding: 12px 16px;
    border-bottom: 1px solid var(--divider-color);
  }
  .cal-window-chips {
    display: flex;
    gap: 4px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border-radius: 999px;
    padding: 3px;
  }
  .cal-window-chip {
    padding: 6px 14px;
    border: none;
    background: transparent;
    color: var(--secondary-text-color);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 999px;
    transition: background 0.12s, color 0.12s;
  }
  .cal-window-chip:hover { color: var(--primary-text-color); }
  .cal-window-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  /* v2.2.0 — past-window chips: visually distinguished from forward chips
     so the user grasps the time-direction switch at a glance. Uses a
     muted secondary tone instead of the primary blue. v2.3.x: explicit
     "−N d" / "+N d" prefixes + dot separator so past vs forward groups
     read at a glance instead of being two pill rows that look identical
     except for a small arrow. (User feedback: *"das −30 und die + sind
     noch schlecht angeordnet"*.) */
  .cal-past-chips {
    /* margin-right replaced by explicit separator below */
  }
  .cal-past-chip.active {
    background: var(--secondary-text-color, #888);
  }
  .cal-chip-separator {
    color: var(--divider-color);
    font-size: 8px;
    align-self: center;
    margin: 0 2px;
    line-height: 1;
  }
  .cal-user-filter {
    margin-left: auto;
    padding: 6px 10px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
  }
  .cal-rolling { padding: 8px 16px 32px; }
  .cal-day-row {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--divider-color);
  }
  .cal-day-pill {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border: 1px solid var(--divider-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cal-day-pill.cal-today {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }
  .cal-pill-weekday {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: var(--secondary-text-color);
  }
  .cal-pill-day {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-text-color);
    line-height: 1.1;
  }
  .cal-day-pill.cal-today .cal-pill-weekday,
  .cal-day-pill.cal-today .cal-pill-day {
    color: var(--text-primary-color, #fff);
  }
  .cal-day-content { flex: 1; min-width: 0; }
  .cal-day-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 6px;
  }
  .cal-day-month { color: var(--secondary-text-color); font-size: 13px; }
  .cal-day-today-badge {
    color: var(--primary-color);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .cal-empty {
    color: var(--secondary-text-color);
    font-size: 13px;
    font-style: italic;
    padding: 4px 0 4px;
  }
  .cal-event {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.12s;
  }
  .cal-event:hover { background: var(--state-icon-color, rgba(255,255,255,0.04)); }
  .cal-event-projected { opacity: 0.55; }
  .cal-event-body { flex: 1; min-width: 0; }
  .cal-event-title {
    font-size: 14px;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cal-event-recur {
    display: block;
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }
  .cal-event-icon {
    --mdc-icon-size: 18px;
    flex-shrink: 0;
  }
  .cal-source-time   { color: var(--secondary-text-color); }
  .cal-source-sensor { color: var(--primary-color); }
  .cal-event-prediction {
    display: inline-block;
    font-size: 11px;
    margin-top: 2px;
    padding: 1px 6px;
    border-radius: 999px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border: 1px solid var(--divider-color);
  }
  .cal-conf-high   { color: var(--success-color, #4caf50); border-color: #4caf5044; }
  .cal-conf-medium { color: var(--warning-color, #f9a825); border-color: #f9a82544; }
  .cal-conf-low    { color: var(--error-color, #d32f2f); border-color: #d32f2f44; }
  .cal-event-cost {
    font-size: 12px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }
  .cal-status-pill {
    flex-shrink: 0;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #fff;
  }
  /* Same tokens as .status-badge (status-constants.ts) — the calendar used
     to keep its own palette (triggered was even BLUE here) so identical
     statuses wore different colors per view, and none followed the theme. */
  .cal-status-overdue   { background: var(--error-color, #f44336); }
  .cal-status-triggered { background: var(--deep-orange-color, #ff5722); }
  .cal-status-due_soon  { background: var(--warning-color, #ff9800); color: #000; }
  /* Dark text — white on green is only 2.8:1 (below the 3:1 UI floor). */
  .cal-status-ok        { background: var(--success-color, #4caf50); color: #000; }

  @media (max-width: 600px) {
    .cal-controls { padding: 10px 12px; }
    .cal-rolling { padding: 6px 12px 24px; }
    .cal-day-pill { width: 48px; height: 48px; }
    .cal-pill-day { font-size: 17px; }
    .cal-user-filter { margin-left: 0; width: 100%; }
  }
`;T();function an(r){let i=window;i.customCards=i.customCards||[],i.customCards.some(e=>e.type===r.type)||i.customCards.push(r)}function on(r,i,e=t=>import(t)){let t=window,s;try{let m=new URL(i);s=m.origin+m.pathname}catch{return}let a=`__msCardHeal:${r[0]}:${s}`;if(t[a])return;t[a]=!0;let o=0,c=0,p=!1,_=()=>{if(o+=1,r.some(f=>!customElements.get(f))&&c<3&&!p){c+=1,p=!0;try{let f=new URL(i);f.searchParams.set("heal",`${Date.now()}`),e(f.href).catch(()=>{}).finally(()=>{p=!1})}catch{return}}o<20&&window.setTimeout(_,o<8?500:2e3)};window.setTimeout(_,250)}ur();It();Ot();oe();Je();dr();var Y=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._pastHistory={};this._pastHistorySig="";this._pastSeq=0;this._dataLoaded=!1;this._lastConnection=null;this._onHistorySaved=e=>{let t=e.detail;!t?.entry_id||!t.task_id||!(ri(t.entry_id,t.task_id)in this._pastHistory)||(this._pastHistorySig="",this._loadPastHistories())};this._subGen=0}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(e){if(this._config={...e},this._windowDays=e.window_days&&[7,14,30,365].includes(e.window_days)?e.window_days:30,this._pastDays=e.past_days&&[30,90].includes(e.past_days)?e.past_days:0,this._userFilter=typeof e.user_filter=="string"?e.user_filter:"",typeof e.object_filter=="string")this._objectFilter=e.object_filter,this._configuredObjects=[];else if(Array.isArray(e.object_filter)){let t=e.object_filter.filter(s=>typeof s=="string"&&s!=="");this._objectFilter=t.length===1?t[0]:"",this._configuredObjects=t.length>1?t:[]}else this._objectFilter="",this._configuredObjects=[]}getCardSize(){return 6}get _lang(){return N(this.hass)}connectedCallback(){super.connectedCallback(),window.addEventListener("history-entry-saved",this._onHistorySaved)}disconnectedCallback(){if(super.disconnectedCallback(),this._subGen++,window.removeEventListener("history-entry-saved",this._onHistorySaved),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(e){if(super.updated(e),Gs(this,e),this.hass&&this._pastDays>0&&(e.has("_objects")||e.has("_pastDays"))&&this._loadPastHistories(),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=e.objects,this._stats=t,ni(this._stats.budget)}catch{}}async _loadPastHistories(){let e=Ls(this._objects,pe(),this._pastDays||30),t=e.map(o=>o.sig).join("|");if(t===this._pastHistorySig)return;this._pastHistorySig=t;let s=++this._pastSeq,a=await Promise.all(e.map(async o=>{try{let c=await hi(this.hass,o.entryId,o.taskId);return c?[o.key,c]:null}catch{return null}}));s===this._pastSeq&&(this._pastHistory=Object.fromEntries(a.filter(o=>o!==null)))}async _subscribe(){let e=++this._subGen;try{let t=await this.hass.connection.subscribeMessage(s=>{let a=s;this._objects=a.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected||e!==this._subGen){t();return}this._unsub=t}catch{}}_onEventClick(e){if(e.history_timestamp&&ei.includes(String(e.history_type||"completed"))){this._openHistoryEntry(e);return}this._openTask(e)}_openTask(e){let t=new CustomEvent("maintenance-supporter-open-task",{detail:{entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(t)&&(Wr(e.entry_id,e.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0})))}async _openHistoryEntry(e){try{let t=await se(this.hass);if(!Ee(this.hass?.user,t.access)){this._openTask(e);return}}catch{}try{let t=await mn(this.hass,e.entry_id,e.task_id,e.history_timestamp);if(!t||Br(t))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:e.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return u;let e=this._lang,t=this._config.show_window_chips!==!1,s=this._config.show_user_filter!==!1,a=this._config.title,o=null;this._userFilter&&(o=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let c=x=>{let le=x.toLowerCase();return this._objects.find(fe=>fe.entry_id===x||fe.object.name.toLowerCase()===le)?.entry_id??null},p=new Set(this._configuredObjects.map(c).filter(x=>x!==null)),_=p.size?this._objects.filter(x=>p.has(x.entry_id)):this._objects,m=this._config.show_object_filter!==!1&&_.length>1,f=this._objectFilter?c(this._objectFilter):null,b=f&&_.some(x=>x.entry_id===f)?_.filter(x=>x.entry_id===f):_,w=pe(),k=this._pastDays>0,O=k?qs(b,w,this._pastDays,o,this._pastHistory):Os(b,w,this._windowDays,o),P=this._windowDays===365||k,q=P?O.filter(x=>x.events.length>0):O,B=x=>{let le=`cal-status-${x.status}`,Re=x.projected?"cal-event-projected":"",fe=x.status==="overdue"&&x.days_until_due!=null?` (${Xs(x.days_until_due,e)})`:"",M=x.projected&&x.interval_days?l`<span class="cal-event-recur">${x.interval_unit&&x.interval_unit!=="days"?ze(x.interval_days,x.interval_unit,e):x.interval_days===1?n("cal_every_day",e):n("cal_every_n_days",e).replace("{n}",String(x.interval_days))}</span>`:u,z=x.schedule_type==="sensor_based",_t=z?l`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${n("cal_source_sensor",e)}" icon="mdi:trending-up"></ha-icon>`:l`<ha-icon class="cal-event-icon cal-source-time"
                title="${x.adaptive_enabled?n("cal_source_time_adaptive",e):n("cal_source_time",e)}"
                icon="${x.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,mt=z&&x.prediction_confidence&&x.status!=="triggered"&&!x.projected?l`<span class="cal-event-prediction cal-conf-${x.prediction_confidence}">
            ${n("cal_predicted",e)} · ${n(`cal_confidence_${x.prediction_confidence}`,e)}
          </span>`:u,Oi=Fe(this._stats?.budget),ho=x.history_type?n(x.history_type,e):n(x.status,e);return l`
        <div class="cal-event ${Re}"
          @click=${()=>this._onEventClick(x)}>
          ${_t}
          <span class="cal-status-pill ${le}">${ho}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${x.object_name} · ${x.task_name}${fe}</div>
            ${mt}
            ${M}
          </div>
          ${x.avg_cost!=null&&x.avg_cost!==0?l`<span class="cal-event-cost">${Q(x.avg_cost,Oi,e)}</span>`:u}
        </div>
      `},W=x=>{let[le,Re,fe]=x.date.split("-").map(Number),M=new Date(le,Re-1,fe),z=x.date===w,_t=en(M,e,"short"),mt=tn(M,e,"long");return l`
        <div class="cal-day-row">
          <div class="cal-day-pill ${z?"cal-today":""}">
            <span class="cal-pill-weekday">${_t}</span>
            <span class="cal-pill-day">${M.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${mt}</span>
              ${z?l`<span class="cal-day-today-badge">${n("today",e)}</span>`:u}
            </div>
            ${x.events.length===0?l`<div class="cal-empty">${n("cal_no_events",e)}</div>`:x.events.map(B)}
          </div>
        </div>
      `};return l`
      <ha-card .header=${a}>
        ${t||s||m?l`
              <div class="cal-controls">
                ${t?l`
                      <div class="cal-window-chips cal-past-chips" title="${n("cal_past_windows",e)}">
                        ${[30,90].map(x=>l`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===x?"active":""}"
                            @click=${()=>{this._pastDays=x}}>
                            −${x}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${n("cal_forward_windows",e)}">
                        ${[7,14,30,365].map(x=>l`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===x?"active":""}"
                            @click=${()=>{this._windowDays=x,this._pastDays=0}}>
                            ${x===365?"+1y":`+${x}d`}
                          </button>
                        `)}
                      </div>
                    `:u}
                ${s?l`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${x=>{this._userFilter=x.target.value}}>
                        <option value="">${n("all_users",e)}</option>
                        <option value="current_user">${n("my_tasks",e)}</option>
                      </select>
                    `:u}
                ${m?l`
                      <select class="cal-user-filter"
                        .value=${f??""}
                        @change=${x=>{this._objectFilter=x.target.value}}>
                        <option value="">${n("all_objects",e)}</option>
                        ${[..._].sort((x,le)=>x.object.name.localeCompare(le.object.name)).map(x=>l`<option value=${x.entry_id} ?selected=${x.entry_id===f}>${x.object.name}</option>`)}
                      </select>
                    `:u}
              </div>
            `:u}
        <div class="cal-rolling">
          ${q.length===0&&P?l`<div class="cal-empty">${n("cal_no_events",e)}</div>`:q.map(W)}
        </div>
      </ha-card>
    `}};Y.styles=[ui,Ms,$`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],d([y({attribute:!1})],Y.prototype,"hass",2),d([h()],Y.prototype,"_config",2),d([h()],Y.prototype,"_objects",2),d([h()],Y.prototype,"_stats",2),d([h()],Y.prototype,"_windowDays",2),d([h()],Y.prototype,"_pastDays",2),d([h()],Y.prototype,"_userFilter",2),d([h()],Y.prototype,"_objectFilter",2),d([h()],Y.prototype,"_unsub",2),d([h()],Y.prototype,"_pastHistory",2);var $c=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],Ec=[{value:30,key:"cal_editor_window_past_30"},{value:90,key:"cal_editor_window_past_90"}],ht=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return N(this.hass)}setConfig(e){this._config={...e}}updated(){let e=this._lang;e&&!ue(e)&&De(e).then(()=>{ue(e)&&this.requestUpdate()})}_valueChanged(e,t){let s={...this._config,[e]:t};e==="show_window_chips"&&t===!0&&delete s.show_window_chips,e==="show_user_filter"&&t===!0&&delete s.show_user_filter,e==="show_object_filter"&&t===!0&&delete s.show_object_filter,e==="title"&&(!t||typeof t=="string"&&t.trim()==="")&&delete s.title,e==="user_filter"&&t===""&&delete s.user_filter,this._emit(s)}_windowChanged(e){let t={...this._config};e.startsWith("past-")?(t.past_days=Number(e.slice(5)),delete t.window_days):(t.window_days=Number(e),delete t.past_days),this._emit(t)}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){let e=this._lang,t=this._config.past_days?`past-${this._config.past_days}`:`${this._config.window_days??30}`,s=this._config.show_window_chips!==!1,a=this._config.show_user_filter!==!1,o=this._config.user_filter??"",c=this._config.title??"";return l`
      <div class="editor">
        <div class="row">
          <label for="title">${n("card_title",e)}</label>
          <input
            id="title"
            type="text"
            .value=${c}
            @input=${p=>this._valueChanged("title",p.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${n("cal_editor_window",e)}</label>
          <select
            id="window"
            @change=${p=>this._windowChanged(p.target.value)}
          >
            ${$c.map(p=>l`<option value="${p.value}" ?selected=${`${p.value}`===t}>${n(p.key,e)}</option>`)}
            ${Ec.map(p=>l`<option value="past-${p.value}" ?selected=${`past-${p.value}`===t}>${n(p.key,e)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${n("cal_editor_show_chips",e)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${s}
            @change=${p=>this._valueChanged("show_window_chips",p.target.checked)}
          />
        </div>
        <div class="hint">${n("cal_editor_chips_hint",e)}</div>
        <div class="row toggle">
          <label for="userf">${n("cal_editor_show_user_filter",e)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${a}
            @change=${p=>this._valueChanged("show_user_filter",p.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${n("cal_editor_default_user",e)}</label>
          <select
            id="userv"
            @change=${p=>this._valueChanged("user_filter",p.target.value)}
          >
            <option value="" ?selected=${o===""}>${n("all_users",e)}</option>
            <option value="current_user" ?selected=${o==="current_user"}>
              ${n("cal_editor_my_tasks",e)}
            </option>
          </select>
        </div>
        <div class="row toggle">
          <label for="objf">${n("cal_editor_show_object_filter",e)}</label>
          <input
            id="objf"
            type="checkbox"
            .checked=${this._config.show_object_filter!==!1}
            @change=${p=>this._valueChanged("show_object_filter",p.target.checked)}
          />
        </div>
        <div class="hint">${n("cal_editor_object_hint",e)}</div>
      </div>
    `}};ht.styles=$`
    :host { display: block; padding: 8px 0; }
    .editor { display: flex; flex-direction: column; gap: 12px; }
    .row { display: flex; flex-direction: column; gap: 4px; }
    .row.toggle {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    label { font-weight: 500; color: var(--primary-text-color); font-size: 14px; }
    input[type="text"], select {
      padding: 8px;
      font-size: 14px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, black);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
    }
    .hint {
      margin-top: -4px;
      font-size: 12px;
      color: var(--secondary-text-color, #666);
    }
  `,d([y({attribute:!1})],ht.prototype,"hass",2),d([h()],ht.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",Y);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",ht);on(["maintenance-supporter-calendar-card"],import.meta.url);an({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});export{Y as MaintenanceCalendarCard};
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
lit-html/async-directive.js:
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

lit-html/directive-helpers.js:
lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
