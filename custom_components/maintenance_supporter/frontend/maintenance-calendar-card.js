/*! maintenance_supporter frontend 2.119.0 */
var U0=Object.defineProperty;var W6=Object.getOwnPropertyDescriptor;var u=(C,r,e)=>()=>{if(e)throw e[0];try{return C&&(r=C(C=0)),r}catch(t){throw e=[t],t}};var U6=(C,r)=>{for(var e in r)U0(C,e,{get:r[e],enumerable:!0})};var s=(C,r,e,t)=>{for(var H=t>1?void 0:t?W6(r,e):r,i=C.length-1,L;i>=0;i--)(L=C[i])&&(H=(t?L(r,e,H):L(H))||H);return t&&H&&U0(r,e,H),H};var d5,p5,x3,z0,B2,G0,g,Q0,_3,g3=u(()=>{d5=globalThis,p5=d5.ShadowRoot&&(d5.ShadyCSS===void 0||d5.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,x3=Symbol(),z0=new WeakMap,B2=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==x3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(p5&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=z0.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&z0.set(e,r))}return r}toString(){return this.cssText}},G0=C=>new B2(typeof C=="string"?C:C+"",void 0,x3),g=(C,...r)=>{let e=C.length===1?C[0]:r.reduce((t,H,i)=>t+(L=>{if(L._$cssResult$===!0)return L.cssText;if(typeof L=="number")return L;throw Error("Value passed to 'css' function must be a 'css' function result: "+L+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(H)+C[i+1],C[0]);return new B2(e,C,x3)},Q0=(C,r)=>{if(p5)C.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),H=d5.litNonce;H!==void 0&&t.setAttribute("nonce",H),t.textContent=e.cssText,C.appendChild(t)}},_3=p5?C=>C:C=>C instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return G0(e)})(C):C});var z6,G6,Q6,K6,Y6,X6,c5,K0,J6,e8,F2,I2,m5,Y0,A1,D2=u(()=>{g3();g3();({is:z6,defineProperty:G6,getOwnPropertyDescriptor:Q6,getOwnPropertyNames:K6,getOwnPropertySymbols:Y6,getPrototypeOf:X6}=Object),c5=globalThis,K0=c5.trustedTypes,J6=K0?K0.emptyScript:"",e8=c5.reactiveElementPolyfillSupport,F2=(C,r)=>C,I2={toAttribute(C,r){switch(r){case Boolean:C=C?J6:null;break;case Object:case Array:C=C==null?C:JSON.stringify(C)}return C},fromAttribute(C,r){let e=C;switch(r){case Boolean:e=C!==null;break;case Number:e=C===null?null:Number(C);break;case Object:case Array:try{e=JSON.parse(C)}catch{e=null}}return e}},m5=(C,r)=>!z6(C,r),Y0={attribute:!0,type:String,converter:I2,reflect:!1,useDefault:!1,hasChanged:m5};Symbol.metadata??=Symbol("metadata"),c5.litPropertyMetadata??=new WeakMap;A1=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=Y0){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),H=this.getPropertyDescriptor(r,t,e);H!==void 0&&G6(this.prototype,r,H)}}static getPropertyDescriptor(r,e,t){let{get:H,set:i}=Q6(this.prototype,r)??{get(){return this[e]},set(L){this[e]=L}};return{get:H,set(L){let a=H?.call(this);i?.call(this,L),this.requestUpdate(r,a,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??Y0}static _$Ei(){if(this.hasOwnProperty(F2("elementProperties")))return;let r=X6(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(F2("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(F2("properties"))){let e=this.properties,t=[...K6(e),...Y6(e)];for(let H of t)this.createProperty(H,e[H])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,H]of e)this.elementProperties.set(t,H)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let H=this._$Eu(e,t);H!==void 0&&this._$Eh.set(H,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let H of t)e.unshift(_3(H))}else r!==void 0&&e.push(_3(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Q0(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),H=this.constructor._$Eu(r,t);if(H!==void 0&&t.reflect===!0){let i=(t.converter?.toAttribute!==void 0?t.converter:I2).toAttribute(e,t.type);this._$Em=r,i==null?this.removeAttribute(H):this.setAttribute(H,i),this._$Em=null}}_$AK(r,e){let t=this.constructor,H=t._$Eh.get(r);if(H!==void 0&&this._$Em!==H){let i=t.getPropertyOptions(H),L=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:I2;this._$Em=H;let a=L.fromAttribute(e,i.type);this[H]=a??this._$Ej?.get(H)??a,this._$Em=null}}requestUpdate(r,e,t,H=!1,i){if(r!==void 0){let L=this.constructor;if(H===!1&&(i=this[r]),t??=L.getPropertyOptions(r),!((t.hasChanged??m5)(i,e)||t.useDefault&&t.reflect&&i===this._$Ej?.get(r)&&!this.hasAttribute(L._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:H,wrapped:i},L){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,L??e??this[r]),i!==!0||L!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),H===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[H,i]of this._$Ep)this[H]=i;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[H,i]of t){let{wrapped:L}=i,a=this[H];L!==!0||this._$AL.has(H)||a===void 0||this.C(H,void 0,i,a)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};A1.elementStyles=[],A1.shadowRootOptions={mode:"open"},A1[F2("elementProperties")]=new Map,A1[F2("finalized")]=new Map,e8?.({ReactiveElement:A1}),(c5.reactiveElementVersions??=[]).push("2.1.2")});function L7(C,r){if(!b3(C)||!C.hasOwnProperty("raw"))throw Error("invalid template strings array");return J0!==void 0?J0.createHTML(r):r}function X1(C,r,e=C,t){if(r===H1)return r;let H=t!==void 0?e._$Co?.[t]:e._$Cl,i=q2(r)?void 0:r._$litDirective$;return H?.constructor!==i&&(H?._$AO?.(!1),i===void 0?H=void 0:(H=new i(C),H._$AT(C,e,t)),t!==void 0?(e._$Co??=[])[t]=H:e._$Cl=H),H!==void 0&&(r=X1(C,H._$AS(C,r.values),H,t)),r}var Z3,X0,A5,J0,S3,u1,y3,t8,Y1,j2,q2,b3,V7,f3,N2,e7,t7,Q1,C7,r7,i7,k3,o,d2,Ft,H1,M,H7,K1,o7,W2,u5,l2,J1,v5,h5,x5,_5,a7,C8,n7,e2=u(()=>{Z3=globalThis,X0=C=>C,A5=Z3.trustedTypes,J0=A5?A5.createPolicy("lit-html",{createHTML:C=>C}):void 0,S3="$lit$",u1=`lit$${Math.random().toFixed(9).slice(2)}$`,y3="?"+u1,t8=`<${y3}>`,Y1=document,j2=()=>Y1.createComment(""),q2=C=>C===null||typeof C!="object"&&typeof C!="function",b3=Array.isArray,V7=C=>b3(C)||typeof C?.[Symbol.iterator]=="function",f3=`[ 	
\f\r]`,N2=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,e7=/-->/g,t7=/>/g,Q1=RegExp(`>|${f3}(?:([^\\s"'>=/]+)(${f3}*=${f3}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),C7=/'/g,r7=/"/g,i7=/^(?:script|style|textarea|title)$/i,k3=C=>(r,...e)=>({_$litType$:C,strings:r,values:e}),o=k3(1),d2=k3(2),Ft=k3(3),H1=Symbol.for("lit-noChange"),M=Symbol.for("lit-nothing"),H7=new WeakMap,K1=Y1.createTreeWalker(Y1,129);o7=(C,r)=>{let e=C.length-1,t=[],H,i=r===2?"<svg>":r===3?"<math>":"",L=N2;for(let a=0;a<e;a++){let n=C[a],d,p,c=-1,A=0;for(;A<n.length&&(L.lastIndex=A,p=L.exec(n),p!==null);)A=L.lastIndex,L===N2?p[1]==="!--"?L=e7:p[1]!==void 0?L=t7:p[2]!==void 0?(i7.test(p[2])&&(H=RegExp("</"+p[2],"g")),L=Q1):p[3]!==void 0&&(L=Q1):L===Q1?p[0]===">"?(L=H??N2,c=-1):p[1]===void 0?c=-2:(c=L.lastIndex-p[2].length,d=p[1],L=p[3]===void 0?Q1:p[3]==='"'?r7:C7):L===r7||L===C7?L=Q1:L===e7||L===t7?L=N2:(L=Q1,H=void 0);let x=L===Q1&&C[a+1].startsWith("/>")?" ":"";i+=L===N2?n+t8:c>=0?(t.push(d),n.slice(0,c)+S3+n.slice(c)+u1+x):n+u1+(c===-2?a:x)}return[L7(C,i+(C[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},W2=class C{constructor({strings:r,_$litType$:e},t){let H;this.parts=[];let i=0,L=0,a=r.length-1,n=this.parts,[d,p]=o7(r,e);if(this.el=C.createElement(d,t),K1.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(H=K1.nextNode())!==null&&n.length<a;){if(H.nodeType===1){if(H.hasAttributes())for(let c of H.getAttributeNames())if(c.endsWith(S3)){let A=p[L++],x=H.getAttribute(c).split(u1),_=/([.?@])?(.*)/.exec(A);n.push({type:1,index:i,name:_[2],strings:x,ctor:_[1]==="."?v5:_[1]==="?"?h5:_[1]==="@"?x5:J1}),H.removeAttribute(c)}else c.startsWith(u1)&&(n.push({type:6,index:i}),H.removeAttribute(c));if(i7.test(H.tagName)){let c=H.textContent.split(u1),A=c.length-1;if(A>0){H.textContent=A5?A5.emptyScript:"";for(let x=0;x<A;x++)H.append(c[x],j2()),K1.nextNode(),n.push({type:2,index:++i});H.append(c[A],j2())}}}else if(H.nodeType===8)if(H.data===y3)n.push({type:2,index:i});else{let c=-1;for(;(c=H.data.indexOf(u1,c+1))!==-1;)n.push({type:7,index:i}),c+=u1.length-1}i++}}static createElement(r,e){let t=Y1.createElement("template");return t.innerHTML=r,t}};u5=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,H=(r?.creationScope??Y1).importNode(e,!0);K1.currentNode=H;let i=K1.nextNode(),L=0,a=0,n=t[0];for(;n!==void 0;){if(L===n.index){let d;n.type===2?d=new l2(i,i.nextSibling,this,r):n.type===1?d=new n.ctor(i,n.name,n.strings,this,r):n.type===6&&(d=new _5(i,this,r)),this._$AV.push(d),n=t[++a]}L!==n?.index&&(i=K1.nextNode(),L++)}return K1.currentNode=Y1,H}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},l2=class C{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,H){this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=H,this._$Cv=H?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=X1(this,r,e),q2(r)?r===M||r==null||r===""?(this._$AH!==M&&this._$AR(),this._$AH=M):r!==this._$AH&&r!==H1&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):V7(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==M&&q2(this._$AH)?this._$AA.nextSibling.data=r:this.T(Y1.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,H=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=W2.createElement(L7(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===H)this._$AH.p(e);else{let i=new u5(H,this),L=i.u(this.options);i.p(e),this.T(L),this._$AH=i}}_$AC(r){let e=H7.get(r.strings);return e===void 0&&H7.set(r.strings,e=new W2(r)),e}k(r){b3(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,H=0;for(let i of r)H===e.length?e.push(t=new C(this.O(j2()),this.O(j2()),this,this.options)):t=e[H],t._$AI(i),H++;H<e.length&&(this._$AR(t&&t._$AB.nextSibling,H),e.length=H)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=X0(r).nextSibling;X0(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},J1=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,H,i){this.type=1,this._$AH=M,this._$AN=void 0,this.element=r,this.name=e,this._$AM=H,this.options=i,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=M}_$AI(r,e=this,t,H){let i=this.strings,L=!1;if(i===void 0)r=X1(this,r,e,0),L=!q2(r)||r!==this._$AH&&r!==H1,L&&(this._$AH=r);else{let a=r,n,d;for(r=i[0],n=0;n<i.length-1;n++)d=X1(this,a[t+n],e,n),d===H1&&(d=this._$AH[n]),L||=!q2(d)||d!==this._$AH[n],d===M?r=M:r!==M&&(r+=(d??"")+i[n+1]),this._$AH[n]=d}L&&!H&&this.j(r)}j(r){r===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},v5=class extends J1{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===M?void 0:r}},h5=class extends J1{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==M)}},x5=class extends J1{constructor(r,e,t,H,i){super(r,e,t,H,i),this.type=5}_$AI(r,e=this){if((r=X1(this,r,e,0)??M)===H1)return;let t=this._$AH,H=r===M&&t!==M||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,i=r!==M&&(t===M||H);H&&this.element.removeEventListener(this.name,this,t),i&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},_5=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){X1(this,r)}},a7={M:S3,P:u1,A:y3,C:1,L:o7,R:u5,D:V7,V:X1,I:l2,H:J1,N:h5,U:x5,B:v5,F:_5},C8=Z3.litHtmlPolyfillSupport;C8?.(W2,l2),(Z3.litHtmlVersions??=[]).push("3.3.3");n7=(C,r,e)=>{let t=e?.renderBefore??r,H=t._$litPart$;if(H===void 0){let i=e?.renderBefore??null;t._$litPart$=H=new l2(r.insertBefore(j2(),i),i,void 0,e??{})}return H._$AI(C),H}});var w3,S,r8,s7=u(()=>{D2();D2();e2();e2();w3=globalThis,S=class extends A1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=n7(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return H1}};S._$litElement$=!0,S.finalized=!0,w3.litElementHydrateSupport?.({LitElement:S});r8=w3.litElementPolyfillSupport;r8?.({LitElement:S});(w3.litElementVersions??=[]).push("4.2.2")});var M7=u(()=>{});var y=u(()=>{D2();e2();s7();M7()});var l7=u(()=>{});function v(C){return(r,e)=>typeof e=="object"?V8(C,r,e):((t,H,i)=>{let L=H.hasOwnProperty(i);return H.constructor.createProperty(i,t),L?Object.getOwnPropertyDescriptor(H,i):void 0})(C,r,e)}var H8,V8,O3=u(()=>{D2();H8={attribute:!0,type:String,converter:I2,reflect:!1,hasChanged:m5},V8=(C=H8,r,e)=>{let{kind:t,metadata:H}=e,i=globalThis.litPropertyMetadata.get(H);if(i===void 0&&globalThis.litPropertyMetadata.set(H,i=new Map),t==="setter"&&((C=Object.create(C)).wrapped=!0),i.set(e.name,C),t==="accessor"){let{name:L}=e;return{set(a){let n=r.get.call(this);r.set.call(this,a),this.requestUpdate(L,n,C,!0,a)},init(a){return a!==void 0&&this.C(L,void 0,C,a),a}}}if(t==="setter"){let{name:L}=e;return function(a){let n=this[L];r.call(this,a),this.requestUpdate(L,n,C,!0,a)}}throw Error("Unsupported decorator location: "+t)}});function l(C){return v({...C,state:!0,attribute:!1})}var d7=u(()=>{O3();});var p7=u(()=>{});var p2=u(()=>{});var c7=u(()=>{p2();});var m7=u(()=>{p2();});var A7=u(()=>{p2();});var u7=u(()=>{p2();});var v7=u(()=>{p2();});var q=u(()=>{l7();O3();d7();p7();c7();m7();A7();u7();v7()});function h7(C){return C==="use"?"use":"purchase"}function Z5(C,r,e=!1){if(e)return"purchase";let t=C?.cost_mode;return t==="use"||t==="purchase"?t:r}function x7(C){let r=f5(C?.cost);if(r===null)return null;let e=f5(C?.package_size);return e&&e>0?r/e:r}function U2(C){let r=f5(C.cost);if(C.cost_basis!=="use")return r;let e=f5(C.parts_cost),t=C.purchase?null:r;return t===null&&e===null?null:(t??0)+(e??0)}var f5,S5,c2=u(()=>{"use strict";f5=C=>typeof C=="number"&&Number.isFinite(C)?C:null,S5=C=>Math.round(C*100)/100});function $3(C){return g7[C]??"var(--secondary-text-color)"}function T3(C){return L8[C??""]??f7.length}function b5(C){return o8.includes(C??"")}function Z7(C){return!!C.archived||C.enabled===!1||C.status==="paused"||C.paused===!0}var $1,g7,y5,f7,L8,o8,z2,T1=u(()=>{"use strict";$1={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"var(--deep-orange-color, #ff5722)",archived:"var(--disabled-color, #9e9e9e)",paused:"var(--info-color, #2196f3)"},g7={completed:$1.ok,missed:$1.overdue,reset:$1.paused,skipped:"var(--secondary-text-color)",triggered:$1.triggered,trigger_replaced:$1.triggered,trigger_removed:"var(--secondary-text-color)",updated:"var(--secondary-text-color)"},y5=["completed","reset","skipped"];f7=["overdue","triggered","due_soon","ok"],L8=Object.fromEntries(f7.map((C,r)=>[C,r]));o8=["overdue","triggered"];z2={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",archived:"mdi:archive-outline",paused:"mdi:pause-circle-outline",completed:"mdi:check-circle",skipped:"mdi:skip-next",missed:"mdi:calendar-remove",reset:"mdi:refresh"}});function G2(C){let r=y7.get(C);if(r===void 0){try{r=new Intl.DateTimeFormat("en-US",{timeZone:C,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{r=null}y7.set(C,r)}return r}function k7(){if(P3===void 0){let C;try{C=new Intl.DateTimeFormat().resolvedOptions().timeZone}catch{}P3=C&&G2(C)?C:null}return P3}function w7(){return k7()??"UTC"}function E1(){let C=b7.serverTimeZone;return C&&G2(C)?C:w7()}function P1(){let C=k7();return b7.timeZone!=="server"&&C?C:E1()}function k5(C,r){let e=G2(r)??G2(w7())??G2("UTC"),t={};for(let H of e.formatToParts(C))H.type!=="literal"&&(t[H.type]=Number(H.value));return{y:t.year,mo:t.month,d:t.day,h:t.hour%24,mi:t.minute,s:t.second}}function R1(C,r){return B3(k5(+C,r))}function w5(C,r){let e=k5(+C,r);return`${B3(e)}T${a1(e.h)}:${a1(e.mi)}`}function v1(){return R1(Date.now(),E1())}function O7(){return w5(Date.now(),E1())}function R3(C,r){let e=k5(C,r);return Date.UTC(e.y,e.mo-1,e.d,e.h,e.mi,e.s)-Math.floor(C/1e3)*1e3}function n8(C,r,e,t,H,i,L){let a=Date.UTC(C,r-1,e,t,H,i),n=R3(a-S7,L),d=R3(a+S7,L);for(let p of n===d?[n]:[n,d])if(R3(a-p,L)===p)return a-p;return a-n}function $7(C,r,e){if(C.has(r))return C.get(r);C.size>=l8&&C.clear();let t=e();return C.set(r,t),t}function J(C){if(typeof C!="string"||!C)return NaN;let r=F3.exec(C);if(!r)return Date.parse(C);let e=E1();return $7(M8,`${e}|${C}`,()=>{let[t,H,i,L,a,n]=[r[1],r[2],r[3],r[4]??"0",r[5]??"0",r[6]??"0"].map(Number);if(H<1||H>12||new Date(Date.UTC(t,H-1,i)).getUTCDate()!==i||L>23||a>59||n>59)return NaN;let d=r[7]?Math.floor(+`0.${r[7]}`*1e3):0;return n8(t,H,i,L,a,n,e)+d})}function m2(C){if(typeof C!="string"||!C)return null;let r=F3.exec(C);if(r)return`${r[1]}-${r[2]}-${r[3]}`;let e=E1();return $7(s8,`${e}|${C}`,()=>{let t=Date.parse(C);return Number.isFinite(t)?R1(t,e):/^\d{4}-\d{2}-\d{2}/.test(C)?C.slice(0,10):null})}function T7(C){if(typeof C!="string"||!C)return"";let r=F3.exec(C);if(r)return`${r[1]}-${r[2]}-${r[3]}T${r[4]??"00"}:${r[5]??"00"}:${r[6]??"00"}`;let e=Date.parse(C);if(!Number.isFinite(e))return"";let t=k5(e,E1());return`${B3(t)}T${a1(t.h)}:${a1(t.mi)}:${a1(t.s)}`}function t2(C,r){let e=d8.exec(C);if(!e)return C;let t=new Date(Date.UTC(Number(e[1]),Number(e[2])-1,Number(e[3])+Math.round(r)));return`${a1(t.getUTCFullYear(),4)}-${a1(t.getUTCMonth()+1)}-${a1(t.getUTCDate())}`}var b7,S7,a1,y7,P3,B3,F3,s8,M8,l8,d8,e1=u(()=>{"use strict";b7=window.__msDateTimePrefs??={},S7=864e5,a1=(C,r=2)=>String(C).padStart(r,"0"),y7=new Map;B3=C=>`${a1(C.y,4)}-${a1(C.mo)}-${a1(C.d)}`;F3=/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?$/,s8=new Map,M8=new Map,l8=2e4;d8=/^(\d{4})-(\d{2})-(\d{2})$/});var N7,D7=u(()=>{N7={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",updated:"Updated",trigger_removed:"Trigger removed",ok:"OK",all:"All",new_object:"+ New Object",templates_from:"From template",templates_title:"Start from a template",templates_task_count:"{n} tasks",templates_task_count_one:"1 task",template_updates_banner:"The template \u201C{template}\u201D has {n} changes for this object",template_updates_banner_one:"The template \u201C{template}\u201D has a change for this object",template_updates_review:"Review",template_updates_title:"Changes from the template",template_updates_hint:"The template has changed since this object was made from it. Ticked changes are taken over; the others stay as they are and are not offered again. History, completions and photos are never touched.",template_updates_conflict:"You changed this too",template_updates_new_tasks:"New tasks in the template",template_updates_later:"Later",template_updates_done:"Taken over from the template",template_updates_no_notes:"No notes",template_created:"Created from template",onboard_hint:"Add your first object to start tracking maintenance.",edit:"Edit",duplicate:"Duplicate",task_duplicated:"Task duplicated",task_moved:"Task moved",move_task_target:"Target object",move_task_message:"Choose the object this task should belong to. Its history, readings and trigger state move with it; it gets a new reference number and its entities are recreated under the new object. Linked documents stay with the current object.",bulk_move_message:"Choose the object the selected tasks should belong to. Tasks that already live there are skipped; history, readings and trigger state move along.",bulk_moved:"{n} tasks moved",more_actions:"More actions",back:"Back",quantity:"Quantity",spare_part:"Spare part",move_task_title:"Move task",move_task:"Move to another object\u2026",object_duplicated:"Object duplicated",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",missed:"Missed",reset:"Reset",snooze:"Snooze",snoozed:"Snoozed",snoozed_for:"Reminders muted for {hours} hours \u2014 until {until}",snoozed_for_one:"Reminders muted for one hour \u2014 until {until}",cancel:"Cancel",bulk_select:"Select",bulk_select_all:"Select all",bulk_n_selected:"{n} selected",bulk_completed:"{n} tasks completed",bulk_archived:"{n} tasks archived",bulk_delete_objects_confirm:"Delete {n} objects and all their tasks? Archiving keeps their history instead.",bulk_objects_deleted:"{n} objects deleted",bulk_objects_archived:"{n} objects archived",bulk_assign:"Assign",bulk_assign_one:"One person",bulk_assign_share:"Several people, each of them",bulk_assign_rotate:"Several people, in turns",bulk_assign_hint:"Replaces who is assigned to the selected tasks \u2014 a rotation included.",bulk_rotation_min_two:"Pick at least two people.",bulk_labels_add:"Add labels",bulk_labels_remove:"Remove labels",bulk_edit_hint:"Only the ticked settings change; everything else stays as it is.",bulk_no_notifications:"No notifications for these tasks",bulk_updated:"{n} tasks updated",bulk_paused:"{n} tasks paused",bulk_resumed:"{n} tasks resumed",bulk_objects_area:"Area set for {n} objects",bulk_failed:"{n} failed: {reason}",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",last_done_days_ago:"done {n} d ago",last_done_today:"done today",no_due_date:"No due date",next_due:"Next due",kpi_reported_by_sensor:"Reported by the sensor",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",trigger_type_due_date:"Date from a sensor",runtime_hours:"Target runtime (hours)",days_before:"Days before the date",days_before_help:`For a sensor that reports when the maintenance is due (a date or timestamp). 0 = on the date itself. The device's own "done" button moves the date forward, which clears the trigger \u2014 make it the completion action.`,target_value:"Target value",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",calendar:"Calendar entity",calendar_entity_label:"Calendar",calendar_entity_hint:"Due once per event of this calendar, on the event's start date \u2014 the next event after the last completion.",calendar_entity_required:"Choose a calendar entity.",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",recurrence_last_day:"Last day of the month",recurrence_business_day:"Business days only (roll back from weekend)",recurrence_offset:"Offset (days, \xB1)",recurrence_offset_help:"Shift the date by \xB1N days, e.g. -2 = two days before.",recurrence_months_label:"Only in these months",recurrence_months_hint:"The date repeats in the selected months only; pick one month for a yearly task. None = every month.",last_day_month:"Last day of month",last_business_day_month:"Last business day",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",reading:"Reading",custom:"Custom",history:"History",cost:"Cost",cost_kind_credit:"Credit",cost_credit_hint:"Money back \u2014 a sale, a refund. It lowers the totals; the average per completion leaves it out.",report_button:"Report",report_title:"Maintenance report",report_generated:"Generated",report_times_done:"Done",report_total_cost:"Total cost",report_notes:"Notes",report_col_type:"Type",report_col_status:"Status",report_col_schedule:"Schedule",duration:"Duration",minutes_short:"min",both:"Both",trigger_val:"Trigger value",trigger_update_available:"{latest} available, {installed} installed",complete_title:"Complete: ",checklist:"Checklist",require_on_completion:"Require on completion",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",ws_err_not_found:"Not found \u2014 it may have been deleted meanwhile",ws_err_invalid_input:"Invalid input",ws_err_invalid_date:"Invalid date",ws_err_invalid_format:"Invalid format",ws_err_invalid_url:"Invalid link",ws_err_invalid_mirror_todo:"Invalid to-do list",ws_err_not_configured:"Not set up yet",ws_err_not_loaded:"Not loaded yet \u2014 try again in a moment",ws_err_limit_reached:"Limit reached",ws_err_too_many:"Too many entries",ws_err_too_large:"Too large",ws_err_not_archived:"Not archived",ws_err_invalid_target:"Invalid target",ws_err_create_failed:"Could not be created",ws_err_archived:"Archived \u2014 restore it first",ws_err_already_archived:"Already archived",ws_err_unavailable:"Currently unavailable",ws_err_unauthorized:"Not permitted for your user",ws_err_too_many_views:"Too many saved views",ws_err_replace_failed:"Replacement failed",ws_err_not_paused:"Not paused",ws_err_not_available:"Nothing available",ws_err_no_url:"No link given",ws_err_no_phases:"This task has no phases",ws_err_invalid_view:"Invalid view",ws_err_invalid_user:"Unknown user",ws_err_invalid_range:"Invalid range",ws_err_invalid_parent:"Invalid parent object",ws_err_invalid_device:"Unknown device",ws_err_empty_csv:"The CSV file is empty",ws_err_empty:"Nothing to import",ws_err_duplicate_failed:"Could not duplicate",ws_err_already_paused:"Already paused",ws_err_invalid_cursor:"Invalid phase position",ws_err_invalid_entity_slug:"Invalid entity name",ws_err_invalid_trigger_config:"Invalid trigger configuration",ws_err_no_defaults:"No quick-complete defaults set",ws_err_self_link_device:"An object cannot be linked to itself",ws_err_too_early:"Too early \u2014 this task can only be completed closer to its due date",ws_err_invalid_search_template:"The search link must be an http(s) URL containing {q}",ws_err_invalid_notify_service:"Invalid notification service format. Use 'notify.service_name' (e.g., notify.mobile_app_phone).",ws_err_notify_service_not_found:"This notification service was not found in Home Assistant. Please verify the service name.",ws_err_invalid_shopping_list_entity:"The shopping list must be a to-do entity (todo.\u2026).",ws_err_invalid_icon:"The notification icon must be an mdi: name, e.g. mdi:air-filter",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_toggle:"Due at a specific time",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",notes_markdown_hint:"Markdown is supported \u2014 **bold**, lists, [links](\u2026)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",completed_at_optional:"Completed at (optional, empty = now)",completed_at_pick:"Set date & time",completed_at_future_error:"The completion date cannot be in the future.",ha_time_zone_hint:"Time in Home Assistant's time zone ({zone})",days:"days",days_few:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",task_series_position:"{n} of {total}",task_series_skip:"Skip",task_series_save_next:"Save & next",task_section_schedule:"Schedule",task_section_trigger:"Sensor trigger",task_section_completion:"Completing it",task_section_people:"People",task_section_notifications:"Notifications",task_section_details:"Details",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",priority:"Priority",labels:"Labels",labels_placeholder:"e.g. safety, seasonal, tenant-visible",labels_help:"Comma-separated tags for filtering and reporting.",task_mirror_todo:"Mirror into to-do lists",task_mirror_todo_hint:"The task appears in these lists while it is due; checking it off there completes it here.",task_mirror_todo_default:"Default lists: {lists}",task_mirror_todo_own:"Other lists",task_mirror_todo_none:"Not on any to-do list",task_mirror_todo_max:"At most {max} lists; Maintenance Supporter's own lists are not offered.",priority_low:"Low",priority_normal:"Normal",priority_high:"High",all_priorities:"All priorities",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",earliest_completion_days:"Earliest completion (days before due)",earliest_completion_days_help:"Leave empty to allow completing any time. 0 = only on/after the due date.",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",interval_anchor_hint:"From completion date: the next due date counts from the day the task is marked done, so doing it early or late moves the schedule. From planned date: the schedule keeps its dates, for example when a bill is paid weeks before it is due.",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",object_replaces:"Replaces",object_replaced_by:"Replaced by",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",all_parts:"All parts",all_areas:"All areas",areas_filter:"Filter areas\u2026",areas_filter_none:"No area matches the filter.",area_cost_year:"Cost {year}",area_object_count:"{n} objects",area_object_count_one:"1 object",area_range_12m:"Last 12 months",area_range_all:"All time",area_task_filter:"Filter by task\u2026",area_kpi_completions:"Completions",area_kpi_total_time:"Total time",area_cost_per_month:"Cost per month",area_cost_per_year:"Cost per year",area_cost_per_object:"Cost per object",area_cost_share:"Share",area_history_section:"History (all objects)",area_report_print:"Area report (PDF)",area_report_title:"Area report",area_report_period:"Period",area_no_costs:"No costs recorded in this period.",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",trigger_equals:"Trigger when equal to (=)",trigger_not_equals:"Trigger when different from (\u2260)",for_at_least_minutes:"For at least (minutes)",safety_interval:"Safety interval (optional)",trigger_combinator:"Combine trigger and interval",trigger_combinator_any:"Trigger or interval (whichever first)",trigger_combinator_all:"Trigger and interval (both required)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",adaptive_prediction_enabled:"Enable sensor-driven predictions",adaptive_seasonal_enabled:"Enable seasonal awareness",adaptive_max_interval:"Maximum interval (days)",adaptive_min_interval:"Minimum interval (days)",adaptive_ewa_alpha:"Learning rate (alpha)",adaptive_enabled:"Enable adaptive scheduling",adaptive_section_title:"Adaptive Scheduling",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",task_shared_with:"Shared with",task_shared_with_help:"Without a responsible person, the task is meant for each of them: everyone gets its reminders and finds it under My Tasks. With a rotation, they take turns.",task_shared_responsible_wins:"Someone is responsible, so the task is meant for them alone. Clear Responsible User to share it.",rotation_strategy:"Rotation",rotation_none:"No rotation",rotation_round_robin:"Round-robin",rotation_least_completed:"Least completed",rotation_random:"Random",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_every_n_days:"every {n} days",cal_every_day:"every day",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",hide_outliers:"Hide outliers (sensor glitches)",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",clear:"Clear",date_type_toggle:"Type the date",date_type_invalid:"Not a valid date \u2014 try 1978-03-15, a year like 1978, or your own date format",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",sensor_prediction_urgency_one:"Sensor predicts threshold in ~{days} day",sensor_prediction_urgency_few:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",subsave_warning:"Saved, but one setting was rejected: {detail}",qr_print:"Print",qr_download:"Download SVG",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_action_quick_complete:"Quick-complete \u2014 no dialog",qr_quick_complete_off:"Quick complete is off for this task. Turn it on in the task: Completing it \u2192 Quick complete.",qr_quick_records:"Records: {values}",qr_quick_records_nothing:"Records the completion only",qr_print_quick_off:"Quick-complete codes need tasks with quick complete on (task \u2192 Completing it \u2192 Quick complete). None of the chosen objects' tasks has it.",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",strat_this_month:"This Month",strat_later:"Later",strat_week:"Week",strat_fortnight:"Fortnight",strat_month:"Month",strat_year:"Year",strat_other:"Other",strat_status:"Status",strat_empty_title:"No maintenance objects yet",strat_empty_content:"Open the Maintenance panel to add your first object \u2014 pool pump, HVAC filter, vehicle, anything that needs scheduled care.",strat_open_panel:"Open Maintenance panel",strat_add_object:"Add object",strat_not_loaded:"**Maintenance Supporter** is not loaded. Install/enable the integration first.",strat_group_by:"Group views by",strat_group_area:"By area (default)",strat_group_status:"By status (Overdue / Triggered / Due Soon / OK)",strat_group_floor:"By floor (uses HA floors)",strat_group_due_date:"By due date (Overdue / Today / Week / Month / Later)",strat_group_calendar:"Rolling calendar (Week / Fortnight / Month / Year)",strat_editor_help:'The "Overview" view is always first. Empty groups are skipped.',picker_name_calendar:"Maintenance Supporter \u2014 Calendar",picker_name_panel:"Maintenance Supporter \u2014 Panel",picker_name_budget:"Maintenance Supporter \u2014 Budget",picker_name_groups:"Maintenance Supporter \u2014 Groups",picker_name_vacation:"Maintenance Supporter \u2014 Vacation",picker_name_battery_fleet:"Battery Fleet",picker_name_section:"Maintenance Supporter \u2014 Section",picker_name_vacation_status:"Maintenance Supporter \u2014 Vacation Status",picker_name_budget_status:"Maintenance Supporter \u2014 Budget Status",picker_desc_card:"Overview of your maintenance tasks with quick actions.",picker_desc_calendar:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",picker_desc_panel:"The complete Maintenance Supporter panel as a card \u2014 for a panel view / dashboard subview without the sidebar entry.",picker_desc_budget:"Edit the monthly and yearly budget right on the dashboard.",picker_desc_groups:"Create, rename and delete task groups right on the dashboard.",picker_desc_vacation:"Switch vacation mode on or off and set its dates right on the dashboard.",picker_desc_battery_fleet:"All tracked batteries: what is low now, what runs out soon, and what to buy.",picker_desc_dashboard:"Auto-generated dashboard. Group views by area, status, floor, or due date \u2014 picked from the strategy editor or YAML.",picker_desc_section:"Embed maintenance tasks (filterable by area, status, due date) as a section in any dashboard view.",picker_desc_vacation_status:"Compact vacation-mode status banner. Tap to open settings in the panel.",picker_desc_budget_status:"Monthly + yearly maintenance budget overview. Tap for details.",picker_desc_groups_status:"List of configured task groups with member counts.",hist_note_button:"Completed from dashboard button",hist_note_todo:"Completed from the To-do list",hist_note_voice:"Completed by voice",hist_note_notification:"Completed from the notification",hist_note_nfc:"Completed via NFC tag",hist_note_shopping_list:"Completed from the shopping list",hist_note_todo_mirror:"Completed from a mirrored to-do list",hist_note_skipped_notification:"Skipped from notification",hist_note_skipped_button:"Skipped from dashboard button",hist_note_sensor_triggered:"Sensor trigger activated",hist_note_initial:"Initial value set during task creation",hist_note_auto_recovered:"Auto-completed: sensor recovered ({value})",hist_note_auto_entity:"Auto-completed: {entity} changed to {state}",hist_note_auto_recovered_plain:"Auto-completed: sensor recovered",hist_note_reset:"Reset to {date}",hist_note_trigger_replaced:"Trigger entity replaced: {old} \u2192 {new}",hist_note_template_updated:"From the template: {fields}",hist_note_trigger_removed:"Sensor trigger removed (entity was: {entity}). Schedule converted to {schedule}.",hist_note_compound_removed:"Entity {entity} removed from compound trigger; {count} conditions remain.",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",compound:"Compound (multiple conditions)",compound_logic_and:"AND \u2014 all conditions must trigger",compound_logic_or:"OR \u2014 any condition triggers",compound_help:"Combine several sensor conditions into one trigger.",compound_no_conditions:"No conditions yet \u2014 add at least one.",compound_add_condition:"Add condition",compound_condition:"Condition",compound_remove_condition:"Remove condition",card_title:"Title",card_simple_preset:"Set up as a simple list",card_simple_preset_help:"Compact rows, an open circle to tick off, no create buttons or document chips, the person before the task. Each option stays changeable.",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_show_create:"Show create buttons",card_action_style:"Complete button style",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_areas:"Filter by areas",card_filter_areas_help:"Empty = show all areas.",card_filter_priority_help:"Empty = show all priorities. Tasks without an explicit priority count as Normal.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",place_optional:"Place (zone, optional)",remind_on_site:"Remind only while somebody is there",remind_on_site_hint:"Reminders wait until somebody is in this zone. Whoever arrives there gets a message with what is due.",place_missing:"Zone not found: reminders as at home",place_home:"Home",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_delete_entry:"Delete entry",history_delete_confirm_entry:"Delete this history entry? The task's last-performed date falls back to the previous completion; photos stay with the object.",history_delete_returns_parts:"The parts it used go back to stock: {parts}.",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",notify_icon:"Notification icon",notify_icon_hint:"Shown by the Companion app on Android. Empty = the icon of this task's maintenance type ({default}).",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",tab_today:"Today",palette_placeholder:"Search objects, tasks, spare parts, documents, notes\u2026",palette_no_results:"No matches",palette_hint:"\u2191\u2193 to navigate \xB7 Enter to open \xB7 Esc to close \xB7 / opens the search anywhere",search_open:"Search",search_group_parts:"Spare parts",search_group_content:"In documents",search_group_history:"History notes",search_page:"Page {page}",search_empty_hint:"Type to search objects, tasks, spare parts, documents and notes",search_searching:"Searching documents and notes\u2026",search_index_status:"Full-text search: {indexed} of {total} files indexed \xB7 {no_text} without text layer \xB7 {pending} pending",today_all_caught_up:"All caught up! Nothing due this week.",today_overdue:"Overdue",today_due_today:"Due today",today_this_week:"This week",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_consumable_threshold:"Consumable low threshold (%)",settings_battery_low_percent:"Battery low threshold (%)",settings_battery_recovered_percent:"Battery counts as replaced above (%)",settings_battery_recovered_percent_hint:"A low battery stays counted as low until its level rises above this value or a replacement is recorded \u2014 so a level hovering around the low threshold cannot complete the fleet task again and again.",settings_battery_low_delay:"Battery counts as low after (minutes)",settings_battery_low_delay_hint:"A battery must read low this long before it counts as low, so a sensor that reports a very low level for a moment and recovers by itself does not put it on the list. 0 = at once.",settings_battery_auto_record:"Record a replacement automatically when a low battery recovers",settings_battery_auto_record_hint:"When a battery that was low rises above the recovery threshold, the replacement date is recorded in Battery Notes and the spare cells are taken from stock \u2014 no tap needed.",settings_battery_lifetimes:"Typical battery lifetimes",settings_battery_lifetimes_hint:'Only used for batteries without a percentage: a Battery Notes note that has just a type and a last-replaced date, or a sensor that only reports "low". Their due date is last replaced + this lifetime. Batteries that report a level get their forecast from the measured discharge instead. Once the fleet has seen three replacements of a type, the median interval takes over from the built-in value \u2014 your own value always wins.',settings_battery_lifetime_months:"months",settings_battery_lifetime_reset:"Use default",settings_battery_lifetime_in_fleet:"in your fleet",settings_battery_lifetime_learned_models:"Learned per model: {list}",settings_thresholds_hint:"Defaults for new Suggested setups (percent-remaining consumables) and for fleet batteries without their own Battery Notes threshold. Existing tasks keep their value.",settings_part_search_url:"Shopping search link",settings_part_search_url_hint:"URL with {q} in place of the search terms, used for parts without a product link. Leave empty for the automatic store (by country, then by language).",settings_value_out_of_range:"Value must be between {min} and {max}",bn_summary:"{name}: {pct} % for {n} batteries",bn_floor_decides:"Your {floor} % floor decides for all of them; the higher of the two thresholds counts per battery.",bn_above_floor:"That is above your {floor} % floor, so {name} decides for all noted batteries.",bn_overrides:"{n} devices with their own threshold:",bn_more:"+ {n} more",settings_row_actions:"Task row actions",settings_ref_numbers_in_lists:"Reference numbers in lists",settings_ref_numbers_in_lists_hint:"Show the #8 / #8.3 chips in front of object and task names in the Today list, the task table, the object cards and the objects table.",settings_compact_refs:"Compact reference numbers",settings_compact_refs_hint:"Renumbers all objects, tasks and completions in order (1, 2, 3 \u2026) and closes the gaps left by deletions. Numbers already printed on service booklets, photos or notes will no longer match.",settings_compact_refs_confirm:"Renumber every object, task and completion sequentially in creation order? Numbers already written on printed service booklets, photos or notes will no longer match. This cannot be undone.",settings_compact_refs_done:"Renumbered {objects} objects, {tasks} tasks and {completions} completions.",row_actions_buttons_compact:"Buttons (icons only on phones)",row_actions_buttons:"Buttons with text",row_actions_icons:"Icons (classic)",row_actions_follow:"Follow the household setting",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",settings_shopping_list:"Shopping list (buy tasks)",settings_shopping_list_help:"Low-part buy reminders appear in this to-do list; checking one off restocks the part.",shopping_list_none:"Off \u2014 no shopping list",settings_mirror_todo_default:"Default to-do lists for tasks",settings_mirror_todo_default_help:"While a task is due, it appears on the lists ticked here, unless the task picks its own lists or none. Checking it off there completes the task. A list that takes a due date gets the task's.",settings_mirror_todo_default_none:"No to-do lists in Home Assistant yet.",settings_install_assist_sentences:"Install Assist sentences",settings_install_assist_sentences_hint:"Copies the voice sentences into your configuration so the classic Assist agent recognises them. A file you edited yourself is never overwritten.",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",notify_per_person:"Per-person delivery",member_avatars:"Member avatars",member_avatars_hint:"Shown next to assigned tasks \u2014 initials in the member's colour. Defaults come from the name; set your own initials or pick a colour to tell members apart.",member_initials:"Initials",member_color:"Colour",member_avatar_reset:"Reset",notify_no_own_device:"No own device \u2014 uses the household service",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_reminder_leads:"Extra reminders (days before due)",settings_reminder_leads_hint:"Comma-separated lead times, e.g. 14, 3, 0 \u2014 one extra reminder fires on each matching day. Empty = off.",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_weekly_digest:"Weekly digest",settings_weekly_digest_hint:"A single summary notification on Monday morning when tasks are due.",settings_warranty_reminder:"Warranty expiry reminder",settings_warranty_reminder_days:"Days before expiry",settings_warranty_reminder_hint:"Notify once when an object's warranty is this many days from expiring.",settings_snooze_hours:"Snooze duration (hours)",settings_snooze_hours_hint:"How long Snooze mutes a task's reminders \u2014 from the task menu, a card, voice or the phone's Snooze button. The due date stays as it is.",settings_budget:"Budget",settings_currency:"Currency",settings_currency_decimals:"Decimal places for amounts",settings_currency_decimals_hint:"How many decimals every amount shows: KPIs, budgets, costs in lists and reports, budget alerts. 0 = whole numbers.",settings_parts_cost_mode:"Spare parts count as spending",settings_parts_cost_purchase:"When bought",settings_parts_cost_use:"When used",settings_parts_cost_mode_hint:"When bought: a buy reminder's cost counts, and the parts a job uses are shown as information. When used: every completion books the value of the parts it used, and a purchase sets the part's price instead of counting. Applies to completions from now on \u2014 history keeps how it was booked.",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_export_settings:"Export settings (JSON)",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_import_unmatched_users:"Not found on this instance: {names}. Their task assignments were removed \u2014 add people with the same names in Home Assistant and import again to keep them.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",settings_export_selection:"Limit to selected objects (optional)",settings_docs_archive:"Documents archive (with files)",settings_docs_archive_hint:"The JSON and YAML exports list your documents but not their files; CSV leaves documents out. This ZIP holds the uploaded files \u2014 restore it after importing the JSON and nothing is missing.",settings_docs_export_btn:"Download documents ZIP",settings_docs_import_btn:"Restore documents ZIP",settings_docs_import_success:"Restored: {blobs} files, {docs} documents",settings_docs_import_missing:"{n} skipped \u2014 their files were not in the ZIP",settings_docs_import_unmatched:"No object here matches {names}: their files were kept but not attached",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",groupby_object:"By object",filter_label:"Filter",user_label:"User",photo_label:"Photo",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",state_latch_help:"With 1 transition the trigger is a latch: it recovers when the entity leaves the To-state \u2014 or, with only a From-state set, when it returns to that state.",for_minutes_state_help:"0 counts every change immediately. Set minutes and the new state must hold that long first \u2014 brief flickers then neither trigger nor count.",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_ended:"Ended",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else only gets Complete, Skip, Reset, Postpone and Snooze.",settings_shared_devices:"Shared devices",settings_shared_devices_desc:"Accounts several people use, like a kitchen tablet. A completion made there is credited to whoever is on duty (the responsible person, on a rotation whose turn it is); the history notes the device.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc_v2:"Per-task HA action on complete.",feat_places:"Places",feat_places_desc:"Objects maintained at another place (a Home Assistant zone): reminders only while somebody is there, and a message on arrival.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_target_more:"This action targets more than this field shows: {targets}. That is kept as it is \u2014 choosing another entity here replaces the whole target.",on_complete_action_skip_auto:"Not when the task completes itself (its sensor recovered)",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",action_test_bad_format:"Invalid service format (expected 'domain.service')",action_test_unknown_service:'Service "{service}" is not registered in Home Assistant. Check the spelling and that the integration providing it is loaded.',action_test_domain_mismatch:`Service "{service}" only works on {domain}.* entities; entity "{entity}" is in {entity_domain}.* \u2014 pick a service that matches the entity's domain (e.g. {suggestion})`,action_test_entity_missing:'Target entity "{entity}" was not found in Home Assistant \u2014 it may have been renamed or its integration removed.',quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",completion_already_recorded:"Already recorded {seconds} s ago, not counted twice",quick_complete_label:"Quick complete",quick_complete_help:"One tap completes it, without a dialog: in the panel and on dashboard cards, with the quick-complete QR code, from a notification, a button, a to-do list or by voice.",quick_complete_values:"Prefill (optional)",quick_complete_values_help:"Entered by every completion without a dialog. The completion dialog starts with them too.",quick_complete_needs_dialog:"Asks on completion for: {fields}. A quick completion opens the dialog for it.",quick_complete_tag_hint:"Needs a tag scan: only the tag or the quick-complete QR code on the thing completes it in one go.",quick_complete_not_asked:"A quick completion does not ask for the checklist or the readings.",complete_with_details:"Complete with details\u2026",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_buy_task_confirm:"This task reminds you to buy a spare part that is running low. Deleted on its own, it comes back as long as the part stays low.",delete_buy_task_off:"Also turn off the buy reminder for this part",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026",archive:"Archive",undo:"Undo",task_completed_named:"Completed: {task}",undo_done:"Completion undone",undo_done_action_ran:"Completion undone. Its completion action had already run and cannot be taken back.",undo_nothing:"Nothing to undo. Only your own last completion can be taken back, within 10 minutes.",undo_changed:"Can't undo. The task has changed since.",task_archived:"Task archived",object_archived:"Object archived",unarchive:"Unarchive",archived:"Archived",show_archived:"Show archived",hide_archived:"Hide archived",section_collapse:"Collapse section",section_expand:"Expand section",confirm_archive_object:"Archive this object and its tasks? They keep their history and can be unarchived later.",settings_archive:"Archive & Retention",settings_archive_desc:"Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",settings_archive_oneoff_days:"Auto-archive completed one-off tasks after (days, 0 = off)",settings_delete_archived_oneoff_days:"Auto-delete archived one-off tasks after (days, 0 = never)",archive_object:"Archive object",unarchive_object:"Unarchive object",documents:"Documents",documents_empty:"No documents yet.",doc_upload:"Upload file",doc_uploading:"Uploading\u2026",doc_add_link:"Add link",doc_link_url:"URL (https://\u2026)",doc_link_title:"Title (optional)",doc_open:"Open",doc_delete_confirm:'Delete "{name}"?',doc_too_large:"File is too large (max 100 MB).",doc_upload_failed:"Upload failed.",docs_archive_too_large:"The archive is too large (max {max}).",docs_archive_no_manifest:"This ZIP has no manifest.json, so the restore cannot tell which document a file belongs to. Keep manifest.json next to the folders when zipping again.",completion_photos_optional:"Completion photos (optional)",completion_photos:"Completion photos",choose_photos:"Choose photos",choose_photo:"Choose photo",photos_android_hint:"The Android app hands over one photo per pick \u2014 each pick is added.",photos_limit:"Up to {max} photos per completion",history_edit_photos_hint:"Removing a photo here keeps the file in the object's documents.",uploading:"Uploading\u2026",remove:"Remove",doc_deduped:"Already stored elsewhere \u2014 shared, no extra space used.",doc_dup_in_object:"This file is already attached to this object.",doc_link_not_allowed:"This link is not allowed: links that run scripts or open local files (javascript:, data:, file: \u2026) are refused.",doc_cat_manual:"Manual",doc_cat_warranty:"Warranty",doc_cat_invoice:"Invoice",doc_cat_spare_parts:"Spare parts",doc_cat_photo:"Photo",doc_cat_other:"Other",doc_link_badge:"Link",doc_storage_title:"Document storage",doc_storage_saved:"Saved via deduplication",doc_storage_refresh:"Refresh",doc_download:"Download",doc_close:"Close",doc_camera:"Take photo",camera_capture_shoot:"Capture",camera_switch_lens:"Switch camera",camera_switching:"Switching camera\u2026",camera_not_answered:"This camera did not answer. Tap the switch again to try the next one, or use the file picker.",camera_diagnostics:"Details for a bug report",camera_copy:"Copy",camera_copied:"Copied",doc_drop_hint:"Drop files here",doc_task_none:"No documents linked to this task.",doc_link_existing:"Link a document\u2026",doc_attach:"Link",doc_unlink:"Unlink",doc_page:"Page",chart_range_7d:"7d",chart_range_30d:"30d",chart_range_90d:"90d",chart_range_1y:"1y",chart_since_service:"since last service",chart_no_stats:"No long-term statistics for this entity \u2014 showing maintenance-event values only",auto_complete_on_recovery:"Auto-complete when the sensor recovers",auto_complete_on_recovery_help:"Records a completion (sets last performed) when the trigger clears itself \u2014 e.g. salt refilled, filter replaced.",trigger_end:"When the state ends",trigger_end_ok:"The task goes back to OK",trigger_end_done:"Record the task as done",trigger_end_hold:"Keep the task triggered until it is done",trigger_end_hold_help:"For a state that lasts only a moment, such as a finished wash: the task stays until it is completed, by hand or by its Done when entity.",trigger_detail_attribute:"Show with the task (optional)",trigger_detail_none:"Nothing",trigger_detail_attribute_help:"While the trigger is active, the value of this attribute shows after the task's name and in its reminder: which medicine is running low, which window is open.",doc_search:"Search documents\u2026",doc_search_none:"No matching documents",doc_description:"Description (optional)",doc_sort:"Sort documents",doc_sort_newest:"Newest first",doc_sort_oldest:"Oldest first",doc_sort_title:"By title (1, 2, 3 \u2026)",doc_sort_category:"By category",link_device_optional:"Link to existing device (optional)",parent_object_optional:"Parent object (optional)",parent_none:"(No parent)",parent_object_hint:"Shown inside the parent in the lists of objects.",sub_objects:"Sub-objects",sub_objects_count:"{n} sub-objects",sub_objects_count_one:"1 sub-object",add_sub_object:"Add sub-object",sub_object_move_here:"Move an existing object here",sub_object_move_message:"The object moves inside {name}, with everything inside it. Its tasks and history stay as they are.",sub_object_move_confirm:"Move here",sub_object_moved:"Moved inside {name}",templates_inside:"The new object goes inside {name}.",sub_objects_show:"Show sub-objects",sub_objects_hide:"Hide sub-objects",paused:"Paused",pause_object:"Pause",resume_object:"Resume",pause_task:"Pause",resume_task:"Resume",pause_task_prompt:"Freeze this task's schedule \u2014 it does not become due and does not notify until you resume it, and resuming starts a fresh cycle from that day. The object's other tasks keep running. Optionally set a date to resume by itself.",task_paused:"Task paused",task_resumed:"Task resumed \u2014 its schedule restarted",pause_until_prompt:"Freeze this object's schedules \u2014 nothing becomes due and nothing notifies until it is resumed. Optionally set an auto-resume date.",pause_until_label:"Resume on (optional)",object_paused:"Object paused",object_resumed:"Object resumed \u2014 schedules restarted",object_paused_badge:"Paused",paused_until_label:"until",replace_object:"Replace\u2026",replace_object_prompt:"Retire this object and create a successor. History and costs stay archived on the old one; tasks and documents carry over to the new one, counters start fresh.",replace_name_label:"Successor name",replace_device_heading:"Device in Home Assistant",replace_device_keep:"Same device as before ({device})",replace_device_keep_hint:"Also the choice when the new unit is not in Home Assistant yet: once it is, pick it as the object's device in its settings \u2014 the sensor triggers move along then.",replace_device_other:"The new unit is another device",replace_device_pick:"Device of the new unit",replace_device_other_hint:"Sensor triggers, completion actions and the counter reset move to the matching entities of that device.",replace_device_none:"No device",object_replaced:"Object replaced \u2014 successor created",device_swap_moved:"{count} sensor links moved to the new device.",device_swap_moved_one:"One sensor link moved to the new device.",device_swap_unmatched:"{count} could not be matched \u2014 check those tasks' sensor triggers.",device_swap_unmatched_one:"One could not be matched \u2014 check that task's sensor trigger.",reading_unit_label:"Reading unit (e.g. kWh, m\xB3)",reading_unit_help:"Shown next to the recorded value when completing this task.",reading_value_label:"Reading value",reading_label:"Reading",readings_section:"Readings",readings_hint:"Several named values per completion \u2014 one row per meter. Leave empty to record a single value.",reading_name_label:"Reading name",reading_unit_short:"Unit",reading_add:"Add reading",reading_duplicate_name:"Name already used",reading_last:"last: {value}",reading_below_last:"Lower than the last reading ({value})",settings_templates_label:"Template gallery",settings_templates_hint:`Untick templates you'll never need \u2014 they disappear from the "From template" pickers (panel and config flow). Nothing else changes; you can re-enable them any time.`,home_profile_title:"Home profile",home_profile_hint:"Recommends templates and sets seasonal windows for your climate and hemisphere. Everything is worked out locally from your floors, areas and home location.",home_type_label:"Home type",home_type_auto:"Automatic ({detected})",home_region_label:"State, province or region",home_region_none:"not found",home_region_hint:"Some rules differ within a country \u2014 a yearly vehicle inspection in one state, none in the next. Found from your home location.",home_dwelling_house:"House",home_dwelling_apartment:"Apartment",home_dwelling_unknown:"not recognised",home_detected_from:"Detected from: {reasons}",home_reason_floors:"several floors",home_reason_basement:"a basement",home_reason_garden:"a garden",home_reason_shed:"a shed",home_reason_driveway:"a driveway",home_reason_garage:"a garage",home_reason_attic:"an attic",home_reason_lawn_mower:"a lawn mower",home_reason_gate:"a gate",home_reason_balcony:"a balcony",home_reason_small_home:"few rooms on one floor",home_reason_ups:"a UPS",home_climate_label:"Climate",home_climate_value:"K\xF6ppen {koppen} \xB7 coldest month {cold} \xB0C \xB7 warmest month {warm} \xB0C",home_climate_unknown:"No home location set in Home Assistant",home_hemisphere_south:"Southern hemisphere \u2014 seasonal windows are mirrored",home_trait_freeze:"Frost in winter",home_trait_snow:"Snowy winters",home_trait_severe_winter:"Severe winters",home_trait_damp:"Damp climate",home_trait_mediterranean:"Mediterranean climate",home_trait_earthquake:"Earthquake region",home_trait_hot_summer:"Hot summers",home_trait_hot_humid:"Hot and humid",home_trait_hot_dry:"Hot and dry",home_trait_termites:"Termite region",home_trait_wildfire:"Wildfire risk",home_trait_cyclone:"Hurricane / typhoon region",home_trait_tropical:"Tropical climate",home_trait_radon:"Radon test recommended",home_reason_starter:"Basics for your home",home_reason_country:"Common in {country}",home_reason_feature:"Found in your home: {feature}",templates_recommended_title:"Recommended for your home",templates_recommended_hint:"Based on your home profile \u2014 adjust it in Settings.",templates_legal_hint:"Notes on legal duties and intervals are guidance, not legal advice. Rules vary by region and change over time \u2014 local regulations and the manufacturer's instructions take precedence.",templates_not_typical:"Not typical for your home type",templates_set_up:"Already set up",worksheet:"Work sheet",worksheet_scan_view:"Scan to open the task",worksheet_scan_complete:"Scan to complete",worksheet_manual_excerpt:"Manual excerpt",worksheet_pages:"pages",worksheet_printed:"Printed",worksheet_never:"Never",card_all_caught_up:"All caught up \u2014 nothing needs attention",postpone:"Postpone",postpone_date_prompt:"Postpone this occurrence to which date?",postpone_date_label:"New due date",postponed:"Postponed",postponed_to:"Postponed to",season_window_label:"Seasonal window (months)",season_window_hint:"Only due in the selected months; off-season dates roll to the next active month. None = all year.",series_end_label:"Ends",series_end_never:"Never (repeats indefinitely)",series_end_after_count:"After a number of times",series_end_until:"On a date",series_end_count_label:"Number of times",series_end_until_label:"End date",parts_section:"Parts & consumables",parts_inventory_value:"Inventory value",part_add:"Add part",part_name:"Name",part_vendor:"Manufacturer",part_storage_location:"Storage location",part_product_url:"Product URL",part_unit:"Unit",part_cost:"Unit price",part_cost_mode:"Counts as spending",part_cost_mode_house:"As in Settings ({mode})",part_cost_mode_hint:"When bought: the purchase counts, in the year it is made. When used: every completion that uses the part books its price on the object, and so the area, where it is used.",part_stock:"Stock",part_reorder_threshold:"Reorder at",part_restock_quantity:"Restock quantity",part_package_size:"Package size (units)",part_restock_packages:"Restock amount (packages)",part_package_hint:"Bought in packages, used in the unit: stock, the amount a task uses and the reorder threshold count units; the restock amount and the price are per package.",part_auto_buy:"Auto-create buy task when low",part_reuse:"After use",part_reuse_none:"Used up",part_reuse_charge:"Charged",part_reuse_sharpen:"Sharpened",part_reuse_clean:"Cleaned",part_reuse_dry:"Dried",part_reuse_refill:"Refilled",part_reuse_restore:"Restored",part_waiting_charge:"{count} to charge",part_waiting_sharpen:"{count} to sharpen",part_waiting_clean:"{count} to clean",part_waiting_dry:"{count} to dry",part_waiting_refill:"{count} to refill",part_waiting_restore:"{count} to restore",part_restoring:"Used, not ready yet",part_ready_again_hint:"All used ones are ready again",part_dispose:"Dispose",part_dispose_hint:"Gone for good, such as a dead cell: off the waiting pile, not back to the stock",part_dispose_how_many:"How many are gone for good",part_use:"Use",part_use_hint:"Used outside a task: off the stock like the parts of a completion",part_use_how_many:"How much was used",part_use_not_booked:"Not booked as spending: this part counts when used, which only a task's completion books.",part_bought:"Bought\u2026",part_bought_hint:"Record a purchase: into the stock, with what was paid and when",part_bought_quantity:"How many",part_bought_packages:"Packages of {size}",part_bought_price_each:"Price each",part_bought_price_package:"Price per package",part_bought_total:"Total",part_bought_date:"Bought on",part_bought_note:"Shop, receipt, \u2026",part_bought_confirm:"Record purchase",part_bought_adds:"Adds {qty} to the stock",part_bought_on_use:"Stock, not spending: this part counts when used, and its price becomes the average of what is on the shelf.",part_reuse_hint:"A used one is not gone: it waits until it is ready again and still counts as owned, so it is not bought again.",part_restock:"Adjust stock",parts_used_by:"Used by",restock_quantity_label:"Quantity bought",consumes_parts_label:"Consumes parts",task_parts_fleet_hint:"Battery quantities come from Battery Notes per device \u2014 nothing to link here.",shared_parts_other_objects:"Parts from other objects",shared_parts_help:"Several objects can share one stock. Completing this task takes from the owning object.",shared_part_unknown:"Unknown part",parts_load_failed:"Couldn't load this object's parts \u2014 the consumes-parts options are unavailable right now.",adopt_problem_button:"Adopt problem sensors",adopt_problem_title:"Adopt problem sensors",adopt_problem_hint:"Turn HA problem sensors (printer errors, filter warnings, low battery) into maintenance tasks that trigger while the problem is active and clear themselves when it resolves.",adopt_problem_none:"No problem sensors found that aren't already tracked.",adopt_problem_active:"active",adopt_problem_ok:"ok",adopt_problem_new_object:"(new)",adopt_object_hint:"Give several sensors the same object name and they become one object; type an existing object's name to add them there.",adopt_summary_title:"What adopting changes",adopt_summary_existing:'"{name}": tasks {before} \u2192 {after}',adopt_summary_totals:"Tasks: {tasks} \xB7 objects: {objects}",adopt_summary_totals_new:"Tasks: {tasks} \xB7 objects: {objects} ({new} new)",adopt_problem_adopt:"Adopt selected",adopt_problem_done:"Adopted {tasks} problem sensor(s)",adopt_problem_done_one:"Adopted 1 problem sensor",views_label:"Views",views_none:"\u2014 No view \u2014",views_manage:"Save / manage views",views_dialog_title:"Saved views",views_dialog_hint:"Save the current filters as a named view everyone can reuse.",views_name_placeholder:"View name",views_save_current:"Save current filters",views_none_yet:"No saved views yet.",close:"Close",trigger_hint_now:"The sensor reads {value} right now.",trigger_hint_above:"The task triggers once it rises above {target}.",trigger_hint_below:"It triggers once it falls below {target}.",trigger_hint_equals:"It triggers when it reads exactly {target}.",trigger_hint_not_equals:"It triggers when it reads anything but {target}.",trigger_hint_overlap:"These limits overlap: every reading triggers the task and it can never recover. Leave one of them empty.",trigger_hint_counter_delta:"Counts from the current reading ({value}): due at {due} (+{target}), and the count restarts after each completion.",trigger_hint_counter_delta_edit:"Counts usage since the last completion: due after +{target}; the count restarts after each completion.",trigger_hint_counter_abs:"The task becomes due once the sensor reaches {target}.",trigger_hint_runtime:"The task becomes due after {hours} h of accumulated on-time; the counter restarts after each completion.",trigger_hint_due_date:"The task becomes due {days} days before the date the sensor reports.",trigger_hint_due_date_one:"The task becomes due one day before the date the sensor reports.",trigger_hint_due_date_same_day:"The task becomes due on the date the sensor reports.",trigger_hint_due_date_now:"Reported date: {date}.",trigger_hint_state_change:"The task becomes due after {count} state change(s).",trigger_hint_state_change_to:"The task becomes due after {count} change(s) to \u201C{state}\u201D.",trigger_hint_state_now:"Current state: {value}.",adopt_problem_part:"Uses part: {name}",label_filter:"Label",all_labels:"All labels",filter_place:"Place",filter_place_all:"All places",settings_notify_scope:"Notify only for view",settings_notify_scope_all:"All tasks",settings_notify_scope_hint:"Only tasks matching the selected saved view's label/user filters send reminders. Status, sorting and grouping of the view are ignored here.",settings_notify_completed:"Completion notifications",settings_notify_completed_hint:`Household news when a task is completed, with the reason and who did it. "Automatic only" announces just the completions nobody made on the spot: sensor recovery, shopping-list check-off, an automation's service call. Sent to the household service only; quiet hours and the daily cap apply.`,settings_title_style:"Notification title style",settings_title_style_hint:"What appears as the notification's TITLE. Default keeps the per-status text (e.g. 'Maintenance overdue!'). Object name / Task name help when phone notifications stack.",settings_title_prefix:"Title prefix",settings_title_prefix_hint:"Put in front of every notification's title, with every title style, e.g. the home's name when your phone gets reminders from more than one Home Assistant. Empty = no prefix.",title_style_default:"Default (per-status title)",title_style_object_name:"Object name as title",title_style_task_name:"Task name as title",notify_completed_off:"Off",notify_completed_automatic:"Automatic completions only",notify_completed_all:"All completions",settings_notify_rule:"Your own notification rule",settings_notify_rule_hint:"Every notification also fires the event maintenance_supporter_notification (kind, status, object, task, reference numbers, priority, deep link, the payload). Route it with an automation \u2014 e.g. into Ticker, Telegram or Pushover.",settings_notify_event_only:"Only fire the event, send nothing myself",settings_notify_event_only_hint:"Your automation is the whole delivery. Rate limits, quiet hours and the daily cap still apply to when the event fires.",settings_notify_extra_data:"Extra notification data (template)",settings_notify_extra_data_hint:"JSON or YAML, Jinja allowed; merged into the notify call's data (your keys win). Variables: kind, status, priority, labels, notes, area_name, object_name, task_name, object_ref, task_ref, days_until_due, next_due, last_performed, responsible_user_id, sensor_entity_id, url, target, title, message. Test it with the Send test button.",card_saved_view:"Saved view",card_saved_view_none:"None",card_saved_view_help:"Applies the view's status, user, label and priority filters on top of the filters above. The view's sorting and grouping are panel display settings and are not applied on the card.",panel_card_tab:"Open on tab",panel_card_tab_default:"Remembered tab (as in the panel)",panel_card_view:"Open with saved view",panel_card_height:"Height",panel_card_height_help:"Empty = fill the screen below the card (panel view). Otherwise a CSS length such as 600px or 80vh for views with other cards.",panel_card_not_registered:"The Maintenance Supporter panel is not available \u2014 is the integration set up?",panel_card_load_failed:"The Maintenance Supporter panel could not be loaded \u2014 reload the page (after an update: clear the browser cache).",doc_part_none:"No documents linked to this part.",settings_templates_toggle_group:"Enable or disable all templates in this group",setups_button:"Suggested setups",setups_title:"Suggested setups (Beta)",setups_hint:"Devices of supported integrations whose consumable sensors can drive maintenance tasks. Adopting creates the object and wires each task to its sensor \u2014 it triggers when the consumable runs low and resolves itself after replacement.",setups_none:"No supported devices with unwired consumable sensors found.",setups_adopt:"Set up selected",setups_done:"{tasks} sensor-wired tasks created.",setups_done_one:"1 sensor-wired task created.",complete_parts_used:"Parts used this time",part_delete_confirm:"Delete part '{name}'? Its stock tracking, task links and any open buy reminder will be removed.",baseline_start_value:"Start reading (optional)",baseline_start_help:"Counting starts from this reading. Leave empty to count from the current value; enter the reading at the last service so usage since then already counts.",setups_baseline_hint:"reading at last service (optional)",baseline_start_help_edit:"Leave empty to keep the existing counting. Entering a value re-anchors the counting (e.g. the reading at the last service).",baseline_current_effective:"Currently effective start value: {value}",runtime_on_states:"Active states",runtime_on_states_help:"States that count as running \u2014 default: on. E.g. mowing, cleaning, printing. With an attribute selected, its values are matched instead.",runtime_max_session:"Max session runtime (seconds)",runtime_max_session_help:"A single run counts at most this many seconds \u2014 protects against a sensor stuck ON (lost connection, restart). Empty = no cap.",trend_approaching:"Heading toward the threshold",trend_easing:"Easing away from the threshold",split_select_hint:"Select a task to see its details here",setups_target_new:"Create new: {name}",setups_target_match:"{name} \u2014 matches: {reasons}",setups_reason_model:"model number",setups_reason_name:"name",setups_reason_area:"area",setups_reason_sibling:"same model on another device",setups_maybe_covered:'Probably there already as "{name}"',setups_already:"Already there: {names}",setups_reset_line:"Completing it also resets the counter in the integration (\u201C{button}\u201D)",setups_reset_enable:"\u2014 the button gets switched on for this",reset_offers_title:"Reset counters on completion",reset_offers_hint:"These tasks watch a counter the integration keeps itself. Connected, completing the task here also presses the integration's reset button \u2014 otherwise the counter keeps running and the task falls due again right away.",reset_offers_before:"Now: completing it leaves the counter in {integration} running",reset_offers_after:"Then: it also presses \u201C{button}\u201D",reset_offers_renamed:"Renamed since it was set up \u2014 check that this task is for this part",reset_offers_apply:"Connect resets",reset_offers_done:"{count} tasks now reset their counter on completion",reset_offers_done_one:"1 task now resets its counter on completion",setups_before_after:"Tasks on the object: {before} \u2192 {after}",setups_new_object_count:'New object "{name}" \xB7 tasks: {count}',schedule_preview_title:"Next dates",schedule_preview_ontime:"Assuming on-time completion.",schedule_preview_ends:"(series ends)",adopt_problem_responsible:"Responsible user for all adopted tasks (optional)",adopt_for_minutes_hint:"Only trigger once the problem has persisted this long \u2014 0 reacts to the first flicker.",adopt_problem_configure:"Configure",history_auto:"Automatic",battery_fleet_title:"Battery fleet",battery_fleet_none_low:"All batteries OK \u2014 nothing to replace.",battery_fleet_progress:"{n} to replace",battery_fleet_buy_now:"Buy now",battery_fleet_soon:"Needed soon",battery_fleet_soon_hint:"Predicted from the last replacement date \u2014 order ahead.",battery_fleet_mark_all:"Mark all replaced",battery_fleet_mark_one:"Mark this battery replaced",battery_fleet_offline:"offline",battery_fleet_no_sensor:"No sensor",battery_fleet_trigger_lost:"This task's sensor trigger was lost \u2014 it will not fire or auto-complete.",battery_fleet_repair:"Repair",battery_fleet_exclude:"Exclude from the fleet",battery_fleet_excluded:"Excluded",battery_fleet_include:"Track again",battery_fleet_all:"All tracked batteries",battery_fleet_all_hint:"Exclude a device here to drop it from the fleet before it ever reports low \u2014 a vacuum that recharges itself, or a phone that warns you on its own.",battery_fleet_add:"Add a battery",battery_fleet_add_hint:"Pick a battery sensor the automatic discovery missed \u2014 it joins the roster immediately.",battery_fleet_track_self:"Track self-charging batteries",battery_fleet_track_self_hint:"Phones, vacuums and other devices that recharge themselves appear as rechargeables \u2014 a low one asks for a charge, never for new cells.",battery_fleet_due_without_sensor:"Treat a passed forecast as due when a battery has no sensor",battery_fleet_due_without_sensor_hint:"Some devices report no battery level at all \u2014 Battery Notes only knows the type and the last replacement. Once the typical lifetime has passed, such a battery counts as low and the fleet task reminds you; marking it replaced resets the forecast.",battery_fleet_ask_cells:"Ask which cells went in when a battery is replaced",battery_fleet_ask_cells_hint:"A device takes whatever is in the drawer. Replaced then asks whether disposable or rechargeable cells of its size went in, books those and remembers them for the device. Battery Notes keeps its type; the shopping list and the forecast follow it.",battery_fleet_cells_question:"Which cells went in?",battery_fleet_cells_rechargeable:"rechargeable",battery_fleet_status_low:"Low",battery_fleet_status_soon:"Soon",battery_fleet_status_ok:"Healthy",battery_fleet_status_due:"Due",battery_fleet_predicted_on:"Expected around {date}",battery_fleet_predicted_typical:"Expected around {date} \u2014 {months} months typical for {type} ({source})",lifetime_source_default:"built-in default",lifetime_source_table:"built-in table",lifetime_source_learned:"learned from {n} replacements",lifetime_source_override:"your setting",lifetime_source_learned_device:"learned from this device's {n} replacements",lifetime_source_learned_model:"learned from {n} replacements on devices of this model",battery_fleet_predicted_trend:"Predicted from this battery's discharge trend: around {date} ({confidence})",battery_fleet_rechargeable:"Rechargeable: charge instead of replacing \u2014 never on the shopping list",battery_fleet_sort_name:"Sort by name",battery_fleet_sort_urgency:"Sort by urgency",battery_fleet_mark_recharged:"Mark as recharged",battery_fleet_charging:"Rechargeable spares",battery_fleet_ready:"{count} ready",battery_fleet_sparkline_hint:"Battery level over the last 30 days \u2014 dotted: projected until the low threshold",battery_fleet_filter_type:"Show only this battery type",battery_fleet_record_replacement:"The level jumped around {date} \u2014 record this replacement in Battery Notes",battery_fleet_total:"{n} batteries tracked",battery_fleet_setup_button:"Battery fleet",battery_fleet_setup_done:"Battery fleet set up \u2014 one task tracks all your batteries.",update_banner:"A newer version of Maintenance Supporter is on the server \u2014 reload to update the panel.",update_reload:"Reload",restart_pending_banner:"Maintenance Supporter was updated to {version}. Restart Home Assistant to finish the update.",restart_pending_error:"That did not work: Maintenance Supporter was updated to {version}, but Home Assistant has not been restarted since. Restart Home Assistant, then try again.",row_actions_banner:"Complete and Skip in task rows are now buttons. Prefer the old icons?",row_actions_keep:"Keep buttons",row_actions_back:"Back to icons",battery_fleet_forecast_overdue:"Predicted date passed \u2014 the battery still reports healthy. If you swapped it, record the replacement; otherwise the forecast was off.",cost_from_parts:"Use \u2248 {amount} from parts",cost_parts_booked:"Parts used \u2248 {amount} are booked automatically \u2014 enter only additional costs.",cost_parts_info:"Parts used \u2248 {amount} \u2014 counted when they were bought, not here.",cost_purchase_use_hint:"The price paid becomes the part's price \u2014 spare parts count when they are used.",history_parts_counted:"Parts: {amount}",history_parts_counted_hint:"Value of the parts used \u2014 counted as spending",history_parts_info:"Parts \u2248 {amount}",history_parts_info_hint:"Value of the parts used \u2014 information only; the money counted when they were bought",history_purchase_stock:"Bought for {amount} (counted when used)",dismiss:"Dismiss",gs_label:"Getting started \u2014 these hints retire as your setup grows",gs_setups_chip:"Suggested setups found {n} devices with pre-wired triggers",gs_setups_chip_one:"Suggested setups found 1 device with pre-wired triggers",gs_adopt_chip:"{n} problem sensors can become maintenance tasks",gs_adopt_chip_one:"1 problem sensor can become a maintenance task",gs_fleet_chip:"One click sets up the battery fleet",gs_reset_chip:"{n} tasks can reset their counter in the integration",gs_reset_chip_one:"1 task can reset its counter in the integration",cal_editor_window:"Default window",cal_editor_window_week:"Week (7 days)",cal_editor_window_fortnight:"Fortnight (14 days)",cal_editor_window_month:"Month (30 days, default)",cal_editor_window_year:"Year (365 days, empty days collapsed)",cal_editor_window_past_30:"Past 30 days (history)",cal_editor_window_past_90:"Past 90 days (history)",cal_editor_show_chips:"Show window chips inside the card",cal_editor_chips_hint:"Hide the chips when the card is embedded in a strategy view that already serves as the window selector.",cal_editor_show_user_filter:"Show user filter dropdown",cal_editor_default_user:"Default user filter",cal_editor_my_tasks:"My tasks (current user)",cal_editor_show_object_filter:"Show object filter dropdown",cal_editor_object_hint:'Pre-select one object via YAML: object_filter: "<object name>" \u2014 or a list of names to restrict the card to several objects.',object_history_section:"History (all tasks)",object_history_all_tasks:"All tasks",object_history_empty:"No entries in this range.",object_history_cap_note:"History keeps up to 500 entries per task \u2014 very old entries may be missing.",service_record_title:"Service record",service_record_print:"Service record (PDF)",date:"Date",service_record_entries:"entries",ref_number:"Reference number",print_options_title:"Print service record",print_layout:"Layout",print_layout_chronological:"Chronological",print_layout_by_task:"By task",print_include:"Include",print_inc_readings:"Readings",print_inc_parts:"Parts used",print_inc_photos:"Photos",print_inc_documents:"Linked documents",print_inc_doc_desc:"Document descriptions",print_inc_checklist:"Checklist",print_inc_notes:"Notes",print_inc_costs:"Cost and duration",print_inc_person:"Completed by",print_inc_refs:"Reference numbers",print_inc_bare:"Completions without details",print_inc_qr:"QR code per task",print_button:"Print",report_scan_hint:"Scan to open the task",completed_by:"Completed by",completed_via:"{person} (via {device})",date_from:"From",date_to:"To",phases_section:"Cycle phases (optional)",phases_hint:"Different work on one shared schedule \u2014 each completion moves to the next step (e.g. small service, small service, big service).",phase_add:"Add phase",phase_name:"Phase name",phase_sequence_label:"Cycle order",phase_sequence_add_step:"Add step",phase_current:"Current phase",phase_set:"Set as current",chart_history_fallback:"No long-term statistics for this entity \u2014 showing recorder state history (typically the last ~10 days)",chart_history_alarm:"Trigger view from recorder state history: 1 = alert state held for the hold time, 0 = fine (typically the last ~10 days)",chart_history_count:"Change count rebuilt from recorder state history since the last service (typically the last ~10 days)",prediction_cycles:"Learned from cycles",phase_require_override:"Override \u201CRequire on completion\u201D for this phase",history_add_past:"Add past completion",require_tag_scan:"Only complete by scanning the tag",require_tag_scan_help:"Proof of presence: Done is blocked on every surface until the NFC tag or QR code on the thing itself is scanned. Automations can pass 'via_tag_scan' to the complete service.",disallow_skip:"Don't allow skipping",disallow_skip_help:"The Skip action disappears from every surface, and the server refuses a skip from automations and voice too.",complete_when:"Done when (optional)",complete_when_state:"changes to",complete_when_help:"While the task is due, it completes itself when this entity changes to this state, for example when the washer's door opens.",complete_when_badge:"Done when {entity} changes to {state}",complete_when_any_time:"Also when it is not due: each time completes it and starts the next cycle",complete_when_badge_for:"for {minutes} min",complete_when_badge_any_time:"also when not due",no_notifications:"No notifications for this task",no_notifications_help:"No reminders for this task \u2014 no status notifications, repeats, lead-time reminders or bundles. It still shows on the dashboard and in its entities; the weekly digest still counts it.",require_tag_scan_hint:"This task completes only by scanning its NFC tag or QR code on the thing itself \u2014 saving here will be refused.",feat_beta_editor:"New look and task editor",feat_beta_editor_desc:"Home Assistant's own controls across the panel, tasks as rules like the automation editor, and a trace of each task. On by default; switch it off for the classic look.",beta_new_scratch:"Create new task",beta_new_scratch_desc:"Start with an empty task",beta_new_from_sensor:"Start from a sensor",beta_new_from_sensor_desc:"One of the object's sensors makes the task due",beta_new_from_template_desc:"A task from the template library",beta_new_copy:"Copy an existing task",beta_new_copy_desc:"Its settings, for this object",beta_new_search:"Search",beta_rules_add_rule:"Add rule",beta_rules_select_hint:"Select a row to change it.",beta_rules_every:"Every {interval}",beta_rules_once_on:"Once, on {date}",beta_rules_no_date:"Once, the date is still missing",beta_rules_manual:"No schedule: whenever it is needed",beta_rules_sensor_only:"Only when the sensor rule says so",beta_rules_safety_any:"Or every {interval}, whichever comes first",beta_rules_safety_all:"At the earliest after {interval}",beta_rules_due_soon:"Due soon {interval} before",beta_rules_above:"above {value}",beta_rules_below:"below {value}",beta_rules_for:"for {duration}",beta_rules_counter_delta:"goes up by {value} since the last completion",beta_rules_counter_reaches:"reaches {value}",beta_rules_changes_from:"changes from {state}",beta_rules_changes_to:"changes to {state}",beta_rules_changes:"changes state",beta_rules_times:"{n} times",beta_rules_runs_for:"has run for {duration}",beta_rules_date_before:"{interval} before the date it reports",beta_rules_date_on:"on the date it reports",beta_rules_all_of:"All conditions apply ({n})",beta_rules_any_of:"Any condition applies ({n})",beta_rules_pick_entity:"Pick a sensor",beta_rules_by_hand:"By hand: Complete, a tag or voice",beta_rules_nobody:"Nobody in particular",beta_rules_reminders_on:"Reminders as set in the settings",beta_rules_name_missing:"Give the task a name",beta_rules_by_type:"By type",beta_rules_by_device:"By device",beta_rules_replaces:"Replaces the current schedule",beta_rules_combines:"Joins the current sensor rule",beta_rules_adds_safety:"Adds a safety interval",beta_rules_no_device:"This object is not linked to a device or an area. Link it in the object's settings, or choose a rule under By type.",beta_rules_no_device_entities:"Its device has no entities to suggest.",beta_rules_done_when_suggest:"Done when it changes",beta_template_pick:"Tasks to create",beta_template_none:"Tick at least one task.",beta_template_create:"Create {n} tasks",beta_template_create_one:"Create 1 task",beta_trace:"Trace",beta_sensor_rule:"Sensor rule",beta_show_history:"Show more",beta_trace_off:"Traces are recorded while the new look is on. Completions and the rest of the history show either way.",beta_trace_current:"Current cycle",beta_trace_older:"Older cycle",beta_trace_newer:"Newer cycle",beta_trace_empty:"Nothing happened in this cycle yet.",beta_trace_load_failed:"Could not load the trace.",beta_trace_reminder:"Reminder sent: {status}",beta_trace_reminder_lead:"Heads-up sent: due in {interval}",beta_trace_cleared_done:"Reminder taken off the phones: done",beta_trace_cleared_status:"Reminder taken off the phones: no longer needed",beta_trace_triggered_for:"Triggered for {span}",beta_trace_cycle_self_ended:"Ended by itself",beta_trace_trigger_cleared_update:"Trigger ended: {installed} installed",beta_trace_trigger_cleared_value:"Trigger ended at {value}",beta_trace_trigger_cleared_state:"Trigger ended: now {state}",beta_trace_trigger_cleared:"Trigger ended",beta_trace_cleared_inert:"Reminder taken off the phones: paused or archived",beta_trace_snoozed:"Snoozed until {time}",beta_trace_dw_counted:"{entity} changed to {state}: counts as done",beta_trace_dw_waiting:"{entity} changed to {state}: waiting {duration}",beta_trace_dw_left_early:"{entity} left {state} too early: not counted",beta_trace_dw_not_due:"{entity} changed to {state}: not counted, the task was not due",beta_trace_dw_inert:"{entity} changed to {state}: not counted, the task is paused or archived",beta_trace_dw_recent:"{entity} changed to {state}: not counted, it was done moments ago",beta_trace_edited:"Task changed: {fields}",beta_trace_edited_other:"other settings",beta_trace_later:"{span} later",beta_trace_running:"Still running",beta_trace_after_due:"Done {span} after it was due",beta_trace_before_due:"Done before it was due",beta_trace_due_for:"Due for {span}",beta_trace_cycle_length:"Cycle: {span}",beta_trace_reminders:"{n} reminders",beta_trace_reminders_one:"1 reminder",beta_trace_snoozes:"Snoozed {n} times",beta_trace_snoozes_one:"Snoozed once",beta_trace_message:"Message",beta_trace_bundle:"Sent together with the other due tasks",beta_trace_download:"Download trace",beta_trace_activity:"Activity around this step",beta_trace_activity_none:"Nothing recorded around this time. Home Assistant keeps its history for 10 days unless set otherwise.",beta_rules_group_device:"This device",beta_rules_group_area_more:"More in the {area} area",beta_rules_group_area:"In the {area} area",beta_rules_no_area_entities:"Nothing in its area suggests a rule.",beta_filters_clear:"Clear filters",beta_search_tasks:"Search {count} tasks",beta_sort_by:"Sort by {sort}",beta_filters:"Filters",beta_filter_status:"Status"}});function q7(C){return C?.restart_pending&&C.installed_version?C.installed_version:null}var j7,I3=u(()=>{"use strict";j7="2.119.0"});function q3(C){C2.en=Object.assign({},C,C2.en??{})}function B1(C){let r=(C||N3).toLowerCase();return r.startsWith("pt")&&r.endsWith("br")?"pt-br":r.substring(0,2)}function T(C){return C?.language||"en"}function V(C,r,e){let t=B1(r);return C2[t]?.[C]??C2.en?.[C]??e??C}function h1(C){let r=B1(C);return r===N3||r in C2||!W7.has(r)}function r2(C){let r=B1(C);if(r===N3||r in C2||!W7.has(r))return Promise.resolve();let e=D3[r];return e!==void 0&&Date.now()-e<h8?Promise.resolve():(r in Q2||(Q2[r]=fetch(`${x8}/${r}.json?v=${j7}`).then(t=>t.ok?t.json():null).then(t=>{t?C2[r]=t:(delete Q2[r],D3[r]=Date.now())}).catch(()=>{delete Q2[r],D3[r]=Date.now()})),Q2[r])}var N3,j3,C2,Q2,D3,h8,W7,x8,$5=u(()=>{"use strict";I3();N3="en",j3=(()=>{let C=window;return C.__msLocales||(C.__msLocales={store:{},inflight:{}}),C.__msLocales.failedAt||(C.__msLocales.failedAt={}),C.__msLocales})(),C2=j3.store,Q2=j3.inflight,D3=j3.failedAt,h8=6e4;W7=new Set(["de","nl","fr","it","es","pt","pt-br","ru","uk","pl","cs","sv","zh","da","fi","nb","ja","hi","hu","ko","tr"]),x8="/maintenance_supporter_locales"});function U7(C){let r=C?.language;!r||typeof C?.loadBackendTranslation!="function"||n1.lang===r&&(n1.localize||n1.inflight)||(n1.lang=r,n1.localize=null,n1.inflight=C.loadBackendTranslation("exceptions",W3).then(e=>{n1.lang===r&&(n1.localize=e)}).catch(()=>{}).finally(()=>{n1.inflight=null}))}function z7(C,r,e){if(!r||!n1.localize||C&&C!==W3)return null;let t=`component.${W3}.exceptions.${r}.message`,H=n1.localize(t,e??void 0);return H&&H!==t?H:null}var W3,n1,U3=u(()=>{"use strict";W3="maintenance_supporter",n1=(()=>{let C=window;return C.__msBackendErrors??={lang:"",localize:null,inflight:null}})()});function V2(C){return C?.currency_symbol||_8}function X7(C,r){r.has("hass")&&Q3(C.hass?.locale,C.hass?.config?.country,C.hass?.config?.time_zone);let e=C.hass?.language;e&&!h1(e)&&r2(e).then(()=>{h1(e)&&C.requestUpdate()}),U7(C.hass)}function J7(C){let r=B1(C);return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN",da:"da-DK",fi:"fi-FI",nb:"nb-NO",ja:"ja-JP",hi:"hi-IN",pl:"pl-PL",cs:"cs-CZ",sv:"sv-SE","pt-br":"pt-BR",hu:"hu-HU",ko:"ko-KR",tr:"tr-TR"}[r]??"en-US"}function g8(C){t4.decimals=typeof C=="number"&&Number.isInteger(C)&&C>=0&&C<=3?C:0}function f8(){return t4.decimals??0}function T5(C){C&&C.currency_decimals!==void 0&&C.currency_decimals!==null&&g8(Number(C.currency_decimals))}function Q3(C,r,e){e!==void 0&&(s1.serverTimeZone=e||void 0),C&&(s1.date=C.date_format,s1.time=C.time_format,s1.number=C.number_format,s1.timeZone=C.time_zone,r!==void 0&&(s1.country=r||void 0))}function C4(C){switch(s1.number){case"comma_decimal":return["en-US","en"];case"decimal_comma":return["de","es","it"];case"space_comma":return["fr","sv","cs"];case"system":return;default:return J7(C)}}function E5(C,r,e,t,H="n"){return e===1?V(r,t):V(C,t).replace(`{${H}}`,f(e,t))}function z3(C,r){let e=`${String(C??"")}|${JSON.stringify(r)}`,t=G7.get(e);return t||(t=new Intl.NumberFormat(C,r),G7.set(e,t)),t}function F1(C,r){let e=`${C??""}|${JSON.stringify(r)}`,t=Q7.get(e);return t||(t=new Intl.DateTimeFormat(C,r),Q7.set(e,t)),t}function u2(C,r,e){let t={style:"unit",unit:r,unitDisplay:"long",maximumFractionDigits:2};try{return z3(C4(e),t).format(C)}catch{return`${f(C,e)} ${r}`}}function f(C,r,e){if(!Number.isFinite(C))return String(C);let t=typeof e=="number"?{minimumFractionDigits:e,maximumFractionDigits:e}:{maximumFractionDigits:2,...e};if(s1.number==="none"){let H=Math.pow(10,t.maximumFractionDigits??2);return String(Math.round(C*H)/H)}try{return z3(C4(r),t).format(C)}catch{return z3(void 0,t).format(C)}}function r4(C,r,e){return C<0?`${V("cost_kind_credit",e??"en")}: ${Y(-C,r,e)}`:Y(C,r,e)}function Y(C,r,e,t){let H=t??f8(),i=Math.abs(C)<.5/Math.pow(10,H)?0:C,L=f(i,e,H);return r?`${L} ${r}`:L}function v2(C,r,e){let t=f(C,e);return r?`${t} ${r}`:t}function A2(C){let r=s1.country,e=`${C??""}|${r??""}`,t=K7.get(e);if(t!==void 0)return t;let H=J7(C);if(r&&/^[A-Za-z]{2}$/.test(r)){let i=`${B1(C).split("-")[0]}-${r.toUpperCase()}`;try{F1(i,{}),H=i}catch{}}return K7.set(e,H),H}function G3(C,r,e){let t=s1.date;if(t==="DMY"||t==="MDY"||t==="YMD"){let[i,L,a]=R1(C,e).split("-");return t==="DMY"?`${a}/${L}/${i}`:t==="MDY"?`${L}/${a}/${i}`:`${i}-${L}-${a}`}let H=t==="system"?void 0:A2(r);return F1(H,{day:"2-digit",month:"2-digit",year:"numeric",timeZone:e}).format(C)}function P5(C,r,e=!1){let t=P1(),H={hour:"2-digit",minute:"2-digit",...e?{second:"2-digit"}:{}};switch(s1.time){case"12":return F1(A2(r),{...H,hour12:!0,timeZone:t}).format(C);case"24":return F1(A2(r),{...H,hour12:!1,timeZone:t}).format(C);case"system":return F1(void 0,{...H,timeZone:t}).format(C);default:return F1(A2(r),{...H,timeZone:t}).format(C)}}function B(C,r){if(!C)return"\u2014";try{let e=H4.exec(C);return e?G3(new Date(Date.UTC(+e[1],+e[2]-1,+e[3])),r,"UTC"):G3(new Date(J(C)),r,P1())}catch{return C}}function R5(C,r,e=!1){if(!C)return"\u2014";if(H4.test(C))return B(C,r);try{let t=new Date(J(C));return G3(t,r,P1())+" "+P5(t,r,e)}catch{return C}}function B5(C,r=Date.now()){let e=E1();return w5(r,e)===w5(r,P1())?"":V("ha_time_zone_hint",C).replace("{zone}",e)}function F5(C,r){if(C==null)return"\u2014";let e=r||"en";return C<0?`${Math.abs(C)} ${V("d_overdue",e)}`:C===0?V("today",e):i2(C,e)}function i2(C,r){let e=r||"en";return`${C} ${V(K3(C,e,{one:"day",few:"days_few",other:"days"}),e)}`}function K3(C,r,e){let t=C===1?"one":"other";try{let H=Y7.get(r);H||(H=new Intl.PluralRules(r),Y7.set(r,H)),t=H.select(C)}catch{}return t==="one"?e.one:t==="few"?e.few:e.other}function H2(C,r,e){return C==null?"\u2014":`${C} ${V("unit_"+(r||"days"),e)}`}function h2(C,r){return C==null?"\u2014":`${f(C,r,{maximumFractionDigits:1})} ${V("minutes_short",r)}`}function x1(C,r,e="long"){return F1(A2(r),{weekday:e,timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,1+C)))}function I5(C,r,e="long"){return F1(A2(r),{month:e,timeZone:"UTC"}).format(new Date(Date.UTC(2024,C,1)))}function V4(C,r,e="long"){return x1((C.getDay()+6)%7,r,e)}function i4(C,r,e="long"){return I5(C.getMonth(),r,e)}function L4(C,r){let e=C.schedule;if(C.schedule_type==="sensor_based"){let i=V("sensor_based",r),L=e&&e.kind==="interval"&&e.every?e.every:C.interval_days;return L?`${i} \xB7 ${H2(L,(e&&e.kind==="interval"?e.unit:C.interval_unit)||"days",r)}`:i}let t=e?.offset?` ${e.offset>0?"+":"\u2212"}${Math.abs(e.offset)}d`:"",H=e?.months?.length?` \xB7 ${[...e.months].sort((i,L)=>i-L).map(i=>I5(i-1,r,"short")).join(", ")}`:"";switch(e?.kind){case"weekdays":return((e.weekdays||[]).map(i=>x1(i,r,"short")).join(" & ")||"\u2014")+t;case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?V("ord_last",r):V("ord_"+e.nth,r)} ${x1(e.weekday,r,"long")}${t}${H}`;case"day_of_month":return e.day==null?"\u2014":(e.day===-1?V(e.business?"last_business_day_month":"last_day_month",r):`${V("day_word",r)} ${e.day}`)+t+H;case"calendar":return`${V("calendar_entity_label",r)}: ${C.schedule_entity_name||e.entity_id||"\u2014"}${t}`;case"one_time":return C.due_date?B(C.due_date,r):V("one_time",r);case"manual":return V("manual",r);case"interval":return H2(e.every,e.unit,r)}return C.schedule_type==="one_time"?C.due_date?B(C.due_date,r):V("one_time",r):C.schedule_type==="manual"?V("manual",r):C.schedule_type==="sensor_based"?V("sensor_based",r):C.interval_days!=null?H2(C.interval_days,C.interval_unit,r):"\u2014"}function o4(C,r){C.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:r},bubbles:!0,composed:!0}))}var _8,e4,s1,t4,G7,Q7,K7,H4,Y7,I1,a4,Z8,S8,D5,b=u(()=>{"use strict";y();D7();T1();$5();U3();e1();$5();_8="\u20AC";q3(N7);e4=window,s1=e4.__msDateTimePrefs??={},t4=e4.__msMoneyPrefs??={};G7=new Map,Q7=new Map;K7=new Map;H4=/^(\d{4})-(\d{2})-(\d{2})$/;Y7=new Map;I1=g`
  .field { display: flex; flex-direction: column; gap: 4px; }
  /* The label of ms-textfield / ms-date-field: every field label reads alike. */
  .field-label { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
  .field-input {
    padding: 8px 10px; font-size: 14px;
    background: var(--secondary-background-color, rgba(0,0,0,0.06));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color); border-radius: var(--ms-radius-6, 6px);
    font-family: inherit; width: 100%; box-sizing: border-box;
  }
  .field-input:focus { outline: none; border-color: var(--primary-color); }
`,a4=g`
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
    border-radius: var(--ms-radius-6, 6px);
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
      border-radius: var(--ms-radius-6, 6px);
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
`,Z8=g`
  .person-chip { display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 100%; vertical-align: middle; }
  .person-avatar {
    width: 22px; height: 22px; border-radius: 50%; flex: none;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--person-color, #546e7a); color: #fff;
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.02em; line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .person-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
  /* #232: everyone a shared task is for, the circles overlapping a little */
  .people-avatars { display: inline-flex; flex: none; }
  .people-avatars .person-avatar + .person-avatar {
    margin-inline-start: -5px;
    box-shadow: 0 0 0 1.5px var(--card-background-color, var(--primary-background-color, #fff));
  }
`,S8=g`
  .ref-chip {
    display: inline-block; font-size: 11.5px; font-weight: 500; line-height: 1; padding: 3px 6px;
    border-radius: var(--ms-radius-6, 6px); border: 1px solid var(--divider-color); color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums; letter-spacing: .02em; vertical-align: middle; white-space: nowrap;
    user-select: all;
  }
  /* #189: "· Residual waste, Paper" after a calendar-driven task's name. */
  .event-titles { color: var(--secondary-text-color); font-weight: 400; }
`,D5=g`
  ${Z8}
  ${S8}
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
  .status-badge ha-icon,
  .status-badge ha-svg-icon { --mdc-icon-size: 14px; margin-left: -1px; }

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

  /* #225: the objects inside an object — chips on its card that open them,
     and the objects table drawn as a tree. */
  .object-card-children { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .object-child-chip {
    display: inline-flex; align-items: center; gap: 5px;
    min-width: 0; max-width: 100%; min-height: 26px; padding: 2px 10px;
    font: inherit; font-size: 12px;
    border: 1px solid var(--divider-color); border-radius: 13px;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .object-child-chip:hover { border-color: var(--primary-color); color: var(--primary-color); }
  .object-child-chip.overdue::before {
    content: ""; flex: none; width: 7px; height: 7px; border-radius: 50%;
    background: var(--error-color);
  }
  .object-child-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .object-child-count { flex: none; font-size: 11px; color: var(--secondary-text-color); }
  .object-child-count::before { content: "· "; }
  .object-tree-toggle {
    display: inline-flex; align-items: center; justify-content: center;
    width: 24px; height: 24px; margin: -2px 2px -2px 0; padding: 0;
    vertical-align: middle;
    border: none; border-radius: 50%; background: transparent;
    color: var(--secondary-text-color); cursor: pointer;
  }
  .object-tree-toggle:hover { background: var(--secondary-background-color, rgba(0, 0, 0, 0.06)); color: var(--primary-text-color); }
  .object-tree-toggle ha-icon { --mdc-icon-size: 18px; }
  .object-tree-spacer { display: inline-block; width: 26px; }
  .object-tree-count {
    margin-left: 6px; padding: 0 7px; border-radius: var(--ms-radius-10, 10px);
    font-size: 12px; vertical-align: middle;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    color: var(--secondary-text-color);
  }
  .sub-objects-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  /* Right-aligned even when the heading wraps on a phone, so the menu below
     it, anchored to its right edge, stays on screen. */
  .sub-object-add-wrap { position: relative; margin-left: auto; }
  .sub-object-menu { font-weight: normal; }
  .sub-object-menu .popup-menu-item ha-icon { color: var(--secondary-text-color); flex: none; }
  .popup-menu.sub-object-menu-head,
  :host([narrow]) .popup-menu.sub-object-menu-head { right: 0; left: auto; min-width: 256px; }
  .objects-grid.sub-objects { padding-top: 0; }

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
    border-radius: var(--ms-radius-10, 10px);
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
    border-radius: var(--ms-radius-10, 10px);
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

  /* Beta UI: the sensor rule as a Home Assistant card (renderers/sparkline.ts
     renderSensorRule) — rows as HA's entities card draws them: a 40 px state
     badge, 16 px gap, the name at 14 px with the condition below it, the
     state on the right; a tap opens more-info. */
  .sensor-rule-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  .sensor-rule-title {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    font-size: 16px;
    font-weight: 500;
  }
  .sensor-rule-sub { font-size: 12px; font-weight: 400; color: var(--secondary-text-color); }
  .sensor-rows { display: flex; flex-direction: column; margin: 0 -8px; }
  .sensor-row {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 48px;
    padding: 4px 8px;
    border-radius: var(--ms-radius-10, 10px);
    cursor: pointer;
  }
  .sensor-row:hover { background: var(--secondary-background-color); }
  .sensor-row:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
  .sensor-badge { flex: none; }
  ha-icon.sensor-badge { width: 40px; display: flex; justify-content: center; color: var(--state-icon-color); }
  .sensor-info { flex: 1; min-width: 0; }
  .sensor-name { font-size: 14px; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sensor-cond { font-size: 12px; color: var(--secondary-text-color); overflow-wrap: anywhere; }
  .sensor-state { flex: none; max-width: 45%; font-size: 14px; color: var(--primary-text-color); text-align: end; overflow-wrap: anywhere; }
  /* The sensor's recent course (renderSensorTrend), like HA's tile trend graph. */
  .sensor-trend { flex: none; width: 88px; height: 28px; overflow: visible; }
  .sensor-trend-line { fill: none; stroke: var(--primary-color); stroke-width: 1.5; vector-effect: non-scaling-stroke; stroke-linejoin: round; }
  .sensor-trend-area { fill: var(--primary-color); opacity: 0.12; stroke: none; }
  .sensor-trend-limit { stroke: var(--error-color, #db4437); stroke-width: 1; stroke-dasharray: 3 3; vector-effect: non-scaling-stroke; opacity: 0.8; }
  .sensor-trend.past .sensor-trend-line { stroke: var(--error-color, #db4437); }
  .sensor-trend.past .sensor-trend-area { fill: var(--error-color, #db4437); }
  @media (max-width: 420px) { .sensor-trend { width: 56px; } }
  .sensor-rule-foot { display: flex; justify-content: flex-end; margin-top: 4px; }
  .sensor-rule-more { color: var(--primary-color); font-size: 14px; font-weight: 500; text-decoration: none; }
  .sensor-rule-more:hover { text-decoration: underline; }

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
  .row-actions ha-icon-button,
  .row-actions .row-icon-btn {
    display: inline-flex;
    --ha-icon-button-size: 32px;
    --mdc-icon-button-size: 32px;
    --mdc-icon-size: 18px;
  }
  /* A row's Complete / Skip: a plain button drawn like an ha-icon-button,
     which is far too heavy to create per row (_renderRowActions). */
  .row-icon-btn {
    align-items: center;
    justify-content: center;
    flex: none;
    box-sizing: border-box;
    width: var(--ha-icon-button-size, 48px);
    height: var(--ha-icon-button-size, 48px);
    padding: 0;
    border: none;
    border-radius: 50%;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .row-icon-btn:hover { background: color-mix(in srgb, currentColor 12%, transparent); }
  .row-icon-btn:active { background: color-mix(in srgb, currentColor 20%, transparent); }
  .row-icon-btn:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
  .row-icon-btn:disabled { opacity: 0.38; cursor: default; background: none; }

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
    border-radius: var(--ms-radius-10, 10px);
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
    border-radius: var(--ms-radius-10, 10px);
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

  /* Text in the theme's text colour, the warning colour on the icon, as HA's
     own warning alert does: orange on light orange read at 1.75:1. */
  .prediction-urgency-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    margin-bottom: 12px;
    border-radius: 8px;
    background: rgba(255, 152, 0, 0.15);
    color: var(--primary-text-color);
    font-size: 13px;
    font-weight: 500;
  }
  .prediction-urgency-banner ha-svg-icon {
    --mdc-icon-size: 18px;
    flex-shrink: 0;
    color: var(--warning-color, #ff9800);
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
  /* Mixed toward the text colour: plain warning orange on a light card read
     at 1.96:1 for the bold "~1 day" (4.5:1 wanted); the hue stays. */
  .prediction-value.exceeded { color: color-mix(in srgb, var(--error-color, #f44336) 70%, var(--primary-text-color, #212121)); font-weight: 700; }
  .prediction-value.urgent { color: color-mix(in srgb, var(--warning-color, #ff9800) 55%, var(--primary-text-color, #212121)); font-weight: 700; }

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
    .row-actions ha-icon-button,
    .row-actions .row-icon-btn {
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
       pushing the tasks down. Not to the right: reaching 8 px past the head
       there made the head wider than its card (clip check 2026-11-01). */
    .group-card { flex: 1 1 100%; min-width: 0; max-width: 100%; }
    .group-card-actions { gap: 8px; margin: -8px 0; }
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
`});function K2(C){if(!C)return[];let r=[],e=C.photo_doc_id;typeof e=="string"&&r.push(e);let t=C.photo_doc_ids;Array.isArray(t)&&r.push(...t);let H=[];for(let i of r){if(typeof i!="string")continue;let L=i.trim();if(!(!L||H.includes(L))&&(H.push(L),H.length>=10))break}return H}var Y2=u(()=>{"use strict"});function M4(){let C=new Uint8Array(4);return(globalThis.crypto??{getRandomValues:r=>r.map(()=>Math.floor(Math.random()*256))}).getRandomValues(C),Array.from(C,r=>r.toString(16).padStart(2,"0")).join("")}function D1(C){let r=C?.reading_values;if(!Array.isArray(r))return[];let e=[],t=new Set;for(let H of r){if(!H||typeof H!="object")continue;let i=H;typeof i.id!="string"||!i.id||t.has(i.id)||typeof i.value!="number"||!Number.isFinite(i.value)||(t.add(i.id),e.push({id:i.id,name:typeof i.name=="string"?i.name:i.id,unit:typeof i.unit=="string"?i.unit:null,value:i.value}))}return e}function l4(C){return C.filter(r=>r.type==="completed"&&(r.reading_value!=null||D1(r).length>0)).sort((r,e)=>r.timestamp.localeCompare(e.timestamp))}function d4(C){return l4(C??[]).map(r=>({timestamp:r.timestamp,values:D1(r)})).filter(r=>r.values.length>0)}function p4(C,r,e){let t;for(let H of C){if(e!==void 0){let L=J(H.timestamp);if(!isNaN(L)&&L>=e)break}let i=H.values.find(L=>L.id===r);i&&(t=i)}return t}function c4(C,r,e){let t=D1(r).find(i=>i.id===e);if(!t)return null;let H=null;for(let i of l4(C)){if(i.timestamp>=r.timestamp)break;let L=D1(i).find(a=>a.id===e);L&&(H=L.value)}return H==null?null:t.value-H}function m4(C){let r=new Set,e=new Set;for(let t of C){let H=(t.name||"").trim().toLowerCase();H&&(r.has(H)?e.add(t.id):r.add(H))}return e}function A4(C){let r=[],e=new Set,t=new Set;for(let H of C){let i=(H.name||"").trim();if(!(!i||e.has(H.id)||t.has(i.toLowerCase()))&&(e.add(H.id),t.add(i.toLowerCase()),r.push({id:H.id,name:i,unit:(H.unit||"").trim()||null}),r.length>=Y3))break}return r}var Y3,L2=u(()=>{"use strict";e1();Y3=20});async function N5(C,r,e){let t=await C.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:r,task_id:e});return Array.isArray(t?.history)?t.history:null}var X3=u(()=>{"use strict"});function J3(C,r,e,t){let H=e,i=n=>typeof n=="string"?n:null,L=n=>typeof n=="number"?n:null,a=i(H.timestamp)??"";return{entry_id:C,task_id:r,original_timestamp:a,type:i(H.type)||"completed",timestamp:a,notes:i(H.notes),cost:L(H.cost),duration:L(H.duration),completed_by:i(H.completed_by),used_parts:Array.isArray(H.used_parts)?H.used_parts:null,photo_doc_ids:K2(H),reading_value:L(H.reading_value),reading_values:D1(H),readings:t?.readings??[],task_type:t?.type??null,reading_unit:t?.reading_unit??null}}async function u4(C,r,e,t){let i=(await C.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:r})).tasks?.find(a=>a.id===e);if(!i)return null;let L=i.history?.find(a=>a.timestamp===t);return L||(L=(await N5(C,r,e))?.find(n=>n.timestamp===t)),L?J3(r,e,L,i):null}var e0=u(()=>{"use strict";Y2();L2();X3()});function N1(C,r=o2){return C?C.is_admin?!0:r.operatorWriteEnabled&&r.operatorIds.includes(C.id):!1}var o2,X2=u(()=>{"use strict";o2={operatorWriteEnabled:!1,operatorIds:[]}});function C0(){return window[t0]===!0}function v4(C){let r=window;if(r[t0]===C)return;r[t0]=C;let e=document.documentElement.style;for(let[t,H]of Object.entries(b8))C?e.setProperty(t,H):e.removeProperty(t);window.dispatchEvent(new CustomEvent(y8))}function k8(C){return!!customElements.get(C)}function V1(C){return C0()&&k8(C)}function _1(C){return C0()?C:void 0}function g1(C){return C0()?M:o`<div class="dialog-title">${C}</div>`}var t0,y8,b8,i1=u(()=>{"use strict";y();t0="__msBetaUi",y8="ms-beta-ui-changed",b8={"--ms-radius-6":"var(--ha-border-radius-md, 8px)","--ms-radius-10":"var(--ha-border-radius-lg, 12px)"}});var h4,x2,x4,J2,e5,t5,r0,j1,_2,C5=u(()=>{"use strict";h4={default_warning_days:[0,365],default_consumable_threshold:[1,90],battery_low_percent:[1,90],battery_recovered_percent:[20,100],battery_low_delay_minutes:[0,1440],archive_oneoff_days:[0,3650],delete_archived_oneoff_days:[0,3650],notify_due_soon_interval_hours:[0,720],notify_overdue_interval_hours:[0,720],notify_triggered_interval_hours:[0,720],max_notifications_per_day:[0,1e3],notification_bundle_threshold:[2,20],snooze_duration_hours:[1,168],warranty_reminder_days:[1,365],budget_alert_threshold:[10,100],currency_decimals:[0,3]},x2=[0,1440],x4=[1,1e4],J2=[0,365],e5=15,t5=[.1,.9],r0=[0,365],j1=[.01,1e4],_2=[.01,1e5]});function O8(C){let[r,e]=h4.default_warning_days,t=C?.general?.default_warning_days,H={...j5.features,...C?.features??{}};return{features:H,defaultWarningDays:typeof t=="number"&&Number.isFinite(t)&&t>=r&&t<=e?t:j5.defaultWarningDays,rowActionStyle:$8(C?.general?.row_action_style,C?.general?.row_action_style_set,H.beta_editor),access:{operatorWriteEnabled:C?.operator_write_enabled===!0,operatorIds:Array.isArray(C?.admin_panel_user_ids)?C.admin_panel_user_ids.filter(i=>typeof i=="string"):[]},budget:C?.budget??null,rowActionNoticePending:C?.general?.row_action_notice_pending===!0,refsInLists:C?.general?.ref_numbers_in_lists===!0,objectsTableColumns:Array.isArray(C?.objects_table_columns)?C.objects_table_columns:void 0,partsCostMode:h7(C?.budget?.parts_cost_mode),mirrorTodoDefault:Array.isArray(C?.general?.mirror_todo_default_entities)?C.general.mirror_todo_default_entities.filter(i=>typeof i=="string"&&i!==""):[]}}function $8(C,r,e){return r===!1&&e?"icons":w8.includes(C??"")?C:j5.rowActionStyle}function _4(){let C=window;return C.__msSettingsCache??={promise:null}}function M1(C){let r=_4();if(r.promise)return r.promise;let e=C.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(t=>{let H=O8(t);return v4(H.features.beta_editor),H}).catch(()=>(r.promise===e&&(r.promise=null),j5));return r.promise=e,e}function g4(){_4().promise=null}var w8,j5,r5=u(()=>{"use strict";i1();X2();C5();c2();w8=["buttons_compact","buttons","icons"];j5={features:{adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact",access:o2,budget:null,rowActionNoticePending:!1,refsInLists:!1,objectsTableColumns:void 0,partsCostMode:"purchase",mirrorTodoDefault:[]}});function P8(C){let r=C.replace(/_ids?$/,"").split("_").filter(Boolean);if(r.length===0)return C;let e=r.join(" ");return e.charAt(0).toUpperCase()+e.slice(1)}function R8(C,r){let e=E8[C];if(e){let t=V(e,r);if(t&&t!==e)return t}return P8(C)}function B8(C){let r=[...C.matchAll(/\['([^']+)'\]/g)].map(H=>H[1]),e=r.length?r[r.length-1]:void 0,t;return(t=C.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=C.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=C.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=C.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(C)?{field:e,rule:"required"}:(t=C.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(C)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(C)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function F8(C,r){let e=new Set(f4(r));return f4(C).every(t=>e.has(t))}function Z4(C,r,e){if(e=e??V("action_error",r),typeof C=="string")return C;if(typeof C!="object"||C===null)return e;let t=C,H=t.message||t.error?.message||"",i=t.code||t.error?.code||"",L=i?T8[i]:void 0,a=z7(t.translation_domain??t.error?.translation_domain,t.translation_key??t.error?.translation_key,t.translation_placeholders??t.error?.translation_placeholders);if(a)return a;if(!H&&!L)return e;let n=B8(H),d=n.field?R8(n.field,r):"",p=c=>V(c,r).replace("{field}",d).replace("{n}",n.param??"");switch(n.rule){case"too_long":return p("err_too_long");case"too_short":return p("err_too_short");case"value_too_high":return p("err_value_too_high");case"value_too_low":return p("err_value_too_low");case"required":return p("err_required");case"wrong_type":return p("err_wrong_type").replace("{type}",n.param??"");case"invalid_choice":return p("err_invalid_choice");case"invalid_value":return p("err_invalid_value");default:if(L){let c=V(L,r);return B1(r)==="en"&&H&&!F8(H,i)?`${c} (${H})`:c}return H||e}}var T8,E8,f4,S4=u(()=>{"use strict";b();U3();$5();T8={already_archived:"ws_err_already_archived",already_paused:"ws_err_already_paused",archived:"ws_err_archived",changed_since:"undo_changed",create_failed:"ws_err_create_failed",duplicate_failed:"ws_err_duplicate_failed",empty:"ws_err_empty",empty_csv:"ws_err_empty_csv",invalid_cursor:"ws_err_invalid_cursor",invalid_date:"ws_err_invalid_date",invalid_device:"ws_err_invalid_device",invalid_entity_slug:"ws_err_invalid_entity_slug",invalid_format:"ws_err_invalid_format",invalid_input:"ws_err_invalid_input",invalid_mirror_todo:"ws_err_invalid_mirror_todo",invalid_notify_service:"ws_err_invalid_notify_service",invalid_parent:"ws_err_invalid_parent",invalid_icon:"ws_err_invalid_icon",invalid_range:"ws_err_invalid_range",invalid_search_template:"ws_err_invalid_search_template",invalid_shopping_list_entity:"ws_err_invalid_shopping_list_entity",invalid_target:"ws_err_invalid_target",invalid_trigger_config:"ws_err_invalid_trigger_config",invalid_url:"ws_err_invalid_url",invalid_user:"ws_err_invalid_user",invalid_view:"ws_err_invalid_view",limit_reached:"ws_err_limit_reached",no_defaults:"ws_err_no_defaults",no_phases:"ws_err_no_phases",no_url:"ws_err_no_url",not_archived:"ws_err_not_archived",not_available:"ws_err_not_available",not_configured:"ws_err_not_configured",not_found:"ws_err_not_found",notify_service_not_found:"ws_err_notify_service_not_found",not_loaded:"ws_err_not_loaded",not_paused:"ws_err_not_paused",nothing_to_undo:"undo_nothing",replace_failed:"ws_err_replace_failed",self_link_device:"ws_err_self_link_device",too_early:"ws_err_too_early",too_large:"ws_err_too_large",too_many:"ws_err_too_many",too_many_views:"ws_err_too_many_views",unauthorized:"ws_err_unauthorized",unavailable:"ws_err_unavailable"},E8={entry_id:"object",name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_equals:"trigger_equals",trigger_not_equals:"trigger_not_equals",trigger_for_minutes:"trigger_for_minutes"};f4=C=>C.toLowerCase().split(/[^a-z0-9]+/).filter(r=>r.length>1)});async function F(C,r,e={}){e.busy?.(!0);try{let t=typeof r=="function"?await r():await C.hass.connection.sendMessagePromise(r);return e.reload&&await e.reload(),e.successToast&&e.onSuccess?.(e.successToast),t===void 0?null:t}catch(t){let H=e.lang||T(C.hass),i=await D8(C,t,H)??Z4(t,H,e.fallbackKey?V(e.fallbackKey,H):void 0);e.onError?.(i,t);return}finally{e.busy?.(!1)}}async function D8(C,r,e){let t=typeof r=="object"&&r!==null?r:{};if(!I8.has(t.code||t.error?.code||""))return null;try{let H=q7(await C.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}));return H?V("restart_pending_error",e).replace("{version}",H):null}catch{return null}}var I8,f1=u(()=>{"use strict";S4();b();I3();I8=new Set(["unknown_error","invalid_format","unknown_command"])});function y4(C){return C.object.parent_entry_id||null}function b4(C){return!C.object.archived&&!C.object.battery_fleet}function N8(C,r){let e=new Map(C.map(L=>[L.entry_id,L])),t=[],H=new Set([r]),i=e.get(r);for(;i;){let L=y4(i);if(!L||H.has(L))break;let a=e.get(L);if(!a)break;H.add(L),t.unshift(a),i=a}return t}function k4(C,r){return[...N8(C,r.entry_id),r].map(e=>e.object.name).join(" \u203A ")}function w4(C,r){let e=new Map;for(let i of C){let L=y4(i);L&&(e.has(L)||e.set(L,[]),e.get(L).push(i.entry_id))}let t=new Set,H=[...e.get(r)??[]];for(;H.length;){let i=H.pop();i===r||t.has(i)||(t.add(i),H.push(...e.get(i)??[]))}return t}var O4=u(()=>{"use strict"});var W,q5=u(()=>{"use strict";y();q();i1();W=class extends S{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}_onHaInput(e){e.stopPropagation(),this.value=e.target.value??"",this.dispatchEvent(new CustomEvent(e.type==="change"?"change":"input",{bubbles:!0,composed:!0,detail:{value:this.value}}))}render(){return!this.multiline&&V1("ha-input")?o`
        <ha-input class="ha-field"
          .label=${this.label}
          .value=${this.value??""}
          .type=${this.type}
          .placeholder=${this.placeholder}
          .hint=${this.helper??""}
          .required=${this.required}
          .disabled=${this.disabled}
          .min=${this.min}
          .max=${this.max}
          .step=${this.step}
          .pattern=${this.pattern}
          @input=${this._onHaInput}
          @change=${this._onHaInput}
        ></ha-input>`:o`
      <label class="field">
        ${this.label?o`<span class="label">${this.label}${this.required?o`<span class="req">*</span>`:M}</span>`:M}
        ${this.multiline?o`
        <textarea
          .value=${this.value??""}
          rows=${this.rows}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @change=${this._onInput}
        ></textarea>`:o`
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??M}
          min=${this.min??M}
          max=${this.max??M}
          pattern=${this.pattern??M}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?o`<span class="helper">${this.helper}</span>`:M}
      </label>
    `}};W.styles=g`
    :host { display: block; }
    .ha-field { display: block; width: 100%; }
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
      border-radius: var(--ms-radius-6, 6px);
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
      border-radius: var(--ms-radius-6, 6px);
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
  `,s([v()],W.prototype,"label",2),s([v()],W.prototype,"value",2),s([v()],W.prototype,"placeholder",2),s([v()],W.prototype,"type",2),s([v({type:Boolean})],W.prototype,"required",2),s([v({type:Boolean})],W.prototype,"disabled",2),s([v()],W.prototype,"step",2),s([v()],W.prototype,"min",2),s([v()],W.prototype,"max",2),s([v()],W.prototype,"pattern",2),s([v()],W.prototype,"helper",2),s([v({type:Boolean})],W.prototype,"multiline",2),s([v({type:Number})],W.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",W)});function j8(C){let e=B("2001-02-03",C).match(/\d+/g)||[],t=a=>e.findIndex(n=>Number(n)===a),H=t(2001),i=t(2),L=t(3);return H===0?"YMD":i>=0&&L>=0&&i<L?"MDY":"DMY"}function g2(C,r,e){if(C<1e3||C>9999||r<1||r>12||e<1||e>31)return null;let t=new Date(C,r-1,e);return t.getFullYear()!==C||t.getMonth()!==r-1||t.getDate()!==e?null:`${C}-${String(r).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function $4(C,r){let e=C.trim(),t;if(t=e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))return g2(+t[1],+t[2],+t[3]);if(t=e.match(/^(\d{4})$/))return g2(+t[1],1,1);if(t=e.match(/^(\d{1,2})[./](\d{4})$/))return g2(+t[2],+t[1],1);if(t=e.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))return g2(+t[3],+t[2],+t[1]);if(t=e.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)){let H=+t[1],i=+t[2],L=+t[3];return j8(r)==="MDY"?g2(L,H,i):g2(L,i,H)}return null}var T4=u(()=>{"use strict";b()});function q8(C,r){if(r)switch(C){case"date":return r.split("T")[0];case"time":return r.length===5?`${r}:00`:r;case"datetime":{let[e,t="00:00:00"]=r.split("T");return`${e} ${t.length===5?`${t}:00`:t}`}}}function W8(C,r){if(typeof r!="string"||!r)return"";switch(C){case"date":return r.slice(0,10);case"time":return r.slice(0,5);case"datetime":{let[e,t="00:00:00"]=r.split(" ");return`${e}T${t.length===5?`${t}:00`:t}`}}}var z,f2=u(()=>{"use strict";y();q();b();T4();z=class extends S{constructor(){super(...arguments);this.kind="date";this.label="";this.value="";this.clearable=!1;this.disabled=!1;this.required=!1;this.lang="en";this._typing=!1;this._typed="";this._typedInvalid=!1}_startTyping(){this._typed=this.value,this._typedInvalid=!1,this._typing=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input.typed")?.focus())}_commitTyped(){if(!this._typed.trim()){this._typing=!1;return}let e=$4(this._typed,this.lang);if(!e){this._typedInvalid=!0;return}this._typing=!1,this._typedInvalid=!1,this._emit(e)}_onTypedKey(e){e.key==="Enter"?(e.preventDefault(),this._commitTyped()):e.key==="Escape"&&(e.preventDefault(),this._typing=!1,this._typedInvalid=!1)}_selector(){switch(this.kind){case"date":return{date:{}};case"time":return{time:{no_second:!0}};case"datetime":return{datetime:{}}}}_onSelectorChange(e){e.stopPropagation(),this._emit(W8(this.kind,e.detail?.value))}_clear(){this._emit("")}_emit(e){e!==this.value&&(this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}})))}render(){return o`
      <div class="field">
        ${this.label?o`<span class="label">${this.label}${this.required?o`<span class="req">*</span>`:M}</span>`:M}
        <div class="row">
          ${this._typing?o`<input class="typed" type="text" inputmode="numeric" autocomplete="off"
                .value=${this._typed}
                placeholder=${B("1978-03-15",this.lang)}
                aria-invalid=${this._typedInvalid?"true":"false"}
                @input=${e=>{this._typed=e.target.value,this._typedInvalid=!1}}
                @keydown=${this._onTypedKey}
                @blur=${this._commitTyped} />`:o`<ha-selector
                .hass=${this.hass}
                .selector=${this._selector()}
                .value=${q8(this.kind,this.value)}
                .required=${this.required}
                .disabled=${this.disabled}
                @value-changed=${this._onSelectorChange}
              ></ha-selector>`}
          ${this.kind==="date"&&!this.disabled&&!this._typing?o`<button type="button" class="type-toggle" title=${V("date_type_toggle",this.lang)} aria-label=${V("date_type_toggle",this.lang)} @click=${this._startTyping}>
                <ha-icon icon="mdi:keyboard-outline"></ha-icon>
              </button>`:M}
          ${this.clearable&&this.value&&!this.disabled&&!this._typing?o`<button type="button" class="clear" title=${V("clear",this.lang)} aria-label=${V("clear",this.lang)} @click=${this._clear}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>`:M}
        </div>
        ${this._typedInvalid?o`<span class="helper invalid">${V("date_type_invalid",this.lang)}</span>`:this.helper?o`<span class="helper">${this.helper}</span>`:M}
      </div>
    `}};z.styles=g`
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
  `,s([v({attribute:!1})],z.prototype,"hass",2),s([v()],z.prototype,"kind",2),s([v()],z.prototype,"label",2),s([v()],z.prototype,"value",2),s([v()],z.prototype,"helper",2),s([v({type:Boolean})],z.prototype,"clearable",2),s([v({type:Boolean})],z.prototype,"disabled",2),s([v({type:Boolean})],z.prototype,"required",2),s([v()],z.prototype,"lang",2),s([l()],z.prototype,"_typing",2),s([l()],z.prototype,"_typed",2),s([l()],z.prototype,"_typedInvalid",2);customElements.get("ms-date-field")||customElements.define("ms-date-field",z)});function D(C,r){return V1("ha-alert")?o`<ha-alert alert-type=${C} class="notice notice-${C}">${r}</ha-alert>`:o`<div class=${C==="warning"?"error warning":"error"}>${r}</div>`}var q1=u(()=>{"use strict";y();i1()});var w,E4=u(()=>{"use strict";y();q();b();f1();O4();q5();f2();i1();q1();w=class extends S{constructor(){super(...arguments);this.objects=[];this.placesEnabled=!1;this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._place="";this._remindOnSite=!1;this._entryId=null;this._replacing=!1;this._oldDeviceId="";this._replaceDevice="keep"}get _lang(){return T(this.hass)}openCreate(e=""){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId=e,this._place="",this._remindOnSite=!1,this._replacing=!1,this._error="",this._open=!0}openReplace(e,t){this._entryId=e,this._replacing=!0,this._name=t.name||"",this._oldDeviceId=t.ha_device_id||"",this._haDeviceId="",this._replaceDevice="keep",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._haDeviceId=t.ha_device_id||"",this._parentEntryId=t.parent_entry_id||"",this._place=t.place||"",this._remindOnSite=!!t.remind_on_site,this._replacing=!1,this._error="",this._open=!0}async _replace(){if(this._loading||!this._entryId)return;let e={type:"maintenance_supporter/object/replace",entry_id:this._entryId,name:this._name.trim()||null};this._oldDeviceId?(this._replaceDevice==="other"&&(e.ha_device_id=this._haDeviceId),this._replaceDevice==="none"&&(e.ha_device_id=null)):this._haDeviceId&&(e.ha_device_id=this._haDeviceId);let t=await F(this,e,{busy:H=>{this._loading=H},fallbackKey:"save_error",onError:H=>{this._error=H}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-replaced",{detail:{entry_id:t?.entry_id,device_swap:t?.device_swap}})))}_deviceName(e){let H=this.hass?.devices?.[e];return H?.name_by_user||H?.name||e}_deviceSelector(e){return o`<ha-form
      .hass=${this.hass}
      .data=${{device:this._haDeviceId||void 0}}
      .schema=${[{name:"device",selector:{device:{}}}]}
      .computeLabel=${()=>e}
      @value-changed=${t=>this._haDeviceId=t.detail.value?.device||""}
    ></ha-form>`}_renderReplace(){let e=this._lang,t=(i,L)=>o`<label class="radio-row">
      <input
        type="radio"
        name="replace-device"
        .checked=${this._replaceDevice===i}
        @change=${()=>{this._replaceDevice=i}}
      />
      <span>${L}</span>
    </label>`,H=this._replaceDevice==="other"&&!this._haDeviceId;return o`
      <ha-dialog open .headerTitle=${_1(V("replace_object",e))} @closed=${this._close}>
        ${g1(V("replace_object",e))}
        <div class="content">
          ${this._error?D("error",this._error):M}
          <div class="hint">${V("replace_object_prompt",e)}</div>
          <ms-textfield
            label="${V("replace_name_label",e)}"
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          ${this._oldDeviceId?o`<div class="radio-group" role="radiogroup" aria-label=${V("replace_device_heading",e)}>
                <div class="textarea-label">${V("replace_device_heading",e)}</div>
                ${t("keep",V("replace_device_keep",e).replace("{device}",this._deviceName(this._oldDeviceId)))}
                ${this._replaceDevice==="keep"?o`<div class="hint">${V("replace_device_keep_hint",e)}</div>`:M}
                ${t("other",V("replace_device_other",e))}
                ${this._replaceDevice==="other"?o`${this._deviceSelector(V("replace_device_pick",e))}
                      <div class="hint">${V("replace_device_other_hint",e)}</div>`:M}
                ${t("none",V("replace_device_none",e))}
              </div>`:this._deviceSelector(V("link_device_optional",e))}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${V("cancel",e)}
          </ha-button>
          <ha-button @click=${this._replace} .disabled=${this._loading||H}>
            ${this._loading?V("saving",e):V("replace_object",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}_renderPlace(e){let t=!!this._place&&!this.hass?.states?.[this._place];return o`
      <ha-form
        .hass=${this.hass}
        .data=${{place:this._place||void 0}}
        .schema=${[{name:"place",selector:{entity:{domain:"zone"}}}]}
        .computeLabel=${()=>V("place_optional",e)}
        @value-changed=${H=>{this._place=H.detail.value?.place||"",this._place||(this._remindOnSite=!1)}}
      ></ha-form>
      ${t?o`<div class="place-missing">${V("place_missing",e)}</div>`:M}
      <label class="place-on-site ${this._place?"":"disabled"}">
        <input
          type="checkbox"
          .checked=${this._remindOnSite}
          ?disabled=${!this._place}
          @change=${H=>this._remindOnSite=H.target.checked}
        />
        <span>${V("remind_on_site",e)}</span>
      </label>
      ${this._place?o`<div class="place-hint">${V("remind_on_site_hint",e)}</div>`:M}
    `}async _save(){if(this._loading||!this._name.trim())return;this._error="";let e={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null,...this.placesEnabled?{place:this._place||null,remind_on_site:!!this._place&&this._remindOnSite}:{}},t=await F(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...e}:{type:"maintenance_supporter/object/create",...e},{busy:H=>{this._loading=H},fallbackKey:"save_error",onError:H=>{this._error=H}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved",{detail:{device_swap:t?.device_swap}})))}_parentChoices(){let e=this.objects||[],t=this._entryId?w4(e,this._entryId):new Set;return e.filter(H=>H.entry_id!==this._entryId&&!t.has(H.entry_id)&&(b4(H)||H.entry_id===this._parentEntryId)).map(H=>({entryId:H.entry_id,label:k4(e,H)})).sort((H,i)=>H.label.localeCompare(i.label))}_close(){this._open=!1}render(){if(!this._open)return o``;if(this._replacing)return this._renderReplace();let e=this._lang,t=this._entryId?V("edit_object",e):V("new_object",e);return o`
      <ha-dialog open .headerTitle=${_1(t)} @closed=${this._close}>
        ${g1(t)}
        <div class="content">
          ${this._error?D("error",this._error):M}
          <ms-textfield
            label="${V("name",e)}"
            required
            .value=${this._name}
            @input=${H=>this._name=H.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${V("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${H=>this._manufacturer=H.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${V("model_optional",e)}"
            .value=${this._model}
            @input=${H=>this._model=H.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${V("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${H=>this._serialNumber=H.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${V("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${H=>this._documentationUrl=H.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${V("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${H=>this._areaId=H.detail.value||""}
          ></ha-area-picker>
          ${this.placesEnabled?this._renderPlace(e):M}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${V("installation_date_optional",e)}"
            .value=${this._installationDate}
            @value-changed=${H=>this._installationDate=H.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${V("warranty_expiry_optional",e)}"
            .value=${this._warrantyExpiry}
            @value-changed=${H=>this._warrantyExpiry=H.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>V("link_device_optional",e)}
            @value-changed=${H=>this._haDeviceId=H.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?o`<label class="textarea-field">
                <span class="textarea-label">${V("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${H=>this._parentEntryId=H.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${V("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(H=>o`<option
                      value=${H.entryId}
                      ?selected=${this._parentEntryId===H.entryId}
                    >${H.label}</option>`)}
                </select>
                <span class="md-hint">${V("parent_object_hint",e)}</span>
              </label>`:M}
          <label class="textarea-field">
            <span class="textarea-label">${V("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${H=>this._notes=H.target.value}
            ></textarea>
            <span class="md-hint">${V("notes_markdown_hint",e)}</span>
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${V("cancel",this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?V("saving",this._lang):V("save",this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};w.styles=g`
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
      border: 1px solid var(--divider-color); border-radius: var(--ms-radius-6, 6px);
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
      border: 1px solid var(--divider-color); border-radius: var(--ms-radius-6, 6px);
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
  `,s([v({attribute:!1})],w.prototype,"hass",2),s([v({attribute:!1})],w.prototype,"objects",2),s([v({type:Boolean})],w.prototype,"placesEnabled",2),s([l()],w.prototype,"_open",2),s([l()],w.prototype,"_loading",2),s([l()],w.prototype,"_error",2),s([l()],w.prototype,"_name",2),s([l()],w.prototype,"_manufacturer",2),s([l()],w.prototype,"_model",2),s([l()],w.prototype,"_serialNumber",2),s([l()],w.prototype,"_areaId",2),s([l()],w.prototype,"_installationDate",2),s([l()],w.prototype,"_warrantyExpiry",2),s([l()],w.prototype,"_documentationUrl",2),s([l()],w.prototype,"_notes",2),s([l()],w.prototype,"_haDeviceId",2),s([l()],w.prototype,"_parentEntryId",2),s([l()],w.prototype,"_place",2),s([l()],w.prototype,"_remindOnSite",2),s([l()],w.prototype,"_entryId",2),s([l()],w.prototype,"_replacing",2),s([l()],w.prototype,"_oldDeviceId",2),s([l()],w.prototype,"_replaceDevice",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",w)});function U8(C){let r=(C||"").split(/\s+/).filter(Boolean);return r.length===0?"?":r.length===1?r[0][0].toUpperCase():(r[0][0]+r[r.length-1][0]).toUpperCase()}function z8(C){let r=0;for(let e of C)r=r*31+e.charCodeAt(0)>>>0;return P4[r%P4.length]}function R4(C){return C?{id:C.id,name:C.name,initials:C.initials||U8(C.name),color:C.color||z8(C.id)}:null}var P4,B4=u(()=>{"use strict";y();P4=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"]});var W5,F4=u(()=>{"use strict";B4();W5=class{constructor(r){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=r}updateHass(r){this.hass=r}async getUsers(r=!1){let e=Date.now();if(!r&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(r,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:r,task_id:e,user_id:t})}async getTasksByUser(r){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:r})).tasks}getUserName(r){return!r||!this.usersCache?null:this.usersCache.find(t=>t.id===r)?.name||null}getPerson(r){return R4(this.getUser(r))}getUser(r){return!r||!this.usersCache?null:this.usersCache.find(e=>e.id===r)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(r){return r?r===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}}});function d1(C){return`${C.entry_id??""}\0${C.part_id}`}function I4(C,r,e,t){let H=!!C.entry_id&&C.entry_id!==r,i=H?C.entry_id:r,L=e.find(p=>p.entry_id===i),a=(L?.parts||[]).find(p=>p.id===C.part_id)||null,n=H&&L?.object?.name||"",d=a?.name||V("shared_part_unknown",t);return{part:a,foreign:H,ownerName:n,label:n?`${d} (${n})`:d}}function D4(C,r,e,t){let{part:H,label:i}=I4(C,r,e,t),L=H&&H.stock!==null&&H.stock!==void 0?` (${v2(H.stock,H.unit,t)})`:"",a=H?.storage_location?` \u2014 ${H.storage_location}`:"";return`${f(C.quantity,t)}\xD7 ${i}${L}${a}`}function N4(C,r,e,t){let H=e.find(n=>n.entry_id===r),i=n=>n?.object.battery_fleet?{cost_mode:"purchase"}:{},L=(H?.parts||[]).map(n=>({...n,...i(H)})),a=new Set(L.map(n=>d1({part_id:n.id})));for(let n of C?.consumes_parts||[]){if(!n.entry_id||n.entry_id===r)continue;let d=d1(n);if(a.has(d))continue;a.add(d);let{part:p,ownerName:c}=I4(n,r,e,t);L.push({id:n.part_id,name:p?.name||V("shared_part_unknown",t),unit:p?.unit,stock:p?.stock??null,storage_location:p?.storage_location,cost:p?.cost??null,package_size:p?.package_size??null,cost_mode:p?.cost_mode??null,...i(e.find(A=>A.entry_id===n.entry_id)),entry_id:n.entry_id,owner_name:c})}return L}var U5=u(()=>{"use strict";b()});var H0,j4,q4=u(()=>{"use strict";H0=["sensor","binary_sensor","number","input_number","input_boolean","counter","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant","input_select","select","input_datetime","date","datetime","timer","update"],j4=["sensor"]});function a2(C){let r=(C??"").trim();if(r==="")return null;let e=Number(r.replace(",","."));return!Number.isFinite(e)||e<0?null:Math.round(e)}var z5=u(()=>{"use strict"});async function Q8(C,r,e,t){let H="",i=await F({hass:C},{type:"maintenance_supporter/task/undo",entry_id:r,task_id:e},{lang:t,onError:(L,a)=>{let n=G8[a?.code??""];H=n?V(n,t):L}});return i===void 0?{ok:!1,message:H}:{ok:!0,message:V(i?.action_ran?"undo_done_action_ran":"undo_done",t)}}function G5(C,r){let e=C?.already_recorded_seconds;return typeof e=="number"?V("completion_already_recorded",r).replace("{seconds}",String(e)):null}function Q5(C,r,e,t,H){let i=(L,a)=>C.dispatchEvent(new CustomEvent("hass-notification",{detail:a?{message:L,action:a,duration:1e4}:{message:L},bubbles:!0,composed:!0}));i(V("task_completed_named",t).replace("{task}",e.taskName),{text:V("undo",t),action:()=>{Q8(r,e.entryId,e.taskId,t).then(L=>{i(L.message),L.ok&&H()})}})}var G8,H5=u(()=>{"use strict";b();f1();G8={changed_since:"undo_changed",nothing_to_undo:"undo_nothing"}});function n2(C){let r=C?.quick_complete_defaults;return!!r&&typeof r=="object"&&!Array.isArray(r)}function K5(C){return n2(C)?{...C.quick_complete_defaults}:null}async function W4(C,r,e,t){let H={message:"",code:""},i=await F({hass:C},{type:"maintenance_supporter/task/quick_complete",entry_id:r,task_id:e,source:"panel"},{lang:t,fallbackKey:"action_error",onError:(a,n)=>{H={message:a,code:n?.code??""}}});if(i===void 0)return K8.has(H.code)?{result:"dialog"}:{result:"failed",message:H.message};let L=G5(i,t);return L?{result:"already",message:L}:{result:"done",undo:i?.undo===!0}}var K8,V5=u(()=>{"use strict";f1();H5();K8=new Set(["no_defaults","completion_details_required","tag_scan_required"])});var V0,Z2,i0=u(()=>{"use strict";V0=["notes","cost","duration","photo","user"],Z2={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"}});var Y8,X8,L0,U4=u(()=>{"use strict";Y8={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},X8="mdi:wrench-clock",L0=C=>C&&Y8[C]||X8});function i5(C,r){let e=C?.states?.[r]?.attributes?.friendly_name;return typeof e=="string"&&e?e:r}function Y5(C){return C?Array.isArray(C.entity_ids)&&C.entity_ids.length>0?[...C.entity_ids]:C.entity_id?[C.entity_id]:[]:[]}function o0(C){if(!(!C||C.type==="compound"))return Y5(C)[0]}function z4(C,r){let e=o0(r?.trigger_config),t=e?C?.states?.[e]?.attributes?.unit_of_measurement:void 0;return(typeof t=="string"?t:void 0)??r?.trigger_entity_info?.unit_of_measurement??""}function G4(C){return C?.trigger_config?.type==="state_change"}var a0=u(()=>{"use strict"});var n0,mH,Q4,K4=u(()=>{"use strict";n0=["low","normal","high"],mH=[...n0].reverse(),Q4=["round_robin","least_completed","random"]});function Y4(C,r){return C?.entities?.[r]?.platform==="maintenance_supporter"}function X4(C){return Object.keys(C?.entities||{}).filter(r=>r.startsWith("todo.")&&Y4(C,r))}function X5(C,r){return[...new Set(r.filter(e=>e&&!Y4(C,e)))].slice(0,5)}var J4=u(()=>{"use strict"});function e9(C){return Ce[C]??"mdi:calendar"}function He(C,r,e){return u2(C,re[r]??"day",e)}function J5(C){let r=parseFloat(C);return Number.isFinite(r)?r:null}function G(C,r){return Object.entries(r).reduce((e,[t,H])=>e.split(`{${t}}`).join(H),C)}function Ve(C,r){let e=r,t=()=>{let H=parseInt(C.intervalDays,10);return Number.isFinite(H)&&H>0?He(H,C.intervalUnit,e):null};switch(C.scheduleType){case"time_based":{let H=t();return H?G(V("beta_rules_every",e),{interval:H}):V("beta_rules_manual",e)}case"one_time":return C.dueDate?G(V("beta_rules_once_on",e),{date:B(C.dueDate,e)}):V("beta_rules_no_date",e);case"manual":return V("beta_rules_manual",e);case"weekdays":{let H=[...C.weekdays].sort((i,L)=>i-L).map(i=>x1(i,e,"short"));return`${V("recurrence_on_days",e)}: ${H.length?H.join(", "):"\u2014"}`}case"nth_weekday":{let H=C.nth==="-1"?V("ord_last",e):V(`ord_${C.nth}`,e);return`${V("nth_weekday",e)}: ${H} ${x1(parseInt(C.nthWeekday,10)||0,e,"long")}`}case"day_of_month":return`${V("day_of_month",e)}: ${C.domLastDay?V("recurrence_last_day",e):C.domDay}`;case"calendar":return`${V("calendar_entity_label",e)}: ${C.calendarEntity||"\u2014"}`;case"sensor_based":{let H=t();return H?G(V(C.triggerCombinator==="all"?"beta_rules_safety_all":"beta_rules_safety_any",e),{interval:H}):V("beta_rules_sensor_only",e)}default:return V(C.scheduleType,e)}}function ie(C,r){let e=[];C.scheduleType==="time_based"&&parseInt(C.intervalDays,10)>0&&e.push(V(C.intervalAnchor==="planned"?"anchor_planned":"anchor_completion",r));let t=parseInt(C.warningDays,10);return C.scheduleType!=="manual"&&Number.isFinite(t)&&t>0&&e.push(G(V("beta_rules_due_soon",r),{interval:u2(t,"day",r)})),e}function Le(C,r){let e=r;if(C.triggerType==="compound"){let a=C.compoundLogic==="OR"?"beta_rules_any_of":"beta_rules_all_of";return G(V(a,e),{n:f(C.compoundCount,e)})}if(!C.triggerEntityIds.length)return V("beta_rules_pick_entity",e);let t=[],H=parseInt(C.forMinutes,10),i=Number.isFinite(H)&&H>0?G(V("beta_rules_for",e),{duration:u2(H,"minute",e)}):"";switch(C.triggerType){case"threshold":{let a=J5(C.above),n=J5(C.below);a!==null&&t.push(G(V("beta_rules_above",e),{value:f(a,e)})),n!==null&&t.push(G(V("beta_rules_below",e),{value:f(n,e)})),t.length||t.push(V("threshold",e)),i&&t.push(i);break}case"counter":{let a=J5(C.targetValue),n=a===null?"\u2014":f(a,e);t.push(G(V(C.deltaMode?"beta_rules_counter_delta":"beta_rules_counter_reaches",e),{value:n}));break}case"state_change":{let a=C.fromState.trim(),n=C.toState.trim();a&&t.push(G(V("beta_rules_changes_from",e),{state:a})),n&&t.push(G(V("beta_rules_changes_to",e),{state:n})),!a&&!n&&t.push(V("beta_rules_changes",e));let d=parseInt(C.targetChanges,10);Number.isFinite(d)&&d>1&&t.push(G(V("beta_rules_times",e),{n:f(d,e)})),i&&t.push(i);break}case"runtime":{let a=J5(C.runtimeHours);t.push(G(V("beta_rules_runs_for",e),{duration:a===null?"\u2014":u2(a,"hour",e)}));break}case"due_date":{let a=parseInt(C.daysBefore,10);t.push(Number.isFinite(a)&&a>0?G(V("beta_rules_date_before",e),{interval:u2(a,"day",e)}):V("beta_rules_date_on",e));break}}let L=t.join(" \xB7 ");return C.triggerAttribute?`${L} (${C.triggerAttribute})`:L}function oe(C,r){let e=r.lang,t=[],H;if(C.completeWhenEntity&&C.completeWhenState.trim()){let L=r.entityName(C.completeWhenEntity);t.push(L),H=G(V("complete_when_badge",e),{entity:L,state:C.completeWhenState.trim()});let a=parseInt(C.completeWhenFor,10);Number.isFinite(a)&&a>0&&(H+=` \xB7 ${G(V("complete_when_badge_for",e),{minutes:f(a,e)})}`),C.completeWhenAnyTime&&(H+=` \xB7 ${V("complete_when_badge_any_time",e)}`)}else H=V("beta_rules_by_hand",e);let i=[];return C.quickOn&&i.push(V("quick_complete_label",e)),C.requiredCount>0&&i.push(`${V("require_on_completion",e)}: ${f(C.requiredCount,e)}`),C.checklistCount>0&&i.push(`${V("checklist",e)}: ${f(C.checklistCount,e)}`),C.partsCount>0&&i.push(`${V("consumes_parts_label",e)}: ${f(C.partsCount,e)}`),C.requireTagScan&&i.push(V("require_tag_scan",e)),C.allowSkip||i.push(V("disallow_skip",e)),{text:H,chips:t,badges:i}}function t9(C,r){let e=r.lang,t=[];t.push({id:"task",icon:"mdi:clipboard-text-outline",text:C.name.trim()||V("beta_rules_name_missing",e),chips:[],badges:[C.typeLabel,...C.enabled?[]:[V("disabled",e)]],removable:!1});let H=C.scheduleType==="sensor_based";if(t.push({id:"schedule",icon:e9(C.scheduleType),text:Ve(C,e),chips:[],badges:ie(C,e),removable:H?parseInt(C.intervalDays,10)>0:C.scheduleType!=="manual"}),H){let n=C.triggerType==="compound"?C.compoundEntityIds:C.triggerEntityIds;t.push({id:"trigger",icon:s0[C.triggerType]??"mdi:gauge",text:Le(C,e),chips:[...new Set(n)].map(d=>r.entityName(d)),badges:C.triggerType!=="compound"&&C.triggerEntityIds.length>1?[V(C.entityLogic==="all"?"entity_logic_all":"entity_logic_any",e)]:[],removable:!0})}let i=oe(C,r);t.push({id:"completion",icon:"mdi:check-circle-outline",text:i.text,chips:i.chips,badges:i.badges,removable:!1});let L=C.pool.length>=2&&C.rotation?[V(`rotation_${C.rotation}`,e)]:[],a;return C.responsibleUserId?a=`${V("responsible_user",e)}: ${r.userName(C.responsibleUserId)}`:C.pool.length?a=`${V("task_shared_with",e)}: ${C.pool.map(n=>r.userName(n)).join(", ")}`:a=V("beta_rules_nobody",e),t.push({id:"people",icon:"mdi:account-multiple",text:a,chips:[],badges:L,removable:!1}),t.push({id:"notifications",icon:C.notifyEnabled?"mdi:bell-ring-outline":"mdi:bell-off-outline",text:C.notifyEnabled?V("beta_rules_reminders_on",e):V("no_notifications",e),chips:C.mirrorLists.map(n=>r.entityName(n)),badges:[],removable:!1}),t}function C9(C){let r=C.scheduleType==="sensor_based",e=parseInt(C.intervalDays,10)>0,t=[];for(let H of ee){if(H===C.scheduleType)continue;let i;if(r)if(H==="time_based"){if(e)continue;i="safety"}else i="replace";else i=C.scheduleType==="manual"?"set":"replace";t.push({kind:"schedule",value:H,icon:e9(H),effect:i})}for(let H of te){if(r&&H==="compound")continue;let i;r?i="combine":i=C.scheduleType==="time_based"||C.scheduleType==="manual"?"set":"replace",t.push({kind:"trigger",value:H,icon:s0[H],effect:i})}return t}function M0(C){let r={entityId:C.entityId,name:C.name},e=H=>({...r,target:"trigger",triggerType:H,icon:s0[H]}),t={...r,target:"done_when",icon:"mdi:check-circle-outline"};if(C.domain==="sensor")return C.deviceClass==="timestamp"||C.deviceClass==="date"?[e("due_date")]:C.numeric?le.has(C.stateClass??"")?[e("counter"),e("threshold")]:C.deviceClass==="duration"?[e("threshold"),e("counter")]:[e("threshold")]:[e("state_change"),t];if(C.domain==="counter")return[e("counter")];if(C.domain==="update")return[e("state_change")];if(C.domain==="number"||C.domain==="input_number")return[e("threshold")];if(ae.has(C.domain)){let H=[];return Me.has(C.deviceClass??"")&&H.push(t),H.push(e("state_change")),(ne.has(C.domain)||se.has(C.deviceClass??""))&&H.push(e("runtime")),H.includes(t)||H.push(t),H}return de.has(C.domain)?[e("state_change"),t]:[]}function r9(C,r){let e=C.devices??{},t=r.areaId||(r.deviceId?e[r.deviceId]?.area_id:null)||null,H=a=>a.area_id||(a.device_id?e[a.device_id]?.area_id:null)||null,i=[];for(let[a,n]of Object.entries(C.entities??{})){if(n.platform===r.ownPlatform||n.hidden)continue;let d;if(r.deviceId&&n.device_id===r.deviceId)d="device";else if(t&&H(n)===t)d="area";else continue;let p=C.states?.[a];if(!p)continue;let c=p.attributes??{};i.push({entityId:a,name:typeof c.friendly_name=="string"?c.friendly_name:a,domain:a.split(".")[0],deviceClass:typeof c.device_class=="string"?c.device_class:void 0,stateClass:typeof c.state_class=="string"?c.state_class:void 0,numeric:p.state!==""&&Number.isFinite(Number(p.state))||typeof c.unit_of_measurement=="string",group:d,secondary:!!n.entity_category})}let L=a=>a.group==="device"?0:1;return i.sort((a,n)=>L(a)-L(n)||Number(a.secondary)-Number(n.secondary)||a.name.localeCompare(n.name)),i.map(({secondary:a,...n})=>n).filter(a=>M0(a).length>0)}var J8,ee,te,Ce,s0,re,ae,ne,se,Me,le,de,H9=u(()=>{"use strict";b();J8=["weekdays","nth_weekday","day_of_month","calendar"],ee=["time_based",...J8,"one_time"],te=["threshold","counter","state_change","runtime","due_date","compound"],Ce={time_based:"mdi:calendar-sync",weekdays:"mdi:calendar-week",nth_weekday:"mdi:calendar-today",day_of_month:"mdi:calendar-month",calendar:"mdi:calendar-star",one_time:"mdi:calendar-check",manual:"mdi:gesture-tap",sensor_based:"mdi:calendar-sync"},s0={threshold:"mdi:gauge",counter:"mdi:counter",state_change:"mdi:state-machine",runtime:"mdi:timer-outline",due_date:"mdi:calendar-alert",compound:"mdi:set-center"};re={days:"day",weeks:"week",months:"month",years:"year"};ae=new Set(["binary_sensor","input_boolean","switch","fan","light","lock","cover","valve","siren"]),ne=new Set(["switch","fan","light","valve","input_boolean"]),se=new Set(["running","power","plug","heat","cold","moving","vibration"]),Me=new Set(["door","opening","window","garage_door","lock","running","moving","vibration","occupancy","presence"]),le=new Set(["total","total_increasing"]),de=new Set(["select","input_select","vacuum","lawn_mower","climate","water_heater","media_player","alarm_control_panel","event"])});var V9,i9=u(()=>{"use strict";y();V9=g`
  ha-dialog.beta-dialog {
    --mdc-dialog-min-width: min(1100px, calc(100vw - 32px));
    --mdc-dialog-max-width: min(1100px, calc(100vw - 32px));
    --ha-dialog-width-md: min(1100px, calc(100vw - 32px));
    --ha-dialog-width-lg: min(1100px, calc(100vw - 32px));
  }
  .beta-content {
    min-width: 0;
  }
  .rules-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
    column-gap: 16px;
    align-items: start;
  }
  .rules-layout > * {
    grid-column: 1;
    min-width: 0;
  }
  /* The rows' spacing is a margin, not a row-gap: the sidebar spans 60 grid
     rows, and every empty one kept its 8 px gap. That was 470 px of nothing
     under the rows, and the dialog's body scrolled beside the sidebar's own
     scrollbar. */
  .rules-layout > :not(.rules-sidebar) {
    margin-bottom: 8px;
  }
  .rules-layout > .rules-sidebar {
    grid-column: 2;
    grid-row: 1 / span 60;
    position: sticky;
    top: 0;
  }
  @media (max-width: 870px) {
    .rules-layout {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      row-gap: 8px;
    }
    .rules-layout > :not(.rules-sidebar) {
      margin-bottom: 0;
    }
    /* Below its row it scrolls with the rows: stuck to the top, it covered
       the rows under it (tablet portrait, phone held sideways). */
    .rules-layout > .rules-sidebar {
      position: static;
    }
    .rules-layout > .rules-sidebar:not(.open) {
      display: none;
    }
  }
  .rules-group-title {
    margin: 12px 0 0;
    font-size: 18px;
    font-weight: 400;
    line-height: 26px;
    color: var(--primary-text-color);
  }
  .rule-row {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 48px;
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    background: var(--card-background-color, #fff);
    box-sizing: border-box;
  }
  .rule-row.selected {
    border: 2px solid var(--primary-color);
  }
  .rule-main {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 8px 6px 14px;
    border: 0;
    background: none;
    color: var(--primary-text-color);
    font: inherit;
    text-align: start;
    cursor: pointer;
    border-radius: 12px;
  }
  .rule-main:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
  .rule-main > ha-icon {
    flex: none;
    color: var(--secondary-text-color);
  }
  .rule-text {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    min-width: 0;
    font-size: 14px;
    line-height: 20px;
  }
  .rule-sentence {
    overflow-wrap: anywhere;
  }
  .rule-chip {
    display: inline-flex;
    align-items: center;
    height: 26px;
    padding: 0 10px;
    border-radius: 8px;
    background: var(--secondary-background-color, #e6e6e6);
    color: var(--primary-text-color);
    font-size: 13px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rule-badge {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }
  .rule-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 10px;
    width: 100%;
  }
  .rule-remove {
    flex: none;
    --ha-icon-button-size: 40px;
    --mdc-icon-button-size: 40px;
    color: var(--secondary-text-color);
  }
  .rule-add {
    justify-self: start;
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 16px 0 10px;
    border: 0;
    border-radius: 9999px;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .rule-add:focus-visible {
    outline: 2px solid var(--primary-text-color);
    outline-offset: 2px;
  }
  /* The head stays put and only the body scrolls: a sticky head covered
     the first controls whenever one was scrolled into view. */
  .rules-sidebar {
    border: 2px solid var(--primary-color);
    border-radius: 16px;
    background: var(--card-background-color, #fff);
    padding: 4px 0 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    max-height: 70vh;
    overflow: hidden;
  }
  .sidebar-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 4px 14px 14px;
  }
  /* In the scrolling column nothing may shrink: the tabs (overflow hidden,
     so no content minimum) were squeezed to nothing under a long list. */
  .sidebar-body > * {
    flex-shrink: 0;
  }
  @media (max-width: 870px) {
    .rules-sidebar {
      max-height: none;
    }
  }
  .rules-sidebar:not(.open) {
    border-style: dashed;
    border-color: var(--divider-color);
  }
  .rules-sidebar .section-title {
    display: none;
  }
  .rules-sidebar .form-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .sidebar-head {
    flex: none;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 14px 0 6px;
    border-bottom: 1px solid var(--divider-color);
  }
  .sidebar-title {
    flex: 1 1 auto;
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
  }
  .sidebar-hint {
    padding: 16px 18px;
    color: var(--secondary-text-color);
    font-size: 14px;
  }
  .add-tabs {
    display: flex;
    height: 32px;
    border-radius: 9999px;
    overflow: hidden;
    background: var(--secondary-background-color, #e6e6e6);
  }
  .add-tabs button {
    flex: 1 1 0;
    border: 0;
    background: transparent;
    color: var(--secondary-text-color);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .add-tabs button[aria-selected="true"] {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .add-group {
    margin-top: 4px;
    font-size: 13px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }
  .add-choice {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 44px;
    padding: 6px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
    text-align: start;
    cursor: pointer;
  }
  .add-choice:hover {
    border-color: var(--primary-color);
  }
  .add-choice > ha-icon {
    flex: none;
    color: var(--secondary-text-color);
  }
  .add-choice-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .add-choice-note {
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .device-entity {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 0;
    border-top: 1px solid var(--divider-color);
  }
  .device-entity-name {
    font-size: 14px;
    font-weight: 500;
  }
  .device-entity-choices {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .device-entity-choices .add-choice {
    width: auto;
    min-height: 36px;
    border-radius: 9999px;
  }
  .chooser {
    display: flex;
    flex-direction: column;
  }
  .chooser-item {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 60px;
    padding: 8px 12px;
    border: 0;
    border-bottom: 1px solid var(--divider-color);
    background: none;
    color: var(--primary-text-color);
    font: inherit;
    text-align: start;
    cursor: pointer;
  }
  .chooser-item:last-child {
    border-bottom: 0;
  }
  .chooser-item:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
  .chooser-item > ha-icon {
    flex: none;
    color: var(--secondary-text-color);
  }
  .chooser-text {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .chooser-title {
    font-size: 14px;
    line-height: 20px;
  }
  .chooser-desc {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }
  .chooser-search {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 12px;
    margin-bottom: 8px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
  }
  .chooser-group {
    padding: 12px 12px 4px;
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }
  .chooser-empty {
    padding: 16px 12px;
    color: var(--secondary-text-color);
  }
`});var W1,e3=u(()=>{"use strict";y();q();b();W1=class extends S{constructor(){super(...arguments);this.value="";this.lang="en";this._credit=!1;this._amount=""}willUpdate(e){if(!e.has("value"))return;let t=(this.value??"").trim();if(t===this._signed())return;let H=parseFloat(t);if(t===""||Number.isNaN(H)){this._amount="",this._credit=!1;return}this._credit=H<0,this._amount=String(Math.abs(H))}_signed(){let e=this._amount.trim();return e===""?"":this._credit?`-${e}`:e}_emit(){this.value=this._signed(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setCredit(e){this._credit!==e&&(this._credit=e,this._emit())}_onInput(e){let t=e.target.value;t.startsWith("-")&&(this._credit=!0),this._amount=t.replace(/^-+/,""),this._emit()}render(){let e=this.lang;return o`
      <div class="wrap">
        <div class="sign" role="group">
          <button type="button" class="kind cost ${this._credit?"":"on"}" aria-pressed=${String(!this._credit)}
            @click=${()=>this._setCredit(!1)}>${V("cost",e)}</button>
          <button type="button" class="kind credit ${this._credit?"on":""}" aria-pressed=${String(this._credit)}
            @click=${()=>this._setCredit(!0)}>${V("cost_kind_credit",e)}</button>
        </div>
        <input type="number" step="0.01" min="0" inputmode="decimal" class="field-input amount"
          .value=${this._amount} @input=${this._onInput} />
      </div>
      ${this._credit?o`<div class="hint">${V("cost_credit_hint",e)}</div>`:M}
    `}};W1.styles=[I1,g`
      :host { display: block; }
      .wrap { display: flex; gap: 8px; align-items: stretch; }
      .sign {
        display: inline-flex;
        flex: none;
        border: 1px solid var(--divider-color);
        border-radius: var(--ms-radius-6, 6px);
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
    `],s([v()],W1.prototype,"value",2),s([v()],W1.prototype,"lang",2),s([l()],W1.prototype,"_credit",2),s([l()],W1.prototype,"_amount",2);customElements.get("ms-cost-input")||customElements.define("ms-cost-input",W1)});function Z1(C,r){return V1("ha-expansion-panel")?o`
      <ha-expansion-panel class=${C.cls??""} outlined .expanded=${!!C.open}
        @expanded-changed=${e=>{e.target===e.currentTarget&&C.onToggle?.(e.detail.expanded)}}>
        <div slot="header" class=${C.headerCls??"collapsible-header"}>${C.header}</div>
        ${r}
      </ha-expansion-panel>`:o`<details class=${C.cls??""} ?open=${!!C.open}
    @toggle=${C.onToggle?e=>C.onToggle(e.target.open):M}><summary class=${C.headerCls??M}>${C.header}</summary>${r}</details>`}var l0=u(()=>{"use strict";y();i1()});var S1,L5,S2,o5=u(()=>{S1={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},L5=C=>(...r)=>({_$litDirective$:C,values:r}),S2=class{constructor(r){}get _$AU(){return this._$AM._$AU}_$AT(r,e,t){this._$Ct=r,this._$AM=e,this._$Ci=t}_$AS(r,e){return this.update(r,e)}update(r,e){return this.render(...e)}}});var TH,t3,pe,L9,d0=u(()=>{e2();({I:TH}=a7),t3=C=>C.strings===void 0,pe={},L9=(C,r=pe)=>C._$AH=r});var o9,a9=u(()=>{e2();o5();d0();o9=L5(class extends S2{constructor(C){if(super(C),C.type!==S1.PROPERTY&&C.type!==S1.ATTRIBUTE&&C.type!==S1.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!t3(C))throw Error("`live` bindings can only contain a single expression")}render(C){return C}update(C,[r]){if(r===H1||r===M)return r;let e=C.element,t=C.name;if(C.type===S1.PROPERTY){if(r===e[t])return H1}else if(C.type===S1.BOOLEAN_ATTRIBUTE){if(!!r===e.hasAttribute(t))return H1}else if(C.type===S1.ATTRIBUTE&&e.getAttribute(t)===r+"")return H1;return L9(C),r}})});var n9=u(()=>{a9()});function ce(C){this._$AN!==void 0?(C3(this),this._$AM=C,s9(this)):this._$AM=C}function me(C,r=!1,e=0){let t=this._$AH,H=this._$AN;if(H!==void 0&&H.size!==0)if(r)if(Array.isArray(t))for(let i=e;i<t.length;i++)a5(t[i],!1),C3(t[i]);else t!=null&&(a5(t,!1),C3(t));else a5(this,C)}var a5,C3,s9,Ae,r3,M9=u(()=>{d0();o5();o5();a5=(C,r)=>{let e=C._$AN;if(e===void 0)return!1;for(let t of e)t._$AO?.(r,!1),a5(t,r);return!0},C3=C=>{let r,e;do{if((r=C._$AM)===void 0)break;e=r._$AN,e.delete(C),C=r}while(e?.size===0)},s9=C=>{for(let r;r=C._$AM;C=r){let e=r._$AN;if(e===void 0)r._$AN=e=new Set;else if(e.has(C))break;e.add(C),Ae(r)}};Ae=C=>{C.type==S1.CHILD&&(C._$AP??=me,C._$AQ??=ce)},r3=class extends S2{constructor(){super(...arguments),this._$AN=void 0}_$AT(r,e,t){super._$AT(r,e,t),s9(this),this.isConnected=r._$AU}_$AO(r,e=!0){r!==this.isConnected&&(this.isConnected=r,r?this.reconnected?.():this.disconnected?.()),e&&(a5(this,r),C3(this))}setValue(r){if(t3(this._$Ct))this._$Ct._$AI(r,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=r,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}});var p0,y2,l9=u(()=>{e2();M9();o5();p0=new WeakMap,y2=L5(class extends r3{render(C){return M}update(C,[r]){let e=r!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=r,this.ht=C.options?.host,this.rt(this.ct=C.element)),M}rt(C){if(this.G!==void 0)if(this.isConnected||(C=void 0),typeof this.G=="function"){let r=this.ht??globalThis,e=p0.get(r);e===void 0&&(e=new WeakMap,p0.set(r,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,C),C!==void 0&&this.G.call(this.ht,C)}else this.G.value=C}get lt(){return typeof this.G=="function"?p0.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}})});var H3=u(()=>{l9()});var p9,d9,p1,c9=u(()=>{"use strict";y();q();p9="__ms_empty__",d9=C=>C===""?p9:C,p1=class extends S{constructor(){super(...arguments);this.label="";this.value=void 0;this.disabled=!1;this.helper="";this._options=[];this._selected="";this._observer=null}connectedCallback(){super.connectedCallback(),this._read(),this._observer=new MutationObserver(()=>this._read()),this._observer.observe(this,{childList:!0,subtree:!0,characterData:!0,attributes:!0})}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect(),this._observer=null}_read(){let e=[...this.querySelectorAll("option")];this._options=e.map(t=>({value:d9(t.value),label:(t.textContent??"").replace(/\s+/g," ").trim()})),this._selected=e.find(t=>t.hasAttribute("selected")||t.selected)?.value??e[0]?.value??""}_picked(e){e.stopPropagation(),this.value=e.detail.value===p9?"":e.detail.value,this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){return o`
      <ha-select
        .label=${this.label}
        .helper=${this.helper}
        .options=${this._options}
        .value=${d9(this.value??this._selected)}
        .disabled=${this.disabled}
        @selected=${this._picked}
      ></ha-select>`}};p1.styles=g`
    :host { display: block; }
    ha-select { display: block; width: 100%; }
  `,s([v()],p1.prototype,"label",2),s([v()],p1.prototype,"value",2),s([v({type:Boolean})],p1.prototype,"disabled",2),s([v()],p1.prototype,"helper",2),s([l()],p1.prototype,"_options",2),s([l()],p1.prototype,"_selected",2);customElements.get("ms-ha-select")||customElements.define("ms-ha-select",p1)});function I(){return V1("ha-select")}function E(C,r){if(I())return o`<ms-ha-select class=${C.cls??M} .label=${C.label??""} .value=${C.value} .disabled=${!!C.disabled}
      @change=${C.onChange}>${r}</ms-ha-select>`;if(C.value===void 0)return o`<select class=${C.cls??M} id=${C.id??M} aria-label=${C.label??M} ?disabled=${!!C.disabled}
      @change=${C.onChange}>${r}</select>`;let e=C.value;return o`<select class=${C.cls??M} id=${C.id??M} aria-label=${C.label??M} ?disabled=${!!C.disabled}
    .value=${C.live?o9(e):e} @change=${C.onChange}
    ${y2(t=>{t instanceof HTMLSelectElement&&queueMicrotask(()=>{t.value!==e&&(t.value=e)})})}>${r}</select>`}var c0=u(()=>{"use strict";y();n9();H3();i1();c9()});function O(C,r){if(V1("ha-checkbox")){let t=o`<ha-checkbox .checked=${C.checked} .disabled=${!!C.disabled} @change=${C.onChange}>${r}</ha-checkbox>`;return C.cls?o`<span class=${C.cls}>${t}</span>`:t}let e=o`<input type="checkbox" class=${C.inputCls??M} .checked=${C.checked} ?disabled=${!!C.disabled} @change=${C.onChange} />`;return C.boxAfter?o`<label class=${C.cls??M}>${r}${e}</label>`:o`<label class=${C.cls??M}>${e}${r}</label>`}var V3=u(()=>{"use strict";y();i1()});function L3(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0",carry:{}}}function h9(C){return{type:C.type||"threshold",attribute:C.attribute||"",above:C.trigger_above?.toString()??"",below:C.trigger_below?.toString()??"",equals:C.trigger_equals?.toString()??"",notEquals:C.trigger_not_equals?.toString()??"",forMinutes:C.trigger_for_minutes?.toString()??"0",targetValue:C.trigger_target_value?.toString()??"",deltaMode:C.trigger_delta_mode||!1,fromState:C.trigger_from_state||"",toState:C.trigger_to_state||"",targetChanges:C.trigger_target_changes?.toString()??"",runtimeHours:C.trigger_runtime_hours?.toString()??"",onStates:(C.trigger_on_states||[]).join(", "),daysBefore:C.trigger_days_before?.toString()??"0"}}function x9(C,r){r.attribute&&(C.attribute=r.attribute);let e=parseInt(r.forMinutes,10);if(r.type==="threshold"){let t=parseFloat(r.above);isNaN(t)||(C.trigger_above=t);let H=parseFloat(r.below);isNaN(H)||(C.trigger_below=H);let i=parseFloat(r.equals);isNaN(i)||(C.trigger_equals=i);let L=parseFloat(r.notEquals);isNaN(L)||(C.trigger_not_equals=L),isNaN(e)||(C.trigger_for_minutes=e)}else if(r.type==="counter"){let t=parseFloat(r.targetValue);isNaN(t)||(C.trigger_target_value=t),C.trigger_delta_mode=r.deltaMode}else if(r.type==="state_change"){r.fromState&&(C.trigger_from_state=r.fromState),r.toState&&(C.trigger_to_state=r.toState);let t=parseInt(r.targetChanges,10);isNaN(t)||(C.trigger_target_changes=t),isNaN(e)||(C.trigger_for_minutes=e)}else if(r.type==="runtime"){let t=parseFloat(r.runtimeHours);isNaN(t)||(C.trigger_runtime_hours=t);let H=(r.onStates||"").split(",").map(i=>i.trim()).filter(Boolean);H.length>0&&(C.trigger_on_states=H)}else if(r.type==="due_date"){let t=parseInt(r.daysBefore,10);C.trigger_days_before=isNaN(t)?0:t}}function Ze(C){return{entityIds:Y5(C).join(", "),...h9(C),carry:Object.fromEntries(Object.entries(C).filter(([e])=>!fe.has(e)&&!e.startsWith("_")))}}function Se(C){let r=C.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(r.length===0)return null;let e={...C.carry||{},entity_id:r[0],entity_ids:r,type:C.type};return x9(e,C),e}function ye(C){return Array.from({length:7},(r,e)=>x1(e,C,"short"))}function u9(C){return Array.from({length:12},(r,e)=>I5(e,C,"short"))}function be(C){let r=Array.isArray(C)?C.filter(e=>e!=null&&e!=="").join(", "):C!==null&&typeof C=="object"||C==null?"":String(C);return r.length>40?`${r.slice(0,39)}\u2026`:r}var ve,he,xe,m9,_e,o3,A9,v9,i3,ge,y1,s2,fe,m,m0,_9=u(()=>{"use strict";y();q();b();F4();U5();L2();q4();f1();C5();z5();V5();i0();q5();U4();a0();K4();J4();H9();i9();f2();e3();l0();q1();c0();V3();ve="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",he="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",xe="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",m9=["cleaning","inspection","replacement","calibration","service","reading","custom"],_e=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],o3=["weekdays","nth_weekday","day_of_month","calendar"],A9=["time_based","one_time",...o3],v9=["threshold","counter","state_change","runtime","due_date"],i3=(C,r)=>V(C==="due_date"?"trigger_type_due_date":C,r),ge=[...v9,"compound"],y1={alpha:"0.3",min:"7",max:"365"},s2=j1;fe=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);m=class m extends S{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.mirrorTodoDefault=[];this.betaEditor=!1;this._ruleSel=null;this._addTab="type";this._betaStep="form";this._chooserFilter="";this._templateChoices=null;this._copyChoices=null;this._objectDevice=null;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._series=[];this._seriesIndex=0;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calMonths=[];this._hadCalMonths=!1;this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._detailsOpen=!1;this._mirrorTodoEntities=[];this._mirrorTodoMode="default";this._completeWhenEntity="";this._completeWhenState="";this._completeWhenAnyTime=!1;this._completeWhenFor="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._holdUntilDone=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._triggerDetailAttribute="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._quickOn=!1;this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=y1.alpha;this._adaptiveMin=y1.min;this._adaptiveMax=y1.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set;this._attrSeq=0}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return T(this.hass)}async openCreate(e,t){this._series=[],this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="";let H=(t||[]).filter(i=>!i.object.archived&&!i.object.archived_at);!e&&H.length>0?(this._objectChoices=H.map(i=>({entry_id:i.entry_id,name:i.object.name})).sort((i,L)=>i.name.localeCompare(L.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),this._betaStep=this.betaEditor?"choose":"form",this._ruleSel="task",this._addTab="type",this._chooserFilter="",await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._series=[],await this._edit(e,t)}async openEditSeries(e){e.length!==0&&(this._series=e,await this._editSeriesItem(0))}async _editSeriesItem(e){let t=this._series[e];this._seriesIndex=e,await this._edit(t.entryId,t.task),await this.updateComplete,this.shadowRoot?.querySelector(".dialog-title")?.scrollIntoView({block:"start"})}_skipSeriesItem(){this._editSeriesItem(this._seriesIndex+1)}async _edit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._warning="",this._betaStep="form",this._ruleSel=null,this._addTab="type",this._objectChoices=[],this._isFleetTask=t.battery_fleet_task===!0,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let H=t.schedule;this._weekdays=H?.kind==="weekdays"?[...H.weekdays??[]]:[],this._nth=H?.kind==="nth_weekday"?String(H.nth??1):"1",this._nthWeekday=H?.kind==="nth_weekday"?String(H.weekday??5):"5",this._domDay=H?.kind==="day_of_month"&&(H.day??1)>=1?String(H.day??1):"1",this._domLastDay=H?.kind==="day_of_month"&&H.day===-1,this._domBusiness=H?.kind==="day_of_month"&&H.business===!0,this._calMonths=(H?.kind==="day_of_month"||H?.kind==="nth_weekday")&&Array.isArray(H.months)?[...H.months]:[],this._hadCalMonths=this._calMonths.length>0,this._calendarEntity=H?.kind==="calendar"&&H.entity_id||"",this._calOffset=H?.offset?String(H.offset):"0",this._seasonMonths=Array.isArray(H?.season_months)?[...H.season_months]:[];let i=H?.ends;i&&typeof i.count=="number"?(this._endsMode="count",this._endsCount=String(i.count),this._endsUntil=""):i&&typeof i.until=="string"?(this._endsMode="until",this._endsUntil=i.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._notifyIcon=t.notify_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._mirrorTodoEntities=[...t.mirror_todo_entities||[]],this._mirrorTodoMode=this._mirrorTodoEntities.length?"own":t.mirror_todo_use_default===!1?"none":"default",this._completeWhenEntity=t.complete_when?.entity_id||"",this._completeWhenState=t.complete_when?.to_state||"",this._completeWhenAnyTime=!!t.complete_when?.any_time,this._completeWhenFor=t.complete_when?.for_minutes?String(t.complete_when.for_minutes):"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._notifyEnabled=t.notify_enabled!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(d=>({...d})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(d=>[d1(d),{...d}])),this._consumesQtyText={},this._responsibleUserId=t.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([d,p])=>{let{name:c,checklist:A,consumes_parts:x,required_completion_fields:_,...R}=p,$=p.consumes_parts||[],N=$.findIndex(X=>!X.entry_id),K=N>=0?$[N]:void 0;return{id:d,name:p.name||d,checklistText:(p.checklist||[]).join(`
`),partId:K?.part_id||"",partQty:K?.quantity!=null?String(K.quantity):"",reqOverride:p.required_completion_fields!==void 0,reqFields:[...p.required_completion_fields||[]],extraParts:$.filter((X,h)=>h!==N).map(X=>({...X})),carry:R}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"",this._scheduleTimeOn=!!t.schedule_time;let L=t.on_complete_action;if(L&&L.service){this._actionService=L.service;let d=L.target?.entity_id;this._actionTargetEntity=Array.isArray(d)?d[0]||"":d||"",this._actionTargetStored=L.target&&typeof L.target=="object"?JSON.parse(JSON.stringify(L.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=L.data&&typeof L.data=="object"?{...L.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=L.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let a=t.quick_complete_defaults;this._quickOn=n2(t),this._qcNotes=a?.notes||"",this._qcCost=a?.cost!=null?String(a.cost):"",this._qcDuration=a?.duration!=null?String(a.duration):"",this._qcFeedback=a?.feedback||"";let n=t.adaptive_config||{};if(this._environmentalEntity=n.environmental_entity||"",this._environmentalAttribute=n.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!n.enabled,this._adaptiveAlpha=n.ewa_alpha?.toString()??y1.alpha,this._adaptiveMin=n.min_interval_days?.toString()??y1.min,this._adaptiveMax=n.max_interval_days?.toString()??y1.max,this._adaptiveSeasonal=n.seasonal_enabled!==!1,this._adaptivePrediction=n.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,t.trigger_config){let d=t.trigger_config;this._triggerEntityId=o0(d)||"",this._triggerEntityIds=Y5(d),this._triggerEntityLogic=d.entity_logic||"any",this._setTypeFields(h9(d)),this._triggerCombinator=d.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=d.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=d.auto_complete_on_recovery||!1,this._holdUntilDone=d.trigger_hold_until_done===!0,this._triggerRuntimeMaxSession=d.trigger_runtime_max_session_seconds?.toString()||"",this._triggerDetailAttribute=d.detail_attribute||"",d.type==="compound"?(this._compoundLogic=d.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(d.conditions||[]).map(Ze)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),this._detailsOpen=this._priority!=="normal"||!!this._labels.trim()||!!this._documentationUrl.trim()||!!this._customIcon,await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._detailsOpen=!1,this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._calMonths=[],this._hadCalMonths=!1,this._calendarEntity="",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._mirrorTodoMode="default",this._completeWhenEntity="",this._completeWhenState="",this._completeWhenAnyTime=!1,this._completeWhenFor="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._notifyEnabled=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=y1.alpha,this._adaptiveMin=y1.min,this._adaptiveMax=y1.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._actionTestError="",this._quickOn=!1,this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates,this._triggerDaysBefore=e.daysBefore}_resetTriggerFields(){++this._attrSeq,this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(L3()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._holdUntilDone=!1,this._triggerRuntimeMaxSession="",this._triggerDetailAttribute="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new W5(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=V("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,H]=e.split(".");if(!this.hass?.services?.[t]?.[H]){this._actionTestResult="error",this._actionTestError=V("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let i=this._actionTargetEntity.trim();if(i){let L=i.split(".")[0];if(L!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=V("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",t).replace("{entity}",i).replace("{entity_domain}",L).replace("{suggestion}",`${L}.${H}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[i]){this._actionTestResult="error",this._actionTestError=V("action_test_entity_missing",this._lang).replace("{entity}",i),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,H]=e.split("."),i=this.hass?.services?.[t]?.[H]?.fields;return!i||Object.keys(i).length===0?null:Object.entries(i).map(([L,a])=>({name:L,required:!!a.required,selector:a.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([t,H])=>t==="entity_id"?Array.isArray(H)&&H.length>1:Array.isArray(H)?H.length>0:!!H):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},t=i=>(Array.isArray(i)?i:[i]).filter(L=>typeof L=="string"&&!!L),H=this.hass;return[...t(e.entity_id).map(i=>i5(this.hass,i)),...t(e.device_id).map(i=>H.devices?.[i]?.name_by_user||H.devices?.[i]?.name||i),...t(e.area_id).map(i=>H.areas?.[i]?.name||i),...t(e.floor_id).map(i=>H.floors?.[i]?.name||i),...t(e.label_id)].join(", ")}_renderQuickComplete(e){let t={notes:!!this._qcNotes.trim(),cost:!isNaN(parseFloat(this._qcCost)),duration:a2(this._qcDuration)!==null,photo:!1,user:!0},H=this._requiredCompletion.filter(L=>!t[L]),i=!!this._checklistText.trim()||this._readings.length>0;return o`
      ${O({cls:"req-option quick-complete-switch",checked:this._quickOn,onChange:L=>this._quickOn=L.target.checked},o`<span>${V("quick_complete_label",e)}</span>`)}
      ${this._quickOn?o`
            <div class="field-help">${V("quick_complete_help",e)}</div>
            ${H.length?o`<div class="field-help quick-complete-note">${V("quick_complete_needs_dialog",e).replace("{fields}",H.map(L=>V(Z2[L],e)).join(", "))}</div>`:M}
            ${this._requireTagScan?o`<div class="field-help quick-complete-note">${V("quick_complete_tag_hint",e)}</div>`:M}
            ${i?o`<div class="field-help">${V("quick_complete_not_asked",e)}</div>`:M}
            ${Z1({cls:"ca-section quick-complete-values",open:Object.values(t).slice(0,3).some(Boolean)||!!this._qcFeedback,header:V("quick_complete_values",e)},o`
              <p class="field-help">${V("quick_complete_values_help",e)}</p>
              <ms-textfield
                label="${V("quick_complete_defaults_notes",e)}"
                .value=${this._qcNotes}
                @input=${L=>{this._qcNotes=L.target.value}}
              ></ms-textfield>
              <div class="qc-cost">
                <span class="qc-cost-label">${V("quick_complete_defaults_cost",e)}</span>
                <ms-cost-input .lang=${e} .value=${this._qcCost}
                  @value-changed=${L=>{this._qcCost=L.detail.value}}></ms-cost-input>
              </div>
              <ms-textfield
                label="${V("quick_complete_defaults_duration",e)}"
                type="number" min="0" step="1"
                .value=${this._qcDuration}
                @input=${L=>{this._qcDuration=L.target.value}}
              ></ms-textfield>
              ${E({label:V("was_maintenance_needed",e),cls:"qc-feedback",value:this._qcFeedback,onChange:L=>{this._qcFeedback=L.target.value}},o`
                <option value="">${V("quick_complete_defaults_feedback_none",e)}</option>
                <option value="needed">${V("quick_complete_defaults_feedback_needed",e)}</option>
                <option value="not_needed">${V("quick_complete_defaults_feedback_not_needed",e)}</option>
                <option value="not_sure">${V("feedback_not_sure",e)}</option>
              `)}
            `)}
          `:M}
    `}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return M;let t=this._serviceSchema();return o`
      ${Z1({cls:"ca-section",header:V("on_complete_action_title",e)},o`
        <p class="field-help">${V("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${H=>{this._actionService=H.detail.value||"";let i=this._serviceSchema();if(i){let L=new Set(i.map(a=>a.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([a])=>L.has(a)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>V("on_complete_action_target",e)}
          @value-changed=${H=>{let i=H.detail.value;this._actionTargetEntity=i.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?o`<p class="field-help ca-target-more">${V("on_complete_action_target_more",e).replace("{targets}",this._actionTargetSummary())}</p>`:M}
        <p class="field-help ca-domain-hint">
          ${V("on_complete_action_target_hint",e)}
        </p>
        ${O({cls:"ca-skip-auto",checked:this._actionSkipAuto,onChange:H=>{this._actionSkipAuto=H.target.checked}},o`<span>${V("on_complete_action_skip_auto",e)}</span>`)}
        ${t?o`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${H=>{this._actionData={...H.detail.value}}}
              ></ha-form>
            `:o`
              <ms-textfield
                label="${V("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${H=>{this._actionDataJsonFallback=H.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":V("on_complete_action_test",e)}
          </button>
          ${this._actionTestResult==="ok"?o`<span class="ca-test-ok">${V("on_complete_action_test_success",e)}</span>`:M}
          ${this._actionTestResult==="error"?o`<div class="ca-test-error-block">
                <span class="ca-test-error">${V("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?o`<div class="ca-test-error-detail">${this._actionTestError}</div>`:M}
              </div>`:M}
        </div>
      `)}

    `}_knownObjects(e){return this.objects?.some(t=>t.entry_id===e)?this.objects:void 0}async _loadParts(){this.parts=[];let e=this._entryId;if(!e)return;let t=this._knownObjects(e)?.find(H=>H.entry_id===e);if(t){this.parts=t.parts||[],this._partsLoadFailed=!1;return}try{let H=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e});if(e!==this._entryId)return;this.parts=H.parts||[],this._partsLoadFailed=!1}catch{if(e!==this._entryId)return;this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){this._foreignOwners=[];let e=this._entryId;if(e)try{let t=this._knownObjects(e)??(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"})).objects;if(e!==this._entryId)return;this._foreignOwners=(t||[]).filter(H=>H.entry_id!==e&&(H.parts||[]).length>0).map(H=>({entry_id:H.entry_id,name:H.object?.name||H.entry_id,parts:H.parts||[]})).sort((H,i)=>H.name.localeCompare(i.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let H=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:H.suggested_attributes||[],available:H.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){let t=++this._attrSeq;if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let H=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});if(t!==this._attrSeq)return;this._entityDomain=H.domain||"",this._suggestedAttributes=H.suggested_attributes||[],this._availableAttributes=H.available_attributes||[]}catch{if(t!==this._attrSeq)return;this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let H=d1({part_id:e.id,entry_id:t}),i=this._consumesParts[H],L=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return o`
      <div class="consumes-row">
        ${O({cls:"consumes-check",checked:i!==void 0,onChange:a=>{let n={...this._consumesParts};if(a.target.checked)n[H]=n[H]||L;else{delete n[H];let d={...this._consumesQtyText};delete d[H],this._consumesQtyText=d}this._consumesParts=n}},o`<span>${e.name}${e.unit?` (${e.unit})`:""}</span>`)}
        ${i!==void 0?o`<input
              class="consumes-qty"
              aria-label=${`${e.name}: ${V("quantity",this._lang)}`}
              type="number"
              min=${s2[0]}
              max=${s2[1]}
              step="0.01"
              .value=${this._consumesQtyText[H]??String(i.quantity)}
              @input=${a=>{let n=a.target.value;this._consumesQtyText={...this._consumesQtyText,[H]:n};let d=parseFloat(n.replace(",","."));Number.isFinite(d)&&d>=s2[0]&&(this._consumesParts={...this._consumesParts,[H]:{...L,quantity:d}})}}
            />`:M}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let t of Object.keys(e)){let H=this._consumesQtyText[t];if(H===void 0)continue;let i=parseFloat(H.replace(",","."));if(!Number.isFinite(i)||i<s2[0]||i>s2[1]){let L=a=>f(a,this._lang,{maximumFractionDigits:2});return this._error=V("settings_value_out_of_range",this._lang).replace("{min}",L(s2[0])).replace("{max}",L(s2[1])),!1}e[t]={...e[t],quantity:i}}return this._consumesParts=e,!0}_toggleRequired(e,t){let H=new Set(this._requiredCompletion);t?H.add(e):H.delete(e),this._requiredCompletion=[...H]}_patchReading(e,t){this._readings=this._readings.map(H=>H.id===e?{...H,...t}:H)}_renderReadingsEditor(e){let t=m4(this._readings);return o`
      <div class="readings-editor">
        <div class="field-label">${V("readings_section",e)}</div>
        <div class="field-help">${V("readings_hint",e)}</div>
        ${this._readings.map(H=>o`
          ${t.has(H.id)?o`<div class="field-help reading-dup">${V("reading_duplicate_name",e)}</div>`:M}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${V("reading_name_label",e)}"
              .value=${H.name}
              @input=${i=>this._patchReading(H.id,{name:i.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${V("reading_unit_short",e)}"
              .value=${H.unit||""}
              @input=${i=>this._patchReading(H.id,{unit:i.target.value})}
            ></ms-textfield>
            <ha-icon-button class="phase-remove reading-remove" .label=${V("remove",e)} @click=${()=>this._readings=this._readings.filter(i=>i.id!==H.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<Y3?o`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:M4(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${V("reading_add",e)}
          </ha-button>`:M}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",H=t,i=2;for(;this._phaseDefs.some(L=>L.id===H);)H=`${t}-${i++}`;return H}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(H=>H.id===e?{...H,...t}:H)}_renderPhasesEditor(e){let t=H=>this._phaseDefs.find(i=>i.id===H)?.name||H;return o`
      ${Z1({cls:"phases-section",open:this._phaseDefs.length>0,header:V("phases_section",e)},o`
      <div class="field-help">${V("phases_hint",e)}</div>
      ${this._phaseDefs.map(H=>o`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${V("phase_name",e)}"
              .value=${H.name}
              @input=${i=>this._patchPhaseDef(H.id,{name:i.target.value})}
            ></ms-textfield>
            ${this.parts.length?o`
              ${E({label:V("spare_part",e),cls:"phase-part",value:H.partId,onChange:i=>{let L=i.target.value;this._patchPhaseDef(H.id,H.partQty?{partId:L}:{partId:L,partQty:"1"})}},o`
                <option value="">—</option>
                ${this.parts.map(i=>o`<option value=${i.id} ?selected=${i.id===H.partId}>${i.name}</option>`)}
              `)}
              ${H.partId?o`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" aria-label=${V("quantity",e)} type="number" min=${j1[0]} step="0.01" placeholder="1" .value=${H.partQty}
                  @input=${i=>this._patchPhaseDef(H.id,{partQty:i.target.value})} />
              `:M}
            `:M}
            <ha-icon-button class="phase-remove" .label=${V("remove",e)} @click=${()=>this._removePhaseDef(H.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?o`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${V("checklist_placeholder",e)}"
              .value=${H.checklistText}
              @input=${i=>this._patchPhaseDef(H.id,{checklistText:i.target.value})}
            ></textarea>
          `:M}
          ${O({cls:"req-option phase-req-toggle",checked:H.reqOverride,onChange:i=>this._patchPhaseDef(H.id,{reqOverride:i.target.checked})},o`<span>${V("phase_require_override",e)}</span>`)}
          ${H.reqOverride?o`
            <div class="required-completion phase-req-fields">
              ${V0.map(i=>o`
                ${O({cls:"req-option",checked:H.reqFields.includes(i),onChange:L=>{let a=L.target.checked,n=new Set(H.reqFields);a?n.add(i):n.delete(i),this._patchPhaseDef(H.id,{reqFields:[...n]})}},o`<span>${V(Z2[i],e)}</span>`)}
              `)}
            </div>
          `:M}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${V("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(H=>H.name.trim())?o`
        <div class="phase-seq-label">${V("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((H,i)=>o`
            <span class="phase-chip">
              ${i+1}. ${t(H)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((L,a)=>a!==i)}}>✕</button>
            </span>
          `)}
          ${E({label:V("phase_sequence_add_step",e),cls:"phase-seq-add",value:"",onChange:H=>{let i=H.target.value;i&&(this._phaseSeq=[...this._phaseSeq,i]),H.target.value=""}},o`
            <option value="">+ ${V("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(H=>H.name.trim()).map(H=>o`<option value=${H.id}>${H.name}</option>`)}
          `)}
        </div>
      `:M}
      `)}
    `}async _save(){if(this._loading||!this._name.trim()||this._missingDueDate())return;if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),H=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(H)&&t>H){this._error=`${V("adaptive_min_interval",this._lang)} > ${V("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=V("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=V("calendar_entity_required",this._lang);return}if(!this._applyConsumesQtyText())return;if(this._completeWhenEntity&&parseInt(this._completeWhenFor,10)>x2[1]){this._error=V("settings_value_out_of_range",this._lang).replace("{min}","1").replace("{max}",f(x2[1],this._lang));return}this._loading=!0,this._error="";let e;try{let t=await F(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:a=>{this._error=a}});if(t===void 0)return;let H=this._taskId||t?.task_id,i=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let L=a=>{this._warning=V("subsave_warning",this._lang).replace("{detail}",a)};if(H&&this._scheduleType==="sensor_based"&&i&&await F(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:H,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:L})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),H&&this._adaptiveSnapshot()!==this._adaptiveInitial){let a=parseFloat(this._adaptiveAlpha),n=parseInt(this._adaptiveMin,10),d=parseInt(this._adaptiveMax,10);await F(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:H,enabled:this._adaptiveEnabled,...a>=t5[0]&&a<=t5[1]?{ewa_alpha:a}:{},...!isNaN(n)&&n>=1?{min_interval_days:n}:{},...!isNaN(d)&&d>=1?{max_interval_days:d}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:L})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?H&&(this._taskId=H):this._seriesIndex+1<this._series.length?e=this._seriesIndex+1:(this._open=!1,this._series=[]),this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}e!==void 0&&await this._editSeriesItem(e)}_missingDueDate(){return this._scheduleType==="one_time"&&!this._dueDate}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):o3.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.priority=this._priority,e.labels=this._labels.split(",").map(L=>L.trim()).filter(Boolean);let H=this.mirrorTodoDefault.length&&this._mirrorTodoMode!=="own"?[]:X5(this.hass,this._mirrorTodoEntities);e.mirror_todo_entities=H,e.mirror_todo_use_default=this.mirrorTodoDefault.length?this._mirrorTodoMode==="default":this._mirrorTodoMode!=="none",e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip;let i=parseInt(this._completeWhenFor,10);e.complete_when=this._completeWhenEntity&&this._completeWhenState.trim()?{entity_id:this._completeWhenEntity,to_state:this._completeWhenState.trim(),...this._completeWhenAnyTime?{any_time:!0}:{},...i>0?{for_minutes:i}:{}}:null,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=A4(this._readings);{let L={};for(let n of this._phaseDefs){if(!n.name.trim())continue;let d={...n.carry,name:n.name.trim()},p=n.checklistText.split(`
`).map(A=>A.trim()).filter(Boolean);p.length&&(d.checklist=p);let c=[];if(n.partId){let A=parseFloat(n.partQty);c.push({part_id:n.partId,quantity:Number.isFinite(A)&&A>0?A:1})}for(let A of n.extraParts)c.push(A.entry_id?{part_id:A.part_id,quantity:A.quantity,entry_id:A.entry_id}:{part_id:A.part_id,quantity:A.quantity});c.length&&(d.consumes_parts=c),n.reqOverride&&(d.required_completion_fields=[...n.reqFields]),L[n.id]=d}let a=this._phaseSeq.filter(n=>n in L);e.phases=Object.keys(L).length&&a.length?L:null,e.phase_sequence=e.phases?a:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(L=>L.entry_id?{part_id:L.part_id,quantity:L.quantity,entry_id:L.entry_id}:{part_id:L.part_id,quantity:L.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let L=this._compoundConditions.map(Se).filter(a=>a!==null);if(L.length>0){let a={type:"compound",compound_logic:this._compoundLogic,conditions:L};this._autoCompleteOnRecovery&&(a.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(a.trigger_combinator="all"),this._triggerDetailAttribute&&(a.detail_attribute=this._triggerDetailAttribute),e.trigger_config=a}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let L=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],a={entity_id:L[0],entity_ids:L,type:this._triggerType};if(x9(a,this._typeFields()),this._holdUntilDone&&this._isStateLatch()?a.trigger_hold_until_done=!0:this._autoCompleteOnRecovery&&(a.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(a.trigger_combinator="all"),this._triggerDetailAttribute&&(a.detail_attribute=this._triggerDetailAttribute),L.length>1&&(a.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let n=parseFloat(this._triggerBaselineValue);!isNaN(n)&&n>=0&&(a.trigger_baseline_value=n)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let n=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(n)&&n>0&&(a.trigger_runtime_max_session_seconds=n)}e.trigger_config=a}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&A9.includes(this._scheduleType)){let L=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(L)?L:null}if(this.checklistsEnabled){let L=this._checklistText.split(`
`).map(a=>a.trim()).filter(Boolean).slice(0,100);e.checklist=L.length?L:null}if(this.completionActionsEnabled||this._actionPresent){let L=this._actionService.trim();if(L&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(L)){let a={service:L},n=this._actionTargetEntity.trim();this._actionTargetStored&&n===this._actionTargetInitial?a.target=JSON.parse(JSON.stringify(this._actionTargetStored)):n&&(a.target={entity_id:n});let d=this._buildActionData();Object.keys(d).length>0&&(a.data=d),this._actionSkipAuto&&(a.skip_auto=!0),e.on_complete_action=a}else e.on_complete_action=null}{let L={};this._qcNotes.trim()&&(L.notes=this._qcNotes.trim());let a=parseFloat(this._qcCost);isNaN(a)||(L.cost=a);let n=a2(this._qcDuration);n!==null&&(L.duration=n),this._qcFeedback&&(L.feedback=this._qcFeedback),e.quick_complete_defaults=this._quickOn?L:null}return e}_close(){this._open=!1,this._series=[],this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return M;let e=this._lang,t=this._triggerType==="compound";return o`
      <div class="select-row">
        ${I()?M:o`<label>${V("trigger_type",e)}</label>`}
        ${E({label:V("trigger_type",e),value:this._triggerType,onChange:H=>{this._triggerType=H.target.value,this._seedUpdateRule()}},o`
          ${ge.map(H=>o`<option value=${H} ?selected=${H===this._triggerType}>${i3(H,e)}</option>`)}
        `)}
      </div>
      ${t?this._renderCompoundEditor():o`
        ${this._entityPickerFallback?o`
          <ms-textfield
            label="${V("entity_id",e)} (${V("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${H=>{let L=H.target.value.split(",").map(a=>a.trim()).filter(Boolean);this._triggerEntityId=L[0]||"",this._triggerEntityIds=L,this._seedUpdateRule(),L[0]&&this._fetchEntityAttributes(L[0])}}
          ></ms-textfield>
        `:o`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:H0}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>V("entity_id",e)}
          @value-changed=${H=>{let i=(H.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=i[0]||"",this._triggerEntityIds=i,this._seedUpdateRule(),i[0]?this._fetchEntityAttributes(i[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?o`
          <div class="select-row">
            ${I()?M:o`<label>${V("entity_logic",e)}</label>`}
            ${E({label:V("entity_logic",e),value:this._triggerEntityLogic,onChange:H=>this._triggerEntityLogic=H.target.value},o`
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${V("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${V("entity_logic_all",e)}</option>
            `)}
          </div>
        `:M}
        ${this._renderAttributeSelect({label:V("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:H=>this._triggerAttribute=H})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      ${this._renderDetailAttributeSelect(e)}
      ${this._isStateLatch()?this._renderTriggerEnd(e):o`
        ${O({checked:this._autoCompleteOnRecovery,onChange:H=>this._autoCompleteOnRecovery=H.target.checked},o`${V("auto_complete_on_recovery",e)}`)}
        <div class="field-help">${V("auto_complete_on_recovery_help",e)}</div>
      `}
      <ms-textfield
        label="${V("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${H=>this._intervalDays=H.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():M}
      ${this._intervalDays?o`
            <div class="select-row">
              ${I()?M:o`<label>${V("trigger_combinator",e)}</label>`}
              ${E({label:V("trigger_combinator",e),onChange:H=>this._triggerCombinator=H.target.value},o`
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${V("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${V("trigger_combinator_all",e)}</option>
              `)}
            </div>
          `:M}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((H,i)=>i===e?{...H,...t}:H)}_addCondition(){this._compoundConditions=[...this._compoundConditions,L3()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,H)=>H!==e),this.betaEditor&&this._compoundConditions.length===1&&this._flattenCompound()}_flattenCompound(){let[e]=this._compoundConditions;if(!e)return;let t=e.entityIds.split(",").map(a=>a.trim()).filter(Boolean),{entityIds:H,carry:i,...L}=e;this._compoundConditions=[],this._setTypeFields(L),this._triggerEntityId=t[0]||"",this._triggerEntityIds=t,t[0]&&this._fetchEntityAttributes(t[0])}_renderCompoundEditor(){let e=this._lang;return o`
      <div class="select-row">
        ${I()?M:o`<label>${V("compound_logic",e)}</label>`}
        ${E({label:V("compound_logic",e),value:this._compoundLogic,onChange:t=>this._compoundLogic=t.target.value},o`
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${V("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${V("compound_logic_or",e)}</option>
        `)}
      </div>
      <div class="field-help">${V("compound_help",e)}</div>
      ${this._compoundConditions.length===0?o`<div class="field-help">${V("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,H)=>this._renderCondition(t,H))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${V("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let H=this._lang,i=t+1;return o`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${V("compound_condition",H)} ${i}</span>
          <button
            type="button"
            class="icon-btn"
            title="${V("compound_remove_condition",H)}"
            @click=${()=>this._removeCondition(t)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?o`
          <ms-textfield
            label="${V("entity_id",H)} (${V("comma_separated",H)})"
            .value=${e.entityIds}
            @input=${L=>this._patchCondition(t,{entityIds:L.target.value})}
          ></ms-textfield>
        `:o`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:H0}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(L=>L.trim()).filter(Boolean)}}
          .computeLabel=${()=>V("entity_id",H)}
          @value-changed=${L=>{let a=(L.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:a.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          ${I()?M:o`<label>${V("trigger_type",H)}</label>`}
          ${E({label:V("trigger_type",H),value:e.type,onChange:L=>this._patchCondition(t,{type:L.target.value})},o`
            ${v9.map(L=>o`<option value=${L} ?selected=${L===e.type}>${i3(L,H)}</option>`)}
          `)}
        </div>
        ${this._renderConditionTypeFields(e,t)}
      </div>
    `}_isStateLatch(){return this._triggerType==="state_change"&&(this._triggerTargetChanges===""||Number(this._triggerTargetChanges)===1)&&!!(this._triggerFromState.trim()||this._triggerToState.trim())}_renderTriggerEnd(e){let t=this._holdUntilDone?"hold":this._autoCompleteOnRecovery?"done":"ok",H={ok:"trigger_end_ok",done:"trigger_end_done",hold:"trigger_end_hold"},i=L=>{this._autoCompleteOnRecovery=L==="done",this._holdUntilDone=L==="hold"};return o`
      <div class="trigger-end" role="radiogroup" aria-label=${V("trigger_end",e)}>
        <div class="field-label">${V("trigger_end",e)}</div>
        ${Object.keys(H).map(L=>o`
          <label class="trigger-end-option">
            <input type="radio" name="trigger-end" value=${L} .checked=${t===L} @change=${()=>i(L)} />
            ${V(H[L],e)}
          </label>
        `)}
        ${t==="done"?o`<div class="field-help">${V("auto_complete_on_recovery_help",e)}</div>`:M}
        ${t==="hold"?o`<div class="field-help">${V("trigger_end_hold_help",e)}</div>`:M}
      </div>
    `}_renderCompleteWhen(e){return o`
      <div class="field complete-when-field">
        ${this._entityPickerFallback?o`
          <ms-textfield
            label="${V("complete_when",e)}"
            placeholder="binary_sensor.washer_door"
            .value=${this._completeWhenEntity}
            @input=${t=>this._completeWhenEntity=t.target.value.trim()}
          ></ms-textfield>
        `:o`
          <ha-form
            class="entity-picker-form"
            .hass=${this.hass}
            .schema=${[{name:"complete_when",selector:{entity:{}}}]}
            .data=${{complete_when:this._completeWhenEntity}}
            .computeLabel=${()=>V("complete_when",e)}
            @value-changed=${t=>{let H=(t.detail.value.complete_when||"").trim();H!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=H}}
          ></ha-form>`}
        ${this._completeWhenEntity?this._renderStateField({label:V("complete_when_state",e),value:this._completeWhenState,entityId:this._completeWhenEntity,onInput:t=>this._completeWhenState=t}):M}
        ${this._completeWhenEntity?o`
          <ms-textfield
            class="complete-when-for"
            label="${V("for_at_least_minutes",e)}"
            type="number"
            min=${x2[0]}
            max=${x2[1]}
            .value=${this._completeWhenFor}
            @input=${t=>this._completeWhenFor=t.target.value}
          ></ms-textfield>
          ${O({cls:"req-option complete-when-any-time",checked:this._completeWhenAnyTime,onChange:t=>this._completeWhenAnyTime=t.target.checked},o`<span>${V("complete_when_any_time",e)}</span>`)}
        `:M}
        <div class="field-help">${V("complete_when_help",e)}</div>
      </div>
    `}_renderStateField(e){return this._entityPickerFallback||!e.entityId?o`
        <ms-textfield
          label=${e.label}
          .value=${e.value}
          @input=${t=>e.onInput(t.target.value)}
        ></ms-textfield>
      `:o`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId}}}]}
        .data=${{s:e.value}}
        .computeLabel=${()=>e.label}
        @value-changed=${t=>e.onInput((t.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(e){let t=this._lang;return this._entityPickerFallback||!e.entityId?o`
        <ms-textfield
          label="${V("runtime_on_states",t)}"
          placeholder="on"
          .value=${e.value}
          @input=${H=>e.onInput(H.target.value)}
        ></ms-textfield>
      `:o`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(H=>H.trim()).filter(Boolean)}}
        .computeLabel=${()=>V("runtime_on_states",t)}
        @value-changed=${H=>e.onInput((H.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?M:!this.adaptiveFeature&&!this._adaptiveWasEnabled?M:o`
      ${Z1({cls:"adaptive-section",open:this._adaptiveEnabled,header:V("adaptive_section_title",e)},o`
        ${O({checked:this._adaptiveEnabled,onChange:t=>this._adaptiveEnabled=t.target.checked},o`${V("adaptive_enabled",e)}`)}
        ${this._adaptiveEnabled?o`
          <ms-textfield
            label="${V("adaptive_min_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMin}
            @input=${t=>this._adaptiveMin=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${V("adaptive_max_interval",e)}"
            type="number"
            min="1"
            .value=${this._adaptiveMax}
            @input=${t=>this._adaptiveMax=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${V("adaptive_ewa_alpha",e)}"
            type="number"
            min=${t5[0]}
            max=${t5[1]}
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${t=>this._adaptiveAlpha=t.target.value}
          ></ms-textfield>
          ${this.seasonalFeature?o`${O({checked:this._adaptiveSeasonal,onChange:t=>this._adaptiveSeasonal=t.target.checked},o`${V("adaptive_seasonal_enabled",e)}`)}`:M}
          ${O({checked:this._adaptivePrediction,onChange:t=>this._adaptivePrediction=t.target.checked},o`${V("adaptive_prediction_enabled",e)}`)}
        `:M}
      `)}
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?o`
        <div class="select-row">
          ${I()?M:o`<label>${e.label}</label>`}
          ${E({label:e.label,value:e.value,onChange:H=>e.onSelect(H.target.value)},o`
            <option value="" ?selected=${!e.value}>${V("use_entity_state",t)}</option>
            ${e.suggested.map(H=>o`<option value=${H} ?selected=${H===e.value}>${H} ★</option>`)}
            ${e.available.filter(H=>!e.suggested.includes(H.name)).map(H=>o`<option value=${H.name} ?selected=${H.name===e.value}>${H.name}${H.numeric?"":" (non-numeric)"}</option>`)}
          `)}
        </div>
      `:o`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${H=>e.onSelect(H.target.value.trim())}
      ></ms-textfield>
    `}_renderDetailAttributeSelect(e){let t=this._triggerType==="compound"?this._compoundConditions.flatMap(d=>d.entityIds.split(",").map(p=>p.trim()).filter(Boolean)):(this._triggerEntityIds.length?this._triggerEntityIds:[this._triggerEntityId]).filter(Boolean);if(!t.length)return M;let H=this.hass?.states??{},i=new Map;for(let d of t){this._fetchConditionAttributes(d);for(let p of this._conditionAttrOptions[d]?.available??[])i.has(p.name)||i.set(p.name,be(H[d]?.attributes?.[p.name]))}let L=this._triggerDetailAttribute;L&&!i.has(L)&&i.set(L,"");let a=V("trigger_detail_attribute",e),n=i.size?o`
        <div class="select-row">
          ${I()?M:o`<label>${a}</label>`}
          ${E({label:a,cls:"detail-attribute-select",value:L,onChange:d=>this._triggerDetailAttribute=d.target.value},o`
            <option value="" ?selected=${!L}>${V("trigger_detail_none",e)}</option>
            ${[...i.entries()].sort(([d],[p])=>d.localeCompare(p)).map(([d,p])=>o`<option value=${d} ?selected=${d===L}>${p?`${d}: ${p}`:d}</option>`)}
          `)}
        </div>`:o`
        <ms-textfield class="detail-attribute-input" label=${a} .value=${L}
          @input=${d=>this._triggerDetailAttribute=d.target.value.trim()}></ms-textfield>`;return o`${n}<div class="field-help">${V("trigger_detail_attribute_help",e)}</div>`}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:V("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:H=>this._environmentalAttribute=H})}_renderConditionAttribute(e,t){let H=e.entityIds.split(",")[0]?.trim()||"";H&&this._fetchConditionAttributes(H);let i=H?this._conditionAttrOptions[H]:void 0;return this._renderAttributeSelect({label:V("attribute_optional",this._lang),value:e.attribute,suggested:i?.suggested??[],available:i?.available??[],onSelect:L=>this._patchCondition(t,{attribute:L})})}_renderConditionTypeFields(e,t){let H=this._lang;if(e.type==="threshold")return o`
        <ms-textfield label="${V("trigger_above",H)}" type="number" .value=${e.above}
          @input=${i=>this._patchCondition(t,{above:i.target.value})}></ms-textfield>
        <ms-textfield label="${V("trigger_below",H)}" type="number" .value=${e.below}
          @input=${i=>this._patchCondition(t,{below:i.target.value})}></ms-textfield>
        <ms-textfield label="${V("trigger_equals",H)}" type="number" .value=${e.equals}
          @input=${i=>this._patchCondition(t,{equals:i.target.value})}></ms-textfield>
        <ms-textfield label="${V("trigger_not_equals",H)}" type="number" .value=${e.notEquals}
          @input=${i=>this._patchCondition(t,{notEquals:i.target.value})}></ms-textfield>
        <ms-textfield label="${V("for_minutes",H)}" type="number" .value=${e.forMinutes}
          @input=${i=>this._patchCondition(t,{forMinutes:i.target.value})}></ms-textfield>
      `;if(e.type==="counter")return o`
        <ms-textfield label="${V("target_value",H)}" type="number" .value=${e.targetValue}
          @input=${i=>this._patchCondition(t,{targetValue:i.target.value})}></ms-textfield>
        ${O({checked:e.deltaMode,onChange:i=>this._patchCondition(t,{deltaMode:i.target.checked})},o`${V("delta_mode",H)}`)}
      `;if(e.type==="state_change"){let i=e.entityIds.split(",")[0]?.trim()||"";return o`
        ${this._renderStateField({label:V("from_state_optional",H),value:e.fromState,entityId:i,onInput:L=>this._patchCondition(t,{fromState:L})})}
        ${this._renderStateField({label:V("to_state_optional",H),value:e.toState,entityId:i,onInput:L=>this._patchCondition(t,{toState:L})})}
        <ms-textfield label="${V("target_changes",H)}" type="number" .value=${e.targetChanges}
          @input=${L=>this._patchCondition(t,{targetChanges:L.target.value})}></ms-textfield>
        <ms-textfield label="${V("for_minutes",H)}" type="number" .value=${e.forMinutes}
          @input=${L=>this._patchCondition(t,{forMinutes:L.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let i=e.entityIds.split(",")[0]?.trim()||"";return o`
        <ms-textfield label="${V("runtime_hours",H)}" type="number" .value=${e.runtimeHours}
          @input=${L=>this._patchCondition(t,{runtimeHours:L.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:i,onInput:L=>this._patchCondition(t,{onStates:L})})}
      `}return e.type==="due_date"?o`
        <ms-textfield label="${V("days_before",H)}" type="number" step="1"
          min=${J2[0]} max=${J2[1]} .value=${e.daysBefore}
          @input=${i=>this._patchCondition(t,{daysBefore:i.target.value})}></ms-textfield>
      `:M}_renderUnitSelect(){let e=this._lang;return o`
      <div class="select-row">
        ${I()?M:o`<label>${V("interval_unit",e)}</label>`}
        ${E({label:V("interval_unit",e),value:this._intervalUnit,onChange:t=>this._intervalUnit=t.target.value},o`
          ${["days","weeks","months","years"].map(t=>o`<option value=${t} ?selected=${t===this._intervalUnit}>${V("unit_"+t,e)}</option>`)}
        `)}
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(o3.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(m._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let H=(n,d,p=0)=>{if(!(!n||p>10)){(n.tagName?.toLowerCase()??"")==="ha-entity-picker"&&d.push(n);for(let c of[n.shadowRoot,n])if(c)for(let A of Array.from(c.children??[]))H(A,d,p+1)}},i=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],L=[];for(let n of i)H(n,L);let a=L.length===0||L.some(n=>n.offsetHeight===0);if(e.offsetHeight===0||a){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){++this._previewSeq,this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let H=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{},...this._taskId?{entry_id:this._entryId,task_id:this._taskId}:{}});if(t!==this._previewSeq)return;this._schedulePreview=H.occurrences||[],this._schedulePreviewEnded=!!H.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return M;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",H=this._schedulePreview.map((L,a)=>{let n=new Date(`${L}T12:00:00`).getDay();return`${x1(n===0?6:n-1,e,"short")} ${B(L,e)}${a===0?t:""}`}).join(" \xB7 "),i=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?o`<div class="field-help">${V("schedule_preview_ontime",e)}</div>`:M;return o`
      <div class="trigger-live-hint schedule-preview">
        ${V("schedule_preview_title",e)}: ${H}${this._schedulePreviewEnded?o` <span class="field-help">${V("schedule_preview_ends",e)}</span>`:M}
        ${i}
      </div>
    `}_buildSchedule(){let e=i=>{let L=parseInt(this._calOffset,10)||0;return L&&(i.offset=Math.max(-e5,Math.min(L,e5))),i},t=i=>((this._calMonths.length||this._hadCalMonths)&&(i.months=[...this._calMonths].sort((L,a)=>L-a)),e(i));if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((i,L)=>i-L)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let H={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(H.business=!0),t(H)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,H)=>t-H)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleCalMonth(e){this._calMonths=this._calMonths.includes(e)?this._calMonths.filter(t=>t!==e):[...this._calMonths,e]}_renderCalMonths(){let e=this._lang;return o`
      <label class="field-label">${V("recurrence_months_label",e)}</label>
      <div class="field-help">${V("recurrence_months_hint",e)}</div>
      <div class="weekday-chips season-chips cal-month-chips">
        ${u9(e).map((t,H)=>o`
          <button
            type="button"
            class="season-chip ${this._calMonths.includes(H+1)?"selected":""}"
            @click=${()=>this._toggleCalMonth(H+1)}
          >${t}</button>`)}
      </div>`}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||o3.includes(this._scheduleType)))return M;let H=u9(e);return o`
      <label class="field-label">${V("season_window_label",e)}</label>
      <div class="field-help">${V("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${H.map((i,L)=>o`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(L+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(L+1)}
          >${i}</button>`)}
      </div>

      <label class="field-label">${V("series_end_label",e)}</label>
      <div class="select-row">
        ${E({label:V("series_end_label",e),value:this._endsMode,onChange:i=>this._endsMode=i.target.value},o`
          <option value="never" ?selected=${this._endsMode==="never"}>${V("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${V("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${V("series_end_until",e)}</option>
        `)}
      </div>
      ${this._endsMode==="count"?o`
        <!-- max: MAX_SERIES_COUNT (const.py), what the history can count. -->
        <ms-textfield
          label="${V("series_end_count_label",e)}"
          type="number" min="1" max="500"
          .value=${this._endsCount}
          @input=${i=>this._endsCount=i.target.value}
        ></ms-textfield>`:M}
      ${this._endsMode==="until"?o`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${V("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${i=>this._endsUntil=i.detail.value}
        ></ms-date-field>`:M}
    `}_renderCalendarFields(){let e=this._lang,t=ye(e);if(this._scheduleType==="weekdays")return o`
        <label class="field-label">${V("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((H,i)=>o`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(i)?"selected":""}"
              @click=${()=>this._toggleWeekday(i)}
            >${H}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let H=[["1",V("ord_1",e)],["2",V("ord_2",e)],["3",V("ord_3",e)],["4",V("ord_4",e)],["5",V("ord_5",e)],["-1",V("ord_last",e)]];return o`
        <div class="select-row">
          ${I()?M:o`<label>${V("recurrence_occurrence",e)}</label>`}
          ${E({label:V("recurrence_occurrence",e),value:this._nth,onChange:i=>this._nth=i.target.value},o`
            ${H.map(([i,L])=>o`<option value=${i} ?selected=${i===this._nth}>${L}</option>`)}
          `)}
        </div>
        <div class="select-row">
          ${I()?M:o`<label>${V("recurrence_weekday",e)}</label>`}
          ${E({label:V("recurrence_weekday",e),value:this._nthWeekday,onChange:i=>this._nthWeekday=i.target.value},o`
            ${t.map((i,L)=>o`<option value=${String(L)} ?selected=${String(L)===this._nthWeekday}>${i}</option>`)}
          `)}
        </div>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?o`
        ${this._entityPickerFallback?o`
          <ms-textfield
            label="${V("calendar_entity_label",e)}"
            helper="${V("calendar_entity_hint",e)}"
            .value=${this._calendarEntity}
            @input=${H=>this._calendarEntity=H.target.value.trim()}
          ></ms-textfield>
        `:o`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>V("calendar_entity_label",e)}
            .computeHelper=${()=>V("calendar_entity_hint",e)}
            @value-changed=${H=>{this._calendarEntity=(H.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?o`
        ${this._domLastDay?M:o`
          <ms-textfield
            label="${V("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${H=>this._domDay=H.target.value}
          ></ms-textfield>`}
        ${O({cls:"checkbox-row",checked:this._domLastDay,onChange:H=>this._domLastDay=H.target.checked},o`<span>${V("recurrence_last_day",e)}</span>`)}
        ${O({cls:"checkbox-row",checked:this._domBusiness,onChange:H=>this._domBusiness=H.target.checked},o`<span>${V("recurrence_business_day",e)}</span>`)}
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`:M}_renderCalOffsetField(){let e=this._lang;return o`
      <ms-textfield
        label="${V("recurrence_offset",e)}"
        helper="${V("recurrence_offset_help",e)}"
        type="number"
        min=${-e5}
        max=${e5}
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return M;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?o`<div class="trigger-live-hint warn">${V("trigger_hint_overlap",this._lang)}</div>`:M,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let H=this.hass.states[t];if(!H)return e;let i=this._lang,L=H.attributes?.unit_of_measurement,a=typeof L=="string"&&L?` ${L}`:"",n=this._triggerAttribute?H.attributes?.[this._triggerAttribute]:H.state,d=typeof n=="number"?n:parseFloat(String(n)),p=n!=="unknown"&&n!=="unavailable"&&n!=null&&!isNaN(d),c=x=>f(x,i,{maximumFractionDigits:1}),A=[];if(this._triggerType==="threshold"){let x=parseFloat(this._triggerAbove),_=parseFloat(this._triggerBelow),R=parseFloat(this._triggerEquals),$=parseFloat(this._triggerNotEquals);if([x,_,R,$].every(N=>isNaN(N)))return M;p&&A.push(V("trigger_hint_now",i).replace("{value}",c(d)+a)),isNaN(x)||A.push(V("trigger_hint_above",i).replace("{target}",c(x)+a)),isNaN(_)||A.push(V("trigger_hint_below",i).replace("{target}",c(_)+a)),isNaN(R)||A.push(V("trigger_hint_equals",i).replace("{target}",c(R)+a)),isNaN($)||A.push(V("trigger_hint_not_equals",i).replace("{target}",c($)+a))}else if(this._triggerType==="counter"){let x=parseFloat(this._triggerTargetValue);if(isNaN(x))return M;this._triggerDeltaMode?this._taskId?A.push(V("trigger_hint_counter_delta_edit",i).replace("{target}",c(x)+a)):p?A.push(V("trigger_hint_counter_delta",i).replace("{value}",c(d)+a).replace("{due}",c(d+x)+a).replace("{target}",c(x)+a)):A.push(V("trigger_hint_counter_delta_edit",i).replace("{target}",c(x)+a)):(p&&A.push(V("trigger_hint_now",i).replace("{value}",c(d)+a)),A.push(V("trigger_hint_counter_abs",i).replace("{target}",c(x)+a)))}else if(this._triggerType==="runtime"){let x=parseFloat(this._triggerRuntimeHours);if(isNaN(x))return M;A.push(V("trigger_hint_runtime",i).replace("{hours}",c(x))),A.push(V("trigger_hint_state_now",i).replace("{value}",String(H.state)))}else if(this._triggerType==="state_change"){let x=parseInt(this._triggerTargetChanges,10)||1,_=this._triggerToState.trim();A.push((_?V("trigger_hint_state_change_to",i).replace("{state}",_):V("trigger_hint_state_change",i)).replace("{count}",String(x))),A.push(V("trigger_hint_state_now",i).replace("{value}",String(H.state)))}else if(this._triggerType==="due_date"){let x=parseInt(this._triggerDaysBefore,10)||0;A.push(x===0?V("trigger_hint_due_date_same_day",i):E5("trigger_hint_due_date","trigger_hint_due_date_one",x,i,"days"));let _=n==null?"":String(n);_&&!isNaN(Date.parse(_))&&A.push(V("trigger_hint_due_date_now",i).replace("{date}",B(_,i)))}return A.length?o`<div class="trigger-live-hint">${A.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?o`
        <ms-textfield
          label="${V("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${t=>this._triggerAbove=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${V("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${t=>this._triggerBelow=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${V("trigger_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerEquals}
          @input=${t=>this._triggerEquals=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${V("trigger_not_equals",e)}"
          type="number"
          step="any"
          .value=${this._triggerNotEquals}
          @input=${t=>this._triggerNotEquals=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${V("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?o`
        <ms-textfield
          label="${V("target_value",e)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${t=>this._triggerTargetValue=t.target.value}
        ></ms-textfield>
        ${O({checked:this._triggerDeltaMode,onChange:t=>this._triggerDeltaMode=t.target.checked},o`${V("delta_mode",e)}`)}
        ${this._triggerDeltaMode?o`
              <ms-textfield
                label="${V("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${t=>this._triggerBaselineValue=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?V("baseline_start_help_edit",e):V("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?o`<div class="baseline-effective">
                      ${V("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:M}
              </div>
            `:M}
      `:this._triggerType==="state_change"?o`
        ${this._renderStateField({label:V("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:t=>this._triggerFromState=t})}
        <div class="field-help">${V("state_value_help",e)}</div>
        ${this._renderStateField({label:V("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:t=>this._triggerToState=t})}
        <ms-textfield
          label="${V("target_changes",e)}"
          type="number"
          min=${x4[0]}
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${V("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?o`<div class="field-help">${V("state_latch_help",e)}</div>`:M}
        <ms-textfield
          label="${V("for_at_least_minutes",e)}"
          type="number"
          min=${x2[0]}
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
        <div class="field-help">${V("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?o`
        <ms-textfield
          label="${V("runtime_hours",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${t=>this._triggerRuntimeHours=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${V("runtime_max_session",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeMaxSession}
          @input=${t=>this._triggerRuntimeMaxSession=t.target.value}
        ></ms-textfield>
        <div class="field-help">${V("runtime_max_session_help",e)}</div>
        ${this._renderOnStatesField({value:this._triggerOnStates,entityId:this._triggerEntityId,onInput:t=>this._triggerOnStates=t})}
        <div class="field-help">${V("runtime_on_states_help",e)}</div>
      `:this._triggerType==="due_date"?o`
        <ms-textfield
          label="${V("days_before",e)}"
          type="number"
          step="1"
          min=${J2[0]}
          max=${J2[1]}
          .value=${this._triggerDaysBefore}
          @input=${t=>this._triggerDaysBefore=t.target.value}
        ></ms-textfield>
        <div class="field-help">${V("days_before_help",e)}</div>
      `:M}_section(e,t,H){return o`<section class="form-section ${e}">
      <h3 class="section-title">${t}</h3>
      ${H}
    </section>`}_renderIdentity(e){return o`
          ${this._taskId===null&&this._objectChoices.length>0?o`
            <div class="select-row">
              ${I()?M:o`<label>${V("object",e)}</label>`}
              ${E({label:V("object",e),value:this._entryId,onChange:t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},o`
                ${this._objectChoices.map(t=>o`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
              `)}
            </div>
          `:M}
          <ms-textfield
            label="${V("task_name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <div class="select-row">
            ${I()?M:o`<label>${V("maintenance_type",e)}</label>`}
            ${E({label:V("maintenance_type",e),value:this._type,onChange:t=>this._type=t.target.value},o`
              ${m9.map(t=>o`<option value=${t} ?selected=${t===this._type}>${V(t,e)}</option>`)}
            `)}
          </div>
          <ms-textfield
            label="${V("notes_optional",e)}"
            multiline
            .rows=${3}
            .helper=${V("notes_markdown_hint",e)}
            .value=${this._notes}
            @input=${t=>this._notes=t.target.value}
          ></ms-textfield>
          ${this._renderDetails(e)}
          ${O({cls:"toggle-row",checked:this._enabled,onChange:t=>this._enabled=t.target.checked},o`${V("task_enabled",e)}`)}
    `}_renderDetails(e){return o`
      ${Z1({cls:"details-section",open:this._detailsOpen,header:V("task_section_details",e)},o`
        <div class="select-row">
          ${I()?M:o`<label>${V("priority",e)}</label>`}
          ${E({label:V("priority",e),value:this._priority,onChange:t=>this._priority=t.target.value},o`
            ${n0.map(t=>o`<option value=${t} ?selected=${t===this._priority}>${V("priority_"+t,e)}</option>`)}
          `)}
        </div>
        <ms-textfield
          label="${V("labels",e)}"
          placeholder="${V("labels_placeholder",e)}"
          helper="${V("labels_help",e)}"
          .value=${this._labels}
          @input=${t=>this._labels=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${V("documentation_url_optional",e)}"
          .value=${this._documentationUrl}
          @input=${t=>this._documentationUrl=t.target.value}
        ></ms-textfield>
        <ha-icon-picker
          .hass=${this.hass}
          label="${V("custom_icon_optional",e)}"
          .value=${this._customIcon}
          @value-changed=${t=>this._customIcon=t.detail.value||""}
        ></ha-icon-picker>
      `)}
    `}_renderScheduleSection(e){return this._section("schedule-section",V("task_section_schedule",e),o`
          <div class="select-row">
            ${I()?M:o`<label>${V("schedule_type",e)}</label>`}
            ${E({label:V("schedule_type",e),value:this._scheduleType,onChange:t=>this._scheduleType=t.target.value},o`
              ${_e.map(t=>o`<option value=${t} ?selected=${t===this._scheduleType}>${V(t,e)}</option>`)}
            `)}
          </div>
          ${this._scheduleType==="time_based"?o`
                <ms-textfield
                  label="${V("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${t=>this._intervalDays=t.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  ${I()?M:o`<label>${V("interval_anchor",e)}</label>`}
                  ${E({label:V("interval_anchor",e),value:this._intervalAnchor,onChange:t=>this._intervalAnchor=t.target.value},o`
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${V("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${V("anchor_planned",e)}</option>
                  `)}
                  <div class="field-help anchor-help">${V("interval_anchor_hint",e)}</div>
                </div>
              `:M}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?o`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${e}
                  label="${V("due_date",e)}"
                  .value=${this._dueDate}
                  @value-changed=${t=>this._dueDate=t.detail.value}
                ></ms-date-field>
              `:M}
          ${this.scheduleTimeEnabled&&A9.includes(this._scheduleType)?o`
            ${O({cls:"checkbox-row schedule-time-toggle",checked:this._scheduleTimeOn,onChange:t=>this._scheduleTimeOn=t.target.checked},o`<span>${V("schedule_time_toggle",e)}</span>`)}
            ${this._scheduleTimeOn?o`
              <ms-date-field
                kind="time"
                .hass=${this.hass}
                .lang=${e}
                .value=${this._scheduleTime}
                helper="${V("schedule_time_help",e)}"
                @value-changed=${t=>this._scheduleTime=t.detail.value}
              ></ms-date-field>
            `:M}
          `:M}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${V("last_performed_optional",e)}"
            .value=${this._lastPerformed}
            @value-changed=${t=>this._lastPerformed=t.detail.value}
          ></ms-date-field>
          <ms-textfield
            label="${V("warning_days",e)}"
            type="number"
            min=${r0[0]}
            max=${r0[1]}
            .value=${this._warningDays}
            @input=${t=>this._warningDays=t.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${V("earliest_completion_days",e)}"
            helper="${V("earliest_completion_days_help",e)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${t=>this._earliestCompletionDays=t.target.value}
          ></ms-textfield>
          ${this._renderAdaptiveSection(e)}
    `)}_renderTriggerSection(e){return this._scheduleType!=="sensor_based"?M:this._section("trigger-section",V("task_section_trigger",e),o`
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?o`
            ${this._entityPickerFallback?o`
              <ms-textfield
                label="${V("environmental_entity_optional",e)}"
                helper="${V("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${t=>this._environmentalEntity=t.target.value.trim()}
              ></ms-textfield>
            `:o`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:j4}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>V("environmental_entity_optional",e)}
              .computeHelper=${()=>V("environmental_entity_helper",e)}
              @value-changed=${t=>{this._environmentalEntity=(t.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):M}
          `:M}
    `)}_renderCompletionSection(e){return this._section("completion-section",V("task_section_completion",e),o`
          ${this._type==="reading"?o`
                <ms-textfield
                  label="${V("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${V("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:M}
          ${this.checklistsEnabled?o`
            <label class="field-label" for="checklist-textarea">${V("checklist_steps_optional",e)}</label>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${V("checklist_placeholder",e)}"
              .value=${this._checklistText}
              @input=${t=>this._checklistText=t.target.value}
            ></textarea>
            <div class="field-help">${V("checklist_help",e)}</div>
          `:M}
          ${this._partsLoadFailed?o`<div class="field-help parts-load-failed">${V("parts_load_failed",e)}</div>`:M}
          ${this._isFleetTask?o`<div class="field-help parts-fleet-hint">${V("task_parts_fleet_hint",e)}</div>`:this.parts.length||this._foreignOwners.length?o`
                <div class="field">
                  <label>${V("consumes_parts_label",e)}</label>
                  ${this.parts.map(t=>this._renderConsumesRow(t))}
                  ${this._foreignOwners.length?o`
                        ${Z1({cls:"shared-pools",open:this._hasForeignPick,header:V("shared_parts_other_objects",e)},o`
                          <div class="field-help">${V("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>o`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(H=>this._renderConsumesRow(H,t.entry_id))}
                            `)}
                        `)}
                      `:M}
                </div>
              `:M}
          <div class="field-label">${V("require_on_completion",e)}</div>
          <div class="required-completion">
            ${V0.map(t=>o`
              ${O({cls:"req-option",checked:this._requiredCompletion.includes(t),onChange:H=>this._toggleRequired(t,H.target.checked)},o`<span>${V(Z2[t],e)}</span>`)}
            `)}
          </div>
          ${this._availableTags.length>0?o`
              <div class="select-row">
                ${I()?M:o`<label>${V("nfc_tag_id_optional",e)}</label>`}
                ${E({label:V("nfc_tag_id_optional",e),value:this._nfcTagId,onChange:t=>this._nfcTagId=t.target.value},o`
                  <option value="" ?selected=${!this._nfcTagId}>${V("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(t=>o`<option value=${t.id} ?selected=${t.id===this._nfcTagId}>${t.name}</option>`)}
                `)}
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${V("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:o`
              <ms-textfield
                label="${V("nfc_tag_id_optional",e)}"
                .value=${this._nfcTagId}
                @input=${t=>this._nfcTagId=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${V("nfc_tags_empty_help",e)}
                <a href="/config/tags">${V("nfc_tags_open_settings",e)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${V("nfc_tags_refresh",e)}
                </button>
              </div>
            `}
          ${O({cls:"req-option",checked:this._requireTagScan,onChange:t=>this._requireTagScan=t.target.checked},o`<span>${V("require_tag_scan",e)}</span>`)}
          ${this._requireTagScan?o`<div class="field-help">${V("require_tag_scan_help",e)}</div>`:M}
          ${O({cls:"req-option",checked:!this._allowSkip,onChange:t=>this._allowSkip=!t.target.checked},o`<span>${V("disallow_skip",e)}</span>`)}
          ${this._allowSkip?M:o`<div class="field-help">${V("disallow_skip_help",e)}</div>`}
          ${this._renderQuickComplete(e)}
          ${this._renderCompleteWhen(e)}
          ${this._renderPhasesEditor(e)}
          ${this._renderCompletionActionsSection(e)}
    `)}_renderPeopleSection(e){return this._section("people-section",V("task_section_people",e),o`
          <div class="select-row">
            ${I()?M:o`<label>${V("responsible_user",e)}</label>`}
            ${E({label:V("responsible_user",e),value:this._responsibleUserId||"",onChange:t=>{let H=t.target.value;this._responsibleUserId=H||null}},o`
              <option value="" ?selected=${!this._responsibleUserId}>${V("no_user_assigned",e)}</option>
              ${this._availableUsers.map(t=>o`<option value=${t.id} ?selected=${t.id===this._responsibleUserId}>${t.name}</option>`)}
            `)}
          </div>
          ${this._availableUsers.length>=2?o`
            <div class="field">
              <label>${V("task_shared_with",e)}</label>
              <div class="field-help">${V("task_shared_with_help",e)}</div>
              ${this._responsibleUserId&&this._assigneePool.length>0&&!(this._assigneePool.length>=2&&this._rotationStrategy)?o`<div class="field-help shared-responsible-wins">${V("task_shared_responsible_wins",e)}</div>`:M}
              <div class="assignee-pool">
                ${this._availableUsers.map(t=>o`
                  ${O({cls:"pool-item",checked:this._assigneePool.includes(t.id),onChange:()=>this._toggleAssignee(t.id)},o`<span>${t.name}</span>`)}`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?o`
              <div class="select-row">
                ${I()?M:o`<label>${V("rotation_strategy",e)}</label>`}
                ${E({label:V("rotation_strategy",e),value:this._rotationStrategy,onChange:t=>this._rotationStrategy=t.target.value},o`
                  <option value="" ?selected=${!this._rotationStrategy}>${V("rotation_none",e)}</option>
                  ${Q4.map(t=>o`<option value=${t} ?selected=${t===this._rotationStrategy}>${V("rotation_"+t,e)}</option>`)}
                `)}
              </div>`:M}
          `:M}
    `)}_renderNotificationsSection(e){return this._section("notifications-section",V("task_section_notifications",e),o`
          ${O({cls:"req-option",checked:!this._notifyEnabled,onChange:t=>this._notifyEnabled=!t.target.checked},o`<span>${V("no_notifications",e)}</span>`)}
          ${this._notifyEnabled?M:o`<div class="field-help">${V("no_notifications_help",e)}</div>`}
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${V("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${t=>this._notifyIcon=t.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||L0(this._type)}></ha-icon>
            ${V("notify_icon_hint",e).replace("{default}",L0(this._type))}
          </div>
          ${this._renderMirrorTodo(e)}
    `)}_renderMirrorTodo(e){let t=this.mirrorTodoDefault;if(!t.length)return o`
          <div class="field mirror-todo-field">
            ${this._renderMirrorTodoPicker(e)}
            <div class="field-help">${V("task_mirror_todo_hint",e)}</div>
          </div>`;let H=t.map(L=>i5(this.hass,L)).join(", "),i={default:V("task_mirror_todo_default",e).replace("{lists}",H),own:V("task_mirror_todo_own",e),none:V("task_mirror_todo_none",e)};return o`
          <div class="field mirror-todo-field">
            <div class="mirror-todo-choice" role="radiogroup" aria-label=${V("task_mirror_todo",e)}>
              <div class="field-label">${V("task_mirror_todo",e)}</div>
              ${Object.keys(i).map(L=>o`
                <label class="mirror-todo-option">
                  <input type="radio" name="mirror-todo" value=${L} .checked=${this._mirrorTodoMode===L}
                    @change=${()=>this._mirrorTodoMode=L} />
                  ${i[L]}
                </label>
              `)}
            </div>
            ${this._mirrorTodoMode==="own"?this._renderMirrorTodoPicker(e):M}
            ${this._mirrorTodoMode!=="none"?o`<div class="field-help">${V("task_mirror_todo_hint",e)}</div>`:M}
          </div>`}_renderMirrorTodoPicker(e){return o`
            ${this._entityPickerFallback?o`
              <ms-textfield
                label="${V("task_mirror_todo",e)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${t=>{this._mirrorTodoEntities=X5(this.hass,t.target.value.split(",").map(H=>H.trim()))}}
              ></ms-textfield>
            `:o`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"],exclude_entities:X4(this.hass)}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>V("task_mirror_todo",e)}
                @value-changed=${t=>{this._mirrorTodoEntities=X5(this.hass,t.detail.value.mirror_todo_entities||[])}}
              ></ha-form>`}
            <div class="field-help mirror-todo-max">${V("task_mirror_todo_max",e).replace("{max}",String(5))}</div>`}_ruleDraft(){let e=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];return{name:this._name,enabled:this._enabled,typeLabel:V(this._type,this._lang),scheduleType:this._scheduleType,intervalDays:this._intervalDays,intervalUnit:this._intervalUnit,intervalAnchor:this._intervalAnchor,dueDate:this._dueDate,weekdays:this._weekdays,nth:this._nth,nthWeekday:this._nthWeekday,domDay:this._domDay,domLastDay:this._domLastDay,calendarEntity:this._calendarEntity?i5(this.hass,this._calendarEntity):"",warningDays:this._warningDays,triggerType:this._triggerType,triggerEntityIds:e,triggerAttribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,daysBefore:this._triggerDaysBefore,triggerCombinator:this._triggerCombinator,entityLogic:this._triggerEntityLogic,compoundLogic:this._compoundLogic,compoundCount:this._compoundConditions.length,compoundEntityIds:this._compoundConditions.flatMap(t=>t.entityIds.split(",").map(H=>H.trim()).filter(Boolean)),completeWhenEntity:this._completeWhenEntity,completeWhenState:this._completeWhenState,completeWhenFor:this._completeWhenFor,completeWhenAnyTime:this._completeWhenAnyTime,quickOn:this._quickOn,requiredCount:this._requiredCompletion.length,allowSkip:this._allowSkip,requireTagScan:this._requireTagScan,checklistCount:this.checklistsEnabled?this._checklistText.split(`
`).filter(t=>t.trim()).length:0,partsCount:Object.keys(this._consumesParts).length,responsibleUserId:this._responsibleUserId,pool:this._assigneePool,rotation:this._rotationStrategy,notifyEnabled:this._notifyEnabled,mirrorLists:this._mirrorListsShown()}}_mirrorListsShown(){return this.mirrorTodoDefault.length?this._mirrorTodoMode==="default"?this.mirrorTodoDefault:this._mirrorTodoMode==="own"?this._mirrorTodoEntities:[]:this._mirrorTodoMode==="none"?[]:this._mirrorTodoEntities}_userName(e){return this._availableUsers.find(t=>t.id===e)?.name??e}_sidebarTitle(e,t){switch(e){case"task":return V("task_section_details",t);case"schedule":return V("task_section_schedule",t);case"trigger":return V("task_section_trigger",t);case"completion":return V("task_section_completion",t);case"people":return V("task_section_people",t);case"notifications":return V("task_section_notifications",t);default:return V("beta_rules_add_rule",t)}}_selectRule(e){this._ruleSel=this._ruleSel===e?null:e,e==="add"&&this._loadObjectDevice()}_removeRule(e){e==="trigger"?(this._resetTriggerFields(),this._scheduleType=parseInt(this._intervalDays,10)>0?"time_based":"manual"):e==="schedule"&&(this._scheduleType==="sensor_based"?this._intervalDays="":this._scheduleType="manual"),this._ruleSel===e&&(this._ruleSel=null)}_combineTrigger(e,t=""){if(this._triggerType!=="compound"){let H=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];this._compoundConditions=[{entityIds:H.join(", "),...this._typeFields(),carry:{}}],this._compoundLogic="OR",this._triggerType="compound",this._triggerEntityId="",this._triggerEntityIds=[]}this._compoundConditions=[...this._compoundConditions,{...L3(),type:e,entityIds:t}]}_setSensorRule(e,t=""){this._scheduleType!=="time_based"&&this._scheduleType!=="sensor_based"&&(this._intervalDays=""),this._scheduleType="sensor_based",this._resetTriggerFields(),this._triggerType=e,e==="compound"&&(this._compoundConditions=[L3()]),t&&(this._triggerEntityId=t,this._triggerEntityIds=[t],this._seedUpdateRule(),this._fetchEntityAttributes(t))}_seedUpdateRule(){this._triggerType!=="state_change"||this._triggerEntityIds.length!==1||!this._triggerEntityId.startsWith("update.")||this._triggerFromState.trim()||this._triggerToState.trim()||(this._triggerFromState="off",this._triggerToState="on",this._autoCompleteOnRecovery=!0,this._holdUntilDone=!1)}_applyChoice(e){if(e.kind==="schedule"){if(e.effect==="safety"){parseInt(this._intervalDays,10)>0||(this._intervalDays="30"),this._ruleSel="trigger";return}this._scheduleType==="sensor_based"&&this._resetTriggerFields(),e.value==="time_based"&&!(parseInt(this._intervalDays,10)>0)&&(this._intervalDays="30"),this._scheduleType=e.value,this._ruleSel="schedule";return}let t=e.value;e.effect==="combine"?this._combineTrigger(t):this._setSensorRule(t),this._ruleSel="trigger"}_applySuggestion(e){if(e.target==="done_when"){e.entityId!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=e.entityId,this._ruleSel="completion";return}let t=e.triggerType??"threshold";this._scheduleType==="sensor_based"&&(this._triggerType==="compound"||!!this._triggerEntityId)?this._combineTrigger(t,e.entityId):this._setSensorRule(t,e.entityId),this._ruleSel="trigger"}async _loadObjectDevice(){let e=this._entryId;if(!e||this._objectDevice?.entryId===e)return;let t=null,H=null;try{let L=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}))?.objects??[]).find(a=>a.entry_id===e);t=L?.object.ha_device_id??null,H=L?.object.area_id??null}catch{}this._entryId===e&&(this._objectDevice={entryId:e,deviceId:t,areaId:H})}async _loadTemplateChoices(){if(this._templateChoices===null)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._templateChoices=(e?.templates??[]).filter(t=>!t.disabled).flatMap(t=>(t.tasks??[]).map(H=>({...H,template:t.name})))}catch{this._templateChoices=[]}}async _loadCopyChoices(){if(this._copyChoices===null)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._copyChoices=(e?.objects??[]).flatMap(t=>(t.tasks??[]).filter(H=>!H.battery_fleet_task&&!H.part_ref).map(H=>({entryId:t.entry_id,objectName:t.object.name,task:H})))}catch{this._copyChoices=[]}}_applyTemplateTask(e){this._name=e.name,this._type=m9.includes(e.type)?e.type:"custom";let t=e.interval_days&&e.interval_days>0?String(e.interval_days):"";e.schedule_type==="sensor_based"?(this._scheduleType="sensor_based",this._intervalDays=t):e.schedule_type==="manual"||!t?this._scheduleType="manual":(this._scheduleType="time_based",this._intervalDays=t,this._intervalUnit="days"),e.warning_days!==null&&e.warning_days!==void 0&&(this._warningDays=String(e.warning_days)),this._betaStep="form",this._ruleSel=this._scheduleType==="sensor_based"?"add":"schedule",this._ruleSel==="add"&&(this._addTab="device",this._loadObjectDevice())}async _applyCopy(e){let t=this._entryId,H=this._objectChoices;await this._edit(e.entryId,e.task),this._taskId=null,this._entryId=t,this._objectChoices=H,this._series=[],this._isFleetTask=!1,this._lastPerformed="",this._nfcTagId="",this._consumesParts={},this._consumesQtyText={},this._phaseDefs=this._phaseDefs.map(i=>({...i,partId:"",partQty:"",extraParts:[]})),await Promise.all([this._loadParts(),this._loadForeignPools()]),this._betaStep="form",this._ruleSel="task"}_choiceNote(e,t){return e.effect==="replace"?V("beta_rules_replaces",t):e.effect==="combine"?V("beta_rules_combines",t):e.effect==="safety"?V("beta_rules_adds_safety",t):""}_renderAddPicker(e){let t=o`
      <div class="add-tabs" role="tablist" aria-label=${V("beta_rules_add_rule",e)}>
        <button type="button" role="tab" class="add-tab-type" aria-selected=${this._addTab==="type"?"true":"false"}
          @click=${()=>{this._addTab="type"}}>${V("beta_rules_by_type",e)}</button>
        <button type="button" role="tab" class="add-tab-device" aria-selected=${this._addTab==="device"?"true":"false"}
          @click=${()=>{this._addTab="device",this._loadObjectDevice()}}>${V("beta_rules_by_device",e)}</button>
      </div>`;if(this._addTab==="type"){let p=C9({scheduleType:this._scheduleType,intervalDays:this._intervalDays,triggerType:this._triggerType}),c=A=>{let x=this._choiceNote(A,e);return o`
          <button type="button" class="add-choice" data-kind=${A.kind} data-value=${A.value} @click=${()=>this._applyChoice(A)}>
            <ha-icon icon=${A.icon}></ha-icon>
            <span class="add-choice-text">
              <span>${A.kind==="trigger"?i3(A.value,e):V(A.value,e)}</span>
              ${x?o`<span class="add-choice-note">${x}</span>`:M}
            </span>
          </button>`};return o`${t}
        <div class="add-group">${V("task_section_schedule",e)}</div>
        ${p.filter(A=>A.kind==="schedule").map(c)}
        <div class="add-group">${V("task_section_trigger",e)}</div>
        ${p.filter(A=>A.kind==="trigger").map(c)}`}let H=this._objectDevice;if(H===null||H.entryId!==this._entryId)return o`${t}<div class="field-help">…</div>`;if(!H.deviceId&&!H.areaId)return o`${t}<div class="field-help beta-no-device">${V("beta_rules_no_device",e)}</div>`;let i=r9(this.hass,{deviceId:H.deviceId,areaId:H.areaId,ownPlatform:"maintenance_supporter"});if(!i.length)return o`${t}<div class="field-help beta-no-device">${V(H.deviceId?"beta_rules_no_device_entities":"beta_rules_no_area_entities",e)}</div>`;let L=H.areaId||(H.deviceId?this.hass.devices?.[H.deviceId]?.area_id:null)||"",a=this.hass.areas?.[L]?.name||L,n=i.some(p=>p.group==="device"),d=(p,c)=>{if(c>0&&i[c-1].group===p.group)return M;let A=p.group==="device"?V("beta_rules_group_device",e):V(n?"beta_rules_group_area_more":"beta_rules_group_area",e).replace("{area}",a);return o`<div class="add-group device-group" data-group=${p.group}>${A}</div>`};return o`${t}
      ${i.map((p,c)=>o`${d(p,c)}
        <div class="device-entity" data-entity=${p.entityId} data-group=${p.group}>
          <div class="device-entity-name">${p.name}</div>
          <div class="device-entity-choices">
            ${M0(p).map(A=>o`
              <button type="button" class="add-choice" data-target=${A.target} data-type=${A.triggerType??""} @click=${()=>this._applySuggestion(A)}>
                <ha-icon icon=${A.icon}></ha-icon>
                <span>${A.target==="done_when"?V("beta_rules_done_when_suggest",e):i3(A.triggerType??"",e)}</span>
              </button>`)}
          </div>
        </div>`)}`}_renderSidebarBody(e,t){switch(e){case"task":return this._renderIdentity(t);case"schedule":return this._renderScheduleSection(t);case"trigger":return this._renderTriggerSection(t);case"completion":return this._renderCompletionSection(t);case"people":return this._renderPeopleSection(t);case"notifications":return this._renderNotificationsSection(t);default:return this._renderAddPicker(t)}}_renderRules(e){let t=t9(this._ruleDraft(),{lang:e,entityName:p=>i5(this.hass,p),userName:p=>this._userName(p)}),H=new Map(t.map(p=>[p.id,p])),i=[{title:V("task_section_details",e),ids:["task"]},{title:V("task_section_schedule",e),ids:["schedule","trigger"],add:!0},{title:V("task_section_completion",e),ids:["completion"]},{title:V("task_section_people",e),ids:["people"]},{title:V("task_section_notifications",e),ids:["notifications"]}],L=0,a=1,n=[];for(let p of i){L+=2,n.push(o`<h3 class="rules-group-title" style="order:${L}">${p.title}</h3>`);for(let c of p.ids){let A=H.get(c);if(!A)continue;L+=2,this._ruleSel===c&&(a=L+1);let x=this._ruleSel===c;n.push(o`
          <div class="rule-row ${x?"selected":""}" data-row=${A.id} style="order:${L}">
            <button type="button" class="rule-main" aria-expanded=${x?"true":"false"} @click=${()=>this._selectRule(A.id)}>
              <ha-icon icon=${A.icon}></ha-icon>
              <span class="rule-text">
                <span class="rule-sentence">${A.text}</span>
                ${A.chips.map(_=>o`<span class="rule-chip">${_}</span>`)}
                ${A.badges.length?o`<span class="rule-badges">${A.badges.map(_=>o`<span class="rule-badge">${_}</span>`)}</span>`:M}
              </span>
            </button>
            ${A.removable?o`
              <ha-icon-button class="rule-remove" .path=${ve} .label=${V("remove",e)} title=${V("remove",e)}
                @click=${()=>this._removeRule(A.id)}></ha-icon-button>`:M}
          </div>`)}p.add&&(L+=2,this._ruleSel==="add"&&(a=L+1),n.push(o`
          <button type="button" class="rule-add" style="order:${L}" aria-expanded=${this._ruleSel==="add"?"true":"false"}
            @click=${()=>this._selectRule("add")}>
            <ha-icon icon="mdi:plus"></ha-icon>${V("beta_rules_add_rule",e)}
          </button>`))}let d=this._ruleSel;return o`
      <div class="rules-layout">
        ${n}
        <aside class="rules-sidebar ${d?"open":""}" style="order:${a}" aria-label=${d?this._sidebarTitle(d,e):V("beta_rules_select_hint",e)}>
          ${d?o`
                <div class="sidebar-head">
                  <ha-icon-button .path=${he} .label=${V("close",e)} @click=${()=>{this._ruleSel=null}}></ha-icon-button>
                  <span class="sidebar-title">${this._sidebarTitle(d,e)}</span>
                </div>
                <div class="sidebar-body">${this._renderSidebarBody(d,e)}</div>`:o`<div class="sidebar-hint">${V("beta_rules_select_hint",e)}</div>`}
        </aside>
      </div>`}_renderObjectChoice(e){return this._taskId!==null||this._objectChoices.length===0?M:o`
      <div class="select-row">
        ${I()?M:o`<label>${V("object",e)}</label>`}
        ${E({label:V("object",e),value:this._entryId,onChange:t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},o`
          ${this._objectChoices.map(t=>o`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
        `)}
      </div>`}_renderChooser(e){let t=(H,i,L,a,n)=>o`
      <button type="button" class="chooser-item ${H}" @click=${n}>
        <ha-icon icon=${i}></ha-icon>
        <span class="chooser-text">
          <span class="chooser-title">${L}</span>
          <span class="chooser-desc">${a}</span>
        </span>
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>`;return o`
      ${this._renderObjectChoice(e)}
      <div class="chooser">
        ${t("chooser-scratch","mdi:pencil",V("beta_new_scratch",e),V("beta_new_scratch_desc",e),()=>{this._betaStep="form",this._ruleSel="task"})}
        ${t("chooser-sensor","mdi:auto-fix",V("beta_new_from_sensor",e),V("beta_new_from_sensor_desc",e),()=>{this._betaStep="form",this._ruleSel="add",this._addTab="device",this._loadObjectDevice()})}
        ${t("chooser-template","mdi:text-box-outline",V("templates_from",e),V("beta_new_from_template_desc",e),()=>{this._betaStep="template",this._chooserFilter="",this._loadTemplateChoices()})}
        ${t("chooser-copy","mdi:content-copy",V("beta_new_copy",e),V("beta_new_copy_desc",e),()=>{this._betaStep="copy",this._chooserFilter="",this._loadCopyChoices()})}
      </div>`}_renderSearch(e){return o`<input type="search" class="chooser-search" aria-label=${V("beta_new_search",e)} placeholder=${V("beta_new_search",e)}
      .value=${this._chooserFilter} @input=${t=>{this._chooserFilter=t.target.value}} />`}_renderTemplatePick(e){if(this._templateChoices===null)return o`<div class="chooser-empty">…</div>`;let t=this._chooserFilter.trim().toLowerCase(),H=this._templateChoices.filter(i=>!t||`${i.name} ${i.template}`.toLowerCase().includes(t)).slice(0,200);return o`
      ${this._renderSearch(e)}
      <div class="chooser">
        ${H.length?H.map(i=>o`
          <button type="button" class="chooser-item template-task" @click=${()=>this._applyTemplateTask(i)}>
            <ha-icon icon=${i.schedule_type==="sensor_based"?"mdi:gauge":"mdi:calendar-sync"}></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${i.name}</span>
              <span class="chooser-desc">${i.template}${i.interval_days?o` · ${f(i.interval_days,e)} ${V("unit_days",e)}`:M}</span>
            </span>
          </button>`):o`<div class="chooser-empty">—</div>`}
      </div>`}_renderCopyPick(e){if(this._copyChoices===null)return o`<div class="chooser-empty">…</div>`;let t=this._chooserFilter.trim().toLowerCase(),H=this._copyChoices.filter(i=>!t||`${i.task.name} ${i.objectName}`.toLowerCase().includes(t)).slice(0,200);return o`
      ${this._renderSearch(e)}
      <div class="chooser">
        ${H.length?H.map(i=>o`
          <button type="button" class="chooser-item copy-task" @click=${()=>{this._applyCopy(i)}}>
            <ha-icon icon="mdi:content-copy"></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${i.task.name}</span>
              <span class="chooser-desc">${i.objectName}</span>
            </span>
          </button>`):o`<div class="chooser-empty">—</div>`}
      </div>`}_renderBeta(e,t,H){let i=this._betaStep;return o`
      <ha-dialog open class="beta-dialog" .headerTitle=${t}
        .headerSubtitle=${this._series.length>1?V("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length)):void 0}
        @closed=${this._close}>
        <!-- HA's header (2026): the title beside the close button; on a
             step under the start screen HA's back arrow takes its place. -->
        ${i==="template"||i==="copy"?o`<ha-icon-button slot="headerNavigationIcon" class="beta-back" .path=${xe} .label=${V("back",e)}
              @click=${()=>{this._betaStep="choose"}}></ha-icon-button>`:M}
        <div class="content beta-content">
          ${this._error?D("error",this._error):M}
          ${this._warning?D("warning",this._warning):M}
          ${i==="choose"?this._renderChooser(e):i==="template"?this._renderTemplatePick(e):i==="copy"?this._renderCopyPick(e):this._renderRules(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${V("cancel",e)}</ha-button>
          ${i==="form"&&H?o`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${V("task_series_skip",e)}
              </ha-button>`:M}
          ${i==="form"?o`<ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}>
                ${this._loading?V("saving",e):V(H?"task_series_save_next":"save",e)}
              </ha-button>`:M}
        </div>
      </ha-dialog>
    `}render(){if(!this._open)return o``;let e=this._lang,t=this._taskId?V("edit_task",e):V("new_task",e),H=this._seriesIndex+1<this._series.length;return this.betaEditor?this._renderBeta(e,t,H):o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">
          ${t}
          ${this._series.length>1?o`<span class="series-position">${V("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length))}</span>`:M}
        </div>
        <div class="content">
          ${this._error?D("error",this._error):M}
          ${this._warning?D("warning",this._warning):M}
          ${this._renderIdentity(e)}
          ${this._renderScheduleSection(e)}
          ${this._renderTriggerSection(e)}
          ${this._renderCompletionSection(e)}
          ${this._renderPeopleSection(e)}
          ${this._renderNotificationsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${V("cancel",e)}</ha-button>
          ${H?o`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${V("task_series_skip",e)}
              </ha-button>`:M}
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}
          >
            ${this._loading?V("saving",e):V(H?"task_series_save_next":"save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};m._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calMonths","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),m.styles=[I1,a4,V9,g`
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
    /* D#229: one option per line — three sentences flowed into each other. */
    .trigger-end,
    .mirror-todo-choice {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 8px 0;
    }
    .trigger-end-option,
    .mirror-todo-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    /* v1.3.0: completion-action sections (.adaptive-section shares the shell
       but keeps its own class — tests count .ca-section elements) */
    .ca-section,
    .adaptive-section,
    .phases-section,
    .details-section {
      border: 1px solid var(--divider-color);
      border-radius: var(--ms-radius-6, 6px);
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
    /* A phone, and a phone held sideways: 70 % of 390 px plus the title and
       the buttons was taller than the screen, so Save sat below its edge
       with nothing to scroll (2026-10-31). The dialog scrolls as a whole. */
    @media (max-width: 600px), (max-height: 500px) {
      .content {
        min-width: 0;
        max-height: none;
      }
    }
    .dialog-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    /* #233: what a one-tap completion cannot answer */
    .quick-complete-note {
      color: var(--warning-color, #ff9800);
    }
    /* #232: a responsible person outranks the people it is shared with */
    .shared-responsible-wins {
      color: var(--warning-color, #ff9800);
    }
    /* #235: "2 of 5" while a series of tasks is edited */
    .series-position {
      margin-inline-start: 8px;
      font-size: 14px;
      font-weight: 400;
      color: var(--secondary-text-color);
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
      border-radius: var(--ms-radius-6, 6px);
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
  `],s([v({attribute:!1})],m.prototype,"hass",2),s([v({type:Boolean,attribute:"checklists-enabled"})],m.prototype,"checklistsEnabled",2),s([v({type:Boolean,attribute:"schedule-time-enabled"})],m.prototype,"scheduleTimeEnabled",2),s([v({type:Boolean,attribute:"completion-actions-enabled"})],m.prototype,"completionActionsEnabled",2),s([v({type:Boolean,attribute:"adaptive-feature"})],m.prototype,"adaptiveFeature",2),s([v({type:Boolean,attribute:"seasonal-feature"})],m.prototype,"seasonalFeature",2),s([v({type:Boolean,attribute:"environmental-feature"})],m.prototype,"environmentalFeature",2),s([v({type:Number,attribute:"default-warning-days"})],m.prototype,"defaultWarningDays",2),s([v({attribute:!1})],m.prototype,"mirrorTodoDefault",2),s([v({type:Boolean,attribute:"beta-editor"})],m.prototype,"betaEditor",2),s([l()],m.prototype,"_ruleSel",2),s([l()],m.prototype,"_addTab",2),s([l()],m.prototype,"_betaStep",2),s([l()],m.prototype,"_chooserFilter",2),s([l()],m.prototype,"_templateChoices",2),s([l()],m.prototype,"_copyChoices",2),s([l()],m.prototype,"_objectDevice",2),s([l()],m.prototype,"parts",2),s([l()],m.prototype,"_foreignOwners",2),s([l()],m.prototype,"_open",2),s([l()],m.prototype,"_entityPickerFallback",2),s([l()],m.prototype,"_loading",2),s([l()],m.prototype,"_error",2),s([l()],m.prototype,"_warning",2),s([l()],m.prototype,"_entryId",2),s([l()],m.prototype,"_taskId",2),s([l()],m.prototype,"_series",2),s([l()],m.prototype,"_seriesIndex",2),s([l()],m.prototype,"_isFleetTask",2),s([l()],m.prototype,"_objectChoices",2),s([l()],m.prototype,"_name",2),s([l()],m.prototype,"_type",2),s([l()],m.prototype,"_scheduleType",2),s([l()],m.prototype,"_intervalDays",2),s([l()],m.prototype,"_intervalUnit",2),s([l()],m.prototype,"_dueDate",2),s([l()],m.prototype,"_warningDays",2),s([l()],m.prototype,"_earliestCompletionDays",2),s([l()],m.prototype,"_intervalAnchor",2),s([l()],m.prototype,"_weekdays",2),s([l()],m.prototype,"_nth",2),s([l()],m.prototype,"_nthWeekday",2),s([l()],m.prototype,"_domDay",2),s([l()],m.prototype,"_domLastDay",2),s([l()],m.prototype,"_domBusiness",2),s([l()],m.prototype,"_calOffset",2),s([l()],m.prototype,"_calMonths",2),s([l()],m.prototype,"_calendarEntity",2),s([l()],m.prototype,"_seasonMonths",2),s([l()],m.prototype,"_endsMode",2),s([l()],m.prototype,"_endsCount",2),s([l()],m.prototype,"_endsUntil",2),s([l()],m.prototype,"_schedulePreview",2),s([l()],m.prototype,"_schedulePreviewEnded",2),s([l()],m.prototype,"_notes",2),s([l()],m.prototype,"_documentationUrl",2),s([l()],m.prototype,"_customIcon",2),s([l()],m.prototype,"_notifyIcon",2),s([l()],m.prototype,"_priority",2),s([l()],m.prototype,"_labels",2),s([l()],m.prototype,"_detailsOpen",2),s([l()],m.prototype,"_mirrorTodoEntities",2),s([l()],m.prototype,"_mirrorTodoMode",2),s([l()],m.prototype,"_completeWhenEntity",2),s([l()],m.prototype,"_completeWhenState",2),s([l()],m.prototype,"_completeWhenAnyTime",2),s([l()],m.prototype,"_completeWhenFor",2),s([l()],m.prototype,"_enabled",2),s([l()],m.prototype,"_triggerEntityId",2),s([l()],m.prototype,"_triggerEntityIds",2),s([l()],m.prototype,"_triggerEntityLogic",2),s([l()],m.prototype,"_triggerAttribute",2),s([l()],m.prototype,"_triggerType",2),s([l()],m.prototype,"_triggerAbove",2),s([l()],m.prototype,"_triggerBelow",2),s([l()],m.prototype,"_triggerEquals",2),s([l()],m.prototype,"_triggerNotEquals",2),s([l()],m.prototype,"_triggerForMinutes",2),s([l()],m.prototype,"_triggerCombinator",2),s([l()],m.prototype,"_triggerTargetValue",2),s([l()],m.prototype,"_triggerDeltaMode",2),s([l()],m.prototype,"_triggerBaselineValue",2),s([l()],m.prototype,"_liveBaselineValue",2),s([l()],m.prototype,"_autoCompleteOnRecovery",2),s([l()],m.prototype,"_holdUntilDone",2),s([l()],m.prototype,"_triggerFromState",2),s([l()],m.prototype,"_triggerToState",2),s([l()],m.prototype,"_triggerTargetChanges",2),s([l()],m.prototype,"_triggerRuntimeHours",2),s([l()],m.prototype,"_triggerDaysBefore",2),s([l()],m.prototype,"_triggerRuntimeMaxSession",2),s([l()],m.prototype,"_triggerOnStates",2),s([l()],m.prototype,"_triggerDetailAttribute",2),s([l()],m.prototype,"_compoundLogic",2),s([l()],m.prototype,"_compoundConditions",2),s([l()],m.prototype,"_suggestedAttributes",2),s([l()],m.prototype,"_availableAttributes",2),s([l()],m.prototype,"_entityDomain",2),s([l()],m.prototype,"_lastPerformed",2),s([l()],m.prototype,"_nfcTagId",2),s([l()],m.prototype,"_requireTagScan",2),s([l()],m.prototype,"_allowSkip",2),s([l()],m.prototype,"_notifyEnabled",2),s([l()],m.prototype,"_readingUnit",2),s([l()],m.prototype,"_readings",2),s([l()],m.prototype,"_consumesParts",2),s([l()],m.prototype,"_consumesQtyText",2),s([l()],m.prototype,"_partsLoadFailed",2),s([l()],m.prototype,"_availableTags",2),s([l()],m.prototype,"_responsibleUserId",2),s([l()],m.prototype,"_assigneePool",2),s([l()],m.prototype,"_rotationStrategy",2),s([l()],m.prototype,"_availableUsers",2),s([l()],m.prototype,"_checklistText",2),s([l()],m.prototype,"_phaseDefs",2),s([l()],m.prototype,"_phaseSeq",2),s([l()],m.prototype,"_requiredCompletion",2),s([l()],m.prototype,"_scheduleTime",2),s([l()],m.prototype,"_scheduleTimeOn",2),s([l()],m.prototype,"_actionService",2),s([l()],m.prototype,"_actionTargetEntity",2),s([l()],m.prototype,"_actionSkipAuto",2),s([l()],m.prototype,"_actionPresent",2),s([l()],m.prototype,"_actionData",2),s([l()],m.prototype,"_actionDataJsonFallback",2),s([l()],m.prototype,"_actionTesting",2),s([l()],m.prototype,"_actionTestResult",2),s([l()],m.prototype,"_actionTestError",2),s([l()],m.prototype,"_quickOn",2),s([l()],m.prototype,"_qcNotes",2),s([l()],m.prototype,"_qcCost",2),s([l()],m.prototype,"_qcDuration",2),s([l()],m.prototype,"_qcFeedback",2),s([l()],m.prototype,"_environmentalEntity",2),s([l()],m.prototype,"_environmentalAttribute",2),s([l()],m.prototype,"_adaptiveEnabled",2),s([l()],m.prototype,"_adaptiveAlpha",2),s([l()],m.prototype,"_adaptiveMin",2),s([l()],m.prototype,"_adaptiveMax",2),s([l()],m.prototype,"_adaptiveSeasonal",2),s([l()],m.prototype,"_adaptivePrediction",2),s([l()],m.prototype,"_conditionAttrOptions",2);m0=m;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",m0)});async function ke(C,r,e){let t=C.auth;if(t?.expired&&t.refreshAccessToken)try{await t.refreshAccessToken()}catch{}return fetch(r,{...e,headers:{...e.headers??{},Authorization:`Bearer ${t?.data?.access_token??""}`}})}async function Oe(C,r,e,t="doc_too_large",H=[]){let i=await ke(C,r,{method:"POST",body:e});if(i.status===413)throw new Error(t);if(!i.ok){let L=await i.json().catch(()=>null);throw typeof L?.code=="string"&&H.includes(L.code)?new Error(L.code):new Error("doc_upload_failed")}return await i.json()}async function $e(C,r,e,t,H){if(e.size>we)throw new Error("doc_too_large");let i=new FormData;i.append("entry_id",r);for(let a of t)i.append("tags",a);H&&i.append("purpose",H),i.append("file",e,e.name);let L=await Oe(C,"/api/maintenance_supporter/document/upload",i);if(!L.id)throw new Error("doc_upload_failed");return{id:L.id,deduped:!!L.deduped,duplicate_in_object:L.duplicate_in_object??null}}async function f9(C,r,e){return(await $e(C,r,e,["photo"],"completion")).id}async function A0(C,r,e){await Promise.all(e.map(t=>C.connection.sendMessagePromise({type:"maintenance_supporter/documents/discard_upload",entry_id:r,doc_id:t}).catch(()=>{})))}var we,IV,Z9=u(()=>{"use strict";Y2();we=100*1024*1024,IV=500*1024*1024});var b2,u0=u(()=>{"use strict";b();Z9();b2=class{constructor(r,e){this.host=r;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,r.addController(this)}hostConnected(){}get ids(){return this.photos.map(r=>r.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(r){return this.errorKey?V(this.errorKey,r).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(r=[]){this._endSession(),this._revokeAll(),this.photos=r.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(r){if(r.length===0)return;let e=this._session,t=this.opts.hass(),H=this.opts.entryId(),i=r.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let L of i){let a=await f9(t,H,L);if(e!==this._session){A0(t,H,[a]);return}this.uploadedIds=[...this.uploadedIds,a],this._uploadEntry.set(a,H),this.photos=[...this.photos,{id:a,preview:URL.createObjectURL(L)}],this.host.requestUpdate()}r.length>i.length&&(this.errorKey="photos_limit")}catch(L){if(e!==this._session)return;this.errorKey=L instanceof Error&&L.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(r){let e=this.photos.find(t=>t.id===r);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(t=>t.id!==r),this.uploadedIds.includes(r)&&(this.uploadedIds=this.uploadedIds.filter(t=>t!==r),this._discard([r])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let r=this.uploadedIds;this.uploadedIds=[],this._discard(r)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(r){let e=new Map;for(let H of r){let i=this._uploadEntry.get(H)??this.opts.entryId();this._uploadEntry.delete(H),e.set(i,[...e.get(i)??[],H])}let t=this.opts.hass();for(let[H,i]of e)A0(t,H,i)}_revokeAll(){for(let r of this.photos)r.preview&&URL.revokeObjectURL(r.preview)}}});function a3(){if(window.externalApp!==void 0)return!0;let r=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(r)&&/Android/.test(r)}var v0=u(()=>{"use strict"});function Te(C){!(C instanceof HTMLElement)||typeof C.showPopover!="function"||queueMicrotask(()=>{if(!(!C.isConnected||C.matches(":popover-open")))try{C.showPopover()}catch{}})}var n3,s3,h0=u(()=>{"use strict";y();H3();n3=y2(Te),s3=g`
  :where(.top-layer[popover]) {
    position: fixed;
    inset: 0;
    width: auto;
    height: auto;
    max-width: none;
    max-height: none;
    margin: 0;
    border: 0;
    padding: 0;
    overflow: visible;
    color: inherit;
    background: none;
  }
`});function S9(C){try{return localStorage.getItem(C)}catch{return null}}function y9(C,r){try{localStorage.setItem(C,r)}catch{}}var x0,b9=u(()=>{"use strict";x0={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraLabel:"msp-camera-label",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort",areaSort:"msp-area-sort",objectTreeOpen:"msp-object-tree-open",objectTableSort:"msp-object-table-sort",filterPane:"msp-filter-pane"}});function E9(){if(!a3())return!1;let C=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!C&&typeof C.getUserMedia=="function"}function O9(C){let r=/camera2?\s*(\d+)/i.exec(C);return r?Number(r[1]):Number.MAX_SAFE_INTEGER}function $9(C,r){if(r){let t=C.find(H=>H.label===r);if(t)return t}return C.filter(t=>t.label&&P9.test(t.label)).sort((t,H)=>O9(t.label)-O9(H.label))[0]??null}var Ee,Pe,Re,Be,k9,P9,w9,T9,Fe,L1,_0=u(()=>{"use strict";y();q();b();v0();h0();b9();l0();Ee=1920,Pe=.88,Re={retryMs:500,windowMs:5e3},Be=new Set(["NotReadableError","AbortError","TrackStartError"]),k9=80,P9=/back|rear|environment|rück|hinten/i,w9=/front|user|selfie|vorne/i;T9=C=>C?.name||"Error",Fe=C=>C?.message||"",L1=class extends S{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...Re};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let H=S9(x0.cameraLabel),i=await this._enumerate(t);if(!this._live(e))return;let L=$9(i,H),a="refused";if(L&&(a=await this._openPatiently(t,e,this._byDevice(L))),a==="cancelled")return;if(a!=="ok"){if(a=await this._openPatiently(t,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),a==="cancelled")return;if(a!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(i=await this._enumerate(t),!this._live(e)){this._stopStream();return}}if(this._devices=i,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let n=L?null:$9(i,H),d=this._deviceIndex>=0?i[this._deviceIndex]:void 0;if(!n||n.deviceId===d?.deviceId)return;let p=await this._replace(t,e,[this._byDevice(n)],this._restoreCandidates(d));if(p!=="cancelled"){if(p==="lost"){this._unavailable("camera_lost");return}this._settle(p)}}async _openPatiently(e,t,H){let i=Date.now();for(;;){let L;try{L=await e.getUserMedia({video:H.video,audio:!1})}catch(a){let n=T9(a),d=Fe(a);if(this._lastError=n,this._note(`${H.what} \u2192 ${n}${d&&d!==n?`: ${d}`:""}`),!this._live(t))return"cancelled";if(!Be.has(n))return"refused";if(Date.now()-i+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(p=>setTimeout(p,this.timing.retryMs)),!this._live(t))return"cancelled";continue}if(!this._live(t)){for(let a of L.getTracks())a.stop();return"cancelled"}return this._stream=L,this._note(`${H.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,t,H,i){this._switching=!0,this._stopStream();try{for(let L of H){let a=await this._openPatiently(e,t,L);if(a==="ok")return L;if(a==="cancelled")return a;if(a==="busy"){L.deviceId&&this._refused.add(L.deviceId);break}}for(let L of i){let a=await this._openPatiently(e,t,L);if(a==="ok")return"restored";if(a==="cancelled")return a}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let H=this._indexOfCurrent();return H>=0&&(this._deviceIndex=H),this._attach(),!1}this._switchFailed=!1;let t=e.deviceId?this._devices.findIndex(H=>H.deviceId===e.deviceId):-1;return this._deviceIndex=t>=0?t:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,t){let H=[],i=e?.deviceId||t;return i&&H.push({video:{deviceId:{exact:i}},what:`${e?.label||"previous camera"} (back again)`,deviceId:i}),H.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),H}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let t=(await e.enumerateDevices()).filter(H=>H.kind==="videoinput"&&!!H.deviceId);return this._note(`cameras: ${t.map(H=>H.label||"(no label)").join(" | ")||"none listed"}`),t}catch(t){return this._note(`enumerateDevices \u2192 ${T9(t)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let t=e.getSettings().deviceId,H=t?this._devices.findIndex(i=>i.deviceId===t):-1;return H>=0?H:e.label?this._devices.findIndex(i=>i.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],t=e?.getSettings().facingMode;if(t==="user"||t==="environment")return t;let H=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return w9.test(H)?"user":P9.test(H)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let t=e.getSettings(),H=t.width&&t.height?`${t.width}\xD7${t.height}`:"size ?";return[e.label||"no label",H,t.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>k9&&this._log.splice(1,this._log.length-k9)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let t=this._gen,H=this._deviceIndex,i=H>=0?this._devices[H]:void 0,L=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||i?.deviceId,a=this._facing==="user"?"environment":"user",n=this._nextCameras(H,L);!n.length&&this._refused.size&&(this._refused.clear(),n=this._nextCameras(H,L)),this._note(`switch from ${i?.label||"unknown camera"}`);let d=[...n.map(p=>this._byDevice(this._devices[p])),{video:{facingMode:{exact:a}},what:`facing ${a} (exact)`},{video:{facingMode:{ideal:a}},what:`facing ${a}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let p=await this._replace(e,t,d,this._restoreCandidates(i,L));if(p==="cancelled")return;if(p==="lost"){this._unavailable("camera_lost");return}if(p!=="restored"&&!p.deviceId){if(this._isCamera(L,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=a}if(this._settle(p)&&p!=="restored"&&p.deviceId){let c=this._devices[this._deviceIndex]?.label??"";c&&y9(x0.cameraLabel,w9.test(c)?"":c)}}finally{this._busy=!1}}_nextCameras(e,t){let H=this._devices.length,i=[];for(let L=1;L<=(e<0?H:H-1);L++){let a=(e+L)%H,n=this._devices[a].deviceId;n===t||this._refused.has(n)||i.push(a)}return i}_isCamera(e,t){let H=this._stream?.getVideoTracks()[0]?.getSettings();return e&&H?.deviceId?H.deviceId===e:!!H?.facingMode&&H.facingMode===t}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let t of this._stream?.getTracks()??[])t.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),t=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),t=!0)}catch{}if(!t){let H=this.shadowRoot?.querySelector(".details textarea");if(H){H.focus(),H.select();try{t=document.execCommand("copy")}catch{t=!1}}}this._copied=t}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let t=e.videoWidth||640,H=e.videoHeight||480,i=Math.min(1,Ee/Math.max(t,H)),L=document.createElement("canvas");L.width=Math.round(t*i),L.height=Math.round(H*i);let a=L.getContext("2d");if(!a)throw new Error("no_canvas");a.drawImage(e,0,0,L.width,L.height);let n=await new Promise(c=>L.toBlob(c,"image/jpeg",Pe));if(!n)throw new Error("no_blob");let d=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),p=new File([n],`photo-${d}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:p},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return M;let e=this.lang,t=this._busy||this._switching;return o`
      <div class="overlay top-layer" popover="manual" ${n3} role="dialog" aria-modal="true" aria-label=${V("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switching?o`<div class="switching" role="status">${V("camera_switching",e)}</div>`:M}
        ${this._switchFailed?o`<div class="switch-note" role="status">
              <div>${V("camera_not_answered",e)}</div>
              ${Z1({cls:"details",header:V("camera_diagnostics",e)},o`
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${V(this._copied?"camera_copied":"camera_copy",e)}</button>
              `)}
            </div>`:M}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${V("cancel",e)}</button>
          ${this._devices.length>1?o`<button type="button" class="switch" ?disabled=${t} title=${V("camera_switch_lens",e)} aria-label=${V("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:M}
          <button type="button" class="shoot" ?disabled=${t} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${V("camera_capture_shoot",e)}</span>
          </button>
        </div>
      </div>
    `}};L1.styles=[s3,g`
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
      border: 1px solid rgba(255, 255, 255, 0.3); border-radius: var(--ms-radius-6, 6px); padding: 6px; resize: vertical;
    }
    .copy { background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, 0.6); padding: 6px 14px; font-size: 13px; }
    .shoot { background: var(--primary-color, #03a9f4); color: #fff; border: none; font-weight: 600; }
    .shoot[disabled] { opacity: 0.6; cursor: default; }
    .shoot ha-icon { --mdc-icon-size: 22px; }
  `],s([v({type:String})],L1.prototype,"lang",2),s([l()],L1.prototype,"_open",2),s([l()],L1.prototype,"_busy",2),s([l()],L1.prototype,"_switching",2),s([l()],L1.prototype,"_devices",2),s([l()],L1.prototype,"_deviceIndex",2),s([l()],L1.prototype,"_switchFailed",2),s([l()],L1.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",L1)});var M3,o1,n5=u(()=>{"use strict";y();q();b();v0();_0();_0();M3=g`
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
`,o1=class extends S{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=a3();this._inAppCamera=E9()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target,H=Array.from(t.files??[]);t.value="",this._emit(H)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return M;let e=this.lang,t=this._locked?"disabled":"",H=this.busy?V("uploading",e):V("doc_camera",e),i=V(this._singlePick?"choose_photo":"choose_photos",e);return o`
      <div class="photo-pickers">
        ${this.showCamera?o`<label class="photo-pick photo-pick-camera ${t}" role="button" tabindex="0"
              aria-label=${H} title=${this.compact?H:M}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?M:o`<span>${H}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:M}
        ${this.showGallery?o`<label class="photo-pick photo-pick-gallery ${t}" role="button" tabindex="0"
              aria-label=${i} title=${this.compact?i:M}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?M:o`<span>${i}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:M}
      </div>
      ${this.showGallery&&this._singlePick?o`<div class="photo-android-hint">${V("photos_android_hint",e)}</div>`:M}
      ${this.showCamera&&this._inAppCamera?o`<ms-camera-capture .lang=${e}
            @photo-captured=${L=>this._emit([L.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:M}
    `}};s([v({type:String})],o1.prototype,"lang",2),s([v({type:Boolean})],o1.prototype,"disabled",2),s([v({type:Boolean})],o1.prototype,"busy",2),s([v({type:String})],o1.prototype,"accept",2),s([v({type:Boolean})],o1.prototype,"showCamera",2),s([v({type:Boolean})],o1.prototype,"showGallery",2),s([v({type:Boolean})],o1.prototype,"compact",2),s([v({type:Number})],o1.prototype,"remaining",2),s([l()],o1.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",o1)});var k2,Z,R9=u(()=>{"use strict";y();q();L2();b();f1();H5();e1();C5();U5();c2();i0();u0();z5();f2();e3();n5();n5();i1();q1();V3();k2=j1,Z=class extends S{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new b2(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={};this.prefill=null}open(e={}){if(this._open)return;this._open=!0,this.viaTagScan=!!e.viaTagScan;let t=this.prefill;this._notes=t?.notes??"",this._cost=t?.cost!=null?String(t.cost):"",this._duration=t?.duration!=null?String(t.duration):"",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((H,i)=>[String(i),!!this.checklistPrefill[H]]).filter(([,H])=>H)),this._feedback=t?.feedback??"needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(H=>[d1(H),{...H}])),this._usedQtyText={}}_rangeError(e,t){let H=this.lang;return V("settings_value_out_of_range",H).replace("{min}",f(e,H,{maximumFractionDigits:2})).replace("{max}",f(t,H,{maximumFractionDigits:2}))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId},t=this._notes.trim();if(t&&(e.notes=t),this._cost){let n=parseFloat(this._cost);isNaN(n)||(e.cost=n)}let H=a2(this._duration);if(H!==null&&(e.duration=H),this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(J(this._completedAt)>Date.now()){this._error=V("completed_at_future_error",this.lang);return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let n={};for(let d of this.readings){let p=(this._readingValues[d.id]??"").trim();if(p==="")continue;let c=parseFloat(p.replace(",","."));isNaN(c)||(n[d.id]=c)}Object.keys(n).length>0&&(e.reading_values=n)}else if(this._readingValue!==""){let n=parseFloat(this._readingValue);isNaN(n)||(e.reading_value=n)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let n=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(n)||n<_2[0]||n>_2[1]){this._error=this._rangeError(..._2);return}e.restock_quantity=n}if(this.parts.length>0){let n=[];for(let[d,p]of Object.entries(this._usedParts)){let c=this._usedQtyText[d],A=c===void 0?p.quantity:parseFloat(c.replace(",","."));if(!Number.isFinite(A)||A<k2[0]||A>k2[1]){this._error=this._rangeError(...k2);return}n.push({...p,quantity:A})}e.used_parts=n.map(d=>d.entry_id?{part_id:d.part_id,quantity:d.quantity,entry_id:d.entry_id}:{part_id:d.part_id,quantity:d.quantity})}let i=await F(this,e,{busy:n=>{this._loading=n},lang:this.lang,fallbackKey:"save_error",onError:n=>{this._error=n}});if(i===void 0)return;let L=G5(i,this.lang);if(L){this._close(),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:L},bubbles:!0,composed:!0}));return}this._photos.markAttached(),this._open=!1;let a={entryId:this.entryId,taskId:this.taskId,taskName:this.taskName,undo:i?.undo===!0};this.dispatchEvent(new CustomEvent("task-completed",{detail:a}))}_renderReadingField(e,t){let H=this._completedAt?J(this._completedAt):NaN,i=p4(this.readingHistory,e.id,isNaN(H)?void 0:H),L=e.unit||this.readingUnit,a=(this._readingValues[e.id]??"").trim(),n=a===""?NaN:parseFloat(a.replace(",",".")),d=i!==void 0&&!isNaN(n)&&n<i.value,p=i!==void 0?f(i.value,t,{maximumFractionDigits:3}):"";return o`
      <label class="field reading-field">
        <span class="field-label">${e.name}${L?` (${L})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${i!==void 0?V("reading_last",t).replace("{value}",p):""}
          .value=${this._readingValues[e.id]??""}
          @input=${c=>{this._readingValues={...this._readingValues,[e.id]:c.target.value}}} />
        ${d?o`<span class="reading-warn">${V("reading_below_last",t).replace("{value}",p)}</span>`:M}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_demands(e){return this.requiredFields.includes(e)}_req(e){return this._demands(e)?o`<span class="req-mark" aria-hidden="true">*</span>`:M}_purchaseSuggestion(){if(this.restockDefault===null)return null;let e=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(e)||e<=0?null:S5(this.restockUnitCost*e)}_partsValues(){let e={booked:null,info:null};if(this.restockDefault!==null||!this.parts.length)return e;for(let t of Object.values(this._usedParts)){let H=this.parts.find(a=>d1({part_id:a.id,entry_id:a.entry_id})===d1(t)),i=x7(H);if(i===null)continue;let L=Z5(H,this.partsCostMode)==="use"?"booked":"info";e[L]=(e[L]??0)+i*(t.quantity||1)}for(let t of["booked","info"])e[t]!==null&&(e[t]=S5(e[t]));return e}_renderCostSuggestion(e){let t=this._purchaseSuggestion();if(this.restockDefault!==null){let a=this.partsCostMode==="use"?o`<div class="cost-note">${V("cost_purchase_use_hint",e)}</div>`:M;if(this._cost.trim()!==""||t==null||t<=0)return a;let n=Y(t,this.currencySymbol,e);return o`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(S5(t))}
        >${V("cost_from_parts",e).replace("{amount}",n)}</button>${a}`}let{booked:H,info:i}=this._partsValues(),L=(a,n)=>a!=null&&a>0?o`<div class="cost-note">${V(n,e).replace("{amount}",Y(a,this.currencySymbol,e))}</div>`:M;return o`${L(H,"cost_parts_booked")}${L(i,"cost_parts_info")}`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=`${O7()}:00`}render(){if(!this._open)return o``;let e=this.lang||T(this.hass),t=this._error||this._photos.errorText(e);return o`
      <ha-dialog open .headerTitle=${_1(`${V("complete_title",e)}${this.taskName}`)} @closed=${this._close}>
        ${g1(`${V("complete_title",e)}${this.taskName}`)}
        ${this.phaseLabel?o`<div class="phase-line">${V("phase_current",e)}: ${this.phaseLabel}</div>`:M}
        ${this.requireTagScan&&!this.viaTagScan?o`<div class="scan-required-note">${V("require_tag_scan_hint",e)}</div>`:M}
        <div class="content">
          ${t?D("error",t):M}
          ${this.checklist.length>0?o`
            <div class="checklist-section">
              <label class="checklist-label">${V("checklist",e)}</label>
              ${this.checklist.map((H,i)=>o`
                ${O({cls:"checklist-item",checked:!!this._checklistState[String(i)],onChange:()=>this._toggleCheck(i)},o`<span>${H}</span>`)}
              `)}
            </div>
          `:M}
          ${this.readings.length>0?o`<div class="readings-block">
                <span class="field-label">${V("readings_section",e)}</span>
                ${this.readings.map(H=>this._renderReadingField(H,e))}
              </div>`:this.taskType==="reading"?o`
              <label class="field">
                <span class="field-label">${V("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${H=>this._readingValue=H.target.value} />
              </label>`:M}
          ${this.parts.length?o`<div class="used-parts">
                <span class="field-label">${V("complete_parts_used",e)}</span>
                ${this.parts.map(H=>{let i=d1({part_id:H.id,entry_id:H.entry_id}),L=this._usedParts[i],a=L!==void 0,n=H.entry_id?{part_id:H.id,quantity:1,entry_id:H.entry_id}:{part_id:H.id,quantity:1};return o`<div class="used-part-row">
                    ${O({cls:"used-part-check",checked:a,onChange:d=>{let p={...this._usedParts};if(d.target.checked)p[i]=p[i]||n;else{delete p[i];let c={...this._usedQtyText};delete c[i],this._usedQtyText=c}this._usedParts=p}},o`<span
                        >${H.name}${H.owner_name?o`<span class="used-part-owner"> (${H.owner_name})</span>`:M}${H.stock!==null&&H.stock!==void 0?` (${v2(H.stock,H.unit,e)})`:""}</span
                      >`)}
                    ${a?o`<input class="used-part-qty" type="number" min=${k2[0]} max=${k2[1]} step="0.01"
                          .value=${this._usedQtyText[i]??String(L.quantity)}
                          @input=${d=>{let p=d.target.value;this._usedQtyText={...this._usedQtyText,[i]:p};let c=parseFloat(p.replace(",","."));Number.isFinite(c)&&c>=k2[0]&&(this._usedParts={...this._usedParts,[i]:{...n,quantity:c}})}} />`:M}
                  </div>`})}
              </div>`:this.consumesInfo.length?o`<div class="consumes-hint">
                  ${this.consumesInfo.map(H=>o`<div>${H}</div>`)}
                </div>`:M}
          ${this.restockDefault!==null?o`
              <label class="field">
                <span class="field-label">${V("restock_quantity_label",e)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
                <input type="number" step="0.01" min=${_2[0]} max=${_2[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${H=>this._restockQty=H.target.value} />
              </label>`:M}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${this._demands("notes")?V("notes_label",e):V("notes_optional",e)}${this._req("notes")}</span>
            <!-- Several lines (#202): what was done, one line each. The
                 history and the printouts keep the line breaks; they show
                 notes as plain text, so no Markdown hint here. -->
            <textarea class="field-input notes-input" rows="3"
              .value=${this._notes}
              @input=${H=>this._notes=H.target.value}></textarea>
          </label>
          <div class="field">
            <span class="field-label">${this._demands("cost")?V("cost",e):V("cost_optional",e)}${this._req("cost")}</span>
            <ms-cost-input .lang=${e} .value=${this._cost}
              @value-changed=${H=>this._cost=H.detail.value}></ms-cost-input>
            ${this._renderCostSuggestion(e)}
          </div>
          <label class="field">
            <span class="field-label">${this._demands("duration")?V("quick_complete_defaults_duration",e):V("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="1" min="0" inputmode="numeric" class="field-input"
              .value=${this._duration}
              @input=${H=>this._duration=H.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${V("completed_at_optional",e)}</span>
            ${this._completedAt?o`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  .helper=${B5(e)}
                  @value-changed=${H=>this._completedAt=H.detail.value}
                ></ms-date-field>`:o`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${V("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${this._demands("photo")?V("completion_photos",e):V("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?o`<div class="photo-strip">
                  ${this._photos.photos.map(H=>o`
                    <div class="photo-preview">
                      <img src=${H.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(H.id)}
                        title="${V("remove",e)}">✕</button>
                    </div>`)}
                </div>`:M}
            ${this._photos.full?o`<div class="photo-limit">${V("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:o`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${H=>this._photos.addFiles(H.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?o`
            <div class="feedback-section">
              <label class="feedback-label">${V("was_maintenance_needed",e)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${V("feedback_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${V("feedback_not_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${V("feedback_not_sure",e)}</button>
              </div>
            </div>
          `:M}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${V("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?V("uploading",e):this._missingRequired.length?this._missingRequired.map(H=>V("err_required",e).replace("{field}",V(Z2[H]??H,e))).join(" \xB7 "):""}
          >
            ${this._loading?V("completing",e):V("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};Z.styles=[I1,M3,g`
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
      border-radius: var(--ms-radius-6, 6px);
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
      width: 76px; padding: 6px 8px; border-radius: var(--ms-radius-6, 6px); font: inherit; font-size: 14px;
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
  `],s([v({attribute:!1})],Z.prototype,"hass",2),s([v()],Z.prototype,"entryId",2),s([v()],Z.prototype,"taskId",2),s([v()],Z.prototype,"taskName",2),s([v()],Z.prototype,"lang",2),s([v({type:Array})],Z.prototype,"checklist",2),s([v({type:Boolean})],Z.prototype,"adaptiveEnabled",2),s([v()],Z.prototype,"taskType",2),s([v()],Z.prototype,"readingUnit",2),s([v({attribute:!1})],Z.prototype,"readings",2),s([v({attribute:!1})],Z.prototype,"readingHistory",2),s([v({attribute:!1})],Z.prototype,"restockDefault",2),s([v({attribute:!1})],Z.prototype,"restockUnitCost",2),s([v({attribute:!1})],Z.prototype,"restockPackage",2),s([v()],Z.prototype,"currencySymbol",2),s([v({attribute:!1})],Z.prototype,"partsCostMode",2),s([v({attribute:!1})],Z.prototype,"parts",2),s([v({attribute:!1})],Z.prototype,"consumesParts",2),s([v({type:Array})],Z.prototype,"consumesInfo",2),s([v({type:Array})],Z.prototype,"requiredFields",2),s([v()],Z.prototype,"phaseLabel",2),s([v({type:Boolean})],Z.prototype,"requireTagScan",2),s([v({type:Boolean})],Z.prototype,"viaTagScan",2),s([l()],Z.prototype,"_open",2),s([l()],Z.prototype,"_notes",2),s([l()],Z.prototype,"_cost",2),s([l()],Z.prototype,"_duration",2),s([l()],Z.prototype,"_loading",2),s([l()],Z.prototype,"_error",2),s([l()],Z.prototype,"_checklistState",2),s([l()],Z.prototype,"_feedback",2),s([l()],Z.prototype,"_readingValue",2),s([l()],Z.prototype,"_readingValues",2),s([l()],Z.prototype,"_restockQty",2),s([l()],Z.prototype,"_completedAt",2),s([l()],Z.prototype,"_usedParts",2),s([l()],Z.prototype,"_usedQtyText",2),s([v({attribute:!1})],Z.prototype,"checklistPrefill",2),s([v({attribute:!1})],Z.prototype,"prefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",Z)});function Ie(C,r){C.key!=="Escape"||C.defaultPrevented||C.composedPath().some(e=>e instanceof Element&&e.localName==="ms-camera-capture")||(C.preventDefault(),C.stopPropagation(),r())}function M2(){return V1("ha-adaptive-dialog")}function O2(C,r,e={}){return M2()?o`
      <ha-adaptive-dialog open .headerTitle=${e.title}
        @closed=${t=>{t.target===t.currentTarget&&C()}}>
        <div class="ha-shell-body">${r}</div>
      </ha-adaptive-dialog>
    `:o`
    <div class="modal-layer top-layer" popover="manual" ${n3}>
      <div class="backdrop" @click=${C}></div>
      <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
        @keydown=${t=>Ie(t,C)}>${r}</div>
    </div>
  `}function $2(C){C?.querySelector(".dialog")?.focus({preventScroll:!0})}var w2,l3=u(()=>{"use strict";y();i1();h0();w2=g`
  ${s3}
  .modal-layer {
    display: block;
    z-index: var(--ms-modal-z, 100);
  }
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
  /* The beta UI's body inside ha-adaptive-dialog: the frame's column. */
  .ha-shell-body {
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
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
`});var Q,B9=u(()=>{"use strict";y();q();b();i1();c0();V3();Q=class extends S{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._check="";this._checked=!0;this._resolve=null;this._promptResolve=null;this._checkResolve=null}_show(e){this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"",this._options=e.options&&e.options.length?e.options:null,this._inputValue=e.inputValue||"",this._check=e.check||"",this._checked=!0,this._resolve=null,this._promptResolve=null,this._checkResolve=null,this._open=!0}confirm(e){return this._show(e),new Promise(t=>this._resolve=t)}confirmWithCheck(e){return this._show(e),new Promise(t=>this._checkResolve=t)}prompt(e){return this._show(e),new Promise(t=>this._promptResolve=t)}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._checkResolve?.({confirmed:!1,checked:!1}),this._checkResolve=null,this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._checkResolve?.({confirmed:!0,checked:this._checked}),this._checkResolve=null,this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return M;let e=T(this.hass);return o`
      <ha-dialog open .headerTitle=${_1(this._title)} @closed=${this._cancel}>
        ${g1(this._title)}
        <div class="content">
          ${this._message}
          ${this._check?O({cls:"confirm-check",checked:this._checked,onChange:t=>this._checked=t.target.checked},this._check):M}
          ${this._inputLabel?o`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?o`${E({cls:"field-input field-select",onChange:t=>this._inputValue=t.target.value},o`
                    ${this._options.map(t=>o`<option value=${t.value} ?selected=${t.value===this._inputValue}>${t.label}</option>`)}
                  `)}`:o`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${t=>this._inputValue=t.target.value} />`}
            </label>
          `:M}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${V("cancel",e)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            variant=${this._danger?"danger":"brand"}
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};Q.styles=[I1,g`
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
      padding-bottom: 12px;
    }
    /* shared native-field scaffold from nativeFieldStyles; the prompt input
       follows the message text, hence the extra top margin here */
    .field { margin-top: 12px; }
    .confirm-check { display: flex; align-items: center; gap: 8px; cursor: pointer; }
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
  `],s([v({attribute:!1})],Q.prototype,"hass",2),s([l()],Q.prototype,"_open",2),s([l()],Q.prototype,"_title",2),s([l()],Q.prototype,"_message",2),s([l()],Q.prototype,"_confirmText",2),s([l()],Q.prototype,"_danger",2),s([l()],Q.prototype,"_inputLabel",2),s([l()],Q.prototype,"_inputType",2),s([l()],Q.prototype,"_options",2),s([l()],Q.prototype,"_inputValue",2),s([l()],Q.prototype,"_check",2),s([l()],Q.prototype,"_checked",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",Q)});function De(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function g0(C){let r=De(),e=r.querySelector(`${F9}[${I9}]`);return e||(e=document.createElement(F9),e.setAttribute(I9,""),r.appendChild(e)),e.hass=C,e}function s5(C,r){return g0(C).confirm(r)}var F9,I9,d3=u(()=>{"use strict";B9();F9="maintenance-confirm-dialog",I9="data-ms-lovelace-confirm"});function D9(C,r,e){let t=new Blob([C],{type:e}),H=URL.createObjectURL(t),i=document.createElement("a");i.href=H,i.download=r,i.target="_blank",i.rel="noopener",i.style.display="none",document.body.appendChild(i),i.dispatchEvent(new MouseEvent("click")),document.body.removeChild(i),setTimeout(()=>URL.revokeObjectURL(H),6e4)}var f0=u(()=>{"use strict"});async function Ne(C,r,e=300){return(await C.connection.sendMessagePromise({type:"auth/sign_path",path:r,expires:e})).path}async function N9(C,r,e=300){return Ne(C,`/api/maintenance_supporter/document/${r}`,e)}var j9=u(()=>{"use strict";f0()});var U1,Z0=u(()=>{"use strict";y();q();j9();U1=class extends S{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await N9(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?M:this._url?o`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:o`<div class="ph"></div>`}};U1.styles=g`
    .wrap { display: inline-block; margin-top: 4px; }
    /* #161: uniform 96px tiles — several photos sit in a strip, so a
       tiny or portrait shot must not collapse its slot. */
    img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: var(--ms-radius-6, 6px);
      display: block;
      border: 1px solid var(--divider-color);
      box-sizing: border-box;
    }
    .ph {
      width: 96px;
      height: 96px;
      border-radius: var(--ms-radius-6, 6px);
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      margin-top: 4px;
    }
  `,s([v({attribute:!1})],U1.prototype,"hass",2),s([v()],U1.prototype,"docId",2),s([l()],U1.prototype,"_url",2),s([l()],U1.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",U1)});var r1,q9=u(()=>{"use strict";y();q();b();f1();e1();C5();l3();u0();z5();d3();f2();e3();Z0();n5();n5();q1();r1=class extends S{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new b2(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return T(this.hass)}openEdit(e){this._openGen++,this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(e.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(e),this._loadPartOptions()}_seedReadings(e){let t=[],H=new Set;for(let L of e.readings??[])H.has(L.id)||(H.add(L.id),t.push({id:L.id,name:L.name,unit:L.unit??null}));for(let L of e.reading_values??[])H.has(L.id)||(H.add(L.id),t.push({id:L.id,name:L.name,unit:L.unit??null}));this._readingRows=t;let i={};for(let L of e.reading_values??[])i[L.id]=String(L.value);this._readingText=i,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let e={};for(let t of this._readingRows){let H=(this._readingText[t.id]??"").trim();if(H==="")continue;let i=parseFloat(H.replace(",","."));isNaN(i)||(e[t.id]=i)}return e}async _loadPartOptions(){let e=this._draft;if(!e)return;let t=this._openGen;try{let H=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(t!==this._openGen)return;let i=[];for(let a of H.parts||[]){let n=a.entry_id===e.entry_id,d=a.consumers.some(p=>p.entry_id===e.entry_id&&p.task_id===e.task_id);!n&&!d||i.push({part_id:a.part_id,name:a.name,entry_id:a.entry_id,foreign:!n,object_name:a.object_name})}for(let a of e.used_parts||[]){let n=a.entry_id||e.entry_id;i.some(d=>d.part_id===a.part_id&&d.entry_id===n)||i.push({part_id:a.part_id,name:a.name||a.part_id,entry_id:n,foreign:n!==e.entry_id,object_name:null})}let L={};for(let a of e.used_parts||[])L[`${a.entry_id||e.entry_id}:${a.part_id}`]=a.quantity??1;this._partOptions=i,this._partQty=L,this._partQtyOriginal=this._partSelectionKey()}catch{if(t!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,e])=>e>0).sort(([e],[t])=>e.localeCompare(t)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let e=this._lang,H=(this._originalSnapshot.used_parts||[]).filter(n=>n.quantity>0).map(n=>`${f(n.quantity,e)}\xD7 ${n.name||n.part_id}`).join(", ");if(!await s5(this.hass,{title:V("history_delete_entry",e),message:H?`${V("history_delete_confirm_entry",e)} ${V("history_delete_returns_parts",e).replace("{parts}",H)}`:V("history_delete_confirm_entry",e),confirmText:V("delete",e),danger:!0})||!this._draft||!this._originalSnapshot)return;let L=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:L.entry_id,task_id:L.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:L.entry_id,task_id:L.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(e){return F(this,e,{busy:t=>{this._saving=t},onError:t=>{this._error=t}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let e=this._draft,t=this._originalSnapshot,H={type:"maintenance_supporter/task/history/update",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:t.original_timestamp};if(e.timestamp!==t.timestamp&&(H.timestamp=e.timestamp),e.notes!==t.notes&&(H.notes=e.notes),e.cost!==t.cost&&(H.cost=e.cost),e.duration!==t.duration&&(H.duration=e.duration),e.completed_by!==t.completed_by&&(H.completed_by=e.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(H.used_parts=(this._partOptions||[]).filter(L=>(this._partQty[`${L.entry_id}:${L.part_id}`]||0)>0).map(L=>({part_id:L.part_id,quantity:this._partQty[`${L.entry_id}:${L.part_id}`],...L.foreign?{entry_id:L.entry_id}:{}}))),e.reading_value!==t.reading_value&&(H.reading_value=e.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let L=this._readingNumbers(),a={};for(let n of this._readingRows)a[n.id]=L[n.id]??null;H.reading_values=a}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(H.photo_doc_ids=this._photos.ids),Object.keys(H).filter(L=>!["type","entry_id","task_id","original_timestamp"].includes(L)).length===0){this.close();return}await this._runWs(H)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:e.entry_id,task_id:e.task_id,new_timestamp:e.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return M;let e=this._lang,t=this._draft,H=this._error||this._photos.errorText(e);return O2(()=>this.close(),o`
        ${M2()?M:o`<h2>${V("history_edit_title",e)}</h2>`}
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${V(t.type,e)||t.type}</span>
        </div>
        <ms-date-field
          kind="datetime"
          required
          .hass=${this.hass}
          .lang=${e}
          .label=${V("history_edit_timestamp",e)}
          .helper=${B5(e)}
          .value=${T7(t.timestamp)}
          @value-changed=${i=>{let L=i.detail.value;L&&this._set("timestamp",L)}}
        ></ms-date-field>
        <label>
          <span>${V("notes_label",e)}</span>
          <textarea
            rows="3"
            @input=${i=>{let L=i.target.value;this._set("notes",L||null)}}
            .value=${t.notes??""}></textarea>
        </label>
        <div class="row">
          <div class="cost-field">
            <span>${V("cost",e)}</span>
            <ms-cost-input .lang=${e} .value=${t.cost!=null?String(t.cost):""}
              @value-changed=${i=>{let L=i.detail.value;this._set("cost",L?Number(L):null)}}></ms-cost-input>
          </div>
          <label>
            <span>${V("duration",e)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${t.duration!=null?String(t.duration):""}
              @input=${i=>{this._set("duration",a2(i.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(t,e)}
        ${this._partOptions&&this._partOptions.length>0?o`
          <div class="parts-block">
            <span class="parts-title">${V("complete_parts_used",e)}</span>
            ${this._partOptions.map(i=>{let L=`${i.entry_id}:${i.part_id}`,a=this._partQty[L]||0;return o`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${a>0}
                    @change=${n=>{let d=n.target.checked;this._partQty={...this._partQty,[L]:d?1:0}}} />
                  <span class="part-label">${i.name}${i.foreign&&i.object_name?` (${i.object_name})`:""}</span>
                  ${a>0?o`
                    <input class="part-qty" type="number" min=${j1[0]} max=${j1[1]} step="0.01"
                      .value=${String(a)}
                      @input=${n=>{let d=parseFloat(n.target.value);!isNaN(d)&&d>0&&(this._partQty={...this._partQty,[L]:d})}} />
                  `:M}
                </label>
              `})}
          </div>
        `:M}
        <div class="photos-block">
          <span class="parts-title">${V("completion_photos",e)}</span>
          ${this._photos.photos.length>0?o`
            <div class="photo-strip">
              ${this._photos.photos.map(i=>o`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${i.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${V("remove",e)}
                    @click=${()=>this._photos.remove(i.id)}>✕</button>
                </div>`)}
            </div>`:M}
          ${this._photos.full?o`<span class="photos-hint">${V("photos_limit",e).replace("{max}",String(this._photos.max))}</span>`:o`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${i=>this._photos.addFiles(i.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${V("history_edit_photos_hint",e)}</span>
        </div>
        ${H?D("error",H):M}
        <div class="actions">
          <button class="delete-entry" @click=${this._delete} ?disabled=${this._saving} title=${V("history_delete_entry",e)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon> ${V("history_delete_entry",e)}
          </button>
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${V("cancel",e)}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving||this._photos.uploading}
            title=${this._photos.uploading?V("uploading",e):""}>
            ${this._saving?V("saving",e):V("save",e)}
          </button>
        </div>
    `,{title:V("history_edit_title",e)})}updated(e){e.has("_open")&&this._open&&$2(this.shadowRoot)}_renderReadings(e,t){return this._readingRows.length>0?o`
        <div class="readings-block">
          <span class="parts-title">${V("readings_section",t)}</span>
          ${this._readingRows.map(H=>o`
            <label class="reading-row-edit">
              <span class="reading-row-name">${H.name}${H.unit?` (${H.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[H.id]??""}
                @input=${i=>{this._readingText={...this._readingText,[H.id]:i.target.value}}} />
            </label>
          `)}
        </div>`:e.reading_value==null&&e.task_type!=="reading"?M:o`
      <label>
        <span>${V("reading_value_label",t)}${e.reading_unit?` (${e.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${e.reading_value!=null?String(e.reading_value):""}
          @input=${H=>{let i=H.target.value,L=i===""?NaN:Number(i);this._set("reading_value",isNaN(L)?null:L)}} />
      </label>`}};r1.styles=[M3,w2,g`
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
      border-radius: var(--ms-radius-6, 6px);
      width: 100%; box-sizing: border-box;
      font-family: inherit;
    }
    .delete-entry { margin-right: auto; color: var(--error-color, #d32f2f); background: transparent; border: 1px solid var(--error-color, #d32f2f); border-radius: var(--ms-radius-6, 6px); padding: 6px 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
    .delete-entry ha-icon { --mdc-icon-size: 18px; }
    .actions {
      display: flex; gap: 8px; justify-content: flex-end;
      margin-top: 8px;
    }
    button {
      padding: 8px 16px; font-size: 14px;
      border-radius: var(--ms-radius-6, 6px); cursor: pointer;
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
      border-radius: var(--ms-radius-6, 6px);
    }
    /* #130: parts on the entry */
    .parts-block {
      display: flex; flex-direction: column; gap: 6px;
      border: 1px solid var(--divider-color, #444);
      border-radius: var(--ms-radius-6, 6px); padding: 8px;
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
      border-radius: var(--ms-radius-6, 6px); padding: 8px;
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
      border-radius: var(--ms-radius-6, 6px); padding: 8px;
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
  `],s([v({attribute:!1})],r1.prototype,"hass",2),s([l()],r1.prototype,"_open",2),s([l()],r1.prototype,"_saving",2),s([l()],r1.prototype,"_error",2),s([l()],r1.prototype,"_draft",2),s([l()],r1.prototype,"_partOptions",2),s([l()],r1.prototype,"_partQty",2),s([l()],r1.prototype,"_readingRows",2),s([l()],r1.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",r1)});function z1(C){return String(C??"").replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r])}var W9=u(()=>{"use strict"});function S0(C){return!C.startsWith("data:image/svg+xml,")&&!C.startsWith("data:image/png;base64,")?"":z1(C)}function je(C){return C.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var t1,U9=u(()=>{"use strict";y();q();b();V5();f0();W9();i1();q1();t1=class extends S{constructor(){super(...arguments);this.lang="";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._quickResult=null;this._quickValues=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}get _dialogLang(){return this.lang||T(this.hass)}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}openForTask(e,t,H,i){this._entryId=e,this._taskId=t,this._objectName=H,this._taskName=i,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._quickValues=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let H=[this.hass.connection.sendMessagePromise({...t,action:"view"})];if(this._taskId){if(H.push(this.hass.connection.sendMessagePromise({...t,action:"complete"})),this._quickValues=await this._quickCompleteValues(),e!==this._generateSeq)return;this._quickValues&&H.push(this.hass.connection.sendMessagePromise({...t,action:"quick_complete"}))}let i=await Promise.all(H);if(e!==this._generateSeq)return;this._viewResult=i[0],i.length>1&&(this._completeResult=i[1]),i.length>2&&(this._quickResult=i[2])}catch(t){if(e!==this._generateSeq)return;let H=t?.code,i=t?.message;this._error=H==="no_url"||typeof i=="string"&&i.includes("No Home Assistant URL")?V("qr_error_no_url",this._dialogLang):V("qr_error",this._dialogLang)}finally{e===this._generateSeq&&(this._loading=!1)}}async _quickCompleteValues(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});return K5((e.tasks||[]).find(t=>t.id===this._taskId))}catch{return null}}_quickRecords(e){let t=this._quickValues??{},H=[t.notes?`\u201C${t.notes.length>40?`${t.notes.slice(0,39)}\u2026`:t.notes}\u201D`:"",t.cost!=null?`${V("quick_complete_defaults_cost",e)} ${Y(t.cost,void 0,e)}`:"",t.duration!=null?h2(t.duration,e):""].filter(Boolean);return H.length?V("qr_quick_records",e).replace("{values}",H.join(", ")):V("qr_quick_records_nothing",e)}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,H=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),i=window.open("","_blank","width=600,height=500");if(!i)return;let L=this._dialogLang,a=z1(t),n=z1(H),d=!!this._completeResult,p=!!this._quickResult,c=z1(V("qr_action_view",L)),A=z1(V("qr_action_complete",L)),x=z1(V("qr_action_quick_complete",L));i.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${a}</title>
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
  .qr-col img{width:${p?"170px":d?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${a}</h2>
${n?`<div class="sub">${n}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${S0(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${c}</div>
  </div>
  ${d?`<div class="qr-col">
    <img src="${S0(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${A}</div>
  </div>`:""}
  ${p?`<div class="qr-col">
    <img src="${S0(this._quickResult.svg_data_uri)}" alt="QR Quick-complete" />
    <div class="qr-label">${x}</div>
  </div>`:""}
</div>
<div class="url">${z1(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),i.document.close()}_downloadSvg(e,t){let H=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),i=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;D9(H,`qr-${je(i)}-${t}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._quickResult=null,this._error="",this._loading=!1}render(){if(!this._open)return o``;let e=this._dialogLang,t=this._taskName?`${V("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${V("qr_code",e)}: ${this._objectName}`,H=!!this._viewResult;return o`
      <ha-dialog open .headerTitle=${_1(t)} @closed=${this._close}>
        ${g1(t)}
        <div class="content">
          ${this._loading?o`<div class="loading">${V("qr_generating",e)}</div>`:this._error?D("error",this._error):H?o`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${V("qr_action_view",e)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${V("qr_download",e)}
                        </button>
                      </div>
                      ${this._completeResult?o`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${V("qr_action_complete",e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${V("qr_download",e)}
                              </button>
                            </div>
                          `:M}
                      ${this._quickResult?o`
                            <div class="qr-item quick">
                              <img
                                class="qr-image small"
                                src="${this._quickResult.svg_data_uri}"
                                alt="QR Quick-complete"
                              />
                              <div class="qr-item-label">${V("qr_action_quick_complete",e)}</div>
                              <div class="qr-quick-records">${this._quickRecords(e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._quickResult,"quick-complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${V("qr_download",e)}
                              </button>
                            </div>
                          `:M}
                    </div>
                    ${this._taskId&&!this._quickResult?o`<div class="qr-quick-off">${V("qr_quick_complete_off",e)}</div>`:M}
                    <div class="url-display">${this._viewResult.url}</div>
                  `:M}
          <div class="action-row">
            <label>${V("qr_url_mode",e)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${V("qr_mode_companion",e)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${V("qr_mode_local",e)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${V("qr_mode_server",e)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${V("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!H}
          >
            ${V("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};t1.styles=g`
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
    /* #233: what the quick code records; how to get one */
    .qr-quick-records,
    .qr-quick-off {
      font-size: 12px;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .qr-quick-off {
      margin-top: 8px;
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
      border-radius: var(--ms-radius-6, 6px);
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
  `,s([v({attribute:!1})],t1.prototype,"hass",2),s([v()],t1.prototype,"lang",2),s([l()],t1.prototype,"_open",2),s([l()],t1.prototype,"_loading",2),s([l()],t1.prototype,"_error",2),s([l()],t1.prototype,"_viewResult",2),s([l()],t1.prototype,"_completeResult",2),s([l()],t1.prototype,"_quickResult",2),s([l()],t1.prototype,"_quickValues",2),s([l()],t1.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",t1)});function z9(C,r,e=new Date){let t=C?.hours,H=J(C?.snoozed_until);if(typeof t!="number"||!Number.isFinite(H))return V("snoozed",r);let i=P1(),a=R1(H,i)===R1(e,i)?P5(new Date(H),r):R5(C.snoozed_until,r);return E5("snoozed_for","snoozed_for_one",t,r,"hours").replace("{until}",a)}var G9=u(()=>{"use strict";b();e1()});function qe(C,r){if(r<=0)return 0;let e=typeof C=="number"&&Number.isFinite(C)?Math.trunc(C):0;return e<0?0:e%r}function We(C){return!!(C?.phases&&C.phase_sequence&&C.phase_sequence.length>0)}function y0(C){if(!C||!We(C))return null;let r=C.phase_sequence,e=qe(C.phase_cursor,r.length),t=r[e],H=C.phases?.[t];return H?{id:t,name:H.name,index:e,count:r.length,notes:H.notes,checklist:H.checklist!==void 0?H.checklist:C.checklist??[],consumesParts:H.consumes_parts!==void 0?H.consumes_parts:C.consumes_parts??[],requiredFields:H.required_completion_fields!==void 0?H.required_completion_fields:C.required_completion_fields??[]}:null}function M5(C){let r=y0(C);return r?`${r.index+1}/${r.count} \xB7 ${r.name}`:""}var b0=u(()=>{"use strict"});function Ue(C,r){return typeof C=="number"&&Number.isFinite(C)&&C>=.01?C:r}function Q9(C){let r=C.task??null,e=r?y0(r):null,t=e?e.consumesParts:r?.consumes_parts||[],H=!!r?.part_ref,i=C.objects.find(c=>c.entry_id===C.entryId),L=i?.parts||[],a=H?L.find(c=>c.id===r.part_ref.part_id):void 0,n=C.features?C.features.checklists:C.checklistsEnabled??!0,d=C.features?C.features.checklists?C.checklist??r?.checklist??[]:[]:C.checklist??[],p=C.features?C.features.adaptive&&(C.adaptiveEnabled??!!r?.adaptive_config?.enabled):!!C.adaptiveEnabled;return{entry_id:C.entryId,task_id:C.taskId,task_name:C.taskName,checklist:e?n?e.checklist:[]:d,adaptive_enabled:p,required_completion_fields:e?e.requiredFields:r?.required_completion_fields||[],task_type:r?.type||"",reading_unit:r?.reading_unit||"",readings:r?.readings||[],reading_history:d4(r?.history),parts:H?[]:N4({consumes_parts:t},C.entryId,C.objects,C.lang),consumes_parts:H?[]:t,phase_label:e?M5(r):"",require_tag_scan:!!r?.require_tag_scan,restock_default:H?Ue(a?.restock_quantity,1):null,restock_unit_cost:H?a?.cost??null:null,restock_package:H&&a?.package_size?v2(a.package_size,a.unit,C.lang):"",currency_symbol:V2({currency_symbol:C.currencySymbol}),consumes_info:t.map(c=>D4(c,C.entryId,C.objects,C.lang)),checklist_prefill:r?.checklist_progress||{},via_tag_scan:!!C.viaTagScan,parts_cost_mode:H?Z5(a,C.partsCostMode??"purchase",!!i?.object.battery_fleet):C.partsCostMode??"purchase",prefill:K5(r)}}function K9(C,r,e){C.entryId=r.entry_id,C.taskId=r.task_id,C.taskName=r.task_name,C.lang=e,C.checklist=r.checklist??[],C.adaptiveEnabled=!!r.adaptive_enabled,C.requiredFields=r.required_completion_fields??[],C.taskType=r.task_type??"",C.readingUnit=r.reading_unit??"",C.readings=r.readings??[],C.readingHistory=r.reading_history??[],C.parts=r.parts??[],C.consumesParts=r.consumes_parts??[],C.phaseLabel=r.phase_label??"",C.requireTagScan=!!r.require_tag_scan,C.restockDefault=r.restock_default??null,C.restockUnitCost=r.restock_unit_cost??null,C.restockPackage=r.restock_package??"",C.currencySymbol=V2(r),C.consumesInfo=r.consumes_info??[],C.checklistPrefill=r.checklist_prefill??{},C.viaTagScan=!!r.via_tag_scan,C.partsCostMode=r.parts_cost_mode??"purchase",C.prefill=r.prefill??null,C.open({viaTagScan:!!r.via_tag_scan})}var k0=u(()=>{"use strict";L2();U5();b0();b();c2();V5()});function w0(C){return C.replace(/[\t\n\r]/g,"").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g,"")}function O0(C){let r=/^([a-z][a-z0-9+.-]+):/i.exec(w0(C||""));return r?r[1].toLowerCase():null}function p3(C){let r=O0(C);return r!==null&&!ze.has(r)}function Y9(C){return!!C&&/^https?:\/\//i.test(C)}var ze,$0=u(()=>{"use strict";ze=new Set(["about","blob","data","file","filesystem","javascript","livescript","ms-appinstaller","ms-cxh","ms-cxh-full","ms-msdt","ms-officecmd","search","search-ms","view-source","vbscript"])});function m3(C){if(!C)return M;if(customElements.get("ha-markdown")){let{content:r,links:e}=Ke(C);return o`<ha-markdown
      class="notes-md"
      .content=${r}
      breaks
      ${y2(t=>Ye(t,e))}
    ></ha-markdown>`}return o`${C}`}function Ke(C){let r=[],e=i=>{let L=O0(i);return!L||Ge.has(L)||!p3(i)?null:(r.push(w0(i)),`${E0}${r.length-1}`)},t=i=>i.replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)<(${c3}[^>\\n]*)>`,"g"),(L,a,n,d)=>{let p=a?null:e(d);return p?`${n}${p}`:L}).replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)(${c3}[^\\s)]*)`,"g"),(L,a,n,d)=>{let p=a?null:e(d);return p?`${n}${p}`:L}).replace(new RegExp(`(^|[^(])<(${c3}[^\\s<>]*)>`,"gm"),(L,a,n)=>{let d=e(n);return d?`${a}[${n.replace(/([\\[\]])/g,"\\$1")}](${d})`:L}).replace(new RegExp(`^( {0,3}\\[[^\\]\\n]+\\]:[ \\t]*)<?(${c3}[^\\s>]*)>?`,"gm"),(L,a,n)=>{let d=e(n);return d?`${a}${d}`:L});return{content:C.split(Qe).map((i,L)=>L%2?i:t(i)).join(""),links:r}}function T0(C,r){for(let e of C.querySelectorAll(`a[href^="${E0}"]`)){let t=r[Number(e.getAttribute("href").slice(E0.length))];t&&e.setAttribute("href",t)}}function Ye(C,r){if(!C)return;let e=X9.get(C);if(!e&&r.length===0)return;if(e){e.links=r,C.shadowRoot&&T0(C.shadowRoot,r);return}let t={links:r};X9.set(C,t),(async()=>{await C.updateComplete;let H=C.shadowRoot;H&&(new MutationObserver(()=>T0(H,t.links)).observe(H,{childList:!0,subtree:!0}),T0(H,t.links))})()}var E0,Ge,Qe,c3,X9,P0=u(()=>{"use strict";y();H3();$0();E0="https://app-link.invalid/",Ge=new Set(["http","https","mailto","tel","ftp"]),Qe=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/,c3="[a-zA-Z][a-zA-Z0-9+.-]+:";X9=new WeakMap});function Xe(C){return C&&J9(C.ref_no)?String(C.ref_no):null}function e6(C,r){let e=Xe(C);return e&&r&&J9(r.ref_no)?`${e}.${r.ref_no}`:null}function t6(C,r){return C?o`<span class="ref-chip" title=${r??""}>#${C}</span>`:M}var J9,R0=u(()=>{"use strict";y();J9=C=>typeof C=="number"&&Number.isInteger(C)&&C>0});var B0=u(()=>{"use strict"});function r6(C,r){if(!C)return"";let e=Je[C.trim()];if(e)return V(e,r);for(let[t,H,i]of et){let L=C.trim().match(t);if(L){let a=i(L,r);return V(H,r).replace(/\{(\w+)\}/g,(n,d)=>a[d]??n)}}return C}var Je,C6,et,H6=u(()=>{"use strict";b();Je={"Completed from dashboard button":"hist_note_button","Auto-completed: sensor recovered":"hist_note_auto_recovered_plain","Completed from the To-do list":"hist_note_todo","Completed by voice":"hist_note_voice","Completed from the notification":"hist_note_notification","Completed via NFC tag":"hist_note_nfc","Completed from the shopping list":"hist_note_shopping_list","Completed from a mirrored to-do list":"hist_note_todo_mirror","Skipped from notification":"hist_note_skipped_notification","Skipped from dashboard button":"hist_note_skipped_button","Sensor trigger activated":"hist_note_sensor_triggered","Initial value set during task creation":"hist_note_initial"},C6={name:"name",notes:"notes_label",recurrence:"task_section_schedule","warning days":"warning_days"},et=[[/^Auto-completed: sensor recovered \((.+)\)$/,"hist_note_auto_recovered",C=>({value:C[1]})],[/^Auto-completed: (.+) changed to (.+)$/,"hist_note_auto_entity",C=>({entity:C[1],state:C[2]})],[/^Reset to (\d{4}-\d{2}-\d{2})$/,"hist_note_reset",(C,r)=>({date:B(C[1],r)})],[/^Trigger entity replaced: (.+) → (.+)$/,"hist_note_trigger_replaced",C=>({old:C[1],new:C[2]})],[/^From the template: (.+)$/,"hist_note_template_updated",(C,r)=>({fields:C[1].split(", ").map(e=>C6[e]?V(C6[e],r):e).join(", ")})],[/^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,"hist_note_trigger_removed",(C,r)=>({entity:C[1],schedule:V(C[2],r)})],[/^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,"hist_note_compound_removed",C=>({entity:C[1],count:C[2]})]]});function A3(C){return typeof C=="string"?C.trim():""}function V6(C,r,e={}){let t=C.trigger_change;if(t&&typeof t=="object"){let H=A3(t.latest),i=A3(t.installed);if(H&&i&&H!==i)return V("trigger_update_available",r).split("{latest}").join(H).split("{installed}").join(i);let L=A3(t.to),a=A3(t.from);if(L)return`${V("trigger_val",r)}: ${a?`${a} \u2192 `:""}${L}`}return e.stateRule||typeof C.trigger_value!="number"||!Number.isFinite(C.trigger_value)?"":`${V("trigger_val",r)}: ${f(C.trigger_value,r,{maximumFractionDigits:3})}${e.unit?` ${e.unit}`:""}`}var i6=u(()=>{"use strict";b()});function L6(C){let r=e=>{let t=J(e.timestamp);return Number.isNaN(t)?-1/0:t};return(C??[]).map((e,t)=>({entry:e,index:t,at:r(e)})).sort((e,t)=>t.at-e.at||t.index-e.index).map(e=>e.entry)}function Ct(C,r){return C.taskRef&&r.ref_no?`${C.taskRef}-${r.ref_no}`:null}function rt(C,r){let e=K2(r);return e.length>0?o`<div class="history-photos">
        ${e.map(t=>o`<maintenance-history-photo .hass=${C} .docId=${t}></maintenance-history-photo>`)}
      </div>`:M}function Ht(C,r){let e=r.lang,t=L=>f(L,e,{maximumFractionDigits:3}),H=L=>L==null?"":` (${L>=0?"+":""}${t(L)})`,i=D1(C);return i.length>0?o`<div class="history-readings">
      ${i.map(L=>o`<span class="history-reading">
        <span class="history-reading-name">${L.name}</span>
        <span class="history-reading-value">${t(L.value)}${L.unit?` ${L.unit}`:""}${H(r.readingSlotDelta?.(C,L.id))}</span>
      </span>`)}
    </div>`:C.reading_value!=null?o`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${V("reading_label",e)}</span>
      <span class="history-reading-value">${t(C.reading_value)}${r.readingUnit?` ${r.readingUnit}`:""}${H(r.readingDelta?.(C))}</span>
    </span></div>`:M}function o6(C,r,e={}){let t=r.lang,{compact:H=!1,showRef:i=!0,showBadges:L=!0,showEdit:a=!0,showHead:n=!0}=e,d=r.openEdit,p=a&&!!d&&y5.includes(C.type),c=typeof C.parts_cost=="number"?C.parts_cost:null,A=C.cost_basis==="use",x=A&&!!C.purchase,_=V6(C,t,{unit:r.triggerUnit,stateRule:r.stateRule});return o`
    <div class="history-entry${H?" compact":""}">
      ${H?M:o`<div class="history-icon ${C.type}" style="background: ${$3(C.type)}">
            <ha-icon .icon=${z2[C.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        ${n?o`<div class="history-row">
          <strong>${V(C.type,t)}</strong>
          ${i?t6(Ct(r,C),V("ref_number",t)):M}
          ${L&&C.phase_id?o`<span class="history-phase-badge">${r.phaseNames?.[C.phase_id]||C.phase_id}</span>`:M}
          ${L&&C.auto?o`<span class="history-auto-badge">${V("history_auto",t)}</span>`:M}
          ${p?o`<button class="history-edit-btn"
                     title=${V("history_edit_button",t)}
                     @click=${()=>d(C)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:M}
        </div>
        <div class="history-date">${R5(C.timestamp,t)}</div>`:M}
        ${C.notes?o`<div class="history-notes">${r6(C.notes,t)}</div>`:M}
        ${rt(r.hass,C)}
        ${Ht(C,r)}
        ${C.cost!=null||C.duration!=null||_||c!=null?o`<div class="history-details">
              ${C.cost!=null?x?o`<span>${V("history_purchase_stock",t).replace("{amount}",Y(C.cost,r.currencySymbol,t))}</span>`:C.cost<0?o`<span class="history-credit">${r4(C.cost,r.currencySymbol,t)}</span>`:o`<span>${V("cost",t)}: ${Y(C.cost,r.currencySymbol,t)}</span>`:M}
              ${c!=null?o`<span title=${V(A?"history_parts_counted_hint":"history_parts_info_hint",t)}>${V(A?"history_parts_counted":"history_parts_info",t).replace("{amount}",Y(c,r.currencySymbol,t))}</span>`:M}
              ${C.duration!=null?o`<span>${V("duration",t)}: ${h2(C.duration,t)}</span>`:M}
              ${_?o`<span>${_}</span>`:M}
            </div>`:M}
      </div>
    </div>
  `}var a6=u(()=>{"use strict";y();b();Z0();Y2();R0();L2();B0();H6();i6();e1();T1()});var n6,s6,M6,l6,d6,p6,F0,c6,m6=u(()=>{n6="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",s6="M13 13H11V7H13M11 15H13V17H11M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3Z",M6="M20 21H4V10H6V19H18V10H20V21M3 3H21V9H3V3M9.5 11H14.5C14.78 11 15 11.22 15 11.5V13H9V11.5C9 11.22 9.22 11 9.5 11M5 5V7H19V5H5Z",l6="M23 7V13H21V7M21 15H23V17H21M12 2A2 2 0 0 0 10 4A2 2 0 0 0 10 4.29C7.12 5.14 5 7.82 5 11V17L3 19V20H21V19L19 17V11C19 7.82 16.88 5.14 14 4.29A2 2 0 0 0 14 4A2 2 0 0 0 12 2M10 21A2 2 0 0 0 12 23A2 2 0 0 0 14 21Z",d6="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.11 3.9 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.9 20.11 3 19 3M19 19H5V9H19V19M19 7H5V5H19V7Z",p6="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z",F0="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z",c6="M13,16V8H15V16H13M9,16V8H11V16H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"});function l5(C){if(C.archived)return"archived";if(C.is_done)return"done";let r=C.status||"ok";return r==="ok"&&C.schedule_type==="manual"&&C.days_until_due==null?"no_due":r}function I0(C,r){return V(Lt[C]??C,r)}function u3(C){let r=l5(C);return r==="done"?Vt:r==="no_due"?it:$1[r]||"var(--disabled-color, #9e9e9e)"}function ot(C){return C==="no_due"?"mdi:calendar-blank-outline":z2[C==="done"?"completed":C]||"mdi:circle-medium"}function nt(C){return at[ot(C)]??F0}function A6(C,r,e="pill"){let t=l5(C),H=I0(t,r);return e==="chip"?o`<span class="status-chip ${t}">${H}</span>`:o`<span class="status-badge ${t}" role="img" title="${H}" aria-label="${H}"><ha-svg-icon .path=${nt(t)}></ha-svg-icon><span class="status-label">${H}</span></span>`}var Vt,it,Lt,at,D0=u(()=>{"use strict";y();m6();b();T1();Vt="var(--maint-done-color, #78909c)",it="var(--secondary-text-color, #727272)";Lt={done:"completed",no_due:"no_due_date"};at={"mdi:check-circle":p6,"mdi:alert-circle":n6,"mdi:alert-octagon":s6,"mdi:bell-alert":l6,"mdi:archive-outline":M6,"mdi:pause-circle-outline":c6,"mdi:calendar-blank-outline":d6,"mdi:circle-medium":F0}});async function u6(C,r,e){if(!C)return null;let t={title:V("delete",e),confirmText:V("delete",e),danger:!0};if(!r?.part_ref)return await C.confirm({...t,message:V("delete_task_confirm",e)})?{}:null;let H=await C.confirmWithCheck({...t,message:V("delete_buy_task_confirm",e),check:V("delete_buy_task_off",e)});return H.confirmed?H.checked?{disable_auto_buy_task:!0}:{}:null}var v6=u(()=>{"use strict";b()});var v3,h6=u(()=>{"use strict";v3=class{constructor(){this._handle=null}schedule(r,e=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,r()},e)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}}});function k(C){return C.toFixed(1)}var N0=u(()=>{"use strict";b();e1()});function x6(C,r){let e=C.interval_analysis,t=e?.weibull_beta,H=e?.weibull_eta;if(t==null||H==null||H<=0)return M;let i=C.interval_days??0,L=C.suggested_interval??i;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${V("weibull_reliability_curve",r)}
        ${st(t,r)}
      </div>
      ${Mt(t,H,i,L,r)}
      ${lt(e,r)}
      ${e?.confidence_interval_low!=null?dt(e,C,r):M}
    </div>
  `}function st(C,r){let e,t,H;return C<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",H="beta_early_failures"):C<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",H="beta_random_failures"):C<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",H="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",H="beta_highly_predictable"),o`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${V(H,r)} (\u03B2=${f(C,r,2)})
    </span>
  `}function Mt(C,r,e,t,H){let x=Math.max(e,t,r,1)*1.3,_=50,R=[];for(let j=0;j<=_;j++){let U=j/_*x,P2=1-Math.exp(-Math.pow(U/r,C)),R2=32+U/x*260,h3=136-P2*128;R.push([R2,h3])}let $=R.map(([j,U])=>`${k(j)},${k(U)}`).join(" "),N="M32,136 "+R.map(([j,U])=>`L${k(j)},${k(U)}`).join(" ")+` L${k(R[_][0])},136 Z`,K=32+e/x*260,X=1-Math.exp(-Math.pow(e/r,C)),h=136-X*128,m1=f((1-X)*100,H,0),G1=32+t/x*260,O1=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${V("chart_weibull",H)}">
        ${O1.map(j=>{let U=136-j*128;return d2`
            <line x1="${32}" y1="${k(U)}" x2="${292}" y2="${k(U)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${j===.5?"4,3":M}" />
            <text x="${28}" y="${k(U+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${f(j*100,H,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x)}</text>

        <path d="${N}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${$}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?d2`
          <line x1="${k(K)}" y1="${8}" x2="${k(K)}" y2="${k(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${k(K)}" cy="${k(h)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${k(K+4)}" y="${k(h-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${m1}%</text>
        `:M}

        ${t>0&&t!==e?d2`
          <line x1="${k(G1)}" y1="${8}" x2="${k(G1)}" y2="${k(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:M}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${V("weibull_failure_probability",H)}</span>
      ${e>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${V("current_interval_marker",H)}</span>`:M}
      ${t>0&&t!==e?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${V("recommended_marker",H)}</span>`:M}
    </div>
  `}function lt(C,r){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${V("characteristic_life",r)}</span>
        <span class="weibull-info-value">${i2(Math.round(C.weibull_eta),r)}</span>
      </div>
      ${C.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${V("weibull_r_squared",r)}</span>
          <span class="weibull-info-value">${f(C.weibull_r_squared,r,3)}</span>
        </div>
      `:M}
    </div>
  `}function dt(C,r,e){let t=C.confidence_interval_low,H=C.confidence_interval_high,i=r.suggested_interval??r.interval_days??0,L=r.interval_days??0,a=Math.max(0,t-5),d=H+5-a,p=(t-a)/d*100,c=(H-t)/d*100,A=(i-a)/d*100,x=L>0?(L-a)/d*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${V("confidence_interval",e)}: ${i2(i,e)} (${t}\u2013${H})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${k(p)}%;width:${k(c)}%"></div>
        ${x>=0?o`<div class="confidence-marker current" style="left:${k(x)}%"></div>`:M}
        <div class="confidence-marker recommended" style="left:${k(A)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${V("confidence_conservative",e)} (${t}${V("days",e).charAt(0)})</span>
        <span class="confidence-text high">${V("confidence_aggressive",e)} (${H}${V("days",e).charAt(0)})</span>
      </div>
    </div>
  `}var _6=u(()=>{"use strict";y();b();N0()});function j0(C){return Math.max(1,Math.round(C||0))}function g6(C,r,e){let t=C.degradation_trend!=null&&C.degradation_trend!=="insufficient_data",H=C.days_until_threshold!=null,i=C.environmental_factor!=null&&C.environmental_factor!==1;if(!t&&!H&&!i)return M;let L=C.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":C.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${C.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${V(K3(j0(C.days_until_threshold),r,pt),r).replace("{days}",String(j0(C.days_until_threshold)))}
        </div>
      `:M}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${V("sensor_prediction",r)}
      </div>
      <div class="prediction-grid">
        ${t?o`
          <div class="prediction-item">
            <ha-svg-icon path="${L}"></ha-svg-icon>
            <span class="prediction-label">${V("degradation_trend",r)}</span>
            <span class="prediction-value ${C.degradation_trend}">${V("trend_"+C.degradation_trend,r)}</span>
            ${C.degradation_rate!=null?o`<span class="prediction-rate">${C.degradation_rate>0?"+":""}${f(C.degradation_rate,r,Math.abs(C.degradation_rate)>=10?0:1)} ${C.trigger_entity_info?.unit_of_measurement||""}/${V("day_short",r)}</span>`:M}
          </div>
        `:M}
        ${H?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${V("days_until_threshold",r)}</span>
            <span class="prediction-value prediction-days${C.days_until_threshold===0?" exceeded":C.sensor_prediction_urgency?" urgent":""}">${C.days_until_threshold===0?V("threshold_exceeded",r):"~"+F5(j0(C.days_until_threshold),r)}</span>
            ${C.threshold_prediction_date?o`<span class="prediction-date">${B(C.threshold_prediction_date,r)}</span>`:M}
            ${C.threshold_prediction_confidence?o`<span class="confidence-dot ${C.threshold_prediction_confidence}"></span>`:M}
            ${(C.prediction_cycles??0)>0?o`<span class="prediction-cycles">${V("prediction_cycles",r)}: ${C.prediction_cycles}</span>`:M}
          </div>
        `:M}
        ${i&&e.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${V("environmental_adjustment",r)}</span>
            <span class="prediction-value">${f(C.environmental_factor,r,2)}x</span>
            ${C.environmental_entity?o`<span class="prediction-entity entity-link" @click=${a=>o4(a,C.environmental_entity)}>${C.environmental_entity}</span>`:M}
          </div>
        `:M}
      </div>
    </div>
  `}var pt,f6=u(()=>{"use strict";y();b();pt={one:"sensor_prediction_urgency_one",few:"sensor_prediction_urgency_few",other:"sensor_prediction_urgency"}});function Z6(C,r,e,t){let H=Math.max(C||1,r);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${V("current",t)}: ${C!=null?i2(C,t):"\u2014"}
        </div>
        <div class="interval-visual current"
          style="width: ${C!=null?Math.min(C/H*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${V("recommended",t)}: ${i2(r,t)}
          <span class="confidence-badge ${e}">${V(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(r/H*100,100)}%"></div>
      </div>
    </div>
  `}var S6=u(()=>{"use strict";y();b()});function b6(){return Number(v1().slice(5,7))-1}function k6(C,r,e){if(!e.seasonal||!C.seasonal_factor||C.seasonal_factor===1)return M;let t=y6.map(a=>V(a,r)),H=b6(),i=C.seasonal_factors||C.interval_analysis?.seasonal_factors||null,L=i&&i.length===12?i:t.map((a,n)=>{let d=C.seasonal_factor||1,p=Math.sin((n-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,d+p))});return o`
    <div class="seasonal-card-compact">
      <h4>${V("seasonal_awareness",r)}</h4>
      <div class="seasonal-mini-chart">
        ${L.map((a,n)=>{let d=a*40,p=a<.9?"low":a>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${p} ${n===H?"current":""}"
                 style="height: ${d}px"
                 title="${t[n]}: ${f(a,r,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${V("shorter",r)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${V("normal",r)}</span>
        <span class="legend-item"><span class="dot high"></span> ${V("longer",r)}</span>
      </div>
    </div>
  `}function w6(C,r){return ct(C,r)}function ct(C,r){let e=C.seasonal_factors??C.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return M;let t=C.interval_analysis?.seasonal_reason,H=b6(),i=300,L=100,a=8,d=L-a-4,p=Math.max(...e,1.5),c=i/12,A=c*.65,x=a+d-1/p*d;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${V("seasonal_chart_title",r)}
        ${t?o`<span class="source-tag">${t==="learned"?V("seasonal_learned",r):V("seasonal_manual",r)}</span>`:M}
      </div>
      <svg viewBox="0 0 ${i} ${L}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${V("chart_seasonal",r)}">
        <line x1="0" y1="${k(x)}" x2="${i}" y2="${k(x)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((_,R)=>{let $=_/p*d,N=R*c+(c-A)/2,K=a+d-$,X=R===H,h=_<1?"var(--success-color, #4caf50)":_>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return d2`
            <rect x="${k(N)}" y="${k(K)}"
              width="${k(A)}" height="${k($)}"
              fill="${h}" opacity="${X?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${y6.map((_,R)=>o`<span class="seasonal-label ${R===H?"active-month":""}">${V(_,r)}</span>`)}
      </div>
    </div>
  `}var y6,O6=u(()=>{"use strict";y();b();N0();e1();y6=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"]});var P,$6=u(()=>{"use strict";y();q();b();f1();G9();l3();e1();k0();b0();P0();e0();L2();R0();a6();D0();T1();r5();X2();d3();v6();h6();V5();H5();_6();f6();S6();f2();q5();O6();q1();a0();P=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1};this._toast="";this._toastTimer=new v3;this._access=o2;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return T(this.hass)}async openFor(e,t){(e!==this._entryId||t!==this._taskId)&&(this._task=null),this._entryId=e,this._taskId=t,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=v1(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let e=await M1(this.hass);this._features={...this._features,...e.features},this._access=e.access,this._currencySymbol=V2(e.budget??void 0),T5(e.budget??void 0),this._partsCostMode=e.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(e,t){this._toast=e,this._toastTimer.schedule(()=>{this._toast=""},t)}async _loadTask(){let e=this._entryId,t=this._taskId;if(!e||!t)return;let H=++this._loadSeq,i="",L=await F(this,{type:"maintenance_supporter/object",entry_id:e},{onError:n=>{i=n}});if(H!==this._loadSeq)return;if(L===void 0){this._error=i;return}this._objectName=L?.object?.name||"";let a=(L?.tasks||[]).find(n=>n.id===t);this._task=a??null,this._taskRef=e6(L?.object,a),a||(this._error=V("ws_err_not_found",this._lang))}_runWs(e){return this._error="",F(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(e=!1){if(!(!this._entryId||!this._taskId||!this._task)){if(!e&&n2(this._task)){this._onQuickComplete();return}Promise.resolve().then(()=>(c1(),b1)).then(async({openCompleteDialog:t})=>{let H=this._task,i=[];try{i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(Q9({entryId:this._entryId,taskId:this._taskId,taskName:H.name,task:H,objects:i,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}}async _onQuickComplete(){let e=this._entryId,t=this._task;this._busy=!0;try{let H=await W4(this.hass,e,t.id,this._lang);if(H.result==="dialog"){this._onComplete(!0);return}if(H.result==="failed"){this._error=H.message;return}if(H.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:H.message},bubbles:!0,composed:!0})),this.close();return}this._notifyChanged("complete"),H.undo&&Q5(this,this.hass,{entryId:e,taskId:t.id,taskName:t.name},this._lang,()=>{}),this.close()}finally{this._busy=!1}}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:z9(e,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||Promise.resolve().then(()=>(c1(),b1)).then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(c1(),b1)).then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let e=await u6(g0(this.hass),this._task,this._lang);if(!e)return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId,...e})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(V("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._showToast(e?.recommended_interval?`${V("reanalyze_result",this._lang)}: ${H2(e.recommended_interval,"days",this._lang)} (${e.data_points} ${V("data_points",this._lang)})`:V("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(e){if(!this._entryId||!this._taskId)return;let t=J3(this._entryId,this._taskId,e,this._task);Promise.resolve().then(()=>(c1(),b1)).then(({openHistoryEditDialog:H})=>H(t))}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return M;let t=this._lang;return o`
      <div class="recommendation-card">
        <h4>${V("suggested_interval",t)}</h4>
        ${Z6(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",t)}
        <div class="recommendation-actions">
          ${N1(this.hass?.user,this._access)?o`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${V("apply_suggestion",t)}
              </button>`:M}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${V("reanalyze",t)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(e){let t=this._lang,H=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,i=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,L=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,a=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!H&&!i&&!L&&!a?o`<div class="adaptive-empty">
        ${V("adaptive_no_data",t)}
      </div>`:o`
      <div class="adaptive-stack">
        ${this._toast?o`<div class="toast">${this._toast}</div>`:M}
        ${H?this._renderRecommendation(e):M}
        ${i?g6(e,t,this._features):M}
        ${L?x6(e,t):M}
        ${a?o`
          ${k6(e,t,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?w6(e,t):M}
        `:M}
      </div>
    `}_renderDetails(e){let t=this._lang,H=e.history||[],i=e.history_count??H.length,L=L6(H).slice(0,20);return o`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${V("times_performed",t)}</span>
            <span class="stat-value">${e.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${V("total_cost",t)}</span>
            <span class="stat-value">${Y(e.total_cost??0,this._currencySymbol,t)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${V("avg_duration",t)}</span>
            <span class="stat-value">${h2(e.average_duration!=null?Math.round(e.average_duration):null,t)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${V("history",t)}</strong>
          <span class="history-count">${i}</span>
        </div>
        ${H.length===0?o`<div class="history-empty">${V("history_empty",t)}</div>`:o`
              <div class="history-list">
                ${L.map(a=>o6(a,{lang:t,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:N1(this.hass?.user,this._access)?n=>this._onEditHistoryEntry(n):void 0,readingUnit:e.reading_unit,readingSlotDelta:(n,d)=>c4(H,n,d),taskRef:this._taskRef,triggerUnit:z4(this.hass,e)||null,stateRule:G4(e)},{compact:!0}))}
                ${i>L.length?o`<div class="history-more">… +${i-L.length} ${V("older_entries",t)}</div>`:M}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return M;let e=this._lang,t=this._task,H=N1(this.hass?.user,this._access),i=!!t&&Z7(t);return O2(()=>this.close(),o`
        ${t?o`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${u3(t)}"></span>
                  ${M2()?M:o`<span class="task-name">${t.name}</span>`}
                  ${A6(t,e)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&Promise.resolve().then(()=>(c1(),b1)).then(({openObjectQuickActions:L})=>{L(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${t.next_due?o`<span><strong>${V("next_due",e)}:</strong> ${B(t.next_due,e)}</span>`:M}
                  ${t.last_performed?o`<span><strong>${V("last_performed",e)}:</strong> ${B(t.last_performed,e)}</span>`:M}
                  ${t.schedule?.kind&&!["manual","one_time"].includes(t.schedule.kind)||t.interval_days!=null?o`<span><strong>${V("interval",e)}:</strong> ${L4(t,e)}</span>`:M}
                  ${M5(t)?o`<span><strong>${V("phase_current",e)}:</strong> ${M5(t)}</span>`:M}
                </div>
                ${t.notes?o`<div class="notes-body">${m3(t.notes)}</div>`:M}
              </div>

              ${this._error?D("error",this._error):M}

              ${this._showSkip?o`
                    <div class="inline-form">
                      <ms-textfield label=${V("skip_reason",e)} .value=${this._skipReason}
                        @input=${L=>{this._skipReason=L.target.value}}></ms-textfield>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${V("cancel",e)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${V("skip",e)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?o`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${V("reset_to_date",e)}
                        .hass=${this.hass}
                        .lang=${e}
                        .value=${this._resetDate}
                        @value-changed=${L=>{this._resetDate=L.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${V("cancel",e)}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${V("reset",e)}
                        </button>
                      </div>
                    </div>
                  `:this._showPostpone?o`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${V("postpone_date_prompt",e)}
                        .hass=${this.hass}
                        .lang=${e}
                        .value=${this._postponeDate}
                        @value-changed=${L=>{this._postponeDate=L.detail.value}}
                      ></ms-date-field>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showPostpone=!1}} ?disabled=${this._busy}>
                          ${V("cancel",e)}
                        </button>
                        <button class="btn primary qa-postpone-confirm" @click=${this._onPostponeConfirm}
                          ?disabled=${this._busy||!this._postponeDate}>
                          ${V("postpone",e)}
                        </button>
                      </div>
                    </div>
                  `:o`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${()=>this._onComplete()} .disabled=${this._busy}
                        title=${n2(t)?V("qr_action_quick_complete",e):V("complete",e)}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${V("complete",e)}
                      </ha-button>
                      ${n2(t)?o`<ha-button appearance="outlined" variant="success" class="qa-complete-details" @click=${()=>this._onComplete(!0)} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:text-box-edit-outline"></ha-icon>
                            ${V("complete_with_details",e)}
                          </ha-button>`:M}
                      ${t.allow_skip!==!1?o`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${V("skip",e)}
                            </ha-button>
                          `:M}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${V("reset",e)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${H?o`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${V("edit",e)}
                          </ha-button>`:M}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${V("qr_code",e)}
                      </ha-button>
                      ${i?M:o`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${V("postpone",e)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${V("snooze",e)}
                          </ha-button>`}
                      ${H?o`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${t.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${t.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${t.archived?V("unarchive",e):V("archive",e)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${V("delete",e)}
                          </ha-button>`:M}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?V("hide_details",e):V("show_details",e)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?o`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?V("hide_stats",e):V("show_stats",e)}
                          </button>`:M}
                    </div>
                    ${this._showDetails?this._renderDetails(t):M}
                    ${this._showAdaptive?this._renderAdaptive(t):M}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${V("open_in_panel",e)}
                      </button>
                    </div>
                  `}
            `:this._error?D("error",this._error):o`<div class="loading">${V("loading",e)}</div>`}
    `,{title:t?.name})}updated(e){e.has("_open")&&this._open&&$2(this.shadowRoot)}};P.styles=[D5,w2,g`
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
      border-radius: var(--ms-radius-6, 6px); cursor: pointer;
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
      margin-top: 8px; padding: 8px; border-radius: var(--ms-radius-6, 6px);
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
      padding: 8px; border-radius: var(--ms-radius-6, 6px);
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
      padding: 8px; border-radius: var(--ms-radius-6, 6px);
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
      padding: 6px 8px; border-radius: var(--ms-radius-6, 6px); border-bottom: none; margin-bottom: 6px;
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
      padding: 8px 12px; border-radius: var(--ms-radius-6, 6px);
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
  `],s([v({attribute:!1})],P.prototype,"hass",2),s([l()],P.prototype,"_open",2),s([l()],P.prototype,"_entryId",2),s([l()],P.prototype,"_taskId",2),s([l()],P.prototype,"_task",2),s([l()],P.prototype,"_objectName",2),s([l()],P.prototype,"_taskRef",2),s([l()],P.prototype,"_busy",2),s([l()],P.prototype,"_error",2),s([l()],P.prototype,"_showSkip",2),s([l()],P.prototype,"_showReset",2),s([l()],P.prototype,"_showPostpone",2),s([l()],P.prototype,"_showDetails",2),s([l()],P.prototype,"_showAdaptive",2),s([l()],P.prototype,"_skipReason",2),s([l()],P.prototype,"_resetDate",2),s([l()],P.prototype,"_postponeDate",2),s([l()],P.prototype,"_features",2),s([l()],P.prototype,"_toast",2),s([l()],P.prototype,"_access",2),s([l()],P.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",P)});var T6=u(()=>{"use strict";Y2();c2();e1()});function E6(C,r,e){return C&&r?.[C]?.name||e}var P6=u(()=>{"use strict";e1();T6();B0();T1()});function R6(C){if(C.key!=="Enter"&&C.key!==" ")return;let e=C.target?.closest?.('[role="menuitem"], [role="button"]');!e||e.getAttribute("aria-disabled")==="true"||(C.preventDefault(),e.click())}var B6=u(()=>{"use strict"});var l1,F6=u(()=>{"use strict";y();$0();P0();q();b();P6();f1();D0();r5();X2();d3();l3();B6();q1();l1=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=o2;this._loadSeq=0}get _lang(){return T(this.hass)}async openFor(e){e!==this._entryId&&(this._data=null),this._entryId=e,this._error="",this._open=!0,await Promise.all([this._load(),M1(this.hass).then(t=>{this._access=t.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let e=this._entryId;if(!e)return;let t=++this._loadSeq,H="",i=await F(this,{type:"maintenance_supporter/object",entry_id:e},{onError:L=>{H=L}});t===this._loadSeq&&(i===void 0?this._error=H:this._data=i)}_runWs(e){return this._error="",F(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_onEditObject(){!this._entryId||!this._data||Promise.resolve().then(()=>(c1(),b1)).then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&Promise.resolve().then(()=>(c1(),b1)).then(({openCreateTaskDialog:e})=>{e(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await s5(this.hass,{title:V("delete",this._lang),message:V("delete_object_confirm",this._lang),confirmText:V("delete",this._lang),danger:!0}))return;let t=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let e=!!this._data.object.archived;if(!e&&!await s5(this.hass,{title:V("archive_object",this._lang),message:V("confirm_archive_object",this._lang),confirmText:V("archive_object",this._lang)}))return;let t=this._entryId;await this._runWs({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}_onTaskClick(e){this._entryId&&Promise.resolve().then(()=>(c1(),b1)).then(({openTaskQuickActions:t})=>{t(this._entryId,e)})}render(){if(!this._open)return M;let e=this._lang,t=this._data,H=t?.object,i=t?.tasks||[],L=N1(this.hass?.user,this._access);return O2(()=>this.close(),o`
        ${t&&H?o`
              <div class="header">
                ${M2()?M:o`<div class="title">${H.name}</div>`}
                ${this._renderMetaRow(H)}
              </div>

              ${this._error?D("error",this._error):M}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${V("tasks",e)}</strong>
                  <span class="count">${i.length}</span>
                </div>
                ${i.length===0?o`<div class="empty">${V("no_tasks",e)}</div>`:o`
                      <div class="task-list">
                        ${i.map(a=>o`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(a.id)} @keydown=${R6}>
                            <span class="status-dot" style="background: ${u3(a)}"></span>
                            <span class="task-name">${a.name}</span>
                            <span class="task-status ${l5(a)}">${I0(l5(a),e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${H.notes?o`
                    <div class="notes-section">
                      <strong>${V("object_notes_label",e)}</strong>
                      <div class="notes-body">${m3(H.notes)}</div>
                    </div>
                  `:M}

              ${L?o`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${V("add_task",e)}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${V("edit",e)}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${H.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${H.archived?V("unarchive_object",e):V("archive_object",e)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${V("delete",e)}
                      </button>
                    </div>
                  `:M}
            `:this._error?D("error",this._error):o`<div class="loading">${V("loading",e)}</div>`}
    `,{title:H?.name})}updated(e){e.has("_open")&&this._open&&$2(this.shadowRoot)}_renderMetaRow(e){let t=this._lang,H=[];return e.area_id&&H.push([V("area",t),E6(e.area_id,this.hass?.areas,V("no_area",t))]),e.manufacturer&&H.push([V("manufacturer",t),e.manufacturer]),e.model&&H.push([V("model",t),e.model]),e.serial_number&&H.push([V("serial_number_label",t),e.serial_number]),e.installation_date&&H.push([V("installed",t),B(e.installation_date,t)]),e.warranty_expiry&&H.push([V("warranty",t),B(e.warranty_expiry,t)]),e.documentation_url&&H.push([V("documentation_url_label",t),e.documentation_url,p3(e.documentation_url)]),H.length===0?M:o`
      <div class="meta">
        ${H.map(([i,L,a])=>o`
            <div class="meta-item">
              <span class="meta-label">${i}</span>
              <span class="meta-value">${a||Y9(L)?o`<a href="${L}" target="_blank" rel="noopener noreferrer">${L}</a>`:L}</span>
            </div>
          `)}
      </div>
    `}};l1.styles=[w2,g`
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
      padding: 8px; border-radius: var(--ms-radius-6, 6px); cursor: pointer;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
      transition: background 0.12s;
    }
    .task-row:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
    .task-row:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .task-name { flex: 1; font-size: 14px; }
    .task-status { font-size: 11px; color: var(--secondary-text-color); text-transform: uppercase; }
    .notes-body { white-space: pre-wrap; font-size: 13px; padding: 8px; background: var(--secondary-background-color); border-radius: var(--ms-radius-6, 6px); }
    .notes-body ha-markdown { white-space: normal; }
    .actions { display: flex; gap: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color); }
    .actions .btn { flex: 1; }
    .btn {
      padding: 8px; font-size: 13px; border-radius: var(--ms-radius-6, 6px); cursor: pointer;
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
    .error { padding: 8px; border-radius: var(--ms-radius-6, 6px); background: rgba(211,47,47,0.1); color: var(--error-color); font-size: 13px; }
  `],s([v({attribute:!1})],l1.prototype,"hass",2),s([l()],l1.prototype,"_open",2),s([l()],l1.prototype,"_entryId",2),s([l()],l1.prototype,"_data",2),s([l()],l1.prototype,"_busy",2),s([l()],l1.prototype,"_error",2),s([l()],l1.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",l1)});var b1={};U6(b1,{__resetSettingsCacheForTests:()=>gt,getRowActionStyle:()=>_t,openCompleteDialog:()=>bt,openCreateObjectDialog:()=>ft,openCreateTaskDialog:()=>St,openEditObjectDialog:()=>Zt,openEditTaskDialog:()=>yt,openHistoryEditDialog:()=>q0,openObjectQuickActions:()=>wt,openQrDialog:()=>kt,openTaskQuickActions:()=>W0});function T2(){return document.querySelector("home-assistant")?.hass}function xt(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function k1(C){let r=xt(),e=r.querySelector(C)??document.body.querySelector(C);return e?e.parentNode!==r&&r.appendChild(e):(e=document.createElement(C),r.appendChild(e)),e}function w1(C){let r=T2();if(!r)return!1;C.hass=r;let e=T(r);return h1(e)||r2(e).then(()=>{C.requestUpdate?.()}),Q3(r.locale,r.config?.country,r.config?.time_zone),!0}function _t(C){return M1(C).then(r=>r.rowActionStyle)}function gt(){g4()}function ft(){let C=k1(I6);return w1(C)?(C.openCreate(),N6(C),!0):!1}async function N6(C){let r=T2();r&&(C.placesEnabled=(await M1(r)).features.places)}function Zt(C,r){let e=k1(I6);return w1(e)?(e.openEdit(C,r),N6(e),!0):!1}function St(C="",r){let e=k1(D6);if(!w1(e))return!1;let t=T2();return t?((async()=>{let H=await M1(t),i=e;j6(i,H),i.openCreate(C,r)})(),!0):!1}function j6(C,r){C.checklistsEnabled=r.features.checklists,C.scheduleTimeEnabled=r.features.schedule_time,C.completionActionsEnabled=r.features.completion_actions,C.adaptiveFeature=r.features.adaptive,C.seasonalFeature=r.features.seasonal,C.environmentalFeature=r.features.environmental,C.defaultWarningDays=r.defaultWarningDays,C.mirrorTodoDefault=r.mirrorTodoDefault,C.betaEditor=r.features.beta_editor}function yt(C,r){let e=k1(D6);if(!w1(e))return!1;let t=T2();return t?((async()=>{try{let[H,i]=await Promise.all([t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:C}),M1(t)]),L=(H.tasks||[]).find(n=>n.id===r);if(!L){console.warn(`openEditTaskDialog: task ${r} not found in entry ${C}`);return}let a=e;j6(a,i),await a.openEdit(C,L)}catch(H){console.warn("openEditTaskDialog: failed to load task/features",H)}})(),!0):!1}function q0(C){let r=k1(mt);return w1(r)?(r.openEdit(C),!0):!1}function bt(C){let r=k1(At);if(!w1(r))return!1;let e=r;return e.__msUndoWired||(e.__msUndoWired=!0,r.addEventListener("task-completed",t=>{let H=t.detail,i=T2();H?.undo&&i&&Q5(r,i,H,T(i),()=>{})})),K9(r,C,T(T2())),!0}function kt(C){let r=k1(ut);return w1(r)?(r.openForTask(C.entry_id,C.task_id,C.object_name,C.task_name),!0):!1}function W0(C,r){let e=k1(vt);return w1(e)?(e.openFor(C,r),!0):!1}function wt(C){let r=k1(ht);return w1(r)?(r.openFor(C),!0):!1}var I6,D6,mt,At,ut,vt,ht,c1=u(()=>{"use strict";E4();_9();R9();q9();U9();$6();F6();H5();b();k0();r5();I6="maintenance-object-dialog",D6="maintenance-task-dialog",mt="maintenance-history-edit-dialog",At="maintenance-complete-dialog",ut="maintenance-qr-dialog",vt="maintenance-task-quick-actions-dialog",ht="maintenance-object-quick-actions-dialog"});y();q();c2();var i8={days:1,weeks:7,months:30.4368,years:365.25};function _7(C,r){return!C||C<=0?0:C*(i8[r||"days"]??1)}T1();function a8(C){return C.responsible_user_id?[C.responsible_user_id]:[...new Set((C.assignee_pool||[]).filter(r=>typeof r=="string"&&r))]}function E3(C,r){return!!r&&a8(C).includes(r)}e1();var E7=5;function p8(C,r){let e=[];for(let t=0;t<r;t++)e.push(t2(C,t));return e}function c8(C){if(!C||C.length===0)return null;let r=C.map(e=>U2(e)).filter(e=>e!==null&&e>=0);return r.length===0?null:r.reduce((e,t)=>e+t,0)/r.length}function m8(C){let{windowStart:r,windowEnd:e,task:t,entryId:H,objectName:i}=C,L=[],a=(c,A)=>({date:c,entry_id:H,task_id:t.id,task_name:t.name,object_name:i,status:A&&b5(t.status)?"ok":t.status,days_until_due:A?null:t.days_until_due??null,projected:A,schedule_type:t.schedule_type,interval_days:t.interval_days??null,interval_unit:t.interval_unit??null,responsible_user_id:t.responsible_user_id??null,avg_cost:c8(t.history),adaptive_enabled:!!t.adaptive_config?.enabled,prediction_confidence:t.threshold_prediction_confidence??null}),n=Math.max(1,Math.round(_7(t.interval_days,t.interval_unit)));if(b5(t.status)){if(L.push(a(r,!1)),t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let c=t2(r,n),A=1;for(;c<=e&&A<E7;)L.push(a(c,!0)),A++,c=t2(c,n)}return L}let d=t.next_due;if(typeof d!="string"||!d)return L;let p=d.slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(p))return L;if(p>=r&&p<=e)L.push(a(p,!1));else if(p>e)return L;if(t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let c=t2(p,n),A=L.length;for(;c<=e&&A<E7;)c>=r&&(L.push(a(c,!0)),A++),c=t2(c,n)}return L}function P7(C,r,e,t=null){let H=p8(r,e),i=H[0],L=H[H.length-1],a=[];for(let d of C){let p=d.object?.name||"",c=d.entry_id,A=d.tasks||[];for(let x of A){if(t&&!E3(x,t)||x.enabled===!1)continue;let _=m8({windowStart:i,windowEnd:L,task:x,entryId:c,objectName:p});a.push(..._)}}let n=new Map;for(let d of H)n.set(d,[]);for(let d of a){let p=n.get(d.date);p&&p.push(d)}for(let[,d]of n)d.sort((p,c)=>{let A=T3(p.status),x=T3(c.status);if(A!==x)return A-x;if(p.projected!==c.projected)return p.projected?1:-1;let _=p.object_name.localeCompare(c.object_name);return _!==0?_:p.task_name.localeCompare(c.task_name)});return H.map(d=>({date:d,events:n.get(d)??[]}))}var A8={completed:"ok",reset:"ok",skipped:"due_soon",missed:"overdue",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok",updated:"ok"};function O5(C,r){return`${C}/${r}`}function R7(C,r,e){let t=B7(r,e)[0],H=[];for(let i of C)for(let L of i.tasks||[]){let a=L.history||[],n=L.history_count??a.length;if(n<=a.length)continue;let d=a.map(A=>m2(A?.timestamp)).filter(A=>!!A),p=d.length?d.reduce((A,x)=>A<x?A:x):"";if(p&&p<t)continue;let c=O5(i.entry_id,L.id);H.push({entryId:i.entry_id,taskId:L.id,key:c,sig:`${c}:${n}:${u8(JSON.stringify(a))}`})}return H}function u8(C){let r=2166136261;for(let e=0;e<C.length;e++)r^=C.charCodeAt(e),r=Math.imul(r,16777619);return(r>>>0).toString(36)}function B7(C,r){let e=[];for(let t=r-1;t>=0;t--)e.push(t2(C,-t));return e}function F7(C,r,e,t=null,H={}){let i=B7(r,e),L=i[0],a=i[i.length-1],n=new Map;for(let p of i)n.set(p,[]);for(let p of C){let c=p.object?.name||"",A=p.entry_id,x=p.tasks||[];for(let _ of x){if(t&&!E3(_,t))continue;let R=H[O5(A,_.id)]??(_.history||[]);for(let $ of R){if(typeof $?.timestamp!="string")continue;let N=m2($.timestamp);if(!N||N<L||N>a)continue;let K=n.get(N);if(!K)continue;let X=$.type??"completed";K.push({date:N,entry_id:A,task_id:_.id,task_name:_.name,object_name:c,status:A8[X]??"ok",days_until_due:null,projected:!1,schedule_type:_.schedule_type,interval_days:_.interval_days??null,responsible_user_id:_.responsible_user_id??null,avg_cost:U2($),adaptive_enabled:!!_.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:$.timestamp,history_type:X,history_cost:U2($),history_notes:typeof $.notes=="string"?$.notes:null,history_duration:typeof $.duration=="number"?$.duration:null})}}}let d={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4,updated:5};for(let[,p]of n)p.sort((c,A)=>{let x=d[c.history_type??""]??99,_=d[A.history_type??""]??99;if(x!==_)return x-_;let R=c.object_name.localeCompare(A.object_name);return R!==0?R:c.task_name.localeCompare(A.task_name)});return i.map(p=>({date:p,events:n.get(p)??[]}))}e1();y();var I7=g`
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
    border-radius: var(--ms-radius-6, 6px);
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
`;b();function n4(C){let r=window;r.customCards=r.customCards||[],r.customCards.some(e=>e.type===C.type)||r.customCards.push(C)}function s4(C,r,e=t=>import(t)){let t=window,H;try{let p=new URL(r);H=p.origin+p.pathname}catch{return}let i=`__msCardHeal:${C[0]}:${H}`;if(t[i])return;t[i]=!0;let L=0,a=0,n=!1,d=()=>{if(L+=1,C.some(c=>!customElements.get(c))&&a<3&&!n){a+=1,n=!0;try{let c=new URL(r);c.searchParams.set("heal",`${Date.now()}`),e(c.href).catch(()=>{}).finally(()=>{n=!1})}catch{return}}L<20&&window.setTimeout(d,L<8?500:2e3)};window.setTimeout(d,250)}e0();X2();r5();c1();T1();X3();var C1=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._objectFilter="";this._configuredObjects=[];this._unsub=null;this._pastHistory={};this._pastHistorySig="";this._pastSeq=0;this._dataLoaded=!1;this._lastConnection=null;this._onHistorySaved=e=>{let t=e.detail;!t?.entry_id||!t.task_id||!(O5(t.entry_id,t.task_id)in this._pastHistory)||(this._pastHistorySig="",this._loadPastHistories())};this._subGen=0}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(e){if(this._config={...e},this._windowDays=e.window_days&&[7,14,30,365].includes(e.window_days)?e.window_days:30,this._pastDays=e.past_days&&[30,90].includes(e.past_days)?e.past_days:0,this._userFilter=typeof e.user_filter=="string"?e.user_filter:"",typeof e.object_filter=="string")this._objectFilter=e.object_filter,this._configuredObjects=[];else if(Array.isArray(e.object_filter)){let t=e.object_filter.filter(H=>typeof H=="string"&&H!=="");this._objectFilter=t.length===1?t[0]:"",this._configuredObjects=t.length>1?t:[]}else this._objectFilter="",this._configuredObjects=[]}getCardSize(){return 6}get _lang(){return T(this.hass)}connectedCallback(){super.connectedCallback(),window.addEventListener("history-entry-saved",this._onHistorySaved)}disconnectedCallback(){if(super.disconnectedCallback(),this._subGen++,window.removeEventListener("history-entry-saved",this._onHistorySaved),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(e){if(super.updated(e),X7(this,e),this.hass&&this._pastDays>0&&(e.has("_objects")||e.has("_pastDays"))&&this._loadPastHistories(),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=e.objects,this._stats=t,T5(this._stats.budget)}catch{}}async _loadPastHistories(){let e=R7(this._objects,v1(),this._pastDays||30),t=e.map(L=>L.sig).join("|");if(t===this._pastHistorySig)return;this._pastHistorySig=t;let H=++this._pastSeq,i=await Promise.all(e.map(async L=>{try{let a=await N5(this.hass,L.entryId,L.taskId);return a?[L.key,a]:null}catch{return null}}));H===this._pastSeq&&(this._pastHistory=Object.fromEntries(i.filter(L=>L!==null)))}async _subscribe(){let e=++this._subGen;try{let t=await this.hass.connection.subscribeMessage(H=>{let i=H;this._objects=i.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected||e!==this._subGen){t();return}this._unsub=t}catch{}}_onEventClick(e){if(e.history_timestamp&&y5.includes(String(e.history_type||"completed"))){this._openHistoryEntry(e);return}this._openTask(e)}_openTask(e){let t=new CustomEvent("maintenance-supporter-open-task",{detail:{entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(t)&&(W0(e.entry_id,e.task_id)||this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0})))}async _openHistoryEntry(e){try{let t=await M1(this.hass);if(!N1(this.hass?.user,t.access)){this._openTask(e);return}}catch{}try{let t=await u4(this.hass,e.entry_id,e.task_id,e.history_timestamp);if(!t||q0(t))return}catch{}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:e.history_timestamp},bubbles:!0,composed:!0}))}render(){if(!this.hass)return M;let e=this._lang,t=this._config.show_window_chips!==!1,H=this._config.show_user_filter!==!1,i=this._config.title,L=null;this._userFilter&&(L=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let a=h=>{let m1=h.toLowerCase();return this._objects.find(O1=>O1.entry_id===h||O1.object.name.toLowerCase()===m1)?.entry_id??null},n=new Set(this._configuredObjects.map(a).filter(h=>h!==null)),d=n.size?this._objects.filter(h=>n.has(h.entry_id)):this._objects,p=this._config.show_object_filter!==!1&&d.length>1,c=this._objectFilter?a(this._objectFilter):null,A=c&&d.some(h=>h.entry_id===c)?d.filter(h=>h.entry_id===c):d,x=v1(),_=this._pastDays>0,R=_?F7(A,x,this._pastDays,L,this._pastHistory):P7(A,x,this._windowDays,L),$=this._windowDays===365||_,N=$?R.filter(h=>h.events.length>0):R,K=h=>{let m1=`cal-status-${h.status}`,G1=h.projected?"cal-event-projected":"",O1=h.status==="overdue"&&h.days_until_due!=null?` (${F5(h.days_until_due,e)})`:"",j=h.projected&&h.interval_days?o`<span class="cal-event-recur">${h.interval_unit&&h.interval_unit!=="days"?H2(h.interval_days,h.interval_unit,e):h.interval_days===1?V("cal_every_day",e):V("cal_every_n_days",e).replace("{n}",String(h.interval_days))}</span>`:M,U=h.schedule_type==="sensor_based",P2=U?o`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${V("cal_source_sensor",e)}" icon="mdi:trending-up"></ha-icon>`:o`<ha-icon class="cal-event-icon cal-source-time"
                title="${h.adaptive_enabled?V("cal_source_time_adaptive",e):V("cal_source_time",e)}"
                icon="${h.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,R2=U&&h.prediction_confidence&&h.status!=="triggered"&&!h.projected?o`<span class="cal-event-prediction cal-conf-${h.prediction_confidence}">
            ${V("cal_predicted",e)} · ${V(`cal_confidence_${h.prediction_confidence}`,e)}
          </span>`:M,h3=V2(this._stats?.budget),q6=h.history_type?V(h.history_type,e):V(h.status,e);return o`
        <div class="cal-event ${G1}"
          @click=${()=>this._onEventClick(h)}>
          ${P2}
          <span class="cal-status-pill ${m1}">${q6}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${h.object_name} · ${h.task_name}${O1}</div>
            ${R2}
            ${j}
          </div>
          ${h.avg_cost!=null&&h.avg_cost!==0?o`<span class="cal-event-cost">${Y(h.avg_cost,h3,e)}</span>`:M}
        </div>
      `},X=h=>{let[m1,G1,O1]=h.date.split("-").map(Number),j=new Date(m1,G1-1,O1),U=h.date===x,P2=V4(j,e,"short"),R2=i4(j,e,"long");return o`
        <div class="cal-day-row">
          <div class="cal-day-pill ${U?"cal-today":""}">
            <span class="cal-pill-weekday">${P2}</span>
            <span class="cal-pill-day">${j.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${R2}</span>
              ${U?o`<span class="cal-day-today-badge">${V("today",e)}</span>`:M}
            </div>
            ${h.events.length===0?o`<div class="cal-empty">${V("cal_no_events",e)}</div>`:h.events.map(K)}
          </div>
        </div>
      `};return o`
      <ha-card .header=${i}>
        ${t||H||p?o`
              <div class="cal-controls">
                ${t?o`
                      <div class="cal-window-chips cal-past-chips" title="${V("cal_past_windows",e)}">
                        ${[30,90].map(h=>o`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===h?"active":""}"
                            @click=${()=>{this._pastDays=h}}>
                            −${h}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${V("cal_forward_windows",e)}">
                        ${[7,14,30,365].map(h=>o`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===h?"active":""}"
                            @click=${()=>{this._windowDays=h,this._pastDays=0}}>
                            ${h===365?"+1y":`+${h}d`}
                          </button>
                        `)}
                      </div>
                    `:M}
                ${H?o`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${h=>{this._userFilter=h.target.value}}>
                        <option value="">${V("all_users",e)}</option>
                        <option value="current_user">${V("my_tasks",e)}</option>
                      </select>
                    `:M}
                ${p?o`
                      <select class="cal-user-filter"
                        .value=${c??""}
                        @change=${h=>{this._objectFilter=h.target.value}}>
                        <option value="">${V("all_objects",e)}</option>
                        ${[...d].sort((h,m1)=>h.object.name.localeCompare(m1.object.name)).map(h=>o`<option value=${h.entry_id} ?selected=${h.entry_id===c}>${h.object.name}</option>`)}
                      </select>
                    `:M}
              </div>
            `:M}
        <div class="cal-rolling">
          ${N.length===0&&$?o`<div class="cal-empty">${V("cal_no_events",e)}</div>`:N.map(X)}
        </div>
      </ha-card>
    `}};C1.styles=[D5,I7,g`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],s([v({attribute:!1})],C1.prototype,"hass",2),s([l()],C1.prototype,"_config",2),s([l()],C1.prototype,"_objects",2),s([l()],C1.prototype,"_stats",2),s([l()],C1.prototype,"_windowDays",2),s([l()],C1.prototype,"_pastDays",2),s([l()],C1.prototype,"_userFilter",2),s([l()],C1.prototype,"_objectFilter",2),s([l()],C1.prototype,"_unsub",2),s([l()],C1.prototype,"_pastHistory",2);var Ot=[{value:7,key:"cal_editor_window_week"},{value:14,key:"cal_editor_window_fortnight"},{value:30,key:"cal_editor_window_month"},{value:365,key:"cal_editor_window_year"}],$t=[{value:30,key:"cal_editor_window_past_30"},{value:90,key:"cal_editor_window_past_90"}],E2=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}get _lang(){return T(this.hass)}setConfig(e){this._config={...e}}updated(){let e=this._lang;e&&!h1(e)&&r2(e).then(()=>{h1(e)&&this.requestUpdate()})}_valueChanged(e,t){let H={...this._config,[e]:t};e==="show_window_chips"&&t===!0&&delete H.show_window_chips,e==="show_user_filter"&&t===!0&&delete H.show_user_filter,e==="show_object_filter"&&t===!0&&delete H.show_object_filter,e==="title"&&(!t||typeof t=="string"&&t.trim()==="")&&delete H.title,e==="user_filter"&&t===""&&delete H.user_filter,this._emit(H)}_windowChanged(e){let t={...this._config};e.startsWith("past-")?(t.past_days=Number(e.slice(5)),delete t.window_days):(t.window_days=Number(e),delete t.past_days),this._emit(t)}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){let e=this._lang,t=this._config.past_days?`past-${this._config.past_days}`:`${this._config.window_days??30}`,H=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,L=this._config.user_filter??"",a=this._config.title??"";return o`
      <div class="editor">
        <div class="row">
          <label for="title">${V("card_title",e)}</label>
          <input
            id="title"
            type="text"
            .value=${a}
            @input=${n=>this._valueChanged("title",n.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${V("cal_editor_window",e)}</label>
          <select
            id="window"
            @change=${n=>this._windowChanged(n.target.value)}
          >
            ${Ot.map(n=>o`<option value="${n.value}" ?selected=${`${n.value}`===t}>${V(n.key,e)}</option>`)}
            ${$t.map(n=>o`<option value="past-${n.value}" ?selected=${`past-${n.value}`===t}>${V(n.key,e)}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${V("cal_editor_show_chips",e)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${H}
            @change=${n=>this._valueChanged("show_window_chips",n.target.checked)}
          />
        </div>
        <div class="hint">${V("cal_editor_chips_hint",e)}</div>
        <div class="row toggle">
          <label for="userf">${V("cal_editor_show_user_filter",e)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${i}
            @change=${n=>this._valueChanged("show_user_filter",n.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">${V("cal_editor_default_user",e)}</label>
          <select
            id="userv"
            @change=${n=>this._valueChanged("user_filter",n.target.value)}
          >
            <option value="" ?selected=${L===""}>${V("all_users",e)}</option>
            <option value="current_user" ?selected=${L==="current_user"}>
              ${V("cal_editor_my_tasks",e)}
            </option>
          </select>
        </div>
        <div class="row toggle">
          <label for="objf">${V("cal_editor_show_object_filter",e)}</label>
          <input
            id="objf"
            type="checkbox"
            .checked=${this._config.show_object_filter!==!1}
            @change=${n=>this._valueChanged("show_object_filter",n.target.checked)}
          />
        </div>
        <div class="hint">${V("cal_editor_object_hint",e)}</div>
      </div>
    `}};E2.styles=g`
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
  `,s([v({attribute:!1})],E2.prototype,"hass",2),s([l()],E2.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",C1);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",E2);s4(["maintenance-supporter-calendar-card"],import.meta.url);n4({type:"maintenance-supporter-calendar-card",name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});export{C1 as MaintenanceCalendarCard};
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
lit-html/directives/live.js:
lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
