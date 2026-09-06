/*! maintenance_supporter frontend 2.75.0 */
var Wt=Object.defineProperty;var Br=Object.getOwnPropertyDescriptor;var w=(s,r,e)=>()=>{if(e)throw e[0];try{return s&&(r=s(s=0)),r}catch(t){throw e=[t],t}};var Vr=(s,r)=>{for(var e in r)Wt(s,e,{get:r[e],enumerable:!0})};var d=(s,r,e,t)=>{for(var i=t>1?void 0:t?Br(r,e):r,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(t?o(r,e,i):o(i))||i);return t&&i&&Wt(r,e,i),i};var Ge,Qe,ut,Kt,Le,Yt,E,Gt,ht,_t=w(()=>{Ge=globalThis,Qe=Ge.ShadowRoot&&(Ge.ShadyCSS===void 0||Ge.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ut=Symbol(),Kt=new WeakMap,Le=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==ut)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(Qe&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=Kt.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&Kt.set(e,r))}return r}toString(){return this.cssText}},Yt=s=>new Le(typeof s=="string"?s:s+"",void 0,ut),E=(s,...r)=>{let e=s.length===1?s[0]:r.reduce((t,i,n)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[n+1],s[0]);return new Le(e,s,ut)},Gt=(s,r)=>{if(Qe)s.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),i=Ge.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,s.appendChild(t)}},ht=Qe?s=>s:s=>s instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return Yt(e)})(s):s});var Wr,Kr,Yr,Gr,Qr,Jr,Je,Qt,Zr,Xr,Re,qe,Ze,Jt,X,Ne=w(()=>{_t();_t();({is:Wr,defineProperty:Kr,getOwnPropertyDescriptor:Yr,getOwnPropertyNames:Gr,getOwnPropertySymbols:Qr,getPrototypeOf:Jr}=Object),Je=globalThis,Qt=Je.trustedTypes,Zr=Qt?Qt.emptyScript:"",Xr=Je.reactiveElementPolyfillSupport,Re=(s,r)=>s,qe={toAttribute(s,r){switch(r){case Boolean:s=s?Zr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,r){let e=s;switch(r){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Ze=(s,r)=>!Wr(s,r),Jt={attribute:!0,type:String,converter:qe,reflect:!1,useDefault:!1,hasChanged:Ze};Symbol.metadata??=Symbol("metadata"),Je.litPropertyMetadata??=new WeakMap;X=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=Jt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(r,t,e);i!==void 0&&Kr(this.prototype,r,i)}}static getPropertyDescriptor(r,e,t){let{get:i,set:n}=Yr(this.prototype,r)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let p=i?.call(this);n?.call(this,o),this.requestUpdate(r,p,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??Jt}static _$Ei(){if(this.hasOwnProperty(Re("elementProperties")))return;let r=Jr(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(Re("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Re("properties"))){let e=this.properties,t=[...Gr(e),...Qr(e)];for(let i of t)this.createProperty(i,e[i])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let i of t)e.unshift(ht(i))}else r!==void 0&&e.push(ht(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Gt(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),i=this.constructor._$Eu(r,t);if(i!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:qe).toAttribute(e,t.type);this._$Em=r,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(r,e){let t=this.constructor,i=t._$Eh.get(r);if(i!==void 0&&this._$Em!==i){let n=t.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:qe;this._$Em=i;let p=o.fromAttribute(e,n.type);this[i]=p??this._$Ej?.get(i)??p,this._$Em=null}}requestUpdate(r,e,t,i=!1,n){if(r!==void 0){let o=this.constructor;if(i===!1&&(n=this[r]),t??=o.getPropertyOptions(r),!((t.hasChanged??Ze)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(r)&&!this.hasAttribute(o._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:i,wrapped:n},o){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,o??e??this[r]),n!==!0||o!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),i===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,n]of t){let{wrapped:o}=n,p=this[i];o!==!0||this._$AL.has(i)||p===void 0||this.C(i,void 0,n,p)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};X.elementStyles=[],X.shadowRootOptions={mode:"open"},X[Re("elementProperties")]=new Map,X[Re("finalized")]=new Map,Xr?.({ReactiveElement:X}),(Je.reactiveElementVersions??=[]).push("2.1.2")});function li(s,r){if(!wt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Xt!==void 0?Xt.createHTML(r):r}function ye(s,r,e=s,t){if(r===_e)return r;let i=t!==void 0?e._$Co?.[t]:e._$Cl,n=Oe(r)?void 0:r._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(s),i._$AT(s,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(r=ye(s,i._$AS(s,r.values),i,t)),r}var xt,Zt,Xe,Xt,ai,le,ni,es,he,He,Oe,wt,ts,gt,je,ei,ti,pe,ii,ri,oi,$t,l,xe,_a,_e,_,si,ue,is,De,mt,Me,be,ft,vt,yt,bt,rs,di,et=w(()=>{xt=globalThis,Zt=s=>s,Xe=xt.trustedTypes,Xt=Xe?Xe.createPolicy("lit-html",{createHTML:s=>s}):void 0,ai="$lit$",le=`lit$${Math.random().toFixed(9).slice(2)}$`,ni="?"+le,es=`<${ni}>`,he=document,He=()=>he.createComment(""),Oe=s=>s===null||typeof s!="object"&&typeof s!="function",wt=Array.isArray,ts=s=>wt(s)||typeof s?.[Symbol.iterator]=="function",gt=`[ 	
\f\r]`,je=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ei=/-->/g,ti=/>/g,pe=RegExp(`>|${gt}(?:([^\\s"'>=/]+)(${gt}*=${gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ii=/'/g,ri=/"/g,oi=/^(?:script|style|textarea|title)$/i,$t=s=>(r,...e)=>({_$litType$:s,strings:r,values:e}),l=$t(1),xe=$t(2),_a=$t(3),_e=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),si=new WeakMap,ue=he.createTreeWalker(he,129);is=(s,r)=>{let e=s.length-1,t=[],i,n=r===2?"<svg>":r===3?"<math>":"",o=je;for(let p=0;p<e;p++){let c=s[p],u,m,f=-1,x=0;for(;x<c.length&&(o.lastIndex=x,m=o.exec(c),m!==null);)x=o.lastIndex,o===je?m[1]==="!--"?o=ei:m[1]!==void 0?o=ti:m[2]!==void 0?(oi.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=pe):m[3]!==void 0&&(o=pe):o===pe?m[0]===">"?(o=i??je,f=-1):m[1]===void 0?f=-2:(f=o.lastIndex-m[2].length,u=m[1],o=m[3]===void 0?pe:m[3]==='"'?ri:ii):o===ri||o===ii?o=pe:o===ei||o===ti?o=je:(o=pe,i=void 0);let v=o===pe&&s[p+1].startsWith("/>")?" ":"";n+=o===je?c+es:f>=0?(t.push(u),c.slice(0,f)+ai+c.slice(f)+le+v):c+le+(f===-2?p:v)}return[li(s,n+(s[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},De=class s{constructor({strings:r,_$litType$:e},t){let i;this.parts=[];let n=0,o=0,p=r.length-1,c=this.parts,[u,m]=is(r,e);if(this.el=s.createElement(u,t),ue.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(i=ue.nextNode())!==null&&c.length<p;){if(i.nodeType===1){if(i.hasAttributes())for(let f of i.getAttributeNames())if(f.endsWith(ai)){let x=m[o++],v=i.getAttribute(f).split(le),k=/([.?@])?(.*)/.exec(x);c.push({type:1,index:n,name:k[2],strings:v,ctor:k[1]==="."?ft:k[1]==="?"?vt:k[1]==="@"?yt:be}),i.removeAttribute(f)}else f.startsWith(le)&&(c.push({type:6,index:n}),i.removeAttribute(f));if(oi.test(i.tagName)){let f=i.textContent.split(le),x=f.length-1;if(x>0){i.textContent=Xe?Xe.emptyScript:"";for(let v=0;v<x;v++)i.append(f[v],He()),ue.nextNode(),c.push({type:2,index:++n});i.append(f[x],He())}}}else if(i.nodeType===8)if(i.data===ni)c.push({type:2,index:n});else{let f=-1;for(;(f=i.data.indexOf(le,f+1))!==-1;)c.push({type:7,index:n}),f+=le.length-1}n++}}static createElement(r,e){let t=he.createElement("template");return t.innerHTML=r,t}};mt=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,i=(r?.creationScope??he).importNode(e,!0);ue.currentNode=i;let n=ue.nextNode(),o=0,p=0,c=t[0];for(;c!==void 0;){if(o===c.index){let u;c.type===2?u=new Me(n,n.nextSibling,this,r):c.type===1?u=new c.ctor(n,c.name,c.strings,this,r):c.type===6&&(u=new bt(n,this,r)),this._$AV.push(u),c=t[++p]}o!==c?.index&&(n=ue.nextNode(),o++)}return ue.currentNode=he,i}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},Me=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=ye(this,r,e),Oe(r)?r===_||r==null||r===""?(this._$AH!==_&&this._$AR(),this._$AH=_):r!==this._$AH&&r!==_e&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):ts(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==_&&Oe(this._$AH)?this._$AA.nextSibling.data=r:this.T(he.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,i=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=De.createElement(li(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new mt(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(r){let e=si.get(r.strings);return e===void 0&&si.set(r.strings,e=new De(r)),e}k(r){wt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let n of r)i===e.length?e.push(t=new s(this.O(He()),this.O(He()),this,this.options)):t=e[i],t._$AI(n),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=Zt(r).nextSibling;Zt(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},be=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,i,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=r,this.name=e,this._$AM=i,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=_}_$AI(r,e=this,t,i){let n=this.strings,o=!1;if(n===void 0)r=ye(this,r,e,0),o=!Oe(r)||r!==this._$AH&&r!==_e,o&&(this._$AH=r);else{let p=r,c,u;for(r=n[0],c=0;c<n.length-1;c++)u=ye(this,p[t+c],e,c),u===_e&&(u=this._$AH[c]),o||=!Oe(u)||u!==this._$AH[c],u===_?r=_:r!==_&&(r+=(u??"")+n[c+1]),this._$AH[c]=u}o&&!i&&this.j(r)}j(r){r===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},ft=class extends be{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===_?void 0:r}},vt=class extends be{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==_)}},yt=class extends be{constructor(r,e,t,i,n){super(r,e,t,i,n),this.type=5}_$AI(r,e=this){if((r=ye(this,r,e,0)??_)===_e)return;let t=this._$AH,i=r===_&&t!==_||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,n=r!==_&&(t===_||i);i&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},bt=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){ye(this,r)}},rs=xt.litHtmlPolyfillSupport;rs?.(De,Me),(xt.litHtmlVersions??=[]).push("3.3.2");di=(s,r,e)=>{let t=e?.renderBefore??r,i=t._$litPart$;if(i===void 0){let n=e?.renderBefore??null;t._$litPart$=i=new Me(r.insertBefore(He(),n),n,void 0,e??{})}return i._$AI(s),i}});var kt,A,ss,ci=w(()=>{Ne();Ne();et();et();kt=globalThis,A=class extends X{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=di(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return _e}};A._$litElement$=!0,A.finalized=!0,kt.litElementHydrateSupport?.({LitElement:A});ss=kt.litElementPolyfillSupport;ss?.({LitElement:A});(kt.litElementVersions??=[]).push("4.2.2")});var pi=w(()=>{});var I=w(()=>{Ne();et();ci();pi()});var ui=w(()=>{});function y(s){return(r,e)=>typeof e=="object"?ns(s,r,e):((t,i,n)=>{let o=i.hasOwnProperty(n);return i.constructor.createProperty(n,t),o?Object.getOwnPropertyDescriptor(i,n):void 0})(s,r,e)}var as,ns,Et=w(()=>{Ne();as={attribute:!0,type:String,converter:qe,reflect:!1,hasChanged:Ze},ns=(s=as,r,e)=>{let{kind:t,metadata:i}=e,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),t==="setter"&&((s=Object.create(s)).wrapped=!0),n.set(e.name,s),t==="accessor"){let{name:o}=e;return{set(p){let c=r.get.call(this);r.set.call(this,p),this.requestUpdate(o,c,s,!0,p)},init(p){return p!==void 0&&this.C(o,void 0,s,p),p}}}if(t==="setter"){let{name:o}=e;return function(p){let c=this[o];r.call(this,p),this.requestUpdate(o,c,s,!0,p)}}throw Error("Unsupported decorator location: "+t)}});function h(s){return y({...s,state:!0,attribute:!1})}var hi=w(()=>{Et();});var _i=w(()=>{});var we=w(()=>{});var gi=w(()=>{we();});var mi=w(()=>{we();});var fi=w(()=>{we();});var vi=w(()=>{we();});var yi=w(()=>{we();});var V=w(()=>{ui();Et();hi();_i();gi();mi();fi();vi();yi()});function bi(s,r){return!s||s<=0?0:s*(os[r||"days"]??1)}var os,xi=w(()=>{"use strict";os={days:1,weeks:7,months:30.4368,years:365.25}});function ge(s){let r=s.getFullYear(),e=String(s.getMonth()+1).padStart(2,"0"),t=String(s.getDate()).padStart(2,"0");return`${r}-${e}-${t}`}function ls(s,r){let e=[];for(let t=0;t<r;t++){let i=new Date(s);i.setDate(i.getDate()+t),i.setHours(0,0,0,0),e.push(ge(i))}return e}function it(s,r){let[e,t,i]=s.split("-").map(Number),n=new Date(e,t-1,i);return n.setDate(n.getDate()+r),ge(n)}function ds(s){if(!s||s.length===0)return null;let r=s.map(e=>e.cost).filter(e=>typeof e=="number");return r.length===0?null:r.reduce((e,t)=>e+t,0)/r.length}function cs(s){let{windowStart:r,windowEnd:e,task:t,entryId:i,objectName:n}=s,o=[],p=(f,x)=>({date:f,entry_id:i,task_id:t.id,task_name:t.name,object_name:n,status:x&&(t.status==="overdue"||t.status==="triggered")?"ok":t.status,days_until_due:x?null:t.days_until_due??null,projected:x,schedule_type:t.schedule_type,interval_days:t.interval_days??null,interval_unit:t.interval_unit??null,responsible_user_id:t.responsible_user_id??null,avg_cost:ds(t.history),adaptive_enabled:!!t.adaptive_config?.enabled,prediction_confidence:t.threshold_prediction_confidence??null}),c=Math.max(1,Math.round(bi(t.interval_days,t.interval_unit)));if(t.status==="overdue"||t.status==="triggered"){if(o.push(p(r,!1)),t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let f=it(r,c),x=1;for(;f<=e&&x<wi;)o.push(p(f,!0)),x++,f=it(f,c)}return o}let u=t.next_due;if(typeof u!="string"||!u)return o;let m=u.slice(0,10);if(m>=r&&m<=e)o.push(p(m,!1));else if(m>e)return o;if(t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let f=it(m,c),x=o.length;for(;f<=e&&x<wi;)f>=r&&(o.push(p(f,!0)),x++),f=it(f,c)}return o}function ki(s,r,e,t=null){let i=ls(r,e),n=i[0],o=i[i.length-1],p=[];for(let u of s){let m=u.object?.name||"",f=u.entry_id,x=u.tasks||[];for(let v of x){if(t&&v.responsible_user_id!==t||v.enabled===!1)continue;let k=cs({windowStart:n,windowEnd:o,task:v,entryId:f,objectName:m});p.push(...k)}}let c=new Map;for(let u of i)c.set(u,[]);for(let u of p){let m=c.get(u.date);m&&m.push(u)}for(let[,u]of c)u.sort((m,f)=>{let x=$i[m.status]??99,v=$i[f.status]??99;if(x!==v)return x-v;if(m.projected!==f.projected)return m.projected?1:-1;let k=m.object_name.localeCompare(f.object_name);return k!==0?k:m.task_name.localeCompare(f.task_name)});return i.map(u=>({date:u,events:c.get(u)??[]}))}function us(s,r){let e=[];for(let t=r-1;t>=0;t--){let i=new Date(s);i.setDate(i.getDate()-t),i.setHours(0,0,0,0),e.push(ge(i))}return e}function Ei(s,r,e,t=null){let i=us(r,e),n=i[0],o=i[i.length-1],p=new Map;for(let u of i)p.set(u,[]);for(let u of s){let m=u.object?.name||"",f=u.entry_id,x=u.tasks||[];for(let v of x){if(t&&v.responsible_user_id!==t)continue;let k=v.history||[];for(let T of k){if(typeof T?.timestamp!="string")continue;let D=T.timestamp.slice(0,10);if(D<n||D>o)continue;let F=p.get(D);if(!F)continue;let j=T.type??"completed";F.push({date:D,entry_id:f,task_id:v.id,task_name:v.name,object_name:m,status:ps[j]??"ok",days_until_due:null,projected:!1,schedule_type:v.schedule_type,interval_days:v.interval_days??null,responsible_user_id:v.responsible_user_id??null,avg_cost:typeof T.cost=="number"?T.cost:null,adaptive_enabled:!!v.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:T.timestamp,history_type:j,history_cost:typeof T.cost=="number"?T.cost:null,history_notes:typeof T.notes=="string"?T.notes:null,history_duration:typeof T.duration=="number"?T.duration:null})}}}let c={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,u]of p)u.sort((m,f)=>{let x=c[m.history_type??""]??99,v=c[f.history_type??""]??99;if(x!==v)return x-v;let k=m.object_name.localeCompare(f.object_name);return k!==0?k:m.task_name.localeCompare(f.task_name)});return i.map(u=>({date:u,events:p.get(u)??[]}))}var wi,$i,ps,St=w(()=>{"use strict";xi();wi=5;$i={overdue:0,triggered:1,due_soon:2,ok:3};ps={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok"}});var Ti,Ai=w(()=>{Ti={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",trigger_removed:"Trigger removed",ok:"OK",all:"All",new_object:"+ New Object",templates_from:"From template",templates_title:"Start from a template",templates_task_count:"{n} tasks",template_created:"Created from template",onboard_hint:"Add your first object to start tracking maintenance.",edit:"Edit",duplicate:"Duplicate",task_duplicated:"Task duplicated",object_duplicated:"Object duplicated",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",missed:"Missed",reset:"Reset",snooze:"Snooze",snoozed:"Snoozed",cancel:"Cancel",bulk_select:"Select",bulk_select_all:"Select all",bulk_n_selected:"{n} selected",bulk_completed:"{n} tasks completed",bulk_archived:"{n} tasks archived",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",runtime_hours:"Target runtime (hours)",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",recurrence_last_day:"Last day of the month",recurrence_business_day:"Business days only (roll back from weekend)",recurrence_offset:"Offset (days, \xB1)",recurrence_offset_help:"Shift the date by \xB1N days, e.g. -2 = two days before.",last_day_month:"Last day of month",last_business_day_month:"Last business day",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",reading:"Reading",custom:"Custom",history:"History",cost:"Cost",report_button:"Report",report_title:"Maintenance report",report_generated:"Generated",report_times_done:"Done",report_total_cost:"Total cost",report_every:"every {n} {unit}",report_notes:"Notes",report_col_type:"Type",report_col_status:"Status",report_col_schedule:"Schedule",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",require_on_completion:"Require on completion",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_optional:"Due at time (optional)",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",notes_markdown_hint:"Markdown is supported \u2014 **bold**, lists, [links](\u2026)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",completed_at_optional:"Completed at (optional, empty = now)",completed_at_pick:"Set date & time",completed_at_future_error:"The completion date cannot be in the future.",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",priority:"Priority",labels:"Labels",labels_placeholder:"e.g. safety, seasonal, tenant-visible",labels_help:"Comma-separated tags for filtering and reporting.",priority_low:"Low",priority_normal:"Normal",priority_high:"High",all_priorities:"All priorities",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",earliest_completion_days:"Earliest completion (days before due)",earliest_completion_days_help:"Leave empty to allow completing any time. 0 = only on/after the due date.",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",all_parts:"All parts",tasks_lower:"tasks",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",trigger_equals:"Trigger when equal to (=)",trigger_not_equals:"Trigger when different from (\u2260)",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",safety_interval:"Safety interval (optional)",trigger_combinator:"Combine trigger and interval",trigger_combinator_any:"Trigger or interval (whichever first)",trigger_combinator_all:"Trigger and interval (both required)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",adaptive_prediction_enabled:"Enable sensor-driven predictions",adaptive_seasonal_enabled:"Enable seasonal awareness",adaptive_max_interval:"Maximum interval (days)",adaptive_min_interval:"Minimum interval (days)",adaptive_ewa_alpha:"Learning rate (alpha)",adaptive_enabled:"Enable adaptive scheduling",adaptive_section_title:"Adaptive Scheduling",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",shared_with:"Shared with (rotation)",shared_with_help:"Pick multiple people to share this task; the responsible person rotates on each completion.",rotation_strategy:"Rotation",rotation_none:"No rotation",rotation_round_robin:"Round-robin",rotation_least_completed:"Least completed",rotation_random:"Random",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_window_7:"7 days",cal_window_14:"14 days",cal_window_30:"30 days",cal_window_365:"1 year",cal_every_n_days:"every {n} days",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",hide_outliers:"Hide outliers (sensor glitches)",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",clear:"Clear",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",no_advanced_features_hint:"Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",completions:"completions",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",compound:"Compound (multiple conditions)",compound_logic_and:"AND \u2014 all conditions must trigger",compound_logic_or:"OR \u2014 any condition triggers",compound_help:"Combine several sensor conditions into one trigger.",compound_no_conditions:"No conditions yet \u2014 add at least one.",compound_add_condition:"Add condition",compound_condition:"Condition",compound_remove_condition:"Remove condition",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_action_style:"Complete button style",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_areas:"Filter by areas",card_filter_areas_help:"Empty = show all areas.",card_filter_priority_help:"Empty = show all priorities. Tasks without an explicit priority count as Normal.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",tab_today:"Today",palette_placeholder:"Search objects and tasks\u2026",palette_no_results:"No matches",palette_hint:"\u2191\u2193 to navigate \xB7 Enter to open \xB7 Esc to close",today_all_caught_up:"All caught up! Nothing due this week.",today_overdue:"Overdue",today_due_today:"Due today",today_this_week:"This week",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_predictions:"Sensor Predictions",feat_predictions_desc:"Predict trigger dates from sensor degradation",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_consumable_threshold:"Consumable low threshold (%)",settings_battery_low_percent:"Battery low threshold (%)",settings_thresholds_hint:"Defaults for new Suggested setups (percent-remaining consumables) and for fleet batteries without their own Battery Notes threshold. Existing tasks keep their value.",settings_value_out_of_range:"Value must be between {min} and {max}",bn_summary:"{name}: {pct} % for {n} batteries",bn_floor_decides:"Your {floor} % floor decides for all of them; the higher of the two thresholds counts per battery.",bn_above_floor:"That is above your {floor} % floor, so {name} decides for all noted batteries.",bn_overrides:"{n} devices with their own threshold:",bn_more:"+ {n} more",settings_row_actions:"Task row actions",row_actions_buttons_compact:"Buttons (icons only on phones)",row_actions_buttons:"Buttons with text",row_actions_icons:"Icons (classic)",row_actions_follow:"Follow the household setting",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",settings_shopping_list:"Shopping list (buy tasks)",settings_shopping_list_help:"Low-part buy reminders appear in this to-do list; checking one off restocks the part.",shopping_list_none:"Off \u2014 no shopping list",settings_install_assist_sentences:"Install Assist sentences",settings_install_assist_sentences_hint:"Copies the voice sentences into your configuration so the classic Assist agent recognises them. A file you edited yourself is never overwritten.",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",notify_per_person:"Per-person delivery",member_avatars:"Member avatars",member_avatars_hint:"Shown next to assigned tasks \u2014 initials in the member's colour. Defaults come from the name; set your own initials or pick a colour to tell members apart.",member_initials:"Initials",member_color:"Colour",member_avatar_reset:"Reset",notify_no_own_device:"No own device \u2014 uses the household service",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_reminder_leads:"Extra reminders (days before due)",settings_reminder_leads_hint:"Comma-separated lead times, e.g. 14, 3, 0 \u2014 one extra reminder fires on each matching day. Empty = off.",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_weekly_digest:"Weekly digest",settings_weekly_digest_hint:"A single summary notification on Monday morning when tasks are due.",settings_warranty_reminder:"Warranty expiry reminder",settings_warranty_reminder_days:"Days before expiry",settings_warranty_reminder_hint:"Notify once when an object's warranty is this many days from expiring.",settings_snooze_hours:"Snooze duration (hours)",settings_budget:"Budget",settings_currency:"Currency",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_export_settings:"Export settings (JSON)",settings_import_csv:"Import CSV",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",settings_export_selection:"Limit to selected objects (optional)",settings_docs_archive:"Documents archive (with files)",settings_docs_archive_hint:"The JSON/YAML/CSV exports carry settings only. This ZIP includes the uploaded file contents so a restore is complete.",settings_docs_export_btn:"Download documents ZIP",settings_docs_import_btn:"Restore documents ZIP",settings_docs_import_success:"Restored: {blobs} files, {docs} documents",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",groupby_object:"By object",filter_label:"Filter",user_label:"User",photo_label:"Photo",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",state_latch_help:"With 1 transition the trigger is a latch: it recovers when the entity leaves the To-state \u2014 or, with only a From-state set, when it returns to that state.",for_minutes_state_help:"0 counts every change immediately. Set minutes and the new state must hold that long first \u2014 brief flickers then neither trigger nor count.",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",group_delete_confirm:'Delete group "{name}"?',groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else sees only Complete and Skip.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc:"Per-task HA action on complete + quick-complete QR with pre-set values.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_service:"Service",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",quick_complete_defaults_title:"Quick-complete defaults (for QR scans, optional)",quick_complete_defaults_desc:"Pre-set values for quick-complete QR scans. Without these, the QR opens the complete dialog.",quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026",archive:"Archive",undo:"Undo",task_archived:"Task archived",object_archived:"Object archived",unarchive:"Unarchive",archived:"Archived",show_archived:"Show archived",hide_archived:"Hide archived",confirm_archive_object:"Archive this object and its tasks? They keep their history and can be unarchived later.",settings_archive:"Archive & Retention",settings_archive_desc:"Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",settings_archive_oneoff_days:"Auto-archive completed one-off tasks after (days, 0 = off)",settings_delete_archived_oneoff_days:"Auto-delete archived one-off tasks after (days, 0 = never)",archive_object:"Archive object",unarchive_object:"Unarchive object",documents:"Documents",documents_empty:"No documents yet.",doc_upload:"Upload file",doc_uploading:"Uploading\u2026",doc_add_link:"Add link",doc_link_url:"URL (https://\u2026)",doc_link_title:"Title (optional)",doc_open:"Open",doc_delete_confirm:'Delete "{name}"?',doc_too_large:"File is too large (max 25 MB).",doc_upload_failed:"Upload failed.",completion_photos_optional:"Completion photos (optional)",completion_photos:"Completion photos",choose_photos:"Choose photos",add_photos:"Add photos",photos_limit:"Up to {max} photos per completion",history_edit_photos_hint:"Removing a photo here keeps the file in the object's documents.",uploading:"Uploading\u2026",remove:"Remove",doc_deduped:"Already stored elsewhere \u2014 shared, no extra space used.",doc_dup_in_object:"This file is already attached to this object.",doc_link_invalid:"Only http/https links are allowed.",doc_cat_manual:"Manual",doc_cat_warranty:"Warranty",doc_cat_invoice:"Invoice",doc_cat_spare_parts:"Spare parts",doc_cat_photo:"Photo",doc_cat_other:"Other",doc_link_badge:"Link",doc_storage_title:"Document storage",doc_storage_saved:"Saved via deduplication",doc_storage_refresh:"Refresh",doc_download:"Download",doc_close:"Close",doc_camera:"Take photo",doc_drop_hint:"Drop files here",doc_task_none:"No documents linked to this task.",doc_link_existing:"Link a document\u2026",doc_attach:"Link",doc_unlink:"Unlink",doc_page:"Page",chart_range_7d:"7d",chart_range_30d:"30d",chart_range_90d:"90d",chart_range_1y:"1y",chart_since_service:"since last service",chart_no_stats:"No long-term statistics for this entity \u2014 showing maintenance-event values only",auto_complete_on_recovery:"Auto-complete when the sensor recovers",auto_complete_on_recovery_help:"Records a completion (sets last performed) when the trigger clears itself \u2014 e.g. salt refilled, filter replaced.",doc_search:"Search documents\u2026",doc_search_none:"No matching documents",link_device_optional:"Link to existing device (optional)",parent_object_optional:"Parent object (optional)",parent_none:"(No parent)",paused:"Paused",pause_object:"Pause",resume_object:"Resume",pause_until_prompt:"Freeze this object's schedules \u2014 nothing becomes due and nothing notifies until it is resumed. Optionally set an auto-resume date.",pause_until_label:"Resume on (optional)",object_paused:"Object paused",object_resumed:"Object resumed \u2014 schedules restarted",object_paused_badge:"Paused",paused_until_label:"until",replace_object:"Replace\u2026",replace_object_prompt:"Retire this object and create a successor. History and costs stay archived on the old one; tasks and documents carry over to the new one, counters start fresh.",replace_name_label:"Successor name",object_replaced:"Object replaced \u2014 successor created",reading_unit_label:"Reading unit (e.g. kWh, m\xB3)",reading_unit_help:"Shown next to the recorded value when completing this task.",reading_value_label:"Reading value",reading_label:"Reading",readings_section:"Readings",readings_hint:"Several named values per completion \u2014 one row per meter. Leave empty to record a single value.",reading_name_label:"Reading name",reading_unit_short:"Unit",reading_add:"Add reading",reading_duplicate_name:"Name already used",reading_last:"last: {value}",reading_below_last:"Lower than the last reading ({value})",settings_templates_label:"Template gallery",settings_templates_hint:`Untick templates you'll never need \u2014 they disappear from the "From template" pickers (panel and config flow). Nothing else changes; you can re-enable them any time.`,worksheet:"Work sheet",worksheet_scan_view:"Scan to open the task",worksheet_scan_complete:"Scan to complete",worksheet_manual_excerpt:"Manual excerpt",worksheet_pages:"pages",worksheet_printed:"Printed",worksheet_never:"Never",card_all_caught_up:"All caught up \u2014 nothing needs attention",postpone:"Postpone",postpone_date_prompt:"Postpone this occurrence to which date?",postpone_date_label:"New due date",postponed:"Postponed",postponed_to:"Postponed to",season_window_label:"Seasonal window (months)",season_window_hint:"Only due in the selected months; off-season dates roll to the next active month. None = all year.",series_end_label:"Ends",series_end_never:"Never (repeats indefinitely)",series_end_after_count:"After a number of times",series_end_until:"On a date",series_end_count_label:"Number of times",series_end_until_label:"End date",parts_section:"Parts & consumables",parts_inventory_value:"Inventory value",part_add:"Add part",part_name:"Name",part_vendor:"Manufacturer",part_storage_location:"Storage location",part_product_url:"Product URL",part_unit:"Unit",part_cost:"Unit price",part_stock:"Stock",part_reorder_threshold:"Reorder at",part_restock_quantity:"Restock quantity",part_auto_buy:"Auto-create buy task when low",part_restock:"Adjust stock",parts_used_by:"Used by",restock_quantity_label:"Quantity bought",consumes_parts_label:"Consumes parts",shared_parts_other_objects:"Parts from other objects",shared_parts_help:"Several objects can share one stock. Completing this task takes from the owning object.",shared_part_unknown:"Unknown part",parts_load_failed:"Couldn't load this object's parts \u2014 the consumes-parts options are unavailable right now.",adopt_problem_button:"Adopt problem sensors",adopt_problem_title:"Adopt problem sensors",adopt_problem_hint:"Turn HA problem sensors (printer errors, filter warnings, low battery) into maintenance tasks that trigger while the problem is active and clear themselves when it resolves.",adopt_problem_none:"No problem sensors found that aren't already tracked.",adopt_problem_active:"active",adopt_problem_ok:"ok",adopt_problem_new_object:"(new)",adopt_problem_adopt:"Adopt selected",adopt_problem_done:"Adopted {tasks} problem sensor(s)",views_label:"Views",views_none:"\u2014 No view \u2014",views_manage:"Save / manage views",views_dialog_title:"Saved views",views_dialog_hint:"Save the current filters as a named view everyone can reuse.",views_name_placeholder:"View name",views_save_current:"Save current filters",views_none_yet:"No saved views yet.",close:"Close",trigger_hint_now:"The sensor reads {value} right now.",trigger_hint_above:"The task triggers once it rises above {target}.",trigger_hint_below:"It triggers once it falls below {target}.",trigger_hint_overlap:"These limits overlap: every reading triggers the task and it can never recover. Leave one of them empty.",trigger_hint_counter_delta:"Counts from the current reading ({value}): due at {due} (+{target}), and the count restarts after each completion.",trigger_hint_counter_delta_edit:"Counts usage since the last completion: due after +{target}; the count restarts after each completion.",trigger_hint_counter_abs:"The task becomes due once the sensor reaches {target}.",trigger_hint_runtime:"The task becomes due after {hours} h of accumulated on-time; the counter restarts after each completion.",trigger_hint_state_change:"The task becomes due after {count} state change(s).",trigger_hint_state_change_to:"The task becomes due after {count} change(s) to \u201C{state}\u201D.",trigger_hint_state_now:"Current state: {value}.",adopt_problem_part:"Uses part: {name}",label_filter:"Label",all_labels:"All labels",settings_notify_scope:"Notify only for view",settings_notify_scope_all:"All tasks",settings_notify_scope_hint:"Only tasks matching the selected saved view's label/user filters send reminders. Status, sorting and grouping of the view are ignored here.",card_saved_view:"Saved view",card_saved_view_none:"None",card_saved_view_help:"Applies the view's status, user and label filters on top of the filters above. The view's sorting and grouping are panel display settings and are not applied on the card.",doc_part_none:"No documents linked to this part.",settings_templates_toggle_group:"Enable or disable all templates in this group",setups_button:"Suggested setups",setups_title:"Suggested setups (Beta)",setups_hint:"Devices of supported integrations whose consumable sensors can drive maintenance tasks. Adopting creates the object and wires each task to its sensor \u2014 it triggers when the consumable runs low and resolves itself after replacement.",setups_none:"No supported devices with unwired consumable sensors found.",setups_adopt:"Set up selected",setups_done:"{tasks} sensor-wired tasks created.",complete_parts_used:"Parts used this time",part_delete_confirm:"Delete part '{name}'? Its stock tracking, task links and any open buy reminder will be removed.",baseline_start_value:"Start reading (optional)",baseline_start_help:"Counting starts from this reading. Leave empty to count from the current value; enter the reading at the last service so usage since then already counts.",setups_baseline_hint:"reading at last service (optional)",baseline_start_help_edit:"Leave empty to keep the existing counting. Entering a value re-anchors the counting (e.g. the reading at the last service).",baseline_current_effective:"Currently effective start value: {value}",runtime_on_states:"Active states",runtime_on_states_help:"States that count as running \u2014 default: on. E.g. mowing, cleaning, printing. With an attribute selected, its values are matched instead.",runtime_max_session:"Max session runtime (seconds)",runtime_max_session_help:"A single run counts at most this many seconds \u2014 protects against a sensor stuck ON (lost connection, restart). Empty = no cap.",trend_approaching:"Heading toward the threshold",trend_easing:"Easing away from the threshold",split_select_hint:"Select a task to see its details here",setups_target_new:"Create new: {name}",schedule_preview_title:"Next dates",schedule_preview_ontime:"Assuming on-time completion.",schedule_preview_ends:"(series ends)",adopt_problem_responsible:"Responsible user for all adopted tasks (optional)",adopt_for_minutes_hint:"Only trigger once the problem has persisted this long \u2014 0 reacts to the first flicker.",adopt_problem_configure:"Configure",history_auto:"Automatic",battery_fleet_title:"Battery fleet",battery_fleet_none_low:"All batteries OK \u2014 nothing to replace.",battery_fleet_buy_now:"Buy now",battery_fleet_soon:"Needed soon",battery_fleet_soon_hint:"Predicted from the last replacement date \u2014 order ahead.",battery_fleet_mark_all:"Mark all replaced",battery_fleet_mark_one:"Mark this battery replaced",battery_fleet_offline:"offline",battery_fleet_no_sensor:"No sensor",battery_fleet_trigger_lost:"This task's sensor trigger was lost \u2014 it will not fire or auto-complete.",battery_fleet_repair:"Repair",battery_fleet_exclude:"Exclude from the fleet",battery_fleet_excluded:"Excluded",battery_fleet_include:"Track again",battery_fleet_all:"All tracked batteries",battery_fleet_all_hint:"Exclude a device here to drop it from the fleet before it ever reports low \u2014 a vacuum that recharges itself, or a phone that warns you on its own.",battery_fleet_add:"Add a battery",battery_fleet_add_hint:"Pick a battery sensor the automatic discovery missed \u2014 it joins the roster immediately.",battery_fleet_track_self:"Track self-charging batteries",battery_fleet_track_self_hint:"Phones, vacuums and other devices that recharge themselves appear as rechargeables \u2014 a low one asks for a charge, never for new cells.",battery_fleet_due_without_sensor:"Treat a passed forecast as due when a battery has no sensor",battery_fleet_due_without_sensor_hint:"Some devices report no battery level at all \u2014 Battery Notes only knows the type and the last replacement. Once the typical lifetime has passed, such a battery counts as low and the fleet task reminds you; marking it replaced resets the forecast.",battery_fleet_status_low:"Low",battery_fleet_status_soon:"Soon",battery_fleet_status_ok:"Healthy",battery_fleet_status_due:"Due",battery_fleet_predicted_on:"Expected around {date}",battery_fleet_predicted_trend:"Predicted from this battery's discharge trend: around {date} ({confidence})",battery_fleet_rechargeable:"Rechargeable: charge instead of replacing \u2014 never on the shopping list",battery_fleet_sort_name:"Sort by name",battery_fleet_sort_urgency:"Sort by urgency",battery_fleet_mark_recharged:"Mark as recharged",battery_fleet_sparkline_hint:"Battery level over the last 30 days \u2014 dotted: projected until the low threshold",battery_fleet_filter_type:"Show only this battery type",battery_fleet_record_replacement:"The level jumped around {date} \u2014 record this replacement in Battery Notes",battery_fleet_total:"{n} batteries tracked",battery_fleet_setup_button:"Battery fleet",battery_fleet_setup_done:"Battery fleet set up \u2014 one task tracks all your batteries.",update_banner:"A newer version of Maintenance Supporter is on the server \u2014 reload to update the panel.",update_reload:"Reload",row_actions_banner:"Complete and Skip in task rows are now buttons. Prefer the old icons?",row_actions_keep:"Keep buttons",row_actions_back:"Back to icons",battery_fleet_forecast_overdue:"Predicted date passed \u2014 the battery still reports healthy. If you swapped it, record the replacement; otherwise the forecast was off.",cost_from_parts:"Use \u2248 {amount} from parts",dismiss:"Dismiss",gs_label:"Getting started \u2014 these hints retire as your setup grows",gs_setups_chip:"Suggested setups found {n} devices with pre-wired triggers",gs_adopt_chip:"{n} problem sensors can become maintenance tasks",gs_fleet_chip:"One click sets up the battery fleet",cal_editor_window:"Default window",cal_editor_window_week:"Week (7 days)",cal_editor_window_fortnight:"Fortnight (14 days)",cal_editor_window_month:"Month (30 days, default)",cal_editor_window_year:"Year (365 days, empty days collapsed)",cal_editor_show_chips:"Show window chips inside the card",cal_editor_chips_hint:"Hide the chips when the card is embedded in a strategy view that already serves as the window selector.",cal_editor_show_user_filter:"Show user filter dropdown",cal_editor_default_user:"Default user filter",cal_editor_my_tasks:"My tasks (current user)",cal_editor_show_object_filter:"Show object filter dropdown",cal_editor_object_hint:'Pre-select one object via YAML: object_filter: "<object name>" \u2014 or a list of names to restrict the card to several objects.',object_history_section:"History (all tasks)",object_history_all_tasks:"All tasks",object_history_empty:"No entries in this range.",object_history_cap_note:"History keeps up to 500 entries per task \u2014 very old entries may be missing.",service_record_title:"Service record",service_record_print:"Service record (PDF)",date:"Date",service_record_entries:"entries",completed_by:"Completed by",date_from:"From",date_to:"To",phases_section:"Cycle phases (optional)",phases_hint:"Different work on one shared schedule \u2014 each completion moves to the next step (e.g. small service, small service, big service).",phase_add:"Add phase",phase_name:"Phase name",phase_sequence_label:"Cycle order",phase_sequence_add_step:"Add step",phase_current:"Current phase",phase_set:"Set as current",chart_history_fallback:"No long-term statistics for this entity \u2014 showing recorder state history (typically the last ~10 days)",chart_history_alarm:"Trigger view from recorder state history: 1 = alert state held for the hold time, 0 = fine (typically the last ~10 days)",chart_history_count:"Change count rebuilt from recorder state history since the last service (typically the last ~10 days)",prediction_cycles:"Learned from cycles",phase_require_override:"Override \u201CRequire on completion\u201D for this phase",history_add_past:"Add past completion",require_tag_scan:"Only complete by scanning the tag",require_tag_scan_help:"Proof of presence: Done is blocked on every surface until the NFC tag or QR code on the thing itself is scanned. Automations can pass 'via_tag_scan' to the complete service.",disallow_skip:"Don't allow skipping",disallow_skip_help:"The Skip action disappears from every surface, and the server refuses a skip from automations and voice too.",require_tag_scan_hint:"This task completes only by scanning its NFC tag or QR code on the thing itself \u2014 saving here will be refused."}});var Ci,Ii=w(()=>{"use strict";Ci="2.75.0"});var ze,Pi=w(()=>{"use strict";ze={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"var(--deep-orange-color, #ff5722)",archived:"var(--disabled-color, #9e9e9e)",paused:"var(--info-color, #2196f3)"}});function _s(s){me.en=Object.assign({},s,me.en??{})}function Ue(s){let r=(s||At).toLowerCase();return r.startsWith("pt")&&r.endsWith("br")?"pt-br":r.substring(0,2)}function a(s,r){let e=Ue(r);return me[e]?.[s]??me.en[s]??s}function qi(s,r){r.has("hass")&&Tt(s.hass?.locale,s.hass?.config?.country);let e=s.hass?.language;e&&!Be(e)&&Ve(e).then(()=>s.requestUpdate())}function M(s){return s?.language||"en"}function Be(s){let r=Ue(s);return r===At||r in me}function Ve(s){let r=Ue(s);return r===At||r in me||!gs.has(r)?Promise.resolve():(r in Fe||(Fe[r]=fetch(`${ms}/${r}.json?v=${Ci}`).then(e=>e.ok?e.json():null).then(e=>{e?me[r]=e:delete Fe[r]}).catch(()=>{delete Fe[r]})),Fe[r])}function Ni(s){let r=Ue(s);return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN",da:"da-DK",fi:"fi-FI",nb:"nb-NO",ja:"ja-JP",hi:"hi-IN",pl:"pl-PL",cs:"cs-CZ",sv:"sv-SE","pt-br":"pt-BR",hu:"hu-HU",ko:"ko-KR",tr:"tr-TR"}[r]??"en-US"}function Tt(s,r){s&&(ee.date=s.date_format,ee.time=s.time_format,ee.number=s.number_format,r!==void 0&&(ee.country=r||void 0))}function vs(s){switch(ee.number){case"comma_decimal":return["en-US","en"];case"decimal_comma":return["de","es","it"];case"space_comma":return["fr","sv","cs"];case"system":return;default:return Ni(s)}}function P(s,r,e){if(!Number.isFinite(s))return String(s);let t=typeof e=="number"?{minimumFractionDigits:e,maximumFractionDigits:e}:{maximumFractionDigits:2,...e};if(ee.number==="none"){let i=Math.pow(10,t.maximumFractionDigits??2);return String(Math.round(s*i)/i)}try{return new Intl.NumberFormat(vs(r),t).format(s)}catch{return new Intl.NumberFormat(void 0,t).format(s)}}function st(s,r,e,t=2){let i=P(s,e,t);return r?`${i} ${r}`:i}function $e(s){let r=Ni(s),e=ee.country;if(e&&/^[A-Za-z]{2}$/.test(e)){let t=`${Ue(s).split("-")[0]}-${e.toUpperCase()}`;try{return new Intl.DateTimeFormat(t),t}catch{}}return r}function ji(s,r){let e=String(s.getDate()).padStart(2,"0"),t=String(s.getMonth()+1).padStart(2,"0"),i=String(s.getFullYear());switch(ee.date){case"DMY":return`${e}/${t}/${i}`;case"MDY":return`${t}/${e}/${i}`;case"YMD":return`${i}-${t}-${e}`;case"system":return s.toLocaleDateString(void 0,{day:"2-digit",month:"2-digit",year:"numeric"});default:return s.toLocaleDateString($e(r),{day:"2-digit",month:"2-digit",year:"numeric"})}}function Hi(s,r){switch(ee.time){case"12":return s.toLocaleTimeString($e(r),{hour:"2-digit",minute:"2-digit",hour12:!0});case"24":return s.toLocaleTimeString($e(r),{hour:"2-digit",minute:"2-digit",hour12:!1});case"system":return s.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});default:return s.toLocaleTimeString($e(r),{hour:"2-digit",minute:"2-digit"})}}function te(s,r){if(!s)return"\u2014";try{let e=s.includes("T")?s:s+"T00:00:00";return ji(new Date(e),r)}catch{return s}}function Oi(s,r){if(!s)return"\u2014";try{let e=new Date(s);return ji(e,r)+" "+Hi(e,r)}catch{return s}}function Di(s,r){if(s==null)return"\u2014";let e=r||"en";return s<0?`${Math.abs(s)} ${a("d_overdue",e)}`:s===0?a("today",e):`${s} ${a(s===1?"day":"days",e)}`}function rt(s,r,e){return s==null?"\u2014":`${s} ${a("unit_"+(r||"days"),e)}`}function ke(s,r,e="long"){return new Date(Date.UTC(2024,0,1+s)).toLocaleDateString($e(r),{weekday:e,timeZone:"UTC"})}function Ct(s,r,e="long"){return new Date(Date.UTC(2024,s,1)).toLocaleDateString($e(r),{month:e,timeZone:"UTC"})}function Mi(s,r,e="long"){return ke((s.getDay()+6)%7,r,e)}function zi(s,r,e="long"){return Ct(s.getMonth(),r,e)}function Fi(s,r){let e=s.schedule,t=e?.offset?` ${e.offset>0?"+":"\u2212"}${Math.abs(e.offset)}d`:"";switch(e?.kind){case"weekdays":return((e.weekdays||[]).map(i=>ke(i,r,"short")).join(" & ")||"\u2014")+t;case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?a("ord_last",r):a("ord_"+e.nth,r)} ${ke(e.weekday,r,"long")}${t}`;case"day_of_month":return e.day==null?"\u2014":(e.day===-1?a(e.business?"last_business_day_month":"last_day_month",r):`${a("day_word",r)} ${e.day}`)+t;case"one_time":return s.due_date?te(s.due_date,r):a("one_time",r);case"manual":return a("manual",r);case"interval":return rt(e.every,e.unit,r)}return s.schedule_type==="one_time"?s.due_date?te(s.due_date,r):a("one_time",r):s.schedule_type==="manual"?a("manual",r):s.schedule_type==="sensor_based"?a("sensor_based",r):s.interval_days!=null?rt(s.interval_days,s.interval_unit,r):"\u2014"}function Ui(s,r){s.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:r},bubbles:!0,composed:!0}))}var Li,At,Ri,me,gs,ms,Fe,fs,ee,Bi,ys,at,q=w(()=>{"use strict";I();Ai();Ii();Pi();Li="\u20AC",At="en",Ri=(()=>{let s=window;return s.__msLocales||(s.__msLocales={store:{},inflight:{}}),s.__msLocales})(),me=Ri.store;_s(Ti);gs=new Set(["de","nl","fr","it","es","pt","pt-br","ru","uk","pl","cs","sv","zh","da","fi","nb","ja","hi","hu","ko","tr"]),ms="/maintenance_supporter_locales",Fe=Ri.inflight;fs=window,ee=fs.__msDateTimePrefs??={};Bi=E`
  .field { display: flex; flex-direction: column; gap: 4px; }
  .field-label { font-size: 12px; color: var(--secondary-text-color); }
  .field-input {
    padding: 8px 10px; font-size: 14px;
    background: var(--secondary-background-color, rgba(0,0,0,0.06));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color); border-radius: 6px;
    font-family: inherit; width: 100%; box-sizing: border-box;
  }
  .field-input:focus { outline: none; border-color: var(--primary-color); }
`,ys=E`
  .person-chip { display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 100%; vertical-align: middle; }
  .person-avatar {
    width: 22px; height: 22px; border-radius: 50%; flex: none;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--person-color, #546e7a); color: #fff;
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.02em; line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .person-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
`,at=E`
  ${ys}
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
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* #150 follow-up: 3-state trend arrow — replaces the sparkline on
     narrow/tight rows (panel-styles toggles visibility per regime). */
  .trend-arrow {
    display: none;
    font-style: normal;
    font-weight: 700;
    margin-left: 2px;
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
    .row-actions mwc-icon-button {
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

    .group-card { min-width: 0; max-width: 100%; }

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
`});function We(s){if(!s)return[];let r=[],e=s.photo_doc_id;typeof e=="string"&&r.push(e);let t=s.photo_doc_ids;Array.isArray(t)&&r.push(...t);let i=[];for(let n of r){if(typeof n!="string")continue;let o=n.trim();if(!(!o||i.includes(o))&&(i.push(o),i.length>=10))break}return i}var nt=w(()=>{"use strict"});function Wi(){let s=new Uint8Array(4);return(globalThis.crypto??{getRandomValues:r=>r.map(()=>Math.floor(Math.random()*256))}).getRandomValues(s),Array.from(s,r=>r.toString(16).padStart(2,"0")).join("")}function ie(s){let r=s?.reading_values;if(!Array.isArray(r))return[];let e=[],t=new Set;for(let i of r){if(!i||typeof i!="object")continue;let n=i;typeof n.id!="string"||!n.id||t.has(n.id)||typeof n.value!="number"||!Number.isFinite(n.value)||(t.add(n.id),e.push({id:n.id,name:typeof n.name=="string"?n.name:n.id,unit:typeof n.unit=="string"?n.unit:null,value:n.value}))}return e}function Ki(s){return s.filter(r=>r.type==="completed"&&(r.reading_value!=null||ie(r).length>0)).sort((r,e)=>r.timestamp.localeCompare(e.timestamp))}function Yi(s){return Ki(s??[]).map(r=>({timestamp:r.timestamp,values:ie(r)})).filter(r=>r.values.length>0)}function Gi(s,r,e){let t;for(let i of s){if(e!==void 0){let o=new Date(i.timestamp).getTime();if(!isNaN(o)&&o>=e)break}let n=i.values.find(o=>o.id===r);n&&(t=n)}return t}function Qi(s,r,e){let t=ie(r).find(n=>n.id===e);if(!t)return null;let i=null;for(let n of Ki(s)){if(n.timestamp>=r.timestamp)break;let o=ie(n).find(p=>p.id===e);o&&(i=o.value)}return i==null?null:t.value-i}function Ji(s){let r=new Set,e=new Set;for(let t of s){let i=(t.name||"").trim().toLowerCase();i&&(r.has(i)?e.add(t.id):r.add(i))}return e}function Zi(s){let r=[],e=new Set,t=new Set;for(let i of s){let n=(i.name||"").trim();if(!(!n||e.has(i.id)||t.has(n.toLowerCase()))&&(e.add(i.id),t.add(n.toLowerCase()),r.push({id:i.id,name:n,unit:(i.unit||"").trim()||null}),r.length>=20))break}return r}var Ee=w(()=>{"use strict"});function xs(s,r){let e=bs[s];if(!e)return s;let t=a(e,r);return t&&t!==e?t:s}function ws(s){let e=s.match(/data\['([^']+)'\]/)?.[1],t;return(t=s.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=s.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=s.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=s.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(s)?{field:e,rule:"required"}:(t=s.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(s)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(s)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function O(s,r,e){if(e=e??a("action_error",r),typeof s=="string")return s;if(typeof s!="object"||s===null)return e;let t=s,i=t.message||t.error?.message||"";if(!i)return e;let n=ws(i),o=n.field?xs(n.field,r):"",p=c=>a(c,r).replace("{field}",o).replace("{n}",n.param??"");switch(n.rule){case"too_long":return p("err_too_long");case"too_short":return p("err_too_short");case"value_too_high":return p("err_value_too_high");case"value_too_low":return p("err_value_too_low");case"required":return p("err_required");case"wrong_type":return p("err_wrong_type").replace("{type}",n.param??"");case"invalid_choice":return p("err_invalid_choice");case"invalid_value":return p("err_invalid_value");default:return i||e}}var bs,fe=w(()=>{"use strict";q();bs={entry_id:"object",name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",group_name:"name",group_description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_equals:"trigger_equals",trigger_not_equals:"trigger_not_equals",trigger_for_minutes:"trigger_for_minutes"}});var N,It=w(()=>{"use strict";I();V();N=class extends A{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){return l`
      <label class="field">
        ${this.label?l`<span class="label">${this.label}${this.required?l`<span class="req">*</span>`:_}</span>`:_}
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
          step=${this.step??_}
          min=${this.min??_}
          max=${this.max??_}
          pattern=${this.pattern??_}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?l`<span class="helper">${this.helper}</span>`:_}
      </label>
    `}};N.styles=E`
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
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `,d([y()],N.prototype,"label",2),d([y()],N.prototype,"value",2),d([y()],N.prototype,"placeholder",2),d([y()],N.prototype,"type",2),d([y({type:Boolean})],N.prototype,"required",2),d([y({type:Boolean})],N.prototype,"disabled",2),d([y()],N.prototype,"step",2),d([y()],N.prototype,"min",2),d([y()],N.prototype,"max",2),d([y()],N.prototype,"pattern",2),d([y()],N.prototype,"helper",2),d([y({type:Boolean})],N.prototype,"multiline",2),d([y({type:Number})],N.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",N)});function $s(s,r){if(r)switch(s){case"date":return r.split("T")[0];case"time":return r.length===5?`${r}:00`:r;case"datetime":{let[e,t="00:00:00"]=r.split("T");return`${e} ${t.length===5?`${t}:00`:t}`}}}function ks(s,r){if(typeof r!="string"||!r)return"";switch(s){case"date":return r.slice(0,10);case"time":return r.slice(0,5);case"datetime":{let[e,t="00:00:00"]=r.split(" ");return`${e}T${t.length===5?`${t}:00`:t}`}}}var U,Se=w(()=>{"use strict";I();V();q();U=class extends A{constructor(){super(...arguments);this.kind="date";this.label="";this.value="";this.clearable=!1;this.disabled=!1;this.required=!1;this.lang="en"}_selector(){switch(this.kind){case"date":return{date:{}};case"time":return{time:{no_second:!0}};case"datetime":return{datetime:{}}}}_onSelectorChange(e){e.stopPropagation(),this._emit(ks(this.kind,e.detail?.value))}_clear(){this._emit("")}_emit(e){e!==this.value&&(this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}})))}render(){return l`
      <div class="field">
        ${this.label?l`<span class="label">${this.label}${this.required?l`<span class="req">*</span>`:_}</span>`:_}
        <div class="row">
          <ha-selector
            .hass=${this.hass}
            .selector=${this._selector()}
            .value=${$s(this.kind,this.value)}
            .required=${this.required}
            .disabled=${this.disabled}
            @value-changed=${this._onSelectorChange}
          ></ha-selector>
          ${this.clearable&&this.value&&!this.disabled?l`<button type="button" class="clear" title=${a("clear",this.lang)} aria-label=${a("clear",this.lang)} @click=${this._clear}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>`:_}
        </div>
        ${this.helper?l`<span class="helper">${this.helper}</span>`:_}
      </div>
    `}};U.styles=E`
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
    .clear {
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
    .clear:hover { background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08); }
    .clear:focus-visible { outline: 2px solid var(--primary-color); }
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `,d([y({attribute:!1})],U.prototype,"hass",2),d([y()],U.prototype,"kind",2),d([y()],U.prototype,"label",2),d([y()],U.prototype,"value",2),d([y()],U.prototype,"helper",2),d([y({type:Boolean})],U.prototype,"clearable",2),d([y({type:Boolean})],U.prototype,"disabled",2),d([y({type:Boolean})],U.prototype,"required",2),d([y()],U.prototype,"lang",2);customElements.get("ms-date-field")||customElements.define("ms-date-field",U)});var C,Xi=w(()=>{"use strict";I();V();q();fe();It();Se();C=class extends A{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._entryId=null}get _lang(){return M(this.hass)}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._haDeviceId=t.ha_device_id||"",this._parentEntryId=t.parent_entry_id||"",this._error="",this._open=!0}async _save(){if(!this._loading&&this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(e){this._error=O(e,this._lang,a("save_error",this._lang))}finally{this._loading=!1}}}_parentChoices(){return(this.objects||[]).filter(e=>e.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return l``;let e=this._lang,t=this._entryId?a("edit_object",e):a("new_object",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:_}
          <ms-textfield
            label="${a("name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${i=>this._manufacturer=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("model_optional",e)}"
            .value=${this._model}
            @input=${i=>this._model=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${i=>this._serialNumber=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${a("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${i=>this._areaId=i.detail.value||""}
          ></ha-area-picker>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${a("installation_date_optional",e)}"
            .value=${this._installationDate}
            @value-changed=${i=>this._installationDate=i.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${a("warranty_expiry_optional",e)}"
            .value=${this._warrantyExpiry}
            @value-changed=${i=>this._warrantyExpiry=i.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>a("link_device_optional",e)}
            @value-changed=${i=>this._haDeviceId=i.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?l`<label class="textarea-field">
                <span class="textarea-label">${a("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${i=>this._parentEntryId=i.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${a("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(i=>l`<option
                      value=${i.entry_id}
                      ?selected=${this._parentEntryId===i.entry_id}
                    >${i.object.name}</option>`)}
                </select>
              </label>`:_}
          <label class="textarea-field">
            <span class="textarea-label">${a("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${i=>this._notes=i.target.value}
            ></textarea>
            <span class="md-hint">${a("notes_markdown_hint",e)}</span>
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?a("saving",this._lang):a("save",this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};C.styles=E`
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
    .md-hint {
      font-size: 11px; color: var(--secondary-text-color); font-style: italic;
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
  `,d([y({attribute:!1})],C.prototype,"hass",2),d([y({attribute:!1})],C.prototype,"objects",2),d([h()],C.prototype,"_open",2),d([h()],C.prototype,"_loading",2),d([h()],C.prototype,"_error",2),d([h()],C.prototype,"_name",2),d([h()],C.prototype,"_manufacturer",2),d([h()],C.prototype,"_model",2),d([h()],C.prototype,"_serialNumber",2),d([h()],C.prototype,"_areaId",2),d([h()],C.prototype,"_installationDate",2),d([h()],C.prototype,"_warrantyExpiry",2),d([h()],C.prototype,"_documentationUrl",2),d([h()],C.prototype,"_notes",2),d([h()],C.prototype,"_haDeviceId",2),d([h()],C.prototype,"_parentEntryId",2),d([h()],C.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",C)});function Es(s){let r=(s||"").split(/\s+/).filter(Boolean);return r.length===0?"?":r.length===1?r[0][0].toUpperCase():(r[0][0]+r[r.length-1][0]).toUpperCase()}function Ss(s){let r=0;for(let e of s)r=r*31+e.charCodeAt(0)>>>0;return er[r%er.length]}function tr(s){return s?{id:s.id,name:s.name,initials:s.initials||Es(s.name),color:s.color||Ss(s.id)}:null}var er,ir=w(()=>{"use strict";I();er=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"]});var ot,rr=w(()=>{"use strict";ir();ot=class{constructor(r){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=r}updateHass(r){this.hass=r}async getUsers(r=!1){let e=Date.now();if(!r&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(r,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:r,task_id:e,user_id:t})}async getTasksByUser(r){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:r})).tasks}getUserName(r){return!r||!this.usersCache?null:this.usersCache.find(t=>t.id===r)?.name||null}getPerson(r){return tr(this.getUser(r))}getUser(r){return!r||!this.usersCache?null:this.usersCache.find(e=>e.id===r)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(r){return r?r===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}}});function G(s){return`${s.entry_id??""}\0${s.part_id}`}function sr(s,r,e,t){let i=!!s.entry_id&&s.entry_id!==r,n=i?s.entry_id:r,o=e.find(m=>m.entry_id===n),p=(o?.parts||[]).find(m=>m.id===s.part_id)||null,c=i&&o?.object?.name||"",u=p?.name||a("shared_part_unknown",t);return{part:p,foreign:i,ownerName:c,label:c?`${u} (${c})`:u}}function ar(s,r,e,t){let{part:i,label:n}=sr(s,r,e,t),o=i&&i.stock!==null&&i.stock!==void 0?` (${i.stock}${i.unit?" "+i.unit:""})`:"",p=i?.storage_location?` \u2014 ${i.storage_location}`:"";return`${s.quantity}\xD7 ${n}${o}${p}`}function nr(s,r,e,t){let n=(e.find(p=>p.entry_id===r)?.parts||[]).map(p=>({...p})),o=new Set(n.map(p=>G({part_id:p.id})));for(let p of s?.consumes_parts||[]){if(!p.entry_id||p.entry_id===r)continue;let c=G(p);if(o.has(c))continue;o.add(c);let{part:u,ownerName:m}=sr(p,r,e,t);n.push({id:p.part_id,name:u?.name||a("shared_part_unknown",t),unit:u?.unit,stock:u?.stock??null,storage_location:u?.storage_location,entry_id:p.entry_id,owner_name:m})}return n}var lt=w(()=>{"use strict";q()});var Pt,or,lr,dr=w(()=>{"use strict";Pt=["sensor","binary_sensor","number","input_number","input_boolean","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock"],or=["sensor"],lr=["temperature","humidity","pressure"]});var Lt,Ke,Rt=w(()=>{"use strict";Lt=["notes","cost","duration","photo","user"],Ke={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"}});function Ls(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",carry:{}}}function qs(s){return{entityIds:(s.entity_ids||(s.entity_id?[s.entity_id]:[])).join(", "),type:s.type||"threshold",attribute:s.attribute||"",above:s.trigger_above?.toString()??"",below:s.trigger_below?.toString()??"",equals:s.trigger_equals?.toString()??"",notEquals:s.trigger_not_equals?.toString()??"",forMinutes:s.trigger_for_minutes?.toString()??"0",targetValue:s.trigger_target_value?.toString()??"",deltaMode:s.trigger_delta_mode||!1,fromState:s.trigger_from_state||"",toState:s.trigger_to_state||"",targetChanges:s.trigger_target_changes?.toString()??"",runtimeHours:s.trigger_runtime_hours?.toString()??"",onStates:(s.trigger_on_states||[]).join(", "),carry:Object.fromEntries(Object.entries(s).filter(([e])=>!Rs.has(e)&&!e.startsWith("_")))}}function Ns(s){let r=s.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(r.length===0)return null;let e={...s.carry||{},entity_id:r[0],entity_ids:r,type:s.type};if(s.attribute&&(e.attribute=s.attribute),s.type==="threshold"){let t=parseFloat(s.above);isNaN(t)||(e.trigger_above=t);let i=parseFloat(s.below);isNaN(i)||(e.trigger_below=i);let n=parseFloat(s.equals);isNaN(n)||(e.trigger_equals=n);let o=parseFloat(s.notEquals);isNaN(o)||(e.trigger_not_equals=o);let p=parseInt(s.forMinutes,10);isNaN(p)||(e.trigger_for_minutes=p)}else if(s.type==="counter"){let t=parseFloat(s.targetValue);isNaN(t)||(e.trigger_target_value=t),e.trigger_delta_mode=s.deltaMode}else if(s.type==="state_change"){s.fromState&&(e.trigger_from_state=s.fromState),s.toState&&(e.trigger_to_state=s.toState);let t=parseInt(s.targetChanges,10);isNaN(t)||(e.trigger_target_changes=t)}else if(s.type==="runtime"){let t=parseFloat(s.runtimeHours);isNaN(t)||(e.trigger_runtime_hours=t);let i=(s.onStates||"").split(",").map(n=>n.trim()).filter(Boolean);i.length>0&&(e.trigger_on_states=i)}return e}function js(s){return Array.from({length:7},(r,e)=>ke(e,s,"short"))}function Hs(s){return Array.from({length:12},(r,e)=>Ct(e,s,"short"))}var Ts,Cs,Is,qt,cr,Ps,re,Rs,g,Nt,pr=w(()=>{"use strict";I();V();q();rr();lt();Ee();dr();fe();Rt();It();Se();Ts=["cleaning","inspection","replacement","calibration","service","reading","custom"],Cs=["low","normal","high"],Is=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],qt=["weekdays","nth_weekday","day_of_month"],cr=["threshold","counter","state_change","runtime"],Ps=[...cr,"compound"],re={alpha:"0.3",min:"7",max:"365"};Rs=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states"]);g=class g extends A{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._priority="normal";this._labels="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=re.alpha;this._adaptiveMin=re.min;this._adaptiveMax=re.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return M(this.hass)}async openCreate(e,t){this._entryId=e,this._taskId=null,this._error="",!e&&t&&t.length>0?(this._objectChoices=t.map(i=>({entry_id:i.entry_id,name:i.object.name})).sort((i,n)=>i.name.localeCompare(n.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._objectChoices=[],this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let i=t.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"&&(i.day??1)>=1?String(i.day??1):"1",this._domLastDay=i?.kind==="day_of_month"&&i.day===-1,this._domBusiness=i?.kind==="day_of_month"&&i.business===!0,this._calOffset=i?.offset?String(i.offset):"0",this._seasonMonths=Array.isArray(i?.season_months)?[...i.season_months]:[];let n=i?.ends;n&&typeof n.count=="number"?(this._endsMode="count",this._endsCount=String(n.count),this._endsUntil=""):n&&typeof n.until=="string"?(this._endsMode="until",this._endsUntil=n.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(u=>({...u})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(u=>[G(u),{...u}])),this._responsibleUserId=t.responsible_user_id||null,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([u,m])=>{let{name:f,checklist:x,consumes_parts:v,required_completion_fields:k,...T}=m,D=m.consumes_parts||[],F=D.findIndex(K=>!K.entry_id),j=F>=0?D[F]:void 0;return{id:u,name:m.name||u,checklistText:(m.checklist||[]).join(`
`),partId:j?.part_id||"",partQty:j?.quantity!=null?String(j.quantity):"",reqOverride:m.required_completion_fields!==void 0,reqFields:[...m.required_completion_fields||[]],extraParts:D.filter((K,oe)=>oe!==F).map(K=>({...K})),carry:T}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"";let o=t.on_complete_action;if(o&&o.service){this._actionService=o.service;let u=o.target?.entity_id;this._actionTargetEntity=Array.isArray(u)?u[0]||"":u||"",this._actionData=o.data&&typeof o.data=="object"?{...o.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let p=t.quick_complete_defaults;this._qcNotes=p?.notes||"",this._qcCost=p?.cost!=null?String(p.cost):"",this._qcDuration=p?.duration!=null?String(p.duration):"",this._qcFeedback=p?.feedback||"";let c=t.adaptive_config||{};if(this._environmentalEntity=c.environmental_entity||"",this._environmentalAttribute=c.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!c.enabled,this._adaptiveAlpha=c.ewa_alpha?.toString()??re.alpha,this._adaptiveMin=c.min_interval_days?.toString()??re.min,this._adaptiveMax=c.max_interval_days?.toString()??re.max,this._adaptiveSeasonal=c.seasonal_enabled!==!1,this._adaptivePrediction=c.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),t.trigger_config){let u=t.trigger_config;this._triggerEntityId=u.entity_id||u.entity_ids&&u.entity_ids[0]||"",this._triggerEntityIds=u.entity_ids||(u.entity_id?[u.entity_id]:[]),this._triggerEntityLogic=u.entity_logic||"any",this._triggerAttribute=u.attribute||"",this._triggerType=u.type||"threshold",this._triggerAbove=u.trigger_above?.toString()||"",this._triggerBelow=u.trigger_below?.toString()||"",this._triggerEquals=u.trigger_equals?.toString()||"",this._triggerNotEquals=u.trigger_not_equals?.toString()||"",this._triggerForMinutes=u.trigger_for_minutes?.toString()||"0",this._triggerCombinator=u.trigger_combinator==="all"?"all":"any",this._triggerTargetValue=u.trigger_target_value?.toString()||"",this._triggerDeltaMode=u.trigger_delta_mode||!1,this._triggerBaselineValue=u.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=u.auto_complete_on_recovery||!1,this._triggerFromState=u.trigger_from_state||"",this._triggerToState=u.trigger_to_state||"",this._triggerTargetChanges=u.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=u.trigger_runtime_hours?.toString()||"",this._triggerRuntimeMaxSession=u.trigger_runtime_max_session_seconds?.toString()||"",this._triggerOnStates=(u.trigger_on_states||[]).join(", "),u.type==="compound"?(this._compoundLogic=u.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(u.conditions||[]).map(qs)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._priority="normal",this._labels="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=re.alpha,this._adaptiveMin=re.min,this._adaptiveMax=re.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerEquals="",this._triggerNotEquals="",this._triggerForMinutes="0",this._triggerCombinator="any",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours="",this._triggerRuntimeMaxSession="",this._triggerOnStates="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new ot(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,i]=e.split(".");if(!this.hass?.services?.[t]?.[i]){this._actionTestResult="error",this._actionTestError=`Service "${e}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let n=this._actionTargetEntity.trim();if(n){let o=n.split(".")[0];if(o!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=`Service "${e}" only works on ${t}.* entities; entity "${n}" is in ${o}.* \u2014 pick a service that matches the entity domain (e.g. ${o}.${i})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[n]){this._actionTestResult="error",this._actionTestError=`Target entity "${n}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,i]=e.split("."),n=this.hass?.services?.[t]?.[i]?.fields;return!n||Object.keys(n).length===0?null:Object.entries(n).map(([o,p])=>({name:o,required:!!p.required,selector:p.selector||{text:{}}}))}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled)return _;let t=this._serviceSchema();return l`
      <details class="ca-section">
        <summary>${a("on_complete_action_title",e)}</summary>
        <p class="field-help">${a("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let n=this._serviceSchema();if(n){let o=new Set(n.map(p=>p.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([p])=>o.has(p)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>a("on_complete_action_target",e)}
          @value-changed=${i=>{let n=i.detail.value;this._actionTargetEntity=n.target_entity||""}}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${a("on_complete_action_target_hint",e)}
        </p>
        ${t?l`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${i=>{this._actionData={...i.detail.value}}}
              ></ha-form>
            `:l`
              <ms-textfield
                label="${a("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${i=>{this._actionDataJsonFallback=i.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":a("on_complete_action_test",e)}
          </button>
          ${this._actionTestResult==="ok"?l`<span class="ca-test-ok">${a("on_complete_action_test_success",e)}</span>`:_}
          ${this._actionTestResult==="error"?l`<div class="ca-test-error-block">
                <span class="ca-test-error">${a("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?l`<div class="ca-test-error-detail">${this._actionTestError}</div>`:_}
              </div>`:_}
        </div>
      </details>

      <details class="ca-section">
        <summary>${a("quick_complete_defaults_title",e)}</summary>
        <p class="field-help">${a("quick_complete_defaults_desc",e)}</p>
        <ms-textfield
          label="${a("quick_complete_defaults_notes",e)}"
          .value=${this._qcNotes}
          @input=${i=>{this._qcNotes=i.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${a("quick_complete_defaults_cost",e)}"
          type="number" min="0" step="0.01"
          .value=${this._qcCost}
          @input=${i=>{this._qcCost=i.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${a("quick_complete_defaults_duration",e)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${i=>{this._qcDuration=i.target.value}}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${i=>{this._qcFeedback=i.target.value}}>
          <option value="">${a("quick_complete_defaults_feedback_none",e)}</option>
          <option value="needed">${a("quick_complete_defaults_feedback_needed",e)}</option>
          <option value="not_needed">${a("quick_complete_defaults_feedback_not_needed",e)}</option>
        </select>
      </details>
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=e.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(e.objects||[]).filter(t=>t.entry_id!==this._entryId&&(t.parts||[]).length>0).map(t=>({entry_id:t.entry_id,name:t.object?.name||t.entry_id,parts:t.parts||[]})).sort((t,i)=>t.name.localeCompare(i.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let i=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:i.suggested_attributes||[],available:i.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=t.domain||"",this._suggestedAttributes=t.suggested_attributes||[],this._availableAttributes=t.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let i=G({part_id:e.id,entry_id:t}),n=this._consumesParts[i],o=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return l`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${n!==void 0}
            @change=${p=>{let c={...this._consumesParts};p.target.checked?c[i]=c[i]||o:delete c[i],this._consumesParts=c}}
          />
          <span>${e.name}${e.unit?` (${e.unit})`:""}</span>
        </label>
        ${n!==void 0?l`<input
              class="consumes-qty"
              type="number"
              min="0.01"
              max="999"
              step="0.01"
              .value=${String(n.quantity)}
              @input=${p=>{let c=parseFloat(p.target.value);this._consumesParts={...this._consumesParts,[i]:{...o,quantity:Number.isFinite(c)&&c>=.01?c:1}}}}
            />`:_}
      </div>
    `}_toggleRequired(e,t){let i=new Set(this._requiredCompletion);t?i.add(e):i.delete(e),this._requiredCompletion=[...i]}_patchReading(e,t){this._readings=this._readings.map(i=>i.id===e?{...i,...t}:i)}_renderReadingsEditor(e){let t=Ji(this._readings);return l`
      <div class="readings-editor">
        <div class="field-label">${a("readings_section",e)}</div>
        <div class="field-help">${a("readings_hint",e)}</div>
        ${this._readings.map(i=>l`
          ${t.has(i.id)?l`<div class="field-help reading-dup">${a("reading_duplicate_name",e)}</div>`:_}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${a("reading_name_label",e)}"
              .value=${i.name}
              @input=${n=>this._patchReading(i.id,{name:n.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${a("reading_unit_short",e)}"
              .value=${i.unit||""}
              @input=${n=>this._patchReading(i.id,{unit:n.target.value})}
            ></ms-textfield>
            <mwc-icon-button class="phase-remove reading-remove" @click=${()=>this._readings=this._readings.filter(n=>n.id!==i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </mwc-icon-button>
          </div>
        `)}
        ${this._readings.length<20?l`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:Wi(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${a("reading_add",e)}
          </ha-button>`:_}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",i=t,n=2;for(;this._phaseDefs.some(o=>o.id===i);)i=`${t}-${n++}`;return i}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(i=>i.id===e?{...i,...t}:i)}_renderPhasesEditor(e){let t=i=>this._phaseDefs.find(n=>n.id===i)?.name||i;return l`
      <h3>${a("phases_section",e)}</h3>
      <div class="field-help">${a("phases_hint",e)}</div>
      ${this._phaseDefs.map(i=>l`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${a("phase_name",e)}"
              .value=${i.name}
              @input=${n=>this._patchPhaseDef(i.id,{name:n.target.value})}
            ></ms-textfield>
            ${this.parts.length?l`
              <select
                class="phase-part"
                .value=${i.partId}
                @change=${n=>this._patchPhaseDef(i.id,{partId:n.target.value})}
              >
                <option value="">—</option>
                ${this.parts.map(n=>l`<option value=${n.id} ?selected=${n.id===i.partId}>${n.name}</option>`)}
              </select>
              ${i.partId?l`
                <input class="phase-qty" type="number" min="0.01" step="0.01" .value=${i.partQty||"1"}
                  @input=${n=>this._patchPhaseDef(i.id,{partQty:n.target.value})} />
              `:_}
            `:_}
            <mwc-icon-button class="phase-remove" @click=${()=>this._removePhaseDef(i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </mwc-icon-button>
          </div>
          ${this.checklistsEnabled?l`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${a("checklist_placeholder",e)}"
              .value=${i.checklistText}
              @input=${n=>this._patchPhaseDef(i.id,{checklistText:n.target.value})}
            ></textarea>
          `:_}
          <label class="req-option phase-req-toggle">
            <input
              type="checkbox"
              .checked=${i.reqOverride}
              @change=${n=>this._patchPhaseDef(i.id,{reqOverride:n.target.checked})}
            />
            <span>${a("phase_require_override",e)}</span>
          </label>
          ${i.reqOverride?l`
            <div class="required-completion phase-req-fields">
              ${Lt.map(n=>l`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${i.reqFields.includes(n)}
                    @change=${o=>{let p=o.target.checked,c=new Set(i.reqFields);p?c.add(n):c.delete(n),this._patchPhaseDef(i.id,{reqFields:[...c]})}}
                  />
                  <span>${a(Ke[n],e)}</span>
                </label>
              `)}
            </div>
          `:_}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${a("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(i=>i.name.trim())?l`
        <div class="phase-seq-label">${a("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((i,n)=>l`
            <span class="phase-chip">
              ${n+1}. ${t(i)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((o,p)=>p!==n)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            .value=${""}
            @change=${i=>{let n=i.target.value;n&&(this._phaseSeq=[...this._phaseSeq,n]),i.target.value=""}}
          >
            <option value="">+ ${a("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(i=>i.name.trim()).map(i=>l`<option value=${i.id}>${i.name}</option>`)}
          </select>
        </div>
      `:_}
    `}async _save(){if(!this._loading&&this._name.trim()){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let e=parseInt(this._adaptiveMin,10),t=parseInt(this._adaptiveMax,10);if(!isNaN(e)&&!isNaN(t)&&e>t){this._error=`${a("adaptive_min_interval",this._lang)} > ${a("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=a("trigger_hint_overlap",this._lang);return}this._loading=!0,this._error="";try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):qt.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.priority=this._priority,e.labels=this._labels.split(",").map(p=>p.trim()).filter(Boolean),e.enabled=this._enabled,e.last_performed=this._lastPerformed||null,e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip,e.reading_unit=this._readingUnit.trim()||null,e.readings=Zi(this._readings);{let p={};for(let u of this._phaseDefs){if(!u.name.trim())continue;let m={...u.carry,name:u.name.trim()},f=u.checklistText.split(`
`).map(v=>v.trim()).filter(Boolean);f.length&&(m.checklist=f);let x=[];if(u.partId){let v=parseFloat(u.partQty);x.push({part_id:u.partId,quantity:Number.isFinite(v)&&v>0?v:1})}for(let v of u.extraParts)x.push(v.entry_id?{part_id:v.part_id,quantity:v.quantity,entry_id:v.entry_id}:{part_id:v.part_id,quantity:v.quantity});x.length&&(m.consumes_parts=x),u.reqOverride&&(m.required_completion_fields=[...u.reqFields]),p[u.id]=m}let c=this._phaseSeq.filter(u=>u in p);e.phases=Object.keys(p).length&&c.length?p:null,e.phase_sequence=e.phases?c:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(p=>p.entry_id?{part_id:p.part_id,quantity:p.quantity,entry_id:p.entry_id}:{part_id:p.part_id,quantity:p.quantity})),e.responsible_user_id=this._responsibleUserId,e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let p=this._compoundConditions.map(Ns).filter(c=>c!==null);if(p.length>0){let c={type:"compound",compound_logic:this._compoundLogic,conditions:p};this._autoCompleteOnRecovery&&(c.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(c.trigger_combinator="all"),e.trigger_config=c}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let p=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],c={entity_id:p[0],entity_ids:p,type:this._triggerType};if(this._triggerAttribute&&(c.attribute=this._triggerAttribute),this._autoCompleteOnRecovery&&(c.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(c.trigger_combinator="all"),p.length>1&&(c.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let u=parseFloat(this._triggerAbove);isNaN(u)||(c.trigger_above=u)}if(this._triggerBelow){let u=parseFloat(this._triggerBelow);isNaN(u)||(c.trigger_below=u)}if(this._triggerEquals){let u=parseFloat(this._triggerEquals);isNaN(u)||(c.trigger_equals=u)}if(this._triggerNotEquals){let u=parseFloat(this._triggerNotEquals);isNaN(u)||(c.trigger_not_equals=u)}if(this._triggerForMinutes){let u=parseInt(this._triggerForMinutes,10);isNaN(u)||(c.trigger_for_minutes=u)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let u=parseFloat(this._triggerTargetValue);isNaN(u)||(c.trigger_target_value=u)}if(c.trigger_delta_mode=this._triggerDeltaMode,this._triggerDeltaMode&&this._triggerBaselineValue){let u=parseFloat(this._triggerBaselineValue);!isNaN(u)&&u>=0&&(c.trigger_baseline_value=u)}}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(c.trigger_from_state=this._triggerFromState),this._triggerToState&&(c.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let u=parseInt(this._triggerTargetChanges,10);isNaN(u)||(c.trigger_target_changes=u)}if(this._triggerForMinutes){let u=parseInt(this._triggerForMinutes,10);isNaN(u)||(c.trigger_for_minutes=u)}}else if(this._triggerType==="runtime"){if(this._triggerRuntimeHours){let m=parseFloat(this._triggerRuntimeHours);isNaN(m)||(c.trigger_runtime_hours=m)}if(this._triggerRuntimeMaxSession){let m=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(m)&&m>0&&(c.trigger_runtime_max_session_seconds=m)}let u=this._triggerOnStates.split(",").map(m=>m.trim()).filter(Boolean);u.length>0&&(c.trigger_on_states=u)}e.trigger_config=c}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let p=this._scheduleTime.trim();e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(p)?p:null}if(this.checklistsEnabled){let p=this._checklistText.split(`
`).map(c=>c.trim()).filter(Boolean).slice(0,100);e.checklist=p.length?p:null}if(this.completionActionsEnabled){let p=this._actionService.trim();if(p&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(p)){let f={service:p},x=this._actionTargetEntity.trim();x&&(f.target={entity_id:x});let v=this._buildActionData();Object.keys(v).length>0&&(f.data=v),e.on_complete_action=f}else e.on_complete_action=null;let c={};this._qcNotes.trim()&&(c.notes=this._qcNotes.trim());let u=parseFloat(this._qcCost);!isNaN(u)&&u>=0&&(c.cost=u);let m=parseInt(this._qcDuration,10);!isNaN(m)&&m>=0&&(c.duration=m),this._qcFeedback&&(c.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(c).length?c:null}let i=await this.hass.connection.sendMessagePromise(e),n=this._taskId||i?.task_id,o=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(n&&this._scheduleType==="sensor_based"&&o)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:n,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}if(n&&this._adaptiveSnapshot()!==this._adaptiveInitial){let p=parseFloat(this._adaptiveAlpha),c=parseInt(this._adaptiveMin,10),u=parseInt(this._adaptiveMax,10);try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:n,enabled:this._adaptiveEnabled,...p>=.1&&p<=.9?{ewa_alpha:p}:{},...!isNaN(c)&&c>=1?{min_interval_days:c}:{},...!isNaN(u)&&u>=1?{max_interval_days:u}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction}),this._adaptiveInitial=this._adaptiveSnapshot()}catch{}}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(e){this._error=O(e,this._lang,a("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1,this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return _;let e=this._lang,t=this._triggerType==="compound";return l`
      <h3>${a("trigger_configuration",e)}</h3>
      <div class="select-row">
        <label>${a("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${i=>this._triggerType=i.target.value}
        >
          ${Ps.map(i=>l`<option value=${i} ?selected=${i===this._triggerType}>${a(i,e)}</option>`)}
        </select>
      </div>
      ${t?this._renderCompoundEditor():l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${a("entity_id",e)} (${a("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${i=>{let o=i.target.value.split(",").map(p=>p.trim()).filter(Boolean);this._triggerEntityId=o[0]||"",this._triggerEntityIds=o,o[0]&&this._fetchEntityAttributes(o[0])}}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:Pt}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>a("entity_id",e)}
          @value-changed=${i=>{let n=(i.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=n[0]||"",this._triggerEntityIds=n,n[0]?this._fetchEntityAttributes(n[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?l`
          <div class="select-row">
            <label>${a("entity_logic",e)}</label>
            <select
              .value=${this._triggerEntityLogic}
              @change=${i=>this._triggerEntityLogic=i.target.value}
            >
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${a("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${a("entity_logic_all",e)}</option>
            </select>
          </div>
        `:_}
        ${this._renderAttributeSelect({label:a("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:i=>this._triggerAttribute=i})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      <label>
        <input
          type="checkbox"
          .checked=${this._autoCompleteOnRecovery}
          @change=${i=>this._autoCompleteOnRecovery=i.target.checked}
        />
        ${a("auto_complete_on_recovery",e)}
      </label>
      <div class="field-help">${a("auto_complete_on_recovery_help",e)}</div>
      <ms-textfield
        label="${a("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${i=>this._intervalDays=i.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():_}
      ${this._intervalDays?l`
            <div class="select-row">
              <label>${a("trigger_combinator",e)}</label>
              <select
                @change=${i=>this._triggerCombinator=i.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${a("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${a("trigger_combinator_all",e)}</option>
              </select>
            </div>
          `:_}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((i,n)=>n===e?{...i,...t}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,Ls()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,i)=>i!==e)}_renderCompoundEditor(){let e=this._lang;return l`
      <div class="select-row">
        <label>${a("compound_logic",e)}</label>
        <select
          .value=${this._compoundLogic}
          @change=${t=>this._compoundLogic=t.target.value}
        >
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${a("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${a("compound_logic_or",e)}</option>
        </select>
      </div>
      <div class="field-help">${a("compound_help",e)}</div>
      ${this._compoundConditions.length===0?l`<div class="field-help">${a("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,i)=>this._renderCondition(t,i))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${a("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let i=this._lang,n=t+1;return l`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${a("compound_condition",i)} ${n}</span>
          <button
            type="button"
            class="icon-btn"
            title="${a("compound_remove_condition",i)}"
            @click=${()=>this._removeCondition(t)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${a("entity_id",i)} (${a("comma_separated",i)})"
            .value=${e.entityIds}
            @input=${o=>this._patchCondition(t,{entityIds:o.target.value})}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:Pt}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(o=>o.trim()).filter(Boolean)}}
          .computeLabel=${()=>a("entity_id",i)}
          @value-changed=${o=>{let p=(o.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:p.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          <label>${a("trigger_type",i)}</label>
          <select
            .value=${e.type}
            @change=${o=>this._patchCondition(t,{type:o.target.value})}
          >
            ${cr.map(o=>l`<option value=${o} ?selected=${o===e.type}>${a(o,i)}</option>`)}
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
          label="${a("runtime_on_states",t)}"
          placeholder="on"
          .value=${e.value}
          @input=${i=>e.onInput(i.target.value)}
        ></ms-textfield>
      `:l`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(i=>i.trim()).filter(Boolean)}}
        .computeLabel=${()=>a("runtime_on_states",t)}
        @value-changed=${i=>e.onInput((i.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?_:l`
      <details class="adaptive-section" ?open=${this._adaptiveEnabled}>
        <summary>${a("adaptive_section_title",e)}</summary>
        <label>
          <input
            type="checkbox"
            .checked=${this._adaptiveEnabled}
            @change=${t=>this._adaptiveEnabled=t.target.checked}
          />
          ${a("adaptive_enabled",e)}
        </label>
        ${this._adaptiveEnabled?l`
          <ms-textfield
            label="${a("adaptive_min_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMin}
            @input=${t=>this._adaptiveMin=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("adaptive_max_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMax}
            @input=${t=>this._adaptiveMax=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("adaptive_ewa_alpha",e)}"
            type="number"
            min="0.1"
            max="0.9"
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${t=>this._adaptiveAlpha=t.target.value}
          ></ms-textfield>
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptiveSeasonal}
              @change=${t=>this._adaptiveSeasonal=t.target.checked}
            />
            ${a("adaptive_seasonal_enabled",e)}
          </label>
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptivePrediction}
              @change=${t=>this._adaptivePrediction=t.target.checked}
            />
            ${a("adaptive_prediction_enabled",e)}
          </label>
        `:_}
      </details>
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?l`
        <div class="select-row">
          <label>${e.label}</label>
          <select
            .value=${e.value}
            @change=${i=>e.onSelect(i.target.value)}
          >
            <option value="" ?selected=${!e.value}>${a("use_entity_state",t)}</option>
            ${e.suggested.map(i=>l`<option value=${i} ?selected=${i===e.value}>${i} ★</option>`)}
            ${e.available.filter(i=>!e.suggested.includes(i.name)).map(i=>l`<option value=${i.name} ?selected=${i.name===e.value}>${i.name}${i.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:l`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${i=>e.onSelect(i.target.value.trim())}
      ></ms-textfield>
    `}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:a("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:i=>this._environmentalAttribute=i})}_renderConditionAttribute(e,t){let i=e.entityIds.split(",")[0]?.trim()||"";i&&this._fetchConditionAttributes(i);let n=i?this._conditionAttrOptions[i]:void 0;return this._renderAttributeSelect({label:a("attribute_optional",this._lang),value:e.attribute,suggested:n?.suggested??[],available:n?.available??[],onSelect:o=>this._patchCondition(t,{attribute:o})})}_renderConditionTypeFields(e,t){let i=this._lang;if(e.type==="threshold")return l`
        <ms-textfield label="${a("trigger_above",i)}" type="number" .value=${e.above}
          @input=${n=>this._patchCondition(t,{above:n.target.value})}></ms-textfield>
        <ms-textfield label="${a("trigger_below",i)}" type="number" .value=${e.below}
          @input=${n=>this._patchCondition(t,{below:n.target.value})}></ms-textfield>
        <ms-textfield label="${a("trigger_equals",i)}" type="number" .value=${e.equals}
          @input=${n=>this._patchCondition(t,{equals:n.target.value})}></ms-textfield>
        <ms-textfield label="${a("trigger_not_equals",i)}" type="number" .value=${e.notEquals}
          @input=${n=>this._patchCondition(t,{notEquals:n.target.value})}></ms-textfield>
        <ms-textfield label="${a("for_minutes",i)}" type="number" .value=${e.forMinutes}
          @input=${n=>this._patchCondition(t,{forMinutes:n.target.value})}></ms-textfield>
      `;if(e.type==="counter")return l`
        <ms-textfield label="${a("target_value",i)}" type="number" .value=${e.targetValue}
          @input=${n=>this._patchCondition(t,{targetValue:n.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${e.deltaMode}
            @change=${n=>this._patchCondition(t,{deltaMode:n.target.checked})} />
          ${a("delta_mode",i)}
        </label>
      `;if(e.type==="state_change"){let n=e.entityIds.split(",")[0]?.trim()||"";return l`
        ${this._renderStateField({label:a("from_state_optional",i),value:e.fromState,entityId:n,onInput:o=>this._patchCondition(t,{fromState:o})})}
        ${this._renderStateField({label:a("to_state_optional",i),value:e.toState,entityId:n,onInput:o=>this._patchCondition(t,{toState:o})})}
        <ms-textfield label="${a("target_changes",i)}" type="number" .value=${e.targetChanges}
          @input=${o=>this._patchCondition(t,{targetChanges:o.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let n=e.entityIds.split(",")[0]?.trim()||"";return l`
        <ms-textfield label="${a("runtime_hours",i)}" type="number" .value=${e.runtimeHours}
          @input=${o=>this._patchCondition(t,{runtimeHours:o.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:n,onInput:o=>this._patchCondition(t,{onStates:o})})}
      `}return _}_renderUnitSelect(){let e=this._lang;return l`
      <div class="select-row">
        <label>${a("interval_unit",e)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${t=>this._intervalUnit=t.target.value}
        >
          ${["days","weeks","months","years"].map(t=>l`<option value=${t} ?selected=${t===this._intervalUnit}>${a("unit_"+t,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(qt.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(g._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let i=(c,u,m=0)=>{if(!(!c||m>10)){(c.tagName?.toLowerCase()??"")==="ha-entity-picker"&&u.push(c);for(let f of[c.shadowRoot,c])if(f)for(let x of Array.from(f.children??[]))i(x,u,m+1)}},n=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],o=[];for(let c of n)i(c,o);let p=o.length===0||o.some(c=>c.offsetHeight===0);if(e.offsetHeight===0||p){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(t!==this._previewSeq)return;this._schedulePreview=i.occurrences||[],this._schedulePreviewEnded=!!i.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return _;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTime?` ${this._scheduleTime}`:"",i=this._schedulePreview.map((o,p)=>{let c=new Date(`${o}T12:00:00`).getDay();return`${ke(c===0?6:c-1,e,"short")} ${te(o,e)}${p===0?t:""}`}).join(" \xB7 "),n=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?l`<div class="field-help">${a("schedule_preview_ontime",e)}</div>`:_;return l`
      <div class="trigger-live-hint schedule-preview">
        ${a("schedule_preview_title",e)}: ${i}${this._schedulePreviewEnded?l` <span class="field-help">${a("schedule_preview_ends",e)}</span>`:_}
        ${n}
      </div>
    `}_buildSchedule(){let e=i=>{let n=parseInt(this._calOffset,10)||0;return n&&(i.offset=Math.max(-15,Math.min(n,15))),i};if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((i,n)=>i-n)});if(this._scheduleType==="nth_weekday")return e({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});let t={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(t.business=!0),e(t)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,i)=>t-i)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||qt.includes(this._scheduleType)))return _;let i=Hs(e);return l`
      <label class="field-label">${a("season_window_label",e)}</label>
      <div class="field-help">${a("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${i.map((n,o)=>l`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(o+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(o+1)}
          >${n}</button>`)}
      </div>

      <label class="field-label">${a("series_end_label",e)}</label>
      <div class="select-row">
        <select .value=${this._endsMode}
          @change=${n=>this._endsMode=n.target.value}>
          <option value="never" ?selected=${this._endsMode==="never"}>${a("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${a("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${a("series_end_until",e)}</option>
        </select>
      </div>
      ${this._endsMode==="count"?l`
        <ms-textfield
          label="${a("series_end_count_label",e)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${n=>this._endsCount=n.target.value}
        ></ms-textfield>`:_}
      ${this._endsMode==="until"?l`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${a("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${n=>this._endsUntil=n.detail.value}
        ></ms-date-field>`:_}
    `}_renderCalendarFields(){let e=this._lang,t=js(e);if(this._scheduleType==="weekdays")return l`
        <label class="field-label">${a("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((i,n)=>l`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(n)?"selected":""}"
              @click=${()=>this._toggleWeekday(n)}
            >${i}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let i=[["1",a("ord_1",e)],["2",a("ord_2",e)],["3",a("ord_3",e)],["4",a("ord_4",e)],["5",a("ord_5",e)],["-1",a("ord_last",e)]];return l`
        <div class="select-row">
          <label>${a("recurrence_occurrence",e)}</label>
          <select .value=${this._nth} @change=${n=>this._nth=n.target.value}>
            ${i.map(([n,o])=>l`<option value=${n} ?selected=${n===this._nth}>${o}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${a("recurrence_weekday",e)}</label>
          <select .value=${this._nthWeekday} @change=${n=>this._nthWeekday=n.target.value}>
            ${t.map((n,o)=>l`<option value=${String(o)} ?selected=${String(o)===this._nthWeekday}>${n}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`}return this._scheduleType==="day_of_month"?l`
        ${this._domLastDay?_:l`
          <ms-textfield
            label="${a("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${i=>this._domDay=i.target.value}
          ></ms-textfield>`}
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domLastDay}
            @change=${i=>this._domLastDay=i.target.checked} />
          <span>${a("recurrence_last_day",e)}</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domBusiness}
            @change=${i=>this._domBusiness=i.target.checked} />
          <span>${a("recurrence_business_day",e)}</span>
        </label>
        ${this._renderCalOffsetField()}`:_}_renderCalOffsetField(){let e=this._lang;return l`
      <ms-textfield
        label="${a("recurrence_offset",e)}"
        helper="${a("recurrence_offset_help",e)}"
        type="number"
        min="-15"
        max="15"
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return _;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?l`<div class="trigger-live-hint warn">${a("trigger_hint_overlap",this._lang)}</div>`:_,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let i=this.hass.states[t];if(!i)return e;let n=this._lang,o=i.attributes?.unit_of_measurement,p=typeof o=="string"&&o?` ${o}`:"",c=this._triggerAttribute?i.attributes?.[this._triggerAttribute]:i.state,u=typeof c=="number"?c:parseFloat(String(c)),m=c!=="unknown"&&c!=="unavailable"&&c!=null&&!isNaN(u),f=v=>P(v,n,{maximumFractionDigits:1}),x=[];if(this._triggerType==="threshold"){let v=parseFloat(this._triggerAbove),k=parseFloat(this._triggerBelow);if(isNaN(v)&&isNaN(k))return _;m&&x.push(a("trigger_hint_now",n).replace("{value}",f(u)+p)),isNaN(v)||x.push(a("trigger_hint_above",n).replace("{target}",f(v)+p)),isNaN(k)||x.push(a("trigger_hint_below",n).replace("{target}",f(k)+p))}else if(this._triggerType==="counter"){let v=parseFloat(this._triggerTargetValue);if(isNaN(v))return _;this._triggerDeltaMode?this._taskId?x.push(a("trigger_hint_counter_delta_edit",n).replace("{target}",f(v)+p)):m?x.push(a("trigger_hint_counter_delta",n).replace("{value}",f(u)+p).replace("{due}",f(u+v)+p).replace("{target}",f(v)+p)):x.push(a("trigger_hint_counter_delta_edit",n).replace("{target}",f(v)+p)):(m&&x.push(a("trigger_hint_now",n).replace("{value}",f(u)+p)),x.push(a("trigger_hint_counter_abs",n).replace("{target}",f(v)+p)))}else if(this._triggerType==="runtime"){let v=parseFloat(this._triggerRuntimeHours);if(isNaN(v))return _;x.push(a("trigger_hint_runtime",n).replace("{hours}",f(v))),x.push(a("trigger_hint_state_now",n).replace("{value}",String(i.state)))}else if(this._triggerType==="state_change"){let v=parseInt(this._triggerTargetChanges,10)||1,k=this._triggerToState.trim();x.push((k?a("trigger_hint_state_change_to",n).replace("{state}",k):a("trigger_hint_state_change",n)).replace("{count}",String(v))),x.push(a("trigger_hint_state_now",n).replace("{value}",String(i.state)))}return x.length?l`<div class="trigger-live-hint">${x.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?l`
        <ms-textfield
          label="${a("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${t=>this._triggerAbove=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${a("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${t=>this._triggerBelow=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${a("trigger_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerEquals}
          @input=${t=>this._triggerEquals=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${a("trigger_not_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerNotEquals}
          @input=${t=>this._triggerNotEquals=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${a("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?l`
        <ms-textfield
          label="${a("target_value",e)}"
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
          ${a("delta_mode",e)}
        </label>
        ${this._triggerDeltaMode?l`
              <ms-textfield
                label="${a("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${t=>this._triggerBaselineValue=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?a("baseline_start_help_edit",e):a("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?l`<div class="baseline-effective">
                      ${a("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:_}
              </div>
            `:_}
      `:this._triggerType==="state_change"?l`
        ${this._renderStateField({label:a("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:t=>this._triggerFromState=t})}
        <div class="field-help">${a("state_value_help",e)}</div>
        ${this._renderStateField({label:a("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:t=>this._triggerToState=t})}
        <ms-textfield
          label="${a("target_changes",e)}"
          type="number"
          min="1"
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${a("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?l`<div class="field-help">${a("state_latch_help",e)}</div>`:_}
        <ms-textfield
          label="${a("for_at_least_minutes",e)}"
          type="number"
          min="0"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
        <div class="field-help">${a("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?l`
        <ms-textfield
          label="${a("runtime_hours",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${t=>this._triggerRuntimeHours=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${a("runtime_max_session",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeMaxSession}
          @input=${t=>this._triggerRuntimeMaxSession=t.target.value}
        ></ms-textfield>
        <div class="field-help">${a("runtime_max_session_help",e)}</div>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:t=>this._triggerOnStates=t})}
        <div class="field-help">${a("runtime_on_states_help",e)}</div>
      `:_}render(){if(!this._open)return l``;let e=this._lang,t=this._taskId?a("edit_task",e):a("new_task",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:_}
          ${this._taskId===null&&this._objectChoices.length>0?l`
            <div class="select-row">
              <label>${a("object",e)}</label>
              <select
                .value=${this._entryId}
                @change=${i=>{this._entryId=i.target.value,this._consumesParts={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(i=>l`<option value=${i.entry_id} ?selected=${i.entry_id===this._entryId}>${i.name}</option>`)}
              </select>
            </div>
          `:_}
          <ms-textfield
            label="${a("task_name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${a("maintenance_type",e)}</label>
            <select
              .value=${this._type}
              @change=${i=>this._type=i.target.value}
            >
              ${Ts.map(i=>l`<option value=${i} ?selected=${i===this._type}>${a(i,e)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?l`
                <ms-textfield
                  label="${a("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${i=>this._readingUnit=i.target.value}
                ></ms-textfield>
                <div class="field-help">${a("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:_}
          ${this._partsLoadFailed?l`<div class="field-help parts-load-failed">${a("parts_load_failed",e)}</div>`:_}
          ${this.parts.length||this._foreignOwners.length?l`
                <div class="field">
                  <label>${a("consumes_parts_label",e)}</label>
                  ${this.parts.map(i=>this._renderConsumesRow(i))}
                  ${this._foreignOwners.length?l`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${a("shared_parts_other_objects",e)}</summary>
                          <div class="field-help">${a("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(i=>l`
                              <div class="shared-pool-owner">${i.name}</div>
                              ${i.parts.map(n=>this._renderConsumesRow(n,i.entry_id))}
                            `)}
                        </details>
                      `:_}
                </div>
              `:_}
          <div class="select-row">
            <label>${a("priority",e)}</label>
            <select
              .value=${this._priority}
              @change=${i=>this._priority=i.target.value}
            >
              ${Cs.map(i=>l`<option value=${i} ?selected=${i===this._priority}>${a("priority_"+i,e)}</option>`)}
            </select>
          </div>
          <div class="field">
            <label>${a("labels",e)}</label>
            <input
              type="text"
              .value=${this._labels}
              placeholder="${a("labels_placeholder",e)}"
              @input=${i=>this._labels=i.target.value}
            />
            <div class="field-help">${a("labels_help",e)}</div>
          </div>
          <div class="select-row">
            <label>${a("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${i=>this._scheduleType=i.target.value}
            >
              ${Is.map(i=>l`<option value=${i} ?selected=${i===this._scheduleType}>${a(i,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?l`
                <ms-textfield
                  label="${a("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${i=>this._intervalDays=i.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${a("interval_anchor",e)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${i=>this._intervalAnchor=i.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${a("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${a("anchor_planned",e)}</option>
                  </select>
                </div>
                ${this.scheduleTimeEnabled?l`
                  <ms-date-field
                    kind="time"
                    clearable
                    .hass=${this.hass}
                    .lang=${e}
                    label="${a("schedule_time_optional",e)}"
                    .value=${this._scheduleTime}
                    helper="${a("schedule_time_help",e)}"
                    @value-changed=${i=>this._scheduleTime=i.detail.value}
                  ></ms-date-field>
                `:_}
              `:_}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?l`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${e}
                  label="${a("due_date",e)}"
                  .value=${this._dueDate}
                  @value-changed=${i=>this._dueDate=i.detail.value}
                ></ms-date-field>
              `:_}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-textfield
            label="${a("warning_days",e)}"
            type="number"
            min="0"
            max="365"
            .value=${this._warningDays}
            @input=${i=>this._warningDays=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("earliest_completion_days",e)}"
            helper="${a("earliest_completion_days_help",e)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${i=>this._earliestCompletionDays=i.target.value}
          ></ms-textfield>
          ${this.checklistsEnabled?l`
            <h3>${a("checklist_steps_optional",e)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${a("checklist_placeholder",e)}"
              .value=${this._checklistText}
              @input=${i=>this._checklistText=i.target.value}
            ></textarea>
            <div class="field-help">${a("checklist_help",e)}</div>
          `:_}
          ${this._renderPhasesEditor(e)}
          <h3>${a("require_on_completion",e)}</h3>
          <div class="required-completion">
            ${Lt.map(i=>l`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(i)}
                  @change=${n=>this._toggleRequired(i,n.target.checked)}
                />
                <span>${a(Ke[i],e)}</span>
              </label>
            `)}
          </div>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${a("last_performed_optional",e)}"
            .value=${this._lastPerformed}
            @value-changed=${i=>this._lastPerformed=i.detail.value}
          ></ms-date-field>
          <div class="select-row">
            <label>${a("responsible_user",e)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${i=>{let n=i.target.value;this._responsibleUserId=n||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${a("no_user_assigned",e)}</option>
              ${this._availableUsers.map(i=>l`<option value=${i.id} ?selected=${i.id===this._responsibleUserId}>${i.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?l`
            <div class="field">
              <label>${a("shared_with",e)}</label>
              <div class="field-help">${a("shared_with_help",e)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map(i=>l`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(i.id)}
                      @change=${()=>this._toggleAssignee(i.id)} />
                    <span>${i.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?l`
              <div class="select-row">
                <label>${a("rotation_strategy",e)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${i=>this._rotationStrategy=i.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${a("rotation_none",e)}</option>
                  ${["round_robin","least_completed","random"].map(i=>l`<option value=${i} ?selected=${i===this._rotationStrategy}>${a("rotation_"+i,e)}</option>`)}
                </select>
              </div>`:_}
          `:_}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?l`
            ${this._entityPickerFallback?l`
              <ms-textfield
                label="${a("environmental_entity_optional",e)}"
                helper="${a("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${i=>this._environmentalEntity=i.target.value.trim()}
              ></ms-textfield>
            `:l`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:or,device_class:lr}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>a("environmental_entity_optional",e)}
              .computeHelper=${()=>a("environmental_entity_helper",e)}
              @value-changed=${i=>{this._environmentalEntity=(i.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):_}
          `:_}
          ${this._renderAdaptiveSection(e)}
          <ms-textfield
            label="${a("notes_optional",e)}"
            multiline
            .rows=${3}
            .helper=${a("notes_markdown_hint",e)}
            .value=${this._notes}
            @input=${i=>this._notes=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${a("documentation_url_optional",e)}"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ms-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${a("custom_icon_optional",e)}"
            .value=${this._customIcon}
            @value-changed=${i=>this._customIcon=i.detail.value||""}
          ></ha-icon-picker>
          ${this._availableTags.length>0?l`
              <div class="select-row">
                <label>${a("nfc_tag_id_optional",e)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${i=>this._nfcTagId=i.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${a("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(i=>l`<option value=${i.id} ?selected=${i.id===this._nfcTagId}>${i.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${a("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:l`
              <ms-textfield
                label="${a("nfc_tag_id_optional",e)}"
                .value=${this._nfcTagId}
                @input=${i=>this._nfcTagId=i.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${a("nfc_tags_empty_help",e)}
                <a href="/config/tags">${a("nfc_tags_open_settings",e)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${a("nfc_tags_refresh",e)}
                </button>
              </div>
            `}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${this._requireTagScan}
              @change=${i=>this._requireTagScan=i.target.checked}
            />
            <span>${a("require_tag_scan",e)}</span>
          </label>
          ${this._requireTagScan?l`<div class="field-help">${a("require_tag_scan_help",e)}</div>`:_}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${i=>this._allowSkip=!i.target.checked}
            />
            <span>${a("disallow_skip",e)}</span>
          </label>
          ${this._allowSkip?_:l`<div class="field-help">${a("disallow_skip_help",e)}</div>`}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${i=>this._enabled=i.target.checked}
            />
            ${a("task_enabled",e)}
          </label>
          ${this._renderCompletionActionsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${a("cancel",e)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?a("saving",e):a("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};g._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),g.styles=E`
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
    .adaptive-section {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 8px;
    }
    .ca-section > summary,
    .adaptive-section > summary {
      cursor: pointer;
      font-weight: 500;
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
    .field-help {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
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
    .assignee-pool {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      margin-top: 4px;
    }
    .checkbox-row {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      cursor: pointer;
      margin: 2px 0;
    }
    .checkbox-row input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .pool-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .pool-item input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
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
    .field-label {
      font-size: 12px;
      color: var(--secondary-text-color);
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
  `,d([y({attribute:!1})],g.prototype,"hass",2),d([y({type:Boolean,attribute:"checklists-enabled"})],g.prototype,"checklistsEnabled",2),d([y({type:Boolean,attribute:"schedule-time-enabled"})],g.prototype,"scheduleTimeEnabled",2),d([y({type:Boolean,attribute:"completion-actions-enabled"})],g.prototype,"completionActionsEnabled",2),d([y({type:Number,attribute:"default-warning-days"})],g.prototype,"defaultWarningDays",2),d([h()],g.prototype,"parts",2),d([h()],g.prototype,"_foreignOwners",2),d([h()],g.prototype,"_open",2),d([h()],g.prototype,"_entityPickerFallback",2),d([h()],g.prototype,"_loading",2),d([h()],g.prototype,"_error",2),d([h()],g.prototype,"_entryId",2),d([h()],g.prototype,"_taskId",2),d([h()],g.prototype,"_objectChoices",2),d([h()],g.prototype,"_name",2),d([h()],g.prototype,"_type",2),d([h()],g.prototype,"_scheduleType",2),d([h()],g.prototype,"_intervalDays",2),d([h()],g.prototype,"_intervalUnit",2),d([h()],g.prototype,"_dueDate",2),d([h()],g.prototype,"_warningDays",2),d([h()],g.prototype,"_earliestCompletionDays",2),d([h()],g.prototype,"_intervalAnchor",2),d([h()],g.prototype,"_weekdays",2),d([h()],g.prototype,"_nth",2),d([h()],g.prototype,"_nthWeekday",2),d([h()],g.prototype,"_domDay",2),d([h()],g.prototype,"_domLastDay",2),d([h()],g.prototype,"_domBusiness",2),d([h()],g.prototype,"_calOffset",2),d([h()],g.prototype,"_seasonMonths",2),d([h()],g.prototype,"_endsMode",2),d([h()],g.prototype,"_endsCount",2),d([h()],g.prototype,"_endsUntil",2),d([h()],g.prototype,"_schedulePreview",2),d([h()],g.prototype,"_schedulePreviewEnded",2),d([h()],g.prototype,"_notes",2),d([h()],g.prototype,"_documentationUrl",2),d([h()],g.prototype,"_customIcon",2),d([h()],g.prototype,"_priority",2),d([h()],g.prototype,"_labels",2),d([h()],g.prototype,"_enabled",2),d([h()],g.prototype,"_triggerEntityId",2),d([h()],g.prototype,"_triggerEntityIds",2),d([h()],g.prototype,"_triggerEntityLogic",2),d([h()],g.prototype,"_triggerAttribute",2),d([h()],g.prototype,"_triggerType",2),d([h()],g.prototype,"_triggerAbove",2),d([h()],g.prototype,"_triggerBelow",2),d([h()],g.prototype,"_triggerEquals",2),d([h()],g.prototype,"_triggerNotEquals",2),d([h()],g.prototype,"_triggerForMinutes",2),d([h()],g.prototype,"_triggerCombinator",2),d([h()],g.prototype,"_triggerTargetValue",2),d([h()],g.prototype,"_triggerDeltaMode",2),d([h()],g.prototype,"_triggerBaselineValue",2),d([h()],g.prototype,"_liveBaselineValue",2),d([h()],g.prototype,"_autoCompleteOnRecovery",2),d([h()],g.prototype,"_triggerFromState",2),d([h()],g.prototype,"_triggerToState",2),d([h()],g.prototype,"_triggerTargetChanges",2),d([h()],g.prototype,"_triggerRuntimeHours",2),d([h()],g.prototype,"_triggerRuntimeMaxSession",2),d([h()],g.prototype,"_triggerOnStates",2),d([h()],g.prototype,"_compoundLogic",2),d([h()],g.prototype,"_compoundConditions",2),d([h()],g.prototype,"_suggestedAttributes",2),d([h()],g.prototype,"_availableAttributes",2),d([h()],g.prototype,"_entityDomain",2),d([h()],g.prototype,"_lastPerformed",2),d([h()],g.prototype,"_nfcTagId",2),d([h()],g.prototype,"_requireTagScan",2),d([h()],g.prototype,"_allowSkip",2),d([h()],g.prototype,"_readingUnit",2),d([h()],g.prototype,"_readings",2),d([h()],g.prototype,"_consumesParts",2),d([h()],g.prototype,"_partsLoadFailed",2),d([h()],g.prototype,"_availableTags",2),d([h()],g.prototype,"_responsibleUserId",2),d([h()],g.prototype,"_assigneePool",2),d([h()],g.prototype,"_rotationStrategy",2),d([h()],g.prototype,"_availableUsers",2),d([h()],g.prototype,"_checklistText",2),d([h()],g.prototype,"_phaseDefs",2),d([h()],g.prototype,"_phaseSeq",2),d([h()],g.prototype,"_requiredCompletion",2),d([h()],g.prototype,"_scheduleTime",2),d([h()],g.prototype,"_actionService",2),d([h()],g.prototype,"_actionTargetEntity",2),d([h()],g.prototype,"_actionData",2),d([h()],g.prototype,"_actionDataJsonFallback",2),d([h()],g.prototype,"_actionTesting",2),d([h()],g.prototype,"_actionTestResult",2),d([h()],g.prototype,"_actionTestError",2),d([h()],g.prototype,"_qcNotes",2),d([h()],g.prototype,"_qcCost",2),d([h()],g.prototype,"_qcDuration",2),d([h()],g.prototype,"_qcFeedback",2),d([h()],g.prototype,"_environmentalEntity",2),d([h()],g.prototype,"_environmentalAttribute",2),d([h()],g.prototype,"_adaptiveEnabled",2),d([h()],g.prototype,"_adaptiveAlpha",2),d([h()],g.prototype,"_adaptiveMin",2),d([h()],g.prototype,"_adaptiveMax",2),d([h()],g.prototype,"_adaptiveSeasonal",2),d([h()],g.prototype,"_adaptivePrediction",2),d([h()],g.prototype,"_conditionAttrOptions",2);Nt=g;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",Nt)});async function dt(s,r,e){let t=new FormData;t.append("entry_id",r),t.append("tags","photo"),t.append("file",e,e.name);let i=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${s.auth?.data?.access_token??""}`},body:t});if(i.status===413)throw new Error("doc_too_large");if(!i.ok)throw new Error("doc_upload_failed");let n=await i.json();if(!n.id)throw new Error("doc_upload_failed");return n.id}async function Ae(s,r){await Promise.all(r.map(e=>s.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:e}).catch(()=>{})))}var jt=w(()=>{"use strict";nt()});var $,ur=w(()=>{"use strict";I();V();Ee();q();fe();lt();Rt();jt();Se();$=class extends A{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=[];this._uploadedIds=[];this._photoUploading=!1;this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((t,i)=>[String(i),!!this.checklistPrefill[t]]).filter(([,t])=>t)),this._feedback="needed",this._photos.forEach(t=>URL.revokeObjectURL(t.preview)),this._photos=[],this._uploadedIds=[],this._photoUploading=!1,this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(t=>[G(t),{...t}])))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _onPhotoInput(e){let t=e.target,i=Array.from(t.files??[]);if(t.value="",i.length===0)return;let n=10-this._photos.length,o=i.slice(0,Math.max(n,0));this._photoUploading=!0,this._error="";try{for(let p of o){let c=await dt(this.hass,this.entryId,p);this._uploadedIds=[...this._uploadedIds,c],this._photos=[...this._photos,{id:c,preview:URL.createObjectURL(p)}]}i.length>o.length&&(this._error=a("photos_limit",this.lang).replace("{max}",String(10)))}catch(p){let c=p instanceof Error&&p.message==="doc_too_large"?"doc_too_large":"doc_upload_failed";this._error=a(c,this.lang)}finally{this._photoUploading=!1}}_removePhoto(e){let t=this._photos.find(i=>i.id===e);t&&URL.revokeObjectURL(t.preview),this._photos=this._photos.filter(i=>i.id!==e),this._uploadedIds.includes(e)&&(this._uploadedIds=this._uploadedIds.filter(i=>i!==e),Ae(this.hass,[e]))}async _complete(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}if(this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.length>0&&(e.photo_doc_ids=this._photos.map(t=>t.id)),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=a("completed_at_future_error",this.lang),this._loading=!1;return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let t={};for(let i of this.readings){let n=(this._readingValues[i.id]??"").trim();if(n==="")continue;let o=parseFloat(n.replace(",","."));isNaN(o)||(t[i.id]=o)}Object.keys(t).length>0&&(e.reading_values=t)}else if(this._readingValue!==""){let t=parseFloat(this._readingValue);isNaN(t)||(e.reading_value=t)}if(this.restockDefault!==null&&this._restockQty!==""){let t=parseFloat(this._restockQty);!isNaN(t)&&t>=1&&(e.restock_quantity=t)}this.parts.length>0&&(e.used_parts=Object.values(this._usedParts).filter(t=>Number.isFinite(t.quantity)&&t.quantity>0).map(t=>t.entry_id?{part_id:t.part_id,quantity:t.quantity,entry_id:t.entry_id}:{part_id:t.part_id,quantity:t.quantity})),await this.hass.connection.sendMessagePromise(e),this._uploadedIds=[],this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=O(e,this.lang,a("save_error",this.lang))}finally{this._loading=!1}}_renderReadingField(e,t){let i=this._completedAt?new Date(this._completedAt).getTime():NaN,n=Gi(this.readingHistory,e.id,isNaN(i)?void 0:i),o=e.unit||this.readingUnit,p=(this._readingValues[e.id]??"").trim(),c=p===""?NaN:parseFloat(p.replace(",",".")),u=n!==void 0&&!isNaN(c)&&c<n.value,m=n!==void 0?P(n.value,t,{maximumFractionDigits:3}):"";return l`
      <label class="field reading-field">
        <span class="field-label">${e.name}${o?` (${o})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${n!==void 0?a("reading_last",t).replace("{value}",m):""}
          .value=${this._readingValues[e.id]??""}
          @input=${f=>{this._readingValues={...this._readingValues,[e.id]:f.target.value}}} />
        ${u?l`<span class="reading-warn">${a("reading_below_last",t).replace("{value}",m)}</span>`:_}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_req(e){return this.requiredFields.includes(e)?l`<span class="req-mark" aria-hidden="true">*</span>`:_}_partsCostSuggestion(){if(this.restockDefault!==null){let i=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(i)||i<=0?null:Math.round(this.restockUnitCost*i*100)/100}if(!this.parts.length)return null;let e=0,t=!1;for(let i of Object.values(this._usedParts)){let n=this.parts.find(o=>G({part_id:o.id,entry_id:o.entry_id})===G(i));n?.cost!=null&&(e+=n.cost*(i.quantity||1),t=!0)}return t?Math.round(e*100)/100:null}_renderCostSuggestion(e){if(this._cost.trim()!=="")return _;let t=this._partsCostSuggestion();if(t==null||t<=0)return _;let i=st(t,this.currencySymbol,e);return l`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(t*100)/100)}
    >${a("cost_from_parts",e).replace("{amount}",i)}</button>`}_close(){if(this._open=!1,this._uploadedIds.length>0){let e=this._uploadedIds;this._uploadedIds=[],Ae(this.hass,e)}}_pickCompletedAt(){let e=new Date,t=i=>String(i).padStart(2,"0");this._completedAt=`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}:00`}render(){if(!this._open)return l``;let e=this.lang||this.hass?.language||"en";return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${a("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?l`<div class="phase-line">${a("phase_current",e)}: ${this.phaseLabel}</div>`:_}
        ${this.requireTagScan&&!this.viaTagScan?l`<div class="scan-required-note">${a("require_tag_scan_hint",e)}</div>`:_}
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:_}
          ${this.checklist.length>0?l`
            <div class="checklist-section">
              <label class="checklist-label">${a("checklist",e)}</label>
              ${this.checklist.map((t,i)=>l`
                <label class="checklist-item" @click=${()=>this._toggleCheck(i)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(i)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:_}
          ${this.readings.length>0?l`<div class="readings-block">
                <span class="field-label">${a("readings_section",e)}</span>
                ${this.readings.map(t=>this._renderReadingField(t,e))}
              </div>`:this.taskType==="reading"?l`
              <label class="field">
                <span class="field-label">${a("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${t=>this._readingValue=t.target.value} />
              </label>`:_}
          ${this.parts.length?l`<div class="used-parts">
                <span class="field-label">${a("complete_parts_used",e)}</span>
                ${this.parts.map(t=>{let i=G({part_id:t.id,entry_id:t.entry_id}),n=this._usedParts[i],o=n!==void 0,p=t.entry_id?{part_id:t.id,quantity:1,entry_id:t.entry_id}:{part_id:t.id,quantity:1};return l`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${o}
                        @change=${c=>{let u={...this._usedParts};c.target.checked?u[i]=u[i]||p:delete u[i],this._usedParts=u}} />
                      <span
                        >${t.name}${t.owner_name?l`<span class="used-part-owner"> (${t.owner_name})</span>`:_}${t.stock!==null&&t.stock!==void 0?` (${t.stock}${t.unit?" "+t.unit:""})`:""}</span
                      >
                    </label>
                    ${o?l`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(n.quantity)}
                          @input=${c=>{let u=parseFloat(c.target.value);this._usedParts={...this._usedParts,[i]:{...p,quantity:Number.isFinite(u)&&u>=.01?u:1}}}} />`:_}
                  </div>`})}
              </div>`:this.consumesInfo.length?l`<div class="consumes-hint">
                  ${this.consumesInfo.map(t=>l`<div>${t}</div>`)}
                </div>`:_}
          ${this.restockDefault!==null?l`
              <label class="field">
                <span class="field-label">${a("restock_quantity_label",e)}</span>
                <input type="number" step="0.01" min="0.01" class="field-input"
                  .value=${this._restockQty}
                  @input=${t=>this._restockQty=t.target.value} />
              </label>`:_}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${a("notes_optional",e)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${a("cost_optional",e)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${t=>this._cost=t.target.value} />
            ${this._renderCostSuggestion(e)}
          </label>
          <label class="field">
            <span class="field-label">${a("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._duration}
              @input=${t=>this._duration=t.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${a("completed_at_optional",e)}</span>
            ${this._completedAt?l`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  @value-changed=${t=>this._completedAt=t.detail.value}
                ></ms-date-field>`:l`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${a("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${a("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.length>0?l`<div class="photo-strip">
                  ${this._photos.map(t=>l`
                    <div class="photo-preview">
                      <img src=${t.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._removePhoto(t.id)}
                        title="${a("remove",e)}">✕</button>
                    </div>`)}
                </div>`:_}
            ${this._photos.length<10?l`<div class="photo-pickers">
                  <label class="photo-pick photo-pick-camera">
                    <ha-icon icon="mdi:camera"></ha-icon>
                    <span>${this._photoUploading?a("uploading",e):a("doc_camera",e)}</span>
                    <input type="file" accept="image/*" capture="environment"
                      ?disabled=${this._photoUploading}
                      @change=${this._onPhotoInput} />
                  </label>
                  <label class="photo-pick photo-pick-gallery">
                    <ha-icon icon="mdi:image-multiple"></ha-icon>
                    <span>${a("choose_photos",e)}</span>
                    <input type="file" accept="image/*" multiple
                      ?disabled=${this._photoUploading}
                      @change=${this._onPhotoInput} />
                  </label>
                </div>`:l`<div class="photo-limit">${a("photos_limit",e).replace("{max}",String(10))}</div>`}
          </div>
          ${this.adaptiveEnabled?l`
            <div class="feedback-section">
              <label class="feedback-label">${a("was_maintenance_needed",e)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${a("feedback_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${a("feedback_not_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${a("feedback_not_sure",e)}</button>
              </div>
            </div>
          `:_}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(t=>a("err_required",e).replace("{field}",a(Ke[t]??t,e))).join(" \xB7 "):""}
          >
            ${this._loading?a("completing",e):a("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};$.styles=[Bi,E`
    .req-mark {
      color: var(--error-color, #f44336);
      margin-left: 2px;
      font-weight: 600;
    }
    /* #104: one-click cost suggestion from parts — quiet link-style chip. */
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
    .used-part-check {
      display: flex; align-items: center; gap: 6px; flex: 1;
      font-size: 13px; cursor: pointer;
    }
    .used-part-check input { cursor: pointer; }
    /* #111: whose stock this row draws on. Muted but never omitted — an
       unlabelled foreign pool is indistinguishable from an own part. */
    .used-part-owner { color: var(--secondary-text-color); }
    .used-part-qty {
      width: 76px; padding: 4px 6px; border-radius: 4px; font: inherit; font-size: 13px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
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
    .photo-pick {
      display: inline-flex;
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
    .photo-pick input[type="file"] { display: none; }
    /* #161: several photos per completion — tiles wrap into a strip,
       the two pickers (camera / gallery) sit underneath while there is
       room left under the cap. */
    .photo-pickers {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
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
  `],d([y({attribute:!1})],$.prototype,"hass",2),d([y()],$.prototype,"entryId",2),d([y()],$.prototype,"taskId",2),d([y()],$.prototype,"taskName",2),d([y()],$.prototype,"lang",2),d([y({type:Array})],$.prototype,"checklist",2),d([y({type:Boolean})],$.prototype,"adaptiveEnabled",2),d([y()],$.prototype,"taskType",2),d([y()],$.prototype,"readingUnit",2),d([y({attribute:!1})],$.prototype,"readings",2),d([y({attribute:!1})],$.prototype,"readingHistory",2),d([y({attribute:!1})],$.prototype,"restockDefault",2),d([y({attribute:!1})],$.prototype,"restockUnitCost",2),d([y()],$.prototype,"currencySymbol",2),d([y({attribute:!1})],$.prototype,"parts",2),d([y({attribute:!1})],$.prototype,"consumesParts",2),d([y({type:Array})],$.prototype,"consumesInfo",2),d([y({type:Array})],$.prototype,"requiredFields",2),d([y()],$.prototype,"phaseLabel",2),d([y({type:Boolean})],$.prototype,"requireTagScan",2),d([y({type:Boolean})],$.prototype,"viaTagScan",2),d([h()],$.prototype,"_open",2),d([h()],$.prototype,"_notes",2),d([h()],$.prototype,"_cost",2),d([h()],$.prototype,"_duration",2),d([h()],$.prototype,"_loading",2),d([h()],$.prototype,"_error",2),d([h()],$.prototype,"_checklistState",2),d([h()],$.prototype,"_feedback",2),d([h()],$.prototype,"_photos",2),d([h()],$.prototype,"_photoUploading",2),d([h()],$.prototype,"_readingValue",2),d([h()],$.prototype,"_readingValues",2),d([h()],$.prototype,"_restockQty",2),d([h()],$.prototype,"_completedAt",2),d([h()],$.prototype,"_usedParts",2),d([y({attribute:!1})],$.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",$)});function hr(s,r,e){let t=new Blob([s],{type:e}),i=URL.createObjectURL(t),n=document.createElement("a");n.href=i,n.download=r,n.target="_blank",n.rel="noopener",n.style.display="none",document.body.appendChild(n),n.dispatchEvent(new MouseEvent("click")),document.body.removeChild(n),setTimeout(()=>URL.revokeObjectURL(i),6e4)}var Ht=w(()=>{"use strict"});async function Os(s,r,e=300){return(await s.connection.sendMessagePromise({type:"auth/sign_path",path:r,expires:e})).path}async function _r(s,r,e=300){return Os(s,`/api/maintenance_supporter/document/${r}`,e)}var gr=w(()=>{"use strict";Ht()});var de,Ot=w(()=>{"use strict";I();V();gr();de=class extends A{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await _r(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?_:this._url?l`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:l`<div class="ph"></div>`}};de.styles=E`
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
  `,d([y({attribute:!1})],de.prototype,"hass",2),d([y()],de.prototype,"docId",2),d([h()],de.prototype,"_url",2),d([h()],de.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",de)});var z,mr=w(()=>{"use strict";I();V();q();fe();jt();Se();Ot();z=class extends A{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._photos=[];this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal="";this._uploadedIds=[];this._photoUploading=!1}get _lang(){return M(this.hass)}openEdit(e){this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos=[...e.photo_doc_ids??[]],this._photosOriginal=JSON.stringify(this._photos),this._uploadedIds=[],this._photoUploading=!1,this._seedReadings(e),this._loadPartOptions()}_seedReadings(e){let t=[],i=new Set;for(let o of e.readings??[])i.has(o.id)||(i.add(o.id),t.push({id:o.id,name:o.name,unit:o.unit??null}));for(let o of e.reading_values??[])i.has(o.id)||(i.add(o.id),t.push({id:o.id,name:o.name,unit:o.unit??null}));this._readingRows=t;let n={};for(let o of e.reading_values??[])n[o.id]=String(o.value);this._readingText=n,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let e={};for(let t of this._readingRows){let i=(this._readingText[t.id]??"").trim();if(i==="")continue;let n=parseFloat(i.replace(",","."));isNaN(n)||(e[t.id]=n)}return e}async _onPhotoInput(e){let t=e.target,i=Array.from(t.files??[]);t.value="";let n=this._draft;if(i.length===0||!n)return;let o=10-this._photos.length,p=i.slice(0,Math.max(o,0));this._photoUploading=!0,this._error="";try{for(let c of p){let u=await dt(this.hass,n.entry_id,c);this._uploadedIds=[...this._uploadedIds,u],this._photos=[...this._photos,u]}i.length>p.length&&(this._error=a("photos_limit",this._lang).replace("{max}",String(10)))}catch(c){let u=c instanceof Error&&c.message==="doc_too_large"?"doc_too_large":"doc_upload_failed";this._error=a(u,this._lang)}finally{this._photoUploading=!1}}_removePhoto(e){this._photos=this._photos.filter(t=>t!==e),this._uploadedIds.includes(e)&&(this._uploadedIds=this._uploadedIds.filter(t=>t!==e),Ae(this.hass,[e]))}async _loadPartOptions(){let e=this._draft;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),i=[];for(let o of t.parts||[]){let p=o.entry_id===e.entry_id,c=o.consumers.some(u=>u.entry_id===e.entry_id&&u.task_id===e.task_id);!p&&!c||i.push({part_id:o.part_id,name:o.name,entry_id:o.entry_id,foreign:!p,object_name:o.object_name})}for(let o of e.used_parts||[]){let p=o.entry_id||e.entry_id;i.some(c=>c.part_id===o.part_id&&c.entry_id===p)||i.push({part_id:o.part_id,name:o.name||o.part_id,entry_id:p,foreign:p!==e.entry_id,object_name:null})}let n={};for(let o of e.used_parts||[])n[`${o.entry_id||e.entry_id}:${o.part_id}`]=o.quantity??1;this._partOptions=i,this._partQty=n,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,e])=>e>0).sort(([e],[t])=>e.localeCompare(t)))}close(){if(this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._uploadedIds.length>0){let e=this._uploadedIds;this._uploadedIds=[],Ae(this.hass,e)}}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let e={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(e.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(e.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(e.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(e.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(e.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(e.used_parts=(this._partOptions||[]).filter(i=>(this._partQty[`${i.entry_id}:${i.part_id}`]||0)>0).map(i=>({part_id:i.part_id,quantity:this._partQty[`${i.entry_id}:${i.part_id}`],...i.foreign?{entry_id:i.entry_id}:{}}))),this._draft.reading_value!==this._originalSnapshot.reading_value&&(e.reading_value=this._draft.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let i=this._readingNumbers(),n={};for(let o of this._readingRows)n[o.id]=i[o.id]??null;e.reading_values=n}if(JSON.stringify(this._photos)!==this._photosOriginal&&(e.photo_doc_ids=[...this._photos]),Object.keys(e).filter(i=>!["type","entry_id","task_id","original_timestamp"].includes(i)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(e),this._uploadedIds=[],this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=O(e,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return _;let e=this._lang,t=this._draft;return l`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${a("history_edit_title",e)||"Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${a(t.type,e)||t.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${e}
          .label=${a("history_edit_timestamp",e)||"Timestamp"}
          .value=${t.timestamp.slice(0,19)}
          @value-changed=${i=>{let n=i.detail.value;n&&this._set("timestamp",n)}}
        ></ms-date-field>
        <label>
          <span>${a("notes_label",e)}</span>
          <textarea
            rows="3"
            @input=${i=>{let n=i.target.value;this._set("notes",n||null)}}
            .value=${t.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${a("cost",e)||"Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${t.cost!=null?String(t.cost):""}
              @input=${i=>{let n=i.target.value;this._set("cost",n?Number(n):null)}} />
          </label>
          <label>
            <span>${a("duration",e)||"Duration (min)"}</span>
            <input type="number" min="0"
              .value=${t.duration!=null?String(t.duration):""}
              @input=${i=>{let n=i.target.value;this._set("duration",n?Number(n):null)}} />
          </label>
        </div>
        ${this._renderReadings(t,e)}
        ${this._partOptions&&this._partOptions.length>0?l`
          <div class="parts-block">
            <span class="parts-title">${a("complete_parts_used",e)}</span>
            ${this._partOptions.map(i=>{let n=`${i.entry_id}:${i.part_id}`,o=this._partQty[n]||0;return l`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${o>0}
                    @change=${p=>{let c=p.target.checked;this._partQty={...this._partQty,[n]:c?1:0}}} />
                  <span class="part-label">${i.name}${i.foreign&&i.object_name?` (${i.object_name})`:""}</span>
                  ${o>0?l`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(o)}
                      @input=${p=>{let c=parseFloat(p.target.value);!isNaN(c)&&c>0&&(this._partQty={...this._partQty,[n]:c})}} />
                  `:_}
                </label>
              `})}
          </div>
        `:_}
        <div class="photos-block">
          <span class="parts-title">${a("completion_photos",e)}</span>
          ${this._photos.length>0?l`
            <div class="photo-strip">
              ${this._photos.map(i=>l`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${i}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${a("remove",e)}
                    @click=${()=>this._removePhoto(i)}>✕</button>
                </div>`)}
            </div>`:_}
          ${this._photos.length<10?l`
            <label class="photo-add">
              <ha-icon icon="mdi:image-plus"></ha-icon>
              <span>${this._photoUploading?a("uploading",e):a("add_photos",e)}</span>
              <input type="file" accept="image/*" multiple
                ?disabled=${this._photoUploading}
                @change=${this._onPhotoInput} />
            </label>`:l`<span class="photos-hint">${a("photos_limit",e).replace("{max}",String(10))}</span>`}
          <span class="photos-hint">${a("history_edit_photos_hint",e)}</span>
        </div>
        ${this._error?l`<div class="error">${this._error}</div>`:_}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${a("cancel",e)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?a("saving",e)||"Saving\u2026":a("save",e)||"Save"}
          </button>
        </div>
      </div>
    `}_renderReadings(e,t){return this._readingRows.length>0?l`
        <div class="readings-block">
          <span class="parts-title">${a("readings_section",t)}</span>
          ${this._readingRows.map(i=>l`
            <label class="reading-row-edit">
              <span class="reading-row-name">${i.name}${i.unit?` (${i.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[i.id]??""}
                @input=${n=>{this._readingText={...this._readingText,[i.id]:n.target.value}}} />
            </label>
          `)}
        </div>`:e.reading_value==null&&e.task_type!=="reading"?_:l`
      <label>
        <span>${a("reading_value_label",t)}${e.reading_unit?` (${e.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${e.reading_value!=null?String(e.reading_value):""}
          @input=${i=>{let n=i.target.value,o=n===""?NaN:Number(n);this._set("reading_value",isNaN(o)?null:o)}} />
      </label>`}};z.styles=E`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 100;
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 480px;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px;
      display: flex; flex-direction: column; gap: 12px;
      z-index: 101;
      max-height: 90vh; overflow: auto;
    }
    h2 { margin: 0; font-size: 18px; }
    .entry-type {
      display: flex; align-items: center; gap: 6px;
      color: var(--secondary-text-color); font-size: 13px;
    }
    label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
    label span { color: var(--secondary-text-color); }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    input, textarea {
      padding: 8px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px;
      width: 100%; box-sizing: border-box;
      font-family: inherit;
    }
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
    .parts-title { color: var(--secondary-text-color); font-size: 13px; }
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
    .photo-add {
      display: inline-flex; flex-direction: row; align-items: center; gap: 8px;
      width: fit-content; padding: 6px 10px;
      border: 1px dashed var(--divider-color, #444); border-radius: 8px;
      cursor: pointer; font-size: 13px; color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .photo-add:hover { border-color: var(--primary-color); }
    .photo-add input[type="file"] { display: none; }
    .photos-hint { font-size: 12px; color: var(--secondary-text-color); }
  `,d([y({attribute:!1})],z.prototype,"hass",2),d([h()],z.prototype,"_open",2),d([h()],z.prototype,"_saving",2),d([h()],z.prototype,"_error",2),d([h()],z.prototype,"_draft",2),d([h()],z.prototype,"_partOptions",2),d([h()],z.prototype,"_partQty",2),d([h()],z.prototype,"_photos",2),d([h()],z.prototype,"_readingRows",2),d([h()],z.prototype,"_readingText",2),d([h()],z.prototype,"_photoUploading",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",z)});function Te(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function fr(s){return!s.startsWith("data:image/svg+xml,")&&!s.startsWith("data:image/png;base64,")?"":Te(s)}function Ds(s){return s.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var W,vr=w(()=>{"use strict";I();V();q();Ht();W=class extends A{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(e,t,i,n){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=n,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...t,action:"view"})];this._taskId&&i.push(this.hass.connection.sendMessagePromise({...t,action:"complete"}));let n=await Promise.all(i);if(e!==this._generateSeq)return;this._viewResult=n[0],n.length>1&&(this._completeResult=n[1])}catch(t){if(e!==this._generateSeq)return;let i=t?.code,n=t?.message;this._error=i==="no_url"||typeof n=="string"&&n.includes("No Home Assistant URL")?a("qr_error_no_url",this.lang):a("qr_error",this.lang)}finally{e===this._generateSeq&&(this._loading=!1)}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),n=window.open("","_blank","width=600,height=500");if(!n)return;let o=this.lang||"en",p=Te(t),c=Te(i),u=!!this._completeResult,m=Te(a("qr_action_view",o)),f=Te(a("qr_action_complete",o));n.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${p}</title>
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
  .qr-col img{width:${u?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${p}</h2>
${c?`<div class="sub">${c}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${fr(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${m}</div>
  </div>
  ${u?`<div class="qr-col">
    <img src="${fr(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${f}</div>
  </div>`:""}
</div>
<div class="url">${Te(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),n.document.close()}_downloadSvg(e,t){let i=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),n=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;hr(i,`qr-${Ds(n)}-${t}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return l``;let e=this.lang||this.hass?.language||"en",t=this._taskName?`${a("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${a("qr_code",e)}: ${this._objectName}`,i=!!this._viewResult;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._loading?l`<div class="loading">${a("qr_generating",e)}</div>`:this._error?l`<div class="error">${this._error}</div>`:i?l`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${a("qr_action_view",e)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${a("qr_download",e)}
                        </button>
                      </div>
                      ${this._completeResult?l`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${a("qr_action_complete",e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${a("qr_download",e)}
                              </button>
                            </div>
                          `:_}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:_}
          <div class="action-row">
            <label>${a("qr_url_mode",e)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${a("qr_mode_companion",e)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${a("qr_mode_local",e)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${a("qr_mode_server",e)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!i}
          >
            ${a("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};W.styles=E`
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
  `,d([y({attribute:!1})],W.prototype,"hass",2),d([y()],W.prototype,"lang",2),d([h()],W.prototype,"_open",2),d([h()],W.prototype,"_loading",2),d([h()],W.prototype,"_error",2),d([h()],W.prototype,"_viewResult",2),d([h()],W.prototype,"_completeResult",2),d([h()],W.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",W)});function Ms(s,r){if(r<=0)return 0;let e=typeof s=="number"&&Number.isFinite(s)?Math.trunc(s):0;return e<0?0:e%r}function zs(s){return!!(s?.phases&&s.phase_sequence&&s.phase_sequence.length>0)}function Dt(s){if(!s||!zs(s))return null;let r=s.phase_sequence,e=Ms(s.phase_cursor,r.length),t=r[e],i=s.phases?.[t];return i?{id:t,name:i.name,index:e,count:r.length,notes:i.notes,checklist:i.checklist!==void 0?i.checklist:s.checklist??[],consumesParts:i.consumes_parts!==void 0?i.consumes_parts:s.consumes_parts??[],requiredFields:i.required_completion_fields!==void 0?i.required_completion_fields:s.required_completion_fields??[]}:null}function Ye(s){let r=Dt(s);return r?`${r.index+1}/${r.count} \xB7 ${r.name}`:""}var Mt=w(()=>{"use strict"});function yr(s){let r=s.task??null,e=r?Dt(r):null,t=e?e.consumesParts:r?.consumes_parts||[],i=!!r?.part_ref,n=s.objects.find(c=>c.entry_id===s.entryId)?.parts||[],o=i?n.find(c=>c.id===r.part_ref.part_id):void 0,p=s.checklistsEnabled??!0;return{entry_id:s.entryId,task_id:s.taskId,task_name:s.taskName,checklist:e?p?e.checklist:[]:s.checklist??[],adaptive_enabled:!!s.adaptiveEnabled,required_completion_fields:e?e.requiredFields:r?.required_completion_fields||[],task_type:r?.type||"",reading_unit:r?.reading_unit||"",readings:r?.readings||[],reading_history:Yi(r?.history),parts:i?[]:nr({consumes_parts:t},s.entryId,s.objects,s.lang),consumes_parts:i?[]:t,phase_label:e?Ye(r):"",require_tag_scan:!!r?.require_tag_scan,restock_default:i?o?.restock_quantity??1:null,restock_unit_cost:i?o?.cost??null:null,currency_symbol:s.currencySymbol??"",consumes_info:t.map(c=>ar(c,s.entryId,s.objects,s.lang)),checklist_prefill:r?.checklist_progress||{},via_tag_scan:!!s.viaTagScan}}function br(s,r,e){s.entryId=r.entry_id,s.taskId=r.task_id,s.taskName=r.task_name,s.lang=e,s.checklist=r.checklist??[],s.adaptiveEnabled=!!r.adaptive_enabled,s.requiredFields=r.required_completion_fields??[],s.taskType=r.task_type??"",s.readingUnit=r.reading_unit??"",s.readings=r.readings??[],s.readingHistory=r.reading_history??[],s.parts=r.parts??[],s.consumesParts=r.consumes_parts??[],s.phaseLabel=r.phase_label??"",s.requireTagScan=!!r.require_tag_scan,s.restockDefault=r.restock_default??null,s.restockUnitCost=r.restock_unit_cost??null,s.currencySymbol=r.currency_symbol??"",s.consumesInfo=r.consumes_info??[],s.checklistPrefill=r.checklist_prefill??{},s.viaTagScan=!!r.via_tag_scan,s.open({viaTagScan:!!r.via_tag_scan})}var zt=w(()=>{"use strict";Ee();lt();Mt()});function S(s){return s.toFixed(1)}var Ft=w(()=>{"use strict";q()});function xr(s,r){let e=s.interval_analysis,t=e?.weibull_beta,i=e?.weibull_eta;if(t==null||i==null||i<=0)return _;let n=s.interval_days??0,o=s.suggested_interval??n;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${a("weibull_reliability_curve",r)}
        ${Fs(t,r)}
      </div>
      ${Us(t,i,n,o,r)}
      ${Bs(e,r)}
      ${e?.confidence_interval_low!=null?Vs(e,s,r):_}
    </div>
  `}function Fs(s,r){let e,t,i;return s<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):s<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):s<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),l`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${a(i,r)} (\u03B2=${P(s,r,2)})
    </span>
  `}function Us(s,r,e,t,i){let v=Math.max(e,t,r,1)*1.3,k=50,T=[];for(let R=0;R<=k;R++){let H=R/k*v,ce=1-Math.exp(-Math.pow(H/r,s)),Ie=32+H/v*260,Pe=136-ce*128;T.push([Ie,Pe])}let D=T.map(([R,H])=>`${S(R)},${S(H)}`).join(" "),F="M32,136 "+T.map(([R,H])=>`L${S(R)},${S(H)}`).join(" ")+` L${S(T[k][0])},136 Z`,j=32+e/v*260,K=1-Math.exp(-Math.pow(e/r,s)),oe=136-K*128,b=P((1-K)*100,i,0),Y=32+t/v*260,ve=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_weibull",i)}">
        ${ve.map(R=>{let H=136-R*128;return xe`
            <line x1="${32}" y1="${S(H)}" x2="${292}" y2="${S(H)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${R===.5?"4,3":_}" />
            <text x="${28}" y="${S(H+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${P(R*100,i,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(v/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(v)}</text>

        <path d="${F}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${D}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?xe`
          <line x1="${S(j)}" y1="${8}" x2="${S(j)}" y2="${S(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${S(j)}" cy="${S(oe)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${S(j+4)}" y="${S(oe-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${b}%</text>
        `:_}

        ${t>0&&t!==e?xe`
          <line x1="${S(Y)}" y1="${8}" x2="${S(Y)}" y2="${S(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:_}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${a("weibull_failure_probability",i)}</span>
      ${e>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${a("current_interval_marker",i)}</span>`:_}
      ${t>0&&t!==e?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${a("recommended_marker",i)}</span>`:_}
    </div>
  `}function Bs(s,r){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${a("characteristic_life",r)}</span>
        <span class="weibull-info-value">${Math.round(s.weibull_eta)} ${a("days",r)}</span>
      </div>
      ${s.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${a("weibull_r_squared",r)}</span>
          <span class="weibull-info-value">${P(s.weibull_r_squared,r,3)}</span>
        </div>
      `:_}
    </div>
  `}function Vs(s,r,e){let t=s.confidence_interval_low,i=s.confidence_interval_high,n=r.suggested_interval??r.interval_days??0,o=r.interval_days??0,p=Math.max(0,t-5),u=i+5-p,m=(t-p)/u*100,f=(i-t)/u*100,x=(n-p)/u*100,v=o>0?(o-p)/u*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${a("confidence_interval",e)}: ${n} ${a("days",e)} (${t}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${S(m)}%;width:${S(f)}%"></div>
        ${v>=0?l`<div class="confidence-marker current" style="left:${S(v)}%"></div>`:_}
        <div class="confidence-marker recommended" style="left:${S(x)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${a("confidence_conservative",e)} (${t}${a("days",e).charAt(0)})</span>
        <span class="confidence-text high">${a("confidence_aggressive",e)} (${i}${a("days",e).charAt(0)})</span>
      </div>
    </div>
  `}var wr=w(()=>{"use strict";I();q();Ft()});function $r(s,r,e){let t=s.degradation_trend!=null&&s.degradation_trend!=="insufficient_data",i=s.days_until_threshold!=null,n=s.environmental_factor!=null&&s.environmental_factor!==1;if(!t&&!i&&!n)return _;let o=s.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":s.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${s.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${a("sensor_prediction_urgency",r).replace("{days}",String(Math.round(s.days_until_threshold||0)))}
        </div>
      `:_}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${a("sensor_prediction",r)}
      </div>
      <div class="prediction-grid">
        ${t?l`
          <div class="prediction-item">
            <ha-svg-icon path="${o}"></ha-svg-icon>
            <span class="prediction-label">${a("degradation_trend",r)}</span>
            <span class="prediction-value ${s.degradation_trend}">${a("trend_"+s.degradation_trend,r)}</span>
            ${s.degradation_rate!=null?l`<span class="prediction-rate">${s.degradation_rate>0?"+":""}${P(s.degradation_rate,r,Math.abs(s.degradation_rate)>=10?0:1)} ${s.trigger_entity_info?.unit_of_measurement||""}/${a("day_short",r)}</span>`:_}
          </div>
        `:_}
        ${i?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${a("days_until_threshold",r)}</span>
            <span class="prediction-value prediction-days${s.days_until_threshold===0?" exceeded":s.sensor_prediction_urgency?" urgent":""}">${s.days_until_threshold===0?a("threshold_exceeded",r):"~"+Math.round(s.days_until_threshold)+" "+a("days",r)}</span>
            ${s.threshold_prediction_date?l`<span class="prediction-date">${te(s.threshold_prediction_date,r)}</span>`:_}
            ${s.threshold_prediction_confidence?l`<span class="confidence-dot ${s.threshold_prediction_confidence}"></span>`:_}
            ${(s.prediction_cycles??0)>0?l`<span class="prediction-cycles">${a("prediction_cycles",r)}: ${s.prediction_cycles}</span>`:_}
          </div>
        `:_}
        ${n&&e.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${a("environmental_adjustment",r)}</span>
            <span class="prediction-value">${P(s.environmental_factor,r,2)}x</span>
            ${s.environmental_entity?l`<span class="prediction-entity entity-link" @click=${p=>Ui(p,s.environmental_entity)}>${s.environmental_entity}</span>`:_}
          </div>
        `:_}
      </div>
    </div>
  `}var kr=w(()=>{"use strict";I();q()});function Er(s,r,e,t){let i=Math.max(s||1,r);return l`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${a("current",t)}: ${s??"\u2014"} ${s!=null?a("days",t):""}
        </div>
        <div class="interval-visual current"
          style="width: ${s!=null?Math.min(s/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${a("recommended",t)}: ${r} ${a("days",t)}
          <span class="confidence-badge ${e}">${a(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(r/i*100,100)}%"></div>
      </div>
    </div>
  `}var Sr=w(()=>{"use strict";I();q()});function Tr(s,r,e){if(!e.seasonal||!s.seasonal_factor||s.seasonal_factor===1)return _;let t=Ar.map(p=>a(p,r)),i=new Date().getMonth(),n=s.seasonal_factors||s.interval_analysis?.seasonal_factors||null,o=n&&n.length===12?n:t.map((p,c)=>{let u=s.seasonal_factor||1,m=Math.sin((c-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,u+m))});return l`
    <div class="seasonal-card-compact">
      <h4>${a("seasonal_awareness",r)}</h4>
      <div class="seasonal-mini-chart">
        ${o.map((p,c)=>{let u=p*40,m=p<.9?"low":p>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${m} ${c===i?"current":""}"
                 style="height: ${u}px"
                 title="${t[c]}: ${P(p,r,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${a("shorter",r)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${a("normal",r)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${a("longer",r)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function Cr(s,r){return Ws(s,r)}function Ws(s,r){let e=s.seasonal_factors??s.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return _;let t=s.interval_analysis?.seasonal_reason,i=new Date().getMonth(),n=300,o=100,p=8,u=o-p-4,m=Math.max(...e,1.5),f=n/12,x=f*.65,v=p+u-1/m*u;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${a("seasonal_chart_title",r)}
        ${t?l`<span class="source-tag">${t==="learned"?a("seasonal_learned",r):a("seasonal_manual",r)}</span>`:_}
      </div>
      <svg viewBox="0 0 ${n} ${o}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_seasonal",r)}">
        <line x1="0" y1="${S(v)}" x2="${n}" y2="${S(v)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((k,T)=>{let D=k/m*u,F=T*f+(f-x)/2,j=p+u-D,K=T===i,oe=k<1?"var(--success-color, #4caf50)":k>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return xe`
            <rect x="${S(F)}" y="${S(j)}"
              width="${S(x)}" height="${S(D)}"
              fill="${oe}" opacity="${K?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Ar.map((k,T)=>l`<span class="seasonal-label ${T===i?"active-month":""}">${a(k,r)}</span>`)}
      </div>
    </div>
  `}var Ar,Ir=w(()=>{"use strict";I();q();Ft();Ar=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"]});var L,Pr=w(()=>{"use strict";I();V();q();fe();St();zt();Mt();nt();Ee();Ot();wr();kr();Sr();Se();Ir();L=class extends A{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1;this._currencySymbol=""}get _lang(){return M(this.hass)}async openFor(e,t){this._entryId=e,this._taskId=t,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=ge(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});e?.features&&(this._features={...this._features,...e.features}),this._currencySymbol=e?.budget?.currency_symbol||"",this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=e.object?.name||"";let t=(e.tasks||[]).find(i=>i.id===this._taskId);this._task=t??null}catch(e){this._error=O(e,this._lang)}}async _runWs(e){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(e),this._busy=!1,!0}catch(t){return this._error=O(t,this._lang),this._busy=!1,!1}}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(J(),se)).then(async({openCompleteDialog:e})=>{let t=this._task,i=[];try{i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}e(yr({entryId:this._entryId,taskId:this._taskId,taskName:t.name,task:t,objects:i,lang:this._lang,checklist:t.checklist||[],adaptiveEnabled:!!t.adaptive_config?.enabled,currencySymbol:this._currencySymbol}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||Promise.resolve().then(()=>(J(),se)).then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(J(),se)).then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let e=a("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(e))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=a("suggestion_applied",this._lang)||"Applied",this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=e.recommended_interval?`${a("reanalyze_result",this._lang)||"Recomputed"}: ${rt(e.recommended_interval,"days",this._lang)} (${e.data_points} pts)`:a("reanalyze_insufficient_data",this._lang)||"Not enough data",await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(e){this._error=O(e,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(e){!this._entryId||!this._taskId||Promise.resolve().then(()=>(J(),se)).then(({openHistoryEditDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,original_timestamp:e.timestamp,type:e.type,timestamp:e.timestamp,notes:e.notes??null,cost:e.cost??null,duration:e.duration??null,completed_by:e.completed_by??null,used_parts:e.used_parts??null,photo_doc_ids:We(e),reading_value:e.reading_value??null,reading_values:ie(e),readings:this._task?.readings??[],task_type:this._task?.type??null,reading_unit:this._task?.reading_unit??null})})}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return _;let t=this._lang;return l`
      <div class="recommendation-card">
        <h4>${a("suggested_interval",t)}</h4>
        ${Er(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",t)}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${a("apply_suggestion",t)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${a("reanalyze",t)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(e){let t=this._lang,i=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,n=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,o=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,p=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!i&&!n&&!o&&!p?l`<div class="adaptive-empty">
        ${a("adaptive_no_data",t)||"Not enough completion history yet for adaptive analysis."}
      </div>`:l`
      <div class="adaptive-stack">
        ${this._toast?l`<div class="toast">${this._toast}</div>`:_}
        ${i?this._renderRecommendation(e):_}
        ${n?$r(e,t,this._features):_}
        ${o?xr(e,t):_}
        ${p?l`
          ${Tr(e,t,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?Cr(e,t):_}
        `:_}
      </div>
    `}_renderHistoryReadings(e,t,i){let n=ie(e),o=p=>P(p,i,{maximumFractionDigits:3});if(n.length>0)return l`<div class="history-readings">
        ${n.map(p=>{let c=Qi(t,e,p.id);return l`<span class="history-reading"><span class="history-reading-name">${p.name}</span>
            <span class="history-reading-value">${o(p.value)}${p.unit?` ${p.unit}`:""}${c==null?"":` (${c>=0?"+":""}${o(c)})`}</span></span>`})}
      </div>`;if(e.reading_value!=null){let p=this._task?.reading_unit?` ${this._task.reading_unit}`:"";return l`<div class="history-readings"><span class="history-reading">
        <span class="history-reading-name">${a("reading_label",i)}</span>
        <span class="history-reading-value">${o(e.reading_value)}${p}</span></span></div>`}return _}_renderDetails(e){let t=this._lang,i=e.history||[],n=i.filter(c=>c.type==="completed"),o=n.reduce((c,u)=>c+(typeof u.cost=="number"?u.cost:0),0),p=(()=>{let c=n.map(u=>typeof u.duration=="number"?u.duration:null).filter(u=>u!=null);return c.length?Math.round(c.reduce((u,m)=>u+m,0)/c.length):null})();return l`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${a("times_performed",t)||"Performed"}</span>
            <span class="stat-value">${n.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${a("total_cost",t)||"Total cost"}</span>
            <span class="stat-value">${P(o,t,2)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${a("avg_duration",t)||"Avg duration"}</span>
            <span class="stat-value">${p!=null?`${p}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${a("history",t)||"History"}</strong>
          <span class="history-count">${i.length}</span>
        </div>
        ${i.length===0?l`<div class="history-empty">${a("history_empty",t)||"No history yet."}</div>`:l`
              <div class="history-list">
                ${[...i].reverse().slice(0,20).map(c=>{let u=["completed","reset","skipped"].includes(c.type);return l`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${c.type}">${a(c.type,t)}</span>
                        <span class="history-date">${Oi(c.timestamp,t)}</span>
                        ${u?l`<button class="history-edit"
                                   title="${a("history_edit_button",t)||"Edit"}"
                                   @click=${()=>this._onEditHistoryEntry(c)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:_}
                      </div>
                      ${c.notes?l`<div class="history-notes">${c.notes}</div>`:_}
                      ${this._renderHistoryReadings(c,i,t)}
                      ${(()=>{let m=We(c);return m.length?l`<div class="history-photos">
                              ${m.map(f=>l`<maintenance-history-photo .hass=${this.hass} .docId=${f}></maintenance-history-photo>`)}
                            </div>`:_})()}
                      ${c.cost!=null||c.duration!=null?l`<div class="history-meta">
                            ${c.cost!=null?l`<span>💰 ${P(c.cost,t,2)}</span>`:_}
                            ${c.duration!=null?l`<span>⏱️ ${c.duration}m</span>`:_}
                          </div>`:_}
                    </div>
                  `})}
                ${i.length>20?l`<div class="history-more">… +${i.length-20} ${a("older_entries",t)||"older"}</div>`:_}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return _;let e=this._lang,t=this._task,i=this.hass?.user?.is_admin??!0;return l`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${t?l`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${ze[t.status]||"#ccc"}"></span>
                  <span class="task-name">${t.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&Promise.resolve().then(()=>(J(),se)).then(({openObjectQuickActions:n})=>{n(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${t.next_due?l`<span><strong>${a("next_due",e)||"Next due"}:</strong> ${te(t.next_due,e)}</span>`:_}
                  ${t.last_performed?l`<span><strong>${a("last_performed",e)||"Last"}:</strong> ${te(t.last_performed,e)}</span>`:_}
                  ${t.schedule?.kind&&!["manual","one_time"].includes(t.schedule.kind)||t.interval_days!=null?l`<span><strong>${a("interval",e)||"Interval"}:</strong> ${Fi(t,e)}</span>`:_}
                  ${Ye(t)?l`<span><strong>${a("phase_current",e)}:</strong> ${Ye(t)}</span>`:_}
                </div>
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:_}

              ${this._showSkip?l`
                    <div class="inline-form">
                      <label>${a("skip_reason",e)||"Skip reason (optional)"}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${n=>{this._skipReason=n.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${a("cancel",e)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${a("skip",e)||"Skip"}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?l`
                    <div class="inline-form">
                      <label>${a("reset_to_date",e)||"Reset last_performed to"}</label>
                      <ms-date-field
                        kind="date"
                        .hass=${this.hass}
                        .lang=${e}
                        .value=${this._resetDate}
                        @value-changed=${n=>{this._resetDate=n.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${a("cancel",e)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${a("reset",e)||"Reset"}
                        </button>
                      </div>
                    </div>
                  `:l`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${a("complete",e)||"Complete"}
                      </ha-button>
                      ${t.allow_skip!==!1?l`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${a("skip",e)||"Skip"}
                            </ha-button>
                          `:_}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${a("reset",e)||"Reset"}
                      </ha-button>
                    </div>
                    ${i?l`
                          <div class="actions secondary-row">
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onEdit} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                              ${a("edit",e)||"Edit"}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral" @click=${this._onQr} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                              ${a("qr_code",e)||"QR"}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="neutral"
                              @click=${t.archived?this._onUnarchive:this._onArchive}
                              .disabled=${this._busy}>
                              <ha-icon slot="start" icon="${t.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${t.archived?a("unarchive",e)||"Unarchive":a("archive",e)||"Archive"}
                            </ha-button>
                            <ha-button size="small" appearance="outlined" variant="danger" class="danger" @click=${this._onDelete} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                              ${a("delete",e)||"Delete"}
                            </ha-button>
                          </div>
                        `:_}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?a("hide_details",e)||"Hide details":a("show_details",e)||"Show history + stats"}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?l`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?a("hide_stats",e)||"Hide stats":a("show_stats",e)||"Show stats + graphs"}
                          </button>`:_}
                    </div>
                    ${this._showDetails?this._renderDetails(t):_}
                    ${this._showAdaptive?this._renderAdaptive(t):_}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${a("open_in_panel",e)||"Open in Maintenance panel"}
                      </button>
                    </div>
                  `}
            `:l`<div class="loading">${a("loading",e)||"Loading\u2026"}</div>`}
      </div>
    `}};L.styles=[at,E`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(0,0,0,0.5);
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 460px;
      max-height: 92vh; overflow: auto;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px;
      display: flex; flex-direction: column; gap: 14px;
      z-index: 101;
    }
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
    .inline-form label { font-size: 13px; color: var(--secondary-text-color); }
    .inline-form input {
      padding: 8px; font-size: 14px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444);
      border-radius: 6px;
    }
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
    .history-list { display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow: auto; }
    .history-entry {
      padding: 6px 8px; border-radius: 6px;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      font-size: 13px;
    }
    .history-line {
      display: flex; align-items: center; gap: 8px;
      justify-content: space-between;
    }
    .history-type {
      font-weight: 600; font-size: 11px;
      padding: 2px 6px; border-radius: 4px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .type-completed { background: rgba(46,125,50,0.2); color: #66bb6a; }
    .type-skipped { background: rgba(158,158,158,0.2); color: var(--secondary-text-color); }
    .type-reset { background: rgba(33,150,243,0.2); color: #64b5f6; }
    .type-triggered { background: rgba(255,87,34,0.2); color: #ff8a65; }
    .history-date { font-size: 11px; color: var(--secondary-text-color); flex: 1; text-align: right; }
    .history-edit {
      background: transparent; border: none; cursor: pointer;
      padding: 4px; border-radius: 4px;
      color: var(--secondary-text-color);
    }
    .history-edit:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); color: var(--primary-color); }
    .history-edit ha-icon { --mdc-icon-size: 14px; }
    .history-notes { margin-top: 4px; color: var(--primary-text-color); }
    .history-meta { display: flex; gap: 12px; margin-top: 4px; color: var(--secondary-text-color); font-size: 11px; }
    /* #161: readings + photos on the entry (panel-timeline parity) */
    .history-readings { display: flex; flex-wrap: wrap; gap: 2px 16px; margin-top: 4px; font-size: 12px; }
    .history-reading { display: inline-flex; gap: 6px; }
    .history-reading-name { color: var(--secondary-text-color); }
    .history-reading-value { font-variant-numeric: tabular-nums; }
    .history-photos { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
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
      color: #4caf50; font-size: 13px; font-weight: 500;
    }
    /* The panel's recommendation-card uses ha-button. We use plain <button>
       in this dialog's button styles. Re-style the action row to match. */
    .recommendation-actions {
      display: flex; gap: 8px; margin-top: 8px;
    }
    /* Constrain SVG charts so they fit the dialog width even on mobile. */
    .weibull-section, .seasonal-card-compact { max-width: 100%; }
    .weibull-chart svg { max-width: 100%; height: auto; }
    .details-toggle { gap: 12px; flex-wrap: wrap; }
  `],d([y({attribute:!1})],L.prototype,"hass",2),d([h()],L.prototype,"_open",2),d([h()],L.prototype,"_entryId",2),d([h()],L.prototype,"_taskId",2),d([h()],L.prototype,"_task",2),d([h()],L.prototype,"_objectName",2),d([h()],L.prototype,"_busy",2),d([h()],L.prototype,"_error",2),d([h()],L.prototype,"_showSkip",2),d([h()],L.prototype,"_showReset",2),d([h()],L.prototype,"_showDetails",2),d([h()],L.prototype,"_showAdaptive",2),d([h()],L.prototype,"_skipReason",2),d([h()],L.prototype,"_resetDate",2),d([h()],L.prototype,"_features",2),d([h()],L.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",L)});function Lr(s){return!!s&&/^https?:\/\//i.test(s)}var Rr=w(()=>{"use strict"});function qr(s){return s?customElements.get("ha-markdown")?l`<ha-markdown class="notes-md" .content=${s} breaks></ha-markdown>`:l`${s}`:_}var Nr=w(()=>{"use strict";I()});var Z,jr=w(()=>{"use strict";I();Rr();Nr();V();q();fe();Z=class extends A{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return M(this.hass)}async openFor(e){this._entryId=e,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=e}catch(e){this._error=O(e,this._lang)}}_onEditObject(){!this._entryId||!this._data||Promise.resolve().then(()=>(J(),se)).then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&Promise.resolve().then(()=>(J(),se)).then(({openCreateTaskDialog:e})=>{e(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let e=a("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(e)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=O(t,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let e=!!this._data.object.archived;if(!e){let t=a("confirm_archive_object",this._lang)||"Archive this object and its tasks?";if(!window.confirm(t))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=O(t,this._lang)}finally{this._busy=!1}}_onTaskClick(e){this._entryId&&Promise.resolve().then(()=>(J(),se)).then(({openTaskQuickActions:t})=>{t(this._entryId,e)})}render(){if(!this._open)return _;let e=this._lang,t=this._data,i=t?.object,n=t?.tasks||[],o=this.hass?.user?.is_admin??!0;return l`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${t&&i?l`
              <div class="header">
                <div class="title">${i.name}</div>
                ${this._renderMetaRow(i)}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:_}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${a("tasks",e)||"Tasks"}</strong>
                  <span class="count">${n.length}</span>
                </div>
                ${n.length===0?l`<div class="empty">${a("no_tasks",e)||"No tasks yet."}</div>`:l`
                      <div class="task-list">
                        ${n.map(p=>l`
                          <div class="task-row" @click=${()=>this._onTaskClick(p.id)}>
                            <span class="status-dot" style="background: ${ze[p.status]||"#ccc"}"></span>
                            <span class="task-name">${p.name}</span>
                            <span class="task-status">${a(p.status||"ok",e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?l`
                    <div class="notes-section">
                      <strong>${a("object_notes_label",e)}</strong>
                      <div class="notes-body">${qr(i.notes)}</div>
                    </div>
                  `:_}

              ${o?l`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${a("add_task",e)||"Add task"}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${a("edit",e)||"Edit"}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${i.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${i.archived?a("unarchive_object",e)||"Unarchive object":a("archive_object",e)||"Archive object"}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${a("delete",e)||"Delete"}
                      </button>
                    </div>
                  `:_}
            `:l`<div class="loading">${a("loading",e)||"Loading\u2026"}</div>`}
      </div>
    `}_renderMetaRow(e){let t=this._lang,i=[];return e.area_id&&i.push([a("area",t),e.area_id]),e.manufacturer&&i.push([a("manufacturer",t),e.manufacturer]),e.model&&i.push([a("model",t),e.model]),e.serial_number&&i.push([a("serial_number_label",t),e.serial_number]),e.installation_date&&i.push([a("installed",t),e.installation_date]),e.warranty_expiry&&i.push([a("warranty",t),e.warranty_expiry]),e.documentation_url&&i.push([a("documentation_url_label",t),e.documentation_url]),i.length===0?_:l`
      <div class="meta">
        ${i.map(([n,o])=>l`
            <div class="meta-item">
              <span class="meta-label">${n}</span>
              <span class="meta-value">${Lr(o)?l`<a href="${o}" target="_blank" rel="noopener noreferrer">${o}</a>`:o}</span>
            </div>
          `)}
      </div>
    `}};Z.styles=E`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.5);
    }
    .dialog {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 95vw; max-width: 480px;
      max-height: 92vh; overflow: auto;
      background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      padding: 20px; z-index: 101;
      display: flex; flex-direction: column; gap: 14px;
    }
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
  `,d([y({attribute:!1})],Z.prototype,"hass",2),d([h()],Z.prototype,"_open",2),d([h()],Z.prototype,"_entryId",2),d([h()],Z.prototype,"_data",2),d([h()],Z.prototype,"_busy",2),d([h()],Z.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",Z)});function Hr(){let s=window;return s.__msSettingsCache??={promise:null}}function ct(s){let r=Hr();if(r.promise)return r.promise;let e=s.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(t=>({features:t.features??Ut.features,defaultWarningDays:t.general?.default_warning_days??7,rowActionStyle:t.general?.row_action_style??Ut.rowActionStyle})).catch(()=>(r.promise===e&&(r.promise=null),Ut));return r.promise=e,e}function Or(){Hr().promise=null}var Ut,Dr=w(()=>{"use strict";Ut={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact"}});var se={};Vr(se,{__resetSettingsCacheForTests:()=>ea,getRowActionStyle:()=>Xs,openCompleteDialog:()=>aa,openCreateObjectDialog:()=>ta,openCreateTaskDialog:()=>ra,openEditObjectDialog:()=>ia,openEditTaskDialog:()=>sa,openHistoryEditDialog:()=>Bt,openObjectQuickActions:()=>oa,openQrDialog:()=>na,openTaskQuickActions:()=>Vt});function pt(){return document.querySelector("home-assistant")?.hass}function Zs(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function ae(s){let r=Zs(),e=r.querySelector(s)??document.body.querySelector(s);return e?e.parentNode!==r&&r.appendChild(e):(e=document.createElement(s),r.appendChild(e)),e}function ne(s){let r=pt();if(!r)return!1;s.hass=r;let e=M(r);return Be(e)||Ve(e).then(()=>{s.requestUpdate?.()}),Tt(r.locale,r.config?.country),!0}function Xs(s){return ct(s).then(r=>r.rowActionStyle)}function ea(){Or()}function ta(){let s=ae(Mr);return ne(s)?(s.openCreate(),!0):!1}function ia(s,r){let e=ae(Mr);return ne(e)?(e.openEdit(s,r),!0):!1}function ra(s="",r){let e=ae(zr);if(!ne(e))return!1;let t=pt();return t?((async()=>{let i=await ct(t),n=e;n.checklistsEnabled=i.features.checklists,n.scheduleTimeEnabled=i.features.schedule_time,n.completionActionsEnabled=i.features.completion_actions,n.defaultWarningDays=i.defaultWarningDays,n.openCreate(s,r)})(),!0):!1}function sa(s,r){let e=ae(zr);if(!ne(e))return!1;let t=pt();return t?((async()=>{try{let[i,n]=await Promise.all([t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:s}),ct(t)]),o=(i.tasks||[]).find(c=>c.id===r);if(!o){console.warn(`openEditTaskDialog: task ${r} not found in entry ${s}`);return}let p=e;p.checklistsEnabled=n.features.checklists,p.scheduleTimeEnabled=n.features.schedule_time,p.completionActionsEnabled=n.features.completion_actions,p.defaultWarningDays=n.defaultWarningDays,await p.openEdit(s,o)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function Bt(s){let r=ae(Ks);return ne(r)?(r.openEdit(s),!0):!1}function aa(s){let r=ae(Ys);return ne(r)?(br(r,s,pt()?.language||"en"),!0):!1}function na(s){let r=ae(Gs);return ne(r)?(r.openForTask(s.entry_id,s.task_id,s.object_name,s.task_name),!0):!1}function Vt(s,r){let e=ae(Qs);return ne(e)?(e.openFor(s,r),!0):!1}function oa(s){let r=ae(Js);return ne(r)?(r.openFor(s),!0):!1}var Mr,zr,Ks,Ys,Gs,Qs,Js,J=w(()=>{"use strict";Xi();pr();ur();mr();vr();Pr();jr();q();zt();Dr();Mr="maintenance-object-dialog",zr="maintenance-task-dialog",Ks="maintenance-history-edit-dialog",Ys="maintenance-complete-dialog",Gs="maintenance-qr-dialog",Qs="maintenance-task-quick-actions-dialog",Js="maintenance-object-quick-actions-dialog"});I();V();St();I();var Si=E`
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
`;q();function Vi(s){let r=window;r.customCards=r.customCards||[],r.customCards.some(e=>e.type===s.type)||r.customCards.push(s)}nt();Ee();J();var B=class extends A{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._dataLoaded=!1;this._lastConnection=null}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(e){if(this._config={...e},e.past_days&&[30,90].includes(e.past_days)?this._pastDays=e.past_days:e.window_days&&[7,14,30,365].includes(e.window_days)&&(this._windowDays=e.window_days,this._pastDays=0),typeof e.user_filter=="string"&&(this._userFilter=e.user_filter),typeof e.object_filter=="string")this._objectFilter=e.object_filter,this._configuredObjects=[];else if(Array.isArray(e.object_filter)){let t=e.object_filter.filter(i=>typeof i=="string"&&i!=="");this._objectFilter=t.length===1?t[0]:"",this._configuredObjects=t.length>1?t:[]}}getCardSize(){return 6}get _lang(){return M(this.hass)}disconnectedCallback(){if(super.disconnectedCallback(),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(e){if(super.updated(e),qi(this,e),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=e.objects,this._stats=t}catch{}}async _subscribe(){try{let e=await this.hass.connection.subscribeMessage(t=>{let i=t;this._objects=i.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected){e();return}this._unsub=e}catch{}}_onEventClick(e){if(e.history_timestamp){this._openHistoryEntry(e);return}Vt(e.entry_id,e.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0}))}async _openHistoryEntry(e){try{let i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e.entry_id})).tasks?.find(p=>p.id===e.task_id),n=i?.history?.find(p=>p.timestamp===e.history_timestamp);if(!n||Bt({entry_id:e.entry_id,task_id:e.task_id,original_timestamp:e.history_timestamp,type:n.type||"completed",timestamp:n.timestamp||e.history_timestamp,notes:n.notes??null,cost:n.cost??null,duration:n.duration??null,completed_by:n.completed_by??null,used_parts:n.used_parts??null,photo_doc_ids:We(n),reading_value:n.reading_value??null,reading_values:ie(n),readings:i?.readings??[],task_type:i?.type??null,reading_unit:i?.reading_unit??null}))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:e.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return _;let e=this._lang,t=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,n=this._config.title,o=null;this._userFilter&&(o=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let p=b=>{let Y=b.toLowerCase();return this._objects.find(R=>R.entry_id===b||R.object.name.toLowerCase()===Y)?.entry_id??null},c=new Set(this._configuredObjects.map(p).filter(b=>b!==null)),u=c.size?this._objects.filter(b=>c.has(b.entry_id)):this._objects,m=this._config.show_object_filter!==!1&&u.length>1,f=this._objectFilter?p(this._objectFilter):null,x=f&&u.some(b=>b.entry_id===f)?u.filter(b=>b.entry_id===f):u,v=new Date;v.setHours(0,0,0,0);let k=this._pastDays>0,T=k?Ei(x,v,this._pastDays,o):ki(x,v,this._windowDays,o),D=ge(v),F=this._windowDays===365||k,j=F?T.filter(b=>b.events.length>0):T,K=b=>{let Y=`cal-status-${b.status}`,ve=b.projected?"cal-event-projected":"",R=b.status==="overdue"&&b.days_until_due!=null?` (${Di(b.days_until_due,e)})`:"",H=b.projected&&b.interval_days?l`<span class="cal-event-recur">${b.interval_unit&&b.interval_unit!=="days"?`${b.interval_days} ${a("unit_"+b.interval_unit,e)}`:a("cal_every_n_days",e).replace("{n}",String(b.interval_days))}</span>`:_,ce=b.schedule_type==="sensor_based",Ie=ce?l`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${a("cal_source_sensor",e)}" icon="mdi:trending-up"></ha-icon>`:l`<ha-icon class="cal-event-icon cal-source-time"
                title="${b.adaptive_enabled?a("cal_source_time_adaptive",e):a("cal_source_time",e)}"
                icon="${b.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,Pe=ce&&b.prediction_confidence&&b.status!=="triggered"&&!b.projected?l`<span class="cal-event-prediction cal-conf-${b.prediction_confidence}">
            ${a("cal_predicted",e)} · ${a(`cal_confidence_${b.prediction_confidence}`,e)}
          </span>`:_,Fr=this._stats?.budget?.currency_symbol||Li,Ur=b.history_type?a(b.history_type,e):a(b.status,e);return l`
        <div class="cal-event ${ve}"
          @click=${()=>this._onEventClick(b)}>
          ${Ie}
          <span class="cal-status-pill ${Y}">${Ur}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${b.object_name} · ${b.task_name}${R}</div>
            ${Pe}
            ${H}
          </div>
          ${b.avg_cost!=null&&b.avg_cost>0?l`<span class="cal-event-cost">${st(b.avg_cost,Fr,e,0)}</span>`:_}
        </div>
      `},oe=b=>{let[Y,ve,R]=b.date.split("-").map(Number),H=new Date(Y,ve-1,R),ce=b.date===D,Ie=Mi(H,e,"short"),Pe=zi(H,e,"long");return l`
        <div class="cal-day-row">
          <div class="cal-day-pill ${ce?"cal-today":""}">
            <span class="cal-pill-weekday">${Ie}</span>
            <span class="cal-pill-day">${H.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${Pe}</span>
              ${ce?l`<span class="cal-day-today-badge">${a("today",e)}</span>`:_}
            </div>
            ${b.events.length===0?l`<div class="cal-empty">${a("cal_no_events",e)}</div>`:b.events.map(K)}
          </div>
        </div>
      `};return l`
      <ha-card .header=${n}>
        ${t||i?l`
              <div class="cal-controls">
                ${t?l`
                      <div class="cal-window-chips cal-past-chips" title="${a("cal_past_windows",e)||"Past windows"}">
                        ${[30,90].map(b=>l`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===b?"active":""}"
                            @click=${()=>{this._pastDays=b}}>
                            −${b}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${a("cal_forward_windows",e)||"Forward windows"}">
                        ${[7,14,30,365].map(b=>l`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===b?"active":""}"
                            @click=${()=>{this._windowDays=b,this._pastDays=0}}>
                            ${b===365?"+1y":`+${b}d`}
                          </button>
                        `)}
                      </div>
                    `:_}
                ${i?l`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${b=>{this._userFilter=b.target.value}}>
                        <option value="">${a("all_users",e)}</option>
                        <option value="current_user">${a("my_tasks",e)}</option>
                      </select>
                    `:_}
                ${m?l`
                      <select class="cal-user-filter"
                        .value=${f??""}
                        @change=${b=>{this._objectFilter=b.target.value}}>
                        <option value="">${a("all_objects",e)}</option>
                        ${[...u].sort((b,Y)=>b.object.name.localeCompare(Y.object.name)).map(b=>l`<option value=${b.entry_id} ?selected=${b.entry_id===f}>${b.object.name}</option>`)}
                      </select>
                    `:_}
              </div>
            `:_}
        <div class="cal-rolling">
          ${j.length===0&&F?l`<div class="cal-empty">${a("cal_no_events",e)}</div>`:j.map(oe)}
        </div>
      </ha-card>
    `}};B.styles=[at,Si,E`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],d([y({attribute:!1})],B.prototype,"hass",2),d([h()],B.prototype,"_config",2),d([h()],B.prototype,"_objects",2),d([h()],B.prototype,"_stats",2),d([h()],B.prototype,"_windowDays",2),d([h()],B.prototype,"_pastDays",2),d([h()],B.prototype,"_userFilter",2),d([h()],B.prototype,"_objectFilter",2),d([h()],B.prototype,"_unsub",2);var la=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],Ce=class extends A{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return M(this.hass)}setConfig(e){this._config={...e}}updated(){let e=this._lang;e&&!Be(e)&&Ve(e).then(()=>this.requestUpdate())}_valueChanged(e,t){let i={...this._config,[e]:t};e==="show_window_chips"&&t===!0&&delete i.show_window_chips,e==="show_user_filter"&&t===!0&&delete i.show_user_filter,e==="show_object_filter"&&t===!0&&delete i.show_object_filter,e==="title"&&(!t||typeof t=="string"&&t.trim()==="")&&delete i.title,e==="user_filter"&&t===""&&delete i.user_filter,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let e=this._lang,t=this._config.window_days??30,i=this._config.show_window_chips!==!1,n=this._config.show_user_filter!==!1,o=this._config.user_filter??"",p=this._config.title??"";return l`
      <div class="editor">
        <div class="row">
          <label for="title">${a("card_title",e)}</label>
          <input
            id="title"
            type="text"
            .value=${p}
            @input=${c=>this._valueChanged("title",c.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${a("cal_editor_window",e)}</label>
          <select
            id="window"
            @change=${c=>this._valueChanged("window_days",Number(c.target.value))}
          >
            ${la.map(c=>l`<option value="${c.value}" ?selected=${c.value===t}>${a(c.key,e)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${a("cal_editor_show_chips",e)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${i}
            @change=${c=>this._valueChanged("show_window_chips",c.target.checked)}
          />
        </div>
        <div class="hint">${a("cal_editor_chips_hint",e)}</div>
        <div class="row toggle">
          <label for="userf">${a("cal_editor_show_user_filter",e)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${n}
            @change=${c=>this._valueChanged("show_user_filter",c.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${a("cal_editor_default_user",e)}</label>
          <select
            id="userv"
            @change=${c=>this._valueChanged("user_filter",c.target.value)}
          >
            <option value="" ?selected=${o===""}>${a("all_users",e)}</option>
            <option value="current_user" ?selected=${o==="current_user"}>
              ${a("cal_editor_my_tasks",e)}
            </option>
          </select>
        </div>
        <div class="row toggle">
          <label for="objf">${a("cal_editor_show_object_filter",e)}</label>
          <input
            id="objf"
            type="checkbox"
            .checked=${this._config.show_object_filter!==!1}
            @change=${c=>this._valueChanged("show_object_filter",c.target.checked)}
          />
        </div>
        <div class="hint">${a("cal_editor_object_hint",e)}</div>
      </div>
    `}};Ce.styles=E`
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
  `,d([y({attribute:!1})],Ce.prototype,"hass",2),d([h()],Ce.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",B);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",Ce);Vi({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});export{B as MaintenanceCalendarCard};
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
