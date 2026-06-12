var Je=Object.defineProperty;var ia=Object.getOwnPropertyDescriptor;var y=(o,a)=>()=>(o&&(a=o(o=0)),a);var oa=(o,a)=>{for(var e in a)Je(o,e,{get:a[e],enumerable:!0})};var l=(o,a,e,t)=>{for(var n=t>1?void 0:t?ia(a,e):a,r=o.length-1,_;r>=0;r--)(_=o[r])&&(n=(t?_(a,e,n):_(n))||n);return t&&n&&Je(a,e,n),n};var fe,be,Ne,Ye,re,Xe,z,et,Te,Ce=y(()=>{fe=globalThis,be=fe.ShadowRoot&&(fe.ShadyCSS===void 0||fe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ne=Symbol(),Ye=new WeakMap,re=class{constructor(a,e,t){if(this._$cssResult$=!0,t!==Ne)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=a,this.t=e}get styleSheet(){let a=this.o,e=this.t;if(be&&a===void 0){let t=e!==void 0&&e.length===1;t&&(a=Ye.get(e)),a===void 0&&((this.o=a=new CSSStyleSheet).replaceSync(this.cssText),t&&Ye.set(e,a))}return a}toString(){return this.cssText}},Xe=o=>new re(typeof o=="string"?o:o+"",void 0,Ne),z=(o,...a)=>{let e=o.length===1?o[0]:a.reduce((t,n,r)=>t+(_=>{if(_._$cssResult$===!0)return _.cssText;if(typeof _=="number")return _;throw Error("Value passed to 'css' function must be a 'css' function result: "+_+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+o[r+1],o[0]);return new re(e,o,Ne)},et=(o,a)=>{if(be)o.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of a){let t=document.createElement("style"),n=fe.litNonce;n!==void 0&&t.setAttribute("nonce",n),t.textContent=e.cssText,o.appendChild(t)}},Te=be?o=>o:o=>o instanceof CSSStyleSheet?(a=>{let e="";for(let t of a.cssRules)e+=t.cssText;return Xe(e)})(o):o});var ra,sa,la,_a,da,ca,ye,tt,ua,pa,se,le,ke,at,F,_e=y(()=>{Ce();Ce();({is:ra,defineProperty:sa,getOwnPropertyDescriptor:la,getOwnPropertyNames:_a,getOwnPropertySymbols:da,getPrototypeOf:ca}=Object),ye=globalThis,tt=ye.trustedTypes,ua=tt?tt.emptyScript:"",pa=ye.reactiveElementPolyfillSupport,se=(o,a)=>o,le={toAttribute(o,a){switch(a){case Boolean:o=o?ua:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,a){let e=o;switch(a){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},ke=(o,a)=>!ra(o,a),at={attribute:!0,type:String,converter:le,reflect:!1,useDefault:!1,hasChanged:ke};Symbol.metadata??=Symbol("metadata"),ye.litPropertyMetadata??=new WeakMap;F=class extends HTMLElement{static addInitializer(a){this._$Ei(),(this.l??=[]).push(a)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(a,e=at){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(a)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(a,e),!e.noAccessor){let t=Symbol(),n=this.getPropertyDescriptor(a,t,e);n!==void 0&&sa(this.prototype,a,n)}}static getPropertyDescriptor(a,e,t){let{get:n,set:r}=la(this.prototype,a)??{get(){return this[e]},set(_){this[e]=_}};return{get:n,set(_){let d=n?.call(this);r?.call(this,_),this.requestUpdate(a,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(a){return this.elementProperties.get(a)??at}static _$Ei(){if(this.hasOwnProperty(se("elementProperties")))return;let a=ca(this);a.finalize(),a.l!==void 0&&(this.l=[...a.l]),this.elementProperties=new Map(a.elementProperties)}static finalize(){if(this.hasOwnProperty(se("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(se("properties"))){let e=this.properties,t=[..._a(e),...da(e)];for(let n of t)this.createProperty(n,e[n])}let a=this[Symbol.metadata];if(a!==null){let e=litPropertyMetadata.get(a);if(e!==void 0)for(let[t,n]of e)this.elementProperties.set(t,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(a){let e=[];if(Array.isArray(a)){let t=new Set(a.flat(1/0).reverse());for(let n of t)e.unshift(Te(n))}else a!==void 0&&e.push(Te(a));return e}static _$Eu(a,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof a=="string"?a.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(a=>this.enableUpdating=a),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(a=>a(this))}addController(a){(this._$EO??=new Set).add(a),this.renderRoot!==void 0&&this.isConnected&&a.hostConnected?.()}removeController(a){this._$EO?.delete(a)}_$E_(){let a=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(a.set(t,this[t]),delete this[t]);a.size>0&&(this._$Ep=a)}createRenderRoot(){let a=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return et(a,this.constructor.elementStyles),a}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(a=>a.hostConnected?.())}enableUpdating(a){}disconnectedCallback(){this._$EO?.forEach(a=>a.hostDisconnected?.())}attributeChangedCallback(a,e,t){this._$AK(a,t)}_$ET(a,e){let t=this.constructor.elementProperties.get(a),n=this.constructor._$Eu(a,t);if(n!==void 0&&t.reflect===!0){let r=(t.converter?.toAttribute!==void 0?t.converter:le).toAttribute(e,t.type);this._$Em=a,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(a,e){let t=this.constructor,n=t._$Eh.get(a);if(n!==void 0&&this._$Em!==n){let r=t.getPropertyOptions(n),_=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:le;this._$Em=n;let d=_.fromAttribute(e,r.type);this[n]=d??this._$Ej?.get(n)??d,this._$Em=null}}requestUpdate(a,e,t,n=!1,r){if(a!==void 0){let _=this.constructor;if(n===!1&&(r=this[a]),t??=_.getPropertyOptions(a),!((t.hasChanged??ke)(r,e)||t.useDefault&&t.reflect&&r===this._$Ej?.get(a)&&!this.hasAttribute(_._$Eu(a,t))))return;this.C(a,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(a,e,{useDefault:t,reflect:n,wrapped:r},_){t&&!(this._$Ej??=new Map).has(a)&&(this._$Ej.set(a,_??e??this[a]),r!==!0||_!==void 0)||(this._$AL.has(a)||(this.hasUpdated||t||(e=void 0),this._$AL.set(a,e)),n===!0&&this._$Em!==a&&(this._$Eq??=new Set).add(a))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let a=this.scheduleUpdate();return a!=null&&await a,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[n,r]of t){let{wrapped:_}=r,d=this[n];_!==!0||this._$AL.has(n)||d===void 0||this.C(n,void 0,r,d)}}let a=!1,e=this._$AL;try{a=this.shouldUpdate(e),a?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw a=!1,this._$EM(),t}a&&this._$AE(e)}willUpdate(a){}_$AE(a){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(a)),this.updated(a)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(a){return!0}update(a){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(a){}firstUpdated(a){}};F.elementStyles=[],F.shadowRootOptions={mode:"open"},F[se("elementProperties")]=new Map,F[se("finalized")]=new Map,pa?.({ReactiveElement:F}),(ye.reactiveElementVersions??=[]).push("2.1.2")});function pt(o,a){if(!He(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return it!==void 0?it.createHTML(a):a}function ee(o,a,e=o,t){if(a===Z)return a;let n=t!==void 0?e._$Co?.[t]:e._$Cl,r=ue(a)?void 0:a._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(o),n._$AT(o,e,t)),t!==void 0?(e._$Co??=[])[t]=n:e._$Cl=n),n!==void 0&&(a=ee(o,n._$AS(o,a.values),n,t)),a}var Le,nt,we,it,dt,W,ct,ga,Q,ce,ue,He,ma,Ie,de,ot,rt,G,st,lt,ut,Oe,s,ae,un,Z,p,_t,K,ha,pe,De,ge,te,Re,Me,Pe,Fe,va,gt,xe=y(()=>{Le=globalThis,nt=o=>o,we=Le.trustedTypes,it=we?we.createPolicy("lit-html",{createHTML:o=>o}):void 0,dt="$lit$",W=`lit$${Math.random().toFixed(9).slice(2)}$`,ct="?"+W,ga=`<${ct}>`,Q=document,ce=()=>Q.createComment(""),ue=o=>o===null||typeof o!="object"&&typeof o!="function",He=Array.isArray,ma=o=>He(o)||typeof o?.[Symbol.iterator]=="function",Ie=`[ 	
\f\r]`,de=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ot=/-->/g,rt=/>/g,G=RegExp(`>|${Ie}(?:([^\\s"'>=/]+)(${Ie}*=${Ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),st=/'/g,lt=/"/g,ut=/^(?:script|style|textarea|title)$/i,Oe=o=>(a,...e)=>({_$litType$:o,strings:a,values:e}),s=Oe(1),ae=Oe(2),un=Oe(3),Z=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),_t=new WeakMap,K=Q.createTreeWalker(Q,129);ha=(o,a)=>{let e=o.length-1,t=[],n,r=a===2?"<svg>":a===3?"<math>":"",_=de;for(let d=0;d<e;d++){let c=o[d],m,b,h=-1,k=0;for(;k<c.length&&(_.lastIndex=k,b=_.exec(c),b!==null);)k=_.lastIndex,_===de?b[1]==="!--"?_=ot:b[1]!==void 0?_=rt:b[2]!==void 0?(ut.test(b[2])&&(n=RegExp("</"+b[2],"g")),_=G):b[3]!==void 0&&(_=G):_===G?b[0]===">"?(_=n??de,h=-1):b[1]===void 0?h=-2:(h=_.lastIndex-b[2].length,m=b[1],_=b[3]===void 0?G:b[3]==='"'?lt:st):_===lt||_===st?_=G:_===ot||_===rt?_=de:(_=G,n=void 0);let f=_===G&&o[d+1].startsWith("/>")?" ":"";r+=_===de?c+ga:h>=0?(t.push(m),c.slice(0,h)+dt+c.slice(h)+W+f):c+W+(h===-2?d:f)}return[pt(o,r+(o[e]||"<?>")+(a===2?"</svg>":a===3?"</math>":"")),t]},pe=class o{constructor({strings:a,_$litType$:e},t){let n;this.parts=[];let r=0,_=0,d=a.length-1,c=this.parts,[m,b]=ha(a,e);if(this.el=o.createElement(m,t),K.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(n=K.nextNode())!==null&&c.length<d;){if(n.nodeType===1){if(n.hasAttributes())for(let h of n.getAttributeNames())if(h.endsWith(dt)){let k=b[_++],f=n.getAttribute(h).split(W),x=/([.?@])?(.*)/.exec(k);c.push({type:1,index:r,name:x[2],strings:f,ctor:x[1]==="."?Re:x[1]==="?"?Me:x[1]==="@"?Pe:te}),n.removeAttribute(h)}else h.startsWith(W)&&(c.push({type:6,index:r}),n.removeAttribute(h));if(ut.test(n.tagName)){let h=n.textContent.split(W),k=h.length-1;if(k>0){n.textContent=we?we.emptyScript:"";for(let f=0;f<k;f++)n.append(h[f],ce()),K.nextNode(),c.push({type:2,index:++r});n.append(h[k],ce())}}}else if(n.nodeType===8)if(n.data===ct)c.push({type:2,index:r});else{let h=-1;for(;(h=n.data.indexOf(W,h+1))!==-1;)c.push({type:7,index:r}),h+=W.length-1}r++}}static createElement(a,e){let t=Q.createElement("template");return t.innerHTML=a,t}};De=class{constructor(a,e){this._$AV=[],this._$AN=void 0,this._$AD=a,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(a){let{el:{content:e},parts:t}=this._$AD,n=(a?.creationScope??Q).importNode(e,!0);K.currentNode=n;let r=K.nextNode(),_=0,d=0,c=t[0];for(;c!==void 0;){if(_===c.index){let m;c.type===2?m=new ge(r,r.nextSibling,this,a):c.type===1?m=new c.ctor(r,c.name,c.strings,this,a):c.type===6&&(m=new Fe(r,this,a)),this._$AV.push(m),c=t[++d]}_!==c?.index&&(r=K.nextNode(),_++)}return K.currentNode=Q,n}p(a){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(a,t,e),e+=t.strings.length-2):t._$AI(a[e])),e++}},ge=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(a,e,t,n){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=a,this._$AB=e,this._$AM=t,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let a=this._$AA.parentNode,e=this._$AM;return e!==void 0&&a?.nodeType===11&&(a=e.parentNode),a}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(a,e=this){a=ee(this,a,e),ue(a)?a===p||a==null||a===""?(this._$AH!==p&&this._$AR(),this._$AH=p):a!==this._$AH&&a!==Z&&this._(a):a._$litType$!==void 0?this.$(a):a.nodeType!==void 0?this.T(a):ma(a)?this.k(a):this._(a)}O(a){return this._$AA.parentNode.insertBefore(a,this._$AB)}T(a){this._$AH!==a&&(this._$AR(),this._$AH=this.O(a))}_(a){this._$AH!==p&&ue(this._$AH)?this._$AA.nextSibling.data=a:this.T(Q.createTextNode(a)),this._$AH=a}$(a){let{values:e,_$litType$:t}=a,n=typeof t=="number"?this._$AC(a):(t.el===void 0&&(t.el=pe.createElement(pt(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===n)this._$AH.p(e);else{let r=new De(n,this),_=r.u(this.options);r.p(e),this.T(_),this._$AH=r}}_$AC(a){let e=_t.get(a.strings);return e===void 0&&_t.set(a.strings,e=new pe(a)),e}k(a){He(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,n=0;for(let r of a)n===e.length?e.push(t=new o(this.O(ce()),this.O(ce()),this,this.options)):t=e[n],t._$AI(r),n++;n<e.length&&(this._$AR(t&&t._$AB.nextSibling,n),e.length=n)}_$AR(a=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);a!==this._$AB;){let t=nt(a).nextSibling;nt(a).remove(),a=t}}setConnected(a){this._$AM===void 0&&(this._$Cv=a,this._$AP?.(a))}},te=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(a,e,t,n,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=a,this.name=e,this._$AM=n,this.options=r,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(a,e=this,t,n){let r=this.strings,_=!1;if(r===void 0)a=ee(this,a,e,0),_=!ue(a)||a!==this._$AH&&a!==Z,_&&(this._$AH=a);else{let d=a,c,m;for(a=r[0],c=0;c<r.length-1;c++)m=ee(this,d[t+c],e,c),m===Z&&(m=this._$AH[c]),_||=!ue(m)||m!==this._$AH[c],m===p?a=p:a!==p&&(a+=(m??"")+r[c+1]),this._$AH[c]=m}_&&!n&&this.j(a)}j(a){a===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,a??"")}},Re=class extends te{constructor(){super(...arguments),this.type=3}j(a){this.element[this.name]=a===p?void 0:a}},Me=class extends te{constructor(){super(...arguments),this.type=4}j(a){this.element.toggleAttribute(this.name,!!a&&a!==p)}},Pe=class extends te{constructor(a,e,t,n,r){super(a,e,t,n,r),this.type=5}_$AI(a,e=this){if((a=ee(this,a,e,0)??p)===Z)return;let t=this._$AH,n=a===p&&t!==p||a.capture!==t.capture||a.once!==t.once||a.passive!==t.passive,r=a!==p&&(t===p||n);n&&this.element.removeEventListener(this.name,this,t),r&&this.element.addEventListener(this.name,this,a),this._$AH=a}handleEvent(a){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,a):this._$AH.handleEvent(a)}},Fe=class{constructor(a,e,t){this.element=a,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(a){ee(this,a)}},va=Le.litHtmlPolyfillSupport;va?.(pe,ge),(Le.litHtmlVersions??=[]).push("3.3.2");gt=(o,a,e)=>{let t=e?.renderBefore??a,n=t._$litPart$;if(n===void 0){let r=e?.renderBefore??null;t._$litPart$=n=new ge(a.insertBefore(ce(),r),r,void 0,e??{})}return n._$AI(o),n}});var Ue,w,fa,mt=y(()=>{_e();_e();xe();xe();Ue=globalThis,w=class extends F{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let a=super.createRenderRoot();return this.renderOptions.renderBefore??=a.firstChild,a}update(a){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(a),this._$Do=gt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Z}};w._$litElement$=!0,w.finalized=!0,Ue.litElementHydrateSupport?.({LitElement:w});fa=Ue.litElementPolyfillSupport;fa?.({LitElement:w});(Ue.litElementVersions??=[]).push("4.2.2")});var ht=y(()=>{});var E=y(()=>{_e();xe();mt();ht()});var vt=y(()=>{});function v(o){return(a,e)=>typeof e=="object"?ya(o,a,e):((t,n,r)=>{let _=n.hasOwnProperty(r);return n.constructor.createProperty(r,t),_?Object.getOwnPropertyDescriptor(n,r):void 0})(o,a,e)}var ba,ya,Ve=y(()=>{_e();ba={attribute:!0,type:String,converter:le,reflect:!1,hasChanged:ke},ya=(o=ba,a,e)=>{let{kind:t,metadata:n}=e,r=globalThis.litPropertyMetadata.get(n);if(r===void 0&&globalThis.litPropertyMetadata.set(n,r=new Map),t==="setter"&&((o=Object.create(o)).wrapped=!0),r.set(e.name,o),t==="accessor"){let{name:_}=e;return{set(d){let c=a.get.call(this);a.set.call(this,d),this.requestUpdate(_,c,o,!0,d)},init(d){return d!==void 0&&this.C(_,void 0,o,d),d}}}if(t==="setter"){let{name:_}=e;return function(d){let c=this[_];a.call(this,d),this.requestUpdate(_,c,o,!0,d)}}throw Error("Unsupported decorator location: "+t)}});function u(o){return v({...o,state:!0,attribute:!1})}var ft=y(()=>{Ve();});var bt=y(()=>{});var ne=y(()=>{});var yt=y(()=>{ne();});var kt=y(()=>{ne();});var wt=y(()=>{ne();});var xt=y(()=>{ne();});var zt=y(()=>{ne();});var I=y(()=>{vt();Ve();ft();bt();yt();kt();wt();xt();zt()});function i(o,a){let e=(a||"en").substring(0,2).toLowerCase();return At[e]?.[o]??At.en[o]??o}function jt(o){let a=(o||"en").substring(0,2).toLowerCase();return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN"}[a]??"en-US"}function J(o,a){if(!o)return"\u2014";try{let e=o.includes("T")?o:o+"T00:00:00";return new Date(e).toLocaleDateString(jt(a),{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return o}}function Et(o,a){if(!o)return"\u2014";try{let e=jt(a),t=new Date(o);return t.toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}catch{return o}}function $t(o,a,e){return o==null?"\u2014":`${o} ${i("unit_"+(a||"days"),e)}`}function Ae(o,a,e="long"){let t=(a||"en").substring(0,2);return new Date(Date.UTC(2024,0,1+o)).toLocaleDateString(t,{weekday:e,timeZone:"UTC"})}function St(o,a){let e=o.schedule;switch(e?.kind){case"weekdays":return(e.weekdays||[]).map(t=>Ae(t,a,"short")).join(" & ")||"\u2014";case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?i("ord_last",a):i("ord_"+e.nth,a)} ${Ae(e.weekday,a,"long")}`;case"day_of_month":return e.day!=null?`${i("day_word",a)} ${e.day}`:"\u2014";case"one_time":return o.due_date?J(o.due_date,a):i("one_time",a);case"manual":return i("manual",a);case"interval":return $t(e.every,e.unit,a)}return o.schedule_type==="one_time"?o.due_date?J(o.due_date,a):i("one_time",a):o.schedule_type==="manual"?i("manual",a):o.interval_days!=null?$t(o.interval_days,o.interval_unit,a):"\u2014"}function qt(o,a){o.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:a},bubbles:!0,composed:!0}))}var ie,ka,wa,xa,za,Aa,$a,ja,Ea,Sa,qa,Na,Ta,Ca,At,$e,S=y(()=>{"use strict";E();ie={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"#ff5722"},ka={maintenance:"Wartung",objects:"Objekte",tasks:"Aufgaben",overdue:"\xDCberf\xE4llig",due_soon:"Bald f\xE4llig",triggered:"Ausgel\xF6st",trigger_replaced:"Ausl\xF6ser ersetzt",ok:"OK",all:"Alle",new_object:"+ Neues Objekt",edit:"Bearbeiten",delete:"L\xF6schen",add_task:"+ Aufgabe",complete:"Erledigt",completed:"Abgeschlossen",skip:"\xDCberspringen",skipped:"\xDCbersprungen",reset:"Zur\xFCcksetzen",cancel:"Abbrechen",completing:"Wird erledigt\u2026",interval:"Intervall",warning:"Vorwarnung",last_performed:"Zuletzt durchgef\xFChrt",next_due:"N\xE4chste F\xE4lligkeit",days_until_due:"Tage bis f\xE4llig",avg_duration:"\xD8 Dauer",trigger:"Trigger",trigger_type:"Trigger-Typ",threshold_above:"Obergrenze",threshold_below:"Untergrenze",threshold:"Schwellwert",counter:"Z\xE4hler",state_change:"Zustands\xE4nderung",runtime:"Laufzeit",runtime_hours:"Ziel-Laufzeit (Stunden)",target_value:"Zielwert",baseline:"Nulllinie",target_changes:"Ziel-\xC4nderungen",for_minutes:"F\xFCr (Minuten)",time_based:"Zeitbasiert",sensor_based:"Sensorbasiert",manual:"Manuell",one_time:"Einmalig",weekdays:"Wochentage",nth_weekday:"N-ter Wochentag im Monat",day_of_month:"Tag im Monat",recurrence_on_days:"Wiederholen an",recurrence_occurrence:"Vorkommen",recurrence_weekday:"Wochentag",recurrence_day:"Tag im Monat (1\u201331)",ord_1:"1.",ord_2:"2.",ord_3:"3.",ord_4:"4.",ord_5:"5.",ord_last:"Letzter",day_word:"Tag",interval_value:"Intervall",interval_unit:"Einheit",unit_days:"Tage",unit_weeks:"Wochen",unit_months:"Monate",unit_years:"Jahre",due_date:"F\xE4lligkeitsdatum",cleaning:"Reinigung",inspection:"Inspektion",replacement:"Austausch",calibration:"Kalibrierung",service:"Service",custom:"Benutzerdefiniert",history:"Verlauf",cost:"Kosten",duration:"Dauer",both:"Beides",trigger_val:"Trigger-Wert",complete_title:"Erledigt: ",checklist:"Checkliste",checklist_steps_optional:"Checkliste-Schritte (optional)",checklist_placeholder:`Filter reinigen
Dichtung ersetzen
Druck testen`,checklist_help:"Ein Schritt pro Zeile. Max. 100 Eintr\xE4ge.",err_too_long:"{field}: zu lang (max. {n} Zeichen)",err_too_short:"{field}: zu kurz (min. {n} Zeichen)",err_value_too_high:"{field}: zu gro\xDF (max. {n})",err_value_too_low:"{field}: zu klein (min. {n})",err_required:"{field}: Pflichtfeld",err_wrong_type:"{field}: falscher Typ (erwartet: {type})",err_invalid_choice:"{field}: nicht erlaubter Wert",err_invalid_value:"{field}: ung\xFCltiger Wert",feat_schedule_time:"Uhrzeit-Scheduling",feat_schedule_time_desc:"Tasks werden zu einer festen Uhrzeit f\xE4llig statt um Mitternacht.",schedule_time_optional:"F\xE4llig um (optional, HH:MM)",schedule_time_help:"Leer = Mitternacht (Default). HA-Zeitzone.",at_time:"um",notes_optional:"Notizen (optional)",cost_optional:"Kosten (optional)",duration_minutes:"Dauer in Minuten (optional)",days:"Tage",day:"Tag",today:"Heute",d_overdue:"T \xFCberf\xE4llig",no_tasks:"Keine Wartungsaufgaben vorhanden. Erstellen Sie ein Objekt um zu beginnen.",no_tasks_short:"Keine Aufgaben",no_history:"Noch keine Verlaufseintr\xE4ge.",show_all:"Alle anzeigen",cost_duration_chart:"Kosten & Dauer",installed:"Installiert",confirm_delete_object:"Dieses Objekt und alle zugeh\xF6rigen Aufgaben l\xF6schen?",confirm_delete_task:"Diese Aufgabe wirklich l\xF6schen?",min:"Min",max:"Max",save:"Speichern",saving:"Speichern\u2026",edit_task:"Aufgabe bearbeiten",new_task:"Neue Wartungsaufgabe",task_name:"Aufgabenname",maintenance_type:"Wartungstyp",schedule_type:"Planungsart",interval_days:"Intervall (Tage)",warning_days:"Warntage",last_performed_optional:"Zuletzt durchgef\xFChrt (optional)",interval_anchor:"Intervall-Anker",anchor_completion:"Ab Erledigung",anchor_planned:"Ab geplantem Datum (kein Drift)",edit_object:"Objekt bearbeiten",name:"Name",manufacturer_optional:"Hersteller (optional)",model_optional:"Modell (optional)",serial_number_optional:"Seriennummer (optional)",serial_number_label:"S/N",documentation_url_label:"Handbuch",object_notes_label:"Notizen",sort_due_date:"F\xE4lligkeit",sort_object:"Objekt-Name",sort_type:"Typ",sort_task_name:"Aufgaben-Name",all_objects:"Alle Objekte",tasks_lower:"Aufgaben",no_tasks_yet:"Noch keine Aufgaben",add_first_task:"Erste Aufgabe hinzuf\xFCgen",trigger_configuration:"Trigger-Konfiguration",entity_id:"Entit\xE4ts-ID",comma_separated:"kommagetrennt",entity_logic:"Entit\xE4ts-Logik",entity_logic_any:"Beliebige Entit\xE4t l\xF6st aus",entity_logic_all:"Alle Entit\xE4ten m\xFCssen ausl\xF6sen",entities:"Entit\xE4ten",attribute_optional:"Attribut (optional, leer = Zustand)",use_entity_state:"Entit\xE4ts-Zustand verwenden (kein Attribut)",trigger_above:"Ausl\xF6sen wenn \xFCber",trigger_below:"Ausl\xF6sen wenn unter",for_at_least_minutes:"F\xFCr mindestens (Minuten)",safety_interval_days:"Sicherheitsintervall (Tage, optional)",safety_interval:"Sicherheitsintervall (optional)",delta_mode:"Delta-Modus",from_state_optional:"Von Zustand (optional)",to_state_optional:"Zu Zustand (optional)",documentation_url_optional:"Dokumentation URL (optional)",object_notes_optional:"Notizen (optional)",nfc_tag_id_optional:"NFC-Tag-ID (optional)",nfc_tags_empty_help:"Noch keine NFC-Tags in Home Assistant registriert.",nfc_tags_open_settings:"Tag-Einstellungen \xF6ffnen",nfc_tags_refresh:"Aktualisieren",environmental_entity_optional:"Umgebungs-Sensor (optional)",environmental_entity_helper:"z.B. sensor.aussentemperatur \u2014 passt das Intervall an Umgebungswerte an",environmental_attribute_optional:"Umgebungs-Attribut (optional)",nfc_tag_id:"NFC-Tag-ID",nfc_linked:"NFC-Tag verkn\xFCpft",nfc_link_hint:"Klicken um NFC-Tag zu verkn\xFCpfen",responsible_user:"Verantwortlicher Benutzer",no_user_assigned:"(Kein Benutzer zugewiesen)",all_users:"Alle Benutzer",my_tasks:"Meine Aufgaben",tab_calendar:"Kalender",cal_no_events:"Keine Wartung",cal_window_7:"7 Tage",cal_window_14:"14 Tage",cal_window_30:"30 Tage",cal_window_365:"1 Jahr",cal_every_n_days:"alle {n} Tage",cal_source_time:"Zeit-basiert",cal_source_time_adaptive:"Zeit-basiert (adaptiv)",cal_source_sensor:"Sensor-basiert",cal_predicted:"vorhergesagt",cal_confidence_high:"hohe Genauigkeit",cal_confidence_medium:"mittlere Genauigkeit",cal_confidence_low:"niedrige Genauigkeit",budget_monthly:"Monatsbudget",budget_yearly:"Jahresbudget",groups:"Gruppen",new_group:"Neue Gruppe",edit_group:"Gruppe bearbeiten",no_groups:"Keine Gruppen vorhanden",delete_group:"Gruppe l\xF6schen",delete_group_confirm:"Gruppe '{name}' wirklich l\xF6schen?",group_select_tasks:"Aufgaben ausw\xE4hlen",group_name_required:"Name erforderlich",description_optional:"Beschreibung (optional)",selected:"Ausgew\xE4hlt",loading_chart:"Daten werden geladen...",was_maintenance_needed:"War diese Wartung n\xF6tig?",feedback_needed:"N\xF6tig",feedback_not_needed:"Nicht n\xF6tig",feedback_not_sure:"Unsicher",suggested_interval:"Empfohlenes Intervall",apply_suggestion:"\xDCbernehmen",reanalyze:"Neu analysieren",reanalyze_result:"Neue Analyse",reanalyze_insufficient_data:"Nicht gen\xFCgend Daten f\xFCr eine Empfehlung",data_points:"Datenpunkte",dismiss_suggestion:"Verwerfen",confidence_low:"Niedrig",confidence_medium:"Mittel",confidence_high:"Hoch",recommended:"empfohlen",seasonal_awareness:"Saisonale Anpassung",edit_seasonal_overrides:"Saison-Faktoren bearbeiten",seasonal_overrides_title:"Saisonale Faktoren (Override)",seasonal_overrides_hint:"Faktor pro Monat (0.1\u20135.0). Leer = automatisch gelernt.",seasonal_override_invalid:"Ung\xFCltiger Wert",seasonal_override_range:"Faktor muss zwischen 0.1 und 5.0 liegen",clear_all:"Alle zur\xFCcksetzen",seasonal_chart_title:"Saisonale Faktoren",seasonal_learned:"Gelernt",seasonal_manual:"Manuell",month_jan:"Jan",month_feb:"Feb",month_mar:"M\xE4r",month_apr:"Apr",month_may:"Mai",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dez",sensor_prediction:"Sensorvorhersage",degradation_trend:"Trend",trend_rising:"Steigend",trend_falling:"Fallend",trend_stable:"Stabil",trend_insufficient_data:"Unzureichende Daten",days_until_threshold:"Tage bis Schwellwert",threshold_exceeded:"Schwellwert \xFCberschritten",environmental_adjustment:"Umgebungsfaktor",sensor_prediction_urgency:"Sensor prognostiziert Schwellwert in ~{days} Tagen",day_short:"Tag",weibull_reliability_curve:"Zuverl\xE4ssigkeitskurve",weibull_failure_probability:"Ausfallwahrscheinlichkeit",weibull_r_squared:"G\xFCte R\xB2",beta_early_failures:"Fr\xFChausf\xE4lle",beta_random_failures:"Zuf\xE4llige Ausf\xE4lle",beta_wear_out:"Verschlei\xDF",beta_highly_predictable:"Hochvorhersagbar",confidence_interval:"Konfidenzintervall",confidence_conservative:"Konservativ",confidence_aggressive:"Optimistisch",current_interval_marker:"Aktuelles Intervall",recommended_marker:"Empfohlen",characteristic_life:"Charakteristische Lebensdauer",chart_mini_sparkline:"Trend-Sparkline",chart_history:"Kosten- und Dauer-Verlauf",chart_seasonal:"Saisonfaktoren, 12 Monate",chart_weibull:"Weibull-Zuverl\xE4ssigkeitskurve",chart_sparkline:"Sensor-Triggerwert-Verlauf",days_progress:"Tagesfortschritt",qr_code:"QR-Code",qr_generating:"QR-Code wird generiert\u2026",qr_error:"QR-Code konnte nicht generiert werden.",qr_error_no_url:"Keine HA-URL konfiguriert. Bitte unter Einstellungen \u2192 System \u2192 Netzwerk eine externe oder interne URL setzen.",save_error:"Fehler beim Speichern. Bitte erneut versuchen.",qr_print:"Drucken",qr_download:"SVG herunterladen",qr_action:"Aktion beim Scannen",qr_action_view:"Wartungsinfo anzeigen",qr_action_complete:"Wartung als erledigt markieren",qr_url_mode:"Link-Typ",qr_mode_companion:"Companion App",qr_mode_local:"Lokal (mDNS)",qr_mode_server:"Server-URL",overview:"\xDCbersicht",analysis:"Analyse",recent_activities:"Letzte Aktivit\xE4ten",search_notes:"Notizen durchsuchen",avg_cost:"\xD8 Kosten",no_advanced_features:"Keine erweiterten Funktionen aktiviert",no_advanced_features_hint:"Aktiviere \u201EAdaptive Intervalle\u201C oder \u201ESaisonale Muster\u201C in den Integrationseinstellungen, um hier Analysedaten zu sehen.",analysis_not_enough_data:"Noch nicht gen\xFCgend Daten f\xFCr die Analyse vorhanden.",analysis_not_enough_data_hint:"Die Weibull-Analyse ben\xF6tigt mindestens 5 abgeschlossene Wartungen, saisonale Muster werden nach 6+ Datenpunkten pro Monat sichtbar.",analysis_manual_task_hint:"Manuelle Aufgaben ohne Intervall erzeugen keine Analysedaten.",completions:"Abschl\xFCsse",current:"Aktuell",shorter:"K\xFCrzer",longer:"L\xE4nger",normal:"Normal",disabled:"Deaktiviert",compound_logic:"Verkn\xFCpfungslogik",card_title:"Titel",card_show_header:"Kopfzeile mit Statistiken anzeigen",card_show_actions:"Aktionsbuttons anzeigen",card_compact:"Kompaktmodus",card_max_items:"Max. Eintr\xE4ge (0 = alle)",card_filter_status:"Nach Status filtern",card_filter_status_help:"Leer = alle Status zeigen.",card_filter_objects:"Nach Objekten filtern",card_filter_objects_help:"Leer = alle Objekte zeigen.",card_filter_entities:"Nach Entit\xE4ten filtern (entity_ids)",card_filter_entities_help:"W\xE4hle Sensor-/Binary-Sensor-Entit\xE4ten dieser Integration. Leer = alle.",card_loading_objects:"Lade Objekte\u2026",card_load_error:"Objekte konnten nicht geladen werden \u2014 bitte WS-Verbindung pr\xFCfen.",card_no_tasks_title:"Noch keine Wartungsaufgaben",card_no_tasks_cta:"\u2192 Im Maintenance-Panel anlegen",no_objects:"Keine Objekte vorhanden.",action_error:"Aktion fehlgeschlagen. Bitte erneut versuchen.",area_id_optional:"Bereich (optional)",installation_date_optional:"Installationsdatum (optional)",custom_icon_optional:"Icon (optional, z.B. mdi:wrench)",task_enabled:"Aufgabe aktiviert",skip_reason_prompt:"Aufgabe \xFCberspringen?",reason_optional:"Grund (optional)",reset_date_prompt:"Aufgabe als ausgef\xFChrt markieren?",reset_date_optional:"Letztes Erledigungs-Datum (optional, Standard: heute)",notes_label:"Notizen",documentation_label:"Dokumentation",no_nfc_tag:"\u2014 Kein Tag \u2014",dashboard:"Dashboard",settings:"Einstellungen",settings_features:"Erweiterte Funktionen",settings_features_desc:"Erweiterte Funktionen ein- oder ausschalten. Deaktivieren blendet sie in der Oberfl\xE4che aus, l\xF6scht aber keine Daten.",feat_adaptive:"Adaptive Intervalle",feat_adaptive_desc:"Optimale Intervalle aus Wartungshistorie lernen",feat_predictions:"Sensorvorhersagen",feat_predictions_desc:"Trigger-Datum anhand von Sensordegradation vorhersagen",feat_seasonal:"Saisonale Anpassungen",feat_seasonal_desc:"Intervalle basierend auf saisonalen Mustern anpassen",feat_environmental:"Umgebungskorrelation",feat_environmental_desc:"Intervalle mit Temperatur/Luftfeuchtigkeit korrelieren",feat_budget:"Budgetverfolgung",feat_budget_desc:"Monatliche und j\xE4hrliche Wartungsausgaben verfolgen",feat_groups:"Aufgabengruppen",feat_groups_desc:"Aufgaben in logische Gruppen organisieren",feat_checklists:"Checklisten",feat_checklists_desc:"Mehrstufige Verfahren zur Aufgabenerlediung",settings_general:"Allgemein",settings_default_warning:"Standard-Warntage",settings_panel_enabled:"Seitenleisten-Panel",settings_panel_title:"Panel-Titel",settings_notifications:"Benachrichtigungen",settings_notify_service:"Benachrichtigungsdienst",test_notification:"Test-Benachrichtigung",send_test:"Test senden",testing:"Sende\u2026",test_notification_success:"Test-Benachrichtigung gesendet",test_notification_failed:"Test-Benachrichtigung fehlgeschlagen",settings_notify_due_soon:"Bei baldiger F\xE4lligkeit benachrichtigen",settings_notify_overdue:"Bei \xDCberf\xE4lligkeit benachrichtigen",settings_notify_triggered:"Bei Ausl\xF6sung benachrichtigen",settings_interval_hours:"Wiederholungsintervall (Stunden, 0 = einmalig)",settings_quiet_hours:"Ruhezeiten",settings_quiet_start:"Beginn",settings_quiet_end:"Ende",settings_max_per_day:"Max. Benachrichtigungen pro Tag (0 = unbegrenzt)",settings_bundling:"Benachrichtigungen b\xFCndeln",settings_bundle_threshold:"B\xFCndelungsschwelle",settings_actions:"Mobile Aktionsbuttons",settings_action_complete:'"Erledigt"-Button anzeigen',settings_action_skip:'"\xDCberspringen"-Button anzeigen',settings_action_snooze:'"Schlummern"-Button anzeigen',settings_snooze_hours:"Schlummerdauer (Stunden)",settings_budget:"Budget",settings_currency:"W\xE4hrung",settings_budget_monthly:"Monatsbudget",settings_budget_yearly:"Jahresbudget",settings_budget_alerts:"Budget-Warnungen",settings_budget_threshold:"Warnschwelle (%)",settings_import_export:"Import / Export",settings_export_json:"JSON exportieren",settings_export_yaml:"YAML exportieren",settings_export_csv:"CSV exportieren",settings_import_csv:"CSV importieren",settings_import_placeholder:"JSON- oder CSV-Inhalt hier einf\xFCgen\u2026",settings_import_btn:"Importieren",settings_import_success:"{count} Objekte erfolgreich importiert.",settings_export_success:"Export heruntergeladen.",settings_saved:"Einstellung gespeichert.",settings_include_history:"Verlauf einbeziehen",sort_alphabetical:"Alphabetisch",sort_due_soonest:"Fr\xFChestens f\xE4llig",sort_task_count:"Aufgaben-Anzahl",sort_area:"Bereich",sort_assigned_user:"Verantwortlicher",sort_group:"Gruppe",groupby_none:"Keine Gruppierung",groupby_area:"Nach Bereich",groupby_group:"Nach Gruppe",groupby_user:"Nach Verantwortlichem",filter_label:"Filter",user_label:"Benutzer",sort_label:"Sortierung",group_by_label:"Gruppieren nach",state_value_help:'Verwende den HA-Zustandswert (meist kleingeschrieben, z.\u202FB. "on"/"off"). Gro\xDF-/Kleinschreibung wird beim Speichern normalisiert.',target_changes_help:"Anzahl der passenden \xDCberg\xE4nge, nach denen der Trigger ausl\xF6st (Standard: 1).",qr_print_title:"QR-Codes drucken",qr_print_desc:"Erzeuge eine Druckseite mit QR-Codes zum Ausschneiden und Anbringen an den Ger\xE4ten.",qr_print_load:"Objekte laden",qr_print_filter:"Filter",qr_print_objects:"Objekte",qr_print_actions:"Aktionen",qr_print_url_mode:"Link-Typ",qr_print_estimate:"Gesch\xE4tzte QR-Codes",qr_print_over_limit:"Obergrenze ist 200, bitte Filter eingrenzen",qr_print_generate:"QR-Codes erzeugen",qr_print_generating:"Erzeuge\u2026",qr_print_ready:"QR-Codes bereit",qr_print_print_button:"Drucken",qr_print_empty:"Keine QR-Codes zu erzeugen",qr_action_skip:"\xDCberspringen",vacation_title:"Urlaubsmodus",vacation_active:"aktiv",vacation_ended:"beendet",vacation_desc:"Plane deinen Urlaub: Benachrichtigungen werden w\xE4hrend des Zeitraums plus Puffer-Tagen pausiert. Du kannst pro Aufgabe Ausnahmen festlegen.",vacation_enable:"Urlaubsmodus aktivieren",vacation_start:"Beginn",vacation_end:"Ende",vacation_buffer:"Puffer (Tage)",vacation_exempt_title:"Trotz Urlaubsmodus benachrichtigen",vacation_exempt_desc:"W\xE4hle Aufgaben aus, f\xFCr die auch im Urlaub Benachrichtigungen kommen sollen (z. B. kritische Pool-Chemie).",vacation_load_tasks:"Aufgaben laden",vacation_preview_btn:"Vorschau anzeigen",vacation_preview_affected:"Aufgaben betroffen",vacation_event_due_soon:"wird bald f\xE4llig",vacation_event_overdue:"wird \xFCberf\xE4llig",vacation_event_triggered_est:"Sensor-Trigger m\xF6glich",vacation_sensor_based:"(sensorbasiert)",vacation_action_notify:"Trotzdem benachrichtigen",vacation_action_unsilence:"Wieder stummschalten",vacation_marked_complete:"Als erledigt markiert",vacation_marked_skip:"\xDCbersprungen",vacation_end_now:"Urlaub jetzt beenden",add:"Hinzuf\xFCgen",show_stats:"Statistiken + Diagramme",hide_stats:"Statistiken ausblenden",adaptive_no_data:"Noch nicht genug Completion-Historie f\xFCr die adaptive Auswertung. Schlie\xDFe diese Aufgabe ein paar Mal mehr ab, um Intervall-Empfehlungen und Zuverl\xE4ssigkeitskurven freizuschalten.",suggestion_applied:"Vorgeschlagenes Intervall \xFCbernommen",vacation_mode:"Urlaubsmodus",vacation_status_active:"Aktiv",vacation_status_scheduled:"Geplant",vacation_status_inactive:"Inaktiv",vacation_end_now_confirm:"Urlaub sofort beenden?",vacation_exempt_count:"ausgenommen",vacation_advanced:"Erweitert\u2026",vacation_open_panel:"Im Panel \xF6ffnen",enable:"Aktivieren",saved:"Gespeichert",budget_monthly_set:"Monatsbudget setzen",budget_yearly_set:"Jahresbudget setzen",budget_advanced:"W\xE4hrung, Alarme\u2026",budget_open_panel:"Im Panel \xF6ffnen",groups_empty:"Keine Gruppen vorhanden.",group_new_placeholder:"Gruppe hinzuf\xFCgen\u2026",group_delete_confirm:'Gruppe "{name}" l\xF6schen?',groups_manage_tasks:"Aufgaben-Zuordnungen verwalten\u2026",groups_open_panel:"Im Panel \xF6ffnen",unassigned:"Nicht zugewiesen",no_area:"Kein Bereich",has_overdue:"\xDCberf\xE4llige Aufgaben",object:"Objekt",settings_panel_access:"Panel-Zugriff",settings_panel_access_desc:"Admins sehen immer das vollst\xE4ndige Panel. W\xE4hle hier Non-Admin-User aus, die ebenfalls Vollzugriff bekommen sollen \u2014 alle anderen Non-Admins sehen nur Abhaken/\xDCberspringen.",no_non_admin_users:"Keine Non-Admin-User gefunden. Lege welche unter Einstellungen \u2192 Personen an.",owner_label:"Owner",feat_completion_actions:"Completion-Actions",feat_completion_actions_desc:"Pro Aufgabe HA-Action beim Abschluss konfigurieren + Quick-Complete-QR mit voreingestellten Werten.",on_complete_action_title:"Beim Abschluss: HA-Action ausl\xF6sen (optional)",on_complete_action_desc:"Ruft beim Erledigen der Aufgabe einen HA-Service auf \u2014 z. B. einen Z\xE4hler am Ger\xE4t zur\xFCcksetzen.",on_complete_action_service:"Service",on_complete_action_target:"Ziel-Entit\xE4t",on_complete_action_target_hint:"Achtung: Domain der Entit\xE4t muss zum Service passen \u2014 z. B. 'button.press' nur f\xFCr button.*, 'counter.increment' nur f\xFCr counter.*, 'input_button.press' nur f\xFCr input_button.* etc. Bei Mismatch fired die Aktion nicht (HA loggt 'Referenced entities ... missing or not currently available').",on_complete_action_data:"Daten (JSON, optional)",on_complete_action_test:"Konfiguration pr\xFCfen",on_complete_action_test_success:"\u2713 Konfiguration g\xFCltig (Aktion wird erst beim Abschluss ausgef\xFChrt)",on_complete_action_test_failed:"Konfigurationsfehler",quick_complete_defaults_title:"Schnell-Abschluss-Standardwerte (f\xFCr QR-Scans, optional)",quick_complete_defaults_desc:"Voreingestellte Werte f\xFCr Schnell-Abschluss-QR. Ohne Werte \xF6ffnet der QR den Abschluss-Dialog.",quick_complete_defaults_notes:"Notizen",quick_complete_defaults_cost:"Kosten",quick_complete_defaults_duration:"Dauer (Minuten)",quick_complete_defaults_feedback_none:"Kein Feedback",quick_complete_defaults_feedback_needed:"War notwendig",quick_complete_defaults_feedback_not_needed:"War nicht notwendig",quick_complete_success:"Schnell als erledigt markiert",show_all_objects:"Alle Objekte anzeigen",show_all_tasks:"Filter zur\xFCcksetzen \u2014 alle Aufgaben anzeigen",filter_to_overdue:"Auf \xFCberf\xE4llige Aufgaben filtern",filter_to_due_soon:"Auf bald f\xE4llige Aufgaben filtern",filter_to_triggered:"Auf ausgel\xF6ste Aufgaben filtern",open_task:"Aufgabe \xF6ffnen",show_details:"Verlauf + Statistik anzeigen",hide_details:"Details ausblenden",history_empty:"Noch keine Eintr\xE4ge.",history_edit_button:"Eintrag bearbeiten",total_cost:"Gesamtkosten",times_performed:"Erledigt",older_entries:"\xE4ltere",open_in_panel:"Im Wartungspanel \xF6ffnen",skip_reason:"\xDCbersprungen-Grund (optional)",reset_to_date:"last_performed setzen auf",delete_task_confirm:"Diese Aufgabe und ihren Verlauf l\xF6schen?",delete_object_confirm:"Dieses Objekt und alle seine Aufgaben l\xF6schen?",loading:"Laden\u2026"},wa={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",ok:"OK",all:"All",new_object:"+ New Object",edit:"Edit",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",reset:"Reset",cancel:"Cancel",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",runtime_hours:"Target runtime (hours)",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",custom:"Custom",history:"History",cost:"Cost",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_optional:"Due at time (optional, HH:MM)",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",tasks_lower:"tasks",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",safety_interval:"Safety interval (optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_window_7:"7 days",cal_window_14:"14 days",cal_window_30:"30 days",cal_window_365:"1 year",cal_every_n_days:"every {n} days",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",no_advanced_features_hint:"Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",completions:"completions",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",installation_date_optional:"Installation date (optional)",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_predictions:"Sensor Predictions",feat_predictions_desc:"Predict trigger dates from sensor degradation",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_snooze_hours:"Snooze duration (hours)",settings_budget:"Budget",settings_currency:"Currency",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_import_csv:"Import CSV",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",filter_label:"Filter",user_label:"User",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",group_delete_confirm:'Delete group "{name}"?',groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always see the full panel. Pick non-admin users below who should also get full panel access \u2014 every other non-admin sees only Complete and Skip.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc:"Per-task HA action on complete + quick-complete QR with pre-set values.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_service:"Service",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",quick_complete_defaults_title:"Quick-complete defaults (for QR scans, optional)",quick_complete_defaults_desc:"Pre-set values for quick-complete QR scans. Without these, the QR opens the complete dialog.",quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026"},xa={maintenance:"Onderhoud",objects:"Objecten",tasks:"Taken",overdue:"Achterstallig",due_soon:"Binnenkort",triggered:"Geactiveerd",ok:"OK",all:"Alle",new_object:"+ Nieuw object",edit:"Bewerken",delete:"Verwijderen",add_task:"+ Taak",complete:"Voltooid",completed:"Voltooid",skip:"Overslaan",skipped:"Overgeslagen",reset:"Resetten",cancel:"Annuleren",completing:"Wordt voltooid\u2026",interval:"Interval",warning:"Waarschuwing",last_performed:"Laatst uitgevoerd",next_due:"Volgende keer",days_until_due:"Dagen tot vervaldatum",avg_duration:"\xD8 Duur",trigger:"Trigger",trigger_type:"Triggertype",threshold_above:"Bovengrens",threshold_below:"Ondergrens",threshold:"Drempelwaarde",counter:"Teller",state_change:"Statuswijziging",runtime:"Looptijd",runtime_hours:"Doellooptijd (uren)",target_value:"Doelwaarde",baseline:"Basislijn",target_changes:"Doelwijzigingen",for_minutes:"Voor (minuten)",time_based:"Tijdgebaseerd",sensor_based:"Sensorgebaseerd",manual:"Handmatig",one_time:"Eenmalig",weekdays:"Weekdagen",nth_weekday:"Zoveelste weekdag van de maand",day_of_month:"Dag van de maand",recurrence_on_days:"Herhalen op",recurrence_occurrence:"Voorkomen",recurrence_weekday:"Weekdag",recurrence_day:"Dag van de maand (1\u201331)",ord_1:"1e",ord_2:"2e",ord_3:"3e",ord_4:"4e",ord_5:"5e",ord_last:"Laatste",day_word:"Dag",interval_value:"Interval",interval_unit:"Eenheid",unit_days:"Dagen",unit_weeks:"Weken",unit_months:"Maanden",unit_years:"Jaren",due_date:"Vervaldatum",cleaning:"Reiniging",inspection:"Inspectie",replacement:"Vervanging",calibration:"Kalibratie",service:"Service",custom:"Aangepast",history:"Geschiedenis",cost:"Kosten",duration:"Duur",both:"Beide",trigger_val:"Triggerwaarde",complete_title:"Voltooid: ",checklist:"Checklist",checklist_steps_optional:"Checklist-stappen (optioneel)",checklist_placeholder:`Filter schoonmaken
Pakking vervangen
Druk testen`,checklist_help:"E\xE9n stap per regel. Max. 100 items.",err_too_long:"{field}: te lang (max. {n} tekens)",err_too_short:"{field}: te kort (min. {n} tekens)",err_value_too_high:"{field}: te groot (max. {n})",err_value_too_low:"{field}: te klein (min. {n})",err_required:"{field}: verplicht",err_wrong_type:"{field}: verkeerd type (verwacht: {type})",err_invalid_choice:"{field}: niet-toegestane waarde",err_invalid_value:"{field}: ongeldige waarde",feat_schedule_time:"Tijd-van-dag-planning",feat_schedule_time_desc:"Taken vervallen op een specifieke tijd in plaats van middernacht.",schedule_time_optional:"Vervaldagstijd (optioneel, HH:MM)",schedule_time_help:"Leeg = middernacht (standaard). HA-tijdzone.",at_time:"om",notes_optional:"Notities (optioneel)",cost_optional:"Kosten (optioneel)",duration_minutes:"Duur in minuten (optioneel)",days:"dagen",day:"dag",today:"Vandaag",d_overdue:"d achterstallig",no_tasks:"Geen onderhoudstaken. Maak een object aan om te beginnen.",no_tasks_short:"Geen taken",no_history:"Nog geen geschiedenisitems.",show_all:"Alles tonen",cost_duration_chart:"Kosten & Duur",installed:"Ge\xEFnstalleerd",confirm_delete_object:"Dit object en alle bijbehorende taken verwijderen?",confirm_delete_task:"Deze taak verwijderen?",min:"Min",max:"Max",save:"Opslaan",saving:"Opslaan\u2026",edit_task:"Taak bewerken",new_task:"Nieuwe onderhoudstaak",task_name:"Taaknaam",maintenance_type:"Onderhoudstype",schedule_type:"Planningstype",interval_days:"Interval (dagen)",warning_days:"Waarschuwingsdagen",last_performed_optional:"Laatst uitgevoerd (optioneel)",interval_anchor:"Interval-anker",anchor_completion:"Vanaf voltooiing",anchor_planned:"Vanaf geplande datum (geen drift)",edit_object:"Object bewerken",name:"Naam",manufacturer_optional:"Fabrikant (optioneel)",model_optional:"Model (optioneel)",serial_number_optional:"Serienummer (optioneel)",serial_number_label:"S/N",documentation_url_label:"Handleiding",object_notes_label:"Notities",sort_due_date:"Vervaldatum",sort_object:"Objectnaam",sort_type:"Type",sort_task_name:"Taaknaam",all_objects:"Alle objecten",tasks_lower:"taken",no_tasks_yet:"Nog geen taken",add_first_task:"Eerste taak toevoegen",trigger_configuration:"Triggerconfiguratie",entity_id:"Entiteits-ID",comma_separated:"kommagescheiden",entity_logic:"Entiteitslogica",entity_logic_any:"Elke entiteit triggert",entity_logic_all:"Alle entiteiten moeten triggeren",entities:"entiteiten",attribute_optional:"Attribuut (optioneel, leeg = status)",use_entity_state:"Entiteitsstatus gebruiken (geen attribuut)",trigger_above:"Activeren als boven",trigger_below:"Activeren als onder",for_at_least_minutes:"Voor minstens (minuten)",safety_interval_days:"Veiligheidsinterval (dagen, optioneel)",safety_interval:"Veiligheidsinterval (optioneel)",delta_mode:"Deltamodus",from_state_optional:"Van status (optioneel)",to_state_optional:"Naar status (optioneel)",documentation_url_optional:"Documentatie-URL (optioneel)",object_notes_optional:"Notities (optioneel)",nfc_tag_id_optional:"NFC-tag-ID (optioneel)",nfc_tags_empty_help:"Nog geen NFC-tags geregistreerd in Home Assistant.",nfc_tags_open_settings:"Tag-instellingen openen",nfc_tags_refresh:"Vernieuwen",environmental_entity_optional:"Omgevingssensor (optioneel)",environmental_entity_helper:"bv. sensor.buitentemperatuur \u2014 past het interval aan op basis van omgevingswaarden",environmental_attribute_optional:"Omgevingsattribuut (optioneel)",nfc_tag_id:"NFC-tag-ID",nfc_linked:"NFC-tag gekoppeld",nfc_link_hint:"Klik om NFC-tag te koppelen",responsible_user:"Verantwoordelijke gebruiker",no_user_assigned:"(Geen gebruiker toegewezen)",all_users:"Alle gebruikers",my_tasks:"Mijn taken",tab_calendar:"Kalender",cal_no_events:"Geen onderhoud",cal_window_7:"7 dagen",cal_window_14:"14 dagen",cal_window_30:"30 dagen",cal_window_365:"1 jaar",cal_every_n_days:"elke {n} dagen",cal_source_time:"Tijd-gebaseerd",cal_source_time_adaptive:"Tijd-gebaseerd (adaptief)",cal_source_sensor:"Sensor-gebaseerd",cal_predicted:"voorspeld",cal_confidence_high:"hoge zekerheid",cal_confidence_medium:"gemiddelde zekerheid",cal_confidence_low:"lage zekerheid",budget_monthly:"Maandbudget",budget_yearly:"Jaarbudget",groups:"Groepen",new_group:"Nieuwe groep",edit_group:"Groep bewerken",no_groups:"Nog geen groepen",delete_group:"Groep verwijderen",delete_group_confirm:"Groep '{name}' verwijderen?",group_select_tasks:"Taken selecteren",group_name_required:"Naam vereist",description_optional:"Beschrijving (optioneel)",selected:"Geselecteerd",loading_chart:"Grafiekgegevens laden...",was_maintenance_needed:"Was dit onderhoud nodig?",feedback_needed:"Nodig",feedback_not_needed:"Niet nodig",feedback_not_sure:"Niet zeker",suggested_interval:"Voorgesteld interval",apply_suggestion:"Toepassen",reanalyze:"Opnieuw analyseren",reanalyze_result:"Nieuwe analyse",reanalyze_insufficient_data:"Onvoldoende gegevens voor een aanbeveling",data_points:"datapunten",dismiss_suggestion:"Negeren",confidence_low:"Laag",confidence_medium:"Gemiddeld",confidence_high:"Hoog",recommended:"aanbevolen",seasonal_awareness:"Seizoensbewustzijn",edit_seasonal_overrides:"Seizoensfactoren bewerken",seasonal_overrides_title:"Seizoensfactoren (override)",seasonal_overrides_hint:"Factor per maand (0.1\u20135.0). Leeg = automatisch geleerd.",seasonal_override_invalid:"Ongeldige waarde",seasonal_override_range:"Factor moet tussen 0.1 en 5.0 liggen",clear_all:"Alles wissen",seasonal_chart_title:"Seizoensfactoren",seasonal_learned:"Geleerd",seasonal_manual:"Handmatig",month_jan:"Jan",month_feb:"Feb",month_mar:"Mrt",month_apr:"Apr",month_may:"Mei",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensorvoorspelling",degradation_trend:"Trend",trend_rising:"Stijgend",trend_falling:"Dalend",trend_stable:"Stabiel",trend_insufficient_data:"Onvoldoende gegevens",days_until_threshold:"Dagen tot drempelwaarde",threshold_exceeded:"Drempelwaarde overschreden",environmental_adjustment:"Omgevingsfactor",sensor_prediction_urgency:"Sensor voorspelt drempelwaarde in ~{days} dagen",day_short:"dag",weibull_reliability_curve:"Betrouwbaarheidscurve",weibull_failure_probability:"Faalkans",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Vroege uitval",beta_random_failures:"Willekeurige uitval",beta_wear_out:"Slijtage",beta_highly_predictable:"Zeer voorspelbaar",confidence_interval:"Betrouwbaarheidsinterval",confidence_conservative:"Conservatief",confidence_aggressive:"Optimistisch",current_interval_marker:"Huidig interval",recommended_marker:"Aanbevolen",characteristic_life:"Karakteristieke levensduur",chart_mini_sparkline:"Trend-sparkline",chart_history:"Kosten- en duurgeschiedenis",chart_seasonal:"Seizoensfactoren, 12 maanden",chart_weibull:"Weibull-betrouwbaarheidscurve",chart_sparkline:"Sensor-triggerwaardegrafiek",days_progress:"Dagenvoortgang",qr_code:"QR-code",qr_generating:"QR-code genereren\u2026",qr_error:"QR-code kon niet worden gegenereerd.",qr_error_no_url:"Geen HA-URL geconfigureerd. Stel een externe of interne URL in via Instellingen \u2192 Systeem \u2192 Netwerk.",save_error:"Opslaan mislukt. Probeer het opnieuw.",qr_print:"Afdrukken",qr_download:"SVG downloaden",qr_action:"Actie bij scannen",qr_action_view:"Onderhoudsinfo bekijken",qr_action_complete:"Onderhoud als voltooid markeren",qr_url_mode:"Linktype",qr_mode_companion:"Companion App",qr_mode_local:"Lokaal (mDNS)",qr_mode_server:"Server-URL",overview:"Overzicht",analysis:"Analyse",recent_activities:"Recente activiteiten",search_notes:"Notities doorzoeken",avg_cost:"\xD8 Kosten",no_advanced_features:"Geen geavanceerde functies ingeschakeld",no_advanced_features_hint:"Schakel \u201EAdaptieve Intervallen\u201D of \u201ESeizoenpatronen\u201D in via de integratie-instellingen om hier analysegegevens te zien.",analysis_not_enough_data:"Nog niet genoeg gegevens voor analyse.",analysis_not_enough_data_hint:"Weibull-analyse vereist minstens 5 voltooide onderhoudsbeurten; seizoenspatronen worden zichtbaar na 6+ datapunten per maand.",analysis_manual_task_hint:"Handmatige taken zonder interval genereren geen analysegegevens.",completions:"voltooiingen",current:"Huidig",shorter:"Korter",longer:"Langer",normal:"Normaal",disabled:"Uitgeschakeld",compound_logic:"Samengestelde logica",card_title:"Titel",card_show_header:"Koptekst met statistieken tonen",card_show_actions:"Actieknoppen tonen",card_compact:"Compacte modus",card_max_items:"Max items (0 = alle)",card_filter_status:"Filteren op status",card_filter_status_help:"Leeg = alle statussen tonen.",card_filter_objects:"Filteren op objecten",card_filter_objects_help:"Leeg = alle objecten tonen.",card_filter_entities:"Filteren op entiteiten (entity_ids)",card_filter_entities_help:"Kies sensor/binary_sensor entiteiten van deze integratie. Leeg = alle.",card_loading_objects:"Objecten laden\u2026",card_load_error:"Objecten konden niet worden geladen \u2014 controleer de WebSocket-verbinding.",card_no_tasks_title:"Nog geen onderhoudstaken",card_no_tasks_cta:"\u2192 Maak er een aan in het Maintenance-paneel",no_objects:"Nog geen objecten.",action_error:"Actie mislukt. Probeer het opnieuw.",area_id_optional:"Gebied (optioneel)",installation_date_optional:"Installatiedatum (optioneel)",custom_icon_optional:"Icoon (optioneel, bijv. mdi:wrench)",task_enabled:"Taak ingeschakeld",skip_reason_prompt:"Deze taak overslaan?",reason_optional:"Reden (optioneel)",reset_date_prompt:"Taak markeren als uitgevoerd?",reset_date_optional:"Laatste uitvoeringsdatum (optioneel, standaard vandaag)",notes_label:"Notities",documentation_label:"Documentatie",no_nfc_tag:"\u2014 Geen tag \u2014",dashboard:"Dashboard",settings:"Instellingen",settings_features:"Geavanceerde functies",settings_features_desc:"Schakel geavanceerde functies in of uit. Uitschakelen verbergt ze in de interface maar verwijdert geen gegevens.",feat_adaptive:"Adaptieve planning",feat_adaptive_desc:"Leer optimale intervallen uit onderhoudsgeschiedenis",feat_predictions:"Sensorvoorspellingen",feat_predictions_desc:"Voorspel triggerdatums op basis van sensordegradatie",feat_seasonal:"Seizoensaanpassingen",feat_seasonal_desc:"Pas intervallen aan op seizoenspatronen",feat_environmental:"Omgevingscorrelatie",feat_environmental_desc:"Correleer intervallen met temperatuur/vochtigheid",feat_budget:"Budgetbeheer",feat_budget_desc:"Volg maandelijkse en jaarlijkse onderhoudsuitgaven",feat_groups:"Taakgroepen",feat_groups_desc:"Organiseer taken in logische groepen",feat_checklists:"Checklists",feat_checklists_desc:"Meerstaps procedures voor taakvoltooiing",settings_general:"Algemeen",settings_default_warning:"Standaard waarschuwingsdagen",settings_panel_enabled:"Zijbalkpaneel",settings_panel_title:"Titel zijbalkpaneel",settings_notifications:"Meldingen",settings_notify_service:"Meldingsservice",test_notification:"Testmelding",send_test:"Test versturen",testing:"Verzenden\u2026",test_notification_success:"Testmelding verzonden",test_notification_failed:"Testmelding mislukt",settings_notify_due_soon:"Melding bij bijna verlopen",settings_notify_overdue:"Melding bij achterstallig",settings_notify_triggered:"Melding bij geactiveerd",settings_interval_hours:"Herhalingsinterval (uren, 0 = eenmalig)",settings_quiet_hours:"Stille uren",settings_quiet_start:"Start",settings_quiet_end:"Einde",settings_max_per_day:"Max meldingen per dag (0 = onbeperkt)",settings_bundling:"Meldingen bundelen",settings_bundle_threshold:"Bundeldrempel",settings_actions:"Mobiele actieknoppen",settings_action_complete:"Knop 'Voltooid' tonen",settings_action_skip:"Knop 'Overslaan' tonen",settings_action_snooze:"Knop 'Snooze' tonen",settings_snooze_hours:"Snoozeduur (uren)",settings_budget:"Budget",settings_currency:"Valuta",settings_budget_monthly:"Maandbudget",settings_budget_yearly:"Jaarbudget",settings_budget_alerts:"Budgetwaarschuwingen",settings_budget_threshold:"Waarschuwingsdrempel (%)",settings_import_export:"Import / Export",settings_export_json:"JSON exporteren",settings_export_yaml:"YAML exporteren",settings_export_csv:"CSV exporteren",settings_import_csv:"CSV importeren",settings_import_placeholder:"Plak JSON- of CSV-inhoud hier\u2026",settings_import_btn:"Importeren",settings_import_success:"{count} objecten succesvol ge\xEFmporteerd.",settings_export_success:"Export gedownload.",settings_saved:"Instelling opgeslagen.",settings_include_history:"Geschiedenis meenemen",sort_alphabetical:"Alfabetisch",sort_due_soonest:"Eerst vervallend",sort_task_count:"Aantal taken",sort_area:"Gebied",sort_assigned_user:"Toegewezen gebruiker",sort_group:"Groep",groupby_none:"Geen groepering",groupby_area:"Per gebied",groupby_group:"Per groep",groupby_user:"Per gebruiker",filter_label:"Filter",user_label:"Gebruiker",sort_label:"Sorteren",group_by_label:"Groeperen op",state_value_help:'Gebruik de HA-statuswaarde (meestal in kleine letters, bv. "on"/"off"). Hoofdletters worden bij opslaan genormaliseerd.',target_changes_help:"Aantal overeenkomende overgangen voordat de trigger wordt geactiveerd (standaard: 1).",qr_print_title:"QR-codes afdrukken",qr_print_desc:"Genereer een afdrukpagina met QR-codes om uit te knippen en op je apparaten te plakken.",qr_print_load:"Objecten laden",qr_print_filter:"Filter",qr_print_objects:"Objecten",qr_print_actions:"Acties",qr_print_url_mode:"Linktype",qr_print_estimate:"Geschatte QR-codes",qr_print_over_limit:"max is 200, beperk de filter",qr_print_generate:"QR-codes genereren",qr_print_generating:"Genereren\u2026",qr_print_ready:"QR-codes klaar",qr_print_print_button:"Afdrukken",qr_print_empty:"Niets te genereren",qr_action_skip:"Overslaan",vacation_title:"Vakantiemodus",vacation_active:"actief",vacation_ended:"be\xEBindigd",vacation_desc:"Plan je vakantie: meldingen worden gepauzeerd tijdens de periode plus een buffer van dagen. Je kunt per taak uitzonderingen instellen.",vacation_enable:"Vakantiemodus inschakelen",vacation_start:"Begin",vacation_end:"Einde",vacation_buffer:"Buffer (dagen)",vacation_exempt_title:"Toch melden tijdens vakantie",vacation_exempt_desc:"Kies taken die ook tijdens vakantie meldingen moeten geven (bv. kritische zwembadchemie).",vacation_load_tasks:"Taken laden",vacation_preview_btn:"Voorvertoning",vacation_preview_affected:"taken betrokken",vacation_event_due_soon:"wordt binnenkort verschuldigd",vacation_event_overdue:"wordt achterstallig",vacation_event_triggered_est:"sensortrigger mogelijk",vacation_sensor_based:"(sensor-gebaseerd)",vacation_action_notify:"Toch melden",vacation_action_unsilence:"Weer dempen",vacation_marked_complete:"Als voltooid gemarkeerd",vacation_marked_skip:"Overgeslagen",vacation_end_now:"Vakantie nu be\xEBindigen",unassigned:"Niet toegewezen",no_area:"Geen gebied",has_overdue:"Heeft achterstallige taken",object:"Object",settings_panel_access:"Paneel-toegang",settings_panel_access_desc:"Admins zien altijd het volledige paneel. Kies hier niet-admin gebruikers die ook volledige toegang krijgen \u2014 andere niet-admins zien alleen Voltooien en Overslaan.",no_non_admin_users:"Geen niet-admin gebruikers gevonden. Voeg ze toe in Instellingen \u2192 Personen.",owner_label:"Eigenaar",feat_completion_actions:"Voltooiings-acties",feat_completion_actions_desc:"Per taak HA-actie bij voltooien + snel-voltooien-QR met vooraf ingestelde waarden.",on_complete_action_title:"Bij voltooien: HA-actie uitvoeren (optioneel)",on_complete_action_desc:"Roept een HA-service aan wanneer de taak is voltooid \u2014 bv. een teller op het apparaat resetten.",on_complete_action_service:"Service",on_complete_action_target:"Doel-entiteit",on_complete_action_data:"Data (JSON, optioneel)",on_complete_action_test:"Actie testen",on_complete_action_test_success:"Geslaagd",on_complete_action_test_failed:"Mislukt",quick_complete_defaults_title:"Snel-voltooien-standaardwaarden (voor QR-scans, optioneel)",quick_complete_defaults_desc:"Vooraf ingestelde waarden voor snel-voltooien-QR. Zonder deze opent de QR de voltooi-dialoog.",quick_complete_defaults_notes:"Notities",quick_complete_defaults_cost:"Kosten",quick_complete_defaults_duration:"Duur (minuten)",quick_complete_defaults_feedback_none:"Geen feedback",quick_complete_defaults_feedback_needed:"Was nodig",quick_complete_defaults_feedback_not_needed:"Niet nodig",quick_complete_success:"Snel als voltooid gemarkeerd",trigger_replaced:"Trigger vervangen",add:"Toevoegen",show_stats:"Statistieken + grafieken tonen",hide_stats:"Statistieken verbergen",adaptive_no_data:"Nog niet genoeg voltooiingsgeschiedenis voor adaptieve analyse. Voer deze taak nog een paar keer uit om intervaladviezen en betrouwbaarheidsgrafieken te ontgrendelen.",suggestion_applied:"Voorgesteld interval toegepast",vacation_mode:"Vakantiemodus",vacation_status_active:"Nu actief",vacation_status_scheduled:"Gepland",vacation_status_inactive:"Inactief",vacation_end_now_confirm:"Vakantie onmiddellijk be\xEBindigen?",vacation_exempt_count:"uitgezonderd",vacation_advanced:"Geavanceerd\u2026",vacation_open_panel:"Openen in paneel",enable:"Inschakelen",saved:"Opgeslagen",budget_monthly_set:"Maandelijks instellen",budget_yearly_set:"Jaarlijks instellen",budget_advanced:"Valuta, waarschuwingen\u2026",budget_open_panel:"Openen in paneel",groups_empty:"Nog geen groepen.",group_new_placeholder:"Groep toevoegen\u2026",group_delete_confirm:'Groep "{name}" verwijderen?',groups_manage_tasks:"Taaktoewijzingen beheren\u2026",groups_open_panel:"Openen in paneel",on_complete_action_target_hint:"Let op: het domein van de entiteit moet bij de service passen \u2014 bijv. 'button.press' werkt alleen op button.*, 'counter.increment' alleen op counter.*, 'input_button.press' alleen op input_button.* enz. Bij een mismatch mislukt de actie stil (HA logt 'Referenced entities ... missing or not currently available').",show_all_objects:"Alle objecten tonen",show_all_tasks:"Filter wissen \u2014 alle taken tonen",filter_to_overdue:"Takenlijst filteren op alleen achterstallig",filter_to_due_soon:"Takenlijst filteren op alleen binnenkort verschuldigd",filter_to_triggered:"Takenlijst filteren op alleen geactiveerd",open_task:"Taak openen",show_details:"Geschiedenis + statistieken tonen",hide_details:"Details verbergen",history_empty:"Nog geen geschiedenis.",history_edit_button:"Item bewerken",total_cost:"Totale kosten",times_performed:"Uitgevoerd",older_entries:"ouder",open_in_panel:"Openen in Onderhoudspaneel",skip_reason:"Reden voor overslaan (optioneel)",reset_to_date:"Laatst uitgevoerd terugzetten op",delete_task_confirm:"Deze taak en de geschiedenis verwijderen?",delete_object_confirm:"Dit object en alle taken verwijderen?",loading:"Laden\u2026"},za={maintenance:"Maintenance",objects:"Objets",tasks:"T\xE2ches",overdue:"En retard",due_soon:"Bient\xF4t d\xFB",triggered:"D\xE9clench\xE9",ok:"OK",all:"Tous",new_object:"+ Nouvel objet",edit:"Modifier",delete:"Supprimer",add_task:"+ T\xE2che",complete:"Termin\xE9",completed:"Termin\xE9",skip:"Passer",skipped:"Ignor\xE9",reset:"R\xE9initialiser",cancel:"Annuler",completing:"En cours\u2026",interval:"Intervalle",warning:"Avertissement",last_performed:"Derni\xE8re ex\xE9cution",next_due:"Prochaine \xE9ch\xE9ance",days_until_due:"Jours restants",avg_duration:"\xD8 Dur\xE9e",trigger:"D\xE9clencheur",trigger_type:"Type de d\xE9clencheur",threshold_above:"Limite sup\xE9rieure",threshold_below:"Limite inf\xE9rieure",threshold:"Seuil",counter:"Compteur",state_change:"Changement d'\xE9tat",runtime:"Dur\xE9e de fonctionnement",runtime_hours:"Dur\xE9e cible (heures)",target_value:"Valeur cible",baseline:"Ligne de base",target_changes:"Changements cibles",for_minutes:"Pendant (minutes)",time_based:"Temporel",sensor_based:"Capteur",manual:"Manuel",one_time:"Unique",weekdays:"Jours de semaine",nth_weekday:"N-i\xE8me jour de la semaine du mois",day_of_month:"Jour du mois",recurrence_on_days:"R\xE9p\xE9ter le",recurrence_occurrence:"Occurrence",recurrence_weekday:"Jour de semaine",recurrence_day:"Jour du mois (1\u201331)",ord_1:"1er",ord_2:"2e",ord_3:"3e",ord_4:"4e",ord_5:"5e",ord_last:"Dernier",day_word:"Jour",interval_value:"Intervalle",interval_unit:"Unit\xE9",unit_days:"Jours",unit_weeks:"Semaines",unit_months:"Mois",unit_years:"Ann\xE9es",due_date:"Date d'\xE9ch\xE9ance",cleaning:"Nettoyage",inspection:"Inspection",replacement:"Remplacement",calibration:"\xC9talonnage",service:"Service",custom:"Personnalis\xE9",history:"Historique",cost:"Co\xFBt",duration:"Dur\xE9e",both:"Les deux",trigger_val:"Valeur du d\xE9clencheur",complete_title:"Termin\xE9 : ",checklist:"Checklist",checklist_steps_optional:"\xC9tapes de la checklist (optionnel)",checklist_placeholder:`Nettoyer le filtre
Remplacer le joint
Tester la pression`,checklist_help:"Une \xE9tape par ligne. Max 100 \xE9l\xE9ments.",err_too_long:"{field} : trop long (max {n} caract\xE8res)",err_too_short:"{field} : trop court (min {n} caract\xE8res)",err_value_too_high:"{field} : trop grand (max {n})",err_value_too_low:"{field} : trop petit (min {n})",err_required:"{field} : champ obligatoire",err_wrong_type:"{field} : mauvais type (attendu : {type})",err_invalid_choice:"{field} : valeur non autoris\xE9e",err_invalid_value:"{field} : valeur invalide",feat_schedule_time:"Planification \xE0 l'heure",feat_schedule_time_desc:"Les t\xE2ches arrivent \xE0 \xE9ch\xE9ance \xE0 une heure pr\xE9cise plut\xF4t qu'\xE0 minuit.",schedule_time_optional:"\xC9ch\xE9ance \xE0 l'heure (optionnel, HH:MM)",schedule_time_help:"Vide = minuit (d\xE9faut). Fuseau horaire HA.",at_time:"\xE0",notes_optional:"Notes (optionnel)",cost_optional:"Co\xFBt (optionnel)",duration_minutes:"Dur\xE9e en minutes (optionnel)",days:"jours",day:"jour",today:"Aujourd'hui",d_overdue:"j en retard",no_tasks:"Aucune t\xE2che de maintenance. Cr\xE9ez un objet pour commencer.",no_tasks_short:"Aucune t\xE2che",no_history:"Aucun historique.",show_all:"Tout afficher",cost_duration_chart:"Co\xFBts & Dur\xE9e",installed:"Install\xE9",confirm_delete_object:"Supprimer cet objet et toutes ses t\xE2ches ?",confirm_delete_task:"Supprimer cette t\xE2che ?",min:"Min",max:"Max",save:"Enregistrer",saving:"Enregistrement\u2026",edit_task:"Modifier la t\xE2che",new_task:"Nouvelle t\xE2che de maintenance",task_name:"Nom de la t\xE2che",maintenance_type:"Type de maintenance",schedule_type:"Type de planification",interval_days:"Intervalle (jours)",warning_days:"Jours d'avertissement",last_performed_optional:"Derni\xE8re ex\xE9cution (optionnel)",interval_anchor:"Ancrage de l'intervalle",anchor_completion:"Depuis la date de r\xE9alisation",anchor_planned:"Depuis la date pr\xE9vue (sans d\xE9rive)",edit_object:"Modifier l'objet",name:"Nom",manufacturer_optional:"Fabricant (optionnel)",model_optional:"Mod\xE8le (optionnel)",serial_number_optional:"Num\xE9ro de s\xE9rie (optionnel)",serial_number_label:"N/S",documentation_url_label:"Manuel",object_notes_label:"Notes",sort_due_date:"\xC9ch\xE9ance",sort_object:"Nom de l'objet",sort_type:"Type",sort_task_name:"Nom de la t\xE2che",all_objects:"Tous les objets",tasks_lower:"t\xE2ches",no_tasks_yet:"Pas encore de t\xE2ches",add_first_task:"Ajouter la premi\xE8re t\xE2che",trigger_configuration:"Configuration du d\xE9clencheur",entity_id:"ID d'entit\xE9",comma_separated:"s\xE9par\xE9 par des virgules",entity_logic:"Logique d'entit\xE9",entity_logic_any:"N'importe quelle entit\xE9 d\xE9clenche",entity_logic_all:"Toutes les entit\xE9s doivent d\xE9clencher",entities:"entit\xE9s",attribute_optional:"Attribut (optionnel, vide = \xE9tat)",use_entity_state:"Utiliser l'\xE9tat de l'entit\xE9 (pas d'attribut)",trigger_above:"D\xE9clencher au-dessus de",trigger_below:"D\xE9clencher en dessous de",for_at_least_minutes:"Pendant au moins (minutes)",safety_interval_days:"Intervalle de s\xE9curit\xE9 (jours, optionnel)",safety_interval:"Intervalle de s\xE9curit\xE9 (optionnel)",delta_mode:"Mode delta",from_state_optional:"\xC9tat source (optionnel)",to_state_optional:"\xC9tat cible (optionnel)",documentation_url_optional:"URL de documentation (optionnel)",object_notes_optional:"Notes (facultatif)",nfc_tag_id_optional:"ID tag NFC (optionnel)",nfc_tags_empty_help:"Aucun tag NFC enregistr\xE9 dans Home Assistant pour le moment.",nfc_tags_open_settings:"Ouvrir les r\xE9glages des tags",nfc_tags_refresh:"Actualiser",environmental_entity_optional:"Capteur d'environnement (optionnel)",environmental_entity_helper:"ex. sensor.temperature_exterieure \u2014 ajuste l'intervalle selon les conditions environnementales",environmental_attribute_optional:"Attribut d'environnement (optionnel)",nfc_tag_id:"ID tag NFC",nfc_linked:"Tag NFC li\xE9",nfc_link_hint:"Cliquer pour associer un tag NFC",responsible_user:"Utilisateur responsable",no_user_assigned:"(Aucun utilisateur assign\xE9)",all_users:"Tous les utilisateurs",my_tasks:"Mes t\xE2ches",tab_calendar:"Calendrier",cal_no_events:"Aucun entretien",cal_window_7:"7 jours",cal_window_14:"14 jours",cal_window_30:"30 jours",cal_window_365:"1 an",cal_every_n_days:"tous les {n} jours",cal_source_time:"Bas\xE9 sur le temps",cal_source_time_adaptive:"Bas\xE9 sur le temps (adaptatif)",cal_source_sensor:"Bas\xE9 sur capteur",cal_predicted:"pr\xE9dit",cal_confidence_high:"haute confiance",cal_confidence_medium:"confiance moyenne",cal_confidence_low:"faible confiance",budget_monthly:"Budget mensuel",budget_yearly:"Budget annuel",groups:"Groupes",new_group:"Nouveau groupe",edit_group:"Modifier le groupe",no_groups:"Aucun groupe pour l'instant",delete_group:"Supprimer le groupe",delete_group_confirm:"Supprimer le groupe '{name}' ?",group_select_tasks:"S\xE9lectionner les t\xE2ches",group_name_required:"Nom requis",description_optional:"Description (optionnel)",selected:"S\xE9lectionn\xE9",loading_chart:"Chargement des donn\xE9es...",was_maintenance_needed:"Cette maintenance \xE9tait-elle n\xE9cessaire ?",feedback_needed:"N\xE9cessaire",feedback_not_needed:"Pas n\xE9cessaire",feedback_not_sure:"Pas s\xFBr",suggested_interval:"Intervalle sugg\xE9r\xE9",apply_suggestion:"Appliquer",reanalyze:"R\xE9analyser",reanalyze_result:"Nouvelle analyse",reanalyze_insufficient_data:"Donn\xE9es insuffisantes pour une recommandation",data_points:"points de donn\xE9es",dismiss_suggestion:"Ignorer",confidence_low:"Faible",confidence_medium:"Moyen",confidence_high:"\xC9lev\xE9",recommended:"recommand\xE9",seasonal_awareness:"Conscience saisonni\xE8re",edit_seasonal_overrides:"Modifier les facteurs saisonniers",seasonal_overrides_title:"Facteurs saisonniers (override)",seasonal_overrides_hint:"Facteur par mois (0.1\u20135.0). Vide = appris automatiquement.",seasonal_override_invalid:"Valeur invalide",seasonal_override_range:"Le facteur doit \xEAtre entre 0.1 et 5.0",clear_all:"Tout effacer",seasonal_chart_title:"Facteurs saisonniers",seasonal_learned:"Appris",seasonal_manual:"Manuel",month_jan:"Jan",month_feb:"F\xE9v",month_mar:"Mar",month_apr:"Avr",month_may:"Mai",month_jun:"Juin",month_jul:"Juil",month_aug:"Ao\xFBt",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"D\xE9c",sensor_prediction:"Pr\xE9diction capteur",degradation_trend:"Tendance",trend_rising:"En hausse",trend_falling:"En baisse",trend_stable:"Stable",trend_insufficient_data:"Donn\xE9es insuffisantes",days_until_threshold:"Jours avant le seuil",threshold_exceeded:"Seuil d\xE9pass\xE9",environmental_adjustment:"Facteur environnemental",sensor_prediction_urgency:"Le capteur pr\xE9voit le seuil dans ~{days} jours",day_short:"jour",weibull_reliability_curve:"Courbe de fiabilit\xE9",weibull_failure_probability:"Probabilit\xE9 de d\xE9faillance",weibull_r_squared:"Ajustement R\xB2",beta_early_failures:"D\xE9faillances pr\xE9coces",beta_random_failures:"D\xE9faillances al\xE9atoires",beta_wear_out:"Usure",beta_highly_predictable:"Tr\xE8s pr\xE9visible",confidence_interval:"Intervalle de confiance",confidence_conservative:"Conservateur",confidence_aggressive:"Optimiste",current_interval_marker:"Intervalle actuel",recommended_marker:"Recommand\xE9",characteristic_life:"Dur\xE9e de vie caract\xE9ristique",chart_mini_sparkline:"Sparkline de tendance",chart_history:"Historique co\xFBts et dur\xE9e",chart_seasonal:"Facteurs saisonniers, 12 mois",chart_weibull:"Courbe de fiabilit\xE9 Weibull",chart_sparkline:"Graphique valeur d\xE9clencheur",days_progress:"Progression en jours",qr_code:"QR Code",qr_generating:"G\xE9n\xE9ration du QR code\u2026",qr_error:"Impossible de g\xE9n\xE9rer le QR code.",qr_error_no_url:"Aucune URL HA configur\xE9e. Veuillez d\xE9finir une URL externe ou interne dans Param\xE8tres \u2192 Syst\xE8me \u2192 R\xE9seau.",save_error:"\xC9chec de l'enregistrement. Veuillez r\xE9essayer.",qr_print:"Imprimer",qr_download:"T\xE9l\xE9charger SVG",qr_action:"Action au scan",qr_action_view:"Afficher les infos de maintenance",qr_action_complete:"Marquer la maintenance comme termin\xE9e",qr_url_mode:"Type de lien",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"URL serveur",overview:"Aper\xE7u",analysis:"Analyse",recent_activities:"Activit\xE9s r\xE9centes",search_notes:"Rechercher dans les notes",avg_cost:"\xD8 Co\xFBt",no_advanced_features:"Aucune fonction avanc\xE9e activ\xE9e",no_advanced_features_hint:"Activez \xAB Intervalles adaptatifs \xBB ou \xAB Tendances saisonni\xE8res \xBB dans les param\xE8tres de l'int\xE9gration pour voir les donn\xE9es d'analyse ici.",analysis_not_enough_data:"Pas encore assez de donn\xE9es pour l'analyse.",analysis_not_enough_data_hint:"L'analyse Weibull n\xE9cessite au moins 5 maintenances termin\xE9es ; les tendances saisonni\xE8res apparaissent apr\xE8s 6+ points par mois.",analysis_manual_task_hint:"Les t\xE2ches manuelles sans intervalle ne g\xE9n\xE8rent pas de donn\xE9es d'analyse.",completions:"r\xE9alisations",current:"Actuel",shorter:"Plus court",longer:"Plus long",normal:"Normal",disabled:"D\xE9sactiv\xE9",compound_logic:"Logique compos\xE9e",card_title:"Titre",card_show_header:"Afficher l'en-t\xEAte avec statistiques",card_show_actions:"Afficher les boutons d'action",card_compact:"Mode compact",card_max_items:"Nombre max (0 = tous)",card_filter_status:"Filtrer par statut",card_filter_status_help:"Vide = afficher tous les statuts.",card_filter_objects:"Filtrer par objets",card_filter_objects_help:"Vide = afficher tous les objets.",card_filter_entities:"Filtrer par entit\xE9s (entity_ids)",card_filter_entities_help:"Choisissez des entit\xE9s sensor / binary_sensor de cette int\xE9gration. Vide = toutes.",card_loading_objects:"Chargement des objets\u2026",card_load_error:"Impossible de charger les objets \u2014 v\xE9rifiez la connexion WebSocket.",card_no_tasks_title:"Aucune t\xE2che de maintenance pour l'instant",card_no_tasks_cta:"\u2192 Cr\xE9ez-en une dans le panneau Maintenance",no_objects:"Aucun objet pour l'instant.",action_error:"Action \xE9chou\xE9e. Veuillez r\xE9essayer.",area_id_optional:"Zone (optionnel)",installation_date_optional:"Date d'installation (optionnel)",custom_icon_optional:"Ic\xF4ne (optionnel, ex. mdi:wrench)",task_enabled:"T\xE2che activ\xE9e",skip_reason_prompt:"Ignorer cette t\xE2che ?",reason_optional:"Raison (optionnel)",reset_date_prompt:"Marquer la t\xE2che comme effectu\xE9e ?",reset_date_optional:"Date de derni\xE8re ex\xE9cution (optionnel, d\xE9faut : aujourd'hui)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 Aucun tag \u2014",dashboard:"Tableau de bord",settings:"Param\xE8tres",settings_features:"Fonctions avanc\xE9es",settings_features_desc:"Activez ou d\xE9sactivez les fonctions avanc\xE9es. La d\xE9sactivation les masque dans l'interface mais ne supprime pas les donn\xE9es.",feat_adaptive:"Planification adaptative",feat_adaptive_desc:"Apprendre les intervalles optimaux \xE0 partir de l'historique",feat_predictions:"Pr\xE9dictions capteurs",feat_predictions_desc:"Pr\xE9dire les dates de d\xE9clenchement par d\xE9gradation des capteurs",feat_seasonal:"Ajustements saisonniers",feat_seasonal_desc:"Ajuster les intervalles selon les tendances saisonni\xE8res",feat_environmental:"Corr\xE9lation environnementale",feat_environmental_desc:"Corr\xE9ler les intervalles avec la temp\xE9rature/humidit\xE9",feat_budget:"Suivi budg\xE9taire",feat_budget_desc:"Suivre les d\xE9penses de maintenance mensuelles et annuelles",feat_groups:"Groupes de t\xE2ches",feat_groups_desc:"Organiser les t\xE2ches en groupes logiques",feat_checklists:"Checklists",feat_checklists_desc:"Proc\xE9dures multi-\xE9tapes pour la r\xE9alisation des t\xE2ches",settings_general:"G\xE9n\xE9ral",settings_default_warning:"Jours d'avertissement par d\xE9faut",settings_panel_enabled:"Panneau lat\xE9ral",settings_panel_title:"Titre du panneau lat\xE9ral",settings_notifications:"Notifications",settings_notify_service:"Service de notification",test_notification:"Notification de test",send_test:"Envoyer le test",testing:"Envoi en cours\u2026",test_notification_success:"Notification de test envoy\xE9e",test_notification_failed:"\xC9chec de la notification de test",settings_notify_due_soon:"Notifier quand bient\xF4t d\xFB",settings_notify_overdue:"Notifier quand en retard",settings_notify_triggered:"Notifier quand d\xE9clench\xE9",settings_interval_hours:"Intervalle de r\xE9p\xE9tition (heures, 0 = une fois)",settings_quiet_hours:"Heures de silence",settings_quiet_start:"D\xE9but",settings_quiet_end:"Fin",settings_max_per_day:"Max notifications par jour (0 = illimit\xE9)",settings_bundling:"Regrouper les notifications",settings_bundle_threshold:"Seuil de regroupement",settings_actions:"Boutons d'action mobiles",settings_action_complete:"Afficher le bouton 'Termin\xE9'",settings_action_skip:"Afficher le bouton 'Passer'",settings_action_snooze:"Afficher le bouton 'Reporter'",settings_snooze_hours:"Dur\xE9e de report (heures)",settings_budget:"Budget",settings_currency:"Devise",settings_budget_monthly:"Budget mensuel",settings_budget_yearly:"Budget annuel",settings_budget_alerts:"Alertes budg\xE9taires",settings_budget_threshold:"Seuil d'alerte (%)",settings_import_export:"Import / Export",settings_export_json:"Exporter JSON",settings_export_yaml:"Exporter YAML",settings_export_csv:"Exporter CSV",settings_import_csv:"Importer CSV",settings_import_placeholder:"Collez le contenu JSON ou CSV ici\u2026",settings_import_btn:"Importer",settings_import_success:"{count} objets import\xE9s avec succ\xE8s.",settings_export_success:"Export t\xE9l\xE9charg\xE9.",settings_saved:"Param\xE8tre enregistr\xE9.",settings_include_history:"Inclure l'historique",sort_alphabetical:"Alphab\xE9tique",sort_due_soonest:"\xC9ch\xE9ance la plus proche",sort_task_count:"Nombre de t\xE2ches",sort_area:"Zone",sort_assigned_user:"Utilisateur affect\xE9",sort_group:"Groupe",groupby_none:"Aucun groupement",groupby_area:"Par zone",groupby_group:"Par groupe",groupby_user:"Par utilisateur",filter_label:"Filtre",user_label:"Utilisateur",sort_label:"Tri",group_by_label:"Grouper par",state_value_help:`Utilisez la valeur d'\xE9tat HA (g\xE9n\xE9ralement en minuscules, p.\u202Fex. "on"/"off"). La casse est normalis\xE9e \xE0 l'enregistrement.`,target_changes_help:"Nombre de transitions correspondantes avant le d\xE9clenchement (par d\xE9faut\u202F: 1).",qr_print_title:"Imprimer les QR codes",qr_print_desc:"G\xE9n\xE9rer une page imprimable de QR codes \xE0 d\xE9couper et coller sur votre \xE9quipement.",qr_print_load:"Charger les objets",qr_print_filter:"Filtre",qr_print_objects:"Objets",qr_print_actions:"Actions",qr_print_url_mode:"Type de lien",qr_print_estimate:"QR codes estim\xE9s",qr_print_over_limit:"limite \xE0 200, affinez le filtre",qr_print_generate:"G\xE9n\xE9rer les QR codes",qr_print_generating:"G\xE9n\xE9ration\u2026",qr_print_ready:"QR codes pr\xEAts",qr_print_print_button:"Imprimer",qr_print_empty:"Rien \xE0 g\xE9n\xE9rer",qr_action_skip:"Passer",vacation_title:"Mode vacances",vacation_active:"actif",vacation_ended:"termin\xE9",vacation_desc:"Planifiez vos vacances : les notifications sont mises en pause pendant la p\xE9riode plus quelques jours tampon. Vous pouvez r\xE9activer certaines t\xE2ches.",vacation_enable:"Activer le mode vacances",vacation_start:"D\xE9but",vacation_end:"Fin",vacation_buffer:"Tampon (jours)",vacation_exempt_title:"Notifier malgr\xE9 les vacances",vacation_exempt_desc:"Choisissez les t\xE2ches qui doivent quand m\xEAme notifier pendant les vacances (p. ex. chimie de piscine critique).",vacation_load_tasks:"Charger les t\xE2ches",vacation_preview_btn:"Afficher l'aper\xE7u",vacation_preview_affected:"t\xE2ches concern\xE9es",vacation_event_due_soon:"bient\xF4t d\xFB",vacation_event_overdue:"deviendra en retard",vacation_event_triggered_est:"d\xE9clencheur capteur possible",vacation_sensor_based:"(bas\xE9 sur capteur)",vacation_action_notify:"Notifier quand m\xEAme",vacation_action_unsilence:"Mettre en silence",vacation_marked_complete:"Marqu\xE9 comme termin\xE9",vacation_marked_skip:"Pass\xE9",vacation_end_now:"Terminer les vacances maintenant",unassigned:"Non assign\xE9",no_area:"Aucune zone",has_overdue:"T\xE2ches en retard",object:"Objet",settings_panel_access:"Acc\xE8s au panneau",settings_panel_access_desc:"Les administrateurs voient toujours le panneau complet. S\xE9lectionnez ici les utilisateurs non administrateurs qui devraient aussi avoir l'acc\xE8s complet \u2014 les autres ne voient que Terminer et Ignorer.",no_non_admin_users:"Aucun utilisateur non administrateur trouv\xE9. Ajoutez-en dans Param\xE8tres \u2192 Personnes.",owner_label:"Propri\xE9taire",feat_completion_actions:"Actions de finalisation",feat_completion_actions_desc:"Action HA par t\xE2che lors de la finalisation + QR de finalisation rapide avec valeurs pr\xE9-d\xE9finies.",on_complete_action_title:"\xC0 la finalisation : d\xE9clencher une action HA (optionnel)",on_complete_action_desc:"Appelle un service HA quand la t\xE2che est termin\xE9e \u2014 p. ex. r\xE9initialiser un compteur sur l'appareil.",on_complete_action_service:"Service",on_complete_action_target:"Entit\xE9 cible",on_complete_action_data:"Donn\xE9es (JSON, optionnel)",on_complete_action_test:"Tester l'action",on_complete_action_test_success:"R\xE9ussi",on_complete_action_test_failed:"\xC9chou\xE9",quick_complete_defaults_title:"Valeurs par d\xE9faut pour finalisation rapide (scans QR, optionnel)",quick_complete_defaults_desc:"Valeurs pr\xE9-d\xE9finies pour les scans QR de finalisation rapide. Sans ces valeurs, le QR ouvre la bo\xEEte de dialogue.",quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Co\xFBt",quick_complete_defaults_duration:"Dur\xE9e (minutes)",quick_complete_defaults_feedback_none:"Aucun feedback",quick_complete_defaults_feedback_needed:"\xC9tait n\xE9cessaire",quick_complete_defaults_feedback_not_needed:"Non n\xE9cessaire",quick_complete_success:"Termin\xE9 rapidement",trigger_replaced:"D\xE9clencheur remplac\xE9",add:"Ajouter",show_stats:"Afficher les statistiques + graphiques",hide_stats:"Masquer les statistiques",adaptive_no_data:"Pas encore assez d'historique de r\xE9alisations pour l'analyse adaptative. R\xE9alisez cette t\xE2che encore quelques fois pour d\xE9bloquer les recommandations d'intervalle et les courbes de fiabilit\xE9.",suggestion_applied:"Intervalle sugg\xE9r\xE9 appliqu\xE9",vacation_mode:"Mode vacances",vacation_status_active:"Actif maintenant",vacation_status_scheduled:"Planifi\xE9",vacation_status_inactive:"Inactif",vacation_end_now_confirm:"Terminer les vacances imm\xE9diatement ?",vacation_exempt_count:"exempt\xE9es",vacation_advanced:"Avanc\xE9\u2026",vacation_open_panel:"Ouvrir dans le panneau",enable:"Activer",saved:"Enregistr\xE9",budget_monthly_set:"D\xE9finir mensuel",budget_yearly_set:"D\xE9finir annuel",budget_advanced:"Devise, alertes\u2026",budget_open_panel:"Ouvrir dans le panneau",groups_empty:"Aucun groupe pour le moment.",group_new_placeholder:"Ajouter un groupe\u2026",group_delete_confirm:"Supprimer le groupe \xAB {name} \xBB ?",groups_manage_tasks:"G\xE9rer les affectations de t\xE2ches\u2026",groups_open_panel:"Ouvrir dans le panneau",on_complete_action_target_hint:"Note : le domaine de l'entit\xE9 doit correspondre au service \u2014 p. ex. 'button.press' ne fonctionne que sur button.*, 'counter.increment' seulement sur counter.*, 'input_button.press' seulement sur input_button.* etc. En cas de non-correspondance, l'action \xE9choue silencieusement (HA journalise 'Referenced entities ... missing or not currently available').",show_all_objects:"Afficher tous les objets",show_all_tasks:"Effacer le filtre \u2014 afficher toutes les t\xE2ches",filter_to_overdue:"Filtrer la liste sur les t\xE2ches en retard uniquement",filter_to_due_soon:"Filtrer la liste sur les t\xE2ches bient\xF4t dues uniquement",filter_to_triggered:"Filtrer la liste sur les t\xE2ches d\xE9clench\xE9es uniquement",open_task:"Ouvrir la t\xE2che",show_details:"Afficher l'historique + statistiques",hide_details:"Masquer les d\xE9tails",history_empty:"Aucun historique pour le moment.",history_edit_button:"Modifier l'entr\xE9e",total_cost:"Co\xFBt total",times_performed:"R\xE9alis\xE9e",older_entries:"plus anciennes",open_in_panel:"Ouvrir dans le panneau Maintenance",skip_reason:"Raison du saut (facultatif)",reset_to_date:"R\xE9initialiser la derni\xE8re r\xE9alisation au",delete_task_confirm:"Supprimer cette t\xE2che et son historique ?",delete_object_confirm:"Supprimer cet objet et toutes ses t\xE2ches ?",loading:"Chargement\u2026"},Aa={maintenance:"Manutenzione",objects:"Oggetti",tasks:"Attivit\xE0",overdue:"Scaduto",due_soon:"In scadenza",triggered:"Attivato",ok:"OK",all:"Tutti",new_object:"+ Nuovo oggetto",edit:"Modifica",delete:"Elimina",add_task:"+ Attivit\xE0",complete:"Completato",completed:"Completato",skip:"Salta",skipped:"Saltato",reset:"Reimposta",cancel:"Annulla",completing:"Completamento\u2026",interval:"Intervallo",warning:"Avviso",last_performed:"Ultima esecuzione",next_due:"Prossima scadenza",days_until_due:"Giorni alla scadenza",avg_duration:"\xD8 Durata",trigger:"Trigger",trigger_type:"Tipo di trigger",threshold_above:"Limite superiore",threshold_below:"Limite inferiore",threshold:"Soglia",counter:"Contatore",state_change:"Cambio di stato",runtime:"Tempo di funzionamento",runtime_hours:"Durata obiettivo (ore)",target_value:"Valore obiettivo",baseline:"Linea di base",target_changes:"Modifiche obiettivo",for_minutes:"Per (minuti)",time_based:"Temporale",sensor_based:"Sensore",manual:"Manuale",one_time:"Una tantum",weekdays:"Giorni della settimana",nth_weekday:"N-esimo giorno della settimana del mese",day_of_month:"Giorno del mese",recurrence_on_days:"Ripeti il",recurrence_occurrence:"Occorrenza",recurrence_weekday:"Giorno della settimana",recurrence_day:"Giorno del mese (1\u201331)",ord_1:"1\xBA",ord_2:"2\xBA",ord_3:"3\xBA",ord_4:"4\xBA",ord_5:"5\xBA",ord_last:"Ultimo",day_word:"Giorno",interval_value:"Intervallo",interval_unit:"Unit\xE0",unit_days:"Giorni",unit_weeks:"Settimane",unit_months:"Mesi",unit_years:"Anni",due_date:"Data di scadenza",cleaning:"Pulizia",inspection:"Ispezione",replacement:"Sostituzione",calibration:"Calibrazione",service:"Servizio",custom:"Personalizzato",history:"Cronologia",cost:"Costo",duration:"Durata",both:"Entrambi",trigger_val:"Valore trigger",complete_title:"Completato: ",checklist:"Checklist",checklist_steps_optional:"Passaggi della checklist (opzionale)",checklist_placeholder:`Pulire il filtro
Sostituire la guarnizione
Testare la pressione`,checklist_help:"Un passaggio per riga. Max 100 elementi.",err_too_long:"{field}: troppo lungo (max {n} caratteri)",err_too_short:"{field}: troppo corto (min {n} caratteri)",err_value_too_high:"{field}: troppo grande (max {n})",err_value_too_low:"{field}: troppo piccolo (min {n})",err_required:"{field}: campo obbligatorio",err_wrong_type:"{field}: tipo errato (atteso: {type})",err_invalid_choice:"{field}: valore non consentito",err_invalid_value:"{field}: valore non valido",feat_schedule_time:"Pianificazione oraria",feat_schedule_time_desc:"Le attivit\xE0 scadono a un'ora specifica anzich\xE9 a mezzanotte.",schedule_time_optional:"Scadenza all'ora (opzionale, HH:MM)",schedule_time_help:"Vuoto = mezzanotte (default). Fuso orario HA.",at_time:"alle",notes_optional:"Note (opzionale)",cost_optional:"Costo (opzionale)",duration_minutes:"Durata in minuti (opzionale)",days:"giorni",day:"giorno",today:"Oggi",d_overdue:"g in ritardo",no_tasks:"Nessuna attivit\xE0 di manutenzione. Crea un oggetto per iniziare.",no_tasks_short:"Nessuna attivit\xE0",no_history:"Nessuna voce nella cronologia.",show_all:"Mostra tutto",cost_duration_chart:"Costi & Durata",installed:"Installato",confirm_delete_object:"Eliminare questo oggetto e tutte le sue attivit\xE0?",confirm_delete_task:"Eliminare questa attivit\xE0?",min:"Min",max:"Max",save:"Salva",saving:"Salvataggio\u2026",edit_task:"Modifica attivit\xE0",new_task:"Nuova attivit\xE0 di manutenzione",task_name:"Nome attivit\xE0",maintenance_type:"Tipo di manutenzione",schedule_type:"Tipo di pianificazione",interval_days:"Intervallo (giorni)",warning_days:"Giorni di avviso",last_performed_optional:"Ultima esecuzione (opzionale)",interval_anchor:"Ancoraggio intervallo",anchor_completion:"Dalla data di completamento",anchor_planned:"Dalla data pianificata (nessuna deriva)",edit_object:"Modifica oggetto",name:"Nome",manufacturer_optional:"Produttore (opzionale)",model_optional:"Modello (opzionale)",serial_number_optional:"Numero di serie (opzionale)",serial_number_label:"N/S",documentation_url_label:"Manuale",object_notes_label:"Note",sort_due_date:"Scadenza",sort_object:"Nome oggetto",sort_type:"Tipo",sort_task_name:"Nome attivit\xE0",all_objects:"Tutti gli oggetti",tasks_lower:"attivit\xE0",no_tasks_yet:"Nessuna attivit\xE0",add_first_task:"Aggiungi prima attivit\xE0",trigger_configuration:"Configurazione trigger",entity_id:"ID entit\xE0",comma_separated:"separati da virgola",entity_logic:"Logica entit\xE0",entity_logic_any:"Qualsiasi entit\xE0 attiva",entity_logic_all:"Tutte le entit\xE0 devono attivare",entities:"entit\xE0",attribute_optional:"Attributo (opzionale, vuoto = stato)",use_entity_state:"Usa stato dell'entit\xE0 (nessun attributo)",trigger_above:"Attivare sopra",trigger_below:"Attivare sotto",for_at_least_minutes:"Per almeno (minuti)",safety_interval_days:"Intervallo di sicurezza (giorni, opzionale)",safety_interval:"Intervallo di sicurezza (opzionale)",delta_mode:"Modalit\xE0 delta",from_state_optional:"Dallo stato (opzionale)",to_state_optional:"Allo stato (opzionale)",documentation_url_optional:"URL documentazione (opzionale)",object_notes_optional:"Note (opzionale)",nfc_tag_id_optional:"ID tag NFC (opzionale)",nfc_tags_empty_help:"Nessun tag NFC ancora registrato in Home Assistant.",nfc_tags_open_settings:"Apri impostazioni tag",nfc_tags_refresh:"Aggiorna",environmental_entity_optional:"Sensore ambientale (opzionale)",environmental_entity_helper:"es. sensor.temperatura_esterna \u2014 regola l'intervallo in base alle condizioni ambientali",environmental_attribute_optional:"Attributo ambientale (opzionale)",nfc_tag_id:"ID tag NFC",nfc_linked:"Tag NFC collegato",nfc_link_hint:"Clicca per collegare un tag NFC",responsible_user:"Utente responsabile",no_user_assigned:"(Nessun utente assegnato)",all_users:"Tutti gli utenti",my_tasks:"Le mie attivit\xE0",tab_calendar:"Calendario",cal_no_events:"Nessuna manutenzione",cal_window_7:"7 giorni",cal_window_14:"14 giorni",cal_window_30:"30 giorni",cal_window_365:"1 anno",cal_every_n_days:"ogni {n} giorni",cal_source_time:"Basato sul tempo",cal_source_time_adaptive:"Basato sul tempo (adattivo)",cal_source_sensor:"Basato su sensore",cal_predicted:"previsto",cal_confidence_high:"alta confidenza",cal_confidence_medium:"media confidenza",cal_confidence_low:"bassa confidenza",budget_monthly:"Budget mensile",budget_yearly:"Budget annuale",groups:"Gruppi",new_group:"Nuovo gruppo",edit_group:"Modifica gruppo",no_groups:"Nessun gruppo",delete_group:"Elimina gruppo",delete_group_confirm:"Eliminare il gruppo '{name}'?",group_select_tasks:"Seleziona attivit\xE0",group_name_required:"Nome richiesto",description_optional:"Descrizione (opzionale)",selected:"Selezionato",loading_chart:"Caricamento dati...",was_maintenance_needed:"Questa manutenzione era necessaria?",feedback_needed:"Necessaria",feedback_not_needed:"Non necessaria",feedback_not_sure:"Non sicuro",suggested_interval:"Intervallo suggerito",apply_suggestion:"Applica",reanalyze:"Rianalizza",reanalyze_result:"Nuova analisi",reanalyze_insufficient_data:"Dati insufficienti per una raccomandazione",data_points:"punti dati",dismiss_suggestion:"Ignora",confidence_low:"Bassa",confidence_medium:"Media",confidence_high:"Alta",recommended:"consigliato",seasonal_awareness:"Consapevolezza stagionale",edit_seasonal_overrides:"Modifica fattori stagionali",seasonal_overrides_title:"Fattori stagionali (override)",seasonal_overrides_hint:"Fattore per mese (0.1\u20135.0). Vuoto = appreso automaticamente.",seasonal_override_invalid:"Valore non valido",seasonal_override_range:"Il fattore deve essere tra 0.1 e 5.0",clear_all:"Cancella tutto",seasonal_chart_title:"Fattori stagionali",seasonal_learned:"Appreso",seasonal_manual:"Manuale",month_jan:"Gen",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"Mag",month_jun:"Giu",month_jul:"Lug",month_aug:"Ago",month_sep:"Set",month_oct:"Ott",month_nov:"Nov",month_dec:"Dic",sensor_prediction:"Previsione sensore",degradation_trend:"Tendenza",trend_rising:"In aumento",trend_falling:"In calo",trend_stable:"Stabile",trend_insufficient_data:"Dati insufficienti",days_until_threshold:"Giorni alla soglia",threshold_exceeded:"Soglia superata",environmental_adjustment:"Fattore ambientale",sensor_prediction_urgency:"Il sensore prevede la soglia tra ~{days} giorni",day_short:"giorno",weibull_reliability_curve:"Curva di affidabilit\xE0",weibull_failure_probability:"Probabilit\xE0 di guasto",weibull_r_squared:"Adattamento R\xB2",beta_early_failures:"Guasti precoci",beta_random_failures:"Guasti casuali",beta_wear_out:"Usura",beta_highly_predictable:"Altamente prevedibile",confidence_interval:"Intervallo di confidenza",confidence_conservative:"Conservativo",confidence_aggressive:"Ottimistico",current_interval_marker:"Intervallo attuale",recommended_marker:"Consigliato",characteristic_life:"Vita caratteristica",chart_mini_sparkline:"Sparkline di tendenza",chart_history:"Cronologia costi e durata",chart_seasonal:"Fattori stagionali, 12 mesi",chart_weibull:"Curva di affidabilit\xE0 Weibull",chart_sparkline:"Grafico valore trigger sensore",days_progress:"Avanzamento giorni",qr_code:"Codice QR",qr_generating:"Generazione codice QR\u2026",qr_error:"Impossibile generare il codice QR.",qr_error_no_url:"Nessun URL HA configurato. Impostare un URL esterno o interno in Impostazioni \u2192 Sistema \u2192 Rete.",save_error:"Salvataggio non riuscito. Riprovare.",qr_print:"Stampa",qr_download:"Scarica SVG",qr_action:"Azione alla scansione",qr_action_view:"Visualizza info manutenzione",qr_action_complete:"Segna manutenzione come completata",qr_url_mode:"Tipo di link",qr_mode_companion:"Companion App",qr_mode_local:"Locale (mDNS)",qr_mode_server:"URL server",overview:"Panoramica",analysis:"Analisi",recent_activities:"Attivit\xE0 recenti",search_notes:"Cerca nelle note",avg_cost:"\xD8 Costo",no_advanced_features:"Nessuna funzione avanzata attivata",no_advanced_features_hint:"Attiva \u201CIntervalli Adattivi\u201D o \u201CModelli Stagionali\u201D nelle impostazioni dell'integrazione per vedere i dati di analisi qui.",analysis_not_enough_data:"Non ci sono ancora abbastanza dati per l'analisi.",analysis_not_enough_data_hint:"L'analisi Weibull richiede almeno 5 manutenzioni completate; i modelli stagionali diventano visibili dopo 6+ punti dati al mese.",analysis_manual_task_hint:"Le attivit\xE0 manuali senza intervallo non generano dati di analisi.",completions:"completamenti",current:"Attuale",shorter:"Pi\xF9 breve",longer:"Pi\xF9 lungo",normal:"Normale",disabled:"Disattivato",compound_logic:"Logica composta",card_title:"Titolo",card_show_header:"Mostra intestazione con statistiche",card_show_actions:"Mostra pulsanti azione",card_compact:"Modalit\xE0 compatta",card_max_items:"Max elementi (0 = tutti)",card_filter_status:"Filtra per stato",card_filter_status_help:"Vuoto = mostra tutti gli stati.",card_filter_objects:"Filtra per oggetti",card_filter_objects_help:"Vuoto = mostra tutti gli oggetti.",card_filter_entities:"Filtra per entit\xE0 (entity_ids)",card_filter_entities_help:"Seleziona entit\xE0 sensor / binary_sensor da questa integrazione. Vuoto = tutte.",card_loading_objects:"Caricamento oggetti\u2026",card_load_error:"Impossibile caricare gli oggetti \u2014 verifica la connessione WebSocket.",card_no_tasks_title:"Nessuna attivit\xE0 di manutenzione",card_no_tasks_cta:"\u2192 Creane una nel pannello Manutenzione",no_objects:"Nessun oggetto ancora.",action_error:"Azione fallita. Riprova.",area_id_optional:"Area (opzionale)",installation_date_optional:"Data di installazione (opzionale)",custom_icon_optional:"Icona (opzionale, es. mdi:wrench)",task_enabled:"Attivit\xE0 abilitata",skip_reason_prompt:"Saltare questa attivit\xE0?",reason_optional:"Motivo (opzionale)",reset_date_prompt:"Segnare l'attivit\xE0 come eseguita?",reset_date_optional:"Data ultima esecuzione (opzionale, predefinito: oggi)",notes_label:"Note",documentation_label:"Documentazione",no_nfc_tag:"\u2014 Nessun tag \u2014",dashboard:"Dashboard",settings:"Impostazioni",settings_features:"Funzioni avanzate",settings_features_desc:"Attiva o disattiva le funzioni avanzate. La disattivazione le nasconde dall'interfaccia ma non elimina i dati.",feat_adaptive:"Pianificazione adattiva",feat_adaptive_desc:"Impara intervalli ottimali dalla cronologia di manutenzione",feat_predictions:"Previsioni sensore",feat_predictions_desc:"Prevedi date di attivazione dalla degradazione dei sensori",feat_seasonal:"Adeguamenti stagionali",feat_seasonal_desc:"Adegua gli intervalli in base ai modelli stagionali",feat_environmental:"Correlazione ambientale",feat_environmental_desc:"Correla gli intervalli con temperatura/umidit\xE0",feat_budget:"Monitoraggio budget",feat_budget_desc:"Monitora le spese di manutenzione mensili e annuali",feat_groups:"Gruppi di attivit\xE0",feat_groups_desc:"Organizza le attivit\xE0 in gruppi logici",feat_checklists:"Checklist",feat_checklists_desc:"Procedure multi-fase per il completamento delle attivit\xE0",settings_general:"Generale",settings_default_warning:"Giorni di avviso predefiniti",settings_panel_enabled:"Pannello laterale",settings_panel_title:"Titolo pannello laterale",settings_notifications:"Notifiche",settings_notify_service:"Servizio di notifica",test_notification:"Notifica di test",send_test:"Invia test",testing:"Invio in corso\u2026",test_notification_success:"Notifica di test inviata",test_notification_failed:"Notifica di test non riuscita",settings_notify_due_soon:"Notifica quando in scadenza",settings_notify_overdue:"Notifica quando scaduto",settings_notify_triggered:"Notifica quando attivato",settings_interval_hours:"Intervallo di ripetizione (ore, 0 = una volta)",settings_quiet_hours:"Ore di silenzio",settings_quiet_start:"Inizio",settings_quiet_end:"Fine",settings_max_per_day:"Max notifiche al giorno (0 = illimitato)",settings_bundling:"Raggruppare le notifiche",settings_bundle_threshold:"Soglia di raggruppamento",settings_actions:"Pulsanti azione mobili",settings_action_complete:"Mostra pulsante 'Completato'",settings_action_skip:"Mostra pulsante 'Salta'",settings_action_snooze:"Mostra pulsante 'Posticipa'",settings_snooze_hours:"Durata posticipo (ore)",settings_budget:"Budget",settings_currency:"Valuta",settings_budget_monthly:"Budget mensile",settings_budget_yearly:"Budget annuale",settings_budget_alerts:"Avvisi budget",settings_budget_threshold:"Soglia di avviso (%)",settings_import_export:"Import / Export",settings_export_json:"Esporta JSON",settings_export_yaml:"Esporta YAML",settings_export_csv:"Esporta CSV",settings_import_csv:"Importa CSV",settings_import_placeholder:"Incolla il contenuto JSON o CSV qui\u2026",settings_import_btn:"Importa",settings_import_success:"{count} oggetti importati con successo.",settings_export_success:"Export scaricato.",settings_saved:"Impostazione salvata.",settings_include_history:"Includi cronologia",sort_alphabetical:"Alfabetico",sort_due_soonest:"Scadenza pi\xF9 vicina",sort_task_count:"Numero di attivit\xE0",sort_area:"Area",sort_assigned_user:"Utente assegnato",sort_group:"Gruppo",groupby_none:"Nessun raggruppamento",groupby_area:"Per area",groupby_group:"Per gruppo",groupby_user:"Per utente",filter_label:"Filtro",user_label:"Utente",sort_label:"Ordinamento",group_by_label:"Raggruppa per",state_value_help:'Usa il valore di stato HA (di solito minuscolo, es. "on"/"off"). Il case viene normalizzato al salvataggio.',target_changes_help:"Numero di transizioni corrispondenti prima che il trigger si attivi (predefinito: 1).",qr_print_title:"Stampa codici QR",qr_print_desc:"Genera una pagina stampabile di codici QR da ritagliare e applicare sulle apparecchiature.",qr_print_load:"Carica oggetti",qr_print_filter:"Filtro",qr_print_objects:"Oggetti",qr_print_actions:"Azioni",qr_print_url_mode:"Tipo di link",qr_print_estimate:"Codici QR stimati",qr_print_over_limit:"limite 200, restringi il filtro",qr_print_generate:"Genera codici QR",qr_print_generating:"Generazione\u2026",qr_print_ready:"Codici QR pronti",qr_print_print_button:"Stampa",qr_print_empty:"Niente da generare",qr_action_skip:"Salta",vacation_title:"Modalit\xE0 vacanza",vacation_active:"attiva",vacation_ended:"terminata",vacation_desc:"Pianifica le tue vacanze: le notifiche vengono messe in pausa durante il periodo pi\xF9 giorni di buffer. Puoi escludere singole attivit\xE0.",vacation_enable:"Attiva modalit\xE0 vacanza",vacation_start:"Inizio",vacation_end:"Fine",vacation_buffer:"Buffer (giorni)",vacation_exempt_title:"Notifica comunque durante le vacanze",vacation_exempt_desc:"Scegli attivit\xE0 che devono notificare anche in vacanza (es. chimica della piscina critica).",vacation_load_tasks:"Carica attivit\xE0",vacation_preview_btn:"Mostra anteprima",vacation_preview_affected:"attivit\xE0 interessate",vacation_event_due_soon:"sar\xE0 in scadenza",vacation_event_overdue:"diventer\xE0 scaduta",vacation_event_triggered_est:"trigger sensore possibile",vacation_sensor_based:"(basato su sensore)",vacation_action_notify:"Notifica comunque",vacation_action_unsilence:"Silenzia di nuovo",vacation_marked_complete:"Segnato come completato",vacation_marked_skip:"Saltato",vacation_end_now:"Termina vacanza ora",unassigned:"Non assegnato",no_area:"Nessuna area",has_overdue:"Attivit\xE0 scadute",object:"Oggetto",settings_panel_access:"Accesso al pannello",settings_panel_access_desc:"Gli amministratori vedono sempre il pannello completo. Seleziona qui gli utenti non amministratori che dovrebbero anche avere accesso completo \u2014 gli altri vedono solo Completa e Salta.",no_non_admin_users:"Nessun utente non amministratore trovato. Aggiungili in Impostazioni \u2192 Persone.",owner_label:"Proprietario",feat_completion_actions:"Azioni di completamento",feat_completion_actions_desc:"Azione HA per attivit\xE0 al completamento + QR completamento rapido con valori predefiniti.",on_complete_action_title:"Al completamento: attiva azione HA (opzionale)",on_complete_action_desc:"Chiama un servizio HA quando l'attivit\xE0 viene completata \u2014 es. azzerare un contatore sul dispositivo.",on_complete_action_service:"Servizio",on_complete_action_target:"Entit\xE0 target",on_complete_action_data:"Dati (JSON, opzionale)",on_complete_action_test:"Testa azione",on_complete_action_test_success:"Riuscito",on_complete_action_test_failed:"Fallito",quick_complete_defaults_title:"Valori predefiniti completamento rapido (per scansioni QR, opzionale)",quick_complete_defaults_desc:"Valori predefiniti per QR di completamento rapido. Senza, il QR apre la finestra di completamento.",quick_complete_defaults_notes:"Note",quick_complete_defaults_cost:"Costo",quick_complete_defaults_duration:"Durata (minuti)",quick_complete_defaults_feedback_none:"Nessun feedback",quick_complete_defaults_feedback_needed:"Era necessario",quick_complete_defaults_feedback_not_needed:"Non necessario",quick_complete_success:"Completato rapidamente",trigger_replaced:"Trigger sostituito",add:"Aggiungi",show_stats:"Mostra statistiche + grafici",hide_stats:"Nascondi statistiche",adaptive_no_data:"Storico dei completamenti ancora insufficiente per l'analisi adattiva. Completa questa attivit\xE0 ancora qualche volta per sbloccare i suggerimenti sull'intervallo e i grafici di affidabilit\xE0.",suggestion_applied:"Intervallo suggerito applicato",vacation_mode:"Modalit\xE0 vacanza",vacation_status_active:"Attiva ora",vacation_status_scheduled:"Pianificata",vacation_status_inactive:"Inattiva",vacation_end_now_confirm:"Terminare subito la vacanza?",vacation_exempt_count:"escluse",vacation_advanced:"Avanzate\u2026",vacation_open_panel:"Apri nel pannello",enable:"Attiva",saved:"Salvato",budget_monthly_set:"Imposta mensile",budget_yearly_set:"Imposta annuale",budget_advanced:"Valuta, avvisi\u2026",budget_open_panel:"Apri nel pannello",groups_empty:"Nessun gruppo ancora.",group_new_placeholder:"Aggiungi gruppo\u2026",group_delete_confirm:'Eliminare il gruppo "{name}"?',groups_manage_tasks:"Gestisci assegnazioni attivit\xE0\u2026",groups_open_panel:"Apri nel pannello",on_complete_action_target_hint:"Nota: il dominio dell'entit\xE0 deve corrispondere al servizio \u2014 es. 'button.press' funziona solo su button.*, 'counter.increment' solo su counter.*, 'input_button.press' solo su input_button.* ecc. In caso di mancata corrispondenza l'azione fallisce silenziosamente (HA registra 'Referenced entities ... missing or not currently available').",show_all_objects:"Mostra tutti gli oggetti",show_all_tasks:"Azzera filtro \u2014 mostra tutte le attivit\xE0",filter_to_overdue:"Filtra l'elenco solo sulle attivit\xE0 in ritardo",filter_to_due_soon:"Filtra l'elenco solo sulle attivit\xE0 in scadenza",filter_to_triggered:"Filtra l'elenco solo sulle attivit\xE0 attivate",open_task:"Apri attivit\xE0",show_details:"Mostra storico + statistiche",hide_details:"Nascondi dettagli",history_empty:"Nessuno storico ancora.",history_edit_button:"Modifica voce",total_cost:"Costo totale",times_performed:"Eseguita",older_entries:"precedenti",open_in_panel:"Apri nel pannello Manutenzione",skip_reason:"Motivo del salto (facoltativo)",reset_to_date:"Reimposta ultima esecuzione al",delete_task_confirm:"Eliminare questa attivit\xE0 e il suo storico?",delete_object_confirm:"Eliminare questo oggetto e tutte le sue attivit\xE0?",loading:"Caricamento\u2026"},$a={maintenance:"Mantenimiento",objects:"Objetos",tasks:"Tareas",overdue:"Vencida",due_soon:"Pr\xF3xima",triggered:"Activada",ok:"OK",all:"Todos",new_object:"+ Nuevo objeto",edit:"Editar",delete:"Eliminar",add_task:"+ Tarea",complete:"Completada",completed:"Completada",skip:"Omitir",skipped:"Omitida",reset:"Restablecer",cancel:"Cancelar",completing:"Completando\u2026",interval:"Intervalo",warning:"Aviso",last_performed:"\xDAltima ejecuci\xF3n",next_due:"Pr\xF3ximo vencimiento",days_until_due:"D\xEDas hasta vencimiento",avg_duration:"\xD8 Duraci\xF3n",trigger:"Disparador",trigger_type:"Tipo de disparador",threshold_above:"L\xEDmite superior",threshold_below:"L\xEDmite inferior",threshold:"Umbral",counter:"Contador",state_change:"Cambio de estado",runtime:"Tiempo de funcionamiento",runtime_hours:"Duraci\xF3n objetivo (horas)",target_value:"Valor objetivo",baseline:"L\xEDnea base",target_changes:"Cambios objetivo",for_minutes:"Durante (minutos)",time_based:"Temporal",sensor_based:"Sensor",manual:"Manual",one_time:"Una vez",weekdays:"D\xEDas de la semana",nth_weekday:"N-\xE9simo d\xEDa de la semana del mes",day_of_month:"D\xEDa del mes",recurrence_on_days:"Repetir los",recurrence_occurrence:"Aparici\xF3n",recurrence_weekday:"D\xEDa de la semana",recurrence_day:"D\xEDa del mes (1\u201331)",ord_1:"1.\xBA",ord_2:"2.\xBA",ord_3:"3.\xBA",ord_4:"4.\xBA",ord_5:"5.\xBA",ord_last:"\xDAltimo",day_word:"D\xEDa",interval_value:"Intervalo",interval_unit:"Unidad",unit_days:"D\xEDas",unit_weeks:"Semanas",unit_months:"Meses",unit_years:"A\xF1os",due_date:"Fecha de vencimiento",cleaning:"Limpieza",inspection:"Inspecci\xF3n",replacement:"Sustituci\xF3n",calibration:"Calibraci\xF3n",service:"Servicio",custom:"Personalizado",history:"Historial",cost:"Coste",duration:"Duraci\xF3n",both:"Ambos",trigger_val:"Valor del disparador",complete_title:"Completada: ",checklist:"Lista de verificaci\xF3n",checklist_steps_optional:"Pasos de la lista de verificaci\xF3n (opcional)",checklist_placeholder:`Limpiar filtro
Reemplazar junta
Probar presi\xF3n`,checklist_help:"Un paso por l\xEDnea. M\xE1x. 100 elementos.",err_too_long:"{field}: demasiado largo (m\xE1x. {n} caracteres)",err_too_short:"{field}: demasiado corto (m\xEDn. {n} caracteres)",err_value_too_high:"{field}: demasiado grande (m\xE1x. {n})",err_value_too_low:"{field}: demasiado peque\xF1o (m\xEDn. {n})",err_required:"{field}: campo obligatorio",err_wrong_type:"{field}: tipo incorrecto (esperado: {type})",err_invalid_choice:"{field}: valor no permitido",err_invalid_value:"{field}: valor inv\xE1lido",feat_schedule_time:"Programaci\xF3n por hora",feat_schedule_time_desc:"Las tareas vencen a una hora espec\xEDfica en lugar de medianoche.",schedule_time_optional:"Vence a las (opcional, HH:MM)",schedule_time_help:"Vac\xEDo = medianoche (predeterminado). Zona horaria HA.",at_time:"a las",notes_optional:"Notas (opcional)",cost_optional:"Coste (opcional)",duration_minutes:"Duraci\xF3n en minutos (opcional)",days:"d\xEDas",day:"d\xEDa",today:"Hoy",d_overdue:"d vencida",no_tasks:"No hay tareas de mantenimiento. Cree un objeto para empezar.",no_tasks_short:"Sin tareas",no_history:"Sin entradas en el historial.",show_all:"Mostrar todo",cost_duration_chart:"Costes & Duraci\xF3n",installed:"Instalado",confirm_delete_object:"\xBFEliminar este objeto y todas sus tareas?",confirm_delete_task:"\xBFEliminar esta tarea?",min:"M\xEDn",max:"M\xE1x",save:"Guardar",saving:"Guardando\u2026",edit_task:"Editar tarea",new_task:"Nueva tarea de mantenimiento",task_name:"Nombre de la tarea",maintenance_type:"Tipo de mantenimiento",schedule_type:"Tipo de planificaci\xF3n",interval_days:"Intervalo (d\xEDas)",warning_days:"D\xEDas de aviso",last_performed_optional:"\xDAltima ejecuci\xF3n (opcional)",interval_anchor:"Anclaje del intervalo",anchor_completion:"Desde la fecha de finalizaci\xF3n",anchor_planned:"Desde la fecha planificada (sin desviaci\xF3n)",edit_object:"Editar objeto",name:"Nombre",manufacturer_optional:"Fabricante (opcional)",model_optional:"Modelo (opcional)",serial_number_optional:"N\xFAmero de serie (opcional)",serial_number_label:"N/S",documentation_url_label:"Manual",object_notes_label:"Notas",sort_due_date:"Vencimiento",sort_object:"Nombre del objeto",sort_type:"Tipo",sort_task_name:"Nombre de la tarea",all_objects:"Todos los objetos",tasks_lower:"tareas",no_tasks_yet:"A\xFAn no hay tareas",add_first_task:"Agregar primera tarea",trigger_configuration:"Configuraci\xF3n del disparador",entity_id:"ID de entidad",comma_separated:"separados por comas",entity_logic:"L\xF3gica de entidad",entity_logic_any:"Cualquier entidad activa",entity_logic_all:"Todas las entidades deben activar",entities:"entidades",attribute_optional:"Atributo (opcional, vac\xEDo = estado)",use_entity_state:"Usar estado de la entidad (sin atributo)",trigger_above:"Activar por encima de",trigger_below:"Activar por debajo de",for_at_least_minutes:"Durante al menos (minutos)",safety_interval_days:"Intervalo de seguridad (d\xEDas, opcional)",safety_interval:"Intervalo de seguridad (opcional)",delta_mode:"Modo delta",from_state_optional:"Desde estado (opcional)",to_state_optional:"Hasta estado (opcional)",documentation_url_optional:"URL de documentaci\xF3n (opcional)",object_notes_optional:"Notas (opcional)",nfc_tag_id_optional:"ID de etiqueta NFC (opcional)",nfc_tags_empty_help:"A\xFAn no hay tags NFC registrados en Home Assistant.",nfc_tags_open_settings:"Abrir configuraci\xF3n de tags",nfc_tags_refresh:"Actualizar",environmental_entity_optional:"Sensor ambiental (opcional)",environmental_entity_helper:"p.ej. sensor.temperatura_exterior \u2014 ajusta el intervalo segu\u0301n las condiciones ambientales",environmental_attribute_optional:"Atributo ambiental (opcional)",nfc_tag_id:"ID de etiqueta NFC",nfc_linked:"Etiqueta NFC vinculada",nfc_link_hint:"Clic para vincular etiqueta NFC",responsible_user:"Usuario responsable",no_user_assigned:"(Ning\xFAn usuario asignado)",all_users:"Todos los usuarios",my_tasks:"Mis tareas",tab_calendar:"Calendario",cal_no_events:"Sin mantenimiento",cal_window_7:"7 d\xEDas",cal_window_14:"14 d\xEDas",cal_window_30:"30 d\xEDas",cal_window_365:"1 a\xF1o",cal_every_n_days:"cada {n} d\xEDas",cal_source_time:"Basado en tiempo",cal_source_time_adaptive:"Basado en tiempo (adaptativo)",cal_source_sensor:"Basado en sensor",cal_predicted:"predicho",cal_confidence_high:"alta confianza",cal_confidence_medium:"confianza media",cal_confidence_low:"baja confianza",budget_monthly:"Presupuesto mensual",budget_yearly:"Presupuesto anual",groups:"Grupos",new_group:"Nuevo grupo",edit_group:"Editar grupo",no_groups:"Sin grupos todav\xEDa",delete_group:"Eliminar grupo",delete_group_confirm:"\xBFEliminar el grupo '{name}'?",group_select_tasks:"Seleccionar tareas",group_name_required:"Nombre requerido",description_optional:"Descripci\xF3n (opcional)",selected:"Seleccionado",loading_chart:"Cargando datos...",was_maintenance_needed:"\xBFEra necesario este mantenimiento?",feedback_needed:"Necesario",feedback_not_needed:"No necesario",feedback_not_sure:"No seguro",suggested_interval:"Intervalo sugerido",apply_suggestion:"Aplicar",reanalyze:"Reanalizar",reanalyze_result:"Nuevo an\xE1lisis",reanalyze_insufficient_data:"Datos insuficientes para una recomendaci\xF3n",data_points:"puntos de datos",dismiss_suggestion:"Descartar",confidence_low:"Baja",confidence_medium:"Media",confidence_high:"Alta",recommended:"recomendado",seasonal_awareness:"Conciencia estacional",edit_seasonal_overrides:"Editar factores estacionales",seasonal_overrides_title:"Factores estacionales (override)",seasonal_overrides_hint:"Factor por mes (0.1\u20135.0). Vac\xEDo = aprendido autom\xE1ticamente.",seasonal_override_invalid:"Valor no v\xE1lido",seasonal_override_range:"El factor debe estar entre 0.1 y 5.0",clear_all:"Borrar todo",seasonal_chart_title:"Factores estacionales",seasonal_learned:"Aprendido",seasonal_manual:"Manual",month_jan:"Ene",month_feb:"Feb",month_mar:"Mar",month_apr:"Abr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Ago",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dic",sensor_prediction:"Predicci\xF3n del sensor",degradation_trend:"Tendencia",trend_rising:"En aumento",trend_falling:"En descenso",trend_stable:"Estable",trend_insufficient_data:"Datos insuficientes",days_until_threshold:"D\xEDas hasta el umbral",threshold_exceeded:"Umbral superado",environmental_adjustment:"Factor ambiental",sensor_prediction_urgency:"El sensor predice el umbral en ~{days} d\xEDas",day_short:"d\xEDa",weibull_reliability_curve:"Curva de fiabilidad",weibull_failure_probability:"Probabilidad de fallo",weibull_r_squared:"Ajuste R\xB2",beta_early_failures:"Fallos tempranos",beta_random_failures:"Fallos aleatorios",beta_wear_out:"Desgaste",beta_highly_predictable:"Altamente predecible",confidence_interval:"Intervalo de confianza",confidence_conservative:"Conservador",confidence_aggressive:"Optimista",current_interval_marker:"Intervalo actual",recommended_marker:"Recomendado",characteristic_life:"Vida caracter\xEDstica",chart_mini_sparkline:"Sparkline de tendencia",chart_history:"Historial de costes y duraci\xF3n",chart_seasonal:"Factores estacionales, 12 meses",chart_weibull:"Curva de fiabilidad Weibull",chart_sparkline:"Gr\xE1fico de valor del disparador",days_progress:"Progreso en d\xEDas",qr_code:"C\xF3digo QR",qr_generating:"Generando c\xF3digo QR\u2026",qr_error:"No se pudo generar el c\xF3digo QR.",qr_error_no_url:"No hay URL de HA configurada. Establezca una URL externa o interna en Ajustes \u2192 Sistema \u2192 Red.",save_error:"Error al guardar. Int\xE9ntelo de nuevo.",qr_print:"Imprimir",qr_download:"Descargar SVG",qr_action:"Acci\xF3n al escanear",qr_action_view:"Ver info de mantenimiento",qr_action_complete:"Marcar mantenimiento como completado",qr_url_mode:"Tipo de enlace",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"URL del servidor",overview:"Resumen",analysis:"An\xE1lisis",recent_activities:"Actividades recientes",search_notes:"Buscar en notas",avg_cost:"\xD8 Coste",no_advanced_features:"Sin funciones avanzadas activadas",no_advanced_features_hint:"Active \u201CIntervalos Adaptativos\u201D o \u201CPatrones Estacionales\u201D en la configuraci\xF3n de la integraci\xF3n para ver datos de an\xE1lisis aqu\xED.",analysis_not_enough_data:"A\xFAn no hay suficientes datos para el an\xE1lisis.",analysis_not_enough_data_hint:"El an\xE1lisis Weibull requiere al menos 5 mantenimientos completados; los patrones estacionales son visibles tras 6+ puntos de datos por mes.",analysis_manual_task_hint:"Las tareas manuales sin intervalo no generan datos de an\xE1lisis.",completions:"finalizaciones",current:"Actual",shorter:"M\xE1s corto",longer:"M\xE1s largo",normal:"Normal",disabled:"Desactivado",compound_logic:"L\xF3gica compuesta",card_title:"T\xEDtulo",card_show_header:"Mostrar encabezado con estad\xEDsticas",card_show_actions:"Mostrar botones de acci\xF3n",card_compact:"Modo compacto",card_max_items:"M\xE1x. elementos (0 = todos)",card_filter_status:"Filtrar por estado",card_filter_status_help:"Vac\xEDo = mostrar todos los estados.",card_filter_objects:"Filtrar por objetos",card_filter_objects_help:"Vac\xEDo = mostrar todos los objetos.",card_filter_entities:"Filtrar por entidades (entity_ids)",card_filter_entities_help:"Selecciona entidades sensor / binary_sensor de esta integraci\xF3n. Vac\xEDo = todas.",card_loading_objects:"Cargando objetos\u2026",card_load_error:"No se pudieron cargar los objetos \u2014 verifica la conexi\xF3n WebSocket.",card_no_tasks_title:"A\xFAn no hay tareas de mantenimiento",card_no_tasks_cta:"\u2192 Crea una en el panel Mantenimiento",no_objects:"A\xFAn no hay objetos.",action_error:"Acci\xF3n fallida. Int\xE9ntelo de nuevo.",area_id_optional:"\xC1rea (opcional)",installation_date_optional:"Fecha de instalaci\xF3n (opcional)",custom_icon_optional:"Icono (opcional, ej. mdi:wrench)",task_enabled:"Tarea habilitada",skip_reason_prompt:"\xBFOmitir esta tarea?",reason_optional:"Motivo (opcional)",reset_date_prompt:"\xBFMarcar la tarea como realizada?",reset_date_optional:"Fecha de \xFAltima ejecuci\xF3n (opcional, por defecto: hoy)",notes_label:"Notas",documentation_label:"Documentaci\xF3n",no_nfc_tag:"\u2014 Sin etiqueta \u2014",dashboard:"Panel",settings:"Ajustes",settings_features:"Funciones avanzadas",settings_features_desc:"Active o desactive funciones avanzadas. Desactivar las oculta de la interfaz pero no elimina datos.",feat_adaptive:"Planificaci\xF3n adaptativa",feat_adaptive_desc:"Aprender intervalos \xF3ptimos del historial de mantenimiento",feat_predictions:"Predicciones de sensor",feat_predictions_desc:"Predecir fechas de activaci\xF3n por degradaci\xF3n del sensor",feat_seasonal:"Ajustes estacionales",feat_seasonal_desc:"Ajustar intervalos seg\xFAn patrones estacionales",feat_environmental:"Correlaci\xF3n ambiental",feat_environmental_desc:"Correlacionar intervalos con temperatura/humedad",feat_budget:"Seguimiento de presupuesto",feat_budget_desc:"Seguir los gastos de mantenimiento mensuales y anuales",feat_groups:"Grupos de tareas",feat_groups_desc:"Organizar tareas en grupos l\xF3gicos",feat_checklists:"Listas de verificaci\xF3n",feat_checklists_desc:"Procedimientos de varios pasos para completar tareas",settings_general:"General",settings_default_warning:"D\xEDas de aviso predeterminados",settings_panel_enabled:"Panel lateral",settings_panel_title:"T\xEDtulo del panel lateral",settings_notifications:"Notificaciones",settings_notify_service:"Servicio de notificaci\xF3n",test_notification:"Notificaci\xF3n de prueba",send_test:"Enviar prueba",testing:"Enviando\u2026",test_notification_success:"Notificaci\xF3n de prueba enviada",test_notification_failed:"La notificaci\xF3n de prueba fall\xF3",settings_notify_due_soon:"Notificar cuando est\xE9 pr\xF3xima",settings_notify_overdue:"Notificar cuando est\xE9 vencida",settings_notify_triggered:"Notificar cuando se active",settings_interval_hours:"Intervalo de repetici\xF3n (horas, 0 = una vez)",settings_quiet_hours:"Horas de silencio",settings_quiet_start:"Inicio",settings_quiet_end:"Fin",settings_max_per_day:"M\xE1x. notificaciones por d\xEDa (0 = ilimitado)",settings_bundling:"Agrupar notificaciones",settings_bundle_threshold:"Umbral de agrupaci\xF3n",settings_actions:"Botones de acci\xF3n m\xF3viles",settings_action_complete:"Mostrar bot\xF3n 'Completada'",settings_action_skip:"Mostrar bot\xF3n 'Omitir'",settings_action_snooze:"Mostrar bot\xF3n 'Posponer'",settings_snooze_hours:"Duraci\xF3n de posposici\xF3n (horas)",settings_budget:"Presupuesto",settings_currency:"Moneda",settings_budget_monthly:"Presupuesto mensual",settings_budget_yearly:"Presupuesto anual",settings_budget_alerts:"Alertas de presupuesto",settings_budget_threshold:"Umbral de alerta (%)",settings_import_export:"Importar / Exportar",settings_export_json:"Exportar JSON",settings_export_yaml:"Exportar YAML",settings_export_csv:"Exportar CSV",settings_import_csv:"Importar CSV",settings_import_placeholder:"Pegue el contenido JSON o CSV aqu\xED\u2026",settings_import_btn:"Importar",settings_import_success:"{count} objetos importados correctamente.",settings_export_success:"Exportaci\xF3n descargada.",settings_saved:"Ajuste guardado.",settings_include_history:"Incluir historial",sort_alphabetical:"Alfab\xE9tico",sort_due_soonest:"Pr\xF3ximo a vencer",sort_task_count:"Cantidad de tareas",sort_area:"\xC1rea",sort_assigned_user:"Usuario asignado",sort_group:"Grupo",groupby_none:"Sin agrupaci\xF3n",groupby_area:"Por \xE1rea",groupby_group:"Por grupo",groupby_user:"Por usuario",filter_label:"Filtro",user_label:"Usuario",sort_label:"Ordenar",group_by_label:"Agrupar por",state_value_help:'Usa el valor de estado de HA (normalmente en min\xFAsculas, p. ej. "on"/"off"). Las may\xFAsculas se normalizan al guardar.',target_changes_help:"N\xFAmero de transiciones coincidentes antes de que se dispare el trigger (predeterminado: 1).",qr_print_title:"Imprimir c\xF3digos QR",qr_print_desc:"Genera una p\xE1gina imprimible de c\xF3digos QR para recortar y pegar en tus equipos.",qr_print_load:"Cargar objetos",qr_print_filter:"Filtro",qr_print_objects:"Objetos",qr_print_actions:"Acciones",qr_print_url_mode:"Tipo de enlace",qr_print_estimate:"C\xF3digos QR estimados",qr_print_over_limit:"m\xE1ximo 200, reduce el filtro",qr_print_generate:"Generar c\xF3digos QR",qr_print_generating:"Generando\u2026",qr_print_ready:"C\xF3digos QR listos",qr_print_print_button:"Imprimir",qr_print_empty:"Nada que generar",qr_action_skip:"Omitir",vacation_title:"Modo vacaciones",vacation_active:"activo",vacation_ended:"terminado",vacation_desc:"Planifica tus vacaciones: las notificaciones se pausan durante el per\xEDodo m\xE1s unos d\xEDas de margen. Puedes excluir tareas concretas.",vacation_enable:"Activar modo vacaciones",vacation_start:"Inicio",vacation_end:"Fin",vacation_buffer:"Margen (d\xEDas)",vacation_exempt_title:"Notificar igual durante vacaciones",vacation_exempt_desc:"Selecciona tareas que deben notificar tambi\xE9n en vacaciones (p. ej. qu\xEDmica cr\xEDtica de piscina).",vacation_load_tasks:"Cargar tareas",vacation_preview_btn:"Mostrar vista previa",vacation_preview_affected:"tareas afectadas",vacation_event_due_soon:"vencer\xE1 pronto",vacation_event_overdue:"se volver\xE1 vencida",vacation_event_triggered_est:"posible activaci\xF3n de sensor",vacation_sensor_based:"(basado en sensor)",vacation_action_notify:"Notificar igual",vacation_action_unsilence:"Silenciar de nuevo",vacation_marked_complete:"Marcado como completado",vacation_marked_skip:"Omitido",vacation_end_now:"Terminar vacaciones ahora",unassigned:"Sin asignar",no_area:"Sin \xE1rea",has_overdue:"Tareas vencidas",object:"Objeto",settings_panel_access:"Acceso al panel",settings_panel_access_desc:"Los administradores siempre ven el panel completo. Selecciona aqu\xED a los usuarios no administradores que tambi\xE9n deben tener acceso completo \u2014 los dem\xE1s solo ven Completar y Omitir.",no_non_admin_users:"No se encontraron usuarios no administradores. A\xF1ade alguno en Ajustes \u2192 Personas.",owner_label:"Propietario",feat_completion_actions:"Acciones de finalizaci\xF3n",feat_completion_actions_desc:"Acci\xF3n HA por tarea al completar + QR de finalizaci\xF3n r\xE1pida con valores prefijados.",on_complete_action_title:"Al completar: ejecutar acci\xF3n HA (opcional)",on_complete_action_desc:"Llama un servicio HA cuando se completa la tarea \u2014 p. ej. reiniciar un contador del dispositivo.",on_complete_action_service:"Servicio",on_complete_action_target:"Entidad objetivo",on_complete_action_data:"Datos (JSON, opcional)",on_complete_action_test:"Probar acci\xF3n",on_complete_action_test_success:"\xC9xito",on_complete_action_test_failed:"Fallido",quick_complete_defaults_title:"Valores predeterminados de finalizaci\xF3n r\xE1pida (para escaneos QR, opcional)",quick_complete_defaults_desc:"Valores prefijados para QR de finalizaci\xF3n r\xE1pida. Sin ellos, el QR abre el di\xE1logo de completar.",quick_complete_defaults_notes:"Notas",quick_complete_defaults_cost:"Coste",quick_complete_defaults_duration:"Duraci\xF3n (minutos)",quick_complete_defaults_feedback_none:"Sin feedback",quick_complete_defaults_feedback_needed:"Era necesario",quick_complete_defaults_feedback_not_needed:"No era necesario",quick_complete_success:"Completado r\xE1pido",trigger_replaced:"Disparador reemplazado",add:"A\xF1adir",show_stats:"Mostrar estad\xEDsticas + gr\xE1ficos",hide_stats:"Ocultar estad\xEDsticas",adaptive_no_data:"A\xFAn no hay suficiente historial de finalizaciones para el an\xE1lisis adaptativo. Completa esta tarea unas cuantas veces m\xE1s para desbloquear las recomendaciones de intervalo y los gr\xE1ficos de fiabilidad.",suggestion_applied:"Intervalo sugerido aplicado",vacation_mode:"Modo vacaciones",vacation_status_active:"Activo ahora",vacation_status_scheduled:"Programado",vacation_status_inactive:"Inactivo",vacation_end_now_confirm:"\xBFFinalizar las vacaciones de inmediato?",vacation_exempt_count:"exentas",vacation_advanced:"Avanzado\u2026",vacation_open_panel:"Abrir en el panel",enable:"Activar",saved:"Guardado",budget_monthly_set:"Definir mensual",budget_yearly_set:"Definir anual",budget_advanced:"Moneda, alertas\u2026",budget_open_panel:"Abrir en el panel",groups_empty:"A\xFAn no hay grupos.",group_new_placeholder:"A\xF1adir grupo\u2026",group_delete_confirm:'\xBFEliminar el grupo "{name}"?',groups_manage_tasks:"Gestionar asignaciones de tareas\u2026",groups_open_panel:"Abrir en el panel",on_complete_action_target_hint:"Nota: el dominio de la entidad debe coincidir con el servicio \u2014 p. ej. 'button.press' solo funciona en button.*, 'counter.increment' solo en counter.*, 'input_button.press' solo en input_button.* etc. Si no coinciden, la acci\xF3n falla silenciosamente (HA registra 'Referenced entities ... missing or not currently available').",show_all_objects:"Mostrar todos los objetos",show_all_tasks:"Quitar filtro \u2014 mostrar todas las tareas",filter_to_overdue:"Filtrar la lista solo a vencidas",filter_to_due_soon:"Filtrar la lista solo a pr\xF3ximas a vencer",filter_to_triggered:"Filtrar la lista solo a activadas",open_task:"Abrir tarea",show_details:"Mostrar historial + estad\xEDsticas",hide_details:"Ocultar detalles",history_empty:"A\xFAn no hay historial.",history_edit_button:"Editar entrada",total_cost:"Coste total",times_performed:"Realizada",older_entries:"anteriores",open_in_panel:"Abrir en el panel de Mantenimiento",skip_reason:"Motivo de omisi\xF3n (opcional)",reset_to_date:"Restablecer \xFAltima ejecuci\xF3n a",delete_task_confirm:"\xBFEliminar esta tarea y su historial?",delete_object_confirm:"\xBFEliminar este objeto y todas sus tareas?",loading:"Cargando\u2026"},ja={maintenance:"Manuten\xE7\xE3o",objects:"Objetos",tasks:"Tarefas",overdue:"Atrasada",due_soon:"Pr\xF3xima",triggered:"Acionada",ok:"OK",all:"Todos",new_object:"+ Novo objeto",edit:"Editar",delete:"Eliminar",add_task:"+ Tarefa",complete:"Conclu\xEDda",completed:"Conclu\xEDda",skip:"Saltar",skipped:"Saltada",reset:"Repor",cancel:"Cancelar",completing:"A concluir\u2026",interval:"Intervalo",warning:"Aviso",last_performed:"\xDAltima execu\xE7\xE3o",next_due:"Pr\xF3ximo vencimento",days_until_due:"Dias at\xE9 vencimento",avg_duration:"\xD8 Dura\xE7\xE3o",trigger:"Acionador",trigger_type:"Tipo de acionador",threshold_above:"Limite superior",threshold_below:"Limite inferior",threshold:"Limiar",counter:"Contador",state_change:"Mudan\xE7a de estado",runtime:"Tempo de funcionamento",runtime_hours:"Dura\xE7\xE3o alvo (horas)",target_value:"Valor alvo",baseline:"Linha de base",target_changes:"Altera\xE7\xF5es alvo",for_minutes:"Durante (minutos)",time_based:"Temporal",sensor_based:"Sensor",manual:"Manual",one_time:"\xDAnica vez",weekdays:"Dias da semana",nth_weekday:"N-\xE9simo dia da semana do m\xEAs",day_of_month:"Dia do m\xEAs",recurrence_on_days:"Repetir em",recurrence_occurrence:"Ocorr\xEAncia",recurrence_weekday:"Dia da semana",recurrence_day:"Dia do m\xEAs (1\u201331)",ord_1:"1.\xBA",ord_2:"2.\xBA",ord_3:"3.\xBA",ord_4:"4.\xBA",ord_5:"5.\xBA",ord_last:"\xDAltimo",day_word:"Dia",interval_value:"Intervalo",interval_unit:"Unidade",unit_days:"Dias",unit_weeks:"Semanas",unit_months:"Meses",unit_years:"Anos",due_date:"Data de vencimento",cleaning:"Limpeza",inspection:"Inspe\xE7\xE3o",replacement:"Substitui\xE7\xE3o",calibration:"Calibra\xE7\xE3o",service:"Servi\xE7o",custom:"Personalizado",history:"Hist\xF3rico",cost:"Custo",duration:"Dura\xE7\xE3o",both:"Ambos",trigger_val:"Valor do acionador",complete_title:"Conclu\xEDda: ",checklist:"Lista de verifica\xE7\xE3o",checklist_steps_optional:"Passos da lista de verifica\xE7\xE3o (opcional)",checklist_placeholder:`Limpar filtro
Substituir veda\xE7\xE3o
Testar press\xE3o`,checklist_help:"Um passo por linha. M\xE1x. 100 itens.",err_too_long:"{field}: demasiado longo (m\xE1x. {n} caracteres)",err_too_short:"{field}: demasiado curto (m\xEDn. {n} caracteres)",err_value_too_high:"{field}: demasiado grande (m\xE1x. {n})",err_value_too_low:"{field}: demasiado pequeno (m\xEDn. {n})",err_required:"{field}: campo obrigat\xF3rio",err_wrong_type:"{field}: tipo incorreto (esperado: {type})",err_invalid_choice:"{field}: valor n\xE3o permitido",err_invalid_value:"{field}: valor inv\xE1lido",feat_schedule_time:"Agendamento por hora",feat_schedule_time_desc:"Tarefas vencem em um hor\xE1rio espec\xEDfico em vez de meia-noite.",schedule_time_optional:"Vence \xE0s (opcional, HH:MM)",schedule_time_help:"Vazio = meia-noite (padr\xE3o). Fuso hor\xE1rio HA.",at_time:"\xE0s",notes_optional:"Notas (opcional)",cost_optional:"Custo (opcional)",duration_minutes:"Dura\xE7\xE3o em minutos (opcional)",days:"dias",day:"dia",today:"Hoje",d_overdue:"d em atraso",no_tasks:"Sem tarefas de manuten\xE7\xE3o. Crie um objeto para come\xE7ar.",no_tasks_short:"Sem tarefas",no_history:"Sem entradas no hist\xF3rico.",show_all:"Mostrar tudo",cost_duration_chart:"Custos & Dura\xE7\xE3o",installed:"Instalado",confirm_delete_object:"Eliminar este objeto e todas as suas tarefas?",confirm_delete_task:"Eliminar esta tarefa?",min:"M\xEDn",max:"M\xE1x",save:"Guardar",saving:"A guardar\u2026",edit_task:"Editar tarefa",new_task:"Nova tarefa de manuten\xE7\xE3o",task_name:"Nome da tarefa",maintenance_type:"Tipo de manuten\xE7\xE3o",schedule_type:"Tipo de agendamento",interval_days:"Intervalo (dias)",warning_days:"Dias de aviso",last_performed_optional:"\xDAltima execu\xE7\xE3o (opcional)",interval_anchor:"\xC2ncora do intervalo",anchor_completion:"A partir da data de conclus\xE3o",anchor_planned:"A partir da data planeada (sem desvio)",edit_object:"Editar objeto",name:"Nome",manufacturer_optional:"Fabricante (opcional)",model_optional:"Modelo (opcional)",serial_number_optional:"N\xFAmero de s\xE9rie (opcional)",serial_number_label:"N/S",documentation_url_label:"Manual",object_notes_label:"Notas",sort_due_date:"Vencimento",sort_object:"Nome do objeto",sort_type:"Tipo",sort_task_name:"Nome da tarefa",all_objects:"Todos os objetos",tasks_lower:"tarefas",no_tasks_yet:"Ainda sem tarefas",add_first_task:"Adicionar primeira tarefa",trigger_configuration:"Configura\xE7\xE3o do acionador",entity_id:"ID da entidade",comma_separated:"separados por v\xEDrgulas",entity_logic:"L\xF3gica da entidade",entity_logic_any:"Qualquer entidade aciona",entity_logic_all:"Todas as entidades devem acionar",entities:"entidades",attribute_optional:"Atributo (opcional, vazio = estado)",use_entity_state:"Usar estado da entidade (sem atributo)",trigger_above:"Acionar acima de",trigger_below:"Acionar abaixo de",for_at_least_minutes:"Durante pelo menos (minutos)",safety_interval_days:"Intervalo de seguran\xE7a (dias, opcional)",safety_interval:"Intervalo de seguran\xE7a (opcional)",delta_mode:"Modo delta",from_state_optional:"Do estado (opcional)",to_state_optional:"Para o estado (opcional)",documentation_url_optional:"URL de documenta\xE7\xE3o (opcional)",object_notes_optional:"Notas (opcional)",nfc_tag_id_optional:"ID da etiqueta NFC (opcional)",nfc_tags_empty_help:"Ainda nenhuma tag NFC registada no Home Assistant.",nfc_tags_open_settings:"Abrir configura\xE7\xF5es de tags",nfc_tags_refresh:"Atualizar",environmental_entity_optional:"Sensor ambiental (opcional)",environmental_entity_helper:"ex. sensor.temperatura_exterior \u2014 ajusta o intervalo segundo as condi\xE7\xF5es ambientais",environmental_attribute_optional:"Atributo ambiental (opcional)",nfc_tag_id:"ID da etiqueta NFC",nfc_linked:"Etiqueta NFC associada",nfc_link_hint:"Clique para associar etiqueta NFC",responsible_user:"Utilizador respons\xE1vel",no_user_assigned:"(Nenhum utilizador atribu\xEDdo)",all_users:"Todos os utilizadores",my_tasks:"As minhas tarefas",tab_calendar:"Calend\xE1rio",cal_no_events:"Sem manuten\xE7\xE3o",cal_window_7:"7 dias",cal_window_14:"14 dias",cal_window_30:"30 dias",cal_window_365:"1 ano",cal_every_n_days:"a cada {n} dias",cal_source_time:"Baseado em tempo",cal_source_time_adaptive:"Baseado em tempo (adaptativo)",cal_source_sensor:"Baseado em sensor",cal_predicted:"previsto",cal_confidence_high:"alta confian\xE7a",cal_confidence_medium:"confian\xE7a m\xE9dia",cal_confidence_low:"baixa confian\xE7a",budget_monthly:"Or\xE7amento mensal",budget_yearly:"Or\xE7amento anual",groups:"Grupos",new_group:"Novo grupo",edit_group:"Editar grupo",no_groups:"Ainda sem grupos",delete_group:"Eliminar grupo",delete_group_confirm:"Eliminar o grupo '{name}'?",group_select_tasks:"Selecionar tarefas",group_name_required:"Nome obrigat\xF3rio",description_optional:"Descri\xE7\xE3o (opcional)",selected:"Selecionado",loading_chart:"A carregar dados...",was_maintenance_needed:"Esta manuten\xE7\xE3o era necess\xE1ria?",feedback_needed:"Necess\xE1ria",feedback_not_needed:"N\xE3o necess\xE1ria",feedback_not_sure:"N\xE3o tenho a certeza",suggested_interval:"Intervalo sugerido",apply_suggestion:"Aplicar",reanalyze:"Reanalisar",reanalyze_result:"Nova an\xE1lise",reanalyze_insufficient_data:"Dados insuficientes para uma recomenda\xE7\xE3o",data_points:"pontos de dados",dismiss_suggestion:"Descartar",confidence_low:"Baixa",confidence_medium:"M\xE9dia",confidence_high:"Alta",recommended:"recomendado",seasonal_awareness:"Consci\xEAncia sazonal",edit_seasonal_overrides:"Editar fatores sazonais",seasonal_overrides_title:"Fatores sazonais (override)",seasonal_overrides_hint:"Fator por m\xEAs (0.1\u20135.0). Vazio = aprendido automaticamente.",seasonal_override_invalid:"Valor inv\xE1lido",seasonal_override_range:"O fator deve estar entre 0.1 e 5.0",clear_all:"Limpar tudo",seasonal_chart_title:"Fatores sazonais",seasonal_learned:"Aprendido",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Fev",month_mar:"Mar",month_apr:"Abr",month_may:"Mai",month_jun:"Jun",month_jul:"Jul",month_aug:"Ago",month_sep:"Set",month_oct:"Out",month_nov:"Nov",month_dec:"Dez",sensor_prediction:"Previs\xE3o do sensor",degradation_trend:"Tend\xEAncia",trend_rising:"A subir",trend_falling:"A descer",trend_stable:"Est\xE1vel",trend_insufficient_data:"Dados insuficientes",days_until_threshold:"Dias at\xE9 ao limiar",threshold_exceeded:"Limiar ultrapassado",environmental_adjustment:"Fator ambiental",sensor_prediction_urgency:"O sensor prev\xEA o limiar em ~{days} dias",day_short:"dia",weibull_reliability_curve:"Curva de fiabilidade",weibull_failure_probability:"Probabilidade de falha",weibull_r_squared:"Ajuste R\xB2",beta_early_failures:"Falhas precoces",beta_random_failures:"Falhas aleat\xF3rias",beta_wear_out:"Desgaste",beta_highly_predictable:"Altamente previs\xEDvel",confidence_interval:"Intervalo de confian\xE7a",confidence_conservative:"Conservador",confidence_aggressive:"Otimista",current_interval_marker:"Intervalo atual",recommended_marker:"Recomendado",characteristic_life:"Vida caracter\xEDstica",chart_mini_sparkline:"Sparkline de tend\xEAncia",chart_history:"Hist\xF3rico de custos e dura\xE7\xE3o",chart_seasonal:"Fatores sazonais, 12 meses",chart_weibull:"Curva de fiabilidade Weibull",chart_sparkline:"Gr\xE1fico de valor do acionador",days_progress:"Progresso em dias",qr_code:"C\xF3digo QR",qr_generating:"A gerar c\xF3digo QR\u2026",qr_error:"N\xE3o foi poss\xEDvel gerar o c\xF3digo QR.",qr_error_no_url:"Nenhum URL do HA configurado. Defina um URL externo ou interno em Defini\xE7\xF5es \u2192 Sistema \u2192 Rede.",save_error:"Erro ao guardar. Tente novamente.",qr_print:"Imprimir",qr_download:"Transferir SVG",qr_action:"A\xE7\xE3o ao digitalizar",qr_action_view:"Ver informa\xE7\xF5es de manuten\xE7\xE3o",qr_action_complete:"Marcar manuten\xE7\xE3o como conclu\xEDda",qr_url_mode:"Tipo de liga\xE7\xE3o",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"URL do servidor",overview:"Vis\xE3o geral",analysis:"An\xE1lise",recent_activities:"Atividades recentes",search_notes:"Pesquisar notas",avg_cost:"\xD8 Custo",no_advanced_features:"Sem fun\xE7\xF5es avan\xE7adas ativadas",no_advanced_features_hint:"Ative \u201CIntervalos Adaptativos\u201D ou \u201CPadr\xF5es Sazonais\u201D nas defini\xE7\xF5es da integra\xE7\xE3o para ver dados de an\xE1lise aqui.",analysis_not_enough_data:"Ainda n\xE3o h\xE1 dados suficientes para a an\xE1lise.",analysis_not_enough_data_hint:"A an\xE1lise Weibull requer pelo menos 5 manuten\xE7\xF5es conclu\xEDdas; os padr\xF5es sazonais tornam-se vis\xEDveis ap\xF3s 6+ pontos de dados por m\xEAs.",analysis_manual_task_hint:"Tarefas manuais sem intervalo n\xE3o geram dados de an\xE1lise.",completions:"conclus\xF5es",current:"Atual",shorter:"Mais curto",longer:"Mais longo",normal:"Normal",disabled:"Desativado",compound_logic:"L\xF3gica composta",card_title:"T\xEDtulo",card_show_header:"Mostrar cabe\xE7alho com estat\xEDsticas",card_show_actions:"Mostrar bot\xF5es de a\xE7\xE3o",card_compact:"Modo compacto",card_max_items:"M\xE1x. itens (0 = todos)",card_filter_status:"Filtrar por estado",card_filter_status_help:"Vazio = mostrar todos os estados.",card_filter_objects:"Filtrar por objetos",card_filter_objects_help:"Vazio = mostrar todos os objetos.",card_filter_entities:"Filtrar por entidades (entity_ids)",card_filter_entities_help:"Selecione entidades sensor / binary_sensor desta integra\xE7\xE3o. Vazio = todas.",card_loading_objects:"A carregar objetos\u2026",card_load_error:"N\xE3o foi poss\xEDvel carregar os objetos \u2014 verifique a liga\xE7\xE3o WebSocket.",card_no_tasks_title:"Ainda sem tarefas de manuten\xE7\xE3o",card_no_tasks_cta:"\u2192 Crie uma no painel Manuten\xE7\xE3o",no_objects:"Ainda sem objetos.",action_error:"A\xE7\xE3o falhada. Tente novamente.",area_id_optional:"\xC1rea (opcional)",installation_date_optional:"Data de instala\xE7\xE3o (opcional)",custom_icon_optional:"\xCDcone (opcional, ex. mdi:wrench)",task_enabled:"Tarefa ativada",skip_reason_prompt:"Saltar esta tarefa?",reason_optional:"Motivo (opcional)",reset_date_prompt:"Marcar tarefa como executada?",reset_date_optional:"Data da \xFAltima execu\xE7\xE3o (opcional, padr\xE3o: hoje)",notes_label:"Notas",documentation_label:"Documenta\xE7\xE3o",no_nfc_tag:"\u2014 Sem etiqueta \u2014",dashboard:"Painel",settings:"Defini\xE7\xF5es",settings_features:"Fun\xE7\xF5es avan\xE7adas",settings_features_desc:"Ative ou desative fun\xE7\xF5es avan\xE7adas. Desativar oculta-as da interface mas n\xE3o elimina dados.",feat_adaptive:"Agendamento adaptativo",feat_adaptive_desc:"Aprender intervalos ideais a partir do hist\xF3rico de manuten\xE7\xE3o",feat_predictions:"Previs\xF5es do sensor",feat_predictions_desc:"Prever datas de acionamento pela degrada\xE7\xE3o do sensor",feat_seasonal:"Ajustes sazonais",feat_seasonal_desc:"Ajustar intervalos com base em padr\xF5es sazonais",feat_environmental:"Correla\xE7\xE3o ambiental",feat_environmental_desc:"Correlacionar intervalos com temperatura/humidade",feat_budget:"Controlo de or\xE7amento",feat_budget_desc:"Acompanhar despesas de manuten\xE7\xE3o mensais e anuais",feat_groups:"Grupos de tarefas",feat_groups_desc:"Organizar tarefas em grupos l\xF3gicos",feat_checklists:"Listas de verifica\xE7\xE3o",feat_checklists_desc:"Procedimentos com v\xE1rios passos para conclus\xE3o de tarefas",settings_general:"Geral",settings_default_warning:"Dias de aviso predefinidos",settings_panel_enabled:"Painel lateral",settings_panel_title:"T\xEDtulo do painel lateral",settings_notifications:"Notifica\xE7\xF5es",settings_notify_service:"Servi\xE7o de notifica\xE7\xE3o",test_notification:"Notifica\xE7\xE3o de teste",send_test:"Enviar teste",testing:"A enviar\u2026",test_notification_success:"Notifica\xE7\xE3o de teste enviada",test_notification_failed:"Falha na notifica\xE7\xE3o de teste",settings_notify_due_soon:"Notificar quando pr\xF3xima",settings_notify_overdue:"Notificar quando atrasada",settings_notify_triggered:"Notificar quando acionada",settings_interval_hours:"Intervalo de repeti\xE7\xE3o (horas, 0 = uma vez)",settings_quiet_hours:"Horas de sil\xEAncio",settings_quiet_start:"In\xEDcio",settings_quiet_end:"Fim",settings_max_per_day:"M\xE1x. notifica\xE7\xF5es por dia (0 = ilimitado)",settings_bundling:"Agrupar notifica\xE7\xF5es",settings_bundle_threshold:"Limiar de agrupamento",settings_actions:"Bot\xF5es de a\xE7\xE3o m\xF3veis",settings_action_complete:"Mostrar bot\xE3o 'Conclu\xEDda'",settings_action_skip:"Mostrar bot\xE3o 'Saltar'",settings_action_snooze:"Mostrar bot\xE3o 'Adiar'",settings_snooze_hours:"Dura\xE7\xE3o do adiamento (horas)",settings_budget:"Or\xE7amento",settings_currency:"Moeda",settings_budget_monthly:"Or\xE7amento mensal",settings_budget_yearly:"Or\xE7amento anual",settings_budget_alerts:"Alertas de or\xE7amento",settings_budget_threshold:"Limiar de alerta (%)",settings_import_export:"Importar / Exportar",settings_export_json:"Exportar JSON",settings_export_yaml:"Exportar YAML",settings_export_csv:"Exportar CSV",settings_import_csv:"Importar CSV",settings_import_placeholder:"Cole o conte\xFAdo JSON ou CSV aqui\u2026",settings_import_btn:"Importar",settings_import_success:"{count} objetos importados com sucesso.",settings_export_success:"Exporta\xE7\xE3o transferida.",settings_saved:"Defini\xE7\xE3o guardada.",settings_include_history:"Incluir hist\xF3rico",sort_alphabetical:"Alfab\xE9tico",sort_due_soonest:"Vencimento mais pr\xF3ximo",sort_task_count:"Quantidade de tarefas",sort_area:"\xC1rea",sort_assigned_user:"Usu\xE1rio atribu\xEDdo",sort_group:"Grupo",filter_label:"Filtro",user_label:"Utilizador",sort_label:"Ordenar",group_by_label:"Agrupar por",state_value_help:'Use o valor de estado HA (normalmente em min\xFAsculas, p. ex. "on"/"off"). As mai\xFAsculas s\xE3o normalizadas ao guardar.',target_changes_help:"N\xFAmero de transi\xE7\xF5es correspondentes antes do trigger disparar (predefinido: 1).",qr_print_title:"Imprimir c\xF3digos QR",qr_print_desc:"Gera uma p\xE1gina imprim\xEDvel de c\xF3digos QR para recortar e colar nos equipamentos.",qr_print_load:"Carregar objetos",qr_print_filter:"Filtro",qr_print_objects:"Objetos",qr_print_actions:"A\xE7\xF5es",qr_print_url_mode:"Tipo de link",qr_print_estimate:"C\xF3digos QR estimados",qr_print_over_limit:"m\xE1ximo 200, restrinja o filtro",qr_print_generate:"Gerar c\xF3digos QR",qr_print_generating:"A gerar\u2026",qr_print_ready:"C\xF3digos QR prontos",qr_print_print_button:"Imprimir",qr_print_empty:"Nada a gerar",qr_action_skip:"Saltar",vacation_title:"Modo de f\xE9rias",vacation_active:"ativo",vacation_ended:"terminado",vacation_desc:"Planeia as tuas f\xE9rias: as notifica\xE7\xF5es s\xE3o pausadas durante o per\xEDodo mais dias de margem. Podes manter exce\xE7\xF5es por tarefa.",vacation_enable:"Ativar modo de f\xE9rias",vacation_start:"In\xEDcio",vacation_end:"Fim",vacation_buffer:"Margem (dias)",vacation_exempt_title:"Notificar mesmo em f\xE9rias",vacation_exempt_desc:"Escolhe tarefas que devem notificar mesmo em f\xE9rias (p. ex. qu\xEDmica cr\xEDtica de piscina).",vacation_load_tasks:"Carregar tarefas",vacation_preview_btn:"Mostrar pr\xE9-visualiza\xE7\xE3o",vacation_preview_affected:"tarefas afetadas",vacation_event_due_soon:"ficar\xE1 pr\xF3xima do prazo",vacation_event_overdue:"ficar\xE1 em atraso",vacation_event_triggered_est:"poss\xEDvel disparo do sensor",vacation_sensor_based:"(baseado em sensor)",vacation_action_notify:"Notificar mesmo assim",vacation_action_unsilence:"Silenciar novamente",vacation_marked_complete:"Marcado como conclu\xEDdo",vacation_marked_skip:"Saltado",vacation_end_now:"Terminar f\xE9rias agora",groupby_none:"Sem agrupamento",groupby_area:"Por \xE1rea",groupby_group:"Por grupo",groupby_user:"Por usu\xE1rio",unassigned:"N\xE3o atribu\xEDdo",no_area:"Sem \xE1rea",has_overdue:"Tarefas em atraso",object:"Objeto",settings_panel_access:"Acesso ao painel",settings_panel_access_desc:"Administradores sempre veem o painel completo. Selecione aqui usu\xE1rios n\xE3o administradores que tamb\xE9m devem ter acesso completo \u2014 os demais s\xF3 veem Concluir e Ignorar.",no_non_admin_users:"Nenhum usu\xE1rio n\xE3o administrador encontrado. Adicione em Configura\xE7\xF5es \u2192 Pessoas.",owner_label:"Propriet\xE1rio",feat_completion_actions:"A\xE7\xF5es de conclus\xE3o",feat_completion_actions_desc:"A\xE7\xE3o HA por tarefa ao concluir + QR de conclus\xE3o r\xE1pida com valores predefinidos.",on_complete_action_title:"Na conclus\xE3o: acionar a\xE7\xE3o HA (opcional)",on_complete_action_desc:"Chama um servi\xE7o HA quando a tarefa \xE9 conclu\xEDda \u2014 p. ex. reiniciar um contador no dispositivo.",on_complete_action_service:"Servi\xE7o",on_complete_action_target:"Entidade alvo",on_complete_action_data:"Dados (JSON, opcional)",on_complete_action_test:"Testar a\xE7\xE3o",on_complete_action_test_success:"Sucesso",on_complete_action_test_failed:"Falhou",quick_complete_defaults_title:"Valores predefinidos de conclus\xE3o r\xE1pida (para scans QR, opcional)",quick_complete_defaults_desc:"Valores predefinidos para QR de conclus\xE3o r\xE1pida. Sem eles, o QR abre o di\xE1logo.",quick_complete_defaults_notes:"Notas",quick_complete_defaults_cost:"Custo",quick_complete_defaults_duration:"Dura\xE7\xE3o (minutos)",quick_complete_defaults_feedback_none:"Sem feedback",quick_complete_defaults_feedback_needed:"Era necess\xE1rio",quick_complete_defaults_feedback_not_needed:"N\xE3o era necess\xE1rio",quick_complete_success:"Conclu\xEDdo rapidamente",trigger_replaced:"Acionador substitu\xEDdo",add:"Adicionar",show_stats:"Mostrar estat\xEDsticas + gr\xE1ficos",hide_stats:"Ocultar estat\xEDsticas",adaptive_no_data:"Ainda n\xE3o h\xE1 hist\xF3rico de conclus\xF5es suficiente para a an\xE1lise adaptativa. Conclua esta tarefa mais algumas vezes para desbloquear as recomenda\xE7\xF5es de intervalo e os gr\xE1ficos de fiabilidade.",suggestion_applied:"Intervalo sugerido aplicado",vacation_mode:"Modo de f\xE9rias",vacation_status_active:"Ativo agora",vacation_status_scheduled:"Agendado",vacation_status_inactive:"Inativo",vacation_end_now_confirm:"Terminar as f\xE9rias imediatamente?",vacation_exempt_count:"isentas",vacation_advanced:"Avan\xE7ado\u2026",vacation_open_panel:"Abrir no painel",enable:"Ativar",saved:"Guardado",budget_monthly_set:"Definir mensal",budget_yearly_set:"Definir anual",budget_advanced:"Moeda, alertas\u2026",budget_open_panel:"Abrir no painel",groups_empty:"Ainda sem grupos.",group_new_placeholder:"Adicionar grupo\u2026",group_delete_confirm:'Eliminar o grupo "{name}"?',groups_manage_tasks:"Gerir atribui\xE7\xF5es de tarefas\u2026",groups_open_panel:"Abrir no painel",on_complete_action_target_hint:"Nota: o dom\xEDnio da entidade tem de corresponder ao servi\xE7o \u2014 p. ex. 'button.press' s\xF3 funciona em button.*, 'counter.increment' s\xF3 em counter.*, 'input_button.press' s\xF3 em input_button.* etc. Em caso de incompatibilidade, a a\xE7\xE3o falha silenciosamente (o HA regista 'Referenced entities ... missing or not currently available').",show_all_objects:"Mostrar todos os objetos",show_all_tasks:"Limpar filtro \u2014 mostrar todas as tarefas",filter_to_overdue:"Filtrar a lista apenas para em atraso",filter_to_due_soon:"Filtrar a lista apenas para a vencer em breve",filter_to_triggered:"Filtrar a lista apenas para acionadas",open_task:"Abrir tarefa",show_details:"Mostrar hist\xF3rico + estat\xEDsticas",hide_details:"Ocultar detalhes",history_empty:"Ainda sem hist\xF3rico.",history_edit_button:"Editar entrada",total_cost:"Custo total",times_performed:"Realizada",older_entries:"mais antigas",open_in_panel:"Abrir no painel Manuten\xE7\xE3o",skip_reason:"Motivo para saltar (opcional)",reset_to_date:"Repor \xFAltima execu\xE7\xE3o para",delete_task_confirm:"Eliminar esta tarefa e o seu hist\xF3rico?",delete_object_confirm:"Eliminar este objeto e todas as suas tarefas?",loading:"A carregar\u2026"},Ea={maintenance:"\u041E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",objects:"\u041E\u0431'\u0454\u043A\u0442\u0438",tasks:"\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F",overdue:"\u041F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u043E",due_soon:"\u041D\u0435\u0437\u0430\u0431\u0430\u0440\u043E\u043C",triggered:"\u0421\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043B\u043E",ok:"\u041D\u043E\u0440\u043C\u0430",all:"\u0412\u0441\u0456",new_object:"+ \u041D\u043E\u0432\u0438\u0439 \u043E\u0431'\u0454\u043A\u0442",edit:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438",delete:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438",add_task:"+ \u0414\u043E\u0434\u0430\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",complete:"\u0412\u0438\u043A\u043E\u043D\u0430\u0442\u0438",completed:"\u0412\u0438\u043A\u043E\u043D\u0430\u043D\u043E",skip:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438",skipped:"\u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E",reset:"\u0421\u043A\u0438\u043D\u0443\u0442\u0438",cancel:"\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438",completing:"\u0412\u0438\u043A\u043E\u043D\u0443\u0454\u0442\u044C\u0441\u044F\u2026",interval:"\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B",warning:"\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F",last_performed:"\u041E\u0441\u0442\u0430\u043D\u043D\u0454 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F",next_due:"\u041D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0442\u0435\u0440\u043C\u0456\u043D",days_until_due:"\u0414\u043D\u0456\u0432 \u0434\u043E \u0442\u0435\u0440\u043C\u0456\u043D\u0443",avg_duration:"\u0421\u0435\u0440. \u0442\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C",trigger:"\u0422\u0440\u0438\u0433\u0435\u0440",trigger_type:"\u0422\u0438\u043F \u0442\u0440\u0438\u0433\u0435\u0440\u0430",threshold_above:"\u0412\u0435\u0440\u0445\u043D\u044F \u043C\u0435\u0436\u0430",threshold_below:"\u041D\u0438\u0436\u043D\u044F \u043C\u0435\u0436\u0430",threshold:"\u041F\u043E\u0440\u0456\u0433",counter:"\u041B\u0456\u0447\u0438\u043B\u044C\u043D\u0438\u043A",state_change:"\u0417\u043C\u0456\u043D\u0430 \u0441\u0442\u0430\u043D\u0443",runtime:"\u041D\u0430\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F",runtime_hours:"\u0426\u0456\u043B\u044C\u043E\u0432\u0435 \u043D\u0430\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F (\u0433\u043E\u0434\u0438\u043D\u0438)",target_value:"\u0426\u0456\u043B\u044C\u043E\u0432\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",baseline:"\u0411\u0430\u0437\u043E\u0432\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",target_changes:"\u0426\u0456\u043B\u044C\u043E\u0432\u0430 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0437\u043C\u0456\u043D",for_minutes:"\u041F\u0440\u043E\u0442\u044F\u0433\u043E\u043C (\u0445\u0432\u0438\u043B\u0438\u043D)",time_based:"\u0417\u0430 \u0447\u0430\u0441\u043E\u043C",sensor_based:"\u0417\u0430 \u0441\u0435\u043D\u0441\u043E\u0440\u043E\u043C",manual:"\u0412\u0440\u0443\u0447\u043D\u0443",one_time:"\u041E\u0434\u043D\u043E\u0440\u0430\u0437\u043E\u0432\u043E",weekdays:"\u0414\u043D\u0456 \u0442\u0438\u0436\u043D\u044F",nth_weekday:"N-\u0439 \u0434\u0435\u043D\u044C \u0442\u0438\u0436\u043D\u044F \u0432 \u043C\u0456\u0441\u044F\u0446\u0456",day_of_month:"\u0414\u0435\u043D\u044C \u043C\u0456\u0441\u044F\u0446\u044F",recurrence_on_days:"\u041F\u043E\u0432\u0442\u043E\u0440\u044E\u0432\u0430\u0442\u0438 \u0443",recurrence_occurrence:"\u0412\u0445\u043E\u0434\u0436\u0435\u043D\u043D\u044F",recurrence_weekday:"\u0414\u0435\u043D\u044C \u0442\u0438\u0436\u043D\u044F",recurrence_day:"\u0414\u0435\u043D\u044C \u043C\u0456\u0441\u044F\u0446\u044F (1\u201331)",ord_1:"1-\u0439",ord_2:"2-\u0439",ord_3:"3-\u0439",ord_4:"4-\u0439",ord_5:"5-\u0439",ord_last:"\u041E\u0441\u0442\u0430\u043D\u043D\u0456\u0439",day_word:"\u0414\u0435\u043D\u044C",interval_value:"\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B",interval_unit:"\u041E\u0434\u0438\u043D\u0438\u0446\u044F",unit_days:"\u0414\u043D\u0456",unit_weeks:"\u0422\u0438\u0436\u043D\u0456",unit_months:"\u041C\u0456\u0441\u044F\u0446\u0456",unit_years:"\u0420\u043E\u043A\u0438",due_date:"\u0414\u0430\u0442\u0430 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F",cleaning:"\u041E\u0447\u0438\u0449\u0435\u043D\u043D\u044F",inspection:"\u041E\u0433\u043B\u044F\u0434",replacement:"\u0417\u0430\u043C\u0456\u043D\u0430",calibration:"\u041A\u0430\u043B\u0456\u0431\u0440\u0443\u0432\u0430\u043D\u043D\u044F",service:"\u0421\u0435\u0440\u0432\u0456\u0441",custom:"\u0412\u043B\u0430\u0441\u043D\u0438\u0439",history:"\u0406\u0441\u0442\u043E\u0440\u0456\u044F",cost:"\u0412\u0430\u0440\u0442\u0456\u0441\u0442\u044C",duration:"\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C",both:"\u041E\u0431\u0438\u0434\u0432\u0430",trigger_val:"\u0417\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0442\u0440\u0438\u0433\u0435\u0440\u0430",complete_title:"\u0412\u0438\u043A\u043E\u043D\u0430\u0442\u0438: ",checklist:"\u0427\u0435\u043A\u043B\u0456\u0441\u0442",checklist_steps_optional:"\u041A\u0440\u043E\u043A\u0438 \u0447\u0435\u043A\u043B\u0456\u0441\u0442\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",checklist_placeholder:`\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0444\u0456\u043B\u044C\u0442\u0440
\u0417\u0430\u043C\u0456\u043D\u0438\u0442\u0438 \u0443\u0449\u0456\u043B\u044C\u043D\u044E\u0432\u0430\u0447
\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0438\u0442\u0438 \u0442\u0438\u0441\u043A`,checklist_help:"\u041E\u0434\u0438\u043D \u043A\u0440\u043E\u043A \u043D\u0430 \u0440\u044F\u0434\u043E\u043A. \u041C\u0430\u043A\u0441. 100 \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432.",err_too_long:"{field}: \u0437\u0430\u0434\u043E\u0432\u0433\u0435 (\u043C\u0430\u043A\u0441. {n} \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432)",err_too_short:"{field}: \u0437\u0430\u043A\u043E\u0440\u043E\u0442\u043A\u0435 (\u043C\u0456\u043D. {n} \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432)",err_value_too_high:"{field}: \u0437\u0430\u0432\u0435\u043B\u0438\u043A\u0435 (\u043C\u0430\u043A\u0441. {n})",err_value_too_low:"{field}: \u0437\u0430\u043C\u0430\u043B\u0435 (\u043C\u0456\u043D. {n})",err_required:"{field}: \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435 \u043F\u043E\u043B\u0435",err_wrong_type:"{field}: \u043D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0442\u0438\u043F (\u043E\u0447\u0456\u043A\u0443\u0432\u0430\u043B\u043E\u0441\u044C: {type})",err_invalid_choice:"{field}: \u043D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",err_invalid_value:"{field}: \u043D\u0435\u0432\u0456\u0440\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",feat_schedule_time:"\u041F\u043B\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u044F \u0437\u0430 \u0447\u0430\u0441\u043E\u043C \u0434\u043E\u0431\u0438",feat_schedule_time_desc:"\u0417\u0430\u0434\u0430\u0447\u0456 \u0441\u0442\u0430\u044E\u0442\u044C \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u0438\u043C\u0438 \u0443 \u043F\u0435\u0432\u043D\u0438\u0439 \u0447\u0430\u0441 \u0434\u043E\u0431\u0438, \u0430 \u043D\u0435 \u043E\u043F\u0456\u0432\u043D\u043E\u0447\u0456.",schedule_time_optional:"\u0427\u0430\u0441 \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u043D\u044F (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E, HH:MM)",schedule_time_help:"\u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u043E\u043F\u0456\u0432\u043D\u043E\u0447\u0456 (\u0437\u0430 \u0437\u0430\u043C\u043E\u0432\u0447\u0443\u0432\u0430\u043D\u043D\u044F\u043C). \u0427\u0430\u0441\u043E\u0432\u0438\u0439 \u043F\u043E\u044F\u0441 HA.",at_time:"\u043E",notes_optional:"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0438 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",cost_optional:"\u0412\u0430\u0440\u0442\u0456\u0441\u0442\u044C (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",duration_minutes:"\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C \u0443 \u0445\u0432\u0438\u043B\u0438\u043D\u0430\u0445 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",days:"\u0434\u043D\u0456\u0432",day:"\u0434\u0435\u043D\u044C",today:"\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456",d_overdue:"\u0434 \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u043E",no_tasks:"\u0417\u0430\u0432\u0434\u0430\u043D\u044C \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F \u0449\u0435 \u043D\u0435\u043C\u0430\u0454. \u0421\u0442\u0432\u043E\u0440\u0456\u0442\u044C \u043E\u0431'\u0454\u043A\u0442, \u0449\u043E\u0431 \u043F\u043E\u0447\u0430\u0442\u0438.",no_tasks_short:"\u041D\u0435\u043C\u0430\u0454 \u0437\u0430\u0432\u0434\u0430\u043D\u044C",no_history:"\u0417\u0430\u043F\u0438\u0441\u0456\u0432 \u0432 \u0456\u0441\u0442\u043E\u0440\u0456\u0457 \u0449\u0435 \u043D\u0435\u043C\u0430\u0454.",show_all:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456",cost_duration_chart:"\u0412\u0430\u0440\u0442\u0456\u0441\u0442\u044C \u0456 \u0442\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C",installed:"\u0412\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E",confirm_delete_object:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0446\u0435\u0439 \u043E\u0431'\u0454\u043A\u0442 \u0456 \u0432\u0441\u0456 \u0439\u043E\u0433\u043E \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F?",confirm_delete_task:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0446\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F?",min:"\u041C\u0456\u043D",max:"\u041C\u0430\u043A\u0441",save:"\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438",saving:"\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F\u2026",edit_task:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",new_task:"\u041D\u043E\u0432\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",task_name:"\u041D\u0430\u0437\u0432\u0430 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",maintenance_type:"\u0422\u0438\u043F \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",schedule_type:"\u0422\u0438\u043F \u0440\u043E\u0437\u043A\u043B\u0430\u0434\u0443",interval_days:"\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B (\u0434\u043D\u0456)",warning_days:"\u0414\u043D\u0456\u0432 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F",interval_anchor:"\u041F\u0440\u0438\u0432'\u044F\u0437\u043A\u0430 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0443",anchor_completion:"\u0412\u0456\u0434 \u0434\u0430\u0442\u0438 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F",anchor_planned:"\u0412\u0456\u0434 \u0437\u0430\u043F\u043B\u0430\u043D\u043E\u0432\u0430\u043D\u043E\u0457 \u0434\u0430\u0442\u0438 (\u0431\u0435\u0437 \u0437\u043C\u0456\u0449\u0435\u043D\u043D\u044F)",edit_object:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u043E\u0431'\u0454\u043A\u0442",name:"\u041D\u0430\u0437\u0432\u0430",manufacturer_optional:"\u0412\u0438\u0440\u043E\u0431\u043D\u0438\u043A (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",model_optional:"\u041C\u043E\u0434\u0435\u043B\u044C (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",serial_number_optional:"\u0421\u0435\u0440\u0456\u0439\u043D\u0438\u0439 \u043D\u043E\u043C\u0435\u0440 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",serial_number_label:"\u0421/\u041D",documentation_url_label:"\u041F\u043E\u0441\u0456\u0431\u043D\u0438\u043A",object_notes_label:"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0438",last_performed_optional:"\u041E\u0441\u0442\u0430\u043D\u043D\xE9 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",sort_due_date:"\u0414\u0430\u0442\u0430 \u0442\u0435\u0440\u043C\u0456\u043D\u0443",sort_object:"\u041D\u0430\u0437\u0432\u0430 \u043E\u0431'\u0454\u043A\u0442\u0430",sort_type:"\u0422\u0438\u043F",sort_task_name:"\u041D\u0430\u0437\u0432\u0430 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",all_objects:"\u0412\u0441\u0456 \u043E\u0431'\u0454\u043A\u0442\u0438",tasks_lower:"\u0437\u0430\u0432\u0434\u0430\u043D\u044C",no_tasks_yet:"\u0417\u0430\u0432\u0434\u0430\u043D\u044C \u0449\u0435 \u043D\u0435\u043C\u0430\u0454",add_first_task:"\u0414\u043E\u0434\u0430\u0442\u0438 \u043F\u0435\u0440\u0448\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",trigger_configuration:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0442\u0440\u0438\u0433\u0435\u0440\u0430",entity_id:"ID \u043E\u0431'\u0454\u043A\u0442\u0430",comma_separated:"\u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443",entity_logic:"\u041B\u043E\u0433\u0456\u043A\u0430 \u043E\u0431'\u0454\u043A\u0442\u0456\u0432",entity_logic_any:"\u0411\u0443\u0434\u044C-\u044F\u043A\u0438\u0439 \u043E\u0431'\u0454\u043A\u0442 \u0441\u043F\u0440\u0430\u0446\u044C\u043E\u0432\u0443\u0454",entity_logic_all:"\u0412\u0441\u0456 \u043E\u0431'\u0454\u043A\u0442\u0438 \u043C\u0430\u044E\u0442\u044C \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0442\u0438",entities:"\u043E\u0431'\u0454\u043A\u0442\u0456\u0432",attribute_optional:"\u0410\u0442\u0440\u0438\u0431\u0443\u0442 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E, \u043F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u0441\u0442\u0430\u043D)",use_entity_state:"\u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0432\u0430\u0442\u0438 \u0441\u0442\u0430\u043D \u043E\u0431'\u0454\u043A\u0442\u0430 (\u0431\u0435\u0437 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430)",trigger_above:"\u0421\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0442\u0438, \u043A\u043E\u043B\u0438 \u0432\u0438\u0449\u0435",trigger_below:"\u0421\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u0442\u0438, \u043A\u043E\u043B\u0438 \u043D\u0438\u0436\u0447\u0435",for_at_least_minutes:"\u041F\u0440\u043E\u0442\u044F\u0433\u043E\u043C \u043D\u0435 \u043C\u0435\u043D\u0448\u0435 (\u0445\u0432\u0438\u043B\u0438\u043D)",safety_interval_days:"\u0421\u0442\u0440\u0430\u0445\u043E\u0432\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B (\u0434\u043D\u0456, \u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",safety_interval:"\u0421\u0442\u0440\u0430\u0445\u043E\u0432\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",delta_mode:"\u0420\u0435\u0436\u0438\u043C \u0434\u0435\u043B\u044C\u0442\u0438",from_state_optional:"\u0417 \u0441\u0442\u0430\u043D\u0443 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",to_state_optional:"\u0414\u043E \u0441\u0442\u0430\u043D\u0443 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",documentation_url_optional:"URL \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0456\u0457 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",object_notes_optional:"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0438 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",nfc_tag_id_optional:"ID NFC-\u0442\u0435\u0433\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",nfc_tags_empty_help:"\u0423 Home Assistant \u0449\u0435 \u043D\u0435 \u0437\u0430\u0440\u0435\u0454\u0441\u0442\u0440\u043E\u0432\u0430\u043D\u043E NFC-\u0442\u0435\u0433\u0438.",nfc_tags_open_settings:"\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0442\u0435\u0433\u0456\u0432",nfc_tags_refresh:"\u041E\u043D\u043E\u0432\u0438\u0442\u0438",environmental_entity_optional:"\u0414\u0430\u0442\u0447\u0438\u043A \u043D\u0430\u0432\u043A\u043E\u043B\u0438\u0448\u043D\u044C\u043E\u0433\u043E \u0441\u0435\u0440\u0435\u0434\u043E\u0432\u0438\u0449\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",environmental_entity_helper:"\u043D\u0430\u043F\u0440. sensor.outdoor_temperature \u2014 \u043A\u043E\u0440\u0438\u0433\u0443\u0454 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u043D\u043E \u0434\u043E \u0443\u043C\u043E\u0432 \u043D\u0430\u0432\u043A\u043E\u043B\u0438\u0448\u043D\u044C\u043E\u0433\u043E \u0441\u0435\u0440\u0435\u0434\u043E\u0432\u0438\u0449\u0430",environmental_attribute_optional:"\u0410\u0442\u0440\u0438\u0431\u0443\u0442 \u0441\u0435\u0440\u0435\u0434\u043E\u0432\u0438\u0449\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",nfc_tag_id:"ID NFC-\u0442\u0435\u0433\u0430",nfc_linked:"NFC-\u0442\u0435\u0433 \u043F\u0440\u0438\u0432'\u044F\u0437\u0430\u043D\u043E",nfc_link_hint:"\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C, \u0449\u043E\u0431 \u043F\u0440\u0438\u0432'\u044F\u0437\u0430\u0442\u0438 NFC-\u0442\u0435\u0433",responsible_user:"\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u043B\u044C\u043D\u0438\u0439 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447",no_user_assigned:"(\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u043D\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043E)",all_users:"\u0412\u0441\u0456 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456",my_tasks:"\u041C\u043E\u0457 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",tab_calendar:"\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440",cal_no_events:"\u0411\u0435\u0437 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",cal_window_7:"7 \u0434\u043D\u0456\u0432",cal_window_14:"14 \u0434\u043D\u0456\u0432",cal_window_30:"30 \u0434\u043D\u0456\u0432",cal_window_365:"1 \u0440\u0456\u043A",cal_every_n_days:"\u043A\u043E\u0436\u043D\u0456 {n} \u0434\u043D\u0456\u0432",cal_source_time:"\u0417\u0430 \u0447\u0430\u0441\u043E\u043C",cal_source_time_adaptive:"\u0417\u0430 \u0447\u0430\u0441\u043E\u043C (\u0430\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u043E)",cal_source_sensor:"\u0417\u0430 \u0434\u0430\u0442\u0447\u0438\u043A\u043E\u043C",cal_predicted:"\u043F\u0440\u043E\u0433\u043D\u043E\u0437",cal_confidence_high:"\u0432\u0438\u0441\u043E\u043A\u0430 \u043D\u0430\u0434\u0456\u0439\u043D\u0456\u0441\u0442\u044C",cal_confidence_medium:"\u0441\u0435\u0440\u0435\u0434\u043D\u044F \u043D\u0430\u0434\u0456\u0439\u043D\u0456\u0441\u0442\u044C",cal_confidence_low:"\u043D\u0438\u0437\u044C\u043A\u0430 \u043D\u0430\u0434\u0456\u0439\u043D\u0456\u0441\u0442\u044C",budget_monthly:"\u0429\u043E\u043C\u0456\u0441\u044F\u0447\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",budget_yearly:"\u0429\u043E\u0440\u0456\u0447\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",groups:"\u0413\u0440\u0443\u043F\u0438",new_group:"\u041D\u043E\u0432\u0430 \u0433\u0440\u0443\u043F\u0430",edit_group:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0433\u0440\u0443\u043F\u0443",no_groups:"\u0413\u0440\u0443\u043F \u0449\u0435 \u043D\u0435\u043C\u0430\u0454",delete_group:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0433\u0440\u0443\u043F\u0443",delete_group_confirm:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0433\u0440\u0443\u043F\u0443 '{name}'?",group_select_tasks:"\u041E\u0431\u0440\u0430\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",group_name_required:"\u041F\u043E\u0442\u0440\u0456\u0431\u043D\u0430 \u043D\u0430\u0437\u0432\u0430",description_optional:"\u041E\u043F\u0438\u0441 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",selected:"\u041E\u0431\u0440\u0430\u043D\u043E",loading_chart:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0434\u0430\u043D\u0438\u0445 \u0433\u0440\u0430\u0444\u0456\u043A\u0430...",was_maintenance_needed:"\u0427\u0438 \u0431\u0443\u043B\u043E \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0435 \u0446\u0435 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F?",feedback_needed:"\u041F\u043E\u0442\u0440\u0456\u0431\u043D\u0435",feedback_not_needed:"\u041D\u0435 \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0435",feedback_not_sure:"\u041D\u0435 \u0432\u043F\u0435\u0432\u043D\u0435\u043D\u0438\u0439",suggested_interval:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B",apply_suggestion:"\u0417\u0430\u0441\u0442\u043E\u0441\u0443\u0432\u0430\u0442\u0438",reanalyze:"\u041F\u043E\u0432\u0442\u043E\u0440\u043D\u043E \u043F\u0440\u043E\u0430\u043D\u0430\u043B\u0456\u0437\u0443\u0432\u0430\u0442\u0438",reanalyze_result:"\u041D\u043E\u0432\u0438\u0439 \u0430\u043D\u0430\u043B\u0456\u0437",reanalyze_insufficient_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u0434\u0430\u043D\u0438\u0445 \u0434\u043B\u044F \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0456\u0457",data_points:"\u0442\u043E\u0447\u043E\u043A \u0434\u0430\u043D\u0438\u0445",dismiss_suggestion:"\u0412\u0456\u0434\u0445\u0438\u043B\u0438\u0442\u0438",confidence_low:"\u041D\u0438\u0437\u044C\u043A\u0430",confidence_medium:"\u0421\u0435\u0440\u0435\u0434\u043D\u044F",confidence_high:"\u0412\u0438\u0441\u043E\u043A\u0430",recommended:"\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u043E",seasonal_awareness:"\u0421\u0435\u0437\u043E\u043D\u043D\u0430 \u043A\u043E\u0440\u0435\u043A\u0446\u0456\u044F",edit_seasonal_overrides:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0441\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442\u0438",seasonal_overrides_title:"\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442\u0438 (\u043F\u0435\u0440\u0435\u0432\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F)",seasonal_overrides_hint:"\u041A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442 \u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C (0.1\u20135.0). \u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E.",seasonal_override_invalid:"\u041D\u0435\u0434\u0456\u0439\u0441\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",seasonal_override_range:"\u041A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u043C\u0456\u0436 0.1 \u0442\u0430 5.0",clear_all:"\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0432\u0441\u0435",seasonal_chart_title:"\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442\u0438",seasonal_learned:"\u041D\u0430\u0432\u0447\u0435\u043D\u0430",seasonal_manual:"\u0420\u0443\u0447\u043D\u0430",month_jan:"\u0421\u0456\u0447",month_feb:"\u041B\u044E\u0442",month_mar:"\u0411\u0435\u0440",month_apr:"\u041A\u0432\u0456",month_may:"\u0422\u0440\u0430",month_jun:"\u0427\u0435\u0440",month_jul:"\u041B\u0438\u043F",month_aug:"\u0421\u0435\u0440",month_sep:"\u0412\u0435\u0440",month_oct:"\u0416\u043E\u0432",month_nov:"\u041B\u0438\u0441",month_dec:"\u0413\u0440\u0443",sensor_prediction:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u0441\u0435\u043D\u0441\u043E\u0440\u0430",degradation_trend:"\u0422\u0440\u0435\u043D\u0434",trend_rising:"\u0417\u0440\u043E\u0441\u0442\u0430\u0454",trend_falling:"\u0421\u043F\u0430\u0434\u0430\u0454",trend_stable:"\u0421\u0442\u0430\u0431\u0456\u043B\u044C\u043D\u0438\u0439",trend_insufficient_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u0434\u0430\u043D\u0438\u0445",days_until_threshold:"\u0414\u043D\u0456\u0432 \u0434\u043E \u043F\u043E\u0440\u043E\u0433\u0443",threshold_exceeded:"\u041F\u043E\u0440\u0456\u0433 \u043F\u0435\u0440\u0435\u0432\u0438\u0449\u0435\u043D\u043E",environmental_adjustment:"\u0415\u043A\u043E\u043B\u043E\u0433\u0456\u0447\u043D\u0438\u0439 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442",sensor_prediction_urgency:"\u0421\u0435\u043D\u0441\u043E\u0440 \u043F\u0440\u043E\u0433\u043D\u043E\u0437\u0443\u0454 \u0434\u043E\u0441\u044F\u0433\u043D\u0435\u043D\u043D\u044F \u043F\u043E\u0440\u043E\u0433\u0443 \u0447\u0435\u0440\u0435\u0437 ~{days} \u0434\u043D\u0456\u0432",day_short:"\u0434\u0435\u043D\u044C",weibull_reliability_curve:"\u041A\u0440\u0438\u0432\u0430 \u043D\u0430\u0434\u0456\u0439\u043D\u043E\u0441\u0442\u0456",weibull_failure_probability:"\u0419\u043C\u043E\u0432\u0456\u0440\u043D\u0456\u0441\u0442\u044C \u0432\u0456\u0434\u043C\u043E\u0432\u0438",weibull_r_squared:"\u0422\u043E\u0447\u043D\u0456\u0441\u0442\u044C R\xB2",beta_early_failures:"\u0420\u0430\u043D\u043D\u0456 \u0432\u0456\u0434\u043C\u043E\u0432\u0438",beta_random_failures:"\u0412\u0438\u043F\u0430\u0434\u043A\u043E\u0432\u0456 \u0432\u0456\u0434\u043C\u043E\u0432\u0438",beta_wear_out:"\u0417\u043D\u043E\u0441",beta_highly_predictable:"\u0414\u0443\u0436\u0435 \u043F\u0435\u0440\u0435\u0434\u0431\u0430\u0447\u0443\u0432\u0430\u043D\u0438\u0439",confidence_interval:"\u0414\u043E\u0432\u0456\u0440\u0447\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B",confidence_conservative:"\u041A\u043E\u043D\u0441\u0435\u0440\u0432\u0430\u0442\u0438\u0432\u043D\u0438\u0439",confidence_aggressive:"\u041E\u043F\u0442\u0438\u043C\u0456\u0441\u0442\u0438\u0447\u043D\u0438\u0439",current_interval_marker:"\u041F\u043E\u0442\u043E\u0447\u043D\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B",recommended_marker:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u043E\u0432\u0430\u043D\u043E",characteristic_life:"\u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u0447\u043D\u0438\u0439 \u0440\u0435\u0441\u0443\u0440\u0441",chart_mini_sparkline:"\u041C\u0456\u043D\u0456\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u0433\u0440\u0430\u0444\u0456\u043A \u0442\u0440\u0435\u043D\u0434\u0443",chart_history:"\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u0432\u0430\u0440\u0442\u043E\u0441\u0442\u0456 \u0442\u0430 \u0442\u0440\u0438\u0432\u0430\u043B\u043E\u0441\u0442\u0456",chart_seasonal:"\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0435\u0444\u0456\u0446\u0456\u0454\u043D\u0442\u0438, 12 \u043C\u0456\u0441\u044F\u0446\u0456\u0432",chart_weibull:"\u041A\u0440\u0438\u0432\u0430 \u043D\u0430\u0434\u0456\u0439\u043D\u043E\u0441\u0442\u0456 \u0412\u0435\u0439\u0431\u0443\u043B\u043B\u0430",chart_sparkline:"\u0413\u0440\u0430\u0444\u0456\u043A \u0437\u043D\u0430\u0447\u0435\u043D\u044C \u0442\u0440\u0438\u0433\u0435\u0440\u0430 \u0441\u0435\u043D\u0441\u043E\u0440\u0430",days_progress:"\u041F\u0440\u043E\u0433\u0440\u0435\u0441 \u0434\u043D\u0456\u0432",qr_code:"QR-\u043A\u043E\u0434",qr_generating:"\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0456\u044F QR-\u043A\u043E\u0434\u0443\u2026",qr_error:"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0433\u0435\u043D\u0435\u0440\u0443\u0432\u0430\u0442\u0438 QR-\u043A\u043E\u0434.",qr_error_no_url:"URL Home Assistant \u043D\u0435 \u043D\u0430\u043B\u0430\u0448\u0442\u043E\u0432\u0430\u043D\u043E. \u0417\u0430\u0434\u0430\u0439\u0442\u0435 \u0437\u043E\u0432\u043D\u0456\u0448\u043D\u044E \u0430\u0431\u043E \u0432\u043D\u0443\u0442\u0440\u0456\u0448\u043D\u044E URL-\u0430\u0434\u0440\u0435\u0441\u0443 \u0432 \u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u2192 \u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u2192 \u041C\u0435\u0440\u0435\u0436\u0430.",save_error:"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0431\u0435\u0440\u0435\u0433\u0442\u0438. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.",qr_print:"\u0414\u0440\u0443\u043A\u0443\u0432\u0430\u0442\u0438",qr_download:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 SVG",qr_action:"\u0414\u0456\u044F \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456",qr_action_view:"\u041F\u0435\u0440\u0435\u0433\u043B\u044F\u043D\u0443\u0442\u0438",qr_action_complete:"\u041F\u043E\u0437\u043D\u0430\u0447\u0438\u0442\u0438 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u0438\u043C",qr_url_mode:"\u0422\u0438\u043F \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F",qr_mode_companion:"Companion App",qr_mode_local:"\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u0438\u0439 (mDNS)",qr_mode_server:"URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430",overview:"\u041E\u0433\u043B\u044F\u0434",analysis:"\u0410\u043D\u0430\u043B\u0456\u0437",recent_activities:"\u041E\u0441\u0442\u0430\u043D\u043D\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u0456\u0441\u0442\u044C",search_notes:"\u041F\u043E\u0448\u0443\u043A \u0443 \u043F\u0440\u0438\u043C\u0456\u0442\u043A\u0430\u0445",avg_cost:"\u0421\u0435\u0440. \u0432\u0430\u0440\u0442\u0456\u0441\u0442\u044C",no_advanced_features:"\u0420\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0456 \u0444\u0443\u043D\u043A\u0446\u0456\u0457 \u043D\u0435 \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",no_advanced_features_hint:"\u0423\u0432\u0456\u043C\u043A\u043D\u0456\u0442\u044C \xAB\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u0456 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438\xBB \u0430\u0431\u043E \xAB\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u0437\u0430\u043A\u043E\u043D\u043E\u043C\u0456\u0440\u043D\u043E\u0441\u0442\u0456\xBB \u0432 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F\u0445 \u0456\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0456\u0457, \u0449\u043E\u0431 \u043F\u043E\u0431\u0430\u0447\u0438\u0442\u0438 \u0442\u0443\u0442 \u0434\u0430\u043D\u0456 \u0430\u043D\u0430\u043B\u0456\u0437\u0443.",analysis_not_enough_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u0434\u0430\u043D\u0438\u0445 \u0434\u043B\u044F \u0430\u043D\u0430\u043B\u0456\u0437\u0443.",analysis_not_enough_data_hint:"\u0410\u043D\u0430\u043B\u0456\u0437 \u0412\u0435\u0439\u0431\u0443\u043B\u043B\u0430 \u043F\u043E\u0442\u0440\u0435\u0431\u0443\u0454 \u0449\u043E\u043D\u0430\u0439\u043C\u0435\u043D\u0448\u0435 5 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u0438\u0445 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u044C; \u0441\u0435\u0437\u043E\u043D\u043D\u0456 \u0437\u0430\u043A\u043E\u043D\u043E\u043C\u0456\u0440\u043D\u043E\u0441\u0442\u0456 \u0441\u0442\u0430\u044E\u0442\u044C \u0432\u0438\u0434\u0438\u043C\u0438\u043C\u0438 \u043F\u0456\u0441\u043B\u044F 6+ \u0437\u0430\u043F\u0438\u0441\u0456\u0432 \u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C.",analysis_manual_task_hint:"\u0420\u0443\u0447\u043D\u0456 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0431\u0435\u0437 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0443 \u043D\u0435 \u0433\u0435\u043D\u0435\u0440\u0443\u044E\u0442\u044C \u0434\u0430\u043D\u0456 \u0430\u043D\u0430\u043B\u0456\u0437\u0443.",completions:"\u0432\u0438\u043A\u043E\u043D\u0430\u043D\u044C",current:"\u041F\u043E\u0442\u043E\u0447\u043D\u0438\u0439",shorter:"\u041A\u043E\u0440\u043E\u0442\u0448\u0438\u0439",longer:"\u0414\u043E\u0432\u0448\u0438\u0439",normal:"\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0438\u0439",disabled:"\u0412\u0438\u043C\u043A\u043D\u0435\u043D\u043E",compound_logic:"\u0421\u043A\u043B\u0430\u0434\u0435\u043D\u0430 \u043B\u043E\u0433\u0456\u043A\u0430",card_title:"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",card_show_header:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0437\u0456 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u043E\u044E",card_show_actions:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043A\u043D\u043E\u043F\u043A\u0438 \u0434\u0456\u0439",card_compact:"\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u0438\u0439 \u0440\u0435\u0436\u0438\u043C",card_max_items:"\u041C\u0430\u043A\u0441. \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432 (0 = \u0432\u0441\u0456)",card_filter_status:"\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u0437\u0430 \u0441\u0442\u0430\u0442\u0443\u0441\u043E\u043C",card_filter_status_help:"\u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456 \u0441\u0442\u0430\u0442\u0443\u0441\u0438.",card_filter_objects:"\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u0437\u0430 \u043E\u0431'\u0454\u043A\u0442\u0430\u043C\u0438",card_filter_objects_help:"\u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456 \u043E\u0431'\u0454\u043A\u0442\u0438.",card_filter_entities:"\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u0437\u0430 \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u044F\u043C\u0438 (entity_ids)",card_filter_entities_help:"\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u0456 sensor / binary_sensor \u0437 \u0446\u0456\u0454\u0457 \u0456\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0456\u0457. \u041F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u0432\u0441\u0456.",card_loading_objects:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u043E\u0431'\u0454\u043A\u0442\u0456\u0432\u2026",card_load_error:"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u043E\u0431'\u0454\u043A\u0442\u0438 \u2014 \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 WebSocket-\u0437'\u0454\u0434\u043D\u0430\u043D\u043D\u044F.",card_no_tasks_title:"\u041F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454 \u0437\u0430\u0432\u0434\u0430\u043D\u044C \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",card_no_tasks_cta:"\u2192 \u0421\u0442\u0432\u043E\u0440\u0456\u0442\u044C \u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0456 Maintenance",no_objects:"\u041F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454 \u043E\u0431'\u0454\u043A\u0442\u0456\u0432.",action_error:"\u0414\u0456\u044F \u043D\u0435 \u0432\u0434\u0430\u043B\u0430\u0441\u044C. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.",area_id_optional:"\u0417\u043E\u043D\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",installation_date_optional:"\u0414\u0430\u0442\u0430 \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",custom_icon_optional:"\u0406\u043A\u043E\u043D\u043A\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E, \u043D\u0430\u043F\u0440\u0438\u043A\u043B\u0430\u0434 mdi:wrench)",task_enabled:"\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",skip_reason_prompt:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438 \u0446\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F?",reason_optional:"\u041F\u0440\u0438\u0447\u0438\u043D\u0430 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",reset_date_prompt:"\u041F\u043E\u0437\u043D\u0430\u0447\u0438\u0442\u0438 \u044F\u043A \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u0435?",reset_date_optional:"\u0414\u0430\u0442\u0430 \u043E\u0441\u0442\u0430\u043D\u043D\u044C\u043E\u0433\u043E \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E, \u0442\u0438\u043F\u043E\u0432\u043E: \u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456)",notes_label:"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0438",documentation_label:"\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0456\u044F",no_nfc_tag:"\u2014 \u0411\u0435\u0437 \u0442\u0435\u0433\u0430 \u2014",dashboard:"\u0414\u0430\u0448\u0431\u043E\u0440\u0434",settings:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",settings_features:"\u0420\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0456 \u0444\u0443\u043D\u043A\u0446\u0456\u0457",settings_features_desc:"\u0423\u0432\u0456\u043C\u043A\u043D\u0456\u0442\u044C \u0430\u0431\u043E \u0432\u0438\u043C\u043A\u043D\u0456\u0442\u044C \u0440\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0456 \u0444\u0443\u043D\u043A\u0446\u0456\u0457. \u0412\u0438\u043C\u043A\u043D\u0435\u043D\u043D\u044F \u043F\u0440\u0438\u0445\u043E\u0432\u0443\u0454 \u0457\u0445 \u0437 \u0456\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0443, \u0430\u043B\u0435 \u043D\u0435 \u0432\u0438\u0434\u0430\u043B\u044F\u0454 \u0434\u0430\u043D\u0456.",feat_adaptive:"\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u0435 \u043F\u043B\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u044F",feat_adaptive_desc:"\u041D\u0430\u0432\u0447\u0430\u0442\u0438\u0441\u044F \u043E\u043F\u0442\u0438\u043C\u0430\u043B\u044C\u043D\u0438\u043C \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430\u043C \u0437 \u0456\u0441\u0442\u043E\u0440\u0456\u0457 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",feat_predictions:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437\u0438 \u0437\u0430 \u0441\u0435\u043D\u0441\u043E\u0440\u0430\u043C\u0438",feat_predictions_desc:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437\u0443\u0432\u0430\u0442\u0438 \u0434\u0430\u0442\u0438 \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F \u0437\u0430 \u0434\u0435\u0433\u0440\u0430\u0434\u0430\u0446\u0456\u0454\u044E \u0441\u0435\u043D\u0441\u043E\u0440\u0430",feat_seasonal:"\u0421\u0435\u0437\u043E\u043D\u043D\u0456 \u043A\u043E\u0440\u0435\u043A\u0446\u0456\u0457",feat_seasonal_desc:"\u041A\u043E\u0440\u0438\u0433\u0443\u0432\u0430\u0442\u0438 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0456 \u0441\u0435\u0437\u043E\u043D\u043D\u0438\u0445 \u0437\u0430\u043A\u043E\u043D\u043E\u043C\u0456\u0440\u043D\u043E\u0441\u0442\u0435\u0439",feat_environmental:"\u041A\u043E\u0440\u0435\u043B\u044F\u0446\u0456\u044F \u0437 \u0434\u043E\u0432\u043A\u0456\u043B\u043B\u044F\u043C",feat_environmental_desc:"\u041A\u043E\u0440\u0435\u043B\u044E\u0432\u0430\u0442\u0438 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438 \u0437 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u043E\u044E/\u0432\u043E\u043B\u043E\u0433\u0456\u0441\u0442\u044E",feat_budget:"\u0412\u0456\u0434\u0441\u0442\u0435\u0436\u0435\u043D\u043D\u044F \u0431\u044E\u0434\u0436\u0435\u0442\u0443",feat_budget_desc:"\u0412\u0456\u0434\u0441\u0442\u0435\u0436\u0443\u0432\u0430\u0442\u0438 \u0449\u043E\u043C\u0456\u0441\u044F\u0447\u043D\u0456 \u0442\u0430 \u0449\u043E\u0440\u0456\u0447\u043D\u0456 \u0432\u0438\u0442\u0440\u0430\u0442\u0438 \u043D\u0430 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",feat_groups:"\u0413\u0440\u0443\u043F\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u044C",feat_groups_desc:"\u041E\u0440\u0433\u0430\u043D\u0456\u0437\u043E\u0432\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0432 \u043B\u043E\u0433\u0456\u0447\u043D\u0456 \u0433\u0440\u0443\u043F\u0438",feat_checklists:"\u0427\u0435\u043A\u043B\u0456\u0441\u0442\u0438",feat_checklists_desc:"\u0411\u0430\u0433\u0430\u0442\u043E\u043A\u0440\u043E\u043A\u043E\u0432\u0456 \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u0438 \u0434\u043B\u044F \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F \u0437\u0430\u0432\u0434\u0430\u043D\u044C",settings_general:"\u0417\u0430\u0433\u0430\u043B\u044C\u043D\u0435",settings_default_warning:"\u0414\u043D\u0456\u0432 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F \u0437\u0430 \u0437\u0430\u043C\u043E\u0432\u0447\u0443\u0432\u0430\u043D\u043D\u044F\u043C",settings_panel_enabled:"\u041F\u0430\u043D\u0435\u043B\u044C \u0443 \u0431\u0456\u0447\u043D\u043E\u043C\u0443 \u043C\u0435\u043D\u044E",settings_panel_title:"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043F\u0430\u043D\u0435\u043B\u0456",settings_notifications:"\u0421\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",settings_notify_service:"\u0421\u043B\u0443\u0436\u0431\u0430 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u044C",test_notification:"\u0422\u0435\u0441\u0442\u043E\u0432\u0435 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",send_test:"\u041D\u0430\u0434\u0456\u0441\u043B\u0430\u0442\u0438 \u0442\u0435\u0441\u0442",testing:"\u041D\u0430\u0434\u0441\u0438\u043B\u0430\u043D\u043D\u044F\u2026",test_notification_success:"\u0422\u0435\u0441\u0442\u043E\u0432\u0435 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F \u043D\u0430\u0434\u0456\u0441\u043B\u0430\u043D\u043E",test_notification_failed:"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u043D\u0430\u0434\u0456\u0441\u043B\u0430\u0442\u0438 \u0442\u0435\u0441\u0442\u043E\u0432\u0435 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",settings_notify_due_soon:"\u0421\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438, \u043A\u043E\u043B\u0438 \u0442\u0435\u0440\u043C\u0456\u043D \u043D\u0430\u0431\u043B\u0438\u0436\u0430\u0454\u0442\u044C\u0441\u044F",settings_notify_overdue:"\u0421\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438 \u043F\u0440\u043E \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u043D\u044F",settings_notify_triggered:"\u0421\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438 \u043F\u0440\u043E \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F",settings_interval_hours:"\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u043D\u044F (\u0433\u043E\u0434\u0438\u043D\u0438, 0 = \u043E\u0434\u043D\u043E\u0440\u0430\u0437\u043E\u0432\u043E)",settings_quiet_hours:"\u0422\u0438\u0445\u0456 \u0433\u043E\u0434\u0438\u043D\u0438",settings_quiet_start:"\u041F\u043E\u0447\u0430\u0442\u043E\u043A",settings_quiet_end:"\u041A\u0456\u043D\u0435\u0446\u044C",settings_max_per_day:"\u041C\u0430\u043A\u0441. \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u044C \u043D\u0430 \u0434\u0435\u043D\u044C (0 = \u0431\u0435\u0437 \u043E\u0431\u043C\u0435\u0436\u0435\u043D\u044C)",settings_bundling:"\u0413\u0440\u0443\u043F\u0443\u0432\u0430\u0442\u0438 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",settings_bundle_threshold:"\u041F\u043E\u0440\u0456\u0433 \u0433\u0440\u0443\u043F\u0443\u0432\u0430\u043D\u043D\u044F",settings_actions:"\u041A\u043D\u043E\u043F\u043A\u0438 \u0434\u0456\u0439 \u0443 \u043C\u043E\u0431\u0456\u043B\u044C\u043D\u0438\u0445 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F\u0445",settings_action_complete:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u0412\u0438\u043A\u043E\u043D\u0430\u0442\u0438\xBB",settings_action_skip:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438\xBB",settings_action_snooze:"\u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u0412\u0456\u0434\u043A\u043B\u0430\u0441\u0442\u0438\xBB",settings_snooze_hours:"\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C \u0432\u0456\u0434\u043A\u043B\u0430\u0434\u0435\u043D\u043D\u044F (\u0433\u043E\u0434\u0438\u043D\u0438)",settings_budget:"\u0411\u044E\u0434\u0436\u0435\u0442",settings_currency:"\u0412\u0430\u043B\u044E\u0442\u0430",settings_budget_monthly:"\u0429\u043E\u043C\u0456\u0441\u044F\u0447\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_yearly:"\u0429\u043E\u0440\u0456\u0447\u043D\u0438\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_alerts:"\u0421\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F \u043F\u0440\u043E \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_threshold:"\u041F\u043E\u0440\u0456\u0433 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F (%)",settings_import_export:"\u0406\u043C\u043F\u043E\u0440\u0442 / \u0415\u043A\u0441\u043F\u043E\u0440\u0442",settings_export_json:"\u0415\u043A\u0441\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438 JSON",settings_export_yaml:"\u0415\u043A\u0441\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438 YAML",settings_export_csv:"\u0415\u043A\u0441\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438 CSV",settings_import_csv:"\u0406\u043C\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438 CSV",settings_import_placeholder:"\u0412\u0441\u0442\u0430\u0432\u0442\u0435 \u0432\u043C\u0456\u0441\u0442 JSON \u0430\u0431\u043E CSV \u0441\u044E\u0434\u0438\u2026",settings_import_btn:"\u0406\u043C\u043F\u043E\u0440\u0442\u0443\u0432\u0430\u0442\u0438",settings_import_success:"{count} \u043E\u0431'\u0454\u043A\u0442\u0456\u0432 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0456\u043C\u043F\u043E\u0440\u0442\u043E\u0432\u0430\u043D\u043E.",settings_export_success:"\u0415\u043A\u0441\u043F\u043E\u0440\u0442 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043E.",settings_saved:"\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E.",settings_include_history:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0438 \u0456\u0441\u0442\u043E\u0440\u0456\u044E",sort_alphabetical:"\u0417\u0430 \u0430\u043B\u0444\u0430\u0432\u0456\u0442\u043E\u043C",sort_due_soonest:"\u041D\u0430\u0439\u0431\u043B\u0438\u0436\u0447\u0438\u0439 \u0442\u0435\u0440\u043C\u0456\u043D",sort_task_count:"\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0437\u0430\u0432\u0434\u0430\u043D\u044C",sort_area:"\u0417\u043E\u043D\u0430",sort_assigned_user:"\u041F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447",sort_group:"\u0413\u0440\u0443\u043F\u0430",groupby_none:"\u0411\u0435\u0437 \u0433\u0440\u0443\u043F\u0443\u0432\u0430\u043D\u043D\u044F",groupby_area:"\u0417\u0430 \u0437\u043E\u043D\u043E\u044E",groupby_group:"\u0417\u0430 \u0433\u0440\u0443\u043F\u043E\u044E",groupby_user:"\u0417\u0430 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0435\u043C",filter_label:"\u0424\u0456\u043B\u044C\u0442\u0440",user_label:"\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447",sort_label:"\u0421\u043E\u0440\u0442\u0443\u0432\u0430\u043D\u043D\u044F",group_by_label:"\u0413\u0440\u0443\u043F\u0443\u0432\u0430\u0442\u0438 \u0437\u0430",state_value_help:'\u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0439\u0442\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0441\u0442\u0430\u043D\u0443 HA (\u0437\u0430\u0437\u0432\u0438\u0447\u0430\u0439 \u0443 \u043D\u0438\u0436\u043D\u044C\u043E\u043C\u0443 \u0440\u0435\u0433\u0456\u0441\u0442\u0440\u0456, \u043D\u0430\u043F\u0440. "on"/"off"). \u0420\u0435\u0433\u0456\u0441\u0442\u0440 \u043D\u043E\u0440\u043C\u0430\u043B\u0456\u0437\u0443\u0454\u0442\u044C\u0441\u044F \u043F\u0440\u0438 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u0456.',target_changes_help:"\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u043D\u0438\u0445 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0456\u0432, \u043F\u0456\u0441\u043B\u044F \u044F\u043A\u0438\u0445 \u0442\u0440\u0438\u0433\u0435\u0440 \u0441\u043F\u0440\u0430\u0446\u044E\u0454 (\u0437\u0430 \u0437\u0430\u043C\u043E\u0432\u0447\u0443\u0432\u0430\u043D\u043D\u044F\u043C: 1).",qr_print_title:"\u0414\u0440\u0443\u043A\u0443\u0432\u0430\u0442\u0438 QR-\u043A\u043E\u0434\u0438",qr_print_desc:"\u0421\u0442\u0432\u043E\u0440\u0438 \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0443 \u0434\u043B\u044F \u0434\u0440\u0443\u043A\u0443 \u0437 QR-\u043A\u043E\u0434\u0430\u043C\u0438, \u044F\u043A\u0456 \u043C\u043E\u0436\u043D\u0430 \u0432\u0438\u0440\u0456\u0437\u0430\u0442\u0438 \u0442\u0430 \u043D\u0430\u043A\u043B\u0435\u0457\u0442\u0438 \u043D\u0430 \u043E\u0431\u043B\u0430\u0434\u043D\u0430\u043D\u043D\u044F.",qr_print_load:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u043E\u0431'\u0454\u043A\u0442\u0438",qr_print_filter:"\u0424\u0456\u043B\u044C\u0442\u0440",qr_print_objects:"\u041E\u0431'\u0454\u043A\u0442\u0438",qr_print_actions:"\u0414\u0456\u0457",qr_print_url_mode:"\u0422\u0438\u043F \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F",qr_print_estimate:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437 QR-\u043A\u043E\u0434\u0456\u0432",qr_print_over_limit:"\u043B\u0456\u043C\u0456\u0442 200, \u0437\u0432\u0443\u0437\u044C \u0444\u0456\u043B\u044C\u0442\u0440",qr_print_generate:"\u0421\u0442\u0432\u043E\u0440\u0438\u0442\u0438 QR-\u043A\u043E\u0434\u0438",qr_print_generating:"\u0421\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F\u2026",qr_print_ready:"QR-\u043A\u043E\u0434\u0438 \u0433\u043E\u0442\u043E\u0432\u0456",qr_print_print_button:"\u0414\u0440\u0443\u043A\u0443\u0432\u0430\u0442\u0438",qr_print_empty:"\u041D\u0456\u0447\u043E\u0433\u043E \u0441\u0442\u0432\u043E\u0440\u044E\u0432\u0430\u0442\u0438",qr_action_skip:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438",vacation_title:"\u0420\u0435\u0436\u0438\u043C \u0432\u0456\u0434\u043F\u0443\u0441\u0442\u043A\u0438",vacation_active:"\u0430\u043A\u0442\u0438\u0432\u043D\u0438\u0439",vacation_ended:"\u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E",vacation_desc:"\u0421\u043F\u043B\u0430\u043D\u0443\u0439 \u0432\u0456\u0434\u043F\u0443\u0441\u0442\u043A\u0443: \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F \u043F\u0440\u0438\u0437\u0443\u043F\u0438\u043D\u044F\u044E\u0442\u044C\u0441\u044F \u043D\u0430 \u043F\u0435\u0440\u0456\u043E\u0434 \u043F\u043B\u044E\u0441 \u043A\u0456\u043B\u044C\u043A\u0430 \u0431\u0443\u0444\u0435\u0440\u043D\u0438\u0445 \u0434\u043D\u0456\u0432. \u041C\u043E\u0436\u043D\u0430 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u0442\u0438 \u0432\u0438\u043D\u044F\u0442\u043A\u0438.",vacation_enable:"\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u0440\u0435\u0436\u0438\u043C \u0432\u0456\u0434\u043F\u0443\u0441\u0442\u043A\u0438",vacation_start:"\u041F\u043E\u0447\u0430\u0442\u043E\u043A",vacation_end:"\u041A\u0456\u043D\u0435\u0446\u044C",vacation_buffer:"\u0411\u0443\u0444\u0435\u0440 (\u0434\u043D\u0456\u0432)",vacation_exempt_title:"\u0421\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438 \u043F\u043E\u043F\u0440\u0438 \u0432\u0456\u0434\u043F\u0443\u0441\u0442\u043A\u0443",vacation_exempt_desc:"\u041E\u0431\u0435\u0440\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F, \u044F\u043A\u0456 \u043C\u0430\u044E\u0442\u044C \u0441\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438 \u043D\u0430\u0432\u0456\u0442\u044C \u043F\u0456\u0434 \u0447\u0430\u0441 \u0432\u0456\u0434\u043F\u0443\u0441\u0442\u043A\u0438 (\u043D\u0430\u043F\u0440\u0438\u043A\u043B\u0430\u0434, \u043A\u0440\u0438\u0442\u0438\u0447\u043D\u0430 \u0445\u0456\u043C\u0456\u044F \u0431\u0430\u0441\u0435\u0439\u043D\u0443).",vacation_load_tasks:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",vacation_preview_btn:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u0439 \u043F\u0435\u0440\u0435\u0433\u043B\u044F\u0434",vacation_preview_affected:"\u0437\u0430\u0432\u0434\u0430\u043D\u044C \u0437\u0430\u0447\u0435\u043F\u043B\u0435\u043D\u043E",vacation_event_due_soon:"\u043D\u0430\u0431\u043B\u0438\u0436\u0430\u0454\u0442\u044C\u0441\u044F \u0442\u0435\u0440\u043C\u0456\u043D",vacation_event_overdue:"\u0441\u0442\u0430\u043D\u0435 \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u0438\u043C",vacation_event_triggered_est:"\u043C\u043E\u0436\u043B\u0438\u0432\u0435 \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F \u0441\u0435\u043D\u0441\u043E\u0440\u0430",vacation_sensor_based:"(\u0441\u0435\u043D\u0441\u043E\u0440\u043D\u0435)",vacation_action_notify:"\u0421\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438 \u0432\u0441\u0435 \u043E\u0434\u043D\u043E",vacation_action_unsilence:"\u0417\u043D\u043E\u0432\u0443 \u0432\u0438\u043C\u043A\u043D\u0443\u0442\u0438 \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F",vacation_marked_complete:"\u041F\u043E\u0437\u043D\u0430\u0447\u0435\u043D\u043E \u044F\u043A \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u0435",vacation_marked_skip:"\u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E",vacation_end_now:"\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0438 \u0432\u0456\u0434\u043F\u0443\u0441\u0442\u043A\u0443 \u0437\u0430\u0440\u0430\u0437",unassigned:"\u041D\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043E",no_area:"\u0411\u0435\u0437 \u0437\u043E\u043D\u0438",has_overdue:"\u041F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u0456 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",object:"\u041E\u0431'\u0454\u043A\u0442",settings_panel_access:"\u0414\u043E\u0441\u0442\u0443\u043F \u0434\u043E \u043F\u0430\u043D\u0435\u043B\u0456",settings_panel_access_desc:"\u0410\u0434\u043C\u0456\u043D\u0456\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0438 \u0437\u0430\u0432\u0436\u0434\u0438 \u0431\u0430\u0447\u0430\u0442\u044C \u043F\u043E\u0432\u043D\u0443 \u043F\u0430\u043D\u0435\u043B\u044C. \u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0442\u0443\u0442 \u043D\u0435-\u0430\u0434\u043C\u0456\u043D \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456\u0432, \u044F\u043A\u0456 \u0442\u0430\u043A\u043E\u0436 \u043F\u043E\u0432\u0438\u043D\u043D\u0456 \u043C\u0430\u0442\u0438 \u043F\u043E\u0432\u043D\u0438\u0439 \u0434\u043E\u0441\u0442\u0443\u043F \u2014 \u0456\u043D\u0448\u0456 \u0431\u0430\u0447\u0430\u0442\u044C \u043B\u0438\u0448\u0435 \u0412\u0438\u043A\u043E\u043D\u0430\u0442\u0438 \u0442\u0430 \u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u0438.",no_non_admin_users:"\u041D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043D\u0435-\u0430\u0434\u043C\u0456\u043D \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456\u0432. \u0414\u043E\u0434\u0430\u0439\u0442\u0435 \u0457\u0445 \u0443 \u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F\u0445 \u2192 \u041E\u0441\u043E\u0431\u0438.",owner_label:"\u0412\u043B\u0430\u0441\u043D\u0438\u043A",feat_completion_actions:"\u0414\u0456\u0457 \u043F\u0440\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u0456",feat_completion_actions_desc:"\u0414\u0456\u044F HA \u043F\u043E \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044E \u043F\u0440\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u0456 + QR \u0448\u0432\u0438\u0434\u043A\u043E\u0433\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F \u0437 \u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u044C\u043E \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u043C\u0438 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F\u043C\u0438.",on_complete_action_title:"\u041F\u0440\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u0456: \u0432\u0438\u043A\u043B\u0438\u043A\u0430\u0442\u0438 HA-\u0434\u0456\u044E (\u043E\u043F\u0446\u0456\u0439\u043D\u043E)",on_complete_action_desc:"\u0412\u0438\u043A\u043B\u0438\u043A\u0430\u0454 HA-\u0441\u0435\u0440\u0432\u0456\u0441, \u043A\u043E\u043B\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E \u2014 \u043D\u0430\u043F\u0440., \u0441\u043A\u0438\u043D\u0443\u0442\u0438 \u043B\u0456\u0447\u0438\u043B\u044C\u043D\u0438\u043A \u043D\u0430 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457.",on_complete_action_service:"\u0421\u0435\u0440\u0432\u0456\u0441",on_complete_action_target:"\u0426\u0456\u043B\u044C\u043E\u0432\u0430 \u0441\u0443\u0442\u043D\u0456\u0441\u0442\u044C",on_complete_action_data:"\u0414\u0430\u043D\u0456 (JSON, \u043E\u043F\u0446\u0456\u0439\u043D\u043E)",on_complete_action_test:"\u0422\u0435\u0441\u0442\u0443\u0432\u0430\u0442\u0438 \u0434\u0456\u044E",on_complete_action_test_success:"\u0423\u0441\u043F\u0456\u0445",on_complete_action_test_failed:"\u041F\u043E\u043C\u0438\u043B\u043A\u0430",quick_complete_defaults_title:"\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u0456 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0448\u0432\u0438\u0434\u043A\u043E\u0433\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F (\u0434\u043B\u044F QR-\u0441\u043A\u0430\u043D\u0456\u0432, \u043E\u043F\u0446\u0456\u0439\u043D\u043E)",quick_complete_defaults_desc:"\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u044C\u043E \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0456 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0434\u043B\u044F QR \u0448\u0432\u0438\u0434\u043A\u043E\u0433\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F. \u0411\u0435\u0437 \u043D\u0438\u0445 QR \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454 \u0434\u0456\u0430\u043B\u043E\u0433.",quick_complete_defaults_notes:"\u041D\u043E\u0442\u0430\u0442\u043A\u0438",quick_complete_defaults_cost:"\u0412\u0430\u0440\u0442\u0456\u0441\u0442\u044C",quick_complete_defaults_duration:"\u0422\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C (\u0445\u0432\u0438\u043B\u0438\u043D)",quick_complete_defaults_feedback_none:"\u0411\u0435\u0437 \u0437\u0432\u043E\u0440\u043E\u0442\u043D\u043E\u0433\u043E \u0437\u0432'\u044F\u0437\u043A\u0443",quick_complete_defaults_feedback_needed:"\u0411\u0443\u043B\u043E \u043D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u043E",quick_complete_defaults_feedback_not_needed:"\u041D\u0435 \u0431\u0443\u043B\u043E \u043D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u043E",quick_complete_success:"\u0428\u0432\u0438\u0434\u043A\u043E \u043F\u043E\u0437\u043D\u0430\u0447\u0435\u043D\u043E \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u0438\u043C",trigger_replaced:"\u0422\u0440\u0438\u0433\u0435\u0440 \u0437\u0430\u043C\u0456\u043D\u0435\u043D\u043E",add:"\u0414\u043E\u0434\u0430\u0442\u0438",show_stats:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443 + \u0433\u0440\u0430\u0444\u0456\u043A\u0438",hide_stats:"\u0421\u0445\u043E\u0432\u0430\u0442\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",adaptive_no_data:"\u041F\u043E\u043A\u0438 \u0449\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043D\u044C\u043E \u0456\u0441\u0442\u043E\u0440\u0456\u0457 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u044C \u0434\u043B\u044F \u0430\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u0430\u043D\u0430\u043B\u0456\u0437\u0443. \u0412\u0438\u043A\u043E\u043D\u0430\u0439\u0442\u0435 \u0446\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0449\u0435 \u043A\u0456\u043B\u044C\u043A\u0430 \u0440\u0430\u0437\u0456\u0432, \u0449\u043E\u0431 \u0440\u043E\u0437\u0431\u043B\u043E\u043A\u0443\u0432\u0430\u0442\u0438 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0456\u0457 \u0449\u043E\u0434\u043E \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0443 \u0442\u0430 \u0433\u0440\u0430\u0444\u0456\u043A\u0438 \u043D\u0430\u0434\u0456\u0439\u043D\u043E\u0441\u0442\u0456.",suggestion_applied:"\u0417\u0430\u043F\u0440\u043E\u043F\u043E\u043D\u043E\u0432\u0430\u043D\u0438\u0439 \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0437\u0430\u0441\u0442\u043E\u0441\u043E\u0432\u0430\u043D\u043E",vacation_mode:"\u0420\u0435\u0436\u0438\u043C \u0432\u0456\u0434\u043F\u0443\u0441\u0442\u043A\u0438",vacation_status_active:"\u0410\u043A\u0442\u0438\u0432\u043D\u0438\u0439 \u0437\u0430\u0440\u0430\u0437",vacation_status_scheduled:"\u0417\u0430\u043F\u043B\u0430\u043D\u043E\u0432\u0430\u043D\u043E",vacation_status_inactive:"\u041D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u0438\u0439",vacation_end_now_confirm:"\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0438 \u0432\u0456\u0434\u043F\u0443\u0441\u0442\u043A\u0443 \u043D\u0435\u0433\u0430\u0439\u043D\u043E?",vacation_exempt_count:"\u0432\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u043E",vacation_advanced:"\u0414\u043E\u0434\u0430\u0442\u043A\u043E\u0432\u043E\u2026",vacation_open_panel:"\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0456",enable:"\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438",saved:"\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E",budget_monthly_set:"\u0417\u0430\u0434\u0430\u0442\u0438 \u043C\u0456\u0441\u044F\u0447\u043D\u0438\u0439",budget_yearly_set:"\u0417\u0430\u0434\u0430\u0442\u0438 \u0440\u0456\u0447\u043D\u0438\u0439",budget_advanced:"\u0412\u0430\u043B\u044E\u0442\u0430, \u0441\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F\u2026",budget_open_panel:"\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0456",groups_empty:"\u041F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454 \u0433\u0440\u0443\u043F.",group_new_placeholder:"\u0414\u043E\u0434\u0430\u0442\u0438 \u0433\u0440\u0443\u043F\u0443\u2026",group_delete_confirm:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0433\u0440\u0443\u043F\u0443 \xAB{name}\xBB?",groups_manage_tasks:"\u041A\u0435\u0440\u0443\u0432\u0430\u043D\u043D\u044F \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F\u043C\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u044C\u2026",groups_open_panel:"\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0456",on_complete_action_target_hint:"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0430: \u0434\u043E\u043C\u0435\u043D \u0441\u0443\u0442\u043D\u043E\u0441\u0442\u0456 \u043C\u0430\u0454 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0442\u0438 \u0441\u0435\u0440\u0432\u0456\u0441\u0443 \u2014 \u043D\u0430\u043F\u0440. 'button.press' \u043F\u0440\u0430\u0446\u044E\u0454 \u043B\u0438\u0448\u0435 \u0437 button.*, 'counter.increment' \u043B\u0438\u0448\u0435 \u0437 counter.*, 'input_button.press' \u043B\u0438\u0448\u0435 \u0437 input_button.* \u0442\u043E\u0449\u043E. \u0423 \u0440\u0430\u0437\u0456 \u043D\u0435\u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u043D\u043E\u0441\u0442\u0456 \u0434\u0456\u044F \u043C\u043E\u0432\u0447\u043A\u0438 \u043D\u0435 \u0432\u0438\u043A\u043E\u043D\u0430\u0454\u0442\u044C\u0441\u044F (HA \u0437\u0430\u043F\u0438\u0448\u0435 \u0432 \u0436\u0443\u0440\u043D\u0430\u043B 'Referenced entities ... missing or not currently available').",show_all_objects:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456 \u043E\u0431'\u0454\u043A\u0442\u0438",show_all_tasks:"\u0421\u043A\u0438\u043D\u0443\u0442\u0438 \u0444\u0456\u043B\u044C\u0442\u0440 \u2014 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0432\u0441\u0456 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",filter_to_overdue:"\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u0441\u043F\u0438\u0441\u043E\u043A \u043B\u0438\u0448\u0435 \u0437\u0430 \u043F\u0440\u043E\u0441\u0442\u0440\u043E\u0447\u0435\u043D\u0438\u043C\u0438",filter_to_due_soon:"\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u0441\u043F\u0438\u0441\u043E\u043A \u043B\u0438\u0448\u0435 \u0437\u0430 \u0442\u0438\u043C\u0438, \u0449\u043E \u0441\u043A\u043E\u0440\u043E \u043D\u0430\u0441\u0442\u0430\u043D\u0443\u0442\u044C",filter_to_triggered:"\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u0441\u043F\u0438\u0441\u043E\u043A \u043B\u0438\u0448\u0435 \u0437\u0430 \u0441\u043F\u0440\u0430\u0446\u044C\u043E\u0432\u0430\u043D\u0438\u043C\u0438",open_task:"\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F",show_details:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0438 \u0456\u0441\u0442\u043E\u0440\u0456\u044E + \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",hide_details:"\u0421\u0445\u043E\u0432\u0430\u0442\u0438 \u0434\u0435\u0442\u0430\u043B\u0456",history_empty:"\u041F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454 \u0456\u0441\u0442\u043E\u0440\u0456\u0457.",history_edit_button:"\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u043F\u0438\u0441",total_cost:"\u0417\u0430\u0433\u0430\u043B\u044C\u043D\u0430 \u0432\u0430\u0440\u0442\u0456\u0441\u0442\u044C",times_performed:"\u0412\u0438\u043A\u043E\u043D\u0430\u043D\u043E",older_entries:"\u0440\u0430\u043D\u0456\u0448\u0435",open_in_panel:"\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0456 \u043E\u0431\u0441\u043B\u0443\u0433\u043E\u0432\u0443\u0432\u0430\u043D\u043D\u044F",skip_reason:"\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0443 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)",reset_to_date:"\u0421\u043A\u0438\u043D\u0443\u0442\u0438 \u043E\u0441\u0442\u0430\u043D\u043D\u0454 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F \u043D\u0430",delete_task_confirm:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0446\u0435 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F \u0442\u0430 \u0439\u043E\u0433\u043E \u0456\u0441\u0442\u043E\u0440\u0456\u044E?",delete_object_confirm:"\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0446\u0435\u0439 \u043E\u0431'\u0454\u043A\u0442 \u0456 \u0432\u0441\u0456 \u0439\u043E\u0433\u043E \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F?",loading:"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F\u2026"},Sa={maintenance:"\u041E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435",objects:"\u041E\u0431\u044A\u0435\u043A\u0442\u044B",tasks:"\u0417\u0430\u0434\u0430\u0447\u0438",overdue:"\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043E",due_soon:"\u0421\u043A\u043E\u0440\u043E",triggered:"\u0421\u0440\u0430\u0431\u043E\u0442\u0430\u043B\u043E",ok:"OK",all:"\u0412\u0441\u0435",new_object:"+ \u041D\u043E\u0432\u044B\u0439 \u043E\u0431\u044A\u0435\u043A\u0442",edit:"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C",delete:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C",add_task:"+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443",complete:"\u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C",completed:"\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E",skip:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C",skipped:"\u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E",reset:"\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C",cancel:"\u041E\u0442\u043C\u0435\u043D\u0430",completing:"\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435\u2026",interval:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",warning:"\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435",last_performed:"\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435",next_due:"\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0441\u0440\u043E\u043A",days_until_due:"\u0414\u043D\u0435\u0439 \u0434\u043E \u0441\u0440\u043E\u043A\u0430",avg_duration:"\u0421\u0440. \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",trigger:"\u0422\u0440\u0438\u0433\u0433\u0435\u0440",trigger_type:"\u0422\u0438\u043F \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u0430",threshold_above:"\u0412\u0435\u0440\u0445\u043D\u0438\u0439 \u043F\u0440\u0435\u0434\u0435\u043B",threshold_below:"\u041D\u0438\u0436\u043D\u0438\u0439 \u043F\u0440\u0435\u0434\u0435\u043B",threshold:"\u041F\u043E\u0440\u043E\u0433",counter:"\u0421\u0447\u0451\u0442\u0447\u0438\u043A",state_change:"\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F",runtime:"\u0412\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B",runtime_hours:"\u0426\u0435\u043B\u0435\u0432\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B (\u0447\u0430\u0441\u044B)",target_value:"\u0426\u0435\u043B\u0435\u0432\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",baseline:"\u0411\u0430\u0437\u043E\u0432\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",target_changes:"\u0426\u0435\u043B\u0435\u0432\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",for_minutes:"\u041D\u0430 (\u043C\u0438\u043D\u0443\u0442)",time_based:"\u041F\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438",sensor_based:"\u041F\u043E \u0434\u0430\u0442\u0447\u0438\u043A\u0443",manual:"\u0412\u0440\u0443\u0447\u043D\u0443\u044E",one_time:"\u041E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u043E",weekdays:"\u0414\u043D\u0438 \u043D\u0435\u0434\u0435\u043B\u0438",nth_weekday:"N-\u0439 \u0434\u0435\u043D\u044C \u043D\u0435\u0434\u0435\u043B\u0438 \u043C\u0435\u0441\u044F\u0446\u0430",day_of_month:"\u0414\u0435\u043D\u044C \u043C\u0435\u0441\u044F\u0446\u0430",recurrence_on_days:"\u041F\u043E\u0432\u0442\u043E\u0440\u044F\u0442\u044C \u0432",recurrence_occurrence:"\u0412\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0435",recurrence_weekday:"\u0414\u0435\u043D\u044C \u043D\u0435\u0434\u0435\u043B\u0438",recurrence_day:"\u0414\u0435\u043D\u044C \u043C\u0435\u0441\u044F\u0446\u0430 (1\u201331)",ord_1:"1-\u0439",ord_2:"2-\u0439",ord_3:"3-\u0439",ord_4:"4-\u0439",ord_5:"5-\u0439",ord_last:"\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439",day_word:"\u0414\u0435\u043D\u044C",interval_value:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",interval_unit:"\u0415\u0434\u0438\u043D\u0438\u0446\u0430",unit_days:"\u0414\u043D\u0438",unit_weeks:"\u041D\u0435\u0434\u0435\u043B\u0438",unit_months:"\u041C\u0435\u0441\u044F\u0446\u044B",unit_years:"\u0413\u043E\u0434\u044B",due_date:"\u0414\u0430\u0442\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F",cleaning:"\u0427\u0438\u0441\u0442\u043A\u0430",inspection:"\u041E\u0441\u043C\u043E\u0442\u0440",replacement:"\u0417\u0430\u043C\u0435\u043D\u0430",calibration:"\u041A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430",service:"\u0421\u0435\u0440\u0432\u0438\u0441",custom:"\u0421\u0432\u043E\u0451",history:"\u0418\u0441\u0442\u043E\u0440\u0438\u044F",cost:"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",duration:"\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",both:"\u041E\u0431\u0430",trigger_val:"\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u0430",complete_title:"\u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C: ",checklist:"\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",checklist_steps_optional:"\u0428\u0430\u0433\u0438 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)",checklist_placeholder:`\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440
\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u0443\u043F\u043B\u043E\u0442\u043D\u0438\u0442\u0435\u043B\u044C
\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0434\u0430\u0432\u043B\u0435\u043D\u0438\u0435`,checklist_help:"\u041E\u0434\u0438\u043D \u0448\u0430\u0433 \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0443. \u041C\u0430\u043A\u0441. 100 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432.",err_too_long:"{field}: \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0434\u043B\u0438\u043D\u043D\u043E (\u043C\u0430\u043A\u0441. {n} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)",err_too_short:"{field}: \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043A\u043E\u0440\u043E\u0442\u043A\u043E (\u043C\u0438\u043D. {n} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)",err_value_too_high:"{field}: \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0432\u0435\u043B\u0438\u043A\u043E (\u043C\u0430\u043A\u0441. {n})",err_value_too_low:"{field}: \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u043E (\u043C\u0438\u043D. {n})",err_required:"{field}: \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u043B\u0435",err_wrong_type:"{field}: \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0442\u0438\u043F (\u043E\u0436\u0438\u0434\u0430\u043B\u0441\u044F: {type})",err_invalid_choice:"{field}: \u043D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",err_invalid_value:"{field}: \u043D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",feat_schedule_time:"\u041F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0434\u043D\u044F",feat_schedule_time_desc:"\u0417\u0430\u0434\u0430\u0447\u0438 \u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0442\u0441\u044F \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043D\u044B\u043C\u0438 \u0432 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0451\u043D\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0434\u043D\u044F, \u0430 \u043D\u0435 \u0432 \u043F\u043E\u043B\u043D\u043E\u0447\u044C.",schedule_time_optional:"\u0421\u0440\u043E\u043A (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E, HH:MM)",schedule_time_help:"\u041F\u0443\u0441\u0442\u043E = \u043F\u043E\u043B\u043D\u043E\u0447\u044C (\u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E). \u0427\u0430\u0441\u043E\u0432\u043E\u0439 \u043F\u043E\u044F\u0441 HA.",at_time:"\u0432",notes_optional:"\u041F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u044F (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",cost_optional:"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",duration_minutes:"\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0432 \u043C\u0438\u043D\u0443\u0442\u0430\u0445 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",days:"\u0434\u043D\u0435\u0439",day:"\u0434\u0435\u043D\u044C",today:"\u0421\u0435\u0433\u043E\u0434\u043D\u044F",d_overdue:"\u0434\u043D. \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043E",no_tasks:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447 \u043F\u043E \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044E. \u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043E\u0431\u044A\u0435\u043A\u0442, \u0447\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C.",no_tasks_short:"\u041D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447",no_history:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0432 \u0438\u0441\u0442\u043E\u0440\u0438\u0438.",show_all:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435",cost_duration_chart:"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0438 \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",installed:"\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D",confirm_delete_object:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u043E\u0442 \u043E\u0431\u044A\u0435\u043A\u0442 \u0438 \u0432\u0441\u0435 \u0435\u0433\u043E \u0437\u0430\u0434\u0430\u0447\u0438?",confirm_delete_task:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u0443 \u0437\u0430\u0434\u0430\u0447\u0443?",min:"\u041C\u0438\u043D",max:"\u041C\u0430\u043A\u0441",save:"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",saving:"\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u2026",edit_task:"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443",new_task:"\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",task_name:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",maintenance_type:"\u0422\u0438\u043F \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",schedule_type:"\u0422\u0438\u043F \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F",interval_days:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B (\u0434\u043D\u0438)",warning_days:"\u0414\u043D\u0438 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F",interval_anchor:"\u042F\u043A\u043E\u0440\u044C \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430",anchor_completion:"\u041E\u0442 \u0434\u0430\u0442\u044B \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F",anchor_planned:"\u041E\u0442 \u043F\u043B\u0430\u043D\u043E\u0432\u043E\u0439 \u0434\u0430\u0442\u044B (\u0431\u0435\u0437 \u0441\u043C\u0435\u0449\u0435\u043D\u0438\u044F)",edit_object:"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442",name:"\u0418\u043C\u044F",manufacturer_optional:"\u041F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",model_optional:"\u041C\u043E\u0434\u0435\u043B\u044C (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",serial_number_optional:"\u0421\u0435\u0440\u0438\u0439\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",serial_number_label:"\u0421/\u041D",documentation_url_label:"\u0420\u0443\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u043E",object_notes_label:"\u0417\u0430\u043C\u0435\u0442\u043A\u0438",sort_due_date:"\u0421\u0440\u043E\u043A",sort_object:"\u0418\u043C\u044F \u043E\u0431\u044A\u0435\u043A\u0442\u0430",sort_type:"\u0422\u0438\u043F",sort_task_name:"\u0418\u043C\u044F \u0437\u0430\u0434\u0430\u0447\u0438",all_objects:"\u0412\u0441\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u044B",tasks_lower:"\u0437\u0430\u0434\u0430\u0447",no_tasks_yet:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447",add_first_task:"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0435\u0440\u0432\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443",last_performed_optional:"\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",trigger_configuration:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u0430",entity_id:"ID \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438",comma_separated:"\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E",entity_logic:"\u041B\u043E\u0433\u0438\u043A\u0430 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439",entity_logic_any:"\u041B\u044E\u0431\u0430\u044F \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u044C \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442",entity_logic_all:"\u0412\u0441\u0435 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u0441\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C",entities:"\u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438",attribute_optional:"\u0410\u0442\u0440\u0438\u0431\u0443\u0442 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E, \u043F\u0443\u0441\u0442\u043E = \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435)",use_entity_state:"\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438 (\u0431\u0435\u0437 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u0430)",trigger_above:"\u0421\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0442\u044C \u0432\u044B\u0448\u0435",trigger_below:"\u0421\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0442\u044C \u043D\u0438\u0436\u0435",for_at_least_minutes:"\u041D\u0435 \u043C\u0435\u043D\u0435\u0435 (\u043C\u0438\u043D\u0443\u0442)",safety_interval_days:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438 (\u0434\u043D\u0438, \u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",safety_interval:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",delta_mode:"\u0420\u0435\u0436\u0438\u043C \u0434\u0435\u043B\u044C\u0442\u044B",from_state_optional:"\u0418\u0437 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",to_state_optional:"\u0412 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",documentation_url_optional:"URL \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u0438 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",object_notes_optional:"\u0417\u0430\u043C\u0435\u0442\u043A\u0438 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",nfc_tag_id_optional:"ID NFC-\u043C\u0435\u0442\u043A\u0438 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",nfc_tags_empty_help:"\u0412 Home Assistant \u0435\u0449\u0451 \u043D\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043E NFC-\u0442\u0435\u0433\u043E\u0432.",nfc_tags_open_settings:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0442\u0435\u0433\u043E\u0432",nfc_tags_refresh:"\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C",environmental_entity_optional:"\u0414\u0430\u0442\u0447\u0438\u043A \u043E\u043A\u0440\u0443\u0436\u0430\u044E\u0449\u0435\u0439 \u0441\u0440\u0435\u0434\u044B (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",environmental_entity_helper:"\u043D\u0430\u043F\u0440. sensor.outdoor_temperature \u2014 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u0443\u0435\u0442 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u0443\u0441\u043B\u043E\u0432\u0438\u0439",environmental_attribute_optional:"\u0410\u0442\u0440\u0438\u0431\u0443\u0442 \u0441\u0440\u0435\u0434\u044B (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",nfc_tag_id:"ID NFC-\u043C\u0435\u0442\u043A\u0438",nfc_linked:"NFC-\u043C\u0435\u0442\u043A\u0430 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D\u0430",nfc_link_hint:"\u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C NFC-\u043C\u0435\u0442\u043A\u0443",responsible_user:"\u041E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",no_user_assigned:"(\u041D\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D)",all_users:"\u0412\u0441\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438",my_tasks:"\u041C\u043E\u0438 \u0437\u0430\u0434\u0430\u0447\u0438",tab_calendar:"\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C",cal_no_events:"\u0411\u0435\u0437 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",cal_window_7:"7 \u0434\u043D\u0435\u0439",cal_window_14:"14 \u0434\u043D\u0435\u0439",cal_window_30:"30 \u0434\u043D\u0435\u0439",cal_window_365:"1 \u0433\u043E\u0434",cal_every_n_days:"\u043A\u0430\u0436\u0434\u044B\u0435 {n} \u0434\u043D\u0435\u0439",cal_source_time:"\u041F\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438",cal_source_time_adaptive:"\u041F\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438 (\u0430\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u043E)",cal_source_sensor:"\u041F\u043E \u0434\u0430\u0442\u0447\u0438\u043A\u0443",cal_predicted:"\u043F\u0440\u043E\u0433\u043D\u043E\u0437",cal_confidence_high:"\u0432\u044B\u0441\u043E\u043A\u0430\u044F \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0441\u0442\u044C",cal_confidence_medium:"\u0441\u0440\u0435\u0434\u043D\u044F\u044F \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0441\u0442\u044C",cal_confidence_low:"\u043D\u0438\u0437\u043A\u0430\u044F \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0441\u0442\u044C",budget_monthly:"\u041C\u0435\u0441\u044F\u0447\u043D\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",budget_yearly:"\u0413\u043E\u0434\u043E\u0432\u043E\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",groups:"\u0413\u0440\u0443\u043F\u043F\u044B",new_group:"\u041D\u043E\u0432\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430",edit_group:"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443",no_groups:"\u0413\u0440\u0443\u043F\u043F \u043F\u043E\u043A\u0430 \u043D\u0435\u0442",delete_group:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443",delete_group_confirm:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443 '{name}'?",group_select_tasks:"\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0438",group_name_required:"\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0438\u043C\u044F",description_optional:"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",selected:"\u0412\u044B\u0431\u0440\u0430\u043D\u043E",loading_chart:"\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0433\u0440\u0430\u0444\u0438\u043A\u0430...",was_maintenance_needed:"\u0422\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u043E\u0441\u044C \u043B\u0438 \u044D\u0442\u043E \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435?",feedback_needed:"\u0422\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u043E\u0441\u044C",feedback_not_needed:"\u041D\u0435 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043B\u043E\u0441\u044C",feedback_not_sure:"\u041D\u0435 \u0443\u0432\u0435\u0440\u0435\u043D",suggested_interval:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u043C\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",apply_suggestion:"\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C",reanalyze:"\u041F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0437",reanalyze_result:"\u041D\u043E\u0432\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0437",reanalyze_insufficient_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438",data_points:"\u0442\u043E\u0447\u0435\u043A \u0434\u0430\u043D\u043D\u044B\u0445",dismiss_suggestion:"\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C",confidence_low:"\u041D\u0438\u0437\u043A\u0430\u044F",confidence_medium:"\u0421\u0440\u0435\u0434\u043D\u044F\u044F",confidence_high:"\u0412\u044B\u0441\u043E\u043A\u0430\u044F",recommended:"\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F",seasonal_awareness:"\u0421\u0435\u0437\u043E\u043D\u043D\u0430\u044F \u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u044F",edit_seasonal_overrides:"\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442\u044B",seasonal_overrides_title:"\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442\u044B (\u043F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0435)",seasonal_overrides_hint:"\u041A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442 \u043D\u0430 \u043C\u0435\u0441\u044F\u0446 (0.1\u20135.0). \u041F\u0443\u0441\u0442\u043E = \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438.",seasonal_override_invalid:"\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",seasonal_override_range:"\u041A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043E\u0442 0.1 \u0434\u043E 5.0",clear_all:"\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0435",seasonal_chart_title:"\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u0444\u0430\u043A\u0442\u043E\u0440\u044B",seasonal_learned:"\u0418\u0437\u0443\u0447\u0435\u043D\u043D\u044B\u0435",seasonal_manual:"\u0420\u0443\u0447\u043D\u044B\u0435",month_jan:"\u042F\u043D\u0432",month_feb:"\u0424\u0435\u0432",month_mar:"\u041C\u0430\u0440",month_apr:"\u0410\u043F\u0440",month_may:"\u041C\u0430\u0439",month_jun:"\u0418\u044E\u043D",month_jul:"\u0418\u044E\u043B",month_aug:"\u0410\u0432\u0433",month_sep:"\u0421\u0435\u043D",month_oct:"\u041E\u043A\u0442",month_nov:"\u041D\u043E\u044F",month_dec:"\u0414\u0435\u043A",sensor_prediction:"\u041F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0430\u043D\u0438\u0435 \u043F\u043E \u0434\u0430\u0442\u0447\u0438\u043A\u0443",degradation_trend:"\u0422\u0440\u0435\u043D\u0434",trend_rising:"\u0420\u0430\u0441\u0442\u0443\u0449\u0438\u0439",trend_falling:"\u041F\u0430\u0434\u0430\u044E\u0449\u0438\u0439",trend_stable:"\u0421\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0439",trend_insufficient_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0445",days_until_threshold:"\u0414\u043D\u0435\u0439 \u0434\u043E \u043F\u043E\u0440\u043E\u0433\u0430",threshold_exceeded:"\u041F\u043E\u0440\u043E\u0433 \u043F\u0440\u0435\u0432\u044B\u0448\u0435\u043D",environmental_adjustment:"\u0424\u0430\u043A\u0442\u043E\u0440 \u0441\u0440\u0435\u0434\u044B",sensor_prediction_urgency:"\u0414\u0430\u0442\u0447\u0438\u043A \u043F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043F\u043E\u0440\u043E\u0433 \u0447\u0435\u0440\u0435\u0437 ~{days} \u0434\u043D\u0435\u0439",day_short:"\u0434\u043D",weibull_reliability_curve:"\u041A\u0440\u0438\u0432\u0430\u044F \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0441\u0442\u0438",weibull_failure_probability:"\u0412\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044C \u043E\u0442\u043A\u0430\u0437\u0430",weibull_r_squared:"\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E \u0430\u043F\u043F\u0440\u043E\u043A\u0441\u0438\u043C\u0430\u0446\u0438\u0438 R\xB2",beta_early_failures:"\u0420\u0430\u043D\u043D\u0438\u0435 \u043E\u0442\u043A\u0430\u0437\u044B",beta_random_failures:"\u0421\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0435 \u043E\u0442\u043A\u0430\u0437\u044B",beta_wear_out:"\u0418\u0437\u043D\u043E\u0441",beta_highly_predictable:"\u0412\u044B\u0441\u043E\u043A\u0430\u044F \u043F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0443\u0435\u043C\u043E\u0441\u0442\u044C",confidence_interval:"\u0414\u043E\u0432\u0435\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",confidence_conservative:"\u041A\u043E\u043D\u0441\u0435\u0440\u0432\u0430\u0442\u0438\u0432\u043D\u044B\u0439",confidence_aggressive:"\u041E\u043F\u0442\u0438\u043C\u0438\u0441\u0442\u0438\u0447\u043D\u044B\u0439",current_interval_marker:"\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",recommended_marker:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u043C\u044B\u0439",characteristic_life:"\u0425\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0441\u0440\u043E\u043A \u0441\u043B\u0443\u0436\u0431\u044B",chart_mini_sparkline:"\u041C\u0438\u043D\u0438-\u0433\u0440\u0430\u0444\u0438\u043A \u0442\u0440\u0435\u043D\u0434\u0430",chart_history:"\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u0438 \u0438 \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0438",chart_seasonal:"\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u0444\u0430\u043A\u0442\u043E\u0440\u044B, 12 \u043C\u0435\u0441\u044F\u0446\u0435\u0432",chart_weibull:"\u041A\u0440\u0438\u0432\u0430\u044F \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0441\u0442\u0438 \u0412\u0435\u0439\u0431\u0443\u043B\u043B\u0430",chart_sparkline:"\u0413\u0440\u0430\u0444\u0438\u043A \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0442\u0440\u0438\u0433\u0433\u0435\u0440\u0430 \u0434\u0430\u0442\u0447\u0438\u043A\u0430",days_progress:"\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u043F\u043E \u0434\u043D\u044F\u043C",qr_code:"QR-\u043A\u043E\u0434",qr_generating:"\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F QR-\u043A\u043E\u0434\u0430\u2026",qr_error:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C QR-\u043A\u043E\u0434.",qr_error_no_url:"URL HA \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D. \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u0432\u043D\u0435\u0448\u043D\u0438\u0439 \u0438\u043B\u0438 \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u0439 URL \u0432 \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u2192 \u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u2192 \u0421\u0435\u0442\u044C.",save_error:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.",qr_print:"\u041F\u0435\u0447\u0430\u0442\u044C",qr_download:"\u0421\u043A\u0430\u0447\u0430\u0442\u044C SVG",qr_action:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438",qr_action_view:"\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440",qr_action_complete:"\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u043E\u0435",qr_url_mode:"\u0422\u0438\u043F \u0441\u0441\u044B\u043B\u043A\u0438",qr_mode_companion:"\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435-\u043A\u043E\u043C\u043F\u0430\u043D\u044C\u043E\u043D",qr_mode_local:"\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 (mDNS)",qr_mode_server:"URL \u0441\u0435\u0440\u0432\u0435\u0440\u0430",overview:"\u041E\u0431\u0437\u043E\u0440",analysis:"\u0410\u043D\u0430\u043B\u0438\u0437",recent_activities:"\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",search_notes:"\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0437\u0430\u043C\u0435\u0442\u043A\u0430\u043C",avg_cost:"\u0421\u0440. \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",no_advanced_features:"\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438 \u043D\u0435 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B",no_advanced_features_hint:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \xAB\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u044B\u0435 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B\xBB \u0438\u043B\u0438 \xAB\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u044B\xBB \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0437\u0434\u0435\u0441\u044C \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0443.",analysis_not_enough_data:"\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0430\u043D\u0430\u043B\u0438\u0437\u0430.",analysis_not_enough_data_hint:"\u0414\u043B\u044F \u0430\u043D\u0430\u043B\u0438\u0437\u0430 \u0412\u0435\u0439\u0431\u0443\u043B\u043B\u0430 \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u043C\u0438\u043D\u0438\u043C\u0443\u043C 5 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u044B\u0445 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0439; \u0441\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u044B \u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0442\u0441\u044F \u0432\u0438\u0434\u043D\u044B \u043F\u043E\u0441\u043B\u0435 6+ \u0442\u043E\u0447\u0435\u043A \u0434\u0430\u043D\u043D\u044B\u0445 \u0432 \u043C\u0435\u0441\u044F\u0446.",analysis_manual_task_hint:"\u0420\u0443\u0447\u043D\u044B\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0431\u0435\u0437 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430 \u043D\u0435 \u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u044E\u0442 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0443.",completions:"\u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0439",current:"\u0422\u0435\u043A\u0443\u0449\u0438\u0439",shorter:"\u041A\u043E\u0440\u043E\u0447\u0435",longer:"\u0414\u043B\u0438\u043D\u043D\u0435\u0435",normal:"\u041D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u044B\u0439",disabled:"\u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E",compound_logic:"\u0421\u043E\u0441\u0442\u0430\u0432\u043D\u0430\u044F \u043B\u043E\u0433\u0438\u043A\u0430",card_title:"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",card_show_header:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u043E \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u043E\u0439",card_show_actions:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439",card_compact:"\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C",card_max_items:"\u041C\u0430\u043A\u0441. \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 (0 = \u0432\u0441\u0435)",card_filter_status:"\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u0443",card_filter_status_help:"\u041F\u0443\u0441\u0442\u043E = \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u044B.",card_filter_objects:"\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E \u043E\u0431\u044A\u0435\u043A\u0442\u0430\u043C",card_filter_objects_help:"\u041F\u0443\u0441\u0442\u043E = \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u044B.",card_filter_entities:"\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u044F\u043C (entity_ids)",card_filter_entities_help:"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438 sensor / binary_sensor \u0438\u0437 \u044D\u0442\u043E\u0439 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438. \u041F\u0443\u0441\u0442\u043E = \u0432\u0441\u0435.",card_loading_objects:"\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432\u2026",card_load_error:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442\u044B \u2014 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 WebSocket-\u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435.",card_no_tasks_title:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",card_no_tasks_cta:"\u2192 \u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0432 \u043F\u0430\u043D\u0435\u043B\u0438 Maintenance",no_objects:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432.",action_error:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.",area_id_optional:"\u0417\u043E\u043D\u0430 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",installation_date_optional:"\u0414\u0430\u0442\u0430 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",custom_icon_optional:"\u0418\u043A\u043E\u043D\u043A\u0430 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 mdi:wrench)",task_enabled:"\u0417\u0430\u0434\u0430\u0447\u0430 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0430",skip_reason_prompt:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u044D\u0442\u0443 \u0437\u0430\u0434\u0430\u0447\u0443?",reason_optional:"\u041F\u0440\u0438\u0447\u0438\u043D\u0430 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",reset_date_prompt:"\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443 \u043A\u0430\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u0443\u044E?",reset_date_optional:"\u0414\u0430\u0442\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0433\u043E \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E, \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E: \u0441\u0435\u0433\u043E\u0434\u043D\u044F)",notes_label:"\u041F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u044F",documentation_label:"\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u044F",no_nfc_tag:"\u2014 \u041D\u0435\u0442 \u043C\u0435\u0442\u043A\u0438 \u2014",dashboard:"\u041F\u0430\u043D\u0435\u043B\u044C",settings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",settings_features:"\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438",settings_features_desc:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0438\u043B\u0438 \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438. \u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0441\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0438\u0445 \u0438\u0437 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430, \u043D\u043E \u043D\u0435 \u0443\u0434\u0430\u043B\u044F\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0435.",feat_adaptive:"\u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u043E\u0435 \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",feat_adaptive_desc:"\u0418\u0437\u0443\u0447\u0430\u0442\u044C \u043E\u043F\u0442\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0435 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B \u0438\u0437 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",feat_predictions:"\u041F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0430\u043D\u0438\u044F \u043F\u043E \u0434\u0430\u0442\u0447\u0438\u043A\u0430\u043C",feat_predictions_desc:"\u041F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0434\u0430\u0442\u044B \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u043D\u0438\u044F \u043F\u043E \u0434\u0435\u0433\u0440\u0430\u0434\u0430\u0446\u0438\u0438 \u0434\u0430\u0442\u0447\u0438\u043A\u0430",feat_seasonal:"\u0421\u0435\u0437\u043E\u043D\u043D\u044B\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u043A\u0438",feat_seasonal_desc:"\u041A\u043E\u0440\u0440\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0441\u0435\u0437\u043E\u043D\u043D\u044B\u0445 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u043E\u0432",feat_environmental:"\u042D\u043A\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043A\u043E\u0440\u0440\u0435\u043B\u044F\u0446\u0438\u044F",feat_environmental_desc:"\u0421\u0432\u044F\u0437\u044B\u0432\u0430\u0442\u044C \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B \u0441 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u043E\u0439/\u0432\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C\u044E",feat_budget:"\u041E\u0442\u0441\u043B\u0435\u0436\u0438\u0432\u0430\u043D\u0438\u0435 \u0431\u044E\u0434\u0436\u0435\u0442\u0430",feat_budget_desc:"\u041E\u0442\u0441\u043B\u0435\u0436\u0438\u0432\u0430\u0442\u044C \u043C\u0435\u0441\u044F\u0447\u043D\u044B\u0435 \u0438 \u0433\u043E\u0434\u043E\u0432\u044B\u0435 \u0440\u0430\u0441\u0445\u043E\u0434\u044B \u043D\u0430 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u0435",feat_groups:"\u0413\u0440\u0443\u043F\u043F\u044B \u0437\u0430\u0434\u0430\u0447",feat_groups_desc:"\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u043E\u0432\u044B\u0432\u0430\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0438 \u0432 \u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B",feat_checklists:"\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C\u043D\u044B\u0435 \u0441\u043F\u0438\u0441\u043A\u0438",feat_checklists_desc:"\u041C\u043D\u043E\u0433\u043E\u0448\u0430\u0433\u043E\u0432\u044B\u0435 \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u044B \u0434\u043B\u044F \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u0437\u0430\u0434\u0430\u0447\u0438",settings_general:"\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435",settings_default_warning:"\u0414\u043D\u0438 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u044F \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",settings_panel_enabled:"\u0411\u043E\u043A\u043E\u0432\u0430\u044F \u043F\u0430\u043D\u0435\u043B\u044C",settings_panel_title:"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043F\u0430\u043D\u0435\u043B\u0438",settings_notifications:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",settings_notify_service:"\u0421\u0435\u0440\u0432\u0438\u0441 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439",test_notification:"\u0422\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435",send_test:"\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0442\u0435\u0441\u0442",testing:"\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430\u2026",test_notification_success:"\u0422\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E",test_notification_failed:"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0442\u0435\u0441\u0442\u043E\u0432\u043E\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435",settings_notify_due_soon:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C, \u043A\u043E\u0433\u0434\u0430 \u0441\u0440\u043E\u043A \u0441\u043A\u043E\u0440\u043E \u0438\u0441\u0442\u0435\u043A\u0430\u0435\u0442",settings_notify_overdue:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C \u043F\u0440\u0438 \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u043A\u0435",settings_notify_triggered:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C \u043F\u0440\u0438 \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u043D\u0438\u0438",settings_interval_hours:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u044F (\u0447\u0430\u0441\u044B, 0 = \u043E\u0434\u0438\u043D \u0440\u0430\u0437)",settings_quiet_hours:"\u0427\u0430\u0441\u044B \u0442\u0438\u0448\u0438\u043D\u044B",settings_quiet_start:"\u041D\u0430\u0447\u0430\u043B\u043E",settings_quiet_end:"\u041A\u043E\u043D\u0435\u0446",settings_max_per_day:"\u041C\u0430\u043A\u0441. \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439 \u0432 \u0434\u0435\u043D\u044C (0 = \u0431\u0435\u0437 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0439)",settings_bundling:"\u0413\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",settings_bundle_threshold:"\u041F\u043E\u0440\u043E\u0433 \u0433\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0438",settings_actions:"\u041A\u043D\u043E\u043F\u043A\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u0432 \u043C\u043E\u0431\u0438\u043B\u044C\u043D\u043E\u043C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438",settings_action_complete:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C\xBB",settings_action_skip:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C\xBB",settings_action_snooze:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0443 \xAB\u041E\u0442\u043B\u043E\u0436\u0438\u0442\u044C\xBB",settings_snooze_hours:"\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u043E\u0442\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u043D\u0438\u044F (\u0447\u0430\u0441\u044B)",settings_budget:"\u0411\u044E\u0434\u0436\u0435\u0442",settings_currency:"\u0412\u0430\u043B\u044E\u0442\u0430",settings_budget_monthly:"\u041C\u0435\u0441\u044F\u0447\u043D\u044B\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_yearly:"\u0413\u043E\u0434\u043E\u0432\u043E\u0439 \u0431\u044E\u0434\u0436\u0435\u0442",settings_budget_alerts:"\u041E\u043F\u043E\u0432\u0435\u0449\u0435\u043D\u0438\u044F \u043E \u0431\u044E\u0434\u0436\u0435\u0442\u0435",settings_budget_threshold:"\u041F\u043E\u0440\u043E\u0433 \u043E\u043F\u043E\u0432\u0435\u0449\u0435\u043D\u0438\u044F (%)",settings_import_export:"\u0418\u043C\u043F\u043E\u0440\u0442 / \u042D\u043A\u0441\u043F\u043E\u0440\u0442",settings_export_json:"\u042D\u043A\u0441\u043F\u043E\u0440\u0442 JSON",settings_export_yaml:"\u042D\u043A\u0441\u043F\u043E\u0440\u0442 YAML",settings_export_csv:"\u042D\u043A\u0441\u043F\u043E\u0440\u0442 CSV",settings_import_csv:"\u0418\u043C\u043F\u043E\u0440\u0442 CSV",settings_import_placeholder:"\u0412\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 JSON \u0438\u043B\u0438 CSV \u0437\u0434\u0435\u0441\u044C\u2026",settings_import_btn:"\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C",settings_import_success:"\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432: {count}.",settings_export_success:"\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D.",settings_saved:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430.",settings_include_history:"\u0412\u043A\u043B\u044E\u0447\u0430\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u044E",sort_alphabetical:"\u041F\u043E \u0430\u043B\u0444\u0430\u0432\u0438\u0442\u0443",sort_due_soonest:"\u0411\u043B\u0438\u0436\u0430\u0439\u0448\u0438\u0439 \u0441\u0440\u043E\u043A",sort_task_count:"\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0437\u0430\u0434\u0430\u0447",sort_area:"\u041E\u0431\u043B\u0430\u0441\u0442\u044C",sort_assigned_user:"\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044B\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",sort_group:"\u0413\u0440\u0443\u043F\u043F\u0430",groupby_none:"\u0411\u0435\u0437 \u0433\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0438",groupby_area:"\u041F\u043E \u043E\u0431\u043B\u0430\u0441\u0442\u0438",groupby_group:"\u041F\u043E \u0433\u0440\u0443\u043F\u043F\u0435",groupby_user:"\u041F\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044E",filter_label:"\u0424\u0438\u043B\u044C\u0442\u0440",user_label:"\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",sort_label:"\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430",group_by_label:"\u0413\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E",state_value_help:'\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F HA (\u043E\u0431\u044B\u0447\u043D\u043E \u0432 \u043D\u0438\u0436\u043D\u0435\u043C \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0435, \u043D\u0430\u043F\u0440. "on"/"off"). \u0420\u0435\u0433\u0438\u0441\u0442\u0440 \u043D\u043E\u0440\u043C\u0430\u043B\u0438\u0437\u0443\u0435\u0442\u0441\u044F \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438.',target_changes_help:"\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0445 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u043E\u0432, \u043F\u043E\u0441\u043B\u0435 \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442 \u0442\u0440\u0438\u0433\u0433\u0435\u0440 (\u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E: 1).",qr_print_title:"\u041F\u0435\u0447\u0430\u0442\u044C QR-\u043A\u043E\u0434\u043E\u0432",qr_print_desc:"\u0421\u043E\u0437\u0434\u0430\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0434\u043B\u044F \u043F\u0435\u0447\u0430\u0442\u0438 \u0441 QR-\u043A\u043E\u0434\u0430\u043C\u0438 \u0434\u043B\u044F \u0432\u044B\u0440\u0435\u0437\u0430\u043D\u0438\u044F \u0438 \u043D\u0430\u043A\u043B\u0435\u0438\u0432\u0430\u043D\u0438\u044F \u043D\u0430 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u0435.",qr_print_load:"\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442\u044B",qr_print_filter:"\u0424\u0438\u043B\u044C\u0442\u0440",qr_print_objects:"\u041E\u0431\u044A\u0435\u043A\u0442\u044B",qr_print_actions:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F",qr_print_url_mode:"\u0422\u0438\u043F \u0441\u0441\u044B\u043B\u043A\u0438",qr_print_estimate:"\u041E\u0446\u0435\u043D\u043A\u0430 QR-\u043A\u043E\u0434\u043E\u0432",qr_print_over_limit:"\u043B\u0438\u043C\u0438\u0442 200, \u0441\u0443\u0437\u044C \u0444\u0438\u043B\u044C\u0442\u0440",qr_print_generate:"\u0421\u043E\u0437\u0434\u0430\u0442\u044C QR-\u043A\u043E\u0434\u044B",qr_print_generating:"\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435\u2026",qr_print_ready:"QR-\u043A\u043E\u0434\u044B \u0433\u043E\u0442\u043E\u0432\u044B",qr_print_print_button:"\u041F\u0435\u0447\u0430\u0442\u044C",qr_print_empty:"\u041D\u0435\u0447\u0435\u0433\u043E \u0441\u043E\u0437\u0434\u0430\u0432\u0430\u0442\u044C",qr_action_skip:"\u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C",vacation_title:"\u0420\u0435\u0436\u0438\u043C \u043E\u0442\u043F\u0443\u0441\u043A\u0430",vacation_active:"\u0430\u043A\u0442\u0438\u0432\u0435\u043D",vacation_ended:"\u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D",vacation_desc:"\u0417\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u0443\u0439 \u043E\u0442\u043F\u0443\u0441\u043A: \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u0438\u043E\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u043D\u0430 \u043F\u0435\u0440\u0438\u043E\u0434 \u043F\u043B\u044E\u0441 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0431\u0443\u0444\u0435\u0440\u043D\u044B\u0445 \u0434\u043D\u0435\u0439. \u041C\u043E\u0436\u043D\u043E \u0437\u0430\u0434\u0430\u0442\u044C \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u043F\u043E \u0437\u0430\u0434\u0430\u0447\u0430\u043C.",vacation_enable:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0440\u0435\u0436\u0438\u043C \u043E\u0442\u043F\u0443\u0441\u043A\u0430",vacation_start:"\u041D\u0430\u0447\u0430\u043B\u043E",vacation_end:"\u041A\u043E\u043D\u0435\u0446",vacation_buffer:"\u0411\u0443\u0444\u0435\u0440 (\u0434\u043D\u0435\u0439)",vacation_exempt_title:"\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C \u043D\u0435\u0441\u043C\u043E\u0442\u0440\u044F \u043D\u0430 \u043E\u0442\u043F\u0443\u0441\u043A",vacation_exempt_desc:"\u0412\u044B\u0431\u0435\u0440\u0438 \u0437\u0430\u0434\u0430\u0447\u0438, \u043F\u043E \u043A\u043E\u0442\u043E\u0440\u044B\u043C \u043D\u0443\u0436\u043D\u043E \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C \u0438 \u0432 \u043E\u0442\u043F\u0443\u0441\u043A\u0435 (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u043A\u0440\u0438\u0442\u0438\u0447\u043D\u0430\u044F \u0445\u0438\u043C\u0438\u044F \u0431\u0430\u0441\u0441\u0435\u0439\u043D\u0430).",vacation_load_tasks:"\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0438",vacation_preview_btn:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440",vacation_preview_affected:"\u0437\u0430\u0434\u0430\u0447 \u0437\u0430\u0442\u0440\u043E\u043D\u0443\u0442\u043E",vacation_event_due_soon:"\u0441\u043A\u043E\u0440\u043E \u043D\u0430\u0441\u0442\u0443\u043F\u0438\u0442 \u0441\u0440\u043E\u043A",vacation_event_overdue:"\u0441\u0442\u0430\u043D\u0435\u0442 \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043D\u043E\u0439",vacation_event_triggered_est:"\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u043D\u0438\u0435 \u0441\u0435\u043D\u0441\u043E\u0440\u0430",vacation_sensor_based:"(\u0441\u0435\u043D\u0441\u043E\u0440\u043D\u0430\u044F)",vacation_action_notify:"\u0412\u0441\u0451 \u0440\u0430\u0432\u043D\u043E \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u044F\u0442\u044C",vacation_action_unsilence:"\u0421\u043D\u043E\u0432\u0430 \u0437\u0430\u0433\u043B\u0443\u0448\u0438\u0442\u044C",vacation_marked_complete:"\u041E\u0442\u043C\u0435\u0447\u0435\u043D\u043E \u043A\u0430\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E",vacation_marked_skip:"\u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E",vacation_end_now:"\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u043E\u0442\u043F\u0443\u0441\u043A \u0441\u0435\u0439\u0447\u0430\u0441",unassigned:"\u041D\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u043E",no_area:"\u0411\u0435\u0437 \u043E\u0431\u043B\u0430\u0441\u0442\u0438",has_overdue:"\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043D\u044B\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",object:"\u041E\u0431\u044A\u0435\u043A\u0442",settings_panel_access:"\u0414\u043E\u0441\u0442\u0443\u043F \u043A \u043F\u0430\u043D\u0435\u043B\u0438",settings_panel_access_desc:"\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u044B \u0432\u0441\u0435\u0433\u0434\u0430 \u0432\u0438\u0434\u044F\u0442 \u043F\u043E\u043B\u043D\u0443\u044E \u043F\u0430\u043D\u0435\u043B\u044C. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0437\u0434\u0435\u0441\u044C \u043D\u0435-\u0430\u0434\u043C\u0438\u043D \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0442\u0430\u043A\u0436\u0435 \u0434\u043E\u043B\u0436\u043D\u044B \u0438\u043C\u0435\u0442\u044C \u043F\u043E\u043B\u043D\u044B\u0439 \u0434\u043E\u0441\u0442\u0443\u043F \u2014 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0432\u0438\u0434\u044F\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0438 \u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C.",no_non_admin_users:"\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043D\u0435-\u0430\u0434\u043C\u0438\u043D \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0438\u0445 \u0432 \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u2192 \u041B\u044E\u0434\u0438.",owner_label:"\u0412\u043B\u0430\u0434\u0435\u043B\u0435\u0446",feat_completion_actions:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043F\u0440\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0438",feat_completion_actions_desc:"HA-\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u043E \u0437\u0430\u0434\u0430\u0447\u0435 \u043F\u0440\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0438 + QR \u0431\u044B\u0441\u0442\u0440\u043E\u0433\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u0441 \u043F\u0440\u0435\u0434\u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044B\u043C\u0438 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F\u043C\u0438.",on_complete_action_title:"\u041F\u0440\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0438: \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C HA-\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",on_complete_action_desc:"\u0412\u044B\u0437\u044B\u0432\u0430\u0435\u0442 HA-\u0441\u0435\u0440\u0432\u0438\u0441 \u043F\u0440\u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0438 \u0437\u0430\u0434\u0430\u0447\u0438 \u2014 \u043D\u0430\u043F\u0440., \u0441\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0441\u0447\u0451\u0442\u0447\u0438\u043A \u043D\u0430 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435.",on_complete_action_service:"\u0421\u0435\u0440\u0432\u0438\u0441",on_complete_action_target:"\u0426\u0435\u043B\u0435\u0432\u0430\u044F \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u044C",on_complete_action_data:"\u0414\u0430\u043D\u043D\u044B\u0435 (JSON, \u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",on_complete_action_test:"\u0422\u0435\u0441\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",on_complete_action_test_success:"\u0423\u0441\u043F\u0435\u0448\u043D\u043E",on_complete_action_test_failed:"\u041E\u0448\u0438\u0431\u043A\u0430",quick_complete_defaults_title:"\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u0434\u043B\u044F \u0431\u044B\u0441\u0442\u0440\u043E\u0433\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F (\u0434\u043B\u044F QR-\u0441\u043A\u0430\u043D\u043E\u0432, \u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",quick_complete_defaults_desc:"\u041F\u0440\u0435\u0434\u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044B\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u0434\u043B\u044F QR \u0431\u044B\u0441\u0442\u0440\u043E\u0433\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F. \u0411\u0435\u0437 \u043D\u0438\u0445 QR \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u0434\u0438\u0430\u043B\u043E\u0433.",quick_complete_defaults_notes:"\u0417\u0430\u043C\u0435\u0442\u043A\u0438",quick_complete_defaults_cost:"\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",quick_complete_defaults_duration:"\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C (\u043C\u0438\u043D\u0443\u0442)",quick_complete_defaults_feedback_none:"\u0411\u0435\u0437 \u043E\u0442\u0437\u044B\u0432\u0430",quick_complete_defaults_feedback_needed:"\u0411\u044B\u043B\u043E \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E",quick_complete_defaults_feedback_not_needed:"\u041D\u0435 \u0431\u044B\u043B\u043E \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E",quick_complete_success:"\u0411\u044B\u0441\u0442\u0440\u043E \u043E\u0442\u043C\u0435\u0447\u0435\u043D\u043E \u043A\u0430\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E",trigger_replaced:"\u0422\u0440\u0438\u0433\u0433\u0435\u0440 \u0437\u0430\u043C\u0435\u043D\u0451\u043D",add:"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",show_stats:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443 + \u0433\u0440\u0430\u0444\u0438\u043A\u0438",hide_stats:"\u0421\u043A\u0440\u044B\u0442\u044C \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",adaptive_no_data:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0439 \u0434\u043B\u044F \u0430\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u0430\u043D\u0430\u043B\u0438\u0437\u0430. \u0412\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u044D\u0442\u0443 \u0437\u0430\u0434\u0430\u0447\u0443 \u0435\u0449\u0451 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0440\u0430\u0437, \u0447\u0442\u043E\u0431\u044B \u0440\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u043F\u043E \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0443 \u0438 \u0433\u0440\u0430\u0444\u0438\u043A\u0438 \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0441\u0442\u0438.",suggestion_applied:"\u041F\u0440\u0435\u0434\u043B\u0430\u0433\u0430\u0435\u043C\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u043F\u0440\u0438\u043C\u0435\u043D\u0451\u043D",vacation_mode:"\u0420\u0435\u0436\u0438\u043C \u043E\u0442\u043F\u0443\u0441\u043A\u0430",vacation_status_active:"\u0410\u043A\u0442\u0438\u0432\u0435\u043D \u0441\u0435\u0439\u0447\u0430\u0441",vacation_status_scheduled:"\u0417\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D",vacation_status_inactive:"\u041D\u0435\u0430\u043A\u0442\u0438\u0432\u0435\u043D",vacation_end_now_confirm:"\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u043E\u0442\u043F\u0443\u0441\u043A \u043D\u0435\u043C\u0435\u0434\u043B\u0435\u043D\u043D\u043E?",vacation_exempt_count:"\u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u043E",vacation_advanced:"\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u2026",vacation_open_panel:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0438",enable:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C",saved:"\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E",budget_monthly_set:"\u0417\u0430\u0434\u0430\u0442\u044C \u043C\u0435\u0441\u044F\u0447\u043D\u044B\u0439",budget_yearly_set:"\u0417\u0430\u0434\u0430\u0442\u044C \u0433\u043E\u0434\u043E\u0432\u043E\u0439",budget_advanced:"\u0412\u0430\u043B\u044E\u0442\u0430, \u043E\u043F\u043E\u0432\u0435\u0449\u0435\u043D\u0438\u044F\u2026",budget_open_panel:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0438",groups_empty:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0433\u0440\u0443\u043F\u043F.",group_new_placeholder:"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443\u2026",group_delete_confirm:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443 \xAB{name}\xBB?",groups_manage_tasks:"\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F\u043C\u0438 \u0437\u0430\u0434\u0430\u0447\u2026",groups_open_panel:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0438",on_complete_action_target_hint:"\u041F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u0435: \u0434\u043E\u043C\u0435\u043D \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438 \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0441\u0435\u0440\u0432\u0438\u0441\u0443 \u2014 \u043D\u0430\u043F\u0440. 'button.press' \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0441 button.*, 'counter.increment' \u0442\u043E\u043B\u044C\u043A\u043E \u0441 counter.*, 'input_button.press' \u0442\u043E\u043B\u044C\u043A\u043E \u0441 input_button.* \u0438 \u0442. \u0434. \u041F\u0440\u0438 \u043D\u0435\u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043C\u043E\u043B\u0447\u0430 \u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u0441\u044F (HA \u0437\u0430\u043F\u0438\u0448\u0435\u0442 \u0432 \u0436\u0443\u0440\u043D\u0430\u043B 'Referenced entities ... missing or not currently available').",show_all_objects:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u044B",show_all_tasks:"\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440 \u2014 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",filter_to_overdue:"\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u043F\u0438\u0441\u043E\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E \u043F\u0440\u043E\u0441\u0440\u043E\u0447\u0435\u043D\u043D\u044B\u043C",filter_to_due_soon:"\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u043F\u0438\u0441\u043E\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E \u0441\u043A\u043E\u0440\u043E \u043D\u0430\u0441\u0442\u0443\u043F\u0430\u044E\u0449\u0438\u043C",filter_to_triggered:"\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u043F\u0438\u0441\u043E\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E \u0441\u0440\u0430\u0431\u043E\u0442\u0430\u0432\u0448\u0438\u043C",open_task:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443",show_details:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0438\u0441\u0442\u043E\u0440\u0438\u044E + \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443",hide_details:"\u0421\u043A\u0440\u044B\u0442\u044C \u0434\u0435\u0442\u0430\u043B\u0438",history_empty:"\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0438\u0441\u0442\u043E\u0440\u0438\u0438.",history_edit_button:"\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C",total_cost:"\u041E\u0431\u0449\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",times_performed:"\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E",older_entries:"\u0440\u0430\u043D\u0435\u0435",open_in_panel:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0438 \u043E\u0431\u0441\u043B\u0443\u0436\u0438\u0432\u0430\u043D\u0438\u044F",skip_reason:"\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)",reset_to_date:"\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 \u043D\u0430",delete_task_confirm:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u0443 \u0437\u0430\u0434\u0430\u0447\u0443 \u0438 \u0435\u0451 \u0438\u0441\u0442\u043E\u0440\u0438\u044E?",delete_object_confirm:"\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u043E\u0442 \u043E\u0431\u044A\u0435\u043A\u0442 \u0438 \u0432\u0441\u0435 \u0435\u0433\u043E \u0437\u0430\u0434\u0430\u0447\u0438?",loading:"\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026"},qa={maintenance:"Konserwacja",objects:"Obiekty",tasks:"Zadania",overdue:"Zaleg\u0142e",due_soon:"Wkr\xF3tce",triggered:"Wyzwolone",ok:"OK",all:"Wszystkie",new_object:"+ Nowy obiekt",edit:"Edytuj",delete:"Usu\u0144",add_task:"+ Dodaj zadanie",complete:"Wykonaj",completed:"Wykonano",skip:"Pomi\u0144",skipped:"Pomini\u0119te",reset:"Resetuj",cancel:"Anuluj",completing:"Wykonywanie\u2026",interval:"Interwa\u0142",warning:"Ostrze\u017Cenie",last_performed:"Ostatnio wykonane",next_due:"Nast\u0119pny termin",days_until_due:"Dni do terminu",avg_duration:"\u015Ar. czas trwania",trigger:"Wyzwalacz",trigger_type:"Typ wyzwalacza",threshold_above:"G\xF3rny limit",threshold_below:"Dolny limit",threshold:"Pr\xF3g",counter:"Licznik",state_change:"Zmiana stanu",runtime:"Czas pracy",runtime_hours:"Docelowy czas pracy (godziny)",target_value:"Warto\u015B\u0107 docelowa",baseline:"Warto\u015B\u0107 bazowa",target_changes:"Docelowa liczba zmian",for_minutes:"Przez (minuty)",time_based:"Czasowy",sensor_based:"Oparty na czujniku",manual:"R\u0119czny",one_time:"Jednorazowo",weekdays:"Dni tygodnia",nth_weekday:"N-ty dzie\u0144 tygodnia w miesi\u0105cu",day_of_month:"Dzie\u0144 miesi\u0105ca",recurrence_on_days:"Powtarzaj w",recurrence_occurrence:"Wyst\u0105pienie",recurrence_weekday:"Dzie\u0144 tygodnia",recurrence_day:"Dzie\u0144 miesi\u0105ca (1\u201331)",ord_1:"1.",ord_2:"2.",ord_3:"3.",ord_4:"4.",ord_5:"5.",ord_last:"Ostatni",day_word:"Dzie\u0144",interval_value:"Interwa\u0142",interval_unit:"Jednostka",unit_days:"Dni",unit_weeks:"Tygodnie",unit_months:"Miesi\u0105ce",unit_years:"Lata",due_date:"Termin",cleaning:"Czyszczenie",inspection:"Inspekcja",replacement:"Wymiana",calibration:"Kalibracja",service:"Serwis",custom:"Niestandardowy",history:"Historia",cost:"Koszt",duration:"Czas trwania",both:"Oba",trigger_val:"Warto\u015B\u0107 wyzwalacza",complete_title:"Wykonaj: ",checklist:"Lista kontrolna",checklist_steps_optional:"Kroki listy kontrolnej (opcjonalne)",checklist_placeholder:`Wyczy\u015B\u0107 filtr
Wymie\u0144 uszczelk\u0119
Sprawd\u017A ci\u015Bnienie`,checklist_help:"Jeden krok na lini\u0119. Maks. 100 element\xF3w.",err_too_long:"{field}: za d\u0142ugie (maks. {n} znak\xF3w)",err_too_short:"{field}: za kr\xF3tkie (min. {n} znak\xF3w)",err_value_too_high:"{field}: za du\u017Ce (maks. {n})",err_value_too_low:"{field}: za ma\u0142e (min. {n})",err_required:"{field}: wymagane",err_wrong_type:"{field}: z\u0142y typ (oczekiwano: {type})",err_invalid_choice:"{field}: niedozwolona warto\u015B\u0107",err_invalid_value:"{field}: nieprawid\u0142owa warto\u015B\u0107",feat_schedule_time:"Harmonogram wed\u0142ug pory dnia",feat_schedule_time_desc:"Zadania staj\u0105 si\u0119 zaleg\u0142e o okre\u015Blonej porze dnia zamiast o p\xF3\u0142nocy.",schedule_time_optional:"Termin o godzinie (opcjonalne, HH:MM)",schedule_time_help:"Puste = p\xF3\u0142noc (domy\u015Blnie). Strefa czasowa HA.",at_time:"o",notes_optional:"Notatki (opcjonalne)",cost_optional:"Koszt (opcjonalne)",duration_minutes:"Czas trwania w minutach (opcjonalne)",days:"dni",day:"dzie\u0144",today:"Dzisiaj",d_overdue:"d zaleg\u0142e",no_tasks:"Jeszcze brak zada\u0144 konserwacyjnych. Utw\xF3rz obiekt, aby zacz\u0105\u0107.",no_tasks_short:"Brak zada\u0144",no_history:"Jeszcze brak wpis\xF3w historii.",show_all:"Poka\u017C wszystko",cost_duration_chart:"Koszt i czas trwania",installed:"Zainstalowane",confirm_delete_object:"Usun\u0105\u0107 ten obiekt i wszystkie jego zadania?",confirm_delete_task:"Usun\u0105\u0107 to zadanie?",min:"Min",max:"Maks",save:"Zapisz",saving:"Zapisywanie\u2026",edit_task:"Edytuj zadanie",new_task:"Nowe zadanie konserwacyjne",task_name:"Nazwa zadania",maintenance_type:"Typ konserwacji",schedule_type:"Typ harmonogramu",interval_days:"Interwa\u0142 (dni)",warning_days:"Dni ostrze\u017Cenia",last_performed_optional:"Ostatnio wykonane (opcjonalne)",interval_anchor:"Punkt zaczepienia interwa\u0142u",anchor_completion:"Od daty wykonania",anchor_planned:"Od daty planowanej (bez przesuni\u0119\u0107)",edit_object:"Edytuj obiekt",name:"Nazwa",manufacturer_optional:"Producent (opcjonalne)",model_optional:"Model (opcjonalne)",serial_number_optional:"Numer seryjny (opcjonalne)",serial_number_label:"S/N",documentation_url_label:"Instrukcja",object_notes_label:"Notatki",sort_due_date:"Termin",sort_object:"Nazwa obiektu",sort_type:"Typ",sort_task_name:"Nazwa zadania",all_objects:"Wszystkie obiekty",tasks_lower:"zada\u0144",no_tasks_yet:"Jeszcze brak zada\u0144",add_first_task:"Dodaj pierwsze zadanie",trigger_configuration:"Konfiguracja wyzwalacza",entity_id:"ID encji",comma_separated:"oddzielone przecinkami",entity_logic:"Logika encji",entity_logic_any:"Wyzwala dowolna encja",entity_logic_all:"Wszystkie encje musz\u0105 wyzwoli\u0107",entities:"encje",attribute_optional:"Atrybut (opcjonalny, puste = stan)",use_entity_state:"U\u017Cyj stanu encji (bez atrybutu)",trigger_above:"Wyzw\xF3l powy\u017Cej",trigger_below:"Wyzw\xF3l poni\u017Cej",for_at_least_minutes:"Przez co najmniej (minuty)",safety_interval_days:"Interwa\u0142 bezpiecze\u0144stwa (dni, opcjonalny)",safety_interval:"Interwa\u0142 bezpiecze\u0144stwa (opcjonalny)",delta_mode:"Tryb delta",from_state_optional:"Ze stanu (opcjonalne)",to_state_optional:"Do stanu (opcjonalne)",documentation_url_optional:"URL dokumentacji (opcjonalne)",object_notes_optional:"Notatki (opcjonalne)",nfc_tag_id_optional:"ID tagu NFC (opcjonalne)",nfc_tags_empty_help:"W Home Assistant nie zarejestrowano jeszcze tag\xF3w NFC.",nfc_tags_open_settings:"Otw\xF3rz ustawienia tag\xF3w",nfc_tags_refresh:"Od\u015Bwie\u017C",environmental_entity_optional:"Czujnik \u015Brodowiskowy (opcjonalne)",environmental_entity_helper:"np. sensor.outdoor_temperature \u2014 dostosowuje interwa\u0142 na podstawie warunk\xF3w \u015Brodowiskowych",environmental_attribute_optional:"Atrybut \u015Brodowiskowy (opcjonalne)",nfc_tag_id:"ID tagu NFC",nfc_linked:"Tag NFC powi\u0105zany",nfc_link_hint:"Kliknij, aby powi\u0105za\u0107 tag NFC",responsible_user:"Odpowiedzialny u\u017Cytkownik",no_user_assigned:"(Brak przypisanego u\u017Cytkownika)",all_users:"Wszyscy u\u017Cytkownicy",my_tasks:"Moje zadania",tab_calendar:"Kalendarz",cal_no_events:"Brak konserwacji",cal_window_7:"7 dni",cal_window_14:"14 dni",cal_window_30:"30 dni",cal_window_365:"1 rok",cal_every_n_days:"co {n} dni",cal_source_time:"Czas",cal_source_time_adaptive:"Czas (adaptacyjny)",cal_source_sensor:"Czujnik",cal_predicted:"przewidywane",cal_confidence_high:"wysoka pewno\u015B\u0107",cal_confidence_medium:"\u015Brednia pewno\u015B\u0107",cal_confidence_low:"niska pewno\u015B\u0107",budget_monthly:"Bud\u017Cet miesi\u0119czny",budget_yearly:"Bud\u017Cet roczny",groups:"Grupy",new_group:"Nowa grupa",edit_group:"Edytuj grup\u0119",no_groups:"Jeszcze brak grup",delete_group:"Usu\u0144 grup\u0119",delete_group_confirm:"Usun\u0105\u0107 grup\u0119 '{name}'?",group_select_tasks:"Wybierz zadania",group_name_required:"Nazwa jest wymagana",description_optional:"Opis (opcjonalny)",selected:"Wybrane",loading_chart:"\u0141adowanie danych wykresu...",was_maintenance_needed:"Czy ta konserwacja by\u0142a potrzebna?",feedback_needed:"Potrzebna",feedback_not_needed:"Niepotrzebna",feedback_not_sure:"Nie jestem pewien",suggested_interval:"Sugerowany interwa\u0142",apply_suggestion:"Zastosuj",reanalyze:"Analizuj ponownie",reanalyze_result:"Nowa analiza",reanalyze_insufficient_data:"Za ma\u0142o danych do wygenerowania rekomendacji",data_points:"punkty danych",dismiss_suggestion:"Odrzu\u0107",confidence_low:"Niska",confidence_medium:"\u015Arednia",confidence_high:"Wysoka",recommended:"rekomendowane",seasonal_awareness:"\u015Awiadomo\u015B\u0107 sezonowa",edit_seasonal_overrides:"Edytuj czynniki sezonowe",seasonal_overrides_title:"Czynniki sezonowe (nadpisanie)",seasonal_overrides_hint:"Czynnik na miesi\u0105c (0.1\u20135.0). Puste = uczone automatycznie.",seasonal_override_invalid:"Nieprawid\u0142owa warto\u015B\u0107",seasonal_override_range:"Czynnik musi by\u0107 mi\u0119dzy 0.1 a 5.0",clear_all:"Wyczy\u015B\u0107 wszystko",seasonal_chart_title:"Czynniki sezonowe",seasonal_learned:"Wyuczone",seasonal_manual:"R\u0119czne",month_jan:"Sty",month_feb:"Lut",month_mar:"Mar",month_apr:"Kwi",month_may:"Maj",month_jun:"Cze",month_jul:"Lip",month_aug:"Sie",month_sep:"Wrz",month_oct:"Pa\u017A",month_nov:"Lis",month_dec:"Gru",sensor_prediction:"Predykcja czujnika",degradation_trend:"Trend",trend_rising:"Rosn\u0105cy",trend_falling:"Malej\u0105cy",trend_stable:"Stabilny",trend_insufficient_data:"Niewystarczaj\u0105ce dane",days_until_threshold:"Dni do progu",threshold_exceeded:"Pr\xF3g przekroczony",environmental_adjustment:"Czynnik \u015Brodowiskowy",sensor_prediction_urgency:"Czujnik przewiduje pr\xF3g za ~{days} dni",day_short:"d",weibull_reliability_curve:"Krzywa niezawodno\u015Bci",weibull_failure_probability:"Prawdopodobie\u0144stwo awarii",weibull_r_squared:"Dopasowanie R\xB2",beta_early_failures:"Wczesne awarie",beta_random_failures:"Losowe awarie",beta_wear_out:"Zu\u017Cycie",beta_highly_predictable:"Wysoce przewidywalne",confidence_interval:"Przedzia\u0142 ufno\u015Bci",confidence_conservative:"Konserwatywny",confidence_aggressive:"Optymistyczny",current_interval_marker:"Bie\u017C\u0105cy interwa\u0142",recommended_marker:"Rekomendowany",characteristic_life:"Charakterystyczna \u017Cywotno\u015B\u0107",chart_mini_sparkline:"Wykres trendu",chart_history:"Historia koszt\xF3w i czasu trwania",chart_seasonal:"Czynniki sezonowe, 12 miesi\u0119cy",chart_weibull:"Krzywa niezawodno\u015Bci Weibulla",chart_sparkline:"Wykres warto\u015Bci wyzwalacza czujnika",days_progress:"Post\u0119p dni",qr_code:"Kod QR",qr_generating:"Generowanie kodu QR\u2026",qr_error:"Nie uda\u0142o si\u0119 wygenerowa\u0107 kodu QR.",qr_error_no_url:"Brak skonfigurowanego URL HA. Ustaw zewn\u0119trzny lub wewn\u0119trzny URL w Ustawienia \u2192 System \u2192 Sie\u0107.",save_error:"Nie uda\u0142o si\u0119 zapisa\u0107. Spr\xF3buj ponownie.",qr_print:"Drukuj",qr_download:"Pobierz SVG",qr_action:"Akcja przy skanowaniu",qr_action_view:"Wy\u015Bwietl informacje o konserwacji",qr_action_complete:"Oznacz konserwacj\u0119 jako wykonan\u0105",qr_url_mode:"Typ linku",qr_mode_companion:"Companion App",qr_mode_local:"Lokalny (mDNS)",qr_mode_server:"URL serwera",overview:"Przegl\u0105d",analysis:"Analiza",recent_activities:"Ostatnie aktywno\u015Bci",search_notes:"Szukaj w notatkach",avg_cost:"\u015Ar. koszt",no_advanced_features:"Brak w\u0142\u0105czonych funkcji zaawansowanych",no_advanced_features_hint:"W\u0142\u0105cz \u201EAdaptacyjne interwa\u0142y\u201D lub \u201EWzorce sezonowe\u201D w ustawieniach integracji, aby zobaczy\u0107 tutaj dane analityczne.",analysis_not_enough_data:"Jeszcze za ma\u0142o danych do analizy.",analysis_not_enough_data_hint:"Analiza Weibulla wymaga co najmniej 5 wykonanych konserwacji; wzorce sezonowe staj\u0105 si\u0119 widoczne po 6+ punktach danych na miesi\u0105c.",analysis_manual_task_hint:"Zadania r\u0119czne bez interwa\u0142u nie generuj\u0105 danych analitycznych.",completions:"wykonania",current:"Bie\u017C\u0105ce",shorter:"Kr\xF3tsze",longer:"D\u0142u\u017Csze",normal:"Normalne",disabled:"Wy\u0142\u0105czone",compound_logic:"Logika z\u0142o\u017Cona",card_title:"Tytu\u0142",card_show_header:"Poka\u017C nag\u0142\xF3wek ze statystykami",card_show_actions:"Poka\u017C przyciski akcji",card_compact:"Tryb kompaktowy",card_max_items:"Maks. element\xF3w (0 = wszystkie)",card_filter_status:"Filtruj wg statusu",card_filter_status_help:"Puste = poka\u017C wszystkie statusy.",card_filter_objects:"Filtruj wg obiekt\xF3w",card_filter_objects_help:"Puste = poka\u017C wszystkie obiekty.",card_filter_entities:"Filtruj wg encji (entity_ids)",card_filter_entities_help:"Wybierz encje sensor / binary_sensor z tej integracji. Puste = wszystkie.",card_loading_objects:"\u0141adowanie obiekt\xF3w\u2026",card_load_error:"Nie uda\u0142o si\u0119 za\u0142adowa\u0107 obiekt\xF3w \u2014 sprawd\u017A po\u0142\u0105czenie WebSocket.",card_no_tasks_title:"Brak zada\u0144 konserwacyjnych",card_no_tasks_cta:"\u2192 Utw\xF3rz w panelu Maintenance",no_objects:"Brak obiekt\xF3w.",action_error:"Akcja nie powiod\u0142a si\u0119. Spr\xF3buj ponownie.",area_id_optional:"Obszar (opcjonalny)",installation_date_optional:"Data instalacji (opcjonalna)",custom_icon_optional:"Ikona (opcjonalna, np. mdi:wrench)",task_enabled:"Zadanie w\u0142\u0105czone",skip_reason_prompt:"Pomin\u0105\u0107 to zadanie?",reason_optional:"Pow\xF3d (opcjonalny)",reset_date_prompt:"Oznaczy\u0107 zadanie jako wykonane?",reset_date_optional:"Data ostatniego wykonania (opcjonalna, domy\u015Blnie dzisiaj)",notes_label:"Notatki",documentation_label:"Dokumentacja",no_nfc_tag:"\u2014 Brak tagu \u2014",dashboard:"Pulpit",settings:"Ustawienia",settings_features:"Funkcje zaawansowane",settings_features_desc:"W\u0142\u0105cz lub wy\u0142\u0105cz funkcje zaawansowane. Wy\u0142\u0105czenie ukrywa je z UI, ale nie usuwa danych.",feat_adaptive:"Harmonogram adaptacyjny",feat_adaptive_desc:"Ucz si\u0119 optymalnych interwa\u0142\xF3w z historii konserwacji",feat_predictions:"Predykcje czujnik\xF3w",feat_predictions_desc:"Przewiduj daty wyzwolenia z degradacji czujnika",feat_seasonal:"Korekty sezonowe",feat_seasonal_desc:"Dostosuj interwa\u0142y do wzorc\xF3w sezonowych",feat_environmental:"Korelacja \u015Brodowiskowa",feat_environmental_desc:"Koreluj interwa\u0142y z temperatur\u0105/wilgotno\u015Bci\u0105",feat_budget:"\u015Aledzenie bud\u017Cetu",feat_budget_desc:"\u015Aled\u017A miesi\u0119czne i roczne wydatki na konserwacj\u0119",feat_groups:"Grupy zada\u0144",feat_groups_desc:"Organizuj zadania w grupy logiczne",feat_checklists:"Listy kontrolne",feat_checklists_desc:"Wieloetapowe procedury wykonania zadania",settings_general:"Og\xF3lne",settings_default_warning:"Domy\u015Blne dni ostrze\u017Cenia",settings_panel_enabled:"Panel boczny",settings_panel_title:"Tytu\u0142 panelu bocznego",settings_notifications:"Powiadomienia",settings_notify_service:"Us\u0142uga powiadomie\u0144",test_notification:"Powiadomienie testowe",send_test:"Wy\u015Blij test",testing:"Wysy\u0142anie\u2026",test_notification_success:"Powiadomienie testowe wys\u0142ane",test_notification_failed:"Powiadomienie testowe nie powiod\u0142o si\u0119",settings_notify_due_soon:"Powiadom gdy wkr\xF3tce",settings_notify_overdue:"Powiadom gdy zaleg\u0142e",settings_notify_triggered:"Powiadom gdy wyzwolone",settings_interval_hours:"Interwa\u0142 powtarzania (godziny, 0 = raz)",settings_quiet_hours:"Godziny ciszy",settings_quiet_start:"Pocz\u0105tek",settings_quiet_end:"Koniec",settings_max_per_day:"Maks. powiadomie\u0144 dziennie (0 = bez limitu)",settings_bundling:"Grupowanie powiadomie\u0144",settings_bundle_threshold:"Pr\xF3g grupowania",settings_actions:"Mobilne przyciski akcji",settings_action_complete:"Poka\u017C przycisk 'Wykonaj'",settings_action_skip:"Poka\u017C przycisk 'Pomi\u0144'",settings_action_snooze:"Poka\u017C przycisk 'Drzemka'",settings_snooze_hours:"Czas drzemki (godziny)",settings_budget:"Bud\u017Cet",settings_currency:"Waluta",settings_budget_monthly:"Bud\u017Cet miesi\u0119czny",settings_budget_yearly:"Bud\u017Cet roczny",settings_budget_alerts:"Alerty bud\u017Cetowe",settings_budget_threshold:"Pr\xF3g alertu (%)",settings_import_export:"Import / Eksport",settings_export_json:"Eksportuj JSON",settings_export_yaml:"Eksportuj YAML",settings_export_csv:"Eksportuj CSV",settings_import_csv:"Importuj CSV",settings_import_placeholder:"Wklej tutaj zawarto\u015B\u0107 JSON lub CSV\u2026",settings_import_btn:"Importuj",settings_import_success:"{count} obiekt\xF3w zaimportowanych pomy\u015Blnie.",settings_export_success:"Eksport pobrany.",settings_saved:"Ustawienie zapisane.",settings_include_history:"Do\u0142\u0105cz histori\u0119",sort_alphabetical:"Alfabetycznie",sort_due_soonest:"Najbli\u017Cszy termin",sort_task_count:"Liczba zada\u0144",sort_area:"Obszar",sort_assigned_user:"Przypisany u\u017Cytkownik",sort_group:"Grupa",groupby_none:"Bez grupowania",groupby_area:"Wg obszaru",groupby_group:"Wg grupy",groupby_user:"Wg u\u017Cytkownika",filter_label:"Filtr",user_label:"U\u017Cytkownik",sort_label:"Sortowanie",group_by_label:"Grupuj wg",state_value_help:'U\u017Cyj warto\u015Bci stanu HA (zwykle ma\u0142ymi literami, np. "on"/"off"). Wielko\u015B\u0107 liter jest normalizowana przy zapisie.',target_changes_help:"Liczba pasuj\u0105cych przej\u015B\u0107 przed wyzwoleniem (domy\u015Blnie: 1).",qr_print_title:"Drukuj kody QR",qr_print_desc:"Wygeneruj stron\u0119 do druku z kodami QR do wyci\u0119cia i naklejenia na sprz\u0119cie.",qr_print_load:"Za\u0142aduj obiekty",qr_print_filter:"Filtr",qr_print_objects:"Obiekty",qr_print_actions:"Akcje",qr_print_url_mode:"Typ linku",qr_print_estimate:"Szacowane kody QR",qr_print_over_limit:"limit 200, zaw\u0119\u017A filtr",qr_print_generate:"Generuj kody QR",qr_print_generating:"Generowanie\u2026",qr_print_ready:"Kody QR gotowe",qr_print_print_button:"Drukuj",qr_print_empty:"Nic do wygenerowania",qr_action_skip:"Pomi\u0144",vacation_title:"Tryb urlopowy",vacation_active:"aktywny",vacation_ended:"zako\u0144czony",vacation_desc:"Zaplanuj urlop: powiadomienia s\u0105 wstrzymane podczas okresu plus dni bufora. Mo\u017Cesz doda\u0107 wyj\u0105tki dla wybranych zada\u0144.",vacation_enable:"W\u0142\u0105cz tryb urlopowy",vacation_start:"Pocz\u0105tek",vacation_end:"Koniec",vacation_buffer:"Bufor (dni)",vacation_exempt_title:"Powiadamiaj mimo urlopu",vacation_exempt_desc:"Wybierz zadania, kt\xF3re maj\u0105 powiadamia\u0107 tak\u017Ce w czasie urlopu (np. krytyczna chemia basenu).",vacation_load_tasks:"Wczytaj zadania",vacation_preview_btn:"Poka\u017C podgl\u0105d",vacation_preview_affected:"zada\u0144 dotyczy",vacation_event_due_soon:"wkr\xF3tce b\u0119dzie wymagane",vacation_event_overdue:"stanie si\u0119 zaleg\u0142e",vacation_event_triggered_est:"mo\u017Cliwe wyzwolenie czujnika",vacation_sensor_based:"(czujnikowe)",vacation_action_notify:"Powiadamiaj mimo to",vacation_action_unsilence:"Ponownie wycisz",vacation_marked_complete:"Oznaczono jako wykonane",vacation_marked_skip:"Pomini\u0119to",vacation_end_now:"Zako\u0144cz urlop teraz",unassigned:"Nieprzypisane",no_area:"Brak obszaru",has_overdue:"Ma zaleg\u0142e zadania",object:"Obiekt",settings_panel_access:"Dost\u0119p do panelu",settings_panel_access_desc:"Administratorzy zawsze widz\u0105 pe\u0142ny panel. Wybierz tutaj u\u017Cytkownik\xF3w nie-admin, kt\xF3rzy r\xF3wnie\u017C powinni mie\u0107 pe\u0142ny dost\u0119p \u2014 pozostali widz\u0105 tylko Wykonaj i Pomi\u0144.",no_non_admin_users:"Nie znaleziono u\u017Cytkownik\xF3w nie-admin. Dodaj ich w Ustawienia \u2192 Osoby.",owner_label:"W\u0142a\u015Bciciel",feat_completion_actions:"Akcje po zako\u0144czeniu",feat_completion_actions_desc:"Akcja HA per zadanie po zako\u0144czeniu + QR szybkiego zako\u0144czenia z predefiniowanymi warto\u015Bciami.",on_complete_action_title:"Po zako\u0144czeniu: wywo\u0142aj akcj\u0119 HA (opcjonalnie)",on_complete_action_desc:"Wywo\u0142uje us\u0142ug\u0119 HA po zako\u0144czeniu zadania \u2014 np. zresetuj licznik urz\u0105dzenia.",on_complete_action_service:"Us\u0142uga",on_complete_action_target:"Encja docelowa",on_complete_action_data:"Dane (JSON, opcjonalnie)",on_complete_action_test:"Testuj akcj\u0119",on_complete_action_test_success:"Sukces",on_complete_action_test_failed:"B\u0142\u0105d",quick_complete_defaults_title:"Warto\u015Bci domy\u015Blne szybkiego zako\u0144czenia (dla skan\xF3w QR, opcjonalnie)",quick_complete_defaults_desc:"Predefiniowane warto\u015Bci dla QR szybkiego zako\u0144czenia. Bez nich QR otwiera okno dialogowe.",quick_complete_defaults_notes:"Notatki",quick_complete_defaults_cost:"Koszt",quick_complete_defaults_duration:"Czas trwania (minuty)",quick_complete_defaults_feedback_none:"Brak opinii",quick_complete_defaults_feedback_needed:"By\u0142o potrzebne",quick_complete_defaults_feedback_not_needed:"Nie by\u0142o potrzebne",quick_complete_success:"Szybko oznaczono jako wykonane",trigger_replaced:"Wyzwalacz zast\u0105piony",add:"Dodaj",show_stats:"Poka\u017C statystyki + wykresy",hide_stats:"Ukryj statystyki",adaptive_no_data:"Za ma\u0142o historii uko\u0144cze\u0144 do analizy adaptacyjnej. Wykonaj to zadanie jeszcze kilka razy, aby odblokowa\u0107 propozycje interwa\u0142u i wykresy niezawodno\u015Bci.",suggestion_applied:"Zastosowano sugerowany interwa\u0142",vacation_mode:"Tryb urlopowy",vacation_status_active:"Aktywny teraz",vacation_status_scheduled:"Zaplanowany",vacation_status_inactive:"Nieaktywny",vacation_end_now_confirm:"Zako\u0144czy\u0107 urlop natychmiast?",vacation_exempt_count:"wykluczone",vacation_advanced:"Zaawansowane\u2026",vacation_open_panel:"Otw\xF3rz w panelu",enable:"W\u0142\u0105cz",saved:"Zapisano",budget_monthly_set:"Ustaw miesi\u0119czny",budget_yearly_set:"Ustaw roczny",budget_advanced:"Waluta, alerty\u2026",budget_open_panel:"Otw\xF3rz w panelu",groups_empty:"Brak grup.",group_new_placeholder:"Dodaj grup\u0119\u2026",group_delete_confirm:"Usun\u0105\u0107 grup\u0119 \u201E{name}\u201D?",groups_manage_tasks:"Zarz\u0105dzaj przypisaniami zada\u0144\u2026",groups_open_panel:"Otw\xF3rz w panelu",on_complete_action_target_hint:"Uwaga: domena encji musi pasowa\u0107 do us\u0142ugi \u2014 np. 'button.press' dzia\u0142a tylko na button.*, 'counter.increment' tylko na counter.*, 'input_button.press' tylko na input_button.* itd. W przypadku niezgodno\u015Bci akcja po cichu si\u0119 nie wykona (HA zapisze w dzienniku 'Referenced entities ... missing or not currently available').",show_all_objects:"Poka\u017C wszystkie obiekty",show_all_tasks:"Wyczy\u015B\u0107 filtr \u2014 poka\u017C wszystkie zadania",filter_to_overdue:"Filtruj list\u0119 tylko do zaleg\u0142ych",filter_to_due_soon:"Filtruj list\u0119 tylko do zbli\u017Caj\u0105cych si\u0119 termin\xF3w",filter_to_triggered:"Filtruj list\u0119 tylko do wyzwolonych",open_task:"Otw\xF3rz zadanie",show_details:"Poka\u017C histori\u0119 + statystyki",hide_details:"Ukryj szczeg\xF3\u0142y",history_empty:"Brak historii.",history_edit_button:"Edytuj wpis",total_cost:"Koszt ca\u0142kowity",times_performed:"Wykonano",older_entries:"starsze",open_in_panel:"Otw\xF3rz w panelu Konserwacja",skip_reason:"Pow\xF3d pomini\u0119cia (opcjonalnie)",reset_to_date:"Zresetuj ostatnie wykonanie na",delete_task_confirm:"Usun\u0105\u0107 to zadanie i jego histori\u0119?",delete_object_confirm:"Usun\u0105\u0107 ten obiekt i wszystkie jego zadania?",loading:"\u0141adowanie\u2026"},Na={maintenance:"\xDAdr\u017Eba",objects:"Objekty",tasks:"\xDAkoly",overdue:"Po term\xEDnu",due_soon:"Brzy",triggered:"Spu\u0161t\u011Bno",ok:"OK",all:"V\u0161e",new_object:"+ Nov\xFD objekt",edit:"Upravit",delete:"Smazat",add_task:"+ P\u0159idat \xFAkol",complete:"Dokon\u010Dit",completed:"Dokon\u010Deno",skip:"P\u0159esko\u010Dit",skipped:"P\u0159esko\u010Deno",reset:"Reset",cancel:"Zru\u0161it",completing:"Dokon\u010Dov\xE1n\xED\u2026",interval:"Interval",warning:"Upozorn\u011Bn\xED",last_performed:"Naposledy provedeno",next_due:"Dal\u0161\xED term\xEDn",days_until_due:"Dn\u016F do term\xEDnu",avg_duration:"Pr\u016Fm. trv\xE1n\xED",trigger:"Spou\u0161t\u011B\u010D",trigger_type:"Typ spou\u0161t\u011B\u010De",threshold_above:"Horn\xED limit",threshold_below:"Doln\xED limit",threshold:"Pr\xE1h",counter:"\u010C\xEDta\u010D",state_change:"Zm\u011Bna stavu",runtime:"Doba b\u011Bhu",runtime_hours:"C\xEDlov\xE1 doba b\u011Bhu (hodiny)",target_value:"C\xEDlov\xE1 hodnota",baseline:"Z\xE1kladn\xED hodnota",target_changes:"C\xEDlov\xFD po\u010Det zm\u011Bn",for_minutes:"Po dobu (minut)",time_based:"\u010Casov\xFD",sensor_based:"Zalo\u017Een\xFD na senzoru",manual:"Manu\xE1ln\xED",one_time:"Jednor\xE1zov\u011B",weekdays:"Dny v t\xFDdnu",nth_weekday:"N-t\xFD den v t\xFDdnu v m\u011Bs\xEDci",day_of_month:"Den v m\u011Bs\xEDci",recurrence_on_days:"Opakovat v",recurrence_occurrence:"V\xFDskyt",recurrence_weekday:"Den v t\xFDdnu",recurrence_day:"Den v m\u011Bs\xEDci (1\u201331)",ord_1:"1.",ord_2:"2.",ord_3:"3.",ord_4:"4.",ord_5:"5.",ord_last:"Posledn\xED",day_word:"Den",interval_value:"Interval",interval_unit:"Jednotka",unit_days:"Dny",unit_weeks:"T\xFDdny",unit_months:"M\u011Bs\xEDce",unit_years:"Roky",due_date:"Datum spln\u011Bn\xED",cleaning:"\u010Ci\u0161t\u011Bn\xED",inspection:"Inspekce",replacement:"V\xFDm\u011Bna",calibration:"Kalibrace",service:"Servis",custom:"Vlastn\xED",history:"Historie",cost:"N\xE1klady",duration:"Doba trv\xE1n\xED",both:"Oboj\xED",trigger_val:"Hodnota spou\u0161t\u011B\u010De",complete_title:"Dokon\u010Dit: ",checklist:"Kontroln\xED seznam",checklist_steps_optional:"Kroky kontroln\xEDho seznamu (voliteln\xE9)",checklist_placeholder:`Vy\u010Distit filtr
Vym\u011Bnit t\u011Bsn\u011Bn\xED
Otestovat tlak`,checklist_help:"Jeden krok na \u0159\xE1dek. Max 100 polo\u017Eek.",err_too_long:"{field}: p\u0159\xEDli\u0161 dlouh\xE9 (max {n} znak\u016F)",err_too_short:"{field}: p\u0159\xEDli\u0161 kr\xE1tk\xE9 (min {n} znak\u016F)",err_value_too_high:"{field}: p\u0159\xEDli\u0161 velk\xE9 (max {n})",err_value_too_low:"{field}: p\u0159\xEDli\u0161 mal\xE9 (min {n})",err_required:"{field}: povinn\xE9",err_wrong_type:"{field}: \u0161patn\xFD typ (o\u010Dek\xE1v\xE1n: {type})",err_invalid_choice:"{field}: nepovolen\xE1 hodnota",err_invalid_value:"{field}: neplatn\xE1 hodnota",feat_schedule_time:"Pl\xE1nov\xE1n\xED podle denn\xED doby",feat_schedule_time_desc:"\xDAkoly se stanou po term\xEDnu v ur\u010Denou denn\xED dobu m\xEDsto o p\u016Flnoci.",schedule_time_optional:"Term\xEDn v \u010Dase (voliteln\xE9, HH:MM)",schedule_time_help:"Pr\xE1zdn\xE9 = p\u016Flnoc (v\xFDchoz\xED). \u010Casov\xE9 p\xE1smo HA.",at_time:"v",notes_optional:"Pozn\xE1mky (voliteln\xE9)",cost_optional:"N\xE1klady (voliteln\xE9)",duration_minutes:"Doba trv\xE1n\xED v minut\xE1ch (voliteln\xE9)",days:"dn\xED",day:"den",today:"Dnes",d_overdue:"d po term\xEDnu",no_tasks:"Zat\xEDm \u017E\xE1dn\xE9 \xFAkoly \xFAdr\u017Eby. Vytvo\u0159te objekt pro za\u010D\xE1tek.",no_tasks_short:"\u017D\xE1dn\xE9 \xFAkoly",no_history:"Zat\xEDm \u017E\xE1dn\xE9 z\xE1znamy historie.",show_all:"Zobrazit v\u0161e",cost_duration_chart:"N\xE1klady a doba trv\xE1n\xED",installed:"Nainstalov\xE1no",confirm_delete_object:"Smazat tento objekt a v\u0161echny jeho \xFAkoly?",confirm_delete_task:"Smazat tento \xFAkol?",min:"Min",max:"Max",save:"Ulo\u017Eit",saving:"Ukl\xE1d\xE1n\xED\u2026",edit_task:"Upravit \xFAkol",new_task:"Nov\xFD \xFAkol \xFAdr\u017Eby",task_name:"N\xE1zev \xFAkolu",maintenance_type:"Typ \xFAdr\u017Eby",schedule_type:"Typ rozvrhu",interval_days:"Interval (dny)",warning_days:"Dny upozorn\u011Bn\xED",last_performed_optional:"Naposledy provedeno (voliteln\xE9)",interval_anchor:"Ukotven\xED intervalu",anchor_completion:"Od data dokon\u010Den\xED",anchor_planned:"Od pl\xE1novan\xE9ho data (bez posunu)",edit_object:"Upravit objekt",name:"N\xE1zev",manufacturer_optional:"V\xFDrobce (voliteln\xE9)",model_optional:"Model (voliteln\xE9)",serial_number_optional:"S\xE9riov\xE9 \u010D\xEDslo (voliteln\xE9)",serial_number_label:"S/N",documentation_url_label:"N\xE1vod",object_notes_label:"Pozn\xE1mky",sort_due_date:"Term\xEDn",sort_object:"N\xE1zev objektu",sort_type:"Typ",sort_task_name:"N\xE1zev \xFAkolu",all_objects:"V\u0161echny objekty",tasks_lower:"\xFAkol\u016F",no_tasks_yet:"Zat\xEDm \u017E\xE1dn\xE9 \xFAkoly",add_first_task:"P\u0159idat prvn\xED \xFAkol",trigger_configuration:"Konfigurace spou\u0161t\u011B\u010De",entity_id:"ID entity",comma_separated:"odd\u011Blen\xE9 \u010D\xE1rkami",entity_logic:"Logika entit",entity_logic_any:"Spust\xED libovoln\xE1 entita",entity_logic_all:"V\u0161echny entity mus\xED spustit",entities:"entity",attribute_optional:"Atribut (voliteln\xFD, pr\xE1zdn\xFD = stav)",use_entity_state:"Pou\u017E\xEDt stav entity (bez atributu)",trigger_above:"Spustit nad",trigger_below:"Spustit pod",for_at_least_minutes:"Po dobu alespo\u0148 (minut)",safety_interval_days:"Bezpe\u010Dnostn\xED interval (dny, voliteln\xFD)",safety_interval:"Bezpe\u010Dnostn\xED interval (voliteln\xFD)",delta_mode:"Re\u017Eim delta",from_state_optional:"Ze stavu (voliteln\xE9)",to_state_optional:"Do stavu (voliteln\xE9)",documentation_url_optional:"URL dokumentace (voliteln\xE9)",object_notes_optional:"Pozn\xE1mky (voliteln\xE9)",nfc_tag_id_optional:"ID NFC tagu (voliteln\xE9)",nfc_tags_empty_help:"V Home Assistant zat\xEDm nejsou registrov\xE1ny \u017E\xE1dn\xE9 NFC tagy.",nfc_tags_open_settings:"Otev\u0159\xEDt nastaven\xED tag\u016F",nfc_tags_refresh:"Obnovit",environmental_entity_optional:"Senzor prost\u0159ed\xED (voliteln\xFD)",environmental_entity_helper:"nap\u0159. sensor.outdoor_temperature \u2014 upravuje interval podle podm\xEDnek prost\u0159ed\xED",environmental_attribute_optional:"Atribut prost\u0159ed\xED (voliteln\xFD)",nfc_tag_id:"ID NFC tagu",nfc_linked:"NFC tag propojen",nfc_link_hint:"Klikn\u011Bte pro propojen\xED NFC tagu",responsible_user:"Zodpov\u011Bdn\xFD u\u017Eivatel",no_user_assigned:"(\u017D\xE1dn\xFD u\u017Eivatel p\u0159i\u0159azen)",all_users:"V\u0161ichni u\u017Eivatel\xE9",my_tasks:"Moje \xFAkoly",tab_calendar:"Kalend\xE1\u0159",cal_no_events:"Bez \xFAdr\u017Eby",cal_window_7:"7 dn\xED",cal_window_14:"14 dn\xED",cal_window_30:"30 dn\xED",cal_window_365:"1 rok",cal_every_n_days:"ka\u017Ed\xFDch {n} dn\xED",cal_source_time:"\u010Cas",cal_source_time_adaptive:"\u010Cas (adaptivn\xED)",cal_source_sensor:"Senzor",cal_predicted:"predikce",cal_confidence_high:"vysok\xE1 p\u0159esnost",cal_confidence_medium:"st\u0159edn\xED p\u0159esnost",cal_confidence_low:"n\xEDzk\xE1 p\u0159esnost",budget_monthly:"M\u011Bs\xED\u010Dn\xED rozpo\u010Det",budget_yearly:"Ro\u010Dn\xED rozpo\u010Det",groups:"Skupiny",new_group:"Nov\xE1 skupina",edit_group:"Upravit skupinu",no_groups:"Zat\xEDm \u017E\xE1dn\xE9 skupiny",delete_group:"Smazat skupinu",delete_group_confirm:"Smazat skupinu '{name}'?",group_select_tasks:"Vybrat \xFAkoly",group_name_required:"N\xE1zev je povinn\xFD",description_optional:"Popis (voliteln\xFD)",selected:"Vybr\xE1no",loading_chart:"Na\u010D\xEDt\xE1n\xED dat grafu...",was_maintenance_needed:"Byla tato \xFAdr\u017Eba pot\u0159eba?",feedback_needed:"Pot\u0159ebn\xE1",feedback_not_needed:"Nepot\u0159ebn\xE1",feedback_not_sure:"Nejsem si jist\xFD",suggested_interval:"Navrhovan\xFD interval",apply_suggestion:"Pou\u017E\xEDt",reanalyze:"Znovu analyzovat",reanalyze_result:"Nov\xE1 anal\xFDza",reanalyze_insufficient_data:"Nedostatek dat pro vytvo\u0159en\xED doporu\u010Den\xED",data_points:"datov\xFDch bod\u016F",dismiss_suggestion:"Zav\u0159\xEDt",confidence_low:"N\xEDzk\xE1",confidence_medium:"St\u0159edn\xED",confidence_high:"Vysok\xE1",recommended:"doporu\u010Deno",seasonal_awareness:"Sez\xF3nn\xED pov\u011Bdom\xED",edit_seasonal_overrides:"Upravit sez\xF3nn\xED faktory",seasonal_overrides_title:"Sez\xF3nn\xED faktory (p\u0159eps\xE1n\xED)",seasonal_overrides_hint:"Faktor na m\u011Bs\xEDc (0.1\u20135.0). Pr\xE1zdn\xE9 = nau\u010Deno automaticky.",seasonal_override_invalid:"Neplatn\xE1 hodnota",seasonal_override_range:"Faktor mus\xED b\xFDt mezi 0.1 a 5.0",clear_all:"Vymazat v\u0161e",seasonal_chart_title:"Sez\xF3nn\xED faktory",seasonal_learned:"Nau\u010Den\xE9",seasonal_manual:"Manu\xE1ln\xED",month_jan:"Led",month_feb:"\xDAno",month_mar:"B\u0159e",month_apr:"Dub",month_may:"Kv\u011B",month_jun:"\u010Cer",month_jul:"\u010Cvc",month_aug:"Srp",month_sep:"Z\xE1\u0159",month_oct:"\u0158\xEDj",month_nov:"Lis",month_dec:"Pro",sensor_prediction:"Predikce senzoru",degradation_trend:"Trend",trend_rising:"Rostouc\xED",trend_falling:"Klesaj\xEDc\xED",trend_stable:"Stabiln\xED",trend_insufficient_data:"Nedostatek dat",days_until_threshold:"Dn\u016F do prahu",threshold_exceeded:"Pr\xE1h p\u0159ekro\u010Den",environmental_adjustment:"Faktor prost\u0159ed\xED",sensor_prediction_urgency:"Senzor p\u0159edpov\xEDd\xE1 pr\xE1h za ~{days} dn\xED",day_short:"d",weibull_reliability_curve:"K\u0159ivka spolehlivosti",weibull_failure_probability:"Pravd\u011Bpodobnost selh\xE1n\xED",weibull_r_squared:"Shoda R\xB2",beta_early_failures:"\u010Casn\xE1 selh\xE1n\xED",beta_random_failures:"N\xE1hodn\xE1 selh\xE1n\xED",beta_wear_out:"Opot\u0159eben\xED",beta_highly_predictable:"Vysoce p\u0159edv\xEDdateln\xE9",confidence_interval:"Interval spolehlivosti",confidence_conservative:"Konzervativn\xED",confidence_aggressive:"Optimistick\xFD",current_interval_marker:"Aktu\xE1ln\xED interval",recommended_marker:"Doporu\u010Den\xFD",characteristic_life:"Charakteristick\xE1 \u017Eivotnost",chart_mini_sparkline:"Graf trendu",chart_history:"Historie n\xE1klad\u016F a doby trv\xE1n\xED",chart_seasonal:"Sez\xF3nn\xED faktory, 12 m\u011Bs\xEDc\u016F",chart_weibull:"Weibullova k\u0159ivka spolehlivosti",chart_sparkline:"Graf hodnoty spou\u0161t\u011B\u010De senzoru",days_progress:"Postup dn\u016F",qr_code:"QR k\xF3d",qr_generating:"Generov\xE1n\xED QR k\xF3du\u2026",qr_error:"Nepoda\u0159ilo se vygenerovat QR k\xF3d.",qr_error_no_url:"Nen\xED nakonfigurov\xE1no URL HA. Nastavte extern\xED nebo intern\xED URL v Nastaven\xED \u2192 Syst\xE9m \u2192 S\xED\u0165.",save_error:"Nepoda\u0159ilo se ulo\u017Eit. Zkuste to znovu.",qr_print:"Tisk",qr_download:"St\xE1hnout SVG",qr_action:"Akce p\u0159i skenov\xE1n\xED",qr_action_view:"Zobrazit informace o \xFAdr\u017Eb\u011B",qr_action_complete:"Ozna\u010Dit \xFAdr\u017Ebu jako dokon\u010Denou",qr_url_mode:"Typ odkazu",qr_mode_companion:"Companion App",qr_mode_local:"Lok\xE1ln\xED (mDNS)",qr_mode_server:"URL serveru",overview:"P\u0159ehled",analysis:"Anal\xFDza",recent_activities:"Ned\xE1vn\xE9 aktivity",search_notes:"Hledat v pozn\xE1mk\xE1ch",avg_cost:"Pr\u016Fm. n\xE1klady",no_advanced_features:"\u017D\xE1dn\xE9 pokro\u010Dil\xE9 funkce nejsou povoleny",no_advanced_features_hint:"Povolte \u201EAdaptivn\xED intervaly\u201D nebo \u201ESez\xF3nn\xED vzory\u201D v nastaven\xED integrace pro zobrazen\xED analytick\xFDch dat.",analysis_not_enough_data:"Zat\xEDm nedostatek dat pro anal\xFDzu.",analysis_not_enough_data_hint:"Weibullova anal\xFDza vy\u017Eaduje alespo\u0148 5 dokon\u010Den\xFDch \xFAdr\u017Eeb; sez\xF3nn\xED vzory se stanou viditeln\xE9 po 6+ datov\xFDch bodech na m\u011Bs\xEDc.",analysis_manual_task_hint:"Manu\xE1ln\xED \xFAkoly bez intervalu negeneruj\xED analytick\xE1 data.",completions:"dokon\u010Den\xED",current:"Aktu\xE1ln\xED",shorter:"Krat\u0161\xED",longer:"Del\u0161\xED",normal:"Norm\xE1ln\xED",disabled:"Zak\xE1z\xE1no",compound_logic:"Slo\u017Een\xE1 logika",card_title:"N\xE1zev",card_show_header:"Zobrazit z\xE1hlav\xED se statistikami",card_show_actions:"Zobrazit tla\u010D\xEDtka akc\xED",card_compact:"Kompaktn\xED re\u017Eim",card_max_items:"Max polo\u017Eek (0 = v\u0161e)",card_filter_status:"Filtrovat podle stavu",card_filter_status_help:"Pr\xE1zdn\xE9 = zobrazit v\u0161echny stavy.",card_filter_objects:"Filtrovat podle objekt\u016F",card_filter_objects_help:"Pr\xE1zdn\xE9 = zobrazit v\u0161echny objekty.",card_filter_entities:"Filtrovat podle entit (entity_ids)",card_filter_entities_help:"Vyberte entity sensor / binary_sensor z t\xE9to integrace. Pr\xE1zdn\xE9 = v\u0161echny.",card_loading_objects:"Na\u010D\xEDt\xE1n\xED objekt\u016F\u2026",card_load_error:"Nepoda\u0159ilo se na\u010D\xEDst objekty \u2014 zkontrolujte WebSocket spojen\xED.",card_no_tasks_title:"Zat\xEDm \u017E\xE1dn\xE9 \xFAkoly \xFAdr\u017Eby",card_no_tasks_cta:"\u2192 Vytvo\u0159te v panelu Maintenance",no_objects:"Zat\xEDm \u017E\xE1dn\xE9 objekty.",action_error:"Akce se nezda\u0159ila. Zkuste to znovu.",area_id_optional:"Oblast (voliteln\xE1)",installation_date_optional:"Datum instalace (voliteln\xE9)",custom_icon_optional:"Ikona (voliteln\xE1, nap\u0159. mdi:wrench)",task_enabled:"\xDAkol povolen",skip_reason_prompt:"P\u0159esko\u010Dit tento \xFAkol?",reason_optional:"D\u016Fvod (voliteln\xFD)",reset_date_prompt:"Ozna\u010Dit \xFAkol jako proveden\xFD?",reset_date_optional:"Datum posledn\xEDho proveden\xED (voliteln\xE9, v\xFDchoz\xED dnes)",notes_label:"Pozn\xE1mky",documentation_label:"Dokumentace",no_nfc_tag:"\u2014 \u017D\xE1dn\xFD tag \u2014",dashboard:"P\u0159ehled",settings:"Nastaven\xED",settings_features:"Pokro\u010Dil\xE9 funkce",settings_features_desc:"Povolte nebo zaka\u017Ete pokro\u010Dil\xE9 funkce. Zak\xE1z\xE1n\xED je skryje z UI, ale nesma\u017Ee data.",feat_adaptive:"Adaptivn\xED pl\xE1nov\xE1n\xED",feat_adaptive_desc:"U\u010Dte se optim\xE1ln\xED intervaly z historie \xFAdr\u017Eby",feat_predictions:"Predikce senzor\u016F",feat_predictions_desc:"P\u0159edpov\xEDdejte term\xEDny spou\u0161t\u011Bn\xED z degradace senzoru",feat_seasonal:"Sez\xF3nn\xED \xFApravy",feat_seasonal_desc:"Upravte intervaly podle sez\xF3nn\xEDch vzor\u016F",feat_environmental:"Korelace s prost\u0159ed\xEDm",feat_environmental_desc:"Korelujte intervaly s teplotou/vlhkost\xED",feat_budget:"Sledov\xE1n\xED rozpo\u010Dtu",feat_budget_desc:"Sledujte m\u011Bs\xED\u010Dn\xED a ro\u010Dn\xED v\xFDdaje na \xFAdr\u017Ebu",feat_groups:"Skupiny \xFAkol\u016F",feat_groups_desc:"Organizujte \xFAkoly do logick\xFDch skupin",feat_checklists:"Kontroln\xED seznamy",feat_checklists_desc:"V\xEDcestup\u0148ov\xE9 procedury pro dokon\u010Den\xED \xFAkolu",settings_general:"Obecn\xE9",settings_default_warning:"V\xFDchoz\xED dny upozorn\u011Bn\xED",settings_panel_enabled:"Bo\u010Dn\xED panel",settings_panel_title:"N\xE1zev panelu",settings_notifications:"Ozn\xE1men\xED",settings_notify_service:"Slu\u017Eba ozn\xE1men\xED",test_notification:"Testovac\xED ozn\xE1men\xED",send_test:"Odeslat test",testing:"Odes\xEDl\xE1n\xED\u2026",test_notification_success:"Testovac\xED ozn\xE1men\xED odesl\xE1no",test_notification_failed:"Testovac\xED ozn\xE1men\xED se nezda\u0159ilo",settings_notify_due_soon:"Ozn\xE1mit kdy\u017E brzy",settings_notify_overdue:"Ozn\xE1mit kdy\u017E po term\xEDnu",settings_notify_triggered:"Ozn\xE1mit kdy\u017E spu\u0161t\u011Bno",settings_interval_hours:"Interval opakov\xE1n\xED (hodiny, 0 = jednou)",settings_quiet_hours:"Tich\xE9 hodiny",settings_quiet_start:"Za\u010D\xE1tek",settings_quiet_end:"Konec",settings_max_per_day:"Max ozn\xE1men\xED denn\u011B (0 = bez limitu)",settings_bundling:"Seskupit ozn\xE1men\xED",settings_bundle_threshold:"Pr\xE1h seskupen\xED",settings_actions:"Mobiln\xED ak\u010Dn\xED tla\u010D\xEDtka",settings_action_complete:"Zobrazit tla\u010D\xEDtko 'Dokon\u010Dit'",settings_action_skip:"Zobrazit tla\u010D\xEDtko 'P\u0159esko\u010Dit'",settings_action_snooze:"Zobrazit tla\u010D\xEDtko 'Odlo\u017Eit'",settings_snooze_hours:"Doba odlo\u017Een\xED (hodiny)",settings_budget:"Rozpo\u010Det",settings_currency:"M\u011Bna",settings_budget_monthly:"M\u011Bs\xED\u010Dn\xED rozpo\u010Det",settings_budget_yearly:"Ro\u010Dn\xED rozpo\u010Det",settings_budget_alerts:"Rozpo\u010Dtov\xE1 upozorn\u011Bn\xED",settings_budget_threshold:"Pr\xE1h upozorn\u011Bn\xED (%)",settings_import_export:"Import / Export",settings_export_json:"Exportovat JSON",settings_export_yaml:"Exportovat YAML",settings_export_csv:"Exportovat CSV",settings_import_csv:"Importovat CSV",settings_import_placeholder:"Vlo\u017Ete sem obsah JSON nebo CSV\u2026",settings_import_btn:"Importovat",settings_import_success:"{count} objekt\u016F \xFAsp\u011B\u0161n\u011B importov\xE1no.",settings_export_success:"Export sta\u017Een.",settings_saved:"Nastaven\xED ulo\u017Eeno.",settings_include_history:"Zahrnout historii",sort_alphabetical:"Abecedn\u011B",sort_due_soonest:"Nejbli\u017E\u0161\xED term\xEDn",sort_task_count:"Po\u010Det \xFAkol\u016F",sort_area:"Oblast",sort_assigned_user:"P\u0159i\u0159azen\xFD u\u017Eivatel",sort_group:"Skupina",groupby_none:"Bez seskupen\xED",groupby_area:"Podle oblasti",groupby_group:"Podle skupiny",groupby_user:"Podle u\u017Eivatele",filter_label:"Filtr",user_label:"U\u017Eivatel",sort_label:"\u0158azen\xED",group_by_label:"Seskupit podle",state_value_help:'Pou\u017Eijte hodnotu stavu HA (obvykle mal\xFDmi p\xEDsmeny, nap\u0159. "on"/"off"). Velikost p\xEDsmen se p\u0159i ulo\u017Een\xED normalizuje.',target_changes_help:"Po\u010Det odpov\xEDdaj\xEDc\xEDch p\u0159echod\u016F, po kter\xFDch se trigger spust\xED (v\xFDchoz\xED: 1).",qr_print_title:"Tisk QR k\xF3d\u016F",qr_print_desc:"Vygeneruj tiskovou str\xE1nku s QR k\xF3dy k vyst\u0159i\u017Een\xED a nalepen\xED na za\u0159\xEDzen\xED.",qr_print_load:"Na\u010D\xEDst objekty",qr_print_filter:"Filtr",qr_print_objects:"Objekty",qr_print_actions:"Akce",qr_print_url_mode:"Typ odkazu",qr_print_estimate:"Odhad QR k\xF3d\u016F",qr_print_over_limit:"limit 200, zu\u017Ete filtr",qr_print_generate:"Vygenerovat QR k\xF3dy",qr_print_generating:"Generov\xE1n\xED\u2026",qr_print_ready:"QR k\xF3dy p\u0159ipraveny",qr_print_print_button:"Tisk",qr_print_empty:"Nic k vygenerov\xE1n\xED",qr_action_skip:"P\u0159esko\u010Dit",vacation_title:"Re\u017Eim dovolen\xE9",vacation_active:"aktivn\xED",vacation_ended:"ukon\u010Deno",vacation_desc:"Napl\xE1nuj dovolenou: ozn\xE1men\xED jsou pozastavena b\u011Bhem obdob\xED plus dny rezervy. Lze definovat v\xFDjimky pro jednotliv\xE9 \xFAkoly.",vacation_enable:"Zapnout re\u017Eim dovolen\xE9",vacation_start:"Za\u010D\xE1tek",vacation_end:"Konec",vacation_buffer:"Rezerva (dn\u016F)",vacation_exempt_title:"Upozor\u0148ovat i p\u0159es dovolenou",vacation_exempt_desc:"Vyber \xFAkoly, kter\xE9 maj\xED upozor\u0148ovat i b\u011Bhem dovolen\xE9 (nap\u0159. kritick\xE1 chemie baz\xE9nu).",vacation_load_tasks:"Na\u010D\xEDst \xFAkoly",vacation_preview_btn:"Zobrazit n\xE1hled",vacation_preview_affected:"\xFAkol\u016F ovlivn\u011Bno",vacation_event_due_soon:"bl\xED\u017E\xED se term\xEDn",vacation_event_overdue:"stane se po term\xEDnu",vacation_event_triggered_est:"mo\u017En\xE9 spu\u0161t\u011Bn\xED senzoru",vacation_sensor_based:"(senzorov\xE9)",vacation_action_notify:"P\u0159esto upozornit",vacation_action_unsilence:"Znovu ztlumit",vacation_marked_complete:"Ozna\u010Deno jako dokon\u010Den\xE9",vacation_marked_skip:"P\u0159esko\u010Deno",vacation_end_now:"Ukon\u010Dit dovolenou nyn\xED",unassigned:"Nep\u0159i\u0159azeno",no_area:"Bez oblasti",has_overdue:"M\xE1 \xFAkoly po term\xEDnu",object:"Objekt",settings_panel_access:"P\u0159\xEDstup k panelu",settings_panel_access_desc:"Administr\xE1to\u0159i v\u017Edy vid\xED cel\xFD panel. Vyberte zde u\u017Eivatele bez admin pr\xE1v, kte\u0159\xED by m\u011Bli tak\xE9 m\xEDt pln\xFD p\u0159\xEDstup \u2014 ostatn\xED vid\xED pouze Dokon\u010Dit a P\u0159esko\u010Dit.",no_non_admin_users:"Nenalezeni \u017E\xE1dn\xED u\u017Eivatel\xE9 bez admin pr\xE1v. P\u0159idejte je v Nastaven\xED \u2192 Lid\xE9.",owner_label:"Vlastn\xEDk",feat_completion_actions:"Akce p\u0159i dokon\u010Den\xED",feat_completion_actions_desc:"Akce HA na \xFAlohu p\u0159i dokon\u010Den\xED + QR rychl\xE9ho dokon\u010Den\xED s p\u0159edvolen\xFDmi hodnotami.",on_complete_action_title:"P\u0159i dokon\u010Den\xED: spustit akci HA (voliteln\xE9)",on_complete_action_desc:"Vol\xE1 slu\u017Ebu HA, kdy\u017E je \xFAloha dokon\u010Dena \u2014 nap\u0159. resetuje \u010D\xEDta\u010D na za\u0159\xEDzen\xED.",on_complete_action_service:"Slu\u017Eba",on_complete_action_target:"C\xEDlov\xE1 entita",on_complete_action_data:"Data (JSON, voliteln\xE9)",on_complete_action_test:"Testovat akci",on_complete_action_test_success:"\xDAsp\u011Bch",on_complete_action_test_failed:"Selhalo",quick_complete_defaults_title:"V\xFDchoz\xED hodnoty rychl\xE9ho dokon\u010Den\xED (pro QR sken\u016F, voliteln\xE9)",quick_complete_defaults_desc:"P\u0159edvolen\xE9 hodnoty pro QR rychl\xE9ho dokon\u010Den\xED. Bez nich QR otev\u0159e dialog.",quick_complete_defaults_notes:"Pozn\xE1mky",quick_complete_defaults_cost:"Cena",quick_complete_defaults_duration:"Trv\xE1n\xED (minuty)",quick_complete_defaults_feedback_none:"Bez zp\u011Btn\xE9 vazby",quick_complete_defaults_feedback_needed:"Bylo pot\u0159eba",quick_complete_defaults_feedback_not_needed:"Nebylo pot\u0159eba",quick_complete_success:"Rychle ozna\u010Deno jako hotov\xE9",trigger_replaced:"Spou\u0161t\u011B\u010D nahrazen",add:"P\u0159idat",show_stats:"Zobrazit statistiky + grafy",hide_stats:"Skr\xFDt statistiky",adaptive_no_data:"Zat\xEDm nen\xED dostatek historie dokon\u010Den\xED pro adaptivn\xED anal\xFDzu. Dokon\u010Dete tento \xFAkol je\u0161t\u011B n\u011Bkolikr\xE1t, abyste odemkli doporu\u010Den\xED intervalu a grafy spolehlivosti.",suggestion_applied:"Navr\u017Een\xFD interval pou\u017Eit",vacation_mode:"Re\u017Eim dovolen\xE9",vacation_status_active:"Nyn\xED aktivn\xED",vacation_status_scheduled:"Napl\xE1nov\xE1no",vacation_status_inactive:"Neaktivn\xED",vacation_end_now_confirm:"Ukon\u010Dit dovolenou okam\u017Eit\u011B?",vacation_exempt_count:"vy\u0148ato",vacation_advanced:"Pokro\u010Dil\xE9\u2026",vacation_open_panel:"Otev\u0159\xEDt v panelu",enable:"Zapnout",saved:"Ulo\u017Eeno",budget_monthly_set:"Nastavit m\u011Bs\xED\u010Dn\xED",budget_yearly_set:"Nastavit ro\u010Dn\xED",budget_advanced:"M\u011Bna, v\xFDstrahy\u2026",budget_open_panel:"Otev\u0159\xEDt v panelu",groups_empty:"Zat\xEDm \u017E\xE1dn\xE9 skupiny.",group_new_placeholder:"P\u0159idat skupinu\u2026",group_delete_confirm:'Smazat skupinu \u201E{name}"?',groups_manage_tasks:"Spravovat p\u0159i\u0159azen\xED \xFAkol\u016F\u2026",groups_open_panel:"Otev\u0159\xEDt v panelu",on_complete_action_target_hint:"Pozn\xE1mka: dom\xE9na entity mus\xED odpov\xEDdat slu\u017Eb\u011B \u2014 nap\u0159. 'button.press' funguje jen na button.*, 'counter.increment' jen na counter.*, 'input_button.press' jen na input_button.* atd. P\u0159i neshod\u011B akce ti\u0161e sel\u017Ee (HA zaznamen\xE1 'Referenced entities ... missing or not currently available').",show_all_objects:"Zobrazit v\u0161echny objekty",show_all_tasks:"Vymazat filtr \u2014 zobrazit v\u0161echny \xFAkoly",filter_to_overdue:"Filtrovat seznam jen na po term\xEDnu",filter_to_due_soon:"Filtrovat seznam jen na bl\xED\u017E\xEDc\xED se term\xEDn",filter_to_triggered:"Filtrovat seznam jen na spu\u0161t\u011Bn\xE9",open_task:"Otev\u0159\xEDt \xFAkol",show_details:"Zobrazit historii + statistiky",hide_details:"Skr\xFDt podrobnosti",history_empty:"Zat\xEDm \u017E\xE1dn\xE1 historie.",history_edit_button:"Upravit z\xE1znam",total_cost:"Celkov\xE9 n\xE1klady",times_performed:"Provedeno",older_entries:"star\u0161\xED",open_in_panel:"Otev\u0159\xEDt v panelu \xDAdr\u017Eba",skip_reason:"D\u016Fvod p\u0159esko\u010Den\xED (voliteln\xE9)",reset_to_date:"Resetovat posledn\xED proveden\xED na",delete_task_confirm:"Smazat tento \xFAkol a jeho historii?",delete_object_confirm:"Smazat tento objekt a v\u0161echny jeho \xFAkoly?",loading:"Na\u010D\xEDt\xE1n\xED\u2026"},Ta={maintenance:"Underh\xE5ll",objects:"Objekt",tasks:"Uppgifter",overdue:"F\xF6rsenad",due_soon:"Snart",triggered:"Utl\xF6st",ok:"OK",all:"Alla",new_object:"+ Nytt objekt",edit:"Redigera",delete:"Ta bort",add_task:"+ L\xE4gg till uppgift",complete:"Slutf\xF6r",completed:"Slutf\xF6rd",skip:"Hoppa \xF6ver",skipped:"Hoppade \xF6ver",reset:"\xC5terst\xE4ll",cancel:"Avbryt",completing:"Slutf\xF6r\u2026",interval:"Intervall",warning:"Varning",last_performed:"Senast utf\xF6rd",next_due:"N\xE4sta f\xF6rfallodatum",days_until_due:"Dagar till f\xF6rfallodatum",avg_duration:"Snittlig varaktighet",trigger:"Utl\xF6sare",trigger_type:"Utl\xF6sartyp",threshold_above:"\xD6vre gr\xE4ns",threshold_below:"Undre gr\xE4ns",threshold:"Tr\xF6skel",counter:"R\xE4knare",state_change:"Tillst\xE5nds\xE4ndring",runtime:"K\xF6rtid",runtime_hours:"M\xE5ltid (timmar)",target_value:"M\xE5lv\xE4rde",baseline:"Baslinje",target_changes:"Antal m\xE5lf\xF6r\xE4ndringar",for_minutes:"Under (minuter)",time_based:"Tidsbaserad",sensor_based:"Sensorbaserad",manual:"Manuell",one_time:"Eng\xE5ngs",weekdays:"Veckodagar",nth_weekday:"N:te veckodag i m\xE5naden",day_of_month:"Dag i m\xE5naden",recurrence_on_days:"Upprepa p\xE5",recurrence_occurrence:"F\xF6rekomst",recurrence_weekday:"Veckodag",recurrence_day:"Dag i m\xE5naden (1\u201331)",ord_1:"1:a",ord_2:"2:a",ord_3:"3:e",ord_4:"4:e",ord_5:"5:e",ord_last:"Sista",day_word:"Dag",interval_value:"Intervall",interval_unit:"Enhet",unit_days:"Dagar",unit_weeks:"Veckor",unit_months:"M\xE5nader",unit_years:"\xC5r",due_date:"F\xF6rfallodatum",cleaning:"Reng\xF6ring",inspection:"Inspektion",replacement:"Byte",calibration:"Kalibrering",service:"Service",custom:"Anpassad",history:"Historik",cost:"Kostnad",duration:"Varaktighet",both:"B\xE5da",trigger_val:"Utl\xF6sarv\xE4rde",complete_title:"Slutf\xF6r: ",checklist:"Checklista",checklist_steps_optional:"Checkliststeg (valfritt)",checklist_placeholder:`Reng\xF6r filter
Byt t\xE4tning
Testa tryck`,checklist_help:"Ett steg per rad. Max 100 objekt.",err_too_long:"{field}: f\xF6r l\xE5ng (max {n} tecken)",err_too_short:"{field}: f\xF6r kort (min {n} tecken)",err_value_too_high:"{field}: f\xF6r stor (max {n})",err_value_too_low:"{field}: f\xF6r liten (min {n})",err_required:"{field}: kr\xE4vs",err_wrong_type:"{field}: fel typ (f\xF6rv\xE4ntad: {type})",err_invalid_choice:"{field}: ej till\xE5tet v\xE4rde",err_invalid_value:"{field}: ogiltigt v\xE4rde",feat_schedule_time:"Schemal\xE4ggning per tid p\xE5 dygnet",feat_schedule_time_desc:"Uppgifter blir f\xF6rsenade vid en specifik tid p\xE5 dygnet ist\xE4llet f\xF6r midnatt.",schedule_time_optional:"F\xF6rfaller kl. (valfritt, HH:MM)",schedule_time_help:"Tomt = midnatt (standard). HA-tidszon.",at_time:"kl.",notes_optional:"Anteckningar (valfritt)",cost_optional:"Kostnad (valfritt)",duration_minutes:"Varaktighet i minuter (valfritt)",days:"dagar",day:"dag",today:"Idag",d_overdue:"d f\xF6rsenad",no_tasks:"Inga underh\xE5llsuppgifter \xE4nnu. Skapa ett objekt f\xF6r att komma ig\xE5ng.",no_tasks_short:"Inga uppgifter",no_history:"Inga historikposter \xE4nnu.",show_all:"Visa alla",cost_duration_chart:"Kostnad och varaktighet",installed:"Installerad",confirm_delete_object:"Ta bort detta objekt och alla dess uppgifter?",confirm_delete_task:"Ta bort denna uppgift?",min:"Min",max:"Max",save:"Spara",saving:"Sparar\u2026",edit_task:"Redigera uppgift",new_task:"Ny underh\xE5llsuppgift",task_name:"Uppgiftsnamn",maintenance_type:"Underh\xE5llstyp",schedule_type:"Schematyp",interval_days:"Intervall (dagar)",warning_days:"Varningsdagar",last_performed_optional:"Senast utf\xF6rd (valfritt)",interval_anchor:"Intervallankare",anchor_completion:"Fr\xE5n slutf\xF6randedatum",anchor_planned:"Fr\xE5n planerat datum (ingen drift)",edit_object:"Redigera objekt",name:"Namn",manufacturer_optional:"Tillverkare (valfritt)",model_optional:"Modell (valfritt)",serial_number_optional:"Serienummer (valfritt)",serial_number_label:"S/N",documentation_url_label:"Manual",object_notes_label:"Anteckningar",sort_due_date:"F\xF6rfallodatum",sort_object:"Objektnamn",sort_type:"Typ",sort_task_name:"Uppgiftsnamn",all_objects:"Alla objekt",tasks_lower:"uppgifter",no_tasks_yet:"Inga uppgifter \xE4nnu",add_first_task:"L\xE4gg till f\xF6rsta uppgift",trigger_configuration:"Utl\xF6sarkonfiguration",entity_id:"Entitets-ID",comma_separated:"kommaseparerad",entity_logic:"Entitetslogik",entity_logic_any:"Vilken entitet som helst utl\xF6ser",entity_logic_all:"Alla entiteter m\xE5ste utl\xF6sa",entities:"entiteter",attribute_optional:"Attribut (valfritt, tomt = tillst\xE5nd)",use_entity_state:"Anv\xE4nd entitetstillst\xE5nd (inget attribut)",trigger_above:"Utl\xF6s \xF6ver",trigger_below:"Utl\xF6s under",for_at_least_minutes:"Under minst (minuter)",safety_interval_days:"S\xE4kerhetsintervall (dagar, valfritt)",safety_interval:"S\xE4kerhetsintervall (valfritt)",delta_mode:"Delta-l\xE4ge",from_state_optional:"Fr\xE5n tillst\xE5nd (valfritt)",to_state_optional:"Till tillst\xE5nd (valfritt)",documentation_url_optional:"Dokumentations-URL (valfritt)",object_notes_optional:"Anteckningar (valfritt)",nfc_tag_id_optional:"NFC-tagg-ID (valfritt)",nfc_tags_empty_help:"Inga NFC-taggar registrerade i Home Assistant \xE4n.",nfc_tags_open_settings:"\xD6ppna tag-inst\xE4llningar",nfc_tags_refresh:"Uppdatera",environmental_entity_optional:"Milj\xF6sensor (valfritt)",environmental_entity_helper:"t.ex. sensor.outdoor_temperature \u2014 justerar intervallet baserat p\xE5 milj\xF6f\xF6rh\xE5llanden",environmental_attribute_optional:"Milj\xF6attribut (valfritt)",nfc_tag_id:"NFC-tagg-ID",nfc_linked:"NFC-tagg l\xE4nkad",nfc_link_hint:"Klicka f\xF6r att l\xE4nka NFC-tagg",responsible_user:"Ansvarig anv\xE4ndare",no_user_assigned:"(Ingen anv\xE4ndare tilldelad)",all_users:"Alla anv\xE4ndare",my_tasks:"Mina uppgifter",tab_calendar:"Kalender",cal_no_events:"Inget underh\xE5ll",cal_window_7:"7 dagar",cal_window_14:"14 dagar",cal_window_30:"30 dagar",cal_window_365:"1 \xE5r",cal_every_n_days:"var {n} dag",cal_source_time:"Tidsbaserad",cal_source_time_adaptive:"Tidsbaserad (adaptiv)",cal_source_sensor:"Sensorbaserad",cal_predicted:"f\xF6rutsagt",cal_confidence_high:"h\xF6g s\xE4kerhet",cal_confidence_medium:"medelh\xF6g s\xE4kerhet",cal_confidence_low:"l\xE5g s\xE4kerhet",budget_monthly:"M\xE5natlig budget",budget_yearly:"\xC5rlig budget",groups:"Grupper",new_group:"Ny grupp",edit_group:"Redigera grupp",no_groups:"Inga grupper \xE4nnu",delete_group:"Ta bort grupp",delete_group_confirm:"Ta bort grupp '{name}'?",group_select_tasks:"V\xE4lj uppgifter",group_name_required:"Namn kr\xE4vs",description_optional:"Beskrivning (valfritt)",selected:"Valda",loading_chart:"Laddar diagramdata...",was_maintenance_needed:"Beh\xF6vdes detta underh\xE5ll?",feedback_needed:"Beh\xF6vdes",feedback_not_needed:"Beh\xF6vdes inte",feedback_not_sure:"Os\xE4ker",suggested_interval:"F\xF6reslaget intervall",apply_suggestion:"Till\xE4mpa",reanalyze:"Analysera igen",reanalyze_result:"Ny analys",reanalyze_insufficient_data:"Otillr\xE4ckligt med data f\xF6r rekommendation",data_points:"datapunkter",dismiss_suggestion:"Avvisa",confidence_low:"L\xE5g",confidence_medium:"Medel",confidence_high:"H\xF6g",recommended:"rekommenderad",seasonal_awareness:"S\xE4songsmedvetenhet",edit_seasonal_overrides:"Redigera s\xE4songsfaktorer",seasonal_overrides_title:"S\xE4songsfaktorer (\xE5sidos\xE4tt)",seasonal_overrides_hint:"Faktor per m\xE5nad (0.1\u20135.0). Tomt = l\xE4rt automatiskt.",seasonal_override_invalid:"Ogiltigt v\xE4rde",seasonal_override_range:"Faktor m\xE5ste vara mellan 0.1 och 5.0",clear_all:"Rensa alla",seasonal_chart_title:"S\xE4songsfaktorer",seasonal_learned:"L\xE4rt",seasonal_manual:"Manuell",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"Maj",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Okt",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensorprediktion",degradation_trend:"Trend",trend_rising:"Stigande",trend_falling:"Fallande",trend_stable:"Stabil",trend_insufficient_data:"Otillr\xE4cklig data",days_until_threshold:"Dagar till tr\xF6skel",threshold_exceeded:"Tr\xF6skel \xF6verskriden",environmental_adjustment:"Milj\xF6faktor",sensor_prediction_urgency:"Sensor f\xF6ruts\xE4ger tr\xF6skel om ~{days} dagar",day_short:"d",weibull_reliability_curve:"Tillf\xF6rlitlighetskurva",weibull_failure_probability:"Felsannolikhet",weibull_r_squared:"Anpassning R\xB2",beta_early_failures:"Tidiga fel",beta_random_failures:"Slumpm\xE4ssiga fel",beta_wear_out:"Slitage",beta_highly_predictable:"Mycket f\xF6ruts\xE4gbar",confidence_interval:"Konfidensintervall",confidence_conservative:"Konservativ",confidence_aggressive:"Optimistisk",current_interval_marker:"Aktuellt intervall",recommended_marker:"Rekommenderat",characteristic_life:"Karakteristisk livsl\xE4ngd",chart_mini_sparkline:"Trenddiagram",chart_history:"Kostnads- och varaktighetshistorik",chart_seasonal:"S\xE4songsfaktorer, 12 m\xE5nader",chart_weibull:"Weibull tillf\xF6rlitlighetskurva",chart_sparkline:"Sensorutl\xF6sarv\xE4rdesdiagram",days_progress:"Dagsf\xF6rlopp",qr_code:"QR-kod",qr_generating:"Genererar QR-kod\u2026",qr_error:"Kunde inte generera QR-kod.",qr_error_no_url:"Ingen HA-URL konfigurerad. Ange en extern eller intern URL i Inst\xE4llningar \u2192 System \u2192 N\xE4tverk.",save_error:"Kunde inte spara. F\xF6rs\xF6k igen.",qr_print:"Skriv ut",qr_download:"Ladda ner SVG",qr_action:"\xC5tg\xE4rd vid skanning",qr_action_view:"Visa underh\xE5llsinformation",qr_action_complete:"Markera underh\xE5ll som slutf\xF6rt",qr_url_mode:"L\xE4nktyp",qr_mode_companion:"Companion App",qr_mode_local:"Lokal (mDNS)",qr_mode_server:"Server-URL",overview:"\xD6versikt",analysis:"Analys",recent_activities:"Senaste aktiviteter",search_notes:"S\xF6k i anteckningar",avg_cost:"Snittlig kostnad",no_advanced_features:"Inga avancerade funktioner aktiverade",no_advanced_features_hint:"Aktivera \u201EAdaptiva intervall\u201D eller \u201ES\xE4songsm\xF6nster\u201D i integrationsinst\xE4llningar f\xF6r att se analysdata h\xE4r.",analysis_not_enough_data:"Inte tillr\xE4ckligt med data f\xF6r analys \xE4nnu.",analysis_not_enough_data_hint:"Weibull-analys kr\xE4ver minst 5 slutf\xF6rda underh\xE5ll; s\xE4songsm\xF6nster blir synliga efter 6+ datapunkter per m\xE5nad.",analysis_manual_task_hint:"Manuella uppgifter utan intervall genererar inte analysdata.",completions:"slutf\xF6randen",current:"Aktuell",shorter:"Kortare",longer:"L\xE4ngre",normal:"Normal",disabled:"Inaktiverad",compound_logic:"Sammansatt logik",card_title:"Titel",card_show_header:"Visa rubrik med statistik",card_show_actions:"Visa \xE5tg\xE4rdsknappar",card_compact:"Kompakt l\xE4ge",card_max_items:"Max objekt (0 = alla)",card_filter_status:"Filtrera efter status",card_filter_status_help:"Tomt = visa alla statusar.",card_filter_objects:"Filtrera efter objekt",card_filter_objects_help:"Tomt = visa alla objekt.",card_filter_entities:"Filtrera efter entiteter (entity_ids)",card_filter_entities_help:"V\xE4lj sensor- / binary_sensor-entiteter fr\xE5n denna integration. Tomt = alla.",card_loading_objects:"Laddar objekt\u2026",card_load_error:"Kunde inte ladda objekt \u2014 kontrollera WebSocket-anslutningen.",card_no_tasks_title:"Inga underh\xE5llsuppgifter \xE4n",card_no_tasks_cta:"\u2192 Skapa en i Maintenance-panelen",no_objects:"Inga objekt \xE4n.",action_error:"\xC5tg\xE4rden misslyckades. F\xF6rs\xF6k igen.",area_id_optional:"Omr\xE5de (valfritt)",installation_date_optional:"Installationsdatum (valfritt)",custom_icon_optional:"Ikon (valfritt, t.ex. mdi:wrench)",task_enabled:"Uppgift aktiverad",skip_reason_prompt:"Hoppa \xF6ver denna uppgift?",reason_optional:"Anledning (valfritt)",reset_date_prompt:"Markera uppgift som utf\xF6rd?",reset_date_optional:"Datum f\xF6r senaste utf\xF6rande (valfritt, standard idag)",notes_label:"Anteckningar",documentation_label:"Dokumentation",no_nfc_tag:"\u2014 Ingen tagg \u2014",dashboard:"\xD6versikt",settings:"Inst\xE4llningar",settings_features:"Avancerade funktioner",settings_features_desc:"Aktivera eller inaktivera avancerade funktioner. Inaktivering d\xF6ljer dem fr\xE5n UI men tar inte bort data.",feat_adaptive:"Adaptiv schemal\xE4ggning",feat_adaptive_desc:"L\xE4r dig optimala intervall fr\xE5n underh\xE5llshistorik",feat_predictions:"Sensorpredictions",feat_predictions_desc:"F\xF6ruts\xE4g utl\xF6sningsdatum fr\xE5n sensordegradering",feat_seasonal:"S\xE4songsjusteringar",feat_seasonal_desc:"Justera intervall baserat p\xE5 s\xE4songsm\xF6nster",feat_environmental:"Milj\xF6korrelation",feat_environmental_desc:"Korrelera intervall med temperatur/luftfuktighet",feat_budget:"Budgetuppf\xF6ljning",feat_budget_desc:"Sp\xE5ra m\xE5natliga och \xE5rliga underh\xE5llsutgifter",feat_groups:"Uppgiftsgrupper",feat_groups_desc:"Organisera uppgifter i logiska grupper",feat_checklists:"Checklistor",feat_checklists_desc:"Flerstegs procedurer f\xF6r uppgiftens slutf\xF6rande",settings_general:"Allm\xE4nt",settings_default_warning:"Standard varningsdagar",settings_panel_enabled:"Sidopanel",settings_panel_title:"Sidopanelens titel",settings_notifications:"Notifikationer",settings_notify_service:"Notifikationstj\xE4nst",test_notification:"Testnotifikation",send_test:"Skicka test",testing:"Skickar\u2026",test_notification_success:"Testnotifikation skickad",test_notification_failed:"Testnotifikation misslyckades",settings_notify_due_soon:"Notifiera n\xE4r snart f\xF6rfallande",settings_notify_overdue:"Notifiera n\xE4r f\xF6rsenad",settings_notify_triggered:"Notifiera n\xE4r utl\xF6st",settings_interval_hours:"Upprepningsintervall (timmar, 0 = en g\xE5ng)",settings_quiet_hours:"Tysta timmar",settings_quiet_start:"Start",settings_quiet_end:"Slut",settings_max_per_day:"Max notifikationer per dag (0 = obegr\xE4nsat)",settings_bundling:"Bunta notifikationer",settings_bundle_threshold:"Buntningstr\xF6skel",settings_actions:"Mobila \xE5tg\xE4rdsknappar",settings_action_complete:"Visa 'Slutf\xF6r'-knapp",settings_action_skip:"Visa 'Hoppa \xF6ver'-knapp",settings_action_snooze:"Visa 'Snooza'-knapp",settings_snooze_hours:"Snooza-tid (timmar)",settings_budget:"Budget",settings_currency:"Valuta",settings_budget_monthly:"M\xE5natlig budget",settings_budget_yearly:"\xC5rlig budget",settings_budget_alerts:"Budgetvarningar",settings_budget_threshold:"Varningstr\xF6skel (%)",settings_import_export:"Import / Export",settings_export_json:"Exportera JSON",settings_export_yaml:"Exportera YAML",settings_export_csv:"Exportera CSV",settings_import_csv:"Importera CSV",settings_import_placeholder:"Klistra in JSON- eller CSV-inneh\xE5ll h\xE4r\u2026",settings_import_btn:"Importera",settings_import_success:"{count} objekt importerade.",settings_export_success:"Export nedladdad.",settings_saved:"Inst\xE4llning sparad.",settings_include_history:"Inkludera historik",sort_alphabetical:"Alfabetisk",sort_due_soonest:"N\xE4rmaste f\xF6rfallodatum",sort_task_count:"Antal uppgifter",sort_area:"Omr\xE5de",sort_assigned_user:"Tilldelad anv\xE4ndare",sort_group:"Grupp",groupby_none:"Ingen gruppering",groupby_area:"Per omr\xE5de",groupby_group:"Per grupp",groupby_user:"Per anv\xE4ndare",filter_label:"Filter",user_label:"Anv\xE4ndare",sort_label:"Sortering",group_by_label:"Gruppera efter",state_value_help:'Anv\xE4nd HA-tillst\xE5ndsv\xE4rdet (vanligtvis med sm\xE5 bokst\xE4ver, t.ex. "on"/"off"). Versaler normaliseras vid sparande.',target_changes_help:"Antal matchande \xF6verg\xE5ngar innan utl\xF6saren aktiveras (standard: 1).",qr_print_title:"Skriv ut QR-koder",qr_print_desc:"Skapa en utskriftssida med QR-koder att klippa ut och s\xE4tta p\xE5 din utrustning.",qr_print_load:"Ladda objekt",qr_print_filter:"Filter",qr_print_objects:"Objekt",qr_print_actions:"\xC5tg\xE4rder",qr_print_url_mode:"L\xE4nktyp",qr_print_estimate:"Uppskattade QR-koder",qr_print_over_limit:"gr\xE4ns 200, begr\xE4nsa filtret",qr_print_generate:"Skapa QR-koder",qr_print_generating:"Skapar\u2026",qr_print_ready:"QR-koder klara",qr_print_print_button:"Skriv ut",qr_print_empty:"Inget att skapa",qr_action_skip:"Hoppa \xF6ver",vacation_title:"Semesterl\xE4ge",vacation_active:"aktivt",vacation_ended:"avslutat",vacation_desc:"Planera din semester: aviseringar pausas under perioden plus n\xE5gra buffert-dagar. Du kan g\xF6ra undantag per uppgift.",vacation_enable:"Aktivera semesterl\xE4ge",vacation_start:"Start",vacation_end:"Slut",vacation_buffer:"Buffert (dagar)",vacation_exempt_title:"Avisera \xE4nd\xE5 under semester",vacation_exempt_desc:"V\xE4lj uppgifter som ska avisera \xE4ven under semestern (t.ex. kritisk poolkemi).",vacation_load_tasks:"Ladda uppgifter",vacation_preview_btn:"Visa f\xF6rhandsgranskning",vacation_preview_affected:"uppgifter ber\xF6rda",vacation_event_due_soon:"blir snart f\xF6rfallen",vacation_event_overdue:"blir f\xF6rsenad",vacation_event_triggered_est:"m\xF6jlig sensorutl\xF6sning",vacation_sensor_based:"(sensorbaserad)",vacation_action_notify:"Avisera \xE4nd\xE5",vacation_action_unsilence:"Tysta igen",vacation_marked_complete:"Markerad som klar",vacation_marked_skip:"Hoppade \xF6ver",vacation_end_now:"Avsluta semester nu",unassigned:"Otilldelad",no_area:"Inget omr\xE5de",has_overdue:"Har f\xF6rsenade uppgifter",object:"Objekt",settings_panel_access:"Paneltillg\xE5ng",settings_panel_access_desc:"Administrat\xF6rer ser alltid hela panelen. V\xE4lj icke-admin-anv\xE4ndare nedan som ocks\xE5 ska f\xE5 full paneltillg\xE5ng \u2014 alla andra icke-admins ser endast Slutf\xF6r och Hoppa \xF6ver.",no_non_admin_users:"Inga icke-admin-anv\xE4ndare hittades. L\xE4gg till n\xE5gra i Inst\xE4llningar \u2192 Personer.",owner_label:"\xC4gare",feat_completion_actions:"Slutf\xF6rande-\xE5tg\xE4rder",feat_completion_actions_desc:"HA-\xE5tg\xE4rd per uppgift vid slutf\xF6rande + snabb-slutf\xF6r-QR med f\xF6rinst\xE4llda v\xE4rden.",on_complete_action_title:"Vid slutf\xF6rande: utl\xF6s HA-\xE5tg\xE4rd (valfritt)",on_complete_action_desc:"Anropar en HA-tj\xE4nst n\xE4r uppgiften slutf\xF6rs \u2014 t.ex. \xE5terst\xE4ll en r\xE4knare p\xE5 enheten.",on_complete_action_service:"Tj\xE4nst",on_complete_action_target:"M\xE5lentitet",on_complete_action_data:"Data (JSON, valfritt)",on_complete_action_test:"Testa \xE5tg\xE4rd",on_complete_action_test_success:"Lyckades",on_complete_action_test_failed:"Misslyckades",quick_complete_defaults_title:"Snabb-slutf\xF6r standardv\xE4rden (f\xF6r QR-skanningar, valfritt)",quick_complete_defaults_desc:"F\xF6rinst\xE4llda v\xE4rden f\xF6r snabb-slutf\xF6r-QR. Utan dessa \xF6ppnar QR slutf\xF6r-dialogen.",quick_complete_defaults_notes:"Anteckningar",quick_complete_defaults_cost:"Kostnad",quick_complete_defaults_duration:"Varaktighet (minuter)",quick_complete_defaults_feedback_none:"Ingen feedback",quick_complete_defaults_feedback_needed:"Var n\xF6dv\xE4ndigt",quick_complete_defaults_feedback_not_needed:"Inte n\xF6dv\xE4ndigt",quick_complete_success:"Snabbt markerad som klar",trigger_replaced:"Utl\xF6sare ersatt",add:"L\xE4gg till",show_stats:"Visa statistik + grafer",hide_stats:"D\xF6lj statistik",adaptive_no_data:"\xC4nnu inte tillr\xE4ckligt med slutf\xF6randehistorik f\xF6r adaptiv analys. Slutf\xF6r denna uppgift n\xE5gra g\xE5nger till f\xF6r att l\xE5sa upp intervallrekommendationer och tillf\xF6rlitlighetsdiagram.",suggestion_applied:"F\xF6reslaget intervall till\xE4mpat",vacation_mode:"Semesterl\xE4ge",vacation_status_active:"Aktivt nu",vacation_status_scheduled:"Schemalagt",vacation_status_inactive:"Inaktivt",vacation_end_now_confirm:"Avsluta semestern omedelbart?",vacation_exempt_count:"undantagna",vacation_advanced:"Avancerat\u2026",vacation_open_panel:"\xD6ppna i panelen",enable:"Aktivera",saved:"Sparat",budget_monthly_set:"Ange m\xE5nad",budget_yearly_set:"Ange \xE5r",budget_advanced:"Valuta, varningar\u2026",budget_open_panel:"\xD6ppna i panelen",groups_empty:"Inga grupper \xE4n.",group_new_placeholder:"L\xE4gg till grupp\u2026",group_delete_confirm:"Ta bort gruppen \u201D{name}\u201D?",groups_manage_tasks:"Hantera uppgiftstilldelningar\u2026",groups_open_panel:"\xD6ppna i panelen",on_complete_action_target_hint:"Obs: entitetens dom\xE4n m\xE5ste matcha tj\xE4nsten \u2014 t.ex. 'button.press' fungerar bara p\xE5 button.*, 'counter.increment' bara p\xE5 counter.*, 'input_button.press' bara p\xE5 input_button.* osv. Vid en avvikelse misslyckas \xE5tg\xE4rden tyst (HA loggar 'Referenced entities ... missing or not currently available').",show_all_objects:"Visa alla objekt",show_all_tasks:"Rensa filter \u2014 visa alla uppgifter",filter_to_overdue:"Filtrera listan till endast f\xF6rsenade",filter_to_due_soon:"Filtrera listan till endast snart f\xF6rfallna",filter_to_triggered:"Filtrera listan till endast utl\xF6sta",open_task:"\xD6ppna uppgift",show_details:"Visa historik + statistik",hide_details:"D\xF6lj detaljer",history_empty:"Ingen historik \xE4n.",history_edit_button:"Redigera post",total_cost:"Total kostnad",times_performed:"Utf\xF6rd",older_entries:"\xE4ldre",open_in_panel:"\xD6ppna i Underh\xE5llspanelen",skip_reason:"Anledning till \xF6verhoppning (valfritt)",reset_to_date:"\xC5terst\xE4ll senast utf\xF6rd till",delete_task_confirm:"Ta bort denna uppgift och dess historik?",delete_object_confirm:"Ta bort detta objekt och alla dess uppgifter?",loading:"Laddar\u2026"},Ca={maintenance:"\u7EF4\u62A4",objects:"\u7EF4\u62A4\u9879",tasks:"\u4EFB\u52A1",overdue:"\u903E\u671F",due_soon:"\u5373\u5C06\u5230\u671F",triggered:"\u5DF2\u89E6\u53D1",trigger_replaced:"\u89E6\u53D1\u5668\u5DF2\u66F4\u6362",ok:"\u6B63\u5E38",all:"\u5168\u90E8",new_object:"+ \u65B0\u5EFA\u7EF4\u62A4\u9879",edit:"\u7F16\u8F91",delete:"\u5220\u9664",add_task:"+ \u6DFB\u52A0\u4EFB\u52A1",complete:"\u5B8C\u6210",completed:"\u5DF2\u5B8C\u6210",skip:"\u8DF3\u8FC7",skipped:"\u5DF2\u8DF3\u8FC7",reset:"\u91CD\u7F6E",cancel:"\u53D6\u6D88",completing:"\u6B63\u5728\u5B8C\u6210\u2026",interval:"\u95F4\u9694",warning:"\u9884\u8B66",last_performed:"\u4E0A\u6B21\u6267\u884C",next_due:"\u4E0B\u6B21\u5230\u671F",days_until_due:"\u8DDD\u79BB\u5230\u671F\u5929\u6570",avg_duration:"\u5E73\u5747\u8017\u65F6",trigger:"\u89E6\u53D1\u5668",trigger_type:"\u89E6\u53D1\u7C7B\u578B",threshold_above:"\u8D85\u8FC7\u9608\u503C",threshold_below:"\u4F4E\u4E8E\u9608\u503C",threshold:"\u9608\u503C",counter:"\u8BA1\u6570\u5668",state_change:"\u72B6\u6001\u53D8\u5316",runtime:"\u8FD0\u884C\u65F6\u95F4",runtime_hours:"\u76EE\u6807\u8FD0\u884C\u65F6\u957F (\u5C0F\u65F6)",target_value:"\u76EE\u6807\u503C",baseline:"\u57FA\u51C6\u7EBF",target_changes:"\u76EE\u6807\u53D8\u5316\u6B21\u6570",for_minutes:"\u6301\u7EED (\u5206\u949F)",time_based:"\u57FA\u4E8E\u65F6\u95F4",sensor_based:"\u57FA\u4E8E\u4F20\u611F\u5668",manual:"\u624B\u52A8",one_time:"\u4E00\u6B21\u6027",weekdays:"\u5DE5\u4F5C\u65E5",nth_weekday:"\u6BCF\u6708\u7B2C N \u4E2A\u5DE5\u4F5C\u65E5",day_of_month:"\u6BCF\u6708\u67D0\u5929",recurrence_on_days:"\u91CD\u590D\u65E5\u671F",recurrence_occurrence:"\u53D1\u751F\u6B21\u6570",recurrence_weekday:"\u661F\u671F",recurrence_day:"\u6BCF\u6708\u65E5\u671F (1\u201331)",ord_1:"\u7B2C 1",ord_2:"\u7B2C 2",ord_3:"\u7B2C 3",ord_4:"\u7B2C 4",ord_5:"\u7B2C 5",ord_last:"\u6700\u540E",day_word:"\u65E5",interval_value:"\u95F4\u9694\u6570\u503C",interval_unit:"\u5355\u4F4D",unit_days:"\u5929",unit_weeks:"\u5468",unit_months:"\u6708",unit_years:"\u5E74",due_date:"\u5230\u671F\u65E5\u671F",cleaning:"\u6E05\u6D01",inspection:"\u68C0\u67E5",replacement:"\u66F4\u6362",calibration:"\u6821\u51C6",service:"\u4FDD\u517B",custom:"\u81EA\u5B9A\u4E49",history:"\u5386\u53F2\u8BB0\u5F55",cost:"\u6210\u672C",duration:"\u8017\u65F6",both:"\u4E24\u8005",trigger_val:"\u89E6\u53D1\u503C",complete_title:"\u5B8C\u6210: ",checklist:"\u68C0\u67E5\u6E05\u5355",checklist_steps_optional:"\u68C0\u67E5\u6B65\u9AA4 (\u53EF\u9009)",checklist_placeholder:`\u6E05\u7406\u8FC7\u6EE4\u5668
\u66F4\u6362\u5BC6\u5C01\u5708
\u6D4B\u8BD5\u538B\u529B`,checklist_help:"\u6BCF\u884C\u4E00\u4E2A\u6B65\u9AA4\u3002\u6700\u591A 100 \u9879\u3002",err_too_long:"{field}: \u592A\u957F (\u6700\u591A {n} \u4E2A\u5B57\u7B26)",err_too_short:"{field}: \u592A\u77ED (\u6700\u5C11 {n} \u4E2A\u5B57\u7B26)",err_value_too_high:"{field}: \u592A\u5927 (\u6700\u5927 {n})",err_value_too_low:"{field}: \u592A\u5C0F (\u6700\u5C0F {n})",err_required:"{field}: \u5FC5\u586B\u9879",err_wrong_type:"{field}: \u7C7B\u578B\u9519\u8BEF (\u9884\u671F: {type})",err_invalid_choice:"{field}: \u65E0\u6548\u9009\u9879",err_invalid_value:"{field}: \u65E0\u6548\u6570\u503C",feat_schedule_time:"\u5177\u4F53\u65F6\u95F4\u8C03\u5EA6",feat_schedule_time_desc:"\u4EFB\u52A1\u5C06\u5728\u7279\u5B9A\u65F6\u95F4\u70B9\u53D8\u4E3A\u903E\u671F\uFF0C\u800C\u975E\u9ED8\u8BA4\u7684\u5348\u591C\u3002",schedule_time_optional:"\u5230\u671F\u65F6\u95F4 (\u53EF\u9009, HH:MM)",schedule_time_help:"\u7559\u7A7A = \u5348\u591C (\u9ED8\u8BA4)\u3002\u57FA\u4E8E HA \u65F6\u533A\u3002",at_time:"\u4E8E",notes_optional:"\u5907\u6CE8 (\u53EF\u9009)",cost_optional:"\u6210\u672C (\u53EF\u9009)",duration_minutes:"\u8017\u65F6 (\u5206\u949F, \u53EF\u9009)",days:"\u5929",day:"\u5929",today:"\u4ECA\u5929",d_overdue:"\u5929\u903E\u671F",no_tasks:"\u5C1A\u65E0\u7EF4\u62A4\u4EFB\u52A1\u3002\u8BF7\u521B\u5EFA\u4E00\u4E2A\u7EF4\u62A4\u9879\u5F00\u59CB\u4F7F\u7528\u3002",no_tasks_short:"\u65E0\u4EFB\u52A1",no_history:"\u5C1A\u65E0\u5386\u53F2\u8BB0\u5F55\u3002",show_all:"\u5168\u90E8\u663E\u793A",cost_duration_chart:"\u6210\u672C\u4E0E\u8017\u65F6",installed:"\u5DF2\u5B89\u88C5",confirm_delete_object:"\u786E\u5B9A\u5220\u9664\u6B64\u7EF4\u62A4\u9879\u53CA\u5176\u6240\u6709\u4EFB\u52A1\u5417\uFF1F",confirm_delete_task:"\u786E\u5B9A\u5220\u9664\u6B64\u4EFB\u52A1\u5417\uFF1F",min:"\u6700\u5C0F",max:"\u6700\u5927",save:"\u4FDD\u5B58",saving:"\u6B63\u5728\u4FDD\u5B58\u2026",edit_task:"\u7F16\u8F91\u4EFB\u52A1",new_task:"\u65B0\u5EFA\u7EF4\u62A4\u4EFB\u52A1",task_name:"\u4EFB\u52A1\u540D\u79F0",maintenance_type:"\u7EF4\u62A4\u7C7B\u578B",schedule_type:"\u8BA1\u5212\u7C7B\u578B",interval_days:"\u95F4\u9694 (\u5929)",warning_days:"\u9884\u8B66\u5929\u6570",last_performed_optional:"\u4E0A\u6B21\u6267\u884C\u65F6\u95F4 (\u53EF\u9009)",interval_anchor:"\u8BA1\u5212\u951A\u70B9",anchor_completion:"\u4ECE\u5B8C\u6210\u65E5\u671F\u8D77\u7B97",anchor_planned:"\u4ECE\u8BA1\u5212\u65E5\u671F\u8D77\u7B97 (\u65E0\u504F\u5DEE)",edit_object:"\u7F16\u8F91\u7EF4\u62A4\u9879",name:"\u540D\u79F0",manufacturer_optional:"\u5236\u9020\u5546 (\u53EF\u9009)",model_optional:"\u578B\u53F7 (\u53EF\u9009)",serial_number_optional:"\u5E8F\u5217\u53F7 (\u53EF\u9009)",serial_number_label:"\u5E8F\u5217\u53F7",documentation_url_label:"\u624B\u518C",object_notes_label:"\u5907\u6CE8",sort_due_date:"\u5230\u671F\u65F6\u95F4",sort_object:"\u7EF4\u62A4\u9879\u540D\u79F0",sort_type:"\u7C7B\u578B",sort_task_name:"\u4EFB\u52A1\u540D\u79F0",all_objects:"\u6240\u6709\u7EF4\u62A4\u9879",tasks_lower:"\u4EFB\u52A1",no_tasks_yet:"\u5C1A\u65E0\u4EFB\u52A1",add_first_task:"\u6DFB\u52A0\u9996\u4E2A\u4EFB\u52A1",trigger_configuration:"\u89E6\u53D1\u5668\u914D\u7F6E",entity_id:"\u5B9E\u4F53 ID",comma_separated:"\u9017\u53F7\u5206\u9694",entity_logic:"\u5B9E\u4F53\u903B\u8F91",entity_logic_any:"\u4EFB\u4E00\u5B9E\u4F53\u89E6\u53D1",entity_logic_all:"\u6240\u6709\u5B9E\u4F53\u5747\u89E6\u53D1",entities:"\u5B9E\u4F53",attribute_optional:"\u5C5E\u6027 (\u53EF\u9009, \u7559\u7A7A = \u72B6\u6001)",use_entity_state:"\u4F7F\u7528\u5B9E\u4F53\u72B6\u6001 (\u4E0D\u4F7F\u7528\u5C5E\u6027)",trigger_above:"\u9AD8\u4E8E\u6B64\u503C\u89E6\u53D1",trigger_below:"\u4F4E\u4E8E\u6B64\u503C\u89E6\u53D1",for_at_least_minutes:"\u6301\u7EED\u81F3\u5C11 (\u5206\u949F)",safety_interval_days:"\u5B89\u5168\u95F4\u9694 (\u5929, \u53EF\u9009)",safety_interval:"\u5B89\u5168\u95F4\u9694 (\u53EF\u9009)",delta_mode:"\u589E\u91CF\u6A21\u5F0F",from_state_optional:"\u8D77\u59CB\u72B6\u6001 (\u53EF\u9009)",to_state_optional:"\u76EE\u6807\u72B6\u6001 (\u53EF\u9009)",documentation_url_optional:"\u6587\u6863\u94FE\u63A5 (\u53EF\u9009)",object_notes_optional:"\u5907\u6CE8 (\u53EF\u9009)",nfc_tag_id_optional:"NFC \u6807\u7B7E ID (\u53EF\u9009)",nfc_tags_empty_help:"Home Assistant \u4E2D\u5C1A\u672A\u6CE8\u518C\u4EFB\u4F55 NFC \u6807\u7B7E\u3002",nfc_tags_open_settings:"\u6253\u5F00\u6807\u7B7E\u8BBE\u7F6E",nfc_tags_refresh:"\u5237\u65B0",environmental_entity_optional:"\u73AF\u5883\u4F20\u611F\u5668 (\u53EF\u9009)",environmental_entity_helper:"\u4F8B\u5982\uFF1Asensor.outdoor_temperature \u2014 \u6839\u636E\u73AF\u5883\u6761\u4EF6\u81EA\u52A8\u8C03\u6574\u95F4\u9694",environmental_attribute_optional:"\u73AF\u5883\u5C5E\u6027 (\u53EF\u9009)",nfc_tag_id:"NFC \u6807\u7B7E ID",nfc_linked:"NFC \u6807\u7B7E\u5DF2\u94FE\u63A5",nfc_link_hint:"\u70B9\u51FB\u94FE\u63A5 NFC \u6807\u7B7E",responsible_user:"\u8D1F\u8D23\u4EBA",no_user_assigned:"(\u672A\u5206\u914D)",all_users:"\u6240\u6709\u7528\u6237",my_tasks:"\u6211\u7684\u4EFB\u52A1",tab_calendar:"\u65E5\u5386",cal_no_events:"\u65E0\u7EF4\u62A4\u4E8B\u9879",cal_window_7:"7 \u5929",cal_window_14:"14 \u5929",cal_window_30:"30 \u5929",cal_window_365:"1 \u5E74",cal_every_n_days:"\u6BCF {n} \u5929",cal_source_time:"\u57FA\u4E8E\u65F6\u95F4",cal_source_time_adaptive:"\u57FA\u4E8E\u65F6\u95F4 (\u81EA\u9002\u5E94)",cal_source_sensor:"\u57FA\u4E8E\u4F20\u611F\u5668",cal_predicted:"\u9884\u6D4B",cal_confidence_high:"\u9AD8\u7F6E\u4FE1\u5EA6",cal_confidence_medium:"\u4E2D\u7F6E\u4FE1\u5EA6",cal_confidence_low:"\u4F4E\u7F6E\u4FE1\u5EA6",budget_monthly:"\u6708\u5EA6\u9884\u7B97",budget_yearly:"\u5E74\u5EA6\u9884\u7B97",groups:"\u5206\u7EC4",new_group:"\u65B0\u5EFA\u5206\u7EC4",edit_group:"\u7F16\u8F91\u5206\u7EC4",no_groups:"\u5C1A\u65E0\u5206\u7EC4",delete_group:"\u5220\u9664\u5206\u7EC4",delete_group_confirm:"\u786E\u5B9A\u5220\u9664\u5206\u7EC4 '{name}' \u5417\uFF1F",group_select_tasks:"\u9009\u62E9\u4EFB\u52A1",group_name_required:"\u540D\u79F0\u5FC5\u586B",description_optional:"\u63CF\u8FF0 (\u53EF\u9009)",selected:"\u5DF2\u9009\u62E9",loading_chart:"\u6B63\u5728\u52A0\u8F7D\u56FE\u8868\u6570\u636E...",was_maintenance_needed:"\u6B64\u6B21\u7EF4\u62A4\u662F\u5426\u786E\u5B9E\u9700\u8981\uFF1F",feedback_needed:"\u9700\u8981",feedback_not_needed:"\u4E0D\u9700\u8981",feedback_not_sure:"\u4E0D\u786E\u5B9A",suggested_interval:"\u5EFA\u8BAE\u95F4\u9694",apply_suggestion:"\u5E94\u7528\u5EFA\u8BAE",reanalyze:"\u91CD\u65B0\u5206\u6790",reanalyze_result:"\u65B0\u5206\u6790\u7ED3\u679C",reanalyze_insufficient_data:"\u6570\u636E\u4E0D\u8DB3\uFF0C\u65E0\u6CD5\u751F\u6210\u5EFA\u8BAE",data_points:"\u4E2A\u6570\u636E\u70B9",dismiss_suggestion:"\u5FFD\u7565",confidence_low:"\u4F4E",confidence_medium:"\u4E2D",confidence_high:"\u9AD8",recommended:"\u63A8\u8350",seasonal_awareness:"\u5B63\u8282\u6027\u611F\u77E5",edit_seasonal_overrides:"\u7F16\u8F91\u5B63\u8282\u6027\u4FEE\u6B63\u7CFB\u6570",seasonal_overrides_title:"\u5B63\u8282\u6027\u4FEE\u6B63\u7CFB\u6570 (\u8986\u76D6)",seasonal_overrides_hint:"\u6BCF\u6708\u7CFB\u6570 (0.1\u20135.0)\u3002\u7559\u7A7A\u5219\u81EA\u52A8\u5B66\u4E60\u3002",seasonal_override_invalid:"\u65E0\u6548\u6570\u503C",seasonal_override_range:"\u7CFB\u6570\u5FC5\u987B\u4ECB\u4E8E 0.1 \u5230 5.0 \u4E4B\u95F4",clear_all:"\u5168\u90E8\u6E05\u9664",seasonal_chart_title:"\u5B63\u8282\u6027\u56E0\u7D20",seasonal_learned:"\u81EA\u52A8\u5B66\u4E60",seasonal_manual:"\u624B\u52A8\u8BBE\u7F6E",month_jan:"\u4E00\u6708",month_feb:"\u4E8C\u6708",month_mar:"\u4E09\u6708",month_apr:"\u56DB\u6708",month_may:"\u4E94\u6708",month_jun:"\u516D\u6708",month_jul:"\u4E03\u6708",month_aug:"\u516B\u6708",month_sep:"\u4E5D\u6708",month_oct:"\u5341\u6708",month_nov:"\u5341\u4E00\u6708",month_dec:"\u5341\u4E8C\u6708",sensor_prediction:"\u4F20\u611F\u5668\u9884\u6D4B",degradation_trend:"\u8D8B\u52BF",trend_rising:"\u4E0A\u5347",trend_falling:"\u4E0B\u964D",trend_stable:"\u7A33\u5B9A",trend_insufficient_data:"\u6570\u636E\u4E0D\u8DB3",days_until_threshold:"\u8DDD\u79BB\u9608\u503C\u5929\u6570",threshold_exceeded:"\u5DF2\u8D85\u8FC7\u9608\u503C",environmental_adjustment:"\u73AF\u5883\u56E0\u5B50",sensor_prediction_urgency:"\u4F20\u611F\u5668\u9884\u6D4B\u7EA6 {days} \u5929\u540E\u8FBE\u5230\u9608\u503C",day_short:"\u5929",weibull_reliability_curve:"\u97E6\u4F2F\u53EF\u9760\u6027\u66F2\u7EBF",weibull_failure_probability:"\u6545\u969C\u6982\u7387",weibull_r_squared:"\u62DF\u5408\u5EA6 R\xB2",beta_early_failures:"\u65E9\u671F\u5931\u6548",beta_random_failures:"\u968F\u673A\u5931\u6548",beta_wear_out:"\u8017\u635F\u5931\u6548",beta_highly_predictable:"\u9AD8\u5EA6\u53EF\u9884\u6D4B",confidence_interval:"\u7F6E\u4FE1\u533A\u95F4",confidence_conservative:"\u4FDD\u5B88",confidence_aggressive:"\u8FDB\u53D6",current_interval_marker:"\u5F53\u524D\u95F4\u9694",recommended_marker:"\u63A8\u8350",characteristic_life:"\u7279\u5F81\u5BFF\u547D",chart_mini_sparkline:"\u8D8B\u52BF\u8D70\u52BF\u56FE",chart_history:"\u6210\u672C\u4E0E\u65F6\u957F\u5386\u53F2",chart_seasonal:"12\u4E2A\u6708\u5B63\u8282\u6027\u56E0\u7D20\u56FE\u8868",chart_weibull:"\u97E6\u4F2F\u53EF\u9760\u6027\u66F2\u7EBF\u56FE\u8868",chart_sparkline:"\u4F20\u611F\u5668\u89E6\u53D1\u503C\u56FE\u8868",days_progress:"\u5929\u6570\u8FDB\u5EA6",qr_code:"\u4E8C\u7EF4\u7801",qr_generating:"\u6B63\u5728\u751F\u6210\u4E8C\u7EF4\u7801\u2026",qr_error:"\u65E0\u6CD5\u751F\u6210\u4E8C\u7EF4\u7801\u3002",qr_error_no_url:"\u672A\u914D\u7F6E HA URL\u3002\u8BF7\u524D\u5F80\u201C\u8BBE\u7F6E \u2192 \u7CFB\u7EDF \u2192 \u7F51\u7EDC\u201D\u8BBE\u7F6E\u5916\u90E8\u6216\u5185\u90E8 URL\u3002",save_error:"\u4FDD\u5B58\u5931\u8D25\u3002\u8BF7\u91CD\u8BD5\u3002",qr_print:"\u6253\u5370",qr_download:"\u4E0B\u8F7D SVG",qr_action:"\u626B\u7801\u540E\u52A8\u4F5C",qr_action_view:"\u67E5\u770B\u7EF4\u62A4\u4FE1\u606F",qr_action_complete:"\u6807\u8BB0\u7EF4\u62A4\u4E3A\u5DF2\u5B8C\u6210",qr_url_mode:"\u94FE\u63A5\u7C7B\u578B",qr_mode_companion:"Companion App",qr_mode_local:"\u672C\u5730 (mDNS)",qr_mode_server:"\u670D\u52A1\u5668 URL",overview:"\u6982\u89C8",analysis:"\u5206\u6790",recent_activities:"\u8FD1\u671F\u6D3B\u52A8",search_notes:"\u641C\u7D22\u5907\u6CE8",avg_cost:"\u5E73\u5747\u6210\u672C",no_advanced_features:"\u672A\u542F\u7528\u9AD8\u7EA7\u529F\u80FD",no_advanced_features_hint:"\u8BF7\u5728\u96C6\u6210\u8BBE\u7F6E\u4E2D\u542F\u7528\u201C\u81EA\u9002\u5E94\u95F4\u9694\u201D\u6216\u201C\u5B63\u8282\u6027\u6A21\u5F0F\u201D\u4EE5\u5728\u6B64\u67E5\u770B\u5206\u6790\u6570\u636E\u3002",analysis_not_enough_data:"\u6682\u65E0\u8DB3\u591F\u7684\u5206\u6790\u6570\u636E\u3002",analysis_not_enough_data_hint:"\u97E6\u4F2F\u5206\u6790\u9700\u8981\u81F3\u5C11 5 \u6B21\u5B8C\u6210\u8BB0\u5F55\uFF1B\u5B63\u8282\u6027\u6A21\u5F0F\u5728\u6BCF\u6708\u6709 6 \u4E2A\u4EE5\u4E0A\u6570\u636E\u70B9\u540E\u53EF\u89C1\u3002",analysis_manual_task_hint:"\u65E0\u95F4\u9694\u7684\u624B\u52A8\u4EFB\u52A1\u4E0D\u4F1A\u751F\u6210\u5206\u6790\u6570\u636E\u3002",completions:"\u6B21\u5B8C\u6210\u8BB0\u5F55",current:"\u5F53\u524D",shorter:"\u8F83\u77ED",longer:"\u8F83\u957F",normal:"\u6B63\u5E38",disabled:"\u5DF2\u7981\u7528",compound_logic:"\u7EC4\u5408\u903B\u8F91",card_title:"\u6807\u9898",card_show_header:"\u663E\u793A\u7EDF\u8BA1\u4FE1\u606F\u9875\u7709",card_show_actions:"\u663E\u793A\u64CD\u4F5C\u6309\u94AE",card_compact:"\u7D27\u51D1\u6A21\u5F0F",card_max_items:"\u6700\u5927\u663E\u793A\u9879 (0 = \u5168\u90E8)",card_filter_status:"\u6309\u72B6\u6001\u8FC7\u6EE4",card_filter_status_help:"\u7559\u7A7A\u5219\u663E\u793A\u6240\u6709\u72B6\u6001\u3002",card_filter_objects:"\u6309\u7EF4\u62A4\u9879\u8FC7\u6EE4",card_filter_objects_help:"\u7559\u7A7A\u5219\u663E\u793A\u6240\u6709\u7EF4\u62A4\u9879\u3002",card_filter_entities:"\u6309\u5B9E\u4F53\u8FC7\u6EE4 (entity_ids)",card_filter_entities_help:"\u9009\u62E9\u8BE5\u96C6\u6210\u7684\u4F20\u611F\u5668\u6216\u4E8C\u8FDB\u5236\u4F20\u611F\u5668\u5B9E\u4F53\u3002\u7559\u7A7A\u5219\u663E\u793A\u5168\u90E8\u3002",card_loading_objects:"\u6B63\u5728\u52A0\u8F7D\u7EF4\u62A4\u9879\u2026",card_load_error:"\u65E0\u6CD5\u52A0\u8F7D\u7EF4\u62A4\u9879 \u2014 \u8BF7\u68C0\u67E5 WebSocket \u8FDE\u63A5\u3002",card_no_tasks_title:"\u6682\u65E0\u7EF4\u62A4\u4EFB\u52A1",card_no_tasks_cta:"\u2192 \u8BF7\u524D\u5F80\u7EF4\u62A4\u9762\u677F\u521B\u5EFA",no_objects:"\u6682\u65E0\u7EF4\u62A4\u9879\u3002",action_error:"\u64CD\u4F5C\u5931\u8D25\u3002\u8BF7\u91CD\u8BD5\u3002",area_id_optional:"\u533A\u57DF (\u53EF\u9009)",installation_date_optional:"\u5B89\u88C5\u65E5\u671F (\u53EF\u9009)",custom_icon_optional:"\u56FE\u6807 (\u53EF\u9009\uFF0C\u4F8B\u5982 mdi:wrench)",task_enabled:"\u4EFB\u52A1\u5DF2\u542F\u7528",skip_reason_prompt:"\u8DF3\u8FC7\u6B64\u4EFB\u52A1\uFF1F",reason_optional:"\u539F\u56E0 (\u53EF\u9009)",reset_date_prompt:"\u6807\u8BB0\u4EFB\u52A1\u4E3A\u5DF2\u6267\u884C\uFF1F",reset_date_optional:"\u6700\u540E\u6267\u884C\u65E5\u671F (\u53EF\u9009\uFF0C\u9ED8\u8BA4\u4E3A\u4ECA\u5929)",notes_label:"\u5907\u6CE8",documentation_label:"\u6587\u6863",no_nfc_tag:"\u2014 \u65E0\u6807\u7B7E \u2014",dashboard:"\u4EEA\u8868\u76D8",settings:"\u8BBE\u7F6E",settings_features:"\u9AD8\u7EA7\u529F\u80FD",settings_features_desc:"\u542F\u7528\u6216\u7981\u7528\u9AD8\u7EA7\u529F\u80FD\u3002\u7981\u7528\u5C06\u4ECE\u754C\u9762\u9690\u85CF\u76F8\u5173\u529F\u80FD\uFF0C\u4F46\u4E0D\u4F1A\u5220\u9664\u6570\u636E\u3002",feat_adaptive:"\u81EA\u9002\u5E94\u8BA1\u5212",feat_adaptive_desc:"\u6839\u636E\u7EF4\u62A4\u5386\u53F2\u5B66\u4E60\u6700\u4F73\u95F4\u9694",feat_predictions:"\u4F20\u611F\u5668\u9884\u6D4B",feat_predictions_desc:"\u6839\u636E\u4F20\u611F\u5668\u635F\u8017\u8D8B\u52BF\u9884\u6D4B\u89E6\u53D1\u65E5\u671F",feat_seasonal:"\u5B63\u8282\u6027\u8C03\u6574",feat_seasonal_desc:"\u6839\u636E\u5B63\u8282\u6027\u6A21\u5F0F\u81EA\u52A8\u8C03\u6574\u95F4\u9694",feat_environmental:"\u73AF\u5883\u5173\u8054",feat_environmental_desc:"\u5C06\u7EF4\u62A4\u95F4\u9694\u4E0E\u6E29\u5EA6\u6216\u6E7F\u5EA6\u5173\u8054",feat_budget:"\u9884\u7B97\u8FFD\u8E2A",feat_budget_desc:"\u8FFD\u8E2A\u6708\u5EA6\u53CA\u5E74\u5EA6\u7EF4\u62A4\u652F\u51FA",feat_groups:"\u4EFB\u52A1\u7EC4",feat_groups_desc:"\u5C06\u4EFB\u52A1\u7EC4\u7EC7\u8FDB\u903B\u8F91\u7EC4",feat_checklists:"\u68C0\u67E5\u6E05\u5355",feat_checklists_desc:"\u4E3A\u4EFB\u52A1\u5B8C\u6210\u63D0\u4F9B\u591A\u6B65\u9AA4\u64CD\u4F5C\u6D41\u7A0B",settings_general:"\u5E38\u89C4",settings_default_warning:"\u9ED8\u8BA4\u9884\u8B66\u5929\u6570",settings_panel_enabled:"\u4FA7\u8FB9\u680F\u9762\u677F",settings_panel_title:"\u4FA7\u8FB9\u680F\u9762\u677F\u6807\u9898",settings_notifications:"\u901A\u77E5",settings_notify_service:"\u901A\u77E5\u670D\u52A1",test_notification:"\u6D4B\u8BD5\u901A\u77E5",send_test:"\u53D1\u9001\u6D4B\u8BD5",testing:"\u6B63\u5728\u53D1\u9001\u2026",test_notification_success:"\u6D4B\u8BD5\u901A\u77E5\u5DF2\u53D1\u9001",test_notification_failed:"\u6D4B\u8BD5\u901A\u77E5\u53D1\u9001\u5931\u8D25",settings_notify_due_soon:"\u5230\u671F\u524D\u901A\u77E5\u63D0\u9192",settings_notify_overdue:"\u8D85\u671F\u540E\u901A\u77E5\u63D0\u9192",settings_notify_triggered:"\u89E6\u53D1\u65F6\u901A\u77E5\u63D0\u9192",settings_interval_hours:"\u91CD\u590D\u63D0\u9192\u95F4\u9694 (\u5C0F\u65F6\uFF0C0 = \u4EC5\u4E00\u6B21)",settings_quiet_hours:"\u9759\u9ED8\u65F6\u6BB5",settings_quiet_start:"\u5F00\u59CB\u65F6\u95F4",settings_quiet_end:"\u7ED3\u675F\u65F6\u95F4",settings_max_per_day:"\u6BCF\u65E5\u6700\u9AD8\u901A\u77E5\u6B21\u6570 (0 = \u4E0D\u9650)",settings_bundling:"\u5408\u5E76\u901A\u77E5",settings_bundle_threshold:"\u5408\u5E76\u9608\u503C",settings_actions:"\u79FB\u52A8\u7AEF\u64CD\u4F5C\u6309\u94AE",settings_action_complete:"\u663E\u793A\u201C\u5B8C\u6210\u201D\u6309\u94AE",settings_action_skip:"\u663E\u793A\u201C\u8DF3\u8FC7\u201D\u6309\u94AE",settings_action_snooze:"\u663E\u793A\u201C\u7A0D\u540E\u201D\u6309\u94AE",settings_snooze_hours:"\u7A0D\u540E\u63D0\u9192\u95F4\u9694 (\u5C0F\u65F6)",settings_budget:"\u9884\u7B97",settings_currency:"\u8D27\u5E01\u5355\u4F4D",settings_budget_monthly:"\u6708\u5EA6\u9884\u7B97",settings_budget_yearly:"\u5E74\u5EA6\u9884\u7B97",settings_budget_alerts:"\u9884\u7B97\u8B66\u62A5",settings_budget_threshold:"\u8B66\u62A5\u9608\u503C (%)",settings_import_export:"\u5BFC\u5165 / \u5BFC\u51FA",settings_export_json:"\u5BFC\u51FA JSON",settings_export_yaml:"\u5BFC\u51FA YAML",settings_export_csv:"\u5BFC\u51FA CSV",settings_import_csv:"\u5BFC\u5165 CSV",settings_import_placeholder:"\u5728\u6B64\u7C98\u8D34 JSON \u6216 CSV \u5185\u5BB9\u2026",settings_import_btn:"\u5BFC\u5165",settings_import_success:"\u6210\u529F\u5BFC\u5165 {count} \u4E2A\u7EF4\u62A4\u9879\u3002",settings_export_success:"\u5BFC\u51FA\u5DF2\u4E0B\u8F7D\u3002",settings_saved:"\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\u3002",settings_include_history:"\u5305\u542B\u5386\u53F2\u8BB0\u5F55",sort_alphabetical:"\u5B57\u6BCD\u6392\u5E8F",sort_due_soonest:"\u6700\u8FD1\u5230\u671F",sort_task_count:"\u4EFB\u52A1\u6570\u91CF",sort_area:"\u533A\u57DF",sort_assigned_user:"\u8D1F\u8D23\u4EBA",sort_group:"\u4EFB\u52A1\u7EC4",groupby_none:"\u4E0D\u5206\u7EC4",groupby_area:"\u6309\u533A\u57DF\u5206\u7EC4",groupby_group:"\u6309\u5206\u7EC4",groupby_user:"\u6309\u8D1F\u8D23\u4EBA",filter_label:"\u8FC7\u6EE4\u5668",user_label:"\u7528\u6237",sort_label:"\u6392\u5E8F",group_by_label:"\u5206\u7EC4\u4F9D\u636E",state_value_help:'\u4F7F\u7528 HA \u72B6\u6001\u503C\uFF08\u901A\u5E38\u4E3A\u5C0F\u5199\uFF0C\u4F8B\u5982 "on"/"off"\uFF09\u3002\u4FDD\u5B58\u65F6\u5927\u5C0F\u5199\u4F1A\u81EA\u52A8\u89C4\u8303\u5316\u3002',target_changes_help:"\u89E6\u53D1\u524D\u9700\u8981\u6EE1\u8DB3\u7684\u72B6\u6001\u8F6C\u6362\u6B21\u6570\uFF08\u9ED8\u8BA4\u4E3A 1\uFF09\u3002",qr_print_title:"\u6253\u5370\u4E8C\u7EF4\u7801",qr_print_desc:"\u751F\u6210\u4E00\u5F20\u5305\u542B\u591A\u4E2A\u4E8C\u7EF4\u7801\u7684\u53EF\u6253\u5370\u9875\u9762\uFF0C\u65B9\u4FBF\u88C1\u526A\u5E76\u8D34\u5728\u8BBE\u5907\u4E0A\u3002",qr_print_load:"\u52A0\u8F7D\u8BBE\u5907",qr_print_filter:"\u8FC7\u6EE4\u5668",qr_print_objects:"\u8BBE\u5907",qr_print_actions:"\u52A8\u4F5C",qr_print_url_mode:"\u94FE\u63A5\u7C7B\u578B",qr_print_estimate:"\u9884\u8BA1\u4E8C\u7EF4\u7801\u6570\u91CF",qr_print_over_limit:"\u4E0A\u9650\u4E3A 200\uFF0C\u8BF7\u7F29\u5C0F\u8FC7\u6EE4\u8303\u56F4",qr_print_generate:"\u751F\u6210\u4E8C\u7EF4\u7801",qr_print_generating:"\u6B63\u5728\u751F\u6210\u2026",qr_print_ready:"\u4E8C\u7EF4\u7801\u5DF2\u5C31\u7EEA",qr_print_print_button:"\u6253\u5370",qr_print_empty:"\u65E0\u5185\u5BB9\u53EF\u751F\u6210",qr_action_skip:"\u8DF3\u8FC7",vacation_title:"\u5EA6\u5047\u6A21\u5F0F",vacation_active:"\u5DF2\u6FC0\u6D3B",vacation_ended:"\u5DF2\u7ED3\u675F",vacation_desc:"\u8BA1\u5212\u5047\u671F\uFF1A\u5728\u6B64\u65F6\u6BB5\u53CA\u8BBE\u5B9A\u7684\u7F13\u51B2\u5929\u6570\u5185\u5C06\u6682\u505C\u901A\u77E5\u3002\u60A8\u53EF\u4EE5\u4E3A\u7279\u5B9A\u4EFB\u52A1\u8BBE\u7F6E\u4F8B\u5916\u3002",vacation_enable:"\u5F00\u542F\u5EA6\u5047\u6A21\u5F0F",vacation_start:"\u5F00\u59CB\u65E5\u671F",vacation_end:"\u7ED3\u675F\u65E5\u671F",vacation_buffer:"\u7F13\u51B2\uFF08\u5929\uFF09",vacation_exempt_title:"\u5EA6\u5047\u671F\u95F4\u4ECD\u4FDD\u6301\u901A\u77E5\u7684\u4EFB\u52A1",vacation_exempt_desc:"\u9009\u62E9\u5728\u5047\u671F\u4E2D\u4ECD\u9700\u63A5\u6536\u901A\u77E5\u7684\u4EFB\u52A1\uFF08\u4F8B\u5982\u5173\u952E\u7684\u6C34\u6C60\u7EF4\u62A4\uFF09\u3002",vacation_load_tasks:"\u52A0\u8F7D\u4EFB\u52A1",vacation_preview_btn:"\u663E\u793A\u9884\u89C8",vacation_preview_affected:"\u53D7\u5F71\u54CD\u7684\u4EFB\u52A1",vacation_event_due_soon:"\u5373\u5C06\u5230\u671F",vacation_event_overdue:"\u5C06\u8D85\u671F",vacation_event_triggered_est:"\u53EF\u80FD\u89E6\u53D1\u4F20\u611F\u5668",vacation_sensor_based:"\uFF08\u57FA\u4E8E\u4F20\u611F\u5668\uFF09",vacation_action_notify:"\u4F9D\u7136\u901A\u77E5",vacation_action_unsilence:"\u6062\u590D\u9759\u9ED8",vacation_marked_complete:"\u5DF2\u6807\u8BB0\u4E3A\u5B8C\u6210",vacation_marked_skip:"\u5DF2\u8DF3\u8FC7",vacation_end_now:"\u7ACB\u5373\u7ED3\u675F\u5EA6\u5047",add:"\u6DFB\u52A0",show_stats:"\u663E\u793A\u7EDF\u8BA1\u4E0E\u56FE\u8868",hide_stats:"\u9690\u85CF\u7EDF\u8BA1",adaptive_no_data:"\u5C1A\u65E0\u8DB3\u591F\u7684\u5B8C\u6210\u8BB0\u5F55\u7528\u4E8E\u81EA\u9002\u5E94\u5206\u6790\u3002\u8BF7\u5B8C\u6210\u6B64\u4EFB\u52A1\u51E0\u6B21\uFF0C\u4EE5\u89E3\u9501\u95F4\u9694\u5EFA\u8BAE\u548C\u53EF\u9760\u6027\u56FE\u8868\u3002",suggestion_applied:"\u5DF2\u5E94\u7528\u5EFA\u8BAE\u95F4\u9694",vacation_mode:"\u5EA6\u5047\u6A21\u5F0F",vacation_status_active:"\u5F53\u524D\u6FC0\u6D3B",vacation_status_scheduled:"\u5DF2\u8BA1\u5212",vacation_status_inactive:"\u672A\u6FC0\u6D3B",vacation_end_now_confirm:"\u786E\u5B9A\u7ACB\u5373\u7ED3\u675F\u5EA6\u5047\u5417\uFF1F",vacation_exempt_count:"\u4F8B\u5916\u9879",vacation_advanced:"\u9AD8\u7EA7\u9009\u9879\u2026",vacation_open_panel:"\u5728\u9762\u677F\u4E2D\u6253\u5F00",enable:"\u542F\u7528",saved:"\u5DF2\u4FDD\u5B58",budget_monthly_set:"\u8BBE\u7F6E\u6708\u5EA6\u9884\u7B97",budget_yearly_set:"\u8BBE\u7F6E\u5E74\u5EA6\u9884\u7B97",budget_advanced:"\u8D27\u5E01\u3001\u9884\u8B66\u2026",budget_open_panel:"\u5728\u9762\u677F\u4E2D\u6253\u5F00",groups_empty:"\u5C1A\u65E0\u5206\u7EC4\u3002",group_new_placeholder:"\u6DFB\u52A0\u5206\u7EC4\u2026",group_delete_confirm:'\u786E\u5B9A\u5220\u9664\u5206\u7EC4 "{name}" \u5417\uFF1F',groups_manage_tasks:"\u7BA1\u7406\u4EFB\u52A1\u5206\u914D\u2026",groups_open_panel:"\u5728\u9762\u677F\u4E2D\u6253\u5F00",unassigned:"\u672A\u5206\u914D",no_area:"\u65E0\u533A\u57DF",has_overdue:"\u6709\u8D85\u671F\u4EFB\u52A1",object:"\u8BBE\u5907",settings_panel_access:"\u9762\u677F\u8BBF\u95EE\u6743\u9650",settings_panel_access_desc:"\u7BA1\u7406\u5458\u59CB\u7EC8\u53EF\u4EE5\u770B\u5230\u5B8C\u6574\u9762\u677F\u3002\u5728\u6B64\u9009\u62E9\u4E5F\u5E94\u62E5\u6709\u5B8C\u6574\u8BBF\u95EE\u6743\u9650\u7684\u666E\u901A\u7528\u6237 \u2014 \u5176\u4ED6\u666E\u901A\u7528\u6237\u5C06\u4EC5\u80FD\u770B\u5230\u201C\u5B8C\u6210\u201D\u548C\u201C\u8DF3\u8FC7\u201D\u6309\u94AE\u3002",no_non_admin_users:"\u672A\u627E\u5230\u666E\u901A\u7528\u6237\u3002\u8BF7\u5728\u201C\u8BBE\u7F6E -> \u4EBA\u5458\u201D\u4E2D\u6DFB\u52A0\u3002",owner_label:"\u6240\u6709\u8005",feat_completion_actions:"\u5B8C\u6210\u52A8\u4F5C",feat_completion_actions_desc:"\u4E3A\u6BCF\u4E2A\u4EFB\u52A1\u914D\u7F6E\u5B8C\u6210\u65F6\u7684 HA \u52A8\u4F5C + \u9884\u8BBE\u503C\u7684\u5FEB\u901F\u5B8C\u6210\u4E8C\u7EF4\u7801\u3002",on_complete_action_title:"\u5B8C\u6210\u65F6\uFF1A\u89E6\u53D1 HA \u52A8\u4F5C\uFF08\u53EF\u9009\uFF09",on_complete_action_desc:"\u4EFB\u52A1\u5B8C\u6210\u65F6\u8C03\u7528 HA \u670D\u52A1 \u2014 \u4F8B\u5982\u91CD\u7F6E\u8BBE\u5907\u4E0A\u7684\u7269\u7406\u8BA1\u6570\u5668\u3002",on_complete_action_service:"\u670D\u52A1",on_complete_action_target:"\u76EE\u6807\u5B9E\u4F53",on_complete_action_target_hint:"\u6CE8\u610F\uFF1A\u5B9E\u4F53\u7684\u57DF\u5FC5\u987B\u4E0E\u670D\u52A1\u5339\u914D \u2014 \u4F8B\u5982 'button.press' \u4EC5\u9002\u7528\u4E8E button.* \u5B9E\u4F53\uFF0C'counter.increment' \u4EC5\u9002\u7528\u4E8E counter.* \u5B9E\u4F53\u7B49\u3002\u5982\u679C\u4E0D\u5339\u914D\uFF0C\u52A8\u4F5C\u5C06\u9759\u9ED8\u5931\u8D25\u3002",on_complete_action_data:"\u6570\u636E\uFF08JSON, \u53EF\u9009\uFF09",on_complete_action_test:"\u9A8C\u8BC1\u914D\u7F6E",on_complete_action_test_success:"\u2713 \u914D\u7F6E\u6709\u6548\uFF08\u52A8\u4F5C\u5C06\u5728\u4EFB\u52A1\u5B8C\u6210\u65F6\u89E6\u53D1\uFF09",on_complete_action_test_failed:"\u5931\u8D25",quick_complete_defaults_title:"\u5FEB\u901F\u5B8C\u6210\u9ED8\u8BA4\u503C\uFF08\u7528\u4E8E\u4E8C\u7EF4\u7801\u626B\u63CF, \u53EF\u9009\uFF09",quick_complete_defaults_desc:"\u626B\u63CF\u5FEB\u901F\u5B8C\u6210\u4E8C\u7EF4\u7801\u65F6\u4F7F\u7528\u7684\u9884\u8BBE\u503C\u3002\u5982\u679C\u4E0D\u8BBE\u7F6E\uFF0C\u4E8C\u7EF4\u7801\u5C06\u6253\u5F00\u5B8C\u6210\u5BF9\u8BDD\u6846\u3002",quick_complete_defaults_notes:"\u5907\u6CE8",quick_complete_defaults_cost:"\u8D39\u7528",quick_complete_defaults_duration:"\u8017\u65F6\uFF08\u5206\u949F\uFF09",quick_complete_defaults_feedback_none:"\u65E0\u53CD\u9988",quick_complete_defaults_feedback_needed:"\u662F\u5FC5\u8981\u7684",quick_complete_defaults_feedback_not_needed:"\u4E0D\u5FC5\u8981\u7684",quick_complete_success:"\u5DF2\u5FEB\u901F\u6807\u8BB0\u4E3A\u5B8C\u6210",show_all_objects:"\u663E\u793A\u6240\u6709\u8BBE\u5907",show_all_tasks:"\u6E05\u9664\u8FC7\u6EE4 \u2014 \u663E\u793A\u6240\u6709\u4EFB\u52A1",filter_to_overdue:"\u4EC5\u663E\u793A\u8D85\u671F\u4EFB\u52A1",filter_to_due_soon:"\u4EC5\u663E\u793A\u5373\u5C06\u5230\u671F\u4EFB\u52A1",filter_to_triggered:"\u4EC5\u663E\u793A\u5DF2\u89E6\u53D1\u4EFB\u52A1",open_task:"\u6253\u5F00\u4EFB\u52A1",show_details:"\u663E\u793A\u5386\u53F2\u4E0E\u7EDF\u8BA1",hide_details:"\u9690\u85CF\u8BE6\u60C5",history_empty:"\u5C1A\u65E0\u5386\u53F2\u8BB0\u5F55\u3002",history_edit_button:"\u7F16\u8F91\u6761\u76EE",total_cost:"\u603B\u8BA1\u8D39\u7528",times_performed:"\u6267\u884C\u6B21\u6570",older_entries:"\u66F4\u65E9\u7684\u6761\u76EE",open_in_panel:"\u5728\u7EF4\u62A4\u9762\u677F\u4E2D\u6253\u5F00",skip_reason:"\u8DF3\u8FC7\u539F\u56E0\uFF08\u53EF\u9009\uFF09",reset_to_date:"\u91CD\u7F6E\u6700\u540E\u6267\u884C\u65E5\u671F\u4E3A",delete_task_confirm:"\u786E\u5B9A\u5220\u9664\u6B64\u4EFB\u52A1\u53CA\u5176\u5386\u53F2\u8BB0\u5F55\u5417\uFF1F",delete_object_confirm:"\u786E\u5B9A\u5220\u9664\u6B64\u8BBE\u5907\u53CA\u5176\u6240\u6709\u4EFB\u52A1\u5417\uFF1F",loading:"\u52A0\u8F7D\u4E2D\u2026"},At={de:ka,en:wa,nl:xa,fr:za,it:Aa,es:$a,pt:ja,ru:Sa,uk:Ea,pl:qa,cs:Na,sv:Ta,zh:Ca};$e=z`
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
  /* Archived one-time task (completed) — muted blue-grey, visually "done". */
  .status-badge.done { background-color: var(--maint-done-color, #78909c); }

  /* v1.4.7: 5-column grid so all 5 KPIs (Objects/Tasks/Overdue/Due Soon/
     Triggered) always stay in one row. The previous flex-wrap layout was
     wrapping the 5th item (Triggered, the widest label) onto its own row
     on narrow viewports because the natural width of the items pushed past
     the container width. Grid forces equal 1/5 distribution regardless of
     label length. */
  .stats-bar {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
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

  /* v2.2.0 — row holds the type label + the small Edit button */
  .history-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
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
`});function Ra(o,a){let e=Da[o];if(!e)return o;let t=i(e,a);return t&&t!==e?t:o}function Ma(o){let e=o.match(/data\['([^']+)'\]/)?.[1],t;return(t=o.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=o.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=o.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=o.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(o)?{field:e,rule:"required"}:(t=o.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(o)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(o)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function q(o,a,e){if(typeof o=="string")return o;if(typeof o!="object"||o===null)return e;let t=o,n=t.message||t.error?.message||"";if(!n)return e;let r=Ma(n),_=r.field?Ra(r.field,a):"",d=c=>i(c,a).replace("{field}",_).replace("{n}",r.param??"");switch(r.rule){case"too_long":return d("err_too_long");case"too_short":return d("err_too_short");case"value_too_high":return d("err_value_too_high");case"value_too_low":return d("err_value_too_low");case"required":return d("err_required");case"wrong_type":return d("err_wrong_type").replace("{type}",r.param??"");case"invalid_choice":return d("err_invalid_choice");case"invalid_value":return d("err_invalid_value");default:return n||e}}var Da,Y=y(()=>{"use strict";S();Da={name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",group_name:"name",group_description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_for_minutes:"trigger_for_minutes"}});var $,Be=y(()=>{"use strict";E();I();S();Y();$=class extends w{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed"}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState={},this._feedback="needed")}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),await this.hass.connection.sendMessagePromise(e),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=q(e,this.lang,i("save_error",this.lang))}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return s``;let e=this.lang||this.hass?.language||"en";return s`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${i("complete_title",e)}${this.taskName}</div>
        <div class="content">
          ${this._error?s`<div class="error">${this._error}</div>`:p}
          ${this.checklist.length>0?s`
            <div class="checklist-section">
              <label class="checklist-label">${i("checklist",e)}</label>
              ${this.checklist.map((t,n)=>s`
                <label class="checklist-item" @click=${()=>this._toggleCheck(n)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(n)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:p}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${i("notes_optional",e)}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${i("cost_optional",e)}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${t=>this._cost=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${i("duration_minutes",e)}</span>
            <input type="number" step="1" min="0" class="field-input"
              .value=${this._duration}
              @input=${t=>this._duration=t.target.value} />
          </label>
          ${this.adaptiveEnabled?s`
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
          `:p}
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
    `}};$.styles=z`
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
    .field { display: flex; flex-direction: column; gap: 4px; }
    .field-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .field-input {
      padding: 8px 10px; font-size: 14px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      font-family: inherit;
      width: 100%; box-sizing: border-box;
    }
    .field-input:focus {
      outline: none;
      border-color: var(--primary-color);
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
  `,l([v({attribute:!1})],$.prototype,"hass",2),l([v()],$.prototype,"entryId",2),l([v()],$.prototype,"taskId",2),l([v()],$.prototype,"taskName",2),l([v()],$.prototype,"lang",2),l([v({type:Array})],$.prototype,"checklist",2),l([v({type:Boolean})],$.prototype,"adaptiveEnabled",2),l([u()],$.prototype,"_open",2),l([u()],$.prototype,"_notes",2),l([u()],$.prototype,"_cost",2),l([u()],$.prototype,"_duration",2),l([u()],$.prototype,"_loading",2),l([u()],$.prototype,"_error",2),l([u()],$.prototype,"_checklistState",2),l([u()],$.prototype,"_feedback",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",$)});var N,We=y(()=>{"use strict";E();I();N=class extends w{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){return s`
      <label class="field">
        ${this.label?s`<span class="label">${this.label}${this.required?s`<span class="req">*</span>`:p}</span>`:p}
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??p}
          min=${this.min??p}
          max=${this.max??p}
          pattern=${this.pattern??p}
          @input=${this._onInput}
          @change=${this._onInput}
        />
        ${this.helper?s`<span class="helper">${this.helper}</span>`:p}
      </label>
    `}};N.styles=z`
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
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `,l([v()],N.prototype,"label",2),l([v()],N.prototype,"value",2),l([v()],N.prototype,"placeholder",2),l([v()],N.prototype,"type",2),l([v({type:Boolean})],N.prototype,"required",2),l([v({type:Boolean})],N.prototype,"disabled",2),l([v()],N.prototype,"step",2),l([v()],N.prototype,"min",2),l([v()],N.prototype,"max",2),l([v()],N.prototype,"pattern",2),l([v()],N.prototype,"helper",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",N)});var j,Nt=y(()=>{"use strict";E();I();S();Y();We();j=class extends w{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._documentationUrl="";this._notes="";this._entryId=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._documentationUrl="",this._notes="",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._error="",this._open=!0}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(e){this._error=q(e,this._lang,i("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}render(){if(!this._open)return s``;let e=this._lang,t=this._entryId?i("edit_object",e):i("new_object",e);return s`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?s`<div class="error">${this._error}</div>`:p}
          <ms-textfield
            label="${i("name",e)}"
            required
            .value=${this._name}
            @input=${n=>this._name=n.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${n=>this._manufacturer=n.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("model_optional",e)}"
            .value=${this._model}
            @input=${n=>this._model=n.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${n=>this._serialNumber=n.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${n=>this._documentationUrl=n.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${i("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${n=>this._areaId=n.detail.value||""}
          ></ha-area-picker>
          <ms-textfield
            label="${i("installation_date_optional",e)}"
            type="date"
            .value=${this._installationDate}
            @input=${n=>this._installationDate=n.target.value}
          ></ms-textfield>
          <label class="textarea-field">
            <span class="textarea-label">${i("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${n=>this._notes=n.target.value}
            ></textarea>
          </label>
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
    `}};j.styles=z`
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
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
  `,l([v({attribute:!1})],j.prototype,"hass",2),l([u()],j.prototype,"_open",2),l([u()],j.prototype,"_loading",2),l([u()],j.prototype,"_error",2),l([u()],j.prototype,"_name",2),l([u()],j.prototype,"_manufacturer",2),l([u()],j.prototype,"_model",2),l([u()],j.prototype,"_serialNumber",2),l([u()],j.prototype,"_areaId",2),l([u()],j.prototype,"_installationDate",2),l([u()],j.prototype,"_documentationUrl",2),l([u()],j.prototype,"_notes",2),l([u()],j.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",j)});var je,Tt=y(()=>{"use strict";je=class{constructor(a){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=a}updateHass(a){this.hass=a}async getUsers(a=!1){let e=Date.now();if(!a&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(a,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:a,task_id:e,user_id:t})}async getTasksByUser(a){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:a})).tasks}getUserName(a){return!a||!this.usersCache?null:this.usersCache.find(t=>t.id===a)?.name||null}getUser(a){return!a||!this.usersCache?null:this.usersCache.find(e=>e.id===a)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(a){return a?a===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}}});function Oa(o){return Array.from({length:7},(a,e)=>Ae(e,o,"short"))}var Pa,Fa,La,Ha,g,Ct=y(()=>{"use strict";E();I();S();Tt();Y();We();Pa=["cleaning","inspection","replacement","calibration","service","custom"],Fa=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],La=["weekdays","nth_weekday","day_of_month"],Ha=["threshold","counter","state_change","runtime"];g=class extends w{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._notes="";this._documentationUrl="";this._customIcon="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._availableTags=[];this._responsibleUserId=null;this._availableUsers=[];this._checklistText="";this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._userService=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}async openCreate(e,t){this._entryId=e,this._taskId=null,this._error="",!e&&t&&t.length>0?(this._objectChoices=t.map(n=>({entry_id:n.entry_id,name:n.object.name})).sort((n,r)=>n.name.localeCompare(r.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}async openEdit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let n=t.schedule;this._weekdays=n?.kind==="weekdays"?[...n.weekdays??[]]:[],this._nth=n?.kind==="nth_weekday"?String(n.nth??1):"1",this._nthWeekday=n?.kind==="nth_weekday"?String(n.weekday??5):"5",this._domDay=n?.kind==="day_of_month"?String(n.day??1):"1",this._warningDays=t.warning_days.toString(),this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._nfcTagId=t.nfc_tag_id||"",this._responsibleUserId=t.responsible_user_id||null,this._checklistText=(t.checklist||[]).join(`
`),this._scheduleTime=t.schedule_time||"";let r=t.on_complete_action;if(r&&r.service){this._actionService=r.service;let c=r.target?.entity_id;this._actionTargetEntity=Array.isArray(c)?c[0]||"":c||"",this._actionData=r.data&&typeof r.data=="object"?{...r.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let _=t.quick_complete_defaults;this._qcNotes=_?.notes||"",this._qcCost=_?.cost!=null?String(_.cost):"",this._qcDuration=_?.duration!=null?String(_.duration):"",this._qcFeedback=_?.feedback||"";let d=t.adaptive_config||{};if(this._environmentalEntity=d.environmental_entity||"",this._environmentalAttribute=d.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,t.trigger_config){let c=t.trigger_config;this._triggerEntityId=c.entity_id||"",this._triggerEntityIds=c.entity_ids||(c.entity_id?[c.entity_id]:[]),this._triggerEntityLogic=c.entity_logic||"any",this._triggerAttribute=c.attribute||"",this._triggerType=c.type||"threshold",this._triggerAbove=c.trigger_above?.toString()||"",this._triggerBelow=c.trigger_below?.toString()||"",this._triggerForMinutes=c.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=c.trigger_target_value?.toString()||"",this._triggerDeltaMode=c.trigger_delta_mode||!1,this._triggerFromState=c.trigger_from_state||"",this._triggerToState=c.trigger_to_state||"",this._triggerTargetChanges=c.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=c.trigger_runtime_hours?.toString()||""}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._notes="",this._documentationUrl="",this._customIcon="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._responsibleUserId=null,this._checklistText="",this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours=""}async _loadUsers(){this._userService||(this._userService=new je(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,n]=e.split(".");if(!this.hass?.services?.[t]?.[n]){this._actionTestResult="error",this._actionTestError=`Service "${e}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let r=this._actionTargetEntity.trim();if(r){let _=r.split(".")[0];if(_!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=`Service "${e}" only works on ${t}.* entities; entity "${r}" is in ${_}.* \u2014 pick a service that matches the entity domain (e.g. ${_}.${n})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[r]){this._actionTestResult="error",this._actionTestError=`Target entity "${r}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,n]=e.split("."),r=this.hass?.services?.[t]?.[n]?.fields;return!r||Object.keys(r).length===0?null:Object.entries(r).map(([_,d])=>({name:_,required:!!d.required,selector:d.selector||{text:{}}}))}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled)return p;let t=this._serviceSchema();return s`
      <details class="ca-section">
        <summary>${i("on_complete_action_title",e)}</summary>
        <p class="field-help">${i("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${n=>{this._actionService=n.detail.value||"";let r=this._serviceSchema();if(r){let _=new Set(r.map(d=>d.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([d])=>_.has(d)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>i("on_complete_action_target",e)}
          @value-changed=${n=>{let r=n.detail.value;this._actionTargetEntity=r.target_entity||""}}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${i("on_complete_action_target_hint",e)}
        </p>
        ${t?s`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${n=>{this._actionData={...n.detail.value}}}
              ></ha-form>
            `:s`
              <ms-textfield
                label="${i("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${n=>{this._actionDataJsonFallback=n.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":i("on_complete_action_test",e)}
          </button>
          ${this._actionTestResult==="ok"?s`<span class="ca-test-ok">${i("on_complete_action_test_success",e)}</span>`:p}
          ${this._actionTestResult==="error"?s`<div class="ca-test-error-block">
                <span class="ca-test-error">${i("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?s`<div class="ca-test-error-detail">${this._actionTestError}</div>`:p}
              </div>`:p}
        </div>
      </details>

      <details class="ca-section">
        <summary>${i("quick_complete_defaults_title",e)}</summary>
        <p class="field-help">${i("quick_complete_defaults_desc",e)}</p>
        <ms-textfield
          label="${i("quick_complete_defaults_notes",e)}"
          .value=${this._qcNotes}
          @input=${n=>{this._qcNotes=n.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${i("quick_complete_defaults_cost",e)}"
          type="number" min="0" step="0.01"
          .value=${this._qcCost}
          @input=${n=>{this._qcCost=n.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${i("quick_complete_defaults_duration",e)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${n=>{this._qcDuration=n.target.value}}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${n=>{this._qcFeedback=n.target.value}}>
          <option value="">${i("quick_complete_defaults_feedback_none",e)}</option>
          <option value="needed">${i("quick_complete_defaults_feedback_needed",e)}</option>
          <option value="not_needed">${i("quick_complete_defaults_feedback_not_needed",e)}</option>
        </select>
      </details>
    `}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=t.domain||"",this._suggestedAttributes=t.suggested_attributes||[],this._availableAttributes=t.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:parseInt(this._warningDays,10)||7};if(this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):La.includes(this._scheduleType)?(e.schedule=this._buildSchedule(),e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.enabled=this._enabled,e.last_performed=this._lastPerformed||null,e.nfc_tag_id=this._nfcTagId||null,e.responsible_user_id=this._responsibleUserId,this._scheduleType==="sensor_based"&&this._triggerEntityId){let _=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],d={entity_id:_[0],entity_ids:_,type:this._triggerType};if(this._triggerAttribute&&(d.attribute=this._triggerAttribute),_.length>1&&(d.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let c=parseFloat(this._triggerAbove);isNaN(c)||(d.trigger_above=c)}if(this._triggerBelow){let c=parseFloat(this._triggerBelow);isNaN(c)||(d.trigger_below=c)}if(this._triggerForMinutes){let c=parseInt(this._triggerForMinutes,10);isNaN(c)||(d.trigger_for_minutes=c)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let c=parseFloat(this._triggerTargetValue);isNaN(c)||(d.trigger_target_value=c)}d.trigger_delta_mode=this._triggerDeltaMode}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(d.trigger_from_state=this._triggerFromState),this._triggerToState&&(d.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let c=parseInt(this._triggerTargetChanges,10);isNaN(c)||(d.trigger_target_changes=c)}}else if(this._triggerType==="runtime"&&this._triggerRuntimeHours){let c=parseFloat(this._triggerRuntimeHours);isNaN(c)||(d.trigger_runtime_hours=c)}e.trigger_config=d}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let _=this._scheduleTime.trim();e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(_)?_:null}if(this.checklistsEnabled){let _=this._checklistText.split(`
`).map(d=>d.trim()).filter(Boolean).slice(0,100);e.checklist=_.length?_:null}if(this.completionActionsEnabled){let _=this._actionService.trim();if(_&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(_)){let b={service:_},h=this._actionTargetEntity.trim();h&&(b.target={entity_id:h});let k=this._buildActionData();Object.keys(k).length>0&&(b.data=k),e.on_complete_action=b}else e.on_complete_action=null;let d={};this._qcNotes.trim()&&(d.notes=this._qcNotes.trim());let c=parseFloat(this._qcCost);!isNaN(c)&&c>=0&&(d.cost=c);let m=parseInt(this._qcDuration,10);!isNaN(m)&&m>=0&&(d.duration=m),this._qcFeedback&&(d.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(d).length?d:null}let t=await this.hass.connection.sendMessagePromise(e),n=this._taskId||t?.task_id,r=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(n&&this._scheduleType==="sensor_based"&&r)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:n,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(e){this._error=q(e,this._lang,i("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let e=this._lang;return s`
      <h3>${i("trigger_configuration",e)}</h3>
      <ms-textfield
        label="${i("entity_id",e)} (${i("comma_separated",e)})"
        .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
        @input=${t=>{let r=t.target.value.split(",").map(_=>_.trim()).filter(Boolean);this._triggerEntityId=r[0]||"",this._triggerEntityIds=r,r[0]&&this._fetchEntityAttributes(r[0])}}
      ></ms-textfield>
      ${this._triggerEntityIds.length>1?s`
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
      `:p}
      ${this._availableAttributes.length>0?s`
          <div class="select-row">
            <label>${i("attribute_optional",e)}</label>
            <select
              .value=${this._triggerAttribute}
              @change=${t=>this._triggerAttribute=t.target.value}
            >
              <option value="" ?selected=${!this._triggerAttribute}>${i("use_entity_state",e)}</option>
              ${this._suggestedAttributes.map(t=>s`<option value=${t} ?selected=${t===this._triggerAttribute}>${t} ★</option>`)}
              ${this._availableAttributes.filter(t=>!this._suggestedAttributes.includes(t.name)).map(t=>s`<option value=${t.name} ?selected=${t.name===this._triggerAttribute}>${t.name}${t.numeric?"":" (non-numeric)"}</option>`)}
            </select>
          </div>
        `:s`
          <ms-textfield
            label="${i("attribute_optional",e)}"
            .value=${this._triggerAttribute}
            @input=${t=>this._triggerAttribute=t.target.value}
          ></ms-textfield>
        `}
      <div class="select-row">
        <label>${i("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${t=>this._triggerType=t.target.value}
        >
          ${Ha.map(t=>s`<option value=${t} ?selected=${t===this._triggerType}>${i(t,e)}</option>`)}
        </select>
      </div>
      ${this._renderTriggerTypeFields()}
      <ms-textfield
        label="${i("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${t=>this._intervalDays=t.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():p}
    `}_renderUnitSelect(){let e=this._lang;return s`
      <div class="select-row">
        <label>${i("interval_unit",e)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${t=>this._intervalUnit=t.target.value}
        >
          ${["days","weeks","months","years"].map(t=>s`<option value=${t} ?selected=${t===this._intervalUnit}>${i("unit_"+t,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_buildSchedule(){return this._scheduleType==="weekdays"?{kind:"weekdays",weekdays:[...this._weekdays].sort((e,t)=>e-t)}:this._scheduleType==="nth_weekday"?{kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)}:{kind:"day_of_month",day:parseInt(this._domDay,10)||1}}_renderCalendarFields(){let e=this._lang,t=Oa(e);if(this._scheduleType==="weekdays")return s`
        <label class="field-label">${i("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((n,r)=>s`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(r)?"selected":""}"
              @click=${()=>this._toggleWeekday(r)}
            >${n}</button>`)}
        </div>`;if(this._scheduleType==="nth_weekday"){let n=[["1",i("ord_1",e)],["2",i("ord_2",e)],["3",i("ord_3",e)],["4",i("ord_4",e)],["5",i("ord_5",e)],["-1",i("ord_last",e)]];return s`
        <div class="select-row">
          <label>${i("recurrence_occurrence",e)}</label>
          <select .value=${this._nth} @change=${r=>this._nth=r.target.value}>
            ${n.map(([r,_])=>s`<option value=${r} ?selected=${r===this._nth}>${_}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${i("recurrence_weekday",e)}</label>
          <select .value=${this._nthWeekday} @change=${r=>this._nthWeekday=r.target.value}>
            ${t.map((r,_)=>s`<option value=${String(_)} ?selected=${String(_)===this._nthWeekday}>${r}</option>`)}
          </select>
        </div>`}return this._scheduleType==="day_of_month"?s`
        <ms-textfield
          label="${i("recurrence_day",e)}"
          type="number"
          min="1"
          max="31"
          .value=${this._domDay}
          @input=${n=>this._domDay=n.target.value}
        ></ms-textfield>`:p}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?s`
        <ms-textfield
          label="${i("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${t=>this._triggerAbove=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${i("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${t=>this._triggerBelow=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${i("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?s`
        <ms-textfield
          label="${i("target_value",e)}"
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
          ${i("delta_mode",e)}
        </label>
      `:this._triggerType==="state_change"?s`
        <ms-textfield
          label="${i("from_state_optional",e)}"
          .value=${this._triggerFromState}
          @input=${t=>this._triggerFromState=t.target.value}
        ></ms-textfield>
        <div class="field-help">${i("state_value_help",e)}</div>
        <ms-textfield
          label="${i("to_state_optional",e)}"
          .value=${this._triggerToState}
          @input=${t=>this._triggerToState=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${i("target_changes",e)}"
          type="number"
          min="1"
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${i("target_changes_help",e)}</div>
      `:this._triggerType==="runtime"?s`
        <ms-textfield
          label="${i("runtime_hours",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${t=>this._triggerRuntimeHours=t.target.value}
        ></ms-textfield>
      `:p}render(){if(!this._open)return s``;let e=this._lang,t=this._taskId?i("edit_task",e):i("new_task",e);return s`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?s`<div class="error">${this._error}</div>`:p}
          ${this._objectChoices.length>0?s`
            <div class="select-row">
              <label>${i("object",e)}</label>
              <select
                .value=${this._entryId}
                @change=${n=>this._entryId=n.target.value}
              >
                ${this._objectChoices.map(n=>s`<option value=${n.entry_id} ?selected=${n.entry_id===this._entryId}>${n.name}</option>`)}
              </select>
            </div>
          `:p}
          <ms-textfield
            label="${i("task_name",e)}"
            required
            .value=${this._name}
            @input=${n=>this._name=n.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${i("maintenance_type",e)}</label>
            <select
              .value=${this._type}
              @change=${n=>this._type=n.target.value}
            >
              ${Pa.map(n=>s`<option value=${n} ?selected=${n===this._type}>${i(n,e)}</option>`)}
            </select>
          </div>
          <div class="select-row">
            <label>${i("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${n=>this._scheduleType=n.target.value}
            >
              ${Fa.map(n=>s`<option value=${n} ?selected=${n===this._scheduleType}>${i(n,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?s`
                <ms-textfield
                  label="${i("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${n=>this._intervalDays=n.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${i("interval_anchor",e)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${n=>this._intervalAnchor=n.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${i("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${i("anchor_planned",e)}</option>
                  </select>
                </div>
                ${this.scheduleTimeEnabled?s`
                  <ms-textfield
                    label="${i("schedule_time_optional",e)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${i("schedule_time_help",e)}"
                    @input=${n=>this._scheduleTime=n.target.value}
                  ></ms-textfield>
                `:p}
              `:p}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?s`
                <ms-textfield
                  label="${i("due_date",e)}"
                  type="date"
                  .value=${this._dueDate}
                  @input=${n=>this._dueDate=n.target.value}
                ></ms-textfield>
              `:p}
          <ms-textfield
            label="${i("warning_days",e)}"
            type="number"
            .value=${this._warningDays}
            @input=${n=>this._warningDays=n.target.value}
          ></ms-textfield>
          ${this.checklistsEnabled?s`
            <h3>${i("checklist_steps_optional",e)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${i("checklist_placeholder",e)}"
              .value=${this._checklistText}
              @input=${n=>this._checklistText=n.target.value}
            ></textarea>
            <div class="field-help">${i("checklist_help",e)}</div>
          `:p}
          <ms-textfield
            label="${i("last_performed_optional",e)}"
            type="date"
            .value=${this._lastPerformed}
            @input=${n=>this._lastPerformed=n.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${i("responsible_user",e)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${n=>{let r=n.target.value;this._responsibleUserId=r||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${i("no_user_assigned",e)}</option>
              ${this._availableUsers.map(n=>s`<option value=${n.id} ?selected=${n.id===this._responsibleUserId}>${n.name}</option>`)}
            </select>
          </div>
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?s`
            <ms-textfield
              label="${i("environmental_entity_optional",e)}"
              helper="${i("environmental_entity_helper",e)}"
              .value=${this._environmentalEntity}
              @input=${n=>this._environmentalEntity=n.target.value.trim()}
            ></ms-textfield>
            ${this._environmentalEntity?s`
              <ms-textfield
                label="${i("environmental_attribute_optional",e)}"
                .value=${this._environmentalAttribute}
                @input=${n=>this._environmentalAttribute=n.target.value.trim()}
              ></ms-textfield>
            `:p}
          `:p}
          <ms-textfield
            label="${i("notes_optional",e)}"
            .value=${this._notes}
            @input=${n=>this._notes=n.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${i("documentation_url_optional",e)}"
            .value=${this._documentationUrl}
            @input=${n=>this._documentationUrl=n.target.value}
          ></ms-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${i("custom_icon_optional",e)}"
            .value=${this._customIcon}
            @value-changed=${n=>this._customIcon=n.detail.value||""}
          ></ha-icon-picker>
          ${this._availableTags.length>0?s`
              <div class="select-row">
                <label>${i("nfc_tag_id_optional",e)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${n=>this._nfcTagId=n.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${i("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(n=>s`<option value=${n.id} ?selected=${n.id===this._nfcTagId}>${n.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${i("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:s`
              <ms-textfield
                label="${i("nfc_tag_id_optional",e)}"
                .value=${this._nfcTagId}
                @input=${n=>this._nfcTagId=n.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${i("nfc_tags_empty_help",e)}
                <a href="/config/tags">${i("nfc_tags_open_settings",e)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${i("nfc_tags_refresh",e)}
                </button>
              </div>
            `}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${n=>this._enabled=n.target.checked}
            />
            ${i("task_enabled",e)}
          </label>
          ${this._renderCompletionActionsSection(e)}
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
    `}};g.styles=z`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* v1.3.0: completion-action sections */
    .ca-section {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 8px;
    }
    .ca-section > summary {
      cursor: pointer;
      font-weight: 500;
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
    .field-help {
      font-size: 12px;
      color: var(--secondary-text-color);
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
  `,l([v({attribute:!1})],g.prototype,"hass",2),l([v({type:Boolean,attribute:"checklists-enabled"})],g.prototype,"checklistsEnabled",2),l([v({type:Boolean,attribute:"schedule-time-enabled"})],g.prototype,"scheduleTimeEnabled",2),l([v({type:Boolean,attribute:"completion-actions-enabled"})],g.prototype,"completionActionsEnabled",2),l([v({type:Number,attribute:"default-warning-days"})],g.prototype,"defaultWarningDays",2),l([u()],g.prototype,"_open",2),l([u()],g.prototype,"_loading",2),l([u()],g.prototype,"_error",2),l([u()],g.prototype,"_entryId",2),l([u()],g.prototype,"_taskId",2),l([u()],g.prototype,"_objectChoices",2),l([u()],g.prototype,"_name",2),l([u()],g.prototype,"_type",2),l([u()],g.prototype,"_scheduleType",2),l([u()],g.prototype,"_intervalDays",2),l([u()],g.prototype,"_intervalUnit",2),l([u()],g.prototype,"_dueDate",2),l([u()],g.prototype,"_warningDays",2),l([u()],g.prototype,"_intervalAnchor",2),l([u()],g.prototype,"_weekdays",2),l([u()],g.prototype,"_nth",2),l([u()],g.prototype,"_nthWeekday",2),l([u()],g.prototype,"_domDay",2),l([u()],g.prototype,"_notes",2),l([u()],g.prototype,"_documentationUrl",2),l([u()],g.prototype,"_customIcon",2),l([u()],g.prototype,"_enabled",2),l([u()],g.prototype,"_triggerEntityId",2),l([u()],g.prototype,"_triggerEntityIds",2),l([u()],g.prototype,"_triggerEntityLogic",2),l([u()],g.prototype,"_triggerAttribute",2),l([u()],g.prototype,"_triggerType",2),l([u()],g.prototype,"_triggerAbove",2),l([u()],g.prototype,"_triggerBelow",2),l([u()],g.prototype,"_triggerForMinutes",2),l([u()],g.prototype,"_triggerTargetValue",2),l([u()],g.prototype,"_triggerDeltaMode",2),l([u()],g.prototype,"_triggerFromState",2),l([u()],g.prototype,"_triggerToState",2),l([u()],g.prototype,"_triggerTargetChanges",2),l([u()],g.prototype,"_triggerRuntimeHours",2),l([u()],g.prototype,"_suggestedAttributes",2),l([u()],g.prototype,"_availableAttributes",2),l([u()],g.prototype,"_entityDomain",2),l([u()],g.prototype,"_lastPerformed",2),l([u()],g.prototype,"_nfcTagId",2),l([u()],g.prototype,"_availableTags",2),l([u()],g.prototype,"_responsibleUserId",2),l([u()],g.prototype,"_availableUsers",2),l([u()],g.prototype,"_checklistText",2),l([u()],g.prototype,"_scheduleTime",2),l([u()],g.prototype,"_actionService",2),l([u()],g.prototype,"_actionTargetEntity",2),l([u()],g.prototype,"_actionData",2),l([u()],g.prototype,"_actionDataJsonFallback",2),l([u()],g.prototype,"_actionTesting",2),l([u()],g.prototype,"_actionTestResult",2),l([u()],g.prototype,"_actionTestError",2),l([u()],g.prototype,"_qcNotes",2),l([u()],g.prototype,"_qcCost",2),l([u()],g.prototype,"_qcDuration",2),l([u()],g.prototype,"_qcFeedback",2),l([u()],g.prototype,"_environmentalEntity",2),l([u()],g.prototype,"_environmentalAttribute",2);customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",g)});var H,It=y(()=>{"use strict";E();I();S();Y();H=class extends w{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null}get _lang(){return this.hass?.language||"en"}openEdit(e){this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let e={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(e.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(e.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(e.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(e.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(e.completed_by=this._draft.completed_by),Object.keys(e).filter(n=>!["type","entry_id","task_id","original_timestamp"].includes(n)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(e),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=q(e,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return p;let e=this._lang,t=this._draft;return s`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${i("history_edit_title",e)||"Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${i(t.type,e)||t.type}</span>
        </div>
        <label>
          <span>${i("history_edit_timestamp",e)||"Timestamp"}</span>
          <input type="datetime-local"
            .value=${t.timestamp.length>=16?t.timestamp.slice(0,16):t.timestamp}
            @change=${n=>{let r=n.target.value;this._set("timestamp",r.length===16?`${r}:00`:r)}} />
        </label>
        <label>
          <span>${i("notes",e)||"Notes"}</span>
          <textarea
            rows="3"
            @input=${n=>{let r=n.target.value;this._set("notes",r||null)}}
            .value=${t.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${i("cost",e)||"Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${t.cost!=null?String(t.cost):""}
              @input=${n=>{let r=n.target.value;this._set("cost",r?Number(r):null)}} />
          </label>
          <label>
            <span>${i("duration",e)||"Duration (min)"}</span>
            <input type="number" min="0"
              .value=${t.duration!=null?String(t.duration):""}
              @input=${n=>{let r=n.target.value;this._set("duration",r?Number(r):null)}} />
          </label>
        </div>
        ${this._error?s`<div class="error">${this._error}</div>`:p}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${i("cancel",e)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?i("saving",e)||"Saving\u2026":i("save",e)||"Save"}
          </button>
        </div>
      </div>
    `}};H.styles=z`
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
  `,l([v({attribute:!1})],H.prototype,"hass",2),l([u()],H.prototype,"_open",2),l([u()],H.prototype,"_saving",2),l([u()],H.prototype,"_error",2),l([u()],H.prototype,"_draft",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",H)});function oe(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Dt(o){return!o.startsWith("data:image/svg+xml,")&&!o.startsWith("data:image/png;base64,")?"":oe(o)}function Ua(o){return o.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var T,Rt=y(()=>{"use strict";E();I();S();T=class extends w{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(e,t,n,r){this._entryId=e,this._taskId=t,this._objectName=n,this._taskName=r,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let n=[this.hass.connection.sendMessagePromise({...t,action:"view"})];this._taskId&&n.push(this.hass.connection.sendMessagePromise({...t,action:"complete"}));let r=await Promise.all(n);if(e!==this._generateSeq)return;this._viewResult=r[0],r.length>1&&(this._completeResult=r[1])}catch(t){if(e!==this._generateSeq)return;let n=t?.code,r=t?.message;this._error=n==="no_url"||typeof r=="string"&&r.includes("No Home Assistant URL")?i("qr_error_no_url",this.lang):i("qr_error",this.lang)}finally{e===this._generateSeq&&(this._loading=!1)}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,n=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),r=window.open("","_blank","width=600,height=500");if(!r)return;let _=this.lang||"en",d=oe(t),c=oe(n),m=!!this._completeResult,b=oe(i("qr_action_view",_)),h=oe(i("qr_action_complete",_));r.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${d}</title>
<style>
  body{font-family:sans-serif;text-align:center;padding:20px}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  .qr-row{display:flex;justify-content:center;gap:24px;margin:12px 0}
  .qr-col{display:flex;flex-direction:column;align-items:center;gap:6px}
  .qr-col img{width:${m?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${d}</h2>
${c?`<div class="sub">${c}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${Dt(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${b}</div>
  </div>
  ${m?`<div class="qr-col">
    <img src="${Dt(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${h}</div>
  </div>`:""}
</div>
<div class="url">${oe(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),r.document.close()}_downloadSvg(e,t){let n=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),r=new Blob([n],{type:"image/svg+xml"}),_=URL.createObjectURL(r),d=document.createElement("a");d.href=_;let c=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;d.download=`qr-${Ua(c)}-${t}.svg`,d.click(),URL.revokeObjectURL(_)}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return s``;let e=this.lang||this.hass?.language||"en",t=this._taskName?`${i("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${i("qr_code",e)}: ${this._objectName}`,n=!!this._viewResult;return s`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._loading?s`<div class="loading">${i("qr_generating",e)}</div>`:this._error?s`<div class="error">${this._error}</div>`:n?s`
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
                      ${this._completeResult?s`
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
                          `:p}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:p}
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
            .disabled=${!n}
          >
            ${i("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};T.styles=z`
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
  `,l([v({attribute:!1})],T.prototype,"hass",2),l([v()],T.prototype,"lang",2),l([u()],T.prototype,"_open",2),l([u()],T.prototype,"_loading",2),l([u()],T.prototype,"_error",2),l([u()],T.prototype,"_viewResult",2),l([u()],T.prototype,"_completeResult",2),l([u()],T.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",T)});function Mt(o,a){let e=o.interval_analysis,t=e?.weibull_beta,n=e?.weibull_eta;if(t==null||n==null||n<=0)return p;let r=o.interval_days??0,_=o.suggested_interval??r;return s`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${i("weibull_reliability_curve",a)}
        ${Va(t,a)}
      </div>
      ${Ba(t,n,r,_,a)}
      ${Wa(e,a)}
      ${e?.confidence_interval_low!=null?Ga(e,o,a):p}
    </div>
  `}function Va(o,a){let e,t,n;return o<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",n="beta_early_failures"):o<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",n="beta_random_failures"):o<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",n="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",n="beta_highly_predictable"),s`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${i(n,a)} (\u03B2=${o.toFixed(2)})
    </span>
  `}function Ba(o,a,e,t,n){let f=Math.max(e,t,a,1)*1.3,x=50,P=[];for(let C=0;C<=x;C++){let D=C/x*f,ta=1-Math.exp(-Math.pow(D/a,o)),aa=32+D/f*260,na=136-ta*128;P.push([aa,na])}let me=P.map(([C,D])=>`${C.toFixed(1)},${D.toFixed(1)}`).join(" "),qe="M32,136 "+P.map(([C,D])=>`L${C.toFixed(1)},${D.toFixed(1)}`).join(" ")+` L${P[x][0].toFixed(1)},136 Z`,X=32+e/f*260,he=1-Math.exp(-Math.pow(e/a,o)),ve=136-he*128,Xt=((1-he)*100).toFixed(0),Ze=32+t/f*260,ea=[0,.25,.5,.75,1];return s`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${i("chart_weibull",n)}">
        ${ea.map(C=>{let D=136-C*128;return ae`
            <line x1="${32}" y1="${D.toFixed(1)}" x2="${292}" y2="${D.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${C===.5?"4,3":p}" />
            <text x="${28}" y="${(D+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(C*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f)}</text>

        <path d="${qe}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${me}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?ae`
          <line x1="${X.toFixed(1)}" y1="${8}" x2="${X.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${X.toFixed(1)}" cy="${ve.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(X+4).toFixed(1)}" y="${(ve-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Xt}%</text>
        `:p}

        ${t>0&&t!==e?ae`
          <line x1="${Ze.toFixed(1)}" y1="${8}" x2="${Ze.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:p}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${i("weibull_failure_probability",n)}</span>
      ${e>0?s`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${i("current_interval_marker",n)}</span>`:p}
      ${t>0&&t!==e?s`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${i("recommended_marker",n)}</span>`:p}
    </div>
  `}function Wa(o,a){return s`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${i("characteristic_life",a)}</span>
        <span class="weibull-info-value">${Math.round(o.weibull_eta)} ${i("days",a)}</span>
      </div>
      ${o.weibull_r_squared!=null?s`
        <div class="weibull-info-item">
          <span>${i("weibull_r_squared",a)}</span>
          <span class="weibull-info-value">${o.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:p}
    </div>
  `}function Ga(o,a,e){let t=o.confidence_interval_low,n=o.confidence_interval_high,r=a.suggested_interval??a.interval_days??0,_=a.interval_days??0,d=Math.max(0,t-5),m=n+5-d,b=(t-d)/m*100,h=(n-t)/m*100,k=(r-d)/m*100,f=_>0?(_-d)/m*100:-1;return s`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${i("confidence_interval",e)}: ${r} ${i("days",e)} (${t}\u2013${n})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${b.toFixed(1)}%;width:${h.toFixed(1)}%"></div>
        ${f>=0?s`<div class="confidence-marker current" style="left:${f.toFixed(1)}%"></div>`:p}
        <div class="confidence-marker recommended" style="left:${k.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${i("confidence_conservative",e)} (${t}${i("days",e).charAt(0)})</span>
        <span class="confidence-text high">${i("confidence_aggressive",e)} (${n}${i("days",e).charAt(0)})</span>
      </div>
    </div>
  `}var Pt=y(()=>{"use strict";E();S()});function Ft(o,a,e){let t=o.degradation_trend!=null&&o.degradation_trend!=="insufficient_data",n=o.days_until_threshold!=null,r=o.environmental_factor!=null&&o.environmental_factor!==1;if(!t&&!n&&!r)return p;let _=o.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":o.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return s`
    <div class="prediction-section">
      ${o.sensor_prediction_urgency?s`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${i("sensor_prediction_urgency",a).replace("{days}",String(Math.round(o.days_until_threshold||0)))}
        </div>
      `:p}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${i("sensor_prediction",a)}
      </div>
      <div class="prediction-grid">
        ${t?s`
          <div class="prediction-item">
            <ha-svg-icon path="${_}"></ha-svg-icon>
            <span class="prediction-label">${i("degradation_trend",a)}</span>
            <span class="prediction-value ${o.degradation_trend}">${i("trend_"+o.degradation_trend,a)}</span>
            ${o.degradation_rate!=null?s`<span class="prediction-rate">${o.degradation_rate>0?"+":""}${Math.abs(o.degradation_rate)>=10?Math.round(o.degradation_rate).toLocaleString():o.degradation_rate.toFixed(1)} ${o.trigger_entity_info?.unit_of_measurement||""}/${i("day_short",a)}</span>`:p}
          </div>
        `:p}
        ${n?s`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${i("days_until_threshold",a)}</span>
            <span class="prediction-value prediction-days${o.days_until_threshold===0?" exceeded":o.sensor_prediction_urgency?" urgent":""}">${o.days_until_threshold===0?i("threshold_exceeded",a):"~"+Math.round(o.days_until_threshold)+" "+i("days",a)}</span>
            ${o.threshold_prediction_date?s`<span class="prediction-date">${J(o.threshold_prediction_date,a)}</span>`:p}
            ${o.threshold_prediction_confidence?s`<span class="confidence-dot ${o.threshold_prediction_confidence}"></span>`:p}
          </div>
        `:p}
        ${r&&e.environmental?s`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${i("environmental_adjustment",a)}</span>
            <span class="prediction-value">${o.environmental_factor.toFixed(2)}x</span>
            ${o.environmental_entity?s`<span class="prediction-entity entity-link" @click=${d=>qt(d,o.environmental_entity)}>${o.environmental_entity}</span>`:p}
          </div>
        `:p}
      </div>
    </div>
  `}var Lt=y(()=>{"use strict";E();S()});function Ht(o,a,e,t){let n=Math.max(o||1,a);return s`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${i("current",t)}: ${o??"\u2014"} ${o!=null?i("days",t):""}
        </div>
        <div class="interval-visual current"
          style="width: ${o!=null?Math.min(o/n*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${i("recommended",t)}: ${a} ${i("days",t)}
          <span class="confidence-badge ${e}">${i(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(a/n*100,100)}%"></div>
      </div>
    </div>
  `}var Ot=y(()=>{"use strict";E();S()});function Vt(o,a,e){if(!e.seasonal||!o.seasonal_factor||o.seasonal_factor===1)return p;let t=Ut.map(d=>i(d,a)),n=new Date().getMonth(),r=o.seasonal_factors||o.interval_analysis?.seasonal_factors||null,_=r&&r.length===12?r:t.map((d,c)=>{let m=o.seasonal_factor||1,b=Math.sin((c-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,m+b))});return s`
    <div class="seasonal-card-compact">
      <h4>${i("seasonal_awareness",a)}</h4>
      <div class="seasonal-mini-chart">
        ${_.map((d,c)=>{let m=d*40,b=d<.9?"low":d>1.1?"high":"normal";return s`
            <div class="seasonal-bar ${b} ${c===n?"current":""}"
                 style="height: ${m}px"
                 title="${t[c]}: ${d.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${i("shorter",a)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${i("normal",a)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${i("longer",a)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function Bt(o,a){return Ka(o,a)}function Ka(o,a){let e=o.seasonal_factors??o.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return p;let t=o.interval_analysis?.seasonal_reason,n=new Date().getMonth(),r=300,_=100,d=8,m=_-d-4,b=Math.max(...e,1.5),h=r/12,k=h*.65,f=d+m-1/b*m;return s`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${i("seasonal_chart_title",a)}
        ${t?s`<span class="source-tag">${t==="learned"?i("seasonal_learned",a):i("seasonal_manual",a)}</span>`:p}
      </div>
      <svg viewBox="0 0 ${r} ${_}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${i("chart_seasonal",a)}">
        <line x1="0" y1="${f.toFixed(1)}" x2="${r}" y2="${f.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((x,P)=>{let me=x/b*m,qe=P*h+(h-k)/2,X=d+m-me,he=P===n,ve=x<1?"var(--success-color, #4caf50)":x>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return ae`
            <rect x="${qe.toFixed(1)}" y="${X.toFixed(1)}"
              width="${k.toFixed(1)}" height="${me.toFixed(1)}"
              fill="${ve}" opacity="${he?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Ut.map((x,P)=>s`<span class="seasonal-label ${P===n?"active-month":""}">${i(x,a)}</span>`)}
      </div>
    </div>
  `}var Ut,Wt=y(()=>{"use strict";E();S();Ut=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"]});var A,Gt=y(()=>{"use strict";E();I();S();Y();Pt();Lt();Ot();Wt();A=class extends w{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1}get _lang(){return this.hass?.language||"en"}async openFor(e,t){this._entryId=e,this._taskId=t,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=new Date().toISOString().slice(0,10),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});e?.features&&(this._features={...this._features,...e.features}),this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=e.object?.name||"";let t=(e.tasks||[]).find(n=>n.id===this._taskId);this._task=t??null}catch(e){this._error=q(e,this._lang)}}async _runWs(e){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(e),this._busy=!1,!0}catch(t){return this._error=q(t,this._lang),this._busy=!1,!1}}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(R(),O)).then(({openCompleteDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,checklist:this._task.checklist||[],adaptive_enabled:!!this._task.adaptive_config?.enabled})&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||Promise.resolve().then(()=>(R(),O)).then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(R(),O)).then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let e=i("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(e))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=i("suggestion_applied",this._lang)||"Applied",this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=e.recommended_interval?`${i("reanalyze_result",this._lang)||"Recomputed"}: ${e.recommended_interval}d (${e.data_points} pts)`:i("reanalyze_insufficient_data",this._lang)||"Not enough data",await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(e){this._error=q(e,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(e){!this._entryId||!this._taskId||Promise.resolve().then(()=>(R(),O)).then(({openHistoryEditDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,original_timestamp:e.timestamp,type:e.type,timestamp:e.timestamp,notes:e.notes??null,cost:e.cost??null,duration:e.duration??null,completed_by:e.completed_by??null})})}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return p;let t=this._lang;return s`
      <div class="recommendation-card">
        <h4>${i("suggested_interval",t)}</h4>
        ${Ht(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",t)}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${i("apply_suggestion",t)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${i("reanalyze",t)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(e){let t=this._lang,n=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,r=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,_=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,d=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!n&&!r&&!_&&!d?s`<div class="adaptive-empty">
        ${i("adaptive_no_data",t)||"Not enough completion history yet for adaptive analysis."}
      </div>`:s`
      <div class="adaptive-stack">
        ${this._toast?s`<div class="toast">${this._toast}</div>`:p}
        ${n?this._renderRecommendation(e):p}
        ${r?Ft(e,t,this._features):p}
        ${_?Mt(e,t):p}
        ${d?s`
          ${Vt(e,t,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?Bt(e,t):p}
        `:p}
      </div>
    `}_renderDetails(e){let t=this._lang,n=e.history||[],r=n.filter(c=>c.type==="completed"),_=r.reduce((c,m)=>c+(typeof m.cost=="number"?m.cost:0),0),d=(()=>{let c=r.map(m=>typeof m.duration=="number"?m.duration:null).filter(m=>m!=null);return c.length?Math.round(c.reduce((m,b)=>m+b,0)/c.length):null})();return s`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${i("times_performed",t)||"Performed"}</span>
            <span class="stat-value">${r.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${i("total_cost",t)||"Total cost"}</span>
            <span class="stat-value">${_.toFixed(2)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${i("avg_duration",t)||"Avg duration"}</span>
            <span class="stat-value">${d!=null?`${d}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${i("history",t)||"History"}</strong>
          <span class="history-count">${n.length}</span>
        </div>
        ${n.length===0?s`<div class="history-empty">${i("history_empty",t)||"No history yet."}</div>`:s`
              <div class="history-list">
                ${[...n].reverse().slice(0,20).map(c=>{let m=["completed","reset","skipped"].includes(c.type);return s`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${c.type}">${i(c.type,t)}</span>
                        <span class="history-date">${Et(c.timestamp,t)}</span>
                        ${m?s`<button class="history-edit"
                                   title="${i("history_edit_button",t)||"Edit"}"
                                   @click=${()=>this._onEditHistoryEntry(c)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:p}
                      </div>
                      ${c.notes?s`<div class="history-notes">${c.notes}</div>`:p}
                      ${c.cost!=null||c.duration!=null?s`<div class="history-meta">
                            ${c.cost!=null?s`<span>💰 ${c.cost.toFixed(2)}</span>`:p}
                            ${c.duration!=null?s`<span>⏱️ ${c.duration}m</span>`:p}
                          </div>`:p}
                    </div>
                  `})}
                ${n.length>20?s`<div class="history-more">… +${n.length-20} ${i("older_entries",t)||"older"}</div>`:p}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return p;let e=this._lang,t=this._task,n=this.hass?.user?.is_admin??!0;return s`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${t?s`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${ie[t.status]||"#ccc"}"></span>
                  <span class="task-name">${t.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&Promise.resolve().then(()=>(R(),O)).then(({openObjectQuickActions:r})=>{r(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${t.next_due?s`<span><strong>${i("next_due",e)||"Next due"}:</strong> ${J(t.next_due,e)}</span>`:p}
                  ${t.last_performed?s`<span><strong>${i("last_performed",e)||"Last"}:</strong> ${J(t.last_performed,e)}</span>`:p}
                  ${t.schedule?.kind&&!["manual","one_time"].includes(t.schedule.kind)||t.interval_days!=null?s`<span><strong>${i("interval",e)||"Interval"}:</strong> ${St(t,e)}</span>`:p}
                </div>
              </div>

              ${this._error?s`<div class="error">${this._error}</div>`:p}

              ${this._showSkip?s`
                    <div class="inline-form">
                      <label>${i("skip_reason",e)||"Skip reason (optional)"}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${r=>{this._skipReason=r.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${i("cancel",e)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${i("skip",e)||"Skip"}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?s`
                    <div class="inline-form">
                      <label>${i("reset_to_date",e)||"Reset last_performed to"}</label>
                      <input type="date" .value=${this._resetDate}
                        @input=${r=>{this._resetDate=r.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${i("cancel",e)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${i("reset",e)||"Reset"}
                        </button>
                      </div>
                    </div>
                  `:s`
                    <div class="actions primary-row">
                      <button class="btn primary" @click=${this._onComplete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:check"></ha-icon>
                        ${i("complete",e)||"Complete"}
                      </button>
                      <button class="btn" @click=${()=>{this._showSkip=!0}} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:skip-next"></ha-icon>
                        ${i("skip",e)||"Skip"}
                      </button>
                      <button class="btn" @click=${()=>{this._showReset=!0}} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:restart"></ha-icon>
                        ${i("reset",e)||"Reset"}
                      </button>
                    </div>
                    ${n?s`
                          <div class="actions secondary-row">
                            <button class="btn ghost" @click=${this._onEdit} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                              ${i("edit",e)||"Edit"}
                            </button>
                            <button class="btn ghost" @click=${this._onQr} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:qrcode"></ha-icon>
                              ${i("qr_code",e)||"QR"}
                            </button>
                            <button class="btn ghost danger" @click=${this._onDelete} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:delete"></ha-icon>
                              ${i("delete",e)||"Delete"}
                            </button>
                          </div>
                        `:p}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?i("hide_details",e)||"Hide details":i("show_details",e)||"Show history + stats"}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?s`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?i("hide_stats",e)||"Hide stats":i("show_stats",e)||"Show stats + graphs"}
                          </button>`:p}
                    </div>
                    ${this._showDetails?this._renderDetails(t):p}
                    ${this._showAdaptive?this._renderAdaptive(t):p}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${i("open_in_panel",e)||"Open in Maintenance panel"}
                      </button>
                    </div>
                  `}
            `:s`<div class="loading">${i("loading",e)||"Loading\u2026"}</div>`}
      </div>
    `}};A.styles=[$e,z`
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
    /* Edit + QR are admin-tools — left-align as a group; Delete is destructive
       so it gets pushed to the far right with margin-left:auto for visual
       separation. Earlier this row was flex-end which left a strange empty
       gap on the left (user feedback). */
    .actions.secondary-row {
      padding-top: 8px; border-top: 1px solid var(--divider-color);
      justify-content: flex-start;
    }
    .actions.secondary-row .btn.danger {
      margin-left: auto;
    }
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
  `],l([v({attribute:!1})],A.prototype,"hass",2),l([u()],A.prototype,"_open",2),l([u()],A.prototype,"_entryId",2),l([u()],A.prototype,"_taskId",2),l([u()],A.prototype,"_task",2),l([u()],A.prototype,"_objectName",2),l([u()],A.prototype,"_busy",2),l([u()],A.prototype,"_error",2),l([u()],A.prototype,"_showSkip",2),l([u()],A.prototype,"_showReset",2),l([u()],A.prototype,"_showDetails",2),l([u()],A.prototype,"_showAdaptive",2),l([u()],A.prototype,"_skipReason",2),l([u()],A.prototype,"_resetDate",2),l([u()],A.prototype,"_features",2),l([u()],A.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",A)});var M,Kt=y(()=>{"use strict";E();I();S();Y();M=class extends w{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return this.hass?.language||"en"}async openFor(e){this._entryId=e,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=e}catch(e){this._error=q(e,this._lang)}}_onEditObject(){!this._entryId||!this._data||Promise.resolve().then(()=>(R(),O)).then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&Promise.resolve().then(()=>(R(),O)).then(({openCreateTaskDialog:e})=>{e(),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let e=i("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(e)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=q(t,this._lang)}finally{this._busy=!1}}}_onTaskClick(e){this._entryId&&Promise.resolve().then(()=>(R(),O)).then(({openTaskQuickActions:t})=>{t(this._entryId,e)})}render(){if(!this._open)return p;let e=this._lang,t=this._data,n=t?.object,r=t?.tasks||[],_=this.hass?.user?.is_admin??!0;return s`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${t&&n?s`
              <div class="header">
                <div class="title">${n.name}</div>
                ${this._renderMetaRow(n)}
              </div>

              ${this._error?s`<div class="error">${this._error}</div>`:p}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${i("tasks",e)||"Tasks"}</strong>
                  <span class="count">${r.length}</span>
                </div>
                ${r.length===0?s`<div class="empty">${i("no_tasks",e)||"No tasks yet."}</div>`:s`
                      <div class="task-list">
                        ${r.map(d=>s`
                          <div class="task-row" @click=${()=>this._onTaskClick(d.id)}>
                            <span class="status-dot" style="background: ${ie[d.status]||"#ccc"}"></span>
                            <span class="task-name">${d.name}</span>
                            <span class="task-status">${i(d.status||"ok",e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${n.notes?s`
                    <div class="notes-section">
                      <strong>${i("notes",e)||"Notes"}</strong>
                      <div class="notes-body">${n.notes}</div>
                    </div>
                  `:p}

              ${_?s`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${i("add_task",e)||"Add task"}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${i("edit",e)||"Edit"}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${i("delete",e)||"Delete"}
                      </button>
                    </div>
                  `:p}
            `:s`<div class="loading">${i("loading",e)||"Loading\u2026"}</div>`}
      </div>
    `}_renderMetaRow(e){let t=this._lang,n=[];return e.area_id&&n.push([i("area",t)||"Area",e.area_id]),e.manufacturer&&n.push([i("manufacturer",t)||"Manufacturer",e.manufacturer]),e.model&&n.push([i("model",t)||"Model",e.model]),e.serial_number&&n.push([i("serial_number",t)||"Serial",e.serial_number]),e.installation_date&&n.push([i("installation_date",t)||"Installed",e.installation_date]),e.documentation_url&&n.push([i("documentation_url",t)||"Docs",e.documentation_url]),n.length===0?p:s`
      <div class="meta">
        ${n.map(([r,_])=>s`
            <div class="meta-item">
              <span class="meta-label">${r}</span>
              <span class="meta-value">${r.toLowerCase().includes("doc")||r.toLowerCase().includes("url")?s`<a href="${_}" target="_blank" rel="noopener">${_}</a>`:_}</span>
            </div>
          `)}
      </div>
    `}};M.styles=z`
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
  `,l([v({attribute:!1})],M.prototype,"hass",2),l([u()],M.prototype,"_open",2),l([u()],M.prototype,"_entryId",2),l([u()],M.prototype,"_data",2),l([u()],M.prototype,"_busy",2),l([u()],M.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",M)});var O={};oa(O,{openCompleteDialog:()=>nn,openCreateObjectDialog:()=>Ge,openCreateTaskDialog:()=>Ke,openEditObjectDialog:()=>en,openEditTaskDialog:()=>tn,openHistoryEditDialog:()=>an,openObjectQuickActions:()=>rn,openQrDialog:()=>on,openTaskQuickActions:()=>Qe});function Se(){return document.querySelector("home-assistant")?.hass}function U(o){let a=document.body.querySelector(o);return a||(a=document.createElement(o),document.body.appendChild(a)),a}function V(o){let a=Se();return a?(o.hass=a,!0):!1}function Yt(o){return Ee||(Ee=o.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(a=>({features:a.features??Qt.features,defaultWarningDays:a.general?.default_warning_days??7})).catch(()=>Qt),Ee)}function Ge(){let o=U(Zt);return V(o)?(o.openCreate(),!0):!1}function en(o,a){let e=U(Zt);return V(e)?(e.openEdit(o,a),!0):!1}function Ke(){let o=U(Jt);if(!V(o))return!1;let a=Se();return a?((async()=>{let e=await Yt(a),t=o;t.checklistsEnabled=e.features.checklists,t.scheduleTimeEnabled=e.features.schedule_time,t.completionActionsEnabled=e.features.completion_actions,t.defaultWarningDays=e.defaultWarningDays,t.openCreate()})(),!0):!1}function tn(o,a){let e=U(Jt);if(!V(e))return!1;let t=Se();return t?((async()=>{try{let[n,r]=await Promise.all([t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:o}),Yt(t)]),_=(n.tasks||[]).find(c=>c.id===a);if(!_){console.warn(`openEditTaskDialog: task ${a} not found in entry ${o}`);return}let d=e;d.checklistsEnabled=r.features.checklists,d.scheduleTimeEnabled=r.features.schedule_time,d.completionActionsEnabled=r.features.completion_actions,d.defaultWarningDays=r.defaultWarningDays,await d.openEdit(o,_)}catch(n){console.warn("openEditTaskDialog: failed to load task/features",n)}})(),!0):!1}function an(o){let a=U(Qa);return V(a)?(a.openEdit(o),!0):!1}function nn(o){let a=U(Za);return V(a)?(a.entryId=o.entry_id,a.taskId=o.task_id,a.taskName=o.task_name,a.checklist=o.checklist??[],a.adaptiveEnabled=!!o.adaptive_enabled,a.lang=Se()?.language||"en",a.open(),!0):!1}function on(o){let a=U(Ja);return V(a)?(a.openForTask(o.entry_id,o.task_id,o.object_name,o.task_name),!0):!1}function Qe(o,a){let e=U(Ya);return V(e)?(e.openFor(o,a),!0):!1}function rn(o){let a=U(Xa);return V(a)?(a.openFor(o),!0):!1}var Zt,Jt,Qa,Za,Ja,Ya,Xa,Qt,Ee,R=y(()=>{"use strict";Nt();Ct();Be();It();Rt();Gt();Kt();Zt="maintenance-object-dialog",Jt="maintenance-task-dialog",Qa="maintenance-history-edit-dialog",Za="maintenance-complete-dialog",Ja="maintenance-qr-dialog",Ya="maintenance-task-quick-actions-dialog",Xa="maintenance-object-quick-actions-dialog";Qt={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7},Ee=null});E();I();S();E();I();S();var Ia=["overdue","triggered","due_soon","ok"],L=class extends w{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._loadingObjects=!0;this._loadError=!1;this._objectsLoaded=!1;this._onEntitiesChanged=e=>{this._valueChanged("entity_ids",e.detail.value||[])}}get _lang(){return this.hass?.language||"en"}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._objectsLoaded&&(this._objectsLoaded=!0,this._loadObjects())}async _loadObjects(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=e.objects||[],this._loadError=!1}catch{this._objects=[],this._loadError=!0}this._loadingObjects=!1}_valueChanged(e,t){let n={...this._config,[e]:t};Array.isArray(t)&&t.length===0&&delete n[e],this._config=n,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n}}))}_toggleStatus(e,t){let n=new Set(this._config.filter_status||[]);t?n.add(e):n.delete(e),this._valueChanged("filter_status",[...n])}_toggleObject(e,t){let n=new Set(this._config.filter_objects||[]);t?n.add(e):n.delete(e),this._valueChanged("filter_objects",[...n])}render(){let e=this._lang,t=new Set(this._config.filter_status||[]),n=new Set(this._config.filter_objects||[]),r=[...this._objects].map(d=>d.object.name).sort((d,c)=>d.localeCompare(c)),_=[];for(let d of this._objects)for(let c of d.tasks)c.sensor_entity_id&&_.push(c.sensor_entity_id),c.binary_sensor_entity_id&&_.push(c.binary_sensor_entity_id);return s`
      <div class="editor">
        <ha-textfield
          label="${i("card_title",e)}"
          .value=${this._config.title||""}
          @input=${d=>this._valueChanged("title",d.target.value)}
        ></ha-textfield>

        <!-- Status filter (chip row) -->
        <div class="field">
          <div class="field-label">${i("card_filter_status",e)}</div>
          <div class="chip-row">
            ${Ia.map(d=>s`
              <label class="chip ${t.has(d)?"active":""}">
                <input type="checkbox"
                  .checked=${t.has(d)}
                  @change=${c=>this._toggleStatus(d,c.target.checked)} />
                ${i(d,e)}
              </label>
            `)}
          </div>
          <div class="field-help">${i("card_filter_status_help",e)}</div>
        </div>

        <!-- Object filter (multi-checkbox) -->
        <div class="field">
          <div class="field-label">${i("card_filter_objects",e)}</div>
          ${this._loadingObjects?s`<div class="field-help">${i("card_loading_objects",e)}</div>`:this._loadError?s`<div class="field-help error-text">${i("card_load_error",e)}</div>`:r.length===0?s`<div class="field-help">${i("no_objects",e)}</div>`:s`
                <div class="object-list">
                  ${r.map(d=>s`
                    <label class="object-row">
                      <input type="checkbox"
                        .checked=${n.has(d)}
                        @change=${c=>this._toggleObject(d,c.target.checked)} />
                      <span>${d}</span>
                    </label>
                  `)}
                </div>
                <div class="field-help">${i("card_filter_objects_help",e)}</div>
              `}
        </div>

        <!-- Entity-id filter (HA-native pattern). Limited to our integration's
             sensor + binary_sensor entities via includeEntities so the picker
             stays usable on installs with thousands of entities. -->
        <div class="field">
          <div class="field-label">${i("card_filter_entities",e)}</div>
          <ha-entities-picker
            .hass=${this.hass}
            .value=${this._config.entity_ids||[]}
            .includeDomains=${["sensor","binary_sensor"]}
            .includeEntities=${_}
            @value-changed=${this._onEntitiesChanged}
          ></ha-entities-picker>
          <div class="field-help">${i("card_filter_entities_help",e)}</div>
        </div>

        <ha-formfield label="${i("card_show_header",e)}">
          <ha-switch
            .checked=${this._config.show_header!==!1}
            @change=${d=>this._valueChanged("show_header",d.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${i("card_show_actions",e)}">
          <ha-switch
            .checked=${this._config.show_actions!==!1}
            @change=${d=>this._valueChanged("show_actions",d.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${i("card_compact",e)}">
          <ha-switch
            .checked=${this._config.compact||!1}
            @change=${d=>this._valueChanged("compact",d.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-textfield
          label="${i("card_max_items",e)}"
          type="number"
          .value=${String(this._config.max_items||0)}
          @input=${d=>this._valueChanged("max_items",parseInt(d.target.value,10)||0)}
        ></ha-textfield>
        ${p}
      </div>
    `}};L.styles=z`
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
    .field-help.error-text {
      color: var(--error-color, #f44336);
      font-style: normal;
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
  `,l([v({attribute:!1})],L.prototype,"hass",2),l([u()],L.prototype,"_config",2),l([u()],L.prototype,"_objects",2),l([u()],L.prototype,"_loadingObjects",2),l([u()],L.prototype,"_loadError",2);customElements.get("maintenance-supporter-card-editor")||customElements.define("maintenance-supporter-card-editor",L);Be();R();var B=class extends w{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._stats=null;this._unsub=null;this._dataLoaded=!1;this._lastConnection=null;this._onCompleted=async()=>{await this._loadData()}}get _lang(){return this.hass?.language||"en"}static getConfigElement(){return document.createElement("maintenance-supporter-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-card",show_header:!0,show_actions:!0,filter_status:["overdue","triggered","due_soon"],max_items:10}}setConfig(e){this._config=e}getCardSize(){return 3}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null}updated(e){if(super.updated(e),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=e.objects,this._stats=t}catch{}}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(e=>{let t=e;this._objects=t.objects},{type:"maintenance_supporter/subscribe"})}catch{}}get _flatTasks(){let e=[],{filter_status:t,filter_objects:n,entity_ids:r,filter_due_min_days:_,filter_due_max_days:d,max_items:c}=this._config,m=r?.length?new Set(r):null,b=_!==void 0||d!==void 0;for(let k of this._objects)if(!(n?.length&&!n.includes(k.object.name))){for(let f of k.tasks)if(!f.is_done&&!(t?.length&&!t.includes(f.status))&&!(m&&!(f.sensor_entity_id&&m.has(f.sensor_entity_id)||f.binary_sensor_entity_id&&m.has(f.binary_sensor_entity_id)))){if(b){let x=f.days_until_due;if(x==null||_!==void 0&&x<_||d!==void 0&&x>d)continue}e.push({entry_id:k.entry_id,object_name:k.object.name,task:f})}}let h={overdue:0,triggered:1,due_soon:2,ok:3};return e.sort((k,f)=>{let x=(h[k.task.status]??9)-(h[f.task.status]??9);return x!==0?x:(k.task.days_until_due??1/0)-(f.task.days_until_due??1/0)}),c&&c>0?e.slice(0,c):e}_openTaskDetail(e,t){Qe(e,t)}render(){let e=this._lang,t=this._config.title||i("maintenance",e),n=this._config.show_header!==!1,r=this._config.show_actions!==!1,_=this._config.compact||!1,d=this._flatTasks,c=this._stats;return s`
      <ha-card>
        <div class="card-header">
          <h1>${t}</h1>
          <div class="header-right">
            ${n&&c?s`
                  <div class="header-stats">
                    ${c.overdue>0?s`<span class="badge overdue">${c.overdue}</span>`:p}
                    ${c.due_soon>0?s`<span class="badge due_soon">${c.due_soon}</span>`:p}
                    ${c.triggered>0?s`<span class="badge triggered">${c.triggered}</span>`:p}
                  </div>
                `:p}
            ${r?s`
                  <mwc-icon-button
                    class="hdr-add"
                    title="${i("new_object",e)}"
                    @click=${()=>Ge()}
                  >
                    <ha-icon icon="mdi:plus-box"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button
                    class="hdr-add"
                    title="${i("add_task",e)}"
                    @click=${()=>Ke()}
                  >
                    <ha-icon icon="mdi:playlist-plus"></ha-icon>
                  </mwc-icon-button>
                `:p}
          </div>
        </div>
        ${d.length===0?s`<div class="empty-card">
              <div>${i("card_no_tasks_title",e)}</div>
              <a class="empty-link" href="/maintenance-supporter">${i("card_no_tasks_cta",e)}</a>
            </div>`:s`
              <div class="task-list ${_?"compact":""}">
                ${d.map(({entry_id:m,object_name:b,task:h})=>s`
                    <div class="task-item clickable"
                         @click=${()=>this._openTaskDetail(m,h.id)}
                         title="${i("open_task",e)||"Open task"}">
                      <div class="status-dot" style="background: ${ie[h.status]||"#ccc"}"></div>
                      <div class="task-info">
                        <div class="task-name">${h.name}</div>
                        ${_?p:s`<div class="task-meta">${b} · ${i(h.type,e)}</div>`}
                      </div>
                      <div class="task-due">
                        ${h.days_until_due!==null&&h.days_until_due!==void 0?h.days_until_due<0?s`<span class="overdue-text">${Math.abs(h.days_until_due)}${e.startsWith("de")?"T":"d"}</span>`:h.days_until_due===0?i("today",e):`${h.days_until_due}${e.startsWith("de")?"T":"d"}`:h.trigger_active?"\u26A1":"\u2014"}
                      </div>
                      ${r?s`
                            <mwc-icon-button
                              class="complete-btn"
                              title="${i("complete",e)}"
                              @click=${k=>{k.stopPropagation();let f=this.shadowRoot.querySelector("maintenance-complete-dialog");f.entryId=m,f.taskId=h.id,f.taskName=h.name,f.checklist=h.checklist||[],f.adaptiveEnabled=!!h.adaptive_config?.enabled,f.lang=e,f.open()}}
                            >
                              <ha-icon icon="mdi:check"></ha-icon>
                            </mwc-icon-button>
                          `:p}
                    </div>
                  `)}
              </div>
            `}
      </ha-card>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onCompleted}
      ></maintenance-complete-dialog>
    `}};B.styles=[$e,z`
      ha-card { overflow: hidden; }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 16px 8px;
      }

      .card-header h1 { margin: 0; font-size: 18px; font-weight: 500; }
      .header-right { display: flex; align-items: center; gap: 6px; }
      .header-stats { display: flex; gap: 6px; }
      .hdr-add {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 20px;
        color: var(--primary-color);
      }

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

      .empty-card {
        padding: 24px 16px;
        text-align: center;
        color: var(--secondary-text-color);
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
      }
      .empty-link {
        color: var(--primary-color);
        text-decoration: none;
        font-size: 13px;
      }
      .empty-link:hover { text-decoration: underline; }
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
      /* Row click opens the task editor (in-place via the strategy bundle's
         ll-custom handler). Hover state hints that the row is interactive. */
      .task-item.clickable { cursor: pointer; transition: background 0.12s; }
      .task-item.clickable:hover {
        background: var(--state-icon-color, rgba(255,255,255,0.04));
      }

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
    `],l([v({attribute:!1})],B.prototype,"hass",2),l([u()],B.prototype,"_config",2),l([u()],B.prototype,"_objects",2),l([u()],B.prototype,"_stats",2),l([u()],B.prototype,"_unsub",2);customElements.get("maintenance-supporter-card")||customElements.define("maintenance-supporter-card",B);window.customCards=window.customCards||[];window.customCards.push({type:"maintenance-supporter-card",name:"Maintenance Supporter",description:"Overview of your maintenance tasks with quick actions.",preview:!0});export{B as MaintenanceSupporterCard};
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
