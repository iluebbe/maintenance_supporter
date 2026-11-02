/*! maintenance_supporter frontend 2.117.0 */
var dn=Object.defineProperty;var Zl=Object.getOwnPropertyDescriptor;var x=(i,s,e)=>()=>{if(e)throw e[0];try{return i&&(s=i(i=0)),s}catch(t){throw e=[t],t}};var Jl=(i,s)=>{for(var e in s)dn(i,e,{get:s[e],enumerable:!0})};var d=(i,s,e,t)=>{for(var r=t>1?void 0:t?Zl(s,e):s,o=i.length-1,a;o>=0;o--)(a=i[o])&&(r=(t?a(s,e,r):a(r))||r);return t&&r&&dn(s,e,r),r};var Ti,Si,Rr,pn,Vt,un,$,hn,Pr,Or=x(()=>{Ti=globalThis,Si=Ti.ShadowRoot&&(Ti.ShadyCSS===void 0||Ti.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Rr=Symbol(),pn=new WeakMap,Vt=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==Rr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(Si&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=pn.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&pn.set(e,s))}return s}toString(){return this.cssText}},un=i=>new Vt(typeof i=="string"?i:i+"",void 0,Rr),$=(i,...s)=>{let e=i.length===1?i[0]:s.reduce((t,r,o)=>t+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new Vt(e,i,Rr)},hn=(i,s)=>{if(Si)i.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),r=Ti.litNonce;r!==void 0&&t.setAttribute("nonce",r),t.textContent=e.cssText,i.appendChild(t)}},Pr=Si?i=>i:i=>i instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return un(e)})(i):i});var Xl,ec,tc,ic,rc,sc,Ci,_n,nc,oc,Gt,Kt,Ai,mn,we,Yt=x(()=>{Or();Or();({is:Xl,defineProperty:ec,getOwnPropertyDescriptor:tc,getOwnPropertyNames:ic,getOwnPropertySymbols:rc,getPrototypeOf:sc}=Object),Ci=globalThis,_n=Ci.trustedTypes,nc=_n?_n.emptyScript:"",oc=Ci.reactiveElementPolyfillSupport,Gt=(i,s)=>i,Kt={toAttribute(i,s){switch(s){case Boolean:i=i?nc:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,s){let e=i;switch(s){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ai=(i,s)=>!Xl(i,s),mn={attribute:!0,type:String,converter:Kt,reflect:!1,useDefault:!1,hasChanged:Ai};Symbol.metadata??=Symbol("metadata"),Ci.litPropertyMetadata??=new WeakMap;we=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=mn){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),r=this.getPropertyDescriptor(s,t,e);r!==void 0&&ec(this.prototype,s,r)}}static getPropertyDescriptor(s,e,t){let{get:r,set:o}=tc(this.prototype,s)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){let c=r?.call(this);o?.call(this,a),this.requestUpdate(s,c,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??mn}static _$Ei(){if(this.hasOwnProperty(Gt("elementProperties")))return;let s=sc(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(Gt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Gt("properties"))){let e=this.properties,t=[...ic(e),...rc(e)];for(let r of t)this.createProperty(r,e[r])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let r=this._$Eu(e,t);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let r of t)e.unshift(Pr(r))}else s!==void 0&&e.push(Pr(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return hn(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),r=this.constructor._$Eu(s,t);if(r!==void 0&&t.reflect===!0){let o=(t.converter?.toAttribute!==void 0?t.converter:Kt).toAttribute(e,t.type);this._$Em=s,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(s,e){let t=this.constructor,r=t._$Eh.get(s);if(r!==void 0&&this._$Em!==r){let o=t.getPropertyOptions(r),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:Kt;this._$Em=r;let c=a.fromAttribute(e,o.type);this[r]=c??this._$Ej?.get(r)??c,this._$Em=null}}requestUpdate(s,e,t,r=!1,o){if(s!==void 0){let a=this.constructor;if(r===!1&&(o=this[s]),t??=a.getPropertyOptions(s),!((t.hasChanged??Ai)(o,e)||t.useDefault&&t.reflect&&o===this._$Ej?.get(s)&&!this.hasAttribute(a._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:r,wrapped:o},a){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,a??e??this[s]),o!==!0||a!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),r===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[r,o]of t){let{wrapped:a}=o,c=this[r];a!==!0||this._$AL.has(r)||c===void 0||this.C(r,void 0,o,c)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};we.elementStyles=[],we.shadowRootOptions={mode:"open"},we[Gt("elementProperties")]=new Map,we[Gt("finalized")]=new Map,oc?.({ReactiveElement:we}),(Ci.reactiveElementVersions??=[]).push("2.1.2")});function En(i,s){if(!Mr(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return fn!==void 0?fn.createHTML(s):s}function et(i,s,e=i,t){if(s===re)return s;let r=t!==void 0?e._$Co?.[t]:e._$Cl,o=Jt(s)?void 0:s._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,t)),t!==void 0?(e._$Co??=[])[t]=r:e._$Cl=r),r!==void 0&&(s=et(i,r._$AS(i,s.values),r,t)),s}var jr,gn,Ii,fn,Dr,ke,qr,ac,Xe,Zt,Jt,Mr,kn,Nr,Qt,vn,bn,Ze,yn,xn,$n,Hr,l,_t,Up,re,p,wn,Je,Tn,Xt,Ri,ht,tt,Pi,Oi,Ni,ji,Sn,lc,Cn,it=x(()=>{jr=globalThis,gn=i=>i,Ii=jr.trustedTypes,fn=Ii?Ii.createPolicy("lit-html",{createHTML:i=>i}):void 0,Dr="$lit$",ke=`lit$${Math.random().toFixed(9).slice(2)}$`,qr="?"+ke,ac=`<${qr}>`,Xe=document,Zt=()=>Xe.createComment(""),Jt=i=>i===null||typeof i!="object"&&typeof i!="function",Mr=Array.isArray,kn=i=>Mr(i)||typeof i?.[Symbol.iterator]=="function",Nr=`[ 	
\f\r]`,Qt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,vn=/-->/g,bn=/>/g,Ze=RegExp(`>|${Nr}(?:([^\\s"'>=/]+)(${Nr}*=${Nr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),yn=/'/g,xn=/"/g,$n=/^(?:script|style|textarea|title)$/i,Hr=i=>(s,...e)=>({_$litType$:i,strings:s,values:e}),l=Hr(1),_t=Hr(2),Up=Hr(3),re=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),wn=new WeakMap,Je=Xe.createTreeWalker(Xe,129);Tn=(i,s)=>{let e=i.length-1,t=[],r,o=s===2?"<svg>":s===3?"<math>":"",a=Qt;for(let c=0;c<e;c++){let u=i[c],_,m,f=-1,v=0;for(;v<u.length&&(a.lastIndex=v,m=a.exec(u),m!==null);)v=a.lastIndex,a===Qt?m[1]==="!--"?a=vn:m[1]!==void 0?a=bn:m[2]!==void 0?($n.test(m[2])&&(r=RegExp("</"+m[2],"g")),a=Ze):m[3]!==void 0&&(a=Ze):a===Ze?m[0]===">"?(a=r??Qt,f=-1):m[1]===void 0?f=-2:(f=a.lastIndex-m[2].length,_=m[1],a=m[3]===void 0?Ze:m[3]==='"'?xn:yn):a===xn||a===yn?a=Ze:a===vn||a===bn?a=Qt:(a=Ze,r=void 0);let w=a===Ze&&i[c+1].startsWith("/>")?" ":"";o+=a===Qt?u+ac:f>=0?(t.push(_),u.slice(0,f)+Dr+u.slice(f)+ke+w):u+ke+(f===-2?c:w)}return[En(i,o+(i[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},Xt=class i{constructor({strings:s,_$litType$:e},t){let r;this.parts=[];let o=0,a=0,c=s.length-1,u=this.parts,[_,m]=Tn(s,e);if(this.el=i.createElement(_,t),Je.currentNode=this.el.content,e===2||e===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(r=Je.nextNode())!==null&&u.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(let f of r.getAttributeNames())if(f.endsWith(Dr)){let v=m[a++],w=r.getAttribute(f).split(ke),A=/([.?@])?(.*)/.exec(v);u.push({type:1,index:o,name:A[2],strings:w,ctor:A[1]==="."?Pi:A[1]==="?"?Oi:A[1]==="@"?Ni:tt}),r.removeAttribute(f)}else f.startsWith(ke)&&(u.push({type:6,index:o}),r.removeAttribute(f));if($n.test(r.tagName)){let f=r.textContent.split(ke),v=f.length-1;if(v>0){r.textContent=Ii?Ii.emptyScript:"";for(let w=0;w<v;w++)r.append(f[w],Zt()),Je.nextNode(),u.push({type:2,index:++o});r.append(f[v],Zt())}}}else if(r.nodeType===8)if(r.data===qr)u.push({type:2,index:o});else{let f=-1;for(;(f=r.data.indexOf(ke,f+1))!==-1;)u.push({type:7,index:o}),f+=ke.length-1}o++}}static createElement(s,e){let t=Xe.createElement("template");return t.innerHTML=s,t}};Ri=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,r=(s?.creationScope??Xe).importNode(e,!0);Je.currentNode=r;let o=Je.nextNode(),a=0,c=0,u=t[0];for(;u!==void 0;){if(a===u.index){let _;u.type===2?_=new ht(o,o.nextSibling,this,s):u.type===1?_=new u.ctor(o,u.name,u.strings,this,s):u.type===6&&(_=new ji(o,this,s)),this._$AV.push(_),u=t[++c]}a!==u?.index&&(o=Je.nextNode(),a++)}return Je.currentNode=Xe,r}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},ht=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,r){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=et(this,s,e),Jt(s)?s===p||s==null||s===""?(this._$AH!==p&&this._$AR(),this._$AH=p):s!==this._$AH&&s!==re&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):kn(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==p&&Jt(this._$AH)?this._$AA.nextSibling.data=s:this.T(Xe.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,r=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=Xt.createElement(En(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new Ri(r,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(s){let e=wn.get(s.strings);return e===void 0&&wn.set(s.strings,e=new Xt(s)),e}k(s){Mr(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,r=0;for(let o of s)r===e.length?e.push(t=new i(this.O(Zt()),this.O(Zt()),this,this.options)):t=e[r],t._$AI(o),r++;r<e.length&&(this._$AR(t&&t._$AB.nextSibling,r),e.length=r)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=gn(s).nextSibling;gn(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},tt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,r,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=s,this.name=e,this._$AM=r,this.options=o,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(s,e=this,t,r){let o=this.strings,a=!1;if(o===void 0)s=et(this,s,e,0),a=!Jt(s)||s!==this._$AH&&s!==re,a&&(this._$AH=s);else{let c=s,u,_;for(s=o[0],u=0;u<o.length-1;u++)_=et(this,c[t+u],e,u),_===re&&(_=this._$AH[u]),a||=!Jt(_)||_!==this._$AH[u],_===p?s=p:s!==p&&(s+=(_??"")+o[u+1]),this._$AH[u]=_}a&&!r&&this.j(s)}j(s){s===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},Pi=class extends tt{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===p?void 0:s}},Oi=class extends tt{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==p)}},Ni=class extends tt{constructor(s,e,t,r,o){super(s,e,t,r,o),this.type=5}_$AI(s,e=this){if((s=et(this,s,e,0)??p)===re)return;let t=this._$AH,r=s===p&&t!==p||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,o=s!==p&&(t===p||r);r&&this.element.removeEventListener(this.name,this,t),o&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},ji=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){et(this,s)}},Sn={M:Dr,P:ke,A:qr,C:1,L:Tn,R:Ri,D:kn,V:et,I:ht,H:tt,N:Oi,U:Ni,B:Pi,F:ji},lc=jr.litHtmlPolyfillSupport;lc?.(Xt,ht),(jr.litHtmlVersions??=[]).push("3.3.2");Cn=(i,s,e)=>{let t=e?.renderBefore??s,r=t._$litPart$;if(r===void 0){let o=e?.renderBefore??null;t._$litPart$=r=new ht(s.insertBefore(Zt(),o),o,void 0,e??{})}return r._$AI(i),r}});var Lr,T,cc,An=x(()=>{Yt();Yt();it();it();Lr=globalThis,T=class extends we{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=Cn(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return re}};T._$litElement$=!0,T.finalized=!0,Lr.litElementHydrateSupport?.({LitElement:T});cc=Lr.litElementPolyfillSupport;cc?.({LitElement:T});(Lr.litElementVersions??=[]).push("4.2.2")});var In=x(()=>{});var I=x(()=>{Yt();it();An();In()});var Nn,On=x(()=>{Nn={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",trigger_removed:"Trigger removed",ok:"OK",all:"All",new_object:"+ New Object",templates_from:"From template",templates_title:"Start from a template",templates_task_count:"{n} tasks",templates_task_count_one:"1 task",template_created:"Created from template",onboard_hint:"Add your first object to start tracking maintenance.",edit:"Edit",duplicate:"Duplicate",task_duplicated:"Task duplicated",task_moved:"Task moved",move_task_target:"Target object",move_task_message:"Choose the object this task should belong to. Its history, readings and trigger state move with it; it gets a new reference number and its entities are recreated under the new object. Linked documents stay with the current object.",bulk_move_message:"Choose the object the selected tasks should belong to. Tasks that already live there are skipped; history, readings and trigger state move along.",bulk_moved:"{n} tasks moved",more_actions:"More actions",back:"Back",quantity:"Quantity",spare_part:"Spare part",move_task_title:"Move task",move_task:"Move to another object\u2026",object_duplicated:"Object duplicated",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",missed:"Missed",reset:"Reset",snooze:"Snooze",snoozed:"Snoozed",snoozed_for:"Reminders muted for {hours} hours \u2014 until {until}",snoozed_for_one:"Reminders muted for one hour \u2014 until {until}",cancel:"Cancel",bulk_select:"Select",bulk_select_all:"Select all",bulk_n_selected:"{n} selected",bulk_completed:"{n} tasks completed",bulk_archived:"{n} tasks archived",bulk_delete_objects_confirm:"Delete {n} objects and all their tasks? Archiving keeps their history instead.",bulk_objects_deleted:"{n} objects deleted",bulk_objects_archived:"{n} objects archived",bulk_assign:"Assign",bulk_assign_one:"One person",bulk_assign_share:"Several people, each of them",bulk_assign_rotate:"Several people, in turns",bulk_assign_hint:"Replaces who is assigned to the selected tasks \u2014 a rotation included.",bulk_rotation_min_two:"Pick at least two people.",bulk_labels_add:"Add labels",bulk_labels_remove:"Remove labels",bulk_edit_hint:"Only the ticked settings change; everything else stays as it is.",bulk_no_notifications:"No notifications for these tasks",bulk_updated:"{n} tasks updated",bulk_paused:"{n} tasks paused",bulk_resumed:"{n} tasks resumed",bulk_objects_area:"Area set for {n} objects",bulk_failed:"{n} failed: {reason}",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",last_done_days_ago:"done {n} d ago",last_done_today:"done today",no_due_date:"No due date",next_due:"Next due",kpi_reported_by_sensor:"Reported by the sensor",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",trigger_type_due_date:"Date from a sensor",runtime_hours:"Target runtime (hours)",days_before:"Days before the date",days_before_help:`For a sensor that reports when the maintenance is due (a date or timestamp). 0 = on the date itself. The device's own "done" button moves the date forward, which clears the trigger \u2014 make it the completion action.`,target_value:"Target value",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",calendar:"Calendar entity",calendar_entity_label:"Calendar",calendar_entity_hint:"Due once per event of this calendar, on the event's start date \u2014 the next event after the last completion.",calendar_entity_required:"Choose a calendar entity.",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",recurrence_last_day:"Last day of the month",recurrence_business_day:"Business days only (roll back from weekend)",recurrence_offset:"Offset (days, \xB1)",recurrence_offset_help:"Shift the date by \xB1N days, e.g. -2 = two days before.",recurrence_months_label:"Only in these months",recurrence_months_hint:"The date repeats in the selected months only; pick one month for a yearly task. None = every month.",last_day_month:"Last day of month",last_business_day_month:"Last business day",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",reading:"Reading",custom:"Custom",history:"History",cost:"Cost",cost_kind_credit:"Credit",cost_credit_hint:"Money back \u2014 a sale, a refund. It lowers the totals; the average per completion leaves it out.",report_button:"Report",report_title:"Maintenance report",report_generated:"Generated",report_times_done:"Done",report_total_cost:"Total cost",report_notes:"Notes",report_col_type:"Type",report_col_status:"Status",report_col_schedule:"Schedule",duration:"Duration",minutes_short:"min",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",require_on_completion:"Require on completion",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",ws_err_not_found:"Not found \u2014 it may have been deleted meanwhile",ws_err_invalid_input:"Invalid input",ws_err_invalid_date:"Invalid date",ws_err_invalid_format:"Invalid format",ws_err_invalid_url:"Invalid link",ws_err_invalid_mirror_todo:"Invalid to-do list",ws_err_not_configured:"Not set up yet",ws_err_not_loaded:"Not loaded yet \u2014 try again in a moment",ws_err_limit_reached:"Limit reached",ws_err_too_many:"Too many entries",ws_err_too_large:"Too large",ws_err_not_archived:"Not archived",ws_err_invalid_target:"Invalid target",ws_err_create_failed:"Could not be created",ws_err_archived:"Archived \u2014 restore it first",ws_err_already_archived:"Already archived",ws_err_unavailable:"Currently unavailable",ws_err_unauthorized:"Not permitted for your user",ws_err_too_many_views:"Too many saved views",ws_err_replace_failed:"Replacement failed",ws_err_not_paused:"Not paused",ws_err_not_available:"Nothing available",ws_err_no_url:"No link given",ws_err_no_phases:"This task has no phases",ws_err_invalid_view:"Invalid view",ws_err_invalid_user:"Unknown user",ws_err_invalid_range:"Invalid range",ws_err_invalid_parent:"Invalid parent object",ws_err_invalid_device:"Unknown device",ws_err_empty_csv:"The CSV file is empty",ws_err_empty:"Nothing to import",ws_err_duplicate_failed:"Could not duplicate",ws_err_already_paused:"Already paused",ws_err_invalid_cursor:"Invalid phase position",ws_err_invalid_entity_slug:"Invalid entity name",ws_err_invalid_trigger_config:"Invalid trigger configuration",ws_err_no_defaults:"No quick-complete defaults set",ws_err_self_link_device:"An object cannot be linked to itself",ws_err_too_early:"Too early \u2014 this task can only be completed closer to its due date",ws_err_invalid_search_template:"The search link must be an http(s) URL containing {q}",ws_err_invalid_notify_service:"Invalid notification service format. Use 'notify.service_name' (e.g., notify.mobile_app_phone).",ws_err_notify_service_not_found:"This notification service was not found in Home Assistant. Please verify the service name.",ws_err_invalid_shopping_list_entity:"The shopping list must be a to-do entity (todo.\u2026).",ws_err_invalid_icon:"The notification icon must be an mdi: name, e.g. mdi:air-filter",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_toggle:"Due at a specific time",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",notes_markdown_hint:"Markdown is supported \u2014 **bold**, lists, [links](\u2026)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",completed_at_optional:"Completed at (optional, empty = now)",completed_at_pick:"Set date & time",completed_at_future_error:"The completion date cannot be in the future.",ha_time_zone_hint:"Time in Home Assistant's time zone ({zone})",days:"days",days_few:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",task_series_position:"{n} of {total}",task_series_skip:"Skip",task_series_save_next:"Save & next",task_section_schedule:"Schedule",task_section_trigger:"Sensor trigger",task_section_completion:"Completing it",task_section_people:"People",task_section_notifications:"Notifications",task_section_details:"Details",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",priority:"Priority",labels:"Labels",labels_placeholder:"e.g. safety, seasonal, tenant-visible",labels_help:"Comma-separated tags for filtering and reporting.",task_mirror_todo:"Mirror into to-do lists",task_mirror_todo_hint:"The task appears in these lists while it is due; checking it off there completes it here.",task_mirror_todo_default:"Default lists: {lists}",task_mirror_todo_own:"Other lists",task_mirror_todo_none:"Not on any to-do list",task_mirror_todo_max:"At most {max} lists; Maintenance Supporter's own lists are not offered.",priority_low:"Low",priority_normal:"Normal",priority_high:"High",all_priorities:"All priorities",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",earliest_completion_days:"Earliest completion (days before due)",earliest_completion_days_help:"Leave empty to allow completing any time. 0 = only on/after the due date.",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",interval_anchor_hint:"From completion date: the next due date counts from the day the task is marked done, so doing it early or late moves the schedule. From planned date: the schedule keeps its dates, for example when a bill is paid weeks before it is due.",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",object_replaces:"Replaces",object_replaced_by:"Replaced by",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",all_parts:"All parts",all_areas:"All areas",areas_filter:"Filter areas\u2026",areas_filter_none:"No area matches the filter.",area_cost_year:"Cost {year}",area_object_count:"{n} objects",area_object_count_one:"1 object",area_range_12m:"Last 12 months",area_range_all:"All time",area_task_filter:"Filter by task\u2026",area_kpi_completions:"Completions",area_kpi_total_time:"Total time",area_cost_per_month:"Cost per month",area_cost_per_year:"Cost per year",area_cost_per_object:"Cost per object",area_cost_share:"Share",area_history_section:"History (all objects)",area_report_print:"Area report (PDF)",area_report_title:"Area report",area_report_period:"Period",area_no_costs:"No costs recorded in this period.",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",trigger_equals:"Trigger when equal to (=)",trigger_not_equals:"Trigger when different from (\u2260)",for_at_least_minutes:"For at least (minutes)",safety_interval:"Safety interval (optional)",trigger_combinator:"Combine trigger and interval",trigger_combinator_any:"Trigger or interval (whichever first)",trigger_combinator_all:"Trigger and interval (both required)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",adaptive_prediction_enabled:"Enable sensor-driven predictions",adaptive_seasonal_enabled:"Enable seasonal awareness",adaptive_max_interval:"Maximum interval (days)",adaptive_min_interval:"Minimum interval (days)",adaptive_ewa_alpha:"Learning rate (alpha)",adaptive_enabled:"Enable adaptive scheduling",adaptive_section_title:"Adaptive Scheduling",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",task_shared_with:"Shared with",task_shared_with_help:"Without a responsible person, the task is meant for each of them: everyone gets its reminders and finds it under My Tasks. With a rotation, they take turns.",task_shared_responsible_wins:"Someone is responsible, so the task is meant for them alone. Clear Responsible User to share it.",rotation_strategy:"Rotation",rotation_none:"No rotation",rotation_round_robin:"Round-robin",rotation_least_completed:"Least completed",rotation_random:"Random",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_every_n_days:"every {n} days",cal_every_day:"every day",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",hide_outliers:"Hide outliers (sensor glitches)",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",clear:"Clear",date_type_toggle:"Type the date",date_type_invalid:"Not a valid date \u2014 try 1978-03-15, a year like 1978, or your own date format",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",sensor_prediction_urgency_one:"Sensor predicts threshold in ~{days} day",sensor_prediction_urgency_few:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",subsave_warning:"Saved, but one setting was rejected: {detail}",qr_print:"Print",qr_download:"Download SVG",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_action_quick_complete:"Quick-complete \u2014 no dialog",qr_quick_complete_off:"Quick complete is off for this task. Turn it on in the task: Completing it \u2192 Quick complete.",qr_quick_records:"Records: {values}",qr_quick_records_nothing:"Records the completion only",qr_print_quick_off:"Quick-complete codes need tasks with quick complete on (task \u2192 Completing it \u2192 Quick complete). None of the chosen objects' tasks has it.",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",strat_this_month:"This Month",strat_later:"Later",strat_week:"Week",strat_fortnight:"Fortnight",strat_month:"Month",strat_year:"Year",strat_other:"Other",strat_status:"Status",strat_empty_title:"No maintenance objects yet",strat_empty_content:"Open the Maintenance panel to add your first object \u2014 pool pump, HVAC filter, vehicle, anything that needs scheduled care.",strat_open_panel:"Open Maintenance panel",strat_add_object:"Add object",strat_not_loaded:"**Maintenance Supporter** is not loaded. Install/enable the integration first.",strat_group_by:"Group views by",strat_group_area:"By area (default)",strat_group_status:"By status (Overdue / Triggered / Due Soon / OK)",strat_group_floor:"By floor (uses HA floors)",strat_group_due_date:"By due date (Overdue / Today / Week / Month / Later)",strat_group_calendar:"Rolling calendar (Week / Fortnight / Month / Year)",strat_editor_help:'The "Overview" view is always first. Empty groups are skipped.',picker_name_calendar:"Maintenance Supporter \u2014 Calendar",picker_name_panel:"Maintenance Supporter \u2014 Panel",picker_name_budget:"Maintenance Supporter \u2014 Budget",picker_name_groups:"Maintenance Supporter \u2014 Groups",picker_name_vacation:"Maintenance Supporter \u2014 Vacation",picker_name_battery_fleet:"Battery Fleet",picker_name_section:"Maintenance Supporter \u2014 Section",picker_name_vacation_status:"Maintenance Supporter \u2014 Vacation Status",picker_name_budget_status:"Maintenance Supporter \u2014 Budget Status",picker_desc_card:"Overview of your maintenance tasks with quick actions.",picker_desc_calendar:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",picker_desc_panel:"The complete Maintenance Supporter panel as a card \u2014 for a panel view / dashboard subview without the sidebar entry.",picker_desc_budget:"Edit the monthly and yearly budget right on the dashboard.",picker_desc_groups:"Create, rename and delete task groups right on the dashboard.",picker_desc_vacation:"Switch vacation mode on or off and set its dates right on the dashboard.",picker_desc_battery_fleet:"All tracked batteries: what is low now, what runs out soon, and what to buy.",picker_desc_dashboard:"Auto-generated dashboard. Group views by area, status, floor, or due date \u2014 picked from the strategy editor or YAML.",picker_desc_section:"Embed maintenance tasks (filterable by area, status, due date) as a section in any dashboard view.",picker_desc_vacation_status:"Compact vacation-mode status banner. Tap to open settings in the panel.",picker_desc_budget_status:"Monthly + yearly maintenance budget overview. Tap for details.",picker_desc_groups_status:"List of configured task groups with member counts.",hist_note_button:"Completed from dashboard button",hist_note_todo:"Completed from the To-do list",hist_note_voice:"Completed by voice",hist_note_notification:"Completed from the notification",hist_note_nfc:"Completed via NFC tag",hist_note_shopping_list:"Completed from the shopping list",hist_note_todo_mirror:"Completed from a mirrored to-do list",hist_note_skipped_notification:"Skipped from notification",hist_note_skipped_button:"Skipped from dashboard button",hist_note_sensor_triggered:"Sensor trigger activated",hist_note_initial:"Initial value set during task creation",hist_note_auto_recovered:"Auto-completed: sensor recovered ({value})",hist_note_auto_entity:"Auto-completed: {entity} changed to {state}",hist_note_auto_recovered_plain:"Auto-completed: sensor recovered",hist_note_reset:"Reset to {date}",hist_note_trigger_replaced:"Trigger entity replaced: {old} \u2192 {new}",hist_note_trigger_removed:"Sensor trigger removed (entity was: {entity}). Schedule converted to {schedule}.",hist_note_compound_removed:"Entity {entity} removed from compound trigger; {count} conditions remain.",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",compound:"Compound (multiple conditions)",compound_logic_and:"AND \u2014 all conditions must trigger",compound_logic_or:"OR \u2014 any condition triggers",compound_help:"Combine several sensor conditions into one trigger.",compound_no_conditions:"No conditions yet \u2014 add at least one.",compound_add_condition:"Add condition",compound_condition:"Condition",compound_remove_condition:"Remove condition",card_title:"Title",card_simple_preset:"Set up as a simple list",card_simple_preset_help:"Compact rows, an open circle to tick off, no create buttons or document chips, the person before the task. Each option stays changeable.",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_show_create:"Show create buttons",card_action_style:"Complete button style",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_areas:"Filter by areas",card_filter_areas_help:"Empty = show all areas.",card_filter_priority_help:"Empty = show all priorities. Tasks without an explicit priority count as Normal.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",place_optional:"Place (zone, optional)",remind_on_site:"Remind only while somebody is there",remind_on_site_hint:"Reminders wait until somebody is in this zone. Whoever arrives there gets a message with what is due.",place_missing:"Zone not found: reminders as at home",place_home:"Home",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_delete_entry:"Delete entry",history_delete_confirm_entry:"Delete this history entry? The task's last-performed date falls back to the previous completion; photos stay with the object.",history_delete_returns_parts:"The parts it used go back to stock: {parts}.",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",notify_icon:"Notification icon",notify_icon_hint:"Shown by the Companion app on Android. Empty = the icon of this task's maintenance type ({default}).",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",tab_today:"Today",palette_placeholder:"Search objects, tasks, spare parts, documents, notes\u2026",palette_no_results:"No matches",palette_hint:"\u2191\u2193 to navigate \xB7 Enter to open \xB7 Esc to close \xB7 / opens the search anywhere",search_open:"Search",search_group_parts:"Spare parts",search_group_content:"In documents",search_group_history:"History notes",search_page:"Page {page}",search_empty_hint:"Type to search objects, tasks, spare parts, documents and notes",search_searching:"Searching documents and notes\u2026",search_index_status:"Full-text search: {indexed} of {total} files indexed \xB7 {no_text} without text layer \xB7 {pending} pending",today_all_caught_up:"All caught up! Nothing due this week.",today_overdue:"Overdue",today_due_today:"Due today",today_this_week:"This week",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_consumable_threshold:"Consumable low threshold (%)",settings_battery_low_percent:"Battery low threshold (%)",settings_battery_recovered_percent:"Battery counts as replaced above (%)",settings_battery_recovered_percent_hint:"A low battery stays counted as low until its level rises above this value or a replacement is recorded \u2014 so a level hovering around the low threshold cannot complete the fleet task again and again.",settings_battery_low_delay:"Battery counts as low after (minutes)",settings_battery_low_delay_hint:"A battery must read low this long before it counts as low, so a sensor that reports a very low level for a moment and recovers by itself does not put it on the list. 0 = at once.",settings_battery_auto_record:"Record a replacement automatically when a low battery recovers",settings_battery_auto_record_hint:"When a battery that was low rises above the recovery threshold, the replacement date is recorded in Battery Notes and the spare cells are taken from stock \u2014 no tap needed.",settings_battery_lifetimes:"Typical battery lifetimes",settings_battery_lifetimes_hint:'Only used for batteries without a percentage: a Battery Notes note that has just a type and a last-replaced date, or a sensor that only reports "low". Their due date is last replaced + this lifetime. Batteries that report a level get their forecast from the measured discharge instead. Once the fleet has seen three replacements of a type, the median interval takes over from the built-in value \u2014 your own value always wins.',settings_battery_lifetime_months:"months",settings_battery_lifetime_reset:"Use default",settings_battery_lifetime_in_fleet:"in your fleet",settings_battery_lifetime_learned_models:"Learned per model: {list}",settings_thresholds_hint:"Defaults for new Suggested setups (percent-remaining consumables) and for fleet batteries without their own Battery Notes threshold. Existing tasks keep their value.",settings_part_search_url:"Shopping search link",settings_part_search_url_hint:"URL with {q} in place of the search terms, used for parts without a product link. Leave empty for the automatic store (by country, then by language).",settings_value_out_of_range:"Value must be between {min} and {max}",bn_summary:"{name}: {pct} % for {n} batteries",bn_floor_decides:"Your {floor} % floor decides for all of them; the higher of the two thresholds counts per battery.",bn_above_floor:"That is above your {floor} % floor, so {name} decides for all noted batteries.",bn_overrides:"{n} devices with their own threshold:",bn_more:"+ {n} more",settings_row_actions:"Task row actions",settings_ref_numbers_in_lists:"Reference numbers in lists",settings_ref_numbers_in_lists_hint:"Show the #8 / #8.3 chips in front of object and task names in the Today list, the task table, the object cards and the objects table.",settings_compact_refs:"Compact reference numbers",settings_compact_refs_hint:"Renumbers all objects, tasks and completions in order (1, 2, 3 \u2026) and closes the gaps left by deletions. Numbers already printed on service booklets, photos or notes will no longer match.",settings_compact_refs_confirm:"Renumber every object, task and completion sequentially in creation order? Numbers already written on printed service booklets, photos or notes will no longer match. This cannot be undone.",settings_compact_refs_done:"Renumbered {objects} objects, {tasks} tasks and {completions} completions.",row_actions_buttons_compact:"Buttons (icons only on phones)",row_actions_buttons:"Buttons with text",row_actions_icons:"Icons (classic)",row_actions_follow:"Follow the household setting",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",settings_shopping_list:"Shopping list (buy tasks)",settings_shopping_list_help:"Low-part buy reminders appear in this to-do list; checking one off restocks the part.",shopping_list_none:"Off \u2014 no shopping list",settings_mirror_todo_default:"Default to-do lists for tasks",settings_mirror_todo_default_help:"While a task is due, it appears on the lists ticked here, unless the task picks its own lists or none. Checking it off there completes the task. A list that takes a due date gets the task's.",settings_mirror_todo_default_none:"No to-do lists in Home Assistant yet.",settings_install_assist_sentences:"Install Assist sentences",settings_install_assist_sentences_hint:"Copies the voice sentences into your configuration so the classic Assist agent recognises them. A file you edited yourself is never overwritten.",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",notify_per_person:"Per-person delivery",member_avatars:"Member avatars",member_avatars_hint:"Shown next to assigned tasks \u2014 initials in the member's colour. Defaults come from the name; set your own initials or pick a colour to tell members apart.",member_initials:"Initials",member_color:"Colour",member_avatar_reset:"Reset",notify_no_own_device:"No own device \u2014 uses the household service",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_reminder_leads:"Extra reminders (days before due)",settings_reminder_leads_hint:"Comma-separated lead times, e.g. 14, 3, 0 \u2014 one extra reminder fires on each matching day. Empty = off.",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_weekly_digest:"Weekly digest",settings_weekly_digest_hint:"A single summary notification on Monday morning when tasks are due.",settings_warranty_reminder:"Warranty expiry reminder",settings_warranty_reminder_days:"Days before expiry",settings_warranty_reminder_hint:"Notify once when an object's warranty is this many days from expiring.",settings_snooze_hours:"Snooze duration (hours)",settings_snooze_hours_hint:"How long Snooze mutes a task's reminders \u2014 from the task menu, a card, voice or the phone's Snooze button. The due date stays as it is.",settings_budget:"Budget",settings_currency:"Currency",settings_currency_decimals:"Decimal places for amounts",settings_currency_decimals_hint:"How many decimals every amount shows: KPIs, budgets, costs in lists and reports, budget alerts. 0 = whole numbers.",settings_parts_cost_mode:"Spare parts count as spending",settings_parts_cost_purchase:"When bought",settings_parts_cost_use:"When used",settings_parts_cost_mode_hint:"When bought: a buy reminder's cost counts, and the parts a job uses are shown as information. When used: every completion books the value of the parts it used, and a purchase sets the part's price instead of counting. Applies to completions from now on \u2014 history keeps how it was booked.",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_export_settings:"Export settings (JSON)",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_import_unmatched_users:"Not found on this instance: {names}. Their task assignments were removed \u2014 add people with the same names in Home Assistant and import again to keep them.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",settings_export_selection:"Limit to selected objects (optional)",settings_docs_archive:"Documents archive (with files)",settings_docs_archive_hint:"The JSON and YAML exports list your documents but not their files; CSV leaves documents out. This ZIP holds the uploaded files \u2014 restore it after importing the JSON and nothing is missing.",settings_docs_export_btn:"Download documents ZIP",settings_docs_import_btn:"Restore documents ZIP",settings_docs_import_success:"Restored: {blobs} files, {docs} documents",settings_docs_import_missing:"{n} skipped \u2014 their files were not in the ZIP",settings_docs_import_unmatched:"No object here matches {names}: their files were kept but not attached",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",groupby_object:"By object",filter_label:"Filter",user_label:"User",photo_label:"Photo",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",state_latch_help:"With 1 transition the trigger is a latch: it recovers when the entity leaves the To-state \u2014 or, with only a From-state set, when it returns to that state.",for_minutes_state_help:"0 counts every change immediately. Set minutes and the new state must hold that long first \u2014 brief flickers then neither trigger nor count.",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_ended:"Ended",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else only gets Complete, Skip, Reset, Postpone and Snooze.",settings_shared_devices:"Shared devices",settings_shared_devices_desc:"Accounts several people use, like a kitchen tablet. A completion made there is credited to whoever is on duty (the responsible person, on a rotation whose turn it is); the history notes the device.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc_v2:"Per-task HA action on complete.",feat_places:"Places",feat_places_desc:"Objects maintained at another place (a Home Assistant zone): reminders only while somebody is there, and a message on arrival.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_target_more:"This action targets more than this field shows: {targets}. That is kept as it is \u2014 choosing another entity here replaces the whole target.",on_complete_action_skip_auto:"Not when the task completes itself (its sensor recovered)",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",action_test_bad_format:"Invalid service format (expected 'domain.service')",action_test_unknown_service:'Service "{service}" is not registered in Home Assistant. Check the spelling and that the integration providing it is loaded.',action_test_domain_mismatch:`Service "{service}" only works on {domain}.* entities; entity "{entity}" is in {entity_domain}.* \u2014 pick a service that matches the entity's domain (e.g. {suggestion})`,action_test_entity_missing:'Target entity "{entity}" was not found in Home Assistant \u2014 it may have been renamed or its integration removed.',quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",completion_already_recorded:"Already recorded {seconds} s ago, not counted twice",quick_complete_label:"Quick complete",quick_complete_help:"One tap completes it, without a dialog: in the panel and on dashboard cards, with the quick-complete QR code, from a notification, a button, a to-do list or by voice.",quick_complete_values:"Prefill (optional)",quick_complete_values_help:"Entered by every completion without a dialog. The completion dialog starts with them too.",quick_complete_needs_dialog:"Asks on completion for: {fields}. A quick completion opens the dialog for it.",quick_complete_tag_hint:"Needs a tag scan: only the tag or the quick-complete QR code on the thing completes it in one go.",quick_complete_not_asked:"A quick completion does not ask for the checklist or the readings.",complete_with_details:"Complete with details\u2026",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_buy_task_confirm:"This task reminds you to buy a spare part that is running low. Deleted on its own, it comes back as long as the part stays low.",delete_buy_task_off:"Also turn off the buy reminder for this part",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026",archive:"Archive",undo:"Undo",task_completed_named:"Completed: {task}",undo_done:"Completion undone",undo_done_action_ran:"Completion undone. Its completion action had already run and cannot be taken back.",undo_nothing:"Nothing to undo. Only your own last completion can be taken back, within 10 minutes.",undo_changed:"Can't undo. The task has changed since.",task_archived:"Task archived",object_archived:"Object archived",unarchive:"Unarchive",archived:"Archived",show_archived:"Show archived",hide_archived:"Hide archived",section_collapse:"Collapse section",section_expand:"Expand section",confirm_archive_object:"Archive this object and its tasks? They keep their history and can be unarchived later.",settings_archive:"Archive & Retention",settings_archive_desc:"Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",settings_archive_oneoff_days:"Auto-archive completed one-off tasks after (days, 0 = off)",settings_delete_archived_oneoff_days:"Auto-delete archived one-off tasks after (days, 0 = never)",archive_object:"Archive object",unarchive_object:"Unarchive object",documents:"Documents",documents_empty:"No documents yet.",doc_upload:"Upload file",doc_uploading:"Uploading\u2026",doc_add_link:"Add link",doc_link_url:"URL (https://\u2026)",doc_link_title:"Title (optional)",doc_open:"Open",doc_delete_confirm:'Delete "{name}"?',doc_too_large:"File is too large (max 100 MB).",doc_upload_failed:"Upload failed.",docs_archive_too_large:"The archive is too large (max {max}).",docs_archive_no_manifest:"This ZIP has no manifest.json, so the restore cannot tell which document a file belongs to. Keep manifest.json next to the folders when zipping again.",completion_photos_optional:"Completion photos (optional)",completion_photos:"Completion photos",choose_photos:"Choose photos",choose_photo:"Choose photo",photos_android_hint:"The Android app hands over one photo per pick \u2014 each pick is added.",photos_limit:"Up to {max} photos per completion",history_edit_photos_hint:"Removing a photo here keeps the file in the object's documents.",uploading:"Uploading\u2026",remove:"Remove",doc_deduped:"Already stored elsewhere \u2014 shared, no extra space used.",doc_dup_in_object:"This file is already attached to this object.",doc_link_not_allowed:"This link is not allowed: links that run scripts or open local files (javascript:, data:, file: \u2026) are refused.",doc_cat_manual:"Manual",doc_cat_warranty:"Warranty",doc_cat_invoice:"Invoice",doc_cat_spare_parts:"Spare parts",doc_cat_photo:"Photo",doc_cat_other:"Other",doc_link_badge:"Link",doc_storage_title:"Document storage",doc_storage_saved:"Saved via deduplication",doc_storage_refresh:"Refresh",doc_download:"Download",doc_close:"Close",doc_camera:"Take photo",camera_capture_shoot:"Capture",camera_switch_lens:"Switch camera",camera_switching:"Switching camera\u2026",camera_not_answered:"This camera did not answer. Tap the switch again to try the next one, or use the file picker.",camera_diagnostics:"Details for a bug report",camera_copy:"Copy",camera_copied:"Copied",doc_drop_hint:"Drop files here",doc_task_none:"No documents linked to this task.",doc_link_existing:"Link a document\u2026",doc_attach:"Link",doc_unlink:"Unlink",doc_page:"Page",chart_range_7d:"7d",chart_range_30d:"30d",chart_range_90d:"90d",chart_range_1y:"1y",chart_since_service:"since last service",chart_no_stats:"No long-term statistics for this entity \u2014 showing maintenance-event values only",auto_complete_on_recovery:"Auto-complete when the sensor recovers",auto_complete_on_recovery_help:"Records a completion (sets last performed) when the trigger clears itself \u2014 e.g. salt refilled, filter replaced.",trigger_end:"When the state ends",trigger_end_ok:"The task goes back to OK",trigger_end_done:"Record the task as done",trigger_end_hold:"Keep the task triggered until it is done",trigger_end_hold_help:"For a state that lasts only a moment, such as a finished wash: the task stays until it is completed, by hand or by its Done when entity.",trigger_detail_attribute:"Show with the task (optional)",trigger_detail_none:"Nothing",trigger_detail_attribute_help:"While the trigger is active, the value of this attribute shows after the task's name and in its reminder: which medicine is running low, which window is open.",doc_search:"Search documents\u2026",doc_search_none:"No matching documents",doc_description:"Description (optional)",doc_sort:"Sort documents",doc_sort_newest:"Newest first",doc_sort_oldest:"Oldest first",doc_sort_title:"By title (1, 2, 3 \u2026)",doc_sort_category:"By category",link_device_optional:"Link to existing device (optional)",parent_object_optional:"Parent object (optional)",parent_none:"(No parent)",parent_object_hint:"Shown inside the parent in the lists of objects.",sub_objects:"Sub-objects",sub_objects_count:"{n} sub-objects",sub_objects_count_one:"1 sub-object",add_sub_object:"Add sub-object",sub_object_move_here:"Move an existing object here",sub_object_move_message:"The object moves inside {name}, with everything inside it. Its tasks and history stay as they are.",sub_object_move_confirm:"Move here",sub_object_moved:"Moved inside {name}",templates_inside:"The new object goes inside {name}.",sub_objects_show:"Show sub-objects",sub_objects_hide:"Hide sub-objects",paused:"Paused",pause_object:"Pause",resume_object:"Resume",pause_task:"Pause",resume_task:"Resume",pause_task_prompt:"Freeze this task's schedule \u2014 it does not become due and does not notify until you resume it, and resuming starts a fresh cycle from that day. The object's other tasks keep running. Optionally set a date to resume by itself.",task_paused:"Task paused",task_resumed:"Task resumed \u2014 its schedule restarted",pause_until_prompt:"Freeze this object's schedules \u2014 nothing becomes due and nothing notifies until it is resumed. Optionally set an auto-resume date.",pause_until_label:"Resume on (optional)",object_paused:"Object paused",object_resumed:"Object resumed \u2014 schedules restarted",object_paused_badge:"Paused",paused_until_label:"until",replace_object:"Replace\u2026",replace_object_prompt:"Retire this object and create a successor. History and costs stay archived on the old one; tasks and documents carry over to the new one, counters start fresh.",replace_name_label:"Successor name",replace_device_heading:"Device in Home Assistant",replace_device_keep:"Same device as before ({device})",replace_device_keep_hint:"Also the choice when the new unit is not in Home Assistant yet: once it is, pick it as the object's device in its settings \u2014 the sensor triggers move along then.",replace_device_other:"The new unit is another device",replace_device_pick:"Device of the new unit",replace_device_other_hint:"Sensor triggers, completion actions and the counter reset move to the matching entities of that device.",replace_device_none:"No device",object_replaced:"Object replaced \u2014 successor created",device_swap_moved:"{count} sensor links moved to the new device.",device_swap_moved_one:"One sensor link moved to the new device.",device_swap_unmatched:"{count} could not be matched \u2014 check those tasks' sensor triggers.",device_swap_unmatched_one:"One could not be matched \u2014 check that task's sensor trigger.",reading_unit_label:"Reading unit (e.g. kWh, m\xB3)",reading_unit_help:"Shown next to the recorded value when completing this task.",reading_value_label:"Reading value",reading_label:"Reading",readings_section:"Readings",readings_hint:"Several named values per completion \u2014 one row per meter. Leave empty to record a single value.",reading_name_label:"Reading name",reading_unit_short:"Unit",reading_add:"Add reading",reading_duplicate_name:"Name already used",reading_last:"last: {value}",reading_below_last:"Lower than the last reading ({value})",settings_templates_label:"Template gallery",settings_templates_hint:`Untick templates you'll never need \u2014 they disappear from the "From template" pickers (panel and config flow). Nothing else changes; you can re-enable them any time.`,home_profile_title:"Home profile",home_profile_hint:"Recommends templates and sets seasonal windows for your climate and hemisphere. Everything is worked out locally from your floors, areas and home location.",home_type_label:"Home type",home_type_auto:"Automatic ({detected})",home_region_label:"State, province or region",home_region_none:"not found",home_region_hint:"Some rules differ within a country \u2014 a yearly vehicle inspection in one state, none in the next. Found from your home location.",home_dwelling_house:"House",home_dwelling_apartment:"Apartment",home_dwelling_unknown:"not recognised",home_detected_from:"Detected from: {reasons}",home_reason_floors:"several floors",home_reason_basement:"a basement",home_reason_garden:"a garden",home_reason_shed:"a shed",home_reason_driveway:"a driveway",home_reason_garage:"a garage",home_reason_attic:"an attic",home_reason_lawn_mower:"a lawn mower",home_reason_gate:"a gate",home_reason_balcony:"a balcony",home_reason_small_home:"few rooms on one floor",home_reason_ups:"a UPS",home_climate_label:"Climate",home_climate_value:"K\xF6ppen {koppen} \xB7 coldest month {cold} \xB0C \xB7 warmest month {warm} \xB0C",home_climate_unknown:"No home location set in Home Assistant",home_hemisphere_south:"Southern hemisphere \u2014 seasonal windows are mirrored",home_trait_freeze:"Frost in winter",home_trait_snow:"Snowy winters",home_trait_severe_winter:"Severe winters",home_trait_damp:"Damp climate",home_trait_mediterranean:"Mediterranean climate",home_trait_earthquake:"Earthquake region",home_trait_hot_summer:"Hot summers",home_trait_hot_humid:"Hot and humid",home_trait_hot_dry:"Hot and dry",home_trait_termites:"Termite region",home_trait_wildfire:"Wildfire risk",home_trait_cyclone:"Hurricane / typhoon region",home_trait_tropical:"Tropical climate",home_trait_radon:"Radon test recommended",home_reason_starter:"Basics for your home",home_reason_country:"Common in {country}",home_reason_feature:"Found in your home: {feature}",templates_recommended_title:"Recommended for your home",templates_recommended_hint:"Based on your home profile \u2014 adjust it in Settings.",templates_legal_hint:"Notes on legal duties and intervals are guidance, not legal advice. Rules vary by region and change over time \u2014 local regulations and the manufacturer's instructions take precedence.",templates_not_typical:"Not typical for your home type",templates_set_up:"Already set up",worksheet:"Work sheet",worksheet_scan_view:"Scan to open the task",worksheet_scan_complete:"Scan to complete",worksheet_manual_excerpt:"Manual excerpt",worksheet_pages:"pages",worksheet_printed:"Printed",worksheet_never:"Never",card_all_caught_up:"All caught up \u2014 nothing needs attention",postpone:"Postpone",postpone_date_prompt:"Postpone this occurrence to which date?",postpone_date_label:"New due date",postponed:"Postponed",postponed_to:"Postponed to",season_window_label:"Seasonal window (months)",season_window_hint:"Only due in the selected months; off-season dates roll to the next active month. None = all year.",series_end_label:"Ends",series_end_never:"Never (repeats indefinitely)",series_end_after_count:"After a number of times",series_end_until:"On a date",series_end_count_label:"Number of times",series_end_until_label:"End date",parts_section:"Parts & consumables",parts_inventory_value:"Inventory value",part_add:"Add part",part_name:"Name",part_vendor:"Manufacturer",part_storage_location:"Storage location",part_product_url:"Product URL",part_unit:"Unit",part_cost:"Unit price",part_cost_mode:"Counts as spending",part_cost_mode_house:"As in Settings ({mode})",part_cost_mode_hint:"When bought: the purchase counts, in the year it is made. When used: every completion that uses the part books its price on the object, and so the area, where it is used.",part_stock:"Stock",part_reorder_threshold:"Reorder at",part_restock_quantity:"Restock quantity",part_package_size:"Package size (units)",part_restock_packages:"Restock amount (packages)",part_package_hint:"Bought in packages, used in the unit: stock, the amount a task uses and the reorder threshold count units; the restock amount and the price are per package.",part_auto_buy:"Auto-create buy task when low",part_reuse:"After use",part_reuse_none:"Used up",part_reuse_charge:"Charged",part_reuse_sharpen:"Sharpened",part_reuse_clean:"Cleaned",part_reuse_dry:"Dried",part_reuse_refill:"Refilled",part_reuse_restore:"Restored",part_waiting_charge:"{count} to charge",part_waiting_sharpen:"{count} to sharpen",part_waiting_clean:"{count} to clean",part_waiting_dry:"{count} to dry",part_waiting_refill:"{count} to refill",part_waiting_restore:"{count} to restore",part_restoring:"Used, not ready yet",part_ready_again_hint:"All used ones are ready again",part_dispose:"Dispose",part_dispose_hint:"Gone for good, such as a dead cell: off the waiting pile, not back to the stock",part_dispose_how_many:"How many are gone for good",part_use:"Use",part_use_hint:"Used outside a task: off the stock like the parts of a completion",part_use_how_many:"How much was used",part_use_not_booked:"Not booked as spending: this part counts when used, which only a task's completion books.",part_bought:"Bought\u2026",part_bought_hint:"Record a purchase: into the stock, with what was paid and when",part_bought_quantity:"How many",part_bought_packages:"Packages of {size}",part_bought_price_each:"Price each",part_bought_price_package:"Price per package",part_bought_total:"Total",part_bought_date:"Bought on",part_bought_note:"Shop, receipt, \u2026",part_bought_confirm:"Record purchase",part_bought_adds:"Adds {qty} to the stock",part_bought_on_use:"Stock, not spending: this part counts when used, and its price becomes the average of what is on the shelf.",part_reuse_hint:"A used one is not gone: it waits until it is ready again and still counts as owned, so it is not bought again.",part_restock:"Adjust stock",parts_used_by:"Used by",restock_quantity_label:"Quantity bought",consumes_parts_label:"Consumes parts",task_parts_fleet_hint:"Battery quantities come from Battery Notes per device \u2014 nothing to link here.",shared_parts_other_objects:"Parts from other objects",shared_parts_help:"Several objects can share one stock. Completing this task takes from the owning object.",shared_part_unknown:"Unknown part",parts_load_failed:"Couldn't load this object's parts \u2014 the consumes-parts options are unavailable right now.",adopt_problem_button:"Adopt problem sensors",adopt_problem_title:"Adopt problem sensors",adopt_problem_hint:"Turn HA problem sensors (printer errors, filter warnings, low battery) into maintenance tasks that trigger while the problem is active and clear themselves when it resolves.",adopt_problem_none:"No problem sensors found that aren't already tracked.",adopt_problem_active:"active",adopt_problem_ok:"ok",adopt_problem_new_object:"(new)",adopt_object_hint:"Give several sensors the same object name and they become one object; type an existing object's name to add them there.",adopt_summary_title:"What adopting changes",adopt_summary_existing:'"{name}": tasks {before} \u2192 {after}',adopt_summary_totals:"Tasks: {tasks} \xB7 objects: {objects}",adopt_summary_totals_new:"Tasks: {tasks} \xB7 objects: {objects} ({new} new)",adopt_problem_adopt:"Adopt selected",adopt_problem_done:"Adopted {tasks} problem sensor(s)",adopt_problem_done_one:"Adopted 1 problem sensor",views_label:"Views",views_none:"\u2014 No view \u2014",views_manage:"Save / manage views",views_dialog_title:"Saved views",views_dialog_hint:"Save the current filters as a named view everyone can reuse.",views_name_placeholder:"View name",views_save_current:"Save current filters",views_none_yet:"No saved views yet.",close:"Close",trigger_hint_now:"The sensor reads {value} right now.",trigger_hint_above:"The task triggers once it rises above {target}.",trigger_hint_below:"It triggers once it falls below {target}.",trigger_hint_equals:"It triggers when it reads exactly {target}.",trigger_hint_not_equals:"It triggers when it reads anything but {target}.",trigger_hint_overlap:"These limits overlap: every reading triggers the task and it can never recover. Leave one of them empty.",trigger_hint_counter_delta:"Counts from the current reading ({value}): due at {due} (+{target}), and the count restarts after each completion.",trigger_hint_counter_delta_edit:"Counts usage since the last completion: due after +{target}; the count restarts after each completion.",trigger_hint_counter_abs:"The task becomes due once the sensor reaches {target}.",trigger_hint_runtime:"The task becomes due after {hours} h of accumulated on-time; the counter restarts after each completion.",trigger_hint_due_date:"The task becomes due {days} days before the date the sensor reports.",trigger_hint_due_date_one:"The task becomes due one day before the date the sensor reports.",trigger_hint_due_date_same_day:"The task becomes due on the date the sensor reports.",trigger_hint_due_date_now:"Reported date: {date}.",trigger_hint_state_change:"The task becomes due after {count} state change(s).",trigger_hint_state_change_to:"The task becomes due after {count} change(s) to \u201C{state}\u201D.",trigger_hint_state_now:"Current state: {value}.",adopt_problem_part:"Uses part: {name}",label_filter:"Label",all_labels:"All labels",filter_place:"Place",filter_place_all:"All places",settings_notify_scope:"Notify only for view",settings_notify_scope_all:"All tasks",settings_notify_scope_hint:"Only tasks matching the selected saved view's label/user filters send reminders. Status, sorting and grouping of the view are ignored here.",settings_notify_completed:"Completion notifications",settings_notify_completed_hint:`Household news when a task is completed, with the reason and who did it. "Automatic only" announces just the completions nobody made on the spot: sensor recovery, shopping-list check-off, an automation's service call. Sent to the household service only; quiet hours and the daily cap apply.`,settings_title_style:"Notification title style",settings_title_style_hint:"What appears as the notification's TITLE. Default keeps the per-status text (e.g. 'Maintenance overdue!'). Object name / Task name help when phone notifications stack.",title_style_default:"Default (per-status title)",title_style_object_name:"Object name as title",title_style_task_name:"Task name as title",notify_completed_off:"Off",notify_completed_automatic:"Automatic completions only",notify_completed_all:"All completions",settings_notify_rule:"Your own notification rule",settings_notify_rule_hint:"Every notification also fires the event maintenance_supporter_notification (kind, status, object, task, reference numbers, priority, deep link, the payload). Route it with an automation \u2014 e.g. into Ticker, Telegram or Pushover.",settings_notify_event_only:"Only fire the event, send nothing myself",settings_notify_event_only_hint:"Your automation is the whole delivery. Rate limits, quiet hours and the daily cap still apply to when the event fires.",settings_notify_extra_data:"Extra notification data (template)",settings_notify_extra_data_hint:"JSON or YAML, Jinja allowed; merged into the notify call's data (your keys win). Variables: kind, status, priority, labels, notes, area_name, object_name, task_name, object_ref, task_ref, days_until_due, next_due, last_performed, responsible_user_id, sensor_entity_id, url, target, title, message. Test it with the Send test button.",card_saved_view:"Saved view",card_saved_view_none:"None",card_saved_view_help:"Applies the view's status, user, label and priority filters on top of the filters above. The view's sorting and grouping are panel display settings and are not applied on the card.",panel_card_tab:"Open on tab",panel_card_tab_default:"Remembered tab (as in the panel)",panel_card_view:"Open with saved view",panel_card_height:"Height",panel_card_height_help:"Empty = fill the screen below the card (panel view). Otherwise a CSS length such as 600px or 80vh for views with other cards.",panel_card_not_registered:"The Maintenance Supporter panel is not available \u2014 is the integration set up?",panel_card_load_failed:"The Maintenance Supporter panel could not be loaded \u2014 reload the page (after an update: clear the browser cache).",doc_part_none:"No documents linked to this part.",settings_templates_toggle_group:"Enable or disable all templates in this group",setups_button:"Suggested setups",setups_title:"Suggested setups (Beta)",setups_hint:"Devices of supported integrations whose consumable sensors can drive maintenance tasks. Adopting creates the object and wires each task to its sensor \u2014 it triggers when the consumable runs low and resolves itself after replacement.",setups_none:"No supported devices with unwired consumable sensors found.",setups_adopt:"Set up selected",setups_done:"{tasks} sensor-wired tasks created.",setups_done_one:"1 sensor-wired task created.",complete_parts_used:"Parts used this time",part_delete_confirm:"Delete part '{name}'? Its stock tracking, task links and any open buy reminder will be removed.",baseline_start_value:"Start reading (optional)",baseline_start_help:"Counting starts from this reading. Leave empty to count from the current value; enter the reading at the last service so usage since then already counts.",setups_baseline_hint:"reading at last service (optional)",baseline_start_help_edit:"Leave empty to keep the existing counting. Entering a value re-anchors the counting (e.g. the reading at the last service).",baseline_current_effective:"Currently effective start value: {value}",runtime_on_states:"Active states",runtime_on_states_help:"States that count as running \u2014 default: on. E.g. mowing, cleaning, printing. With an attribute selected, its values are matched instead.",runtime_max_session:"Max session runtime (seconds)",runtime_max_session_help:"A single run counts at most this many seconds \u2014 protects against a sensor stuck ON (lost connection, restart). Empty = no cap.",trend_approaching:"Heading toward the threshold",trend_easing:"Easing away from the threshold",split_select_hint:"Select a task to see its details here",setups_target_new:"Create new: {name}",setups_target_match:"{name} \u2014 matches: {reasons}",setups_reason_model:"model number",setups_reason_name:"name",setups_reason_area:"area",setups_reason_sibling:"same model on another device",setups_maybe_covered:'Probably there already as "{name}"',setups_already:"Already there: {names}",setups_reset_line:"Completing it also resets the counter in the integration (\u201C{button}\u201D)",setups_reset_enable:"\u2014 the button gets switched on for this",reset_offers_title:"Reset counters on completion",reset_offers_hint:"These tasks watch a counter the integration keeps itself. Connected, completing the task here also presses the integration's reset button \u2014 otherwise the counter keeps running and the task falls due again right away.",reset_offers_before:"Now: completing it leaves the counter in {integration} running",reset_offers_after:"Then: it also presses \u201C{button}\u201D",reset_offers_renamed:"Renamed since it was set up \u2014 check that this task is for this part",reset_offers_apply:"Connect resets",reset_offers_done:"{count} tasks now reset their counter on completion",reset_offers_done_one:"1 task now resets its counter on completion",setups_before_after:"Tasks on the object: {before} \u2192 {after}",setups_new_object_count:'New object "{name}" \xB7 tasks: {count}',schedule_preview_title:"Next dates",schedule_preview_ontime:"Assuming on-time completion.",schedule_preview_ends:"(series ends)",adopt_problem_responsible:"Responsible user for all adopted tasks (optional)",adopt_for_minutes_hint:"Only trigger once the problem has persisted this long \u2014 0 reacts to the first flicker.",adopt_problem_configure:"Configure",history_auto:"Automatic",battery_fleet_title:"Battery fleet",battery_fleet_none_low:"All batteries OK \u2014 nothing to replace.",battery_fleet_progress:"{n} to replace",battery_fleet_buy_now:"Buy now",battery_fleet_soon:"Needed soon",battery_fleet_soon_hint:"Predicted from the last replacement date \u2014 order ahead.",battery_fleet_mark_all:"Mark all replaced",battery_fleet_mark_one:"Mark this battery replaced",battery_fleet_offline:"offline",battery_fleet_no_sensor:"No sensor",battery_fleet_trigger_lost:"This task's sensor trigger was lost \u2014 it will not fire or auto-complete.",battery_fleet_repair:"Repair",battery_fleet_exclude:"Exclude from the fleet",battery_fleet_excluded:"Excluded",battery_fleet_include:"Track again",battery_fleet_all:"All tracked batteries",battery_fleet_all_hint:"Exclude a device here to drop it from the fleet before it ever reports low \u2014 a vacuum that recharges itself, or a phone that warns you on its own.",battery_fleet_add:"Add a battery",battery_fleet_add_hint:"Pick a battery sensor the automatic discovery missed \u2014 it joins the roster immediately.",battery_fleet_track_self:"Track self-charging batteries",battery_fleet_track_self_hint:"Phones, vacuums and other devices that recharge themselves appear as rechargeables \u2014 a low one asks for a charge, never for new cells.",battery_fleet_due_without_sensor:"Treat a passed forecast as due when a battery has no sensor",battery_fleet_due_without_sensor_hint:"Some devices report no battery level at all \u2014 Battery Notes only knows the type and the last replacement. Once the typical lifetime has passed, such a battery counts as low and the fleet task reminds you; marking it replaced resets the forecast.",battery_fleet_ask_cells:"Ask which cells went in when a battery is replaced",battery_fleet_ask_cells_hint:"A device takes whatever is in the drawer. Replaced then asks whether disposable or rechargeable cells of its size went in, books those and remembers them for the device. Battery Notes keeps its type; the shopping list and the forecast follow it.",battery_fleet_cells_question:"Which cells went in?",battery_fleet_cells_rechargeable:"rechargeable",battery_fleet_status_low:"Low",battery_fleet_status_soon:"Soon",battery_fleet_status_ok:"Healthy",battery_fleet_status_due:"Due",battery_fleet_predicted_on:"Expected around {date}",battery_fleet_predicted_typical:"Expected around {date} \u2014 {months} months typical for {type} ({source})",lifetime_source_default:"built-in default",lifetime_source_table:"built-in table",lifetime_source_learned:"learned from {n} replacements",lifetime_source_override:"your setting",lifetime_source_learned_device:"learned from this device's {n} replacements",lifetime_source_learned_model:"learned from {n} replacements on devices of this model",battery_fleet_predicted_trend:"Predicted from this battery's discharge trend: around {date} ({confidence})",battery_fleet_rechargeable:"Rechargeable: charge instead of replacing \u2014 never on the shopping list",battery_fleet_sort_name:"Sort by name",battery_fleet_sort_urgency:"Sort by urgency",battery_fleet_mark_recharged:"Mark as recharged",battery_fleet_charging:"Rechargeable spares",battery_fleet_ready:"{count} ready",battery_fleet_sparkline_hint:"Battery level over the last 30 days \u2014 dotted: projected until the low threshold",battery_fleet_filter_type:"Show only this battery type",battery_fleet_record_replacement:"The level jumped around {date} \u2014 record this replacement in Battery Notes",battery_fleet_total:"{n} batteries tracked",battery_fleet_setup_button:"Battery fleet",battery_fleet_setup_done:"Battery fleet set up \u2014 one task tracks all your batteries.",update_banner:"A newer version of Maintenance Supporter is on the server \u2014 reload to update the panel.",update_reload:"Reload",restart_pending_banner:"Maintenance Supporter was updated to {version}. Restart Home Assistant to finish the update.",restart_pending_error:"That did not work: Maintenance Supporter was updated to {version}, but Home Assistant has not been restarted since. Restart Home Assistant, then try again.",row_actions_banner:"Complete and Skip in task rows are now buttons. Prefer the old icons?",row_actions_keep:"Keep buttons",row_actions_back:"Back to icons",battery_fleet_forecast_overdue:"Predicted date passed \u2014 the battery still reports healthy. If you swapped it, record the replacement; otherwise the forecast was off.",cost_from_parts:"Use \u2248 {amount} from parts",cost_parts_booked:"Parts used \u2248 {amount} are booked automatically \u2014 enter only additional costs.",cost_parts_info:"Parts used \u2248 {amount} \u2014 counted when they were bought, not here.",cost_purchase_use_hint:"The price paid becomes the part's price \u2014 spare parts count when they are used.",history_parts_counted:"Parts: {amount}",history_parts_counted_hint:"Value of the parts used \u2014 counted as spending",history_parts_info:"Parts \u2248 {amount}",history_parts_info_hint:"Value of the parts used \u2014 information only; the money counted when they were bought",history_purchase_stock:"Bought for {amount} (counted when used)",dismiss:"Dismiss",gs_label:"Getting started \u2014 these hints retire as your setup grows",gs_setups_chip:"Suggested setups found {n} devices with pre-wired triggers",gs_setups_chip_one:"Suggested setups found 1 device with pre-wired triggers",gs_adopt_chip:"{n} problem sensors can become maintenance tasks",gs_adopt_chip_one:"1 problem sensor can become a maintenance task",gs_fleet_chip:"One click sets up the battery fleet",gs_reset_chip:"{n} tasks can reset their counter in the integration",gs_reset_chip_one:"1 task can reset its counter in the integration",cal_editor_window:"Default window",cal_editor_window_week:"Week (7 days)",cal_editor_window_fortnight:"Fortnight (14 days)",cal_editor_window_month:"Month (30 days, default)",cal_editor_window_year:"Year (365 days, empty days collapsed)",cal_editor_window_past_30:"Past 30 days (history)",cal_editor_window_past_90:"Past 90 days (history)",cal_editor_show_chips:"Show window chips inside the card",cal_editor_chips_hint:"Hide the chips when the card is embedded in a strategy view that already serves as the window selector.",cal_editor_show_user_filter:"Show user filter dropdown",cal_editor_default_user:"Default user filter",cal_editor_my_tasks:"My tasks (current user)",cal_editor_show_object_filter:"Show object filter dropdown",cal_editor_object_hint:'Pre-select one object via YAML: object_filter: "<object name>" \u2014 or a list of names to restrict the card to several objects.',object_history_section:"History (all tasks)",object_history_all_tasks:"All tasks",object_history_empty:"No entries in this range.",object_history_cap_note:"History keeps up to 500 entries per task \u2014 very old entries may be missing.",service_record_title:"Service record",service_record_print:"Service record (PDF)",date:"Date",service_record_entries:"entries",ref_number:"Reference number",print_options_title:"Print service record",print_layout:"Layout",print_layout_chronological:"Chronological",print_layout_by_task:"By task",print_include:"Include",print_inc_readings:"Readings",print_inc_parts:"Parts used",print_inc_photos:"Photos",print_inc_documents:"Linked documents",print_inc_doc_desc:"Document descriptions",print_inc_checklist:"Checklist",print_inc_notes:"Notes",print_inc_costs:"Cost and duration",print_inc_person:"Completed by",print_inc_refs:"Reference numbers",print_inc_bare:"Completions without details",print_inc_qr:"QR code per task",print_button:"Print",report_scan_hint:"Scan to open the task",completed_by:"Completed by",completed_via:"{person} (via {device})",date_from:"From",date_to:"To",phases_section:"Cycle phases (optional)",phases_hint:"Different work on one shared schedule \u2014 each completion moves to the next step (e.g. small service, small service, big service).",phase_add:"Add phase",phase_name:"Phase name",phase_sequence_label:"Cycle order",phase_sequence_add_step:"Add step",phase_current:"Current phase",phase_set:"Set as current",chart_history_fallback:"No long-term statistics for this entity \u2014 showing recorder state history (typically the last ~10 days)",chart_history_alarm:"Trigger view from recorder state history: 1 = alert state held for the hold time, 0 = fine (typically the last ~10 days)",chart_history_count:"Change count rebuilt from recorder state history since the last service (typically the last ~10 days)",prediction_cycles:"Learned from cycles",phase_require_override:"Override \u201CRequire on completion\u201D for this phase",history_add_past:"Add past completion",require_tag_scan:"Only complete by scanning the tag",require_tag_scan_help:"Proof of presence: Done is blocked on every surface until the NFC tag or QR code on the thing itself is scanned. Automations can pass 'via_tag_scan' to the complete service.",disallow_skip:"Don't allow skipping",disallow_skip_help:"The Skip action disappears from every surface, and the server refuses a skip from automations and voice too.",complete_when:"Done when (optional)",complete_when_state:"changes to",complete_when_help:"While the task is due, it completes itself when this entity changes to this state, for example when the washer's door opens.",complete_when_badge:"Done when {entity} changes to {state}",complete_when_any_time:"Also when it is not due: each time completes it and starts the next cycle",complete_when_badge_for:"for {minutes} min",complete_when_badge_any_time:"also when not due",no_notifications:"No notifications for this task",no_notifications_help:"No reminders for this task \u2014 no status notifications, repeats, lead-time reminders or bundles. It still shows on the dashboard and in its entities; the weekly digest still counts it.",require_tag_scan_hint:"This task completes only by scanning its NFC tag or QR code on the thing itself \u2014 saving here will be refused.",feat_beta_editor:"New look and task editor",feat_beta_editor_desc:"Home Assistant's own controls across the panel, tasks as rules like the automation editor, and a trace of each task. On by default; switch it off for the classic look.",beta_new_scratch:"Create new task",beta_new_scratch_desc:"Start with an empty task",beta_new_from_sensor:"Start from a sensor",beta_new_from_sensor_desc:"One of the object's sensors makes the task due",beta_new_from_template_desc:"A task from the template library",beta_new_copy:"Copy an existing task",beta_new_copy_desc:"Its settings, for this object",beta_new_search:"Search",beta_rules_add_rule:"Add rule",beta_rules_select_hint:"Select a row to change it.",beta_rules_every:"Every {interval}",beta_rules_once_on:"Once, on {date}",beta_rules_no_date:"Once, the date is still missing",beta_rules_manual:"No schedule: whenever it is needed",beta_rules_sensor_only:"Only when the sensor rule says so",beta_rules_safety_any:"Or every {interval}, whichever comes first",beta_rules_safety_all:"At the earliest after {interval}",beta_rules_due_soon:"Due soon {interval} before",beta_rules_above:"above {value}",beta_rules_below:"below {value}",beta_rules_for:"for {duration}",beta_rules_counter_delta:"goes up by {value} since the last completion",beta_rules_counter_reaches:"reaches {value}",beta_rules_changes_from:"changes from {state}",beta_rules_changes_to:"changes to {state}",beta_rules_changes:"changes state",beta_rules_times:"{n} times",beta_rules_runs_for:"has run for {duration}",beta_rules_date_before:"{interval} before the date it reports",beta_rules_date_on:"on the date it reports",beta_rules_all_of:"All conditions apply ({n})",beta_rules_any_of:"Any condition applies ({n})",beta_rules_pick_entity:"Pick a sensor",beta_rules_by_hand:"By hand: Complete, a tag or voice",beta_rules_nobody:"Nobody in particular",beta_rules_reminders_on:"Reminders as set in the settings",beta_rules_name_missing:"Give the task a name",beta_rules_by_type:"By type",beta_rules_by_device:"By device",beta_rules_replaces:"Replaces the current schedule",beta_rules_combines:"Joins the current sensor rule",beta_rules_adds_safety:"Adds a safety interval",beta_rules_no_device:"This object is not linked to a device or an area. Link it in the object's settings, or choose a rule under By type.",beta_rules_no_device_entities:"Its device has no entities to suggest.",beta_rules_done_when_suggest:"Done when it changes",beta_template_pick:"Tasks to create",beta_template_none:"Tick at least one task.",beta_template_create:"Create {n} tasks",beta_template_create_one:"Create 1 task",beta_trace:"Trace",beta_sensor_rule:"Sensor rule",beta_show_history:"Show more",beta_trace_off:"Traces are recorded while the new look is on. Completions and the rest of the history show either way.",beta_trace_current:"Current cycle",beta_trace_older:"Older cycle",beta_trace_newer:"Newer cycle",beta_trace_empty:"Nothing happened in this cycle yet.",beta_trace_load_failed:"Could not load the trace.",beta_trace_reminder:"Reminder sent: {status}",beta_trace_reminder_lead:"Heads-up sent: due in {interval}",beta_trace_cleared_done:"Reminder taken off the phones: done",beta_trace_cleared_status:"Reminder taken off the phones: no longer needed",beta_trace_cleared_inert:"Reminder taken off the phones: paused or archived",beta_trace_snoozed:"Snoozed until {time}",beta_trace_dw_counted:"{entity} changed to {state}: counts as done",beta_trace_dw_waiting:"{entity} changed to {state}: waiting {duration}",beta_trace_dw_left_early:"{entity} left {state} too early: not counted",beta_trace_dw_not_due:"{entity} changed to {state}: not counted, the task was not due",beta_trace_dw_inert:"{entity} changed to {state}: not counted, the task is paused or archived",beta_trace_dw_recent:"{entity} changed to {state}: not counted, it was done moments ago",beta_trace_edited:"Task changed: {fields}",beta_trace_edited_other:"other settings",beta_trace_later:"{span} later",beta_trace_running:"Still running",beta_trace_after_due:"Done {span} after it was due",beta_trace_before_due:"Done before it was due",beta_trace_due_for:"Due for {span}",beta_trace_cycle_length:"Cycle: {span}",beta_trace_reminders:"{n} reminders",beta_trace_reminders_one:"1 reminder",beta_trace_snoozes:"Snoozed {n} times",beta_trace_snoozes_one:"Snoozed once",beta_trace_message:"Message",beta_trace_bundle:"Sent together with the other due tasks",beta_trace_download:"Download trace",beta_trace_activity:"Activity around this step",beta_trace_activity_none:"Nothing recorded around this time. Home Assistant keeps its history for 10 days unless set otherwise.",beta_rules_group_device:"This device",beta_rules_group_area_more:"More in the {area} area",beta_rules_group_area:"In the {area} area",beta_rules_no_area_entities:"Nothing in its area suggests a rule.",beta_filters_clear:"Clear filters",beta_search_tasks:"Search {count} tasks",beta_sort_by:"Sort by {sort}",beta_filters:"Filters",beta_filter_status:"Status"}});function Fr(i){return jn[i]??"var(--secondary-text-color)"}function Br(i){return fc[i??""]??Di.length}function qn(i){return Ur.includes(i??"")}function qi(i){return!!i.archived||i.enabled===!1||i.status==="paused"||i.paused===!0}var Ne,jn,Dn,Di,Ur,fc,ii,je=x(()=>{"use strict";Ne={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"var(--deep-orange-color, #ff5722)",archived:"var(--disabled-color, #9e9e9e)",paused:"var(--info-color, #2196f3)"},jn={completed:Ne.ok,missed:Ne.overdue,reset:Ne.paused,skipped:"var(--secondary-text-color)",triggered:Ne.triggered,trigger_replaced:Ne.triggered,trigger_removed:"var(--secondary-text-color)"},Dn=["completed","reset","skipped"];Di=["overdue","triggered","due_soon","ok"],Ur=["overdue","triggered","due_soon"],fc=Object.fromEntries(Di.map((i,s)=>[i,s]));ii={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",archived:"mdi:archive-outline",paused:"mdi:pause-circle-outline",completed:"mdi:check-circle",skipped:"mdi:skip-next",missed:"mdi:calendar-remove",reset:"mdi:refresh"}});function Hn(i){return i?.restart_pending&&i.installed_version?i.installed_version:null}var Mn,Wr=x(()=>{"use strict";Mn="2.117.0"});function Yr(i){rt.en=Object.assign({},i,rt.en??{})}function De(i){let s=(i||Gr).toLowerCase();return s.startsWith("pt")&&s.endsWith("br")?"pt-br":s.substring(0,2)}function N(i){return i?.language||"en"}function n(i,s,e){let t=De(s);return rt[t]?.[i]??rt.en?.[i]??e??i}function mt(i){let s=De(i);return s===Gr||s in rt||!Ln.has(s)}function $e(i){let s=De(i);if(s===Gr||s in rt||!Ln.has(s))return Promise.resolve();let e=Vr[s];return e!==void 0&&Date.now()-e<vc?Promise.resolve():(s in ri||(ri[s]=fetch(`${bc}/${s}.json?v=${Mn}`).then(t=>t.ok?t.json():null).then(t=>{t?rt[s]=t:(delete ri[s],Vr[s]=Date.now())}).catch(()=>{delete ri[s],Vr[s]=Date.now()})),ri[s])}var Gr,Kr,rt,ri,Vr,vc,Ln,bc,si=x(()=>{"use strict";Wr();Gr="en",Kr=(()=>{let i=window;return i.__msLocales||(i.__msLocales={store:{},inflight:{}}),i.__msLocales.failedAt||(i.__msLocales.failedAt={}),i.__msLocales})(),rt=Kr.store,ri=Kr.inflight,Vr=Kr.failedAt,vc=6e4;Ln=new Set(["de","nl","fr","it","es","pt","pt-br","ru","uk","pl","cs","sv","zh","da","fi","nb","ja","hi","hu","ko","tr"]),bc="/maintenance_supporter_locales"});function zn(i){let s=i?.language;!s||typeof i?.loadBackendTranslation!="function"||ce.lang===s&&(ce.localize||ce.inflight)||(ce.lang=s,ce.localize=null,ce.inflight=i.loadBackendTranslation("exceptions",Qr).then(e=>{ce.lang===s&&(ce.localize=e)}).catch(()=>{}).finally(()=>{ce.inflight=null}))}function Fn(i,s,e){if(!s||!ce.localize||i&&i!==Qr)return null;let t=`component.${Qr}.exceptions.${s}.message`,r=ce.localize(t,e??void 0);return r&&r!==t?r:null}var Qr,ce,Zr=x(()=>{"use strict";Qr="maintenance_supporter",ce=(()=>{let i=window;return i.__msBackendErrors??={lang:"",localize:null,inflight:null}})()});function ni(i){let s=Un.get(i);if(s===void 0){try{s=new Intl.DateTimeFormat("en-US",{timeZone:i,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{s=null}Un.set(i,s)}return s}function Vn(){if(Jr===void 0){let i;try{i=new Intl.DateTimeFormat().resolvedOptions().timeZone}catch{}Jr=i&&ni(i)?i:null}return Jr}function Gn(){return Vn()??"UTC"}function qe(){let i=Wn.serverTimeZone;return i&&ni(i)?i:Gn()}function Me(){let i=Vn();return Wn.timeZone!=="server"&&i?i:qe()}function Mi(i,s){let e=ni(s)??ni(Gn())??ni("UTC"),t={};for(let r of e.formatToParts(i))r.type!=="literal"&&(t[r.type]=Number(r.value));return{y:t.year,mo:t.month,d:t.day,h:t.hour%24,mi:t.minute,s:t.second}}function He(i,s){return ts(Mi(+i,s))}function Hi(i,s){let e=Mi(+i,s);return`${ts(e)}T${de(e.h)}:${de(e.mi)}`}function Ee(){return He(Date.now(),qe())}function Kn(){return Hi(Date.now(),qe())}function Xr(i,s){let e=Mi(i,s);return Date.UTC(e.y,e.mo-1,e.d,e.h,e.mi,e.s)-Math.floor(i/1e3)*1e3}function yc(i,s,e,t,r,o,a){let c=Date.UTC(i,s-1,e,t,r,o),u=Xr(c-es,a),_=Xr(c+es,a);for(let m of u===_?[u]:[u,_])if(Xr(c-m,a)===m)return c-m;return c-u}function Yn(i,s,e){if(i.has(s))return i.get(s);i.size>=kc&&i.clear();let t=e();return i.set(s,t),t}function Y(i){if(typeof i!="string"||!i)return NaN;let s=is.exec(i);if(!s)return Date.parse(i);let e=qe();return Yn(wc,`${e}|${i}`,()=>{let[t,r,o,a,c,u]=[s[1],s[2],s[3],s[4]??"0",s[5]??"0",s[6]??"0"].map(Number);if(r<1||r>12||new Date(Date.UTC(t,r-1,o)).getUTCDate()!==o||a>23||c>59||u>59)return NaN;let _=s[7]?Math.floor(+`0.${s[7]}`*1e3):0;return yc(t,r,o,a,c,u,e)+_})}function Li(i){if(typeof i!="string"||!i)return null;let s=is.exec(i);if(s)return`${s[1]}-${s[2]}-${s[3]}`;let e=qe();return Yn(xc,`${e}|${i}`,()=>{let t=Date.parse(i);return Number.isFinite(t)?He(t,e):/^\d{4}-\d{2}-\d{2}/.test(i)?i.slice(0,10):null})}function Qn(i){if(typeof i!="string"||!i)return"";let s=is.exec(i);if(s)return`${s[1]}-${s[2]}-${s[3]}T${s[4]??"00"}:${s[5]??"00"}:${s[6]??"00"}`;let e=Date.parse(i);if(!Number.isFinite(e))return"";let t=Mi(e,qe());return`${ts(t)}T${de(t.h)}:${de(t.mi)}:${de(t.s)}`}function Bn(i){let s=Zn.exec(i);if(!s)return NaN;let[e,t,r]=[Number(s[1]),Number(s[2]),Number(s[3])],o=Date.UTC(e,t-1,r);return t>=1&&t<=12&&new Date(o).getUTCDate()===r?o/es:NaN}function Jn(i,s){let e=Zn.exec(i);if(!e)return i;let t=new Date(Date.UTC(Number(e[1]),Number(e[2])-1,Number(e[3])+Math.round(s)));return`${de(t.getUTCFullYear(),4)}-${de(t.getUTCMonth()+1)}-${de(t.getUTCDate())}`}function Xn(i,s){return Bn(s)-Bn(i)}var Wn,es,de,Un,Jr,ts,is,xc,wc,kc,Zn,Z=x(()=>{"use strict";Wn=window.__msDateTimePrefs??={},es=864e5,de=(i,s=2)=>String(i).padStart(s,"0"),Un=new Map;ts=i=>`${de(i.y,4)}-${de(i.mo)}-${de(i.d)}`;is=/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?$/,xc=new Map,wc=new Map,kc=2e4;Zn=/^(\d{4})-(\d{2})-(\d{2})$/});function st(i){return i?.currency_symbol||$c}function zi(i,s){s.has("hass")&&ns(i.hass?.locale,i.hass?.config?.country,i.hass?.config?.time_zone);let e=i.hass?.language;e&&!mt(e)&&$e(e).then(()=>{mt(e)&&i.requestUpdate()}),zn(i.hass)}function so(i){let s=De(i);return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN",da:"da-DK",fi:"fi-FI",nb:"nb-NO",ja:"ja-JP",hi:"hi-IN",pl:"pl-PL",cs:"cs-CZ",sv:"sv-SE","pt-br":"pt-BR",hu:"hu-HU",ko:"ko-KR",tr:"tr-TR"}[s]??"en-US"}function Ec(i){oo.decimals=typeof i=="number"&&Number.isInteger(i)&&i>=0&&i<=3?i:0}function Tc(){return oo.decimals??0}function Fi(i){i&&i.currency_decimals!==void 0&&i.currency_decimals!==null&&Ec(Number(i.currency_decimals))}function ns(i,s,e){e!==void 0&&(pe.serverTimeZone=e||void 0),i&&(pe.date=i.date_format,pe.time=i.time_format,pe.number=i.number_format,pe.timeZone=i.time_zone,s!==void 0&&(pe.country=s||void 0))}function ao(i){switch(pe.number){case"comma_decimal":return["en-US","en"];case"decimal_comma":return["de","es","it"];case"space_comma":return["fr","sv","cs"];case"system":return;default:return so(i)}}function Ui(i,s,e,t,r="n"){return e===1?n(s,t):n(i,t).replace(`{${r}}`,S(e,t))}function rs(i,s){let e=`${String(i??"")}|${JSON.stringify(s)}`,t=eo.get(e);return t||(t=new Intl.NumberFormat(i,s),eo.set(e,t)),t}function Le(i,s){let e=`${i??""}|${JSON.stringify(s)}`,t=to.get(e);return t||(t=new Intl.DateTimeFormat(i,s),to.set(e,t)),t}function ft(i,s,e){let t={style:"unit",unit:s,unitDisplay:"long",maximumFractionDigits:2};try{return rs(ao(e),t).format(i)}catch{return`${S(i,e)} ${s}`}}function S(i,s,e){if(!Number.isFinite(i))return String(i);let t=typeof e=="number"?{minimumFractionDigits:e,maximumFractionDigits:e}:{maximumFractionDigits:2,...e};if(pe.number==="none"){let r=Math.pow(10,t.maximumFractionDigits??2);return String(Math.round(i*r)/r)}try{return rs(ao(s),t).format(i)}catch{return rs(void 0,t).format(i)}}function lo(i,s,e){return i<0?`${n("cost_kind_credit",e??"en")}: ${X(-i,s,e)}`:X(i,s,e)}function X(i,s,e,t){let r=t??Tc(),o=Math.abs(i)<.5/Math.pow(10,r)?0:i,a=S(o,e,r);return s?`${a} ${s}`:a}function vt(i,s,e){let t=S(i,e);return s?`${t} ${s}`:t}function gt(i){let s=pe.country,e=`${i??""}|${s??""}`,t=io.get(e);if(t!==void 0)return t;let r=so(i);if(s&&/^[A-Za-z]{2}$/.test(s)){let o=`${De(i).split("-")[0]}-${s.toUpperCase()}`;try{Le(o,{}),r=o}catch{}}return io.set(e,r),r}function ss(i,s,e){let t=pe.date;if(t==="DMY"||t==="MDY"||t==="YMD"){let[o,a,c]=He(i,e).split("-");return t==="DMY"?`${c}/${a}/${o}`:t==="MDY"?`${a}/${c}/${o}`:`${o}-${a}-${c}`}let r=t==="system"?void 0:gt(s);return Le(r,{day:"2-digit",month:"2-digit",year:"numeric",timeZone:e}).format(i)}function Bi(i,s,e=!1){let t=Me(),r={hour:"2-digit",minute:"2-digit",...e?{second:"2-digit"}:{}};switch(pe.time){case"12":return Le(gt(s),{...r,hour12:!0,timeZone:t}).format(i);case"24":return Le(gt(s),{...r,hour12:!1,timeZone:t}).format(i);case"system":return Le(void 0,{...r,timeZone:t}).format(i);default:return Le(gt(s),{...r,timeZone:t}).format(i)}}function D(i,s){if(!i)return"\u2014";try{let e=co.exec(i);return e?ss(new Date(Date.UTC(+e[1],+e[2]-1,+e[3])),s,"UTC"):ss(new Date(Y(i)),s,Me())}catch{return i}}function Wi(i,s,e=!1){if(!i)return"\u2014";if(co.test(i))return D(i,s);try{let t=new Date(Y(i));return ss(t,s,Me())+" "+Bi(t,s,e)}catch{return i}}function Vi(i,s=Date.now()){let e=qe();return Hi(s,e)===Hi(s,Me())?"":n("ha_time_zone_hint",i).replace("{zone}",e)}function bt(i,s){if(i==null)return"\u2014";let e=s||"en";return i<0?`${Math.abs(i)} ${n("d_overdue",e)}`:i===0?n("today",e):nt(i,e)}function nt(i,s){let e=s||"en";return`${i} ${n(os(i,e,{one:"day",few:"days_few",other:"days"}),e)}`}function os(i,s,e){let t=i===1?"one":"other";try{let r=ro.get(s);r||(r=new Intl.PluralRules(s),ro.set(s,r)),t=r.select(i)}catch{}return t==="one"?e.one:t==="few"?e.few:e.other}function po(i,s){let e=Li(i);if(!e)return null;let t=Xn(e,Ee());return Number.isFinite(t)?t<=0?n("last_done_today",s||"en"):n("last_done_days_ago",s||"en").replace("{n}",String(t)):null}function oi(i,s,e){return i==null?"\u2014":`${i} ${n("unit_"+(s||"days"),e)}`}function yt(i,s){return i==null?"\u2014":`${S(i,s,{maximumFractionDigits:1})} ${n("minutes_short",s)}`}function ze(i,s,e="long"){return Le(gt(s),{weekday:e,timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,1+i)))}function as(i,s,e="long"){return Le(gt(s),{month:e,timeZone:"UTC"}).format(new Date(Date.UTC(2024,i,1)))}function uo(i,s){let e=i.schedule;if(i.schedule_type==="sensor_based"){let o=n("sensor_based",s),a=e&&e.kind==="interval"&&e.every?e.every:i.interval_days;return a?`${o} \xB7 ${oi(a,(e&&e.kind==="interval"?e.unit:i.interval_unit)||"days",s)}`:o}let t=e?.offset?` ${e.offset>0?"+":"\u2212"}${Math.abs(e.offset)}d`:"",r=e?.months?.length?` \xB7 ${[...e.months].sort((o,a)=>o-a).map(o=>as(o-1,s,"short")).join(", ")}`:"";switch(e?.kind){case"weekdays":return((e.weekdays||[]).map(o=>ze(o,s,"short")).join(" & ")||"\u2014")+t;case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?n("ord_last",s):n("ord_"+e.nth,s)} ${ze(e.weekday,s,"long")}${t}${r}`;case"day_of_month":return e.day==null?"\u2014":(e.day===-1?n(e.business?"last_business_day_month":"last_day_month",s):`${n("day_word",s)} ${e.day}`)+t+r;case"calendar":return`${n("calendar_entity_label",s)}: ${i.schedule_entity_name||e.entity_id||"\u2014"}${t}`;case"one_time":return i.due_date?D(i.due_date,s):n("one_time",s);case"manual":return n("manual",s);case"interval":return oi(e.every,e.unit,s)}return i.schedule_type==="one_time"?i.due_date?D(i.due_date,s):n("one_time",s):i.schedule_type==="manual"?n("manual",s):i.schedule_type==="sensor_based"?n("sensor_based",s):i.interval_days!=null?oi(i.interval_days,i.interval_unit,s):"\u2014"}function ho(i,s){i.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:s},bubbles:!0,composed:!0}))}var $c,no,pe,oo,eo,to,io,co,ro,Fe,_o,Sc,Cc,Gi,P=x(()=>{"use strict";I();On();je();si();Zr();Z();si();$c="\u20AC";Yr(Nn);no=window,pe=no.__msDateTimePrefs??={},oo=no.__msMoneyPrefs??={};eo=new Map,to=new Map;io=new Map;co=/^(\d{4})-(\d{2})-(\d{2})$/;ro=new Map;Fe=$`
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
`,_o=$`
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
`,Sc=$`
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
`,Cc=$`
  .ref-chip {
    display: inline-block; font-size: 11.5px; font-weight: 500; line-height: 1; padding: 3px 6px;
    border-radius: var(--ms-radius-6, 6px); border: 1px solid var(--divider-color); color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums; letter-spacing: .02em; vertical-align: middle; white-space: nowrap;
    user-select: all;
  }
  /* #189: "· Residual waste, Paper" after a calendar-driven task's name. */
  .event-titles { color: var(--secondary-text-color); font-weight: 400; }
`,Gi=$`
  ${Sc}
  ${Cc}
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
`});function Rc(i){let s=i.replace(/_ids?$/,"").split("_").filter(Boolean);if(s.length===0)return i;let e=s.join(" ");return e.charAt(0).toUpperCase()+e.slice(1)}function Pc(i,s){let e=Ic[i];if(e){let t=n(e,s);if(t&&t!==e)return t}return Rc(i)}function Oc(i){let s=[...i.matchAll(/\['([^']+)'\]/g)].map(r=>r[1]),e=s.length?s[s.length-1]:void 0,t;return(t=i.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=i.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=i.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=i.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(i)?{field:e,rule:"required"}:(t=i.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(i)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(i)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function Nc(i,s){let e=new Set(mo(s));return mo(i).every(t=>e.has(t))}function go(i,s,e){if(e=e??n("action_error",s),typeof i=="string")return i;if(typeof i!="object"||i===null)return e;let t=i,r=t.message||t.error?.message||"",o=t.code||t.error?.code||"",a=o?Ac[o]:void 0,c=Fn(t.translation_domain??t.error?.translation_domain,t.translation_key??t.error?.translation_key,t.translation_placeholders??t.error?.translation_placeholders);if(c)return c;if(!r&&!a)return e;let u=Oc(r),_=u.field?Pc(u.field,s):"",m=f=>n(f,s).replace("{field}",_).replace("{n}",u.param??"");switch(u.rule){case"too_long":return m("err_too_long");case"too_short":return m("err_too_short");case"value_too_high":return m("err_value_too_high");case"value_too_low":return m("err_value_too_low");case"required":return m("err_required");case"wrong_type":return m("err_wrong_type").replace("{type}",u.param??"");case"invalid_choice":return m("err_invalid_choice");case"invalid_value":return m("err_invalid_value");default:if(a){let f=n(a,s);return De(s)==="en"&&r&&!Nc(r,o)?`${f} (${r})`:f}return r||e}}var Ac,Ic,mo,fo=x(()=>{"use strict";P();Zr();si();Ac={already_archived:"ws_err_already_archived",already_paused:"ws_err_already_paused",archived:"ws_err_archived",changed_since:"undo_changed",create_failed:"ws_err_create_failed",duplicate_failed:"ws_err_duplicate_failed",empty:"ws_err_empty",empty_csv:"ws_err_empty_csv",invalid_cursor:"ws_err_invalid_cursor",invalid_date:"ws_err_invalid_date",invalid_device:"ws_err_invalid_device",invalid_entity_slug:"ws_err_invalid_entity_slug",invalid_format:"ws_err_invalid_format",invalid_input:"ws_err_invalid_input",invalid_mirror_todo:"ws_err_invalid_mirror_todo",invalid_notify_service:"ws_err_invalid_notify_service",invalid_parent:"ws_err_invalid_parent",invalid_icon:"ws_err_invalid_icon",invalid_range:"ws_err_invalid_range",invalid_search_template:"ws_err_invalid_search_template",invalid_shopping_list_entity:"ws_err_invalid_shopping_list_entity",invalid_target:"ws_err_invalid_target",invalid_trigger_config:"ws_err_invalid_trigger_config",invalid_url:"ws_err_invalid_url",invalid_user:"ws_err_invalid_user",invalid_view:"ws_err_invalid_view",limit_reached:"ws_err_limit_reached",no_defaults:"ws_err_no_defaults",no_phases:"ws_err_no_phases",no_url:"ws_err_no_url",not_archived:"ws_err_not_archived",not_available:"ws_err_not_available",not_configured:"ws_err_not_configured",not_found:"ws_err_not_found",notify_service_not_found:"ws_err_notify_service_not_found",not_loaded:"ws_err_not_loaded",not_paused:"ws_err_not_paused",nothing_to_undo:"undo_nothing",replace_failed:"ws_err_replace_failed",self_link_device:"ws_err_self_link_device",too_early:"ws_err_too_early",too_large:"ws_err_too_large",too_many:"ws_err_too_many",too_many_views:"ws_err_too_many_views",unauthorized:"ws_err_unauthorized",unavailable:"ws_err_unavailable"},Ic={entry_id:"object",name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_equals:"trigger_equals",trigger_not_equals:"trigger_not_equals",trigger_for_minutes:"trigger_for_minutes"};mo=i=>i.toLowerCase().split(/[^a-z0-9]+/).filter(s=>s.length>1)});async function L(i,s,e={}){e.busy?.(!0);try{let t=typeof s=="function"?await s():await i.hass.connection.sendMessagePromise(s);return e.reload&&await e.reload(),e.successToast&&e.onSuccess?.(e.successToast),t===void 0?null:t}catch(t){let r=e.lang||N(i.hass),o=await Dc(i,t,r)??go(t,r,e.fallbackKey?n(e.fallbackKey,r):void 0);e.onError?.(o,t);return}finally{e.busy?.(!1)}}async function Dc(i,s,e){let t=typeof s=="object"&&s!==null?s:{};if(!jc.has(t.code||t.error?.code||""))return null;try{let r=Hn(await i.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}));return r?n("restart_pending_error",e).replace("{version}",r):null}catch{return null}}var jc,me=x(()=>{"use strict";fo();P();Wr();jc=new Set(["unknown_error","invalid_format","unknown_command"])});async function Mc(i,s,e,t){let r="",o=await L({hass:i},{type:"maintenance_supporter/task/undo",entry_id:s,task_id:e},{lang:t,onError:(a,c)=>{let u=qc[c?.code??""];r=u?n(u,t):a}});return o===void 0?{ok:!1,message:r}:{ok:!0,message:n(o?.action_ran?"undo_done_action_ran":"undo_done",t)}}function Ki(i,s){let e=i?.already_recorded_seconds;return typeof e=="number"?n("completion_already_recorded",s).replace("{seconds}",String(e)):null}function ot(i,s,e,t,r){let o=(a,c)=>i.dispatchEvent(new CustomEvent("hass-notification",{detail:c?{message:a,action:c,duration:1e4}:{message:a},bubbles:!0,composed:!0}));o(n("task_completed_named",t).replace("{task}",e.taskName),{text:n("undo",t),action:()=>{Mc(s,e.entryId,e.taskId,t).then(a=>{o(a.message),a.ok&&r()})}})}var qc,xt=x(()=>{"use strict";P();me();qc={changed_since:"undo_changed",nothing_to_undo:"undo_nothing"}});function ee(i){let s=i?.quick_complete_defaults;return!!s&&typeof s=="object"&&!Array.isArray(s)}function Yi(i){return ee(i)?{...i.quick_complete_defaults}:null}async function Qi(i,s,e,t){let r={message:"",code:""},o=await L({hass:i},{type:"maintenance_supporter/task/quick_complete",entry_id:s,task_id:e,source:"panel"},{lang:t,fallbackKey:"action_error",onError:(c,u)=>{r={message:c,code:u?.code??""}}});if(o===void 0)return Hc.has(r.code)?{result:"dialog"}:{result:"failed",message:r.message};let a=Ki(o,t);return a?{result:"already",message:a}:{result:"done",undo:o?.undo===!0}}var Hc,wt=x(()=>{"use strict";me();xt();Hc=new Set(["no_defaults","completion_details_required","tag_scan_required"])});var vo=x(()=>{});function b(i){return(s,e)=>typeof e=="object"?zc(i,s,e):((t,r,o)=>{let a=r.hasOwnProperty(o);return r.constructor.createProperty(o,t),a?Object.getOwnPropertyDescriptor(r,o):void 0})(i,s,e)}var Lc,zc,ls=x(()=>{Yt();Lc={attribute:!0,type:String,converter:Kt,reflect:!1,hasChanged:Ai},zc=(i=Lc,s,e)=>{let{kind:t,metadata:r}=e,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),t==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),t==="accessor"){let{name:a}=e;return{set(c){let u=s.get.call(this);s.set.call(this,c),this.requestUpdate(a,u,i,!0,c)},init(c){return c!==void 0&&this.C(a,void 0,i,c),c}}}if(t==="setter"){let{name:a}=e;return function(c){let u=this[a];s.call(this,c),this.requestUpdate(a,u,i,!0,c)}}throw Error("Unsupported decorator location: "+t)}});function h(i){return b({...i,state:!0,attribute:!1})}var bo=x(()=>{ls();});var yo=x(()=>{});var kt=x(()=>{});var xo=x(()=>{kt();});var wo=x(()=>{kt();});var ko=x(()=>{kt();});var $o=x(()=>{kt();});var Eo=x(()=>{kt();});var z=x(()=>{vo();ls();bo();yo();xo();wo();ko();$o();Eo()});function To(i,s,e){let t=new Blob([i],{type:e}),r=URL.createObjectURL(t),o=document.createElement("a");o.href=r,o.download=s,o.target="_blank",o.rel="noopener",o.style.display="none",document.body.appendChild(o),o.dispatchEvent(new MouseEvent("click")),document.body.removeChild(o),setTimeout(()=>URL.revokeObjectURL(r),6e4)}var cs=x(()=>{"use strict"});async function Fc(i,s,e=300){return(await i.connection.sendMessagePromise({type:"auth/sign_path",path:s,expires:e})).path}async function ds(i,s,e=300){return Fc(i,`/api/maintenance_supporter/document/${s}`,e)}async function So(i,s,e=""){let t=window.open("about:blank","_blank");try{let r=await ds(i,s);t&&(t.location.href=new URL(r+e,window.location.origin).href)}catch(r){throw t&&t.close(),r}}var ps=x(()=>{"use strict";cs()});function us(i){return i.replace(/[\t\n\r]/g,"").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g,"")}function hs(i){let s=/^([a-z][a-z0-9+.-]+):/i.exec(us(i||""));return s?s[1].toLowerCase():null}function $t(i){let s=hs(i);return s!==null&&!Uc.has(s)}function Ao(i){return!!i&&/^https?:\/\//i.test(i)}var Uc,Ji=x(()=>{"use strict";Uc=new Set(["about","blob","data","file","filesystem","javascript","livescript","ms-appinstaller","ms-cxh","ms-cxh-full","ms-msdt","ms-officecmd","search","search-ms","view-source","vbscript"])});function Vc(i){let s=(i||"").split(/\s+/).filter(Boolean);return s.length===0?"?":s.length===1?s[0][0].toUpperCase():(s[0][0]+s[s.length-1][0]).toUpperCase()}function Gc(i){let s=0;for(let e of i)s=s*31+e.charCodeAt(0)>>>0;return Po[s%Po.length]}function er(i){return i?{id:i.id,name:i.name,initials:i.initials||Vc(i.name),color:i.color||Gc(i.id)}:null}function Oo(i){return i?l`<span class="person-avatar" style="--person-color: ${i.color}" title=${i.name}>${i.initials}</span>`:p}function No(i){let s=i.filter(e=>!!e);return s.length<=1?Oo(s[0]):l`<span class="people-avatars">${s.map(e=>Oo(e))}</span>`}var Po,ms=x(()=>{"use strict";I();Po=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"]});var Tt,gs=x(()=>{"use strict";ms();Tt=class{constructor(s){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=s}updateHass(s){this.hass=s}async getUsers(s=!1){let e=Date.now();if(!s&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(s,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:s,task_id:e,user_id:t})}async getTasksByUser(s){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:s})).tasks}getUserName(s){return!s||!this.usersCache?null:this.usersCache.find(t=>t.id===s)?.name||null}getPerson(s){return er(this.getUser(s))}getUser(s){return!s||!this.usersCache?null:this.usersCache.find(e=>e.id===s)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(s){return s?s===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}}});function Kc(i,s){if(s<=0)return 0;let e=typeof i=="number"&&Number.isFinite(i)?Math.trunc(i):0;return e<0?0:e%s}function Yc(i){return!!(i?.phases&&i.phase_sequence&&i.phase_sequence.length>0)}function fs(i){if(!i||!Yc(i))return null;let s=i.phase_sequence,e=Kc(i.phase_cursor,s.length),t=s[e],r=i.phases?.[t];return r?{id:t,name:r.name,index:e,count:s.length,notes:r.notes,checklist:r.checklist!==void 0?r.checklist:i.checklist??[],consumesParts:r.consumes_parts!==void 0?r.consumes_parts:i.consumes_parts??[],requiredFields:r.required_completion_fields!==void 0?r.required_completion_fields:i.required_completion_fields??[]}:null}function Ue(i){let s=fs(i);return s?`${s.index+1}/${s.count} \xB7 ${s.name}`:""}var tr=x(()=>{"use strict"});function qo(){let i=new Uint8Array(4);return(globalThis.crypto??{getRandomValues:s=>s.map(()=>Math.floor(Math.random()*256))}).getRandomValues(i),Array.from(i,s=>s.toString(16).padStart(2,"0")).join("")}function Be(i){let s=i?.reading_values;if(!Array.isArray(s))return[];let e=[],t=new Set;for(let r of s){if(!r||typeof r!="object")continue;let o=r;typeof o.id!="string"||!o.id||t.has(o.id)||typeof o.value!="number"||!Number.isFinite(o.value)||(t.add(o.id),e.push({id:o.id,name:typeof o.name=="string"?o.name:o.id,unit:typeof o.unit=="string"?o.unit:null,value:o.value}))}return e}function Mo(i){return i.filter(s=>s.type==="completed"&&(s.reading_value!=null||Be(s).length>0)).sort((s,e)=>s.timestamp.localeCompare(e.timestamp))}function Ho(i){return Mo(i??[]).map(s=>({timestamp:s.timestamp,values:Be(s)})).filter(s=>s.values.length>0)}function Lo(i,s,e){let t;for(let r of i){if(e!==void 0){let a=Y(r.timestamp);if(!isNaN(a)&&a>=e)break}let o=r.values.find(a=>a.id===s);o&&(t=o)}return t}function zo(i,s,e){let t=Be(s).find(o=>o.id===e);if(!t)return null;let r=null;for(let o of Mo(i)){if(o.timestamp>=s.timestamp)break;let a=Be(o).find(c=>c.id===e);a&&(r=a.value)}return r==null?null:t.value-r}function Fo(i){let s=new Set,e=new Set;for(let t of i){let r=(t.name||"").trim().toLowerCase();r&&(s.has(r)?e.add(t.id):s.add(r))}return e}function Uo(i){let s=[],e=new Set,t=new Set;for(let r of i){let o=(r.name||"").trim();if(!(!o||e.has(r.id)||t.has(o.toLowerCase()))&&(e.add(r.id),t.add(o.toLowerCase()),s.push({id:r.id,name:o,unit:(r.unit||"").trim()||null}),s.length>=vs))break}return s}var vs,at=x(()=>{"use strict";Z();vs=20});function ge(i){return`${i.entry_id??""}\0${i.part_id}`}function Bo(i,s,e,t){let r=!!i.entry_id&&i.entry_id!==s,o=r?i.entry_id:s,a=e.find(m=>m.entry_id===o),c=(a?.parts||[]).find(m=>m.id===i.part_id)||null,u=r&&a?.object?.name||"",_=c?.name||n("shared_part_unknown",t);return{part:c,foreign:r,ownerName:u,label:u?`${_} (${u})`:_}}function Wo(i,s,e,t){let{part:r,label:o}=Bo(i,s,e,t),a=r&&r.stock!==null&&r.stock!==void 0?` (${vt(r.stock,r.unit,t)})`:"",c=r?.storage_location?` \u2014 ${r.storage_location}`:"";return`${S(i.quantity,t)}\xD7 ${o}${a}${c}`}function Vo(i,s,e,t){let r=e.find(u=>u.entry_id===s),o=u=>u?.object.battery_fleet?{cost_mode:"purchase"}:{},a=(r?.parts||[]).map(u=>({...u,...o(r)})),c=new Set(a.map(u=>ge({part_id:u.id})));for(let u of i?.consumes_parts||[]){if(!u.entry_id||u.entry_id===s)continue;let _=ge(u);if(c.has(_))continue;c.add(_);let{part:m,ownerName:f}=Bo(u,s,e,t);a.push({id:u.part_id,name:m?.name||n("shared_part_unknown",t),unit:m?.unit,stock:m?.stock??null,storage_location:m?.storage_location,cost:m?.cost??null,package_size:m?.package_size??null,cost_mode:m?.cost_mode??null,...o(e.find(v=>v.entry_id===u.entry_id)),entry_id:u.entry_id,owner_name:f})}return a}var ir=x(()=>{"use strict";P()});function Ko(i){return i==="use"?"use":"purchase"}function rr(i,s,e=!1){if(e)return"purchase";let t=i?.cost_mode;return t==="use"||t==="purchase"?t:s}function Yo(i){let s=Go(i?.cost);if(s===null)return null;let e=Go(i?.package_size);return e&&e>0?s/e:s}var Go,sr,ai=x(()=>{"use strict";Go=i=>typeof i=="number"&&Number.isFinite(i)?i:null,sr=i=>Math.round(i*100)/100});function Qc(i,s){return typeof i=="number"&&Number.isFinite(i)&&i>=.01?i:s}function nr(i){let s=i.task??null,e=s?fs(s):null,t=e?e.consumesParts:s?.consumes_parts||[],r=!!s?.part_ref,o=i.objects.find(f=>f.entry_id===i.entryId),a=o?.parts||[],c=r?a.find(f=>f.id===s.part_ref.part_id):void 0,u=i.features?i.features.checklists:i.checklistsEnabled??!0,_=i.features?i.features.checklists?i.checklist??s?.checklist??[]:[]:i.checklist??[],m=i.features?i.features.adaptive&&(i.adaptiveEnabled??!!s?.adaptive_config?.enabled):!!i.adaptiveEnabled;return{entry_id:i.entryId,task_id:i.taskId,task_name:i.taskName,checklist:e?u?e.checklist:[]:_,adaptive_enabled:m,required_completion_fields:e?e.requiredFields:s?.required_completion_fields||[],task_type:s?.type||"",reading_unit:s?.reading_unit||"",readings:s?.readings||[],reading_history:Ho(s?.history),parts:r?[]:Vo({consumes_parts:t},i.entryId,i.objects,i.lang),consumes_parts:r?[]:t,phase_label:e?Ue(s):"",require_tag_scan:!!s?.require_tag_scan,restock_default:r?Qc(c?.restock_quantity,1):null,restock_unit_cost:r?c?.cost??null:null,restock_package:r&&c?.package_size?vt(c.package_size,c.unit,i.lang):"",currency_symbol:st({currency_symbol:i.currencySymbol}),consumes_info:t.map(f=>Wo(f,i.entryId,i.objects,i.lang)),checklist_prefill:s?.checklist_progress||{},via_tag_scan:!!i.viaTagScan,parts_cost_mode:r?rr(c,i.partsCostMode??"purchase",!!o?.object.battery_fleet):i.partsCostMode??"purchase",prefill:Yi(s)}}function or(i,s,e){i.entryId=s.entry_id,i.taskId=s.task_id,i.taskName=s.task_name,i.lang=e,i.checklist=s.checklist??[],i.adaptiveEnabled=!!s.adaptive_enabled,i.requiredFields=s.required_completion_fields??[],i.taskType=s.task_type??"",i.readingUnit=s.reading_unit??"",i.readings=s.readings??[],i.readingHistory=s.reading_history??[],i.parts=s.parts??[],i.consumesParts=s.consumes_parts??[],i.phaseLabel=s.phase_label??"",i.requireTagScan=!!s.require_tag_scan,i.restockDefault=s.restock_default??null,i.restockUnitCost=s.restock_unit_cost??null,i.restockPackage=s.restock_package??"",i.currencySymbol=st(s),i.consumesInfo=s.consumes_info??[],i.checklistPrefill=s.checklist_prefill??{},i.viaTagScan=!!s.via_tag_scan,i.partsCostMode=s.parts_cost_mode??"purchase",i.prefill=s.prefill??null,i.open({viaTagScan:!!s.via_tag_scan})}var ar=x(()=>{"use strict";at();ir();tr();P();ai();wt()});function ys(){return window[bs]===!0}function Qo(i){let s=window;if(s[bs]===i)return;s[bs]=i;let e=document.documentElement.style;for(let[t,r]of Object.entries(Jc))i?e.setProperty(t,r):e.removeProperty(t);window.dispatchEvent(new CustomEvent(Zc))}function Xc(i){return!!customElements.get(i)}function se(i){return ys()&&Xc(i)}function Te(i){return ys()?i:void 0}function Se(i){return ys()?p:l`<div class="dialog-title">${i}</div>`}var bs,Zc,Jc,ne=x(()=>{"use strict";I();bs="__msBetaUi",Zc="ms-beta-ui-changed",Jc={"--ms-radius-6":"var(--ha-border-radius-md, 8px)","--ms-radius-10":"var(--ha-border-radius-lg, 12px)"}});function fe(i,s=Ce){return i?i.is_admin?!0:s.operatorWriteEnabled&&s.operatorIds.includes(i.id):!1}var Ce,St=x(()=>{"use strict";Ce={operatorWriteEnabled:!1,operatorIds:[]}});var Zo,Ct,Jo,li,ci,di,xs,We,At,pi=x(()=>{"use strict";Zo={default_warning_days:[0,365],default_consumable_threshold:[1,90],battery_low_percent:[1,90],battery_recovered_percent:[20,100],battery_low_delay_minutes:[0,1440],archive_oneoff_days:[0,3650],delete_archived_oneoff_days:[0,3650],notify_due_soon_interval_hours:[0,720],notify_overdue_interval_hours:[0,720],notify_triggered_interval_hours:[0,720],max_notifications_per_day:[0,1e3],notification_bundle_threshold:[2,20],snooze_duration_hours:[1,168],warranty_reminder_days:[1,365],budget_alert_threshold:[10,100],currency_decimals:[0,3]},Ct=[0,1440],Jo=[1,1e4],li=[0,365],ci=15,di=[.1,.9],xs=[0,365],We=[.01,1e4],At=[.01,1e5]});function td(i){let[s,e]=Zo.default_warning_days,t=i?.general?.default_warning_days,r={...It.features,...i?.features??{}};return{features:r,defaultWarningDays:typeof t=="number"&&Number.isFinite(t)&&t>=s&&t<=e?t:It.defaultWarningDays,rowActionStyle:id(i?.general?.row_action_style,i?.general?.row_action_style_set,r.beta_editor),access:{operatorWriteEnabled:i?.operator_write_enabled===!0,operatorIds:Array.isArray(i?.admin_panel_user_ids)?i.admin_panel_user_ids.filter(o=>typeof o=="string"):[]},budget:i?.budget??null,rowActionNoticePending:i?.general?.row_action_notice_pending===!0,refsInLists:i?.general?.ref_numbers_in_lists===!0,objectsTableColumns:Array.isArray(i?.objects_table_columns)?i.objects_table_columns:void 0,partsCostMode:Ko(i?.budget?.parts_cost_mode),mirrorTodoDefault:Array.isArray(i?.general?.mirror_todo_default_entities)?i.general.mirror_todo_default_entities.filter(o=>typeof o=="string"&&o!==""):[]}}function id(i,s,e){return s===!1&&e?"icons":ed.includes(i??"")?i:It.rowActionStyle}function Xo(){let i=window;return i.__msSettingsCache??={promise:null}}function te(i){let s=Xo();if(s.promise)return s.promise;let e=i.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(t=>{let r=td(t);return Qo(r.features.beta_editor),r}).catch(()=>(s.promise===e&&(s.promise=null),It));return s.promise=e,e}function ea(){Xo().promise=null}var ed,It,Rt=x(()=>{"use strict";ne();St();pi();ai();ed=["buttons_compact","buttons","icons"];It={features:{adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact",access:Ce,budget:null,rowActionNoticePending:!1,refsInLists:!1,objectsTableColumns:void 0,partsCostMode:"purchase",mirrorTodoDefault:[]}});function ui(i){if(i.archived)return"archived";if(i.is_done)return"done";let s=i.status||"ok";return s==="ok"&&i.schedule_type==="manual"&&i.days_until_due==null?"no_due":s}function ws(i,s){return n(nd[i]??i,s)}function Pt(i){let s=ui(i);return s==="done"?rd:s==="no_due"?sd:Ne[s]||"var(--disabled-color, #9e9e9e)"}function od(i){return i==="no_due"?"mdi:calendar-blank-outline":ii[i==="done"?"completed":i]||"mdi:circle-medium"}function ta(i,s,e="pill"){let t=ui(i),r=ws(t,s);return e==="chip"?l`<span class="status-chip ${t}">${r}</span>`:l`<span class="status-badge ${t}" role="img" title="${r}" aria-label="${r}"><ha-icon icon="${od(t)}"></ha-icon><span class="status-label">${r}</span></span>`}var rd,sd,nd,lr=x(()=>{"use strict";I();P();je();rd="var(--maint-done-color, #78909c)",sd="var(--secondary-text-color, #727272)";nd={done:"completed",no_due:"no_due_date"}});function O(i){return i.toFixed(1)}var hi=x(()=>{"use strict";P();Z()});function _i(i,s){let e=i?.states?.[s]?.attributes?.friendly_name;return typeof e=="string"&&e?e:s}function cr(i){return i?Array.isArray(i.entity_ids)&&i.entity_ids.length>0?[...i.entity_ids]:i.entity_id?[i.entity_id]:[]:[]}function ks(i){if(!(!i||i.type==="compound"))return cr(i)[0]}var $s=x(()=>{"use strict"});var Es,ra,sa,Ts=x(()=>{"use strict";Es=["low","normal","high"],ra=[...Es].reverse(),sa=["round_robin","least_completed","random"]});var W,mi=x(()=>{"use strict";I();z();ne();W=class extends T{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}_onHaInput(e){e.stopPropagation(),this.value=e.target.value??"",this.dispatchEvent(new CustomEvent(e.type==="change"?"change":"input",{bubbles:!0,composed:!0,detail:{value:this.value}}))}render(){return!this.multiline&&se("ha-input")?l`
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
        ></ha-input>`:l`
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
    `}};W.styles=$`
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
  `,d([b()],W.prototype,"label",2),d([b()],W.prototype,"value",2),d([b()],W.prototype,"placeholder",2),d([b()],W.prototype,"type",2),d([b({type:Boolean})],W.prototype,"required",2),d([b({type:Boolean})],W.prototype,"disabled",2),d([b()],W.prototype,"step",2),d([b()],W.prototype,"min",2),d([b()],W.prototype,"max",2),d([b()],W.prototype,"pattern",2),d([b()],W.prototype,"helper",2),d([b({type:Boolean})],W.prototype,"multiline",2),d([b({type:Number})],W.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",W)});var Ss,Ot,Cs=x(()=>{"use strict";Ss=["notes","cost","duration","photo","user"],Ot={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"}});function gi(i){if(!i)return[];let s=[],e=i.photo_doc_id;typeof e=="string"&&s.push(e);let t=i.photo_doc_ids;Array.isArray(t)&&s.push(...t);let r=[];for(let o of s){if(typeof o!="string")continue;let a=o.trim();if(!(!a||r.includes(a))&&(r.push(a),r.length>=10))break}return r}var fi=x(()=>{"use strict"});async function ad(i,s,e){let t=i.auth;if(t?.expired&&t.refreshAccessToken)try{await t.refreshAccessToken()}catch{}return fetch(s,{...e,headers:{...e.headers??{},Authorization:`Bearer ${t?.data?.access_token??""}`}})}async function cd(i,s,e,t="doc_too_large",r=[]){let o=await ad(i,s,{method:"POST",body:e});if(o.status===413)throw new Error(t);if(!o.ok){let a=await o.json().catch(()=>null);throw typeof a?.code=="string"&&r.includes(a.code)?new Error(a.code):new Error("doc_upload_failed")}return await o.json()}async function dd(i,s,e,t,r){if(e.size>ld)throw new Error("doc_too_large");let o=new FormData;o.append("entry_id",s);for(let c of t)o.append("tags",c);r&&o.append("purpose",r),o.append("file",e,e.name);let a=await cd(i,"/api/maintenance_supporter/document/upload",o);if(!a.id)throw new Error("doc_upload_failed");return{id:a.id,deduped:!!a.deduped,duplicate_in_object:a.duplicate_in_object??null}}async function oa(i,s,e){return(await dd(i,s,e,["photo"],"completion")).id}async function As(i,s,e){await Promise.all(e.map(t=>i.connection.sendMessagePromise({type:"maintenance_supporter/documents/discard_upload",entry_id:s,doc_id:t}).catch(()=>{})))}var ld,R_,aa=x(()=>{"use strict";fi();ld=100*1024*1024,R_=500*1024*1024});var Nt,Is=x(()=>{"use strict";P();aa();Nt=class{constructor(s,e){this.host=s;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,s.addController(this)}hostConnected(){}get ids(){return this.photos.map(s=>s.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(s){return this.errorKey?n(this.errorKey,s).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(s=[]){this._endSession(),this._revokeAll(),this.photos=s.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(s){if(s.length===0)return;let e=this._session,t=this.opts.hass(),r=this.opts.entryId(),o=s.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let a of o){let c=await oa(t,r,a);if(e!==this._session){As(t,r,[c]);return}this.uploadedIds=[...this.uploadedIds,c],this._uploadEntry.set(c,r),this.photos=[...this.photos,{id:c,preview:URL.createObjectURL(a)}],this.host.requestUpdate()}s.length>o.length&&(this.errorKey="photos_limit")}catch(a){if(e!==this._session)return;this.errorKey=a instanceof Error&&a.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(s){let e=this.photos.find(t=>t.id===s);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(t=>t.id!==s),this.uploadedIds.includes(s)&&(this.uploadedIds=this.uploadedIds.filter(t=>t!==s),this._discard([s])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let s=this.uploadedIds;this.uploadedIds=[],this._discard(s)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(s){let e=new Map;for(let r of s){let o=this._uploadEntry.get(r)??this.opts.entryId();this._uploadEntry.delete(r),e.set(o,[...e.get(o)??[],r])}let t=this.opts.hass();for(let[r,o]of e)As(t,r,o)}_revokeAll(){for(let s of this.photos)s.preview&&URL.revokeObjectURL(s.preview)}}});function lt(i){let s=(i??"").trim();if(s==="")return null;let e=Number(s.replace(",","."));return!Number.isFinite(e)||e<0?null:Math.round(e)}var dr=x(()=>{"use strict"});function pd(i){let e=D("2001-02-03",i).match(/\d+/g)||[],t=c=>e.findIndex(u=>Number(u)===c),r=t(2001),o=t(2),a=t(3);return r===0?"YMD":o>=0&&a>=0&&o<a?"MDY":"DMY"}function jt(i,s,e){if(i<1e3||i>9999||s<1||s>12||e<1||e>31)return null;let t=new Date(i,s-1,e);return t.getFullYear()!==i||t.getMonth()!==s-1||t.getDate()!==e?null:`${i}-${String(s).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function la(i,s){let e=i.trim(),t;if(t=e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))return jt(+t[1],+t[2],+t[3]);if(t=e.match(/^(\d{4})$/))return jt(+t[1],1,1);if(t=e.match(/^(\d{1,2})[./](\d{4})$/))return jt(+t[2],+t[1],1);if(t=e.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))return jt(+t[3],+t[2],+t[1]);if(t=e.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)){let r=+t[1],o=+t[2],a=+t[3];return pd(s)==="MDY"?jt(a,r,o):jt(a,o,r)}return null}var ca=x(()=>{"use strict";P()});function ud(i,s){if(s)switch(i){case"date":return s.split("T")[0];case"time":return s.length===5?`${s}:00`:s;case"datetime":{let[e,t="00:00:00"]=s.split("T");return`${e} ${t.length===5?`${t}:00`:t}`}}}function hd(i,s){if(typeof s!="string"||!s)return"";switch(i){case"date":return s.slice(0,10);case"time":return s.slice(0,5);case"datetime":{let[e,t="00:00:00"]=s.split(" ");return`${e}T${t.length===5?`${t}:00`:t}`}}}var V,Dt=x(()=>{"use strict";I();z();P();ca();V=class extends T{constructor(){super(...arguments);this.kind="date";this.label="";this.value="";this.clearable=!1;this.disabled=!1;this.required=!1;this.lang="en";this._typing=!1;this._typed="";this._typedInvalid=!1}_startTyping(){this._typed=this.value,this._typedInvalid=!1,this._typing=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input.typed")?.focus())}_commitTyped(){if(!this._typed.trim()){this._typing=!1;return}let e=la(this._typed,this.lang);if(!e){this._typedInvalid=!0;return}this._typing=!1,this._typedInvalid=!1,this._emit(e)}_onTypedKey(e){e.key==="Enter"?(e.preventDefault(),this._commitTyped()):e.key==="Escape"&&(e.preventDefault(),this._typing=!1,this._typedInvalid=!1)}_selector(){switch(this.kind){case"date":return{date:{}};case"time":return{time:{no_second:!0}};case"datetime":return{datetime:{}}}}_onSelectorChange(e){e.stopPropagation(),this._emit(hd(this.kind,e.detail?.value))}_clear(){this._emit("")}_emit(e){e!==this.value&&(this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}})))}render(){return l`
      <div class="field">
        ${this.label?l`<span class="label">${this.label}${this.required?l`<span class="req">*</span>`:p}</span>`:p}
        <div class="row">
          ${this._typing?l`<input class="typed" type="text" inputmode="numeric" autocomplete="off"
                .value=${this._typed}
                placeholder=${D("1978-03-15",this.lang)}
                aria-invalid=${this._typedInvalid?"true":"false"}
                @input=${e=>{this._typed=e.target.value,this._typedInvalid=!1}}
                @keydown=${this._onTypedKey}
                @blur=${this._commitTyped} />`:l`<ha-selector
                .hass=${this.hass}
                .selector=${this._selector()}
                .value=${ud(this.kind,this.value)}
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
    `}};V.styles=$`
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
  `,d([b({attribute:!1})],V.prototype,"hass",2),d([b()],V.prototype,"kind",2),d([b()],V.prototype,"label",2),d([b()],V.prototype,"value",2),d([b()],V.prototype,"helper",2),d([b({type:Boolean})],V.prototype,"clearable",2),d([b({type:Boolean})],V.prototype,"disabled",2),d([b({type:Boolean})],V.prototype,"required",2),d([b()],V.prototype,"lang",2),d([h()],V.prototype,"_typing",2),d([h()],V.prototype,"_typed",2),d([h()],V.prototype,"_typedInvalid",2);customElements.get("ms-date-field")||customElements.define("ms-date-field",V)});var Ve,pr=x(()=>{"use strict";I();z();P();Ve=class extends T{constructor(){super(...arguments);this.value="";this.lang="en";this._credit=!1;this._amount=""}willUpdate(e){if(!e.has("value"))return;let t=(this.value??"").trim();if(t===this._signed())return;let r=parseFloat(t);if(t===""||Number.isNaN(r)){this._amount="",this._credit=!1;return}this._credit=r<0,this._amount=String(Math.abs(r))}_signed(){let e=this._amount.trim();return e===""?"":this._credit?`-${e}`:e}_emit(){this.value=this._signed(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setCredit(e){this._credit!==e&&(this._credit=e,this._emit())}_onInput(e){let t=e.target.value;t.startsWith("-")&&(this._credit=!0),this._amount=t.replace(/^-+/,""),this._emit()}render(){let e=this.lang;return l`
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
    `}};Ve.styles=[Fe,$`
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
    `],d([b()],Ve.prototype,"value",2),d([b()],Ve.prototype,"lang",2),d([h()],Ve.prototype,"_credit",2),d([h()],Ve.prototype,"_amount",2);customElements.get("ms-cost-input")||customElements.define("ms-cost-input",Ve)});function ur(){if(window.externalApp!==void 0)return!0;let s=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(s)&&/Android/.test(s)}var Rs=x(()=>{"use strict"});var X_,hr,_d,da,Ps=x(()=>{it();({I:X_}=Sn),hr=i=>i.strings===void 0,_d={},da=(i,s=_d)=>i._$AH=s});var Ae,vi,qt,bi=x(()=>{Ae={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},vi=i=>(...s)=>({_$litDirective$:i,values:s}),qt=class{constructor(s){}get _$AU(){return this._$AM._$AU}_$AT(s,e,t){this._$Ct=s,this._$AM=e,this._$Ci=t}_$AS(s,e){return this.update(s,e)}update(s,e){return this.render(...e)}}});function md(i){this._$AN!==void 0?(_r(this),this._$AM=i,pa(this)):this._$AM=i}function gd(i,s=!1,e=0){let t=this._$AH,r=this._$AN;if(r!==void 0&&r.size!==0)if(s)if(Array.isArray(t))for(let o=e;o<t.length;o++)yi(t[o],!1),_r(t[o]);else t!=null&&(yi(t,!1),_r(t));else yi(this,i)}var yi,_r,pa,fd,mr,ua=x(()=>{Ps();bi();bi();yi=(i,s)=>{let e=i._$AN;if(e===void 0)return!1;for(let t of e)t._$AO?.(s,!1),yi(t,s);return!0},_r=i=>{let s,e;do{if((s=i._$AM)===void 0)break;e=s._$AN,e.delete(i),i=s}while(e?.size===0)},pa=i=>{for(let s;s=i._$AM;i=s){let e=s._$AN;if(e===void 0)s._$AN=e=new Set;else if(e.has(i))break;e.add(i),fd(s)}};fd=i=>{i.type==Ae.CHILD&&(i._$AP??=gd,i._$AQ??=md)},mr=class extends qt{constructor(){super(...arguments),this._$AN=void 0}_$AT(s,e,t){super._$AT(s,e,t),pa(this),this.isConnected=s._$AU}_$AO(s,e=!0){s!==this.isConnected&&(this.isConnected=s,s?this.reconnected?.():this.disconnected?.()),e&&(yi(this,s),_r(this))}setValue(s){if(hr(this._$Ct))this._$Ct._$AI(s,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=s,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}});var Os,Mt,ha=x(()=>{it();ua();bi();Os=new WeakMap,Mt=vi(class extends mr{render(i){return p}update(i,[s]){let e=s!==this.G;return e&&this.G!==void 0&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=s,this.ht=i.options?.host,this.rt(this.ct=i.element)),p}rt(i){if(this.isConnected||(i=void 0),typeof this.G=="function"){let s=this.ht??globalThis,e=Os.get(s);e===void 0&&(e=new WeakMap,Os.set(s,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,i),i!==void 0&&this.G.call(this.ht,i)}else this.G.value=i}get lt(){return typeof this.G=="function"?Os.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}})});var gr=x(()=>{ha()});function vd(i){!(i instanceof HTMLElement)||typeof i.showPopover!="function"||queueMicrotask(()=>{if(!(!i.isConnected||i.matches(":popover-open")))try{i.showPopover()}catch{}})}var fr,vr,Ns=x(()=>{"use strict";I();gr();fr=Mt(vd),vr=$`
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
`});function xi(i){try{return localStorage.getItem(i)}catch{return null}}function wi(i,s){try{localStorage.setItem(i,s)}catch{}}var Ge,js=x(()=>{"use strict";Ge={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraLabel:"msp-camera-label",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort",areaSort:"msp-area-sort",objectTreeOpen:"msp-object-tree-open",objectTableSort:"msp-object-table-sort",filterPane:"msp-filter-pane"}});function ue(i,s){return se("ha-expansion-panel")?l`
      <ha-expansion-panel class=${i.cls??""} outlined .expanded=${!!i.open}
        @expanded-changed=${e=>{e.target===e.currentTarget&&i.onToggle?.(e.detail.expanded)}}>
        <div slot="header" class=${i.headerCls??"collapsible-header"}>${i.header}</div>
        ${s}
      </ha-expansion-panel>`:l`<details class=${i.cls??""} ?open=${!!i.open}
    @toggle=${i.onToggle?e=>i.onToggle(e.target.open):p}><summary class=${i.headerCls??p}>${i.header}</summary>${s}</details>`}var br=x(()=>{"use strict";I();ne()});function ba(){if(!ur())return!1;let i=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!i&&typeof i.getUserMedia=="function"}function ga(i){let s=/camera2?\s*(\d+)/i.exec(i);return s?Number(s[1]):Number.MAX_SAFE_INTEGER}function fa(i,s){if(s){let t=i.find(r=>r.label===s);if(t)return t}return i.filter(t=>t.label&&ya.test(t.label)).sort((t,r)=>ga(t.label)-ga(r.label))[0]??null}var bd,yd,xd,wd,_a,ya,ma,va,kd,oe,Ds=x(()=>{"use strict";I();z();P();Rs();Ns();js();br();bd=1920,yd=.88,xd={retryMs:500,windowMs:5e3},wd=new Set(["NotReadableError","AbortError","TrackStartError"]),_a=80,ya=/back|rear|environment|rück|hinten/i,ma=/front|user|selfie|vorne/i;va=i=>i?.name||"Error",kd=i=>i?.message||"",oe=class extends T{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...xd};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let r=xi(Ge.cameraLabel),o=await this._enumerate(t);if(!this._live(e))return;let a=fa(o,r),c="refused";if(a&&(c=await this._openPatiently(t,e,this._byDevice(a))),c==="cancelled")return;if(c!=="ok"){if(c=await this._openPatiently(t,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),c==="cancelled")return;if(c!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(o=await this._enumerate(t),!this._live(e)){this._stopStream();return}}if(this._devices=o,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let u=a?null:fa(o,r),_=this._deviceIndex>=0?o[this._deviceIndex]:void 0;if(!u||u.deviceId===_?.deviceId)return;let m=await this._replace(t,e,[this._byDevice(u)],this._restoreCandidates(_));if(m!=="cancelled"){if(m==="lost"){this._unavailable("camera_lost");return}this._settle(m)}}async _openPatiently(e,t,r){let o=Date.now();for(;;){let a;try{a=await e.getUserMedia({video:r.video,audio:!1})}catch(c){let u=va(c),_=kd(c);if(this._lastError=u,this._note(`${r.what} \u2192 ${u}${_&&_!==u?`: ${_}`:""}`),!this._live(t))return"cancelled";if(!wd.has(u))return"refused";if(Date.now()-o+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(m=>setTimeout(m,this.timing.retryMs)),!this._live(t))return"cancelled";continue}if(!this._live(t)){for(let c of a.getTracks())c.stop();return"cancelled"}return this._stream=a,this._note(`${r.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,t,r,o){this._switching=!0,this._stopStream();try{for(let a of r){let c=await this._openPatiently(e,t,a);if(c==="ok")return a;if(c==="cancelled")return c;if(c==="busy"){a.deviceId&&this._refused.add(a.deviceId);break}}for(let a of o){let c=await this._openPatiently(e,t,a);if(c==="ok")return"restored";if(c==="cancelled")return c}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let r=this._indexOfCurrent();return r>=0&&(this._deviceIndex=r),this._attach(),!1}this._switchFailed=!1;let t=e.deviceId?this._devices.findIndex(r=>r.deviceId===e.deviceId):-1;return this._deviceIndex=t>=0?t:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,t){let r=[],o=e?.deviceId||t;return o&&r.push({video:{deviceId:{exact:o}},what:`${e?.label||"previous camera"} (back again)`,deviceId:o}),r.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),r}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let t=(await e.enumerateDevices()).filter(r=>r.kind==="videoinput"&&!!r.deviceId);return this._note(`cameras: ${t.map(r=>r.label||"(no label)").join(" | ")||"none listed"}`),t}catch(t){return this._note(`enumerateDevices \u2192 ${va(t)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let t=e.getSettings().deviceId,r=t?this._devices.findIndex(o=>o.deviceId===t):-1;return r>=0?r:e.label?this._devices.findIndex(o=>o.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],t=e?.getSettings().facingMode;if(t==="user"||t==="environment")return t;let r=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return ma.test(r)?"user":ya.test(r)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let t=e.getSettings(),r=t.width&&t.height?`${t.width}\xD7${t.height}`:"size ?";return[e.label||"no label",r,t.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>_a&&this._log.splice(1,this._log.length-_a)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let t=this._gen,r=this._deviceIndex,o=r>=0?this._devices[r]:void 0,a=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||o?.deviceId,c=this._facing==="user"?"environment":"user",u=this._nextCameras(r,a);!u.length&&this._refused.size&&(this._refused.clear(),u=this._nextCameras(r,a)),this._note(`switch from ${o?.label||"unknown camera"}`);let _=[...u.map(m=>this._byDevice(this._devices[m])),{video:{facingMode:{exact:c}},what:`facing ${c} (exact)`},{video:{facingMode:{ideal:c}},what:`facing ${c}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let m=await this._replace(e,t,_,this._restoreCandidates(o,a));if(m==="cancelled")return;if(m==="lost"){this._unavailable("camera_lost");return}if(m!=="restored"&&!m.deviceId){if(this._isCamera(a,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=c}if(this._settle(m)&&m!=="restored"&&m.deviceId){let f=this._devices[this._deviceIndex]?.label??"";f&&wi(Ge.cameraLabel,ma.test(f)?"":f)}}finally{this._busy=!1}}_nextCameras(e,t){let r=this._devices.length,o=[];for(let a=1;a<=(e<0?r:r-1);a++){let c=(e+a)%r,u=this._devices[c].deviceId;u===t||this._refused.has(u)||o.push(c)}return o}_isCamera(e,t){let r=this._stream?.getVideoTracks()[0]?.getSettings();return e&&r?.deviceId?r.deviceId===e:!!r?.facingMode&&r.facingMode===t}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let t of this._stream?.getTracks()??[])t.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),t=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),t=!0)}catch{}if(!t){let r=this.shadowRoot?.querySelector(".details textarea");if(r){r.focus(),r.select();try{t=document.execCommand("copy")}catch{t=!1}}}this._copied=t}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let t=e.videoWidth||640,r=e.videoHeight||480,o=Math.min(1,bd/Math.max(t,r)),a=document.createElement("canvas");a.width=Math.round(t*o),a.height=Math.round(r*o);let c=a.getContext("2d");if(!c)throw new Error("no_canvas");c.drawImage(e,0,0,a.width,a.height);let u=await new Promise(f=>a.toBlob(f,"image/jpeg",yd));if(!u)throw new Error("no_blob");let _=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),m=new File([u],`photo-${_}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:m},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return p;let e=this.lang,t=this._busy||this._switching;return l`
      <div class="overlay top-layer" popover="manual" ${fr} role="dialog" aria-modal="true" aria-label=${n("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switching?l`<div class="switching" role="status">${n("camera_switching",e)}</div>`:p}
        ${this._switchFailed?l`<div class="switch-note" role="status">
              <div>${n("camera_not_answered",e)}</div>
              ${ue({cls:"details",header:n("camera_diagnostics",e)},l`
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${n(this._copied?"camera_copied":"camera_copy",e)}</button>
              `)}
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
    `}};oe.styles=[vr,$`
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
  `],d([b({type:String})],oe.prototype,"lang",2),d([h()],oe.prototype,"_open",2),d([h()],oe.prototype,"_busy",2),d([h()],oe.prototype,"_switching",2),d([h()],oe.prototype,"_devices",2),d([h()],oe.prototype,"_deviceIndex",2),d([h()],oe.prototype,"_switchFailed",2),d([h()],oe.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",oe)});var yr,ae,ki=x(()=>{"use strict";I();z();P();Rs();Ds();Ds();yr=$`
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
`,ae=class extends T{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=ur();this._inAppCamera=ba()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target,r=Array.from(t.files??[]);t.value="",this._emit(r)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return p;let e=this.lang,t=this._locked?"disabled":"",r=this.busy?n("uploading",e):n("doc_camera",e),o=n(this._singlePick?"choose_photo":"choose_photos",e);return l`
      <div class="photo-pickers">
        ${this.showCamera?l`<label class="photo-pick photo-pick-camera ${t}" role="button" tabindex="0"
              aria-label=${r} title=${this.compact?r:p}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?p:l`<span>${r}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
        ${this.showGallery?l`<label class="photo-pick photo-pick-gallery ${t}" role="button" tabindex="0"
              aria-label=${o} title=${this.compact?o:p}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?p:l`<span>${o}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:p}
      </div>
      ${this.showGallery&&this._singlePick?l`<div class="photo-android-hint">${n("photos_android_hint",e)}</div>`:p}
      ${this.showCamera&&this._inAppCamera?l`<ms-camera-capture .lang=${e}
            @photo-captured=${a=>this._emit([a.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:p}
    `}};d([b({type:String})],ae.prototype,"lang",2),d([b({type:Boolean})],ae.prototype,"disabled",2),d([b({type:Boolean})],ae.prototype,"busy",2),d([b({type:String})],ae.prototype,"accept",2),d([b({type:Boolean})],ae.prototype,"showCamera",2),d([b({type:Boolean})],ae.prototype,"showGallery",2),d([b({type:Boolean})],ae.prototype,"compact",2),d([b({type:Number})],ae.prototype,"remaining",2),d([h()],ae.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",ae)});function U(i,s){return se("ha-alert")?l`<ha-alert alert-type=${i} class="notice notice-${i}">${s}</ha-alert>`:l`<div class=${i==="warning"?"error warning":"error"}>${s}</div>`}var Ke=x(()=>{"use strict";I();ne()});function j(i,s){if(se("ha-checkbox")){let t=l`<ha-checkbox .checked=${i.checked} .disabled=${!!i.disabled} @change=${i.onChange}>${s}</ha-checkbox>`;return i.cls?l`<span class=${i.cls}>${t}</span>`:t}let e=l`<input type="checkbox" class=${i.inputCls??p} .checked=${i.checked} ?disabled=${!!i.disabled} @change=${i.onChange} />`;return i.boxAfter?l`<label class=${i.cls??p}>${s}${e}</label>`:l`<label class=${i.cls??p}>${e}${s}</label>`}var $i=x(()=>{"use strict";I();ne()});var Ht,C,qs=x(()=>{"use strict";I();z();at();P();me();xt();Z();pi();ir();ai();Cs();Is();dr();Dt();pr();ki();ki();ne();Ke();$i();Ht=We,C=class extends T{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new Nt(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={};this.prefill=null}open(e={}){if(this._open)return;this._open=!0,this.viaTagScan=!!e.viaTagScan;let t=this.prefill;this._notes=t?.notes??"",this._cost=t?.cost!=null?String(t.cost):"",this._duration=t?.duration!=null?String(t.duration):"",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((r,o)=>[String(o),!!this.checklistPrefill[r]]).filter(([,r])=>r)),this._feedback=t?.feedback??"needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(r=>[ge(r),{...r}])),this._usedQtyText={}}_rangeError(e,t){let r=this.lang;return n("settings_value_out_of_range",r).replace("{min}",S(e,r,{maximumFractionDigits:2})).replace("{max}",S(t,r,{maximumFractionDigits:2}))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId},t=this._notes.trim();if(t&&(e.notes=t),this._cost){let u=parseFloat(this._cost);isNaN(u)||(e.cost=u)}let r=lt(this._duration);if(r!==null&&(e.duration=r),this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(Y(this._completedAt)>Date.now()){this._error=n("completed_at_future_error",this.lang);return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let u={};for(let _ of this.readings){let m=(this._readingValues[_.id]??"").trim();if(m==="")continue;let f=parseFloat(m.replace(",","."));isNaN(f)||(u[_.id]=f)}Object.keys(u).length>0&&(e.reading_values=u)}else if(this._readingValue!==""){let u=parseFloat(this._readingValue);isNaN(u)||(e.reading_value=u)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let u=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(u)||u<At[0]||u>At[1]){this._error=this._rangeError(...At);return}e.restock_quantity=u}if(this.parts.length>0){let u=[];for(let[_,m]of Object.entries(this._usedParts)){let f=this._usedQtyText[_],v=f===void 0?m.quantity:parseFloat(f.replace(",","."));if(!Number.isFinite(v)||v<Ht[0]||v>Ht[1]){this._error=this._rangeError(...Ht);return}u.push({...m,quantity:v})}e.used_parts=u.map(_=>_.entry_id?{part_id:_.part_id,quantity:_.quantity,entry_id:_.entry_id}:{part_id:_.part_id,quantity:_.quantity})}let o=await L(this,e,{busy:u=>{this._loading=u},lang:this.lang,fallbackKey:"save_error",onError:u=>{this._error=u}});if(o===void 0)return;let a=Ki(o,this.lang);if(a){this._close(),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:a},bubbles:!0,composed:!0}));return}this._photos.markAttached(),this._open=!1;let c={entryId:this.entryId,taskId:this.taskId,taskName:this.taskName,undo:o?.undo===!0};this.dispatchEvent(new CustomEvent("task-completed",{detail:c}))}_renderReadingField(e,t){let r=this._completedAt?Y(this._completedAt):NaN,o=Lo(this.readingHistory,e.id,isNaN(r)?void 0:r),a=e.unit||this.readingUnit,c=(this._readingValues[e.id]??"").trim(),u=c===""?NaN:parseFloat(c.replace(",",".")),_=o!==void 0&&!isNaN(u)&&u<o.value,m=o!==void 0?S(o.value,t,{maximumFractionDigits:3}):"";return l`
      <label class="field reading-field">
        <span class="field-label">${e.name}${a?` (${a})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${o!==void 0?n("reading_last",t).replace("{value}",m):""}
          .value=${this._readingValues[e.id]??""}
          @input=${f=>{this._readingValues={...this._readingValues,[e.id]:f.target.value}}} />
        ${_?l`<span class="reading-warn">${n("reading_below_last",t).replace("{value}",m)}</span>`:p}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_demands(e){return this.requiredFields.includes(e)}_req(e){return this._demands(e)?l`<span class="req-mark" aria-hidden="true">*</span>`:p}_purchaseSuggestion(){if(this.restockDefault===null)return null;let e=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(e)||e<=0?null:sr(this.restockUnitCost*e)}_partsValues(){let e={booked:null,info:null};if(this.restockDefault!==null||!this.parts.length)return e;for(let t of Object.values(this._usedParts)){let r=this.parts.find(c=>ge({part_id:c.id,entry_id:c.entry_id})===ge(t)),o=Yo(r);if(o===null)continue;let a=rr(r,this.partsCostMode)==="use"?"booked":"info";e[a]=(e[a]??0)+o*(t.quantity||1)}for(let t of["booked","info"])e[t]!==null&&(e[t]=sr(e[t]));return e}_renderCostSuggestion(e){let t=this._purchaseSuggestion();if(this.restockDefault!==null){let c=this.partsCostMode==="use"?l`<div class="cost-note">${n("cost_purchase_use_hint",e)}</div>`:p;if(this._cost.trim()!==""||t==null||t<=0)return c;let u=X(t,this.currencySymbol,e);return l`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(sr(t))}
        >${n("cost_from_parts",e).replace("{amount}",u)}</button>${c}`}let{booked:r,info:o}=this._partsValues(),a=(c,u)=>c!=null&&c>0?l`<div class="cost-note">${n(u,e).replace("{amount}",X(c,this.currencySymbol,e))}</div>`:p;return l`${a(r,"cost_parts_booked")}${a(o,"cost_parts_info")}`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=`${Kn()}:00`}render(){if(!this._open)return l``;let e=this.lang||N(this.hass),t=this._error||this._photos.errorText(e);return l`
      <ha-dialog open .headerTitle=${Te(`${n("complete_title",e)}${this.taskName}`)} @closed=${this._close}>
        ${Se(`${n("complete_title",e)}${this.taskName}`)}
        ${this.phaseLabel?l`<div class="phase-line">${n("phase_current",e)}: ${this.phaseLabel}</div>`:p}
        ${this.requireTagScan&&!this.viaTagScan?l`<div class="scan-required-note">${n("require_tag_scan_hint",e)}</div>`:p}
        <div class="content">
          ${t?U("error",t):p}
          ${this.checklist.length>0?l`
            <div class="checklist-section">
              <label class="checklist-label">${n("checklist",e)}</label>
              ${this.checklist.map((r,o)=>l`
                ${j({cls:"checklist-item",checked:!!this._checklistState[String(o)],onChange:()=>this._toggleCheck(o)},l`<span>${r}</span>`)}
              `)}
            </div>
          `:p}
          ${this.readings.length>0?l`<div class="readings-block">
                <span class="field-label">${n("readings_section",e)}</span>
                ${this.readings.map(r=>this._renderReadingField(r,e))}
              </div>`:this.taskType==="reading"?l`
              <label class="field">
                <span class="field-label">${n("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${r=>this._readingValue=r.target.value} />
              </label>`:p}
          ${this.parts.length?l`<div class="used-parts">
                <span class="field-label">${n("complete_parts_used",e)}</span>
                ${this.parts.map(r=>{let o=ge({part_id:r.id,entry_id:r.entry_id}),a=this._usedParts[o],c=a!==void 0,u=r.entry_id?{part_id:r.id,quantity:1,entry_id:r.entry_id}:{part_id:r.id,quantity:1};return l`<div class="used-part-row">
                    ${j({cls:"used-part-check",checked:c,onChange:_=>{let m={...this._usedParts};if(_.target.checked)m[o]=m[o]||u;else{delete m[o];let f={...this._usedQtyText};delete f[o],this._usedQtyText=f}this._usedParts=m}},l`<span
                        >${r.name}${r.owner_name?l`<span class="used-part-owner"> (${r.owner_name})</span>`:p}${r.stock!==null&&r.stock!==void 0?` (${vt(r.stock,r.unit,e)})`:""}</span
                      >`)}
                    ${c?l`<input class="used-part-qty" type="number" min=${Ht[0]} max=${Ht[1]} step="0.01"
                          .value=${this._usedQtyText[o]??String(a.quantity)}
                          @input=${_=>{let m=_.target.value;this._usedQtyText={...this._usedQtyText,[o]:m};let f=parseFloat(m.replace(",","."));Number.isFinite(f)&&f>=Ht[0]&&(this._usedParts={...this._usedParts,[o]:{...u,quantity:f}})}} />`:p}
                  </div>`})}
              </div>`:this.consumesInfo.length?l`<div class="consumes-hint">
                  ${this.consumesInfo.map(r=>l`<div>${r}</div>`)}
                </div>`:p}
          ${this.restockDefault!==null?l`
              <label class="field">
                <span class="field-label">${n("restock_quantity_label",e)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
                <input type="number" step="0.01" min=${At[0]} max=${At[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${r=>this._restockQty=r.target.value} />
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
              @input=${r=>this._notes=r.target.value}></textarea>
          </label>
          <div class="field">
            <span class="field-label">${this._demands("cost")?n("cost",e):n("cost_optional",e)}${this._req("cost")}</span>
            <ms-cost-input .lang=${e} .value=${this._cost}
              @value-changed=${r=>this._cost=r.detail.value}></ms-cost-input>
            ${this._renderCostSuggestion(e)}
          </div>
          <label class="field">
            <span class="field-label">${this._demands("duration")?n("quick_complete_defaults_duration",e):n("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="1" min="0" inputmode="numeric" class="field-input"
              .value=${this._duration}
              @input=${r=>this._duration=r.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${n("completed_at_optional",e)}</span>
            ${this._completedAt?l`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  .helper=${Vi(e)}
                  @value-changed=${r=>this._completedAt=r.detail.value}
                ></ms-date-field>`:l`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${n("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${this._demands("photo")?n("completion_photos",e):n("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?l`<div class="photo-strip">
                  ${this._photos.photos.map(r=>l`
                    <div class="photo-preview">
                      <img src=${r.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(r.id)}
                        title="${n("remove",e)}">✕</button>
                    </div>`)}
                </div>`:p}
            ${this._photos.full?l`<div class="photo-limit">${n("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:l`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${r=>this._photos.addFiles(r.detail.files)}
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
            title=${this._photos.uploading?n("uploading",e):this._missingRequired.length?this._missingRequired.map(r=>n("err_required",e).replace("{field}",n(Ot[r]??r,e))).join(" \xB7 "):""}
          >
            ${this._loading?n("completing",e):n("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};C.styles=[Fe,yr,$`
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
  `],d([b({attribute:!1})],C.prototype,"hass",2),d([b()],C.prototype,"entryId",2),d([b()],C.prototype,"taskId",2),d([b()],C.prototype,"taskName",2),d([b()],C.prototype,"lang",2),d([b({type:Array})],C.prototype,"checklist",2),d([b({type:Boolean})],C.prototype,"adaptiveEnabled",2),d([b()],C.prototype,"taskType",2),d([b()],C.prototype,"readingUnit",2),d([b({attribute:!1})],C.prototype,"readings",2),d([b({attribute:!1})],C.prototype,"readingHistory",2),d([b({attribute:!1})],C.prototype,"restockDefault",2),d([b({attribute:!1})],C.prototype,"restockUnitCost",2),d([b({attribute:!1})],C.prototype,"restockPackage",2),d([b()],C.prototype,"currencySymbol",2),d([b({attribute:!1})],C.prototype,"partsCostMode",2),d([b({attribute:!1})],C.prototype,"parts",2),d([b({attribute:!1})],C.prototype,"consumesParts",2),d([b({type:Array})],C.prototype,"consumesInfo",2),d([b({type:Array})],C.prototype,"requiredFields",2),d([b()],C.prototype,"phaseLabel",2),d([b({type:Boolean})],C.prototype,"requireTagScan",2),d([b({type:Boolean})],C.prototype,"viaTagScan",2),d([h()],C.prototype,"_open",2),d([h()],C.prototype,"_notes",2),d([h()],C.prototype,"_cost",2),d([h()],C.prototype,"_duration",2),d([h()],C.prototype,"_loading",2),d([h()],C.prototype,"_error",2),d([h()],C.prototype,"_checklistState",2),d([h()],C.prototype,"_feedback",2),d([h()],C.prototype,"_readingValue",2),d([h()],C.prototype,"_readingValues",2),d([h()],C.prototype,"_restockQty",2),d([h()],C.prototype,"_completedAt",2),d([h()],C.prototype,"_usedParts",2),d([h()],C.prototype,"_usedQtyText",2),d([b({attribute:!1})],C.prototype,"checklistPrefill",2),d([b({attribute:!1})],C.prototype,"prefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",C)});function wa(i){return i.object.parent_entry_id||null}function ka(i){return!i.object.archived&&!i.object.battery_fleet}function $d(i,s){let e=new Map(i.map(a=>[a.entry_id,a])),t=[],r=new Set([s]),o=e.get(s);for(;o;){let a=wa(o);if(!a||r.has(a))break;let c=e.get(a);if(!c)break;r.add(a),t.unshift(c),o=c}return t}function $a(i,s){return[...$d(i,s.entry_id),s].map(e=>e.object.name).join(" \u203A ")}function Ea(i,s){let e=new Map;for(let o of i){let a=wa(o);a&&(e.has(a)||e.set(a,[]),e.get(a).push(o.entry_id))}let t=new Set,r=[...e.get(s)??[]];for(;r.length;){let o=r.pop();o===s||t.has(o)||(t.add(o),r.push(...e.get(o)??[]))}return t}var Ta=x(()=>{"use strict"});var q,Sa=x(()=>{"use strict";I();z();P();me();Ta();mi();Dt();ne();Ke();q=class extends T{constructor(){super(...arguments);this.objects=[];this.placesEnabled=!1;this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._place="";this._remindOnSite=!1;this._entryId=null;this._replacing=!1;this._oldDeviceId="";this._replaceDevice="keep"}get _lang(){return N(this.hass)}openCreate(e=""){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId=e,this._place="",this._remindOnSite=!1,this._replacing=!1,this._error="",this._open=!0}openReplace(e,t){this._entryId=e,this._replacing=!0,this._name=t.name||"",this._oldDeviceId=t.ha_device_id||"",this._haDeviceId="",this._replaceDevice="keep",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._haDeviceId=t.ha_device_id||"",this._parentEntryId=t.parent_entry_id||"",this._place=t.place||"",this._remindOnSite=!!t.remind_on_site,this._replacing=!1,this._error="",this._open=!0}async _replace(){if(this._loading||!this._entryId)return;let e={type:"maintenance_supporter/object/replace",entry_id:this._entryId,name:this._name.trim()||null};this._oldDeviceId?(this._replaceDevice==="other"&&(e.ha_device_id=this._haDeviceId),this._replaceDevice==="none"&&(e.ha_device_id=null)):this._haDeviceId&&(e.ha_device_id=this._haDeviceId);let t=await L(this,e,{busy:r=>{this._loading=r},fallbackKey:"save_error",onError:r=>{this._error=r}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-replaced",{detail:{entry_id:t?.entry_id,device_swap:t?.device_swap}})))}_deviceName(e){let r=this.hass?.devices?.[e];return r?.name_by_user||r?.name||e}_deviceSelector(e){return l`<ha-form
      .hass=${this.hass}
      .data=${{device:this._haDeviceId||void 0}}
      .schema=${[{name:"device",selector:{device:{}}}]}
      .computeLabel=${()=>e}
      @value-changed=${t=>this._haDeviceId=t.detail.value?.device||""}
    ></ha-form>`}_renderReplace(){let e=this._lang,t=(o,a)=>l`<label class="radio-row">
      <input
        type="radio"
        name="replace-device"
        .checked=${this._replaceDevice===o}
        @change=${()=>{this._replaceDevice=o}}
      />
      <span>${a}</span>
    </label>`,r=this._replaceDevice==="other"&&!this._haDeviceId;return l`
      <ha-dialog open .headerTitle=${Te(n("replace_object",e))} @closed=${this._close}>
        ${Se(n("replace_object",e))}
        <div class="content">
          ${this._error?U("error",this._error):p}
          <div class="hint">${n("replace_object_prompt",e)}</div>
          <ms-textfield
            label="${n("replace_name_label",e)}"
            .value=${this._name}
            @input=${o=>this._name=o.target.value}
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
          <ha-button @click=${this._replace} .disabled=${this._loading||r}>
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
        @value-changed=${r=>{this._place=r.detail.value?.place||"",this._place||(this._remindOnSite=!1)}}
      ></ha-form>
      ${t?l`<div class="place-missing">${n("place_missing",e)}</div>`:p}
      <label class="place-on-site ${this._place?"":"disabled"}">
        <input
          type="checkbox"
          .checked=${this._remindOnSite}
          ?disabled=${!this._place}
          @change=${r=>this._remindOnSite=r.target.checked}
        />
        <span>${n("remind_on_site",e)}</span>
      </label>
      ${this._place?l`<div class="place-hint">${n("remind_on_site_hint",e)}</div>`:p}
    `}async _save(){if(this._loading||!this._name.trim())return;this._error="";let e={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null,...this.placesEnabled?{place:this._place||null,remind_on_site:!!this._place&&this._remindOnSite}:{}},t=await L(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...e}:{type:"maintenance_supporter/object/create",...e},{busy:r=>{this._loading=r},fallbackKey:"save_error",onError:r=>{this._error=r}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved",{detail:{device_swap:t?.device_swap}})))}_parentChoices(){let e=this.objects||[],t=this._entryId?Ea(e,this._entryId):new Set;return e.filter(r=>r.entry_id!==this._entryId&&!t.has(r.entry_id)&&(ka(r)||r.entry_id===this._parentEntryId)).map(r=>({entryId:r.entry_id,label:$a(e,r)})).sort((r,o)=>r.label.localeCompare(o.label))}_close(){this._open=!1}render(){if(!this._open)return l``;if(this._replacing)return this._renderReplace();let e=this._lang,t=this._entryId?n("edit_object",e):n("new_object",e);return l`
      <ha-dialog open .headerTitle=${Te(t)} @closed=${this._close}>
        ${Se(t)}
        <div class="content">
          ${this._error?U("error",this._error):p}
          <ms-textfield
            label="${n("name",e)}"
            required
            .value=${this._name}
            @input=${r=>this._name=r.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${r=>this._manufacturer=r.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("model_optional",e)}"
            .value=${this._model}
            @input=${r=>this._model=r.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${r=>this._serialNumber=r.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${r=>this._documentationUrl=r.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${n("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${r=>this._areaId=r.detail.value||""}
          ></ha-area-picker>
          ${this.placesEnabled?this._renderPlace(e):p}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${n("installation_date_optional",e)}"
            .value=${this._installationDate}
            @value-changed=${r=>this._installationDate=r.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${n("warranty_expiry_optional",e)}"
            .value=${this._warrantyExpiry}
            @value-changed=${r=>this._warrantyExpiry=r.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>n("link_device_optional",e)}
            @value-changed=${r=>this._haDeviceId=r.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?l`<label class="textarea-field">
                <span class="textarea-label">${n("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${r=>this._parentEntryId=r.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${n("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(r=>l`<option
                      value=${r.entryId}
                      ?selected=${this._parentEntryId===r.entryId}
                    >${r.label}</option>`)}
                </select>
                <span class="md-hint">${n("parent_object_hint",e)}</span>
              </label>`:p}
          <label class="textarea-field">
            <span class="textarea-label">${n("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${r=>this._notes=r.target.value}
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
    `}};q.styles=$`
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
  `,d([b({attribute:!1})],q.prototype,"hass",2),d([b({attribute:!1})],q.prototype,"objects",2),d([b({type:Boolean})],q.prototype,"placesEnabled",2),d([h()],q.prototype,"_open",2),d([h()],q.prototype,"_loading",2),d([h()],q.prototype,"_error",2),d([h()],q.prototype,"_name",2),d([h()],q.prototype,"_manufacturer",2),d([h()],q.prototype,"_model",2),d([h()],q.prototype,"_serialNumber",2),d([h()],q.prototype,"_areaId",2),d([h()],q.prototype,"_installationDate",2),d([h()],q.prototype,"_warrantyExpiry",2),d([h()],q.prototype,"_documentationUrl",2),d([h()],q.prototype,"_notes",2),d([h()],q.prototype,"_haDeviceId",2),d([h()],q.prototype,"_parentEntryId",2),d([h()],q.prototype,"_place",2),d([h()],q.prototype,"_remindOnSite",2),d([h()],q.prototype,"_entryId",2),d([h()],q.prototype,"_replacing",2),d([h()],q.prototype,"_oldDeviceId",2),d([h()],q.prototype,"_replaceDevice",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",q)});var Hs,Ca,Aa=x(()=>{"use strict";Hs=["sensor","binary_sensor","number","input_number","input_boolean","counter","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant","input_select","select","input_datetime","date","datetime","timer","update"],Ca=["sensor"]});var Ed,Td,Ls,Ia=x(()=>{"use strict";Ed={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},Td="mdi:wrench-clock",Ls=i=>i&&Ed[i]||Td});function Ra(i,s){return i?.entities?.[s]?.platform==="maintenance_supporter"}function Pa(i){return Object.keys(i?.entities||{}).filter(s=>s.startsWith("todo.")&&Ra(i,s))}function xr(i,s){return[...new Set(s.filter(e=>e&&!Ra(i,e)))].slice(0,5)}var Oa=x(()=>{"use strict"});function Na(i){return Id[i]??"mdi:calendar"}function Pd(i,s,e){return ft(i,Rd[s]??"day",e)}function wr(i){let s=parseFloat(i);return Number.isFinite(s)?s:null}function G(i,s){return Object.entries(s).reduce((e,[t,r])=>e.split(`{${t}}`).join(r),i)}function Od(i,s){let e=s,t=()=>{let r=parseInt(i.intervalDays,10);return Number.isFinite(r)&&r>0?Pd(r,i.intervalUnit,e):null};switch(i.scheduleType){case"time_based":{let r=t();return r?G(n("beta_rules_every",e),{interval:r}):n("beta_rules_manual",e)}case"one_time":return i.dueDate?G(n("beta_rules_once_on",e),{date:D(i.dueDate,e)}):n("beta_rules_no_date",e);case"manual":return n("beta_rules_manual",e);case"weekdays":{let r=[...i.weekdays].sort((o,a)=>o-a).map(o=>ze(o,e,"short"));return`${n("recurrence_on_days",e)}: ${r.length?r.join(", "):"\u2014"}`}case"nth_weekday":{let r=i.nth==="-1"?n("ord_last",e):n(`ord_${i.nth}`,e);return`${n("nth_weekday",e)}: ${r} ${ze(parseInt(i.nthWeekday,10)||0,e,"long")}`}case"day_of_month":return`${n("day_of_month",e)}: ${i.domLastDay?n("recurrence_last_day",e):i.domDay}`;case"calendar":return`${n("calendar_entity_label",e)}: ${i.calendarEntity||"\u2014"}`;case"sensor_based":{let r=t();return r?G(n(i.triggerCombinator==="all"?"beta_rules_safety_all":"beta_rules_safety_any",e),{interval:r}):n("beta_rules_sensor_only",e)}default:return n(i.scheduleType,e)}}function Nd(i,s){let e=[];i.scheduleType==="time_based"&&parseInt(i.intervalDays,10)>0&&e.push(n(i.intervalAnchor==="planned"?"anchor_planned":"anchor_completion",s));let t=parseInt(i.warningDays,10);return i.scheduleType!=="manual"&&Number.isFinite(t)&&t>0&&e.push(G(n("beta_rules_due_soon",s),{interval:ft(t,"day",s)})),e}function jd(i,s){let e=s;if(i.triggerType==="compound"){let c=i.compoundLogic==="OR"?"beta_rules_any_of":"beta_rules_all_of";return G(n(c,e),{n:S(i.compoundCount,e)})}if(!i.triggerEntityIds.length)return n("beta_rules_pick_entity",e);let t=[],r=parseInt(i.forMinutes,10),o=Number.isFinite(r)&&r>0?G(n("beta_rules_for",e),{duration:ft(r,"minute",e)}):"";switch(i.triggerType){case"threshold":{let c=wr(i.above),u=wr(i.below);c!==null&&t.push(G(n("beta_rules_above",e),{value:S(c,e)})),u!==null&&t.push(G(n("beta_rules_below",e),{value:S(u,e)})),t.length||t.push(n("threshold",e)),o&&t.push(o);break}case"counter":{let c=wr(i.targetValue),u=c===null?"\u2014":S(c,e);t.push(G(n(i.deltaMode?"beta_rules_counter_delta":"beta_rules_counter_reaches",e),{value:u}));break}case"state_change":{let c=i.fromState.trim(),u=i.toState.trim();c&&t.push(G(n("beta_rules_changes_from",e),{state:c})),u&&t.push(G(n("beta_rules_changes_to",e),{state:u})),!c&&!u&&t.push(n("beta_rules_changes",e));let _=parseInt(i.targetChanges,10);Number.isFinite(_)&&_>1&&t.push(G(n("beta_rules_times",e),{n:S(_,e)})),o&&t.push(o);break}case"runtime":{let c=wr(i.runtimeHours);t.push(G(n("beta_rules_runs_for",e),{duration:c===null?"\u2014":ft(c,"hour",e)}));break}case"due_date":{let c=parseInt(i.daysBefore,10);t.push(Number.isFinite(c)&&c>0?G(n("beta_rules_date_before",e),{interval:ft(c,"day",e)}):n("beta_rules_date_on",e));break}}let a=t.join(" \xB7 ");return i.triggerAttribute?`${a} (${i.triggerAttribute})`:a}function Dd(i,s){let e=s.lang,t=[],r;if(i.completeWhenEntity&&i.completeWhenState.trim()){let a=s.entityName(i.completeWhenEntity);t.push(a),r=G(n("complete_when_badge",e),{entity:a,state:i.completeWhenState.trim()});let c=parseInt(i.completeWhenFor,10);Number.isFinite(c)&&c>0&&(r+=` \xB7 ${G(n("complete_when_badge_for",e),{minutes:S(c,e)})}`),i.completeWhenAnyTime&&(r+=` \xB7 ${n("complete_when_badge_any_time",e)}`)}else r=n("beta_rules_by_hand",e);let o=[];return i.quickOn&&o.push(n("quick_complete_label",e)),i.requiredCount>0&&o.push(`${n("require_on_completion",e)}: ${S(i.requiredCount,e)}`),i.checklistCount>0&&o.push(`${n("checklist",e)}: ${S(i.checklistCount,e)}`),i.partsCount>0&&o.push(`${n("consumes_parts_label",e)}: ${S(i.partsCount,e)}`),i.requireTagScan&&o.push(n("require_tag_scan",e)),i.allowSkip||o.push(n("disallow_skip",e)),{text:r,chips:t,badges:o}}function ja(i,s){let e=s.lang,t=[];t.push({id:"task",icon:"mdi:clipboard-text-outline",text:i.name.trim()||n("beta_rules_name_missing",e),chips:[],badges:[i.typeLabel,...i.enabled?[]:[n("disabled",e)]],removable:!1});let r=i.scheduleType==="sensor_based";if(t.push({id:"schedule",icon:Na(i.scheduleType),text:Od(i,e),chips:[],badges:Nd(i,e),removable:r?parseInt(i.intervalDays,10)>0:i.scheduleType!=="manual"}),r){let u=i.triggerType==="compound"?i.compoundEntityIds:i.triggerEntityIds;t.push({id:"trigger",icon:zs[i.triggerType]??"mdi:gauge",text:jd(i,e),chips:[...new Set(u)].map(_=>s.entityName(_)),badges:i.triggerType!=="compound"&&i.triggerEntityIds.length>1?[n(i.entityLogic==="all"?"entity_logic_all":"entity_logic_any",e)]:[],removable:!0})}let o=Dd(i,s);t.push({id:"completion",icon:"mdi:check-circle-outline",text:o.text,chips:o.chips,badges:o.badges,removable:!1});let a=i.pool.length>=2&&i.rotation?[n(`rotation_${i.rotation}`,e)]:[],c;return i.responsibleUserId?c=`${n("responsible_user",e)}: ${s.userName(i.responsibleUserId)}`:i.pool.length?c=`${n("task_shared_with",e)}: ${i.pool.map(u=>s.userName(u)).join(", ")}`:c=n("beta_rules_nobody",e),t.push({id:"people",icon:"mdi:account-multiple",text:c,chips:[],badges:a,removable:!1}),t.push({id:"notifications",icon:i.notifyEnabled?"mdi:bell-ring-outline":"mdi:bell-off-outline",text:i.notifyEnabled?n("beta_rules_reminders_on",e):n("no_notifications",e),chips:i.mirrorLists.map(u=>s.entityName(u)),badges:[],removable:!1}),t}function Da(i){let s=i.scheduleType==="sensor_based",e=parseInt(i.intervalDays,10)>0,t=[];for(let r of Cd){if(r===i.scheduleType)continue;let o;if(s)if(r==="time_based"){if(e)continue;o="safety"}else o="replace";else o=i.scheduleType==="manual"?"set":"replace";t.push({kind:"schedule",value:r,icon:Na(r),effect:o})}for(let r of Ad){if(s&&r==="compound")continue;let o;s?o="combine":o=i.scheduleType==="time_based"||i.scheduleType==="manual"?"set":"replace",t.push({kind:"trigger",value:r,icon:zs[r],effect:o})}return t}function Fs(i){let s={entityId:i.entityId,name:i.name},e=r=>({...s,target:"trigger",triggerType:r,icon:zs[r]}),t={...s,target:"done_when",icon:"mdi:check-circle-outline"};if(i.domain==="sensor")return i.deviceClass==="timestamp"||i.deviceClass==="date"?[e("due_date")]:i.numeric?zd.has(i.stateClass??"")?[e("counter"),e("threshold")]:i.deviceClass==="duration"?[e("threshold"),e("counter")]:[e("threshold")]:[e("state_change"),t];if(i.domain==="counter")return[e("counter")];if(i.domain==="number"||i.domain==="input_number")return[e("threshold")];if(qd.has(i.domain)){let r=[];return Ld.has(i.deviceClass??"")&&r.push(t),r.push(e("state_change")),(Md.has(i.domain)||Hd.has(i.deviceClass??""))&&r.push(e("runtime")),r.includes(t)||r.push(t),r}return Fd.has(i.domain)?[e("state_change"),t]:[]}function qa(i,s){let e=i.devices??{},t=s.areaId||(s.deviceId?e[s.deviceId]?.area_id:null)||null,r=c=>c.area_id||(c.device_id?e[c.device_id]?.area_id:null)||null,o=[];for(let[c,u]of Object.entries(i.entities??{})){if(u.platform===s.ownPlatform||u.hidden)continue;let _;if(s.deviceId&&u.device_id===s.deviceId)_="device";else if(t&&r(u)===t)_="area";else continue;let m=i.states?.[c];if(!m)continue;let f=m.attributes??{};o.push({entityId:c,name:typeof f.friendly_name=="string"?f.friendly_name:c,domain:c.split(".")[0],deviceClass:typeof f.device_class=="string"?f.device_class:void 0,stateClass:typeof f.state_class=="string"?f.state_class:void 0,numeric:m.state!==""&&Number.isFinite(Number(m.state))||typeof f.unit_of_measurement=="string",group:_,secondary:!!u.entity_category})}let a=c=>c.group==="device"?0:1;return o.sort((c,u)=>a(c)-a(u)||Number(c.secondary)-Number(u.secondary)||c.name.localeCompare(u.name)),o.map(({secondary:c,...u})=>u).filter(c=>Fs(c).length>0)}var Sd,Cd,Ad,Id,zs,Rd,qd,Md,Hd,Ld,zd,Fd,Ma=x(()=>{"use strict";P();Sd=["weekdays","nth_weekday","day_of_month","calendar"],Cd=["time_based",...Sd,"one_time"],Ad=["threshold","counter","state_change","runtime","due_date","compound"],Id={time_based:"mdi:calendar-sync",weekdays:"mdi:calendar-week",nth_weekday:"mdi:calendar-today",day_of_month:"mdi:calendar-month",calendar:"mdi:calendar-star",one_time:"mdi:calendar-check",manual:"mdi:gesture-tap",sensor_based:"mdi:calendar-sync"},zs={threshold:"mdi:gauge",counter:"mdi:counter",state_change:"mdi:state-machine",runtime:"mdi:timer-outline",due_date:"mdi:calendar-alert",compound:"mdi:set-center"};Rd={days:"day",weeks:"week",months:"month",years:"year"};qd=new Set(["binary_sensor","input_boolean","switch","fan","light","lock","cover","valve","siren"]),Md=new Set(["switch","fan","light","valve","input_boolean"]),Hd=new Set(["running","power","plug","heat","cold","moving","vibration"]),Ld=new Set(["door","opening","window","garage_door","lock","running","moving","vibration","occupancy","presence"]),zd=new Set(["total","total_increasing"]),Fd=new Set(["select","input_select","vacuum","lawn_mower","climate","water_heater","media_player","alarm_control_panel","event"])});var Ha,La=x(()=>{"use strict";I();Ha=$`
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
    row-gap: 8px;
    align-items: start;
  }
  .rules-layout > * {
    grid-column: 1;
    min-width: 0;
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
`});var za,Fa=x(()=>{it();bi();Ps();za=vi(class extends qt{constructor(i){if(super(i),i.type!==Ae.PROPERTY&&i.type!==Ae.ATTRIBUTE&&i.type!==Ae.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!hr(i))throw Error("`live` bindings can only contain a single expression")}render(i){return i}update(i,[s]){if(s===re||s===p)return s;let e=i.element,t=i.name;if(i.type===Ae.PROPERTY){if(s===e[t])return re}else if(i.type===Ae.BOOLEAN_ATTRIBUTE){if(!!s===e.hasAttribute(t))return re}else if(i.type===Ae.ATTRIBUTE&&e.getAttribute(t)===s+"")return re;return da(i),s}})});var Ua=x(()=>{Fa()});var Wa,Ba,be,Va=x(()=>{"use strict";I();z();Wa="__ms_empty__",Ba=i=>i===""?Wa:i,be=class extends T{constructor(){super(...arguments);this.label="";this.value=void 0;this.disabled=!1;this.helper="";this._options=[];this._selected="";this._observer=null}connectedCallback(){super.connectedCallback(),this._read(),this._observer=new MutationObserver(()=>this._read()),this._observer.observe(this,{childList:!0,subtree:!0,characterData:!0,attributes:!0})}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect(),this._observer=null}_read(){let e=[...this.querySelectorAll("option")];this._options=e.map(t=>({value:Ba(t.value),label:(t.textContent??"").replace(/\s+/g," ").trim()})),this._selected=e.find(t=>t.hasAttribute("selected")||t.selected)?.value??e[0]?.value??""}_picked(e){e.stopPropagation(),this.value=e.detail.value===Wa?"":e.detail.value,this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){return l`
      <ha-select
        .label=${this.label}
        .helper=${this.helper}
        .options=${this._options}
        .value=${Ba(this.value??this._selected)}
        .disabled=${this.disabled}
        @selected=${this._picked}
      ></ha-select>`}};be.styles=$`
    :host { display: block; }
    ha-select { display: block; width: 100%; }
  `,d([b()],be.prototype,"label",2),d([b()],be.prototype,"value",2),d([b({type:Boolean})],be.prototype,"disabled",2),d([b()],be.prototype,"helper",2),d([h()],be.prototype,"_options",2),d([h()],be.prototype,"_selected",2);customElements.get("ms-ha-select")||customElements.define("ms-ha-select",be)});function F(){return se("ha-select")}function M(i,s){if(F())return l`<ms-ha-select class=${i.cls??p} .label=${i.label??""} .value=${i.value} .disabled=${!!i.disabled}
      @change=${i.onChange}>${s}</ms-ha-select>`;if(i.value===void 0)return l`<select class=${i.cls??p} id=${i.id??p} aria-label=${i.label??p} ?disabled=${!!i.disabled}
      @change=${i.onChange}>${s}</select>`;let e=i.value;return l`<select class=${i.cls??p} id=${i.id??p} aria-label=${i.label??p} ?disabled=${!!i.disabled}
    .value=${i.live?za(e):e} @change=${i.onChange}
    ${Mt(t=>{t instanceof HTMLSelectElement&&queueMicrotask(()=>{t.value!==e&&(t.value=e)})})}>${s}</select>`}var Us=x(()=>{"use strict";I();Ua();gr();ne();Va()});function $r(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0",carry:{}}}function Za(i){return{type:i.type||"threshold",attribute:i.attribute||"",above:i.trigger_above?.toString()??"",below:i.trigger_below?.toString()??"",equals:i.trigger_equals?.toString()??"",notEquals:i.trigger_not_equals?.toString()??"",forMinutes:i.trigger_for_minutes?.toString()??"0",targetValue:i.trigger_target_value?.toString()??"",deltaMode:i.trigger_delta_mode||!1,fromState:i.trigger_from_state||"",toState:i.trigger_to_state||"",targetChanges:i.trigger_target_changes?.toString()??"",runtimeHours:i.trigger_runtime_hours?.toString()??"",onStates:(i.trigger_on_states||[]).join(", "),daysBefore:i.trigger_days_before?.toString()??"0"}}function Ja(i,s){s.attribute&&(i.attribute=s.attribute);let e=parseInt(s.forMinutes,10);if(s.type==="threshold"){let t=parseFloat(s.above);isNaN(t)||(i.trigger_above=t);let r=parseFloat(s.below);isNaN(r)||(i.trigger_below=r);let o=parseFloat(s.equals);isNaN(o)||(i.trigger_equals=o);let a=parseFloat(s.notEquals);isNaN(a)||(i.trigger_not_equals=a),isNaN(e)||(i.trigger_for_minutes=e)}else if(s.type==="counter"){let t=parseFloat(s.targetValue);isNaN(t)||(i.trigger_target_value=t),i.trigger_delta_mode=s.deltaMode}else if(s.type==="state_change"){s.fromState&&(i.trigger_from_state=s.fromState),s.toState&&(i.trigger_to_state=s.toState);let t=parseInt(s.targetChanges,10);isNaN(t)||(i.trigger_target_changes=t),isNaN(e)||(i.trigger_for_minutes=e)}else if(s.type==="runtime"){let t=parseFloat(s.runtimeHours);isNaN(t)||(i.trigger_runtime_hours=t);let r=(s.onStates||"").split(",").map(o=>o.trim()).filter(Boolean);r.length>0&&(i.trigger_on_states=r)}else if(s.type==="due_date"){let t=parseInt(s.daysBefore,10);i.trigger_days_before=isNaN(t)?0:t}}function Qd(i){return{entityIds:cr(i).join(", "),...Za(i),carry:Object.fromEntries(Object.entries(i).filter(([e])=>!Yd.has(e)&&!e.startsWith("_")))}}function Zd(i){let s=i.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(s.length===0)return null;let e={...i.carry||{},entity_id:s[0],entity_ids:s,type:i.type};return Ja(e,i),e}function Jd(i){return Array.from({length:7},(s,e)=>ze(e,i,"short"))}function Ya(i){return Array.from({length:12},(s,e)=>as(e,i,"short"))}function Xd(i){let s=Array.isArray(i)?i.filter(e=>e!=null&&e!=="").join(", "):i!==null&&typeof i=="object"||i==null?"":String(i);return s.length>40?`${s.slice(0,39)}\u2026`:s}var Bd,Wd,Vd,Ga,Gd,Er,Ka,Qa,kr,Kd,Ie,ct,Yd,g,Bs,Xa=x(()=>{"use strict";I();z();P();gs();ir();at();Aa();me();pi();dr();wt();Cs();mi();Ia();$s();Ts();Oa();Ma();La();Dt();pr();br();Ke();Us();$i();Bd="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",Wd="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",Vd="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",Ga=["cleaning","inspection","replacement","calibration","service","reading","custom"],Gd=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],Er=["weekdays","nth_weekday","day_of_month","calendar"],Ka=["time_based","one_time",...Er],Qa=["threshold","counter","state_change","runtime","due_date"],kr=(i,s)=>n(i==="due_date"?"trigger_type_due_date":i,s),Kd=[...Qa,"compound"],Ie={alpha:"0.3",min:"7",max:"365"},ct=We;Yd=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);g=class g extends T{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.mirrorTodoDefault=[];this.betaEditor=!1;this._ruleSel=null;this._addTab="type";this._betaStep="form";this._chooserFilter="";this._templateChoices=null;this._copyChoices=null;this._objectDevice=null;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._series=[];this._seriesIndex=0;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calMonths=[];this._hadCalMonths=!1;this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._detailsOpen=!1;this._mirrorTodoEntities=[];this._mirrorTodoMode="default";this._completeWhenEntity="";this._completeWhenState="";this._completeWhenAnyTime=!1;this._completeWhenFor="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._holdUntilDone=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._triggerDetailAttribute="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._quickOn=!1;this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=Ie.alpha;this._adaptiveMin=Ie.min;this._adaptiveMax=Ie.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set;this._attrSeq=0}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return N(this.hass)}async openCreate(e,t){this._series=[],this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="";let r=(t||[]).filter(o=>!o.object.archived&&!o.object.archived_at);!e&&r.length>0?(this._objectChoices=r.map(o=>({entry_id:o.entry_id,name:o.object.name})).sort((o,a)=>o.name.localeCompare(a.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),this._betaStep=this.betaEditor?"choose":"form",this._ruleSel="task",this._addTab="type",this._chooserFilter="",await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._series=[],await this._edit(e,t)}async openEditSeries(e){e.length!==0&&(this._series=e,await this._editSeriesItem(0))}async _editSeriesItem(e){let t=this._series[e];this._seriesIndex=e,await this._edit(t.entryId,t.task),await this.updateComplete,this.shadowRoot?.querySelector(".dialog-title")?.scrollIntoView({block:"start"})}_skipSeriesItem(){this._editSeriesItem(this._seriesIndex+1)}async _edit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._warning="",this._betaStep="form",this._ruleSel=null,this._addTab="type",this._objectChoices=[],this._isFleetTask=t.battery_fleet_task===!0,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let r=t.schedule;this._weekdays=r?.kind==="weekdays"?[...r.weekdays??[]]:[],this._nth=r?.kind==="nth_weekday"?String(r.nth??1):"1",this._nthWeekday=r?.kind==="nth_weekday"?String(r.weekday??5):"5",this._domDay=r?.kind==="day_of_month"&&(r.day??1)>=1?String(r.day??1):"1",this._domLastDay=r?.kind==="day_of_month"&&r.day===-1,this._domBusiness=r?.kind==="day_of_month"&&r.business===!0,this._calMonths=(r?.kind==="day_of_month"||r?.kind==="nth_weekday")&&Array.isArray(r.months)?[...r.months]:[],this._hadCalMonths=this._calMonths.length>0,this._calendarEntity=r?.kind==="calendar"&&r.entity_id||"",this._calOffset=r?.offset?String(r.offset):"0",this._seasonMonths=Array.isArray(r?.season_months)?[...r.season_months]:[];let o=r?.ends;o&&typeof o.count=="number"?(this._endsMode="count",this._endsCount=String(o.count),this._endsUntil=""):o&&typeof o.until=="string"?(this._endsMode="until",this._endsUntil=o.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._notifyIcon=t.notify_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._mirrorTodoEntities=[...t.mirror_todo_entities||[]],this._mirrorTodoMode=this._mirrorTodoEntities.length?"own":t.mirror_todo_use_default===!1?"none":"default",this._completeWhenEntity=t.complete_when?.entity_id||"",this._completeWhenState=t.complete_when?.to_state||"",this._completeWhenAnyTime=!!t.complete_when?.any_time,this._completeWhenFor=t.complete_when?.for_minutes?String(t.complete_when.for_minutes):"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._notifyEnabled=t.notify_enabled!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(_=>({..._})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(_=>[ge(_),{..._}])),this._consumesQtyText={},this._responsibleUserId=t.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([_,m])=>{let{name:f,checklist:v,consumes_parts:w,required_completion_fields:A,...k}=m,E=m.consumes_parts||[],y=E.findIndex(xe=>!xe.entry_id),R=y>=0?E[y]:void 0;return{id:_,name:m.name||_,checklistText:(m.checklist||[]).join(`
`),partId:R?.part_id||"",partQty:R?.quantity!=null?String(R.quantity):"",reqOverride:m.required_completion_fields!==void 0,reqFields:[...m.required_completion_fields||[]],extraParts:E.filter((xe,ut)=>ut!==y).map(xe=>({...xe})),carry:k}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"",this._scheduleTimeOn=!!t.schedule_time;let a=t.on_complete_action;if(a&&a.service){this._actionService=a.service;let _=a.target?.entity_id;this._actionTargetEntity=Array.isArray(_)?_[0]||"":_||"",this._actionTargetStored=a.target&&typeof a.target=="object"?JSON.parse(JSON.stringify(a.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=a.data&&typeof a.data=="object"?{...a.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=a.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let c=t.quick_complete_defaults;this._quickOn=ee(t),this._qcNotes=c?.notes||"",this._qcCost=c?.cost!=null?String(c.cost):"",this._qcDuration=c?.duration!=null?String(c.duration):"",this._qcFeedback=c?.feedback||"";let u=t.adaptive_config||{};if(this._environmentalEntity=u.environmental_entity||"",this._environmentalAttribute=u.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!u.enabled,this._adaptiveAlpha=u.ewa_alpha?.toString()??Ie.alpha,this._adaptiveMin=u.min_interval_days?.toString()??Ie.min,this._adaptiveMax=u.max_interval_days?.toString()??Ie.max,this._adaptiveSeasonal=u.seasonal_enabled!==!1,this._adaptivePrediction=u.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,t.trigger_config){let _=t.trigger_config;this._triggerEntityId=ks(_)||"",this._triggerEntityIds=cr(_),this._triggerEntityLogic=_.entity_logic||"any",this._setTypeFields(Za(_)),this._triggerCombinator=_.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=_.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=_.auto_complete_on_recovery||!1,this._holdUntilDone=_.trigger_hold_until_done===!0,this._triggerRuntimeMaxSession=_.trigger_runtime_max_session_seconds?.toString()||"",this._triggerDetailAttribute=_.detail_attribute||"",_.type==="compound"?(this._compoundLogic=_.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(_.conditions||[]).map(Qd)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),this._detailsOpen=this._priority!=="normal"||!!this._labels.trim()||!!this._documentationUrl.trim()||!!this._customIcon,await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._detailsOpen=!1,this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._calMonths=[],this._hadCalMonths=!1,this._calendarEntity="",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._mirrorTodoMode="default",this._completeWhenEntity="",this._completeWhenState="",this._completeWhenAnyTime=!1,this._completeWhenFor="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._notifyEnabled=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=Ie.alpha,this._adaptiveMin=Ie.min,this._adaptiveMax=Ie.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._actionTestError="",this._quickOn=!1,this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates,this._triggerDaysBefore=e.daysBefore}_resetTriggerFields(){++this._attrSeq,this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields($r()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._holdUntilDone=!1,this._triggerRuntimeMaxSession="",this._triggerDetailAttribute="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new Tt(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=n("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,r]=e.split(".");if(!this.hass?.services?.[t]?.[r]){this._actionTestResult="error",this._actionTestError=n("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let o=this._actionTargetEntity.trim();if(o){let a=o.split(".")[0];if(a!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=n("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",t).replace("{entity}",o).replace("{entity_domain}",a).replace("{suggestion}",`${a}.${r}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[o]){this._actionTestResult="error",this._actionTestError=n("action_test_entity_missing",this._lang).replace("{entity}",o),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,r]=e.split("."),o=this.hass?.services?.[t]?.[r]?.fields;return!o||Object.keys(o).length===0?null:Object.entries(o).map(([a,c])=>({name:a,required:!!c.required,selector:c.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([t,r])=>t==="entity_id"?Array.isArray(r)&&r.length>1:Array.isArray(r)?r.length>0:!!r):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},t=o=>(Array.isArray(o)?o:[o]).filter(a=>typeof a=="string"&&!!a),r=this.hass;return[...t(e.entity_id).map(o=>_i(this.hass,o)),...t(e.device_id).map(o=>r.devices?.[o]?.name_by_user||r.devices?.[o]?.name||o),...t(e.area_id).map(o=>r.areas?.[o]?.name||o),...t(e.floor_id).map(o=>r.floors?.[o]?.name||o),...t(e.label_id)].join(", ")}_renderQuickComplete(e){let t={notes:!!this._qcNotes.trim(),cost:!isNaN(parseFloat(this._qcCost)),duration:lt(this._qcDuration)!==null,photo:!1,user:!0},r=this._requiredCompletion.filter(a=>!t[a]),o=!!this._checklistText.trim()||this._readings.length>0;return l`
      ${j({cls:"req-option quick-complete-switch",checked:this._quickOn,onChange:a=>this._quickOn=a.target.checked},l`<span>${n("quick_complete_label",e)}</span>`)}
      ${this._quickOn?l`
            <div class="field-help">${n("quick_complete_help",e)}</div>
            ${r.length?l`<div class="field-help quick-complete-note">${n("quick_complete_needs_dialog",e).replace("{fields}",r.map(a=>n(Ot[a],e)).join(", "))}</div>`:p}
            ${this._requireTagScan?l`<div class="field-help quick-complete-note">${n("quick_complete_tag_hint",e)}</div>`:p}
            ${o?l`<div class="field-help">${n("quick_complete_not_asked",e)}</div>`:p}
            ${ue({cls:"ca-section quick-complete-values",open:Object.values(t).slice(0,3).some(Boolean)||!!this._qcFeedback,header:n("quick_complete_values",e)},l`
              <p class="field-help">${n("quick_complete_values_help",e)}</p>
              <ms-textfield
                label="${n("quick_complete_defaults_notes",e)}"
                .value=${this._qcNotes}
                @input=${a=>{this._qcNotes=a.target.value}}
              ></ms-textfield>
              <div class="qc-cost">
                <span class="qc-cost-label">${n("quick_complete_defaults_cost",e)}</span>
                <ms-cost-input .lang=${e} .value=${this._qcCost}
                  @value-changed=${a=>{this._qcCost=a.detail.value}}></ms-cost-input>
              </div>
              <ms-textfield
                label="${n("quick_complete_defaults_duration",e)}"
                type="number" min="0" step="1"
                .value=${this._qcDuration}
                @input=${a=>{this._qcDuration=a.target.value}}
              ></ms-textfield>
              ${M({label:n("was_maintenance_needed",e),cls:"qc-feedback",value:this._qcFeedback,onChange:a=>{this._qcFeedback=a.target.value}},l`
                <option value="">${n("quick_complete_defaults_feedback_none",e)}</option>
                <option value="needed">${n("quick_complete_defaults_feedback_needed",e)}</option>
                <option value="not_needed">${n("quick_complete_defaults_feedback_not_needed",e)}</option>
                <option value="not_sure">${n("feedback_not_sure",e)}</option>
              `)}
            `)}
          `:p}
    `}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return p;let t=this._serviceSchema();return l`
      ${ue({cls:"ca-section",header:n("on_complete_action_title",e)},l`
        <p class="field-help">${n("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${r=>{this._actionService=r.detail.value||"";let o=this._serviceSchema();if(o){let a=new Set(o.map(c=>c.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([c])=>a.has(c)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>n("on_complete_action_target",e)}
          @value-changed=${r=>{let o=r.detail.value;this._actionTargetEntity=o.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?l`<p class="field-help ca-target-more">${n("on_complete_action_target_more",e).replace("{targets}",this._actionTargetSummary())}</p>`:p}
        <p class="field-help ca-domain-hint">
          ${n("on_complete_action_target_hint",e)}
        </p>
        ${j({cls:"ca-skip-auto",checked:this._actionSkipAuto,onChange:r=>{this._actionSkipAuto=r.target.checked}},l`<span>${n("on_complete_action_skip_auto",e)}</span>`)}
        ${t?l`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${r=>{this._actionData={...r.detail.value}}}
              ></ha-form>
            `:l`
              <ms-textfield
                label="${n("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${r=>{this._actionDataJsonFallback=r.target.value}}
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
      `)}

    `}async _loadParts(){this.parts=[];let e=this._entryId;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e});if(e!==this._entryId)return;this.parts=t.parts||[],this._partsLoadFailed=!1}catch{if(e!==this._entryId)return;this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){this._foreignOwners=[];let e=this._entryId;if(e)try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});if(e!==this._entryId)return;this._foreignOwners=(t.objects||[]).filter(r=>r.entry_id!==e&&(r.parts||[]).length>0).map(r=>({entry_id:r.entry_id,name:r.object?.name||r.entry_id,parts:r.parts||[]})).sort((r,o)=>r.name.localeCompare(o.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let r=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:r.suggested_attributes||[],available:r.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){let t=++this._attrSeq;if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let r=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});if(t!==this._attrSeq)return;this._entityDomain=r.domain||"",this._suggestedAttributes=r.suggested_attributes||[],this._availableAttributes=r.available_attributes||[]}catch{if(t!==this._attrSeq)return;this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let r=ge({part_id:e.id,entry_id:t}),o=this._consumesParts[r],a=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return l`
      <div class="consumes-row">
        ${j({cls:"consumes-check",checked:o!==void 0,onChange:c=>{let u={...this._consumesParts};if(c.target.checked)u[r]=u[r]||a;else{delete u[r];let _={...this._consumesQtyText};delete _[r],this._consumesQtyText=_}this._consumesParts=u}},l`<span>${e.name}${e.unit?` (${e.unit})`:""}</span>`)}
        ${o!==void 0?l`<input
              class="consumes-qty"
              aria-label=${`${e.name}: ${n("quantity",this._lang)}`}
              type="number"
              min=${ct[0]}
              max=${ct[1]}
              step="0.01"
              .value=${this._consumesQtyText[r]??String(o.quantity)}
              @input=${c=>{let u=c.target.value;this._consumesQtyText={...this._consumesQtyText,[r]:u};let _=parseFloat(u.replace(",","."));Number.isFinite(_)&&_>=ct[0]&&(this._consumesParts={...this._consumesParts,[r]:{...a,quantity:_}})}}
            />`:p}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let t of Object.keys(e)){let r=this._consumesQtyText[t];if(r===void 0)continue;let o=parseFloat(r.replace(",","."));if(!Number.isFinite(o)||o<ct[0]||o>ct[1]){let a=c=>S(c,this._lang,{maximumFractionDigits:2});return this._error=n("settings_value_out_of_range",this._lang).replace("{min}",a(ct[0])).replace("{max}",a(ct[1])),!1}e[t]={...e[t],quantity:o}}return this._consumesParts=e,!0}_toggleRequired(e,t){let r=new Set(this._requiredCompletion);t?r.add(e):r.delete(e),this._requiredCompletion=[...r]}_patchReading(e,t){this._readings=this._readings.map(r=>r.id===e?{...r,...t}:r)}_renderReadingsEditor(e){let t=Fo(this._readings);return l`
      <div class="readings-editor">
        <div class="field-label">${n("readings_section",e)}</div>
        <div class="field-help">${n("readings_hint",e)}</div>
        ${this._readings.map(r=>l`
          ${t.has(r.id)?l`<div class="field-help reading-dup">${n("reading_duplicate_name",e)}</div>`:p}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${n("reading_name_label",e)}"
              .value=${r.name}
              @input=${o=>this._patchReading(r.id,{name:o.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${n("reading_unit_short",e)}"
              .value=${r.unit||""}
              @input=${o=>this._patchReading(r.id,{unit:o.target.value})}
            ></ms-textfield>
            <ha-icon-button class="phase-remove reading-remove" .label=${n("remove",e)} @click=${()=>this._readings=this._readings.filter(o=>o.id!==r.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<vs?l`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:qo(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${n("reading_add",e)}
          </ha-button>`:p}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",r=t,o=2;for(;this._phaseDefs.some(a=>a.id===r);)r=`${t}-${o++}`;return r}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(r=>r.id===e?{...r,...t}:r)}_renderPhasesEditor(e){let t=r=>this._phaseDefs.find(o=>o.id===r)?.name||r;return l`
      ${ue({cls:"phases-section",open:this._phaseDefs.length>0,header:n("phases_section",e)},l`
      <div class="field-help">${n("phases_hint",e)}</div>
      ${this._phaseDefs.map(r=>l`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${n("phase_name",e)}"
              .value=${r.name}
              @input=${o=>this._patchPhaseDef(r.id,{name:o.target.value})}
            ></ms-textfield>
            ${this.parts.length?l`
              ${M({label:n("spare_part",e),cls:"phase-part",value:r.partId,onChange:o=>{let a=o.target.value;this._patchPhaseDef(r.id,r.partQty?{partId:a}:{partId:a,partQty:"1"})}},l`
                <option value="">—</option>
                ${this.parts.map(o=>l`<option value=${o.id} ?selected=${o.id===r.partId}>${o.name}</option>`)}
              `)}
              ${r.partId?l`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" aria-label=${n("quantity",e)} type="number" min=${We[0]} step="0.01" placeholder="1" .value=${r.partQty}
                  @input=${o=>this._patchPhaseDef(r.id,{partQty:o.target.value})} />
              `:p}
            `:p}
            <ha-icon-button class="phase-remove" .label=${n("remove",e)} @click=${()=>this._removePhaseDef(r.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?l`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${n("checklist_placeholder",e)}"
              .value=${r.checklistText}
              @input=${o=>this._patchPhaseDef(r.id,{checklistText:o.target.value})}
            ></textarea>
          `:p}
          ${j({cls:"req-option phase-req-toggle",checked:r.reqOverride,onChange:o=>this._patchPhaseDef(r.id,{reqOverride:o.target.checked})},l`<span>${n("phase_require_override",e)}</span>`)}
          ${r.reqOverride?l`
            <div class="required-completion phase-req-fields">
              ${Ss.map(o=>l`
                ${j({cls:"req-option",checked:r.reqFields.includes(o),onChange:a=>{let c=a.target.checked,u=new Set(r.reqFields);c?u.add(o):u.delete(o),this._patchPhaseDef(r.id,{reqFields:[...u]})}},l`<span>${n(Ot[o],e)}</span>`)}
              `)}
            </div>
          `:p}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${n("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(r=>r.name.trim())?l`
        <div class="phase-seq-label">${n("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((r,o)=>l`
            <span class="phase-chip">
              ${o+1}. ${t(r)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((a,c)=>c!==o)}}>✕</button>
            </span>
          `)}
          ${M({label:n("phase_sequence_add_step",e),cls:"phase-seq-add",value:"",onChange:r=>{let o=r.target.value;o&&(this._phaseSeq=[...this._phaseSeq,o]),r.target.value=""}},l`
            <option value="">+ ${n("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(r=>r.name.trim()).map(r=>l`<option value=${r.id}>${r.name}</option>`)}
          `)}
        </div>
      `:p}
      `)}
    `}async _save(){if(this._loading||!this._name.trim()||this._missingDueDate())return;if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),r=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(r)&&t>r){this._error=`${n("adaptive_min_interval",this._lang)} > ${n("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=n("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=n("calendar_entity_required",this._lang);return}if(!this._applyConsumesQtyText())return;if(this._completeWhenEntity&&parseInt(this._completeWhenFor,10)>Ct[1]){this._error=n("settings_value_out_of_range",this._lang).replace("{min}","1").replace("{max}",S(Ct[1],this._lang));return}this._loading=!0,this._error="";let e;try{let t=await L(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:c=>{this._error=c}});if(t===void 0)return;let r=this._taskId||t?.task_id,o=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let a=c=>{this._warning=n("subsave_warning",this._lang).replace("{detail}",c)};if(r&&this._scheduleType==="sensor_based"&&o&&await L(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:r,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:a})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),r&&this._adaptiveSnapshot()!==this._adaptiveInitial){let c=parseFloat(this._adaptiveAlpha),u=parseInt(this._adaptiveMin,10),_=parseInt(this._adaptiveMax,10);await L(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:r,enabled:this._adaptiveEnabled,...c>=di[0]&&c<=di[1]?{ewa_alpha:c}:{},...!isNaN(u)&&u>=1?{min_interval_days:u}:{},...!isNaN(_)&&_>=1?{max_interval_days:_}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:a})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?r&&(this._taskId=r):this._seriesIndex+1<this._series.length?e=this._seriesIndex+1:(this._open=!1,this._series=[]),this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}e!==void 0&&await this._editSeriesItem(e)}_missingDueDate(){return this._scheduleType==="one_time"&&!this._dueDate}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):Er.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.priority=this._priority,e.labels=this._labels.split(",").map(a=>a.trim()).filter(Boolean);let r=this.mirrorTodoDefault.length&&this._mirrorTodoMode!=="own"?[]:xr(this.hass,this._mirrorTodoEntities);e.mirror_todo_entities=r,e.mirror_todo_use_default=this.mirrorTodoDefault.length?this._mirrorTodoMode==="default":this._mirrorTodoMode!=="none",e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip;let o=parseInt(this._completeWhenFor,10);e.complete_when=this._completeWhenEntity&&this._completeWhenState.trim()?{entity_id:this._completeWhenEntity,to_state:this._completeWhenState.trim(),...this._completeWhenAnyTime?{any_time:!0}:{},...o>0?{for_minutes:o}:{}}:null,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=Uo(this._readings);{let a={};for(let u of this._phaseDefs){if(!u.name.trim())continue;let _={...u.carry,name:u.name.trim()},m=u.checklistText.split(`
`).map(v=>v.trim()).filter(Boolean);m.length&&(_.checklist=m);let f=[];if(u.partId){let v=parseFloat(u.partQty);f.push({part_id:u.partId,quantity:Number.isFinite(v)&&v>0?v:1})}for(let v of u.extraParts)f.push(v.entry_id?{part_id:v.part_id,quantity:v.quantity,entry_id:v.entry_id}:{part_id:v.part_id,quantity:v.quantity});f.length&&(_.consumes_parts=f),u.reqOverride&&(_.required_completion_fields=[...u.reqFields]),a[u.id]=_}let c=this._phaseSeq.filter(u=>u in a);e.phases=Object.keys(a).length&&c.length?a:null,e.phase_sequence=e.phases?c:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(a=>a.entry_id?{part_id:a.part_id,quantity:a.quantity,entry_id:a.entry_id}:{part_id:a.part_id,quantity:a.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let a=this._compoundConditions.map(Zd).filter(c=>c!==null);if(a.length>0){let c={type:"compound",compound_logic:this._compoundLogic,conditions:a};this._autoCompleteOnRecovery&&(c.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(c.trigger_combinator="all"),this._triggerDetailAttribute&&(c.detail_attribute=this._triggerDetailAttribute),e.trigger_config=c}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let a=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],c={entity_id:a[0],entity_ids:a,type:this._triggerType};if(Ja(c,this._typeFields()),this._holdUntilDone&&this._isStateLatch()?c.trigger_hold_until_done=!0:this._autoCompleteOnRecovery&&(c.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(c.trigger_combinator="all"),this._triggerDetailAttribute&&(c.detail_attribute=this._triggerDetailAttribute),a.length>1&&(c.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let u=parseFloat(this._triggerBaselineValue);!isNaN(u)&&u>=0&&(c.trigger_baseline_value=u)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let u=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(u)&&u>0&&(c.trigger_runtime_max_session_seconds=u)}e.trigger_config=c}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&Ka.includes(this._scheduleType)){let a=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(a)?a:null}if(this.checklistsEnabled){let a=this._checklistText.split(`
`).map(c=>c.trim()).filter(Boolean).slice(0,100);e.checklist=a.length?a:null}if(this.completionActionsEnabled||this._actionPresent){let a=this._actionService.trim();if(a&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(a)){let c={service:a},u=this._actionTargetEntity.trim();this._actionTargetStored&&u===this._actionTargetInitial?c.target=JSON.parse(JSON.stringify(this._actionTargetStored)):u&&(c.target={entity_id:u});let _=this._buildActionData();Object.keys(_).length>0&&(c.data=_),this._actionSkipAuto&&(c.skip_auto=!0),e.on_complete_action=c}else e.on_complete_action=null}{let a={};this._qcNotes.trim()&&(a.notes=this._qcNotes.trim());let c=parseFloat(this._qcCost);isNaN(c)||(a.cost=c);let u=lt(this._qcDuration);u!==null&&(a.duration=u),this._qcFeedback&&(a.feedback=this._qcFeedback),e.quick_complete_defaults=this._quickOn?a:null}return e}_close(){this._open=!1,this._series=[],this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let e=this._lang,t=this._triggerType==="compound";return l`
      <div class="select-row">
        ${F()?p:l`<label>${n("trigger_type",e)}</label>`}
        ${M({label:n("trigger_type",e),value:this._triggerType,onChange:r=>this._triggerType=r.target.value},l`
          ${Kd.map(r=>l`<option value=${r} ?selected=${r===this._triggerType}>${kr(r,e)}</option>`)}
        `)}
      </div>
      ${t?this._renderCompoundEditor():l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${n("entity_id",e)} (${n("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${r=>{let a=r.target.value.split(",").map(c=>c.trim()).filter(Boolean);this._triggerEntityId=a[0]||"",this._triggerEntityIds=a,a[0]&&this._fetchEntityAttributes(a[0])}}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:Hs}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>n("entity_id",e)}
          @value-changed=${r=>{let o=(r.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=o[0]||"",this._triggerEntityIds=o,o[0]?this._fetchEntityAttributes(o[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?l`
          <div class="select-row">
            ${F()?p:l`<label>${n("entity_logic",e)}</label>`}
            ${M({label:n("entity_logic",e),value:this._triggerEntityLogic,onChange:r=>this._triggerEntityLogic=r.target.value},l`
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${n("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${n("entity_logic_all",e)}</option>
            `)}
          </div>
        `:p}
        ${this._renderAttributeSelect({label:n("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:r=>this._triggerAttribute=r})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      ${this._renderDetailAttributeSelect(e)}
      ${this._isStateLatch()?this._renderTriggerEnd(e):l`
        ${j({checked:this._autoCompleteOnRecovery,onChange:r=>this._autoCompleteOnRecovery=r.target.checked},l`${n("auto_complete_on_recovery",e)}`)}
        <div class="field-help">${n("auto_complete_on_recovery_help",e)}</div>
      `}
      <ms-textfield
        label="${n("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${r=>this._intervalDays=r.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():p}
      ${this._intervalDays?l`
            <div class="select-row">
              ${F()?p:l`<label>${n("trigger_combinator",e)}</label>`}
              ${M({label:n("trigger_combinator",e),onChange:r=>this._triggerCombinator=r.target.value},l`
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${n("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${n("trigger_combinator_all",e)}</option>
              `)}
            </div>
          `:p}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((r,o)=>o===e?{...r,...t}:r)}_addCondition(){this._compoundConditions=[...this._compoundConditions,$r()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,r)=>r!==e),this.betaEditor&&this._compoundConditions.length===1&&this._flattenCompound()}_flattenCompound(){let[e]=this._compoundConditions;if(!e)return;let t=e.entityIds.split(",").map(c=>c.trim()).filter(Boolean),{entityIds:r,carry:o,...a}=e;this._compoundConditions=[],this._setTypeFields(a),this._triggerEntityId=t[0]||"",this._triggerEntityIds=t,t[0]&&this._fetchEntityAttributes(t[0])}_renderCompoundEditor(){let e=this._lang;return l`
      <div class="select-row">
        ${F()?p:l`<label>${n("compound_logic",e)}</label>`}
        ${M({label:n("compound_logic",e),value:this._compoundLogic,onChange:t=>this._compoundLogic=t.target.value},l`
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${n("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${n("compound_logic_or",e)}</option>
        `)}
      </div>
      <div class="field-help">${n("compound_help",e)}</div>
      ${this._compoundConditions.length===0?l`<div class="field-help">${n("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,r)=>this._renderCondition(t,r))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${n("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let r=this._lang,o=t+1;return l`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${n("compound_condition",r)} ${o}</span>
          <button
            type="button"
            class="icon-btn"
            title="${n("compound_remove_condition",r)}"
            @click=${()=>this._removeCondition(t)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${n("entity_id",r)} (${n("comma_separated",r)})"
            .value=${e.entityIds}
            @input=${a=>this._patchCondition(t,{entityIds:a.target.value})}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:Hs}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(a=>a.trim()).filter(Boolean)}}
          .computeLabel=${()=>n("entity_id",r)}
          @value-changed=${a=>{let c=(a.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:c.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          ${F()?p:l`<label>${n("trigger_type",r)}</label>`}
          ${M({label:n("trigger_type",r),value:e.type,onChange:a=>this._patchCondition(t,{type:a.target.value})},l`
            ${Qa.map(a=>l`<option value=${a} ?selected=${a===e.type}>${kr(a,r)}</option>`)}
          `)}
        </div>
        ${this._renderConditionTypeFields(e,t)}
      </div>
    `}_isStateLatch(){return this._triggerType==="state_change"&&(this._triggerTargetChanges===""||Number(this._triggerTargetChanges)===1)&&!!(this._triggerFromState.trim()||this._triggerToState.trim())}_renderTriggerEnd(e){let t=this._holdUntilDone?"hold":this._autoCompleteOnRecovery?"done":"ok",r={ok:"trigger_end_ok",done:"trigger_end_done",hold:"trigger_end_hold"},o=a=>{this._autoCompleteOnRecovery=a==="done",this._holdUntilDone=a==="hold"};return l`
      <div class="trigger-end" role="radiogroup" aria-label=${n("trigger_end",e)}>
        <div class="field-label">${n("trigger_end",e)}</div>
        ${Object.keys(r).map(a=>l`
          <label class="trigger-end-option">
            <input type="radio" name="trigger-end" value=${a} .checked=${t===a} @change=${()=>o(a)} />
            ${n(r[a],e)}
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
            @value-changed=${t=>{let r=(t.detail.value.complete_when||"").trim();r!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=r}}
          ></ha-form>`}
        ${this._completeWhenEntity?this._renderStateField({label:n("complete_when_state",e),value:this._completeWhenState,entityId:this._completeWhenEntity,onInput:t=>this._completeWhenState=t}):p}
        ${this._completeWhenEntity?l`
          <ms-textfield
            class="complete-when-for"
            label="${n("for_at_least_minutes",e)}"
            type="number"
            min=${Ct[0]}
            max=${Ct[1]}
            .value=${this._completeWhenFor}
            @input=${t=>this._completeWhenFor=t.target.value}
          ></ms-textfield>
          ${j({cls:"req-option complete-when-any-time",checked:this._completeWhenAnyTime,onChange:t=>this._completeWhenAnyTime=t.target.checked},l`<span>${n("complete_when_any_time",e)}</span>`)}
        `:p}
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
          @input=${r=>e.onInput(r.target.value)}
        ></ms-textfield>
      `:l`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(r=>r.trim()).filter(Boolean)}}
        .computeLabel=${()=>n("runtime_on_states",t)}
        @value-changed=${r=>e.onInput((r.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?p:!this.adaptiveFeature&&!this._adaptiveWasEnabled?p:l`
      ${ue({cls:"adaptive-section",open:this._adaptiveEnabled,header:n("adaptive_section_title",e)},l`
        ${j({checked:this._adaptiveEnabled,onChange:t=>this._adaptiveEnabled=t.target.checked},l`${n("adaptive_enabled",e)}`)}
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
            min=${di[0]}
            max=${di[1]}
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${t=>this._adaptiveAlpha=t.target.value}
          ></ms-textfield>
          ${this.seasonalFeature?l`${j({checked:this._adaptiveSeasonal,onChange:t=>this._adaptiveSeasonal=t.target.checked},l`${n("adaptive_seasonal_enabled",e)}`)}`:p}
          ${j({checked:this._adaptivePrediction,onChange:t=>this._adaptivePrediction=t.target.checked},l`${n("adaptive_prediction_enabled",e)}`)}
        `:p}
      `)}
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?l`
        <div class="select-row">
          ${F()?p:l`<label>${e.label}</label>`}
          ${M({label:e.label,value:e.value,onChange:r=>e.onSelect(r.target.value)},l`
            <option value="" ?selected=${!e.value}>${n("use_entity_state",t)}</option>
            ${e.suggested.map(r=>l`<option value=${r} ?selected=${r===e.value}>${r} ★</option>`)}
            ${e.available.filter(r=>!e.suggested.includes(r.name)).map(r=>l`<option value=${r.name} ?selected=${r.name===e.value}>${r.name}${r.numeric?"":" (non-numeric)"}</option>`)}
          `)}
        </div>
      `:l`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${r=>e.onSelect(r.target.value.trim())}
      ></ms-textfield>
    `}_renderDetailAttributeSelect(e){let t=this._triggerType==="compound"?this._compoundConditions.flatMap(_=>_.entityIds.split(",").map(m=>m.trim()).filter(Boolean)):(this._triggerEntityIds.length?this._triggerEntityIds:[this._triggerEntityId]).filter(Boolean);if(!t.length)return p;let r=this.hass?.states??{},o=new Map;for(let _ of t){this._fetchConditionAttributes(_);for(let m of this._conditionAttrOptions[_]?.available??[])o.has(m.name)||o.set(m.name,Xd(r[_]?.attributes?.[m.name]))}let a=this._triggerDetailAttribute;a&&!o.has(a)&&o.set(a,"");let c=n("trigger_detail_attribute",e),u=o.size?l`
        <div class="select-row">
          ${F()?p:l`<label>${c}</label>`}
          ${M({label:c,cls:"detail-attribute-select",value:a,onChange:_=>this._triggerDetailAttribute=_.target.value},l`
            <option value="" ?selected=${!a}>${n("trigger_detail_none",e)}</option>
            ${[...o.entries()].sort(([_],[m])=>_.localeCompare(m)).map(([_,m])=>l`<option value=${_} ?selected=${_===a}>${m?`${_}: ${m}`:_}</option>`)}
          `)}
        </div>`:l`
        <ms-textfield class="detail-attribute-input" label=${c} .value=${a}
          @input=${_=>this._triggerDetailAttribute=_.target.value.trim()}></ms-textfield>`;return l`${u}<div class="field-help">${n("trigger_detail_attribute_help",e)}</div>`}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:n("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:r=>this._environmentalAttribute=r})}_renderConditionAttribute(e,t){let r=e.entityIds.split(",")[0]?.trim()||"";r&&this._fetchConditionAttributes(r);let o=r?this._conditionAttrOptions[r]:void 0;return this._renderAttributeSelect({label:n("attribute_optional",this._lang),value:e.attribute,suggested:o?.suggested??[],available:o?.available??[],onSelect:a=>this._patchCondition(t,{attribute:a})})}_renderConditionTypeFields(e,t){let r=this._lang;if(e.type==="threshold")return l`
        <ms-textfield label="${n("trigger_above",r)}" type="number" .value=${e.above}
          @input=${o=>this._patchCondition(t,{above:o.target.value})}></ms-textfield>
        <ms-textfield label="${n("trigger_below",r)}" type="number" .value=${e.below}
          @input=${o=>this._patchCondition(t,{below:o.target.value})}></ms-textfield>
        <ms-textfield label="${n("trigger_equals",r)}" type="number" .value=${e.equals}
          @input=${o=>this._patchCondition(t,{equals:o.target.value})}></ms-textfield>
        <ms-textfield label="${n("trigger_not_equals",r)}" type="number" .value=${e.notEquals}
          @input=${o=>this._patchCondition(t,{notEquals:o.target.value})}></ms-textfield>
        <ms-textfield label="${n("for_minutes",r)}" type="number" .value=${e.forMinutes}
          @input=${o=>this._patchCondition(t,{forMinutes:o.target.value})}></ms-textfield>
      `;if(e.type==="counter")return l`
        <ms-textfield label="${n("target_value",r)}" type="number" .value=${e.targetValue}
          @input=${o=>this._patchCondition(t,{targetValue:o.target.value})}></ms-textfield>
        ${j({checked:e.deltaMode,onChange:o=>this._patchCondition(t,{deltaMode:o.target.checked})},l`${n("delta_mode",r)}`)}
      `;if(e.type==="state_change"){let o=e.entityIds.split(",")[0]?.trim()||"";return l`
        ${this._renderStateField({label:n("from_state_optional",r),value:e.fromState,entityId:o,onInput:a=>this._patchCondition(t,{fromState:a})})}
        ${this._renderStateField({label:n("to_state_optional",r),value:e.toState,entityId:o,onInput:a=>this._patchCondition(t,{toState:a})})}
        <ms-textfield label="${n("target_changes",r)}" type="number" .value=${e.targetChanges}
          @input=${a=>this._patchCondition(t,{targetChanges:a.target.value})}></ms-textfield>
        <ms-textfield label="${n("for_minutes",r)}" type="number" .value=${e.forMinutes}
          @input=${a=>this._patchCondition(t,{forMinutes:a.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let o=e.entityIds.split(",")[0]?.trim()||"";return l`
        <ms-textfield label="${n("runtime_hours",r)}" type="number" .value=${e.runtimeHours}
          @input=${a=>this._patchCondition(t,{runtimeHours:a.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:o,onInput:a=>this._patchCondition(t,{onStates:a})})}
      `}return e.type==="due_date"?l`
        <ms-textfield label="${n("days_before",r)}" type="number" step="1"
          min=${li[0]} max=${li[1]} .value=${e.daysBefore}
          @input=${o=>this._patchCondition(t,{daysBefore:o.target.value})}></ms-textfield>
      `:p}_renderUnitSelect(){let e=this._lang;return l`
      <div class="select-row">
        ${F()?p:l`<label>${n("interval_unit",e)}</label>`}
        ${M({label:n("interval_unit",e),value:this._intervalUnit,onChange:t=>this._intervalUnit=t.target.value},l`
          ${["days","weeks","months","years"].map(t=>l`<option value=${t} ?selected=${t===this._intervalUnit}>${n("unit_"+t,e)}</option>`)}
        `)}
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(Er.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(g._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let r=(u,_,m=0)=>{if(!(!u||m>10)){(u.tagName?.toLowerCase()??"")==="ha-entity-picker"&&_.push(u);for(let f of[u.shadowRoot,u])if(f)for(let v of Array.from(f.children??[]))r(v,_,m+1)}},o=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],a=[];for(let u of o)r(u,a);let c=a.length===0||a.some(u=>u.offsetHeight===0);if(e.offsetHeight===0||c){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){++this._previewSeq,this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let r=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{},...this._taskId?{entry_id:this._entryId,task_id:this._taskId}:{}});if(t!==this._previewSeq)return;this._schedulePreview=r.occurrences||[],this._schedulePreviewEnded=!!r.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return p;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",r=this._schedulePreview.map((a,c)=>{let u=new Date(`${a}T12:00:00`).getDay();return`${ze(u===0?6:u-1,e,"short")} ${D(a,e)}${c===0?t:""}`}).join(" \xB7 "),o=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?l`<div class="field-help">${n("schedule_preview_ontime",e)}</div>`:p;return l`
      <div class="trigger-live-hint schedule-preview">
        ${n("schedule_preview_title",e)}: ${r}${this._schedulePreviewEnded?l` <span class="field-help">${n("schedule_preview_ends",e)}</span>`:p}
        ${o}
      </div>
    `}_buildSchedule(){let e=o=>{let a=parseInt(this._calOffset,10)||0;return a&&(o.offset=Math.max(-ci,Math.min(a,ci))),o},t=o=>((this._calMonths.length||this._hadCalMonths)&&(o.months=[...this._calMonths].sort((a,c)=>a-c)),e(o));if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((o,a)=>o-a)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let r={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(r.business=!0),t(r)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,r)=>t-r)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleCalMonth(e){this._calMonths=this._calMonths.includes(e)?this._calMonths.filter(t=>t!==e):[...this._calMonths,e]}_renderCalMonths(){let e=this._lang;return l`
      <label class="field-label">${n("recurrence_months_label",e)}</label>
      <div class="field-help">${n("recurrence_months_hint",e)}</div>
      <div class="weekday-chips season-chips cal-month-chips">
        ${Ya(e).map((t,r)=>l`
          <button
            type="button"
            class="season-chip ${this._calMonths.includes(r+1)?"selected":""}"
            @click=${()=>this._toggleCalMonth(r+1)}
          >${t}</button>`)}
      </div>`}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||Er.includes(this._scheduleType)))return p;let r=Ya(e);return l`
      <label class="field-label">${n("season_window_label",e)}</label>
      <div class="field-help">${n("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${r.map((o,a)=>l`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(a+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(a+1)}
          >${o}</button>`)}
      </div>

      <label class="field-label">${n("series_end_label",e)}</label>
      <div class="select-row">
        ${M({label:n("series_end_label",e),value:this._endsMode,onChange:o=>this._endsMode=o.target.value},l`
          <option value="never" ?selected=${this._endsMode==="never"}>${n("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${n("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${n("series_end_until",e)}</option>
        `)}
      </div>
      ${this._endsMode==="count"?l`
        <!-- max: MAX_SERIES_COUNT (const.py), what the history can count. -->
        <ms-textfield
          label="${n("series_end_count_label",e)}"
          type="number" min="1" max="500"
          .value=${this._endsCount}
          @input=${o=>this._endsCount=o.target.value}
        ></ms-textfield>`:p}
      ${this._endsMode==="until"?l`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${n("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${o=>this._endsUntil=o.detail.value}
        ></ms-date-field>`:p}
    `}_renderCalendarFields(){let e=this._lang,t=Jd(e);if(this._scheduleType==="weekdays")return l`
        <label class="field-label">${n("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((r,o)=>l`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(o)?"selected":""}"
              @click=${()=>this._toggleWeekday(o)}
            >${r}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let r=[["1",n("ord_1",e)],["2",n("ord_2",e)],["3",n("ord_3",e)],["4",n("ord_4",e)],["5",n("ord_5",e)],["-1",n("ord_last",e)]];return l`
        <div class="select-row">
          ${F()?p:l`<label>${n("recurrence_occurrence",e)}</label>`}
          ${M({label:n("recurrence_occurrence",e),value:this._nth,onChange:o=>this._nth=o.target.value},l`
            ${r.map(([o,a])=>l`<option value=${o} ?selected=${o===this._nth}>${a}</option>`)}
          `)}
        </div>
        <div class="select-row">
          ${F()?p:l`<label>${n("recurrence_weekday",e)}</label>`}
          ${M({label:n("recurrence_weekday",e),value:this._nthWeekday,onChange:o=>this._nthWeekday=o.target.value},l`
            ${t.map((o,a)=>l`<option value=${String(a)} ?selected=${String(a)===this._nthWeekday}>${o}</option>`)}
          `)}
        </div>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${n("calendar_entity_label",e)}"
            helper="${n("calendar_entity_hint",e)}"
            .value=${this._calendarEntity}
            @input=${r=>this._calendarEntity=r.target.value.trim()}
          ></ms-textfield>
        `:l`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>n("calendar_entity_label",e)}
            .computeHelper=${()=>n("calendar_entity_hint",e)}
            @value-changed=${r=>{this._calendarEntity=(r.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?l`
        ${this._domLastDay?p:l`
          <ms-textfield
            label="${n("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${r=>this._domDay=r.target.value}
          ></ms-textfield>`}
        ${j({cls:"checkbox-row",checked:this._domLastDay,onChange:r=>this._domLastDay=r.target.checked},l`<span>${n("recurrence_last_day",e)}</span>`)}
        ${j({cls:"checkbox-row",checked:this._domBusiness,onChange:r=>this._domBusiness=r.target.checked},l`<span>${n("recurrence_business_day",e)}</span>`)}
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`:p}_renderCalOffsetField(){let e=this._lang;return l`
      <ms-textfield
        label="${n("recurrence_offset",e)}"
        helper="${n("recurrence_offset_help",e)}"
        type="number"
        min=${-ci}
        max=${ci}
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return p;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?l`<div class="trigger-live-hint warn">${n("trigger_hint_overlap",this._lang)}</div>`:p,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let r=this.hass.states[t];if(!r)return e;let o=this._lang,a=r.attributes?.unit_of_measurement,c=typeof a=="string"&&a?` ${a}`:"",u=this._triggerAttribute?r.attributes?.[this._triggerAttribute]:r.state,_=typeof u=="number"?u:parseFloat(String(u)),m=u!=="unknown"&&u!=="unavailable"&&u!=null&&!isNaN(_),f=w=>S(w,o,{maximumFractionDigits:1}),v=[];if(this._triggerType==="threshold"){let w=parseFloat(this._triggerAbove),A=parseFloat(this._triggerBelow),k=parseFloat(this._triggerEquals),E=parseFloat(this._triggerNotEquals);if([w,A,k,E].every(y=>isNaN(y)))return p;m&&v.push(n("trigger_hint_now",o).replace("{value}",f(_)+c)),isNaN(w)||v.push(n("trigger_hint_above",o).replace("{target}",f(w)+c)),isNaN(A)||v.push(n("trigger_hint_below",o).replace("{target}",f(A)+c)),isNaN(k)||v.push(n("trigger_hint_equals",o).replace("{target}",f(k)+c)),isNaN(E)||v.push(n("trigger_hint_not_equals",o).replace("{target}",f(E)+c))}else if(this._triggerType==="counter"){let w=parseFloat(this._triggerTargetValue);if(isNaN(w))return p;this._triggerDeltaMode?this._taskId?v.push(n("trigger_hint_counter_delta_edit",o).replace("{target}",f(w)+c)):m?v.push(n("trigger_hint_counter_delta",o).replace("{value}",f(_)+c).replace("{due}",f(_+w)+c).replace("{target}",f(w)+c)):v.push(n("trigger_hint_counter_delta_edit",o).replace("{target}",f(w)+c)):(m&&v.push(n("trigger_hint_now",o).replace("{value}",f(_)+c)),v.push(n("trigger_hint_counter_abs",o).replace("{target}",f(w)+c)))}else if(this._triggerType==="runtime"){let w=parseFloat(this._triggerRuntimeHours);if(isNaN(w))return p;v.push(n("trigger_hint_runtime",o).replace("{hours}",f(w))),v.push(n("trigger_hint_state_now",o).replace("{value}",String(r.state)))}else if(this._triggerType==="state_change"){let w=parseInt(this._triggerTargetChanges,10)||1,A=this._triggerToState.trim();v.push((A?n("trigger_hint_state_change_to",o).replace("{state}",A):n("trigger_hint_state_change",o)).replace("{count}",String(w))),v.push(n("trigger_hint_state_now",o).replace("{value}",String(r.state)))}else if(this._triggerType==="due_date"){let w=parseInt(this._triggerDaysBefore,10)||0;v.push(w===0?n("trigger_hint_due_date_same_day",o):Ui("trigger_hint_due_date","trigger_hint_due_date_one",w,o,"days"));let A=u==null?"":String(u);A&&!isNaN(Date.parse(A))&&v.push(n("trigger_hint_due_date_now",o).replace("{date}",D(A,o)))}return v.length?l`<div class="trigger-live-hint">${v.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?l`
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
        ${j({checked:this._triggerDeltaMode,onChange:t=>this._triggerDeltaMode=t.target.checked},l`${n("delta_mode",e)}`)}
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
          min=${Jo[0]}
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${n("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?l`<div class="field-help">${n("state_latch_help",e)}</div>`:p}
        <ms-textfield
          label="${n("for_at_least_minutes",e)}"
          type="number"
          min=${Ct[0]}
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
          min=${li[0]}
          max=${li[1]}
          .value=${this._triggerDaysBefore}
          @input=${t=>this._triggerDaysBefore=t.target.value}
        ></ms-textfield>
        <div class="field-help">${n("days_before_help",e)}</div>
      `:p}_section(e,t,r){return l`<section class="form-section ${e}">
      <h3 class="section-title">${t}</h3>
      ${r}
    </section>`}_renderIdentity(e){return l`
          ${this._taskId===null&&this._objectChoices.length>0?l`
            <div class="select-row">
              ${F()?p:l`<label>${n("object",e)}</label>`}
              ${M({label:n("object",e),value:this._entryId,onChange:t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},l`
                ${this._objectChoices.map(t=>l`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
              `)}
            </div>
          `:p}
          <ms-textfield
            label="${n("task_name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <div class="select-row">
            ${F()?p:l`<label>${n("maintenance_type",e)}</label>`}
            ${M({label:n("maintenance_type",e),value:this._type,onChange:t=>this._type=t.target.value},l`
              ${Ga.map(t=>l`<option value=${t} ?selected=${t===this._type}>${n(t,e)}</option>`)}
            `)}
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
          ${j({cls:"toggle-row",checked:this._enabled,onChange:t=>this._enabled=t.target.checked},l`${n("task_enabled",e)}`)}
    `}_renderDetails(e){return l`
      ${ue({cls:"details-section",open:this._detailsOpen,header:n("task_section_details",e)},l`
        <div class="select-row">
          ${F()?p:l`<label>${n("priority",e)}</label>`}
          ${M({label:n("priority",e),value:this._priority,onChange:t=>this._priority=t.target.value},l`
            ${Es.map(t=>l`<option value=${t} ?selected=${t===this._priority}>${n("priority_"+t,e)}</option>`)}
          `)}
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
      `)}
    `}_renderScheduleSection(e){return this._section("schedule-section",n("task_section_schedule",e),l`
          <div class="select-row">
            ${F()?p:l`<label>${n("schedule_type",e)}</label>`}
            ${M({label:n("schedule_type",e),value:this._scheduleType,onChange:t=>this._scheduleType=t.target.value},l`
              ${Gd.map(t=>l`<option value=${t} ?selected=${t===this._scheduleType}>${n(t,e)}</option>`)}
            `)}
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
                  ${F()?p:l`<label>${n("interval_anchor",e)}</label>`}
                  ${M({label:n("interval_anchor",e),value:this._intervalAnchor,onChange:t=>this._intervalAnchor=t.target.value},l`
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${n("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${n("anchor_planned",e)}</option>
                  `)}
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
          ${this.scheduleTimeEnabled&&Ka.includes(this._scheduleType)?l`
            ${j({cls:"checkbox-row schedule-time-toggle",checked:this._scheduleTimeOn,onChange:t=>this._scheduleTimeOn=t.target.checked},l`<span>${n("schedule_time_toggle",e)}</span>`)}
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
            min=${xs[0]}
            max=${xs[1]}
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
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:Ca}}}]}
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
                        ${ue({cls:"shared-pools",open:this._hasForeignPick,header:n("shared_parts_other_objects",e)},l`
                          <div class="field-help">${n("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>l`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(r=>this._renderConsumesRow(r,t.entry_id))}
                            `)}
                        `)}
                      `:p}
                </div>
              `:p}
          <div class="field-label">${n("require_on_completion",e)}</div>
          <div class="required-completion">
            ${Ss.map(t=>l`
              ${j({cls:"req-option",checked:this._requiredCompletion.includes(t),onChange:r=>this._toggleRequired(t,r.target.checked)},l`<span>${n(Ot[t],e)}</span>`)}
            `)}
          </div>
          ${this._availableTags.length>0?l`
              <div class="select-row">
                ${F()?p:l`<label>${n("nfc_tag_id_optional",e)}</label>`}
                ${M({label:n("nfc_tag_id_optional",e),value:this._nfcTagId,onChange:t=>this._nfcTagId=t.target.value},l`
                  <option value="" ?selected=${!this._nfcTagId}>${n("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(t=>l`<option value=${t.id} ?selected=${t.id===this._nfcTagId}>${t.name}</option>`)}
                `)}
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
          ${j({cls:"req-option",checked:this._requireTagScan,onChange:t=>this._requireTagScan=t.target.checked},l`<span>${n("require_tag_scan",e)}</span>`)}
          ${this._requireTagScan?l`<div class="field-help">${n("require_tag_scan_help",e)}</div>`:p}
          ${j({cls:"req-option",checked:!this._allowSkip,onChange:t=>this._allowSkip=!t.target.checked},l`<span>${n("disallow_skip",e)}</span>`)}
          ${this._allowSkip?p:l`<div class="field-help">${n("disallow_skip_help",e)}</div>`}
          ${this._renderQuickComplete(e)}
          ${this._renderCompleteWhen(e)}
          ${this._renderPhasesEditor(e)}
          ${this._renderCompletionActionsSection(e)}
    `)}_renderPeopleSection(e){return this._section("people-section",n("task_section_people",e),l`
          <div class="select-row">
            ${F()?p:l`<label>${n("responsible_user",e)}</label>`}
            ${M({label:n("responsible_user",e),value:this._responsibleUserId||"",onChange:t=>{let r=t.target.value;this._responsibleUserId=r||null}},l`
              <option value="" ?selected=${!this._responsibleUserId}>${n("no_user_assigned",e)}</option>
              ${this._availableUsers.map(t=>l`<option value=${t.id} ?selected=${t.id===this._responsibleUserId}>${t.name}</option>`)}
            `)}
          </div>
          ${this._availableUsers.length>=2?l`
            <div class="field">
              <label>${n("task_shared_with",e)}</label>
              <div class="field-help">${n("task_shared_with_help",e)}</div>
              ${this._responsibleUserId&&this._assigneePool.length>0&&!(this._assigneePool.length>=2&&this._rotationStrategy)?l`<div class="field-help shared-responsible-wins">${n("task_shared_responsible_wins",e)}</div>`:p}
              <div class="assignee-pool">
                ${this._availableUsers.map(t=>l`
                  ${j({cls:"pool-item",checked:this._assigneePool.includes(t.id),onChange:()=>this._toggleAssignee(t.id)},l`<span>${t.name}</span>`)}`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?l`
              <div class="select-row">
                ${F()?p:l`<label>${n("rotation_strategy",e)}</label>`}
                ${M({label:n("rotation_strategy",e),value:this._rotationStrategy,onChange:t=>this._rotationStrategy=t.target.value},l`
                  <option value="" ?selected=${!this._rotationStrategy}>${n("rotation_none",e)}</option>
                  ${sa.map(t=>l`<option value=${t} ?selected=${t===this._rotationStrategy}>${n("rotation_"+t,e)}</option>`)}
                `)}
              </div>`:p}
          `:p}
    `)}_renderNotificationsSection(e){return this._section("notifications-section",n("task_section_notifications",e),l`
          ${j({cls:"req-option",checked:!this._notifyEnabled,onChange:t=>this._notifyEnabled=!t.target.checked},l`<span>${n("no_notifications",e)}</span>`)}
          ${this._notifyEnabled?p:l`<div class="field-help">${n("no_notifications_help",e)}</div>`}
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${n("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${t=>this._notifyIcon=t.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||Ls(this._type)}></ha-icon>
            ${n("notify_icon_hint",e).replace("{default}",Ls(this._type))}
          </div>
          ${this._renderMirrorTodo(e)}
    `)}_renderMirrorTodo(e){let t=this.mirrorTodoDefault;if(!t.length)return l`
          <div class="field mirror-todo-field">
            ${this._renderMirrorTodoPicker(e)}
            <div class="field-help">${n("task_mirror_todo_hint",e)}</div>
          </div>`;let r=t.map(a=>_i(this.hass,a)).join(", "),o={default:n("task_mirror_todo_default",e).replace("{lists}",r),own:n("task_mirror_todo_own",e),none:n("task_mirror_todo_none",e)};return l`
          <div class="field mirror-todo-field">
            <div class="mirror-todo-choice" role="radiogroup" aria-label=${n("task_mirror_todo",e)}>
              <div class="field-label">${n("task_mirror_todo",e)}</div>
              ${Object.keys(o).map(a=>l`
                <label class="mirror-todo-option">
                  <input type="radio" name="mirror-todo" value=${a} .checked=${this._mirrorTodoMode===a}
                    @change=${()=>this._mirrorTodoMode=a} />
                  ${o[a]}
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
                @input=${t=>{this._mirrorTodoEntities=xr(this.hass,t.target.value.split(",").map(r=>r.trim()))}}
              ></ms-textfield>
            `:l`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"],exclude_entities:Pa(this.hass)}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>n("task_mirror_todo",e)}
                @value-changed=${t=>{this._mirrorTodoEntities=xr(this.hass,t.detail.value.mirror_todo_entities||[])}}
              ></ha-form>`}
            <div class="field-help mirror-todo-max">${n("task_mirror_todo_max",e).replace("{max}",String(5))}</div>`}_ruleDraft(){let e=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];return{name:this._name,enabled:this._enabled,typeLabel:n(this._type,this._lang),scheduleType:this._scheduleType,intervalDays:this._intervalDays,intervalUnit:this._intervalUnit,intervalAnchor:this._intervalAnchor,dueDate:this._dueDate,weekdays:this._weekdays,nth:this._nth,nthWeekday:this._nthWeekday,domDay:this._domDay,domLastDay:this._domLastDay,calendarEntity:this._calendarEntity?_i(this.hass,this._calendarEntity):"",warningDays:this._warningDays,triggerType:this._triggerType,triggerEntityIds:e,triggerAttribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,daysBefore:this._triggerDaysBefore,triggerCombinator:this._triggerCombinator,entityLogic:this._triggerEntityLogic,compoundLogic:this._compoundLogic,compoundCount:this._compoundConditions.length,compoundEntityIds:this._compoundConditions.flatMap(t=>t.entityIds.split(",").map(r=>r.trim()).filter(Boolean)),completeWhenEntity:this._completeWhenEntity,completeWhenState:this._completeWhenState,completeWhenFor:this._completeWhenFor,completeWhenAnyTime:this._completeWhenAnyTime,quickOn:this._quickOn,requiredCount:this._requiredCompletion.length,allowSkip:this._allowSkip,requireTagScan:this._requireTagScan,checklistCount:this.checklistsEnabled?this._checklistText.split(`
`).filter(t=>t.trim()).length:0,partsCount:Object.keys(this._consumesParts).length,responsibleUserId:this._responsibleUserId,pool:this._assigneePool,rotation:this._rotationStrategy,notifyEnabled:this._notifyEnabled,mirrorLists:this._mirrorListsShown()}}_mirrorListsShown(){return this.mirrorTodoDefault.length?this._mirrorTodoMode==="default"?this.mirrorTodoDefault:this._mirrorTodoMode==="own"?this._mirrorTodoEntities:[]:this._mirrorTodoMode==="none"?[]:this._mirrorTodoEntities}_userName(e){return this._availableUsers.find(t=>t.id===e)?.name??e}_sidebarTitle(e,t){switch(e){case"task":return n("task_section_details",t);case"schedule":return n("task_section_schedule",t);case"trigger":return n("task_section_trigger",t);case"completion":return n("task_section_completion",t);case"people":return n("task_section_people",t);case"notifications":return n("task_section_notifications",t);default:return n("beta_rules_add_rule",t)}}_selectRule(e){this._ruleSel=this._ruleSel===e?null:e,e==="add"&&this._loadObjectDevice()}_removeRule(e){e==="trigger"?(this._resetTriggerFields(),this._scheduleType=parseInt(this._intervalDays,10)>0?"time_based":"manual"):e==="schedule"&&(this._scheduleType==="sensor_based"?this._intervalDays="":this._scheduleType="manual"),this._ruleSel===e&&(this._ruleSel=null)}_combineTrigger(e,t=""){if(this._triggerType!=="compound"){let r=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];this._compoundConditions=[{entityIds:r.join(", "),...this._typeFields(),carry:{}}],this._compoundLogic="OR",this._triggerType="compound",this._triggerEntityId="",this._triggerEntityIds=[]}this._compoundConditions=[...this._compoundConditions,{...$r(),type:e,entityIds:t}]}_setSensorRule(e,t=""){this._scheduleType!=="time_based"&&this._scheduleType!=="sensor_based"&&(this._intervalDays=""),this._scheduleType="sensor_based",this._resetTriggerFields(),this._triggerType=e,e==="compound"&&(this._compoundConditions=[$r()]),t&&(this._triggerEntityId=t,this._triggerEntityIds=[t],this._fetchEntityAttributes(t))}_applyChoice(e){if(e.kind==="schedule"){if(e.effect==="safety"){parseInt(this._intervalDays,10)>0||(this._intervalDays="30"),this._ruleSel="trigger";return}this._scheduleType==="sensor_based"&&this._resetTriggerFields(),e.value==="time_based"&&!(parseInt(this._intervalDays,10)>0)&&(this._intervalDays="30"),this._scheduleType=e.value,this._ruleSel="schedule";return}let t=e.value;e.effect==="combine"?this._combineTrigger(t):this._setSensorRule(t),this._ruleSel="trigger"}_applySuggestion(e){if(e.target==="done_when"){e.entityId!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=e.entityId,this._ruleSel="completion";return}let t=e.triggerType??"threshold";this._scheduleType==="sensor_based"&&(this._triggerType==="compound"||!!this._triggerEntityId)?this._combineTrigger(t,e.entityId):this._setSensorRule(t,e.entityId),this._ruleSel="trigger"}async _loadObjectDevice(){let e=this._entryId;if(!e||this._objectDevice?.entryId===e)return;let t=null,r=null;try{let a=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}))?.objects??[]).find(c=>c.entry_id===e);t=a?.object.ha_device_id??null,r=a?.object.area_id??null}catch{}this._entryId===e&&(this._objectDevice={entryId:e,deviceId:t,areaId:r})}async _loadTemplateChoices(){if(this._templateChoices===null)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._templateChoices=(e?.templates??[]).filter(t=>!t.disabled).flatMap(t=>(t.tasks??[]).map(r=>({...r,template:t.name})))}catch{this._templateChoices=[]}}async _loadCopyChoices(){if(this._copyChoices===null)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._copyChoices=(e?.objects??[]).flatMap(t=>(t.tasks??[]).filter(r=>!r.battery_fleet_task&&!r.part_ref).map(r=>({entryId:t.entry_id,objectName:t.object.name,task:r})))}catch{this._copyChoices=[]}}_applyTemplateTask(e){this._name=e.name,this._type=Ga.includes(e.type)?e.type:"custom";let t=e.interval_days&&e.interval_days>0?String(e.interval_days):"";e.schedule_type==="sensor_based"?(this._scheduleType="sensor_based",this._intervalDays=t):e.schedule_type==="manual"||!t?this._scheduleType="manual":(this._scheduleType="time_based",this._intervalDays=t,this._intervalUnit="days"),e.warning_days!==null&&e.warning_days!==void 0&&(this._warningDays=String(e.warning_days)),this._betaStep="form",this._ruleSel=this._scheduleType==="sensor_based"?"add":"schedule",this._ruleSel==="add"&&(this._addTab="device",this._loadObjectDevice())}async _applyCopy(e){let t=this._entryId,r=this._objectChoices;await this._edit(e.entryId,e.task),this._taskId=null,this._entryId=t,this._objectChoices=r,this._series=[],this._isFleetTask=!1,this._lastPerformed="",this._nfcTagId="",this._consumesParts={},this._consumesQtyText={},this._phaseDefs=this._phaseDefs.map(o=>({...o,partId:"",partQty:"",extraParts:[]})),await Promise.all([this._loadParts(),this._loadForeignPools()]),this._betaStep="form",this._ruleSel="task"}_choiceNote(e,t){return e.effect==="replace"?n("beta_rules_replaces",t):e.effect==="combine"?n("beta_rules_combines",t):e.effect==="safety"?n("beta_rules_adds_safety",t):""}_renderAddPicker(e){let t=l`
      <div class="add-tabs" role="tablist" aria-label=${n("beta_rules_add_rule",e)}>
        <button type="button" role="tab" class="add-tab-type" aria-selected=${this._addTab==="type"?"true":"false"}
          @click=${()=>{this._addTab="type"}}>${n("beta_rules_by_type",e)}</button>
        <button type="button" role="tab" class="add-tab-device" aria-selected=${this._addTab==="device"?"true":"false"}
          @click=${()=>{this._addTab="device",this._loadObjectDevice()}}>${n("beta_rules_by_device",e)}</button>
      </div>`;if(this._addTab==="type"){let m=Da({scheduleType:this._scheduleType,intervalDays:this._intervalDays,triggerType:this._triggerType}),f=v=>{let w=this._choiceNote(v,e);return l`
          <button type="button" class="add-choice" data-kind=${v.kind} data-value=${v.value} @click=${()=>this._applyChoice(v)}>
            <ha-icon icon=${v.icon}></ha-icon>
            <span class="add-choice-text">
              <span>${v.kind==="trigger"?kr(v.value,e):n(v.value,e)}</span>
              ${w?l`<span class="add-choice-note">${w}</span>`:p}
            </span>
          </button>`};return l`${t}
        <div class="add-group">${n("task_section_schedule",e)}</div>
        ${m.filter(v=>v.kind==="schedule").map(f)}
        <div class="add-group">${n("task_section_trigger",e)}</div>
        ${m.filter(v=>v.kind==="trigger").map(f)}`}let r=this._objectDevice;if(r===null||r.entryId!==this._entryId)return l`${t}<div class="field-help">…</div>`;if(!r.deviceId&&!r.areaId)return l`${t}<div class="field-help beta-no-device">${n("beta_rules_no_device",e)}</div>`;let o=qa(this.hass,{deviceId:r.deviceId,areaId:r.areaId,ownPlatform:"maintenance_supporter"});if(!o.length)return l`${t}<div class="field-help beta-no-device">${n(r.deviceId?"beta_rules_no_device_entities":"beta_rules_no_area_entities",e)}</div>`;let a=r.areaId||(r.deviceId?this.hass.devices?.[r.deviceId]?.area_id:null)||"",c=this.hass.areas?.[a]?.name||a,u=o.some(m=>m.group==="device"),_=(m,f)=>{if(f>0&&o[f-1].group===m.group)return p;let v=m.group==="device"?n("beta_rules_group_device",e):n(u?"beta_rules_group_area_more":"beta_rules_group_area",e).replace("{area}",c);return l`<div class="add-group device-group" data-group=${m.group}>${v}</div>`};return l`${t}
      ${o.map((m,f)=>l`${_(m,f)}
        <div class="device-entity" data-entity=${m.entityId} data-group=${m.group}>
          <div class="device-entity-name">${m.name}</div>
          <div class="device-entity-choices">
            ${Fs(m).map(v=>l`
              <button type="button" class="add-choice" data-target=${v.target} data-type=${v.triggerType??""} @click=${()=>this._applySuggestion(v)}>
                <ha-icon icon=${v.icon}></ha-icon>
                <span>${v.target==="done_when"?n("beta_rules_done_when_suggest",e):kr(v.triggerType??"",e)}</span>
              </button>`)}
          </div>
        </div>`)}`}_renderSidebarBody(e,t){switch(e){case"task":return this._renderIdentity(t);case"schedule":return this._renderScheduleSection(t);case"trigger":return this._renderTriggerSection(t);case"completion":return this._renderCompletionSection(t);case"people":return this._renderPeopleSection(t);case"notifications":return this._renderNotificationsSection(t);default:return this._renderAddPicker(t)}}_renderRules(e){let t=ja(this._ruleDraft(),{lang:e,entityName:m=>_i(this.hass,m),userName:m=>this._userName(m)}),r=new Map(t.map(m=>[m.id,m])),o=[{title:n("task_section_details",e),ids:["task"]},{title:n("task_section_schedule",e),ids:["schedule","trigger"],add:!0},{title:n("task_section_completion",e),ids:["completion"]},{title:n("task_section_people",e),ids:["people"]},{title:n("task_section_notifications",e),ids:["notifications"]}],a=0,c=1,u=[];for(let m of o){a+=2,u.push(l`<h3 class="rules-group-title" style="order:${a}">${m.title}</h3>`);for(let f of m.ids){let v=r.get(f);if(!v)continue;a+=2,this._ruleSel===f&&(c=a+1);let w=this._ruleSel===f;u.push(l`
          <div class="rule-row ${w?"selected":""}" data-row=${v.id} style="order:${a}">
            <button type="button" class="rule-main" aria-expanded=${w?"true":"false"} @click=${()=>this._selectRule(v.id)}>
              <ha-icon icon=${v.icon}></ha-icon>
              <span class="rule-text">
                <span class="rule-sentence">${v.text}</span>
                ${v.chips.map(A=>l`<span class="rule-chip">${A}</span>`)}
                ${v.badges.length?l`<span class="rule-badges">${v.badges.map(A=>l`<span class="rule-badge">${A}</span>`)}</span>`:p}
              </span>
            </button>
            ${v.removable?l`
              <ha-icon-button class="rule-remove" .path=${Bd} .label=${n("remove",e)} title=${n("remove",e)}
                @click=${()=>this._removeRule(v.id)}></ha-icon-button>`:p}
          </div>`)}m.add&&(a+=2,this._ruleSel==="add"&&(c=a+1),u.push(l`
          <button type="button" class="rule-add" style="order:${a}" aria-expanded=${this._ruleSel==="add"?"true":"false"}
            @click=${()=>this._selectRule("add")}>
            <ha-icon icon="mdi:plus"></ha-icon>${n("beta_rules_add_rule",e)}
          </button>`))}let _=this._ruleSel;return l`
      <div class="rules-layout">
        ${u}
        <aside class="rules-sidebar ${_?"open":""}" style="order:${c}" aria-label=${_?this._sidebarTitle(_,e):n("beta_rules_select_hint",e)}>
          ${_?l`
                <div class="sidebar-head">
                  <ha-icon-button .path=${Wd} .label=${n("close",e)} @click=${()=>{this._ruleSel=null}}></ha-icon-button>
                  <span class="sidebar-title">${this._sidebarTitle(_,e)}</span>
                </div>
                <div class="sidebar-body">${this._renderSidebarBody(_,e)}</div>`:l`<div class="sidebar-hint">${n("beta_rules_select_hint",e)}</div>`}
        </aside>
      </div>`}_renderObjectChoice(e){return this._taskId!==null||this._objectChoices.length===0?p:l`
      <div class="select-row">
        ${F()?p:l`<label>${n("object",e)}</label>`}
        ${M({label:n("object",e),value:this._entryId,onChange:t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},l`
          ${this._objectChoices.map(t=>l`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
        `)}
      </div>`}_renderChooser(e){let t=(r,o,a,c,u)=>l`
      <button type="button" class="chooser-item ${r}" @click=${u}>
        <ha-icon icon=${o}></ha-icon>
        <span class="chooser-text">
          <span class="chooser-title">${a}</span>
          <span class="chooser-desc">${c}</span>
        </span>
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>`;return l`
      ${this._renderObjectChoice(e)}
      <div class="chooser">
        ${t("chooser-scratch","mdi:pencil",n("beta_new_scratch",e),n("beta_new_scratch_desc",e),()=>{this._betaStep="form",this._ruleSel="task"})}
        ${t("chooser-sensor","mdi:auto-fix",n("beta_new_from_sensor",e),n("beta_new_from_sensor_desc",e),()=>{this._betaStep="form",this._ruleSel="add",this._addTab="device",this._loadObjectDevice()})}
        ${t("chooser-template","mdi:text-box-outline",n("templates_from",e),n("beta_new_from_template_desc",e),()=>{this._betaStep="template",this._chooserFilter="",this._loadTemplateChoices()})}
        ${t("chooser-copy","mdi:content-copy",n("beta_new_copy",e),n("beta_new_copy_desc",e),()=>{this._betaStep="copy",this._chooserFilter="",this._loadCopyChoices()})}
      </div>`}_renderSearch(e){return l`<input type="search" class="chooser-search" aria-label=${n("beta_new_search",e)} placeholder=${n("beta_new_search",e)}
      .value=${this._chooserFilter} @input=${t=>{this._chooserFilter=t.target.value}} />`}_renderTemplatePick(e){if(this._templateChoices===null)return l`<div class="chooser-empty">…</div>`;let t=this._chooserFilter.trim().toLowerCase(),r=this._templateChoices.filter(o=>!t||`${o.name} ${o.template}`.toLowerCase().includes(t)).slice(0,200);return l`
      ${this._renderSearch(e)}
      <div class="chooser">
        ${r.length?r.map(o=>l`
          <button type="button" class="chooser-item template-task" @click=${()=>this._applyTemplateTask(o)}>
            <ha-icon icon=${o.schedule_type==="sensor_based"?"mdi:gauge":"mdi:calendar-sync"}></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${o.name}</span>
              <span class="chooser-desc">${o.template}${o.interval_days?l` · ${S(o.interval_days,e)} ${n("unit_days",e)}`:p}</span>
            </span>
          </button>`):l`<div class="chooser-empty">—</div>`}
      </div>`}_renderCopyPick(e){if(this._copyChoices===null)return l`<div class="chooser-empty">…</div>`;let t=this._chooserFilter.trim().toLowerCase(),r=this._copyChoices.filter(o=>!t||`${o.task.name} ${o.objectName}`.toLowerCase().includes(t)).slice(0,200);return l`
      ${this._renderSearch(e)}
      <div class="chooser">
        ${r.length?r.map(o=>l`
          <button type="button" class="chooser-item copy-task" @click=${()=>{this._applyCopy(o)}}>
            <ha-icon icon="mdi:content-copy"></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${o.task.name}</span>
              <span class="chooser-desc">${o.objectName}</span>
            </span>
          </button>`):l`<div class="chooser-empty">—</div>`}
      </div>`}_renderBeta(e,t,r){let o=this._betaStep;return l`
      <ha-dialog open class="beta-dialog" .headerTitle=${t}
        .headerSubtitle=${this._series.length>1?n("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length)):void 0}
        @closed=${this._close}>
        <!-- HA's header (2026): the title beside the close button; on a
             step under the start screen HA's back arrow takes its place. -->
        ${o==="template"||o==="copy"?l`<ha-icon-button slot="headerNavigationIcon" class="beta-back" .path=${Vd} .label=${n("back",e)}
              @click=${()=>{this._betaStep="choose"}}></ha-icon-button>`:p}
        <div class="content beta-content">
          ${this._error?U("error",this._error):p}
          ${this._warning?U("warning",this._warning):p}
          ${o==="choose"?this._renderChooser(e):o==="template"?this._renderTemplatePick(e):o==="copy"?this._renderCopyPick(e):this._renderRules(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${n("cancel",e)}</ha-button>
          ${o==="form"&&r?l`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${n("task_series_skip",e)}
              </ha-button>`:p}
          ${o==="form"?l`<ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}>
                ${this._loading?n("saving",e):n(r?"task_series_save_next":"save",e)}
              </ha-button>`:p}
        </div>
      </ha-dialog>
    `}render(){if(!this._open)return l``;let e=this._lang,t=this._taskId?n("edit_task",e):n("new_task",e),r=this._seriesIndex+1<this._series.length;return this.betaEditor?this._renderBeta(e,t,r):l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">
          ${t}
          ${this._series.length>1?l`<span class="series-position">${n("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length))}</span>`:p}
        </div>
        <div class="content">
          ${this._error?U("error",this._error):p}
          ${this._warning?U("warning",this._warning):p}
          ${this._renderIdentity(e)}
          ${this._renderScheduleSection(e)}
          ${this._renderTriggerSection(e)}
          ${this._renderCompletionSection(e)}
          ${this._renderPeopleSection(e)}
          ${this._renderNotificationsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${n("cancel",e)}</ha-button>
          ${r?l`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${n("task_series_skip",e)}
              </ha-button>`:p}
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}
          >
            ${this._loading?n("saving",e):n(r?"task_series_save_next":"save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};g._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calMonths","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),g.styles=[Fe,_o,Ha,$`
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
  `],d([b({attribute:!1})],g.prototype,"hass",2),d([b({type:Boolean,attribute:"checklists-enabled"})],g.prototype,"checklistsEnabled",2),d([b({type:Boolean,attribute:"schedule-time-enabled"})],g.prototype,"scheduleTimeEnabled",2),d([b({type:Boolean,attribute:"completion-actions-enabled"})],g.prototype,"completionActionsEnabled",2),d([b({type:Boolean,attribute:"adaptive-feature"})],g.prototype,"adaptiveFeature",2),d([b({type:Boolean,attribute:"seasonal-feature"})],g.prototype,"seasonalFeature",2),d([b({type:Boolean,attribute:"environmental-feature"})],g.prototype,"environmentalFeature",2),d([b({type:Number,attribute:"default-warning-days"})],g.prototype,"defaultWarningDays",2),d([b({attribute:!1})],g.prototype,"mirrorTodoDefault",2),d([b({type:Boolean,attribute:"beta-editor"})],g.prototype,"betaEditor",2),d([h()],g.prototype,"_ruleSel",2),d([h()],g.prototype,"_addTab",2),d([h()],g.prototype,"_betaStep",2),d([h()],g.prototype,"_chooserFilter",2),d([h()],g.prototype,"_templateChoices",2),d([h()],g.prototype,"_copyChoices",2),d([h()],g.prototype,"_objectDevice",2),d([h()],g.prototype,"parts",2),d([h()],g.prototype,"_foreignOwners",2),d([h()],g.prototype,"_open",2),d([h()],g.prototype,"_entityPickerFallback",2),d([h()],g.prototype,"_loading",2),d([h()],g.prototype,"_error",2),d([h()],g.prototype,"_warning",2),d([h()],g.prototype,"_entryId",2),d([h()],g.prototype,"_taskId",2),d([h()],g.prototype,"_series",2),d([h()],g.prototype,"_seriesIndex",2),d([h()],g.prototype,"_isFleetTask",2),d([h()],g.prototype,"_objectChoices",2),d([h()],g.prototype,"_name",2),d([h()],g.prototype,"_type",2),d([h()],g.prototype,"_scheduleType",2),d([h()],g.prototype,"_intervalDays",2),d([h()],g.prototype,"_intervalUnit",2),d([h()],g.prototype,"_dueDate",2),d([h()],g.prototype,"_warningDays",2),d([h()],g.prototype,"_earliestCompletionDays",2),d([h()],g.prototype,"_intervalAnchor",2),d([h()],g.prototype,"_weekdays",2),d([h()],g.prototype,"_nth",2),d([h()],g.prototype,"_nthWeekday",2),d([h()],g.prototype,"_domDay",2),d([h()],g.prototype,"_domLastDay",2),d([h()],g.prototype,"_domBusiness",2),d([h()],g.prototype,"_calOffset",2),d([h()],g.prototype,"_calMonths",2),d([h()],g.prototype,"_calendarEntity",2),d([h()],g.prototype,"_seasonMonths",2),d([h()],g.prototype,"_endsMode",2),d([h()],g.prototype,"_endsCount",2),d([h()],g.prototype,"_endsUntil",2),d([h()],g.prototype,"_schedulePreview",2),d([h()],g.prototype,"_schedulePreviewEnded",2),d([h()],g.prototype,"_notes",2),d([h()],g.prototype,"_documentationUrl",2),d([h()],g.prototype,"_customIcon",2),d([h()],g.prototype,"_notifyIcon",2),d([h()],g.prototype,"_priority",2),d([h()],g.prototype,"_labels",2),d([h()],g.prototype,"_detailsOpen",2),d([h()],g.prototype,"_mirrorTodoEntities",2),d([h()],g.prototype,"_mirrorTodoMode",2),d([h()],g.prototype,"_completeWhenEntity",2),d([h()],g.prototype,"_completeWhenState",2),d([h()],g.prototype,"_completeWhenAnyTime",2),d([h()],g.prototype,"_completeWhenFor",2),d([h()],g.prototype,"_enabled",2),d([h()],g.prototype,"_triggerEntityId",2),d([h()],g.prototype,"_triggerEntityIds",2),d([h()],g.prototype,"_triggerEntityLogic",2),d([h()],g.prototype,"_triggerAttribute",2),d([h()],g.prototype,"_triggerType",2),d([h()],g.prototype,"_triggerAbove",2),d([h()],g.prototype,"_triggerBelow",2),d([h()],g.prototype,"_triggerEquals",2),d([h()],g.prototype,"_triggerNotEquals",2),d([h()],g.prototype,"_triggerForMinutes",2),d([h()],g.prototype,"_triggerCombinator",2),d([h()],g.prototype,"_triggerTargetValue",2),d([h()],g.prototype,"_triggerDeltaMode",2),d([h()],g.prototype,"_triggerBaselineValue",2),d([h()],g.prototype,"_liveBaselineValue",2),d([h()],g.prototype,"_autoCompleteOnRecovery",2),d([h()],g.prototype,"_holdUntilDone",2),d([h()],g.prototype,"_triggerFromState",2),d([h()],g.prototype,"_triggerToState",2),d([h()],g.prototype,"_triggerTargetChanges",2),d([h()],g.prototype,"_triggerRuntimeHours",2),d([h()],g.prototype,"_triggerDaysBefore",2),d([h()],g.prototype,"_triggerRuntimeMaxSession",2),d([h()],g.prototype,"_triggerOnStates",2),d([h()],g.prototype,"_triggerDetailAttribute",2),d([h()],g.prototype,"_compoundLogic",2),d([h()],g.prototype,"_compoundConditions",2),d([h()],g.prototype,"_suggestedAttributes",2),d([h()],g.prototype,"_availableAttributes",2),d([h()],g.prototype,"_entityDomain",2),d([h()],g.prototype,"_lastPerformed",2),d([h()],g.prototype,"_nfcTagId",2),d([h()],g.prototype,"_requireTagScan",2),d([h()],g.prototype,"_allowSkip",2),d([h()],g.prototype,"_notifyEnabled",2),d([h()],g.prototype,"_readingUnit",2),d([h()],g.prototype,"_readings",2),d([h()],g.prototype,"_consumesParts",2),d([h()],g.prototype,"_consumesQtyText",2),d([h()],g.prototype,"_partsLoadFailed",2),d([h()],g.prototype,"_availableTags",2),d([h()],g.prototype,"_responsibleUserId",2),d([h()],g.prototype,"_assigneePool",2),d([h()],g.prototype,"_rotationStrategy",2),d([h()],g.prototype,"_availableUsers",2),d([h()],g.prototype,"_checklistText",2),d([h()],g.prototype,"_phaseDefs",2),d([h()],g.prototype,"_phaseSeq",2),d([h()],g.prototype,"_requiredCompletion",2),d([h()],g.prototype,"_scheduleTime",2),d([h()],g.prototype,"_scheduleTimeOn",2),d([h()],g.prototype,"_actionService",2),d([h()],g.prototype,"_actionTargetEntity",2),d([h()],g.prototype,"_actionSkipAuto",2),d([h()],g.prototype,"_actionPresent",2),d([h()],g.prototype,"_actionData",2),d([h()],g.prototype,"_actionDataJsonFallback",2),d([h()],g.prototype,"_actionTesting",2),d([h()],g.prototype,"_actionTestResult",2),d([h()],g.prototype,"_actionTestError",2),d([h()],g.prototype,"_quickOn",2),d([h()],g.prototype,"_qcNotes",2),d([h()],g.prototype,"_qcCost",2),d([h()],g.prototype,"_qcDuration",2),d([h()],g.prototype,"_qcFeedback",2),d([h()],g.prototype,"_environmentalEntity",2),d([h()],g.prototype,"_environmentalAttribute",2),d([h()],g.prototype,"_adaptiveEnabled",2),d([h()],g.prototype,"_adaptiveAlpha",2),d([h()],g.prototype,"_adaptiveMin",2),d([h()],g.prototype,"_adaptiveMax",2),d([h()],g.prototype,"_adaptiveSeasonal",2),d([h()],g.prototype,"_adaptivePrediction",2),d([h()],g.prototype,"_conditionAttrOptions",2);Bs=g;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",Bs)});function ep(i,s){i.key!=="Escape"||i.defaultPrevented||i.composedPath().some(e=>e instanceof Element&&e.localName==="ms-camera-capture")||(i.preventDefault(),i.stopPropagation(),s())}function dt(){return se("ha-adaptive-dialog")}function Ft(i,s,e={}){return dt()?l`
      <ha-adaptive-dialog open .headerTitle=${e.title}
        @closed=${t=>{t.target===t.currentTarget&&i()}}>
        <div class="ha-shell-body">${s}</div>
      </ha-adaptive-dialog>
    `:l`
    <div class="modal-layer top-layer" popover="manual" ${fr}>
      <div class="backdrop" @click=${i}></div>
      <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
        @keydown=${t=>ep(t,i)}>${s}</div>
    </div>
  `}function Ut(i){i?.querySelector(".dialog")?.focus({preventScroll:!0})}var zt,Tr=x(()=>{"use strict";I();ne();Ns();zt=$`
  ${vr}
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
`});var K,el=x(()=>{"use strict";I();z();P();ne();Us();$i();K=class extends T{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._check="";this._checked=!0;this._resolve=null;this._promptResolve=null;this._checkResolve=null}_show(e){this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"",this._options=e.options&&e.options.length?e.options:null,this._inputValue=e.inputValue||"",this._check=e.check||"",this._checked=!0,this._resolve=null,this._promptResolve=null,this._checkResolve=null,this._open=!0}confirm(e){return this._show(e),new Promise(t=>this._resolve=t)}confirmWithCheck(e){return this._show(e),new Promise(t=>this._checkResolve=t)}prompt(e){return this._show(e),new Promise(t=>this._promptResolve=t)}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._checkResolve?.({confirmed:!1,checked:!1}),this._checkResolve=null,this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._checkResolve?.({confirmed:!0,checked:this._checked}),this._checkResolve=null,this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return p;let e=N(this.hass);return l`
      <ha-dialog open .headerTitle=${Te(this._title)} @closed=${this._cancel}>
        ${Se(this._title)}
        <div class="content">
          ${this._message}
          ${this._check?j({cls:"confirm-check",checked:this._checked,onChange:t=>this._checked=t.target.checked},this._check):p}
          ${this._inputLabel?l`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?l`${M({cls:"field-input field-select",onChange:t=>this._inputValue=t.target.value},l`
                    ${this._options.map(t=>l`<option value=${t.value} ?selected=${t.value===this._inputValue}>${t.label}</option>`)}
                  `)}`:l`<input class="field-input"
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
            variant=${this._danger?"danger":"brand"}
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `}};K.styles=[Fe,$`
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
  `],d([b({attribute:!1})],K.prototype,"hass",2),d([h()],K.prototype,"_open",2),d([h()],K.prototype,"_title",2),d([h()],K.prototype,"_message",2),d([h()],K.prototype,"_confirmText",2),d([h()],K.prototype,"_danger",2),d([h()],K.prototype,"_inputLabel",2),d([h()],K.prototype,"_inputType",2),d([h()],K.prototype,"_options",2),d([h()],K.prototype,"_inputValue",2),d([h()],K.prototype,"_check",2),d([h()],K.prototype,"_checked",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",K)});function tp(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function Ws(i){let s=tp(),e=s.querySelector(`${tl}[${il}]`);return e||(e=document.createElement(tl),e.setAttribute(il,""),s.appendChild(e)),e.hass=i,e}function Ei(i,s){return Ws(i).confirm(s)}var tl,il,Sr=x(()=>{"use strict";el();tl="maintenance-confirm-dialog",il="data-ms-lovelace-confirm"});var Ye,Vs=x(()=>{"use strict";I();z();ps();Ye=class extends T{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await ds(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?p:this._url?l`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:l`<div class="ph"></div>`}};Ye.styles=$`
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
  `,d([b({attribute:!1})],Ye.prototype,"hass",2),d([b()],Ye.prototype,"docId",2),d([h()],Ye.prototype,"_url",2),d([h()],Ye.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",Ye)});var ie,rl=x(()=>{"use strict";I();z();P();me();Z();pi();Tr();Is();dr();Sr();Dt();pr();Vs();ki();ki();Ke();ie=class extends T{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new Nt(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return N(this.hass)}openEdit(e){this._openGen++,this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(e.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(e),this._loadPartOptions()}_seedReadings(e){let t=[],r=new Set;for(let a of e.readings??[])r.has(a.id)||(r.add(a.id),t.push({id:a.id,name:a.name,unit:a.unit??null}));for(let a of e.reading_values??[])r.has(a.id)||(r.add(a.id),t.push({id:a.id,name:a.name,unit:a.unit??null}));this._readingRows=t;let o={};for(let a of e.reading_values??[])o[a.id]=String(a.value);this._readingText=o,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let e={};for(let t of this._readingRows){let r=(this._readingText[t.id]??"").trim();if(r==="")continue;let o=parseFloat(r.replace(",","."));isNaN(o)||(e[t.id]=o)}return e}async _loadPartOptions(){let e=this._draft;if(!e)return;let t=this._openGen;try{let r=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(t!==this._openGen)return;let o=[];for(let c of r.parts||[]){let u=c.entry_id===e.entry_id,_=c.consumers.some(m=>m.entry_id===e.entry_id&&m.task_id===e.task_id);!u&&!_||o.push({part_id:c.part_id,name:c.name,entry_id:c.entry_id,foreign:!u,object_name:c.object_name})}for(let c of e.used_parts||[]){let u=c.entry_id||e.entry_id;o.some(_=>_.part_id===c.part_id&&_.entry_id===u)||o.push({part_id:c.part_id,name:c.name||c.part_id,entry_id:u,foreign:u!==e.entry_id,object_name:null})}let a={};for(let c of e.used_parts||[])a[`${c.entry_id||e.entry_id}:${c.part_id}`]=c.quantity??1;this._partOptions=o,this._partQty=a,this._partQtyOriginal=this._partSelectionKey()}catch{if(t!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,e])=>e>0).sort(([e],[t])=>e.localeCompare(t)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let e=this._lang,r=(this._originalSnapshot.used_parts||[]).filter(u=>u.quantity>0).map(u=>`${S(u.quantity,e)}\xD7 ${u.name||u.part_id}`).join(", ");if(!await Ei(this.hass,{title:n("history_delete_entry",e),message:r?`${n("history_delete_confirm_entry",e)} ${n("history_delete_returns_parts",e).replace("{parts}",r)}`:n("history_delete_confirm_entry",e),confirmText:n("delete",e),danger:!0})||!this._draft||!this._originalSnapshot)return;let a=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:a.entry_id,task_id:a.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:a.entry_id,task_id:a.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(e){return L(this,e,{busy:t=>{this._saving=t},onError:t=>{this._error=t}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let e=this._draft,t=this._originalSnapshot,r={type:"maintenance_supporter/task/history/update",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:t.original_timestamp};if(e.timestamp!==t.timestamp&&(r.timestamp=e.timestamp),e.notes!==t.notes&&(r.notes=e.notes),e.cost!==t.cost&&(r.cost=e.cost),e.duration!==t.duration&&(r.duration=e.duration),e.completed_by!==t.completed_by&&(r.completed_by=e.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(r.used_parts=(this._partOptions||[]).filter(a=>(this._partQty[`${a.entry_id}:${a.part_id}`]||0)>0).map(a=>({part_id:a.part_id,quantity:this._partQty[`${a.entry_id}:${a.part_id}`],...a.foreign?{entry_id:a.entry_id}:{}}))),e.reading_value!==t.reading_value&&(r.reading_value=e.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let a=this._readingNumbers(),c={};for(let u of this._readingRows)c[u.id]=a[u.id]??null;r.reading_values=c}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(r.photo_doc_ids=this._photos.ids),Object.keys(r).filter(a=>!["type","entry_id","task_id","original_timestamp"].includes(a)).length===0){this.close();return}await this._runWs(r)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:e.entry_id,task_id:e.task_id,new_timestamp:e.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return p;let e=this._lang,t=this._draft,r=this._error||this._photos.errorText(e);return Ft(()=>this.close(),l`
        ${dt()?p:l`<h2>${n("history_edit_title",e)}</h2>`}
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
          .helper=${Vi(e)}
          .value=${Qn(t.timestamp)}
          @value-changed=${o=>{let a=o.detail.value;a&&this._set("timestamp",a)}}
        ></ms-date-field>
        <label>
          <span>${n("notes_label",e)}</span>
          <textarea
            rows="3"
            @input=${o=>{let a=o.target.value;this._set("notes",a||null)}}
            .value=${t.notes??""}></textarea>
        </label>
        <div class="row">
          <div class="cost-field">
            <span>${n("cost",e)}</span>
            <ms-cost-input .lang=${e} .value=${t.cost!=null?String(t.cost):""}
              @value-changed=${o=>{let a=o.detail.value;this._set("cost",a?Number(a):null)}}></ms-cost-input>
          </div>
          <label>
            <span>${n("duration",e)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${t.duration!=null?String(t.duration):""}
              @input=${o=>{this._set("duration",lt(o.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(t,e)}
        ${this._partOptions&&this._partOptions.length>0?l`
          <div class="parts-block">
            <span class="parts-title">${n("complete_parts_used",e)}</span>
            ${this._partOptions.map(o=>{let a=`${o.entry_id}:${o.part_id}`,c=this._partQty[a]||0;return l`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${c>0}
                    @change=${u=>{let _=u.target.checked;this._partQty={...this._partQty,[a]:_?1:0}}} />
                  <span class="part-label">${o.name}${o.foreign&&o.object_name?` (${o.object_name})`:""}</span>
                  ${c>0?l`
                    <input class="part-qty" type="number" min=${We[0]} max=${We[1]} step="0.01"
                      .value=${String(c)}
                      @input=${u=>{let _=parseFloat(u.target.value);!isNaN(_)&&_>0&&(this._partQty={...this._partQty,[a]:_})}} />
                  `:p}
                </label>
              `})}
          </div>
        `:p}
        <div class="photos-block">
          <span class="parts-title">${n("completion_photos",e)}</span>
          ${this._photos.photos.length>0?l`
            <div class="photo-strip">
              ${this._photos.photos.map(o=>l`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${o.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${n("remove",e)}
                    @click=${()=>this._photos.remove(o.id)}>✕</button>
                </div>`)}
            </div>`:p}
          ${this._photos.full?l`<span class="photos-hint">${n("photos_limit",e).replace("{max}",String(this._photos.max))}</span>`:l`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${o=>this._photos.addFiles(o.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${n("history_edit_photos_hint",e)}</span>
        </div>
        ${r?U("error",r):p}
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
    `,{title:n("history_edit_title",e)})}updated(e){e.has("_open")&&this._open&&Ut(this.shadowRoot)}_renderReadings(e,t){return this._readingRows.length>0?l`
        <div class="readings-block">
          <span class="parts-title">${n("readings_section",t)}</span>
          ${this._readingRows.map(r=>l`
            <label class="reading-row-edit">
              <span class="reading-row-name">${r.name}${r.unit?` (${r.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[r.id]??""}
                @input=${o=>{this._readingText={...this._readingText,[r.id]:o.target.value}}} />
            </label>
          `)}
        </div>`:e.reading_value==null&&e.task_type!=="reading"?p:l`
      <label>
        <span>${n("reading_value_label",t)}${e.reading_unit?` (${e.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${e.reading_value!=null?String(e.reading_value):""}
          @input=${r=>{let o=r.target.value,a=o===""?NaN:Number(o);this._set("reading_value",isNaN(a)?null:a)}} />
      </label>`}};ie.styles=[yr,zt,$`
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
  `],d([b({attribute:!1})],ie.prototype,"hass",2),d([h()],ie.prototype,"_open",2),d([h()],ie.prototype,"_saving",2),d([h()],ie.prototype,"_error",2),d([h()],ie.prototype,"_draft",2),d([h()],ie.prototype,"_partOptions",2),d([h()],ie.prototype,"_partQty",2),d([h()],ie.prototype,"_readingRows",2),d([h()],ie.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",ie)});function Qe(i){return String(i??"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[s])}var sl=x(()=>{"use strict"});function Gs(i){return!i.startsWith("data:image/svg+xml,")&&!i.startsWith("data:image/png;base64,")?"":Qe(i)}function ip(i){return i.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var J,nl=x(()=>{"use strict";I();z();P();wt();cs();sl();ne();Ke();J=class extends T{constructor(){super(...arguments);this.lang="";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._quickResult=null;this._quickValues=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}get _dialogLang(){return this.lang||N(this.hass)}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}openForTask(e,t,r,o){this._entryId=e,this._taskId=t,this._objectName=r,this._taskName=o,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._quickValues=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let r=[this.hass.connection.sendMessagePromise({...t,action:"view"})];if(this._taskId){if(r.push(this.hass.connection.sendMessagePromise({...t,action:"complete"})),this._quickValues=await this._quickCompleteValues(),e!==this._generateSeq)return;this._quickValues&&r.push(this.hass.connection.sendMessagePromise({...t,action:"quick_complete"}))}let o=await Promise.all(r);if(e!==this._generateSeq)return;this._viewResult=o[0],o.length>1&&(this._completeResult=o[1]),o.length>2&&(this._quickResult=o[2])}catch(t){if(e!==this._generateSeq)return;let r=t?.code,o=t?.message;this._error=r==="no_url"||typeof o=="string"&&o.includes("No Home Assistant URL")?n("qr_error_no_url",this._dialogLang):n("qr_error",this._dialogLang)}finally{e===this._generateSeq&&(this._loading=!1)}}async _quickCompleteValues(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});return Yi((e.tasks||[]).find(t=>t.id===this._taskId))}catch{return null}}_quickRecords(e){let t=this._quickValues??{},r=[t.notes?`\u201C${t.notes.length>40?`${t.notes.slice(0,39)}\u2026`:t.notes}\u201D`:"",t.cost!=null?`${n("quick_complete_defaults_cost",e)} ${X(t.cost,void 0,e)}`:"",t.duration!=null?yt(t.duration,e):""].filter(Boolean);return r.length?n("qr_quick_records",e).replace("{values}",r.join(", ")):n("qr_quick_records_nothing",e)}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,r=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),o=window.open("","_blank","width=600,height=500");if(!o)return;let a=this._dialogLang,c=Qe(t),u=Qe(r),_=!!this._completeResult,m=!!this._quickResult,f=Qe(n("qr_action_view",a)),v=Qe(n("qr_action_complete",a)),w=Qe(n("qr_action_quick_complete",a));o.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
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
${u?`<div class="sub">${u}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${Gs(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${f}</div>
  </div>
  ${_?`<div class="qr-col">
    <img src="${Gs(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${v}</div>
  </div>`:""}
  ${m?`<div class="qr-col">
    <img src="${Gs(this._quickResult.svg_data_uri)}" alt="QR Quick-complete" />
    <div class="qr-label">${w}</div>
  </div>`:""}
</div>
<div class="url">${Qe(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),o.document.close()}_downloadSvg(e,t){let r=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),o=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;To(r,`qr-${ip(o)}-${t}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._quickResult=null,this._error="",this._loading=!1}render(){if(!this._open)return l``;let e=this._dialogLang,t=this._taskName?`${n("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${n("qr_code",e)}: ${this._objectName}`,r=!!this._viewResult;return l`
      <ha-dialog open .headerTitle=${Te(t)} @closed=${this._close}>
        ${Se(t)}
        <div class="content">
          ${this._loading?l`<div class="loading">${n("qr_generating",e)}</div>`:this._error?U("error",this._error):r?l`
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
                              <div class="qr-quick-records">${this._quickRecords(e)}</div>
                              <button class="dl-btn"
                                @click=${()=>this._downloadSvg(this._quickResult,"quick-complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${n("qr_download",e)}
                              </button>
                            </div>
                          `:p}
                    </div>
                    ${this._taskId&&!this._quickResult?l`<div class="qr-quick-off">${n("qr_quick_complete_off",e)}</div>`:p}
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
            .disabled=${!r}
          >
            ${n("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};J.styles=$`
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
  `,d([b({attribute:!1})],J.prototype,"hass",2),d([b()],J.prototype,"lang",2),d([h()],J.prototype,"_open",2),d([h()],J.prototype,"_loading",2),d([h()],J.prototype,"_error",2),d([h()],J.prototype,"_viewResult",2),d([h()],J.prototype,"_completeResult",2),d([h()],J.prototype,"_quickResult",2),d([h()],J.prototype,"_quickValues",2),d([h()],J.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",J)});function ol(i,s,e=new Date){let t=i?.hours,r=Y(i?.snoozed_until);if(typeof t!="number"||!Number.isFinite(r))return n("snoozed",s);let o=Me(),c=He(r,o)===He(e,o)?Bi(new Date(r),s):Wi(i.snoozed_until,s);return Ui("snoozed_for","snoozed_for_one",t,s,"hours").replace("{until}",c)}var al=x(()=>{"use strict";P();Z()});function Ar(i){if(!i)return p;if(customElements.get("ha-markdown")){let{content:s,links:e}=np(i);return l`<ha-markdown
      class="notes-md"
      .content=${s}
      breaks
      ${Mt(t=>op(t,e))}
    ></ha-markdown>`}return l`${i}`}function np(i){let s=[],e=o=>{let a=hs(o);return!a||rp.has(a)||!$t(o)?null:(s.push(us(o)),`${Ys}${s.length-1}`)},t=o=>o.replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)<(${Cr}[^>\\n]*)>`,"g"),(a,c,u,_)=>{let m=c?null:e(_);return m?`${u}${m}`:a}).replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)(${Cr}[^\\s)]*)`,"g"),(a,c,u,_)=>{let m=c?null:e(_);return m?`${u}${m}`:a}).replace(new RegExp(`(^|[^(])<(${Cr}[^\\s<>]*)>`,"gm"),(a,c,u)=>{let _=e(u);return _?`${c}[${u.replace(/([\\[\]])/g,"\\$1")}](${_})`:a}).replace(new RegExp(`^( {0,3}\\[[^\\]\\n]+\\]:[ \\t]*)<?(${Cr}[^\\s>]*)>?`,"gm"),(a,c,u)=>{let _=e(u);return _?`${c}${_}`:a});return{content:i.split(sp).map((o,a)=>a%2?o:t(o)).join(""),links:s}}function Ks(i,s){for(let e of i.querySelectorAll(`a[href^="${Ys}"]`)){let t=s[Number(e.getAttribute("href").slice(Ys.length))];t&&e.setAttribute("href",t)}}function op(i,s){if(!i)return;let e=ll.get(i);if(!e&&s.length===0)return;if(e){e.links=s,i.shadowRoot&&Ks(i.shadowRoot,s);return}let t={links:s};ll.set(i,t),(async()=>{await i.updateComplete;let r=i.shadowRoot;r&&(new MutationObserver(()=>Ks(r,t.links)).observe(r,{childList:!0,subtree:!0}),Ks(r,t.links))})()}var Ys,rp,sp,Cr,ll,Qs=x(()=>{"use strict";I();gr();Ji();Ys="https://app-link.invalid/",rp=new Set(["http","https","mailto","tel","ftp"]),sp=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/,Cr="[a-zA-Z][a-zA-Z0-9+.-]+:";ll=new WeakMap});var cl=x(()=>{"use strict"});function dl(i,s,e,t){let r=e,o=u=>typeof u=="string"?u:null,a=u=>typeof u=="number"?u:null,c=o(r.timestamp)??"";return{entry_id:i,task_id:s,original_timestamp:c,type:o(r.type)||"completed",timestamp:c,notes:o(r.notes),cost:a(r.cost),duration:a(r.duration),completed_by:o(r.completed_by),used_parts:Array.isArray(r.used_parts)?r.used_parts:null,photo_doc_ids:gi(r),reading_value:a(r.reading_value),reading_values:Be(r),readings:t?.readings??[],task_type:t?.type??null,reading_unit:t?.reading_unit??null}}var pl=x(()=>{"use strict";fi();at();cl()});function ap(i){return i&&ul(i.ref_no)?String(i.ref_no):null}function hl(i,s){let e=ap(i);return e&&s&&ul(s.ref_no)?`${e}.${s.ref_no}`:null}function _l(i,s){return i?l`<span class="ref-chip" title=${s??""}>#${i}</span>`:p}var ul,Zs=x(()=>{"use strict";I();ul=i=>typeof i=="number"&&Number.isInteger(i)&&i>0});var Js=x(()=>{"use strict"});function ml(i,s){if(!i)return"";let e=lp[i.trim()];if(e)return n(e,s);for(let[t,r,o]of cp){let a=i.trim().match(t);if(a){let c=o(a,s);return n(r,s).replace(/\{(\w+)\}/g,(u,_)=>c[_]??u)}}return i}var lp,cp,gl=x(()=>{"use strict";P();lp={"Completed from dashboard button":"hist_note_button","Auto-completed: sensor recovered":"hist_note_auto_recovered_plain","Completed from the To-do list":"hist_note_todo","Completed by voice":"hist_note_voice","Completed from the notification":"hist_note_notification","Completed via NFC tag":"hist_note_nfc","Completed from the shopping list":"hist_note_shopping_list","Completed from a mirrored to-do list":"hist_note_todo_mirror","Skipped from notification":"hist_note_skipped_notification","Skipped from dashboard button":"hist_note_skipped_button","Sensor trigger activated":"hist_note_sensor_triggered","Initial value set during task creation":"hist_note_initial"},cp=[[/^Auto-completed: sensor recovered \((.+)\)$/,"hist_note_auto_recovered",i=>({value:i[1]})],[/^Auto-completed: (.+) changed to (.+)$/,"hist_note_auto_entity",i=>({entity:i[1],state:i[2]})],[/^Reset to (\d{4}-\d{2}-\d{2})$/,"hist_note_reset",(i,s)=>({date:D(i[1],s)})],[/^Trigger entity replaced: (.+) → (.+)$/,"hist_note_trigger_replaced",i=>({old:i[1],new:i[2]})],[/^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,"hist_note_trigger_removed",(i,s)=>({entity:i[1],schedule:n(i[2],s)})],[/^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,"hist_note_compound_removed",i=>({entity:i[1],count:i[2]})]]});function fl(i){let s=e=>{let t=Y(e.timestamp);return Number.isNaN(t)?-1/0:t};return(i??[]).map((e,t)=>({entry:e,index:t,at:s(e)})).sort((e,t)=>t.at-e.at||t.index-e.index).map(e=>e.entry)}function pp(i,s){return i.taskRef&&s.ref_no?`${i.taskRef}-${s.ref_no}`:null}function up(i,s){let e=gi(s);return e.length>0?l`<div class="history-photos">
        ${e.map(t=>l`<maintenance-history-photo .hass=${i} .docId=${t}></maintenance-history-photo>`)}
      </div>`:p}function hp(i,s){let e=s.lang,t=a=>S(a,e,{maximumFractionDigits:3}),r=a=>a==null?"":` (${a>=0?"+":""}${t(a)})`,o=Be(i);return o.length>0?l`<div class="history-readings">
      ${o.map(a=>l`<span class="history-reading">
        <span class="history-reading-name">${a.name}</span>
        <span class="history-reading-value">${t(a.value)}${a.unit?` ${a.unit}`:""}${r(s.readingSlotDelta?.(i,a.id))}</span>
      </span>`)}
    </div>`:i.reading_value!=null?l`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${n("reading_label",e)}</span>
      <span class="history-reading-value">${t(i.reading_value)}${s.readingUnit?` ${s.readingUnit}`:""}${r(s.readingDelta?.(i))}</span>
    </span></div>`:p}function vl(i,s,e={}){let t=s.lang,{compact:r=!1,showRef:o=!0,showBadges:a=!0,showEdit:c=!0,showHead:u=!0}=e,_=s.openEdit,m=c&&!!_&&Dn.includes(i.type),f=typeof i.parts_cost=="number"?i.parts_cost:null,v=i.cost_basis==="use",w=v&&!!i.purchase;return l`
    <div class="history-entry${r?" compact":""}">
      ${r?p:l`<div class="history-icon ${i.type}" style="background: ${Fr(i.type)}">
            <ha-icon .icon=${ii[i.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        ${u?l`<div class="history-row">
          <strong>${n(i.type,t)}</strong>
          ${o?_l(pp(s,i),n("ref_number",t)):p}
          ${a&&i.phase_id?l`<span class="history-phase-badge">${s.phaseNames?.[i.phase_id]||i.phase_id}</span>`:p}
          ${a&&i.auto?l`<span class="history-auto-badge">${n("history_auto",t)}</span>`:p}
          ${m?l`<button class="history-edit-btn"
                     title=${n("history_edit_button",t)}
                     @click=${()=>_(i)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:p}
        </div>
        <div class="history-date">${Wi(i.timestamp,t)}</div>`:p}
        ${i.notes?l`<div class="history-notes">${ml(i.notes,t)}</div>`:p}
        ${up(s.hass,i)}
        ${hp(i,s)}
        ${i.cost!=null||i.duration!=null||i.trigger_value!=null||f!=null?l`<div class="history-details">
              ${i.cost!=null?w?l`<span>${n("history_purchase_stock",t).replace("{amount}",X(i.cost,s.currencySymbol,t))}</span>`:i.cost<0?l`<span class="history-credit">${lo(i.cost,s.currencySymbol,t)}</span>`:l`<span>${n("cost",t)}: ${X(i.cost,s.currencySymbol,t)}</span>`:p}
              ${f!=null?l`<span title=${n(v?"history_parts_counted_hint":"history_parts_info_hint",t)}>${n(v?"history_parts_counted":"history_parts_info",t).replace("{amount}",X(f,s.currencySymbol,t))}</span>`:p}
              ${i.duration!=null?l`<span>${n("duration",t)}: ${yt(i.duration,t)}</span>`:p}
              ${i.trigger_value!=null?l`<span>${n("trigger_val",t)}: ${i.trigger_value}${s.triggerUnit?` ${s.triggerUnit}`:""}</span>`:p}
            </div>`:p}
      </div>
    </div>
  `}var bl=x(()=>{"use strict";I();P();Vs();fi();Zs();at();Js();gl();Z();je()});async function yl(i,s,e){if(!i)return null;let t={title:n("delete",e),confirmText:n("delete",e),danger:!0};if(!s?.part_ref)return await i.confirm({...t,message:n("delete_task_confirm",e)})?{}:null;let r=await i.confirmWithCheck({...t,message:n("delete_buy_task_confirm",e),check:n("delete_buy_task_off",e)});return r.confirmed?r.checked?{disable_auto_buy_task:!0}:{}:null}var xl=x(()=>{"use strict";P()});var Ir,wl=x(()=>{"use strict";Ir=class{constructor(){this._handle=null}schedule(s,e=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,s()},e)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}}});function kl(i,s){let e=i.interval_analysis,t=e?.weibull_beta,r=e?.weibull_eta;if(t==null||r==null||r<=0)return p;let o=i.interval_days??0,a=i.suggested_interval??o;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${n("weibull_reliability_curve",s)}
        ${_p(t,s)}
      </div>
      ${mp(t,r,o,a,s)}
      ${gp(e,s)}
      ${e?.confidence_interval_low!=null?fp(e,i,s):p}
    </div>
  `}function _p(i,s){let e,t,r;return i<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",r="beta_early_failures"):i<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",r="beta_random_failures"):i<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",r="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",r="beta_highly_predictable"),l`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${n(r,s)} (\u03B2=${S(i,s,2)})
    </span>
  `}function mp(i,s,e,t,r){let w=Math.max(e,t,s,1)*1.3,A=50,k=[];for(let le=0;le<=A;le++){let _e=le/A*w,Kl=1-Math.exp(-Math.pow(_e/s,i)),Yl=32+_e/w*260,Ql=136-Kl*128;k.push([Yl,Ql])}let E=k.map(([le,_e])=>`${O(le)},${O(_e)}`).join(" "),y="M32,136 "+k.map(([le,_e])=>`L${O(le)},${O(_e)}`).join(" ")+` L${O(k[A][0])},136 Z`,R=32+e/w*260,xe=1-Math.exp(-Math.pow(e/s,i)),ut=136-xe*128,Vl=S((1-xe)*100,r,0),cn=32+t/w*260,Gl=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_weibull",r)}">
        ${Gl.map(le=>{let _e=136-le*128;return _t`
            <line x1="${32}" y1="${O(_e)}" x2="${292}" y2="${O(_e)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${le===.5?"4,3":p}" />
            <text x="${28}" y="${O(_e+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${S(le*100,r,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(w/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(w)}</text>

        <path d="${y}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${E}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?_t`
          <line x1="${O(R)}" y1="${8}" x2="${O(R)}" y2="${O(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${O(R)}" cy="${O(ut)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${O(R+4)}" y="${O(ut-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Vl}%</text>
        `:p}

        ${t>0&&t!==e?_t`
          <line x1="${O(cn)}" y1="${8}" x2="${O(cn)}" y2="${O(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:p}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${n("weibull_failure_probability",r)}</span>
      ${e>0?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${n("current_interval_marker",r)}</span>`:p}
      ${t>0&&t!==e?l`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${n("recommended_marker",r)}</span>`:p}
    </div>
  `}function gp(i,s){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${n("characteristic_life",s)}</span>
        <span class="weibull-info-value">${nt(Math.round(i.weibull_eta),s)}</span>
      </div>
      ${i.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${n("weibull_r_squared",s)}</span>
          <span class="weibull-info-value">${S(i.weibull_r_squared,s,3)}</span>
        </div>
      `:p}
    </div>
  `}function fp(i,s,e){let t=i.confidence_interval_low,r=i.confidence_interval_high,o=s.suggested_interval??s.interval_days??0,a=s.interval_days??0,c=Math.max(0,t-5),_=r+5-c,m=(t-c)/_*100,f=(r-t)/_*100,v=(o-c)/_*100,w=a>0?(a-c)/_*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${n("confidence_interval",e)}: ${nt(o,e)} (${t}\u2013${r})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${O(m)}%;width:${O(f)}%"></div>
        ${w>=0?l`<div class="confidence-marker current" style="left:${O(w)}%"></div>`:p}
        <div class="confidence-marker recommended" style="left:${O(v)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${n("confidence_conservative",e)} (${t}${n("days",e).charAt(0)})</span>
        <span class="confidence-text high">${n("confidence_aggressive",e)} (${r}${n("days",e).charAt(0)})</span>
      </div>
    </div>
  `}var $l=x(()=>{"use strict";I();P();hi()});function Xs(i){return Math.max(1,Math.round(i||0))}function El(i,s,e){let t=i.degradation_trend!=null&&i.degradation_trend!=="insufficient_data",r=i.days_until_threshold!=null,o=i.environmental_factor!=null&&i.environmental_factor!==1;if(!t&&!r&&!o)return p;let a=i.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":i.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
    <div class="prediction-section">
      ${i.sensor_prediction_urgency?l`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${n(os(Xs(i.days_until_threshold),s,vp),s).replace("{days}",String(Xs(i.days_until_threshold)))}
        </div>
      `:p}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${n("sensor_prediction",s)}
      </div>
      <div class="prediction-grid">
        ${t?l`
          <div class="prediction-item">
            <ha-svg-icon path="${a}"></ha-svg-icon>
            <span class="prediction-label">${n("degradation_trend",s)}</span>
            <span class="prediction-value ${i.degradation_trend}">${n("trend_"+i.degradation_trend,s)}</span>
            ${i.degradation_rate!=null?l`<span class="prediction-rate">${i.degradation_rate>0?"+":""}${S(i.degradation_rate,s,Math.abs(i.degradation_rate)>=10?0:1)} ${i.trigger_entity_info?.unit_of_measurement||""}/${n("day_short",s)}</span>`:p}
          </div>
        `:p}
        ${r?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${n("days_until_threshold",s)}</span>
            <span class="prediction-value prediction-days${i.days_until_threshold===0?" exceeded":i.sensor_prediction_urgency?" urgent":""}">${i.days_until_threshold===0?n("threshold_exceeded",s):"~"+bt(Xs(i.days_until_threshold),s)}</span>
            ${i.threshold_prediction_date?l`<span class="prediction-date">${D(i.threshold_prediction_date,s)}</span>`:p}
            ${i.threshold_prediction_confidence?l`<span class="confidence-dot ${i.threshold_prediction_confidence}"></span>`:p}
            ${(i.prediction_cycles??0)>0?l`<span class="prediction-cycles">${n("prediction_cycles",s)}: ${i.prediction_cycles}</span>`:p}
          </div>
        `:p}
        ${o&&e.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${n("environmental_adjustment",s)}</span>
            <span class="prediction-value">${S(i.environmental_factor,s,2)}x</span>
            ${i.environmental_entity?l`<span class="prediction-entity entity-link" @click=${c=>ho(c,i.environmental_entity)}>${i.environmental_entity}</span>`:p}
          </div>
        `:p}
      </div>
    </div>
  `}var vp,Tl=x(()=>{"use strict";I();P();vp={one:"sensor_prediction_urgency_one",few:"sensor_prediction_urgency_few",other:"sensor_prediction_urgency"}});function Sl(i,s,e,t){let r=Math.max(i||1,s);return l`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${n("current",t)}: ${i!=null?nt(i,t):"\u2014"}
        </div>
        <div class="interval-visual current"
          style="width: ${i!=null?Math.min(i/r*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${n("recommended",t)}: ${nt(s,t)}
          <span class="confidence-badge ${e}">${n(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(s/r*100,100)}%"></div>
      </div>
    </div>
  `}var Cl=x(()=>{"use strict";I();P()});function Il(){return Number(Ee().slice(5,7))-1}function Rl(i,s,e){if(!e.seasonal||!i.seasonal_factor||i.seasonal_factor===1)return p;let t=Al.map(c=>n(c,s)),r=Il(),o=i.seasonal_factors||i.interval_analysis?.seasonal_factors||null,a=o&&o.length===12?o:t.map((c,u)=>{let _=i.seasonal_factor||1,m=Math.sin((u-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,_+m))});return l`
    <div class="seasonal-card-compact">
      <h4>${n("seasonal_awareness",s)}</h4>
      <div class="seasonal-mini-chart">
        ${a.map((c,u)=>{let _=c*40,m=c<.9?"low":c>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${m} ${u===r?"current":""}"
                 style="height: ${_}px"
                 title="${t[u]}: ${S(c,s,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${n("shorter",s)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${n("normal",s)}</span>
        <span class="legend-item"><span class="dot high"></span> ${n("longer",s)}</span>
      </div>
    </div>
  `}function Pl(i,s){return bp(i,s)}function bp(i,s){let e=i.seasonal_factors??i.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return p;let t=i.interval_analysis?.seasonal_reason,r=Il(),o=300,a=100,c=8,_=a-c-4,m=Math.max(...e,1.5),f=o/12,v=f*.65,w=c+_-1/m*_;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${n("seasonal_chart_title",s)}
        ${t?l`<span class="source-tag">${t==="learned"?n("seasonal_learned",s):n("seasonal_manual",s)}</span>`:p}
      </div>
      <svg viewBox="0 0 ${o} ${a}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_seasonal",s)}">
        <line x1="0" y1="${O(w)}" x2="${o}" y2="${O(w)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((A,k)=>{let E=A/m*_,y=k*f+(f-v)/2,R=c+_-E,xe=k===r,ut=A<1?"var(--success-color, #4caf50)":A>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return _t`
            <rect x="${O(y)}" y="${O(R)}"
              width="${O(v)}" height="${O(E)}"
              fill="${ut}" opacity="${xe?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Al.map((A,k)=>l`<span class="seasonal-label ${k===r?"active-month":""}">${n(A,s)}</span>`)}
      </div>
    </div>
  `}var Al,Ol=x(()=>{"use strict";I();P();hi();Z();Al=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"]});var H,Nl=x(()=>{"use strict";I();z();P();me();al();Tr();Z();ar();tr();Qs();pl();at();Zs();bl();lr();je();Rt();St();Sr();xl();wl();wt();xt();$l();Tl();Cl();Dt();mi();Ol();Ke();H=class extends T{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1};this._toast="";this._toastTimer=new Ir;this._access=Ce;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return N(this.hass)}async openFor(e,t){(e!==this._entryId||t!==this._taskId)&&(this._task=null),this._entryId=e,this._taskId=t,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=Ee(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let e=await te(this.hass);this._features={...this._features,...e.features},this._access=e.access,this._currencySymbol=st(e.budget??void 0),Fi(e.budget??void 0),this._partsCostMode=e.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(e,t){this._toast=e,this._toastTimer.schedule(()=>{this._toast=""},t)}async _loadTask(){let e=this._entryId,t=this._taskId;if(!e||!t)return;let r=++this._loadSeq,o="",a=await L(this,{type:"maintenance_supporter/object",entry_id:e},{onError:u=>{o=u}});if(r!==this._loadSeq)return;if(a===void 0){this._error=o;return}this._objectName=a?.object?.name||"";let c=(a?.tasks||[]).find(u=>u.id===t);this._task=c??null,this._taskRef=hl(a?.object,c),c||(this._error=n("ws_err_not_found",this._lang))}_runWs(e){return this._error="",L(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(e=!1){if(!(!this._entryId||!this._taskId||!this._task)){if(!e&&ee(this._task)){this._onQuickComplete();return}Promise.resolve().then(()=>(ye(),Re)).then(async({openCompleteDialog:t})=>{let r=this._task,o=[];try{o=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(nr({entryId:this._entryId,taskId:this._taskId,taskName:r.name,task:r,objects:o,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}}async _onQuickComplete(){let e=this._entryId,t=this._task;this._busy=!0;try{let r=await Qi(this.hass,e,t.id,this._lang);if(r.result==="dialog"){this._onComplete(!0);return}if(r.result==="failed"){this._error=r.message;return}if(r.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:r.message},bubbles:!0,composed:!0})),this.close();return}this._notifyChanged("complete"),r.undo&&ot(this,this.hass,{entryId:e,taskId:t.id,taskName:t.name},this._lang,()=>{}),this.close()}finally{this._busy=!1}}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:ol(e,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||Promise.resolve().then(()=>(ye(),Re)).then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(ye(),Re)).then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let e=await yl(Ws(this.hass),this._task,this._lang);if(!e)return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId,...e})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(n("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._showToast(e?.recommended_interval?`${n("reanalyze_result",this._lang)}: ${oi(e.recommended_interval,"days",this._lang)} (${e.data_points} ${n("data_points",this._lang)})`:n("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(e){if(!this._entryId||!this._taskId)return;let t=dl(this._entryId,this._taskId,e,this._task);Promise.resolve().then(()=>(ye(),Re)).then(({openHistoryEditDialog:r})=>r(t))}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return p;let t=this._lang;return l`
      <div class="recommendation-card">
        <h4>${n("suggested_interval",t)}</h4>
        ${Sl(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",t)}
        <div class="recommendation-actions">
          ${fe(this.hass?.user,this._access)?l`<button class="btn primary qa-apply-suggestion"
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
    `}_renderAdaptive(e){let t=this._lang,r=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,o=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,a=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,c=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!r&&!o&&!a&&!c?l`<div class="adaptive-empty">
        ${n("adaptive_no_data",t)}
      </div>`:l`
      <div class="adaptive-stack">
        ${this._toast?l`<div class="toast">${this._toast}</div>`:p}
        ${r?this._renderRecommendation(e):p}
        ${o?El(e,t,this._features):p}
        ${a?kl(e,t):p}
        ${c?l`
          ${Rl(e,t,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?Pl(e,t):p}
        `:p}
      </div>
    `}_renderDetails(e){let t=this._lang,r=e.history||[],o=e.history_count??r.length,a=fl(r).slice(0,20);return l`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${n("times_performed",t)}</span>
            <span class="stat-value">${e.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${n("total_cost",t)}</span>
            <span class="stat-value">${X(e.total_cost??0,this._currencySymbol,t)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${n("avg_duration",t)}</span>
            <span class="stat-value">${yt(e.average_duration!=null?Math.round(e.average_duration):null,t)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${n("history",t)}</strong>
          <span class="history-count">${o}</span>
        </div>
        ${r.length===0?l`<div class="history-empty">${n("history_empty",t)}</div>`:l`
              <div class="history-list">
                ${a.map(c=>vl(c,{lang:t,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:fe(this.hass?.user,this._access)?u=>this._onEditHistoryEntry(u):void 0,readingUnit:e.reading_unit,readingSlotDelta:(u,_)=>zo(r,u,_),taskRef:this._taskRef},{compact:!0}))}
                ${o>a.length?l`<div class="history-more">… +${o-a.length} ${n("older_entries",t)}</div>`:p}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return p;let e=this._lang,t=this._task,r=fe(this.hass?.user,this._access),o=!!t&&qi(t);return Ft(()=>this.close(),l`
        ${t?l`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${Pt(t)}"></span>
                  ${dt()?p:l`<span class="task-name">${t.name}</span>`}
                  ${ta(t,e)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&Promise.resolve().then(()=>(ye(),Re)).then(({openObjectQuickActions:a})=>{a(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${t.next_due?l`<span><strong>${n("next_due",e)}:</strong> ${D(t.next_due,e)}</span>`:p}
                  ${t.last_performed?l`<span><strong>${n("last_performed",e)}:</strong> ${D(t.last_performed,e)}</span>`:p}
                  ${t.schedule?.kind&&!["manual","one_time"].includes(t.schedule.kind)||t.interval_days!=null?l`<span><strong>${n("interval",e)}:</strong> ${uo(t,e)}</span>`:p}
                  ${Ue(t)?l`<span><strong>${n("phase_current",e)}:</strong> ${Ue(t)}</span>`:p}
                </div>
                ${t.notes?l`<div class="notes-body">${Ar(t.notes)}</div>`:p}
              </div>

              ${this._error?U("error",this._error):p}

              ${this._showSkip?l`
                    <div class="inline-form">
                      <ms-textfield label=${n("skip_reason",e)} .value=${this._skipReason}
                        @input=${a=>{this._skipReason=a.target.value}}></ms-textfield>
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
                        @value-changed=${a=>{this._resetDate=a.detail.value}}
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
                        @value-changed=${a=>{this._postponeDate=a.detail.value}}
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
                      <ha-button appearance="accent" variant="success" @click=${()=>this._onComplete()} .disabled=${this._busy}
                        title=${ee(t)?n("qr_action_quick_complete",e):n("complete",e)}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${n("complete",e)}
                      </ha-button>
                      ${ee(t)?l`<ha-button appearance="outlined" variant="success" class="qa-complete-details" @click=${()=>this._onComplete(!0)} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:text-box-edit-outline"></ha-icon>
                            ${n("complete_with_details",e)}
                          </ha-button>`:p}
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
                      ${r?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${n("edit",e)}
                          </ha-button>`:p}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${n("qr_code",e)}
                      </ha-button>
                      ${o?p:l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${n("postpone",e)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${n("snooze",e)}
                          </ha-button>`}
                      ${r?l`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
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
            `:this._error?U("error",this._error):l`<div class="loading">${n("loading",e)}</div>`}
    `,{title:t?.name})}updated(e){e.has("_open")&&this._open&&Ut(this.shadowRoot)}};H.styles=[Gi,zt,$`
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
  `],d([b({attribute:!1})],H.prototype,"hass",2),d([h()],H.prototype,"_open",2),d([h()],H.prototype,"_entryId",2),d([h()],H.prototype,"_taskId",2),d([h()],H.prototype,"_task",2),d([h()],H.prototype,"_objectName",2),d([h()],H.prototype,"_taskRef",2),d([h()],H.prototype,"_busy",2),d([h()],H.prototype,"_error",2),d([h()],H.prototype,"_showSkip",2),d([h()],H.prototype,"_showReset",2),d([h()],H.prototype,"_showPostpone",2),d([h()],H.prototype,"_showDetails",2),d([h()],H.prototype,"_showAdaptive",2),d([h()],H.prototype,"_skipReason",2),d([h()],H.prototype,"_resetDate",2),d([h()],H.prototype,"_postponeDate",2),d([h()],H.prototype,"_features",2),d([h()],H.prototype,"_toast",2),d([h()],H.prototype,"_access",2),d([h()],H.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",H)});var jl=x(()=>{"use strict";fi();ai();Z()});function Dl(i,s,e){return i&&s?.[i]?.name||e}var ql=x(()=>{"use strict";Z();jl();Js();je()});function Ml(i){if(i.key!=="Enter"&&i.key!==" ")return;let e=i.target?.closest?.('[role="menuitem"], [role="button"]');!e||e.getAttribute("aria-disabled")==="true"||(i.preventDefault(),e.click())}var Hl=x(()=>{"use strict"});var he,Ll=x(()=>{"use strict";I();Ji();Qs();z();P();ql();me();lr();Rt();St();Sr();Tr();Hl();Ke();he=class extends T{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=Ce;this._loadSeq=0}get _lang(){return N(this.hass)}async openFor(e){e!==this._entryId&&(this._data=null),this._entryId=e,this._error="",this._open=!0,await Promise.all([this._load(),te(this.hass).then(t=>{this._access=t.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let e=this._entryId;if(!e)return;let t=++this._loadSeq,r="",o=await L(this,{type:"maintenance_supporter/object",entry_id:e},{onError:a=>{r=a}});t===this._loadSeq&&(o===void 0?this._error=r:this._data=o)}_runWs(e){return this._error="",L(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_onEditObject(){!this._entryId||!this._data||Promise.resolve().then(()=>(ye(),Re)).then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&Promise.resolve().then(()=>(ye(),Re)).then(({openCreateTaskDialog:e})=>{e(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await Ei(this.hass,{title:n("delete",this._lang),message:n("delete_object_confirm",this._lang),confirmText:n("delete",this._lang),danger:!0}))return;let t=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let e=!!this._data.object.archived;if(!e&&!await Ei(this.hass,{title:n("archive_object",this._lang),message:n("confirm_archive_object",this._lang),confirmText:n("archive_object",this._lang)}))return;let t=this._entryId;await this._runWs({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}_onTaskClick(e){this._entryId&&Promise.resolve().then(()=>(ye(),Re)).then(({openTaskQuickActions:t})=>{t(this._entryId,e)})}render(){if(!this._open)return p;let e=this._lang,t=this._data,r=t?.object,o=t?.tasks||[],a=fe(this.hass?.user,this._access);return Ft(()=>this.close(),l`
        ${t&&r?l`
              <div class="header">
                ${dt()?p:l`<div class="title">${r.name}</div>`}
                ${this._renderMetaRow(r)}
              </div>

              ${this._error?U("error",this._error):p}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${n("tasks",e)}</strong>
                  <span class="count">${o.length}</span>
                </div>
                ${o.length===0?l`<div class="empty">${n("no_tasks",e)}</div>`:l`
                      <div class="task-list">
                        ${o.map(c=>l`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(c.id)} @keydown=${Ml}>
                            <span class="status-dot" style="background: ${Pt(c)}"></span>
                            <span class="task-name">${c.name}</span>
                            <span class="task-status ${ui(c)}">${ws(ui(c),e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${r.notes?l`
                    <div class="notes-section">
                      <strong>${n("object_notes_label",e)}</strong>
                      <div class="notes-body">${Ar(r.notes)}</div>
                    </div>
                  `:p}

              ${a?l`
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
                        <ha-icon icon="${r.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${r.archived?n("unarchive_object",e):n("archive_object",e)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${n("delete",e)}
                      </button>
                    </div>
                  `:p}
            `:this._error?U("error",this._error):l`<div class="loading">${n("loading",e)}</div>`}
    `,{title:r?.name})}updated(e){e.has("_open")&&this._open&&Ut(this.shadowRoot)}_renderMetaRow(e){let t=this._lang,r=[];return e.area_id&&r.push([n("area",t),Dl(e.area_id,this.hass?.areas,n("no_area",t))]),e.manufacturer&&r.push([n("manufacturer",t),e.manufacturer]),e.model&&r.push([n("model",t),e.model]),e.serial_number&&r.push([n("serial_number_label",t),e.serial_number]),e.installation_date&&r.push([n("installed",t),D(e.installation_date,t)]),e.warranty_expiry&&r.push([n("warranty",t),D(e.warranty_expiry,t)]),e.documentation_url&&r.push([n("documentation_url_label",t),e.documentation_url,$t(e.documentation_url)]),r.length===0?p:l`
      <div class="meta">
        ${r.map(([o,a,c])=>l`
            <div class="meta-item">
              <span class="meta-label">${o}</span>
              <span class="meta-value">${c||Ao(a)?l`<a href="${a}" target="_blank" rel="noopener noreferrer">${a}</a>`:a}</span>
            </div>
          `)}
      </div>
    `}};he.styles=[zt,$`
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
  `],d([b({attribute:!1})],he.prototype,"hass",2),d([h()],he.prototype,"_open",2),d([h()],he.prototype,"_entryId",2),d([h()],he.prototype,"_data",2),d([h()],he.prototype,"_busy",2),d([h()],he.prototype,"_error",2),d([h()],he.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",he)});var Re={};Jl(Re,{__resetSettingsCacheForTests:()=>Sp,getRowActionStyle:()=>Tp,openCompleteDialog:()=>Rp,openCreateObjectDialog:()=>en,openCreateTaskDialog:()=>tn,openEditObjectDialog:()=>Cp,openEditTaskDialog:()=>Ap,openHistoryEditDialog:()=>Ip,openObjectQuickActions:()=>Op,openQrDialog:()=>Pp,openTaskQuickActions:()=>rn});function Bt(){return document.querySelector("home-assistant")?.hass}function Ep(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function Pe(i){let s=Ep(),e=s.querySelector(i)??document.body.querySelector(i);return e?e.parentNode!==s&&s.appendChild(e):(e=document.createElement(i),s.appendChild(e)),e}function Oe(i){let s=Bt();if(!s)return!1;i.hass=s;let e=N(s);return mt(e)||$e(e).then(()=>{i.requestUpdate?.()}),ns(s.locale,s.config?.country,s.config?.time_zone),!0}function Tp(i){return te(i).then(s=>s.rowActionStyle)}function Sp(){ea()}function en(){let i=Pe(zl);return Oe(i)?(i.openCreate(),Ul(i),!0):!1}async function Ul(i){let s=Bt();s&&(i.placesEnabled=(await te(s)).features.places)}function Cp(i,s){let e=Pe(zl);return Oe(e)?(e.openEdit(i,s),Ul(e),!0):!1}function tn(i="",s){let e=Pe(Fl);if(!Oe(e))return!1;let t=Bt();return t?((async()=>{let r=await te(t),o=e;Bl(o,r),o.openCreate(i,s)})(),!0):!1}function Bl(i,s){i.checklistsEnabled=s.features.checklists,i.scheduleTimeEnabled=s.features.schedule_time,i.completionActionsEnabled=s.features.completion_actions,i.adaptiveFeature=s.features.adaptive,i.seasonalFeature=s.features.seasonal,i.environmentalFeature=s.features.environmental,i.defaultWarningDays=s.defaultWarningDays,i.mirrorTodoDefault=s.mirrorTodoDefault,i.betaEditor=s.features.beta_editor}function Ap(i,s){let e=Pe(Fl);if(!Oe(e))return!1;let t=Bt();return t?((async()=>{try{let[r,o]=await Promise.all([t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:i}),te(t)]),a=(r.tasks||[]).find(u=>u.id===s);if(!a){console.warn(`openEditTaskDialog: task ${s} not found in entry ${i}`);return}let c=e;Bl(c,o),await c.openEdit(i,a)}catch(r){console.warn("openEditTaskDialog: failed to load task/features",r)}})(),!0):!1}function Ip(i){let s=Pe(yp);return Oe(s)?(s.openEdit(i),!0):!1}function Rp(i){let s=Pe(xp);if(!Oe(s))return!1;let e=s;return e.__msUndoWired||(e.__msUndoWired=!0,s.addEventListener("task-completed",t=>{let r=t.detail,o=Bt();r?.undo&&o&&ot(s,o,r,N(o),()=>{})})),or(s,i,N(Bt())),!0}function Pp(i){let s=Pe(wp);return Oe(s)?(s.openForTask(i.entry_id,i.task_id,i.object_name,i.task_name),!0):!1}function rn(i,s){let e=Pe(kp);return Oe(e)?(e.openFor(i,s),!0):!1}function Op(i){let s=Pe($p);return Oe(s)?(s.openFor(i),!0):!1}var zl,Fl,yp,xp,wp,kp,$p,ye=x(()=>{"use strict";Sa();Xa();qs();rl();nl();Nl();Ll();xt();P();ar();Rt();zl="maintenance-object-dialog",Fl="maintenance-task-dialog",yp="maintenance-history-edit-dialog",xp="maintenance-complete-dialog",wp="maintenance-qr-dialog",kp="maintenance-task-quick-actions-dialog",$p="maintenance-object-quick-actions-dialog"});I();var dc=["assignee_pool","required_completion_fields","checklist","labels","mirror_todo_entities","next_event_titles","history","readings"],pc=["checklist_progress"],uc=["tasks","parts"],hc=["manual_docs","battery_fleet_excluded"];function zr(i,s,e=[]){for(let t of s)i[t]===void 0&&(i[t]=[]);for(let t of e)i[t]===void 0&&(i[t]={})}function _c(i){let s=i;zr(s,uc),s.object&&typeof s.object=="object"&&zr(s.object,hc);for(let e of s.tasks)zr(e,dc,pc);return i}function ei(i){for(let s of i)_c(s);return i}function mc(i,s){if(s.objects)return s.objects;let e=s.delta||[],t=s.removed||[];if(!e.length&&!t.length)return null;let r=new Map(i.map(o=>[o.entry_id,o]));for(let o of e)r.set(o.entry_id,o);for(let o of t)r.delete(o);return[...r.values()]}function Rn(i,s){return s.objects&&ei(s.objects),s.delta&&ei(s.delta),mc(i,s)}function ti(i){return i.responsible_user_id?[i.responsible_user_id]:[...new Set((i.assignee_pool||[]).filter(s=>typeof s=="string"&&s))]}function Pn(i,s){return!!s&&ti(i).includes(s)}wt();z();P();ps();function Co(i){return(i.tags||[]).includes("photo")}Ji();function Io(){return window.customCards??[]}function Et(i){let s=window;s.customCards=s.customCards||[],s.customCards.some(e=>e.type===i.type)||s.customCards.push(i)}function Ro(i,s,e=t=>import(t)){let t=window,r;try{let m=new URL(s);r=m.origin+m.pathname}catch{return}let o=`__msCardHeal:${i[0]}:${r}`;if(t[o])return;t[o]=!0;let a=0,c=0,u=!1,_=()=>{if(a+=1,i.some(f=>!customElements.get(f))&&c<3&&!u){c+=1,u=!0;try{let f=new URL(s);f.searchParams.set("heal",`${Date.now()}`),e(f.href).catch(()=>{}).finally(()=>{u=!1})}catch{return}}a<20&&window.setTimeout(_,a<8?500:2e3)};window.setTimeout(_,250)}si();var Bc={"maintenance-supporter-card":[null,"picker_desc_card"],"maintenance-supporter-calendar-card":["picker_name_calendar","picker_desc_calendar"],"maintenance-supporter-panel-card":["picker_name_panel","picker_desc_panel"],"maintenance-budget-section-card":["picker_name_budget","picker_desc_budget"],"maintenance-groups-section-card":["picker_name_groups","picker_desc_groups"],"maintenance-vacation-section-card":["picker_name_vacation","picker_desc_vacation"],"maintenance-battery-fleet-card":["picker_name_battery_fleet","picker_desc_battery_fleet"],"maintenance-supporter":[null,"picker_desc_dashboard"],"maintenance-supporter-section":["picker_name_section","picker_desc_section"],"maintenance-supporter-vacation":["picker_name_vacation_status","picker_desc_vacation_status"],"maintenance-supporter-budget":["picker_name_budget_status","picker_desc_budget_status"],"maintenance-supporter-groups":["picker_name_groups","picker_desc_groups_status"]},_s=new WeakMap;function Wc(i){let s=window;for(let e of[...Io(),...s.customStrategies??[]]){let t=Bc[e.type];if(!t)continue;_s.has(e)||_s.set(e,{name:e.name,description:e.description});let r=_s.get(e),[o,a]=t;o&&(e.name=n(o,i,r.name)),e.description=n(a,i,r.description)}}function Xi(){let i=0,s=()=>{let e=document.querySelector("home-assistant")?.hass;if(e?.language){let t=e.language;$e(t).then(()=>Wc(t));return}++i<60&&setTimeout(s,1e3)};s()}gs();ms();tr();I();function jo(i){let s=(i??[]).filter(e=>!!e);return s.length?l`<span class="event-titles"> · ${s.join(", ")}</span>`:p}function Do(i){return i?l`<span class="event-titles trigger-detail"> · ${i}</span>`:p}ar();Rt();St();lr();I();P();hi();Z();$s();function ia(i,s,e="last-done"){let t=po(i,s);return t?l`<span class="${e}" title="${n("last_performed",s)}: ${D(i,s)}">${t}</span>`:null}je();I();z();P();je();Ts();mi();var ve=class extends T{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._loadingObjects=!0;this._loadError=!1;this._views=[];this._objectsLoaded=!1;this._applySimplePreset=()=>{let e={...this._config,compact:!0,action_style:"icons",show_actions:!0,show_create:!1,show_assignee:!0,show_documents:!1};this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))};this._onEntitiesChanged=e=>{this._valueChanged("entity_ids",e.detail.value||[])}}get _lang(){return N(this.hass)}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._objectsLoaded&&(this._objectsLoaded=!0,this._loadObjects())}async _loadObjects(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=e.objects||[],this._loadError=!1}catch{this._objects=[],this._loadError=!0}this._loadingObjects=!1;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._views=e.views||[]}catch{this._views=[]}}_valueChanged(e,t){let r={...this._config,[e]:t};(Array.isArray(t)&&t.length===0||t===""||t===void 0||t===null)&&delete r[e],this._config=r,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))}_toggleStatus(e,t){let r=new Set(this._config.filter_status||[]);t?r.add(e):r.delete(e),this._valueChanged("filter_status",[...r])}_toggleObject(e,t,r){let o=new Set(this._config.filter_objects||[]);o.delete(t),r?o.add(e):o.delete(e),this._valueChanged("filter_objects",[...o])}_dropStale(e,t){this._valueChanged(e,(this._config[e]||[]).filter(r=>r!==t))}_toggleLabel(e,t){let r=new Set(this._config.filter_labels||[]);t?r.add(e):r.delete(e),this._valueChanged("filter_labels",[...r])}_toggleArea(e,t){let r=new Set(this._config.filter_areas||[]);t?r.add(e):r.delete(e),this._valueChanged("filter_areas",[...r])}_togglePriority(e,t){let r=new Set(this._config.filter_priority||[]);t?r.add(e):r.delete(e),this._valueChanged("filter_priority",[...r])}_staleRow(e,t){return l`
      <label class="object-row stale">
        <input type="checkbox" .checked=${!0} @change=${()=>this._dropStale(e,t)} />
        <span>${t}</span>
      </label>
    `}render(){let e=this._lang,t=new Set(this._config.filter_status||[]),r=new Set(this._config.filter_objects||[]),o=[...this._objects].map(y=>({entryId:y.entry_id,name:y.object.name,checked:r.has(y.entry_id)||r.has(y.object.name)})).sort((y,R)=>y.name.localeCompare(R.name)),a=new Set(this._objects.flatMap(y=>[y.entry_id,y.object.name])),c=[...r].filter(y=>!a.has(y)),u=new Set(this._config.filter_areas||[]),_=[...new Set(this._objects.map(y=>y.object.area_id).filter(y=>!!y).concat([...u]))],m=y=>this.hass?.areas?.[y]?.name||y,f=_.map(y=>({id:y,name:m(y)})).sort((y,R)=>y.name.localeCompare(R.name)),v=new Set(this._config.filter_labels||[]),w=new Set(this._config.filter_priority||[]),A=[...new Set(this._objects.flatMap(y=>y.tasks.flatMap(R=>R.labels||[])))].sort((y,R)=>y.localeCompare(R)),k=[...v].filter(y=>!A.includes(y)),E=[];for(let y of this._objects)for(let R of y.tasks)R.sensor_entity_id&&E.push(R.sensor_entity_id),R.binary_sensor_entity_id&&E.push(R.binary_sensor_entity_id);return l`
      <div class="editor">
        <ms-textfield
          class="card-title"
          label="${n("card_title",e)}"
          .value=${this._config.title||""}
          @input=${y=>this._valueChanged("title",y.target.value)}
        ></ms-textfield>

        <!-- #234: a starting point for a kitchen tablet; every option stays its own -->
        <div class="field simple-preset">
          <button type="button" class="preset-btn" @click=${this._applySimplePreset}>${n("card_simple_preset",e)}</button>
          <div class="field-help">${n("card_simple_preset_help",e)}</div>
        </div>

        <!-- Status filter (chip row) -->
        <div class="field">
          <div class="field-label">${n("card_filter_status",e)}</div>
          <div class="chip-row">
            ${Di.map(y=>l`
              <label class="chip ${t.has(y)?"active":""}">
                <input type="checkbox"
                  .checked=${t.has(y)}
                  @change=${R=>this._toggleStatus(y,R.target.checked)} />
                ${n(y,e)}
              </label>
            `)}
          </div>
          <div class="field-help">${n("card_filter_status_help",e)}</div>
        </div>

        <!-- Object filter (multi-checkbox) -->
        <div class="field">
          <div class="field-label">${n("card_filter_objects",e)}</div>
          ${this._loadingObjects?l`<div class="field-help">${n("card_loading_objects",e)}</div>`:this._loadError?l`<div class="field-help error-text">${n("card_load_error",e)}</div>`:o.length===0&&c.length===0?l`<div class="field-help">${n("no_objects",e)}</div>`:l`
                <div class="object-list">
                  ${o.map(y=>l`
                    <label class="object-row">
                      <input type="checkbox"
                        .checked=${y.checked}
                        @change=${R=>this._toggleObject(y.entryId,y.name,R.target.checked)} />
                      <span>${y.name}</span>
                    </label>
                  `)}
                  ${c.map(y=>this._staleRow("filter_objects",y))}
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
            ${f.map(y=>l`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${u.has(y.id)}
                  @change=${R=>this._toggleArea(y.id,R.target.checked)} />
                <span>${y.name}</span>
              </label>
            `)}
          </div>
          <div class="field-help">${n("card_filter_areas_help",e)}</div>
        </div>`:p}
        ${A.length||k.length?l`
        <div class="field">
          <div class="field-label">${n("labels",e)}</div>
          <div class="object-list">
            ${A.map(y=>l`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${v.has(y)}
                  @change=${R=>this._toggleLabel(y,R.target.checked)} />
                <span>${y}</span>
              </label>
            `)}
            ${k.map(y=>this._staleRow("filter_labels",y))}
          </div>
        </div>`:p}
        <div class="field">
          <div class="field-label">${n("priority",e)}</div>
          <div class="object-list">
            ${ra.map(y=>l`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${w.has(y)}
                  @change=${R=>this._togglePriority(y,R.target.checked)} />
                <span>${n(`priority_${y}`,e)}</span>
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
                  @change=${y=>this._valueChanged("view_id",y.target.value)}
                >
                  <option value="" ?selected=${!this._config.view_id}>
                    ${n("card_saved_view_none",e)}
                  </option>
                  ${this._views.map(y=>l`<option value=${y.id} ?selected=${this._config.view_id===y.id}>
                      ${y.name}
                    </option>`)}
                </select>
                <div class="field-help">${n("card_saved_view_help",e)}</div>
              </div>
            `:p}

        <ha-formfield label="${n("card_show_header",e)}">
          <ha-switch
            .checked=${this._config.show_header!==!1}
            @change=${y=>this._valueChanged("show_header",y.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${n("card_show_actions",e)}">
          <ha-switch
            .checked=${this._config.show_actions!==!1}
            @change=${y=>this._valueChanged("show_actions",y.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${n("card_show_create",e)}">
          <ha-switch
            class="show-create"
            .checked=${this._config.show_create??this._config.show_actions!==!1}
            @change=${y=>this._valueChanged("show_create",y.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <label class="editor-select">
          <span>${n("card_action_style",e)}</span>
          <select
            .value=${this._config.action_style??""}
            @change=${y=>{let R=y.target.value;this._valueChanged("action_style",R===""?void 0:R)}}
          >
            <option value="" ?selected=${!this._config.action_style}>${n("row_actions_follow",e)}</option>
            <option value="buttons" ?selected=${this._config.action_style==="buttons"}>${n("row_actions_buttons",e)}</option>
            <option value="icons" ?selected=${this._config.action_style==="icons"}>${n("row_actions_icons",e)}</option>
          </select>
        </label>

        <ha-formfield label="${n("responsible_user",e)}">
          <ha-switch
            .checked=${this._config.show_assignee!==!1}
            @change=${y=>this._valueChanged("show_assignee",y.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${n("documents",e)}">
          <ha-switch
            .checked=${this._config.show_documents!==!1}
            @change=${y=>this._valueChanged("show_documents",y.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${n("card_compact",e)}">
          <ha-switch
            .checked=${this._config.compact||!1}
            @change=${y=>this._valueChanged("compact",y.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ms-textfield
          class="card-max-items"
          label="${n("card_max_items",e)}"
          type="number"
          .value=${String(this._config.max_items||0)}
          @input=${y=>this._valueChanged("max_items",parseInt(y.target.value,10)||0)}
        ></ms-textfield>
        ${p}
      </div>
    `}};ve.styles=$`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    ha-textfield, ms-textfield { display: block; }
    .simple-preset { gap: 4px; }
    .preset-btn {
      align-self: flex-start;
      padding: 6px 12px;
      border: 1px solid var(--primary-color);
      border-radius: 18px;
      background: none;
      color: var(--primary-color);
      font: inherit;
      cursor: pointer;
    }
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
  `,d([b({attribute:!1})],ve.prototype,"hass",2),d([h()],ve.prototype,"_config",2),d([h()],ve.prototype,"_objects",2),d([h()],ve.prototype,"_loadingObjects",2),d([h()],ve.prototype,"_loadError",2),d([h()],ve.prototype,"_views",2);customElements.get("maintenance-supporter-card-editor")||customElements.define("maintenance-supporter-card-editor",ve);qs();xt();I();z();I();z();P();P();function xa(i,s,e){return n(`part_waiting_${i}`,e).replace("{count}",S(s,e))}js();me();St();Rt();Z();hi();br();$i();var B=class B extends T{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._choosing=null;this._error="";this._disposeFor=null;this._disposeQty="1";this._history=null;this._rosterSort=B._storedSort();this._typeFilter=null;this._recorded=[];this._access=Ce;this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{await this._act({type:"maintenance_supporter/battery_fleet/setup",language:this._lang})};this._loadHistory=async e=>{if(wi(Ge.batteryRosterOpen,e?"1":"0"),!(!e||this._historyRequested)){this._historyRequested=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=t.series}catch{this._history=null}}}}get _lang(){return N(this.hass)}get _canWrite(){return fe(this.hass?.user,this._access)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(e){zi(this,e),e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,$e(this._lang).then(()=>this.requestUpdate()),te(this.hass).then(t=>{this._access=t.access}),this._ov===null&&!this._loading&&this._load())}async _load(){this._error="";let e=await L(this,{type:"maintenance_supporter/battery_fleet/overview"},{busy:t=>{this._loading=t},onError:t=>{this._error=t}});e!==void 0&&(this._ov=e)}async _act(e,t){return this._marking?!1:(this._error="",await L(this,e,{busy:o=>{this._marking=o},reload:async()=>{t?.(),await this._load()},onError:o=>{this._error=o}})!==void 0)}async _dispose(e,t){let r=parseFloat(this._disposeQty);!Number.isFinite(r)||r<=0||await this._act({type:"maintenance_supporter/part/dispose",entry_id:e,part_id:t,quantity:r})&&(this._disposeFor=null)}_renderDispose(e,t,r){return this._disposeFor!==t.part_id?l`<button class="bf-charged bf-dispose" title=${n("part_dispose_hint",r)} .disabled=${this._marking}
        @click=${()=>{this._disposeFor=t.part_id,this._disposeQty="1"}}><ha-icon icon="mdi:trash-can-outline"></ha-icon>${n("part_dispose",r)}</button>`:l`<input
        class="bf-dispose-qty"
        type="number"
        min="1"
        max=${String(t.restoring)}
        .value=${this._disposeQty}
        aria-label=${n("part_dispose_how_many",r)}
        title=${n("part_dispose_how_many",r)}
        @input=${o=>this._disposeQty=o.target.value}
        @keydown=${o=>{o.key==="Enter"&&this._dispose(e,t.part_id),o.key==="Escape"&&(this._disposeFor=null)}}
      /><button class="bf-charged bf-dispose confirm" title=${n("part_dispose_hint",r)} .disabled=${this._marking}
        @click=${()=>this._dispose(e,t.part_id)}><ha-icon icon="mdi:check"></ha-icon>${n("part_dispose",r)}</button
      ><button class="bf-charged bf-dispose" title=${n("cancel",r)} @click=${()=>this._disposeFor=null}
        ><ha-icon icon="mdi:close"></ha-icon
      ></button>`}_markOne(e,t){if(e.cell_choices&&e.cell_choices.length>1){this._choosing={entityId:e.entity_id,list:t,selected:e.cells_installed||e.cell_choices[0].type};return}this._mark([e.entity_id])}async _confirmCells(){let e=this._choosing;e&&(this._choosing=null,await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",entity_ids:[e.entityId],cells:{[e.entityId]:e.selected}}))}_renderCellChooser(e,t,r){let o=this._choosing;return!o||o.entityId!==e.entity_id||o.list!==t||!e.cell_choices?p:l`
      <div class="bf-cells" role="group" aria-label=${n("battery_fleet_cells_question",r)}>
        <div class="bf-cells-q">${n("battery_fleet_cells_question",r)}</div>
        ${e.cell_choices.map(a=>l`
          <label class="bf-cell-choice">
            <input type="radio" name=${`cells-${e.entity_id}`} .checked=${o.selected===a.type}
              @change=${()=>{this._choosing={...o,selected:a.type}}} />
            <span>${a.name}</span>
            ${a.rechargeable?l`<span class="bf-cell-tag">${n("battery_fleet_cells_rechargeable",r)}</span>`:p}
          </label>`)}
        <div class="bf-cells-actions">
          <button class="bf-cells-cancel" @click=${()=>{this._choosing=null}}>${n("cancel",r)}</button>
          <button class="bf-cells-ok" .disabled=${this._marking} @click=${()=>this._confirmCells()}>
            ${n("battery_fleet_mark_one",r)}
          </button>
        </div>
      </div>
    `}async _mark(e){await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",...e?{entity_ids:e}:{}})}async _setExcluded(e,t){await this._act({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:e,excluded:t})}async _addBattery(e){let t=e.detail?.value;t&&await this._act({type:"maintenance_supporter/battery_fleet/set_included",entity_id:t,included:!0})}async _setTrackSelf(e){await this._setFleetOption("set_track_self_charging",e.target)}async _setDueWithoutSensor(e){await this._setFleetOption("set_due_without_sensor",e.target)}async _setAskCells(e){await this._setFleetOption("set_ask_cells",e.target)}async _setFleetOption(e,t){let r=t.checked;await this._act({type:`maintenance_supporter/battery_fleet/${e}`,enabled:r})||(t.checked=!r)}_rosterOpen(){return xi(Ge.batteryRosterOpen)!=="0"}_predictedTitle(e,t){if(e.forecast_overdue)return n("battery_fleet_forecast_overdue",t);let r=this._predictedDate(this._forecastDays(e)??0);if(e.predicted_source==="trend")return n("battery_fleet_predicted_trend",t).replace("{date}",r).replace("{confidence}",n("cal_confidence_"+(e.prediction_confidence||"medium"),t));if(e.lifetime_months!=null&&e.lifetime_source){let o=n("lifetime_source_"+e.lifetime_source,t).replace("{n}",String(e.lifetime_samples??0));return n("battery_fleet_predicted_typical",t).replace("{date}",r).replace("{months}",String(e.lifetime_months)).replace("{type}",e.battery_type).replace("{source}",o)}return n("battery_fleet_predicted_on",t).replace("{date}",r)}_sparkline(e){let t=this._history?.[e.entity_id];if(!t||t.points.length<2)return p;let r=110,o=24,a=2,c=t.points[0][0],u=t.points[t.points.length-1][0],_=Date.now()/1e3,m=e.status!=="low"&&e.predicted_source==="trend"&&e.days_until!=null?_+e.days_until*86400:null,f=Math.max(u,m??u),v=y=>f===c?a:a+(y-c)/(f-c)*(r-2*a),w=y=>a+(1-Math.min(100,Math.max(0,y))/100)*(o-2*a),A=t.points.map(([y,R])=>`${O(v(y))},${O(w(R))}`).join(" "),k=t.points[t.points.length-1][1],E=O(w(t.threshold));return l`<svg
      class="bf-spark"
      viewBox="0 0 ${r} ${o}"
      role="img"
      aria-label=${n("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${n("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${E} x2=${r} y2=${E}></line>
      <polyline class="bf-spark-line" points=${A}></polyline>
      ${m!==null?l`<line
            class="bf-spark-proj"
            x1=${O(v(u))}
            y1=${O(w(k))}
            x2=${O(v(m))}
            y2=${E}
          ></line>`:p}
    </svg>`}static _storedSort(){return xi(Ge.batteryRosterSort)==="name"?"name":"urgency"}_setSort(e){this._rosterSort=e,wi(Ge.batteryRosterSort,e)}_sortedRoster(e){let t=this._typeFilter===null?e:e.filter(o=>o.battery_type===this._typeFilter);if(this._rosterSort==="name")return t;let r=o=>o.status==="low"?-1e3+(o.level??101)/101:o.days_until??1/0;return[...t].sort((o,a)=>r(o)-r(a)||o.device_name.localeCompare(a.device_name))}_predictedDate(e){return D(Jn(Ee(),e),this._lang)}_forecastDays(e){return e.forecast_days!==void 0?e.forecast_days:e.days_until}_fmtDate(e){return Number.isFinite(e)?D(new Date(e).toISOString(),this._lang):"\u2014"}_shoppingLine(e){return Object.entries(e).map(([t,r])=>l`<button
        class="bf-type-chip ${this._typeFilter===t?"bf-type-chip-active":""}"
        title=${n("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(t)}
      >
        ${r}× ${t}
      </button>`)}_toggleTypeFilter(e){if(this._typeFilter=this._typeFilter===e?null:e,this._typeFilter!==null){let t=this.shadowRoot?.querySelector(".bf-roster");t instanceof HTMLDetailsElement?t.open||(t.open=!0):t&&!t.expanded&&(t.expanded=!0,this._loadHistory(!0))}}async _recordJump(e,t){await this._act({type:"maintenance_supporter/battery_fleet/record_replacement",entity_id:e,replaced_at:new Date(t.at*1e3).toISOString()},()=>{this._recorded=[...this._recorded,e]})}_levelTone(e,t){let r=t.low_threshold??20;return e<=r?"bad":e<=r+20?"warn":"good"}_levelBar(e){let t=e.level;return t==null?p:l`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${this._levelTone(t,e)}" style="width: ${Math.min(100,Math.max(0,t))}%"></span
    ></span>`}_jumpButton(e,t){let r=this._history?.[e.entity_id]?.jump;return!r||this._recorded.includes(e.entity_id)?p:l`<button
      class="bf-mark bf-jump"
      title=${n("battery_fleet_record_replacement",t).replace("{date}",this._fmtDate(r.at*1e3))}
      .disabled=${this._marking}
      @click=${()=>this._recordJump(e.entity_id,r)}
    >
      <ha-icon icon="mdi:calendar-sync"></ha-icon>
    </button>`}_renderRow(e,t,r){let o=e.available===!1?l`<span class="bf-offline">${n("battery_fleet_offline",t)}</span>`:e.no_sensor?l`<span class="bf-offline bf-nosensor">${n("battery_fleet_no_sensor",t)}</span>`:p,a=`${e.quantity}\xD7 ${e.battery_type}`,c=l`<span class="bf-type" title=${a}>${a}</span>`,u=this._canWrite,_=u&&(r.mark==="always"||e.no_sensor||e.can_mark_replaced),m=this._forecastDays(e);return l`
      <div class="bf-row">
        <span class="bf-dev">${e.device_name}</span>
        ${r.status?l`<span class="bf-status bf-${e.status}"
                >${e.no_sensor&&e.status==="low"?n("battery_fleet_status_due",t):n("battery_fleet_status_"+e.status,t)}</span
              >${c}${o}`:l`${o}${c}`}
        ${r.recharge&&e.rechargeable?l`<span class="bf-recharge" title=${n("battery_fleet_rechargeable",t)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`:p}
        ${r.sparkline?this._sparkline(e):p}
        ${this._levelBar(e)}
        ${e.level!=null?l`<span class="bf-level bf-level-${this._levelTone(e.level,e)}">${e.level}%</span>`:p}
        ${_?l`<button
              class="bf-mark${r.mark==="replaced"?" bf-replaced":""}"
              title=${e.rechargeable?n("battery_fleet_mark_recharged",t):n("battery_fleet_mark_one",t)}
              .disabled=${this._marking}
              @click=${()=>this._markOne(e,r.list)}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`:p}
        ${r.jump&&u?this._jumpButton(e,t):p}
        ${r.predicted&&m!=null?l`<span
              class="bf-predicted ${e.predicted_source==="trend"?"bf-trend":""} ${e.forecast_overdue?"bf-overdue":""} ${e.forecast_overdue&&e.status==="ok"?"bf-quiet":""}"
              title=${this._predictedTitle(e,t)}
              >${e.forecast_overdue?l`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:p}~${this._predictedDate(m)}</span
            >`:p}
        ${r.exclude&&u?l`<button
              class="bf-mark bf-exclude"
              title=${n("battery_fleet_exclude",t)}
              .disabled=${this._marking}
              @click=${()=>this._setExcluded(e.entity_id,!0)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`:p}
      </div>
      ${this._renderCellChooser(e,r.list,t)}
    `}render(){let e=this._lang;if(this._loading&&this._ov===null)return l`<div class="bf-card"><div class="bf-loading">…</div></div>`;let t=this._ov;if(!t)return this._error?l`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:p;let r=t.low.length;return l`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${n("battery_fleet_title",e)}</span>
          <span class="bf-count ${r?"bad":"ok"}">${r}</span>
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

        ${r===0?l`<div class="bf-empty">${n("battery_fleet_none_low",e)}</div>`:l`
              <div class="bf-shopping">
                <span class="bf-label">${n("battery_fleet_buy_now",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${t.low.map(o=>this._renderRow(o,e,{list:"low",recharge:!0,mark:"always",exclude:!0}))}
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
                ${t.charging.map(o=>l`<span class="bf-charge-item">
                    <span class="bf-charge-name">${o.name}</span>
                    <span>${n("battery_fleet_ready",e).replace("{count}",S(o.stock,e))}</span>
                    ${o.restoring>0?l`<span class="bf-charge-waiting">${xa(o.reuse,o.restoring,e)}</span>
                          ${this._canWrite?l`<button
                                class="bf-charged"
                                title=${n("part_ready_again_hint",e)}
                                .disabled=${this._marking}
                                @click=${()=>this._act({type:"maintenance_supporter/part/ready_again",entry_id:t.entry_id,part_id:o.part_id})}
                              ><ha-icon icon="mdi:battery-charging-100"></ha-icon>${n(`part_reuse_${o.reuse}`,e)}</button>
                              ${this._renderDispose(t.entry_id,o,e)}`:p}`:p}
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
                ${t.soon.map(o=>this._renderRow(o,e,{list:"soon",mark:"replaced",predicted:!0}))}
              </div>
            `:p}
        ${t.all?.length?l`
              ${ue({cls:"bf-roster",open:this._rosterOpen(),onToggle:this._loadHistory,header:l`${n("battery_fleet_all",e)} (${t.all.length})`},l`
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
                  ${this._sortedRoster(t.all).map(o=>this._renderRow(o,e,{list:"roster",status:!0,recharge:!0,sparkline:!0,mark:"replaced",jump:!0,predicted:!0,exclude:!0}))}
                </div>
                <div class="bf-roster-hint">${n("battery_fleet_all_hint",e)}</div>
                ${this._canWrite?this._renderRosterSettings(t,e):p}
              `)}
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
                ${j({cls:"bf-track-self",checked:!!e.track_self_charging,disabled:this._marking,onChange:this._setTrackSelf},l`${n("battery_fleet_track_self",t)}`)}
                <div class="bf-roster-hint">${n("battery_fleet_track_self_hint",t)}</div>
                ${j({cls:"bf-track-self bf-due-nosensor",checked:e.due_without_sensor!==!1,disabled:this._marking,onChange:this._setDueWithoutSensor},l`${n("battery_fleet_due_without_sensor",t)}`)}
                <div class="bf-roster-hint">${n("battery_fleet_due_without_sensor_hint",t)}</div>
                ${j({cls:"bf-track-self bf-ask-cells",checked:!!e.ask_cells,disabled:this._marking,onChange:this._setAskCells},l`${n("battery_fleet_ask_cells",t)}`)}
                <div class="bf-roster-hint">${n("battery_fleet_ask_cells_hint",t)}</div>
    `}_renderExcluded(e,t){return l`
        ${e.excluded?.length?l`
              <div class="bf-excluded">
                <span class="bf-label">${n("battery_fleet_excluded",t)}</span>
                ${e.excluded.map(r=>l`
                    <span class="bf-excluded-chip">
                      ${r.device_name}
                      ${this._canWrite?l`<button
                            class="bf-mark"
                            title=${n("battery_fleet_include",t)}
                            .disabled=${this._marking}
                            @click=${()=>this._setExcluded(r.entity_id,!1)}
                          >
                            <ha-icon icon="mdi:eye-outline"></ha-icon>
                          </button>`:p}
                    </span>
                  `)}
              </div>
            `:p}
    `}};B.styles=$`
    /* The query container of the row layout (see "In a narrow list" below):
     * the list's own width, not the screen's. */
    .bf-card {
      container: bf-fleet / inline-size;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color);
      border-radius: var(--ms-radius-10, 10px);
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
      border-radius: var(--ms-radius-10, 10px);
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
      border-radius: var(--ms-radius-10, 10px);
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
      border-radius: var(--ms-radius-6, 6px);
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
      border-radius: var(--ms-radius-10, 10px);
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
  `,d([b({attribute:!1})],B.prototype,"hass",2),d([b({type:Boolean})],B.prototype,"flat",2),d([h()],B.prototype,"_ov",2),d([h()],B.prototype,"_loading",2),d([h()],B.prototype,"_marking",2),d([h()],B.prototype,"_choosing",2),d([h()],B.prototype,"_error",2),d([h()],B.prototype,"_disposeFor",2),d([h()],B.prototype,"_disposeQty",2),d([h()],B.prototype,"_history",2),d([h()],B.prototype,"_rosterSort",2),d([h()],B.prototype,"_typeFilter",2),d([h()],B.prototype,"_recorded",2),d([h()],B.prototype,"_access",2);var Ms=B;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",Ms);var Lt=class extends T{constructor(){super(...arguments);this._config={type:"custom:maintenance-battery-fleet-card"}}static getStubConfig(){return{type:"custom:maintenance-battery-fleet-card"}}setConfig(e){this._config=e}getCardSize(){return 6}render(){return this.hass?l`
      <ha-card .header=${this._config.title||void 0}>
        <div class="content">
          <maintenance-battery-fleet-section flat .hass=${this.hass}></maintenance-battery-fleet-section>
        </div>
      </ha-card>
    `:p}};Lt.styles=$`
    ha-card {
      overflow: hidden;
    }
    .content {
      padding: 12px 16px 14px;
    }
  `,d([b({attribute:!1})],Lt.prototype,"hass",2),d([h()],Lt.prototype,"_config",2);customElements.get("maintenance-battery-fleet-card")||customElements.define("maintenance-battery-fleet-card",Lt);Et({type:"maintenance-battery-fleet-card",name:"Battery Fleet",description:"All tracked batteries: what is low now, what runs out soon, and what to buy.",preview:!1});ye();I();z();var sn=["today","dashboard","calendar","settings"];P();var Wt="maintenance-supporter-panel-card",nn="maintenance-supporter-panel",an="maintenance-supporter",on=870,Np=320,jp=480;function Dp(i){let e=i?.panels?.[an]?.config?._panel_custom?.module_url;return typeof e=="string"&&e.startsWith("/")?e:null}function qp(i){if(i==null||i===""||i==="fill")return null;if(typeof i=="number")return i>0?`${Math.round(i)}px`:null;let s=String(i).trim();return/^\d+(\.\d+)?$/.test(s)?`${s}px`:s||null}var ln=class extends HTMLElement{constructor(){super();this._config={type:`custom:${Wt}`};this._panel=null;this._loading=null;this._observer=null;this._lastWidth=-1;this._preview=!1;this._onResize=()=>this._layout(!0);let e=this.attachShadow({mode:"open"}),t=document.createElement("style");t.textContent=`
      :host { display: block; box-sizing: border-box; overflow: hidden; border-radius: var(--ha-card-border-radius, 12px); }
      .status { padding: 16px; color: var(--secondary-text-color); font-size: 14px; }
      ${nn} { display: block; height: 100%; }
    `,e.appendChild(t),this._status=document.createElement("div"),this._status.className="status",this._status.hidden=!0,e.appendChild(this._status)}static getConfigElement(){return document.createElement("maintenance-supporter-panel-card-editor")}static getStubConfig(){return{type:`custom:${Wt}`}}set preview(e){this._preview=!!e,this._layout(!0)}get preview(){return this._preview}_inEditorPreview(){if(this._preview)return!0;let e=this;for(let t=0;e&&t<40;t++){let r=e;if(r.tagName==="HUI-CARD-PREVIEW"||r.tagName==="HUI-DIALOG-EDIT-CARD")return!0;e=r.parentElement??r.getRootNode().host??null}return!1}setConfig(e){this._config={...e},this._panel&&(this._panel.presets=this._presets()),this._layout(!0)}getCardSize(){return 12}getGridOptions(){return{columns:"full",rows:"auto"}}set hass(e){this._hass=e,this._panel?this._panel.hass=e:this._mount()}get hass(){return this._hass}connectedCallback(){typeof ResizeObserver<"u"&&!this._observer&&(this._observer=new ResizeObserver(()=>this._layout(!1)),this._observer.observe(this)),window.addEventListener("resize",this._onResize),this._layout(!0),this._hass&&this._mount()}disconnectedCallback(){this._observer?.disconnect(),this._observer=null,window.removeEventListener("resize",this._onResize)}_presets(){let e={};return sn.includes(this._config.tab??"")&&(e.tab=this._config.tab),typeof this._config.view=="string"&&this._config.view.trim()&&(e.view=this._config.view.trim()),e}_setStatus(e){this._status.textContent=e,this._status.hidden=!1}async _mount(){if(this._panel||this._loading||!this._hass||!this.isConnected)return;let e=N(this._hass);if(!customElements.get(nn)){let r=Dp(this._hass);if(!r){this._setStatus(n("panel_card_not_registered",e));return}this._loading=import(r).then(()=>{},()=>{throw this._setStatus(n("panel_card_load_failed",e)),new Error("panel bundle failed to load")});try{await this._loading}catch{return}finally{this._loading=null}if(this._panel||!this._hass||!this.isConnected)return}let t=document.createElement(nn);t.embedded=!0,t.panel=this._hass.panels?.[an]??{url_path:an},t.presets=this._presets(),t.narrow=this._narrow(),t.hass=this._hass,this._status.hidden=!0,this.shadowRoot.appendChild(t),this._panel=t,this._layout(!0)}_narrow(){let e=this.getBoundingClientRect().width;return e>0?e<on:window.innerWidth<on}_layout(e){let t=this.getBoundingClientRect(),r=Math.round(t.width)!==this._lastWidth;if(!e&&!r)return;this._lastWidth=Math.round(t.width),this._panel&&t.width>0&&(this._panel.narrow=t.width<on);let o=qp(this._config.height);if(o){this.style.height=o;return}if(!this.isConnected)return;if(this._inEditorPreview()){this.style.height=`${jp}px`;return}let a=Math.max(0,this._unscrolledTop(t)),c=Math.max(Np,Math.floor(window.innerHeight-a));this.style.height=`${c}px`}_unscrolledTop(e){let t=e.top+window.scrollY,r=this.ownerDocument,o=this.parentElement??this.getRootNode().host??null;for(let a=0;o&&a<100;a++){let c=o;c!==r.documentElement&&c!==r.body&&typeof c.scrollTop=="number"&&c.scrollTop>0&&(t+=c.scrollTop),o=c.parentElement??c.getRootNode().host??null}return t}},pt=class extends T{constructor(){super(...arguments);this._config={type:`custom:${Wt}`};this._views=[];this._viewsLoaded=!1}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._viewsLoaded&&(this._viewsLoaded=!0,this._loadViews())}async _loadViews(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._views=e?.views||[]}catch{this._views=[]}}_set(e,t){let r={...this._config};t===""||t===void 0?delete r[e]:r[e]=t,this._config=r,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r},bubbles:!0,composed:!0}))}render(){let e=N(this.hass),t=r=>n(r==="today"?"tab_today":r==="calendar"?"tab_calendar":r,e);return l`
      <div class="editor">
        <div class="field">
          <div class="field-label">${n("panel_card_tab",e)}</div>
          <select class="tab-select" .value=${this._config.tab||""} @change=${r=>this._set("tab",r.target.value)}>
            <option value="" ?selected=${!this._config.tab}>${n("panel_card_tab_default",e)}</option>
            ${sn.map(r=>l`<option value=${r} ?selected=${this._config.tab===r}>${t(r)}</option>`)}
          </select>
        </div>
        ${this._views.length>0?l`<div class="field">
              <div class="field-label">${n("panel_card_view",e)}</div>
              <select class="view-select" .value=${this._config.view||""} @change=${r=>this._set("view",r.target.value)}>
                <option value="" ?selected=${!this._config.view}>${n("card_saved_view_none",e)}</option>
                ${this._views.map(r=>l`<option value=${r.id} ?selected=${this._config.view===r.id||this._config.view===r.name}>${r.name}</option>`)}
              </select>
            </div>`:p}
        <div class="field">
          <div class="field-label">${n("panel_card_height",e)}</div>
          <input class="height-input" type="text" placeholder="fill"
            .value=${this._config.height===void 0?"":String(this._config.height)}
            @change=${r=>this._set("height",r.target.value.trim())} />
          <div class="field-help">${n("panel_card_height_help",e)}</div>
        </div>
      </div>
    `}};pt.styles=$`
    .editor { display: flex; flex-direction: column; gap: 16px; padding: 16px; }
    input.height-input { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; box-sizing: border-box; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 13px; color: var(--secondary-text-color); font-weight: 500; }
    .field-help { font-size: 12px; color: var(--secondary-text-color); }
    select { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; }
  `,d([b({attribute:!1})],pt.prototype,"hass",2),d([h()],pt.prototype,"_config",2),d([h()],pt.prototype,"_views",2);customElements.get(Wt)||customElements.define(Wt,ln);customElements.get("maintenance-supporter-panel-card-editor")||customElements.define("maintenance-supporter-panel-card-editor",pt);Et({type:Wt,name:"Maintenance Supporter \u2014 Panel",description:"The complete Maintenance Supporter panel as a card \u2014 for a panel view / dashboard subview without the sidebar entry.",preview:!1});Xi();var Wl=2,Q=class extends T{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._globalRowStyle="buttons_compact";this._settings=It;this._firstLoadDone=!1;this._objects=[];this._stats=null;this._unsub=null;this._viewFilters=null;this._userNames={};this._userPersons={};this._userService=null;this._userNamesLoaded=!1;this._taskDocs={};this._docsLoadedFor=new Set;this._dataLoaded=!1;this._lastConnection=null;this._subGen=0;this._onCompleted=async e=>{await this._loadData();let t=e.detail;t?.undo&&ot(this,this.hass,t,this._lang,()=>{this._loadData()})}}get _lang(){return N(this.hass)}static getConfigElement(){return document.createElement("maintenance-supporter-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-card",show_header:!0,show_actions:!0,filter_status:[...Ur],max_items:10}}setConfig(e){let t=e.view_id!==this._config.view_id;this._config=e,t&&this._dataLoaded&&this.hass&&this._loadViewFilters()}getCardSize(){return 3}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._subGen++,this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null}updated(e){if(super.updated(e),zi(this,e),this.hass&&!this._userNamesLoaded&&this._config.show_assignee!==!1&&this._objects.some(t=>t.tasks.some(r=>ti(r).length>0))&&this._loadUserNames(),this.hass&&this._config.show_documents!==!1)for(let t of this._objects)this._docsLoadedFor.has(t.entry_id)||t.tasks.some(r=>(r.document_count??0)>0)&&this._loadDocuments(t.entry_id);if(e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){te(this.hass).then(t=>{this._settings=t,this._globalRowStyle=t.rowActionStyle}).catch(()=>{});let e=this._loadViewFilters();try{let[t,r]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);await e,this._objects=ei(t.objects),this._stats=r,Fi(this._stats.budget)}catch{}await e,this._firstLoadDone=!0}_assigneeName(e){return this._config.show_assignee===!1?"":ti(e).map(t=>this._userNames[t]).filter(Boolean).join(", ")}_assigneeAvatars(e){return No(ti(e).map(t=>this._userPersons[t]))}async _loadUserNames(){this._userNamesLoaded=!0,this._userService?this._userService.updateHass(this.hass):this._userService=new Tt(this.hass);try{let e=await this._userService.getUsers();this._userPersons=Object.fromEntries(e.map(t=>[t.id,er(t)])),this._userNames=Object.fromEntries(e.map(t=>[t.id,t.name]))}catch{}}async _loadDocuments(e){this._docsLoadedFor.add(e);try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:e}),r={};for(let o of t.documents||[])if(!Co(o))for(let a of o.task_ids||[])(r[a]||=[]).push({id:o.id,title:o.title,kind:o.kind,url:o.url});this._taskDocs={...this._taskDocs,[e]:r}}catch{}}_docsFor(e,t){if(this._config.show_documents===!1)return[];let o=[...this._taskDocs[e]?.[t.id]||[]];return t.documentation_url&&o.push({id:`url:${t.id}`,title:n("documentation_label",this._lang),kind:"weblink",url:t.documentation_url}),o}_renderDocChips(e,t){let r=this._docsFor(e,t);if(!r.length)return p;let o=r.slice(Wl);return l`<div class="doc-chips">
      ${r.slice(0,Wl).map(a=>l`
        <button
          type="button"
          class="doc-chip"
          title="${a.title}"
          @click=${c=>{c.stopPropagation(),this._openDoc(a)}}
        >
          <ha-icon icon=${a.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
          <span>${a.title}</span>
        </button>
      `)}
      ${o.length?l`<span class="doc-chip doc-more" title="${o.map(a=>a.title).join(`
`)}">+${o.length}</span>`:p}
    </div>`}async _openDoc(e){if(e.kind==="weblink"&&e.url){$t(e.url)&&window.open(e.url,"_blank","noopener");return}try{await So(this.hass,e.id)}catch{}}async _loadViewFilters(){if(!this._config.view_id){this._viewFilters=null;return}try{let t=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"})).views||[]).find(r=>r.id===this._config.view_id);this._viewFilters=t?t.filters:null}catch{this._viewFilters=null}}async _subscribe(){let e=++this._subGen;try{let t=await this.hass.connection.subscribeMessage(r=>{let o=Rn(this._objects,r);o!==null&&(this._objects=o)},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected||e!==this._subGen){t();return}this._unsub=t}catch{}}get _selectedTasks(){let e=[],{filter_status:t,filter_objects:r,entity_ids:o,filter_due_min_days:a,filter_due_max_days:c,filter_labels:u,filter_priority:_,filter_areas:m}=this._config,f=o?.length?new Set(o):null,v=a!==void 0||c!==void 0,w=this._viewFilters,A=w?.user_id==="current_user"?this.hass.user?.id??null:w?.user_id??null;for(let k of this._objects)if(!(w?.place&&(k.object.place||"home")!==w.place)&&!(r?.length&&!r.includes(k.entry_id)&&!r.includes(k.object.name))){if(m?.length){let E=k.object.area_id;if(!E||!m.includes(E))continue}for(let E of k.tasks)if(!E.is_done&&!(E.archived||k.object.archived)&&!(t?.length&&!t.includes(E.status))&&!(u?.length&&!(E.labels||[]).some(y=>u.includes(y)))&&!(_?.length&&!_.includes(E.priority||"normal"))&&!(f&&!(E.sensor_entity_id&&f.has(E.sensor_entity_id)||E.binary_sensor_entity_id&&f.has(E.binary_sensor_entity_id)))){if(v){let y=E.days_until_due;if(y==null||a!==void 0&&y<a||c!==void 0&&y>c)continue}w&&(w.status&&E.status!==w.status||w.label&&!(E.labels||[]).includes(w.label)||w.priority&&(E.priority||"normal")!==w.priority||A&&!Pn(E,A))||e.push({entry_id:k.entry_id,object_name:k.object.name,task:E})}}return e.sort((k,E)=>{let y=Br(k.task.status)-Br(E.task.status);return y!==0?y:(k.task.days_until_due??1/0)-(E.task.days_until_due??1/0)}),e}_openComplete(e,t,r=!1){if(!r&&ee(t)){this._quickComplete(e,t);return}let o=this.shadowRoot.querySelector("maintenance-complete-dialog");or(o,nr({entryId:e,taskId:t.id,taskName:t.name,task:t,objects:this._objects,lang:this._lang,features:this._settings.features,currencySymbol:st(this._stats?.budget),partsCostMode:this._settings.partsCostMode}),this._lang)}async _quickComplete(e,t){let r=await Qi(this.hass,e,t.id,this._lang);if(r.result==="dialog"){this._openComplete(e,t,!0);return}if(r.result==="failed"||r.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:r.message},bubbles:!0,composed:!0}));return}await this._loadData(),r.undo?ot(this,this.hass,{entryId:e,taskId:t.id,taskName:t.name},this._lang,()=>{this._loadData()}):this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:n("quick_complete_success",this._lang)},bubbles:!0,composed:!0}))}_headerCounts(e){let t={overdue:0,due_soon:0,triggered:0};for(let{task:r}of e)qn(r.status)&&(t[r.status]+=1);return t}_openTaskDetail(e,t){rn(e,t)}render(){let e=this._lang,t=this._config.title||n("maintenance",e),r=this._config.show_header!==!1,o=(this._config.action_style??(this._globalRowStyle==="icons"?"icons":"buttons"))==="buttons",a=this._config.show_actions!==!1,c=(this._config.show_create??a)&&fe(this.hass?.user,this._settings.access),u=this._config.compact||!1,_=this._selectedTasks,{max_items:m}=this._config,f=m&&m>0?_.slice(0,m):_,v=this._objects.length||this._stats?this._headerCounts(_):null;return l`
      <ha-card>
        <div class="card-header">
          <h1>${t}</h1>
          <div class="header-right">
            ${r&&v?l`
                  <div class="header-stats">
                    ${v.overdue>0?l`<span class="badge overdue">${v.overdue}</span>`:p}
                    ${v.due_soon>0?l`<span class="badge due_soon">${v.due_soon}</span>`:p}
                    ${v.triggered>0?l`<span class="badge triggered">${v.triggered}</span>`:p}
                  </div>
                `:p}
            ${c?l`
                  <ha-icon-button
                    class="hdr-add"
                    title="${n("new_object",e)}"
                    @click=${()=>en()}
                  >
                    <ha-icon icon="mdi:plus-box"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button
                    class="hdr-add"
                    title="${n("add_task",e)}"
                    @click=${()=>tn("",this._objects)}
                  >
                    <ha-icon icon="mdi:playlist-plus"></ha-icon>
                  </ha-icon-button>
                `:p}
          </div>
        </div>
        ${this._firstLoadDone?f.length===0?this._objects.some(w=>w.tasks.length>0)?l`<div class="empty-card">
                <!-- (#86) tasks exist but none match the filter (default:
                     actionable-only) — "all caught up", NOT "no tasks yet". -->
                <div class="all-caught-up">✓ ${n("card_all_caught_up",e)}</div>
              </div>`:l`<div class="empty-card">
                <div>${n("card_no_tasks_title",e)}</div>
                <a class="empty-link" href="/maintenance-supporter">${n("card_no_tasks_cta",e)}</a>
              </div>`:l`
              <div class="task-list ${u?"compact":""}">
                ${f.map(({entry_id:w,object_name:A,task:k})=>l`
                    <div class="task-item clickable"
                         @click=${()=>this._openTaskDetail(w,k.id)}
                         title="${n("open_task",e)}">
                      <div class="status-dot" style="background: ${Pt(k)}"></div>
                      <div class="task-info">
                        <div class="task-name">
                          ${u&&this._assigneeName(k)?l`<span class="compact-assignee" title="${this._assigneeName(k)}">${this._assigneeAvatars(k)}</span>`:p}${k.name}${jo(k.next_event_titles)}${Do(k.trigger_detail)}
                          ${k.due_override?l`<ha-icon
                                class="postponed-icon"
                                icon="mdi:calendar-clock"
                                title="${n("postponed",e)}"
                              ></ha-icon>`:p}
                        </div>
                        ${u?p:l`<div class="task-meta">
                              ${A} · ${n(k.type,e)}${Ue(k)?l` · ${Ue(k)}`:p}${this._assigneeName(k)?l` · <span class="assignee"
                                    >${this._assigneeAvatars(k)}${this._assigneeName(k)}</span
                                  >`:p}
                            </div>`}
                      </div>
                      ${this._renderDocChips(w,k)}
                      <div class="task-due">
                        ${k.days_until_due!==null&&k.days_until_due!==void 0?k.days_until_due<0?l`<span class="overdue-text">${bt(k.days_until_due,e)}</span>`:bt(k.days_until_due,e):k.trigger_active?"\u26A1":ia(k.last_performed,e)??"\u2014"}
                      </div>
                      ${a&&qi(k)?l`<span class="inert-label">${n(k.enabled===!1?"disabled":"paused",e)}</span>`:a&&o?l`
                            <ha-button
                              size="small"
                              appearance="accent"
                              variant="success"
                              class="complete-btn-text"
                              title="${ee(k)?n("qr_action_quick_complete",e):n("complete",e)}"
                              @click=${E=>{E.stopPropagation(),this._openComplete(w,k)}}
                            >
                              <ha-icon slot="start" icon="mdi:check"></ha-icon>${n("complete",e)}
                            </ha-button>
                          `:a?l`
                            <ha-icon-button
                              class="complete-btn${ee(k)?" quick":""}"
                              title="${ee(k)?n("qr_action_quick_complete",e):n("complete",e)}"
                              @click=${E=>{E.stopPropagation(),this._openComplete(w,k)}}
                            >
                              <!-- #233: an open circle to tick off; a check read as done already -->
                              <ha-icon icon=${ee(k)?"mdi:checkbox-blank-circle-outline":"mdi:check"}></ha-icon>
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
    `}};Q.styles=[Gi,$`
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
      /* #234: compact rows have no meta line — the person sits before the
         task as their avatar (the name in the tooltip), so a row stays one
         line. */
      .compact-assignee {
        margin-inline-end: 6px;
      }
      /* #234: Complete sized to a compact row */
      .task-list.compact .complete-btn {
        --ha-icon-button-size: 28px;
        --mdc-icon-button-size: 28px;
      }
      .task-list.compact .complete-btn-text {
        --ha-button-height: 28px;
        --wa-form-control-padding-inline: 8px;
        min-width: 0;
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
        border-radius: var(--ms-radius-10, 10px);
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
      /* In the button's place on a task nothing may be done to (paused, off). */
      .inert-label { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; flex: none; }
    `],d([b({attribute:!1})],Q.prototype,"hass",2),d([h()],Q.prototype,"_config",2),d([h()],Q.prototype,"_globalRowStyle",2),d([h()],Q.prototype,"_settings",2),d([h()],Q.prototype,"_firstLoadDone",2),d([h()],Q.prototype,"_objects",2),d([h()],Q.prototype,"_stats",2),d([h()],Q.prototype,"_unsub",2),d([h()],Q.prototype,"_viewFilters",2),d([h()],Q.prototype,"_userNames",2),d([h()],Q.prototype,"_taskDocs",2);customElements.get("maintenance-supporter-card")||customElements.define("maintenance-supporter-card",Q);Et({type:"maintenance-supporter-card",name:"Maintenance Supporter",description:"Overview of your maintenance tasks with quick actions.",preview:!0});Xi();Ro(["maintenance-supporter-card","maintenance-battery-fleet-card","maintenance-supporter-panel-card"],import.meta.url);export{Q as MaintenanceSupporterCard};
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
lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
