var Ki=Object.defineProperty;var Yi=Object.getOwnPropertyDescriptor;var d=(r,n,e,t)=>{for(var i=t>1?void 0:t?Yi(n,e):n,a=r.length-1,l;a>=0;a--)(l=r[a])&&(i=(t?l(n,e,i):l(i))||i);return t&&i&&Ki(n,e,i),i};var tt=globalThis,it=tt.ShadowRoot&&(tt.ShadyCSS===void 0||tt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Et=Symbol(),Vt=new WeakMap,He=class{constructor(n,e,t){if(this._$cssResult$=!0,t!==Et)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=e}get styleSheet(){let n=this.o,e=this.t;if(it&&n===void 0){let t=e!==void 0&&e.length===1;t&&(n=Vt.get(e)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),t&&Vt.set(e,n))}return n}toString(){return this.cssText}},Kt=r=>new He(typeof r=="string"?r:r+"",void 0,Et),j=(r,...n)=>{let e=r.length===1?r[0]:n.reduce((t,i,a)=>t+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[a+1],r[0]);return new He(e,r,Et)},Yt=(r,n)=>{if(it)r.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of n){let t=document.createElement("style"),i=tt.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,r.appendChild(t)}},Tt=it?r=>r:r=>r instanceof CSSStyleSheet?(n=>{let e="";for(let t of n.cssRules)e+=t.cssText;return Kt(e)})(r):r;var{is:Gi,defineProperty:Qi,getOwnPropertyDescriptor:Ji,getOwnPropertyNames:Zi,getOwnPropertySymbols:Xi,getPrototypeOf:es}=Object,st=globalThis,Gt=st.trustedTypes,ts=Gt?Gt.emptyScript:"",is=st.reactiveElementPolyfillSupport,De=(r,n)=>r,Oe={toAttribute(r,n){switch(n){case Boolean:r=r?ts:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,n){let e=r;switch(n){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},at=(r,n)=>!Gi(r,n),Qt={attribute:!0,type:String,converter:Oe,reflect:!1,useDefault:!1,hasChanged:at};Symbol.metadata??=Symbol("metadata"),st.litPropertyMetadata??=new WeakMap;var pe=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,e=Qt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(n,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(n,t,e);i!==void 0&&Qi(this.prototype,n,i)}}static getPropertyDescriptor(n,e,t){let{get:i,set:a}=Ji(this.prototype,n)??{get(){return this[e]},set(l){this[e]=l}};return{get:i,set(l){let c=i?.call(this);a?.call(this,l),this.requestUpdate(n,c,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Qt}static _$Ei(){if(this.hasOwnProperty(De("elementProperties")))return;let n=es(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(De("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(De("properties"))){let e=this.properties,t=[...Zi(e),...Xi(e)];for(let i of t)this.createProperty(i,e[i])}let n=this[Symbol.metadata];if(n!==null){let e=litPropertyMetadata.get(n);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let e=[];if(Array.isArray(n)){let t=new Set(n.flat(1/0).reverse());for(let i of t)e.unshift(Tt(i))}else n!==void 0&&e.push(Tt(n));return e}static _$Eu(n,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(n.set(t,this[t]),delete this[t]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Yt(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,e,t){this._$AK(n,t)}_$ET(n,e){let t=this.constructor.elementProperties.get(n),i=this.constructor._$Eu(n,t);if(i!==void 0&&t.reflect===!0){let a=(t.converter?.toAttribute!==void 0?t.converter:Oe).toAttribute(e,t.type);this._$Em=n,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(n,e){let t=this.constructor,i=t._$Eh.get(n);if(i!==void 0&&this._$Em!==i){let a=t.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:Oe;this._$Em=i;let c=l.fromAttribute(e,a.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(n,e,t,i=!1,a){if(n!==void 0){let l=this.constructor;if(i===!1&&(a=this[n]),t??=l.getPropertyOptions(n),!((t.hasChanged??at)(a,e)||t.useDefault&&t.reflect&&a===this._$Ej?.get(n)&&!this.hasAttribute(l._$Eu(n,t))))return;this.C(n,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,e,{useDefault:t,reflect:i,wrapped:a},l){t&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,l??e??this[n]),a!==!0||l!==void 0)||(this._$AL.has(n)||(this.hasUpdated||t||(e=void 0),this._$AL.set(n,e)),i===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,a]of t){let{wrapped:l}=a,c=this[i];l!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,a,c)}}let n=!1,e=this._$AL;try{n=this.shouldUpdate(e),n?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw n=!1,this._$EM(),t}n&&this._$AE(e)}willUpdate(n){}_$AE(n){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(n){}firstUpdated(n){}};pe.elementStyles=[],pe.shadowRootOptions={mode:"open"},pe[De("elementProperties")]=new Map,pe[De("finalized")]=new Map,is?.({ReactiveElement:pe}),(st.reactiveElementVersions??=[]).push("2.1.2");var It=globalThis,Jt=r=>r,nt=It.trustedTypes,Zt=nt?nt.createPolicy("lit-html",{createHTML:r=>r}):void 0,ai="$lit$",ve=`lit$${Math.random().toFixed(9).slice(2)}$`,ni="?"+ve,ss=`<${ni}>`,we=document,Ne=()=>we.createComment(""),Fe=r=>r===null||typeof r!="object"&&typeof r!="function",Lt=Array.isArray,as=r=>Lt(r)||typeof r?.[Symbol.iterator]=="function",St=`[ 	
\f\r]`,qe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Xt=/-->/g,ei=/>/g,xe=RegExp(`>|${St}(?:([^\\s"'>=/]+)(${St}*=${St}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ti=/'/g,ii=/"/g,ri=/^(?:script|style|textarea|title)$/i,Pt=r=>(n,...e)=>({_$litType$:r,strings:n,values:e}),o=Pt(1),D=Pt(2),xa=Pt(3),he=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),si=new WeakMap,$e=we.createTreeWalker(we,129);function oi(r,n){if(!Lt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Zt!==void 0?Zt.createHTML(n):n}var ns=(r,n)=>{let e=r.length-1,t=[],i,a=n===2?"<svg>":n===3?"<math>":"",l=qe;for(let c=0;c<e;c++){let h=r[c],u,g,m=-1,v=0;for(;v<h.length&&(l.lastIndex=v,g=l.exec(h),g!==null);)v=l.lastIndex,l===qe?g[1]==="!--"?l=Xt:g[1]!==void 0?l=ei:g[2]!==void 0?(ri.test(g[2])&&(i=RegExp("</"+g[2],"g")),l=xe):g[3]!==void 0&&(l=xe):l===xe?g[0]===">"?(l=i??qe,m=-1):g[1]===void 0?m=-2:(m=l.lastIndex-g[2].length,u=g[1],l=g[3]===void 0?xe:g[3]==='"'?ii:ti):l===ii||l===ti?l=xe:l===Xt||l===ei?l=qe:(l=xe,i=void 0);let f=l===xe&&r[c+1].startsWith("/>")?" ":"";a+=l===qe?h+ss:m>=0?(t.push(u),h.slice(0,m)+ai+h.slice(m)+ve+f):h+ve+(m===-2?c:f)}return[oi(r,a+(r[e]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),t]},Ue=class r{constructor({strings:n,_$litType$:e},t){let i;this.parts=[];let a=0,l=0,c=n.length-1,h=this.parts,[u,g]=ns(n,e);if(this.el=r.createElement(u,t),$e.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=$e.nextNode())!==null&&h.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let m of i.getAttributeNames())if(m.endsWith(ai)){let v=g[l++],f=i.getAttribute(m).split(ve),$=/([.?@])?(.*)/.exec(v);h.push({type:1,index:a,name:$[2],strings:f,ctor:$[1]==="."?jt:$[1]==="?"?Ct:$[1]==="@"?Mt:Ce}),i.removeAttribute(m)}else m.startsWith(ve)&&(h.push({type:6,index:a}),i.removeAttribute(m));if(ri.test(i.tagName)){let m=i.textContent.split(ve),v=m.length-1;if(v>0){i.textContent=nt?nt.emptyScript:"";for(let f=0;f<v;f++)i.append(m[f],Ne()),$e.nextNode(),h.push({type:2,index:++a});i.append(m[v],Ne())}}}else if(i.nodeType===8)if(i.data===ni)h.push({type:2,index:a});else{let m=-1;for(;(m=i.data.indexOf(ve,m+1))!==-1;)h.push({type:7,index:a}),m+=ve.length-1}a++}}static createElement(n,e){let t=we.createElement("template");return t.innerHTML=n,t}};function je(r,n,e=r,t){if(n===he)return n;let i=t!==void 0?e._$Co?.[t]:e._$Cl,a=Fe(n)?void 0:n._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(n=je(r,i._$AS(r,n.values),i,t)),n}var At=class{constructor(n,e){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:e},parts:t}=this._$AD,i=(n?.creationScope??we).importNode(e,!0);$e.currentNode=i;let a=$e.nextNode(),l=0,c=0,h=t[0];for(;h!==void 0;){if(l===h.index){let u;h.type===2?u=new Be(a,a.nextSibling,this,n):h.type===1?u=new h.ctor(a,h.name,h.strings,this,n):h.type===6&&(u=new Rt(a,this,n)),this._$AV.push(u),h=t[++c]}l!==h?.index&&(a=$e.nextNode(),l++)}return $e.currentNode=we,i}p(n){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(n,t,e),e+=t.strings.length-2):t._$AI(n[e])),e++}},Be=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,e,t,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=n,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,e=this._$AM;return e!==void 0&&n?.nodeType===11&&(n=e.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,e=this){n=je(this,n,e),Fe(n)?n===p||n==null||n===""?(this._$AH!==p&&this._$AR(),this._$AH=p):n!==this._$AH&&n!==he&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):as(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==p&&Fe(this._$AH)?this._$AA.nextSibling.data=n:this.T(we.createTextNode(n)),this._$AH=n}$(n){let{values:e,_$litType$:t}=n,i=typeof t=="number"?this._$AC(n):(t.el===void 0&&(t.el=Ue.createElement(oi(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let a=new At(i,this),l=a.u(this.options);a.p(e),this.T(l),this._$AH=a}}_$AC(n){let e=si.get(n.strings);return e===void 0&&si.set(n.strings,e=new Ue(n)),e}k(n){Lt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let a of n)i===e.length?e.push(t=new r(this.O(Ne()),this.O(Ne()),this,this.options)):t=e[i],t._$AI(a),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(n=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);n!==this._$AB;){let t=Jt(n).nextSibling;Jt(n).remove(),n=t}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Ce=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,e,t,i,a){this.type=1,this._$AH=p,this._$AN=void 0,this.element=n,this.name=e,this._$AM=i,this.options=a,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(n,e=this,t,i){let a=this.strings,l=!1;if(a===void 0)n=je(this,n,e,0),l=!Fe(n)||n!==this._$AH&&n!==he,l&&(this._$AH=n);else{let c=n,h,u;for(n=a[0],h=0;h<a.length-1;h++)u=je(this,c[t+h],e,h),u===he&&(u=this._$AH[h]),l||=!Fe(u)||u!==this._$AH[h],u===p?n=p:n!==p&&(n+=(u??"")+a[h+1]),this._$AH[h]=u}l&&!i&&this.j(n)}j(n){n===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},jt=class extends Ce{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===p?void 0:n}},Ct=class extends Ce{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==p)}},Mt=class extends Ce{constructor(n,e,t,i,a){super(n,e,t,i,a),this.type=5}_$AI(n,e=this){if((n=je(this,n,e,0)??p)===he)return;let t=this._$AH,i=n===p&&t!==p||n.capture!==t.capture||n.once!==t.once||n.passive!==t.passive,a=n!==p&&(t===p||i);i&&this.element.removeEventListener(this.name,this,t),a&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Rt=class{constructor(n,e,t){this.element=n,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(n){je(this,n)}};var rs=It.litHtmlPolyfillSupport;rs?.(Ue,Be),(It.litHtmlVersions??=[]).push("3.3.2");var li=(r,n,e)=>{let t=e?.renderBefore??n,i=t._$litPart$;if(i===void 0){let a=e?.renderBefore??null;t._$litPart$=i=new Be(n.insertBefore(Ne(),a),a,void 0,e??{})}return i._$AI(r),i};var zt=globalThis,S=class extends pe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=li(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return he}};S._$litElement$=!0,S.finalized=!0,zt.litElementHydrateSupport?.({LitElement:S});var os=zt.litElementPolyfillSupport;os?.({LitElement:S});(zt.litElementVersions??=[]).push("4.2.2");var ci=r=>(n,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,n)}):customElements.define(r,n)};var ls={attribute:!0,type:String,converter:Oe,reflect:!1,hasChanged:at},cs=(r=ls,n,e)=>{let{kind:t,metadata:i}=e,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),t==="setter"&&((r=Object.create(r)).wrapped=!0),a.set(e.name,r),t==="accessor"){let{name:l}=e;return{set(c){let h=n.get.call(this);n.set.call(this,c),this.requestUpdate(l,h,r,!0,c)},init(c){return c!==void 0&&this.C(l,void 0,r,c),c}}}if(t==="setter"){let{name:l}=e;return function(c){let h=this[l];n.call(this,c),this.requestUpdate(l,h,r,!0,c)}}throw Error("Unsupported decorator location: "+t)};function y(r){return(n,e)=>typeof e=="object"?cs(r,n,e):((t,i,a)=>{let l=i.hasOwnProperty(a);return i.constructor.createProperty(a,t),l?Object.getOwnPropertyDescriptor(i,a):void 0})(r,n,e)}function _(r){return y({...r,state:!0,attribute:!1})}var di={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",ok:"OK",all:"All",new_object:"+ New Object",templates_from:"From template",templates_title:"Start from a template",templates_task_count:"{n} tasks",template_created:"Created from template",onboard_hint:"Add your first object to start tracking maintenance.",edit:"Edit",duplicate:"Duplicate",task_duplicated:"Task duplicated",object_duplicated:"Object duplicated",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",missed:"Missed",reset:"Reset",snooze:"Snooze",snoozed:"Snoozed",cancel:"Cancel",bulk_select:"Select",bulk_select_all:"Select all",bulk_n_selected:"{n} selected",bulk_completed:"{n} tasks completed",bulk_archived:"{n} tasks archived",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",runtime_hours:"Target runtime (hours)",target_value:"Target value",baseline:"Baseline",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",recurrence_last_day:"Last day of the month",recurrence_business_day:"Business days only (roll back from weekend)",recurrence_offset:"Offset (days, \xB1)",recurrence_offset_help:"Shift the date by \xB1N days, e.g. -2 = two days before.",last_day_month:"Last day of month",last_business_day_month:"Last business day",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",reading:"Reading",custom:"Custom",history:"History",cost:"Cost",report_button:"Report",report_title:"Maintenance report",report_generated:"Generated",report_times_done:"Done",report_total_cost:"Total cost",report_every:"every {n} {unit}",report_notes:"Notes",report_col_type:"Type",report_col_status:"Status",report_col_schedule:"Schedule",duration:"Duration",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_optional:"Due at time (optional, HH:MM)",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",confirm_delete_object:"Delete this object and all its tasks?",confirm_delete_task:"Delete this task?",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",priority:"Priority",labels:"Labels",labels_placeholder:"e.g. safety, seasonal, tenant-visible",labels_help:"Comma-separated tags for filtering and reporting.",priority_low:"Low",priority_normal:"Normal",priority_high:"High",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",earliest_completion_days:"Earliest completion (days before due)",earliest_completion_days_help:"Leave empty to allow completing any time. 0 = only on/after the due date.",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",tasks_lower:"tasks",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",for_at_least_minutes:"For at least (minutes)",safety_interval_days:"Safety interval (days, optional)",safety_interval:"Safety interval (optional)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",shared_with:"Shared with (rotation)",shared_with_help:"Pick multiple people to share this task; the responsible person rotates on each completion.",rotation_strategy:"Rotation",rotation_none:"No rotation",rotation_round_robin:"Round-robin",rotation_least_completed:"Least completed",rotation_random:"Random",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_window_7:"7 days",cal_window_14:"14 days",cal_window_30:"30 days",cal_window_365:"1 year",cal_every_n_days:"every {n} days",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",hide_outliers:"Hide outliers (sensor glitches)",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",qr_print:"Print",qr_download:"Download SVG",qr_action:"Action on scan",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",analysis:"Analysis",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",no_advanced_features:"No advanced features enabled",no_advanced_features_hint:"Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",analysis_not_enough_data:"Not enough data for analysis yet.",analysis_not_enough_data_hint:"Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",analysis_manual_task_hint:"Manual tasks without an interval do not generate analysis data.",completions:"completions",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",compound:"Compound (multiple conditions)",compound_logic_and:"AND \u2014 all conditions must trigger",compound_logic_or:"OR \u2014 any condition triggers",compound_help:"Combine several sensor conditions into one trigger.",compound_no_conditions:"No conditions yet \u2014 add at least one.",compound_add_condition:"Add condition",compound_condition:"Condition",compound_remove_condition:"Remove condition",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",tab_today:"Today",palette_placeholder:"Search objects and tasks\u2026",palette_no_results:"No matches",palette_hint:"\u2191\u2193 to navigate \xB7 Enter to open \xB7 Esc to close",today_all_caught_up:"All caught up! Nothing due this week.",today_overdue:"Overdue",today_due_today:"Due today",today_this_week:"This week",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_predictions:"Sensor Predictions",feat_predictions_desc:"Predict trigger dates from sensor degradation",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_reminder_leads:"Extra reminders (days before due)",settings_reminder_leads_hint:"Comma-separated lead times, e.g. 14, 3, 0 \u2014 one extra reminder fires on each matching day. Empty = off.",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_weekly_digest:"Weekly digest",settings_weekly_digest_hint:"A single summary notification on Monday morning when tasks are due.",settings_warranty_reminder:"Warranty expiry reminder",settings_warranty_reminder_days:"Days before expiry",settings_warranty_reminder_hint:"Notify once when an object's warranty is this many days from expiring.",settings_snooze_hours:"Snooze duration (hours)",settings_budget:"Budget",settings_currency:"Currency",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_import_csv:"Import CSV",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",settings_export_selection:"Limit to selected objects (optional)",settings_docs_archive:"Documents archive (with files)",settings_docs_archive_hint:"The JSON/YAML/CSV exports carry settings only. This ZIP includes the uploaded file contents so a restore is complete.",settings_docs_export_btn:"Download documents ZIP",settings_docs_import_btn:"Restore documents ZIP",settings_docs_import_success:"Restored: {blobs} files, {docs} documents",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",filter_label:"Filter",user_label:"User",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",group_delete_confirm:'Delete group "{name}"?',groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else sees only Complete and Skip.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc:"Per-task HA action on complete + quick-complete QR with pre-set values.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_service:"Service",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",quick_complete_defaults_title:"Quick-complete defaults (for QR scans, optional)",quick_complete_defaults_desc:"Pre-set values for quick-complete QR scans. Without these, the QR opens the complete dialog.",quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026",archive:"Archive",undo:"Undo",task_archived:"Task archived",object_archived:"Object archived",unarchive:"Unarchive",archived:"Archived",show_archived:"Show archived",hide_archived:"Hide archived",confirm_archive_object:"Archive this object and its tasks? They keep their history and can be unarchived later.",settings_archive:"Archive & Retention",settings_archive_desc:"Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",settings_archive_oneoff_days:"Auto-archive completed one-off tasks after (days, 0 = off)",settings_delete_archived_oneoff_days:"Auto-delete archived one-off tasks after (days, 0 = never)",archive_object:"Archive object",unarchive_object:"Unarchive object",documents:"Documents",documents_empty:"No documents yet.",doc_upload:"Upload file",doc_uploading:"Uploading\u2026",doc_add_link:"Add link",doc_link_url:"URL (https://\u2026)",doc_link_title:"Title (optional)",doc_open:"Open",doc_delete_confirm:'Delete "{name}"?',doc_too_large:"File is too large (max 25 MB).",doc_upload_failed:"Upload failed.",completion_photo_optional:"Completion photo (optional)",add_photo:"Add photo",uploading:"Uploading\u2026",remove:"Remove",doc_deduped:"Already stored elsewhere \u2014 shared, no extra space used.",doc_dup_in_object:"This file is already attached to this object.",doc_link_invalid:"Only http/https links are allowed.",doc_cat_manual:"Manual",doc_cat_warranty:"Warranty",doc_cat_invoice:"Invoice",doc_cat_spare_parts:"Spare parts",doc_cat_photo:"Photo",doc_cat_other:"Other",doc_link_badge:"Link",doc_storage_title:"Document storage",doc_storage_saved:"Saved via deduplication",doc_storage_refresh:"Refresh",doc_download:"Download",doc_close:"Close",doc_camera:"Take photo",doc_drop_hint:"Drop files here",doc_task_none:"No documents linked to this task.",doc_link_existing:"Link a document\u2026",doc_attach:"Link",doc_unlink:"Unlink",doc_page:"Page",chart_range_7d:"7d",chart_range_30d:"30d",chart_range_90d:"90d",chart_range_1y:"1y",chart_since_service:"since last service",chart_no_stats:"No long-term statistics for this entity \u2014 showing maintenance-event values only",auto_complete_on_recovery:"Auto-complete when the sensor recovers",auto_complete_on_recovery_help:"Records a completion (sets last performed) when the trigger clears itself \u2014 e.g. salt refilled, filter replaced.",doc_search:"Search documents\u2026",doc_search_none:"No matching documents",link_device_optional:"Link to existing device (optional)",parent_object_optional:"Parent object (optional)",parent_none:"(No parent)",paused:"Paused",pause_object:"Pause",resume_object:"Resume",pause_until_prompt:"Freeze this object's schedules \u2014 nothing becomes due and nothing notifies until it is resumed. Optionally set an auto-resume date.",pause_until_label:"Resume on (optional)",object_paused:"Object paused",object_resumed:"Object resumed \u2014 schedules restarted",object_paused_badge:"Paused",paused_until_label:"until",replace_object:"Replace\u2026",replace_object_prompt:"Retire this object and create a successor. History and costs stay archived on the old one; tasks and documents carry over to the new one, counters start fresh.",replace_name_label:"Successor name",object_replaced:"Object replaced \u2014 successor created",reading_unit_label:"Reading unit (e.g. kWh, m\xB3)",reading_unit_help:"Shown next to the recorded value when completing this task.",reading_value_label:"Reading value",reading_label:"Reading",settings_templates_label:"Template gallery",settings_templates_hint:`Untick templates you'll never need \u2014 they disappear from the "From template" pickers (panel and config flow). Nothing else changes; you can re-enable them any time.`,worksheet:"Work sheet",worksheet_scan_view:"Scan to open the task",worksheet_scan_complete:"Scan to complete",worksheet_manual_excerpt:"Manual excerpt",worksheet_pages:"pages",worksheet_printed:"Printed",worksheet_never:"Never",card_all_caught_up:"All caught up \u2014 nothing needs attention",postpone:"Postpone",postpone_date_prompt:"Postpone this occurrence to which date?",postpone_date_label:"New due date",postponed:"Postponed",postponed_to:"Postponed to",season_window_label:"Seasonal window (months)",season_window_hint:"Only due in the selected months; off-season dates roll to the next active month. None = all year.",series_end_label:"Ends",series_end_never:"Never (repeats indefinitely)",series_end_after_count:"After a number of times",series_end_until:"On a date",series_end_count_label:"Number of times",series_end_until_label:"End date",parts_section:"Parts & consumables",part_add:"Add part",part_name:"Name",part_vendor:"Manufacturer",part_storage_location:"Storage location",part_product_url:"Product URL",part_unit:"Unit",part_cost:"Unit price",part_stock:"Stock",part_reorder_threshold:"Reorder at",part_restock_quantity:"Restock quantity",part_auto_buy:"Auto-create buy task when low",part_restock:"Adjust stock",restock_quantity_label:"Quantity bought",consumes_parts_label:"Consumes parts",parts_load_failed:"Couldn't load this object's parts \u2014 the consumes-parts options are unavailable right now.",adopt_problem_button:"Adopt problem sensors",adopt_problem_title:"Adopt problem sensors",adopt_problem_hint:"Turn HA problem sensors (printer errors, filter warnings, low battery) into maintenance tasks that trigger while the problem is active and clear themselves when it resolves.",adopt_problem_none:"No problem sensors found that aren't already tracked.",adopt_problem_active:"active",adopt_problem_ok:"ok",adopt_problem_new_object:"(new)",adopt_problem_adopt:"Adopt selected",adopt_problem_done:"Adopted {tasks} problem sensor(s)"};var We={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"var(--deep-orange-color, #ff5722)",archived:"var(--disabled-color, #9e9e9e)",paused:"var(--info-color, #2196f3)"},Ve={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",archived:"mdi:archive-outline",paused:"mdi:pause-circle-outline",completed:"mdi:check-circle",skipped:"mdi:skip-next",missed:"mdi:calendar-remove",reset:"mdi:refresh"};var Ee="\u20AC",Ht="en",hi=(()=>{let r=window;return r.__msLocales||(r.__msLocales={store:{},inflight:{}}),r.__msLocales})(),ke=hi.store;ke.en||(ke.en=di);var ps=new Set(["de","nl","fr","it","es","pt","ru","uk","pl","cs","sv","zh","da","fi","nb","ja","hi"]),hs="/maintenance_supporter_locales",Ke=hi.inflight;function Dt(r){return(r||Ht).substring(0,2).toLowerCase()}function s(r,n){let e=Dt(n);return ke[e]?.[r]??ke.en[r]??r}function lt(r){let n=Dt(r);return n===Ht||n in ke}function Q(r){let n=Dt(r);return n===Ht||n in ke||!ps.has(n)?Promise.resolve():(n in Ke||(Ke[n]=fetch(`${hs}/${n}.json`).then(e=>e.ok?e.json():null).then(e=>{e?ke[n]=e:delete Ke[n]}).catch(()=>{delete Ke[n]})),Ke[n])}function ui(r){let n=(r||"en").substring(0,2).toLowerCase();return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN",da:"da-DK",fi:"fi-FI",nb:"nb-NO",ja:"ja-JP",hi:"hi-IN"}[n]??"en-US"}function W(r,n){if(!r)return"\u2014";try{let e=r.includes("T")?r:r+"T00:00:00";return new Date(e).toLocaleDateString(ui(n),{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return r}}function ct(r,n){if(!r)return"\u2014";try{let e=ui(n),t=new Date(r);return t.toLocaleDateString(e,{day:"2-digit",month:"2-digit",year:"numeric"})+" "+t.toLocaleTimeString(e,{hour:"2-digit",minute:"2-digit"})}catch{return r}}function Me(r,n){if(r==null)return"\u2014";let e=n||"en";return r<0?`${Math.abs(r)} ${s("d_overdue",e)}`:r===0?s("today",e):`${r} ${s(r===1?"day":"days",e)}`}function pi(r,n,e){return r==null?"\u2014":`${r} ${s("unit_"+(n||"days"),e)}`}function ot(r,n,e="long"){let t=(n||"en").substring(0,2);return new Date(Date.UTC(2024,0,1+r)).toLocaleDateString(t,{weekday:e,timeZone:"UTC"})}function Ye(r,n){let e=r.schedule,t=e?.offset?` ${e.offset>0?"+":"\u2212"}${Math.abs(e.offset)}d`:"";switch(e?.kind){case"weekdays":return((e.weekdays||[]).map(i=>ot(i,n,"short")).join(" & ")||"\u2014")+t;case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?s("ord_last",n):s("ord_"+e.nth,n)} ${ot(e.weekday,n,"long")}${t}`;case"day_of_month":return e.day==null?"\u2014":(e.day===-1?s(e.business?"last_business_day_month":"last_day_month",n):`${s("day_word",n)} ${e.day}`)+t;case"one_time":return r.due_date?W(r.due_date,n):s("one_time",n);case"manual":return s("manual",n);case"interval":return pi(e.every,e.unit,n)}return r.schedule_type==="one_time"?r.due_date?W(r.due_date,n):s("one_time",n):r.schedule_type==="manual"?s("manual",n):r.schedule_type==="sensor_based"?s("sensor_based",n):r.interval_days!=null?pi(r.interval_days,r.interval_unit,n):"\u2014"}function Te(r,n){r.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:n},bubbles:!0,composed:!0}))}var dt=j`
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
`,pt=j`
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

  /* Trigger progress bar (overview rows). width:100% — the due-cell doesn't
     stretch its children (align-items: flex-end), so without it the bar
     shrinks to its label and reads shorter than the days-bar in other rows. */
  .trigger-progress {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
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
`;var V={overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view"};var us={days:1,weeks:7,months:30.4368,years:365.25};function Ot(r,n){return!r||r<=0?0:r*(us[n||"days"]??1)}function ht(r,n,e){let t=Ot(r,e);if(t<=0||n==null)return{pct:0,overflow:!1};let i=(t-n)/t*100;return{pct:Math.max(0,Math.min(100,i)),overflow:i>100}}function z(r){return String(r??"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}function _i(r,n,e,t,i,a){let l=[[e.manufacturer,r.manufacturer],[e.model,r.model],[e.serial,r.serial_number],[e.installed,r.installation_date?t(r.installation_date):null],[e.warranty,r.warranty_expiry?t(r.warranty_expiry):null]].filter(([,u])=>!!u),c=n.map(u=>{let g=e.scheduleLabel(u);return`<tr>
      <td>${z(u.name)}</td>
      <td>${z(e.typeLabel(u.type))}</td>
      <td>${z(e.statusLabel(u.status))}</td>
      <td>${z(g)}</td>
      <td>${z(u.last_performed?t(u.last_performed):e.none)}</td>
      <td>${z(u.next_due?t(u.next_due):e.none)}</td>
      <td class="num">${u.times_performed??0}</td>
      <td class="num">${(u.total_cost??0).toFixed(2)} ${z(i)}</td>
    </tr>`}).join(""),h=n.reduce((u,g)=>u+(g.total_cost??0),0);return`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${z(e.title)} \u2014 ${z(r.name)}</title>
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
  <h1>${z(r.name)}</h1>
  <p class="sub">${z(e.title)} \xB7 ${z(e.generated)}: ${z(t(a))}</p>
  ${l.length?`<div class="meta">${l.map(([u,g])=>`<div><div class="k">${z(u)}</div>${z(g)}</div>`).join("")}</div>`:""}
  <h2>${z(e.tasksHeading)} (${n.length})</h2>
  <table>
    <thead><tr>
      <th>${z(e.colTask)}</th><th>${z(e.colType)}</th><th>${z(e.colStatus)}</th>
      <th>${z(e.colSchedule)}</th><th>${z(e.colLastDone)}</th><th>${z(e.colNextDue)}</th>
      <th class="num">${z(e.colTimes)}</th><th class="num">${z(e.colCost)}</th>
    </tr></thead>
    <tbody>${c||`<tr><td colspan="8">${z(e.none)}</td></tr>`}</tbody>
    <tfoot><tr><td colspan="7">${z(e.totalCost)}</td><td class="num">${h.toFixed(2)} ${z(i)}</td></tr></tfoot>
  </table>
  ${r.notes?`<div class="notes"><strong>${z(e.notes)}:</strong>
${z(r.notes)}</div>`:""}
</body></html>`}function qt(r,n=new Date){if(!r)return{kind:"none",days:null,date:null};let e=new Date(`${r}T00:00:00`);if(isNaN(e.getTime()))return{kind:"none",days:null,date:null};let t=Date.UTC(n.getFullYear(),n.getMonth(),n.getDate()),i=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate()),a=Math.round((i-t)/864e5);return a<0?{kind:"expired",days:a,date:r}:a<=60?{kind:"expiring",days:a,date:r}:{kind:"valid",days:a,date:r}}var Re=[{key:"name",labelKey:"name",required:!0},{key:"manufacturer",labelKey:"manufacturer"},{key:"model",labelKey:"model"},{key:"serial_number",labelKey:"serial_number_label"},{key:"installation_date",labelKey:"installed"},{key:"warranty_expiry",labelKey:"warranty"},{key:"area_id",labelKey:"area"},{key:"documentation_url",labelKey:"documentation_url_label"},{key:"notes",labelKey:"object_notes_label"},{key:"task_count",labelKey:"tasks"},{key:"actions",labelKey:"actions"}],_s=Re.map(r=>r.key),ut=["name","manufacturer","model","serial_number","installation_date","warranty_expiry","area_id","task_count","actions"];function Ge(r){if(!Array.isArray(r))return[...ut];let n=new Set,e=[];for(let t of r)typeof t=="string"&&_s.includes(t)&&!n.has(t)&&(n.add(t),e.push(t));return e.length?(e.includes("name")||e.unshift("name"),e):[...ut]}function _t(r,n,e){let t=new Blob([r],{type:e}),i=URL.createObjectURL(t),a=document.createElement("a");a.href=i,a.download=n,a.target="_blank",a.rel="noopener",a.style.display="none",document.body.appendChild(a),a.dispatchEvent(new MouseEvent("click")),document.body.removeChild(a),setTimeout(()=>URL.revokeObjectURL(i),6e4)}function gt(r,n){let e=document.createElement("a");e.href=r,e.download=n,e.target="_blank",e.rel="noopener",e.style.display="none",document.body.appendChild(e),e.dispatchEvent(new MouseEvent("click")),document.body.removeChild(e)}var O=r=>String(r??"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n]);function gi(r,n,e,t,i,a,l,c,h,u=[]){let g=[[e.object,O(n)],[e.type,O(e.typeLabel(r.type))],[e.interval,O(i(r))],[e.nextDue,r.next_due?O(t(r.next_due)):"\u2014"],[e.lastDone,r.last_performed?O(t(r.last_performed)):O(e.never)]];r.priority&&r.priority!=="normal"&&g.push([e.priority,O(r.priority)]);let m=(r.checklist||[]).map(f=>`<li><span class="box"></span>${O(f)}</li>`).join(""),v=(f,$)=>f?`<figure class="qr"><img src="${f}" alt="" /><figcaption>${O($)}</figcaption></figure>`:"";return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${O(r.name)} \u2014 ${O(e.title)}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font: 13px/1.45 -apple-system, "Segoe UI", Roboto, sans-serif; color: #111; margin: 0; }
  header { display: flex; justify-content: space-between; align-items: flex-start;
           border-bottom: 3px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
  h1 { font-size: 22px; margin: 0 0 2px; }
  .obj { font-size: 14px; color: #444; }
  .qr-row { display: flex; gap: 18px; }
  .qr { margin: 0; text-align: center; }
  .qr img { width: 88px; height: 88px; display: block; }
  .qr figcaption { font-size: 9px; color: #555; max-width: 96px; }
  table.meta { border-collapse: collapse; margin-bottom: 12px; }
  table.meta td { padding: 2px 14px 2px 0; vertical-align: top; }
  table.meta td:first-child { color: #555; white-space: nowrap; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em;
       border-bottom: 1px solid #bbb; padding-bottom: 2px; margin: 14px 0 6px; }
  ul.check { list-style: none; padding: 0; margin: 0; }
  ul.check li { display: flex; align-items: flex-start; gap: 8px; padding: 4px 0; font-size: 14px; }
  .box { width: 14px; height: 14px; border: 1.6px solid #111; border-radius: 2px;
         flex: 0 0 auto; margin-top: 2px; }
  .notes { white-space: pre-wrap; }
  .excerpt a { color: #0b57d0; word-break: break-all; }
  .excerpt-pages { display: flex; flex-wrap: wrap; gap: 3mm; margin-top: 4mm; }
  .excerpt-pages canvas { width: calc(50% - 2mm); height: auto;
    border: 0.4px solid #ccc; break-inside: avoid; }
  footer { position: fixed; bottom: 0; left: 0; right: 0; font-size: 9px; color: #888;
           border-top: 1px solid #ddd; padding-top: 3px; }
  @media screen { body { max-width: 800px; margin: 24px auto; padding: 0 16px; } }
</style></head>
<body>
  <header>
    <div>
      <h1>${O(r.name)}</h1>
      <div class="obj">${O(n)}</div>
    </div>
    <div class="qr-row">
      ${v(a,e.scanView)}
      ${v(l,e.scanComplete)}
    </div>
  </header>
  <table class="meta">
    ${g.map(([f,$])=>`<tr><td>${O(f)}</td><td>${$}</td></tr>`).join("")}
  </table>
  ${m?`<h2>${O(e.checklist)}</h2><ul class="check">${m}</ul>`:""}
  ${u.length?`<h2>${O(e.parts)}</h2><ul class="check">${u.map(f=>`<li><span class="box"></span>${O(f)}</li>`).join("")}</ul>`:""}
  ${r.notes?`<h2>${O(e.notes)}</h2><div class="notes">${O(r.notes)}</div>`:""}
  ${c?`<h2>${O(e.manualExcerpt)}</h2>
    <div class="excerpt">${O(c.title)} \u2014 ${O(e.pages)} ${c.startPage}\u2013${c.endPage}:
      <a href="${O(c.url)}" target="_blank" rel="noopener">PDF</a>
    </div>
    <div id="excerpt-pages" class="excerpt-pages"></div>
    ${c.vendorBase?`<script type="module">
      // Render the excerpt pages inline (downscaled, two per row) so the
      // whole work sheet prints as ONE document. The link above stays as
      // the fallback if pdf.js or the fetch fails.
      try {
        const pdfjs = await import(${JSON.stringify(c.vendorBase+"/pdf.min.mjs")});
        pdfjs.GlobalWorkerOptions.workerSrc = ${JSON.stringify(c.vendorBase+"/pdf.worker.min.mjs")};
        const doc = await pdfjs.getDocument({ url: ${JSON.stringify(c.url)} }).promise;
        const host = document.getElementById("excerpt-pages");
        for (let n = 1; n <= doc.numPages; n++) {
          const page = await doc.getPage(n);
          const viewport = page.getViewport({ scale: 1.4 }); // crisp at ~50% print width
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width; canvas.height = viewport.height;
          await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
          host.appendChild(canvas);
        }
      } catch (e) { console.warn("excerpt inline render failed", e); }
    <\/script>`:""}`:""}
  <footer>${O(n)} \xB7 ${O(r.name)} \xB7 ${O(e.printedOn)} ${O(h.slice(0,10))}</footer>
</body></html>`}var gs={name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",group_name:"name",group_description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_for_minutes:"trigger_for_minutes"};function ms(r,n){let e=gs[r];if(!e)return r;let t=s(e,n);return t&&t!==e?t:r}function vs(r){let e=r.match(/data\['([^']+)'\]/)?.[1],t;return(t=r.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=r.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=r.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=r.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(r)?{field:e,rule:"required"}:(t=r.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(r)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(r)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function M(r,n,e){if(e=e??s("action_error",n),typeof r=="string")return r;if(typeof r!="object"||r===null)return e;let t=r,i=t.message||t.error?.message||"";if(!i)return e;let a=vs(i),l=a.field?ms(a.field,n):"",c=h=>s(h,n).replace("{field}",l).replace("{n}",a.param??"");switch(a.rule){case"too_long":return c("err_too_long");case"too_short":return c("err_too_short");case"value_too_high":return c("err_value_too_high");case"value_too_low":return c("err_value_too_low");case"required":return c("err_required");case"wrong_type":return c("err_wrong_type").replace("{type}",a.param??"");case"invalid_choice":return c("err_invalid_choice");case"invalid_value":return c("err_invalid_value");default:return i||e}}var mi=j`
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

  /* Virtualized task table (large installs): only the scroll window of rows
     is in the DOM. The spacers span all columns and carry the off-window
     height so the scrollbar stays honest. The sizer row is invisible and
     zero-height but its badge cell still participates in subgrid track
     sizing — pinning the content-sized badge column to the widest badge set
     across ALL rows, so columns can't jitter while scrolling. */
  .virt-spacer { grid-column: 1 / -1; }
  .task-row.virt-sizer {
    height: 0;
    min-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    border: none;
    overflow: hidden;
    visibility: hidden;
    pointer-events: none;
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

  /* Custom elements default to display:inline; the task-detail component
     renders light-DOM and must behave like the block it wraps. */
  maintenance-task-detail-view { display: block; }

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
  /* v2.20 (N3): paused marker on object cards + the detail meta line. */
  .paused-badge {
    display: inline-flex; align-items: center; vertical-align: middle;
    margin-left: 8px; color: var(--info-color, #2196f3);
  }
  .paused-badge ha-icon { --mdc-icon-size: 16px; }
  .paused-meta {
    display: flex; align-items: center; gap: 6px;
    color: var(--info-color, #2196f3); font-weight: 500;
  }
  .paused-meta ha-icon { --mdc-icon-size: 16px; }
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
  /* Inside .cell-badges the parent's gap does the spacing — the badges' own
     margin-left (meant for inline use, e.g. the detail header) would double
     it and push the priority chevron out of line with the other badges. */
  .cell-badges .nfc-badge,
  .cell-badges .priority-badge {
    margin-left: 0;
  }
  /* Right-anchor the auxiliary badges (disabled / NFC / priority chevron) to
     the END of the shared badges track. Status pills vary in width per
     status AND language (min-width 70px only clamps the short ones — "Due
     Soon"/"Overdue" overflow it), so left-flowing extras landed at a
     different x in every row: the low-priority chevron, which typically sits
     next to the short OK pill, fell visibly out of the column formed by the
     other rows' chevrons. Anchoring the extras group to the track edge gives
     ONE clean column in every language; the virt-sizer row keeps the track
     width stable. In the narrow per-row grids the badges area is
     content-sized (no free space), so the auto margin is inert there. */
  .cell-badges > .status-badge + * {
    margin-left: auto;
  }
  .priority-badge ha-icon {
    --mdc-icon-size: 16px;
  }
  .postponed-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 8px;
    margin-left: 8px;
    background: var(--secondary-background-color, #e8e8e8);
    color: var(--secondary-text-color);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
  }
  .postponed-badge ha-icon { --mdc-icon-size: 13px; }
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
`;var mt=class{constructor(n){this._cache=new Map;this._pending=new Map;this._hass=n}updateHass(n){this._hass=n}async getDetailStats(n,e,t=30){return this._getStats(n,t<=35?"hour":"day",t,e)}async getMiniStats(n,e){return this._getStats(n,"day",14,e)}async getBatchMiniStats(n){let e=new Map,t=[];for(let h of n){let u=`${h.entityId}:day:14`,g=this._cache.get(u);g&&Date.now()-g.fetchedAt<3e5?e.set(h.entityId,g.points):t.push(h)}if(t.length===0)return e;let i=t.filter(h=>h.isCounter).map(h=>h.entityId),a=t.filter(h=>!h.isCounter).map(h=>h.entityId),l=new Date(Date.now()-336*60*60*1e3).toISOString(),c=[];return i.length>0&&c.push(this._fetchBatch(i,"day",l,["state","sum","change"],!0,e)),a.length>0&&c.push(this._fetchBatch(a,"day",l,["mean","min","max"],!1,e)),await Promise.all(c),e}clearCache(){this._cache.clear(),this._pending.clear()}async _getStats(n,e,t,i){let a=`${n}:${e}:${t}`,l=this._cache.get(a);if(l&&Date.now()-l.fetchedAt<3e5)return l.points;if(this._pending.has(a))return this._pending.get(a);let c=this._fetchAndNormalize(n,e,t,i,a);this._pending.set(a,c);try{return await c}finally{this._pending.delete(a)}}async _fetchAndNormalize(n,e,t,i,a){let l=new Date(Date.now()-t*24*60*60*1e3).toISOString(),c=i?["state","sum","change"]:["mean","min","max"];try{let u=(await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:l,statistic_ids:[n],period:e,types:c}))[n]||[],g=this._normalizeRows(u,i);return this._cache.set(a,{entityId:n,fetchedAt:Date.now(),period:e,points:g}),g}catch(h){return console.warn(`[maintenance-supporter] Failed to fetch statistics for ${n}:`,h),[]}}async _fetchBatch(n,e,t,i,a,l){try{let c=await this._hass.connection.sendMessagePromise({type:"recorder/statistics_during_period",start_time:t,statistic_ids:n,period:e,types:i});for(let h of n){let u=c[h]||[],g=this._normalizeRows(u,a);l.set(h,g),this._cache.set(`${h}:${e}:14`,{entityId:h,fetchedAt:Date.now(),period:e,points:g})}}catch(c){console.warn("[maintenance-supporter] Batch statistics fetch failed:",c)}}_normalizeRows(n,e){let t=[];for(let i of n){let a=null;if(e?a=i.state??null:a=i.mean??null,a===null)continue;let l={ts:i.start,val:a};e||(i.min!=null&&(l.min=i.min),i.max!=null&&(l.max=i.max)),t.push(l)}return t.sort((i,a)=>i.ts-a.ts),t}};var be=class{constructor(n){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=n}updateHass(n){this.hass=n}async getUsers(n=!1){let e=Date.now();if(!n&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(n,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:n,task_id:e,user_id:t})}async getTasksByUser(n){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:n})).tasks}getUserName(n){return!n||!this.usersCache?null:this.usersCache.find(t=>t.id===n)?.name||null}getUser(n){return!n||!this.usersCache?null:this.usersCache.find(e=>e.id===n)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(n){return n?n===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}};var Y=class extends S{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){return o`
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
    `}};Y.styles=j`
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
  `,d([y()],Y.prototype,"label",2),d([y()],Y.prototype,"value",2),d([y()],Y.prototype,"placeholder",2),d([y()],Y.prototype,"type",2),d([y({type:Boolean})],Y.prototype,"required",2),d([y({type:Boolean})],Y.prototype,"disabled",2),d([y()],Y.prototype,"step",2),d([y()],Y.prototype,"min",2),d([y()],Y.prototype,"max",2),d([y()],Y.prototype,"pattern",2),d([y()],Y.prototype,"helper",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",Y);var F=class extends S{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._entryId=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._haDeviceId=t.ha_device_id||"",this._parentEntryId=t.parent_entry_id||"",this._error="",this._open=!0}async _save(){if(!this._loading&&this._name.trim()){this._loading=!0,this._error="";try{this._entryId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/update",entry_id:this._entryId,name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/create",name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null}),this._open=!1,this.dispatchEvent(new CustomEvent("object-saved"))}catch(e){this._error=M(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_parentChoices(){return(this.objects||[]).filter(e=>e.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return o``;let e=this._lang,t=this._entryId?s("edit_object",e):s("new_object",e);return o`
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
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>s("link_device_optional",e)}
            @value-changed=${i=>this._haDeviceId=i.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?o`<label class="textarea-field">
                <span class="textarea-label">${s("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${i=>this._parentEntryId=i.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${s("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(i=>o`<option
                      value=${i.entry_id}
                      ?selected=${this._parentEntryId===i.entry_id}
                    >${i.object.name}</option>`)}
                </select>
              </label>`:p}
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
    `}};F.styles=j`
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
  `,d([y({attribute:!1})],F.prototype,"hass",2),d([y({attribute:!1})],F.prototype,"objects",2),d([_()],F.prototype,"_open",2),d([_()],F.prototype,"_loading",2),d([_()],F.prototype,"_error",2),d([_()],F.prototype,"_name",2),d([_()],F.prototype,"_manufacturer",2),d([_()],F.prototype,"_model",2),d([_()],F.prototype,"_serialNumber",2),d([_()],F.prototype,"_areaId",2),d([_()],F.prototype,"_installationDate",2),d([_()],F.prototype,"_warrantyExpiry",2),d([_()],F.prototype,"_documentationUrl",2),d([_()],F.prototype,"_notes",2),d([_()],F.prototype,"_haDeviceId",2),d([_()],F.prototype,"_parentEntryId",2),d([_()],F.prototype,"_entryId",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",F);function ce(r){let n=r??0;return n<1024?`${n} B`:n<1024*1024?`${(n/1024).toFixed(1)} KB`:`${(n/(1024*1024)).toFixed(1)} MB`}var vt=["manual","warranty","invoice","spare_parts","photo","other"],bs={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"},q=class extends S{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._hint="";this._addingLink=!1;this._linkUrl="";this._linkTitle="";this._category="manual";this._thumbs={};this._lightboxUrl="";this._editingId="";this._editTitle="";this._editCategory="manual";this._dragOver=!1;this._loadedFor=null;this._localeReady=!1}_isImage(e){return e.kind==="file"&&(e.mime||"").startsWith("image/")}async _sign(e){return(await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${e.id}`,expires:300})).path}get _lang(){return this.hass?.language||"en"}updated(e){super.updated(e),this.hass&&!this._localeReady&&(this._localeReady=!0,Q(this._lang).then(()=>this.requestUpdate())),this.hass&&this.entryId&&this._loadedFor!==this.entryId&&(this._loadedFor=this.entryId,this._load())}async _load(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=e.documents||[],this._loaded=!0,this._error="",this._thumbs={},this._loadThumbs()}catch(e){this._error=M(e,this._lang),this._loaded=!0}}async _loadThumbs(){await Promise.all(this._docs.filter(e=>this._isImage(e)).map(async e=>{try{let t=await this._sign(e);this._thumbs={...this._thumbs,[e.id]:t}}catch{}}))}_category_of(e){return(e.tags||[]).find(i=>vt.includes(i))||"other"}_labelKeydown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),e.currentTarget.querySelector("input")?.click())}_onFileInput(e){let t=e.target,i=Array.from(t.files??[]);i.length&&this._uploadFiles(i),t.value=""}_onCameraInput(e){let t=e.target,i=Array.from(t.files??[]);i.length&&this._uploadFiles(i,"photo"),t.value=""}_onDrop(e){if(e.preventDefault(),this._dragOver=!1,!this.canWrite||this._busy)return;let t=Array.from(e.dataTransfer?.files??[]);t.length&&this._uploadFiles(t)}_onDragOver(e){this.canWrite&&(e.preventDefault(),this._dragOver=!0)}_onDragLeave(e){let t=e.relatedTarget;(!t||!e.currentTarget.contains(t))&&(this._dragOver=!1)}async _uploadFiles(e,t){let i=t??this._category;this._busy=!0,this._error="",this._hint="";let a=0,l=0;try{for(let c of e){let h=new FormData;h.append("entry_id",this.entryId),h.append("tags",i),h.append("file",c,c.name);let u=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:h});if(!u.ok){this._error=u.status===413?s("doc_too_large",this._lang):s("doc_upload_failed",this._lang);continue}let g=await u.json();g.duplicate_in_object?l++:g.deduped&&a++}l?this._hint=s("doc_dup_in_object",this._lang):a&&(this._hint=s("doc_deduped",this._lang)),await this._load()}catch{this._error=s("doc_upload_failed",this._lang)}finally{this._busy=!1}}async _download(e){try{let t=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${e.id}`,expires:30});gt(t.path,e.filename||e.title||"document")}catch(t){this._error=M(t,this._lang)}}async _preview(e){if(this._isImage(e)){this._lightboxUrl=this._thumbs[e.id]||await this._sign(e);return}let t=window.open("about:blank","_blank");try{let i=await this._sign(e);t&&(t.location.href=new URL(i,window.location.origin).href)}catch(i){t&&t.close(),this._error=M(i,this._lang)}}_openDoc(e){e.kind==="file"?this._preview(e):e.url&&/^https?:\/\//i.test(e.url)&&window.open(e.url,"_blank","noopener")}_startEdit(e){this._editingId=e.id,this._editTitle=e.title||"",this._editCategory=this._category_of(e),this._addingLink=!1,this._error=""}_cancelEdit(){this._editingId=""}async _saveEdit(e){let t=(e.tags||[]).filter(a=>!vt.includes(a)),i=e.kind==="file"?[this._editCategory,...t]:e.tags??[];this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:e.id,title:this._editTitle.trim()||e.filename||e.url||"",tags:i}),this._editingId="",await this._load()}catch(a){this._error=M(a,this._lang)}finally{this._busy=!1}}async _delete(e){let t=e.title||e.filename||e.url||"";if(window.confirm(s("doc_delete_confirm",this._lang).replace("{name}",t))){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/delete",doc_id:e.id}),await this._load()}catch(i){this._error=M(i,this._lang)}finally{this._busy=!1}}}async _addLink(){let e=this._linkUrl.trim();if(e){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/add_link",entry_id:this.entryId,url:e,title:this._linkTitle.trim()||null}),this._linkUrl="",this._linkTitle="",this._addingLink=!1,await this._load()}catch(t){this._error=M(t,this._lang,s("doc_link_invalid",this._lang))}finally{this._busy=!1}}}render(){let e=this._lang;return o`
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
                  ${vt.map(t=>o`<option value=${t}>${s(`doc_cat_${t}`,e)}</option>`)}
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
    `}_renderDoc(e,t){if(this._editingId===e.id)return this._renderEdit(e,t);let i=e.kind==="file",a=this._category_of(e),l=i?`${s(`doc_cat_${a}`,t)} \xB7 ${ce(e.size)}`:s("doc_link_badge",t),c=this._thumbs[e.id];return o`
      <div class="doc-row">
        ${i&&c?o`<img
              class="doc-thumb"
              src=${c}
              alt=${e.title||""}
              title=${s("doc_open",t)}
              @click=${()=>this._preview(e)}
            />`:o`<ha-icon
              class="doc-icon ${i?"clickable":""}"
              icon=${i?bs[a]:"mdi:link-variant"}
              @click=${()=>i&&this._preview(e)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${s("doc_open",t)}
          @click=${()=>this._openDoc(e)}
          @keydown=${h=>{(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),this._openDoc(e))}}
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
                href=${e.url&&/^https?:\/\//i.test(e.url)?e.url:"#"}
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
              ${vt.map(a=>o`<option value=${a} ?selected=${a===this._editCategory}>${s(`doc_cat_${a}`,t)}</option>`)}
            </select>`:p}
        <button class="icon-btn" title=${s("save",t)} ?disabled=${this._busy||!this._editTitle.trim()} @click=${()=>this._saveEdit(e)}>
          <ha-icon icon="mdi:check"></ha-icon>
        </button>
        <button class="icon-btn" title=${s("cancel",t)} ?disabled=${this._busy} @click=${this._cancelEdit}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `}};q.styles=j`
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
  `,d([y({attribute:!1})],q.prototype,"hass",2),d([y({attribute:!1})],q.prototype,"entryId",2),d([y({type:Boolean})],q.prototype,"canWrite",2),d([_()],q.prototype,"_docs",2),d([_()],q.prototype,"_loaded",2),d([_()],q.prototype,"_busy",2),d([_()],q.prototype,"_error",2),d([_()],q.prototype,"_hint",2),d([_()],q.prototype,"_addingLink",2),d([_()],q.prototype,"_linkUrl",2),d([_()],q.prototype,"_linkTitle",2),d([_()],q.prototype,"_category",2),d([_()],q.prototype,"_thumbs",2),d([_()],q.prototype,"_lightboxUrl",2),d([_()],q.prototype,"_editingId",2),d([_()],q.prototype,"_editTitle",2),d([_()],q.prototype,"_editCategory",2),d([_()],q.prototype,"_dragOver",2);customElements.get("maintenance-documents-section")||customElements.define("maintenance-documents-section",q);var fs={name:"",vendor:"",mpn:"",gtin:"",storage_location:"",product_url:"",unit:"",cost:"",stock:"",reorder_threshold:"",restock_quantity:"",auto_buy_task:!0,notes:""},J=class extends S{constructor(){super(...arguments);this.parts=[];this.canWrite=!1;this._editing=null;this._busy=!1;this._error="";this._restockFor=null;this._restockQty="";this._restockInvalid=!1}get _lang(){return this.hass?.locale?.language||this.hass?.language||"en"}connectedCallback(){super.connectedCallback(),Q(this._lang).then(()=>this.requestUpdate())}_notifyChanged(){this.dispatchEvent(new CustomEvent("parts-changed",{bubbles:!0,composed:!0}))}async _send(e){this._busy=!0,this._error="";try{return await this.hass.connection.sendMessagePromise(e)}catch(t){return this._error=M(t,this._lang),null}finally{this._busy=!1}}_openAdd(){this._editing={...fs}}_openEdit(e){this._editing={id:e.id,name:e.name,vendor:e.vendor||"",mpn:e.mpn||"",gtin:e.gtin||"",storage_location:e.storage_location||"",product_url:e.product_url||"",unit:e.unit||"",cost:e.cost!=null?String(e.cost):"",stock:e.stock!=null?String(e.stock):"",reorder_threshold:e.reorder_threshold!=null?String(e.reorder_threshold):"",restock_quantity:e.restock_quantity!=null?String(e.restock_quantity):"",auto_buy_task:!!e.auto_buy_task,notes:e.notes||""}}_formValue(e){let t=i=>i.trim()===""?null:Number(i);return{entry_id:this.entryId,name:e.name.trim(),vendor:e.vendor.trim()||null,mpn:e.mpn.trim()||null,gtin:e.gtin.trim()||null,storage_location:e.storage_location.trim()||null,product_url:e.product_url.trim()||null,unit:e.unit.trim()||null,cost:t(e.cost),stock:t(e.stock),reorder_threshold:t(e.reorder_threshold),restock_quantity:t(e.restock_quantity),auto_buy_task:e.auto_buy_task,notes:e.notes.trim()||null}}async _save(){let e=this._editing;if(!e||!e.name.trim())return;let t=this._formValue(e),i=e.id?"maintenance_supporter/part/update":"maintenance_supporter/part/create";await this._send(e.id?{type:i,part_id:e.id,...t}:{type:i,...t})!==null&&(this._editing=null,this._notifyChanged())}async _delete(e){await this._send({type:"maintenance_supporter/part/delete",entry_id:this.entryId,part_id:e.id})!==null&&this._notifyChanged()}async _restock(e){let t=parseInt(this._restockQty,10);if(!Number.isFinite(t)||t===0){this._restockInvalid=!0;return}this._restockInvalid=!1;let i=await this._send({type:"maintenance_supporter/part/restock",entry_id:this.entryId,part_id:e.id,delta:t});this._restockFor=null,i!==null&&(e.stock=i.stock,this.requestUpdate(),this._notifyChanged())}_identLine(e){return[e.vendor,e.mpn?`MPN: ${e.mpn}`:"",e.gtin?`GTIN: ${e.gtin}`:""].filter(Boolean).join(" \xB7 ")}_renderRow(e){let t=this._lang,i=e.stock!==null&&e.stock!==void 0,a=this._identLine(e);return o`
      <div class="part-row ${e.is_low?"low":""}">
        <ha-icon class="part-icon" icon=${e.is_low?"mdi:cart-arrow-down":"mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${e.shopping_url?o`<a href=${e.shopping_url} target="_blank" rel="noopener noreferrer">${e.name}</a>`:e.name}
            ${i?o`<span class="stock-badge ${e.is_low?"low":""}"
                  >${e.stock}${e.unit?` ${e.unit}`:""}${e.reorder_threshold!=null?o`<span class="threshold">/${e.reorder_threshold}</span>`:p}</span
                >`:p}
          </div>
          <div class="part-meta">
            ${a?o`<span>${a}</span>`:p}
            ${e.storage_location?o`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${e.storage_location}</span>`:p}
          </div>
        </div>
        ${this.canWrite?o`
              ${this._restockFor===e.id?o`
                    <input
                      class="restock-input${this._restockInvalid?" invalid":""}"
                      type="number"
                      .value=${this._restockQty}
                      placeholder="+1"
                      @input=${l=>this._restockQty=l.target.value}
                      @keydown=${l=>{l.key==="Enter"&&this._restock(e),l.key==="Escape"&&(this._restockFor=null)}}
                    />
                    <ha-icon-button title=${s("save",t)} @click=${()=>this._restock(e)}
                      ><ha-icon icon="mdi:check"></ha-icon
                    ></ha-icon-button>
                  `:o`
                    <ha-icon-button
                      title=${s("part_restock",t)}
                      .disabled=${this._busy}
                      @click=${()=>{this._restockFor=e.id,this._restockInvalid=!1,this._restockQty=String(e.restock_quantity||1)}}
                      ><ha-icon icon="mdi:plus-minus-variant"></ha-icon
                    ></ha-icon-button>
                  `}
              <ha-icon-button title=${s("edit",t)} .disabled=${this._busy} @click=${()=>this._openEdit(e)}
                ><ha-icon icon="mdi:pencil"></ha-icon
              ></ha-icon-button>
              <ha-icon-button title=${s("delete",t)} .disabled=${this._busy} @click=${()=>this._delete(e)}
                ><ha-icon icon="mdi:delete-outline"></ha-icon
              ></ha-icon-button>
            `:p}
      </div>
    `}_field(e,t,i={}){let a=this._editing;return o`
      <label class="form-field">
        <span>${e}</span>
        <input
          type=${i.type||"text"}
          .value=${String(a[t]??"")}
          placeholder=${i.placeholder||""}
          @input=${l=>{this._editing[t]=l.target.value,this.requestUpdate()}}
        />
      </label>
    `}_renderForm(){let e=this._lang,t=this._editing;return o`
      <div class="part-form">
        <div class="form-grid">
          ${this._field(s("part_name",e),"name")}
          ${this._field(s("part_vendor",e),"vendor")}
          ${this._field("MPN","mpn")}
          ${this._field("GTIN / EAN","gtin",{placeholder:"4006381333931"})}
          ${this._field(s("part_storage_location",e),"storage_location")}
          ${this._field(s("part_product_url",e),"product_url",{placeholder:"https://\u2026"})}
          ${this._field(s("part_unit",e),"unit")}
          ${this._field(s("part_cost",e),"cost",{type:"number"})}
          ${this._field(s("part_stock",e),"stock",{type:"number"})}
          ${this._field(s("part_reorder_threshold",e),"reorder_threshold",{type:"number"})}
          ${this._field(s("part_restock_quantity",e),"restock_quantity",{type:"number"})}
          <label class="form-field checkbox">
            <input
              type="checkbox"
              .checked=${t.auto_buy_task}
              @change=${i=>{this._editing={...t,auto_buy_task:i.target.checked}}}
            />
            <span>${s("part_auto_buy",e)}</span>
          </label>
        </div>
        <div class="form-actions">
          <ha-button appearance="plain" @click=${()=>this._editing=null}>${s("cancel",e)}</ha-button>
          <ha-button .disabled=${this._busy||!t.name.trim()} @click=${()=>this._save()}
            >${s("save",e)}</ha-button
          >
        </div>
      </div>
    `}render(){let e=this._lang;return!this.parts.length&&!this.canWrite?p:o`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${s("parts_section",e)} (${this.parts.length})
        </h3>
        ${this.canWrite&&!this._editing?o`<ha-button appearance="plain" @click=${()=>this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${s("part_add",e)}
            </ha-button>`:p}
      </div>
      ${this._error?o`<div class="error">${this._error}</div>`:p}
      ${this._editing?this._renderForm():p}
      ${this.parts.map(t=>this._renderRow(t))}
    `}};J.styles=j`
    :host {
      display: block;
      margin: 12px 0;
    }
    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    h3 {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 8px 0;
    }
    .part-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .part-row.low .part-icon {
      color: var(--warning-color, #ff9800);
    }
    .part-main {
      flex: 1;
      min-width: 0;
    }
    .part-name {
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .part-name a {
      color: var(--primary-color);
      text-decoration: none;
    }
    .stock-badge {
      font-size: 12px;
      padding: 1px 8px;
      border-radius: 10px;
      background: var(--secondary-background-color);
    }
    .stock-badge.low {
      background: var(--warning-color, #ff9800);
      color: var(--text-primary-color, #fff);
    }
    .stock-badge .threshold {
      opacity: 0.7;
    }
    .part-meta {
      font-size: 12px;
      color: var(--secondary-text-color);
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .part-meta .loc ha-icon {
      --mdc-icon-size: 13px;
    }
    .restock-input {
      width: 64px;
      padding: 4px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .restock-input.invalid {
      border-color: var(--error-color, #f44336);
    }
    .part-form {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 8px 12px;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .form-field input[type="text"],
    .form-field input[type="number"] {
      padding: 6px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .form-field.checkbox {
      flex-direction: row;
      align-items: center;
      gap: 6px;
      align-self: end;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 10px;
    }
    .error {
      color: var(--error-color);
      font-size: 13px;
      margin: 4px 0;
    }
  `,d([y({attribute:!1})],J.prototype,"hass",2),d([y({attribute:!1})],J.prototype,"entryId",2),d([y({attribute:!1})],J.prototype,"parts",2),d([y({type:Boolean})],J.prototype,"canWrite",2),d([_()],J.prototype,"_editing",2),d([_()],J.prototype,"_busy",2),d([_()],J.prototype,"_error",2),d([_()],J.prototype,"_restockFor",2),d([_()],J.prototype,"_restockQty",2),d([_()],J.prototype,"_restockInvalid",2);customElements.define("maintenance-parts-section",J);var ys=["manual","warranty","invoice","spare_parts","photo","other"],xs={manual:"mdi:book-open-variant",warranty:"mdi:shield-check",invoice:"mdi:receipt-text-outline",spare_parts:"mdi:cog-outline",photo:"mdi:image-outline",other:"mdi:file-document-outline"},ee=class extends S{constructor(){super(...arguments);this.canWrite=!1;this._docs=[];this._loaded=!1;this._busy=!1;this._error="";this._attachId="";this._loadedKey="";this._localeReady=!1}get _lang(){return this.hass?.language||"en"}updated(e){super.updated(e),this.hass&&!this._localeReady&&(this._localeReady=!0,Q(this._lang).then(()=>this.requestUpdate()));let t=`${this.entryId}|${this.taskId}`;this.hass&&this.entryId&&this.taskId&&this._loadedKey!==t&&(this._loadedKey=t,this._load())}async _load(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:this.entryId});this._docs=e.documents||[],this._loaded=!0,this._error=""}catch(e){this._error=M(e,this._lang),this._loaded=!0}}_linked(){return this._docs.filter(e=>(e.task_ids||[]).includes(this.taskId))}_available(){return this._docs.filter(e=>!(e.task_ids||[]).includes(this.taskId))}async _setTaskIds(e,t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:e.id,task_ids:t}),await this._load()}catch(i){this._error=M(i,this._lang)}finally{this._busy=!1}}_link(){let e=this._docs.find(t=>t.id===this._attachId);e&&(this._attachId="",this._setTaskIds(e,[...e.task_ids||[],this.taskId]))}_unlink(e){this._setTaskIds(e,(e.task_ids||[]).filter(t=>t!==this.taskId))}_isPdf(e){return e.mime==="application/pdf"||(e.filename||"").toLowerCase().endsWith(".pdf")}_pageFor(e){return this._isPdf(e)?e.task_pages?.[this.taskId]:void 0}async _open(e){if(e.kind==="weblink"){window.open(e.url,"_blank","noopener");return}let t=this._pageFor(e),i=t?`#page=${t}`:"",a=window.open("about:blank","_blank");try{let l=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${e.id}`,expires:300});a&&(a.location.href=new URL(l.path+i,window.location.origin).href)}catch(l){a&&a.close(),this._error=M(l,this._lang)}}async _setPage(e,t){this._busy=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/update",doc_id:e.id,task_pages:{[this.taskId]:t}}),await this._load()}catch(i){this._error=M(i,this._lang)}finally{this._busy=!1}}async _download(e){try{let t=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${e.id}`,expires:30});gt(t.path,e.filename||e.title||"document")}catch(t){this._error=M(t,this._lang)}}render(){if(!this._loaded||this._docs.length===0)return p;let e=this._lang,t=this._linked(),i=this._available();return o`
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
    `}_renderRow(e,t){let i=e.kind==="file",a=this._isPdf(e),l=e.task_pages?.[this.taskId],c=(e.tags||[]).find(u=>ys.includes(u))||"other",h=i?ce(e.size):s("doc_link_badge",t);return o`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${i?xs[c]:"mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${l?`${s("doc_open",t)} \xB7 ${s("doc_page",t)} ${l}`:s("doc_open",t)}
          @click=${()=>this._open(e)}
          @keydown=${u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),this._open(e))}}
        >
          <div class="tdoc-title">${e.title||e.filename||e.url}</div>
          <div class="tdoc-meta">
            ${h}${l?o` · <span class="tdoc-pagetag">${s("doc_page",t)} ${l}</span>`:p}
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
              @change=${u=>{let g=parseInt(u.target.value,10);this._setPage(e,Number.isFinite(g)&&g>=1?g:0)}}
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
    `}};ee.styles=j`
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
  `,d([y({attribute:!1})],ee.prototype,"hass",2),d([y({attribute:!1})],ee.prototype,"entryId",2),d([y({attribute:!1})],ee.prototype,"taskId",2),d([y({type:Boolean})],ee.prototype,"canWrite",2),d([_()],ee.prototype,"_docs",2),d([_()],ee.prototype,"_loaded",2),d([_()],ee.prototype,"_busy",2),d([_()],ee.prototype,"_error",2),d([_()],ee.prototype,"_attachId",2);customElements.get("maintenance-task-documents")||customElements.define("maintenance-task-documents",ee);var $s=["cleaning","inspection","replacement","calibration","service","reading","custom"],ws=["low","normal","high"],ks=["time_based","weekdays","nth_weekday","day_of_month","sensor_based","one_time","manual"],vi=["weekdays","nth_weekday","day_of_month"],bi=["threshold","counter","state_change","runtime"],Es=[...bi,"compound"];function Ts(){return{entityIds:"",type:"threshold",above:"",below:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:""}}function Ss(r){return{entityIds:(r.entity_ids||(r.entity_id?[r.entity_id]:[])).join(", "),type:r.type||"threshold",above:r.trigger_above?.toString()??"",below:r.trigger_below?.toString()??"",forMinutes:r.trigger_for_minutes?.toString()??"0",targetValue:r.trigger_target_value?.toString()??"",deltaMode:r.trigger_delta_mode||!1,fromState:r.trigger_from_state||"",toState:r.trigger_to_state||"",targetChanges:r.trigger_target_changes?.toString()??"",runtimeHours:r.trigger_runtime_hours?.toString()??""}}function As(r){let n=r.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(n.length===0)return null;let e={entity_id:n[0],entity_ids:n,type:r.type};if(r.type==="threshold"){let t=parseFloat(r.above);isNaN(t)||(e.trigger_above=t);let i=parseFloat(r.below);isNaN(i)||(e.trigger_below=i);let a=parseInt(r.forMinutes,10);isNaN(a)||(e.trigger_for_minutes=a)}else if(r.type==="counter"){let t=parseFloat(r.targetValue);isNaN(t)||(e.trigger_target_value=t),e.trigger_delta_mode=r.deltaMode}else if(r.type==="state_change"){r.fromState&&(e.trigger_from_state=r.fromState),r.toState&&(e.trigger_to_state=r.toState);let t=parseInt(r.targetChanges,10);isNaN(t)||(e.trigger_target_changes=t)}else if(r.type==="runtime"){let t=parseFloat(r.runtimeHours);isNaN(t)||(e.trigger_runtime_hours=t)}return e}function js(r){return Array.from({length:7},(n,e)=>ot(e,r,"short"))}function Cs(r){let n=new Intl.DateTimeFormat(r||"en",{month:"short"});return Array.from({length:12},(e,t)=>n.format(new Date(2021,t,1)))}var x=class extends S{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.defaultWarningDays=7;this.parts=[];this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId=null;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._notes="";this._documentationUrl="";this._customIcon="";this._priority="normal";this._labels="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerForMinutes="0";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._readingUnit="";this._consumesParts={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._scheduleTime="";this._actionService="";this._actionTargetEntity="";this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._userService=null}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}async openCreate(e,t){this._entryId=e,this._taskId=null,this._error="",!e&&t&&t.length>0?(this._objectChoices=t.map(i=>({entry_id:i.entry_id,name:i.object.name})).sort((i,a)=>i.name.localeCompare(a.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts()]),this._open=!0}async openEdit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let i=t.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"&&(i.day??1)>=1?String(i.day??1):"1",this._domLastDay=i?.kind==="day_of_month"&&i.day===-1,this._domBusiness=i?.kind==="day_of_month"&&i.business===!0,this._calOffset=i?.offset?String(i.offset):"0",this._seasonMonths=Array.isArray(i?.season_months)?[...i.season_months]:[];let a=i?.ends;a&&typeof a.count=="number"?(this._endsMode="count",this._endsCount=String(a.count),this._endsUntil=""):a&&typeof a.until=="string"?(this._endsMode="until",this._endsUntil=a.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._nfcTagId=t.nfc_tag_id||"",this._readingUnit=t.reading_unit||"",this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(u=>[u.part_id,u.quantity])),this._responsibleUserId=t.responsible_user_id||null,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._scheduleTime=t.schedule_time||"";let l=t.on_complete_action;if(l&&l.service){this._actionService=l.service;let u=l.target?.entity_id;this._actionTargetEntity=Array.isArray(u)?u[0]||"":u||"",this._actionData=l.data&&typeof l.data=="object"?{...l.data}:{},this._actionDataJsonFallback=""}else this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="";let c=t.quick_complete_defaults;this._qcNotes=c?.notes||"",this._qcCost=c?.cost!=null?String(c.cost):"",this._qcDuration=c?.duration!=null?String(c.duration):"",this._qcFeedback=c?.feedback||"";let h=t.adaptive_config||{};if(this._environmentalEntity=h.environmental_entity||"",this._environmentalAttribute=h.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,t.trigger_config){let u=t.trigger_config;this._triggerEntityId=u.entity_id||"",this._triggerEntityIds=u.entity_ids||(u.entity_id?[u.entity_id]:[]),this._triggerEntityLogic=u.entity_logic||"any",this._triggerAttribute=u.attribute||"",this._triggerType=u.type||"threshold",this._triggerAbove=u.trigger_above?.toString()||"",this._triggerBelow=u.trigger_below?.toString()||"",this._triggerForMinutes=u.trigger_for_minutes?.toString()||"0",this._triggerTargetValue=u.trigger_target_value?.toString()||"",this._triggerDeltaMode=u.trigger_delta_mode||!1,this._autoCompleteOnRecovery=u.auto_complete_on_recovery||!1,this._triggerFromState=u.trigger_from_state||"",this._triggerToState=u.trigger_to_state||"",this._triggerTargetChanges=u.trigger_target_changes?.toString()||"",this._triggerRuntimeHours=u.trigger_runtime_hours?.toString()||"",u.type==="compound"?(this._compoundLogic=u.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(u.conditions||[]).map(Ss)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._priority="normal",this._labels="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._readingUnit="",this._consumesParts={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._scheduleTime="",this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._actionService="",this._actionTargetEntity="",this._actionData={},this._actionDataJsonFallback="",this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._triggerAttribute="",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._triggerType="threshold",this._triggerAbove="",this._triggerBelow="",this._triggerForMinutes="0",this._triggerTargetValue="",this._triggerDeltaMode=!1,this._autoCompleteOnRecovery=!1,this._triggerFromState="",this._triggerToState="",this._triggerTargetChanges="",this._triggerRuntimeHours="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new be(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError="Invalid service format (expected 'domain.service')",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,i]=e.split(".");if(!this.hass?.services?.[t]?.[i]){this._actionTestResult="error",this._actionTestError=`Service "${e}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let a=this._actionTargetEntity.trim();if(a){let l=a.split(".")[0];if(l!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=`Service "${e}" only works on ${t}.* entities; entity "${a}" is in ${l}.* \u2014 pick a service that matches the entity domain (e.g. ${l}.${i})`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[a]){this._actionTestResult="error",this._actionTestError=`Target entity "${a}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`,setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,i]=e.split("."),a=this.hass?.services?.[t]?.[i]?.fields;return!a||Object.keys(a).length===0?null:Object.entries(a).map(([l,c])=>({name:l,required:!!c.required,selector:c.selector||{text:{}}}))}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled)return p;let t=this._serviceSchema();return o`
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
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=e.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=t.domain||"",this._suggestedAttributes=t.suggested_attributes||[],this._availableAttributes=t.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}async _save(){if(!this._loading&&this._name.trim()){this._loading=!0,this._error="";try{let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:parseInt(this._warningDays,10)||7},t=this._earliestCompletionDays.trim();if(e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):vi.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.priority=this._priority,e.labels=this._labels.split(",").map(c=>c.trim()).filter(Boolean),e.enabled=this._enabled,e.last_performed=this._lastPerformed||null,e.nfc_tag_id=this._nfcTagId||null,e.reading_unit=this._readingUnit.trim()||null,this.parts.length&&(e.consumes_parts=Object.entries(this._consumesParts).map(([c,h])=>({part_id:c,quantity:h}))),e.responsible_user_id=this._responsibleUserId,e.assignee_pool=this._assigneePool,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let c=this._compoundConditions.map(As).filter(h=>h!==null);if(c.length>0){let h={type:"compound",compound_logic:this._compoundLogic,conditions:c};this._autoCompleteOnRecovery&&(h.auto_complete_on_recovery=!0),e.trigger_config=h}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let c=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],h={entity_id:c[0],entity_ids:c,type:this._triggerType};if(this._triggerAttribute&&(h.attribute=this._triggerAttribute),this._autoCompleteOnRecovery&&(h.auto_complete_on_recovery=!0),c.length>1&&(h.entity_logic=this._triggerEntityLogic),this._triggerType==="threshold"){if(this._triggerAbove){let u=parseFloat(this._triggerAbove);isNaN(u)||(h.trigger_above=u)}if(this._triggerBelow){let u=parseFloat(this._triggerBelow);isNaN(u)||(h.trigger_below=u)}if(this._triggerForMinutes){let u=parseInt(this._triggerForMinutes,10);isNaN(u)||(h.trigger_for_minutes=u)}}else if(this._triggerType==="counter"){if(this._triggerTargetValue){let u=parseFloat(this._triggerTargetValue);isNaN(u)||(h.trigger_target_value=u)}h.trigger_delta_mode=this._triggerDeltaMode}else if(this._triggerType==="state_change"){if(this._triggerFromState&&(h.trigger_from_state=this._triggerFromState),this._triggerToState&&(h.trigger_to_state=this._triggerToState),this._triggerTargetChanges){let u=parseInt(this._triggerTargetChanges,10);isNaN(u)||(h.trigger_target_changes=u)}}else if(this._triggerType==="runtime"&&this._triggerRuntimeHours){let u=parseFloat(this._triggerRuntimeHours);isNaN(u)||(h.trigger_runtime_hours=u)}e.trigger_config=h}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&this._scheduleType==="time_based"){let c=this._scheduleTime.trim();e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(c)?c:null}if(this.checklistsEnabled){let c=this._checklistText.split(`
`).map(h=>h.trim()).filter(Boolean).slice(0,100);e.checklist=c.length?c:null}if(this.completionActionsEnabled){let c=this._actionService.trim();if(c&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(c)){let m={service:c},v=this._actionTargetEntity.trim();v&&(m.target={entity_id:v});let f=this._buildActionData();Object.keys(f).length>0&&(m.data=f),e.on_complete_action=m}else e.on_complete_action=null;let h={};this._qcNotes.trim()&&(h.notes=this._qcNotes.trim());let u=parseFloat(this._qcCost);!isNaN(u)&&u>=0&&(h.cost=u);let g=parseInt(this._qcDuration,10);!isNaN(g)&&g>=0&&(h.duration=g),this._qcFeedback&&(h.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(h).length?h:null}let i=await this.hass.connection.sendMessagePromise(e),a=this._taskId||i?.task_id,l=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;if(a&&this._scheduleType==="sensor_based"&&l)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:a,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null}),this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute}catch{}this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}catch(e){this._error=M(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}_close(){this._open=!1}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let e=this._lang,t=this._triggerType==="compound";return o`
      <h3>${s("trigger_configuration",e)}</h3>
      <div class="select-row">
        <label>${s("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${i=>this._triggerType=i.target.value}
        >
          ${Es.map(i=>o`<option value=${i} ?selected=${i===this._triggerType}>${s(i,e)}</option>`)}
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
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((i,a)=>a===e?{...i,...t}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,Ts()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,i)=>i!==e)}_renderCompoundEditor(){let e=this._lang;return o`
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
            ${bi.map(l=>o`<option value=${l} ?selected=${l===e.type}>${s(l,i)}</option>`)}
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
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_buildSchedule(){let e=i=>{let a=parseInt(this._calOffset,10)||0;return a&&(i.offset=Math.max(-15,Math.min(a,15))),i};if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((i,a)=>i-a)});if(this._scheduleType==="nth_weekday")return e({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});let t={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(t.business=!0),e(t)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,i)=>t-i)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||vi.includes(this._scheduleType)))return p;let i=Cs(e);return o`
      <label class="field-label">${s("season_window_label",e)}</label>
      <div class="field-help">${s("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${i.map((a,l)=>o`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(l+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(l+1)}
          >${a}</button>`)}
      </div>

      <label class="field-label">${s("series_end_label",e)}</label>
      <div class="select-row">
        <select .value=${this._endsMode}
          @change=${a=>this._endsMode=a.target.value}>
          <option value="never" ?selected=${this._endsMode==="never"}>${s("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${s("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${s("series_end_until",e)}</option>
        </select>
      </div>
      ${this._endsMode==="count"?o`
        <ms-textfield
          label="${s("series_end_count_label",e)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${a=>this._endsCount=a.target.value}
        ></ms-textfield>`:p}
      ${this._endsMode==="until"?o`
        <ms-textfield
          label="${s("series_end_until_label",e)}"
          type="date"
          .value=${this._endsUntil}
          @input=${a=>this._endsUntil=a.target.value}
        ></ms-textfield>`:p}
    `}_renderCalendarFields(){let e=this._lang,t=js(e);if(this._scheduleType==="weekdays")return o`
        <label class="field-label">${s("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((i,a)=>o`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(a)?"selected":""}"
              @click=${()=>this._toggleWeekday(a)}
            >${i}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let i=[["1",s("ord_1",e)],["2",s("ord_2",e)],["3",s("ord_3",e)],["4",s("ord_4",e)],["5",s("ord_5",e)],["-1",s("ord_last",e)]];return o`
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
        </div>
        ${this._renderCalOffsetField()}`}return this._scheduleType==="day_of_month"?o`
        ${this._domLastDay?p:o`
          <ms-textfield
            label="${s("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${i=>this._domDay=i.target.value}
          ></ms-textfield>`}
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domLastDay}
            @change=${i=>this._domLastDay=i.target.checked} />
          <span>${s("recurrence_last_day",e)}</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domBusiness}
            @change=${i=>this._domBusiness=i.target.checked} />
          <span>${s("recurrence_business_day",e)}</span>
        </label>
        ${this._renderCalOffsetField()}`:p}_renderCalOffsetField(){let e=this._lang;return o`
      <ms-textfield
        label="${s("recurrence_offset",e)}"
        helper="${s("recurrence_offset_help",e)}"
        type="number"
        min="-15"
        max="15"
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?o`
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
                @change=${i=>{this._entryId=i.target.value,this._consumesParts={},this._loadParts()}}
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
              ${$s.map(i=>o`<option value=${i} ?selected=${i===this._type}>${s(i,e)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?o`
                <ms-textfield
                  label="${s("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${i=>this._readingUnit=i.target.value}
                ></ms-textfield>
                <div class="field-help">${s("reading_unit_help",e)}</div>
              `:p}
          ${this._partsLoadFailed?o`<div class="field-help parts-load-failed">${s("parts_load_failed",e)}</div>`:p}
          ${this.parts.length?o`
                <div class="field">
                  <label>${s("consumes_parts_label",e)}</label>
                  ${this.parts.map(i=>{let a=this._consumesParts[i.id];return o`
                      <div class="consumes-row">
                        <label class="consumes-check">
                          <input
                            type="checkbox"
                            .checked=${a!==void 0}
                            @change=${l=>{let c={...this._consumesParts};l.target.checked?c[i.id]=c[i.id]||1:delete c[i.id],this._consumesParts=c}}
                          />
                          <span>${i.name}${i.unit?` (${i.unit})`:""}</span>
                        </label>
                        ${a!==void 0?o`<input
                              class="consumes-qty"
                              type="number"
                              min="1"
                              max="999"
                              .value=${String(a)}
                              @input=${l=>{let c=parseInt(l.target.value,10);this._consumesParts={...this._consumesParts,[i.id]:Number.isFinite(c)&&c>=1?c:1}}}
                            />`:p}
                      </div>
                    `})}
                </div>
              `:p}
          <div class="select-row">
            <label>${s("priority",e)}</label>
            <select
              .value=${this._priority}
              @change=${i=>this._priority=i.target.value}
            >
              ${ws.map(i=>o`<option value=${i} ?selected=${i===this._priority}>${s("priority_"+i,e)}</option>`)}
            </select>
          </div>
          <div class="field">
            <label>${s("labels",e)}</label>
            <input
              type="text"
              .value=${this._labels}
              placeholder="${s("labels_placeholder",e)}"
              @input=${i=>this._labels=i.target.value}
            />
            <div class="field-help">${s("labels_help",e)}</div>
          </div>
          <div class="select-row">
            <label>${s("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${i=>this._scheduleType=i.target.value}
            >
              ${ks.map(i=>o`<option value=${i} ?selected=${i===this._scheduleType}>${s(i,e)}</option>`)}
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
          ${this._renderRecurrenceExtras()}
          <ms-textfield
            label="${s("warning_days",e)}"
            type="number"
            .value=${this._warningDays}
            @input=${i=>this._warningDays=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${s("earliest_completion_days",e)}"
            helper="${s("earliest_completion_days_help",e)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${i=>this._earliestCompletionDays=i.target.value}
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
          ${this._availableUsers.length>=2?o`
            <div class="field">
              <label>${s("shared_with",e)}</label>
              <div class="field-help">${s("shared_with_help",e)}</div>
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
                <label>${s("rotation_strategy",e)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${i=>this._rotationStrategy=i.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${s("rotation_none",e)}</option>
                  ${["round_robin","least_completed","random"].map(i=>o`<option value=${i} ?selected=${i===this._rotationStrategy}>${s("rotation_"+i,e)}</option>`)}
                </select>
              </div>`:p}
          `:p}
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
    `}};x.styles=j`
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
    .consumes-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 2px 0;
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
  `,d([y({attribute:!1})],x.prototype,"hass",2),d([y({type:Boolean,attribute:"checklists-enabled"})],x.prototype,"checklistsEnabled",2),d([y({type:Boolean,attribute:"schedule-time-enabled"})],x.prototype,"scheduleTimeEnabled",2),d([y({type:Boolean,attribute:"completion-actions-enabled"})],x.prototype,"completionActionsEnabled",2),d([y({type:Number,attribute:"default-warning-days"})],x.prototype,"defaultWarningDays",2),d([_()],x.prototype,"parts",2),d([_()],x.prototype,"_open",2),d([_()],x.prototype,"_loading",2),d([_()],x.prototype,"_error",2),d([_()],x.prototype,"_entryId",2),d([_()],x.prototype,"_taskId",2),d([_()],x.prototype,"_objectChoices",2),d([_()],x.prototype,"_name",2),d([_()],x.prototype,"_type",2),d([_()],x.prototype,"_scheduleType",2),d([_()],x.prototype,"_intervalDays",2),d([_()],x.prototype,"_intervalUnit",2),d([_()],x.prototype,"_dueDate",2),d([_()],x.prototype,"_warningDays",2),d([_()],x.prototype,"_earliestCompletionDays",2),d([_()],x.prototype,"_intervalAnchor",2),d([_()],x.prototype,"_weekdays",2),d([_()],x.prototype,"_nth",2),d([_()],x.prototype,"_nthWeekday",2),d([_()],x.prototype,"_domDay",2),d([_()],x.prototype,"_domLastDay",2),d([_()],x.prototype,"_domBusiness",2),d([_()],x.prototype,"_calOffset",2),d([_()],x.prototype,"_seasonMonths",2),d([_()],x.prototype,"_endsMode",2),d([_()],x.prototype,"_endsCount",2),d([_()],x.prototype,"_endsUntil",2),d([_()],x.prototype,"_notes",2),d([_()],x.prototype,"_documentationUrl",2),d([_()],x.prototype,"_customIcon",2),d([_()],x.prototype,"_priority",2),d([_()],x.prototype,"_labels",2),d([_()],x.prototype,"_enabled",2),d([_()],x.prototype,"_triggerEntityId",2),d([_()],x.prototype,"_triggerEntityIds",2),d([_()],x.prototype,"_triggerEntityLogic",2),d([_()],x.prototype,"_triggerAttribute",2),d([_()],x.prototype,"_triggerType",2),d([_()],x.prototype,"_triggerAbove",2),d([_()],x.prototype,"_triggerBelow",2),d([_()],x.prototype,"_triggerForMinutes",2),d([_()],x.prototype,"_triggerTargetValue",2),d([_()],x.prototype,"_triggerDeltaMode",2),d([_()],x.prototype,"_autoCompleteOnRecovery",2),d([_()],x.prototype,"_triggerFromState",2),d([_()],x.prototype,"_triggerToState",2),d([_()],x.prototype,"_triggerTargetChanges",2),d([_()],x.prototype,"_triggerRuntimeHours",2),d([_()],x.prototype,"_compoundLogic",2),d([_()],x.prototype,"_compoundConditions",2),d([_()],x.prototype,"_suggestedAttributes",2),d([_()],x.prototype,"_availableAttributes",2),d([_()],x.prototype,"_entityDomain",2),d([_()],x.prototype,"_lastPerformed",2),d([_()],x.prototype,"_nfcTagId",2),d([_()],x.prototype,"_readingUnit",2),d([_()],x.prototype,"_consumesParts",2),d([_()],x.prototype,"_partsLoadFailed",2),d([_()],x.prototype,"_availableTags",2),d([_()],x.prototype,"_responsibleUserId",2),d([_()],x.prototype,"_assigneePool",2),d([_()],x.prototype,"_rotationStrategy",2),d([_()],x.prototype,"_availableUsers",2),d([_()],x.prototype,"_checklistText",2),d([_()],x.prototype,"_scheduleTime",2),d([_()],x.prototype,"_actionService",2),d([_()],x.prototype,"_actionTargetEntity",2),d([_()],x.prototype,"_actionData",2),d([_()],x.prototype,"_actionDataJsonFallback",2),d([_()],x.prototype,"_actionTesting",2),d([_()],x.prototype,"_actionTestResult",2),d([_()],x.prototype,"_actionTestError",2),d([_()],x.prototype,"_qcNotes",2),d([_()],x.prototype,"_qcCost",2),d([_()],x.prototype,"_qcDuration",2),d([_()],x.prototype,"_qcFeedback",2),d([_()],x.prototype,"_environmentalEntity",2),d([_()],x.prototype,"_environmentalAttribute",2);customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",x);var H=class extends S{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.restockDefault=null;this.consumesInfo=[];this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photoDocId="";this._photoPreview="";this._photoUploading=!1;this._readingValue="";this._restockQty=""}open(){this._open||(this._open=!0,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState={},this._feedback="needed",this._photoDocId="",this._photoPreview="",this._photoUploading=!1,this._readingValue="",this._restockQty=this.restockDefault!==null?String(this.restockDefault):"")}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _onPhotoInput(e){let t=e.target,i=t.files?.[0];if(t.value="",!!i){this._photoUploading=!0,this._error="";try{let a=new FormData;a.append("entry_id",this.entryId),a.append("tags","photo"),a.append("file",i,i.name);let l=await fetch("/api/maintenance_supporter/document/upload",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:a});if(!l.ok){this._error=l.status===413?s("doc_too_large",this.lang):s("doc_upload_failed",this.lang);return}let c=await l.json();c.id&&(this._photoDocId=c.id,this._photoPreview=URL.createObjectURL(i))}catch{this._error=s("doc_upload_failed",this.lang)}finally{this._photoUploading=!1}}}_removePhoto(){this._photoPreview&&URL.revokeObjectURL(this._photoPreview),this._photoDocId="",this._photoPreview=""}async _complete(){this._loading=!0,this._error="";try{let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let t=parseFloat(this._cost);!isNaN(t)&&t>=0&&(e.cost=t)}if(this._duration){let t=parseInt(this._duration,10);!isNaN(t)&&t>=0&&(e.duration=t)}if(this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photoDocId&&(e.photo_doc_id=this._photoDocId),this._readingValue!==""){let t=parseFloat(this._readingValue);isNaN(t)||(e.reading_value=t)}if(this.restockDefault!==null&&this._restockQty!==""){let t=parseInt(this._restockQty,10);!isNaN(t)&&t>=1&&(e.restock_quantity=t)}await this.hass.connection.sendMessagePromise(e),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed"))}catch(e){this._error=M(e,this.lang,s("save_error",this.lang))}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return o``;let e=this.lang||this.hass?.language||"en";return o`
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
          ${this.taskType==="reading"?o`
              <label class="field">
                <span class="field-label">${s("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${t=>this._readingValue=t.target.value} />
              </label>`:p}
          ${this.consumesInfo.length?o`<div class="consumes-hint">
                ${this.consumesInfo.map(t=>o`<div>${t}</div>`)}
              </div>`:p}
          ${this.restockDefault!==null?o`
              <label class="field">
                <span class="field-label">${s("restock_quantity_label",e)}</span>
                <input type="number" step="1" min="1" class="field-input"
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
          <div class="field">
            <span class="field-label">${s("completion_photo_optional",e)}</span>
            ${this._photoPreview?o`
                <div class="photo-preview">
                  <img src=${this._photoPreview} alt="" />
                  <button type="button" class="photo-remove" @click=${this._removePhoto}
                    title="${s("remove",e)}">✕</button>
                </div>`:o`
                <label class="photo-pick">
                  <ha-icon icon="mdi:camera"></ha-icon>
                  <span>${this._photoUploading?s("uploading",e):s("add_photo",e)}</span>
                  <input type="file" accept="image/*" capture="environment"
                    ?disabled=${this._photoUploading}
                    @change=${this._onPhotoInput} />
                </label>`}
          </div>
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
    `}};H.styles=[dt,j`
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
    .consumes-hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      border-left: 3px solid var(--primary-color);
      padding: 4px 8px;
      margin: 4px 0 8px;
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
  `],d([y({attribute:!1})],H.prototype,"hass",2),d([y()],H.prototype,"entryId",2),d([y()],H.prototype,"taskId",2),d([y()],H.prototype,"taskName",2),d([y()],H.prototype,"lang",2),d([y({type:Array})],H.prototype,"checklist",2),d([y({type:Boolean})],H.prototype,"adaptiveEnabled",2),d([y()],H.prototype,"taskType",2),d([y()],H.prototype,"readingUnit",2),d([y({attribute:!1})],H.prototype,"restockDefault",2),d([y({type:Array})],H.prototype,"consumesInfo",2),d([_()],H.prototype,"_open",2),d([_()],H.prototype,"_notes",2),d([_()],H.prototype,"_cost",2),d([_()],H.prototype,"_duration",2),d([_()],H.prototype,"_loading",2),d([_()],H.prototype,"_error",2),d([_()],H.prototype,"_checklistState",2),d([_()],H.prototype,"_feedback",2),d([_()],H.prototype,"_photoDocId",2),d([_()],H.prototype,"_photoPreview",2),d([_()],H.prototype,"_photoUploading",2),d([_()],H.prototype,"_readingValue",2),d([_()],H.prototype,"_restockQty",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",H);function Ie(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function fi(r){return!r.startsWith("data:image/svg+xml,")&&!r.startsWith("data:image/png;base64,")?"":Ie(r)}function Ms(r){return r.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var ae=class extends S{constructor(){super(...arguments);this.lang="en";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}openForTask(e,t,i,a){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=a,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...t,action:"view"})];this._taskId&&i.push(this.hass.connection.sendMessagePromise({...t,action:"complete"}));let a=await Promise.all(i);if(e!==this._generateSeq)return;this._viewResult=a[0],a.length>1&&(this._completeResult=a[1])}catch(t){if(e!==this._generateSeq)return;let i=t?.code,a=t?.message;this._error=i==="no_url"||typeof a=="string"&&a.includes("No Home Assistant URL")?s("qr_error_no_url",this.lang):s("qr_error",this.lang)}finally{e===this._generateSeq&&(this._loading=!1)}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),a=window.open("","_blank","width=600,height=500");if(!a)return;let l=this.lang||"en",c=Ie(t),h=Ie(i),u=!!this._completeResult,g=Ie(s("qr_action_view",l)),m=Ie(s("qr_action_complete",l));a.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
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
${h?`<div class="sub">${h}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${fi(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${g}</div>
  </div>
  ${u?`<div class="qr-col">
    <img src="${fi(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${m}</div>
  </div>`:""}
</div>
<div class="url">${Ie(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),a.document.close()}_downloadSvg(e,t){let i=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),a=new Blob([i],{type:"image/svg+xml"}),l=URL.createObjectURL(a),c=document.createElement("a");c.href=l;let h=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;c.download=`qr-${Ms(h)}-${t}.svg`,c.click(),URL.revokeObjectURL(l)}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._error="",this._loading=!1}render(){if(!this._open)return o``;let e=this.lang||this.hass?.language||"en",t=this._taskName?`${s("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${s("qr_code",e)}: ${this._objectName}`,i=!!this._viewResult;return o`
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
    `}};ae.styles=j`
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
  `,d([y({attribute:!1})],ae.prototype,"hass",2),d([y()],ae.prototype,"lang",2),d([_()],ae.prototype,"_open",2),d([_()],ae.prototype,"_loading",2),d([_()],ae.prototype,"_error",2),d([_()],ae.prototype,"_viewResult",2),d([_()],ae.prototype,"_completeResult",2),d([_()],ae.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",ae);var re=class extends S{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._adopting=!1;this._error="";this._sensors=[];this._selected=new Set;this._localeReady=!1;this._toggle=e=>{let t=new Set(this._selected);t.has(e)?t.delete(e):t.add(e),this._selected=t};this._toggleAll=()=>{this._selected.size===this._sensors.length?this._selected=new Set:this._selected=new Set(this._sensors.map(e=>e.entity_id))};this._adopt=async()=>{if(!(this._selected.size===0||this._adopting)){this._adopting=!0,this._error="";try{let e=this._sensors.filter(i=>this._selected.has(i.entity_id)).map(i=>({entity_id:i.entity_id,name:i.name,entry_id:i.suggested_entry_id??void 0,object_name:i.suggested_object_name,device_id:i.device_id??void 0})),t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/adopt",selections:e});this.dispatchEvent(new CustomEvent("problem-sensors-adopted",{bubbles:!0,composed:!0,detail:t})),this._open=!1}catch(e){this._error=M(e,this._lang)}finally{this._adopting=!1}}}}get _lang(){return this.hass?.language||"en"}updated(e){e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,Q(this._lang).then(()=>this.requestUpdate()))}async open(){this._open=!0,this._loading=!0,this._error="",this._sensors=[],this._selected=new Set;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/problem_sensors/discover"});this._sensors=e.sensors||[],this._selected=new Set(this._sensors.map(t=>t.entity_id))}catch(e){this._error=M(e,this._lang)}finally{this._loading=!1}}_close(){this._open=!1}render(){if(!this._open)return o``;let e=this._lang,t=this._sensors.length>0&&this._selected.size===this._sensors.length;return o`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${i=>i.stopPropagation()}>
          <div class="title">${s("adopt_problem_title",e)}</div>
          <div class="hint">${s("adopt_problem_hint",e)}</div>
          ${this._error?o`<div class="error">${this._error}</div>`:p}

          ${this._loading?o`<div class="loading">…</div>`:this._sensors.length===0?o`<div class="empty">${s("adopt_problem_none",e)}</div>`:o`
                  <label class="select-all">
                    <input
                      type="checkbox"
                      .checked=${t}
                      @change=${this._toggleAll}
                    />
                    <span>${s("selected",e)}: ${this._selected.size} / ${this._sensors.length}</span>
                  </label>
                  <div class="list">
                    ${this._sensors.map(i=>{let a=this._selected.has(i.entity_id),l=i.state==="on",c=[i.device_name,i.area_name].filter(Boolean).join(" \xB7 ");return o`
                        <label class="row">
                          <input
                            type="checkbox"
                            .checked=${a}
                            @change=${()=>this._toggle(i.entity_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${i.name}</span>
                              <span class="chip ${l?"chip-active":"chip-ok"}">
                                ${l?s("adopt_problem_active",e):s("adopt_problem_ok",e)}
                              </span>
                            </div>
                            ${c?o`<div class="row-sub">${c}</div>`:p}
                            <div class="row-target">
                              → ${i.suggested_object_name}${i.suggested_entry_id?p:o` <span class="new-tag">${s("adopt_problem_new_object",e)}</span>`}
                            </div>
                          </div>
                        </label>
                      `})}
                  </div>
                `}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${s("cancel",e)}
            </ha-button>
            <ha-button
              @click=${this._adopt}
              .disabled=${this._selected.size===0||this._adopting}
            >
              ${s("adopt_problem_adopt",e)}
            </ha-button>
          </div>
        </div>
      </div>
    `}};re.styles=j`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .card {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 360px;
      max-width: 560px;
      width: 90vw;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    .title {
      font-size: 18px;
      font-weight: 500;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
    }
    .loading,
    .empty {
      color: var(--secondary-text-color);
      font-size: 14px;
      padding: 12px 0;
    }
    .select-all {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .select-all input {
      cursor: pointer;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      overflow-y: auto;
      max-height: 50vh;
    }
    .row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      cursor: pointer;
    }
    .row input {
      margin-top: 2px;
      cursor: pointer;
    }
    .row-main {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }
    .row-top {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .row-name {
      font-weight: 500;
      font-size: 13px;
    }
    .row-sub {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .row-target {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .new-tag {
      font-style: italic;
    }
    .chip {
      font-size: 11px;
      padding: 1px 8px;
      border-radius: 10px;
      white-space: nowrap;
    }
    .chip-active {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .chip-ok {
      background: var(--divider-color);
      color: var(--secondary-text-color);
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 8px;
    }
  `,d([y({attribute:!1})],re.prototype,"hass",2),d([_()],re.prototype,"_open",2),d([_()],re.prototype,"_loading",2),d([_()],re.prototype,"_adopting",2),d([_()],re.prototype,"_error",2),d([_()],re.prototype,"_sensors",2),d([_()],re.prototype,"_selected",2);customElements.get("maintenance-adopt-problem-sensors-dialog")||customElements.define("maintenance-adopt-problem-sensors-dialog",re);var yi=5;function Qe(r){let n=r.getFullYear(),e=String(r.getMonth()+1).padStart(2,"0"),t=String(r.getDate()).padStart(2,"0");return`${n}-${e}-${t}`}function Rs(r,n){let e=[];for(let t=0;t<n;t++){let i=new Date(r);i.setDate(i.getDate()+t),i.setHours(0,0,0,0),e.push(Qe(i))}return e}function bt(r,n){let[e,t,i]=r.split("-").map(Number),a=new Date(e,t-1,i);return a.setDate(a.getDate()+n),Qe(a)}function Is(r){if(!r||r.length===0)return null;let n=r.map(e=>e.cost).filter(e=>typeof e=="number");return n.length===0?null:n.reduce((e,t)=>e+t,0)/n.length}function Ls(r){let{windowStart:n,windowEnd:e,task:t,entryId:i,objectName:a}=r,l=[],c=(m,v)=>({date:m,entry_id:i,task_id:t.id,task_name:t.name,object_name:a,status:v&&(t.status==="overdue"||t.status==="triggered")?"ok":t.status,days_until_due:v?null:t.days_until_due??null,projected:v,schedule_type:t.schedule_type,interval_days:t.interval_days??null,interval_unit:t.interval_unit??null,responsible_user_id:t.responsible_user_id??null,avg_cost:Is(t.history),adaptive_enabled:!!t.adaptive_config?.enabled,prediction_confidence:t.threshold_prediction_confidence??null}),h=Math.max(1,Math.round(Ot(t.interval_days,t.interval_unit)));if(t.status==="overdue"||t.status==="triggered"){if(l.push(c(n,!1)),t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let m=bt(n,h),v=1;for(;m<=e&&v<yi;)l.push(c(m,!0)),v++,m=bt(m,h)}return l}let u=t.next_due;if(typeof u!="string"||!u)return l;let g=u.slice(0,10);if(g>=n&&g<=e)l.push(c(g,!1));else if(g>e)return l;if(t.schedule_type==="time_based"&&t.interval_days&&t.interval_days>0){let m=bt(g,h),v=l.length;for(;m<=e&&v<yi;)m>=n&&(l.push(c(m,!0)),v++),m=bt(m,h)}return l}var xi={overdue:0,triggered:1,due_soon:2,ok:3};function $i(r,n,e,t=null){let i=Rs(n,e),a=i[0],l=i[i.length-1],c=[];for(let u of r){let g=u.object?.name||"",m=u.entry_id,v=u.tasks||[];for(let f of v){if(t&&f.responsible_user_id!==t||f.enabled===!1)continue;let $=Ls({windowStart:a,windowEnd:l,task:f,entryId:m,objectName:g});c.push(...$)}}let h=new Map;for(let u of i)h.set(u,[]);for(let u of c){let g=h.get(u.date);g&&g.push(u)}for(let[,u]of h)u.sort((g,m)=>{let v=xi[g.status]??99,f=xi[m.status]??99;if(v!==f)return v-f;if(g.projected!==m.projected)return g.projected?1:-1;let $=g.object_name.localeCompare(m.object_name);return $!==0?$:g.task_name.localeCompare(m.task_name)});return i.map(u=>({date:u,events:h.get(u)??[]}))}var Ps={completed:"ok",reset:"ok",skipped:"due_soon",triggered:"triggered",trigger_replaced:"triggered",trigger_removed:"ok"};function zs(r,n){let e=[];for(let t=n-1;t>=0;t--){let i=new Date(r);i.setDate(i.getDate()-t),i.setHours(0,0,0,0),e.push(Qe(i))}return e}function wi(r,n,e,t=null){let i=zs(n,e),a=i[0],l=i[i.length-1],c=new Map;for(let u of i)c.set(u,[]);for(let u of r){let g=u.object?.name||"",m=u.entry_id,v=u.tasks||[];for(let f of v){if(t&&f.responsible_user_id!==t)continue;let $=f.history||[];for(let b of $){if(typeof b?.timestamp!="string")continue;let A=b.timestamp.slice(0,10);if(A<a||A>l)continue;let C=c.get(A);if(!C)continue;let L=b.type??"completed";C.push({date:A,entry_id:m,task_id:f.id,task_name:f.name,object_name:g,status:Ps[L]??"ok",days_until_due:null,projected:!1,schedule_type:f.schedule_type,interval_days:f.interval_days??null,responsible_user_id:f.responsible_user_id??null,avg_cost:typeof b.cost=="number"?b.cost:null,adaptive_enabled:!!f.adaptive_config?.enabled,prediction_confidence:null,history_timestamp:b.timestamp,history_type:L,history_cost:typeof b.cost=="number"?b.cost:null,history_notes:typeof b.notes=="string"?b.notes:null,history_duration:typeof b.duration=="number"?b.duration:null})}}}let h={completed:0,reset:1,skipped:2,triggered:3,trigger_replaced:4};for(let[,u]of c)u.sort((g,m)=>{let v=h[g.history_type??""]??99,f=h[m.history_type??""]??99;if(v!==f)return v-f;let $=g.object_name.localeCompare(m.object_name);return $!==0?$:g.task_name.localeCompare(m.task_name)});return i.map(u=>({date:u,events:c.get(u)??[]}))}var ki=j`
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
  .cal-status-ok        { background: var(--success-color, #4caf50); }

  @media (max-width: 600px) {
    .cal-controls { padding: 10px 12px; }
    .cal-rolling { padding: 6px 12px 24px; }
    .cal-day-pill { width: 48px; height: 48px; }
    .cal-pill-day { font-size: 17px; }
    .cal-user-filter { margin-left: 0; width: 100%; }
  }
`;var ne=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"};this._objects=[];this._stats=null;this._windowDays=30;this._pastDays=0;this._userFilter="";this._unsub=null;this._dataLoaded=!1;this._lastConnection=null}static getConfigElement(){return document.createElement("maintenance-supporter-calendar-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-calendar-card",window_days:30,show_window_chips:!0,show_user_filter:!0}}setConfig(e){this._config={...e},e.past_days&&[30,90].includes(e.past_days)?this._pastDays=e.past_days:e.window_days&&[7,14,30,365].includes(e.window_days)&&(this._windowDays=e.window_days,this._pastDays=0),typeof e.user_filter=="string"&&(this._userFilter=e.user_filter)}getCardSize(){return 6}get _lang(){return this.hass?.language||"en"}disconnectedCallback(){if(super.disconnectedCallback(),this._unsub){try{this._unsub()}catch{}this._unsub=null}this._dataLoaded=!1,this._lastConnection=null}updated(e){super.updated(e);let t=this.hass?.language;if(t&&!lt(t)&&Q(t).then(()=>this.requestUpdate()),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){try{let[e,t]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);this._objects=e.objects,this._stats=t}catch{}}async _subscribe(){try{let e=await this.hass.connection.subscribeMessage(t=>{let i=t;this._objects=i.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected){e();return}this._unsub=e}catch{}}_onEventClick(e){if(e.history_timestamp){this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:edit-history",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:e.history_timestamp},bubbles:!0,composed:!0}));return}this.dispatchEvent(new CustomEvent("ll-custom",{detail:{type:"maintenance-supporter:open-task",entry_id:e.entry_id,task_id:e.task_id},bubbles:!0,composed:!0}))}render(){if(!this.hass)return p;let e=this._lang,t=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,a=this._config.title,l=null;this._userFilter&&(l=this._userFilter==="current_user"?this.hass?.user?.id??null:this._userFilter);let c=new Date;c.setHours(0,0,0,0);let h=this._pastDays>0,u=h?wi(this._objects,c,this._pastDays,l):$i(this._objects,c,this._windowDays,l),g=Qe(c),m=this._windowDays===365||h,v=m?u.filter(b=>b.events.length>0):u,f=b=>{let A=`cal-status-${b.status}`,C=b.projected?"cal-event-projected":"",L=b.status==="overdue"&&b.days_until_due!=null?` (${Math.abs(b.days_until_due)}d ${s("overdue",e).toLowerCase()})`:"",I=b.projected&&b.interval_days?o`<span class="cal-event-recur">${b.interval_unit&&b.interval_unit!=="days"?`${b.interval_days} ${s("unit_"+b.interval_unit,e)}`:s("cal_every_n_days",e).replace("{n}",String(b.interval_days))}</span>`:p,E=b.schedule_type==="sensor_based",Z=E?o`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${s("cal_source_sensor",e)}" icon="mdi:trending-up"></ha-icon>`:o`<ha-icon class="cal-event-icon cal-source-time"
                title="${b.adaptive_enabled?s("cal_source_time_adaptive",e):s("cal_source_time",e)}"
                icon="${b.adaptive_enabled?"mdi:clock-time-four-outline":"mdi:clock-outline"}"></ha-icon>`,X=E&&b.prediction_confidence&&b.status!=="triggered"&&!b.projected?o`<span class="cal-event-prediction cal-conf-${b.prediction_confidence}">
            ${s("cal_predicted",e)} · ${s(`cal_confidence_${b.prediction_confidence}`,e)}
          </span>`:p,G=this._stats?.budget?.currency_symbol||Ee,U=b.history_type?s(b.history_type,e):s(b.status,e);return o`
        <div class="cal-event ${C}"
          @click=${()=>this._onEventClick(b)}>
          ${Z}
          <span class="cal-status-pill ${A}">${U}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${b.object_name} · ${b.task_name}${L}</div>
            ${X}
            ${I}
          </div>
          ${b.avg_cost!=null&&b.avg_cost>0?o`<span class="cal-event-cost">${b.avg_cost.toFixed(0)} ${G}</span>`:p}
        </div>
      `},$=b=>{let[A,C,L]=b.date.split("-").map(Number),I=new Date(A,C-1,L),E=b.date===g,Z=I.toLocaleDateString(e,{weekday:"short"}),X=I.toLocaleDateString(e,{month:"long"});return o`
        <div class="cal-day-row">
          <div class="cal-day-pill ${E?"cal-today":""}">
            <span class="cal-pill-weekday">${Z}</span>
            <span class="cal-pill-day">${I.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${X}</span>
              ${E?o`<span class="cal-day-today-badge">${s("today",e)}</span>`:p}
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
                    `:p}
                ${i?o`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${b=>{this._userFilter=b.target.value}}>
                        <option value="">${s("all_users",e)}</option>
                        <option value="current_user">${s("my_tasks",e)}</option>
                      </select>
                    `:p}
              </div>
            `:p}
        <div class="cal-rolling">
          ${v.length===0&&m?o`<div class="cal-empty">${s("cal_no_events",e)}</div>`:v.map($)}
        </div>
      </ha-card>
    `}};ne.styles=[pt,ki,j`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `],d([y({attribute:!1})],ne.prototype,"hass",2),d([_()],ne.prototype,"_config",2),d([_()],ne.prototype,"_objects",2),d([_()],ne.prototype,"_stats",2),d([_()],ne.prototype,"_windowDays",2),d([_()],ne.prototype,"_pastDays",2),d([_()],ne.prototype,"_userFilter",2),d([_()],ne.prototype,"_unsub",2);var Hs=[{value:7,label:"Week (7 days)"},{value:14,label:"Fortnight (14 days)"},{value:30,label:"Month (30 days, default)"},{value:365,label:"Year (365 days, empty days collapsed)"}],Le=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-calendar-card"}}setConfig(e){this._config={...e}}_valueChanged(e,t){let i={...this._config,[e]:t};e==="show_window_chips"&&t===!0&&delete i.show_window_chips,e==="show_user_filter"&&t===!0&&delete i.show_user_filter,e==="title"&&(!t||typeof t=="string"&&t.trim()==="")&&delete i.title,e==="user_filter"&&t===""&&delete i.user_filter,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let e=this._config.window_days??30,t=this._config.show_window_chips!==!1,i=this._config.show_user_filter!==!1,a=this._config.user_filter??"",l=this._config.title??"";return o`
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
            ${Hs.map(c=>o`<option value="${c.value}" ?selected=${c.value===e}>${c.label}</option>`)}
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
    `}};Le.styles=j`
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
  `,d([y({attribute:!1})],Le.prototype,"hass",2),d([_()],Le.prototype,"_config",2);customElements.get("maintenance-supporter-calendar-card")||customElements.define("maintenance-supporter-calendar-card",ne);customElements.get("maintenance-supporter-calendar-card-editor")||customElements.define("maintenance-supporter-calendar-card-editor",Le);var ft=window;ft.customCards=ft.customCards||[];var Ei="maintenance-supporter-calendar-card",Ds=ft.customCards.some(r=>r.type===Ei);Ds||ft.customCards.push({type:Ei,name:"Maintenance Supporter \u2014 Calendar",description:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",preview:!0});var ue=class extends S{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null}get _lang(){return this.hass?.language||"en"}openEdit(e){this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0}close(){this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _save(){if(!(!this._draft||!this._originalSnapshot)){this._saving=!0,this._error="";try{let e={type:"maintenance_supporter/task/history/update",entry_id:this._draft.entry_id,task_id:this._draft.task_id,original_timestamp:this._originalSnapshot.original_timestamp};if(this._draft.timestamp!==this._originalSnapshot.timestamp&&(e.timestamp=this._draft.timestamp),this._draft.notes!==this._originalSnapshot.notes&&(e.notes=this._draft.notes),this._draft.cost!==this._originalSnapshot.cost&&(e.cost=this._draft.cost),this._draft.duration!==this._originalSnapshot.duration&&(e.duration=this._draft.duration),this._draft.completed_by!==this._originalSnapshot.completed_by&&(e.completed_by=this._draft.completed_by),Object.keys(e).filter(i=>!["type","entry_id","task_id","original_timestamp"].includes(i)).length===0){this.close();return}await this.hass.connection.sendMessagePromise(e),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:this._draft.entry_id,task_id:this._draft.task_id,new_timestamp:this._draft.timestamp},bubbles:!0,composed:!0})),this.close()}catch(e){this._error=M(e,this._lang)}finally{this._saving=!1}}}render(){if(!this._open||!this._draft)return p;let e=this._lang,t=this._draft;return o`
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
    `}};ue.styles=j`
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
  `,d([y({attribute:!1})],ue.prototype,"hass",2),d([_()],ue.prototype,"_open",2),d([_()],ue.prototype,"_saving",2),d([_()],ue.prototype,"_error",2),d([_()],ue.prototype,"_draft",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",ue);var te=class extends S{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel="",this._inputType="",this._inputValue="",this._open=!0,new Promise(t=>{this._resolve=t,this._promptResolve=null})}prompt(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"text",this._inputValue=e.inputValue||"",this._open=!0,new Promise(t=>{this._promptResolve=t,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return p;let e=this.hass?.language||"en";return o`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel?o`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              <input class="field-input"
                type="${this._inputType||"text"}"
                .value=${this._inputValue}
                @input=${t=>this._inputValue=t.target.value} />
            </label>
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
    `}};te.styles=[dt,j`
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
  `],d([y({attribute:!1})],te.prototype,"hass",2),d([_()],te.prototype,"_open",2),d([_()],te.prototype,"_title",2),d([_()],te.prototype,"_message",2),d([_()],te.prototype,"_confirmText",2),d([_()],te.prototype,"_danger",2),d([_()],te.prototype,"_inputLabel",2),d([_()],te.prototype,"_inputType",2),d([_()],te.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",te);var Ti={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Si=r=>(...n)=>({_$litDirective$:r,values:n}),yt=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,e,t){this._$Ct=n,this._$AM=e,this._$Ci=t}_$AS(n,e){return this.update(n,e)}update(n,e){return this.render(...e)}};var Je=class extends yt{constructor(n){if(super(n),this.it=p,n.type!==Ti.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(n){if(n===p||n==null)return this._t=void 0,this.it=n;if(n===he)return n;if(typeof n!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(n===this.it)return this._t;this.it=n;let e=[n];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};Je.directiveName="unsafeHTML",Je.resultType=1;var Ai=Si(Je);var Os=["EUR","USD","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","CZK","PLN","RUB","SEK","NOK","DKK","UAH"],R=class extends S{constructor(){super(...arguments);this.budget=null;this._settings=null;this._loading=!0;this._importCsv="";this._importLoading=!1;this._includeHistory=!0;this._toast="";this._testingNotification=!1;this._users=[];this._vacEnabled=!1;this._vacStart="";this._vacEnd="";this._vacBuffer=3;this._vacExempt=new Set;this._vacIsActive=!1;this._vacWindowEnd=null;this._vacAllTasks=[];this._vacPreview=[];this._vacPreviewLoading=!1;this._vacSaving=!1;this._qrObjects=[];this._qrSelectedEntries=new Set;this._qrActions=new Set(["view"]);this._qrUrlMode="companion";this._qrBatchLoading=!1;this._qrBatchResults=[];this._qrObjectsLoaded=!1;this._exportObjects=[];this._exportSelectedEntries=new Set;this._exportObjectsLoaded=!1;this._docArchiveLoading=!1;this._loaded=!1;this._userService=null;this._sendTestNotification=async()=>{this._testingNotification=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/test_notification"}),t=e.message||(e.success?s("test_notification_success",this._lang):s("test_notification_failed",this._lang));this._showToast(t)}catch{this._showToast(s("test_notification_failed",this._lang))}finally{this._testingNotification=!1}};this._allTemplates=[];this._templateCategories={};this._templatesRequested=!1}get _lang(){return this.hass?.language||"en"}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._loaded?(this._loaded=!0,this._userService=new be(this.hass),this._loadSettings(),this._loadUsers()):e.has("hass")&&this.hass&&this._userService&&this._userService.updateHass(this.hass)}async _loadUsers(){if(this._userService)try{this._users=await this._userService.getUsers()}catch{this._users=[]}}async _loadSettings(){this._loading=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"});this._settings=e,this._hydrateVacationFromSettings()}catch{}this._loading=!1}_hydrateVacationFromSettings(){let e=this._settings?.vacation;e&&(this._vacEnabled=e.enabled,this._vacStart=e.start||"",this._vacEnd=e.end||"",this._vacBuffer=e.buffer_days,this._vacExempt=new Set(e.exempt_task_ids||[]),this._vacIsActive=e.is_active,this._vacWindowEnd=e.window_end)}async _updateSetting(e,t){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/global/update",settings:{[e]:t}});this._settings=i,this._showToast(s("settings_saved",this._lang)),this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(s("action_error",this._lang))}}_showToast(e){this._toast=e,setTimeout(()=>{this._toast=""},3e3)}_downloadFile(e,t,i){_t(e,t,i)}render(){let e=this._lang;return this._loading||!this._settings?o`<div class="settings-loading">Loading…</div>`:o`
      ${this._renderFeatures(e)}
      ${this._renderPanelAccess(e)}
      ${this._renderGeneral(e)}
      ${this._renderObjectsColumns(e)}
        ${this._renderTemplateToggles(e)}
      ${this._settings.general.notifications_enabled?this._renderNotifications(e):p}
      ${this.features.budget?this._renderBudget(e):p}
      ${this._renderArchive(e)}
      ${this._renderVacation(e)}
      ${this._renderPrintQr(e)}
      ${this._renderImportExport(e)}
      ${this._toast?o`<div class="settings-toast">${this._toast}</div>`:p}
    `}scrollToSection(e){requestAnimationFrame(()=>{let t=this.shadowRoot;if(!t)return;let i=t.querySelector(`[data-section="${e}"]`)??t.querySelector(`[data-section-alt="${e}"]`);i&&i.scrollIntoView({behavior:"smooth",block:"start"})})}_renderPanelAccess(e){let t=new Set(this._settings.admin_panel_user_ids||[]),i=this._users.filter(c=>!c.is_admin),a=this._settings.operator_write_enabled??!1,l=(c,h)=>{let u=new Set(t);h?u.add(c):u.delete(c),this._updateSetting("admin_panel_user_ids",[...u])};return o`
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
                  @change=${h=>l(c.id,h.target.checked)} />
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
    `}async _loadTemplates(){if(!this._templatesRequested){this._templatesRequested=!0;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._allTemplates=e.templates||[],this._templateCategories=e.categories||{}}catch{}}}_renderTemplateToggles(e){this._loadTemplates();let t=new Set(this._settings.disabled_template_ids||[]);return o`
      <div class="settings-section" data-section="templates">
        <h3>${s("settings_templates_label",e)}</h3>
        <p class="section-desc">${s("settings_templates_hint",e)}</p>
        ${this._allTemplates.map(i=>o`
          <label class="setting-row">
            <span>
              <span class="setting-label">${i.name}</span>
              <span class="setting-desc">${this._templateCategories[i.category]?.["name_"+e]||this._templateCategories[i.category]?.name_en||i.category}</span>
            </span>
            <input
              type="checkbox"
              .checked=${!t.has(i.id)}
              @change=${a=>this._toggleTemplate(i.id,a.target.checked)}
            />
          </label>
        `)}
      </div>
    `}_toggleTemplate(e,t){let i=new Set(this._settings.disabled_template_ids||[]);t?i.delete(e):i.add(e),this._updateSetting("disabled_template_ids",[...i])}_renderObjectsColumns(e){let t=Ge(this._settings.objects_table_columns);return o`
      <div class="settings-section" data-section="objects_table_columns">
        <h3>${s("objects_table_columns_label",e)}</h3>
        <p class="section-desc">${s("objects_table_columns_hint",e)}</p>
        ${Re.map(i=>o`
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
    `}_toggleColumn(e,t){let i=new Set(Ge(this._settings.objects_table_columns));t?i.add(e):i.delete(e);let a=Re.filter(l=>l.required||i.has(l.key)).map(l=>l.key);this._updateSetting("objects_table_columns",a)}_renderGeneral(e){let t=this._settings.general,i=t.notify_targets??[],a=this._settings.budget;return o`
      <div class="settings-section">
        <h3>${s("settings_general",e)}</h3>
        <label class="setting-row">
          <span class="setting-label">${s("settings_default_warning",e)}</span>
          <input type="number" min="1" max="365" .value=${String(t.default_warning_days)}
            @change=${l=>{let c=parseInt(l.target.value,10);c>=1&&c<=365&&this._updateSetting("default_warning_days",c)}} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_currency",e)}</span>
          <select @change=${l=>this._updateSetting("budget_currency",l.target.value)}>
            ${Os.map(l=>o`<option value=${l} ?selected=${a.currency===l}>${l}</option>`)}
          </select>
        </label>
        <label class="setting-row">
          <span class="setting-label">${s("settings_panel_enabled",e)}</span>
          <input type="checkbox" .checked=${t.panel_enabled}
            @change=${l=>this._updateSetting("panel_enabled",l.target.checked)} />
        </label>
        ${t.panel_enabled?o`
          <label class="setting-row">
            <span class="setting-label">${s("settings_panel_title",e)}</span>
            <input type="text" .value=${t.panel_title??""}
              placeholder="Maintenance"
              maxlength="50"
              @change=${l=>this._updateSetting("panel_title",l.target.value.trim())} />
          </label>
        `:""}
        <label class="setting-row">
          <span class="setting-label">${s("settings_notifications",e)}</span>
          <input type="checkbox" .checked=${t.notifications_enabled}
            @change=${l=>this._updateSetting("notifications_enabled",l.target.checked)} />
        </label>
        ${t.notifications_enabled?o`
          <label class="setting-row">
            <span class="setting-label">${s("settings_notify_service",e)}</span>
            <input type="text" list="ms-notify-services" .value=${t.notify_service}
              @change=${l=>this._updateSetting("notify_service",l.target.value.trim())} />
            <datalist id="ms-notify-services">
              ${i.map(l=>o`<option value=${l}></option>`)}
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
        <label class="setting-row">
          <span class="setting-label">${s("settings_reminder_leads",e)}</span>
          <input type="text" placeholder="14, 3, 0"
            .value=${(t.reminder_lead_days||[]).join(", ")}
            @change=${a=>{let l=a.target.value.split(",").map(c=>parseInt(c.trim(),10)).filter(c=>Number.isInteger(c)&&c>=0&&c<=365);this._updateSetting("reminder_lead_days",[...new Set(l)])}} />
        </label>
        <div class="setting-hint">${s("settings_reminder_leads_hint",e)}</div>

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
        <label class="setting-row">
          <span class="setting-label">${s("settings_weekly_digest",e)}</span>
          <input type="checkbox" .checked=${i.weekly_digest_enabled}
            @change=${a=>this._updateSetting("weekly_digest_enabled",a.target.checked)} />
        </label>
        <div class="setting-hint">${s("settings_weekly_digest_hint",e)}</div>
        <label class="setting-row">
          <span class="setting-label">${s("settings_warranty_reminder",e)}</span>
          <input type="checkbox" .checked=${i.warranty_reminder_enabled}
            @change=${a=>this._updateSetting("warranty_reminder_enabled",a.target.checked)} />
        </label>
        ${i.warranty_reminder_enabled?o`
          <label class="setting-row sub-row">
            <span class="setting-desc">${s("settings_warranty_reminder_days",e)}</span>
            <input type="number" min="1" max="365" .value=${String(i.warranty_reminder_days)}
              @change=${a=>this._updateSetting("warranty_reminder_days",parseInt(a.target.value,10)||30)} />
          </label>
        `:p}
        <div class="setting-hint">${s("settings_warranty_reminder_hint",e)}</div>
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
        ${l.sort((c,h)=>c.task_name.localeCompare(h.task_name)).map(c=>o`
            <label class="vac-task-row">
              <input type="checkbox"
                .checked=${this._vacExempt.has(c.task_id)}
                @change=${h=>this._toggleVacationExempt(c.task_id,h.target.checked)} />
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
                          @change=${h=>this._toggleQrObject(c.entry_id,h.target.checked)} />
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
                        @change=${h=>this._toggleQrAction(c,h.target.checked)} />
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
                      <div class="qr-svg">${Ai(c.svg)}</div>
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
    `}async _loadQrObjects(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._qrObjects=(e.objects||[]).map(t=>({entry_id:t.entry_id,name:t.object.name,task_count:(t.tasks||[]).length})).sort((t,i)=>t.name.localeCompare(i.name)),this._qrObjectsLoaded=!0}catch{this._showToast(s("action_error",this._lang))}}_toggleQrObject(e,t){let i=new Set(this._qrSelectedEntries);if(i.size===0)for(let a of this._qrObjects)i.add(a.entry_id);t?i.add(e):i.delete(e),i.size===this._qrObjects.length&&i.clear(),this._qrSelectedEntries=i}_toggleQrAction(e,t){let i=new Set(this._qrActions);t?i.add(e):i.delete(e),this._qrActions=i}async _generateBatch(){this._qrBatchLoading=!0,this._qrBatchResults=[];try{let e={type:"maintenance_supporter/qr/batch_generate",actions:[...this._qrActions],url_mode:this._qrUrlMode};this._qrSelectedEntries.size>0&&(e.entry_ids=[...this._qrSelectedEntries]);let t=await this.hass.connection.sendMessagePromise(e);this._qrBatchResults=t.qrs||[],this._qrBatchResults.length===0&&this._showToast(s("qr_print_empty",this._lang))}catch(e){let t=e?.message||s("action_error",this._lang);this._showToast(t)}finally{this._qrBatchLoading=!1}}_printQrs(){if(this._qrBatchResults.length===0)return;let e=this._lang,t=this._qrBatchResults.map(c=>{let h=s("qr_action_"+c.action,e);return`
        <div class="cell">
          <div class="qr">${c.svg}</div>
          <div class="label">
            <div class="obj">${this._escapeHtml(c.object_name)}</div>
            <div class="task">${this._escapeHtml(c.task_name)}</div>
            <div class="action">${this._escapeHtml(h)}</div>
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
          ${this._exportObjectsLoaded?o`
              <details class="qr-filter-panel">
                <summary>${s("settings_export_selection",e)}</summary>
                <div class="qr-object-list">
                  ${this._exportObjects.length===0?o`<div class="hint">${s("no_objects",e)}</div>`:this._exportObjects.map(t=>o`
                      <label class="qr-object-row">
                        <input type="checkbox"
                          .checked=${this._exportSelectedEntries.size===0||this._exportSelectedEntries.has(t.entry_id)}
                          @change=${i=>this._toggleExportObject(t.entry_id,i.target.checked)} />
                        <span>${t.name}</span>
                        <span class="qr-task-count">${t.task_count}</span>
                      </label>
                    `)}
                </div>
              </details>
            `:o`<button @click=${this._loadExportObjects}>${s("settings_export_selection",e)}</button>`}
        </div>
        <div class="settings-actions">
          <button @click=${this._exportJson}>${s("settings_export_json",e)}</button>
          <button @click=${this._exportYaml}>${s("settings_export_yaml",e)}</button>
          <button @click=${this._exportCsv}>${s("settings_export_csv",e)}</button>
        </div>
        <div class="settings-actions docs-archive-block">
          <h4>${s("settings_docs_archive",e)}</h4>
          <p class="section-desc">${s("settings_docs_archive_hint",e)}</p>
          <div class="settings-actions">
            <button ?disabled=${this._docArchiveLoading} @click=${this._exportDocsArchive}>
              ${s("settings_docs_export_btn",e)}
            </button>
            <button ?disabled=${this._docArchiveLoading} @click=${this._triggerDocsArchiveImport}>
              ${this._docArchiveLoading?"\u2026":s("settings_docs_import_btn",e)}
            </button>
            <input class="docs-archive-file" type="file" accept=".zip" hidden
              @change=${this._importDocsArchive} />
          </div>
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
    `}get _selectedEntryIds(){return this._exportSelectedEntries.size?[...this._exportSelectedEntries]:void 0}async _loadExportObjects(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._exportObjects=(e.objects||[]).map(t=>({entry_id:t.entry_id,name:t.object.name,task_count:(t.tasks||[]).length})).sort((t,i)=>t.name.localeCompare(i.name)),this._exportObjectsLoaded=!0}catch{this._showToast(s("action_error",this._lang))}}_toggleExportObject(e,t){let i=new Set(this._exportSelectedEntries);if(i.size===0)for(let a of this._exportObjects)i.add(a.entry_id);t?i.add(e):i.delete(e),i.size===this._exportObjects.length&&i.clear(),this._exportSelectedEntries=i}async _exportJson(){try{let e=this._selectedEntryIds,t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/export",format:"json",include_history:this._includeHistory,...e?{entry_ids:e}:{}}),i=new Date().toISOString().slice(0,10);this._downloadFile(t.data,`maintenance_export_${i}.json`,"application/json"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _exportYaml(){try{let e=this._selectedEntryIds,t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/export",format:"yaml",include_history:this._includeHistory,...e?{entry_ids:e}:{}}),i=new Date().toISOString().slice(0,10);this._downloadFile(t.data,`maintenance_export_${i}.yaml`,"application/yaml"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _exportCsv(){try{let e=this._selectedEntryIds,t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/csv/export",...e?{entry_ids:e}:{}}),i=new Date().toISOString().slice(0,10);this._downloadFile(t.csv,`maintenance_export_${i}.csv`,"text/csv"),this._showToast(s("settings_export_success",this._lang))}catch{this._showToast(s("action_error",this._lang))}}async _importCsvAction(){let e=this._importCsv.trim();if(e){this._importLoading=!0;try{let t=e.startsWith("object_name"),a=(await this.hass.connection.sendMessagePromise(t?{type:"maintenance_supporter/csv/import",csv_content:e}:{type:"maintenance_supporter/json/import",json_content:e})).created??0;this._showToast(s("settings_import_success",this._lang).replace("{count}",String(a))),this._importCsv="",this.dispatchEvent(new CustomEvent("settings-changed"))}catch{this._showToast(s("action_error",this._lang))}this._importLoading=!1}}async _exportDocsArchive(){this._docArchiveLoading=!0;try{let e=this._selectedEntryIds,t=e?`?entry_ids=${encodeURIComponent(e.join(","))}`:"",i=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/documents/archive${t}`,expires:300}),a=document.createElement("a");a.href=i.path,a.download="maintenance-documents.zip",document.body.appendChild(a),a.click(),a.remove()}catch{this._showToast(s("action_error",this._lang))}this._docArchiveLoading=!1}_triggerDocsArchiveImport(){this.renderRoot.querySelector(".docs-archive-file")?.click()}async _importDocsArchive(e){let t=e.target,i=t.files?.[0];if(i){this._docArchiveLoading=!0;try{let a=new FormData;a.append("file",i,i.name);let l=await fetch("/api/maintenance_supporter/documents/archive",{method:"POST",headers:{Authorization:`Bearer ${this.hass.auth?.data?.access_token??""}`},body:a});if(!l.ok)this._showToast(s("action_error",this._lang));else{let c=await l.json();this._showToast(s("settings_docs_import_success",this._lang).replace("{blobs}",String(c.blobs_written??0)).replace("{docs}",String(c.documents_created??0))),this.dispatchEvent(new CustomEvent("settings-changed"))}}catch{this._showToast(s("action_error",this._lang))}t.value="",this._docArchiveLoading=!1}}};R.styles=j`
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
  `,d([y({attribute:!1})],R.prototype,"hass",2),d([y({attribute:!1})],R.prototype,"features",2),d([y({attribute:!1})],R.prototype,"budget",2),d([_()],R.prototype,"_settings",2),d([_()],R.prototype,"_loading",2),d([_()],R.prototype,"_importCsv",2),d([_()],R.prototype,"_importLoading",2),d([_()],R.prototype,"_includeHistory",2),d([_()],R.prototype,"_toast",2),d([_()],R.prototype,"_testingNotification",2),d([_()],R.prototype,"_users",2),d([_()],R.prototype,"_vacEnabled",2),d([_()],R.prototype,"_vacStart",2),d([_()],R.prototype,"_vacEnd",2),d([_()],R.prototype,"_vacBuffer",2),d([_()],R.prototype,"_vacExempt",2),d([_()],R.prototype,"_vacIsActive",2),d([_()],R.prototype,"_vacWindowEnd",2),d([_()],R.prototype,"_vacAllTasks",2),d([_()],R.prototype,"_vacPreview",2),d([_()],R.prototype,"_vacPreviewLoading",2),d([_()],R.prototype,"_vacSaving",2),d([_()],R.prototype,"_qrObjects",2),d([_()],R.prototype,"_qrSelectedEntries",2),d([_()],R.prototype,"_qrActions",2),d([_()],R.prototype,"_qrUrlMode",2),d([_()],R.prototype,"_qrBatchLoading",2),d([_()],R.prototype,"_qrBatchResults",2),d([_()],R.prototype,"_qrObjectsLoaded",2),d([_()],R.prototype,"_exportObjects",2),d([_()],R.prototype,"_exportSelectedEntries",2),d([_()],R.prototype,"_exportObjectsLoaded",2),d([_()],R.prototype,"_docArchiveLoading",2),d([_()],R.prototype,"_allTemplates",2),d([_()],R.prototype,"_templateCategories",2);customElements.define("maintenance-settings-view",R);var ie=class extends S{constructor(){super(...arguments);this.objects=[];this._summary=null;this._loaded=!1;this._busy=!1;this._error="";this._query="";this._results=[];this._expanded=!1;this._initiallyLoaded=!1;this._searchTimer=0}get _lang(){return this.hass?.language||"en"}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._initiallyLoaded&&(this._initiallyLoaded=!0,this._load(),Q(this._lang).then(()=>this.requestUpdate()))}async _load(){this._busy=!0;try{this._summary=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/storage"}),this._error=""}catch(e){this._error=M(e,this._lang)}finally{this._loaded=!0,this._busy=!1}}_nameFor(e){return this.objects.find(i=>i.object?.id===e)?.object?.name||e.slice(0,8)}_entryFor(e){return this.objects.find(t=>t.object?.id===e)?.entry_id}_toggle(){this._expanded=!this._expanded}_openObject(e){this.dispatchEvent(new CustomEvent("open-object",{detail:{entry_id:e},bubbles:!0,composed:!0}))}_onSearch(e){this._query=e.target.value,clearTimeout(this._searchTimer),this._searchTimer=window.setTimeout(()=>{this._doSearch()},250)}async _doSearch(){let e=this._query.trim();if(!e){this._results=[];return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/search",query:e});this._results=t.results||[]}catch(t){this._error=M(t,this._lang),this._results=[]}}async _openResult(e){if(e.kind==="weblink"){window.open(e.url,"_blank","noopener");return}let t=window.open("about:blank","_blank");try{let i=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${e.id}`,expires:300});t&&(t.location.href=new URL(i.path,window.location.origin).href)}catch(i){t&&t.close(),this._error=M(i,this._lang)}}_renderResult(e,t){return o`
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
                ${ce(e.total_bytes)}
                ${e.dedup_savings_bytes>0?o`<span class="saved">−${ce(e.dedup_savings_bytes)}</span>`:p}
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
                      <div class="stat-value">${ce(e.total_bytes)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${e.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${e.link_count}
                      </div>
                    </div>
                    ${e.dedup_savings_bytes>0?o`<div class="stat">
                          <div class="stat-value saved">−${ce(e.dedup_savings_bytes)}</div>
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
        <span class="obj-size">${ce(e.bytes)}</span>
        ${i?o`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>`:p}
      </div>
    `}};ie.styles=j`
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
  `,d([y({attribute:!1})],ie.prototype,"hass",2),d([y({attribute:!1})],ie.prototype,"objects",2),d([_()],ie.prototype,"_summary",2),d([_()],ie.prototype,"_loaded",2),d([_()],ie.prototype,"_busy",2),d([_()],ie.prototype,"_error",2),d([_()],ie.prototype,"_query",2),d([_()],ie.prototype,"_results",2),d([_()],ie.prototype,"_expanded",2);customElements.get("maintenance-storage-section-card")||customElements.define("maintenance-storage-section-card",ie);var qs=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"],oe=class extends S{constructor(){super(...arguments);this._open=!1;this._loading=!1;this._error="";this._entryId="";this._taskId="";this._values=new Array(12).fill("");this._save=async()=>{let e=this._buildOverrides();if(e!==null){this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:e}),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(t){this._error=M(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}};this._clearAll=async()=>{this._loading=!0,this._error="";try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/seasonal_overrides",entry_id:this._entryId,task_id:this._taskId,overrides:{}}),this._values=new Array(12).fill(""),this._open=!1,this.dispatchEvent(new CustomEvent("overrides-saved"))}catch(e){this._error=M(e,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}open(e,t,i){if(this._entryId=e,this._taskId=t,this._values=new Array(12).fill(""),i)for(let[a,l]of Object.entries(i)){let c=parseInt(a,10);c>=1&&c<=12&&typeof l=="number"&&(this._values[c-1]=l.toString())}this._error="",this._open=!0}_close(){this._open=!1}_buildOverrides(){let e={};for(let t=0;t<12;t++){let i=this._values[t].trim();if(!i)continue;let a=parseFloat(i);if(Number.isNaN(a))return this._error=`${s("month_"+["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][t],this._lang)}: ${s("seasonal_override_invalid",this._lang)}`,null;if(a<.1||a>5)return this._error=s("seasonal_override_range",this._lang),null;e[t+1]=a}return e}render(){if(!this._open)return o``;let e=this._lang;return o`
      <ha-dialog open @closed=${this._close} heading="${s("seasonal_overrides_title",e)}">
        <div class="content">
          <p class="hint">${s("seasonal_overrides_hint",e)}</p>
          ${this._error?o`<div class="error">${this._error}</div>`:p}
          <div class="months">
            ${qs.map((t,i)=>o`
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
    `}};oe.styles=j`
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
  `,d([y({attribute:!1})],oe.prototype,"hass",2),d([_()],oe.prototype,"_open",2),d([_()],oe.prototype,"_loading",2),d([_()],oe.prototype,"_error",2),d([_()],oe.prototype,"_entryId",2),d([_()],oe.prototype,"_taskId",2),d([_()],oe.prototype,"_values",2);customElements.get("maintenance-seasonal-overrides-dialog")||customElements.define("maintenance-seasonal-overrides-dialog",oe);var se=class extends S{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._groupId=null;this._name="";this._description="";this._selected=new Set;this._toggleTask=(e,t)=>{let i=`${e}:${t}`,a=new Set(this._selected);a.has(i)?a.delete(i):a.add(i),this._selected=a};this._save=async()=>{let e=this._name.trim();if(!e){this._error=s("group_name_required",this._lang);return}this._loading=!0,this._error="";try{let t=this._buildTaskRefs();this._groupId?await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/update",group_id:this._groupId,name:e,description:this._description,task_refs:t}):await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/create",name:e,description:this._description,task_refs:t}),this._open=!1,this.dispatchEvent(new CustomEvent("group-saved"))}catch(t){this._error=M(t,this._lang,s("save_error",this._lang))}finally{this._loading=!1}}}get _lang(){return this.hass?.language??navigator.language.split("-")[0]??"en"}openCreate(){this._reset(),this._open=!0}openEdit(e,t){this._reset(),this._groupId=e,this._name=t.name,this._description=t.description||"",this._selected=new Set(t.task_refs.map(i=>`${i.entry_id}:${i.task_id}`)),this._open=!0}_reset(){this._groupId=null,this._name="",this._description="",this._selected=new Set,this._error=""}_close(){this._open=!1}_buildTaskRefs(){return[...this._selected].map(e=>{let[t,i]=e.split(":",2);return{entry_id:t,task_id:i}})}render(){if(!this._open)return o``;let e=this._lang,t=this._groupId?s("edit_group",e):s("new_group",e);return o`
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
    `}};se.styles=j`
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
  `,d([y({attribute:!1})],se.prototype,"hass",2),d([y({attribute:!1})],se.prototype,"objects",2),d([_()],se.prototype,"_open",2),d([_()],se.prototype,"_loading",2),d([_()],se.prototype,"_error",2),d([_()],se.prototype,"_groupId",2),d([_()],se.prototype,"_name",2),d([_()],se.prototype,"_description",2),d([_()],se.prototype,"_selected",2);customElements.get("maintenance-group-dialog")||customElements.define("maintenance-group-dialog",se);var Ns=60,Fs=20,ji=30;function Nt(r){let n=r.trigger_config??null;if(!n)return p;let e=n.type||"threshold",t=r.trigger_entity_info?.unit_of_measurement??"",i=0,a="";if(e==="threshold"){let h=r.trigger_current_value??null;if(h==null)return p;let u=n.trigger_above,g=n.trigger_below;if(u!=null){let m=g??0,v=u-m||1;i=Math.min(100,Math.max(0,(h-m)/v*100)),a=`${h.toFixed(1)} / ${u} ${t}`}else if(g!=null){let v=r.trigger_entity_info?.max??(g*2||100),f=v-g||1;i=Math.min(100,Math.max(0,(v-h)/f*100)),a=`${h.toFixed(1)} / ${g} ${t}`}else return p}else if(e==="counter"){let h=n.trigger_target_value||1,g=r.trigger_current_delta??null??r.trigger_current_value??null;if(g==null)return p;i=Math.min(100,Math.max(0,g/h*100)),a=`${g.toFixed(1)} / ${h} ${t}`}else if(e==="state_change"){let h=n.trigger_target_changes||1,u=r.trigger_current_value??null;if(u==null)return p;i=Math.min(100,Math.max(0,u/h*100)),a=`${Math.round(u)} / ${h}`}else if(e==="runtime"){let h=n.trigger_runtime_hours||100,u=r.trigger_current_value??null;if(u==null)return p;i=Math.min(100,Math.max(0,u/h*100)),a=`${u.toFixed(1)}h / ${h}h`}else if(e==="compound"){let h=n.compound_logic||n.operator||"AND",u=n.conditions?.length||0;a=`${h} (${u})`,i=r.trigger_active?100:0}else return p;let l=i>=100,c=i>90?"var(--error-color, #f44336)":i>70?"var(--warning-color, #ff9800)":"var(--primary-color)";return o`
    <div class="trigger-progress">
      <div class="trigger-progress-bar">
        <div class="trigger-progress-fill${l?" overflow":""}" style="width:${i}%;background:${c}"></div>
      </div>
      <span class="trigger-progress-label">${a}</span>
    </div>
  `}function Ft(r,n,e){if(!r.trigger_config?.entity_id)return p;let t=r.trigger_config.entity_id,i=n.get(t)||[],a=[];if(i.length>=2)a=i.map(E=>({ts:E.ts,val:E.val}));else{if(!r.history)return p;for(let E of r.history)E.trigger_value!=null&&a.push({ts:new Date(E.timestamp).getTime(),val:E.trigger_value})}if(r.trigger_current_value!=null&&a.push({ts:Date.now(),val:r.trigger_current_value}),a.length<2)return p;a.sort((E,Z)=>E.ts-Z.ts);let l=Ns,c=Fs,h=a.map(E=>E.val),u=Math.min(...h),g=Math.max(...h),m=g-u||1;u-=m*.1,g+=m*.1;let v=a[0].ts,$=a[a.length-1].ts-v||1,b=E=>(E-v)/$*l,A=E=>2+(1-(E-u)/(g-u))*(c-4),C=a;if(C.length>ji){let E=Math.ceil(C.length/ji);C=C.filter((Z,X)=>X%E===0||X===C.length-1)}let L=C.map(E=>`${b(E.ts).toFixed(1)},${A(E.val).toFixed(1)}`).join(" "),I=r.trigger_active?"var(--error-color, #f44336)":"var(--primary-color)";return o`
    <svg class="mini-sparkline" viewBox="0 0 ${l} ${c}" preserveAspectRatio="none" role="img" aria-label="${s("chart_mini_sparkline",e)}">
      <polyline points="${L}" fill="none" stroke="${I}" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  `}function Ci(r,n){let e=n;if(r.days_until_due==null||!r.interval_days||r.interval_days<=0)return p;let{pct:t,overflow:i}=ht(r.interval_days,r.days_until_due,r.interval_unit),a="var(--success-color, #4caf50)";return r.status==="overdue"?a="var(--error-color, #f44336)":r.status==="due_soon"&&(a="var(--warning-color, #ff9800)"),o`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${r.last_performed?`${s("last_performed",e)}: ${W(r.last_performed,e)}`:""}</span>
        <span>${r.next_due?`${s("next_due",e)}: ${W(r.next_due,e)}`:""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(t)}" aria-valuemin="0" aria-valuemax="100" aria-label="${s("days_progress",e)}">
        <div class="days-progress-fill${i?" overflow":""}" style="width:${t}%;background:${a}"></div>
      </div>
      <div class="days-progress-text">${Me(r.days_until_due,e)}</div>
    </div>
  `}function Ze(r,n,e=4){if(!isFinite(r)||!isFinite(n))return{ticks:[],niceMin:0,niceMax:1};if(r===n){let u=Math.abs(r)*.1||1;r-=u,n+=u}let t=n-r,i=Math.pow(10,Math.floor(Math.log10(t/Math.max(1,e)))),a=i;for(let u of[1,2,5,10])if(a=i*u,t/a<=e+.5)break;let l=Math.floor(r/a)*a,c=Math.ceil(n/a)*a,h=[];for(let u=l;u<=c+a*1e-6;u+=a)h.push(Math.abs(u)<a*1e-9?0:u);return{ticks:h,niceMin:l,niceMax:c}}function de(r){let n=Math.abs(r);return n>=1e6?Pe((r/1e6).toFixed(n>=1e7?0:1))+"M":n>=1e4?Pe((r/1e3).toFixed(0))+"k":n>=1e3?Pe((r/1e3).toFixed(1))+"k":n>=100?r.toFixed(0):n>=10||n>=1?Pe(r.toFixed(1)):n===0?"0":Pe(r.toFixed(2))}function Pe(r){return r.replace(/\.0+$/,"").replace(/(\.\d*[1-9])0+$/,"$1")}function Se(r,n,e){let t=r.toLocaleString(e,{maximumFractionDigits:Math.abs(r)>=100?0:1});return n?`${t} ${n}`:t}function ze(r,n,e){let t=new Date(r),i=e?{month:"short",day:"numeric",year:"2-digit"}:{month:"short",day:"numeric"};return t.toLocaleDateString(n,i)}function Ut(r,n){return new Date(r).toLocaleDateString(n,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function xt(r,n){return new Date(r).getFullYear()!==new Date(n).getFullYear()}function $t(r,n,e){if(e<2||n<=r)return[r,n];let t=[];for(let i=0;i<e;i++)t.push(r+(n-r)*i/(e-1));return t}var wt=210,le=46,_e=14,ge=12,Mi=14,Us=20+Mi,Bs=[{days:7,key:"chart_range_7d"},{days:30,key:"chart_range_30d"},{days:90,key:"chart_range_90d"},{days:365,key:"chart_range_1y"}],B=class extends S{constructor(){super(...arguments);this.points=[];this.events=[];this.unit="";this.lang="en";this.thresholdAbove=null;this.thresholdBelow=null;this.targetValue=null;this.forceZero=!1;this.projection=null;this.rangeDays=30;this.showRange=!0;this.busy=!1;this.hideOutliers=!1;this.showOutlierToggle=!0;this._width=0;this._hover=null;this._ro=null}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(e=>{let t=Math.floor(e[0]?.contentRect?.width||0);t&&Math.abs(t-this._width)>2&&(this._width=t)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=null}_emitRange(e){e!==this.rangeDays&&this.dispatchEvent(new CustomEvent("range-change",{detail:{days:e},bubbles:!0,composed:!0}))}_toggleOutliers(){this.dispatchEvent(new CustomEvent("outlier-toggle",{detail:{hide:!this.hideOutliers},bubbles:!0,composed:!0}))}render(){let e=this._width||320,t=[...this.points].sort((a,l)=>a.ts-l.ts),i=this.lang;return o`
      <div class="chart-wrap">
        ${this.showRange?o`<div class="range-chips" role="group">
              ${this.showOutlierToggle?o`<button
                    class="range-chip outlier-chip ${this.hideOutliers?"active":""}"
                    ?disabled=${this.busy}
                    title=${s("hide_outliers",i)}
                    @click=${()=>this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>`:p}
              ${Bs.map(a=>o`<button
                  class="range-chip ${this.rangeDays===a.days?"active":""}"
                  ?disabled=${this.busy}
                  @click=${()=>this._emitRange(a.days)}
                >${s(a.key,i)}</button>`)}
            </div>`:p}
        ${t.length<2?o`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${s("loading_chart",i)}
            </div>`:this._renderSvg(e,t)}
      </div>
    `}_renderSvg(e,t){let i=this.lang,a=e-le-_e,l=wt-Us,c=l-ge,h=1/0,u=-1/0;for(let k of t)h=Math.min(h,k.min??k.val),u=Math.max(u,k.max??k.val);this.thresholdAbove!=null&&(h=Math.min(h,this.thresholdAbove),u=Math.max(u,this.thresholdAbove)),this.thresholdBelow!=null&&(h=Math.min(h,this.thresholdBelow),u=Math.max(u,this.thresholdBelow)),this.targetValue!=null&&(h=Math.min(h,this.targetValue),u=Math.max(u,this.targetValue)),this.forceZero&&(h=Math.min(h,0));let g=(u-h||1)*.06,m=this.forceZero&&h>=0?0:h-g,{ticks:v,niceMin:f,niceMax:$}=Ze(m,u+g,4);this.forceZero&&h>=0&&f<0&&(f=0,v=v.filter(k=>k>=0));let b=t[0].ts,A=t[t.length-1].ts,C=A-b||1,L=xt(b,A),I=k=>le+(k-b)/C*a,E=k=>ge+(1-(k-f)/($-f||1))*c,Z=t.map(k=>`${I(k.ts).toFixed(1)},${E(k.val).toFixed(1)}`).join(" "),X=`M${I(t[0].ts).toFixed(1)},${l} `+t.map(k=>`L${I(k.ts).toFixed(1)},${E(k.val).toFixed(1)}`).join(" ")+` L${I(t[t.length-1].ts).toFixed(1)},${l} Z`,G="",U=t.filter(k=>k.min!=null&&k.max!=null);if(U.length>=2){let k=U.map(P=>`${I(P.ts).toFixed(1)},${E(P.max).toFixed(1)}`),w=[...U].reverse().map(P=>`${I(P.ts).toFixed(1)},${E(P.min).toFixed(1)}`);G=`M${k[0]} `+k.slice(1).map(P=>`L${P}`).join(" ")+` L${w.join(" L")} Z`}let N=[];if(this.thresholdBelow!=null){let k=E(this.thresholdBelow);N.push({y:k,h:Math.max(0,l-k),lineY:k,label:`\u25BC ${de(this.thresholdBelow)}`,labelY:Math.min(l-4,k+13)})}if(this.thresholdAbove!=null){let k=E(this.thresholdAbove);N.push({y:ge,h:Math.max(0,k-ge),lineY:k,label:`\u25B2 ${de(this.thresholdAbove)}`,labelY:Math.max(ge+11,k-5)})}let me=t[t.length-1],ye=(this.events||[]).filter(k=>k.ts>=b&&k.ts<=A),Ae=$t(b,A,Math.max(2,Math.min(5,Math.floor(a/110)+1))),K=this._hover;return o`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${e} ${wt}"
          width=${e}
          height=${wt}
          role="img"
          aria-label=${s("chart_sparkline",i)}
          @pointermove=${k=>this._onPointer(k,t,I,E,e)}
          @pointerdown=${k=>this._onPointer(k,t,I,E,e)}
          @pointerleave=${()=>this._hover=null}
        >
          <defs>
            <clipPath id="plot"><rect x="${le}" y="${ge}" width="${a}" height="${c}" /></clipPath>
            ${N.length?D`<clipPath id="danger">${N.map(k=>D`<rect x="${le}" y="${k.y.toFixed(1)}" width="${a}" height="${k.h.toFixed(1)}" />`)}</clipPath>`:p}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${v.map(k=>{let w=E(k);return w<ge-1||w>l+1?p:D`
              <line x1="${le}" y1="${w.toFixed(1)}" x2="${e-_e}" y2="${w.toFixed(1)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${le-7}" y="${(w+3.5).toFixed(1)}" text-anchor="end" class="tick-label">${de(k)}</text>`})}

          ${N.map(k=>D`<rect x="${le}" y="${k.y.toFixed(1)}" width="${a}" height="${k.h.toFixed(1)}"
              fill="url(#dangerHatch)" />`)}

          ${G?D`<path d="${G}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />`:p}
          <path d="${X}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${Z}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${N.length?D`<polyline points="${Z}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />`:p}

          ${N.map(k=>D`
              <line x1="${le}" y1="${k.lineY.toFixed(1)}" x2="${e-_e}" y2="${k.lineY.toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${e-_e-4}" y="${k.labelY.toFixed(1)}" text-anchor="end" class="zone-label">${k.label}</text>`)}

          ${this.targetValue!=null?D`<line x1="${le}" y1="${E(this.targetValue).toFixed(1)}" x2="${e-_e}" y2="${E(this.targetValue).toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${e-_e-4}" y="${(E(this.targetValue)-5).toFixed(1)}" text-anchor="end" class="zone-label">◆ ${de(this.targetValue)} ${this.unit}</text>`:p}

          ${this.projection&&this.projection.length===2?D`<line x1="${I(this.projection[0].ts).toFixed(1)}" y1="${E(this.projection[0].val).toFixed(1)}"
                x2="${Math.min(I(this.projection[1].ts),e-_e).toFixed(1)}" y2="${E(Math.max(f,Math.min($,this.projection[1].val))).toFixed(1)}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />`:p}

          ${Ae.map((k,w)=>{let P=I(k),kt=w===0?"start":w===Ae.length-1?"end":"middle";return D`<text x="${P.toFixed(1)}" y="${wt-5}" text-anchor="${kt}" class="tick-label">${ze(k,i,L)}</text>`})}

          <line x1="${le}" y1="${l}" x2="${e-_e}" y2="${l}" stroke="var(--divider-color)" stroke-width="1" />

          ${ye.map(k=>{let w=I(k.ts),P=k.type==="completed"?"var(--success-color, #4caf50)":k.type==="skipped"?"var(--warning-color, #ff9800)":"var(--info-color, #2196f3)";return D`
              <line x1="${w.toFixed(1)}" y1="${ge}" x2="${w.toFixed(1)}" y2="${l}" stroke="${P}" stroke-width="1" opacity="0.14" />
              <rect x="${(w-1.5).toFixed(1)}" y="${l+3}" width="3" height="${Mi-6}" rx="1.5" fill="${P}">
                <title>${Ut(k.ts,i)}</title>
              </rect>`})}

          ${K?D`
                <line x1="${K.x.toFixed(1)}" y1="${ge}" x2="${K.x.toFixed(1)}" y2="${l}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${K.x.toFixed(1)}" cy="${K.y.toFixed(1)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />`:D`<circle cx="${I(me.ts).toFixed(1)}" cy="${E(me.val).toFixed(1)}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${K?o`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(K.x,70),e-70)}px"
            >
              <div class="hover-date">${Ut(K.p.ts,i)}</div>
              <div class="hover-val">
                ${Se(K.p.val,this.unit,i)}
                ${K.p.min!=null&&K.p.max!=null?o`<span class="hover-range">(${de(K.p.min)}–${de(K.p.max)})</span>`:p}
              </div>
            </div>`:p}
      </div>
    `}_onPointer(e,t,i,a,l){let h=e.currentTarget.getBoundingClientRect(),u=(e.clientX-h.left)/h.width*l;if(u<le-8||u>l-_e+8){this._hover=null;return}let g=t[0],m=1/0;for(let v of t){let f=Math.abs(i(v.ts)-u);f<m&&(m=f,g=v)}this._hover={x:i(g.ts),y:a(g.val),p:g}}};B.styles=j`
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
  `,d([y({attribute:!1})],B.prototype,"points",2),d([y({attribute:!1})],B.prototype,"events",2),d([y()],B.prototype,"unit",2),d([y()],B.prototype,"lang",2),d([y({attribute:!1})],B.prototype,"thresholdAbove",2),d([y({attribute:!1})],B.prototype,"thresholdBelow",2),d([y({attribute:!1})],B.prototype,"targetValue",2),d([y({type:Boolean})],B.prototype,"forceZero",2),d([y({attribute:!1})],B.prototype,"projection",2),d([y({attribute:!1})],B.prototype,"rangeDays",2),d([y({type:Boolean})],B.prototype,"showRange",2),d([y({type:Boolean})],B.prototype,"busy",2),d([y({type:Boolean})],B.prototype,"hideOutliers",2),d([y({type:Boolean})],B.prototype,"showOutlierToggle",2),d([_()],B.prototype,"_width",2),d([_()],B.prototype,"_hover",2);customElements.get("maintenance-trigger-chart")||customElements.define("maintenance-trigger-chart",B);function Ws(r){if(r.length<4)return r;let n=r.map(u=>u.val).sort((u,g)=>u-g),e=u=>{let g=(n.length-1)*u,m=Math.floor(g),v=Math.ceil(g);return n[m]+(n[v]-n[m])*(g-m)},t=e(.25),i=e(.75),a=i-t;if(a===0)return r;let l=t-1.5*a,c=i+1.5*a,h=r.filter(u=>u.val>=l&&u.val<=c);return h.length>=2?h:r}function Ri(r,n){let e=r.trigger_config;if(!e)return p;let t=n.lang,i=r.trigger_entity_info,a=r.trigger_entity_infos,l=i?.friendly_name||e.entity_id||"\u2014",c=e.entity_id||"",h=e.entity_ids||(c?[c]:[]),u=i?.unit_of_measurement||"",g=r.trigger_current_value,m=e.type||"threshold",v=h.length>1,f=Vs(r,u,n);return o`
    <h3>${s("trigger",t)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${v?o`
            <div class="trigger-entity-name">${h.length} ${s("entities",t)} (${e.entity_logic||"any"})</div>
            <div class="trigger-entity-id">${h.map(($,b)=>o`${b>0?", ":""}<span class="entity-link" @click=${A=>Te(A,$)}>${$}</span>`)}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `:o`
            <div class="trigger-entity-name">${l}</div>
            <div class="trigger-entity-id">${c?o`<span class="entity-link" @click=${$=>Te($,c)}>${c}</span>`:""}${e.attribute?` \u2192 ${e.attribute}`:""}</div>
          `}
        </div>
        <span class="status-badge ${r.trigger_active?"triggered":"ok"}" style="margin-left: auto;">
          ${r.trigger_active?s("triggered",t):s("ok",t)}
        </span>
      </div>

      ${f?Ks(f,t):g!=null?o`
              <div class="trigger-value-row">
                <span class="trigger-current ${r.trigger_active?"active":""}">${typeof g=="number"?Se(g,"",t):g}</span>
                ${u?o`<span class="trigger-unit">${u}</span>`:p}
              </div>
            `:p}

      <div class="trigger-limits">
        ${m==="threshold"?o`
          ${e.trigger_above!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_above",t)}: ${e.trigger_above} ${u}</span>`:p}
          ${e.trigger_below!=null?o`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${s("threshold_below",t)}: ${e.trigger_below} ${u}</span>`:p}
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
          ${(e.conditions||[]).map(($,b)=>o`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${b+1}. ${s($.type||"unknown",t)}: ${$.entity_id?o`<span class="entity-link" @click=${A=>Te(A,$.entity_id)}>${$.entity_id}</span>`:""}</span>
          `)}
        `:p}
      </div>

      ${a&&a.length>1?o`
        <div class="trigger-entity-list">
          ${a.map($=>o`
            <span class="trigger-entity-id">${$.friendly_name} (<span class="entity-link" @click=${b=>Te(b,$.entity_id)}>${$.entity_id}</span>)</span>
          `)}
        </div>
      `:p}

      ${Ys(r,u,n)}
    </div>
  `}function Vs(r,n,e){let t=r.trigger_config,i=r.trigger_current_value;if(!t||i==null)return null;switch(t.type||"threshold"){case"counter":{let a=t.trigger_target_value;if(a==null||a<=0)return null;let l=Ii(r,Li(r,e));return{progress:Math.max(0,i-(l?.value??i)),target:a,unit:n,meter:i}}case"state_change":{let a=t.trigger_target_changes;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"",meter:null}}case"runtime":{let a=t.trigger_runtime_hours;return a==null||a<=0?null:{progress:Math.max(0,i),target:a,unit:"h",meter:null}}}return null}function Ii(r,n){if(r.trigger_baseline_value!=null)return{value:r.trigger_baseline_value,ts:Bt(r)};if(!n.length)return null;let e=Bt(r);if(e==null)return{value:n[0].val,ts:null};let t=n[0],i=Math.abs(n[0].ts-e);for(let a of n){let l=Math.abs(a.ts-e);l<i&&(t=a,i=l)}return{value:t.val,ts:e}}function Bt(r){let n=[...r.history].filter(e=>e.type==="completed"||e.type==="reset").sort((e,t)=>new Date(t.timestamp).getTime()-new Date(e.timestamp).getTime())[0];return n?new Date(n.timestamp).getTime():null}function Ks(r,n){let e=Math.min(999,Math.round(r.progress/r.target*100)),t=e>=100?"over":e>=75?"near":"ok";return o`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${Se(r.progress,"",n)}<span class="counter-progress-target"> / ${Se(r.target,r.unit,n)}</span></span>
        <span class="counter-progress-pct ${t}">${e} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${e} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${t}" style="width:${Math.min(100,e)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${s("chart_since_service",n)}${r.meter!=null?o` · ${s("current",n)}: ${Se(r.meter,r.unit,n)}`:p}
      </div>
    </div>
  `}function Li(r,n){let e=r.trigger_config;if(!e)return[];let t=e.type||"threshold",i=e.entity_id||"",a=t==="runtime"?[]:n.detailStatsData.get(i)||[],l=n.isCounterEntity(e),c=[];if(a.length>=2)for(let h of a){let u={ts:h.ts,val:h.val};!l&&h.min!=null&&h.max!=null&&(u.min=h.min,u.max=h.max),c.push(u)}else for(let h of r.history)h.trigger_value!=null&&c.push({ts:new Date(h.timestamp).getTime(),val:h.trigger_value});return r.trigger_current_value!=null&&c.push({ts:Date.now(),val:r.trigger_current_value}),c.sort((h,u)=>h.ts-u.ts),c}function Ys(r,n,e){let t=r.trigger_config;if(!t)return p;let i=t.type||"threshold",a=t.entity_id||"",l=Li(r,e);i==="runtime"&&t.trigger_runtime_hours&&r.trigger_current_value!=null&&(l=[{ts:Bt(r)??l[0]?.ts??Date.now()-864e5,val:0},{ts:Date.now(),val:Math.max(0,r.trigger_current_value)}]),e.hideOutliers&&(l=Ws(l));let c=l.length<2&&!!a&&e.hasStatsService&&!e.detailStatsData.has(a);if(l.length<2&&!c)return p;let h=!!a&&e.detailStatsData.has(a)&&(e.detailStatsData.get(a)?.length??0)<2,u=Date.now()-e.rangeDays*864e5,g=l.filter(b=>b.ts>=u);g.length>=2&&(l=g);let m=null,v=!1;if(i==="counter"&&t.trigger_target_value!=null&&l.length){let b=Ii(r,l);if(b){if(b.ts!=null){let A=l.filter(C=>C.ts>=b.ts);A.length>=2&&(l=A)}l=l.map(A=>({...A,val:Math.max(0,A.val-b.value)}))}m=t.trigger_target_value,v=!0}else i==="state_change"&&t.trigger_target_changes?(m=t.trigger_target_changes,v=!0):i==="runtime"&&t.trigger_runtime_hours&&(m=t.trigger_runtime_hours,v=!0);let f=null;if(m==null&&r.degradation_rate!=null&&(r.degradation_trend!=="stable"||r.days_until_threshold!=null)&&r.degradation_trend!=="insufficient_data"&&l.length>=2){let b=l[l.length-1];f=[b,{ts:b.ts+30*864e5,val:b.val+r.degradation_rate*30}]}let $=r.history.filter(b=>["completed","skipped","reset"].includes(b.type)).map(b=>({ts:new Date(b.timestamp).getTime(),type:b.type}));return o`
    <maintenance-trigger-chart
      .points=${c?[]:l}
      .events=${$}
      .unit=${n}
      .lang=${e.lang}
      .thresholdAbove=${i==="threshold"?t.trigger_above??null:null}
      .thresholdBelow=${i==="threshold"?t.trigger_below??null:null}
      .targetValue=${m}
      .forceZero=${v}
      .projection=${f}
      .rangeDays=${e.rangeDays}
      .hideOutliers=${e.hideOutliers}
      .busy=${c}
      @range-change=${b=>e.setRangeDays(b.detail.days)}
      @outlier-toggle=${b=>e.setHideOutliers(b.detail.hide)}
    ></maintenance-trigger-chart>
    ${h&&!c?o`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${s("chart_no_stats",e.lang)}
        </div>`:p}
  `}function Pi(r,n,e){let t=r.degradation_trend!=null&&r.degradation_trend!=="insufficient_data",i=r.days_until_threshold!=null,a=r.environmental_factor!=null&&r.environmental_factor!==1;if(!t&&!i&&!a)return p;let l=r.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":r.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return o`
    <div class="prediction-section">
      ${r.sensor_prediction_urgency?o`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${s("sensor_prediction_urgency",n).replace("{days}",String(Math.round(r.days_until_threshold||0)))}
        </div>
      `:p}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${s("sensor_prediction",n)}
      </div>
      <div class="prediction-grid">
        ${t?o`
          <div class="prediction-item">
            <ha-svg-icon path="${l}"></ha-svg-icon>
            <span class="prediction-label">${s("degradation_trend",n)}</span>
            <span class="prediction-value ${r.degradation_trend}">${s("trend_"+r.degradation_trend,n)}</span>
            ${r.degradation_rate!=null?o`<span class="prediction-rate">${r.degradation_rate>0?"+":""}${Math.abs(r.degradation_rate)>=10?Math.round(r.degradation_rate).toLocaleString():r.degradation_rate.toFixed(1)} ${r.trigger_entity_info?.unit_of_measurement||""}/${s("day_short",n)}</span>`:p}
          </div>
        `:p}
        ${i?o`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${s("days_until_threshold",n)}</span>
            <span class="prediction-value prediction-days${r.days_until_threshold===0?" exceeded":r.sensor_prediction_urgency?" urgent":""}">${r.days_until_threshold===0?s("threshold_exceeded",n):"~"+Math.round(r.days_until_threshold)+" "+s("days",n)}</span>
            ${r.threshold_prediction_date?o`<span class="prediction-date">${W(r.threshold_prediction_date,n)}</span>`:p}
            ${r.threshold_prediction_confidence?o`<span class="confidence-dot ${r.threshold_prediction_confidence}"></span>`:p}
          </div>
        `:p}
        ${a&&e.environmental?o`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${s("environmental_adjustment",n)}</span>
            <span class="prediction-value">${r.environmental_factor.toFixed(2)}x</span>
            ${r.environmental_entity?o`<span class="prediction-entity entity-link" @click=${c=>Te(c,r.environmental_entity)}>${r.environmental_entity}</span>`:p}
          </div>
        `:p}
      </div>
    </div>
  `}function zi(r,n){let e=r.interval_analysis,t=e?.weibull_beta,i=e?.weibull_eta;if(t==null||i==null||i<=0)return p;let a=r.interval_days??0,l=r.suggested_interval??a;return o`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${s("weibull_reliability_curve",n)}
        ${Gs(t,n)}
      </div>
      ${Qs(t,i,a,l,n)}
      ${Js(e,n)}
      ${e?.confidence_interval_low!=null?Zs(e,r,n):p}
    </div>
  `}function Gs(r,n){let e,t,i;return r<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):r<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):r<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),o`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${s(i,n)} (\u03B2=${r.toFixed(2)})
    </span>
  `}function Qs(r,n,e,t,i){let f=Math.max(e,t,n,1)*1.3,$=50,b=[];for(let U=0;U<=$;U++){let N=U/$*f,me=1-Math.exp(-Math.pow(N/n,r)),ye=32+N/f*260,Ae=136-me*128;b.push([ye,Ae])}let A=b.map(([U,N])=>`${U.toFixed(1)},${N.toFixed(1)}`).join(" "),C="M32,136 "+b.map(([U,N])=>`L${U.toFixed(1)},${N.toFixed(1)}`).join(" ")+` L${b[$][0].toFixed(1)},136 Z`,L=32+e/f*260,I=1-Math.exp(-Math.pow(e/n,r)),E=136-I*128,Z=((1-I)*100).toFixed(0),X=32+t/f*260,G=[0,.25,.5,.75,1];return o`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_weibull",i)}">
        ${G.map(U=>{let N=136-U*128;return D`
            <line x1="${32}" y1="${N.toFixed(1)}" x2="${292}" y2="${N.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${U===.5?"4,3":p}" />
            <text x="${28}" y="${(N+3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(U*100).toFixed(0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(f)}</text>

        <path d="${C}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${A}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?D`
          <line x1="${L.toFixed(1)}" y1="${8}" x2="${L.toFixed(1)}" y2="${136 .toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${L.toFixed(1)}" cy="${E.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(L+4).toFixed(1)}" y="${(E-6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Z}%</text>
        `:p}

        ${t>0&&t!==e?D`
          <line x1="${X.toFixed(1)}" y1="${8}" x2="${X.toFixed(1)}" y2="${136 .toFixed(1)}"
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
  `}function Js(r,n){return o`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${s("characteristic_life",n)}</span>
        <span class="weibull-info-value">${Math.round(r.weibull_eta)} ${s("days",n)}</span>
      </div>
      ${r.weibull_r_squared!=null?o`
        <div class="weibull-info-item">
          <span>${s("weibull_r_squared",n)}</span>
          <span class="weibull-info-value">${r.weibull_r_squared.toFixed(3)}</span>
        </div>
      `:p}
    </div>
  `}function Zs(r,n,e){let t=r.confidence_interval_low,i=r.confidence_interval_high,a=n.suggested_interval??n.interval_days??0,l=n.interval_days??0,c=Math.max(0,t-5),u=i+5-c,g=(t-c)/u*100,m=(i-t)/u*100,v=(a-c)/u*100,f=l>0?(l-c)/u*100:-1;return o`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${s("confidence_interval",e)}: ${a} ${s("days",e)} (${t}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${g.toFixed(1)}%;width:${m.toFixed(1)}%"></div>
        ${f>=0?o`<div class="confidence-marker current" style="left:${f.toFixed(1)}%"></div>`:p}
        <div class="confidence-marker recommended" style="left:${v.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${s("confidence_conservative",e)} (${t}${s("days",e).charAt(0)})</span>
        <span class="confidence-text high">${s("confidence_aggressive",e)} (${i}${s("days",e).charAt(0)})</span>
      </div>
    </div>
  `}function Hi(r,n,e,t){let i=Math.max(r||1,n);return o`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${s("current",t)}: ${r??"\u2014"} ${r!=null?s("days",t):""}
        </div>
        <div class="interval-visual current"
          style="width: ${r!=null?Math.min(r/i*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${s("recommended",t)}: ${n} ${s("days",t)}
          <span class="confidence-badge ${e}">${s(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(n/i*100,100)}%"></div>
      </div>
    </div>
  `}var Di=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"];function Oi(r,n,e){if(!e.seasonal||!r.seasonal_factor||r.seasonal_factor===1)return p;let t=Di.map(c=>s(c,n)),i=new Date().getMonth(),a=r.seasonal_factors||r.interval_analysis?.seasonal_factors||null,l=a&&a.length===12?a:t.map((c,h)=>{let u=r.seasonal_factor||1,g=Math.sin((h-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,u+g))});return o`
    <div class="seasonal-card-compact">
      <h4>${s("seasonal_awareness",n)}</h4>
      <div class="seasonal-mini-chart">
        ${l.map((c,h)=>{let u=c*40,g=c<.9?"low":c>1.1?"high":"normal";return o`
            <div class="seasonal-bar ${g} ${h===i?"current":""}"
                 style="height: ${u}px"
                 title="${t[h]}: ${c.toFixed(2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${s("shorter",n)||"K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${s("normal",n)||"Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${s("longer",n)||"L\xE4nger"}</span>
      </div>
    </div>
  `}function qi(r,n){return Xs(r,n)}function Xs(r,n){let e=r.seasonal_factors??r.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return p;let t=r.interval_analysis?.seasonal_reason,i=new Date().getMonth(),a=300,l=100,c=8,u=l-c-4,g=Math.max(...e,1.5),m=a/12,v=m*.65,f=c+u-1/g*u;return o`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${s("seasonal_chart_title",n)}
        ${t?o`<span class="source-tag">${t==="learned"?s("seasonal_learned",n):s("seasonal_manual",n)}</span>`:p}
      </div>
      <svg viewBox="0 0 ${a} ${l}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_seasonal",n)}">
        <line x1="0" y1="${f.toFixed(1)}" x2="${a}" y2="${f.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map(($,b)=>{let A=$/g*u,C=b*m+(m-v)/2,L=c+u-A,I=b===i,E=$<1?"var(--success-color, #4caf50)":$>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return D`
            <rect x="${C.toFixed(1)}" y="${L.toFixed(1)}"
              width="${v.toFixed(1)}" height="${A.toFixed(1)}"
              fill="${E}" opacity="${I?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Di.map(($,b)=>o`<span class="seasonal-label ${b===i?"active-month":""}">${s($,n)}</span>`)}
      </div>
    </div>
  `}var ea=200,Xe=10,ta=22;function Ni(r,n,e,t){let i=r.history.filter(c=>c.type==="completed"&&(c.cost!=null||c.duration!=null));if(i.length<2)return p;let a=i.some(c=>(c.cost??0)>0),l=i.some(c=>(c.duration??0)>0);return!a&&!l?p:o`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${s("cost_duration_chart",n)}</h3>
        <div class="toggle-buttons">
          ${a?o`<button
            class="toggle-btn ${e==="cost"?"active":""}"
            @click=${()=>t("cost")}>
            ${s("cost",n)}
          </button>`:p}
          ${a&&l?o`<button
            class="toggle-btn ${e==="both"?"active":""}"
            @click=${()=>t("both")}>
            ${s("both",n)}
          </button>`:p}
          ${l?o`<button
            class="toggle-btn ${e==="duration"?"active":""}"
            @click=${()=>t("duration")}>
            ${s("duration",n)}
          </button>`:p}
        </div>
      </div>
      ${ia(r,n,e)}
    </div>
  `}function ia(r,n,e){let t=r.history.filter(w=>w.type==="completed"&&(w.cost!=null||w.duration!=null)).map(w=>({ts:new Date(w.timestamp).getTime(),cost:w.cost??0,duration:w.duration??0})).sort((w,P)=>w.ts-P.ts);if(t.length<2)return p;let i=t.some(w=>w.cost>0),a=t.some(w=>w.duration>0);if(!i&&!a)return p;let l=e!=="duration"&&i,c=e!=="cost"&&a,h=l||!c&&i,u=c||!l&&a,g=640,m=ea,v=h?44:12,f=u?44:12,$=g-v-f,b=m-ta,A=b-Xe,C=t[0].ts,L=t[t.length-1].ts,I=(L-C||864e5)*.05,E=C-I,Z=L+I,X=xt(C,L),G=w=>v+(w-E)/(Z-E)*$,U=Ze(0,Math.max(...t.map(w=>w.cost))||1,3),N=Ze(0,Math.max(...t.map(w=>w.duration))||1,3),me=w=>Xe+(1-w/(U.niceMax||1))*A,ye=w=>Xe+(1-w/(N.niceMax||1))*A,Ae=t.length>1?Math.min(...t.slice(1).map((w,P)=>G(w.ts)-G(t[P].ts))):$,K=Math.max(6,Math.min(22,Ae*.55)),k=$t(C,L,Math.max(2,Math.min(4,t.length)));return o`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${g} ${m}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${s("chart_history",n)}">
        ${h?U.ticks.map(w=>{let P=me(w);return P<Xe-1||P>b+1?p:D`
            <line x1="${v}" y1="${P.toFixed(1)}" x2="${g-f}" y2="${P.toFixed(1)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${v-6}" y="${(P+3.5).toFixed(1)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${de(w)}€</text>`}):p}
        ${u?N.ticks.map(w=>{let P=ye(w);return P<Xe-1||P>b+1?p:D`<text x="${g-f+6}" y="${(P+3.5).toFixed(1)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${de(w)}m</text>`}):p}

        ${h?t.filter(w=>w.cost>0).map(w=>D`
          <rect x="${(G(w.ts)-K/2).toFixed(1)}" y="${me(w.cost).toFixed(1)}" width="${K.toFixed(1)}" height="${(b-me(w.cost)).toFixed(1)}"
            fill="var(--primary-color)" opacity="0.6" rx="2">
            <title>${ze(w.ts,n,!0)}: ${w.cost.toLocaleString(n)}€${w.duration?` \xB7 ${w.duration}m`:""}</title>
          </rect>
        `):p}
        ${u?D`
          <polyline points="${t.map(w=>`${G(w.ts).toFixed(1)},${ye(w.duration).toFixed(1)}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${t.map(w=>D`
            <circle cx="${G(w.ts).toFixed(1)}" cy="${ye(w.duration).toFixed(1)}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${ze(w.ts,n,!0)}: ${w.duration}m${w.cost?` \xB7 ${w.cost.toLocaleString(n)}\u20AC`:""}</title>
            </circle>
          `)}
        `:p}

        <line x1="${v}" y1="${b}" x2="${g-f}" y2="${b}" stroke="var(--divider-color)" stroke-width="1" />
        ${k.map((w,P)=>{let kt=P===0?"start":P===k.length-1?"end":"middle";return D`<text x="${G(w).toFixed(1)}" y="${m-6}" text-anchor="${kt}" fill="var(--secondary-text-color)" font-size="10">${ze(w,n,X)}</text>`})}
      </svg>
    </div>
    <div class="chart-legend">
      ${h?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${s("cost",n)}</span>`:p}
      ${u?o`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${s("duration",n)}</span>`:p}
    </div>
  `}var fe=class extends S{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{let e=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${this.docId}`,expires:300});this._url=e.path}catch{this._failed=!0}}render(){return this._failed||!this.docId?p:this._url?o`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:o`<div class="ph"></div>`}};fe.styles=j`
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
  `,d([y({attribute:!1})],fe.prototype,"hass",2),d([y()],fe.prototype,"docId",2),d([_()],fe.prototype,"_url",2),d([_()],fe.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",fe);var sa=["completed","skipped","missed","reset","triggered"];function Fi(r,n){let e=n.lang;return o`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${sa.map(t=>{let i=r.history.filter(a=>a.type===t).length;return i===0?p:o`
            <span class="filter-chip ${n.filter===t?"active":""}"
              @click=${()=>n.setFilter(n.filter===t?null:t)}>
              ${s(t,e)} (${i})
            </span>
          `})}
        ${n.filter?o`<span class="filter-chip clear" @click=${()=>n.setFilter(null)}>${s("show_all",e)}</span>`:p}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${s("search_notes",e)}..." .value=${n.search} @input=${t=>n.setSearch(t.target.value)} />
      </div>
    </div>
  `}function Ui(r,n){let e=n.lang,t=n.filter?r.history.filter(i=>i.type===n.filter):r.history;if(n.search){let i=n.search.toLowerCase();t=t.filter(a=>a.notes?.toLowerCase().includes(i))}return t.length===0?o`<p class="empty">${s("no_history",e)}</p>`:o`
    <div class="history-timeline">
      ${[...t].reverse().map(i=>aa(i,n))}
    </div>
  `}function aa(r,n){let e=n.lang,t=["completed","reset","skipped"].includes(r.type);return o`
    <div class="history-entry">
      <div class="history-icon ${r.type}">
        <ha-icon .icon=${Ve[r.type]||"mdi:circle"}></ha-icon>
      </div>
      <div class="history-content">
        <div class="history-row">
          <strong>${s(r.type,e)}</strong>
          ${t?o`<button class="history-edit-btn"
                     title=${s("history_edit_button",e)||"Edit entry"}
                     @click=${()=>n.openEdit(r)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:p}
        </div>
        <div class="history-date">${ct(r.timestamp,e)}</div>
        ${r.notes?o`<div>${r.notes}</div>`:p}
        ${r.photo_doc_id?o`<maintenance-history-photo .hass=${n.hass} .docId=${r.photo_doc_id}></maintenance-history-photo>`:p}
        <div class="history-details">
          ${r.cost!=null?o`<span>${s("cost",e)}: ${r.cost.toFixed(2)} ${n.currencySymbol}</span>`:p}
          ${r.duration!=null?o`<span>${s("duration",e)}: ${r.duration} min</span>`:p}
          ${r.trigger_value!=null?o`<span>${s("trigger_val",e)}: ${r.trigger_value}</span>`:p}
          ${r.reading_value!=null?o`<span>${s("reading_label",e)}: ${r.reading_value}${n.readingUnit?` ${n.readingUnit}`:""}${(()=>{let i=n.readingDelta?.(r);return i==null?"":` (${i>=0?"+":""}${Number(i.toFixed(3))})`})()}</span>`:p}
        </div>
      </div>
    </div>
  `}function Wt(r,n){if(!r.responsible_user_id)return p;let e=n(r.responsible_user_id);return e?o`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${e}
    </span>
  `:p}function na(r,n){let e=n.lang,t=n.isOperator,i=r.archived?"archived":r.is_done?"done":r.status==="due_soon"?"warning":r.status||"ok",a=r.archived?s("archived",e):r.is_done?s("completed",e):s(r.status||"ok",e);return o`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${()=>n.showTaskView()}>${r.name}</span>
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${()=>n.showObject()}>${n.objectName}</span>
        <span class="status-chip ${i}">${a}</span>
        ${r.due_override?o`<span class="postponed-badge" title="${s("postponed_to",e)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${W(r.due_override,e)}
        </span>`:p}
        ${Wt(r,n.getUserName)}
        ${r.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_tag_id",e)}: ${r.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>`:t?p:o`<span class="nfc-badge unlinked" title="${s("nfc_link_hint",e)}"
              @click=${()=>n.openEdit(r)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>`}
      </div>
      <div class="task-header-actions">
        <ha-button appearance="filled" @click=${()=>n.openComplete(r)}>${s("complete",e)}</ha-button>
        <ha-button appearance="plain" .disabled=${n.actionLoading} @click=${()=>n.promptSkip()}>${s("skip",e)}</ha-button>
        ${t?p:o`
          <ha-button appearance="plain" @click=${()=>n.toggleArchive(!!r.archived)}>
            <ha-icon icon="${r.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
            ${r.archived?s("unarchive",e):s("archive",e)}
          </ha-button>
        `}
        <ha-button appearance="plain" @click=${()=>n.openQr(r.name)}><ha-icon icon="mdi:qrcode"></ha-icon> ${s("qr_code",e)}</ha-button>
        ${t?p:o`
          <div class="more-menu-wrapper">
            <ha-icon-button .disabled=${n.actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${()=>n.toggleMoreMenu()}></ha-icon-button>
            ${n.moreMenuOpen?o`
              <div class="popup-menu" @click=${l=>l.stopPropagation()}>
                <div class="popup-menu-item" @click=${()=>{n.closeMoreMenu(),n.openEdit(r)}}>${s("edit",e)}</div>
                <div class="popup-menu-item" @click=${()=>n.duplicateTask()}>${s("duplicate",e)}</div>
                <div class="popup-menu-item" @click=${()=>{n.closeMoreMenu(),n.promptReset()}}>${s("reset",e)}</div>
                <div class="popup-menu-item" @click=${()=>{n.closeMoreMenu(),n.promptPostpone()}}>${s("postpone",e)}…</div>
                <div class="popup-menu-item" @click=${()=>{n.closeMoreMenu(),n.snoozeTask()}}>${s("snooze",e)}</div>
                <div class="popup-menu-item" @click=${()=>{n.closeMoreMenu(),n.printWorksheet()}}>${s("worksheet",e)}</div>
                <div class="popup-menu-divider"></div>
                <div class="popup-menu-item danger" @click=${()=>{n.closeMoreMenu(),n.deleteTask()}}>${s("delete",e)}</div>
              </div>
            `:p}
          </div>
        `}
      </div>
    </div>
  `}function ra(r){let n=r.lang;return o`
    <div class="tab-bar">
      <div class="tab ${r.activeTab==="overview"?"active":""}" @click=${()=>r.setActiveTab("overview")}>
        ${s("overview",n)}
      </div>
      <div class="tab ${r.activeTab==="history"?"active":""}" @click=${()=>r.setActiveTab("history")}>
        ${s("history",n)}
      </div>
    </div>
  `}function Bi(r,n,e,t){let i=t.collapsedSections.has(r);return o`
    <div class="collapsible ${i?"collapsed":""}">
      <button class="collapsible-head" @click=${()=>t.toggleSection(r)}
        aria-expanded=${i?"false":"true"}>
        <ha-icon icon="${i?"mdi:chevron-right":"mdi:chevron-down"}"></ha-icon>
        <span>${s(n,t.lang)}</span>
      </button>
      ${i?p:o`<div class="collapsible-body">${e}</div>`}
    </div>
  `}function oa(r,n){if(!n.features.checklists)return p;let e=r.checklist||[];if(e.length===0)return p;let t=n.lang;return o`
    <div class="checklist-preview-card">
      <div class="checklist-preview-header">
        <ha-icon icon="mdi:format-list-checks"></ha-icon>
        <span>${s("checklist",t)} (${e.length})</span>
      </div>
      <ol class="checklist-preview-list">
        ${e.map(i=>o`<li>${i}</li>`)}
      </ol>
    </div>
  `}function la(r,n){let e=r.documentation_url&&/^https?:\/\//i.test(r.documentation_url)?r.documentation_url:null,t=n.objectDocUrl&&/^https?:\/\//i.test(n.objectDocUrl)?n.objectDocUrl:null;if(!r.notes&&!e&&!t)return p;let i=n.lang;return o`
    <div class="task-meta-card">
      ${r.notes?o`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${r.notes}</span>
        </div>
      `:p}
      ${e?o`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:open-in-new"></ha-icon>
          <a href="${e}" target="_blank" rel="noopener noreferrer">${s("documentation_label",i)}</a>
        </div>
      `:p}
      ${t?o`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="${t}" target="_blank" rel="noopener noreferrer">${s("documentation_url_label",i)} (${n.objectName})</a>
        </div>
      `:p}
    </div>
  `}function ca(r,n){let e=n.lang,t=r.times_performed>0?r.total_cost/r.times_performed:0,i=r.days_until_due!==null&&r.days_until_due!==void 0?r.days_until_due<0?"overdue":r.days_until_due<=r.warning_days?"warning":"":"";return o`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${s("next_due",e)}</div>
        <div class="kpi-value">${r.next_due?W(r.next_due,e):"\u2014"}</div>
        ${n.features.schedule_time&&r.schedule_time?o`<div class="kpi-subtext">${s("at_time",e)} ${r.schedule_time}</div>`:p}
      </div>
      <div class="kpi-card ${i}">
        <div class="kpi-label">${s("days_until_due",e)}</div>
        <div class="kpi-value-large">${r.days_until_due!==null&&r.days_until_due!==void 0?r.days_until_due:"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("interval",e)}</div>
        <div class="kpi-value">${Ye(r,e)}</div>
        ${n.features.adaptive&&r.suggested_interval&&r.suggested_interval!==r.interval_days?o`
          <div class="kpi-subtext">${s("recommended",e)}: ${r.suggested_interval}${r.interval_analysis?.confidence_interval_low!=null?` (${r.interval_analysis.confidence_interval_low}\u2013${r.interval_analysis.confidence_interval_high})`:""}</div>
        `:p}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("warning",e)}</div>
        <div class="kpi-value">${r.warning_days} ${s("days",e)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("last_performed",e)}</div>
        <div class="kpi-value">${r.last_performed?W(r.last_performed,e):"\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("avg_cost",e)}</div>
        <div class="kpi-value">${t.toFixed(0)} ${n.currencySymbol}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${s("avg_duration",e)}</div>
        <div class="kpi-value">${r.average_duration?r.average_duration.toFixed(0):"\u2014"} min</div>
      </div>
    </div>
  `}function da(r,n){let e=n.lang;if(!n.features.adaptive||!r.suggested_interval||r.suggested_interval===r.interval_days)return p;if(n.suggestionDismissed)return p;let t=r.suggested_interval;return o`
    <div class="recommendation-card">
      <h4>${s("suggested_interval",e)}</h4>
      ${Hi(r.interval_days,t,r.interval_confidence||"medium",e)}
      <div class="recommendation-actions">
        <ha-button appearance="filled"
          @click=${()=>n.applySuggestion(t)}>
          ${s("apply_suggestion",e)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>n.reanalyze()}>
          ${s("reanalyze",e)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${()=>n.dismissSuggestion()}>
          ${s("dismiss_suggestion",e)}
        </ha-button>
      </div>
    </div>
  `}function pa(r,n){let e=n.lang,t=r.history.slice(-3).reverse();if(t.length===0)return p;let i=a=>{switch(a){case"completed":return"\u2713";case"triggered":return"\u2297";case"skipped":return"\u21B7";case"reset":return"\u21BA";default:return"\xB7"}};return o`
    <div class="recent-activities">
      <h3>${s("recent_activities",e)}</h3>
      ${t.map(a=>o`
        <div class="activity-item">
          <span class="activity-icon">${i(a.type)}</span>
          <span class="activity-date">${ct(a.timestamp,e)}</span>
          <span class="activity-note">${a.notes||"\u2014"}</span>
          ${a.cost?o`<span class="activity-badge">${a.cost.toFixed(0)}${n.currencySymbol}</span>`:p}
          ${a.duration?o`<span class="activity-badge">${a.duration}min</span>`:p}
        </div>
      `)}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${()=>n.setActiveTab("history")}>${s("show_all",e)} →</ha-button>
      </div>
    </div>
  `}function ha(r,n){let e=n.lang,t=n.features.adaptive&&r.suggested_interval&&r.suggested_interval!==r.interval_days,i=n.features.seasonal&&r.seasonal_factor&&r.seasonal_factor!==1,a=t||i,l=n.features.adaptive&&r.interval_analysis?.weibull_beta!=null&&r.interval_analysis?.weibull_eta!=null,c=n.features.seasonal&&(r.seasonal_factors?.length===12||r.interval_analysis?.seasonal_factors?.length===12);return o`
    <div class="tab-content overview-tab">
      ${ca(r,n)}
      ${la(r,n)}
      ${Ci(r,n.lang)}
      ${Ri(r,n.sparkline)}
      ${Pi(r,e,n.features)}
      <div class="two-column-layout ${a?"":"single-column"}">
        ${a?o`
          <div class="left-column">
            ${da(r,n)}
            ${Oi(r,e,n.features)}
          </div>
        `:p}
        <div class="right-column">
          ${Ni(r,e,n.costDurationToggle,h=>n.setCostDurationToggle(h))}
        </div>
      </div>
      ${l?Bi("weibull","weibull_reliability_curve",zi(r,e),n):p}
      ${c?Bi("seasonal","seasonal_chart_title",o`
            ${qi(r,e)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${()=>n.openSeasonalOverrides(r)}>
                ${s("edit_seasonal_overrides",e)}
              </ha-button>
            </div>
          `,n):p}
      ${oa(r,n)}
      ${pa(r,n)}
    </div>
  `}function ua(r,n){return o`
    <div class="tab-content history-tab">
      ${Fi(r,n.history)}
      ${Ui(r,n.history)}
    </div>
  `}function _a(r,n){switch(n.activeTab){case"overview":return ha(r,n);case"history":return ua(r,n);default:return p}}function Wi(r,n){return o`
    <div class="detail-section">
      ${na(r,n)}
      ${ra(n)}
      ${_a(r,n)}
      <maintenance-task-documents
        .hass=${n.hass}
        .entryId=${n.entryId}
        .taskId=${n.taskId}
        .canWrite=${!n.isOperator}
      ></maintenance-task-documents>
    </div>
  `}var et=class extends S{createRenderRoot(){return this}render(){return!this.task||!this.ctx?p:o`${Wi(this.task,this.ctx)}`}};d([y({attribute:!1})],et.prototype,"task",2),d([y({attribute:!1})],et.prototype,"ctx",2);customElements.get("maintenance-task-detail-view")||customElements.define("maintenance-task-detail-view",et);function Vi(r){if(r.total<=0)return{start:0,end:0,padTop:0,padBottom:0};let n=r.overscan??12,e=Math.max(1,r.step??6),t=Math.max(1,r.rowHeight),i=Math.floor((r.scrollTop-r.listTop)/t),a=Math.ceil(r.viewportHeight/t)+1,l=Math.max(0,i-n);l=Math.floor(l/e)*e;let c=Math.min(r.total,Math.max(i,0)+a+n);return c=Math.min(r.total,Math.ceil(c/e)*e),l>=c&&(l=Math.min(l,Math.max(0,r.total-1)),c=Math.min(r.total,l+Math.max(a,1))),{start:l,end:c,padTop:l*t,padBottom:(r.total-c)*t}}var T=class extends S{constructor(){super(...arguments);this.narrow=!1;this.panel={};this._objects=[];this._stats=null;this._view="overview";this._selectedEntryId=null;this._selectedTaskId=null;this._filterStatus="";this._filterUser=null;this._unsub=null;this._chartRangeDays=(()=>{try{let e=parseInt(localStorage.getItem(V.chartRange)||"",10);return[7,30,90,365].includes(e)?e:30}catch{return 30}})();this._hideOutliers=(()=>{try{return localStorage.getItem(V.chartHideOutliers)==="1"}catch{return!1}})();this._historyFilter=null;this._budget=null;this._groups={};this._detailStatsData=new Map;this._miniStatsData=new Map;this._features={adaptive:!1,predictions:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._adminPanelUserIds=[];this._operatorWriteEnabled=!1;this._defaultWarningDays=7;this._actionLoading=!1;this._moreMenuOpen=!1;this._toastMessage="";this._toastUndo=null;this._toastTimer=null;this._dismissedSuggestions=new Set;this._overviewTab=(()=>{try{let e=localStorage.getItem(V.overviewTab);return e==="today"||e==="calendar"?e:"dashboard"}catch{return"dashboard"}})();this._activeTab="overview";this._costDurationToggle="both";this._historySearch="";this._sortMode="due_date";this._objectSortMode="alphabetical";this._groupByMode="none";this._objectViewMode="cards";this._objectsTableColumns=ut;this._showArchived=!1;this._bulkMode=!1;this._bulkSelected=new Set;this._virtStart=0;this._virtEnd=0;this._virtRowHeight=53;this._virtTotalRows=0;this._virtScrollAttached=!1;this._virtRaf=0;this._collapsedSections=(()=>{try{return new Set(JSON.parse(localStorage.getItem(V.collapsedSections)||"[]"))}catch{return new Set}})();this._paletteOpen=!1;this._paletteQuery="";this._paletteActive=0;this._templateGalleryOpen=!1;this._templates=[];this._templateCategories={};this._templateBusy=!1;this._statsService=null;this._userService=null;this._dataLoaded=!1;this._lastConnection=null;this._popstateHandler=e=>this._onPopState(e);this._onVirtualScroll=()=>{this._virtRaf||(this._virtRaf=requestAnimationFrame(()=>{this._virtRaf=0,this._updateVirtualWindow()}))};this._deepLinkHandled=!1;this._paletteKeydown=e=>{if(e.key==="/"&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!this._paletteOpen){let i=e.composedPath()[0];if(i instanceof HTMLElement&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.tagName==="SELECT"||i.isContentEditable))return;e.preventDefault(),this._openPalette();return}if(!this._paletteOpen)return;let t=this._paletteResults;if(e.key==="Escape")e.preventDefault(),this._closePalette();else if(e.key==="ArrowDown")e.preventDefault(),this._paletteActive=Math.min(this._paletteActive+1,t.length-1);else if(e.key==="ArrowUp")e.preventDefault(),this._paletteActive=Math.max(this._paletteActive-1,0);else if(e.key==="Enter"){e.preventDefault();let i=t[this._paletteActive];i&&this._selectPaletteResult(i)}};this._onDialogEvent=async()=>{try{await this._loadData()}catch{}};this._onCalendarLlCustom=e=>{let t=e.detail;t?.type==="maintenance-supporter:open-task"&&t.entry_id&&t.task_id&&(e.stopPropagation(),this._showTask(t.entry_id,t.task_id))};this._onHistoryEntrySaved=async()=>{await this._loadData()}}get _lang(){return this.hass?.language||"en"}get _isOperator(){let e=this.hass?.user;return e?e.is_admin?!1:!(this._operatorWriteEnabled&&this._adminPanelUserIds.includes(e.id)):!0}connectedCallback(){super.connectedCallback(),window.addEventListener("popstate",this._popstateHandler),window.addEventListener("keydown",this._paletteKeydown),window.addEventListener("resize",this._onVirtualScroll,{passive:!0});let e=localStorage.getItem(V.taskSort);e&&["due_date","object","type","task_name","area","assigned_user","group"].includes(e)&&(this._sortMode=e);let t=localStorage.getItem(V.objectSort);t&&["alphabetical","due_soonest","task_count"].includes(t)&&(this._objectSortMode=t);let i=localStorage.getItem(V.groupBy);i&&["none","area","group","user"].includes(i)&&(this._groupByMode=i);let a=localStorage.getItem(V.objectView);(a==="cards"||a==="table")&&(this._objectViewMode=a)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._popstateHandler),window.removeEventListener("keydown",this._paletteKeydown),window.removeEventListener("resize",this._onVirtualScroll),this.shadowRoot?.querySelector(".content")?.removeEventListener("scroll",this._onVirtualScroll),this._virtScrollAttached=!1,this._virtRaf&&cancelAnimationFrame(this._virtRaf),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null,this._deepLinkHandled=!1,this._statsService?.clearCache(),this._statsService=null}updated(e){super.updated(e);let t=this.hass?.language;if(t&&!lt(t)&&Q(t).then(()=>this.requestUpdate()),e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,history.replaceState({msp_view:"overview",msp_entry:null,msp_task:null},""),this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}this._statsService?this._statsService.updateHass(this.hass):(this._statsService=new mt(this.hass),this._fetchMiniStatsForOverview()),this._userService?this._userService.updateHass(this.hass):(this._userService=new be(this.hass),this._userService.getUsers())}let i=this.shadowRoot?.querySelector(".content");i&&!this._virtScrollAttached&&(i.addEventListener("scroll",this._onVirtualScroll,{passive:!0}),this._virtScrollAttached=!0),this._updateVirtualWindow()}_updateVirtualWindow(){let e=this.shadowRoot?.querySelector(".content"),t=this.shadowRoot?.querySelector(".task-table.virtual");if(!e||!t)return;let i=t.querySelector(".task-row:not(.virt-sizer)");i&&i.offsetHeight>20&&(this._virtRowHeight=i.offsetHeight);let a=t.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop,l=Vi({scrollTop:e.scrollTop,viewportHeight:e.clientHeight,listTop:a,rowHeight:this._virtRowHeight,total:this._virtTotalRows});(l.start!==this._virtStart||l.end!==this._virtEnd)&&(this._virtStart=l.start,this._virtEnd=l.end)}async _loadData(){let[e,t,i,a,l]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/budget_status"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/groups"}).catch(()=>null),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).catch(()=>null)]);if(e&&(this._objects=e.objects),t&&(this._stats=t),i&&(this._budget=i),a&&(this._groups=a.groups||{}),l){let c=l;this._features=c.features,this._adminPanelUserIds=c.admin_panel_user_ids||[],this._operatorWriteEnabled=c.operator_write_enabled??!1;let h=c.general?.default_warning_days;typeof h=="number"&&h>=0&&h<=365&&(this._defaultWarningDays=h),this._objectsTableColumns=Ge(c.objects_table_columns)}this._fetchMiniStatsForOverview(),this._handleDeepLink()}_handleDeepLink(){if(this._deepLinkHandled)return;let e=new URLSearchParams(window.location.search),t=e.get("ms_action"),i=()=>{let g=window.location.pathname+window.location.hash;history.replaceState(history.state,"",g)};if(t==="add_object"){this._deepLinkHandled=!0,i(),requestAnimationFrame(()=>{this.shadowRoot?.querySelector("maintenance-object-dialog")?.openCreate()});return}if(t==="open_vacation"||t==="open_budget"||t==="open_groups"||t==="open_settings"){this._deepLinkHandled=!0,i(),this._overviewTab="settings",requestAnimationFrame(()=>{let g=this.shadowRoot?.querySelector("maintenance-settings-view"),m=t.replace("open_","");g?.scrollToSection?.(m)});return}let a=e.get("entry_id");if(!a)return;this._deepLinkHandled=!0;let l=e.get("task_id"),c=e.get("action"),h=window.location.pathname+window.location.hash;history.replaceState(history.state,"",h);let u=this._getObject(a);if(!u){this._showOverview();return}if(l){let g=u.tasks.find(m=>m.id===l);if(!g){this._showObject(a);return}this._showTask(a,l),c==="complete"?requestAnimationFrame(()=>{this._openCompleteDialog(a,l,g.name,this._features.checklists?g.checklist:void 0,this._features.adaptive&&!!g.adaptive_config?.enabled)}):c==="quick_complete"&&requestAnimationFrame(()=>{this._handleQuickComplete(a,l,g)})}else this._showObject(a)}_isCounterEntity(e){if(!e)return!1;let t=e.type||"threshold";return t==="counter"||t==="state_change"}async _fetchDetailStats(e,t){if(!this._statsService)return;let i=await this._statsService.getDetailStats(e,t,this._chartRangeDays),a=new Map(this._detailStatsData);a.set(e,i),this._detailStatsData=a}_setChartRange(e){if(e===this._chartRangeDays)return;this._chartRangeDays=e;try{localStorage.setItem(V.chartRange,String(e))}catch{}let t=this._selectedEntryId&&this._selectedTaskId?this._getTask(this._selectedEntryId,this._selectedTaskId):null,i=t?.trigger_config?.entity_id;if(i){let a=new Map(this._detailStatsData);a.delete(i),this._detailStatsData=a,this._fetchDetailStats(i,this._isCounterEntity(t.trigger_config))}}_setHideOutliers(e){if(e!==this._hideOutliers){this._hideOutliers=e;try{localStorage.setItem(V.chartHideOutliers,e?"1":"0")}catch{}}}async _fetchMiniStatsForOverview(){if(!this._statsService)return;let e=[];for(let i of this._objects)for(let a of i.tasks){let l=a.trigger_config?.entity_id;l&&e.push({entityId:l,isCounter:this._isCounterEntity(a.trigger_config)})}if(e.length===0)return;let t=await this._statsService.getBatchMiniStats(e);this._miniStatsData=new Map([...this._miniStatsData,...t])}async _subscribe(){try{let e=await this.hass.connection.subscribeMessage(t=>{let i=t;this._objects=i.objects},{type:"maintenance_supporter/subscribe"});if(!this.isConnected){e();return}this._unsub=e}catch{}}get _taskRows(){let e=[];for(let m of this._objects)for(let v of m.tasks){if(!this._showArchived&&v.archived||this._filterStatus&&v.status!==this._filterStatus)continue;if(this._filterUser){let $=this._filterUser==="current_user"?this._userService?.getCurrentUserId():this._filterUser;if(v.responsible_user_id!==$)continue}let f=[];for(let $ of Object.values(this._groups))$.task_refs?.some(b=>b.entry_id===m.entry_id&&b.task_id===v.id)&&f.push($.name);e.push({entry_id:m.entry_id,task_id:v.id,object_name:m.object.name,task_name:v.name,type:v.type,schedule_type:v.schedule_type,status:v.status,days_until_due:v.days_until_due??null,next_due:v.next_due??null,trigger_active:v.trigger_active,trigger_current_value:v.trigger_current_value??null,trigger_current_delta:v.trigger_current_delta??null,trigger_config:v.trigger_config??null,trigger_entity_info:v.trigger_entity_info??null,times_performed:v.times_performed,total_cost:v.total_cost,interval_days:v.interval_days??null,interval_unit:v.interval_unit??null,interval_anchor:v.interval_anchor??null,is_done:v.is_done??!1,archived:v.archived??!1,history:v.history||[],enabled:v.enabled,nfc_tag_id:v.nfc_tag_id??null,priority:v.priority??"normal",labels:v.labels??[],area_id:m.object.area_id??null,responsible_user_id:v.responsible_user_id??null,group_names:f})}let t={overdue:0,triggered:1,due_soon:2,ok:3},i=(m,v)=>(t[m.status]??9)-(t[v.status]??9),a=(m,v)=>(m.days_until_due??99999)-(v.days_until_due??99999),l=(m,v)=>i(m,v)||a(m,v),c=m=>m.area_id&&this.hass?.areas?.[m.area_id]?.name||"",h=m=>m.responsible_user_id&&this._userService?.getUserName(m.responsible_user_id)||"",u=m=>m.group_names[0]||"",g={due_date:l,object:(m,v)=>m.object_name.localeCompare(v.object_name)||l(m,v),type:(m,v)=>m.type.localeCompare(v.type)||l(m,v),task_name:(m,v)=>m.task_name.localeCompare(v.task_name),area:(m,v)=>{let f=c(m),$=c(v);return!f&&$?1:f&&!$?-1:f.localeCompare($)||l(m,v)},assigned_user:(m,v)=>{let f=h(m),$=h(v);return!f&&$?1:f&&!$?-1:f.localeCompare($)||l(m,v)},group:(m,v)=>{let f=u(m),$=u(v);return!f&&$?1:f&&!$?-1:f.localeCompare($)||l(m,v)}};return e.sort(g[this._sortMode]),e}_getObject(e){return this._objects.find(t=>t.entry_id===e)}_getTask(e,t){return this._getObject(e)?.tasks.find(a=>a.id===t)}_pushPanelState(e,t,i){let a={msp_view:e,msp_entry:t||null,msp_task:i||null};history.pushState(a,"")}_onPopState(e){let t=e.state;if(t?.msp_view&&(this._view=t.msp_view,this._selectedEntryId=t.msp_entry||null,this._selectedTaskId=t.msp_task||null,this._moreMenuOpen=!1,t.msp_view==="task"&&t.msp_entry&&t.msp_task)){this._historyFilter=null;let i=this._getTask(t.msp_entry,t.msp_task);i?.trigger_config?.entity_id&&this._fetchDetailStats(i.trigger_config.entity_id,this._isCounterEntity(i.trigger_config))}}_showOverview(){this._pushPanelState("overview"),this._view="overview",this._selectedEntryId=null,this._selectedTaskId=null,this._moreMenuOpen=!1,this._scrollContentToTop()}_showAllObjects(){this._pushPanelState("all_objects"),this._view="all_objects",this._selectedEntryId=null,this._selectedTaskId=null,this._scrollContentToTop()}_filterByStatus(e){this._filterStatus=e,this._overviewTab!=="dashboard"&&(this._overviewTab="dashboard"),this._scrollContentToTop()}_scrollContentToTop(){requestAnimationFrame(()=>{let e=this.shadowRoot?.querySelector(".content");e&&e.scrollTo({top:0,behavior:"smooth"})})}_showObject(e){this._pushPanelState("object",e),this._view="object",this._selectedEntryId=e,this._selectedTaskId=null,this._scrollContentToTop()}_showTask(e,t){this._pushPanelState("task",e,t),this._view="task",this._selectedEntryId=e,this._selectedTaskId=t,this._activeTab="overview",this._historyFilter=null,this._scrollContentToTop();let i=this._getTask(e,t);if(i?.trigger_config?.entity_id){let a=i.trigger_config.entity_id,l=this._isCounterEntity(i.trigger_config);this._fetchDetailStats(a,l)}}_showToast(e){this._toastTimer&&clearTimeout(this._toastTimer),this._toastUndo=null,this._toastMessage=e,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastTimer=null},4e3)}_showUndoToast(e,t){this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage=e,this._toastUndo=t,this._toastTimer=setTimeout(()=>{this._toastMessage="",this._toastUndo=null,this._toastTimer=null},7e3)}_runToastUndo(){let e=this._toastUndo;this._toastTimer&&clearTimeout(this._toastTimer),this._toastMessage="",this._toastUndo=null,this._toastTimer=null,e?.()}_openPalette(){this._paletteQuery="",this._paletteActive=0,this._paletteOpen=!0,this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".palette-input")?.focus()})}_closePalette(){this._paletteOpen=!1,this._paletteQuery=""}get _paletteResults(){let e=this._paletteQuery.trim().toLowerCase(),t=[];for(let i of this._objects){let a=i.object.name||"";(!e||a.toLowerCase().includes(e))&&t.push({kind:"object",entryId:i.entry_id,label:a,sub:s("object",this._lang)});for(let l of i.tasks){if(l.archived)continue;let c=l.name||"",h=(l.labels||[]).some(u=>u.toLowerCase().includes(e));if(!e||c.toLowerCase().includes(e)||a.toLowerCase().includes(e)||h){let u=(l.labels||[]).length?`  #${(l.labels||[]).join(" #")}`:"";t.push({kind:"task",entryId:i.entry_id,taskId:l.id,label:c,sub:a+u})}}if(t.length>60)break}return t.slice(0,40)}_selectPaletteResult(e){this._closePalette(),e.kind==="task"&&e.taskId?this._showTask(e.entryId,e.taskId):this._showObject(e.entryId)}_renderPalette(){if(!this._paletteOpen)return p;let e=this._lang,t=this._paletteResults;return o`
      <div class="palette-backdrop" @click=${()=>this._closePalette()}>
        <div class="palette" @click=${i=>i.stopPropagation()}>
          <input
            class="palette-input"
            type="text"
            placeholder="${s("palette_placeholder",e)}"
            .value=${this._paletteQuery}
            @input=${i=>{this._paletteQuery=i.target.value,this._paletteActive=0}}
          />
          <div class="palette-results">
            ${t.length===0?o`<div class="palette-empty">${s("palette_no_results",e)}</div>`:t.map((i,a)=>o`
                  <div class="palette-item ${a===this._paletteActive?"active":""}"
                    @mouseenter=${()=>{this._paletteActive=a}}
                    @click=${()=>this._selectPaletteResult(i)}>
                    <ha-icon icon="${i.kind==="task"?"mdi:clipboard-check-outline":"mdi:package-variant-closed"}"></ha-icon>
                    <span class="palette-label">${i.label}</span>
                    <span class="palette-sub">${i.sub}</span>
                  </div>
                `)}
          </div>
          <div class="palette-hint">${s("palette_hint",e)}</div>
        </div>
      </div>
    `}_openAdoptProblemSensors(){this.shadowRoot.querySelector("maintenance-adopt-problem-sensors-dialog")?.open()}_onProblemSensorsAdopted(e){let t=e.detail?.tasks_created??0;this._showToast(s("adopt_problem_done",this._lang).replace("{tasks}",String(t))),this._loadData()}async _openTemplateGallery(){if(this._templateGalleryOpen=!0,!(this._templates.length>0))try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._templateCategories=e.categories||{},this._templates=(e.templates||[]).filter(t=>!t.disabled)}catch{this._showToast(s("action_error",this._lang))}}async _createFromTemplate(e){this._templateBusy=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/from_template",language:this._lang,template_id:e});this._templateGalleryOpen=!1,await this._loadData(),this._showToast(s("template_created",this._lang)),t?.entry_id&&this._showObject(t.entry_id)}catch{this._showToast(s("action_error",this._lang))}finally{this._templateBusy=!1}}_categoryName(e){let t=this._templateCategories[e];return t&&(t[`name_${this._lang}`]||t.name_en)||e}_renderTemplateGallery(){if(!this._templateGalleryOpen)return p;let e=this._lang,t=new Map;for(let i of this._templates)t.has(i.category)||t.set(i.category,[]),t.get(i.category).push(i);return o`
      <div class="palette-backdrop" @click=${()=>{this._templateGalleryOpen=!1}}>
        <div class="template-gallery" @click=${i=>i.stopPropagation()}>
          <div class="template-gallery-head">
            <span>${s("templates_title",e)}</span>
            <ha-icon-button .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
              @click=${()=>{this._templateGalleryOpen=!1}}></ha-icon-button>
          </div>
          <div class="template-gallery-body">
            ${this._templates.length===0?o`<div class="palette-empty">${s("loading",e)}…</div>`:[...t.entries()].map(([i,a])=>o`
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
                          <span class="template-card-count">${s("templates_task_count",e).replace("{n}",String(l.tasks.length))}</span>
                        </button>
                      `)}
                    </div>
                  </div>
                `)}
          </div>
        </div>
      </div>
    `}_bulkKey(e){return`${e.entry_id}:${e.task_id}`}_toggleBulkMode(){this._bulkMode=!this._bulkMode,this._bulkMode||(this._bulkSelected=new Set)}_toggleBulkRow(e){let t=this._bulkKey(e),i=new Set(this._bulkSelected);i.has(t)?i.delete(t):i.add(t),this._bulkSelected=i}_bulkSelectAll(e){let t=e.map(a=>this._bulkKey(a)),i=t.every(a=>this._bulkSelected.has(a));this._bulkSelected=i?new Set:new Set(t)}async _runBulk(e,t,i,a){let l=e.filter(h=>this._bulkSelected.has(this._bulkKey(h)));if(l.length===0)return;this._actionLoading=!0;let c=0;for(let h of l)try{await this.hass.connection.sendMessagePromise(t(h)),c++}catch{}this._actionLoading=!1,this._bulkSelected=new Set,this._bulkMode=!1,await this._loadData(),a&&c>0?this._showUndoToast(i(c),a):this._showToast(i(c))}_bulkComplete(e){this._runBulk(e,t=>({type:"maintenance_supporter/task/complete",entry_id:t.entry_id,task_id:t.task_id}),t=>s("bulk_completed",this._lang).replace("{n}",String(t)))}_bulkArchive(e){let t=e.filter(i=>this._bulkSelected.has(this._bulkKey(i))).map(i=>({entry_id:i.entry_id,task_id:i.task_id}));this._runBulk(e,i=>({type:"maintenance_supporter/task/archive",entry_id:i.entry_id,task_id:i.task_id}),i=>s("bulk_archived",this._lang).replace("{n}",String(i)),async()=>{for(let i of t)try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/unarchive",entry_id:i.entry_id,task_id:i.task_id})}catch{}await this._loadData()})}async _deleteObject(e){if(await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_object",this._lang),confirmText:s("delete",this._lang),danger:!0}))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/delete",entry_id:e}),this._showOverview(),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}_printObjectReport(e){let t=this._getObject(e);if(!t)return;let i=this._lang,a={title:s("report_title",i),generated:s("report_generated",i),manufacturer:s("manufacturer",i),model:s("model",i),serial:s("serial_number_label",i),installed:s("installed",i),warranty:s("warranty",i),area:s("area",i),notes:s("report_notes",i),tasksHeading:s("tasks",i),colTask:s("task_name",i),colType:s("report_col_type",i),colStatus:s("report_col_status",i),colSchedule:s("report_col_schedule",i),colLastDone:s("last_performed",i),colNextDue:s("next_due",i),colCost:s("cost",i),colTimes:s("report_times_done",i),totalCost:s("report_total_cost",i),scheduleLabel:h=>Ye(h,i),none:"\u2014",statusLabel:h=>s(h,i),typeLabel:h=>s(h,i)},l=_i(t.object,t.tasks,a,h=>h?W(h,i):"",this._budget?.currency_symbol||Ee,new Date().toISOString()),c=URL.createObjectURL(new Blob([l],{type:"text/html"}));window.open(c,"_blank"),setTimeout(()=>URL.revokeObjectURL(c),6e4)}async _duplicateObject(e){this._actionLoading=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/duplicate",entry_id:e});await this._loadData(),this._showToast(s("object_duplicated",this._lang)),t?.entry_id&&this._showObject(t.entry_id)}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _deleteTask(e,t){if(await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.confirm({title:s("delete",this._lang),message:s("confirm_delete_task",this._lang),confirmText:s("delete",this._lang),danger:!0}))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/delete",entry_id:e,task_id:t}),this._showObject(e),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _duplicateTask(e,t){this._moreMenuOpen=!1,this._actionLoading=!0;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/duplicate",entry_id:e,task_id:t});await this._loadData(),this._showToast(s("task_duplicated",this._lang)),i?.task_id&&this._showTask(e,i.task_id)}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _toggleArchiveTask(e,t,i){this._actionLoading=!0;try{await this.hass.connection.sendMessagePromise({type:i?"maintenance_supporter/task/unarchive":"maintenance_supporter/task/archive",entry_id:e,task_id:t}),await this._loadData(),i||this._showUndoToast(s("task_archived",this._lang),()=>this._toggleArchiveTask(e,t,!0))}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _toggleArchiveObject(e,t){try{await this.hass.connection.sendMessagePromise({type:t?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:e}),await this._loadData(),t||this._showUndoToast(s("object_archived",this._lang),()=>this._toggleArchiveObject(e,!0))}catch{this._showToast(s("action_error",this._lang))}}async _togglePauseObject(e,t){if(!t){let a=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("pause_object",this._lang),message:s("pause_until_prompt",this._lang),confirmText:s("pause_object",this._lang),inputLabel:s("pause_until_label",this._lang),inputType:"date"});if(!a?.confirmed)return;try{let l={type:"maintenance_supporter/object/pause",entry_id:e};a.value&&(l.until=a.value),await this.hass.connection.sendMessagePromise(l),await this._loadData(),this._showUndoToast(s("object_paused",this._lang),()=>this._togglePauseObject(e,!0))}catch(l){this._showToast(M(l,this._lang))}return}try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/resume",entry_id:e}),await this._loadData(),this._showToast(s("object_resumed",this._lang))}catch(i){this._showToast(M(i,this._lang))}}async _replaceObject(e,t){let a=await this.shadowRoot.querySelector("maintenance-confirm-dialog")?.prompt({title:s("replace_object",this._lang),message:s("replace_object_prompt",this._lang),confirmText:s("replace_object",this._lang),inputLabel:s("replace_name_label",this._lang),inputType:"text",inputValue:t});if(a?.confirmed){this._actionLoading=!0;try{let l=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object/replace",entry_id:e,name:a.value||t});await this._loadData(),this._showToast(s("object_replaced",this._lang)),l?.entry_id&&this._showObject(l.entry_id)}catch(l){this._showToast(M(l,this._lang))}finally{this._actionLoading=!1}}}async _skipTask(e,t,i){this._actionLoading=!0;try{let a={type:"maintenance_supporter/task/skip",entry_id:e,task_id:t};i&&(a.reason=i),await this.hass.connection.sendMessagePromise(a),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _resetTask(e,t,i){this._actionLoading=!0;try{let a={type:"maintenance_supporter/task/reset",entry_id:e,task_id:t};i&&(a.date=i),await this.hass.connection.sendMessagePromise(a),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _applySuggestion(e,t,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/apply_suggestion",entry_id:e,task_id:t,interval:i}),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}_openSeasonalOverrides(e){let t=this.shadowRoot.querySelector("maintenance-seasonal-overrides-dialog");if(!t||!this._selectedEntryId)return;let i=e.adaptive_config?.seasonal_overrides;t.open(this._selectedEntryId,e.id,i)}async _reanalyzeInterval(e,t){try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/analyze_interval",entry_id:e,task_id:t});i.recommended_interval?this._showToast(`${s("reanalyze_result",this._lang)}: ${i.recommended_interval} ${s("days",this._lang)} (${s(`confidence_${i.confidence}`,this._lang)}, ${i.data_points} ${s("data_points",this._lang)})`):this._showToast(s("reanalyze_insufficient_data",this._lang)),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}async _promptSkipTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("skip",this._lang),message:s("skip_reason_prompt",this._lang),confirmText:s("skip",this._lang),inputLabel:s("reason_optional",this._lang),inputType:"text"});a.confirmed&&this._skipTask(e,t,a.value||void 0)}async _promptResetTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("reset",this._lang),message:s("reset_date_prompt",this._lang),confirmText:s("reset",this._lang),inputLabel:s("reset_date_optional",this._lang),inputType:"date"});a.confirmed&&this._resetTask(e,t,a.value||void 0)}async _postponeTask(e,t,i){this._actionLoading=!0;try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/postpone",entry_id:e,task_id:t,until:i}),this._showToast(s("postponed",this._lang)),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}async _promptPostponeTask(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(!i)return;let a=await i.prompt({title:s("postpone",this._lang),message:s("postpone_date_prompt",this._lang),confirmText:s("postpone",this._lang),inputLabel:s("postpone_date_label",this._lang),inputType:"date"});!a.confirmed||!a.value||this._postponeTask(e,t,a.value)}async _snoozeTask(e,t){this._actionLoading=!0;try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/snooze",entry_id:e,task_id:t}),this._showToast(s("snoozed",this._lang))}catch{this._showToast(s("action_error",this._lang))}finally{this._actionLoading=!1}}_dismissSuggestion(e,t){e&&t&&this._dismissedSuggestions.add(`${e}_${t}`),this.requestUpdate()}async _handleQuickComplete(e,t,i){try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/quick_complete",entry_id:e,task_id:t}),this._showToast(s("quick_complete_success",this._lang))}catch(a){(a?.code||"")==="no_defaults"?this._openCompleteDialog(e,t,i.name,this._features.checklists?i.checklist:void 0,this._features.adaptive&&!!i.adaptive_config?.enabled):this._showToast(s("action_error",this._lang))}}async _printTaskWorksheet(e,t){let i=this._getObject(e),a=i?.tasks.find(l=>l.id===t);if(!(!i||!a)){this._actionLoading=!0;try{let l={type:"maintenance_supporter/qr/generate",entry_id:e,task_id:t,url_mode:"server"},[c,h]=await Promise.all([this.hass.connection.sendMessagePromise({...l,action:"view"}).catch(()=>null),this.hass.connection.sendMessagePromise({...l,action:"complete"}).catch(()=>null)]),u=null;try{let C=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:e})).documents||[]).find(L=>L.kind==="file"&&L.mime==="application/pdf"&&(L.task_ids||[]).includes(t)&&L.task_pages?.[t]);if(C){let L=C.task_pages[t],I=4,E=await this.hass.connection.sendMessagePromise({type:"auth/sign_path",path:`/api/maintenance_supporter/document/${C.id}/excerpt?start=${L}&count=${I}`,expires:3600});u={title:C.title||C.filename||"Manual",startPage:L,endPage:L+I-1,url:new URL(E.path,window.location.origin).toString(),vendorBase:new URL("/maintenance_supporter_vendor",window.location.origin).toString()}}}catch{}let g=this._lang,m={title:s("worksheet",g),object:s("object",g),type:s("maintenance_type",g),interval:s("interval",g),nextDue:s("next_due",g),lastDone:s("last_performed",g),priority:s("priority",g),checklist:s("checklist",g),notes:s("notes_label",g),scanView:s("worksheet_scan_view",g),scanComplete:s("worksheet_scan_complete",g),manualExcerpt:s("worksheet_manual_excerpt",g),pages:s("worksheet_pages",g),printedOn:s("worksheet_printed",g),never:s("worksheet_never",g),typeLabel:A=>s(A,g),statusLabel:A=>s(A,g),parts:s("consumes_parts_label",g)},v=i.parts||[],f=(a.consumes_parts||[]).map(A=>{let C=v.find(E=>E.id===A.part_id);if(!C)return"";let L=C.stock!==null&&C.stock!==void 0?` (${C.stock}${C.unit?" "+C.unit:""})`:"",I=C.storage_location?` \u2014 ${C.storage_location}`:"";return`${A.quantity}\xD7 ${C.name}${L}${I}`}).filter(Boolean),$=gi(a,i.object.name,m,A=>W(A,g),A=>Ye(A,g),c?.svg_data_uri||null,h?.svg_data_uri||null,u,new Date().toISOString(),f),b=URL.createObjectURL(new Blob([$],{type:"text/html"}));window.open(b,"_blank"),setTimeout(()=>URL.revokeObjectURL(b),6e4)}finally{this._actionLoading=!1}}}_openCompleteDialog(e,t,i,a,l){let c=this.shadowRoot.querySelector("maintenance-complete-dialog");if(!c)return;c.entryId=e,c.taskId=t,c.taskName=i,c.lang=this._lang,c.checklist=a||[],c.adaptiveEnabled=!!l;let h=this._objects.find(v=>v.entry_id===e)?.tasks.find(v=>v.id===t);c.taskType=h?.type||"",c.readingUnit=h?.reading_unit||"";let u=this._objects.find(v=>v.entry_id===e)?.parts||[],g=new Map(u.map(v=>[v.id,v])),m=h?.part_ref?g.get(h.part_ref.part_id):void 0;c.restockDefault=h?.part_ref?m?.restock_quantity??1:null,c.consumesInfo=(h?.consumes_parts||[]).map(v=>{let f=g.get(v.part_id);if(!f)return"";let $=f.storage_location?` \u2014 ${f.storage_location}`:"",b=f.stock!==null&&f.stock!==void 0?` (${f.stock}${f.unit?" "+f.unit:""})`:"";return`${v.quantity}\xD7 ${f.name}${b}${$}`}).filter(Boolean),c.open()}_openQrForObject(e,t){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForObject(e,t)}_openQrForTask(e,t,i,a){this.shadowRoot.querySelector("maintenance-qr-dialog")?.openForTask(e,t,i,a)}render(){return o`
      <div class="panel">
        ${this.narrow||this._view!=="overview"?this._renderHeader():p}
        <div class="content">
          ${this._view==="overview"?this._renderOverview():this._view==="all_objects"?this._renderAllObjects():this._view==="object"?this._renderObjectDetail():this._renderTaskDetail()}
        </div>
      </div>
      <maintenance-object-dialog
        .hass=${this.hass}
        .objects=${this._objects}
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
      <maintenance-adopt-problem-sensors-dialog
        .hass=${this.hass}
        @problem-sensors-adopted=${e=>this._onProblemSensorsAdopted(e)}
      ></maintenance-adopt-problem-sensors-dialog>
      ${this._toastMessage?o`<div class="toast">
        <span>${this._toastMessage}</span>
        ${this._toastUndo?o`<button class="toast-undo" @click=${()=>this._runToastUndo()}>${s("undo",this._lang)}</button>`:p}
      </div>`:p}
      ${this._renderPalette()}
      ${this._renderTemplateGallery()}
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
        <div class="tab ${this._overviewTab==="today"?"active":""}"
          @click=${()=>this._setOverviewTab("today")}>
          ${s("tab_today",e)}
        </div>
        <div class="tab ${this._overviewTab==="dashboard"?"active":""}"
          @click=${()=>this._setOverviewTab("dashboard")}>
          ${s("dashboard",e)}
        </div>
        <div class="tab ${this._overviewTab==="calendar"?"active":""}"
          @click=${()=>this._setOverviewTab("calendar")}>
          ${s("tab_calendar",e)}
        </div>
        ${t?o`
          <div class="tab ${this._overviewTab==="settings"?"active":""}"
            @click=${()=>this._setOverviewTab("settings")}>
            ${s("settings",e)}
          </div>
        `:p}
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
    `}_statusBadge(e,t,i){let a=this._lang,l=e?"archived":t?"done":i,c=e?"archived":t?"completed":i,h=e?s("archived",a):t?s("completed",a):s(i,a);return o`<span class="status-badge ${l}"><ha-icon icon="${Ve[c]||"mdi:circle-medium"}"></ha-icon>${h}</span>`}_setOverviewTab(e){this._overviewTab=e;try{localStorage.setItem(V.overviewTab,e)}catch{}this._scrollContentToTop()}_renderToday(){let e=this._lang,t=this._taskRows,i=u=>`${u.entry_id}:${u.task_id}`,a=t.filter(u=>u.status==="overdue"||u.trigger_active),l=new Set(a.map(i)),c=t.filter(u=>!l.has(i(u))&&u.days_until_due===0);c.forEach(u=>l.add(i(u)));let h=t.filter(u=>!l.has(i(u))&&u.days_until_due!=null&&u.days_until_due>0&&u.days_until_due<=7);return a.length+c.length+h.length===0?o`
        <div class="today-empty">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <p>${s("today_all_caught_up",e)}</p>
        </div>
      `:o`
      <div class="today-view">
        ${this._renderTodaySection("today_overdue",a,"overdue")}
        ${this._renderTodaySection("today_due_today",c,"due_soon")}
        ${this._renderTodaySection("today_this_week",h,"")}
      </div>
    `}_renderTodaySection(e,t,i){if(t.length===0)return p;let a=this._lang;return o`
      <div class="today-section">
        <div class="today-section-header ${i}">
          <span>${s(e,a)}</span><span class="today-badge">${t.length}</span>
        </div>
        ${t.map(l=>o`
          <div class="today-row" @click=${()=>this._showTask(l.entry_id,l.task_id)}>
            <span class="today-dot ${l.trigger_active?"triggered":l.status}"></span>
            <div class="today-main">
              <div class="today-task">${l.task_name}</div>
              <div class="today-object">${l.object_name} · ${Me(l.days_until_due,a)}</div>
            </div>
            <mwc-icon-button class="btn-complete" title="${s("complete",a)}"
              @click=${c=>{c.stopPropagation(),this._openCompleteDialogForRow(l)}}>
              <ha-icon icon="mdi:check"></ha-icon>
            </mwc-icon-button>
          </div>
        `)}
      </div>
    `}_renderDashboard(){let e=this._stats,t=this._taskRows,i=this._lang,a=this._isOperator,l=this._objects.reduce((c,h)=>c+h.tasks.filter(u=>u.archived).length,0);return o`
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
            @change=${c=>{let h=c.target.value;this._filterUser=h||null}}
          >
            <option value="">${s("all_users",i)}</option>
            <option value="current_user">${s("my_tasks",i)}</option>
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">${s("sort_label",i)}</span>
          <select
            .value=${this._sortMode}
            @change=${c=>{this._sortMode=c.target.value,localStorage.setItem(V.taskSort,this._sortMode)}}
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
            @change=${c=>{this._groupByMode=c.target.value,localStorage.setItem(V.groupBy,this._groupByMode)}}
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
        ${!a&&t.length>0?o`
          <ha-button
            class="bulk-toggle ${this._bulkMode?"active":""}"
            @click=${()=>this._toggleBulkMode()}
          >
            <ha-icon icon="mdi:checkbox-multiple-marked-outline"></ha-icon>
            ${this._bulkMode?s("cancel",i):s("bulk_select",i)}
          </ha-button>
        `:p}
        ${a?p:o`
          <ha-button
            @click=${()=>this.shadowRoot.querySelector("maintenance-object-dialog")?.openCreate()}
          >
            ${s("new_object",i)}
          </ha-button>
          <ha-button @click=${()=>this._openTemplateGallery()}>
            <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon> ${s("templates_from",i)}
          </ha-button>
          <ha-button @click=${()=>this._openAdoptProblemSensors()}>
            <ha-icon icon="mdi:alert-circle-check-outline"></ha-icon> ${s("adopt_problem_button",i)}
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
              `:p}
            </div>
          `:o`
            ${this._bulkMode?this._renderBulkBar(t,i):p}
            ${this._groupByMode==="none"?this._renderTaskTable(t):this._renderGroupedTasks(t,i)}
          `}

      ${this._features.groups&&!a?this._renderGroupsSection():p}
      ${a?p:o`<maintenance-storage-section-card
            .hass=${this.hass}
            .objects=${this._objects}
            @open-object=${c=>{let h=c.detail?.entry_id;h&&this._showObject(h)}}
          ></maintenance-storage-section-card>`}
    `}_renderTaskTable(e){let t=this._bulkMode?" bulk":"";if(this._virtTotalRows=e.length,this.narrow||e.length<120)return o`
        <div class="task-table${t}">
          ${e.map(g=>this._renderOverviewRow(g))}
        </div>
      `;let i=e.length,a=this._virtRowHeight,l=Math.max(0,Math.min(this._virtStart,i)),c=this._virtEnd>0?Math.min(this._virtEnd,i):Math.min(i,40);c<l&&(l=0,c=Math.min(i,40));let h=l*a,u=(i-c)*a;return o`
      <div class="task-table${t} virtual">
        ${this._renderVirtSizerRow(e)}
        ${h>0?o`<div class="virt-spacer" style="height:${h}px"></div>`:p}
        ${e.slice(l,c).map(g=>this._renderOverviewRow(g))}
        ${u>0?o`<div class="virt-spacer" style="height:${u}px"></div>`:p}
      </div>
    `}_renderVirtSizerRow(e){let t=this._lang,i="",a=!1,l=!1,c=!1;for(let h of e){let u=h.archived?s("archived",t):h.is_done?s("completed",t):s(h.status,t);u.length>i.length&&(i=u),h.enabled||(a=!0),h.nfc_tag_id&&(l=!0),(h.priority==="high"||h.priority==="low")&&(c=!0)}return o`
      <div class="task-row virt-sizer" aria-hidden="true">
        ${this._bulkMode?o`<span></span>`:p}
        <span class="cell-badges">
          <span class="status-badge"><ha-icon icon="mdi:circle-medium"></ha-icon>${i}</span>
          ${a?o`<span class="badge-disabled">${s("disabled",t)}</span>`:p}
          ${l?o`<span class="nfc-badge"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:p}
          ${c?o`<span class="priority-badge"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:p}
        </span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    `}_renderBulkBar(e,t){let i=this._bulkSelected.size,a=e.length>0&&e.every(l=>this._bulkSelected.has(this._bulkKey(l)));return o`
      <div class="bulk-bar">
        <label class="bulk-selectall">
          <input type="checkbox" .checked=${a} @change=${()=>this._bulkSelectAll(e)} />
          ${s("bulk_select_all",t)}
        </label>
        <span class="bulk-count">${s("bulk_n_selected",t).replace("{n}",String(i))}</span>
        <span class="bulk-actions">
          <ha-button appearance="filled" .disabled=${i===0||this._actionLoading}
            @click=${()=>this._bulkComplete(e)}>
            <ha-icon icon="mdi:check"></ha-icon> ${s("complete",t)}
          </ha-button>
          <ha-button appearance="plain" .disabled=${i===0||this._actionLoading}
            @click=${()=>this._bulkArchive(e)}>
            <ha-icon icon="mdi:archive-outline"></ha-icon> ${s("archive",t)}
          </ha-button>
        </span>
      </div>
    `}_renderGroupedTasks(e,t){let i=new Map,a=s("unassigned",t);for(let h of e){let u=[];this._groupByMode==="area"?u=[(h.area_id?this.hass?.areas?.[h.area_id]?.name:null)||a]:this._groupByMode==="user"?u=[(h.responsible_user_id?this._userService?.getUserName(h.responsible_user_id):null)||a]:this._groupByMode==="group"&&(u=h.group_names.length>0?h.group_names:[a]);for(let g of u)i.has(g)||i.set(g,[]),i.get(g).push(h)}let l=[...i.entries()].sort(([h],[u])=>h===a&&u!==a?1:u===a&&h!==a?-1:h.localeCompare(u)),c=this._groupByMode==="area"?"mdi:map-marker-outline":this._groupByMode==="group"?"mdi:folder-outline":"mdi:account-outline";return o`
      ${l.map(([h,u])=>o`
        <details class="group-section" open>
          <summary class="group-section-header">
            <ha-icon icon="${c}"></ha-icon>
            <span>${h}</span>
            <span class="group-section-count">(${u.length})</span>
          </summary>
          <div class="task-table${this._bulkMode?" bulk":""}">
            ${u.map(g=>this._renderOverviewRow(g))}
          </div>
        </details>
      `)}
    `}_warrantyLabel(e,t,i){return e.kind==="expired"?s("warranty_expired",i):e.kind==="expiring"?s("warranty_expires_in",i).replace("{days}",String(e.days??0)):s("warranty_valid_until",i).replace("{date}",W(t,i))}_renderWarrantyMeta(e,t){let i=qt(e);return o`<p class="meta">${s("warranty",t)}:
      <span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,e,t)}</span></p>`}_renderAllObjects(){let e=this._lang,t=this._isOperator,i=this._objectViewMode==="table"&&!this.narrow,a=this._objects.filter(g=>g.object.archived).length,l=g=>{let m=1/0;for(let v of g.tasks){let f=v.days_until_due;f!=null&&f<m&&(m=f)}return m},c=this._objects.filter(g=>this._showArchived||!g.object.archived);this._objectSortMode==="alphabetical"?c.sort((g,m)=>g.object.name.localeCompare(m.object.name)):this._objectSortMode==="task_count"?c.sort((g,m)=>m.tasks.length-g.tasks.length||g.object.name.localeCompare(m.object.name)):c.sort((g,m)=>l(g)-l(m)||g.object.name.localeCompare(m.object.name));let h=()=>{let g=new Map;for(let m of c){let v=m.object.area_id,f=v?this.hass?.areas?.[v]?.name||s("unassigned",e):s("no_area",e);g.has(f)||g.set(f,[]),g.get(f).push(m)}return new Map([...g.entries()].sort(([m],[v])=>m.localeCompare(v)))},u=g=>{let m=g.tasks.some(v=>v.status==="overdue"||v.status==="triggered");return o`
        <div class="object-card${m?" object-card-overdue":""}" @click=${()=>this._showObject(g.entry_id)}>
          ${m?o`<span class="overdue-dot" title="${s("has_overdue",e)}"></span>`:p}
          <div class="object-card-header">
            <span class="object-card-name">${g.object.name}</span>
            ${g.object.paused?o`<span class="paused-badge" title="${s("object_paused_badge",e)}${g.object.paused_until?` \u2014 ${g.object.paused_until}`:""}">
                  <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
                </span>`:p}
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
            @change=${g=>{this._objectSortMode=g.target.value,localStorage.setItem(V.objectSort,this._objectSortMode)}}
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
            @change=${g=>{this._groupByMode=g.target.value,localStorage.setItem(V.groupBy,this._groupByMode)}}
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
          ${[...h().entries()].map(([g,m])=>o`
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
    `}_setObjectViewMode(e){this._objectViewMode=e,localStorage.setItem(V.objectView,e)}async _exportObjectsCsv(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects/csv"}),t=new Date().toISOString().slice(0,10);_t(e.csv,`maintenance_objects_${t}.csv`,"text/csv;charset=utf-8")}catch{this._showToast(s("action_error",this._lang))}}_renderObjectsTable(e){let t=this._lang,i=this._objectsTableColumns;return o`
      <div class="objects-table-wrap">
        <table class="objects-table">
          <thead>
            <tr>
              ${i.map(a=>{let l=Re.find(h=>h.key===a),c=l&&l.key!=="actions"?s(l.labelKey,t):"";return o`<th class="oc-${a}">${c}</th>`})}
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
        </td>`;case"manufacturer":return o`<td class="oc-manufacturer">${a.manufacturer||"\u2014"}</td>`;case"model":return o`<td class="oc-model">${a.model||"\u2014"}</td>`;case"serial_number":return o`<td class="oc-serial_number">${a.serial_number||"\u2014"}</td>`;case"installation_date":return o`<td class="oc-installation_date">${a.installation_date?W(a.installation_date,i):"\u2014"}</td>`;case"warranty_expiry":return o`<td class="oc-warranty_expiry">${this._renderWarrantyCell(a.warranty_expiry,i)}</td>`;case"area_id":{let l=a.area_id?this.hass?.areas?.[a.area_id]?.name||a.area_id:"\u2014";return o`<td class="oc-area_id">${l}</td>`}case"documentation_url":return o`<td class="oc-documentation_url">${a.documentation_url&&/^https?:\/\//i.test(a.documentation_url)?o`<a href=${a.documentation_url} target="_blank" rel="noopener noreferrer"
                @click=${l=>l.stopPropagation()}><ha-icon icon="mdi:file-document-outline"></ha-icon></a>`:"\u2014"}</td>`;case"notes":return o`<td class="oc-notes" title=${a.notes||""}>${a.notes||"\u2014"}</td>`;case"task_count":return o`<td class="oc-task_count">${t.tasks.length}</td>`;case"actions":return o`<td class="oc-actions">
          <mwc-icon-button title="${s("qr_code",i)}" @click=${l=>{l.stopPropagation(),this._openQrForObject(t.entry_id,a.name)}}>
            <ha-icon icon="mdi:qrcode"></ha-icon>
          </mwc-icon-button>
        </td>`;default:return o`<td></td>`}}_renderWarrantyCell(e,t){let i=qt(e);return i.kind==="none"?o`<span class="warranty-none">—</span>`:o`<span class="warranty-chip warranty-${i.kind}">${this._warrantyLabel(i,e,t)}</span>`}async _onSettingsChanged(){await this._loadData()}_renderGroupsSection(){if(!this._features.groups)return p;let e=Object.entries(this._groups),t=this._lang;return o`
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
    `}_openGroupCreate(){this.shadowRoot.querySelector("maintenance-group-dialog")?.openCreate()}_openGroupEdit(e){let t=this._groups[e];t&&this.shadowRoot.querySelector("maintenance-group-dialog")?.openEdit(e,t)}async _deleteGroup(e,t){let i=this.shadowRoot.querySelector("maintenance-confirm-dialog");if(i?await i.confirm({title:s("delete_group",this._lang),message:s("delete_group_confirm",this._lang).replace("{name}",t),confirmText:s("delete",this._lang)}):confirm(`${s("delete_group_confirm",this._lang).replace("{name}",t)}`))try{await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/group/delete",group_id:e}),await this._loadData()}catch{this._showToast(s("action_error",this._lang))}}_renderBudgetBar(){let e=this._budget;if(!e)return p;let t=this._lang,i=e.currency_symbol||Ee,a=[];return e.monthly_budget>0&&a.push({label:s("budget_monthly",t),spent:e.monthly_spent,budget:e.monthly_budget}),e.yearly_budget>0&&a.push({label:s("budget_yearly",t),spent:e.yearly_spent,budget:e.yearly_budget}),a.length===0?p:o`
      <div class="budget-bars">
        ${a.map(l=>{let c=Math.min(100,Math.max(0,l.spent/l.budget*100)),h=c>=100?"var(--error-color, #f44336)":c>=e.alert_threshold_pct?"var(--warning-color, #ff9800)":"var(--success-color, #4caf50)";return o`
            <div class="budget-item">
              <div class="budget-label">
                <span>${l.label}</span>
                <span>${l.spent.toFixed(2)} / ${l.budget.toFixed(2)} ${i}</span>
              </div>
              <div class="budget-bar">
                <div class="budget-bar-fill" style="width:${c}%; background:${h}"></div>
              </div>
            </div>
          `})}
      </div>
    `}_renderOverviewRow(e){let t=this._lang,i=e.schedule_type==="time_based"&&e.interval_days&&e.interval_days>0,a=0,l=We.ok,c=!1;if(i&&e.days_until_due!==null){let v=ht(e.interval_days,e.days_until_due,e.interval_unit);a=v.pct,c=v.overflow,e.status==="overdue"?l=We.overdue:e.status==="due_soon"&&(l=We.due_soon)}let h=e.area_id?this.hass?.areas?.[e.area_id]?.name:null,u=e.responsible_user_id?this._userService?.getUserName(e.responsible_user_id):null,g=e.group_names.length>0||h||u,m=this._bulkMode&&this._bulkSelected.has(this._bulkKey(e));return o`
      <div class="task-row${e.enabled?"":" task-disabled"}${m?" bulk-selected":""}">
        ${this._bulkMode?o`
          <label class="cell bulk-check" @click=${v=>v.stopPropagation()}>
            <input type="checkbox" .checked=${m} @change=${()=>this._toggleBulkRow(e)} />
          </label>
        `:p}
        <span class="cell-badges">
          ${this._statusBadge(!!e.archived,e.is_done,e.status)}
          ${e.enabled?p:o`<span class="badge-disabled">${s("disabled",t)}</span>`}
          ${e.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_linked",t)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:p}
          ${e.priority==="high"?o`<span class="priority-badge priority-high" title="${s("priority_high",t)}"><ha-icon icon="mdi:chevron-double-up"></ha-icon></span>`:p}
          ${e.priority==="low"?o`<span class="priority-badge priority-low" title="${s("priority_low",t)}"><ha-icon icon="mdi:chevron-double-down"></ha-icon></span>`:p}
        </span>
        <span class="cell object-name" @click=${v=>{v.stopPropagation(),this._showObject(e.entry_id)}}>${e.object_name}</span>
        <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,e.task_id)}>${e.task_name}</span>
        <span class="task-sub${g?"":" task-sub-empty"}">
          ${e.group_names.length>0?o`
            <span class="sub-chip" title="${s("groups",t)}">
              <ha-icon icon="mdi:folder-outline"></ha-icon>${e.group_names.join(", ")}
            </span>`:p}
          ${h?o`
            <span class="sub-chip">
              <ha-icon icon="mdi:map-marker-outline"></ha-icon>${h}
            </span>`:p}
          ${u?o`
            <span class="sub-chip" title="${s("responsible_user",t)}">
              <ha-icon icon="mdi:account-outline"></ha-icon>${u}
            </span>`:p}
          ${(e.labels||[]).map(v=>o`
            <span class="sub-chip label-chip" title="${s("labels",t)}">
              <ha-icon icon="mdi:tag-outline"></ha-icon>${v}
            </span>`)}
        </span>
        <span class="cell type">${s(e.type,t)}</span>
        <span class="due-cell" @click=${()=>this._showTask(e.entry_id,e.task_id)}>
          <span class="due-text">${Me(e.days_until_due,t)}</span>
          ${i?o`<div class="days-bar"><div class="days-bar-fill${c?" overflow":""}" style="width:${a}%;background:${l}"></div></div>`:p}
          ${e.trigger_config?Nt(e):!i&&e.trigger_active?o`<span style="color:var(--maint-triggered-color);font-weight:600">⚡</span>`:p}
          ${Ft(e,this._miniStatsData,this._lang)}
        </span>
        <span class="row-actions">
          <mwc-icon-button class="btn-complete" title="${s("complete",t)}" @click=${v=>{v.stopPropagation(),this._openCompleteDialogForRow(e)}}>
            <ha-icon icon="mdi:check"></ha-icon>
          </mwc-icon-button>
          <mwc-icon-button class="btn-skip" title="${s("skip",t)}" .disabled=${this._actionLoading} @click=${v=>{v.stopPropagation(),this._promptSkipTask(e.entry_id,e.task_id)}}>
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </mwc-icon-button>
        </span>
      </div>
    `}_openCompleteDialogForRow(e){let i=this._objects.find(a=>a.entry_id===e.entry_id)?.tasks.find(a=>a.id===e.task_id);this._openCompleteDialog(e.entry_id,e.task_id,e.task_name,this._features.checklists?i?.checklist:void 0,this._features.adaptive&&!!i?.adaptive_config?.enabled)}_renderObjectDetail(){if(!this._selectedEntryId)return p;let e=this._getObject(this._selectedEntryId);if(!e)return o`<p>Object not found.</p>`;let t=e.object,i=this._lang,a=this._isOperator,l=e.tasks.filter(h=>h.archived).length,c=e.tasks.filter(h=>this._showArchived||!h.archived);return o`
      <div class="detail-section">
        <div class="detail-header">
          <h2>${t.name}</h2>
          <div class="action-buttons">
            ${a?p:o`
              <ha-button appearance="plain" @click=${()=>{this.shadowRoot.querySelector("maintenance-object-dialog")?.openEdit(e.entry_id,t)}}>${s("edit",i)}</ha-button>
              <ha-button appearance="filled" @click=${()=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openCreate(e.entry_id)}}>${s("add_task",i)}</ha-button>
              <ha-button appearance="plain" .disabled=${this._actionLoading} @click=${()=>this._duplicateObject(e.entry_id)}>
                <ha-icon icon="mdi:content-copy"></ha-icon> ${s("duplicate",i)}
              </ha-button>
              <ha-button appearance="plain" @click=${()=>this._toggleArchiveObject(e.entry_id,!!t.archived)}>
                <ha-icon icon="${t.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                ${t.archived?s("unarchive_object",i):s("archive_object",i)}
              </ha-button>
              ${t.archived?p:o`
                <ha-button appearance="plain" @click=${()=>this._togglePauseObject(e.entry_id,!!t.paused)}>
                  <ha-icon icon="${t.paused?"mdi:play-circle-outline":"mdi:pause-circle-outline"}"></ha-icon>
                  ${t.paused?s("resume_object",i):s("pause_object",i)}
                </ha-button>
                <ha-button appearance="plain" .disabled=${this._actionLoading} @click=${()=>this._replaceObject(e.entry_id,t.name)}>
                  <ha-icon icon="mdi:swap-horizontal"></ha-icon> ${s("replace_object",i)}
                </ha-button>
              `}
              <ha-button variant="danger" appearance="plain" @click=${()=>this._deleteObject(e.entry_id)}>${s("delete",i)}</ha-button>
            `}
            <ha-button appearance="plain" @click=${()=>this._openQrForObject(e.entry_id,t.name)}><ha-icon icon="mdi:qrcode"></ha-icon> ${s("qr_code",i)}</ha-button>
            <ha-button appearance="plain" @click=${()=>this._printObjectReport(e.entry_id)}><ha-icon icon="mdi:file-document-outline"></ha-icon> ${s("report_button",i)}</ha-button>
          </div>
        </div>
        ${t.paused?o`<p class="meta paused-meta">
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
              ${s("object_paused_badge",i)}${t.paused_until?o` — ${s("paused_until_label",i)} ${W(t.paused_until,i)}`:p}
            </p>`:p}
        ${t.manufacturer||t.model?o`<p class="meta">${[t.manufacturer,t.model].filter(Boolean).join(" ")}</p>`:p}
        ${t.serial_number?o`<p class="meta">${s("serial_number_label",i)}: ${t.serial_number}</p>`:p}
        ${t.documentation_url&&/^https?:\/\//i.test(t.documentation_url)?o`<p class="meta">${s("documentation_url_label",i)}:
              <a href=${t.documentation_url} target="_blank" rel="noopener noreferrer">${t.documentation_url}</a>
            </p>`:p}
        ${t.installation_date?o`<p class="meta">${s("installed",i)}: ${W(t.installation_date,i)}</p>`:p}
        ${t.warranty_expiry?this._renderWarrantyMeta(t.warranty_expiry,i):p}
        ${t.notes?o`<div class="object-notes">
              <div class="object-notes-label">${s("object_notes_label",i)}</div>
              <div class="object-notes-body">${t.notes}</div>
            </div>`:p}

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
            </div>`:o`<div class="task-table">${[...c].sort((h,u)=>{let g={overdue:0,triggered:1,due_soon:2,ok:3};return(g[h.status]??9)-(g[u.status]??9)||(h.days_until_due??99999)-(u.days_until_due??99999)}).map(h=>o`
              <div class="task-row${h.enabled?"":" task-disabled"}">
                <span class="cell-badges">
                  ${this._statusBadge(!!h.archived,!!h.is_done,h.status)}
                  ${h.enabled?p:o`<span class="badge-disabled">${s("disabled",i)}</span>`}
                  ${h.nfc_tag_id?o`<span class="nfc-badge" title="${s("nfc_linked",i)}"><ha-icon icon="mdi:nfc-variant"></ha-icon></span>`:p}
                  ${h.document_count?o`<span class="doc-badge" title="${h.document_count} ${s("documents",i)}"><ha-icon icon="mdi:paperclip"></ha-icon>${h.document_count}</span>`:p}
                </span>
                <span class="cell task-name" @click=${()=>this._showTask(e.entry_id,h.id)}>${h.name}</span>
                <span class="task-sub${h.responsible_user_id?"":" task-sub-empty"}">${Wt(h,u=>this._userService?.getUserName(u)??null)}</span>
                <span class="cell type">${s(h.type,i)}</span>
                <span class="due-cell" @click=${()=>this._showTask(e.entry_id,h.id)}>
                  <span class="due-text">${Me(h.days_until_due,i)}</span>
                  ${h.trigger_config?Nt(h):p}
                  ${Ft(h,this._miniStatsData,this._lang)}
                </span>
                <span class="row-actions">
                  <mwc-icon-button class="btn-complete" title="${s("complete",i)}" @click=${u=>{u.stopPropagation(),this._openCompleteDialog(e.entry_id,h.id,h.name,this._features.checklists?h.checklist:void 0,this._features.adaptive&&!!h.adaptive_config?.enabled)}}>
                    <ha-icon icon="mdi:check"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button class="btn-skip" title="${s("skip",i)}" .disabled=${this._actionLoading} @click=${u=>{u.stopPropagation(),this._promptSkipTask(e.entry_id,h.id)}}>
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </mwc-icon-button>
                </span>
              </div>
            `)}</div>`}

        <maintenance-documents-section
          .hass=${this.hass}
          .entryId=${e.entry_id}
          .canWrite=${!a}
        ></maintenance-documents-section>

        <maintenance-parts-section
          .hass=${this.hass}
          .entryId=${e.entry_id}
          .parts=${e.parts||[]}
          .canWrite=${!a}
          @parts-changed=${()=>this._loadData()}
        ></maintenance-parts-section>
      </div>
    `}_toggleMoreMenu(){if(this._moreMenuOpen=!this._moreMenuOpen,this._moreMenuOpen){let e=()=>{this._moreMenuOpen=!1,document.removeEventListener("click",e)};setTimeout(()=>document.addEventListener("click",e,{once:!0}),0)}}_closeMoreMenu(){this._moreMenuOpen=!1}get _sparklineCtx(){return{lang:this._lang,detailStatsData:this._detailStatsData,hasStatsService:!!this._statsService,isCounterEntity:e=>this._isCounterEntity(e),rangeDays:this._chartRangeDays,setRangeDays:e=>this._setChartRange(e),hideOutliers:this._hideOutliers,setHideOutliers:e=>this._setHideOutliers(e)}}_toggleSection(e){let t=new Set(this._collapsedSections);t.has(e)?t.delete(e):t.add(e),this._collapsedSections=t;try{localStorage.setItem(V.collapsedSections,JSON.stringify([...t]))}catch{}}_historyCtx(){let e=this._selectedEntryId&&this._selectedTaskId?this._getObject(this._selectedEntryId)?.tasks.find(i=>i.id===this._selectedTaskId):void 0,t=(e?.history||[]).filter(i=>i.reading_value!=null).sort((i,a)=>i.timestamp.localeCompare(a.timestamp));return{lang:this._lang,hass:this.hass,filter:this._historyFilter,search:this._historySearch,currencySymbol:this._budget?.currency_symbol||Ee,setFilter:i=>{this._historyFilter=i},setSearch:i=>{this._historySearch=i},openEdit:i=>this._openHistoryEdit(i),readingUnit:e?.reading_unit??null,readingDelta:i=>{let a=t.findIndex(l=>l.timestamp===i.timestamp);return a<=0?null:i.reading_value-t[a-1].reading_value}}}_taskDetailCtx(){let e=this._selectedEntryId,t=this._selectedTaskId,i=this._getObject(e);return{lang:this._lang,hass:this.hass,entryId:e,taskId:t,objectName:i?.object.name||"",objectDocUrl:i?.object?.documentation_url??null,isOperator:this._isOperator,actionLoading:this._actionLoading,moreMenuOpen:this._moreMenuOpen,activeTab:this._activeTab,features:this._features,currencySymbol:this._budget?.currency_symbol||Ee,collapsedSections:this._collapsedSections,costDurationToggle:this._costDurationToggle,suggestionDismissed:this._dismissedSuggestions.has(`${e}_${t}`),sparkline:this._sparklineCtx,history:this._historyCtx(),getUserName:a=>this._userService?.getUserName(a)??null,setActiveTab:a=>{this._activeTab=a},toggleSection:a=>this._toggleSection(a),setCostDurationToggle:a=>{this._costDurationToggle=a},showTaskView:()=>{this._view="task"},showObject:()=>this._showObject(e),toggleMoreMenu:()=>this._toggleMoreMenu(),closeMoreMenu:()=>this._closeMoreMenu(),openEdit:a=>{this.shadowRoot.querySelector("maintenance-task-dialog")?.openEdit(e,a)},openComplete:a=>this._openCompleteDialog(e,t,a.name,this._features.checklists?a.checklist:void 0,this._features.adaptive&&!!a.adaptive_config?.enabled),promptSkip:()=>this._promptSkipTask(e,t),toggleArchive:a=>this._toggleArchiveTask(e,t,a),openQr:a=>this._openQrForTask(e,t,i?.object.name||"",a),duplicateTask:()=>this._duplicateTask(e,t),promptReset:()=>this._promptResetTask(e,t),promptPostpone:()=>this._promptPostponeTask(e,t),snoozeTask:()=>this._snoozeTask(e,t),printWorksheet:()=>this._printTaskWorksheet(e,t),deleteTask:()=>this._deleteTask(e,t),applySuggestion:a=>this._applySuggestion(e,t,a),reanalyze:()=>this._reanalyzeInterval(e,t),dismissSuggestion:()=>this._dismissSuggestion(e,t),openSeasonalOverrides:a=>this._openSeasonalOverrides(a)}}_renderTaskDetail(){if(!this._selectedEntryId||!this._selectedTaskId)return p;let e=this._getTask(this._selectedEntryId,this._selectedTaskId);return e?o`<maintenance-task-detail-view
      .task=${e}
      .ctx=${this._taskDetailCtx()}
    ></maintenance-task-detail-view>`:o`<p>Task not found.</p>`}_openHistoryEdit(e){if(!this._selectedEntryId||!this._selectedTaskId)return;let t={entry_id:this._selectedEntryId,task_id:this._selectedTaskId,original_timestamp:e.timestamp,type:e.type,timestamp:e.timestamp,notes:e.notes??null,cost:e.cost??null,duration:e.duration??null,completed_by:e.completed_by??null};this.shadowRoot?.querySelector("maintenance-history-edit-dialog")?.openEdit(t)}};T.styles=[pt,mi],d([y({attribute:!1})],T.prototype,"hass",2),d([y({type:Boolean,reflect:!0})],T.prototype,"narrow",2),d([y({attribute:!1})],T.prototype,"panel",2),d([_()],T.prototype,"_objects",2),d([_()],T.prototype,"_stats",2),d([_()],T.prototype,"_view",2),d([_()],T.prototype,"_selectedEntryId",2),d([_()],T.prototype,"_selectedTaskId",2),d([_()],T.prototype,"_filterStatus",2),d([_()],T.prototype,"_filterUser",2),d([_()],T.prototype,"_unsub",2),d([_()],T.prototype,"_chartRangeDays",2),d([_()],T.prototype,"_hideOutliers",2),d([_()],T.prototype,"_historyFilter",2),d([_()],T.prototype,"_budget",2),d([_()],T.prototype,"_groups",2),d([_()],T.prototype,"_detailStatsData",2),d([_()],T.prototype,"_miniStatsData",2),d([_()],T.prototype,"_features",2),d([_()],T.prototype,"_adminPanelUserIds",2),d([_()],T.prototype,"_operatorWriteEnabled",2),d([_()],T.prototype,"_defaultWarningDays",2),d([_()],T.prototype,"_actionLoading",2),d([_()],T.prototype,"_moreMenuOpen",2),d([_()],T.prototype,"_toastMessage",2),d([_()],T.prototype,"_toastUndo",2),d([_()],T.prototype,"_overviewTab",2),d([_()],T.prototype,"_activeTab",2),d([_()],T.prototype,"_costDurationToggle",2),d([_()],T.prototype,"_historySearch",2),d([_()],T.prototype,"_sortMode",2),d([_()],T.prototype,"_objectSortMode",2),d([_()],T.prototype,"_groupByMode",2),d([_()],T.prototype,"_objectViewMode",2),d([_()],T.prototype,"_objectsTableColumns",2),d([_()],T.prototype,"_showArchived",2),d([_()],T.prototype,"_bulkMode",2),d([_()],T.prototype,"_bulkSelected",2),d([_()],T.prototype,"_virtStart",2),d([_()],T.prototype,"_virtEnd",2),d([_()],T.prototype,"_collapsedSections",2),d([_()],T.prototype,"_paletteOpen",2),d([_()],T.prototype,"_paletteQuery",2),d([_()],T.prototype,"_paletteActive",2),d([_()],T.prototype,"_templateGalleryOpen",2),d([_()],T.prototype,"_templates",2),d([_()],T.prototype,"_templateCategories",2),d([_()],T.prototype,"_templateBusy",2),T=d([ci("maintenance-supporter-panel")],T);export{T as MaintenanceSupporterPanel};
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
