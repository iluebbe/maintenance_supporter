var Ci=Object.defineProperty;var Ii=Object.getOwnPropertyDescriptor;var u=(n,r,e,t)=>{for(var i=t>1?void 0:t?Ii(r,e):r,a=n.length-1,l;a>=0;a--)(l=n[a])&&(i=(t?l(r,e,i):l(i))||i);return t&&i&&Ci(r,e,i),i};var Ue=globalThis,Be=Ue.ShadowRoot&&(Ue.ShadyCSS===void 0||Ue.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ht=Symbol(),Rt=new WeakMap,Ae=class{constructor(r,e,t){if(this._$cssResult$=!0,t!==ht)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=e}get styleSheet(){let r=this.o,e=this.t;if(Be&&r===void 0){let t=e!==void 0&&e.length===1;t&&(r=Rt.get(e)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),t&&Rt.set(e,r))}return r}toString(){return this.cssText}},Pt=n=>new Ae(typeof n=="string"?n:n+"",void 0,ht),A=(n,...r)=>{let e=n.length===1?n[0]:r.reduce((t,i,a)=>t+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[a+1],n[0]);return new Ae(e,n,ht)},Lt=(n,r)=>{if(Be)n.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of r){let t=document.createElement("style"),i=Ue.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,n.appendChild(t)}},_t=Be?n=>n:n=>n instanceof CSSStyleSheet?(r=>{let e="";for(let t of r.cssRules)e+=t.cssText;return Pt(e)})(n):n;var{is:Mi,defineProperty:Ri,getOwnPropertyDescriptor:Pi,getOwnPropertyNames:Li,getOwnPropertySymbols:Hi,getPrototypeOf:zi}=Object,Ve=globalThis,Ht=Ve.trustedTypes,Di=Ht?Ht.emptyScript:"",qi=Ve.reactiveElementPolyfillSupport,je=(n,r)=>n,Ce={toAttribute(n,r){switch(r){case Boolean:n=n?Di:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,r){let e=n;switch(r){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},We=(n,r)=>!Mi(n,r),zt={attribute:!0,type:String,converter:Ce,reflect:!1,useDefault:!1,hasChanged:We};Symbol.metadata??=Symbol("metadata"),Ve.litPropertyMetadata??=new WeakMap;var ne=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,e=zt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(r,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(r,t,e);i!==void 0&&Ri(this.prototype,r,i)}}static getPropertyDescriptor(r,e,t){let{get:i,set:a}=Pi(this.prototype,r)??{get(){return this[e]},set(l){this[e]=l}};return{get:i,set(l){let c=i?.call(this);a?.call(this,l),this.requestUpdate(r,c,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??zt}static _$Ei(){if(this.hasOwnProperty(je("elementProperties")))return;let r=zi(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(je("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(je("properties"))){let e=this.properties,t=[...Li(e),...Hi(e)];for(let i of t)this.createProperty(i,e[i])}let r=this[Symbol.metadata];if(r!==null){let e=litPropertyMetadata.get(r);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let e=[];if(Array.isArray(r)){let t=new Set(r.flat(1/0).reverse());for(let i of t)e.unshift(_t(i))}else r!==void 0&&e.push(_t(r));return e}static _$Eu(r,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(r.set(t,this[t]),delete this[t]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Lt(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,e,t){this._$AK(r,t)}_$ET(r,e){let t=this.constructor.elementProperties.get(r),i=this.constructor._$Eu(r,t);if(i!==void 0&&t.reflect===!0){let a=(t.converter?.toAttribute!==void 0?t.converter:Ce).toAttribute(e,t.type);this._$Em=r,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(r,e){let t=this.constructor,i=t._$Eh.get(r);if(i!==void 0&&this._$Em!==i){let a=t.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Ce;this._$Em=i;let c=l.fromAttribute(e,a.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(r,e,t,i=!1,a){if(r!==void 0){let l=this.constructor;if(i===!1&&(a=this[r]),t??=l.getPropertyOptions(r),!((t.hasChanged??We)(a,e)||t.useDefault&&t.reflect&&a===this._$Ej?.get(r)&&!this.hasAttribute(l._$Eu(r,t))))return;this.C(r,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,e,{useDefault:t,reflect:i,wrapped:a},l){t&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,l??e??this[r]),a!==!0||l!==void 0)||(this._$AL.has(r)||(this.hasUpdated||t||(e=void 0),this._$AL.set(r,e)),i===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,a]of t){let{wrapped:l}=a,c=this[i];l!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,a,c)}}let r=!1,e=this._$AL;try{r=this.shouldUpdate(e),r?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw r=!1,this._$EM(),t}r&&this._$AE(e)}willUpdate(r){}_$AE(r){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(r){}firstUpdated(r){}};ne.elementStyles=[],ne.shadowRootOptions={mode:"open"},ne[je("elementProperties")]=new Map,ne[je("finalized")]=new Map,qi?.({ReactiveElement:ne}),(Ve.reactiveElementVersions??=[]).push("2.1.2");var xt=globalThis,Dt=n=>n,Ke=xt.trustedTypes,qt=Ke?Ke.createPolicy("lit-html",{createHTML:n=>n}):void 0,Vt="$lit$",ue=`lit$${Math.random().toFixed(9).slice(2)}$`,Wt="?"+ue,Oi=`<${Wt}>`,ve=document,Me=()=>ve.createComment(""),Re=n=>n===null||typeof n!="object"&&typeof n!="function",$t=Array.isArray,Fi=n=>$t(n)||typeof n?.[Symbol.iterator]=="function",gt=`[ 	
\f\r]`,Ie=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ot=/-->/g,Ft=/>/g,ge=RegExp(`>|${gt}(?:([^\\s"'>=/]+)(${gt}*=${gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Nt=/'/g,Ut=/"/g,Kt=/^(?:script|style|textarea|title)$/i,wt=n=>(r,...e)=>({_$litType$:n,strings:r,values:e}),o=wt(1),P=wt(2),Bs=wt(3),oe=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Bt=new WeakMap,me=ve.createTreeWalker(ve,129);function Yt(n,r){if(!$t(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return qt!==void 0?qt.createHTML(r):r}var Ni=(n,r)=>{let e=n.length-1,t=[],i,a=r===2?"<svg>":r===3?"<math>":"",l=Ie;for(let c=0;c<e;c++){let d=n[c],_,g,m=-1,v=0;for(;v<d.length&&(l.lastIndex=v,g=l.exec(d),g!==null);)v=l.lastIndex,l===Ie?g[1]==="!--"?l=Ot:g[1]!==void 0?l=Ft:g[2]!==void 0?(Kt.test(g[2])&&(i=RegExp("</"+g[2],"g")),l=ge):g[3]!==void 0&&(l=ge):l===ge?g[0]===">"?(l=i??Ie,m=-1):g[1]===void 0?m=-2:(m=l.lastIndex-g[2].length,_=g[1],l=g[3]===void 0?ge:g[3]==='"'?Ut:Nt):l===Ut||l===Nt?l=ge:l===Ot||l===Ft?l=Ie:(l=ge,i=void 0);let b=l===ge&&n[c+1].startsWith("/>")?" ":"";a+=l===Ie?d+Oi:m>=0?(t.push(_),d.slice(0,m)+Vt+d.slice(m)+ue+b):d+ue+(m===-2?c:b)}return[Yt(n,a+(n[e]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),t]},Pe=class n{constructor({strings:r,_$litType$:e},t){let i;this.parts=[];let a=0,l=0,c=r.length-1,d=this.parts,[_,g]=Ni(r,e);if(this.el=n.createElement(_,t),me.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=me.nextNode())!==null&&d.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(Vt)){let v=g[l++],b=i.getAttribute(m).split(ue),w=/([.?@])?(.*)/.exec(v);d.push({type:1,index:a,name:w[2],strings:b,ctor:w[1]==="."?vt:w[1]==="?"?ft:w[1]==="@"?bt:$e}),i.removeAttribute(m)}else m.startsWith(ue)&&(d.push({type:6,index:a}),i.removeAttribute(m));if(Kt.test(i.tagName)){let m=i.textContent.split(ue),v=m.length-1;if(v>0){i.textContent=Ke?Ke.emptyScript:"";for(let b=0;b<v;b++)i.append(m[b],Me()),me.nextNode(),d.push({type:2,index:++a});i.append(m[v],Me())}}}else if(i.nodeType===8)if(i.data===Wt)d.push({type:2,index:a});else{let m=-1;for(;(m=i.data.indexOf(ue,m+1))!==-1;)d.push({type:7,index:a}),m+=ue.length-1}a++}}static createElement(r,e){let t=ve.createElement("template");return t.innerHTML=r,t}};function xe(n,r,e=n,t){if(r===oe)return r;let i=t!==void 0?e._$Co?.[t]:e._$Cl,a=Re(r)?void 0:r._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(n),i._$AT(n,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(r=xe(n,i._$AS(n,r.values),i,t)),r}var mt=class{constructor(r,e){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:e},parts:t}=this._$AD,i=(r?.creationScope??ve).importNode(e,!0);me.currentNode=i;let a=me.nextNode(),l=0,c=0,d=t[0];for(;d!==void 0;){if(l===d.index){let _;d.type===2?_=new Le(a,a.nextSibling,this,r):d.type===1?_=new d.ctor(a,d.name,d.strings,this,r):d.type===6&&(_=new yt(a,this,r)),this._$AV.push(_),d=t[++c]}l!==d?.index&&(a=me.nextNode(),l++)}return me.currentNode=ve,i}p(r){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(r,t,e),e+=t.strings.length-2):t._$AI(r[e])),e++}},Le=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,e,t,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=r,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,e=this._$AM;return e!==void 0&&r?.nodeType===11&&(r=e.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,e=this){r=xe(this,r,e),Re(r)?r===p||r==null||r===""?(this._$AH!==p&&this._$AR(),this._$AH=p):r!==this._$AH&&r!==oe&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Fi(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==p&&Re(this._$AH)?this._$AA.nextSibling.data=r:this.T(ve.createTextNode(r)),this._$AH=r}$(r){let{values:e,_$litType$:t}=r,i=typeof t=="number"?this._$AC(r):(t.el===void 0&&(t.el=Pe.createElement(Yt(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let a=new mt(i,this),l=a.u(this.options);a.p(e),this.T(l),this._$AH=a}}_$AC(r){let e=Bt.get(r.strings);return e===void 0&&Bt.set(r.strings,e=new Pe(r)),e}k(r){$t(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let a of r)i===e.length?e.push(t=new n(this.O(Me()),this.O(Me()),this,this.options)):t=e[i],t._$AI(a),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(r=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);r!==this._$AB;){let t=Dt(r).nextSibling;Dt(r).remove(),r=t}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},$e=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,e,t,i,a){this.type=1,this._$AH=p,this._$AN=void 0,this.element=r,this.name=e,this._$AM=i,this.options=a,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(r,e=this,t,i){let a=this.strings,l=!1;if(a===void 0)r=xe(this,r,e,0),l=!Re(r)||r!==this._$AH&&r!==oe,l&&(this._$AH=r);else{let c=r,d,_;for(r=a[0],d=0;d<a.length-1;d++)_=xe(this,c[t+d],e,d),_===oe&&(_=this._$AH[d]),l||=!Re(_)||_!==this._$AH[d],_===p?r=p:r!==p&&(r+=(_??"")+a[d+1]),this._$AH[d]=_}l&&!i&&this.j(r)}j(r){r===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},vt=class extends $e{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===p?void 0:r}},ft=class extends $e{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==p)}},bt=class extends $e{constructor(r,e,t,i,a){super(r,e,t,i,a),this.type=5}_$AI(r,e=this){if((r=xe(this,r,e,0)??p)===oe)return;let t=this._$AH,i=r===p&&t!==p||r.capture!==t.capture||r.once!==t.once||r.passive!==t.passive,a=r!==p&&(t===p||i);i&&this.element.removeEventListener(this.name,this,t),a&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},yt=class{constructor(r,e,t){this.element=r,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(r){xe(this,r)}};var Ui=xt.litHtmlPolyfillSupport;Ui?.(Pe,Le),(xt.litHtmlVersions??=[]).push("3.3.2");var Gt=(n,r,e)=>{let t=e?.renderBefore??r,i=t._$litPart$;if(i===void 0){let a=e?.renderBefore??null;t._$litPart$=i=new Le(r.insertBefore(Me(),a),a,void 0,e??{})}return i._$AI(n),i};var kt=globalThis,T=class extends ne{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=Gt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return oe}};T._$litElement$=!0,T.finalized=!0,kt.litElementHydrateSupport?.({LitElement:T});var Bi=kt.litElementPolyfillSupport;Bi?.({LitElement:T});(kt.litElementVersions??=[]).push("4.2.2");var Qt=n=>(r,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(n,r)}):customElements.define(n,r)};var Vi={attribute:!0,type:String,converter:Ce,reflect:!1,hasChanged:We},Wi=(n=Vi,r,e)=>{let{kind:t,metadata:i}=e,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),t==="setter"&&((n=Object.create(n)).wrapped=!0),a.set(e.name,n),t==="accessor"){let{name:l}=e;return{set(c){let d=r.get.call(this);r.set.call(this,c),this.requestUpdate(l,d,n,!0,c)},init(c){return c!==void 0&&this.C(l,void 0,n,c),c}}}if(t==="setter"){let{name:l}=e;return function(c){let d=this[l];r.call(this,c),this.requestUpdate(l,d,n,!0,c)}}throw Error("Unsupported decorator location: "+t)};function y(n){return(r,e)=>typeof e=="object"?Wi(n,r,e):((t,i,a)=>{let l=i.hasOwnProperty(a);return i.constructor.createProperty(a,t),l?Object.getOwnPropertyDescriptor(i,a):void 0})(n,r,e)}function h(n){return y({...n,state:!0,attribute:!1})}var Zt={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",ok:"OK",all:"All",new_object:"+ New Object",edit:"Edit",duplicate:"Duplicate",task_duplicated:"Task duplicated",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",reset:"Reset",cancel:"Cancel",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",runtime_hours:"Target runtime (hours)",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",custom:"Custom",history:"History",cost:"Cost",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_optional:"Due at time (optional, HH:MM)",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",tasks_lower:"tasks",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",safety_interval:"Safety interval (optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_window_7:"7 days",cal_window_14:"14 days",cal_window_30:"30 days",cal_window_365:"1 year",cal_every_n_days:"every {n} days",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",no_advanced_features_hint:"Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",completions:"completions",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",compound:"Compound (multiple conditions)",compound_logic_and:"AND \u2014 all conditions must trigger",compound_logic_or:"OR \u2014 any condition triggers",compound_help:"Combine several sensor conditions into one trigger.",compound_no_conditions:"No conditions yet \u2014 add at least one.",compound_add_condition:"Add condition",compound_condition:"Condition",compound_remove_condition:"Remove condition",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_predictions:"Sensor Predictions",feat_predictions_desc:"Predict trigger dates from sensor degradation",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_snooze_hours:"Snooze duration (hours)",settings_budget:"Budget",settings_currency:"Currency",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_import_csv:"Import CSV",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",filter_label:"Filter",user_label:"User",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",group_delete_confirm:'Delete group "{name}"?',groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else sees only Complete and Skip.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc:"Per-task HA action on complete + quick-complete QR with pre-set values.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_service:"Service",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",quick_complete_defaults_title:"Quick-complete defaults (for QR scans, optional)",quick_complete_defaults_desc:"Pre-set values for quick-complete QR scans. Without these, the QR opens the complete dialog.",quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026",archive:"Archive",unarchive:"Unarchive",archived:"Archived",show_archived:"Show archived",hide_archived:"Hide archived",confirm_archive_object:"Archive this object and its tasks? They keep their history and can be unarchived later.",settings_archive:"Archive & Retention",settings_archive_desc:"Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",settings_archive_oneoff_days:"Auto-archive completed one-off tasks after (days, 0 = off)",settings_delete_archived_oneoff_days:"Auto-delete archived one-off tasks after (days, 0 = never)",archive_object:"Archive object",unarchive_object:"Unarchive object",documents:"Documents",documents_empty:"No documents yet.",doc_upload:"Upload file",doc_uploading:"Uploading\u2026",doc_add_link:"Add link",doc_link_url:"URL (https://\u2026)",doc_link_title:"Title (optional)",doc_open:"Open",doc_delete_confirm:'Delete "{name}"?',doc_too_large:"File is too large (max 25 MB).",doc_upload_failed:"Upload failed.",doc_deduped:"Already stored elsewhere \u2014 shared, no extra space used.",doc_dup_in_object:"This file is already attached to this object.",doc_link_invalid:"Only http/https links are allowed.",doc_cat_manual:"Manual",doc_cat_warranty:"Warranty",doc_cat_invoice:"Invoice",doc_cat_spare_parts:"Spare parts",doc_cat_photo:"Photo",doc_cat_other:"Other",doc_link_badge:"Link",doc_storage_title:"Document storage",doc_storage_saved:"Saved via deduplication",doc_storage_refresh:"Refresh",doc_download:"Download",doc_close:"Close",doc_camera:"Take photo",doc_drop_hint:"Drop files here",doc_task_none:"No documents linked to this task.",doc_link_existing:"Link a document\u2026",doc_attach:"Link",doc_unlink:"Unlink",doc_page:"Page",chart_range_7d:"7d",chart_range_30d:"30d",chart_range_90d:"90d",chart_range_1y:"1y",chart_since_service:"since last service",chart_no_stats:"No long-term statistics for this entity \u2014 showing maintenance-event values only",auto_complete_on_recovery:"Auto-complete when the sensor recovers",auto_complete_on_recovery_help:"Records a completion (sets last performed) when the trigger clears itself \u2014 e.g. salt refilled, filter replaced.",doc_search:"Search documents\u2026",doc_search_none:"No matching documents"};var Qe={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"#ff5722",archived:"var(--disabled-color, #9e9e9e)"},Xt={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",archived:"mdi:archive-outline",completed:"mdi:check-circle",skipped:"mdi:skip-next",reset:"mdi:refresh"},Tt="en",He={en:Zt},Yi=new Set(["de","nl","fr","it","es","pt","ru","uk","pl","cs","sv","zh","da","fi","nb","ja","hi"]),Gi="/maintenance_supporter_locales",Et={};function St(n){return(n||Tt).substring(0,2).toLowerCase()}function s(n,r){let e=St(r);return He[e]?.[n]??He.en[n]??n}function Ze(n){let r=St(n);return r===Tt||r in He}function se(n){let r=St(n);return r===Tt||r in He||!Yi.has(r)?Promise.resolve():(r in Et||(Et[r]=fetch(`${Gi}/${r}.json`).then(e=>e.ok?e.json():null).then(e=>{e&&(He[r]=e)}).catch(()=>{})),Et[r])}function ei(n){let r=(n||"en").substring(0,2).toLowerCase();return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN",da:"da-DK",fi:"fi-FI",nb:"nb-NO",ja:"ja-JP",hi:"hi-IN"}[r]??"en-US"}function Y(n,r){if(!n)return"\u2014";try{let e=n.includes("T")?n:n+"T00:00:00";return new Date(e).toLocaleDateString(ei(r),{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return n}}function Je(n,r){if(!n)return"\u2014";try{let e=ei(r),t=new Date(n);return t.toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}catch{return n}}function ze(n,r){if(n==null)return"\u2014";let e=r||"en";return n<0?`${Math.abs(n)} ${s("d_overdue",e)}`:n===0?s("today",e):`${n} ${s(n===1?"day":"days",e)}`}function Jt(n,r,e){return n==null?"\u2014":`${n} ${s("unit_"+(r||"days"),e)}`}function Ge(n,r,e="long"){let t=(r||"en").substring(0,2);return new Date(Date.UTC(2024,0,1+n)).toLocaleDateString(t,{weekday:e,timeZone:"UTC"})}function ti(n,r){let e=n.schedule;switch(e?.kind){case"weekdays":return(e.weekdays||[]).map(t=>Ge(t,r,"short")).join(" & ")||"\u2014";case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?s("ord_last",r):s("ord_"+e.nth,r)} ${Ge(e.weekday,r,"long")}`;case"day_of_month":return e.day!=null?`${s("day_word",r)} ${e.day}`:"\u2014";case"one_time":return n.due_date?Y(n.due_date,r):s("one_time",r);case"manual":return s("manual",r);case"interval":return Jt(e.every,e.unit,r)}return n.schedule_type==="one_time"?n.due_date?Y(n.due_date,r):s("one_time",r):n.schedule_type==="manual"?s("manual",r):n.interval_days!=null?Jt(n.interval_days,n.interval_unit,r):"\u2014"}function fe(n,r){n.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:r},bubbles:!0,composed:!0}))}var Xe=A`
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
`;var Qi={days:1,weeks:7,months:30.4368,years:365.25};function At(n,r){return!n||n<=0?0:n*(Qi[r||"days"]??1)}function et(n,r,e){let t=At(n,e);if(t<=0||r==null)return{pct:0,overflow:!1};let i=(t-r)/t*100;return{pct:Math.max(0,Math.min(100,i)),overflow:i>100}}function jt(n,r=new Date){if(!n)return{kind:"none",days:null,date:null};let e=new Date(`${n}T00:00:00`);if(isNaN(e.getTime()))return{kind:"none",days:null,date:null};let t=Date.UTC(r.getFullYear(),r.getMonth(),r.getDate()),i=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate()),a=Math.round((i-t)/864e5);return a<0?{kind:"expired",days:a,date:n}:a<=60?{kind:"expiring",days:a,date:n}:{kind:"valid",days:a,date:n}}var we=[{key:"name",labelKey:"name",required:!0},{key:"manufacturer",labelKey:"manufacturer"},{key:"model",labelKey:"model"},{key:"serial_number",labelKey:"serial_number_label"},{key:"installation_date",labelKey:"installed"},{key:"warranty_expiry",labelKey:"warranty"},{key:"area_id",labelKey:"area"},{key:"documentation_url",labelKey:"documentation_url_label"},{key:"notes",labelKey:"object_notes_label"},{key:"task_count",labelKey:"tasks"},{key:"actions",labelKey:"actions"}],Zi=we.map(n=>n.key),tt=["name","manufacturer","model","serial_number","installation_date","warranty_expiry","area_id","task_count","actions"];function De(n){if(!Array.isArray(n))return[...tt];let r=new Set,e=[];for(let t of n)typeof t=="string"&&Zi.includes(t)&&!r.has(t)&&(r.add(t),e.push(t));return e.length?(e.includes("name")||e.unshift("name"),e):[...tt]}function it(n,r,e){let t=new Blob([n],{type:e}),i=URL.createObjectURL(t),a=document.createElement("a");a.href=i,a.download=r,a.target="_blank",a.rel="noopener",a.style.display="none",document.body.appendChild(a),a.dispatchEvent(new MouseEvent("click")),document.body.removeChild(a),setTimeout(()=>URL.revokeObjectURL(i),6e4)}function st(n,r){let e=document.createElement("a");e.href=n,e.download=r,e.target="_blank",e.rel="noopener",e.style.display="none",document.body.appendChild(e),e.dispatchEvent(new MouseEvent("click")),document.body.removeChild(e)}var ii=A`
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

  /* Row action buttons (Complete / Skip): right-aligned in their column and a
     bit larger — the default mwc glyph reads small inside its padded button. */
  .row-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 2px;
  }
  .row-actions mwc-icon-button {
    --mdc-icon-button-size: 44px;
    --mdc-icon-size: 26px;
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
  .doc-badge {
    display: inline-flex; align-items: center; gap: 2px; vertical-align: middle;
    margin-left: 8px; padding: 1px 7px 1px 5px; border-radius: 10px;
    font-size: 12px; font-weight: 600;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    color: var(--secondary-text-color, #888);
  }
  .doc-badge ha-icon { --mdc-icon-size: 14px; }
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
`;var at=class{constructor(r){this._cache=new Map;this._pending=new Map;this._hass=r}updateHass(r){this._hass=r}async getDetailStats(r,e,t=30){return this._getStats(r,t<=35?"hour":"day",t,e)}async getMiniStats(r,e){return this._getStats(r,"day",14,e)}async getBatchMiniStats(r){let e=new Map,t=[];for(let d of r){let _=`${d.entityId}:day:14`,g=this._cache.get(_);g&&Date.now()-g.fetchedAt<3e5?e.set(d.entityId,g.points):t.push(d)}if(t.length===0)return e;let i=t.filter(d=>d.isCounter).map(d=>d.entityId),a=t.filter(d=>!d.isCounter).map(d=>d.entityId),l=new Date(Date.now()-336*60*60*1e3).toISOString(),c=[];return i.length>0&&c.push(this._fetchBatch(i,"day",l,["state","sum","change"],!0,e)),a.length>0&&c.push(this._fetchBatch(a,"day",l,["mean","min","max"],!1,e)),await Promise.all(c),e}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(r,e,t,i){let a=`${r}:${e}:${t}`,l=this._cache.get(a);if(l&&Date.now()-l.fetchedAt<3e5)return l.points;if(this._pending.has(a))return this._pending.get(a);let c=this._fetchAndNormalize(r,e,t,i,a);this._pending.set(a,c);try{return await c}finally{this._pending.delete(a)}}async _fetchAndNormalize(r,e,t,i,a){let l=new Date(Date.now()-t*24*60*60*1e3).toISOString(),c=i?["state","sum","change"]:["mean","min","max"];try{let _=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:l,statistic_ids:[r],period:e,types:c}))[r]||[],g=this._normalizeRows(_,i);return this._cache.set(a,{entityId:r,fetchedAt:Date.now(),period:e,points:g}),g}catch(d){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${r}:`,d),[]}}async _fetchBatch(r,e,t,i,a,l){try{let c=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:t,statistic_ids:r,period:e,types:i});for(let d of r){let _=c[d]||[],g=this._normalizeRows(_,a);l.set(d,g),this._cache.set(`${d}:${e}:14`,{entityId:d,fetchedAt:Date.now(),period:e,points:g})}}catch(c){console.warn("[maintenance-supporter] Batch statistics fetch failed:",c)}}_normalizeRows(r,e){let t=[];for(let i of r){let a=null;if(e?a=i.state??null:a=i.mean??null,a===null)continue;let l={ts:i.start,val:a};e||(i.min!=null&&(l.min=i.min),i.max!=null&&(l.max=i.max)),t.push(l)}return t.sort((i,a)=>i.ts-a.ts),t}};var he=class{constructor(r){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=r}updateHass(r){this.hass=r}async getUsers(r=!1){let e=Date.now();if(!r&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(r,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:r,task_id:e,user_id:t})}async getTasksByUser(r){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:r})).tasks}getUserName(r){return!r||!this.usersCache?null:this.usersCache.find(t=>t.id===r)?.name||null}getUser(r){return!r||!this.usersCache?null:this.usersCache.find(e=>e.id===r)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(r){return r?r===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};var Ji={name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",group_name:"name",group_description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_for_minutes:"trigger_for_minutes"};function Xi(n,r){let e=Ji[n];if(!e)return n;let t=s(e,r);return t&&t!==e?t:n}function es(n){let e=n.match(/data\['([^']+)'\]/)?.[1],t;return(t=n.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=n.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=n.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=n.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(n)?{field:e,rule:"required"}:(t=n.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(n)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(n)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function I(n,r,e){if(e=e??s("action_error",r),typeof n=="string")return n;if(typeof n!="object"||n===null)return e;let t=n,i=t.message||t.error?.message||"";if(!i)return e;let a=es(i),l=a.field?Xi(a.field,r):"",c=d=>s(d,r).replace("{field}",l).replace("{n}",a.param??"");switch(a.rule){case"too_long":return c("err_too_long");case"too_short":return c("err_too_short");case"value_too_high":return c("err_value_too_high");case"value_too_low":return c("err_value_too_low");case"required":return c("err_required");case"wrong_type":return c("err_wrong_type").replace("{type}",a.param??"");case"invalid_choice":return c("err_invalid_choice");case"invalid_value":return c("err_invalid_value");default:return i||e}}var B=class extends T{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){return o`
      <label class="field">
        ${this.label?o`<span class="label">${this.label}${this.required?o`<span class="req">*</span>`:p}</span>`:p}
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
        ${this.helper?o`<span class="helper">${this.helper}</span>`:p}
      </label>
    `}};B.styles=A`
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
  `,u([y()],B.prototype,"label",2),u([y()],B.prototype,"value",2),u([y()],B.prototype,"placeholder",2),u([y()],B.prototype,"type",2),u([y({type:Boolean})],B.prototype,"required",2),u([y({type:Boolean})],B.prototype,"disabled",2),u([y()],B.prototype,"step",2),u([y()],B.prototype,"min",2),u([y()],B.prototype,"max",2),u([y()],B.prototype,"pattern",2),u([y()],B.prototype,"helper",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",B);var F=class extends T{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._entryId=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._error="",this._open=!0}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(e){this._error=I(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}render(){if(!this._open)return o``;let e=this._lang,t=this._entryId?s("edit_object",e):s("new_object",e);return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:p}
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
    `}};F.styles=A`
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
  `,u([y({attribute:!1})],F.prototype,"hass",2),u([h()],F.prototype,"_open",2),u([h()],F.prototype,"_loading",2),u([h()],F.prototype,"_error",2),u([h()],F.prototype,"_name",2),u([h()],F.prototype,"_manufacturer",2),u([h()],F.prototype,"_model",2),u([h()],F.prototype,"_serialNumber",2),u([h()],F.prototype,"_areaId",2),u([h()],F.prototype,"_installationDate",2),u([h()],F.prototype,"_warrantyExpiry",2),u([h()],F.prototype,"_documentationUrl",2),u([h()],F.prototype,"_notes",2),u([h()],F.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",F);function ae(n){let r=n??0;return r<1024?`${r} B`:r<1024*1024?`${(r/1024).toFixed(1)} KB`:`${(r/(1024*1024)).toFixed(1)} MB`}var rt=["manual","warranty","invoice","spare_parts","photo","other"],ts={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"},z=class extends T{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._dragOver=!1;this._loadedFor=null;this._localeReady=!1}_isImage(e){return e.kind==="file"&&(e.mime||"").startsWith("image/")}async _sign(e){return(await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${e.id}`,expires:300})).path}get _lang(){return this.hass?.language||"en"}updated(e){super.updated(e),this.hass&&!this._localeReady&&(this._localeReady=!0,se(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._load())}async _load(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=e.documents||[],this._loaded=!0,this._error="",this._thumbs={},this._loadThumbs()}catch(e){this._error=I(e,this._lang),this._loaded=!0}}async _loadThumbs(){await Promise.all(this._docs.filter(e=>this._isImage(e)).map(async e=>{try{let t=await this._sign(e);this._thumbs={...this._thumbs,[e.id]:t}}catch{}}))}_category_of(e){return(e.tags||[]).find(i=>rt.includes(i))||"other"}_labelKeydown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),e.currentTarget.querySelector("input")?.click())}_onFileInput(e){let t=e.target,i=Array.from(t.files??[]);i.length&&this._uploadFiles(i),t.value=""}_onCameraInput(e){let t=e.target,i=Array.from(t.files??[]);i.length&&this._uploadFiles(i,"photo"),t.value=""}_onDrop(e){if(e.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let t=Array.from(e.dataTransfer?.files??[]);t.length&&this._uploadFiles(t)}_onDragOver(e){this.canWrite&&(e.preventDefault(),this._dragOver=!0)}_onDragLeave(e){let t=e.relatedTarget;(!t||!e.currentTarget.contains(t))&&(this._dragOver=!1)}async _uploadFiles(e,t){let i=t??this._category;this._busy=!0,this._error="",this._hint="";let a=0,l=0;try{for(let c of e){let d=new FormData;d.append("entry_id",this.entryId),d.append("tags",i),d.append("file",c,c.name);let _=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:d});if(!_.ok){this._error=_.status===413?s("doc_too_large",this._lang):s("doc_upload_failed",this._lang);continue}let g=await _.json();g.duplicate_in_object?l++:g.deduped&&a++}l?this._hint=s("doc_dup_in_object",this._lang):a&&(this._hint=s("doc_deduped",this._lang)),await this._load()}catch{this._error=s("doc_upload_failed",this._lang)}finally{this._busy=!1}}async _download(e){try{let t=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${e.id}`,expires:30});st(t.path,e.filename||e.title||"document")}catch(t){this._error=I(t,this._lang)}}async _preview(e){if(this._isImage(e)){this._lightboxUrl=this._thumbs[e.id]||await this._sign(e);return}let t=window.open("about:blank","_blank");try{let i=await this._sign(e);t&&(t.location.href=new URL(i,window.location.origin).href)}catch(i){t&&t.close(),this._error=I(i,this._lang)}}_openDoc(e){e.kind==="file"?this._preview(e):e.url&&window.open(e.url,"_blank","noopener")}_startEdit(e){this._editingId=e.id,this._editTitle=e.title||"",this._editCategory=this._category_of(e),this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}async _saveEdit(e){let t=(e.tags||[]).filter(a=>!rt.includes(a)),i=e.kind==="file"?[this._editCategory,...t]:e.tags??[];this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:e.id,title:this._editTitle.trim()||e.filename||e.url||"",tags:i}),this._editingId="",await this._load()}catch(a){this._error=I(a,this._lang)}finally{this._busy=!1}}async _delete(e){let t=e.title||e.filename||e.url||"";if(window.confirm(s("doc_delete_confirm",this._lang).replace("{name}",t))){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:e.id}),await this._load()}catch(i){this._error=I(i,this._lang)}finally{this._busy=!1}}}async _addLink(){let e=this._linkUrl.trim();if(e){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/add_link",entry_id:this.entryId,url:e,title:this._linkTitle.trim()||null}),this._linkUrl="",this._linkTitle="",this._addingLink=!1,await this._load()}catch(t){this._error=I(t,this._lang,s("doc_link_invalid",this._lang))}finally{this._busy=!1}}}render(){let e=this._lang;return o`
      <div
        class="doc-zone ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this._dragOver&&this.canWrite?o`<div class="drop-overlay">
              <ha-icon icon="mdi:tray-arrow-down"></ha-icon> ${s("doc_drop_hint",e)}
            </div>`:p}
      <div class="doc-header">
        <h3>${s("documents",e)} (${this._docs.length})</h3>
        ${this.canWrite?o`
              <div class="doc-actions">
                <select
                  class="cat-select"
                  .value=${this._category}
                  ?disabled=${this._busy}
                  @change=${t=>this._category=t.target.value}
                >
                  ${rt.map(t=>o`<option value=${t}>${s(`doc_cat_${t}`,e)}</option>`)}
                </select>
                <label
                  class="btn primary ${this._busy?"disabled":""}"
                  role="button"
                  tabindex="0"
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:upload"></ha-icon>
                  ${this._busy?s("doc_uploading",e):s("doc_upload",e)}
                  <input type="file" multiple hidden ?disabled=${this._busy} @change=${this._onFileInput} />
                </label>
                <label
                  class="btn camera-btn ${this._busy?"disabled":""}"
                  role="button"
                  tabindex="0"
                  aria-label=${s("doc_camera",e)}
                  title=${s("doc_camera",e)}
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:camera"></ha-icon>
                  <input type="file" accept="image/*" capture="environment" hidden ?disabled=${this._busy} @change=${this._onCameraInput} />
                </label>
                <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!this._addingLink}>
                  <ha-icon icon="mdi:link-variant"></ha-icon> ${s("doc_add_link",e)}
                </button>
              </div>
            `:p}
      </div>

      ${this._error?o`<div class="doc-msg error">${this._error}</div>`:p}
      ${this._hint?o`<div class="doc-msg hint">${this._hint}</div>`:p}

      ${this._addingLink&&this.canWrite?o`
            <div class="link-form">
              <input
                type="url"
                placeholder=${s("doc_link_url",e)}
                .value=${this._linkUrl}
                ?disabled=${this._busy}
                @input=${t=>this._linkUrl=t.target.value}
              />
              <input
                type="text"
                placeholder=${s("doc_link_title",e)}
                .value=${this._linkTitle}
                ?disabled=${this._busy}
                @input=${t=>this._linkTitle=t.target.value}
              />
              <button class="btn primary" ?disabled=${this._busy||!this._linkUrl.trim()} @click=${this._addLink}>
                ${s("add",e)}
              </button>
              <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!1}>
                ${s("cancel",e)}
              </button>
            </div>
          `:p}

      ${this._loaded?this._docs.length===0?o`<div class="doc-empty">${s("documents_empty",e)}</div>`:o`
              <div class="doc-list">
                ${this._docs.map(t=>this._renderDoc(t,e))}
              </div>
            `:o`<div class="doc-empty">${s("loading",e)}</div>`}

      ${this._lightboxUrl?o`<div class="lightbox" @click=${()=>this._lightboxUrl=""}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${t=>t.stopPropagation()} />
            <button class="lightbox-close" title=${s("doc_close",e)} @click=${()=>this._lightboxUrl=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`:p}
      </div>
    `}_renderDoc(e,t){if(this._editingId===e.id)return this._renderEdit(e,t);let i=e.kind==="file",a=this._category_of(e),l=i?`${s(`doc_cat_${a}`,t)} \xB7 ${ae(e.size)}`:s("doc_link_badge",t),c=this._thumbs[e.id];return o`
      <div class="doc-row">
        ${i&&c?o`<img
              class="doc-thumb"
              src=${c}
              alt=${e.title||""}
              title=${s("doc_open",t)}
              @click=${()=>this._preview(e)}
            />`:o`<ha-icon
              class="doc-icon ${i?"clickable":""}"
              icon=${i?ts[a]:"mdi:link-variant"}
              @click=${()=>i&&this._preview(e)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${s("doc_open",t)}
          @click=${()=>this._openDoc(e)}
          @keydown=${d=>{(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),this._openDoc(e))}}
        >
          <div class="doc-title">${e.title||e.filename||e.url}</div>
          <div class="doc-meta">${l}</div>
        </div>
        <div class="doc-row-actions">
          ${i?o`
                <button class="icon-btn" title=${s("doc_open",t)} @click=${()=>this._preview(e)}>
                  <ha-icon icon="mdi:eye-outline"></ha-icon>
                </button>
                <button class="icon-btn" title=${s("doc_download",t)} @click=${()=>this._download(e)}>
                  <ha-icon icon="mdi:download"></ha-icon>
                </button>`:o`<a
                class="icon-btn"
                href=${e.url??"#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${s("doc_open",t)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite?o`
                <button class="icon-btn" title=${s("edit",t)} ?disabled=${this._busy} @click=${()=>this._startEdit(e)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button class="icon-btn danger" title=${s("delete",t)} ?disabled=${this._busy} @click=${()=>this._delete(e)}>
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>`:p}
        </div>
      </div>
    `}_renderEdit(e,t){let i=e.kind==="file";return o`
      <div class="doc-row editing">
        <input
          class="edit-title"
          type="text"
          placeholder=${s("doc_link_title",t)}
          .value=${this._editTitle}
          ?disabled=${this._busy}
          @input=${a=>this._editTitle=a.target.value}
        />
        ${i?o`<select
              class="cat-select"
              ?disabled=${this._busy}
              @change=${a=>this._editCategory=a.target.value}
            >
              ${rt.map(a=>o`<option value=${a} ?selected=${a===this._editCategory}>${s(`doc_cat_${a}`,t)}</option>`)}
            </select>`:p}
        <button class="icon-btn" title=${s("save",t)} ?disabled=${this._busy||!this._editTitle.trim()} @click=${()=>this._saveEdit(e)}>
          <ha-icon icon="mdi:check"></ha-icon>
        </button>
        <button class="icon-btn" title=${s("cancel",t)} ?disabled=${this._busy} @click=${this._cancelEdit}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `}};z.styles=A`
    :host { display: block; margin: 8px 0 4px; }
    .doc-zone { position: relative; }
    .doc-zone.drag-over {
      outline: 2px dashed var(--primary-color); outline-offset: 4px; border-radius: 8px;
    }
    .drop-overlay {
      position: absolute; inset: 0; z-index: 5; pointer-events: none;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      border-radius: 8px; font-size: 15px; font-weight: 600;
      color: var(--primary-color); opacity: 0.95;
      background: var(--card-background-color, rgba(255, 255, 255, 0.85));
    }
    .drop-overlay ha-icon { --mdc-icon-size: 24px; }
    .camera-btn { padding: 6px 10px; }
    .doc-header {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; flex-wrap: wrap;
    }
    h3 { margin: 8px 0; font-size: 16px; }
    .doc-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .cat-select {
      padding: 6px 8px; border-radius: 6px; font: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .btn {
      display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
      padding: 6px 12px; border-radius: 6px; font: inherit; font-size: 13px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .btn.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: var(--primary-color); }
    .btn:focus-visible, .icon-btn:focus-visible {
      outline: 2px solid var(--primary-color); outline-offset: 2px;
    }
    .btn.disabled, .btn[disabled] { opacity: 0.5; pointer-events: none; }
    .btn ha-icon { --mdc-icon-size: 18px; }
    .link-form { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0; }
    .link-form input {
      flex: 1 1 180px; padding: 6px 10px; border-radius: 6px; font: inherit;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .doc-msg { font-size: 13px; margin: 6px 0; }
    .doc-msg.error { color: var(--error-color, #f44336); }
    .doc-msg.hint { color: var(--secondary-text-color, #888); }
    .doc-empty { color: var(--secondary-text-color, #888); font-size: 13px; padding: 8px 0; }
    .doc-list { display: flex; flex-direction: column; gap: 4px; }
    .doc-row {
      display: flex; align-items: center; gap: 12px; padding: 8px 10px;
      border: 1px solid var(--divider-color); border-radius: 8px;
      background: var(--card-background-color, transparent);
    }
    .doc-row.editing { gap: 8px; }
    .edit-title {
      flex: 1; min-width: 0; padding: 6px 10px; border-radius: 6px; font: inherit;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .doc-icon { color: var(--primary-color); --mdc-icon-size: 24px; flex: none; }
    .doc-icon.clickable { cursor: pointer; }
    .doc-thumb {
      width: 40px; height: 40px; object-fit: cover; border-radius: 6px; flex: none;
      cursor: pointer; border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
    }
    .lightbox {
      position: fixed; inset: 0; z-index: 9999; cursor: zoom-out;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0, 0, 0, 0.85);
    }
    .lightbox-img {
      max-width: 92vw; max-height: 92vh; object-fit: contain; cursor: default;
      border-radius: 8px; box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
    }
    .lightbox-close {
      position: fixed; top: 16px; right: 16px; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 50%; border: none;
      background: rgba(0, 0, 0, 0.5); color: #fff;
    }
    .lightbox-close ha-icon { --mdc-icon-size: 26px; }
    .doc-info { flex: 1; min-width: 0; cursor: pointer; border-radius: 6px; }
    .doc-info:hover .doc-title { text-decoration: underline; }
    .doc-info:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .doc-title { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .doc-meta { font-size: 12px; color: var(--secondary-text-color, #888); }
    .doc-row-actions { display: flex; gap: 4px; flex: none; }
    .icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 8px; cursor: pointer;
      background: transparent; border: none; color: var(--primary-text-color);
      text-decoration: none;
    }
    .icon-btn:hover { background: var(--secondary-background-color, rgba(0,0,0,0.06)); }
    .icon-btn.danger { color: var(--error-color, #f44336); }
    .icon-btn[disabled] { opacity: 0.4; pointer-events: none; }
    .icon-btn ha-icon { --mdc-icon-size: 20px; }
  `,u([y({attribute:!1})],z.prototype,"hass",2),u([y({attribute:!1})],z.prototype,"entryId",2),u([y({type:Boolean})],z.prototype,"canWrite",2),u([h()],z.prototype,"_docs",2),u([h()],z.prototype,"_loaded",2),u([h()],z.prototype,"_busy",2),u([h()],z.prototype,"_error",2),u([h()],z.prototype,"_hint",2),u([h()],z.prototype,"_addingLink",2),u([h()],z.prototype,"_linkUrl",2),u([h()],z.prototype,"_linkTitle",2),u([h()],z.prototype,"_category",2),u([h()],z.prototype,"_thumbs",2),u([h()],z.prototype,"_lightboxUrl",2),u([h()],z.prototype,"_editingId",2),u([h()],z.prototype,"_editTitle",2),u([h()],z.prototype,"_editCategory",2),u([h()],z.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",z);var is=["manual","warranty","invoice","spare_parts","photo","other"],ss={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"},G=class extends T{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._loadedKey="";this._localeReady=!1}get _lang(){return this.hass?.language||"en"}updated(e){super.updated(e),this.hass&&!this._localeReady&&(this._localeReady=!0,se(this._lang).then(()=>this.requestUpdate()));let t=`${this.entryId}|${this.taskId}`;this.hass&&this.entryId&&this.taskId&&this._loadedKey!==t&&(this._loadedKey=t,this._load())}async _load(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=e.documents||[],this._loaded=!0,this._error=""}catch(e){this._error=I(e,this._lang),this._loaded=!0}}_linked(){return this._docs.filter(e=>(e.task_ids||[]).includes(this.taskId))}_available(){return this._docs.filter(e=>!(e.task_ids||[]).includes(this.taskId))}async _setTaskIds(e,t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:e.id,task_ids:t}),await this._load()}catch(i){this._error=I(i,this._lang)}finally{this._busy=!1}}_link(){let e=this._docs.find(t=>t.id===this._attachId);e&&(this._attachId="",this._setTaskIds(e,[...e.task_ids||[],this.taskId]))}_unlink(e){this._setTaskIds(e,(e.task_ids||[]).filter(t=>t!==this.taskId))}_isPdf(e){return e.mime==="application/pdf"||(e.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(e){return this._isPdf(e)?e.task_pages?.[this.taskId]:void 0}async _open(e){if(e.kind==="weblink"){window.open(e.url,"_blank","noopener");return}let t=this._pageFor(e),i=t?`#page=${t}`:"",a=window.open("about:blank","_blank");try{let l=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${e.id}`,expires:300});a&&(a.location.href=new URL(l.path+i,window.location.origin).href)}catch(l){a&&a.close(),this._error=I(l,this._lang)}}async _setPage(e,t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:e.id,task_pages:{[this.taskId]:t}}),await this._load()}catch(i){this._error=I(i,this._lang)}finally{this._busy=!1}}async _download(e){try{let t=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${e.id}`,expires:30});st(t.path,e.filename||e.title||"document")}catch(t){this._error=I(t,this._lang)}}render(){if(!this._loaded||this._docs.length===0)return p;let e=this._lang,t=this._linked(),i=this._available();return o`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${s("documents",e)} (${t.length})</h3>
        ${this._error?o`<div class="tdoc-error">${this._error}</div>`:p}
        ${t.length===0?o`<div class="tdoc-empty">${s("doc_task_none",e)}</div>`:o`<div class="tdoc-list">${t.map(a=>this._renderRow(a,e))}</div>`}
        ${this.canWrite&&i.length?o`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${a=>this._attachId=a.target.value}
              >
                <option value="" ?selected=${!this._attachId}>${s("doc_link_existing",e)}</option>
                ${i.map(a=>o`<option value=${a.id} ?selected=${a.id===this._attachId}>${a.title||a.filename||a.url}</option>`)}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy||!this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${s("doc_attach",e)}
              </button>
            </div>`:p}
      </div>
    `}_renderRow(e,t){let i=e.kind==="file",a=this._isPdf(e),l=e.task_pages?.[this.taskId],c=(e.tags||[]).find(_=>is.includes(_))||"other",d=i?ae(e.size):s("doc_link_badge",t);return o`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${i?ss[c]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${l?`${s("doc_open",t)} \xB7 ${s("doc_page",t)} ${l}`:s("doc_open",t)}
          @click=${()=>this._open(e)}
          @keydown=${_=>{(_.key==="Enter"||_.key===" ")&&(_.preventDefault(),this._open(e))}}
        >
          <div class="tdoc-title">${e.title||e.filename||e.url}</div>
          <div class="tdoc-meta">
            ${d}${l?o` · <span class="tdoc-pagetag">${s("doc_page",t)} ${l}</span>`:p}
          </div>
        </div>
        ${this.canWrite&&a?o`<input
              class="tdoc-page"
              type="number"
              min="1"
              inputmode="numeric"
              aria-label=${s("doc_page",t)}
              title=${s("doc_page",t)}
              placeholder=${s("doc_page",t)}
              .value=${l?String(l):""}
              ?disabled=${this._busy}
              @change=${_=>{let g=parseInt(_.target.value,10);this._setPage(e,Number.isFinite(g)&&g>=1?g:0)}}
            />`:p}
        <button class="icon-btn" title=${s("doc_open",t)} @click=${()=>this._open(e)}>
          <ha-icon icon=${i?"mdi:eye-outline":"mdi:open-in-new"}></ha-icon>
        </button>
        ${i?o`<button class="icon-btn" title=${s("doc_download",t)} @click=${()=>this._download(e)}>
              <ha-icon icon="mdi:download"></ha-icon>
            </button>`:p}
        ${this.canWrite?o`<button class="icon-btn" title=${s("doc_unlink",t)} ?disabled=${this._busy} @click=${()=>this._unlink(e)}>
              <ha-icon icon="mdi:link-variant-off"></ha-icon>
            </button>`:p}
      </div>
    `}};G.styles=A`
    :host { display: block; }
    .task-docs { margin-top: 20px; }
    h3 {
      display: flex; align-items: center; gap: 6px; margin: 0 0 8px;
      font-size: 15px; color: var(--primary-text-color);
    }
    h3 ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color, #888); }
    .tdoc-empty { color: var(--secondary-text-color, #888); font-size: 13px; padding: 2px 0 8px; }
    .tdoc-error { color: var(--error-color, #f44336); font-size: 13px; margin: 4px 0; }
    .tdoc-list { display: flex; flex-direction: column; gap: 4px; }
    .tdoc-row {
      display: flex; align-items: center; gap: 10px; padding: 6px 10px;
      border: 1px solid var(--divider-color); border-radius: 8px;
    }
    .tdoc-icon { color: var(--primary-color); --mdc-icon-size: 22px; flex: none; }
    .tdoc-info { flex: 1; min-width: 0; cursor: pointer; border-radius: 6px; }
    .tdoc-info:hover .tdoc-title { text-decoration: underline; }
    .tdoc-info:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .tdoc-title { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tdoc-meta { font-size: 12px; color: var(--secondary-text-color, #888); }
    .tdoc-pagetag { color: var(--primary-color); font-weight: 500; }
    .tdoc-page {
      flex: none; width: 76px; padding: 5px 8px; border-radius: 6px; font: inherit; font-size: 13px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .tdoc-page:disabled { opacity: 0.5; }
    .icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 8px; cursor: pointer;
      background: transparent; border: none; color: var(--primary-text-color);
    }
    .icon-btn:hover { background: var(--secondary-background-color, rgba(0, 0, 0, 0.06)); }
    .icon-btn[disabled] { opacity: 0.4; pointer-events: none; }
    .icon-btn ha-icon { --mdc-icon-size: 20px; }
    .tdoc-attach { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
    .tdoc-select {
      flex: 1; min-width: 160px; padding: 6px 10px; border-radius: 6px; font: inherit;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .tdoc-btn {
      display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
      padding: 6px 12px; border-radius: 6px; font: inherit; font-size: 13px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); border: 1px solid var(--divider-color);
    }
    .tdoc-btn ha-icon { --mdc-icon-size: 18px; }
    .tdoc-btn[disabled] { opacity: 0.5; pointer-events: none; }
  `,u([y({attribute:!1})],G.prototype,"hass",2),u([y({attribute:!1})],G.prototype,"entryId",2),u([y({attribute:!1})],G.prototype,"taskId",2),u([y({type:Boolean})],G.prototype,"canWrite",2),u([h()],G.prototype,"_docs",2),u([h()],G.prototype,"_loaded",2),u([h()],G.prototype,"_busy",2),u([h()],G.prototype,"_error",2),u([h()],G.prototype,"_attachId",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",G);var as=["cleaning","inspection","replacement","calibration","service","custom"],rs=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],ns=["weekdays","nth_weekday","day_of_month"],si=["threshold","counter","state_change","runtime"],os=[...si,"compound"];function ls(){return{entityIds:"",type:"threshold",above:"",below:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:""}}function cs(n){return{entityIds:(n.entity_ids||(n.entity_id?[n.entity_id]:[])).join(", "),type:n.type||"threshold",above:n.trigger_above?.toString()??"",below:n.trigger_below?.toString()??"",forMinutes:n.trigger_for_minutes?.toString()??"0",targetValue:n.trigger_target_value?.toString()??"",deltaMode:n.trigger_delta_mode||!1,fromState:n.trigger_from_state||"",toState:n.trigger_to_state||"",targetChanges:n.trigger_target_changes?.toString()??"",runtimeHours:n.trigger_runtime_hours?.toString()??""}}function ds(n){let r=n.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(r.length===0)return null;let e={entity_id:r[0],entity_ids:r,type:n.type};if(n.type==="threshold"){let t=parseFloat(n.above);isNaN(t)||(e.trigger_above=t);let i=parseFloat(n.below);isNaN(i)||(e.trigger_below=i);let a=parseInt(n.forMinutes,10);isNaN(a)||(e.trigger_for_minutes=a)}else if(n.type==="counter"){let t=parseFloat(n.targetValue);isNaN(t)||(e.trigger_target_value=t),e.trigger_delta_mode=n.deltaMode}else if(n.type==="state_change"){n.fromState&&(e.trigger_from_state=n.fromState),n.toState&&(e.trigger_to_state=n.toState);let t=parseInt(n.targetChanges,10);isNaN(t)||(e.trigger_target_changes=t)}else if(n.type==="runtime"){let t=parseFloat(n.runtimeHours);isNaN(t)||(e.trigger_runtime_hours=t)}return e}function ps(n){return Array.from({length:7},(r,e)=>Ge(e,n,"short"))}var x=class extends T{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._notes="";this._documentationUrl="";this._customIcon="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._availableTags=[];this._responsibleUserId=null;this._availableUsers=[];this._checklistText="";this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._userService=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}async openCreate(e,t){this._entryId=e,this._taskId=null,this._error="",!e&&t&&t.length>0?(this._objectChoices=t.map(i=>({entry_id:i.entry_id,name:i.object.name})).sort((i,a)=>i.name.localeCompare(a.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}async openEdit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let i=t.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"?String(i.day??1):"1",this._warningDays=t.warning_days.toString(),this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._nfcTagId=t.nfc_tag_id||"",this._responsibleUserId=t.responsible_user_id||null,this._checklistText=(t.checklist||[]).join(`
`),this._scheduleTime=t.schedule_time||"";let a=t.on_complete_action;if(a&&a.service){this._actionService=a.service;let d=a.target?.entity_id;this._actionTargetEntity=Array.isArray(d)?d[0]||"":d||"",this._actionData=a.data&&typeof a.data=="object"?{...a.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let l=t.quick_complete_defaults;this._qcNotes=l?.notes||"",this._qcCost=l?.cost!=null?String(l.cost):"",this._qcDuration=l?.duration!=null?String(l.duration):"",this._qcFeedback=l?.feedback||"";let c=t.adaptive_config||{};if(this._environmentalEntity=c.environmental_entity||"",this._environmentalAttribute=c.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,t.trigger_config){let d=t.trigger_config;this._triggerEntityId=d.entity_id||"",this._triggerEntityIds=d.entity_ids||(d.entity_id?[d.entity_id]:[]),this._triggerEntityLogic=d.entity_logic||"any",this._triggerAttribute=d.attribute||"",this._triggerType=d.type||"threshold",this._triggerAbove=d.trigger_above?.toString()||"",this._triggerBelow=d.trigger_below?.toString()||"",this._triggerForMinutes=d.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=d.trigger_target_value?.toString()||"",this._triggerDeltaMode=d.trigger_delta_mode||!1,this._autoCompleteOnRecovery=d.auto_complete_on_recovery||!1,this._triggerFromState=d.trigger_from_state||"",this._triggerToState=d.trigger_to_state||"",this._triggerTargetChanges=d.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=d.trigger_runtime_hours?.toString()||"",d.type==="compound"?(this._compoundLogic=d.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(d.conditions||[]).map(cs)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._notes="",this._documentationUrl="",this._customIcon="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._responsibleUserId=null,this._checklistText="",this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._autoCompleteOnRecovery=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new he(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,i]=e.split(".");if(!this.hass?.services?.[t]?.[i]){this._actionTestResult="error",this._actionTestError=`Service "${e}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let a=this._actionTargetEntity.trim();if(a){let l=a.split(".")[0];if(l!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=`Service "${e}" only works on ${t}.* entities; entity "${a}" is in ${l}.* \u2014 pick a service that matches the entity domain (e.g. ${l}.${i})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[a]){this._actionTestResult="error",this._actionTestError=`Target entity "${a}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,i]=e.split("."),a=this.hass?.services?.[t]?.[i]?.fields;return!a||Object.keys(a).length===0?null:Object.entries(a).map(([l,c])=>({name:l,required:!!c.required,selector:c.selector||{text:{}}}))}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled)return p;let t=this._serviceSchema();return o`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",e)}</summary>
        <p class="field-help">${s("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let a=this._serviceSchema();if(a){let l=new Set(a.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>l.has(c)))}}}
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
          ${this._actionTestResult==="ok"?o`<span class="ca-test-ok">${s("on_complete_action_test_success",e)}</span>`:p}
          ${this._actionTestResult==="error"?o`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?o`<div class="ca-test-error-detail">${this._actionTestError}</div>`:p}
              </div>`:p}
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
    `}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=t.domain||"",this._suggestedAttributes=t.suggested_attributes||[],this._availableAttributes=t.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}async _save(){if(this._name.trim()){this._loading=!0,this._error="";try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:parseInt(this._warningDays,10)||7};if(this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):ns.includes(this._scheduleType)?(e.schedule=this._buildSchedule(),e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.enabled=this._enabled,e.last_performed=this._lastPerformed||null,e.nfc_tag_id=this._nfcTagId||null,e.responsible_user_id=this._responsibleUserId,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let l=this._compoundConditions.map(ds).filter(c=>c!==null);if(l.length>0){let c={type:"compound",compound_logic:this._compoundLogic,conditions:l};this._autoCompleteOnRecovery&&(c.auto_complete_on_recovery=!0),e.trigger_config=c}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let l=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],c={entity_id:l[0],entity_ids:l,type:this._triggerType};if(this._triggerAttribute&&(c.attribute=this._triggerAttribute),this._autoCompleteOnRecovery&&(c.auto_complete_on_recovery=!0),l.length>1&&(c.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let d=parseFloat(this._triggerAbove);isNaN(d)||(c.trigger_above=d)}if(this._triggerBelow){let d=parseFloat(this._triggerBelow);isNaN(d)||(c.trigger_below=d)}if(this._triggerForMinutes){let d=parseInt(this._triggerForMinutes,10);isNaN(d)||(c.trigger_for_minutes=d)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let d=parseFloat(this._triggerTargetValue);isNaN(d)||(c.trigger_target_value=d)}c.trigger_delta_mode=this._triggerDeltaMode}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(c.trigger_from_state=this._triggerFromState),this._triggerToState&&(c.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let d=parseInt(this._triggerTargetChanges,10);isNaN(d)||(c.trigger_target_changes=d)}}else if(this._triggerType==="runtime"&&this._triggerRuntimeHours){let d=parseFloat(this._triggerRuntimeHours);isNaN(d)||(c.trigger_runtime_hours=d)}e.trigger_config=c}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let l=this._scheduleTime.trim();e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(l)?l:null}if(this.checklistsEnabled){let l=this._checklistText.split(`
`).map(c=>c.trim()).filter(Boolean).slice(0,100);e.checklist=l.length?l:null}if(this.completionActionsEnabled){let l=this._actionService.trim();if(l&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(l)){let g={service:l},m=this._actionTargetEntity.trim();m&&(g.target={entity_id:m});let v=this._buildActionData();Object.keys(v).length>0&&(g.data=v),e.on_complete_action=g}else e.on_complete_action=null;let c={};this._qcNotes.trim()&&(c.notes=this._qcNotes.trim());let d=parseFloat(this._qcCost);!isNaN(d)&&d>=0&&(c.cost=d);let _=parseInt(this._qcDuration,10);!isNaN(_)&&_>=0&&(c.duration=_),this._qcFeedback&&(c.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(c).length?c:null}let t=await this.hass.connection.sendMessagePromise(e),i=this._taskId||t?.task_id,a=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(i&&this._scheduleType==="sensor_based"&&a)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:i,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(e){this._error=I(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let e=this._lang,t=this._triggerType==="compound";return o`
      <h3>${s("trigger_configuration",e)}</h3>
      <div class="select-row">
        <label>${s("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${i=>this._triggerType=i.target.value}
        >
          ${os.map(i=>o`<option value=${i} ?selected=${i===this._triggerType}>${s(i,e)}</option>`)}
        </select>
      </div>
      ${t?this._renderCompoundEditor():o`
        <ms-textfield
          label="${s("entity_id",e)} (${s("comma_separated",e)})"
          .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
          @input=${i=>{let l=i.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=l[0]||"",this._triggerEntityIds=l,l[0]&&this._fetchEntityAttributes(l[0])}}
        ></ms-textfield>
        ${this._triggerEntityIds.length>1?o`
          <div class="select-row">
            <label>${s("entity_logic",e)}</label>
            <select
              .value=${this._triggerEntityLogic}
              @change=${i=>this._triggerEntityLogic=i.target.value}
            >
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${s("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${s("entity_logic_all",e)}</option>
            </select>
          </div>
        `:p}
        ${this._availableAttributes.length>0?o`
            <div class="select-row">
              <label>${s("attribute_optional",e)}</label>
              <select
                .value=${this._triggerAttribute}
                @change=${i=>this._triggerAttribute=i.target.value}
              >
                <option value="" ?selected=${!this._triggerAttribute}>${s("use_entity_state",e)}</option>
                ${this._suggestedAttributes.map(i=>o`<option value=${i} ?selected=${i===this._triggerAttribute}>${i} ★</option>`)}
                ${this._availableAttributes.filter(i=>!this._suggestedAttributes.includes(i.name)).map(i=>o`<option value=${i.name} ?selected=${i.name===this._triggerAttribute}>${i.name}${i.numeric?"":" (non-numeric)"}</option>`)}
              </select>
            </div>
          `:o`
            <ms-textfield
              label="${s("attribute_optional",e)}"
              .value=${this._triggerAttribute}
              @input=${i=>this._triggerAttribute=i.target.value}
            ></ms-textfield>
          `}
        ${this._renderTriggerTypeFields()}
      `}
      <label>
        <input
          type="checkbox"
          .checked=${this._autoCompleteOnRecovery}
          @change=${i=>this._autoCompleteOnRecovery=i.target.checked}
        />
        ${s("auto_complete_on_recovery",e)}
      </label>
      <div class="field-help">${s("auto_complete_on_recovery_help",e)}</div>
      <ms-textfield
        label="${s("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${i=>this._intervalDays=i.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():p}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((i,a)=>a===e?{...i,...t}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,ls()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,i)=>i!==e)}_renderCompoundEditor(){let e=this._lang;return o`
      <div class="select-row">
        <label>${s("compound_logic",e)}</label>
        <select
          .value=${this._compoundLogic}
          @change=${t=>this._compoundLogic=t.target.value}
        >
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${s("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${s("compound_logic_or",e)}</option>
        </select>
      </div>
      <div class="field-help">${s("compound_help",e)}</div>
      ${this._compoundConditions.length===0?o`<div class="field-help">${s("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,i)=>this._renderCondition(t,i))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let i=this._lang,a=t+1;return o`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${s("compound_condition",i)} ${a}</span>
          <button
            type="button"
            class="icon-btn"
            title="${s("compound_remove_condition",i)}"
            @click=${()=>this._removeCondition(t)}
          >✕</button>
        </div>
        <ms-textfield
          label="${s("entity_id",i)} (${s("comma_separated",i)})"
          .value=${e.entityIds}
          @input=${l=>this._patchCondition(t,{entityIds:l.target.value})}
        ></ms-textfield>
        <div class="select-row">
          <label>${s("trigger_type",i)}</label>
          <select
            .value=${e.type}
            @change=${l=>this._patchCondition(t,{type:l.target.value})}
          >
            ${si.map(l=>o`<option value=${l} ?selected=${l===e.type}>${s(l,i)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(e,t)}
      </div>
    `}_renderConditionTypeFields(e,t){let i=this._lang;return e.type==="threshold"?o`
        <ms-textfield label="${s("trigger_above",i)}" type="number" .value=${e.above}
          @input=${a=>this._patchCondition(t,{above:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_below",i)}" type="number" .value=${e.below}
          @input=${a=>this._patchCondition(t,{below:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",i)}" type="number" .value=${e.forMinutes}
          @input=${a=>this._patchCondition(t,{forMinutes:a.target.value})}></ms-textfield>
      `:e.type==="counter"?o`
        <ms-textfield label="${s("target_value",i)}" type="number" .value=${e.targetValue}
          @input=${a=>this._patchCondition(t,{targetValue:a.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${e.deltaMode}
            @change=${a=>this._patchCondition(t,{deltaMode:a.target.checked})} />
          ${s("delta_mode",i)}
        </label>
      `:e.type==="state_change"?o`
        <ms-textfield label="${s("from_state_optional",i)}" .value=${e.fromState}
          @input=${a=>this._patchCondition(t,{fromState:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("to_state_optional",i)}" .value=${e.toState}
          @input=${a=>this._patchCondition(t,{toState:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("target_changes",i)}" type="number" .value=${e.targetChanges}
          @input=${a=>this._patchCondition(t,{targetChanges:a.target.value})}></ms-textfield>
      `:e.type==="runtime"?o`
        <ms-textfield label="${s("runtime_hours",i)}" type="number" .value=${e.runtimeHours}
          @input=${a=>this._patchCondition(t,{runtimeHours:a.target.value})}></ms-textfield>
      `:p}_renderUnitSelect(){let e=this._lang;return o`
      <div class="select-row">
        <label>${s("interval_unit",e)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${t=>this._intervalUnit=t.target.value}
        >
          ${["days","weeks","months","years"].map(t=>o`<option value=${t} ?selected=${t===this._intervalUnit}>${s("unit_"+t,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_buildSchedule(){return this._scheduleType==="weekdays"?{kind:"weekdays",weekdays:[...this._weekdays].sort((e,t)=>e-t)}:this._scheduleType==="nth_weekday"?{kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)}:{kind:"day_of_month",day:parseInt(this._domDay,10)||1}}_renderCalendarFields(){let e=this._lang,t=ps(e);if(this._scheduleType==="weekdays")return o`
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
            ${i.map(([a,l])=>o`<option value=${a} ?selected=${a===this._nth}>${l}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",e)}</label>
          <select .value=${this._nthWeekday} @change=${a=>this._nthWeekday=a.target.value}>
            ${t.map((a,l)=>o`<option value=${String(l)} ?selected=${String(l)===this._nthWeekday}>${a}</option>`)}
          </select>
        </div>`}return this._scheduleType==="day_of_month"?o`
        <ms-textfield
          label="${s("recurrence_day",e)}"
          type="number"
          min="1"
          max="31"
          .value=${this._domDay}
          @input=${i=>this._domDay=i.target.value}
        ></ms-textfield>`:p}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?o`
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
      `:p}render(){if(!this._open)return o``;let e=this._lang,t=this._taskId?s("edit_task",e):s("new_task",e);return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:p}
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
          `:p}
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
              ${as.map(i=>o`<option value=${i} ?selected=${i===this._type}>${s(i,e)}</option>`)}
            </select>
          </div>
          <div class="select-row">
            <label>${s("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${i=>this._scheduleType=i.target.value}
            >
              ${rs.map(i=>o`<option value=${i} ?selected=${i===this._scheduleType}>${s(i,e)}</option>`)}
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
                `:p}
              `:p}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?o`
                <ms-textfield
                  label="${s("due_date",e)}"
                  type="date"
                  .value=${this._dueDate}
                  @input=${i=>this._dueDate=i.target.value}
                ></ms-textfield>
              `:p}
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
          `:p}
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
            `:p}
          `:p}
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
    `}};x.styles=A`
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
  `,u([y({attribute:!1})],x.prototype,"hass",2),u([y({type:Boolean,attribute:"checklists-enabled"})],x.prototype,"checklistsEnabled",2),u([y({type:Boolean,attribute:"schedule-time-enabled"})],x.prototype,"scheduleTimeEnabled",2),u([y({type:Boolean,attribute:"completion-actions-enabled"})],x.prototype,"completionActionsEnabled",2),u([y({type:Number,attribute:"default-warning-days"})],x.prototype,"defaultWarningDays",2),u([h()],x.prototype,"_open",2),u([h()],x.prototype,"_loading",2),u([h()],x.prototype,"_error",2),u([h()],x.prototype,"_entryId",2),u([h()],x.prototype,"_taskId",2),u([h()],x.prototype,"_objectChoices",2),u([h()],x.prototype,"_name",2),u([h()],x.prototype,"_type",2),u([h()],x.prototype,"_scheduleType",2),u([h()],x.prototype,"_intervalDays",2),u([h()],x.prototype,"_intervalUnit",2),u([h()],x.prototype,"_dueDate",2),u([h()],x.prototype,"_warningDays",2),u([h()],x.prototype,"_intervalAnchor",2),u([h()],x.prototype,"_weekdays",2),u([h()],x.prototype,"_nth",2),u([h()],x.prototype,"_nthWeekday",2),u([h()],x.prototype,"_domDay",2),u([h()],x.prototype,"_notes",2),u([h()],x.prototype,"_documentationUrl",2),u([h()],x.prototype,"_customIcon",2),u([h()],x.prototype,"_enabled",2),u([h()],x.prototype,"_triggerEntityId",2),u([h()],x.prototype,"_triggerEntityIds",2),u([h()],x.prototype,"_triggerEntityLogic",2),u([h()],x.prototype,"_triggerAttribute",2),u([h()],x.prototype,"_triggerType",2),u([h()],x.prototype,"_triggerAbove",2),u([h()],x.prototype,"_triggerBelow",2),u([h()],x.prototype,"_triggerForMinutes",2),u([h()],x.prototype,"_triggerTargetValue",2),u([h()],x.prototype,"_triggerDeltaMode",2),u([h()],x.prototype,"_autoCompleteOnRecovery",2),u([h()],x.prototype,"_triggerFromState",2),u([h()],x.prototype,"_triggerToState",2),u([h()],x.prototype,"_triggerTargetChanges",2),u([h()],x.prototype,"_triggerRuntimeHours",2),u([h()],x.prototype,"_compoundLogic",2),u([h()],x.prototype,"_compoundConditions",2),u([h()],x.prototype,"_suggestedAttributes",2),u([h()],x.prototype,"_availableAttributes",2),u([h()],x.prototype,"_entityDomain",2),u([h()],x.prototype,"_lastPerformed",2),u([h()],x.prototype,"_nfcTagId",2),u([h()],x.prototype,"_availableTags",2),u([h()],x.prototype,"_responsibleUserId",2),u([h()],x.prototype,"_availableUsers",2),u([h()],x.prototype,"_checklistText",2),u([h()],x.prototype,"_scheduleTime",2),u([h()],x.prototype,"_actionService",2),u([h()],x.prototype,"_actionTargetEntity",2),u([h()],x.prototype,"_actionData",2),u([h()],x.prototype,"_actionDataJsonFallback",2),u([h()],x.prototype,"_actionTesting",2),u([h()],x.prototype,"_actionTestResult",2),u([h()],x.prototype,"_actionTestError",2),u([h()],x.prototype,"_qcNotes",2),u([h()],x.prototype,"_qcCost",2),u([h()],x.prototype,"_qcDuration",2),u([h()],x.prototype,"_qcFeedback",2),u([h()],x.prototype,"_environmentalEntity",2),u([h()],x.prototype,"_environmentalAttribute",2);customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",x);var O=class extends T{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed"}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState={},this._feedback="needed")}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),await this.hass.connection.sendMessagePromise(e),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=I(e,this.lang,s("save_error",this.lang))}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return o``;let e=this.lang||this.hass?.language||"en";return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("complete_title",e)}${this.taskName}</div>
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:p}
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
          `:p}
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
          `:p}
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
    `}};O.styles=A`
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
  `,u([y({attribute:!1})],O.prototype,"hass",2),u([y()],O.prototype,"entryId",2),u([y()],O.prototype,"taskId",2),u([y()],O.prototype,"taskName",2),u([y()],O.prototype,"lang",2),u([y({type:Array})],O.prototype,"checklist",2),u([y({type:Boolean})],O.prototype,"adaptiveEnabled",2),u([h()],O.prototype,"_open",2),u([h()],O.prototype,"_notes",2),u([h()],O.prototype,"_cost",2),u([h()],O.prototype,"_duration",2),u([h()],O.prototype,"_loading",2),u([h()],O.prototype,"_error",2),u([h()],O.prototype,"_checklistState",2),u([h()],O.prototype,"_feedback",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",O);function ke(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ai(n){return!n.startsWith("data:image/svg+xml,")&&!n.startsWith("data:image/png;base64,")?"":ke(n)}function us(n){return n.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var X=class extends T{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(e,t,i,a){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=a,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...t,action:"view"})];this._taskId&&i.push(this.hass.connection.sendMessagePromise({...t,action:"complete"}));let a=await Promise.all(i);if(e!==this._generateSeq)return;this._viewResult=a[0],a.length>1&&(this._completeResult=a[1])}catch(t){if(e!==this._generateSeq)return;let i=t?.code,a=t?.message;this._error=i==="no_url"||typeof a=="string"&&a.includes("No Home Assistant URL")?s("qr_error_no_url",this.lang):s("qr_error",this.lang)}finally{e===this._generateSeq&&(this._loading=!1)}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),a=window.open("","_blank","width=600,height=500");if(!a)return;let l=this.lang||"en",c=ke(t),d=ke(i),_=!!this._completeResult,g=ke(s("qr_action_view",l)),m=ke(s("qr_action_complete",l));a.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
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
${d?`<div class="sub">${d}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${ai(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${g}</div>
  </div>
  ${_?`<div class="qr-col">
    <img src="${ai(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${m}</div>
  </div>`:""}
</div>
<div class="url">${ke(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),a.document.close()}_downloadSvg(e,t){let i=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),a=new Blob([i],{type:"image/svg+xml"}),l=URL.createObjectURL(a),c=document.createElement("a");c.href=l;let d=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;c.download=`qr-${us(d)}-${t}.svg`,c.click(),URL.revokeObjectURL(l)}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return o``;let e=this.lang||this.hass?.language||"en",t=this._taskName?`${s("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",e)}: ${this._objectName}`,i=!!this._viewResult;return o`
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
                          `:p}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:p}
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
    `}};X.styles=A`
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
  `,u([y({attribute:!1})],X.prototype,"hass",2),u([y()],X.prototype,"lang",2),u([h()],X.prototype,"_open",2),u([h()],X.prototype,"_loading",2),u([h()],X.prototype,"_error",2),u([h()],X.prototype,"_viewResult",2),u([h()],X.prototype,"_completeResult",2),u([h()],X.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",X);var ri=5;function qe(n){let r=n.getFullYear(),e=String(n.getMonth()+1).padStart(2,"0"),t=String(n.getDate()).padStart(2,"0");return`${r}-${e}-${t}`}function hs(n,r){let e=[];for(let t=0;t<r;t++){let i=new Date(n);i.setDate(i.getDate()+t),i.setHours(0,0,0,0),e.push(qe(i))}return e}function nt(n,r){let[e,t,i]=n.split("-").map(Number),a=new Date(e,t-1,i);return a.setDate(a.getDate()+r),qe(a)}function _s(n){if(!n||n.length===0)return null;let r=n.map(e=>e.cost).filter(e=>typeof e=="number");return r.length===0?null:r.reduce((e,t)=>e+t,0)/r.length}function gs(n){let{windowStart:r,windowEnd:e,task:t,entryId:i,objectName:a}=n,l=[],c=(m,v)=>({date:m,entry_id:i,task_id:t.id,task_name:t.name,object_name:a,status:v&&(t.status==="overdue"||t.status==="triggered")?"ok":t.status,days_until_due:v?null:t.days_until_due??null,projected:v,schedule_type:t.schedule_type,interval_days:t.interval_days??null,interval_unit:t.interval_unit??null,responsible_user_id:t.responsible_user_id??null,avg_cost:_s(t.history),adaptive_enabled:!!t.adaptive_config?.enabled,prediction_confidence:t.threshold_prediction_confidence??null}),d=Math.max(1,Math.round(At(t.interval_days,t.interval_unit)));if(t.status==="overdue"||t.status==="triggered"){if(l.push(c(r,!1)),t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let m=nt(r,d),v=1;for(;m<=e&&v<ri;)l.push(c(m,!0)),v++,m=nt(m,d)}return l}let _=t.next_due;if(typeof _!="string"||!_)return l;let g=_.slice(0,10);if(g>=r&&g<=e)l.push(c(g,!1));else if(g>e)return l;if(t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let m=nt(g,d),v=l.length;for(;m<=e&&v<ri;)m>=r&&(l.push(c(m,!0)),v++),m=nt(m,d)}return l}var ni={overdue:0,triggered:1,due_soon:2,ok:3};function oi(n,r,e,t=null){let i=hs(r,e),a=i[0],l=i[i.length-1],c=[];for(let _ of n){let g=_.object?.name||"",m=_.entry_id,v=_.tasks||[];for(let b of v){if(t&&b.responsible_user_id!==t||b.enabled===!1)continue;let w=gs({windowStart:a,windowEnd:l,task:b,entryId:m,objectName:g});c.push(...w)}}let d=new Map;for(let _ of i)d.set(_,[]);for(let _ of c){let g=d.get(_.date);g&&g.push(_)}for(let[,_]of d)_.sort((g,m)=>{let v=ni[g.status]??99,b=ni[m.status]??99;if(v!==b)return v-b;if(g.projected!==m.projected)return g.projected?1:-1;let w=g.object_name.localeCompare(m.object_name);return w!==0?w:g.task_name.localeCompare(m.task_name)});return i.map(_=>({date:_,events:d.get(_)??[]}))}var ms={completed:"ok",reset:"ok",skipped:"due_soon",triggered:"triggered",trigger_replaced:"triggered"};function vs(n,r){let e=[];for(let t=r-1;t>=0;t--){let i=new Date(n);i.setDate(i.getDate()-t),i.setHours(0,0,0,0),e.push(qe(i))}return e}function li(n,r,e,t=null){let i=vs(r,e),a=i[0],l=i[i.length-1],c=new Map;for(let _ of i)c.set(_,[]);for(let _ of n){let g=_.object?.name||"",m=_.entry_id,v=_.tasks||[];for(let b of v){if(t&&b.responsible_user_id!==t)continue;let w=b.history||[];for(let f of w){if(typeof f?.timestamp!="string")continue;let j=f.timestamp.slice(0,10);if(j<a||j>l)continue;let L=c.get(j);if(!L)continue;let H=f.type??"completed";L.push({date:j,entry_id:m,task_id:b.id,task_name:b.name,object_name:g,status:ms[H]??"ok",days_until_due:null,projected:!1,schedule_type:b.schedule_type,interval_days:b.interval_days??null,responsible_user_id:b.responsible_user_id??null,avg_cost:typeof f.cost=="number"?f.cost:null,adaptive_enabled:!!b.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:f.timestamp,history_type:H,history_cost:typeof f.cost=="number"?f.cost:null,history_notes:typeof f.notes=="string"?f.notes:null,history_duration:typeof f.duration=="number"?f.duration:null})}}}let d={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,_]of c)_.sort((g,m)=>{let v=d[g.history_type??""]??99,b=d[m.history_type??""]??99;if(v!==b)return v-b;let w=g.object_name.localeCompare(m.object_name);return w!==0?w:g.task_name.localeCompare(m.task_name)});return i.map(_=>({date:_,events:c.get(_)??[]}))}var ci=A`
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
`;var ee=class extends T{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._unsub=null;this._dataLoaded=!1;this._lastConnection=null}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(e){this._config={...e},e.past_days&&[30,90].includes(e.past_days)?this._pastDays=e.past_days:e.window_days&&[7,14,30,365].includes(e.window_days)&&(this._windowDays=e.window_days,this._pastDays=0),typeof e.user_filter=="string"&&(this._userFilter=e.user_filter)}getCardSize(){return 6}get _lang(){return this.hass?.language||"en"}disconnectedCallback(){if(super.disconnectedCallback(),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(e){super.updated(e);let t=this.hass?.language;if(t&&!Ze(t)&&se(t).then(()=>this.requestUpdate()),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=e.objects,this._stats=t}catch{}}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(e=>{let t=e;this._objects=t.objects},{type:"maintenance_supporter/subscribe"})}catch{}}_onEventClick(e){if(e.history_timestamp){this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:e.history_timestamp},bubbles:!0,composed:!0}));return}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0}))}render(){if(!this.hass)return p;let e=this._lang,t=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,a=this._config.title,l=null;this._userFilter&&(l=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let c=new Date;c.setHours(0,0,0,0);let d=this._pastDays>0,_=d?li(this._objects,c,this._pastDays,l):oi(this._objects,c,this._windowDays,l),g=qe(c),m=this._windowDays===365||d,v=m?_.filter(f=>f.events.length>0):_,b=f=>{let j=`cal-status-${f.status}`,L=f.projected?"cal-event-projected":"",H=f.status==="overdue"&&f.days_until_due!=null?` (${Math.abs(f.days_until_due)}d ${s("overdue",e).toLowerCase()})`:"",M=f.projected&&f.interval_days?o`<span class="cal-event-recur">${f.interval_unit&&f.interval_unit!=="days"?`${f.interval_days} ${s("unit_"+f.interval_unit,e)}`:s("cal_every_n_days",e).replace("{n}",String(f.interval_days))}</span>`:p,E=f.schedule_type==="sensor_based",W=E?o`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${s("cal_source_sensor",e)}" icon="mdi:trending-up"></ha-icon>`:o`<ha-icon class="cal-event-icon cal-source-time"
                title="${f.adaptive_enabled?s("cal_source_time_adaptive",e):s("cal_source_time",e)}"
                icon="${f.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,K=E&&f.prediction_confidence&&f.status!=="triggered"&&!f.projected?o`<span class="cal-event-prediction cal-conf-${f.prediction_confidence}">
            ${s("cal_predicted",e)} · ${s(`cal_confidence_${f.prediction_confidence}`,e)}
          </span>`:p,V=this._stats?.budget?.currency_symbol||"\u20AC",q=f.history_type?s(f.history_type,e):s(f.status,e);return o`
        <div class="cal-event ${L}"
          @click=${()=>this._onEventClick(f)}>
          ${W}
          <span class="cal-status-pill ${j}">${q}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${f.object_name} · ${f.task_name}${H}</div>
            ${K}
            ${M}
          </div>
          ${f.avg_cost!=null&&f.avg_cost>0?o`<span class="cal-event-cost">${f.avg_cost.toFixed(0)} ${V}</span>`:p}
        </div>
      `},w=f=>{let[j,L,H]=f.date.split("-").map(Number),M=new Date(j,L-1,H),E=f.date===g,W=M.toLocaleDateString(e,{weekday:"short"}),K=M.toLocaleDateString(e,{month:"long"});return o`
        <div class="cal-day-row">
          <div class="cal-day-pill ${E?"cal-today":""}">
            <span class="cal-pill-weekday">${W}</span>
            <span class="cal-pill-day">${M.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${K}</span>
              ${E?o`<span class="cal-day-today-badge">${s("today",e)}</span>`:p}
            </div>
            ${f.events.length===0?o`<div class="cal-empty">${s("cal_no_events",e)}</div>`:f.events.map(b)}
          </div>
        </div>
      `};return o`
      <ha-card .header=${a}>
        ${t||i?o`
              <div class="cal-controls">
                ${t?o`
                      <div class="cal-window-chips cal-past-chips" title="${s("cal_past_windows",e)||"Past windows"}">
                        ${[30,90].map(f=>o`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===f?"active":""}"
                            @click=${()=>{this._pastDays=f}}>
                            −${f}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${s("cal_forward_windows",e)||"Forward windows"}">
                        ${[7,14,30,365].map(f=>o`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===f?"active":""}"
                            @click=${()=>{this._windowDays=f,this._pastDays=0}}>
                            ${f===365?"+1y":`+${f}d`}
                          </button>
                        `)}
                      </div>
                    `:p}
                ${i?o`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${f=>{this._userFilter=f.target.value}}>
                        <option value="">${s("all_users",e)}</option>
                        <option value="current_user">${s("my_tasks",e)}</option>
                      </select>
                    `:p}
              </div>
            `:p}
        <div class="cal-rolling">
          ${v.length===0&&m?o`<div class="cal-empty">${s("cal_no_events",e)}</div>`:v.map(w)}
        </div>
      </ha-card>
    `}};ee.styles=[Xe,ci,A`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],u([y({attribute:!1})],ee.prototype,"hass",2),u([h()],ee.prototype,"_config",2),u([h()],ee.prototype,"_objects",2),u([h()],ee.prototype,"_stats",2),u([h()],ee.prototype,"_windowDays",2),u([h()],ee.prototype,"_pastDays",2),u([h()],ee.prototype,"_userFilter",2),u([h()],ee.prototype,"_unsub",2);var fs=[{value:7,label:"Week (7 days)"},{value:14,label:"Fortnight (14 days)"},{value:30,label:"Month (30 days, default)"},{value:365,label:"Year (365 days, empty days collapsed)"}],Ee=class extends T{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}setConfig(e){this._config={...e}}_valueChanged(e,t){let i={...this._config,[e]:t};e==="show_window_chips"&&t===!0&&delete i.show_window_chips,e==="show_user_filter"&&t===!0&&delete i.show_user_filter,e==="title"&&(!t||typeof t=="string"&&t.trim()==="")&&delete i.title,e==="user_filter"&&t===""&&delete i.user_filter,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let e=this._config.window_days??30,t=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,a=this._config.user_filter??"",l=this._config.title??"";return o`
      <div class="editor">
        <div class="row">
          <label for="title">Title (optional)</label>
          <input
            id="title"
            type="text"
            .value=${l}
            @input=${c=>this._valueChanged("title",c.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">Default window</label>
          <select
            id="window"
            @change=${c=>this._valueChanged("window_days",Number(c.target.value))}
          >
            ${fs.map(c=>o`<option value="${c.value}" ?selected=${c.value===e}>${c.label}</option>`)}
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
    `}};Ee.styles=A`
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
  `,u([y({attribute:!1})],Ee.prototype,"hass",2),u([h()],Ee.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",ee);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",Ee);var ot=window;ot.customCards=ot.customCards||[];var di="maintenance-supporter-calendar-card",bs=ot.customCards.some(n=>n.type===di);bs||ot.customCards.push({type:di,name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var le=class extends T{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null}get _lang(){return this.hass?.language||"en"}openEdit(e){this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let e={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(e.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(e.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(e.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(e.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(e.completed_by=this._draft.completed_by),Object.keys(e).filter(i=>!["type","entry_id","task_id","original_timestamp"].includes(i)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(e),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=I(e,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return p;let e=this._lang,t=this._draft;return o`
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
        ${this._error?o`<div class="error">${this._error}</div>`:p}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${s("cancel",e)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?s("saving",e)||"Saving\u2026":s("save",e)||"Save"}
          </button>
        </div>
      </div>
    `}};le.styles=A`
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
  `,u([y({attribute:!1})],le.prototype,"hass",2),u([h()],le.prototype,"_open",2),u([h()],le.prototype,"_saving",2),u([h()],le.prototype,"_error",2),u([h()],le.prototype,"_draft",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",le);var Q=class extends T{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel="",this._inputType="",this._inputValue="",this._open=!0,new Promise(t=>{this._resolve=t,this._promptResolve=null})}prompt(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"text",this._inputValue=e.inputValue||"",this._open=!0,new Promise(t=>{this._promptResolve=t,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return p;let e=this.hass?.language||"en";return o`
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
          `:p}
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
    `}};Q.styles=A`
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
  `,u([y({attribute:!1})],Q.prototype,"hass",2),u([h()],Q.prototype,"_open",2),u([h()],Q.prototype,"_title",2),u([h()],Q.prototype,"_message",2),u([h()],Q.prototype,"_confirmText",2),u([h()],Q.prototype,"_danger",2),u([h()],Q.prototype,"_inputLabel",2),u([h()],Q.prototype,"_inputType",2),u([h()],Q.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",Q);var pi={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ui=n=>(...r)=>({_$litDirective$:n,values:r}),lt=class{constructor(r){}get _$AU(){return this._$AM._$AU}_$AT(r,e,t){this._$Ct=r,this._$AM=e,this._$Ci=t}_$AS(r,e){return this.update(r,e)}update(r,e){return this.render(...e)}};var Oe=class extends lt{constructor(r){if(super(r),this.it=p,r.type!==pi.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(r){if(r===p||r==null)return this._t=void 0,this.it=r;if(r===oe)return r;if(typeof r!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(r===this.it)return this._t;this.it=r;let e=[r];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};Oe.directiveName="unsafeHTML",Oe.resultType=1;var hi=ui(Oe);var ys=["EUR","USD","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","CZK","PLN","RUB","SEK","NOK","DKK","UAH"],C=class extends T{constructor(){super(...arguments);this.budget=null;this._settings=null;this._loading=!0;this._importCsv="";this._importLoading=!1;this._includeHistory=!0;this._toast="";this._testingNotification=!1;this._users=[];this._vacEnabled=!1;this._vacStart="";this._vacEnd="";this._vacBuffer=3;this._vacExempt=new Set;this._vacIsActive=!1;this._vacWindowEnd=null;this._vacAllTasks=[];this._vacPreview=[];this._vacPreviewLoading=!1;this._vacSaving=!1;this._qrObjects=[];this._qrSelectedEntries=new Set;this._qrActions=new Set(["view"]);this._qrUrlMode="companion";this._qrBatchLoading=!1;this._qrBatchResults=[];this._qrObjectsLoaded=!1;this._loaded=!1;this._userService=null;this._sendTestNotification=async()=>{this._testingNotification=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/test_notification"}),t=e.message||(e.success?s("test_notification_success",this._lang):s("test_notification_failed",this._lang));this._showToast(t)}catch{this._showToast(s("test_notification_failed",this._lang))}finally{this._testingNotification=!1}}}get _lang(){return this.hass?.language||"en"}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._loaded?(this._loaded=!0,this._userService=new he(this.hass),this._loadSettings(),this._loadUsers()):e.has("hass")&&this.hass&&this._userService&&this._userService.updateHass(this.hass)}async _loadUsers(){if(this._userService)try{this._users=await this._userService.getUsers()}catch{this._users=[]}}async _loadSettings(){this._loading=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});this._settings=e,this._hydrateVacationFromSettings()}catch{}this._loading=!1}_hydrateVacationFromSettings(){let e=this._settings?.vacation;e&&(this._vacEnabled=e.enabled,this._vacStart=e.start||"",this._vacEnd=e.end||"",this._vacBuffer=e.buffer_days,this._vacExempt=new Set(e.exempt_task_ids||[]),this._vacIsActive=e.is_active,this._vacWindowEnd=e.window_end)}async _updateSetting(e,t){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/update",settings:{[e]:t}});this._settings=i,this._showToast(s("settings_saved",this._lang)),this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(s("action_error",this._lang))}}_showToast(e){this._toast=e,setTimeout(()=>{this._toast=""},3e3)}_downloadFile(e,t,i){it(e,t,i)}render(){let e=this._lang;return this._loading||!this._settings?o`<div class="settings-loading">Loading…</div>`:o`
      ${this._renderFeatures(e)}
      ${this._renderPanelAccess(e)}
      ${this._renderGeneral(e)}
      ${this._renderObjectsColumns(e)}
      ${this._settings.general.notifications_enabled?this._renderNotifications(e):p}
      ${this.features.budget?this._renderBudget(e):p}
      ${this._renderArchive(e)}
      ${this._renderVacation(e)}
      ${this._renderPrintQr(e)}
      ${this._renderImportExport(e)}
      ${this._toast?o`<div class="settings-toast">${this._toast}</div>`:p}
    `}scrollToSection(e){requestAnimationFrame(()=>{let t=this.shadowRoot;if(!t)return;let i=t.querySelector(`[data-section="${e}"]`)??t.querySelector(`[data-section-alt="${e}"]`);i&&i.scrollIntoView({behavior:"smooth",block:"start"})})}_renderPanelAccess(e){let t=new Set(this._settings.admin_panel_user_ids||[]),i=this._users.filter(c=>!c.is_admin),a=this._settings.operator_write_enabled??!1,l=(c,d)=>{let _=new Set(t);d?_.add(c):_.delete(c),this._updateSetting("admin_panel_user_ids",[..._])};return o`
      <div class="settings-section">
        <h3>${s("settings_panel_access",e)} ${a&&t.size>0?o`<span class="section-badge">${t.size}</span>`:p}</h3>
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
                  @change=${d=>l(c.id,d.target.checked)} />
              </label>
            `):p}
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
              @change=${l=>this._updateSetting(a.settingKey,l.target.checked)} />
          </label>
        `)}
      </div>
    `}_renderObjectsColumns(e){let t=De(this._settings.objects_table_columns);return o`
      <div class="settings-section" data-section="objects_table_columns">
        <h3>${s("objects_table_columns_label",e)}</h3>
        <p class="section-desc">${s("objects_table_columns_hint",e)}</p>
        ${we.map(i=>o`
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
    `}_toggleColumn(e,t){let i=new Set(De(this._settings.objects_table_columns));t?i.add(e):i.delete(e);let a=we.filter(l=>l.required||i.has(l.key)).map(l=>l.key);this._updateSetting("objects_table_columns",a)}_renderGeneral(e){let t=this._settings.general,i=new Set;for(let c of Object.keys(this.hass?.services?.notify??{}))c!=="send_message"&&i.add(`notify.${c}`);for(let c of Object.keys(this.hass?.states??{}))c.startsWith("notify.")&&c!=="notify.send_message"&&i.add(c);let a=[...i].sort(),l=this._settings.budget;return o`
      <div class="settings-section">
        <h3>${s("settings_general",e)}</h3>
        <label class="setting-row">
          <span class="setting-label">${s("settings_default_warning",e)}</span>
          <input type="number" min="1" max="365" .value=${String(t.default_warning_days)}
            @change=${c=>{let d=parseInt(c.target.value,10);d>=1&&d<=365&&this._updateSetting("default_warning_days",d)}} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_currency",e)}</span>
          <select @change=${c=>this._updateSetting("budget_currency",c.target.value)}>
            ${ys.map(c=>o`<option value=${c} ?selected=${l.currency===c}>${c}</option>`)}
          </select>
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_panel_enabled",e)}</span>
          <input type="checkbox" .checked=${t.panel_enabled}
            @change=${c=>this._updateSetting("panel_enabled",c.target.checked)} />
        </label>
        ${t.panel_enabled?o`
          <label class="setting-row">
            <span class="setting-label">${s("settings_panel_title",e)}</span>
            <input type="text" .value=${t.panel_title??""}
              placeholder="Maintenance"
              maxlength="50"
              @change=${c=>this._updateSetting("panel_title",c.target.value.trim())} />
          </label>
        `:""}
        <label class="setting-row">
          <span class="setting-label">${s("settings_notifications",e)}</span>
          <input type="checkbox" .checked=${t.notifications_enabled}
            @change=${c=>this._updateSetting("notifications_enabled",c.target.checked)} />
        </label>
        ${t.notifications_enabled?o`
          <label class="setting-row">
            <span class="setting-label">${s("settings_notify_service",e)}</span>
            <input type="text" list="ms-notify-services" .value=${t.notify_service}
              @change=${c=>this._updateSetting("notify_service",c.target.value.trim())} />
            <datalist id="ms-notify-services">
              ${a.map(c=>o`<option value=${c}></option>`)}
            </datalist>
          </label>
          <div class="setting-row">
            <span class="setting-label">${s("test_notification",e)}</span>
            <button class="ha-button secondary"
              ?disabled=${!t.notify_service||this._testingNotification}
              @click=${this._sendTestNotification}>
              ${this._testingNotification?s("testing",e):s("send_test",e)}
            </button>
          </div>
        `:p}
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
        `:p}

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
        `:p}

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
        `:p}

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
        `:p}

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
        `:p}

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
        `:p}
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
        `:p}
      </div>
    `}_renderArchive(e){let t=this._settings.archive??{oneoff_days:14,delete_archived_oneoff_days:0};return o`
      <div class="settings-section" data-section="archive">
        <h3>${s("settings_archive",e)}</h3>
        <p class="section-desc">${s("settings_archive_desc",e)}</p>
        <label class="setting-row">
          <span class="setting-label">${s("settings_archive_oneoff_days",e)}</span>
          <input type="number" min="0" max="3650" step="1" .value=${String(t.oneoff_days)}
            @change=${i=>this._updateSetting("archive_oneoff_days",parseInt(i.target.value,10)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_delete_archived_oneoff_days",e)}</span>
          <input type="number" min="0" max="3650" step="1" .value=${String(t.delete_archived_oneoff_days)}
            @change=${i=>this._updateSetting("delete_archived_oneoff_days",parseInt(i.target.value,10)||0)} />
        </label>
      </div>
    `}_renderVacation(e){let t=this._vacEnabled&&!this._vacIsActive&&this._vacWindowEnd&&new Date(this._vacWindowEnd)<new Date,i=this._vacExempt.size;return o`
      <div class="settings-section vacation-section" data-section="vacation">
        <h3>
          ${s("vacation_title",e)}
          ${this._vacIsActive?o`<span class="vac-badge active">${s("vacation_active",e)}</span>`:p}
          ${t?o`<span class="vac-badge stale">${s("vacation_ended",e)}</span>`:p}
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
            ${i>0?o`<span class="section-badge">${i}</span>`:p}
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
            ${this._vacPreview.length>0?o`<span class="vac-preview-count">${this._vacPreview.length} ${s("vacation_preview_affected",e)}</span>`:p}
          </div>
          ${this._vacPreview.length>0?this._renderVacationPreview(e):p}
        `:p}

        ${this._vacIsActive||t?o`<button class="vac-end-now" @click=${this._endVacationNow}>
              ${s("vacation_end_now",e)}
            </button>`:p}
      </div>
    `}_renderVacationTaskList(e){let t=new Map;for(let a of this._vacAllTasks){let l=t.get(a.object_name)||[];l.push(a),t.set(a.object_name,l)}return[...t.entries()].sort(([a],[l])=>a.localeCompare(l)).map(([a,l])=>o`
      <div class="vac-task-group">
        <div class="vac-task-group-name">${a||s("no_objects",e)}</div>
        ${l.sort((c,d)=>c.task_name.localeCompare(d.task_name)).map(c=>o`
            <label class="vac-task-row">
              <input type="checkbox"
                .checked=${this._vacExempt.has(c.task_id)}
                @change=${d=>this._toggleVacationExempt(c.task_id,d.target.checked)} />
              <span>${c.task_name}</span>
            </label>
          `)}
      </div>
    `)}_renderVacationPreview(e){return o`
      <div class="vac-preview-list">
        ${this._vacPreview.map(t=>{let i=t.events.map(l=>{let c=`vacation_event_${l.status}`;return`${l.date} (${s(c,e)})`}).join(" \xB7 "),a=!t.will_suppress;return o`
            <div class="vac-preview-row ${a?"exempt":""}">
              <div class="vac-preview-info">
                <div class="vac-preview-name">
                  <strong>${t.object_name}</strong> · ${t.task_name}
                  ${t.kind==="sensor_based"?o`<span class="vac-preview-kind">${s("vacation_sensor_based",e)}</span>`:p}
                </div>
                <div class="vac-preview-events">${i}</div>
              </div>
              <div class="vac-preview-actions">
                <button @click=${()=>this._previewActionComplete(t)}>${s("qr_action_complete",e)}</button>
                ${t.kind==="time_based"?o`<button @click=${()=>this._previewActionSkip(t)}>${s("qr_action_skip",e)}</button>`:p}
                <button class=${a?"vac-notify-on":""}
                  @click=${()=>this._toggleVacationExempt(t.task_id,!a)}>
                  ${a?s("vacation_action_unsilence",e):s("vacation_action_notify",e)}
                </button>
              </div>
            </div>
          `})}
      </div>
    `}async _loadAllTasksForVacation(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),t=[];for(let i of e.objects||[])for(let a of i.tasks||[])t.push({entry_id:i.entry_id,object_name:i.object.name||"",task_id:a.id,task_name:a.name||""});this._vacAllTasks=t}catch{this._showToast(s("action_error",this._lang))}}async _saveVacation(e){if(!this._vacSaving){this._vacSaving=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/update",...e});this._vacEnabled=t.enabled,this._vacStart=t.start||"",this._vacEnd=t.end||"",this._vacBuffer=t.buffer_days,this._vacExempt=new Set(t.exempt_task_ids||[]),this._vacIsActive=t.is_active,this._vacWindowEnd=t.window_end,this.dispatchEvent(new CustomEvent("settings-changed"))}catch(t){let i=t?.message||s("action_error",this._lang);this._showToast(i)}finally{this._vacSaving=!1}}}_toggleVacationEnabled(e){this._saveVacation({enabled:e})}_setVacationDate(e,t){let i={};i[e]=t||null,this._saveVacation(i)}_setVacationBuffer(e){e<0||e>14||this._saveVacation({buffer_days:e})}_toggleVacationExempt(e,t){let i=new Set(this._vacExempt);t?i.add(e):i.delete(e),this._saveVacation({exempt_task_ids:[...i]})}async _loadVacationPreview(){this._vacPreviewLoading=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/preview"});this._vacPreview=e.rows||[]}catch{this._showToast(s("action_error",this._lang))}finally{this._vacPreviewLoading=!1}}async _previewActionComplete(e){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/complete",entry_id:e.entry_id,task_id:e.task_id}),this._showToast(s("vacation_marked_complete",this._lang)),await this._loadVacationPreview()}catch{this._showToast(s("action_error",this._lang))}}async _previewActionSkip(e){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/skip",entry_id:e.entry_id,task_id:e.task_id,reason:"Skipped before vacation"}),this._showToast(s("vacation_marked_skip",this._lang)),await this._loadVacationPreview()}catch{this._showToast(s("action_error",this._lang))}}async _endVacationNow(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/end_now"});this._vacEnabled=e.enabled,this._vacEnd=e.end||"",this._vacIsActive=e.is_active,this._vacWindowEnd=e.window_end,this.dispatchEvent(new CustomEvent("settings-changed")),this._showToast(s("vacation_ended",this._lang))}catch{this._showToast(s("action_error",this._lang))}}_renderPrintQr(e){let t=this._qrSelectedEntries.size||this._qrObjects.length,i=this._qrActions.size,a=t*i,l=a>200;return o`
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
                          @change=${d=>this._toggleQrObject(c.entry_id,d.target.checked)} />
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
                        @change=${d=>this._toggleQrAction(c,d.target.checked)} />
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
                <div class="qr-estimate ${l?"error":""}">
                  ${s("qr_print_estimate",e)}: <strong>${a}</strong>
                  ${l?o` — ${s("qr_print_over_limit",e)}`:p}
                </div>
                <button
                  ?disabled=${this._qrBatchLoading||l||i===0}
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
                      <div class="qr-svg">${hi(c.svg)}</div>
                      <div class="qr-label">
                        <div class="qr-label-obj">${c.object_name}</div>
                        <div class="qr-label-task">${c.task_name}</div>
                        <div class="qr-label-action">${s("qr_action_"+c.action,e)}</div>
                      </div>
                    </div>
                  `)}
                </div>
              `:p}
          `:o`<button @click=${this._loadQrObjects}>${s("qr_print_load",e)}</button>`}
      </div>
    `}async _loadQrObjects(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._qrObjects=(e.objects||[]).map(t=>({entry_id:t.entry_id,name:t.object.name,task_count:(t.tasks||[]).length})).sort((t,i)=>t.name.localeCompare(i.name)),this._qrObjectsLoaded=!0}catch{this._showToast(s("action_error",this._lang))}}_toggleQrObject(e,t){let i=new Set(this._qrSelectedEntries);if(i.size===0)for(let a of this._qrObjects)i.add(a.entry_id);t?i.add(e):i.delete(e),i.size===this._qrObjects.length&&i.clear(),this._qrSelectedEntries=i}_toggleQrAction(e,t){let i=new Set(this._qrActions);t?i.add(e):i.delete(e),this._qrActions=i}async _generateBatch(){this._qrBatchLoading=!0,this._qrBatchResults=[];try{let e={type:"maintenance_supporter/qr/batch_generate",actions:[...this._qrActions],url_mode:this._qrUrlMode};this._qrSelectedEntries.size>0&&(e.entry_ids=[...this._qrSelectedEntries]);let t=await this.hass.connection.sendMessagePromise(e);this._qrBatchResults=t.qrs||[],this._qrBatchResults.length===0&&this._showToast(s("qr_print_empty",this._lang))}catch(e){let t=e?.message||s("action_error",this._lang);this._showToast(t)}finally{this._qrBatchLoading=!1}}_printQrs(){if(this._qrBatchResults.length===0)return;let e=this._lang,t=this._qrBatchResults.map(c=>{let d=s("qr_action_"+c.action,e);return`
        <div class="cell">
          <div class="qr">${c.svg}</div>
          <div class="label">
            <div class="obj">${this._escapeHtml(c.object_name)}</div>
            <div class="task">${this._escapeHtml(c.task_name)}</div>
            <div class="action">${this._escapeHtml(d)}</div>
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
</html>`,l=window.open("","_blank","width=900,height=1100");if(!l){window.print();return}l.document.open(),l.document.write(a),l.document.close()}_escapeHtml(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}_renderImportExport(e){return o`
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
    `}async _exportJson(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/export",format:"json",include_history:this._includeHistory}),t=new Date().toISOString().slice(0,10);this._downloadFile(e.data,`maintenance_export_${t}.json`,"application/json"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _exportYaml(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/export",format:"yaml",include_history:this._includeHistory}),t=new Date().toISOString().slice(0,10);this._downloadFile(e.data,`maintenance_export_${t}.yaml`,"application/yaml"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _exportCsv(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/export"}),t=new Date().toISOString().slice(0,10);this._downloadFile(e.csv,`maintenance_export_${t}.csv`,"text/csv"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _importCsvAction(){let e=this._importCsv.trim();if(e){this._importLoading=!0;try{let t=e.startsWith("object_name"),a=(await this.hass.connection.sendMessagePromise(t?{type:"maintenance_supporter/csv/import",csv_content:e}:{type:"maintenance_supporter/json/import",json_content:e})).created??0;this._showToast(s("settings_import_success",this._lang).replace("{count}",String(a))),this._importCsv="",this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(s("action_error",this._lang))}this._importLoading=!1}}};C.styles=A`
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
  `,u([y({attribute:!1})],C.prototype,"hass",2),u([y({attribute:!1})],C.prototype,"features",2),u([y({attribute:!1})],C.prototype,"budget",2),u([h()],C.prototype,"_settings",2),u([h()],C.prototype,"_loading",2),u([h()],C.prototype,"_importCsv",2),u([h()],C.prototype,"_importLoading",2),u([h()],C.prototype,"_includeHistory",2),u([h()],C.prototype,"_toast",2),u([h()],C.prototype,"_testingNotification",2),u([h()],C.prototype,"_users",2),u([h()],C.prototype,"_vacEnabled",2),u([h()],C.prototype,"_vacStart",2),u([h()],C.prototype,"_vacEnd",2),u([h()],C.prototype,"_vacBuffer",2),u([h()],C.prototype,"_vacExempt",2),u([h()],C.prototype,"_vacIsActive",2),u([h()],C.prototype,"_vacWindowEnd",2),u([h()],C.prototype,"_vacAllTasks",2),u([h()],C.prototype,"_vacPreview",2),u([h()],C.prototype,"_vacPreviewLoading",2),u([h()],C.prototype,"_vacSaving",2),u([h()],C.prototype,"_qrObjects",2),u([h()],C.prototype,"_qrSelectedEntries",2),u([h()],C.prototype,"_qrActions",2),u([h()],C.prototype,"_qrUrlMode",2),u([h()],C.prototype,"_qrBatchLoading",2),u([h()],C.prototype,"_qrBatchResults",2),u([h()],C.prototype,"_qrObjectsLoaded",2);customElements.define("maintenance-settings-view",C);var Z=class extends T{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0}get _lang(){return this.hass?.language||"en"}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),se(this._lang).then(()=>this.requestUpdate()))}async _load(){this._busy=!0;try{this._summary=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/storage"}),this._error=""}catch(e){this._error=I(e,this._lang)}finally{this._loaded=!0,this._busy=!1}}_nameFor(e){return this.objects.find(i=>i.object?.id===e)?.object?.name||e.slice(0,8)}_entryFor(e){return this.objects.find(t=>t.object?.id===e)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(e){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:e},bubbles:!0,composed:!0}))}_onSearch(e){this._query=e.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let e=this._query.trim();if(!e){this._results=[];return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/search",query:e});this._results=t.results||[]}catch(t){this._error=I(t,this._lang),this._results=[]}}async _openResult(e){if(e.kind==="weblink"){window.open(e.url,"_blank","noopener");return}let t=window.open("about:blank","_blank");try{let i=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${e.id}`,expires:300});t&&(t.location.href=new URL(i.path,window.location.origin).href)}catch(i){t&&t.close(),this._error=I(i,this._lang)}}_renderResult(e,t){return o`
      <div class="obj-row result-row" title=${s("doc_open",t)} @click=${()=>this._openResult(e)}>
        <ha-icon icon=${e.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${e.title||e.filename||e.url}</div>
          <div class="result-obj">${e.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${e.kind==="weblink"?"mdi:open-in-new":"mdi:eye-outline"}></ha-icon>
      </div>
    `}render(){if(!this._loaded||!this._summary)return p;let e=this._summary;if(e.document_count===0)return p;let t=this._lang,i=Object.entries(e.by_object).filter(([,a])=>a.files>0||a.links>0).map(([a,l])=>({id:a,name:this._nameFor(a),entry:this._entryFor(a),...l})).sort((a,l)=>l.bytes-a.bytes);return o`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <button
              class="toggle"
              @click=${this._toggle}
              aria-expanded=${this._expanded?"true":"false"}
              aria-label=${s("doc_storage_title",t)}
            >
              <ha-icon class="chevron" icon=${this._expanded?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
              <span class="emoji">🗄️</span>
              <span class="title-text">${s("doc_storage_title",t)}</span>
              <span class="header-summary">
                ${ae(e.total_bytes)}
                ${e.dedup_savings_bytes>0?o`<span class="saved">−${ae(e.dedup_savings_bytes)}</span>`:p}
              </span>
            </button>
            <button
              class="icon-btn"
              title=${s("doc_storage_refresh",t)}
              ?disabled=${this._busy}
              @click=${this._load}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
          </div>

          ${this._expanded?o`
                <div class="body">
                  <div class="totals">
                    <div class="stat">
                      <div class="stat-value">${ae(e.total_bytes)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${e.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${e.link_count}
                      </div>
                    </div>
                    ${e.dedup_savings_bytes>0?o`<div class="stat">
                          <div class="stat-value saved">−${ae(e.dedup_savings_bytes)}</div>
                          <div class="stat-label">${s("doc_storage_saved",t)}</div>
                        </div>`:p}
                  </div>

                  <div class="doc-search">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <input
                      type="search"
                      aria-label=${s("doc_search",t)}
                      placeholder=${s("doc_search",t)}
                      .value=${this._query}
                      @input=${this._onSearch}
                    />
                  </div>

                  ${this._error?o`<div class="error">${this._error}</div>`:p}

                  ${this._query.trim()?this._results.length?o`<div class="obj-list">${this._results.map(a=>this._renderResult(a,t))}</div>`:o`<div class="search-empty">${s("doc_search_none",t)}</div>`:i.length?o`<div class="obj-list">${i.map(a=>this._renderObjRow(a,t))}</div>`:p}
                </div>
              `:p}
        </div>
      </ha-card>
    `}_renderObjRow(e,t){let i=e.entry;return o`
      <div
        class="obj-row ${i?"clickable":""}"
        role=${i?"button":p}
        tabindex=${i?"0":p}
        aria-label=${i?e.name:p}
        @click=${i?()=>this._openObject(i):void 0}
        @keydown=${i?a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),this._openObject(i))}:void 0}
      >
        <span class="obj-name">${e.name}</span>
        <span class="obj-meta">
          ${e.files>0?o`<ha-icon icon="mdi:file-document-outline"></ha-icon>${e.files}`:p}
          ${e.links>0?o`<ha-icon icon="mdi:link-variant"></ha-icon>${e.links}`:p}
        </span>
        <span class="obj-size">${ae(e.bytes)}</span>
        ${i?o`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:p}
      </div>
    `}};Z.styles=A`
    ha-card { margin-top: 16px; }
    .card-content { padding: 16px; }
    .doc-search {
      display: flex; align-items: center; gap: 6px; margin: 10px 0 4px;
      padding: 2px 10px; border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      border: 1px solid var(--divider-color);
    }
    .doc-search ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color, #888); }
    .doc-search input {
      flex: 1; border: none; background: transparent; font: inherit; outline: none;
      color: var(--primary-text-color); padding: 6px 0;
    }
    .result-row { cursor: pointer; }
    .result-row > ha-icon { color: var(--primary-color); --mdc-icon-size: 20px; flex: none; }
    .result-info { flex: 1; min-width: 0; }
    .result-title { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .result-obj { font-size: 12px; color: var(--secondary-text-color, #888); }
    .result-open { color: var(--secondary-text-color, #888); --mdc-icon-size: 18px; flex: none; }
    .search-empty { color: var(--secondary-text-color, #888); font-size: 13px; padding: 8px 2px; }
    .header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .toggle {
      display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;
      background: none; border: none; padding: 4px 0; margin: 0; cursor: pointer;
      font: inherit; color: var(--primary-text-color); text-align: left;
    }
    .toggle:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; border-radius: 6px; }
    .chevron { --mdc-icon-size: 22px; color: var(--secondary-text-color, #888); flex: none; }
    .title-text { font-size: 16px; font-weight: 500; }
    .header-summary {
      margin-left: auto; display: flex; align-items: center; gap: 8px;
      font-size: 14px; font-weight: 600; white-space: nowrap;
    }
    .header-summary .saved { color: var(--success-color, #4caf50); font-weight: 500; }
    .emoji { font-size: 18px; }
    .body { margin-top: 4px; }
    .totals { display: flex; gap: 24px; margin: 12px 0 8px; flex-wrap: wrap; }
    .stat-value { font-size: 22px; font-weight: 600; }
    .stat-value.saved { color: var(--success-color, #4caf50); }
    .stat-label {
      font-size: 12px; color: var(--secondary-text-color, #888);
      display: flex; align-items: center; gap: 4px;
    }
    .stat-label ha-icon { --mdc-icon-size: 15px; }
    .obj-list { display: flex; flex-direction: column; gap: 2px; margin-top: 8px; }
    .obj-row {
      display: flex; align-items: center; gap: 10px;
      padding: 6px 8px; border-radius: 6px;
    }
    .obj-row:nth-child(odd) { background: var(--secondary-background-color, rgba(0,0,0,0.04)); }
    .obj-row.clickable { cursor: pointer; }
    .obj-row.clickable:hover { background: var(--secondary-background-color, rgba(0,0,0,0.10)); }
    .obj-row.clickable:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    .obj-go { --mdc-icon-size: 18px; color: var(--secondary-text-color, #888); flex: none; }
    .obj-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
    .obj-meta {
      display: flex; align-items: center; gap: 4px;
      color: var(--secondary-text-color, #888); font-size: 13px;
    }
    .obj-meta ha-icon { --mdc-icon-size: 15px; }
    .obj-size { font-variant-numeric: tabular-nums; font-size: 13px; min-width: 64px; text-align: right; }
    .icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 8px; cursor: pointer;
      background: transparent; border: none; color: var(--primary-text-color);
    }
    .icon-btn:hover { background: var(--secondary-background-color, rgba(0,0,0,0.06)); }
    .icon-btn[disabled] { opacity: 0.4; pointer-events: none; }
    .error { color: var(--error-color, #f44336); font-size: 13px; margin-top: 6px; }
  `,u([y({attribute:!1})],Z.prototype,"hass",2),u([y({attribute:!1})],Z.prototype,"objects",2),u([h()],Z.prototype,"_summary",2),u([h()],Z.prototype,"_loaded",2),u([h()],Z.prototype,"_busy",2),u([h()],Z.prototype,"_error",2),u([h()],Z.prototype,"_query",2),u([h()],Z.prototype,"_results",2),u([h()],Z.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",Z);var xs=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],te=class extends T{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let e=this._buildOverrides();if(e!==null){this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:e}),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(t){this._error=I(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}};this._clearAll=async()=>{this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:{}}),this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(e){this._error=I(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}open(e,t,i){if(this._entryId=e,this._taskId=t,this._values=new Array(12).fill(""),i)for(let[a,l]of Object.entries(i)){let c=parseInt(a,10);c>=1&&c<=12&&typeof l=="number"&&(this._values[c-1]=l.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let e={};for(let t=0;t<12;t++){let i=this._values[t].trim();if(!i)continue;let a=parseFloat(i);if(Number.isNaN(a))return this._error=`${s("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][t],this._lang)}: ${s("seasonal_override_invalid",this._lang)}`,null;if(a<.1||a>5)return this._error=s("seasonal_override_range",this._lang),null;e[t+1]=a}return e}render(){if(!this._open)return o``;let e=this._lang;return o`
      <ha-dialog open @closed=${this._close} heading="${s("seasonal_overrides_title",e)}">
        <div class="content">
          <p class="hint">${s("seasonal_overrides_hint",e)}</p>
          ${this._error?o`<div class="error">${this._error}</div>`:p}
          <div class="months">
            ${xs.map((t,i)=>o`
              <label class="month">
                <span class="mn">${s(t,e)}</span>
                <input type="number" step="0.1" min="0.1" max="5.0"
                  placeholder="1.0"
                  .value=${this._values[i]}
                  @input=${a=>{let l=[...this._values];l[i]=a.target.value,this._values=l}} />
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
    `}};te.styles=A`
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
  `,u([y({attribute:!1})],te.prototype,"hass",2),u([h()],te.prototype,"_open",2),u([h()],te.prototype,"_loading",2),u([h()],te.prototype,"_error",2),u([h()],te.prototype,"_entryId",2),u([h()],te.prototype,"_taskId",2),u([h()],te.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",te);var J=class extends T{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(e,t)=>{let i=`${e}:${t}`,a=new Set(this._selected);a.has(i)?a.delete(i):a.add(i),this._selected=a};this._save=async()=>{let e=this._name.trim();if(!e){this._error=s("group_name_required",this._lang);return}this._loading=!0,this._error="";try{let t=this._buildTaskRefs();this._groupId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/update",group_id:this._groupId,name:e,description:this._description,task_refs:t}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/create",name:e,description:this._description,task_refs:t}),this._open=!1,this.dispatchEvent(new CustomEvent("group-saved"))}catch(t){this._error=I(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._reset(),this._open=!0}openEdit(e,t){this._reset(),this._groupId=e,this._name=t.name,this._description=t.description||"",this._selected=new Set(t.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(e=>{let[t,i]=e.split(":",2);return{entry_id:t,task_id:i}})}render(){if(!this._open)return o``;let e=this._lang,t=this._groupId?s("edit_group",e):s("new_group",e);return o`
      <ha-dialog open @closed=${this._close} heading="${t}">
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:p}
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
                    ${i.tasks.length===0?o`<div class="hint small">${s("no_tasks_short",e)}</div>`:[...i.tasks].sort((a,l)=>a.name.localeCompare(l.name)).map(a=>{let l=`${i.entry_id}:${a.id}`,c=this._selected.has(l);return o`
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
    `}};J.styles=A`
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
  `,u([y({attribute:!1})],J.prototype,"hass",2),u([y({attribute:!1})],J.prototype,"objects",2),u([h()],J.prototype,"_open",2),u([h()],J.prototype,"_loading",2),u([h()],J.prototype,"_error",2),u([h()],J.prototype,"_groupId",2),u([h()],J.prototype,"_name",2),u([h()],J.prototype,"_description",2),u([h()],J.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",J);function Fe(n,r,e=4){if(!isFinite(n)||!isFinite(r))return{ticks:[],niceMin:0,niceMax:1};if(n===r){let _=Math.abs(n)*.1||1;n-=_,r+=_}let t=r-n,i=Math.pow(10,Math.floor(Math.log10(t/Math.max(1,e)))),a=i;for(let _ of[1,2,5,10])if(a=i*_,t/a<=e+.5)break;let l=Math.floor(n/a)*a,c=Math.ceil(r/a)*a,d=[];for(let _=l;_<=c+a*1e-6;_+=a)d.push(Math.abs(_)<a*1e-9?0:_);return{ticks:d,niceMin:l,niceMax:c}}function re(n){let r=Math.abs(n);return r>=1e6?Te((n/1e6).toFixed(r>=1e7?0:1))+"M":r>=1e4?Te((n/1e3).toFixed(0))+"k":r>=1e3?Te((n/1e3).toFixed(1))+"k":r>=100?n.toFixed(0):r>=10||r>=1?Te(n.toFixed(1)):r===0?"0":Te(n.toFixed(2))}function Te(n){return n.replace(/\.0+$/,"").replace(/(\.\d*[1-9])0+$/,"$1")}function be(n,r,e){let t=n.toLocaleString(e,{maximumFractionDigits:Math.abs(n)>=100?0:1});return r?`${t} ${r}`:t}function Se(n,r,e){let t=new Date(n),i=e?{month:"short",day:"numeric",year:"2-digit"}:{month:"short",day:"numeric"};return t.toLocaleDateString(r,i)}function Ct(n,r){return new Date(n).toLocaleDateString(r,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function ct(n,r){return new Date(n).getFullYear()!==new Date(r).getFullYear()}function dt(n,r,e){if(e<2||r<=n)return[n,r];let t=[];for(let i=0;i<e;i++)t.push(n+(r-n)*i/(e-1));return t}var pt=210,ie=46,ce=14,de=12,_i=14,$s=20+_i,ws=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],N=class extends T{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(e=>{let t=Math.floor(e[0]?.contentRect?.width||0);t&&Math.abs(t-this._width)>2&&(this._width=t)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(e){e!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:e},bubbles:!0,composed:!0}))}render(){let e=this._width||320,t=[...this.points].sort((a,l)=>a.ts-l.ts),i=this.lang;return o`
      <div class="chart-wrap">
        ${this.showRange?o`<div class="range-chips" role="group">
              ${ws.map(a=>o`<button
                  class="range-chip ${this.rangeDays===a.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(a.days)}
                >${s(a.key,i)}</button>`)}
            </div>`:p}
        ${t.length<2?o`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${s("loading_chart",i)}
            </div>`:this._renderSvg(e,t)}
      </div>
    `}_renderSvg(e,t){let i=this.lang,a=e-ie-ce,l=pt-$s,c=l-de,d=1/0,_=-1/0;for(let k of t)d=Math.min(d,k.min??k.val),_=Math.max(_,k.max??k.val);this.thresholdAbove!=null&&(d=Math.min(d,this.thresholdAbove),_=Math.max(_,this.thresholdAbove)),this.thresholdBelow!=null&&(d=Math.min(d,this.thresholdBelow),_=Math.max(_,this.thresholdBelow)),this.targetValue!=null&&(d=Math.min(d,this.targetValue),_=Math.max(_,this.targetValue)),this.forceZero&&(d=Math.min(d,0));let g=(_-d||1)*.06,m=this.forceZero&&d>=0?0:d-g,{ticks:v,niceMin:b,niceMax:w}=Fe(m,_+g,4);this.forceZero&&d>=0&&b<0&&(b=0,v=v.filter(k=>k>=0));let f=t[0].ts,j=t[t.length-1].ts,L=j-f||1,H=ct(f,j),M=k=>ie+(k-f)/L*a,E=k=>de+(1-(k-b)/(w-b||1))*c,W=t.map(k=>`${M(k.ts).toFixed(1)},${E(k.val).toFixed(1)}`).join(" "),K=`M${M(t[0].ts).toFixed(1)},${l} `+t.map(k=>`L${M(k.ts).toFixed(1)},${E(k.val).toFixed(1)}`).join(" ")+` L${M(t[t.length-1].ts).toFixed(1)},${l} Z`,V="",q=t.filter(k=>k.min!=null&&k.max!=null);if(q.length>=2){let k=q.map(R=>`${M(R.ts).toFixed(1)},${E(R.max).toFixed(1)}`),$=[...q].reverse().map(R=>`${M(R.ts).toFixed(1)},${E(R.min).toFixed(1)}`);V=`M${k[0]} `+k.slice(1).map(R=>`L${R}`).join(" ")+` L${$.join(" L")} Z`}let D=[];if(this.thresholdBelow!=null){let k=E(this.thresholdBelow);D.push({y:k,h:Math.max(0,l-k),lineY:k,label:`\u25BC ${re(this.thresholdBelow)}`,labelY:Math.min(l-4,k+13)})}if(this.thresholdAbove!=null){let k=E(this.thresholdAbove);D.push({y:de,h:Math.max(0,k-de),lineY:k,label:`\u25B2 ${re(this.thresholdAbove)}`,labelY:Math.max(de+11,k-5)})}let pe=t[t.length-1],_e=(this.events||[]).filter(k=>k.ts>=f&&k.ts<=j),ye=dt(f,j,Math.max(2,Math.min(5,Math.floor(a/110)+1))),U=this._hover;return o`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${e} ${pt}"
          width=${e}
          height=${pt}
          role="img"
          aria-label=${s("chart_sparkline",i)}
          @pointermove=${k=>this._onPointer(k,t,M,E,e)}
          @pointerdown=${k=>this._onPointer(k,t,M,E,e)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${ie}" y="${de}" width="${a}" height="${c}" /></clipPath>
            ${D.length?P`<clipPath id="danger">${D.map(k=>P`<rect x="${ie}" y="${k.y.toFixed(1)}" width="${a}" height="${k.h.toFixed(1)}" />`)}</clipPath>`:p}
          </defs>

          ${v.map(k=>{let $=E(k);return $<de-1||$>l+1?p:P`
              <line x1="${ie}" y1="${$.toFixed(1)}" x2="${e-ce}" y2="${$.toFixed(1)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${ie-7}" y="${($+3.5).toFixed(1)}" text-anchor="end" class="tick-label">${re(k)}</text>`})}

          ${D.map(k=>P`<rect x="${ie}" y="${k.y.toFixed(1)}" width="${a}" height="${k.h.toFixed(1)}"
              fill="var(--error-color, #f44336)" opacity="0.07" />`)}

          ${V?P`<path d="${V}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:p}
          <path d="${K}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${W}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${D.length?P`<polyline points="${W}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:p}

          ${D.map(k=>P`
              <line x1="${ie}" y1="${k.lineY.toFixed(1)}" x2="${e-ce}" y2="${k.lineY.toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${e-ce-4}" y="${k.labelY.toFixed(1)}" text-anchor="end" class="zone-label">${k.label}</text>`)}

          ${this.targetValue!=null?P`<line x1="${ie}" y1="${E(this.targetValue).toFixed(1)}" x2="${e-ce}" y2="${E(this.targetValue).toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${e-ce-4}" y="${(E(this.targetValue)-5).toFixed(1)}" text-anchor="end" class="zone-label">◆ ${re(this.targetValue)} ${this.unit}</text>`:p}

          ${this.projection&&this.projection.length===2?P`<line x1="${M(this.projection[0].ts).toFixed(1)}" y1="${E(this.projection[0].val).toFixed(1)}"
                x2="${Math.min(M(this.projection[1].ts),e-ce).toFixed(1)}" y2="${E(Math.max(b,Math.min(w,this.projection[1].val))).toFixed(1)}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:p}

          ${ye.map((k,$)=>{let R=M(k),ut=$===0?"start":$===ye.length-1?"end":"middle";return P`<text x="${R.toFixed(1)}" y="${pt-5}" text-anchor="${ut}" class="tick-label">${Se(k,i,H)}</text>`})}

          <line x1="${ie}" y1="${l}" x2="${e-ce}" y2="${l}" stroke="var(--divider-color)" stroke-width="1" />

          ${_e.map(k=>{let $=M(k.ts),R=k.type==="completed"?"var(--success-color, #4caf50)":k.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return P`
              <line x1="${$.toFixed(1)}" y1="${de}" x2="${$.toFixed(1)}" y2="${l}" stroke="${R}" stroke-width="1" opacity="0.14" />
              <rect x="${($-1.5).toFixed(1)}" y="${l+3}" width="3" height="${_i-6}" rx="1.5" fill="${R}">
                <title>${Ct(k.ts,i)}</title>
              </rect>`})}

          ${U?P`
                <line x1="${U.x.toFixed(1)}" y1="${de}" x2="${U.x.toFixed(1)}" y2="${l}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${U.x.toFixed(1)}" cy="${U.y.toFixed(1)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:P`<circle cx="${M(pe.ts).toFixed(1)}" cy="${E(pe.val).toFixed(1)}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${U?o`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(U.x,70),e-70)}px"
            >
              <div class="hover-date">${Ct(U.p.ts,i)}</div>
              <div class="hover-val">
                ${be(U.p.val,this.unit,i)}
                ${U.p.min!=null&&U.p.max!=null?o`<span class="hover-range">(${re(U.p.min)}–${re(U.p.max)})</span>`:p}
              </div>
            </div>`:p}
      </div>
    `}_onPointer(e,t,i,a,l){let d=e.currentTarget.getBoundingClientRect(),_=(e.clientX-d.left)/d.width*l;if(_<ie-8||_>l-ce+8){this._hover=null;return}let g=t[0],m=1/0;for(let v of t){let b=Math.abs(i(v.ts)-_);b<m&&(m=b,g=v)}this._hover={x:i(g.ts),y:a(g.val),p:g}}};N.styles=A`
    :host { display: block; width: 100%; }
    .chart-wrap { position: relative; }
    .range-chips { display: flex; gap: 4px; justify-content: flex-end; margin-bottom: 2px; }
    .range-chip {
      font: inherit; font-size: 11.5px; padding: 2px 9px; border-radius: 12px; cursor: pointer;
      border: 1px solid var(--divider-color); background: transparent;
      color: var(--secondary-text-color);
    }
    .range-chip.active {
      background: var(--primary-color); border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .range-chip[disabled] { opacity: 0.5; pointer-events: none; }
    .svg-holder { position: relative; }
    .chart-svg { display: block; touch-action: pan-y; }
    .tick-label { fill: var(--secondary-text-color); font-size: 10.5px; }
    .zone-label { fill: var(--error-color, #f44336); font-size: 11px; font-weight: 600; }
    .chart-empty {
      display: flex; align-items: center; justify-content: center; gap: 8px; height: 120px;
      color: var(--secondary-text-color); font-size: 12.5px;
    }
    .chart-empty ha-icon { --mdc-icon-size: 17px; }
    .hover-chip {
      position: absolute; top: 0; transform: translateX(-50%);
      background: var(--card-background-color, #fff); border: 1px solid var(--divider-color);
      border-radius: 8px; padding: 4px 9px; pointer-events: none; white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); z-index: 3;
    }
    .hover-date { font-size: 10.5px; color: var(--secondary-text-color); }
    .hover-val { font-size: 12.5px; font-weight: 600; color: var(--primary-text-color); }
    .hover-range { font-weight: 400; color: var(--secondary-text-color); font-size: 11px; }
  `,u([y({attribute:!1})],N.prototype,"points",2),u([y({attribute:!1})],N.prototype,"events",2),u([y()],N.prototype,"unit",2),u([y()],N.prototype,"lang",2),u([y({attribute:!1})],N.prototype,"thresholdAbove",2),u([y({attribute:!1})],N.prototype,"thresholdBelow",2),u([y({attribute:!1})],N.prototype,"targetValue",2),u([y({type:Boolean})],N.prototype,"forceZero",2),u([y({attribute:!1})],N.prototype,"projection",2),u([y({attribute:!1})],N.prototype,"rangeDays",2),u([y({type:Boolean})],N.prototype,"showRange",2),u([y({type:Boolean})],N.prototype,"busy",2),u([h()],N.prototype,"_width",2),u([h()],N.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",N);function mi(n,r){let e=n.trigger_config;if(!e)return p;let t=r.lang,i=n.trigger_entity_info,a=n.trigger_entity_infos,l=i?.friendly_name||e.entity_id||"\u2014",c=e.entity_id||"",d=e.entity_ids||(c?[c]:[]),_=i?.unit_of_measurement||"",g=n.trigger_current_value,m=e.type||"threshold",v=d.length>1,b=ks(n,_,r);return o`
    <h3>${s("trigger",t)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${v?o`
            <div class="trigger-entity-name">${d.length} ${s("entities",t)} (${e.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${d.map((w,f)=>o`${f>0?", ":""}<span class="entity-link" @click=${j=>fe(j,w)}>${w}</span>`)}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `:o`
            <div class="trigger-entity-name">${l}</div>
            <div class="trigger-entity-id">${c?o`<span class="entity-link" @click=${w=>fe(w,c)}>${c}</span>`:""}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${n.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${n.trigger_active?s("triggered",t):s("ok",t)}
        </span>
      </div>

      ${b?Es(b,t):g!=null?o`
              <div class="trigger-value-row">
                <span class="trigger-current ${n.trigger_active?"active":""}">${typeof g=="number"?be(g,"",t):g}</span>
                ${_?o`<span class="trigger-unit">${_}</span>`:p}
              </div>
            `:p}

      <div class="trigger-limits">
        ${m==="threshold"?o`
          ${e.trigger_above!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_above",t)}: ${e.trigger_above} ${_}</span>`:p}
          ${e.trigger_below!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_below",t)}: ${e.trigger_below} ${_}</span>`:p}
          ${e.trigger_for_minutes?o`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("for_minutes",t)}: ${e.trigger_for_minutes}</span>`:p}
        `:p}
        ${m==="state_change"?o`
          ${e.trigger_target_changes!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("target_changes",t)}: ${e.trigger_target_changes}</span>`:p}
        `:p}
        ${m==="runtime"?o`
          ${e.trigger_runtime_hours!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("runtime_hours",t)}: ${e.trigger_runtime_hours}h</span>`:p}
        `:p}
        ${m==="compound"?o`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("compound_logic",t)}: ${e.compound_logic||e.operator||"AND"}</span>
          ${(e.conditions||[]).map((w,f)=>o`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${f+1}. ${s(w.type||"unknown",t)}: ${w.entity_id?o`<span class="entity-link" @click=${j=>fe(j,w.entity_id)}>${w.entity_id}</span>`:""}</span>
          `)}
        `:p}
      </div>

      ${a&&a.length>1?o`
        <div class="trigger-entity-list">
          ${a.map(w=>o`
            <span class="trigger-entity-id">${w.friendly_name} (<span class="entity-link" @click=${f=>fe(f,w.entity_id)}>${w.entity_id}</span>)</span>
          `)}
        </div>
      `:p}

      ${Ts(n,_,r)}
    </div>
  `}function ks(n,r,e){let t=n.trigger_config,i=n.trigger_current_value;if(!t||i==null)return null;switch(t.type||"threshold"){case"counter":{let a=t.trigger_target_value;if(a==null||a<=0)return null;let l=vi(n,fi(n,e));return{progress:Math.max(0,i-(l?.value??i)),target:a,unit:r,meter:i}}case"state_change":{let a=t.trigger_target_changes;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"",meter:null}}case"runtime":{let a=t.trigger_runtime_hours;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"h",meter:null}}}return null}function vi(n,r){if(n.trigger_baseline_value!=null)return{value:n.trigger_baseline_value,ts:gi(n)};if(!r.length)return null;let e=gi(n);if(e==null)return{value:r[0].val,ts:null};let t=r[0],i=Math.abs(r[0].ts-e);for(let a of r){let l=Math.abs(a.ts-e);l<i&&(t=a,i=l)}return{value:t.val,ts:e}}function gi(n){let r=[...n.history].filter(e=>e.type==="completed"||e.type==="reset").sort((e,t)=>new Date(t.timestamp).getTime()-new Date(e.timestamp).getTime())[0];return r?new Date(r.timestamp).getTime():null}function Es(n,r){let e=Math.min(999,Math.round(n.progress/n.target*100)),t=e>=100?"over":e>=75?"near":"ok";return o`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${be(n.progress,"",r)}<span class="counter-progress-target"> / ${be(n.target,n.unit,r)}</span></span>
        <span class="counter-progress-pct ${t}">${e} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${e} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${t}" style="width:${Math.min(100,e)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${s("chart_since_service",r)}${n.meter!=null?o` · ${s("current",r)}: ${be(n.meter,n.unit,r)}`:p}
      </div>
    </div>
  `}function fi(n,r){let e=n.trigger_config;if(!e)return[];let t=e.entity_id||"",i=r.detailStatsData.get(t)||[],a=r.isCounterEntity(e),l=[];if(i.length>=2)for(let c of i){let d={ts:c.ts,val:c.val};!a&&c.min!=null&&c.max!=null&&(d.min=c.min,d.max=c.max),l.push(d)}else for(let c of n.history)c.trigger_value!=null&&l.push({ts:new Date(c.timestamp).getTime(),val:c.trigger_value});return n.trigger_current_value!=null&&l.push({ts:Date.now(),val:n.trigger_current_value}),l.sort((c,d)=>c.ts-d.ts),l}function Ts(n,r,e){let t=n.trigger_config;if(!t)return p;let i=t.type||"threshold",a=t.entity_id||"",l=fi(n,e),c=l.length<2&&!!a&&e.hasStatsService&&!e.detailStatsData.has(a);if(l.length<2&&!c)return p;let d=!!a&&e.detailStatsData.has(a)&&(e.detailStatsData.get(a)?.length??0)<2,_=Date.now()-e.rangeDays*864e5,g=l.filter(f=>f.ts>=_);g.length>=2&&(l=g);let m=null,v=!1;if(i==="counter"&&t.trigger_target_value!=null&&l.length){let f=vi(n,l);if(f){if(f.ts!=null){let j=l.filter(L=>L.ts>=f.ts);j.length>=2&&(l=j)}l=l.map(j=>({...j,val:Math.max(0,j.val-f.value)}))}m=t.trigger_target_value,v=!0}else i==="state_change"&&t.trigger_target_changes?(m=t.trigger_target_changes,v=!0):i==="runtime"&&t.trigger_runtime_hours&&(m=t.trigger_runtime_hours,v=!0);let b=null;if(m==null&&n.degradation_rate!=null&&(n.degradation_trend!=="stable"||n.days_until_threshold!=null)&&n.degradation_trend!=="insufficient_data"&&l.length>=2){let f=l[l.length-1];b=[f,{ts:f.ts+30*864e5,val:f.val+n.degradation_rate*30}]}let w=n.history.filter(f=>["completed","skipped","reset"].includes(f.type)).map(f=>({ts:new Date(f.timestamp).getTime(),type:f.type}));return o`
    <maintenance-trigger-chart
      .points=${c?[]:l}
      .events=${w}
      .unit=${r}
      .lang=${e.lang}
      .thresholdAbove=${i==="threshold"?t.trigger_above??null:null}
      .thresholdBelow=${i==="threshold"?t.trigger_below??null:null}
      .targetValue=${m}
      .forceZero=${v}
      .projection=${b}
      .rangeDays=${e.rangeDays}
      .busy=${c}
      @range-change=${f=>e.setRangeDays(f.detail.days)}
    ></maintenance-trigger-chart>
    ${d&&!c?o`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${s("chart_no_stats",e.lang)}
        </div>`:p}
  `}function bi(n,r,e){let t=n.degradation_trend!=null&&n.degradation_trend!=="insufficient_data",i=n.days_until_threshold!=null,a=n.environmental_factor!=null&&n.environmental_factor!==1;if(!t&&!i&&!a)return p;let l=n.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":n.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${n.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",r).replace("{days}",String(Math.round(n.days_until_threshold||0)))}
        </div>
      `:p}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",r)}
      </div>
      <div class="prediction-grid">
        ${t?o`
          <div class="prediction-item">
            <ha-svg-icon path="${l}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",r)}</span>
            <span class="prediction-value ${n.degradation_trend}">${s("trend_"+n.degradation_trend,r)}</span>
            ${n.degradation_rate!=null?o`<span class="prediction-rate">${n.degradation_rate>0?"+":""}${Math.abs(n.degradation_rate)>=10?Math.round(n.degradation_rate).toLocaleString():n.degradation_rate.toFixed(1)} ${n.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",r)}</span>`:p}
          </div>
        `:p}
        ${i?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",r)}</span>
            <span class="prediction-value prediction-days${n.days_until_threshold===0?" exceeded":n.sensor_prediction_urgency?" urgent":""}">${n.days_until_threshold===0?s("threshold_exceeded",r):"~"+Math.round(n.days_until_threshold)+" "+s("days",r)}</span>
            ${n.threshold_prediction_date?o`<span class="prediction-date">${Y(n.threshold_prediction_date,r)}</span>`:p}
            ${n.threshold_prediction_confidence?o`<span class="confidence-dot ${n.threshold_prediction_confidence}"></span>`:p}
          </div>
        `:p}
        ${a&&e.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",r)}</span>
            <span class="prediction-value">${n.environmental_factor.toFixed(2)}x</span>
            ${n.environmental_entity?o`<span class="prediction-entity entity-link" @click=${c=>fe(c,n.environmental_entity)}>${n.environmental_entity}</span>`:p}
          </div>
        `:p}
      </div>
    </div>
  `}function yi(n,r){let e=n.interval_analysis,t=e?.weibull_beta,i=e?.weibull_eta;if(t==null||i==null||i<=0)return p;let a=n.interval_days??0,l=n.suggested_interval??a;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",r)}
        ${Ss(t,r)}
      </div>
      ${As(t,i,a,l,r)}
      ${js(e,r)}
      ${e?.confidence_interval_low!=null?Cs(e,n,r):p}
    </div>
  `}function Ss(n,r){let e,t,i;return n<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):n<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):n<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),o`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${s(i,r)} (\u03B2=${n.toFixed(2)})
    </span>
  `}function As(n,r,e,t,i){let b=Math.max(e,t,r,1)*1.3,w=50,f=[];for(let q=0;q<=w;q++){let D=q/w*b,pe=1-Math.exp(-Math.pow(D/r,n)),_e=32+D/b*260,ye=136-pe*128;f.push([_e,ye])}let j=f.map(([q,D])=>`${q.toFixed(1)},${D.toFixed(1)}`).join(" "),L="M32,136 "+f.map(([q,D])=>`L${q.toFixed(1)},${D.toFixed(1)}`).join(" ")+` L${f[w][0].toFixed(1)},136 Z`,H=32+e/b*260,M=1-Math.exp(-Math.pow(e/r,n)),E=136-M*128,W=((1-M)*100).toFixed(0),K=32+t/b*260,V=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",i)}">
        ${V.map(q=>{let D=136-q*128;return P`
            <line x1="${32}" y1="${D.toFixed(1)}" x2="${292}" y2="${D.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${q===.5?"4,3":p}" />
            <text x="${28}" y="${(D+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(q*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(b)}</text>

        <path d="${L}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${j}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?P`
          <line x1="${H.toFixed(1)}" y1="${8}" x2="${H.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${H.toFixed(1)}" cy="${E.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(H+4).toFixed(1)}" y="${(E-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${W}%</text>
        `:p}

        ${t>0&&t!==e?P`
          <line x1="${K.toFixed(1)}" y1="${8}" x2="${K.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:p}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",i)}</span>
      ${e>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",i)}</span>`:p}
      ${t>0&&t!==e?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",i)}</span>`:p}
    </div>
  `}function js(n,r){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",r)}</span>
        <span class="weibull-info-value">${Math.round(n.weibull_eta)} ${s("days",r)}</span>
      </div>
      ${n.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",r)}</span>
          <span class="weibull-info-value">${n.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:p}
    </div>
  `}function Cs(n,r,e){let t=n.confidence_interval_low,i=n.confidence_interval_high,a=r.suggested_interval??r.interval_days??0,l=r.interval_days??0,c=Math.max(0,t-5),_=i+5-c,g=(t-c)/_*100,m=(i-t)/_*100,v=(a-c)/_*100,b=l>0?(l-c)/_*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",e)}: ${a} ${s("days",e)} (${t}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${g.toFixed(1)}%;width:${m.toFixed(1)}%"></div>
        ${b>=0?o`<div class="confidence-marker current" style="left:${b.toFixed(1)}%"></div>`:p}
        <div class="confidence-marker recommended" style="left:${v.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",e)} (${t}${s("days",e).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",e)} (${i}${s("days",e).charAt(0)})</span>
      </div>
    </div>
  `}function xi(n,r,e,t){let i=Math.max(n||1,r);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",t)}: ${n??"\u2014"} ${n!=null?s("days",t):""}
        </div>
        <div class="interval-visual current"
          style="width: ${n!=null?Math.min(n/i*100,100):0}%"></div>
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
  `}var $i=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function wi(n,r,e){if(!e.seasonal||!n.seasonal_factor||n.seasonal_factor===1)return p;let t=$i.map(c=>s(c,r)),i=new Date().getMonth(),a=n.seasonal_factors||n.interval_analysis?.seasonal_factors||null,l=a&&a.length===12?a:t.map((c,d)=>{let _=n.seasonal_factor||1,g=Math.sin((d-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,_+g))});return o`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",r)}</h4>
      <div class="seasonal-mini-chart">
        ${l.map((c,d)=>{let _=c*40,g=c<.9?"low":c>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${g} ${d===i?"current":""}"
                 style="height: ${_}px"
                 title="${t[d]}: ${c.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",r)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",r)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",r)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function ki(n,r){return Is(n,r)}function Is(n,r){let e=n.seasonal_factors??n.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return p;let t=n.interval_analysis?.seasonal_reason,i=new Date().getMonth(),a=300,l=100,c=8,_=l-c-4,g=Math.max(...e,1.5),m=a/12,v=m*.65,b=c+_-1/g*_;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",r)}
        ${t?o`<span class="source-tag">${t==="learned"?s("seasonal_learned",r):s("seasonal_manual",r)}</span>`:p}
      </div>
      <svg viewBox="0 0 ${a} ${l}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",r)}">
        <line x1="0" y1="${b.toFixed(1)}" x2="${a}" y2="${b.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((w,f)=>{let j=w/g*_,L=f*m+(m-v)/2,H=c+_-j,M=f===i,E=w<1?"var(--success-color, #4caf50)":w>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return P`
            <rect x="${L.toFixed(1)}" y="${H.toFixed(1)}"
              width="${v.toFixed(1)}" height="${j.toFixed(1)}"
              fill="${E}" opacity="${M?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${$i.map((w,f)=>o`<span class="seasonal-label ${f===i?"active-month":""}">${s(w,r)}</span>`)}
      </div>
    </div>
  `}var Ms=200,Ne=10,Rs=22;function Ei(n,r,e,t){let i=n.history.filter(c=>c.type==="completed"&&(c.cost!=null||c.duration!=null));if(i.length<2)return p;let a=i.some(c=>(c.cost??0)>0),l=i.some(c=>(c.duration??0)>0);return!a&&!l?p:o`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${s("cost_duration_chart",r)}</h3>
        <div class="toggle-buttons">
          ${a?o`<button
            class="toggle-btn ${e==="cost"?"active":""}"
            @click=${()=>t("cost")}>
            ${s("cost",r)}
          </button>`:p}
          ${a&&l?o`<button
            class="toggle-btn ${e==="both"?"active":""}"
            @click=${()=>t("both")}>
            ${s("both",r)}
          </button>`:p}
          ${l?o`<button
            class="toggle-btn ${e==="duration"?"active":""}"
            @click=${()=>t("duration")}>
            ${s("duration",r)}
          </button>`:p}
        </div>
      </div>
      ${Ps(n,r,e)}
    </div>
  `}function Ps(n,r,e){let t=n.history.filter($=>$.type==="completed"&&($.cost!=null||$.duration!=null)).map($=>({ts:new Date($.timestamp).getTime(),cost:$.cost??0,duration:$.duration??0})).sort(($,R)=>$.ts-R.ts);if(t.length<2)return p;let i=t.some($=>$.cost>0),a=t.some($=>$.duration>0);if(!i&&!a)return p;let l=e!=="duration"&&i,c=e!=="cost"&&a,d=l||!c&&i,_=c||!l&&a,g=640,m=Ms,v=d?44:12,b=_?44:12,w=g-v-b,f=m-Rs,j=f-Ne,L=t[0].ts,H=t[t.length-1].ts,M=(H-L||864e5)*.05,E=L-M,W=H+M,K=ct(L,H),V=$=>v+($-E)/(W-E)*w,q=Fe(0,Math.max(...t.map($=>$.cost))||1,3),D=Fe(0,Math.max(...t.map($=>$.duration))||1,3),pe=$=>Ne+(1-$/(q.niceMax||1))*j,_e=$=>Ne+(1-$/(D.niceMax||1))*j,ye=t.length>1?Math.min(...t.slice(1).map(($,R)=>V($.ts)-V(t[R].ts))):w,U=Math.max(6,Math.min(22,ye*.55)),k=dt(L,H,Math.max(2,Math.min(4,t.length)));return o`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${g} ${m}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_history",r)}">
        ${d?q.ticks.map($=>{let R=pe($);return R<Ne-1||R>f+1?p:P`
            <line x1="${v}" y1="${R.toFixed(1)}" x2="${g-b}" y2="${R.toFixed(1)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${v-6}" y="${(R+3.5).toFixed(1)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${re($)}€</text>`}):p}
        ${_?D.ticks.map($=>{let R=_e($);return R<Ne-1||R>f+1?p:P`<text x="${g-b+6}" y="${(R+3.5).toFixed(1)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${re($)}m</text>`}):p}

        ${d?t.filter($=>$.cost>0).map($=>P`
          <rect x="${(V($.ts)-U/2).toFixed(1)}" y="${pe($.cost).toFixed(1)}" width="${U.toFixed(1)}" height="${(f-pe($.cost)).toFixed(1)}"
            fill="var(--primary-color)" opacity="0.6" rx="2">
            <title>${Se($.ts,r,!0)}: ${$.cost.toLocaleString(r)}€${$.duration?` \xB7 ${$.duration}m`:""}</title>
          </rect>
        `):p}
        ${_?P`
          <polyline points="${t.map($=>`${V($.ts).toFixed(1)},${_e($.duration).toFixed(1)}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${t.map($=>P`
            <circle cx="${V($.ts).toFixed(1)}" cy="${_e($.duration).toFixed(1)}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${Se($.ts,r,!0)}: ${$.duration}m${$.cost?` \xB7 ${$.cost.toLocaleString(r)}\u20AC`:""}</title>
            </circle>
          `)}
        `:p}

        <line x1="${v}" y1="${f}" x2="${g-b}" y2="${f}" stroke="var(--divider-color)" stroke-width="1" />
        ${k.map(($,R)=>{let ut=R===0?"start":R===k.length-1?"end":"middle";return P`<text x="${V($).toFixed(1)}" y="${m-6}" text-anchor="${ut}" fill="var(--secondary-text-color)" font-size="10">${Se($,r,K)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${d?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${s("cost",r)}</span>`:p}
      ${_?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${s("duration",r)}</span>`:p}
    </div>
  `}var Ls=60,Hs=20,Ti=30;function It(n){let r=n.trigger_config??null;if(!r)return p;let e=r.type||"threshold",t=n.trigger_entity_info?.unit_of_measurement??"",i=0,a="";if(e==="threshold"){let d=n.trigger_current_value??null;if(d==null)return p;let _=r.trigger_above,g=r.trigger_below;if(_!=null){let m=g??0,v=_-m||1;i=Math.min(100,Math.max(0,(d-m)/v*100)),a=`${d.toFixed(1)} / ${_} ${t}`}else if(g!=null){let v=n.trigger_entity_info?.max??(g*2||100),b=v-g||1;i=Math.min(100,Math.max(0,(v-d)/b*100)),a=`${d.toFixed(1)} / ${g} ${t}`}else return p}else if(e==="counter"){let d=r.trigger_target_value||1,g=n.trigger_current_delta??null??n.trigger_current_value??null;if(g==null)return p;i=Math.min(100,Math.max(0,g/d*100)),a=`${g.toFixed(1)} / ${d} ${t}`}else if(e==="state_change"){let d=r.trigger_target_changes||1,_=n.trigger_current_value??null;if(_==null)return p;i=Math.min(100,Math.max(0,_/d*100)),a=`${Math.round(_)} / ${d}`}else if(e==="runtime"){let d=r.trigger_runtime_hours||100,_=n.trigger_current_value??null;if(_==null)return p;i=Math.min(100,Math.max(0,_/d*100)),a=`${_.toFixed(1)}h / ${d}h`}else if(e==="compound"){let d=r.compound_logic||r.operator||"AND",_=r.conditions?.length||0;a=`${d} (${_})`,i=n.trigger_active?100:0}else return p;let l=i>=100,c=i>90?"var(--error-color, #f44336)":i>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return o`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${l?" overflow":""}" style="width:${i}%;background:${c}"></div>
      </div>
      <span class="trigger-progress-label">${a}</span>
    </div>
  `}function Mt(n,r,e){if(!n.trigger_config?.entity_id)return p;let t=n.trigger_config.entity_id,i=r.get(t)||[],a=[];if(i.length>=2)a=i.map(E=>({ts:E.ts,val:E.val}));else{if(!n.history)return p;for(let E of n.history)E.trigger_value!=null&&a.push({ts:new Date(E.timestamp).getTime(),val:E.trigger_value})}if(n.trigger_current_value!=null&&a.push({ts:Date.now(),val:n.trigger_current_value}),a.length<2)return p;a.sort((E,W)=>E.ts-W.ts);let l=Ls,c=Hs,d=a.map(E=>E.val),_=Math.min(...d),g=Math.max(...d),m=g-_||1;_-=m*.1,g+=m*.1;let v=a[0].ts,w=a[a.length-1].ts-v||1,f=E=>(E-v)/w*l,j=E=>2+(1-(E-_)/(g-_))*(c-4),L=a;if(L.length>Ti){let E=Math.ceil(L.length/Ti);L=L.filter((W,K)=>K%E===0||K===L.length-1)}let H=L.map(E=>`${f(E.ts).toFixed(1)},${j(E.val).toFixed(1)}`).join(" "),M=n.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return o`
    <svg class="mini-sparkline" viewBox="0 0 ${l} ${c}" preserveAspectRatio="none" role="img" aria-label="${s("chart_mini_sparkline",e)}">
      <polyline points="${H}" fill="none" stroke="${M}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function Si(n,r){let e=r;if(n.days_until_due==null||!n.interval_days||n.interval_days<=0)return p;let{pct:t,overflow:i}=et(n.interval_days,n.days_until_due,n.interval_unit),a="var(--success-color, #4caf50)";return n.status==="overdue"?a="var(--error-color, #f44336)":n.status==="due_soon"&&(a="var(--warning-color, #ff9800)"),o`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${n.last_performed?`${s("last_performed",e)}: ${Y(n.last_performed,e)}`:""}</span>
        <span>${n.next_due?`${s("next_due",e)}: ${Y(n.next_due,e)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(t)}" aria-valuemin="0" aria-valuemax="100" aria-label="${s("days_progress",e)}">
        <div class="days-progress-fill${i?" overflow":""}" style="width:${t}%;background:${a}"></div>
      </div>
      <div class="days-progress-text">${ze(n.days_until_due,e)}</div>
    </div>
  `}var zs=["completed","skipped","reset","triggered"];function Ai(n,r){let e=r.lang;return o`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${zs.map(t=>{let i=n.history.filter(a=>a.type===t).length;return i===0?p:o`
            <span class="filter-chip ${r.filter===t?"active":""}"
              @click=${()=>r.setFilter(r.filter===t?null:t)}>
              ${s(t,e)} (${i})
            </span>
          `})}
        ${r.filter?o`<span class="filter-chip clear" @click=${()=>r.setFilter(null)}>${s("show_all",e)}</span>`:p}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${s("search_notes",e)}..." .value=${r.search} @input=${t=>r.setSearch(t.target.value)} />
      </div>
    </div>
  `}function ji(n,r){let e=r.lang,t=r.filter?n.history.filter(i=>i.type===r.filter):n.history;if(r.search){let i=r.search.toLowerCase();t=t.filter(a=>a.notes?.toLowerCase().includes(i))}return t.length===0?o`<p class="empty">${s("no_history",e)}</p>`:o`
    <div class="history-timeline">
      ${[...t].reverse().map(i=>Ds(i,r))}
    </div>
  `}function Ds(n,r){let e=r.lang,t=["completed","reset","skipped"].includes(n.type);return o`
    <div class="history-entry">
      <div class="history-icon ${n.type}">
        <ha-icon .icon=${Xt[n.type]||"mdi:circle"}></ha-icon>
      </div>
      <div class="history-content">
        <div class="history-row">
          <strong>${s(n.type,e)}</strong>
          ${t?o`<button class="history-edit-btn"
                     title=${s("history_edit_button",e)||"Edit entry"}
                     @click=${()=>r.openEdit(n)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:p}
        </div>
        <div class="history-date">${Je(n.timestamp,e)}</div>
        ${n.notes?o`<div>${n.notes}</div>`:p}
        <div class="history-details">
          ${n.cost!=null?o`<span>${s("cost",e)}: ${n.cost.toFixed(2)} ${r.currencySymbol}</span>`:p}
          ${n.duration!=null?o`<span>${s("duration",e)}: ${n.duration} min</span>`:p}
          ${n.trigger_value!=null?o`<span>${s("trigger_val",e)}: ${n.trigger_value}</span>`:p}
        </div>
      </div>
    </div>
  `}var S=class extends T{constructor(){super(...arguments);this.narrow=!1;this.panel={};this._objects=[];this._stats=null;this._view="overview";this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._filterUser=null;this._unsub=null;this._chartRangeDays=(()=>{try{let e=parseInt(localStorage.getItem("msp-chart-range")||"",10);return[7,30,90,365].includes(e)?e:30}catch{return 30}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._actionLoading=!1;this._moreMenuOpen=!1;this._toastMessage="";this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab="dashboard";this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=tt;this._showArchived=!1;this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=e=>this._onPopState(e);this._deepLinkHandled=!1;this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onCalendarLlCustom=e=>{let t=e.detail;t?.type==="maintenance-supporter:open-task"&&t.entry_id&&t.task_id&&(e.stopPropagation(),this._showTask(t.entry_id,t.task_id))};this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _lang(){return this.hass?.language||"en"}get _isOperator(){let e=this.hass?.user;return e?e.is_admin?!1:!(this._operatorWriteEnabled&&this._adminPanelUserIds.includes(e.id)):!0}connectedCallback(){super.connectedCallback(),window.addEventListener("popstate",this._popstateHandler);let e=localStorage.getItem("maintenance_supporter_sort");e&&["due_date","object","type","task_name","area","assigned_user","group"].includes(e)&&(this._sortMode=e);let t=localStorage.getItem("maintenance_supporter_object_sort");t&&["alphabetical","due_soonest","task_count"].includes(t)&&(this._objectSortMode=t);let i=localStorage.getItem("maintenance_supporter_groupby");i&&["none","area","group","user"].includes(i)&&(this._groupByMode=i);let a=localStorage.getItem("maintenance_supporter_object_view");(a==="cards"||a==="table")&&(this._objectViewMode=a)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._popstateHandler),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null,this._deepLinkHandled=!1,this._statsService?.clearCache(),this._statsService=null}updated(e){super.updated(e);let t=this.hass?.language;if(t&&!Ze(t)&&se(t).then(()=>this.requestUpdate()),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new at(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new he(this.hass),this._userService.getUsers())}}async _loadData(){let[e,t,i,a,l]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null)]);if(e&&(this._objects=e.objects),t&&(this._stats=t),i&&(this._budget=i),a&&(this._groups=a.groups||{}),l){let c=l;this._features=c.features,this._adminPanelUserIds=c.admin_panel_user_ids||[],this._operatorWriteEnabled=c.operator_write_enabled??!1;let d=c.general?.default_warning_days;typeof d=="number"&&d>=0&&d<=365&&(this._defaultWarningDays=d),this._objectsTableColumns=De(c.objects_table_columns)}this._fetchMiniStatsForOverview(),this._handleDeepLink()}_handleDeepLink(){if(this._deepLinkHandled)return;let e=new URLSearchParams(window.location.search),t=e.get("ms_action"),i=()=>{let g=window.location.pathname+window.location.hash;history.replaceState(history.state,"",g)};if(t==="add_object"){this._deepLinkHandled=!0,i(),requestAnimationFrame(()=>{this.shadowRoot?.querySelector("maintenance-object-dialog")?.openCreate()});return}if(t==="open_vacation"||t==="open_budget"||t==="open_groups"||t==="open_settings"){this._deepLinkHandled=!0,i(),this._overviewTab="settings",requestAnimationFrame(()=>{let g=this.shadowRoot?.querySelector("maintenance-settings-view"),m=t.replace("open_","");g?.scrollToSection?.(m)});return}let a=e.get("entry_id");if(!a)return;this._deepLinkHandled=!0;let l=e.get("task_id"),c=e.get("action"),d=window.location.pathname+window.location.hash;history.replaceState(history.state,"",d);let _=this._getObject(a);if(!_){this._showOverview();return}if(l){let g=_.tasks.find(m=>m.id===l);if(!g){this._showObject(a);return}this._showTask(a,l),c==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(a,l,g.name,this._features.checklists?g.checklist:void 0,this._features.adaptive&&!!g.adaptive_config?.enabled)}):c==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(a,l,g)})}else this._showObject(a)}_isCounterEntity(e){if(!e)return!1;let t=e.type||"threshold";return t==="counter"||t==="state_change"}async _fetchDetailStats(e,t){if(!this._statsService)return;let i=await this._statsService.getDetailStats(e,t,this._chartRangeDays),a=new Map(this._detailStatsData);a.set(e,i),this._detailStatsData=a}_setChartRange(e){if(e===this._chartRangeDays)return;this._chartRangeDays=e;try{localStorage.setItem("msp-chart-range",String(e))}catch{}let t=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,i=t?.trigger_config?.entity_id;if(i){let a=new Map(this._detailStatsData);a.delete(i),this._detailStatsData=a,this._fetchDetailStats(i,this._isCounterEntity(t.trigger_config))}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let e=[];for(let i of this._objects)for(let a of i.tasks){let l=a.trigger_config?.entity_id;l&&e.push({entityId:l,isCounter:this._isCounterEntity(a.trigger_config)})}if(e.length===0)return;let t=await this._statsService.getBatchMiniStats(e);this._miniStatsData=new Map([...this._miniStatsData,...t])}async _subscribe(){try{this._unsub=await this.hass.connection.subscribeMessage(e=>{let t=e;this._objects=t.objects},{type:"maintenance_supporter/subscribe"})}catch{}}get _taskRows(){let e=[];for(let m of this._objects)for(let v of m.tasks){if(!this._showArchived&&v.archived||this._filterStatus&&v.status!==this._filterStatus)continue;if(this._filterUser){let w=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(v.responsible_user_id!==w)continue}let b=[];for(let w of Object.values(this._groups))w.task_refs?.some(f=>f.entry_id===m.entry_id&&f.task_id===v.id)&&b.push(w.name);e.push({entry_id:m.entry_id,task_id:v.id,object_name:m.object.name,task_name:v.name,type:v.type,schedule_type:v.schedule_type,status:v.status,days_until_due:v.days_until_due??null,next_due:v.next_due??null,trigger_active:v.trigger_active,trigger_current_value:v.trigger_current_value??null,trigger_current_delta:v.trigger_current_delta??null,trigger_config:v.trigger_config??null,trigger_entity_info:v.trigger_entity_info??null,times_performed:v.times_performed,total_cost:v.total_cost,interval_days:v.interval_days??null,interval_unit:v.interval_unit??null,interval_anchor:v.interval_anchor??null,is_done:v.is_done??!1,archived:v.archived??!1,history:v.history||[],enabled:v.enabled,nfc_tag_id:v.nfc_tag_id??null,area_id:m.object.area_id??null,responsible_user_id:v.responsible_user_id??null,group_names:b})}let t={overdue:0,triggered:1,due_soon:2,ok:3},i=(m,v)=>(t[m.status]??9)-(t[v.status]??9),a=(m,v)=>(m.days_until_due??99999)-(v.days_until_due??99999),l=(m,v)=>i(m,v)||a(m,v),c=m=>m.area_id&&this.hass?.areas?.[m.area_id]?.name||"",d=m=>m.responsible_user_id&&this._userService?.getUserName(m.responsible_user_id)||"",_=m=>m.group_names[0]||"",g={due_date:l,object:(m,v)=>m.object_name.localeCompare(v.object_name)||l(m,v),type:(m,v)=>m.type.localeCompare(v.type)||l(m,v),task_name:(m,v)=>m.task_name.localeCompare(v.task_name),area:(m,v)=>{let b=c(m),w=c(v);return!b&&w?1:b&&!w?-1:b.localeCompare(w)||l(m,v)},assigned_user:(m,v)=>{let b=d(m),w=d(v);return!b&&w?1:b&&!w?-1:b.localeCompare(w)||l(m,v)},group:(m,v)=>{let b=_(m),w=_(v);return!b&&w?1:b&&!w?-1:b.localeCompare(w)||l(m,v)}};return e.sort(g[this._sortMode]),e}_getObject(e){return this._objects.find(t=>t.entry_id===e)}_getTask(e,t){return this._getObject(e)?.tasks.find(a=>a.id===t)}_pushPanelState(e,t,i){let a={msp_view:e,msp_entry:t||null,msp_task:i||null};history.pushState(a,"")}_onPopState(e){let t=e.state;if(t?.msp_view&&(this._view=t.msp_view,this._selectedEntryId=t.msp_entry||null,this._selectedTaskId=t.msp_task||null,this._moreMenuOpen=!1,t.msp_view==="task"&&t.msp_entry&&t.msp_task)){this._historyFilter=null;let i=this._getTask(t.msp_entry,t.msp_task);i?.trigger_config?.entity_id&&this._fetchDetailStats(i.trigger_config.entity_id,this._isCounterEntity(i.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_filterByStatus(e){this._filterStatus=e,this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}_scrollContentToTop(){requestAnimationFrame(()=>{let e=this.shadowRoot?.querySelector(".content");e&&e.scrollTo({top:0,behavior:"smooth"})})}_showObject(e){this._pushPanelState("object",e),this._view="object",this._selectedEntryId=e,this._selectedTaskId=null,this._scrollContentToTop()}_showTask(e,t){this._pushPanelState("task",e,t),this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._activeTab="overview",this._historyFilter=null,this._scrollContentToTop();let i=this._getTask(e,t);if(i?.trigger_config?.entity_id){let a=i.trigger_config.entity_id,l=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(a,l)}}_showToast(e){this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}async _deleteObject(e){if(await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_object",this._lang),confirmText:s("delete",this._lang),danger:!0}))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:e}),this._showOverview(),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _deleteTask(e,t){if(await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_task",this._lang),confirmText:s("delete",this._lang),danger:!0}))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/delete",entry_id:e,task_id:t}),this._showObject(e),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _duplicateTask(e,t){this._moreMenuOpen=!1,this._actionLoading=!0;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/duplicate",entry_id:e,task_id:t});await this._loadData(),this._showToast(s("task_duplicated",this._lang)),i?.task_id&&this._showTask(e,i.task_id)}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _toggleArchiveTask(e,t,i){this._actionLoading=!0;try{await this.hass.connection.sendMessagePromise({type:i?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:e,task_id:t}),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _toggleArchiveObject(e,t){if(!(!t&&!await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("archive_object",this._lang),message:s("confirm_archive_object",this._lang),confirmText:s("archive_object",this._lang)})))try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:e}),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _skipTask(e,t,i){this._actionLoading=!0;try{let a={type:"maintenance_supporter/task/skip",entry_id:e,task_id:t};i&&(a.reason=i),await this.hass.connection.sendMessagePromise(a),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _resetTask(e,t,i){this._actionLoading=!0;try{let a={type:"maintenance_supporter/task/reset",entry_id:e,task_id:t};i&&(a.date=i),await this.hass.connection.sendMessagePromise(a),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _applySuggestion(e,t,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/apply_suggestion",entry_id:e,task_id:t,interval:i}),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}_openSeasonalOverrides(e){let t=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!t||!this._selectedEntryId)return;let i=e.adaptive_config?.seasonal_overrides;t.open(this._selectedEntryId,e.id,i)}async _reanalyzeInterval(e,t){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:e,task_id:t});i.recommended_interval?this._showToast(`${s("reanalyze_result",this._lang)}: ${i.recommended_interval} ${s("days",this._lang)} (${s(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${s("data_points",this._lang)})`):this._showToast(s("reanalyze_insufficient_data",this._lang)),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _promptSkipTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("skip",this._lang),message:s("skip_reason_prompt",this._lang),confirmText:s("skip",this._lang),inputLabel:s("reason_optional",this._lang),inputType:"text"});a.confirmed&&this._skipTask(e,t,a.value||void 0)}async _promptResetTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("reset",this._lang),message:s("reset_date_prompt",this._lang),confirmText:s("reset",this._lang),inputLabel:s("reset_date_optional",this._lang),inputType:"date"});a.confirmed&&this._resetTask(e,t,a.value||void 0)}_dismissSuggestion(e,t){e&&t&&this._dismissedSuggestions.add(`${e}_${t}`),this.requestUpdate()}async _handleQuickComplete(e,t,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/quick_complete",entry_id:e,task_id:t}),this._showToast(s("quick_complete_success",this._lang))}catch(a){(a?.code||"")==="no_defaults"?this._openCompleteDialog(e,t,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled):this._showToast(s("action_error",this._lang))}}_openCompleteDialog(e,t,i,a,l){let c=this.shadowRoot.querySelector("maintenance-complete-dialog");c&&(c.entryId=e,c.taskId=t,c.taskName=i,c.lang=this._lang,c.checklist=a||[],c.adaptiveEnabled=!!l,c.open())}_openQrForObject(e,t){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForObject(e,t)}_openQrForTask(e,t,i,a){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForTask(e,t,i,a)}render(){return o`
      <div class="panel">
        ${this.narrow||this._view!=="overview"?this._renderHeader():p}
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
      ${this._toastMessage?o`<div class="toast">${this._toastMessage}</div>`:p}
    `}_renderHeader(){let e=[{label:s("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let t=this._getObject(this._selectedEntryId);e.push({label:t?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let i=this._getTask(this._selectedEntryId,this._selectedTaskId);e.push({label:i?.name||"Task"})}return o`
      <div class="header">
        ${this.narrow?o`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:p}
        ${this._view!=="overview"?o`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._showOverview()}}
            ></ha-icon-button>`:p}
        <div class="breadcrumbs">
          ${e.map((t,i)=>o`
              ${i>0?o`<span class="sep">/</span>`:p}
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
          `:p}
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
        `:p}
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
    `}_renderDashboard(){let e=this._stats,t=this._taskRows,i=this._lang,a=this._isOperator,l=this._objects.reduce((c,d)=>c+d.tasks.filter(_=>_.archived).length,0);return o`
      ${this._features.budget?this._renderBudgetBar():p}

      <div class="filter-bar">
        <label class="filter-field">
          <span class="filter-label">${s("filter_label",i)}</span>
          <select
            .value=${this._filterStatus}
            @change=${c=>this._filterStatus=c.target.value}
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
            @change=${c=>{let d=c.target.value;this._filterUser=d||null}}
          >
            <option value="">${s("all_users",i)}</option>
            <option value="current_user">${s("my_tasks",i)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${s("sort_label",i)}</span>
          <select
            .value=${this._sortMode}
            @change=${c=>{this._sortMode=c.target.value,localStorage.setItem("maintenance_supporter_sort",this._sortMode)}}
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
            @change=${c=>{this._groupByMode=c.target.value,localStorage.setItem("maintenance_supporter_groupby",this._groupByMode)}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${s("groupby_none",i)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${s("groupby_area",i)}</option>
            ${this._features.groups?o`<option value="group" ?selected=${this._groupByMode==="group"}>${s("groupby_group",i)}</option>`:p}
            <option value="user" ?selected=${this._groupByMode==="user"}>${s("groupby_user",i)}</option>
          </select>
        </label>
        ${l>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",i):`${s("show_archived",i)} (${l})`}
          </ha-button>
        `:p}
        ${a?p:o`
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
                ${t.map(c=>this._renderOverviewRow(c))}
              </div>
            `:this._renderGroupedTasks(t,i)}

      ${this._features.groups&&!a?this._renderGroupsSection():p}
      ${a?p:o`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${c=>{let d=c.detail?.entry_id;d&&this._showObject(d)}}
          ></maintenance-storage-section-card>`}
    `}_renderGroupedTasks(e,t){let i=new Map,a=s("unassigned",t);for(let d of e){let _=[];this._groupByMode==="area"?_=[(d.area_id?this.hass?.areas?.[d.area_id]?.name:null)||a]:this._groupByMode==="user"?_=[(d.responsible_user_id?this._userService?.getUserName(d.responsible_user_id):null)||a]:this._groupByMode==="group"&&(_=d.group_names.length>0?d.group_names:[a]);for(let g of _)i.has(g)||i.set(g,[]),i.get(g).push(d)}let l=[...i.entries()].sort(([d],[_])=>d===a&&_!==a?1:_===a&&d!==a?-1:d.localeCompare(_)),c=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":"mdi:account-outline";return o`
      ${l.map(([d,_])=>o`
        <details class="group-section" open>
          <summary class="group-section-header">
            <ha-icon icon="${c}"></ha-icon>
            <span>${d}</span>
            <span class="group-section-count">(${_.length})</span>
          </summary>
          <div class="task-table">
            ${_.map(g=>this._renderOverviewRow(g))}
          </div>
        </details>
      `)}
    `}_warrantyLabel(e,t,i){return e.kind==="expired"?s("warranty_expired",i):e.kind==="expiring"?s("warranty_expires_in",i).replace("{days}",String(e.days??0)):s("warranty_valid_until",i).replace("{date}",Y(t,i))}_renderWarrantyMeta(e,t){let i=jt(e);return o`<p class="meta">${s("warranty",t)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,e,t)}</span></p>`}_renderAllObjects(){let e=this._lang,t=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,a=this._objects.filter(g=>g.object.archived).length,l=g=>{let m=1/0;for(let v of g.tasks){let b=v.days_until_due;b!=null&&b<m&&(m=b)}return m},c=this._objects.filter(g=>this._showArchived||!g.object.archived);this._objectSortMode==="alphabetical"?c.sort((g,m)=>g.object.name.localeCompare(m.object.name)):this._objectSortMode==="task_count"?c.sort((g,m)=>m.tasks.length-g.tasks.length||g.object.name.localeCompare(m.object.name)):c.sort((g,m)=>l(g)-l(m)||g.object.name.localeCompare(m.object.name));let d=()=>{let g=new Map;for(let m of c){let v=m.object.area_id,b=v?this.hass?.areas?.[v]?.name||s("unassigned",e):s("no_area",e);g.has(b)||g.set(b,[]),g.get(b).push(m)}return new Map([...g.entries()].sort(([m],[v])=>m.localeCompare(v)))},_=g=>{let m=g.tasks.some(v=>v.status==="overdue"||v.status==="triggered");return o`
        <div class="object-card${m?" object-card-overdue":""}" @click=${()=>this._showObject(g.entry_id)}>
          ${m?o`<span class="overdue-dot" title="${s("has_overdue",e)}"></span>`:p}
          <div class="object-card-header">
            <span class="object-card-name">${g.object.name}</span>
            ${g.object.document_count?o`<span class="doc-badge" title="${g.object.document_count} ${s("documents",e)}">
                  <ha-icon icon="mdi:paperclip"></ha-icon>${g.object.document_count}
                </span>`:p}
            <span class="object-card-count">${g.tasks.length} ${s("tasks_lower",e)}</span>
          </div>
          ${g.object.manufacturer||g.object.model?o`<div class="object-card-meta">${[g.object.manufacturer,g.object.model].filter(Boolean).join(" ")}</div>`:p}
          ${g.tasks.length===0?o`<div class="object-card-empty">${s("no_tasks_yet",e)}</div>`:p}
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
            @change=${g=>{this._objectSortMode=g.target.value,localStorage.setItem("maintenance_supporter_object_sort",this._objectSortMode)}}
          >
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${s("sort_alphabetical",e)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${s("sort_due_soonest",e)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${s("sort_task_count",e)}</option>
          </select>
        </label>
        ${this.narrow?p:o`
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
        ${i?p:o`
        <label class="filter-field">
          <span class="filter-label">${s("group_by_label",e)}</span>
          <select
            .value=${this._groupByMode}
            @change=${g=>{this._groupByMode=g.target.value,localStorage.setItem("maintenance_supporter_groupby",this._groupByMode)}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${s("groupby_none",e)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${s("groupby_area",e)}</option>
          </select>
        </label>
        `}
        ${t?p:o`
          <ha-button
            @click=${()=>this.shadowRoot.querySelector("maintenance-object-dialog")?.openCreate()}
          >
            ${s("new_object",e)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${s("settings_export_csv",e)}
        </ha-button>
        ${a>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",e):`${s("show_archived",e)} (${a})`}
          </ha-button>
        `:p}
      </div>
      ${i?this._renderObjectsTable(c):this._groupByMode==="area"?o`
          ${[...d().entries()].map(([g,m])=>o`
            <details class="group-section" open>
              <summary class="group-section-header">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${g}</span>
                <span class="group-section-count">(${m.length})</span>
              </summary>
              <div class="objects-grid">${m.map(_)}</div>
            </details>
          `)}
        `:o`<div class="objects-grid">${c.map(_)}</div>`}
    `}_setObjectViewMode(e){this._objectViewMode=e,localStorage.setItem("maintenance_supporter_object_view",e)}async _exportObjectsCsv(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects/csv"}),t=new Date().toISOString().slice(0,10);it(e.csv,`maintenance_objects_${t}.csv`,"text/csv;charset=utf-8")}catch{this._showToast(s("action_error",this._lang))}}_renderObjectsTable(e){let t=this._lang,i=this._objectsTableColumns;return o`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${i.map(a=>{let l=we.find(d=>d.key===a),c=l&&l.key!=="actions"?s(l.labelKey,t):"";return o`<th class="oc-${a}">${c}</th>`})}
            </tr>
          </thead>
          <tbody>
            ${e.map(a=>o`
              <tr class="objects-table-row" @click=${()=>this._showObject(a.entry_id)}>
                ${i.map(l=>this._renderObjectCell(l,a,t))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `}_renderObjectCell(e,t,i){let a=t.object;switch(e){case"name":return o`<td class="oc-name">
          <span class="objects-table-name">${a.name}</span>
          ${a.document_count?o`<span class="doc-badge" title="${a.document_count} ${s("documents",i)}">
                <ha-icon icon="mdi:paperclip"></ha-icon>${a.document_count}
              </span>`:p}
        </td>`;case"manufacturer":return o`<td class="oc-manufacturer">${a.manufacturer||"\u2014"}</td>`;case"model":return o`<td class="oc-model">${a.model||"\u2014"}</td>`;case"serial_number":return o`<td class="oc-serial_number">${a.serial_number||"\u2014"}</td>`;case"installation_date":return o`<td class="oc-installation_date">${a.installation_date?Y(a.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return o`<td class="oc-warranty_expiry">${this._renderWarrantyCell(a.warranty_expiry,i)}</td>`;case"area_id":{let l=a.area_id?this.hass?.areas?.[a.area_id]?.name||a.area_id:"\u2014";return o`<td class="oc-area_id">${l}</td>`}case"documentation_url":return o`<td class="oc-documentation_url">${a.documentation_url&&/^https?:\/\//i.test(a.documentation_url)?o`<a href=${a.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${l=>l.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`;case"notes":return o`<td class="oc-notes" title=${a.notes||""}>${a.notes||"\u2014"}</td>`;case"task_count":return o`<td class="oc-task_count">${t.tasks.length}</td>`;case"actions":return o`<td class="oc-actions">
          <mwc-icon-button title="${s("qr_code",i)}" @click=${l=>{l.stopPropagation(),this._openQrForObject(t.entry_id,a.name)}}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </mwc-icon-button>
        </td>`;default:return o`<td></td>`}}_renderWarrantyCell(e,t){let i=jt(e);return i.kind==="none"?o`<span class="warranty-none">—</span>`:o`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,e,t)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return p;let e=Object.entries(this._groups),t=this._lang;return o`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${s("groups",t)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${s("new_group",t)}
          </ha-button>
        </div>
        ${e.length===0?o`<div class="hint">${s("no_groups",t)}</div>`:o`
            <div class="groups-grid">
              ${e.map(([i,a])=>{let l=a.task_refs.map(c=>this._getTask(c.entry_id,c.task_id)?.name).filter(Boolean);return o`
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
                    ${a.description?o`<div class="group-card-desc">${a.description}</div>`:p}
                    <div class="group-card-tasks">
                      ${l.length>0?l.map(c=>o`<span class="group-task-chip">${c}</span>`):o`<span style="font-size:12px;color:var(--secondary-text-color)">${s("no_tasks_short",t)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(e){let t=this._groups[e];t&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(e,t)}async _deleteGroup(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(i?await i.confirm({title:s("delete_group",this._lang),message:s("delete_group_confirm",this._lang).replace("{name}",t),confirmText:s("delete",this._lang)}):confirm(`${s("delete_group_confirm",this._lang).replace("{name}",t)}`))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/delete",group_id:e}),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}_renderBudgetBar(){let e=this._budget;if(!e)return p;let t=this._lang,i=e.currency_symbol||"\u20AC",a=[];return e.monthly_budget>0&&a.push({label:s("budget_monthly",t),spent:e.monthly_spent,budget:e.monthly_budget}),e.yearly_budget>0&&a.push({label:s("budget_yearly",t),spent:e.yearly_spent,budget:e.yearly_budget}),a.length===0?p:o`
      <div class="budget-bars">
        ${a.map(l=>{let c=Math.min(100,Math.max(0,l.spent/l.budget*100)),d=c>=100?"var(--error-color, #f44336)":c>=e.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return o`
            <div class="budget-item">
              <div class="budget-label">
                <span>${l.label}</span>
                <span>${l.spent.toFixed(2)} / ${l.budget.toFixed(2)} ${i}</span>
              </div>
              <div class="budget-bar">
                <div class="budget-bar-fill" style="width:${c}%; background:${d}"></div>
              </div>
            </div>
          `})}
      </div>
    `}_renderOverviewRow(e){let t=this._lang,i=e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0,a=0,l=Qe.ok,c=!1;if(i&&e.days_until_due!==null){let m=et(e.interval_days,e.days_until_due,e.interval_unit);a=m.pct,c=m.overflow,e.status==="overdue"?l=Qe.overdue:e.status==="due_soon"&&(l=Qe.due_soon)}let d=e.area_id?this.hass?.areas?.[e.area_id]?.name:null,_=e.responsible_user_id?this._userService?.getUserName(e.responsible_user_id):null,g=e.group_names.length>0||d||_;return o`
      <div class="task-row${e.enabled?"":" task-disabled"}">
        <span class="cell-badges">
          <span class="status-badge ${e.archived?"archived":e.is_done?"done":e.status}">${e.archived?s("archived",t):e.is_done?s("completed",t):s(e.status,t)}</span>
          ${e.enabled?p:o`<span class="badge-disabled">${s("disabled",t)}</span>`}
          ${e.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_linked",t)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:p}
        </span>
        <span class="cell object-name" @click=${m=>{m.stopPropagation(),this._showObject(e.entry_id)}}>${e.object_name}</span>
        <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,e.task_id)}>${e.task_name}</span>
        <span class="task-sub${g?"":" task-sub-empty"}">
          ${e.group_names.length>0?o`
            <span class="sub-chip" title="${s("groups",t)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${e.group_names.join(", ")}
            </span>`:p}
          ${d?o`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${d}
            </span>`:p}
          ${_?o`
            <span class="sub-chip" title="${s("responsible_user",t)}">
              <ha-icon icon="mdi:account-outline"></ha-icon>${_}
            </span>`:p}
        </span>
        <span class="cell type">${s(e.type,t)}</span>
        <span class="due-cell" @click=${()=>this._showTask(e.entry_id,e.task_id)}>
          <span class="due-text">${ze(e.days_until_due,t)}</span>
          ${i?o`<div class="days-bar"><div class="days-bar-fill${c?" overflow":""}" style="width:${a}%;background:${l}"></div></div>`:p}
          ${e.trigger_config?It(e):!i&&e.trigger_active?o`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:p}
          ${Mt(e,this._miniStatsData,this._lang)}
        </span>
        <span class="row-actions">
          <mwc-icon-button class="btn-complete" title="${s("complete",t)}" @click=${m=>{m.stopPropagation(),this._openCompleteDialogForRow(e)}}>
            <ha-icon icon="mdi:check"></ha-icon>
          </mwc-icon-button>
          <mwc-icon-button class="btn-skip" title="${s("skip",t)}" .disabled=${this._actionLoading} @click=${m=>{m.stopPropagation(),this._promptSkipTask(e.entry_id,e.task_id)}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>
        </span>
      </div>
    `}_openCompleteDialogForRow(e){let i=this._objects.find(a=>a.entry_id===e.entry_id)?.tasks.find(a=>a.id===e.task_id);this._openCompleteDialog(e.entry_id,e.task_id,e.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return p;let e=this._getObject(this._selectedEntryId);if(!e)return o`<p>Object not found.</p>`;let t=e.object,i=this._lang,a=this._isOperator,l=e.tasks.filter(d=>d.archived).length,c=e.tasks.filter(d=>this._showArchived||!d.archived);return o`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${t.name}</h2>
          <div class="action-buttons">
            ${a?p:o`
              <ha-button appearance="plain" @click=${()=>{this.shadowRoot.querySelector("maintenance-object-dialog")?.openEdit(e.entry_id,t)}}>${s("edit",i)}</ha-button>
              <ha-button appearance="filled" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate(e.entry_id)}}>${s("add_task",i)}</ha-button>
              <ha-button appearance="plain" @click=${()=>this._toggleArchiveObject(e.entry_id,!!t.archived)}>
                <ha-icon icon="${t.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                ${t.archived?s("unarchive_object",i):s("archive_object",i)}
              </ha-button>
              <ha-button variant="danger" appearance="plain" @click=${()=>this._deleteObject(e.entry_id)}>${s("delete",i)}</ha-button>
            `}
            <ha-button appearance="plain" @click=${()=>this._openQrForObject(e.entry_id,t.name)}><ha-icon icon="mdi:qrcode"></ha-icon> ${s("qr_code",i)}</ha-button>
          </div>
        </div>
        ${t.manufacturer||t.model?o`<p class="meta">${[t.manufacturer,t.model].filter(Boolean).join(" ")}</p>`:p}
        ${t.serial_number?o`<p class="meta">${s("serial_number_label",i)}: ${t.serial_number}</p>`:p}
        ${t.documentation_url&&/^https?:\/\//i.test(t.documentation_url)?o`<p class="meta">${s("documentation_url_label",i)}:
              <a href=${t.documentation_url} target="_blank" rel="noopener noreferrer">${t.documentation_url}</a>
            </p>`:p}
        ${t.installation_date?o`<p class="meta">${s("installed",i)}: ${Y(t.installation_date,i)}</p>`:p}
        ${t.warranty_expiry?this._renderWarrantyMeta(t.warranty_expiry,i):p}
        ${t.notes?o`<div class="object-notes">
              <div class="object-notes-label">${s("object_notes_label",i)}</div>
              <div class="object-notes-body">${t.notes}</div>
            </div>`:p}

        <maintenance-documents-section
          .hass=${this.hass}
          .entryId=${e.entry_id}
          .canWrite=${!a}
        ></maintenance-documents-section>

        <h3>${s("tasks",i)} (${c.length})${l>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            appearance="plain"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",i):`${s("show_archived",i)} (${l})`}
          </ha-button>`:p}</h3>
        ${e.tasks.length===0?o`<div class="empty-state-centered">
              <p class="empty">${s("no_tasks_yet",i)}</p>
              <ha-button appearance="filled" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate(e.entry_id)}}>${s("add_first_task",i)}</ha-button>
            </div>`:o`<div class="task-table">${[...c].sort((d,_)=>{let g={overdue:0,triggered:1,due_soon:2,ok:3};return(g[d.status]??9)-(g[_.status]??9)||(d.days_until_due??99999)-(_.days_until_due??99999)}).map(d=>o`
              <div class="task-row${d.enabled?"":" task-disabled"}">
                <span class="cell-badges">
                  <span class="status-badge ${d.archived?"archived":d.is_done?"done":d.status}">${d.archived?s("archived",i):d.is_done?s("completed",i):s(d.status,i)}</span>
                  ${d.enabled?p:o`<span class="badge-disabled">${s("disabled",i)}</span>`}
                  ${d.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:p}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,d.id)}>${d.name}</span>
                <span class="task-sub${d.responsible_user_id?"":" task-sub-empty"}">${this._renderUserBadge(d)}</span>
                <span class="cell type">${s(d.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(e.entry_id,d.id)}>
                  <span class="due-text">${ze(d.days_until_due,i)}</span>
                  ${d.trigger_config?It(d):p}
                  ${Mt(d,this._miniStatsData,this._lang)}
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${s("complete",i)}" @click=${_=>{_.stopPropagation(),this._openCompleteDialog(e.entry_id,d.id,d.name,this._features.checklists?d.checklist:void 0,this._features.adaptive&&!!d.adaptive_config?.enabled)}}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${s("skip",i)}" .disabled=${this._actionLoading} @click=${_=>{_.stopPropagation(),this._promptSkipTask(e.entry_id,d.id)}}>
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </mwc-icon-button>
                </span>
              </div>
            `)}</div>`}
      </div>
    `}_renderTaskHeader(e){let t=this._lang,a=this._getObject(this._selectedEntryId)?.object.name||"",l=this._isOperator,c=e.archived?"archived":e.is_done?"done":e.status==="due_soon"?"warning":e.status||"ok",d=e.archived?s("archived",t):e.is_done?s("completed",t):s(e.status||"ok",t);return o`
      <div class="task-header">
        <div class="task-header-title">
          <span class="task-name-breadcrumb" @click=${()=>this._view="task"}>${e.name}</span>
          <span class="breadcrumb-separator">·</span>
          <span class="object-name-breadcrumb" @click=${()=>this._showObject(this._selectedEntryId)}>${a}</span>
          <span class="status-chip ${c}">${d}</span>
          ${this._renderUserBadge(e)}
          ${e.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_tag_id",t)}: ${e.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:l?p:o`<span class="nfc-badge unlinked" title="${s("nfc_link_hint",t)}"
                @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,e)}}>
                <ha-icon icon="mdi:nfc-variant"></ha-icon>
              </span>`}
        </div>
        <div class="task-header-actions">
          <ha-button appearance="filled" @click=${()=>this._openCompleteDialog(this._selectedEntryId,this._selectedTaskId,e.name,this._features.checklists?e.checklist:void 0,this._features.adaptive&&!!e.adaptive_config?.enabled)}>${s("complete",t)}</ha-button>
          <ha-button appearance="plain" .disabled=${this._actionLoading} @click=${()=>this._promptSkipTask(this._selectedEntryId,this._selectedTaskId)}>${s("skip",t)}</ha-button>
          ${l?p:o`
            <ha-button appearance="plain" @click=${()=>this._toggleArchiveTask(this._selectedEntryId,this._selectedTaskId,!!e.archived)}>
              <ha-icon icon="${e.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
              ${e.archived?s("unarchive",t):s("archive",t)}
            </ha-button>
          `}
          <ha-button appearance="plain" @click=${()=>{let _=this._getObject(this._selectedEntryId)?.object;this._openQrForTask(this._selectedEntryId,this._selectedTaskId,_?.name||"",e.name)}}><ha-icon icon="mdi:qrcode"></ha-icon> ${s("qr_code",t)}</ha-button>
          ${l?p:o`
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${this._toggleMoreMenu}></ha-icon-button>
              ${this._moreMenuOpen?o`
                <div class="popup-menu" @click=${_=>_.stopPropagation()}>
                  <div class="popup-menu-item" @click=${()=>{this._closeMoreMenu(),this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,e)}}>${s("edit",t)}</div>
                  <div class="popup-menu-item" @click=${()=>this._duplicateTask(this._selectedEntryId,this._selectedTaskId)}>${s("duplicate",t)}</div>
                  <div class="popup-menu-item" @click=${()=>{this._closeMoreMenu(),this._promptResetTask(this._selectedEntryId,this._selectedTaskId)}}>${s("reset",t)}</div>
                  <div class="popup-menu-divider"></div>
                  <div class="popup-menu-item danger" @click=${()=>{this._closeMoreMenu(),this._deleteTask(this._selectedEntryId,this._selectedTaskId)}}>${s("delete",t)}</div>
                </div>
              `:p}
            </div>
          `}
        </div>
      </div>
    `}_toggleMoreMenu(){if(this._moreMenuOpen=!this._moreMenuOpen,this._moreMenuOpen){let e=()=>{this._moreMenuOpen=!1,document.removeEventListener("click",e)};setTimeout(()=>document.addEventListener("click",e,{once:!0}),0)}}_closeMoreMenu(){this._moreMenuOpen=!1}_renderUserBadge(e){if(!e.responsible_user_id||!this._userService)return p;let t=this._userService.getUserName(e.responsible_user_id);return t?o`
      <span class="user-badge">
        <ha-icon icon="mdi:account"></ha-icon>
        ${t}
      </span>
    `:p}_renderTabBar(){let e=this._lang;return o`
      <div class="tab-bar">
        <div class="tab ${this._activeTab==="overview"?"active":""}" @click=${()=>this._activeTab="overview"}>
          ${s("overview",e)}
        </div>
        <div class="tab ${this._activeTab==="history"?"active":""}" @click=${()=>this._activeTab="history"}>
          ${s("history",e)}
        </div>
      </div>
    `}_renderTabContent(e){switch(this._activeTab){case"overview":return this._renderOverviewTab(e);case"history":return this._renderHistoryTab(e);default:return p}}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,isCounterEntity:e=>this._isCounterEntity(e),rangeDays:this._chartRangeDays,setRangeDays:e=>this._setChartRange(e)}}_renderOverviewTab(e){let t=this._lang,i=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,a=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1,l=i||a,c=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,d=this._features.seasonal&&(e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12);return o`
      <div class="tab-content overview-tab">
        ${this._renderKPIBar(e)}
        ${this._renderTaskMeta(e)}
        ${Si(e,this._lang)}
        ${mi(e,this._sparklineCtx)}
        ${bi(e,t,this._features)}
        <div class="two-column-layout ${l?"":"single-column"}">
          ${l?o`
            <div class="left-column">
              ${this._renderRecommendationCard(e)}
              ${wi(e,t,this._features)}
            </div>
          `:p}
          <div class="right-column">
            ${Ei(e,t,this._costDurationToggle,_=>{this._costDurationToggle=_})}
          </div>
        </div>
        ${c?yi(e,t):p}
        ${d?o`
          ${ki(e,t)}
          <div class="seasonal-actions">
            <ha-button appearance="plain" @click=${()=>this._openSeasonalOverrides(e)}>
              ${s("edit_seasonal_overrides",t)}
            </ha-button>
          </div>
        `:p}
        ${this._renderChecklistCard(e)}
        ${this._renderRecentActivities(e)}
      </div>
    `}_renderChecklistCard(e){if(!this._features.checklists)return p;let t=e.checklist||[];if(t.length===0)return p;let i=this._lang;return o`
      <div class="checklist-preview-card">
        <div class="checklist-preview-header">
          <ha-icon icon="mdi:format-list-checks"></ha-icon>
          <span>${s("checklist",i)} (${t.length})</span>
        </div>
        <ol class="checklist-preview-list">
          ${t.map(a=>o`<li>${a}</li>`)}
        </ol>
      </div>
    `}_historyCtx(){return{lang:this._lang,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._budget?.currency_symbol||"\u20AC",setFilter:e=>{this._historyFilter=e},setSearch:e=>{this._historySearch=e},openEdit:e=>this._openHistoryEdit(e)}}_renderHistoryTab(e){let t=this._historyCtx();return o`
      <div class="tab-content history-tab">
        ${Ai(e,t)}
        ${ji(e,t)}
      </div>
    `}_renderTaskMeta(e){let t=e.documentation_url&&/^https?:\/\//i.test(e.documentation_url)?e.documentation_url:null,i=this._selectedEntryId?this._getObject(this._selectedEntryId):void 0,a=i?.object?.documentation_url,l=a&&/^https?:\/\//i.test(a)?a:null;if(!e.notes&&!t&&!l)return p;let c=this._lang;return o`
      <div class="task-meta-card">
        ${e.notes?o`
          <div class="task-meta-row">
            <ha-icon icon="mdi:note-text-outline"></ha-icon>
            <span class="task-meta-notes">${e.notes}</span>
          </div>
        `:p}
        ${t?o`
          <div class="task-meta-row task-meta-link">
            <ha-icon icon="mdi:open-in-new"></ha-icon>
            <a href="${t}" target="_blank" rel="noopener noreferrer">${s("documentation_label",c)}</a>
          </div>
        `:p}
        ${l?o`
          <div class="task-meta-row task-meta-link">
            <ha-icon icon="mdi:book-open-variant"></ha-icon>
            <a href="${l}" target="_blank" rel="noopener noreferrer">${s("documentation_url_label",c)} (${i?.object?.name||""})</a>
          </div>
        `:p}
      </div>
    `}_renderKPIBar(e){let t=this._lang,i=e.times_performed>0?e.total_cost/e.times_performed:0,a=e.days_until_due!==null&&e.days_until_due!==void 0?e.days_until_due<0?"overdue":e.days_until_due<=e.warning_days?"warning":"":"";return o`
      <div class="kpi-bar">
        <div class="kpi-card">
          <div class="kpi-label">${s("next_due",t)}</div>
          <div class="kpi-value">${e.next_due?Y(e.next_due,t):"\u2014"}</div>
          ${this._features.schedule_time&&e.schedule_time?o`<div class="kpi-subtext">${s("at_time",t)} ${e.schedule_time}</div>`:p}
        </div>
        <div class="kpi-card ${a}">
          <div class="kpi-label">${s("days_until_due",t)}</div>
          <div class="kpi-value-large">${e.days_until_due!==null&&e.days_until_due!==void 0?e.days_until_due:"\u2014"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("interval",t)}</div>
          <div class="kpi-value">${ti(e,t)}</div>
          ${this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days?o`
            <div class="kpi-subtext">${s("recommended",t)}: ${e.suggested_interval}${e.interval_analysis?.confidence_interval_low!=null?` (${e.interval_analysis.confidence_interval_low}\u2013${e.interval_analysis.confidence_interval_high})`:""}</div>
          `:p}
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("warning",t)}</div>
          <div class="kpi-value">${e.warning_days} ${s("days",t)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("last_performed",t)}</div>
          <div class="kpi-value">${e.last_performed?Y(e.last_performed,t):"\u2014"}</div>
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
    `}_renderRecommendationCard(e){let t=this._lang;if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return p;if(this._selectedEntryId&&this._selectedTaskId&&this._dismissedSuggestions.has(`${this._selectedEntryId}_${this._selectedTaskId}`))return p;let i=e.suggested_interval;return o`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",t)}</h4>
        ${xi(e.interval_days,i,e.interval_confidence||"medium",t)}
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
    `}_renderRecentActivities(e){let t=this._lang,i=e.history.slice(-3).reverse();if(i.length===0)return p;let a=l=>{switch(l){case"completed":return"\u2713";case"triggered":return"\u2297";case"skipped":return"\u21B7";case"reset":return"\u21BA";default:return"\xB7"}};return o`
      <div class="recent-activities">
        <h3>${s("recent_activities",t)}</h3>
        ${i.map(l=>o`
          <div class="activity-item">
            <span class="activity-icon">${a(l.type)}</span>
            <span class="activity-date">${Je(l.timestamp,t)}</span>
            <span class="activity-note">${l.notes||"\u2014"}</span>
            ${l.cost?o`<span class="activity-badge">${l.cost.toFixed(0)}${this._budget?.currency_symbol||"\u20AC"}</span>`:p}
            ${l.duration?o`<span class="activity-badge">${l.duration}min</span>`:p}
          </div>
        `)}
        <div class="activity-show-all">
          <ha-button appearance="plain" @click=${()=>this._activeTab="history"}>${s("show_all",t)} →</ha-button>
        </div>
      </div>
    `}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return p;let e=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!e)return o`<p>Task not found.</p>`;let t=this._lang;return o`
      <div class="detail-section">
        ${this._renderTaskHeader(e)}
        ${this._renderTabBar()}
        ${this._renderTabContent(e)}
        <maintenance-task-documents
          .hass=${this.hass}
          .entryId=${this._selectedEntryId}
          .taskId=${this._selectedTaskId}
          .canWrite=${!this._isOperator}
        ></maintenance-task-documents>
      </div>
    `}_openHistoryEdit(e){if(!this._selectedEntryId||!this._selectedTaskId)return;let t={entry_id:this._selectedEntryId,task_id:this._selectedTaskId,original_timestamp:e.timestamp,type:e.type,timestamp:e.timestamp,notes:e.notes??null,cost:e.cost??null,duration:e.duration??null,completed_by:e.completed_by??null};this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(t)}};S.styles=[Xe,ii],u([y({attribute:!1})],S.prototype,"hass",2),u([y({type:Boolean,reflect:!0})],S.prototype,"narrow",2),u([y({attribute:!1})],S.prototype,"panel",2),u([h()],S.prototype,"_objects",2),u([h()],S.prototype,"_stats",2),u([h()],S.prototype,"_view",2),u([h()],S.prototype,"_selectedEntryId",2),u([h()],S.prototype,"_selectedTaskId",2),u([h()],S.prototype,"_filterStatus",2),u([h()],S.prototype,"_filterUser",2),u([h()],S.prototype,"_unsub",2),u([h()],S.prototype,"_chartRangeDays",2),u([h()],S.prototype,"_historyFilter",2),u([h()],S.prototype,"_budget",2),u([h()],S.prototype,"_groups",2),u([h()],S.prototype,"_detailStatsData",2),u([h()],S.prototype,"_miniStatsData",2),u([h()],S.prototype,"_features",2),u([h()],S.prototype,"_adminPanelUserIds",2),u([h()],S.prototype,"_operatorWriteEnabled",2),u([h()],S.prototype,"_defaultWarningDays",2),u([h()],S.prototype,"_actionLoading",2),u([h()],S.prototype,"_moreMenuOpen",2),u([h()],S.prototype,"_toastMessage",2),u([h()],S.prototype,"_overviewTab",2),u([h()],S.prototype,"_activeTab",2),u([h()],S.prototype,"_costDurationToggle",2),u([h()],S.prototype,"_historySearch",2),u([h()],S.prototype,"_sortMode",2),u([h()],S.prototype,"_objectSortMode",2),u([h()],S.prototype,"_groupByMode",2),u([h()],S.prototype,"_objectViewMode",2),u([h()],S.prototype,"_objectsTableColumns",2),u([h()],S.prototype,"_showArchived",2),S=u([Qt("maintenance-supporter-panel")],S);export{S as MaintenanceSupporterPanel};
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
