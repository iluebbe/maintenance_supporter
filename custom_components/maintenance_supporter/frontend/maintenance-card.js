/*! maintenance_supporter frontend 2.74.0 */
var Bt=Object.defineProperty;var ys=Object.getOwnPropertyDescriptor;var w=(r,s,e)=>()=>{if(e)throw e[0];try{return r&&(s=r(r=0)),s}catch(t){throw e=[t],t}};var xs=(r,s)=>{for(var e in s)Bt(r,e,{get:s[e],enumerable:!0})};var l=(r,s,e,t)=>{for(var i=t>1?void 0:t?ys(s,e):s,n=r.length-1,c;n>=0;n--)(c=r[n])&&(i=(t?c(s,e,i):c(i))||i);return t&&i&&Bt(s,e,i),i};var Fe,Ue,at,Vt,ke,Wt,T,Kt,nt,ot=w(()=>{Fe=globalThis,Ue=Fe.ShadowRoot&&(Fe.ShadyCSS===void 0||Fe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,at=Symbol(),Vt=new WeakMap,ke=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==at)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(Ue&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=Vt.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&Vt.set(e,s))}return s}toString(){return this.cssText}},Wt=r=>new ke(typeof r=="string"?r:r+"",void 0,at),T=(r,...s)=>{let e=r.length===1?r[0]:s.reduce((t,i,n)=>t+(c=>{if(c._$cssResult$===!0)return c.cssText;if(typeof c=="number")return c;throw Error("Value passed to 'css' function must be a 'css' function result: "+c+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new ke(e,r,at)},Kt=(r,s)=>{if(Ue)r.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),i=Fe.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,r.appendChild(t)}},nt=Ue?r=>r:r=>r instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return Wt(e)})(r):r});var ws,$s,ks,Es,Ss,As,Be,Yt,Ts,Cs,Ee,Se,Ve,Gt,X,Ae=w(()=>{ot();ot();({is:ws,defineProperty:$s,getOwnPropertyDescriptor:ks,getOwnPropertyNames:Es,getOwnPropertySymbols:Ss,getPrototypeOf:As}=Object),Be=globalThis,Yt=Be.trustedTypes,Ts=Yt?Yt.emptyScript:"",Cs=Be.reactiveElementPolyfillSupport,Ee=(r,s)=>r,Se={toAttribute(r,s){switch(s){case Boolean:r=r?Ts:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,s){let e=r;switch(s){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Ve=(r,s)=>!ws(r,s),Gt={attribute:!0,type:String,converter:Se,reflect:!1,useDefault:!1,hasChanged:Ve};Symbol.metadata??=Symbol("metadata"),Be.litPropertyMetadata??=new WeakMap;X=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=Gt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(s,t,e);i!==void 0&&$s(this.prototype,s,i)}}static getPropertyDescriptor(s,e,t){let{get:i,set:n}=ks(this.prototype,s)??{get(){return this[e]},set(c){this[e]=c}};return{get:i,set(c){let d=i?.call(this);n?.call(this,c),this.requestUpdate(s,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??Gt}static _$Ei(){if(this.hasOwnProperty(Ee("elementProperties")))return;let s=As(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(Ee("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ee("properties"))){let e=this.properties,t=[...Es(e),...Ss(e)];for(let i of t)this.createProperty(i,e[i])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let i of t)e.unshift(nt(i))}else s!==void 0&&e.push(nt(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Kt(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),i=this.constructor._$Eu(s,t);if(i!==void 0&&t.reflect===!0){let n=(t.converter?.toAttribute!==void 0?t.converter:Se).toAttribute(e,t.type);this._$Em=s,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(s,e){let t=this.constructor,i=t._$Eh.get(s);if(i!==void 0&&this._$Em!==i){let n=t.getPropertyOptions(i),c=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Se;this._$Em=i;let d=c.fromAttribute(e,n.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(s,e,t,i=!1,n){if(s!==void 0){let c=this.constructor;if(i===!1&&(n=this[s]),t??=c.getPropertyOptions(s),!((t.hasChanged??Ve)(n,e)||t.useDefault&&t.reflect&&n===this._$Ej?.get(s)&&!this.hasAttribute(c._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:i,wrapped:n},c){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,c??e??this[s]),n!==!0||c!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),i===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,n]of t){let{wrapped:c}=n,d=this[i];c!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,n,d)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};X.elementStyles=[],X.shadowRootOptions={mode:"open"},X[Ee("elementProperties")]=new Map,X[Ee("finalized")]=new Map,Cs?.({ReactiveElement:X}),(Be.reactiveElementVersions??=[]).push("2.1.2")});function ni(r,s){if(!gt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Jt!==void 0?Jt.createHTML(s):s}function ge(r,s,e=r,t){if(s===pe)return s;let i=t!==void 0?e._$Co?.[t]:e._$Cl,n=Ie(s)?void 0:s._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(s=ge(r,i._$AS(r,s.values),i,t)),s}var _t,Qt,We,Jt,si,ae,ri,Is,de,Ce,Ie,gt,Ps,lt,Te,Zt,Xt,le,ei,ti,ai,mt,o,fe,Dr,pe,p,ii,ce,Ls,Pe,ct,Le,me,dt,pt,ht,ut,Rs,oi,Ke=w(()=>{_t=globalThis,Qt=r=>r,We=_t.trustedTypes,Jt=We?We.createPolicy("lit-html",{createHTML:r=>r}):void 0,si="$lit$",ae=`lit$${Math.random().toFixed(9).slice(2)}$`,ri="?"+ae,Is=`<${ri}>`,de=document,Ce=()=>de.createComment(""),Ie=r=>r===null||typeof r!="object"&&typeof r!="function",gt=Array.isArray,Ps=r=>gt(r)||typeof r?.[Symbol.iterator]=="function",lt=`[ 	
\f\r]`,Te=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Zt=/-->/g,Xt=/>/g,le=RegExp(`>|${lt}(?:([^\\s"'>=/]+)(${lt}*=${lt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ei=/'/g,ti=/"/g,ai=/^(?:script|style|textarea|title)$/i,mt=r=>(s,...e)=>({_$litType$:r,strings:s,values:e}),o=mt(1),fe=mt(2),Dr=mt(3),pe=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),ii=new WeakMap,ce=de.createTreeWalker(de,129);Ls=(r,s)=>{let e=r.length-1,t=[],i,n=s===2?"<svg>":s===3?"<math>":"",c=Te;for(let d=0;d<e;d++){let h=r[d],_,f,x=-1,v=0;for(;v<h.length&&(c.lastIndex=v,f=c.exec(h),f!==null);)v=c.lastIndex,c===Te?f[1]==="!--"?c=Zt:f[1]!==void 0?c=Xt:f[2]!==void 0?(ai.test(f[2])&&(i=RegExp("</"+f[2],"g")),c=le):f[3]!==void 0&&(c=le):c===le?f[0]===">"?(c=i??Te,x=-1):f[1]===void 0?x=-2:(x=c.lastIndex-f[2].length,_=f[1],c=f[3]===void 0?le:f[3]==='"'?ti:ei):c===ti||c===ei?c=le:c===Zt||c===Xt?c=Te:(c=le,i=void 0);let b=c===le&&r[d+1].startsWith("/>")?" ":"";n+=c===Te?h+Is:x>=0?(t.push(_),h.slice(0,x)+si+h.slice(x)+ae+b):h+ae+(x===-2?d:b)}return[ni(r,n+(r[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},Pe=class r{constructor({strings:s,_$litType$:e},t){let i;this.parts=[];let n=0,c=0,d=s.length-1,h=this.parts,[_,f]=Ls(s,e);if(this.el=r.createElement(_,t),ce.currentNode=this.el.content,e===2||e===3){let x=this.el.content.firstChild;x.replaceWith(...x.childNodes)}for(;(i=ce.nextNode())!==null&&h.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let x of i.getAttributeNames())if(x.endsWith(si)){let v=f[c++],b=i.getAttribute(x).split(ae),m=/([.?@])?(.*)/.exec(v);h.push({type:1,index:n,name:m[2],strings:b,ctor:m[1]==="."?dt:m[1]==="?"?pt:m[1]==="@"?ht:me}),i.removeAttribute(x)}else x.startsWith(ae)&&(h.push({type:6,index:n}),i.removeAttribute(x));if(ai.test(i.tagName)){let x=i.textContent.split(ae),v=x.length-1;if(v>0){i.textContent=We?We.emptyScript:"";for(let b=0;b<v;b++)i.append(x[b],Ce()),ce.nextNode(),h.push({type:2,index:++n});i.append(x[v],Ce())}}}else if(i.nodeType===8)if(i.data===ri)h.push({type:2,index:n});else{let x=-1;for(;(x=i.data.indexOf(ae,x+1))!==-1;)h.push({type:7,index:n}),x+=ae.length-1}n++}}static createElement(s,e){let t=de.createElement("template");return t.innerHTML=s,t}};ct=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,i=(s?.creationScope??de).importNode(e,!0);ce.currentNode=i;let n=ce.nextNode(),c=0,d=0,h=t[0];for(;h!==void 0;){if(c===h.index){let _;h.type===2?_=new Le(n,n.nextSibling,this,s):h.type===1?_=new h.ctor(n,h.name,h.strings,this,s):h.type===6&&(_=new ut(n,this,s)),this._$AV.push(_),h=t[++d]}c!==h?.index&&(n=ce.nextNode(),c++)}return ce.currentNode=de,i}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},Le=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=ge(this,s,e),Ie(s)?s===p||s==null||s===""?(this._$AH!==p&&this._$AR(),this._$AH=p):s!==this._$AH&&s!==pe&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):Ps(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==p&&Ie(this._$AH)?this._$AA.nextSibling.data=s:this.T(de.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,i=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=Pe.createElement(ni(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new ct(i,this),c=n.u(this.options);n.p(e),this.T(c),this._$AH=n}}_$AC(s){let e=ii.get(s.strings);return e===void 0&&ii.set(s.strings,e=new Pe(s)),e}k(s){gt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let n of s)i===e.length?e.push(t=new r(this.O(Ce()),this.O(Ce()),this,this.options)):t=e[i],t._$AI(n),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=Qt(s).nextSibling;Qt(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},me=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,i,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=s,this.name=e,this._$AM=i,this.options=n,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(s,e=this,t,i){let n=this.strings,c=!1;if(n===void 0)s=ge(this,s,e,0),c=!Ie(s)||s!==this._$AH&&s!==pe,c&&(this._$AH=s);else{let d=s,h,_;for(s=n[0],h=0;h<n.length-1;h++)_=ge(this,d[t+h],e,h),_===pe&&(_=this._$AH[h]),c||=!Ie(_)||_!==this._$AH[h],_===p?s=p:s!==p&&(s+=(_??"")+n[h+1]),this._$AH[h]=_}c&&!i&&this.j(s)}j(s){s===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},dt=class extends me{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===p?void 0:s}},pt=class extends me{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==p)}},ht=class extends me{constructor(s,e,t,i,n){super(s,e,t,i,n),this.type=5}_$AI(s,e=this){if((s=ge(this,s,e,0)??p)===pe)return;let t=this._$AH,i=s===p&&t!==p||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,n=s!==p&&(t===p||i);i&&this.element.removeEventListener(this.name,this,t),n&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},ut=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){ge(this,s)}},Rs=_t.litHtmlPolyfillSupport;Rs?.(Pe,Le),(_t.litHtmlVersions??=[]).push("3.3.2");oi=(r,s,e)=>{let t=e?.renderBefore??s,i=t._$litPart$;if(i===void 0){let n=e?.renderBefore??null;t._$litPart$=i=new Le(s.insertBefore(Ce(),n),n,void 0,e??{})}return i._$AI(r),i}});var ft,A,qs,li=w(()=>{Ae();Ae();Ke();Ke();ft=globalThis,A=class extends X{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=oi(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return pe}};A._$litElement$=!0,A.finalized=!0,ft.litElementHydrateSupport?.({LitElement:A});qs=ft.litElementPolyfillSupport;qs?.({LitElement:A});(ft.litElementVersions??=[]).push("4.2.2")});var ci=w(()=>{});var R=w(()=>{Ae();Ke();li();ci()});var pi=w(()=>{});function y(r){return(s,e)=>typeof e=="object"?Fs(r,s,e):((t,i,n)=>{let c=i.hasOwnProperty(n);return i.constructor.createProperty(n,t),c?Object.getOwnPropertyDescriptor(i,n):void 0})(r,s,e)}var zs,Fs,bt=w(()=>{Ae();zs={attribute:!0,type:String,converter:Se,reflect:!1,hasChanged:Ve},Fs=(r=zs,s,e)=>{let{kind:t,metadata:i}=e,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),t==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),t==="accessor"){let{name:c}=e;return{set(d){let h=s.get.call(this);s.set.call(this,d),this.requestUpdate(c,h,r,!0,d)},init(d){return d!==void 0&&this.C(c,void 0,r,d),d}}}if(t==="setter"){let{name:c}=e;return function(d){let h=this[c];s.call(this,d),this.requestUpdate(c,h,r,!0,d)}}throw Error("Unsupported decorator location: "+t)}});function u(r){return y({...r,state:!0,attribute:!1})}var hi=w(()=>{bt();});var ui=w(()=>{});var ve=w(()=>{});var _i=w(()=>{ve();});var gi=w(()=>{ve();});var mi=w(()=>{ve();});var fi=w(()=>{ve();});var vi=w(()=>{ve();});var M=w(()=>{pi();bt();hi();ui();_i();gi();mi();fi();vi()});var yi,bi=w(()=>{yi={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",trigger_removed:"Trigger removed",ok:"OK",all:"All",new_object:"+ New Object",templates_from:"From template",templates_title:"Start from a template",templates_task_count:"{n} tasks",template_created:"Created from template",onboard_hint:"Add your first object to start tracking maintenance.",edit:"Edit",duplicate:"Duplicate",task_duplicated:"Task duplicated",object_duplicated:"Object duplicated",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",missed:"Missed",reset:"Reset",snooze:"Snooze",snoozed:"Snoozed",cancel:"Cancel",bulk_select:"Select",bulk_select_all:"Select all",bulk_n_selected:"{n} selected",bulk_completed:"{n} tasks completed",bulk_archived:"{n} tasks archived",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",runtime_hours:"Target runtime (hours)",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",recurrence_last_day:"Last day of the month",recurrence_business_day:"Business days only (roll back from weekend)",recurrence_offset:"Offset (days, \xB1)",recurrence_offset_help:"Shift the date by \xB1N days, e.g. -2 = two days before.",last_day_month:"Last day of month",last_business_day_month:"Last business day",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",reading:"Reading",custom:"Custom",history:"History",cost:"Cost",report_button:"Report",report_title:"Maintenance report",report_generated:"Generated",report_times_done:"Done",report_total_cost:"Total cost",report_every:"every {n} {unit}",report_notes:"Notes",report_col_type:"Type",report_col_status:"Status",report_col_schedule:"Schedule",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",require_on_completion:"Require on completion",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_optional:"Due at time (optional)",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",notes_markdown_hint:"Markdown is supported \u2014 **bold**, lists, [links](\u2026)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",completed_at_optional:"Completed at (optional, empty = now)",completed_at_pick:"Set date & time",completed_at_future_error:"The completion date cannot be in the future.",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",priority:"Priority",labels:"Labels",labels_placeholder:"e.g. safety, seasonal, tenant-visible",labels_help:"Comma-separated tags for filtering and reporting.",priority_low:"Low",priority_normal:"Normal",priority_high:"High",all_priorities:"All priorities",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",earliest_completion_days:"Earliest completion (days before due)",earliest_completion_days_help:"Leave empty to allow completing any time. 0 = only on/after the due date.",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",all_parts:"All parts",tasks_lower:"tasks",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",trigger_equals:"Trigger when equal to (=)",trigger_not_equals:"Trigger when different from (\u2260)",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",safety_interval:"Safety interval (optional)",trigger_combinator:"Combine trigger and interval",trigger_combinator_any:"Trigger or interval (whichever first)",trigger_combinator_all:"Trigger and interval (both required)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",adaptive_prediction_enabled:"Enable sensor-driven predictions",adaptive_seasonal_enabled:"Enable seasonal awareness",adaptive_max_interval:"Maximum interval (days)",adaptive_min_interval:"Minimum interval (days)",adaptive_ewa_alpha:"Learning rate (alpha)",adaptive_enabled:"Enable adaptive scheduling",adaptive_section_title:"Adaptive Scheduling",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",shared_with:"Shared with (rotation)",shared_with_help:"Pick multiple people to share this task; the responsible person rotates on each completion.",rotation_strategy:"Rotation",rotation_none:"No rotation",rotation_round_robin:"Round-robin",rotation_least_completed:"Least completed",rotation_random:"Random",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_window_7:"7 days",cal_window_14:"14 days",cal_window_30:"30 days",cal_window_365:"1 year",cal_every_n_days:"every {n} days",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",hide_outliers:"Hide outliers (sensor glitches)",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",clear:"Clear",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",no_advanced_features_hint:"Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",completions:"completions",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",compound:"Compound (multiple conditions)",compound_logic_and:"AND \u2014 all conditions must trigger",compound_logic_or:"OR \u2014 any condition triggers",compound_help:"Combine several sensor conditions into one trigger.",compound_no_conditions:"No conditions yet \u2014 add at least one.",compound_add_condition:"Add condition",compound_condition:"Condition",compound_remove_condition:"Remove condition",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_action_style:"Complete button style",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_areas:"Filter by areas",card_filter_areas_help:"Empty = show all areas.",card_filter_priority_help:"Empty = show all priorities. Tasks without an explicit priority count as Normal.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",tab_today:"Today",palette_placeholder:"Search objects and tasks\u2026",palette_no_results:"No matches",palette_hint:"\u2191\u2193 to navigate \xB7 Enter to open \xB7 Esc to close",today_all_caught_up:"All caught up! Nothing due this week.",today_overdue:"Overdue",today_due_today:"Due today",today_this_week:"This week",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_predictions:"Sensor Predictions",feat_predictions_desc:"Predict trigger dates from sensor degradation",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_consumable_threshold:"Consumable low threshold (%)",settings_battery_low_percent:"Battery low threshold (%)",settings_thresholds_hint:"Defaults for new Suggested setups (percent-remaining consumables) and for fleet batteries without their own Battery Notes threshold. Existing tasks keep their value.",bn_summary:"{name}: {pct} % for {n} batteries",bn_floor_decides:"Your {floor} % floor decides for all of them; the higher of the two thresholds counts per battery.",bn_above_floor:"That is above your {floor} % floor, so {name} decides for all noted batteries.",bn_overrides:"{n} devices with their own threshold:",bn_more:"+ {n} more",settings_row_actions:"Task row actions",row_actions_buttons_compact:"Buttons (icons only on phones)",row_actions_buttons:"Buttons with text",row_actions_icons:"Icons (classic)",row_actions_follow:"Follow the household setting",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",settings_shopping_list:"Shopping list (buy tasks)",settings_shopping_list_help:"Low-part buy reminders appear in this to-do list; checking one off restocks the part.",shopping_list_none:"Off \u2014 no shopping list",settings_install_assist_sentences:"Install Assist sentences",settings_install_assist_sentences_hint:"Copies the voice sentences into your configuration so the classic Assist agent recognises them. A file you edited yourself is never overwritten.",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",notify_per_person:"Per-person delivery",notify_no_own_device:"No own device \u2014 uses the household service",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_reminder_leads:"Extra reminders (days before due)",settings_reminder_leads_hint:"Comma-separated lead times, e.g. 14, 3, 0 \u2014 one extra reminder fires on each matching day. Empty = off.",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_weekly_digest:"Weekly digest",settings_weekly_digest_hint:"A single summary notification on Monday morning when tasks are due.",settings_warranty_reminder:"Warranty expiry reminder",settings_warranty_reminder_days:"Days before expiry",settings_warranty_reminder_hint:"Notify once when an object's warranty is this many days from expiring.",settings_snooze_hours:"Snooze duration (hours)",settings_budget:"Budget",settings_currency:"Currency",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_export_settings:"Export settings (JSON)",settings_import_csv:"Import CSV",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",settings_export_selection:"Limit to selected objects (optional)",settings_docs_archive:"Documents archive (with files)",settings_docs_archive_hint:"The JSON/YAML/CSV exports carry settings only. This ZIP includes the uploaded file contents so a restore is complete.",settings_docs_export_btn:"Download documents ZIP",settings_docs_import_btn:"Restore documents ZIP",settings_docs_import_success:"Restored: {blobs} files, {docs} documents",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",groupby_object:"By object",filter_label:"Filter",user_label:"User",photo_label:"Photo",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",for_minutes_state_help:"0 counts every change immediately. Set minutes and the new state must hold that long first \u2014 brief flickers then neither trigger nor count.",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",group_delete_confirm:'Delete group "{name}"?',groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else sees only Complete and Skip.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc:"Per-task HA action on complete + quick-complete QR with pre-set values.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_service:"Service",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",quick_complete_defaults_title:"Quick-complete defaults (for QR scans, optional)",quick_complete_defaults_desc:"Pre-set values for quick-complete QR scans. Without these, the QR opens the complete dialog.",quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026",archive:"Archive",undo:"Undo",task_archived:"Task archived",object_archived:"Object archived",unarchive:"Unarchive",archived:"Archived",show_archived:"Show archived",hide_archived:"Hide archived",confirm_archive_object:"Archive this object and its tasks? They keep their history and can be unarchived later.",settings_archive:"Archive & Retention",settings_archive_desc:"Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",settings_archive_oneoff_days:"Auto-archive completed one-off tasks after (days, 0 = off)",settings_delete_archived_oneoff_days:"Auto-delete archived one-off tasks after (days, 0 = never)",archive_object:"Archive object",unarchive_object:"Unarchive object",documents:"Documents",documents_empty:"No documents yet.",doc_upload:"Upload file",doc_uploading:"Uploading\u2026",doc_add_link:"Add link",doc_link_url:"URL (https://\u2026)",doc_link_title:"Title (optional)",doc_open:"Open",doc_delete_confirm:'Delete "{name}"?',doc_too_large:"File is too large (max 25 MB).",doc_upload_failed:"Upload failed.",completion_photo_optional:"Completion photo (optional)",add_photo:"Add photo",uploading:"Uploading\u2026",remove:"Remove",doc_deduped:"Already stored elsewhere \u2014 shared, no extra space used.",doc_dup_in_object:"This file is already attached to this object.",doc_link_invalid:"Only http/https links are allowed.",doc_cat_manual:"Manual",doc_cat_warranty:"Warranty",doc_cat_invoice:"Invoice",doc_cat_spare_parts:"Spare parts",doc_cat_photo:"Photo",doc_cat_other:"Other",doc_link_badge:"Link",doc_storage_title:"Document storage",doc_storage_saved:"Saved via deduplication",doc_storage_refresh:"Refresh",doc_download:"Download",doc_close:"Close",doc_camera:"Take photo",doc_drop_hint:"Drop files here",doc_task_none:"No documents linked to this task.",doc_link_existing:"Link a document\u2026",doc_attach:"Link",doc_unlink:"Unlink",doc_page:"Page",chart_range_7d:"7d",chart_range_30d:"30d",chart_range_90d:"90d",chart_range_1y:"1y",chart_since_service:"since last service",chart_no_stats:"No long-term statistics for this entity \u2014 showing maintenance-event values only",auto_complete_on_recovery:"Auto-complete when the sensor recovers",auto_complete_on_recovery_help:"Records a completion (sets last performed) when the trigger clears itself \u2014 e.g. salt refilled, filter replaced.",doc_search:"Search documents\u2026",doc_search_none:"No matching documents",link_device_optional:"Link to existing device (optional)",parent_object_optional:"Parent object (optional)",parent_none:"(No parent)",paused:"Paused",pause_object:"Pause",resume_object:"Resume",pause_until_prompt:"Freeze this object's schedules \u2014 nothing becomes due and nothing notifies until it is resumed. Optionally set an auto-resume date.",pause_until_label:"Resume on (optional)",object_paused:"Object paused",object_resumed:"Object resumed \u2014 schedules restarted",object_paused_badge:"Paused",paused_until_label:"until",replace_object:"Replace\u2026",replace_object_prompt:"Retire this object and create a successor. History and costs stay archived on the old one; tasks and documents carry over to the new one, counters start fresh.",replace_name_label:"Successor name",object_replaced:"Object replaced \u2014 successor created",reading_unit_label:"Reading unit (e.g. kWh, m\xB3)",reading_unit_help:"Shown next to the recorded value when completing this task.",reading_value_label:"Reading value",reading_label:"Reading",settings_templates_label:"Template gallery",settings_templates_hint:`Untick templates you'll never need \u2014 they disappear from the "From template" pickers (panel and config flow). Nothing else changes; you can re-enable them any time.`,worksheet:"Work sheet",worksheet_scan_view:"Scan to open the task",worksheet_scan_complete:"Scan to complete",worksheet_manual_excerpt:"Manual excerpt",worksheet_pages:"pages",worksheet_printed:"Printed",worksheet_never:"Never",card_all_caught_up:"All caught up \u2014 nothing needs attention",postpone:"Postpone",postpone_date_prompt:"Postpone this occurrence to which date?",postpone_date_label:"New due date",postponed:"Postponed",postponed_to:"Postponed to",season_window_label:"Seasonal window (months)",season_window_hint:"Only due in the selected months; off-season dates roll to the next active month. None = all year.",series_end_label:"Ends",series_end_never:"Never (repeats indefinitely)",series_end_after_count:"After a number of times",series_end_until:"On a date",series_end_count_label:"Number of times",series_end_until_label:"End date",parts_section:"Parts & consumables",parts_inventory_value:"Inventory value",part_add:"Add part",part_name:"Name",part_vendor:"Manufacturer",part_storage_location:"Storage location",part_product_url:"Product URL",part_unit:"Unit",part_cost:"Unit price",part_stock:"Stock",part_reorder_threshold:"Reorder at",part_restock_quantity:"Restock quantity",part_auto_buy:"Auto-create buy task when low",part_restock:"Adjust stock",parts_used_by:"Used by",restock_quantity_label:"Quantity bought",consumes_parts_label:"Consumes parts",shared_parts_other_objects:"Parts from other objects",shared_parts_help:"Several objects can share one stock. Completing this task takes from the owning object.",shared_part_unknown:"Unknown part",parts_load_failed:"Couldn't load this object's parts \u2014 the consumes-parts options are unavailable right now.",adopt_problem_button:"Adopt problem sensors",adopt_problem_title:"Adopt problem sensors",adopt_problem_hint:"Turn HA problem sensors (printer errors, filter warnings, low battery) into maintenance tasks that trigger while the problem is active and clear themselves when it resolves.",adopt_problem_none:"No problem sensors found that aren't already tracked.",adopt_problem_active:"active",adopt_problem_ok:"ok",adopt_problem_new_object:"(new)",adopt_problem_adopt:"Adopt selected",adopt_problem_done:"Adopted {tasks} problem sensor(s)",views_label:"Views",views_none:"\u2014 No view \u2014",views_manage:"Save / manage views",views_dialog_title:"Saved views",views_dialog_hint:"Save the current filters as a named view everyone can reuse.",views_name_placeholder:"View name",views_save_current:"Save current filters",views_none_yet:"No saved views yet.",close:"Close",trigger_hint_now:"The sensor reads {value} right now.",trigger_hint_above:"The task triggers once it rises above {target}.",trigger_hint_below:"It triggers once it falls below {target}.",trigger_hint_overlap:"These limits overlap: every reading triggers the task and it can never recover. Leave one of them empty.",trigger_hint_counter_delta:"Counts from the current reading ({value}): due at {due} (+{target}), and the count restarts after each completion.",trigger_hint_counter_delta_edit:"Counts usage since the last completion: due after +{target}; the count restarts after each completion.",trigger_hint_counter_abs:"The task becomes due once the sensor reaches {target}.",trigger_hint_runtime:"The task becomes due after {hours} h of accumulated on-time; the counter restarts after each completion.",trigger_hint_state_change:"The task becomes due after {count} state change(s).",trigger_hint_state_change_to:"The task becomes due after {count} change(s) to \u201C{state}\u201D.",trigger_hint_state_now:"Current state: {value}.",adopt_problem_part:"Uses part: {name}",label_filter:"Label",all_labels:"All labels",settings_notify_scope:"Notify only for view",settings_notify_scope_all:"All tasks",settings_notify_scope_hint:"Only tasks matching the selected saved view's label/user filters send reminders. Status, sorting and grouping of the view are ignored here.",card_saved_view:"Saved view",card_saved_view_none:"None",card_saved_view_help:"Applies the view's status, user and label filters on top of the filters above. The view's sorting and grouping are panel display settings and are not applied on the card.",doc_part_none:"No documents linked to this part.",settings_templates_toggle_group:"Enable or disable all templates in this group",setups_button:"Suggested setups",setups_title:"Suggested setups (Beta)",setups_hint:"Devices of supported integrations whose consumable sensors can drive maintenance tasks. Adopting creates the object and wires each task to its sensor \u2014 it triggers when the consumable runs low and resolves itself after replacement.",setups_none:"No supported devices with unwired consumable sensors found.",setups_adopt:"Set up selected",setups_done:"{tasks} sensor-wired tasks created.",complete_parts_used:"Parts used this time",part_delete_confirm:"Delete part '{name}'? Its stock tracking, task links and any open buy reminder will be removed.",baseline_start_value:"Start reading (optional)",baseline_start_help:"Counting starts from this reading. Leave empty to count from the current value; enter the reading at the last service so usage since then already counts.",setups_baseline_hint:"reading at last service (optional)",baseline_start_help_edit:"Leave empty to keep the existing counting. Entering a value re-anchors the counting (e.g. the reading at the last service).",baseline_current_effective:"Currently effective start value: {value}",runtime_on_states:"Active states",runtime_on_states_help:"States that count as running \u2014 default: on. E.g. mowing, cleaning, printing. With an attribute selected, its values are matched instead.",runtime_max_session:"Max session runtime (seconds)",runtime_max_session_help:"A single run counts at most this many seconds \u2014 protects against a sensor stuck ON (lost connection, restart). Empty = no cap.",trend_approaching:"Heading toward the threshold",trend_easing:"Easing away from the threshold",split_select_hint:"Select a task to see its details here",setups_target_new:"Create new: {name}",schedule_preview_title:"Next dates",schedule_preview_ontime:"Assuming on-time completion.",schedule_preview_ends:"(series ends)",adopt_problem_responsible:"Responsible user for all adopted tasks (optional)",adopt_for_minutes_hint:"Only trigger once the problem has persisted this long \u2014 0 reacts to the first flicker.",adopt_problem_configure:"Configure",history_auto:"Automatic",battery_fleet_title:"Battery fleet",battery_fleet_none_low:"All batteries OK \u2014 nothing to replace.",battery_fleet_buy_now:"Buy now",battery_fleet_soon:"Needed soon",battery_fleet_soon_hint:"Predicted from the last replacement date \u2014 order ahead.",battery_fleet_mark_all:"Mark all replaced",battery_fleet_mark_one:"Mark this battery replaced",battery_fleet_offline:"offline",battery_fleet_trigger_lost:"This task's sensor trigger was lost \u2014 it will not fire or auto-complete.",battery_fleet_repair:"Repair",battery_fleet_exclude:"Exclude from the fleet",battery_fleet_excluded:"Excluded",battery_fleet_include:"Track again",battery_fleet_all:"All tracked batteries",battery_fleet_all_hint:"Exclude a device here to drop it from the fleet before it ever reports low \u2014 a vacuum that recharges itself, or a phone that warns you on its own.",battery_fleet_add:"Add a battery",battery_fleet_add_hint:"Pick a battery sensor the automatic discovery missed \u2014 it joins the roster immediately.",battery_fleet_track_self:"Track self-charging batteries",battery_fleet_track_self_hint:"Phones, vacuums and other devices that recharge themselves appear as rechargeables \u2014 a low one asks for a charge, never for new cells.",battery_fleet_status_low:"Low",battery_fleet_status_soon:"Soon",battery_fleet_status_ok:"Healthy",battery_fleet_predicted_on:"Expected around {date}",battery_fleet_predicted_trend:"Predicted from this battery's discharge trend: around {date} ({confidence})",battery_fleet_rechargeable:"Rechargeable: charge instead of replacing \u2014 never on the shopping list",battery_fleet_sort_name:"Sort by name",battery_fleet_sort_urgency:"Sort by urgency",battery_fleet_mark_recharged:"Mark as recharged",battery_fleet_sparkline_hint:"Battery level over the last 30 days \u2014 dotted: projected until the low threshold",battery_fleet_filter_type:"Show only this battery type",battery_fleet_record_replacement:"The level jumped around {date} \u2014 record this replacement in Battery Notes",battery_fleet_total:"{n} batteries tracked",battery_fleet_setup_button:"Battery fleet",battery_fleet_setup_done:"Battery fleet set up \u2014 one task tracks all your batteries.",update_banner:"A newer version of Maintenance Supporter is on the server \u2014 reload to update the panel.",update_reload:"Reload",row_actions_banner:"Complete and Skip in task rows are now buttons. Prefer the old icons?",row_actions_keep:"Keep buttons",row_actions_back:"Back to icons",battery_fleet_forecast_overdue:"Predicted date passed \u2014 the battery still reports healthy. If you swapped it, record the replacement; otherwise the forecast was off.",cost_from_parts:"Use \u2248 {amount} from parts",dismiss:"Dismiss",gs_label:"Getting started \u2014 these hints retire as your setup grows",gs_setups_chip:"Suggested setups found {n} devices with pre-wired triggers",gs_adopt_chip:"{n} problem sensors can become maintenance tasks",gs_fleet_chip:"One click sets up the battery fleet",cal_editor_window:"Default window",cal_editor_window_week:"Week (7 days)",cal_editor_window_fortnight:"Fortnight (14 days)",cal_editor_window_month:"Month (30 days, default)",cal_editor_window_year:"Year (365 days, empty days collapsed)",cal_editor_show_chips:"Show window chips inside the card",cal_editor_chips_hint:"Hide the chips when the card is embedded in a strategy view that already serves as the window selector.",cal_editor_show_user_filter:"Show user filter dropdown",cal_editor_default_user:"Default user filter",cal_editor_my_tasks:"My tasks (current user)",cal_editor_show_object_filter:"Show object filter dropdown",cal_editor_object_hint:'Pre-select one object via YAML: object_filter: "<object name>" \u2014 or a list of names to restrict the card to several objects.',object_history_section:"History (all tasks)",object_history_all_tasks:"All tasks",object_history_empty:"No entries in this range.",object_history_cap_note:"History keeps up to 500 entries per task \u2014 very old entries may be missing.",service_record_title:"Service record",service_record_print:"Service record (PDF)",date:"Date",service_record_entries:"entries",completed_by:"Completed by",date_from:"From",date_to:"To",phases_section:"Cycle phases (optional)",phases_hint:"Different work on one shared schedule \u2014 each completion moves to the next step (e.g. small service, small service, big service).",phase_add:"Add phase",phase_name:"Phase name",phase_sequence_label:"Cycle order",phase_sequence_add_step:"Add step",phase_current:"Current phase",phase_set:"Set as current",chart_history_fallback:"No long-term statistics for this entity \u2014 showing recorder state history (typically the last ~10 days)",chart_history_alarm:"Trigger view from recorder state history: 1 = alert state held for the hold time, 0 = fine (typically the last ~10 days)",chart_history_count:"Change count rebuilt from recorder state history since the last service (typically the last ~10 days)",prediction_cycles:"Learned from cycles",phase_require_override:"Override \u201CRequire on completion\u201D for this phase",history_add_past:"Add past completion",require_tag_scan:"Only complete by scanning the tag",require_tag_scan_help:"Proof of presence: Done is blocked on every surface until the NFC tag or QR code on the thing itself is scanned. Automations can pass 'via_tag_scan' to the complete service.",disallow_skip:"Don't allow skipping",disallow_skip_help:"The Skip action disappears from every surface, and the server refuses a skip from automations and voice too.",require_tag_scan_hint:"This task completes only by scanning its NFC tag or QR code on the thing itself \u2014 saving here will be refused."}});var xi,wi=w(()=>{"use strict";xi="2.74.0"});var he,$i=w(()=>{"use strict";he={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"var(--deep-orange-color, #ff5722)",archived:"var(--disabled-color, #9e9e9e)",paused:"var(--info-color, #2196f3)"}});function Bs(r){ue.en=Object.assign({},r,ue.en??{})}function Ne(r){let s=(r||yt).toLowerCase();return s.startsWith("pt")&&s.endsWith("br")?"pt-br":s.substring(0,2)}function a(r,s){let e=Ne(s);return ue[e]?.[r]??ue.en[r]??r}function Qe(r,s){s.has("hass")&&wt(r.hass?.locale,r.hass?.config?.country);let e=r.hass?.language;e&&!xt(e)&&He(e).then(()=>r.requestUpdate())}function N(r){return r?.language||"en"}function xt(r){let s=Ne(r);return s===yt||s in ue}function He(r){let s=Ne(r);return s===yt||s in ue||!Vs.has(s)?Promise.resolve():(s in qe||(qe[s]=fetch(`${Ws}/${s}.json?v=${xi}`).then(e=>e.ok?e.json():null).then(e=>{e?ue[s]=e:delete qe[s]}).catch(()=>{delete qe[s]})),qe[s])}function Ei(r){let s=Ne(r);return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN",da:"da-DK",fi:"fi-FI",nb:"nb-NO",ja:"ja-JP",hi:"hi-IN",pl:"pl-PL",cs:"cs-CZ",sv:"sv-SE","pt-br":"pt-BR",hu:"hu-HU",ko:"ko-KR",tr:"tr-TR"}[s]??"en-US"}function wt(r,s){r&&(ee.date=r.date_format,ee.time=r.time_format,ee.number=r.number_format,s!==void 0&&(ee.country=s||void 0))}function Ys(r){switch(ee.number){case"comma_decimal":return["en-US","en"];case"decimal_comma":return["de","es","it"];case"space_comma":return["fr","sv","cs"];case"system":return;default:return Ei(r)}}function D(r,s,e){if(!Number.isFinite(r))return String(r);let t=typeof e=="number"?{minimumFractionDigits:e,maximumFractionDigits:e}:{maximumFractionDigits:2,...e};if(ee.number==="none"){let i=Math.pow(10,t.maximumFractionDigits??2);return String(Math.round(r*i)/i)}try{return new Intl.NumberFormat(Ys(s),t).format(r)}catch{return new Intl.NumberFormat(void 0,t).format(r)}}function Si(r,s,e,t=2){let i=D(r,e,t);return s?`${i} ${s}`:i}function be(r){let s=Ei(r),e=ee.country;if(e&&/^[A-Za-z]{2}$/.test(e)){let t=`${Ne(r).split("-")[0]}-${e.toUpperCase()}`;try{return new Intl.DateTimeFormat(t),t}catch{}}return s}function Ai(r,s){let e=String(r.getDate()).padStart(2,"0"),t=String(r.getMonth()+1).padStart(2,"0"),i=String(r.getFullYear());switch(ee.date){case"DMY":return`${e}/${t}/${i}`;case"MDY":return`${t}/${e}/${i}`;case"YMD":return`${i}-${t}-${e}`;case"system":return r.toLocaleDateString(void 0,{day:"2-digit",month:"2-digit",year:"numeric"});default:return r.toLocaleDateString(be(s),{day:"2-digit",month:"2-digit",year:"numeric"})}}function Ti(r,s){switch(ee.time){case"12":return r.toLocaleTimeString(be(s),{hour:"2-digit",minute:"2-digit",hour12:!0});case"24":return r.toLocaleTimeString(be(s),{hour:"2-digit",minute:"2-digit",hour12:!1});case"system":return r.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});default:return r.toLocaleTimeString(be(s),{hour:"2-digit",minute:"2-digit"})}}function W(r,s){if(!r)return"\u2014";try{let e=r.includes("T")?r:r+"T00:00:00";return Ai(new Date(e),s)}catch{return r}}function Ci(r,s){if(!r)return"\u2014";try{let e=new Date(r);return Ai(e,s)+" "+Ti(e,s)}catch{return r}}function $t(r,s){if(r==null)return"\u2014";let e=s||"en";return r<0?`${Math.abs(r)} ${a("d_overdue",e)}`:r===0?a("today",e):`${r} ${a(r===1?"day":"days",e)}`}function Ge(r,s,e){return r==null?"\u2014":`${r} ${a("unit_"+(s||"days"),e)}`}function je(r,s,e="long"){return new Date(Date.UTC(2024,0,1+r)).toLocaleDateString(be(s),{weekday:e,timeZone:"UTC"})}function Ii(r,s,e="long"){return new Date(Date.UTC(2024,r,1)).toLocaleDateString(be(s),{month:e,timeZone:"UTC"})}function Pi(r,s){let e=r.schedule,t=e?.offset?` ${e.offset>0?"+":"\u2212"}${Math.abs(e.offset)}d`:"";switch(e?.kind){case"weekdays":return((e.weekdays||[]).map(i=>je(i,s,"short")).join(" & ")||"\u2014")+t;case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?a("ord_last",s):a("ord_"+e.nth,s)} ${je(e.weekday,s,"long")}${t}`;case"day_of_month":return e.day==null?"\u2014":(e.day===-1?a(e.business?"last_business_day_month":"last_day_month",s):`${a("day_word",s)} ${e.day}`)+t;case"one_time":return r.due_date?W(r.due_date,s):a("one_time",s);case"manual":return a("manual",s);case"interval":return Ge(e.every,e.unit,s)}return r.schedule_type==="one_time"?r.due_date?W(r.due_date,s):a("one_time",s):r.schedule_type==="manual"?a("manual",s):r.schedule_type==="sensor_based"?a("sensor_based",s):r.interval_days!=null?Ge(r.interval_days,r.interval_unit,s):"\u2014"}function Li(r,s){r.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:s},bubbles:!0,composed:!0}))}var yt,ki,ue,Vs,Ws,qe,Ks,ee,Ri,Je,q=w(()=>{"use strict";R();bi();wi();$i();yt="en",ki=(()=>{let r=window;return r.__msLocales||(r.__msLocales={store:{},inflight:{}}),r.__msLocales})(),ue=ki.store;Bs(yi);Vs=new Set(["de","nl","fr","it","es","pt","pt-br","ru","uk","pl","cs","sv","zh","da","fi","nb","ja","hi","hu","ko","tr"]),Ws="/maintenance_supporter_locales",qe=ki.inflight;Ks=window,ee=Ks.__msDateTimePrefs??={};Ri=T`
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
`,Je=T`
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

    .stats-bar { gap: 8px; padding: 12px; }
    /* min-width: 0 (NOT a fixed floor) — a fixed min-width re-enables the
       grid's auto minimum, so the 5 KPI tracks couldn't shrink below their
       label text and the last KPI clipped off-screen on phones (the header
       only *looked* cut — .content scrolls sideways, but nothing hints so).
       With 0 the tracks compress and the labels wrap to a second line. */
    .stat-item { min-width: 0; }
    .stat-item.clickable { padding: 4px 4px; }
    .stat-item .stat-label { font-size: 11px; white-space: normal; text-align: center; line-height: 1.2; }
    .stat-value { font-size: 20px; }
  }
`});function qi(r,s,e){let t=new Blob([r],{type:e}),i=URL.createObjectURL(t),n=document.createElement("a");n.href=i,n.download=s,n.target="_blank",n.rel="noopener",n.style.display="none",document.body.appendChild(n),n.dispatchEvent(new MouseEvent("click")),document.body.removeChild(n),setTimeout(()=>URL.revokeObjectURL(i),6e4)}var kt=w(()=>{"use strict"});function Ze(r){return!!r&&/^https?:\/\//i.test(r)}var Et=w(()=>{"use strict"});var ye,St=w(()=>{"use strict";ye=class{constructor(s){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=s}updateHass(s){this.hass=s}async getUsers(s=!1){let e=Date.now();if(!s&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(s,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:s,task_id:e,user_id:t})}async getTasksByUser(s){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:s})).tasks}getUserName(s){return!s||!this.usersCache?null:this.usersCache.find(t=>t.id===s)?.name||null}getUser(s){return!s||!this.usersCache?null:this.usersCache.find(e=>e.id===s)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(s){return s?s===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}}});function Js(r,s){if(s<=0)return 0;let e=typeof r=="number"&&Number.isFinite(r)?Math.trunc(r):0;return e<0?0:e%s}function Zs(r){return!!(r?.phases&&r.phase_sequence&&r.phase_sequence.length>0)}function At(r){if(!r||!Zs(r))return null;let s=r.phase_sequence,e=Js(r.phase_cursor,s.length),t=s[e],i=r.phases?.[t];return i?{id:t,name:i.name,index:e,count:s.length,notes:i.notes,checklist:i.checklist!==void 0?i.checklist:r.checklist??[],consumesParts:i.consumes_parts!==void 0?i.consumes_parts:r.consumes_parts??[],requiredFields:i.required_completion_fields!==void 0?i.required_completion_fields:r.required_completion_fields??[]}:null}function ne(r){let s=At(r);return s?`${s.index+1}/${s.count} \xB7 ${s.name}`:""}var et=w(()=>{"use strict"});function G(r){return`${r.entry_id??""}\0${r.part_id}`}function Ni(r,s,e,t){let i=!!r.entry_id&&r.entry_id!==s,n=i?r.entry_id:s,c=e.find(f=>f.entry_id===n),d=(c?.parts||[]).find(f=>f.id===r.part_id)||null,h=i&&c?.object?.name||"",_=d?.name||a("shared_part_unknown",t);return{part:d,foreign:i,ownerName:h,label:h?`${_} (${h})`:_}}function Hi(r,s,e,t){let{part:i,label:n}=Ni(r,s,e,t),c=i&&i.stock!==null&&i.stock!==void 0?` (${i.stock}${i.unit?" "+i.unit:""})`:"",d=i?.storage_location?` \u2014 ${i.storage_location}`:"";return`${r.quantity}\xD7 ${n}${c}${d}`}function Oi(r,s,e,t){let n=(e.find(d=>d.entry_id===s)?.parts||[]).map(d=>({...d})),c=new Set(n.map(d=>G({part_id:d.id})));for(let d of r?.consumes_parts||[]){if(!d.entry_id||d.entry_id===s)continue;let h=G(d);if(c.has(h))continue;c.add(h);let{part:_,ownerName:f}=Ni(d,s,e,t);n.push({id:d.part_id,name:_?.name||a("shared_part_unknown",t),unit:_?.unit,stock:_?.stock??null,storage_location:_?.storage_location,entry_id:d.entry_id,owner_name:f})}return n}var tt=w(()=>{"use strict";q()});function Oe(r){let s=r.task??null,e=s?At(s):null,t=e?e.consumesParts:s?.consumes_parts||[],i=!!s?.part_ref,n=r.objects.find(h=>h.entry_id===r.entryId)?.parts||[],c=i?n.find(h=>h.id===s.part_ref.part_id):void 0,d=r.checklistsEnabled??!0;return{entry_id:r.entryId,task_id:r.taskId,task_name:r.taskName,checklist:e?d?e.checklist:[]:r.checklist??[],adaptive_enabled:!!r.adaptiveEnabled,required_completion_fields:e?e.requiredFields:s?.required_completion_fields||[],task_type:s?.type||"",reading_unit:s?.reading_unit||"",parts:i?[]:Oi({consumes_parts:t},r.entryId,r.objects,r.lang),consumes_parts:i?[]:t,phase_label:e?ne(s):"",require_tag_scan:!!s?.require_tag_scan,restock_default:i?c?.restock_quantity??1:null,restock_unit_cost:i?c?.cost??null:null,currency_symbol:r.currencySymbol??"",consumes_info:t.map(h=>Hi(h,r.entryId,r.objects,r.lang)),checklist_prefill:s?.checklist_progress||{},via_tag_scan:!!r.viaTagScan}}function De(r,s,e){r.entryId=s.entry_id,r.taskId=s.task_id,r.taskName=s.task_name,r.lang=e,r.checklist=s.checklist??[],r.adaptiveEnabled=!!s.adaptive_enabled,r.requiredFields=s.required_completion_fields??[],r.taskType=s.task_type??"",r.readingUnit=s.reading_unit??"",r.parts=s.parts??[],r.consumesParts=s.consumes_parts??[],r.phaseLabel=s.phase_label??"",r.requireTagScan=!!s.require_tag_scan,r.restockDefault=s.restock_default??null,r.restockUnitCost=s.restock_unit_cost??null,r.currencySymbol=s.currency_symbol??"",r.consumesInfo=s.consumes_info??[],r.checklistPrefill=s.checklist_prefill??{},r.viaTagScan=!!s.via_tag_scan,r.open({viaTagScan:!!s.via_tag_scan})}var it=w(()=>{"use strict";tt();et()});function tr(r,s){let e=er[r];if(!e)return r;let t=a(e,s);return t&&t!==e?t:r}function ir(r){let e=r.match(/data\['([^']+)'\]/)?.[1],t;return(t=r.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=r.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=r.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=r.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(r)?{field:e,rule:"required"}:(t=r.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(r)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(r)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function C(r,s,e){if(e=e??a("action_error",s),typeof r=="string")return r;if(typeof r!="object"||r===null)return e;let t=r,i=t.message||t.error?.message||"";if(!i)return e;let n=ir(i),c=n.field?tr(n.field,s):"",d=h=>a(h,s).replace("{field}",c).replace("{n}",n.param??"");switch(n.rule){case"too_long":return d("err_too_long");case"too_short":return d("err_too_short");case"value_too_high":return d("err_value_too_high");case"value_too_low":return d("err_value_too_low");case"required":return d("err_required");case"wrong_type":return d("err_wrong_type").replace("{type}",n.param??"");case"invalid_choice":return d("err_invalid_choice");case"invalid_value":return d("err_invalid_value");default:return i||e}}var er,oe=w(()=>{"use strict";q();er={entry_id:"object",name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",group_name:"name",group_description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_equals:"trigger_equals",trigger_not_equals:"trigger_not_equals",trigger_for_minutes:"trigger_for_minutes"}});var Tt,Me,Ct=w(()=>{"use strict";Tt=["notes","cost","duration","photo","user"],Me={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"}});function sr(r,s){if(s)switch(r){case"date":return s.split("T")[0];case"time":return s.length===5?`${s}:00`:s;case"datetime":{let[e,t="00:00:00"]=s.split("T");return`${e} ${t.length===5?`${t}:00`:t}`}}}function rr(r,s){if(typeof s!="string"||!s)return"";switch(r){case"date":return s.slice(0,10);case"time":return s.slice(0,5);case"datetime":{let[e,t="00:00:00"]=s.split(" ");return`${e}T${t.length===5?`${t}:00`:t}`}}}var F,xe=w(()=>{"use strict";R();M();q();F=class extends A{constructor(){super(...arguments);this.kind="date";this.label="";this.value="";this.clearable=!1;this.disabled=!1;this.required=!1;this.lang="en"}_selector(){switch(this.kind){case"date":return{date:{}};case"time":return{time:{no_second:!0}};case"datetime":return{datetime:{}}}}_onSelectorChange(e){e.stopPropagation(),this._emit(rr(this.kind,e.detail?.value))}_clear(){this._emit("")}_emit(e){e!==this.value&&(this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}})))}render(){return o`
      <div class="field">
        ${this.label?o`<span class="label">${this.label}${this.required?o`<span class="req">*</span>`:p}</span>`:p}
        <div class="row">
          <ha-selector
            .hass=${this.hass}
            .selector=${this._selector()}
            .value=${sr(this.kind,this.value)}
            .required=${this.required}
            .disabled=${this.disabled}
            @value-changed=${this._onSelectorChange}
          ></ha-selector>
          ${this.clearable&&this.value&&!this.disabled?o`<button type="button" class="clear" title=${a("clear",this.lang)} aria-label=${a("clear",this.lang)} @click=${this._clear}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>`:p}
        </div>
        ${this.helper?o`<span class="helper">${this.helper}</span>`:p}
      </div>
    `}};F.styles=T`
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
  `,l([y({attribute:!1})],F.prototype,"hass",2),l([y()],F.prototype,"kind",2),l([y()],F.prototype,"label",2),l([y()],F.prototype,"value",2),l([y()],F.prototype,"helper",2),l([y({type:Boolean})],F.prototype,"clearable",2),l([y({type:Boolean})],F.prototype,"disabled",2),l([y({type:Boolean})],F.prototype,"required",2),l([y()],F.prototype,"lang",2);customElements.get("ms-date-field")||customElements.define("ms-date-field",F)});var k,It=w(()=>{"use strict";R();M();q();oe();tt();Ct();xe();k=class extends A{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.restockDefault=null;this.restockUnitCost=null;this.currencySymbol="";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photoDocId="";this._photoPreview="";this._photoUploading=!1;this._readingValue="";this._restockQty="";this._completedAt="";this._usedParts={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((t,i)=>[String(i),!!this.checklistPrefill[t]]).filter(([,t])=>t)),this._feedback="needed",this._photoDocId="",this._photoPreview="",this._photoUploading=!1,this._readingValue="",this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(t=>[G(t),{...t}])))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _onPhotoInput(e){let t=e.target,i=t.files?.[0];if(t.value="",!!i){this._photoUploading=!0,this._error="";try{let n=new FormData;n.append("entry_id",this.entryId),n.append("tags","photo"),n.append("file",i,i.name);let c=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:n});if(!c.ok){this._error=c.status===413?a("doc_too_large",this.lang):a("doc_upload_failed",this.lang);return}let d=await c.json();d.id&&(this._photoDocId=d.id,this._photoPreview=URL.createObjectURL(i))}catch{this._error=a("doc_upload_failed",this.lang)}finally{this._photoUploading=!1}}}_removePhoto(){this._photoPreview&&URL.revokeObjectURL(this._photoPreview),this._photoDocId="",this._photoPreview=""}async _complete(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}if(this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photoDocId&&(e.photo_doc_id=this._photoDocId),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=a("completed_at_future_error",this.lang),this._loading=!1;return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this._readingValue!==""){let t=parseFloat(this._readingValue);isNaN(t)||(e.reading_value=t)}if(this.restockDefault!==null&&this._restockQty!==""){let t=parseFloat(this._restockQty);!isNaN(t)&&t>=1&&(e.restock_quantity=t)}this.parts.length>0&&(e.used_parts=Object.values(this._usedParts).filter(t=>Number.isFinite(t.quantity)&&t.quantity>0).map(t=>t.entry_id?{part_id:t.part_id,quantity:t.quantity,entry_id:t.entry_id}:{part_id:t.part_id,quantity:t.quantity})),await this.hass.connection.sendMessagePromise(e),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=C(e,this.lang,a("save_error",this.lang))}finally{this._loading=!1}}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photoDocId!=="",user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_req(e){return this.requiredFields.includes(e)?o`<span class="req-mark" aria-hidden="true">*</span>`:p}_partsCostSuggestion(){if(this.restockDefault!==null){let i=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(i)||i<=0?null:Math.round(this.restockUnitCost*i*100)/100}if(!this.parts.length)return null;let e=0,t=!1;for(let i of Object.values(this._usedParts)){let n=this.parts.find(c=>G({part_id:c.id,entry_id:c.entry_id})===G(i));n?.cost!=null&&(e+=n.cost*(i.quantity||1),t=!0)}return t?Math.round(e*100)/100:null}_renderCostSuggestion(e){if(this._cost.trim()!=="")return p;let t=this._partsCostSuggestion();if(t==null||t<=0)return p;let i=Si(t,this.currencySymbol,e);return o`<button
      type="button"
      class="cost-suggestion"
      @click=${()=>this._cost=String(Math.round(t*100)/100)}
    >${a("cost_from_parts",e).replace("{amount}",i)}</button>`}_close(){this._open=!1}_pickCompletedAt(){let e=new Date,t=i=>String(i).padStart(2,"0");this._completedAt=`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}:00`}render(){if(!this._open)return o``;let e=this.lang||this.hass?.language||"en";return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${a("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?o`<div class="phase-line">${a("phase_current",e)}: ${this.phaseLabel}</div>`:p}
        ${this.requireTagScan&&!this.viaTagScan?o`<div class="scan-required-note">${a("require_tag_scan_hint",e)}</div>`:p}
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:p}
          ${this.checklist.length>0?o`
            <div class="checklist-section">
              <label class="checklist-label">${a("checklist",e)}</label>
              ${this.checklist.map((t,i)=>o`
                <label class="checklist-item" @click=${()=>this._toggleCheck(i)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(i)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:p}
          ${this.taskType==="reading"?o`
              <label class="field">
                <span class="field-label">${a("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${t=>this._readingValue=t.target.value} />
              </label>`:p}
          ${this.parts.length?o`<div class="used-parts">
                <span class="field-label">${a("complete_parts_used",e)}</span>
                ${this.parts.map(t=>{let i=G({part_id:t.id,entry_id:t.entry_id}),n=this._usedParts[i],c=n!==void 0,d=t.entry_id?{part_id:t.id,quantity:1,entry_id:t.entry_id}:{part_id:t.id,quantity:1};return o`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${c}
                        @change=${h=>{let _={...this._usedParts};h.target.checked?_[i]=_[i]||d:delete _[i],this._usedParts=_}} />
                      <span
                        >${t.name}${t.owner_name?o`<span class="used-part-owner"> (${t.owner_name})</span>`:p}${t.stock!==null&&t.stock!==void 0?` (${t.stock}${t.unit?" "+t.unit:""})`:""}</span
                      >
                    </label>
                    ${c?o`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(n.quantity)}
                          @input=${h=>{let _=parseFloat(h.target.value);this._usedParts={...this._usedParts,[i]:{...d,quantity:Number.isFinite(_)&&_>=.01?_:1}}}} />`:p}
                  </div>`})}
              </div>`:this.consumesInfo.length?o`<div class="consumes-hint">
                  ${this.consumesInfo.map(t=>o`<div>${t}</div>`)}
                </div>`:p}
          ${this.restockDefault!==null?o`
              <label class="field">
                <span class="field-label">${a("restock_quantity_label",e)}</span>
                <input type="number" step="0.01" min="0.01" class="field-input"
                  .value=${this._restockQty}
                  @input=${t=>this._restockQty=t.target.value} />
              </label>`:p}
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
            ${this._completedAt?o`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  @value-changed=${t=>this._completedAt=t.detail.value}
                ></ms-date-field>`:o`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${a("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${a("completion_photo_optional",e)}${this._req("photo")}</span>
            ${this._photoPreview?o`
                <div class="photo-preview">
                  <img src=${this._photoPreview} alt="" />
                  <button type="button" class="photo-remove" @click=${this._removePhoto}
                    title="${a("remove",e)}">✕</button>
                </div>`:o`
                <label class="photo-pick">
                  <ha-icon icon="mdi:camera"></ha-icon>
                  <span>${this._photoUploading?a("uploading",e):a("add_photo",e)}</span>
                  <input type="file" accept="image/*" capture="environment"
                    ?disabled=${this._photoUploading}
                    @change=${this._onPhotoInput} />
                </label>`}
          </div>
          ${this.adaptiveEnabled?o`
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
          `:p}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${a("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._missingRequired.length>0}
            title=${this._missingRequired.length?this._missingRequired.map(t=>a("err_required",e).replace("{field}",a(Me[t]??t,e))).join(" \xB7 "):""}
          >
            ${this._loading?a("completing",e):a("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};k.styles=[Ri,T`
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
    .photo-preview {
      position: relative;
      width: fit-content;
    }
    .photo-preview img {
      max-width: 160px;
      max-height: 160px;
      border-radius: 8px;
      display: block;
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
  `],l([y({attribute:!1})],k.prototype,"hass",2),l([y()],k.prototype,"entryId",2),l([y()],k.prototype,"taskId",2),l([y()],k.prototype,"taskName",2),l([y()],k.prototype,"lang",2),l([y({type:Array})],k.prototype,"checklist",2),l([y({type:Boolean})],k.prototype,"adaptiveEnabled",2),l([y()],k.prototype,"taskType",2),l([y()],k.prototype,"readingUnit",2),l([y({attribute:!1})],k.prototype,"restockDefault",2),l([y({attribute:!1})],k.prototype,"restockUnitCost",2),l([y()],k.prototype,"currencySymbol",2),l([y({attribute:!1})],k.prototype,"parts",2),l([y({attribute:!1})],k.prototype,"consumesParts",2),l([y({type:Array})],k.prototype,"consumesInfo",2),l([y({type:Array})],k.prototype,"requiredFields",2),l([y()],k.prototype,"phaseLabel",2),l([y({type:Boolean})],k.prototype,"requireTagScan",2),l([y({type:Boolean})],k.prototype,"viaTagScan",2),l([u()],k.prototype,"_open",2),l([u()],k.prototype,"_notes",2),l([u()],k.prototype,"_cost",2),l([u()],k.prototype,"_duration",2),l([u()],k.prototype,"_loading",2),l([u()],k.prototype,"_error",2),l([u()],k.prototype,"_checklistState",2),l([u()],k.prototype,"_feedback",2),l([u()],k.prototype,"_photoDocId",2),l([u()],k.prototype,"_photoPreview",2),l([u()],k.prototype,"_photoUploading",2),l([u()],k.prototype,"_readingValue",2),l([u()],k.prototype,"_restockQty",2),l([u()],k.prototype,"_completedAt",2),l([u()],k.prototype,"_usedParts",2),l([y({attribute:!1})],k.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",k)});function E(r){return r.toFixed(1)}var st=w(()=>{"use strict";q()});var H,Rt=w(()=>{"use strict";R();M();H=class extends A{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){return o`
      <label class="field">
        ${this.label?o`<span class="label">${this.label}${this.required?o`<span class="req">*</span>`:p}</span>`:p}
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
          step=${this.step??p}
          min=${this.min??p}
          max=${this.max??p}
          pattern=${this.pattern??p}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?o`<span class="helper">${this.helper}</span>`:p}
      </label>
    `}};H.styles=T`
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
  `,l([y()],H.prototype,"label",2),l([y()],H.prototype,"value",2),l([y()],H.prototype,"placeholder",2),l([y()],H.prototype,"type",2),l([y({type:Boolean})],H.prototype,"required",2),l([y({type:Boolean})],H.prototype,"disabled",2),l([y()],H.prototype,"step",2),l([y()],H.prototype,"min",2),l([y()],H.prototype,"max",2),l([y()],H.prototype,"pattern",2),l([y()],H.prototype,"helper",2),l([y({type:Boolean})],H.prototype,"multiline",2),l([y({type:Number})],H.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",H)});var P,zi=w(()=>{"use strict";R();M();q();oe();Rt();xe();P=class extends A{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._entryId=null}get _lang(){return N(this.hass)}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._haDeviceId=t.ha_device_id||"",this._parentEntryId=t.parent_entry_id||"",this._error="",this._open=!0}async _save(){if(!this._loading&&this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(e){this._error=C(e,this._lang,a("save_error",this._lang))}finally{this._loading=!1}}}_parentChoices(){return(this.objects||[]).filter(e=>e.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return o``;let e=this._lang,t=this._entryId?a("edit_object",e):a("new_object",e);return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:p}
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
          ${this._parentChoices().length?o`<label class="textarea-field">
                <span class="textarea-label">${a("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${i=>this._parentEntryId=i.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${a("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(i=>o`<option
                      value=${i.entry_id}
                      ?selected=${this._parentEntryId===i.entry_id}
                    >${i.object.name}</option>`)}
                </select>
              </label>`:p}
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
    `}};P.styles=T`
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
  `,l([y({attribute:!1})],P.prototype,"hass",2),l([y({attribute:!1})],P.prototype,"objects",2),l([u()],P.prototype,"_open",2),l([u()],P.prototype,"_loading",2),l([u()],P.prototype,"_error",2),l([u()],P.prototype,"_name",2),l([u()],P.prototype,"_manufacturer",2),l([u()],P.prototype,"_model",2),l([u()],P.prototype,"_serialNumber",2),l([u()],P.prototype,"_areaId",2),l([u()],P.prototype,"_installationDate",2),l([u()],P.prototype,"_warrantyExpiry",2),l([u()],P.prototype,"_documentationUrl",2),l([u()],P.prototype,"_notes",2),l([u()],P.prototype,"_haDeviceId",2),l([u()],P.prototype,"_parentEntryId",2),l([u()],P.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",P)});var qt,Fi,Ui,Bi=w(()=>{"use strict";qt=["sensor","binary_sensor","number","input_number","input_boolean","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock"],Fi=["sensor"],Ui=["temperature","humidity","pressure"]});function cr(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",carry:{}}}function pr(r){return{entityIds:(r.entity_ids||(r.entity_id?[r.entity_id]:[])).join(", "),type:r.type||"threshold",attribute:r.attribute||"",above:r.trigger_above?.toString()??"",below:r.trigger_below?.toString()??"",equals:r.trigger_equals?.toString()??"",notEquals:r.trigger_not_equals?.toString()??"",forMinutes:r.trigger_for_minutes?.toString()??"0",targetValue:r.trigger_target_value?.toString()??"",deltaMode:r.trigger_delta_mode||!1,fromState:r.trigger_from_state||"",toState:r.trigger_to_state||"",targetChanges:r.trigger_target_changes?.toString()??"",runtimeHours:r.trigger_runtime_hours?.toString()??"",onStates:(r.trigger_on_states||[]).join(", "),carry:Object.fromEntries(Object.entries(r).filter(([e])=>!dr.has(e)&&!e.startsWith("_")))}}function hr(r){let s=r.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(s.length===0)return null;let e={...r.carry||{},entity_id:s[0],entity_ids:s,type:r.type};if(r.attribute&&(e.attribute=r.attribute),r.type==="threshold"){let t=parseFloat(r.above);isNaN(t)||(e.trigger_above=t);let i=parseFloat(r.below);isNaN(i)||(e.trigger_below=i);let n=parseFloat(r.equals);isNaN(n)||(e.trigger_equals=n);let c=parseFloat(r.notEquals);isNaN(c)||(e.trigger_not_equals=c);let d=parseInt(r.forMinutes,10);isNaN(d)||(e.trigger_for_minutes=d)}else if(r.type==="counter"){let t=parseFloat(r.targetValue);isNaN(t)||(e.trigger_target_value=t),e.trigger_delta_mode=r.deltaMode}else if(r.type==="state_change"){r.fromState&&(e.trigger_from_state=r.fromState),r.toState&&(e.trigger_to_state=r.toState);let t=parseInt(r.targetChanges,10);isNaN(t)||(e.trigger_target_changes=t)}else if(r.type==="runtime"){let t=parseFloat(r.runtimeHours);isNaN(t)||(e.trigger_runtime_hours=t);let i=(r.onStates||"").split(",").map(n=>n.trim()).filter(Boolean);i.length>0&&(e.trigger_on_states=i)}return e}function ur(r){return Array.from({length:7},(s,e)=>je(e,r,"short"))}function _r(r){return Array.from({length:12},(s,e)=>Ii(e,r,"short"))}var ar,nr,or,jt,Vi,lr,te,dr,g,Nt,Wi=w(()=>{"use strict";R();M();q();St();tt();Bi();oe();Ct();Rt();xe();ar=["cleaning","inspection","replacement","calibration","service","reading","custom"],nr=["low","normal","high"],or=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],jt=["weekdays","nth_weekday","day_of_month"],Vi=["threshold","counter","state_change","runtime"],lr=[...Vi,"compound"],te={alpha:"0.3",min:"7",max:"365"};dr=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states"]);g=class g extends A{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._priority="normal";this._labels="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._readingUnit="";this._consumesParts={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=te.alpha;this._adaptiveMin=te.min;this._adaptiveMax=te.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return N(this.hass)}async openCreate(e,t){this._entryId=e,this._taskId=null,this._error="",!e&&t&&t.length>0?(this._objectChoices=t.map(i=>({entry_id:i.entry_id,name:i.object.name})).sort((i,n)=>i.name.localeCompare(n.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._objectChoices=[],this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let i=t.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"&&(i.day??1)>=1?String(i.day??1):"1",this._domLastDay=i?.kind==="day_of_month"&&i.day===-1,this._domBusiness=i?.kind==="day_of_month"&&i.business===!0,this._calOffset=i?.offset?String(i.offset):"0",this._seasonMonths=Array.isArray(i?.season_months)?[...i.season_months]:[];let n=i?.ends;n&&typeof n.count=="number"?(this._endsMode="count",this._endsCount=String(n.count),this._endsUntil=""):n&&typeof n.until=="string"?(this._endsMode="until",this._endsUntil=n.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._readingUnit=t.reading_unit||"",this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(_=>[G(_),{..._}])),this._responsibleUserId=t.responsible_user_id||null,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([_,f])=>{let{name:x,checklist:v,consumes_parts:b,required_completion_fields:m,...$}=f,O=f.consumes_parts||[],I=O.findIndex(L=>!L.entry_id),S=I>=0?O[I]:void 0;return{id:_,name:f.name||_,checklistText:(f.checklist||[]).join(`
`),partId:S?.part_id||"",partQty:S?.quantity!=null?String(S.quantity):"",reqOverride:f.required_completion_fields!==void 0,reqFields:[...f.required_completion_fields||[]],extraParts:O.filter((L,_e)=>_e!==I).map(L=>({...L})),carry:$}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"";let c=t.on_complete_action;if(c&&c.service){this._actionService=c.service;let _=c.target?.entity_id;this._actionTargetEntity=Array.isArray(_)?_[0]||"":_||"",this._actionData=c.data&&typeof c.data=="object"?{...c.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let d=t.quick_complete_defaults;this._qcNotes=d?.notes||"",this._qcCost=d?.cost!=null?String(d.cost):"",this._qcDuration=d?.duration!=null?String(d.duration):"",this._qcFeedback=d?.feedback||"";let h=t.adaptive_config||{};if(this._environmentalEntity=h.environmental_entity||"",this._environmentalAttribute=h.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!h.enabled,this._adaptiveAlpha=h.ewa_alpha?.toString()??te.alpha,this._adaptiveMin=h.min_interval_days?.toString()??te.min,this._adaptiveMax=h.max_interval_days?.toString()??te.max,this._adaptiveSeasonal=h.seasonal_enabled!==!1,this._adaptivePrediction=h.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),t.trigger_config){let _=t.trigger_config;this._triggerEntityId=_.entity_id||_.entity_ids&&_.entity_ids[0]||"",this._triggerEntityIds=_.entity_ids||(_.entity_id?[_.entity_id]:[]),this._triggerEntityLogic=_.entity_logic||"any",this._triggerAttribute=_.attribute||"",this._triggerType=_.type||"threshold",this._triggerAbove=_.trigger_above?.toString()||"",this._triggerBelow=_.trigger_below?.toString()||"",this._triggerEquals=_.trigger_equals?.toString()||"",this._triggerNotEquals=_.trigger_not_equals?.toString()||"",this._triggerForMinutes=_.trigger_for_minutes?.toString()||"0",this._triggerCombinator=_.trigger_combinator==="all"?"all":"any",this._triggerTargetValue=_.trigger_target_value?.toString()||"",this._triggerDeltaMode=_.trigger_delta_mode||!1,this._triggerBaselineValue=_.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=_.auto_complete_on_recovery||!1,this._triggerFromState=_.trigger_from_state||"",this._triggerToState=_.trigger_to_state||"",this._triggerTargetChanges=_.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=_.trigger_runtime_hours?.toString()||"",this._triggerRuntimeMaxSession=_.trigger_runtime_max_session_seconds?.toString()||"",this._triggerOnStates=(_.trigger_on_states||[]).join(", "),_.type==="compound"?(this._compoundLogic=_.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(_.conditions||[]).map(pr)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._priority="normal",this._labels="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._readingUnit="",this._consumesParts={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=te.alpha,this._adaptiveMin=te.min,this._adaptiveMax=te.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerEquals="",this._triggerNotEquals="",this._triggerForMinutes="0",this._triggerCombinator="any",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours="",this._triggerRuntimeMaxSession="",this._triggerOnStates="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new ye(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,i]=e.split(".");if(!this.hass?.services?.[t]?.[i]){this._actionTestResult="error",this._actionTestError=`Service "${e}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let n=this._actionTargetEntity.trim();if(n){let c=n.split(".")[0];if(c!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=`Service "${e}" only works on ${t}.* entities; entity "${n}" is in ${c}.* \u2014 pick a service that matches the entity domain (e.g. ${c}.${i})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[n]){this._actionTestResult="error",this._actionTestError=`Target entity "${n}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,i]=e.split("."),n=this.hass?.services?.[t]?.[i]?.fields;return!n||Object.keys(n).length===0?null:Object.entries(n).map(([c,d])=>({name:c,required:!!d.required,selector:d.selector||{text:{}}}))}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled)return p;let t=this._serviceSchema();return o`
      <details class="ca-section">
        <summary>${a("on_complete_action_title",e)}</summary>
        <p class="field-help">${a("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let n=this._serviceSchema();if(n){let c=new Set(n.map(d=>d.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([d])=>c.has(d)))}}}
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
        ${t?o`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${i=>{this._actionData={...i.detail.value}}}
              ></ha-form>
            `:o`
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
          ${this._actionTestResult==="ok"?o`<span class="ca-test-ok">${a("on_complete_action_test_success",e)}</span>`:p}
          ${this._actionTestResult==="error"?o`<div class="ca-test-error-block">
                <span class="ca-test-error">${a("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?o`<div class="ca-test-error-detail">${this._actionTestError}</div>`:p}
              </div>`:p}
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
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=e.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(e.objects||[]).filter(t=>t.entry_id!==this._entryId&&(t.parts||[]).length>0).map(t=>({entry_id:t.entry_id,name:t.object?.name||t.entry_id,parts:t.parts||[]})).sort((t,i)=>t.name.localeCompare(i.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let i=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:i.suggested_attributes||[],available:i.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=t.domain||"",this._suggestedAttributes=t.suggested_attributes||[],this._availableAttributes=t.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let i=G({part_id:e.id,entry_id:t}),n=this._consumesParts[i],c=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return o`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${n!==void 0}
            @change=${d=>{let h={...this._consumesParts};d.target.checked?h[i]=h[i]||c:delete h[i],this._consumesParts=h}}
          />
          <span>${e.name}${e.unit?` (${e.unit})`:""}</span>
        </label>
        ${n!==void 0?o`<input
              class="consumes-qty"
              type="number"
              min="0.01"
              max="999"
              step="0.01"
              .value=${String(n.quantity)}
              @input=${d=>{let h=parseFloat(d.target.value);this._consumesParts={...this._consumesParts,[i]:{...c,quantity:Number.isFinite(h)&&h>=.01?h:1}}}}
            />`:p}
      </div>
    `}_toggleRequired(e,t){let i=new Set(this._requiredCompletion);t?i.add(e):i.delete(e),this._requiredCompletion=[...i]}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",i=t,n=2;for(;this._phaseDefs.some(c=>c.id===i);)i=`${t}-${n++}`;return i}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(i=>i.id===e?{...i,...t}:i)}_renderPhasesEditor(e){let t=i=>this._phaseDefs.find(n=>n.id===i)?.name||i;return o`
      <h3>${a("phases_section",e)}</h3>
      <div class="field-help">${a("phases_hint",e)}</div>
      ${this._phaseDefs.map(i=>o`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${a("phase_name",e)}"
              .value=${i.name}
              @input=${n=>this._patchPhaseDef(i.id,{name:n.target.value})}
            ></ms-textfield>
            ${this.parts.length?o`
              <select
                class="phase-part"
                .value=${i.partId}
                @change=${n=>this._patchPhaseDef(i.id,{partId:n.target.value})}
              >
                <option value="">—</option>
                ${this.parts.map(n=>o`<option value=${n.id} ?selected=${n.id===i.partId}>${n.name}</option>`)}
              </select>
              ${i.partId?o`
                <input class="phase-qty" type="number" min="0.01" step="0.01" .value=${i.partQty||"1"}
                  @input=${n=>this._patchPhaseDef(i.id,{partQty:n.target.value})} />
              `:p}
            `:p}
            <mwc-icon-button class="phase-remove" @click=${()=>this._removePhaseDef(i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </mwc-icon-button>
          </div>
          ${this.checklistsEnabled?o`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${a("checklist_placeholder",e)}"
              .value=${i.checklistText}
              @input=${n=>this._patchPhaseDef(i.id,{checklistText:n.target.value})}
            ></textarea>
          `:p}
          <label class="req-option phase-req-toggle">
            <input
              type="checkbox"
              .checked=${i.reqOverride}
              @change=${n=>this._patchPhaseDef(i.id,{reqOverride:n.target.checked})}
            />
            <span>${a("phase_require_override",e)}</span>
          </label>
          ${i.reqOverride?o`
            <div class="required-completion phase-req-fields">
              ${Tt.map(n=>o`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${i.reqFields.includes(n)}
                    @change=${c=>{let d=c.target.checked,h=new Set(i.reqFields);d?h.add(n):h.delete(n),this._patchPhaseDef(i.id,{reqFields:[...h]})}}
                  />
                  <span>${a(Me[n],e)}</span>
                </label>
              `)}
            </div>
          `:p}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${a("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(i=>i.name.trim())?o`
        <div class="phase-seq-label">${a("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((i,n)=>o`
            <span class="phase-chip">
              ${n+1}. ${t(i)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((c,d)=>d!==n)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            .value=${""}
            @change=${i=>{let n=i.target.value;n&&(this._phaseSeq=[...this._phaseSeq,n]),i.target.value=""}}
          >
            <option value="">+ ${a("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(i=>i.name.trim()).map(i=>o`<option value=${i.id}>${i.name}</option>`)}
          </select>
        </div>
      `:p}
    `}async _save(){if(!this._loading&&this._name.trim()){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let e=parseInt(this._adaptiveMin,10),t=parseInt(this._adaptiveMax,10);if(!isNaN(e)&&!isNaN(t)&&e>t){this._error=`${a("adaptive_min_interval",this._lang)} > ${a("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=a("trigger_hint_overlap",this._lang);return}this._loading=!0,this._error="";try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):jt.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.priority=this._priority,e.labels=this._labels.split(",").map(d=>d.trim()).filter(Boolean),e.enabled=this._enabled,e.last_performed=this._lastPerformed||null,e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip,e.reading_unit=this._readingUnit.trim()||null;{let d={};for(let _ of this._phaseDefs){if(!_.name.trim())continue;let f={..._.carry,name:_.name.trim()},x=_.checklistText.split(`
`).map(b=>b.trim()).filter(Boolean);x.length&&(f.checklist=x);let v=[];if(_.partId){let b=parseFloat(_.partQty);v.push({part_id:_.partId,quantity:Number.isFinite(b)&&b>0?b:1})}for(let b of _.extraParts)v.push(b.entry_id?{part_id:b.part_id,quantity:b.quantity,entry_id:b.entry_id}:{part_id:b.part_id,quantity:b.quantity});v.length&&(f.consumes_parts=v),_.reqOverride&&(f.required_completion_fields=[..._.reqFields]),d[_.id]=f}let h=this._phaseSeq.filter(_=>_ in d);e.phases=Object.keys(d).length&&h.length?d:null,e.phase_sequence=e.phases?h:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(d=>d.entry_id?{part_id:d.part_id,quantity:d.quantity,entry_id:d.entry_id}:{part_id:d.part_id,quantity:d.quantity})),e.responsible_user_id=this._responsibleUserId,e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let d=this._compoundConditions.map(hr).filter(h=>h!==null);if(d.length>0){let h={type:"compound",compound_logic:this._compoundLogic,conditions:d};this._autoCompleteOnRecovery&&(h.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(h.trigger_combinator="all"),e.trigger_config=h}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let d=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],h={entity_id:d[0],entity_ids:d,type:this._triggerType};if(this._triggerAttribute&&(h.attribute=this._triggerAttribute),this._autoCompleteOnRecovery&&(h.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(h.trigger_combinator="all"),d.length>1&&(h.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let _=parseFloat(this._triggerAbove);isNaN(_)||(h.trigger_above=_)}if(this._triggerBelow){let _=parseFloat(this._triggerBelow);isNaN(_)||(h.trigger_below=_)}if(this._triggerEquals){let _=parseFloat(this._triggerEquals);isNaN(_)||(h.trigger_equals=_)}if(this._triggerNotEquals){let _=parseFloat(this._triggerNotEquals);isNaN(_)||(h.trigger_not_equals=_)}if(this._triggerForMinutes){let _=parseInt(this._triggerForMinutes,10);isNaN(_)||(h.trigger_for_minutes=_)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let _=parseFloat(this._triggerTargetValue);isNaN(_)||(h.trigger_target_value=_)}if(h.trigger_delta_mode=this._triggerDeltaMode,this._triggerDeltaMode&&this._triggerBaselineValue){let _=parseFloat(this._triggerBaselineValue);!isNaN(_)&&_>=0&&(h.trigger_baseline_value=_)}}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(h.trigger_from_state=this._triggerFromState),this._triggerToState&&(h.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let _=parseInt(this._triggerTargetChanges,10);isNaN(_)||(h.trigger_target_changes=_)}if(this._triggerForMinutes){let _=parseInt(this._triggerForMinutes,10);isNaN(_)||(h.trigger_for_minutes=_)}}else if(this._triggerType==="runtime"){if(this._triggerRuntimeHours){let f=parseFloat(this._triggerRuntimeHours);isNaN(f)||(h.trigger_runtime_hours=f)}if(this._triggerRuntimeMaxSession){let f=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(f)&&f>0&&(h.trigger_runtime_max_session_seconds=f)}let _=this._triggerOnStates.split(",").map(f=>f.trim()).filter(Boolean);_.length>0&&(h.trigger_on_states=_)}e.trigger_config=h}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let d=this._scheduleTime.trim();e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(d)?d:null}if(this.checklistsEnabled){let d=this._checklistText.split(`
`).map(h=>h.trim()).filter(Boolean).slice(0,100);e.checklist=d.length?d:null}if(this.completionActionsEnabled){let d=this._actionService.trim();if(d&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(d)){let x={service:d},v=this._actionTargetEntity.trim();v&&(x.target={entity_id:v});let b=this._buildActionData();Object.keys(b).length>0&&(x.data=b),e.on_complete_action=x}else e.on_complete_action=null;let h={};this._qcNotes.trim()&&(h.notes=this._qcNotes.trim());let _=parseFloat(this._qcCost);!isNaN(_)&&_>=0&&(h.cost=_);let f=parseInt(this._qcDuration,10);!isNaN(f)&&f>=0&&(h.duration=f),this._qcFeedback&&(h.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(h).length?h:null}let i=await this.hass.connection.sendMessagePromise(e),n=this._taskId||i?.task_id,c=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(n&&this._scheduleType==="sensor_based"&&c)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:n,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}if(n&&this._adaptiveSnapshot()!==this._adaptiveInitial){let d=parseFloat(this._adaptiveAlpha),h=parseInt(this._adaptiveMin,10),_=parseInt(this._adaptiveMax,10);try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:n,enabled:this._adaptiveEnabled,...d>=.1&&d<=.9?{ewa_alpha:d}:{},...!isNaN(h)&&h>=1?{min_interval_days:h}:{},...!isNaN(_)&&_>=1?{max_interval_days:_}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction}),this._adaptiveInitial=this._adaptiveSnapshot()}catch{}}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(e){this._error=C(e,this._lang,a("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1,this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let e=this._lang,t=this._triggerType==="compound";return o`
      <h3>${a("trigger_configuration",e)}</h3>
      <div class="select-row">
        <label>${a("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${i=>this._triggerType=i.target.value}
        >
          ${lr.map(i=>o`<option value=${i} ?selected=${i===this._triggerType}>${a(i,e)}</option>`)}
        </select>
      </div>
      ${t?this._renderCompoundEditor():o`
        ${this._entityPickerFallback?o`
          <ms-textfield
            label="${a("entity_id",e)} (${a("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${i=>{let c=i.target.value.split(",").map(d=>d.trim()).filter(Boolean);this._triggerEntityId=c[0]||"",this._triggerEntityIds=c,c[0]&&this._fetchEntityAttributes(c[0])}}
          ></ms-textfield>
        `:o`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:qt}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>a("entity_id",e)}
          @value-changed=${i=>{let n=(i.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=n[0]||"",this._triggerEntityIds=n,n[0]?this._fetchEntityAttributes(n[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?o`
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
        `:p}
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
      ${this._intervalDays?this._renderUnitSelect():p}
      ${this._intervalDays?o`
            <div class="select-row">
              <label>${a("trigger_combinator",e)}</label>
              <select
                @change=${i=>this._triggerCombinator=i.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${a("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${a("trigger_combinator_all",e)}</option>
              </select>
            </div>
          `:p}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((i,n)=>n===e?{...i,...t}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,cr()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,i)=>i!==e)}_renderCompoundEditor(){let e=this._lang;return o`
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
      ${this._compoundConditions.length===0?o`<div class="field-help">${a("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,i)=>this._renderCondition(t,i))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${a("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let i=this._lang,n=t+1;return o`
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
        ${this._entityPickerFallback?o`
          <ms-textfield
            label="${a("entity_id",i)} (${a("comma_separated",i)})"
            .value=${e.entityIds}
            @input=${c=>this._patchCondition(t,{entityIds:c.target.value})}
          ></ms-textfield>
        `:o`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:qt}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(c=>c.trim()).filter(Boolean)}}
          .computeLabel=${()=>a("entity_id",i)}
          @value-changed=${c=>{let d=(c.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:d.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          <label>${a("trigger_type",i)}</label>
          <select
            .value=${e.type}
            @change=${c=>this._patchCondition(t,{type:c.target.value})}
          >
            ${Vi.map(c=>o`<option value=${c} ?selected=${c===e.type}>${a(c,i)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(e,t)}
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
          label="${a("runtime_on_states",t)}"
          placeholder="on"
          .value=${e.value}
          @input=${i=>e.onInput(i.target.value)}
        ></ms-textfield>
      `:o`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(i=>i.trim()).filter(Boolean)}}
        .computeLabel=${()=>a("runtime_on_states",t)}
        @value-changed=${i=>e.onInput((i.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?p:o`
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
        ${this._adaptiveEnabled?o`
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
        `:p}
      </details>
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?o`
        <div class="select-row">
          <label>${e.label}</label>
          <select
            .value=${e.value}
            @change=${i=>e.onSelect(i.target.value)}
          >
            <option value="" ?selected=${!e.value}>${a("use_entity_state",t)}</option>
            ${e.suggested.map(i=>o`<option value=${i} ?selected=${i===e.value}>${i} ★</option>`)}
            ${e.available.filter(i=>!e.suggested.includes(i.name)).map(i=>o`<option value=${i.name} ?selected=${i.name===e.value}>${i.name}${i.numeric?"":" (non-numeric)"}</option>`)}
          </select>
        </div>
      `:o`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${i=>e.onSelect(i.target.value.trim())}
      ></ms-textfield>
    `}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:a("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:i=>this._environmentalAttribute=i})}_renderConditionAttribute(e,t){let i=e.entityIds.split(",")[0]?.trim()||"";i&&this._fetchConditionAttributes(i);let n=i?this._conditionAttrOptions[i]:void 0;return this._renderAttributeSelect({label:a("attribute_optional",this._lang),value:e.attribute,suggested:n?.suggested??[],available:n?.available??[],onSelect:c=>this._patchCondition(t,{attribute:c})})}_renderConditionTypeFields(e,t){let i=this._lang;if(e.type==="threshold")return o`
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
      `;if(e.type==="counter")return o`
        <ms-textfield label="${a("target_value",i)}" type="number" .value=${e.targetValue}
          @input=${n=>this._patchCondition(t,{targetValue:n.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${e.deltaMode}
            @change=${n=>this._patchCondition(t,{deltaMode:n.target.checked})} />
          ${a("delta_mode",i)}
        </label>
      `;if(e.type==="state_change"){let n=e.entityIds.split(",")[0]?.trim()||"";return o`
        ${this._renderStateField({label:a("from_state_optional",i),value:e.fromState,entityId:n,onInput:c=>this._patchCondition(t,{fromState:c})})}
        ${this._renderStateField({label:a("to_state_optional",i),value:e.toState,entityId:n,onInput:c=>this._patchCondition(t,{toState:c})})}
        <ms-textfield label="${a("target_changes",i)}" type="number" .value=${e.targetChanges}
          @input=${c=>this._patchCondition(t,{targetChanges:c.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let n=e.entityIds.split(",")[0]?.trim()||"";return o`
        <ms-textfield label="${a("runtime_hours",i)}" type="number" .value=${e.runtimeHours}
          @input=${c=>this._patchCondition(t,{runtimeHours:c.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:n,onInput:c=>this._patchCondition(t,{onStates:c})})}
      `}return p}_renderUnitSelect(){let e=this._lang;return o`
      <div class="select-row">
        <label>${a("interval_unit",e)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${t=>this._intervalUnit=t.target.value}
        >
          ${["days","weeks","months","years"].map(t=>o`<option value=${t} ?selected=${t===this._intervalUnit}>${a("unit_"+t,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(jt.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(g._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let i=(h,_,f=0)=>{if(!(!h||f>10)){(h.tagName?.toLowerCase()??"")==="ha-entity-picker"&&_.push(h);for(let x of[h.shadowRoot,h])if(x)for(let v of Array.from(x.children??[]))i(v,_,f+1)}},n=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],c=[];for(let h of n)i(h,c);let d=c.length===0||c.some(h=>h.offsetHeight===0);if(e.offsetHeight===0||d){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(t!==this._previewSeq)return;this._schedulePreview=i.occurrences||[],this._schedulePreviewEnded=!!i.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return p;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTime?` ${this._scheduleTime}`:"",i=this._schedulePreview.map((c,d)=>{let h=new Date(`${c}T12:00:00`).getDay();return`${je(h===0?6:h-1,e,"short")} ${W(c,e)}${d===0?t:""}`}).join(" \xB7 "),n=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?o`<div class="field-help">${a("schedule_preview_ontime",e)}</div>`:p;return o`
      <div class="trigger-live-hint schedule-preview">
        ${a("schedule_preview_title",e)}: ${i}${this._schedulePreviewEnded?o` <span class="field-help">${a("schedule_preview_ends",e)}</span>`:p}
        ${n}
      </div>
    `}_buildSchedule(){let e=i=>{let n=parseInt(this._calOffset,10)||0;return n&&(i.offset=Math.max(-15,Math.min(n,15))),i};if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((i,n)=>i-n)});if(this._scheduleType==="nth_weekday")return e({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});let t={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(t.business=!0),e(t)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,i)=>t-i)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||jt.includes(this._scheduleType)))return p;let i=_r(e);return o`
      <label class="field-label">${a("season_window_label",e)}</label>
      <div class="field-help">${a("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${i.map((n,c)=>o`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(c+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(c+1)}
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
      ${this._endsMode==="count"?o`
        <ms-textfield
          label="${a("series_end_count_label",e)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${n=>this._endsCount=n.target.value}
        ></ms-textfield>`:p}
      ${this._endsMode==="until"?o`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${a("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${n=>this._endsUntil=n.detail.value}
        ></ms-date-field>`:p}
    `}_renderCalendarFields(){let e=this._lang,t=ur(e);if(this._scheduleType==="weekdays")return o`
        <label class="field-label">${a("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((i,n)=>o`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(n)?"selected":""}"
              @click=${()=>this._toggleWeekday(n)}
            >${i}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let i=[["1",a("ord_1",e)],["2",a("ord_2",e)],["3",a("ord_3",e)],["4",a("ord_4",e)],["5",a("ord_5",e)],["-1",a("ord_last",e)]];return o`
        <div class="select-row">
          <label>${a("recurrence_occurrence",e)}</label>
          <select .value=${this._nth} @change=${n=>this._nth=n.target.value}>
            ${i.map(([n,c])=>o`<option value=${n} ?selected=${n===this._nth}>${c}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${a("recurrence_weekday",e)}</label>
          <select .value=${this._nthWeekday} @change=${n=>this._nthWeekday=n.target.value}>
            ${t.map((n,c)=>o`<option value=${String(c)} ?selected=${String(c)===this._nthWeekday}>${n}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`}return this._scheduleType==="day_of_month"?o`
        ${this._domLastDay?p:o`
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
        ${this._renderCalOffsetField()}`:p}_renderCalOffsetField(){let e=this._lang;return o`
      <ms-textfield
        label="${a("recurrence_offset",e)}"
        helper="${a("recurrence_offset_help",e)}"
        type="number"
        min="-15"
        max="15"
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return p;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?o`<div class="trigger-live-hint warn">${a("trigger_hint_overlap",this._lang)}</div>`:p,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let i=this.hass.states[t];if(!i)return e;let n=this._lang,c=i.attributes?.unit_of_measurement,d=typeof c=="string"&&c?` ${c}`:"",h=this._triggerAttribute?i.attributes?.[this._triggerAttribute]:i.state,_=typeof h=="number"?h:parseFloat(String(h)),f=h!=="unknown"&&h!=="unavailable"&&h!=null&&!isNaN(_),x=b=>Number.isInteger(b)?String(b):String(Math.round(b*10)/10),v=[];if(this._triggerType==="threshold"){let b=parseFloat(this._triggerAbove),m=parseFloat(this._triggerBelow);if(isNaN(b)&&isNaN(m))return p;f&&v.push(a("trigger_hint_now",n).replace("{value}",x(_)+d)),isNaN(b)||v.push(a("trigger_hint_above",n).replace("{target}",x(b)+d)),isNaN(m)||v.push(a("trigger_hint_below",n).replace("{target}",x(m)+d))}else if(this._triggerType==="counter"){let b=parseFloat(this._triggerTargetValue);if(isNaN(b))return p;this._triggerDeltaMode?this._taskId?v.push(a("trigger_hint_counter_delta_edit",n).replace("{target}",x(b)+d)):f?v.push(a("trigger_hint_counter_delta",n).replace("{value}",x(_)+d).replace("{due}",x(_+b)+d).replace("{target}",x(b)+d)):v.push(a("trigger_hint_counter_delta_edit",n).replace("{target}",x(b)+d)):(f&&v.push(a("trigger_hint_now",n).replace("{value}",x(_)+d)),v.push(a("trigger_hint_counter_abs",n).replace("{target}",x(b)+d)))}else if(this._triggerType==="runtime"){let b=parseFloat(this._triggerRuntimeHours);if(isNaN(b))return p;v.push(a("trigger_hint_runtime",n).replace("{hours}",x(b))),v.push(a("trigger_hint_state_now",n).replace("{value}",String(i.state)))}else if(this._triggerType==="state_change"){let b=parseInt(this._triggerTargetChanges,10)||1,m=this._triggerToState.trim();v.push((m?a("trigger_hint_state_change_to",n).replace("{state}",m):a("trigger_hint_state_change",n)).replace("{count}",String(b))),v.push(a("trigger_hint_state_now",n).replace("{value}",String(i.state)))}return v.length?o`<div class="trigger-live-hint">${v.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?o`
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
      `:this._triggerType==="counter"?o`
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
        ${this._triggerDeltaMode?o`
              <ms-textfield
                label="${a("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${t=>this._triggerBaselineValue=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?a("baseline_start_help_edit",e):a("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?o`<div class="baseline-effective">
                      ${a("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:p}
              </div>
            `:p}
      `:this._triggerType==="state_change"?o`
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
        <ms-textfield
          label="${a("for_at_least_minutes",e)}"
          type="number"
          min="0"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
        <div class="field-help">${a("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?o`
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
      `:p}render(){if(!this._open)return o``;let e=this._lang,t=this._taskId?a("edit_task",e):a("new_task",e);return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:p}
          ${this._taskId===null&&this._objectChoices.length>0?o`
            <div class="select-row">
              <label>${a("object",e)}</label>
              <select
                .value=${this._entryId}
                @change=${i=>{this._entryId=i.target.value,this._consumesParts={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(i=>o`<option value=${i.entry_id} ?selected=${i.entry_id===this._entryId}>${i.name}</option>`)}
              </select>
            </div>
          `:p}
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
              ${ar.map(i=>o`<option value=${i} ?selected=${i===this._type}>${a(i,e)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?o`
                <ms-textfield
                  label="${a("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${i=>this._readingUnit=i.target.value}
                ></ms-textfield>
                <div class="field-help">${a("reading_unit_help",e)}</div>
              `:p}
          ${this._partsLoadFailed?o`<div class="field-help parts-load-failed">${a("parts_load_failed",e)}</div>`:p}
          ${this.parts.length||this._foreignOwners.length?o`
                <div class="field">
                  <label>${a("consumes_parts_label",e)}</label>
                  ${this.parts.map(i=>this._renderConsumesRow(i))}
                  ${this._foreignOwners.length?o`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${a("shared_parts_other_objects",e)}</summary>
                          <div class="field-help">${a("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(i=>o`
                              <div class="shared-pool-owner">${i.name}</div>
                              ${i.parts.map(n=>this._renderConsumesRow(n,i.entry_id))}
                            `)}
                        </details>
                      `:p}
                </div>
              `:p}
          <div class="select-row">
            <label>${a("priority",e)}</label>
            <select
              .value=${this._priority}
              @change=${i=>this._priority=i.target.value}
            >
              ${nr.map(i=>o`<option value=${i} ?selected=${i===this._priority}>${a("priority_"+i,e)}</option>`)}
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
              ${or.map(i=>o`<option value=${i} ?selected=${i===this._scheduleType}>${a(i,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?o`
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
                ${this.scheduleTimeEnabled?o`
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
                `:p}
              `:p}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?o`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${e}
                  label="${a("due_date",e)}"
                  .value=${this._dueDate}
                  @value-changed=${i=>this._dueDate=i.detail.value}
                ></ms-date-field>
              `:p}
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
          ${this.checklistsEnabled?o`
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
          `:p}
          ${this._renderPhasesEditor(e)}
          <h3>${a("require_on_completion",e)}</h3>
          <div class="required-completion">
            ${Tt.map(i=>o`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(i)}
                  @change=${n=>this._toggleRequired(i,n.target.checked)}
                />
                <span>${a(Me[i],e)}</span>
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
              ${this._availableUsers.map(i=>o`<option value=${i.id} ?selected=${i.id===this._responsibleUserId}>${i.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?o`
            <div class="field">
              <label>${a("shared_with",e)}</label>
              <div class="field-help">${a("shared_with_help",e)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map(i=>o`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(i.id)}
                      @change=${()=>this._toggleAssignee(i.id)} />
                    <span>${i.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?o`
              <div class="select-row">
                <label>${a("rotation_strategy",e)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${i=>this._rotationStrategy=i.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${a("rotation_none",e)}</option>
                  ${["round_robin","least_completed","random"].map(i=>o`<option value=${i} ?selected=${i===this._rotationStrategy}>${a("rotation_"+i,e)}</option>`)}
                </select>
              </div>`:p}
          `:p}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?o`
            ${this._entityPickerFallback?o`
              <ms-textfield
                label="${a("environmental_entity_optional",e)}"
                helper="${a("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${i=>this._environmentalEntity=i.target.value.trim()}
              ></ms-textfield>
            `:o`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:Fi,device_class:Ui}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>a("environmental_entity_optional",e)}
              .computeHelper=${()=>a("environmental_entity_helper",e)}
              @value-changed=${i=>{this._environmentalEntity=(i.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):p}
          `:p}
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
          ${this._availableTags.length>0?o`
              <div class="select-row">
                <label>${a("nfc_tag_id_optional",e)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${i=>this._nfcTagId=i.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${a("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(i=>o`<option value=${i.id} ?selected=${i.id===this._nfcTagId}>${i.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${a("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:o`
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
          ${this._requireTagScan?o`<div class="field-help">${a("require_tag_scan_help",e)}</div>`:p}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${i=>this._allowSkip=!i.target.checked}
            />
            <span>${a("disallow_skip",e)}</span>
          </label>
          ${this._allowSkip?p:o`<div class="field-help">${a("disallow_skip_help",e)}</div>`}
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
    `}};g._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),g.styles=T`
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
  `,l([y({attribute:!1})],g.prototype,"hass",2),l([y({type:Boolean,attribute:"checklists-enabled"})],g.prototype,"checklistsEnabled",2),l([y({type:Boolean,attribute:"schedule-time-enabled"})],g.prototype,"scheduleTimeEnabled",2),l([y({type:Boolean,attribute:"completion-actions-enabled"})],g.prototype,"completionActionsEnabled",2),l([y({type:Number,attribute:"default-warning-days"})],g.prototype,"defaultWarningDays",2),l([u()],g.prototype,"parts",2),l([u()],g.prototype,"_foreignOwners",2),l([u()],g.prototype,"_open",2),l([u()],g.prototype,"_entityPickerFallback",2),l([u()],g.prototype,"_loading",2),l([u()],g.prototype,"_error",2),l([u()],g.prototype,"_entryId",2),l([u()],g.prototype,"_taskId",2),l([u()],g.prototype,"_objectChoices",2),l([u()],g.prototype,"_name",2),l([u()],g.prototype,"_type",2),l([u()],g.prototype,"_scheduleType",2),l([u()],g.prototype,"_intervalDays",2),l([u()],g.prototype,"_intervalUnit",2),l([u()],g.prototype,"_dueDate",2),l([u()],g.prototype,"_warningDays",2),l([u()],g.prototype,"_earliestCompletionDays",2),l([u()],g.prototype,"_intervalAnchor",2),l([u()],g.prototype,"_weekdays",2),l([u()],g.prototype,"_nth",2),l([u()],g.prototype,"_nthWeekday",2),l([u()],g.prototype,"_domDay",2),l([u()],g.prototype,"_domLastDay",2),l([u()],g.prototype,"_domBusiness",2),l([u()],g.prototype,"_calOffset",2),l([u()],g.prototype,"_seasonMonths",2),l([u()],g.prototype,"_endsMode",2),l([u()],g.prototype,"_endsCount",2),l([u()],g.prototype,"_endsUntil",2),l([u()],g.prototype,"_schedulePreview",2),l([u()],g.prototype,"_schedulePreviewEnded",2),l([u()],g.prototype,"_notes",2),l([u()],g.prototype,"_documentationUrl",2),l([u()],g.prototype,"_customIcon",2),l([u()],g.prototype,"_priority",2),l([u()],g.prototype,"_labels",2),l([u()],g.prototype,"_enabled",2),l([u()],g.prototype,"_triggerEntityId",2),l([u()],g.prototype,"_triggerEntityIds",2),l([u()],g.prototype,"_triggerEntityLogic",2),l([u()],g.prototype,"_triggerAttribute",2),l([u()],g.prototype,"_triggerType",2),l([u()],g.prototype,"_triggerAbove",2),l([u()],g.prototype,"_triggerBelow",2),l([u()],g.prototype,"_triggerEquals",2),l([u()],g.prototype,"_triggerNotEquals",2),l([u()],g.prototype,"_triggerForMinutes",2),l([u()],g.prototype,"_triggerCombinator",2),l([u()],g.prototype,"_triggerTargetValue",2),l([u()],g.prototype,"_triggerDeltaMode",2),l([u()],g.prototype,"_triggerBaselineValue",2),l([u()],g.prototype,"_liveBaselineValue",2),l([u()],g.prototype,"_autoCompleteOnRecovery",2),l([u()],g.prototype,"_triggerFromState",2),l([u()],g.prototype,"_triggerToState",2),l([u()],g.prototype,"_triggerTargetChanges",2),l([u()],g.prototype,"_triggerRuntimeHours",2),l([u()],g.prototype,"_triggerRuntimeMaxSession",2),l([u()],g.prototype,"_triggerOnStates",2),l([u()],g.prototype,"_compoundLogic",2),l([u()],g.prototype,"_compoundConditions",2),l([u()],g.prototype,"_suggestedAttributes",2),l([u()],g.prototype,"_availableAttributes",2),l([u()],g.prototype,"_entityDomain",2),l([u()],g.prototype,"_lastPerformed",2),l([u()],g.prototype,"_nfcTagId",2),l([u()],g.prototype,"_requireTagScan",2),l([u()],g.prototype,"_allowSkip",2),l([u()],g.prototype,"_readingUnit",2),l([u()],g.prototype,"_consumesParts",2),l([u()],g.prototype,"_partsLoadFailed",2),l([u()],g.prototype,"_availableTags",2),l([u()],g.prototype,"_responsibleUserId",2),l([u()],g.prototype,"_assigneePool",2),l([u()],g.prototype,"_rotationStrategy",2),l([u()],g.prototype,"_availableUsers",2),l([u()],g.prototype,"_checklistText",2),l([u()],g.prototype,"_phaseDefs",2),l([u()],g.prototype,"_phaseSeq",2),l([u()],g.prototype,"_requiredCompletion",2),l([u()],g.prototype,"_scheduleTime",2),l([u()],g.prototype,"_actionService",2),l([u()],g.prototype,"_actionTargetEntity",2),l([u()],g.prototype,"_actionData",2),l([u()],g.prototype,"_actionDataJsonFallback",2),l([u()],g.prototype,"_actionTesting",2),l([u()],g.prototype,"_actionTestResult",2),l([u()],g.prototype,"_actionTestError",2),l([u()],g.prototype,"_qcNotes",2),l([u()],g.prototype,"_qcCost",2),l([u()],g.prototype,"_qcDuration",2),l([u()],g.prototype,"_qcFeedback",2),l([u()],g.prototype,"_environmentalEntity",2),l([u()],g.prototype,"_environmentalAttribute",2),l([u()],g.prototype,"_adaptiveEnabled",2),l([u()],g.prototype,"_adaptiveAlpha",2),l([u()],g.prototype,"_adaptiveMin",2),l([u()],g.prototype,"_adaptiveMax",2),l([u()],g.prototype,"_adaptiveSeasonal",2),l([u()],g.prototype,"_adaptivePrediction",2),l([u()],g.prototype,"_conditionAttrOptions",2);Nt=g;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",Nt)});var K,Ki=w(()=>{"use strict";R();M();q();oe();xe();K=class extends A{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal=""}get _lang(){return N(this.hass)}openEdit(e){this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._loadPartOptions()}async _loadPartOptions(){let e=this._draft;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"}),i=[];for(let c of t.parts||[]){let d=c.entry_id===e.entry_id,h=c.consumers.some(_=>_.entry_id===e.entry_id&&_.task_id===e.task_id);!d&&!h||i.push({part_id:c.part_id,name:c.name,entry_id:c.entry_id,foreign:!d,object_name:c.object_name})}for(let c of e.used_parts||[]){let d=c.entry_id||e.entry_id;i.some(h=>h.part_id===c.part_id&&h.entry_id===d)||i.push({part_id:c.part_id,name:c.name||c.part_id,entry_id:d,foreign:d!==e.entry_id,object_name:null})}let n={};for(let c of e.used_parts||[])n[`${c.entry_id||e.entry_id}:${c.part_id}`]=c.quantity??1;this._partOptions=i,this._partQty=n,this._partQtyOriginal=this._partSelectionKey()}catch{this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,e])=>e>0).sort(([e],[t])=>e.localeCompare(t)))}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let e={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(e.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(e.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(e.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(e.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(e.completed_by=this._draft.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(e.used_parts=(this._partOptions||[]).filter(i=>(this._partQty[`${i.entry_id}:${i.part_id}`]||0)>0).map(i=>({part_id:i.part_id,quantity:this._partQty[`${i.entry_id}:${i.part_id}`],...i.foreign?{entry_id:i.entry_id}:{}}))),Object.keys(e).filter(i=>!["type","entry_id","task_id","original_timestamp"].includes(i)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(e),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=C(e,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return p;let e=this._lang,t=this._draft;return o`
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
        ${this._partOptions&&this._partOptions.length>0?o`
          <div class="parts-block">
            <span class="parts-title">${a("complete_parts_used",e)}</span>
            ${this._partOptions.map(i=>{let n=`${i.entry_id}:${i.part_id}`,c=this._partQty[n]||0;return o`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${c>0}
                    @change=${d=>{let h=d.target.checked;this._partQty={...this._partQty,[n]:h?1:0}}} />
                  <span class="part-label">${i.name}${i.foreign&&i.object_name?` (${i.object_name})`:""}</span>
                  ${c>0?o`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(c)}
                      @input=${d=>{let h=parseFloat(d.target.value);!isNaN(h)&&h>0&&(this._partQty={...this._partQty,[n]:h})}} />
                  `:p}
                </label>
              `})}
          </div>
        `:p}
        ${this._error?o`<div class="error">${this._error}</div>`:p}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${a("cancel",e)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?a("saving",e)||"Saving\u2026":a("save",e)||"Save"}
          </button>
        </div>
      </div>
    `}};K.styles=T`
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
  `,l([y({attribute:!1})],K.prototype,"hass",2),l([u()],K.prototype,"_open",2),l([u()],K.prototype,"_saving",2),l([u()],K.prototype,"_error",2),l([u()],K.prototype,"_draft",2),l([u()],K.prototype,"_partOptions",2),l([u()],K.prototype,"_partQty",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",K)});function $e(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Yi(r){return!r.startsWith("data:image/svg+xml,")&&!r.startsWith("data:image/png;base64,")?"":$e(r)}function gr(r){return r.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var B,Gi=w(()=>{"use strict";R();M();q();kt();B=class extends A{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(e,t,i,n){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=n,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...t,action:"view"})];this._taskId&&i.push(this.hass.connection.sendMessagePromise({...t,action:"complete"}));let n=await Promise.all(i);if(e!==this._generateSeq)return;this._viewResult=n[0],n.length>1&&(this._completeResult=n[1])}catch(t){if(e!==this._generateSeq)return;let i=t?.code,n=t?.message;this._error=i==="no_url"||typeof n=="string"&&n.includes("No Home Assistant URL")?a("qr_error_no_url",this.lang):a("qr_error",this.lang)}finally{e===this._generateSeq&&(this._loading=!1)}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),n=window.open("","_blank","width=600,height=500");if(!n)return;let c=this.lang||"en",d=$e(t),h=$e(i),_=!!this._completeResult,f=$e(a("qr_action_view",c)),x=$e(a("qr_action_complete",c));n.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${d}</title>
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
  .qr-col img{width:${_?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${d}</h2>
${h?`<div class="sub">${h}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${Yi(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${f}</div>
  </div>
  ${_?`<div class="qr-col">
    <img src="${Yi(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${x}</div>
  </div>`:""}
</div>
<div class="url">${$e(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),n.document.close()}_downloadSvg(e,t){let i=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),n=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;qi(i,`qr-${gr(n)}-${t}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return o``;let e=this.lang||this.hass?.language||"en",t=this._taskName?`${a("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${a("qr_code",e)}: ${this._objectName}`,i=!!this._viewResult;return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._loading?o`<div class="loading">${a("qr_generating",e)}</div>`:this._error?o`<div class="error">${this._error}</div>`:i?o`
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
                      ${this._completeResult?o`
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
                          `:p}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:p}
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
    `}};B.styles=T`
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
  `,l([y({attribute:!1})],B.prototype,"hass",2),l([y()],B.prototype,"lang",2),l([u()],B.prototype,"_open",2),l([u()],B.prototype,"_loading",2),l([u()],B.prototype,"_error",2),l([u()],B.prototype,"_viewResult",2),l([u()],B.prototype,"_completeResult",2),l([u()],B.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",B)});var Qi=w(()=>{"use strict"});function Ji(r){let s=r.getFullYear(),e=String(r.getMonth()+1).padStart(2,"0"),t=String(r.getDate()).padStart(2,"0");return`${s}-${e}-${t}`}var Zi=w(()=>{"use strict";Qi()});function Xi(r,s){let e=r.interval_analysis,t=e?.weibull_beta,i=e?.weibull_eta;if(t==null||i==null||i<=0)return p;let n=r.interval_days??0,c=r.suggested_interval??n;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${a("weibull_reliability_curve",s)}
        ${mr(t,s)}
      </div>
      ${fr(t,i,n,c,s)}
      ${vr(e,s)}
      ${e?.confidence_interval_low!=null?br(e,r,s):p}
    </div>
  `}function mr(r,s){let e,t,i;return r<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):r<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):r<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),o`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${a(i,s)} (\u03B2=${D(r,s,2)})
    </span>
  `}function fr(r,s,e,t,i){let b=Math.max(e,t,s,1)*1.3,m=50,$=[];for(let V=0;V<=m;V++){let Y=V/m*b,fs=1-Math.exp(-Math.pow(Y/s,r)),vs=32+Y/b*260,bs=136-fs*128;$.push([vs,bs])}let O=$.map(([V,Y])=>`${E(V)},${E(Y)}`).join(" "),I="M32,136 "+$.map(([V,Y])=>`L${E(V)},${E(Y)}`).join(" ")+` L${E($[m][0])},136 Z`,S=32+e/b*260,L=1-Math.exp(-Math.pow(e/s,r)),_e=136-L*128,gs=D((1-L)*100,i,0),Ut=32+t/b*260,ms=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_weibull",i)}">
        ${ms.map(V=>{let Y=136-V*128;return fe`
            <line x1="${32}" y1="${E(Y)}" x2="${292}" y2="${E(Y)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${V===.5?"4,3":p}" />
            <text x="${28}" y="${E(Y+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${D(V*100,i,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b)}</text>

        <path d="${I}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${O}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?fe`
          <line x1="${E(S)}" y1="${8}" x2="${E(S)}" y2="${E(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${E(S)}" cy="${E(_e)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${E(S+4)}" y="${E(_e-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${gs}%</text>
        `:p}

        ${t>0&&t!==e?fe`
          <line x1="${E(Ut)}" y1="${8}" x2="${E(Ut)}" y2="${E(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:p}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${a("weibull_failure_probability",i)}</span>
      ${e>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${a("current_interval_marker",i)}</span>`:p}
      ${t>0&&t!==e?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${a("recommended_marker",i)}</span>`:p}
    </div>
  `}function vr(r,s){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${a("characteristic_life",s)}</span>
        <span class="weibull-info-value">${Math.round(r.weibull_eta)} ${a("days",s)}</span>
      </div>
      ${r.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${a("weibull_r_squared",s)}</span>
          <span class="weibull-info-value">${D(r.weibull_r_squared,s,3)}</span>
        </div>
      `:p}
    </div>
  `}function br(r,s,e){let t=r.confidence_interval_low,i=r.confidence_interval_high,n=s.suggested_interval??s.interval_days??0,c=s.interval_days??0,d=Math.max(0,t-5),_=i+5-d,f=(t-d)/_*100,x=(i-t)/_*100,v=(n-d)/_*100,b=c>0?(c-d)/_*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${a("confidence_interval",e)}: ${n} ${a("days",e)} (${t}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${E(f)}%;width:${E(x)}%"></div>
        ${b>=0?o`<div class="confidence-marker current" style="left:${E(b)}%"></div>`:p}
        <div class="confidence-marker recommended" style="left:${E(v)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${a("confidence_conservative",e)} (${t}${a("days",e).charAt(0)})</span>
        <span class="confidence-text high">${a("confidence_aggressive",e)} (${i}${a("days",e).charAt(0)})</span>
      </div>
    </div>
  `}var es=w(()=>{"use strict";R();q();st()});function ts(r,s,e){let t=r.degradation_trend!=null&&r.degradation_trend!=="insufficient_data",i=r.days_until_threshold!=null,n=r.environmental_factor!=null&&r.environmental_factor!==1;if(!t&&!i&&!n)return p;let c=r.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":r.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${r.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${a("sensor_prediction_urgency",s).replace("{days}",String(Math.round(r.days_until_threshold||0)))}
        </div>
      `:p}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${a("sensor_prediction",s)}
      </div>
      <div class="prediction-grid">
        ${t?o`
          <div class="prediction-item">
            <ha-svg-icon path="${c}"></ha-svg-icon>
            <span class="prediction-label">${a("degradation_trend",s)}</span>
            <span class="prediction-value ${r.degradation_trend}">${a("trend_"+r.degradation_trend,s)}</span>
            ${r.degradation_rate!=null?o`<span class="prediction-rate">${r.degradation_rate>0?"+":""}${D(r.degradation_rate,s,Math.abs(r.degradation_rate)>=10?0:1)} ${r.trigger_entity_info?.unit_of_measurement||""}/${a("day_short",s)}</span>`:p}
          </div>
        `:p}
        ${i?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${a("days_until_threshold",s)}</span>
            <span class="prediction-value prediction-days${r.days_until_threshold===0?" exceeded":r.sensor_prediction_urgency?" urgent":""}">${r.days_until_threshold===0?a("threshold_exceeded",s):"~"+Math.round(r.days_until_threshold)+" "+a("days",s)}</span>
            ${r.threshold_prediction_date?o`<span class="prediction-date">${W(r.threshold_prediction_date,s)}</span>`:p}
            ${r.threshold_prediction_confidence?o`<span class="confidence-dot ${r.threshold_prediction_confidence}"></span>`:p}
            ${(r.prediction_cycles??0)>0?o`<span class="prediction-cycles">${a("prediction_cycles",s)}: ${r.prediction_cycles}</span>`:p}
          </div>
        `:p}
        ${n&&e.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${a("environmental_adjustment",s)}</span>
            <span class="prediction-value">${D(r.environmental_factor,s,2)}x</span>
            ${r.environmental_entity?o`<span class="prediction-entity entity-link" @click=${d=>Li(d,r.environmental_entity)}>${r.environmental_entity}</span>`:p}
          </div>
        `:p}
      </div>
    </div>
  `}var is=w(()=>{"use strict";R();q()});function ss(r,s,e,t){let i=Math.max(r||1,s);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${a("current",t)}: ${r??"\u2014"} ${r!=null?a("days",t):""}
        </div>
        <div class="interval-visual current"
          style="width: ${r!=null?Math.min(r/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${a("recommended",t)}: ${s} ${a("days",t)}
          <span class="confidence-badge ${e}">${a(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(s/i*100,100)}%"></div>
      </div>
    </div>
  `}var rs=w(()=>{"use strict";R();q()});function ns(r,s,e){if(!e.seasonal||!r.seasonal_factor||r.seasonal_factor===1)return p;let t=as.map(d=>a(d,s)),i=new Date().getMonth(),n=r.seasonal_factors||r.interval_analysis?.seasonal_factors||null,c=n&&n.length===12?n:t.map((d,h)=>{let _=r.seasonal_factor||1,f=Math.sin((h-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,_+f))});return o`
    <div class="seasonal-card-compact">
      <h4>${a("seasonal_awareness",s)}</h4>
      <div class="seasonal-mini-chart">
        ${c.map((d,h)=>{let _=d*40,f=d<.9?"low":d>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${f} ${h===i?"current":""}"
                 style="height: ${_}px"
                 title="${t[h]}: ${D(d,s,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${a("shorter",s)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${a("normal",s)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${a("longer",s)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function os(r,s){return yr(r,s)}function yr(r,s){let e=r.seasonal_factors??r.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return p;let t=r.interval_analysis?.seasonal_reason,i=new Date().getMonth(),n=300,c=100,d=8,_=c-d-4,f=Math.max(...e,1.5),x=n/12,v=x*.65,b=d+_-1/f*_;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${a("seasonal_chart_title",s)}
        ${t?o`<span class="source-tag">${t==="learned"?a("seasonal_learned",s):a("seasonal_manual",s)}</span>`:p}
      </div>
      <svg viewBox="0 0 ${n} ${c}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${a("chart_seasonal",s)}">
        <line x1="0" y1="${E(b)}" x2="${n}" y2="${E(b)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((m,$)=>{let O=m/f*_,I=$*x+(x-v)/2,S=d+_-O,L=$===i,_e=m<1?"var(--success-color, #4caf50)":m>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return fe`
            <rect x="${E(I)}" y="${E(S)}"
              width="${E(v)}" height="${E(O)}"
              fill="${_e}" opacity="${L?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${as.map((m,$)=>o`<span class="seasonal-label ${$===i?"active-month":""}">${a(m,s)}</span>`)}
      </div>
    </div>
  `}var as,ls=w(()=>{"use strict";R();q();st();as=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"]});var j,cs=w(()=>{"use strict";R();M();q();oe();Zi();it();et();es();is();rs();xe();ls();j=class extends A{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._featuresLoaded=!1;this._currencySymbol=""}get _lang(){return N(this.hass)}async openFor(e,t){this._entryId=e,this._taskId=t,this._error="",this._showSkip=!1,this._showReset=!1,this._showAdaptive=!1,this._skipReason="",this._resetDate=Ji(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){if(!this._featuresLoaded)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});e?.features&&(this._features={...this._features,...e.features}),this._currencySymbol=e?.budget?.currency_symbol||"",this._featuresLoaded=!0}catch{}}close(){this._open=!1,this._task=null,this._error=""}async _loadTask(){if(!(!this._entryId||!this._taskId))try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._objectName=e.object?.name||"";let t=(e.tasks||[]).find(i=>i.id===this._taskId);this._task=t??null}catch(e){this._error=C(e,this._lang)}}async _runWs(e){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(e),this._busy=!1,!0}catch(t){return this._error=C(t,this._lang),this._busy=!1,!1}}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(J(),ie)).then(async({openCompleteDialog:e})=>{let t=this._task,i=[];try{i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}e(Oe({entryId:this._entryId,taskId:this._taskId,taskName:t.name,task:t,objects:i,lang:this._lang,checklist:t.checklist||[],adaptiveEnabled:!!t.adaptive_config?.enabled,currencySymbol:this._currencySymbol}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})&&(this._notifyChanged("reset"),this.close())}_onEdit(){!this._entryId||!this._taskId||Promise.resolve().then(()=>(J(),ie)).then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(J(),ie)).then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let e=a("delete_task_confirm",this._lang)||`Delete "${this._task?.name}"?`;if(!window.confirm(e))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})&&(this._toast=a("suggestion_applied",this._lang)||"Applied",this._notifyChanged("apply_suggestion"),await this._loadTask(),setTimeout(()=>{this._toast=""},2500))}async _reanalyzeInterval(){if(!(!this._entryId||!this._taskId)){this._busy=!0,this._error="";try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});this._toast=e.recommended_interval?`${a("reanalyze_result",this._lang)||"Recomputed"}: ${Ge(e.recommended_interval,"days",this._lang)} (${e.data_points} pts)`:a("reanalyze_insufficient_data",this._lang)||"Not enough data",await this._loadTask(),setTimeout(()=>{this._toast=""},3500)}catch(e){this._error=C(e,this._lang)}finally{this._busy=!1}}}_onEditHistoryEntry(e){!this._entryId||!this._taskId||Promise.resolve().then(()=>(J(),ie)).then(({openHistoryEditDialog:t})=>{t({entry_id:this._entryId,task_id:this._taskId,original_timestamp:e.timestamp,type:e.type,timestamp:e.timestamp,notes:e.notes??null,cost:e.cost??null,duration:e.duration??null,completed_by:e.completed_by??null,used_parts:e.used_parts??null})})}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return p;let t=this._lang;return o`
      <div class="recommendation-card">
        <h4>${a("suggested_interval",t)}</h4>
        ${ss(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",t)}
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
    `}_renderAdaptive(e){let t=this._lang,i=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,n=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,c=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,d=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!i&&!n&&!c&&!d?o`<div class="adaptive-empty">
        ${a("adaptive_no_data",t)||"Not enough completion history yet for adaptive analysis."}
      </div>`:o`
      <div class="adaptive-stack">
        ${this._toast?o`<div class="toast">${this._toast}</div>`:p}
        ${i?this._renderRecommendation(e):p}
        ${n?ts(e,t,this._features):p}
        ${c?Xi(e,t):p}
        ${d?o`
          ${ns(e,t,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?os(e,t):p}
        `:p}
      </div>
    `}_renderDetails(e){let t=this._lang,i=e.history||[],n=i.filter(h=>h.type==="completed"),c=n.reduce((h,_)=>h+(typeof _.cost=="number"?_.cost:0),0),d=(()=>{let h=n.map(_=>typeof _.duration=="number"?_.duration:null).filter(_=>_!=null);return h.length?Math.round(h.reduce((_,f)=>_+f,0)/h.length):null})();return o`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${a("times_performed",t)||"Performed"}</span>
            <span class="stat-value">${n.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${a("total_cost",t)||"Total cost"}</span>
            <span class="stat-value">${D(c,t,2)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${a("avg_duration",t)||"Avg duration"}</span>
            <span class="stat-value">${d!=null?`${d}m`:"\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${a("history",t)||"History"}</strong>
          <span class="history-count">${i.length}</span>
        </div>
        ${i.length===0?o`<div class="history-empty">${a("history_empty",t)||"No history yet."}</div>`:o`
              <div class="history-list">
                ${[...i].reverse().slice(0,20).map(h=>{let _=["completed","reset","skipped"].includes(h.type);return o`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${h.type}">${a(h.type,t)}</span>
                        <span class="history-date">${Ci(h.timestamp,t)}</span>
                        ${_?o`<button class="history-edit"
                                   title="${a("history_edit_button",t)||"Edit"}"
                                   @click=${()=>this._onEditHistoryEntry(h)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>`:p}
                      </div>
                      ${h.notes?o`<div class="history-notes">${h.notes}</div>`:p}
                      ${h.cost!=null||h.duration!=null?o`<div class="history-meta">
                            ${h.cost!=null?o`<span>💰 ${D(h.cost,t,2)}</span>`:p}
                            ${h.duration!=null?o`<span>⏱️ ${h.duration}m</span>`:p}
                          </div>`:p}
                    </div>
                  `})}
                ${i.length>20?o`<div class="history-more">… +${i.length-20} ${a("older_entries",t)||"older"}</div>`:p}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return p;let e=this._lang,t=this._task,i=this.hass?.user?.is_admin??!0;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${t?o`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${he[t.status]||"#ccc"}"></span>
                  <span class="task-name">${t.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&Promise.resolve().then(()=>(J(),ie)).then(({openObjectQuickActions:n})=>{n(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${t.next_due?o`<span><strong>${a("next_due",e)||"Next due"}:</strong> ${W(t.next_due,e)}</span>`:p}
                  ${t.last_performed?o`<span><strong>${a("last_performed",e)||"Last"}:</strong> ${W(t.last_performed,e)}</span>`:p}
                  ${t.schedule?.kind&&!["manual","one_time"].includes(t.schedule.kind)||t.interval_days!=null?o`<span><strong>${a("interval",e)||"Interval"}:</strong> ${Pi(t,e)}</span>`:p}
                  ${ne(t)?o`<span><strong>${a("phase_current",e)}:</strong> ${ne(t)}</span>`:p}
                </div>
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:p}

              ${this._showSkip?o`
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
                  `:this._showReset?o`
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
                  `:o`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${this._onComplete} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${a("complete",e)||"Complete"}
                      </ha-button>
                      ${t.allow_skip!==!1?o`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${a("skip",e)||"Skip"}
                            </ha-button>
                          `:p}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${a("reset",e)||"Reset"}
                      </ha-button>
                    </div>
                    ${i?o`
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
                        `:p}
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?a("hide_details",e)||"Hide details":a("show_details",e)||"Show history + stats"}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?o`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?a("hide_stats",e)||"Hide stats":a("show_stats",e)||"Show stats + graphs"}
                          </button>`:p}
                    </div>
                    ${this._showDetails?this._renderDetails(t):p}
                    ${this._showAdaptive?this._renderAdaptive(t):p}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${a("open_in_panel",e)||"Open in Maintenance panel"}
                      </button>
                    </div>
                  `}
            `:o`<div class="loading">${a("loading",e)||"Loading\u2026"}</div>`}
      </div>
    `}};j.styles=[Je,T`
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
  `],l([y({attribute:!1})],j.prototype,"hass",2),l([u()],j.prototype,"_open",2),l([u()],j.prototype,"_entryId",2),l([u()],j.prototype,"_taskId",2),l([u()],j.prototype,"_task",2),l([u()],j.prototype,"_objectName",2),l([u()],j.prototype,"_busy",2),l([u()],j.prototype,"_error",2),l([u()],j.prototype,"_showSkip",2),l([u()],j.prototype,"_showReset",2),l([u()],j.prototype,"_showDetails",2),l([u()],j.prototype,"_showAdaptive",2),l([u()],j.prototype,"_skipReason",2),l([u()],j.prototype,"_resetDate",2),l([u()],j.prototype,"_features",2),l([u()],j.prototype,"_toast",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",j)});function ds(r){return r?customElements.get("ha-markdown")?o`<ha-markdown class="notes-md" .content=${r} breaks></ha-markdown>`:o`${r}`:p}var ps=w(()=>{"use strict";R()});var Z,hs=w(()=>{"use strict";R();Et();ps();M();q();oe();Z=class extends A{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error=""}get _lang(){return N(this.hass)}async openFor(e){this._entryId=e,this._error="",this._open=!0,await this._load()}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this._data=e}catch(e){this._error=C(e,this._lang)}}_onEditObject(){!this._entryId||!this._data||Promise.resolve().then(()=>(J(),ie)).then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&Promise.resolve().then(()=>(J(),ie)).then(({openCreateTaskDialog:e})=>{e(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data)return;let e=a("delete_object_confirm",this._lang)||`Delete "${this._data.object.name}" and all its tasks?`;if(window.confirm(e)){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=C(t,this._lang)}finally{this._busy=!1}}}async _onArchiveObject(){if(!this._entryId||!this._data)return;let e=!!this._data.object.archived;if(!e){let t=a("confirm_archive_object",this._lang)||"Archive this object and its tasks?";if(!window.confirm(t))return}this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:this._entryId}),this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:this._entryId},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=C(t,this._lang)}finally{this._busy=!1}}_onTaskClick(e){this._entryId&&Promise.resolve().then(()=>(J(),ie)).then(({openTaskQuickActions:t})=>{t(this._entryId,e)})}render(){if(!this._open)return p;let e=this._lang,t=this._data,i=t?.object,n=t?.tasks||[],c=this.hass?.user?.is_admin??!0;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${t&&i?o`
              <div class="header">
                <div class="title">${i.name}</div>
                ${this._renderMetaRow(i)}
              </div>

              ${this._error?o`<div class="error">${this._error}</div>`:p}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${a("tasks",e)||"Tasks"}</strong>
                  <span class="count">${n.length}</span>
                </div>
                ${n.length===0?o`<div class="empty">${a("no_tasks",e)||"No tasks yet."}</div>`:o`
                      <div class="task-list">
                        ${n.map(d=>o`
                          <div class="task-row" @click=${()=>this._onTaskClick(d.id)}>
                            <span class="status-dot" style="background: ${he[d.status]||"#ccc"}"></span>
                            <span class="task-name">${d.name}</span>
                            <span class="task-status">${a(d.status||"ok",e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?o`
                    <div class="notes-section">
                      <strong>${a("object_notes_label",e)}</strong>
                      <div class="notes-body">${ds(i.notes)}</div>
                    </div>
                  `:p}

              ${c?o`
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
                  `:p}
            `:o`<div class="loading">${a("loading",e)||"Loading\u2026"}</div>`}
      </div>
    `}_renderMetaRow(e){let t=this._lang,i=[];return e.area_id&&i.push([a("area",t),e.area_id]),e.manufacturer&&i.push([a("manufacturer",t),e.manufacturer]),e.model&&i.push([a("model",t),e.model]),e.serial_number&&i.push([a("serial_number_label",t),e.serial_number]),e.installation_date&&i.push([a("installed",t),e.installation_date]),e.warranty_expiry&&i.push([a("warranty",t),e.warranty_expiry]),e.documentation_url&&i.push([a("documentation_url_label",t),e.documentation_url]),i.length===0?p:o`
      <div class="meta">
        ${i.map(([n,c])=>o`
            <div class="meta-item">
              <span class="meta-label">${n}</span>
              <span class="meta-value">${Ze(c)?o`<a href="${c}" target="_blank" rel="noopener noreferrer">${c}</a>`:c}</span>
            </div>
          `)}
      </div>
    `}};Z.styles=T`
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
  `,l([y({attribute:!1})],Z.prototype,"hass",2),l([u()],Z.prototype,"_open",2),l([u()],Z.prototype,"_entryId",2),l([u()],Z.prototype,"_data",2),l([u()],Z.prototype,"_busy",2),l([u()],Z.prototype,"_error",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",Z)});var ie={};xs(ie,{__resetSettingsCacheForTests:()=>Ar,getRowActionStyle:()=>Ot,openCompleteDialog:()=>Pr,openCreateObjectDialog:()=>Mt,openCreateTaskDialog:()=>zt,openEditObjectDialog:()=>Tr,openEditTaskDialog:()=>Cr,openHistoryEditDialog:()=>Ir,openObjectQuickActions:()=>Rr,openQrDialog:()=>Lr,openTaskQuickActions:()=>Ft});function rt(){return document.querySelector("home-assistant")?.hass}function Sr(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function se(r){let s=Sr(),e=s.querySelector(r)??document.body.querySelector(r);return e?e.parentNode!==s&&s.appendChild(e):(e=document.createElement(r),s.appendChild(e)),e}function re(r){let s=rt();if(!s)return!1;r.hass=s;let e=N(s);return xt(e)||He(e).then(()=>{r.requestUpdate?.()}),wt(s.locale,s.config?.country),!0}function Ot(r){return Dt(r).then(s=>s.rowActionStyle)}function Ar(){ze=null}function Dt(r){return ze||(ze=r.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(s=>({features:s.features??Ht.features,defaultWarningDays:s.general?.default_warning_days??7,rowActionStyle:s.general?.row_action_style??Ht.rowActionStyle})).catch(()=>Ht),ze)}function Mt(){let r=se(us);return re(r)?(r.openCreate(),!0):!1}function Tr(r,s){let e=se(us);return re(e)?(e.openEdit(r,s),!0):!1}function zt(r="",s){let e=se(_s);if(!re(e))return!1;let t=rt();return t?((async()=>{let i=await Dt(t),n=e;n.checklistsEnabled=i.features.checklists,n.scheduleTimeEnabled=i.features.schedule_time,n.completionActionsEnabled=i.features.completion_actions,n.defaultWarningDays=i.defaultWarningDays,n.openCreate(r,s)})(),!0):!1}function Cr(r,s){let e=se(_s);if(!re(e))return!1;let t=rt();return t?((async()=>{try{let[i,n]=await Promise.all([t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:r}),Dt(t)]),c=(i.tasks||[]).find(h=>h.id===s);if(!c){console.warn(`openEditTaskDialog: task ${s} not found in entry ${r}`);return}let d=e;d.checklistsEnabled=n.features.checklists,d.scheduleTimeEnabled=n.features.schedule_time,d.completionActionsEnabled=n.features.completion_actions,d.defaultWarningDays=n.defaultWarningDays,await d.openEdit(r,c)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function Ir(r){let s=se(xr);return re(s)?(s.openEdit(r),!0):!1}function Pr(r){let s=se(wr);return re(s)?(De(s,r,rt()?.language||"en"),!0):!1}function Lr(r){let s=se($r);return re(s)?(s.openForTask(r.entry_id,r.task_id,r.object_name,r.task_name),!0):!1}function Ft(r,s){let e=se(kr);return re(e)?(e.openFor(r,s),!0):!1}function Rr(r){let s=se(Er);return re(s)?(s.openFor(r),!0):!1}var us,_s,xr,wr,$r,kr,Er,Ht,ze,J=w(()=>{"use strict";zi();Wi();It();Ki();Gi();cs();hs();q();it();us="maintenance-object-dialog",_s="maintenance-task-dialog",xr="maintenance-history-edit-dialog",wr="maintenance-complete-dialog",$r="maintenance-qr-dialog",kr="maintenance-task-quick-actions-dialog",Er="maintenance-object-quick-actions-dialog";Ht={features:{adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact"};ze=null});R();var js=["assignee_pool","required_completion_fields","checklist","labels","history"],Ns=["checklist_progress"],Hs=["tasks","parts"],Os=["manual_docs","battery_fleet_excluded"];function vt(r,s,e=[]){for(let t of s)r[t]===void 0&&(r[t]=[]);for(let t of e)r[t]===void 0&&(r[t]={})}function Ds(r){let s=r;vt(s,Hs),s.object&&typeof s.object=="object"&&vt(s.object,Os);for(let e of s.tasks)vt(e,js,Ns);return r}function Re(r){for(let s of r)Ds(s);return r}function Ms(r,s){if(s.objects)return s.objects;let e=s.delta||[],t=s.removed||[];if(!e.length&&!t.length)return null;let i=new Map(r.map(n=>[n.entry_id,n]));for(let n of e)i.set(n.entry_id,n);for(let n of t)i.delete(n);return[...i.values()]}function di(r,s){return s.objects&&Re(s.objects),s.delta&&Re(s.delta),Ms(r,s)}M();q();kt();async function Gs(r,s,e=300){return(await r.connection.sendMessagePromise({type:"auth/sign_path",path:s,expires:e})).path}async function Qs(r,s,e=300){return Gs(r,`/api/maintenance_supporter/document/${s}`,e)}async function ji(r,s,e=""){let t=window.open("about:blank","_blank");try{let i=await Qs(r,s);t&&(t.location.href=new URL(i+e,window.location.origin).href)}catch(i){throw t&&t.close(),i}}Et();function Xe(r){let s=window;s.customCards=s.customCards||[],s.customCards.some(e=>e.type===r.type)||s.customCards.push(r)}St();et();it();R();M();q();var Xs=["overdue","triggered","due_soon","ok"],Q=class extends A{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._loadingObjects=!0;this._loadError=!1;this._views=[];this._objectsLoaded=!1;this._onEntitiesChanged=e=>{this._valueChanged("entity_ids",e.detail.value||[])}}get _lang(){return N(this.hass)}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._objectsLoaded&&(this._objectsLoaded=!0,this._loadObjects())}async _loadObjects(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=e.objects||[],this._loadError=!1}catch{this._objects=[],this._loadError=!0}this._loadingObjects=!1;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._views=e.views||[]}catch{this._views=[]}}_valueChanged(e,t){let i={...this._config,[e]:t};(Array.isArray(t)&&t.length===0||t==="")&&delete i[e],this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i}}))}_toggleStatus(e,t){let i=new Set(this._config.filter_status||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_status",[...i])}_toggleObject(e,t){let i=new Set(this._config.filter_objects||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_objects",[...i])}_toggleLabel(e,t){let i=new Set(this._config.filter_labels||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_labels",[...i])}_toggleArea(e,t){let i=new Set(this._config.filter_areas||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_areas",[...i])}_togglePriority(e,t){let i=new Set(this._config.filter_priority||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_priority",[...i])}render(){let e=this._lang,t=new Set(this._config.filter_status||[]),i=new Set(this._config.filter_objects||[]),n=[...this._objects].map(m=>m.object.name).sort((m,$)=>m.localeCompare($)),c=new Set(this._config.filter_areas||[]),d=[...new Set(this._objects.map(m=>m.object.area_id).filter(m=>!!m).concat([...c]))],h=m=>this.hass?.areas?.[m]?.name||m,_=d.map(m=>({id:m,name:h(m)})).sort((m,$)=>m.name.localeCompare($.name)),f=new Set(this._config.filter_labels||[]),x=new Set(this._config.filter_priority||[]),v=[...new Set(this._objects.flatMap(m=>m.tasks.flatMap($=>$.labels||[])))].sort((m,$)=>m.localeCompare($)),b=[];for(let m of this._objects)for(let $ of m.tasks)$.sensor_entity_id&&b.push($.sensor_entity_id),$.binary_sensor_entity_id&&b.push($.binary_sensor_entity_id);return o`
      <div class="editor">
        <ha-textfield
          label="${a("card_title",e)}"
          .value=${this._config.title||""}
          @input=${m=>this._valueChanged("title",m.target.value)}
        ></ha-textfield>

        <!-- Status filter (chip row) -->
        <div class="field">
          <div class="field-label">${a("card_filter_status",e)}</div>
          <div class="chip-row">
            ${Xs.map(m=>o`
              <label class="chip ${t.has(m)?"active":""}">
                <input type="checkbox"
                  .checked=${t.has(m)}
                  @change=${$=>this._toggleStatus(m,$.target.checked)} />
                ${a(m,e)}
              </label>
            `)}
          </div>
          <div class="field-help">${a("card_filter_status_help",e)}</div>
        </div>

        <!-- Object filter (multi-checkbox) -->
        <div class="field">
          <div class="field-label">${a("card_filter_objects",e)}</div>
          ${this._loadingObjects?o`<div class="field-help">${a("card_loading_objects",e)}</div>`:this._loadError?o`<div class="field-help error-text">${a("card_load_error",e)}</div>`:n.length===0?o`<div class="field-help">${a("no_objects",e)}</div>`:o`
                <div class="object-list">
                  ${n.map(m=>o`
                    <label class="object-row">
                      <input type="checkbox"
                        .checked=${i.has(m)}
                        @change=${$=>this._toggleObject(m,$.target.checked)} />
                      <span>${m}</span>
                    </label>
                  `)}
                </div>
                <div class="field-help">${a("card_filter_objects_help",e)}</div>
              `}
        </div>
        <!-- Area filter (C8): selects whole objects by the room they sit in.
             Hidden while no object has an area — the section would be an
             empty box otherwise. -->
        ${_.length?o`
        <div class="field">
          <div class="field-label">${a("card_filter_areas",e)}</div>
          <div class="object-list">
            ${_.map(m=>o`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${c.has(m.id)}
                  @change=${$=>this._toggleArea(m.id,$.target.checked)} />
                <span>${m.name}</span>
              </label>
            `)}
          </div>
          <div class="field-help">${a("card_filter_areas_help",e)}</div>
        </div>`:p}
        ${v.length?o`
        <div class="field">
          <div class="field-label">${a("labels",e)}</div>
          <div class="object-list">
            ${v.map(m=>o`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${f.has(m)}
                  @change=${$=>this._toggleLabel(m,$.target.checked)} />
                <span>${m}</span>
              </label>
            `)}
          </div>
        </div>`:p}
        <div class="field">
          <div class="field-label">${a("priority",e)}</div>
          <div class="object-list">
            ${["high","normal","low"].map(m=>o`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${x.has(m)}
                  @change=${$=>this._togglePriority(m,$.target.checked)} />
                <span>${a(`priority_${m}`,e)}</span>
              </label>
            `)}
          </div>
          <div class="field-help">${a("card_filter_priority_help",e)}</div>
        </div>

        <!-- Entity-id filter (HA-native pattern). Limited to our integration's
             sensor + binary_sensor entities via includeEntities so the picker
             stays usable on installs with thousands of entities. -->
        <div class="field">
          <div class="field-label">${a("card_filter_entities",e)}</div>
          <ha-entities-picker
            .hass=${this.hass}
            .value=${this._config.entity_ids||[]}
            .includeDomains=${["sensor","binary_sensor"]}
            .includeEntities=${b}
            @value-changed=${this._onEntitiesChanged}
          ></ha-entities-picker>
          <div class="field-help">${a("card_filter_entities_help",e)}</div>
        </div>

        <!-- Saved-view scope (v2.26): applies the view's status/user/label
             filters on top of everything above. Hidden while no views exist —
             views are created in the panel toolbar, not here. -->
        ${this._views.length>0?o`
              <div class="field">
                <div class="field-label">${a("card_saved_view",e)}</div>
                <select
                  class="view-select"
                  .value=${this._config.view_id||""}
                  @change=${m=>this._valueChanged("view_id",m.target.value)}
                >
                  <option value="" ?selected=${!this._config.view_id}>
                    ${a("card_saved_view_none",e)}
                  </option>
                  ${this._views.map(m=>o`<option value=${m.id} ?selected=${this._config.view_id===m.id}>
                      ${m.name}
                    </option>`)}
                </select>
                <div class="field-help">${a("card_saved_view_help",e)}</div>
              </div>
            `:p}

        <ha-formfield label="${a("card_show_header",e)}">
          <ha-switch
            .checked=${this._config.show_header!==!1}
            @change=${m=>this._valueChanged("show_header",m.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${a("card_show_actions",e)}">
          <ha-switch
            .checked=${this._config.show_actions!==!1}
            @change=${m=>this._valueChanged("show_actions",m.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <label class="editor-select">
          <span>${a("card_action_style",e)}</span>
          <select
            .value=${this._config.action_style??""}
            @change=${m=>{let $=m.target.value;this._valueChanged("action_style",$===""?void 0:$)}}
          >
            <option value="" ?selected=${!this._config.action_style}>${a("row_actions_follow",e)}</option>
            <option value="buttons" ?selected=${this._config.action_style==="buttons"}>${a("row_actions_buttons",e)}</option>
            <option value="icons" ?selected=${this._config.action_style==="icons"}>${a("row_actions_icons",e)}</option>
          </select>
        </label>

        <ha-formfield label="${a("responsible_user",e)}">
          <ha-switch
            .checked=${this._config.show_assignee!==!1}
            @change=${m=>this._valueChanged("show_assignee",m.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${a("documents",e)}">
          <ha-switch
            .checked=${this._config.show_documents!==!1}
            @change=${m=>this._valueChanged("show_documents",m.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${a("card_compact",e)}">
          <ha-switch
            .checked=${this._config.compact||!1}
            @change=${m=>this._valueChanged("compact",m.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-textfield
          label="${a("card_max_items",e)}"
          type="number"
          .value=${String(this._config.max_items||0)}
          @input=${m=>this._valueChanged("max_items",parseInt(m.target.value,10)||0)}
        ></ha-textfield>
        ${p}
      </div>
    `}};Q.styles=T`
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
    .view-select {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
      max-width: 320px;
    }
  `,l([y({attribute:!1})],Q.prototype,"hass",2),l([u()],Q.prototype,"_config",2),l([u()],Q.prototype,"_objects",2),l([u()],Q.prototype,"_loadingObjects",2),l([u()],Q.prototype,"_loadError",2),l([u()],Q.prototype,"_views",2);customElements.get("maintenance-supporter-card-editor")||customElements.define("maintenance-supporter-card-editor",Q);It();R();M();R();M();q();var Pt={overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort"};function Di(r){try{return localStorage.getItem(r)}catch{return null}}function Mi(r,s){try{localStorage.setItem(r,s)}catch{}}oe();st();var z=class z extends A{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._error="";this._history=null;this._rosterSort=z._storedSort();this._typeFilter=null;this._recorded=[];this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/setup",language:this._lang}),await this._load()}catch(e){this._error=C(e,this._lang)}finally{this._marking=!1}}};this._loadHistory=async e=>{if(!(!e.target.open||this._historyRequested)){this._historyRequested=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=t.series}catch{this._history=null}}}}get _lang(){return N(this.hass)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(e){Qe(this,e),e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,He(this._lang).then(()=>this.requestUpdate()),this._ov===null&&!this._loading&&this._load())}async _load(){this._loading=!0,this._error="";try{this._ov=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview"})}catch(e){this._error=C(e,this._lang)}finally{this._loading=!1}}async _mark(e){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/mark_replaced",...e?{entity_ids:e}:{}}),await this._load()}catch(t){this._error=C(t,this._lang)}finally{this._marking=!1}}}async _setExcluded(e,t){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:e,excluded:t}),await this._load()}catch(i){this._error=C(i,this._lang)}finally{this._marking=!1}}}async _addBattery(e){let t=e.detail?.value;if(!(!t||this._marking)){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_included",entity_id:t,included:!0}),await this._load()}catch(i){this._error=C(i,this._lang)}finally{this._marking=!1}}}async _setTrackSelf(e){let t=e.target.checked;if(!this._marking){this._marking=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/set_track_self_charging",enabled:t}),await this._load()}catch(i){this._error=C(i,this._lang)}finally{this._marking=!1}}}_sparkline(e){let t=this._history?.[e.entity_id];if(!t||t.points.length<2)return p;let i=110,n=24,c=2,d=t.points[0][0],h=t.points[t.points.length-1][0],_=Date.now()/1e3,f=e.status!=="low"&&e.predicted_source==="trend"&&e.days_until!=null?_+e.days_until*86400:null,x=Math.max(h,f??h),v=I=>x===d?c:c+(I-d)/(x-d)*(i-2*c),b=I=>c+(1-Math.min(100,Math.max(0,I))/100)*(n-2*c),m=t.points.map(([I,S])=>`${E(v(I))},${E(b(S))}`).join(" "),$=t.points[t.points.length-1][1],O=E(b(t.threshold));return o`<svg
      class="bf-spark"
      viewBox="0 0 ${i} ${n}"
      role="img"
      aria-label=${a("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${a("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${O} x2=${i} y2=${O}></line>
      <polyline class="bf-spark-line" points=${m}></polyline>
      ${f!==null?o`<line
            class="bf-spark-proj"
            x1=${E(v(h))}
            y1=${E(b($))}
            x2=${E(v(f))}
            y2=${O}
          ></line>`:p}
    </svg>`}static _storedSort(){return Di(Pt.batteryRosterSort)==="name"?"name":"urgency"}_setSort(e){this._rosterSort=e,Mi(Pt.batteryRosterSort,e)}_sortedRoster(e){let t=this._typeFilter===null?e:e.filter(n=>n.battery_type===this._typeFilter);if(this._rosterSort==="name")return t;let i=n=>n.status==="low"?-1e3+(n.level??101)/101:n.days_until??1/0;return[...t].sort((n,c)=>i(n)-i(c)||n.device_name.localeCompare(c.device_name))}_predictedDate(e){return this._fmtDate(Date.now()+e*864e5)}_fmtDate(e){let t=new Date(e),i=n=>String(n).padStart(2,"0");return W(`${t.getFullYear()}-${i(t.getMonth()+1)}-${i(t.getDate())}`,this._lang)}_shoppingLine(e){return Object.entries(e).map(([t,i])=>o`<button
        class="bf-type-chip ${this._typeFilter===t?"bf-type-chip-active":""}"
        title=${a("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(t)}
      >
        ${i}× ${t}
      </button>`)}_toggleTypeFilter(e){if(this._typeFilter=this._typeFilter===e?null:e,this._typeFilter!==null){let t=this.shadowRoot?.querySelector("details.bf-roster");t&&!t.open&&(t.open=!0)}}async _recordJump(e,t){if(!this._marking){this._marking=!0,this._error="";try{await this.hass.callService("battery_notes","set_battery_replaced",{device_id:t.device_id,datetime_replaced:new Date(t.at*1e3).toISOString()}),this._recorded=[...this._recorded,e],await this._load()}catch(i){this._error=C(i,this._lang)}finally{this._marking=!1}}}_levelBar(e){let t=e.level;if(t==null)return p;let i=e.low_threshold??20,n=t<=i?"bad":t<=i+20?"warn":"good";return o`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${n}" style="width: ${Math.min(100,Math.max(0,t))}%"></span
    ></span>`}render(){let e=this._lang;if(this._loading&&this._ov===null)return o`<div class="bf-card"><div class="bf-loading">…</div></div>`;let t=this._ov;if(!t)return this._error?o`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:p;let i=t.low.length;return o`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${a("battery_fleet_title",e)}</span>
          <span class="bf-count ${i?"bad":"ok"}">${i}</span>
        </div>
        ${this._error?o`<div class="bf-error">${this._error}</div>`:p}

        ${t.configured&&t.task_ok===!1?o`
              <div class="bf-repair">
                <span>${a("battery_fleet_trigger_lost",e)}</span>
                <ha-button .disabled=${this._marking} @click=${this._repair}>
                  ${a("battery_fleet_repair",e)}
                </ha-button>
              </div>
            `:p}

        ${i===0?o`<div class="bf-empty">${a("battery_fleet_none_low",e)}</div>`:o`
              <div class="bf-shopping">
                <span class="bf-label">${a("battery_fleet_buy_now",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${t.low.map(n=>o`
                    <div class="bf-row">
                      <span class="bf-dev">${n.device_name}</span>
                      ${n.available===!1?o`<span class="bf-offline">${a("battery_fleet_offline",e)}</span>`:p}
                      <span class="bf-type">${n.quantity}× ${n.battery_type}</span>
                      ${n.rechargeable?o`<span class="bf-recharge" title=${a("battery_fleet_rechargeable",e)}
                            ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
                          ></span>`:p}
                      ${this._levelBar(n)}
                      ${n.level!=null?o`<span class="bf-level">${n.level}%</span>`:p}
                      <button
                        class="bf-mark"
                        title=${n.rechargeable?a("battery_fleet_mark_recharged",e):a("battery_fleet_mark_one",e)}
                        .disabled=${this._marking}
                        @click=${()=>this._mark([n.entity_id])}
                      >
                        <ha-icon icon="mdi:battery-sync"></ha-icon>
                      </button>
                      <button
                        class="bf-mark bf-exclude"
                        title=${a("battery_fleet_exclude",e)}
                        .disabled=${this._marking}
                        @click=${()=>this._setExcluded(n.entity_id,!0)}
                      >
                        <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                      </button>
                    </div>
                  `)}
              </div>
              <div class="bf-actions">
                <ha-button .disabled=${this._marking} @click=${this._markAll}>
                  <ha-icon icon="mdi:battery-sync"></ha-icon> ${a("battery_fleet_mark_all",e)}
                </ha-button>
              </div>
            `}

        ${t.soon.length?o`
              <div class="bf-soon">
                <span class="bf-label">${a("battery_fleet_soon",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_soon)}</span>
                <div class="bf-soon-hint">${a("battery_fleet_soon_hint",e)}</div>
              </div>
            `:p}
        ${t.all?.length?o`
              <details class="bf-roster" @toggle=${this._loadHistory}>
                <summary>${a("battery_fleet_all",e)} (${t.all.length})</summary>
                <div class="bf-roster-tools">
                  <button
                    class="bf-sort ${this._rosterSort==="urgency"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("urgency")}
                  >
                    ${a("battery_fleet_sort_urgency",e)}
                  </button>
                  <button
                    class="bf-sort ${this._rosterSort==="name"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("name")}
                  >
                    ${a("battery_fleet_sort_name",e)}
                  </button>
                </div>
                <div class="bf-rows">
                  ${this._sortedRoster(t.all).map(n=>o`
                      <div class="bf-row">
                        <span class="bf-dev">${n.device_name}</span>
                        <span class="bf-status bf-${n.status}">${a("battery_fleet_status_"+n.status,e)}</span>
                        <span class="bf-type">${n.quantity}× ${n.battery_type}</span>
                        ${n.rechargeable?o`<span class="bf-recharge" title=${a("battery_fleet_rechargeable",e)}
                              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
                            ></span>`:p}
                        ${this._sparkline(n)}
                        ${this._levelBar(n)}
                        ${n.level!=null?o`<span class="bf-level">${n.level}%</span>`:p}
                        ${(()=>{let c=this._history?.[n.entity_id]?.jump;return!c||this._recorded.includes(n.entity_id)?p:o`<button
                            class="bf-mark bf-jump"
                            title=${a("battery_fleet_record_replacement",e).replace("{date}",this._fmtDate(c.at*1e3))}
                            .disabled=${this._marking}
                            @click=${()=>this._recordJump(n.entity_id,c)}
                          >
                            <ha-icon icon="mdi:calendar-sync"></ha-icon>
                          </button>`})()}
                        ${n.days_until!=null?o`<span
                              class="bf-predicted ${n.predicted_source==="trend"?"bf-trend":""} ${n.forecast_overdue?"bf-overdue":""}"
                              title=${n.forecast_overdue?a("battery_fleet_forecast_overdue",e):n.predicted_source==="trend"?a("battery_fleet_predicted_trend",e).replace("{date}",this._predictedDate(n.days_until)).replace("{confidence}",a("cal_confidence_"+(n.prediction_confidence||"medium"),e)):a("battery_fleet_predicted_on",e).replace("{date}",this._predictedDate(n.days_until))}
                              >${n.forecast_overdue?o`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:p}~${this._predictedDate(n.days_until)}</span
                            >`:p}
                        <button
                          class="bf-mark bf-exclude"
                          title=${a("battery_fleet_exclude",e)}
                          .disabled=${this._marking}
                          @click=${()=>this._setExcluded(n.entity_id,!0)}
                        >
                          <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                        </button>
                      </div>
                    `)}
                </div>
                <div class="bf-roster-hint">${a("battery_fleet_all_hint",e)}</div>
                <div class="bf-add">
                  <span class="bf-label">${a("battery_fleet_add",e)}</span>
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{entity:{domain:["sensor","binary_sensor"]}}}
                    .value=${""}
                    @value-changed=${this._addBattery}
                  ></ha-selector>
                  <div class="bf-roster-hint">${a("battery_fleet_add_hint",e)}</div>
                </div>
                <label class="bf-track-self">
                  <input
                    type="checkbox"
                    .checked=${!!t.track_self_charging}
                    .disabled=${this._marking}
                    @change=${this._setTrackSelf}
                  />
                  ${a("battery_fleet_track_self",e)}
                </label>
                <div class="bf-roster-hint">${a("battery_fleet_track_self_hint",e)}</div>
              </details>
            `:p}
        ${t.excluded?.length?o`
              <div class="bf-excluded">
                <span class="bf-label">${a("battery_fleet_excluded",e)}</span>
                ${t.excluded.map(n=>o`
                    <span class="bf-excluded-chip">
                      ${n.device_name}
                      <button
                        class="bf-mark"
                        title=${a("battery_fleet_include",e)}
                        .disabled=${this._marking}
                        @click=${()=>this._setExcluded(n.entity_id,!1)}
                      >
                        <ha-icon icon="mdi:eye-outline"></ha-icon>
                      </button>
                    </span>
                  `)}
              </div>
            `:p}
        <div class="bf-total">${a("battery_fleet_total",e).replace("{n}",String(t.total))}</div>
      </div>
    `}};z.styles=T`
    .bf-card {
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 14px 16px;
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    :host([flat]) .bf-card {
      background: transparent;
      border: none;
      border-radius: 0;
      margin: 0;
      padding: 0;
    }
    .bf-head {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .bf-title {
      flex: 1;
    }
    .bf-count {
      font-size: 13px;
      padding: 1px 9px;
      border-radius: 10px;
    }
    .bf-count.bad {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .bf-count.ok {
      background: var(--success-color, #4caf50);
      color: #fff;
    }
    .bf-error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .bf-repair {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
      font-size: 13px;
    }
    .bf-empty {
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .bf-shopping,
    .bf-soon {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 8px;
    }
    .bf-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
    }
    .bf-list {
      font-weight: 500;
    }
    /* Cross-row column alignment (same subgrid pattern as the task table,
     * issue 66): the LIST owns one column template, every row spans it via
     * subgrid, and each element is PINNED to its column below - so an
     * optional element (sparkline, percentage, forecast date) leaves its
     * column empty instead of letting the rest of the row drift. max-content
     * columns collapse to 0 when a whole list never fills them (the low list
     * has no status chip, no sparkline, no date). */
    .bf-rows {
      display: grid;
      grid-template-columns: minmax(0, 1fr) repeat(9, max-content);
      column-gap: 8px;
    }
    .bf-row {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    /* Column pinning: 1 name, 2 status/offline chip, 3 type, 4 charging
     * icon, 5 sparkline, 6 level bar, 7 percentage, 8 row action
     * (mark-one / record-swap), 9 forecast date, 10 exclude eye. */
    .bf-dev {
      grid-column: 1;
      min-width: 0;
    }
    .bf-offline,
    .bf-status {
      grid-column: 2;
      justify-self: end;
    }
    .bf-type {
      grid-column: 3;
    }
    .bf-recharge {
      grid-column: 4;
    }
    .bf-spark {
      grid-column: 5;
    }
    .bf-bar {
      grid-column: 6;
    }
    .bf-level {
      grid-column: 7;
      justify-self: end;
    }
    .bf-row .bf-mark {
      grid-column: 8;
    }
    .bf-predicted {
      grid-column: 9;
      justify-self: end;
    }
    .bf-row .bf-mark.bf-exclude {
      grid-column: 10;
    }
    .bf-offline {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-style: italic;
    }
    .bf-type {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .bf-recharge {
      color: var(--secondary-text-color);
      display: inline-flex;
      cursor: help;
    }
    .bf-recharge ha-icon {
      --mdc-icon-size: 16px;
    }
    .bf-spark {
      width: 110px;
      height: 24px;
      flex: 0 0 auto;
      cursor: help;
    }
    /* On phones the row cannot fit name + chips + curve + bar + date in ONE
     * line: the decorations yield (the percentage still carries the number)
     * and the row wraps to two lines - the name spans the full width, the
     * status chip moves under it (left, into the name column) and the rest
     * keeps its pinned subgrid column, so type / percentage / date / eye
     * stay aligned across rows. Without this the fixed max-content columns
     * overflowed 400 px and the chips overlapped the wrapped names. */
    @media (max-width: 640px) {
      .bf-spark,
      .bf-bar {
        display: none;
      }
      .bf-row {
        row-gap: 2px;
      }
      .bf-dev {
        grid-column: 1 / 9;
        grid-row: 1;
      }
      .bf-offline,
      .bf-status {
        /* Line 1, RIGHT - over the date+eye columns, which are wide enough
         * for any chip. Pinning the chip into the 1fr rest column instead
         * overlapped the type text (the rest column shrinks below chip
         * width, and a span onto an fr track never grows fixed tracks). */
        grid-column: 9 / 11;
        grid-row: 1;
        justify-self: end;
      }
      .bf-type {
        grid-row: 2;
        max-width: 44vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .bf-recharge,
      .bf-level,
      .bf-predicted,
      .bf-row .bf-mark {
        grid-row: 2;
      }
    }
    .bf-spark-line {
      fill: none;
      stroke: var(--primary-color);
      stroke-width: 1.5;
      stroke-linejoin: round;
    }
    .bf-spark-proj {
      stroke: var(--primary-color);
      stroke-width: 1.2;
      stroke-dasharray: 2 3;
      opacity: 0.7;
    }
    .bf-spark-th {
      stroke: var(--error-color, #f44336);
      stroke-width: 1;
      opacity: 0.35;
    }
    .bf-type-chip {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 1px 8px;
      margin: 0 4px 2px 0;
      font-size: 13px;
      color: inherit;
      cursor: pointer;
    }
    .bf-type-chip-active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .bf-bar {
      width: 30px;
      height: 6px;
      border-radius: 3px;
      background: var(--divider-color);
      overflow: hidden;
      flex: 0 0 auto;
    }
    .bf-bar-fill {
      display: block;
      height: 100%;
      border-radius: 3px;
    }
    .bf-bar-good {
      background: var(--success-color, #4caf50);
    }
    .bf-bar-warn {
      background: var(--warning-color, #ff9800);
    }
    .bf-bar-bad {
      background: var(--error-color, #f44336);
    }
    .bf-jump ha-icon {
      color: var(--warning-color, #ff9800);
    }
    .bf-roster-tools {
      display: flex;
      gap: 6px;
      margin: 8px 0 2px;
    }
    .bf-sort {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      padding: 2px 10px;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .bf-sort-active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .bf-level {
      font-size: 12px;
      color: var(--error-color, #f44336);
    }
    .bf-mark {
      background: transparent;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: inline-flex;
    }
    .bf-mark:hover {
      background: var(--secondary-background-color);
    }
    .bf-actions {
      display: flex;
      justify-content: flex-end;
    }
    .bf-soon {
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .bf-soon-hint {
      width: 100%;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    /* The roster is a lookup list, not the headline — collapsed by default so
       the section still opens on what actually needs doing. */
    .bf-roster > summary {
      cursor: pointer;
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 2px 0;
    }
    .bf-roster-hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      padding-top: 6px;
    }
    .bf-status {
      font-size: 11px;
      padding: 1px 7px;
      border-radius: 9px;
      white-space: nowrap;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--secondary-text-color);
    }
    .bf-status.bf-low {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .bf-status.bf-soon {
      background: var(--warning-color, #ff9800);
      color: #fff;
    }
    .bf-predicted {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    /* Trend-based dates (discharge regression) get a dotted underline — the
       tooltip carries source + confidence. */
    .bf-predicted.bf-trend {
      text-decoration: underline dotted;
      text-underline-offset: 2px;
    }
    /* B1: passed prediction on a still-healthy battery — warn-tinted with a
       calendar-alert icon; the tooltip explains (record the swap / forecast
       was off). Deliberately NOT red: this is a discrepancy, not an alarm. */
    .bf-predicted.bf-overdue {
      color: var(--warning-color, #ff9800);
    }
    .bf-predicted.bf-overdue ha-icon {
      --mdc-icon-size: 14px;
      margin-right: 2px;
    }
    .bf-total {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .bf-exclude {
      color: var(--secondary-text-color);
    }
    .bf-excluded {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .bf-excluded-chip {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 10px;
      padding: 1px 4px 1px 10px;
    }
    .bf-track-self {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      font-size: 13px;
      cursor: pointer;
    }
    .bf-track-self input {
      accent-color: var(--primary-color);
      margin: 0;
    }
  `,l([y({attribute:!1})],z.prototype,"hass",2),l([y({type:Boolean})],z.prototype,"flat",2),l([u()],z.prototype,"_ov",2),l([u()],z.prototype,"_loading",2),l([u()],z.prototype,"_marking",2),l([u()],z.prototype,"_error",2),l([u()],z.prototype,"_history",2),l([u()],z.prototype,"_rosterSort",2),l([u()],z.prototype,"_typeFilter",2),l([u()],z.prototype,"_recorded",2);var Lt=z;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",Lt);var we=class extends A{constructor(){super(...arguments);this._config={type:"custom:maintenance-battery-fleet-card"}}static getStubConfig(){return{type:"custom:maintenance-battery-fleet-card"}}setConfig(e){this._config=e}getCardSize(){return 6}render(){return this.hass?o`
      <ha-card .header=${this._config.title||void 0}>
        <div class="content">
          <maintenance-battery-fleet-section flat .hass=${this.hass}></maintenance-battery-fleet-section>
        </div>
      </ha-card>
    `:p}};we.styles=T`
    ha-card {
      overflow: hidden;
    }
    .content {
      padding: 12px 16px 14px;
    }
  `,l([y({attribute:!1})],we.prototype,"hass",2),l([u()],we.prototype,"_config",2);customElements.get("maintenance-battery-fleet-card")||customElements.define("maintenance-battery-fleet-card",we);Xe({type:"maintenance-battery-fleet-card",name:"Battery Fleet",description:"All tracked batteries: what is low now, what runs out soon, and what to buy.",preview:!1});J();var U=class extends A{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._globalRowStyle="buttons_compact";this._objects=[];this._stats=null;this._unsub=null;this._viewFilters=null;this._userNames={};this._userService=null;this._userNamesLoaded=!1;this._taskDocs={};this._docsLoadedFor=new Set;this._dataLoaded=!1;this._lastConnection=null;this._onCompleted=async()=>{await this._loadData()}}get _lang(){return N(this.hass)}static getConfigElement(){return document.createElement("maintenance-supporter-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-card",show_header:!0,show_actions:!0,filter_status:["overdue","triggered","due_soon"],max_items:10}}setConfig(e){let t=e.view_id!==this._config.view_id;this._config=e,t&&this._dataLoaded&&this.hass&&this._loadViewFilters()}getCardSize(){return 3}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null}updated(e){if(super.updated(e),Qe(this,e),this.hass&&!this._userNamesLoaded&&this._config.show_assignee!==!1&&this._objects.some(t=>t.tasks.some(i=>i.responsible_user_id))&&this._loadUserNames(),this.hass&&this._config.show_documents!==!1)for(let t of this._objects)this._docsLoadedFor.has(t.entry_id)||t.tasks.some(i=>(i.document_count??0)>0)&&this._loadDocuments(t.entry_id);if(e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){Ot(this.hass).then(e=>{this._globalRowStyle=e}).catch(()=>{});try{let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=Re(e.objects),this._stats=t}catch{}await this._loadViewFilters()}_assigneeName(e){if(this._config.show_assignee===!1)return"";let t=e.responsible_user_id;return t&&this._userNames[t]||""}async _loadUserNames(){this._userNamesLoaded=!0,this._userService?this._userService.updateHass(this.hass):this._userService=new ye(this.hass);try{let e=await this._userService.getUsers();this._userNames=Object.fromEntries(e.map(t=>[t.id,t.name]))}catch{}}async _loadDocuments(e){this._docsLoadedFor.add(e);try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:e}),i={};for(let n of t.documents||[])for(let c of n.task_ids||[])(i[c]||=[]).push({id:n.id,title:n.title,kind:n.kind,url:n.url});this._taskDocs={...this._taskDocs,[e]:i}}catch{}}_docsFor(e,t){if(this._config.show_documents===!1)return[];let n=[...this._taskDocs[e]?.[t.id]||[]];return t.documentation_url&&n.push({id:`url:${t.id}`,title:a("documentation_label",this._lang),kind:"weblink",url:t.documentation_url}),n}async _openDoc(e){if(e.kind==="weblink"&&e.url){Ze(e.url)&&window.open(e.url,"_blank","noopener");return}try{await ji(this.hass,e.id)}catch{}}async _loadViewFilters(){if(!this._config.view_id){this._viewFilters=null;return}try{let t=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"})).views||[]).find(i=>i.id===this._config.view_id);this._viewFilters=t?t.filters:null}catch{this._viewFilters=null}}async _subscribe(){try{let e=await this.hass.connection.subscribeMessage(t=>{let i=di(this._objects,t);i!==null&&(this._objects=i)},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected){e();return}this._unsub=e}catch{}}get _flatTasks(){let e=[],{filter_status:t,filter_objects:i,entity_ids:n,filter_due_min_days:c,filter_due_max_days:d,filter_labels:h,filter_priority:_,filter_areas:f,max_items:x}=this._config,v=n?.length?new Set(n):null,b=c!==void 0||d!==void 0,m=this._viewFilters,$=m?.user_id==="current_user"?this.hass.user?.id??null:m?.user_id??null;for(let I of this._objects)if(!(i?.length&&!i.includes(I.object.name))){if(f?.length){let S=I.object.area_id;if(!S||!f.includes(S))continue}for(let S of I.tasks)if(!S.is_done&&!(S.archived||I.object.archived)&&!(t?.length&&!t.includes(S.status))&&!(h?.length&&!(S.labels||[]).some(L=>h.includes(L)))&&!(_?.length&&!_.includes(S.priority||"normal"))&&!(v&&!(S.sensor_entity_id&&v.has(S.sensor_entity_id)||S.binary_sensor_entity_id&&v.has(S.binary_sensor_entity_id)))){if(b){let L=S.days_until_due;if(L==null||c!==void 0&&L<c||d!==void 0&&L>d)continue}m&&(m.status&&S.status!==m.status||m.label&&!(S.labels||[]).includes(m.label)||m.priority&&(S.priority||"normal")!==m.priority||$&&S.responsible_user_id!==$)||e.push({entry_id:I.entry_id,object_name:I.object.name,task:S})}}let O={overdue:0,triggered:1,due_soon:2,ok:3};return e.sort((I,S)=>{let L=(O[I.task.status]??9)-(O[S.task.status]??9);return L!==0?L:(I.task.days_until_due??1/0)-(S.task.days_until_due??1/0)}),x&&x>0?e.slice(0,x):e}_openTaskDetail(e,t){Ft(e,t)}render(){let e=this._lang,t=this._config.title||a("maintenance",e),i=this._config.show_header!==!1,n=(this._config.action_style??(this._globalRowStyle==="icons"?"icons":"buttons"))==="buttons",c=this._config.show_actions!==!1,d=this._config.compact||!1,h=this._flatTasks,_=this._stats;return o`
      <ha-card>
        <div class="card-header">
          <h1>${t}</h1>
          <div class="header-right">
            ${i&&_?o`
                  <div class="header-stats">
                    ${_.overdue>0?o`<span class="badge overdue">${_.overdue}</span>`:p}
                    ${_.due_soon>0?o`<span class="badge due_soon">${_.due_soon}</span>`:p}
                    ${_.triggered>0?o`<span class="badge triggered">${_.triggered}</span>`:p}
                  </div>
                `:p}
            ${c?o`
                  <mwc-icon-button
                    class="hdr-add"
                    title="${a("new_object",e)}"
                    @click=${()=>Mt()}
                  >
                    <ha-icon icon="mdi:plus-box"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button
                    class="hdr-add"
                    title="${a("add_task",e)}"
                    @click=${()=>zt("",this._objects)}
                  >
                    <ha-icon icon="mdi:playlist-plus"></ha-icon>
                  </mwc-icon-button>
                `:p}
          </div>
        </div>
        ${h.length===0?this._objects.some(f=>f.tasks.length>0)?o`<div class="empty-card">
                <!-- (#86) tasks exist but none match the filter (default:
                     actionable-only) — "all caught up", NOT "no tasks yet". -->
                <div class="all-caught-up">✓ ${a("card_all_caught_up",e)}</div>
              </div>`:o`<div class="empty-card">
                <div>${a("card_no_tasks_title",e)}</div>
                <a class="empty-link" href="/maintenance-supporter">${a("card_no_tasks_cta",e)}</a>
              </div>`:o`
              <div class="task-list ${d?"compact":""}">
                ${h.map(({entry_id:f,object_name:x,task:v})=>o`
                    <div class="task-item clickable"
                         @click=${()=>this._openTaskDetail(f,v.id)}
                         title="${a("open_task",e)||"Open task"}">
                      <div class="status-dot" style="background: ${he[v.status]||"#ccc"}"></div>
                      <div class="task-info">
                        <div class="task-name">
                          ${v.name}
                          ${v.due_override?o`<ha-icon
                                class="postponed-icon"
                                icon="mdi:calendar-clock"
                                title="${a("postponed",e)||"Postponed"}"
                              ></ha-icon>`:p}
                        </div>
                        ${d?this._assigneeName(v)?o`<div class="task-meta compact-assignee" title="${this._assigneeName(v)}">
                                <ha-icon icon="mdi:account"></ha-icon>${this._assigneeName(v)}
                              </div>`:p:o`<div class="task-meta">
                              ${x} · ${a(v.type,e)}${ne(v)?o` · ${ne(v)}`:p}${this._assigneeName(v)?o` · <span class="assignee"
                                    ><ha-icon icon="mdi:account"></ha-icon>${this._assigneeName(v)}</span
                                  >`:p}
                            </div>`}
                      </div>
                      ${this._docsFor(f,v).length?o`<div class="doc-chips">
                            ${this._docsFor(f,v).map(b=>o`
                              <button
                                type="button"
                                class="doc-chip"
                                title="${b.title}"
                                @click=${m=>{m.stopPropagation(),this._openDoc(b)}}
                              >
                                <ha-icon icon=${b.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
                                <span>${b.title}</span>
                              </button>
                            `)}
                          </div>`:p}
                      <div class="task-due">
                        ${v.days_until_due!==null&&v.days_until_due!==void 0?v.days_until_due<0?o`<span class="overdue-text">${$t(v.days_until_due,e)}</span>`:$t(v.days_until_due,e):v.trigger_active?"\u26A1":"\u2014"}
                      </div>
                      ${c&&n?o`
                            <ha-button
                              size="small"
                              appearance="accent"
                              variant="success"
                              class="complete-btn-text"
                              title="${a("complete",e)}"
                              @click=${b=>{b.stopPropagation();let m=this.shadowRoot.querySelector("maintenance-complete-dialog");De(m,Oe({entryId:f,taskId:v.id,taskName:v.name,task:v,objects:this._objects,lang:e,checklist:v.checklist||[],adaptiveEnabled:!!v.adaptive_config?.enabled,currencySymbol:this._stats?.budget?.currency_symbol||""}),e)}}
                            >
                              <ha-icon slot="start" icon="mdi:check"></ha-icon>${a("complete",e)}
                            </ha-button>
                          `:c?o`
                            <mwc-icon-button
                              class="complete-btn"
                              title="${a("complete",e)}"
                              @click=${b=>{b.stopPropagation();let m=this.shadowRoot.querySelector("maintenance-complete-dialog");De(m,Oe({entryId:f,taskId:v.id,taskName:v.name,task:v,objects:this._objects,lang:e,checklist:v.checklist||[],adaptiveEnabled:!!v.adaptive_config?.enabled,currencySymbol:this._stats?.budget?.currency_symbol||""}),e)}}
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
    `}};U.styles=[Je,T`
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
      .all-caught-up { color: var(--success-color, #4caf50); font-weight: 500; }
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
      .postponed-icon { --mdc-icon-size: 14px; color: var(--secondary-text-color); vertical-align: text-bottom; margin-inline-start: 4px; }
      .task-meta { font-size: 12px; color: var(--secondary-text-color); }
      .assignee, .compact-assignee {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        white-space: nowrap;
      }
      .assignee ha-icon, .compact-assignee ha-icon {
        --mdc-icon-size: 13px;
        width: 13px;
        height: 13px;
      }
      /* Compact rows have no meta line of their own — keep the name from
         pushing the due column off a narrow phone card. */
      .compact-assignee {
        max-width: 11ch;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .doc-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-right: 6px;
        max-width: 45%;
      }
      .doc-chip {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        max-width: 14ch;
        padding: 1px 6px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 10px;
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        font-size: 11px;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .doc-chip:hover { color: var(--primary-color); border-color: var(--primary-color); }
      .doc-chip ha-icon { --mdc-icon-size: 12px; width: 12px; height: 12px; }
      /* nowrap: the due label is localized via formatDueDays ("5 d overdue",
         "5 T überfällig") — without it a narrow phone card wraps that onto a
         second line and the row grows taller. The name column ellipsizes
         instead, which it already does by design. */
      .task-due { font-size: 13px; color: var(--secondary-text-color); min-width: 40px; text-align: right; white-space: nowrap; }
      .overdue-text { color: var(--error-color); font-weight: 500; }

      .complete-btn {
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 18px;
        color: var(--primary-color);
      }
      /* DESIGN PROTOTYPE (#145): action_style: buttons — HA-native labelled button. */
      .complete-btn-text { --ha-button-font-size: 13px; flex: none; white-space: nowrap; }
      .complete-btn-text ha-icon { --mdc-icon-size: 18px; }
    `],l([y({attribute:!1})],U.prototype,"hass",2),l([u()],U.prototype,"_config",2),l([u()],U.prototype,"_globalRowStyle",2),l([u()],U.prototype,"_objects",2),l([u()],U.prototype,"_stats",2),l([u()],U.prototype,"_unsub",2),l([u()],U.prototype,"_viewFilters",2),l([u()],U.prototype,"_userNames",2),l([u()],U.prototype,"_taskDocs",2);customElements.get("maintenance-supporter-card")||customElements.define("maintenance-supporter-card",U);Xe({type:"maintenance-supporter-card",name:"Maintenance Supporter",description:"Overview of your maintenance tasks with quick actions.",preview:!0});export{U as MaintenanceSupporterCard};
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
