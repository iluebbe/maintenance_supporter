var tt=Object.defineProperty;var pi=Object.getOwnPropertyDescriptor;var y=(a,i,e)=>()=>{if(e)throw e[0];try{return a&&(i=a(a=0)),i}catch(t){throw e=[t],t}};var hi=(a,i)=>{for(var e in i)tt(a,e,{get:i[e],enumerable:!0})};var o=(a,i,e,t)=>{for(var s=t>1?void 0:t?pi(i,e):i,n=a.length-1,c;n>=0;n--)(c=a[n])&&(s=(t?c(i,e,s):c(s))||s);return t&&s&&tt(i,e,s),s};var be,ye,He,it,ne,st,w,rt,je,Re=y(()=>{be=globalThis,ye=be.ShadowRoot&&(be.ShadyCSS===void 0||be.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,He=Symbol(),it=new WeakMap,ne=class{constructor(i,e,t){if(this._$cssResult$=!0,t!==He)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=e}get styleSheet(){let i=this.o,e=this.t;if(ye&&i===void 0){let t=e!==void 0&&e.length===1;t&&(i=it.get(e)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),t&&it.set(e,i))}return i}toString(){return this.cssText}},st=a=>new ne(typeof a=="string"?a:a+"",void 0,He),w=(a,...i)=>{let e=a.length===1?a[0]:i.reduce((t,s,n)=>t+(c=>{if(c._$cssResult$===!0)return c.cssText;if(typeof c=="number")return c;throw Error("Value passed to 'css' function must be a 'css' function result: "+c+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+a[n+1],a[0]);return new ne(e,a,He)},rt=(a,i)=>{if(ye)a.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of i){let t=document.createElement("style"),s=be.litNonce;s!==void 0&&t.setAttribute("nonce",s),t.textContent=e.cssText,a.appendChild(t)}},je=ye?a=>a:a=>a instanceof CSSStyleSheet?(i=>{let e="";for(let t of i.cssRules)e+=t.cssText;return st(e)})(a):a});var ui,_i,gi,mi,fi,vi,xe,at,bi,yi,oe,le,$e,nt,M,ce=y(()=>{Re();Re();({is:ui,defineProperty:_i,getOwnPropertyDescriptor:gi,getOwnPropertyNames:mi,getOwnPropertySymbols:fi,getPrototypeOf:vi}=Object),xe=globalThis,at=xe.trustedTypes,bi=at?at.emptyScript:"",yi=xe.reactiveElementPolyfillSupport,oe=(a,i)=>a,le={toAttribute(a,i){switch(i){case Boolean:a=a?bi:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,i){let e=a;switch(i){case Boolean:e=a!==null;break;case Number:e=a===null?null:Number(a);break;case Object:case Array:try{e=JSON.parse(a)}catch{e=null}}return e}},$e=(a,i)=>!ui(a,i),nt={attribute:!0,type:String,converter:le,reflect:!1,useDefault:!1,hasChanged:$e};Symbol.metadata??=Symbol("metadata"),xe.litPropertyMetadata??=new WeakMap;M=class extends HTMLElement{static addInitializer(i){this._$Ei(),(this.l??=[]).push(i)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(i,e=nt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(i)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(i,e),!e.noAccessor){let t=Symbol(),s=this.getPropertyDescriptor(i,t,e);s!==void 0&&_i(this.prototype,i,s)}}static getPropertyDescriptor(i,e,t){let{get:s,set:n}=gi(this.prototype,i)??{get(){return this[e]},set(c){this[e]=c}};return{get:s,set(c){let d=s?.call(this);n?.call(this,c),this.requestUpdate(i,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(i){return this.elementProperties.get(i)??nt}static _$Ei(){if(this.hasOwnProperty(oe("elementProperties")))return;let i=vi(this);i.finalize(),i.l!==void 0&&(this.l=[...i.l]),this.elementProperties=new Map(i.elementProperties)}static finalize(){if(this.hasOwnProperty(oe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(oe("properties"))){let e=this.properties,t=[...mi(e),...fi(e)];for(let s of t)this.createProperty(s,e[s])}let i=this[Symbol.metadata];if(i!==null){let e=litPropertyMetadata.get(i);if(e!==void 0)for(let[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let s=this._$Eu(e,t);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(i){let e=[];if(Array.isArray(i)){let t=new Set(i.flat(1/0).reverse());for(let s of t)e.unshift(je(s))}else i!==void 0&&e.push(je(i));return e}static _$Eu(i,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof i=="string"?i.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(i=>i(this))}addController(i){(this._$EO??=new Set).add(i),this.renderRoot!==void 0&&this.isConnected&&i.hostConnected?.()}removeController(i){this._$EO?.delete(i)}_$E_(){let i=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(i.set(t,this[t]),delete this[t]);i.size>0&&(this._$Ep=i)}createRenderRoot(){let i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rt(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(i=>i.hostConnected?.())}enableUpdating(i){}disconnectedCallback(){this._$EO?.forEach(i=>i.hostDisconnected?.())}attributeChangedCallback(i,e,t){this._$AK(i,t)}_$ET(i,e){let t=this.constructor.elementProperties.get(i),s=this.constructor._$Eu(i,t);if(s!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:le).toAttribute(e,t.type);this._$Em=i,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(i,e){let t=this.constructor,s=t._$Eh.get(i);if(s!==void 0&&this._$Em!==s){let n=t.getPropertyOptions(s),c=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:le;this._$Em=s;let d=c.fromAttribute(e,n.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(i,e,t,s=!1,n){if(i!==void 0){let c=this.constructor;if(s===!1&&(n=this[i]),t??=c.getPropertyOptions(i),!((t.hasChanged??$e)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(i)&&!this.hasAttribute(c._$Eu(i,t))))return;this.C(i,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(i,e,{useDefault:t,reflect:s,wrapped:n},c){t&&!(this._$Ej??=new Map).has(i)&&(this._$Ej.set(i,c??e??this[i]),n!==!0||c!==void 0)||(this._$AL.has(i)||(this.hasUpdated||t||(e=void 0),this._$AL.set(i,e)),s===!0&&this._$Em!==i&&(this._$Eq??=new Set).add(i))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let i=this.scheduleUpdate();return i!=null&&await i,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[s,n]of t){let{wrapped:c}=n,d=this[s];c!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,n,d)}}let i=!1,e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw i=!1,this._$EM(),t}i&&this._$AE(e)}willUpdate(i){}_$AE(i){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(i)),this.updated(i)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(i){return!0}update(i){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(i){}firstUpdated(i){}};M.elementStyles=[],M.shadowRootOptions={mode:"open"},M[oe("elementProperties")]=new Map,M[oe("finalized")]=new Map,yi?.({ReactiveElement:M}),(xe.reactiveElementVersions??=[]).push("2.1.2")});function ft(a,i){if(!Ue(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return lt!==void 0?lt.createHTML(i):i}function ee(a,i,e=a,t){if(i===J)return i;let s=t!==void 0?e._$Co?.[t]:e._$Cl,n=he(i)?void 0:i._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(a),s._$AT(a,e,t)),t!==void 0?(e._$Co??=[])[t]=s:e._$Cl=s),s!==void 0&&(i=ee(a,s._$AS(a,i.values),s,t)),i}var De,ot,ke,lt,_t,B,gt,xi,Y,pe,he,Ue,$i,ze,de,ct,dt,G,pt,ht,mt,Oe,l,ie,ls,J,u,ut,K,ki,ue,Pe,_e,te,qe,Ne,Me,Fe,wi,vt,we=y(()=>{De=globalThis,ot=a=>a,ke=De.trustedTypes,lt=ke?ke.createPolicy("lit-html",{createHTML:a=>a}):void 0,_t="$lit$",B=`lit$${Math.random().toFixed(9).slice(2)}$`,gt="?"+B,xi=`<${gt}>`,Y=document,pe=()=>Y.createComment(""),he=a=>a===null||typeof a!="object"&&typeof a!="function",Ue=Array.isArray,$i=a=>Ue(a)||typeof a?.[Symbol.iterator]=="function",ze=`[ 	
\f\r]`,de=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ct=/-->/g,dt=/>/g,G=RegExp(`>|${ze}(?:([^\\s"'>=/]+)(${ze}*=${ze}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),pt=/'/g,ht=/"/g,mt=/^(?:script|style|textarea|title)$/i,Oe=a=>(i,...e)=>({_$litType$:a,strings:i,values:e}),l=Oe(1),ie=Oe(2),ls=Oe(3),J=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),ut=new WeakMap,K=Y.createTreeWalker(Y,129);ki=(a,i)=>{let e=a.length-1,t=[],s,n=i===2?"<svg>":i===3?"<math>":"",c=de;for(let d=0;d<e;d++){let p=a[d],g,b,m=-1,x=0;for(;x<p.length&&(c.lastIndex=x,b=c.exec(p),b!==null);)x=c.lastIndex,c===de?b[1]==="!--"?c=ct:b[1]!==void 0?c=dt:b[2]!==void 0?(mt.test(b[2])&&(s=RegExp("</"+b[2],"g")),c=G):b[3]!==void 0&&(c=G):c===G?b[0]===">"?(c=s??de,m=-1):b[1]===void 0?m=-2:(m=c.lastIndex-b[2].length,g=b[1],c=b[3]===void 0?G:b[3]==='"'?ht:pt):c===ht||c===pt?c=G:c===ct||c===dt?c=de:(c=G,s=void 0);let v=c===G&&a[d+1].startsWith("/>")?" ":"";n+=c===de?p+xi:m>=0?(t.push(g),p.slice(0,m)+_t+p.slice(m)+B+v):p+B+(m===-2?d:v)}return[ft(a,n+(a[e]||"<?>")+(i===2?"</svg>":i===3?"</math>":"")),t]},ue=class a{constructor({strings:i,_$litType$:e},t){let s;this.parts=[];let n=0,c=0,d=i.length-1,p=this.parts,[g,b]=ki(i,e);if(this.el=a.createElement(g,t),K.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(s=K.nextNode())!==null&&p.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let m of s.getAttributeNames())if(m.endsWith(_t)){let x=b[c++],v=s.getAttribute(m).split(B),k=/([.?@])?(.*)/.exec(x);p.push({type:1,index:n,name:k[2],strings:v,ctor:k[1]==="."?qe:k[1]==="?"?Ne:k[1]==="@"?Me:te}),s.removeAttribute(m)}else m.startsWith(B)&&(p.push({type:6,index:n}),s.removeAttribute(m));if(mt.test(s.tagName)){let m=s.textContent.split(B),x=m.length-1;if(x>0){s.textContent=ke?ke.emptyScript:"";for(let v=0;v<x;v++)s.append(m[v],pe()),K.nextNode(),p.push({type:2,index:++n});s.append(m[x],pe())}}}else if(s.nodeType===8)if(s.data===gt)p.push({type:2,index:n});else{let m=-1;for(;(m=s.data.indexOf(B,m+1))!==-1;)p.push({type:7,index:n}),m+=B.length-1}n++}}static createElement(i,e){let t=Y.createElement("template");return t.innerHTML=i,t}};Pe=class{constructor(i,e){this._$AV=[],this._$AN=void 0,this._$AD=i,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(i){let{el:{content:e},parts:t}=this._$AD,s=(i?.creationScope??Y).importNode(e,!0);K.currentNode=s;let n=K.nextNode(),c=0,d=0,p=t[0];for(;p!==void 0;){if(c===p.index){let g;p.type===2?g=new _e(n,n.nextSibling,this,i):p.type===1?g=new p.ctor(n,p.name,p.strings,this,i):p.type===6&&(g=new Fe(n,this,i)),this._$AV.push(g),p=t[++d]}c!==p?.index&&(n=K.nextNode(),c++)}return K.currentNode=Y,s}p(i){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(i,t,e),e+=t.strings.length-2):t._$AI(i[e])),e++}},_e=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(i,e,t,s){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=i,this._$AB=e,this._$AM=t,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let i=this._$AA.parentNode,e=this._$AM;return e!==void 0&&i?.nodeType===11&&(i=e.parentNode),i}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(i,e=this){i=ee(this,i,e),he(i)?i===u||i==null||i===""?(this._$AH!==u&&this._$AR(),this._$AH=u):i!==this._$AH&&i!==J&&this._(i):i._$litType$!==void 0?this.$(i):i.nodeType!==void 0?this.T(i):$i(i)?this.k(i):this._(i)}O(i){return this._$AA.parentNode.insertBefore(i,this._$AB)}T(i){this._$AH!==i&&(this._$AR(),this._$AH=this.O(i))}_(i){this._$AH!==u&&he(this._$AH)?this._$AA.nextSibling.data=i:this.T(Y.createTextNode(i)),this._$AH=i}$(i){let{values:e,_$litType$:t}=i,s=typeof t=="number"?this._$AC(i):(t.el===void 0&&(t.el=ue.createElement(ft(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new Pe(s,this),c=n.u(this.options);n.p(e),this.T(c),this._$AH=n}}_$AC(i){let e=ut.get(i.strings);return e===void 0&&ut.set(i.strings,e=new ue(i)),e}k(i){Ue(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,s=0;for(let n of i)s===e.length?e.push(t=new a(this.O(pe()),this.O(pe()),this,this.options)):t=e[s],t._$AI(n),s++;s<e.length&&(this._$AR(t&&t._$AB.nextSibling,s),e.length=s)}_$AR(i=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);i!==this._$AB;){let t=ot(i).nextSibling;ot(i).remove(),i=t}}setConnected(i){this._$AM===void 0&&(this._$Cv=i,this._$AP?.(i))}},te=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(i,e,t,s,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=i,this.name=e,this._$AM=s,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=u}_$AI(i,e=this,t,s){let n=this.strings,c=!1;if(n===void 0)i=ee(this,i,e,0),c=!he(i)||i!==this._$AH&&i!==J,c&&(this._$AH=i);else{let d=i,p,g;for(i=n[0],p=0;p<n.length-1;p++)g=ee(this,d[t+p],e,p),g===J&&(g=this._$AH[p]),c||=!he(g)||g!==this._$AH[p],g===u?i=u:i!==u&&(i+=(g??"")+n[p+1]),this._$AH[p]=g}c&&!s&&this.j(i)}j(i){i===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,i??"")}},qe=class extends te{constructor(){super(...arguments),this.type=3}j(i){this.element[this.name]=i===u?void 0:i}},Ne=class extends te{constructor(){super(...arguments),this.type=4}j(i){this.element.toggleAttribute(this.name,!!i&&i!==u)}},Me=class extends te{constructor(i,e,t,s,n){super(i,e,t,s,n),this.type=5}_$AI(i,e=this){if((i=ee(this,i,e,0)??u)===J)return;let t=this._$AH,s=i===u&&t!==u||i.capture!==t.capture||i.once!==t.once||i.passive!==t.passive,n=i!==u&&(t===u||s);s&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,i),this._$AH=i}handleEvent(i){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,i):this._$AH.handleEvent(i)}},Fe=class{constructor(i,e,t){this.element=i,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(i){ee(this,i)}},wi=De.litHtmlPolyfillSupport;wi?.(ue,_e),(De.litHtmlVersions??=[]).push("3.3.2");vt=(a,i,e)=>{let t=e?.renderBefore??i,s=t._$litPart$;if(s===void 0){let n=e?.renderBefore??null;t._$litPart$=s=new _e(i.insertBefore(pe(),n),n,void 0,e??{})}return s._$AI(a),s}});var We,$,Ei,bt=y(()=>{ce();ce();we();we();We=globalThis,$=class extends M{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let i=super.createRenderRoot();return this.renderOptions.renderBefore??=i.firstChild,i}update(i){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=vt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return J}};$._$litElement$=!0,$.finalized=!0,We.litElementHydrateSupport?.({LitElement:$});Ei=We.litElementPolyfillSupport;Ei?.({LitElement:$});(We.litElementVersions??=[]).push("4.2.2")});var yt=y(()=>{});var T=y(()=>{ce();we();bt();yt()});var xt=y(()=>{});function f(a){return(i,e)=>typeof e=="object"?Si(a,i,e):((t,s,n)=>{let c=s.hasOwnProperty(n);return s.constructor.createProperty(n,t),c?Object.getOwnPropertyDescriptor(s,n):void 0})(a,i,e)}var Ai,Si,Ve=y(()=>{ce();Ai={attribute:!0,type:String,converter:le,reflect:!1,hasChanged:$e},Si=(a=Ai,i,e)=>{let{kind:t,metadata:s}=e,n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),t==="setter"&&((a=Object.create(a)).wrapped=!0),n.set(e.name,a),t==="accessor"){let{name:c}=e;return{set(d){let p=i.get.call(this);i.set.call(this,d),this.requestUpdate(c,p,a,!0,d)},init(d){return d!==void 0&&this.C(c,void 0,a,d),d}}}if(t==="setter"){let{name:c}=e;return function(d){let p=this[c];i.call(this,d),this.requestUpdate(c,p,a,!0,d)}}throw Error("Unsupported decorator location: "+t)}});function h(a){return f({...a,state:!0,attribute:!1})}var $t=y(()=>{Ve();});var kt=y(()=>{});var se=y(()=>{});var wt=y(()=>{se();});var Et=y(()=>{se();});var At=y(()=>{se();});var St=y(()=>{se();});var Tt=y(()=>{se();});var R=y(()=>{xt();Ve();$t();kt();wt();Et();At();St();Tt()});var Ct,It=y(()=>{Ct={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",ok:"OK",all:"All",new_object:"+ New Object",edit:"Edit",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",reset:"Reset",cancel:"Cancel",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",runtime_hours:"Target runtime (hours)",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",custom:"Custom",history:"History",cost:"Cost",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_optional:"Due at time (optional, HH:MM)",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",tasks_lower:"tasks",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",safety_interval:"Safety interval (optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_window_7:"7 days",cal_window_14:"14 days",cal_window_30:"30 days",cal_window_365:"1 year",cal_every_n_days:"every {n} days",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",no_advanced_features_hint:"Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",completions:"completions",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_predictions:"Sensor Predictions",feat_predictions_desc:"Predict trigger dates from sensor degradation",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_snooze_hours:"Snooze duration (hours)",settings_budget:"Budget",settings_currency:"Currency",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_import_csv:"Import CSV",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",filter_label:"Filter",user_label:"User",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",group_delete_confirm:'Delete group "{name}"?',groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else sees only Complete and Skip.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc:"Per-task HA action on complete + quick-complete QR with pre-set values.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_service:"Service",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",quick_complete_defaults_title:"Quick-complete defaults (for QR scans, optional)",quick_complete_defaults_desc:"Pre-set values for quick-complete QR scans. Without these, the QR opens the complete dialog.",quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026",archive:"Archive",unarchive:"Unarchive",archived:"Archived",show_archived:"Show archived",hide_archived:"Hide archived",confirm_archive_object:"Archive this object and its tasks? They keep their history and can be unarchived later.",settings_archive:"Archive & Retention",settings_archive_desc:"Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",settings_archive_oneoff_days:"Auto-archive completed one-off tasks after (days, 0 = off)",settings_delete_archived_oneoff_days:"Auto-delete archived one-off tasks after (days, 0 = never)",archive_object:"Archive object",unarchive_object:"Unarchive object",documents:"Documents",documents_empty:"No documents yet.",doc_upload:"Upload file",doc_uploading:"Uploading\u2026",doc_add_link:"Add link",doc_link_url:"URL (https://\u2026)",doc_link_title:"Title (optional)",doc_open:"Open",doc_delete_confirm:'Delete "{name}"?',doc_too_large:"File is too large (max 25 MB).",doc_upload_failed:"Upload failed.",doc_deduped:"Already stored elsewhere \u2014 shared, no extra space used.",doc_dup_in_object:"This file is already attached to this object.",doc_link_invalid:"Only http/https links are allowed.",doc_cat_manual:"Manual",doc_cat_warranty:"Warranty",doc_cat_invoice:"Invoice",doc_cat_spare_parts:"Spare parts",doc_cat_photo:"Photo",doc_cat_other:"Other",doc_link_badge:"Link",doc_storage_title:"Document storage",doc_storage_saved:"Saved via deduplication",doc_storage_refresh:"Refresh"}});function Ke(a){return(a||Ge).substring(0,2).toLowerCase()}function r(a,i){let e=Ke(i);return ge[e]?.[a]??ge.en[a]??a}function Ht(a){let i=Ke(a);return i===Ge||i in ge}function jt(a){let i=Ke(a);return i===Ge||i in ge||!Ii.has(i)?Promise.resolve():(i in Be||(Be[i]=fetch(`${Ci}/${i}.json`).then(e=>e.ok?e.json():null).then(e=>{e&&(ge[i]=e)}).catch(()=>{})),Be[i])}function Rt(a){let i=(a||"en").substring(0,2).toLowerCase();return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN",da:"da-DK",fi:"fi-FI",nb:"nb-NO",ja:"ja-JP",hi:"hi-IN"}[i]??"en-US"}function Z(a,i){if(!a)return"\u2014";try{let e=a.includes("T")?a:a+"T00:00:00";return new Date(e).toLocaleDateString(Rt(i),{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return a}}function zt(a,i){if(!a)return"\u2014";try{let e=Rt(i),t=new Date(a);return t.toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}catch{return a}}function Lt(a,i,e){return a==null?"\u2014":`${a} ${r("unit_"+(i||"days"),e)}`}function Ae(a,i,e="long"){let t=(i||"en").substring(0,2);return new Date(Date.UTC(2024,0,1+a)).toLocaleDateString(t,{weekday:e,timeZone:"UTC"})}function Pt(a,i){let e=a.schedule;switch(e?.kind){case"weekdays":return(e.weekdays||[]).map(t=>Ae(t,i,"short")).join(" & ")||"\u2014";case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?r("ord_last",i):r("ord_"+e.nth,i)} ${Ae(e.weekday,i,"long")}`;case"day_of_month":return e.day!=null?`${r("day_word",i)} ${e.day}`:"\u2014";case"one_time":return a.due_date?Z(a.due_date,i):r("one_time",i);case"manual":return r("manual",i);case"interval":return Lt(e.every,e.unit,i)}return a.schedule_type==="one_time"?a.due_date?Z(a.due_date,i):r("one_time",i):a.schedule_type==="manual"?r("manual",i):a.interval_days!=null?Lt(a.interval_days,a.interval_unit,i):"\u2014"}function qt(a,i){a.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:i},bubbles:!0,composed:!0}))}var re,Ge,ge,Ii,Ci,Be,Se,C=y(()=>{"use strict";T();It();re={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"#ff5722",archived:"var(--disabled-color, #9e9e9e)"},Ge="en",ge={en:Ct},Ii=new Set(["de","nl","fr","it","es","pt","ru","uk","pl","cs","sv","zh","da","fi","nb","ja","hi"]),Ci="/maintenance_supporter_locales",Be={};Se=w`
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
  /* Completed one-time task ("done") — muted blue-grey. */
  .status-badge.done { background-color: var(--maint-done-color, #78909c); }
  /* v2.10.0: archived (retire-but-retain) — neutral grey, clearly inert. */
  .status-badge.archived { background-color: var(--disabled-color, #9e9e9e); }

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
`});function ji(a,i){let e=Hi[a];if(!e)return a;let t=r(e,i);return t&&t!==e?t:a}function Ri(a){let e=a.match(/data\['([^']+)'\]/)?.[1],t;return(t=a.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=a.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=a.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=a.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(a)?{field:e,rule:"required"}:(t=a.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(a)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(a)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function I(a,i,e){if(typeof a=="string")return a;if(typeof a!="object"||a===null)return e;let t=a,s=t.message||t.error?.message||"";if(!s)return e;let n=Ri(s),c=n.field?ji(n.field,i):"",d=p=>r(p,i).replace("{field}",c).replace("{n}",n.param??"");switch(n.rule){case"too_long":return d("err_too_long");case"too_short":return d("err_too_short");case"value_too_high":return d("err_value_too_high");case"value_too_low":return d("err_value_too_low");case"required":return d("err_required");case"wrong_type":return d("err_wrong_type").replace("{type}",n.param??"");case"invalid_choice":return d("err_invalid_choice");case"invalid_value":return d("err_invalid_value");default:return s||e}}var Hi,Q=y(()=>{"use strict";C();Hi={name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",group_name:"name",group_description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_for_minutes:"trigger_for_minutes"}});var A,Ye=y(()=>{"use strict";T();R();C();Q();A=class extends ${constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed"}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState={},this._feedback="needed")}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),await this.hass.connection.sendMessagePromise(e),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=I(e,this.lang,r("save_error",this.lang))}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return l``;let e=this.lang||this.hass?.language||"en";return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${r("complete_title",e)}${this.taskName}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:u}
          ${this.checklist.length>0?l`
            <div class="checklist-section">
              <label class="checklist-label">${r("checklist",e)}</label>
              ${this.checklist.map((t,s)=>l`
                <label class="checklist-item" @click=${()=>this._toggleCheck(s)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(s)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:u}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${r("notes_optional",e)}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${r("cost_optional",e)}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${t=>this._cost=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${r("duration_minutes",e)}</span>
            <input type="number" step="1" min="0" class="field-input"
              .value=${this._duration}
              @input=${t=>this._duration=t.target.value} />
          </label>
          ${this.adaptiveEnabled?l`
            <div class="feedback-section">
              <label class="feedback-label">${r("was_maintenance_needed",e)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${r("feedback_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${r("feedback_not_needed",e)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${r("feedback_not_sure",e)}</button>
              </div>
            </div>
          `:u}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${r("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading}
          >
            ${this._loading?r("completing",e):r("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};A.styles=w`
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
  `,o([f({attribute:!1})],A.prototype,"hass",2),o([f()],A.prototype,"entryId",2),o([f()],A.prototype,"taskId",2),o([f()],A.prototype,"taskName",2),o([f()],A.prototype,"lang",2),o([f({type:Array})],A.prototype,"checklist",2),o([f({type:Boolean})],A.prototype,"adaptiveEnabled",2),o([h()],A.prototype,"_open",2),o([h()],A.prototype,"_notes",2),o([h()],A.prototype,"_cost",2),o([h()],A.prototype,"_duration",2),o([h()],A.prototype,"_loading",2),o([h()],A.prototype,"_error",2),o([h()],A.prototype,"_checklistState",2),o([h()],A.prototype,"_feedback",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",A)});var L,Je=y(()=>{"use strict";T();R();L=class extends ${constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){return l`
      <label class="field">
        ${this.label?l`<span class="label">${this.label}${this.required?l`<span class="req">*</span>`:u}</span>`:u}
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
        />
        ${this.helper?l`<span class="helper">${this.helper}</span>`:u}
      </label>
    `}};L.styles=w`
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
  `,o([f()],L.prototype,"label",2),o([f()],L.prototype,"value",2),o([f()],L.prototype,"placeholder",2),o([f()],L.prototype,"type",2),o([f({type:Boolean})],L.prototype,"required",2),o([f({type:Boolean})],L.prototype,"disabled",2),o([f()],L.prototype,"step",2),o([f()],L.prototype,"min",2),o([f()],L.prototype,"max",2),o([f()],L.prototype,"pattern",2),o([f()],L.prototype,"helper",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",L)});var S,Nt=y(()=>{"use strict";T();R();C();Q();Je();S=class extends ${constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._entryId=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._error="",this._open=!0}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(e){this._error=I(e,this._lang,r("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}render(){if(!this._open)return l``;let e=this._lang,t=this._entryId?r("edit_object",e):r("new_object",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:u}
          <ms-textfield
            label="${r("name",e)}"
            required
            .value=${this._name}
            @input=${s=>this._name=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${r("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${s=>this._manufacturer=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${r("model_optional",e)}"
            .value=${this._model}
            @input=${s=>this._model=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${r("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${s=>this._serialNumber=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${r("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${s=>this._documentationUrl=s.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${r("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${s=>this._areaId=s.detail.value||""}
          ></ha-area-picker>
          <ms-textfield
            label="${r("installation_date_optional",e)}"
            type="date"
            .value=${this._installationDate}
            @input=${s=>this._installationDate=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${r("warranty_expiry_optional",e)}"
            type="date"
            .value=${this._warrantyExpiry}
            @input=${s=>this._warrantyExpiry=s.target.value}
          ></ms-textfield>
          <label class="textarea-field">
            <span class="textarea-label">${r("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${s=>this._notes=s.target.value}
            ></textarea>
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${r("cancel",this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?r("saving",this._lang):r("save",this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};S.styles=w`
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
  `,o([f({attribute:!1})],S.prototype,"hass",2),o([h()],S.prototype,"_open",2),o([h()],S.prototype,"_loading",2),o([h()],S.prototype,"_error",2),o([h()],S.prototype,"_name",2),o([h()],S.prototype,"_manufacturer",2),o([h()],S.prototype,"_model",2),o([h()],S.prototype,"_serialNumber",2),o([h()],S.prototype,"_areaId",2),o([h()],S.prototype,"_installationDate",2),o([h()],S.prototype,"_warrantyExpiry",2),o([h()],S.prototype,"_documentationUrl",2),o([h()],S.prototype,"_notes",2),o([h()],S.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",S)});var Te,Mt=y(()=>{"use strict";Te=class{constructor(i){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=i}updateHass(i){this.hass=i}async getUsers(i=!1){let e=Date.now();if(!i&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(i,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:i,task_id:e,user_id:t})}async getTasksByUser(i){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:i})).tasks}getUserName(i){return!i||!this.usersCache?null:this.usersCache.find(t=>t.id===i)?.name||null}getUser(i){return!i||!this.usersCache?null:this.usersCache.find(e=>e.id===i)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(i){return i?i===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}}});function Mi(a){return Array.from({length:7},(i,e)=>Ae(e,a,"short"))}var zi,Pi,qi,Ni,_,Ft=y(()=>{"use strict";T();R();C();Mt();Q();Je();zi=["cleaning","inspection","replacement","calibration","service","custom"],Pi=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],qi=["weekdays","nth_weekday","day_of_month"],Ni=["threshold","counter","state_change","runtime"];_=class extends ${constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._notes="";this._documentationUrl="";this._customIcon="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._availableTags=[];this._responsibleUserId=null;this._availableUsers=[];this._checklistText="";this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._userService=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}async openCreate(e,t){this._entryId=e,this._taskId=null,this._error="",!e&&t&&t.length>0?(this._objectChoices=t.map(s=>({entry_id:s.entry_id,name:s.object.name})).sort((s,n)=>s.name.localeCompare(n.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}async openEdit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let s=t.schedule;this._weekdays=s?.kind==="weekdays"?[...s.weekdays??[]]:[],this._nth=s?.kind==="nth_weekday"?String(s.nth??1):"1",this._nthWeekday=s?.kind==="nth_weekday"?String(s.weekday??5):"5",this._domDay=s?.kind==="day_of_month"?String(s.day??1):"1",this._warningDays=t.warning_days.toString(),this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._nfcTagId=t.nfc_tag_id||"",this._responsibleUserId=t.responsible_user_id||null,this._checklistText=(t.checklist||[]).join(`
`),this._scheduleTime=t.schedule_time||"";let n=t.on_complete_action;if(n&&n.service){this._actionService=n.service;let p=n.target?.entity_id;this._actionTargetEntity=Array.isArray(p)?p[0]||"":p||"",this._actionData=n.data&&typeof n.data=="object"?{...n.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let c=t.quick_complete_defaults;this._qcNotes=c?.notes||"",this._qcCost=c?.cost!=null?String(c.cost):"",this._qcDuration=c?.duration!=null?String(c.duration):"",this._qcFeedback=c?.feedback||"";let d=t.adaptive_config||{};if(this._environmentalEntity=d.environmental_entity||"",this._environmentalAttribute=d.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,t.trigger_config){let p=t.trigger_config;this._triggerEntityId=p.entity_id||"",this._triggerEntityIds=p.entity_ids||(p.entity_id?[p.entity_id]:[]),this._triggerEntityLogic=p.entity_logic||"any",this._triggerAttribute=p.attribute||"",this._triggerType=p.type||"threshold",this._triggerAbove=p.trigger_above?.toString()||"",this._triggerBelow=p.trigger_below?.toString()||"",this._triggerForMinutes=p.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=p.trigger_target_value?.toString()||"",this._triggerDeltaMode=p.trigger_delta_mode||!1,this._triggerFromState=p.trigger_from_state||"",this._triggerToState=p.trigger_to_state||"",this._triggerTargetChanges=p.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=p.trigger_runtime_hours?.toString()||""}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._notes="",this._documentationUrl="",this._customIcon="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._responsibleUserId=null,this._checklistText="",this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours=""}async _loadUsers(){this._userService||(this._userService=new Te(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,s]=e.split(".");if(!this.hass?.services?.[t]?.[s]){this._actionTestResult="error",this._actionTestError=`Service "${e}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let n=this._actionTargetEntity.trim();if(n){let c=n.split(".")[0];if(c!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=`Service "${e}" only works on ${t}.* entities; entity "${n}" is in ${c}.* \u2014 pick a service that matches the entity domain (e.g. ${c}.${s})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[n]){this._actionTestResult="error",this._actionTestError=`Target entity "${n}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,s]=e.split("."),n=this.hass?.services?.[t]?.[s]?.fields;return!n||Object.keys(n).length===0?null:Object.entries(n).map(([c,d])=>({name:c,required:!!d.required,selector:d.selector||{text:{}}}))}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled)return u;let t=this._serviceSchema();return l`
      <details class="ca-section">
        <summary>${r("on_complete_action_title",e)}</summary>
        <p class="field-help">${r("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${s=>{this._actionService=s.detail.value||"";let n=this._serviceSchema();if(n){let c=new Set(n.map(d=>d.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([d])=>c.has(d)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>r("on_complete_action_target",e)}
          @value-changed=${s=>{let n=s.detail.value;this._actionTargetEntity=n.target_entity||""}}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${r("on_complete_action_target_hint",e)}
        </p>
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
                label="${r("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${s=>{this._actionDataJsonFallback=s.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":r("on_complete_action_test",e)}
          </button>
          ${this._actionTestResult==="ok"?l`<span class="ca-test-ok">${r("on_complete_action_test_success",e)}</span>`:u}
          ${this._actionTestResult==="error"?l`<div class="ca-test-error-block">
                <span class="ca-test-error">${r("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?l`<div class="ca-test-error-detail">${this._actionTestError}</div>`:u}
              </div>`:u}
        </div>
      </details>

      <details class="ca-section">
        <summary>${r("quick_complete_defaults_title",e)}</summary>
        <p class="field-help">${r("quick_complete_defaults_desc",e)}</p>
        <ms-textfield
          label="${r("quick_complete_defaults_notes",e)}"
          .value=${this._qcNotes}
          @input=${s=>{this._qcNotes=s.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${r("quick_complete_defaults_cost",e)}"
          type="number" min="0" step="0.01"
          .value=${this._qcCost}
          @input=${s=>{this._qcCost=s.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${r("quick_complete_defaults_duration",e)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${s=>{this._qcDuration=s.target.value}}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${s=>{this._qcFeedback=s.target.value}}>
          <option value="">${r("quick_complete_defaults_feedback_none",e)}</option>
          <option value="needed">${r("quick_complete_defaults_feedback_needed",e)}</option>
          <option value="not_needed">${r("quick_complete_defaults_feedback_not_needed",e)}</option>
        </select>
      </details>
    `}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=t.domain||"",this._suggestedAttributes=t.suggested_attributes||[],this._availableAttributes=t.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:parseInt(this._warningDays,10)||7};if(this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):qi.includes(this._scheduleType)?(e.schedule=this._buildSchedule(),e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.enabled=this._enabled,e.last_performed=this._lastPerformed||null,e.nfc_tag_id=this._nfcTagId||null,e.responsible_user_id=this._responsibleUserId,this._scheduleType==="sensor_based"&&this._triggerEntityId){let c=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],d={entity_id:c[0],entity_ids:c,type:this._triggerType};if(this._triggerAttribute&&(d.attribute=this._triggerAttribute),c.length>1&&(d.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let p=parseFloat(this._triggerAbove);isNaN(p)||(d.trigger_above=p)}if(this._triggerBelow){let p=parseFloat(this._triggerBelow);isNaN(p)||(d.trigger_below=p)}if(this._triggerForMinutes){let p=parseInt(this._triggerForMinutes,10);isNaN(p)||(d.trigger_for_minutes=p)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let p=parseFloat(this._triggerTargetValue);isNaN(p)||(d.trigger_target_value=p)}d.trigger_delta_mode=this._triggerDeltaMode}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(d.trigger_from_state=this._triggerFromState),this._triggerToState&&(d.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let p=parseInt(this._triggerTargetChanges,10);isNaN(p)||(d.trigger_target_changes=p)}}else if(this._triggerType==="runtime"&&this._triggerRuntimeHours){let p=parseFloat(this._triggerRuntimeHours);isNaN(p)||(d.trigger_runtime_hours=p)}e.trigger_config=d}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let c=this._scheduleTime.trim();e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(c)?c:null}if(this.checklistsEnabled){let c=this._checklistText.split(`
`).map(d=>d.trim()).filter(Boolean).slice(0,100);e.checklist=c.length?c:null}if(this.completionActionsEnabled){let c=this._actionService.trim();if(c&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(c)){let b={service:c},m=this._actionTargetEntity.trim();m&&(b.target={entity_id:m});let x=this._buildActionData();Object.keys(x).length>0&&(b.data=x),e.on_complete_action=b}else e.on_complete_action=null;let d={};this._qcNotes.trim()&&(d.notes=this._qcNotes.trim());let p=parseFloat(this._qcCost);!isNaN(p)&&p>=0&&(d.cost=p);let g=parseInt(this._qcDuration,10);!isNaN(g)&&g>=0&&(d.duration=g),this._qcFeedback&&(d.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(d).length?d:null}let t=await this.hass.connection.sendMessagePromise(e),s=this._taskId||t?.task_id,n=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(s&&this._scheduleType==="sensor_based"&&n)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:s,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(e){this._error=I(e,this._lang,r("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return u;let e=this._lang;return l`
      <h3>${r("trigger_configuration",e)}</h3>
      <ms-textfield
        label="${r("entity_id",e)} (${r("comma_separated",e)})"
        .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
        @input=${t=>{let n=t.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=n[0]||"",this._triggerEntityIds=n,n[0]&&this._fetchEntityAttributes(n[0])}}
      ></ms-textfield>
      ${this._triggerEntityIds.length>1?l`
        <div class="select-row">
          <label>${r("entity_logic",e)}</label>
          <select
            .value=${this._triggerEntityLogic}
            @change=${t=>this._triggerEntityLogic=t.target.value}
          >
            <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${r("entity_logic_any",e)}</option>
            <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${r("entity_logic_all",e)}</option>
          </select>
        </div>
      `:u}
      ${this._availableAttributes.length>0?l`
          <div class="select-row">
            <label>${r("attribute_optional",e)}</label>
            <select
              .value=${this._triggerAttribute}
              @change=${t=>this._triggerAttribute=t.target.value}
            >
              <option value="" ?selected=${!this._triggerAttribute}>${r("use_entity_state",e)}</option>
              ${this._suggestedAttributes.map(t=>l`<option value=${t} ?selected=${t===this._triggerAttribute}>${t} ★</option>`)}
              ${this._availableAttributes.filter(t=>!this._suggestedAttributes.includes(t.name)).map(t=>l`<option value=${t.name} ?selected=${t.name===this._triggerAttribute}>${t.name}${t.numeric?"":" (non-numeric)"}</option>`)}
            </select>
          </div>
        `:l`
          <ms-textfield
            label="${r("attribute_optional",e)}"
            .value=${this._triggerAttribute}
            @input=${t=>this._triggerAttribute=t.target.value}
          ></ms-textfield>
        `}
      <div class="select-row">
        <label>${r("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${t=>this._triggerType=t.target.value}
        >
          ${Ni.map(t=>l`<option value=${t} ?selected=${t===this._triggerType}>${r(t,e)}</option>`)}
        </select>
      </div>
      ${this._renderTriggerTypeFields()}
      <ms-textfield
        label="${r("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${t=>this._intervalDays=t.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():u}
    `}_renderUnitSelect(){let e=this._lang;return l`
      <div class="select-row">
        <label>${r("interval_unit",e)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${t=>this._intervalUnit=t.target.value}
        >
          ${["days","weeks","months","years"].map(t=>l`<option value=${t} ?selected=${t===this._intervalUnit}>${r("unit_"+t,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_buildSchedule(){return this._scheduleType==="weekdays"?{kind:"weekdays",weekdays:[...this._weekdays].sort((e,t)=>e-t)}:this._scheduleType==="nth_weekday"?{kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)}:{kind:"day_of_month",day:parseInt(this._domDay,10)||1}}_renderCalendarFields(){let e=this._lang,t=Mi(e);if(this._scheduleType==="weekdays")return l`
        <label class="field-label">${r("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((s,n)=>l`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(n)?"selected":""}"
              @click=${()=>this._toggleWeekday(n)}
            >${s}</button>`)}
        </div>`;if(this._scheduleType==="nth_weekday"){let s=[["1",r("ord_1",e)],["2",r("ord_2",e)],["3",r("ord_3",e)],["4",r("ord_4",e)],["5",r("ord_5",e)],["-1",r("ord_last",e)]];return l`
        <div class="select-row">
          <label>${r("recurrence_occurrence",e)}</label>
          <select .value=${this._nth} @change=${n=>this._nth=n.target.value}>
            ${s.map(([n,c])=>l`<option value=${n} ?selected=${n===this._nth}>${c}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${r("recurrence_weekday",e)}</label>
          <select .value=${this._nthWeekday} @change=${n=>this._nthWeekday=n.target.value}>
            ${t.map((n,c)=>l`<option value=${String(c)} ?selected=${String(c)===this._nthWeekday}>${n}</option>`)}
          </select>
        </div>`}return this._scheduleType==="day_of_month"?l`
        <ms-textfield
          label="${r("recurrence_day",e)}"
          type="number"
          min="1"
          max="31"
          .value=${this._domDay}
          @input=${s=>this._domDay=s.target.value}
        ></ms-textfield>`:u}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?l`
        <ms-textfield
          label="${r("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${t=>this._triggerAbove=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${r("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${t=>this._triggerBelow=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${r("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?l`
        <ms-textfield
          label="${r("target_value",e)}"
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
          ${r("delta_mode",e)}
        </label>
      `:this._triggerType==="state_change"?l`
        <ms-textfield
          label="${r("from_state_optional",e)}"
          .value=${this._triggerFromState}
          @input=${t=>this._triggerFromState=t.target.value}
        ></ms-textfield>
        <div class="field-help">${r("state_value_help",e)}</div>
        <ms-textfield
          label="${r("to_state_optional",e)}"
          .value=${this._triggerToState}
          @input=${t=>this._triggerToState=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${r("target_changes",e)}"
          type="number"
          min="1"
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${r("target_changes_help",e)}</div>
      `:this._triggerType==="runtime"?l`
        <ms-textfield
          label="${r("runtime_hours",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${t=>this._triggerRuntimeHours=t.target.value}
        ></ms-textfield>
      `:u}render(){if(!this._open)return l``;let e=this._lang,t=this._taskId?r("edit_task",e):r("new_task",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:u}
          ${this._objectChoices.length>0?l`
            <div class="select-row">
              <label>${r("object",e)}</label>
              <select
                .value=${this._entryId}
                @change=${s=>this._entryId=s.target.value}
              >
                ${this._objectChoices.map(s=>l`<option value=${s.entry_id} ?selected=${s.entry_id===this._entryId}>${s.name}</option>`)}
              </select>
            </div>
          `:u}
          <ms-textfield
            label="${r("task_name",e)}"
            required
            .value=${this._name}
            @input=${s=>this._name=s.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${r("maintenance_type",e)}</label>
            <select
              .value=${this._type}
              @change=${s=>this._type=s.target.value}
            >
              ${zi.map(s=>l`<option value=${s} ?selected=${s===this._type}>${r(s,e)}</option>`)}
            </select>
          </div>
          <div class="select-row">
            <label>${r("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${s=>this._scheduleType=s.target.value}
            >
              ${Pi.map(s=>l`<option value=${s} ?selected=${s===this._scheduleType}>${r(s,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?l`
                <ms-textfield
                  label="${r("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${s=>this._intervalDays=s.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${r("interval_anchor",e)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${s=>this._intervalAnchor=s.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${r("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${r("anchor_planned",e)}</option>
                  </select>
                </div>
                ${this.scheduleTimeEnabled?l`
                  <ms-textfield
                    label="${r("schedule_time_optional",e)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${r("schedule_time_help",e)}"
                    @input=${s=>this._scheduleTime=s.target.value}
                  ></ms-textfield>
                `:u}
              `:u}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?l`
                <ms-textfield
                  label="${r("due_date",e)}"
                  type="date"
                  .value=${this._dueDate}
                  @input=${s=>this._dueDate=s.target.value}
                ></ms-textfield>
              `:u}
          <ms-textfield
            label="${r("warning_days",e)}"
            type="number"
            .value=${this._warningDays}
            @input=${s=>this._warningDays=s.target.value}
          ></ms-textfield>
          ${this.checklistsEnabled?l`
            <h3>${r("checklist_steps_optional",e)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${r("checklist_placeholder",e)}"
              .value=${this._checklistText}
              @input=${s=>this._checklistText=s.target.value}
            ></textarea>
            <div class="field-help">${r("checklist_help",e)}</div>
          `:u}
          <ms-textfield
            label="${r("last_performed_optional",e)}"
            type="date"
            .value=${this._lastPerformed}
            @input=${s=>this._lastPerformed=s.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${r("responsible_user",e)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${s=>{let n=s.target.value;this._responsibleUserId=n||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${r("no_user_assigned",e)}</option>
              ${this._availableUsers.map(s=>l`<option value=${s.id} ?selected=${s.id===this._responsibleUserId}>${s.name}</option>`)}
            </select>
          </div>
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?l`
            <ms-textfield
              label="${r("environmental_entity_optional",e)}"
              helper="${r("environmental_entity_helper",e)}"
              .value=${this._environmentalEntity}
              @input=${s=>this._environmentalEntity=s.target.value.trim()}
            ></ms-textfield>
            ${this._environmentalEntity?l`
              <ms-textfield
                label="${r("environmental_attribute_optional",e)}"
                .value=${this._environmentalAttribute}
                @input=${s=>this._environmentalAttribute=s.target.value.trim()}
              ></ms-textfield>
            `:u}
          `:u}
          <ms-textfield
            label="${r("notes_optional",e)}"
            .value=${this._notes}
            @input=${s=>this._notes=s.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${r("documentation_url_optional",e)}"
            .value=${this._documentationUrl}
            @input=${s=>this._documentationUrl=s.target.value}
          ></ms-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${r("custom_icon_optional",e)}"
            .value=${this._customIcon}
            @value-changed=${s=>this._customIcon=s.detail.value||""}
          ></ha-icon-picker>
          ${this._availableTags.length>0?l`
              <div class="select-row">
                <label>${r("nfc_tag_id_optional",e)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${s=>this._nfcTagId=s.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${r("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(s=>l`<option value=${s.id} ?selected=${s.id===this._nfcTagId}>${s.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${r("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:l`
              <ms-textfield
                label="${r("nfc_tag_id_optional",e)}"
                .value=${this._nfcTagId}
                @input=${s=>this._nfcTagId=s.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${r("nfc_tags_empty_help",e)}
                <a href="/config/tags">${r("nfc_tags_open_settings",e)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${r("nfc_tags_refresh",e)}
                </button>
              </div>
            `}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${s=>this._enabled=s.target.checked}
            />
            ${r("task_enabled",e)}
          </label>
          ${this._renderCompletionActionsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${r("cancel",e)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?r("saving",e):r("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};_.styles=w`
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
  `,o([f({attribute:!1})],_.prototype,"hass",2),o([f({type:Boolean,attribute:"checklists-enabled"})],_.prototype,"checklistsEnabled",2),o([f({type:Boolean,attribute:"schedule-time-enabled"})],_.prototype,"scheduleTimeEnabled",2),o([f({type:Boolean,attribute:"completion-actions-enabled"})],_.prototype,"completionActionsEnabled",2),o([f({type:Number,attribute:"default-warning-days"})],_.prototype,"defaultWarningDays",2),o([h()],_.prototype,"_open",2),o([h()],_.prototype,"_loading",2),o([h()],_.prototype,"_error",2),o([h()],_.prototype,"_entryId",2),o([h()],_.prototype,"_taskId",2),o([h()],_.prototype,"_objectChoices",2),o([h()],_.prototype,"_name",2),o([h()],_.prototype,"_type",2),o([h()],_.prototype,"_scheduleType",2),o([h()],_.prototype,"_intervalDays",2),o([h()],_.prototype,"_intervalUnit",2),o([h()],_.prototype,"_dueDate",2),o([h()],_.prototype,"_warningDays",2),o([h()],_.prototype,"_intervalAnchor",2),o([h()],_.prototype,"_weekdays",2),o([h()],_.prototype,"_nth",2),o([h()],_.prototype,"_nthWeekday",2),o([h()],_.prototype,"_domDay",2),o([h()],_.prototype,"_notes",2),o([h()],_.prototype,"_documentationUrl",2),o([h()],_.prototype,"_customIcon",2),o([h()],_.prototype,"_enabled",2),o([h()],_.prototype,"_triggerEntityId",2),o([h()],_.prototype,"_triggerEntityIds",2),o([h()],_.prototype,"_triggerEntityLogic",2),o([h()],_.prototype,"_triggerAttribute",2),o([h()],_.prototype,"_triggerType",2),o([h()],_.prototype,"_triggerAbove",2),o([h()],_.prototype,"_triggerBelow",2),o([h()],_.prototype,"_triggerForMinutes",2),o([h()],_.prototype,"_triggerTargetValue",2),o([h()],_.prototype,"_triggerDeltaMode",2),o([h()],_.prototype,"_triggerFromState",2),o([h()],_.prototype,"_triggerToState",2),o([h()],_.prototype,"_triggerTargetChanges",2),o([h()],_.prototype,"_triggerRuntimeHours",2),o([h()],_.prototype,"_suggestedAttributes",2),o([h()],_.prototype,"_availableAttributes",2),o([h()],_.prototype,"_entityDomain",2),o([h()],_.prototype,"_lastPerformed",2),o([h()],_.prototype,"_nfcTagId",2),o([h()],_.prototype,"_availableTags",2),o([h()],_.prototype,"_responsibleUserId",2),o([h()],_.prototype,"_availableUsers",2),o([h()],_.prototype,"_checklistText",2),o([h()],_.prototype,"_scheduleTime",2),o([h()],_.prototype,"_actionService",2),o([h()],_.prototype,"_actionTargetEntity",2),o([h()],_.prototype,"_actionData",2),o([h()],_.prototype,"_actionDataJsonFallback",2),o([h()],_.prototype,"_actionTesting",2),o([h()],_.prototype,"_actionTestResult",2),o([h()],_.prototype,"_actionTestError",2),o([h()],_.prototype,"_qcNotes",2),o([h()],_.prototype,"_qcCost",2),o([h()],_.prototype,"_qcDuration",2),o([h()],_.prototype,"_qcFeedback",2),o([h()],_.prototype,"_environmentalEntity",2),o([h()],_.prototype,"_environmentalAttribute",2);customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",_)});var D,Dt=y(()=>{"use strict";T();R();C();Q();D=class extends ${constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null}get _lang(){return this.hass?.language||"en"}openEdit(e){this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let e={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(e.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(e.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(e.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(e.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(e.completed_by=this._draft.completed_by),Object.keys(e).filter(s=>!["type","entry_id","task_id","original_timestamp"].includes(s)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(e),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=I(e,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return u;let e=this._lang,t=this._draft;return l`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${r("history_edit_title",e)||"Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${r(t.type,e)||t.type}</span>
        </div>
        <label>
          <span>${r("history_edit_timestamp",e)||"Timestamp"}</span>
          <input type="datetime-local"
            .value=${t.timestamp.length>=16?t.timestamp.slice(0,16):t.timestamp}
            @change=${s=>{let n=s.target.value;this._set("timestamp",n.length===16?`${n}:00`:n)}} />
        </label>
        <label>
          <span>${r("notes_label",e)}</span>
          <textarea
            rows="3"
            @input=${s=>{let n=s.target.value;this._set("notes",n||null)}}
            .value=${t.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${r("cost",e)||"Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${t.cost!=null?String(t.cost):""}
              @input=${s=>{let n=s.target.value;this._set("cost",n?Number(n):null)}} />
          </label>
          <label>
            <span>${r("duration",e)||"Duration (min)"}</span>
            <input type="number" min="0"
              .value=${t.duration!=null?String(t.duration):""}
              @input=${s=>{let n=s.target.value;this._set("duration",n?Number(n):null)}} />
          </label>
        </div>
        ${this._error?l`<div class="error">${this._error}</div>`:u}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${r("cancel",e)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?r("saving",e)||"Saving\u2026":r("save",e)||"Save"}
          </button>
        </div>
      </div>
    `}};D.styles=w`
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
  `,o([f({attribute:!1})],D.prototype,"hass",2),o([h()],D.prototype,"_open",2),o([h()],D.prototype,"_saving",2),o([h()],D.prototype,"_error",2),o([h()],D.prototype,"_draft",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",D)});function ae(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ut(a){return!a.startsWith("data:image/svg+xml,")&&!a.startsWith("data:image/png;base64,")?"":ae(a)}function Fi(a){return a.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var H,Ot=y(()=>{"use strict";T();R();C();H=class extends ${constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(e,t,s,n){this._entryId=e,this._taskId=t,this._objectName=s,this._taskName=n,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let s=[this.hass.connection.sendMessagePromise({...t,action:"view"})];this._taskId&&s.push(this.hass.connection.sendMessagePromise({...t,action:"complete"}));let n=await Promise.all(s);if(e!==this._generateSeq)return;this._viewResult=n[0],n.length>1&&(this._completeResult=n[1])}catch(t){if(e!==this._generateSeq)return;let s=t?.code,n=t?.message;this._error=s==="no_url"||typeof n=="string"&&n.includes("No Home Assistant URL")?r("qr_error_no_url",this.lang):r("qr_error",this.lang)}finally{e===this._generateSeq&&(this._loading=!1)}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,s=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),n=window.open("","_blank","width=600,height=500");if(!n)return;let c=this.lang||"en",d=ae(t),p=ae(s),g=!!this._completeResult,b=ae(r("qr_action_view",c)),m=ae(r("qr_action_complete",c));n.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
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
    <img src="${Ut(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${b}</div>
  </div>
  ${g?`<div class="qr-col">
    <img src="${Ut(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${m}</div>
  </div>`:""}
</div>
<div class="url">${ae(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),n.document.close()}_downloadSvg(e,t){let s=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),n=new Blob([s],{type:"image/svg+xml"}),c=URL.createObjectURL(n),d=document.createElement("a");d.href=c;let p=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;d.download=`qr-${Fi(p)}-${t}.svg`,d.click(),URL.revokeObjectURL(c)}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return l``;let e=this.lang||this.hass?.language||"en",t=this._taskName?`${r("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${r("qr_code",e)}: ${this._objectName}`,s=!!this._viewResult;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._loading?l`<div class="loading">${r("qr_generating",e)}</div>`:this._error?l`<div class="error">${this._error}</div>`:s?l`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${r("qr_action_view",e)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${r("qr_download",e)}
                        </button>
                      </div>
                      ${this._completeResult?l`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${r("qr_action_complete",e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${r("qr_download",e)}
                              </button>
                            </div>
                          `:u}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:u}
          <div class="action-row">
            <label>${r("qr_url_mode",e)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${r("qr_mode_companion",e)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${r("qr_mode_local",e)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${r("qr_mode_server",e)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${r("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!s}
          >
            ${r("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};H.styles=w`
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
  `,o([f({attribute:!1})],H.prototype,"hass",2),o([f()],H.prototype,"lang",2),o([h()],H.prototype,"_open",2),o([h()],H.prototype,"_loading",2),o([h()],H.prototype,"_error",2),o([h()],H.prototype,"_viewResult",2),o([h()],H.prototype,"_completeResult",2),o([h()],H.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",H)});function Wt(a,i){let e=a.interval_analysis,t=e?.weibull_beta,s=e?.weibull_eta;if(t==null||s==null||s<=0)return u;let n=a.interval_days??0,c=a.suggested_interval??n;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${r("weibull_reliability_curve",i)}
        ${Di(t,i)}
      </div>
      ${Ui(t,s,n,c,i)}
      ${Oi(e,i)}
      ${e?.confidence_interval_low!=null?Wi(e,a,i):u}
    </div>
  `}function Di(a,i){let e,t,s;return a<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",s="beta_early_failures"):a<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",s="beta_random_failures"):a<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",s="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",s="beta_highly_predictable"),l`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${r(s,i)} (\u03B2=${a.toFixed(2)})
    </span>
  `}function Ui(a,i,e,t,s){let v=Math.max(e,t,i,1)*1.3,k=50,N=[];for(let j=0;j<=k;j++){let z=j/k*v,li=1-Math.exp(-Math.pow(z/i,a)),ci=32+z/v*260,di=136-li*128;N.push([ci,di])}let me=N.map(([j,z])=>`${j.toFixed(1)},${z.toFixed(1)}`).join(" "),Le="M32,136 "+N.map(([j,z])=>`L${j.toFixed(1)},${z.toFixed(1)}`).join(" ")+` L${N[k][0].toFixed(1)},136 Z`,X=32+e/v*260,fe=1-Math.exp(-Math.pow(e/i,a)),ve=136-fe*128,ni=((1-fe)*100).toFixed(0),et=32+t/v*260,oi=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_weibull",s)}">
        ${oi.map(j=>{let z=136-j*128;return ie`
            <line x1="${32}" y1="${z.toFixed(1)}" x2="${292}" y2="${z.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${j===.5?"4,3":u}" />
            <text x="${28}" y="${(z+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(j*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(v/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(v)}</text>

        <path d="${Le}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${me}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?ie`
          <line x1="${X.toFixed(1)}" y1="${8}" x2="${X.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${X.toFixed(1)}" cy="${ve.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(X+4).toFixed(1)}" y="${(ve-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${ni}%</text>
        `:u}

        ${t>0&&t!==e?ie`
          <line x1="${et.toFixed(1)}" y1="${8}" x2="${et.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:u}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${r("weibull_failure_probability",s)}</span>
      ${e>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${r("current_interval_marker",s)}</span>`:u}
      ${t>0&&t!==e?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${r("recommended_marker",s)}</span>`:u}
    </div>
  `}function Oi(a,i){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${r("characteristic_life",i)}</span>
        <span class="weibull-info-value">${Math.round(a.weibull_eta)} ${r("days",i)}</span>
      </div>
      ${a.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${r("weibull_r_squared",i)}</span>
          <span class="weibull-info-value">${a.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:u}
    </div>
  `}function Wi(a,i,e){let t=a.confidence_interval_low,s=a.confidence_interval_high,n=i.suggested_interval??i.interval_days??0,c=i.interval_days??0,d=Math.max(0,t-5),g=s+5-d,b=(t-d)/g*100,m=(s-t)/g*100,x=(n-d)/g*100,v=c>0?(c-d)/g*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${r("confidence_interval",e)}: ${n} ${r("days",e)} (${t}\u2013${s})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${b.toFixed(1)}%;width:${m.toFixed(1)}%"></div>
        ${v>=0?l`<div class="confidence-marker current" style="left:${v.toFixed(1)}%"></div>`:u}
        <div class="confidence-marker recommended" style="left:${x.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${r("confidence_conservative",e)} (${t}${r("days",e).charAt(0)})</span>
        <span class="confidence-text high">${r("confidence_aggressive",e)} (${s}${r("days",e).charAt(0)})</span>
      </div>
    </div>
  `}var Vt=y(()=>{"use strict";T();C()});function Bt(a,i,e){let t=a.degradation_trend!=null&&a.degradation_trend!=="insufficient_data",s=a.days_until_threshold!=null,n=a.environmental_factor!=null&&a.environmental_factor!==1;if(!t&&!s&&!n)return u;let c=a.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":a.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${a.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${r("sensor_prediction_urgency",i).replace("{days}",String(Math.round(a.days_until_threshold||0)))}
        </div>
      `:u}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${r("sensor_prediction",i)}
      </div>
      <div class="prediction-grid">
        ${t?l`
          <div class="prediction-item">
            <ha-svg-icon path="${c}"></ha-svg-icon>
            <span class="prediction-label">${r("degradation_trend",i)}</span>
            <span class="prediction-value ${a.degradation_trend}">${r("trend_"+a.degradation_trend,i)}</span>
            ${a.degradation_rate!=null?l`<span class="prediction-rate">${a.degradation_rate>0?"+":""}${Math.abs(a.degradation_rate)>=10?Math.round(a.degradation_rate).toLocaleString():a.degradation_rate.toFixed(1)} ${a.trigger_entity_info?.unit_of_measurement||""}/${r("day_short",i)}</span>`:u}
          </div>
        `:u}
        ${s?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${r("days_until_threshold",i)}</span>
            <span class="prediction-value prediction-days${a.days_until_threshold===0?" exceeded":a.sensor_prediction_urgency?" urgent":""}">${a.days_until_threshold===0?r("threshold_exceeded",i):"~"+Math.round(a.days_until_threshold)+" "+r("days",i)}</span>
            ${a.threshold_prediction_date?l`<span class="prediction-date">${Z(a.threshold_prediction_date,i)}</span>`:u}
            ${a.threshold_prediction_confidence?l`<span class="confidence-dot ${a.threshold_prediction_confidence}"></span>`:u}
          </div>
        `:u}
        ${n&&e.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${r("environmental_adjustment",i)}</span>
            <span class="prediction-value">${a.environmental_factor.toFixed(2)}x</span>
            ${a.environmental_entity?l`<span class="prediction-entity entity-link" @click=${d=>qt(d,a.environmental_entity)}>${a.environmental_entity}</span>`:u}
          </div>
        `:u}
      </div>
    </div>
  `}var Gt=y(()=>{"use strict";T();C()});function Kt(a,i,e,t){let s=Math.max(a||1,i);return l`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${r("current",t)}: ${a??"\u2014"} ${a!=null?r("days",t):""}
        </div>
        <div class="interval-visual current"
          style="width: ${a!=null?Math.min(a/s*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${r("recommended",t)}: ${i} ${r("days",t)}
          <span class="confidence-badge ${e}">${r(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(i/s*100,100)}%"></div>
      </div>
    </div>
  `}var Yt=y(()=>{"use strict";T();C()});function Zt(a,i,e){if(!e.seasonal||!a.seasonal_factor||a.seasonal_factor===1)return u;let t=Jt.map(d=>r(d,i)),s=new Date().getMonth(),n=a.seasonal_factors||a.interval_analysis?.seasonal_factors||null,c=n&&n.length===12?n:t.map((d,p)=>{let g=a.seasonal_factor||1,b=Math.sin((p-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,g+b))});return l`
    <div class="seasonal-card-compact">
      <h4>${r("seasonal_awareness",i)}</h4>
      <div class="seasonal-mini-chart">
        ${c.map((d,p)=>{let g=d*40,b=d<.9?"low":d>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${b} ${p===s?"current":""}"
                 style="height: ${g}px"
                 title="${t[p]}: ${d.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${r("shorter",i)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${r("normal",i)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${r("longer",i)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function Qt(a,i){return Vi(a,i)}function Vi(a,i){let e=a.seasonal_factors??a.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return u;let t=a.interval_analysis?.seasonal_reason,s=new Date().getMonth(),n=300,c=100,d=8,g=c-d-4,b=Math.max(...e,1.5),m=n/12,x=m*.65,v=d+g-1/b*g;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${r("seasonal_chart_title",i)}
        ${t?l`<span class="source-tag">${t==="learned"?r("seasonal_learned",i):r("seasonal_manual",i)}</span>`:u}
      </div>
      <svg viewBox="0 0 ${n} ${c}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${r("chart_seasonal",i)}">
        <line x1="0" y1="${v.toFixed(1)}" x2="${n}" y2="${v.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((k,N)=>{let me=k/b*g,Le=N*m+(m-x)/2,X=d+g-me,fe=N===s,ve=k<1?"var(--success-color, #4caf50)":k>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return ie`
            <rect x="${Le.toFixed(1)}" y="${X.toFixed(1)}"
              width="${x.toFixed(1)}" height="${me.toFixed(1)}"
              fill="${ve}" opacity="${fe?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Jt.map((k,N)=>l`<span class="seasonal-label ${N===s?"active-month":""}">${r(k,i)}</span>`)}
      </div>
    </div>
  `}var Jt,Xt=y(()=>{"use strict";T();C();Jt=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"]});var E,ei=y(()=>{"use strict";T();R();C();Q();Vt();Gt();Yt();Xt();E=class extends ${constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1}get _lang(){return this.hass?.language||"en"}async openFor(e,t){this._entryId=e,this._taskId=t,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=new Date().toISOString().slice(0,10),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});e?.features&&(this._features={...this._features,...e.features}),this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=e.object?.name||"";let t=(e.tasks||[]).find(s=>s.id===this._taskId);this._task=t??null}catch(e){this._error=I(e,this._lang)}}async _runWs(e){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(e),this._busy=!1,!0}catch(t){return this._error=I(t,this._lang),this._busy=!1,!1}}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(P(),U)).then(({openCompleteDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,checklist:this._task.checklist||[],adaptive_enabled:!!this._task.adaptive_config?.enabled})&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||Promise.resolve().then(()=>(P(),U)).then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(P(),U)).then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let e=r("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(e))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=r("suggestion_applied",this._lang)||"Applied",this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=e.recommended_interval?`${r("reanalyze_result",this._lang)||"Recomputed"}: ${e.recommended_interval}d (${e.data_points} pts)`:r("reanalyze_insufficient_data",this._lang)||"Not enough data",await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(e){this._error=I(e,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(e){!this._entryId||!this._taskId||Promise.resolve().then(()=>(P(),U)).then(({openHistoryEditDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,original_timestamp:e.timestamp,type:e.type,timestamp:e.timestamp,notes:e.notes??null,cost:e.cost??null,duration:e.duration??null,completed_by:e.completed_by??null})})}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return u;let t=this._lang;return l`
      <div class="recommendation-card">
        <h4>${r("suggested_interval",t)}</h4>
        ${Kt(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",t)}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${r("apply_suggestion",t)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${r("reanalyze",t)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(e){let t=this._lang,s=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,n=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,c=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,d=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!s&&!n&&!c&&!d?l`<div class="adaptive-empty">
        ${r("adaptive_no_data",t)||"Not enough completion history yet for adaptive analysis."}
      </div>`:l`
      <div class="adaptive-stack">
        ${this._toast?l`<div class="toast">${this._toast}</div>`:u}
        ${s?this._renderRecommendation(e):u}
        ${n?Bt(e,t,this._features):u}
        ${c?Wt(e,t):u}
        ${d?l`
          ${Zt(e,t,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?Qt(e,t):u}
        `:u}
      </div>
    `}_renderDetails(e){let t=this._lang,s=e.history||[],n=s.filter(p=>p.type==="completed"),c=n.reduce((p,g)=>p+(typeof g.cost=="number"?g.cost:0),0),d=(()=>{let p=n.map(g=>typeof g.duration=="number"?g.duration:null).filter(g=>g!=null);return p.length?Math.round(p.reduce((g,b)=>g+b,0)/p.length):null})();return l`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${r("times_performed",t)||"Performed"}</span>
            <span class="stat-value">${n.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("total_cost",t)||"Total cost"}</span>
            <span class="stat-value">${c.toFixed(2)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${r("avg_duration",t)||"Avg duration"}</span>
            <span class="stat-value">${d!=null?`${d}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${r("history",t)||"History"}</strong>
          <span class="history-count">${s.length}</span>
        </div>
        ${s.length===0?l`<div class="history-empty">${r("history_empty",t)||"No history yet."}</div>`:l`
              <div class="history-list">
                ${[...s].reverse().slice(0,20).map(p=>{let g=["completed","reset","skipped"].includes(p.type);return l`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${p.type}">${r(p.type,t)}</span>
                        <span class="history-date">${zt(p.timestamp,t)}</span>
                        ${g?l`<button class="history-edit"
                                   title="${r("history_edit_button",t)||"Edit"}"
                                   @click=${()=>this._onEditHistoryEntry(p)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:u}
                      </div>
                      ${p.notes?l`<div class="history-notes">${p.notes}</div>`:u}
                      ${p.cost!=null||p.duration!=null?l`<div class="history-meta">
                            ${p.cost!=null?l`<span>💰 ${p.cost.toFixed(2)}</span>`:u}
                            ${p.duration!=null?l`<span>⏱️ ${p.duration}m</span>`:u}
                          </div>`:u}
                    </div>
                  `})}
                ${s.length>20?l`<div class="history-more">… +${s.length-20} ${r("older_entries",t)||"older"}</div>`:u}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return u;let e=this._lang,t=this._task,s=this.hass?.user?.is_admin??!0;return l`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${t?l`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${re[t.status]||"#ccc"}"></span>
                  <span class="task-name">${t.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&Promise.resolve().then(()=>(P(),U)).then(({openObjectQuickActions:n})=>{n(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${t.next_due?l`<span><strong>${r("next_due",e)||"Next due"}:</strong> ${Z(t.next_due,e)}</span>`:u}
                  ${t.last_performed?l`<span><strong>${r("last_performed",e)||"Last"}:</strong> ${Z(t.last_performed,e)}</span>`:u}
                  ${t.schedule?.kind&&!["manual","one_time"].includes(t.schedule.kind)||t.interval_days!=null?l`<span><strong>${r("interval",e)||"Interval"}:</strong> ${Pt(t,e)}</span>`:u}
                </div>
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:u}

              ${this._showSkip?l`
                    <div class="inline-form">
                      <label>${r("skip_reason",e)||"Skip reason (optional)"}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${n=>{this._skipReason=n.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${r("cancel",e)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${r("skip",e)||"Skip"}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?l`
                    <div class="inline-form">
                      <label>${r("reset_to_date",e)||"Reset last_performed to"}</label>
                      <input type="date" .value=${this._resetDate}
                        @input=${n=>{this._resetDate=n.target.value}} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showReset=!1}} ?disabled=${this._busy}>
                          ${r("cancel",e)||"Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${r("reset",e)||"Reset"}
                        </button>
                      </div>
                    </div>
                  `:l`
                    <div class="actions primary-row">
                      <button class="btn primary" @click=${this._onComplete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:check"></ha-icon>
                        ${r("complete",e)||"Complete"}
                      </button>
                      <button class="btn" @click=${()=>{this._showSkip=!0}} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:skip-next"></ha-icon>
                        ${r("skip",e)||"Skip"}
                      </button>
                      <button class="btn" @click=${()=>{this._showReset=!0}} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:restart"></ha-icon>
                        ${r("reset",e)||"Reset"}
                      </button>
                    </div>
                    ${s?l`
                          <div class="actions secondary-row">
                            <button class="btn ghost" @click=${this._onEdit} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                              ${r("edit",e)||"Edit"}
                            </button>
                            <button class="btn ghost" @click=${this._onQr} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:qrcode"></ha-icon>
                              ${r("qr_code",e)||"QR"}
                            </button>
                            <button class="btn ghost"
                              @click=${t.archived?this._onUnarchive:this._onArchive}
                              ?disabled=${this._busy}>
                              <ha-icon icon="${t.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                              ${t.archived?r("unarchive",e)||"Unarchive":r("archive",e)||"Archive"}
                            </button>
                            <button class="btn ghost danger" @click=${this._onDelete} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:delete"></ha-icon>
                              ${r("delete",e)||"Delete"}
                            </button>
                          </div>
                        `:u}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?r("hide_details",e)||"Hide details":r("show_details",e)||"Show history + stats"}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?l`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?r("hide_stats",e)||"Hide stats":r("show_stats",e)||"Show stats + graphs"}
                          </button>`:u}
                    </div>
                    ${this._showDetails?this._renderDetails(t):u}
                    ${this._showAdaptive?this._renderAdaptive(t):u}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${r("open_in_panel",e)||"Open in Maintenance panel"}
                      </button>
                    </div>
                  `}
            `:l`<div class="loading">${r("loading",e)||"Loading\u2026"}</div>`}
      </div>
    `}};E.styles=[Se,w`
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
  `],o([f({attribute:!1})],E.prototype,"hass",2),o([h()],E.prototype,"_open",2),o([h()],E.prototype,"_entryId",2),o([h()],E.prototype,"_taskId",2),o([h()],E.prototype,"_task",2),o([h()],E.prototype,"_objectName",2),o([h()],E.prototype,"_busy",2),o([h()],E.prototype,"_error",2),o([h()],E.prototype,"_showSkip",2),o([h()],E.prototype,"_showReset",2),o([h()],E.prototype,"_showDetails",2),o([h()],E.prototype,"_showAdaptive",2),o([h()],E.prototype,"_skipReason",2),o([h()],E.prototype,"_resetDate",2),o([h()],E.prototype,"_features",2),o([h()],E.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",E)});var q,ti=y(()=>{"use strict";T();R();C();Q();q=class extends ${constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return this.hass?.language||"en"}async openFor(e){this._entryId=e,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=e}catch(e){this._error=I(e,this._lang)}}_onEditObject(){!this._entryId||!this._data||Promise.resolve().then(()=>(P(),U)).then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&Promise.resolve().then(()=>(P(),U)).then(({openCreateTaskDialog:e})=>{e(),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let e=r("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(e)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=I(t,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let e=!!this._data.object.archived;if(!e){let t=r("confirm_archive_object",this._lang)||"Archive this object and its tasks?";if(!window.confirm(t))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=I(t,this._lang)}finally{this._busy=!1}}_onTaskClick(e){this._entryId&&Promise.resolve().then(()=>(P(),U)).then(({openTaskQuickActions:t})=>{t(this._entryId,e)})}render(){if(!this._open)return u;let e=this._lang,t=this._data,s=t?.object,n=t?.tasks||[],c=this.hass?.user?.is_admin??!0;return l`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${t&&s?l`
              <div class="header">
                <div class="title">${s.name}</div>
                ${this._renderMetaRow(s)}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:u}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${r("tasks",e)||"Tasks"}</strong>
                  <span class="count">${n.length}</span>
                </div>
                ${n.length===0?l`<div class="empty">${r("no_tasks",e)||"No tasks yet."}</div>`:l`
                      <div class="task-list">
                        ${n.map(d=>l`
                          <div class="task-row" @click=${()=>this._onTaskClick(d.id)}>
                            <span class="status-dot" style="background: ${re[d.status]||"#ccc"}"></span>
                            <span class="task-name">${d.name}</span>
                            <span class="task-status">${r(d.status||"ok",e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${s.notes?l`
                    <div class="notes-section">
                      <strong>${r("object_notes_label",e)}</strong>
                      <div class="notes-body">${s.notes}</div>
                    </div>
                  `:u}

              ${c?l`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${r("add_task",e)||"Add task"}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${r("edit",e)||"Edit"}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${s.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${s.archived?r("unarchive_object",e)||"Unarchive object":r("archive_object",e)||"Archive object"}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${r("delete",e)||"Delete"}
                      </button>
                    </div>
                  `:u}
            `:l`<div class="loading">${r("loading",e)||"Loading\u2026"}</div>`}
      </div>
    `}_renderMetaRow(e){let t=this._lang,s=[];return e.area_id&&s.push([r("area",t),e.area_id]),e.manufacturer&&s.push([r("manufacturer",t),e.manufacturer]),e.model&&s.push([r("model",t),e.model]),e.serial_number&&s.push([r("serial_number_label",t),e.serial_number]),e.installation_date&&s.push([r("installed",t),e.installation_date]),e.warranty_expiry&&s.push([r("warranty",t),e.warranty_expiry]),e.documentation_url&&s.push([r("documentation_url_label",t),e.documentation_url]),s.length===0?u:l`
      <div class="meta">
        ${s.map(([n,c])=>l`
            <div class="meta-item">
              <span class="meta-label">${n}</span>
              <span class="meta-value">${/^https?:\/\//i.test(c)?l`<a href="${c}" target="_blank" rel="noopener noreferrer">${c}</a>`:c}</span>
            </div>
          `)}
      </div>
    `}};q.styles=w`
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
  `,o([f({attribute:!1})],q.prototype,"hass",2),o([h()],q.prototype,"_open",2),o([h()],q.prototype,"_entryId",2),o([h()],q.prototype,"_data",2),o([h()],q.prototype,"_busy",2),o([h()],q.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",q)});var U={};hi(U,{openCompleteDialog:()=>es,openCreateObjectDialog:()=>Ze,openCreateTaskDialog:()=>Qe,openEditObjectDialog:()=>Zi,openEditTaskDialog:()=>Qi,openHistoryEditDialog:()=>Xi,openObjectQuickActions:()=>is,openQrDialog:()=>ts,openTaskQuickActions:()=>Xe});function Ce(){return document.querySelector("home-assistant")?.hass}function O(a){let i=document.body.querySelector(a);return i||(i=document.createElement(a),document.body.appendChild(i)),i}function W(a){let i=Ce();return i?(a.hass=i,!0):!1}function ai(a){return Ie||(Ie=a.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(i=>({features:i.features??ii.features,defaultWarningDays:i.general?.default_warning_days??7})).catch(()=>ii),Ie)}function Ze(){let a=O(si);return W(a)?(a.openCreate(),!0):!1}function Zi(a,i){let e=O(si);return W(e)?(e.openEdit(a,i),!0):!1}function Qe(){let a=O(ri);if(!W(a))return!1;let i=Ce();return i?((async()=>{let e=await ai(i),t=a;t.checklistsEnabled=e.features.checklists,t.scheduleTimeEnabled=e.features.schedule_time,t.completionActionsEnabled=e.features.completion_actions,t.defaultWarningDays=e.defaultWarningDays,t.openCreate()})(),!0):!1}function Qi(a,i){let e=O(ri);if(!W(e))return!1;let t=Ce();return t?((async()=>{try{let[s,n]=await Promise.all([t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:a}),ai(t)]),c=(s.tasks||[]).find(p=>p.id===i);if(!c){console.warn(`openEditTaskDialog: task ${i} not found in entry ${a}`);return}let d=e;d.checklistsEnabled=n.features.checklists,d.scheduleTimeEnabled=n.features.schedule_time,d.completionActionsEnabled=n.features.completion_actions,d.defaultWarningDays=n.defaultWarningDays,await d.openEdit(a,c)}catch(s){console.warn("openEditTaskDialog: failed to load task/features",s)}})(),!0):!1}function Xi(a){let i=O(Bi);return W(i)?(i.openEdit(a),!0):!1}function es(a){let i=O(Gi);return W(i)?(i.entryId=a.entry_id,i.taskId=a.task_id,i.taskName=a.task_name,i.checklist=a.checklist??[],i.adaptiveEnabled=!!a.adaptive_enabled,i.lang=Ce()?.language||"en",i.open(),!0):!1}function ts(a){let i=O(Ki);return W(i)?(i.openForTask(a.entry_id,a.task_id,a.object_name,a.task_name),!0):!1}function Xe(a,i){let e=O(Yi);return W(e)?(e.openFor(a,i),!0):!1}function is(a){let i=O(Ji);return W(i)?(i.openFor(a),!0):!1}var si,ri,Bi,Gi,Ki,Yi,Ji,ii,Ie,P=y(()=>{"use strict";Nt();Ft();Ye();Dt();Ot();ei();ti();si="maintenance-object-dialog",ri="maintenance-task-dialog",Bi="maintenance-history-edit-dialog",Gi="maintenance-complete-dialog",Ki="maintenance-qr-dialog",Yi="maintenance-task-quick-actions-dialog",Ji="maintenance-object-quick-actions-dialog";ii={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7},Ie=null});T();R();C();T();R();C();var Li=["overdue","triggered","due_soon","ok"],F=class extends ${constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._loadingObjects=!0;this._loadError=!1;this._objectsLoaded=!1;this._onEntitiesChanged=e=>{this._valueChanged("entity_ids",e.detail.value||[])}}get _lang(){return this.hass?.language||"en"}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._objectsLoaded&&(this._objectsLoaded=!0,this._loadObjects())}async _loadObjects(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=e.objects||[],this._loadError=!1}catch{this._objects=[],this._loadError=!0}this._loadingObjects=!1}_valueChanged(e,t){let s={...this._config,[e]:t};Array.isArray(t)&&t.length===0&&delete s[e],this._config=s,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s}}))}_toggleStatus(e,t){let s=new Set(this._config.filter_status||[]);t?s.add(e):s.delete(e),this._valueChanged("filter_status",[...s])}_toggleObject(e,t){let s=new Set(this._config.filter_objects||[]);t?s.add(e):s.delete(e),this._valueChanged("filter_objects",[...s])}render(){let e=this._lang,t=new Set(this._config.filter_status||[]),s=new Set(this._config.filter_objects||[]),n=[...this._objects].map(d=>d.object.name).sort((d,p)=>d.localeCompare(p)),c=[];for(let d of this._objects)for(let p of d.tasks)p.sensor_entity_id&&c.push(p.sensor_entity_id),p.binary_sensor_entity_id&&c.push(p.binary_sensor_entity_id);return l`
      <div class="editor">
        <ha-textfield
          label="${r("card_title",e)}"
          .value=${this._config.title||""}
          @input=${d=>this._valueChanged("title",d.target.value)}
        ></ha-textfield>

        <!-- Status filter (chip row) -->
        <div class="field">
          <div class="field-label">${r("card_filter_status",e)}</div>
          <div class="chip-row">
            ${Li.map(d=>l`
              <label class="chip ${t.has(d)?"active":""}">
                <input type="checkbox"
                  .checked=${t.has(d)}
                  @change=${p=>this._toggleStatus(d,p.target.checked)} />
                ${r(d,e)}
              </label>
            `)}
          </div>
          <div class="field-help">${r("card_filter_status_help",e)}</div>
        </div>

        <!-- Object filter (multi-checkbox) -->
        <div class="field">
          <div class="field-label">${r("card_filter_objects",e)}</div>
          ${this._loadingObjects?l`<div class="field-help">${r("card_loading_objects",e)}</div>`:this._loadError?l`<div class="field-help error-text">${r("card_load_error",e)}</div>`:n.length===0?l`<div class="field-help">${r("no_objects",e)}</div>`:l`
                <div class="object-list">
                  ${n.map(d=>l`
                    <label class="object-row">
                      <input type="checkbox"
                        .checked=${s.has(d)}
                        @change=${p=>this._toggleObject(d,p.target.checked)} />
                      <span>${d}</span>
                    </label>
                  `)}
                </div>
                <div class="field-help">${r("card_filter_objects_help",e)}</div>
              `}
        </div>

        <!-- Entity-id filter (HA-native pattern). Limited to our integration's
             sensor + binary_sensor entities via includeEntities so the picker
             stays usable on installs with thousands of entities. -->
        <div class="field">
          <div class="field-label">${r("card_filter_entities",e)}</div>
          <ha-entities-picker
            .hass=${this.hass}
            .value=${this._config.entity_ids||[]}
            .includeDomains=${["sensor","binary_sensor"]}
            .includeEntities=${c}
            @value-changed=${this._onEntitiesChanged}
          ></ha-entities-picker>
          <div class="field-help">${r("card_filter_entities_help",e)}</div>
        </div>

        <ha-formfield label="${r("card_show_header",e)}">
          <ha-switch
            .checked=${this._config.show_header!==!1}
            @change=${d=>this._valueChanged("show_header",d.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${r("card_show_actions",e)}">
          <ha-switch
            .checked=${this._config.show_actions!==!1}
            @change=${d=>this._valueChanged("show_actions",d.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${r("card_compact",e)}">
          <ha-switch
            .checked=${this._config.compact||!1}
            @change=${d=>this._valueChanged("compact",d.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-textfield
          label="${r("card_max_items",e)}"
          type="number"
          .value=${String(this._config.max_items||0)}
          @input=${d=>this._valueChanged("max_items",parseInt(d.target.value,10)||0)}
        ></ha-textfield>
        ${u}
      </div>
    `}};F.styles=w`
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
  `,o([f({attribute:!1})],F.prototype,"hass",2),o([h()],F.prototype,"_config",2),o([h()],F.prototype,"_objects",2),o([h()],F.prototype,"_loadingObjects",2),o([h()],F.prototype,"_loadError",2);customElements.get("maintenance-supporter-card-editor")||customElements.define("maintenance-supporter-card-editor",F);Ye();P();var V=class extends ${constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._stats=null;this._unsub=null;this._dataLoaded=!1;this._lastConnection=null;this._onCompleted=async()=>{await this._loadData()}}get _lang(){return this.hass?.language||"en"}static getConfigElement(){return document.createElement("maintenance-supporter-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-card",show_header:!0,show_actions:!0,filter_status:["overdue","triggered","due_soon"],max_items:10}}setConfig(e){this._config=e}getCardSize(){return 3}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null}updated(e){super.updated(e);let t=this.hass?.language;if(t&&!Ht(t)&&jt(t).then(()=>this.requestUpdate()),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=e.objects,this._stats=t}catch{}}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(e=>{let t=e;this._objects=t.objects},{type:"maintenance_supporter/subscribe"})}catch{}}get _flatTasks(){let e=[],{filter_status:t,filter_objects:s,entity_ids:n,filter_due_min_days:c,filter_due_max_days:d,max_items:p}=this._config,g=n?.length?new Set(n):null,b=c!==void 0||d!==void 0;for(let x of this._objects)if(!(s?.length&&!s.includes(x.object.name))){for(let v of x.tasks)if(!v.is_done&&!(v.archived||x.object.archived)&&!(t?.length&&!t.includes(v.status))&&!(g&&!(v.sensor_entity_id&&g.has(v.sensor_entity_id)||v.binary_sensor_entity_id&&g.has(v.binary_sensor_entity_id)))){if(b){let k=v.days_until_due;if(k==null||c!==void 0&&k<c||d!==void 0&&k>d)continue}e.push({entry_id:x.entry_id,object_name:x.object.name,task:v})}}let m={overdue:0,triggered:1,due_soon:2,ok:3};return e.sort((x,v)=>{let k=(m[x.task.status]??9)-(m[v.task.status]??9);return k!==0?k:(x.task.days_until_due??1/0)-(v.task.days_until_due??1/0)}),p&&p>0?e.slice(0,p):e}_openTaskDetail(e,t){Xe(e,t)}render(){let e=this._lang,t=this._config.title||r("maintenance",e),s=this._config.show_header!==!1,n=this._config.show_actions!==!1,c=this._config.compact||!1,d=this._flatTasks,p=this._stats;return l`
      <ha-card>
        <div class="card-header">
          <h1>${t}</h1>
          <div class="header-right">
            ${s&&p?l`
                  <div class="header-stats">
                    ${p.overdue>0?l`<span class="badge overdue">${p.overdue}</span>`:u}
                    ${p.due_soon>0?l`<span class="badge due_soon">${p.due_soon}</span>`:u}
                    ${p.triggered>0?l`<span class="badge triggered">${p.triggered}</span>`:u}
                  </div>
                `:u}
            ${n?l`
                  <mwc-icon-button
                    class="hdr-add"
                    title="${r("new_object",e)}"
                    @click=${()=>Ze()}
                  >
                    <ha-icon icon="mdi:plus-box"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button
                    class="hdr-add"
                    title="${r("add_task",e)}"
                    @click=${()=>Qe()}
                  >
                    <ha-icon icon="mdi:playlist-plus"></ha-icon>
                  </mwc-icon-button>
                `:u}
          </div>
        </div>
        ${d.length===0?l`<div class="empty-card">
              <div>${r("card_no_tasks_title",e)}</div>
              <a class="empty-link" href="/maintenance-supporter">${r("card_no_tasks_cta",e)}</a>
            </div>`:l`
              <div class="task-list ${c?"compact":""}">
                ${d.map(({entry_id:g,object_name:b,task:m})=>l`
                    <div class="task-item clickable"
                         @click=${()=>this._openTaskDetail(g,m.id)}
                         title="${r("open_task",e)||"Open task"}">
                      <div class="status-dot" style="background: ${re[m.status]||"#ccc"}"></div>
                      <div class="task-info">
                        <div class="task-name">${m.name}</div>
                        ${c?u:l`<div class="task-meta">${b} · ${r(m.type,e)}</div>`}
                      </div>
                      <div class="task-due">
                        ${m.days_until_due!==null&&m.days_until_due!==void 0?m.days_until_due<0?l`<span class="overdue-text">${Math.abs(m.days_until_due)}${e.startsWith("de")?"T":"d"}</span>`:m.days_until_due===0?r("today",e):`${m.days_until_due}${e.startsWith("de")?"T":"d"}`:m.trigger_active?"\u26A1":"\u2014"}
                      </div>
                      ${n?l`
                            <mwc-icon-button
                              class="complete-btn"
                              title="${r("complete",e)}"
                              @click=${x=>{x.stopPropagation();let v=this.shadowRoot.querySelector("maintenance-complete-dialog");v.entryId=g,v.taskId=m.id,v.taskName=m.name,v.checklist=m.checklist||[],v.adaptiveEnabled=!!m.adaptive_config?.enabled,v.lang=e,v.open()}}
                            >
                              <ha-icon icon="mdi:check"></ha-icon>
                            </mwc-icon-button>
                          `:u}
                    </div>
                  `)}
              </div>
            `}
      </ha-card>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onCompleted}
      ></maintenance-complete-dialog>
    `}};V.styles=[Se,w`
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
    `],o([f({attribute:!1})],V.prototype,"hass",2),o([h()],V.prototype,"_config",2),o([h()],V.prototype,"_objects",2),o([h()],V.prototype,"_stats",2),o([h()],V.prototype,"_unsub",2);customElements.get("maintenance-supporter-card")||customElements.define("maintenance-supporter-card",V);window.customCards=window.customCards||[];window.customCards.push({type:"maintenance-supporter-card",name:"Maintenance Supporter",description:"Overview of your maintenance tasks with quick actions.",preview:!0});export{V as MaintenanceSupporterCard};
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
