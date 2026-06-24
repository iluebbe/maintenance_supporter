var vi=Object.defineProperty;var fi=Object.getOwnPropertyDescriptor;var p=(l,r,e,t)=>{for(var i=t>1?void 0:t?fi(r,e):r,a=l.length-1,n;a>=0;a--)(n=l[a])&&(i=(t?n(r,e,i):n(i))||i);return t&&i&&vi(r,e,i),i};var Ae=globalThis,je=Ae.ShadowRoot&&(Ae.ShadyCSS===void 0||Ae.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ge=Symbol(),vt=new WeakMap,me=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==Ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(je&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=vt.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&vt.set(e,r))}return r}toString(){return this.cssText}},ft=l=>new me(typeof l=="string"?l:l+"",void 0,Ge),M=(l,...r)=>{let e=l.length===1?l[0]:r.reduce((t,i,a)=>t+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+l[a+1],l[0]);return new me(e,l,Ge)},bt=(l,r)=>{if(je)l.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),i=Ae.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,l.appendChild(t)}},Qe=je?l=>l:l=>l instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return ft(e)})(l):l;var{is:bi,defineProperty:yi,getOwnPropertyDescriptor:xi,getOwnPropertyNames:$i,getOwnPropertySymbols:wi,getPrototypeOf:ki}=Object,Ce=globalThis,yt=Ce.trustedTypes,Ei=yt?yt.emptyScript:"",Ti=Ce.reactiveElementPolyfillSupport,ve=(l,r)=>l,fe={toAttribute(l,r){switch(r){case Boolean:l=l?Ei:null;break;case Object:case Array:l=l==null?l:JSON.stringify(l)}return l},fromAttribute(l,r){let e=l;switch(r){case Boolean:e=l!==null;break;case Number:e=l===null?null:Number(l);break;case Object:case Array:try{e=JSON.parse(l)}catch{e=null}}return e}},Me=(l,r)=>!bi(l,r),xt={attribute:!0,type:String,converter:fe,reflect:!1,useDefault:!1,hasChanged:Me};Symbol.metadata??=Symbol("metadata"),Ce.litPropertyMetadata??=new WeakMap;var ee=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=xt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(r,t,e);i!==void 0&&yi(this.prototype,r,i)}}static getPropertyDescriptor(r,e,t){let{get:i,set:a}=xi(this.prototype,r)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let c=i?.call(this);a?.call(this,n),this.requestUpdate(r,c,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??xt}static _$Ei(){if(this.hasOwnProperty(ve("elementProperties")))return;let r=ki(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(ve("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ve("properties"))){let e=this.properties,t=[...$i(e),...wi(e)];for(let i of t)this.createProperty(i,e[i])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let i of t)e.unshift(Qe(i))}else r!==void 0&&e.push(Qe(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return bt(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),i=this.constructor._$Eu(r,t);if(i!==void 0&&t.reflect===!0){let a=(t.converter?.toAttribute!==void 0?t.converter:fe).toAttribute(e,t.type);this._$Em=r,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(r,e){let t=this.constructor,i=t._$Eh.get(r);if(i!==void 0&&this._$Em!==i){let a=t.getPropertyOptions(i),n=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:fe;this._$Em=i;let c=n.fromAttribute(e,a.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(r,e,t,i=!1,a){if(r!==void 0){let n=this.constructor;if(i===!1&&(a=this[r]),t??=n.getPropertyOptions(r),!((t.hasChanged??Me)(a,e)||t.useDefault&&t.reflect&&a===this._$Ej?.get(r)&&!this.hasAttribute(n._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:i,wrapped:a},n){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,n??e??this[r]),a!==!0||n!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),i===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,a]of t){let{wrapped:n}=a,c=this[i];n!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,a,c)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};ee.elementStyles=[],ee.shadowRootOptions={mode:"open"},ee[ve("elementProperties")]=new Map,ee[ve("finalized")]=new Map,Ti?.({ReactiveElement:ee}),(Ce.reactiveElementVersions??=[]).push("2.1.2");var st=globalThis,$t=l=>l,Ie=st.trustedTypes,wt=Ie?Ie.createPolicy("lit-html",{createHTML:l=>l}):void 0,jt="$lit$",re=`lit$${Math.random().toFixed(9).slice(2)}$`,Ct="?"+re,Si=`<${Ct}>`,ce=document,ye=()=>ce.createComment(""),xe=l=>l===null||typeof l!="object"&&typeof l!="function",at=Array.isArray,Ai=l=>at(l)||typeof l?.[Symbol.iterator]=="function",Je=`[ 	
\f\r]`,be=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,kt=/-->/g,Et=/>/g,oe=RegExp(`>|${Je}(?:([^\\s"'>=/]+)(${Je}*=${Je}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Tt=/'/g,St=/"/g,Mt=/^(?:script|style|textarea|title)$/i,rt=l=>(r,...e)=>({_$litType$:l,strings:r,values:e}),o=rt(1),z=rt(2),xs=rt(3),te=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),At=new WeakMap,le=ce.createTreeWalker(ce,129);function It(l,r){if(!at(l)||!l.hasOwnProperty("raw"))throw Error("invalid template strings array");return wt!==void 0?wt.createHTML(r):r}var ji=(l,r)=>{let e=l.length-1,t=[],i,a=r===2?"<svg>":r===3?"<math>":"",n=be;for(let c=0;c<e;c++){let u=l[c],_,m,g=-1,v=0;for(;v<u.length&&(n.lastIndex=v,m=n.exec(u),m!==null);)v=n.lastIndex,n===be?m[1]==="!--"?n=kt:m[1]!==void 0?n=Et:m[2]!==void 0?(Mt.test(m[2])&&(i=RegExp("</"+m[2],"g")),n=oe):m[3]!==void 0&&(n=oe):n===oe?m[0]===">"?(n=i??be,g=-1):m[1]===void 0?g=-2:(g=n.lastIndex-m[2].length,_=m[1],n=m[3]===void 0?oe:m[3]==='"'?St:Tt):n===St||n===Tt?n=oe:n===kt||n===Et?n=be:(n=oe,i=void 0);let f=n===oe&&l[c+1].startsWith("/>")?" ":"";a+=n===be?u+Si:g>=0?(t.push(_),u.slice(0,g)+jt+u.slice(g)+re+f):u+re+(g===-2?c:f)}return[It(l,a+(l[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},$e=class l{constructor({strings:r,_$litType$:e},t){let i;this.parts=[];let a=0,n=0,c=r.length-1,u=this.parts,[_,m]=ji(r,e);if(this.el=l.createElement(_,t),le.currentNode=this.el.content,e===2||e===3){let g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(i=le.nextNode())!==null&&u.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let g of i.getAttributeNames())if(g.endsWith(jt)){let v=m[n++],f=i.getAttribute(g).split(re),x=/([.?@])?(.*)/.exec(v);u.push({type:1,index:a,name:x[2],strings:f,ctor:x[1]==="."?Xe:x[1]==="?"?et:x[1]==="@"?tt:ue}),i.removeAttribute(g)}else g.startsWith(re)&&(u.push({type:6,index:a}),i.removeAttribute(g));if(Mt.test(i.tagName)){let g=i.textContent.split(re),v=g.length-1;if(v>0){i.textContent=Ie?Ie.emptyScript:"";for(let f=0;f<v;f++)i.append(g[f],ye()),le.nextNode(),u.push({type:2,index:++a});i.append(g[v],ye())}}}else if(i.nodeType===8)if(i.data===Ct)u.push({type:2,index:a});else{let g=-1;for(;(g=i.data.indexOf(re,g+1))!==-1;)u.push({type:7,index:a}),g+=re.length-1}a++}}static createElement(r,e){let t=ce.createElement("template");return t.innerHTML=r,t}};function pe(l,r,e=l,t){if(r===te)return r;let i=t!==void 0?e._$Co?.[t]:e._$Cl,a=xe(r)?void 0:r._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(l),i._$AT(l,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(r=pe(l,i._$AS(l,r.values),i,t)),r}var Ze=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,i=(r?.creationScope??ce).importNode(e,!0);le.currentNode=i;let a=le.nextNode(),n=0,c=0,u=t[0];for(;u!==void 0;){if(n===u.index){let _;u.type===2?_=new we(a,a.nextSibling,this,r):u.type===1?_=new u.ctor(a,u.name,u.strings,this,r):u.type===6&&(_=new it(a,this,r)),this._$AV.push(_),u=t[++c]}n!==u?.index&&(a=le.nextNode(),n++)}return le.currentNode=ce,i}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},we=class l{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=pe(this,r,e),xe(r)?r===d||r==null||r===""?(this._$AH!==d&&this._$AR(),this._$AH=d):r!==this._$AH&&r!==te&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Ai(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==d&&xe(this._$AH)?this._$AA.nextSibling.data=r:this.T(ce.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,i=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=$e.createElement(It(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let a=new Ze(i,this),n=a.u(this.options);a.p(e),this.T(n),this._$AH=a}}_$AC(r){let e=At.get(r.strings);return e===void 0&&At.set(r.strings,e=new $e(r)),e}k(r){at(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let a of r)i===e.length?e.push(t=new l(this.O(ye()),this.O(ye()),this,this.options)):t=e[i],t._$AI(a),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=$t(r).nextSibling;$t(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},ue=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,i,a){this.type=1,this._$AH=d,this._$AN=void 0,this.element=r,this.name=e,this._$AM=i,this.options=a,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=d}_$AI(r,e=this,t,i){let a=this.strings,n=!1;if(a===void 0)r=pe(this,r,e,0),n=!xe(r)||r!==this._$AH&&r!==te,n&&(this._$AH=r);else{let c=r,u,_;for(r=a[0],u=0;u<a.length-1;u++)_=pe(this,c[t+u],e,u),_===te&&(_=this._$AH[u]),n||=!xe(_)||_!==this._$AH[u],_===d?r=d:r!==d&&(r+=(_??"")+a[u+1]),this._$AH[u]=_}n&&!i&&this.j(r)}j(r){r===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},Xe=class extends ue{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===d?void 0:r}},et=class extends ue{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==d)}},tt=class extends ue{constructor(r,e,t,i,a){super(r,e,t,i,a),this.type=5}_$AI(r,e=this){if((r=pe(this,r,e,0)??d)===te)return;let t=this._$AH,i=r===d&&t!==d||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,a=r!==d&&(t===d||i);i&&this.element.removeEventListener(this.name,this,t),a&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},it=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){pe(this,r)}};var Ci=st.litHtmlPolyfillSupport;Ci?.($e,we),(st.litHtmlVersions??=[]).push("3.3.2");var Rt=(l,r,e)=>{let t=e?.renderBefore??r,i=t._$litPart$;if(i===void 0){let a=e?.renderBefore??null;t._$litPart$=i=new we(r.insertBefore(ye(),a),a,void 0,e??{})}return i._$AI(l),i};var nt=globalThis,C=class extends ee{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=Rt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return te}};C._$litElement$=!0,C.finalized=!0,nt.litElementHydrateSupport?.({LitElement:C});var Mi=nt.litElementPolyfillSupport;Mi?.({LitElement:C});(nt.litElementVersions??=[]).push("4.2.2");var Lt=l=>(r,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(l,r)}):customElements.define(l,r)};var Ii={attribute:!0,type:String,converter:fe,reflect:!1,hasChanged:Me},Ri=(l=Ii,r,e)=>{let{kind:t,metadata:i}=e,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),t==="setter"&&((l=Object.create(l)).wrapped=!0),a.set(e.name,l),t==="accessor"){let{name:n}=e;return{set(c){let u=r.get.call(this);r.set.call(this,c),this.requestUpdate(n,u,l,!0,c)},init(c){return c!==void 0&&this.C(n,void 0,l,c),c}}}if(t==="setter"){let{name:n}=e;return function(c){let u=this[n];r.call(this,c),this.requestUpdate(n,u,l,!0,c)}}throw Error("Unsupported decorator location: "+t)};function w(l){return(r,e)=>typeof e=="object"?Ri(l,r,e):((t,i,a)=>{let n=i.hasOwnProperty(a);return i.constructor.createProperty(a,t),n?Object.getOwnPropertyDescriptor(i,a):void 0})(l,r,e)}function h(l){return w({...l,state:!0,attribute:!1})}var qt={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",ok:"OK",all:"All",new_object:"+ New Object",edit:"Edit",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",reset:"Reset",cancel:"Cancel",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",runtime_hours:"Target runtime (hours)",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",custom:"Custom",history:"History",cost:"Cost",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_optional:"Due at time (optional, HH:MM)",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",tasks_lower:"tasks",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",safety_interval:"Safety interval (optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_window_7:"7 days",cal_window_14:"14 days",cal_window_30:"30 days",cal_window_365:"1 year",cal_every_n_days:"every {n} days",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",no_advanced_features_hint:"Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",completions:"completions",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_predictions:"Sensor Predictions",feat_predictions_desc:"Predict trigger dates from sensor degradation",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_snooze_hours:"Snooze duration (hours)",settings_budget:"Budget",settings_currency:"Currency",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_import_csv:"Import CSV",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",filter_label:"Filter",user_label:"User",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",group_delete_confirm:'Delete group "{name}"?',groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else sees only Complete and Skip.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc:"Per-task HA action on complete + quick-complete QR with pre-set values.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_service:"Service",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",quick_complete_defaults_title:"Quick-complete defaults (for QR scans, optional)",quick_complete_defaults_desc:"Pre-set values for quick-complete QR scans. Without these, the QR opens the complete dialog.",quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026"};var qe={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"#ff5722"},Pt={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",completed:"mdi:check-circle",skipped:"mdi:skip-next",reset:"mdi:refresh"},lt="en",ke={en:qt},qi=new Set(["de","nl","fr","it","es","pt","ru","uk","pl","cs","sv","zh"]),Hi="/maintenance_supporter_locales",ot={};function ct(l){return(l||lt).substring(0,2).toLowerCase()}function s(l,r){let e=ct(r);return ke[e]?.[l]??ke.en[l]??l}function He(l){let r=ct(l);return r===lt||r in ke}function Pe(l){let r=ct(l);return r===lt||r in ke||!qi.has(r)?Promise.resolve():(r in ot||(ot[r]=fetch(`${Hi}/${r}.json`).then(e=>e.ok?e.json():null).then(e=>{e&&(ke[r]=e)}).catch(()=>{})),ot[r])}function zt(l){let r=(l||"en").substring(0,2).toLowerCase();return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN"}[r]??"en-US"}function Q(l,r){if(!l)return"\u2014";try{let e=l.includes("T")?l:l+"T00:00:00";return new Date(e).toLocaleDateString(zt(r),{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return l}}function dt(l,r){if(!l)return"\u2014";try{let e=zt(r),t=new Date(l);return t.toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}catch{return l}}function ze(l,r){if(l==null)return"\u2014";let e=r||"en";return l<0?`${Math.abs(l)} ${s("d_overdue",e)}`:l===0?s("today",e):`${l} ${s(l===1?"day":"days",e)}`}function Ht(l,r,e){return l==null?"\u2014":`${l} ${s("unit_"+(r||"days"),e)}`}function Le(l,r,e="long"){let t=(r||"en").substring(0,2);return new Date(Date.UTC(2024,0,1+l)).toLocaleDateString(t,{weekday:e,timeZone:"UTC"})}function Dt(l,r){let e=l.schedule;switch(e?.kind){case"weekdays":return(e.weekdays||[]).map(t=>Le(t,r,"short")).join(" & ")||"\u2014";case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?s("ord_last",r):s("ord_"+e.nth,r)} ${Le(e.weekday,r,"long")}`;case"day_of_month":return e.day!=null?`${s("day_word",r)} ${e.day}`:"\u2014";case"one_time":return l.due_date?Q(l.due_date,r):s("one_time",r);case"manual":return s("manual",r);case"interval":return Ht(e.every,e.unit,r)}return l.schedule_type==="one_time"?l.due_date?Q(l.due_date,r):s("one_time",r):l.schedule_type==="manual"?s("manual",r):l.interval_days!=null?Ht(l.interval_days,l.interval_unit,r):"\u2014"}function de(l,r){l.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:r},bubbles:!0,composed:!0}))}var De=M`
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
`;var Pi={days:1,weeks:7,months:30.4368,years:365.25};function pt(l,r){return!l||l<=0?0:l*(Pi[r||"days"]??1)}function ut(l,r,e){let t=pt(l,e);if(t<=0||r==null)return{pct:0,overflow:!1};let i=(t-r)/t*100;return{pct:Math.max(0,Math.min(100,i)),overflow:i>100}}function _t(l,r=new Date){if(!l)return{kind:"none",days:null,date:null};let e=new Date(`${l}T00:00:00`);if(isNaN(e.getTime()))return{kind:"none",days:null,date:null};let t=Date.UTC(r.getFullYear(),r.getMonth(),r.getDate()),i=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate()),a=Math.round((i-t)/864e5);return a<0?{kind:"expired",days:a,date:l}:a<=60?{kind:"expiring",days:a,date:l}:{kind:"valid",days:a,date:l}}var _e=[{key:"name",labelKey:"name",required:!0},{key:"manufacturer",labelKey:"manufacturer"},{key:"model",labelKey:"model"},{key:"serial_number",labelKey:"serial_number_label"},{key:"installation_date",labelKey:"installed"},{key:"warranty_expiry",labelKey:"warranty"},{key:"area_id",labelKey:"area"},{key:"documentation_url",labelKey:"documentation_url_label"},{key:"notes",labelKey:"object_notes_label"},{key:"task_count",labelKey:"tasks"},{key:"actions",labelKey:"actions"}],zi=_e.map(l=>l.key),Fe=["name","manufacturer","model","serial_number","installation_date","warranty_expiry","area_id","task_count","actions"];function Ee(l){if(!Array.isArray(l))return[...Fe];let r=new Set,e=[];for(let t of l)typeof t=="string"&&zi.includes(t)&&!r.has(t)&&(r.add(t),e.push(t));return e.length?(e.includes("name")||e.unshift("name"),e):[...Fe]}function Oe(l,r,e){let t=new Blob([l],{type:e}),i=URL.createObjectURL(t),a=document.createElement("a");a.href=i,a.download=r,a.target="_blank",a.rel="noopener",a.style.display="none",document.body.appendChild(a),a.dispatchEvent(new MouseEvent("click")),document.body.removeChild(a),setTimeout(()=>URL.revokeObjectURL(i),6e4)}var Ft=M`
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

  /* Desktop: the LIST owns the 7-column grid and every row is a subgrid
     spanning all columns. Sharing the tracks across rows is what actually
     keeps the title (and every other column) aligned regardless of which
     optional badges/chips a given row carries. A per-row grid can't: each
     row would size its auto badges column independently, so a row with an
     NFC badge pushed its title right of the others (issue #66). */
  .task-table {
    display: grid;
    grid-template-columns:
      auto                         /* badges */
      minmax(100px, 180px)         /* object-name */
      minmax(120px, 1fr)           /* task-name */
      minmax(0, 220px)             /* task-sub (chips) */
      100px                        /* type */
      150px                        /* due-cell */
      auto;                        /* row-actions */
    column-gap: 12px;
  }

  .task-row {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    align-items: center;
    column-gap: 12px;
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
  /* v1.4.10 (#46): per-object free-form notes block */
  .object-notes {
    margin: 12px 0 4px;
    padding: 12px 14px;
    background: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    border-left: 3px solid var(--primary-color, #03a9f4);
    border-radius: 4px;
  }
  .object-notes-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-bottom: 6px;
  }
  .object-notes-body {
    color: var(--primary-text-color);
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.45;
  }
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

  .status-chip.done {
    background: #78909c;
    color: white;
  }

  /* (#67) Warranty status chip — object detail meta + objects table */
  .warranty-chip {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }
  .warranty-valid {
    background: rgba(76, 175, 80, 0.15);
    color: var(--success-color, #2e7d32);
  }
  .warranty-expiring {
    background: rgba(255, 152, 0, 0.18);
    color: var(--warning-color, #e65100);
  }
  .warranty-expired {
    background: rgba(244, 67, 54, 0.16);
    color: var(--error-color, #c62828);
  }
  .warranty-none {
    color: var(--secondary-text-color);
  }

  /* (#67) All-Objects view-mode toggle (cards / table) */
  .view-toggle {
    display: inline-flex;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    overflow: hidden;
    align-self: end;
  }
  .view-toggle-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    background: var(--card-background-color, #fff);
    color: var(--secondary-text-color);
    border: none;
    cursor: pointer;
  }
  .view-toggle-btn + .view-toggle-btn { border-left: 1px solid var(--divider-color); }
  .view-toggle-btn.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .view-toggle-btn ha-icon { --mdc-icon-size: 18px; }

  /* (#67) Objects table (desktop All-Objects view) */
  .objects-table-wrap {
    overflow-x: auto;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
  }
  .objects-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  .objects-table th,
  .objects-table td {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid var(--divider-color);
    white-space: nowrap;
  }
  .objects-table thead th {
    font-weight: 600;
    color: var(--secondary-text-color);
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
    position: sticky;
    top: 0;
  }
  .objects-table tbody tr { cursor: pointer; }
  .objects-table tbody tr:hover {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
  }
  .objects-table tbody tr:last-child td { border-bottom: none; }
  .objects-table-name { font-weight: 500; color: var(--primary-text-color); }
  .objects-table .oc-notes {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .objects-table .oc-task_count,
  .objects-table .oc-actions { text-align: center; }

  .user-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 8px;
    margin-left: 8px;
    background: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    line-height: 1.4;
  }

  .user-badge ha-icon {
    --mdc-icon-size: 12px;
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

  :host([narrow]) .task-table { display: block; }

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
    grid-column: auto;
    grid-template-columns: auto minmax(0, 1fr) 100px auto;
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
      grid-template-columns: auto minmax(0, 1fr) 100px auto;
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
`;var Ne=class{constructor(r){this._cache=new Map;this._pending=new Map;this._hass=r}updateHass(r){this._hass=r}async getDetailStats(r,e){return this._getStats(r,"hour",30,e)}async getMiniStats(r,e){return this._getStats(r,"day",14,e)}async getBatchMiniStats(r){let e=new Map,t=[];for(let u of r){let _=`${u.entityId}:day`,m=this._cache.get(_);m&&Date.now()-m.fetchedAt<3e5?e.set(u.entityId,m.points):t.push(u)}if(t.length===0)return e;let i=t.filter(u=>u.isCounter).map(u=>u.entityId),a=t.filter(u=>!u.isCounter).map(u=>u.entityId),n=new Date(Date.now()-336*60*60*1e3).toISOString(),c=[];return i.length>0&&c.push(this._fetchBatch(i,"day",n,["state","sum","change"],!0,e)),a.length>0&&c.push(this._fetchBatch(a,"day",n,["mean","min","max"],!1,e)),await Promise.all(c),e}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(r,e,t,i){let a=`${r}:${e}`,n=this._cache.get(a);if(n&&Date.now()-n.fetchedAt<3e5)return n.points;if(this._pending.has(a))return this._pending.get(a);let c=this._fetchAndNormalize(r,e,t,i,a);this._pending.set(a,c);try{return await c}finally{this._pending.delete(a)}}async _fetchAndNormalize(r,e,t,i,a){let n=new Date(Date.now()-t*24*60*60*1e3).toISOString(),c=i?["state","sum","change"]:["mean","min","max"];try{let _=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:n,statistic_ids:[r],period:e,types:c}))[r]||[],m=this._normalizeRows(_,i);return this._cache.set(a,{entityId:r,fetchedAt:Date.now(),period:e,points:m}),m}catch(u){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${r}:`,u),[]}}async _fetchBatch(r,e,t,i,a,n){try{let c=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:t,statistic_ids:r,period:e,types:i});for(let u of r){let _=c[u]||[],m=this._normalizeRows(_,a);n.set(u,m),this._cache.set(`${u}:${e}`,{entityId:u,fetchedAt:Date.now(),period:e,points:m})}}catch(c){console.warn("[maintenance-supporter] Batch statistics fetch failed:",c)}}_normalizeRows(r,e){let t=[];for(let i of r){let a=null;if(e?a=i.state??null:a=i.mean??null,a===null)continue;let n={ts:i.start,val:a};e||(i.min!=null&&(n.min=i.min),i.max!=null&&(n.max=i.max)),t.push(n)}return t.sort((i,a)=>i.ts-a.ts),t}};var ne=class{constructor(r){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=r}updateHass(r){this.hass=r}async getUsers(r=!1){let e=Date.now();if(!r&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(r,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:r,task_id:e,user_id:t})}async getTasksByUser(r){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:r})).tasks}getUserName(r){return!r||!this.usersCache?null:this.usersCache.find(t=>t.id===r)?.name||null}getUser(r){return!r||!this.usersCache?null:this.usersCache.find(e=>e.id===r)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(r){return r?r===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};var Di={name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",group_name:"name",group_description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_for_minutes:"trigger_for_minutes"};function Fi(l,r){let e=Di[l];if(!e)return l;let t=s(e,r);return t&&t!==e?t:l}function Oi(l){let e=l.match(/data\['([^']+)'\]/)?.[1],t;return(t=l.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=l.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=l.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=l.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(l)?{field:e,rule:"required"}:(t=l.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(l)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(l)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function V(l,r,e){if(typeof l=="string")return l;if(typeof l!="object"||l===null)return e;let t=l,i=t.message||t.error?.message||"";if(!i)return e;let a=Oi(i),n=a.field?Fi(a.field,r):"",c=u=>s(u,r).replace("{field}",n).replace("{n}",a.param??"");switch(a.rule){case"too_long":return c("err_too_long");case"too_short":return c("err_too_short");case"value_too_high":return c("err_value_too_high");case"value_too_low":return c("err_value_too_low");case"required":return c("err_required");case"wrong_type":return c("err_wrong_type").replace("{type}",a.param??"");case"invalid_choice":return c("err_invalid_choice");case"invalid_value":return c("err_invalid_value");default:return i||e}}var B=class extends C{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){return o`
      <label class="field">
        ${this.label?o`<span class="label">${this.label}${this.required?o`<span class="req">*</span>`:d}</span>`:d}
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??d}
          min=${this.min??d}
          max=${this.max??d}
          pattern=${this.pattern??d}
          @input=${this._onInput}
          @change=${this._onInput}
        />
        ${this.helper?o`<span class="helper">${this.helper}</span>`:d}
      </label>
    `}};B.styles=M`
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
  `,p([w()],B.prototype,"label",2),p([w()],B.prototype,"value",2),p([w()],B.prototype,"placeholder",2),p([w()],B.prototype,"type",2),p([w({type:Boolean})],B.prototype,"required",2),p([w({type:Boolean})],B.prototype,"disabled",2),p([w()],B.prototype,"step",2),p([w()],B.prototype,"min",2),p([w()],B.prototype,"max",2),p([w()],B.prototype,"pattern",2),p([w()],B.prototype,"helper",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",B);var N=class extends C{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._entryId=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._error="",this._open=!0}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(e){this._error=V(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}render(){if(!this._open)return o``;let e=this._lang,t=this._entryId?s("edit_object",e):s("new_object",e);return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:d}
          <ms-textfield
            label="${s("name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${i=>this._manufacturer=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("model_optional",e)}"
            .value=${this._model}
            @input=${i=>this._model=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${i=>this._serialNumber=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${s("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${i=>this._areaId=i.detail.value||""}
          ></ha-area-picker>
          <ms-textfield
            label="${s("installation_date_optional",e)}"
            type="date"
            .value=${this._installationDate}
            @input=${i=>this._installationDate=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("warranty_expiry_optional",e)}"
            type="date"
            .value=${this._warrantyExpiry}
            @input=${i=>this._warrantyExpiry=i.target.value}
          ></ms-textfield>
          <label class="textarea-field">
            <span class="textarea-label">${s("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${i=>this._notes=i.target.value}
            ></textarea>
          </label>
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
    `}};N.styles=M`
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
  `,p([w({attribute:!1})],N.prototype,"hass",2),p([h()],N.prototype,"_open",2),p([h()],N.prototype,"_loading",2),p([h()],N.prototype,"_error",2),p([h()],N.prototype,"_name",2),p([h()],N.prototype,"_manufacturer",2),p([h()],N.prototype,"_model",2),p([h()],N.prototype,"_serialNumber",2),p([h()],N.prototype,"_areaId",2),p([h()],N.prototype,"_installationDate",2),p([h()],N.prototype,"_warrantyExpiry",2),p([h()],N.prototype,"_documentationUrl",2),p([h()],N.prototype,"_notes",2),p([h()],N.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",N);var Ni=["cleaning","inspection","replacement","calibration","service","custom"],Ui=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],Bi=["weekdays","nth_weekday","day_of_month"],Wi=["threshold","counter","state_change","runtime"];function Vi(l){return Array.from({length:7},(r,e)=>Le(e,l,"short"))}var $=class extends C{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._notes="";this._documentationUrl="";this._customIcon="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._availableTags=[];this._responsibleUserId=null;this._availableUsers=[];this._checklistText="";this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._userService=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}async openCreate(e,t){this._entryId=e,this._taskId=null,this._error="",!e&&t&&t.length>0?(this._objectChoices=t.map(i=>({entry_id:i.entry_id,name:i.object.name})).sort((i,a)=>i.name.localeCompare(a.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}async openEdit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let i=t.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"?String(i.day??1):"1",this._warningDays=t.warning_days.toString(),this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._nfcTagId=t.nfc_tag_id||"",this._responsibleUserId=t.responsible_user_id||null,this._checklistText=(t.checklist||[]).join(`
`),this._scheduleTime=t.schedule_time||"";let a=t.on_complete_action;if(a&&a.service){this._actionService=a.service;let u=a.target?.entity_id;this._actionTargetEntity=Array.isArray(u)?u[0]||"":u||"",this._actionData=a.data&&typeof a.data=="object"?{...a.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let n=t.quick_complete_defaults;this._qcNotes=n?.notes||"",this._qcCost=n?.cost!=null?String(n.cost):"",this._qcDuration=n?.duration!=null?String(n.duration):"",this._qcFeedback=n?.feedback||"";let c=t.adaptive_config||{};if(this._environmentalEntity=c.environmental_entity||"",this._environmentalAttribute=c.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,t.trigger_config){let u=t.trigger_config;this._triggerEntityId=u.entity_id||"",this._triggerEntityIds=u.entity_ids||(u.entity_id?[u.entity_id]:[]),this._triggerEntityLogic=u.entity_logic||"any",this._triggerAttribute=u.attribute||"",this._triggerType=u.type||"threshold",this._triggerAbove=u.trigger_above?.toString()||"",this._triggerBelow=u.trigger_below?.toString()||"",this._triggerForMinutes=u.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=u.trigger_target_value?.toString()||"",this._triggerDeltaMode=u.trigger_delta_mode||!1,this._triggerFromState=u.trigger_from_state||"",this._triggerToState=u.trigger_to_state||"",this._triggerTargetChanges=u.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=u.trigger_runtime_hours?.toString()||""}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._notes="",this._documentationUrl="",this._customIcon="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._responsibleUserId=null,this._checklistText="",this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours=""}async _loadUsers(){this._userService||(this._userService=new ne(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,i]=e.split(".");if(!this.hass?.services?.[t]?.[i]){this._actionTestResult="error",this._actionTestError=`Service "${e}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let a=this._actionTargetEntity.trim();if(a){let n=a.split(".")[0];if(n!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=`Service "${e}" only works on ${t}.* entities; entity "${a}" is in ${n}.* \u2014 pick a service that matches the entity domain (e.g. ${n}.${i})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[a]){this._actionTestResult="error",this._actionTestError=`Target entity "${a}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,i]=e.split("."),a=this.hass?.services?.[t]?.[i]?.fields;return!a||Object.keys(a).length===0?null:Object.entries(a).map(([n,c])=>({name:n,required:!!c.required,selector:c.selector||{text:{}}}))}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled)return d;let t=this._serviceSchema();return o`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",e)}</summary>
        <p class="field-help">${s("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let a=this._serviceSchema();if(a){let n=new Set(a.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>n.has(c)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",e)}
          @value-changed=${i=>{let a=i.detail.value;this._actionTargetEntity=a.target_entity||""}}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",e)}
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
                label="${s("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${i=>{this._actionDataJsonFallback=i.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":s("on_complete_action_test",e)}
          </button>
          ${this._actionTestResult==="ok"?o`<span class="ca-test-ok">${s("on_complete_action_test_success",e)}</span>`:d}
          ${this._actionTestResult==="error"?o`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?o`<div class="ca-test-error-detail">${this._actionTestError}</div>`:d}
              </div>`:d}
        </div>
      </details>

      <details class="ca-section">
        <summary>${s("quick_complete_defaults_title",e)}</summary>
        <p class="field-help">${s("quick_complete_defaults_desc",e)}</p>
        <ms-textfield
          label="${s("quick_complete_defaults_notes",e)}"
          .value=${this._qcNotes}
          @input=${i=>{this._qcNotes=i.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${s("quick_complete_defaults_cost",e)}"
          type="number" min="0" step="0.01"
          .value=${this._qcCost}
          @input=${i=>{this._qcCost=i.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${s("quick_complete_defaults_duration",e)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${i=>{this._qcDuration=i.target.value}}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${i=>{this._qcFeedback=i.target.value}}>
          <option value="">${s("quick_complete_defaults_feedback_none",e)}</option>
          <option value="needed">${s("quick_complete_defaults_feedback_needed",e)}</option>
          <option value="not_needed">${s("quick_complete_defaults_feedback_not_needed",e)}</option>
        </select>
      </details>
    `}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=t.domain||"",this._suggestedAttributes=t.suggested_attributes||[],this._availableAttributes=t.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:parseInt(this._warningDays,10)||7};if(this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):Bi.includes(this._scheduleType)?(e.schedule=this._buildSchedule(),e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.enabled=this._enabled,e.last_performed=this._lastPerformed||null,e.nfc_tag_id=this._nfcTagId||null,e.responsible_user_id=this._responsibleUserId,this._scheduleType==="sensor_based"&&this._triggerEntityId){let n=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],c={entity_id:n[0],entity_ids:n,type:this._triggerType};if(this._triggerAttribute&&(c.attribute=this._triggerAttribute),n.length>1&&(c.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let u=parseFloat(this._triggerAbove);isNaN(u)||(c.trigger_above=u)}if(this._triggerBelow){let u=parseFloat(this._triggerBelow);isNaN(u)||(c.trigger_below=u)}if(this._triggerForMinutes){let u=parseInt(this._triggerForMinutes,10);isNaN(u)||(c.trigger_for_minutes=u)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let u=parseFloat(this._triggerTargetValue);isNaN(u)||(c.trigger_target_value=u)}c.trigger_delta_mode=this._triggerDeltaMode}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(c.trigger_from_state=this._triggerFromState),this._triggerToState&&(c.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let u=parseInt(this._triggerTargetChanges,10);isNaN(u)||(c.trigger_target_changes=u)}}else if(this._triggerType==="runtime"&&this._triggerRuntimeHours){let u=parseFloat(this._triggerRuntimeHours);isNaN(u)||(c.trigger_runtime_hours=u)}e.trigger_config=c}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let n=this._scheduleTime.trim();e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(n)?n:null}if(this.checklistsEnabled){let n=this._checklistText.split(`
`).map(c=>c.trim()).filter(Boolean).slice(0,100);e.checklist=n.length?n:null}if(this.completionActionsEnabled){let n=this._actionService.trim();if(n&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(n)){let m={service:n},g=this._actionTargetEntity.trim();g&&(m.target={entity_id:g});let v=this._buildActionData();Object.keys(v).length>0&&(m.data=v),e.on_complete_action=m}else e.on_complete_action=null;let c={};this._qcNotes.trim()&&(c.notes=this._qcNotes.trim());let u=parseFloat(this._qcCost);!isNaN(u)&&u>=0&&(c.cost=u);let _=parseInt(this._qcDuration,10);!isNaN(_)&&_>=0&&(c.duration=_),this._qcFeedback&&(c.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(c).length?c:null}let t=await this.hass.connection.sendMessagePromise(e),i=this._taskId||t?.task_id,a=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(i&&this._scheduleType==="sensor_based"&&a)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:i,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(e){this._error=V(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return d;let e=this._lang;return o`
      <h3>${s("trigger_configuration",e)}</h3>
      <ms-textfield
        label="${s("entity_id",e)} (${s("comma_separated",e)})"
        .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
        @input=${t=>{let a=t.target.value.split(",").map(n=>n.trim()).filter(Boolean);this._triggerEntityId=a[0]||"",this._triggerEntityIds=a,a[0]&&this._fetchEntityAttributes(a[0])}}
      ></ms-textfield>
      ${this._triggerEntityIds.length>1?o`
        <div class="select-row">
          <label>${s("entity_logic",e)}</label>
          <select
            .value=${this._triggerEntityLogic}
            @change=${t=>this._triggerEntityLogic=t.target.value}
          >
            <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${s("entity_logic_any",e)}</option>
            <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${s("entity_logic_all",e)}</option>
          </select>
        </div>
      `:d}
      ${this._availableAttributes.length>0?o`
          <div class="select-row">
            <label>${s("attribute_optional",e)}</label>
            <select
              .value=${this._triggerAttribute}
              @change=${t=>this._triggerAttribute=t.target.value}
            >
              <option value="" ?selected=${!this._triggerAttribute}>${s("use_entity_state",e)}</option>
              ${this._suggestedAttributes.map(t=>o`<option value=${t} ?selected=${t===this._triggerAttribute}>${t} ★</option>`)}
              ${this._availableAttributes.filter(t=>!this._suggestedAttributes.includes(t.name)).map(t=>o`<option value=${t.name} ?selected=${t.name===this._triggerAttribute}>${t.name}${t.numeric?"":" (non-numeric)"}</option>`)}
            </select>
          </div>
        `:o`
          <ms-textfield
            label="${s("attribute_optional",e)}"
            .value=${this._triggerAttribute}
            @input=${t=>this._triggerAttribute=t.target.value}
          ></ms-textfield>
        `}
      <div class="select-row">
        <label>${s("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${t=>this._triggerType=t.target.value}
        >
          ${Wi.map(t=>o`<option value=${t} ?selected=${t===this._triggerType}>${s(t,e)}</option>`)}
        </select>
      </div>
      ${this._renderTriggerTypeFields()}
      <ms-textfield
        label="${s("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${t=>this._intervalDays=t.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():d}
    `}_renderUnitSelect(){let e=this._lang;return o`
      <div class="select-row">
        <label>${s("interval_unit",e)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${t=>this._intervalUnit=t.target.value}
        >
          ${["days","weeks","months","years"].map(t=>o`<option value=${t} ?selected=${t===this._intervalUnit}>${s("unit_"+t,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_buildSchedule(){return this._scheduleType==="weekdays"?{kind:"weekdays",weekdays:[...this._weekdays].sort((e,t)=>e-t)}:this._scheduleType==="nth_weekday"?{kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)}:{kind:"day_of_month",day:parseInt(this._domDay,10)||1}}_renderCalendarFields(){let e=this._lang,t=Vi(e);if(this._scheduleType==="weekdays")return o`
        <label class="field-label">${s("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((i,a)=>o`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(a)?"selected":""}"
              @click=${()=>this._toggleWeekday(a)}
            >${i}</button>`)}
        </div>`;if(this._scheduleType==="nth_weekday"){let i=[["1",s("ord_1",e)],["2",s("ord_2",e)],["3",s("ord_3",e)],["4",s("ord_4",e)],["5",s("ord_5",e)],["-1",s("ord_last",e)]];return o`
        <div class="select-row">
          <label>${s("recurrence_occurrence",e)}</label>
          <select .value=${this._nth} @change=${a=>this._nth=a.target.value}>
            ${i.map(([a,n])=>o`<option value=${a} ?selected=${a===this._nth}>${n}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",e)}</label>
          <select .value=${this._nthWeekday} @change=${a=>this._nthWeekday=a.target.value}>
            ${t.map((a,n)=>o`<option value=${String(n)} ?selected=${String(n)===this._nthWeekday}>${a}</option>`)}
          </select>
        </div>`}return this._scheduleType==="day_of_month"?o`
        <ms-textfield
          label="${s("recurrence_day",e)}"
          type="number"
          min="1"
          max="31"
          .value=${this._domDay}
          @input=${i=>this._domDay=i.target.value}
        ></ms-textfield>`:d}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?o`
        <ms-textfield
          label="${s("trigger_above",e)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${t=>this._triggerAbove=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_below",e)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${t=>this._triggerBelow=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("for_at_least_minutes",e)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?o`
        <ms-textfield
          label="${s("target_value",e)}"
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
          ${s("delta_mode",e)}
        </label>
      `:this._triggerType==="state_change"?o`
        <ms-textfield
          label="${s("from_state_optional",e)}"
          .value=${this._triggerFromState}
          @input=${t=>this._triggerFromState=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("state_value_help",e)}</div>
        <ms-textfield
          label="${s("to_state_optional",e)}"
          .value=${this._triggerToState}
          @input=${t=>this._triggerToState=t.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("target_changes",e)}"
          type="number"
          min="1"
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${s("target_changes_help",e)}</div>
      `:this._triggerType==="runtime"?o`
        <ms-textfield
          label="${s("runtime_hours",e)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${t=>this._triggerRuntimeHours=t.target.value}
        ></ms-textfield>
      `:d}render(){if(!this._open)return o``;let e=this._lang,t=this._taskId?s("edit_task",e):s("new_task",e);return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:d}
          ${this._objectChoices.length>0?o`
            <div class="select-row">
              <label>${s("object",e)}</label>
              <select
                .value=${this._entryId}
                @change=${i=>this._entryId=i.target.value}
              >
                ${this._objectChoices.map(i=>o`<option value=${i.entry_id} ?selected=${i.entry_id===this._entryId}>${i.name}</option>`)}
              </select>
            </div>
          `:d}
          <ms-textfield
            label="${s("task_name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${s("maintenance_type",e)}</label>
            <select
              .value=${this._type}
              @change=${i=>this._type=i.target.value}
            >
              ${Ni.map(i=>o`<option value=${i} ?selected=${i===this._type}>${s(i,e)}</option>`)}
            </select>
          </div>
          <div class="select-row">
            <label>${s("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${i=>this._scheduleType=i.target.value}
            >
              ${Ui.map(i=>o`<option value=${i} ?selected=${i===this._scheduleType}>${s(i,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?o`
                <ms-textfield
                  label="${s("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${i=>this._intervalDays=i.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${s("interval_anchor",e)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${i=>this._intervalAnchor=i.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${s("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${s("anchor_planned",e)}</option>
                  </select>
                </div>
                ${this.scheduleTimeEnabled?o`
                  <ms-textfield
                    label="${s("schedule_time_optional",e)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${s("schedule_time_help",e)}"
                    @input=${i=>this._scheduleTime=i.target.value}
                  ></ms-textfield>
                `:d}
              `:d}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?o`
                <ms-textfield
                  label="${s("due_date",e)}"
                  type="date"
                  .value=${this._dueDate}
                  @input=${i=>this._dueDate=i.target.value}
                ></ms-textfield>
              `:d}
          <ms-textfield
            label="${s("warning_days",e)}"
            type="number"
            .value=${this._warningDays}
            @input=${i=>this._warningDays=i.target.value}
          ></ms-textfield>
          ${this.checklistsEnabled?o`
            <h3>${s("checklist_steps_optional",e)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${s("checklist_placeholder",e)}"
              .value=${this._checklistText}
              @input=${i=>this._checklistText=i.target.value}
            ></textarea>
            <div class="field-help">${s("checklist_help",e)}</div>
          `:d}
          <ms-textfield
            label="${s("last_performed_optional",e)}"
            type="date"
            .value=${this._lastPerformed}
            @input=${i=>this._lastPerformed=i.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${s("responsible_user",e)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${i=>{let a=i.target.value;this._responsibleUserId=a||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${s("no_user_assigned",e)}</option>
              ${this._availableUsers.map(i=>o`<option value=${i.id} ?selected=${i.id===this._responsibleUserId}>${i.name}</option>`)}
            </select>
          </div>
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?o`
            <ms-textfield
              label="${s("environmental_entity_optional",e)}"
              helper="${s("environmental_entity_helper",e)}"
              .value=${this._environmentalEntity}
              @input=${i=>this._environmentalEntity=i.target.value.trim()}
            ></ms-textfield>
            ${this._environmentalEntity?o`
              <ms-textfield
                label="${s("environmental_attribute_optional",e)}"
                .value=${this._environmentalAttribute}
                @input=${i=>this._environmentalAttribute=i.target.value.trim()}
              ></ms-textfield>
            `:d}
          `:d}
          <ms-textfield
            label="${s("notes_optional",e)}"
            .value=${this._notes}
            @input=${i=>this._notes=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("documentation_url_optional",e)}"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ms-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${s("custom_icon_optional",e)}"
            .value=${this._customIcon}
            @value-changed=${i=>this._customIcon=i.detail.value||""}
          ></ha-icon-picker>
          ${this._availableTags.length>0?o`
              <div class="select-row">
                <label>${s("nfc_tag_id_optional",e)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${i=>this._nfcTagId=i.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(i=>o`<option value=${i.id} ?selected=${i.id===this._nfcTagId}>${i.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:o`
              <ms-textfield
                label="${s("nfc_tag_id_optional",e)}"
                .value=${this._nfcTagId}
                @input=${i=>this._nfcTagId=i.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${s("nfc_tags_empty_help",e)}
                <a href="/config/tags">${s("nfc_tags_open_settings",e)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${s("nfc_tags_refresh",e)}
                </button>
              </div>
            `}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${i=>this._enabled=i.target.checked}
            />
            ${s("task_enabled",e)}
          </label>
          ${this._renderCompletionActionsSection(e)}
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
    `}};$.styles=M`
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
  `,p([w({attribute:!1})],$.prototype,"hass",2),p([w({type:Boolean,attribute:"checklists-enabled"})],$.prototype,"checklistsEnabled",2),p([w({type:Boolean,attribute:"schedule-time-enabled"})],$.prototype,"scheduleTimeEnabled",2),p([w({type:Boolean,attribute:"completion-actions-enabled"})],$.prototype,"completionActionsEnabled",2),p([w({type:Number,attribute:"default-warning-days"})],$.prototype,"defaultWarningDays",2),p([h()],$.prototype,"_open",2),p([h()],$.prototype,"_loading",2),p([h()],$.prototype,"_error",2),p([h()],$.prototype,"_entryId",2),p([h()],$.prototype,"_taskId",2),p([h()],$.prototype,"_objectChoices",2),p([h()],$.prototype,"_name",2),p([h()],$.prototype,"_type",2),p([h()],$.prototype,"_scheduleType",2),p([h()],$.prototype,"_intervalDays",2),p([h()],$.prototype,"_intervalUnit",2),p([h()],$.prototype,"_dueDate",2),p([h()],$.prototype,"_warningDays",2),p([h()],$.prototype,"_intervalAnchor",2),p([h()],$.prototype,"_weekdays",2),p([h()],$.prototype,"_nth",2),p([h()],$.prototype,"_nthWeekday",2),p([h()],$.prototype,"_domDay",2),p([h()],$.prototype,"_notes",2),p([h()],$.prototype,"_documentationUrl",2),p([h()],$.prototype,"_customIcon",2),p([h()],$.prototype,"_enabled",2),p([h()],$.prototype,"_triggerEntityId",2),p([h()],$.prototype,"_triggerEntityIds",2),p([h()],$.prototype,"_triggerEntityLogic",2),p([h()],$.prototype,"_triggerAttribute",2),p([h()],$.prototype,"_triggerType",2),p([h()],$.prototype,"_triggerAbove",2),p([h()],$.prototype,"_triggerBelow",2),p([h()],$.prototype,"_triggerForMinutes",2),p([h()],$.prototype,"_triggerTargetValue",2),p([h()],$.prototype,"_triggerDeltaMode",2),p([h()],$.prototype,"_triggerFromState",2),p([h()],$.prototype,"_triggerToState",2),p([h()],$.prototype,"_triggerTargetChanges",2),p([h()],$.prototype,"_triggerRuntimeHours",2),p([h()],$.prototype,"_suggestedAttributes",2),p([h()],$.prototype,"_availableAttributes",2),p([h()],$.prototype,"_entityDomain",2),p([h()],$.prototype,"_lastPerformed",2),p([h()],$.prototype,"_nfcTagId",2),p([h()],$.prototype,"_availableTags",2),p([h()],$.prototype,"_responsibleUserId",2),p([h()],$.prototype,"_availableUsers",2),p([h()],$.prototype,"_checklistText",2),p([h()],$.prototype,"_scheduleTime",2),p([h()],$.prototype,"_actionService",2),p([h()],$.prototype,"_actionTargetEntity",2),p([h()],$.prototype,"_actionData",2),p([h()],$.prototype,"_actionDataJsonFallback",2),p([h()],$.prototype,"_actionTesting",2),p([h()],$.prototype,"_actionTestResult",2),p([h()],$.prototype,"_actionTestError",2),p([h()],$.prototype,"_qcNotes",2),p([h()],$.prototype,"_qcCost",2),p([h()],$.prototype,"_qcDuration",2),p([h()],$.prototype,"_qcFeedback",2),p([h()],$.prototype,"_environmentalEntity",2),p([h()],$.prototype,"_environmentalAttribute",2);customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",$);var D=class extends C{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed"}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState={},this._feedback="needed")}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),await this.hass.connection.sendMessagePromise(e),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=V(e,this.lang,s("save_error",this.lang))}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return o``;let e=this.lang||this.hass?.language||"en";return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("complete_title",e)}${this.taskName}</div>
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:d}
          ${this.checklist.length>0?o`
            <div class="checklist-section">
              <label class="checklist-label">${s("checklist",e)}</label>
              ${this.checklist.map((t,i)=>o`
                <label class="checklist-item" @click=${()=>this._toggleCheck(i)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(i)]} />
                  <span>${t}</span>
                </label>
              `)}
            </div>
          `:d}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${s("notes_optional",e)}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${t=>this._notes=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${s("cost_optional",e)}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${t=>this._cost=t.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${s("duration_minutes",e)}</span>
            <input type="number" step="1" min="0" class="field-input"
              .value=${this._duration}
              @input=${t=>this._duration=t.target.value} />
          </label>
          ${this.adaptiveEnabled?o`
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
          `:d}
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
    `}};D.styles=M`
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
  `,p([w({attribute:!1})],D.prototype,"hass",2),p([w()],D.prototype,"entryId",2),p([w()],D.prototype,"taskId",2),p([w()],D.prototype,"taskName",2),p([w()],D.prototype,"lang",2),p([w({type:Array})],D.prototype,"checklist",2),p([w({type:Boolean})],D.prototype,"adaptiveEnabled",2),p([h()],D.prototype,"_open",2),p([h()],D.prototype,"_notes",2),p([h()],D.prototype,"_cost",2),p([h()],D.prototype,"_duration",2),p([h()],D.prototype,"_loading",2),p([h()],D.prototype,"_error",2),p([h()],D.prototype,"_checklistState",2),p([h()],D.prototype,"_feedback",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",D);function he(l){return l.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ot(l){return!l.startsWith("data:image/svg+xml,")&&!l.startsWith("data:image/png;base64,")?"":he(l)}function Ki(l){return l.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var J=class extends C{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(e,t,i,a){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=a,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...t,action:"view"})];this._taskId&&i.push(this.hass.connection.sendMessagePromise({...t,action:"complete"}));let a=await Promise.all(i);if(e!==this._generateSeq)return;this._viewResult=a[0],a.length>1&&(this._completeResult=a[1])}catch(t){if(e!==this._generateSeq)return;let i=t?.code,a=t?.message;this._error=i==="no_url"||typeof a=="string"&&a.includes("No Home Assistant URL")?s("qr_error_no_url",this.lang):s("qr_error",this.lang)}finally{e===this._generateSeq&&(this._loading=!1)}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),a=window.open("","_blank","width=600,height=500");if(!a)return;let n=this.lang||"en",c=he(t),u=he(i),_=!!this._completeResult,m=he(s("qr_action_view",n)),g=he(s("qr_action_complete",n));a.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${c}</title>
<style>
  body{font-family:sans-serif;text-align:center;padding:20px}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  .qr-row{display:flex;justify-content:center;gap:24px;margin:12px 0}
  .qr-col{display:flex;flex-direction:column;align-items:center;gap:6px}
  .qr-col img{width:${_?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${c}</h2>
${u?`<div class="sub">${u}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${Ot(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${m}</div>
  </div>
  ${_?`<div class="qr-col">
    <img src="${Ot(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${g}</div>
  </div>`:""}
</div>
<div class="url">${he(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),a.document.close()}_downloadSvg(e,t){let i=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),a=new Blob([i],{type:"image/svg+xml"}),n=URL.createObjectURL(a),c=document.createElement("a");c.href=n;let u=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;c.download=`qr-${Ki(u)}-${t}.svg`,c.click(),URL.revokeObjectURL(n)}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return o``;let e=this.lang||this.hass?.language||"en",t=this._taskName?`${s("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",e)}: ${this._objectName}`,i=!!this._viewResult;return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._loading?o`<div class="loading">${s("qr_generating",e)}</div>`:this._error?o`<div class="error">${this._error}</div>`:i?o`
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
                      ${this._completeResult?o`
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
                          `:d}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:d}
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
    `}};J.styles=M`
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
  `,p([w({attribute:!1})],J.prototype,"hass",2),p([w()],J.prototype,"lang",2),p([h()],J.prototype,"_open",2),p([h()],J.prototype,"_loading",2),p([h()],J.prototype,"_error",2),p([h()],J.prototype,"_viewResult",2),p([h()],J.prototype,"_completeResult",2),p([h()],J.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",J);var Nt=5;function Te(l){let r=l.getFullYear(),e=String(l.getMonth()+1).padStart(2,"0"),t=String(l.getDate()).padStart(2,"0");return`${r}-${e}-${t}`}function Yi(l,r){let e=[];for(let t=0;t<r;t++){let i=new Date(l);i.setDate(i.getDate()+t),i.setHours(0,0,0,0),e.push(Te(i))}return e}function Ue(l,r){let[e,t,i]=l.split("-").map(Number),a=new Date(e,t-1,i);return a.setDate(a.getDate()+r),Te(a)}function Gi(l){if(!l||l.length===0)return null;let r=l.map(e=>e.cost).filter(e=>typeof e=="number");return r.length===0?null:r.reduce((e,t)=>e+t,0)/r.length}function Qi(l){let{windowStart:r,windowEnd:e,task:t,entryId:i,objectName:a}=l,n=[],c=(g,v)=>({date:g,entry_id:i,task_id:t.id,task_name:t.name,object_name:a,status:v&&(t.status==="overdue"||t.status==="triggered")?"ok":t.status,days_until_due:v?null:t.days_until_due??null,projected:v,schedule_type:t.schedule_type,interval_days:t.interval_days??null,interval_unit:t.interval_unit??null,responsible_user_id:t.responsible_user_id??null,avg_cost:Gi(t.history),adaptive_enabled:!!t.adaptive_config?.enabled,prediction_confidence:t.threshold_prediction_confidence??null}),u=Math.max(1,Math.round(pt(t.interval_days,t.interval_unit)));if(t.status==="overdue"||t.status==="triggered"){if(n.push(c(r,!1)),t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let g=Ue(r,u),v=1;for(;g<=e&&v<Nt;)n.push(c(g,!0)),v++,g=Ue(g,u)}return n}let _=t.next_due;if(typeof _!="string"||!_)return n;let m=_.slice(0,10);if(m>=r&&m<=e)n.push(c(m,!1));else if(m>e)return n;if(t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let g=Ue(m,u),v=n.length;for(;g<=e&&v<Nt;)g>=r&&(n.push(c(g,!0)),v++),g=Ue(g,u)}return n}var Ut={overdue:0,triggered:1,due_soon:2,ok:3};function Bt(l,r,e,t=null){let i=Yi(r,e),a=i[0],n=i[i.length-1],c=[];for(let _ of l){let m=_.object?.name||"",g=_.entry_id,v=_.tasks||[];for(let f of v){if(t&&f.responsible_user_id!==t||f.enabled===!1)continue;let x=Qi({windowStart:a,windowEnd:n,task:f,entryId:g,objectName:m});c.push(...x)}}let u=new Map;for(let _ of i)u.set(_,[]);for(let _ of c){let m=u.get(_.date);m&&m.push(_)}for(let[,_]of u)_.sort((m,g)=>{let v=Ut[m.status]??99,f=Ut[g.status]??99;if(v!==f)return v-f;if(m.projected!==g.projected)return m.projected?1:-1;let x=m.object_name.localeCompare(g.object_name);return x!==0?x:m.task_name.localeCompare(g.task_name)});return i.map(_=>({date:_,events:u.get(_)??[]}))}var Ji={completed:"ok",reset:"ok",skipped:"due_soon",triggered:"triggered",trigger_replaced:"triggered"};function Zi(l,r){let e=[];for(let t=r-1;t>=0;t--){let i=new Date(l);i.setDate(i.getDate()-t),i.setHours(0,0,0,0),e.push(Te(i))}return e}function Wt(l,r,e,t=null){let i=Zi(r,e),a=i[0],n=i[i.length-1],c=new Map;for(let _ of i)c.set(_,[]);for(let _ of l){let m=_.object?.name||"",g=_.entry_id,v=_.tasks||[];for(let f of v){if(t&&f.responsible_user_id!==t)continue;let x=f.history||[];for(let b of x){if(typeof b?.timestamp!="string")continue;let L=b.timestamp.slice(0,10);if(L<a||L>n)continue;let I=c.get(L);if(!I)continue;let S=b.type??"completed";I.push({date:L,entry_id:g,task_id:f.id,task_name:f.name,object_name:m,status:Ji[S]??"ok",days_until_due:null,projected:!1,schedule_type:f.schedule_type,interval_days:f.interval_days??null,responsible_user_id:f.responsible_user_id??null,avg_cost:typeof b.cost=="number"?b.cost:null,adaptive_enabled:!!f.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:b.timestamp,history_type:S,history_cost:typeof b.cost=="number"?b.cost:null,history_notes:typeof b.notes=="string"?b.notes:null,history_duration:typeof b.duration=="number"?b.duration:null})}}}let u={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,_]of c)_.sort((m,g)=>{let v=u[m.history_type??""]??99,f=u[g.history_type??""]??99;if(v!==f)return v-f;let x=m.object_name.localeCompare(g.object_name);return x!==0?x:m.task_name.localeCompare(g.task_name)});return i.map(_=>({date:_,events:c.get(_)??[]}))}var Vt=M`
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
  .cal-conf-high   { color: #4caf50; border-color: #4caf5044; }
  .cal-conf-medium { color: #f9a825; border-color: #f9a82544; }
  .cal-conf-low    { color: #d32f2f; border-color: #d32f2f44; }
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
  .cal-status-overdue   { background: #d32f2f; }
  .cal-status-triggered { background: #038fc7; }
  .cal-status-due_soon  { background: #f9a825; color: #000; }
  .cal-status-ok        { background: #2e7d32; }

  @media (max-width: 600px) {
    .cal-controls { padding: 10px 12px; }
    .cal-rolling { padding: 6px 12px 24px; }
    .cal-day-pill { width: 48px; height: 48px; }
    .cal-pill-day { font-size: 17px; }
    .cal-user-filter { margin-left: 0; width: 100%; }
  }
`;var Z=class extends C{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._unsub=null;this._dataLoaded=!1;this._lastConnection=null}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(e){this._config={...e},e.past_days&&[30,90].includes(e.past_days)?this._pastDays=e.past_days:e.window_days&&[7,14,30,365].includes(e.window_days)&&(this._windowDays=e.window_days,this._pastDays=0),typeof e.user_filter=="string"&&(this._userFilter=e.user_filter)}getCardSize(){return 6}get _lang(){return this.hass?.language||"en"}disconnectedCallback(){if(super.disconnectedCallback(),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(e){super.updated(e);let t=this.hass?.language;if(t&&!He(t)&&Pe(t).then(()=>this.requestUpdate()),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=e.objects,this._stats=t}catch{}}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(e=>{let t=e;this._objects=t.objects},{type:"maintenance_supporter/subscribe"})}catch{}}_onEventClick(e){if(e.history_timestamp){this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:e.history_timestamp},bubbles:!0,composed:!0}));return}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0}))}render(){if(!this.hass)return d;let e=this._lang,t=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,a=this._config.title,n=null;this._userFilter&&(n=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let c=new Date;c.setHours(0,0,0,0);let u=this._pastDays>0,_=u?Wt(this._objects,c,this._pastDays,n):Bt(this._objects,c,this._windowDays,n),m=Te(c),g=this._windowDays===365||u,v=g?_.filter(b=>b.events.length>0):_,f=b=>{let L=`cal-status-${b.status}`,I=b.projected?"cal-event-projected":"",S=b.status==="overdue"&&b.days_until_due!=null?` (${Math.abs(b.days_until_due)}d ${s("overdue",e).toLowerCase()})`:"",k=b.projected&&b.interval_days?o`<span class="cal-event-recur">${b.interval_unit&&b.interval_unit!=="days"?`${b.interval_days} ${s("unit_"+b.interval_unit,e)}`:s("cal_every_n_days",e).replace("{n}",String(b.interval_days))}</span>`:d,R=b.schedule_type==="sensor_based",F=R?o`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${s("cal_source_sensor",e)}" icon="mdi:trending-up"></ha-icon>`:o`<ha-icon class="cal-event-icon cal-source-time"
                title="${b.adaptive_enabled?s("cal_source_time_adaptive",e):s("cal_source_time",e)}"
                icon="${b.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,W=R&&b.prediction_confidence&&b.status!=="triggered"&&!b.projected?o`<span class="cal-event-prediction cal-conf-${b.prediction_confidence}">
            ${s("cal_predicted",e)} · ${s(`cal_confidence_${b.prediction_confidence}`,e)}
          </span>`:d,G=this._stats?.budget?.currency_symbol||"\u20AC",q=b.history_type?s(b.history_type,e):s(b.status,e);return o`
        <div class="cal-event ${I}"
          @click=${()=>this._onEventClick(b)}>
          ${F}
          <span class="cal-status-pill ${L}">${q}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${b.object_name} · ${b.task_name}${S}</div>
            ${W}
            ${k}
          </div>
          ${b.avg_cost!=null&&b.avg_cost>0?o`<span class="cal-event-cost">${b.avg_cost.toFixed(0)} ${G}</span>`:d}
        </div>
      `},x=b=>{let[L,I,S]=b.date.split("-").map(Number),k=new Date(L,I-1,S),R=b.date===m,F=k.toLocaleDateString(e,{weekday:"short"}),W=k.toLocaleDateString(e,{month:"long"});return o`
        <div class="cal-day-row">
          <div class="cal-day-pill ${R?"cal-today":""}">
            <span class="cal-pill-weekday">${F}</span>
            <span class="cal-pill-day">${k.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${W}</span>
              ${R?o`<span class="cal-day-today-badge">${s("today",e)}</span>`:d}
            </div>
            ${b.events.length===0?o`<div class="cal-empty">${s("cal_no_events",e)}</div>`:b.events.map(f)}
          </div>
        </div>
      `};return o`
      <ha-card .header=${a}>
        ${t||i?o`
              <div class="cal-controls">
                ${t?o`
                      <div class="cal-window-chips cal-past-chips" title="${s("cal_past_windows",e)||"Past windows"}">
                        ${[30,90].map(b=>o`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===b?"active":""}"
                            @click=${()=>{this._pastDays=b}}>
                            −${b}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${s("cal_forward_windows",e)||"Forward windows"}">
                        ${[7,14,30,365].map(b=>o`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===b?"active":""}"
                            @click=${()=>{this._windowDays=b,this._pastDays=0}}>
                            ${b===365?"+1y":`+${b}d`}
                          </button>
                        `)}
                      </div>
                    `:d}
                ${i?o`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${b=>{this._userFilter=b.target.value}}>
                        <option value="">${s("all_users",e)}</option>
                        <option value="current_user">${s("my_tasks",e)}</option>
                      </select>
                    `:d}
              </div>
            `:d}
        <div class="cal-rolling">
          ${v.length===0&&g?o`<div class="cal-empty">${s("cal_no_events",e)}</div>`:v.map(x)}
        </div>
      </ha-card>
    `}};Z.styles=[De,Vt,M`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],p([w({attribute:!1})],Z.prototype,"hass",2),p([h()],Z.prototype,"_config",2),p([h()],Z.prototype,"_objects",2),p([h()],Z.prototype,"_stats",2),p([h()],Z.prototype,"_windowDays",2),p([h()],Z.prototype,"_pastDays",2),p([h()],Z.prototype,"_userFilter",2),p([h()],Z.prototype,"_unsub",2);var Xi=[{value:7,label:"Week (7 days)"},{value:14,label:"Fortnight (14 days)"},{value:30,label:"Month (30 days, default)"},{value:365,label:"Year (365 days, empty days collapsed)"}],ge=class extends C{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}setConfig(e){this._config={...e}}_valueChanged(e,t){let i={...this._config,[e]:t};e==="show_window_chips"&&t===!0&&delete i.show_window_chips,e==="show_user_filter"&&t===!0&&delete i.show_user_filter,e==="title"&&(!t||typeof t=="string"&&t.trim()==="")&&delete i.title,e==="user_filter"&&t===""&&delete i.user_filter,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let e=this._config.window_days??30,t=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,a=this._config.user_filter??"",n=this._config.title??"";return o`
      <div class="editor">
        <div class="row">
          <label for="title">Title (optional)</label>
          <input
            id="title"
            type="text"
            .value=${n}
            @input=${c=>this._valueChanged("title",c.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">Default window</label>
          <select
            id="window"
            @change=${c=>this._valueChanged("window_days",Number(c.target.value))}
          >
            ${Xi.map(c=>o`<option value="${c.value}" ?selected=${c.value===e}>${c.label}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">Show window chips inside the card</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${t}
            @change=${c=>this._valueChanged("show_window_chips",c.target.checked)}
          />
        </div>
        <div class="hint">
          Hide the chips when the card is embedded in a strategy view that
          already serves as the window selector.
        </div>
        <div class="row toggle">
          <label for="userf">Show user filter dropdown</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${i}
            @change=${c=>this._valueChanged("show_user_filter",c.target.checked)}
          />
        </div>
        <div class="row">
          <label for="userv">Default user filter</label>
          <select
            id="userv"
            @change=${c=>this._valueChanged("user_filter",c.target.value)}
          >
            <option value="" ?selected=${a===""}>All users</option>
            <option value="current_user" ?selected=${a==="current_user"}>
              My tasks (current user)
            </option>
          </select>
        </div>
      </div>
    `}};ge.styles=M`
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
  `,p([w({attribute:!1})],ge.prototype,"hass",2),p([h()],ge.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",Z);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",ge);var Be=window;Be.customCards=Be.customCards||[];var Kt="maintenance-supporter-calendar-card",es=Be.customCards.some(l=>l.type===Kt);es||Be.customCards.push({type:Kt,name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var ie=class extends C{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null}get _lang(){return this.hass?.language||"en"}openEdit(e){this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let e={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(e.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(e.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(e.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(e.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(e.completed_by=this._draft.completed_by),Object.keys(e).filter(i=>!["type","entry_id","task_id","original_timestamp"].includes(i)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(e),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=V(e,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return d;let e=this._lang,t=this._draft;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${s("history_edit_title",e)||"Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${s(t.type,e)||t.type}</span>
        </div>
        <label>
          <span>${s("history_edit_timestamp",e)||"Timestamp"}</span>
          <input type="datetime-local"
            .value=${t.timestamp.length>=16?t.timestamp.slice(0,16):t.timestamp}
            @change=${i=>{let a=i.target.value;this._set("timestamp",a.length===16?`${a}:00`:a)}} />
        </label>
        <label>
          <span>${s("notes_label",e)}</span>
          <textarea
            rows="3"
            @input=${i=>{let a=i.target.value;this._set("notes",a||null)}}
            .value=${t.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${s("cost",e)||"Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${t.cost!=null?String(t.cost):""}
              @input=${i=>{let a=i.target.value;this._set("cost",a?Number(a):null)}} />
          </label>
          <label>
            <span>${s("duration",e)||"Duration (min)"}</span>
            <input type="number" min="0"
              .value=${t.duration!=null?String(t.duration):""}
              @input=${i=>{let a=i.target.value;this._set("duration",a?Number(a):null)}} />
          </label>
        </div>
        ${this._error?o`<div class="error">${this._error}</div>`:d}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${s("cancel",e)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?s("saving",e)||"Saving\u2026":s("save",e)||"Save"}
          </button>
        </div>
      </div>
    `}};ie.styles=M`
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
  `,p([w({attribute:!1})],ie.prototype,"hass",2),p([h()],ie.prototype,"_open",2),p([h()],ie.prototype,"_saving",2),p([h()],ie.prototype,"_error",2),p([h()],ie.prototype,"_draft",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",ie);var K=class extends C{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel="",this._inputType="",this._inputValue="",this._open=!0,new Promise(t=>{this._resolve=t,this._promptResolve=null})}prompt(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"text",this._inputValue=e.inputValue||"",this._open=!0,new Promise(t=>{this._promptResolve=t,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return d;let e=this.hass?.language||"en";return o`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel?o`
            <ha-textfield
              label="${this._inputLabel}"
              type="${this._inputType}"
              .value=${this._inputValue}
              @input=${t=>this._inputValue=t.target.value}
            ></ha-textfield>
          `:d}
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
    `}};K.styles=M`
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
  `,p([w({attribute:!1})],K.prototype,"hass",2),p([h()],K.prototype,"_open",2),p([h()],K.prototype,"_title",2),p([h()],K.prototype,"_message",2),p([h()],K.prototype,"_confirmText",2),p([h()],K.prototype,"_danger",2),p([h()],K.prototype,"_inputLabel",2),p([h()],K.prototype,"_inputType",2),p([h()],K.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",K);var Yt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Gt=l=>(...r)=>({_$litDirective$:l,values:r}),We=class{constructor(r){}get _$AU(){return this._$AM._$AU}_$AT(r,e,t){this._$Ct=r,this._$AM=e,this._$Ci=t}_$AS(r,e){return this.update(r,e)}update(r,e){return this.render(...e)}};var Se=class extends We{constructor(r){if(super(r),this.it=d,r.type!==Yt.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(r){if(r===d||r==null)return this._t=void 0,this.it=r;if(r===te)return r;if(typeof r!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(r===this.it)return this._t;this.it=r;let e=[r];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};Se.directiveName="unsafeHTML",Se.resultType=1;var Qt=Gt(Se);var ts=["EUR","USD","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","CZK","PLN","RUB","SEK","NOK","DKK","UAH"],A=class extends C{constructor(){super(...arguments);this.budget=null;this._settings=null;this._loading=!0;this._importCsv="";this._importLoading=!1;this._includeHistory=!0;this._toast="";this._testingNotification=!1;this._users=[];this._vacEnabled=!1;this._vacStart="";this._vacEnd="";this._vacBuffer=3;this._vacExempt=new Set;this._vacIsActive=!1;this._vacWindowEnd=null;this._vacAllTasks=[];this._vacPreview=[];this._vacPreviewLoading=!1;this._vacSaving=!1;this._qrObjects=[];this._qrSelectedEntries=new Set;this._qrActions=new Set(["view"]);this._qrUrlMode="companion";this._qrBatchLoading=!1;this._qrBatchResults=[];this._qrObjectsLoaded=!1;this._loaded=!1;this._userService=null;this._sendTestNotification=async()=>{this._testingNotification=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/test_notification"}),t=e.message||(e.success?s("test_notification_success",this._lang):s("test_notification_failed",this._lang));this._showToast(t)}catch{this._showToast(s("test_notification_failed",this._lang))}finally{this._testingNotification=!1}}}get _lang(){return this.hass?.language||"en"}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._loaded?(this._loaded=!0,this._userService=new ne(this.hass),this._loadSettings(),this._loadUsers()):e.has("hass")&&this.hass&&this._userService&&this._userService.updateHass(this.hass)}async _loadUsers(){if(this._userService)try{this._users=await this._userService.getUsers()}catch{this._users=[]}}async _loadSettings(){this._loading=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});this._settings=e,this._hydrateVacationFromSettings()}catch{}this._loading=!1}_hydrateVacationFromSettings(){let e=this._settings?.vacation;e&&(this._vacEnabled=e.enabled,this._vacStart=e.start||"",this._vacEnd=e.end||"",this._vacBuffer=e.buffer_days,this._vacExempt=new Set(e.exempt_task_ids||[]),this._vacIsActive=e.is_active,this._vacWindowEnd=e.window_end)}async _updateSetting(e,t){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/update",settings:{[e]:t}});this._settings=i,this._showToast(s("settings_saved",this._lang)),this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(s("action_error",this._lang))}}_showToast(e){this._toast=e,setTimeout(()=>{this._toast=""},3e3)}_downloadFile(e,t,i){Oe(e,t,i)}render(){let e=this._lang;return this._loading||!this._settings?o`<div class="settings-loading">Loading…</div>`:o`
      ${this._renderFeatures(e)}
      ${this._renderPanelAccess(e)}
      ${this._renderGeneral(e)}
      ${this._renderObjectsColumns(e)}
      ${this._settings.general.notifications_enabled?this._renderNotifications(e):d}
      ${this.features.budget?this._renderBudget(e):d}
      ${this._renderVacation(e)}
      ${this._renderPrintQr(e)}
      ${this._renderImportExport(e)}
      ${this._toast?o`<div class="settings-toast">${this._toast}</div>`:d}
    `}scrollToSection(e){requestAnimationFrame(()=>{let t=this.shadowRoot;if(!t)return;let i=t.querySelector(`[data-section="${e}"]`)??t.querySelector(`[data-section-alt="${e}"]`);i&&i.scrollIntoView({behavior:"smooth",block:"start"})})}_renderPanelAccess(e){let t=new Set(this._settings.admin_panel_user_ids||[]),i=this._users.filter(c=>!c.is_admin),a=this._settings.operator_write_enabled??!1,n=(c,u)=>{let _=new Set(t);u?_.add(c):_.delete(c),this._updateSetting("admin_panel_user_ids",[..._])};return o`
      <div class="settings-section">
        <h3>${s("settings_panel_access",e)} ${a&&t.size>0?o`<span class="section-badge">${t.size}</span>`:d}</h3>
        <p class="section-desc">${s("settings_panel_access_desc",e)}</p>
        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_operator_write",e)}</span>
            <span class="setting-desc">${s("settings_operator_write_desc",e)}</span>
          </span>
          <input type="checkbox"
            .checked=${a}
            @change=${c=>this._updateSetting("operator_write_enabled",c.target.checked)} />
        </label>
        ${a?i.length===0?o`<div class="setting-row hint">${s("no_non_admin_users",e)}</div>`:i.map(c=>o`
              <label class="setting-row">
                <span>
                  <span class="setting-label">${c.name||c.id.slice(0,8)}</span>
                  <span class="setting-desc">${c.is_owner?s("owner_label",e):""}</span>
                </span>
                <input type="checkbox"
                  .checked=${t.has(c.id)}
                  @change=${u=>n(c.id,u.target.checked)} />
              </label>
            `):d}
      </div>
    `}_renderFeatures(e){let t=this._settings.features,i=[{key:"adaptive",settingKey:"advanced_adaptive_visible",label:s("feat_adaptive",e),desc:s("feat_adaptive_desc",e)},{key:"predictions",settingKey:"advanced_predictions_visible",label:s("feat_predictions",e),desc:s("feat_predictions_desc",e)},{key:"seasonal",settingKey:"advanced_seasonal_visible",label:s("feat_seasonal",e),desc:s("feat_seasonal_desc",e)},{key:"environmental",settingKey:"advanced_environmental_visible",label:s("feat_environmental",e),desc:s("feat_environmental_desc",e)},{key:"budget",settingKey:"advanced_budget_visible",label:s("feat_budget",e),desc:s("feat_budget_desc",e)},{key:"groups",settingKey:"advanced_groups_visible",label:s("feat_groups",e),desc:s("feat_groups_desc",e)},{key:"checklists",settingKey:"advanced_checklists_visible",label:s("feat_checklists",e),desc:s("feat_checklists_desc",e)},{key:"schedule_time",settingKey:"advanced_schedule_time_visible",label:s("feat_schedule_time",e),desc:s("feat_schedule_time_desc",e)},{key:"completion_actions",settingKey:"advanced_completion_actions_visible",label:s("feat_completion_actions",e),desc:s("feat_completion_actions_desc",e)}];return o`
      <div class="settings-section" data-section="settings" data-section-alt="groups">
        <h3>${s("settings_features",e)}</h3>
        <p class="section-desc">${s("settings_features_desc",e)}</p>
        ${i.map(a=>o`
          <label class="setting-row">
            <span>
              <span class="setting-label">${a.label}</span>
              <span class="setting-desc">${a.desc}</span>
            </span>
            <input type="checkbox" .checked=${t[a.key]}
              @change=${n=>this._updateSetting(a.settingKey,n.target.checked)} />
          </label>
        `)}
      </div>
    `}_renderObjectsColumns(e){let t=Ee(this._settings.objects_table_columns);return o`
      <div class="settings-section" data-section="objects_table_columns">
        <h3>${s("objects_table_columns_label",e)}</h3>
        <p class="section-desc">${s("objects_table_columns_hint",e)}</p>
        ${_e.map(i=>o`
          <label class="setting-row">
            <span class="setting-label">${s(i.labelKey,e)}</span>
            <input
              type="checkbox"
              .checked=${t.includes(i.key)}
              ?disabled=${!!i.required}
              @change=${a=>this._toggleColumn(i.key,a.target.checked)}
            />
          </label>
        `)}
      </div>
    `}_toggleColumn(e,t){let i=new Set(Ee(this._settings.objects_table_columns));t?i.add(e):i.delete(e);let a=_e.filter(n=>n.required||i.has(n.key)).map(n=>n.key);this._updateSetting("objects_table_columns",a)}_renderGeneral(e){let t=this._settings.general,i=this._settings.budget;return o`
      <div class="settings-section">
        <h3>${s("settings_general",e)}</h3>
        <label class="setting-row">
          <span class="setting-label">${s("settings_default_warning",e)}</span>
          <input type="number" min="1" max="365" .value=${String(t.default_warning_days)}
            @change=${a=>{let n=parseInt(a.target.value,10);n>=1&&n<=365&&this._updateSetting("default_warning_days",n)}} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_currency",e)}</span>
          <select @change=${a=>this._updateSetting("budget_currency",a.target.value)}>
            ${ts.map(a=>o`<option value=${a} ?selected=${i.currency===a}>${a}</option>`)}
          </select>
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_panel_enabled",e)}</span>
          <input type="checkbox" .checked=${t.panel_enabled}
            @change=${a=>this._updateSetting("panel_enabled",a.target.checked)} />
        </label>
        ${t.panel_enabled?o`
          <label class="setting-row">
            <span class="setting-label">${s("settings_panel_title",e)}</span>
            <input type="text" .value=${t.panel_title??""}
              placeholder="Maintenance"
              maxlength="50"
              @change=${a=>this._updateSetting("panel_title",a.target.value.trim())} />
          </label>
        `:""}
        <label class="setting-row">
          <span class="setting-label">${s("settings_notifications",e)}</span>
          <input type="checkbox" .checked=${t.notifications_enabled}
            @change=${a=>this._updateSetting("notifications_enabled",a.target.checked)} />
        </label>
        ${t.notifications_enabled?o`
          <label class="setting-row">
            <span class="setting-label">${s("settings_notify_service",e)}</span>
            <input type="text" .value=${t.notify_service}
              @change=${a=>this._updateSetting("notify_service",a.target.value.trim())} />
          </label>
          <div class="setting-row">
            <span class="setting-label">${s("test_notification",e)}</span>
            <button class="ha-button secondary"
              ?disabled=${!t.notify_service||this._testingNotification}
              @click=${this._sendTestNotification}>
              ${this._testingNotification?s("testing",e):s("send_test",e)}
            </button>
          </div>
        `:d}
      </div>
    `}_renderNotifications(e){let t=this._settings.notifications,i=this._settings.actions;return o`
      <div class="settings-section">
        <h3>${s("settings_notifications",e)}</h3>

        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_notify_due_soon",e)}</span>
          </span>
          <input type="checkbox" .checked=${t.due_soon_enabled}
            @change=${a=>this._updateSetting("notify_due_soon_enabled",a.target.checked)} />
        </label>
        ${t.due_soon_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_interval_hours",e)}</span>
            <input type="number" min="0" max="720" .value=${String(t.due_soon_interval_hours)}
              @change=${a=>this._updateSetting("notify_due_soon_interval_hours",parseInt(a.target.value,10)||0)} />
          </label>
        `:d}

        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_notify_overdue",e)}</span>
          </span>
          <input type="checkbox" .checked=${t.overdue_enabled}
            @change=${a=>this._updateSetting("notify_overdue_enabled",a.target.checked)} />
        </label>
        ${t.overdue_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_interval_hours",e)}</span>
            <input type="number" min="0" max="720" .value=${String(t.overdue_interval_hours)}
              @change=${a=>this._updateSetting("notify_overdue_interval_hours",parseInt(a.target.value,10)||0)} />
          </label>
        `:d}

        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_notify_triggered",e)}</span>
          </span>
          <input type="checkbox" .checked=${t.triggered_enabled}
            @change=${a=>this._updateSetting("notify_triggered_enabled",a.target.checked)} />
        </label>
        ${t.triggered_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_interval_hours",e)}</span>
            <input type="number" min="0" max="720" .value=${String(t.triggered_interval_hours)}
              @change=${a=>this._updateSetting("notify_triggered_interval_hours",parseInt(a.target.value,10)||0)} />
          </label>
        `:d}

        <label class="setting-row">
          <span class="setting-label">${s("settings_quiet_hours",e)}</span>
          <input type="checkbox" .checked=${t.quiet_hours_enabled}
            @change=${a=>this._updateSetting("quiet_hours_enabled",a.target.checked)} />
        </label>
        ${t.quiet_hours_enabled?o`
          <div class="setting-row sub-row">
            <span class="setting-desc">${s("settings_quiet_start",e)}</span>
            <input type="time" .value=${t.quiet_hours_start}
              @change=${a=>this._updateSetting("quiet_hours_start",a.target.value)} />
          </div>
          <div class="setting-row sub-row">
            <span class="setting-desc">${s("settings_quiet_end",e)}</span>
            <input type="time" .value=${t.quiet_hours_end}
              @change=${a=>this._updateSetting("quiet_hours_end",a.target.value)} />
          </div>
        `:d}

        <label class="setting-row">
          <span class="setting-label">${s("settings_max_per_day",e)}</span>
          <input type="number" min="0" max="100" .value=${String(t.max_per_day)}
            @change=${a=>this._updateSetting("max_notifications_per_day",parseInt(a.target.value,10)||0)} />
        </label>

        <label class="setting-row">
          <span class="setting-label">${s("settings_bundling",e)}</span>
          <input type="checkbox" .checked=${t.bundling_enabled}
            @change=${a=>this._updateSetting("notification_bundling_enabled",a.target.checked)} />
        </label>
        ${t.bundling_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_bundle_threshold",e)}</span>
            <input type="number" min="2" max="20" .value=${String(t.bundle_threshold)}
              @change=${a=>this._updateSetting("notification_bundle_threshold",parseInt(a.target.value,10)||2)} />
          </label>
        `:d}

        <h4 style="margin: 16px 0 8px; font-size: 14px;">${s("settings_actions",e)}</h4>
        <label class="setting-row">
          <span class="setting-label">${s("settings_action_complete",e)}</span>
          <input type="checkbox" .checked=${i.complete_enabled}
            @change=${a=>this._updateSetting("action_complete_enabled",a.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_action_skip",e)}</span>
          <input type="checkbox" .checked=${i.skip_enabled}
            @change=${a=>this._updateSetting("action_skip_enabled",a.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_action_snooze",e)}</span>
          <input type="checkbox" .checked=${i.snooze_enabled}
            @change=${a=>this._updateSetting("action_snooze_enabled",a.target.checked)} />
        </label>
        ${i.snooze_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_snooze_hours",e)}</span>
            <input type="number" min="1" max="168" .value=${String(i.snooze_duration_hours)}
              @change=${a=>this._updateSetting("snooze_duration_hours",parseInt(a.target.value,10)||4)} />
          </label>
        `:d}
      </div>
    `}_renderBudget(e){let t=this._settings.budget;return o`
      <div class="settings-section" data-section="budget">
        <h3>${s("settings_budget",e)}</h3>
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
        ${t.alerts_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_budget_threshold",e)}</span>
            <input type="number" min="1" max="100" .value=${String(t.alert_threshold_pct)}
              @change=${i=>this._updateSetting("budget_alert_threshold",parseInt(i.target.value,10)||80)} />
          </label>
        `:d}
      </div>
    `}_renderVacation(e){let t=this._vacEnabled&&!this._vacIsActive&&this._vacWindowEnd&&new Date(this._vacWindowEnd)<new Date,i=this._vacExempt.size;return o`
      <div class="settings-section vacation-section" data-section="vacation">
        <h3>
          ${s("vacation_title",e)}
          ${this._vacIsActive?o`<span class="vac-badge active">${s("vacation_active",e)}</span>`:d}
          ${t?o`<span class="vac-badge stale">${s("vacation_ended",e)}</span>`:d}
        </h3>
        <p class="section-desc">${s("vacation_desc",e)}</p>

        <label class="vac-toggle">
          <input type="checkbox" .checked=${this._vacEnabled}
            @change=${a=>this._toggleVacationEnabled(a.target.checked)} />
          ${s("vacation_enable",e)}
        </label>

        <div class="vac-grid">
          <label class="vac-field">
            <span class="filter-label">${s("vacation_start",e)}</span>
            <input type="date" .value=${this._vacStart}
              @change=${a=>this._setVacationDate("start",a.target.value)} />
          </label>
          <label class="vac-field">
            <span class="filter-label">${s("vacation_end",e)}</span>
            <input type="date" .value=${this._vacEnd}
              @change=${a=>this._setVacationDate("end",a.target.value)} />
          </label>
          <label class="vac-field">
            <span class="filter-label">${s("vacation_buffer",e)}</span>
            <input type="number" min="0" max="14" .value=${String(this._vacBuffer)}
              @change=${a=>this._setVacationBuffer(parseInt(a.target.value,10)||0)} />
          </label>
        </div>

        <details class="vac-exempt-panel">
          <summary>
            ${s("vacation_exempt_title",e)}
            ${i>0?o`<span class="section-badge">${i}</span>`:d}
          </summary>
          <p class="section-desc">${s("vacation_exempt_desc",e)}</p>
          ${this._vacAllTasks.length===0?o`<button @click=${this._loadAllTasksForVacation}>${s("vacation_load_tasks",e)}</button>`:o`
              <div class="vac-task-list">
                ${this._renderVacationTaskList(e)}
              </div>
            `}
        </details>

        ${this._vacStart&&this._vacEnd?o`
          <div class="vac-preview-toolbar">
            <button @click=${this._loadVacationPreview} ?disabled=${this._vacPreviewLoading}>
              ${this._vacPreviewLoading?"\u2026":s("vacation_preview_btn",e)}
            </button>
            ${this._vacPreview.length>0?o`<span class="vac-preview-count">${this._vacPreview.length} ${s("vacation_preview_affected",e)}</span>`:d}
          </div>
          ${this._vacPreview.length>0?this._renderVacationPreview(e):d}
        `:d}

        ${this._vacIsActive||t?o`<button class="vac-end-now" @click=${this._endVacationNow}>
              ${s("vacation_end_now",e)}
            </button>`:d}
      </div>
    `}_renderVacationTaskList(e){let t=new Map;for(let a of this._vacAllTasks){let n=t.get(a.object_name)||[];n.push(a),t.set(a.object_name,n)}return[...t.entries()].sort(([a],[n])=>a.localeCompare(n)).map(([a,n])=>o`
      <div class="vac-task-group">
        <div class="vac-task-group-name">${a||s("no_objects",e)}</div>
        ${n.sort((c,u)=>c.task_name.localeCompare(u.task_name)).map(c=>o`
            <label class="vac-task-row">
              <input type="checkbox"
                .checked=${this._vacExempt.has(c.task_id)}
                @change=${u=>this._toggleVacationExempt(c.task_id,u.target.checked)} />
              <span>${c.task_name}</span>
            </label>
          `)}
      </div>
    `)}_renderVacationPreview(e){return o`
      <div class="vac-preview-list">
        ${this._vacPreview.map(t=>{let i=t.events.map(n=>{let c=`vacation_event_${n.status}`;return`${n.date} (${s(c,e)})`}).join(" \xB7 "),a=!t.will_suppress;return o`
            <div class="vac-preview-row ${a?"exempt":""}">
              <div class="vac-preview-info">
                <div class="vac-preview-name">
                  <strong>${t.object_name}</strong> · ${t.task_name}
                  ${t.kind==="sensor_based"?o`<span class="vac-preview-kind">${s("vacation_sensor_based",e)}</span>`:d}
                </div>
                <div class="vac-preview-events">${i}</div>
              </div>
              <div class="vac-preview-actions">
                <button @click=${()=>this._previewActionComplete(t)}>${s("qr_action_complete",e)}</button>
                ${t.kind==="time_based"?o`<button @click=${()=>this._previewActionSkip(t)}>${s("qr_action_skip",e)}</button>`:d}
                <button class=${a?"vac-notify-on":""}
                  @click=${()=>this._toggleVacationExempt(t.task_id,!a)}>
                  ${a?s("vacation_action_unsilence",e):s("vacation_action_notify",e)}
                </button>
              </div>
            </div>
          `})}
      </div>
    `}async _loadAllTasksForVacation(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),t=[];for(let i of e.objects||[])for(let a of i.tasks||[])t.push({entry_id:i.entry_id,object_name:i.object.name||"",task_id:a.id,task_name:a.name||""});this._vacAllTasks=t}catch{this._showToast(s("action_error",this._lang))}}async _saveVacation(e){if(!this._vacSaving){this._vacSaving=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/update",...e});this._vacEnabled=t.enabled,this._vacStart=t.start||"",this._vacEnd=t.end||"",this._vacBuffer=t.buffer_days,this._vacExempt=new Set(t.exempt_task_ids||[]),this._vacIsActive=t.is_active,this._vacWindowEnd=t.window_end,this.dispatchEvent(new CustomEvent("settings-changed"))}catch(t){let i=t?.message||s("action_error",this._lang);this._showToast(i)}finally{this._vacSaving=!1}}}_toggleVacationEnabled(e){this._saveVacation({enabled:e})}_setVacationDate(e,t){let i={};i[e]=t||null,this._saveVacation(i)}_setVacationBuffer(e){e<0||e>14||this._saveVacation({buffer_days:e})}_toggleVacationExempt(e,t){let i=new Set(this._vacExempt);t?i.add(e):i.delete(e),this._saveVacation({exempt_task_ids:[...i]})}async _loadVacationPreview(){this._vacPreviewLoading=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/preview"});this._vacPreview=e.rows||[]}catch{this._showToast(s("action_error",this._lang))}finally{this._vacPreviewLoading=!1}}async _previewActionComplete(e){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/complete",entry_id:e.entry_id,task_id:e.task_id}),this._showToast(s("vacation_marked_complete",this._lang)),await this._loadVacationPreview()}catch{this._showToast(s("action_error",this._lang))}}async _previewActionSkip(e){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/skip",entry_id:e.entry_id,task_id:e.task_id,reason:"Skipped before vacation"}),this._showToast(s("vacation_marked_skip",this._lang)),await this._loadVacationPreview()}catch{this._showToast(s("action_error",this._lang))}}async _endVacationNow(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/end_now"});this._vacEnabled=e.enabled,this._vacEnd=e.end||"",this._vacIsActive=e.is_active,this._vacWindowEnd=e.window_end,this.dispatchEvent(new CustomEvent("settings-changed")),this._showToast(s("vacation_ended",this._lang))}catch{this._showToast(s("action_error",this._lang))}}_renderPrintQr(e){let t=this._qrSelectedEntries.size||this._qrObjects.length,i=this._qrActions.size,a=t*i,n=a>200;return o`
      <div class="settings-section qr-print-section">
        <h3>${s("qr_print_title",e)}</h3>
        <p class="section-desc">${s("qr_print_desc",e)}</p>

        ${this._qrObjectsLoaded?o`
            <details open class="qr-filter-panel">
              <summary>${s("qr_print_filter",e)}</summary>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${s("qr_print_objects",e)}</div>
                <div class="qr-object-list">
                  ${this._qrObjects.length===0?o`<div class="hint">${s("no_objects",e)}</div>`:this._qrObjects.map(c=>o`
                      <label class="qr-object-row">
                        <input type="checkbox"
                          .checked=${this._qrSelectedEntries.size===0||this._qrSelectedEntries.has(c.entry_id)}
                          @change=${u=>this._toggleQrObject(c.entry_id,u.target.checked)} />
                        <span>${c.name}</span>
                        <span class="qr-task-count">${c.task_count}</span>
                      </label>
                    `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${s("qr_print_actions",e)}</div>
                <div class="qr-action-chips">
                  ${["view","complete","skip"].map(c=>o`
                    <label class="qr-action-chip ${this._qrActions.has(c)?"active":""}">
                      <input type="checkbox"
                        .checked=${this._qrActions.has(c)}
                        @change=${u=>this._toggleQrAction(c,u.target.checked)} />
                      ${s("qr_action_"+c,e)}
                    </label>
                  `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${s("qr_print_url_mode",e)}</div>
                <select .value=${this._qrUrlMode}
                  @change=${c=>{this._qrUrlMode=c.target.value}}>
                  <option value="companion">${s("qr_mode_companion",e)}</option>
                  <option value="local">${s("qr_mode_local",e)}</option>
                  <option value="server">${s("qr_mode_server",e)}</option>
                </select>
              </div>

              <div class="qr-filter-group qr-filter-actions">
                <div class="qr-estimate ${n?"error":""}">
                  ${s("qr_print_estimate",e)}: <strong>${a}</strong>
                  ${n?o` — ${s("qr_print_over_limit",e)}`:d}
                </div>
                <button
                  ?disabled=${this._qrBatchLoading||n||i===0}
                  @click=${this._generateBatch}>
                  ${this._qrBatchLoading?s("qr_print_generating",e):s("qr_print_generate",e)}
                </button>
              </div>
            </details>

            ${this._qrBatchResults.length>0?o`
                <div class="qr-results-toolbar">
                  <span>${this._qrBatchResults.length} ${s("qr_print_ready",e)}</span>
                  <button @click=${this._printQrs}>${s("qr_print_print_button",e)}</button>
                </div>
                <div class="qr-print-grid">
                  ${this._qrBatchResults.map(c=>o`
                    <div class="qr-print-cell">
                      <div class="qr-svg">${Qt(c.svg)}</div>
                      <div class="qr-label">
                        <div class="qr-label-obj">${c.object_name}</div>
                        <div class="qr-label-task">${c.task_name}</div>
                        <div class="qr-label-action">${s("qr_action_"+c.action,e)}</div>
                      </div>
                    </div>
                  `)}
                </div>
              `:d}
          `:o`<button @click=${this._loadQrObjects}>${s("qr_print_load",e)}</button>`}
      </div>
    `}async _loadQrObjects(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._qrObjects=(e.objects||[]).map(t=>({entry_id:t.entry_id,name:t.object.name,task_count:(t.tasks||[]).length})).sort((t,i)=>t.name.localeCompare(i.name)),this._qrObjectsLoaded=!0}catch{this._showToast(s("action_error",this._lang))}}_toggleQrObject(e,t){let i=new Set(this._qrSelectedEntries);if(i.size===0)for(let a of this._qrObjects)i.add(a.entry_id);t?i.add(e):i.delete(e),i.size===this._qrObjects.length&&i.clear(),this._qrSelectedEntries=i}_toggleQrAction(e,t){let i=new Set(this._qrActions);t?i.add(e):i.delete(e),this._qrActions=i}async _generateBatch(){this._qrBatchLoading=!0,this._qrBatchResults=[];try{let e={type:"maintenance_supporter/qr/batch_generate",actions:[...this._qrActions],url_mode:this._qrUrlMode};this._qrSelectedEntries.size>0&&(e.entry_ids=[...this._qrSelectedEntries]);let t=await this.hass.connection.sendMessagePromise(e);this._qrBatchResults=t.qrs||[],this._qrBatchResults.length===0&&this._showToast(s("qr_print_empty",this._lang))}catch(e){let t=e?.message||s("action_error",this._lang);this._showToast(t)}finally{this._qrBatchLoading=!1}}_printQrs(){if(this._qrBatchResults.length===0)return;let e=this._lang,t=this._qrBatchResults.map(c=>{let u=s("qr_action_"+c.action,e);return`
        <div class="cell">
          <div class="qr">${c.svg}</div>
          <div class="label">
            <div class="obj">${this._escapeHtml(c.object_name)}</div>
            <div class="task">${this._escapeHtml(c.task_name)}</div>
            <div class="action">${this._escapeHtml(u)}</div>
          </div>
        </div>`}).join(""),i=s("qr_print_title",e),a=`<!DOCTYPE html>
<html lang="${this._escapeHtml(e)}">
<head>
  <meta charset="utf-8" />
  <title>${this._escapeHtml(i)}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; color: #000; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { padding: 8mm; }
    .toolbar { padding-bottom: 6mm; display: flex; justify-content: space-between; align-items: center; }
    .toolbar h1 { font-size: 14pt; margin: 0; font-weight: 600; }
    .toolbar button { font: inherit; padding: 6px 14px; cursor: pointer; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6mm; }
    .cell { border: 1px solid #ddd; border-radius: 4px; padding: 4mm; display: flex; flex-direction: column; align-items: center; gap: 3mm; page-break-inside: avoid; break-inside: avoid; }
    .cell .qr { width: 100%; max-width: 50mm; }
    .cell .qr svg { width: 100%; height: auto; display: block; }
    .label { text-align: center; width: 100%; font-size: 9pt; line-height: 1.25; word-break: break-word; }
    .label .obj { font-weight: 600; }
    .label .task { color: #444; }
    .label .action { color: #777; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2mm; }
    @media print {
      .toolbar { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>${this._escapeHtml(i)} \u2014 ${this._qrBatchResults.length}</h1>
    <button onclick="window.print()">${this._escapeHtml(s("qr_print_print_button",e))}</button>
  </div>
  <div class="grid">${t}</div>
  <script>window.addEventListener("load", function () { setTimeout(function () { window.print(); }, 250); });<\/script>
</body>
</html>`,n=window.open("","_blank","width=900,height=1100");if(!n){window.print();return}n.document.open(),n.document.write(a),n.document.close()}_escapeHtml(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}_renderImportExport(e){return o`
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
          <button @click=${this._exportYaml}>${s("settings_export_yaml",e)}</button>
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
    `}async _exportJson(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/export",format:"json",include_history:this._includeHistory}),t=new Date().toISOString().slice(0,10);this._downloadFile(e.data,`maintenance_export_${t}.json`,"application/json"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _exportYaml(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/export",format:"yaml",include_history:this._includeHistory}),t=new Date().toISOString().slice(0,10);this._downloadFile(e.data,`maintenance_export_${t}.yaml`,"application/yaml"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _exportCsv(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/export"}),t=new Date().toISOString().slice(0,10);this._downloadFile(e.csv,`maintenance_export_${t}.csv`,"text/csv"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _importCsvAction(){let e=this._importCsv.trim();if(e){this._importLoading=!0;try{let t=e.startsWith("object_name"),a=(await this.hass.connection.sendMessagePromise(t?{type:"maintenance_supporter/csv/import",csv_content:e}:{type:"maintenance_supporter/json/import",json_content:e})).created??0;this._showToast(s("settings_import_success",this._lang).replace("{count}",String(a))),this._importCsv="",this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(s("action_error",this._lang))}this._importLoading=!1}}};A.styles=M`
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

    /* ─── Vacation mode section (v1.2.0) ─── */

    .vacation-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .vac-badge {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .vac-badge.active {
      background: var(--success-color, #4caf50);
      color: #fff;
    }
    .vac-badge.stale {
      background: var(--warning-color, #ff9800);
      color: #fff;
    }
    .vac-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      margin: 8px 0 12px;
    }
    .vac-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }
    .vac-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .vac-field input {
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .vac-exempt-panel {
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 10px;
      margin: 12px 0;
    }
    .vac-exempt-panel summary {
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-badge {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 1px 8px;
      border-radius: 10px;
    }
    .vac-task-list {
      max-height: 280px;
      overflow-y: auto;
      margin-top: 8px;
    }
    .vac-task-group {
      margin: 8px 0;
    }
    .vac-task-group-name {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
      padding: 4px 0;
    }
    .vac-task-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
    }
    .vac-task-row:hover { background: var(--secondary-background-color, rgba(127,127,127,0.1)); }
    .vac-preview-toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 12px 0 8px;
    }
    .vac-preview-count {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .vac-preview-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .vac-preview-row {
      display: flex;
      gap: 12px;
      padding: 10px 12px;
      background: var(--secondary-background-color, rgba(127,127,127,0.08));
      border-radius: 6px;
      border-left: 3px solid var(--warning-color, #ff9800);
    }
    .vac-preview-row.exempt {
      border-left-color: var(--success-color, #4caf50);
    }
    .vac-preview-info { flex: 1; }
    .vac-preview-name { font-size: 14px; }
    .vac-preview-kind {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-left: 6px;
    }
    .vac-preview-events {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .vac-preview-actions {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .vac-preview-actions button {
      font-size: 12px;
      padding: 4px 10px;
    }
    .vac-notify-on { background: var(--success-color, #4caf50) !important; color: #fff; }
    .vac-end-now {
      margin-top: 12px;
      background: var(--error-color, #f44336);
      color: #fff;
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
  `,p([w({attribute:!1})],A.prototype,"hass",2),p([w({attribute:!1})],A.prototype,"features",2),p([w({attribute:!1})],A.prototype,"budget",2),p([h()],A.prototype,"_settings",2),p([h()],A.prototype,"_loading",2),p([h()],A.prototype,"_importCsv",2),p([h()],A.prototype,"_importLoading",2),p([h()],A.prototype,"_includeHistory",2),p([h()],A.prototype,"_toast",2),p([h()],A.prototype,"_testingNotification",2),p([h()],A.prototype,"_users",2),p([h()],A.prototype,"_vacEnabled",2),p([h()],A.prototype,"_vacStart",2),p([h()],A.prototype,"_vacEnd",2),p([h()],A.prototype,"_vacBuffer",2),p([h()],A.prototype,"_vacExempt",2),p([h()],A.prototype,"_vacIsActive",2),p([h()],A.prototype,"_vacWindowEnd",2),p([h()],A.prototype,"_vacAllTasks",2),p([h()],A.prototype,"_vacPreview",2),p([h()],A.prototype,"_vacPreviewLoading",2),p([h()],A.prototype,"_vacSaving",2),p([h()],A.prototype,"_qrObjects",2),p([h()],A.prototype,"_qrSelectedEntries",2),p([h()],A.prototype,"_qrActions",2),p([h()],A.prototype,"_qrUrlMode",2),p([h()],A.prototype,"_qrBatchLoading",2),p([h()],A.prototype,"_qrBatchResults",2),p([h()],A.prototype,"_qrObjectsLoaded",2);customElements.define("maintenance-settings-view",A);var is=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],X=class extends C{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let e=this._buildOverrides();if(e!==null){this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:e}),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(t){this._error=V(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}};this._clearAll=async()=>{this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:{}}),this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(e){this._error=V(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}open(e,t,i){if(this._entryId=e,this._taskId=t,this._values=new Array(12).fill(""),i)for(let[a,n]of Object.entries(i)){let c=parseInt(a,10);c>=1&&c<=12&&typeof n=="number"&&(this._values[c-1]=n.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let e={};for(let t=0;t<12;t++){let i=this._values[t].trim();if(!i)continue;let a=parseFloat(i);if(Number.isNaN(a))return this._error=`${s("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][t],this._lang)}: ${s("seasonal_override_invalid",this._lang)}`,null;if(a<.1||a>5)return this._error=s("seasonal_override_range",this._lang),null;e[t+1]=a}return e}render(){if(!this._open)return o``;let e=this._lang;return o`
      <ha-dialog open @closed=${this._close} heading="${s("seasonal_overrides_title",e)}">
        <div class="content">
          <p class="hint">${s("seasonal_overrides_hint",e)}</p>
          ${this._error?o`<div class="error">${this._error}</div>`:d}
          <div class="months">
            ${is.map((t,i)=>o`
              <label class="month">
                <span class="mn">${s(t,e)}</span>
                <input type="number" step="0.1" min="0.1" max="5.0"
                  placeholder="1.0"
                  .value=${this._values[i]}
                  @input=${a=>{let n=[...this._values];n[i]=a.target.value,this._values=n}} />
              </label>
            `)}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._clearAll} .disabled=${this._loading}>
            ${s("clear_all",e)}
          </ha-button>
          <div class="spacer"></div>
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading}>
            ${this._loading?s("saving",e):s("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};X.styles=M`
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
  `,p([w({attribute:!1})],X.prototype,"hass",2),p([h()],X.prototype,"_open",2),p([h()],X.prototype,"_loading",2),p([h()],X.prototype,"_error",2),p([h()],X.prototype,"_entryId",2),p([h()],X.prototype,"_taskId",2),p([h()],X.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",X);var Y=class extends C{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(e,t)=>{let i=`${e}:${t}`,a=new Set(this._selected);a.has(i)?a.delete(i):a.add(i),this._selected=a};this._save=async()=>{let e=this._name.trim();if(!e){this._error=s("group_name_required",this._lang);return}this._loading=!0,this._error="";try{let t=this._buildTaskRefs();this._groupId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/update",group_id:this._groupId,name:e,description:this._description,task_refs:t}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/create",name:e,description:this._description,task_refs:t}),this._open=!1,this.dispatchEvent(new CustomEvent("group-saved"))}catch(t){this._error=V(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._reset(),this._open=!0}openEdit(e,t){this._reset(),this._groupId=e,this._name=t.name,this._description=t.description||"",this._selected=new Set(t.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(e=>{let[t,i]=e.split(":",2);return{entry_id:t,task_id:i}})}render(){if(!this._open)return o``;let e=this._lang,t=this._groupId?s("edit_group",e):s("new_group",e);return o`
      <ha-dialog open @closed=${this._close} heading="${t}">
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:d}
          <ms-textfield
            label="${s("name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("description_optional",e)}"
            .value=${this._description}
            @input=${i=>this._description=i.target.value}
          ></ms-textfield>

          <div class="section-title">${s("group_select_tasks",e)}</div>
          ${this.objects.length===0?o`<div class="hint">${s("no_objects",e)}</div>`:o`
              <div class="objects">
                ${[...this.objects].sort((i,a)=>i.object.name.localeCompare(a.object.name)).map(i=>o`
                  <div class="object-block">
                    <div class="object-name">${i.object.name}</div>
                    ${i.tasks.length===0?o`<div class="hint small">${s("no_tasks_short",e)}</div>`:[...i.tasks].sort((a,n)=>a.name.localeCompare(n.name)).map(a=>{let n=`${i.entry_id}:${a.id}`,c=this._selected.has(n);return o`
                          <label class="task-row">
                            <input type="checkbox"
                              .checked=${c}
                              @change=${()=>this._toggleTask(i.entry_id,a.id)} />
                            <span>${a.name}</span>
                          </label>
                        `})}
                  </div>
                `)}
              </div>
            `}
          <div class="selected-count">
            ${s("selected",e)}: ${this._selected.size}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",e)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()}>
            ${this._loading?s("saving",e):s("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};Y.styles=M`
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
  `,p([w({attribute:!1})],Y.prototype,"hass",2),p([w({attribute:!1})],Y.prototype,"objects",2),p([h()],Y.prototype,"_open",2),p([h()],Y.prototype,"_loading",2),p([h()],Y.prototype,"_error",2),p([h()],Y.prototype,"_groupId",2),p([h()],Y.prototype,"_name",2),p([h()],Y.prototype,"_description",2),p([h()],Y.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",Y);var ss=300,as=140,ht=27;function Zt(l,r){let e=l.trigger_config;if(!e)return d;let t=r.lang,i=l.trigger_entity_info,a=l.trigger_entity_infos,n=i?.friendly_name||e.entity_id||"\u2014",c=e.entity_id||"",u=e.entity_ids||(c?[c]:[]),_=i?.unit_of_measurement||"",m=l.trigger_current_value,g=e.type||"threshold",v=u.length>1;return o`
    <h3>${s("trigger",t)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${v?o`
            <div class="trigger-entity-name">${u.length} ${s("entities",t)} (${e.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${u.map((f,x)=>o`${x>0?", ":""}<span class="entity-link" @click=${b=>de(b,f)}>${f}</span>`)}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `:o`
            <div class="trigger-entity-name">${n}</div>
            <div class="trigger-entity-id">${c?o`<span class="entity-link" @click=${f=>de(f,c)}>${c}</span>`:""}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${l.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${l.trigger_active?s("triggered",t):s("ok",t)}
        </span>
      </div>

      ${m!=null?o`
            <div class="trigger-value-row">
              <span class="trigger-current ${l.trigger_active?"active":""}">${typeof m=="number"?m.toFixed(1):m}</span>
              ${_?o`<span class="trigger-unit">${_}</span>`:d}
            </div>
          `:d}

      <div class="trigger-limits">
        ${g==="threshold"?o`
          ${e.trigger_above!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_above",t)}: ${e.trigger_above} ${_}</span>`:d}
          ${e.trigger_below!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_below",t)}: ${e.trigger_below} ${_}</span>`:d}
          ${e.trigger_for_minutes?o`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("for_minutes",t)}: ${e.trigger_for_minutes}</span>`:d}
        `:d}
        ${g==="counter"?o`
          ${e.trigger_target_value!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("target_value",t)}: ${e.trigger_target_value} ${_}</span>`:d}
        `:d}
        ${g==="state_change"?o`
          ${e.trigger_target_changes!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("target_changes",t)}: ${e.trigger_target_changes}</span>`:d}
        `:d}
        ${g==="runtime"?o`
          ${e.trigger_runtime_hours!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("runtime_hours",t)}: ${e.trigger_runtime_hours}h</span>`:d}
        `:d}
        ${g==="compound"?o`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("compound_logic",t)}: ${e.compound_logic||e.operator||"AND"}</span>
          ${(e.conditions||[]).map((f,x)=>o`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${x+1}. ${s(f.type||"unknown",t)}: ${f.entity_id?o`<span class="entity-link" @click=${b=>de(b,f.entity_id)}>${f.entity_id}</span>`:""}</span>
          `)}
        `:d}
        ${i?.min!=null?o`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("min",t)}: ${i.min} ${_}</span>`:d}
        ${i?.max!=null?o`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("max",t)}: ${i.max} ${_}</span>`:d}
      </div>

      ${a&&a.length>1?o`
        <div class="trigger-entity-list">
          ${a.map(f=>o`
            <span class="trigger-entity-id">${f.friendly_name} (<span class="entity-link" @click=${x=>de(x,f.entity_id)}>${f.entity_id}</span>)</span>
          `)}
        </div>
      `:d}

      ${rs(l,_,r)}
    </div>
  `}function rs(l,r,e){let t=l.trigger_config;if(!t)return d;let i=t.type||"threshold",a=i==="counter"&&t.trigger_delta_mode,n=e.isCounterEntity(t),c=t.entity_id||"",u=e.detailStatsData.get(c)||[],_=[],m=!1;if(u.length>=2)for(let y of u){let j=y.val;a&&l.trigger_baseline_value!=null&&(j-=l.trigger_baseline_value);let O={ts:y.ts,val:j};!n&&y.min!=null&&y.max!=null&&(O.min=a&&l.trigger_baseline_value!=null?y.min-l.trigger_baseline_value:y.min,O.max=a&&l.trigger_baseline_value!=null?y.max-l.trigger_baseline_value:y.max,m=!0),_.push(O)}else for(let y of l.history)y.trigger_value!=null&&_.push({ts:new Date(y.timestamp).getTime(),val:y.trigger_value});if(l.trigger_current_value!=null){let y=l.trigger_current_value;a&&l.trigger_baseline_value!=null&&(y-=l.trigger_baseline_value),_.push({ts:Date.now(),val:y})}if(_.length<2&&c&&e.hasStatsService&&!e.detailStatsData.has(c))return o`<div class="sparkline-container" aria-live="polite" style="display:flex;align-items:center;justify-content:center;height:140px;color:var(--secondary-text-color);font-size:12px;">
      <ha-icon icon="mdi:chart-line" style="--mdc-icon-size:16px;margin-right:8px;"></ha-icon>
      ${s("loading_chart",e.lang)}
    </div>`;if(_.length<2)return d;_.sort((y,j)=>y.ts-j.ts);let g=ss,v=as,f=30,x=2,b=8,L=16,I=_.map(y=>y.val),S=Math.min(...I),k=Math.max(...I);if(m)for(let y of _)y.min!=null&&(S=Math.min(S,y.min)),y.max!=null&&(k=Math.max(k,y.max));t.trigger_above!=null&&(k=Math.max(k,t.trigger_above),S=Math.min(S,t.trigger_above)),t.trigger_below!=null&&(S=Math.min(S,t.trigger_below),k=Math.max(k,t.trigger_below));let R=null,F=null;if(i==="counter"&&t.trigger_target_value!=null){if(l.trigger_baseline_value!=null)R=l.trigger_baseline_value;else if(_.length>0){let y=[...l.history].filter(j=>j.type==="completed"||j.type==="reset").sort((j,O)=>new Date(O.timestamp).getTime()-new Date(j.timestamp).getTime())[0];if(y){let j=new Date(y.timestamp).getTime(),O=_[0],U=Math.abs(_[0].ts-j);for(let se of _){let ae=Math.abs(se.ts-j);ae<U&&(O=se,U=ae)}R=O.val}else R=_[0].val}R!=null?(F=R+t.trigger_target_value,k=Math.max(k,F),S=Math.min(S,R)):(k=Math.max(k,t.trigger_target_value),S=Math.min(S,0))}a&&l.trigger_baseline_value!=null&&(S=Math.min(S,0));let W=k-S||1;S-=W*.1,k+=W*.1;let G=_[0].ts,q=_[_.length-1].ts,E=q-G||1,P=y=>f+(y-G)/E*(g-f-x),H=y=>b+(1-(y-S)/(k-S))*(v-b-L),Ve=_.map(y=>`${P(y.ts).toFixed(1)},${H(y.val).toFixed(1)}`).join(" "),oi=`M${P(_[0].ts).toFixed(1)},${v-L} `+_.map(y=>`L${P(y.ts).toFixed(1)},${H(y.val).toFixed(1)}`).join(" ")+` L${P(_[_.length-1].ts).toFixed(1)},${v-L} Z`,Ke="";if(m){let y=_.filter(j=>j.min!=null&&j.max!=null);if(y.length>=2){let j=y.map(U=>`${P(U.ts).toFixed(1)},${H(U.max).toFixed(1)}`),O=[...y].reverse().map(U=>`${P(U.ts).toFixed(1)},${H(U.min).toFixed(1)}`);Ke=`M${j[0]} `+j.slice(1).map(U=>`L${U}`).join(" ")+` L${O[0]} `+O.slice(1).map(U=>`L${U}`).join(" ")+" Z"}}let gt=_[_.length-1],li=P(gt.ts),ci=H(gt.val),mt=y=>Math.abs(y)>=1e4?(y/1e3).toFixed(0)+"k":y>=1e3?(y/1e3).toFixed(1)+"k":y.toFixed(y<10?1:0),di=mt(k),pi=mt(S),ui=l.history.filter(y=>["completed","skipped","reset"].includes(y.type)).map(y=>({ts:new Date(y.timestamp).getTime(),type:y.type})).filter(y=>y.ts>=G&&y.ts<=q),Ye=_;if(_.length>ht){let y=(_.length-1)/(ht-1);Ye=[];for(let j=0;j<ht;j++)Ye.push(_[Math.round(j*y)])}return o`
    <div class="sparkline-container">
      <svg class="sparkline-svg" viewBox="0 0 ${g} ${v}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_sparkline",e.lang)}">
        <text x="${f-3}" y="${b+3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${di}</text>
        <text x="${f-3}" y="${v-L+3}" text-anchor="end" fill="var(--secondary-text-color)" font-size="8">${pi}</text>
        <text x="${f}" y="${v-1}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(G).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
        <text x="${g-x}" y="${v-1}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(q).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
        ${Ke?z`<path d="${Ke}" fill="var(--primary-color)" opacity="0.08" />`:d}
        <path d="${oi}" fill="var(--primary-color)" opacity="0.15" />
        <polyline points="${Ve}" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linejoin="round" />
        ${l.degradation_rate!=null&&l.degradation_trend!=="stable"&&l.degradation_trend!=="insufficient_data"&&_.length>=2?(()=>{let y=_[_.length-1],j=30,O=y.ts+j*864e5,U=y.val+l.degradation_rate*j,se=Math.min(O,q+(q-G)*.3),ae=Math.max(S,Math.min(k,U)),_i=P(y.ts),hi=H(y.val),gi=P(se),mi=H(ae);return z`<line x1="${_i.toFixed(1)}" y1="${hi.toFixed(1)}" x2="${gi.toFixed(1)}" y2="${mi.toFixed(1)}" stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7" />`})():d}
        ${i==="threshold"&&t.trigger_above!=null?z`<line x1="${f}" y1="${H(t.trigger_above).toFixed(1)}" x2="${g}" y2="${H(t.trigger_above).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                <text x="${g-2}" y="${H(t.trigger_above)-3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">\u25B2 ${t.trigger_above}</text>`:d}
        ${i==="threshold"&&t.trigger_below!=null?z`<line x1="${f}" y1="${H(t.trigger_below).toFixed(1)}" x2="${g}" y2="${H(t.trigger_below).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                <text x="${g-2}" y="${H(t.trigger_below)+11}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">\u25BC ${t.trigger_below}</text>`:d}
        ${i==="counter"&&F!=null?z`<line x1="${f}" y1="${H(F).toFixed(1)}" x2="${g}" y2="${H(F).toFixed(1)}" stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="5,3" />
                <text x="${g-2}" y="${H(F)-3}" text-anchor="end" fill="var(--error-color, #f44336)" font-size="9">${s("target_value",e.lang)}: +${t.trigger_target_value}</text>`:d}
        ${i==="counter"&&R!=null?z`<line x1="${f}" y1="${H(R).toFixed(1)}" x2="${g}" y2="${H(R).toFixed(1)}" stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
                <text x="${f+2}" y="${H(R)+11}" text-anchor="start" fill="var(--secondary-text-color)" font-size="8">${s("baseline",e.lang)}</text>`:d}
        <circle cx="${li.toFixed(1)}" cy="${ci.toFixed(1)}" r="3.5" fill="var(--primary-color)" />
        ${ui.map(y=>{let j=P(y.ts),O=y.type==="completed"?"var(--success-color, #4caf50)":y.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return z`
            <line x1="${j.toFixed(1)}" y1="${b}" x2="${j.toFixed(1)}" y2="${v-L}" stroke="${O}" stroke-width="1" stroke-dasharray="3,3" opacity="0.5" />
            <circle cx="${j.toFixed(1)}" cy="${b+2}" r="5" fill="${O}" opacity="0.8" />
            <text x="${j.toFixed(1)}" y="${b+6}" text-anchor="middle" fill="white" font-size="7" font-weight="bold">${y.type==="completed"?"\u2713":y.type==="skipped"?"\u23ED":"\u21BA"}</text>
          `})}
        ${Ye.map(y=>{let j=P(y.ts),O=H(y.val),U=new Date(y.ts).toLocaleDateString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),se=`${y.val.toFixed(1)} ${r}`;return m&&y.min!=null&&y.max!=null&&(se+=` (${y.min.toFixed(1)}\u2013${y.max.toFixed(1)})`),z`<circle cx="${j.toFixed(1)}" cy="${O.toFixed(1)}" r="8" fill="transparent" tabindex="0"
            @mouseenter=${ae=>Jt(ae,`${U}
${se}`,e.setTooltip)}
            @focus=${ae=>Jt(ae,`${U}
${se}`,e.setTooltip)}
            @mouseleave=${()=>{e.setTooltip(null)}}
            @blur=${()=>{e.setTooltip(null)}} />`})}
      </svg>
      ${e.tooltip?o`
        <div class="sparkline-tooltip" role="tooltip" aria-live="assertive" style="left:${e.tooltip.x}px;top:${e.tooltip.y}px">
          ${e.tooltip.text.split(`
`).map(y=>o`<div>${y}</div>`)}
        </div>
      `:d}
    </div>
  `}function Jt(l,r,e){let t=l.currentTarget,i=t.closest(".sparkline-container");if(!i)return;let a=i.getBoundingClientRect(),n=t.getBoundingClientRect();e({x:n.left-a.left+n.width/2,y:n.top-a.top-8,text:r})}function Xt(l,r,e){let t=l.degradation_trend!=null&&l.degradation_trend!=="insufficient_data",i=l.days_until_threshold!=null,a=l.environmental_factor!=null&&l.environmental_factor!==1;if(!t&&!i&&!a)return d;let n=l.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":l.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${l.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",r).replace("{days}",String(Math.round(l.days_until_threshold||0)))}
        </div>
      `:d}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",r)}
      </div>
      <div class="prediction-grid">
        ${t?o`
          <div class="prediction-item">
            <ha-svg-icon path="${n}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",r)}</span>
            <span class="prediction-value ${l.degradation_trend}">${s("trend_"+l.degradation_trend,r)}</span>
            ${l.degradation_rate!=null?o`<span class="prediction-rate">${l.degradation_rate>0?"+":""}${Math.abs(l.degradation_rate)>=10?Math.round(l.degradation_rate).toLocaleString():l.degradation_rate.toFixed(1)} ${l.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",r)}</span>`:d}
          </div>
        `:d}
        ${i?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",r)}</span>
            <span class="prediction-value prediction-days${l.days_until_threshold===0?" exceeded":l.sensor_prediction_urgency?" urgent":""}">${l.days_until_threshold===0?s("threshold_exceeded",r):"~"+Math.round(l.days_until_threshold)+" "+s("days",r)}</span>
            ${l.threshold_prediction_date?o`<span class="prediction-date">${Q(l.threshold_prediction_date,r)}</span>`:d}
            ${l.threshold_prediction_confidence?o`<span class="confidence-dot ${l.threshold_prediction_confidence}"></span>`:d}
          </div>
        `:d}
        ${a&&e.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",r)}</span>
            <span class="prediction-value">${l.environmental_factor.toFixed(2)}x</span>
            ${l.environmental_entity?o`<span class="prediction-entity entity-link" @click=${c=>de(c,l.environmental_entity)}>${l.environmental_entity}</span>`:d}
          </div>
        `:d}
      </div>
    </div>
  `}function ei(l,r){let e=l.interval_analysis,t=e?.weibull_beta,i=e?.weibull_eta;if(t==null||i==null||i<=0)return d;let a=l.interval_days??0,n=l.suggested_interval??a;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",r)}
        ${ns(t,r)}
      </div>
      ${os(t,i,a,n,r)}
      ${ls(e,r)}
      ${e?.confidence_interval_low!=null?cs(e,l,r):d}
    </div>
  `}function ns(l,r){let e,t,i;return l<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):l<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):l<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),o`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${s(i,r)} (\u03B2=${l.toFixed(2)})
    </span>
  `}function os(l,r,e,t,i){let f=Math.max(e,t,r,1)*1.3,x=50,b=[];for(let q=0;q<=x;q++){let E=q/x*f,P=1-Math.exp(-Math.pow(E/r,l)),H=32+E/f*260,Ve=136-P*128;b.push([H,Ve])}let L=b.map(([q,E])=>`${q.toFixed(1)},${E.toFixed(1)}`).join(" "),I="M32,136 "+b.map(([q,E])=>`L${q.toFixed(1)},${E.toFixed(1)}`).join(" ")+` L${b[x][0].toFixed(1)},136 Z`,S=32+e/f*260,k=1-Math.exp(-Math.pow(e/r,l)),R=136-k*128,F=((1-k)*100).toFixed(0),W=32+t/f*260,G=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",i)}">
        ${G.map(q=>{let E=136-q*128;return z`
            <line x1="${32}" y1="${E.toFixed(1)}" x2="${292}" y2="${E.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${q===.5?"4,3":d}" />
            <text x="${28}" y="${(E+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(q*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f)}</text>

        <path d="${I}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${L}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?z`
          <line x1="${S.toFixed(1)}" y1="${8}" x2="${S.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${S.toFixed(1)}" cy="${R.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(S+4).toFixed(1)}" y="${(R-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${F}%</text>
        `:d}

        ${t>0&&t!==e?z`
          <line x1="${W.toFixed(1)}" y1="${8}" x2="${W.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:d}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",i)}</span>
      ${e>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",i)}</span>`:d}
      ${t>0&&t!==e?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",i)}</span>`:d}
    </div>
  `}function ls(l,r){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",r)}</span>
        <span class="weibull-info-value">${Math.round(l.weibull_eta)} ${s("days",r)}</span>
      </div>
      ${l.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",r)}</span>
          <span class="weibull-info-value">${l.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:d}
    </div>
  `}function cs(l,r,e){let t=l.confidence_interval_low,i=l.confidence_interval_high,a=r.suggested_interval??r.interval_days??0,n=r.interval_days??0,c=Math.max(0,t-5),_=i+5-c,m=(t-c)/_*100,g=(i-t)/_*100,v=(a-c)/_*100,f=n>0?(n-c)/_*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",e)}: ${a} ${s("days",e)} (${t}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${m.toFixed(1)}%;width:${g.toFixed(1)}%"></div>
        ${f>=0?o`<div class="confidence-marker current" style="left:${f.toFixed(1)}%"></div>`:d}
        <div class="confidence-marker recommended" style="left:${v.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",e)} (${t}${s("days",e).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",e)} (${i}${s("days",e).charAt(0)})</span>
      </div>
    </div>
  `}function ti(l,r,e,t){let i=Math.max(l||1,r);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",t)}: ${l??"\u2014"} ${l!=null?s("days",t):""}
        </div>
        <div class="interval-visual current"
          style="width: ${l!=null?Math.min(l/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${s("recommended",t)}: ${r} ${s("days",t)}
          <span class="confidence-badge ${e}">${s(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(r/i*100,100)}%"></div>
      </div>
    </div>
  `}var ii=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function si(l,r,e){if(!e.seasonal||!l.seasonal_factor||l.seasonal_factor===1)return d;let t=ii.map(c=>s(c,r)),i=new Date().getMonth(),a=l.seasonal_factors||l.interval_analysis?.seasonal_factors||null,n=a&&a.length===12?a:t.map((c,u)=>{let _=l.seasonal_factor||1,m=Math.sin((u-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,_+m))});return o`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",r)}</h4>
      <div class="seasonal-mini-chart">
        ${n.map((c,u)=>{let _=c*40,m=c<.9?"low":c>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${m} ${u===i?"current":""}"
                 style="height: ${_}px"
                 title="${t[u]}: ${c.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",r)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",r)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",r)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function ai(l,r){return ds(l,r)}function ds(l,r){let e=l.seasonal_factors??l.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return d;let t=l.interval_analysis?.seasonal_reason,i=new Date().getMonth(),a=300,n=100,c=8,_=n-c-4,m=Math.max(...e,1.5),g=a/12,v=g*.65,f=c+_-1/m*_;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",r)}
        ${t?o`<span class="source-tag">${t==="learned"?s("seasonal_learned",r):s("seasonal_manual",r)}</span>`:d}
      </div>
      <svg viewBox="0 0 ${a} ${n}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",r)}">
        <line x1="0" y1="${f.toFixed(1)}" x2="${a}" y2="${f.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((x,b)=>{let L=x/m*_,I=b*g+(g-v)/2,S=c+_-L,k=b===i,R=x<1?"var(--success-color, #4caf50)":x>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return z`
            <rect x="${I.toFixed(1)}" y="${S.toFixed(1)}"
              width="${v.toFixed(1)}" height="${L.toFixed(1)}"
              fill="${R}" opacity="${k?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${ii.map((x,b)=>o`<span class="seasonal-label ${b===i?"active-month":""}">${s(x,r)}</span>`)}
      </div>
    </div>
  `}var ps=300,us=200;function ri(l,r,e,t){let i=l.history.filter(c=>c.type==="completed"&&(c.cost!=null||c.duration!=null));if(i.length<2)return d;let a=i.some(c=>(c.cost??0)>0),n=i.some(c=>(c.duration??0)>0);return!a&&!n?d:o`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${s("cost_duration_chart",r)}</h3>
        <div class="toggle-buttons">
          ${a?o`<button
            class="toggle-btn ${e==="cost"?"active":""}"
            @click=${()=>t("cost")}>
            ${s("cost",r)}
          </button>`:d}
          ${a&&n?o`<button
            class="toggle-btn ${e==="both"?"active":""}"
            @click=${()=>t("both")}>
            ${s("both",r)}
          </button>`:d}
          ${n?o`<button
            class="toggle-btn ${e==="duration"?"active":""}"
            @click=${()=>t("duration")}>
            ${s("duration",r)}
          </button>`:d}
        </div>
      </div>
      ${_s(l,r,e)}
    </div>
  `}function _s(l,r,e){let t=l.history.filter(E=>E.type==="completed"&&(E.cost!=null||E.duration!=null)).map(E=>({ts:new Date(E.timestamp).getTime(),cost:E.cost??0,duration:E.duration??0})).sort((E,P)=>E.ts-P.ts);if(t.length<2)return d;let i=t.some(E=>E.cost>0),a=t.some(E=>E.duration>0);if(!i&&!a)return d;let n=e!=="duration"&&i,c=e!=="cost"&&a,u=n||!c&&i,_=c||!n&&a,m=ps,g=us,v=u?32:8,f=_?32:8,x=8,b=20,L=m-v-f,I=g-x-b,S=Math.max(...t.map(E=>E.cost))||1,k=Math.max(...t.map(E=>E.duration))||1,R=Math.min(20,L/t.length*.6),F=L/t.length,W=E=>v+F*E+F/2,G=E=>x+I-E/S*I,q=E=>x+I-E/k*I;return o`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${m} ${g}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_history",r)}">
        ${u?t.map((E,P)=>z`
          <rect x="${(W(P)-R/2).toFixed(1)}" y="${G(E.cost).toFixed(1)}" width="${R.toFixed(1)}" height="${(x+I-G(E.cost)).toFixed(1)}"
            fill="var(--primary-color)" opacity="0.6" rx="2" />
        `):d}
        ${_?z`
          <polyline points="${t.map((E,P)=>`${W(P).toFixed(1)},${q(E.duration).toFixed(1)}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${t.map((E,P)=>z`
            <circle cx="${W(P).toFixed(1)}" cy="${q(E.duration).toFixed(1)}" r="3" fill="var(--accent-color, #ff9800)" />
          `)}
        `:d}
        <text x="${v}" y="${g-2}" text-anchor="start" fill="var(--secondary-text-color)" font-size="7">${new Date(t[0].ts).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
        <text x="${m-f}" y="${g-2}" text-anchor="end" fill="var(--secondary-text-color)" font-size="7">${new Date(t[t.length-1].ts).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</text>
        ${u?z`
          <text x="${v-3}" y="${x+4}" text-anchor="end" fill="var(--primary-color)" font-size="7">${S.toFixed(0)}\u20AC</text>
          <text x="${v-3}" y="${x+I+3}" text-anchor="end" fill="var(--primary-color)" font-size="7">0\u20AC</text>
        `:d}
        ${_?z`
          <text x="${m-f+3}" y="${x+4}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">${k.toFixed(0)}m</text>
          <text x="${m-f+3}" y="${x+I+3}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="7">0m</text>
        `:d}
      </svg>
    </div>
    <div class="chart-legend">
      ${u?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${s("cost",r)}</span>`:d}
      ${_?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${s("duration",r)}</span>`:d}
    </div>
  `}var hs=60,gs=20,ni=30,T=class extends C{constructor(){super(...arguments);this.narrow=!1;this.panel={};this._objects=[];this._stats=null;this._view="overview";this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._filterUser=null;this._unsub=null;this._sparklineTooltip=null;this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._actionLoading=!1;this._moreMenuOpen=!1;this._toastMessage="";this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab="dashboard";this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=Fe;this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=e=>this._onPopState(e);this._deepLinkHandled=!1;this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onCalendarLlCustom=e=>{let t=e.detail;t?.type==="maintenance-supporter:open-task"&&t.entry_id&&t.task_id&&(e.stopPropagation(),this._showTask(t.entry_id,t.task_id))};this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _lang(){return this.hass?.language||"en"}get _isOperator(){let e=this.hass?.user;return e?e.is_admin?!1:!(this._operatorWriteEnabled&&this._adminPanelUserIds.includes(e.id)):!0}connectedCallback(){super.connectedCallback(),window.addEventListener("popstate",this._popstateHandler);let e=localStorage.getItem("maintenance_supporter_sort");e&&["due_date","object","type","task_name","area","assigned_user","group"].includes(e)&&(this._sortMode=e);let t=localStorage.getItem("maintenance_supporter_object_sort");t&&["alphabetical","due_soonest","task_count"].includes(t)&&(this._objectSortMode=t);let i=localStorage.getItem("maintenance_supporter_groupby");i&&["none","area","group","user"].includes(i)&&(this._groupByMode=i);let a=localStorage.getItem("maintenance_supporter_object_view");(a==="cards"||a==="table")&&(this._objectViewMode=a)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._popstateHandler),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null,this._deepLinkHandled=!1,this._statsService?.clearCache(),this._statsService=null}updated(e){super.updated(e);let t=this.hass?.language;if(t&&!He(t)&&Pe(t).then(()=>this.requestUpdate()),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new Ne(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new ne(this.hass),this._userService.getUsers())}}async _loadData(){let[e,t,i,a,n]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null)]);if(e&&(this._objects=e.objects),t&&(this._stats=t),i&&(this._budget=i),a&&(this._groups=a.groups||{}),n){let c=n;this._features=c.features,this._adminPanelUserIds=c.admin_panel_user_ids||[],this._operatorWriteEnabled=c.operator_write_enabled??!1;let u=c.general?.default_warning_days;typeof u=="number"&&u>=0&&u<=365&&(this._defaultWarningDays=u),this._objectsTableColumns=Ee(c.objects_table_columns)}this._fetchMiniStatsForOverview(),this._handleDeepLink()}_handleDeepLink(){if(this._deepLinkHandled)return;let e=new URLSearchParams(window.location.search),t=e.get("ms_action"),i=()=>{let m=window.location.pathname+window.location.hash;history.replaceState(history.state,"",m)};if(t==="add_object"){this._deepLinkHandled=!0,i(),requestAnimationFrame(()=>{this.shadowRoot?.querySelector("maintenance-object-dialog")?.openCreate()});return}if(t==="open_vacation"||t==="open_budget"||t==="open_groups"||t==="open_settings"){this._deepLinkHandled=!0,i(),this._overviewTab="settings",requestAnimationFrame(()=>{let m=this.shadowRoot?.querySelector("maintenance-settings-view"),g=t.replace("open_","");m?.scrollToSection?.(g)});return}let a=e.get("entry_id");if(!a)return;this._deepLinkHandled=!0;let n=e.get("task_id"),c=e.get("action"),u=window.location.pathname+window.location.hash;history.replaceState(history.state,"",u);let _=this._getObject(a);if(!_){this._showOverview();return}if(n){let m=_.tasks.find(g=>g.id===n);if(!m){this._showObject(a);return}this._showTask(a,n),c==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(a,n,m.name,this._features.checklists?m.checklist:void 0,this._features.adaptive&&!!m.adaptive_config?.enabled)}):c==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(a,n,m)})}else this._showObject(a)}_isCounterEntity(e){if(!e)return!1;let t=e.type||"threshold";return t==="counter"||t==="state_change"}async _fetchDetailStats(e,t){if(!this._statsService)return;let i=await this._statsService.getDetailStats(e,t),a=new Map(this._detailStatsData);a.set(e,i),this._detailStatsData=a}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let e=[];for(let i of this._objects)for(let a of i.tasks){let n=a.trigger_config?.entity_id;n&&e.push({entityId:n,isCounter:this._isCounterEntity(a.trigger_config)})}if(e.length===0)return;let t=await this._statsService.getBatchMiniStats(e);this._miniStatsData=new Map([...this._miniStatsData,...t])}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(e=>{let t=e;this._objects=t.objects},{type:"maintenance_supporter/subscribe"})}catch{}}get _taskRows(){let e=[];for(let g of this._objects)for(let v of g.tasks){if(this._filterStatus&&v.status!==this._filterStatus)continue;if(this._filterUser){let x=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(v.responsible_user_id!==x)continue}let f=[];for(let x of Object.values(this._groups))x.task_refs?.some(b=>b.entry_id===g.entry_id&&b.task_id===v.id)&&f.push(x.name);e.push({entry_id:g.entry_id,task_id:v.id,object_name:g.object.name,task_name:v.name,type:v.type,schedule_type:v.schedule_type,status:v.status,days_until_due:v.days_until_due??null,next_due:v.next_due??null,trigger_active:v.trigger_active,trigger_current_value:v.trigger_current_value??null,trigger_current_delta:v.trigger_current_delta??null,trigger_config:v.trigger_config??null,trigger_entity_info:v.trigger_entity_info??null,times_performed:v.times_performed,total_cost:v.total_cost,interval_days:v.interval_days??null,interval_unit:v.interval_unit??null,interval_anchor:v.interval_anchor??null,is_done:v.is_done??!1,history:v.history||[],enabled:v.enabled,nfc_tag_id:v.nfc_tag_id??null,area_id:g.object.area_id??null,responsible_user_id:v.responsible_user_id??null,group_names:f})}let t={overdue:0,triggered:1,due_soon:2,ok:3},i=(g,v)=>(t[g.status]??9)-(t[v.status]??9),a=(g,v)=>(g.days_until_due??99999)-(v.days_until_due??99999),n=(g,v)=>i(g,v)||a(g,v),c=g=>g.area_id&&this.hass?.areas?.[g.area_id]?.name||"",u=g=>g.responsible_user_id&&this._userService?.getUserName(g.responsible_user_id)||"",_=g=>g.group_names[0]||"",m={due_date:n,object:(g,v)=>g.object_name.localeCompare(v.object_name)||n(g,v),type:(g,v)=>g.type.localeCompare(v.type)||n(g,v),task_name:(g,v)=>g.task_name.localeCompare(v.task_name),area:(g,v)=>{let f=c(g),x=c(v);return!f&&x?1:f&&!x?-1:f.localeCompare(x)||n(g,v)},assigned_user:(g,v)=>{let f=u(g),x=u(v);return!f&&x?1:f&&!x?-1:f.localeCompare(x)||n(g,v)},group:(g,v)=>{let f=_(g),x=_(v);return!f&&x?1:f&&!x?-1:f.localeCompare(x)||n(g,v)}};return e.sort(m[this._sortMode]),e}_getObject(e){return this._objects.find(t=>t.entry_id===e)}_getTask(e,t){return this._getObject(e)?.tasks.find(a=>a.id===t)}_pushPanelState(e,t,i){let a={msp_view:e,msp_entry:t||null,msp_task:i||null};history.pushState(a,"")}_onPopState(e){let t=e.state;if(t?.msp_view&&(this._view=t.msp_view,this._selectedEntryId=t.msp_entry||null,this._selectedTaskId=t.msp_task||null,this._moreMenuOpen=!1,t.msp_view==="task"&&t.msp_entry&&t.msp_task)){this._historyFilter=null;let i=this._getTask(t.msp_entry,t.msp_task);i?.trigger_config?.entity_id&&this._fetchDetailStats(i.trigger_config.entity_id,this._isCounterEntity(i.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_filterByStatus(e){this._filterStatus=e,this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}_scrollContentToTop(){requestAnimationFrame(()=>{let e=this.shadowRoot?.querySelector(".content");e&&e.scrollTo({top:0,behavior:"smooth"})})}_showObject(e){this._pushPanelState("object",e),this._view="object",this._selectedEntryId=e,this._selectedTaskId=null,this._scrollContentToTop()}_showTask(e,t){this._pushPanelState("task",e,t),this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._activeTab="overview",this._historyFilter=null,this._scrollContentToTop();let i=this._getTask(e,t);if(i?.trigger_config?.entity_id){let a=i.trigger_config.entity_id,n=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(a,n)}}_showToast(e){this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}async _deleteObject(e){if(await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_object",this._lang),confirmText:s("delete",this._lang),danger:!0}))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:e}),this._showOverview(),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _deleteTask(e,t){if(await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_task",this._lang),confirmText:s("delete",this._lang),danger:!0}))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/delete",entry_id:e,task_id:t}),this._showObject(e),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _skipTask(e,t,i){this._actionLoading=!0;try{let a={type:"maintenance_supporter/task/skip",entry_id:e,task_id:t};i&&(a.reason=i),await this.hass.connection.sendMessagePromise(a),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _resetTask(e,t,i){this._actionLoading=!0;try{let a={type:"maintenance_supporter/task/reset",entry_id:e,task_id:t};i&&(a.date=i),await this.hass.connection.sendMessagePromise(a),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _applySuggestion(e,t,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/apply_suggestion",entry_id:e,task_id:t,interval:i}),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}_openSeasonalOverrides(e){let t=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!t||!this._selectedEntryId)return;let i=e.adaptive_config?.seasonal_overrides;t.open(this._selectedEntryId,e.id,i)}async _reanalyzeInterval(e,t){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:e,task_id:t});i.recommended_interval?this._showToast(`${s("reanalyze_result",this._lang)}: ${i.recommended_interval} ${s("days",this._lang)} (${s(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${s("data_points",this._lang)})`):this._showToast(s("reanalyze_insufficient_data",this._lang)),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _promptSkipTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("skip",this._lang),message:s("skip_reason_prompt",this._lang),confirmText:s("skip",this._lang),inputLabel:s("reason_optional",this._lang),inputType:"text"});a.confirmed&&this._skipTask(e,t,a.value||void 0)}async _promptResetTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("reset",this._lang),message:s("reset_date_prompt",this._lang),confirmText:s("reset",this._lang),inputLabel:s("reset_date_optional",this._lang),inputType:"date"});a.confirmed&&this._resetTask(e,t,a.value||void 0)}_dismissSuggestion(e,t){e&&t&&this._dismissedSuggestions.add(`${e}_${t}`),this.requestUpdate()}async _handleQuickComplete(e,t,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/quick_complete",entry_id:e,task_id:t}),this._showToast(s("quick_complete_success",this._lang))}catch(a){(a?.code||"")==="no_defaults"?this._openCompleteDialog(e,t,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled):this._showToast(s("action_error",this._lang))}}_openCompleteDialog(e,t,i,a,n){let c=this.shadowRoot.querySelector("maintenance-complete-dialog");c&&(c.entryId=e,c.taskId=t,c.taskName=i,c.lang=this._lang,c.checklist=a||[],c.adaptiveEnabled=!!n,c.open())}_openQrForObject(e,t){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForObject(e,t)}_openQrForTask(e,t,i,a){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForTask(e,t,i,a)}render(){return o`
      <div class="panel">
        ${this.narrow||this._view!=="overview"?this._renderHeader():d}
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
        .completionActionsEnabled=${this._features.completion_actions}
        .defaultWarningDays=${this._defaultWarningDays}
        @task-saved=${this._onDialogEvent}
      ></maintenance-task-dialog>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onDialogEvent}
      ></maintenance-complete-dialog>
      <maintenance-history-edit-dialog
        .hass=${this.hass}
        @history-entry-saved=${this._onHistoryEntrySaved}
      ></maintenance-history-edit-dialog>
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
      ${this._toastMessage?o`<div class="toast">${this._toastMessage}</div>`:d}
    `}_renderHeader(){let e=[{label:s("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let i=this._getTask(this._selectedEntryId,this._selectedTaskId);e.push({label:i?.name||"Task"})}return o`
      <div class="header">
        ${this.narrow?o`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:d}
        ${this._view!=="overview"?o`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._showOverview()}}
            ></ha-icon-button>`:d}
        <div class="breadcrumbs">
          ${e.map((t,i)=>o`
              ${i>0?o`<span class="sep">/</span>`:d}
              ${t.action?o`<a @click=${t.action}>${t.label}</a>`:o`<span class="current">${t.label}</span>`}
            `)}
        </div>
      </div>
    `}_renderOverview(){let e=this._lang,t=!!this.hass?.user?.is_admin,i=this._stats;return!t&&this._overviewTab==="settings"&&(this._overviewTab="dashboard"),o`
      ${i?o`
            <div class="stats-bar">
              <div class="stat-item clickable"
                   @click=${()=>this._showAllObjects()}
                   title=${s("show_all_objects",e)}>
                <span class="stat-value">${i.total_objects}</span>
                <span class="stat-label">${s("objects",e)}</span>
              </div>
              <div class="stat-item clickable"
                   @click=${()=>this._filterByStatus("")}
                   title=${s("show_all_tasks",e)}>
                <span class="stat-value">${i.total_tasks}</span>
                <span class="stat-label">${s("tasks",e)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="overdue"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("overdue")}
                   title=${s("filter_to_overdue",e)}>
                <span class="stat-value" style="color: var(--error-color)">${i.overdue}</span>
                <span class="stat-label">${s("overdue",e)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="due_soon"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("due_soon")}
                   title=${s("filter_to_due_soon",e)}>
                <span class="stat-value" style="color: var(--warning-color)">${i.due_soon}</span>
                <span class="stat-label">${s("due_soon",e)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="triggered"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("triggered")}
                   title=${s("filter_to_triggered",e)}>
                <span class="stat-value" style="color: #ff5722">${i.triggered}</span>
                <span class="stat-label">${s("triggered",e)}</span>
              </div>
            </div>
          `:d}
      <div class="tab-bar">
        <div class="tab ${this._overviewTab==="dashboard"?"active":""}"
          @click=${()=>{this._overviewTab="dashboard",this._scrollContentToTop()}}>
          ${s("dashboard",e)}
        </div>
        <div class="tab ${this._overviewTab==="calendar"?"active":""}"
          @click=${()=>{this._overviewTab="calendar",this._scrollContentToTop()}}>
          ${s("tab_calendar",e)}
        </div>
        ${t?o`
          <div class="tab ${this._overviewTab==="settings"?"active":""}"
            @click=${()=>{this._overviewTab="settings",this._scrollContentToTop()}}>
            ${s("settings",e)}
          </div>
        `:d}
      </div>
      ${this._overviewTab==="dashboard"?this._renderDashboard():this._overviewTab==="calendar"?o`
            <div @ll-custom=${this._onCalendarLlCustom}>
              <maintenance-supporter-calendar-card
                .hass=${this.hass}
              ></maintenance-supporter-calendar-card>
            </div>
          `:o`<maintenance-settings-view
            .hass=${this.hass}
            .features=${this._features}
            .budget=${this._budget}
            @settings-changed=${this._onSettingsChanged}
          ></maintenance-settings-view>`}
    `}_renderDashboard(){let e=this._stats,t=this._taskRows,i=this._lang,a=this._isOperator;return o`
      ${this._features.budget?this._renderBudgetBar():d}

      <div class="filter-bar">
        <label class="filter-field">
          <span class="filter-label">${s("filter_label",i)}</span>
          <select
            .value=${this._filterStatus}
            @change=${n=>this._filterStatus=n.target.value}
          >
            <option value="">${s("all",i)}</option>
            <option value="overdue">${s("overdue",i)}</option>
            <option value="due_soon">${s("due_soon",i)}</option>
            <option value="triggered">${s("triggered",i)}</option>
            <option value="ok">${s("ok",i)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${s("user_label",i)}</span>
          <select
            .value=${this._filterUser||""}
            @change=${n=>{let c=n.target.value;this._filterUser=c||null}}
          >
            <option value="">${s("all_users",i)}</option>
            <option value="current_user">${s("my_tasks",i)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${s("sort_label",i)}</span>
          <select
            .value=${this._sortMode}
            @change=${n=>{this._sortMode=n.target.value,localStorage.setItem("maintenance_supporter_sort",this._sortMode)}}
          >
            <option value="due_date" ?selected=${this._sortMode==="due_date"}>${s("sort_due_date",i)}</option>
            <option value="object" ?selected=${this._sortMode==="object"}>${s("sort_object",i)}</option>
            <option value="type" ?selected=${this._sortMode==="type"}>${s("sort_type",i)}</option>
            <option value="task_name" ?selected=${this._sortMode==="task_name"}>${s("sort_task_name",i)}</option>
            <option value="area" ?selected=${this._sortMode==="area"}>${s("sort_area",i)}</option>
            <option value="assigned_user" ?selected=${this._sortMode==="assigned_user"}>${s("sort_assigned_user",i)}</option>
            <option value="group" ?selected=${this._sortMode==="group"}>${s("sort_group",i)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${s("group_by_label",i)}</span>
          <select
            .value=${this._groupByMode}
            @change=${n=>{this._groupByMode=n.target.value,localStorage.setItem("maintenance_supporter_groupby",this._groupByMode)}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${s("groupby_none",i)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${s("groupby_area",i)}</option>
            ${this._features.groups?o`<option value="group" ?selected=${this._groupByMode==="group"}>${s("groupby_group",i)}</option>`:d}
            <option value="user" ?selected=${this._groupByMode==="user"}>${s("groupby_user",i)}</option>
          </select>
        </label>
        ${a?d:o`
          <ha-button
            @click=${()=>this.shadowRoot.querySelector("maintenance-object-dialog")?.openCreate()}
          >
            ${s("new_object",i)}
          </ha-button>
          <ha-button
            @click=${()=>this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate("",this._objects)}
          >
            ${s("new_task",i)}
          </ha-button>
        `}
      </div>

      ${t.length===0?o`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${s("no_tasks",i)}</p>
            </div>
          `:this._groupByMode==="none"?o`
              <div class="task-table">
                ${t.map(n=>this._renderOverviewRow(n))}
              </div>
            `:this._renderGroupedTasks(t,i)}

      ${this._features.groups&&!a?this._renderGroupsSection():d}
    `}_renderGroupedTasks(e,t){let i=new Map,a=s("unassigned",t);for(let u of e){let _=[];this._groupByMode==="area"?_=[(u.area_id?this.hass?.areas?.[u.area_id]?.name:null)||a]:this._groupByMode==="user"?_=[(u.responsible_user_id?this._userService?.getUserName(u.responsible_user_id):null)||a]:this._groupByMode==="group"&&(_=u.group_names.length>0?u.group_names:[a]);for(let m of _)i.has(m)||i.set(m,[]),i.get(m).push(u)}let n=[...i.entries()].sort(([u],[_])=>u===a&&_!==a?1:_===a&&u!==a?-1:u.localeCompare(_)),c=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":"mdi:account-outline";return o`
      ${n.map(([u,_])=>o`
        <details class="group-section" open>
          <summary class="group-section-header">
            <ha-icon icon="${c}"></ha-icon>
            <span>${u}</span>
            <span class="group-section-count">(${_.length})</span>
          </summary>
          <div class="task-table">
            ${_.map(m=>this._renderOverviewRow(m))}
          </div>
        </details>
      `)}
    `}_warrantyLabel(e,t,i){return e.kind==="expired"?s("warranty_expired",i):e.kind==="expiring"?s("warranty_expires_in",i).replace("{days}",String(e.days??0)):s("warranty_valid_until",i).replace("{date}",Q(t,i))}_renderWarrantyMeta(e,t){let i=_t(e);return o`<p class="meta">${s("warranty",t)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,e,t)}</span></p>`}_renderAllObjects(){let e=this._lang,t=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,a=_=>{let m=1/0;for(let g of _.tasks){let v=g.days_until_due;v!=null&&v<m&&(m=v)}return m},n=[...this._objects];this._objectSortMode==="alphabetical"?n.sort((_,m)=>_.object.name.localeCompare(m.object.name)):this._objectSortMode==="task_count"?n.sort((_,m)=>m.tasks.length-_.tasks.length||_.object.name.localeCompare(m.object.name)):n.sort((_,m)=>a(_)-a(m)||_.object.name.localeCompare(m.object.name));let c=()=>{let _=new Map;for(let m of n){let g=m.object.area_id,v=g?this.hass?.areas?.[g]?.name||s("unassigned",e):s("no_area",e);_.has(v)||_.set(v,[]),_.get(v).push(m)}return new Map([..._.entries()].sort(([m],[g])=>m.localeCompare(g)))},u=_=>{let m=_.tasks.some(g=>g.status==="overdue"||g.status==="triggered");return o`
        <div class="object-card${m?" object-card-overdue":""}" @click=${()=>this._showObject(_.entry_id)}>
          ${m?o`<span class="overdue-dot" title="${s("has_overdue",e)}"></span>`:d}
          <div class="object-card-header">
            <span class="object-card-name">${_.object.name}</span>
            <span class="object-card-count">${_.tasks.length} ${s("tasks_lower",e)}</span>
          </div>
          ${_.object.manufacturer||_.object.model?o`<div class="object-card-meta">${[_.object.manufacturer,_.object.model].filter(Boolean).join(" ")}</div>`:d}
          ${_.tasks.length===0?o`<div class="object-card-empty">${s("no_tasks_yet",e)}</div>`:d}
        </div>
      `};return o`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showOverview()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${s("all_objects",e)}</span>
      </div>
      <div class="filter-bar">
        <label class="filter-field">
          <span class="filter-label">${s("sort_label",e)}</span>
          <select
            .value=${this._objectSortMode}
            @change=${_=>{this._objectSortMode=_.target.value,localStorage.setItem("maintenance_supporter_object_sort",this._objectSortMode)}}
          >
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${s("sort_alphabetical",e)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${s("sort_due_soonest",e)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${s("sort_task_count",e)}</option>
          </select>
        </label>
        ${this.narrow?d:o`
          <div class="view-toggle" role="group" aria-label="${s("view_mode_label",e)}">
            <button
              class="view-toggle-btn${i?"":" active"}"
              title="${s("view_cards",e)}"
              @click=${()=>this._setObjectViewMode("cards")}
            ><ha-icon icon="mdi:view-grid-outline"></ha-icon></button>
            <button
              class="view-toggle-btn${i?" active":""}"
              title="${s("view_table",e)}"
              @click=${()=>this._setObjectViewMode("table")}
            ><ha-icon icon="mdi:table"></ha-icon></button>
          </div>
        `}
        ${i?d:o`
        <label class="filter-field">
          <span class="filter-label">${s("group_by_label",e)}</span>
          <select
            .value=${this._groupByMode}
            @change=${_=>{this._groupByMode=_.target.value,localStorage.setItem("maintenance_supporter_groupby",this._groupByMode)}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${s("groupby_none",e)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${s("groupby_area",e)}</option>
          </select>
        </label>
        `}
        ${t?d:o`
          <ha-button
            @click=${()=>this.shadowRoot.querySelector("maintenance-object-dialog")?.openCreate()}
          >
            ${s("new_object",e)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${s("settings_export_csv",e)}
        </ha-button>
      </div>
      ${i?this._renderObjectsTable(n):this._groupByMode==="area"?o`
          ${[...c().entries()].map(([_,m])=>o`
            <details class="group-section" open>
              <summary class="group-section-header">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${_}</span>
                <span class="group-section-count">(${m.length})</span>
              </summary>
              <div class="objects-grid">${m.map(u)}</div>
            </details>
          `)}
        `:o`<div class="objects-grid">${n.map(u)}</div>`}
    `}_setObjectViewMode(e){this._objectViewMode=e,localStorage.setItem("maintenance_supporter_object_view",e)}async _exportObjectsCsv(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects/csv"}),t=new Date().toISOString().slice(0,10);Oe(e.csv,`maintenance_objects_${t}.csv`,"text/csv;charset=utf-8")}catch{this._showToast(s("action_error",this._lang))}}_renderObjectsTable(e){let t=this._lang,i=this._objectsTableColumns;return o`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${i.map(a=>{let n=_e.find(u=>u.key===a),c=n&&n.key!=="actions"?s(n.labelKey,t):"";return o`<th class="oc-${a}">${c}</th>`})}
            </tr>
          </thead>
          <tbody>
            ${e.map(a=>o`
              <tr class="objects-table-row" @click=${()=>this._showObject(a.entry_id)}>
                ${i.map(n=>this._renderObjectCell(n,a,t))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `}_renderObjectCell(e,t,i){let a=t.object;switch(e){case"name":return o`<td class="oc-name"><span class="objects-table-name">${a.name}</span></td>`;case"manufacturer":return o`<td class="oc-manufacturer">${a.manufacturer||"\u2014"}</td>`;case"model":return o`<td class="oc-model">${a.model||"\u2014"}</td>`;case"serial_number":return o`<td class="oc-serial_number">${a.serial_number||"\u2014"}</td>`;case"installation_date":return o`<td class="oc-installation_date">${a.installation_date?Q(a.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return o`<td class="oc-warranty_expiry">${this._renderWarrantyCell(a.warranty_expiry,i)}</td>`;case"area_id":{let n=a.area_id?this.hass?.areas?.[a.area_id]?.name||a.area_id:"\u2014";return o`<td class="oc-area_id">${n}</td>`}case"documentation_url":return o`<td class="oc-documentation_url">${a.documentation_url&&/^https?:\/\//i.test(a.documentation_url)?o`<a href=${a.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${n=>n.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`;case"notes":return o`<td class="oc-notes" title=${a.notes||""}>${a.notes||"\u2014"}</td>`;case"task_count":return o`<td class="oc-task_count">${t.tasks.length}</td>`;case"actions":return o`<td class="oc-actions">
          <mwc-icon-button title="${s("qr_code",i)}" @click=${n=>{n.stopPropagation(),this._openQrForObject(t.entry_id,a.name)}}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </mwc-icon-button>
        </td>`;default:return o`<td></td>`}}_renderWarrantyCell(e,t){let i=_t(e);return i.kind==="none"?o`<span class="warranty-none">—</span>`:o`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,e,t)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return d;let e=Object.entries(this._groups),t=this._lang;return o`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${s("groups",t)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${s("new_group",t)}
          </ha-button>
        </div>
        ${e.length===0?o`<div class="hint">${s("no_groups",t)}</div>`:o`
            <div class="groups-grid">
              ${e.map(([i,a])=>{let n=a.task_refs.map(c=>this._getTask(c.entry_id,c.task_id)?.name).filter(Boolean);return o`
                  <div class="group-card">
                    <div class="group-card-head">
                      <div class="group-card-name">${a.name}</div>
                      <div class="group-card-actions">
                        <mwc-icon-button title="${s("edit",t)}" @click=${()=>this._openGroupEdit(i)}>
                          <ha-svg-icon path="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"></ha-svg-icon>
                        </mwc-icon-button>
                        <mwc-icon-button title="${s("delete",t)}" @click=${()=>this._deleteGroup(i,a.name)}>
                          <ha-svg-icon path="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"></ha-svg-icon>
                        </mwc-icon-button>
                      </div>
                    </div>
                    ${a.description?o`<div class="group-card-desc">${a.description}</div>`:d}
                    <div class="group-card-tasks">
                      ${n.length>0?n.map(c=>o`<span class="group-task-chip">${c}</span>`):o`<span style="font-size:12px;color:var(--secondary-text-color)">${s("no_tasks_short",t)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(e){let t=this._groups[e];t&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(e,t)}async _deleteGroup(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(i?await i.confirm({title:s("delete_group",this._lang),message:s("delete_group_confirm",this._lang).replace("{name}",t),confirmText:s("delete",this._lang)}):confirm(`${s("delete_group_confirm",this._lang).replace("{name}",t)}`))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/delete",group_id:e}),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}_renderBudgetBar(){let e=this._budget;if(!e)return d;let t=this._lang,i=e.currency_symbol||"\u20AC",a=[];return e.monthly_budget>0&&a.push({label:s("budget_monthly",t),spent:e.monthly_spent,budget:e.monthly_budget}),e.yearly_budget>0&&a.push({label:s("budget_yearly",t),spent:e.yearly_spent,budget:e.yearly_budget}),a.length===0?d:o`
      <div class="budget-bars">
        ${a.map(n=>{let c=Math.min(100,Math.max(0,n.spent/n.budget*100)),u=c>=100?"var(--error-color, #f44336)":c>=e.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return o`
            <div class="budget-item">
              <div class="budget-label">
                <span>${n.label}</span>
                <span>${n.spent.toFixed(2)} / ${n.budget.toFixed(2)} ${i}</span>
              </div>
              <div class="budget-bar">
                <div class="budget-bar-fill" style="width:${c}%; background:${u}"></div>
              </div>
            </div>
          `})}
      </div>
    `}_renderOverviewRow(e){let t=this._lang,i=e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0,a=0,n=qe.ok,c=!1;if(i&&e.days_until_due!==null){let g=ut(e.interval_days,e.days_until_due,e.interval_unit);a=g.pct,c=g.overflow,e.status==="overdue"?n=qe.overdue:e.status==="due_soon"&&(n=qe.due_soon)}let u=e.area_id?this.hass?.areas?.[e.area_id]?.name:null,_=e.responsible_user_id?this._userService?.getUserName(e.responsible_user_id):null,m=e.group_names.length>0||u||_;return o`
      <div class="task-row${e.enabled?"":" task-disabled"}">
        <span class="cell-badges">
          <span class="status-badge ${e.is_done?"done":e.status}">${e.is_done?s("completed",t):s(e.status,t)}</span>
          ${e.enabled?d:o`<span class="badge-disabled">${s("disabled",t)}</span>`}
          ${e.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_linked",t)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:d}
        </span>
        <span class="cell object-name" @click=${g=>{g.stopPropagation(),this._showObject(e.entry_id)}}>${e.object_name}</span>
        <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,e.task_id)}>${e.task_name}</span>
        <span class="task-sub${m?"":" task-sub-empty"}">
          ${e.group_names.length>0?o`
            <span class="sub-chip" title="${s("groups",t)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${e.group_names.join(", ")}
            </span>`:d}
          ${u?o`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${u}
            </span>`:d}
          ${_?o`
            <span class="sub-chip" title="${s("responsible_user",t)}">
              <ha-icon icon="mdi:account-outline"></ha-icon>${_}
            </span>`:d}
        </span>
        <span class="cell type">${s(e.type,t)}</span>
        <span class="due-cell" @click=${()=>this._showTask(e.entry_id,e.task_id)}>
          <span class="due-text">${ze(e.days_until_due,t)}</span>
          ${i?o`<div class="days-bar"><div class="days-bar-fill${c?" overflow":""}" style="width:${a}%;background:${n}"></div></div>`:d}
          ${e.trigger_config?this._renderTriggerProgress(e):!i&&e.trigger_active?o`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:d}
          ${this._renderMiniSparkline(e)}
        </span>
        <span class="row-actions">
          <mwc-icon-button class="btn-complete" title="${s("complete",t)}" @click=${g=>{g.stopPropagation(),this._openCompleteDialogForRow(e)}}>
            <ha-icon icon="mdi:check"></ha-icon>
          </mwc-icon-button>
          <mwc-icon-button class="btn-skip" title="${s("skip",t)}" .disabled=${this._actionLoading} @click=${g=>{g.stopPropagation(),this._promptSkipTask(e.entry_id,e.task_id)}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>
        </span>
      </div>
    `}_openCompleteDialogForRow(e){let i=this._objects.find(a=>a.entry_id===e.entry_id)?.tasks.find(a=>a.id===e.task_id);this._openCompleteDialog(e.entry_id,e.task_id,e.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderTriggerProgress(e){let t=e.trigger_config??null;if(!t)return d;let i=t.type||"threshold",a=e.trigger_entity_info?.unit_of_measurement??"",n=0,c="";if(i==="threshold"){let m=e.trigger_current_value??null;if(m==null)return d;let g=t.trigger_above,v=t.trigger_below;if(g!=null){let f=v??0,x=g-f||1;n=Math.min(100,Math.max(0,(m-f)/x*100)),c=`${m.toFixed(1)} / ${g} ${a}`}else if(v!=null){let x=e.trigger_entity_info?.max??(v*2||100),b=x-v||1;n=Math.min(100,Math.max(0,(x-m)/b*100)),c=`${m.toFixed(1)} / ${v} ${a}`}else return d}else if(i==="counter"){let m=t.trigger_target_value||1,v=e.trigger_current_delta??null??e.trigger_current_value??null;if(v==null)return d;n=Math.min(100,Math.max(0,v/m*100)),c=`${v.toFixed(1)} / ${m} ${a}`}else if(i==="state_change"){let m=t.trigger_target_changes||1,g=e.trigger_current_value??null;if(g==null)return d;n=Math.min(100,Math.max(0,g/m*100)),c=`${Math.round(g)} / ${m}`}else if(i==="runtime"){let m=t.trigger_runtime_hours||100,g=e.trigger_current_value??null;if(g==null)return d;n=Math.min(100,Math.max(0,g/m*100)),c=`${g.toFixed(1)}h / ${m}h`}else if(i==="compound"){let m=t.compound_logic||t.operator||"AND",g=t.conditions?.length||0;c=`${m} (${g})`,n=e.trigger_active?100:0}else return d;let u=n>=100,_=n>90?"var(--error-color, #f44336)":n>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return o`
      <div class="trigger-progress">
        <div class="trigger-progress-bar">
          <div class="trigger-progress-fill${u?" overflow":""}" style="width:${n}%;background:${_}"></div>
        </div>
        <span class="trigger-progress-label">${c}</span>
      </div>
    `}_renderMiniSparkline(e){if(!e.trigger_config?.entity_id)return d;let t=e.trigger_config.entity_id,i=this._miniStatsData.get(t)||[],a=[];if(i.length>=2)a=i.map(k=>({ts:k.ts,val:k.val}));else{if(!e.history)return d;for(let k of e.history)k.trigger_value!=null&&a.push({ts:new Date(k.timestamp).getTime(),val:k.trigger_value})}if(e.trigger_current_value!=null&&a.push({ts:Date.now(),val:e.trigger_current_value}),a.length<2)return d;a.sort((k,R)=>k.ts-R.ts);let n=hs,c=gs,u=a.map(k=>k.val),_=Math.min(...u),m=Math.max(...u),g=m-_||1;_-=g*.1,m+=g*.1;let v=a[0].ts,x=a[a.length-1].ts-v||1,b=k=>(k-v)/x*n,L=k=>2+(1-(k-_)/(m-_))*(c-4),I=a;if(I.length>ni){let k=Math.ceil(I.length/ni);I=I.filter((R,F)=>F%k===0||F===I.length-1)}let S=I.map(k=>`${b(k.ts).toFixed(1)},${L(k.val).toFixed(1)}`).join(" ");return o`
      <svg class="mini-sparkline" viewBox="0 0 ${n} ${c}" preserveAspectRatio="none" role="img" aria-label="${s("chart_mini_sparkline",this._lang)}">
        <polyline points="${S}" fill="none" stroke="var(--primary-color)" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
    `}_renderDaysProgress(e){let t=this._lang;if(e.days_until_due==null||!e.interval_days||e.interval_days<=0)return d;let{pct:i,overflow:a}=ut(e.interval_days,e.days_until_due,e.interval_unit),n="var(--success-color, #4caf50)";return e.status==="overdue"?n="var(--error-color, #f44336)":e.status==="due_soon"&&(n="var(--warning-color, #ff9800)"),o`
      <div class="days-progress">
        <div class="days-progress-labels">
          <span>${e.last_performed?`${s("last_performed",t)}: ${Q(e.last_performed,t)}`:""}</span>
          <span>${e.next_due?`${s("next_due",t)}: ${Q(e.next_due,t)}`:""}</span>
        </div>
        <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(i)}" aria-valuemin="0" aria-valuemax="100" aria-label="${s("days_progress",t)}">
          <div class="days-progress-fill${a?" overflow":""}" style="width:${i}%;background:${n}"></div>
        </div>
        <div class="days-progress-text">${ze(e.days_until_due,t)}</div>
      </div>
    `}_renderObjectDetail(){if(!this._selectedEntryId)return d;let e=this._getObject(this._selectedEntryId);if(!e)return o`<p>Object not found.</p>`;let t=e.object,i=this._lang,a=this._isOperator;return o`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${t.name}</h2>
          <div class="action-buttons">
            ${a?d:o`
              <ha-button appearance="plain" @click=${()=>{this.shadowRoot.querySelector("maintenance-object-dialog")?.openEdit(e.entry_id,t)}}>${s("edit",i)}</ha-button>
              <ha-button appearance="filled" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate(e.entry_id)}}>${s("add_task",i)}</ha-button>
              <ha-button variant="danger" appearance="plain" @click=${()=>this._deleteObject(e.entry_id)}>${s("delete",i)}</ha-button>
            `}
            <ha-button appearance="plain" @click=${()=>this._openQrForObject(e.entry_id,t.name)}><ha-icon icon="mdi:qrcode"></ha-icon> ${s("qr_code",i)}</ha-button>
          </div>
        </div>
        ${t.manufacturer||t.model?o`<p class="meta">${[t.manufacturer,t.model].filter(Boolean).join(" ")}</p>`:d}
        ${t.serial_number?o`<p class="meta">${s("serial_number_label",i)}: ${t.serial_number}</p>`:d}
        ${t.documentation_url&&/^https?:\/\//i.test(t.documentation_url)?o`<p class="meta">${s("documentation_url_label",i)}:
              <a href=${t.documentation_url} target="_blank" rel="noopener noreferrer">${t.documentation_url}</a>
            </p>`:d}
        ${t.installation_date?o`<p class="meta">${s("installed",i)}: ${Q(t.installation_date,i)}</p>`:d}
        ${t.warranty_expiry?this._renderWarrantyMeta(t.warranty_expiry,i):d}
        ${t.notes?o`<div class="object-notes">
              <div class="object-notes-label">${s("object_notes_label",i)}</div>
              <div class="object-notes-body">${t.notes}</div>
            </div>`:d}

        <h3>${s("tasks",i)} (${e.tasks.length})</h3>
        ${e.tasks.length===0?o`<div class="empty-state-centered">
              <p class="empty">${s("no_tasks_yet",i)}</p>
              <ha-button appearance="filled" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate(e.entry_id)}}>${s("add_first_task",i)}</ha-button>
            </div>`:o`<div class="task-table">${[...e.tasks].sort((n,c)=>{let u={overdue:0,triggered:1,due_soon:2,ok:3};return(u[n.status]??9)-(u[c.status]??9)||(n.days_until_due??99999)-(c.days_until_due??99999)}).map(n=>o`
              <div class="task-row${n.enabled?"":" task-disabled"}">
                <span class="cell-badges">
                  <span class="status-badge ${n.is_done?"done":n.status}">${n.is_done?s("completed",i):s(n.status,i)}</span>
                  ${n.enabled?d:o`<span class="badge-disabled">${s("disabled",i)}</span>`}
                  ${n.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:d}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,n.id)}>${n.name}</span>
                ${this._renderUserBadge(n)}
                <span class="cell type">${s(n.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(e.entry_id,n.id)}>
                  <span class="due-text">${ze(n.days_until_due,i)}</span>
                  ${n.trigger_config?this._renderTriggerProgress(n):d}
                  ${this._renderMiniSparkline(n)}
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${s("complete",i)}" @click=${c=>{c.stopPropagation(),this._openCompleteDialog(e.entry_id,n.id,n.name,this._features.checklists?n.checklist:void 0,this._features.adaptive&&!!n.adaptive_config?.enabled)}}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${s("skip",i)}" .disabled=${this._actionLoading} @click=${c=>{c.stopPropagation(),this._promptSkipTask(e.entry_id,n.id)}}>
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </mwc-icon-button>
                </span>
              </div>
            `)}</div>`}
      </div>
    `}_renderTaskHeader(e){let t=this._lang,a=this._getObject(this._selectedEntryId)?.object.name||"",n=this._isOperator,c=e.is_done?"done":e.status==="due_soon"?"warning":e.status||"ok",u=e.is_done?s("completed",t):s(e.status||"ok",t);return o`
      <div class="task-header">
        <div class="task-header-title">
          <span class="task-name-breadcrumb" @click=${()=>this._view="task"}>${e.name}</span>
          <span class="breadcrumb-separator">·</span>
          <span class="object-name-breadcrumb" @click=${()=>this._showObject(this._selectedEntryId)}>${a}</span>
          <span class="status-chip ${c}">${u}</span>
          ${this._renderUserBadge(e)}
          ${e.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_tag_id",t)}: ${e.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:n?d:o`<span class="nfc-badge unlinked" title="${s("nfc_link_hint",t)}"
                @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,e)}}>
                <ha-icon icon="mdi:nfc-variant"></ha-icon>
              </span>`}
        </div>
        <div class="task-header-actions">
          <ha-button appearance="filled" @click=${()=>this._openCompleteDialog(this._selectedEntryId,this._selectedTaskId,e.name,this._features.checklists?e.checklist:void 0,this._features.adaptive&&!!e.adaptive_config?.enabled)}>${s("complete",t)}</ha-button>
          <ha-button appearance="plain" .disabled=${this._actionLoading} @click=${()=>this._promptSkipTask(this._selectedEntryId,this._selectedTaskId)}>${s("skip",t)}</ha-button>
          <ha-button appearance="plain" @click=${()=>{let _=this._getObject(this._selectedEntryId)?.object;this._openQrForTask(this._selectedEntryId,this._selectedTaskId,_?.name||"",e.name)}}><ha-icon icon="mdi:qrcode"></ha-icon> ${s("qr_code",t)}</ha-button>
          ${n?d:o`
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${this._toggleMoreMenu}></ha-icon-button>
              ${this._moreMenuOpen?o`
                <div class="popup-menu" @click=${_=>_.stopPropagation()}>
                  <div class="popup-menu-item" @click=${()=>{this._closeMoreMenu(),this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,e)}}>${s("edit",t)}</div>
                  <div class="popup-menu-item" @click=${()=>{this._closeMoreMenu(),this._promptResetTask(this._selectedEntryId,this._selectedTaskId)}}>${s("reset",t)}</div>
                  <div class="popup-menu-divider"></div>
                  <div class="popup-menu-item danger" @click=${()=>{this._closeMoreMenu(),this._deleteTask(this._selectedEntryId,this._selectedTaskId)}}>${s("delete",t)}</div>
                </div>
              `:d}
            </div>
          `}
        </div>
      </div>
    `}_toggleMoreMenu(){if(this._moreMenuOpen=!this._moreMenuOpen,this._moreMenuOpen){let e=()=>{this._moreMenuOpen=!1,document.removeEventListener("click",e)};setTimeout(()=>document.addEventListener("click",e,{once:!0}),0)}}_closeMoreMenu(){this._moreMenuOpen=!1}_renderUserBadge(e){if(!e.responsible_user_id||!this._userService)return d;let t=this._userService.getUserName(e.responsible_user_id);return t?o`
      <span class="user-badge">
        <ha-icon icon="mdi:account"></ha-icon>
        ${t}
      </span>
    `:d}_renderTabBar(){let e=this._lang;return o`
      <div class="tab-bar">
        <div class="tab ${this._activeTab==="overview"?"active":""}" @click=${()=>this._activeTab="overview"}>
          ${s("overview",e)}
        </div>
        <div class="tab ${this._activeTab==="history"?"active":""}" @click=${()=>this._activeTab="history"}>
          ${s("history",e)}
        </div>
      </div>
    `}_renderTabContent(e){switch(this._activeTab){case"overview":return this._renderOverviewTab(e);case"history":return this._renderHistoryTab(e);default:return d}}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,isCounterEntity:e=>this._isCounterEntity(e),tooltip:this._sparklineTooltip,setTooltip:e=>{this._sparklineTooltip=e}}}_renderOverviewTab(e){let t=this._lang,i=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,a=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1,n=i||a,c=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,u=this._features.seasonal&&(e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12);return o`
      <div class="tab-content overview-tab">
        ${this._renderKPIBar(e)}
        ${this._renderTaskMeta(e)}
        ${this._renderDaysProgress(e)}
        ${Zt(e,this._sparklineCtx)}
        ${Xt(e,t,this._features)}
        <div class="two-column-layout ${n?"":"single-column"}">
          ${n?o`
            <div class="left-column">
              ${this._renderRecommendationCard(e)}
              ${si(e,t,this._features)}
            </div>
          `:d}
          <div class="right-column">
            ${ri(e,t,this._costDurationToggle,_=>{this._costDurationToggle=_})}
          </div>
        </div>
        ${c?ei(e,t):d}
        ${u?o`
          ${ai(e,t)}
          <div class="seasonal-actions">
            <ha-button appearance="plain" @click=${()=>this._openSeasonalOverrides(e)}>
              ${s("edit_seasonal_overrides",t)}
            </ha-button>
          </div>
        `:d}
        ${this._renderChecklistCard(e)}
        ${this._renderRecentActivities(e)}
      </div>
    `}_renderChecklistCard(e){if(!this._features.checklists)return d;let t=e.checklist||[];if(t.length===0)return d;let i=this._lang;return o`
      <div class="checklist-preview-card">
        <div class="checklist-preview-header">
          <ha-icon icon="mdi:format-list-checks"></ha-icon>
          <span>${s("checklist",i)} (${t.length})</span>
        </div>
        <ol class="checklist-preview-list">
          ${t.map(a=>o`<li>${a}</li>`)}
        </ol>
      </div>
    `}_renderHistoryTab(e){let t=this._lang;return o`
      <div class="tab-content history-tab">
        ${this._renderHistoryFilters(e)}
        ${this._renderHistoryList(e)}
      </div>
    `}_renderTaskMeta(e){let t=e.documentation_url&&/^https?:\/\//i.test(e.documentation_url)?e.documentation_url:null,i=this._selectedEntryId?this._getObject(this._selectedEntryId):void 0,a=i?.object?.documentation_url,n=a&&/^https?:\/\//i.test(a)?a:null;if(!e.notes&&!t&&!n)return d;let c=this._lang;return o`
      <div class="task-meta-card">
        ${e.notes?o`
          <div class="task-meta-row">
            <ha-icon icon="mdi:note-text-outline"></ha-icon>
            <span class="task-meta-notes">${e.notes}</span>
          </div>
        `:d}
        ${t?o`
          <div class="task-meta-row task-meta-link">
            <ha-icon icon="mdi:open-in-new"></ha-icon>
            <a href="${t}" target="_blank" rel="noopener noreferrer">${s("documentation_label",c)}</a>
          </div>
        `:d}
        ${n?o`
          <div class="task-meta-row task-meta-link">
            <ha-icon icon="mdi:book-open-variant"></ha-icon>
            <a href="${n}" target="_blank" rel="noopener noreferrer">${s("documentation_url_label",c)} (${i?.object?.name||""})</a>
          </div>
        `:d}
      </div>
    `}_renderKPIBar(e){let t=this._lang,i=e.times_performed>0?e.total_cost/e.times_performed:0,a=e.days_until_due!==null&&e.days_until_due!==void 0?e.days_until_due<0?"overdue":e.days_until_due<=e.warning_days?"warning":"":"";return o`
      <div class="kpi-bar">
        <div class="kpi-card">
          <div class="kpi-label">${s("next_due",t)}</div>
          <div class="kpi-value">${e.next_due?Q(e.next_due,t):"\u2014"}</div>
          ${this._features.schedule_time&&e.schedule_time?o`<div class="kpi-subtext">${s("at_time",t)} ${e.schedule_time}</div>`:d}
        </div>
        <div class="kpi-card ${a}">
          <div class="kpi-label">${s("days_until_due",t)}</div>
          <div class="kpi-value-large">${e.days_until_due!==null&&e.days_until_due!==void 0?e.days_until_due:"\u2014"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("interval",t)}</div>
          <div class="kpi-value">${Dt(e,t)}</div>
          ${this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days?o`
            <div class="kpi-subtext">${s("recommended",t)}: ${e.suggested_interval}${e.interval_analysis?.confidence_interval_low!=null?` (${e.interval_analysis.confidence_interval_low}\u2013${e.interval_analysis.confidence_interval_high})`:""}</div>
          `:d}
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
    `}_renderRecommendationCard(e){let t=this._lang;if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return d;if(this._selectedEntryId&&this._selectedTaskId&&this._dismissedSuggestions.has(`${this._selectedEntryId}_${this._selectedTaskId}`))return d;let i=e.suggested_interval;return o`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",t)}</h4>
        ${ti(e.interval_days,i,e.interval_confidence||"medium",t)}
        <div class="recommendation-actions">
          <ha-button appearance="filled"
            @click=${()=>this._applySuggestion(this._selectedEntryId,this._selectedTaskId,i)}>
            ${s("apply_suggestion",t)}
          </ha-button>
          <ha-button appearance="plain"
            @click=${()=>this._reanalyzeInterval(this._selectedEntryId,this._selectedTaskId)}>
            ${s("reanalyze",t)}
          </ha-button>
          <ha-button appearance="plain"
            @click=${()=>this._dismissSuggestion(this._selectedEntryId,this._selectedTaskId)}>
            ${s("dismiss_suggestion",t)}
          </ha-button>
        </div>
      </div>
    `}_renderRecentActivities(e){let t=this._lang,i=e.history.slice(-3).reverse();if(i.length===0)return d;let a=n=>{switch(n){case"completed":return"\u2713";case"triggered":return"\u2297";case"skipped":return"\u21B7";case"reset":return"\u21BA";default:return"\xB7"}};return o`
      <div class="recent-activities">
        <h3>${s("recent_activities",t)}</h3>
        ${i.map(n=>o`
          <div class="activity-item">
            <span class="activity-icon">${a(n.type)}</span>
            <span class="activity-date">${dt(n.timestamp,t)}</span>
            <span class="activity-note">${n.notes||"\u2014"}</span>
            ${n.cost?o`<span class="activity-badge">${n.cost.toFixed(0)}${this._budget?.currency_symbol||"\u20AC"}</span>`:d}
            ${n.duration?o`<span class="activity-badge">${n.duration}min</span>`:d}
          </div>
        `)}
        <div class="activity-show-all">
          <ha-button appearance="plain" @click=${()=>this._activeTab="history"}>${s("show_all",t)} →</ha-button>
        </div>
      </div>
    `}_renderHistoryFilters(e){let t=this._lang;return o`
      <div class="history-filters-new">
        <div class="filter-chips">
          ${["completed","skipped","reset","triggered"].map(i=>{let a=e.history.filter(n=>n.type===i).length;return a===0?d:o`
              <span class="filter-chip ${this._historyFilter===i?"active":""}"
                @click=${()=>{this._historyFilter=this._historyFilter===i?null:i}}>
                ${s(i,t)} (${a})
              </span>
            `})}
          ${this._historyFilter?o`<span class="filter-chip clear" @click=${()=>{this._historyFilter=null}}>${s("show_all",t)}</span>`:d}
        </div>
        <div class="filter-controls">
          <input type="text" class="search-input" placeholder="${s("search_notes",t)}..." .value=${this._historySearch} @input=${i=>this._historySearch=i.target.value} />
        </div>
      </div>
    `}_renderHistoryList(e){let t=this._lang,i=this._historyFilter?e.history.filter(a=>a.type===this._historyFilter):e.history;if(this._historySearch){let a=this._historySearch.toLowerCase();i=i.filter(n=>n.notes?.toLowerCase().includes(a))}return i.length===0?o`<p class="empty">${s("no_history",t)}</p>`:o`
      <div class="history-timeline">
        ${[...i].reverse().map(a=>this._renderHistoryEntry(a))}
      </div>
    `}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return d;let e=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!e)return o`<p>Task not found.</p>`;let t=this._lang;return o`
      <div class="detail-section">
        ${this._renderTaskHeader(e)}
        ${this._renderTabBar()}
        ${this._renderTabContent(e)}
      </div>
    `}_renderHistoryEntry(e){let t=this._lang,i=["completed","reset","skipped"].includes(e.type);return o`
      <div class="history-entry">
        <div class="history-icon ${e.type}">
          <ha-icon .icon=${Pt[e.type]||"mdi:circle"}></ha-icon>
        </div>
        <div class="history-content">
          <div class="history-row">
            <strong>${s(e.type,t)}</strong>
            ${i?o`<button class="history-edit-btn"
                       title=${s("history_edit_button",t)||"Edit entry"}
                       @click=${()=>this._openHistoryEdit(e)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>`:d}
          </div>
          <div class="history-date">${dt(e.timestamp,t)}</div>
          ${e.notes?o`<div>${e.notes}</div>`:d}
          <div class="history-details">
            ${e.cost!=null?o`<span>${s("cost",t)}: ${e.cost.toFixed(2)} ${this._budget?.currency_symbol||"\u20AC"}</span>`:d}
            ${e.duration!=null?o`<span>${s("duration",t)}: ${e.duration} min</span>`:d}
            ${e.trigger_value!=null?o`<span>${s("trigger_val",t)}: ${e.trigger_value}</span>`:d}
          </div>
        </div>
      </div>
    `}_openHistoryEdit(e){if(!this._selectedEntryId||!this._selectedTaskId)return;let t={entry_id:this._selectedEntryId,task_id:this._selectedTaskId,original_timestamp:e.timestamp,type:e.type,timestamp:e.timestamp,notes:e.notes??null,cost:e.cost??null,duration:e.duration??null,completed_by:e.completed_by??null};this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(t)}};T.styles=[De,Ft],p([w({attribute:!1})],T.prototype,"hass",2),p([w({type:Boolean,reflect:!0})],T.prototype,"narrow",2),p([w({attribute:!1})],T.prototype,"panel",2),p([h()],T.prototype,"_objects",2),p([h()],T.prototype,"_stats",2),p([h()],T.prototype,"_view",2),p([h()],T.prototype,"_selectedEntryId",2),p([h()],T.prototype,"_selectedTaskId",2),p([h()],T.prototype,"_filterStatus",2),p([h()],T.prototype,"_filterUser",2),p([h()],T.prototype,"_unsub",2),p([h()],T.prototype,"_sparklineTooltip",2),p([h()],T.prototype,"_historyFilter",2),p([h()],T.prototype,"_budget",2),p([h()],T.prototype,"_groups",2),p([h()],T.prototype,"_detailStatsData",2),p([h()],T.prototype,"_miniStatsData",2),p([h()],T.prototype,"_features",2),p([h()],T.prototype,"_adminPanelUserIds",2),p([h()],T.prototype,"_operatorWriteEnabled",2),p([h()],T.prototype,"_defaultWarningDays",2),p([h()],T.prototype,"_actionLoading",2),p([h()],T.prototype,"_moreMenuOpen",2),p([h()],T.prototype,"_toastMessage",2),p([h()],T.prototype,"_overviewTab",2),p([h()],T.prototype,"_activeTab",2),p([h()],T.prototype,"_costDurationToggle",2),p([h()],T.prototype,"_historySearch",2),p([h()],T.prototype,"_sortMode",2),p([h()],T.prototype,"_objectSortMode",2),p([h()],T.prototype,"_groupByMode",2),p([h()],T.prototype,"_objectViewMode",2),p([h()],T.prototype,"_objectsTableColumns",2),T=p([Lt("maintenance-supporter-panel")],T);export{T as MaintenanceSupporterPanel};
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
