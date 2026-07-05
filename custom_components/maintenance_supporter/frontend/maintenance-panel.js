var Li=Object.defineProperty;var Pi=Object.getOwnPropertyDescriptor;var p=(n,r,t,e)=>{for(var i=e>1?void 0:e?Pi(r,t):r,a=n.length-1,l;a>=0;a--)(l=n[a])&&(i=(e?l(r,t,i):l(i))||i);return e&&i&&Li(r,t,i),i};var Wt=globalThis,Kt=Wt.ShadowRoot&&(Wt.ShadyCSS===void 0||Wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ve=Symbol(),qe=new WeakMap,Mt=class{constructor(r,t,e){if(this._$cssResult$=!0,e!==ve)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=t}get styleSheet(){let r=this.o,t=this.t;if(Kt&&r===void 0){let e=t!==void 0&&t.length===1;e&&(r=qe.get(t)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),e&&qe.set(t,r))}return r}toString(){return this.cssText}},Oe=n=>new Mt(typeof n=="string"?n:n+"",void 0,ve),A=(n,...r)=>{let t=n.length===1?n[0]:r.reduce((e,i,a)=>e+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[a+1],n[0]);return new Mt(t,n,ve)},Fe=(n,r)=>{if(Kt)n.adoptedStyleSheets=r.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of r){let e=document.createElement("style"),i=Wt.litNonce;i!==void 0&&e.setAttribute("nonce",i),e.textContent=t.cssText,n.appendChild(e)}},be=Kt?n=>n:n=>n instanceof CSSStyleSheet?(r=>{let t="";for(let e of r.cssRules)t+=e.cssText;return Oe(t)})(n):n;var{is:zi,defineProperty:Hi,getOwnPropertyDescriptor:Di,getOwnPropertyNames:qi,getOwnPropertySymbols:Oi,getPrototypeOf:Fi}=Object,Yt=globalThis,Ne=Yt.trustedTypes,Ni=Ne?Ne.emptyScript:"",Ui=Yt.reactiveElementPolyfillSupport,Rt=(n,r)=>n,Lt={toAttribute(n,r){switch(r){case Boolean:n=n?Ni:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,r){let t=n;switch(r){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},Gt=(n,r)=>!zi(n,r),Ue={attribute:!0,type:String,converter:Lt,reflect:!1,useDefault:!1,hasChanged:Gt};Symbol.metadata??=Symbol("metadata"),Yt.litPropertyMetadata??=new WeakMap;var ot=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,t=Ue){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(r,t),!t.noAccessor){let e=Symbol(),i=this.getPropertyDescriptor(r,e,t);i!==void 0&&Hi(this.prototype,r,i)}}static getPropertyDescriptor(r,t,e){let{get:i,set:a}=Di(this.prototype,r)??{get(){return this[t]},set(l){this[t]=l}};return{get:i,set(l){let c=i?.call(this);a?.call(this,l),this.requestUpdate(r,c,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??Ue}static _$Ei(){if(this.hasOwnProperty(Rt("elementProperties")))return;let r=Fi(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(Rt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Rt("properties"))){let t=this.properties,e=[...qi(t),...Oi(t)];for(let i of e)this.createProperty(i,t[i])}let r=this[Symbol.metadata];if(r!==null){let t=litPropertyMetadata.get(r);if(t!==void 0)for(let[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(let[t,e]of this.elementProperties){let i=this._$Eu(t,e);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){let t=[];if(Array.isArray(r)){let e=new Set(r.flat(1/0).reverse());for(let i of e)t.unshift(be(i))}else r!==void 0&&t.push(be(r));return t}static _$Eu(r,t){let e=t.attribute;return e===!1?void 0:typeof e=="string"?e:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){let r=new Map,t=this.constructor.elementProperties;for(let e of t.keys())this.hasOwnProperty(e)&&(r.set(e,this[e]),delete this[e]);r.size>0&&(this._$Ep=r)}createRenderRoot(){let r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Fe(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,t,e){this._$AK(r,e)}_$ET(r,t){let e=this.constructor.elementProperties.get(r),i=this.constructor._$Eu(r,e);if(i!==void 0&&e.reflect===!0){let a=(e.converter?.toAttribute!==void 0?e.converter:Lt).toAttribute(t,e.type);this._$Em=r,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(r,t){let e=this.constructor,i=e._$Eh.get(r);if(i!==void 0&&this._$Em!==i){let a=e.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Lt;this._$Em=i;let c=l.fromAttribute(t,a.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(r,t,e,i=!1,a){if(r!==void 0){let l=this.constructor;if(i===!1&&(a=this[r]),e??=l.getPropertyOptions(r),!((e.hasChanged??Gt)(a,t)||e.useDefault&&e.reflect&&a===this._$Ej?.get(r)&&!this.hasAttribute(l._$Eu(r,e))))return;this.C(r,t,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,t,{useDefault:e,reflect:i,wrapped:a},l){e&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,l??t??this[r]),a!==!0||l!==void 0)||(this._$AL.has(r)||(this.hasUpdated||e||(t=void 0),this._$AL.set(r,t)),i===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[i,a]of e){let{wrapped:l}=a,c=this[i];l!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,a,c)}}let r=!1,t=this._$AL;try{r=this.shouldUpdate(t),r?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(e){throw r=!1,this._$EM(),e}r&&this._$AE(t)}willUpdate(r){}_$AE(r){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(r){}firstUpdated(r){}};ot.elementStyles=[],ot.shadowRootOptions={mode:"open"},ot[Rt("elementProperties")]=new Map,ot[Rt("finalized")]=new Map,Ui?.({ReactiveElement:ot}),(Yt.reactiveElementVersions??=[]).push("2.1.2");var Ee=globalThis,Be=n=>n,Qt=Ee.trustedTypes,Ve=Qt?Qt.createPolicy("lit-html",{createHTML:n=>n}):void 0,Je="$lit$",ut=`lit$${Math.random().toFixed(9).slice(2)}$`,Ze="?"+ut,Bi=`<${Ze}>`,yt=document,zt=()=>yt.createComment(""),Ht=n=>n===null||typeof n!="object"&&typeof n!="function",Te=Array.isArray,Vi=n=>Te(n)||typeof n?.[Symbol.iterator]=="function",fe=`[ 	
\f\r]`,Pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,We=/-->/g,Ke=/>/g,bt=RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,Ge=/"/g,Xe=/^(?:script|style|textarea|title)$/i,Se=n=>(r,...t)=>({_$litType$:n,strings:r,values:t}),o=Se(1),P=Se(2),Qs=Se(3),lt=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),Qe=new WeakMap,ft=yt.createTreeWalker(yt,129);function ti(n,r){if(!Te(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ve!==void 0?Ve.createHTML(r):r}var Wi=(n,r)=>{let t=n.length-1,e=[],i,a=r===2?"<svg>":r===3?"<math>":"",l=Pt;for(let c=0;c<t;c++){let d=n[c],u,g,m=-1,v=0;for(;v<d.length&&(l.lastIndex=v,g=l.exec(d),g!==null);)v=l.lastIndex,l===Pt?g[1]==="!--"?l=We:g[1]!==void 0?l=Ke:g[2]!==void 0?(Xe.test(g[2])&&(i=RegExp("</"+g[2],"g")),l=bt):g[3]!==void 0&&(l=bt):l===bt?g[0]===">"?(l=i??Pt,m=-1):g[1]===void 0?m=-2:(m=l.lastIndex-g[2].length,u=g[1],l=g[3]===void 0?bt:g[3]==='"'?Ge:Ye):l===Ge||l===Ye?l=bt:l===We||l===Ke?l=Pt:(l=bt,i=void 0);let f=l===bt&&n[c+1].startsWith("/>")?" ":"";a+=l===Pt?d+Bi:m>=0?(e.push(u),d.slice(0,m)+Je+d.slice(m)+ut+f):d+ut+(m===-2?c:f)}return[ti(n,a+(n[t]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),e]},Dt=class n{constructor({strings:r,_$litType$:t},e){let i;this.parts=[];let a=0,l=0,c=r.length-1,d=this.parts,[u,g]=Wi(r,t);if(this.el=n.createElement(u,e),ft.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=ft.nextNode())!==null&&d.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(Je)){let v=g[l++],f=i.getAttribute(m).split(ut),w=/([.?@])?(.*)/.exec(v);d.push({type:1,index:a,name:w[2],strings:f,ctor:w[1]==="."?xe:w[1]==="?"?$e:w[1]==="@"?we:Et}),i.removeAttribute(m)}else m.startsWith(ut)&&(d.push({type:6,index:a}),i.removeAttribute(m));if(Xe.test(i.tagName)){let m=i.textContent.split(ut),v=m.length-1;if(v>0){i.textContent=Qt?Qt.emptyScript:"";for(let f=0;f<v;f++)i.append(m[f],zt()),ft.nextNode(),d.push({type:2,index:++a});i.append(m[v],zt())}}}else if(i.nodeType===8)if(i.data===Ze)d.push({type:2,index:a});else{let m=-1;for(;(m=i.data.indexOf(ut,m+1))!==-1;)d.push({type:7,index:a}),m+=ut.length-1}a++}}static createElement(r,t){let e=yt.createElement("template");return e.innerHTML=r,e}};function kt(n,r,t=n,e){if(r===lt)return r;let i=e!==void 0?t._$Co?.[e]:t._$Cl,a=Ht(r)?void 0:r._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(n),i._$AT(n,t,e)),e!==void 0?(t._$Co??=[])[e]=i:t._$Cl=i),i!==void 0&&(r=kt(n,i._$AS(n,r.values),i,e)),r}var ye=class{constructor(r,t){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){let{el:{content:t},parts:e}=this._$AD,i=(r?.creationScope??yt).importNode(t,!0);ft.currentNode=i;let a=ft.nextNode(),l=0,c=0,d=e[0];for(;d!==void 0;){if(l===d.index){let u;d.type===2?u=new qt(a,a.nextSibling,this,r):d.type===1?u=new d.ctor(a,d.name,d.strings,this,r):d.type===6&&(u=new ke(a,this,r)),this._$AV.push(u),d=e[++c]}l!==d?.index&&(a=ft.nextNode(),l++)}return ft.currentNode=yt,i}p(r){let t=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(r,e,t),t+=e.strings.length-2):e._$AI(r[t])),t++}},qt=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,t,e,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=r,this._$AB=t,this._$AM=e,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode,t=this._$AM;return t!==void 0&&r?.nodeType===11&&(r=t.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,t=this){r=kt(this,r,t),Ht(r)?r===h||r==null||r===""?(this._$AH!==h&&this._$AR(),this._$AH=h):r!==this._$AH&&r!==lt&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):Vi(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==h&&Ht(this._$AH)?this._$AA.nextSibling.data=r:this.T(yt.createTextNode(r)),this._$AH=r}$(r){let{values:t,_$litType$:e}=r,i=typeof e=="number"?this._$AC(r):(e.el===void 0&&(e.el=Dt.createElement(ti(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===i)this._$AH.p(t);else{let a=new ye(i,this),l=a.u(this.options);a.p(t),this.T(l),this._$AH=a}}_$AC(r){let t=Qe.get(r.strings);return t===void 0&&Qe.set(r.strings,t=new Dt(r)),t}k(r){Te(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,e,i=0;for(let a of r)i===t.length?t.push(e=new n(this.O(zt()),this.O(zt()),this,this.options)):e=t[i],e._$AI(a),i++;i<t.length&&(this._$AR(e&&e._$AB.nextSibling,i),t.length=i)}_$AR(r=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);r!==this._$AB;){let e=Be(r).nextSibling;Be(r).remove(),r=e}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}},Et=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,t,e,i,a){this.type=1,this._$AH=h,this._$AN=void 0,this.element=r,this.name=t,this._$AM=i,this.options=a,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=h}_$AI(r,t=this,e,i){let a=this.strings,l=!1;if(a===void 0)r=kt(this,r,t,0),l=!Ht(r)||r!==this._$AH&&r!==lt,l&&(this._$AH=r);else{let c=r,d,u;for(r=a[0],d=0;d<a.length-1;d++)u=kt(this,c[e+d],t,d),u===lt&&(u=this._$AH[d]),l||=!Ht(u)||u!==this._$AH[d],u===h?r=h:r!==h&&(r+=(u??"")+a[d+1]),this._$AH[d]=u}l&&!i&&this.j(r)}j(r){r===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}},xe=class extends Et{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===h?void 0:r}},$e=class extends Et{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==h)}},we=class extends Et{constructor(r,t,e,i,a){super(r,t,e,i,a),this.type=5}_$AI(r,t=this){if((r=kt(this,r,t,0)??h)===lt)return;let e=this._$AH,i=r===h&&e!==h||r.capture!==e.capture||r.once!==e.once||r.passive!==e.passive,a=r!==h&&(e===h||i);i&&this.element.removeEventListener(this.name,this,e),a&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}},ke=class{constructor(r,t,e){this.element=r,this.type=6,this._$AN=void 0,this._$AM=t,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(r){kt(this,r)}};var Ki=Ee.litHtmlPolyfillSupport;Ki?.(Dt,qt),(Ee.litHtmlVersions??=[]).push("3.3.2");var ei=(n,r,t)=>{let e=t?.renderBefore??r,i=e._$litPart$;if(i===void 0){let a=t?.renderBefore??null;e._$litPart$=i=new qt(r.insertBefore(zt(),a),a,void 0,t??{})}return i._$AI(n),i};var Ae=globalThis,S=class extends ot{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=ei(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return lt}};S._$litElement$=!0,S.finalized=!0,Ae.litElementHydrateSupport?.({LitElement:S});var Yi=Ae.litElementPolyfillSupport;Yi?.({LitElement:S});(Ae.litElementVersions??=[]).push("4.2.2");var ii=n=>(r,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(n,r)}):customElements.define(n,r)};var Gi={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:Gt},Qi=(n=Gi,r,t)=>{let{kind:e,metadata:i}=t,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),e==="setter"&&((n=Object.create(n)).wrapped=!0),a.set(t.name,n),e==="accessor"){let{name:l}=t;return{set(c){let d=r.get.call(this);r.set.call(this,c),this.requestUpdate(l,d,n,!0,c)},init(c){return c!==void 0&&this.C(l,void 0,n,c),c}}}if(e==="setter"){let{name:l}=t;return function(c){let d=this[l];r.call(this,c),this.requestUpdate(l,d,n,!0,c)}}throw Error("Unsupported decorator location: "+e)};function y(n){return(r,t)=>typeof t=="object"?Qi(n,r,t):((e,i,a)=>{let l=i.hasOwnProperty(a);return i.constructor.createProperty(a,e),l?Object.getOwnPropertyDescriptor(i,a):void 0})(n,r,t)}function _(n){return y({...n,state:!0,attribute:!1})}var si={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",ok:"OK",all:"All",new_object:"+ New Object",templates_from:"From template",templates_title:"Start from a template",templates_task_count:"{n} tasks",template_created:"Created from template",onboard_hint:"Add your first object to start tracking maintenance.",edit:"Edit",duplicate:"Duplicate",task_duplicated:"Task duplicated",object_duplicated:"Object duplicated",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",missed:"Missed",reset:"Reset",snooze:"Snooze",snoozed:"Snoozed",cancel:"Cancel",bulk_select:"Select",bulk_select_all:"Select all",bulk_n_selected:"{n} selected",bulk_completed:"{n} tasks completed",bulk_archived:"{n} tasks archived",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",runtime_hours:"Target runtime (hours)",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",custom:"Custom",history:"History",cost:"Cost",report_button:"Report",report_title:"Maintenance report",report_generated:"Generated",report_times_done:"Done",report_total_cost:"Total cost",report_every:"every {n} {unit}",report_notes:"Notes",report_col_type:"Type",report_col_status:"Status",report_col_schedule:"Schedule",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_optional:"Due at time (optional, HH:MM)",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",priority:"Priority",labels:"Labels",labels_placeholder:"e.g. safety, seasonal, tenant-visible",labels_help:"Comma-separated tags for filtering and reporting.",priority_low:"Low",priority_normal:"Normal",priority_high:"High",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",earliest_completion_days:"Earliest completion (days before due)",earliest_completion_days_help:"Leave empty to allow completing any time. 0 = only on/after the due date.",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",tasks_lower:"tasks",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",safety_interval:"Safety interval (optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",shared_with:"Shared with (rotation)",shared_with_help:"Pick multiple people to share this task; the responsible person rotates on each completion.",rotation_strategy:"Rotation",rotation_none:"No rotation",rotation_round_robin:"Round-robin",rotation_least_completed:"Least completed",rotation_random:"Random",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_window_7:"7 days",cal_window_14:"14 days",cal_window_30:"30 days",cal_window_365:"1 year",cal_every_n_days:"every {n} days",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",hide_outliers:"Hide outliers (sensor glitches)",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",no_advanced_features_hint:"Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",completions:"completions",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",compound:"Compound (multiple conditions)",compound_logic_and:"AND \u2014 all conditions must trigger",compound_logic_or:"OR \u2014 any condition triggers",compound_help:"Combine several sensor conditions into one trigger.",compound_no_conditions:"No conditions yet \u2014 add at least one.",compound_add_condition:"Add condition",compound_condition:"Condition",compound_remove_condition:"Remove condition",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",tab_today:"Today",palette_placeholder:"Search objects and tasks\u2026",palette_no_results:"No matches",palette_hint:"\u2191\u2193 to navigate \xB7 Enter to open \xB7 Esc to close",today_all_caught_up:"All caught up! Nothing due this week.",today_overdue:"Overdue",today_due_today:"Due today",today_this_week:"This week",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_predictions:"Sensor Predictions",feat_predictions_desc:"Predict trigger dates from sensor degradation",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_weekly_digest:"Weekly digest",settings_weekly_digest_hint:"A single summary notification on Monday morning when tasks are due.",settings_warranty_reminder:"Warranty expiry reminder",settings_warranty_reminder_days:"Days before expiry",settings_warranty_reminder_hint:"Notify once when an object's warranty is this many days from expiring.",settings_snooze_hours:"Snooze duration (hours)",settings_budget:"Budget",settings_currency:"Currency",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_import_csv:"Import CSV",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",filter_label:"Filter",user_label:"User",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",group_delete_confirm:'Delete group "{name}"?',groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else sees only Complete and Skip.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc:"Per-task HA action on complete + quick-complete QR with pre-set values.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_service:"Service",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",quick_complete_defaults_title:"Quick-complete defaults (for QR scans, optional)",quick_complete_defaults_desc:"Pre-set values for quick-complete QR scans. Without these, the QR opens the complete dialog.",quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026",archive:"Archive",undo:"Undo",task_archived:"Task archived",object_archived:"Object archived",unarchive:"Unarchive",archived:"Archived",show_archived:"Show archived",hide_archived:"Hide archived",confirm_archive_object:"Archive this object and its tasks? They keep their history and can be unarchived later.",settings_archive:"Archive & Retention",settings_archive_desc:"Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",settings_archive_oneoff_days:"Auto-archive completed one-off tasks after (days, 0 = off)",settings_delete_archived_oneoff_days:"Auto-delete archived one-off tasks after (days, 0 = never)",archive_object:"Archive object",unarchive_object:"Unarchive object",documents:"Documents",documents_empty:"No documents yet.",doc_upload:"Upload file",doc_uploading:"Uploading\u2026",doc_add_link:"Add link",doc_link_url:"URL (https://\u2026)",doc_link_title:"Title (optional)",doc_open:"Open",doc_delete_confirm:'Delete "{name}"?',doc_too_large:"File is too large (max 25 MB).",doc_upload_failed:"Upload failed.",completion_photo_optional:"Completion photo (optional)",add_photo:"Add photo",uploading:"Uploading\u2026",remove:"Remove",doc_deduped:"Already stored elsewhere \u2014 shared, no extra space used.",doc_dup_in_object:"This file is already attached to this object.",doc_link_invalid:"Only http/https links are allowed.",doc_cat_manual:"Manual",doc_cat_warranty:"Warranty",doc_cat_invoice:"Invoice",doc_cat_spare_parts:"Spare parts",doc_cat_photo:"Photo",doc_cat_other:"Other",doc_link_badge:"Link",doc_storage_title:"Document storage",doc_storage_saved:"Saved via deduplication",doc_storage_refresh:"Refresh",doc_download:"Download",doc_close:"Close",doc_camera:"Take photo",doc_drop_hint:"Drop files here",doc_task_none:"No documents linked to this task.",doc_link_existing:"Link a document\u2026",doc_attach:"Link",doc_unlink:"Unlink",doc_page:"Page",chart_range_7d:"7d",chart_range_30d:"30d",chart_range_90d:"90d",chart_range_1y:"1y",chart_since_service:"since last service",chart_no_stats:"No long-term statistics for this entity \u2014 showing maintenance-event values only",auto_complete_on_recovery:"Auto-complete when the sensor recovers",auto_complete_on_recovery_help:"Records a completion (sets last performed) when the trigger clears itself \u2014 e.g. salt refilled, filter replaced.",doc_search:"Search documents\u2026",doc_search_none:"No matching documents"};var _t="\u20AC",Xt={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"var(--deep-orange-color, #ff5722)",archived:"var(--disabled-color, #9e9e9e)"},te={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",archived:"mdi:archive-outline",completed:"mdi:check-circle",skipped:"mdi:skip-next",missed:"mdi:calendar-remove",reset:"mdi:refresh"},Ce="en",Ot={en:si},Zi=new Set(["de","nl","fr","it","es","pt","ru","uk","pl","cs","sv","zh","da","fi","nb","ja","hi"]),Xi="/maintenance_supporter_locales",je={};function Ie(n){return(n||Ce).substring(0,2).toLowerCase()}function s(n,r){let t=Ie(r);return Ot[t]?.[n]??Ot.en[n]??n}function ee(n){let r=Ie(n);return r===Ce||r in Ot}function at(n){let r=Ie(n);return r===Ce||r in Ot||!Zi.has(r)?Promise.resolve():(r in je||(je[r]=fetch(`${Xi}/${r}.json`).then(t=>t.ok?t.json():null).then(t=>{t&&(Ot[r]=t)}).catch(()=>{})),je[r])}function ri(n){let r=(n||"en").substring(0,2).toLowerCase();return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN",da:"da-DK",fi:"fi-FI",nb:"nb-NO",ja:"ja-JP",hi:"hi-IN"}[r]??"en-US"}function K(n,r){if(!n)return"\u2014";try{let t=n.includes("T")?n:n+"T00:00:00";return new Date(t).toLocaleDateString(ri(r),{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return n}}function ie(n,r){if(!n)return"\u2014";try{let t=ri(r),e=new Date(n);return e.toLocaleDateString(t,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+e.toLocaleTimeString(t,{hour:"2-digit",minute:"2-digit"})}catch{return n}}function Tt(n,r){if(n==null)return"\u2014";let t=r||"en";return n<0?`${Math.abs(n)} ${s("d_overdue",t)}`:n===0?s("today",t):`${n} ${s(n===1?"day":"days",t)}`}function ai(n,r,t){return n==null?"\u2014":`${n} ${s("unit_"+(r||"days"),t)}`}function Zt(n,r,t="long"){let e=(r||"en").substring(0,2);return new Date(Date.UTC(2024,0,1+n)).toLocaleDateString(e,{weekday:t,timeZone:"UTC"})}function Me(n,r){let t=n.schedule;switch(t?.kind){case"weekdays":return(t.weekdays||[]).map(e=>Zt(e,r,"short")).join(" & ")||"\u2014";case"nth_weekday":return t.weekday==null||t.nth==null?"\u2014":`${t.nth===-1?s("ord_last",r):s("ord_"+t.nth,r)} ${Zt(t.weekday,r,"long")}`;case"day_of_month":return t.day!=null?`${s("day_word",r)} ${t.day}`:"\u2014";case"one_time":return n.due_date?K(n.due_date,r):s("one_time",r);case"manual":return s("manual",r);case"interval":return ai(t.every,t.unit,r)}return n.schedule_type==="one_time"?n.due_date?K(n.due_date,r):s("one_time",r):n.schedule_type==="manual"?s("manual",r):n.schedule_type==="sensor_based"?s("sensor_based",r):n.interval_days!=null?ai(n.interval_days,n.interval_unit,r):"\u2014"}function xt(n,r){n.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:r},bubbles:!0,composed:!0}))}var se=A`
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
  /* Shape icon so status is not conveyed by colour alone (accessibility). */
  .status-badge ha-icon { --mdc-icon-size: 14px; margin-left: -1px; }

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
`;var ts={days:1,weeks:7,months:30.4368,years:365.25};function Re(n,r){return!n||n<=0?0:n*(ts[r||"days"]??1)}function ae(n,r,t){let e=Re(n,t);if(e<=0||r==null)return{pct:0,overflow:!1};let i=(e-r)/e*100;return{pct:Math.max(0,Math.min(100,i)),overflow:i>100}}function L(n){return String(n??"").replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r])}function ni(n,r,t,e,i,a){let l=[[t.manufacturer,n.manufacturer],[t.model,n.model],[t.serial,n.serial_number],[t.installed,n.installation_date?e(n.installation_date):null],[t.warranty,n.warranty_expiry?e(n.warranty_expiry):null]].filter(([,u])=>!!u),c=r.map(u=>{let g=t.scheduleLabel(u);return`<tr>
      <td>${L(u.name)}</td>
      <td>${L(t.typeLabel(u.type))}</td>
      <td>${L(t.statusLabel(u.status))}</td>
      <td>${L(g)}</td>
      <td>${L(u.last_performed?e(u.last_performed):t.none)}</td>
      <td>${L(u.next_due?e(u.next_due):t.none)}</td>
      <td class="num">${u.times_performed??0}</td>
      <td class="num">${(u.total_cost??0).toFixed(2)} ${L(i)}</td>
    </tr>`}).join(""),d=r.reduce((u,g)=>u+(g.total_cost??0),0);return`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${L(t.title)} \u2014 ${L(n.name)}</title>
<style>
  * { box-sizing: border-box; }
  body { font: 13px/1.5 -apple-system, Segoe UI, Roboto, sans-serif; color: #1a1a1a; margin: 32px; }
  h1 { font-size: 22px; margin: 0 0 2px; }
  .sub { color: #666; margin: 0 0 20px; }
  .meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 6px 24px; margin-bottom: 20px; }
  .meta div { border-bottom: 1px solid #eee; padding: 4px 0; }
  .meta .k { color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
  h2 { font-size: 15px; margin: 24px 0 8px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 7px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
  th { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #888; border-bottom: 2px solid #ccc; }
  td.num, th.num { text-align: right; }
  tfoot td { font-weight: 600; border-top: 2px solid #ccc; border-bottom: none; }
  .notes { margin-top: 16px; white-space: pre-wrap; color: #333; }
  @media print { body { margin: 0; } @page { margin: 16mm; } }
</style></head><body>
  <h1>${L(n.name)}</h1>
  <p class="sub">${L(t.title)} \xB7 ${L(t.generated)}: ${L(e(a))}</p>
  ${l.length?`<div class="meta">${l.map(([u,g])=>`<div><div class="k">${L(u)}</div>${L(g)}</div>`).join("")}</div>`:""}
  <h2>${L(t.tasksHeading)} (${r.length})</h2>
  <table>
    <thead><tr>
      <th>${L(t.colTask)}</th><th>${L(t.colType)}</th><th>${L(t.colStatus)}</th>
      <th>${L(t.colSchedule)}</th><th>${L(t.colLastDone)}</th><th>${L(t.colNextDue)}</th>
      <th class="num">${L(t.colTimes)}</th><th class="num">${L(t.colCost)}</th>
    </tr></thead>
    <tbody>${c||`<tr><td colspan="8">${L(t.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${L(t.totalCost)}</td><td class="num">${d.toFixed(2)} ${L(i)}</td></tr></tfoot>
  </table>
  ${n.notes?`<div class="notes"><strong>${L(t.notes)}:</strong>
${L(n.notes)}</div>`:""}
</body></html>`}function Le(n,r=new Date){if(!n)return{kind:"none",days:null,date:null};let t=new Date(`${n}T00:00:00`);if(isNaN(t.getTime()))return{kind:"none",days:null,date:null};let e=Date.UTC(r.getFullYear(),r.getMonth(),r.getDate()),i=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),a=Math.round((i-e)/864e5);return a<0?{kind:"expired",days:a,date:n}:a<=60?{kind:"expiring",days:a,date:n}:{kind:"valid",days:a,date:n}}var St=[{key:"name",labelKey:"name",required:!0},{key:"manufacturer",labelKey:"manufacturer"},{key:"model",labelKey:"model"},{key:"serial_number",labelKey:"serial_number_label"},{key:"installation_date",labelKey:"installed"},{key:"warranty_expiry",labelKey:"warranty"},{key:"area_id",labelKey:"area"},{key:"documentation_url",labelKey:"documentation_url_label"},{key:"notes",labelKey:"object_notes_label"},{key:"task_count",labelKey:"tasks"},{key:"actions",labelKey:"actions"}],es=St.map(n=>n.key),re=["name","manufacturer","model","serial_number","installation_date","warranty_expiry","area_id","task_count","actions"];function Ft(n){if(!Array.isArray(n))return[...re];let r=new Set,t=[];for(let e of n)typeof e=="string"&&es.includes(e)&&!r.has(e)&&(r.add(e),t.push(e));return t.length?(t.includes("name")||t.unshift("name"),t):[...re]}function ne(n,r,t){let e=new Blob([n],{type:t}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=r,a.target="_blank",a.rel="noopener",a.style.display="none",document.body.appendChild(a),a.dispatchEvent(new MouseEvent("click")),document.body.removeChild(a),setTimeout(()=>URL.revokeObjectURL(i),6e4)}function oe(n,r){let t=document.createElement("a");t.href=n,t.download=r,t.target="_blank",t.rel="noopener",t.style.display="none",document.body.appendChild(t),t.dispatchEvent(new MouseEvent("click")),document.body.removeChild(t)}var oi=A`
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

  /* Bulk selection: a leading checkbox column while selecting. */
  .task-table.bulk { grid-template-columns: auto auto minmax(100px, 180px) minmax(120px, 1fr) minmax(0, 220px) 100px 150px auto; }
  .bulk-check { display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .bulk-check input, .bulk-selectall input { width: 17px; height: 17px; cursor: pointer; accent-color: var(--primary-color); }
  .task-row.bulk-selected { background: color-mix(in srgb, var(--primary-color) 12%, transparent); }
  .bulk-bar {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    padding: 8px 12px; margin-bottom: 8px; border-radius: 8px;
    background: var(--secondary-background-color); border: 1px solid var(--divider-color);
    position: sticky; top: 0; z-index: 5;
  }
  .bulk-selectall { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; }
  .bulk-count { color: var(--secondary-text-color); font-size: 13px; }
  .bulk-actions { margin-left: auto; display: inline-flex; gap: 8px; }
  .bulk-toggle.active { --mdc-theme-primary: var(--primary-color); }

  /* Collapsible analysis sections on the task-detail overview tab. The header
     owns the title, so the wrapped card's own title row is hidden to avoid
     showing it twice. */
  .collapsible { margin: 8px 0; border: 1px solid var(--divider-color); border-radius: 10px; overflow: hidden; }
  .collapsible-head {
    display: flex; align-items: center; gap: 8px; width: 100%;
    font: inherit; font-weight: 600; font-size: 14px; text-align: left;
    padding: 10px 12px; cursor: pointer; background: var(--secondary-background-color);
    border: none; color: var(--primary-text-color);
  }
  .collapsible-head:hover { background: var(--table-row-alternative-background-color, rgba(0,0,0,.04)); }
  .collapsible-head ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); }
  .collapsible-body { padding: 4px 12px 12px; }
  .collapsible-body > .weibull-section > .weibull-title,
  .collapsible-body > .seasonal-chart > .seasonal-chart-title { display: none; }

  /* "Today" focus view — mobile-first list grouped by urgency. */
  .today-view { display: flex; flex-direction: column; gap: 16px; padding: 4px 0 12px; }
  .today-section { border: 1px solid var(--divider-color); border-radius: 12px; overflow: hidden; }
  .today-section-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; font-weight: 600; font-size: 14px;
    background: var(--secondary-background-color);
    border-left: 4px solid var(--divider-color);
  }
  .today-section-header.overdue { border-left-color: var(--error-color, #f44336); }
  .today-section-header.due_soon { border-left-color: var(--warning-color, #ff9800); }
  .today-badge {
    min-width: 22px; text-align: center; padding: 1px 8px; border-radius: 11px;
    background: var(--primary-color); color: var(--text-primary-color, #fff); font-size: 12.5px;
  }
  .today-row {
    display: flex; align-items: center; gap: 12px; padding: 11px 14px;
    border-top: 1px solid var(--divider-color); cursor: pointer;
    content-visibility: auto; contain-intrinsic-size: auto 46px;
  }
  .today-row:hover { background: var(--table-row-alternative-background-color, rgba(0,0,0,.04)); }
  .today-dot { width: 10px; height: 10px; border-radius: 50%; flex: none; background: var(--success-color, #4caf50); }
  .today-dot.overdue { background: var(--error-color, #f44336); }
  .today-dot.due_soon { background: var(--warning-color, #ff9800); }
  .today-dot.triggered { background: #ff5722; }
  .today-main { flex: 1; min-width: 0; }
  .today-task { font-weight: 600; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .today-object { color: var(--secondary-text-color); font-size: 12.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .today-row .btn-complete { color: var(--success-color, #4caf50); flex: none; }
  .today-empty {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 48px 16px; color: var(--secondary-text-color); text-align: center;
  }
  .today-empty ha-icon { --mdc-icon-size: 56px; color: var(--success-color, #4caf50); }

  /* Command palette (Ctrl/Cmd+K). */
  .palette-backdrop {
    position: fixed; inset: 0; z-index: 1100; background: rgba(0,0,0,.4);
    display: flex; align-items: flex-start; justify-content: center; padding-top: 12vh;
    animation: toast-in .15s ease;
  }
  .palette {
    width: min(620px, 92vw); max-height: 66vh; display: flex; flex-direction: column;
    background: var(--card-background-color, #fff); border-radius: 12px; overflow: hidden;
    box-shadow: 0 12px 48px rgba(0,0,0,.4);
  }
  .palette-input {
    font: inherit; font-size: 16px; padding: 16px 18px; border: none; outline: none;
    background: transparent; color: var(--primary-text-color);
    border-bottom: 1px solid var(--divider-color);
  }
  .palette-results { overflow-y: auto; }
  .palette-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 16px; cursor: pointer;
  }
  .palette-item.active { background: color-mix(in srgb, var(--primary-color) 14%, transparent); }
  .palette-item ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); flex: none; }
  .palette-label { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .palette-sub { margin-left: auto; color: var(--secondary-text-color); font-size: 12.5px; flex: none; padding-left: 10px; }
  .palette-empty { padding: 20px 16px; color: var(--secondary-text-color); text-align: center; }
  .palette-hint { padding: 8px 16px; font-size: 12px; color: var(--secondary-text-color); border-top: 1px solid var(--divider-color); }

  /* Template gallery. */
  .template-gallery {
    width: min(720px, 94vw); max-height: 80vh; display: flex; flex-direction: column;
    background: var(--card-background-color, #fff); border-radius: 12px; overflow: hidden;
    box-shadow: 0 12px 48px rgba(0,0,0,.4);
  }
  .template-gallery-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 8px 12px 18px; font-weight: 600; font-size: 16px;
    border-bottom: 1px solid var(--divider-color);
  }
  .template-gallery-body { overflow-y: auto; padding: 8px 16px 16px; }
  .template-cat { margin-top: 12px; }
  .template-cat-head {
    display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px;
    color: var(--secondary-text-color); margin-bottom: 8px;
  }
  .template-cat-head ha-icon { --mdc-icon-size: 20px; }
  .template-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
  .template-card {
    display: flex; flex-direction: column; gap: 4px; text-align: left; cursor: pointer;
    padding: 12px 14px; border: 1px solid var(--divider-color); border-radius: 10px;
    background: var(--card-background-color); font: inherit; color: var(--primary-text-color);
  }
  .template-card:hover { border-color: var(--primary-color); background: color-mix(in srgb, var(--primary-color) 6%, transparent); }
  .template-card[disabled] { opacity: .5; pointer-events: none; }
  .template-card-name { font-weight: 600; font-size: 14px; }
  .template-card-count { font-size: 12px; color: var(--secondary-text-color); }
  .empty-onboard-hint { color: var(--secondary-text-color); font-size: 13px; margin: 4px 0 12px; }
  .empty-onboard-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }

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
  .priority-badge {
    display: inline-flex;
    align-items: center;
    margin-left: 6px;
    border-radius: 12px;
    padding: 2px;
  }
  .priority-badge ha-icon {
    --mdc-icon-size: 16px;
  }
  .priority-high {
    color: var(--error-color, #db4437);
  }
  .priority-low {
    color: var(--secondary-text-color, #888);
  }
  .label-chip {
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
    opacity: 0.85;
  }
  .label-chip ha-icon {
    --mdc-icon-size: 13px;
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
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .toast-undo {
    font: inherit; font-weight: 600; color: #fff; cursor: pointer;
    background: transparent; border: 1px solid rgba(255,255,255,.6);
    border-radius: 6px; padding: 4px 12px; text-transform: uppercase; font-size: 12.5px;
  }
  .toast-undo:hover { background: rgba(255,255,255,.15); }
  @keyframes toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(16px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;var le=class{constructor(r){this._cache=new Map;this._pending=new Map;this._hass=r}updateHass(r){this._hass=r}async getDetailStats(r,t,e=30){return this._getStats(r,e<=35?"hour":"day",e,t)}async getMiniStats(r,t){return this._getStats(r,"day",14,t)}async getBatchMiniStats(r){let t=new Map,e=[];for(let d of r){let u=`${d.entityId}:day:14`,g=this._cache.get(u);g&&Date.now()-g.fetchedAt<3e5?t.set(d.entityId,g.points):e.push(d)}if(e.length===0)return t;let i=e.filter(d=>d.isCounter).map(d=>d.entityId),a=e.filter(d=>!d.isCounter).map(d=>d.entityId),l=new Date(Date.now()-336*60*60*1e3).toISOString(),c=[];return i.length>0&&c.push(this._fetchBatch(i,"day",l,["state","sum","change"],!0,t)),a.length>0&&c.push(this._fetchBatch(a,"day",l,["mean","min","max"],!1,t)),await Promise.all(c),t}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(r,t,e,i){let a=`${r}:${t}:${e}`,l=this._cache.get(a);if(l&&Date.now()-l.fetchedAt<3e5)return l.points;if(this._pending.has(a))return this._pending.get(a);let c=this._fetchAndNormalize(r,t,e,i,a);this._pending.set(a,c);try{return await c}finally{this._pending.delete(a)}}async _fetchAndNormalize(r,t,e,i,a){let l=new Date(Date.now()-e*24*60*60*1e3).toISOString(),c=i?["state","sum","change"]:["mean","min","max"];try{let u=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:l,statistic_ids:[r],period:t,types:c}))[r]||[],g=this._normalizeRows(u,i);return this._cache.set(a,{entityId:r,fetchedAt:Date.now(),period:t,points:g}),g}catch(d){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${r}:`,d),[]}}async _fetchBatch(r,t,e,i,a,l){try{let c=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:e,statistic_ids:r,period:t,types:i});for(let d of r){let u=c[d]||[],g=this._normalizeRows(u,a);l.set(d,g),this._cache.set(`${d}:${t}:14`,{entityId:d,fetchedAt:Date.now(),period:t,points:g})}}catch(c){console.warn("[maintenance-supporter] Batch statistics fetch failed:",c)}}_normalizeRows(r,t){let e=[];for(let i of r){let a=null;if(t?a=i.state??null:a=i.mean??null,a===null)continue;let l={ts:i.start,val:a};t||(i.min!=null&&(l.min=i.min),i.max!=null&&(l.max=i.max)),e.push(l)}return e.sort((i,a)=>i.ts-a.ts),e}};var gt=class{constructor(r){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=r}updateHass(r){this.hass=r}async getUsers(r=!1){let t=Date.now();if(!r&&this.usersCache&&t-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=e.users,this.cacheTimestamp=t,this.usersCache}catch(e){return console.error("Failed to fetch users:",e),this.usersCache||[]}}async assignUser(r,t,e){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:r,task_id:t,user_id:e})}async getTasksByUser(r){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:r})).tasks}getUserName(r){return!r||!this.usersCache?null:this.usersCache.find(e=>e.id===r)?.name||null}getUser(r){return!r||!this.usersCache?null:this.usersCache.find(t=>t.id===r)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(r){return r?r===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};var is={name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",group_name:"name",group_description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_for_minutes:"trigger_for_minutes"};function ss(n,r){let t=is[n];if(!t)return n;let e=s(t,r);return e&&e!==t?e:n}function as(n){let t=n.match(/data\['([^']+)'\]/)?.[1],e;return(e=n.match(/length of value must be at most (\d+)/))?{field:t,rule:"too_long",param:e[1]}:(e=n.match(/length of value must be at least (\d+)/))?{field:t,rule:"too_short",param:e[1]}:(e=n.match(/value must be at most (\S+)/))?{field:t,rule:"value_too_high",param:e[1]}:(e=n.match(/value must be at least (\S+)/))?{field:t,rule:"value_too_low",param:e[1]}:/required key not provided/.test(n)?{field:t,rule:"required"}:(e=n.match(/expected (\w+)/))?{field:t,rule:"wrong_type",param:e[1]}:/value must be one of/.test(n)?{field:t,rule:"invalid_choice"}:/not a valid value/.test(n)?{field:t,rule:"invalid_value"}:{field:t,rule:"unknown"}}function I(n,r,t){if(t=t??s("action_error",r),typeof n=="string")return n;if(typeof n!="object"||n===null)return t;let e=n,i=e.message||e.error?.message||"";if(!i)return t;let a=as(i),l=a.field?ss(a.field,r):"",c=d=>s(d,r).replace("{field}",l).replace("{n}",a.param??"");switch(a.rule){case"too_long":return c("err_too_long");case"too_short":return c("err_too_short");case"value_too_high":return c("err_value_too_high");case"value_too_low":return c("err_value_too_low");case"required":return c("err_required");case"wrong_type":return c("err_wrong_type").replace("{type}",a.param??"");case"invalid_choice":return c("err_invalid_choice");case"invalid_value":return c("err_invalid_value");default:return i||t}}var V=class extends S{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1}_onInput(t){let e=t.target.value;this.value=e,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:e}}))}render(){return o`
      <label class="field">
        ${this.label?o`<span class="label">${this.label}${this.required?o`<span class="req">*</span>`:h}</span>`:h}
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??h}
          min=${this.min??h}
          max=${this.max??h}
          pattern=${this.pattern??h}
          @input=${this._onInput}
          @change=${this._onInput}
        />
        ${this.helper?o`<span class="helper">${this.helper}</span>`:h}
      </label>
    `}};V.styles=A`
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
  `,p([y()],V.prototype,"label",2),p([y()],V.prototype,"value",2),p([y()],V.prototype,"placeholder",2),p([y()],V.prototype,"type",2),p([y({type:Boolean})],V.prototype,"required",2),p([y({type:Boolean})],V.prototype,"disabled",2),p([y()],V.prototype,"step",2),p([y()],V.prototype,"min",2),p([y()],V.prototype,"max",2),p([y()],V.prototype,"pattern",2),p([y()],V.prototype,"helper",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",V);var U=class extends S{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._entryId=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._error="",this._open=!0}openEdit(t,e){this._entryId=t,this._name=e.name||"",this._manufacturer=e.manufacturer||"",this._model=e.model||"",this._serialNumber=e.serial_number||"",this._areaId=e.area_id||"",this._installationDate=e.installation_date||"",this._warrantyExpiry=e.warranty_expiry||"",this._documentationUrl=e.documentation_url||"",this._notes=e.notes||"",this._error="",this._open=!0}async _save(){if(!this._loading&&this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(t){this._error=I(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}render(){if(!this._open)return o``;let t=this._lang,e=this._entryId?s("edit_object",t):s("new_object",t);return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:h}
          <ms-textfield
            label="${s("name",t)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("manufacturer_optional",t)}"
            .value=${this._manufacturer}
            @input=${i=>this._manufacturer=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("model_optional",t)}"
            .value=${this._model}
            @input=${i=>this._model=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("serial_number_optional",t)}"
            .value=${this._serialNumber}
            @input=${i=>this._serialNumber=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("documentation_url_optional",t)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${s("area_id_optional",t)}"
            .value=${this._areaId}
            @value-changed=${i=>this._areaId=i.detail.value||""}
          ></ha-area-picker>
          <ms-textfield
            label="${s("installation_date_optional",t)}"
            type="date"
            .value=${this._installationDate}
            @input=${i=>this._installationDate=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("warranty_expiry_optional",t)}"
            type="date"
            .value=${this._warrantyExpiry}
            @input=${i=>this._warrantyExpiry=i.target.value}
          ></ms-textfield>
          <label class="textarea-field">
            <span class="textarea-label">${s("object_notes_optional",t)}</span>
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
    `}};U.styles=A`
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
  `,p([y({attribute:!1})],U.prototype,"hass",2),p([_()],U.prototype,"_open",2),p([_()],U.prototype,"_loading",2),p([_()],U.prototype,"_error",2),p([_()],U.prototype,"_name",2),p([_()],U.prototype,"_manufacturer",2),p([_()],U.prototype,"_model",2),p([_()],U.prototype,"_serialNumber",2),p([_()],U.prototype,"_areaId",2),p([_()],U.prototype,"_installationDate",2),p([_()],U.prototype,"_warrantyExpiry",2),p([_()],U.prototype,"_documentationUrl",2),p([_()],U.prototype,"_notes",2),p([_()],U.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",U);function rt(n){let r=n??0;return r<1024?`${r} B`:r<1024*1024?`${(r/1024).toFixed(1)} KB`:`${(r/(1024*1024)).toFixed(1)} MB`}var ce=["manual","warranty","invoice","spare_parts","photo","other"],rs={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"},D=class extends S{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._dragOver=!1;this._loadedFor=null;this._localeReady=!1}_isImage(t){return t.kind==="file"&&(t.mime||"").startsWith("image/")}async _sign(t){return(await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${t.id}`,expires:300})).path}get _lang(){return this.hass?.language||"en"}updated(t){super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,at(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._load())}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=t.documents||[],this._loaded=!0,this._error="",this._thumbs={},this._loadThumbs()}catch(t){this._error=I(t,this._lang),this._loaded=!0}}async _loadThumbs(){await Promise.all(this._docs.filter(t=>this._isImage(t)).map(async t=>{try{let e=await this._sign(t);this._thumbs={...this._thumbs,[t.id]:e}}catch{}}))}_category_of(t){return(t.tags||[]).find(i=>ce.includes(i))||"other"}_labelKeydown(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),t.currentTarget.querySelector("input")?.click())}_onFileInput(t){let e=t.target,i=Array.from(e.files??[]);i.length&&this._uploadFiles(i),e.value=""}_onCameraInput(t){let e=t.target,i=Array.from(e.files??[]);i.length&&this._uploadFiles(i,"photo"),e.value=""}_onDrop(t){if(t.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let e=Array.from(t.dataTransfer?.files??[]);e.length&&this._uploadFiles(e)}_onDragOver(t){this.canWrite&&(t.preventDefault(),this._dragOver=!0)}_onDragLeave(t){let e=t.relatedTarget;(!e||!t.currentTarget.contains(e))&&(this._dragOver=!1)}async _uploadFiles(t,e){let i=e??this._category;this._busy=!0,this._error="",this._hint="";let a=0,l=0;try{for(let c of t){let d=new FormData;d.append("entry_id",this.entryId),d.append("tags",i),d.append("file",c,c.name);let u=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:d});if(!u.ok){this._error=u.status===413?s("doc_too_large",this._lang):s("doc_upload_failed",this._lang);continue}let g=await u.json();g.duplicate_in_object?l++:g.deduped&&a++}l?this._hint=s("doc_dup_in_object",this._lang):a&&(this._hint=s("doc_deduped",this._lang)),await this._load()}catch{this._error=s("doc_upload_failed",this._lang)}finally{this._busy=!1}}async _download(t){try{let e=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${t.id}`,expires:30});oe(e.path,t.filename||t.title||"document")}catch(e){this._error=I(e,this._lang)}}async _preview(t){if(this._isImage(t)){this._lightboxUrl=this._thumbs[t.id]||await this._sign(t);return}let e=window.open("about:blank","_blank");try{let i=await this._sign(t);e&&(e.location.href=new URL(i,window.location.origin).href)}catch(i){e&&e.close(),this._error=I(i,this._lang)}}_openDoc(t){t.kind==="file"?this._preview(t):t.url&&/^https?:\/\//i.test(t.url)&&window.open(t.url,"_blank","noopener")}_startEdit(t){this._editingId=t.id,this._editTitle=t.title||"",this._editCategory=this._category_of(t),this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}async _saveEdit(t){let e=(t.tags||[]).filter(a=>!ce.includes(a)),i=t.kind==="file"?[this._editCategory,...e]:t.tags??[];this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,title:this._editTitle.trim()||t.filename||t.url||"",tags:i}),this._editingId="",await this._load()}catch(a){this._error=I(a,this._lang)}finally{this._busy=!1}}async _delete(t){let e=t.title||t.filename||t.url||"";if(window.confirm(s("doc_delete_confirm",this._lang).replace("{name}",e))){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:t.id}),await this._load()}catch(i){this._error=I(i,this._lang)}finally{this._busy=!1}}}async _addLink(){let t=this._linkUrl.trim();if(t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/add_link",entry_id:this.entryId,url:t,title:this._linkTitle.trim()||null}),this._linkUrl="",this._linkTitle="",this._addingLink=!1,await this._load()}catch(e){this._error=I(e,this._lang,s("doc_link_invalid",this._lang))}finally{this._busy=!1}}}render(){let t=this._lang;return o`
      <div
        class="doc-zone ${this._dragOver?"drag-over":""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this._dragOver&&this.canWrite?o`<div class="drop-overlay">
              <ha-icon icon="mdi:tray-arrow-down"></ha-icon> ${s("doc_drop_hint",t)}
            </div>`:h}
      <div class="doc-header">
        <h3>${s("documents",t)} (${this._docs.length})</h3>
        ${this.canWrite?o`
              <div class="doc-actions">
                <select
                  class="cat-select"
                  .value=${this._category}
                  ?disabled=${this._busy}
                  @change=${e=>this._category=e.target.value}
                >
                  ${ce.map(e=>o`<option value=${e}>${s(`doc_cat_${e}`,t)}</option>`)}
                </select>
                <label
                  class="btn primary ${this._busy?"disabled":""}"
                  role="button"
                  tabindex="0"
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:upload"></ha-icon>
                  ${this._busy?s("doc_uploading",t):s("doc_upload",t)}
                  <input type="file" multiple hidden ?disabled=${this._busy} @change=${this._onFileInput} />
                </label>
                <label
                  class="btn camera-btn ${this._busy?"disabled":""}"
                  role="button"
                  tabindex="0"
                  aria-label=${s("doc_camera",t)}
                  title=${s("doc_camera",t)}
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:camera"></ha-icon>
                  <input type="file" accept="image/*" capture="environment" hidden ?disabled=${this._busy} @change=${this._onCameraInput} />
                </label>
                <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!this._addingLink}>
                  <ha-icon icon="mdi:link-variant"></ha-icon> ${s("doc_add_link",t)}
                </button>
              </div>
            `:h}
      </div>

      ${this._error?o`<div class="doc-msg error">${this._error}</div>`:h}
      ${this._hint?o`<div class="doc-msg hint">${this._hint}</div>`:h}

      ${this._addingLink&&this.canWrite?o`
            <div class="link-form">
              <input
                type="url"
                placeholder=${s("doc_link_url",t)}
                .value=${this._linkUrl}
                ?disabled=${this._busy}
                @input=${e=>this._linkUrl=e.target.value}
              />
              <input
                type="text"
                placeholder=${s("doc_link_title",t)}
                .value=${this._linkTitle}
                ?disabled=${this._busy}
                @input=${e=>this._linkTitle=e.target.value}
              />
              <button class="btn primary" ?disabled=${this._busy||!this._linkUrl.trim()} @click=${this._addLink}>
                ${s("add",t)}
              </button>
              <button class="btn" ?disabled=${this._busy} @click=${()=>this._addingLink=!1}>
                ${s("cancel",t)}
              </button>
            </div>
          `:h}

      ${this._loaded?this._docs.length===0?o`<div class="doc-empty">${s("documents_empty",t)}</div>`:o`
              <div class="doc-list">
                ${this._docs.map(e=>this._renderDoc(e,t))}
              </div>
            `:o`<div class="doc-empty">${s("loading",t)}</div>`}

      ${this._lightboxUrl?o`<div class="lightbox" @click=${()=>this._lightboxUrl=""}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${e=>e.stopPropagation()} />
            <button class="lightbox-close" title=${s("doc_close",t)} @click=${()=>this._lightboxUrl=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`:h}
      </div>
    `}_renderDoc(t,e){if(this._editingId===t.id)return this._renderEdit(t,e);let i=t.kind==="file",a=this._category_of(t),l=i?`${s(`doc_cat_${a}`,e)} \xB7 ${rt(t.size)}`:s("doc_link_badge",e),c=this._thumbs[t.id];return o`
      <div class="doc-row">
        ${i&&c?o`<img
              class="doc-thumb"
              src=${c}
              alt=${t.title||""}
              title=${s("doc_open",e)}
              @click=${()=>this._preview(t)}
            />`:o`<ha-icon
              class="doc-icon ${i?"clickable":""}"
              icon=${i?rs[a]:"mdi:link-variant"}
              @click=${()=>i&&this._preview(t)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${s("doc_open",e)}
          @click=${()=>this._openDoc(t)}
          @keydown=${d=>{(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),this._openDoc(t))}}
        >
          <div class="doc-title">${t.title||t.filename||t.url}</div>
          <div class="doc-meta">${l}</div>
        </div>
        <div class="doc-row-actions">
          ${i?o`
                <button class="icon-btn" title=${s("doc_open",e)} @click=${()=>this._preview(t)}>
                  <ha-icon icon="mdi:eye-outline"></ha-icon>
                </button>
                <button class="icon-btn" title=${s("doc_download",e)} @click=${()=>this._download(t)}>
                  <ha-icon icon="mdi:download"></ha-icon>
                </button>`:o`<a
                class="icon-btn"
                href=${t.url&&/^https?:\/\//i.test(t.url)?t.url:"#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${s("doc_open",e)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite?o`
                <button class="icon-btn" title=${s("edit",e)} ?disabled=${this._busy} @click=${()=>this._startEdit(t)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button class="icon-btn danger" title=${s("delete",e)} ?disabled=${this._busy} @click=${()=>this._delete(t)}>
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>`:h}
        </div>
      </div>
    `}_renderEdit(t,e){let i=t.kind==="file";return o`
      <div class="doc-row editing">
        <input
          class="edit-title"
          type="text"
          placeholder=${s("doc_link_title",e)}
          .value=${this._editTitle}
          ?disabled=${this._busy}
          @input=${a=>this._editTitle=a.target.value}
        />
        ${i?o`<select
              class="cat-select"
              ?disabled=${this._busy}
              @change=${a=>this._editCategory=a.target.value}
            >
              ${ce.map(a=>o`<option value=${a} ?selected=${a===this._editCategory}>${s(`doc_cat_${a}`,e)}</option>`)}
            </select>`:h}
        <button class="icon-btn" title=${s("save",e)} ?disabled=${this._busy||!this._editTitle.trim()} @click=${()=>this._saveEdit(t)}>
          <ha-icon icon="mdi:check"></ha-icon>
        </button>
        <button class="icon-btn" title=${s("cancel",e)} ?disabled=${this._busy} @click=${this._cancelEdit}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `}};D.styles=A`
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
  `,p([y({attribute:!1})],D.prototype,"hass",2),p([y({attribute:!1})],D.prototype,"entryId",2),p([y({type:Boolean})],D.prototype,"canWrite",2),p([_()],D.prototype,"_docs",2),p([_()],D.prototype,"_loaded",2),p([_()],D.prototype,"_busy",2),p([_()],D.prototype,"_error",2),p([_()],D.prototype,"_hint",2),p([_()],D.prototype,"_addingLink",2),p([_()],D.prototype,"_linkUrl",2),p([_()],D.prototype,"_linkTitle",2),p([_()],D.prototype,"_category",2),p([_()],D.prototype,"_thumbs",2),p([_()],D.prototype,"_lightboxUrl",2),p([_()],D.prototype,"_editingId",2),p([_()],D.prototype,"_editTitle",2),p([_()],D.prototype,"_editCategory",2),p([_()],D.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",D);var ns=["manual","warranty","invoice","spare_parts","photo","other"],os={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"},Q=class extends S{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._loadedKey="";this._localeReady=!1}get _lang(){return this.hass?.language||"en"}updated(t){super.updated(t),this.hass&&!this._localeReady&&(this._localeReady=!0,at(this._lang).then(()=>this.requestUpdate()));let e=`${this.entryId}|${this.taskId}`;this.hass&&this.entryId&&this.taskId&&this._loadedKey!==e&&(this._loadedKey=e,this._load())}async _load(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=t.documents||[],this._loaded=!0,this._error=""}catch(t){this._error=I(t,this._lang),this._loaded=!0}}_linked(){return this._docs.filter(t=>(t.task_ids||[]).includes(this.taskId))}_available(){return this._docs.filter(t=>!(t.task_ids||[]).includes(this.taskId))}async _setTaskIds(t,e){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,task_ids:e}),await this._load()}catch(i){this._error=I(i,this._lang)}finally{this._busy=!1}}_link(){let t=this._docs.find(e=>e.id===this._attachId);t&&(this._attachId="",this._setTaskIds(t,[...t.task_ids||[],this.taskId]))}_unlink(t){this._setTaskIds(t,(t.task_ids||[]).filter(e=>e!==this.taskId))}_isPdf(t){return t.mime==="application/pdf"||(t.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(t){return this._isPdf(t)?t.task_pages?.[this.taskId]:void 0}async _open(t){if(t.kind==="weblink"){window.open(t.url,"_blank","noopener");return}let e=this._pageFor(t),i=e?`#page=${e}`:"",a=window.open("about:blank","_blank");try{let l=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${t.id}`,expires:300});a&&(a.location.href=new URL(l.path+i,window.location.origin).href)}catch(l){a&&a.close(),this._error=I(l,this._lang)}}async _setPage(t,e){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:t.id,task_pages:{[this.taskId]:e}}),await this._load()}catch(i){this._error=I(i,this._lang)}finally{this._busy=!1}}async _download(t){try{let e=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${t.id}`,expires:30});oe(e.path,t.filename||t.title||"document")}catch(e){this._error=I(e,this._lang)}}render(){if(!this._loaded||this._docs.length===0)return h;let t=this._lang,e=this._linked(),i=this._available();return o`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${s("documents",t)} (${e.length})</h3>
        ${this._error?o`<div class="tdoc-error">${this._error}</div>`:h}
        ${e.length===0?o`<div class="tdoc-empty">${s("doc_task_none",t)}</div>`:o`<div class="tdoc-list">${e.map(a=>this._renderRow(a,t))}</div>`}
        ${this.canWrite&&i.length?o`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${a=>this._attachId=a.target.value}
              >
                <option value="" ?selected=${!this._attachId}>${s("doc_link_existing",t)}</option>
                ${i.map(a=>o`<option value=${a.id} ?selected=${a.id===this._attachId}>${a.title||a.filename||a.url}</option>`)}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy||!this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${s("doc_attach",t)}
              </button>
            </div>`:h}
      </div>
    `}_renderRow(t,e){let i=t.kind==="file",a=this._isPdf(t),l=t.task_pages?.[this.taskId],c=(t.tags||[]).find(u=>ns.includes(u))||"other",d=i?rt(t.size):s("doc_link_badge",e);return o`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${i?os[c]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${l?`${s("doc_open",e)} \xB7 ${s("doc_page",e)} ${l}`:s("doc_open",e)}
          @click=${()=>this._open(t)}
          @keydown=${u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),this._open(t))}}
        >
          <div class="tdoc-title">${t.title||t.filename||t.url}</div>
          <div class="tdoc-meta">
            ${d}${l?o` · <span class="tdoc-pagetag">${s("doc_page",e)} ${l}</span>`:h}
          </div>
        </div>
        ${this.canWrite&&a?o`<input
              class="tdoc-page"
              type="number"
              min="1"
              inputmode="numeric"
              aria-label=${s("doc_page",e)}
              title=${s("doc_page",e)}
              placeholder=${s("doc_page",e)}
              .value=${l?String(l):""}
              ?disabled=${this._busy}
              @change=${u=>{let g=parseInt(u.target.value,10);this._setPage(t,Number.isFinite(g)&&g>=1?g:0)}}
            />`:h}
        <button class="icon-btn" title=${s("doc_open",e)} @click=${()=>this._open(t)}>
          <ha-icon icon=${i?"mdi:eye-outline":"mdi:open-in-new"}></ha-icon>
        </button>
        ${i?o`<button class="icon-btn" title=${s("doc_download",e)} @click=${()=>this._download(t)}>
              <ha-icon icon="mdi:download"></ha-icon>
            </button>`:h}
        ${this.canWrite?o`<button class="icon-btn" title=${s("doc_unlink",e)} ?disabled=${this._busy} @click=${()=>this._unlink(t)}>
              <ha-icon icon="mdi:link-variant-off"></ha-icon>
            </button>`:h}
      </div>
    `}};Q.styles=A`
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
  `,p([y({attribute:!1})],Q.prototype,"hass",2),p([y({attribute:!1})],Q.prototype,"entryId",2),p([y({attribute:!1})],Q.prototype,"taskId",2),p([y({type:Boolean})],Q.prototype,"canWrite",2),p([_()],Q.prototype,"_docs",2),p([_()],Q.prototype,"_loaded",2),p([_()],Q.prototype,"_busy",2),p([_()],Q.prototype,"_error",2),p([_()],Q.prototype,"_attachId",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",Q);var ls=["cleaning","inspection","replacement","calibration","service","custom"],cs=["low","normal","high"],ds=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],ps=["weekdays","nth_weekday","day_of_month"],li=["threshold","counter","state_change","runtime"],hs=[...li,"compound"];function us(){return{entityIds:"",type:"threshold",above:"",below:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:""}}function _s(n){return{entityIds:(n.entity_ids||(n.entity_id?[n.entity_id]:[])).join(", "),type:n.type||"threshold",above:n.trigger_above?.toString()??"",below:n.trigger_below?.toString()??"",forMinutes:n.trigger_for_minutes?.toString()??"0",targetValue:n.trigger_target_value?.toString()??"",deltaMode:n.trigger_delta_mode||!1,fromState:n.trigger_from_state||"",toState:n.trigger_to_state||"",targetChanges:n.trigger_target_changes?.toString()??"",runtimeHours:n.trigger_runtime_hours?.toString()??""}}function gs(n){let r=n.entityIds.split(",").map(e=>e.trim()).filter(Boolean);if(r.length===0)return null;let t={entity_id:r[0],entity_ids:r,type:n.type};if(n.type==="threshold"){let e=parseFloat(n.above);isNaN(e)||(t.trigger_above=e);let i=parseFloat(n.below);isNaN(i)||(t.trigger_below=i);let a=parseInt(n.forMinutes,10);isNaN(a)||(t.trigger_for_minutes=a)}else if(n.type==="counter"){let e=parseFloat(n.targetValue);isNaN(e)||(t.trigger_target_value=e),t.trigger_delta_mode=n.deltaMode}else if(n.type==="state_change"){n.fromState&&(t.trigger_from_state=n.fromState),n.toState&&(t.trigger_to_state=n.toState);let e=parseInt(n.targetChanges,10);isNaN(e)||(t.trigger_target_changes=e)}else if(n.type==="runtime"){let e=parseFloat(n.runtimeHours);isNaN(e)||(t.trigger_runtime_hours=e)}return t}function ms(n){return Array.from({length:7},(r,t)=>Zt(t,n,"short"))}var x=class extends S{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._notes="";this._documentationUrl="";this._customIcon="";this._priority="normal";this._labels="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._availableTags=[];this._responsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._userService=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}async openCreate(t,e){this._entryId=t,this._taskId=null,this._error="",!t&&e&&e.length>0?(this._objectChoices=e.map(i=>({entry_id:i.entry_id,name:i.object.name})).sort((i,a)=>i.name.localeCompare(a.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}async openEdit(t,e){this._entryId=t,this._taskId=e.id,this._error="",this._name=e.name,this._type=e.type,this._scheduleType=e.schedule_type,this._intervalDays=e.interval_days!=null?String(e.interval_days):"",this._intervalUnit=e.interval_unit||"days",this._dueDate=e.due_date||"";let i=e.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"?String(i.day??1):"1",this._warningDays=e.warning_days.toString(),this._earliestCompletionDays=e.earliest_completion_days!=null?String(e.earliest_completion_days):"",this._intervalAnchor=e.interval_anchor||"completion",this._notes=e.notes||"",this._documentationUrl=e.documentation_url||"",this._customIcon=e.custom_icon||"",this._priority=e.priority||"normal",this._labels=(e.labels||[]).join(", "),this._enabled=e.enabled!==!1,this._lastPerformed=e.last_performed||"",this._nfcTagId=e.nfc_tag_id||"",this._responsibleUserId=e.responsible_user_id||null,this._assigneePool=[...e.assignee_pool||[]],this._rotationStrategy=e.rotation_strategy||"",this._checklistText=(e.checklist||[]).join(`
`),this._scheduleTime=e.schedule_time||"";let a=e.on_complete_action;if(a&&a.service){this._actionService=a.service;let d=a.target?.entity_id;this._actionTargetEntity=Array.isArray(d)?d[0]||"":d||"",this._actionData=a.data&&typeof a.data=="object"?{...a.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let l=e.quick_complete_defaults;this._qcNotes=l?.notes||"",this._qcCost=l?.cost!=null?String(l.cost):"",this._qcDuration=l?.duration!=null?String(l.duration):"",this._qcFeedback=l?.feedback||"";let c=e.adaptive_config||{};if(this._environmentalEntity=c.environmental_entity||"",this._environmentalAttribute=c.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,e.trigger_config){let d=e.trigger_config;this._triggerEntityId=d.entity_id||"",this._triggerEntityIds=d.entity_ids||(d.entity_id?[d.entity_id]:[]),this._triggerEntityLogic=d.entity_logic||"any",this._triggerAttribute=d.attribute||"",this._triggerType=d.type||"threshold",this._triggerAbove=d.trigger_above?.toString()||"",this._triggerBelow=d.trigger_below?.toString()||"",this._triggerForMinutes=d.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=d.trigger_target_value?.toString()||"",this._triggerDeltaMode=d.trigger_delta_mode||!1,this._autoCompleteOnRecovery=d.auto_complete_on_recovery||!1,this._triggerFromState=d.trigger_from_state||"",this._triggerToState=d.trigger_to_state||"",this._triggerTargetChanges=d.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=d.trigger_runtime_hours?.toString()||"",d.type==="compound"?(this._compoundLogic=d.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(d.conditions||[]).map(_s)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._notes="",this._documentationUrl="",this._customIcon="",this._priority="normal",this._labels="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._autoCompleteOnRecovery=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new gt(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(t){console.error("Failed to load users:",t),this._availableUsers=[]}}_toggleAssignee(t){this._assigneePool=this._assigneePool.includes(t)?this._assigneePool.filter(e=>e!==t):[...this._assigneePool,t]}async _testAction(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[e,i]=t.split(".");if(!this.hass?.services?.[e]?.[i]){this._actionTestResult="error",this._actionTestError=`Service "${t}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let a=this._actionTargetEntity.trim();if(a){let l=a.split(".")[0];if(l!==e&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(e)){this._actionTestResult="error",this._actionTestError=`Service "${t}" only works on ${e}.* entities; entity "${a}" is in ${l}.* \u2014 pick a service that matches the entity domain (e.g. ${l}.${i})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[a]){this._actionTestResult="error",this._actionTestError=`Target entity "${a}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let t=JSON.parse(this._actionDataJsonFallback);if(t&&typeof t=="object"&&!Array.isArray(t))return t}catch{}return{...this._actionData}}_serviceSchema(){let t=this._actionService.trim();if(!t||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(t))return null;let[e,i]=t.split("."),a=this.hass?.services?.[e]?.[i]?.fields;return!a||Object.keys(a).length===0?null:Object.entries(a).map(([l,c])=>({name:l,required:!!c.required,selector:c.selector||{text:{}}}))}_renderCompletionActionsSection(t){if(!this.completionActionsEnabled)return h;let e=this._serviceSchema();return o`
      <details class="ca-section">
        <summary>${s("on_complete_action_title",t)}</summary>
        <p class="field-help">${s("on_complete_action_desc",t)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let a=this._serviceSchema();if(a){let l=new Set(a.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>l.has(c)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>s("on_complete_action_target",t)}
          @value-changed=${i=>{let a=i.detail.value;this._actionTargetEntity=a.target_entity||""}}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${s("on_complete_action_target_hint",t)}
        </p>
        ${e?o`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${e}
                .data=${this._actionData}
                @value-changed=${i=>{this._actionData={...i.detail.value}}}
              ></ha-form>
            `:o`
              <ms-textfield
                label="${s("on_complete_action_data",t)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${i=>{this._actionDataJsonFallback=i.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":s("on_complete_action_test",t)}
          </button>
          ${this._actionTestResult==="ok"?o`<span class="ca-test-ok">${s("on_complete_action_test_success",t)}</span>`:h}
          ${this._actionTestResult==="error"?o`<div class="ca-test-error-block">
                <span class="ca-test-error">${s("on_complete_action_test_failed",t)}</span>
                ${this._actionTestError?o`<div class="ca-test-error-detail">${this._actionTestError}</div>`:h}
              </div>`:h}
        </div>
      </details>

      <details class="ca-section">
        <summary>${s("quick_complete_defaults_title",t)}</summary>
        <p class="field-help">${s("quick_complete_defaults_desc",t)}</p>
        <ms-textfield
          label="${s("quick_complete_defaults_notes",t)}"
          .value=${this._qcNotes}
          @input=${i=>{this._qcNotes=i.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${s("quick_complete_defaults_cost",t)}"
          type="number" min="0" step="0.01"
          .value=${this._qcCost}
          @input=${i=>{this._qcCost=i.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${s("quick_complete_defaults_duration",t)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${i=>{this._qcDuration=i.target.value}}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${i=>{this._qcFeedback=i.target.value}}>
          <option value="">${s("quick_complete_defaults_feedback_none",t)}</option>
          <option value="needed">${s("quick_complete_defaults_feedback_needed",t)}</option>
          <option value="not_needed">${s("quick_complete_defaults_feedback_not_needed",t)}</option>
        </select>
      </details>
    `}async _loadTags(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=t.tags||[]}catch{this._availableTags=[]}}async _fetchEntityAttributes(t){if(!t||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:t});this._entityDomain=e.domain||"",this._suggestedAttributes=e.suggested_attributes||[],this._availableAttributes=e.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}async _save(){if(!this._loading&&this._name.trim()){this._loading=!0,this._error="";try{let t={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:parseInt(this._warningDays,10)||7},e=this._earliestCompletionDays.trim();if(t.earliest_completion_days=e===""?null:Math.max(0,parseInt(e,10)||0),this._taskId&&(t.task_id=this._taskId),this._scheduleType==="one_time"?(t.due_date=this._dueDate||null,t.interval_days=null):ps.includes(this._scheduleType)?(t.schedule=this._buildSchedule(),t.interval_days=null,this._taskId&&(t.due_date=null)):(this._taskId&&(t.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(t.interval_days=parseInt(this._intervalDays,10),t.interval_unit=this._intervalUnit,t.interval_anchor=this._intervalAnchor):this._taskId&&(t.interval_days=null,t.interval_anchor="completion")),t.notes=this._notes||null,t.documentation_url=this._documentationUrl||null,t.custom_icon=this._customIcon||null,t.priority=this._priority,t.labels=this._labels.split(",").map(c=>c.trim()).filter(Boolean),t.enabled=this._enabled,t.last_performed=this._lastPerformed||null,t.nfc_tag_id=this._nfcTagId||null,t.responsible_user_id=this._responsibleUserId,t.assignee_pool=this._assigneePool,t.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let c=this._compoundConditions.map(gs).filter(d=>d!==null);if(c.length>0){let d={type:"compound",compound_logic:this._compoundLogic,conditions:c};this._autoCompleteOnRecovery&&(d.auto_complete_on_recovery=!0),t.trigger_config=d}else this._taskId&&(t.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let c=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],d={entity_id:c[0],entity_ids:c,type:this._triggerType};if(this._triggerAttribute&&(d.attribute=this._triggerAttribute),this._autoCompleteOnRecovery&&(d.auto_complete_on_recovery=!0),c.length>1&&(d.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let u=parseFloat(this._triggerAbove);isNaN(u)||(d.trigger_above=u)}if(this._triggerBelow){let u=parseFloat(this._triggerBelow);isNaN(u)||(d.trigger_below=u)}if(this._triggerForMinutes){let u=parseInt(this._triggerForMinutes,10);isNaN(u)||(d.trigger_for_minutes=u)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let u=parseFloat(this._triggerTargetValue);isNaN(u)||(d.trigger_target_value=u)}d.trigger_delta_mode=this._triggerDeltaMode}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(d.trigger_from_state=this._triggerFromState),this._triggerToState&&(d.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let u=parseInt(this._triggerTargetChanges,10);isNaN(u)||(d.trigger_target_changes=u)}}else if(this._triggerType==="runtime"&&this._triggerRuntimeHours){let u=parseFloat(this._triggerRuntimeHours);isNaN(u)||(d.trigger_runtime_hours=u)}t.trigger_config=d}else this._taskId&&(t.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let c=this._scheduleTime.trim();t.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(c)?c:null}if(this.checklistsEnabled){let c=this._checklistText.split(`
`).map(d=>d.trim()).filter(Boolean).slice(0,100);t.checklist=c.length?c:null}if(this.completionActionsEnabled){let c=this._actionService.trim();if(c&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(c)){let m={service:c},v=this._actionTargetEntity.trim();v&&(m.target={entity_id:v});let f=this._buildActionData();Object.keys(f).length>0&&(m.data=f),t.on_complete_action=m}else t.on_complete_action=null;let d={};this._qcNotes.trim()&&(d.notes=this._qcNotes.trim());let u=parseFloat(this._qcCost);!isNaN(u)&&u>=0&&(d.cost=u);let g=parseInt(this._qcDuration,10);!isNaN(g)&&g>=0&&(d.duration=g),this._qcFeedback&&(d.feedback=this._qcFeedback),t.quick_complete_defaults=Object.keys(d).length?d:null}let i=await this.hass.connection.sendMessagePromise(t),a=this._taskId||i?.task_id,l=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(a&&this._scheduleType==="sensor_based"&&l)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:a,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(t){this._error=I(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return h;let t=this._lang,e=this._triggerType==="compound";return o`
      <h3>${s("trigger_configuration",t)}</h3>
      <div class="select-row">
        <label>${s("trigger_type",t)}</label>
        <select
          .value=${this._triggerType}
          @change=${i=>this._triggerType=i.target.value}
        >
          ${hs.map(i=>o`<option value=${i} ?selected=${i===this._triggerType}>${s(i,t)}</option>`)}
        </select>
      </div>
      ${e?this._renderCompoundEditor():o`
        <ms-textfield
          label="${s("entity_id",t)} (${s("comma_separated",t)})"
          .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
          @input=${i=>{let l=i.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=l[0]||"",this._triggerEntityIds=l,l[0]&&this._fetchEntityAttributes(l[0])}}
        ></ms-textfield>
        ${this._triggerEntityIds.length>1?o`
          <div class="select-row">
            <label>${s("entity_logic",t)}</label>
            <select
              .value=${this._triggerEntityLogic}
              @change=${i=>this._triggerEntityLogic=i.target.value}
            >
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${s("entity_logic_any",t)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${s("entity_logic_all",t)}</option>
            </select>
          </div>
        `:h}
        ${this._availableAttributes.length>0?o`
            <div class="select-row">
              <label>${s("attribute_optional",t)}</label>
              <select
                .value=${this._triggerAttribute}
                @change=${i=>this._triggerAttribute=i.target.value}
              >
                <option value="" ?selected=${!this._triggerAttribute}>${s("use_entity_state",t)}</option>
                ${this._suggestedAttributes.map(i=>o`<option value=${i} ?selected=${i===this._triggerAttribute}>${i} ★</option>`)}
                ${this._availableAttributes.filter(i=>!this._suggestedAttributes.includes(i.name)).map(i=>o`<option value=${i.name} ?selected=${i.name===this._triggerAttribute}>${i.name}${i.numeric?"":" (non-numeric)"}</option>`)}
              </select>
            </div>
          `:o`
            <ms-textfield
              label="${s("attribute_optional",t)}"
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
        ${s("auto_complete_on_recovery",t)}
      </label>
      <div class="field-help">${s("auto_complete_on_recovery_help",t)}</div>
      <ms-textfield
        label="${s("safety_interval",t)}"
        type="number"
        .value=${this._intervalDays}
        @input=${i=>this._intervalDays=i.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():h}
    `}_patchCondition(t,e){this._compoundConditions=this._compoundConditions.map((i,a)=>a===t?{...i,...e}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,us()]}_removeCondition(t){this._compoundConditions=this._compoundConditions.filter((e,i)=>i!==t)}_renderCompoundEditor(){let t=this._lang;return o`
      <div class="select-row">
        <label>${s("compound_logic",t)}</label>
        <select
          .value=${this._compoundLogic}
          @change=${e=>this._compoundLogic=e.target.value}
        >
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${s("compound_logic_and",t)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${s("compound_logic_or",t)}</option>
        </select>
      </div>
      <div class="field-help">${s("compound_help",t)}</div>
      ${this._compoundConditions.length===0?o`<div class="field-help">${s("compound_no_conditions",t)}</div>`:this._compoundConditions.map((e,i)=>this._renderCondition(e,i))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${s("compound_add_condition",t)}
      </button>
    `}_renderCondition(t,e){let i=this._lang,a=e+1;return o`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${s("compound_condition",i)} ${a}</span>
          <button
            type="button"
            class="icon-btn"
            title="${s("compound_remove_condition",i)}"
            @click=${()=>this._removeCondition(e)}
          >✕</button>
        </div>
        <ms-textfield
          label="${s("entity_id",i)} (${s("comma_separated",i)})"
          .value=${t.entityIds}
          @input=${l=>this._patchCondition(e,{entityIds:l.target.value})}
        ></ms-textfield>
        <div class="select-row">
          <label>${s("trigger_type",i)}</label>
          <select
            .value=${t.type}
            @change=${l=>this._patchCondition(e,{type:l.target.value})}
          >
            ${li.map(l=>o`<option value=${l} ?selected=${l===t.type}>${s(l,i)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(t,e)}
      </div>
    `}_renderConditionTypeFields(t,e){let i=this._lang;return t.type==="threshold"?o`
        <ms-textfield label="${s("trigger_above",i)}" type="number" .value=${t.above}
          @input=${a=>this._patchCondition(e,{above:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("trigger_below",i)}" type="number" .value=${t.below}
          @input=${a=>this._patchCondition(e,{below:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("for_minutes",i)}" type="number" .value=${t.forMinutes}
          @input=${a=>this._patchCondition(e,{forMinutes:a.target.value})}></ms-textfield>
      `:t.type==="counter"?o`
        <ms-textfield label="${s("target_value",i)}" type="number" .value=${t.targetValue}
          @input=${a=>this._patchCondition(e,{targetValue:a.target.value})}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${t.deltaMode}
            @change=${a=>this._patchCondition(e,{deltaMode:a.target.checked})} />
          ${s("delta_mode",i)}
        </label>
      `:t.type==="state_change"?o`
        <ms-textfield label="${s("from_state_optional",i)}" .value=${t.fromState}
          @input=${a=>this._patchCondition(e,{fromState:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("to_state_optional",i)}" .value=${t.toState}
          @input=${a=>this._patchCondition(e,{toState:a.target.value})}></ms-textfield>
        <ms-textfield label="${s("target_changes",i)}" type="number" .value=${t.targetChanges}
          @input=${a=>this._patchCondition(e,{targetChanges:a.target.value})}></ms-textfield>
      `:t.type==="runtime"?o`
        <ms-textfield label="${s("runtime_hours",i)}" type="number" .value=${t.runtimeHours}
          @input=${a=>this._patchCondition(e,{runtimeHours:a.target.value})}></ms-textfield>
      `:h}_renderUnitSelect(){let t=this._lang;return o`
      <div class="select-row">
        <label>${s("interval_unit",t)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${e=>this._intervalUnit=e.target.value}
        >
          ${["days","weeks","months","years"].map(e=>o`<option value=${e} ?selected=${e===this._intervalUnit}>${s("unit_"+e,t)}</option>`)}
        </select>
      </div>`}_toggleWeekday(t){this._weekdays=this._weekdays.includes(t)?this._weekdays.filter(e=>e!==t):[...this._weekdays,t]}_buildSchedule(){return this._scheduleType==="weekdays"?{kind:"weekdays",weekdays:[...this._weekdays].sort((t,e)=>t-e)}:this._scheduleType==="nth_weekday"?{kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)}:{kind:"day_of_month",day:parseInt(this._domDay,10)||1}}_renderCalendarFields(){let t=this._lang,e=ms(t);if(this._scheduleType==="weekdays")return o`
        <label class="field-label">${s("recurrence_on_days",t)}</label>
        <div class="weekday-chips">
          ${e.map((i,a)=>o`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(a)?"selected":""}"
              @click=${()=>this._toggleWeekday(a)}
            >${i}</button>`)}
        </div>`;if(this._scheduleType==="nth_weekday"){let i=[["1",s("ord_1",t)],["2",s("ord_2",t)],["3",s("ord_3",t)],["4",s("ord_4",t)],["5",s("ord_5",t)],["-1",s("ord_last",t)]];return o`
        <div class="select-row">
          <label>${s("recurrence_occurrence",t)}</label>
          <select .value=${this._nth} @change=${a=>this._nth=a.target.value}>
            ${i.map(([a,l])=>o`<option value=${a} ?selected=${a===this._nth}>${l}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${s("recurrence_weekday",t)}</label>
          <select .value=${this._nthWeekday} @change=${a=>this._nthWeekday=a.target.value}>
            ${e.map((a,l)=>o`<option value=${String(l)} ?selected=${String(l)===this._nthWeekday}>${a}</option>`)}
          </select>
        </div>`}return this._scheduleType==="day_of_month"?o`
        <ms-textfield
          label="${s("recurrence_day",t)}"
          type="number"
          min="1"
          max="31"
          .value=${this._domDay}
          @input=${i=>this._domDay=i.target.value}
        ></ms-textfield>`:h}_renderTriggerTypeFields(){let t=this._lang;return this._triggerType==="threshold"?o`
        <ms-textfield
          label="${s("trigger_above",t)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${e=>this._triggerAbove=e.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("trigger_below",t)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${e=>this._triggerBelow=e.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("for_at_least_minutes",t)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${e=>this._triggerForMinutes=e.target.value}
        ></ms-textfield>
      `:this._triggerType==="counter"?o`
        <ms-textfield
          label="${s("target_value",t)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${e=>this._triggerTargetValue=e.target.value}
        ></ms-textfield>
        <label>
          <input
            type="checkbox"
            .checked=${this._triggerDeltaMode}
            @change=${e=>this._triggerDeltaMode=e.target.checked}
          />
          ${s("delta_mode",t)}
        </label>
      `:this._triggerType==="state_change"?o`
        <ms-textfield
          label="${s("from_state_optional",t)}"
          .value=${this._triggerFromState}
          @input=${e=>this._triggerFromState=e.target.value}
        ></ms-textfield>
        <div class="field-help">${s("state_value_help",t)}</div>
        <ms-textfield
          label="${s("to_state_optional",t)}"
          .value=${this._triggerToState}
          @input=${e=>this._triggerToState=e.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${s("target_changes",t)}"
          type="number"
          min="1"
          .value=${this._triggerTargetChanges}
          @input=${e=>this._triggerTargetChanges=e.target.value}
        ></ms-textfield>
        <div class="field-help">${s("target_changes_help",t)}</div>
      `:this._triggerType==="runtime"?o`
        <ms-textfield
          label="${s("runtime_hours",t)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${e=>this._triggerRuntimeHours=e.target.value}
        ></ms-textfield>
      `:h}render(){if(!this._open)return o``;let t=this._lang,e=this._taskId?s("edit_task",t):s("new_task",t);return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:h}
          ${this._objectChoices.length>0?o`
            <div class="select-row">
              <label>${s("object",t)}</label>
              <select
                .value=${this._entryId}
                @change=${i=>this._entryId=i.target.value}
              >
                ${this._objectChoices.map(i=>o`<option value=${i.entry_id} ?selected=${i.entry_id===this._entryId}>${i.name}</option>`)}
              </select>
            </div>
          `:h}
          <ms-textfield
            label="${s("task_name",t)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${s("maintenance_type",t)}</label>
            <select
              .value=${this._type}
              @change=${i=>this._type=i.target.value}
            >
              ${ls.map(i=>o`<option value=${i} ?selected=${i===this._type}>${s(i,t)}</option>`)}
            </select>
          </div>
          <div class="select-row">
            <label>${s("priority",t)}</label>
            <select
              .value=${this._priority}
              @change=${i=>this._priority=i.target.value}
            >
              ${cs.map(i=>o`<option value=${i} ?selected=${i===this._priority}>${s("priority_"+i,t)}</option>`)}
            </select>
          </div>
          <div class="field">
            <label>${s("labels",t)}</label>
            <input
              type="text"
              .value=${this._labels}
              placeholder="${s("labels_placeholder",t)}"
              @input=${i=>this._labels=i.target.value}
            />
            <div class="field-help">${s("labels_help",t)}</div>
          </div>
          <div class="select-row">
            <label>${s("schedule_type",t)}</label>
            <select
              .value=${this._scheduleType}
              @change=${i=>this._scheduleType=i.target.value}
            >
              ${ds.map(i=>o`<option value=${i} ?selected=${i===this._scheduleType}>${s(i,t)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?o`
                <ms-textfield
                  label="${s("interval_value",t)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${i=>this._intervalDays=i.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${s("interval_anchor",t)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${i=>this._intervalAnchor=i.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${s("anchor_completion",t)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${s("anchor_planned",t)}</option>
                  </select>
                </div>
                ${this.scheduleTimeEnabled?o`
                  <ms-textfield
                    label="${s("schedule_time_optional",t)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${s("schedule_time_help",t)}"
                    @input=${i=>this._scheduleTime=i.target.value}
                  ></ms-textfield>
                `:h}
              `:h}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?o`
                <ms-textfield
                  label="${s("due_date",t)}"
                  type="date"
                  .value=${this._dueDate}
                  @input=${i=>this._dueDate=i.target.value}
                ></ms-textfield>
              `:h}
          <ms-textfield
            label="${s("warning_days",t)}"
            type="number"
            .value=${this._warningDays}
            @input=${i=>this._warningDays=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("earliest_completion_days",t)}"
            helper="${s("earliest_completion_days_help",t)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${i=>this._earliestCompletionDays=i.target.value}
          ></ms-textfield>
          ${this.checklistsEnabled?o`
            <h3>${s("checklist_steps_optional",t)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${s("checklist_placeholder",t)}"
              .value=${this._checklistText}
              @input=${i=>this._checklistText=i.target.value}
            ></textarea>
            <div class="field-help">${s("checklist_help",t)}</div>
          `:h}
          <ms-textfield
            label="${s("last_performed_optional",t)}"
            type="date"
            .value=${this._lastPerformed}
            @input=${i=>this._lastPerformed=i.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${s("responsible_user",t)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${i=>{let a=i.target.value;this._responsibleUserId=a||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${s("no_user_assigned",t)}</option>
              ${this._availableUsers.map(i=>o`<option value=${i.id} ?selected=${i.id===this._responsibleUserId}>${i.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?o`
            <div class="field">
              <label>${s("shared_with",t)}</label>
              <div class="field-help">${s("shared_with_help",t)}</div>
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
                <label>${s("rotation_strategy",t)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${i=>this._rotationStrategy=i.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",t)}</option>
                  ${["round_robin","least_completed","random"].map(i=>o`<option value=${i} ?selected=${i===this._rotationStrategy}>${s("rotation_"+i,t)}</option>`)}
                </select>
              </div>`:h}
          `:h}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"?o`
            <ms-textfield
              label="${s("environmental_entity_optional",t)}"
              helper="${s("environmental_entity_helper",t)}"
              .value=${this._environmentalEntity}
              @input=${i=>this._environmentalEntity=i.target.value.trim()}
            ></ms-textfield>
            ${this._environmentalEntity?o`
              <ms-textfield
                label="${s("environmental_attribute_optional",t)}"
                .value=${this._environmentalAttribute}
                @input=${i=>this._environmentalAttribute=i.target.value.trim()}
              ></ms-textfield>
            `:h}
          `:h}
          <ms-textfield
            label="${s("notes_optional",t)}"
            .value=${this._notes}
            @input=${i=>this._notes=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("documentation_url_optional",t)}"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ms-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${s("custom_icon_optional",t)}"
            .value=${this._customIcon}
            @value-changed=${i=>this._customIcon=i.detail.value||""}
          ></ha-icon-picker>
          ${this._availableTags.length>0?o`
              <div class="select-row">
                <label>${s("nfc_tag_id_optional",t)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${i=>this._nfcTagId=i.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${s("no_nfc_tag",t)}</option>
                  ${this._availableTags.map(i=>o`<option value=${i.id} ?selected=${i.id===this._nfcTagId}>${i.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${s("nfc_tags_refresh",t)}">↻</button>
              </div>
            `:o`
              <ms-textfield
                label="${s("nfc_tag_id_optional",t)}"
                .value=${this._nfcTagId}
                @input=${i=>this._nfcTagId=i.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${s("nfc_tags_empty_help",t)}
                <a href="/config/tags">${s("nfc_tags_open_settings",t)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${s("nfc_tags_refresh",t)}
                </button>
              </div>
            `}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${i=>this._enabled=i.target.checked}
            />
            ${s("task_enabled",t)}
          </label>
          ${this._renderCompletionActionsSection(t)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${s("cancel",t)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?s("saving",t):s("save",t)}
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
    .assignee-pool {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 14px;
      margin-top: 4px;
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
  `,p([y({attribute:!1})],x.prototype,"hass",2),p([y({type:Boolean,attribute:"checklists-enabled"})],x.prototype,"checklistsEnabled",2),p([y({type:Boolean,attribute:"schedule-time-enabled"})],x.prototype,"scheduleTimeEnabled",2),p([y({type:Boolean,attribute:"completion-actions-enabled"})],x.prototype,"completionActionsEnabled",2),p([y({type:Number,attribute:"default-warning-days"})],x.prototype,"defaultWarningDays",2),p([_()],x.prototype,"_open",2),p([_()],x.prototype,"_loading",2),p([_()],x.prototype,"_error",2),p([_()],x.prototype,"_entryId",2),p([_()],x.prototype,"_taskId",2),p([_()],x.prototype,"_objectChoices",2),p([_()],x.prototype,"_name",2),p([_()],x.prototype,"_type",2),p([_()],x.prototype,"_scheduleType",2),p([_()],x.prototype,"_intervalDays",2),p([_()],x.prototype,"_intervalUnit",2),p([_()],x.prototype,"_dueDate",2),p([_()],x.prototype,"_warningDays",2),p([_()],x.prototype,"_earliestCompletionDays",2),p([_()],x.prototype,"_intervalAnchor",2),p([_()],x.prototype,"_weekdays",2),p([_()],x.prototype,"_nth",2),p([_()],x.prototype,"_nthWeekday",2),p([_()],x.prototype,"_domDay",2),p([_()],x.prototype,"_notes",2),p([_()],x.prototype,"_documentationUrl",2),p([_()],x.prototype,"_customIcon",2),p([_()],x.prototype,"_priority",2),p([_()],x.prototype,"_labels",2),p([_()],x.prototype,"_enabled",2),p([_()],x.prototype,"_triggerEntityId",2),p([_()],x.prototype,"_triggerEntityIds",2),p([_()],x.prototype,"_triggerEntityLogic",2),p([_()],x.prototype,"_triggerAttribute",2),p([_()],x.prototype,"_triggerType",2),p([_()],x.prototype,"_triggerAbove",2),p([_()],x.prototype,"_triggerBelow",2),p([_()],x.prototype,"_triggerForMinutes",2),p([_()],x.prototype,"_triggerTargetValue",2),p([_()],x.prototype,"_triggerDeltaMode",2),p([_()],x.prototype,"_autoCompleteOnRecovery",2),p([_()],x.prototype,"_triggerFromState",2),p([_()],x.prototype,"_triggerToState",2),p([_()],x.prototype,"_triggerTargetChanges",2),p([_()],x.prototype,"_triggerRuntimeHours",2),p([_()],x.prototype,"_compoundLogic",2),p([_()],x.prototype,"_compoundConditions",2),p([_()],x.prototype,"_suggestedAttributes",2),p([_()],x.prototype,"_availableAttributes",2),p([_()],x.prototype,"_entityDomain",2),p([_()],x.prototype,"_lastPerformed",2),p([_()],x.prototype,"_nfcTagId",2),p([_()],x.prototype,"_availableTags",2),p([_()],x.prototype,"_responsibleUserId",2),p([_()],x.prototype,"_assigneePool",2),p([_()],x.prototype,"_rotationStrategy",2),p([_()],x.prototype,"_availableUsers",2),p([_()],x.prototype,"_checklistText",2),p([_()],x.prototype,"_scheduleTime",2),p([_()],x.prototype,"_actionService",2),p([_()],x.prototype,"_actionTargetEntity",2),p([_()],x.prototype,"_actionData",2),p([_()],x.prototype,"_actionDataJsonFallback",2),p([_()],x.prototype,"_actionTesting",2),p([_()],x.prototype,"_actionTestResult",2),p([_()],x.prototype,"_actionTestError",2),p([_()],x.prototype,"_qcNotes",2),p([_()],x.prototype,"_qcCost",2),p([_()],x.prototype,"_qcDuration",2),p([_()],x.prototype,"_qcFeedback",2),p([_()],x.prototype,"_environmentalEntity",2),p([_()],x.prototype,"_environmentalAttribute",2);customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",x);var q=class extends S{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photoDocId="";this._photoPreview="";this._photoUploading=!1}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState={},this._feedback="needed",this._photoDocId="",this._photoPreview="",this._photoUploading=!1)}_toggleCheck(t){let e=String(t);this._checklistState={...this._checklistState,[e]:!this._checklistState[e]}}_setFeedback(t){this._feedback=t}async _onPhotoInput(t){let e=t.target,i=e.files?.[0];if(e.value="",!!i){this._photoUploading=!0,this._error="";try{let a=new FormData;a.append("entry_id",this.entryId),a.append("tags","photo"),a.append("file",i,i.name);let l=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:a});if(!l.ok){this._error=l.status===413?s("doc_too_large",this.lang):s("doc_upload_failed",this.lang);return}let c=await l.json();c.id&&(this._photoDocId=c.id,this._photoPreview=URL.createObjectURL(i))}catch{this._error=s("doc_upload_failed",this.lang)}finally{this._photoUploading=!1}}}_removePhoto(){this._photoPreview&&URL.revokeObjectURL(this._photoPreview),this._photoDocId="",this._photoPreview=""}async _complete(){this._loading=!0,this._error="";try{let t={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(t.notes=this._notes),this._cost){let e=parseFloat(this._cost);!isNaN(e)&&e>=0&&(t.cost=e)}if(this._duration){let e=parseInt(this._duration,10);!isNaN(e)&&e>=0&&(t.duration=e)}this.checklist.length>0&&(t.checklist_state=this._checklistState),this.adaptiveEnabled&&(t.feedback=this._feedback),this._photoDocId&&(t.photo_doc_id=this._photoDocId),await this.hass.connection.sendMessagePromise(t),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(t){this._error=I(t,this.lang,s("save_error",this.lang))}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return o``;let t=this.lang||this.hass?.language||"en";return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${s("complete_title",t)}${this.taskName}</div>
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:h}
          ${this.checklist.length>0?o`
            <div class="checklist-section">
              <label class="checklist-label">${s("checklist",t)}</label>
              ${this.checklist.map((e,i)=>o`
                <label class="checklist-item" @click=${()=>this._toggleCheck(i)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(i)]} />
                  <span>${e}</span>
                </label>
              `)}
            </div>
          `:h}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${s("notes_optional",t)}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${e=>this._notes=e.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${s("cost_optional",t)}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${e=>this._cost=e.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${s("duration_minutes",t)}</span>
            <input type="number" step="1" min="0" class="field-input"
              .value=${this._duration}
              @input=${e=>this._duration=e.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${s("completion_photo_optional",t)}</span>
            ${this._photoPreview?o`
                <div class="photo-preview">
                  <img src=${this._photoPreview} alt="" />
                  <button type="button" class="photo-remove" @click=${this._removePhoto}
                    title="${s("remove",t)}">✕</button>
                </div>`:o`
                <label class="photo-pick">
                  <ha-icon icon="mdi:camera"></ha-icon>
                  <span>${this._photoUploading?s("uploading",t):s("add_photo",t)}</span>
                  <input type="file" accept="image/*" capture="environment"
                    ?disabled=${this._photoUploading}
                    @change=${this._onPhotoInput} />
                </label>`}
          </div>
          ${this.adaptiveEnabled?o`
            <div class="feedback-section">
              <label class="feedback-label">${s("was_maintenance_needed",t)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback==="needed"?"selected":""}"
                  @click=${()=>this._setFeedback("needed")}
                >${s("feedback_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_needed"?"selected":""}"
                  @click=${()=>this._setFeedback("not_needed")}
                >${s("feedback_not_needed",t)}</button>
                <button
                  class="feedback-btn ${this._feedback==="not_sure"?"selected":""}"
                  @click=${()=>this._setFeedback("not_sure")}
                >${s("feedback_not_sure",t)}</button>
              </div>
            </div>
          `:h}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading}
          >
            ${this._loading?s("completing",t):s("complete",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};q.styles=A`
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
  `,p([y({attribute:!1})],q.prototype,"hass",2),p([y()],q.prototype,"entryId",2),p([y()],q.prototype,"taskId",2),p([y()],q.prototype,"taskName",2),p([y()],q.prototype,"lang",2),p([y({type:Array})],q.prototype,"checklist",2),p([y({type:Boolean})],q.prototype,"adaptiveEnabled",2),p([_()],q.prototype,"_open",2),p([_()],q.prototype,"_notes",2),p([_()],q.prototype,"_cost",2),p([_()],q.prototype,"_duration",2),p([_()],q.prototype,"_loading",2),p([_()],q.prototype,"_error",2),p([_()],q.prototype,"_checklistState",2),p([_()],q.prototype,"_feedback",2),p([_()],q.prototype,"_photoDocId",2),p([_()],q.prototype,"_photoPreview",2),p([_()],q.prototype,"_photoUploading",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",q);function At(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ci(n){return!n.startsWith("data:image/svg+xml,")&&!n.startsWith("data:image/png;base64,")?"":At(n)}function vs(n){return n.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var tt=class extends S{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(t,e){this._entryId=t,this._taskId=null,this._objectName=e,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(t,e,i,a){this._entryId=t,this._taskId=e,this._objectName=i,this._taskName=a,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let t=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let e={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(e.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...e,action:"view"})];this._taskId&&i.push(this.hass.connection.sendMessagePromise({...e,action:"complete"}));let a=await Promise.all(i);if(t!==this._generateSeq)return;this._viewResult=a[0],a.length>1&&(this._completeResult=a[1])}catch(e){if(t!==this._generateSeq)return;let i=e?.code,a=e?.message;this._error=i==="no_url"||typeof a=="string"&&a.includes("No Home Assistant URL")?s("qr_error_no_url",this.lang):s("qr_error",this.lang)}finally{t===this._generateSeq&&(this._loading=!1)}}_setUrlMode(t){this._urlMode!==t&&(this._urlMode=t,this._generate())}_print(){if(!this._viewResult)return;let t=this._viewResult,e=t.label.task_name?`${t.label.object_name} \u2014 ${t.label.task_name}`:t.label.object_name,i=[t.label.manufacturer,t.label.model].filter(Boolean).join(" "),a=window.open("","_blank","width=600,height=500");if(!a)return;let l=this.lang||"en",c=At(e),d=At(i),u=!!this._completeResult,g=At(s("qr_action_view",l)),m=At(s("qr_action_complete",l));a.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${c}</title>
<style>
  body{font-family:sans-serif;text-align:center;padding:20px}
  h2{margin:0 0 4px}
  .sub{color:#666;font-size:14px;margin-bottom:16px}
  .qr-row{display:flex;justify-content:center;gap:24px;margin:12px 0}
  .qr-col{display:flex;flex-direction:column;align-items:center;gap:6px}
  .qr-col img{width:${u?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${c}</h2>
${d?`<div class="sub">${d}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${ci(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${g}</div>
  </div>
  ${u?`<div class="qr-col">
    <img src="${ci(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${m}</div>
  </div>`:""}
</div>
<div class="url">${At(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),a.document.close()}_downloadSvg(t,e){let i=decodeURIComponent(t.svg_data_uri.replace("data:image/svg+xml,","")),a=new Blob([i],{type:"image/svg+xml"}),l=URL.createObjectURL(a),c=document.createElement("a");c.href=l;let d=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;c.download=`qr-${vs(d)}-${e}.svg`,c.click(),URL.revokeObjectURL(l)}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return o``;let t=this.lang||this.hass?.language||"en",e=this._taskName?`${s("qr_code",t)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",t)}: ${this._objectName}`,i=!!this._viewResult;return o`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${e}</div>
        <div class="content">
          ${this._loading?o`<div class="loading">${s("qr_generating",t)}</div>`:this._error?o`<div class="error">${this._error}</div>`:i?o`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult?"small":""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${s("qr_action_view",t)}</div>
                        <button class="dl-btn"
                          @click=${()=>this._downloadSvg(this._viewResult,"info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${s("qr_download",t)}
                        </button>
                      </div>
                      ${this._completeResult?o`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${s("qr_action_complete",t)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._completeResult,"complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${s("qr_download",t)}
                              </button>
                            </div>
                          `:h}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  `:h}
          <div class="action-row">
            <label>${s("qr_url_mode",t)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode==="companion"?"active":""}"
                @click=${()=>this._setUrlMode("companion")}>${s("qr_mode_companion",t)}</button>
              <button class="toggle-btn ${this._urlMode==="local"?"active":""}"
                @click=${()=>this._setUrlMode("local")}>${s("qr_mode_local",t)}</button>
              <button class="toggle-btn ${this._urlMode==="server"?"active":""}"
                @click=${()=>this._setUrlMode("server")}>${s("qr_mode_server",t)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!i}
          >
            ${s("qr_print",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};tt.styles=A`
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
  `,p([y({attribute:!1})],tt.prototype,"hass",2),p([y()],tt.prototype,"lang",2),p([_()],tt.prototype,"_open",2),p([_()],tt.prototype,"_loading",2),p([_()],tt.prototype,"_error",2),p([_()],tt.prototype,"_viewResult",2),p([_()],tt.prototype,"_completeResult",2),p([_()],tt.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",tt);var di=5;function Nt(n){let r=n.getFullYear(),t=String(n.getMonth()+1).padStart(2,"0"),e=String(n.getDate()).padStart(2,"0");return`${r}-${t}-${e}`}function bs(n,r){let t=[];for(let e=0;e<r;e++){let i=new Date(n);i.setDate(i.getDate()+e),i.setHours(0,0,0,0),t.push(Nt(i))}return t}function de(n,r){let[t,e,i]=n.split("-").map(Number),a=new Date(t,e-1,i);return a.setDate(a.getDate()+r),Nt(a)}function fs(n){if(!n||n.length===0)return null;let r=n.map(t=>t.cost).filter(t=>typeof t=="number");return r.length===0?null:r.reduce((t,e)=>t+e,0)/r.length}function ys(n){let{windowStart:r,windowEnd:t,task:e,entryId:i,objectName:a}=n,l=[],c=(m,v)=>({date:m,entry_id:i,task_id:e.id,task_name:e.name,object_name:a,status:v&&(e.status==="overdue"||e.status==="triggered")?"ok":e.status,days_until_due:v?null:e.days_until_due??null,projected:v,schedule_type:e.schedule_type,interval_days:e.interval_days??null,interval_unit:e.interval_unit??null,responsible_user_id:e.responsible_user_id??null,avg_cost:fs(e.history),adaptive_enabled:!!e.adaptive_config?.enabled,prediction_confidence:e.threshold_prediction_confidence??null}),d=Math.max(1,Math.round(Re(e.interval_days,e.interval_unit)));if(e.status==="overdue"||e.status==="triggered"){if(l.push(c(r,!1)),e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let m=de(r,d),v=1;for(;m<=t&&v<di;)l.push(c(m,!0)),v++,m=de(m,d)}return l}let u=e.next_due;if(typeof u!="string"||!u)return l;let g=u.slice(0,10);if(g>=r&&g<=t)l.push(c(g,!1));else if(g>t)return l;if(e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0){let m=de(g,d),v=l.length;for(;m<=t&&v<di;)m>=r&&(l.push(c(m,!0)),v++),m=de(m,d)}return l}var pi={overdue:0,triggered:1,due_soon:2,ok:3};function hi(n,r,t,e=null){let i=bs(r,t),a=i[0],l=i[i.length-1],c=[];for(let u of n){let g=u.object?.name||"",m=u.entry_id,v=u.tasks||[];for(let f of v){if(e&&f.responsible_user_id!==e||f.enabled===!1)continue;let w=ys({windowStart:a,windowEnd:l,task:f,entryId:m,objectName:g});c.push(...w)}}let d=new Map;for(let u of i)d.set(u,[]);for(let u of c){let g=d.get(u.date);g&&g.push(u)}for(let[,u]of d)u.sort((g,m)=>{let v=pi[g.status]??99,f=pi[m.status]??99;if(v!==f)return v-f;if(g.projected!==m.projected)return g.projected?1:-1;let w=g.object_name.localeCompare(m.object_name);return w!==0?w:g.task_name.localeCompare(m.task_name)});return i.map(u=>({date:u,events:d.get(u)??[]}))}var xs={completed:"ok",reset:"ok",skipped:"due_soon",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok"};function $s(n,r){let t=[];for(let e=r-1;e>=0;e--){let i=new Date(n);i.setDate(i.getDate()-e),i.setHours(0,0,0,0),t.push(Nt(i))}return t}function ui(n,r,t,e=null){let i=$s(r,t),a=i[0],l=i[i.length-1],c=new Map;for(let u of i)c.set(u,[]);for(let u of n){let g=u.object?.name||"",m=u.entry_id,v=u.tasks||[];for(let f of v){if(e&&f.responsible_user_id!==e)continue;let w=f.history||[];for(let b of w){if(typeof b?.timestamp!="string")continue;let j=b.timestamp.slice(0,10);if(j<a||j>l)continue;let z=c.get(j);if(!z)continue;let H=b.type??"completed";z.push({date:j,entry_id:m,task_id:f.id,task_name:f.name,object_name:g,status:xs[H]??"ok",days_until_due:null,projected:!1,schedule_type:f.schedule_type,interval_days:f.interval_days??null,responsible_user_id:f.responsible_user_id??null,avg_cost:typeof b.cost=="number"?b.cost:null,adaptive_enabled:!!f.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:b.timestamp,history_type:H,history_cost:typeof b.cost=="number"?b.cost:null,history_notes:typeof b.notes=="string"?b.notes:null,history_duration:typeof b.duration=="number"?b.duration:null})}}}let d={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,u]of c)u.sort((g,m)=>{let v=d[g.history_type??""]??99,f=d[m.history_type??""]??99;if(v!==f)return v-f;let w=g.object_name.localeCompare(m.object_name);return w!==0?w:g.task_name.localeCompare(m.task_name)});return i.map(u=>({date:u,events:c.get(u)??[]}))}var _i=A`
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
`;var et=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._unsub=null;this._dataLoaded=!1;this._lastConnection=null}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(t){this._config={...t},t.past_days&&[30,90].includes(t.past_days)?this._pastDays=t.past_days:t.window_days&&[7,14,30,365].includes(t.window_days)&&(this._windowDays=t.window_days,this._pastDays=0),typeof t.user_filter=="string"&&(this._userFilter=t.user_filter)}getCardSize(){return 6}get _lang(){return this.hass?.language||"en"}disconnectedCallback(){if(super.disconnectedCallback(),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(t){super.updated(t);let e=this.hass?.language;if(e&&!ee(e)&&at(e).then(()=>this.requestUpdate()),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[t,e]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=t.objects,this._stats=e}catch{}}async _subscribe(){try{let t=await this.hass.connection.subscribeMessage(e=>{let i=e;this._objects=i.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected){t();return}this._unsub=t}catch{}}_onEventClick(t){if(t.history_timestamp){this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:t.entry_id,task_id:t.task_id,original_timestamp:t.history_timestamp},bubbles:!0,composed:!0}));return}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:t.entry_id,task_id:t.task_id},bubbles:!0,composed:!0}))}render(){if(!this.hass)return h;let t=this._lang,e=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,a=this._config.title,l=null;this._userFilter&&(l=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let c=new Date;c.setHours(0,0,0,0);let d=this._pastDays>0,u=d?ui(this._objects,c,this._pastDays,l):hi(this._objects,c,this._windowDays,l),g=Nt(c),m=this._windowDays===365||d,v=m?u.filter(b=>b.events.length>0):u,f=b=>{let j=`cal-status-${b.status}`,z=b.projected?"cal-event-projected":"",H=b.status==="overdue"&&b.days_until_due!=null?` (${Math.abs(b.days_until_due)}d ${s("overdue",t).toLowerCase()})`:"",M=b.projected&&b.interval_days?o`<span class="cal-event-recur">${b.interval_unit&&b.interval_unit!=="days"?`${b.interval_days} ${s("unit_"+b.interval_unit,t)}`:s("cal_every_n_days",t).replace("{n}",String(b.interval_days))}</span>`:h,T=b.schedule_type==="sensor_based",Y=T?o`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${s("cal_source_sensor",t)}" icon="mdi:trending-up"></ha-icon>`:o`<ha-icon class="cal-event-icon cal-source-time"
                title="${b.adaptive_enabled?s("cal_source_time_adaptive",t):s("cal_source_time",t)}"
                icon="${b.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,G=T&&b.prediction_confidence&&b.status!=="triggered"&&!b.projected?o`<span class="cal-event-prediction cal-conf-${b.prediction_confidence}">
            ${s("cal_predicted",t)} · ${s(`cal_confidence_${b.prediction_confidence}`,t)}
          </span>`:h,W=this._stats?.budget?.currency_symbol||_t,F=b.history_type?s(b.history_type,t):s(b.status,t);return o`
        <div class="cal-event ${z}"
          @click=${()=>this._onEventClick(b)}>
          ${Y}
          <span class="cal-status-pill ${j}">${F}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${b.object_name} · ${b.task_name}${H}</div>
            ${G}
            ${M}
          </div>
          ${b.avg_cost!=null&&b.avg_cost>0?o`<span class="cal-event-cost">${b.avg_cost.toFixed(0)} ${W}</span>`:h}
        </div>
      `},w=b=>{let[j,z,H]=b.date.split("-").map(Number),M=new Date(j,z-1,H),T=b.date===g,Y=M.toLocaleDateString(t,{weekday:"short"}),G=M.toLocaleDateString(t,{month:"long"});return o`
        <div class="cal-day-row">
          <div class="cal-day-pill ${T?"cal-today":""}">
            <span class="cal-pill-weekday">${Y}</span>
            <span class="cal-pill-day">${M.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${G}</span>
              ${T?o`<span class="cal-day-today-badge">${s("today",t)}</span>`:h}
            </div>
            ${b.events.length===0?o`<div class="cal-empty">${s("cal_no_events",t)}</div>`:b.events.map(f)}
          </div>
        </div>
      `};return o`
      <ha-card .header=${a}>
        ${e||i?o`
              <div class="cal-controls">
                ${e?o`
                      <div class="cal-window-chips cal-past-chips" title="${s("cal_past_windows",t)||"Past windows"}">
                        ${[30,90].map(b=>o`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays===b?"active":""}"
                            @click=${()=>{this._pastDays=b}}>
                            −${b}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${s("cal_forward_windows",t)||"Forward windows"}">
                        ${[7,14,30,365].map(b=>o`
                          <button class="cal-window-chip ${this._pastDays===0&&this._windowDays===b?"active":""}"
                            @click=${()=>{this._windowDays=b,this._pastDays=0}}>
                            ${b===365?"+1y":`+${b}d`}
                          </button>
                        `)}
                      </div>
                    `:h}
                ${i?o`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${b=>{this._userFilter=b.target.value}}>
                        <option value="">${s("all_users",t)}</option>
                        <option value="current_user">${s("my_tasks",t)}</option>
                      </select>
                    `:h}
              </div>
            `:h}
        <div class="cal-rolling">
          ${v.length===0&&m?o`<div class="cal-empty">${s("cal_no_events",t)}</div>`:v.map(w)}
        </div>
      </ha-card>
    `}};et.styles=[se,_i,A`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],p([y({attribute:!1})],et.prototype,"hass",2),p([_()],et.prototype,"_config",2),p([_()],et.prototype,"_objects",2),p([_()],et.prototype,"_stats",2),p([_()],et.prototype,"_windowDays",2),p([_()],et.prototype,"_pastDays",2),p([_()],et.prototype,"_userFilter",2),p([_()],et.prototype,"_unsub",2);var ws=[{value:7,label:"Week (7 days)"},{value:14,label:"Fortnight (14 days)"},{value:30,label:"Month (30 days, default)"},{value:365,label:"Year (365 days, empty days collapsed)"}],jt=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}setConfig(t){this._config={...t}}_valueChanged(t,e){let i={...this._config,[t]:e};t==="show_window_chips"&&e===!0&&delete i.show_window_chips,t==="show_user_filter"&&e===!0&&delete i.show_user_filter,t==="title"&&(!e||typeof e=="string"&&e.trim()==="")&&delete i.title,t==="user_filter"&&e===""&&delete i.user_filter,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let t=this._config.window_days??30,e=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,a=this._config.user_filter??"",l=this._config.title??"";return o`
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
            ${ws.map(c=>o`<option value="${c.value}" ?selected=${c.value===t}>${c.label}</option>`)}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">Show window chips inside the card</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${e}
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
    `}};jt.styles=A`
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
  `,p([y({attribute:!1})],jt.prototype,"hass",2),p([_()],jt.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",et);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",jt);var pe=window;pe.customCards=pe.customCards||[];var gi="maintenance-supporter-calendar-card",ks=pe.customCards.some(n=>n.type===gi);ks||pe.customCards.push({type:gi,name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var ct=class extends S{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null}get _lang(){return this.hass?.language||"en"}openEdit(t){this._draft={...t},this._originalSnapshot={...t},this._error="",this._open=!0}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(t,e){this._draft&&(this._draft={...this._draft,[t]:e})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let t={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(t.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(t.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(t.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(t.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(t.completed_by=this._draft.completed_by),Object.keys(t).filter(i=>!["type","entry_id","task_id","original_timestamp"].includes(i)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(t),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(t){this._error=I(t,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return h;let t=this._lang,e=this._draft;return o`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${s("history_edit_title",t)||"Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${s(e.type,t)||e.type}</span>
        </div>
        <label>
          <span>${s("history_edit_timestamp",t)||"Timestamp"}</span>
          <input type="datetime-local"
            .value=${e.timestamp.length>=16?e.timestamp.slice(0,16):e.timestamp}
            @change=${i=>{let a=i.target.value;this._set("timestamp",a.length===16?`${a}:00`:a)}} />
        </label>
        <label>
          <span>${s("notes_label",t)}</span>
          <textarea
            rows="3"
            @input=${i=>{let a=i.target.value;this._set("notes",a||null)}}
            .value=${e.notes??""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${s("cost",t)||"Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${e.cost!=null?String(e.cost):""}
              @input=${i=>{let a=i.target.value;this._set("cost",a?Number(a):null)}} />
          </label>
          <label>
            <span>${s("duration",t)||"Duration (min)"}</span>
            <input type="number" min="0"
              .value=${e.duration!=null?String(e.duration):""}
              @input=${i=>{let a=i.target.value;this._set("duration",a?Number(a):null)}} />
          </label>
        </div>
        ${this._error?o`<div class="error">${this._error}</div>`:h}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${s("cancel",t)||"Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving?s("saving",t)||"Saving\u2026":s("save",t)||"Save"}
          </button>
        </div>
      </div>
    `}};ct.styles=A`
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
  `,p([y({attribute:!1})],ct.prototype,"hass",2),p([_()],ct.prototype,"_open",2),p([_()],ct.prototype,"_saving",2),p([_()],ct.prototype,"_error",2),p([_()],ct.prototype,"_draft",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",ct);var J=class extends S{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel="",this._inputType="",this._inputValue="",this._open=!0,new Promise(e=>{this._resolve=e,this._promptResolve=null})}prompt(t){return this._title=t.title,this._message=t.message,this._confirmText=t.confirmText||"OK",this._danger=t.danger||!1,this._inputLabel=t.inputLabel||"",this._inputType=t.inputType||"text",this._inputValue=t.inputValue||"",this._open=!0,new Promise(e=>{this._promptResolve=e,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return h;let t=this.hass?.language||"en";return o`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel?o`
            <ha-textfield
              label="${this._inputLabel}"
              type="${this._inputType}"
              .value=${this._inputValue}
              @input=${e=>this._inputValue=e.target.value}
            ></ha-textfield>
          `:h}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button
            class="${this._danger?"danger":""}"
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};J.styles=A`
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
  `,p([y({attribute:!1})],J.prototype,"hass",2),p([_()],J.prototype,"_open",2),p([_()],J.prototype,"_title",2),p([_()],J.prototype,"_message",2),p([_()],J.prototype,"_confirmText",2),p([_()],J.prototype,"_danger",2),p([_()],J.prototype,"_inputLabel",2),p([_()],J.prototype,"_inputType",2),p([_()],J.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",J);var mi={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},vi=n=>(...r)=>({_$litDirective$:n,values:r}),he=class{constructor(r){}get _$AU(){return this._$AM._$AU}_$AT(r,t,e){this._$Ct=r,this._$AM=t,this._$Ci=e}_$AS(r,t){return this.update(r,t)}update(r,t){return this.render(...t)}};var Ut=class extends he{constructor(r){if(super(r),this.it=h,r.type!==mi.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(r){if(r===h||r==null)return this._t=void 0,this.it=r;if(r===lt)return r;if(typeof r!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(r===this.it)return this._t;this.it=r;let t=[r];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};Ut.directiveName="unsafeHTML",Ut.resultType=1;var bi=vi(Ut);var Es=["EUR","USD","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","CZK","PLN","RUB","SEK","NOK","DKK","UAH"],C=class extends S{constructor(){super(...arguments);this.budget=null;this._settings=null;this._loading=!0;this._importCsv="";this._importLoading=!1;this._includeHistory=!0;this._toast="";this._testingNotification=!1;this._users=[];this._vacEnabled=!1;this._vacStart="";this._vacEnd="";this._vacBuffer=3;this._vacExempt=new Set;this._vacIsActive=!1;this._vacWindowEnd=null;this._vacAllTasks=[];this._vacPreview=[];this._vacPreviewLoading=!1;this._vacSaving=!1;this._qrObjects=[];this._qrSelectedEntries=new Set;this._qrActions=new Set(["view"]);this._qrUrlMode="companion";this._qrBatchLoading=!1;this._qrBatchResults=[];this._qrObjectsLoaded=!1;this._loaded=!1;this._userService=null;this._sendTestNotification=async()=>{this._testingNotification=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/test_notification"}),e=t.message||(t.success?s("test_notification_success",this._lang):s("test_notification_failed",this._lang));this._showToast(e)}catch{this._showToast(s("test_notification_failed",this._lang))}finally{this._testingNotification=!1}}}get _lang(){return this.hass?.language||"en"}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._loaded?(this._loaded=!0,this._userService=new gt(this.hass),this._loadSettings(),this._loadUsers()):t.has("hass")&&this.hass&&this._userService&&this._userService.updateHass(this.hass)}async _loadUsers(){if(this._userService)try{this._users=await this._userService.getUsers()}catch{this._users=[]}}async _loadSettings(){this._loading=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});this._settings=t,this._hydrateVacationFromSettings()}catch{}this._loading=!1}_hydrateVacationFromSettings(){let t=this._settings?.vacation;t&&(this._vacEnabled=t.enabled,this._vacStart=t.start||"",this._vacEnd=t.end||"",this._vacBuffer=t.buffer_days,this._vacExempt=new Set(t.exempt_task_ids||[]),this._vacIsActive=t.is_active,this._vacWindowEnd=t.window_end)}async _updateSetting(t,e){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/update",settings:{[t]:e}});this._settings=i,this._showToast(s("settings_saved",this._lang)),this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(s("action_error",this._lang))}}_showToast(t){this._toast=t,setTimeout(()=>{this._toast=""},3e3)}_downloadFile(t,e,i){ne(t,e,i)}render(){let t=this._lang;return this._loading||!this._settings?o`<div class="settings-loading">Loading…</div>`:o`
      ${this._renderFeatures(t)}
      ${this._renderPanelAccess(t)}
      ${this._renderGeneral(t)}
      ${this._renderObjectsColumns(t)}
      ${this._settings.general.notifications_enabled?this._renderNotifications(t):h}
      ${this.features.budget?this._renderBudget(t):h}
      ${this._renderArchive(t)}
      ${this._renderVacation(t)}
      ${this._renderPrintQr(t)}
      ${this._renderImportExport(t)}
      ${this._toast?o`<div class="settings-toast">${this._toast}</div>`:h}
    `}scrollToSection(t){requestAnimationFrame(()=>{let e=this.shadowRoot;if(!e)return;let i=e.querySelector(`[data-section="${t}"]`)??e.querySelector(`[data-section-alt="${t}"]`);i&&i.scrollIntoView({behavior:"smooth",block:"start"})})}_renderPanelAccess(t){let e=new Set(this._settings.admin_panel_user_ids||[]),i=this._users.filter(c=>!c.is_admin),a=this._settings.operator_write_enabled??!1,l=(c,d)=>{let u=new Set(e);d?u.add(c):u.delete(c),this._updateSetting("admin_panel_user_ids",[...u])};return o`
      <div class="settings-section">
        <h3>${s("settings_panel_access",t)} ${a&&e.size>0?o`<span class="section-badge">${e.size}</span>`:h}</h3>
        <p class="section-desc">${s("settings_panel_access_desc",t)}</p>
        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_operator_write",t)}</span>
            <span class="setting-desc">${s("settings_operator_write_desc",t)}</span>
          </span>
          <input type="checkbox"
            .checked=${a}
            @change=${c=>this._updateSetting("operator_write_enabled",c.target.checked)} />
        </label>
        ${a?i.length===0?o`<div class="setting-row hint">${s("no_non_admin_users",t)}</div>`:i.map(c=>o`
              <label class="setting-row">
                <span>
                  <span class="setting-label">${c.name||c.id.slice(0,8)}</span>
                  <span class="setting-desc">${c.is_owner?s("owner_label",t):""}</span>
                </span>
                <input type="checkbox"
                  .checked=${e.has(c.id)}
                  @change=${d=>l(c.id,d.target.checked)} />
              </label>
            `):h}
      </div>
    `}_renderFeatures(t){let e=this._settings.features,i=[{key:"adaptive",settingKey:"advanced_adaptive_visible",label:s("feat_adaptive",t),desc:s("feat_adaptive_desc",t)},{key:"predictions",settingKey:"advanced_predictions_visible",label:s("feat_predictions",t),desc:s("feat_predictions_desc",t)},{key:"seasonal",settingKey:"advanced_seasonal_visible",label:s("feat_seasonal",t),desc:s("feat_seasonal_desc",t)},{key:"environmental",settingKey:"advanced_environmental_visible",label:s("feat_environmental",t),desc:s("feat_environmental_desc",t)},{key:"budget",settingKey:"advanced_budget_visible",label:s("feat_budget",t),desc:s("feat_budget_desc",t)},{key:"groups",settingKey:"advanced_groups_visible",label:s("feat_groups",t),desc:s("feat_groups_desc",t)},{key:"checklists",settingKey:"advanced_checklists_visible",label:s("feat_checklists",t),desc:s("feat_checklists_desc",t)},{key:"schedule_time",settingKey:"advanced_schedule_time_visible",label:s("feat_schedule_time",t),desc:s("feat_schedule_time_desc",t)},{key:"completion_actions",settingKey:"advanced_completion_actions_visible",label:s("feat_completion_actions",t),desc:s("feat_completion_actions_desc",t)}];return o`
      <div class="settings-section" data-section="settings" data-section-alt="groups">
        <h3>${s("settings_features",t)}</h3>
        <p class="section-desc">${s("settings_features_desc",t)}</p>
        ${i.map(a=>o`
          <label class="setting-row">
            <span>
              <span class="setting-label">${a.label}</span>
              <span class="setting-desc">${a.desc}</span>
            </span>
            <input type="checkbox" .checked=${e[a.key]}
              @change=${l=>this._updateSetting(a.settingKey,l.target.checked)} />
          </label>
        `)}
      </div>
    `}_renderObjectsColumns(t){let e=Ft(this._settings.objects_table_columns);return o`
      <div class="settings-section" data-section="objects_table_columns">
        <h3>${s("objects_table_columns_label",t)}</h3>
        <p class="section-desc">${s("objects_table_columns_hint",t)}</p>
        ${St.map(i=>o`
          <label class="setting-row">
            <span class="setting-label">${s(i.labelKey,t)}</span>
            <input
              type="checkbox"
              .checked=${e.includes(i.key)}
              ?disabled=${!!i.required}
              @change=${a=>this._toggleColumn(i.key,a.target.checked)}
            />
          </label>
        `)}
      </div>
    `}_toggleColumn(t,e){let i=new Set(Ft(this._settings.objects_table_columns));e?i.add(t):i.delete(t);let a=St.filter(l=>l.required||i.has(l.key)).map(l=>l.key);this._updateSetting("objects_table_columns",a)}_renderGeneral(t){let e=this._settings.general,i=e.notify_targets??[],a=this._settings.budget;return o`
      <div class="settings-section">
        <h3>${s("settings_general",t)}</h3>
        <label class="setting-row">
          <span class="setting-label">${s("settings_default_warning",t)}</span>
          <input type="number" min="1" max="365" .value=${String(e.default_warning_days)}
            @change=${l=>{let c=parseInt(l.target.value,10);c>=1&&c<=365&&this._updateSetting("default_warning_days",c)}} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_currency",t)}</span>
          <select @change=${l=>this._updateSetting("budget_currency",l.target.value)}>
            ${Es.map(l=>o`<option value=${l} ?selected=${a.currency===l}>${l}</option>`)}
          </select>
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_panel_enabled",t)}</span>
          <input type="checkbox" .checked=${e.panel_enabled}
            @change=${l=>this._updateSetting("panel_enabled",l.target.checked)} />
        </label>
        ${e.panel_enabled?o`
          <label class="setting-row">
            <span class="setting-label">${s("settings_panel_title",t)}</span>
            <input type="text" .value=${e.panel_title??""}
              placeholder="Maintenance"
              maxlength="50"
              @change=${l=>this._updateSetting("panel_title",l.target.value.trim())} />
          </label>
        `:""}
        <label class="setting-row">
          <span class="setting-label">${s("settings_notifications",t)}</span>
          <input type="checkbox" .checked=${e.notifications_enabled}
            @change=${l=>this._updateSetting("notifications_enabled",l.target.checked)} />
        </label>
        ${e.notifications_enabled?o`
          <label class="setting-row">
            <span class="setting-label">${s("settings_notify_service",t)}</span>
            <input type="text" list="ms-notify-services" .value=${e.notify_service}
              @change=${l=>this._updateSetting("notify_service",l.target.value.trim())} />
            <datalist id="ms-notify-services">
              ${i.map(l=>o`<option value=${l}></option>`)}
            </datalist>
          </label>
          <div class="setting-row">
            <span class="setting-label">${s("test_notification",t)}</span>
            <button class="ha-button secondary"
              ?disabled=${!e.notify_service||this._testingNotification}
              @click=${this._sendTestNotification}>
              ${this._testingNotification?s("testing",t):s("send_test",t)}
            </button>
          </div>
        `:h}
      </div>
    `}_renderNotifications(t){let e=this._settings.notifications,i=this._settings.actions;return o`
      <div class="settings-section">
        <h3>${s("settings_notifications",t)}</h3>

        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_notify_due_soon",t)}</span>
          </span>
          <input type="checkbox" .checked=${e.due_soon_enabled}
            @change=${a=>this._updateSetting("notify_due_soon_enabled",a.target.checked)} />
        </label>
        ${e.due_soon_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_interval_hours",t)}</span>
            <input type="number" min="0" max="720" .value=${String(e.due_soon_interval_hours)}
              @change=${a=>this._updateSetting("notify_due_soon_interval_hours",parseInt(a.target.value,10)||0)} />
          </label>
        `:h}

        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_notify_overdue",t)}</span>
          </span>
          <input type="checkbox" .checked=${e.overdue_enabled}
            @change=${a=>this._updateSetting("notify_overdue_enabled",a.target.checked)} />
        </label>
        ${e.overdue_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_interval_hours",t)}</span>
            <input type="number" min="0" max="720" .value=${String(e.overdue_interval_hours)}
              @change=${a=>this._updateSetting("notify_overdue_interval_hours",parseInt(a.target.value,10)||0)} />
          </label>
        `:h}

        <label class="setting-row">
          <span>
            <span class="setting-label">${s("settings_notify_triggered",t)}</span>
          </span>
          <input type="checkbox" .checked=${e.triggered_enabled}
            @change=${a=>this._updateSetting("notify_triggered_enabled",a.target.checked)} />
        </label>
        ${e.triggered_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_interval_hours",t)}</span>
            <input type="number" min="0" max="720" .value=${String(e.triggered_interval_hours)}
              @change=${a=>this._updateSetting("notify_triggered_interval_hours",parseInt(a.target.value,10)||0)} />
          </label>
        `:h}

        <label class="setting-row">
          <span class="setting-label">${s("settings_quiet_hours",t)}</span>
          <input type="checkbox" .checked=${e.quiet_hours_enabled}
            @change=${a=>this._updateSetting("quiet_hours_enabled",a.target.checked)} />
        </label>
        ${e.quiet_hours_enabled?o`
          <div class="setting-row sub-row">
            <span class="setting-desc">${s("settings_quiet_start",t)}</span>
            <input type="time" .value=${e.quiet_hours_start}
              @change=${a=>this._updateSetting("quiet_hours_start",a.target.value)} />
          </div>
          <div class="setting-row sub-row">
            <span class="setting-desc">${s("settings_quiet_end",t)}</span>
            <input type="time" .value=${e.quiet_hours_end}
              @change=${a=>this._updateSetting("quiet_hours_end",a.target.value)} />
          </div>
        `:h}

        <label class="setting-row">
          <span class="setting-label">${s("settings_max_per_day",t)}</span>
          <input type="number" min="0" max="100" .value=${String(e.max_per_day)}
            @change=${a=>this._updateSetting("max_notifications_per_day",parseInt(a.target.value,10)||0)} />
        </label>

        <label class="setting-row">
          <span class="setting-label">${s("settings_bundling",t)}</span>
          <input type="checkbox" .checked=${e.bundling_enabled}
            @change=${a=>this._updateSetting("notification_bundling_enabled",a.target.checked)} />
        </label>
        ${e.bundling_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_bundle_threshold",t)}</span>
            <input type="number" min="2" max="20" .value=${String(e.bundle_threshold)}
              @change=${a=>this._updateSetting("notification_bundle_threshold",parseInt(a.target.value,10)||2)} />
          </label>
        `:h}

        <h4 style="margin: 16px 0 8px; font-size: 14px;">${s("settings_actions",t)}</h4>
        <label class="setting-row">
          <span class="setting-label">${s("settings_action_complete",t)}</span>
          <input type="checkbox" .checked=${i.complete_enabled}
            @change=${a=>this._updateSetting("action_complete_enabled",a.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_action_skip",t)}</span>
          <input type="checkbox" .checked=${i.skip_enabled}
            @change=${a=>this._updateSetting("action_skip_enabled",a.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_action_snooze",t)}</span>
          <input type="checkbox" .checked=${i.snooze_enabled}
            @change=${a=>this._updateSetting("action_snooze_enabled",a.target.checked)} />
        </label>
        ${i.snooze_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_snooze_hours",t)}</span>
            <input type="number" min="1" max="168" .value=${String(i.snooze_duration_hours)}
              @change=${a=>this._updateSetting("snooze_duration_hours",parseInt(a.target.value,10)||4)} />
          </label>
        `:h}
        <label class="setting-row">
          <span class="setting-label">${s("settings_weekly_digest",t)}</span>
          <input type="checkbox" .checked=${i.weekly_digest_enabled}
            @change=${a=>this._updateSetting("weekly_digest_enabled",a.target.checked)} />
        </label>
        <div class="setting-hint">${s("settings_weekly_digest_hint",t)}</div>
        <label class="setting-row">
          <span class="setting-label">${s("settings_warranty_reminder",t)}</span>
          <input type="checkbox" .checked=${i.warranty_reminder_enabled}
            @change=${a=>this._updateSetting("warranty_reminder_enabled",a.target.checked)} />
        </label>
        ${i.warranty_reminder_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_warranty_reminder_days",t)}</span>
            <input type="number" min="1" max="365" .value=${String(i.warranty_reminder_days)}
              @change=${a=>this._updateSetting("warranty_reminder_days",parseInt(a.target.value,10)||30)} />
          </label>
        `:h}
        <div class="setting-hint">${s("settings_warranty_reminder_hint",t)}</div>
      </div>
    `}_renderBudget(t){let e=this._settings.budget;return o`
      <div class="settings-section" data-section="budget">
        <h3>${s("settings_budget",t)}</h3>
        <label class="setting-row">
          <span class="setting-label">${s("settings_budget_monthly",t)}</span>
          <input type="number" min="0" step="0.01" .value=${String(e.monthly)}
            @change=${i=>this._updateSetting("budget_monthly",parseFloat(i.target.value)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_budget_yearly",t)}</span>
          <input type="number" min="0" step="0.01" .value=${String(e.yearly)}
            @change=${i=>this._updateSetting("budget_yearly",parseFloat(i.target.value)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_budget_alerts",t)}</span>
          <input type="checkbox" .checked=${e.alerts_enabled}
            @change=${i=>this._updateSetting("budget_alerts_enabled",i.target.checked)} />
        </label>
        ${e.alerts_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_budget_threshold",t)}</span>
            <input type="number" min="1" max="100" .value=${String(e.alert_threshold_pct)}
              @change=${i=>this._updateSetting("budget_alert_threshold",parseInt(i.target.value,10)||80)} />
          </label>
        `:h}
      </div>
    `}_renderArchive(t){let e=this._settings.archive??{oneoff_days:14,delete_archived_oneoff_days:0};return o`
      <div class="settings-section" data-section="archive">
        <h3>${s("settings_archive",t)}</h3>
        <p class="section-desc">${s("settings_archive_desc",t)}</p>
        <label class="setting-row">
          <span class="setting-label">${s("settings_archive_oneoff_days",t)}</span>
          <input type="number" min="0" max="3650" step="1" .value=${String(e.oneoff_days)}
            @change=${i=>this._updateSetting("archive_oneoff_days",parseInt(i.target.value,10)||0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_delete_archived_oneoff_days",t)}</span>
          <input type="number" min="0" max="3650" step="1" .value=${String(e.delete_archived_oneoff_days)}
            @change=${i=>this._updateSetting("delete_archived_oneoff_days",parseInt(i.target.value,10)||0)} />
        </label>
      </div>
    `}_renderVacation(t){let e=this._vacEnabled&&!this._vacIsActive&&this._vacWindowEnd&&new Date(this._vacWindowEnd)<new Date,i=this._vacExempt.size;return o`
      <div class="settings-section vacation-section" data-section="vacation">
        <h3>
          ${s("vacation_title",t)}
          ${this._vacIsActive?o`<span class="vac-badge active">${s("vacation_active",t)}</span>`:h}
          ${e?o`<span class="vac-badge stale">${s("vacation_ended",t)}</span>`:h}
        </h3>
        <p class="section-desc">${s("vacation_desc",t)}</p>

        <label class="vac-toggle">
          <input type="checkbox" .checked=${this._vacEnabled}
            @change=${a=>this._toggleVacationEnabled(a.target.checked)} />
          ${s("vacation_enable",t)}
        </label>

        <div class="vac-grid">
          <label class="vac-field">
            <span class="filter-label">${s("vacation_start",t)}</span>
            <input type="date" .value=${this._vacStart}
              @change=${a=>this._setVacationDate("start",a.target.value)} />
          </label>
          <label class="vac-field">
            <span class="filter-label">${s("vacation_end",t)}</span>
            <input type="date" .value=${this._vacEnd}
              @change=${a=>this._setVacationDate("end",a.target.value)} />
          </label>
          <label class="vac-field">
            <span class="filter-label">${s("vacation_buffer",t)}</span>
            <input type="number" min="0" max="14" .value=${String(this._vacBuffer)}
              @change=${a=>this._setVacationBuffer(parseInt(a.target.value,10)||0)} />
          </label>
        </div>

        <details class="vac-exempt-panel">
          <summary>
            ${s("vacation_exempt_title",t)}
            ${i>0?o`<span class="section-badge">${i}</span>`:h}
          </summary>
          <p class="section-desc">${s("vacation_exempt_desc",t)}</p>
          ${this._vacAllTasks.length===0?o`<button @click=${this._loadAllTasksForVacation}>${s("vacation_load_tasks",t)}</button>`:o`
              <div class="vac-task-list">
                ${this._renderVacationTaskList(t)}
              </div>
            `}
        </details>

        ${this._vacStart&&this._vacEnd?o`
          <div class="vac-preview-toolbar">
            <button @click=${this._loadVacationPreview} ?disabled=${this._vacPreviewLoading}>
              ${this._vacPreviewLoading?"\u2026":s("vacation_preview_btn",t)}
            </button>
            ${this._vacPreview.length>0?o`<span class="vac-preview-count">${this._vacPreview.length} ${s("vacation_preview_affected",t)}</span>`:h}
          </div>
          ${this._vacPreview.length>0?this._renderVacationPreview(t):h}
        `:h}

        ${this._vacIsActive||e?o`<button class="vac-end-now" @click=${this._endVacationNow}>
              ${s("vacation_end_now",t)}
            </button>`:h}
      </div>
    `}_renderVacationTaskList(t){let e=new Map;for(let a of this._vacAllTasks){let l=e.get(a.object_name)||[];l.push(a),e.set(a.object_name,l)}return[...e.entries()].sort(([a],[l])=>a.localeCompare(l)).map(([a,l])=>o`
      <div class="vac-task-group">
        <div class="vac-task-group-name">${a||s("no_objects",t)}</div>
        ${l.sort((c,d)=>c.task_name.localeCompare(d.task_name)).map(c=>o`
            <label class="vac-task-row">
              <input type="checkbox"
                .checked=${this._vacExempt.has(c.task_id)}
                @change=${d=>this._toggleVacationExempt(c.task_id,d.target.checked)} />
              <span>${c.task_name}</span>
            </label>
          `)}
      </div>
    `)}_renderVacationPreview(t){return o`
      <div class="vac-preview-list">
        ${this._vacPreview.map(e=>{let i=e.events.map(l=>{let c=`vacation_event_${l.status}`;return`${l.date} (${s(c,t)})`}).join(" \xB7 "),a=!e.will_suppress;return o`
            <div class="vac-preview-row ${a?"exempt":""}">
              <div class="vac-preview-info">
                <div class="vac-preview-name">
                  <strong>${e.object_name}</strong> · ${e.task_name}
                  ${e.kind==="sensor_based"?o`<span class="vac-preview-kind">${s("vacation_sensor_based",t)}</span>`:h}
                </div>
                <div class="vac-preview-events">${i}</div>
              </div>
              <div class="vac-preview-actions">
                <button @click=${()=>this._previewActionComplete(e)}>${s("qr_action_complete",t)}</button>
                ${e.kind==="time_based"?o`<button @click=${()=>this._previewActionSkip(e)}>${s("qr_action_skip",t)}</button>`:h}
                <button class=${a?"vac-notify-on":""}
                  @click=${()=>this._toggleVacationExempt(e.task_id,!a)}>
                  ${a?s("vacation_action_unsilence",t):s("vacation_action_notify",t)}
                </button>
              </div>
            </div>
          `})}
      </div>
    `}async _loadAllTasksForVacation(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),e=[];for(let i of t.objects||[])for(let a of i.tasks||[])e.push({entry_id:i.entry_id,object_name:i.object.name||"",task_id:a.id,task_name:a.name||""});this._vacAllTasks=e}catch{this._showToast(s("action_error",this._lang))}}async _saveVacation(t){if(!this._vacSaving){this._vacSaving=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/update",...t});this._vacEnabled=e.enabled,this._vacStart=e.start||"",this._vacEnd=e.end||"",this._vacBuffer=e.buffer_days,this._vacExempt=new Set(e.exempt_task_ids||[]),this._vacIsActive=e.is_active,this._vacWindowEnd=e.window_end,this.dispatchEvent(new CustomEvent("settings-changed"))}catch(e){let i=e?.message||s("action_error",this._lang);this._showToast(i)}finally{this._vacSaving=!1}}}_toggleVacationEnabled(t){this._saveVacation({enabled:t})}_setVacationDate(t,e){let i={};i[t]=e||null,this._saveVacation(i)}_setVacationBuffer(t){t<0||t>14||this._saveVacation({buffer_days:t})}_toggleVacationExempt(t,e){let i=new Set(this._vacExempt);e?i.add(t):i.delete(t),this._saveVacation({exempt_task_ids:[...i]})}async _loadVacationPreview(){this._vacPreviewLoading=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/preview"});this._vacPreview=t.rows||[]}catch{this._showToast(s("action_error",this._lang))}finally{this._vacPreviewLoading=!1}}async _previewActionComplete(t){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/complete",entry_id:t.entry_id,task_id:t.task_id}),this._showToast(s("vacation_marked_complete",this._lang)),await this._loadVacationPreview()}catch{this._showToast(s("action_error",this._lang))}}async _previewActionSkip(t){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/skip",entry_id:t.entry_id,task_id:t.task_id,reason:"Skipped before vacation"}),this._showToast(s("vacation_marked_skip",this._lang)),await this._loadVacationPreview()}catch{this._showToast(s("action_error",this._lang))}}async _endVacationNow(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/vacation/end_now"});this._vacEnabled=t.enabled,this._vacEnd=t.end||"",this._vacIsActive=t.is_active,this._vacWindowEnd=t.window_end,this.dispatchEvent(new CustomEvent("settings-changed")),this._showToast(s("vacation_ended",this._lang))}catch{this._showToast(s("action_error",this._lang))}}_renderPrintQr(t){let e=this._qrSelectedEntries.size||this._qrObjects.length,i=this._qrActions.size,a=e*i,l=a>200;return o`
      <div class="settings-section qr-print-section">
        <h3>${s("qr_print_title",t)}</h3>
        <p class="section-desc">${s("qr_print_desc",t)}</p>

        ${this._qrObjectsLoaded?o`
            <details open class="qr-filter-panel">
              <summary>${s("qr_print_filter",t)}</summary>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${s("qr_print_objects",t)}</div>
                <div class="qr-object-list">
                  ${this._qrObjects.length===0?o`<div class="hint">${s("no_objects",t)}</div>`:this._qrObjects.map(c=>o`
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
                <div class="qr-filter-label">${s("qr_print_actions",t)}</div>
                <div class="qr-action-chips">
                  ${["view","complete","skip"].map(c=>o`
                    <label class="qr-action-chip ${this._qrActions.has(c)?"active":""}">
                      <input type="checkbox"
                        .checked=${this._qrActions.has(c)}
                        @change=${d=>this._toggleQrAction(c,d.target.checked)} />
                      ${s("qr_action_"+c,t)}
                    </label>
                  `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${s("qr_print_url_mode",t)}</div>
                <select .value=${this._qrUrlMode}
                  @change=${c=>{this._qrUrlMode=c.target.value}}>
                  <option value="companion">${s("qr_mode_companion",t)}</option>
                  <option value="local">${s("qr_mode_local",t)}</option>
                  <option value="server">${s("qr_mode_server",t)}</option>
                </select>
              </div>

              <div class="qr-filter-group qr-filter-actions">
                <div class="qr-estimate ${l?"error":""}">
                  ${s("qr_print_estimate",t)}: <strong>${a}</strong>
                  ${l?o` — ${s("qr_print_over_limit",t)}`:h}
                </div>
                <button
                  ?disabled=${this._qrBatchLoading||l||i===0}
                  @click=${this._generateBatch}>
                  ${this._qrBatchLoading?s("qr_print_generating",t):s("qr_print_generate",t)}
                </button>
              </div>
            </details>

            ${this._qrBatchResults.length>0?o`
                <div class="qr-results-toolbar">
                  <span>${this._qrBatchResults.length} ${s("qr_print_ready",t)}</span>
                  <button @click=${this._printQrs}>${s("qr_print_print_button",t)}</button>
                </div>
                <div class="qr-print-grid">
                  ${this._qrBatchResults.map(c=>o`
                    <div class="qr-print-cell">
                      <div class="qr-svg">${bi(c.svg)}</div>
                      <div class="qr-label">
                        <div class="qr-label-obj">${c.object_name}</div>
                        <div class="qr-label-task">${c.task_name}</div>
                        <div class="qr-label-action">${s("qr_action_"+c.action,t)}</div>
                      </div>
                    </div>
                  `)}
                </div>
              `:h}
          `:o`<button @click=${this._loadQrObjects}>${s("qr_print_load",t)}</button>`}
      </div>
    `}async _loadQrObjects(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._qrObjects=(t.objects||[]).map(e=>({entry_id:e.entry_id,name:e.object.name,task_count:(e.tasks||[]).length})).sort((e,i)=>e.name.localeCompare(i.name)),this._qrObjectsLoaded=!0}catch{this._showToast(s("action_error",this._lang))}}_toggleQrObject(t,e){let i=new Set(this._qrSelectedEntries);if(i.size===0)for(let a of this._qrObjects)i.add(a.entry_id);e?i.add(t):i.delete(t),i.size===this._qrObjects.length&&i.clear(),this._qrSelectedEntries=i}_toggleQrAction(t,e){let i=new Set(this._qrActions);e?i.add(t):i.delete(t),this._qrActions=i}async _generateBatch(){this._qrBatchLoading=!0,this._qrBatchResults=[];try{let t={type:"maintenance_supporter/qr/batch_generate",actions:[...this._qrActions],url_mode:this._qrUrlMode};this._qrSelectedEntries.size>0&&(t.entry_ids=[...this._qrSelectedEntries]);let e=await this.hass.connection.sendMessagePromise(t);this._qrBatchResults=e.qrs||[],this._qrBatchResults.length===0&&this._showToast(s("qr_print_empty",this._lang))}catch(t){let e=t?.message||s("action_error",this._lang);this._showToast(e)}finally{this._qrBatchLoading=!1}}_printQrs(){if(this._qrBatchResults.length===0)return;let t=this._lang,e=this._qrBatchResults.map(c=>{let d=s("qr_action_"+c.action,t);return`
        <div class="cell">
          <div class="qr">${c.svg}</div>
          <div class="label">
            <div class="obj">${this._escapeHtml(c.object_name)}</div>
            <div class="task">${this._escapeHtml(c.task_name)}</div>
            <div class="action">${this._escapeHtml(d)}</div>
          </div>
        </div>`}).join(""),i=s("qr_print_title",t),a=`<!DOCTYPE html>
<html lang="${this._escapeHtml(t)}">
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
    <button onclick="window.print()">${this._escapeHtml(s("qr_print_print_button",t))}</button>
  </div>
  <div class="grid">${e}</div>
  <script>window.addEventListener("load", function () { setTimeout(function () { window.print(); }, 250); });<\/script>
</body>
</html>`,l=window.open("","_blank","width=900,height=1100");if(!l){window.print();return}l.document.open(),l.document.write(a),l.document.close()}_escapeHtml(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}_renderImportExport(t){return o`
      <div class="settings-section">
        <h3>${s("settings_import_export",t)}</h3>
        <div class="settings-actions">
          <label class="export-history-toggle">
            <input type="checkbox" .checked=${this._includeHistory}
              @change=${e=>{this._includeHistory=e.target.checked}} />
            ${s("settings_include_history",t)}
          </label>
        </div>
        <div class="settings-actions">
          <button @click=${this._exportJson}>${s("settings_export_json",t)}</button>
          <button @click=${this._exportYaml}>${s("settings_export_yaml",t)}</button>
          <button @click=${this._exportCsv}>${s("settings_export_csv",t)}</button>
        </div>
        <div class="import-section">
          <textarea class="import-area" .value=${this._importCsv}
            placeholder=${s("settings_import_placeholder",t)}
            @input=${e=>{this._importCsv=e.target.value}}
          ></textarea>
          <div class="settings-actions">
            <button ?disabled=${!this._importCsv.trim()||this._importLoading}
              @click=${this._importCsvAction}>
              ${this._importLoading?"\u2026":s("settings_import_btn",t)}
            </button>
          </div>
        </div>
      </div>
    `}async _exportJson(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/export",format:"json",include_history:this._includeHistory}),e=new Date().toISOString().slice(0,10);this._downloadFile(t.data,`maintenance_export_${e}.json`,"application/json"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _exportYaml(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/export",format:"yaml",include_history:this._includeHistory}),e=new Date().toISOString().slice(0,10);this._downloadFile(t.data,`maintenance_export_${e}.yaml`,"application/yaml"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _exportCsv(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/export"}),e=new Date().toISOString().slice(0,10);this._downloadFile(t.csv,`maintenance_export_${e}.csv`,"text/csv"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _importCsvAction(){let t=this._importCsv.trim();if(t){this._importLoading=!0;try{let e=t.startsWith("object_name"),a=(await this.hass.connection.sendMessagePromise(e?{type:"maintenance_supporter/csv/import",csv_content:t}:{type:"maintenance_supporter/json/import",json_content:t})).created??0;this._showToast(s("settings_import_success",this._lang).replace("{count}",String(a))),this._importCsv="",this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(s("action_error",this._lang))}this._importLoading=!1}}};C.styles=A`
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
  `,p([y({attribute:!1})],C.prototype,"hass",2),p([y({attribute:!1})],C.prototype,"features",2),p([y({attribute:!1})],C.prototype,"budget",2),p([_()],C.prototype,"_settings",2),p([_()],C.prototype,"_loading",2),p([_()],C.prototype,"_importCsv",2),p([_()],C.prototype,"_importLoading",2),p([_()],C.prototype,"_includeHistory",2),p([_()],C.prototype,"_toast",2),p([_()],C.prototype,"_testingNotification",2),p([_()],C.prototype,"_users",2),p([_()],C.prototype,"_vacEnabled",2),p([_()],C.prototype,"_vacStart",2),p([_()],C.prototype,"_vacEnd",2),p([_()],C.prototype,"_vacBuffer",2),p([_()],C.prototype,"_vacExempt",2),p([_()],C.prototype,"_vacIsActive",2),p([_()],C.prototype,"_vacWindowEnd",2),p([_()],C.prototype,"_vacAllTasks",2),p([_()],C.prototype,"_vacPreview",2),p([_()],C.prototype,"_vacPreviewLoading",2),p([_()],C.prototype,"_vacSaving",2),p([_()],C.prototype,"_qrObjects",2),p([_()],C.prototype,"_qrSelectedEntries",2),p([_()],C.prototype,"_qrActions",2),p([_()],C.prototype,"_qrUrlMode",2),p([_()],C.prototype,"_qrBatchLoading",2),p([_()],C.prototype,"_qrBatchResults",2),p([_()],C.prototype,"_qrObjectsLoaded",2);customElements.define("maintenance-settings-view",C);var Z=class extends S{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0}get _lang(){return this.hass?.language||"en"}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),at(this._lang).then(()=>this.requestUpdate()))}async _load(){this._busy=!0;try{this._summary=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/storage"}),this._error=""}catch(t){this._error=I(t,this._lang)}finally{this._loaded=!0,this._busy=!1}}_nameFor(t){return this.objects.find(i=>i.object?.id===t)?.object?.name||t.slice(0,8)}_entryFor(t){return this.objects.find(e=>e.object?.id===t)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(t){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:t},bubbles:!0,composed:!0}))}_onSearch(t){this._query=t.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let t=this._query.trim();if(!t){this._results=[];return}try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/search",query:t});this._results=e.results||[]}catch(e){this._error=I(e,this._lang),this._results=[]}}async _openResult(t){if(t.kind==="weblink"){window.open(t.url,"_blank","noopener");return}let e=window.open("about:blank","_blank");try{let i=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${t.id}`,expires:300});e&&(e.location.href=new URL(i.path,window.location.origin).href)}catch(i){e&&e.close(),this._error=I(i,this._lang)}}_renderResult(t,e){return o`
      <div class="obj-row result-row" title=${s("doc_open",e)} @click=${()=>this._openResult(t)}>
        <ha-icon icon=${t.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${t.title||t.filename||t.url}</div>
          <div class="result-obj">${t.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${t.kind==="weblink"?"mdi:open-in-new":"mdi:eye-outline"}></ha-icon>
      </div>
    `}render(){if(!this._loaded||!this._summary)return h;let t=this._summary;if(t.document_count===0)return h;let e=this._lang,i=Object.entries(t.by_object).filter(([,a])=>a.files>0||a.links>0).map(([a,l])=>({id:a,name:this._nameFor(a),entry:this._entryFor(a),...l})).sort((a,l)=>l.bytes-a.bytes);return o`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <button
              class="toggle"
              @click=${this._toggle}
              aria-expanded=${this._expanded?"true":"false"}
              aria-label=${s("doc_storage_title",e)}
            >
              <ha-icon class="chevron" icon=${this._expanded?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
              <span class="emoji">🗄️</span>
              <span class="title-text">${s("doc_storage_title",e)}</span>
              <span class="header-summary">
                ${rt(t.total_bytes)}
                ${t.dedup_savings_bytes>0?o`<span class="saved">−${rt(t.dedup_savings_bytes)}</span>`:h}
              </span>
            </button>
            <button
              class="icon-btn"
              title=${s("doc_storage_refresh",e)}
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
                      <div class="stat-value">${rt(t.total_bytes)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${t.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${t.link_count}
                      </div>
                    </div>
                    ${t.dedup_savings_bytes>0?o`<div class="stat">
                          <div class="stat-value saved">−${rt(t.dedup_savings_bytes)}</div>
                          <div class="stat-label">${s("doc_storage_saved",e)}</div>
                        </div>`:h}
                  </div>

                  <div class="doc-search">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <input
                      type="search"
                      aria-label=${s("doc_search",e)}
                      placeholder=${s("doc_search",e)}
                      .value=${this._query}
                      @input=${this._onSearch}
                    />
                  </div>

                  ${this._error?o`<div class="error">${this._error}</div>`:h}

                  ${this._query.trim()?this._results.length?o`<div class="obj-list">${this._results.map(a=>this._renderResult(a,e))}</div>`:o`<div class="search-empty">${s("doc_search_none",e)}</div>`:i.length?o`<div class="obj-list">${i.map(a=>this._renderObjRow(a,e))}</div>`:h}
                </div>
              `:h}
        </div>
      </ha-card>
    `}_renderObjRow(t,e){let i=t.entry;return o`
      <div
        class="obj-row ${i?"clickable":""}"
        role=${i?"button":h}
        tabindex=${i?"0":h}
        aria-label=${i?t.name:h}
        @click=${i?()=>this._openObject(i):void 0}
        @keydown=${i?a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),this._openObject(i))}:void 0}
      >
        <span class="obj-name">${t.name}</span>
        <span class="obj-meta">
          ${t.files>0?o`<ha-icon icon="mdi:file-document-outline"></ha-icon>${t.files}`:h}
          ${t.links>0?o`<ha-icon icon="mdi:link-variant"></ha-icon>${t.links}`:h}
        </span>
        <span class="obj-size">${rt(t.bytes)}</span>
        ${i?o`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:h}
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
  `,p([y({attribute:!1})],Z.prototype,"hass",2),p([y({attribute:!1})],Z.prototype,"objects",2),p([_()],Z.prototype,"_summary",2),p([_()],Z.prototype,"_loaded",2),p([_()],Z.prototype,"_busy",2),p([_()],Z.prototype,"_error",2),p([_()],Z.prototype,"_query",2),p([_()],Z.prototype,"_results",2),p([_()],Z.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",Z);var Ts=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],it=class extends S{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let t=this._buildOverrides();if(t!==null){this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:t}),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(e){this._error=I(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}};this._clearAll=async()=>{this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:{}}),this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(t){this._error=I(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}open(t,e,i){if(this._entryId=t,this._taskId=e,this._values=new Array(12).fill(""),i)for(let[a,l]of Object.entries(i)){let c=parseInt(a,10);c>=1&&c<=12&&typeof l=="number"&&(this._values[c-1]=l.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let t={};for(let e=0;e<12;e++){let i=this._values[e].trim();if(!i)continue;let a=parseFloat(i);if(Number.isNaN(a))return this._error=`${s("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][e],this._lang)}: ${s("seasonal_override_invalid",this._lang)}`,null;if(a<.1||a>5)return this._error=s("seasonal_override_range",this._lang),null;t[e+1]=a}return t}render(){if(!this._open)return o``;let t=this._lang;return o`
      <ha-dialog open @closed=${this._close} heading="${s("seasonal_overrides_title",t)}">
        <div class="content">
          <p class="hint">${s("seasonal_overrides_hint",t)}</p>
          ${this._error?o`<div class="error">${this._error}</div>`:h}
          <div class="months">
            ${Ts.map((e,i)=>o`
              <label class="month">
                <span class="mn">${s(e,t)}</span>
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
            ${s("clear_all",t)}
          </ha-button>
          <div class="spacer"></div>
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading}>
            ${this._loading?s("saving",t):s("save",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};it.styles=A`
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
  `,p([y({attribute:!1})],it.prototype,"hass",2),p([_()],it.prototype,"_open",2),p([_()],it.prototype,"_loading",2),p([_()],it.prototype,"_error",2),p([_()],it.prototype,"_entryId",2),p([_()],it.prototype,"_taskId",2),p([_()],it.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",it);var X=class extends S{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(t,e)=>{let i=`${t}:${e}`,a=new Set(this._selected);a.has(i)?a.delete(i):a.add(i),this._selected=a};this._save=async()=>{let t=this._name.trim();if(!t){this._error=s("group_name_required",this._lang);return}this._loading=!0,this._error="";try{let e=this._buildTaskRefs();this._groupId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/update",group_id:this._groupId,name:t,description:this._description,task_refs:e}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/create",name:t,description:this._description,task_refs:e}),this._open=!1,this.dispatchEvent(new CustomEvent("group-saved"))}catch(e){this._error=I(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._reset(),this._open=!0}openEdit(t,e){this._reset(),this._groupId=t,this._name=e.name,this._description=e.description||"",this._selected=new Set(e.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(t=>{let[e,i]=t.split(":",2);return{entry_id:e,task_id:i}})}render(){if(!this._open)return o``;let t=this._lang,e=this._groupId?s("edit_group",t):s("new_group",t);return o`
      <ha-dialog open @closed=${this._close} heading="${e}">
        <div class="content">
          ${this._error?o`<div class="error">${this._error}</div>`:h}
          <ms-textfield
            label="${s("name",t)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("description_optional",t)}"
            .value=${this._description}
            @input=${i=>this._description=i.target.value}
          ></ms-textfield>

          <div class="section-title">${s("group_select_tasks",t)}</div>
          ${this.objects.length===0?o`<div class="hint">${s("no_objects",t)}</div>`:o`
              <div class="objects">
                ${[...this.objects].sort((i,a)=>i.object.name.localeCompare(a.object.name)).map(i=>o`
                  <div class="object-block">
                    <div class="object-name">${i.object.name}</div>
                    ${i.tasks.length===0?o`<div class="hint small">${s("no_tasks_short",t)}</div>`:[...i.tasks].sort((a,l)=>a.name.localeCompare(l.name)).map(a=>{let l=`${i.entry_id}:${a.id}`,c=this._selected.has(l);return o`
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
            ${s("selected",t)}: ${this._selected.size}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${s("cancel",t)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()}>
            ${this._loading?s("saving",t):s("save",t)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};X.styles=A`
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
  `,p([y({attribute:!1})],X.prototype,"hass",2),p([y({attribute:!1})],X.prototype,"objects",2),p([_()],X.prototype,"_open",2),p([_()],X.prototype,"_loading",2),p([_()],X.prototype,"_error",2),p([_()],X.prototype,"_groupId",2),p([_()],X.prototype,"_name",2),p([_()],X.prototype,"_description",2),p([_()],X.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",X);function Bt(n,r,t=4){if(!isFinite(n)||!isFinite(r))return{ticks:[],niceMin:0,niceMax:1};if(n===r){let u=Math.abs(n)*.1||1;n-=u,r+=u}let e=r-n,i=Math.pow(10,Math.floor(Math.log10(e/Math.max(1,t)))),a=i;for(let u of[1,2,5,10])if(a=i*u,e/a<=t+.5)break;let l=Math.floor(n/a)*a,c=Math.ceil(r/a)*a,d=[];for(let u=l;u<=c+a*1e-6;u+=a)d.push(Math.abs(u)<a*1e-9?0:u);return{ticks:d,niceMin:l,niceMax:c}}function nt(n){let r=Math.abs(n);return r>=1e6?Ct((n/1e6).toFixed(r>=1e7?0:1))+"M":r>=1e4?Ct((n/1e3).toFixed(0))+"k":r>=1e3?Ct((n/1e3).toFixed(1))+"k":r>=100?n.toFixed(0):r>=10||r>=1?Ct(n.toFixed(1)):r===0?"0":Ct(n.toFixed(2))}function Ct(n){return n.replace(/\.0+$/,"").replace(/(\.\d*[1-9])0+$/,"$1")}function $t(n,r,t){let e=n.toLocaleString(t,{maximumFractionDigits:Math.abs(n)>=100?0:1});return r?`${e} ${r}`:e}function It(n,r,t){let e=new Date(n),i=t?{month:"short",day:"numeric",year:"2-digit"}:{month:"short",day:"numeric"};return e.toLocaleDateString(r,i)}function Pe(n,r){return new Date(n).toLocaleDateString(r,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function ue(n,r){return new Date(n).getFullYear()!==new Date(r).getFullYear()}function _e(n,r,t){if(t<2||r<=n)return[n,r];let e=[];for(let i=0;i<t;i++)e.push(n+(r-n)*i/(t-1));return e}var ge=210,st=46,dt=14,pt=12,fi=14,Ss=20+fi,As=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],N=class extends S{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this.hideOutliers=!1;this.showOutlierToggle=!0;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(t=>{let e=Math.floor(t[0]?.contentRect?.width||0);e&&Math.abs(e-this._width)>2&&(this._width=e)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(t){t!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:t},bubbles:!0,composed:!0}))}_toggleOutliers(){this.dispatchEvent(new CustomEvent("outlier-toggle",{detail:{hide:!this.hideOutliers},bubbles:!0,composed:!0}))}render(){let t=this._width||320,e=[...this.points].sort((a,l)=>a.ts-l.ts),i=this.lang;return o`
      <div class="chart-wrap">
        ${this.showRange?o`<div class="range-chips" role="group">
              ${this.showOutlierToggle?o`<button
                    class="range-chip outlier-chip ${this.hideOutliers?"active":""}"
                    ?disabled=${this.busy}
                    title=${s("hide_outliers",i)}
                    @click=${()=>this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`:h}
              ${As.map(a=>o`<button
                  class="range-chip ${this.rangeDays===a.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(a.days)}
                >${s(a.key,i)}</button>`)}
            </div>`:h}
        ${e.length<2?o`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${s("loading_chart",i)}
            </div>`:this._renderSvg(t,e)}
      </div>
    `}_renderSvg(t,e){let i=this.lang,a=t-st-dt,l=ge-Ss,c=l-pt,d=1/0,u=-1/0;for(let k of e)d=Math.min(d,k.min??k.val),u=Math.max(u,k.max??k.val);this.thresholdAbove!=null&&(d=Math.min(d,this.thresholdAbove),u=Math.max(u,this.thresholdAbove)),this.thresholdBelow!=null&&(d=Math.min(d,this.thresholdBelow),u=Math.max(u,this.thresholdBelow)),this.targetValue!=null&&(d=Math.min(d,this.targetValue),u=Math.max(u,this.targetValue)),this.forceZero&&(d=Math.min(d,0));let g=(u-d||1)*.06,m=this.forceZero&&d>=0?0:d-g,{ticks:v,niceMin:f,niceMax:w}=Bt(m,u+g,4);this.forceZero&&d>=0&&f<0&&(f=0,v=v.filter(k=>k>=0));let b=e[0].ts,j=e[e.length-1].ts,z=j-b||1,H=ue(b,j),M=k=>st+(k-b)/z*a,T=k=>pt+(1-(k-f)/(w-f||1))*c,Y=e.map(k=>`${M(k.ts).toFixed(1)},${T(k.val).toFixed(1)}`).join(" "),G=`M${M(e[0].ts).toFixed(1)},${l} `+e.map(k=>`L${M(k.ts).toFixed(1)},${T(k.val).toFixed(1)}`).join(" ")+` L${M(e[e.length-1].ts).toFixed(1)},${l} Z`,W="",F=e.filter(k=>k.min!=null&&k.max!=null);if(F.length>=2){let k=F.map(R=>`${M(R.ts).toFixed(1)},${T(R.max).toFixed(1)}`),$=[...F].reverse().map(R=>`${M(R.ts).toFixed(1)},${T(R.min).toFixed(1)}`);W=`M${k[0]} `+k.slice(1).map(R=>`L${R}`).join(" ")+` L${$.join(" L")} Z`}let O=[];if(this.thresholdBelow!=null){let k=T(this.thresholdBelow);O.push({y:k,h:Math.max(0,l-k),lineY:k,label:`\u25BC ${nt(this.thresholdBelow)}`,labelY:Math.min(l-4,k+13)})}if(this.thresholdAbove!=null){let k=T(this.thresholdAbove);O.push({y:pt,h:Math.max(0,k-pt),lineY:k,label:`\u25B2 ${nt(this.thresholdAbove)}`,labelY:Math.max(pt+11,k-5)})}let ht=e[e.length-1],vt=(this.events||[]).filter(k=>k.ts>=b&&k.ts<=j),wt=_e(b,j,Math.max(2,Math.min(5,Math.floor(a/110)+1))),B=this._hover;return o`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${t} ${ge}"
          width=${t}
          height=${ge}
          role="img"
          aria-label=${s("chart_sparkline",i)}
          @pointermove=${k=>this._onPointer(k,e,M,T,t)}
          @pointerdown=${k=>this._onPointer(k,e,M,T,t)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${st}" y="${pt}" width="${a}" height="${c}" /></clipPath>
            ${O.length?P`<clipPath id="danger">${O.map(k=>P`<rect x="${st}" y="${k.y.toFixed(1)}" width="${a}" height="${k.h.toFixed(1)}" />`)}</clipPath>`:h}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${v.map(k=>{let $=T(k);return $<pt-1||$>l+1?h:P`
              <line x1="${st}" y1="${$.toFixed(1)}" x2="${t-dt}" y2="${$.toFixed(1)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${st-7}" y="${($+3.5).toFixed(1)}" text-anchor="end" class="tick-label">${nt(k)}</text>`})}

          ${O.map(k=>P`<rect x="${st}" y="${k.y.toFixed(1)}" width="${a}" height="${k.h.toFixed(1)}"
              fill="url(#dangerHatch)" />`)}

          ${W?P`<path d="${W}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:h}
          <path d="${G}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${Y}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${O.length?P`<polyline points="${Y}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:h}

          ${O.map(k=>P`
              <line x1="${st}" y1="${k.lineY.toFixed(1)}" x2="${t-dt}" y2="${k.lineY.toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-dt-4}" y="${k.labelY.toFixed(1)}" text-anchor="end" class="zone-label">${k.label}</text>`)}

          ${this.targetValue!=null?P`<line x1="${st}" y1="${T(this.targetValue).toFixed(1)}" x2="${t-dt}" y2="${T(this.targetValue).toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${t-dt-4}" y="${(T(this.targetValue)-5).toFixed(1)}" text-anchor="end" class="zone-label">◆ ${nt(this.targetValue)} ${this.unit}</text>`:h}

          ${this.projection&&this.projection.length===2?P`<line x1="${M(this.projection[0].ts).toFixed(1)}" y1="${T(this.projection[0].val).toFixed(1)}"
                x2="${Math.min(M(this.projection[1].ts),t-dt).toFixed(1)}" y2="${T(Math.max(f,Math.min(w,this.projection[1].val))).toFixed(1)}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:h}

          ${wt.map((k,$)=>{let R=M(k),me=$===0?"start":$===wt.length-1?"end":"middle";return P`<text x="${R.toFixed(1)}" y="${ge-5}" text-anchor="${me}" class="tick-label">${It(k,i,H)}</text>`})}

          <line x1="${st}" y1="${l}" x2="${t-dt}" y2="${l}" stroke="var(--divider-color)" stroke-width="1" />

          ${vt.map(k=>{let $=M(k.ts),R=k.type==="completed"?"var(--success-color, #4caf50)":k.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return P`
              <line x1="${$.toFixed(1)}" y1="${pt}" x2="${$.toFixed(1)}" y2="${l}" stroke="${R}" stroke-width="1" opacity="0.14" />
              <rect x="${($-1.5).toFixed(1)}" y="${l+3}" width="3" height="${fi-6}" rx="1.5" fill="${R}">
                <title>${Pe(k.ts,i)}</title>
              </rect>`})}

          ${B?P`
                <line x1="${B.x.toFixed(1)}" y1="${pt}" x2="${B.x.toFixed(1)}" y2="${l}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${B.x.toFixed(1)}" cy="${B.y.toFixed(1)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:P`<circle cx="${M(ht.ts).toFixed(1)}" cy="${T(ht.val).toFixed(1)}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${B?o`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(B.x,70),t-70)}px"
            >
              <div class="hover-date">${Pe(B.p.ts,i)}</div>
              <div class="hover-val">
                ${$t(B.p.val,this.unit,i)}
                ${B.p.min!=null&&B.p.max!=null?o`<span class="hover-range">(${nt(B.p.min)}–${nt(B.p.max)})</span>`:h}
              </div>
            </div>`:h}
      </div>
    `}_onPointer(t,e,i,a,l){let d=t.currentTarget.getBoundingClientRect(),u=(t.clientX-d.left)/d.width*l;if(u<st-8||u>l-dt+8){this._hover=null;return}let g=e[0],m=1/0;for(let v of e){let f=Math.abs(i(v.ts)-u);f<m&&(m=f,g=v)}this._hover={x:i(g.ts),y:a(g.val),p:g}}};N.styles=A`
    :host { display: block; width: 100%; }
    .chart-wrap { position: relative; }
    .range-chips { display: flex; gap: 4px; justify-content: flex-end; margin-bottom: 2px; }
    .range-chip {
      font: inherit; font-size: 11.5px; padding: 2px 9px; border-radius: 12px; cursor: pointer;
      border: 1px solid var(--divider-color); background: transparent;
      color: var(--secondary-text-color);
    }
    /* Outlier toggle sits left of the range chips as an icon button. */
    .outlier-chip { margin-right: auto; padding: 2px 7px; display: inline-flex; align-items: center; }
    .outlier-chip ha-icon { --mdc-icon-size: 15px; }
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
  `,p([y({attribute:!1})],N.prototype,"points",2),p([y({attribute:!1})],N.prototype,"events",2),p([y()],N.prototype,"unit",2),p([y()],N.prototype,"lang",2),p([y({attribute:!1})],N.prototype,"thresholdAbove",2),p([y({attribute:!1})],N.prototype,"thresholdBelow",2),p([y({attribute:!1})],N.prototype,"targetValue",2),p([y({type:Boolean})],N.prototype,"forceZero",2),p([y({attribute:!1})],N.prototype,"projection",2),p([y({attribute:!1})],N.prototype,"rangeDays",2),p([y({type:Boolean})],N.prototype,"showRange",2),p([y({type:Boolean})],N.prototype,"busy",2),p([y({type:Boolean})],N.prototype,"hideOutliers",2),p([y({type:Boolean})],N.prototype,"showOutlierToggle",2),p([_()],N.prototype,"_width",2),p([_()],N.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",N);function js(n){if(n.length<4)return n;let r=n.map(u=>u.val).sort((u,g)=>u-g),t=u=>{let g=(r.length-1)*u,m=Math.floor(g),v=Math.ceil(g);return r[m]+(r[v]-r[m])*(g-m)},e=t(.25),i=t(.75),a=i-e;if(a===0)return n;let l=e-1.5*a,c=i+1.5*a,d=n.filter(u=>u.val>=l&&u.val<=c);return d.length>=2?d:n}function yi(n,r){let t=n.trigger_config;if(!t)return h;let e=r.lang,i=n.trigger_entity_info,a=n.trigger_entity_infos,l=i?.friendly_name||t.entity_id||"\u2014",c=t.entity_id||"",d=t.entity_ids||(c?[c]:[]),u=i?.unit_of_measurement||"",g=n.trigger_current_value,m=t.type||"threshold",v=d.length>1,f=Cs(n,u,r);return o`
    <h3>${s("trigger",e)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${v?o`
            <div class="trigger-entity-name">${d.length} ${s("entities",e)} (${t.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${d.map((w,b)=>o`${b>0?", ":""}<span class="entity-link" @click=${j=>xt(j,w)}>${w}</span>`)}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `:o`
            <div class="trigger-entity-name">${l}</div>
            <div class="trigger-entity-id">${c?o`<span class="entity-link" @click=${w=>xt(w,c)}>${c}</span>`:""}${t.attribute?` \u2192 ${t.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${n.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${n.trigger_active?s("triggered",e):s("ok",e)}
        </span>
      </div>

      ${f?Is(f,e):g!=null?o`
              <div class="trigger-value-row">
                <span class="trigger-current ${n.trigger_active?"active":""}">${typeof g=="number"?$t(g,"",e):g}</span>
                ${u?o`<span class="trigger-unit">${u}</span>`:h}
              </div>
            `:h}

      <div class="trigger-limits">
        ${m==="threshold"?o`
          ${t.trigger_above!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_above",e)}: ${t.trigger_above} ${u}</span>`:h}
          ${t.trigger_below!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_below",e)}: ${t.trigger_below} ${u}</span>`:h}
          ${t.trigger_for_minutes?o`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${s("for_minutes",e)}: ${t.trigger_for_minutes}</span>`:h}
        `:h}
        ${m==="state_change"?o`
          ${t.trigger_target_changes!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("target_changes",e)}: ${t.trigger_target_changes}</span>`:h}
        `:h}
        ${m==="runtime"?o`
          ${t.trigger_runtime_hours!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("runtime_hours",e)}: ${t.trigger_runtime_hours}h</span>`:h}
        `:h}
        ${m==="compound"?o`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("compound_logic",e)}: ${t.compound_logic||t.operator||"AND"}</span>
          ${(t.conditions||[]).map((w,b)=>o`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${b+1}. ${s(w.type||"unknown",e)}: ${w.entity_id?o`<span class="entity-link" @click=${j=>xt(j,w.entity_id)}>${w.entity_id}</span>`:""}</span>
          `)}
        `:h}
      </div>

      ${a&&a.length>1?o`
        <div class="trigger-entity-list">
          ${a.map(w=>o`
            <span class="trigger-entity-id">${w.friendly_name} (<span class="entity-link" @click=${b=>xt(b,w.entity_id)}>${w.entity_id}</span>)</span>
          `)}
        </div>
      `:h}

      ${Ms(n,u,r)}
    </div>
  `}function Cs(n,r,t){let e=n.trigger_config,i=n.trigger_current_value;if(!e||i==null)return null;switch(e.type||"threshold"){case"counter":{let a=e.trigger_target_value;if(a==null||a<=0)return null;let l=xi(n,$i(n,t));return{progress:Math.max(0,i-(l?.value??i)),target:a,unit:r,meter:i}}case"state_change":{let a=e.trigger_target_changes;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"",meter:null}}case"runtime":{let a=e.trigger_runtime_hours;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"h",meter:null}}}return null}function xi(n,r){if(n.trigger_baseline_value!=null)return{value:n.trigger_baseline_value,ts:ze(n)};if(!r.length)return null;let t=ze(n);if(t==null)return{value:r[0].val,ts:null};let e=r[0],i=Math.abs(r[0].ts-t);for(let a of r){let l=Math.abs(a.ts-t);l<i&&(e=a,i=l)}return{value:e.val,ts:t}}function ze(n){let r=[...n.history].filter(t=>t.type==="completed"||t.type==="reset").sort((t,e)=>new Date(e.timestamp).getTime()-new Date(t.timestamp).getTime())[0];return r?new Date(r.timestamp).getTime():null}function Is(n,r){let t=Math.min(999,Math.round(n.progress/n.target*100)),e=t>=100?"over":t>=75?"near":"ok";return o`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${$t(n.progress,"",r)}<span class="counter-progress-target"> / ${$t(n.target,n.unit,r)}</span></span>
        <span class="counter-progress-pct ${e}">${t} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${t} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${e}" style="width:${Math.min(100,t)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${s("chart_since_service",r)}${n.meter!=null?o` · ${s("current",r)}: ${$t(n.meter,n.unit,r)}`:h}
      </div>
    </div>
  `}function $i(n,r){let t=n.trigger_config;if(!t)return[];let e=t.type||"threshold",i=t.entity_id||"",a=e==="runtime"?[]:r.detailStatsData.get(i)||[],l=r.isCounterEntity(t),c=[];if(a.length>=2)for(let d of a){let u={ts:d.ts,val:d.val};!l&&d.min!=null&&d.max!=null&&(u.min=d.min,u.max=d.max),c.push(u)}else for(let d of n.history)d.trigger_value!=null&&c.push({ts:new Date(d.timestamp).getTime(),val:d.trigger_value});return n.trigger_current_value!=null&&c.push({ts:Date.now(),val:n.trigger_current_value}),c.sort((d,u)=>d.ts-u.ts),c}function Ms(n,r,t){let e=n.trigger_config;if(!e)return h;let i=e.type||"threshold",a=e.entity_id||"",l=$i(n,t);i==="runtime"&&e.trigger_runtime_hours&&n.trigger_current_value!=null&&(l=[{ts:ze(n)??l[0]?.ts??Date.now()-864e5,val:0},{ts:Date.now(),val:Math.max(0,n.trigger_current_value)}]),t.hideOutliers&&(l=js(l));let c=l.length<2&&!!a&&t.hasStatsService&&!t.detailStatsData.has(a);if(l.length<2&&!c)return h;let d=!!a&&t.detailStatsData.has(a)&&(t.detailStatsData.get(a)?.length??0)<2,u=Date.now()-t.rangeDays*864e5,g=l.filter(b=>b.ts>=u);g.length>=2&&(l=g);let m=null,v=!1;if(i==="counter"&&e.trigger_target_value!=null&&l.length){let b=xi(n,l);if(b){if(b.ts!=null){let j=l.filter(z=>z.ts>=b.ts);j.length>=2&&(l=j)}l=l.map(j=>({...j,val:Math.max(0,j.val-b.value)}))}m=e.trigger_target_value,v=!0}else i==="state_change"&&e.trigger_target_changes?(m=e.trigger_target_changes,v=!0):i==="runtime"&&e.trigger_runtime_hours&&(m=e.trigger_runtime_hours,v=!0);let f=null;if(m==null&&n.degradation_rate!=null&&(n.degradation_trend!=="stable"||n.days_until_threshold!=null)&&n.degradation_trend!=="insufficient_data"&&l.length>=2){let b=l[l.length-1];f=[b,{ts:b.ts+30*864e5,val:b.val+n.degradation_rate*30}]}let w=n.history.filter(b=>["completed","skipped","reset"].includes(b.type)).map(b=>({ts:new Date(b.timestamp).getTime(),type:b.type}));return o`
    <maintenance-trigger-chart
      .points=${c?[]:l}
      .events=${w}
      .unit=${r}
      .lang=${t.lang}
      .thresholdAbove=${i==="threshold"?e.trigger_above??null:null}
      .thresholdBelow=${i==="threshold"?e.trigger_below??null:null}
      .targetValue=${m}
      .forceZero=${v}
      .projection=${f}
      .rangeDays=${t.rangeDays}
      .hideOutliers=${t.hideOutliers}
      .busy=${c}
      @range-change=${b=>t.setRangeDays(b.detail.days)}
      @outlier-toggle=${b=>t.setHideOutliers(b.detail.hide)}
    ></maintenance-trigger-chart>
    ${d&&!c?o`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${s("chart_no_stats",t.lang)}
        </div>`:h}
  `}function wi(n,r,t){let e=n.degradation_trend!=null&&n.degradation_trend!=="insufficient_data",i=n.days_until_threshold!=null,a=n.environmental_factor!=null&&n.environmental_factor!==1;if(!e&&!i&&!a)return h;let l=n.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":n.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${n.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",r).replace("{days}",String(Math.round(n.days_until_threshold||0)))}
        </div>
      `:h}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",r)}
      </div>
      <div class="prediction-grid">
        ${e?o`
          <div class="prediction-item">
            <ha-svg-icon path="${l}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",r)}</span>
            <span class="prediction-value ${n.degradation_trend}">${s("trend_"+n.degradation_trend,r)}</span>
            ${n.degradation_rate!=null?o`<span class="prediction-rate">${n.degradation_rate>0?"+":""}${Math.abs(n.degradation_rate)>=10?Math.round(n.degradation_rate).toLocaleString():n.degradation_rate.toFixed(1)} ${n.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",r)}</span>`:h}
          </div>
        `:h}
        ${i?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",r)}</span>
            <span class="prediction-value prediction-days${n.days_until_threshold===0?" exceeded":n.sensor_prediction_urgency?" urgent":""}">${n.days_until_threshold===0?s("threshold_exceeded",r):"~"+Math.round(n.days_until_threshold)+" "+s("days",r)}</span>
            ${n.threshold_prediction_date?o`<span class="prediction-date">${K(n.threshold_prediction_date,r)}</span>`:h}
            ${n.threshold_prediction_confidence?o`<span class="confidence-dot ${n.threshold_prediction_confidence}"></span>`:h}
          </div>
        `:h}
        ${a&&t.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",r)}</span>
            <span class="prediction-value">${n.environmental_factor.toFixed(2)}x</span>
            ${n.environmental_entity?o`<span class="prediction-entity entity-link" @click=${c=>xt(c,n.environmental_entity)}>${n.environmental_entity}</span>`:h}
          </div>
        `:h}
      </div>
    </div>
  `}function ki(n,r){let t=n.interval_analysis,e=t?.weibull_beta,i=t?.weibull_eta;if(e==null||i==null||i<=0)return h;let a=n.interval_days??0,l=n.suggested_interval??a;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",r)}
        ${Rs(e,r)}
      </div>
      ${Ls(e,i,a,l,r)}
      ${Ps(t,r)}
      ${t?.confidence_interval_low!=null?zs(t,n,r):h}
    </div>
  `}function Rs(n,r){let t,e,i;return n<.8?(t="early_failures",e="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):n<=1.2?(t="random_failures",e="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):n<=3.5?(t="wear_out",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(t="highly_predictable",e="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),o`
    <span class="beta-badge ${t}">
      <ha-svg-icon path="${e}"></ha-svg-icon>
      ${s(i,r)} (\u03B2=${n.toFixed(2)})
    </span>
  `}function Ls(n,r,t,e,i){let f=Math.max(t,e,r,1)*1.3,w=50,b=[];for(let F=0;F<=w;F++){let O=F/w*f,ht=1-Math.exp(-Math.pow(O/r,n)),vt=32+O/f*260,wt=136-ht*128;b.push([vt,wt])}let j=b.map(([F,O])=>`${F.toFixed(1)},${O.toFixed(1)}`).join(" "),z="M32,136 "+b.map(([F,O])=>`L${F.toFixed(1)},${O.toFixed(1)}`).join(" ")+` L${b[w][0].toFixed(1)},136 Z`,H=32+t/f*260,M=1-Math.exp(-Math.pow(t/r,n)),T=136-M*128,Y=((1-M)*100).toFixed(0),G=32+e/f*260,W=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",i)}">
        ${W.map(F=>{let O=136-F*128;return P`
            <line x1="${32}" y1="${O.toFixed(1)}" x2="${292}" y2="${O.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${F===.5?"4,3":h}" />
            <text x="${28}" y="${(O+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(F*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f)}</text>

        <path d="${z}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${j}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${t>0?P`
          <line x1="${H.toFixed(1)}" y1="${8}" x2="${H.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${H.toFixed(1)}" cy="${T.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(H+4).toFixed(1)}" y="${(T-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Y}%</text>
        `:h}

        ${e>0&&e!==t?P`
          <line x1="${G.toFixed(1)}" y1="${8}" x2="${G.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:h}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${s("weibull_failure_probability",i)}</span>
      ${t>0?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${s("current_interval_marker",i)}</span>`:h}
      ${e>0&&e!==t?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${s("recommended_marker",i)}</span>`:h}
    </div>
  `}function Ps(n,r){return o`
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
      `:h}
    </div>
  `}function zs(n,r,t){let e=n.confidence_interval_low,i=n.confidence_interval_high,a=r.suggested_interval??r.interval_days??0,l=r.interval_days??0,c=Math.max(0,e-5),u=i+5-c,g=(e-c)/u*100,m=(i-e)/u*100,v=(a-c)/u*100,f=l>0?(l-c)/u*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",t)}: ${a} ${s("days",t)} (${e}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${g.toFixed(1)}%;width:${m.toFixed(1)}%"></div>
        ${f>=0?o`<div class="confidence-marker current" style="left:${f.toFixed(1)}%"></div>`:h}
        <div class="confidence-marker recommended" style="left:${v.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",t)} (${e}${s("days",t).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",t)} (${i}${s("days",t).charAt(0)})</span>
      </div>
    </div>
  `}function Ei(n,r,t,e){let i=Math.max(n||1,r);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",e)}: ${n??"\u2014"} ${n!=null?s("days",e):""}
        </div>
        <div class="interval-visual current"
          style="width: ${n!=null?Math.min(n/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${s("recommended",e)}: ${r} ${s("days",e)}
          <span class="confidence-badge ${t}">${s(`confidence_${t}`,e)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(r/i*100,100)}%"></div>
      </div>
    </div>
  `}var Ti=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function Si(n,r,t){if(!t.seasonal||!n.seasonal_factor||n.seasonal_factor===1)return h;let e=Ti.map(c=>s(c,r)),i=new Date().getMonth(),a=n.seasonal_factors||n.interval_analysis?.seasonal_factors||null,l=a&&a.length===12?a:e.map((c,d)=>{let u=n.seasonal_factor||1,g=Math.sin((d-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,u+g))});return o`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",r)}</h4>
      <div class="seasonal-mini-chart">
        ${l.map((c,d)=>{let u=c*40,g=c<.9?"low":c>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${g} ${d===i?"current":""}"
                 style="height: ${u}px"
                 title="${e[d]}: ${c.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",r)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",r)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",r)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function Ai(n,r){return Hs(n,r)}function Hs(n,r){let t=n.seasonal_factors??n.interval_analysis?.seasonal_factors;if(!t||t.length!==12)return h;let e=n.interval_analysis?.seasonal_reason,i=new Date().getMonth(),a=300,l=100,c=8,u=l-c-4,g=Math.max(...t,1.5),m=a/12,v=m*.65,f=c+u-1/g*u;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",r)}
        ${e?o`<span class="source-tag">${e==="learned"?s("seasonal_learned",r):s("seasonal_manual",r)}</span>`:h}
      </div>
      <svg viewBox="0 0 ${a} ${l}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",r)}">
        <line x1="0" y1="${f.toFixed(1)}" x2="${a}" y2="${f.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${t.map((w,b)=>{let j=w/g*u,z=b*m+(m-v)/2,H=c+u-j,M=b===i,T=w<1?"var(--success-color, #4caf50)":w>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return P`
            <rect x="${z.toFixed(1)}" y="${H.toFixed(1)}"
              width="${v.toFixed(1)}" height="${j.toFixed(1)}"
              fill="${T}" opacity="${M?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Ti.map((w,b)=>o`<span class="seasonal-label ${b===i?"active-month":""}">${s(w,r)}</span>`)}
      </div>
    </div>
  `}var Ds=200,Vt=10,qs=22;function ji(n,r,t,e){let i=n.history.filter(c=>c.type==="completed"&&(c.cost!=null||c.duration!=null));if(i.length<2)return h;let a=i.some(c=>(c.cost??0)>0),l=i.some(c=>(c.duration??0)>0);return!a&&!l?h:o`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${s("cost_duration_chart",r)}</h3>
        <div class="toggle-buttons">
          ${a?o`<button
            class="toggle-btn ${t==="cost"?"active":""}"
            @click=${()=>e("cost")}>
            ${s("cost",r)}
          </button>`:h}
          ${a&&l?o`<button
            class="toggle-btn ${t==="both"?"active":""}"
            @click=${()=>e("both")}>
            ${s("both",r)}
          </button>`:h}
          ${l?o`<button
            class="toggle-btn ${t==="duration"?"active":""}"
            @click=${()=>e("duration")}>
            ${s("duration",r)}
          </button>`:h}
        </div>
      </div>
      ${Os(n,r,t)}
    </div>
  `}function Os(n,r,t){let e=n.history.filter($=>$.type==="completed"&&($.cost!=null||$.duration!=null)).map($=>({ts:new Date($.timestamp).getTime(),cost:$.cost??0,duration:$.duration??0})).sort(($,R)=>$.ts-R.ts);if(e.length<2)return h;let i=e.some($=>$.cost>0),a=e.some($=>$.duration>0);if(!i&&!a)return h;let l=t!=="duration"&&i,c=t!=="cost"&&a,d=l||!c&&i,u=c||!l&&a,g=640,m=Ds,v=d?44:12,f=u?44:12,w=g-v-f,b=m-qs,j=b-Vt,z=e[0].ts,H=e[e.length-1].ts,M=(H-z||864e5)*.05,T=z-M,Y=H+M,G=ue(z,H),W=$=>v+($-T)/(Y-T)*w,F=Bt(0,Math.max(...e.map($=>$.cost))||1,3),O=Bt(0,Math.max(...e.map($=>$.duration))||1,3),ht=$=>Vt+(1-$/(F.niceMax||1))*j,vt=$=>Vt+(1-$/(O.niceMax||1))*j,wt=e.length>1?Math.min(...e.slice(1).map(($,R)=>W($.ts)-W(e[R].ts))):w,B=Math.max(6,Math.min(22,wt*.55)),k=_e(z,H,Math.max(2,Math.min(4,e.length)));return o`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${g} ${m}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_history",r)}">
        ${d?F.ticks.map($=>{let R=ht($);return R<Vt-1||R>b+1?h:P`
            <line x1="${v}" y1="${R.toFixed(1)}" x2="${g-f}" y2="${R.toFixed(1)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${v-6}" y="${(R+3.5).toFixed(1)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${nt($)}€</text>`}):h}
        ${u?O.ticks.map($=>{let R=vt($);return R<Vt-1||R>b+1?h:P`<text x="${g-f+6}" y="${(R+3.5).toFixed(1)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${nt($)}m</text>`}):h}

        ${d?e.filter($=>$.cost>0).map($=>P`
          <rect x="${(W($.ts)-B/2).toFixed(1)}" y="${ht($.cost).toFixed(1)}" width="${B.toFixed(1)}" height="${(b-ht($.cost)).toFixed(1)}"
            fill="var(--primary-color)" opacity="0.6" rx="2">
            <title>${It($.ts,r,!0)}: ${$.cost.toLocaleString(r)}€${$.duration?` \xB7 ${$.duration}m`:""}</title>
          </rect>
        `):h}
        ${u?P`
          <polyline points="${e.map($=>`${W($.ts).toFixed(1)},${vt($.duration).toFixed(1)}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${e.map($=>P`
            <circle cx="${W($.ts).toFixed(1)}" cy="${vt($.duration).toFixed(1)}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${It($.ts,r,!0)}: ${$.duration}m${$.cost?` \xB7 ${$.cost.toLocaleString(r)}\u20AC`:""}</title>
            </circle>
          `)}
        `:h}

        <line x1="${v}" y1="${b}" x2="${g-f}" y2="${b}" stroke="var(--divider-color)" stroke-width="1" />
        ${k.map(($,R)=>{let me=R===0?"start":R===k.length-1?"end":"middle";return P`<text x="${W($).toFixed(1)}" y="${m-6}" text-anchor="${me}" fill="var(--secondary-text-color)" font-size="10">${It($,r,G)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${d?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${s("cost",r)}</span>`:h}
      ${u?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${s("duration",r)}</span>`:h}
    </div>
  `}var Fs=60,Ns=20,Ci=30;function He(n){let r=n.trigger_config??null;if(!r)return h;let t=r.type||"threshold",e=n.trigger_entity_info?.unit_of_measurement??"",i=0,a="";if(t==="threshold"){let d=n.trigger_current_value??null;if(d==null)return h;let u=r.trigger_above,g=r.trigger_below;if(u!=null){let m=g??0,v=u-m||1;i=Math.min(100,Math.max(0,(d-m)/v*100)),a=`${d.toFixed(1)} / ${u} ${e}`}else if(g!=null){let v=n.trigger_entity_info?.max??(g*2||100),f=v-g||1;i=Math.min(100,Math.max(0,(v-d)/f*100)),a=`${d.toFixed(1)} / ${g} ${e}`}else return h}else if(t==="counter"){let d=r.trigger_target_value||1,g=n.trigger_current_delta??null??n.trigger_current_value??null;if(g==null)return h;i=Math.min(100,Math.max(0,g/d*100)),a=`${g.toFixed(1)} / ${d} ${e}`}else if(t==="state_change"){let d=r.trigger_target_changes||1,u=n.trigger_current_value??null;if(u==null)return h;i=Math.min(100,Math.max(0,u/d*100)),a=`${Math.round(u)} / ${d}`}else if(t==="runtime"){let d=r.trigger_runtime_hours||100,u=n.trigger_current_value??null;if(u==null)return h;i=Math.min(100,Math.max(0,u/d*100)),a=`${u.toFixed(1)}h / ${d}h`}else if(t==="compound"){let d=r.compound_logic||r.operator||"AND",u=r.conditions?.length||0;a=`${d} (${u})`,i=n.trigger_active?100:0}else return h;let l=i>=100,c=i>90?"var(--error-color, #f44336)":i>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return o`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${l?" overflow":""}" style="width:${i}%;background:${c}"></div>
      </div>
      <span class="trigger-progress-label">${a}</span>
    </div>
  `}function De(n,r,t){if(!n.trigger_config?.entity_id)return h;let e=n.trigger_config.entity_id,i=r.get(e)||[],a=[];if(i.length>=2)a=i.map(T=>({ts:T.ts,val:T.val}));else{if(!n.history)return h;for(let T of n.history)T.trigger_value!=null&&a.push({ts:new Date(T.timestamp).getTime(),val:T.trigger_value})}if(n.trigger_current_value!=null&&a.push({ts:Date.now(),val:n.trigger_current_value}),a.length<2)return h;a.sort((T,Y)=>T.ts-Y.ts);let l=Fs,c=Ns,d=a.map(T=>T.val),u=Math.min(...d),g=Math.max(...d),m=g-u||1;u-=m*.1,g+=m*.1;let v=a[0].ts,w=a[a.length-1].ts-v||1,b=T=>(T-v)/w*l,j=T=>2+(1-(T-u)/(g-u))*(c-4),z=a;if(z.length>Ci){let T=Math.ceil(z.length/Ci);z=z.filter((Y,G)=>G%T===0||G===z.length-1)}let H=z.map(T=>`${b(T.ts).toFixed(1)},${j(T.val).toFixed(1)}`).join(" "),M=n.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return o`
    <svg class="mini-sparkline" viewBox="0 0 ${l} ${c}" preserveAspectRatio="none" role="img" aria-label="${s("chart_mini_sparkline",t)}">
      <polyline points="${H}" fill="none" stroke="${M}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function Ii(n,r){let t=r;if(n.days_until_due==null||!n.interval_days||n.interval_days<=0)return h;let{pct:e,overflow:i}=ae(n.interval_days,n.days_until_due,n.interval_unit),a="var(--success-color, #4caf50)";return n.status==="overdue"?a="var(--error-color, #f44336)":n.status==="due_soon"&&(a="var(--warning-color, #ff9800)"),o`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${n.last_performed?`${s("last_performed",t)}: ${K(n.last_performed,t)}`:""}</span>
        <span>${n.next_due?`${s("next_due",t)}: ${K(n.next_due,t)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(e)}" aria-valuemin="0" aria-valuemax="100" aria-label="${s("days_progress",t)}">
        <div class="days-progress-fill${i?" overflow":""}" style="width:${e}%;background:${a}"></div>
      </div>
      <div class="days-progress-text">${Tt(n.days_until_due,t)}</div>
    </div>
  `}var mt=class extends S{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{let t=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${this.docId}`,expires:300});this._url=t.path}catch{this._failed=!0}}render(){return this._failed||!this.docId?h:this._url?o`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:o`<div class="ph"></div>`}};mt.styles=A`
    .wrap { display: inline-block; margin-top: 4px; }
    img {
      max-width: 96px;
      max-height: 96px;
      border-radius: 6px;
      display: block;
      border: 1px solid var(--divider-color);
    }
    .ph {
      width: 96px;
      height: 64px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0,0,0,0.06));
      margin-top: 4px;
    }
  `,p([y({attribute:!1})],mt.prototype,"hass",2),p([y()],mt.prototype,"docId",2),p([_()],mt.prototype,"_url",2),p([_()],mt.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",mt);var Us=["completed","skipped","missed","reset","triggered"];function Mi(n,r){let t=r.lang;return o`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${Us.map(e=>{let i=n.history.filter(a=>a.type===e).length;return i===0?h:o`
            <span class="filter-chip ${r.filter===e?"active":""}"
              @click=${()=>r.setFilter(r.filter===e?null:e)}>
              ${s(e,t)} (${i})
            </span>
          `})}
        ${r.filter?o`<span class="filter-chip clear" @click=${()=>r.setFilter(null)}>${s("show_all",t)}</span>`:h}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${s("search_notes",t)}..." .value=${r.search} @input=${e=>r.setSearch(e.target.value)} />
      </div>
    </div>
  `}function Ri(n,r){let t=r.lang,e=r.filter?n.history.filter(i=>i.type===r.filter):n.history;if(r.search){let i=r.search.toLowerCase();e=e.filter(a=>a.notes?.toLowerCase().includes(i))}return e.length===0?o`<p class="empty">${s("no_history",t)}</p>`:o`
    <div class="history-timeline">
      ${[...e].reverse().map(i=>Bs(i,r))}
    </div>
  `}function Bs(n,r){let t=r.lang,e=["completed","reset","skipped"].includes(n.type);return o`
    <div class="history-entry">
      <div class="history-icon ${n.type}">
        <ha-icon .icon=${te[n.type]||"mdi:circle"}></ha-icon>
      </div>
      <div class="history-content">
        <div class="history-row">
          <strong>${s(n.type,t)}</strong>
          ${e?o`<button class="history-edit-btn"
                     title=${s("history_edit_button",t)||"Edit entry"}
                     @click=${()=>r.openEdit(n)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:h}
        </div>
        <div class="history-date">${ie(n.timestamp,t)}</div>
        ${n.notes?o`<div>${n.notes}</div>`:h}
        ${n.photo_doc_id?o`<maintenance-history-photo .hass=${r.hass} .docId=${n.photo_doc_id}></maintenance-history-photo>`:h}
        <div class="history-details">
          ${n.cost!=null?o`<span>${s("cost",t)}: ${n.cost.toFixed(2)} ${r.currencySymbol}</span>`:h}
          ${n.duration!=null?o`<span>${s("duration",t)}: ${n.duration} min</span>`:h}
          ${n.trigger_value!=null?o`<span>${s("trigger_val",t)}: ${n.trigger_value}</span>`:h}
        </div>
      </div>
    </div>
  `}var E=class extends S{constructor(){super(...arguments);this.narrow=!1;this.panel={};this._objects=[];this._stats=null;this._view="overview";this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._filterUser=null;this._unsub=null;this._chartRangeDays=(()=>{try{let t=parseInt(localStorage.getItem("msp-chart-range")||"",10);return[7,30,90,365].includes(t)?t:30}catch{return 30}})();this._hideOutliers=(()=>{try{return localStorage.getItem("msp-chart-hide-outliers")==="1"}catch{return!1}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._actionLoading=!1;this._moreMenuOpen=!1;this._toastMessage="";this._toastUndo=null;this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab=(()=>{try{let t=localStorage.getItem("msp-overview-tab");return t==="today"||t==="calendar"?t:"dashboard"}catch{return"dashboard"}})();this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=re;this._showArchived=!1;this._bulkMode=!1;this._bulkSelected=new Set;this._collapsedSections=(()=>{try{return new Set(JSON.parse(localStorage.getItem("msp-collapsed-sections")||"[]"))}catch{return new Set}})();this._paletteOpen=!1;this._paletteQuery="";this._paletteActive=0;this._templateGalleryOpen=!1;this._templates=[];this._templateCategories={};this._templateBusy=!1;this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=t=>this._onPopState(t);this._deepLinkHandled=!1;this._paletteKeydown=t=>{if((t.ctrlKey||t.metaKey)&&(t.key==="k"||t.key==="K")){t.preventDefault(),this._paletteOpen?this._closePalette():this._openPalette();return}if(!this._paletteOpen)return;let e=this._paletteResults;if(t.key==="Escape")t.preventDefault(),this._closePalette();else if(t.key==="ArrowDown")t.preventDefault(),this._paletteActive=Math.min(this._paletteActive+1,e.length-1);else if(t.key==="ArrowUp")t.preventDefault(),this._paletteActive=Math.max(this._paletteActive-1,0);else if(t.key==="Enter"){t.preventDefault();let i=e[this._paletteActive];i&&this._selectPaletteResult(i)}};this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onCalendarLlCustom=t=>{let e=t.detail;e?.type==="maintenance-supporter:open-task"&&e.entry_id&&e.task_id&&(t.stopPropagation(),this._showTask(e.entry_id,e.task_id))};this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _lang(){return this.hass?.language||"en"}get _isOperator(){let t=this.hass?.user;return t?t.is_admin?!1:!(this._operatorWriteEnabled&&this._adminPanelUserIds.includes(t.id)):!0}connectedCallback(){super.connectedCallback(),window.addEventListener("popstate",this._popstateHandler),window.addEventListener("keydown",this._paletteKeydown);let t=localStorage.getItem("maintenance_supporter_sort");t&&["due_date","object","type","task_name","area","assigned_user","group"].includes(t)&&(this._sortMode=t);let e=localStorage.getItem("maintenance_supporter_object_sort");e&&["alphabetical","due_soonest","task_count"].includes(e)&&(this._objectSortMode=e);let i=localStorage.getItem("maintenance_supporter_groupby");i&&["none","area","group","user"].includes(i)&&(this._groupByMode=i);let a=localStorage.getItem("maintenance_supporter_object_view");(a==="cards"||a==="table")&&(this._objectViewMode=a)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._popstateHandler),window.removeEventListener("keydown",this._paletteKeydown),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null,this._deepLinkHandled=!1,this._statsService?.clearCache(),this._statsService=null}updated(t){super.updated(t);let e=this.hass?.language;if(e&&!ee(e)&&at(e).then(()=>this.requestUpdate()),t.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new le(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new gt(this.hass),this._userService.getUsers())}}async _loadData(){let[t,e,i,a,l]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null)]);if(t&&(this._objects=t.objects),e&&(this._stats=e),i&&(this._budget=i),a&&(this._groups=a.groups||{}),l){let c=l;this._features=c.features,this._adminPanelUserIds=c.admin_panel_user_ids||[],this._operatorWriteEnabled=c.operator_write_enabled??!1;let d=c.general?.default_warning_days;typeof d=="number"&&d>=0&&d<=365&&(this._defaultWarningDays=d),this._objectsTableColumns=Ft(c.objects_table_columns)}this._fetchMiniStatsForOverview(),this._handleDeepLink()}_handleDeepLink(){if(this._deepLinkHandled)return;let t=new URLSearchParams(window.location.search),e=t.get("ms_action"),i=()=>{let g=window.location.pathname+window.location.hash;history.replaceState(history.state,"",g)};if(e==="add_object"){this._deepLinkHandled=!0,i(),requestAnimationFrame(()=>{this.shadowRoot?.querySelector("maintenance-object-dialog")?.openCreate()});return}if(e==="open_vacation"||e==="open_budget"||e==="open_groups"||e==="open_settings"){this._deepLinkHandled=!0,i(),this._overviewTab="settings",requestAnimationFrame(()=>{let g=this.shadowRoot?.querySelector("maintenance-settings-view"),m=e.replace("open_","");g?.scrollToSection?.(m)});return}let a=t.get("entry_id");if(!a)return;this._deepLinkHandled=!0;let l=t.get("task_id"),c=t.get("action"),d=window.location.pathname+window.location.hash;history.replaceState(history.state,"",d);let u=this._getObject(a);if(!u){this._showOverview();return}if(l){let g=u.tasks.find(m=>m.id===l);if(!g){this._showObject(a);return}this._showTask(a,l),c==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(a,l,g.name,this._features.checklists?g.checklist:void 0,this._features.adaptive&&!!g.adaptive_config?.enabled)}):c==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(a,l,g)})}else this._showObject(a)}_isCounterEntity(t){if(!t)return!1;let e=t.type||"threshold";return e==="counter"||e==="state_change"}async _fetchDetailStats(t,e){if(!this._statsService)return;let i=await this._statsService.getDetailStats(t,e,this._chartRangeDays),a=new Map(this._detailStatsData);a.set(t,i),this._detailStatsData=a}_setChartRange(t){if(t===this._chartRangeDays)return;this._chartRangeDays=t;try{localStorage.setItem("msp-chart-range",String(t))}catch{}let e=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,i=e?.trigger_config?.entity_id;if(i){let a=new Map(this._detailStatsData);a.delete(i),this._detailStatsData=a,this._fetchDetailStats(i,this._isCounterEntity(e.trigger_config))}}_setHideOutliers(t){if(t!==this._hideOutliers){this._hideOutliers=t;try{localStorage.setItem("msp-chart-hide-outliers",t?"1":"0")}catch{}}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let t=[];for(let i of this._objects)for(let a of i.tasks){let l=a.trigger_config?.entity_id;l&&t.push({entityId:l,isCounter:this._isCounterEntity(a.trigger_config)})}if(t.length===0)return;let e=await this._statsService.getBatchMiniStats(t);this._miniStatsData=new Map([...this._miniStatsData,...e])}async _subscribe(){try{let t=await this.hass.connection.subscribeMessage(e=>{let i=e;this._objects=i.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected){t();return}this._unsub=t}catch{}}get _taskRows(){let t=[];for(let m of this._objects)for(let v of m.tasks){if(!this._showArchived&&v.archived||this._filterStatus&&v.status!==this._filterStatus)continue;if(this._filterUser){let w=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(v.responsible_user_id!==w)continue}let f=[];for(let w of Object.values(this._groups))w.task_refs?.some(b=>b.entry_id===m.entry_id&&b.task_id===v.id)&&f.push(w.name);t.push({entry_id:m.entry_id,task_id:v.id,object_name:m.object.name,task_name:v.name,type:v.type,schedule_type:v.schedule_type,status:v.status,days_until_due:v.days_until_due??null,next_due:v.next_due??null,trigger_active:v.trigger_active,trigger_current_value:v.trigger_current_value??null,trigger_current_delta:v.trigger_current_delta??null,trigger_config:v.trigger_config??null,trigger_entity_info:v.trigger_entity_info??null,times_performed:v.times_performed,total_cost:v.total_cost,interval_days:v.interval_days??null,interval_unit:v.interval_unit??null,interval_anchor:v.interval_anchor??null,is_done:v.is_done??!1,archived:v.archived??!1,history:v.history||[],enabled:v.enabled,nfc_tag_id:v.nfc_tag_id??null,priority:v.priority??"normal",labels:v.labels??[],area_id:m.object.area_id??null,responsible_user_id:v.responsible_user_id??null,group_names:f})}let e={overdue:0,triggered:1,due_soon:2,ok:3},i=(m,v)=>(e[m.status]??9)-(e[v.status]??9),a=(m,v)=>(m.days_until_due??99999)-(v.days_until_due??99999),l=(m,v)=>i(m,v)||a(m,v),c=m=>m.area_id&&this.hass?.areas?.[m.area_id]?.name||"",d=m=>m.responsible_user_id&&this._userService?.getUserName(m.responsible_user_id)||"",u=m=>m.group_names[0]||"",g={due_date:l,object:(m,v)=>m.object_name.localeCompare(v.object_name)||l(m,v),type:(m,v)=>m.type.localeCompare(v.type)||l(m,v),task_name:(m,v)=>m.task_name.localeCompare(v.task_name),area:(m,v)=>{let f=c(m),w=c(v);return!f&&w?1:f&&!w?-1:f.localeCompare(w)||l(m,v)},assigned_user:(m,v)=>{let f=d(m),w=d(v);return!f&&w?1:f&&!w?-1:f.localeCompare(w)||l(m,v)},group:(m,v)=>{let f=u(m),w=u(v);return!f&&w?1:f&&!w?-1:f.localeCompare(w)||l(m,v)}};return t.sort(g[this._sortMode]),t}_getObject(t){return this._objects.find(e=>e.entry_id===t)}_getTask(t,e){return this._getObject(t)?.tasks.find(a=>a.id===e)}_pushPanelState(t,e,i){let a={msp_view:t,msp_entry:e||null,msp_task:i||null};history.pushState(a,"")}_onPopState(t){let e=t.state;if(e?.msp_view&&(this._view=e.msp_view,this._selectedEntryId=e.msp_entry||null,this._selectedTaskId=e.msp_task||null,this._moreMenuOpen=!1,e.msp_view==="task"&&e.msp_entry&&e.msp_task)){this._historyFilter=null;let i=this._getTask(e.msp_entry,e.msp_task);i?.trigger_config?.entity_id&&this._fetchDetailStats(i.trigger_config.entity_id,this._isCounterEntity(i.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_filterByStatus(t){this._filterStatus=t,this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}_scrollContentToTop(){requestAnimationFrame(()=>{let t=this.shadowRoot?.querySelector(".content");t&&t.scrollTo({top:0,behavior:"smooth"})})}_showObject(t){this._pushPanelState("object",t),this._view="object",this._selectedEntryId=t,this._selectedTaskId=null,this._scrollContentToTop()}_showTask(t,e){this._pushPanelState("task",t,e),this._view="task",this._selectedEntryId=t,this._selectedTaskId=e,this._activeTab="overview",this._historyFilter=null,this._scrollContentToTop();let i=this._getTask(t,e);if(i?.trigger_config?.entity_id){let a=i.trigger_config.entity_id,l=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(a,l)}}_showToast(t){this._toastTimer&&clearTimeout(this._toastTimer),this._toastUndo=null,this._toastMessage=t,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}_showUndoToast(t,e){this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage=t,this._toastUndo=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastUndo=null,this._toastTimer=null},7e3)}_runToastUndo(){let t=this._toastUndo;this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage="",this._toastUndo=null,this._toastTimer=null,t?.()}_openPalette(){this._paletteQuery="",this._paletteActive=0,this._paletteOpen=!0,this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".palette-input")?.focus()})}_closePalette(){this._paletteOpen=!1,this._paletteQuery=""}get _paletteResults(){let t=this._paletteQuery.trim().toLowerCase(),e=[];for(let i of this._objects){let a=i.object.name||"";(!t||a.toLowerCase().includes(t))&&e.push({kind:"object",entryId:i.entry_id,label:a,sub:s("object",this._lang)});for(let l of i.tasks){if(l.archived)continue;let c=l.name||"",d=(l.labels||[]).some(u=>u.toLowerCase().includes(t));if(!t||c.toLowerCase().includes(t)||a.toLowerCase().includes(t)||d){let u=(l.labels||[]).length?`  #${(l.labels||[]).join(" #")}`:"";e.push({kind:"task",entryId:i.entry_id,taskId:l.id,label:c,sub:a+u})}}if(e.length>60)break}return e.slice(0,40)}_selectPaletteResult(t){this._closePalette(),t.kind==="task"&&t.taskId?this._showTask(t.entryId,t.taskId):this._showObject(t.entryId)}_renderPalette(){if(!this._paletteOpen)return h;let t=this._lang,e=this._paletteResults;return o`
      <div class="palette-backdrop" @click=${()=>this._closePalette()}>
        <div class="palette" @click=${i=>i.stopPropagation()}>
          <input
            class="palette-input"
            type="text"
            placeholder="${s("palette_placeholder",t)}"
            .value=${this._paletteQuery}
            @input=${i=>{this._paletteQuery=i.target.value,this._paletteActive=0}}
          />
          <div class="palette-results">
            ${e.length===0?o`<div class="palette-empty">${s("palette_no_results",t)}</div>`:e.map((i,a)=>o`
                  <div class="palette-item ${a===this._paletteActive?"active":""}"
                    @mouseenter=${()=>{this._paletteActive=a}}
                    @click=${()=>this._selectPaletteResult(i)}>
                    <ha-icon icon="${i.kind==="task"?"mdi:clipboard-check-outline":"mdi:package-variant-closed"}"></ha-icon>
                    <span class="palette-label">${i.label}</span>
                    <span class="palette-sub">${i.sub}</span>
                  </div>
                `)}
          </div>
          <div class="palette-hint">${s("palette_hint",t)}</div>
        </div>
      </div>
    `}async _openTemplateGallery(){if(this._templateGalleryOpen=!0,!(this._templates.length>0))try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates"});this._templateCategories=t.categories||{},this._templates=t.templates||[]}catch{this._showToast(s("action_error",this._lang))}}async _createFromTemplate(t){this._templateBusy=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/from_template",template_id:t});this._templateGalleryOpen=!1,await this._loadData(),this._showToast(s("template_created",this._lang)),e?.entry_id&&this._showObject(e.entry_id)}catch{this._showToast(s("action_error",this._lang))}finally{this._templateBusy=!1}}_categoryName(t){let e=this._templateCategories[t];return e&&(e[`name_${this._lang}`]||e.name_en)||t}_renderTemplateGallery(){if(!this._templateGalleryOpen)return h;let t=this._lang,e=new Map;for(let i of this._templates)e.has(i.category)||e.set(i.category,[]),e.get(i.category).push(i);return o`
      <div class="palette-backdrop" @click=${()=>{this._templateGalleryOpen=!1}}>
        <div class="template-gallery" @click=${i=>i.stopPropagation()}>
          <div class="template-gallery-head">
            <span>${s("templates_title",t)}</span>
            <ha-icon-button .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${()=>{this._templateGalleryOpen=!1}}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            ${this._templates.length===0?o`<div class="palette-empty">${s("loading",t)}…</div>`:[...e.entries()].map(([i,a])=>o`
                  <div class="template-cat">
                    <div class="template-cat-head">
                      <ha-icon icon="${this._templateCategories[i]?.icon||"mdi:folder-outline"}"></ha-icon>
                      ${this._categoryName(i)}
                    </div>
                    <div class="template-grid">
                      ${a.map(l=>o`
                        <button class="template-card" .disabled=${this._templateBusy}
                          @click=${()=>this._createFromTemplate(l.id)}>
                          <span class="template-card-name">${l.name}</span>
                          <span class="template-card-count">${s("templates_task_count",t).replace("{n}",String(l.tasks.length))}</span>
                        </button>
                      `)}
                    </div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `}_bulkKey(t){return`${t.entry_id}:${t.task_id}`}_toggleBulkMode(){this._bulkMode=!this._bulkMode,this._bulkMode||(this._bulkSelected=new Set)}_toggleBulkRow(t){let e=this._bulkKey(t),i=new Set(this._bulkSelected);i.has(e)?i.delete(e):i.add(e),this._bulkSelected=i}_bulkSelectAll(t){let e=t.map(a=>this._bulkKey(a)),i=e.every(a=>this._bulkSelected.has(a));this._bulkSelected=i?new Set:new Set(e)}async _runBulk(t,e,i,a){let l=t.filter(d=>this._bulkSelected.has(this._bulkKey(d)));if(l.length===0)return;this._actionLoading=!0;let c=0;for(let d of l)try{await this.hass.connection.sendMessagePromise(e(d)),c++}catch{}this._actionLoading=!1,this._bulkSelected=new Set,this._bulkMode=!1,await this._loadData(),a&&c>0?this._showUndoToast(i(c),a):this._showToast(i(c))}_bulkComplete(t){this._runBulk(t,e=>({type:"maintenance_supporter/task/complete",entry_id:e.entry_id,task_id:e.task_id}),e=>s("bulk_completed",this._lang).replace("{n}",String(e)))}_bulkArchive(t){let e=t.filter(i=>this._bulkSelected.has(this._bulkKey(i))).map(i=>({entry_id:i.entry_id,task_id:i.task_id}));this._runBulk(t,i=>({type:"maintenance_supporter/task/archive",entry_id:i.entry_id,task_id:i.task_id}),i=>s("bulk_archived",this._lang).replace("{n}",String(i)),async()=>{for(let i of e)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/unarchive",entry_id:i.entry_id,task_id:i.task_id})}catch{}await this._loadData()})}async _deleteObject(t){if(await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_object",this._lang),confirmText:s("delete",this._lang),danger:!0}))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:t}),this._showOverview(),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}_printObjectReport(t){let e=this._getObject(t);if(!e)return;let i=this._lang,a={title:s("report_title",i),generated:s("report_generated",i),manufacturer:s("manufacturer",i),model:s("model",i),serial:s("serial_number_label",i),installed:s("installed",i),warranty:s("warranty",i),area:s("area",i),notes:s("report_notes",i),tasksHeading:s("tasks",i),colTask:s("task_name",i),colType:s("report_col_type",i),colStatus:s("report_col_status",i),colSchedule:s("report_col_schedule",i),colLastDone:s("last_performed",i),colNextDue:s("next_due",i),colCost:s("cost",i),colTimes:s("report_times_done",i),totalCost:s("report_total_cost",i),scheduleLabel:d=>Me(d,i),none:"\u2014",statusLabel:d=>s(d,i),typeLabel:d=>s(d,i)},l=ni(e.object,e.tasks,a,d=>d?K(d,i):"",this._budget?.currency_symbol||_t,new Date().toISOString()),c=URL.createObjectURL(new Blob([l],{type:"text/html"}));window.open(c,"_blank"),setTimeout(()=>URL.revokeObjectURL(c),6e4)}async _duplicateObject(t){this._actionLoading=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/duplicate",entry_id:t});await this._loadData(),this._showToast(s("object_duplicated",this._lang)),e?.entry_id&&this._showObject(e.entry_id)}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _deleteTask(t,e){if(await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_task",this._lang),confirmText:s("delete",this._lang),danger:!0}))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/delete",entry_id:t,task_id:e}),this._showObject(t),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _duplicateTask(t,e){this._moreMenuOpen=!1,this._actionLoading=!0;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/duplicate",entry_id:t,task_id:e});await this._loadData(),this._showToast(s("task_duplicated",this._lang)),i?.task_id&&this._showTask(t,i.task_id)}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _toggleArchiveTask(t,e,i){this._actionLoading=!0;try{await this.hass.connection.sendMessagePromise({type:i?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:t,task_id:e}),await this._loadData(),i||this._showUndoToast(s("task_archived",this._lang),()=>this._toggleArchiveTask(t,e,!0))}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _toggleArchiveObject(t,e){try{await this.hass.connection.sendMessagePromise({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t}),await this._loadData(),e||this._showUndoToast(s("object_archived",this._lang),()=>this._toggleArchiveObject(t,!0))}catch{this._showToast(s("action_error",this._lang))}}async _skipTask(t,e,i){this._actionLoading=!0;try{let a={type:"maintenance_supporter/task/skip",entry_id:t,task_id:e};i&&(a.reason=i),await this.hass.connection.sendMessagePromise(a),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _resetTask(t,e,i){this._actionLoading=!0;try{let a={type:"maintenance_supporter/task/reset",entry_id:t,task_id:e};i&&(a.date=i),await this.hass.connection.sendMessagePromise(a),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _applySuggestion(t,e,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/apply_suggestion",entry_id:t,task_id:e,interval:i}),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}_openSeasonalOverrides(t){let e=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!e||!this._selectedEntryId)return;let i=t.adaptive_config?.seasonal_overrides;e.open(this._selectedEntryId,t.id,i)}async _reanalyzeInterval(t,e){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:t,task_id:e});i.recommended_interval?this._showToast(`${s("reanalyze_result",this._lang)}: ${i.recommended_interval} ${s("days",this._lang)} (${s(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${s("data_points",this._lang)})`):this._showToast(s("reanalyze_insufficient_data",this._lang)),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _promptSkipTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("skip",this._lang),message:s("skip_reason_prompt",this._lang),confirmText:s("skip",this._lang),inputLabel:s("reason_optional",this._lang),inputType:"text"});a.confirmed&&this._skipTask(t,e,a.value||void 0)}async _promptResetTask(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("reset",this._lang),message:s("reset_date_prompt",this._lang),confirmText:s("reset",this._lang),inputLabel:s("reset_date_optional",this._lang),inputType:"date"});a.confirmed&&this._resetTask(t,e,a.value||void 0)}async _snoozeTask(t,e){this._actionLoading=!0;try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/snooze",entry_id:t,task_id:e}),this._showToast(s("snoozed",this._lang))}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}_dismissSuggestion(t,e){t&&e&&this._dismissedSuggestions.add(`${t}_${e}`),this.requestUpdate()}async _handleQuickComplete(t,e,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/quick_complete",entry_id:t,task_id:e}),this._showToast(s("quick_complete_success",this._lang))}catch(a){(a?.code||"")==="no_defaults"?this._openCompleteDialog(t,e,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled):this._showToast(s("action_error",this._lang))}}_openCompleteDialog(t,e,i,a,l){let c=this.shadowRoot.querySelector("maintenance-complete-dialog");c&&(c.entryId=t,c.taskId=e,c.taskName=i,c.lang=this._lang,c.checklist=a||[],c.adaptiveEnabled=!!l,c.open())}_openQrForObject(t,e){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForObject(t,e)}_openQrForTask(t,e,i,a){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForTask(t,e,i,a)}render(){return o`
      <div class="panel">
        ${this.narrow||this._view!=="overview"?this._renderHeader():h}
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
      ${this._toastMessage?o`<div class="toast">
        <span>${this._toastMessage}</span>
        ${this._toastUndo?o`<button class="toast-undo" @click=${()=>this._runToastUndo()}>${s("undo",this._lang)}</button>`:h}
      </div>`:h}
      ${this._renderPalette()}
      ${this._renderTemplateGallery()}
    `}_renderHeader(){let t=[{label:s("maintenance",this._lang),action:()=>this._showOverview()}];if(this._view==="object"&&this._selectedEntryId){let e=this._getObject(this._selectedEntryId);t.push({label:e?.object.name||"Object"})}if(this._view==="task"&&this._selectedEntryId&&this._selectedTaskId){let e=this._getObject(this._selectedEntryId);t.push({label:e?.object.name||"Object",action:()=>this._showObject(this._selectedEntryId)});let i=this._getTask(this._selectedEntryId,this._selectedTaskId);t.push({label:i?.name||"Task"})}return o`
      <div class="header">
        ${this.narrow?o`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`:h}
        ${this._view!=="overview"?o`<ha-icon-button
              .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
              @click=${()=>{this._view==="task"?this._showObject(this._selectedEntryId):this._showOverview()}}
            ></ha-icon-button>`:h}
        <div class="breadcrumbs">
          ${t.map((e,i)=>o`
              ${i>0?o`<span class="sep">/</span>`:h}
              ${e.action?o`<a @click=${e.action}>${e.label}</a>`:o`<span class="current">${e.label}</span>`}
            `)}
        </div>
      </div>
    `}_renderOverview(){let t=this._lang,e=!!this.hass?.user?.is_admin,i=this._stats;return!e&&this._overviewTab==="settings"&&(this._overviewTab="dashboard"),o`
      ${i?o`
            <div class="stats-bar">
              <div class="stat-item clickable"
                   @click=${()=>this._showAllObjects()}
                   title=${s("show_all_objects",t)}>
                <span class="stat-value">${i.total_objects}</span>
                <span class="stat-label">${s("objects",t)}</span>
              </div>
              <div class="stat-item clickable"
                   @click=${()=>this._filterByStatus("")}
                   title=${s("show_all_tasks",t)}>
                <span class="stat-value">${i.total_tasks}</span>
                <span class="stat-label">${s("tasks",t)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="overdue"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("overdue")}
                   title=${s("filter_to_overdue",t)}>
                <span class="stat-value" style="color: var(--error-color)">${i.overdue}</span>
                <span class="stat-label">${s("overdue",t)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="due_soon"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("due_soon")}
                   title=${s("filter_to_due_soon",t)}>
                <span class="stat-value" style="color: var(--warning-color)">${i.due_soon}</span>
                <span class="stat-label">${s("due_soon",t)}</span>
              </div>
              <div class="stat-item clickable ${this._filterStatus==="triggered"&&this._overviewTab==="dashboard"?"active":""}"
                   @click=${()=>this._filterByStatus("triggered")}
                   title=${s("filter_to_triggered",t)}>
                <span class="stat-value" style="color: #ff5722">${i.triggered}</span>
                <span class="stat-label">${s("triggered",t)}</span>
              </div>
            </div>
          `:h}
      <div class="tab-bar">
        <div class="tab ${this._overviewTab==="today"?"active":""}"
          @click=${()=>this._setOverviewTab("today")}>
          ${s("tab_today",t)}
        </div>
        <div class="tab ${this._overviewTab==="dashboard"?"active":""}"
          @click=${()=>this._setOverviewTab("dashboard")}>
          ${s("dashboard",t)}
        </div>
        <div class="tab ${this._overviewTab==="calendar"?"active":""}"
          @click=${()=>this._setOverviewTab("calendar")}>
          ${s("tab_calendar",t)}
        </div>
        ${e?o`
          <div class="tab ${this._overviewTab==="settings"?"active":""}"
            @click=${()=>this._setOverviewTab("settings")}>
            ${s("settings",t)}
          </div>
        `:h}
      </div>
      ${this._overviewTab==="today"?this._renderToday():this._overviewTab==="dashboard"?this._renderDashboard():this._overviewTab==="calendar"?o`
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
    `}_statusBadge(t,e,i){let a=this._lang,l=t?"archived":e?"done":i,c=t?"archived":e?"completed":i,d=t?s("archived",a):e?s("completed",a):s(i,a);return o`<span class="status-badge ${l}"><ha-icon icon="${te[c]||"mdi:circle-medium"}"></ha-icon>${d}</span>`}_setOverviewTab(t){this._overviewTab=t;try{localStorage.setItem("msp-overview-tab",t)}catch{}this._scrollContentToTop()}_renderToday(){let t=this._lang,e=this._taskRows,i=u=>`${u.entry_id}:${u.task_id}`,a=e.filter(u=>u.status==="overdue"||u.trigger_active),l=new Set(a.map(i)),c=e.filter(u=>!l.has(i(u))&&u.days_until_due===0);c.forEach(u=>l.add(i(u)));let d=e.filter(u=>!l.has(i(u))&&u.days_until_due!=null&&u.days_until_due>0&&u.days_until_due<=7);return a.length+c.length+d.length===0?o`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${s("today_all_caught_up",t)}</p>
        </div>
      `:o`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue",a,"overdue")}
        ${this._renderTodaySection("today_due_today",c,"due_soon")}
        ${this._renderTodaySection("today_this_week",d,"")}
      </div>
    `}_renderTodaySection(t,e,i){if(e.length===0)return h;let a=this._lang;return o`
      <div class="today-section">
        <div class="today-section-header ${i}">
          <span>${s(t,a)}</span><span class="today-badge">${e.length}</span>
        </div>
        ${e.map(l=>o`
          <div class="today-row" @click=${()=>this._showTask(l.entry_id,l.task_id)}>
            <span class="today-dot ${l.trigger_active?"triggered":l.status}"></span>
            <div class="today-main">
              <div class="today-task">${l.task_name}</div>
              <div class="today-object">${l.object_name} · ${Tt(l.days_until_due,a)}</div>
            </div>
            <mwc-icon-button class="btn-complete" title="${s("complete",a)}"
              @click=${c=>{c.stopPropagation(),this._openCompleteDialogForRow(l)}}>
              <ha-icon icon="mdi:check"></ha-icon>
            </mwc-icon-button>
          </div>
        `)}
      </div>
    `}_renderDashboard(){let t=this._stats,e=this._taskRows,i=this._lang,a=this._isOperator,l=this._objects.reduce((c,d)=>c+d.tasks.filter(u=>u.archived).length,0);return o`
      ${this._features.budget?this._renderBudgetBar():h}

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
            ${this._features.groups?o`<option value="group" ?selected=${this._groupByMode==="group"}>${s("groupby_group",i)}</option>`:h}
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
        `:h}
        ${!a&&e.length>0?o`
          <ha-button
            class="bulk-toggle ${this._bulkMode?"active":""}"
            @click=${()=>this._toggleBulkMode()}
          >
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._bulkMode?s("cancel",i):s("bulk_select",i)}
          </ha-button>
        `:h}
        ${a?h:o`
          <ha-button
            @click=${()=>this.shadowRoot.querySelector("maintenance-object-dialog")?.openCreate()}
          >
            ${s("new_object",i)}
          </ha-button>
          <ha-button @click=${()=>this._openTemplateGallery()}>
            <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${s("templates_from",i)}
          </ha-button>
          <ha-button
            @click=${()=>this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate("",this._objects)}
          >
            ${s("new_task",i)}
          </ha-button>
        `}
      </div>

      ${e.length===0?o`
            <div class="empty-state">
              <ha-svg-icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></ha-svg-icon>
              <p>${s("no_tasks",i)}</p>
              ${!a&&this._objects.length===0?o`
                <p class="empty-onboard-hint">${s("onboard_hint",i)}</p>
                <div class="empty-onboard-actions">
                  <ha-button appearance="filled" @click=${()=>this._openTemplateGallery()}>
                    <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${s("templates_from",i)}
                  </ha-button>
                  <ha-button appearance="plain" @click=${()=>this.shadowRoot.querySelector("maintenance-object-dialog")?.openCreate()}>
                    ${s("new_object",i)}
                  </ha-button>
                </div>
              `:h}
            </div>
          `:o`
            ${this._bulkMode?this._renderBulkBar(e,i):h}
            ${this._groupByMode==="none"?o`
                  <div class="task-table${this._bulkMode?" bulk":""}">
                    ${e.map(c=>this._renderOverviewRow(c))}
                  </div>
                `:this._renderGroupedTasks(e,i)}
          `}

      ${this._features.groups&&!a?this._renderGroupsSection():h}
      ${a?h:o`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${c=>{let d=c.detail?.entry_id;d&&this._showObject(d)}}
          ></maintenance-storage-section-card>`}
    `}_renderBulkBar(t,e){let i=this._bulkSelected.size,a=t.length>0&&t.every(l=>this._bulkSelected.has(this._bulkKey(l)));return o`
      <div class="bulk-bar">
        <label class="bulk-selectall">
          <input type="checkbox" .checked=${a} @change=${()=>this._bulkSelectAll(t)} />
          ${s("bulk_select_all",e)}
        </label>
        <span class="bulk-count">${s("bulk_n_selected",e).replace("{n}",String(i))}</span>
        <span class="bulk-actions">
          <ha-button appearance="filled" .disabled=${i===0||this._actionLoading}
            @click=${()=>this._bulkComplete(t)}>
            <ha-icon icon="mdi:check"></ha-icon> ${s("complete",e)}
          </ha-button>
          <ha-button appearance="plain" .disabled=${i===0||this._actionLoading}
            @click=${()=>this._bulkArchive(t)}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${s("archive",e)}
          </ha-button>
        </span>
      </div>
    `}_renderGroupedTasks(t,e){let i=new Map,a=s("unassigned",e);for(let d of t){let u=[];this._groupByMode==="area"?u=[(d.area_id?this.hass?.areas?.[d.area_id]?.name:null)||a]:this._groupByMode==="user"?u=[(d.responsible_user_id?this._userService?.getUserName(d.responsible_user_id):null)||a]:this._groupByMode==="group"&&(u=d.group_names.length>0?d.group_names:[a]);for(let g of u)i.has(g)||i.set(g,[]),i.get(g).push(d)}let l=[...i.entries()].sort(([d],[u])=>d===a&&u!==a?1:u===a&&d!==a?-1:d.localeCompare(u)),c=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":"mdi:account-outline";return o`
      ${l.map(([d,u])=>o`
        <details class="group-section" open>
          <summary class="group-section-header">
            <ha-icon icon="${c}"></ha-icon>
            <span>${d}</span>
            <span class="group-section-count">(${u.length})</span>
          </summary>
          <div class="task-table${this._bulkMode?" bulk":""}">
            ${u.map(g=>this._renderOverviewRow(g))}
          </div>
        </details>
      `)}
    `}_warrantyLabel(t,e,i){return t.kind==="expired"?s("warranty_expired",i):t.kind==="expiring"?s("warranty_expires_in",i).replace("{days}",String(t.days??0)):s("warranty_valid_until",i).replace("{date}",K(e,i))}_renderWarrantyMeta(t,e){let i=Le(t);return o`<p class="meta">${s("warranty",e)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span></p>`}_renderAllObjects(){let t=this._lang,e=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,a=this._objects.filter(g=>g.object.archived).length,l=g=>{let m=1/0;for(let v of g.tasks){let f=v.days_until_due;f!=null&&f<m&&(m=f)}return m},c=this._objects.filter(g=>this._showArchived||!g.object.archived);this._objectSortMode==="alphabetical"?c.sort((g,m)=>g.object.name.localeCompare(m.object.name)):this._objectSortMode==="task_count"?c.sort((g,m)=>m.tasks.length-g.tasks.length||g.object.name.localeCompare(m.object.name)):c.sort((g,m)=>l(g)-l(m)||g.object.name.localeCompare(m.object.name));let d=()=>{let g=new Map;for(let m of c){let v=m.object.area_id,f=v?this.hass?.areas?.[v]?.name||s("unassigned",t):s("no_area",t);g.has(f)||g.set(f,[]),g.get(f).push(m)}return new Map([...g.entries()].sort(([m],[v])=>m.localeCompare(v)))},u=g=>{let m=g.tasks.some(v=>v.status==="overdue"||v.status==="triggered");return o`
        <div class="object-card${m?" object-card-overdue":""}" @click=${()=>this._showObject(g.entry_id)}>
          ${m?o`<span class="overdue-dot" title="${s("has_overdue",t)}"></span>`:h}
          <div class="object-card-header">
            <span class="object-card-name">${g.object.name}</span>
            ${g.object.document_count?o`<span class="doc-badge" title="${g.object.document_count} ${s("documents",t)}">
                  <ha-icon icon="mdi:paperclip"></ha-icon>${g.object.document_count}
                </span>`:h}
            <span class="object-card-count">${g.tasks.length} ${s("tasks_lower",t)}</span>
          </div>
          ${g.object.manufacturer||g.object.model?o`<div class="object-card-meta">${[g.object.manufacturer,g.object.model].filter(Boolean).join(" ")}</div>`:h}
          ${g.tasks.length===0?o`<div class="object-card-empty">${s("no_tasks_yet",t)}</div>`:h}
        </div>
      `};return o`
      <div class="breadcrumb">
        <ha-icon-button @click=${()=>this._showOverview()}>
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span>${s("all_objects",t)}</span>
      </div>
      <div class="filter-bar">
        <label class="filter-field">
          <span class="filter-label">${s("sort_label",t)}</span>
          <select
            .value=${this._objectSortMode}
            @change=${g=>{this._objectSortMode=g.target.value,localStorage.setItem("maintenance_supporter_object_sort",this._objectSortMode)}}
          >
            <option value="alphabetical" ?selected=${this._objectSortMode==="alphabetical"}>${s("sort_alphabetical",t)}</option>
            <option value="due_soonest" ?selected=${this._objectSortMode==="due_soonest"}>${s("sort_due_soonest",t)}</option>
            <option value="task_count" ?selected=${this._objectSortMode==="task_count"}>${s("sort_task_count",t)}</option>
          </select>
        </label>
        ${this.narrow?h:o`
          <div class="view-toggle" role="group" aria-label="${s("view_mode_label",t)}">
            <button
              class="view-toggle-btn${i?"":" active"}"
              title="${s("view_cards",t)}"
              @click=${()=>this._setObjectViewMode("cards")}
            ><ha-icon icon="mdi:view-grid-outline"></ha-icon></button>
            <button
              class="view-toggle-btn${i?" active":""}"
              title="${s("view_table",t)}"
              @click=${()=>this._setObjectViewMode("table")}
            ><ha-icon icon="mdi:table"></ha-icon></button>
          </div>
        `}
        ${i?h:o`
        <label class="filter-field">
          <span class="filter-label">${s("group_by_label",t)}</span>
          <select
            .value=${this._groupByMode}
            @change=${g=>{this._groupByMode=g.target.value,localStorage.setItem("maintenance_supporter_groupby",this._groupByMode)}}
          >
            <option value="none" ?selected=${this._groupByMode==="none"}>${s("groupby_none",t)}</option>
            <option value="area" ?selected=${this._groupByMode==="area"}>${s("groupby_area",t)}</option>
          </select>
        </label>
        `}
        ${e?h:o`
          <ha-button
            @click=${()=>this.shadowRoot.querySelector("maintenance-object-dialog")?.openCreate()}
          >
            ${s("new_object",t)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>this._exportObjectsCsv()}>
          <ha-icon icon="mdi:file-delimited-outline"></ha-icon> ${s("settings_export_csv",t)}
        </ha-button>
        ${a>0?o`
          <ha-button
            class="archived-toggle ${this._showArchived?"active":""}"
            @click=${()=>{this._showArchived=!this._showArchived}}
          >
            <ha-icon icon="mdi:archive-outline"></ha-icon>
            ${this._showArchived?s("hide_archived",t):`${s("show_archived",t)} (${a})`}
          </ha-button>
        `:h}
      </div>
      ${i?this._renderObjectsTable(c):this._groupByMode==="area"?o`
          ${[...d().entries()].map(([g,m])=>o`
            <details class="group-section" open>
              <summary class="group-section-header">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <span>${g}</span>
                <span class="group-section-count">(${m.length})</span>
              </summary>
              <div class="objects-grid">${m.map(u)}</div>
            </details>
          `)}
        `:o`<div class="objects-grid">${c.map(u)}</div>`}
    `}_setObjectViewMode(t){this._objectViewMode=t,localStorage.setItem("maintenance_supporter_object_view",t)}async _exportObjectsCsv(){try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects/csv"}),e=new Date().toISOString().slice(0,10);ne(t.csv,`maintenance_objects_${e}.csv`,"text/csv;charset=utf-8")}catch{this._showToast(s("action_error",this._lang))}}_renderObjectsTable(t){let e=this._lang,i=this._objectsTableColumns;return o`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${i.map(a=>{let l=St.find(d=>d.key===a),c=l&&l.key!=="actions"?s(l.labelKey,e):"";return o`<th class="oc-${a}">${c}</th>`})}
            </tr>
          </thead>
          <tbody>
            ${t.map(a=>o`
              <tr class="objects-table-row" @click=${()=>this._showObject(a.entry_id)}>
                ${i.map(l=>this._renderObjectCell(l,a,e))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `}_renderObjectCell(t,e,i){let a=e.object;switch(t){case"name":return o`<td class="oc-name">
          <span class="objects-table-name">${a.name}</span>
          ${a.document_count?o`<span class="doc-badge" title="${a.document_count} ${s("documents",i)}">
                <ha-icon icon="mdi:paperclip"></ha-icon>${a.document_count}
              </span>`:h}
        </td>`;case"manufacturer":return o`<td class="oc-manufacturer">${a.manufacturer||"\u2014"}</td>`;case"model":return o`<td class="oc-model">${a.model||"\u2014"}</td>`;case"serial_number":return o`<td class="oc-serial_number">${a.serial_number||"\u2014"}</td>`;case"installation_date":return o`<td class="oc-installation_date">${a.installation_date?K(a.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return o`<td class="oc-warranty_expiry">${this._renderWarrantyCell(a.warranty_expiry,i)}</td>`;case"area_id":{let l=a.area_id?this.hass?.areas?.[a.area_id]?.name||a.area_id:"\u2014";return o`<td class="oc-area_id">${l}</td>`}case"documentation_url":return o`<td class="oc-documentation_url">${a.documentation_url&&/^https?:\/\//i.test(a.documentation_url)?o`<a href=${a.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${l=>l.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`;case"notes":return o`<td class="oc-notes" title=${a.notes||""}>${a.notes||"\u2014"}</td>`;case"task_count":return o`<td class="oc-task_count">${e.tasks.length}</td>`;case"actions":return o`<td class="oc-actions">
          <mwc-icon-button title="${s("qr_code",i)}" @click=${l=>{l.stopPropagation(),this._openQrForObject(e.entry_id,a.name)}}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </mwc-icon-button>
        </td>`;default:return o`<td></td>`}}_renderWarrantyCell(t,e){let i=Le(t);return i.kind==="none"?o`<span class="warranty-none">—</span>`:o`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,t,e)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return h;let t=Object.entries(this._groups),e=this._lang;return o`
      <div class="groups-section">
        <div class="groups-header">
          <h3>${s("groups",e)}</h3>
          <ha-button appearance="plain" @click=${()=>this._openGroupCreate()}>
            ${s("new_group",e)}
          </ha-button>
        </div>
        ${t.length===0?o`<div class="hint">${s("no_groups",e)}</div>`:o`
            <div class="groups-grid">
              ${t.map(([i,a])=>{let l=a.task_refs.map(c=>this._getTask(c.entry_id,c.task_id)?.name).filter(Boolean);return o`
                  <div class="group-card">
                    <div class="group-card-head">
                      <div class="group-card-name">${a.name}</div>
                      <div class="group-card-actions">
                        <mwc-icon-button title="${s("edit",e)}" @click=${()=>this._openGroupEdit(i)}>
                          <ha-svg-icon path="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"></ha-svg-icon>
                        </mwc-icon-button>
                        <mwc-icon-button title="${s("delete",e)}" @click=${()=>this._deleteGroup(i,a.name)}>
                          <ha-svg-icon path="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"></ha-svg-icon>
                        </mwc-icon-button>
                      </div>
                    </div>
                    ${a.description?o`<div class="group-card-desc">${a.description}</div>`:h}
                    <div class="group-card-tasks">
                      ${l.length>0?l.map(c=>o`<span class="group-task-chip">${c}</span>`):o`<span style="font-size:12px;color:var(--secondary-text-color)">${s("no_tasks_short",e)}</span>`}
                    </div>
                  </div>
                `})}
            </div>
          `}
      </div>
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(t){let e=this._groups[t];e&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(t,e)}async _deleteGroup(t,e){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(i?await i.confirm({title:s("delete_group",this._lang),message:s("delete_group_confirm",this._lang).replace("{name}",e),confirmText:s("delete",this._lang)}):confirm(`${s("delete_group_confirm",this._lang).replace("{name}",e)}`))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/delete",group_id:t}),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}_renderBudgetBar(){let t=this._budget;if(!t)return h;let e=this._lang,i=t.currency_symbol||_t,a=[];return t.monthly_budget>0&&a.push({label:s("budget_monthly",e),spent:t.monthly_spent,budget:t.monthly_budget}),t.yearly_budget>0&&a.push({label:s("budget_yearly",e),spent:t.yearly_spent,budget:t.yearly_budget}),a.length===0?h:o`
      <div class="budget-bars">
        ${a.map(l=>{let c=Math.min(100,Math.max(0,l.spent/l.budget*100)),d=c>=100?"var(--error-color, #f44336)":c>=t.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return o`
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
    `}_renderOverviewRow(t){let e=this._lang,i=t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0,a=0,l=Xt.ok,c=!1;if(i&&t.days_until_due!==null){let v=ae(t.interval_days,t.days_until_due,t.interval_unit);a=v.pct,c=v.overflow,t.status==="overdue"?l=Xt.overdue:t.status==="due_soon"&&(l=Xt.due_soon)}let d=t.area_id?this.hass?.areas?.[t.area_id]?.name:null,u=t.responsible_user_id?this._userService?.getUserName(t.responsible_user_id):null,g=t.group_names.length>0||d||u,m=this._bulkMode&&this._bulkSelected.has(this._bulkKey(t));return o`
      <div class="task-row${t.enabled?"":" task-disabled"}${m?" bulk-selected":""}">
        ${this._bulkMode?o`
          <label class="cell bulk-check" @click=${v=>v.stopPropagation()}>
            <input type="checkbox" .checked=${m} @change=${()=>this._toggleBulkRow(t)} />
          </label>
        `:h}
        <span class="cell-badges">
          ${this._statusBadge(!!t.archived,t.is_done,t.status)}
          ${t.enabled?h:o`<span class="badge-disabled">${s("disabled",e)}</span>`}
          ${t.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_linked",e)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
          ${t.priority==="high"?o`<span class="priority-badge priority-high" title="${s("priority_high",e)}"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:h}
          ${t.priority==="low"?o`<span class="priority-badge priority-low" title="${s("priority_low",e)}"><ha-icon icon="mdi:chevron-double-down"></ha-icon></span>`:h}
        </span>
        <span class="cell object-name" @click=${v=>{v.stopPropagation(),this._showObject(t.entry_id)}}>${t.object_name}</span>
        <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,t.task_id)}>${t.task_name}</span>
        <span class="task-sub${g?"":" task-sub-empty"}">
          ${t.group_names.length>0?o`
            <span class="sub-chip" title="${s("groups",e)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${t.group_names.join(", ")}
            </span>`:h}
          ${d?o`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${d}
            </span>`:h}
          ${u?o`
            <span class="sub-chip" title="${s("responsible_user",e)}">
              <ha-icon icon="mdi:account-outline"></ha-icon>${u}
            </span>`:h}
          ${(t.labels||[]).map(v=>o`
            <span class="sub-chip label-chip" title="${s("labels",e)}">
              <ha-icon icon="mdi:tag-outline"></ha-icon>${v}
            </span>`)}
        </span>
        <span class="cell type">${s(t.type,e)}</span>
        <span class="due-cell" @click=${()=>this._showTask(t.entry_id,t.task_id)}>
          <span class="due-text">${Tt(t.days_until_due,e)}</span>
          ${i?o`<div class="days-bar"><div class="days-bar-fill${c?" overflow":""}" style="width:${a}%;background:${l}"></div></div>`:h}
          ${t.trigger_config?He(t):!i&&t.trigger_active?o`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:h}
          ${De(t,this._miniStatsData,this._lang)}
        </span>
        <span class="row-actions">
          <mwc-icon-button class="btn-complete" title="${s("complete",e)}" @click=${v=>{v.stopPropagation(),this._openCompleteDialogForRow(t)}}>
            <ha-icon icon="mdi:check"></ha-icon>
          </mwc-icon-button>
          <mwc-icon-button class="btn-skip" title="${s("skip",e)}" .disabled=${this._actionLoading} @click=${v=>{v.stopPropagation(),this._promptSkipTask(t.entry_id,t.task_id)}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>
        </span>
      </div>
    `}_openCompleteDialogForRow(t){let i=this._objects.find(a=>a.entry_id===t.entry_id)?.tasks.find(a=>a.id===t.task_id);this._openCompleteDialog(t.entry_id,t.task_id,t.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return h;let t=this._getObject(this._selectedEntryId);if(!t)return o`<p>Object not found.</p>`;let e=t.object,i=this._lang,a=this._isOperator,l=t.tasks.filter(d=>d.archived).length,c=t.tasks.filter(d=>this._showArchived||!d.archived);return o`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${e.name}</h2>
          <div class="action-buttons">
            ${a?h:o`
              <ha-button appearance="plain" @click=${()=>{this.shadowRoot.querySelector("maintenance-object-dialog")?.openEdit(t.entry_id,e)}}>${s("edit",i)}</ha-button>
              <ha-button appearance="filled" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate(t.entry_id)}}>${s("add_task",i)}</ha-button>
              <ha-button appearance="plain" .disabled=${this._actionLoading} @click=${()=>this._duplicateObject(t.entry_id)}>
                <ha-icon icon="mdi:content-copy"></ha-icon> ${s("duplicate",i)}
              </ha-button>
              <ha-button appearance="plain" @click=${()=>this._toggleArchiveObject(t.entry_id,!!e.archived)}>
                <ha-icon icon="${e.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                ${e.archived?s("unarchive_object",i):s("archive_object",i)}
              </ha-button>
              <ha-button variant="danger" appearance="plain" @click=${()=>this._deleteObject(t.entry_id)}>${s("delete",i)}</ha-button>
            `}
            <ha-button appearance="plain" @click=${()=>this._openQrForObject(t.entry_id,e.name)}><ha-icon icon="mdi:qrcode"></ha-icon> ${s("qr_code",i)}</ha-button>
            <ha-button appearance="plain" @click=${()=>this._printObjectReport(t.entry_id)}><ha-icon icon="mdi:file-document-outline"></ha-icon> ${s("report_button",i)}</ha-button>
          </div>
        </div>
        ${e.manufacturer||e.model?o`<p class="meta">${[e.manufacturer,e.model].filter(Boolean).join(" ")}</p>`:h}
        ${e.serial_number?o`<p class="meta">${s("serial_number_label",i)}: ${e.serial_number}</p>`:h}
        ${e.documentation_url&&/^https?:\/\//i.test(e.documentation_url)?o`<p class="meta">${s("documentation_url_label",i)}:
              <a href=${e.documentation_url} target="_blank" rel="noopener noreferrer">${e.documentation_url}</a>
            </p>`:h}
        ${e.installation_date?o`<p class="meta">${s("installed",i)}: ${K(e.installation_date,i)}</p>`:h}
        ${e.warranty_expiry?this._renderWarrantyMeta(e.warranty_expiry,i):h}
        ${e.notes?o`<div class="object-notes">
              <div class="object-notes-label">${s("object_notes_label",i)}</div>
              <div class="object-notes-body">${e.notes}</div>
            </div>`:h}

        <maintenance-documents-section
          .hass=${this.hass}
          .entryId=${t.entry_id}
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
          </ha-button>`:h}</h3>
        ${t.tasks.length===0?o`<div class="empty-state-centered">
              <p class="empty">${s("no_tasks_yet",i)}</p>
              <ha-button appearance="filled" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate(t.entry_id)}}>${s("add_first_task",i)}</ha-button>
            </div>`:o`<div class="task-table">${[...c].sort((d,u)=>{let g={overdue:0,triggered:1,due_soon:2,ok:3};return(g[d.status]??9)-(g[u.status]??9)||(d.days_until_due??99999)-(u.days_until_due??99999)}).map(d=>o`
              <div class="task-row${d.enabled?"":" task-disabled"}">
                <span class="cell-badges">
                  ${this._statusBadge(!!d.archived,!!d.is_done,d.status)}
                  ${d.enabled?h:o`<span class="badge-disabled">${s("disabled",i)}</span>`}
                  ${d.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:h}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(t.entry_id,d.id)}>${d.name}</span>
                <span class="task-sub${d.responsible_user_id?"":" task-sub-empty"}">${this._renderUserBadge(d)}</span>
                <span class="cell type">${s(d.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(t.entry_id,d.id)}>
                  <span class="due-text">${Tt(d.days_until_due,i)}</span>
                  ${d.trigger_config?He(d):h}
                  ${De(d,this._miniStatsData,this._lang)}
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${s("complete",i)}" @click=${u=>{u.stopPropagation(),this._openCompleteDialog(t.entry_id,d.id,d.name,this._features.checklists?d.checklist:void 0,this._features.adaptive&&!!d.adaptive_config?.enabled)}}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${s("skip",i)}" .disabled=${this._actionLoading} @click=${u=>{u.stopPropagation(),this._promptSkipTask(t.entry_id,d.id)}}>
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </mwc-icon-button>
                </span>
              </div>
            `)}</div>`}
      </div>
    `}_renderTaskHeader(t){let e=this._lang,a=this._getObject(this._selectedEntryId)?.object.name||"",l=this._isOperator,c=t.archived?"archived":t.is_done?"done":t.status==="due_soon"?"warning":t.status||"ok",d=t.archived?s("archived",e):t.is_done?s("completed",e):s(t.status||"ok",e);return o`
      <div class="task-header">
        <div class="task-header-title">
          <span class="task-name-breadcrumb" @click=${()=>this._view="task"}>${t.name}</span>
          <span class="breadcrumb-separator">·</span>
          <span class="object-name-breadcrumb" @click=${()=>this._showObject(this._selectedEntryId)}>${a}</span>
          <span class="status-chip ${c}">${d}</span>
          ${this._renderUserBadge(t)}
          ${t.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_tag_id",e)}: ${t.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:l?h:o`<span class="nfc-badge unlinked" title="${s("nfc_link_hint",e)}"
                @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,t)}}>
                <ha-icon icon="mdi:nfc-variant"></ha-icon>
              </span>`}
        </div>
        <div class="task-header-actions">
          <ha-button appearance="filled" @click=${()=>this._openCompleteDialog(this._selectedEntryId,this._selectedTaskId,t.name,this._features.checklists?t.checklist:void 0,this._features.adaptive&&!!t.adaptive_config?.enabled)}>${s("complete",e)}</ha-button>
          <ha-button appearance="plain" .disabled=${this._actionLoading} @click=${()=>this._promptSkipTask(this._selectedEntryId,this._selectedTaskId)}>${s("skip",e)}</ha-button>
          ${l?h:o`
            <ha-button appearance="plain" @click=${()=>this._toggleArchiveTask(this._selectedEntryId,this._selectedTaskId,!!t.archived)}>
              <ha-icon icon="${t.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
              ${t.archived?s("unarchive",e):s("archive",e)}
            </ha-button>
          `}
          <ha-button appearance="plain" @click=${()=>{let u=this._getObject(this._selectedEntryId)?.object;this._openQrForTask(this._selectedEntryId,this._selectedTaskId,u?.name||"",t.name)}}><ha-icon icon="mdi:qrcode"></ha-icon> ${s("qr_code",e)}</ha-button>
          ${l?h:o`
            <div class="more-menu-wrapper">
              <ha-icon-button .disabled=${this._actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${this._toggleMoreMenu}></ha-icon-button>
              ${this._moreMenuOpen?o`
                <div class="popup-menu" @click=${u=>u.stopPropagation()}>
                  <div class="popup-menu-item" @click=${()=>{this._closeMoreMenu(),this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(this._selectedEntryId,t)}}>${s("edit",e)}</div>
                  <div class="popup-menu-item" @click=${()=>this._duplicateTask(this._selectedEntryId,this._selectedTaskId)}>${s("duplicate",e)}</div>
                  <div class="popup-menu-item" @click=${()=>{this._closeMoreMenu(),this._promptResetTask(this._selectedEntryId,this._selectedTaskId)}}>${s("reset",e)}</div>
                  <div class="popup-menu-item" @click=${()=>{this._closeMoreMenu(),this._snoozeTask(this._selectedEntryId,this._selectedTaskId)}}>${s("snooze",e)}</div>
                  <div class="popup-menu-divider"></div>
                  <div class="popup-menu-item danger" @click=${()=>{this._closeMoreMenu(),this._deleteTask(this._selectedEntryId,this._selectedTaskId)}}>${s("delete",e)}</div>
                </div>
              `:h}
            </div>
          `}
        </div>
      </div>
    `}_toggleMoreMenu(){if(this._moreMenuOpen=!this._moreMenuOpen,this._moreMenuOpen){let t=()=>{this._moreMenuOpen=!1,document.removeEventListener("click",t)};setTimeout(()=>document.addEventListener("click",t,{once:!0}),0)}}_closeMoreMenu(){this._moreMenuOpen=!1}_renderUserBadge(t){if(!t.responsible_user_id||!this._userService)return h;let e=this._userService.getUserName(t.responsible_user_id);return e?o`
      <span class="user-badge">
        <ha-icon icon="mdi:account"></ha-icon>
        ${e}
      </span>
    `:h}_renderTabBar(){let t=this._lang;return o`
      <div class="tab-bar">
        <div class="tab ${this._activeTab==="overview"?"active":""}" @click=${()=>this._activeTab="overview"}>
          ${s("overview",t)}
        </div>
        <div class="tab ${this._activeTab==="history"?"active":""}" @click=${()=>this._activeTab="history"}>
          ${s("history",t)}
        </div>
      </div>
    `}_renderTabContent(t){switch(this._activeTab){case"overview":return this._renderOverviewTab(t);case"history":return this._renderHistoryTab(t);default:return h}}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,isCounterEntity:t=>this._isCounterEntity(t),rangeDays:this._chartRangeDays,setRangeDays:t=>this._setChartRange(t),hideOutliers:this._hideOutliers,setHideOutliers:t=>this._setHideOutliers(t)}}_toggleSection(t){let e=new Set(this._collapsedSections);e.has(t)?e.delete(t):e.add(t),this._collapsedSections=e;try{localStorage.setItem("msp-collapsed-sections",JSON.stringify([...e]))}catch{}}_collapsible(t,e,i){let a=this._collapsedSections.has(t);return o`
      <div class="collapsible ${a?"collapsed":""}">
        <button class="collapsible-head" @click=${()=>this._toggleSection(t)}
          aria-expanded=${a?"false":"true"}>
          <ha-icon icon="${a?"mdi:chevron-right":"mdi:chevron-down"}"></ha-icon>
          <span>${s(e,this._lang)}</span>
        </button>
        ${a?h:o`<div class="collapsible-body">${i}</div>`}
      </div>
    `}_renderOverviewTab(t){let e=this._lang,i=this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days,a=this._features.seasonal&&t.seasonal_factor&&t.seasonal_factor!==1,l=i||a,c=this._features.adaptive&&t.interval_analysis?.weibull_beta!=null&&t.interval_analysis?.weibull_eta!=null,d=this._features.seasonal&&(t.seasonal_factors?.length===12||t.interval_analysis?.seasonal_factors?.length===12);return o`
      <div class="tab-content overview-tab">
        ${this._renderKPIBar(t)}
        ${this._renderTaskMeta(t)}
        ${Ii(t,this._lang)}
        ${yi(t,this._sparklineCtx)}
        ${wi(t,e,this._features)}
        <div class="two-column-layout ${l?"":"single-column"}">
          ${l?o`
            <div class="left-column">
              ${this._renderRecommendationCard(t)}
              ${Si(t,e,this._features)}
            </div>
          `:h}
          <div class="right-column">
            ${ji(t,e,this._costDurationToggle,u=>{this._costDurationToggle=u})}
          </div>
        </div>
        ${c?this._collapsible("weibull","weibull_reliability_curve",ki(t,e)):h}
        ${d?this._collapsible("seasonal","seasonal_chart_title",o`
              ${Ai(t,e)}
              <div class="seasonal-actions">
                <ha-button appearance="plain" @click=${()=>this._openSeasonalOverrides(t)}>
                  ${s("edit_seasonal_overrides",e)}
                </ha-button>
              </div>
            `):h}
        ${this._renderChecklistCard(t)}
        ${this._renderRecentActivities(t)}
      </div>
    `}_renderChecklistCard(t){if(!this._features.checklists)return h;let e=t.checklist||[];if(e.length===0)return h;let i=this._lang;return o`
      <div class="checklist-preview-card">
        <div class="checklist-preview-header">
          <ha-icon icon="mdi:format-list-checks"></ha-icon>
          <span>${s("checklist",i)} (${e.length})</span>
        </div>
        <ol class="checklist-preview-list">
          ${e.map(a=>o`<li>${a}</li>`)}
        </ol>
      </div>
    `}_historyCtx(){return{lang:this._lang,hass:this.hass,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._budget?.currency_symbol||_t,setFilter:t=>{this._historyFilter=t},setSearch:t=>{this._historySearch=t},openEdit:t=>this._openHistoryEdit(t)}}_renderHistoryTab(t){let e=this._historyCtx();return o`
      <div class="tab-content history-tab">
        ${Mi(t,e)}
        ${Ri(t,e)}
      </div>
    `}_renderTaskMeta(t){let e=t.documentation_url&&/^https?:\/\//i.test(t.documentation_url)?t.documentation_url:null,i=this._selectedEntryId?this._getObject(this._selectedEntryId):void 0,a=i?.object?.documentation_url,l=a&&/^https?:\/\//i.test(a)?a:null;if(!t.notes&&!e&&!l)return h;let c=this._lang;return o`
      <div class="task-meta-card">
        ${t.notes?o`
          <div class="task-meta-row">
            <ha-icon icon="mdi:note-text-outline"></ha-icon>
            <span class="task-meta-notes">${t.notes}</span>
          </div>
        `:h}
        ${e?o`
          <div class="task-meta-row task-meta-link">
            <ha-icon icon="mdi:open-in-new"></ha-icon>
            <a href="${e}" target="_blank" rel="noopener noreferrer">${s("documentation_label",c)}</a>
          </div>
        `:h}
        ${l?o`
          <div class="task-meta-row task-meta-link">
            <ha-icon icon="mdi:book-open-variant"></ha-icon>
            <a href="${l}" target="_blank" rel="noopener noreferrer">${s("documentation_url_label",c)} (${i?.object?.name||""})</a>
          </div>
        `:h}
      </div>
    `}_renderKPIBar(t){let e=this._lang,i=t.times_performed>0?t.total_cost/t.times_performed:0,a=t.days_until_due!==null&&t.days_until_due!==void 0?t.days_until_due<0?"overdue":t.days_until_due<=t.warning_days?"warning":"":"";return o`
      <div class="kpi-bar">
        <div class="kpi-card">
          <div class="kpi-label">${s("next_due",e)}</div>
          <div class="kpi-value">${t.next_due?K(t.next_due,e):"\u2014"}</div>
          ${this._features.schedule_time&&t.schedule_time?o`<div class="kpi-subtext">${s("at_time",e)} ${t.schedule_time}</div>`:h}
        </div>
        <div class="kpi-card ${a}">
          <div class="kpi-label">${s("days_until_due",e)}</div>
          <div class="kpi-value-large">${t.days_until_due!==null&&t.days_until_due!==void 0?t.days_until_due:"\u2014"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("interval",e)}</div>
          <div class="kpi-value">${Me(t,e)}</div>
          ${this._features.adaptive&&t.suggested_interval&&t.suggested_interval!==t.interval_days?o`
            <div class="kpi-subtext">${s("recommended",e)}: ${t.suggested_interval}${t.interval_analysis?.confidence_interval_low!=null?` (${t.interval_analysis.confidence_interval_low}\u2013${t.interval_analysis.confidence_interval_high})`:""}</div>
          `:h}
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("warning",e)}</div>
          <div class="kpi-value">${t.warning_days} ${s("days",e)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("last_performed",e)}</div>
          <div class="kpi-value">${t.last_performed?K(t.last_performed,e):"\u2014"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("avg_cost",e)}</div>
          <div class="kpi-value">${i.toFixed(0)} ${this._budget?.currency_symbol||_t}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${s("avg_duration",e)}</div>
          <div class="kpi-value">${t.average_duration?t.average_duration.toFixed(0):"\u2014"} min</div>
        </div>
      </div>
    `}_renderRecommendationCard(t){let e=this._lang;if(!this._features.adaptive||!t.suggested_interval||t.suggested_interval===t.interval_days)return h;if(this._selectedEntryId&&this._selectedTaskId&&this._dismissedSuggestions.has(`${this._selectedEntryId}_${this._selectedTaskId}`))return h;let i=t.suggested_interval;return o`
      <div class="recommendation-card">
        <h4>${s("suggested_interval",e)}</h4>
        ${Ei(t.interval_days,i,t.interval_confidence||"medium",e)}
        <div class="recommendation-actions">
          <ha-button appearance="filled"
            @click=${()=>this._applySuggestion(this._selectedEntryId,this._selectedTaskId,i)}>
            ${s("apply_suggestion",e)}
          </ha-button>
          <ha-button appearance="plain"
            @click=${()=>this._reanalyzeInterval(this._selectedEntryId,this._selectedTaskId)}>
            ${s("reanalyze",e)}
          </ha-button>
          <ha-button appearance="plain"
            @click=${()=>this._dismissSuggestion(this._selectedEntryId,this._selectedTaskId)}>
            ${s("dismiss_suggestion",e)}
          </ha-button>
        </div>
      </div>
    `}_renderRecentActivities(t){let e=this._lang,i=t.history.slice(-3).reverse();if(i.length===0)return h;let a=l=>{switch(l){case"completed":return"\u2713";case"triggered":return"\u2297";case"skipped":return"\u21B7";case"reset":return"\u21BA";default:return"\xB7"}};return o`
      <div class="recent-activities">
        <h3>${s("recent_activities",e)}</h3>
        ${i.map(l=>o`
          <div class="activity-item">
            <span class="activity-icon">${a(l.type)}</span>
            <span class="activity-date">${ie(l.timestamp,e)}</span>
            <span class="activity-note">${l.notes||"\u2014"}</span>
            ${l.cost?o`<span class="activity-badge">${l.cost.toFixed(0)}${this._budget?.currency_symbol||_t}</span>`:h}
            ${l.duration?o`<span class="activity-badge">${l.duration}min</span>`:h}
          </div>
        `)}
        <div class="activity-show-all">
          <ha-button appearance="plain" @click=${()=>this._activeTab="history"}>${s("show_all",e)} →</ha-button>
        </div>
      </div>
    `}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return h;let t=this._getTask(this._selectedEntryId,this._selectedTaskId);if(!t)return o`<p>Task not found.</p>`;let e=this._lang;return o`
      <div class="detail-section">
        ${this._renderTaskHeader(t)}
        ${this._renderTabBar()}
        ${this._renderTabContent(t)}
        <maintenance-task-documents
          .hass=${this.hass}
          .entryId=${this._selectedEntryId}
          .taskId=${this._selectedTaskId}
          .canWrite=${!this._isOperator}
        ></maintenance-task-documents>
      </div>
    `}_openHistoryEdit(t){if(!this._selectedEntryId||!this._selectedTaskId)return;let e={entry_id:this._selectedEntryId,task_id:this._selectedTaskId,original_timestamp:t.timestamp,type:t.type,timestamp:t.timestamp,notes:t.notes??null,cost:t.cost??null,duration:t.duration??null,completed_by:t.completed_by??null};this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(e)}};E.styles=[se,oi],p([y({attribute:!1})],E.prototype,"hass",2),p([y({type:Boolean,reflect:!0})],E.prototype,"narrow",2),p([y({attribute:!1})],E.prototype,"panel",2),p([_()],E.prototype,"_objects",2),p([_()],E.prototype,"_stats",2),p([_()],E.prototype,"_view",2),p([_()],E.prototype,"_selectedEntryId",2),p([_()],E.prototype,"_selectedTaskId",2),p([_()],E.prototype,"_filterStatus",2),p([_()],E.prototype,"_filterUser",2),p([_()],E.prototype,"_unsub",2),p([_()],E.prototype,"_chartRangeDays",2),p([_()],E.prototype,"_hideOutliers",2),p([_()],E.prototype,"_historyFilter",2),p([_()],E.prototype,"_budget",2),p([_()],E.prototype,"_groups",2),p([_()],E.prototype,"_detailStatsData",2),p([_()],E.prototype,"_miniStatsData",2),p([_()],E.prototype,"_features",2),p([_()],E.prototype,"_adminPanelUserIds",2),p([_()],E.prototype,"_operatorWriteEnabled",2),p([_()],E.prototype,"_defaultWarningDays",2),p([_()],E.prototype,"_actionLoading",2),p([_()],E.prototype,"_moreMenuOpen",2),p([_()],E.prototype,"_toastMessage",2),p([_()],E.prototype,"_toastUndo",2),p([_()],E.prototype,"_overviewTab",2),p([_()],E.prototype,"_activeTab",2),p([_()],E.prototype,"_costDurationToggle",2),p([_()],E.prototype,"_historySearch",2),p([_()],E.prototype,"_sortMode",2),p([_()],E.prototype,"_objectSortMode",2),p([_()],E.prototype,"_groupByMode",2),p([_()],E.prototype,"_objectViewMode",2),p([_()],E.prototype,"_objectsTableColumns",2),p([_()],E.prototype,"_showArchived",2),p([_()],E.prototype,"_bulkMode",2),p([_()],E.prototype,"_bulkSelected",2),p([_()],E.prototype,"_collapsedSections",2),p([_()],E.prototype,"_paletteOpen",2),p([_()],E.prototype,"_paletteQuery",2),p([_()],E.prototype,"_paletteActive",2),p([_()],E.prototype,"_templateGalleryOpen",2),p([_()],E.prototype,"_templates",2),p([_()],E.prototype,"_templateCategories",2),p([_()],E.prototype,"_templateBusy",2),E=p([ii("maintenance-supporter-panel")],E);export{E as MaintenanceSupporterPanel};
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
