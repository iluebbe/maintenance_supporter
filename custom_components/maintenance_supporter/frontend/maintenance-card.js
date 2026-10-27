/*! maintenance_supporter frontend 2.111.0 */
var ms=Object.defineProperty;var Mo=Object.getOwnPropertyDescriptor;var y=(r,s,e)=>()=>{if(e)throw e[0];try{return r&&(s=r(r=0)),s}catch(t){throw e=[t],t}};var Lo=(r,s)=>{for(var e in s)ms(r,e,{get:s[e],enumerable:!0})};var d=(r,s,e,t)=>{for(var i=t>1?void 0:t?Mo(s,e):s,a=r.length-1,o;a>=0;a--)(o=r[a])&&(i=(t?o(s,e,i):o(i))||i);return t&&i&&ms(s,e,i),i};var Kt,Yt,Wi,gs,bt,fs,$,vs,Vi,Gi=y(()=>{Kt=globalThis,Yt=Kt.ShadowRoot&&(Kt.ShadyCSS===void 0||Kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Wi=Symbol(),gs=new WeakMap,bt=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==Wi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(Yt&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=gs.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&gs.set(e,s))}return s}toString(){return this.cssText}},fs=r=>new bt(typeof r=="string"?r:r+"",void 0,Wi),$=(r,...s)=>{let e=r.length===1?r[0]:s.reduce((t,i,a)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[a+1],r[0]);return new bt(e,r,Wi)},vs=(r,s)=>{if(Yt)r.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),i=Kt.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,r.appendChild(t)}},Vi=Yt?r=>r:r=>r instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return fs(e)})(r):r});var Ho,Do,qo,zo,Fo,Uo,Qt,bs,Bo,Wo,yt,xt,Zt,ys,de,wt=y(()=>{Gi();Gi();({is:Ho,defineProperty:Do,getOwnPropertyDescriptor:qo,getOwnPropertyNames:zo,getOwnPropertySymbols:Fo,getPrototypeOf:Uo}=Object),Qt=globalThis,bs=Qt.trustedTypes,Bo=bs?bs.emptyScript:"",Wo=Qt.reactiveElementPolyfillSupport,yt=(r,s)=>r,xt={toAttribute(r,s){switch(s){case Boolean:r=r?Bo:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,s){let e=r;switch(s){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Zt=(r,s)=>!Ho(r,s),ys={attribute:!0,type:String,converter:xt,reflect:!1,useDefault:!1,hasChanged:Zt};Symbol.metadata??=Symbol("metadata"),Qt.litPropertyMetadata??=new WeakMap;de=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=ys){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(s,t,e);i!==void 0&&Do(this.prototype,s,i)}}static getPropertyDescriptor(s,e,t){let{get:i,set:a}=qo(this.prototype,s)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let c=i?.call(this);a?.call(this,o),this.requestUpdate(s,c,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??ys}static _$Ei(){if(this.hasOwnProperty(yt("elementProperties")))return;let s=Uo(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(yt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(yt("properties"))){let e=this.properties,t=[...zo(e),...Fo(e)];for(let i of t)this.createProperty(i,e[i])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let i of t)e.unshift(Vi(i))}else s!==void 0&&e.push(Vi(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vs(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),i=this.constructor._$Eu(s,t);if(i!==void 0&&t.reflect===!0){let a=(t.converter?.toAttribute!==void 0?t.converter:xt).toAttribute(e,t.type);this._$Em=s,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(s,e){let t=this.constructor,i=t._$Eh.get(s);if(i!==void 0&&this._$Em!==i){let a=t.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:xt;this._$Em=i;let c=o.fromAttribute(e,a.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(s,e,t,i=!1,a){if(s!==void 0){let o=this.constructor;if(i===!1&&(a=this[s]),t??=o.getPropertyOptions(s),!((t.hasChanged??Zt)(a,e)||t.useDefault&&t.reflect&&a===this._$Ej?.get(s)&&!this.hasAttribute(o._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:i,wrapped:a},o){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,o??e??this[s]),a!==!0||o!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),i===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,a]of t){let{wrapped:o}=a,c=this[i];o!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,a,c)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};de.elementStyles=[],de.shadowRootOptions={mode:"open"},de[yt("elementProperties")]=new Map,de[yt("finalized")]=new Map,Wo?.({ReactiveElement:de}),(Qt.reactiveElementVersions??=[]).push("2.1.2")});function Rs(r,s){if(!Ji(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ws!==void 0?ws.createHTML(s):s}function Le(r,s,e=r,t){if(s===Me)return s;let i=t!==void 0?e._$Co?.[t]:e._$Cl,a=Et(s)?void 0:s._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(s=Le(r,i._$AS(r,s.values),i,t)),s}var Yi,xs,Jt,ws,Qi,pe,Zi,Vo,Oe,$t,Et,Ji,As,Ki,kt,ks,$s,je,Es,Ss,Cs,Xi,l,Ge,id,Me,p,Ts,Ne,Is,St,Xt,Ve,He,ei,ti,ii,ri,Ps,Go,js,Ke=y(()=>{Yi=globalThis,xs=r=>r,Jt=Yi.trustedTypes,ws=Jt?Jt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Qi="$lit$",pe=`lit$${Math.random().toFixed(9).slice(2)}$`,Zi="?"+pe,Vo=`<${Zi}>`,Oe=document,$t=()=>Oe.createComment(""),Et=r=>r===null||typeof r!="object"&&typeof r!="function",Ji=Array.isArray,As=r=>Ji(r)||typeof r?.[Symbol.iterator]=="function",Ki=`[ 	
\f\r]`,kt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ks=/-->/g,$s=/>/g,je=RegExp(`>|${Ki}(?:([^\\s"'>=/]+)(${Ki}*=${Ki}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Es=/'/g,Ss=/"/g,Cs=/^(?:script|style|textarea|title)$/i,Xi=r=>(s,...e)=>({_$litType$:r,strings:s,values:e}),l=Xi(1),Ge=Xi(2),id=Xi(3),Me=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Ts=new WeakMap,Ne=Oe.createTreeWalker(Oe,129);Is=(r,s)=>{let e=r.length-1,t=[],i,a=s===2?"<svg>":s===3?"<math>":"",o=kt;for(let c=0;c<e;c++){let h=r[c],_,m,f=-1,w=0;for(;w<h.length&&(o.lastIndex=w,m=o.exec(h),m!==null);)w=o.lastIndex,o===kt?m[1]==="!--"?o=ks:m[1]!==void 0?o=$s:m[2]!==void 0?(Cs.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=je):m[3]!==void 0&&(o=je):o===je?m[0]===">"?(o=i??kt,f=-1):m[1]===void 0?f=-2:(f=o.lastIndex-m[2].length,_=m[1],o=m[3]===void 0?je:m[3]==='"'?Ss:Es):o===Ss||o===Es?o=je:o===ks||o===$s?o=kt:(o=je,i=void 0);let x=o===je&&r[c+1].startsWith("/>")?" ":"";a+=o===kt?h+Vo:f>=0?(t.push(_),h.slice(0,f)+Qi+h.slice(f)+pe+x):h+pe+(f===-2?c:x)}return[Rs(r,a+(r[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},St=class r{constructor({strings:s,_$litType$:e},t){let i;this.parts=[];let a=0,o=0,c=s.length-1,h=this.parts,[_,m]=Is(s,e);if(this.el=r.createElement(_,t),Ne.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(i=Ne.nextNode())!==null&&h.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let f of i.getAttributeNames())if(f.endsWith(Qi)){let w=m[o++],x=i.getAttribute(f).split(pe),R=/([.?@])?(.*)/.exec(w);h.push({type:1,index:a,name:R[2],strings:x,ctor:R[1]==="."?ei:R[1]==="?"?ti:R[1]==="@"?ii:He}),i.removeAttribute(f)}else f.startsWith(pe)&&(h.push({type:6,index:a}),i.removeAttribute(f));if(Cs.test(i.tagName)){let f=i.textContent.split(pe),w=f.length-1;if(w>0){i.textContent=Jt?Jt.emptyScript:"";for(let x=0;x<w;x++)i.append(f[x],$t()),Ne.nextNode(),h.push({type:2,index:++a});i.append(f[w],$t())}}}else if(i.nodeType===8)if(i.data===Zi)h.push({type:2,index:a});else{let f=-1;for(;(f=i.data.indexOf(pe,f+1))!==-1;)h.push({type:7,index:a}),f+=pe.length-1}a++}}static createElement(s,e){let t=Oe.createElement("template");return t.innerHTML=s,t}};Xt=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,i=(s?.creationScope??Oe).importNode(e,!0);Ne.currentNode=i;let a=Ne.nextNode(),o=0,c=0,h=t[0];for(;h!==void 0;){if(o===h.index){let _;h.type===2?_=new Ve(a,a.nextSibling,this,s):h.type===1?_=new h.ctor(a,h.name,h.strings,this,s):h.type===6&&(_=new ri(a,this,s)),this._$AV.push(_),h=t[++c]}o!==h?.index&&(a=Ne.nextNode(),o++)}return Ne.currentNode=Oe,i}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},Ve=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=Le(this,s,e),Et(s)?s===p||s==null||s===""?(this._$AH!==p&&this._$AR(),this._$AH=p):s!==this._$AH&&s!==Me&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):As(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==p&&Et(this._$AH)?this._$AA.nextSibling.data=s:this.T(Oe.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,i=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=St.createElement(Rs(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let a=new Xt(i,this),o=a.u(this.options);a.p(e),this.T(o),this._$AH=a}}_$AC(s){let e=Ts.get(s.strings);return e===void 0&&Ts.set(s.strings,e=new St(s)),e}k(s){Ji(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let a of s)i===e.length?e.push(t=new r(this.O($t()),this.O($t()),this,this.options)):t=e[i],t._$AI(a),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=xs(s).nextSibling;xs(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},He=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,i,a){this.type=1,this._$AH=p,this._$AN=void 0,this.element=s,this.name=e,this._$AM=i,this.options=a,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(s,e=this,t,i){let a=this.strings,o=!1;if(a===void 0)s=Le(this,s,e,0),o=!Et(s)||s!==this._$AH&&s!==Me,o&&(this._$AH=s);else{let c=s,h,_;for(s=a[0],h=0;h<a.length-1;h++)_=Le(this,c[t+h],e,h),_===Me&&(_=this._$AH[h]),o||=!Et(_)||_!==this._$AH[h],_===p?s=p:s!==p&&(s+=(_??"")+a[h+1]),this._$AH[h]=_}o&&!i&&this.j(s)}j(s){s===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},ei=class extends He{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===p?void 0:s}},ti=class extends He{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==p)}},ii=class extends He{constructor(s,e,t,i,a){super(s,e,t,i,a),this.type=5}_$AI(s,e=this){if((s=Le(this,s,e,0)??p)===Me)return;let t=this._$AH,i=s===p&&t!==p||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,a=s!==p&&(t===p||i);i&&this.element.removeEventListener(this.name,this,t),a&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},ri=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){Le(this,s)}},Ps={M:Qi,P:pe,A:Zi,C:1,L:Is,R:Xt,D:As,V:Le,I:Ve,H:He,N:ti,U:ii,B:ei,F:ri},Go=Yi.litHtmlPolyfillSupport;Go?.(St,Ve),(Yi.litHtmlVersions??=[]).push("3.3.2");js=(r,s,e)=>{let t=e?.renderBefore??s,i=t._$litPart$;if(i===void 0){let a=e?.renderBefore??null;t._$litPart$=i=new Ve(s.insertBefore($t(),a),a,void 0,e??{})}return i._$AI(r),i}});var er,S,Ko,Ns=y(()=>{wt();wt();Ke();Ke();er=globalThis,S=class extends de{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=js(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Me}};S._$litElement$=!0,S.finalized=!0,er.litElementHydrateSupport?.({LitElement:S});Ko=er.litElementPolyfillSupport;Ko?.({LitElement:S});(er.litElementVersions??=[]).push("4.2.2")});var Os=y(()=>{});var P=y(()=>{wt();Ke();Ns();Os()});var Hs=y(()=>{});function b(r){return(s,e)=>typeof e=="object"?rl(r,s,e):((t,i,a)=>{let o=i.hasOwnProperty(a);return i.constructor.createProperty(a,t),o?Object.getOwnPropertyDescriptor(i,a):void 0})(r,s,e)}var il,rl,ir=y(()=>{wt();il={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:Zt},rl=(r=il,s,e)=>{let{kind:t,metadata:i}=e,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),t==="setter"&&((r=Object.create(r)).wrapped=!0),a.set(e.name,r),t==="accessor"){let{name:o}=e;return{set(c){let h=s.get.call(this);s.set.call(this,c),this.requestUpdate(o,h,r,!0,c)},init(c){return c!==void 0&&this.C(o,void 0,r,c),c}}}if(t==="setter"){let{name:o}=e;return function(c){let h=this[o];s.call(this,c),this.requestUpdate(o,h,r,!0,c)}}throw Error("Unsupported decorator location: "+t)}});function u(r){return b({...r,state:!0,attribute:!1})}var Ds=y(()=>{ir();});var qs=y(()=>{});var Ye=y(()=>{});var zs=y(()=>{Ye();});var Fs=y(()=>{Ye();});var Us=y(()=>{Ye();});var Bs=y(()=>{Ye();});var Ws=y(()=>{Ye();});var D=y(()=>{Hs();ir();Ds();qs();zs();Fs();Us();Bs();Ws()});var Gs,Vs=y(()=>{Gs={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",trigger_removed:"Trigger removed",ok:"OK",all:"All",new_object:"+ New Object",templates_from:"From template",templates_title:"Start from a template",templates_task_count:"{n} tasks",templates_task_count_one:"1 task",template_created:"Created from template",onboard_hint:"Add your first object to start tracking maintenance.",edit:"Edit",duplicate:"Duplicate",task_duplicated:"Task duplicated",task_moved:"Task moved",move_task_target:"Target object",move_task_message:"Choose the object this task should belong to. Its history, readings and trigger state move with it; it gets a new reference number and its entities are recreated under the new object. Linked documents stay with the current object.",bulk_move_message:"Choose the object the selected tasks should belong to. Tasks that already live there are skipped; history, readings and trigger state move along.",bulk_moved:"{n} tasks moved",more_actions:"More actions",back:"Back",quantity:"Quantity",spare_part:"Spare part",move_task_title:"Move task",move_task:"Move to another object\u2026",object_duplicated:"Object duplicated",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",missed:"Missed",reset:"Reset",snooze:"Snooze",snoozed:"Snoozed",snoozed_for:"Reminders muted for {hours} hours \u2014 until {until}",snoozed_for_one:"Reminders muted for one hour \u2014 until {until}",cancel:"Cancel",bulk_select:"Select",bulk_select_all:"Select all",bulk_n_selected:"{n} selected",bulk_completed:"{n} tasks completed",bulk_archived:"{n} tasks archived",bulk_delete_objects_confirm:"Delete {n} objects and all their tasks? Archiving keeps their history instead.",bulk_objects_deleted:"{n} objects deleted",bulk_objects_archived:"{n} objects archived",bulk_assign:"Assign",bulk_assign_one:"One person",bulk_assign_rotate:"Several people, in turns",bulk_assign_hint:"Replaces who is assigned to the selected tasks \u2014 a rotation included.",bulk_rotation_min_two:"Pick at least two people.",bulk_labels_add:"Add labels",bulk_labels_remove:"Remove labels",bulk_edit_hint:"Only the ticked settings change; everything else stays as it is.",bulk_no_notifications:"No notifications for these tasks",bulk_updated:"{n} tasks updated",bulk_paused:"{n} tasks paused",bulk_resumed:"{n} tasks resumed",bulk_objects_area:"Area set for {n} objects",bulk_failed:"{n} failed: {reason}",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",last_done_days_ago:"done {n} d ago",last_done_today:"done today",no_due_date:"No due date",next_due:"Next due",kpi_reported_by_sensor:"Reported by the sensor",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",trigger_type_due_date:"Date from a sensor",runtime_hours:"Target runtime (hours)",days_before:"Days before the date",days_before_help:`For a sensor that reports when the maintenance is due (a date or timestamp). 0 = on the date itself. The device's own "done" button moves the date forward, which clears the trigger \u2014 make it the completion action.`,target_value:"Target value",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",calendar:"Calendar entity",calendar_entity_label:"Calendar",calendar_entity_hint:"Due once per event of this calendar, on the event's start date \u2014 the next event after the last completion.",calendar_entity_required:"Choose a calendar entity.",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",recurrence_last_day:"Last day of the month",recurrence_business_day:"Business days only (roll back from weekend)",recurrence_offset:"Offset (days, \xB1)",recurrence_offset_help:"Shift the date by \xB1N days, e.g. -2 = two days before.",recurrence_months_label:"Only in these months",recurrence_months_hint:"The date repeats in the selected months only; pick one month for a yearly task. None = every month.",last_day_month:"Last day of month",last_business_day_month:"Last business day",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",reading:"Reading",custom:"Custom",history:"History",cost:"Cost",cost_kind_credit:"Credit",cost_credit_hint:"Money back \u2014 a sale, a refund. It lowers the totals; the average per completion leaves it out.",report_button:"Report",report_title:"Maintenance report",report_generated:"Generated",report_times_done:"Done",report_total_cost:"Total cost",report_notes:"Notes",report_col_type:"Type",report_col_status:"Status",report_col_schedule:"Schedule",duration:"Duration",minutes_short:"min",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",require_on_completion:"Require on completion",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",ws_err_not_found:"Not found \u2014 it may have been deleted meanwhile",ws_err_invalid_input:"Invalid input",ws_err_invalid_date:"Invalid date",ws_err_invalid_format:"Invalid format",ws_err_invalid_url:"Invalid link",ws_err_invalid_mirror_todo:"Invalid to-do list",ws_err_not_configured:"Not set up yet",ws_err_not_loaded:"Not loaded yet \u2014 try again in a moment",ws_err_limit_reached:"Limit reached",ws_err_too_many:"Too many entries",ws_err_too_large:"Too large",ws_err_not_archived:"Not archived",ws_err_invalid_target:"Invalid target",ws_err_create_failed:"Could not be created",ws_err_archived:"Archived \u2014 restore it first",ws_err_already_archived:"Already archived",ws_err_unavailable:"Currently unavailable",ws_err_unauthorized:"Not permitted for your user",ws_err_too_many_views:"Too many saved views",ws_err_replace_failed:"Replacement failed",ws_err_not_paused:"Not paused",ws_err_not_available:"Nothing available",ws_err_no_url:"No link given",ws_err_no_phases:"This task has no phases",ws_err_invalid_view:"Invalid view",ws_err_invalid_user:"Unknown user",ws_err_invalid_range:"Invalid range",ws_err_invalid_parent:"Invalid parent object",ws_err_invalid_device:"Unknown device",ws_err_empty_csv:"The CSV file is empty",ws_err_empty:"Nothing to import",ws_err_duplicate_failed:"Could not duplicate",ws_err_already_paused:"Already paused",ws_err_invalid_cursor:"Invalid phase position",ws_err_invalid_entity_slug:"Invalid entity name",ws_err_invalid_trigger_config:"Invalid trigger configuration",ws_err_no_defaults:"No quick-complete defaults set",ws_err_self_link_device:"An object cannot be linked to itself",ws_err_too_early:"Too early \u2014 this task can only be completed closer to its due date",ws_err_invalid_search_template:"The search link must be an http(s) URL containing {q}",ws_err_invalid_notify_service:"Invalid notification service format. Use 'notify.service_name' (e.g., notify.mobile_app_phone).",ws_err_notify_service_not_found:"This notification service was not found in Home Assistant. Please verify the service name.",ws_err_invalid_shopping_list_entity:"The shopping list must be a to-do entity (todo.\u2026).",ws_err_invalid_icon:"The notification icon must be an mdi: name, e.g. mdi:air-filter",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_toggle:"Due at a specific time",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",notes_markdown_hint:"Markdown is supported \u2014 **bold**, lists, [links](\u2026)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",completed_at_optional:"Completed at (optional, empty = now)",completed_at_pick:"Set date & time",completed_at_future_error:"The completion date cannot be in the future.",ha_time_zone_hint:"Time in Home Assistant's time zone ({zone})",days:"days",days_few:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",task_series_position:"{n} of {total}",task_series_skip:"Skip",task_series_save_next:"Save & next",task_section_schedule:"Schedule",task_section_trigger:"Sensor trigger",task_section_completion:"Completing it",task_section_people:"People",task_section_notifications:"Notifications",task_section_details:"Details",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",priority:"Priority",labels:"Labels",labels_placeholder:"e.g. safety, seasonal, tenant-visible",labels_help:"Comma-separated tags for filtering and reporting.",task_mirror_todo:"Mirror into to-do lists",task_mirror_todo_hint:"The task appears in these lists while it is due; checking it off there completes it here.",task_mirror_todo_default:"Default lists: {lists}",task_mirror_todo_own:"Other lists",task_mirror_todo_none:"Not on any to-do list",priority_low:"Low",priority_normal:"Normal",priority_high:"High",all_priorities:"All priorities",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",earliest_completion_days:"Earliest completion (days before due)",earliest_completion_days_help:"Leave empty to allow completing any time. 0 = only on/after the due date.",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",interval_anchor_hint:"From completion date: the next due date counts from the day the task is marked done, so doing it early or late moves the schedule. From planned date: the schedule keeps its dates, for example when a bill is paid weeks before it is due.",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",object_replaces:"Replaces",object_replaced_by:"Replaced by",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",all_parts:"All parts",all_areas:"All areas",areas_filter:"Filter areas\u2026",areas_filter_none:"No area matches the filter.",area_cost_year:"Cost {year}",area_object_count:"{n} objects",area_object_count_one:"1 object",area_range_12m:"Last 12 months",area_range_all:"All time",area_task_filter:"Filter by task\u2026",area_kpi_completions:"Completions",area_kpi_total_time:"Total time",area_cost_per_month:"Cost per month",area_cost_per_year:"Cost per year",area_cost_per_object:"Cost per object",area_cost_share:"Share",area_history_section:"History (all objects)",area_report_print:"Area report (PDF)",area_report_title:"Area report",area_report_period:"Period",area_no_costs:"No costs recorded in this period.",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",trigger_equals:"Trigger when equal to (=)",trigger_not_equals:"Trigger when different from (\u2260)",for_at_least_minutes:"For at least (minutes)",safety_interval:"Safety interval (optional)",trigger_combinator:"Combine trigger and interval",trigger_combinator_any:"Trigger or interval (whichever first)",trigger_combinator_all:"Trigger and interval (both required)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",adaptive_prediction_enabled:"Enable sensor-driven predictions",adaptive_seasonal_enabled:"Enable seasonal awareness",adaptive_max_interval:"Maximum interval (days)",adaptive_min_interval:"Minimum interval (days)",adaptive_ewa_alpha:"Learning rate (alpha)",adaptive_enabled:"Enable adaptive scheduling",adaptive_section_title:"Adaptive Scheduling",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",shared_with:"Shared with (rotation)",shared_with_help:"Pick multiple people to share this task; the responsible person rotates on each completion.",rotation_strategy:"Rotation",rotation_none:"No rotation",rotation_round_robin:"Round-robin",rotation_least_completed:"Least completed",rotation_random:"Random",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_every_n_days:"every {n} days",cal_every_day:"every day",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",hide_outliers:"Hide outliers (sensor glitches)",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",clear:"Clear",date_type_toggle:"Type the date",date_type_invalid:"Not a valid date \u2014 try 1978-03-15, a year like 1978, or your own date format",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",subsave_warning:"Saved, but one setting was rejected: {detail}",qr_print:"Print",qr_download:"Download SVG",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_action_quick_complete:"Quick-complete \u2014 no dialog",qr_print_quick_none:"Quick-complete codes need quick-complete defaults on a task (Settings \u2192 Advanced Features \u2192 Completion actions; task dialog \u2192 Quick-complete defaults) \u2014 none of the chosen objects' tasks has them yet.",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",strat_this_month:"This Month",strat_later:"Later",strat_week:"Week",strat_fortnight:"Fortnight",strat_month:"Month",strat_year:"Year",strat_other:"Other",strat_status:"Status",strat_empty_title:"No maintenance objects yet",strat_empty_content:"Open the Maintenance panel to add your first object \u2014 pool pump, HVAC filter, vehicle, anything that needs scheduled care.",strat_open_panel:"Open Maintenance panel",strat_add_object:"Add object",strat_not_loaded:"**Maintenance Supporter** is not loaded. Install/enable the integration first.",strat_group_by:"Group views by",strat_group_area:"By area (default)",strat_group_status:"By status (Overdue / Triggered / Due Soon / OK)",strat_group_floor:"By floor (uses HA floors)",strat_group_due_date:"By due date (Overdue / Today / Week / Month / Later)",strat_group_calendar:"Rolling calendar (Week / Fortnight / Month / Year)",strat_editor_help:'The "Overview" view is always first. Empty groups are skipped.',picker_name_calendar:"Maintenance Supporter \u2014 Calendar",picker_name_panel:"Maintenance Supporter \u2014 Panel",picker_name_budget:"Maintenance Supporter \u2014 Budget",picker_name_groups:"Maintenance Supporter \u2014 Groups",picker_name_vacation:"Maintenance Supporter \u2014 Vacation",picker_name_battery_fleet:"Battery Fleet",picker_name_section:"Maintenance Supporter \u2014 Section",picker_name_vacation_status:"Maintenance Supporter \u2014 Vacation Status",picker_name_budget_status:"Maintenance Supporter \u2014 Budget Status",picker_desc_card:"Overview of your maintenance tasks with quick actions.",picker_desc_calendar:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",picker_desc_panel:"The complete Maintenance Supporter panel as a card \u2014 for a panel view / dashboard subview without the sidebar entry.",picker_desc_budget:"Edit the monthly and yearly budget right on the dashboard.",picker_desc_groups:"Create, rename and delete task groups right on the dashboard.",picker_desc_vacation:"Switch vacation mode on or off and set its dates right on the dashboard.",picker_desc_battery_fleet:"All tracked batteries: what is low now, what runs out soon, and what to buy.",picker_desc_dashboard:"Auto-generated dashboard. Group views by area, status, floor, or due date \u2014 picked from the strategy editor or YAML.",picker_desc_section:"Embed maintenance tasks (filterable by area, status, due date) as a section in any dashboard view.",picker_desc_vacation_status:"Compact vacation-mode status banner. Tap to open settings in the panel.",picker_desc_budget_status:"Monthly + yearly maintenance budget overview. Tap for details.",picker_desc_groups_status:"List of configured task groups with member counts.",hist_note_button:"Completed from dashboard button",hist_note_todo:"Completed from the To-do list",hist_note_voice:"Completed by voice",hist_note_notification:"Completed from the notification",hist_note_nfc:"Completed via NFC tag",hist_note_shopping_list:"Completed from the shopping list",hist_note_todo_mirror:"Completed from a mirrored to-do list",hist_note_skipped_notification:"Skipped from notification",hist_note_skipped_button:"Skipped from dashboard button",hist_note_sensor_triggered:"Sensor trigger activated",hist_note_initial:"Initial value set during task creation",hist_note_auto_recovered:"Auto-completed: sensor recovered ({value})",hist_note_auto_entity:"Auto-completed: {entity} changed to {state}",hist_note_auto_recovered_plain:"Auto-completed: sensor recovered",hist_note_reset:"Reset to {date}",hist_note_trigger_replaced:"Trigger entity replaced: {old} \u2192 {new}",hist_note_trigger_removed:"Sensor trigger removed (entity was: {entity}). Schedule converted to {schedule}.",hist_note_compound_removed:"Entity {entity} removed from compound trigger; {count} conditions remain.",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",compound:"Compound (multiple conditions)",compound_logic_and:"AND \u2014 all conditions must trigger",compound_logic_or:"OR \u2014 any condition triggers",compound_help:"Combine several sensor conditions into one trigger.",compound_no_conditions:"No conditions yet \u2014 add at least one.",compound_add_condition:"Add condition",compound_condition:"Condition",compound_remove_condition:"Remove condition",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_action_style:"Complete button style",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_areas:"Filter by areas",card_filter_areas_help:"Empty = show all areas.",card_filter_priority_help:"Empty = show all priorities. Tasks without an explicit priority count as Normal.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",place_optional:"Place (zone, optional)",remind_on_site:"Remind only while somebody is there",remind_on_site_hint:"Reminders wait until somebody is in this zone. Whoever arrives there gets a message with what is due.",place_missing:"Zone not found: reminders as at home",place_home:"Home",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_delete_entry:"Delete entry",history_delete_confirm_entry:"Delete this history entry? The task's last-performed date falls back to the previous completion; photos stay with the object.",history_delete_returns_parts:"The parts it used go back to stock: {parts}.",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",notify_icon:"Notification icon",notify_icon_hint:"Shown by the Companion app on Android. Empty = the icon of this task's maintenance type ({default}).",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",tab_today:"Today",palette_placeholder:"Search objects, tasks, spare parts, documents, notes\u2026",palette_no_results:"No matches",palette_hint:"\u2191\u2193 to navigate \xB7 Enter to open \xB7 Esc to close \xB7 / opens the search anywhere",search_open:"Search",search_group_parts:"Spare parts",search_group_content:"In documents",search_group_history:"History notes",search_page:"Page {page}",search_empty_hint:"Type to search objects, tasks, spare parts, documents and notes",search_searching:"Searching documents and notes\u2026",search_index_status:"Full-text search: {indexed} of {total} files indexed \xB7 {no_text} without text layer \xB7 {pending} pending",today_all_caught_up:"All caught up! Nothing due this week.",today_overdue:"Overdue",today_due_today:"Due today",today_this_week:"This week",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_consumable_threshold:"Consumable low threshold (%)",settings_battery_low_percent:"Battery low threshold (%)",settings_battery_recovered_percent:"Battery counts as replaced above (%)",settings_battery_recovered_percent_hint:"A low battery stays counted as low until its level rises above this value or a replacement is recorded \u2014 so a level hovering around the low threshold cannot complete the fleet task again and again.",settings_battery_low_delay:"Battery counts as low after (minutes)",settings_battery_low_delay_hint:"A battery must read low this long before it counts as low, so a sensor that reports a very low level for a moment and recovers by itself does not put it on the list. 0 = at once.",settings_battery_auto_record:"Record a replacement automatically when a low battery recovers",settings_battery_auto_record_hint:"When a battery that was low rises above the recovery threshold, the replacement date is recorded in Battery Notes and the spare cells are taken from stock \u2014 no tap needed.",settings_battery_lifetimes:"Typical battery lifetimes",settings_battery_lifetimes_hint:'Only used for batteries without a percentage: a Battery Notes note that has just a type and a last-replaced date, or a sensor that only reports "low". Their due date is last replaced + this lifetime. Batteries that report a level get their forecast from the measured discharge instead. Once the fleet has seen three replacements of a type, the median interval takes over from the built-in value \u2014 your own value always wins.',settings_battery_lifetime_months:"months",settings_battery_lifetime_reset:"Use default",settings_battery_lifetime_in_fleet:"in your fleet",settings_battery_lifetime_learned_models:"Learned per model: {list}",settings_thresholds_hint:"Defaults for new Suggested setups (percent-remaining consumables) and for fleet batteries without their own Battery Notes threshold. Existing tasks keep their value.",settings_part_search_url:"Shopping search link",settings_part_search_url_hint:"URL with {q} in place of the search terms, used for parts without a product link. Leave empty for the automatic store (by country, then by language).",settings_value_out_of_range:"Value must be between {min} and {max}",bn_summary:"{name}: {pct} % for {n} batteries",bn_floor_decides:"Your {floor} % floor decides for all of them; the higher of the two thresholds counts per battery.",bn_above_floor:"That is above your {floor} % floor, so {name} decides for all noted batteries.",bn_overrides:"{n} devices with their own threshold:",bn_more:"+ {n} more",settings_row_actions:"Task row actions",settings_ref_numbers_in_lists:"Reference numbers in lists",settings_ref_numbers_in_lists_hint:"Show the #8 / #8.3 chips in front of object and task names in the Today list, the task table, the object cards and the objects table.",settings_compact_refs:"Compact reference numbers",settings_compact_refs_hint:"Renumbers all objects, tasks and completions in order (1, 2, 3 \u2026) and closes the gaps left by deletions. Numbers already printed on service booklets, photos or notes will no longer match.",settings_compact_refs_confirm:"Renumber every object, task and completion sequentially in creation order? Numbers already written on printed service booklets, photos or notes will no longer match. This cannot be undone.",settings_compact_refs_done:"Renumbered {objects} objects, {tasks} tasks and {completions} completions.",row_actions_buttons_compact:"Buttons (icons only on phones)",row_actions_buttons:"Buttons with text",row_actions_icons:"Icons (classic)",row_actions_follow:"Follow the household setting",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",settings_shopping_list:"Shopping list (buy tasks)",settings_shopping_list_help:"Low-part buy reminders appear in this to-do list; checking one off restocks the part.",shopping_list_none:"Off \u2014 no shopping list",settings_mirror_todo_default:"Default to-do lists for tasks",settings_mirror_todo_default_help:"While a task is due, it appears on the lists ticked here, unless the task picks its own lists or none. Checking it off there completes the task. A list that takes a due date gets the task's.",settings_mirror_todo_default_none:"No to-do lists in Home Assistant yet.",settings_install_assist_sentences:"Install Assist sentences",settings_install_assist_sentences_hint:"Copies the voice sentences into your configuration so the classic Assist agent recognises them. A file you edited yourself is never overwritten.",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",notify_per_person:"Per-person delivery",member_avatars:"Member avatars",member_avatars_hint:"Shown next to assigned tasks \u2014 initials in the member's colour. Defaults come from the name; set your own initials or pick a colour to tell members apart.",member_initials:"Initials",member_color:"Colour",member_avatar_reset:"Reset",notify_no_own_device:"No own device \u2014 uses the household service",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_reminder_leads:"Extra reminders (days before due)",settings_reminder_leads_hint:"Comma-separated lead times, e.g. 14, 3, 0 \u2014 one extra reminder fires on each matching day. Empty = off.",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_weekly_digest:"Weekly digest",settings_weekly_digest_hint:"A single summary notification on Monday morning when tasks are due.",settings_warranty_reminder:"Warranty expiry reminder",settings_warranty_reminder_days:"Days before expiry",settings_warranty_reminder_hint:"Notify once when an object's warranty is this many days from expiring.",settings_snooze_hours:"Snooze duration (hours)",settings_snooze_hours_hint:"How long Snooze mutes a task's reminders \u2014 from the task menu, a card, voice or the phone's Snooze button. The due date stays as it is.",settings_budget:"Budget",settings_currency:"Currency",settings_currency_decimals:"Decimal places for amounts",settings_currency_decimals_hint:"How many decimals every amount shows: KPIs, budgets, costs in lists and reports, budget alerts. 0 = whole numbers.",settings_parts_cost_mode:"Spare parts count as spending",settings_parts_cost_purchase:"When bought",settings_parts_cost_use:"When used",settings_parts_cost_mode_hint:"When bought: a buy reminder's cost counts, and the parts a job uses are shown as information. When used: every completion books the value of the parts it used, and a purchase sets the part's price instead of counting. Applies to completions from now on \u2014 history keeps how it was booked.",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_export_settings:"Export settings (JSON)",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_import_unmatched_users:"Not found on this instance: {names}. Their task assignments were removed \u2014 add people with the same names in Home Assistant and import again to keep them.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",settings_export_selection:"Limit to selected objects (optional)",settings_docs_archive:"Documents archive (with files)",settings_docs_archive_hint:"The JSON and YAML exports list your documents but not their files; CSV leaves documents out. This ZIP holds the uploaded files \u2014 restore it after importing the JSON and nothing is missing.",settings_docs_export_btn:"Download documents ZIP",settings_docs_import_btn:"Restore documents ZIP",settings_docs_import_success:"Restored: {blobs} files, {docs} documents",settings_docs_import_missing:"{n} skipped \u2014 their files were not in the ZIP",settings_docs_import_unmatched:"No object here matches {names}: their files were kept but not attached",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",groupby_object:"By object",filter_label:"Filter",user_label:"User",photo_label:"Photo",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",state_latch_help:"With 1 transition the trigger is a latch: it recovers when the entity leaves the To-state \u2014 or, with only a From-state set, when it returns to that state.",for_minutes_state_help:"0 counts every change immediately. Set minutes and the new state must hold that long first \u2014 brief flickers then neither trigger nor count.",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_ended:"Ended",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else only gets Complete, Skip, Reset, Postpone and Snooze.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc:"Per-task HA action on complete + quick-complete QR with pre-set values.",feat_places:"Places",feat_places_desc:"Objects maintained at another place (a Home Assistant zone): reminders only while somebody is there, and a message on arrival.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_target_more:"This action targets more than this field shows: {targets}. That is kept as it is \u2014 choosing another entity here replaces the whole target.",on_complete_action_skip_auto:"Not when the task completes itself (its sensor recovered)",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",action_test_bad_format:"Invalid service format (expected 'domain.service')",action_test_unknown_service:'Service "{service}" is not registered in Home Assistant. Check the spelling and that the integration providing it is loaded.',action_test_domain_mismatch:`Service "{service}" only works on {domain}.* entities; entity "{entity}" is in {entity_domain}.* \u2014 pick a service that matches the entity's domain (e.g. {suggestion})`,action_test_entity_missing:'Target entity "{entity}" was not found in Home Assistant \u2014 it may have been renamed or its integration removed.',quick_complete_defaults_title:"Quick-complete defaults (for QR scans, optional)",quick_complete_defaults_desc:"Pre-set values for quick-complete QR scans. Without these, the QR opens the complete dialog.",quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026",archive:"Archive",undo:"Undo",task_completed_named:"Completed: {task}",undo_done:"Completion undone",undo_done_action_ran:"Completion undone. Its completion action had already run and cannot be taken back.",undo_nothing:"Nothing to undo. Only your own last completion can be taken back, within 10 minutes.",undo_changed:"Can't undo. The task has changed since.",task_archived:"Task archived",object_archived:"Object archived",unarchive:"Unarchive",archived:"Archived",show_archived:"Show archived",hide_archived:"Hide archived",section_collapse:"Collapse section",section_expand:"Expand section",confirm_archive_object:"Archive this object and its tasks? They keep their history and can be unarchived later.",settings_archive:"Archive & Retention",settings_archive_desc:"Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",settings_archive_oneoff_days:"Auto-archive completed one-off tasks after (days, 0 = off)",settings_delete_archived_oneoff_days:"Auto-delete archived one-off tasks after (days, 0 = never)",archive_object:"Archive object",unarchive_object:"Unarchive object",documents:"Documents",documents_empty:"No documents yet.",doc_upload:"Upload file",doc_uploading:"Uploading\u2026",doc_add_link:"Add link",doc_link_url:"URL (https://\u2026)",doc_link_title:"Title (optional)",doc_open:"Open",doc_delete_confirm:'Delete "{name}"?',doc_too_large:"File is too large (max 100 MB).",doc_upload_failed:"Upload failed.",docs_archive_too_large:"The archive is too large (max {max}).",docs_archive_no_manifest:"This ZIP has no manifest.json, so the restore cannot tell which document a file belongs to. Keep manifest.json next to the folders when zipping again.",completion_photos_optional:"Completion photos (optional)",completion_photos:"Completion photos",choose_photos:"Choose photos",choose_photo:"Choose photo",photos_android_hint:"The Android app hands over one photo per pick \u2014 each pick is added.",photos_limit:"Up to {max} photos per completion",history_edit_photos_hint:"Removing a photo here keeps the file in the object's documents.",uploading:"Uploading\u2026",remove:"Remove",doc_deduped:"Already stored elsewhere \u2014 shared, no extra space used.",doc_dup_in_object:"This file is already attached to this object.",doc_link_not_allowed:"This link is not allowed: links that run scripts or open local files (javascript:, data:, file: \u2026) are refused.",doc_cat_manual:"Manual",doc_cat_warranty:"Warranty",doc_cat_invoice:"Invoice",doc_cat_spare_parts:"Spare parts",doc_cat_photo:"Photo",doc_cat_other:"Other",doc_link_badge:"Link",doc_storage_title:"Document storage",doc_storage_saved:"Saved via deduplication",doc_storage_refresh:"Refresh",doc_download:"Download",doc_close:"Close",doc_camera:"Take photo",camera_capture_shoot:"Capture",camera_switch_lens:"Switch camera",camera_switching:"Switching camera\u2026",camera_not_answered:"This camera did not answer. Tap the switch again to try the next one, or use the file picker.",camera_diagnostics:"Details for a bug report",camera_copy:"Copy",camera_copied:"Copied",doc_drop_hint:"Drop files here",doc_task_none:"No documents linked to this task.",doc_link_existing:"Link a document\u2026",doc_attach:"Link",doc_unlink:"Unlink",doc_page:"Page",chart_range_7d:"7d",chart_range_30d:"30d",chart_range_90d:"90d",chart_range_1y:"1y",chart_since_service:"since last service",chart_no_stats:"No long-term statistics for this entity \u2014 showing maintenance-event values only",auto_complete_on_recovery:"Auto-complete when the sensor recovers",auto_complete_on_recovery_help:"Records a completion (sets last performed) when the trigger clears itself \u2014 e.g. salt refilled, filter replaced.",trigger_end:"When the state ends",trigger_end_ok:"The task goes back to OK",trigger_end_done:"Record the task as done",trigger_end_hold:"Keep the task triggered until it is done",trigger_end_hold_help:"For a state that lasts only a moment, such as a finished wash: the task stays until it is completed, by hand or by its Done when entity.",trigger_detail_attribute:"Show with the task (optional)",trigger_detail_none:"Nothing",trigger_detail_attribute_help:"While the trigger is active, the value of this attribute shows after the task's name and in its reminder: which medicine is running low, which window is open.",doc_search:"Search documents\u2026",doc_search_none:"No matching documents",doc_description:"Description (optional)",doc_sort:"Sort documents",doc_sort_newest:"Newest first",doc_sort_oldest:"Oldest first",doc_sort_title:"By title (1, 2, 3 \u2026)",doc_sort_category:"By category",link_device_optional:"Link to existing device (optional)",parent_object_optional:"Parent object (optional)",parent_none:"(No parent)",parent_object_hint:"Shown inside the parent in the lists of objects.",sub_objects:"Sub-objects",sub_objects_count:"{n} sub-objects",sub_objects_count_one:"1 sub-object",add_sub_object:"Add sub-object",sub_object_move_here:"Move an existing object here",sub_object_move_message:"The object moves inside {name}, with everything inside it. Its tasks and history stay as they are.",sub_object_move_confirm:"Move here",sub_object_moved:"Moved inside {name}",templates_inside:"The new object goes inside {name}.",sub_objects_show:"Show sub-objects",sub_objects_hide:"Hide sub-objects",paused:"Paused",pause_object:"Pause",resume_object:"Resume",pause_task:"Pause",resume_task:"Resume",pause_task_prompt:"Freeze this task's schedule \u2014 it does not become due and does not notify until you resume it, and resuming starts a fresh cycle from that day. The object's other tasks keep running. Optionally set a date to resume by itself.",task_paused:"Task paused",task_resumed:"Task resumed \u2014 its schedule restarted",pause_until_prompt:"Freeze this object's schedules \u2014 nothing becomes due and nothing notifies until it is resumed. Optionally set an auto-resume date.",pause_until_label:"Resume on (optional)",object_paused:"Object paused",object_resumed:"Object resumed \u2014 schedules restarted",object_paused_badge:"Paused",paused_until_label:"until",replace_object:"Replace\u2026",replace_object_prompt:"Retire this object and create a successor. History and costs stay archived on the old one; tasks and documents carry over to the new one, counters start fresh.",replace_name_label:"Successor name",replace_device_heading:"Device in Home Assistant",replace_device_keep:"Same device as before ({device})",replace_device_keep_hint:"Also the choice when the new unit is not in Home Assistant yet: once it is, pick it as the object's device in its settings \u2014 the sensor triggers move along then.",replace_device_other:"The new unit is another device",replace_device_pick:"Device of the new unit",replace_device_other_hint:"Sensor triggers, completion actions and the counter reset move to the matching entities of that device.",replace_device_none:"No device",object_replaced:"Object replaced \u2014 successor created",device_swap_moved:"{count} sensor links moved to the new device.",device_swap_moved_one:"One sensor link moved to the new device.",device_swap_unmatched:"{count} could not be matched \u2014 check those tasks' sensor triggers.",device_swap_unmatched_one:"One could not be matched \u2014 check that task's sensor trigger.",reading_unit_label:"Reading unit (e.g. kWh, m\xB3)",reading_unit_help:"Shown next to the recorded value when completing this task.",reading_value_label:"Reading value",reading_label:"Reading",readings_section:"Readings",readings_hint:"Several named values per completion \u2014 one row per meter. Leave empty to record a single value.",reading_name_label:"Reading name",reading_unit_short:"Unit",reading_add:"Add reading",reading_duplicate_name:"Name already used",reading_last:"last: {value}",reading_below_last:"Lower than the last reading ({value})",settings_templates_label:"Template gallery",settings_templates_hint:`Untick templates you'll never need \u2014 they disappear from the "From template" pickers (panel and config flow). Nothing else changes; you can re-enable them any time.`,home_profile_title:"Home profile",home_profile_hint:"Recommends templates and sets seasonal windows for your climate and hemisphere. Everything is worked out locally from your floors, areas and home location.",home_type_label:"Home type",home_type_auto:"Automatic ({detected})",home_region_label:"State, province or region",home_region_none:"not found",home_region_hint:"Some rules differ within a country \u2014 a yearly vehicle inspection in one state, none in the next. Found from your home location.",home_dwelling_house:"House",home_dwelling_apartment:"Apartment",home_dwelling_unknown:"not recognised",home_detected_from:"Detected from: {reasons}",home_reason_floors:"several floors",home_reason_basement:"a basement",home_reason_garden:"a garden",home_reason_shed:"a shed",home_reason_driveway:"a driveway",home_reason_garage:"a garage",home_reason_attic:"an attic",home_reason_lawn_mower:"a lawn mower",home_reason_gate:"a gate",home_reason_balcony:"a balcony",home_reason_small_home:"few rooms on one floor",home_reason_ups:"a UPS",home_climate_label:"Climate",home_climate_value:"K\xF6ppen {koppen} \xB7 coldest month {cold} \xB0C \xB7 warmest month {warm} \xB0C",home_climate_unknown:"No home location set in Home Assistant",home_hemisphere_south:"Southern hemisphere \u2014 seasonal windows are mirrored",home_trait_freeze:"Frost in winter",home_trait_snow:"Snowy winters",home_trait_severe_winter:"Severe winters",home_trait_damp:"Damp climate",home_trait_mediterranean:"Mediterranean climate",home_trait_earthquake:"Earthquake region",home_trait_hot_summer:"Hot summers",home_trait_hot_humid:"Hot and humid",home_trait_hot_dry:"Hot and dry",home_trait_termites:"Termite region",home_trait_wildfire:"Wildfire risk",home_trait_cyclone:"Hurricane / typhoon region",home_trait_tropical:"Tropical climate",home_trait_radon:"Radon test recommended",home_reason_starter:"Basics for your home",home_reason_country:"Common in {country}",home_reason_feature:"Found in your home: {feature}",templates_recommended_title:"Recommended for your home",templates_recommended_hint:"Based on your home profile \u2014 adjust it in Settings.",templates_legal_hint:"Notes on legal duties and intervals are guidance, not legal advice. Rules vary by region and change over time \u2014 local regulations and the manufacturer's instructions take precedence.",templates_not_typical:"Not typical for your home type",templates_set_up:"Already set up",worksheet:"Work sheet",worksheet_scan_view:"Scan to open the task",worksheet_scan_complete:"Scan to complete",worksheet_manual_excerpt:"Manual excerpt",worksheet_pages:"pages",worksheet_printed:"Printed",worksheet_never:"Never",card_all_caught_up:"All caught up \u2014 nothing needs attention",postpone:"Postpone",postpone_date_prompt:"Postpone this occurrence to which date?",postpone_date_label:"New due date",postponed:"Postponed",postponed_to:"Postponed to",season_window_label:"Seasonal window (months)",season_window_hint:"Only due in the selected months; off-season dates roll to the next active month. None = all year.",series_end_label:"Ends",series_end_never:"Never (repeats indefinitely)",series_end_after_count:"After a number of times",series_end_until:"On a date",series_end_count_label:"Number of times",series_end_until_label:"End date",parts_section:"Parts & consumables",parts_inventory_value:"Inventory value",part_add:"Add part",part_name:"Name",part_vendor:"Manufacturer",part_storage_location:"Storage location",part_product_url:"Product URL",part_unit:"Unit",part_cost:"Unit price",part_cost_mode:"Counts as spending",part_cost_mode_house:"As in Settings ({mode})",part_cost_mode_hint:"When bought: the purchase counts, in the year it is made. When used: every completion that uses the part books its price on the object, and so the area, where it is used.",part_stock:"Stock",part_reorder_threshold:"Reorder at",part_restock_quantity:"Restock quantity",part_package_size:"Package size (units)",part_restock_packages:"Restock amount (packages)",part_package_hint:"Bought in packages, used in the unit: stock, the amount a task uses and the reorder threshold count units; the restock amount and the price are per package.",part_auto_buy:"Auto-create buy task when low",part_reuse:"After use",part_reuse_none:"Used up",part_reuse_charge:"Charged",part_reuse_sharpen:"Sharpened",part_reuse_clean:"Cleaned",part_reuse_dry:"Dried",part_reuse_refill:"Refilled",part_reuse_restore:"Restored",part_waiting_charge:"{count} to charge",part_waiting_sharpen:"{count} to sharpen",part_waiting_clean:"{count} to clean",part_waiting_dry:"{count} to dry",part_waiting_refill:"{count} to refill",part_waiting_restore:"{count} to restore",part_restoring:"Used, not ready yet",part_ready_again_hint:"All used ones are ready again",part_dispose:"Dispose",part_dispose_hint:"Gone for good, such as a dead cell: off the waiting pile, not back to the stock",part_dispose_how_many:"How many are gone for good",part_use:"Use",part_use_hint:"Used outside a task: off the stock like the parts of a completion",part_use_how_many:"How much was used",part_use_not_booked:"Not booked as spending: this part counts when used, which only a task's completion books.",part_reuse_hint:"A used one is not gone: it waits until it is ready again and still counts as owned, so it is not bought again.",part_restock:"Adjust stock",parts_used_by:"Used by",restock_quantity_label:"Quantity bought",consumes_parts_label:"Consumes parts",task_parts_fleet_hint:"Battery quantities come from Battery Notes per device \u2014 nothing to link here.",shared_parts_other_objects:"Parts from other objects",shared_parts_help:"Several objects can share one stock. Completing this task takes from the owning object.",shared_part_unknown:"Unknown part",parts_load_failed:"Couldn't load this object's parts \u2014 the consumes-parts options are unavailable right now.",adopt_problem_button:"Adopt problem sensors",adopt_problem_title:"Adopt problem sensors",adopt_problem_hint:"Turn HA problem sensors (printer errors, filter warnings, low battery) into maintenance tasks that trigger while the problem is active and clear themselves when it resolves.",adopt_problem_none:"No problem sensors found that aren't already tracked.",adopt_problem_active:"active",adopt_problem_ok:"ok",adopt_problem_new_object:"(new)",adopt_object_hint:"Give several sensors the same object name and they become one object; type an existing object's name to add them there.",adopt_summary_title:"What adopting changes",adopt_summary_existing:'"{name}": tasks {before} \u2192 {after}',adopt_summary_totals:"Tasks: {tasks} \xB7 objects: {objects}",adopt_summary_totals_new:"Tasks: {tasks} \xB7 objects: {objects} ({new} new)",adopt_problem_adopt:"Adopt selected",adopt_problem_done:"Adopted {tasks} problem sensor(s)",adopt_problem_done_one:"Adopted 1 problem sensor",views_label:"Views",views_none:"\u2014 No view \u2014",views_manage:"Save / manage views",views_dialog_title:"Saved views",views_dialog_hint:"Save the current filters as a named view everyone can reuse.",views_name_placeholder:"View name",views_save_current:"Save current filters",views_none_yet:"No saved views yet.",close:"Close",trigger_hint_now:"The sensor reads {value} right now.",trigger_hint_above:"The task triggers once it rises above {target}.",trigger_hint_below:"It triggers once it falls below {target}.",trigger_hint_equals:"It triggers when it reads exactly {target}.",trigger_hint_not_equals:"It triggers when it reads anything but {target}.",trigger_hint_overlap:"These limits overlap: every reading triggers the task and it can never recover. Leave one of them empty.",trigger_hint_counter_delta:"Counts from the current reading ({value}): due at {due} (+{target}), and the count restarts after each completion.",trigger_hint_counter_delta_edit:"Counts usage since the last completion: due after +{target}; the count restarts after each completion.",trigger_hint_counter_abs:"The task becomes due once the sensor reaches {target}.",trigger_hint_runtime:"The task becomes due after {hours} h of accumulated on-time; the counter restarts after each completion.",trigger_hint_due_date:"The task becomes due {days} days before the date the sensor reports.",trigger_hint_due_date_one:"The task becomes due one day before the date the sensor reports.",trigger_hint_due_date_same_day:"The task becomes due on the date the sensor reports.",trigger_hint_due_date_now:"Reported date: {date}.",trigger_hint_state_change:"The task becomes due after {count} state change(s).",trigger_hint_state_change_to:"The task becomes due after {count} change(s) to \u201C{state}\u201D.",trigger_hint_state_now:"Current state: {value}.",adopt_problem_part:"Uses part: {name}",label_filter:"Label",all_labels:"All labels",filter_place:"Place",filter_place_all:"All places",settings_notify_scope:"Notify only for view",settings_notify_scope_all:"All tasks",settings_notify_scope_hint:"Only tasks matching the selected saved view's label/user filters send reminders. Status, sorting and grouping of the view are ignored here.",settings_notify_completed:"Completion notifications",settings_notify_completed_hint:`Household news when a task is completed, with the reason and who did it. "Automatic only" announces just the completions nobody made on the spot: sensor recovery, shopping-list check-off, an automation's service call. Sent to the household service only; quiet hours and the daily cap apply.`,settings_title_style:"Notification title style",settings_title_style_hint:"What appears as the notification's TITLE. Default keeps the per-status text (e.g. 'Maintenance overdue!'). Object name / Task name help when phone notifications stack.",title_style_default:"Default (per-status title)",title_style_object_name:"Object name as title",title_style_task_name:"Task name as title",notify_completed_off:"Off",notify_completed_automatic:"Automatic completions only",notify_completed_all:"All completions",settings_notify_rule:"Your own notification rule",settings_notify_rule_hint:"Every notification also fires the event maintenance_supporter_notification (kind, status, object, task, reference numbers, priority, deep link, the payload). Route it with an automation \u2014 e.g. into Ticker, Telegram or Pushover.",settings_notify_event_only:"Only fire the event, send nothing myself",settings_notify_event_only_hint:"Your automation is the whole delivery. Rate limits, quiet hours and the daily cap still apply to when the event fires.",settings_notify_extra_data:"Extra notification data (template)",settings_notify_extra_data_hint:"JSON or YAML, Jinja allowed; merged into the notify call's data (your keys win). Variables: kind, status, priority, labels, notes, area_name, object_name, task_name, object_ref, task_ref, days_until_due, next_due, last_performed, responsible_user_id, sensor_entity_id, url, target, title, message. Test it with the Send test button.",card_saved_view:"Saved view",card_saved_view_none:"None",card_saved_view_help:"Applies the view's status, user, label and priority filters on top of the filters above. The view's sorting and grouping are panel display settings and are not applied on the card.",panel_card_tab:"Open on tab",panel_card_tab_default:"Remembered tab (as in the panel)",panel_card_view:"Open with saved view",panel_card_height:"Height",panel_card_height_help:"Empty = fill the screen below the card (panel view). Otherwise a CSS length such as 600px or 80vh for views with other cards.",panel_card_not_registered:"The Maintenance Supporter panel is not available \u2014 is the integration set up?",panel_card_load_failed:"The Maintenance Supporter panel could not be loaded \u2014 reload the page (after an update: clear the browser cache).",doc_part_none:"No documents linked to this part.",settings_templates_toggle_group:"Enable or disable all templates in this group",setups_button:"Suggested setups",setups_title:"Suggested setups (Beta)",setups_hint:"Devices of supported integrations whose consumable sensors can drive maintenance tasks. Adopting creates the object and wires each task to its sensor \u2014 it triggers when the consumable runs low and resolves itself after replacement.",setups_none:"No supported devices with unwired consumable sensors found.",setups_adopt:"Set up selected",setups_done:"{tasks} sensor-wired tasks created.",setups_done_one:"1 sensor-wired task created.",complete_parts_used:"Parts used this time",part_delete_confirm:"Delete part '{name}'? Its stock tracking, task links and any open buy reminder will be removed.",baseline_start_value:"Start reading (optional)",baseline_start_help:"Counting starts from this reading. Leave empty to count from the current value; enter the reading at the last service so usage since then already counts.",setups_baseline_hint:"reading at last service (optional)",baseline_start_help_edit:"Leave empty to keep the existing counting. Entering a value re-anchors the counting (e.g. the reading at the last service).",baseline_current_effective:"Currently effective start value: {value}",runtime_on_states:"Active states",runtime_on_states_help:"States that count as running \u2014 default: on. E.g. mowing, cleaning, printing. With an attribute selected, its values are matched instead.",runtime_max_session:"Max session runtime (seconds)",runtime_max_session_help:"A single run counts at most this many seconds \u2014 protects against a sensor stuck ON (lost connection, restart). Empty = no cap.",trend_approaching:"Heading toward the threshold",trend_easing:"Easing away from the threshold",split_select_hint:"Select a task to see its details here",setups_target_new:"Create new: {name}",setups_target_match:"{name} \u2014 matches: {reasons}",setups_reason_model:"model number",setups_reason_name:"name",setups_reason_area:"area",setups_reason_sibling:"same model on another device",setups_maybe_covered:'Probably there already as "{name}"',setups_already:"Already there: {names}",setups_reset_line:"Completing it also resets the counter in the integration (\u201C{button}\u201D)",setups_reset_enable:"\u2014 the button gets switched on for this",reset_offers_title:"Reset counters on completion",reset_offers_hint:"These tasks watch a counter the integration keeps itself. Connected, completing the task here also presses the integration's reset button \u2014 otherwise the counter keeps running and the task falls due again right away.",reset_offers_before:"Now: completing it leaves the counter in {integration} running",reset_offers_after:"Then: it also presses \u201C{button}\u201D",reset_offers_renamed:"Renamed since it was set up \u2014 check that this task is for this part",reset_offers_apply:"Connect resets",reset_offers_done:"{count} tasks now reset their counter on completion",reset_offers_done_one:"1 task now resets its counter on completion",setups_before_after:"Tasks on the object: {before} \u2192 {after}",setups_new_object_count:'New object "{name}" \xB7 tasks: {count}',schedule_preview_title:"Next dates",schedule_preview_ontime:"Assuming on-time completion.",schedule_preview_ends:"(series ends)",adopt_problem_responsible:"Responsible user for all adopted tasks (optional)",adopt_for_minutes_hint:"Only trigger once the problem has persisted this long \u2014 0 reacts to the first flicker.",adopt_problem_configure:"Configure",history_auto:"Automatic",battery_fleet_title:"Battery fleet",battery_fleet_none_low:"All batteries OK \u2014 nothing to replace.",battery_fleet_progress:"{n} to replace",battery_fleet_buy_now:"Buy now",battery_fleet_soon:"Needed soon",battery_fleet_soon_hint:"Predicted from the last replacement date \u2014 order ahead.",battery_fleet_mark_all:"Mark all replaced",battery_fleet_mark_one:"Mark this battery replaced",battery_fleet_offline:"offline",battery_fleet_no_sensor:"No sensor",battery_fleet_trigger_lost:"This task's sensor trigger was lost \u2014 it will not fire or auto-complete.",battery_fleet_repair:"Repair",battery_fleet_exclude:"Exclude from the fleet",battery_fleet_excluded:"Excluded",battery_fleet_include:"Track again",battery_fleet_all:"All tracked batteries",battery_fleet_all_hint:"Exclude a device here to drop it from the fleet before it ever reports low \u2014 a vacuum that recharges itself, or a phone that warns you on its own.",battery_fleet_add:"Add a battery",battery_fleet_add_hint:"Pick a battery sensor the automatic discovery missed \u2014 it joins the roster immediately.",battery_fleet_track_self:"Track self-charging batteries",battery_fleet_track_self_hint:"Phones, vacuums and other devices that recharge themselves appear as rechargeables \u2014 a low one asks for a charge, never for new cells.",battery_fleet_due_without_sensor:"Treat a passed forecast as due when a battery has no sensor",battery_fleet_due_without_sensor_hint:"Some devices report no battery level at all \u2014 Battery Notes only knows the type and the last replacement. Once the typical lifetime has passed, such a battery counts as low and the fleet task reminds you; marking it replaced resets the forecast.",battery_fleet_ask_cells:"Ask which cells went in when a battery is replaced",battery_fleet_ask_cells_hint:"A device takes whatever is in the drawer. Replaced then asks whether disposable or rechargeable cells of its size went in, books those and remembers them for the device. Battery Notes keeps its type; the shopping list and the forecast follow it.",battery_fleet_cells_question:"Which cells went in?",battery_fleet_cells_rechargeable:"rechargeable",battery_fleet_status_low:"Low",battery_fleet_status_soon:"Soon",battery_fleet_status_ok:"Healthy",battery_fleet_status_due:"Due",battery_fleet_predicted_on:"Expected around {date}",battery_fleet_predicted_typical:"Expected around {date} \u2014 {months} months typical for {type} ({source})",lifetime_source_default:"built-in default",lifetime_source_table:"built-in table",lifetime_source_learned:"learned from {n} replacements",lifetime_source_override:"your setting",lifetime_source_learned_device:"learned from this device's {n} replacements",lifetime_source_learned_model:"learned from {n} replacements on devices of this model",battery_fleet_predicted_trend:"Predicted from this battery's discharge trend: around {date} ({confidence})",battery_fleet_rechargeable:"Rechargeable: charge instead of replacing \u2014 never on the shopping list",battery_fleet_sort_name:"Sort by name",battery_fleet_sort_urgency:"Sort by urgency",battery_fleet_mark_recharged:"Mark as recharged",battery_fleet_charging:"Rechargeable spares",battery_fleet_ready:"{count} ready",battery_fleet_sparkline_hint:"Battery level over the last 30 days \u2014 dotted: projected until the low threshold",battery_fleet_filter_type:"Show only this battery type",battery_fleet_record_replacement:"The level jumped around {date} \u2014 record this replacement in Battery Notes",battery_fleet_total:"{n} batteries tracked",battery_fleet_setup_button:"Battery fleet",battery_fleet_setup_done:"Battery fleet set up \u2014 one task tracks all your batteries.",update_banner:"A newer version of Maintenance Supporter is on the server \u2014 reload to update the panel.",update_reload:"Reload",restart_pending_banner:"Maintenance Supporter was updated to {version}. Restart Home Assistant to finish the update.",restart_pending_error:"That did not work: Maintenance Supporter was updated to {version}, but Home Assistant has not been restarted since. Restart Home Assistant, then try again.",row_actions_banner:"Complete and Skip in task rows are now buttons. Prefer the old icons?",row_actions_keep:"Keep buttons",row_actions_back:"Back to icons",battery_fleet_forecast_overdue:"Predicted date passed \u2014 the battery still reports healthy. If you swapped it, record the replacement; otherwise the forecast was off.",cost_from_parts:"Use \u2248 {amount} from parts",cost_parts_booked:"Parts used \u2248 {amount} are booked automatically \u2014 enter only additional costs.",cost_parts_info:"Parts used \u2248 {amount} \u2014 counted when they were bought, not here.",cost_purchase_use_hint:"The price paid becomes the part's price \u2014 spare parts count when they are used.",history_parts_counted:"Parts: {amount}",history_parts_counted_hint:"Value of the parts used \u2014 counted as spending",history_parts_info:"Parts \u2248 {amount}",history_parts_info_hint:"Value of the parts used \u2014 information only; the money counted when they were bought",history_purchase_stock:"Bought for {amount} (counted when used)",dismiss:"Dismiss",gs_label:"Getting started \u2014 these hints retire as your setup grows",gs_setups_chip:"Suggested setups found {n} devices with pre-wired triggers",gs_setups_chip_one:"Suggested setups found 1 device with pre-wired triggers",gs_adopt_chip:"{n} problem sensors can become maintenance tasks",gs_adopt_chip_one:"1 problem sensor can become a maintenance task",gs_fleet_chip:"One click sets up the battery fleet",gs_reset_chip:"{n} tasks can reset their counter in the integration",gs_reset_chip_one:"1 task can reset its counter in the integration",cal_editor_window:"Default window",cal_editor_window_week:"Week (7 days)",cal_editor_window_fortnight:"Fortnight (14 days)",cal_editor_window_month:"Month (30 days, default)",cal_editor_window_year:"Year (365 days, empty days collapsed)",cal_editor_window_past_30:"Past 30 days (history)",cal_editor_window_past_90:"Past 90 days (history)",cal_editor_show_chips:"Show window chips inside the card",cal_editor_chips_hint:"Hide the chips when the card is embedded in a strategy view that already serves as the window selector.",cal_editor_show_user_filter:"Show user filter dropdown",cal_editor_default_user:"Default user filter",cal_editor_my_tasks:"My tasks (current user)",cal_editor_show_object_filter:"Show object filter dropdown",cal_editor_object_hint:'Pre-select one object via YAML: object_filter: "<object name>" \u2014 or a list of names to restrict the card to several objects.',object_history_section:"History (all tasks)",object_history_all_tasks:"All tasks",object_history_empty:"No entries in this range.",object_history_cap_note:"History keeps up to 500 entries per task \u2014 very old entries may be missing.",service_record_title:"Service record",service_record_print:"Service record (PDF)",date:"Date",service_record_entries:"entries",ref_number:"Reference number",print_options_title:"Print service record",print_layout:"Layout",print_layout_chronological:"Chronological",print_layout_by_task:"By task",print_include:"Include",print_inc_readings:"Readings",print_inc_parts:"Parts used",print_inc_photos:"Photos",print_inc_documents:"Linked documents",print_inc_doc_desc:"Document descriptions",print_inc_checklist:"Checklist",print_inc_notes:"Notes",print_inc_costs:"Cost and duration",print_inc_person:"Completed by",print_inc_refs:"Reference numbers",print_inc_bare:"Completions without details",print_inc_qr:"QR code per task",print_button:"Print",report_scan_hint:"Scan to open the task",completed_by:"Completed by",date_from:"From",date_to:"To",phases_section:"Cycle phases (optional)",phases_hint:"Different work on one shared schedule \u2014 each completion moves to the next step (e.g. small service, small service, big service).",phase_add:"Add phase",phase_name:"Phase name",phase_sequence_label:"Cycle order",phase_sequence_add_step:"Add step",phase_current:"Current phase",phase_set:"Set as current",chart_history_fallback:"No long-term statistics for this entity \u2014 showing recorder state history (typically the last ~10 days)",chart_history_alarm:"Trigger view from recorder state history: 1 = alert state held for the hold time, 0 = fine (typically the last ~10 days)",chart_history_count:"Change count rebuilt from recorder state history since the last service (typically the last ~10 days)",prediction_cycles:"Learned from cycles",phase_require_override:"Override \u201CRequire on completion\u201D for this phase",history_add_past:"Add past completion",require_tag_scan:"Only complete by scanning the tag",require_tag_scan_help:"Proof of presence: Done is blocked on every surface until the NFC tag or QR code on the thing itself is scanned. Automations can pass 'via_tag_scan' to the complete service.",disallow_skip:"Don't allow skipping",disallow_skip_help:"The Skip action disappears from every surface, and the server refuses a skip from automations and voice too.",complete_when:"Done when (optional)",complete_when_state:"changes to",complete_when_help:"While the task is due, it completes itself when this entity changes to this state, for example when the washer's door opens.",complete_when_badge:"Done when {entity} changes to {state}",no_notifications:"No notifications for this task",no_notifications_help:"No reminders for this task \u2014 no status notifications, repeats, lead-time reminders or bundles. It still shows on the dashboard and in its entities; the weekly digest still counts it.",require_tag_scan_hint:"This task completes only by scanning its NFC tag or QR code on the thing itself \u2014 saving here will be refused."}});function rr(r){return Ks[r]??"var(--secondary-text-color)"}function nr(r){return nl[r??""]??ni.length}function Qs(r){return sr.includes(r??"")}var ye,Ks,Ys,ni,sr,nl,At,Qe=y(()=>{"use strict";ye={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"var(--deep-orange-color, #ff5722)",archived:"var(--disabled-color, #9e9e9e)",paused:"var(--info-color, #2196f3)"},Ks={completed:ye.ok,missed:ye.overdue,reset:ye.paused,skipped:"var(--secondary-text-color)",triggered:ye.triggered,trigger_replaced:ye.triggered,trigger_removed:"var(--secondary-text-color)"},Ys=["completed","reset","skipped"];ni=["overdue","triggered","due_soon","ok"],sr=["overdue","triggered","due_soon"],nl=Object.fromEntries(ni.map((r,s)=>[r,s]));At={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",archived:"mdi:archive-outline",paused:"mdi:pause-circle-outline",completed:"mdi:check-circle",skipped:"mdi:skip-next",missed:"mdi:calendar-remove",reset:"mdi:refresh"}});function Js(r){return r?.restart_pending&&r.installed_version?r.installed_version:null}var Zs,ar=y(()=>{"use strict";Zs="2.111.0"});function dr(r){De.en=Object.assign({},r,De.en??{})}function xe(r){let s=(r||lr).toLowerCase();return s.startsWith("pt")&&s.endsWith("br")?"pt-br":s.substring(0,2)}function N(r){return r?.language||"en"}function n(r,s,e){let t=xe(s);return De[t]?.[r]??De.en?.[r]??e??r}function Ze(r){let s=xe(r);return s===lr||s in De||!Xs.has(s)}function ue(r){let s=xe(r);if(s===lr||s in De||!Xs.has(s))return Promise.resolve();let e=or[s];return e!==void 0&&Date.now()-e<al?Promise.resolve():(s in Ct||(Ct[s]=fetch(`${ol}/${s}.json?v=${Zs}`).then(t=>t.ok?t.json():null).then(t=>{t?De[s]=t:(delete Ct[s],or[s]=Date.now())}).catch(()=>{delete Ct[s],or[s]=Date.now()})),Ct[s])}var lr,cr,De,Ct,or,al,Xs,ol,Rt=y(()=>{"use strict";ar();lr="en",cr=(()=>{let r=window;return r.__msLocales||(r.__msLocales={store:{},inflight:{}}),r.__msLocales.failedAt||(r.__msLocales.failedAt={}),r.__msLocales})(),De=cr.store,Ct=cr.inflight,or=cr.failedAt,al=6e4;Xs=new Set(["de","nl","fr","it","es","pt","pt-br","ru","uk","pl","cs","sv","zh","da","fi","nb","ja","hi","hu","ko","tr"]),ol="/maintenance_supporter_locales"});function en(r){let s=r?.language;!s||typeof r?.loadBackendTranslation!="function"||X.lang===s&&(X.localize||X.inflight)||(X.lang=s,X.localize=null,X.inflight=r.loadBackendTranslation("exceptions",pr).then(e=>{X.lang===s&&(X.localize=e)}).catch(()=>{}).finally(()=>{X.inflight=null}))}function tn(r,s,e){if(!s||!X.localize||r&&r!==pr)return null;let t=`component.${pr}.exceptions.${s}.message`,i=X.localize(t,e??void 0);return i&&i!==t?i:null}var pr,X,ur=y(()=>{"use strict";pr="maintenance_supporter",X=(()=>{let r=window;return r.__msBackendErrors??={lang:"",localize:null,inflight:null}})()});function It(r){let s=rn.get(r);if(s===void 0){try{s=new Intl.DateTimeFormat("en-US",{timeZone:r,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{s=null}rn.set(r,s)}return s}function an(){if(hr===void 0){let r;try{r=new Intl.DateTimeFormat().resolvedOptions().timeZone}catch{}hr=r&&It(r)?r:null}return hr}function on(){return an()??"UTC"}function we(){let r=nn.serverTimeZone;return r&&It(r)?r:on()}function ke(){let r=an();return nn.timeZone!=="server"&&r?r:we()}function ai(r,s){let e=It(s)??It(on())??It("UTC"),t={};for(let i of e.formatToParts(r))i.type!=="literal"&&(t[i.type]=Number(i.value));return{y:t.year,mo:t.month,d:t.day,h:t.hour%24,mi:t.minute,s:t.second}}function $e(r,s){return gr(ai(+r,s))}function oi(r,s){let e=ai(+r,s);return`${gr(e)}T${ee(e.h)}:${ee(e.mi)}`}function he(){return $e(Date.now(),we())}function ln(){return oi(Date.now(),we())}function _r(r,s){let e=ai(r,s);return Date.UTC(e.y,e.mo-1,e.d,e.h,e.mi,e.s)-Math.floor(r/1e3)*1e3}function ll(r,s,e,t,i,a,o){let c=Date.UTC(r,s-1,e,t,i,a),h=_r(c-mr,o),_=_r(c+mr,o);for(let m of h===_?[h]:[h,_])if(_r(c-m,o)===m)return c-m;return c-h}function cn(r,s,e){if(r.has(s))return r.get(s);r.size>=pl&&r.clear();let t=e();return r.set(s,t),t}function U(r){if(typeof r!="string"||!r)return NaN;let s=fr.exec(r);if(!s)return Date.parse(r);let e=we();return cn(dl,`${e}|${r}`,()=>{let[t,i,a,o,c,h]=[s[1],s[2],s[3],s[4]??"0",s[5]??"0",s[6]??"0"].map(Number);if(i<1||i>12||new Date(Date.UTC(t,i-1,a)).getUTCDate()!==a||o>23||c>59||h>59)return NaN;let _=s[7]?Math.floor(+`0.${s[7]}`*1e3):0;return ll(t,i,a,o,c,h,e)+_})}function li(r){if(typeof r!="string"||!r)return null;let s=fr.exec(r);if(s)return`${s[1]}-${s[2]}-${s[3]}`;let e=we();return cn(cl,`${e}|${r}`,()=>{let t=Date.parse(r);return Number.isFinite(t)?$e(t,e):/^\d{4}-\d{2}-\d{2}/.test(r)?r.slice(0,10):null})}function dn(r){if(typeof r!="string"||!r)return"";let s=fr.exec(r);if(s)return`${s[1]}-${s[2]}-${s[3]}T${s[4]??"00"}:${s[5]??"00"}:${s[6]??"00"}`;let e=Date.parse(r);if(!Number.isFinite(e))return"";let t=ai(e,we());return`${gr(t)}T${ee(t.h)}:${ee(t.mi)}:${ee(t.s)}`}function sn(r){let s=pn.exec(r);if(!s)return NaN;let[e,t,i]=[Number(s[1]),Number(s[2]),Number(s[3])],a=Date.UTC(e,t-1,i);return t>=1&&t<=12&&new Date(a).getUTCDate()===i?a/mr:NaN}function un(r,s){let e=pn.exec(r);if(!e)return r;let t=new Date(Date.UTC(Number(e[1]),Number(e[2])-1,Number(e[3])+Math.round(s)));return`${ee(t.getUTCFullYear(),4)}-${ee(t.getUTCMonth()+1)}-${ee(t.getUTCDate())}`}function hn(r,s){return sn(s)-sn(r)}var nn,mr,ee,rn,hr,gr,fr,cl,dl,pl,pn,W=y(()=>{"use strict";nn=window.__msDateTimePrefs??={},mr=864e5,ee=(r,s=2)=>String(r).padStart(s,"0"),rn=new Map;gr=r=>`${ee(r.y,4)}-${ee(r.mo)}-${ee(r.d)}`;fr=/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?$/,cl=new Map,dl=new Map,pl=2e4;pn=/^(\d{4})-(\d{2})-(\d{2})$/});function qe(r){return r?.currency_symbol||ul}function ci(r,s){s.has("hass")&&br(r.hass?.locale,r.hass?.config?.country,r.hass?.config?.time_zone);let e=r.hass?.language;e&&!Ze(e)&&ue(e).then(()=>{Ze(e)&&r.requestUpdate()}),en(r.hass)}function _n(r){let s=xe(r);return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN",da:"da-DK",fi:"fi-FI",nb:"nb-NO",ja:"ja-JP",hi:"hi-IN",pl:"pl-PL",cs:"cs-CZ",sv:"sv-SE","pt-br":"pt-BR",hu:"hu-HU",ko:"ko-KR",tr:"tr-TR"}[s]??"en-US"}function hl(r){gn.decimals=typeof r=="number"&&Number.isInteger(r)&&r>=0&&r<=3?r:0}function _l(){return gn.decimals??0}function di(r){r&&r.currency_decimals!==void 0&&r.currency_decimals!==null&&hl(Number(r.currency_decimals))}function br(r,s,e){e!==void 0&&(te.serverTimeZone=e||void 0),r&&(te.date=r.date_format,te.time=r.time_format,te.number=r.number_format,te.timeZone=r.time_zone,s!==void 0&&(te.country=s||void 0))}function ml(r){switch(te.number){case"comma_decimal":return["en-US","en"];case"decimal_comma":return["de","es","it"];case"space_comma":return["fr","sv","cs"];case"system":return;default:return _n(r)}}function pi(r,s,e,t,i="n"){return e===1?n(s,t):n(r,t).replace(`{${i}}`,j(e,t))}function j(r,s,e){if(!Number.isFinite(r))return String(r);let t=typeof e=="number"?{minimumFractionDigits:e,maximumFractionDigits:e}:{maximumFractionDigits:2,...e};if(te.number==="none"){let i=Math.pow(10,t.maximumFractionDigits??2);return String(Math.round(r*i)/i)}try{return new Intl.NumberFormat(ml(s),t).format(r)}catch{return new Intl.NumberFormat(void 0,t).format(r)}}function fn(r,s,e){return r<0?`${n("cost_kind_credit",e??"en")}: ${ie(-r,s,e)}`:ie(r,s,e)}function ie(r,s,e,t){let i=t??_l(),a=Math.abs(r)<.5/Math.pow(10,i)?0:r,o=j(a,e,i);return s?`${o} ${s}`:o}function Xe(r,s,e){let t=j(r,e);return s?`${t} ${s}`:t}function Je(r){let s=_n(r),e=te.country;if(e&&/^[A-Za-z]{2}$/.test(e)){let t=`${xe(r).split("-")[0]}-${e.toUpperCase()}`;try{return new Intl.DateTimeFormat(t),t}catch{}}return s}function vr(r,s,e){let t=te.date;if(t==="DMY"||t==="MDY"||t==="YMD"){let[a,o,c]=$e(r,e).split("-");return t==="DMY"?`${c}/${o}/${a}`:t==="MDY"?`${o}/${c}/${a}`:`${a}-${o}-${c}`}let i=t==="system"?void 0:Je(s);return r.toLocaleDateString(i,{day:"2-digit",month:"2-digit",year:"numeric",timeZone:e})}function ui(r,s){let e=ke();switch(te.time){case"12":return r.toLocaleTimeString(Je(s),{hour:"2-digit",minute:"2-digit",hour12:!0,timeZone:e});case"24":return r.toLocaleTimeString(Je(s),{hour:"2-digit",minute:"2-digit",hour12:!1,timeZone:e});case"system":return r.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit",timeZone:e});default:return r.toLocaleTimeString(Je(s),{hour:"2-digit",minute:"2-digit",timeZone:e})}}function M(r,s){if(!r)return"\u2014";try{let e=vn.exec(r);return e?vr(new Date(Date.UTC(+e[1],+e[2]-1,+e[3])),s,"UTC"):vr(new Date(U(r)),s,ke())}catch{return r}}function hi(r,s){if(!r)return"\u2014";if(vn.test(r))return M(r,s);try{let e=new Date(U(r));return vr(e,s,ke())+" "+ui(e,s)}catch{return r}}function _i(r,s=Date.now()){let e=we();return oi(s,e)===oi(s,ke())?"":n("ha_time_zone_hint",r).replace("{zone}",e)}function mi(r,s){if(r==null)return"\u2014";let e=s||"en";if(r<0)return`${Math.abs(r)} ${n("d_overdue",e)}`;if(r===0)return n("today",e);let t=r===1?"one":"other";try{t=new Intl.PluralRules(e).select(r)}catch{}return`${r} ${t==="one"?n("day",e):t==="few"?n("days_few",e):n("days",e)}`}function bn(r,s){let e=li(r);if(!e)return null;let t=hn(e,he());return Number.isFinite(t)?t<=0?n("last_done_today",s||"en"):n("last_done_days_ago",s||"en").replace("{n}",String(t)):null}function Pt(r,s,e){return r==null?"\u2014":`${r} ${n("unit_"+(s||"days"),e)}`}function gi(r,s){return r==null?"\u2014":`${j(r,s,{maximumFractionDigits:1})} ${n("minutes_short",s)}`}function jt(r,s,e="long"){return new Date(Date.UTC(2024,0,1+r)).toLocaleDateString(Je(s),{weekday:e,timeZone:"UTC"})}function yr(r,s,e="long"){return new Date(Date.UTC(2024,r,1)).toLocaleDateString(Je(s),{month:e,timeZone:"UTC"})}function yn(r,s){let e=r.schedule;if(r.schedule_type==="sensor_based"){let a=n("sensor_based",s),o=e&&e.kind==="interval"&&e.every?e.every:r.interval_days;return o?`${a} \xB7 ${Pt(o,(e&&e.kind==="interval"?e.unit:r.interval_unit)||"days",s)}`:a}let t=e?.offset?` ${e.offset>0?"+":"\u2212"}${Math.abs(e.offset)}d`:"",i=e?.months?.length?` \xB7 ${[...e.months].sort((a,o)=>a-o).map(a=>yr(a-1,s,"short")).join(", ")}`:"";switch(e?.kind){case"weekdays":return((e.weekdays||[]).map(a=>jt(a,s,"short")).join(" & ")||"\u2014")+t;case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?n("ord_last",s):n("ord_"+e.nth,s)} ${jt(e.weekday,s,"long")}${t}${i}`;case"day_of_month":return e.day==null?"\u2014":(e.day===-1?n(e.business?"last_business_day_month":"last_day_month",s):`${n("day_word",s)} ${e.day}`)+t+i;case"calendar":return`${n("calendar_entity_label",s)}: ${r.schedule_entity_name||e.entity_id||"\u2014"}${t}`;case"one_time":return r.due_date?M(r.due_date,s):n("one_time",s);case"manual":return n("manual",s);case"interval":return Pt(e.every,e.unit,s)}return r.schedule_type==="one_time"?r.due_date?M(r.due_date,s):n("one_time",s):r.schedule_type==="manual"?n("manual",s):r.schedule_type==="sensor_based"?n("sensor_based",s):r.interval_days!=null?Pt(r.interval_days,r.interval_unit,s):"\u2014"}function xn(r,s){r.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:s},bubbles:!0,composed:!0}))}var ul,mn,te,gn,vn,Ee,wn,gl,fl,fi,I=y(()=>{"use strict";P();Vs();Qe();Rt();ur();W();Rt();ul="\u20AC";dr(Gs);mn=window,te=mn.__msDateTimePrefs??={},gn=mn.__msMoneyPrefs??={};vn=/^(\d{4})-(\d{2})-(\d{2})$/;Ee=$`
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
`,wn=$`
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
`,gl=$`
  .person-chip { display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 100%; vertical-align: middle; }
  .person-avatar {
    width: 22px; height: 22px; border-radius: 50%; flex: none;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--person-color, #546e7a); color: #fff;
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.02em; line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .person-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
`,fl=$`
  .ref-chip {
    display: inline-block; font-size: 11.5px; font-weight: 500; line-height: 1; padding: 3px 6px;
    border-radius: 6px; border: 1px solid var(--divider-color); color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums; letter-spacing: .02em; vertical-align: middle; white-space: nowrap;
    user-select: all;
  }
  /* #189: "· Residual waste, Paper" after a calendar-driven task's name. */
  .event-titles { color: var(--secondary-text-color); font-weight: 400; }
`,fi=$`
  ${gl}
  ${fl}
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
    margin-left: 6px; padding: 0 7px; border-radius: 10px;
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
`});function kn(r,s,e){let t=new Blob([r],{type:e}),i=URL.createObjectURL(t),a=document.createElement("a");a.href=i,a.download=s,a.target="_blank",a.rel="noopener",a.style.display="none",document.body.appendChild(a),a.dispatchEvent(new MouseEvent("click")),document.body.removeChild(a),setTimeout(()=>URL.revokeObjectURL(i),6e4)}var xr=y(()=>{"use strict"});async function vl(r,s,e=300){return(await r.connection.sendMessagePromise({type:"auth/sign_path",path:s,expires:e})).path}async function wr(r,s,e=300){return vl(r,`/api/maintenance_supporter/document/${s}`,e)}async function $n(r,s,e=""){let t=window.open("about:blank","_blank");try{let i=await wr(r,s);t&&(t.location.href=new URL(i+e,window.location.origin).href)}catch(i){throw t&&t.close(),i}}var kr=y(()=>{"use strict";xr()});function $r(r){return r.replace(/[\t\n\r]/g,"").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g,"")}function Er(r){let s=/^([a-z][a-z0-9+.-]+):/i.exec($r(r||""));return s?s[1].toLowerCase():null}function et(r){let s=Er(r);return s!==null&&!bl.has(s)}function Sn(r){return!!r&&/^https?:\/\//i.test(r)}var bl,vi=y(()=>{"use strict";bl=new Set(["about","blob","data","file","filesystem","javascript","livescript","ms-appinstaller","ms-cxh","ms-cxh-full","ms-msdt","ms-officecmd","search","search-ms","view-source","vbscript"])});function wl(r){let s=(r||"").split(/\s+/).filter(Boolean);return s.length===0?"?":s.length===1?s[0][0].toUpperCase():(s[0][0]+s[s.length-1][0]).toUpperCase()}function kl(r){let s=0;for(let e of r)s=s*31+e.charCodeAt(0)>>>0;return Cn[s%Cn.length]}function yi(r){return r?{id:r.id,name:r.name,initials:r.initials||wl(r.name),color:r.color||kl(r.id)}:null}function Tr(r){return r?l`<span class="person-avatar" style="--person-color: ${r.color}" title=${r.name}>${r.initials}</span>`:p}var Cn,Ar=y(()=>{"use strict";P();Cn=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"]});var it,Cr=y(()=>{"use strict";Ar();it=class{constructor(s){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=s}updateHass(s){this.hass=s}async getUsers(s=!1){let e=Date.now();if(!s&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(s,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:s,task_id:e,user_id:t})}async getTasksByUser(s){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:s})).tasks}getUserName(s){return!s||!this.usersCache?null:this.usersCache.find(t=>t.id===s)?.name||null}getPerson(s){return yi(this.getUser(s))}getUser(s){return!s||!this.usersCache?null:this.usersCache.find(e=>e.id===s)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(s){return s?s===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}}});function $l(r,s){if(s<=0)return 0;let e=typeof r=="number"&&Number.isFinite(r)?Math.trunc(r):0;return e<0?0:e%s}function El(r){return!!(r?.phases&&r.phase_sequence&&r.phase_sequence.length>0)}function Rr(r){if(!r||!El(r))return null;let s=r.phase_sequence,e=$l(r.phase_cursor,s.length),t=s[e],i=r.phases?.[t];return i?{id:t,name:i.name,index:e,count:s.length,notes:i.notes,checklist:i.checklist!==void 0?i.checklist:r.checklist??[],consumesParts:i.consumes_parts!==void 0?i.consumes_parts:r.consumes_parts??[],requiredFields:i.required_completion_fields!==void 0?i.required_completion_fields:r.required_completion_fields??[]}:null}function Se(r){let s=Rr(r);return s?`${s.index+1}/${s.count} \xB7 ${s.name}`:""}var xi=y(()=>{"use strict"});function Pn(){let r=new Uint8Array(4);return(globalThis.crypto??{getRandomValues:s=>s.map(()=>Math.floor(Math.random()*256))}).getRandomValues(r),Array.from(r,s=>s.toString(16).padStart(2,"0")).join("")}function Te(r){let s=r?.reading_values;if(!Array.isArray(s))return[];let e=[],t=new Set;for(let i of s){if(!i||typeof i!="object")continue;let a=i;typeof a.id!="string"||!a.id||t.has(a.id)||typeof a.value!="number"||!Number.isFinite(a.value)||(t.add(a.id),e.push({id:a.id,name:typeof a.name=="string"?a.name:a.id,unit:typeof a.unit=="string"?a.unit:null,value:a.value}))}return e}function jn(r){return r.filter(s=>s.type==="completed"&&(s.reading_value!=null||Te(s).length>0)).sort((s,e)=>s.timestamp.localeCompare(e.timestamp))}function Nn(r){return jn(r??[]).map(s=>({timestamp:s.timestamp,values:Te(s)})).filter(s=>s.values.length>0)}function On(r,s,e){let t;for(let i of r){if(e!==void 0){let o=U(i.timestamp);if(!isNaN(o)&&o>=e)break}let a=i.values.find(o=>o.id===s);a&&(t=a)}return t}function Mn(r,s,e){let t=Te(s).find(a=>a.id===e);if(!t)return null;let i=null;for(let a of jn(r)){if(a.timestamp>=s.timestamp)break;let o=Te(a).find(c=>c.id===e);o&&(i=o.value)}return i==null?null:t.value-i}function Ln(r){let s=new Set,e=new Set;for(let t of r){let i=(t.name||"").trim().toLowerCase();i&&(s.has(i)?e.add(t.id):s.add(i))}return e}function Hn(r){let s=[],e=new Set,t=new Set;for(let i of r){let a=(i.name||"").trim();if(!(!a||e.has(i.id)||t.has(a.toLowerCase()))&&(e.add(i.id),t.add(a.toLowerCase()),s.push({id:i.id,name:a,unit:(i.unit||"").trim()||null}),s.length>=Ir))break}return s}var Ir,ze=y(()=>{"use strict";W();Ir=20});function ne(r){return`${r.entry_id??""}\0${r.part_id}`}function Dn(r,s,e,t){let i=!!r.entry_id&&r.entry_id!==s,a=i?r.entry_id:s,o=e.find(m=>m.entry_id===a),c=(o?.parts||[]).find(m=>m.id===r.part_id)||null,h=i&&o?.object?.name||"",_=c?.name||n("shared_part_unknown",t);return{part:c,foreign:i,ownerName:h,label:h?`${_} (${h})`:_}}function qn(r,s,e,t){let{part:i,label:a}=Dn(r,s,e,t),o=i&&i.stock!==null&&i.stock!==void 0?` (${Xe(i.stock,i.unit,t)})`:"",c=i?.storage_location?` \u2014 ${i.storage_location}`:"";return`${j(r.quantity,t)}\xD7 ${a}${o}${c}`}function zn(r,s,e,t){let a=(e.find(c=>c.entry_id===s)?.parts||[]).map(c=>({...c})),o=new Set(a.map(c=>ne({part_id:c.id})));for(let c of r?.consumes_parts||[]){if(!c.entry_id||c.entry_id===s)continue;let h=ne(c);if(o.has(h))continue;o.add(h);let{part:_,ownerName:m}=Dn(c,s,e,t);a.push({id:c.part_id,name:_?.name||n("shared_part_unknown",t),unit:_?.unit,stock:_?.stock??null,storage_location:_?.storage_location,cost:_?.cost??null,package_size:_?.package_size??null,cost_mode:_?.cost_mode??null,entry_id:c.entry_id,owner_name:m})}return a}var wi=y(()=>{"use strict";I()});function Un(r){return r==="use"?"use":"purchase"}function ki(r,s){let e=r?.cost_mode;return e==="use"||e==="purchase"?e:s}function Bn(r){let s=Fn(r?.cost);if(s===null)return null;let e=Fn(r?.package_size);return e&&e>0?s/e:s}var Fn,Nt=y(()=>{"use strict";Fn=r=>typeof r=="number"&&Number.isFinite(r)?r:null});function Sl(r,s){return typeof r=="number"&&Number.isFinite(r)&&r>=.01?r:s}function $i(r){let s=r.task??null,e=s?Rr(s):null,t=e?e.consumesParts:s?.consumes_parts||[],i=!!s?.part_ref,a=r.objects.find(m=>m.entry_id===r.entryId)?.parts||[],o=i?a.find(m=>m.id===s.part_ref.part_id):void 0,c=r.features?r.features.checklists:r.checklistsEnabled??!0,h=r.features?r.features.checklists?r.checklist??s?.checklist??[]:[]:r.checklist??[],_=r.features?r.features.adaptive&&(r.adaptiveEnabled??!!s?.adaptive_config?.enabled):!!r.adaptiveEnabled;return{entry_id:r.entryId,task_id:r.taskId,task_name:r.taskName,checklist:e?c?e.checklist:[]:h,adaptive_enabled:_,required_completion_fields:e?e.requiredFields:s?.required_completion_fields||[],task_type:s?.type||"",reading_unit:s?.reading_unit||"",readings:s?.readings||[],reading_history:Nn(s?.history),parts:i?[]:zn({consumes_parts:t},r.entryId,r.objects,r.lang),consumes_parts:i?[]:t,phase_label:e?Se(s):"",require_tag_scan:!!s?.require_tag_scan,restock_default:i?Sl(o?.restock_quantity,1):null,restock_unit_cost:i?o?.cost??null:null,restock_package:i&&o?.package_size?Xe(o.package_size,o.unit,r.lang):"",currency_symbol:qe({currency_symbol:r.currencySymbol}),consumes_info:t.map(m=>qn(m,r.entryId,r.objects,r.lang)),checklist_prefill:s?.checklist_progress||{},via_tag_scan:!!r.viaTagScan,parts_cost_mode:i?ki(o,r.partsCostMode??"purchase"):r.partsCostMode??"purchase"}}function Ei(r,s,e){r.entryId=s.entry_id,r.taskId=s.task_id,r.taskName=s.task_name,r.lang=e,r.checklist=s.checklist??[],r.adaptiveEnabled=!!s.adaptive_enabled,r.requiredFields=s.required_completion_fields??[],r.taskType=s.task_type??"",r.readingUnit=s.reading_unit??"",r.readings=s.readings??[],r.readingHistory=s.reading_history??[],r.parts=s.parts??[],r.consumesParts=s.consumes_parts??[],r.phaseLabel=s.phase_label??"",r.requireTagScan=!!s.require_tag_scan,r.restockDefault=s.restock_default??null,r.restockUnitCost=s.restock_unit_cost??null,r.restockPackage=s.restock_package??"",r.currencySymbol=qe(s),r.consumesInfo=s.consumes_info??[],r.checklistPrefill=s.checklist_prefill??{},r.viaTagScan=!!s.via_tag_scan,r.partsCostMode=s.parts_cost_mode??"purchase",r.open({viaTagScan:!!s.via_tag_scan})}var Si=y(()=>{"use strict";ze();wi();xi();I();Nt()});function ae(r,s=_e){return r?r.is_admin?!0:s.operatorWriteEnabled&&s.operatorIds.includes(r.id):!1}var _e,rt=y(()=>{"use strict";_e={operatorWriteEnabled:!1,operatorIds:[]}});var Wn,Vn,Gn,Ot,Mt,Lt,Pr,Ae,st,Ht=y(()=>{"use strict";Wn={default_warning_days:[0,365],default_consumable_threshold:[1,90],battery_low_percent:[1,90],battery_recovered_percent:[20,100],battery_low_delay_minutes:[0,1440],archive_oneoff_days:[0,3650],delete_archived_oneoff_days:[0,3650],notify_due_soon_interval_hours:[0,720],notify_overdue_interval_hours:[0,720],notify_triggered_interval_hours:[0,720],max_notifications_per_day:[0,1e3],notification_bundle_threshold:[2,20],snooze_duration_hours:[1,168],warranty_reminder_days:[1,365],budget_alert_threshold:[10,100],currency_decimals:[0,3]},Vn=[0,1440],Gn=[1,1e4],Ot=[0,365],Mt=15,Lt=[.1,.9],Pr=[0,365],Ae=[.01,1e4],st=[.01,1e5]});function Al(r){let[s,e]=Wn.default_warning_days,t=r?.general?.default_warning_days,i=r?.general?.row_action_style;return{features:{...nt.features,...r?.features??{}},defaultWarningDays:typeof t=="number"&&Number.isFinite(t)&&t>=s&&t<=e?t:nt.defaultWarningDays,rowActionStyle:Tl.includes(i??"")?i:nt.rowActionStyle,access:{operatorWriteEnabled:r?.operator_write_enabled===!0,operatorIds:Array.isArray(r?.admin_panel_user_ids)?r.admin_panel_user_ids.filter(a=>typeof a=="string"):[]},budget:r?.budget??null,rowActionNoticePending:r?.general?.row_action_notice_pending===!0,refsInLists:r?.general?.ref_numbers_in_lists===!0,objectsTableColumns:Array.isArray(r?.objects_table_columns)?r.objects_table_columns:void 0,partsCostMode:Un(r?.budget?.parts_cost_mode),mirrorTodoDefault:Array.isArray(r?.general?.mirror_todo_default_entities)?r.general.mirror_todo_default_entities.filter(a=>typeof a=="string"&&a!==""):[]}}function Kn(){let r=window;return r.__msSettingsCache??={promise:null}}function G(r){let s=Kn();if(s.promise)return s.promise;let e=r.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(t=>Al(t)).catch(()=>(s.promise===e&&(s.promise=null),nt));return s.promise=e,e}function Yn(){Kn().promise=null}var Tl,nt,at=y(()=>{"use strict";rt();Ht();Nt();Tl=["buttons_compact","buttons","icons"];nt={features:{adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact",access:_e,budget:null,rowActionNoticePending:!1,refsInLists:!1,objectsTableColumns:void 0,partsCostMode:"purchase",mirrorTodoDefault:[]}});function Dt(r){if(r.archived)return"archived";if(r.is_done)return"done";let s=r.status||"ok";return s==="ok"&&r.schedule_type==="manual"&&r.days_until_due==null?"no_due":s}function jr(r,s){return n(Il[r]??r,s)}function ot(r){let s=Dt(r);return s==="done"?Cl:s==="no_due"?Rl:ye[s]||"var(--disabled-color, #9e9e9e)"}function Pl(r){return r==="no_due"?"mdi:calendar-blank-outline":At[r==="done"?"completed":r]||"mdi:circle-medium"}function Qn(r,s,e="pill"){let t=Dt(r),i=jr(t,s);return e==="chip"?l`<span class="status-chip ${t}">${i}</span>`:l`<span class="status-badge ${t}" role="img" title="${i}" aria-label="${i}"><ha-icon icon="${Pl(t)}"></ha-icon><span class="status-label">${i}</span></span>`}var Cl,Rl,Il,Ti=y(()=>{"use strict";P();I();Qe();Cl="var(--maint-done-color, #78909c)",Rl="var(--secondary-text-color, #727272)";Il={done:"completed",no_due:"no_due_date"}});function C(r){return r.toFixed(1)}var qt=y(()=>{"use strict";I();W()});function Ai(r){return r?Array.isArray(r.entity_ids)&&r.entity_ids.length>0?[...r.entity_ids]:r.entity_id?[r.entity_id]:[]:[]}function Nr(r){if(!(!r||r.type==="compound"))return Ai(r)[0]}var Or=y(()=>{"use strict"});var Mr,Jn,Xn,Lr=y(()=>{"use strict";Mr=["low","normal","high"],Jn=[...Mr].reverse(),Xn=["round_robin","least_completed","random"]});function Ol(r){let s=r.replace(/_ids?$/,"").split("_").filter(Boolean);if(s.length===0)return r;let e=s.join(" ");return e.charAt(0).toUpperCase()+e.slice(1)}function Ml(r,s){let e=Nl[r];if(e){let t=n(e,s);if(t&&t!==e)return t}return Ol(r)}function Ll(r){let s=[...r.matchAll(/\['([^']+)'\]/g)].map(i=>i[1]),e=s.length?s[s.length-1]:void 0,t;return(t=r.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=r.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=r.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=r.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(r)?{field:e,rule:"required"}:(t=r.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(r)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(r)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function Hl(r,s){let e=new Set(ea(s));return ea(r).every(t=>e.has(t))}function ta(r,s,e){if(e=e??n("action_error",s),typeof r=="string")return r;if(typeof r!="object"||r===null)return e;let t=r,i=t.message||t.error?.message||"",a=t.code||t.error?.code||"",o=a?jl[a]:void 0,c=tn(t.translation_domain??t.error?.translation_domain,t.translation_key??t.error?.translation_key,t.translation_placeholders??t.error?.translation_placeholders);if(c)return c;if(!i&&!o)return e;let h=Ll(i),_=h.field?Ml(h.field,s):"",m=f=>n(f,s).replace("{field}",_).replace("{n}",h.param??"");switch(h.rule){case"too_long":return m("err_too_long");case"too_short":return m("err_too_short");case"value_too_high":return m("err_value_too_high");case"value_too_low":return m("err_value_too_low");case"required":return m("err_required");case"wrong_type":return m("err_wrong_type").replace("{type}",h.param??"");case"invalid_choice":return m("err_invalid_choice");case"invalid_value":return m("err_invalid_value");default:if(o){let f=n(o,s);return xe(s)==="en"&&i&&!Hl(i,a)?`${f} (${i})`:f}return i||e}}var jl,Nl,ea,ia=y(()=>{"use strict";I();ur();Rt();jl={already_archived:"ws_err_already_archived",already_paused:"ws_err_already_paused",archived:"ws_err_archived",changed_since:"undo_changed",create_failed:"ws_err_create_failed",duplicate_failed:"ws_err_duplicate_failed",empty:"ws_err_empty",empty_csv:"ws_err_empty_csv",invalid_cursor:"ws_err_invalid_cursor",invalid_date:"ws_err_invalid_date",invalid_device:"ws_err_invalid_device",invalid_entity_slug:"ws_err_invalid_entity_slug",invalid_format:"ws_err_invalid_format",invalid_input:"ws_err_invalid_input",invalid_mirror_todo:"ws_err_invalid_mirror_todo",invalid_notify_service:"ws_err_invalid_notify_service",invalid_parent:"ws_err_invalid_parent",invalid_icon:"ws_err_invalid_icon",invalid_range:"ws_err_invalid_range",invalid_search_template:"ws_err_invalid_search_template",invalid_shopping_list_entity:"ws_err_invalid_shopping_list_entity",invalid_target:"ws_err_invalid_target",invalid_trigger_config:"ws_err_invalid_trigger_config",invalid_url:"ws_err_invalid_url",invalid_user:"ws_err_invalid_user",invalid_view:"ws_err_invalid_view",limit_reached:"ws_err_limit_reached",no_defaults:"ws_err_no_defaults",no_phases:"ws_err_no_phases",no_url:"ws_err_no_url",not_archived:"ws_err_not_archived",not_available:"ws_err_not_available",not_configured:"ws_err_not_configured",not_found:"ws_err_not_found",notify_service_not_found:"ws_err_notify_service_not_found",not_loaded:"ws_err_not_loaded",not_paused:"ws_err_not_paused",nothing_to_undo:"undo_nothing",replace_failed:"ws_err_replace_failed",self_link_device:"ws_err_self_link_device",too_early:"ws_err_too_early",too_large:"ws_err_too_large",too_many:"ws_err_too_many",too_many_views:"ws_err_too_many_views",unauthorized:"ws_err_unauthorized",unavailable:"ws_err_unavailable"},Nl={entry_id:"object",name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_equals:"trigger_equals",trigger_not_equals:"trigger_not_equals",trigger_for_minutes:"trigger_for_minutes"};ea=r=>r.toLowerCase().split(/[^a-z0-9]+/).filter(s=>s.length>1)});async function H(r,s,e={}){e.busy?.(!0);try{let t=typeof s=="function"?await s():await r.hass.connection.sendMessagePromise(s);return e.reload&&await e.reload(),e.successToast&&e.onSuccess?.(e.successToast),t===void 0?null:t}catch(t){let i=e.lang||N(r.hass),a=await ql(r,t,i)??ta(t,i,e.fallbackKey?n(e.fallbackKey,i):void 0);e.onError?.(a,t);return}finally{e.busy?.(!1)}}async function ql(r,s,e){let t=typeof s=="object"&&s!==null?s:{};if(!Dl.has(t.code||t.error?.code||""))return null;try{let i=Js(await r.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}));return i?n("restart_pending_error",e).replace("{version}",i):null}catch{return null}}var Dl,me=y(()=>{"use strict";ia();I();ar();Dl=new Set(["unknown_error","invalid_format","unknown_command"])});var Hr,zt,Dr=y(()=>{"use strict";Hr=["notes","cost","duration","photo","user"],zt={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"}});function Ft(r){if(!r)return[];let s=[],e=r.photo_doc_id;typeof e=="string"&&s.push(e);let t=r.photo_doc_ids;Array.isArray(t)&&s.push(...t);let i=[];for(let a of s){if(typeof a!="string")continue;let o=a.trim();if(!(!o||i.includes(o))&&(i.push(o),i.length>=10))break}return i}var Ut=y(()=>{"use strict"});async function zl(r,s,e){let t=r.auth;if(t?.expired&&t.refreshAccessToken)try{await t.refreshAccessToken()}catch{}return fetch(s,{...e,headers:{...e.headers??{},Authorization:`Bearer ${t?.data?.access_token??""}`}})}async function Ul(r,s,e,t="doc_too_large",i=[]){let a=await zl(r,s,{method:"POST",body:e});if(a.status===413)throw new Error(t);if(!a.ok){let o=await a.json().catch(()=>null);throw typeof o?.code=="string"&&i.includes(o.code)?new Error(o.code):new Error("doc_upload_failed")}return await a.json()}async function Bl(r,s,e,t,i){if(e.size>Fl)throw new Error("doc_too_large");let a=new FormData;a.append("entry_id",s);for(let c of t)a.append("tags",c);i&&a.append("purpose",i),a.append("file",e,e.name);let o=await Ul(r,"/api/maintenance_supporter/document/upload",a);if(!o.id)throw new Error("doc_upload_failed");return{id:o.id,deduped:!!o.deduped,duplicate_in_object:o.duplicate_in_object??null}}async function sa(r,s,e){return(await Bl(r,s,e,["photo"],"completion")).id}async function qr(r,s,e){await Promise.all(e.map(t=>r.connection.sendMessagePromise({type:"maintenance_supporter/documents/discard_upload",entry_id:s,doc_id:t}).catch(()=>{})))}var Fl,Au,na=y(()=>{"use strict";Ut();Fl=100*1024*1024,Au=500*1024*1024});var lt,zr=y(()=>{"use strict";I();na();lt=class{constructor(s,e){this.host=s;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,s.addController(this)}hostConnected(){}get ids(){return this.photos.map(s=>s.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(s){return this.errorKey?n(this.errorKey,s).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(s=[]){this._endSession(),this._revokeAll(),this.photos=s.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(s){if(s.length===0)return;let e=this._session,t=this.opts.hass(),i=this.opts.entryId(),a=s.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let o of a){let c=await sa(t,i,o);if(e!==this._session){qr(t,i,[c]);return}this.uploadedIds=[...this.uploadedIds,c],this._uploadEntry.set(c,i),this.photos=[...this.photos,{id:c,preview:URL.createObjectURL(o)}],this.host.requestUpdate()}s.length>a.length&&(this.errorKey="photos_limit")}catch(o){if(e!==this._session)return;this.errorKey=o instanceof Error&&o.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(s){let e=this.photos.find(t=>t.id===s);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(t=>t.id!==s),this.uploadedIds.includes(s)&&(this.uploadedIds=this.uploadedIds.filter(t=>t!==s),this._discard([s])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let s=this.uploadedIds;this.uploadedIds=[],this._discard(s)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(s){let e=new Map;for(let i of s){let a=this._uploadEntry.get(i)??this.opts.entryId();this._uploadEntry.delete(i),e.set(a,[...e.get(a)??[],i])}let t=this.opts.hass();for(let[i,a]of e)qr(t,i,a)}_revokeAll(){for(let s of this.photos)s.preview&&URL.revokeObjectURL(s.preview)}}});function ct(r){let s=(r??"").trim();if(s==="")return null;let e=Number(s.replace(",","."));return!Number.isFinite(e)||e<0?null:Math.round(e)}var Ci=y(()=>{"use strict"});function Wl(r){let e=M("2001-02-03",r).match(/\d+/g)||[],t=c=>e.findIndex(h=>Number(h)===c),i=t(2001),a=t(2),o=t(3);return i===0?"YMD":a>=0&&o>=0&&a<o?"MDY":"DMY"}function dt(r,s,e){if(r<1e3||r>9999||s<1||s>12||e<1||e>31)return null;let t=new Date(r,s-1,e);return t.getFullYear()!==r||t.getMonth()!==s-1||t.getDate()!==e?null:`${r}-${String(s).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function aa(r,s){let e=r.trim(),t;if(t=e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))return dt(+t[1],+t[2],+t[3]);if(t=e.match(/^(\d{4})$/))return dt(+t[1],1,1);if(t=e.match(/^(\d{1,2})[./](\d{4})$/))return dt(+t[2],+t[1],1);if(t=e.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))return dt(+t[3],+t[2],+t[1]);if(t=e.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)){let i=+t[1],a=+t[2],o=+t[3];return Wl(s)==="MDY"?dt(o,i,a):dt(o,a,i)}return null}var oa=y(()=>{"use strict";I()});function Vl(r,s){if(s)switch(r){case"date":return s.split("T")[0];case"time":return s.length===5?`${s}:00`:s;case"datetime":{let[e,t="00:00:00"]=s.split("T");return`${e} ${t.length===5?`${t}:00`:t}`}}}function Gl(r,s){if(typeof s!="string"||!s)return"";switch(r){case"date":return s.slice(0,10);case"time":return s.slice(0,5);case"datetime":{let[e,t="00:00:00"]=s.split(" ");return`${e}T${t.length===5?`${t}:00`:t}`}}}var F,pt=y(()=>{"use strict";P();D();I();oa();F=class extends S{constructor(){super(...arguments);this.kind="date";this.label="";this.value="";this.clearable=!1;this.disabled=!1;this.required=!1;this.lang="en";this._typing=!1;this._typed="";this._typedInvalid=!1}_startTyping(){this._typed=this.value,this._typedInvalid=!1,this._typing=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input.typed")?.focus())}_commitTyped(){if(!this._typed.trim()){this._typing=!1;return}let e=aa(this._typed,this.lang);if(!e){this._typedInvalid=!0;return}this._typing=!1,this._typedInvalid=!1,this._emit(e)}_onTypedKey(e){e.key==="Enter"?(e.preventDefault(),this._commitTyped()):e.key==="Escape"&&(e.preventDefault(),this._typing=!1,this._typedInvalid=!1)}_selector(){switch(this.kind){case"date":return{date:{}};case"time":return{time:{no_second:!0}};case"datetime":return{datetime:{}}}}_onSelectorChange(e){e.stopPropagation(),this._emit(Gl(this.kind,e.detail?.value))}_clear(){this._emit("")}_emit(e){e!==this.value&&(this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}})))}render(){return l`
      <div class="field">
        ${this.label?l`<span class="label">${this.label}${this.required?l`<span class="req">*</span>`:p}</span>`:p}
        <div class="row">
          ${this._typing?l`<input class="typed" type="text" inputmode="numeric" autocomplete="off"
                .value=${this._typed}
                placeholder=${M("1978-03-15",this.lang)}
                aria-invalid=${this._typedInvalid?"true":"false"}
                @input=${e=>{this._typed=e.target.value,this._typedInvalid=!1}}
                @keydown=${this._onTypedKey}
                @blur=${this._commitTyped} />`:l`<ha-selector
                .hass=${this.hass}
                .selector=${this._selector()}
                .value=${Vl(this.kind,this.value)}
                .required=${this.required}
                .disabled=${this.disabled}
                @value-changed=${this._onSelectorChange}
              ></ha-selector>`}
          ${this.kind==="date"&&!this.disabled&&!this._typing?l`<button type="button" class="type-toggle" title=${n("date_type_toggle",this.lang)} aria-label=${n("date_type_toggle",this.lang)} @click=${this._startTyping}>
                <ha-icon icon="mdi:keyboard-outline"></ha-icon>
              </button>`:p}
          ${this.clearable&&this.value&&!this.disabled&&!this._typing?l`<button type="button" class="clear" title=${n("clear",this.lang)} aria-label=${n("clear",this.lang)} @click=${this._clear}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>`:p}
        </div>
        ${this._typedInvalid?l`<span class="helper invalid">${n("date_type_invalid",this.lang)}</span>`:this.helper?l`<span class="helper">${this.helper}</span>`:p}
      </div>
    `}};F.styles=$`
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
  `,d([b({attribute:!1})],F.prototype,"hass",2),d([b()],F.prototype,"kind",2),d([b()],F.prototype,"label",2),d([b()],F.prototype,"value",2),d([b()],F.prototype,"helper",2),d([b({type:Boolean})],F.prototype,"clearable",2),d([b({type:Boolean})],F.prototype,"disabled",2),d([b({type:Boolean})],F.prototype,"required",2),d([b()],F.prototype,"lang",2),d([u()],F.prototype,"_typing",2),d([u()],F.prototype,"_typed",2),d([u()],F.prototype,"_typedInvalid",2);customElements.get("ms-date-field")||customElements.define("ms-date-field",F)});var Ce,Ri=y(()=>{"use strict";P();D();I();Ce=class extends S{constructor(){super(...arguments);this.value="";this.lang="en";this._credit=!1;this._amount=""}willUpdate(e){if(!e.has("value"))return;let t=(this.value??"").trim();if(t===this._signed())return;let i=parseFloat(t);if(t===""||Number.isNaN(i)){this._amount="",this._credit=!1;return}this._credit=i<0,this._amount=String(Math.abs(i))}_signed(){let e=this._amount.trim();return e===""?"":this._credit?`-${e}`:e}_emit(){this.value=this._signed(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setCredit(e){this._credit!==e&&(this._credit=e,this._emit())}_onInput(e){let t=e.target.value;t.startsWith("-")&&(this._credit=!0),this._amount=t.replace(/^-+/,""),this._emit()}render(){let e=this.lang;return l`
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
      ${this._credit?l`<div class="hint">${n("cost_credit_hint",e)}</div>`:p}
    `}};Ce.styles=[Ee,$`
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
    `],d([b()],Ce.prototype,"value",2),d([b()],Ce.prototype,"lang",2),d([u()],Ce.prototype,"_credit",2),d([u()],Ce.prototype,"_amount",2);customElements.get("ms-cost-input")||customElements.define("ms-cost-input",Ce)});function Ii(){if(window.externalApp!==void 0)return!0;let s=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(s)&&/Android/.test(s)}var Fr=y(()=>{"use strict"});function Bt(r){try{return localStorage.getItem(r)}catch{return null}}function Wt(r,s){try{localStorage.setItem(r,s)}catch{}}var Re,Ur=y(()=>{"use strict";Re={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraLabel:"msp-camera-label",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort",areaSort:"msp-area-sort",objectTreeOpen:"msp-object-tree-open"}});function ha(){if(!Ii())return!1;let r=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!r&&typeof r.getUserMedia=="function"}function da(r){let s=/camera2?\s*(\d+)/i.exec(r);return s?Number(s[1]):Number.MAX_SAFE_INTEGER}function pa(r,s){if(s){let t=r.find(i=>i.label===s);if(t)return t}return r.filter(t=>t.label&&_a.test(t.label)).sort((t,i)=>da(t.label)-da(i.label))[0]??null}var Kl,Yl,Ql,Zl,la,_a,ca,ua,Jl,Q,Br=y(()=>{"use strict";P();D();I();Fr();Ur();Kl=1920,Yl=.88,Ql={retryMs:500,windowMs:5e3},Zl=new Set(["NotReadableError","AbortError","TrackStartError"]),la=80,_a=/back|rear|environment|rück|hinten/i,ca=/front|user|selfie|vorne/i;ua=r=>r?.name||"Error",Jl=r=>r?.message||"",Q=class extends S{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...Ql};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let i=Bt(Re.cameraLabel),a=await this._enumerate(t);if(!this._live(e))return;let o=pa(a,i),c="refused";if(o&&(c=await this._openPatiently(t,e,this._byDevice(o))),c==="cancelled")return;if(c!=="ok"){if(c=await this._openPatiently(t,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),c==="cancelled")return;if(c!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(a=await this._enumerate(t),!this._live(e)){this._stopStream();return}}if(this._devices=a,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let h=o?null:pa(a,i),_=this._deviceIndex>=0?a[this._deviceIndex]:void 0;if(!h||h.deviceId===_?.deviceId)return;let m=await this._replace(t,e,[this._byDevice(h)],this._restoreCandidates(_));if(m!=="cancelled"){if(m==="lost"){this._unavailable("camera_lost");return}this._settle(m)}}async _openPatiently(e,t,i){let a=Date.now();for(;;){let o;try{o=await e.getUserMedia({video:i.video,audio:!1})}catch(c){let h=ua(c),_=Jl(c);if(this._lastError=h,this._note(`${i.what} \u2192 ${h}${_&&_!==h?`: ${_}`:""}`),!this._live(t))return"cancelled";if(!Zl.has(h))return"refused";if(Date.now()-a+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(m=>setTimeout(m,this.timing.retryMs)),!this._live(t))return"cancelled";continue}if(!this._live(t)){for(let c of o.getTracks())c.stop();return"cancelled"}return this._stream=o,this._note(`${i.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,t,i,a){this._switching=!0,this._stopStream();try{for(let o of i){let c=await this._openPatiently(e,t,o);if(c==="ok")return o;if(c==="cancelled")return c;if(c==="busy"){o.deviceId&&this._refused.add(o.deviceId);break}}for(let o of a){let c=await this._openPatiently(e,t,o);if(c==="ok")return"restored";if(c==="cancelled")return c}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let i=this._indexOfCurrent();return i>=0&&(this._deviceIndex=i),this._attach(),!1}this._switchFailed=!1;let t=e.deviceId?this._devices.findIndex(i=>i.deviceId===e.deviceId):-1;return this._deviceIndex=t>=0?t:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,t){let i=[],a=e?.deviceId||t;return a&&i.push({video:{deviceId:{exact:a}},what:`${e?.label||"previous camera"} (back again)`,deviceId:a}),i.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),i}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let t=(await e.enumerateDevices()).filter(i=>i.kind==="videoinput"&&!!i.deviceId);return this._note(`cameras: ${t.map(i=>i.label||"(no label)").join(" | ")||"none listed"}`),t}catch(t){return this._note(`enumerateDevices \u2192 ${ua(t)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let t=e.getSettings().deviceId,i=t?this._devices.findIndex(a=>a.deviceId===t):-1;return i>=0?i:e.label?this._devices.findIndex(a=>a.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],t=e?.getSettings().facingMode;if(t==="user"||t==="environment")return t;let i=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return ca.test(i)?"user":_a.test(i)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let t=e.getSettings(),i=t.width&&t.height?`${t.width}\xD7${t.height}`:"size ?";return[e.label||"no label",i,t.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>la&&this._log.splice(1,this._log.length-la)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let t=this._gen,i=this._deviceIndex,a=i>=0?this._devices[i]:void 0,o=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||a?.deviceId,c=this._facing==="user"?"environment":"user",h=this._nextCameras(i,o);!h.length&&this._refused.size&&(this._refused.clear(),h=this._nextCameras(i,o)),this._note(`switch from ${a?.label||"unknown camera"}`);let _=[...h.map(m=>this._byDevice(this._devices[m])),{video:{facingMode:{exact:c}},what:`facing ${c} (exact)`},{video:{facingMode:{ideal:c}},what:`facing ${c}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let m=await this._replace(e,t,_,this._restoreCandidates(a,o));if(m==="cancelled")return;if(m==="lost"){this._unavailable("camera_lost");return}if(m!=="restored"&&!m.deviceId){if(this._isCamera(o,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=c}if(this._settle(m)&&m!=="restored"&&m.deviceId){let f=this._devices[this._deviceIndex]?.label??"";f&&Wt(Re.cameraLabel,ca.test(f)?"":f)}}finally{this._busy=!1}}_nextCameras(e,t){let i=this._devices.length,a=[];for(let o=1;o<=(e<0?i:i-1);o++){let c=(e+o)%i,h=this._devices[c].deviceId;h===t||this._refused.has(h)||a.push(c)}return a}_isCamera(e,t){let i=this._stream?.getVideoTracks()[0]?.getSettings();return e&&i?.deviceId?i.deviceId===e:!!i?.facingMode&&i.facingMode===t}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let t of this._stream?.getTracks()??[])t.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),t=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),t=!0)}catch{}if(!t){let i=this.shadowRoot?.querySelector(".details textarea");if(i){i.focus(),i.select();try{t=document.execCommand("copy")}catch{t=!1}}}this._copied=t}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let t=e.videoWidth||640,i=e.videoHeight||480,a=Math.min(1,Kl/Math.max(t,i)),o=document.createElement("canvas");o.width=Math.round(t*a),o.height=Math.round(i*a);let c=o.getContext("2d");if(!c)throw new Error("no_canvas");c.drawImage(e,0,0,o.width,o.height);let h=await new Promise(f=>o.toBlob(f,"image/jpeg",Yl));if(!h)throw new Error("no_blob");let _=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),m=new File([h],`photo-${_}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:m},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return p;let e=this.lang,t=this._busy||this._switching;return l`
      <div class="overlay" role="dialog" aria-modal="true" aria-label=${n("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switching?l`<div class="switching" role="status">${n("camera_switching",e)}</div>`:p}
        ${this._switchFailed?l`<div class="switch-note" role="status">
              <div>${n("camera_not_answered",e)}</div>
              <details class="details">
                <summary>${n("camera_diagnostics",e)}</summary>
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${n(this._copied?"camera_copied":"camera_copy",e)}</button>
              </details>
            </div>`:p}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${n("cancel",e)}</button>
          ${this._devices.length>1?l`<button type="button" class="switch" ?disabled=${t} title=${n("camera_switch_lens",e)} aria-label=${n("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:p}
          <button type="button" class="shoot" ?disabled=${t} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${n("camera_capture_shoot",e)}</span>
          </button>
        </div>
      </div>
    `}};Q.styles=$`
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
  `,d([b({type:String})],Q.prototype,"lang",2),d([u()],Q.prototype,"_open",2),d([u()],Q.prototype,"_busy",2),d([u()],Q.prototype,"_switching",2),d([u()],Q.prototype,"_devices",2),d([u()],Q.prototype,"_deviceIndex",2),d([u()],Q.prototype,"_switchFailed",2),d([u()],Q.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",Q)});var Pi,Z,Vt=y(()=>{"use strict";P();D();I();Fr();Br();Br();Pi=$`
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
`,Z=class extends S{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=Ii();this._inAppCamera=ha()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target,i=Array.from(t.files??[]);t.value="",this._emit(i)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return p;let e=this.lang,t=this._locked?"disabled":"",i=this.busy?n("uploading",e):n("doc_camera",e),a=n(this._singlePick?"choose_photo":"choose_photos",e);return l`
      <div class="photo-pickers">
        ${this.showCamera?l`<label class="photo-pick photo-pick-camera ${t}" role="button" tabindex="0"
              aria-label=${i} title=${this.compact?i:p}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?p:l`<span>${i}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
        ${this.showGallery?l`<label class="photo-pick photo-pick-gallery ${t}" role="button" tabindex="0"
              aria-label=${a} title=${this.compact?a:p}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?p:l`<span>${a}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
      </div>
      ${this.showGallery&&this._singlePick?l`<div class="photo-android-hint">${n("photos_android_hint",e)}</div>`:p}
      ${this.showCamera&&this._inAppCamera?l`<ms-camera-capture .lang=${e}
            @photo-captured=${o=>this._emit([o.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:p}
    `}};d([b({type:String})],Z.prototype,"lang",2),d([b({type:Boolean})],Z.prototype,"disabled",2),d([b({type:Boolean})],Z.prototype,"busy",2),d([b({type:String})],Z.prototype,"accept",2),d([b({type:Boolean})],Z.prototype,"showCamera",2),d([b({type:Boolean})],Z.prototype,"showGallery",2),d([b({type:Boolean})],Z.prototype,"compact",2),d([b({type:Number})],Z.prototype,"remaining",2),d([u()],Z.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",Z)});var ut,T,Wr=y(()=>{"use strict";P();D();ze();I();me();W();Ht();wi();Nt();Dr();zr();Ci();pt();Ri();Vt();Vt();ut=Ae,T=class extends S{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new lt(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((t,i)=>[String(i),!!this.checklistPrefill[t]]).filter(([,t])=>t)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(t=>[ne(t),{...t}])),this._usedQtyText={})}_rangeError(e,t){let i=this.lang;return n("settings_value_out_of_range",i).replace("{min}",j(e,i,{maximumFractionDigits:2})).replace("{max}",j(t,i,{maximumFractionDigits:2}))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId},t=this._notes.trim();if(t&&(e.notes=t),this._cost){let c=parseFloat(this._cost);isNaN(c)||(e.cost=c)}let i=ct(this._duration);if(i!==null&&(e.duration=i),this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(U(this._completedAt)>Date.now()){this._error=n("completed_at_future_error",this.lang);return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let c={};for(let h of this.readings){let _=(this._readingValues[h.id]??"").trim();if(_==="")continue;let m=parseFloat(_.replace(",","."));isNaN(m)||(c[h.id]=m)}Object.keys(c).length>0&&(e.reading_values=c)}else if(this._readingValue!==""){let c=parseFloat(this._readingValue);isNaN(c)||(e.reading_value=c)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let c=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(c)||c<st[0]||c>st[1]){this._error=this._rangeError(...st);return}e.restock_quantity=c}if(this.parts.length>0){let c=[];for(let[h,_]of Object.entries(this._usedParts)){let m=this._usedQtyText[h],f=m===void 0?_.quantity:parseFloat(m.replace(",","."));if(!Number.isFinite(f)||f<ut[0]||f>ut[1]){this._error=this._rangeError(...ut);return}c.push({..._,quantity:f})}e.used_parts=c.map(h=>h.entry_id?{part_id:h.part_id,quantity:h.quantity,entry_id:h.entry_id}:{part_id:h.part_id,quantity:h.quantity})}let a=await H(this,e,{busy:c=>{this._loading=c},lang:this.lang,fallbackKey:"save_error",onError:c=>{this._error=c}});if(a===void 0)return;this._photos.markAttached(),this._open=!1;let o={entryId:this.entryId,taskId:this.taskId,taskName:this.taskName,undo:a?.undo===!0};this.dispatchEvent(new CustomEvent("task-completed",{detail:o}))}_renderReadingField(e,t){let i=this._completedAt?U(this._completedAt):NaN,a=On(this.readingHistory,e.id,isNaN(i)?void 0:i),o=e.unit||this.readingUnit,c=(this._readingValues[e.id]??"").trim(),h=c===""?NaN:parseFloat(c.replace(",",".")),_=a!==void 0&&!isNaN(h)&&h<a.value,m=a!==void 0?j(a.value,t,{maximumFractionDigits:3}):"";return l`
      <label class="field reading-field">
        <span class="field-label">${e.name}${o?` (${o})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${a!==void 0?n("reading_last",t).replace("{value}",m):""}
          .value=${this._readingValues[e.id]??""}
          @input=${f=>{this._readingValues={...this._readingValues,[e.id]:f.target.value}}} />
        ${_?l`<span class="reading-warn">${n("reading_below_last",t).replace("{value}",m)}</span>`:p}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_demands(e){return this.requiredFields.includes(e)}_req(e){return this._demands(e)?l`<span class="req-mark" aria-hidden="true">*</span>`:p}_purchaseSuggestion(){if(this.restockDefault===null)return null;let e=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(e)||e<=0?null:Math.round(this.restockUnitCost*e*100)/100}_partsValues(){let e={booked:null,info:null};if(this.restockDefault!==null||!this.parts.length)return e;for(let t of Object.values(this._usedParts)){let i=this.parts.find(c=>ne({part_id:c.id,entry_id:c.entry_id})===ne(t)),a=Bn(i);if(a===null)continue;let o=ki(i,this.partsCostMode)==="use"?"booked":"info";e[o]=(e[o]??0)+a*(t.quantity||1)}for(let t of["booked","info"])e[t]!==null&&(e[t]=Math.round(e[t]*100)/100);return e}_renderCostSuggestion(e){let t=this._purchaseSuggestion();if(this.restockDefault!==null){let c=this.partsCostMode==="use"?l`<div class="cost-note">${n("cost_purchase_use_hint",e)}</div>`:p;if(this._cost.trim()!==""||t==null||t<=0)return c;let h=ie(t,this.currencySymbol,e);return l`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(Math.round(t*100)/100)}
        >${n("cost_from_parts",e).replace("{amount}",h)}</button>${c}`}let{booked:i,info:a}=this._partsValues(),o=(c,h)=>c!=null&&c>0?l`<div class="cost-note">${n(h,e).replace("{amount}",ie(c,this.currencySymbol,e))}</div>`:p;return l`${o(i,"cost_parts_booked")}${o(a,"cost_parts_info")}`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=`${ln()}:00`}render(){if(!this._open)return l``;let e=this.lang||N(this.hass),t=this._error||this._photos.errorText(e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${n("complete_title",e)}${this.taskName}</div>
        ${this.phaseLabel?l`<div class="phase-line">${n("phase_current",e)}: ${this.phaseLabel}</div>`:p}
        ${this.requireTagScan&&!this.viaTagScan?l`<div class="scan-required-note">${n("require_tag_scan_hint",e)}</div>`:p}
        <div class="content">
          ${t?l`<div class="error">${t}</div>`:p}
          ${this.checklist.length>0?l`
            <div class="checklist-section">
              <label class="checklist-label">${n("checklist",e)}</label>
              ${this.checklist.map((i,a)=>l`
                <label class="checklist-item">
                  <input type="checkbox" .checked=${!!this._checklistState[String(a)]}
                    @change=${()=>this._toggleCheck(a)} />
                  <span>${i}</span>
                </label>
              `)}
            </div>
          `:p}
          ${this.readings.length>0?l`<div class="readings-block">
                <span class="field-label">${n("readings_section",e)}</span>
                ${this.readings.map(i=>this._renderReadingField(i,e))}
              </div>`:this.taskType==="reading"?l`
              <label class="field">
                <span class="field-label">${n("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${i=>this._readingValue=i.target.value} />
              </label>`:p}
          ${this.parts.length?l`<div class="used-parts">
                <span class="field-label">${n("complete_parts_used",e)}</span>
                ${this.parts.map(i=>{let a=ne({part_id:i.id,entry_id:i.entry_id}),o=this._usedParts[a],c=o!==void 0,h=i.entry_id?{part_id:i.id,quantity:1,entry_id:i.entry_id}:{part_id:i.id,quantity:1};return l`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${c}
                        @change=${_=>{let m={...this._usedParts};if(_.target.checked)m[a]=m[a]||h;else{delete m[a];let f={...this._usedQtyText};delete f[a],this._usedQtyText=f}this._usedParts=m}} />
                      <span
                        >${i.name}${i.owner_name?l`<span class="used-part-owner"> (${i.owner_name})</span>`:p}${i.stock!==null&&i.stock!==void 0?` (${Xe(i.stock,i.unit,e)})`:""}</span
                      >
                    </label>
                    ${c?l`<input class="used-part-qty" type="number" min=${ut[0]} max=${ut[1]} step="0.01"
                          .value=${this._usedQtyText[a]??String(o.quantity)}
                          @input=${_=>{let m=_.target.value;this._usedQtyText={...this._usedQtyText,[a]:m};let f=parseFloat(m.replace(",","."));Number.isFinite(f)&&f>=ut[0]&&(this._usedParts={...this._usedParts,[a]:{...h,quantity:f}})}} />`:p}
                  </div>`})}
              </div>`:this.consumesInfo.length?l`<div class="consumes-hint">
                  ${this.consumesInfo.map(i=>l`<div>${i}</div>`)}
                </div>`:p}
          ${this.restockDefault!==null?l`
              <label class="field">
                <span class="field-label">${n("restock_quantity_label",e)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
                <input type="number" step="0.01" min=${st[0]} max=${st[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${i=>this._restockQty=i.target.value} />
              </label>`:p}
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
              @input=${i=>this._notes=i.target.value}></textarea>
          </label>
          <div class="field">
            <span class="field-label">${this._demands("cost")?n("cost",e):n("cost_optional",e)}${this._req("cost")}</span>
            <ms-cost-input .lang=${e} .value=${this._cost}
              @value-changed=${i=>this._cost=i.detail.value}></ms-cost-input>
            ${this._renderCostSuggestion(e)}
          </div>
          <label class="field">
            <span class="field-label">${this._demands("duration")?n("quick_complete_defaults_duration",e):n("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="1" min="0" inputmode="numeric" class="field-input"
              .value=${this._duration}
              @input=${i=>this._duration=i.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${n("completed_at_optional",e)}</span>
            ${this._completedAt?l`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  .helper=${_i(e)}
                  @value-changed=${i=>this._completedAt=i.detail.value}
                ></ms-date-field>`:l`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${n("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${this._demands("photo")?n("completion_photos",e):n("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?l`<div class="photo-strip">
                  ${this._photos.photos.map(i=>l`
                    <div class="photo-preview">
                      <img src=${i.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(i.id)}
                        title="${n("remove",e)}">✕</button>
                    </div>`)}
                </div>`:p}
            ${this._photos.full?l`<div class="photo-limit">${n("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:l`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${i=>this._photos.addFiles(i.detail.files)}
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
          `:p}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${n("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?n("uploading",e):this._missingRequired.length?this._missingRequired.map(i=>n("err_required",e).replace("{field}",n(zt[i]??i,e))).join(" \xB7 "):""}
          >
            ${this._loading?n("completing",e):n("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};T.styles=[Ee,Pi,$`
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
  `],d([b({attribute:!1})],T.prototype,"hass",2),d([b()],T.prototype,"entryId",2),d([b()],T.prototype,"taskId",2),d([b()],T.prototype,"taskName",2),d([b()],T.prototype,"lang",2),d([b({type:Array})],T.prototype,"checklist",2),d([b({type:Boolean})],T.prototype,"adaptiveEnabled",2),d([b()],T.prototype,"taskType",2),d([b()],T.prototype,"readingUnit",2),d([b({attribute:!1})],T.prototype,"readings",2),d([b({attribute:!1})],T.prototype,"readingHistory",2),d([b({attribute:!1})],T.prototype,"restockDefault",2),d([b({attribute:!1})],T.prototype,"restockUnitCost",2),d([b({attribute:!1})],T.prototype,"restockPackage",2),d([b()],T.prototype,"currencySymbol",2),d([b({attribute:!1})],T.prototype,"partsCostMode",2),d([b({attribute:!1})],T.prototype,"parts",2),d([b({attribute:!1})],T.prototype,"consumesParts",2),d([b({type:Array})],T.prototype,"consumesInfo",2),d([b({type:Array})],T.prototype,"requiredFields",2),d([b()],T.prototype,"phaseLabel",2),d([b({type:Boolean})],T.prototype,"requireTagScan",2),d([b({type:Boolean})],T.prototype,"viaTagScan",2),d([u()],T.prototype,"_open",2),d([u()],T.prototype,"_notes",2),d([u()],T.prototype,"_cost",2),d([u()],T.prototype,"_duration",2),d([u()],T.prototype,"_loading",2),d([u()],T.prototype,"_error",2),d([u()],T.prototype,"_checklistState",2),d([u()],T.prototype,"_feedback",2),d([u()],T.prototype,"_readingValue",2),d([u()],T.prototype,"_readingValues",2),d([u()],T.prototype,"_restockQty",2),d([u()],T.prototype,"_completedAt",2),d([u()],T.prototype,"_usedParts",2),d([u()],T.prototype,"_usedQtyText",2),d([b({attribute:!1})],T.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",T)});async function ec(r,s,e,t){let i="",a=await H({hass:r},{type:"maintenance_supporter/task/undo",entry_id:s,task_id:e},{lang:t,onError:(o,c)=>{let h=Xl[c?.code??""];i=h?n(h,t):o}});return a===void 0?{ok:!1,message:i}:{ok:!0,message:n(a?.action_ran?"undo_done_action_ran":"undo_done",t)}}function ji(r,s,e,t,i){let a=(o,c)=>r.dispatchEvent(new CustomEvent("hass-notification",{detail:c?{message:o,action:c,duration:1e4}:{message:o},bubbles:!0,composed:!0}));a(n("task_completed_named",t).replace("{task}",e.taskName),{text:n("undo",t),action:()=>{ec(s,e.entryId,e.taskId,t).then(o=>{a(o.message),o.ok&&i()})}})}var Xl,Vr=y(()=>{"use strict";I();me();Xl={changed_since:"undo_changed",nothing_to_undo:"undo_nothing"}});function ga(r){return r.object.parent_entry_id||null}function fa(r,s){let e=new Map(r.map(o=>[o.entry_id,o])),t=[],i=new Set([s]),a=e.get(s);for(;a;){let o=ga(a);if(!o||i.has(o))break;let c=e.get(o);if(!c)break;i.add(o),t.unshift(c),a=c}return t}function va(r,s){let e=new Map;for(let a of r){let o=ga(a);o&&(e.has(o)||e.set(o,[]),e.get(o).push(a.entry_id))}let t=new Set,i=[...e.get(s)??[]];for(;i.length;){let a=i.pop();a===s||t.has(a)||(t.add(a),i.push(...e.get(a)??[]))}return t}var ba=y(()=>{"use strict"});var z,Ni=y(()=>{"use strict";P();D();z=class extends S{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){return l`
      <label class="field">
        ${this.label?l`<span class="label">${this.label}${this.required?l`<span class="req">*</span>`:p}</span>`:p}
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
          step=${this.step??p}
          min=${this.min??p}
          max=${this.max??p}
          pattern=${this.pattern??p}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?l`<span class="helper">${this.helper}</span>`:p}
      </label>
    `}};z.styles=$`
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
  `,d([b()],z.prototype,"label",2),d([b()],z.prototype,"value",2),d([b()],z.prototype,"placeholder",2),d([b()],z.prototype,"type",2),d([b({type:Boolean})],z.prototype,"required",2),d([b({type:Boolean})],z.prototype,"disabled",2),d([b()],z.prototype,"step",2),d([b()],z.prototype,"min",2),d([b()],z.prototype,"max",2),d([b()],z.prototype,"pattern",2),d([b()],z.prototype,"helper",2),d([b({type:Boolean})],z.prototype,"multiline",2),d([b({type:Number})],z.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",z)});var O,ya=y(()=>{"use strict";P();D();I();me();ba();Ni();pt();O=class extends S{constructor(){super(...arguments);this.objects=[];this.placesEnabled=!1;this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._place="";this._remindOnSite=!1;this._entryId=null;this._replacing=!1;this._oldDeviceId="";this._replaceDevice="keep"}get _lang(){return N(this.hass)}openCreate(e=""){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId=e,this._place="",this._remindOnSite=!1,this._replacing=!1,this._error="",this._open=!0}openReplace(e,t){this._entryId=e,this._replacing=!0,this._name=t.name||"",this._oldDeviceId=t.ha_device_id||"",this._haDeviceId="",this._replaceDevice="keep",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._haDeviceId=t.ha_device_id||"",this._parentEntryId=t.parent_entry_id||"",this._place=t.place||"",this._remindOnSite=!!t.remind_on_site,this._replacing=!1,this._error="",this._open=!0}async _replace(){if(this._loading||!this._entryId)return;let e={type:"maintenance_supporter/object/replace",entry_id:this._entryId,name:this._name.trim()||null};this._oldDeviceId?(this._replaceDevice==="other"&&(e.ha_device_id=this._haDeviceId),this._replaceDevice==="none"&&(e.ha_device_id=null)):this._haDeviceId&&(e.ha_device_id=this._haDeviceId);let t=await H(this,e,{busy:i=>{this._loading=i},fallbackKey:"save_error",onError:i=>{this._error=i}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-replaced",{detail:{entry_id:t?.entry_id,device_swap:t?.device_swap}})))}_deviceName(e){let i=this.hass?.devices?.[e];return i?.name_by_user||i?.name||e}_deviceSelector(e){return l`<ha-form
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
    </label>`,i=this._replaceDevice==="other"&&!this._haDeviceId;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${n("replace_object",e)}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:p}
          <div class="hint">${n("replace_object_prompt",e)}</div>
          <ms-textfield
            label="${n("replace_name_label",e)}"
            .value=${this._name}
            @input=${a=>this._name=a.target.value}
          ></ms-textfield>
          ${this._oldDeviceId?l`<div class="radio-group" role="radiogroup" aria-label=${n("replace_device_heading",e)}>
                <div class="textarea-label">${n("replace_device_heading",e)}</div>
                ${t("keep",n("replace_device_keep",e).replace("{device}",this._deviceName(this._oldDeviceId)))}
                ${this._replaceDevice==="keep"?l`<div class="hint">${n("replace_device_keep_hint",e)}</div>`:p}
                ${t("other",n("replace_device_other",e))}
                ${this._replaceDevice==="other"?l`${this._deviceSelector(n("replace_device_pick",e))}
                      <div class="hint">${n("replace_device_other_hint",e)}</div>`:p}
                ${t("none",n("replace_device_none",e))}
              </div>`:this._deviceSelector(n("link_device_optional",e))}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${n("cancel",e)}
          </ha-button>
          <ha-button @click=${this._replace} .disabled=${this._loading||i}>
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
        @value-changed=${i=>{this._place=i.detail.value?.place||"",this._place||(this._remindOnSite=!1)}}
      ></ha-form>
      ${t?l`<div class="place-missing">${n("place_missing",e)}</div>`:p}
      <label class="place-on-site ${this._place?"":"disabled"}">
        <input
          type="checkbox"
          .checked=${this._remindOnSite}
          ?disabled=${!this._place}
          @change=${i=>this._remindOnSite=i.target.checked}
        />
        <span>${n("remind_on_site",e)}</span>
      </label>
      ${this._place?l`<div class="place-hint">${n("remind_on_site_hint",e)}</div>`:p}
    `}async _save(){if(this._loading||!this._name.trim())return;this._error="";let e={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null,...this.placesEnabled?{place:this._place||null,remind_on_site:!!this._place&&this._remindOnSite}:{}},t=await H(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...e}:{type:"maintenance_supporter/object/create",...e},{busy:i=>{this._loading=i},fallbackKey:"save_error",onError:i=>{this._error=i}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved",{detail:{device_swap:t?.device_swap}})))}_parentChoices(){let e=this.objects||[],t=this._entryId?va(e,this._entryId):new Set;return e.filter(i=>i.entry_id!==this._entryId&&!t.has(i.entry_id)).map(i=>({entryId:i.entry_id,label:[...fa(e,i.entry_id),i].map(a=>a.object.name).join(" \u203A ")})).sort((i,a)=>i.label.localeCompare(a.label))}_close(){this._open=!1}render(){if(!this._open)return l``;if(this._replacing)return this._renderReplace();let e=this._lang,t=this._entryId?n("edit_object",e):n("new_object",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:p}
          <ms-textfield
            label="${n("name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${i=>this._manufacturer=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("model_optional",e)}"
            .value=${this._model}
            @input=${i=>this._model=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${i=>this._serialNumber=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${n("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${i=>this._areaId=i.detail.value||""}
          ></ha-area-picker>
          ${this.placesEnabled?this._renderPlace(e):p}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${n("installation_date_optional",e)}"
            .value=${this._installationDate}
            @value-changed=${i=>this._installationDate=i.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${n("warranty_expiry_optional",e)}"
            .value=${this._warrantyExpiry}
            @value-changed=${i=>this._warrantyExpiry=i.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>n("link_device_optional",e)}
            @value-changed=${i=>this._haDeviceId=i.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?l`<label class="textarea-field">
                <span class="textarea-label">${n("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${i=>this._parentEntryId=i.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${n("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(i=>l`<option
                      value=${i.entryId}
                      ?selected=${this._parentEntryId===i.entryId}
                    >${i.label}</option>`)}
                </select>
                <span class="md-hint">${n("parent_object_hint",e)}</span>
              </label>`:p}
          <label class="textarea-field">
            <span class="textarea-label">${n("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${i=>this._notes=i.target.value}
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
    `}};O.styles=$`
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
  `,d([b({attribute:!1})],O.prototype,"hass",2),d([b({attribute:!1})],O.prototype,"objects",2),d([b({type:Boolean})],O.prototype,"placesEnabled",2),d([u()],O.prototype,"_open",2),d([u()],O.prototype,"_loading",2),d([u()],O.prototype,"_error",2),d([u()],O.prototype,"_name",2),d([u()],O.prototype,"_manufacturer",2),d([u()],O.prototype,"_model",2),d([u()],O.prototype,"_serialNumber",2),d([u()],O.prototype,"_areaId",2),d([u()],O.prototype,"_installationDate",2),d([u()],O.prototype,"_warrantyExpiry",2),d([u()],O.prototype,"_documentationUrl",2),d([u()],O.prototype,"_notes",2),d([u()],O.prototype,"_haDeviceId",2),d([u()],O.prototype,"_parentEntryId",2),d([u()],O.prototype,"_place",2),d([u()],O.prototype,"_remindOnSite",2),d([u()],O.prototype,"_entryId",2),d([u()],O.prototype,"_replacing",2),d([u()],O.prototype,"_oldDeviceId",2),d([u()],O.prototype,"_replaceDevice",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",O)});var Kr,xa,wa=y(()=>{"use strict";Kr=["sensor","binary_sensor","number","input_number","input_boolean","counter","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant","input_select","select","input_datetime","date","datetime","timer","update"],xa=["sensor"]});var tc,ic,Yr,ka=y(()=>{"use strict";tc={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},ic="mdi:wrench-clock",Yr=r=>r&&tc[r]||ic});function Sa(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0",carry:{}}}function Ca(r){return{type:r.type||"threshold",attribute:r.attribute||"",above:r.trigger_above?.toString()??"",below:r.trigger_below?.toString()??"",equals:r.trigger_equals?.toString()??"",notEquals:r.trigger_not_equals?.toString()??"",forMinutes:r.trigger_for_minutes?.toString()??"0",targetValue:r.trigger_target_value?.toString()??"",deltaMode:r.trigger_delta_mode||!1,fromState:r.trigger_from_state||"",toState:r.trigger_to_state||"",targetChanges:r.trigger_target_changes?.toString()??"",runtimeHours:r.trigger_runtime_hours?.toString()??"",onStates:(r.trigger_on_states||[]).join(", "),daysBefore:r.trigger_days_before?.toString()??"0"}}function Ra(r,s){s.attribute&&(r.attribute=s.attribute);let e=parseInt(s.forMinutes,10);if(s.type==="threshold"){let t=parseFloat(s.above);isNaN(t)||(r.trigger_above=t);let i=parseFloat(s.below);isNaN(i)||(r.trigger_below=i);let a=parseFloat(s.equals);isNaN(a)||(r.trigger_equals=a);let o=parseFloat(s.notEquals);isNaN(o)||(r.trigger_not_equals=o),isNaN(e)||(r.trigger_for_minutes=e)}else if(s.type==="counter"){let t=parseFloat(s.targetValue);isNaN(t)||(r.trigger_target_value=t),r.trigger_delta_mode=s.deltaMode}else if(s.type==="state_change"){s.fromState&&(r.trigger_from_state=s.fromState),s.toState&&(r.trigger_to_state=s.toState);let t=parseInt(s.targetChanges,10);isNaN(t)||(r.trigger_target_changes=t),isNaN(e)||(r.trigger_for_minutes=e)}else if(s.type==="runtime"){let t=parseFloat(s.runtimeHours);isNaN(t)||(r.trigger_runtime_hours=t);let i=(s.onStates||"").split(",").map(a=>a.trim()).filter(Boolean);i.length>0&&(r.trigger_on_states=i)}else if(s.type==="due_date"){let t=parseInt(s.daysBefore,10);r.trigger_days_before=isNaN(t)?0:t}}function oc(r){return{entityIds:Ai(r).join(", "),...Ca(r),carry:Object.fromEntries(Object.entries(r).filter(([e])=>!ac.has(e)&&!e.startsWith("_")))}}function lc(r){let s=r.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(s.length===0)return null;let e={...r.carry||{},entity_id:s[0],entity_ids:s,type:r.type};return Ra(e,r),e}function cc(r){return Array.from({length:7},(s,e)=>jt(e,r,"short"))}function Ta(r){return Array.from({length:12},(s,e)=>yr(e,r,"short"))}function dc(r){let s=Array.isArray(r)?r.filter(e=>e!=null&&e!=="").join(", "):r!==null&&typeof r=="object"||r==null?"":String(r);return s.length>40?`${s.slice(0,39)}\u2026`:s}var rc,sc,Oi,$a,Aa,Ea,nc,ge,Fe,ac,g,Qr,Ia=y(()=>{"use strict";P();D();I();Cr();wi();ze();wa();me();Ht();Ci();Dr();Ni();ka();Or();Lr();pt();Ri();rc=["cleaning","inspection","replacement","calibration","service","reading","custom"],sc=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],Oi=["weekdays","nth_weekday","day_of_month","calendar"],$a=["time_based","one_time",...Oi],Aa=["threshold","counter","state_change","runtime","due_date"],Ea=(r,s)=>n(r==="due_date"?"trigger_type_due_date":r,s),nc=[...Aa,"compound"],ge={alpha:"0.3",min:"7",max:"365"},Fe=Ae;ac=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);g=class g extends S{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.mirrorTodoDefault=[];this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._series=[];this._seriesIndex=0;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calMonths=[];this._hadCalMonths=!1;this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._detailsOpen=!1;this._mirrorTodoEntities=[];this._mirrorTodoMode="default";this._completeWhenEntity="";this._completeWhenState="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._holdUntilDone=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._triggerDetailAttribute="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=ge.alpha;this._adaptiveMin=ge.min;this._adaptiveMax=ge.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set;this._attrSeq=0}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return N(this.hass)}async openCreate(e,t){this._series=[],this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="";let i=(t||[]).filter(a=>!a.object.archived&&!a.object.archived_at);!e&&i.length>0?(this._objectChoices=i.map(a=>({entry_id:a.entry_id,name:a.object.name})).sort((a,o)=>a.name.localeCompare(o.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._series=[],await this._edit(e,t)}async openEditSeries(e){e.length!==0&&(this._series=e,await this._editSeriesItem(0))}async _editSeriesItem(e){let t=this._series[e];this._seriesIndex=e,await this._edit(t.entryId,t.task),await this.updateComplete,this.shadowRoot?.querySelector(".dialog-title")?.scrollIntoView({block:"start"})}_skipSeriesItem(){this._editSeriesItem(this._seriesIndex+1)}async _edit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._warning="",this._objectChoices=[],this._isFleetTask=t.battery_fleet_task===!0,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let i=t.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"&&(i.day??1)>=1?String(i.day??1):"1",this._domLastDay=i?.kind==="day_of_month"&&i.day===-1,this._domBusiness=i?.kind==="day_of_month"&&i.business===!0,this._calMonths=(i?.kind==="day_of_month"||i?.kind==="nth_weekday")&&Array.isArray(i.months)?[...i.months]:[],this._hadCalMonths=this._calMonths.length>0,this._calendarEntity=i?.kind==="calendar"&&i.entity_id||"",this._calOffset=i?.offset?String(i.offset):"0",this._seasonMonths=Array.isArray(i?.season_months)?[...i.season_months]:[];let a=i?.ends;a&&typeof a.count=="number"?(this._endsMode="count",this._endsCount=String(a.count),this._endsUntil=""):a&&typeof a.until=="string"?(this._endsMode="until",this._endsUntil=a.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._notifyIcon=t.notify_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._mirrorTodoEntities=[...t.mirror_todo_entities||[]],this._mirrorTodoMode=this._mirrorTodoEntities.length?"own":t.mirror_todo_use_default===!1?"none":"default",this._completeWhenEntity=t.complete_when?.entity_id||"",this._completeWhenState=t.complete_when?.to_state||"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._notifyEnabled=t.notify_enabled!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(_=>({..._})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(_=>[ne(_),{..._}])),this._consumesQtyText={},this._responsibleUserId=t.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([_,m])=>{let{name:f,checklist:w,consumes_parts:x,required_completion_fields:R,...k}=m,E=m.consumes_parts||[],v=E.findIndex(ce=>!ce.entry_id),A=v>=0?E[v]:void 0;return{id:_,name:m.name||_,checklistText:(m.checklist||[]).join(`
`),partId:A?.part_id||"",partQty:A?.quantity!=null?String(A.quantity):"",reqOverride:m.required_completion_fields!==void 0,reqFields:[...m.required_completion_fields||[]],extraParts:E.filter((ce,We)=>We!==v).map(ce=>({...ce})),carry:k}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"",this._scheduleTimeOn=!!t.schedule_time;let o=t.on_complete_action;if(o&&o.service){this._actionService=o.service;let _=o.target?.entity_id;this._actionTargetEntity=Array.isArray(_)?_[0]||"":_||"",this._actionTargetStored=o.target&&typeof o.target=="object"?JSON.parse(JSON.stringify(o.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=o.data&&typeof o.data=="object"?{...o.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=o.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let c=t.quick_complete_defaults;this._qcNotes=c?.notes||"",this._qcCost=c?.cost!=null?String(c.cost):"",this._qcDuration=c?.duration!=null?String(c.duration):"",this._qcFeedback=c?.feedback||"";let h=t.adaptive_config||{};if(this._environmentalEntity=h.environmental_entity||"",this._environmentalAttribute=h.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!h.enabled,this._adaptiveAlpha=h.ewa_alpha?.toString()??ge.alpha,this._adaptiveMin=h.min_interval_days?.toString()??ge.min,this._adaptiveMax=h.max_interval_days?.toString()??ge.max,this._adaptiveSeasonal=h.seasonal_enabled!==!1,this._adaptivePrediction=h.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,t.trigger_config){let _=t.trigger_config;this._triggerEntityId=Nr(_)||"",this._triggerEntityIds=Ai(_),this._triggerEntityLogic=_.entity_logic||"any",this._setTypeFields(Ca(_)),this._triggerCombinator=_.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=_.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=_.auto_complete_on_recovery||!1,this._holdUntilDone=_.trigger_hold_until_done===!0,this._triggerRuntimeMaxSession=_.trigger_runtime_max_session_seconds?.toString()||"",this._triggerDetailAttribute=_.detail_attribute||"",_.type==="compound"?(this._compoundLogic=_.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(_.conditions||[]).map(oc)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),this._detailsOpen=this._priority!=="normal"||!!this._labels.trim()||!!this._documentationUrl.trim()||!!this._customIcon,await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._detailsOpen=!1,this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._calMonths=[],this._hadCalMonths=!1,this._calendarEntity="",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._mirrorTodoMode="default",this._completeWhenEntity="",this._completeWhenState="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._notifyEnabled=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=ge.alpha,this._adaptiveMin=ge.min,this._adaptiveMax=ge.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._actionTestError="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates,this._triggerDaysBefore=e.daysBefore}_resetTriggerFields(){++this._attrSeq,this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(Sa()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._holdUntilDone=!1,this._triggerRuntimeMaxSession="",this._triggerDetailAttribute="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new it(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=n("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,i]=e.split(".");if(!this.hass?.services?.[t]?.[i]){this._actionTestResult="error",this._actionTestError=n("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let a=this._actionTargetEntity.trim();if(a){let o=a.split(".")[0];if(o!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=n("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",t).replace("{entity}",a).replace("{entity_domain}",o).replace("{suggestion}",`${o}.${i}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[a]){this._actionTestResult="error",this._actionTestError=n("action_test_entity_missing",this._lang).replace("{entity}",a),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,i]=e.split("."),a=this.hass?.services?.[t]?.[i]?.fields;return!a||Object.keys(a).length===0?null:Object.entries(a).map(([o,c])=>({name:o,required:!!c.required,selector:c.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([t,i])=>t==="entity_id"?Array.isArray(i)&&i.length>1:Array.isArray(i)?i.length>0:!!i):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},t=a=>(Array.isArray(a)?a:[a]).filter(o=>typeof o=="string"&&!!o),i=this.hass;return[...t(e.entity_id).map(a=>i.states?.[a]?.attributes?.friendly_name||a),...t(e.device_id).map(a=>i.devices?.[a]?.name_by_user||i.devices?.[a]?.name||a),...t(e.area_id).map(a=>i.areas?.[a]?.name||a),...t(e.floor_id).map(a=>i.floors?.[a]?.name||a),...t(e.label_id)].join(", ")}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return p;let t=this._serviceSchema();return l`
      <details class="ca-section">
        <summary>${n("on_complete_action_title",e)}</summary>
        <p class="field-help">${n("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let a=this._serviceSchema();if(a){let o=new Set(a.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>o.has(c)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>n("on_complete_action_target",e)}
          @value-changed=${i=>{let a=i.detail.value;this._actionTargetEntity=a.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?l`<p class="field-help ca-target-more">${n("on_complete_action_target_more",e).replace("{targets}",this._actionTargetSummary())}</p>`:p}
        <p class="field-help ca-domain-hint">
          ${n("on_complete_action_target_hint",e)}
        </p>
        <label class="ca-skip-auto">
          <input type="checkbox" .checked=${this._actionSkipAuto}
            @change=${i=>{this._actionSkipAuto=i.target.checked}} />
          <span>${n("on_complete_action_skip_auto",e)}</span>
        </label>
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
                label="${n("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${i=>{this._actionDataJsonFallback=i.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":n("on_complete_action_test",e)}
          </button>
          ${this._actionTestResult==="ok"?l`<span class="ca-test-ok">${n("on_complete_action_test_success",e)}</span>`:p}
          ${this._actionTestResult==="error"?l`<div class="ca-test-error-block">
                <span class="ca-test-error">${n("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?l`<div class="ca-test-error-detail">${this._actionTestError}</div>`:p}
              </div>`:p}
        </div>
      </details>

      ${this.completionActionsEnabled?l`<details class="ca-section">
        <summary>${n("quick_complete_defaults_title",e)}</summary>
        <p class="field-help">${n("quick_complete_defaults_desc",e)}</p>
        <ms-textfield
          label="${n("quick_complete_defaults_notes",e)}"
          .value=${this._qcNotes}
          @input=${i=>{this._qcNotes=i.target.value}}
        ></ms-textfield>
        <div class="qc-cost">
          <span class="qc-cost-label">${n("quick_complete_defaults_cost",e)}</span>
          <ms-cost-input .lang=${e} .value=${this._qcCost}
            @value-changed=${i=>{this._qcCost=i.detail.value}}></ms-cost-input>
        </div>
        <ms-textfield
          label="${n("quick_complete_defaults_duration",e)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${i=>{this._qcDuration=i.target.value}}
        ></ms-textfield>
        <select class="qc-feedback" aria-label=${n("was_maintenance_needed",e)}
          .value=${this._qcFeedback}
          @change=${i=>{this._qcFeedback=i.target.value}}>
          <option value="">${n("quick_complete_defaults_feedback_none",e)}</option>
          <option value="needed">${n("quick_complete_defaults_feedback_needed",e)}</option>
          <option value="not_needed">${n("quick_complete_defaults_feedback_not_needed",e)}</option>
          <option value="not_sure">${n("feedback_not_sure",e)}</option>
        </select>
      </details>`:p}
    `}async _loadParts(){this.parts=[];let e=this._entryId;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e});if(e!==this._entryId)return;this.parts=t.parts||[],this._partsLoadFailed=!1}catch{if(e!==this._entryId)return;this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){this._foreignOwners=[];let e=this._entryId;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});if(e!==this._entryId)return;this._foreignOwners=(t.objects||[]).filter(i=>i.entry_id!==e&&(i.parts||[]).length>0).map(i=>({entry_id:i.entry_id,name:i.object?.name||i.entry_id,parts:i.parts||[]})).sort((i,a)=>i.name.localeCompare(a.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let i=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:i.suggested_attributes||[],available:i.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){let t=++this._attrSeq;if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});if(t!==this._attrSeq)return;this._entityDomain=i.domain||"",this._suggestedAttributes=i.suggested_attributes||[],this._availableAttributes=i.available_attributes||[]}catch{if(t!==this._attrSeq)return;this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let i=ne({part_id:e.id,entry_id:t}),a=this._consumesParts[i],o=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return l`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${a!==void 0}
            @change=${c=>{let h={...this._consumesParts};if(c.target.checked)h[i]=h[i]||o;else{delete h[i];let _={...this._consumesQtyText};delete _[i],this._consumesQtyText=_}this._consumesParts=h}}
          />
          <span>${e.name}${e.unit?` (${e.unit})`:""}</span>
        </label>
        ${a!==void 0?l`<input
              class="consumes-qty"
              aria-label=${`${e.name}: ${n("quantity",this._lang)}`}
              type="number"
              min=${Fe[0]}
              max=${Fe[1]}
              step="0.01"
              .value=${this._consumesQtyText[i]??String(a.quantity)}
              @input=${c=>{let h=c.target.value;this._consumesQtyText={...this._consumesQtyText,[i]:h};let _=parseFloat(h.replace(",","."));Number.isFinite(_)&&_>=Fe[0]&&(this._consumesParts={...this._consumesParts,[i]:{...o,quantity:_}})}}
            />`:p}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let t of Object.keys(e)){let i=this._consumesQtyText[t];if(i===void 0)continue;let a=parseFloat(i.replace(",","."));if(!Number.isFinite(a)||a<Fe[0]||a>Fe[1]){let o=c=>j(c,this._lang,{maximumFractionDigits:2});return this._error=n("settings_value_out_of_range",this._lang).replace("{min}",o(Fe[0])).replace("{max}",o(Fe[1])),!1}e[t]={...e[t],quantity:a}}return this._consumesParts=e,!0}_toggleRequired(e,t){let i=new Set(this._requiredCompletion);t?i.add(e):i.delete(e),this._requiredCompletion=[...i]}_patchReading(e,t){this._readings=this._readings.map(i=>i.id===e?{...i,...t}:i)}_renderReadingsEditor(e){let t=Ln(this._readings);return l`
      <div class="readings-editor">
        <div class="field-label">${n("readings_section",e)}</div>
        <div class="field-help">${n("readings_hint",e)}</div>
        ${this._readings.map(i=>l`
          ${t.has(i.id)?l`<div class="field-help reading-dup">${n("reading_duplicate_name",e)}</div>`:p}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${n("reading_name_label",e)}"
              .value=${i.name}
              @input=${a=>this._patchReading(i.id,{name:a.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${n("reading_unit_short",e)}"
              .value=${i.unit||""}
              @input=${a=>this._patchReading(i.id,{unit:a.target.value})}
            ></ms-textfield>
            <ha-icon-button class="phase-remove reading-remove" .label=${n("remove",e)} @click=${()=>this._readings=this._readings.filter(a=>a.id!==i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<Ir?l`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:Pn(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${n("reading_add",e)}
          </ha-button>`:p}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",i=t,a=2;for(;this._phaseDefs.some(o=>o.id===i);)i=`${t}-${a++}`;return i}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(i=>i.id===e?{...i,...t}:i)}_renderPhasesEditor(e){let t=i=>this._phaseDefs.find(a=>a.id===i)?.name||i;return l`
      <details class="phases-section" ?open=${this._phaseDefs.length>0}>
      <summary>${n("phases_section",e)}</summary>
      <div class="field-help">${n("phases_hint",e)}</div>
      ${this._phaseDefs.map(i=>l`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${n("phase_name",e)}"
              .value=${i.name}
              @input=${a=>this._patchPhaseDef(i.id,{name:a.target.value})}
            ></ms-textfield>
            ${this.parts.length?l`
              <select
                class="phase-part"
                aria-label=${n("spare_part",e)}
                .value=${i.partId}
                @change=${a=>{let o=a.target.value;this._patchPhaseDef(i.id,i.partQty?{partId:o}:{partId:o,partQty:"1"})}}
              >
                <option value="">—</option>
                ${this.parts.map(a=>l`<option value=${a.id} ?selected=${a.id===i.partId}>${a.name}</option>`)}
              </select>
              ${i.partId?l`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" aria-label=${n("quantity",e)} type="number" min=${Ae[0]} step="0.01" placeholder="1" .value=${i.partQty}
                  @input=${a=>this._patchPhaseDef(i.id,{partQty:a.target.value})} />
              `:p}
            `:p}
            <ha-icon-button class="phase-remove" .label=${n("remove",e)} @click=${()=>this._removePhaseDef(i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?l`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${n("checklist_placeholder",e)}"
              .value=${i.checklistText}
              @input=${a=>this._patchPhaseDef(i.id,{checklistText:a.target.value})}
            ></textarea>
          `:p}
          <label class="req-option phase-req-toggle">
            <input
              type="checkbox"
              .checked=${i.reqOverride}
              @change=${a=>this._patchPhaseDef(i.id,{reqOverride:a.target.checked})}
            />
            <span>${n("phase_require_override",e)}</span>
          </label>
          ${i.reqOverride?l`
            <div class="required-completion phase-req-fields">
              ${Hr.map(a=>l`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${i.reqFields.includes(a)}
                    @change=${o=>{let c=o.target.checked,h=new Set(i.reqFields);c?h.add(a):h.delete(a),this._patchPhaseDef(i.id,{reqFields:[...h]})}}
                  />
                  <span>${n(zt[a],e)}</span>
                </label>
              `)}
            </div>
          `:p}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${n("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(i=>i.name.trim())?l`
        <div class="phase-seq-label">${n("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((i,a)=>l`
            <span class="phase-chip">
              ${a+1}. ${t(i)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((o,c)=>c!==a)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            aria-label=${n("phase_sequence_add_step",e)}
            .value=${""}
            @change=${i=>{let a=i.target.value;a&&(this._phaseSeq=[...this._phaseSeq,a]),i.target.value=""}}
          >
            <option value="">+ ${n("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(i=>i.name.trim()).map(i=>l`<option value=${i.id}>${i.name}</option>`)}
          </select>
        </div>
      `:p}
      </details>
    `}async _save(){if(this._loading||!this._name.trim()||this._missingDueDate())return;if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),i=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(i)&&t>i){this._error=`${n("adaptive_min_interval",this._lang)} > ${n("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=n("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=n("calendar_entity_required",this._lang);return}if(!this._applyConsumesQtyText())return;this._loading=!0,this._error="";let e;try{let t=await H(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:c=>{this._error=c}});if(t===void 0)return;let i=this._taskId||t?.task_id,a=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let o=c=>{this._warning=n("subsave_warning",this._lang).replace("{detail}",c)};if(i&&this._scheduleType==="sensor_based"&&a&&await H(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:i,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:o})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),i&&this._adaptiveSnapshot()!==this._adaptiveInitial){let c=parseFloat(this._adaptiveAlpha),h=parseInt(this._adaptiveMin,10),_=parseInt(this._adaptiveMax,10);await H(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:i,enabled:this._adaptiveEnabled,...c>=Lt[0]&&c<=Lt[1]?{ewa_alpha:c}:{},...!isNaN(h)&&h>=1?{min_interval_days:h}:{},...!isNaN(_)&&_>=1?{max_interval_days:_}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:o})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?i&&(this._taskId=i):this._seriesIndex+1<this._series.length?e=this._seriesIndex+1:(this._open=!1,this._series=[]),this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}e!==void 0&&await this._editSeriesItem(e)}_missingDueDate(){return this._scheduleType==="one_time"&&!this._dueDate}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):Oi.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.priority=this._priority,e.labels=this._labels.split(",").map(a=>a.trim()).filter(Boolean);let i=this.mirrorTodoDefault.length&&this._mirrorTodoMode!=="own"?[]:this._mirrorTodoEntities.filter(Boolean);e.mirror_todo_entities=i,e.mirror_todo_use_default=this.mirrorTodoDefault.length?this._mirrorTodoMode==="default":this._mirrorTodoMode!=="none",e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip,e.complete_when=this._completeWhenEntity&&this._completeWhenState.trim()?{entity_id:this._completeWhenEntity,to_state:this._completeWhenState.trim()}:null,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=Hn(this._readings);{let a={};for(let c of this._phaseDefs){if(!c.name.trim())continue;let h={...c.carry,name:c.name.trim()},_=c.checklistText.split(`
`).map(f=>f.trim()).filter(Boolean);_.length&&(h.checklist=_);let m=[];if(c.partId){let f=parseFloat(c.partQty);m.push({part_id:c.partId,quantity:Number.isFinite(f)&&f>0?f:1})}for(let f of c.extraParts)m.push(f.entry_id?{part_id:f.part_id,quantity:f.quantity,entry_id:f.entry_id}:{part_id:f.part_id,quantity:f.quantity});m.length&&(h.consumes_parts=m),c.reqOverride&&(h.required_completion_fields=[...c.reqFields]),a[c.id]=h}let o=this._phaseSeq.filter(c=>c in a);e.phases=Object.keys(a).length&&o.length?a:null,e.phase_sequence=e.phases?o:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(a=>a.entry_id?{part_id:a.part_id,quantity:a.quantity,entry_id:a.entry_id}:{part_id:a.part_id,quantity:a.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let a=this._compoundConditions.map(lc).filter(o=>o!==null);if(a.length>0){let o={type:"compound",compound_logic:this._compoundLogic,conditions:a};this._autoCompleteOnRecovery&&(o.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(o.trigger_combinator="all"),this._triggerDetailAttribute&&(o.detail_attribute=this._triggerDetailAttribute),e.trigger_config=o}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let a=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],o={entity_id:a[0],entity_ids:a,type:this._triggerType};if(Ra(o,this._typeFields()),this._holdUntilDone&&this._isStateLatch()?o.trigger_hold_until_done=!0:this._autoCompleteOnRecovery&&(o.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(o.trigger_combinator="all"),this._triggerDetailAttribute&&(o.detail_attribute=this._triggerDetailAttribute),a.length>1&&(o.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let c=parseFloat(this._triggerBaselineValue);!isNaN(c)&&c>=0&&(o.trigger_baseline_value=c)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let c=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(c)&&c>0&&(o.trigger_runtime_max_session_seconds=c)}e.trigger_config=o}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&$a.includes(this._scheduleType)){let a=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(a)?a:null}if(this.checklistsEnabled){let a=this._checklistText.split(`
`).map(o=>o.trim()).filter(Boolean).slice(0,100);e.checklist=a.length?a:null}if(this.completionActionsEnabled||this._actionPresent){let a=this._actionService.trim();if(a&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(a)){let o={service:a},c=this._actionTargetEntity.trim();this._actionTargetStored&&c===this._actionTargetInitial?o.target=JSON.parse(JSON.stringify(this._actionTargetStored)):c&&(o.target={entity_id:c});let h=this._buildActionData();Object.keys(h).length>0&&(o.data=h),this._actionSkipAuto&&(o.skip_auto=!0),e.on_complete_action=o}else e.on_complete_action=null}if(this.completionActionsEnabled){let a={};this._qcNotes.trim()&&(a.notes=this._qcNotes.trim());let o=parseFloat(this._qcCost);isNaN(o)||(a.cost=o);let c=ct(this._qcDuration);c!==null&&(a.duration=c),this._qcFeedback&&(a.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(a).length?a:null}return e}_close(){this._open=!1,this._series=[],this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let e=this._lang,t=this._triggerType==="compound";return l`
      <div class="select-row">
        <label>${n("trigger_type",e)}</label>
        <select aria-label=${n("trigger_type",e)}
          .value=${this._triggerType}
          @change=${i=>this._triggerType=i.target.value}
        >
          ${nc.map(i=>l`<option value=${i} ?selected=${i===this._triggerType}>${Ea(i,e)}</option>`)}
        </select>
      </div>
      ${t?this._renderCompoundEditor():l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${n("entity_id",e)} (${n("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${i=>{let o=i.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=o[0]||"",this._triggerEntityIds=o,o[0]&&this._fetchEntityAttributes(o[0])}}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:Kr}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>n("entity_id",e)}
          @value-changed=${i=>{let a=(i.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=a[0]||"",this._triggerEntityIds=a,a[0]?this._fetchEntityAttributes(a[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?l`
          <div class="select-row">
            <label>${n("entity_logic",e)}</label>
            <select aria-label=${n("entity_logic",e)}
              .value=${this._triggerEntityLogic}
              @change=${i=>this._triggerEntityLogic=i.target.value}
            >
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${n("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${n("entity_logic_all",e)}</option>
            </select>
          </div>
        `:p}
        ${this._renderAttributeSelect({label:n("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:i=>this._triggerAttribute=i})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      ${this._renderDetailAttributeSelect(e)}
      ${this._isStateLatch()?this._renderTriggerEnd(e):l`
        <label>
          <input
            type="checkbox"
            .checked=${this._autoCompleteOnRecovery}
            @change=${i=>this._autoCompleteOnRecovery=i.target.checked}
          />
          ${n("auto_complete_on_recovery",e)}
        </label>
        <div class="field-help">${n("auto_complete_on_recovery_help",e)}</div>
      `}
      <ms-textfield
        label="${n("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${i=>this._intervalDays=i.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():p}
      ${this._intervalDays?l`
            <div class="select-row">
              <label>${n("trigger_combinator",e)}</label>
              <select aria-label=${n("trigger_combinator",e)}
                @change=${i=>this._triggerCombinator=i.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${n("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${n("trigger_combinator_all",e)}</option>
              </select>
            </div>
          `:p}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((i,a)=>a===e?{...i,...t}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,Sa()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,i)=>i!==e)}_renderCompoundEditor(){let e=this._lang;return l`
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
      ${this._compoundConditions.length===0?l`<div class="field-help">${n("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,i)=>this._renderCondition(t,i))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${n("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let i=this._lang,a=t+1;return l`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${n("compound_condition",i)} ${a}</span>
          <button
            type="button"
            class="icon-btn"
            title="${n("compound_remove_condition",i)}"
            @click=${()=>this._removeCondition(t)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${n("entity_id",i)} (${n("comma_separated",i)})"
            .value=${e.entityIds}
            @input=${o=>this._patchCondition(t,{entityIds:o.target.value})}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:Kr}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(o=>o.trim()).filter(Boolean)}}
          .computeLabel=${()=>n("entity_id",i)}
          @value-changed=${o=>{let c=(o.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:c.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          <label>${n("trigger_type",i)}</label>
          <select aria-label=${n("trigger_type",i)}
            .value=${e.type}
            @change=${o=>this._patchCondition(t,{type:o.target.value})}
          >
            ${Aa.map(o=>l`<option value=${o} ?selected=${o===e.type}>${Ea(o,i)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(e,t)}
      </div>
    `}_isStateLatch(){return this._triggerType==="state_change"&&(this._triggerTargetChanges===""||Number(this._triggerTargetChanges)===1)&&!!(this._triggerFromState.trim()||this._triggerToState.trim())}_renderTriggerEnd(e){let t=this._holdUntilDone?"hold":this._autoCompleteOnRecovery?"done":"ok",i={ok:"trigger_end_ok",done:"trigger_end_done",hold:"trigger_end_hold"},a=o=>{this._autoCompleteOnRecovery=o==="done",this._holdUntilDone=o==="hold"};return l`
      <div class="trigger-end" role="radiogroup" aria-label=${n("trigger_end",e)}>
        <div class="field-label">${n("trigger_end",e)}</div>
        ${Object.keys(i).map(o=>l`
          <label class="trigger-end-option">
            <input type="radio" name="trigger-end" value=${o} .checked=${t===o} @change=${()=>a(o)} />
            ${n(i[o],e)}
          </label>
        `)}
        ${t==="done"?l`<div class="field-help">${n("auto_complete_on_recovery_help",e)}</div>`:p}
        ${t==="hold"?l`<div class="field-help">${n("trigger_end_hold_help",e)}</div>`:p}
      </div>
    `}_renderCompleteWhen(e){return l`
      <div class="field complete-when-field">
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${n("complete_when",e)}"
            placeholder="binary_sensor.washer_door"
            .value=${this._completeWhenEntity}
            @input=${t=>this._completeWhenEntity=t.target.value.trim()}
          ></ms-textfield>
        `:l`
          <ha-form
            class="entity-picker-form"
            .hass=${this.hass}
            .schema=${[{name:"complete_when",selector:{entity:{}}}]}
            .data=${{complete_when:this._completeWhenEntity}}
            .computeLabel=${()=>n("complete_when",e)}
            @value-changed=${t=>{let i=(t.detail.value.complete_when||"").trim();i!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=i}}
          ></ha-form>`}
        ${this._completeWhenEntity?this._renderStateField({label:n("complete_when_state",e),value:this._completeWhenState,entityId:this._completeWhenEntity,onInput:t=>this._completeWhenState=t}):p}
        <div class="field-help">${n("complete_when_help",e)}</div>
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
          @input=${i=>e.onInput(i.target.value)}
        ></ms-textfield>
      `:l`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(i=>i.trim()).filter(Boolean)}}
        .computeLabel=${()=>n("runtime_on_states",t)}
        @value-changed=${i=>e.onInput((i.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?p:!this.adaptiveFeature&&!this._adaptiveWasEnabled?p:l`
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
            min=${Lt[0]}
            max=${Lt[1]}
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
          </label>`:p}
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptivePrediction}
              @change=${t=>this._adaptivePrediction=t.target.checked}
            />
            ${n("adaptive_prediction_enabled",e)}
          </label>
        `:p}
      </details>
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?l`
        <div class="select-row">
          <label>${e.label}</label>
          <select aria-label=${e.label}
            .value=${e.value}
            @change=${i=>e.onSelect(i.target.value)}
          >
            <option value="" ?selected=${!e.value}>${n("use_entity_state",t)}</option>
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
    `}_renderDetailAttributeSelect(e){let t=this._triggerType==="compound"?this._compoundConditions.flatMap(_=>_.entityIds.split(",").map(m=>m.trim()).filter(Boolean)):(this._triggerEntityIds.length?this._triggerEntityIds:[this._triggerEntityId]).filter(Boolean);if(!t.length)return p;let i=this.hass?.states??{},a=new Map;for(let _ of t){this._fetchConditionAttributes(_);for(let m of this._conditionAttrOptions[_]?.available??[])a.has(m.name)||a.set(m.name,dc(i[_]?.attributes?.[m.name]))}let o=this._triggerDetailAttribute;o&&!a.has(o)&&a.set(o,"");let c=n("trigger_detail_attribute",e),h=a.size?l`
        <div class="select-row">
          <label>${c}</label>
          <select class="detail-attribute-select" aria-label=${c} .value=${o}
            @change=${_=>this._triggerDetailAttribute=_.target.value}>
            <option value="" ?selected=${!o}>${n("trigger_detail_none",e)}</option>
            ${[...a.entries()].sort(([_],[m])=>_.localeCompare(m)).map(([_,m])=>l`<option value=${_} ?selected=${_===o}>${m?`${_}: ${m}`:_}</option>`)}
          </select>
        </div>`:l`
        <ms-textfield class="detail-attribute-input" label=${c} .value=${o}
          @input=${_=>this._triggerDetailAttribute=_.target.value.trim()}></ms-textfield>`;return l`${h}<div class="field-help">${n("trigger_detail_attribute_help",e)}</div>`}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:n("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:i=>this._environmentalAttribute=i})}_renderConditionAttribute(e,t){let i=e.entityIds.split(",")[0]?.trim()||"";i&&this._fetchConditionAttributes(i);let a=i?this._conditionAttrOptions[i]:void 0;return this._renderAttributeSelect({label:n("attribute_optional",this._lang),value:e.attribute,suggested:a?.suggested??[],available:a?.available??[],onSelect:o=>this._patchCondition(t,{attribute:o})})}_renderConditionTypeFields(e,t){let i=this._lang;if(e.type==="threshold")return l`
        <ms-textfield label="${n("trigger_above",i)}" type="number" .value=${e.above}
          @input=${a=>this._patchCondition(t,{above:a.target.value})}></ms-textfield>
        <ms-textfield label="${n("trigger_below",i)}" type="number" .value=${e.below}
          @input=${a=>this._patchCondition(t,{below:a.target.value})}></ms-textfield>
        <ms-textfield label="${n("trigger_equals",i)}" type="number" .value=${e.equals}
          @input=${a=>this._patchCondition(t,{equals:a.target.value})}></ms-textfield>
        <ms-textfield label="${n("trigger_not_equals",i)}" type="number" .value=${e.notEquals}
          @input=${a=>this._patchCondition(t,{notEquals:a.target.value})}></ms-textfield>
        <ms-textfield label="${n("for_minutes",i)}" type="number" .value=${e.forMinutes}
          @input=${a=>this._patchCondition(t,{forMinutes:a.target.value})}></ms-textfield>
      `;if(e.type==="counter")return l`
        <ms-textfield label="${n("target_value",i)}" type="number" .value=${e.targetValue}
          @input=${a=>this._patchCondition(t,{targetValue:a.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${e.deltaMode}
            @change=${a=>this._patchCondition(t,{deltaMode:a.target.checked})} />
          ${n("delta_mode",i)}
        </label>
      `;if(e.type==="state_change"){let a=e.entityIds.split(",")[0]?.trim()||"";return l`
        ${this._renderStateField({label:n("from_state_optional",i),value:e.fromState,entityId:a,onInput:o=>this._patchCondition(t,{fromState:o})})}
        ${this._renderStateField({label:n("to_state_optional",i),value:e.toState,entityId:a,onInput:o=>this._patchCondition(t,{toState:o})})}
        <ms-textfield label="${n("target_changes",i)}" type="number" .value=${e.targetChanges}
          @input=${o=>this._patchCondition(t,{targetChanges:o.target.value})}></ms-textfield>
        <ms-textfield label="${n("for_minutes",i)}" type="number" .value=${e.forMinutes}
          @input=${o=>this._patchCondition(t,{forMinutes:o.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let a=e.entityIds.split(",")[0]?.trim()||"";return l`
        <ms-textfield label="${n("runtime_hours",i)}" type="number" .value=${e.runtimeHours}
          @input=${o=>this._patchCondition(t,{runtimeHours:o.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:a,onInput:o=>this._patchCondition(t,{onStates:o})})}
      `}return e.type==="due_date"?l`
        <ms-textfield label="${n("days_before",i)}" type="number" step="1"
          min=${Ot[0]} max=${Ot[1]} .value=${e.daysBefore}
          @input=${a=>this._patchCondition(t,{daysBefore:a.target.value})}></ms-textfield>
      `:p}_renderUnitSelect(){let e=this._lang;return l`
      <div class="select-row">
        <label>${n("interval_unit",e)}</label>
        <select aria-label=${n("interval_unit",e)}
          .value=${this._intervalUnit}
          @change=${t=>this._intervalUnit=t.target.value}
        >
          ${["days","weeks","months","years"].map(t=>l`<option value=${t} ?selected=${t===this._intervalUnit}>${n("unit_"+t,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(Oi.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(g._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let i=(h,_,m=0)=>{if(!(!h||m>10)){(h.tagName?.toLowerCase()??"")==="ha-entity-picker"&&_.push(h);for(let f of[h.shadowRoot,h])if(f)for(let w of Array.from(f.children??[]))i(w,_,m+1)}},a=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],o=[];for(let h of a)i(h,o);let c=o.length===0||o.some(h=>h.offsetHeight===0);if(e.offsetHeight===0||c){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){++this._previewSeq,this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{},...this._taskId?{entry_id:this._entryId,task_id:this._taskId}:{}});if(t!==this._previewSeq)return;this._schedulePreview=i.occurrences||[],this._schedulePreviewEnded=!!i.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return p;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",i=this._schedulePreview.map((o,c)=>{let h=new Date(`${o}T12:00:00`).getDay();return`${jt(h===0?6:h-1,e,"short")} ${M(o,e)}${c===0?t:""}`}).join(" \xB7 "),a=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?l`<div class="field-help">${n("schedule_preview_ontime",e)}</div>`:p;return l`
      <div class="trigger-live-hint schedule-preview">
        ${n("schedule_preview_title",e)}: ${i}${this._schedulePreviewEnded?l` <span class="field-help">${n("schedule_preview_ends",e)}</span>`:p}
        ${a}
      </div>
    `}_buildSchedule(){let e=a=>{let o=parseInt(this._calOffset,10)||0;return o&&(a.offset=Math.max(-Mt,Math.min(o,Mt))),a},t=a=>((this._calMonths.length||this._hadCalMonths)&&(a.months=[...this._calMonths].sort((o,c)=>o-c)),e(a));if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((a,o)=>a-o)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let i={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(i.business=!0),t(i)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,i)=>t-i)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleCalMonth(e){this._calMonths=this._calMonths.includes(e)?this._calMonths.filter(t=>t!==e):[...this._calMonths,e]}_renderCalMonths(){let e=this._lang;return l`
      <label class="field-label">${n("recurrence_months_label",e)}</label>
      <div class="field-help">${n("recurrence_months_hint",e)}</div>
      <div class="weekday-chips season-chips cal-month-chips">
        ${Ta(e).map((t,i)=>l`
          <button
            type="button"
            class="season-chip ${this._calMonths.includes(i+1)?"selected":""}"
            @click=${()=>this._toggleCalMonth(i+1)}
          >${t}</button>`)}
      </div>`}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||Oi.includes(this._scheduleType)))return p;let i=Ta(e);return l`
      <label class="field-label">${n("season_window_label",e)}</label>
      <div class="field-help">${n("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${i.map((a,o)=>l`
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
        ></ms-textfield>`:p}
      ${this._endsMode==="until"?l`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${n("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${a=>this._endsUntil=a.detail.value}
        ></ms-date-field>`:p}
    `}_renderCalendarFields(){let e=this._lang,t=cc(e);if(this._scheduleType==="weekdays")return l`
        <label class="field-label">${n("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((i,a)=>l`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(a)?"selected":""}"
              @click=${()=>this._toggleWeekday(a)}
            >${i}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let i=[["1",n("ord_1",e)],["2",n("ord_2",e)],["3",n("ord_3",e)],["4",n("ord_4",e)],["5",n("ord_5",e)],["-1",n("ord_last",e)]];return l`
        <div class="select-row">
          <label>${n("recurrence_occurrence",e)}</label>
          <select aria-label=${n("recurrence_occurrence",e)} .value=${this._nth} @change=${a=>this._nth=a.target.value}>
            ${i.map(([a,o])=>l`<option value=${a} ?selected=${a===this._nth}>${o}</option>`)}
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
            @input=${i=>this._calendarEntity=i.target.value.trim()}
          ></ms-textfield>
        `:l`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>n("calendar_entity_label",e)}
            .computeHelper=${()=>n("calendar_entity_hint",e)}
            @value-changed=${i=>{this._calendarEntity=(i.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?l`
        ${this._domLastDay?p:l`
          <ms-textfield
            label="${n("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${i=>this._domDay=i.target.value}
          ></ms-textfield>`}
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domLastDay}
            @change=${i=>this._domLastDay=i.target.checked} />
          <span>${n("recurrence_last_day",e)}</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domBusiness}
            @change=${i=>this._domBusiness=i.target.checked} />
          <span>${n("recurrence_business_day",e)}</span>
        </label>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`:p}_renderCalOffsetField(){let e=this._lang;return l`
      <ms-textfield
        label="${n("recurrence_offset",e)}"
        helper="${n("recurrence_offset_help",e)}"
        type="number"
        min=${-Mt}
        max=${Mt}
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return p;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?l`<div class="trigger-live-hint warn">${n("trigger_hint_overlap",this._lang)}</div>`:p,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let i=this.hass.states[t];if(!i)return e;let a=this._lang,o=i.attributes?.unit_of_measurement,c=typeof o=="string"&&o?` ${o}`:"",h=this._triggerAttribute?i.attributes?.[this._triggerAttribute]:i.state,_=typeof h=="number"?h:parseFloat(String(h)),m=h!=="unknown"&&h!=="unavailable"&&h!=null&&!isNaN(_),f=x=>j(x,a,{maximumFractionDigits:1}),w=[];if(this._triggerType==="threshold"){let x=parseFloat(this._triggerAbove),R=parseFloat(this._triggerBelow),k=parseFloat(this._triggerEquals),E=parseFloat(this._triggerNotEquals);if([x,R,k,E].every(v=>isNaN(v)))return p;m&&w.push(n("trigger_hint_now",a).replace("{value}",f(_)+c)),isNaN(x)||w.push(n("trigger_hint_above",a).replace("{target}",f(x)+c)),isNaN(R)||w.push(n("trigger_hint_below",a).replace("{target}",f(R)+c)),isNaN(k)||w.push(n("trigger_hint_equals",a).replace("{target}",f(k)+c)),isNaN(E)||w.push(n("trigger_hint_not_equals",a).replace("{target}",f(E)+c))}else if(this._triggerType==="counter"){let x=parseFloat(this._triggerTargetValue);if(isNaN(x))return p;this._triggerDeltaMode?this._taskId?w.push(n("trigger_hint_counter_delta_edit",a).replace("{target}",f(x)+c)):m?w.push(n("trigger_hint_counter_delta",a).replace("{value}",f(_)+c).replace("{due}",f(_+x)+c).replace("{target}",f(x)+c)):w.push(n("trigger_hint_counter_delta_edit",a).replace("{target}",f(x)+c)):(m&&w.push(n("trigger_hint_now",a).replace("{value}",f(_)+c)),w.push(n("trigger_hint_counter_abs",a).replace("{target}",f(x)+c)))}else if(this._triggerType==="runtime"){let x=parseFloat(this._triggerRuntimeHours);if(isNaN(x))return p;w.push(n("trigger_hint_runtime",a).replace("{hours}",f(x))),w.push(n("trigger_hint_state_now",a).replace("{value}",String(i.state)))}else if(this._triggerType==="state_change"){let x=parseInt(this._triggerTargetChanges,10)||1,R=this._triggerToState.trim();w.push((R?n("trigger_hint_state_change_to",a).replace("{state}",R):n("trigger_hint_state_change",a)).replace("{count}",String(x))),w.push(n("trigger_hint_state_now",a).replace("{value}",String(i.state)))}else if(this._triggerType==="due_date"){let x=parseInt(this._triggerDaysBefore,10)||0;w.push(x===0?n("trigger_hint_due_date_same_day",a):pi("trigger_hint_due_date","trigger_hint_due_date_one",x,a,"days"));let R=h==null?"":String(h);R&&!isNaN(Date.parse(R))&&w.push(n("trigger_hint_due_date_now",a).replace("{date}",M(R,a)))}return w.length?l`<div class="trigger-live-hint">${w.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?l`
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
                    </div>`:p}
              </div>
            `:p}
      `:this._triggerType==="state_change"?l`
        ${this._renderStateField({label:n("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:t=>this._triggerFromState=t})}
        <div class="field-help">${n("state_value_help",e)}</div>
        ${this._renderStateField({label:n("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:t=>this._triggerToState=t})}
        <ms-textfield
          label="${n("target_changes",e)}"
          type="number"
          min=${Gn[0]}
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${n("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?l`<div class="field-help">${n("state_latch_help",e)}</div>`:p}
        <ms-textfield
          label="${n("for_at_least_minutes",e)}"
          type="number"
          min=${Vn[0]}
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
          min=${Ot[0]}
          max=${Ot[1]}
          .value=${this._triggerDaysBefore}
          @input=${t=>this._triggerDaysBefore=t.target.value}
        ></ms-textfield>
        <div class="field-help">${n("days_before_help",e)}</div>
      `:p}_section(e,t,i){return l`<section class="form-section ${e}">
      <h3 class="section-title">${t}</h3>
      ${i}
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
          `:p}
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
              ${rc.map(t=>l`<option value=${t} ?selected=${t===this._type}>${n(t,e)}</option>`)}
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
            ${Mr.map(t=>l`<option value=${t} ?selected=${t===this._priority}>${n("priority_"+t,e)}</option>`)}
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
              ${sc.map(t=>l`<option value=${t} ?selected=${t===this._scheduleType}>${n(t,e)}</option>`)}
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
              `:p}
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
              `:p}
          ${this.scheduleTimeEnabled&&$a.includes(this._scheduleType)?l`
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
            `:p}
          `:p}
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
            min=${Pr[0]}
            max=${Pr[1]}
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
    `)}_renderTriggerSection(e){return this._scheduleType!=="sensor_based"?p:this._section("trigger-section",n("task_section_trigger",e),l`
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
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:xa}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>n("environmental_entity_optional",e)}
              .computeHelper=${()=>n("environmental_entity_helper",e)}
              @value-changed=${t=>{this._environmentalEntity=(t.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):p}
          `:p}
    `)}_renderCompletionSection(e){return this._section("completion-section",n("task_section_completion",e),l`
          ${this._type==="reading"?l`
                <ms-textfield
                  label="${n("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${n("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:p}
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
          `:p}
          ${this._partsLoadFailed?l`<div class="field-help parts-load-failed">${n("parts_load_failed",e)}</div>`:p}
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
                              ${t.parts.map(i=>this._renderConsumesRow(i,t.entry_id))}
                            `)}
                        </details>
                      `:p}
                </div>
              `:p}
          <div class="field-label">${n("require_on_completion",e)}</div>
          <div class="required-completion">
            ${Hr.map(t=>l`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(t)}
                  @change=${i=>this._toggleRequired(t,i.target.checked)}
                />
                <span>${n(zt[t],e)}</span>
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
          ${this._requireTagScan?l`<div class="field-help">${n("require_tag_scan_help",e)}</div>`:p}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${t=>this._allowSkip=!t.target.checked}
            />
            <span>${n("disallow_skip",e)}</span>
          </label>
          ${this._allowSkip?p:l`<div class="field-help">${n("disallow_skip_help",e)}</div>`}
          ${this._renderCompleteWhen(e)}
          ${this._renderPhasesEditor(e)}
          ${this._renderCompletionActionsSection(e)}
    `)}_renderPeopleSection(e){return this._section("people-section",n("task_section_people",e),l`
          <div class="select-row">
            <label>${n("responsible_user",e)}</label>
            <select aria-label=${n("responsible_user",e)}
              .value=${this._responsibleUserId||""}
              @change=${t=>{let i=t.target.value;this._responsibleUserId=i||null}}
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
                  ${Xn.map(t=>l`<option value=${t} ?selected=${t===this._rotationStrategy}>${n("rotation_"+t,e)}</option>`)}
                </select>
              </div>`:p}
          `:p}
    `)}_renderNotificationsSection(e){return this._section("notifications-section",n("task_section_notifications",e),l`
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._notifyEnabled}
              @change=${t=>this._notifyEnabled=!t.target.checked}
            />
            <span>${n("no_notifications",e)}</span>
          </label>
          ${this._notifyEnabled?p:l`<div class="field-help">${n("no_notifications_help",e)}</div>`}
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${n("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${t=>this._notifyIcon=t.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||Yr(this._type)}></ha-icon>
            ${n("notify_icon_hint",e).replace("{default}",Yr(this._type))}
          </div>
          ${this._renderMirrorTodo(e)}
    `)}_renderMirrorTodo(e){let t=this.mirrorTodoDefault;if(!t.length)return l`
          <div class="field mirror-todo-field">
            ${this._renderMirrorTodoPicker(e)}
            <div class="field-help">${n("task_mirror_todo_hint",e)}</div>
          </div>`;let i=t.map(o=>String(this.hass?.states?.[o]?.attributes?.friendly_name??o)).join(", "),a={default:n("task_mirror_todo_default",e).replace("{lists}",i),own:n("task_mirror_todo_own",e),none:n("task_mirror_todo_none",e)};return l`
          <div class="field mirror-todo-field">
            <div class="mirror-todo-choice" role="radiogroup" aria-label=${n("task_mirror_todo",e)}>
              <div class="field-label">${n("task_mirror_todo",e)}</div>
              ${Object.keys(a).map(o=>l`
                <label class="mirror-todo-option">
                  <input type="radio" name="mirror-todo" value=${o} .checked=${this._mirrorTodoMode===o}
                    @change=${()=>this._mirrorTodoMode=o} />
                  ${a[o]}
                </label>
              `)}
            </div>
            ${this._mirrorTodoMode==="own"?this._renderMirrorTodoPicker(e):p}
            ${this._mirrorTodoMode!=="none"?l`<div class="field-help">${n("task_mirror_todo_hint",e)}</div>`:p}
          </div>`}_renderMirrorTodoPicker(e){return l`
            ${this._entityPickerFallback?l`
              <ms-textfield
                label="${n("task_mirror_todo",e)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${t=>{this._mirrorTodoEntities=t.target.value.split(",").map(i=>i.trim()).filter(Boolean)}}
              ></ms-textfield>
            `:l`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"]}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>n("task_mirror_todo",e)}
                @value-changed=${t=>{let i=(t.detail.value.mirror_todo_entities||[]).filter(Boolean);this._mirrorTodoEntities=i}}
              ></ha-form>`}`}render(){if(!this._open)return l``;let e=this._lang,t=this._taskId?n("edit_task",e):n("new_task",e),i=this._seriesIndex+1<this._series.length;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">
          ${t}
          ${this._series.length>1?l`<span class="series-position">${n("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length))}</span>`:p}
        </div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:p}
          ${this._warning?l`<div class="error warning">${this._warning}</div>`:p}
          ${this._renderIdentity(e)}
          ${this._renderScheduleSection(e)}
          ${this._renderTriggerSection(e)}
          ${this._renderCompletionSection(e)}
          ${this._renderPeopleSection(e)}
          ${this._renderNotificationsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${n("cancel",e)}</ha-button>
          ${i?l`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${n("task_series_skip",e)}
              </ha-button>`:p}
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}
          >
            ${this._loading?n("saving",e):n(i?"task_series_save_next":"save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};g._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calMonths","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),g.styles=[Ee,wn,$`
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
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
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
  `],d([b({attribute:!1})],g.prototype,"hass",2),d([b({type:Boolean,attribute:"checklists-enabled"})],g.prototype,"checklistsEnabled",2),d([b({type:Boolean,attribute:"schedule-time-enabled"})],g.prototype,"scheduleTimeEnabled",2),d([b({type:Boolean,attribute:"completion-actions-enabled"})],g.prototype,"completionActionsEnabled",2),d([b({type:Boolean,attribute:"adaptive-feature"})],g.prototype,"adaptiveFeature",2),d([b({type:Boolean,attribute:"seasonal-feature"})],g.prototype,"seasonalFeature",2),d([b({type:Boolean,attribute:"environmental-feature"})],g.prototype,"environmentalFeature",2),d([b({type:Number,attribute:"default-warning-days"})],g.prototype,"defaultWarningDays",2),d([b({attribute:!1})],g.prototype,"mirrorTodoDefault",2),d([u()],g.prototype,"parts",2),d([u()],g.prototype,"_foreignOwners",2),d([u()],g.prototype,"_open",2),d([u()],g.prototype,"_entityPickerFallback",2),d([u()],g.prototype,"_loading",2),d([u()],g.prototype,"_error",2),d([u()],g.prototype,"_warning",2),d([u()],g.prototype,"_entryId",2),d([u()],g.prototype,"_taskId",2),d([u()],g.prototype,"_series",2),d([u()],g.prototype,"_seriesIndex",2),d([u()],g.prototype,"_isFleetTask",2),d([u()],g.prototype,"_objectChoices",2),d([u()],g.prototype,"_name",2),d([u()],g.prototype,"_type",2),d([u()],g.prototype,"_scheduleType",2),d([u()],g.prototype,"_intervalDays",2),d([u()],g.prototype,"_intervalUnit",2),d([u()],g.prototype,"_dueDate",2),d([u()],g.prototype,"_warningDays",2),d([u()],g.prototype,"_earliestCompletionDays",2),d([u()],g.prototype,"_intervalAnchor",2),d([u()],g.prototype,"_weekdays",2),d([u()],g.prototype,"_nth",2),d([u()],g.prototype,"_nthWeekday",2),d([u()],g.prototype,"_domDay",2),d([u()],g.prototype,"_domLastDay",2),d([u()],g.prototype,"_domBusiness",2),d([u()],g.prototype,"_calOffset",2),d([u()],g.prototype,"_calMonths",2),d([u()],g.prototype,"_calendarEntity",2),d([u()],g.prototype,"_seasonMonths",2),d([u()],g.prototype,"_endsMode",2),d([u()],g.prototype,"_endsCount",2),d([u()],g.prototype,"_endsUntil",2),d([u()],g.prototype,"_schedulePreview",2),d([u()],g.prototype,"_schedulePreviewEnded",2),d([u()],g.prototype,"_notes",2),d([u()],g.prototype,"_documentationUrl",2),d([u()],g.prototype,"_customIcon",2),d([u()],g.prototype,"_notifyIcon",2),d([u()],g.prototype,"_priority",2),d([u()],g.prototype,"_labels",2),d([u()],g.prototype,"_detailsOpen",2),d([u()],g.prototype,"_mirrorTodoEntities",2),d([u()],g.prototype,"_mirrorTodoMode",2),d([u()],g.prototype,"_completeWhenEntity",2),d([u()],g.prototype,"_completeWhenState",2),d([u()],g.prototype,"_enabled",2),d([u()],g.prototype,"_triggerEntityId",2),d([u()],g.prototype,"_triggerEntityIds",2),d([u()],g.prototype,"_triggerEntityLogic",2),d([u()],g.prototype,"_triggerAttribute",2),d([u()],g.prototype,"_triggerType",2),d([u()],g.prototype,"_triggerAbove",2),d([u()],g.prototype,"_triggerBelow",2),d([u()],g.prototype,"_triggerEquals",2),d([u()],g.prototype,"_triggerNotEquals",2),d([u()],g.prototype,"_triggerForMinutes",2),d([u()],g.prototype,"_triggerCombinator",2),d([u()],g.prototype,"_triggerTargetValue",2),d([u()],g.prototype,"_triggerDeltaMode",2),d([u()],g.prototype,"_triggerBaselineValue",2),d([u()],g.prototype,"_liveBaselineValue",2),d([u()],g.prototype,"_autoCompleteOnRecovery",2),d([u()],g.prototype,"_holdUntilDone",2),d([u()],g.prototype,"_triggerFromState",2),d([u()],g.prototype,"_triggerToState",2),d([u()],g.prototype,"_triggerTargetChanges",2),d([u()],g.prototype,"_triggerRuntimeHours",2),d([u()],g.prototype,"_triggerDaysBefore",2),d([u()],g.prototype,"_triggerRuntimeMaxSession",2),d([u()],g.prototype,"_triggerOnStates",2),d([u()],g.prototype,"_triggerDetailAttribute",2),d([u()],g.prototype,"_compoundLogic",2),d([u()],g.prototype,"_compoundConditions",2),d([u()],g.prototype,"_suggestedAttributes",2),d([u()],g.prototype,"_availableAttributes",2),d([u()],g.prototype,"_entityDomain",2),d([u()],g.prototype,"_lastPerformed",2),d([u()],g.prototype,"_nfcTagId",2),d([u()],g.prototype,"_requireTagScan",2),d([u()],g.prototype,"_allowSkip",2),d([u()],g.prototype,"_notifyEnabled",2),d([u()],g.prototype,"_readingUnit",2),d([u()],g.prototype,"_readings",2),d([u()],g.prototype,"_consumesParts",2),d([u()],g.prototype,"_consumesQtyText",2),d([u()],g.prototype,"_partsLoadFailed",2),d([u()],g.prototype,"_availableTags",2),d([u()],g.prototype,"_responsibleUserId",2),d([u()],g.prototype,"_assigneePool",2),d([u()],g.prototype,"_rotationStrategy",2),d([u()],g.prototype,"_availableUsers",2),d([u()],g.prototype,"_checklistText",2),d([u()],g.prototype,"_phaseDefs",2),d([u()],g.prototype,"_phaseSeq",2),d([u()],g.prototype,"_requiredCompletion",2),d([u()],g.prototype,"_scheduleTime",2),d([u()],g.prototype,"_scheduleTimeOn",2),d([u()],g.prototype,"_actionService",2),d([u()],g.prototype,"_actionTargetEntity",2),d([u()],g.prototype,"_actionSkipAuto",2),d([u()],g.prototype,"_actionPresent",2),d([u()],g.prototype,"_actionData",2),d([u()],g.prototype,"_actionDataJsonFallback",2),d([u()],g.prototype,"_actionTesting",2),d([u()],g.prototype,"_actionTestResult",2),d([u()],g.prototype,"_actionTestError",2),d([u()],g.prototype,"_qcNotes",2),d([u()],g.prototype,"_qcCost",2),d([u()],g.prototype,"_qcDuration",2),d([u()],g.prototype,"_qcFeedback",2),d([u()],g.prototype,"_environmentalEntity",2),d([u()],g.prototype,"_environmentalAttribute",2),d([u()],g.prototype,"_adaptiveEnabled",2),d([u()],g.prototype,"_adaptiveAlpha",2),d([u()],g.prototype,"_adaptiveMin",2),d([u()],g.prototype,"_adaptiveMax",2),d([u()],g.prototype,"_adaptiveSeasonal",2),d([u()],g.prototype,"_adaptivePrediction",2),d([u()],g.prototype,"_conditionAttrOptions",2);Qr=g;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",Qr)});function pc(r,s){r.key!=="Escape"||r.defaultPrevented||r.composedPath().some(e=>e instanceof Element&&e.localName==="ms-camera-capture")||(r.preventDefault(),r.stopPropagation(),s())}function mt(r,s){return l`
    <div class="backdrop" @click=${r}></div>
    <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
      @keydown=${e=>pc(e,r)}>${s}</div>
  `}function gt(r){r?.querySelector(".dialog")?.focus({preventScroll:!0})}var _t,Mi=y(()=>{"use strict";P();_t=$`
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
`});var V,Pa=y(()=>{"use strict";P();D();I();V=class extends S{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel="",this._inputType="",this._options=null,this._inputValue="",this._open=!0,new Promise(t=>{this._resolve=t,this._promptResolve=null})}prompt(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"text",this._options=e.options&&e.options.length?e.options:null,this._inputValue=e.inputValue||"",this._open=!0,new Promise(t=>{this._promptResolve=t,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return p;let e=N(this.hass);return l`
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
          `:p}
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
    `}};V.styles=[Ee,$`
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
  `],d([b({attribute:!1})],V.prototype,"hass",2),d([u()],V.prototype,"_open",2),d([u()],V.prototype,"_title",2),d([u()],V.prototype,"_message",2),d([u()],V.prototype,"_confirmText",2),d([u()],V.prototype,"_danger",2),d([u()],V.prototype,"_inputLabel",2),d([u()],V.prototype,"_inputType",2),d([u()],V.prototype,"_options",2),d([u()],V.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",V)});function uc(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function Ue(r,s){let e=uc(),t=e.querySelector(`${ja}[${Na}]`);return t||(t=document.createElement(ja),t.setAttribute(Na,""),e.appendChild(t)),t.hass=r,t.confirm(s)}var ja,Na,Li=y(()=>{"use strict";Pa();ja="maintenance-confirm-dialog",Na="data-ms-lovelace-confirm"});var Ie,Zr=y(()=>{"use strict";P();D();kr();Ie=class extends S{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await wr(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?p:this._url?l`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:l`<div class="ph"></div>`}};Ie.styles=$`
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
  `,d([b({attribute:!1})],Ie.prototype,"hass",2),d([b()],Ie.prototype,"docId",2),d([u()],Ie.prototype,"_url",2),d([u()],Ie.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",Ie)});var K,Oa=y(()=>{"use strict";P();D();I();me();W();Ht();Mi();zr();Ci();Li();pt();Ri();Zr();Vt();Vt();K=class extends S{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new lt(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return N(this.hass)}openEdit(e){this._openGen++,this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(e.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(e),this._loadPartOptions()}_seedReadings(e){let t=[],i=new Set;for(let o of e.readings??[])i.has(o.id)||(i.add(o.id),t.push({id:o.id,name:o.name,unit:o.unit??null}));for(let o of e.reading_values??[])i.has(o.id)||(i.add(o.id),t.push({id:o.id,name:o.name,unit:o.unit??null}));this._readingRows=t;let a={};for(let o of e.reading_values??[])a[o.id]=String(o.value);this._readingText=a,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let e={};for(let t of this._readingRows){let i=(this._readingText[t.id]??"").trim();if(i==="")continue;let a=parseFloat(i.replace(",","."));isNaN(a)||(e[t.id]=a)}return e}async _loadPartOptions(){let e=this._draft;if(!e)return;let t=this._openGen;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(t!==this._openGen)return;let a=[];for(let c of i.parts||[]){let h=c.entry_id===e.entry_id,_=c.consumers.some(m=>m.entry_id===e.entry_id&&m.task_id===e.task_id);!h&&!_||a.push({part_id:c.part_id,name:c.name,entry_id:c.entry_id,foreign:!h,object_name:c.object_name})}for(let c of e.used_parts||[]){let h=c.entry_id||e.entry_id;a.some(_=>_.part_id===c.part_id&&_.entry_id===h)||a.push({part_id:c.part_id,name:c.name||c.part_id,entry_id:h,foreign:h!==e.entry_id,object_name:null})}let o={};for(let c of e.used_parts||[])o[`${c.entry_id||e.entry_id}:${c.part_id}`]=c.quantity??1;this._partOptions=a,this._partQty=o,this._partQtyOriginal=this._partSelectionKey()}catch{if(t!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,e])=>e>0).sort(([e],[t])=>e.localeCompare(t)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let e=this._lang,i=(this._originalSnapshot.used_parts||[]).filter(h=>h.quantity>0).map(h=>`${j(h.quantity,e)}\xD7 ${h.name||h.part_id}`).join(", ");if(!await Ue(this.hass,{title:n("history_delete_entry",e),message:i?`${n("history_delete_confirm_entry",e)} ${n("history_delete_returns_parts",e).replace("{parts}",i)}`:n("history_delete_confirm_entry",e),confirmText:n("delete",e),danger:!0})||!this._draft||!this._originalSnapshot)return;let o=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:o.entry_id,task_id:o.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:o.entry_id,task_id:o.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(e){return H(this,e,{busy:t=>{this._saving=t},onError:t=>{this._error=t}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let e=this._draft,t=this._originalSnapshot,i={type:"maintenance_supporter/task/history/update",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:t.original_timestamp};if(e.timestamp!==t.timestamp&&(i.timestamp=e.timestamp),e.notes!==t.notes&&(i.notes=e.notes),e.cost!==t.cost&&(i.cost=e.cost),e.duration!==t.duration&&(i.duration=e.duration),e.completed_by!==t.completed_by&&(i.completed_by=e.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(i.used_parts=(this._partOptions||[]).filter(o=>(this._partQty[`${o.entry_id}:${o.part_id}`]||0)>0).map(o=>({part_id:o.part_id,quantity:this._partQty[`${o.entry_id}:${o.part_id}`],...o.foreign?{entry_id:o.entry_id}:{}}))),e.reading_value!==t.reading_value&&(i.reading_value=e.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let o=this._readingNumbers(),c={};for(let h of this._readingRows)c[h.id]=o[h.id]??null;i.reading_values=c}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(i.photo_doc_ids=this._photos.ids),Object.keys(i).filter(o=>!["type","entry_id","task_id","original_timestamp"].includes(o)).length===0){this.close();return}await this._runWs(i)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:e.entry_id,task_id:e.task_id,new_timestamp:e.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return p;let e=this._lang,t=this._draft,i=this._error||this._photos.errorText(e);return mt(()=>this.close(),l`
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
          .helper=${_i(e)}
          .value=${dn(t.timestamp)}
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
              @input=${a=>{this._set("duration",ct(a.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(t,e)}
        ${this._partOptions&&this._partOptions.length>0?l`
          <div class="parts-block">
            <span class="parts-title">${n("complete_parts_used",e)}</span>
            ${this._partOptions.map(a=>{let o=`${a.entry_id}:${a.part_id}`,c=this._partQty[o]||0;return l`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${c>0}
                    @change=${h=>{let _=h.target.checked;this._partQty={...this._partQty,[o]:_?1:0}}} />
                  <span class="part-label">${a.name}${a.foreign&&a.object_name?` (${a.object_name})`:""}</span>
                  ${c>0?l`
                    <input class="part-qty" type="number" min=${Ae[0]} max=${Ae[1]} step="0.01"
                      .value=${String(c)}
                      @input=${h=>{let _=parseFloat(h.target.value);!isNaN(_)&&_>0&&(this._partQty={...this._partQty,[o]:_})}} />
                  `:p}
                </label>
              `})}
          </div>
        `:p}
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
            </div>`:p}
          ${this._photos.full?l`<span class="photos-hint">${n("photos_limit",e).replace("{max}",String(this._photos.max))}</span>`:l`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${a=>this._photos.addFiles(a.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${n("history_edit_photos_hint",e)}</span>
        </div>
        ${i?l`<div class="error">${i}</div>`:p}
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
    `)}updated(e){e.has("_open")&&this._open&&gt(this.shadowRoot)}_renderReadings(e,t){return this._readingRows.length>0?l`
        <div class="readings-block">
          <span class="parts-title">${n("readings_section",t)}</span>
          ${this._readingRows.map(i=>l`
            <label class="reading-row-edit">
              <span class="reading-row-name">${i.name}${i.unit?` (${i.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[i.id]??""}
                @input=${a=>{this._readingText={...this._readingText,[i.id]:a.target.value}}} />
            </label>
          `)}
        </div>`:e.reading_value==null&&e.task_type!=="reading"?p:l`
      <label>
        <span>${n("reading_value_label",t)}${e.reading_unit?` (${e.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${e.reading_value!=null?String(e.reading_value):""}
          @input=${i=>{let a=i.target.value,o=a===""?NaN:Number(a);this._set("reading_value",isNaN(o)?null:o)}} />
      </label>`}};K.styles=[Pi,_t,$`
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
  `],d([b({attribute:!1})],K.prototype,"hass",2),d([u()],K.prototype,"_open",2),d([u()],K.prototype,"_saving",2),d([u()],K.prototype,"_error",2),d([u()],K.prototype,"_draft",2),d([u()],K.prototype,"_partOptions",2),d([u()],K.prototype,"_partQty",2),d([u()],K.prototype,"_readingRows",2),d([u()],K.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",K)});function Pe(r){return String(r??"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[s])}var Ma=y(()=>{"use strict"});function Jr(r){return!r.startsWith("data:image/svg+xml,")&&!r.startsWith("data:image/png;base64,")?"":Pe(r)}function hc(r){return r.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var Y,La=y(()=>{"use strict";P();D();I();xr();Ma();Y=class extends S{constructor(){super(...arguments);this.lang="";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._quickResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}get _dialogLang(){return this.lang||N(this.hass)}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}openForTask(e,t,i,a){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=a,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...t,action:"view"})];this._taskId&&(i.push(this.hass.connection.sendMessagePromise({...t,action:"complete"})),await this._hasQuickCompleteDefaults()&&i.push(this.hass.connection.sendMessagePromise({...t,action:"quick_complete"})));let a=await Promise.all(i);if(e!==this._generateSeq)return;this._viewResult=a[0],a.length>1&&(this._completeResult=a[1]),a.length>2&&(this._quickResult=a[2])}catch(t){if(e!==this._generateSeq)return;let i=t?.code,a=t?.message;this._error=i==="no_url"||typeof a=="string"&&a.includes("No Home Assistant URL")?n("qr_error_no_url",this._dialogLang):n("qr_error",this._dialogLang)}finally{e===this._generateSeq&&(this._loading=!1)}}async _hasQuickCompleteDefaults(){try{let t=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId})).tasks||[]).find(i=>i.id===this._taskId);return!!t?.quick_complete_defaults&&Object.keys(t.quick_complete_defaults).length>0}catch{return!1}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),a=window.open("","_blank","width=600,height=500");if(!a)return;let o=this._dialogLang,c=Pe(t),h=Pe(i),_=!!this._completeResult,m=!!this._quickResult,f=Pe(n("qr_action_view",o)),w=Pe(n("qr_action_complete",o)),x=Pe(n("qr_action_quick_complete",o));a.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
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
${h?`<div class="sub">${h}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${Jr(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${f}</div>
  </div>
  ${_?`<div class="qr-col">
    <img src="${Jr(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${w}</div>
  </div>`:""}
  ${m?`<div class="qr-col">
    <img src="${Jr(this._quickResult.svg_data_uri)}" alt="QR Quick-complete" />
    <div class="qr-label">${x}</div>
  </div>`:""}
</div>
<div class="url">${Pe(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),a.document.close()}_downloadSvg(e,t){let i=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),a=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;kn(i,`qr-${hc(a)}-${t}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._quickResult=null,this._error="",this._loading=!1}render(){if(!this._open)return l``;let e=this._dialogLang,t=this._taskName?`${n("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${n("qr_code",e)}: ${this._objectName}`,i=!!this._viewResult;return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._loading?l`<div class="loading">${n("qr_generating",e)}</div>`:this._error?l`<div class="error">${this._error}</div>`:i?l`
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
                          `:p}
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
                          `:p}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:p}
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
            .disabled=${!i}
          >
            ${n("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};Y.styles=$`
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
  `,d([b({attribute:!1})],Y.prototype,"hass",2),d([b()],Y.prototype,"lang",2),d([u()],Y.prototype,"_open",2),d([u()],Y.prototype,"_loading",2),d([u()],Y.prototype,"_error",2),d([u()],Y.prototype,"_viewResult",2),d([u()],Y.prototype,"_completeResult",2),d([u()],Y.prototype,"_quickResult",2),d([u()],Y.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",Y)});function Ha(r,s,e=new Date){let t=r?.hours,i=U(r?.snoozed_until);if(typeof t!="number"||!Number.isFinite(i))return n("snoozed",s);let a=ke(),c=$e(i,a)===$e(e,a)?ui(new Date(i),s):hi(r.snoozed_until,s);return pi("snoozed_for","snoozed_for_one",t,s,"hours").replace("{until}",c)}var Da=y(()=>{"use strict";I();W()});var wm,qa,za=y(()=>{Ke();({I:wm}=Ps),qa=r=>r.strings===void 0});var Fa,Xr,Hi,Di=y(()=>{Fa={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Xr=r=>(...s)=>({_$litDirective$:r,values:s}),Hi=class{constructor(s){}get _$AU(){return this._$AM._$AU}_$AT(s,e,t){this._$Ct=s,this._$AM=e,this._$Ci=t}_$AS(s,e){return this.update(s,e)}update(s,e){return this.render(...e)}}});function _c(r){this._$AN!==void 0?(qi(this),this._$AM=r,Ua(this)):this._$AM=r}function mc(r,s=!1,e=0){let t=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(s)if(Array.isArray(t))for(let a=e;a<t.length;a++)Gt(t[a],!1),qi(t[a]);else t!=null&&(Gt(t,!1),qi(t));else Gt(this,r)}var Gt,qi,Ua,gc,zi,Ba=y(()=>{za();Di();Di();Gt=(r,s)=>{let e=r._$AN;if(e===void 0)return!1;for(let t of e)t._$AO?.(s,!1),Gt(t,s);return!0},qi=r=>{let s,e;do{if((s=r._$AM)===void 0)break;e=s._$AN,e.delete(r),r=s}while(e?.size===0)},Ua=r=>{for(let s;s=r._$AM;r=s){let e=s._$AN;if(e===void 0)s._$AN=e=new Set;else if(e.has(r))break;e.add(r),gc(s)}};gc=r=>{r.type==Fa.CHILD&&(r._$AP??=mc,r._$AQ??=_c)},zi=class extends Hi{constructor(){super(...arguments),this._$AN=void 0}_$AT(s,e,t){super._$AT(s,e,t),Ua(this),this.isConnected=s._$AU}_$AO(s,e=!0){s!==this.isConnected&&(this.isConnected=s,s?this.reconnected?.():this.disconnected?.()),e&&(Gt(this,s),qi(this))}setValue(s){if(qa(this._$Ct))this._$Ct._$AI(s,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=s,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}});var es,Wa,Va=y(()=>{Ke();Ba();Di();es=new WeakMap,Wa=Xr(class extends zi{render(r){return p}update(r,[s]){let e=s!==this.G;return e&&this.G!==void 0&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=s,this.ht=r.options?.host,this.rt(this.ct=r.element)),p}rt(r){if(this.isConnected||(r=void 0),typeof this.G=="function"){let s=this.ht??globalThis,e=es.get(s);e===void 0&&(e=new WeakMap,es.set(s,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,r),r!==void 0&&this.G.call(this.ht,r)}else this.G.value=r}get lt(){return typeof this.G=="function"?es.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}})});var Ga=y(()=>{Va()});function Ui(r){if(!r)return p;if(customElements.get("ha-markdown")){let{content:s,links:e}=bc(r);return l`<ha-markdown
      class="notes-md"
      .content=${s}
      breaks
      ${Wa(t=>yc(t,e))}
    ></ha-markdown>`}return l`${r}`}function bc(r){let s=[],e=a=>{let o=Er(a);return!o||fc.has(o)||!et(a)?null:(s.push($r(a)),`${is}${s.length-1}`)},t=a=>a.replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)<(${Fi}[^>\\n]*)>`,"g"),(o,c,h,_)=>{let m=c?null:e(_);return m?`${h}${m}`:o}).replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)(${Fi}[^\\s)]*)`,"g"),(o,c,h,_)=>{let m=c?null:e(_);return m?`${h}${m}`:o}).replace(new RegExp(`(^|[^(])<(${Fi}[^\\s<>]*)>`,"gm"),(o,c,h)=>{let _=e(h);return _?`${c}[${h.replace(/([\\[\]])/g,"\\$1")}](${_})`:o}).replace(new RegExp(`^( {0,3}\\[[^\\]\\n]+\\]:[ \\t]*)<?(${Fi}[^\\s>]*)>?`,"gm"),(o,c,h)=>{let _=e(h);return _?`${c}${_}`:o});return{content:r.split(vc).map((a,o)=>o%2?a:t(a)).join(""),links:s}}function ts(r,s){for(let e of r.querySelectorAll(`a[href^="${is}"]`)){let t=s[Number(e.getAttribute("href").slice(is.length))];t&&e.setAttribute("href",t)}}function yc(r,s){if(!r)return;let e=Ka.get(r);if(!e&&s.length===0)return;if(e){e.links=s,r.shadowRoot&&ts(r.shadowRoot,s);return}let t={links:s};Ka.set(r,t),(async()=>{await r.updateComplete;let i=r.shadowRoot;i&&(new MutationObserver(()=>ts(i,t.links)).observe(i,{childList:!0,subtree:!0}),ts(i,t.links))})()}var is,fc,vc,Fi,Ka,rs=y(()=>{"use strict";P();Ga();vi();is="https://app-link.invalid/",fc=new Set(["http","https","mailto","tel","ftp"]),vc=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/,Fi="[a-zA-Z][a-zA-Z0-9+.-]+:";Ka=new WeakMap});var Ya=y(()=>{"use strict"});function Qa(r,s,e,t){let i=e,a=h=>typeof h=="string"?h:null,o=h=>typeof h=="number"?h:null,c=a(i.timestamp)??"";return{entry_id:r,task_id:s,original_timestamp:c,type:a(i.type)||"completed",timestamp:c,notes:a(i.notes),cost:o(i.cost),duration:o(i.duration),completed_by:a(i.completed_by),used_parts:Array.isArray(i.used_parts)?i.used_parts:null,photo_doc_ids:Ft(i),reading_value:o(i.reading_value),reading_values:Te(i),readings:t?.readings??[],task_type:t?.type??null,reading_unit:t?.reading_unit??null}}var Za=y(()=>{"use strict";Ut();ze();Ya()});function xc(r){return r&&Ja(r.ref_no)?String(r.ref_no):null}function Xa(r,s){let e=xc(r);return e&&s&&Ja(s.ref_no)?`${e}.${s.ref_no}`:null}function eo(r,s){return r?l`<span class="ref-chip" title=${s??""}>#${r}</span>`:p}var Ja,ss=y(()=>{"use strict";P();Ja=r=>typeof r=="number"&&Number.isInteger(r)&&r>0});var ns=y(()=>{"use strict"});function to(r,s){if(!r)return"";let e=wc[r.trim()];if(e)return n(e,s);for(let[t,i,a]of kc){let o=r.trim().match(t);if(o){let c=a(o,s);return n(i,s).replace(/\{(\w+)\}/g,(h,_)=>c[_]??h)}}return r}var wc,kc,io=y(()=>{"use strict";I();wc={"Completed from dashboard button":"hist_note_button","Auto-completed: sensor recovered":"hist_note_auto_recovered_plain","Completed from the To-do list":"hist_note_todo","Completed by voice":"hist_note_voice","Completed from the notification":"hist_note_notification","Completed via NFC tag":"hist_note_nfc","Completed from the shopping list":"hist_note_shopping_list","Completed from a mirrored to-do list":"hist_note_todo_mirror","Skipped from notification":"hist_note_skipped_notification","Skipped from dashboard button":"hist_note_skipped_button","Sensor trigger activated":"hist_note_sensor_triggered","Initial value set during task creation":"hist_note_initial"},kc=[[/^Auto-completed: sensor recovered \((.+)\)$/,"hist_note_auto_recovered",r=>({value:r[1]})],[/^Auto-completed: (.+) changed to (.+)$/,"hist_note_auto_entity",r=>({entity:r[1],state:r[2]})],[/^Reset to (\d{4}-\d{2}-\d{2})$/,"hist_note_reset",(r,s)=>({date:M(r[1],s)})],[/^Trigger entity replaced: (.+) → (.+)$/,"hist_note_trigger_replaced",r=>({old:r[1],new:r[2]})],[/^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,"hist_note_trigger_removed",(r,s)=>({entity:r[1],schedule:n(r[2],s)})],[/^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,"hist_note_compound_removed",r=>({entity:r[1],count:r[2]})]]});function ro(r){let s=e=>{let t=U(e.timestamp);return Number.isNaN(t)?-1/0:t};return(r??[]).map((e,t)=>({entry:e,index:t,at:s(e)})).sort((e,t)=>t.at-e.at||t.index-e.index).map(e=>e.entry)}function Ec(r,s){return r.taskRef&&s.ref_no?`${r.taskRef}-${s.ref_no}`:null}function Sc(r,s){let e=Ft(s);return e.length>0?l`<div class="history-photos">
        ${e.map(t=>l`<maintenance-history-photo .hass=${r} .docId=${t}></maintenance-history-photo>`)}
      </div>`:p}function Tc(r,s){let e=s.lang,t=o=>j(o,e,{maximumFractionDigits:3}),i=o=>o==null?"":` (${o>=0?"+":""}${t(o)})`,a=Te(r);return a.length>0?l`<div class="history-readings">
      ${a.map(o=>l`<span class="history-reading">
        <span class="history-reading-name">${o.name}</span>
        <span class="history-reading-value">${t(o.value)}${o.unit?` ${o.unit}`:""}${i(s.readingSlotDelta?.(r,o.id))}</span>
      </span>`)}
    </div>`:r.reading_value!=null?l`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${n("reading_label",e)}</span>
      <span class="history-reading-value">${t(r.reading_value)}${s.readingUnit?` ${s.readingUnit}`:""}${i(s.readingDelta?.(r))}</span>
    </span></div>`:p}function so(r,s,e={}){let t=s.lang,{compact:i=!1,showRef:a=!0,showBadges:o=!0,showEdit:c=!0}=e,h=s.openEdit,_=c&&!!h&&Ys.includes(r.type),m=typeof r.parts_cost=="number"?r.parts_cost:null,f=r.cost_basis==="use",w=f&&!!r.purchase;return l`
    <div class="history-entry${i?" compact":""}">
      ${i?p:l`<div class="history-icon ${r.type}" style="background: ${rr(r.type)}">
            <ha-icon .icon=${At[r.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${n(r.type,t)}</strong>
          ${a?eo(Ec(s,r),n("ref_number",t)):p}
          ${o&&r.phase_id?l`<span class="history-phase-badge">${s.phaseNames?.[r.phase_id]||r.phase_id}</span>`:p}
          ${o&&r.auto?l`<span class="history-auto-badge">${n("history_auto",t)}</span>`:p}
          ${_?l`<button class="history-edit-btn"
                     title=${n("history_edit_button",t)}
                     @click=${()=>h(r)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:p}
        </div>
        <div class="history-date">${hi(r.timestamp,t)}</div>
        ${r.notes?l`<div class="history-notes">${to(r.notes,t)}</div>`:p}
        ${Sc(s.hass,r)}
        ${Tc(r,s)}
        ${r.cost!=null||r.duration!=null||r.trigger_value!=null||m!=null?l`<div class="history-details">
              ${r.cost!=null?w?l`<span>${n("history_purchase_stock",t).replace("{amount}",ie(r.cost,s.currencySymbol,t))}</span>`:r.cost<0?l`<span class="history-credit">${fn(r.cost,s.currencySymbol,t)}</span>`:l`<span>${n("cost",t)}: ${ie(r.cost,s.currencySymbol,t)}</span>`:p}
              ${m!=null?l`<span title=${n(f?"history_parts_counted_hint":"history_parts_info_hint",t)}>${n(f?"history_parts_counted":"history_parts_info",t).replace("{amount}",ie(m,s.currencySymbol,t))}</span>`:p}
              ${r.duration!=null?l`<span>${n("duration",t)}: ${gi(r.duration,t)}</span>`:p}
              ${r.trigger_value!=null?l`<span>${n("trigger_val",t)}: ${r.trigger_value}</span>`:p}
            </div>`:p}
      </div>
    </div>
  `}var no=y(()=>{"use strict";P();I();Zr();Ut();ss();ze();ns();io();W();Qe()});var Bi,ao=y(()=>{"use strict";Bi=class{constructor(){this._handle=null}schedule(s,e=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,s()},e)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}}});function oo(r,s){let e=r.interval_analysis,t=e?.weibull_beta,i=e?.weibull_eta;if(t==null||i==null||i<=0)return p;let a=r.interval_days??0,o=r.suggested_interval??a;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${n("weibull_reliability_curve",s)}
        ${Ac(t,s)}
      </div>
      ${Cc(t,i,a,o,s)}
      ${Rc(e,s)}
      ${e?.confidence_interval_low!=null?Ic(e,r,s):p}
    </div>
  `}function Ac(r,s){let e,t,i;return r<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):r<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):r<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),l`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${n(i,s)} (\u03B2=${j(r,s,2)})
    </span>
  `}function Cc(r,s,e,t,i){let x=Math.max(e,t,s,1)*1.3,R=50,k=[];for(let J=0;J<=R;J++){let se=J/R*x,jo=1-Math.exp(-Math.pow(se/s,r)),No=32+se/x*260,Oo=136-jo*128;k.push([No,Oo])}let E=k.map(([J,se])=>`${C(J)},${C(se)}`).join(" "),v="M32,136 "+k.map(([J,se])=>`L${C(J)},${C(se)}`).join(" ")+` L${C(k[R][0])},136 Z`,A=32+e/x*260,ce=1-Math.exp(-Math.pow(e/s,r)),We=136-ce*128,Io=j((1-ce)*100,i,0),_s=32+t/x*260,Po=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_weibull",i)}">
        ${Po.map(J=>{let se=136-J*128;return Ge`
            <line x1="${32}" y1="${C(se)}" x2="${292}" y2="${C(se)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${J===.5?"4,3":p}" />
            <text x="${28}" y="${C(se+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${j(J*100,i,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x)}</text>

        <path d="${v}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${E}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?Ge`
          <line x1="${C(A)}" y1="${8}" x2="${C(A)}" y2="${C(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${C(A)}" cy="${C(We)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${C(A+4)}" y="${C(We-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Io}%</text>
        `:p}

        ${t>0&&t!==e?Ge`
          <line x1="${C(_s)}" y1="${8}" x2="${C(_s)}" y2="${C(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:p}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${n("weibull_failure_probability",i)}</span>
      ${e>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${n("current_interval_marker",i)}</span>`:p}
      ${t>0&&t!==e?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${n("recommended_marker",i)}</span>`:p}
    </div>
  `}function Rc(r,s){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${n("characteristic_life",s)}</span>
        <span class="weibull-info-value">${Math.round(r.weibull_eta)} ${n("days",s)}</span>
      </div>
      ${r.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${n("weibull_r_squared",s)}</span>
          <span class="weibull-info-value">${j(r.weibull_r_squared,s,3)}</span>
        </div>
      `:p}
    </div>
  `}function Ic(r,s,e){let t=r.confidence_interval_low,i=r.confidence_interval_high,a=s.suggested_interval??s.interval_days??0,o=s.interval_days??0,c=Math.max(0,t-5),_=i+5-c,m=(t-c)/_*100,f=(i-t)/_*100,w=(a-c)/_*100,x=o>0?(o-c)/_*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${n("confidence_interval",e)}: ${a} ${n("days",e)} (${t}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${C(m)}%;width:${C(f)}%"></div>
        ${x>=0?l`<div class="confidence-marker current" style="left:${C(x)}%"></div>`:p}
        <div class="confidence-marker recommended" style="left:${C(w)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${n("confidence_conservative",e)} (${t}${n("days",e).charAt(0)})</span>
        <span class="confidence-text high">${n("confidence_aggressive",e)} (${i}${n("days",e).charAt(0)})</span>
      </div>
    </div>
  `}var lo=y(()=>{"use strict";P();I();qt()});function co(r,s,e){let t=r.degradation_trend!=null&&r.degradation_trend!=="insufficient_data",i=r.days_until_threshold!=null,a=r.environmental_factor!=null&&r.environmental_factor!==1;if(!t&&!i&&!a)return p;let o=r.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":r.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${r.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${n("sensor_prediction_urgency",s).replace("{days}",String(Math.round(r.days_until_threshold||0)))}
        </div>
      `:p}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${n("sensor_prediction",s)}
      </div>
      <div class="prediction-grid">
        ${t?l`
          <div class="prediction-item">
            <ha-svg-icon path="${o}"></ha-svg-icon>
            <span class="prediction-label">${n("degradation_trend",s)}</span>
            <span class="prediction-value ${r.degradation_trend}">${n("trend_"+r.degradation_trend,s)}</span>
            ${r.degradation_rate!=null?l`<span class="prediction-rate">${r.degradation_rate>0?"+":""}${j(r.degradation_rate,s,Math.abs(r.degradation_rate)>=10?0:1)} ${r.trigger_entity_info?.unit_of_measurement||""}/${n("day_short",s)}</span>`:p}
          </div>
        `:p}
        ${i?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${n("days_until_threshold",s)}</span>
            <span class="prediction-value prediction-days${r.days_until_threshold===0?" exceeded":r.sensor_prediction_urgency?" urgent":""}">${r.days_until_threshold===0?n("threshold_exceeded",s):"~"+Math.round(r.days_until_threshold)+" "+n("days",s)}</span>
            ${r.threshold_prediction_date?l`<span class="prediction-date">${M(r.threshold_prediction_date,s)}</span>`:p}
            ${r.threshold_prediction_confidence?l`<span class="confidence-dot ${r.threshold_prediction_confidence}"></span>`:p}
            ${(r.prediction_cycles??0)>0?l`<span class="prediction-cycles">${n("prediction_cycles",s)}: ${r.prediction_cycles}</span>`:p}
          </div>
        `:p}
        ${a&&e.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${n("environmental_adjustment",s)}</span>
            <span class="prediction-value">${j(r.environmental_factor,s,2)}x</span>
            ${r.environmental_entity?l`<span class="prediction-entity entity-link" @click=${c=>xn(c,r.environmental_entity)}>${r.environmental_entity}</span>`:p}
          </div>
        `:p}
      </div>
    </div>
  `}var po=y(()=>{"use strict";P();I()});function uo(r,s,e,t){let i=Math.max(r||1,s);return l`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${n("current",t)}: ${r??"\u2014"} ${r!=null?n("days",t):""}
        </div>
        <div class="interval-visual current"
          style="width: ${r!=null?Math.min(r/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${n("recommended",t)}: ${s} ${n("days",t)}
          <span class="confidence-badge ${e}">${n(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(s/i*100,100)}%"></div>
      </div>
    </div>
  `}var ho=y(()=>{"use strict";P();I()});function mo(){return Number(he().slice(5,7))-1}function go(r,s,e){if(!e.seasonal||!r.seasonal_factor||r.seasonal_factor===1)return p;let t=_o.map(c=>n(c,s)),i=mo(),a=r.seasonal_factors||r.interval_analysis?.seasonal_factors||null,o=a&&a.length===12?a:t.map((c,h)=>{let _=r.seasonal_factor||1,m=Math.sin((h-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,_+m))});return l`
    <div class="seasonal-card-compact">
      <h4>${n("seasonal_awareness",s)}</h4>
      <div class="seasonal-mini-chart">
        ${o.map((c,h)=>{let _=c*40,m=c<.9?"low":c>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${m} ${h===i?"current":""}"
                 style="height: ${_}px"
                 title="${t[h]}: ${j(c,s,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${n("shorter",s)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${n("normal",s)}</span>
        <span class="legend-item"><span class="dot high"></span> ${n("longer",s)}</span>
      </div>
    </div>
  `}function fo(r,s){return Pc(r,s)}function Pc(r,s){let e=r.seasonal_factors??r.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return p;let t=r.interval_analysis?.seasonal_reason,i=mo(),a=300,o=100,c=8,_=o-c-4,m=Math.max(...e,1.5),f=a/12,w=f*.65,x=c+_-1/m*_;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${n("seasonal_chart_title",s)}
        ${t?l`<span class="source-tag">${t==="learned"?n("seasonal_learned",s):n("seasonal_manual",s)}</span>`:p}
      </div>
      <svg viewBox="0 0 ${a} ${o}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_seasonal",s)}">
        <line x1="0" y1="${C(x)}" x2="${a}" y2="${C(x)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((R,k)=>{let E=R/m*_,v=k*f+(f-w)/2,A=c+_-E,ce=k===i,We=R<1?"var(--success-color, #4caf50)":R>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return Ge`
            <rect x="${C(v)}" y="${C(A)}"
              width="${C(w)}" height="${C(E)}"
              fill="${We}" opacity="${ce?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${_o.map((R,k)=>l`<span class="seasonal-label ${k===i?"active-month":""}">${n(R,s)}</span>`)}
      </div>
    </div>
  `}var _o,vo=y(()=>{"use strict";P();I();qt();W();_o=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"]});var L,bo=y(()=>{"use strict";P();D();I();me();Da();Mi();W();Si();xi();rs();Za();ze();ss();no();Ti();at();rt();Li();ao();lo();po();ho();pt();Ni();vo();L=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1};this._toast="";this._toastTimer=new Bi;this._access=_e;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return N(this.hass)}async openFor(e,t){(e!==this._entryId||t!==this._taskId)&&(this._task=null),this._entryId=e,this._taskId=t,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=he(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let e=await G(this.hass);this._features={...this._features,...e.features},this._access=e.access,this._currencySymbol=qe(e.budget??void 0),di(e.budget??void 0),this._partsCostMode=e.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(e,t){this._toast=e,this._toastTimer.schedule(()=>{this._toast=""},t)}async _loadTask(){let e=this._entryId,t=this._taskId;if(!e||!t)return;let i=++this._loadSeq,a="",o=await H(this,{type:"maintenance_supporter/object",entry_id:e},{onError:h=>{a=h}});if(i!==this._loadSeq)return;if(o===void 0){this._error=a;return}this._objectName=o?.object?.name||"";let c=(o?.tasks||[]).find(h=>h.id===t);this._task=c??null,this._taskRef=Xa(o?.object,c),c||(this._error=n("ws_err_not_found",this._lang))}_runWs(e){return this._error="",H(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(le(),fe)).then(async({openCompleteDialog:e})=>{let t=this._task,i=[];try{i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}e($i({entryId:this._entryId,taskId:this._taskId,taskName:t.name,task:t,objects:i,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:Ha(e,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||Promise.resolve().then(()=>(le(),fe)).then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(le(),fe)).then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId||!await Ue(this.hass,{title:n("delete",this._lang),message:n("delete_task_confirm",this._lang),confirmText:n("delete",this._lang),danger:!0}))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(n("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._showToast(e?.recommended_interval?`${n("reanalyze_result",this._lang)}: ${Pt(e.recommended_interval,"days",this._lang)} (${e.data_points} ${n("data_points",this._lang)})`:n("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(e){if(!this._entryId||!this._taskId)return;let t=Qa(this._entryId,this._taskId,e,this._task);Promise.resolve().then(()=>(le(),fe)).then(({openHistoryEditDialog:i})=>i(t))}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return p;let t=this._lang;return l`
      <div class="recommendation-card">
        <h4>${n("suggested_interval",t)}</h4>
        ${uo(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",t)}
        <div class="recommendation-actions">
          ${ae(this.hass?.user,this._access)?l`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${n("apply_suggestion",t)}
              </button>`:p}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${n("reanalyze",t)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(e){let t=this._lang,i=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,a=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,o=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!i&&!a&&!o&&!c?l`<div class="adaptive-empty">
        ${n("adaptive_no_data",t)}
      </div>`:l`
      <div class="adaptive-stack">
        ${this._toast?l`<div class="toast">${this._toast}</div>`:p}
        ${i?this._renderRecommendation(e):p}
        ${a?co(e,t,this._features):p}
        ${o?oo(e,t):p}
        ${c?l`
          ${go(e,t,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?fo(e,t):p}
        `:p}
      </div>
    `}_renderDetails(e){let t=this._lang,i=e.history||[],a=e.history_count??i.length,o=ro(i).slice(0,20);return l`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${n("times_performed",t)}</span>
            <span class="stat-value">${e.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${n("total_cost",t)}</span>
            <span class="stat-value">${ie(e.total_cost??0,this._currencySymbol,t)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${n("avg_duration",t)}</span>
            <span class="stat-value">${gi(e.average_duration!=null?Math.round(e.average_duration):null,t)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${n("history",t)}</strong>
          <span class="history-count">${a}</span>
        </div>
        ${i.length===0?l`<div class="history-empty">${n("history_empty",t)}</div>`:l`
              <div class="history-list">
                ${o.map(c=>so(c,{lang:t,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:ae(this.hass?.user,this._access)?h=>this._onEditHistoryEntry(h):void 0,readingUnit:e.reading_unit,readingSlotDelta:(h,_)=>Mn(i,h,_),taskRef:this._taskRef},{compact:!0}))}
                ${a>o.length?l`<div class="history-more">… +${a-o.length} ${n("older_entries",t)}</div>`:p}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return p;let e=this._lang,t=this._task,i=ae(this.hass?.user,this._access),a=!!t&&(!!t.archived||t.enabled===!1||t.status==="paused");return mt(()=>this.close(),l`
        ${t?l`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${ot(t)}"></span>
                  <span class="task-name">${t.name}</span>
                  ${Qn(t,e)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&Promise.resolve().then(()=>(le(),fe)).then(({openObjectQuickActions:o})=>{o(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${t.next_due?l`<span><strong>${n("next_due",e)}:</strong> ${M(t.next_due,e)}</span>`:p}
                  ${t.last_performed?l`<span><strong>${n("last_performed",e)}:</strong> ${M(t.last_performed,e)}</span>`:p}
                  ${t.schedule?.kind&&!["manual","one_time"].includes(t.schedule.kind)||t.interval_days!=null?l`<span><strong>${n("interval",e)}:</strong> ${yn(t,e)}</span>`:p}
                  ${Se(t)?l`<span><strong>${n("phase_current",e)}:</strong> ${Se(t)}</span>`:p}
                </div>
                ${t.notes?l`<div class="notes-body">${Ui(t.notes)}</div>`:p}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:p}

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
                          `:p}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${n("reset",e)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${i?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${n("edit",e)}
                          </ha-button>`:p}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${n("qr_code",e)}
                      </ha-button>
                      ${a?p:l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${n("postpone",e)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${n("snooze",e)}
                          </ha-button>`}
                      ${i?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${t.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${t.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${t.archived?n("unarchive",e):n("archive",e)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${n("delete",e)}
                          </ha-button>`:p}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?n("hide_details",e):n("show_details",e)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?l`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?n("hide_stats",e):n("show_stats",e)}
                          </button>`:p}
                    </div>
                    ${this._showDetails?this._renderDetails(t):p}
                    ${this._showAdaptive?this._renderAdaptive(t):p}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${n("open_in_panel",e)}
                      </button>
                    </div>
                  `}
            `:this._error?l`<div class="error">${this._error}</div>`:l`<div class="loading">${n("loading",e)}</div>`}
    `)}updated(e){e.has("_open")&&this._open&&gt(this.shadowRoot)}};L.styles=[fi,_t,$`
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
  `],d([b({attribute:!1})],L.prototype,"hass",2),d([u()],L.prototype,"_open",2),d([u()],L.prototype,"_entryId",2),d([u()],L.prototype,"_taskId",2),d([u()],L.prototype,"_task",2),d([u()],L.prototype,"_objectName",2),d([u()],L.prototype,"_taskRef",2),d([u()],L.prototype,"_busy",2),d([u()],L.prototype,"_error",2),d([u()],L.prototype,"_showSkip",2),d([u()],L.prototype,"_showReset",2),d([u()],L.prototype,"_showPostpone",2),d([u()],L.prototype,"_showDetails",2),d([u()],L.prototype,"_showAdaptive",2),d([u()],L.prototype,"_skipReason",2),d([u()],L.prototype,"_resetDate",2),d([u()],L.prototype,"_postponeDate",2),d([u()],L.prototype,"_features",2),d([u()],L.prototype,"_toast",2),d([u()],L.prototype,"_access",2),d([u()],L.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",L)});var yo=y(()=>{"use strict";Ut();Nt();W()});function xo(r,s,e){return r&&s?.[r]?.name||e}var wo=y(()=>{"use strict";W();yo();ns()});function ko(r){if(r.key!=="Enter"&&r.key!==" ")return;let e=r.target?.closest?.('[role="menuitem"], [role="button"]');!e||e.getAttribute("aria-disabled")==="true"||(r.preventDefault(),e.click())}var $o=y(()=>{"use strict"});var re,Eo=y(()=>{"use strict";P();vi();rs();D();I();wo();me();Ti();at();rt();Li();Mi();$o();re=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=_e;this._loadSeq=0}get _lang(){return N(this.hass)}async openFor(e){e!==this._entryId&&(this._data=null),this._entryId=e,this._error="",this._open=!0,await Promise.all([this._load(),G(this.hass).then(t=>{this._access=t.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let e=this._entryId;if(!e)return;let t=++this._loadSeq,i="",a=await H(this,{type:"maintenance_supporter/object",entry_id:e},{onError:o=>{i=o}});t===this._loadSeq&&(a===void 0?this._error=i:this._data=a)}_runWs(e){return this._error="",H(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_onEditObject(){!this._entryId||!this._data||Promise.resolve().then(()=>(le(),fe)).then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&Promise.resolve().then(()=>(le(),fe)).then(({openCreateTaskDialog:e})=>{e(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await Ue(this.hass,{title:n("delete",this._lang),message:n("delete_object_confirm",this._lang),confirmText:n("delete",this._lang),danger:!0}))return;let t=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let e=!!this._data.object.archived;if(!e&&!await Ue(this.hass,{title:n("archive_object",this._lang),message:n("confirm_archive_object",this._lang),confirmText:n("archive_object",this._lang)}))return;let t=this._entryId;await this._runWs({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}_onTaskClick(e){this._entryId&&Promise.resolve().then(()=>(le(),fe)).then(({openTaskQuickActions:t})=>{t(this._entryId,e)})}render(){if(!this._open)return p;let e=this._lang,t=this._data,i=t?.object,a=t?.tasks||[],o=ae(this.hass?.user,this._access);return mt(()=>this.close(),l`
        ${t&&i?l`
              <div class="header">
                <div class="title">${i.name}</div>
                ${this._renderMetaRow(i)}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:p}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${n("tasks",e)}</strong>
                  <span class="count">${a.length}</span>
                </div>
                ${a.length===0?l`<div class="empty">${n("no_tasks",e)}</div>`:l`
                      <div class="task-list">
                        ${a.map(c=>l`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(c.id)} @keydown=${ko}>
                            <span class="status-dot" style="background: ${ot(c)}"></span>
                            <span class="task-name">${c.name}</span>
                            <span class="task-status ${Dt(c)}">${jr(Dt(c),e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?l`
                    <div class="notes-section">
                      <strong>${n("object_notes_label",e)}</strong>
                      <div class="notes-body">${Ui(i.notes)}</div>
                    </div>
                  `:p}

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
                        <ha-icon icon="${i.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${i.archived?n("unarchive_object",e):n("archive_object",e)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${n("delete",e)}
                      </button>
                    </div>
                  `:p}
            `:this._error?l`<div class="error">${this._error}</div>`:l`<div class="loading">${n("loading",e)}</div>`}
    `)}updated(e){e.has("_open")&&this._open&&gt(this.shadowRoot)}_renderMetaRow(e){let t=this._lang,i=[];return e.area_id&&i.push([n("area",t),xo(e.area_id,this.hass?.areas,n("no_area",t))]),e.manufacturer&&i.push([n("manufacturer",t),e.manufacturer]),e.model&&i.push([n("model",t),e.model]),e.serial_number&&i.push([n("serial_number_label",t),e.serial_number]),e.installation_date&&i.push([n("installed",t),M(e.installation_date,t)]),e.warranty_expiry&&i.push([n("warranty",t),M(e.warranty_expiry,t)]),e.documentation_url&&i.push([n("documentation_url_label",t),e.documentation_url,et(e.documentation_url)]),i.length===0?p:l`
      <div class="meta">
        ${i.map(([a,o,c])=>l`
            <div class="meta-item">
              <span class="meta-label">${a}</span>
              <span class="meta-value">${c||Sn(o)?l`<a href="${o}" target="_blank" rel="noopener noreferrer">${o}</a>`:o}</span>
            </div>
          `)}
      </div>
    `}};re.styles=[_t,$`
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
  `],d([b({attribute:!1})],re.prototype,"hass",2),d([u()],re.prototype,"_open",2),d([u()],re.prototype,"_entryId",2),d([u()],re.prototype,"_data",2),d([u()],re.prototype,"_busy",2),d([u()],re.prototype,"_error",2),d([u()],re.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",re)});var fe={};Lo(fe,{__resetSettingsCacheForTests:()=>qc,getRowActionStyle:()=>Dc,openCompleteDialog:()=>Bc,openCreateObjectDialog:()=>as,openCreateTaskDialog:()=>os,openEditObjectDialog:()=>zc,openEditTaskDialog:()=>Fc,openHistoryEditDialog:()=>Uc,openObjectQuickActions:()=>Vc,openQrDialog:()=>Wc,openTaskQuickActions:()=>ls});function ft(){return document.querySelector("home-assistant")?.hass}function Hc(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function ve(r){let s=Hc(),e=s.querySelector(r)??document.body.querySelector(r);return e?e.parentNode!==s&&s.appendChild(e):(e=document.createElement(r),s.appendChild(e)),e}function be(r){let s=ft();if(!s)return!1;r.hass=s;let e=N(s);return Ze(e)||ue(e).then(()=>{r.requestUpdate?.()}),br(s.locale,s.config?.country,s.config?.time_zone),!0}function Dc(r){return G(r).then(s=>s.rowActionStyle)}function qc(){Yn()}function as(){let r=ve(So);return be(r)?(r.openCreate(),Ao(r),!0):!1}async function Ao(r){let s=ft();s&&(r.placesEnabled=(await G(s)).features.places)}function zc(r,s){let e=ve(So);return be(e)?(e.openEdit(r,s),Ao(e),!0):!1}function os(r="",s){let e=ve(To);if(!be(e))return!1;let t=ft();return t?((async()=>{let i=await G(t),a=e;Co(a,i),a.openCreate(r,s)})(),!0):!1}function Co(r,s){r.checklistsEnabled=s.features.checklists,r.scheduleTimeEnabled=s.features.schedule_time,r.completionActionsEnabled=s.features.completion_actions,r.adaptiveFeature=s.features.adaptive,r.seasonalFeature=s.features.seasonal,r.environmentalFeature=s.features.environmental,r.defaultWarningDays=s.defaultWarningDays,r.mirrorTodoDefault=s.mirrorTodoDefault}function Fc(r,s){let e=ve(To);if(!be(e))return!1;let t=ft();return t?((async()=>{try{let[i,a]=await Promise.all([t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:r}),G(t)]),o=(i.tasks||[]).find(h=>h.id===s);if(!o){console.warn(`openEditTaskDialog: task ${s} not found in entry ${r}`);return}let c=e;Co(c,a),await c.openEdit(r,o)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function Uc(r){let s=ve(jc);return be(s)?(s.openEdit(r),!0):!1}function Bc(r){let s=ve(Nc);if(!be(s))return!1;let e=s;return e.__msUndoWired||(e.__msUndoWired=!0,s.addEventListener("task-completed",t=>{let i=t.detail,a=ft();i?.undo&&a&&ji(s,a,i,N(a),()=>{})})),Ei(s,r,N(ft())),!0}function Wc(r){let s=ve(Oc);return be(s)?(s.openForTask(r.entry_id,r.task_id,r.object_name,r.task_name),!0):!1}function ls(r,s){let e=ve(Mc);return be(e)?(e.openFor(r,s),!0):!1}function Vc(r){let s=ve(Lc);return be(s)?(s.openFor(r),!0):!1}var So,To,jc,Nc,Oc,Mc,Lc,le=y(()=>{"use strict";ya();Ia();Wr();Oa();La();bo();Eo();Vr();I();Si();at();So="maintenance-object-dialog",To="maintenance-task-dialog",jc="maintenance-history-edit-dialog",Nc="maintenance-complete-dialog",Oc="maintenance-qr-dialog",Mc="maintenance-task-quick-actions-dialog",Lc="maintenance-object-quick-actions-dialog"});P();var Yo=["assignee_pool","required_completion_fields","checklist","labels","mirror_todo_entities","next_event_titles","history","readings"],Qo=["checklist_progress"],Zo=["tasks","parts"],Jo=["manual_docs","battery_fleet_excluded"];function tr(r,s,e=[]){for(let t of s)r[t]===void 0&&(r[t]=[]);for(let t of e)r[t]===void 0&&(r[t]={})}function Xo(r){let s=r;tr(s,Zo),s.object&&typeof s.object=="object"&&tr(s.object,Jo);for(let e of s.tasks)tr(e,Yo,Qo);return r}function Tt(r){for(let s of r)Xo(s);return r}function el(r,s){if(s.objects)return s.objects;let e=s.delta||[],t=s.removed||[];if(!e.length&&!t.length)return null;let i=new Map(r.map(a=>[a.entry_id,a]));for(let a of e)i.set(a.entry_id,a);for(let a of t)i.delete(a);return[...i.values()]}function Ms(r,s){return s.objects&&Tt(s.objects),s.delta&&Tt(s.delta),el(r,s)}function tl(r){return r.responsible_user_id?[r.responsible_user_id]:[...new Set((r.assignee_pool||[]).filter(s=>typeof s=="string"&&s))]}function Ls(r,s){return!!s&&tl(r).includes(s)}D();I();kr();function En(r){return(r.tags||[]).includes("photo")}vi();function Tn(){return window.customCards??[]}function tt(r){let s=window;s.customCards=s.customCards||[],s.customCards.some(e=>e.type===r.type)||s.customCards.push(r)}function An(r,s,e=t=>import(t)){let t=window,i;try{let m=new URL(s);i=m.origin+m.pathname}catch{return}let a=`__msCardHeal:${r[0]}:${i}`;if(t[a])return;t[a]=!0;let o=0,c=0,h=!1,_=()=>{if(o+=1,r.some(f=>!customElements.get(f))&&c<3&&!h){c+=1,h=!0;try{let f=new URL(s);f.searchParams.set("heal",`${Date.now()}`),e(f.href).catch(()=>{}).finally(()=>{h=!1})}catch{return}}o<20&&window.setTimeout(_,o<8?500:2e3)};window.setTimeout(_,250)}Rt();var yl={"maintenance-supporter-card":[null,"picker_desc_card"],"maintenance-supporter-calendar-card":["picker_name_calendar","picker_desc_calendar"],"maintenance-supporter-panel-card":["picker_name_panel","picker_desc_panel"],"maintenance-budget-section-card":["picker_name_budget","picker_desc_budget"],"maintenance-groups-section-card":["picker_name_groups","picker_desc_groups"],"maintenance-vacation-section-card":["picker_name_vacation","picker_desc_vacation"],"maintenance-battery-fleet-card":["picker_name_battery_fleet","picker_desc_battery_fleet"],"maintenance-supporter":[null,"picker_desc_dashboard"],"maintenance-supporter-section":["picker_name_section","picker_desc_section"],"maintenance-supporter-vacation":["picker_name_vacation_status","picker_desc_vacation_status"],"maintenance-supporter-budget":["picker_name_budget_status","picker_desc_budget_status"],"maintenance-supporter-groups":["picker_name_groups","picker_desc_groups_status"]},Sr=new WeakMap;function xl(r){let s=window;for(let e of[...Tn(),...s.customStrategies??[]]){let t=yl[e.type];if(!t)continue;Sr.has(e)||Sr.set(e,{name:e.name,description:e.description});let i=Sr.get(e),[a,o]=t;a&&(e.name=n(a,r,i.name)),e.description=n(o,r,i.description)}}function bi(){let r=0,s=()=>{let e=document.querySelector("home-assistant")?.hass;if(e?.language){let t=e.language;ue(t).then(()=>xl(t));return}++r<60&&setTimeout(s,1e3)};s()}Cr();Ar();xi();P();function Rn(r){let s=(r??[]).filter(e=>!!e);return s.length?l`<span class="event-titles"> · ${s.join(", ")}</span>`:p}function In(r){return r?l`<span class="event-titles trigger-detail"> · ${r}</span>`:p}Si();at();rt();Ti();P();I();qt();W();Or();function Zn(r,s,e="last-done"){let t=bn(r,s);return t?l`<span class="${e}" title="${n("last_performed",s)}: ${M(r,s)}">${t}</span>`:null}Qe();P();D();I();Qe();Lr();var oe=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._loadingObjects=!0;this._loadError=!1;this._views=[];this._objectsLoaded=!1;this._onEntitiesChanged=e=>{this._valueChanged("entity_ids",e.detail.value||[])}}get _lang(){return N(this.hass)}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._objectsLoaded&&(this._objectsLoaded=!0,this._loadObjects())}async _loadObjects(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=e.objects||[],this._loadError=!1}catch{this._objects=[],this._loadError=!0}this._loadingObjects=!1;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._views=e.views||[]}catch{this._views=[]}}_valueChanged(e,t){let i={...this._config,[e]:t};(Array.isArray(t)&&t.length===0||t===""||t===void 0||t===null)&&delete i[e],this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i}}))}_toggleStatus(e,t){let i=new Set(this._config.filter_status||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_status",[...i])}_toggleObject(e,t,i){let a=new Set(this._config.filter_objects||[]);a.delete(t),i?a.add(e):a.delete(e),this._valueChanged("filter_objects",[...a])}_dropStale(e,t){this._valueChanged(e,(this._config[e]||[]).filter(i=>i!==t))}_toggleLabel(e,t){let i=new Set(this._config.filter_labels||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_labels",[...i])}_toggleArea(e,t){let i=new Set(this._config.filter_areas||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_areas",[...i])}_togglePriority(e,t){let i=new Set(this._config.filter_priority||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_priority",[...i])}_staleRow(e,t){return l`
      <label class="object-row stale">
        <input type="checkbox" .checked=${!0} @change=${()=>this._dropStale(e,t)} />
        <span>${t}</span>
      </label>
    `}render(){let e=this._lang,t=new Set(this._config.filter_status||[]),i=new Set(this._config.filter_objects||[]),a=[...this._objects].map(v=>({entryId:v.entry_id,name:v.object.name,checked:i.has(v.entry_id)||i.has(v.object.name)})).sort((v,A)=>v.name.localeCompare(A.name)),o=new Set(this._objects.flatMap(v=>[v.entry_id,v.object.name])),c=[...i].filter(v=>!o.has(v)),h=new Set(this._config.filter_areas||[]),_=[...new Set(this._objects.map(v=>v.object.area_id).filter(v=>!!v).concat([...h]))],m=v=>this.hass?.areas?.[v]?.name||v,f=_.map(v=>({id:v,name:m(v)})).sort((v,A)=>v.name.localeCompare(A.name)),w=new Set(this._config.filter_labels||[]),x=new Set(this._config.filter_priority||[]),R=[...new Set(this._objects.flatMap(v=>v.tasks.flatMap(A=>A.labels||[])))].sort((v,A)=>v.localeCompare(A)),k=[...w].filter(v=>!R.includes(v)),E=[];for(let v of this._objects)for(let A of v.tasks)A.sensor_entity_id&&E.push(A.sensor_entity_id),A.binary_sensor_entity_id&&E.push(A.binary_sensor_entity_id);return l`
      <div class="editor">
        <ha-textfield
          label="${n("card_title",e)}"
          .value=${this._config.title||""}
          @input=${v=>this._valueChanged("title",v.target.value)}
        ></ha-textfield>

        <!-- Status filter (chip row) -->
        <div class="field">
          <div class="field-label">${n("card_filter_status",e)}</div>
          <div class="chip-row">
            ${ni.map(v=>l`
              <label class="chip ${t.has(v)?"active":""}">
                <input type="checkbox"
                  .checked=${t.has(v)}
                  @change=${A=>this._toggleStatus(v,A.target.checked)} />
                ${n(v,e)}
              </label>
            `)}
          </div>
          <div class="field-help">${n("card_filter_status_help",e)}</div>
        </div>

        <!-- Object filter (multi-checkbox) -->
        <div class="field">
          <div class="field-label">${n("card_filter_objects",e)}</div>
          ${this._loadingObjects?l`<div class="field-help">${n("card_loading_objects",e)}</div>`:this._loadError?l`<div class="field-help error-text">${n("card_load_error",e)}</div>`:a.length===0&&c.length===0?l`<div class="field-help">${n("no_objects",e)}</div>`:l`
                <div class="object-list">
                  ${a.map(v=>l`
                    <label class="object-row">
                      <input type="checkbox"
                        .checked=${v.checked}
                        @change=${A=>this._toggleObject(v.entryId,v.name,A.target.checked)} />
                      <span>${v.name}</span>
                    </label>
                  `)}
                  ${c.map(v=>this._staleRow("filter_objects",v))}
                </div>
                <div class="field-help">${n("card_filter_objects_help",e)}</div>
              `}
        </div>
        <!-- Area filter (C8): selects whole objects by the room they sit in.
             Hidden while no object has an area — the section would be an
             empty box otherwise. -->
        ${f.length?l`
        <div class="field">
          <div class="field-label">${n("card_filter_areas",e)}</div>
          <div class="object-list">
            ${f.map(v=>l`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${h.has(v.id)}
                  @change=${A=>this._toggleArea(v.id,A.target.checked)} />
                <span>${v.name}</span>
              </label>
            `)}
          </div>
          <div class="field-help">${n("card_filter_areas_help",e)}</div>
        </div>`:p}
        ${R.length||k.length?l`
        <div class="field">
          <div class="field-label">${n("labels",e)}</div>
          <div class="object-list">
            ${R.map(v=>l`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${w.has(v)}
                  @change=${A=>this._toggleLabel(v,A.target.checked)} />
                <span>${v}</span>
              </label>
            `)}
            ${k.map(v=>this._staleRow("filter_labels",v))}
          </div>
        </div>`:p}
        <div class="field">
          <div class="field-label">${n("priority",e)}</div>
          <div class="object-list">
            ${Jn.map(v=>l`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${x.has(v)}
                  @change=${A=>this._togglePriority(v,A.target.checked)} />
                <span>${n(`priority_${v}`,e)}</span>
              </label>
            `)}
          </div>
          <div class="field-help">${n("card_filter_priority_help",e)}</div>
        </div>

        <!-- Entity-id filter (HA-native pattern). Limited to our integration's
             sensor + binary_sensor entities via includeEntities so the picker
             stays usable on installs with thousands of entities. -->
        <div class="field">
          <div class="field-label">${n("card_filter_entities",e)}</div>
          <ha-entities-picker
            .hass=${this.hass}
            .value=${this._config.entity_ids||[]}
            .includeDomains=${["sensor","binary_sensor"]}
            .includeEntities=${E}
            @value-changed=${this._onEntitiesChanged}
          ></ha-entities-picker>
          <div class="field-help">${n("card_filter_entities_help",e)}</div>
        </div>

        <!-- Saved-view scope (v2.26): applies the view's status/user/label
             filters on top of everything above. Hidden while no views exist —
             views are created in the panel toolbar, not here. -->
        ${this._views.length>0?l`
              <div class="field">
                <div class="field-label">${n("card_saved_view",e)}</div>
                <select
                  class="view-select"
                  .value=${this._config.view_id||""}
                  @change=${v=>this._valueChanged("view_id",v.target.value)}
                >
                  <option value="" ?selected=${!this._config.view_id}>
                    ${n("card_saved_view_none",e)}
                  </option>
                  ${this._views.map(v=>l`<option value=${v.id} ?selected=${this._config.view_id===v.id}>
                      ${v.name}
                    </option>`)}
                </select>
                <div class="field-help">${n("card_saved_view_help",e)}</div>
              </div>
            `:p}

        <ha-formfield label="${n("card_show_header",e)}">
          <ha-switch
            .checked=${this._config.show_header!==!1}
            @change=${v=>this._valueChanged("show_header",v.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${n("card_show_actions",e)}">
          <ha-switch
            .checked=${this._config.show_actions!==!1}
            @change=${v=>this._valueChanged("show_actions",v.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <label class="editor-select">
          <span>${n("card_action_style",e)}</span>
          <select
            .value=${this._config.action_style??""}
            @change=${v=>{let A=v.target.value;this._valueChanged("action_style",A===""?void 0:A)}}
          >
            <option value="" ?selected=${!this._config.action_style}>${n("row_actions_follow",e)}</option>
            <option value="buttons" ?selected=${this._config.action_style==="buttons"}>${n("row_actions_buttons",e)}</option>
            <option value="icons" ?selected=${this._config.action_style==="icons"}>${n("row_actions_icons",e)}</option>
          </select>
        </label>

        <ha-formfield label="${n("responsible_user",e)}">
          <ha-switch
            .checked=${this._config.show_assignee!==!1}
            @change=${v=>this._valueChanged("show_assignee",v.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${n("documents",e)}">
          <ha-switch
            .checked=${this._config.show_documents!==!1}
            @change=${v=>this._valueChanged("show_documents",v.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${n("card_compact",e)}">
          <ha-switch
            .checked=${this._config.compact||!1}
            @change=${v=>this._valueChanged("compact",v.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-textfield
          label="${n("card_max_items",e)}"
          type="number"
          .value=${String(this._config.max_items||0)}
          @input=${v=>this._valueChanged("max_items",parseInt(v.target.value,10)||0)}
        ></ha-textfield>
        ${p}
      </div>
    `}};oe.styles=$`
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
    .object-row.stale span { text-decoration: line-through; opacity: 0.7; }
    .view-select {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
      max-width: 320px;
    }
  `,d([b({attribute:!1})],oe.prototype,"hass",2),d([u()],oe.prototype,"_config",2),d([u()],oe.prototype,"_objects",2),d([u()],oe.prototype,"_loadingObjects",2),d([u()],oe.prototype,"_loadError",2),d([u()],oe.prototype,"_views",2);customElements.get("maintenance-supporter-card-editor")||customElements.define("maintenance-supporter-card-editor",oe);Wr();Vr();P();D();P();D();I();I();function ma(r,s,e){return n(`part_waiting_${r}`,e).replace("{count}",j(s,e))}Ur();me();rt();at();W();qt();var q=class q extends S{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._choosing=null;this._error="";this._disposeFor=null;this._disposeQty="1";this._history=null;this._rosterSort=q._storedSort();this._typeFilter=null;this._recorded=[];this._access=_e;this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{await this._act({type:"maintenance_supporter/battery_fleet/setup",language:this._lang})};this._loadHistory=async e=>{let t=e.target.open;if(Wt(Re.batteryRosterOpen,t?"1":"0"),!(!t||this._historyRequested)){this._historyRequested=!0;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=i.series}catch{this._history=null}}}}get _lang(){return N(this.hass)}get _canWrite(){return ae(this.hass?.user,this._access)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(e){ci(this,e),e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,ue(this._lang).then(()=>this.requestUpdate()),G(this.hass).then(t=>{this._access=t.access}),this._ov===null&&!this._loading&&this._load())}async _load(){this._error="";let e=await H(this,{type:"maintenance_supporter/battery_fleet/overview"},{busy:t=>{this._loading=t},onError:t=>{this._error=t}});e!==void 0&&(this._ov=e)}async _act(e,t){return this._marking?!1:(this._error="",await H(this,e,{busy:a=>{this._marking=a},reload:async()=>{t?.(),await this._load()},onError:a=>{this._error=a}})!==void 0)}async _dispose(e,t){let i=parseFloat(this._disposeQty);!Number.isFinite(i)||i<=0||await this._act({type:"maintenance_supporter/part/dispose",entry_id:e,part_id:t,quantity:i})&&(this._disposeFor=null)}_renderDispose(e,t,i){return this._disposeFor!==t.part_id?l`<button class="bf-charged bf-dispose" title=${n("part_dispose_hint",i)} .disabled=${this._marking}
        @click=${()=>{this._disposeFor=t.part_id,this._disposeQty="1"}}><ha-icon icon="mdi:trash-can-outline"></ha-icon>${n("part_dispose",i)}</button>`:l`<input
        class="bf-dispose-qty"
        type="number"
        min="1"
        max=${String(t.restoring)}
        .value=${this._disposeQty}
        aria-label=${n("part_dispose_how_many",i)}
        title=${n("part_dispose_how_many",i)}
        @input=${a=>this._disposeQty=a.target.value}
        @keydown=${a=>{a.key==="Enter"&&this._dispose(e,t.part_id),a.key==="Escape"&&(this._disposeFor=null)}}
      /><button class="bf-charged bf-dispose confirm" title=${n("part_dispose_hint",i)} .disabled=${this._marking}
        @click=${()=>this._dispose(e,t.part_id)}><ha-icon icon="mdi:check"></ha-icon>${n("part_dispose",i)}</button
      ><button class="bf-charged bf-dispose" title=${n("cancel",i)} @click=${()=>this._disposeFor=null}
        ><ha-icon icon="mdi:close"></ha-icon
      ></button>`}_markOne(e,t){if(e.cell_choices&&e.cell_choices.length>1){this._choosing={entityId:e.entity_id,list:t,selected:e.cells_installed||e.cell_choices[0].type};return}this._mark([e.entity_id])}async _confirmCells(){let e=this._choosing;e&&(this._choosing=null,await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",entity_ids:[e.entityId],cells:{[e.entityId]:e.selected}}))}_renderCellChooser(e,t,i){let a=this._choosing;return!a||a.entityId!==e.entity_id||a.list!==t||!e.cell_choices?p:l`
      <div class="bf-cells" role="group" aria-label=${n("battery_fleet_cells_question",i)}>
        <div class="bf-cells-q">${n("battery_fleet_cells_question",i)}</div>
        ${e.cell_choices.map(o=>l`
          <label class="bf-cell-choice">
            <input type="radio" name=${`cells-${e.entity_id}`} .checked=${a.selected===o.type}
              @change=${()=>{this._choosing={...a,selected:o.type}}} />
            <span>${o.name}</span>
            ${o.rechargeable?l`<span class="bf-cell-tag">${n("battery_fleet_cells_rechargeable",i)}</span>`:p}
          </label>`)}
        <div class="bf-cells-actions">
          <button class="bf-cells-cancel" @click=${()=>{this._choosing=null}}>${n("cancel",i)}</button>
          <button class="bf-cells-ok" .disabled=${this._marking} @click=${()=>this._confirmCells()}>
            ${n("battery_fleet_mark_one",i)}
          </button>
        </div>
      </div>
    `}async _mark(e){await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",...e?{entity_ids:e}:{}})}async _setExcluded(e,t){await this._act({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:e,excluded:t})}async _addBattery(e){let t=e.detail?.value;t&&await this._act({type:"maintenance_supporter/battery_fleet/set_included",entity_id:t,included:!0})}async _setTrackSelf(e){await this._setFleetOption("set_track_self_charging",e.target)}async _setDueWithoutSensor(e){await this._setFleetOption("set_due_without_sensor",e.target)}async _setAskCells(e){await this._setFleetOption("set_ask_cells",e.target)}async _setFleetOption(e,t){let i=t.checked;await this._act({type:`maintenance_supporter/battery_fleet/${e}`,enabled:i})||(t.checked=!i)}_rosterOpen(){return Bt(Re.batteryRosterOpen)!=="0"}_predictedTitle(e,t){if(e.forecast_overdue)return n("battery_fleet_forecast_overdue",t);let i=this._predictedDate(this._forecastDays(e)??0);if(e.predicted_source==="trend")return n("battery_fleet_predicted_trend",t).replace("{date}",i).replace("{confidence}",n("cal_confidence_"+(e.prediction_confidence||"medium"),t));if(e.lifetime_months!=null&&e.lifetime_source){let a=n("lifetime_source_"+e.lifetime_source,t).replace("{n}",String(e.lifetime_samples??0));return n("battery_fleet_predicted_typical",t).replace("{date}",i).replace("{months}",String(e.lifetime_months)).replace("{type}",e.battery_type).replace("{source}",a)}return n("battery_fleet_predicted_on",t).replace("{date}",i)}_sparkline(e){let t=this._history?.[e.entity_id];if(!t||t.points.length<2)return p;let i=110,a=24,o=2,c=t.points[0][0],h=t.points[t.points.length-1][0],_=Date.now()/1e3,m=e.status!=="low"&&e.predicted_source==="trend"&&e.days_until!=null?_+e.days_until*86400:null,f=Math.max(h,m??h),w=v=>f===c?o:o+(v-c)/(f-c)*(i-2*o),x=v=>o+(1-Math.min(100,Math.max(0,v))/100)*(a-2*o),R=t.points.map(([v,A])=>`${C(w(v))},${C(x(A))}`).join(" "),k=t.points[t.points.length-1][1],E=C(x(t.threshold));return l`<svg
      class="bf-spark"
      viewBox="0 0 ${i} ${a}"
      role="img"
      aria-label=${n("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${n("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${E} x2=${i} y2=${E}></line>
      <polyline class="bf-spark-line" points=${R}></polyline>
      ${m!==null?l`<line
            class="bf-spark-proj"
            x1=${C(w(h))}
            y1=${C(x(k))}
            x2=${C(w(m))}
            y2=${E}
          ></line>`:p}
    </svg>`}static _storedSort(){return Bt(Re.batteryRosterSort)==="name"?"name":"urgency"}_setSort(e){this._rosterSort=e,Wt(Re.batteryRosterSort,e)}_sortedRoster(e){let t=this._typeFilter===null?e:e.filter(a=>a.battery_type===this._typeFilter);if(this._rosterSort==="name")return t;let i=a=>a.status==="low"?-1e3+(a.level??101)/101:a.days_until??1/0;return[...t].sort((a,o)=>i(a)-i(o)||a.device_name.localeCompare(o.device_name))}_predictedDate(e){return M(un(he(),e),this._lang)}_forecastDays(e){return e.forecast_days!==void 0?e.forecast_days:e.days_until}_fmtDate(e){return Number.isFinite(e)?M(new Date(e).toISOString(),this._lang):"\u2014"}_shoppingLine(e){return Object.entries(e).map(([t,i])=>l`<button
        class="bf-type-chip ${this._typeFilter===t?"bf-type-chip-active":""}"
        title=${n("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(t)}
      >
        ${i}× ${t}
      </button>`)}_toggleTypeFilter(e){if(this._typeFilter=this._typeFilter===e?null:e,this._typeFilter!==null){let t=this.shadowRoot?.querySelector("details.bf-roster");t&&!t.open&&(t.open=!0)}}async _recordJump(e,t){await this._act({type:"maintenance_supporter/battery_fleet/record_replacement",entity_id:e,replaced_at:new Date(t.at*1e3).toISOString()},()=>{this._recorded=[...this._recorded,e]})}_levelTone(e,t){let i=t.low_threshold??20;return e<=i?"bad":e<=i+20?"warn":"good"}_levelBar(e){let t=e.level;return t==null?p:l`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${this._levelTone(t,e)}" style="width: ${Math.min(100,Math.max(0,t))}%"></span
    ></span>`}_jumpButton(e,t){let i=this._history?.[e.entity_id]?.jump;return!i||this._recorded.includes(e.entity_id)?p:l`<button
      class="bf-mark bf-jump"
      title=${n("battery_fleet_record_replacement",t).replace("{date}",this._fmtDate(i.at*1e3))}
      .disabled=${this._marking}
      @click=${()=>this._recordJump(e.entity_id,i)}
    >
      <ha-icon icon="mdi:calendar-sync"></ha-icon>
    </button>`}_renderRow(e,t,i){let a=e.available===!1?l`<span class="bf-offline">${n("battery_fleet_offline",t)}</span>`:e.no_sensor?l`<span class="bf-offline bf-nosensor">${n("battery_fleet_no_sensor",t)}</span>`:p,o=`${e.quantity}\xD7 ${e.battery_type}`,c=l`<span class="bf-type" title=${o}>${o}</span>`,h=this._canWrite,_=h&&(i.mark==="always"||e.no_sensor||e.can_mark_replaced),m=this._forecastDays(e);return l`
      <div class="bf-row">
        <span class="bf-dev">${e.device_name}</span>
        ${i.status?l`<span class="bf-status bf-${e.status}"
                >${e.no_sensor&&e.status==="low"?n("battery_fleet_status_due",t):n("battery_fleet_status_"+e.status,t)}</span
              >${c}${a}`:l`${a}${c}`}
        ${i.recharge&&e.rechargeable?l`<span class="bf-recharge" title=${n("battery_fleet_rechargeable",t)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`:p}
        ${i.sparkline?this._sparkline(e):p}
        ${this._levelBar(e)}
        ${e.level!=null?l`<span class="bf-level bf-level-${this._levelTone(e.level,e)}">${e.level}%</span>`:p}
        ${_?l`<button
              class="bf-mark${i.mark==="replaced"?" bf-replaced":""}"
              title=${e.rechargeable?n("battery_fleet_mark_recharged",t):n("battery_fleet_mark_one",t)}
              .disabled=${this._marking}
              @click=${()=>this._markOne(e,i.list)}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`:p}
        ${i.jump&&h?this._jumpButton(e,t):p}
        ${i.predicted&&m!=null?l`<span
              class="bf-predicted ${e.predicted_source==="trend"?"bf-trend":""} ${e.forecast_overdue?"bf-overdue":""} ${e.forecast_overdue&&e.status==="ok"?"bf-quiet":""}"
              title=${this._predictedTitle(e,t)}
              >${e.forecast_overdue?l`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:p}~${this._predictedDate(m)}</span
            >`:p}
        ${i.exclude&&h?l`<button
              class="bf-mark bf-exclude"
              title=${n("battery_fleet_exclude",t)}
              .disabled=${this._marking}
              @click=${()=>this._setExcluded(e.entity_id,!0)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`:p}
      </div>
      ${this._renderCellChooser(e,i.list,t)}
    `}render(){let e=this._lang;if(this._loading&&this._ov===null)return l`<div class="bf-card"><div class="bf-loading">…</div></div>`;let t=this._ov;if(!t)return this._error?l`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:p;let i=t.low.length;return l`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${n("battery_fleet_title",e)}</span>
          <span class="bf-count ${i?"bad":"ok"}">${i}</span>
        </div>
        ${this._error?l`<div class="bf-error">${this._error}</div>`:p}

        ${t.configured&&t.task_ok===!1?l`
              <div class="bf-repair">
                <span>${n("battery_fleet_trigger_lost",e)}</span>
                ${this._canWrite?l`<ha-button .disabled=${this._marking} @click=${this._repair}>
                      ${n("battery_fleet_repair",e)}
                    </ha-button>`:p}
              </div>
            `:p}

        ${i===0?l`<div class="bf-empty">${n("battery_fleet_none_low",e)}</div>`:l`
              <div class="bf-shopping">
                <span class="bf-label">${n("battery_fleet_buy_now",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${t.low.map(a=>this._renderRow(a,e,{list:"low",recharge:!0,mark:"always",exclude:!0}))}
              </div>
              ${this._canWrite?l`<div class="bf-actions">
                    <ha-button .disabled=${this._marking} @click=${this._markAll}>
                      <ha-icon icon="mdi:battery-sync"></ha-icon> ${n("battery_fleet_mark_all",e)}
                    </ha-button>
                  </div>`:p}
            `}

        ${t.charging?.length?l`
              <div class="bf-charging">
                <span class="bf-label">${n("battery_fleet_charging",e)}</span>
                ${t.charging.map(a=>l`<span class="bf-charge-item">
                    <span class="bf-charge-name">${a.name}</span>
                    <span>${n("battery_fleet_ready",e).replace("{count}",j(a.stock,e))}</span>
                    ${a.restoring>0?l`<span class="bf-charge-waiting">${ma(a.reuse,a.restoring,e)}</span>
                          ${this._canWrite?l`<button
                                class="bf-charged"
                                title=${n("part_ready_again_hint",e)}
                                .disabled=${this._marking}
                                @click=${()=>this._act({type:"maintenance_supporter/part/ready_again",entry_id:t.entry_id,part_id:a.part_id})}
                              ><ha-icon icon="mdi:battery-charging-100"></ha-icon>${n(`part_reuse_${a.reuse}`,e)}</button>
                              ${this._renderDispose(t.entry_id,a,e)}`:p}`:p}
                  </span>`)}
              </div>
            `:p}
        ${t.soon.length?l`
              <div class="bf-soon">
                <span class="bf-label">${n("battery_fleet_soon",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_soon)}</span>
                <div class="bf-soon-hint">${n("battery_fleet_soon_hint",e)}</div>
              </div>
              <div class="bf-rows bf-soon-rows">
                ${t.soon.map(a=>this._renderRow(a,e,{list:"soon",mark:"replaced",predicted:!0}))}
              </div>
            `:p}
        ${t.all?.length?l`
              <details class="bf-roster" ?open=${this._rosterOpen()} @toggle=${this._loadHistory}>
                <summary>${n("battery_fleet_all",e)} (${t.all.length})</summary>
                <div class="bf-roster-tools">
                  <button
                    class="bf-sort ${this._rosterSort==="urgency"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("urgency")}
                  >
                    ${n("battery_fleet_sort_urgency",e)}
                  </button>
                  <button
                    class="bf-sort ${this._rosterSort==="name"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("name")}
                  >
                    ${n("battery_fleet_sort_name",e)}
                  </button>
                </div>
                <div class="bf-rows">
                  ${this._sortedRoster(t.all).map(a=>this._renderRow(a,e,{list:"roster",status:!0,recharge:!0,sparkline:!0,mark:"replaced",jump:!0,predicted:!0,exclude:!0}))}
                </div>
                <div class="bf-roster-hint">${n("battery_fleet_all_hint",e)}</div>
                ${this._canWrite?this._renderRosterSettings(t,e):p}
              </details>
            `:p}
        ${this._renderExcluded(t,e)}
        <div class="bf-total">${n("battery_fleet_total",e).replace("{n}",String(t.total))}</div>
      </div>
    `}_renderRosterSettings(e,t){return l`
                <div class="bf-add">
                  <span class="bf-label">${n("battery_fleet_add",t)}</span>
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{entity:{domain:["sensor","binary_sensor"]}}}
                    .value=${""}
                    @value-changed=${this._addBattery}
                  ></ha-selector>
                  <div class="bf-roster-hint">${n("battery_fleet_add_hint",t)}</div>
                </div>
                <label class="bf-track-self">
                  <input
                    type="checkbox"
                    .checked=${!!e.track_self_charging}
                    .disabled=${this._marking}
                    @change=${this._setTrackSelf}
                  />
                  ${n("battery_fleet_track_self",t)}
                </label>
                <div class="bf-roster-hint">${n("battery_fleet_track_self_hint",t)}</div>
                <label class="bf-track-self bf-due-nosensor">
                  <input
                    type="checkbox"
                    .checked=${e.due_without_sensor!==!1}
                    .disabled=${this._marking}
                    @change=${this._setDueWithoutSensor}
                  />
                  ${n("battery_fleet_due_without_sensor",t)}
                </label>
                <div class="bf-roster-hint">${n("battery_fleet_due_without_sensor_hint",t)}</div>
                <label class="bf-track-self bf-ask-cells">
                  <input
                    type="checkbox"
                    .checked=${!!e.ask_cells}
                    .disabled=${this._marking}
                    @change=${this._setAskCells}
                  />
                  ${n("battery_fleet_ask_cells",t)}
                </label>
                <div class="bf-roster-hint">${n("battery_fleet_ask_cells_hint",t)}</div>
    `}_renderExcluded(e,t){return l`
        ${e.excluded?.length?l`
              <div class="bf-excluded">
                <span class="bf-label">${n("battery_fleet_excluded",t)}</span>
                ${e.excluded.map(i=>l`
                    <span class="bf-excluded-chip">
                      ${i.device_name}
                      ${this._canWrite?l`<button
                            class="bf-mark"
                            title=${n("battery_fleet_include",t)}
                            .disabled=${this._marking}
                            @click=${()=>this._setExcluded(i.entity_id,!1)}
                          >
                            <ha-icon icon="mdi:eye-outline"></ha-icon>
                          </button>`:p}
                    </span>
                  `)}
              </div>
            `:p}
    `}};q.styles=$`
    /* The query container of the row layout (see "In a narrow list" below):
     * the list's own width, not the screen's. */
    .bf-card {
      container: bf-fleet / inline-size;
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
    .bf-charging {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    .bf-charge-item {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 2px 8px;
      border-radius: 12px;
      background: var(--secondary-background-color, #eee);
      font-size: 13px;
    }
    .bf-charge-name {
      font-weight: 500;
    }
    .bf-charge-waiting {
      color: var(--warning-color, #f57c00);
    }
    .bf-charged {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font: inherit;
      font-size: 12px;
      min-height: 28px;
      padding: 2px 10px;
      border-radius: 14px;
      border: 1px solid var(--primary-color);
      background: transparent;
      color: var(--primary-color);
      cursor: pointer;
    }
    .bf-charged ha-icon {
      --mdc-icon-size: 16px;
    }
    .bf-dispose {
      border-color: var(--divider-color, #ccc);
      color: var(--secondary-text-color);
    }
    .bf-dispose.confirm {
      border-color: var(--error-color, #db4437);
      color: var(--error-color, #db4437);
    }
    .bf-dispose-qty {
      width: 56px;
      padding: 4px;
      font: inherit;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
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
      /* The right-hand columns (percentage, action, date, eye) have a
       * minimum width, so they line up across the three lists ("Buy now",
       * "Needed soon", the roster) although each list is a grid of its own
       * and fills different columns - only the roster has the eye, and its
       * dates used to end 32 px left of the soon list's. */
      grid-template-columns:
        minmax(0, 1fr) repeat(5, max-content)
        minmax(40px, max-content) minmax(32px, max-content) minmax(92px, max-content) minmax(32px, max-content);
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
    /* D#162: the roster's "No sensor" / offline chip takes the level bar's
     * slot (such a row has no bar); column 2 stays the status chip's. */
    .bf-status + .bf-type + .bf-offline {
      grid-column: 6;
      justify-self: start;
      white-space: nowrap;
    }
    .bf-level {
      grid-column: 7;
      justify-self: end;
    }
    /* Every row action, the Replaced one included, sits in column 8. The
     * Replaced action used to take the empty percentage slot on sensorless
     * rows (D#162, while nothing else filled column 8) and column 8 on rows
     * with a percentage (since 2.79), so it jumped 40 px between
     * neighbouring rows (prod report 2026-10-13). Rows with a percentage
     * fill column 8 anyway, so one column for all costs no width. The
     * narrow layout below gives Replaced a slot of its own. */
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
    /* Every row shares the list's columns, so ONE long type ("1× BATTERY
     * PACK") widened the type column of all of them (D#162): it stops at
     * 12em and ends in an ellipsis, the full text is the tooltip. */
    .bf-type {
      color: var(--secondary-text-color);
      font-size: 13px;
      max-width: 12em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
    /* In a narrow list the row cannot fit name + chips + curve + bar + date
     * in ONE line: the decorations yield (the percentage still carries the
     * number) and the row wraps to two lines - the name spans the full
     * width, the status chip moves under it (left, into the name column)
     * and the rest keeps its pinned subgrid column, so type / percentage /
     * date / eye stay aligned across rows. Without this the fixed
     * max-content columns overflowed 400 px and the chips overlapped the
     * wrapped names.
     *
     * The LIST's width decides, not the screen's (D#162): the Lovelace card
     * sits in a dashboard column of 400-500 px on a wide screen, kept the
     * one-line layout there and cut off the badge, the date and the hide
     * button. 680 px of list is where the one-line rows stop fitting;
     * desktop task pages (700 px and more) keep them. */
    @container bf-fleet (max-width: 680px) {
      .bf-spark,
      .bf-bar {
        display: none;
      }
      /* No fixed gaps: a column a phone leaves empty (status chip moved,
       * curve and bar hidden) cost its 8 px gap all the same, and together
       * with one long type the rows ran 25 px past a 402 px phone. Each
       * occupied column brings its own 6 px instead, and the type column
       * may shrink - its text ends in an ellipsis. */
      .bf-rows {
        column-gap: 0;
        grid-template-columns: minmax(0, 1fr) max-content minmax(0, max-content) repeat(7, max-content);
      }
      .bf-row > :not(.bf-dev) {
        margin-inline-start: 6px;
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
      /* The column shrinks, the ellipsis comes from the base rule (a cap in
       * vw measured the screen, not the list). */
      .bf-type {
        grid-row: 2;
      }
      .bf-recharge,
      .bf-level,
      .bf-predicted,
      .bf-row .bf-mark {
        grid-row: 2;
      }
      /* Phone (D#162, maisun): the percentage belongs to the name line - it
       * is what you scan for - and the Replaced action to line 2 with type
       * and date. A row WITH a percentage therefore lifts it to line 1 (the
       * name yields column 8; in the "Needed soon" list, which has no status
       * chip, it takes the chip's place at the right edge) and the action
       * takes the percentage's slot on line 2 - the same slot a sensorless
       * row uses, so every row's action lines up. Before, the action shared
       * the slot with the percentage and painted over it. */
      .bf-row .bf-level {
        grid-row: 1;
        grid-column: 8;
        justify-self: end;
      }
      .bf-soon-rows .bf-row .bf-level {
        grid-column: 9 / 11;
      }
      .bf-row:has(.bf-level) .bf-dev {
        grid-column: 1 / 8;
      }
      .bf-soon-rows .bf-row:has(.bf-level) .bf-dev {
        grid-column: 1 / 9;
      }
      .bf-row .bf-mark.bf-replaced {
        grid-row: 2;
        grid-column: 7;
        justify-self: end;
      }
      /* The roster's "No sensor" chip would widen the shared bar track
       * for EVERY row (subgrid) - on phones the missing percentage and
       * the "Due" status already tell the story, so it yields like the
       * bar and the sparkline do. */
      .bf-status + .bf-type + .bf-offline {
        display: none;
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
    /* The number takes the bar's colour. It was red on every row, from the
     * days it only showed in the low list; the soon list and the roster
     * show it too, and a full battery read as an alarm there (prod report
     * 2026-10-13). A healthy level is plain text. */
    .bf-level {
      font-size: 12px;
    }
    .bf-level-bad {
      color: var(--error-color, #f44336);
    }
    .bf-level-warn {
      color: var(--warning-color, #ff9800);
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
    /* D#213: which cells went in — under the battery's row, across the
     * list's grid (in one column it squeezed into the name's). */
    .bf-cells {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 4px 0 8px;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .bf-cells-q { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
    .bf-cell-choice { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
    .bf-cell-choice input { width: 16px; height: 16px; margin: 0; }
    .bf-cell-tag {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }
    .bf-cells-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .bf-cells-actions button {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    .bf-cells-actions .bf-cells-ok {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
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
    /* #223: the level reads healthy, so the passed type lifetime is only a
       hint — the row is OK. */
    .bf-predicted.bf-overdue.bf-quiet {
      color: var(--secondary-text-color);
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
  `,d([b({attribute:!1})],q.prototype,"hass",2),d([b({type:Boolean})],q.prototype,"flat",2),d([u()],q.prototype,"_ov",2),d([u()],q.prototype,"_loading",2),d([u()],q.prototype,"_marking",2),d([u()],q.prototype,"_choosing",2),d([u()],q.prototype,"_error",2),d([u()],q.prototype,"_disposeFor",2),d([u()],q.prototype,"_disposeQty",2),d([u()],q.prototype,"_history",2),d([u()],q.prototype,"_rosterSort",2),d([u()],q.prototype,"_typeFilter",2),d([u()],q.prototype,"_recorded",2),d([u()],q.prototype,"_access",2);var Gr=q;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",Gr);var ht=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-battery-fleet-card"}}static getStubConfig(){return{type:"custom:maintenance-battery-fleet-card"}}setConfig(e){this._config=e}getCardSize(){return 6}render(){return this.hass?l`
      <ha-card .header=${this._config.title||void 0}>
        <div class="content">
          <maintenance-battery-fleet-section flat .hass=${this.hass}></maintenance-battery-fleet-section>
        </div>
      </ha-card>
    `:p}};ht.styles=$`
    ha-card {
      overflow: hidden;
    }
    .content {
      padding: 12px 16px 14px;
    }
  `,d([b({attribute:!1})],ht.prototype,"hass",2),d([u()],ht.prototype,"_config",2);customElements.get("maintenance-battery-fleet-card")||customElements.define("maintenance-battery-fleet-card",ht);tt({type:"maintenance-battery-fleet-card",name:"Battery Fleet",description:"All tracked batteries: what is low now, what runs out soon, and what to buy.",preview:!1});le();P();D();var cs=["today","dashboard","calendar","settings"];I();var vt="maintenance-supporter-panel-card",ds="maintenance-supporter-panel",us="maintenance-supporter",ps=870,Gc=320,Kc=480;function Yc(r){let e=r?.panels?.[us]?.config?._panel_custom?.module_url;return typeof e=="string"&&e.startsWith("/")?e:null}function Qc(r){if(r==null||r===""||r==="fill")return null;if(typeof r=="number")return r>0?`${Math.round(r)}px`:null;let s=String(r).trim();return/^\d+(\.\d+)?$/.test(s)?`${s}px`:s||null}var hs=class extends HTMLElement{constructor(){super();this._config={type:`custom:${vt}`};this._panel=null;this._loading=null;this._observer=null;this._lastWidth=-1;this._preview=!1;this._onResize=()=>this._layout(!0);let e=this.attachShadow({mode:"open"}),t=document.createElement("style");t.textContent=`
      :host { display: block; box-sizing: border-box; overflow: hidden; border-radius: var(--ha-card-border-radius, 12px); }
      .status { padding: 16px; color: var(--secondary-text-color); font-size: 14px; }
      ${ds} { display: block; height: 100%; }
    `,e.appendChild(t),this._status=document.createElement("div"),this._status.className="status",this._status.hidden=!0,e.appendChild(this._status)}static getConfigElement(){return document.createElement("maintenance-supporter-panel-card-editor")}static getStubConfig(){return{type:`custom:${vt}`}}set preview(e){this._preview=!!e,this._layout(!0)}get preview(){return this._preview}_inEditorPreview(){if(this._preview)return!0;let e=this;for(let t=0;e&&t<40;t++){let i=e;if(i.tagName==="HUI-CARD-PREVIEW"||i.tagName==="HUI-DIALOG-EDIT-CARD")return!0;e=i.parentElement??i.getRootNode().host??null}return!1}setConfig(e){this._config={...e},this._panel&&(this._panel.presets=this._presets()),this._layout(!0)}getCardSize(){return 12}getGridOptions(){return{columns:"full",rows:"auto"}}set hass(e){this._hass=e,this._panel?this._panel.hass=e:this._mount()}get hass(){return this._hass}connectedCallback(){typeof ResizeObserver<"u"&&!this._observer&&(this._observer=new ResizeObserver(()=>this._layout(!1)),this._observer.observe(this)),window.addEventListener("resize",this._onResize),this._layout(!0),this._hass&&this._mount()}disconnectedCallback(){this._observer?.disconnect(),this._observer=null,window.removeEventListener("resize",this._onResize)}_presets(){let e={};return cs.includes(this._config.tab??"")&&(e.tab=this._config.tab),typeof this._config.view=="string"&&this._config.view.trim()&&(e.view=this._config.view.trim()),e}_setStatus(e){this._status.textContent=e,this._status.hidden=!1}async _mount(){if(this._panel||this._loading||!this._hass||!this.isConnected)return;let e=N(this._hass);if(!customElements.get(ds)){let i=Yc(this._hass);if(!i){this._setStatus(n("panel_card_not_registered",e));return}this._loading=import(i).then(()=>{},()=>{throw this._setStatus(n("panel_card_load_failed",e)),new Error("panel bundle failed to load")});try{await this._loading}catch{return}finally{this._loading=null}if(this._panel||!this._hass||!this.isConnected)return}let t=document.createElement(ds);t.embedded=!0,t.panel=this._hass.panels?.[us]??{url_path:us},t.presets=this._presets(),t.narrow=this._narrow(),t.hass=this._hass,this._status.hidden=!0,this.shadowRoot.appendChild(t),this._panel=t,this._layout(!0)}_narrow(){let e=this.getBoundingClientRect().width;return e>0?e<ps:window.innerWidth<ps}_layout(e){let t=this.getBoundingClientRect(),i=Math.round(t.width)!==this._lastWidth;if(!e&&!i)return;this._lastWidth=Math.round(t.width),this._panel&&t.width>0&&(this._panel.narrow=t.width<ps);let a=Qc(this._config.height);if(a){this.style.height=a;return}if(!this.isConnected)return;if(this._inEditorPreview()){this.style.height=`${Kc}px`;return}let o=Math.max(0,this._unscrolledTop(t)),c=Math.max(Gc,Math.floor(window.innerHeight-o));this.style.height=`${c}px`}_unscrolledTop(e){let t=e.top+window.scrollY,i=this.ownerDocument,a=this.parentElement??this.getRootNode().host??null;for(let o=0;a&&o<100;o++){let c=a;c!==i.documentElement&&c!==i.body&&typeof c.scrollTop=="number"&&c.scrollTop>0&&(t+=c.scrollTop),a=c.parentElement??c.getRootNode().host??null}return t}},Be=class extends S{constructor(){super(...arguments);this._config={type:`custom:${vt}`};this._views=[];this._viewsLoaded=!1}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._viewsLoaded&&(this._viewsLoaded=!0,this._loadViews())}async _loadViews(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._views=e?.views||[]}catch{this._views=[]}}_set(e,t){let i={...this._config};t===""||t===void 0?delete i[e]:i[e]=t,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let e=N(this.hass),t=i=>n(i==="today"?"tab_today":i==="calendar"?"tab_calendar":i,e);return l`
      <div class="editor">
        <div class="field">
          <div class="field-label">${n("panel_card_tab",e)}</div>
          <select class="tab-select" .value=${this._config.tab||""} @change=${i=>this._set("tab",i.target.value)}>
            <option value="" ?selected=${!this._config.tab}>${n("panel_card_tab_default",e)}</option>
            ${cs.map(i=>l`<option value=${i} ?selected=${this._config.tab===i}>${t(i)}</option>`)}
          </select>
        </div>
        ${this._views.length>0?l`<div class="field">
              <div class="field-label">${n("panel_card_view",e)}</div>
              <select class="view-select" .value=${this._config.view||""} @change=${i=>this._set("view",i.target.value)}>
                <option value="" ?selected=${!this._config.view}>${n("card_saved_view_none",e)}</option>
                ${this._views.map(i=>l`<option value=${i.id} ?selected=${this._config.view===i.id||this._config.view===i.name}>${i.name}</option>`)}
              </select>
            </div>`:p}
        <div class="field">
          <div class="field-label">${n("panel_card_height",e)}</div>
          <input class="height-input" type="text" placeholder="fill"
            .value=${this._config.height===void 0?"":String(this._config.height)}
            @change=${i=>this._set("height",i.target.value.trim())} />
          <div class="field-help">${n("panel_card_height_help",e)}</div>
        </div>
      </div>
    `}};Be.styles=$`
    .editor { display: flex; flex-direction: column; gap: 16px; padding: 16px; }
    input.height-input { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; box-sizing: border-box; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 13px; color: var(--secondary-text-color); font-weight: 500; }
    .field-help { font-size: 12px; color: var(--secondary-text-color); }
    select { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; }
  `,d([b({attribute:!1})],Be.prototype,"hass",2),d([u()],Be.prototype,"_config",2),d([u()],Be.prototype,"_views",2);customElements.get(vt)||customElements.define(vt,hs);customElements.get("maintenance-supporter-panel-card-editor")||customElements.define("maintenance-supporter-panel-card-editor",Be);tt({type:vt,name:"Maintenance Supporter \u2014 Panel",description:"The complete Maintenance Supporter panel as a card \u2014 for a panel view / dashboard subview without the sidebar entry.",preview:!1});bi();var Ro=2,B=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._globalRowStyle="buttons_compact";this._settings=nt;this._firstLoadDone=!1;this._objects=[];this._stats=null;this._unsub=null;this._viewFilters=null;this._userNames={};this._userPersons={};this._userService=null;this._userNamesLoaded=!1;this._taskDocs={};this._docsLoadedFor=new Set;this._dataLoaded=!1;this._lastConnection=null;this._subGen=0;this._onCompleted=async e=>{await this._loadData();let t=e.detail;t?.undo&&ji(this,this.hass,t,this._lang,()=>{this._loadData()})}}get _lang(){return N(this.hass)}static getConfigElement(){return document.createElement("maintenance-supporter-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-card",show_header:!0,show_actions:!0,filter_status:[...sr],max_items:10}}setConfig(e){let t=e.view_id!==this._config.view_id;this._config=e,t&&this._dataLoaded&&this.hass&&this._loadViewFilters()}getCardSize(){return 3}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._subGen++,this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null}updated(e){if(super.updated(e),ci(this,e),this.hass&&!this._userNamesLoaded&&this._config.show_assignee!==!1&&this._objects.some(t=>t.tasks.some(i=>i.responsible_user_id))&&this._loadUserNames(),this.hass&&this._config.show_documents!==!1)for(let t of this._objects)this._docsLoadedFor.has(t.entry_id)||t.tasks.some(i=>(i.document_count??0)>0)&&this._loadDocuments(t.entry_id);if(e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){G(this.hass).then(t=>{this._settings=t,this._globalRowStyle=t.rowActionStyle}).catch(()=>{});let e=this._loadViewFilters();try{let[t,i]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);await e,this._objects=Tt(t.objects),this._stats=i,di(this._stats.budget)}catch{}await e,this._firstLoadDone=!0}_assigneeName(e){if(this._config.show_assignee===!1)return"";let t=e.responsible_user_id;return t&&this._userNames[t]||""}async _loadUserNames(){this._userNamesLoaded=!0,this._userService?this._userService.updateHass(this.hass):this._userService=new it(this.hass);try{let e=await this._userService.getUsers();this._userPersons=Object.fromEntries(e.map(t=>[t.id,yi(t)])),this._userNames=Object.fromEntries(e.map(t=>[t.id,t.name]))}catch{}}async _loadDocuments(e){this._docsLoadedFor.add(e);try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:e}),i={};for(let a of t.documents||[])if(!En(a))for(let o of a.task_ids||[])(i[o]||=[]).push({id:a.id,title:a.title,kind:a.kind,url:a.url});this._taskDocs={...this._taskDocs,[e]:i}}catch{}}_docsFor(e,t){if(this._config.show_documents===!1)return[];let a=[...this._taskDocs[e]?.[t.id]||[]];return t.documentation_url&&a.push({id:`url:${t.id}`,title:n("documentation_label",this._lang),kind:"weblink",url:t.documentation_url}),a}_renderDocChips(e,t){let i=this._docsFor(e,t);if(!i.length)return p;let a=i.slice(Ro);return l`<div class="doc-chips">
      ${i.slice(0,Ro).map(o=>l`
        <button
          type="button"
          class="doc-chip"
          title="${o.title}"
          @click=${c=>{c.stopPropagation(),this._openDoc(o)}}
        >
          <ha-icon icon=${o.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
          <span>${o.title}</span>
        </button>
      `)}
      ${a.length?l`<span class="doc-chip doc-more" title="${a.map(o=>o.title).join(`
`)}">+${a.length}</span>`:p}
    </div>`}async _openDoc(e){if(e.kind==="weblink"&&e.url){et(e.url)&&window.open(e.url,"_blank","noopener");return}try{await $n(this.hass,e.id)}catch{}}async _loadViewFilters(){if(!this._config.view_id){this._viewFilters=null;return}try{let t=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"})).views||[]).find(i=>i.id===this._config.view_id);this._viewFilters=t?t.filters:null}catch{this._viewFilters=null}}async _subscribe(){let e=++this._subGen;try{let t=await this.hass.connection.subscribeMessage(i=>{let a=Ms(this._objects,i);a!==null&&(this._objects=a)},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected||e!==this._subGen){t();return}this._unsub=t}catch{}}get _selectedTasks(){let e=[],{filter_status:t,filter_objects:i,entity_ids:a,filter_due_min_days:o,filter_due_max_days:c,filter_labels:h,filter_priority:_,filter_areas:m}=this._config,f=a?.length?new Set(a):null,w=o!==void 0||c!==void 0,x=this._viewFilters,R=x?.user_id==="current_user"?this.hass.user?.id??null:x?.user_id??null;for(let k of this._objects)if(!(x?.place&&(k.object.place||"home")!==x.place)&&!(i?.length&&!i.includes(k.entry_id)&&!i.includes(k.object.name))){if(m?.length){let E=k.object.area_id;if(!E||!m.includes(E))continue}for(let E of k.tasks)if(!E.is_done&&!(E.archived||k.object.archived)&&!(t?.length&&!t.includes(E.status))&&!(h?.length&&!(E.labels||[]).some(v=>h.includes(v)))&&!(_?.length&&!_.includes(E.priority||"normal"))&&!(f&&!(E.sensor_entity_id&&f.has(E.sensor_entity_id)||E.binary_sensor_entity_id&&f.has(E.binary_sensor_entity_id)))){if(w){let v=E.days_until_due;if(v==null||o!==void 0&&v<o||c!==void 0&&v>c)continue}x&&(x.status&&E.status!==x.status||x.label&&!(E.labels||[]).includes(x.label)||x.priority&&(E.priority||"normal")!==x.priority||R&&!Ls(E,R))||e.push({entry_id:k.entry_id,object_name:k.object.name,task:E})}}return e.sort((k,E)=>{let v=nr(k.task.status)-nr(E.task.status);return v!==0?v:(k.task.days_until_due??1/0)-(E.task.days_until_due??1/0)}),e}_openComplete(e,t){let i=this.shadowRoot.querySelector("maintenance-complete-dialog");Ei(i,$i({entryId:e,taskId:t.id,taskName:t.name,task:t,objects:this._objects,lang:this._lang,features:this._settings.features,currencySymbol:qe(this._stats?.budget),partsCostMode:this._settings.partsCostMode}),this._lang)}_headerCounts(e){let t={overdue:0,due_soon:0,triggered:0};for(let{task:i}of e)Qs(i.status)&&(t[i.status]+=1);return t}_openTaskDetail(e,t){ls(e,t)}render(){let e=this._lang,t=this._config.title||n("maintenance",e),i=this._config.show_header!==!1,a=(this._config.action_style??(this._globalRowStyle==="icons"?"icons":"buttons"))==="buttons",o=this._config.show_actions!==!1,c=o&&ae(this.hass?.user,this._settings.access),h=this._config.compact||!1,_=this._selectedTasks,{max_items:m}=this._config,f=m&&m>0?_.slice(0,m):_,w=this._objects.length||this._stats?this._headerCounts(_):null;return l`
      <ha-card>
        <div class="card-header">
          <h1>${t}</h1>
          <div class="header-right">
            ${i&&w?l`
                  <div class="header-stats">
                    ${w.overdue>0?l`<span class="badge overdue">${w.overdue}</span>`:p}
                    ${w.due_soon>0?l`<span class="badge due_soon">${w.due_soon}</span>`:p}
                    ${w.triggered>0?l`<span class="badge triggered">${w.triggered}</span>`:p}
                  </div>
                `:p}
            ${c?l`
                  <ha-icon-button
                    class="hdr-add"
                    title="${n("new_object",e)}"
                    @click=${()=>as()}
                  >
                    <ha-icon icon="mdi:plus-box"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button
                    class="hdr-add"
                    title="${n("add_task",e)}"
                    @click=${()=>os("",this._objects)}
                  >
                    <ha-icon icon="mdi:playlist-plus"></ha-icon>
                  </ha-icon-button>
                `:p}
          </div>
        </div>
        ${this._firstLoadDone?f.length===0?this._objects.some(x=>x.tasks.length>0)?l`<div class="empty-card">
                <!-- (#86) tasks exist but none match the filter (default:
                     actionable-only) — "all caught up", NOT "no tasks yet". -->
                <div class="all-caught-up">✓ ${n("card_all_caught_up",e)}</div>
              </div>`:l`<div class="empty-card">
                <div>${n("card_no_tasks_title",e)}</div>
                <a class="empty-link" href="/maintenance-supporter">${n("card_no_tasks_cta",e)}</a>
              </div>`:l`
              <div class="task-list ${h?"compact":""}">
                ${f.map(({entry_id:x,object_name:R,task:k})=>l`
                    <div class="task-item clickable"
                         @click=${()=>this._openTaskDetail(x,k.id)}
                         title="${n("open_task",e)}">
                      <div class="status-dot" style="background: ${ot(k)}"></div>
                      <div class="task-info">
                        <div class="task-name">
                          ${k.name}${Rn(k.next_event_titles)}${In(k.trigger_detail)}
                          ${k.due_override?l`<ha-icon
                                class="postponed-icon"
                                icon="mdi:calendar-clock"
                                title="${n("postponed",e)}"
                              ></ha-icon>`:p}
                        </div>
                        ${h?this._assigneeName(k)?l`<div class="task-meta compact-assignee" title="${this._assigneeName(k)}">
                                ${Tr(this._userPersons[k.responsible_user_id])}${this._assigneeName(k)}
                              </div>`:p:l`<div class="task-meta">
                              ${R} · ${n(k.type,e)}${Se(k)?l` · ${Se(k)}`:p}${this._assigneeName(k)?l` · <span class="assignee"
                                    >${Tr(this._userPersons[k.responsible_user_id])}${this._assigneeName(k)}</span
                                  >`:p}
                            </div>`}
                      </div>
                      ${this._renderDocChips(x,k)}
                      <div class="task-due">
                        ${k.days_until_due!==null&&k.days_until_due!==void 0?k.days_until_due<0?l`<span class="overdue-text">${mi(k.days_until_due,e)}</span>`:mi(k.days_until_due,e):k.trigger_active?"\u26A1":Zn(k.last_performed,e)??"\u2014"}
                      </div>
                      ${o&&a?l`
                            <ha-button
                              size="small"
                              appearance="accent"
                              variant="success"
                              class="complete-btn-text"
                              title="${n("complete",e)}"
                              @click=${E=>{E.stopPropagation(),this._openComplete(x,k)}}
                            >
                              <ha-icon slot="start" icon="mdi:check"></ha-icon>${n("complete",e)}
                            </ha-button>
                          `:o?l`
                            <ha-icon-button
                              class="complete-btn"
                              title="${n("complete",e)}"
                              @click=${E=>{E.stopPropagation(),this._openComplete(x,k)}}
                            >
                              <ha-icon icon="mdi:check"></ha-icon>
                            </ha-icon-button>
                          `:p}
                    </div>
                  `)}
              </div>
            `:l`<div class="card-loading">${n("loading",e)}</div>`}
      </ha-card>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onCompleted}
      ></maintenance-complete-dialog>
    `}};B.styles=[fi,$`
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
        display: inline-flex;
        --ha-icon-button-size: 32px;
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

      .card-loading {
        padding: 24px 16px;
        text-align: center;
        color: var(--secondary-text-color);
      }
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
      /* The list measures itself: a dashboard column on a wide screen needs
         the narrow row layout as much as a phone does. */
      .task-list { padding: 0 16px 16px; container: ms-tasks / inline-size; }

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
        gap: 4px;
        white-space: nowrap;
        vertical-align: middle;
      }
      .assignee .person-avatar, .compact-assignee .person-avatar { width: 16px; height: 16px; font-size: 8.5px; }
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

      /* One line of chips that shrinks before the name does; a chip's label
         ends in an ellipsis (on the span — a flex button clips its text
         without one). */
      .doc-chips {
        display: flex;
        flex: 0 1 auto;
        min-width: 0;
        max-width: 40%;
        gap: 4px;
        overflow: hidden;
      }
      .doc-chip {
        display: inline-flex;
        align-items: center;
        flex: 0 1 auto;
        min-width: 0;
        gap: 3px;
        max-width: 22ch;
        padding: 1px 6px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 10px;
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        font-size: 11px;
        cursor: pointer;
        white-space: nowrap;
      }
      .doc-chip span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
      .doc-chip:hover { color: var(--primary-color); border-color: var(--primary-color); }
      .doc-chip ha-icon { --mdc-icon-size: 12px; width: 12px; height: 12px; flex: none; }
      .doc-more { flex: none; }
      /* Narrow (a phone, a dashboard column): the chips get a line of their
         own under the task. Beside it, three of them left the task's name
         one letter wide and broke its object and type over three lines. */
      @container ms-tasks (max-width: 600px) {
        .task-item { flex-wrap: wrap; row-gap: 2px; }
        .doc-chips {
          order: 1;
          flex: 1 0 100%;
          max-width: none;
          box-sizing: border-box;
          padding-inline-start: 20px;
        }
      }
      /* nowrap: the due label is localized via formatDueDays ("5 d overdue",
         "5 T überfällig") — without it a narrow phone card wraps that onto a
         second line and the row grows taller. The name column ellipsizes
         instead, which it already does by design. */
      .task-due { font-size: 13px; color: var(--secondary-text-color); min-width: 40px; text-align: right; white-space: nowrap; }
      .overdue-text { color: var(--error-color); font-weight: 500; }

      .complete-btn {
        display: inline-flex;
        --ha-icon-button-size: 32px;
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 18px;
        color: var(--primary-color);
      }
      /* DESIGN PROTOTYPE (#145): action_style: buttons — HA-native labelled button. */
      .complete-btn-text { --ha-button-font-size: 13px; flex: none; white-space: nowrap; }
      .complete-btn-text ha-icon { --mdc-icon-size: 18px; }
    `],d([b({attribute:!1})],B.prototype,"hass",2),d([u()],B.prototype,"_config",2),d([u()],B.prototype,"_globalRowStyle",2),d([u()],B.prototype,"_settings",2),d([u()],B.prototype,"_firstLoadDone",2),d([u()],B.prototype,"_objects",2),d([u()],B.prototype,"_stats",2),d([u()],B.prototype,"_unsub",2),d([u()],B.prototype,"_viewFilters",2),d([u()],B.prototype,"_userNames",2),d([u()],B.prototype,"_taskDocs",2);customElements.get("maintenance-supporter-card")||customElements.define("maintenance-supporter-card",B);tt({type:"maintenance-supporter-card",name:"Maintenance Supporter",description:"Overview of your maintenance tasks with quick actions.",preview:!0});bi();An(["maintenance-supporter-card","maintenance-battery-fleet-card","maintenance-supporter-panel-card"],import.meta.url);export{B as MaintenanceSupporterCard};
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
